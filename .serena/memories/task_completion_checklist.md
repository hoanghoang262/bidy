# Task Completion Checklist

When completing any development task in the Bidy project, ensure the following steps are completed:

## Frontend Tasks

### 1. Code Quality
- [ ] Run `npm run lint` to check for linting errors
- [ ] Fix any ESLint warnings or errors
- [ ] Ensure TypeScript has no type errors (check with `npm run build`)

### 2. Testing
- [ ] Write/update unit tests for new functionality
- [ ] Run `npm run test` to ensure all tests pass
- [ ] Check test coverage with `npm run test:coverage`
- [ ] Run E2E tests if UI changes: `npm run test:e2e`

### 3. Build Verification
- [ ] Run `npm run build` to ensure production build succeeds
- [ ] Test the production build locally with `npm run start`
- [ ] Verify no console errors in browser

### 4. UI/UX Checks
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify dark mode compatibility
- [ ] Check accessibility (keyboard navigation, ARIA labels)
- [ ] Test with Vietnamese language content

## Backend Tasks

### 1. Code Quality
- [ ] Run `npm run lint` to check and auto-fix issues
- [ ] Ensure consistent code style following conventions
- [ ] Remove any console.log statements used for debugging

### 2. Testing
- [ ] Write/update unit tests for new endpoints/services
- [ ] Run `npm test` to ensure all tests pass
- [ ] Check coverage with `npm run test:coverage`
- [ ] Test API endpoints manually or with Postman

### 3. API Documentation
- [ ] Update Swagger documentation if API changes
- [ ] Verify documentation at `/api-docs` endpoint
- [ ] Ensure request/response examples are accurate

### 4. Database & Security
- [ ] Run database migrations if schema changed
- [ ] Verify input validation and sanitization
- [ ] Check authentication/authorization logic
- [ ] Test error handling and edge cases

## General Checklist

### 1. Version Control
- [ ] Review all changes with `git diff`
- [ ] Ensure no sensitive data in commits
- [ ] Write clear, descriptive commit message
- [ ] Push to feature branch, not directly to main

### 2. Environment & Configuration
- [ ] Update `.env.example` if new variables added
- [ ] Document any new environment requirements
- [ ] Verify both development and production configs work

### 3. Documentation
- [ ] Update README.md if setup steps changed
- [ ] Add comments for complex logic
- [ ] Update CLAUDE.md if architectural changes made
- [ ] Document any new features or API endpoints

### 4. Performance & Optimization
- [ ] Check for performance regressions
- [ ] Optimize images and assets
- [ ] Verify no memory leaks or infinite loops
- [ ] Test with realistic data volumes

### 5. Real-time Features
- [ ] Test Socket.io connections and events
- [ ] Verify real-time updates work correctly
- [ ] Check for race conditions in bidding logic
- [ ] Test chat functionality if modified

## Final Verification
1. Stop and restart both frontend and backend
2. Clear browser cache and test full user flow
3. Check browser console for any errors
4. Verify MongoDB queries are optimized
5. Test on different browsers if major changes

## Deployment Readiness
- [ ] All tests passing
- [ ] No linting errors
- [ ] Production build successful
- [ ] Environment variables documented
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation updated