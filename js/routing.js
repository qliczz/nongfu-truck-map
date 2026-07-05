/**
 * 路径规划 & 费用计算模块 v6
 * - 使用高德地图导航 v5 API（车道级详细路径），OSRM 降级备用
 * - 新增高德货车专用导航 API（自动规避限行/禁行区域）
 * - 自动计算高速 ETC 费用（6轴重卡费率）
 * - 自动计算充电费用 & 充电停靠方案
 * - 方向感知充电站推荐（服务区去程/返程方向匹配）
 * - 支持多途经点路径规划
 */

const RoutePlanner = {

    OSRM_BASE: 'https://router.project-osrm.org/route/v1/driving/',
    AMAP_BASE: 'https://restapi.amap.com/v5/direction/driving',
    AMAP_TRUCK_BASE: 'https://restapi.amap.com/v5/direction/truck',
    AMAP_DEFAULT_KEY: 'YOUR_AMAP_KEY',

    /**
     * 获取高德API Key（优先 localStorage 自定义值，否则用内置默认Key）
     */
    getAmapKey() {
        return localStorage.getItem('amap_api_key') || this.AMAP_DEFAULT_KEY;
    },

    /**
     * 设置高德API Key
     */
    setAmapKey(key) {
        if (key) {
            localStorage.setItem('amap_api_key', key);
        } else {
            localStorage.removeItem('amap_api_key');
        }
    },

    /**
     * 规划路径
     * 优先使用高德API，降级到OSRM
     * @param {Array} waypoints - [[lng,lat],...] WGS-84 坐标数组
     * @param {string} routeMode - highway|national|shortest
     * @param {boolean} truckMode - 是否使用货车专用导航（规避限行禁行）
     * @returns {Promise<Object>} 路径结果
     */
    async planRoute(waypoints, routeMode = 'highway', truckMode = false) {
        if (waypoints.length < 2) {
            throw new Error('至少需要两个途经点');
        }

        const amapKey = this.getAmapKey();

        // 货车模式：优先使用高德货车导航API
        if (amapKey && truckMode) {
            try {
                return await this.planRouteTruck(waypoints, amapKey, routeMode);
            } catch (err) {
                console.warn('高德货车导航失败，降级到普通导航:', err.message);
            }
        }

        // 优先使用高德导航
        if (amapKey) {
            try {
                return await this.planRouteAmap(waypoints, amapKey, routeMode);
            } catch (err) {
                console.warn('高德导航失败，降级到OSRM:', err.message);
            }
        }

        // 降级到 OSRM
        return this.planRouteOSRM(waypoints);
    },

    /**
     * 高德导航 v5 API 路径规划
     * 高德使用 GCJ-02 坐标，需要先转换
     * v5 API 提供更详细的路径数据和实时过路费
     * @param {Array} waypoints - [[lng,lat],...] WGS-84 坐标数组（支持多途经点）
     * @param {string} apiKey - 高德API Key
     * @param {string} routeMode - highway|national|shortest
     * @returns {Promise<Object>} 路径结果
     */
    async planRouteAmap(waypoints, apiKey, routeMode) {
        // WGS-84 → GCJ-02
        const gcjWaypoints = waypoints.map(c => CoordTransform.wgs84togcj02(c[0], c[1]));

        const origin = `${gcjWaypoints[0][0]},${gcjWaypoints[0][1]}`;
        const destination = `${gcjWaypoints[gcjWaypoints.length - 1][0]},${gcjWaypoints[gcjWaypoints.length - 1][1]}`;

        // 途经点（中间点，v5最多支持16个途经点）
        let wayptsStr = '';
        if (gcjWaypoints.length > 2) {
            wayptsStr = gcjWaypoints.slice(1, -1).map(c => `${c[0]},${c[1]}`).join(';');
        }

        // 高德 v5 策略：0=速度优先(高速优先) / 1=费用优先(不走收费路) / 2=距离优先 / 3=不走高速
        // 国道模式用 strategy=1（费用优先/不走收费路），比 strategy=3 更可靠地避开高速
        let strategy = 0;
        if (routeMode === 'highway') strategy = 0;   // 速度优先，优先走高速
        if (routeMode === 'national') strategy = 1;   // 费用优先（不走收费路=基本不走高速）
        if (routeMode === 'shortest') strategy = 2;   // 距离优先（最短）

        const params = new URLSearchParams({
            origin: origin,
            destination: destination,
            key: apiKey,
            strategy: strategy,
            show_fields: 'cost,polyline,navigation',  // v5: 获取费用+路径+导航指令
            nosteps: 0,                                 // 返回详细步骤
            output: 'JSON'
        });
        if (wayptsStr) params.set('waypoints', wayptsStr);

        const url = `${this.AMAP_BASE}?${params.toString()}`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.status !== '1' || !data.route || !data.route.paths || !data.route.paths.length) {
            const errMsg = data.info || '高德导航请求失败';
            throw new Error(errMsg);
        }

        const path = data.route.paths[0];

        // 解析所有步骤的坐标点
        const allCoords = [];
        const steps = path.steps || [];
        for (const step of steps) {
            const poly = step.polyline; // "lng1,lat1;lng2,lat2;..."
            const points = poly.split(';').map(p => {
                const [lng, lat] = p.split(',').map(Number);
                return [lng, lat]; // GCJ-02
            });
            allCoords.push(...points);
        }

        // 去重连续重复点
        const dedupCoords = [];
        for (const c of allCoords) {
            const last = dedupCoords[dedupCoords.length - 1];
            if (!last || last[0] !== c[0] || last[1] !== c[1]) {
                dedupCoords.push(c);
            }
        }

        // GCJ-02 → WGS-84（统一输出 WGS-84，由 app.js 转换显示）
        const wgsCoords = CoordTransform.gcj02ArrayToWgs84(dedupCoords);

        // v5: 过路费在 path.cost.tolls 中
        const cost = path.cost || {};
        const tolls = parseFloat(cost.tolls) || 0;
        const tollDistance = parseFloat(cost.toll_distance) || 0;

        return {
            distance: parseFloat(path.distance),  // 米
            duration: parseFloat(path.duration),   // 秒
            geometry: { type: 'LineString', coordinates: wgsCoords },
            legs: [],
            engine: 'amap',
            tolls: tolls,
            tollDistance: tollDistance,
            strategy: strategy,
            steps: steps  // 保留导航步骤用于详细指令
        };
    },

    /**
     * 高德货车专用导航 v5 API
     * 自动规避货车限行路段、禁行区域、桥梁限重等
     * @param {Array} waypoints - [[lng,lat],...] WGS-84 坐标数组
     * @param {string} apiKey - 高德API Key
     * @param {string} routeMode - highway|national|shortest
     * @returns {Promise<Object>} 路径结果
     */
    async planRouteTruck(waypoints, apiKey, routeMode) {
        const gcjWaypoints = waypoints.map(c => CoordTransform.wgs84togcj02(c[0], c[1]));

        const origin = `${gcjWaypoints[0][0]},${gcjWaypoints[0][1]}`;
        const destination = `${gcjWaypoints[gcjWaypoints.length - 1][0]},${gcjWaypoints[gcjWaypoints.length - 1][1]}`;

        let wayptsStr = '';
        if (gcjWaypoints.length > 2) {
            wayptsStr = gcjWaypoints.slice(1, -1).map(c => `${c[0]},${c[1]}`).join(';');
        }

        // 货车导航策略：0=推荐 / 1=不走高速 / 2=距离优先
        let strategy = 0;
        if (routeMode === 'highway') strategy = 0;
        if (routeMode === 'national') strategy = 1;
        if (routeMode === 'shortest') strategy = 2;

        // 从 MAP_DATA 获取货车参数
        const tc = (typeof MAP_DATA !== 'undefined') ? MAP_DATA.truckConfig : { axles: 6, maxWeight: 49, totalLength: 18.1 };
        // 车型尺寸代码：0=微型(车长<3.8m) / 1=小型(3.8-4.5m) / 2=中型(4.5-6m) / 3=大型(6-8m) / 4=特大型(8-15m) / 5=超大型(>15m)
        // 13.75m半挂+车头总长约18m → 选5
        const truckSize = 5;

        const params = new URLSearchParams({
            origin: origin,
            destination: destination,
            key: apiKey,
            strategy: strategy,
            size: truckSize,         // 车型尺寸
            weight: tc.maxWeight,     // 车辆总重（吨）
            axle: tc.axles,           // 轴数
            length: Math.round(tc.totalLength * 10),  // 车长（0.1米为单位）
            width: 255,               // 车宽（0.1米为单位，2.55m标准半挂宽）
            height: 40,               // 车高（0.1米为单位，4.0m标准重卡高）
            show_fields: 'cost,polyline,navigation',
            nosteps: 0,
            output: 'JSON'
        });
        if (wayptsStr) params.set('waypoints', wayptsStr);

        const url = `${this.AMAP_TRUCK_BASE}?${params.toString()}`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.status !== '1' || !data.route || !data.route.paths || !data.route.paths.length) {
            const errMsg = data.info || '高德货车导航请求失败';
            throw new Error(errMsg);
        }

        const path = data.route.paths[0];

        // 解析坐标
        const allCoords = [];
        const steps = path.steps || [];
        for (const step of steps) {
            const poly = step.polyline;
            if (!poly) continue;
            const points = poly.split(';').map(p => {
                const [lng, lat] = p.split(',').map(Number);
                return [lng, lat];
            });
            allCoords.push(...points);
        }

        const dedupCoords = [];
        for (const c of allCoords) {
            const last = dedupCoords[dedupCoords.length - 1];
            if (!last || last[0] !== c[0] || last[1] !== c[1]) {
                dedupCoords.push(c);
            }
        }

        const wgsCoords = CoordTransform.gcj02ArrayToWgs84(dedupCoords);

        const cost = path.cost || {};
        const tolls = parseFloat(cost.tolls) || 0;
        const tollDistance = parseFloat(cost.toll_distance) || 0;

        // 检测限行规避信息
        let restrictionWarnings = [];
        if (data.route && data.route.trestriction) {
            restrictionWarnings = data.route.trestriction;
        }

        return {
            distance: parseFloat(path.distance),
            duration: parseFloat(path.duration),
            geometry: { type: 'LineString', coordinates: wgsCoords },
            legs: [],
            engine: 'amap-truck',
            tolls: tolls,
            tollDistance: tollDistance,
            strategy: strategy,
            steps: steps,
            truckMode: true,
            restrictionWarnings: restrictionWarnings
        };
    },

    /**
     * OSRM 路径规划（降级方案）
     */
    async planRouteOSRM(waypoints) {
        const coordStr = waypoints.map(c => `${c[0]},${c[1]}`).join(';');
        const url = `${this.OSRM_BASE}${coordStr}?overview=full&geometries=geojson&steps=true&annotations=distance,duration`;

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`OSRM 请求失败: ${resp.status}`);
            const data = await resp.json();

            if (data.code !== 'Ok' || !data.routes.length) {
                throw new Error('未找到可行路径');
            }

            const route = data.routes[0];
            return {
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry,
                legs: route.legs || [],
                engine: 'osrm'
            };
        } catch (err) {
            console.error('OSRM路径规划失败:', err);
            return this.fallbackRoute(waypoints);
        }
    },

    /**
     * 降级方案：用直线距离 * 弯曲系数估算
     */
    fallbackRoute(waypoints) {
        let totalDist = 0;
        const coords = [];

        for (let i = 0; i < waypoints.length - 1; i++) {
            const [lng1, lat1] = waypoints[i];
            const [lng2, lat2] = waypoints[i + 1];
            const d = this.haversine(lat1, lng1, lat2, lng2);
            totalDist += d;
        }

        const roadDist = totalDist * 1.3;
        const avgSpeed = 65;
        const duration = (roadDist / 1000) / avgSpeed * 3600;

        return {
            distance: roadDist,
            duration: duration,
            geometry: { type: 'LineString', coordinates: waypoints },
            legs: [],
            isFallback: true,
            engine: 'fallback'
        };
    },

    /**
     * 计算两点之间的方位角（0-360度，正北为0）
     * @returns {number} 方位角
     */
    calculateBearing(lat1, lng1, lat2, lng2) {
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;
        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        const θ = Math.atan2(y, x);
        return (θ * 180 / Math.PI + 360) % 360;
    },

    /**
     * 方位角转方向描述
     */
    bearingToDirection(bearing) {
        if (bearing >= 315 || bearing < 45) return '北行';
        if (bearing >= 45 && bearing < 135) return '东行';
        if (bearing >= 135 && bearing < 225) return '南行';
        return '西行';
    },

    /**
     * 判断站点方向是否匹配路线方向
     */
    isDirectionMatch(stationDirection, routeDirection) {
        if (!stationDirection || stationDirection === '不限' || stationDirection === '双向') return true;
        return stationDirection === routeDirection;
    },

    /**
     * 同时规划三种路线模式（高速/国道/最短），用于对比
     * @param {Array} waypoints - [[lng,lat],...] WGS-84 坐标数组
     * @param {boolean} truckMode - 是否使用货车专用导航
     * @returns {Promise<Object>} { results, errors } 三种模式结果
     */
    async planAllModes(waypoints, truckMode = false) {
        const modes = ['highway', 'national', 'shortest'];
        const results = {};
        const errors = {};

        await Promise.all(modes.map(async (mode) => {
            try {
                results[mode] = await this.planRoute(waypoints, mode, truckMode);
            } catch (err) {
                errors[mode] = err.message;
                console.warn(`模式 ${mode} 规划失败:`, err.message);
            }
        }));

        return { results, errors };
    },

    /**
     * Haversine 公式计算两点距离（米）
     */
    haversine(lat1, lng1, lat2, lng2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },

    /**
     * 计算 ETC 高速费用
     */
    calculateETC(distanceMeters, config = MAP_DATA.costConfig, routeMode = 'highway', amapTolls = 0) {
        const distanceKm = distanceMeters / 1000;

        // 如果高德API返回了过路费，直接使用
        if (amapTolls && amapTolls > 0 && routeMode !== 'national') {
            const baseCost = amapTolls;
            const discountedCost = Math.round(amapTolls * config.etcDiscount);
            return {
                distanceKm: distanceKm.toFixed(1),
                ratePerKm: (amapTolls / distanceKm).toFixed(2),
                etcCost: Math.round(baseCost),
                etcCostDiscounted: discountedCost,
                savings: Math.round(baseCost - discountedCost),
                source: '高德实时费率'
            };
        }

        // 国道模式：免高速费
        if (routeMode === 'national') {
            return {
                distanceKm: distanceKm.toFixed(1),
                ratePerKm: 0,
                etcCost: 0,
                etcCostDiscounted: 0,
                savings: 0,
                source: '国道免费'
            };
        }

        // 最短距离模式：假设80%走高速
        const highwayRatio = routeMode === 'shortest' ? 0.8 : 1.0;
        const highwayKm = distanceKm * highwayRatio;
        const baseCost = highwayKm * config.etcRatePerKm;
        const discountedCost = baseCost * config.etcDiscount;

        return {
            distanceKm: distanceKm.toFixed(1),
            ratePerKm: config.etcRatePerKm,
            etcCost: Math.round(baseCost),
            etcCostDiscounted: Math.round(discountedCost),
            savings: Math.round(baseCost - discountedCost),
            source: '估算费率'
        };
    },

    /**
     * 计算充电费用 & 充电停靠方案
     * 路线规划阶段用默认综合电价估算（平段价）
     * 实际充电费用以各站点的 pricePerKwh 和分时计费为准（在 calculateChargingCostWithTime 中精确计算）
     */
    calculateCharging(distanceMeters, truckConfig = MAP_DATA.truckConfig, costConfig = MAP_DATA.costConfig) {
        const distanceKm = distanceMeters / 1000;
        const totalEnergy = distanceKm * truckConfig.consumptionPerKm;
        const usableCapacity = truckConfig.batteryCapacity * (truckConfig.targetSOC - truckConfig.minSOC);
        const maxRangePerCharge = usableCapacity / truckConfig.consumptionPerKm;
        const chargingStops = Math.max(0, Math.ceil(distanceKm / maxRangePerCharge) - 1);
        const energyPerStop = Math.min(usableCapacity, totalEnergy / (chargingStops + 1));
        const effectivePower = truckConfig.chargingPower * truckConfig.chargingEfficiency;
        const chargingTimePerStop = energyPerStop / effectivePower;
        const totalChargingTime = chargingTimePerStop * chargingStops;

        // 路线规划用默认平段综合电价估算
        // 实际费用会在充电站详情中按站点实际电价 + 分时计费精确计算
        const avgPrice = costConfig.defaultPricePerKwh || 1.20;
        const totalChargingCost = totalEnergy * avgPrice;
        // 低谷/高峰参考范围：基于浙江分时电价倍率
        // 低谷=电费×0.4+服务费, 高峰=电费×1.85+服务费
        const estServiceFee = 0.40;
        const estElecBase = avgPrice - estServiceFee;
        const offPeakPrice = estElecBase * 0.4 + estServiceFee;
        const peakPrice = estElecBase * 1.85 + estServiceFee;
        const offPeakChargingCost = totalEnergy * offPeakPrice;
        const peakChargingCost = totalEnergy * peakPrice;

        return {
            distanceKm: distanceKm.toFixed(1),
            totalEnergy: Math.round(totalEnergy),
            consumptionPer100km: (truckConfig.consumptionPerKm * 100).toFixed(0),
            batteryCapacity: truckConfig.batteryCapacity,
            usableCapacity: Math.round(usableCapacity),
            maxRangePerCharge: Math.round(maxRangePerCharge),
            chargingStops: chargingStops,
            energyPerStop: Math.round(energyPerStop),
            chargingTimePerStop: chargingTimePerStop.toFixed(1),
            totalChargingTime: totalChargingTime.toFixed(1),
            chargingPower: truckConfig.chargingPower,
            avgChargingCost: Math.round(totalChargingCost),
            offPeakCost: Math.round(offPeakChargingCost),
            peakCost: Math.round(peakChargingCost),
            avgPricePerKWh: avgPrice.toFixed(2),
            costPerKm: (totalChargingCost / distanceKm).toFixed(2)
        };
    },

    /**
     * 综合费用汇总
     * @param {number} distanceMeters - 路径距离（米）
     * @param {Object} truckConfig - 车辆参数
     * @param {Object} costConfig - 费用参数
     * @param {string} routeMode - 路线模式
     * @param {Object} engineData - 引擎数据（含 tolls, engine, duration）
     */
    calculateTotal(distanceMeters, truckConfig = MAP_DATA.truckConfig, costConfig = MAP_DATA.costConfig, routeMode = 'highway', engineData = {}) {
        const amapTolls = engineData.tolls || 0;
        const etc = this.calculateETC(distanceMeters, costConfig, routeMode, amapTolls);
        const charging = this.calculateCharging(distanceMeters, truckConfig, costConfig);

        // 优先使用高德API返回的实际行驶时间，否则按模式估算
        let drivingHours;
        if (engineData.duration && engineData.duration > 0) {
            drivingHours = engineData.duration / 3600; // 秒 → 小时
        } else {
            const avgSpeed = routeMode === 'national' ? 45 : (routeMode === 'shortest' ? 55 : 70);
            drivingHours = (distanceMeters / 1000) / avgSpeed;
        }
        const totalHours = drivingHours + parseFloat(charging.totalChargingTime);
        const driverCost = totalHours * costConfig.driverWagePerHour;
        const tollCost = etc.etcCostDiscounted;
        const totalCost = tollCost + charging.avgChargingCost + driverCost;

        // 柴油对比
        const dieselConsumption = 35;
        const dieselPrice = 7.5;
        const dieselCost = (distanceMeters / 1000) / 100 * dieselConsumption * dieselPrice;
        const dieselTotal = dieselCost + tollCost + driverCost;

        return {
            etc,
            charging,
            distanceKm: (distanceMeters / 1000).toFixed(1),
            drivingTime: this.formatDuration(drivingHours * 3600),
            drivingHours: drivingHours.toFixed(1),
            totalHours: totalHours.toFixed(1),
            tollCost: Math.round(tollCost),
            driverCost: Math.round(driverCost),
            totalCost: Math.round(totalCost),
            dieselCost: Math.round(dieselCost),
            dieselTotal: Math.round(dieselTotal),
            savings: Math.round(dieselTotal - totalCost),
            savingsPercent: ((dieselTotal - totalCost) / dieselTotal * 100).toFixed(1),
            engine: engineData.engine || 'osrm'
        };
    },

    /**
     * 沿路径推荐充电站（方向感知）
     * @param {Array} routeCoords - 路径坐标 WGS-84
     * @param {number} maxRange - 最大续航 km
     * @returns {Array} 推荐的充电站列表（含方向匹配信息）
     */
    recommendChargingStops(routeCoords, maxRange) {
        const stations = MAP_DATA.chargingStations;
        const recommendations = [];
        let accumulatedDist = 0;
        let lastStopDist = 0;

        const sampleStep = Math.max(1, Math.floor(routeCoords.length / 200));

        for (let i = 0; i < routeCoords.length - 1; i += sampleStep) {
            const idx = i;
            const nextIdx = Math.min(i + sampleStep, routeCoords.length - 1);
            const [lng1, lat1] = routeCoords[idx];
            const [lng2, lat2] = routeCoords[nextIdx];
            const segDist = this.haversine(lat1, lng1, lat2, lng2);
            accumulatedDist += segDist;

            // 当累计距离接近最大续航时，找最近的充电站
            if ((accumulatedDist - lastStopDist) / 1000 > maxRange * 0.8) {
                const currentPoint = routeCoords[nextIdx];

                // 计算当前路径段的方向
                const bearing = this.calculateBearing(lat1, lng1, lat2, lng2);
                const routeDirection = this.bearingToDirection(bearing);

                let nearest = null;
                let minDist = Infinity;

                for (const station of stations) {
                    const d = this.haversine(currentPoint[1], currentPoint[0], station.lat, station.lng);

                    // 方向匹配：优先匹配同方向站点
                    const dirMatch = this.isDirectionMatch(station.direction, routeDirection);

                    // 方向匹配的站点优先（距离阈值放宽到35km），不匹配的缩小到15km
                    const distThreshold = dirMatch ? 35000 : 15000;

                    if (d < minDist && d < distThreshold) {
                        minDist = d;
                        nearest = { ...station, _dirMatch: dirMatch, _routeDir: routeDirection };
                    }
                }

                if (nearest && !recommendations.find(r => r.id === nearest.id)) {
                    recommendations.push({
                        ...nearest,
                        distanceFromRoute: Math.round(minDist / 1000 * 10) / 10,
                        cumulativeKm: Math.round(accumulatedDist / 1000),
                        routeDirection: nearest._routeDir,
                        directionMatch: nearest._dirMatch,
                        directionNote: nearest.direction === '双向'
                            ? `服务区双向设有充电站，请选择${nearest._routeDir}方向侧`
                            : nearest.direction === '不限'
                            ? '非高速站点，无方向限制'
                            : nearest._dirMatch
                            ? `✅ 方向匹配（${nearest.direction}）`
                            : `⚠️ 方向不匹配（站点${nearest.direction}，路线${nearest._routeDir}）`
                    });
                    lastStopDist = accumulatedDist;
                }
            }
        }

        return recommendations;
    },

    /**
     * 格式化时间
     */
    formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}小时${m}分钟`;
        return `${m}分钟`;
    }
};
