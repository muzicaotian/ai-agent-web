#!/bin/bash

echo "🧪 开始本地测试..."
echo ""

# 构建并启动
echo "📦 构建容器..."
docker-compose up --build -d

if [ $? -ne 0 ]; then
  echo "❌ 容器启动失败!"
  exit 1
fi

echo "✅ 容器启动成功"
echo ""

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查容器状态
echo "📊 容器状态:"
docker-compose ps
echo ""

# 测试前端
echo "🌐 测试前端服务..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$response" = "200" ]; then
  echo "✅ 前端服务正常 (HTTP $response)"
else
  echo "❌ 前端服务异常 (HTTP $response)"
fi

# 测试后端健康检查
echo "🔧 测试后端 API..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
if [ "$response" = "200" ]; then
  echo "✅ 健康检查通过 (HTTP $response)"
else
  echo "⚠️  健康检查失败 (HTTP $response)"
fi

echo ""
echo "📝 查看最新日志:"
docker-compose logs --tail=20

echo ""
echo "💡 提示:"
echo "- 访问前端：http://localhost"
echo "- 查看日志：docker-compose logs -f"
echo "- 停止服务：docker-compose down"
