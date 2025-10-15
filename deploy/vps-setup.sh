#!/bin/bash

# VPS Setup Script for Sallar Foundation
# Run this script on your VPS to set up the environment

set -e

echo "🚀 Setting up Sallar Foundation on VPS..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Git
echo "📚 Installing Git..."
sudo apt install -y git curl wget

# Create project directory
echo "📁 Creating project directory..."
sudo mkdir -p /var/www/sallar-foundation
sudo chown $USER:$USER /var/www/sallar-foundation
cd /var/www/sallar-foundation

# Clone repository
echo "📥 Cloning repository..."
if [ ! -d ".git" ]; then
    git clone https://github.com/aghazeeshan/Sallar_Foundation.git .
else
    git pull origin main
fi

# Create environment file
echo "⚙️ Setting up environment variables..."
if [ ! -f ".env" ]; then
    cp env.example .env
    echo ""
    echo "🔧 Please edit the .env file with your actual values:"
    echo "   nano .env"
    echo ""
    echo "Required variables to update:"
    echo "   - MYSQL_ROOT_PASSWORD"
    echo "   - MYSQL_PASSWORD"
    echo "   - JWT_SECRET"
    echo "   - DOMAIN"
    echo "   - SSL_EMAIL"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ssl nginx/conf.d

# Set up firewall
echo "🔥 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/docker-compose > /dev/null <<EOF
/var/www/sallar-foundation/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart > /dev/null 2>&1 || true
    endscript
}
EOF

# Create logs directory
mkdir -p logs

# Set up automatic updates
echo "🔄 Setting up automatic updates..."
sudo tee /etc/cron.d/sallar-foundation-update > /dev/null <<EOF
# Update Sallar Foundation every day at 2 AM
0 2 * * * $USER cd /var/www/sallar-foundation && /var/www/sallar-foundation/deploy/update.sh >> /var/www/sallar-foundation/logs/update.log 2>&1
EOF

# Make scripts executable
chmod +x deploy/*.sh

echo ""
echo "✅ VPS setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Start the application: ./deploy/start.sh"
echo "3. Check status: ./deploy/status.sh"
echo ""
echo "Useful commands:"
echo "  - Start: ./deploy/start.sh"
echo "  - Stop: ./deploy/stop.sh"
echo "  - Update: ./deploy/update.sh"
echo "  - Status: ./deploy/status.sh"
echo "  - Logs: ./deploy/logs.sh"
echo ""
