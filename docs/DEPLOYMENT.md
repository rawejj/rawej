# Deployment Guide

This guide covers deploying the Rawej app to a VPS using Docker and Nginx.

## Prerequisites
- VPS with Ubuntu/Debian
- Docker and Docker Compose installed
- Domain name pointing to VPS IP
- GitHub repository with secrets set

## VPS Setup
1. Update system: `sudo apt update && sudo apt upgrade`
2. Install Docker: Follow https://docs.docker.com/engine/install/ubuntu/
3. Install Docker Compose: `sudo apt install docker-compose-plugin`
4. Install Nginx: `sudo apt install nginx`
5. Install Certbot: `sudo apt install certbot python3-certbot-nginx`
6. Clone repo: `git clone https://github.com/salahfarzin/rawej.git /path/to/app`
7. Copy `.env` with production values
8. Copy `nginx.conf` to `/etc/nginx/sites-available/rawej`
9. Enable site: `sudo ln -s /etc/nginx/sites-available/rawej /etc/nginx/sites-enabled/`
10. Test Nginx: `sudo nginx -t && sudo systemctl reload nginx`

## SSL Setup
- Run: `sudo certbot --nginx -d your-domain.com -d www.your-domain.com`

## Deploy
- `cd /path/to/app`
- `docker-compose up -d --build`

## GitHub Secrets
Set in repo settings:
- `VPS_HOST`: Your VPS IP/domain
- `VPS_USER`: SSH username
- `VPS_SSH_KEY`: Private SSH key
- `VPS_PATH`: Path to app on VPS (e.g., /home/user/rawej)

## Monitoring
- Logs: `docker-compose logs -f`
- Nginx logs: `sudo tail -f /var/log/nginx/access.log`
- Health check: Visit `https://your-domain.com/api/health` (if implemented)