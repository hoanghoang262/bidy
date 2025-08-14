# Suggested Commands for Development

## Frontend Commands (run from /fe directory)
```bash
# Development
npm run dev          # Start Next.js dev server with Turbopack on port 3001

# Building & Production
npm run build        # Build for production
npm run start        # Start production server on port 3001

# Quality & Testing  
npm run lint         # Run ESLint
npm run test         # Run Jest unit tests
npm run test:watch   # Run Jest in watch mode
npm run test:coverage # Generate test coverage report
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright with UI
```

## Backend Commands (run from /be directory)
```bash
# Development
npm start            # Start with nodemon on port 8000
npm run dev          # Alternative dev command with nodemon
npm run json-sv      # Start JSON server for mock data (port 8001)

# Quality & Testing
npm run lint         # Run ESLint with auto-fix
npm test            # Run Jest tests
npm run test:watch   # Run Jest in watch mode
npm run test:coverage # Generate test coverage report

# Environment
npm run validate-env # Validate environment variables
```

## Git Commands (Linux system)
```bash
git status          # Check current branch and changes
git add .           # Stage all changes
git commit -m "message" # Commit with message
git push            # Push to remote
git pull            # Pull from remote
git checkout -b feature-name # Create new branch
```

## System Commands (Linux)
```bash
ls -la              # List files with details
cd <directory>      # Change directory
grep -r "pattern" . # Search for pattern recursively
find . -name "*.js" # Find files by name pattern
ps aux | grep node  # Check running Node processes
lsof -i :3001      # Check what's using port 3001
kill -9 <PID>      # Force kill process
```

## MongoDB Commands
```bash
mongod              # Start MongoDB daemon
mongo               # Open MongoDB shell
mongosh             # Open MongoDB shell (newer version)
```

## Common Development Workflow
1. Start MongoDB: `mongod`
2. Start backend: `cd be && npm start`
3. Start frontend: `cd fe && npm run dev`
4. Open browser: http://localhost:3001
5. API docs: http://localhost:8000/api-docs

## Port Management
- Frontend: 3001 (dev & prod)
- Backend: 8000 (main API)
- JSON Server: 8001 (mock data)
- MongoDB: 27017 (default)

## Environment Setup
- Copy `.env.example` to `.env` in both /fe and /be directories
- Set JWT_SECRET (minimum 32 characters) in backend
- Configure MongoDB URI if not using localhost
- Set API URLs for frontend/backend communication