/**
 * 主应用逻辑
 * 工厂 & 重卡充电站 地图应用
 */

const App = {
    map: null,
    layers: { hq: null, factories: null, carCharging: null, charging: null, tolls: null, route: null, waypoints: null },
    markers: { hq: [], factories: [], carCharging: [], charging: [], tolls: [] },
    state: {
        mode: 'normal',       // normal | setStart | setEnd | setWaypoint
        startPoint: null,     // { lng, lat, name }
        endPoint: null,
        waypoints: [],        // [{ lng, lat, name }] 中间途经点
        routeData: null,
        allModeRoutes: null,  // 三种模式的路线数据
        allModeErrors: null,  // 三种模式的错误信息
        routeMode: 'highway', // 当前主路线模式
        sidebarOpen: false,
        mapType: 'standard',  // standard | satellite | detailed | hybrid
        showTraffic: false,   // 实时路况开关
        searchText: '',       // 搜索关键字
        activeFilter: 'all',  // 当前激活的筛选标签
        collapsedCategories: { hq: false, factory: false, carCharging: true, truckCharging: false, tolls: true },  // 收费站默认收起
        customChargeTimes: {}  // { stationId: minutes } 自定义充电时间
    },

    init() {
        this.initMap();
        this.initLayers();
        this.initSidebar();
        this.bindEvents();
        this.initAmapKey();
        this.loadPriceConfig();  // 加载已保存的电价配置
        this.updateStats();
        // 初始刷新实时数据
        this.refreshRealTimeData();
        // 每60秒自动刷新实时数据
        setInterval(() => this.refreshRealTimeData(), 60000);
        // 每10秒更新峰谷电价组件（含时间显示）
        this.updateElecWidget();
        setInterval(() => this.updateElecWidget(), 10000);
        // 初始化车辆追踪
        this.initVehicleTracking();
    },

    // ========== 地图初始化 ==========
    initMap() {
        // 高德瓦片使用 GCJ-02 坐标，将杭州中心 WGS-84 转为 GCJ-02
        const [gcjLng, gcjLat] = CoordTransform.wgs84togcj02(120.20, 30.25);

        this.map = L.map('map', {
            center: [gcjLat, gcjLng],
            zoom: 8,
            zoomControl: false,
            attributionControl: false,
            minZoom: 6,
            maxZoom: 20,           // 支持深度缩放（~50M以下）
            zoomSnap: 0.5,          // 支持半级缩放
            maxBounds: [[26.5, 116.0], [33.5, 124.5]],
            maxBoundsViscosity: 0.7,
            fadeAnimation: true,
            zoomAnimation: true
        });

        // 高德标准地图（GCJ-02，原生支持到zoom 20）
        const standardLayer = L.tileLayer(
            'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            {
                subdomains: ['1','2','3','4'],
                maxZoom: 20,
                maxNativeZoom: 20,   // 高德原生支持到20级，加载真实高精度瓦片
                crossOrigin: 'anonymous',
                updateWhenIdle: false,
                keepBuffer: 4,
                detectRetina: true
            }
        );

        // 高德详细地图（使用wprd引擎+2x缩放，更多细节）
        const detailedLayer = L.tileLayer(
            'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            {
                subdomains: ['1','2','3','4'],
                maxZoom: 20,
                maxNativeZoom: 20,
                crossOrigin: 'anonymous',
                updateWhenIdle: false,
                keepBuffer: 4,
                detectRetina: true
            }
        );

        // 高德卫星图（GCJ-02）
        const satelliteLayer = L.tileLayer(
            'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            { subdomains: ['1','2','3','4'], maxZoom: 20, maxNativeZoom: 20, crossOrigin: 'anonymous', keepBuffer: 4 }
        );

        const satelliteLabel = L.tileLayer(
            'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
            { subdomains: ['1','2','3','4'], maxZoom: 20, maxNativeZoom: 20, crossOrigin: 'anonymous', keepBuffer: 4 }
        );

        // 高德实时路况图层（透明叠加）
        const trafficLayer = L.tileLayer(
            'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&traffic=1',
            {
                subdomains: ['1','2','3','4'],
                maxZoom: 20,
                maxNativeZoom: 20,
                crossOrigin: 'anonymous',
                opacity: 0.7,
                updateWhenIdle: false
            }
        );

        standardLayer.addTo(this.map);
        this.tileLayers = { standard: standardLayer, detailed: detailedLayer, satellite: satelliteLayer, satelliteLabel: satelliteLabel };
        this.trafficLayer = trafficLayer;

        // 瓦片加载失败处理 — 自动切换备用瓦片
        let tileErrorCount = 0;
        standardLayer.on('tileerror', () => {
            tileErrorCount++;
            if (tileErrorCount === 8 && !this.tileFallbackActive) {
                this.tileFallbackActive = true;
                this.switchToFallbackTiles();
            }
        });

        // 缩放控件
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        // 比例尺
        L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(this.map);

        // 点击地图设置起终点（高德瓦片为 GCJ-02，需转回 WGS-84）
        this.map.on('click', (e) => {
            const [wgsLng, wgsLat] = CoordTransform.gcj02towgs84(e.latlng.lng, e.latlng.lat);
            if (this.state.mode === 'setStart') {
                this.setStart(wgsLng, wgsLat, `自定义点(${wgsLng.toFixed(3)}, ${wgsLat.toFixed(3)})`);
                this.setMode('normal');
            } else if (this.state.mode === 'setEnd') {
                this.setEnd(wgsLng, wgsLat, `自定义点(${wgsLng.toFixed(3)}, ${wgsLat.toFixed(3)})`);
                this.setMode('normal');
            } else if (this.state.mode === 'setWaypoint') {
                this.setWaypoint(wgsLng, wgsLat, `途经点(${wgsLng.toFixed(3)}, ${wgsLat.toFixed(3)})`);
                // 途经点模式不自动退出，允许连续添加
            }
            // 点击地图时关闭右键菜单
            this.hideContextMenu();
        });

        // 右键菜单 — 任意位置选点
        this.map.on('contextmenu', (e) => {
            const [wgsLng, wgsLat] = CoordTransform.gcj02towgs84(e.latlng.lng, e.latlng.lat);
            this.showContextMenu(e.originalEvent.clientX, e.originalEvent.clientY, wgsLng, wgsLat);
        });

        // 移动端长按选点
        let longPressTimer = null;
        let longPressPoint = null;
        this.map.on('mousedown', (e) => {
            if (e.originalEvent.touches || e.originalEvent.pointerType === 'touch') {
                longPressPoint = { x: e.originalEvent.clientX, y: e.originalEvent.clientY };
                longPressTimer = setTimeout(() => {
                    const [wgsLng, wgsLat] = CoordTransform.gcj02towgs84(e.latlng.lng, e.latlng.lat);
                    this.showContextMenu(longPressPoint.x, longPressPoint.y, wgsLng, wgsLat);
                    longPressTimer = null;
                }, 600);
            }
        });
        this.map.on('mouseup dragstart zoomstart', () => {
            if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        });

        // 缩放自适应：根据缩放级别添加 CSS 类，调整标记和标签大小
        this.updateZoomClass();
        this.map.on('zoomend', () => this.updateZoomClass());
    },

    // 右键菜单显示
    showContextMenu(x, y, lng, lat) {
        const menu = document.getElementById('map-context-menu');
        const coordsEl = document.getElementById('ctx-coords');
        coordsEl.textContent = `📍 ${lng.toFixed(5)}, ${lat.toFixed(5)}`;
        // 存储当前选中的坐标
        menu.dataset.lng = lng;
        menu.dataset.lat = lat;
        // 定位菜单（防止超出屏幕边界）
        const menuW = 180, menuH = 180;
        if (x + menuW > window.innerWidth) x = window.innerWidth - menuW - 8;
        if (y + menuH > window.innerHeight) y = window.innerHeight - menuH - 8;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('show');
    },

    hideContextMenu() {
        const menu = document.getElementById('map-context-menu');
        if (menu) menu.classList.remove('show');
    },

    // 缩放级别自适应：根据 zoom 添加对应 CSS 类
    updateZoomClass() {
        const container = this.map.getContainer();
        const zoom = this.map.getZoom();
        // 移除所有 zoom 类
        container.classList.remove('zoom-low', 'zoom-mid', 'zoom-high', 'zoom-max');
        // 根据缩放级别添加对应类
        if (zoom <= 9) {
            container.classList.add('zoom-low');
        } else if (zoom <= 13) {
            container.classList.add('zoom-mid');
        } else if (zoom <= 16) {
            container.classList.add('zoom-high');
        } else {
            container.classList.add('zoom-max');
        }
    },

    handleContextAction(action) {
        const menu = document.getElementById('map-context-menu');
        const lng = parseFloat(menu.dataset.lng);
        const lat = parseFloat(menu.dataset.lat);
        const name = `地图选点(${lng.toFixed(3)}, ${lat.toFixed(3)})`;
        if (action === 'start') {
            this.setStart(lng, lat, name);
            this.setMode('normal');
        } else if (action === 'end') {
            this.setEnd(lng, lat, name);
            this.setMode('normal');
        } else if (action === 'waypoint') {
            this.setWaypoint(lng, lat, name);
        }
        this.hideContextMenu();
    },

    // 备用瓦片：高德不可用时切换到 CartoDB
    switchToFallbackTiles() {
        this.map.removeLayer(this.tileLayers.standard);
        const fallback = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            { subdomains: ['a','b','c','d'], maxZoom: 20, crossOrigin: 'anonymous', detectRetina: true }
        );
        fallback.addTo(this.map);
        this.tileLayers.standard = fallback;
        this.showTileError();
    },

    // 瓦片加载失败提示
    showTileError() {
        if (document.getElementById('tile-error-tip')) return;
        const tip = document.createElement('div');
        tip.id = 'tile-error-tip';
        tip.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.95);border-radius:10px;padding:16px 24px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;text-align:center;font-size:13px;max-width:300px;line-height:1.6;';
        tip.innerHTML = '<div style="font-size:24px;margin-bottom:8px;">🗺️</div><b>已切换备用地图源</b><br><span style="color:#666;">高德瓦片加载不畅，已自动切换至备用地图。<br>地图信息量可能略有减少，但不影响标注和导航功能。</span>';
        document.getElementById('map-container').appendChild(tip);
        setTimeout(() => { if (tip.parentNode) tip.remove(); }, 6000);
    },

    // ========== 图层初始化 ==========
    initLayers() {
        this.layers.hq = L.layerGroup().addTo(this.map);
        this.layers.factories = L.layerGroup().addTo(this.map);
        this.layers.carCharging = L.layerGroup().addTo(this.map);
        this.layers.charging = L.layerGroup().addTo(this.map);
        this.layers.tolls = L.layerGroup();  // 默认不显示，需手动勾选
        this.layers.route = L.layerGroup().addTo(this.map);
        this.layers.waypoints = L.layerGroup().addTo(this.map);

        this.createHqMarkers();
        this.createFactoryMarkers();
        this.createCarChargingMarkers();
        this.createChargingMarkers();
        this.createTollStationMarkers();
        this.renderPointList();
    },

    // 创建 Leaflet LatLng（WGS-84 → GCJ-02 转换，适配高德瓦片）
    toLatLng(lng, lat) {
        const [gLng, gLat] = CoordTransform.wgs84togcj02(lng, lat);
        return L.latLng(gLat, gLng);
    },

    // ========== 大本营标记 ==========
    createHqMarkers() {
        MAP_DATA.headquarters.forEach(h => {
            const latlng = this.toLatLng(h.lng, h.lat);
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin hq"><span class="icon">🏠</span></div>
                       <div class="marker-label">${h.name}</div>`,
                iconSize: [36, 52],
                iconAnchor: [18, 42],
                zIndexOffset: 1000
            });

            const marker = L.marker(latlng, { icon, zIndexOffset: 1000 }).addTo(this.layers.hq);
            marker.bindPopup(this.createPopup(h, 'hq'), { maxWidth: 300 });
            marker._data = h;
            marker._type = 'hq';
            marker.on('click', () => {
                if (this.state.mode === 'setStart') {
                    this.setStart(h.lng, h.lat, h.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setEnd') {
                    this.setEnd(h.lng, h.lat, h.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setWaypoint') {
                    this.setWaypoint(h.lng, h.lat, h.name);
                    this.map.closePopup();
                }
            });
            this.markers.hq.push(marker);
        });
    },

    // ========== 工厂标记 ==========
    createFactoryMarkers() {
        MAP_DATA.factories.forEach(f => {
            const latlng = this.toLatLng(f.lng, f.lat);
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin factory"><span class="icon">🏭</span></div>
                       <div class="marker-label">${f.name.replace('水厂·', '')}</div>`,
                iconSize: [32, 48],
                iconAnchor: [16, 38]
            });

            const marker = L.marker(latlng, { icon }).addTo(this.layers.factories);
            marker.bindPopup(this.createPopup(f, 'factory'), { maxWidth: 300 });
            marker._data = f;
            marker._type = 'factory';
            marker.on('click', (e) => {
                if (this.state.mode === 'setStart') {
                    this.setStart(f.lng, f.lat, f.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setEnd') {
                    this.setEnd(f.lng, f.lat, f.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setWaypoint') {
                    this.setWaypoint(f.lng, f.lat, f.name);
                    this.map.closePopup();
                }
            });
            this.markers.factories.push(marker);
        });
    },

    // ========== 汽车充电站标记 ==========
    createCarChargingMarkers() {
        MAP_DATA.carChargingStations.forEach(c => {
            const latlng = this.toLatLng(c.lng, c.lat);
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin car-charging"><span class="icon">🚗</span></div>`,
                iconSize: [26, 40],
                iconAnchor: [13, 32]
            });

            const marker = L.marker(latlng, { icon }).addTo(this.layers.carCharging);
            marker.bindPopup(this.createPopup(c, 'carCharging'), { maxWidth: 280 });
            marker._data = c;
            marker._type = 'carCharging';
            marker.on('click', () => {
                if (this.state.mode === 'setStart') {
                    this.setStart(c.lng, c.lat, c.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setEnd') {
                    this.setEnd(c.lng, c.lat, c.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setWaypoint') {
                    this.setWaypoint(c.lng, c.lat, c.name);
                    this.map.closePopup();
                }
            });
            this.markers.carCharging.push(marker);
        });
    },

    // ========== 充电站标记 ==========
    createChargingMarkers() {
        MAP_DATA.chargingStations.forEach(c => {
            const latlng = this.toLatLng(c.lng, c.lat);
            const iconClass = c.hasSwap ? 'charging swap' : 'charging';
            const iconText = c.hasSwap ? '🔋' : '⚡';
            const shortName = c.name.replace(/充电站|充换电站|换电站|超充站群|站群/g, '').slice(0, 8);

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin ${iconClass}"><span class="icon">${iconText}</span></div>
                       <div class="marker-label">${shortName}</div>`,
                iconSize: [32, 48],
                iconAnchor: [16, 38]
            });

            const marker = L.marker(latlng, { icon }).addTo(this.layers.charging);
            marker.bindPopup(this.createPopup(c, 'charging'), { maxWidth: 300 });
            marker._data = c;
            marker._type = 'charging';
            marker.on('click', (e) => {
                if (this.state.mode === 'setStart') {
                    this.setStart(c.lng, c.lat, c.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setEnd') {
                    this.setEnd(c.lng, c.lat, c.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setWaypoint') {
                    this.setWaypoint(c.lng, c.lat, c.name);
                    this.map.closePopup();
                }
            });
            this.markers.charging.push(marker);
        });
    },

    // ========== 收费站标记 ==========
    createTollStationMarkers() {
        if (typeof TOLL_STATIONS === 'undefined') return;
        TOLL_STATIONS.forEach(t => {
            const latlng = this.toLatLng(t.lng, t.lat);
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin toll"><span class="icon">🚧</span></div>
                       <div class="marker-label">${t.name}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker(latlng, { icon }).addTo(this.layers.tolls);
            marker.bindPopup(this.createPopup(t, 'toll'), { maxWidth: 260 });
            marker._data = t;
            marker._type = 'toll';
            marker.on('click', () => {
                if (this.state.mode === 'setStart') {
                    this.setStart(t.lng, t.lat, t.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setEnd') {
                    this.setEnd(t.lng, t.lat, t.name);
                    this.setMode('normal');
                    this.map.closePopup();
                } else if (this.state.mode === 'setWaypoint') {
                    this.setWaypoint(t.lng, t.lat, t.name);
                    this.map.closePopup();
                }
            });
            this.markers.tolls.push(marker);
        });
    },

    // ========== 弹窗内容 ==========
    createPopup(data, type) {
        if (type === 'hq') {
            return `
                <div class="popup-content">
                    <div class="popup-title">🏠 ${data.name}
                        <span class="popup-tag" style="background:#E91E63;color:#fff;">大本营</span>
                    </div>
                    <div class="popup-row"><span class="key">公司</span>${data.company}</div>
                    <div class="popup-row"><span class="key">地址</span>${data.address}</div>
                    <div class="popup-row"><span class="key">性质</span>${data.capacity}</div>
                    ${data.phone ? `<div class="popup-row"><span class="key">电话</span><a href="tel:${data.phone}" style="color:var(--primary);font-weight:600;">${data.phone}</a></div>` : ''}
                    <div class="popup-desc">${data.desc}</div>
                    <div class="popup-actions">
                        <button class="popup-btn start" onclick="App.setStart(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为起点</button>
                        <button class="popup-btn via" onclick="App.setWaypoint(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');">途经点</button>
                        <button class="popup-btn end" onclick="App.setEnd(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为终点</button>
                    </div>
                </div>`;
        } else if (type === 'factory') {
            return `
                <div class="popup-content">
                    <div class="popup-title">🏭 ${data.name}
                        <span class="popup-tag factory">生产基地</span>
                    </div>
                    <div class="popup-row"><span class="key">地址</span>${data.address}</div>
                    <div class="popup-row"><span class="key">水源</span>${data.water}</div>
                    <div class="popup-row"><span class="key">规模</span>${data.capacity}</div>
                    ${data.phone ? `<div class="popup-row"><span class="key">电话</span><a href="tel:${data.phone}" style="color:var(--primary);font-weight:600;">${data.phone}</a></div>` : ''}
                    <div class="popup-desc">${data.desc}</div>
                    <div class="popup-actions">
                        <button class="popup-btn start" onclick="App.setStart(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为起点</button>
                        <button class="popup-btn via" onclick="App.setWaypoint(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');">途经点</button>
                        <button class="popup-btn end" onclick="App.setEnd(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为终点</button>
                    </div>
                </div>`;
        } else if (type === 'carCharging') {
            return `
                <div class="popup-content">
                    <div class="popup-title">🚗 ${data.name}
                        <span class="popup-tag" style="background:#FF9800;color:#fff;">小型充电站</span>
                    </div>
                    <div class="popup-row"><span class="key">地址</span>${data.address}</div>
                    <div class="popup-row"><span class="key">运营商</span>${data.operator}</div>
                    <div class="popup-row"><span class="key">区域</span>${data.region}</div>
                    <div class="popup-row"><span class="key">营业</span>${data.open24h ? '24小时' : '限时'}</div>
                    <div class="popup-actions">
                        <button class="popup-btn start" onclick="App.setStart(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为起点</button>
                        <button class="popup-btn via" onclick="App.setWaypoint(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');">途经点</button>
                        <button class="popup-btn end" onclick="App.setEnd(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为终点</button>
                    </div>
                </div>`;
        } else if (type === 'toll') {
            return `
                <div class="popup-content">
                    <div class="popup-title">🚧 ${data.name}
                        <span class="popup-tag toll">收费站</span>
                    </div>
                    <div class="popup-row"><span class="key">高速</span>${data.highway}</div>
                    <div class="popup-row"><span class="key">方向</span>${data.direction}</div>
                    <div class="popup-row"><span class="key">区域</span>${data.region}</div>
                    <div class="popup-actions">
                        <button class="popup-btn start" onclick="App.setStart(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为起点</button>
                        <button class="popup-btn via" onclick="App.setWaypoint(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');">途经点</button>
                        <button class="popup-btn end" onclick="App.setEnd(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为终点</button>
                    </div>
                </div>`;
        } else {
            // 获取实时数据
            const rt = RealTimeData.getStationRealTime(data);
            const powerText = data.powerKW > 0 ? `${data.powerKW}kW` : '换电';
            const periodColor = rt.periodType === 'offPeak' ? '#4CAF50' :
                                rt.periodType === 'sharpPeak' ? '#f44336' :
                                rt.periodType === 'onPeak' ? '#FF6B35' : '#2196F3';
            const availColor = rt.availableChargers === 0 ? '#f44336' :
                               rt.availableChargers <= 2 ? '#FF6B35' : '#4CAF50';

            return `
                <div class="popup-content">
                    <div class="popup-title">${data.hasSwap ? '🔋' : '⚡'} ${data.name}
                        <span class="popup-tag charging">重卡充电站</span>
                    </div>
                    <div class="popup-row"><span class="key">地址</span>${data.address}</div>
                    <div class="popup-row"><span class="key">高速</span>${data.highway}</div>
                    <div class="popup-row"><span class="key">功率</span>${powerText} ${data.gunType}</div>
                    <div class="popup-row"><span class="key">充电桩</span>${data.chargers}台 / ${data.truckSpaces}车位</div>
                    <div class="popup-row"><span class="key">运营</span>${data.operator}</div>
                    <div class="popup-row"><span class="key">区域</span>${data.region}</div>
                    <div class="popup-row"><span class="key">营业</span>${data.open24h ? '24小时' : '限时'}</div>
                    ${data.direction && data.direction !== '不限' ? `<div class="popup-row"><span class="key">方向</span><span style="color:var(--secondary);font-weight:600;">${data.direction}</span></div>` : ''}
                    ${data.phone ? `<div class="popup-row"><span class="key">电话</span><a href="tel:${data.phone}" style="color:var(--primary);font-weight:600;">${data.phone}</a></div>` : ''}
                    <div class="popup-desc">${data.desc}</div>

                    <div class="realtime-box">
                        <div class="rt-header">
                            <span class="rt-title">📡 实时状态</span>
                            <span class="rt-time">更新于 ${rt.lastUpdate}</span>
                        </div>
                        <div class="rt-grid">
                            <div class="rt-item">
                                <div class="rt-label">当前时段</div>
                                <div class="rt-value" style="color:${periodColor};">${rt.period}</div>
                            </div>
                            <div class="rt-item">
                                <div class="rt-label">${rt.touEnabled ? '当前电价' : '充电单价'}</div>
                                <div class="rt-value" style="color:${periodColor};">¥${rt.currentPrice}/度</div>
                            </div>
                            <div class="rt-item">
                                <div class="rt-label">可用桩位</div>
                                <div class="rt-value" style="color:${availColor};">${rt.availableChargers}/${rt.totalChargers}</div>
                            </div>
                            <div class="rt-item">
                                <div class="rt-label">可用车位</div>
                                <div class="rt-value" style="color:${availColor};">${rt.availableSpaces}/${rt.totalSpaces}</div>
                            </div>
                        </div>
                        ${rt.touEnabled ? `<div style="font-size:11px;color:var(--text-secondary);padding:2px 0;">⚡ 分时计费 · 基准¥${rt.basePrice}/度 × ${rt.multiplier}倍率 + 服务费¥${rt.serviceFee}</div>` : `<div style="font-size:11px;color:var(--text-secondary);padding:2px 0;">📋 全天统一价 · 基准¥${rt.basePrice}/度</div>`}
                        ${rt.queue > 0 ? `<div class="rt-queue">⚠️ 前方${rt.queue}辆等待 · 预计${rt.waitTime}分钟</div>` : '<div class="rt-queue" style="color:#4CAF50;">✅ 无需排队</div>'}
                        ${rt.swapInfo ? `<div class="rt-queue" style="color:#9C27B0;">🔄 ${rt.swapInfo}</div>` : ''}
                        <div class="rt-note">💡 电价来源：${rt.priceSource || '运营商默认'} · 更新：${rt.priceUpdated || '未知'}</div>
                    </div>

                    <div class="popup-actions">
                        <button class="popup-btn start" onclick="App.setStart(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为起点</button>
                        <button class="popup-btn via" onclick="App.setWaypoint(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');">途经点</button>
                        <button class="popup-btn end" onclick="App.setEnd(${data.lng},${data.lat},'${data.name.replace(/'/g,"\\'")}');App.setMode('normal');">设为终点</button>
                    </div>
                </div>`;
        }
    },

    // ========== 标注点列表（含搜索筛选 + 分组收起）==========
    toggleCategory(cat) {
        this.state.collapsedCategories[cat] = !this.state.collapsedCategories[cat];
        this.renderPointList();
    },

    renderPointList() {
        const container = document.getElementById('point-list');
        let html = '';
        const filter = this.state.activeFilter;
        const collapsed = this.state.collapsedCategories;

        // 判断各类别是否应该显示
        const showHq = filter === 'all' || filter === 'hq';
        const showFactories = filter === 'all' || filter === 'factory';
        const showCarCharging = filter === 'all' || filter === 'carCharging';
        const showTruckCharging = filter === 'all' || filter === 'truckCharging' ||
            filter === 'swap' || filter === 'highway' || filter === 'high-power';
        const showTolls = filter === 'all' || filter === 'toll';

        // 大本营
        if (showHq) {
            const filteredHq = MAP_DATA.headquarters.filter(h => this.matchSearch(h));
            if (filteredHq.length > 0) {
                html += `<div class="point-category-header" onclick="App.toggleCategory('hq')">
                    <span class="category-arrow ${collapsed.hq ? 'collapsed' : ''}">▼</span>
                    <span class="category-dot" style="background:#E91E63"></span>
                    <span>物流公司·大本营</span>
                    <span class="category-count">${filteredHq.length}</span>
                </div>`;
                if (!collapsed.hq) {
                    html += '<div class="point-category-body">';
                    filteredHq.forEach(h => {
                        html += `
                            <div class="point-item" onclick="App.flyToPoint('${h.id}','hq')">
                                <div class="point-icon hq">🏠</div>
                                <div class="point-info">
                                    <div class="point-name">${h.name}</div>
                                    <div class="point-addr">${h.address}</div>
                                </div>
                            </div>`;
                    });
                    html += '</div>';
                }
            }
        }

        // 工厂
        if (showFactories) {
            const filteredFactories = MAP_DATA.factories.filter(f => this.matchSearch(f));
            if (filteredFactories.length > 0) {
                const isCollapsed = collapsed.factory;
                html += `<div class="point-category-header" onclick="App.toggleCategory('factory')">
                    <span class="category-arrow ${isCollapsed ? 'collapsed' : ''}">▼</span>
                    <span class="category-dot" style="background:var(--primary)"></span>
                    <span>水厂工厂</span>
                    <span class="category-count">${filteredFactories.length}</span>
                </div>`;
                if (!isCollapsed) {
                    html += '<div class="point-category-body">';
                    filteredFactories.forEach(f => {
                        html += `
                            <div class="point-item" onclick="App.flyToPoint('${f.id}','factory')">
                                <div class="point-icon factory">🏭</div>
                                <div class="point-info">
                                    <div class="point-name">${f.name}</div>
                                    <div class="point-addr">${f.address}</div>
                                </div>
                            </div>`;
                    });
                    html += '</div>';
                }
            }
        }

        // 小型充电站
        if (showCarCharging) {
            const filteredCar = MAP_DATA.carChargingStations.filter(c => this.matchSearch(c));
            if (filteredCar.length > 0) {
                const isCollapsed = collapsed.carCharging;
                html += `<div class="point-category-header" onclick="App.toggleCategory('carCharging')">
                    <span class="category-arrow ${isCollapsed ? 'collapsed' : ''}">▼</span>
                    <span class="category-dot" style="background:#FF9800"></span>
                    <span>小型充电站</span>
                    <span class="category-count">${filteredCar.length}</span>
                </div>`;
                if (!isCollapsed) {
                    html += '<div class="point-category-body">';
                    filteredCar.forEach(c => {
                        html += `
                            <div class="point-item" onclick="App.flyToPoint('${c.id}','carCharging')">
                                <div class="point-icon car-charging">🚗</div>
                                <div class="point-info">
                                    <div class="point-name">${c.name}</div>
                                    <div class="point-addr">${c.region} · ${c.operator}</div>
                                </div>
                            </div>`;
                    });
                    html += '</div>';
                }
            }
        }

        // 重卡充电站
        if (showTruckCharging) {
            const filteredStations = this.getFilteredStations();
            if (filteredStations.length > 0) {
                const isCollapsed = collapsed.truckCharging;
                html += `<div class="point-category-header" onclick="App.toggleCategory('truckCharging')">
                    <span class="category-arrow ${isCollapsed ? 'collapsed' : ''}">▼</span>
                    <span class="category-dot" style="background:var(--secondary)"></span>
                    <span>重卡充电站</span>
                    <span class="category-count">${filteredStations.length}</span>
                </div>`;
                if (!isCollapsed) {
                    html += '<div class="point-category-body">';
                    filteredStations.forEach(c => {
                        const iconText = c.hasSwap ? '🔋' : '⚡';
                        html += `
                            <div class="point-item" onclick="App.flyToPoint('${c.id}','charging')">
                                <div class="point-icon charging">${iconText}</div>
                                <div class="point-info">
                                    <div class="point-name">${c.name}</div>
                                    <div class="point-addr">${c.region} · ${c.highway}</div>
                                </div>
                            </div>`;
                    });
                    html += '</div>';
                }
            }
        }

        // 收费站
        if (showTolls && typeof TOLL_STATIONS !== 'undefined') {
            const filteredTolls = TOLL_STATIONS.filter(t => this.matchSearch(t));
            if (filteredTolls.length > 0) {
                const isCollapsed = collapsed.tolls;
                html += `<div class="point-category-header" onclick="App.toggleCategory('tolls')">
                    <span class="category-arrow ${isCollapsed ? 'collapsed' : ''}">▼</span>
                    <span class="category-dot" style="background:#607D8B"></span>
                    <span>高速收费站口</span>
                    <span class="category-count">${filteredTolls.length}</span>
                </div>`;
                if (!isCollapsed) {
                    html += '<div class="point-category-body">';
                    filteredTolls.forEach(t => {
                        html += `
                            <div class="point-item" onclick="App.flyToPoint('${t.id}','toll')">
                                <div class="point-icon toll">🚧</div>
                                <div class="point-info">
                                    <div class="point-name">${t.name}</div>
                                    <div class="point-addr">${t.region} · ${t.highway}</div>
                                </div>
                            </div>`;
                    });
                    html += '</div>';
                }
            }
        }

        if (html === '') {
            html = '<div style="text-align:center;color:var(--text-secondary);padding:20px 0;font-size:13px;">无匹配结果</div>';
        }

        container.innerHTML = html;

        // 更新结果计数
        const countEl = document.getElementById('search-result-count');
        if (countEl) {
            if (this.state.searchText || filter !== 'all') {
                let total = 0;
                let matched = 0;
                if (showHq) { total += MAP_DATA.headquarters.length; matched += MAP_DATA.headquarters.filter(h => this.matchSearch(h)).length; }
                if (showFactories) { total += MAP_DATA.factories.length; matched += MAP_DATA.factories.filter(f => this.matchSearch(f)).length; }
                if (showCarCharging) { total += MAP_DATA.carChargingStations.length; matched += MAP_DATA.carChargingStations.filter(c => this.matchSearch(c)).length; }
                if (showTruckCharging) { total += MAP_DATA.chargingStations.length; matched += this.getFilteredStations().length; }
                if (showTolls && typeof TOLL_STATIONS !== 'undefined') { total += TOLL_STATIONS.length; matched += TOLL_STATIONS.filter(t => this.matchSearch(t)).length; }
                countEl.style.display = 'block';
                countEl.textContent = `找到 ${matched}/${total} 个标注点`;
            } else {
                countEl.style.display = 'none';
            }
        }

        // 同步更新地图标记可见性
        this.updateMarkerVisibility();
    },

    // 搜索文本匹配
    matchSearch(item) {
        if (!this.state.searchText) return true;
        const q = this.state.searchText.toLowerCase();
        const fields = [item.name, item.address, item.highway, item.operator, item.region, item.direction]
            .filter(Boolean).join(' ').toLowerCase();
        return fields.includes(q);
    },

    // 筛选标签匹配（仅用于重卡充电站的子筛选）
    matchFilter(station) {
        switch (this.state.activeFilter) {
            case 'swap': return !!station.hasSwap;
            case 'highway': return station.highway && station.highway.includes('高速');
            case 'high-power': return station.powerKW >= 400;
            case 'truckCharging': return true; // 显示所有重卡充电站
            // factory / carCharging / all 不走此方法
            default: return true;
        }
    },

    // 获取筛选后的充电站列表
    getFilteredStations() {
        return MAP_DATA.chargingStations.filter(c =>
            this.matchSearch(c) && this.matchFilter(c)
        );
    },

    // 更新地图标记可见性（根据筛选结果）
    updateMarkerVisibility() {
        const filter = this.state.activeFilter;
        const searchActive = this.state.searchText || filter !== 'all';

        // 重卡充电站标记
        const visibleTruckIds = new Set(this.getFilteredStations().map(c => c.id));
        const showTruck = filter === 'all' || filter === 'truckCharging' ||
            filter === 'swap' || filter === 'highway' || filter === 'high-power';

        this.markers.charging.forEach(marker => {
            const id = marker._data.id;
            if (searchActive && showTruck) {
                if (visibleTruckIds.has(id)) {
                    if (!this.layers.charging.hasLayer(marker)) this.layers.charging.addLayer(marker);
                } else {
                    if (this.layers.charging.hasLayer(marker)) this.layers.charging.removeLayer(marker);
                }
            } else if (searchActive && !showTruck) {
                // 筛选模式但当前不显示重卡充电站
                if (this.layers.charging.hasLayer(marker)) this.layers.charging.removeLayer(marker);
            } else {
                if (!this.layers.charging.hasLayer(marker)) {
                    const layerChecked = document.getElementById('layer-charging')?.checked;
                    if (layerChecked) this.layers.charging.addLayer(marker);
                }
            }
        });

        // 汽车充电站标记
        const showCar = filter === 'all' || filter === 'carCharging';
        const visibleCarIds = new Set(MAP_DATA.carChargingStations.filter(c => this.matchSearch(c)).map(c => c.id));
        this.markers.carCharging.forEach(marker => {
            const id = marker._data.id;
            if (searchActive) {
                if (showCar && visibleCarIds.has(id)) {
                    if (!this.layers.carCharging.hasLayer(marker)) this.layers.carCharging.addLayer(marker);
                } else {
                    if (this.layers.carCharging.hasLayer(marker)) this.layers.carCharging.removeLayer(marker);
                }
            } else {
                if (!this.layers.carCharging.hasLayer(marker)) {
                    const layerChecked = document.getElementById('layer-car-charging')?.checked;
                    if (layerChecked) this.layers.carCharging.addLayer(marker);
                }
            }
        });

        // 工厂标记
        const showFac = filter === 'all' || filter === 'factory';
        const visibleFacIds = new Set(MAP_DATA.factories.filter(f => this.matchSearch(f)).map(f => f.id));
        this.markers.factories.forEach(marker => {
            const id = marker._data.id;
            if (searchActive) {
                if (showFac && visibleFacIds.has(id)) {
                    if (!this.layers.factories.hasLayer(marker)) this.layers.factories.addLayer(marker);
                } else {
                    if (this.layers.factories.hasLayer(marker)) this.layers.factories.removeLayer(marker);
                }
            } else {
                if (!this.layers.factories.hasLayer(marker)) {
                    const layerChecked = document.getElementById('layer-factories')?.checked;
                    if (layerChecked) this.layers.factories.addLayer(marker);
                }
            }
        });

        // 收费站标记
        const showToll = filter === 'all' || filter === 'toll';
        if (this.markers.tolls.length > 0) {
            const visibleTollIds = new Set(
                (typeof TOLL_STATIONS !== 'undefined' ? TOLL_STATIONS : []).filter(t => this.matchSearch(t)).map(t => t.id)
            );
            this.markers.tolls.forEach(marker => {
                const id = marker._data.id;
                if (searchActive) {
                    if (showToll && visibleTollIds.has(id)) {
                        if (!this.layers.tolls.hasLayer(marker)) this.layers.tolls.addLayer(marker);
                    } else {
                        if (this.layers.tolls.hasLayer(marker)) this.layers.tolls.removeLayer(marker);
                    }
                } else {
                    if (!this.layers.tolls.hasLayer(marker)) {
                        const layerChecked = document.getElementById('layer-tolls')?.checked;
                        if (layerChecked) this.layers.tolls.addLayer(marker);
                    }
                }
            });
        }
    },

    flyToPoint(id, type) {
        let arr, markers;
        if (type === 'hq') {
            arr = MAP_DATA.headquarters;
            markers = this.markers.hq;
        } else if (type === 'factory') {
            arr = MAP_DATA.factories;
            markers = this.markers.factories;
        } else if (type === 'carCharging') {
            arr = MAP_DATA.carChargingStations;
            markers = this.markers.carCharging;
        } else if (type === 'toll') {
            arr = (typeof TOLL_STATIONS !== 'undefined') ? TOLL_STATIONS : [];
            markers = this.markers.tolls;
        } else {
            arr = MAP_DATA.chargingStations;
            markers = this.markers.charging;
        }
        const data = arr.find(d => d.id === id);
        if (!data) return;

        const latlng = this.toLatLng(data.lng, data.lat);
        this.map.flyTo(latlng, 13, { duration: 1.0 });

        // 打开弹窗
        setTimeout(() => {
            const marker = markers.find(m => m._data.id === id);
            if (marker) marker.openPopup();
        }, 1100);
    },

    // ========== 路径规划 ==========
    setMode(mode) {
        this.state.mode = mode;
        const hint = document.getElementById('mode-hint');
        const mapEl = document.getElementById('map');

        if (mode === 'setStart') {
            hint.style.display = 'flex';
            hint.innerHTML = '📍 点击地图或标注点设置 <b>起点</b>';
            mapEl.style.cursor = 'crosshair';
        } else if (mode === 'setEnd') {
            hint.style.display = 'flex';
            hint.innerHTML = '📍 点击地图或标注点设置 <b>终点</b>';
            mapEl.style.cursor = 'crosshair';
        } else if (mode === 'setWaypoint') {
            hint.style.display = 'flex';
            hint.innerHTML = '➕ 点击地图或标注点添加 <b>途经点</b>';
            mapEl.style.cursor = 'crosshair';
        } else {
            hint.style.display = 'none';
            mapEl.style.cursor = '';
        }
    },

    setStart(lng, lat, name) {
        this.state.startPoint = { lng, lat, name };
        this.updateRouteDisplay();
        this.updateWaypointMarkers();
    },

    setEnd(lng, lat, name) {
        this.state.endPoint = { lng, lat, name };
        this.updateRouteDisplay();
        this.updateWaypointMarkers();
    },

    // 添加途经点
    setWaypoint(lng, lat, name) {
        this.state.waypoints.push({ lng, lat, name });
        this.updateRouteDisplay();
        this.updateWaypointMarkers();
    },

    // 移除途经点
    removeWaypoint(index) {
        this.state.waypoints.splice(index, 1);
        this.updateRouteDisplay();
        this.updateWaypointMarkers();
    },

    updateRouteDisplay() {
        const startEl = document.getElementById('route-start-value');
        const endEl = document.getElementById('route-end-value');
        const planBtn = document.getElementById('btn-plan-route');

        startEl.textContent = this.state.startPoint ? this.state.startPoint.name : '点击「设为起点」选择';
        startEl.style.color = this.state.startPoint ? 'var(--accent)' : 'var(--text-secondary)';

        endEl.textContent = this.state.endPoint ? this.state.endPoint.name : '点击「设为终点」选择';
        endEl.style.color = this.state.endPoint ? 'var(--secondary)' : 'var(--text-secondary)';

        planBtn.disabled = !(this.state.startPoint && this.state.endPoint);

        // 渲染途经点列表
        this.renderWaypointList();
    },

    renderWaypointList() {
        const container = document.getElementById('waypoint-list');
        if (!container) return;
        if (this.state.waypoints.length === 0) {
            container.innerHTML = '';
            return;
        }
        let html = '';
        this.state.waypoints.forEach((wp, i) => {
            html += `
                <div class="route-point waypoint-item">
                    <div class="dot waypoint">${i + 1}</div>
                    <span class="label">途经</span>
                    <span class="value" style="color:var(--text-primary);flex:1;">${wp.name}</span>
                    <button class="waypoint-remove" onclick="App.removeWaypoint(${i})" title="移除">✕</button>
                </div>`;
        });
        container.innerHTML = html;
    },

    updateWaypointMarkers() {
        this.layers.waypoints.clearLayers();

        if (this.state.startPoint) {
            const latlng = this.toLatLng(this.state.startPoint.lng, this.state.startPoint.lat);
            const icon = L.divIcon({
                className: '',
                html: '<div class="waypoint-marker start">A</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            L.marker(latlng, { icon }).addTo(this.layers.waypoints);
        }

        // 途经点标记
        this.state.waypoints.forEach((wp, i) => {
            const latlng = this.toLatLng(wp.lng, wp.lat);
            const icon = L.divIcon({
                className: '',
                html: `<div class="waypoint-marker via">${i + 1}</div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });
            L.marker(latlng, { icon }).addTo(this.layers.waypoints);
        });

        if (this.state.endPoint) {
            const latlng = this.toLatLng(this.state.endPoint.lng, this.state.endPoint.lat);
            const icon = L.divIcon({
                className: '',
                html: '<div class="waypoint-marker end">B</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            L.marker(latlng, { icon }).addTo(this.layers.waypoints);
        }
    },

    // ========== 地名搜索 ==========
    placeSearchTimer: null,

    async searchPlace(query) {
        query = query.trim();
        if (!query || query.length < 2) {
            document.getElementById('place-search-results').style.display = 'none';
            return;
        }

        const amapKey = RoutePlanner.getAmapKey();
        if (!amapKey) {
            alert('请先配置高德API Key');
            return;
        }

        try {
            const url = `https://restapi.amap.com/v3/place/text?key=${amapKey}&keywords=${encodeURIComponent(query)}&city=浙江&citylimit=false&offset=10&output=json&extensions=base`;
            const resp = await fetch(url);
            const data = await resp.json();

            const resultsEl = document.getElementById('place-search-results');
            if (!data.pois || data.pois.length === 0) {
                resultsEl.innerHTML = '<div class="place-search-result-item" style="color:var(--text-secondary);">未找到相关地点</div>';
                resultsEl.style.display = 'block';
                return;
            }

            let html = '';
            data.pois.forEach(poi => {
                if (!poi.location) return;
                const [lng, lat] = poi.location.split(',');
                const [wLng, wLat] = CoordTransform.gcj02towgs84(parseFloat(lng), parseFloat(lat));
                const name = poi.name.replace(/'/g, "\\'");
                const addr = (poi.address || poi.cityname || '').replace(/'/g, "\\'");
                html += `<div class="place-search-result-item" onclick="App.selectSearchResult('${name}','${addr}',${wLng},${wLat})">
                    <div class="psr-name">${poi.name}</div>
                    <div class="psr-addr">${poi.address || poi.cityname || ''} · ${poi.type || ''}</div>
                </div>`;
            });
            resultsEl.innerHTML = html;
            resultsEl.style.display = 'block';
        } catch(e) {
            console.error('搜索失败:', e);
        }
    },

    selectSearchResult(name, addr, lng, lat) {
        const target = document.querySelector('input[name="search-target"]:checked');
        const targetVal = target ? target.value : 'end';
        const displayName = name + (addr ? ` (${addr})` : '');

        if (targetVal === 'start') {
            this.setStart(lng, lat, displayName);
        } else {
            this.setEnd(lng, lat, displayName);
        }

        // 清除搜索结果
        document.getElementById('place-search-results').style.display = 'none';
        document.getElementById('place-search-input').value = '';

        // 飞到该位置
        const latlng = this.toLatLng(lng, lat);
        this.map.flyTo(latlng, 12, { duration: 0.8 });
    },

    async planRoute() {
        if (!this.state.startPoint || !this.state.endPoint) return;

        // 读取路线模式
        const modeEl = document.querySelector('input[name="route-mode"]:checked');
        const routeMode = modeEl ? modeEl.value : 'highway';

        // 读取货车导航开关
        const truckModeEl = document.getElementById('truck-mode');
        const truckMode = truckModeEl ? truckModeEl.checked : false;

        const modeLabels = {
            highway: '高速优先',
            national: '国道优先',
            shortest: '最短距离'
        };

        const amapKey = RoutePlanner.getAmapKey();
        const engineLabel = truckMode ? (amapKey ? '高德货车导航' : 'OSRM（备用）') : (amapKey ? '高德导航' : 'OSRM（备用）');
        const waypointNote = this.state.waypoints.length > 0 ? `（含${this.state.waypoints.length}个途经点）` : '';
        this.showLoading(`${truckMode ? '货车专用导航' : '导航'}规划中${waypointNote}...`);
        this.clearRoute(false);

        // 构建路径点序列：起点 → 途经点 → 终点
        const waypoints = [
            [this.state.startPoint.lng, this.state.startPoint.lat]
        ];
        this.state.waypoints.forEach(wp => waypoints.push([wp.lng, wp.lat]));
        waypoints.push([this.state.endPoint.lng, this.state.endPoint.lat]);

        // 读取自定义参数
        const truckConfig = this.getTruckConfig();
        const costConfig = this.getCostConfig();

        try {
            // 同时规划三种模式
            const { results, errors } = await RoutePlanner.planAllModes(waypoints, truckMode);
            this.state.allModeRoutes = results;
            this.state.allModeErrors = errors;

            // 使用用户选中的模式作为主路线
            const route = results[routeMode];
            if (!route) {
                throw new Error(errors[routeMode] || '路径规划失败');
            }

            this.state.routeData = route;
            this.state.routeMode = routeMode;

            // 绘制所有模式的路线（主路线高亮，其他半透明）
            this.drawAllRoutes(results, routeMode);

            // 计算费用（使用自定义参数和路线模式，传递引擎数据）
            const engineData = { engine: route.engine, tolls: route.tolls || 0, duration: route.duration || 0 };
            const summary = RoutePlanner.calculateTotal(route.distance, truckConfig, costConfig, routeMode, engineData);
            this.displayRouteDetails(route, summary, truckConfig, costConfig, routeMode);

            // 显示模式对比表
            this.displayModeComparison(results, errors, truckConfig, costConfig, routeMode);

            // 推荐充电站（方向感知）
            const routeCoords = route.geometry.coordinates;
            const maxRange = truckConfig.batteryCapacity * (truckConfig.targetSOC - truckConfig.minSOC) / truckConfig.consumptionPerKm;
            const recommendedStops = RoutePlanner.recommendChargingStops(routeCoords, maxRange);
            this.displayChargingStops(recommendedStops, route.duration || 0);

            // 识别路径上的收费站（上下高速口）
            this.displayTollsOnRoute(routeCoords, routeMode);

            // 搜索沿途服务区
            const serviceAreas = await this.findServiceAreasOnRoute(routeCoords);
            this.displayServiceAreasOnRoute(serviceAreas);

        } catch (err) {
            alert('路径规划失败: ' + err.message);
        } finally {
            this.hideLoading();
        }
    },

    // 绘制所有模式的路线
    drawAllRoutes(results, primaryMode) {
        this.layers.route.clearLayers();
        const modeColors = {
            highway: '#FF6B35',     // 橙色 — 高速
            national: '#4CAF50',    // 绿色 — 国道
            shortest: '#9C27B0'     // 紫色 — 最短
        };
        const modeLabels = {
            highway: '🛣️高速',
            national: '🛤️国道',
            shortest: '📏最短'
        };

        // 先画非主路线（半透明），再画主路线（高亮）
        const drawOrder = ['highway', 'national', 'shortest'].filter(m => m !== primaryMode && results[m]);
        drawOrder.push(primaryMode);

        drawOrder.forEach(mode => {
            const route = results[mode];
            if (!route) return;
            const gcjCoords = CoordTransform.wgs84ArrayToGcj02(route.geometry.coordinates);
            const latlngs = gcjCoords.map(c => [c[1], c[0]]);
            const isPrimary = mode === primaryMode;

            // 阴影
            L.polyline(latlngs, {
                color: '#000',
                weight: isPrimary ? 7 : 4,
                opacity: isPrimary ? 0.15 : 0.08,
                lineJoin: 'round'
            }).addTo(this.layers.route);

            // 主线
            L.polyline(latlngs, {
                color: modeColors[mode],
                weight: isPrimary ? 5 : 3,
                opacity: isPrimary ? 0.9 : 0.45,
                lineJoin: 'round',
                dashArray: route.isFallback ? '10,8' : (isPrimary ? null : '8,6'),
                lineCap: 'round'
            }).addTo(this.layers.route);

            // 非主路线添加标签
            if (!isPrimary) {
                const midIdx = Math.floor(latlngs.length / 2);
                L.marker(latlngs[midIdx], {
                    icon: L.divIcon({
                        className: '',
                        html: `<div style="background:${modeColors[mode]};color:#fff;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;white-space:nowrap;opacity:0.85;">${modeLabels[mode]}</div>`,
                        iconSize: [60, 16],
                        iconAnchor: [30, 8]
                    }),
                    interactive: false
                }).addTo(this.layers.route);
            }
        });

        // 适配视图（使用主路线）
        const primaryRoute = results[primaryMode];
        if (primaryRoute) {
            const gcjCoords = CoordTransform.wgs84ArrayToGcj02(primaryRoute.geometry.coordinates);
            const latlngs = gcjCoords.map(c => [c[1], c[0]]);
            this.map.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60] });
        }
    },

    // 显示模式对比表
    displayModeComparison(results, errors, truckConfig, costConfig, primaryMode) {
        const modeLabels = {
            highway: '🛣️ 高速优先',
            national: '🛤️ 国道优先',
            shortest: '📏 最短距离'
        };
        const modeColors = {
            highway: '#FF6B35',
            national: '#4CAF50',
            shortest: '#9C27B0'
        };

        let html = '<div class="detail-section-title">⚖️ 三种路线模式对比</div>';
        html += '<div class="mode-comparison-table"><table style="width:100%;font-size:12px;border-collapse:collapse;">';
        html += '<tr style="border-bottom:2px solid var(--border);"><th style="text-align:left;padding:6px 4px;">模式</th><th style="text-align:right;padding:6px 4px;">距离</th><th style="text-align:right;padding:6px 4px;">时间</th><th style="text-align:right;padding:6px 4px;">通行费</th><th style="text-align:right;padding:6px 4px;">总费用</th></tr>';

        ['highway', 'national', 'shortest'].forEach(mode => {
            const route = results[mode];
            const isPrimary = mode === primaryMode;
            if (route) {
                const engineData = { engine: route.engine, tolls: route.tolls || 0, duration: route.duration || 0 };
                const summary = RoutePlanner.calculateTotal(route.distance, truckConfig, costConfig, mode, engineData);
                const distKm = (route.distance / 1000).toFixed(1);
                const timeStr = RoutePlanner.formatDuration(route.duration || (route.distance / 1000 / 70 * 3600));
                const tolls = summary.tollCost;
                const totalCost = summary.totalCost;
                const bg = isPrimary ? `background:rgba(0,168,107,0.08);` : '';
                html += `<tr style="border-bottom:1px solid var(--border);${bg}cursor:pointer;" onclick="App.switchRouteMode('${mode}')" title="点击切换到此路线">`;
                html += `<td style="padding:6px 4px;color:${modeColors[mode]};font-weight:${isPrimary ? '700' : '600'};">${modeLabels[mode]}${isPrimary ? ' ◀' : ''}</td>`;
                html += `<td style="text-align:right;padding:6px 4px;">${distKm}km</td>`;
                html += `<td style="text-align:right;padding:6px 4px;">${timeStr}</td>`;
                html += `<td style="text-align:right;padding:6px 4px;">${tolls}元</td>`;
                html += `<td style="text-align:right;padding:6px 4px;font-weight:${isPrimary ? '700' : '600'};color:${isPrimary ? 'var(--primary)' : 'var(--text)'};">${totalCost}元</td>`;
                html += '</tr>';
            } else {
                html += `<tr style="border-bottom:1px solid var(--border);opacity:0.5;"><td style="padding:6px 4px;">${modeLabels[mode]}</td><td colspan="4" style="padding:6px 4px;text-align:center;color:var(--text-secondary);font-size:11px;">${errors[mode] || '规划失败'}</td></tr>`;
            }
        });
        html += '</table></div>';
        html += '<div style="font-size:10px;color:var(--text-secondary);margin-top:4px;">💡 点击任意模式行可切换主路线，三种路线以不同颜色显示在地图上</div>';

        // 插入到路径详情的最前面
        const details = document.getElementById('route-details');
        const currentHtml = details.innerHTML;
        details.innerHTML = html + currentHtml;
    },

    // 切换主路线模式（无需重新请求API）
    switchRouteMode(mode) {
        if (!this.state.allModeRoutes || !this.state.allModeRoutes[mode]) return;

        const route = this.state.allModeRoutes[mode];
        this.state.routeData = route;
        this.state.routeMode = mode;

        // 更新单选按钮选中状态
        const radio = document.querySelector(`input[name="route-mode"][value="${mode}"]`);
        if (radio) {
            radio.checked = true;
            document.querySelectorAll('.route-mode-option').forEach(opt => {
                opt.classList.toggle('active', opt.querySelector('input').checked);
            });
        }

        // 重新绘制路线
        this.drawAllRoutes(this.state.allModeRoutes, mode);

        // 更新费用计算
        const truckConfig = this.getTruckConfig();
        const costConfig = this.getCostConfig();
        const engineData = { engine: route.engine, tolls: route.tolls || 0, duration: route.duration || 0 };
        const summary = RoutePlanner.calculateTotal(route.distance, truckConfig, costConfig, mode, engineData);
        this.displayRouteDetails(route, summary, truckConfig, costConfig, mode);

        // 重新显示模式对比
        this.displayModeComparison(this.state.allModeRoutes, this.state.allModeErrors || {}, truckConfig, costConfig, mode);

        // 更新推荐充电站
        const routeCoords = route.geometry.coordinates;
        const maxRange = truckConfig.batteryCapacity * (truckConfig.targetSOC - truckConfig.minSOC) / truckConfig.consumptionPerKm;
        const recommendedStops = RoutePlanner.recommendChargingStops(routeCoords, maxRange);
        this.displayChargingStops(recommendedStops, route.duration || 0);
        this.displayTollsOnRoute(routeCoords, mode);
        // 异步搜索服务区
        this.findServiceAreasOnRoute(routeCoords).then(sa => this.displayServiceAreasOnRoute(sa));
    },

    drawRoute(route) {
        // 将 WGS-84 路径坐标转为 GCJ-02（适配高德瓦片）
        const gcjCoords = CoordTransform.wgs84ArrayToGcj02(route.geometry.coordinates);
        const latlngs = gcjCoords.map(c => [c[1], c[0]]);

        // 路径阴影
        L.polyline(latlngs, {
            color: '#000',
            weight: 7,
            opacity: 0.15,
            lineJoin: 'round'
        }).addTo(this.layers.route);

        // 主路径
        L.polyline(latlngs, {
            color: '#FF6B35',
            weight: 5,
            opacity: 0.9,
            lineJoin: 'round',
            dashArray: route.isFallback ? '10,8' : null
        }).addTo(this.layers.route);

        // 适配视图
        this.map.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60] });
    },

    displayRouteDetails(route, summary, truckConfig, costConfig, routeMode) {
        const panel = document.getElementById('route-info');
        const details = document.getElementById('route-details');
        panel.style.display = 'block';

        const etc = summary.etc;
        const ch = summary.charging;
        const fallbackNote = route.isFallback ? '<div style="color:#e65100;font-size:11px;margin-bottom:6px;">⚠️ 在线路径服务不可用，以下为直线距离估算（实际路程约为1.3倍）</div>' : '';

        const engineLabel = route.engine === 'amap-truck' ? '高德货车导航' : route.engine === 'amap' ? '高德导航引擎' : route.engine === 'osrm' ? 'OSRM引擎' : '估算';
        const truckModeNote = route.engine === 'amap-truck'
            ? '<div style="color:#E91E63;font-size:11px;margin-bottom:6px;">🚛 货车专用导航已启用：自动规避限行路段、禁行区域、限高限重桥梁</div>'
            : '';
        const engineNote = `<div style="color:#1976D2;font-size:11px;margin-bottom:6px;">🧭 导航引擎：${engineLabel}${etc.source ? ' · ' + etc.source : ''}</div>`;

        // 限行规避提示
        let restrictionNote = '';
        if (route.restrictionWarnings && route.restrictionWarnings.length > 0) {
            restrictionNote = '<div style="color:#FF6B35;font-size:11px;margin-bottom:6px;">⚠️ 路线已规避 ' + route.restrictionWarnings.length + ' 处货车限行/禁行区域</div>';
        }

        const modeLabels = {
            highway: '🛣️ 高速优先',
            national: '🛤️ 国道优先',
            shortest: '📏 最短距离'
        };
        const modeNote = routeMode === 'national'
            ? '<div style="color:#1976D2;font-size:11px;margin-bottom:6px;">ℹ️ 国道模式：免高速费，均速较低约45km/h，路程可能略长</div>'
            : routeMode === 'shortest'
            ? '<div style="color:#FF6B35;font-size:11px;margin-bottom:6px;">ℹ️ 最短距离模式：优先选择最短路径</div>'
            : '';

        const etcSection = routeMode === 'national'
            ? `<div class="detail-section-title">🛣️ 高速费用（国道模式）</div>
               <div class="detail-row"><span class="label">通行费</span><span class="value green">0 元（国道免费）</span></div>`
            : `<div class="detail-section-title">🛣️ 高速ETC费用（6轴重卡）</div>
               <div class="detail-row"><span class="label">费率</span><span class="value">${etc.ratePerKm} 元/km</span></div>
               <div class="detail-row"><span class="label">原价</span><span class="value">${etc.etcCost} 元</span></div>
               <div class="detail-row"><span class="label">ETC 95折</span><span class="value green">${etc.etcCostDiscounted} 元</span></div>
               <div class="detail-row"><span class="label">ETC节省</span><span class="value green">${etc.savings} 元</span></div>
               <div class="detail-row"><span class="label" style="font-size:11px;color:#999;">数据来源</span><span class="value" style="font-size:11px;color:#999;">${etc.source}</span></div>`;

        details.innerHTML = `
            ${fallbackNote}
            ${engineNote}
            ${truckModeNote}
            ${restrictionNote}
            ${modeNote}
            <div class="route-detail-card">
                <div class="detail-section-title">📊 路径概况</div>
                <div class="detail-row"><span class="label">路线模式</span><span class="value">${modeLabels[routeMode] || '高速优先'}</span></div>
                <div class="detail-row"><span class="label">总距离</span><span class="value">${summary.distanceKm} 公里</span></div>
                <div class="detail-row"><span class="label">行驶时间</span><span class="value">${summary.drivingTime}</span></div>
                <div class="detail-row"><span class="label">含充电总时间</span><span class="value">${summary.totalHours} 小时</span></div>

                ${etcSection}

                <div class="detail-section-title">⚡ 充电费用</div>
                <div class="detail-row"><span class="label">百公里能耗</span><span class="value">${ch.consumptionPer100km} kWh</span></div>
                <div class="detail-row"><span class="label">总能耗</span><span class="value">${ch.totalEnergy} kWh</span></div>
                <div class="detail-row"><span class="label">电池容量</span><span class="value">${ch.batteryCapacity} kWh</span></div>
                <div class="detail-row"><span class="label">满电续航</span><span class="value">${ch.maxRangePerCharge} km</span></div>
                <div class="detail-row"><span class="label">需充电次数</span><span class="value highlight">${ch.chargingStops} 次</span></div>
                <div class="detail-row"><span class="label">每次充电</span><span class="value">${ch.energyPerStop} kWh / ${ch.chargingTimePerStop}h</span></div>
                <div class="detail-row"><span class="label">总充电时间</span><span class="value">${ch.totalChargingTime} 小时</span></div>
                <div class="detail-row"><span class="label">谷时费用</span><span class="value green">${ch.offPeakCost} 元</span></div>
                <div class="detail-row"><span class="label">平均费用</span><span class="value">${ch.avgChargingCost} 元</span></div>
                <div class="detail-row"><span class="label">峰时费用</span><span class="value">${ch.peakCost} 元</span></div>
                <div class="detail-row"><span class="label">每公里电费</span><span class="value">${ch.costPerKm} 元/km</span></div>

                <div class="detail-section-title">💰 费用汇总</div>
                <div class="detail-row"><span class="label">通行费</span><span class="value">${summary.tollCost} 元</span></div>
                <div class="detail-row"><span class="label">充电费用</span><span class="value">${ch.avgChargingCost} 元</span></div>
                <div class="detail-row"><span class="label">司机成本</span><span class="value">${summary.driverCost} 元</span></div>
                <div class="detail-row" style="border-top:2px solid var(--primary);margin-top:4px;padding-top:8px;">
                    <span class="label" style="font-weight:700;">电动重卡总费用</span>
                    <span class="value highlight green" style="font-size:18px;">${summary.totalCost} 元</span>
                </div>
            </div>

            <div class="comparison-box">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span>🔋 柴油重卡总费用</span>
                    <span style="font-weight:700;">${summary.dieselTotal} 元</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                    <span>⚡ 电动重卡节省</span>
                    <span class="savings">${summary.savings} 元</span>
                </div>
                <div style="text-align:right;font-size:12px;color:var(--primary);margin-top:2px;">
                    节省比例 ${summary.savingsPercent}%
                </div>
            </div>

            <div id="charging-stops-list" style="margin-top:10px;"></div>
        `;

        // 滚动到路径详情
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    displayChargingStops(stops, routeDuration = 0) {
        const container = document.getElementById('charging-stops-list');
        if (!stops.length) {
            container.innerHTML = '';
            return;
        }

        let html = '<div class="detail-section-title">🔌 推荐充电停靠站（含方向匹配 · 可自定义充电时间）</div>';
        const totalDriveMin = routeDuration > 0 ? routeDuration / 60 : stops.length * 120;

        stops.forEach((s, i) => {
            const powerText = s.powerKW > 0 ? `${s.powerKW}kW` : '换电';
            const dirIcon = s.directionMatch ? '✅' : (s.direction === '双向' ? '🔄' : '⚠️');
            const rt = RealTimeData.getStationRealTime(s);

            // 估算到达时间（按等距分布估算）
            const arrivalMin = totalDriveMin * (i + 1) / (stops.length + 1);
            const arrivalTime = this.estimateArrivalTime(arrivalMin);
            const arrivalStr = `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`;

            // 默认充电时间（分钟）
            const defaultDuration = Math.round((s.needEnergy || 300) / (s.powerKW || 360) * 60 / (this.getTruckConfig().chargingEfficiency));
            const customDuration = this.state.customChargeTimes[s.id] || defaultDuration;

            // 计算费用
            const costCalc = this.calculateChargingCostWithTime(s, arrivalTime, customDuration);

            html += `
                <div class="charging-stop-item" style="flex-direction:column;align-items:stretch;gap:4px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div class="stop-icon">${i + 1}</div>
                        <div style="flex:1;">
                            <div style="font-weight:600;">${s.name}</div>
                            <div style="color:var(--text-secondary);font-size:11px;">${s.highway} · ${powerText} · 距路径${s.distanceFromRoute}km</div>
                        </div>
                    </div>
                    <div style="margin-left:32px;font-size:11px;">
                        <div style="color:var(--secondary);">🧭 ${s.directionNote}</div>
                        <div style="color:var(--text-secondary);">📡 ${rt.period} · ¥${rt.currentPrice}/度${rt.touEnabled ? '(分时)' : ''} · ${rt.availableChargers}/${rt.totalChargers}桩可用</div>
                        <div style="color:var(--text-secondary);">⏰ 预计到达 ${arrivalStr}</div>
                        ${s.phone ? `<div>📞 <a href="tel:${s.phone}" style="color:var(--primary);">${s.phone}</a></div>` : ''}
                    </div>
                    <div class="charge-time-control" style="margin-left:32px;">
                        <label>充电时长</label>
                        <input type="number" class="charge-time-input" id="charge-time-${s.id}" value="${customDuration}" min="5" max="240" step="5" onchange="App.updateChargeCost('${s.id}', ${i}, this.value)">
                        <span class="charge-time-unit">分钟</span>
                        <span style="margin-left:auto;font-weight:600;color:var(--primary);" id="charge-cost-total-${s.id}">¥${costCalc.totalCost}</span>
                    </div>
                    <div class="charge-cost-detail" style="margin-left:32px;" id="charge-cost-detail-${s.id}">
                        <div class="charge-cost-row"><span>充电电量</span><span>${costCalc.totalEnergy} kWh</span></div>
                        <div class="charge-cost-row"><span>${costCalc.touEnabled ? '平段基准价' : '综合电价'}</span><span>¥${costCalc.basePrice || costCalc.avgPrice}/度 ${costCalc.touEnabled ? `(服务费¥${costCalc.serviceFee})` : ''} <span style="font-size:10px;color:#999;">(${costCalc.priceSource || '运营商默认'})</span></span></div>
                        ${costCalc.touEnabled ? `<div class="charge-cost-row"><span>计费方式</span><span style="color:var(--primary);">⚡ 分时计费（电费随峰谷浮动）</span></div>` : `<div class="charge-cost-row"><span>计费方式</span><span style="color:#999;">全天统一价</span></div>`}
                        <div class="charge-cost-row"><span>充电时段</span><span style="font-size:11px;">${costCalc.segments.map(seg => `${seg.startTime}-${seg.endTime} ${seg.period} ¥${seg.price}/度`).join(' | ')}</span></div>
                        <div class="charge-cost-row"><span>平均单价</span><span>¥${costCalc.avgPrice}/度</span></div>
                        <div class="charge-cost-row total"><span>充电费用</span><span>¥${costCalc.totalCost}</span></div>
                    </div>
                </div>`;
        });
        container.innerHTML = html;
    },

    // 更新单个充电站的费用（用户修改充电时间后调用）
    updateChargeCost(stationId, stopIndex, durationMin) {
        durationMin = parseInt(durationMin) || 60;
        this.state.customChargeTimes[stationId] = durationMin;

        // 找到站点数据
        const station = MAP_DATA.chargingStations.find(c => c.id === stationId);
        if (!station) return;

        // 重新计算到达时间（使用相同的估算逻辑）
        const route = this.state.routeData;
        const totalDriveMin = route && route.duration ? route.duration / 60 : 120;
        // 需要重新获取stops来知道index — 简化处理：使用stopIndex+1的比例
        const stopsCount = Object.keys(this.state.customChargeTimes).length || 1;
        const arrivalMin = totalDriveMin * (stopIndex + 1) / (stopsCount + 1);
        const arrivalTime = this.estimateArrivalTime(arrivalMin);

        const costCalc = this.calculateChargingCostWithTime(station, arrivalTime, durationMin);

        // 更新DOM
        const totalEl = document.getElementById(`charge-cost-total-${stationId}`);
        const detailEl = document.getElementById(`charge-cost-detail-${stationId}`);
        if (totalEl) totalEl.textContent = `¥${costCalc.totalCost}`;
        if (detailEl) {
            detailEl.innerHTML = `
                <div class="charge-cost-row"><span>充电电量</span><span>${costCalc.totalEnergy} kWh</span></div>
                <div class="charge-cost-row"><span>${costCalc.touEnabled ? '平段基准价' : '综合电价'}</span><span>¥${costCalc.basePrice || costCalc.avgPrice}/度 ${costCalc.touEnabled ? `(服务费¥${costCalc.serviceFee})` : ''} <span style="font-size:10px;color:#999;">(${costCalc.priceSource || '运营商默认'})</span></span></div>
                ${costCalc.touEnabled ? `<div class="charge-cost-row"><span>计费方式</span><span style="color:var(--primary);">⚡ 分时计费（电费随峰谷浮动）</span></div>` : `<div class="charge-cost-row"><span>计费方式</span><span style="color:#999;">全天统一价</span></div>`}
                <div class="charge-cost-row"><span>充电时段</span><span style="font-size:11px;">${costCalc.segments.map(seg => `${seg.startTime}-${seg.endTime} ${seg.period} ¥${seg.price}/度`).join(' | ')}</span></div>
                <div class="charge-cost-row"><span>平均单价</span><span>¥${costCalc.avgPrice}/度</span></div>
                <div class="charge-cost-row total"><span>充电费用</span><span>¥${costCalc.totalCost}</span></div>`;
        }
    },

    // 显示路径上的收费站（只显示上高速口和下高速口）
    displayTollsOnRoute(routeCoords, routeMode) {
        const tollsOnRoute = this.findNearestTolls(routeCoords);
        if (!tollsOnRoute.length) return;

        // 找到详情容器
        const details = document.getElementById('route-details');
        if (!details) return;

        // 识别上下高速口：路径前30%为上高速区域，后30%为下高速区域
        const entryTolls = tollsOnRoute.filter(t => parseInt(t.routeProgress) < 30);
        const exitTolls = tollsOnRoute.filter(t => parseInt(t.routeProgress) > 70);

        let html = '<div class="detail-section-title">🚧 上/下高速收费站</div>';

        if (entryTolls.length > 0) {
            // 取最近的1-2个作为上高速口
            const bestEntry = entryTolls[0];
            html += '<div style="font-size:11px;color:var(--secondary);margin-bottom:4px;font-weight:600;">⬆️ 上高速口</div>';
            html += `<div class="toll-on-route"><div class="toll-icon" style="background:var(--secondary);">↑</div><span style="font-weight:600;">${bestEntry.name}</span></div>`;
            html += `<div style="font-size:10px;color:var(--text-secondary);margin-left:36px;margin-bottom:6px;">${bestEntry.highway} · 距起点${bestEntry.distanceFromRoute}km</div>`;
        }

        if (exitTolls.length > 0) {
            // 取最后1-2个作为下高速口
            const bestExit = exitTolls[exitTolls.length - 1];
            html += '<div style="font-size:11px;color:var(--accent);margin:6px 0 4px;font-weight:600;">⬇️ 下高速口</div>';
            html += `<div class="toll-on-route"><div class="toll-icon" style="background:var(--accent);">↓</div><span style="font-weight:600;">${bestExit.name}</span></div>`;
            html += `<div style="font-size:10px;color:var(--text-secondary);margin-left:36px;">${bestExit.highway} · 距终点${bestExit.distanceFromRoute}km</div>`;
        }

        if (entryTolls.length === 0 && exitTolls.length === 0) {
            html += '<div style="font-size:11px;color:var(--text-secondary);">路径2km范围内未识别到收费站</div>';
        }

        // 插入到充电站列表之前
        const stopsList = document.getElementById('charging-stops-list');
        if (stopsList) {
            const wrapper = document.createElement('div');
            wrapper.id = 'tolls-on-route-section';
            wrapper.innerHTML = html;
            stopsList.parentNode.insertBefore(wrapper, stopsList);
        } else {
            details.innerHTML += html;
        }
    },

    clearRoute(clearPoints = true) {
        this.layers.route.clearLayers();
        // 清除收费站识别区域
        const tollsSection = document.getElementById('tolls-on-route-section');
        if (tollsSection) tollsSection.remove();
        // 清除服务区区域
        const saSection = document.getElementById('service-areas-section');
        if (saSection) saSection.remove();
        if (clearPoints) {
            this.layers.waypoints.clearLayers();
            this.state.startPoint = null;
            this.state.endPoint = null;
            this.state.waypoints = [];
            this.state.routeData = null;
            this.state.allModeRoutes = null;
            this.state.allModeErrors = null;
            this.state.customChargeTimes = {};  // 清除自定义充电时间
            this.updateRouteDisplay();
            document.getElementById('route-info').style.display = 'none';
        }
    },

    // ========== 图层切换 ==========
    toggleLayer(name, checked) {
        if (!this.layers[name]) return;
        if (checked) {
            this.map.addLayer(this.layers[name]);
            // 充电站图层重新启用后，恢复所有标记再应用筛选
            if (name === 'charging') {
                this.markers.charging.forEach(m => {
                    if (!this.layers.charging.hasLayer(m)) this.layers.charging.addLayer(m);
                });
                this.updateMarkerVisibility();
            } else if (name === 'carCharging') {
                this.markers.carCharging.forEach(m => {
                    if (!this.layers.carCharging.hasLayer(m)) this.layers.carCharging.addLayer(m);
                });
                this.updateMarkerVisibility();
            } else if (name === 'tolls') {
                this.markers.tolls.forEach(m => {
                    if (!this.layers.tolls.hasLayer(m)) this.layers.tolls.addLayer(m);
                });
                this.updateMarkerVisibility();
            }
        } else {
            this.map.removeLayer(this.layers[name]);
        }
    },

    // ========== 地图类型切换 ==========
    toggleMapType() {
        // 循环切换：standard → satellite → detailed → standard
        const cycle = { standard: 'satellite', satellite: 'detailed', detailed: 'standard' };
        const next = cycle[this.state.mapType] || 'standard';
        this.switchTileLayer(next);
    },

    // 图层切换面板显隐
    toggleLayerSwitchPanel() {
        const panel = document.getElementById('layer-switch-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    },

    // 切换瓦片图层
    switchTileLayer(mode) {
        // 移除当前所有瓦片层
        Object.values(this.tileLayers).forEach(l => {
            if (this.map.hasLayer(l)) this.map.removeLayer(l);
        });

        if (mode === 'standard') {
            this.tileLayers.standard.addTo(this.map);
        } else if (mode === 'detailed') {
            this.tileLayers.detailed.addTo(this.map);
        } else if (mode === 'satellite') {
            this.tileLayers.satellite.addTo(this.map);
            this.tileLayers.satelliteLabel.addTo(this.map);
        } else if (mode === 'hybrid') {
            this.tileLayers.satellite.addTo(this.map);
            this.tileLayers.standard.addTo(this.map);
            this.tileLayers.standard.setOpacity(0.6);
            this.tileLayers.satelliteLabel.addTo(this.map);
        }

        // 恢复standard的不透明度（从hybrid切回时）
        if (mode !== 'hybrid') {
            this.tileLayers.standard.setOpacity(1);
        }

        // 如果路况开启，确保路况层在最上层
        if (this.state.showTraffic && this.map.hasLayer(this.trafficLayer)) {
            this.trafficLayer.bringToFront();
        }

        this.state.mapType = mode;

        // 更新图层切换面板高亮
        document.querySelectorAll('.layer-switch-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.tile === mode);
        });
    },

    // 实时路况开关
    toggleTraffic() {
        this.state.showTraffic = !this.state.showTraffic;
        const btn = document.getElementById('btn-traffic');
        if (this.state.showTraffic) {
            this.trafficLayer.addTo(this.map);
            this.trafficLayer.bringToFront();
            btn.classList.add('active');
        } else {
            this.map.removeLayer(this.trafficLayer);
            btn.classList.remove('active');
        }
    },

    // ========== 峰谷电价悬浮组件 ==========
    updateElecWidget() {
        const period = RealTimeData.getCurrentPeriod();
        const periodLabel = document.getElementById('elec-period-label');
        const priceLabel = document.getElementById('elec-price-label');
        const timeLabel = document.getElementById('elec-time-label');
        const rangeLabel = document.getElementById('elec-range-label');
        if (!periodLabel || !priceLabel) return;

        const periodColors = {
            offPeak: '#4CAF50',
            midPeak: '#2196F3',
            onPeak: '#FF6B35',
            sharpPeak: '#f44336',
            deepValley: '#2E7D32'
        };
        const periodNames = {
            offPeak: '低谷',
            midPeak: '平段',
            onPeak: '高峰',
            sharpPeak: '尖峰',
            deepValley: '深谷'
        };

        // 显示当前时段信息 + 参考电价范围
        const costConfig = this.getCostConfig();
        const defaultPrice = costConfig.defaultPricePerKwh;

        // 计算当前时段下，分时站点的大致电价范围
        const tou = MAP_DATA.timeOfUse;
        const multiplier = tou.multipliers[period.type] || 1.0;
        const defaultServiceFee = 0.40;
        const defaultElecBase = defaultPrice - defaultServiceFee;
        const touAdjustedPrice = (defaultElecBase * multiplier + defaultServiceFee).toFixed(2);

        periodLabel.textContent = periodNames[period.type] || '平段';
        periodLabel.style.color = periodColors[period.type] || '#2196F3';
        // 显示参考电价：分时站点在当前时段的估算价
        priceLabel.textContent = `¥${touAdjustedPrice}/度`;
        priceLabel.style.color = periodColors[period.type] || '#2196F3';

        // 显示当前时间
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
        if (timeLabel) {
            timeLabel.textContent = `🕐 ${timeStr}`;
        }

        // 根据当前月份和时段，生成时间轴
        const month = now.getMonth() + 1;
        const isSummerWinter = tou.summerWinterMonths.includes(month);
        const slots = isSummerWinter ? tou.summer : tou.transition;
        const minutes = now.getHours() * 60 + now.getMinutes();

        // 显示当前时段起止时间
        const currentSlot = slots.find(s => minutes >= s.start && minutes < s.end);
        if (rangeLabel && currentSlot) {
            const fmtTime = (m) => {
                const h = Math.floor(m / 60);
                const mm = m % 60;
                return `${h.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`;
            };
            rangeLabel.textContent = `⏱️ ${fmtTime(currentSlot.start)} - ${fmtTime(currentSlot.end)}`;
            rangeLabel.style.color = periodColors[currentSlot.type] || '#2196F3';
        }

        // 更新展开后的时间轴
        const timeline = document.getElementById('elec-timeline');
        if (timeline) {
            let html = '';
            slots.forEach(s => {
                const isCurrent = minutes >= s.start && minutes < s.end;
                const label = tou.labels[s.type];
                const duration = s.end - s.start;
                html += `<div class="elec-timeline-slot ${s.type} ${isCurrent ? 'current' : ''}" style="flex:${duration};">${label}</div>`;
            });
            timeline.innerHTML = html;
        }
    },

    getNextPeriodChange() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const minutes = now.getHours() * 60 + now.getMinutes();
        const tou = MAP_DATA.timeOfUse;
        const isSummerWinter = tou.summerWinterMonths.includes(month);
        const slots = isSummerWinter ? tou.summer : tou.transition;

        for (const s of slots) {
            if (s.start > minutes) {
                const h = Math.floor(s.start / 60);
                const m = s.start % 60;
                return {
                    label: tou.labels[s.type],
                    timeStr: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                };
            }
        }
        // 跨日：下一个时段是次日凌晨低谷
        return { label: tou.labels.offPeak, timeStr: '00:00' };
    },

    // ========== 自定义充电时间与费用计算 ==========
    calculateChargingCostWithTime(station, arrivalTime, durationMin) {
        // 使用站点实际电价（来自运营商/网络调研）
        // 分时站点(touEnabled=true)：电费部分按峰谷倍率浮动，服务费固定
        // 非分时站点(touEnabled=false)：全天统一价
        const priceInfo = RealTimeData.getStationPrice(station);
        const power = station.powerKW || 360;
        const truckConfig = this.getTruckConfig();
        const efficiency = truckConfig.chargingEfficiency;

        const durationHours = durationMin / 60;
        const energy = power * durationHours * efficiency;

        const tou = MAP_DATA.timeOfUse;
        const month = arrivalTime.getMonth() + 1;
        const isSummerWinter = tou.summerWinterMonths.includes(month);
        const slots = isSummerWinter ? tou.summer : tou.transition;

        // 按每15分钟分段计算（更精确地捕捉时段切换点）
        const segmentSize = 15;
        const segments = Math.ceil(durationMin / segmentSize);
        let totalCost = 0;
        const segmentDetails = [];

        // 用于合并相同时段的连续分段
        let mergedDetails = [];

        for (let i = 0; i < segments; i++) {
            const segStart = new Date(arrivalTime.getTime() + i * segmentSize * 60000);
            const segEnd = new Date(arrivalTime.getTime() + Math.min((i + 1) * segmentSize, durationMin) * 60000);
            const segDurationMin = (segEnd - segStart) / 60000;
            const segHours = segDurationMin / 60;
            const segEnergy = power * segHours * efficiency;

            // 确定该分段的时段
            const segMinutes = segStart.getHours() * 60 + segStart.getMinutes();
            let periodType = 'midPeak';
            for (const s of slots) {
                if (segMinutes >= s.start && segMinutes < s.end) {
                    periodType = s.type;
                    break;
                }
            }
            const periodLabel = tou.labels[periodType];
            const multiplier = tou.multipliers[periodType];

            // 计算该分段的实际电价
            let segPrice;
            if (priceInfo.touEnabled) {
                // 分时计费：电费部分 × 倍率 + 服务费
                const segElectricity = priceInfo.electricityBase * multiplier;
                segPrice = segElectricity + priceInfo.serviceFee;
            } else {
                // 非分时：统一价
                segPrice = priceInfo.pricePerKwh;
            }

            const segCost = segEnergy * segPrice;
            totalCost += segCost;

            // 合并相同时段+同价格的连续分段
            const lastMerged = mergedDetails[mergedDetails.length - 1];
            if (lastMerged && lastMerged.period === periodLabel && Math.abs(lastMerged.price - segPrice) < 0.001) {
                // 合并到上一个分段
                lastMerged.endTime = `${segEnd.getHours().toString().padStart(2, '0')}:${segEnd.getMinutes().toString().padStart(2, '0')}`;
                lastMerged.energy = (parseFloat(lastMerged.energy) + segEnergy).toFixed(1);
                lastMerged.cost = (parseFloat(lastMerged.cost) + segCost).toFixed(1);
            } else {
                mergedDetails.push({
                    period: periodLabel,
                    periodType,
                    multiplier: priceInfo.touEnabled ? multiplier : 1.0,
                    startTime: `${segStart.getHours().toString().padStart(2, '0')}:${segStart.getMinutes().toString().padStart(2, '0')}`,
                    endTime: `${segEnd.getHours().toString().padStart(2, '0')}:${segEnd.getMinutes().toString().padStart(2, '0')}`,
                    energy: segEnergy.toFixed(1),
                    price: segPrice.toFixed(2),
                    cost: segCost.toFixed(1)
                });
            }
        }

        return {
            totalEnergy: energy.toFixed(1),
            totalCost: totalCost.toFixed(1),
            avgPrice: (totalCost / energy).toFixed(2),
            priceSource: priceInfo.source,
            touEnabled: priceInfo.touEnabled,
            basePrice: priceInfo.pricePerKwh.toFixed(2),
            serviceFee: priceInfo.serviceFee.toFixed(2),
            segments: mergedDetails,
            durationMin: durationMin,
            durationStr: `${Math.floor(durationMin / 60)}h${(durationMin % 60).toString().padStart(2, '0')}m`
        };
    },

    // 计算到达充电站的预估时间
    estimateArrivalTime(cumulativeDriveMinutes) {
        const now = new Date();
        return new Date(now.getTime() + cumulativeDriveMinutes * 60000);
    },

    // ========== 路径上的收费站识别 ==========
    findNearestTolls(routeCoords, maxDist = 2000) {
        if (typeof TOLL_STATIONS === 'undefined') return [];
        const results = [];
        const routeCoordsWgs = routeCoords; // 已是 WGS-84

        TOLL_STATIONS.forEach(toll => {
            let minDist = Infinity;
            let nearestIdx = 0;
            for (let i = 0; i < routeCoordsWgs.length; i++) {
                const dx = routeCoordsWgs[i][0] - toll.lng;
                const dy = routeCoordsWgs[i][1] - toll.lat;
                const dist = Math.sqrt(dx * dx + dy * dy) * 111000; // 粗略距离(米)
                if (dist < minDist) {
                    minDist = dist;
                    nearestIdx = i;
                }
            }
            if (minDist < maxDist) {
                results.push({
                    ...toll,
                    distanceFromRoute: (minDist / 1000).toFixed(1),
                    routeProgress: (nearestIdx / routeCoordsWgs.length * 100).toFixed(0),
                    routeIndex: nearestIdx
                });
            }
        });

        // 按路径进度排序
        results.sort((a, b) => a.routeIndex - b.routeIndex);
        return results;
    },

    // 查找路径沿途的服务区
    async findServiceAreasOnRoute(routeCoords) {
        const results = [];
        const seen = new Set();

        // 策略1: 从已有充电站数据中提取服务区
        MAP_DATA.chargingStations.forEach(s => {
            if (s.name && s.name.includes('服务区')) {
                let minDist = Infinity;
                let nearestIdx = 0;
                for (let i = 0; i < routeCoords.length; i++) {
                    const dx = routeCoords[i][0] - s.lng;
                    const dy = routeCoords[i][1] - s.lat;
                    const dist = Math.sqrt(dx * dx + dy * dy) * 111000;
                    if (dist < minDist) { minDist = dist; nearestIdx = i; }
                }
                if (minDist < 5000) { // 5km范围内
                    const nameKey = s.name.substring(0, 6);
                    if (!seen.has(nameKey)) {
                        seen.add(nameKey);
                        results.push({
                            name: s.name,
                            highway: s.highway,
                            hasCharging: true,
                            distanceFromRoute: (minDist / 1000).toFixed(1),
                            routeProgress: (nearestIdx / routeCoords.length * 100).toFixed(0),
                            lng: s.lng, lat: s.lat
                        });
                    }
                }
            }
        });

        // 策略2: 通过高德POI API搜索路径沿途服务区
        const amapKey = RoutePlanner.getAmapKey();
        if (amapKey) {
            // 沿路径采样5个点搜索附近服务区
            const samplePoints = [];
            const step = Math.max(1, Math.floor(routeCoords.length / 6));
            for (let i = step; i < routeCoords.length - step; i += step) {
                samplePoints.push(routeCoords[i]);
            }

            for (const pt of samplePoints) {
                try {
                    const [gLng, gLat] = CoordTransform.wgs84togcj02(pt[0], pt[1]);
                    const url = `https://restapi.amap.com/v3/place/around?key=${amapKey}&location=${gLng},${gLat}&keywords=服务区&radius=10000&offset=15&output=json`;
                    const resp = await fetch(url);
                    const data = await resp.json();
                    if (data.pois) {
                        data.pois.forEach(poi => {
                            if (poi.name && poi.name.includes('服务区') && poi.location) {
                                const [plng, plat] = poi.location.split(',').map(Number);
                                const [wLng, wLat] = CoordTransform.gcj02towgs84(plng, plat);
                                const nameKey = poi.name.substring(0, 6);
                                if (!seen.has(nameKey)) {
                                    seen.add(nameKey);
                                    // 计算到路径的最近距离
                                    let minDist = Infinity;
                                    let nearestIdx = 0;
                                    for (let i = 0; i < routeCoords.length; i++) {
                                        const dx = routeCoords[i][0] - wLng;
                                        const dy = routeCoords[i][1] - wLat;
                                        const dist = Math.sqrt(dx * dx + dy * dy) * 111000;
                                        if (dist < minDist) { minDist = dist; nearestIdx = i; }
                                    }
                                    if (minDist < 5000) {
                                        results.push({
                                            name: poi.name,
                                            highway: poi.address || '',
                                            hasCharging: false,
                                            distanceFromRoute: (minDist / 1000).toFixed(1),
                                            routeProgress: (nearestIdx / routeCoords.length * 100).toFixed(0),
                                            lng: wLng, lat: wLat
                                        });
                                    }
                                }
                            }
                        });
                    }
                } catch(e) { /* 忽略API错误 */ }
            }
        }

        results.sort((a, b) => parseInt(a.routeProgress) - parseInt(b.routeProgress));
        return results;
    },

    // 显示路径沿途服务区
    displayServiceAreasOnRoute(serviceAreas) {
        if (!serviceAreas.length) return;
        const stopsList = document.getElementById('charging-stops-list');
        if (!stopsList) return;

        let html = '<div class="detail-section-title">🛣️ 沿途服务区</div>';
        serviceAreas.forEach(s => {
            const chargeIcon = s.hasCharging ? '⚡' : '🅿️';
            const chargeLabel = s.hasCharging ? '<span style="color:var(--secondary);font-size:10px;">有充电</span>' : '';
            html += `<div class="toll-on-route" style="margin-bottom:2px;">
                <div class="toll-icon" style="background:#795548;">${chargeIcon}</div>
                <span>${s.name} ${chargeLabel} <span style="color:var(--text-secondary);font-size:10px;">· 距路径${s.distanceFromRoute}km</span></span>
            </div>`;
        });

        const wrapper = document.createElement('div');
        wrapper.id = 'service-areas-section';
        wrapper.innerHTML = html;
        stopsList.parentNode.insertBefore(wrapper, stopsList);
    },

    // ========== 侧边栏 ==========
    initSidebar() {
        // 桌面端默认显示
        if (window.innerWidth > 768) {
            this.state.sidebarOpen = true;
        }
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        this.state.sidebarOpen = !this.state.sidebarOpen;

        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open', this.state.sidebarOpen);
            overlay.classList.toggle('show', this.state.sidebarOpen);
        }
    },

    // ========== 统计 ==========
    updateStats() {
        const hqEl = document.getElementById('stat-hq');
        if (hqEl) hqEl.textContent = MAP_DATA.headquarters.length;
        document.getElementById('stat-factories').textContent = MAP_DATA.factories.length;
        document.getElementById('stat-car-charging').textContent = MAP_DATA.carChargingStations.length;
        document.getElementById('stat-charging').textContent = MAP_DATA.chargingStations.length;
        const totalChargers = MAP_DATA.chargingStations.reduce((sum, c) => sum + c.chargers, 0);
        document.getElementById('stat-chargers').textContent = totalChargers;
        const totalSpaces = MAP_DATA.chargingStations.reduce((sum, c) => sum + c.truckSpaces, 0);
        document.getElementById('stat-spaces').textContent = totalSpaces;
        const tollEl = document.getElementById('stat-tolls');
        if (tollEl) tollEl.textContent = (typeof TOLL_STATIONS !== 'undefined') ? TOLL_STATIONS.length : 0;
    },

    // ========== 加载状态 ==========
    showLoading(text = '加载中...') {
        const overlay = document.getElementById('loading-overlay');
        document.getElementById('loading-text').textContent = text;
        overlay.classList.add('show');
    },

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('show');
    },

    // ========== 电价配置持久化 ==========
    PRICE_STORAGE_KEY: 'lantuo_price_config',

    loadPriceConfig() {
        const saved = localStorage.getItem(this.PRICE_STORAGE_KEY);
        if (!saved) return;
        try {
            const config = JSON.parse(saved);
            const fields = {
                'param-battery': config.batteryCapacity,
                'param-consumption': config.consumptionPerKm,
                'param-power': config.chargingPower,
                'param-efficiency': config.chargingEfficiency,
                'param-minsoc': config.minSOC,
                'param-targetsoc': config.targetSOC,
                'param-etc-rate': config.etcRatePerKm,
                'param-etc-discount': config.etcDiscount,
                'param-default-elec': config.defaultPricePerKwh,
                'param-driver-wage': config.driverWagePerHour,
            };
            for (const [id, val] of Object.entries(fields)) {
                if (val !== undefined) {
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                }
            }
            console.log('[电价配置] 已从本地恢复自定义参数');
        } catch(e) {
            console.warn('[电价配置] 恢复失败:', e);
        }
    },

    savePriceConfig() {
        const get = (id) => {
            const el = document.getElementById(id);
            return el ? parseFloat(el.value) : null;
        };
        const config = {
            batteryCapacity: get('param-battery'),
            consumptionPerKm: get('param-consumption'),
            chargingPower: get('param-power'),
            chargingEfficiency: get('param-efficiency'),
            minSOC: get('param-minsoc'),
            targetSOC: get('param-targetsoc'),
            etcRatePerKm: get('param-etc-rate'),
            etcDiscount: get('param-etc-discount'),
            defaultPricePerKwh: get('param-default-elec'),
            driverWagePerHour: get('param-driver-wage'),
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(this.PRICE_STORAGE_KEY, JSON.stringify(config));
    },

    resetPriceConfig() {
        localStorage.removeItem(this.PRICE_STORAGE_KEY);
        // 恢复默认值
        document.getElementById('param-battery').value = 600;
        document.getElementById('param-consumption').value = 180;
        document.getElementById('param-power').value = 600;
        document.getElementById('param-efficiency').value = 92;
        document.getElementById('param-minsoc').value = 15;
        document.getElementById('param-targetsoc').value = 85;
        document.getElementById('param-etc-rate').value = 2.50;
        document.getElementById('param-etc-discount').value = 95;
        document.getElementById('param-default-elec').value = 1.20;  // 默认综合电价（元/度）
        document.getElementById('param-driver-wage').value = 35;
        this.toast('已恢复默认参数', 'success');
    },

    // ========== 车辆参数 ==========
    getTruckConfig() {
        const get = (id, fallback) => {
            const el = document.getElementById(id);
            const val = el ? parseFloat(el.value) : NaN;
            return isNaN(val) || val <= 0 ? fallback : val;
        };
        const base = MAP_DATA.truckConfig;
        return {
            axles: base.axles,
            maxWeight: base.maxWeight,
            trailerLength: base.trailerLength,
            totalLength: base.totalLength,
            batteryCapacity: get('param-battery', base.batteryCapacity),
            consumptionPerKm: get('param-consumption', base.consumptionPerKm) / 100,
            fullChargeRange: 0,
            chargingPower: get('param-power', base.chargingPower),
            chargingEfficiency: get('param-efficiency', base.chargingEfficiency) / 100,
            minSOC: get('param-minsoc', base.minSOC * 100) / 100,
            targetSOC: get('param-targetsoc', base.targetSOC * 100) / 100,
        };
    },

    getCostConfig() {
        const get = (id, fallback) => {
            const el = document.getElementById(id);
            const val = el ? parseFloat(el.value) : NaN;
            return isNaN(val) || val < 0 ? fallback : val;
        };
        const base = MAP_DATA.costConfig;
        return {
            etcRatePerKm: get('param-etc-rate', base.etcRatePerKm),
            etcDiscount: get('param-etc-discount', base.etcDiscount * 100) / 100,
            defaultPricePerKwh: get('param-default-elec', base.defaultPricePerKwh),
            driverWagePerHour: get('param-driver-wage', base.driverWagePerHour),
        };
    },

    toggleParamBody() {
        const toggle = document.querySelector('.param-toggle');
        const body = document.querySelector('.param-body');
        toggle.classList.toggle('open');
        body.classList.toggle('open');
    },

    // ========== 实时数据刷新 ==========
    refreshRealTimeData() {
        // 更新所有充电站弹窗内容
        this.markers.charging.forEach(marker => {
            const data = marker._data;
            marker.setPopupContent(this.createPopup(data, 'charging'));
        });

        // 更新底部统计栏的实时时段提示
        const period = RealTimeData.getCurrentPeriod();
        const banner = document.querySelector('.stats-banner');
        if (banner) {
            let tip = document.getElementById('rt-period-tip');
            if (!tip) {
                tip = document.createElement('div');
                tip.id = 'rt-period-tip';
                tip.style.cssText = 'font-size:10px;color:var(--text-secondary);padding-left:8px;border-left:2px solid var(--primary);';
                banner.appendChild(tip);
            }
            const periodColor = period.type === 'offPeak' ? '#4CAF50' :
                               period.type === 'sharpPeak' ? '#f44336' :
                               period.type === 'onPeak' ? '#FF6B35' : '#2196F3';
            const now = new Date();
            tip.innerHTML = `<span style="color:${periodColor};font-weight:600;">${period.label}段</span> · 更新${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
        }

        // 更新路径详情中的充电站实时信息
        if (this.state.routeData) {
            const routeCoords = this.state.routeData.geometry.coordinates;
            const truckConfig = this.getTruckConfig();
            const maxRange = truckConfig.batteryCapacity * (truckConfig.targetSOC - truckConfig.minSOC) / truckConfig.consumptionPerKm;
            const recommendedStops = RoutePlanner.recommendChargingStops(routeCoords, maxRange);
            this.displayChargingStops(recommendedStops, this.state.routeData.duration || 0);
        }
    },

    // ========== 高德API Key 管理 ==========
    initAmapKey() {
        const input = document.getElementById('amap-key-input');
        if (!input) return;
        const savedKey = localStorage.getItem('amap_api_key');
        // 如果用户之前保存过自定义Key，显示它；否则显示内置默认Key
        input.value = savedKey || RoutePlanner.AMAP_DEFAULT_KEY;
        this.updateAmapKeyStatus(true);
    },

    saveAmapKey() {
        const input = document.getElementById('amap-key-input');
        if (!input) return;
        const key = input.value.trim();
        RoutePlanner.setAmapKey(key);
        this.updateAmapKeyStatus(!!key);
    },

    updateAmapKeyStatus(hasKey) {
        const status = document.getElementById('amap-key-status');
        if (!status) return;
        if (hasKey) {
            const isDefault = !localStorage.getItem('amap_api_key');
            status.textContent = isDefault
                ? '✅ 高德导航已启用（内置Key）'
                : '✅ 高德导航已启用（自定义Key）';
            status.style.color = '#4CAF50';
        } else {
            status.textContent = '⚠️ 未配置Key，使用OSRM备用引擎';
            status.style.color = '#FF6B35';
        }
    },

    applyPreset(preset) {
        const presets = {
            standard: {
                battery: 422, consumption: 180, power: 400, efficiency: 90,
                minsoc: 15, targetsoc: 85
            },
            large: {
                battery: 600, consumption: 180, power: 600, efficiency: 92,
                minsoc: 15, targetsoc: 85
            },
            light: {
                battery: 350, consumption: 150, power: 360, efficiency: 90,
                minsoc: 15, targetsoc: 85
            }
        };
        const p = presets[preset];
        if (!p) return;

        document.getElementById('param-battery').value = p.battery;
        document.getElementById('param-consumption').value = p.consumption;
        document.getElementById('param-power').value = p.power;
        document.getElementById('param-efficiency').value = p.efficiency;
        document.getElementById('param-minsoc').value = p.minsoc;
        document.getElementById('param-targetsoc').value = p.targetsoc;

        // 更新激活状态
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.querySelector(`.preset-btn[data-preset="${preset}"]`);
        if (btn) btn.classList.add('active');
    },

    // ========== 云查车车辆追踪 ==========
    vehicleProxyUrl: (function() {
        // 优先使用 localStorage 中配置的远程代理地址，默认尝试同源 /api/vehicles
        return localStorage.getItem('vehicle_proxy_url') || '';
    })(),
    vehicleMarkers: {},
    vehicleLayer: null,
    vehicleRefreshTimer: null,
    vehicleTargetPlates: ['浙A****D', '浙A****D'],

    // 获取当前代理URL
    getVehicleProxyUrl() {
        return localStorage.getItem('vehicle_proxy_url') || this.vehicleProxyUrl || '';
    },

    // 设置代理URL
    setVehicleProxyUrl(url) {
        if (url) {
            localStorage.setItem('vehicle_proxy_url', url);
        } else {
            localStorage.removeItem('vehicle_proxy_url');
        }
        this.vehicleProxyUrl = url || '';
    },

    initVehicleTracking() {
        // 创建车辆图层
        this.vehicleLayer = L.layerGroup().addTo(this.map);

        // 刷新按钮
        const refreshBtn = document.getElementById('btn-refresh-vehicles');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.fetchVehicles());
        }

        // 检查代理服务器状态
        this.checkVehicleProxyStatus();

        // 定时检查状态
        setInterval(() => this.checkVehicleProxyStatus(), 15000);

        // 弹出窗口中的导航按钮
        this.map.on('popupopen', (e) => {
            const popup = e.popup;
            if (popup && popup._contentNode) {
                const navBtn = popup._contentNode.querySelector('.vehicle-nav-btn');
                if (navBtn) {
                    navBtn.addEventListener('click', () => {
                        const plate = navBtn.dataset.plate;
                        const lng = parseFloat(navBtn.dataset.lng);
                        const lat = parseFloat(navBtn.dataset.lat);
                        this.map.closePopup();
                        this.navigateVehicle(plate, lng, lat);
                    });
                }
            }
        });
    },

    async checkVehicleProxyStatus() {
        const dot = document.getElementById('vehicle-status-dot');
        const text = document.getElementById('vehicle-status-text');
        const vehicleList = document.getElementById('vehicle-list');
        if (!dot || !text) return;

        const proxyUrl = this.getVehicleProxyUrl();
        if (!proxyUrl) {
            dot.textContent = '🔴';
            text.innerHTML = '车辆追踪未配置 — <a href="#" onclick="App.showVehicleConfig();return false;" style="color:var(--primary);">点击配置</a>';
            if (vehicleList) vehicleList.style.display = 'none';
            return;
        }

        try {
            const resp = await fetch(`${proxyUrl}/api/status`);
            if (!resp.ok) throw new Error('代理服务器未运行');
            const data = await resp.json();

            if (data.loggedIn && data.hasAuth) {
                dot.textContent = '🟢';
                text.textContent = `已连接 · ${data.carCount}辆车 · ${data.positionCount}个位置`;
                if (vehicleList) vehicleList.style.display = 'block';
                // 自动获取车辆位置
                this.fetchVehicles();
                // 启动定时刷新
                if (!this.vehicleRefreshTimer) {
                    this.vehicleRefreshTimer = setInterval(() => this.fetchVehicles(), 30000);
                }
            } else {
                dot.textContent = '🟡';
                text.textContent = data.lastError || '正在自动登录...';
                if (vehicleList) vehicleList.style.display = 'none';
            }
        } catch(e) {
            dot.textContent = '🔴';
            text.innerHTML = `代理服务器连接失败 — <a href="#" onclick="App.showVehicleConfig();return false;" style="color:var(--primary);">重新配置</a>`;
            if (vehicleList) vehicleList.style.display = 'none';
        }
    },

    // 显示车辆追踪配置弹窗
    showVehicleConfig() {
        const current = this.getVehicleProxyUrl();
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:#fff;border-radius:12px;padding:24px;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
                <h3 style="margin:0 0 16px;font-size:16px;color:var(--primary);">🚛 车辆追踪服务配置</h3>
                <p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;line-height:1.6;">
                    输入车辆追踪代理服务器的地址。部署在云服务器后，所有用户均可实时查看车辆位置，无需本地运行。
                </p>
                <input type="text" id="vehicle-proxy-input" value="${current}" placeholder="https://your-server.com:3001"
                    style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;box-sizing:border-box;margin-bottom:12px;">
                <div style="font-size:11px;color:var(--text-secondary);margin-bottom:16px;line-height:1.5;">
                    💡 部署方式：<br>
                    1. 将 vehicle-proxy.js 部署到云服务器<br>
                    2. 用 PM2 守护进程：pm2 start vehicle-proxy.js<br>
                    3. 将服务器地址填入上方输入框
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button onclick="this.closest('div[style*=fixed]').remove()" style="padding:8px 16px;border:1px solid var(--border);border-radius:8px;background:#fff;cursor:pointer;font-size:14px;">取消</button>
                    <button id="vehicle-proxy-save" style="padding:8px 16px;border:none;border-radius:8px;background:var(--primary);color:#fff;cursor:pointer;font-size:14px;">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#vehicle-proxy-save').addEventListener('click', () => {
            const url = document.getElementById('vehicle-proxy-input').value.trim();
            this.setVehicleProxyUrl(url);
            modal.remove();
            this.checkVehicleProxyStatus();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    async fetchVehicles() {
        const proxyUrl = this.getVehicleProxyUrl();
        if (!proxyUrl) return;
        try {
            const resp = await fetch(`${proxyUrl}/api/vehicles`);
            if (!resp.ok) return;
            const data = await resp.json();

            if (data.vehicles && data.vehicles.length > 0) {
                this.renderVehicles(data.vehicles);
            } else if (data.error) {
                const list = document.getElementById('vehicle-list');
                if (list) {
                    list.innerHTML = `<div class="vehicle-error">⚠️ ${data.error}</div>`;
                }
            }
        } catch(e) {
            // 静默失败
        }
    },

    renderVehicles(vehicles) {
        const list = document.getElementById('vehicle-list');
        if (!list) return;

        // 清除旧标记
        this.vehicleLayer.clearLayers();
        this.vehicleMarkers = {};

        // 目标车辆排在前面
        vehicles = vehicles.slice().sort((a, b) => {
            const aT = this.vehicleTargetPlates.includes(a.plate) || a.isTarget;
            const bT = this.vehicleTargetPlates.includes(b.plate) || b.isTarget;
            return (bT ? 1 : 0) - (aT ? 1 : 0);
        });

        let html = '';
        let visibleCount = 0;

        for (const v of vehicles) {
            const plate = v.plate || v.name || '未知';
            const isTarget = this.vehicleTargetPlates.includes(plate) || v.isTarget;

            // 解析位置 - 云查车返回的坐标可能是GCJ-02或WGS-84
            // 云查车使用GCJ-02坐标，需要转为WGS-84
            let lng = v.lng || v.lon || v.longitude || v.gpsLng;
            let lat = v.lat || v.latitude || v.gpsLat;

            if (!lng || !lat) continue;

            // 转换为数字
            lng = parseFloat(lng);
            lat = parseFloat(lat);

            if (isNaN(lng) || isNaN(lat)) continue;

            // 云查车返回的是GCJ-02坐标，转为WGS-84
            const [wgsLng, wgsLat] = CoordTransform.gcj02towgs84(lng, lat);

            // 状态判断
            const state_ = v.state || v.stt || v.status;
            const speed = v.spd || v.speed || 0;
            const direction = v.dir || v.direction || v.course || 0;
            const lastTime = v.time || v.gpsTime || v.lastTime || '';
            const owner = v.owner || '';
            const ownerPhone = v.ownerPhone || '';
            const teamName = v.teamName || '';
            const isMoving = speed > 2;
            const statusIcon = isMoving ? '🚛' : '🅿️';
            const statusText = isMoving ? `行驶中 ${speed}km/h` : '停车';
            const dirText = this.formatDirection(direction);

            // 车辆图标
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin vehicle ${isMoving ? 'moving' : 'stopped'} ${isTarget ? 'target-vehicle' : ''}">
                    <span class="icon">${statusIcon}</span>
                </div>
                <div class="marker-label vehicle-label">${plate}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const marker = L.marker([wgsLat, wgsLng], { icon }).addTo(this.vehicleLayer);
            this.vehicleMarkers[plate] = marker;

            // 弹窗
            const popupHtml = `
                <div class="vehicle-popup">
                    <div class="vehicle-popup-title">${statusIcon} ${plate} ${isTarget ? '⭐' : ''}</div>
                    ${teamName ? `<div class="vehicle-popup-row"><span>车队</span><span>${teamName}</span></div>` : ''}
                    ${owner ? `<div class="vehicle-popup-row"><span>司机</span><span>${owner}${ownerPhone ? ' (' + ownerPhone + ')' : ''}</span></div>` : ''}
                    <div class="vehicle-popup-row"><span>状态</span><span>${statusText}</span></div>
                    <div class="vehicle-popup-row"><span>方向</span><span>${dirText}</span></div>
                    <div class="vehicle-popup-row"><span>时间</span><span>${lastTime}</span></div>
                    <div class="vehicle-popup-row"><span>坐标</span><span>${lng.toFixed(6)}, ${lat.toFixed(6)}</span></div>
                    <button class="btn btn-primary btn-sm vehicle-nav-btn" data-plate="${plate}" data-lng="${wgsLng}" data-lat="${wgsLat}">🧭 导航到此车</button>
                </div>
            `;
            marker.bindPopup(popupHtml);

            // 列表项
            html += `
                <div class="vehicle-card ${isTarget ? 'target' : ''}" data-plate="${plate}" data-lng="${wgsLng}" data-lat="${wgsLat}">
                    <div class="vehicle-card-header">
                        <span class="vehicle-card-plate">${plate} ${isTarget ? '⭐' : ''}</span>
                        <span class="vehicle-card-status ${isMoving ? 'moving' : 'stopped'}">${statusText}</span>
                    </div>
                    ${teamName || owner ? `<div class="vehicle-card-info"><span>👤 ${owner || '--'}</span><span>🏷️ ${teamName || '--'}</span></div>` : ''}
                    <div class="vehicle-card-info">
                        <span>🧭 ${dirText}</span>
                        <span>🕐 ${lastTime}</span>
                    </div>
                    <div class="vehicle-card-actions">
                        <button class="btn btn-outline btn-sm vehicle-locate-btn" data-plate="${plate}">📍 定位</button>
                        <button class="btn btn-outline btn-sm vehicle-nav-btn" data-plate="${plate}" data-lng="${wgsLng}" data-lat="${wgsLat}">🧭 导航</button>
                    </div>
                </div>
            `;
            visibleCount++;
        }

        if (visibleCount === 0) {
            html = '<div class="vehicle-empty">暂无车辆位置数据</div>';
        }

        list.innerHTML = html;
        list.style.display = 'block';

        // 绑定列表事件
        list.querySelectorAll('.vehicle-locate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const plate = btn.dataset.plate;
                this.locateVehicle(plate);
            });
        });
        list.querySelectorAll('.vehicle-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const plate = btn.dataset.plate;
                const lng = parseFloat(btn.dataset.lng);
                const lat = parseFloat(btn.dataset.lat);
                this.navigateVehicle(plate, lng, lat);
            });
        });
        list.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', () => {
                const plate = card.dataset.plate;
                this.locateVehicle(plate);
            });
        });

        // 更新状态
        const dot = document.getElementById('vehicle-status-dot');
        const text = document.getElementById('vehicle-status-text');
        if (dot) dot.textContent = '🟢';
        if (text) text.textContent = `已连接 · ${visibleCount}辆车在线`;
    },

    locateVehicle(plate) {
        const marker = this.vehicleMarkers[plate];
        if (marker) {
            this.map.setView(marker.getLatLng(), Math.max(this.map.getZoom(), 12));
            marker.openPopup();
        }
    },

    navigateVehicle(plate, lng, lat) {
        // 将车辆位置设为终点
        this.routeEnd = [lat, lng];
        const endValue = document.getElementById('route-end-value');
        if (endValue) {
            endValue.textContent = `🚛 ${plate} (${lng.toFixed(4)}, ${lat.toFixed(4)})`;
            endValue.style.color = 'var(--secondary)';
        }
        // 检查是否可以规划路径
        this.checkRouteReady();
        // 切换到高速优先模式
        const highwayRadio = document.querySelector('input[name="route-mode"][value="highway"]');
        if (highwayRadio) highwayRadio.checked = true;
        // 关闭侧边栏（移动端）
        if (window.innerWidth <= 768) {
            this.toggleSidebar(false);
        }
        // 提示
        const startValue = document.getElementById('route-start-value');
        if (!this.routeStart) {
            alert('已将车辆「' + plate + '」设为终点，请先设置起点后点击「规划路径」');
        } else {
            // 如果已有起点，直接规划
            this.planRoute();
        }
    },

    formatDirection(dir) {
        const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
        const idx = Math.round(dir / 45) % 8;
        return directions[idx] || '未知';
    },

    // ========== 事件绑定 ==========
    bindEvents() {
        // 侧边栏切换
        document.getElementById('btn-toggle-sidebar').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebar-overlay').addEventListener('click', () => this.toggleSidebar());

        // 图层
        document.getElementById('layer-factories').addEventListener('change', e => this.toggleLayer('factories', e.target.checked));
        const hqLayer = document.getElementById('layer-hq');
        if (hqLayer) hqLayer.addEventListener('change', e => this.toggleLayer('hq', e.target.checked));
        document.getElementById('layer-car-charging').addEventListener('change', e => this.toggleLayer('carCharging', e.target.checked));
        document.getElementById('layer-charging').addEventListener('change', e => this.toggleLayer('charging', e.target.checked));
        const tollLayer = document.getElementById('layer-tolls');
        if (tollLayer) tollLayer.addEventListener('change', e => this.toggleLayer('tolls', e.target.checked));

        // 搜索框
        const searchInput = document.getElementById('station-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.searchText = e.target.value.trim();
                this.renderPointList();
                // 显示/隐藏清除按钮
                const clearBtn = document.getElementById('search-clear');
                if (clearBtn) clearBtn.style.display = this.state.searchText ? 'flex' : 'none';
            });
        }
        // 清除搜索
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.state.searchText = '';
                clearBtn.style.display = 'none';
                this.renderPointList();
            });
        }
        // 筛选标签
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.state.activeFilter = tag.dataset.filter;
                this.renderPointList();
            });
        });

        // 路径规划
        document.getElementById('btn-set-start').addEventListener('click', () => this.setMode('setStart'));
        document.getElementById('btn-set-end').addEventListener('click', () => this.setMode('setEnd'));
        document.getElementById('btn-plan-route').addEventListener('click', () => this.planRoute());
        document.getElementById('btn-clear-route').addEventListener('click', () => this.clearRoute());

        // 多途经点
        const addWaypointBtn = document.getElementById('btn-add-waypoint');
        if (addWaypointBtn) addWaypointBtn.addEventListener('click', () => this.setMode('setWaypoint'));

        // 路线模式选择器 — 高亮选中项
        document.querySelectorAll('input[name="route-mode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                document.querySelectorAll('.route-mode-option').forEach(opt => {
                    opt.classList.toggle('active', opt.querySelector('input').checked);
                });
            });
        });
        // 初始化高亮
        document.querySelector('.route-mode-option:has(input:checked)')?.classList.add('active');

        // 地图类型
        document.getElementById('btn-map-type').addEventListener('click', () => this.toggleMapType());

        // 图层切换面板
        const layerSwitchBtn = document.getElementById('btn-layer-switch');
        if (layerSwitchBtn) layerSwitchBtn.addEventListener('click', () => this.toggleLayerSwitchPanel());
        document.querySelectorAll('.layer-switch-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.switchTileLayer(opt.dataset.tile);
                document.getElementById('layer-switch-panel').style.display = 'none';
            });
        });

        // 实时路况
        const trafficBtn = document.getElementById('btn-traffic');
        if (trafficBtn) trafficBtn.addEventListener('click', () => this.toggleTraffic());

        // 峰谷电价组件展开/收起
        const elecHeader = document.getElementById('elec-widget-header');
        if (elecHeader) elecHeader.addEventListener('click', () => {
            const body = document.getElementById('elec-widget-body');
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
        });

        // 定位（高德瓦片需 GCJ-02 坐标）
        document.getElementById('btn-locate').addEventListener('click', () => {
            const [gLng, gLat] = CoordTransform.wgs84togcj02(120.20, 30.25);
            this.map.flyTo([gLat, gLng], 8, { duration: 1.0 });
        });

        // 车辆参数 — 仅绑定一次（不再使用 inline onclick）
        const paramToggle = document.getElementById('param-toggle');
        if (paramToggle) paramToggle.addEventListener('click', () => this.toggleParamBody());
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => this.applyPreset(btn.dataset.preset));
        });

        // 电价参数自动保存到 localStorage
        document.querySelectorAll('.param-input').forEach(input => {
            input.addEventListener('change', () => this.savePriceConfig());
        });

        // 实时数据刷新
        const refreshBtn = document.getElementById('btn-refresh-rt');
        if (refreshBtn) refreshBtn.addEventListener('click', () => {
            this.refreshRealTimeData();
            // 视觉反馈
            refreshBtn.style.transform = 'rotate(360deg)';
            refreshBtn.style.transition = 'transform 0.5s';
            setTimeout(() => { refreshBtn.style.transform = ''; }, 500);
        });

        // 高德API Key
        const saveKeyBtn = document.getElementById('btn-save-amap-key');
        if (saveKeyBtn) saveKeyBtn.addEventListener('click', () => this.saveAmapKey());
        const keyInput = document.getElementById('amap-key-input');
        if (keyInput) keyInput.addEventListener('change', () => this.saveAmapKey());

        // 地名搜索
        const placeSearchInput = document.getElementById('place-search-input');
        if (placeSearchInput) {
            placeSearchInput.addEventListener('input', (e) => {
                clearTimeout(this.placeSearchTimer);
                this.placeSearchTimer = setTimeout(() => this.searchPlace(e.target.value), 400);
            });
            placeSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(this.placeSearchTimer);
                    this.searchPlace(e.target.value);
                }
            });
        }
        const placeSearchBtn = document.getElementById('btn-place-search');
        if (placeSearchBtn) {
            placeSearchBtn.addEventListener('click', () => {
                const input = document.getElementById('place-search-input');
                if (input && input.value.trim()) this.searchPlace(input.value);
            });
        }
        // 搜索目标切换（起点/终点）
        document.querySelectorAll('.place-target-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.place-target-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const radio = opt.querySelector('input');
                if (radio) radio.checked = true;
            });
        });
        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            const results = document.getElementById('place-search-results');
            const searchBox = document.querySelector('.place-search-box');
            if (results && searchBox && !searchBox.contains(e.target)) {
                results.style.display = 'none';
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('sidebar-overlay').classList.remove('show');
            }
        });

        // 右键菜单项点击
        document.querySelectorAll('.ctx-item[data-action]').forEach(item => {
            item.addEventListener('click', () => {
                this.handleContextAction(item.dataset.action);
            });
        });
        // 点击其他区域关闭右键菜单
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('map-context-menu');
            if (menu && menu.classList.contains('show') && !menu.contains(e.target)) {
                this.hideContextMenu();
            }
        });
        // 阻止右键菜单区域自身的默认右键
        document.getElementById('map-context-menu').addEventListener('contextmenu', e => e.preventDefault());
    }
};

// 启动
window.addEventListener('DOMContentLoaded', () => App.init());
