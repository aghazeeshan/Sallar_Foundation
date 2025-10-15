#!/bin/bash

# Update Sallar Foundation Application
set -e

echo "🔄 Updating Sallar Foundation..."

# Save current directory
CURRENT_DIR=$(pwd)

# Navigate to project directory
cd /var/www/sallar-foundation

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git fetch origin
git reset --hard origin/main

# Stop existing containers
echo "🛑 Stopping existing containers..."
if [ "$NODE_ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml down
else
    docker-compose down
fi

# Remove old images to free space
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

# Build and start new containers
echo "🏗️ Building and starting updated containers..."
if [ "$NODE_ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml up -d --build
else
    docker-compose up -d --build
fi

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Update completed successfully!"
    
    # Show running containers
    docker-compose ps
    
    # Log the update
    echo "$(date): Update completed successfully" >> logs/update.log
else
    echo "❌ Update failed. Some services are not running."
    docker-compose logs --tail=50
    
    # Log the failure
    echo "$(date): Update failed" >> logs/update.log
    exit 1
fi

# Return to original directory
cd "$CURRENT_DIR"
