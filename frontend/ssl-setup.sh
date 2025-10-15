#!/bin/sh

# SSL Setup Script for Production
echo "Starting SSL setup for domain: $DOMAIN"

# Check if SSL certificates exist
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "SSL certificates not found. Obtaining new certificates..."
    
    # Start nginx with HTTP only configuration first
    envsubst '${DOMAIN}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
    mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf
    
    # Start nginx in background
    nginx &
    
    # Wait for nginx to start
    sleep 5
    
    # Obtain SSL certificate
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $SSL_EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    # Stop nginx
    nginx -s quit
    
    # Wait for nginx to stop
    sleep 5
else
    echo "SSL certificates found. Checking for renewal..."
    certbot renew --quiet
fi

# Setup SSL configuration
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "Setting up SSL configuration..."
    envsubst '${DOMAIN}' < /etc/nginx/conf.d/nginx.prod.conf > /etc/nginx/conf.d/default.conf
else
    echo "SSL certificates not available. Using HTTP only configuration..."
    envsubst '${DOMAIN}' < /etc/nginx/conf.d/nginx.conf > /etc/nginx/conf.d/default.conf
fi

# Setup cron job for certificate renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet && nginx -s reload" | crontab -

# Start cron daemon
crond

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;"
