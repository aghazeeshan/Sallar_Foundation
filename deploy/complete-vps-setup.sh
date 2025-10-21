#!/bin/bash

# Complete VPS Setup Script for Sallar Foundation
# This script will setup everything on VPS automatically

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🚀 Starting Complete VPS Setup for Sallar Foundation..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root. Please run: sudo $0"
   exit 1
fi

# Fix apt sources issue
print_status "Fixing apt sources configuration..."
rm -f /etc/apt/sources.list.d/ubuntu-mirrors.list
apt update

# Install required packages
print_status "Installing required packages..."
apt update
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed successfully"
else
    print_success "Docker already installed"
fi

# Start and enable Docker
print_status "Starting Docker service..."
systemctl start docker
systemctl enable docker
systemctl status docker --no-pager

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose already installed"
fi

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw --force enable

# Create .env file
print_status "Creating .env file..."
cat > .env << 'EOF'
# Database Configuration
MYSQL_ROOT_PASSWORD=SallarFoundation2024!
MYSQL_DATABASE=charity_foundation
MYSQL_USER=charity_user
MYSQL_PASSWORD=CharityUser2024!

# Backend Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sallarfoundation.org

# Port Configuration
FRONTEND_PORT=4000
BACKEND_PORT=4010
DATABASE_PORT=4020

# Domain Configuration
DOMAIN=sallarfoundation.org
EMAIL=admin@sallarfoundation.org

# Docker Network
DOCKER_NETWORK=sallar_network
EOF

print_success ".env file created successfully"

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/sallarfoundation.org << 'EOF'
server {
    listen 80;
    server_name sallarfoundation.org www.sallarfoundation.org;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Main application
    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:4010;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/sallarfoundation.org /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

print_success "Nginx configured successfully"

# Start Docker services
print_status "Starting Docker services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for containers to be ready
print_status "Waiting for containers to start..."
sleep 60

# Check container status
print_status "Checking container status..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Import database
print_status "Importing database..."
if [ -f "charity_foundation.sql" ]; then
    docker exec -i sallar_mysql mysql -u root -p'SallarFoundation2024!' charity_foundation < charity_foundation.sql
    print_success "Database imported successfully"
else
    print_warning "charity_foundation.sql not found. Please import database manually."
fi

# Test application
print_status "Testing application..."
sleep 10

# Test frontend
if curl -f -s http://localhost:4000 > /dev/null; then
    print_success "Frontend is running on port 4000"
else
    print_error "Frontend is not responding on port 4000"
fi

# Test backend
if curl -f -s http://localhost:4010/api/health > /dev/null; then
    print_success "Backend is running on port 4010"
else
    print_error "Backend is not responding on port 4010"
fi

# Test database
if docker exec sallar_mysql mysql -u root -p'SallarFoundation2024!' -e "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database is running"
else
    print_error "Database is not responding"
fi

# Setup SSL certificate
print_status "Setting up SSL certificate..."
certbot --nginx -d sallarfoundation.org -d www.sallarfoundation.org --non-interactive --agree-tos --email admin@sallarfoundation.org

# Setup auto-renewal
print_status "Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Create systemd service for auto-start
print_status "Creating systemd service..."
cat > /etc/systemd/system/sallar.service << 'EOF'
[Unit]
Description=Sallar Foundation Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/newuser/sallar-foundation
ExecStart=/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable sallar.service

print_success "Complete VPS setup finished successfully!"
print_status "Your application should be available at:"
echo "- Website: https://sallarfoundation.org"
echo "- Admin: https://sallarfoundation.org/development"
echo "- API: https://sallarfoundation.org/api/health"

print_status "To view logs: docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
print_status "To restart: docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
