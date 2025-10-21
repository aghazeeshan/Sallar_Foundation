# Complete VPS Setup Guide

## 🚀 One-Command VPS Setup

### **Step 1: Push Code to Git**
```bash
# On your local machine
git add .
git commit -m "Complete VPS setup with automated scripts"
git push origin sallar --force
```

### **Step 2: VPS Setup (One-time only)**
```bash
# Connect to VPS
ssh root@31.97.62.124

# Navigate to project
cd /home/newuser/sallar-foundation

# Pull latest code
git pull origin sallar

# Make scripts executable
chmod +x deploy/*.sh

# Run complete setup (this will setup everything)
sudo ./deploy/complete-vps-setup.sh
```

### **Step 3: Verify Setup**
```bash
# Check if everything is running
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Test application
curl -s http://localhost:4000 | head -1
curl -s http://localhost:4010/api/health
```

## 🔄 Future Updates (Super Easy!)

### **Update Application:**
```bash
# On VPS, just run:
cd /home/newuser/sallar-foundation
./deploy/vps-quick-deploy.sh
```

## 📋 What the Complete Setup Script Does:

✅ **System Setup:**
- Fixes apt sources configuration
- Installs Docker & Docker Compose
- Installs Nginx & Certbot
- Configures firewall (ports 22, 80, 443)

✅ **Application Setup:**
- Creates .env file with production values
- Configures Nginx with proper proxy settings
- Starts Docker containers
- Imports database
- Tests all services

✅ **SSL Setup:**
- Gets SSL certificate from Let's Encrypt
- Configures auto-renewal
- Sets up HTTPS redirect

✅ **Auto-start Setup:**
- Creates systemd service
- Enables auto-start on boot

## 🎯 Final URLs:
- **Website**: https://sallarfoundation.org
- **Admin**: https://sallarfoundation.org/development
- **API**: https://sallarfoundation.org/api/health

## 🔧 Manual Commands (if needed):

### **Start Application:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Stop Application:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### **View Logs:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

### **Restart Services:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart
```

## 🚨 Troubleshooting:

### **If Docker daemon not running:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### **If containers not starting:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
```

### **If Nginx not working:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

### **If SSL not working:**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

## 📞 Support:
If you face any issues, check the logs:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

**This setup is completely automated - just run the scripts!** 🎉
