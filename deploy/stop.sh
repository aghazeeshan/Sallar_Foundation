#!/bin/bash

# Stop Sallar Foundation Application
set -e

echo "🛑 Stopping Sallar Foundation..."

# Stop containers
if [ "$NODE_ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml down
else
    docker-compose down
fi

echo "✅ Application stopped successfully!"

# Show status
docker-compose ps
