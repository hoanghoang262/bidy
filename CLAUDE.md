# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bidy is a Vietnamese online auction platform with a modern tech stack:

**Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Radix UI components
**Backend**: Node.js with Express.js and MongoDB (using Mongoose)
**Real-time**: Socket.io for live bidding and chat functionality
**Architecture**: Monorepo with separate `/fe` (frontend) and `/be` (backend) directories

## Development Commands

### Frontend (`/fe`)
```bash
cd fe
npm run dev          # Start dev server with Turbopack (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (`/be`)
```bash
cd be
npm start            # Start development server with nodemon (localhost:8000)
npm run json-sv      # Start JSON server for mock data (port 8001)
```

## Key Architecture Patterns

### Frontend Architecture
- **App Router**: Uses Next.js 13+ app directory structure
- **State Management**: Redux Toolkit with redux-persist for auth state
- **Data Fetching**: TanStack Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component system
- **Authentication**: JWT tokens stored in cookies with automatic refresh
- **Theme**: Dark/light mode support with next-themes

### Backend Architecture
- **MVC Pattern**: Controllers, services, and models separated by feature
- **Component Structure**: Each feature has its own directory with:
  - `*.controller.js` - Route handlers
  - `*.service.js` - Business logic
  - `*.route.js` - Route definitions
  - `models/` - Mongoose schemas
- **Real-time**: Socket.io integration for bidding and chat
- **Background Jobs**: Cron jobs for auction management (`cronJob.js`)
- **Middleware**: JWT authentication (`authen.middleware.js`) and file uploads

### Key Components
- **Auction System**: Bid management with real-time updates and auto-bidding
- **User Management**: Authentication, profiles, and seller verification
- **Chat System**: Real-time messaging between buyers and sellers
- **Admin Panel**: Dashboard for managing auctions, users, and categories
- **File Upload**: AWS S3 integration for image handling

## Database Schema
MongoDB collections managed through Mongoose models:
- `User` - User accounts and profiles
- `Bid` - Auction items with bidding history
- `Category` - Product categories
- `Message/Conversation` - Chat system
- `Order` - Transaction records
- `Cart/Wishlist` - User shopping data

## Environment Configuration
Backend requires:
- `JWT_SECRET` - For token signing
- `NEXT_PUBLIC_API_URL` - API endpoint (defaults to localhost:8000)
- MongoDB connection string (currently hardcoded in `/be/util/mongoose.js`)

## Development Notes
- Frontend uses absolute imports with `@/` prefix
- Backend uses CommonJS modules
- Socket.io CORS configured for localhost:3000 and production domains
- Swagger documentation available at `/api-docs` endpoint
- File uploads stored in `/be/uploads/` directory
- Cron job runs every second for auction state management