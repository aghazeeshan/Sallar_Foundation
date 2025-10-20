# VPS Deployment Guide for Sallar Foundation

## Complete Automated Setup

### Step 1: Push Code to Git
```bash
# On your local machine
git add .
git commit -m "Complete VPS deployment setup"
git push origin sallar
```

### Step 2: VPS Setup (One-time only)

#### A. Connect to your VPS:
```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

#### B. Download and run setup script:
```bash
# Download the project
git clone https://github.com/yourusername/your-repo.git /var/www/sallar
cd /var/www/sallar

# Make scripts executable
chmod +x deploy/vps-setup.sh deploy/vps-deploy.sh

# Run VPS setup (one-time only)
./deploy/vps-setup.sh
```

#### C. Configure environment:
```bash
# Copy production environment file
cp env.prod .env

# Edit with your values
nano .env
```

**Required .env values:**
```env
MYSQL_ROOT_PASSWORD=your_strong_password_here
EMAIL=your-email@example.com
DOMAIN=sallarfoundation.org
```

### Step 3: Deploy Application
```bash
# Deploy the application
./deploy/vps-deploy.sh
```

## Manual Commands (if needed)

### Start Application:
```bash
cd /var/www/sallar
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Stop Application:
```bash
cd /var/www/sallar
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### View Logs:
```bash
cd /var/www/sallar
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

### Update Application:
```bash
cd /var/www/sallar
git pull origin sallar
./deploy/vps-deploy.sh
```

### Import Database (if needed):
```bash
cd /var/www/sallar
docker exec -i sallar_mysql mysql -u root -p'your_password' charity_foundation < charity_foundation.sql
```

## Domain Configuration

### DNS Settings (in your domain provider):
```
Type: A
Name: @
Value: YOUR_VPS_IP_ADDRESS
TTL: 300

Type: CNAME  
Name: www
Value: sallarfoundation.org
TTL: 300
```

## Verification

After deployment, check:
- ✅ Website: https://sallarfoundation.org
- ✅ Admin: https://sallarfoundation.org/development
- ✅ API: https://sallarfoundation.org/api/health

## Troubleshooting

### Check container status:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

### Check logs:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs mysql
```

### Restart specific service:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart backend
```

### Check Nginx:
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## Auto-start on Boot

The application will automatically start on server reboot due to the systemd service.

To check service status:
```bash
sudo systemctl status sallar
sudo systemctl enable sallar
sudo systemctl start sallar
```

## Security Notes

- Firewall is configured to allow only ports 22, 80, 443
- SSL certificates are auto-renewed
- Application runs in Docker containers for isolation
- Database is not exposed to external connections

## Quick Commands Summary

```bash
# Complete setup (run once on VPS):
git clone <your-repo> /var/www/sallar
cd /var/www/sallar
chmod +x deploy/*.sh
./deploy/vps-setup.sh
cp env.prod .env
# Edit .env with your values
./deploy/vps-deploy.sh

# Update application (run when you want to update):
cd /var/www/sallar
./deploy/vps-deploy.sh
```
