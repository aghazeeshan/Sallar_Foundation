# 🚀 Sallar Foundation - Docker Deployment Guide

This guide will help you deploy the Sallar Foundation website using Docker with automated CI/CD pipeline.

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ (minimum 2GB RAM, 20GB storage)
- Domain name pointing to your VPS IP
- GitHub account
- Basic knowledge of Linux commands

## 🛠️ Quick Setup

### 1. VPS Initial Setup

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Run the automated setup script
curl -fsSL https://raw.githubusercontent.com/aghazeeshan/Sallar_Foundation/main/deploy/vps-setup.sh | bash
```

### 2. Configure Environment

```bash
# Navigate to project directory
cd /var/www/sallar-foundation

# Copy and edit environment file
cp env.example .env
nano .env
```

**Required Environment Variables:**
```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=your_strong_root_password_here
MYSQL_DATABASE=charity_foundation
MYSQL_USER=charity_user
MYSQL_PASSWORD=your_strong_mysql_password_here

# Backend Configuration
JWT_SECRET=your_very_strong_jwt_secret_key_minimum_32_characters_long
FRONTEND_URL=https://your-domain.com

# Domain Configuration
DOMAIN=your-domain.com
SSL_EMAIL=your-email@gmail.com
```

### 3. Start the Application

```bash
# Make scripts executable
chmod +x deploy/*.sh

# Start the application
./deploy/start.sh
```

## 🔄 Automated Deployment Setup

### GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
VPS_HOST=your-vps-ip-address
VPS_USERNAME=your-vps-username
VPS_SSH_KEY=your-private-ssh-key
VPS_PORT=22
```

### SSH Key Setup

```bash
# On your local machine, generate SSH key
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to VPS
ssh-copy-id user@your-vps-ip

# Copy private key content to GitHub secrets (VPS_SSH_KEY)
cat ~/.ssh/id_rsa
```

## 🐳 Docker Commands

### Basic Operations

```bash
# Start application
./deploy/start.sh

# Stop application
./deploy/stop.sh

# Update application
./deploy/update.sh

# Check status
./deploy/status.sh

# View logs
./deploy/logs.sh
```

### Advanced Docker Commands

```bash
# View specific service logs
./deploy/logs.sh backend
./deploy/logs.sh frontend
./deploy/logs.sh mysql

# Follow logs in real-time
./deploy/logs.sh follow

# Manual Docker operations
docker-compose ps                    # List containers
docker-compose logs -f backend       # Follow backend logs
docker-compose exec backend bash     # Access backend container
docker-compose exec mysql mysql -u root -p  # Access MySQL
```

## 🔧 Configuration Files

### Docker Compose Files

- `docker-compose.yml` - Development configuration
- `docker-compose.prod.yml` - Production configuration with SSL

### Dockerfile Locations

- `Backend/Dockerfile` - Backend API container
- `frontend/Dockerfile` - Frontend development container
- `frontend/Dockerfile.prod` - Frontend production container with SSL

### Nginx Configuration

- `frontend/nginx.conf` - Development nginx config
- `frontend/nginx.prod.conf` - Production nginx config with SSL

## 🔒 SSL Certificate Setup

SSL certificates are automatically obtained using Let's Encrypt when using production configuration.

### Manual SSL Setup

```bash
# If automatic SSL fails, run manually
docker-compose exec frontend certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email your-email@gmail.com \
  --agree-tos --no-eff-email \
  -d your-domain.com -d www.your-domain.com
```

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check application health
curl http://your-domain.com/api/health

# Check all services
./deploy/status.sh
```

### Log Management

```bash
# View recent logs
./deploy/logs.sh

# View specific service logs
./deploy/logs.sh backend 100

# Follow logs in real-time
./deploy/logs.sh follow
```

### Database Management

```bash
# Access MySQL container
docker-compose exec mysql mysql -u root -p

# Backup database
docker-compose exec mysql mysqldump -u root -p charity_foundation > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u root -p charity_foundation < backup.sql
```

## 🔄 Automatic Updates

The system is configured to automatically update daily at 2 AM. You can also trigger manual updates:

```bash
# Manual update
./deploy/update.sh

# Check update logs
tail -f logs/update.log
```

## 🚨 Troubleshooting

### Common Issues

1. **Containers not starting**
   ```bash
   ./deploy/logs.sh
   docker-compose ps
   ```

2. **SSL certificate issues**
   ```bash
   docker-compose exec frontend certbot renew --dry-run
   ```

3. **Database connection issues**
   ```bash
   docker-compose exec mysql mysql -u root -p
   ```

4. **Port conflicts**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

### Reset Everything

```bash
# Stop and remove all containers
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
./deploy/start.sh
```

## 📱 Admin Access

- **Admin Panel**: `https://your-domain.com/development`
- **Default Credentials**: 
  - Username: `admin`
  - Password: `password` (change immediately after first login)

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `strong_password_123` |
| `MYSQL_DATABASE` | Database name | `charity_foundation` |
| `MYSQL_USER` | MySQL user | `charity_user` |
| `MYSQL_PASSWORD` | MySQL user password | `user_password_123` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_32_chars_min` |
| `FRONTEND_URL` | Frontend URL | `https://your-domain.com` |
| `DOMAIN` | Your domain name | `your-domain.com` |
| `SSL_EMAIL` | Email for SSL certificates | `admin@your-domain.com` |

## 📞 Support

If you encounter any issues:

1. Check the logs: `./deploy/logs.sh`
2. Check the status: `./deploy/status.sh`
3. Review this documentation
4. Check GitHub Issues

## 🎯 Production Checklist

- [ ] VPS setup completed
- [ ] Domain DNS configured
- [ ] Environment variables set
- [ ] SSL certificates obtained
- [ ] Database initialized
- [ ] Admin credentials changed
- [ ] Email settings configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] GitHub Actions configured

---

**🎉 Your Sallar Foundation website is now ready for production!**
