#!/bin/bash

# Complete VPS Setup Script for Sallar Foundation
# Run this script on your VPS to setup everything automatically

set -e

echo "🚀 Starting Sallar Foundation VPS Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_success "Docker installed successfully"
else
    print_success "Docker already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose already installed"
fi

# Install required packages
print_status "Installing required packages..."
sudo apt install -y git nginx certbot python3-certbot-nginx ufw curl wget

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw --force enable

# Create project directory
print_status "Setting up project directory..."
sudo mkdir -p /var/www/sallar
sudo chown $USER:$USER /var/www/sallar

# Setup Nginx configuration
print_status "Configuring Nginx..."
sudo cp nginx/sallarfoundation.org.conf /etc/nginx/sites-available/sallarfoundation.org
sudo ln -sf /etc/nginx/sites-available/sallarfoundation.org /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Setup SSL certificate
print_status "Setting up SSL certificate..."
if [ ! -f /etc/letsencrypt/live/sallarfoundation.org/fullchain.pem ]; then
    sudo certbot --nginx -d sallarfoundation.org -d www.sallarfoundation.org --non-interactive --agree-tos --email your-email@example.com
    print_success "SSL certificate installed"
else
    print_success "SSL certificate already exists"
fi

# Setup auto-renewal
print_status "Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Create systemd service for auto-start
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/sallar.service > /dev/null <<EOF
[Unit]
Description=Sallar Foundation Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/sallar
ExecStart=/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
TimeoutStartSec=0
User=$USER
Group=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable sallar.service

print_success "VPS setup completed successfully!"
print_status "Next steps:"
echo "1. Clone your repository: git clone <your-repo-url> /var/www/sallar"
echo "2. Copy env.prod to .env: cp env.prod .env"
echo "3. Edit .env with your production values"
echo "4. Run: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build"
echo "5. Import database: docker exec -i sallar_mysql mysql -u root -p'password' charity_foundation < charity_foundation.sql"

print_warning "Please update the email in the SSL certificate command above!"
print_warning "Please update your repository URL and database password!"