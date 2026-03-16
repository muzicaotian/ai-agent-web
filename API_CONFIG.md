# 前后端通信配置说明

## 📡 架构设计

### 本地开发环境

```
浏览器 (localhost:5173)
    ↓
Vite Dev Server
    ↓
http://localhost:3001 (后端 API)
```

### 生产环境（阿里云 ECS）

```
用户访问
    ↓
Nginx (80 端口)
    ├→ 前端静态文件 (/)
    └→ API 代理 (/api/* → backend:3001)
         ↓
    后端服务 (3001 端口)
```

---

## ⚙️ 关键配置

### 1. 前端环境变量

**文件**: `.env`

```env
# 生产环境配置
VITE_API_URL=/api
```

**说明**: 
- 使用相对路径 `/api`，让 Nginx 处理代理
- 避免硬编码 IP 地址
- 适配任何部署环境

### 2. Nginx 代理配置

**文件**: `nginx.conf`

```nginx
server {
   listen 80;
    server_name localhost;
    
   root /usr/share/nginx/html;
   index index.html;

    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
        
        # 缓存控制
        add_header Cache-Control"no-store, no-cache";
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
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**关键点**:
- `location /api/` 匹配所有以 `/api/` 开头的请求
- `proxy_pass http://backend:3001` 转发到后端容器
- WebSocket 支持（SSE 流式传输需要）
- 正确的 header 转发

### 3. Docker Compose 网络配置

**文件**: `docker-compose.yml`

```yaml
services:
  frontend:
   container_name: ai-frontend
   networks:
      - app-network
  
  backend:
   container_name: ai-backend
    environment:
      - PORT=3001
   networks:
      - app-network
  
  nginx:
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

**说明**:
- 三个容器在同一网络 `app-network`
- Nginx 可以通过容器名 `backend` 访问后端服务
- 只有 Nginx 暴露 80 端口到外部

---

## 🔍 通信流程

### 前端发起 API 请求

1. **React 组件**调用 API:
```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function streamChat(messages) {
 const response = await fetch(`${API_URL}/api/agent/chat`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  // ...
}
```

2. **浏览器请求**:
```
GET http://your-ecs-ip/api/agent/chat
```

3. **Nginx 接收并代理**:
```nginx
location /api/ {
    proxy_pass http://backend:3001;
    # ...
}
```

4. **后端容器接收**:
```
http://backend:3001/api/agent/chat
```

5. **Express 路由处理**:
```typescript
// 后端 main.ts
app.post('/api/agent/chat', async (req, res) => {
  // 处理聊天请求
});
```

---

## 🛠️ 调试方法

### 1. 检查前端 API 地址

在浏览器控制台查看实际请求 URL：

```javascript
console.log(import.meta.env.VITE_API_URL);
// 应该输出："/api"
```

### 2. 测试 Nginx 代理

```bash
# SSH 登录 ECS
ssh root@your-ecs-ip

# 进入容器测试
docker exec -it nginx-proxy sh

# 测试代理
curl http://backend:3001/api/health
```

### 3. 查看 Nginx 日志

```bash
docker-compose logs nginx
# 或
docker exec -it nginx-proxy tail -f /var/log/nginx/access.log
```

### 4. 网络连通性测试

```bash
# 从 Nginx 容器测试后端连接
docker exec -it nginx-proxy ping backend
docker exec -it nginx-proxy telnet backend 3001
```

---

## ⚠️ 常见问题

### Q1: 前端报 CORS 错误

**现象**:
```
Access to fetch at 'http://localhost:3001/api/...' from origin 'http://your-ecs-ip' has been blocked by CORS policy
```

**原因**: 前端直接请求后端，没有通过 Nginx 代理

**解决**:
1. 确认 `.env` 文件中 `VITE_API_URL=/api`
2. 重新构建前端镜像：
```bash
docker-compose build frontend
docker-compose up -d frontend
```

### Q2: API 请求返回 404

**可能原因**:
1. Nginx 配置不正确
2. 后端路由不存在
3. 容器网络不通

**排查步骤**:
```bash
# 1. 检查 Nginx 配置
docker exec -it nginx-proxy cat /etc/nginx/conf.d/default.conf

# 2. 测试后端直连
docker exec -it ai-backend curl http://localhost:3001/api/health

# 3. 查看 Nginx 错误日志
docker exec -it nginx-proxy tail -f /var/log/nginx/error.log
```

### Q3: SSE 流式传输中断

**现象**: 响应开始后很快停止

**解决**: 检查 Nginx 超时配置：

```nginx
location /api/ {
    proxy_pass http://backend:3001;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # 禁用缓冲（重要！）
    proxy_buffering off;
    proxy_cache off;
}
```

---

## 🔧 优化建议

### 1. 添加健康检查

**docker-compose.yml**:

```yaml
services:
  backend:
   healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
     interval: 30s
     timeout: 10s
     retries: 3
    
  nginx:
   healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
     interval: 30s
     timeout: 10s
     retries: 3
```

### 2. 配置负载均衡（多实例）

如果有多个后端实例：

```nginx
upstream backend_servers {
    server backend1:3001;
    server backend2:3001;
}

location /api/ {
    proxy_pass http://backend_servers;
}
```

### 3. 添加请求限制

```nginx
location /api/ {
    proxy_pass http://backend:3001;
    
    # 限制请求大小
    client_max_body_size 10M;
    
    # 限制请求频率
   limit_req zone=api burst=20 nodelay;
}
```

---

## 📊 性能监控

### 查看实时流量

```bash
# 查看容器网络流量
docker stats

# 查看 Nginx 访问日志
docker exec -it nginx-proxy tail -f /var/log/nginx/access.log
```

### 分析慢请求

在 Nginx 配置中添加：

```nginx
log_format slow '$request_time - $uri';

access_log /var/log/nginx/access.log slow;
```

---

## 🎯 总结

### 配置要点

1. ✅ 前端使用相对路径：`VITE_API_URL=/api`
2. ✅ Nginx 正确配置代理：`proxy_pass http://backend:3001`
3. ✅ 容器在同一网络：`app-network`
4. ✅ WebSocket/SSE 支持：升级 header 配置
5. ✅ 超时配置：60s 超时时间

### 验证清单

- [ ] 前端可以正常访问
- [ ] API 请求可以到达后端
- [ ] 后端响应正常
- [ ] SSE 流式传输正常
- [ ] 无 CORS 错误

---

**配置完成，前后端通信正常！** ✅
