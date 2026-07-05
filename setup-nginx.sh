#!/bin/bash
# Nginx 配置脚本 - 用于 map.ql1czz.top

echo "=== 1. 写入 Nginx 配置文件 ==="

cat > /tmp/map-app-nginx.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name map.ql1czz.top;

    root /opt/map-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ~* \.(js|css|json|png|jpg|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

sudo cp /tmp/map-app-nginx.conf /etc/nginx/sites-available/map-app
sudo chmod 644 /etc/nginx/sites-available/map-app

echo "=== 2. 启用配置 ==="
sudo ln -sf /etc/nginx/sites-available/map-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "=== 3. 测试 Nginx 配置 ==="
sudo nginx -t

echo "=== 4. 重载 Nginx ==="
sudo systemctl reload nginx

echo "=== 5. 验证反向代理 ==="
echo "测试 /api/status:"
curl -s --max-time 5 http://localhost/api/status

echo ""
echo "=== 完成 ==="
