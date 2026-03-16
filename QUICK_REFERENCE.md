# 📌 AI Agent 阿里云部署 - 快速参考卡

## 🚀 一键部署（3 步）

```bash
# 1. 配置 ECS IP
export ECS_IP="你的 ECS-IP"

# 2. 运行部署脚本
./deploy-direct.sh

# 3. 等待完成（5-8 分钟）
```

---

## ✅ 验证命令

```bash
# SSH 登录 ECS
ssh root@$ECS_IP

# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 访问测试
curl http://$ECS_IP
curl http://$ECS_IP/api/agent/tools
```

---

## 🔧 常用运维命令

```bash
# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d

# 重新构建
docker-compose up -d --build

# 进入容器
docker exec -it ai-backend sh

# 清理资源
docker system prune -f
```

---

## ⚠️ 故障排查速查

### 无法访问网页
1. 检查安全组 80 端口
2. `systemctl status firewalld`
3. `docker-compose logs nginx`

### API 请求失败
1. `docker-compose ps backend`
2. `docker-compose logs backend`
3. 检查 `.env`: `VITE_API_URL=/api`

### 构建失败
1. `df -h` (检查磁盘)
2. `docker system prune -a`
3. `docker-compose build --no-cache`

---

## 📊 关键配置

### 前端环境变量
```env
VITE_API_URL=/api
```

### Nginx 代理
```nginx
location /api/ {
   proxy_pass http://backend:3001;
   proxy_buffering off;
}
```

### Docker Compose 网络
```yaml
networks:
  app-network:
  driver: bridge
```

---

## 🎯 访问地址

- **前端**: http://你的 ECS-IP
- **API**: http://你的 ECS-IP/api
- **健康检查**: http://你的 ECS-IP/api/health

---

## 📞 紧急联系（自言自语）

```bash
# 查看所有日志
docker-compose logs -f

# 查看资源使用
docker stats
top
df -h

# 重启所有服务
docker-compose down && docker-compose up -d
```

---

## 📖 详细文档

- 快速部署：`README_QUICK_DEPLOY.md`
- 完整指南：`README_DEPLOYMENT.md`
- 检查清单：`DEPLOYMENT_CHECKLIST.md`
- API 配置：`API_CONFIG.md`

---

**打印此卡片作为快速参考！** 📋
