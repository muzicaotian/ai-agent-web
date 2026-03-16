# 🚀 部署准备完成！

## ✅ 已创建的文件

### Docker 配置文件

1. **ai-agent-web/Dockerfile** - 前端 Docker 镜像配置
2. **ai-agent-server/Dockerfile** - 后端 Docker 镜像配置（多阶段构建）
3. **docker-compose.yml** - Docker Compose 编排配置
4. **ai-agent-web/.dockerignore** - 前端 Docker 忽略文件
5. **ai-agent-server/.dockerignore** - 后端 Docker 忽略文件

### Nginx 配置文件

6. **nginx/nginx.conf** - Nginx 主配置文件
7. **nginx/conf.d/app.conf** - 应用级别 Nginx 配置（反向代理 + API 转发）

### 部署脚本

8. **deploy-to-harbor.sh** - Harbor 镜像推送脚本
9. **deploy.sh** - 完整自动化部署脚本
10. **test-local.sh** - 本地测试脚本

### 文档

11. **DEPLOYMENT.md** - 详细部署文档
12. **README_DEPLOY.md** - 本说明文档

---

## 📋 项目架构

```
┌─────────────────────────────────────┐
│         User(Port 80/443)          │
└──────────────┬──────────────────────┘
               │
        ┌──────▼───────┐
        │    Nginx     │
        │  (反向代理)   │
        └──┬───────┬───┘
           │       │
    ┌──────▼──┐ ┌─▼──────────┐
    │Frontend │ │ Backend    │
    │ React  │ │ Node.js    │
    │ Port 80 │ │ Port 3001  │
    └─────────┘ └────────────┘
```

---

## 🎯 下一步操作

### 方式一：本地测试（推荐先测试）

```bash
# 1. 进入项目目录
cd ai-agent-web

# 2. 赋予执行权限
chmod +x test-local.sh deploy-to-harbor.sh deploy.sh

# 3. 运行本地测试
./test-local.sh
```

访问 http://localhost 查看效果

### 方式二：推送到 Harbor

**前提条件：**
- 已安装 Docker Desktop
- 已有 Harbor 账号
- 已登录 Harbor

```bash
# 1. 编辑 deploy-to-harbor.sh，配置 Harbor 信息
# HARBOR_URL="harbor.your-domain.com"
# HARBOR_PROJECT="ecommerce"

# 2. 登录 Harbor
docker login harbor.your-domain.com

# 3. 推送镜像
./deploy-to-harbor.sh latest
```

### 方式三：部署到阿里云 ECS

**前提条件：**
- 已有阿里云 ECS 实例
- ECS 已安装 Docker 和 Docker Compose
- 已配置 SSH 免密登录或知道密码

**步骤：**

1. **配置 ECS 服务器**
```bash
# SSH 登录到您的 ECS
ssh root@your-ecs-ip

# 安装 Docker
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 启动 Docker
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 配置镜像加速
mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker
```

2. **配置安全组**
   
   在阿里云 ECS 控制台：
   - 开放端口 80 (HTTP)
   - 开放端口 443 (HTTPS，可选)

3. **编辑部署脚本**
   
   编辑 `deploy.sh`，修改以下变量：
```bash
HARBOR_URL="harbor.your-domain.com"  # 您的 Harbor 地址
ECS_USER="root"                       # ECS 用户名
ECS_IP="your-ecs-ip"                 # ECS 公网 IP
REMOTE_DIR="/opt/ecommerce"          # 部署目录
```

4. **执行部署**
```bash
chmod +x deploy.sh
./deploy.sh latest
```

5. **验证部署**
   
   浏览器访问：http://your-ecs-ip

---

## 🔧 配置文件说明

### 需要您修改的配置

#### 1. Harbor 配置（如使用）

在所有脚本中替换：
- `harbor.your-domain.com` → 您的 Harbor 域名
- `ecommerce` → 您的 Harbor 项目名称

#### 2. ECS 配置

在 `deploy.sh` 中替换：
- `your-ecs-ip` → 您的 ECS 公网 IP
- `/opt/ecommerce` → 希望的部署目录

#### 3. 域名配置（可选）

如果使用域名，在 `nginx/conf.d/app.conf` 中：
```nginx
server_name your-domain.com;  # 改为您的域名
```

---

## 📊 镜像信息

### 前端镜像
- **大小**: ~50MB (nginx:alpine)
- **端口**: 80
- **功能**: 
  - 静态文件服务
  - SPA 路由支持
  - API 反向代理

### 后端镜像
- **大小**: ~150MB
- **端口**: 3001
- **功能**:
  -Express API 服务
  - TypeScript 支持
  - PM2 进程管理

---

## 🎯 快速命令参考

### 本地开发
```bash
# 启动服务
docker-compose up

# 后台运行
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重建
docker-compose up --build
```

### 生产环境
```bash
# 部署
./deploy.sh latest

# 查看状态
docker-compose ps

# 重启
docker-compose restart

# 更新
docker-compose pull && docker-compose up -d
```

---

## ⚠️ 注意事项

1. **Windows 用户**
   - 需要使用 Git Bash 或 WSL 运行脚本
   - 或者手动执行命令

2. **Harbor 认证**
   - 确保已执行 `docker login`
   - 或者在脚本中添加认证信息

3. **ECS 安全组**
   - 必须开放 80/443 端口
   - 建议只开放必要端口

4. **环境变量**
   - 检查 `.env` 文件中的 API 地址
   - 生产环境使用 `.env.production`

---

## 🆘 故障排查

### 问题 1: 镜像构建失败
```bash
# 检查 Docker 是否运行
docker ps

# 清理缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

### 问题 2: 容器无法启动
```bash
# 查看详细日志
docker-compose logs

# 检查端口占用
netstat -tulpn | grep :80
```

### 问题 3: 无法访问 ECS
```bash
# 检查安全组
# 阿里云控制台 → ECS → 安全组配置

# 检查防火墙
ssh root@your-ecs-ip
systemctl status firewalld
```

---

## 📞 获取帮助

1. 查看完整文档：`DEPLOYMENT.md`
2. 查看 Docker 日志：`docker-compose logs -f`
3. 查看 Nginx 日志：`/var/log/nginx/error.log`

---

## ✨ 成功标志

当您看到以下内容时，表示部署成功：

```
✅ 前端镜像构建成功
✅ 后端镜像构建成功
✅ 镜像已推送到 Harbor
✅ 部署完成！

访问地址：http://your-ecs-ip
API 地址：http://your-ecs-ip/api
```

---

**准备好了吗？让我们开始部署吧！** 🚀

```bash
# 第一步：本地测试
./test-local.sh

# 第二步：推送到 Harbor（可选）
./deploy-to-harbor.sh latest

# 第三步：部署到 ECS
./deploy.sh latest
```
