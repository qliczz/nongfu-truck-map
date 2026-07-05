/**
 * 充电站实时电价爬虫 v1.0
 * 
 * 通过模拟浏览器访问高德地图充电站详情页，监听 amap.com/detail/get/detail
 * API响应，提取实时电价信息。
 * 
 * 使用方法:
 *   set AMAP_KEY=your_amap_key
 *   node price-crawler.js
 * 
 * 或一行:
 *   AMAP_KEY=xxx node price-crawler.js   (Git Bash / WSL)
 * 
 * 依赖:
 *   npm install puppeteer-core   (已安装在工作区)
 *   系统需有 Edge 或 Chrome 浏览器
 * 
 * 输出:
 *   price-data.json — 所有充电站最新电价，供前端读取
 * 
 * 环境变量:
 *   AMAP_KEY        (必填) 高德开放平台API Key
 *   EDGE_PATH       (可选) 浏览器路径，默认自动检测Edge
 *   HEADLESS        (可选) 是否无头模式，默认 true
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 动态加载 puppeteer-core（从node workspace或项目node_modules）
let puppeteer;
const puppeteerPaths = [
    path.join(process.env.USERPROFILE || process.env.HOME || '', '.workbuddy', 'binaries', 'node', 'workspace', 'node_modules', 'puppeteer-core'),
    path.join(__dirname, 'node_modules', 'puppeteer-core'),
    'puppeteer-core'
];
for (const p of puppeteerPaths) {
    try { puppeteer = require(p); break; } catch(e) {}
}
if (!puppeteer) {
    console.error('❌ 未找到 puppeteer-core，请运行: npm install puppeteer-core');
    process.exit(1);
}

// ===== 配置 =====
const AMAP_KEY = process.env.AMAP_KEY;
const OUTPUT_FILE = path.join(__dirname, 'price-data.json');
const DELAY_BETWEEN = 2500;       // 站间间隔(ms)，避免触发风控
const PAGE_TIMEOUT = 20000;       // 单页超时(ms)
const DETAIL_WAIT = 12000;        // 等待详情API响应(ms)

// 浏览器路径自动检测
const BROWSER_PATHS = [
    process.env.EDGE_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

if (!AMAP_KEY) {
    console.error('❌ 请设置环境变量 AMAP_KEY');
    console.error('   例如: AMAP_KEY=your_key node price-crawler.js');
    process.exit(1);
}

// ===== 加载充电站数据 =====
function loadStations() {
    const dataCode = fs.readFileSync(path.join(__dirname, 'js', 'data.js'), 'utf8');
    const modified = dataCode.replace('const MAP_DATA = {', 'global.MAP_DATA = {');
    eval(modified);
    return global.MAP_DATA.carChargingStations;
}

// ===== 高德POI搜索: 获取充电站POI ID =====
function getPoiId(station) {
    return new Promise((resolve) => {
        // 清理站名用于搜索（去掉括号后缀）
        const cleanName = station.name.replace(/[（(].*$/, '').replace(/国家电网/g, '国家电网').trim();
        const region = station.region || '';
        const city = region.split('·')[1] || region.split('·')[0] || '';
        const keywords = encodeURIComponent(cleanName + ' 充电站');
        const cityEnc = encodeURIComponent(city);
        const url = `https://restapi.amap.com/v3/place/text?keywords=${keywords}&city=${cityEnc}&types=011100&offset=3&extensions=all&key=${AMAP_KEY}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.pois && json.pois.length > 0) {
                        // 尝试匹配最接近的POI
                        const poi = json.pois[0];
                        resolve({ id: poi.id, name: poi.name, address: poi.address, location: poi.location });
                    } else {
                        resolve(null);
                    }
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

// ===== 用Puppeteer访问详情页，监听API响应 =====
async function getStationDetail(browser, poiId, stationName) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // 反 headless 检测
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh', 'en'] });
        window.chrome = { runtime: {} };
    });

    let detailData = null;
    let detailError = null;
    const apiUrls = [];

    // 监听所有网络响应（宽匹配）
    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('detail') || url.includes('charging') || url.includes('price') ||
            url.includes('poiInfo') || url.includes('get/detail') || url.includes('/place/')) {
            apiUrls.push(url.substring(0, 150));
            try {
                const text = await response.text();
                if (text && text.length > 20) {
                    let json;
                    try { json = JSON.parse(text); } catch(e) { return; }
                    if (json && json.data) {
                        const d = json.data;
                        if (d.charging || d.base || d.charge_price !== undefined) {
                            detailData = d;
                        }
                    }
                }
            } catch(e) { /* 响应体未完成，忽略 */ }
        }
    });

    try {
        await page.goto(`https://www.amap.com/place/${poiId}`, {
            waitUntil: 'networkidle2',
            timeout: PAGE_TIMEOUT
        });

        // 等待详情数据加载
        const startTime = Date.now();
        while (!detailData && Date.now() - startTime < DETAIL_WAIT) {
            await new Promise(r => setTimeout(r, 600));
        }

        // 如果还没拿到，尝试滚动页面触发加载
        if (!detailData) {
            try {
                await page.evaluate(() => {
                    window.scrollTo(0, 300);
                    window.scrollTo(0, 600);
                    window.scrollTo(0, 0);
                });
                await new Promise(r => setTimeout(r, 3000));
            } catch(e) {}
        }

        // 调试信息
        if (!detailData) {
            if (apiUrls.length === 0) {
                try {
                    const allUrls = await page.evaluate(() => {
                        return performance.getEntriesByType('resource')
                            .map(r => r.name)
                            .filter(n => n.includes('amap.com') || n.includes('gaode'))
                            .slice(0, 5);
                    });
                    if (allUrls && allUrls.length > 0) {
                        detailError = '无匹配API。页面请求: ' + allUrls.map(u => u.substring(0, 80)).join(' | ');
                    } else {
                        detailError = '无数据(页面无amap API请求，可能被风控)';
                    }
                } catch(e) {
                    detailError = '无数据(页面评估失败)';
                }
            } else {
                detailError = 'API响应无充电数据。匹配URL: ' + apiUrls.slice(0, 2).join(' | ');
            }
        }
    } catch(e) {
        detailError = e.message;
    }

    await page.close();
    return { detail: detailData, error: detailError };
}

// ===== 提取电价信息 =====
function extractPrice(result, station, poiInfo) {
    const detail = result.detail;
    if (!detail) return null;

    const charging = detail.charging || {};
    const base = detail.base || {};
    const deep = detail.deep || {};

    // charge_price 可能是字符串、数字或带单位的文本
    let chargePrice = charging.charge_price || charging.price || '';
    if (typeof chargePrice === 'string') {
        chargePrice = chargePrice.trim();
    }

    // 尝试提取数字
    let priceNum = null;
    if (chargePrice) {
        const match = String(chargePrice).match(/(\d+\.?\d*)/);
        if (match) priceNum = parseFloat(match[1]);
    }

    return {
        stationId: station.id,
        stationName: station.name,
        operator: station.operator,
        poiId: poiInfo ? poiInfo.id : '',
        amapName: base.name || (poiInfo ? poiInfo.name : ''),
        amapAddress: base.address || (poiInfo ? poiInfo.address : ''),
        chargePrice: chargePrice,
        pricePerKwh: priceNum,        // 解析出的数字电价
        brand: charging.brand_desc || charging.brand || '',
        parkingPrice: deep.price_parking || '',
        openTime: (base.tag_info && base.tag_info.open_time) || charging.open_time || '',
        chargeCount: charging.charge_count || charging.total_count || '',
        fastCount: charging.fast_count || '',
        slowCount: charging.slow_count || '',
        // 保留原有数据用于对比
        originalPrice: station.pricePerKwh || null,
        originalServiceFee: station.serviceFee !== undefined ? station.serviceFee : null,
        originalTou: station.touEnabled || false,
        crawledAt: new Date().toISOString()
    };
}

// ===== 主流程 =====
async function main() {
    console.log('='.repeat(60));
    console.log('  充电站实时电价爬虫 v1.0');
    console.log('  数据来源: 高德地图 amap.com');
    console.log('='.repeat(60));

    const stations = loadStations();
    console.log(`\n加载了 ${stations.length} 个充电站\n`);

    // 检测浏览器
    let browserPath = null;
    for (const p of BROWSER_PATHS) {
        if (fs.existsSync(p)) { browserPath = p; break; }
    }
    if (!browserPath) {
        console.error('❌ 未找到 Edge 或 Chrome 浏览器');
        console.error('   请设置 EDGE_PATH 环境变量指向浏览器路径');
        process.exit(1);
    }
    console.log(`浏览器: ${browserPath}`);

    const headless = process.env.HEADLESS === 'false' ? false : 'new';
    console.log(`无头模式: ${headless === 'new' ? '开启' : '关闭'}\n`);

    // 启动浏览器
    const browser = await puppeteer.launch({
        executablePath: browserPath,
        headless: headless,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--window-size=1280,800'
        ]
    });

    const results = [];
    let success = 0, noPrice = 0, failed = 0;

    for (let i = 0; i < stations.length; i++) {
        const station = stations[i];
        const progress = `[${i + 1}/${stations.length}]`;
        console.log(`${progress} ${station.name}`);

        // 步骤1: 获取POI ID
        const poiInfo = await getPoiId(station);
        if (!poiInfo) {
            console.log(`  -> 未找到POI ID`);
            results.push({
                stationId: station.id, stationName: station.name,
                error: '未找到POI', originalPrice: station.pricePerKwh,
                crawledAt: new Date().toISOString()
            });
            failed++;
        } else {
            console.log(`  POI: ${poiInfo.id} (${poiInfo.name})`);

            // 步骤2: 获取详情
            const result = await getStationDetail(browser, poiInfo.id, station.name);
            const priceInfo = extractPrice(result, station, poiInfo);

            if (priceInfo && priceInfo.chargePrice) {
                console.log(`  电价: ${priceInfo.chargePrice} | 品牌: ${priceInfo.brand || '--'} | 桩数: ${priceInfo.chargeCount || '--'}`);
                results.push(priceInfo);
                if (priceInfo.priceNum) success++;
                else noPrice++;
            } else {
                console.log(`  -> 未获取到电价 (error: ${result.error || '无数据'})`);
                results.push({
                    stationId: station.id, stationName: station.name,
                    poiId: poiInfo.id, amapName: poiInfo.name,
                    error: result.error || '无电价数据',
                    originalPrice: station.pricePerKwh,
                    crawledAt: new Date().toISOString()
                });
                failed++;
            }
        }

        // 站间延迟
        if (i < stations.length - 1) {
            await new Promise(r => setTimeout(r, DELAY_BETWEEN));
        }
    }

    await browser.close();

    // 输出结果
    const output = {
        crawlTime: new Date().toISOString(),
        dataSource: '高德地图 amap.com',
        total: stations.length,
        success: success,
        noPrice: noPrice,
        failed: failed,
        stations: results
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    console.log('\n' + '='.repeat(60));
    console.log(`  爬取完成: ${success} 有电价, ${noPrice} 无电价, ${failed} 失败`);
    console.log(`  结果已保存: ${OUTPUT_FILE}`);
    console.log('='.repeat(60));

    // 打印电价对比
    console.log('\n电价对比 (爬取 vs 原有):');
    console.log('-'.repeat(60));
    results.filter(r => r.pricePerKwh).forEach(r => {
        const orig = r.originalPrice || '--';
        const crawled = r.pricePerKwh;
        const diff = r.originalPrice ? (crawled - r.originalPrice).toFixed(2) : '--';
        const diffStr = diff !== '--' ? (diff > 0 ? `(+${diff})` : `(${diff})`) : '';
        console.log(`  ${r.stationName.padEnd(30)} 爬取:¥${crawled}  原有:¥${orig}  ${diffStr}`);
    });
}

main().catch(e => {
    console.error('致命错误:', e);
    process.exit(1);
});
