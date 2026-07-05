/**
 * 工厂 & 充电站数据 v6
 * 坐标统一使用 WGS-84（已通过高德API验证），显示时由 coords.js 转为 GCJ-02
 * v6: 6个工厂(高德API精确坐标) + 重卡充电站坐标修正 + 汽车充电站类别
 */

const MAP_DATA = {

    /* ===== 物流公司大本营 ===== */
    headquarters: [
        {
            id: 'lt-hq',
            name: '物流公司',
            company: 'XX物流有限公司',
            address: '浙江省杭州市',
            lng: 119.191435,
            lat: 29.349197,
            desc: '物流公司大本营，电动重卡运输调度中心。紧邻生产基地与G6021杭长高速，辐射浙江全省及上海港集疏运通道。',
            capacity: '总部调度中心',
            phone: ''
        }
    ],

    /* ===== 生产基地（坐标已通过高德POI API验证） ===== */
    factories: [
        {
            id: 'nf-meiping',
            name: '水厂·梅坪工厂',
            company: 'XX(建德)饮用水有限公司',
            address: '浙江省杭州市建德市',
            lng: 119.248682,
            lat: 29.445426,
            water: '新安江',
            desc: '建德生产基地之一，饮用水灌装工厂。',
            capacity: '中型生产基地',
            phone: ''
        },
        {
            id: 'nf-chayuan',
            name: '水厂·茶园工厂',
            company: 'XX(淳安)有限公司',
            address: '浙江省杭州市淳安县',
            lng: 119.176691,
            lat: 29.493917,
            water: '千岛湖',
            desc: '淳安茶园工厂，位于千岛湖水源地，集生产与工业旅游于一体。',
            capacity: '大型生产基地',
            phone: ''
        },
        {
            id: 'nf-baisha',
            name: '水厂·白沙工厂',
            company: 'XX饮料股份有限公司',
            address: '浙江省杭州市建德市',
            lng: 119.221330,
            lat: 29.472644,
            water: '新安江',
            desc: '建德白沙工厂。',
            capacity: '中型生产基地',
            phone: ''
        },
        {
            id: 'nf-nanshan',
            name: '水厂·南山工厂',
            company: 'XX饮料股份有限公司',
            address: '浙江省杭州市淳安县',
            lng: 119.047878,
            lat: 29.585081,
            water: '千岛湖',
            desc: '南山工厂，淳安生产基地的重要组成部分。',
            capacity: '大型生产基地',
            phone: ''
        },
        {
            id: 'nf-chunan',
            name: '水厂·淳安工厂',
            company: 'XX饮料股份有限公司淳安生产基地',
            address: '浙江省杭州市淳安县',
            lng: 119.047845,
            lat: 29.592994,
            water: '千岛湖',
            desc: '淳安生产基地，拥有全自动化生产线。',
            capacity: '大型生产基地',
            phone: ''
        },
        {
            id: 'nf-qingxi',
            name: '水厂·清溪成品仓',
            company: 'XX(淳安)饮料有限公司',
            address: '浙江省杭州市淳安县',
            lng: 119.148819,
            lat: 29.611890,
            water: '千岛湖',
            desc: '淳安饮料有限公司，成品仓储与物流配送中心。',
            capacity: '仓储物流中心',
            phone: ''
        }
    ],

    /* ===== 重卡充电站（浙江 + 上海）— 坐标已通过高德POI API多轮验证校正 =====
       所有站点均兼容电动重型半挂牵引车 + 13.75m 半挂拖车入场
       direction: 双向=两侧都有 / 东行/西行/南行/北行=单侧 / 不限=非高速
       v6.4: 第四轮坐标验证（高德POI API + 坐标系转换），修正5个站点坐标
             cs-meishan(启源芯动力梅山港站精确坐标) / cs-keqiao(力氪绍兴集卡站)
             cs-yiwu(义乌服务区实际位置) / cs-lingang(临港微调) / cs-baoshan(中国石化宝山高新重卡站)
    */
    chargingStations: [
        {
            id: 'cs-dayun',
            name: '大云重卡充电站',
            operator: '浙江省交通集团',
            address: 'G60沪昆高速·大云收费站',
            highway: 'G60沪昆高速',
            lng: 120.945539, lat: 30.802322,
            powerKW: 400, gunType: '双枪一体式快充', chargers: 10, truckSpaces: 10,
            open24h: true, region: '浙江·嘉兴',
            desc: '浙江省首座高速公路省际重卡充电站。10台400kW双枪快充桩，10个重卡专用车位，全天候开放。配套司机驿站含空调、淋浴房、洗衣机。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.15, serviceFee: 0.40
        },
        {
            id: 'cs-tonglu',
            name: '桐庐服务区重卡充电站',
            operator: '杭千高速公司',
            address: 'G25长深高速·桐庐服务区',
            highway: 'G25长深高速',
            lng: 119.799704, lat: 29.844011,
            powerKW: 400, gunType: 'AB双枪一拖二直流快充', chargers: 20, truckSpaces: 20,
            open24h: true, region: '浙江·杭州',
            desc: '全国首家高速公路服务区"惠民充电站"专区，20个重卡充电车位，每个配备400kW一拖二直流快充桩。1小时可充400度电，支持载货重卡。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.10, serviceFee: 0.38
        },
        {
            id: 'cs-xiasha',
            name: '下沙服务区充电站',
            operator: '浙江省交通集团',
            address: 'G2504杭州绕城高速·下沙服务区',
            highway: 'G2504杭州绕城高速',
            lng: 120.360932, lat: 30.310051,
            powerKW: 360, gunType: '直流快充', chargers: 8, truckSpaces: 8,
            open24h: true, region: '浙江·杭州',
            desc: '杭州绕城高速一级服务区，配备重卡充电车位，服务过境货运车辆。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.15, serviceFee: 0.40
        },
        {
            id: 'cs-xiaoshan',
            name: '萧山服务区充电站',
            operator: '浙江省交通集团',
            address: 'G60沪昆高速·萧山服务区',
            highway: 'G60沪昆高速',
            lng: 120.243120, lat: 29.976293,
            powerKW: 400, gunType: '直流快充', chargers: 12, truckSpaces: 12,
            open24h: true, region: '浙江·杭州',
            desc: '萧山服务区为G60沪昆高速走廊核心补能节点。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.12, serviceFee: 0.38
        },
        {
            id: 'cs-jiande-svc',
            name: '建德服务区充电站',
            operator: '浙江省交通集团',
            address: '杭新景高速·建德服务区',
            highway: 'G6021杭长高速',
            lng: 119.381321, lat: 29.542990,
            powerKW: 360, gunType: '直流快充', chargers: 6, truckSpaces: 6,
            open24h: true, region: '浙江·杭州',
            desc: '杭新景高速一级服务区，靠近建德工厂，服务建材及饮料运输重卡。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.10, serviceFee: 0.35
        },
        {
            id: 'cs-jiande-xiaya',
            name: '建德下涯光储充换综合站',
            operator: '孚达新能源',
            address: '建德市下涯镇',
            highway: 'G320国道',
            lng: 119.368788, lat: 29.533109,
            powerKW: 6450, gunType: '光储充换一体化', chargers: 78, truckSpaces: 78,
            open24h: true, region: '浙江·杭州',
            desc: '总配电容量6.45MW，78个充电车位+1座重卡换电站。年光伏发电约105万度，"光储充换"一体化综合供能站。',
            hasSwap: true,
            direction: '不限',
            phone: '',
            basePrice: 0.95, serviceFee: 0.35
        },
        {
            id: 'cs-yuyao',
            name: '余姚服务区充电站',
            operator: '浙江省交通集团',
            address: 'G92杭州湾环线高速·余姚服务区',
            highway: 'G92杭州湾环线高速',
            lng: 121.110350, lat: 30.011830,
            powerKW: 360, gunType: '直流快充', chargers: 6, truckSpaces: 6,
            open24h: true, region: '浙江·宁波',
            desc: 'G92杭州湾环线高速一级服务区，连接宁波港与上海方向货运通道。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.12, serviceFee: 0.38
        },
        {
            id: 'cs-cicheng',
            name: '慈城服务区充电站',
            operator: '浙江省交通集团',
            address: 'G15沈海高速·慈城服务区',
            highway: 'G15沈海高速',
            lng: 121.419167, lat: 30.016009,
            powerKW: 400, gunType: '直流快充', chargers: 8, truckSpaces: 8,
            open24h: true, region: '浙江·宁波',
            desc: 'G15沈海高速一级服务区，服务宁波港集疏运重卡。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.12, serviceFee: 0.38
        },
        {
            id: 'cs-meishan',
            name: '宁波梅山港超充站群',
            operator: '启源芯动力',
            address: '宁波梅山保税港区·国家电投梅山港换电站',
            highway: '港区道路',
            lng: 122.015706, lat: 29.785430,
            powerKW: 400, gunType: '超充', chargers: 40, truckSpaces: 40,
            open24h: true, region: '浙江·宁波',
            desc: '8座超充站组成的充电站群，服务300辆电动集卡。港口集疏运核心补能节点。',
            hasSwap: false,
            direction: '不限',
            phone: '',
            basePrice: 1.20, serviceFee: 0.45
        },
        {
            id: 'cs-beilun',
            name: '宁波北仑港充电站',
            operator: '启源芯动力',
            address: '宁波北仑港区',
            highway: '港区道路',
            lng: 121.872743, lat: 29.921069,
            powerKW: 360, gunType: '直流快充', chargers: 16, truckSpaces: 16,
            open24h: true, region: '浙江·宁波',
            desc: '北仑港区重卡充电站，服务港口集装箱短倒运输电动重卡。日均服务量大。',
            hasSwap: true,
            direction: '不限',
            phone: '',
            basePrice: 1.18, serviceFee: 0.42
        },
        {
            id: 'cs-keqiao',
            name: '绍兴柯桥充电站群',
            operator: '力氪新能源',
            address: '绍兴市柯桥区·三江西路与中兴大道辅路',
            highway: 'G104京岚线',
            lng: 120.602505, lat: 30.105217,
            powerKW: 360, gunType: '直流快充', chargers: 18, truckSpaces: 18,
            open24h: true, region: '浙江·绍兴',
            desc: '6座充电站服务纺织原料运输。建材/渣土运输场景占比21%，绍兴区域核心补能节点。',
            hasSwap: false,
            direction: '不限',
            phone: '',
            basePrice: 1.05, serviceFee: 0.35,
            trailerCompatible: 'uncertain'
        },
        {
            id: 'cs-shaoqi',
            name: '绍兴绍汽集团广场充电站',
            operator: '浙江五元能源科技',
            address: '绍兴市越城区二环西路·绍汽集团广场（原客运西站）',
            highway: 'G104京岚线',
            lng: 120.543601, lat: 29.992580,
            powerKW: 360, gunType: '液冷超充+直流快充', chargers: 80, truckSpaces: 10,
            open24h: true, region: '浙江·绍兴',
            desc: '占地5800平方米，80把充电枪（含10把液冷超充枪），120个停车位。原客运西站改建，10把液冷超充枪(360kW)或可兼容重卡，但站点主要面向乘用车/网约车。巧克力换电服务面向乘用车。',
            hasSwap: true,
            direction: '不限',
            phone: '0575-88629999',
            basePrice: 1.08, serviceFee: 0.38,
            trailerCompatible: 'uncertain'
        },
        {
            id: 'cs-linan',
            name: '临安服务区充电站',
            operator: '浙江省交通集团',
            address: 'G56杭瑞高速·临安服务区',
            highway: 'G56杭瑞高速',
            lng: 119.530519, lat: 30.206179,
            powerKW: 360, gunType: '直流快充', chargers: 4, truckSpaces: 4,
            open24h: true, region: '浙江·杭州',
            desc: 'G56杭瑞高速一级服务区，服务杭州西部方向货运重卡。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.10, serviceFee: 0.35
        },
        {
            id: 'cs-fuyang',
            name: '富阳服务区充电站',
            operator: '浙江省交通集团',
            address: 'S43杭州绕城西复线·富阳服务区',
            highway: 'S43杭州绕城西复线',
            lng: 119.826266, lat: 30.044706,
            powerKW: 360, gunType: '直流快充', chargers: 4, truckSpaces: 4,
            open24h: true, region: '浙江·杭州',
            desc: 'S43杭州绕城西复线一级服务区，分流杭州绕城货运压力。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.10, serviceFee: 0.35
        },
        {
            id: 'cs-fenghua',
            name: '奉化服务区充电站',
            operator: '浙江省交通集团',
            address: 'G15沈海高速·奉化服务区',
            highway: 'G15沈海高速',
            lng: 121.445147, lat: 29.619365,
            powerKW: 360, gunType: '直流快充', chargers: 6, truckSpaces: 6,
            open24h: true, region: '浙江·宁波',
            desc: 'G15沈海高速一级服务区，服务宁波南部方向货运通道。',
            hasSwap: false,
            direction: '双向',
            phone: '12122',
            basePrice: 1.12, serviceFee: 0.38
        },
        {
            id: 'cs-yiwu',
            name: '义乌服务区充电站',
            operator: '启源芯动力',
            address: '甬金高速·义乌服务区（建设中）',
            highway: '甬金高速',
            lng: 119.929076, lat: 29.227891,
            powerKW: 400, gunType: '直流快充', chargers: 10, truckSpaces: 10,
            open24h: true, region: '浙江·金华',
            desc: '甬金高速走廊核心节点，连接宁波舟山港与义乌国际商贸城。单程210公里，配套5座充换电站。注：义乌服务区扩建中，充电设施规划建设中。',
            hasSwap: true,
            direction: '双向',
            phone: '',
            basePrice: 1.15, serviceFee: 0.40
        },
        {
            id: 'cs-changxing',
            name: '湖州长兴换电站群',
            operator: '力氪新能源',
            address: '湖州市长兴县',
            highway: 'G50沪渝高速',
            lng: 119.908000, lat: 30.998000,
            powerKW: 0, gunType: '换电为主', chargers: 4, truckSpaces: 12,
            open24h: true, region: '浙江·湖州',
            desc: '4座换电站实现矿区运输"零排放"。矿区运输场景占比8%，换电模式适合固定线路。',
            hasSwap: true,
            direction: '不限',
            phone: '',
            basePrice: 1.25, serviceFee: 0.50,
            trailerCompatible: 'uncertain'
        },
        /* ===== 上海区域 ===== */
        {
            id: 'cs-zhangyang',
            name: '张杨北路充换电站',
            operator: '启源芯动力',
            address: '上海市浦东新区外高桥·张杨北路',
            highway: '临港-外高桥-宝山-太仓干线',
            lng: 121.584796, lat: 31.293426,
            powerKW: 400, gunType: '充换电一体', chargers: 30, truckSpaces: 30,
            open24h: true, region: '上海·浦东',
            desc: '上海市内规模最大的重卡充换电开放场站。标志着重卡充换电干线正式贯通。',
            hasSwap: true,
            direction: '不限',
            phone: '',
            basePrice: 1.20, serviceFee: 0.45
        },
        {
            id: 'cs-lingang',
            name: '临港充换电站',
            operator: '启源芯动力',
            address: '上海市浦东新区·临港新片区',
            highway: '临港-外高桥-宝山-太仓干线',
            lng: 121.901668, lat: 30.896881,
            powerKW: 400, gunType: '充换电一体', chargers: 20, truckSpaces: 20,
            open24h: true, region: '上海·浦东',
            desc: '临港重卡充换电干线起点站，服务洋山港集卡及临港物流园区。',
            hasSwap: true,
            direction: '不限',
            phone: '',
            basePrice: 1.18, serviceFee: 0.42
        },
        {
            id: 'cs-baoshan',
            name: '宝山重卡充电站',
            operator: '中国石化',
            address: '上海市宝山区·云洲路96号',
            highway: '临港-外高桥-宝山-太仓干线',
            lng: 121.342324, lat: 31.458637,
            powerKW: 360, gunType: '直流快充', chargers: 16, truckSpaces: 16,
            open24h: true, region: '上海·宝山',
            desc: '中国石化宝山高新重卡充电站，位于云洲路96号，服务上海港与太仓方向货运通道的重卡充电需求。',
            hasSwap: false,
            direction: '不限',
            phone: '',
            basePrice: 1.18, serviceFee: 0.42
        },
        {
            id: 'cs-yangshan',
            name: '洋山港集卡充电站',
            operator: '启源芯动力',
            address: '洋山深水港',
            highway: '东海大桥',
            lng: 122.064700, lat: 30.614700,
            powerKW: 360, gunType: '直流快充', chargers: 12, truckSpaces: 12,
            open24h: true, region: '上海·洋山港',
            desc: '洋山深水港集卡充电站，服务港口集装箱电动集卡短倒运输。东海大桥沿线核心补能节点。注：该站点未在高德POI库中收录，坐标为洋山港区域近似值，待实地确认。',
            hasSwap: false,
            direction: '不限',
            phone: '',
            basePrice: 1.22, serviceFee: 0.45
        }
    ],

    /* ===== 汽车充电站（普通乘用车，坐标已通过高德POI API获取） ===== */
    /* ===== 小型车充电站 — 每站含实际综合电价(pricePerKwh)和服务费(serviceFee)
       pricePerKwh: 平段综合电价(元/度)，来自 modiauto.com.cn 网络调研
       serviceFee:  服务费(元/度)，固定不随时段变化
       touEnabled:  是否分时计费(true=电费部分随峰谷浮动, false=全天统一价)
       priceSource: 数据来源
       priceUpdated: 数据调研日期
       电费部分 = pricePerKwh - serviceFee，按峰谷倍率浮动
       实际总价 = 电费部分 × 时段倍率 + 服务费
    */
    carChargingStations: [
        // === 淳安县（千岛湖区域，靠近工厂） ===
        { id: 'cc-cna-01', name: '星星充电(千岛湖行岗路停车场)', operator: '星星充电', address: '千岛湖镇新安西路', lng: 119.029938, lat: 29.603154, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.15, serviceFee: 0.40, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-02', name: '中国石化(千岛湖充电站)', operator: '中国石化', address: '千岛湖镇新安东路608号', lng: 119.059397, lat: 29.616232, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-03', name: '中国石化(千岛湖新旅游码头)', operator: '中国石化', address: '千岛湖风景区游船码头停车场', lng: 119.009788, lat: 29.597609, region: '浙江·淳安', open24h: false,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-04', name: '特斯拉超充(千岛湖峰泰君亭酒店)', operator: '特斯拉', address: '千岛湖镇南景路427号', lng: 119.021816, lat: 29.600970, region: '浙江·淳安', open24h: true,
          pricePerKwh: 2.00, serviceFee: 0.00, touEnabled: false, priceSource: '特斯拉统一价', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-05', name: '国家电网(千岛湖花海明月)', operator: '国家电网', address: '花海明月地面停车场', lng: 119.048179, lat: 29.638868, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.18, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto精确匹配', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-06', name: '云快充(千岛湖秀水舫)', operator: '云快充', address: '千岛湖秀水舫酒店停车场', lng: 119.036936, lat: 29.629382, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-07', name: '星星充电(千岛湖辉照山公园)', operator: '星星充电', address: '千岛湖镇环湖北路345号', lng: 119.062357, lat: 29.607993, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.15, serviceFee: 0.40, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-08', name: '千岛湖红山充电站(云快充)', operator: '云快充', address: '千岛湖宏山停车场', lng: 119.048320, lat: 29.614641, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-09', name: '小鹏超充(淳安千岛湖银泰城)', operator: '小鹏', address: '千岛湖镇新安大街125号银泰城', lng: 119.044301, lat: 29.606758, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.50, serviceFee: 0.40, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-cna-10', name: '中国石化(青溪银泰城充电站)', operator: '中国石化', address: '千岛湖镇千岛湖青溪银泰城', lng: 119.138929, lat: 29.614038, region: '浙江·淳安', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        // === 建德市（靠近工厂） ===
        { id: 'cc-jde-01', name: '中国石化超充(溪头农贸市场)', operator: '中国石化', address: '严州大道797号', lng: 119.296448, lat: 29.475944, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-02', name: '中镉超充(G320国道乾潭快充)', operator: '中镉超充', address: '建德市建北北路', lng: 119.541999, lat: 29.629682, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true, priceSource: '运营商估算', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-03', name: '力氪(孚达重卡充电站建德寿昌)', operator: '力氪新能源', address: '寿昌镇', lng: 119.220203, lat: 29.369011, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.10, serviceFee: 0.40, touEnabled: true, priceSource: '重卡专用估算', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-04', name: '国家电网(建德城西充电站)', operator: '国家电网', address: '新安路241号', lng: 119.262247, lat: 29.475204, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.18, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto建德国网', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-05', name: '中国铁塔(建德睦洲客栈)', operator: '中国铁塔', address: '百旗路141号', lng: 119.448193, lat: 29.568260, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.10, serviceFee: 0.40, touEnabled: true, priceSource: '运营商估算', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-06', name: '中国石化(于合充电站)', operator: '中国石化', address: '更楼街道新衢路650号', lng: 119.235780, lat: 29.403155, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-07', name: '特斯拉超充(建德逸龙创意谷)', operator: '特斯拉', address: '洋溪街道朝阳路239号', lng: 119.315122, lat: 29.519951, region: '浙江·建德', open24h: true,
          pricePerKwh: 2.00, serviceFee: 0.00, touEnabled: false, priceSource: '特斯拉统一价', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-08', name: '建德服务区国家电网充电站', operator: '国家电网', address: '建德服务区地面停车场', lng: 119.382047, lat: 29.543150, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.70, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto高速服务区', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-09', name: '特来电(建德智慧微电网)', operator: '特来电', address: '洋溪街道洋安路', lng: 119.314603, lat: 29.505963, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.60, serviceFee: 0.50, touEnabled: false, priceSource: 'modiauto精确匹配', priceUpdated: '2026-07-06' },
        { id: 'cc-jde-10', name: '国家电网(白沙充电站)', operator: '国家电网', address: '白沙变地面停车场', lng: 119.298098, lat: 29.480400, region: '浙江·建德', open24h: true,
          pricePerKwh: 1.12, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto精确匹配', priceUpdated: '2026-07-06' },
        // === 杭州市区 ===
        { id: 'cc-hz-01', name: '星星充电(东宁路新能源二期)', operator: '星星充电', address: '东宁路地面停车场(枸桔弄地铁站C口)', lng: 120.203670, lat: 30.300565, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.24, serviceFee: 0.40, touEnabled: false, priceSource: 'modiauto杭州星星充电', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-02', name: '国家电网(上城香樟街站)', operator: '国家电网', address: '香樟路2号地面停车场(市民中心地铁站N1口)', lng: 120.205905, lat: 30.242779, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.39, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto精确匹配', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-03', name: '星星充电(黄龙体育中心)', operator: '星星充电', address: '黄龙体育中心(黄龙体育中心地铁站F口)', lng: 120.129309, lat: 30.269475, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.24, serviceFee: 0.40, touEnabled: false, priceSource: 'modiauto杭州星星充电', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-04', name: '中国石化超充(通晨充电站)', operator: '中国石化', address: '萧山区星创雅望居北门西北130米', lng: 120.282856, lat: 30.141953, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-05', name: '国家电网(湘湖路充电站)', operator: '国家电网', address: '湘湖路北50米地面停车场(湘湖壹号对面)', lng: 120.191032, lat: 30.125998, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.39, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto杭州国网', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-06', name: '国家电网(和平广场充电站)', operator: '国家电网', address: '绍兴路157号地面停车场(打铁关地铁站F口)', lng: 120.171881, lat: 30.290768, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.39, serviceFee: 0.40, touEnabled: true, priceSource: 'modiauto杭州国网', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-07', name: '中国石化(石化易电大塘充电站)', operator: '中国石化', address: '临丁路655号', lng: 120.219612, lat: 30.363868, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-hz-08', name: '云硕超充(庆隆新能源充电广场)', operator: '云硕新能源', address: '祥符街道余杭塘路辅路庆隆新能源充电广场', lng: 120.115605, lat: 30.296094, region: '浙江·杭州', open24h: true,
          pricePerKwh: 1.30, serviceFee: 0.40, touEnabled: true, priceSource: '运营商估算', priceUpdated: '2026-07-06' },
        // === 宁波市 ===
        { id: 'cc-nb-01', name: '国家电网(宁波火车站兆瓦级超充)', operator: '国家电网', address: '宁波火车站', lng: 120.089190, lat: 29.340553, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.30, serviceFee: 0.40, touEnabled: true, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-02', name: '中国石化(宁波鄞州中兴路)', operator: '中国石化', address: '民航小区', lng: 120.136790, lat: 29.333756, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-03', name: '甬城智充(菱池综合能源站)', operator: '甬城智充', address: '菱池街西门口地铁口D口旁', lng: 120.097500, lat: 29.351664, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true, priceSource: '运营商估算', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-04', name: '中国石化超充(双创大厦)', operator: '中国石化', address: '前湾新区玉海西路201号创业创新大厦北侧', lng: 121.205581, lat: 30.360439, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-05', name: '中国石化超充(五乡四安)', operator: '中国石化', address: '329国道南侧四安村', lng: 120.238005, lat: 29.321877, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-06', name: '特来电(慈溪宗汉太阳超充)', operator: '特来电', address: '宗汉街道北二环西路68号', lng: 121.232579, lat: 30.185004, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.60, serviceFee: 0.50, touEnabled: false, priceSource: 'modiauto特来电统一', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-07', name: '甬城智充(宁波压大超充·华为)', operator: '甬城智充', address: '环城北路东段247号', lng: 120.134866, lat: 29.379563, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true, priceSource: '运营商估算', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-08', name: '中国石化超充(三官堂大桥)', operator: '中国石化', address: '三官堂大桥北侧', lng: 120.177662, lat: 29.389295, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-09', name: '中国石化(响岭岗充电站)', operator: '中国石化', address: '锦屏街道南山路227号', lng: 121.408753, lat: 29.704690, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, priceSource: '运营商默认(modiauto)', priceUpdated: '2026-07-06' },
        { id: 'cc-nb-10', name: '余姚北站特来电充电站', operator: '特来电', address: '凤山街道站南路余姚北站', lng: 121.169881, lat: 30.118969, region: '浙江·宁波', open24h: true,
          pricePerKwh: 1.60, serviceFee: 0.50, touEnabled: false, priceSource: 'modiauto特来电统一', priceUpdated: '2026-07-06' }
    ],

    /* 货车参数（默认大电池预设） */
    truckConfig: {
        axles: 6,
        maxWeight: 49,
        trailerLength: 13.75,
        totalLength: 18.1,
        batteryCapacity: 600,
        consumptionPerKm: 1.8,
        fullChargeRange: 333,
        chargingPower: 600,
        chargingEfficiency: 0.92,
        minSOC: 0.15,
        targetSOC: 0.85,
    },

    /* 费用参数 — 仅作为没有站点级电价数据时的兜底默认值
       实际计算优先使用每个站点的 pricePerKwh 字段（来自运营商/网络调研的实际综合电价） */
    costConfig: {
        etcRatePerKm: 2.50,          // 6轴重卡高速费率（元/km，实际以高德API返回为准）
        etcDiscount: 0.95,           // ETC折扣（浙江95折）
        defaultPricePerKwh: 1.20,    // 兜底默认综合电价（元/度，含电费+服务费）
        driverWagePerHour: 35,
    },

    /* 运营商默认电价表 — 来自网络调研（modiauto.com.cn等），用于无站点级数据的兜底
       pricePerKwh: 平段综合电价(元/度)
       serviceFee: 服务费(元/度，固定)
       touEnabled: 是否分时计费(true=电费随峰谷浮动)
       数据调研日期：2026-07-06 */
    operatorPricing: {
        '国家电网':       { pricePerKwh: 1.30, serviceFee: 0.40, touEnabled: true,  source: 'modiauto.com.cn调研' },
        '特来电':         { pricePerKwh: 1.60, serviceFee: 0.50, touEnabled: false, source: 'modiauto.com.cn调研(统一价)' },
        '星星充电':       { pricePerKwh: 1.15, serviceFee: 0.40, touEnabled: false, source: 'modiauto.com.cn调研' },
        '中国石化':       { pricePerKwh: 1.00, serviceFee: 0.30, touEnabled: false, source: 'modiauto.com.cn调研' },
        '云快充':         { pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true,  source: 'modiauto.com.cn调研' },
        '特斯拉':         { pricePerKwh: 2.00, serviceFee: 0.00, touEnabled: false, source: '运营商统一价' },
        '小鹏':           { pricePerKwh: 1.50, serviceFee: 0.40, touEnabled: false, source: 'modiauto.com.cn调研' },
        '甬城智充':       { pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true,  source: '运营商估算' },
        '云硕新能源':     { pricePerKwh: 1.30, serviceFee: 0.40, touEnabled: true,  source: '运营商估算' },
        '中国铁塔':       { pricePerKwh: 1.10, serviceFee: 0.40, touEnabled: true,  source: '运营商估算' },
        '力氪新能源':     { pricePerKwh: 1.10, serviceFee: 0.40, touEnabled: true,  source: '重卡专用估算' },
        '中镉超充':       { pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true,  source: '运营商估算' },
        '浙江省交通集团': { pricePerKwh: 1.15, serviceFee: 0.40, touEnabled: true,  source: '高速服务区调研' },
        '杭千高速公司':   { pricePerKwh: 1.10, serviceFee: 0.38, touEnabled: true,  source: '高速服务区调研' },
        '协鑫能科':       { pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: true,  source: '运营商估算' },
        '蔚来':           { pricePerKwh: 1.30, serviceFee: 0.40, touEnabled: false, source: 'modiauto.com.cn调研' },
        '奥动新能源':     { pricePerKwh: 1.20, serviceFee: 0.40, touEnabled: false, source: '换电站估算' },
    },

    /* 分时电价时段定义 — 用于分时计费站点(touEnabled=true)的电费部分浮动计算
       电费部分 = (pricePerKwh - serviceFee) × 时段倍率
       总价 = 电费部分 + 服务费
       非分时站点(touEnabled=false)全天使用 pricePerKwh 统一价
       数据来源：浙发改价格〔2024〕21号 + 2026年7月新政 */
    timeOfUse: {
        multipliers: {
            sharpPeak: 2.05,  // 尖峰
            onPeak: 1.85,     // 高峰
            midPeak: 1.0,     // 平段
            offPeak: 0.4,     // 低谷
            deepValley: 0.2   // 深谷（仅节假日10:00-14:00）
        },
        labels: {
            sharpPeak: '尖峰',
            onPeak: '高峰',
            midPeak: '平段',
            offPeak: '低谷',
            deepValley: '深谷'
        },
        // 夏冬季月份: 1月、7月、8月、12月
        summerWinterMonths: [1, 7, 8, 12],
        // 充电站时段定义（分钟，0=午夜）
        summer: [
            { type: 'offPeak',  start: 0,    end: 480 },   // 0:00-8:00 低谷
            { type: 'midPeak',  start: 480,  end: 630 },   // 8:00-10:30 平段
            { type: 'offPeak',  start: 630,  end: 840 },   // 10:30-14:00 低谷(充电站专属)
            { type: 'midPeak',  start: 840,  end: 960 },   // 14:00-16:00 平段
            { type: 'onPeak',   start: 960,  end: 1080 },  // 16:00-18:00 高峰
            { type: 'sharpPeak',start: 1080, end: 1320 },  // 18:00-22:00 尖峰
            { type: 'onPeak',   start: 1320, end: 1380 },  // 22:00-23:00 高峰
            { type: 'midPeak',  start: 1380, end: 1440 }   // 23:00-24:00 平段
        ],
        transition: [
            { type: 'offPeak', start: 0,    end: 480 },    // 0:00-8:00 低谷
            { type: 'midPeak', start: 480,  end: 630 },    // 8:00-10:30 平段
            { type: 'offPeak', start: 630,  end: 840 },    // 10:30-14:00 低谷(充电站专属)
            { type: 'midPeak', start: 840,  end: 960 },    // 14:00-16:00 平段
            { type: 'onPeak',  start: 960,  end: 1380 },   // 16:00-23:00 高峰
            { type: 'midPeak', start: 1380, end: 1440 }    // 23:00-24:00 平段
        ],
        source: '浙发改价格〔2024〕21号 + 2026年7月新政（仅作时段参考，电价以站点实际为准）',
        deepValleyHolidays: true
    }
};

/**
 * 实时数据模拟模块
 * 基于当前时间生成模拟实时数据（电价时段、空位变化）
 */
const RealTimeData = {

    // 爬取的实时电价缓存（从 price-data.json 加载）
    crawledPrices: null,
    crawledAt: null,

    /**
     * 异步加载爬取的实时电价
     * 数据来源: price-crawler.js 爬取高德地图 → price-data.json
     * 优先尝试 /api/prices (后端实时) → price-data.json (静态文件)
     */
    async loadCrawledPrices() {
        if (this.crawledPrices !== null) return this.crawledPrices;
        this.crawledPrices = {};
        try {
            let resp;
            // 尝试1: 后端API（vehicle-proxy 提供 /api/prices）
            try { resp = await fetch('/api/prices'); } catch(e) {}
            // 尝试2: 静态文件
            if (!resp || !resp.ok) {
                try { resp = await fetch('price-data.json'); } catch(e) {}
            }
            if (!resp || !resp.ok) return null;
            const data = await resp.json();
            if (data && data.stations) {
                data.stations.forEach(s => {
                    if (s.pricePerKwh && !s.error) {
                        this.crawledPrices[s.stationId] = {
                            pricePerKwh: s.pricePerKwh,
                            chargePrice: s.chargePrice,
                            brand: s.brand,
                            source: '高德地图实时',
                            updated: s.crawledAt
                        };
                    }
                });
                this.crawledAt = data.crawlTime;
                const count = Object.keys(this.crawledPrices).length;
                if (count > 0) console.log('[电价] 已加载 ' + count + ' 个站点实时电价 (' + (data.crawlTime || '') + ')');
            }
            return this.crawledPrices;
        } catch(e) {
            return null;
        }
    },

    /**
     * 获取充电站的实际综合电价信息
     * 优先级：爬取实时电价 > 站点pricePerKwh > 运营商默认价 > 全局默认价
     * 返回：{ pricePerKwh, serviceFee, touEnabled, electricityBase, source, updated }
     *   pricePerKwh: 平段综合电价(元/度，含电费+服务费)
     *   serviceFee: 服务费(元/度，固定)
     *   touEnabled: 是否分时计费
     *   electricityBase: 平段电费部分 = pricePerKwh - serviceFee
     */
    getStationPrice(station) {
        let pricePerKwh, serviceFee, touEnabled, source, updated;

        // 0. 爬取的实时电价（最高优先级，来自高德地图）
        if (this.crawledPrices && this.crawledPrices[station.id]) {
            const crawled = this.crawledPrices[station.id];
            pricePerKwh = crawled.pricePerKwh;
            serviceFee = station.serviceFee !== undefined ? station.serviceFee : 0.40;
            touEnabled = station.touEnabled !== undefined ? station.touEnabled : true;
            source = crawled.source;
            updated = crawled.updated ? crawled.updated.substring(0, 10) : '';
        }
        // 1. 站点级实际电价
        else if (station.pricePerKwh) {
            pricePerKwh = station.pricePerKwh;
            serviceFee = station.serviceFee !== undefined ? station.serviceFee : 0.40;
            touEnabled = station.touEnabled !== undefined ? station.touEnabled : true;
            source = station.priceSource || '站点数据';
            updated = station.priceUpdated || '';
        }
        // 2. 重卡充电站的旧格式兼容
        else if (station.basePrice) {
            pricePerKwh = station.basePrice;
            serviceFee = station.serviceFee !== undefined ? station.serviceFee : 0.40;
            touEnabled = true;
            source = station.priceSource || '站点数据';
            updated = station.priceUpdated || '';
        }
        // 3. 运营商默认电价
        else {
            const op = MAP_DATA.operatorPricing[station.operator];
            if (op) {
                pricePerKwh = op.pricePerKwh;
                serviceFee = op.serviceFee || 0.40;
                touEnabled = op.touEnabled !== undefined ? op.touEnabled : true;
                source = op.source + '(运营商默认)';
                updated = '2026-07-06';
            } else {
                pricePerKwh = MAP_DATA.costConfig.defaultPricePerKwh;
                serviceFee = 0.40;
                touEnabled = true;
                source = '全局默认（需核实）';
                updated = '';
            }
        }

        return {
            pricePerKwh,
            serviceFee,
            touEnabled,
            electricityBase: pricePerKwh - serviceFee,  // 平段电费部分
            source,
            updated
        };
    },

    /**
     * 获取当前电价时段
     * 返回：{ type, label, multiplier }
     */
    getCurrentPeriod() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const minutes = now.getHours() * 60 + now.getMinutes();

        const tou = MAP_DATA.timeOfUse;
        const isSummerWinter = tou.summerWinterMonths.includes(month);
        const slots = isSummerWinter ? tou.summer : tou.transition;

        for (const slot of slots) {
            if (minutes >= slot.start && minutes < slot.end) {
                return {
                    type: slot.type,
                    label: tou.labels[slot.type],
                    multiplier: tou.multipliers[slot.type]
                };
            }
        }

        return { type: 'midPeak', label: tou.labels.midPeak, multiplier: tou.multipliers.midPeak };
    },

    /**
     * 获取充电站在指定时间的实际电价（元/度）
     * 分时站点：电费部分 × 时段倍率 + 服务费
     * 非分时站点：全天统一价 pricePerKwh
     * @param station 站点对象
     * @param dateTime 可选，指定时间(用于跨时段计算)，默认当前时间
     * @returns { price, period, multiplier, electricity, serviceFee, touEnabled }
     */
    getPriceAtTime(station, dateTime) {
        const priceInfo = this.getStationPrice(station);
        const now = dateTime || new Date();
        const month = now.getMonth() + 1;
        const minutes = now.getHours() * 60 + now.getMinutes();

        const tou = MAP_DATA.timeOfUse;
        const isSummerWinter = tou.summerWinterMonths.includes(month);
        const slots = isSummerWinter ? tou.summer : tou.transition;

        let periodType = 'midPeak';
        for (const slot of slots) {
            if (minutes >= slot.start && minutes < slot.end) {
                periodType = slot.type;
                break;
            }
        }
        const multiplier = tou.multipliers[periodType];
        const periodLabel = tou.labels[periodType];

        let price, electricity;
        if (priceInfo.touEnabled) {
            // 分时计费：电费部分随峰谷浮动，服务费固定
            electricity = priceInfo.electricityBase * multiplier;
            price = electricity + priceInfo.serviceFee;
        } else {
            // 非分时：全天统一价
            electricity = priceInfo.electricityBase;
            price = priceInfo.pricePerKwh;
        }

        return {
            price: parseFloat(price.toFixed(4)),
            electricity: parseFloat(electricity.toFixed(4)),
            serviceFee: priceInfo.serviceFee,
            period: periodLabel,
            periodType,
            multiplier,
            touEnabled: priceInfo.touEnabled
        };
    },

    /**
     * 获取充电站实时数据
     * 电价：使用站点实际电价，分时站点按当前时段计算
     */
    getStationRealTime(station) {
        const period = this.getCurrentPeriod();
        const priceInfo = this.getStationPrice(station);
        const currentPriceInfo = this.getPriceAtTime(station);
        const now = new Date();
        const seed = parseInt(station.id.replace(/[^0-9]/g, ''), 10) || 1;
        const minuteSeed = now.getHours() * 60 + now.getMinutes();

        const rand = (offset) => {
            const v = Math.sin(seed * 9.7 + minuteSeed * 0.13 + offset) * 10000;
            return v - Math.floor(v);
        };

        const dayFactor = now.getHours() >= 8 && now.getHours() <= 20 ? 0.4 : 0.75;
        const chargers = station.chargers || 4;
        const truckSpaces = station.truckSpaces || 0;
        const available = Math.max(0, Math.floor(chargers * dayFactor * (0.6 + rand(1) * 0.4)));
        const availSpaces = Math.max(0, Math.floor(truckSpaces * dayFactor * (0.5 + rand(2) * 0.5)));
        const queue = Math.max(0, Math.floor(rand(3) * (chargers - available) * 0.3));
        const waitTime = queue * Math.floor(8 + rand(4) * 12);

        let swapInfo = '';
        if (station.hasSwap) {
            const swapAvail = Math.floor(rand(5) * 8) + 2;
            swapInfo = `换电电池组可用：${swapAvail}组`;
        }

        return {
            period: period.label,
            periodType: period.type,
            currentPrice: currentPriceInfo.price.toFixed(2),        // 当前实际电价(含分时浮动)
            basePrice: priceInfo.pricePerKwh.toFixed(2),            // 平段基准电价
            electricity: currentPriceInfo.electricity.toFixed(2),   // 当前电费部分
            serviceFee: priceInfo.serviceFee.toFixed(2),            // 服务费
            touEnabled: priceInfo.touEnabled,                       // 是否分时计费
            multiplier: currentPriceInfo.multiplier,                // 当前时段倍率
            priceSource: priceInfo.source,                          // 电价来源
            priceUpdated: priceInfo.updated,                        // 电价更新日期
            availableChargers: available,
            totalChargers: chargers,
            availableSpaces: availSpaces,
            totalSpaces: truckSpaces,
            queue: queue,
            waitTime: waitTime,
            swapInfo: swapInfo,
            lastUpdate: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`,
            timestamp: now.getTime()
        };
    },

    formatTimestamp(ts) {
        const d = new Date(ts);
        return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
    }
};
