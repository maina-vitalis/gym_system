# Production Deployment Guide

## Overview

This guide covers deploying the Gym Management System to production with proper authentication and data fetching capabilities.

## ✅ Fixed Production Issues

### 1. **Data Fetching Fixed**

- **Issue**: Hardcoded URLs pointing to `"https://your-domain.com"` in API clients
- **Solution**: Updated all API clients to use relative URLs that work in both development and production
- **Files Fixed**:
  - `src/lib/api-client.ts`
  - `src/hooks/use-membership-plans.ts`
  - `src/hooks/use-payments.ts`

### 2. **Authentication System**

- Professional bcrypt password hashing
- Rate limiting protection
- Server-side route protection
- Role-based access control

## Environment Configuration

### Required Environment Variables

Create a `.env` file in production with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secure-secret-key-minimum-32-characters"
NEXTAUTH_URL="https://yourdomain.com"

# M-Pesa Configuration (Optional)
MPESA_ENVIRONMENT="production"
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"
MPESA_SHORTCODE="your_shortcode"
MPESA_PASSKEY="your_passkey"
MPESA_CALLBACK_URL="https://yourdomain.com/api/payments/callback"

# Business Information
BUSINESS_NAME="Your Gym Name"
BUSINESS_SHORT_NAME="YGN"
```

### Critical Environment Variables

1. **NEXTAUTH_SECRET**: Generate a secure secret:

   ```bash
   openssl rand -base64 32
   ```

2. **NEXTAUTH_URL**: Must match your production domain exactly

3. **DATABASE_URL**: Your production PostgreSQL connection string

## Deployment Steps

### 1. Database Setup

```bash
# Run database migrations
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 2. Build Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 3. Start Production Server

```bash
# Start the production server
npm start
```

### 4. Initial Setup

1. Navigate to your production domain
2. You'll be redirected to `/setup`
3. Create your first admin user
4. Sign in and start using the system

## Platform-Specific Deployment

### Vercel Deployment

1. **Environment Variables**: Set in Vercel dashboard
2. **Database**: Use Vercel Postgres or external PostgreSQL
3. **Domain**: Configure custom domain in Vercel settings

```bash
# Deploy to Vercel
npx vercel --prod
```

### Railway Deployment

1. **Environment Variables**: Set in Railway dashboard
2. **Database**: Use Railway PostgreSQL addon
3. **Domain**: Use Railway-provided domain or custom domain

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Security Checklist

### ✅ Authentication Security

- [x] Bcrypt password hashing (12 salt rounds)
- [x] Rate limiting on login attempts
- [x] Strong password requirements
- [x] JWT session management
- [x] Server-side route protection

### ✅ API Security

- [x] Middleware-based authentication
- [x] Role-based access control
- [x] Input validation with Zod
- [x] CSRF protection via NextAuth

### ✅ Production Security

- [ ] HTTPS enabled (configure on your hosting platform)
- [ ] Secure environment variables
- [ ] Database connection encryption
- [ ] Regular security updates

## Performance Optimizations

### 1. **Database Optimization**

- Connection pooling enabled via Prisma
- Indexed database queries
- Efficient data fetching patterns

### 2. **Caching Strategy**

- React Query for client-side caching
- API response caching where appropriate
- Static asset optimization

### 3. **Bundle Optimization**

- Next.js automatic code splitting
- Tree shaking for unused code
- Optimized production builds

## Monitoring & Maintenance

### 1. **Health Checks**

- API endpoint monitoring
- Database connection monitoring
- Authentication service monitoring

### 2. **Logging**

- Error logging in production
- Authentication attempt logging
- Performance monitoring

### 3. **Backup Strategy**

- Regular database backups
- Environment variable backups
- Application code versioning

## Troubleshooting

### Common Production Issues

1. **Data Not Loading**

   - ✅ **Fixed**: Removed hardcoded URLs, now uses relative paths
   - Check network tab for API call failures
   - Verify authentication tokens

2. **Authentication Issues**

   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Ensure database is accessible

3. **Database Connection**

   - Verify `DATABASE_URL` is correct
   - Check database server is running
   - Ensure network connectivity

4. **Environment Variables**
   - All required variables are set
   - No trailing spaces or quotes
   - Restart application after changes

### Debug Commands

```bash
# Check environment variables
npm run env-check

# Test database connection
npx prisma db pull

# Verify build
npm run build

# Check for TypeScript errors
npm run type-check
```

## Migration from Development

### 1. **Data Migration**

- Export development data if needed
- Run database migrations
- Import essential data (membership plans, etc.)

### 2. **User Migration**

- Users must register new accounts
- Old hardcoded credentials are removed
- Admin setup required on first deployment

### 3. **Configuration Updates**

- Update all environment variables
- Configure production domains
- Set up monitoring and alerts

## Support & Maintenance

### Regular Tasks

1. **Security Updates**: Keep dependencies updated
2. **Database Maintenance**: Regular backups and optimization
3. **Monitoring**: Check logs and performance metrics
4. **User Management**: Monitor authentication attempts

### Emergency Procedures

1. **Database Issues**: Have backup restoration procedure
2. **Authentication Problems**: Admin user recovery process
3. **Performance Issues**: Scaling and optimization procedures

## Success Metrics

After deployment, verify:

- ✅ All API endpoints respond correctly
- ✅ Authentication works properly
- ✅ Data loads without errors
- ✅ User registration functions
- ✅ Admin setup completes successfully
- ✅ Role-based access works
- ✅ Rate limiting is active

Your gym management system is now production-ready with professional authentication and reliable data fetching! 🚀
