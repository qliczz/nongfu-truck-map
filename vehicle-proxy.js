/**
 * 云查车API代理服务器 v4 — 全自动登录版（云端部署 ready）
 * 
 * 本地运行: node vehicle-proxy.js
 * 云端运行: pm2 start vehicle-proxy.js --name vehicle-proxy
 * 端口: 3001 (可通过 PORT 环境变量修改)
 * 
 * 特性:
 *   - 自动模拟滑块验证码轨迹登录（无需手动复制Cookie）
 *   - 自动获取 authorization token
 *   - 自动获取车辆列表和实时位置
 *   - 30秒自动刷新
 *   - REST API 供前端调用
 *   - 支持 CORS 跨域（所有域名可访问）
 *   - 健康检查端点 /health
 *   - 支持 PM2 守护进程
 *   - 支持环境变量配置（PORT/ACCOUNT/PASSWORD/VEHICLES）
 * 
 * API:
 *   GET  /health               - 健康检查（用于负载均衡/监控）
 *   GET  /api/status            - 检查连接状态
 *   GET  /api/vehicles          - 获取所有车辆实时位置
 *   GET  /api/vehicles/:plate   - 获取指定车牌的位置
 *   POST /api/refresh           - 手动刷新数据
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ===== 配置（支持环境变量覆盖） =====
const CONFIG = {
    PORT: process.env.PORT || 3001,
    BASE_URL: 'www.zjgcpt.cn',
    WEB_PATH: '/gps-web/h5',
    ACCOUNT: process.env.VEHICLE_ACCOUNT || 'YOUR_ACCOUNT',
    PASSWORD: process.env.VEHICLE_PASSWORD || 'YOUR_PASSWORD',
    VEHICLES: (process.env.VEHICLE_PLATES || 'YOUR_PLATE_1,YOUR_PLATE_2').split(','),
    REFRESH_INTERVAL: 30000  // 30秒刷新
};

// ===== 状态 =====
const state = {
    cookie: '',
    sessionId: null,
    authorization: null,
    loggedIn: false,
    cars: [],
    teams: [],
    positions: [],
    lastUpdate: null,
    lastError: null,
    loginAttempts: 0
};

// ===== HTTP请求工具 =====
function apiRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const fullPath = CONFIG.WEB_PATH + path;
        const options = {
            hostname: CONFIG.BASE_URL,
            port: 443,
            path: fullPath,
            method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.zjgcpt.cn/gps-web/',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://www.zjgcpt.cn',
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };
        if (state.cookie) options.headers['Cookie'] = state.cookie;
        if (state.authorization) options.headers['Authorization'] = state.authorization;
        if (body) options.headers['Content-Length'] = Buffer.byteLength(body);
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', () => {
                resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8'), headers: res.headers });
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

// ===== 获取初始Session =====
function getInitialSession() {
    return new Promise((resolve, reject) => {
        https.get({
            hostname: CONFIG.BASE_URL,
            path: '/gps-web/',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (res) => {
            if (res.headers['set-cookie']) {
                state.cookie = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
                console.log('[Session] 获取到:', state.cookie);
            }
            res.on('data', () => {});
            res.on('end', () => resolve());
        }).on('error', reject);
    });
}

// ===== 生成模拟真人滑块轨迹 =====
function generateSliderTrack() {
    const track = [];
    let x = 80 + Math.random() * 40;
    let y = 180 + Math.random() * 40;
    const targetX = x + 250 + Math.random() * 100;
    const steps = 28 + Math.floor(Math.random() * 18);
    let currentX = x;
    for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        const speed = 1 - progress * 0.65;
        const stepSize = (targetX - x) / steps * speed * (0.75 + Math.random() * 0.5);
        currentX += stepSize;
        y += (Math.random() - 0.5) * 4;
        const dt = 8 + Math.floor(Math.random() * 35);
        track.push({ x: Math.round(currentX * 10) / 10, y: Math.round(y * 10) / 10, t: dt });
    }
    for (let i = 0; i < 6; i++) {
        currentX += (Math.random() - 0.35) * 2.5;
        y += (Math.random() - 0.5) * 1.5;
        track.push({ x: Math.round(currentX * 10) / 10, y: Math.round(y * 10) / 10, t: 12 + Math.floor(Math.random() * 25) });
    }
    return track;
}

// ===== 全自动登录 =====
async function autoLogin() {
    state.loginAttempts++;
    console.log(`[登录] 第${state.loginAttempts}次尝试...`);

    if (!state.cookie) await getInitialSession();

    const pwdMd5 = crypto.createHash('md5').update(CONFIG.PASSWORD).digest('hex');
    const loginBody = JSON.stringify({
        loginType: 'user', userId: CONFIG.ACCOUNT, password: pwdMd5,
        rsaId: null, plateColor: null, smsCode: null,
        code: generateSliderTrack(), imgId: '', imgCode: null,
        loginLang: 'zh_CN', loginWay: 'ie', h5login: true
    });

    const loginResp = await apiRequest('/login', 'POST', loginBody);
    try {
        const data = JSON.parse(loginResp.body);
        if (data.result && data.result.indexOf('ok') === 0) {
            state.sessionId = data.result.split('#')[1];
            if (loginResp.headers['set-cookie'])
                state.cookie = loginResp.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
            console.log('[登录] ✅ 登录成功! sessionId:', state.sessionId);

            // 调用 /alogin 获取 authorization
            const aloginResp = await apiRequest('/alogin?sessionId=' + encodeURIComponent(state.sessionId) + '&scheme=https', 'GET');
            const aloginData = JSON.parse(aloginResp.body);
            if (aloginData.status === 1 && aloginData.result && aloginData.result.authorization) {
                state.authorization = aloginData.result.authorization;
                state.loggedIn = true;
                state.lastError = null;
                console.log('[登录] ✅ authorization获取成功!');
                return true;
            }
            console.log('[登录] ❌ alogin失败:', aloginData.status);
            state.lastError = 'alogin失败';
            return false;
        }
        console.log('[登录] ❌ 登录失败:', data.result);
        state.lastError = '登录失败: ' + (data.result || '');
        state.cookie = '';
        return false;
    } catch (e) {
        console.log('[登录] ❌ 解析失败:', e.message);
        state.lastError = '登录响应解析失败';
        state.cookie = '';
        return false;
    }
}

// ===== 获取车辆列表 =====
async function fetchCarList() {
    try {
        const resp = await apiRequest('/mgr/car?getTeamsAndCars', 'GET');
        const data = JSON.parse(resp.body);
        if (data.status === 1 && Array.isArray(data.result)) {
            state.teams = data.result[0] || [];
            state.cars = data.result[1] || [];
            console.log(`[车辆] ${state.teams.length}个车队, ${state.cars.length}辆车`);
            return true;
        } else if (data.status === -1) {
            state.loggedIn = false;
            state.authorization = null;
            return false;
        }
    } catch (e) { console.log('[车辆] 获取失败:', e.message); }
    return false;
}

// ===== 获取实时位置 =====
async function fetchPositions() {
    if (state.cars.length === 0) return;
    try {
        const carIds = state.cars.map(c => c.carId || c.id);
        const resp = await apiRequest('/mnt/rtl?getByCarIds', 'POST', JSON.stringify(carIds));
        const data = JSON.parse(resp.body);
        if (data.status === 1 && Array.isArray(data.result)) {
            state.positions = data.result;
            state.lastUpdate = new Date().toISOString();
            state.lastError = null;
            const targets = state.positions.filter(p => {
                const car = state.cars.find(c => (c.carId || c.id) === p.carId);
                return car && CONFIG.VEHICLES.includes(car.plate);
            });
            if (targets.length > 0) {
                console.log(`[位置] ✅ ${state.lastUpdate}`);
                targets.forEach(p => {
                    const car = state.cars.find(c => (c.carId || c.id) === p.carId);
                    console.log(`  ${car.plate}: ${p.lng},${p.lat} ${p.speed}km/h ${p.time || ''}`);
                });
            }
        } else if (data.status === -1) {
            state.loggedIn = false;
            state.authorization = null;
        }
    } catch (e) { state.lastError = e.message; }
}

// ===== 刷新数据 =====
async function refreshData() {
    if (!state.loggedIn) {
        const ok = await autoLogin();
        if (!ok) return;
    }
    const carOk = await fetchCarList();
    if (!carOk) {
        const ok = await autoLogin();
        if (ok) await fetchCarList();
        else return;
    }
    await fetchPositions();
}

// ===== 构建前端数据 =====
function buildVehicleData() {
    return state.cars.map(car => {
        const pos = state.positions.find(p => (p.carId || p.id) === (car.carId || car.id));
        const team = state.teams.find(t => t.id === car.teamId);
        return {
            plate: car.plate,
            carId: car.carId || car.id,
            teamName: team ? team.name : '',
            owner: car.owner || '',
            ownerPhone: car.ownerPhone || '',
            state: car.state,
            lng: pos ? parseFloat(pos.lng) : null,
            lat: pos ? parseFloat(pos.lat) : null,
            speed: pos ? parseFloat(pos.speed) : null,
            direction: pos ? pos.direction : null,
            gpsTime: pos ? (pos.time || pos.gpsTime) : null,
            isTarget: CONFIG.VEHICLES.includes(car.plate)
        };
    }).filter(v => v.isTarget || (v.lng && v.lat));
}

// ===== HTTP服务器 =====
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    const url = new URL(req.url, `http://localhost:${CONFIG.PORT}`);
    const path = url.pathname;

    if (path === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), loggedIn: state.loggedIn, lastUpdate: state.lastUpdate }));
    } else if (path === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            loggedIn: state.loggedIn, sessionId: state.sessionId,
            hasAuth: !!state.authorization, carCount: state.cars.length,
            teamCount: state.teams.length, positionCount: state.positions.length,
            lastUpdate: state.lastUpdate, lastError: state.lastError,
            targetVehicles: CONFIG.VEHICLES, loginAttempts: state.loginAttempts
        }));
    } else if (path === '/api/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            vehicles: buildVehicleData(), lastUpdate: state.lastUpdate,
            loggedIn: state.loggedIn, total: state.cars.length
        }));
    } else if (path.startsWith('/api/vehicles/')) {
        const plate = decodeURIComponent(path.split('/api/vehicles/')[1]);
        const vehicle = buildVehicleData().find(v => v.plate === plate);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicle || { error: '未找到: ' + plate }));
    } else if (path === '/api/refresh' && req.method === 'POST') {
        refreshData().then(() => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: state.loggedIn, lastUpdate: state.lastUpdate, vehicleCount: state.positions.length }));
        });
    } else if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>🚗 云查车代理服务器 v3</h1><p>状态: ${state.loggedIn ? '✅ 已连接' : '❌ 未连接'}</p><p>车辆: ${state.cars.length} | 位置: ${state.positions.length}</p><p>更新: ${state.lastUpdate || '从未'}</p><p>目标: ${CONFIG.VEHICLES.join(', ')}</p><hr><p><a href="/api/status">/api/status</a> | <a href="/api/vehicles">/api/vehicles</a></p>`);
    } else { res.writeHead(404); res.end('Not Found'); }
});

// ===== 启动 =====
server.listen(CONFIG.PORT, () => {
    console.log(`🚗 云查车代理服务器 v3 已启动: http://localhost:${CONFIG.PORT}`);
    console.log(`📋 监听车辆: ${CONFIG.VEHICLES.join(', ')}`);
    console.log(`🔄 刷新间隔: ${CONFIG.REFRESH_INTERVAL / 1000}秒\n`);
    refreshData().then(() => console.log('\n⏳ 等待下次刷新...'));
    setInterval(async () => { await refreshData(); }, CONFIG.REFRESH_INTERVAL);
});
