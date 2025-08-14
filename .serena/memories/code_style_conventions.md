# Code Style and Conventions

## Frontend (TypeScript/React)

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities/hooks: camelCase (e.g., `useAuth.ts`)
- Pages: lowercase with hyphens in App Router (e.g., `user-profile/page.tsx`)

### Code Organization
- Absolute imports with `@/` prefix
- Components use TypeScript with explicit type definitions
- React components use function components with TypeScript interfaces
- Form validation with Zod schemas
- State management with Redux Toolkit slices

### TypeScript Conventions
- Explicit type definitions for props, state, and function returns
- Interfaces for component props (e.g., `interface ButtonProps`)
- Type definitions in `/src/types/` directory
- Use `.d.ts` files for ambient type declarations

### Component Structure
```typescript
import { FC } from 'react';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

const Component: FC<ComponentProps> = ({ prop1, prop2 = 0 }) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};

export default Component;
```

### Styling
- Tailwind CSS utility classes
- Shadcn/ui component system with Radix UI
- CSS-in-JS avoided in favor of Tailwind
- Dark mode support with `dark:` prefix

## Backend (JavaScript/Node.js)

### File Naming
- Controllers: `*.controller.js`
- Services: `*.service.js`
- Routes: `*.route.js`
- Models: PascalCase in models directory

### Code Organization
- CommonJS modules (`require`/`module.exports`)
- MVC pattern with separation of concerns
- Feature-based directory structure
- Middleware in `/Middlewares` directory

### API Conventions
- RESTful endpoints
- JWT authentication in headers
- Request validation with Joi
- Consistent error handling with try-catch
- Response format: `{ success: boolean, data/error: ... }`

### Database Models (Mongoose)
```javascript
const mongoose = require('mongoose');

const SchemaName = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ModelName', SchemaName);
```

### Error Handling
- Centralized error handler middleware
- Consistent error response format
- Logging with proper error context
- Security-conscious error messages

## General Conventions

### Git Commit Messages
- Use conventional commits when possible
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep messages concise and descriptive

### Comments
- Minimal comments - code should be self-documenting
- JSDoc for complex functions in backend
- TypeScript types serve as documentation in frontend
- TODO comments for pending tasks

### Testing
- Unit tests with Jest
- E2E tests with Playwright (frontend)
- Test files: `*.test.js` or `*.spec.ts`
- Aim for >80% coverage on critical paths

### Security
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Input validation and sanitization
- CORS properly configured
- Rate limiting on API endpoints