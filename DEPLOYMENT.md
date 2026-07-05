# 充电物流地图 - 部署指南

## 一、车辆追踪代理云端部署

### 方案A：云服务器部署（推荐）

#### 1. 准备服务器
- 购买云服务器（腾讯云/阿里云轻量应用服务器，2核2G即可）
- 安装 Node.js 22+ 和 PM2

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2
```

#### 2. 部署代理服务
```bash
# 上传 vehicle-proxy.js 到服务器
scp vehicle-proxy.js user@your-server:/opt/vehicle-proxy/

# 启动服务（PM2守护）
cd /opt/vehicle-proxy
pm2 start vehicle-proxy.js --name vehicle-proxy
pm2 save
pm2 startup  # 开机自启
```

#### 3. 配置 Nginx 反向代理 + HTTPS
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 车辆追踪代理
    location /vehicle-api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 地图应用静态文件
    location / {
        root /opt/map-app;
        try_files $uri $uri/ /index.html;
    }
}
```

#### 4. 前端配置
在地图应用中，点击车辆追踪区域的"配置"链接，输入：
```
https://your-domain.com/vehicle-api
```

### 方案B：Serverless 部署（腾讯云函数）

1. 在腾讯云 SCF 创建函数
2. 上传 vehicle-proxy.js
3. 设置触发器为 API 网关
4. 配置环境变量（VEHICLE_ACCOUNT, VEHICLE_PASSWORD, VEHICLE_PLATES）

---

## 二、地图应用部署到自有域名

### 1. 部署到云服务器
```bash
# 上传所有静态文件
scp -r . user@your-server:/opt/map-app/

# Nginx 配置
server {
    listen 80;
    server_name your-domain.com;
    root /opt/map-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. 配置 HTTPS（免费证书）
```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. DNS 配置
在域名服务商处添加 A 记录：
```
类型: A
主机: @ (或 www)
值:   服务器公网IP
```

---

## 三、Android APK 打包方案

### 方案A：Capacitor（推荐，支持推送更新）

```bash
# 1. 安装 Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init 充电物流地图 com.example.map --web-dir=.

# 2. 添加 Android 平台
npm install @capacitor/android
npx cap add android

# 3. 同步 Web 资源
npx cap sync

# 4. 构建 APK
cd android
./gradlew assembleDebug
# APK 位置: android/app/build/outputs/apk/debug/app-debug.apk
```

### OTA 更新方案
- 使用 Capacitor 自带的 Live Reload 或第三方插件
- 配置远程服务器地址，App 启动时检查更新
- 详见: https://capacitorjs.com/docs/guides/live-reload

### 方案B：TWA（Trusted Web Activity，最轻量）
- 需要 PWA manifest
- 使用 Bubblewrap CLI 打包
- 直接包装网页为 APK，无需 WebView

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-domain.com/manifest.json
bubblewrap build
```

---

## 四、电价数据实时配置

### 后台管理入口
访问 `admin.html`，在"电价管理"模块中可配置：
- 峰/平/谷/尖峰各时段电价
- 时段划分
- 充电服务费

### 外部数据源对接（可选）
如需对接电网官方电价 API：
1. 浙江省电网：http://www.zj.sgcc.com.cn/
2. 上海市电网：http://www.sh.sgcc.com.cn/
3. 可编写定时爬虫获取最新电价，存入配置文件

---

## 五、完整部署架构

```
用户浏览器/App
    │
    ├── HTTPS ──→ Nginx (your-domain.com:443)
    │               ├── / → 静态文件 (index.html, js/, css/)
    │               └── /vehicle-api/ → Node.js 代理 (localhost:3001)
    │                                    └──→ 云查车 API (www.zjgcpt.cn)
    │
    └── 高德 API ──→ restapi.amap.com (导航/POI/路况)
```
