# 🚀 快速部署 - 无需 Harbor

## ⚡ 3 分钟快速部署

### 1️⃣ ECS 准备（首次只需一次）

```bash
# SSH 登录
ssh root@your-ecs-ip

# 一键安装 Docker 和 Docker Compose
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
systemctl start docker
```

### 2️⃣ 配置安全组
阿里云控制台 → ECS → 安全组 → 添加规则：端口 80/80

### 3️⃣ 执行部署

```bash
# 修改 deploy-direct.sh 中的 ECS_IP
vim deploy-direct.sh
# 修改：ECS_IP="your-ecs-ip"

# 运行部署
./deploy-direct.sh
```

**完成！** 🎉 访问 http://your-ecs-ip

---

## 📋 常用命令速查

```bash
# 部署
./deploy-direct.sh

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启
docker-compose restart

# 更新
docker-compose up -d --build

# 停止
docker-compose down
```

---

## 🔧 故障排查

```bash
# 容器状态
docker-compose ps

# 详细日志
docker-compose logs -f

# 重建
docker-compose up -d --build --force-recreate

# 清理
docker image prune -a
```

---

## 📞 快速帮助

- **无法访问**: 检查安全组是否开放 80 端口
- **构建慢**: 配置 Docker 镜像加速
- **内存不足**: `docker image prune -a`
- **端口冲突**: `netstat -tulpn | grep :80`

---

**完整文档**: [DEPLOY_WITHOUT_HARBOR.md](DEPLOY_WITHOUT_HARBOR.md)
