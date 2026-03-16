# AI Agent 项目阿里云部署指南

## 📋 部署概述

本文档指导如何将 ai-agent-web（前端）和 ai-agent-server（后端）部署到阿里云 ECS 服务器。

### 项目架构

```
用户访问
    ↓
阿里云 ECS (公网 IP)
    ↓
Nginx (80 端口)
    ├→ 前端静态文件 (React 应用)
    └→ /api/* → 后端服务 (3001 端口)
```

### 技术栈

- **前端**: React + Vite + TypeScript
- **后端**: Node.js + Express + TypeScript  
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx

---

## 🚀 快速部署步骤

### 第一步：准备阿里云 ECS 服务器

#### 1.1 登录 ECS 实例

```bash
ssh root@<your-ecs-public-ip>
```

#### 1.2 安装 Docker

```bash
# 使用阿里云镜像源安装 Docker
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 启动 Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
```

#### 1.3 安装 Docker Compose

```bash
# 下载 Docker Compose v2.20.0
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 赋予执行权限
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

#### 1.4 配置 Docker 镜像加速

```bash
# 创建配置目录
mkdir -p /etc/docker

# 配置镜像加速器（使用阿里云镜像）
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ]
}
EOF

# 重启 Docker
systemctl daemon-reload
systemctl restart docker

# 验证配置
docker info | grep-A 10 'Registry Mirrors'
```

#### 1.5 配置安全组（重要！）

在阿里云 ECS 控制台操作：

1. 进入 ECS 实例详情页
2. 点击"安全组"标签
3. 点击"配置规则"
4. 添加入站规则：
   - **端口范围**: 80/80
   - **授权对象**: 0.0.0.0/0
   - **优先级**: 1
   - **策略**: 允许

---

### 第二步：本地配置

#### 2.1 修改前端 API 地址

已修改 `.env` 文件：

```env
VITE_API_URL=/api
```

这样前端会通过 Nginx 代理访问后端，无需硬编码 IP 地址。

#### 2.2 检查配置文件

确保以下文件配置正确：

- `docker-compose.yml` - 容器编排配置
- `nginx.conf` - Nginx 反向代理配置
- `deploy-direct.sh` - 自动化部署脚本

---

### 第三步：执行部署

#### 方式 A：使用自动化脚本（推荐）

##### 3.1 配置部署脚本

编辑 `deploy-direct.sh`，修改以下变量：

```bash
ECS_IP="你的 ECS 公网 IP"        # 例如："123.45.67.89"
ECS_USER="root"                  # 默认用户
REMOTE_DIR="/opt/ai-agent"       # 部署目录
```

或者通过环境变量设置：

```bash
export ECS_IP="123.45.67.89"
export ECS_USER="root"
export REMOTE_DIR="/opt/ai-agent"
```

##### 3.2 执行部署

```bash
# 赋予脚本执行权限
chmod +x deploy-direct.sh

# 执行一键部署
./deploy-direct.sh
```

脚本会自动完成：
1. 上传项目文件到 ECS
2. 在 ECS 上构建 Docker 镜像
3. 启动所有服务
4. 显示部署状态和日志

#### 方式 B：手动部署

##### 3.3 上传项目文件

```bash
# 创建远程目录
ssh root@<your-ecs-ip> "mkdir -p /opt/ai-agent"

# 上传所有项目文件
scp -r ai-agent-web root@<your-ecs-ip>:/opt/ai-agent/
scp -r ai-agent-server root@<your-ecs-ip>:/opt/ai-agent/
scp docker-compose.yml root@<your-ecs-ip>:/opt/ai-agent/
scp -r nginx root@<your-ecs-ip>:/opt/ai-agent/
```

##### 3.4 SSH 登录并构建

```bash
ssh root@<your-ecs-ip>
cd /opt/ai-agent

# 停止旧容器（如果有）
docker-compose down

# 构建所有镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f
```

---

### 第四步：验证部署

#### 4.1 检查容器状态

```bash
docker-compose ps
```

应该看到类似输出：

```
NAME                    STATUS         PORTS
ai-frontend             Up 10 seconds  80/tcp
ai-backend              Up 10 seconds  3001/tcp
nginx-proxy             Up 10 seconds  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

#### 4.2 测试访问

**浏览器访问：**
- 前端页面：`http://<your-ecs-ip>`
- API 健康检查：`http://<your-ecs-ip>/api/health`

**或使用 curl 测试：**

```bash
# 测试前端
curl http://<your-ecs-ip>

# 测试后端 API
curl http://<your-ecs-ip>/api/agent/tools
```

#### 4.3 查看服务日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看前端日志
docker-compose logs frontend

# 查看后端日志
docker-compose logs backend

# 查看 Nginx 日志
docker-compose logs nginx
```

---

## 🔄 更新部署

### 方式一：自动更新

再次运行部署脚本：

```bash
./deploy-direct.sh
```

脚本会自动：
1. 停止旧容器
2. 上传新代码
3. 重新构建镜像
4. 启动新服务

### 方式二：手动更新

```bash
# SSH 登录 ECS
ssh root@<your-ecs-ip>
cd /opt/ai-agent

# 重新构建并启动
docker-compose up -d --build

# 清理未使用的镜像
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

## ⚙️ 配置说明

### 前端配置

**环境变量文件**: `.env`

```env
VITE_API_URL=/api
```

这个配置让前端通过 Nginx 代理访问后端，而不是直接连接。

### Nginx 配置

**配置文件**: `nginx.conf`

关键配置：

```nginx
# API 代理到后端容器
location /api/ {
    proxy_pass http://backend:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # 超时配置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

### Docker Compose 配置

**配置文件**: `docker-compose.yml`

服务说明：
- `ai-frontend`: 前端 React 应用（80 端口）
- `ai-backend`: 后端 Node.js API（3001 端口）
- `nginx-proxy`: 反向代理（暴露 80/443 端口）

---

## 🔒 安全加固建议

### 1. 配置防火墙

```bash
# 安装 firewalld
yum install firewalld -y

# 启动防火墙
systemctl start firewalld
systemctl enable firewalld

# 开放必要端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=22/tcp

# 重载配置
firewall-cmd --reload
```

### 2. 禁用 root SSH 登录（可选）

```bash
# 创建新用户
adduser deployer
passwd deployer

# 赋予 sudo 权限
usermod -aG wheel deployer

# 禁用 root SSH 登录
vim /etc/ssh/sshd_config
# 修改：PermitRootLogin no

# 重启 SSH
systemctl restart sshd
```

### 3. 配置日志轮转

创建 `/etc/docker/daemon.json`：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

重启 Docker：

```bash
systemctl restart docker
```

---

## ⚠️ 常见问题

### Q1: 构建速度慢

**解决方案：**
- 配置 Docker 镜像加速（见上文）
- 首次构建较慢，后续会使用缓存

### Q2: 容器无法启动

**排查步骤：**
```bash
# 查看详细错误
docker-compose logs

# 检查端口占用
netstat -tulpn

# 检查磁盘空间
df -h

# 重新构建
docker-compose up -d --build --force-recreate
```

### Q3: 访问被拒绝或 404

**解决方法：**
```bash
# 1. 检查安全组配置（阿里云控制台）

# 2. 检查防火墙
systemctl status firewalld

# 3. 检查 Nginx 配置
docker-compose logs nginx

# 4. 测试后端是否可访问
curl http://localhost:3001/api/health
```

### Q4: 前端页面空白或 API 请求失败

**排查步骤：**
```bash
# 1. 打开浏览器控制台，查看错误信息

# 2. 确认 API 地址配置正确
# 检查 .env 文件：VITE_API_URL=/api

# 3. 检查 Nginx 是否正确代理
docker-compose logs nginx

# 4. 检查后端服务状态
docker-compose ps
docker-compose logs backend
```

### Q5: 内存不足

**解决方案：**
```bash
# 清理未使用的容器
docker container prune

# 清理未使用的镜像
docker image prune -a

# 增加 ECS 内存或优化容器资源配置
```

---

## 📊 部署检查清单

- [ ] ECS 实例已创建并配置安全组
- [ ] Docker 已安装并运行
- [ ] Docker Compose 已安装
- [ ] 本地 `.env` 文件已修改（VITE_API_URL=/api）
- [ ] `deploy-direct.sh` 已配置 ECS IP
- [ ] 项目文件已上传到 ECS
- [ ] 容器已成功启动
- [ ] 可以通过 IP 访问前端
- [ ] API 接口正常响应
- [ ] 日志监控已配置

---

## 📞 获取帮助

### 查看系统日志

```bash
# Docker 日志
journalctl -u docker -f

# 系统日志
tail -f /var/log/messages
```

### 监控资源

```bash
# CPU 和内存
top

# 磁盘使用
df -h

# 网络流量
iftop
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

访问地址：http://<your-ecs-ip>
```

---

## 🚀 一键部署

```bash
# 配置 ECS IP
export ECS_IP="你的 ECS 公网 IP"

# 执行一键部署
./deploy-direct.sh
```

**开始部署吧！** 🎊
