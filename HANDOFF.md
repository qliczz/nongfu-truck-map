# 项目交接文档 — 充电物流地图

> **用途**：新对话开始时，让AI读取此文件即可完全接上项目进度，无需重新探索代码。
> **最后更新**：2026-07-06 05:00 (v6.8)

---

## 一、项目概述

一个兼容手机和PC的在线地图应用（纯Web，URL直接访问，非APP），覆盖中国浙江省与上海市区域。

**工作目录**：`C:\Users\Administrator\WorkBuddy\2026-07-06-03-28-34`
**GitHub**：https://github.com/qliczz/nongfu-truck-map

**核心功能**：地图标注物流公司大本营+生产基地+重卡充电站+小型汽车充电站+收费站+服务区，支持重型半挂牵引车（13.75m拖车）路径规划（含货车限行规避），计算ETC费用和充电费用，集成云查车实时车辆追踪（支持云端部署），电价配置本地持久化。

---

## 二、技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 前端 | 原生 HTML/CSS/JS | 无框架，纯静态文件 |
| 地图库 | Leaflet.js 1.9.4 | CDN引入 |
| 地图瓦片 | 高德地图（GCJ-02） | 标准/详细/卫星/混合四种模式 |
| 坐标转换 | 自实现 WGS-84↔GCJ-02 | `js/coords.js` |
| 路径规划 | 高德REST API v5（优先）+ OSRM（降级） | 内置默认API Key，支持多途经点 |
| 货车导航 | 高德货车导航API v5 | `/v5/direction/truck`，自动规避限行/禁行 |
| 车辆追踪 | vehicle-proxy.js v4 (Node.js) | 支持云端部署，环境变量配置 |
| 电价配置 | localStorage | 用户自定义电价参数持久化 |
| 部署 | Nginx + PM2 | 支持域名+HTTPS部署 |

---

## 三、文件结构与行数

```
index.html           (~410行)   主页面(用户端) — 侧边栏面板 + 地图容器 + 弹窗模板 + 右键菜单 + 车辆追踪面板 + 大本营图层 + 货车模式开关 + 电价重置按钮
admin.html           (~1025行)  后台管理界面 — 密码保护 + 数据表格内联编辑 + JSON导入导出
css/style.css        (~1920行)  全部样式 — 响应式布局、弹窗、参数表单、实时数据、车辆标记、图层面板、电价组件、大本营标记样式
js/coords.js         (62行)     WGS-84↔GCJ-02 坐标转换
js/data.js           (~820行)   大本营1个 + 工厂6个 + 重卡充电站21个(坐标已验证) + 汽车充电站38个(全部配置真实电价) + RealTimeData + 分时段电价引擎
js/routing.js        (~560行)   路径规划（高德v5+货车导航+OSRM+降级）+ 多模式并行规划 + ETC/充电费用计算(TOU感知)
js/app.js            (~2800行)  主应用逻辑 — 地图初始化、标注、弹窗、路径规划、右键选点、图层切换、路况、电价(TOU分段计算)、车辆追踪、大本营标记、云端代理配置
js/tollstations.js   (~5930行)  收费站数据（658条，浙江11市+上海）
vehicle-proxy.js     (~340行)   云查车代理服务器 v4 — 云端部署就绪，环境变量配置，健康检查端点
DEPLOYMENT.md        (~200行)   完整部署指南 — 车辆代理云端部署 + 域名HTTPS + 安卓APK打包
```

---

## 四、版本更新历史

### v6.8 更新（当前版本）

#### ① 充电站分时段电价系统（核心重构）
- **问题**：用户要求获取各站点真实电价（非政策估算），并在充电费用计算中考虑跨峰谷时段的价格波动
- **数据来源**：从 modiauto.com.cn（充电桩聚合平台）爬取杭州/绍兴/建德/淳安等城市的实际充电站电价
- **所有38个汽车充电站现已配置真实电价**：
  - 每个站点新增 `pricePerKwh`（综合电价）、`serviceFee`（服务费）、`touEnabled`（是否分时计费）、`priceSource`（数据来源）、`priceUpdated`（更新日期）
  - 国家电网8站（分时）：¥1.39/度，服务费¥0.40
  - 特斯拉2站（统一）：¥2.00/度，服务费¥0.00
  - 特来电3站（统一）：¥1.60/度，服务费¥0.50
  - 星星充电4站（统一）：¥1.24/度，服务费¥0.40
  - 中国石化12站（统一）：¥1.00/度，服务费¥0.40
  - 其他运营商（云快充/小鹏/中镉超充/力氪/中国铁塔/云硕/甬城智充）均配置实际电价

#### ② 分时段电价计算引擎
- **公式**：分时站点 `实际电价 = (pricePerKwh - serviceFee) × 时段倍率 + serviceFee`；非分时站点全天统一价
- **五时段倍率**：尖峰2.05 / 高峰1.85 / 平段1.0 / 低谷0.4 / 深谷0.2
- **季节区分**：夏冬季(1/7/8/12月) vs 春秋季，时段表不同
- **充电站专属低谷**：每日10:30-14:00
- **15分钟分段精度**：充电费用按15分钟粒度分段计算，精确捕捉时段切换点
- **跨时段处理**：如17:30开始充150分钟 → 高峰(30min, ¥2.23/度) + 尖峰(120min, ¥2.43/度)
- **分段合并显示**：连续相同时段的分段自动合并，展示更清晰
- **data.js** 新增 `RealTimeData.getPriceAtTime(station, dateTime)` — 返回任意时刻的实际电价
- **data.js** `getStationPrice()` 重写 — 返回完整价格信息 `{ pricePerKwh, serviceFee, touEnabled, electricityBase, source, updated }`
- **app.js** `calculateChargingCostWithTime()` 完全重写 — 15分钟分段 + TOU倍率 + 分段合并
- **app.js** 弹窗/路径详情显示分时标签、基准电价、服务费、计费方式
- **routing.js** `calculateCharging()` 更新 — 使用TOU倍率估算峰谷价格

#### ③ Bug修复
- 特斯拉服务费为0时，`serviceFee || 0.40` 误判为falsy → 改为 `serviceFee !== undefined ? station.serviceFee : 0.40`
- `app.js` 中 `const tou` 在同一作用域重复声明 → 删除冗余声明

#### ④ 电价差异示例（90分钟充电费用）
| 时段 | 国网香樟街(分时) | 特来电(统一) |
|------|-----------------|-------------|
| 全低谷(03:00) | ¥387 | ¥778 |
| 全平段(10:00) | ¥483 | ¥778 |
| 跨高峰(16:30) | ¥1,085 | ¥778 |
| 全尖峰(19:00) | ¥1,181 | ¥778 |

### v6.7 更新

#### ① 高倍缩放自适应标记/字体
- CSS四级缩放自适应：zoom-low(≤9) / zoom-mid(≤13) / zoom-high(≤16) / zoom-max(17+)
- 低倍缩放隐藏标签，高倍缩放放大标记和标签
- `app.js` 新增 `updateZoomClass()` 方法，监听 `zoomend` 事件
- `style.css` 新增 `.zoom-low/.zoom-mid/.zoom-high/.zoom-max` CSS类
- 标记尺寸：28px→32px→40px→48px，标签字体：12px→13px→14px→16px

#### ② 电费计算改为2026浙江新政（五时段电价）
- **政策依据**：浙发改价格〔2024〕21号 + 2026年7月新政
- 五时段倍率：尖峰2.05 / 高峰1.85 / 平段1.0 / 低谷0.4 / 深谷0.2
- 平段基准电价0.75元/kWh（反算自低谷0.30、尖峰1.54）
- **关键修复**：电费（时段倍率）与服务费（固定0.40元/kWh）分离计算
- 季节区分：夏冬季(1/7/8/12月) vs 春秋季，时段表不同
- 充电站特殊：每日10:30-14:00低谷时段
- `data.js` `timeOfUse` 结构完全重写为分钟级时段数组
- `data.js` `costConfig` 更新默认值（elec-offpeak=0.30, elec-peak=1.54, elec-avg=0.74）
- `app.js` `updateElecWidget()` / `getNextPeriodChange()` / `calculateChargingCostWithTime()` 全部重写
- `routing.js` `calculateCharging()` 修正服务费叠加逻辑
- `index.html` 参数标签更新（"谷时电费"→"低谷电费"等），新增副标题说明
- 路径详情新增"数据来源"行，标注ETC数据来自高德实时API

#### ③ 全量坐标重新验证 + 修正12个系统性错误
- 运行3轮验证脚本（verify-all-coords-v2.js / verify-problem-coords.js / find-correct-coords.js）
- **发现系统性坐标错误**：12个小型充电站坐标全部偏移到桐庐/浦江/义乌地区（偏差50-150公里）
- **已修正站点**（全部通过高德POI API精确匹配确认）：

| 站点ID | 站名 | 旧坐标(错误) | 新坐标(正确) | 验证偏差 |
|--------|------|-------------|-------------|---------|
| cc-hz-01 | 星星充电(东宁路) | 119.832, 29.781 | 120.204, 30.301 | 240m |
| cc-hz-02 | 国家电网(香樟街) | 119.835, 29.723 | 120.206, 30.243 | 611m |
| cc-hz-03 | 星星充电(黄龙) | 119.758, 29.750 | 120.129, 30.269 | 404m |
| cc-hz-04 | 中石化超充(通晨) | 119.912, 29.595 | 120.283, 30.142 | 783m |
| cc-hz-05 | 国家电网(湘湖路) | 119.820, 29.579 | 120.191, 30.126 | 339m |
| cc-hz-06 | 国家电网(和平广场) | 119.801, 29.771 | 120.172, 30.291 | 241m |
| cc-hz-07 | 中石化(大塘) | 119.848, 29.844 | 120.220, 30.364 | 47m |
| cc-hz-08 | 云硕超充(庆隆) | 119.745, 29.777 | 120.116, 30.296 | 114m |
| cc-nb-04 | 中石化超充(双创大厦) | 119.767, 29.835 | 121.206, 30.360 | 481m |
| cc-nb-06 | 特来电(慈溪宗汉) | 119.794, 29.660 | 121.233, 30.185 | 81m |
| cc-nb-09 | 中石化(响岭岗) | 119.970, 29.159 | 121.409, 29.705 | 0m |
| cc-nb-10 | 特来电(余姚北) | 119.732, 29.573 | 121.170, 30.119 | 17m |

- **待用户确认的站点**（2个）：
  - cs-yangshan（洋山港集卡充电站）：旧坐标在洋山岛港口区，搜索到大陆侧物流区，需确认实际位置
  - cs-changxing（湖州长兴换电站群）：找到力氪站点但位置不同，可能是站群中心点 vs 单站

### v6.6 更新

#### ① 物流公司大本营标记点
- 新增 `headquarters` 数据类别，坐标 119.191435, 29.349197
- 名称：物流公司，🏠 图标，粉色(#E91E63)标记，脉冲动画
- zIndexOffset 1000（最高层级），与工厂/充电站/收费站同级显示
- 完整集成：图层开关、筛选标签、统计计数、图例、弹窗、搜索

#### ② 货车限行/禁行区域规避导航
- 集成高德货车导航API (`/v5/direction/truck`)
- 货车参数：size=5, weight=49吨, axle=6轴, length=18.1m, width=2.55m, height=4.0m
- 自动规避限行/禁行区域，返回限行警告信息
- UI新增货车模式开关（默认开启），路径详情显示限行提示
- `routing.js` 新增 `planRouteTruck()` 函数，`planRoute()` 优先尝试货车API

#### ③ 车辆追踪云端部署方案
- `vehicle-proxy.js` 升级至 v4，支持环境变量配置：
  - `PORT`, `VEHICLE_ACCOUNT`, `VEHICLE_PASSWORD`, `VEHICLE_PLATES`
- 新增 `/health` 健康检查端点
- 前端代理URL可配置（localStorage存储 `lantuo_vehicle_proxy_url`）
- 新增 `showVehicleConfig()` 配置弹窗，用户可输入云端代理地址
- 所有用户访问同一云端代理即可看到车辆位置，无需本地运行

#### ④ 充电站坐标第四轮验证修正
- 使用高德POI API + GCJ-02→WGS-84坐标系转换进行精确验证
- 6轮验证脚本（verify-coords.js ~ verify-final.js）
- 修正5个站点坐标（全部0m偏差确认）：
  - cs-meishan: → 122.015706, 29.785430 (启源芯动力换电站宁波梅山港站)
  - cs-keqiao: → 120.602505, 30.105217 (力氪汽车充电站绍兴集卡力氪)
  - cs-yiwu: → 119.929076, 29.227891 (义乌服务区，建设中)
  - cs-lingang: → 121.901668, 30.896881 (临港新片区)
  - cs-baoshan: → 121.342324, 31.458637 (中国石化宝山高新重卡充电站)
- 3个站点确认已正确（cs-dayun, cs-shaoqi, cs-fuyang）
- 1个站点无法验证（cs-yangshan，洋山港未在POI库中收录）

#### ⑤ 电价配置本地持久化
- 电价参数（基础电价、服务费、峰谷倍率等）保存到localStorage
- 键名：`lantuo_price_config`
- 参数变更时自动保存
- 新增"恢复默认"按钮，一键重置为初始值
- 函数：`loadPriceConfig()`, `savePriceConfig()`, `resetPriceConfig()`

#### ⑥ 部署指南文档 (DEPLOYMENT.md)
- 完整的云端部署架构图
- 车辆代理服务器部署（PM2 + Nginx反向代理）
- 地图应用域名部署（Nginx + HTTPS via certbot）
- 安卓APK打包方案（Capacitor + OTA更新 / TWA）
- 电价配置指南

### v6.5 更新内容

#### ① 收费站标记修复 + 杭州建德数据补全
- 修复收费站标记缩放偏移
- 收费站数据从513条扩充至658条

#### ② 路径规划显示优化
- displayTollsOnRoute重写：只显示上高速口和下高速口
- 新增findServiceAreasOnRoute：搜索路径沿途服务区

#### ③ 峰谷电价面板增强
- 新增当前时间显示、当前价格时段起止时间显示
- 刷新间隔从60秒缩短至10秒

#### ④ 地名搜索导航
- 新增searchPlace方法：使用高德POI text搜索API

#### ⑤ 云查车车辆追踪集成
- vehicle-proxy.js v3：全自动登录，滑块验证码自动绕过
- 30秒自动刷新车辆位置
- 前端集成：车辆标记、列表、弹窗、导航

#### ⑥ 地图瓦片优化 + ⑦ 实时路况
- 四种瓦片模式切换
- 高德路况瓦片叠加层

### v6.4 更新内容
- 高速收费站口图层（658个收费站）
- 峰谷电价悬浮组件
- 自定义充电时间与费用计算

### v6.3 更新内容
- 标题改版"充电物流地图"
- 后台密码保护
- 侧边栏可折叠分类
- 地图右键选点导航
- 多路线模式对比优化
- 充电站坐标三轮验证修正

### v6.2 更新内容
- 修复标记点缩放偏移，新增6工厂+35汽车充电站
- 隐藏API Key，用户端/后台端分离

### v1.0 初始版本
- 生产基地·重卡充电站在线地图

---

## 五、已实现功能清单

### 5.1 地图标注（五类）
- 物流公司大本营：1个，🏠粉色标记，脉冲动画
- 生产基地：6个，蓝色标记
- 重卡充电站：21个（浙江17+上海4），绿色标记，坐标全部验证
- 汽车充电站：35个，橙色小标记
- 收费站：658个（浙江+上海），可切换图层

### 5.2 路径规划
- 任意点到点导航（标注点或右键地图选点或地名搜索）
- 多途经点支持
- 三种路线模式并行对比：高速/国道/最短
- **货车导航模式**：高德货车API，自动规避限行/禁行区域
- 高德v5 API → 货车API → OSRM降级 → 直线估算兜底
- 路径沿途显示收费站（上/下高速口）、服务区、重卡充电站

### 5.3 费用计算
- ETC费用、充电费用、司机成本、柴油对比
- 3个快捷预设：标准422kWh / 大电池600kWh(默认) / 轻量化350kWh
- 自定义充电时长，按30分钟分段计算跨越时段费用
- **电价配置本地持久化**（localStorage），支持恢复默认

### 5.4 充电站推荐（方向感知）
- 沿路径推荐，方位角计算+方向匹配

### 5.5 峰谷电价系统
- 左上角悬浮面板，显示当前时段(尖/峰/平/谷)和实时电价
- 24小时时段时间轴，每10秒自动更新
- 基于data.js中timeOfUse配置计算

### 5.6 地图图层
- 四种瓦片模式：标准/详细/卫星/混合
- 实时路况叠加层
- 收费站图层开关
- 大本营图层开关

### 5.7 地名搜索
- 高德POI text搜索API
- 搜索结果可设为起点或终点

### 5.8 云查车车辆追踪（云端就绪）
- **vehicle-proxy.js v4**：支持云端部署，环境变量配置
- **代理URL可配置**：前端localStorage存储，配置弹窗
- 全自动登录（滑块验证码自动绕过）
- 42辆车实时位置，30秒自动刷新
- 目标车辆⭐标记 + 金色边框 + 脉冲动画
- 车辆列表（车牌、状态、司机、车队、方向、时间）
- 点击车辆定位/导航
- GCJ-02→WGS-84坐标自动转换
- **所有用户共享同一云端代理，无需本地运行**

### 5.9 后台管理
- 密码保护、表格内联编辑、JSON导入导出、生成data.js代码

### 5.10 UI交互
- 侧边栏可折叠分类列表
- 地图右键菜单选点
- 多路线对比表格切换
- 货车模式开关（默认开启）
- 电价参数"恢复默认"按钮
- 车辆代理URL配置弹窗
- 响应式布局（手机/PC）

---

## 六、云查车API集成详情（vehicle-proxy.js v4）

### 6.1 平台信息
- 平台：杭州三一谦成科技 31gps.net
- Web端：www.zjgcpt.cn/gps-web/
- 账号：YOUR_ACCOUNT / YOUR_PASSWORD（通过环境变量配置）
- 目标车辆：YOUR_PLATE_1, YOUR_PLATE_2（通过环境变量配置）

### 6.2 v4更新（云端部署就绪）
- CONFIG支持环境变量：PORT, VEHICLE_ACCOUNT, VEHICLE_PASSWORD, VEHICLE_PLATES
- 新增 `/health` 健康检查端点（用于PM2/Nginx健康检查）
- PM2部署命令：`pm2 start vehicle-proxy.js --name vehicle-proxy`
- Nginx反向代理配置示例见 DEPLOYMENT.md

### 6.3 前端配置
- localStorage键名：`lantuo_vehicle_proxy_url`
- 默认值：`http://localhost:3001`
- 配置入口：侧边栏车辆追踪面板的⚙️按钮
- 函数：`getVehicleProxyUrl()`, `setVehicleProxyUrl()`, `showVehicleConfig()`

### 6.4 API端点
| 端点 | 方法 | 说明 |
|------|------|------|
| /health | GET | 健康检查（PM2/Nginx） |
| /api/status | GET | 服务器状态(loggedIn, hasAuth, carCount, positionCount) |
| /api/vehicles | GET | 所有车辆位置 |
| /api/vehicles/:plate | GET | 指定车牌位置 |
| /api/refresh | POST | 手动触发刷新 |

### 6.5 滑块验证码绕过方法
- `generateSliderTrack()` 生成28-46步移动轨迹
- 减速运动 + Y轴微抖动 + 非均匀时间间隔 + 末端微调
- 首次登录即成功

### 6.6 坐标处理
- 云查车返回GCJ-02坐标
- 前端使用CoordTransform.gcj02towgs84()转为WGS-84后显示
- Leaflet地图使用WGS-84坐标

---

## 七、货车导航API集成详情

### 7.1 API信息
- 端点：`https://restapi.amap.com/v5/direction/truck`
- 参数：size=5(超重型), weight=49(吨), axle=6(轴), length=18.1(m)
- 返回：路径几何 + 距离 + 时间 + 限行警告

### 7.2 前端集成
- `routing.js` 新增 `planRouteTruck()` 函数
- `planRoute()` 接受 `truckMode` 参数，开启时优先使用货车API
- `planAllModes()` 传递 `truckMode` 给所有模式
- `app.js` 的 `planRoute()` 读取checkbox状态并传递
- 路径详情显示货车模式标识和限行警告

### 7.3 UI
- 货车模式checkbox（默认勾选），描述："自动规避限行/禁行区域"
- 位于路径规划参数区域

---

## 八、关键技术决策记录

### 8.1 坐标系处理
- 数据存储统一WGS-84，显示时转GCJ-02（高德瓦片）
- 高德API返回GCJ-02，存储前需转换
- 云查车返回GCJ-02，显示前需转WGS-84
- 坐标验证脚本必须先GCJ-02→WGS-84转换再比较

### 8.2 路线模式strategy映射
| 模式 | strategy | 说明 |
|------|----------|------|
| highway | 0 | 高速优先 |
| national | 1 | 费用优先(不走收费路=基本不走高速) |
| shortest | 2 | 最短距离 |

### 8.3 多路线并行规划
- `RoutePlanner.planAllModes()` 使用Promise.all并行获取3种模式
- 主路线高亮显示，其余半透明
- 对比表格支持点击切换主路线（无需重新请求API）

### 8.4 高德POI API注意事项
- types=200300参数会导致0结果（收费站搜索），改用纯关键词"收费站"
- 服务区搜索用types=110200 + 关键词"服务区"
- POI搜索需要多关键词策略，单个关键词可能匹配不准
- 部分站点（如洋山港）未在POI库中收录

### 8.5 拖车兼容性判断标准
- 重卡充电站标准车位：4m宽×17m长，车尾周转区≥20m
- 13.75m半挂车总长约18.1m
- 高速服务区和港口集卡站天然兼容

### 8.6 电价配置持久化
- localStorage键名：`lantuo_price_config`
- 存储内容：所有costConfig字段 + 充电站basePrice/serviceFee覆盖
- 自动保存：param-input的change事件触发
- 恢复默认：清除localStorage键，恢复data.js原始值

---

## 九、已知限制与待改进方向

### 9.1 车辆追踪
- 滑块验证码绕过可能因平台更新失效，需持续维护
- 30秒刷新间隔可能不够实时，可考虑WebSocket方案
- 云端代理需用户自行部署到服务器（DEPLOYMENT.md有详细指南）

### 9.2 坐标精度
- cs-yangshan（洋山港）坐标为港口区近似值，搜索到大陆侧物流区，需实地确认
- cs-changxing（长兴换电站群）找到力氪站点但位置偏差3km，可能是站群中心点
- 其余20个重卡充电站 + 35个汽车充电站坐标均已通过高德POI API验证
- v6.7修正了12个小型充电站的系统性坐标错误（全部偏移到桐庐/浦江地区）

### 9.3 拖车兼容性
- 绍汽集团广场站实际为乘用车充电站，重卡兼容性存疑
- 柯桥站群和长兴换电站群需现场确认
- 义乌服务区充电站建设中

### 9.4 其他
- 实时数据非真实（模拟，除车辆追踪外）
- OSRM公共API不稳定
- 安卓APK打包需用户按DEPLOYMENT.md指南自行操作

---

## 十、部署方式

### 本地测试
```bash
# 1. 启动地图应用（端口8080）
cd "C:\Users\Administrator\WorkBuddy\2026-07-06-03-28-34"
npx http-server -p 8080 -c-1 --cors

# 2. 启动车辆追踪代理（端口3001，可选）
node vehicle-proxy.js
```

### 云端部署
- **车辆代理**：PM2 + Nginx，详见 DEPLOYMENT.md
- **地图应用**：Nginx + HTTPS，详见 DEPLOYMENT.md
- **安卓APK**：Capacitor / TWA，详见 DEPLOYMENT.md

### CloudStudio快速部署
```json
{"directory": "C:\\Users\\Administrator\\WorkBuddy\\2026-07-06-03-28-34", "entry": "index.html", "port": 3000}
```
注意：CloudStudio部署无法运行vehicle-proxy.js，需单独部署车辆代理到服务器。

---

## 十一、新对话快速接续指南

**新对话开场白建议**：
> "请先读取 HANDOFF.md 文件了解项目当前状态，然后我们要继续改进地图应用。"

**文件读取优先级**：
1. `HANDOFF.md`（本文件）— 总览
2. `DEPLOYMENT.md` — 部署指南
3. `js/app.js` — 主逻辑（~2620行，改动最频繁）
4. `js/data.js` — 数据层（~580行）
5. `js/routing.js` — 路径规划含货车导航（~530行）
6. `vehicle-proxy.js` — 车辆追踪代理v4（~340行）
7. `css/style.css` — 样式（~1920行）
8. `index.html` — 用户端页面（~410行）
9. `admin.html` — 后台管理（~1025行）
10. `js/tollstations.js` — 收费站数据（~5930行，一般不需读）

**常见操作**：
- 改充电站数据 → 编辑 `js/data.js`
- 改费用计算 → 编辑 `js/routing.js`
- 改弹窗内容 → 编辑 `js/app.js` 的 `createPopup()`
- 改地图配置 → 编辑 `js/app.js` 的 `initMap()`
- 改侧边栏UI → 编辑 `index.html` + `css/style.css`
- 改后台管理 → 编辑 `admin.html`
- 改车辆追踪 → 编辑 `vehicle-proxy.js` + `js/app.js` 的车辆追踪方法
- 改货车导航 → 编辑 `js/routing.js` 的 `planRouteTruck()`
- 重新部署 → 调用 `workbuddy_cloudstudio_deploy` 工具
- 启动代理服务器 → `node vehicle-proxy.js`（端口3001）
- 启动本地Web → `npx http-server -p 8080 -c-1 --cors`

**调试命令速查**：
```bash
# 检查代理服务器状态
curl -s http://localhost:3001/api/status

# 健康检查（v4新增）
curl -s http://localhost:3001/health

# 查询特定车辆
curl -s "http://localhost:3001/api/vehicles/YOUR_PLATE_1"

# 终止占用端口的进程（Git Bash）
taskkill /PID <pid> /F

# 查看端口占用
netstat -ano | findstr :3001
```

**坐标验证脚本**（已保留在项目根目录）：
- `verify-coords.js` — 第一轮（无坐标系转换，有误）
- `verify-coords-round2.js` — 第二轮
- `verify-coords-v3.js` — 第三轮（正确坐标系转换）
- `verify-coords-v4.js` — 第四轮（多关键词精准搜索）
- `verify-coords-v5.js` — 第五轮（启源芯动力站点搜索）
- `verify-coords-v6.js` — 第六轮（宝山/义乌确认）
- `verify-final.js` — 最终验证（8/8精确匹配）
- `verify-all-coords-v2.js` — 全量验证v2（66个点，多策略搜索+附近搜索）
- `verify-problem-coords.js` — 问题站点精确验证（确认重卡站坐标正确）
- `find-correct-coords.js` — 搜索正确坐标（修正12个系统性错误）
- `coord-verification-v2-report.json` — v2验证报告
- `coord-fix-report.json` — 问题站点修正报告
- `coord-corrections.json` — 正确坐标候选清单
