# 🚀 阿里云快速部署指南

## ⚡ 5 分钟快速部署

### 方式一：使用配置工具（推荐新手）

```bash
# 1. 运行配置工具
chmod +x configure-deploy.sh
./configure-deploy.sh

# 2. 按提示输入 ECS IP 等信息

# 3. 确认后立即部署
```

### 方式二：手动配置

```bash
# 1. 编辑 deploy-direct.sh，修改以下变量：
vim deploy-direct.sh

# 修改：
ECS_IP="你的 ECS 公网 IP"        # 例如："47.100.123.45"
ECS_USER="root"                  # SSH 用户名
REMOTE_DIR="/opt/ai-agent"       # 部署目录

# 2. 执行部署
chmod +x deploy-direct.sh
./deploy-direct.sh
```

---

## 📋 部署前检查清单

### ✅ 本地准备

- [ ] 已安装 Git、SSH、SCP
- [ ] 可以 SSH 登录到阿里云 ECS
- [ ] 已修改 `.env` 文件：`VITE_API_URL=/api`

### ✅ 阿里云 ECS 准备

- [ ] ECS 实例已创建（建议 2 核 2G 以上）
- [ ] Docker 已安装
- [ ] Docker Compose 已安装
- [ ] **安全组已开放 80 端口**（重要！）

---

## 🔧 ECS 初始化命令（首次需要）

如果 ECS 是全新系统，先执行以下命令安装 Docker：

```bash
# SSH 登录 ECS
ssh root@你的 ECS-IP

# 安装 Docker
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
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker
```

---

## 🎯 一键部署

```bash
# 配置环境变量（可选）
export ECS_IP="你的 ECS-IP"
export ECS_USER="root"
export REMOTE_DIR="/opt/ai-agent"

# 执行部署
./deploy-direct.sh
```

部署过程：
1. ⏱️ 上传项目文件到 ECS（约 30 秒）
2. ⏱️ 构建前端镜像（约 2-3 分钟）
3. ⏱️ 构建后端镜像（约 1-2 分钟）
4. ⏱️ 启动所有服务（约 10 秒）

**总耗时：约 5-8 分钟**

---

## ✅ 验证部署

### 检查容器状态

```bash
ssh root@你的 ECS-IP
cd /opt/ai-agent
docker-compose ps
```

应该看到：
```
NAME                    STATUS         PORTS
ai-frontend             Up            80/tcp
ai-backend              Up            3001/tcp
nginx-proxy             Up             0.0.0.0:80->80/tcp
```

### 访问测试

打开浏览器访问：
- **前端**: http://你的 ECS-IP
- **API**: http://你的 ECS-IP/api/agent/tools

---

## 🔍 故障排查

### 问题 1：无法访问网页

**解决：**
```bash
# 1. 检查安全组是否开放 80 端口
# 阿里云控制台 → ECS → 安全组 → 配置规则

# 2. 检查防火墙
systemctl status firewalld

# 3. 查看 Nginx 日志
docker-compose logs nginx
```

### 问题 2：API 请求失败

**解决：**
```bash
# 1. 检查后端服务
docker-compose ps backend

# 2. 查看后端日志
docker-compose logs backend

# 3. 测试后端 API
curl http://localhost:3001/api/health
```

### 问题 3：构建失败

**解决：**
```bash
# 重新构建
cd /opt/ai-agent
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔄 更新部署

再次运行部署脚本即可：

```bash
./deploy-direct.sh
```

或手动更新：

```bash
ssh root@你的 ECS-IP
cd /opt/ai-agent
docker-compose up -d --build
```

---

## 📊 常用运维命令

```bash
# 查看实时日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d

# 进入容器
docker exec -it ai-backend sh

# 清理镜像
docker image prune -f
```

---

## 📖 详细文档

完整部署文档请查看：[ALIYUN_DEPLOYMENT.md](./ALIYUN_DEPLOYMENT.md)

---

## 🆘 获取帮助

如果遇到无法解决的问题：

1. 查看详细日志：`docker-compose logs -f`
2. 检查系统资源：`top`、`df -h`
3. 查看完整文档：`ALIYUN_DEPLOYMENT.md`

---

**祝您部署成功！** 🎉
