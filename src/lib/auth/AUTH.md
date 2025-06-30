# Authentication System Documentation

## Overview

The Tumaini Fitness Management System implements a robust authentication system using NextAuth.js with credential-based authentication. The system supports role-based access control (RBAC) with two user roles: ADMIN and MEMBER.

## Architecture

### Core Components

1. **Configuration (`config.ts`)**
   - NextAuth.js configuration
   - Credential provider setup
   - Session and JWT handling
   - Custom callbacks for token and session management

2. **Server Utilities (`server.ts`)**
   - Server-side authentication helpers
   - Role verification
   - Session management
   - Protected route handlers

3. **Client Utilities (`client.ts`)**
   - Custom hooks for authentication state
   - Role-based access control hooks
   - TypeScript type definitions

4. **Shared Utilities (`utils.ts`)**
   - Password hashing (bcrypt)
   - Password validation
   - Rate limiting
   - Email validation

## Features

### Security

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Strong password requirements:
     - Minimum 8 characters
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number
     - At least one special character

2. **Rate Limiting**
   - 5 attempts per 15 minutes
   - IP-based tracking
   - Per-user email tracking

3. **Session Management**
   - JWT-based sessions
   - 24-hour session duration
   - Secure session storage

### Authentication Flow

1. **Sign In**
   - Email and password validation
   - Rate limit checking
   - Password verification
   - JWT token generation
   - Session creation

2. **Session Handling**
   - JWT token refresh
   - Role persistence
   - User data availability

3. **Sign Out**
   - Session cleanup
   - Cache clearing
   - Secure token invalidation

## Route Protection

### Middleware Protection

1. **API Routes**
   - Public routes: `/api/auth/*`, `/api/admin/create`, `/api/test-auth`
   - Protected routes requiring authentication
   - Admin-only routes

2. **Dashboard Routes**
   - Authentication required for all dashboard access
   - Role-based access control for admin sections
   - Automatic redirects for unauthorized access

### Role-Based Access

1. **Admin Access**
   - Full system access
   - Member management
   - Payment processing
   - Report generation

2. **Member Access**
   - Limited dashboard access
   - Personal information management
   - Subscription viewing

## Usage Examples

### Client-Side Hooks

```typescript
// Check authentication status
const { data: session, isPending } = useSession();

// Get current user
const { user, isAuthenticated } = useUser();

// Role checking
const isAdmin = useIsAdmin();
const isMember = useIsMember();
```

### Server-Side Protection

```typescript
// Require authentication
const user = await requireAuth();

// Require admin access
const admin = await requireAdmin();

// Check roles
const isUserAdmin = await hasRole("ADMIN");
```

## Error Handling

1. **Authentication Errors**
   - Invalid credentials
   - Rate limit exceeded
   - Missing required fields
   - Password validation failures

2. **Authorization Errors**
   - Insufficient permissions
   - Invalid tokens
   - Expired sessions

## Best Practices

1. Always use the provided hooks and utilities
2. Implement proper error handling
3. Follow the role-based access control patterns
4. Use rate limiting for sensitive operations
5. Validate user input thoroughly
6. Keep security dependencies updated

## Testing

Use the `/api/test-auth` endpoint for testing authentication:

- Password verification
- Hash comparison
- Token generation
- Session management
