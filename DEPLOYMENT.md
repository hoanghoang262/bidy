# Bidy Platform Deployment Guide

## 📋 Table of Contents
- [Environment Configuration](#environment-configuration)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Port Configuration](#port-configuration)
- [Domain Setup](#domain-setup)
- [Troubleshooting](#troubleshooting)

## 🔧 Environment Configuration

### Port Standards
- **Frontend**: Port `3001` (both development and production)
- **Backend**: Port `8001` (both development and production)

### Domain Configuration
- **Production Frontend**: `https://bidy.vn` and `https://www.bidy.vn`
- **Production Backend API**: `https://api.bidy.vn`
- **Development Frontend**: `http://localhost:3001`
- **Development Backend API**: `http://localhost:8001`

## 🚀 Development Setup

### Prerequisites
- Node.js v18+ and npm
- MongoDB (local or cloud instance)
- Git

### Backend Setup (`/be`)

1. **Install dependencies:**
   ```bash
   cd be
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with these settings:**
   ```env
   # Environment
   NODE_ENV=development
   PORT=8001

   # Client URLs
   CLIENT_URL=http://localhost:3001
   CLIENT_URL_PROD=https://bidy.vn
   CLIENT_URL_PROD_WWW=https://www.bidy.vn

   # Server URLs
   SERVER_URL=http://localhost:8001
   SERVER_URL_PROD=https://api.bidy.vn

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # JWT (minimum 32 characters)
   JWT_SECRET=your-secret-key-minimum-32-characters

   # AWS S3 (for image uploads)
   ACCESS_KEY_ID=your_aws_access_key
   SECRET_ACCESS_KEY=your_aws_secret_key
   BUCKET_NAME=your_s3_bucket

   # Email
   MAIL_FROM=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```

4. **Start the backend server:**
   ```bash
   npm start  # Runs on port 8001
   ```

### Frontend Setup (`/fe`)

1. **Install dependencies:**
   ```bash
   cd fe
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Edit `.env.local` file with these settings:**
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8001
   NEXT_PUBLIC_WS_URL=ws://localhost:8001

   # App Configuration
   NEXT_PUBLIC_APP_NAME=Bidy
   NEXT_PUBLIC_APP_URL=http://localhost:3001

   # Feature Flags
   NEXT_PUBLIC_ENABLE_CHAT=true
   NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
   NEXT_PUBLIC_ENABLE_DARK_MODE=true
   ```

4. **Start the frontend server:**
   ```bash
   npm run dev  # Runs on port 3001
   ```

## 🌐 Production Deployment

### Backend Deployment

1. **Prepare production environment file:**
   ```bash
   cp .env.production /path/to/deployment/.env
   ```

2. **Production `.env` configuration:**
   ```env
   # Environment
   NODE_ENV=production
   PORT=8001

   # Client URLs (Production)
   CLIENT_URL=https://bidy.vn
   CLIENT_URL_PROD=https://bidy.vn
   CLIENT_URL_PROD_WWW=https://www.bidy.vn

   # Server URLs (Production)
   SERVER_URL=https://api.bidy.vn
   SERVER_URL_PROD=https://api.bidy.vn

   # Database (Production)
   MONGODB_URI=mongodb+srv://prod_user:prod_password@cluster.mongodb.net/bidy_production

   # Security
   JWT_SECRET=production-secret-minimum-32-characters-use-strong-random

   # Logging
   LOG_LEVEL=INFO
   LOG_TO_FILE=true
   DEBUG=false
   ```

3. **Deploy using PM2:**
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start the application
   pm2 start app.js --name "bidy-backend" --env production

   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

4. **Nginx configuration for backend (`/etc/nginx/sites-available/api.bidy.vn`):**
   ```nginx
   server {
       listen 80;
       server_name api.bidy.vn;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name api.bidy.vn;

       ssl_certificate /etc/letsencrypt/live/api.bidy.vn/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.bidy.vn/privkey.pem;

       location / {
           proxy_pass http://localhost:8001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # WebSocket support for Socket.io
       location /socket.io/ {
           proxy_pass http://localhost:8001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Frontend Deployment

1. **Prepare production environment:**
   ```bash
   cp .env.production /path/to/deployment/.env.local
   ```

2. **Production `.env.local` configuration:**
   ```env
   # API Configuration (Production)
   NEXT_PUBLIC_API_URL=https://api.bidy.vn
   NEXT_PUBLIC_WS_URL=wss://api.bidy.vn

   # App Configuration (Production)
   NEXT_PUBLIC_APP_NAME=Bidy
   NEXT_PUBLIC_APP_URL=https://bidy.vn

   # Production Settings
   NEXT_PUBLIC_SHOW_DEV_TOOLS=false
   NEXT_PUBLIC_ENABLE_DEBUG=false
   NEXT_PUBLIC_LOG_LEVEL=ERROR
   ```

3. **Build and deploy:**
   ```bash
   # Build the application
   npm run build

   # Start with PM2
   pm2 start npm --name "bidy-frontend" -- start

   # Or use Next.js standalone mode
   npm run start  # Runs on port 3001
   ```

4. **Nginx configuration for frontend (`/etc/nginx/sites-available/bidy.vn`):**
   ```nginx
   server {
       listen 80;
       server_name bidy.vn www.bidy.vn;
       return 301 https://bidy.vn$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name www.bidy.vn;
       
       ssl_certificate /etc/letsencrypt/live/bidy.vn/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/bidy.vn/privkey.pem;
       
       return 301 https://bidy.vn$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name bidy.vn;

       ssl_certificate /etc/letsencrypt/live/bidy.vn/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/bidy.vn/privkey.pem;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## 🔒 SSL Certificate Setup

Install SSL certificates using Let's Encrypt:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d bidy.vn -d www.bidy.vn
sudo certbot --nginx -d api.bidy.vn

# Auto-renewal (add to crontab)
0 0 * * * /usr/bin/certbot renew --quiet
```

## 🔍 Port Configuration Guide

### Check Port Usage
```bash
# Check if port is in use
lsof -i:8001  # Backend
lsof -i:3001  # Frontend

# Kill process on specific port
lsof -ti:8001 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Firewall Configuration
```bash
# Allow ports through firewall (Ubuntu/Debian)
sudo ufw allow 8001/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Error: EADDRINUSE: address already in use :::8001
# Solution:
lsof -ti:8001 | xargs kill -9
npm start
```

#### CORS Issues
Ensure your backend `.env` includes all client URLs:
```env
CLIENT_URL=http://localhost:3001
CLIENT_URL_PROD=https://bidy.vn
CLIENT_URL_PROD_WWW=https://www.bidy.vn
```

#### MongoDB Connection Issues
- Check MongoDB URI format: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Ensure IP whitelist includes server IP in MongoDB Atlas
- Check network connectivity: `ping cluster.mongodb.net`

#### WebSocket Connection Failed
- Ensure Nginx properly proxies WebSocket connections
- Check that `NEXT_PUBLIC_WS_URL` uses correct protocol:
  - Development: `ws://localhost:8001`
  - Production: `wss://api.bidy.vn`

### Health Checks

#### Backend Health Check
```bash
# Check API status
curl http://localhost:8001/api-docs

# Check with production domain
curl https://api.bidy.vn/api-docs
```

#### Frontend Health Check
```bash
# Check frontend
curl http://localhost:3001

# Check production
curl https://bidy.vn
```

## 📊 Monitoring

### PM2 Monitoring
```bash
# View running processes
pm2 list

# Monitor resources
pm2 monit

# View logs
pm2 logs bidy-backend
pm2 logs bidy-frontend

# Restart services
pm2 restart bidy-backend
pm2 restart bidy-frontend
```

### Log Files
- Backend logs: `~/.pm2/logs/bidy-backend-*.log`
- Frontend logs: `~/.pm2/logs/bidy-frontend-*.log`
- Nginx logs: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

## 🔄 Update Deployment

### Update Backend
```bash
cd /path/to/bidy/be
git pull origin main
npm install
pm2 restart bidy-backend
```

### Update Frontend
```bash
cd /path/to/bidy/fe
git pull origin main
npm install
npm run build
pm2 restart bidy-frontend
```

## 📝 Environment Variables Reference

### Backend Required Variables
| Variable | Development | Production | Description |
|----------|------------|------------|-------------|
| PORT | 8001 | 8001 | Backend server port |
| NODE_ENV | development | production | Environment mode |
| CLIENT_URL | http://localhost:3001 | https://bidy.vn | Main client URL |
| SERVER_URL | http://localhost:8001 | https://api.bidy.vn | API base URL |
| MONGODB_URI | mongodb://... | mongodb+srv://... | Database connection |
| JWT_SECRET | dev-secret-32chars | prod-secret-32chars | JWT signing key |

### Frontend Required Variables
| Variable | Development | Production | Description |
|----------|------------|------------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:8001 | https://api.bidy.vn | API endpoint |
| NEXT_PUBLIC_WS_URL | ws://localhost:8001 | wss://api.bidy.vn | WebSocket endpoint |
| NEXT_PUBLIC_APP_URL | http://localhost:3001 | https://bidy.vn | Application URL |

## 🚨 Security Checklist

- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Disable debug mode in production
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates: `npm audit fix`
- [ ] MongoDB connection uses strong credentials
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs`
2. Verify environment variables: `npm run validate-env`
3. Test connectivity: `curl http://localhost:8001/api-docs`
4. Review Nginx error logs: `sudo tail -f /var/log/nginx/error.log`