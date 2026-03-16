# 🎯 阿里云部署完整指南

## 📋 项目说明

本项目包含两个部分：
- **ai-agent-web**: React + Vite 前端应用
- **ai-agent-server**: Node.js + Express 后端 API 服务

通过 Docker Compose 和 Nginx 实现容器化部署和反向代理。

---

## 🚀 快速开始（3 步部署）

### 第 1 步：准备阿里云 ECS

```bash
# SSH 登录到 ECS
ssh root@你的 ECS-IP

# 安装 Docker（如果是新系统）
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 配置 Docker 镜像加速
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker
```

**重要**: 在阿里云控制台开放安全组 80 端口！

### 第 2 步：配置本地部署脚本

```bash
# 方式 A: 使用配置工具（推荐）
chmod +x configure-deploy.sh
./configure-deploy.sh

# 方式 B: 手动编辑
vim deploy-direct.sh
# 修改：ECS_IP="你的 ECS-IP"
```

### 第 3 步：执行一键部署

```bash
./deploy-direct.sh
```

等待 5-8 分钟，看到以下输出表示成功：

```
✅ 前端镜像构建成功
✅ 后端镜像构建成功
✅ 服务启动成功

NAME                    STATUS         PORTS
ai-frontend             Up            80/tcp
ai-backend              Up           3001/tcp
nginx-proxy             Up             0.0.0.0:80->80/tcp

访问地址：http://你的 ECS-IP
```

---

## ✅ 验证部署

### 检查服务状态

```bash
# SSH 登录 ECS
ssh root@你的 ECS-IP

# 查看容器状态
cd /opt/ai-agent
docker-compose ps

# 查看实时日志
docker-compose logs -f
```

### 访问测试

打开浏览器：
- **前端页面**: http://你的 ECS-IP
- **API 测试**: http://你的 ECS-IP/api/agent/tools

---

## 📁 项目文件结构

```
project-root/
├── ai-agent-web/              # 前端项目
│   ├── src/                   # 源代码
│   ├── public/                # 静态资源
│   ├── Dockerfile             # Docker 构建文件
│   ├── .env                   # 环境变量（VITE_API_URL=/api）
│   └── package.json           # 依赖配置
│
├── ai-agent-server/           # 后端项目
│   ├── src/                   # 源代码
│   ├── Dockerfile             # Docker 构建文件
│   └── package.json           # 依赖配置
│
├── nginx/                     # Nginx 配置
│   ├── nginx.conf             # 主配置文件
│   └── conf.d/
│       └── app.conf           # 应用配置
│
├── docker-compose.yml         # Docker 编排配置
├── deploy-direct.sh           # 自动化部署脚本
├── configure-deploy.sh        # 配置工具脚本
│
└── README_DEPLOYMENT.md      # 本文件
```

---

## 🔧 配置文件详解

### 1. 前端环境变量 (.env)

```env
VITE_API_URL=/api
```

**说明**: 使用相对路径，通过 Nginx 代理访问后端

### 2. Docker Compose (docker-compose.yml)

```yaml
version: '3.8'

services:
  frontend:
   build:
    context: ./ai-agent-web
   container_name: ai-frontend
  networks:
      - app-network
  
  backend:
   build:
    context: ./ai-agent-server
   container_name: ai-backend
    environment:
      - PORT=3001
  networks:
      - app-network
  
  nginx:
   image: nginx:alpine
  container_name: nginx-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
  networks:
      - app-network

networks:
  app-network:
   driver: bridge
```

### 3. Nginx 配置 (nginx.conf)

```nginx
server {
  listen 80;
    server_name localhost;
    
  root /usr/share/nginx/html;
  index index.html;

    # Gzip 压缩
  gzip on;
  gzip_types text/plain application/json application/javascript;

    # 前端静态文件
   location / {
       try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store, no-cache";
    }

    # API 代理到后端
   location /api/ {
       proxy_pass http://backend:3001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 超时配置（SSE 需要）
       proxy_connect_timeout 60s;
       proxy_send_timeout 60s;
       proxy_read_timeout 60s;
        
        # 禁用缓冲
       proxy_buffering off;
    }
}
```

---

## 🔄 更新部署

### 自动更新

```bash
./deploy-direct.sh
```

### 手动更新

```bash
ssh root@你的 ECS-IP
cd /opt/ai-agent

# 重新构建并启动
docker-compose up -d --build

# 清理旧镜像
docker image prune -f
```

---

## 🛠️ 运维命令

### 常用操作

```bash
# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d

# 查看实时日志
docker-compose logs -f

# 进入容器
docker exec -it ai-frontend sh
docker exec -it ai-backend sh

# 查看资源使用
docker stats

# 清理未使用的镜像
docker image prune -a
```

### 故障排查

```bash
# 1. 检查容器状态
docker-compose ps

# 2. 查看详细错误
docker-compose logs

# 3. 检查端口占用
netstat -tulpn | grep :80

# 4. 检查磁盘空间
df -h

# 5. 检查 Docker 状态
systemctl status docker
```

---

## ⚠️ 常见问题

### Q1: 无法访问网页（连接被拒绝）

**解决**:
1. 检查阿里云安全组是否开放 80 端口
2. 检查防火墙状态：`systemctl status firewalld`
3. 确认容器运行正常：`docker-compose ps`

### Q2: 前端空白或报错

**解决**:
1. 打开浏览器控制台查看错误
2. 确认 `.env` 配置正确：`VITE_API_URL=/api`
3. 重新构建前端：`docker-compose build frontend`

### Q3: API 请求失败（CORS 错误）

**解决**:
1. 检查前端是否通过 Nginx 访问（不是直接访问后端）
2. 查看 Nginx 日志：`docker-compose logs nginx`
3. 确认代理配置正确

### Q4: 构建速度慢

**解决**:
- 首次构建较慢是正常的
- 后续构建会使用缓存
- 确保配置了 Docker 镜像加速

### Q5: 内存不足

**解决**:
```bash
# 清理未使用的容器
docker container prune -f

# 清理未使用的镜像
docker image prune -a

# 查看资源使用
docker stats
```

---

## 📊 部署检查清单

### 部署前

- [ ] ECS 实例已创建（建议 2 核 2G 以上）
- [ ] Docker 已安装并运行
- [ ] Docker Compose 已安装
- [ ] 阿里云安全组已开放 80 端口
- [ ] 本地可以 SSH 登录 ECS
- [ ] `.env` 文件已修改（`VITE_API_URL=/api`）

### 部署后

- [ ] 所有容器正常运行
- [ ] 可以通过 IP 访问前端
- [ ] API 接口正常响应
- [ ] 无 CORS 错误
- [ ] SSE 流式传输正常

---

## 🔒 安全建议

### 1. 配置防火墙

```bash
yum install firewalld -y
systemctl start firewalld
systemctl enable firewalld

firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --reload
```

### 2. 禁用 root SSH 登录（可选）

```bash
adduser deployer
passwd deployer
usermod -aG wheel deployer

vim /etc/ssh/sshd_config
# 修改：PermitRootLogin no

systemctl restart sshd
```

### 3. 配置日志轮转

```bash
vim /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
systemctl restart docker
```

---

## 📖 详细文档

- **快速部署**: [README_QUICK_DEPLOY.md](./README_QUICK_DEPLOY.md)
- **完整指南**: [ALIYUN_DEPLOYMENT.md](./ALIYUN_DEPLOYMENT.md)
- **API 配置**: [API_CONFIG.md](./API_CONFIG.md)
- **无 Harbor 部署**: [DEPLOY_WITHOUT_HARBOR.md](./DEPLOY_WITHOUT_HARBOR.md)

---

## 🆘 获取帮助

### 查看日志

```bash
# 所有服务日志
docker-compose logs -f

# 特定服务日志
docker-compose logs frontend
docker-compose logs backend
docker-compose logs nginx

# Nginx 访问日志
docker exec -it nginx-proxy tail -f /var/log/nginx/access.log

# Nginx 错误日志
docker exec -it nginx-proxy tail -f /var/log/nginx/error.log
```

### 监控资源

```bash
# CPU 和内存
top
htop

# 磁盘使用
df -h

# 网络流量
iftop

# 容器资源使用
docker stats
```

---

## 🎉 部署成功标志

当您看到以下内容时，表示部署成功：

```
✅ 前端镜像构建成功
✅ 后端镜像构建成功
✅ 服务启动成功

NAME                    STATUS         PORTS
ai-frontend             Up 10 seconds  80/tcp
ai-backend              Up 10 seconds  3001/tcp
nginx-proxy             Up 10 seconds  0.0.0.0:80->80/tcp

访问地址：http://你的 ECS-IP
API 地址：http://你的 ECS-IP/api
```

---

## 🚀 立即开始

```bash
# 配置并部署
export ECS_IP="你的 ECS-IP"
./deploy-direct.sh
```

**祝您部署成功！** 🎊
