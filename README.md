# Bidy - Vietnamese Auction Platform 🇻🇳

A modern, full-stack auction platform built with Next.js and Node.js, designed for the Vietnamese market.

## 🏗️ Project Structure

```
bidy/
├── fe/                 # Frontend (Next.js 15 + TypeScript)
├── be/                 # Backend (Node.js + Express + MongoDB)
├── CLAUDE.md          # Development documentation
├── DEPLOYMENT.md      # Deployment guide
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 7+
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hoanghoang262/bidy.git
   cd bidy
   ```

2. **Frontend Setup**
   ```bash
   cd fe
   npm install
   npm run dev          # Starts on localhost:3001
   ```

3. **Backend Setup**
   ```bash
   cd be
   npm install
   cp .env.example .env  # Configure your environment
   npm start            # Starts on localhost:8001
   ```

## 🌐 Production Deployment

### Same VPC Setup (Recommended)

Both frontend and backend should run in the same VPC for optimal performance and security:

**Frontend (Port 3001)**:
```bash
cd fe
npm run build
npm start                # Production server on port 3001
```

**Backend (Port 8001)**:
```bash
cd be
npm start                # API server on port 8001
```

**Domain Routing**:
- **Frontend**: `https://bidy.vn` → `localhost:3001`
- **Backend API**: `https://api.bidy.vn` → `localhost:8001`

**Nginx Configuration Example**:
```nginx
# Frontend (bidy.vn)
server {
    listen 80;
    server_name bidy.vn www.bidy.vn;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Backend API (api.bidy.vn)
server {
    listen 80;
    server_name api.bidy.vn;
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Redux Toolkit + TanStack Query  
- **Real-time**: Socket.io-client
- **Authentication**: JWT with cookie storage

### Backend  
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3
- **Background Jobs**: node-cron

## ✨ Key Features

- 🔥 **Real-time Bidding** - Live auction updates with Socket.io
- 🎨 **Modern UI** - ChợTốt-inspired colorful category design
- 📱 **Mobile Responsive** - Optimized for Vietnamese mobile users
- 🔐 **Secure Authentication** - JWT with automatic refresh
- 📊 **Admin Dashboard** - Comprehensive auction management
- 💬 **Live Chat** - Real-time messaging between users
- 📸 **Image Uploads** - AWS S3 integration with optimization
- 🔍 **Advanced Search** - Category filtering and search functionality

## 🎯 Recent Improvements

### Performance Optimizations
- Removed lazy loading for instant navigation
- Optimized webpack configuration with intelligent chunking
- Added preloading for critical routes
- Enhanced static file serving with proper caching

### UI/UX Enhancements  
- **8 New Category Icons**: Vehicles, Fashion, Sports, Pets, Food, Books, Beauty, Health
- **ChợTốt-Style Design**: Vibrant gradients and professional Vietnamese marketplace aesthetic
- **Mobile-First Responsive**: Perfect scaling across all devices
- **Enhanced Accessibility**: Proper ARIA labels and keyboard navigation

### Backend Stability
- Fixed critical logger crashes with null-safety checks
- Added static file fallback middleware for missing images
- Enhanced error handling and monitoring
- Improved security headers and CORS configuration

## 📝 Environment Configuration

### Frontend (.env)
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_WS_URL=ws://localhost:8001
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Production 
NEXT_PUBLIC_API_URL=https://api.bidy.vn
NEXT_PUBLIC_WS_URL=wss://api.bidy.vn
NEXT_PUBLIC_APP_URL=https://bidy.vn
```

### Backend (.env)
```env
NODE_ENV=development
PORT=8001
MONGODB_URI=mongodb://localhost:27017/bidy_auction
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Client URLs for CORS
CLIENT_URL=http://localhost:3001
CLIENT_URL_PROD=https://bidy.vn
CLIENT_URL_PROD_WWW=https://www.bidy.vn

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret  
AWS_S3_BUCKET=your_bucket_name
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

### Frontend
```bash
cd fe
npm run test        # Unit tests  
npm run test:e2e    # Playwright E2E tests
```

### Backend
```bash
cd be  
npm test           # Jest unit tests
npm run test:coverage  # Coverage report
```

## 📊 Development Workflow

1. **Development**: Run both frontend and backend locally
2. **Testing**: Automated testing with Jest and Playwright
3. **Linting**: ESLint with automatic fixing
4. **Git Hooks**: Pre-commit validation and testing
5. **CI/CD**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] AWS SDK v3 migration (before Sept 2025)
- [ ] CDN integration for static assets
- [ ] Advanced analytics dashboard
- [ ] Mobile app development (React Native)
- [ ] Payment gateway integration
- [ ] Multi-language support expansion

---

**Made with ❤️ for the Vietnamese auction market**

🤖 Enhanced with [Claude Code](https://claude.ai/code)