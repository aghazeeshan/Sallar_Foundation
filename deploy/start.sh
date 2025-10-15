#!/bin/bash

# Start Sallar Foundation Application
set -e

echo "🚀 Starting Sallar Foundation..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$MYSQL_ROOT_PASSWORD" ] || [ -z "$JWT_SECRET" ] || [ -z "$DOMAIN" ]; then
    echo "❌ Required environment variables not set. Please check your .env file."
    echo "Required: MYSQL_ROOT_PASSWORD, JWT_SECRET, DOMAIN"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down --remove-orphans || true

# Remove unused images and volumes to free space
echo "🧹 Cleaning up unused Docker resources..."
docker system prune -f

# Build and start containers
echo "🏗️ Building and starting containers..."
if [ "$NODE_ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml up -d --build
else
    docker-compose up -d --build
fi

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    
    # Show running containers
    docker-compose ps
    
    # Show application URLs
    echo ""
    echo "🌐 Application URLs:"
    if [ "$NODE_ENV" = "production" ]; then
        echo "   Frontend: https://$DOMAIN"
        echo "   Admin: https://$DOMAIN/development"
        echo "   API: https://$DOMAIN/api"
    else
        echo "   Frontend: http://localhost"
        echo "   Admin: http://localhost/development"
        echo "   API: http://localhost:5000/api"
    fi
    
    echo ""
    echo "📊 To check logs: ./deploy/logs.sh"
    echo "📊 To check status: ./deploy/status.sh"
else
    echo "❌ Some services failed to start. Checking logs..."
    docker-compose logs --tail=50
    exit 1
fi
