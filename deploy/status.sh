#!/bin/bash

# Check Sallar Foundation Application Status
echo "📊 Sallar Foundation Status"
echo "=========================="

# Check if containers are running
echo ""
echo "🐳 Docker Containers:"
if [ "$NODE_ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml ps
else
    docker-compose ps
fi

# Check container health
echo ""
echo "💚 Health Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check disk usage
echo ""
echo "💾 Disk Usage:"
df -h /var/www/sallar-foundation

# Check Docker system usage
echo ""
echo "🐳 Docker System Usage:"
docker system df

# Check recent logs
echo ""
echo "📝 Recent Logs (last 10 lines):"
echo "--- Backend ---"
docker-compose logs --tail=10 backend 2>/dev/null || echo "Backend not running"

echo ""
echo "--- Frontend ---"
docker-compose logs --tail=10 frontend 2>/dev/null || echo "Frontend not running"

echo ""
echo "--- MySQL ---"
docker-compose logs --tail=10 mysql 2>/dev/null || echo "MySQL not running"

# Check if services are accessible
echo ""
echo "🌐 Service Accessibility:"
if curl -s http://localhost > /dev/null; then
    echo "✅ Frontend: Accessible"
else
    echo "❌ Frontend: Not accessible"
fi

if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend API: Accessible"
else
    echo "❌ Backend API: Not accessible"
fi

# Show uptime
echo ""
echo "⏰ System Uptime:"
uptime
