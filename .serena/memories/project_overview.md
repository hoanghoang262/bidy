# Bidy Project Overview

## Purpose
Bidy is a Vietnamese online auction platform designed for the Vietnamese market. It provides real-time bidding, chat functionality, and comprehensive auction management features.

## Tech Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Radix UI components
- **State Management**: Redux Toolkit + redux-persist + TanStack Query
- **Real-time**: Socket.io-client
- **Authentication**: JWT with cookie storage and automatic refresh
- **Theme**: Dark/light mode support with next-themes
- **Forms**: react-hook-form with zod validation

### Backend (Node.js)
- **Runtime**: Node.js with CommonJS modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for bidding and chat
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3 (optional) or local uploads directory
- **Background Jobs**: node-cron for auction state management
- **API Documentation**: Swagger UI at /api-docs
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet for headers, CORS configuration

## Project Structure
```
bidy/
├── fe/                 # Frontend (Next.js 15 + TypeScript)
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities and helpers
│   │   └── types/     # TypeScript type definitions
│   └── public/        # Static assets
├── be/                 # Backend (Node.js + Express)
│   ├── user_components/    # User-related features
│   ├── auction_component/  # Auction-related features
│   ├── chat/              # Chat system
│   ├── admin/             # Admin panel
│   ├── util/              # Utilities and middleware
│   └── Middlewares/       # Express middleware
└── docs/              # Documentation files
```

## Key Features
- Real-time bidding with Socket.io
- Live chat between buyers and sellers
- Auto-bidding functionality
- Admin dashboard for comprehensive management
- Mobile-responsive design optimized for Vietnamese users
- ChợTốt-inspired colorful category design
- Multi-language support (Vietnamese primary)
- Seller verification system
- Wishlist and cart functionality
- Order history tracking

## Environment Configuration
- Frontend runs on port 3001 (development)
- Backend runs on port 8000 (development) 
- MongoDB on default port 27017
- WebSocket connections for real-time features
- JWT tokens for authentication
- AWS S3 integration optional for file uploads