# Deployment Guide - Snozxyx Portfolio

## Overview

This guide covers deploying the Snozxyx Portfolio application to production environments, including Vercel and other platforms. The application uses PostgreSQL as its production database and supports both traditional PostgreSQL and serverless PostgreSQL solutions like Neon.

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Neon, Supabase, or traditional PostgreSQL)
- Vercel CLI (for Vercel deployment)

## Environment Variables

### Required Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Session Secret (use a strong random string in production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Node Environment
NODE_ENV=production
```

### Optional Variables

```env
# Replit Environment Detection (auto-detected)
REPL_ID=

# Port (defaults to 5000)
PORT=5000
```

## Database Setup

### Option 1: Neon (Recommended for Vercel)

1. Create a Neon account at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Add to your environment variables:

```env
DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

### Option 2: Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Add to your environment variables:

```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### Option 3: Traditional PostgreSQL

1. Install PostgreSQL on your server
2. Create a database:

```sql
CREATE DATABASE portfolio;
```

3. Create a user and grant permissions:

```sql
CREATE USER portfolio_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
```

4. Configure your connection string:

```env
DATABASE_URL=postgresql://portfolio_user:secure_password@localhost:5432/portfolio
```

### Option 4: MongoDB Atlas (Alternative)

While the application is designed for PostgreSQL, you can adapt it to use MongoDB:

1. Create a MongoDB Atlas account at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get your connection string
4. Update the storage layer to use MongoDB instead of PostgreSQL (requires code changes)

**Note:** The current implementation uses Drizzle ORM with PostgreSQL. To use MongoDB, you'll need to:
- Install MongoDB drivers: `npm install mongodb mongoose`
- Rewrite the storage layer in `server/storage.ts`
- Update schema definitions to use MongoDB schemas

## Running Migrations

Before deploying, run database migrations to set up the schema:

```bash
npm run db:push
```

This will create all necessary tables:
- `users` - User accounts with roles (admin, editor, author, reader)
- `blog_posts` - Blog content with status tracking
- `blog_comments` - Comments on blog posts
- `post_stars` - User stars/likes on posts
- `projects` - Portfolio projects
- `skills` - Skills showcase
- `site_settings` - Global site configuration
- `announcements` - Site-wide announcements

## Deployment to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables

Add your environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `NODE_ENV=production`

### Step 4: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

The `vercel.json` file is already configured for optimal deployment:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": "dist/public",
  "functions": {
    "api/index.js": {
      "runtime": "nodejs20.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration:
- Builds the application using `npm run build`
- Serves static assets from `dist/public` via Vercel's CDN
- Routes API requests (`/api/*`) to a Node.js 20.x serverless function
- Handles client-side routing by serving `index.html` for all non-API routes
- The serverless function is defined in `api/index.js` which wraps the Express app

**Note:** The application has been refactored to support both traditional server deployment (Railway, VPS) and serverless deployment (Vercel). The Express server automatically detects the environment and adjusts accordingly.

## Deployment to Other Platforms

### Railway

1. Create a Railway account
2. Create a new project from GitHub
3. Add PostgreSQL service
4. Configure environment variables
5. Deploy

```bash
# Railway CLI
railway login
railway link
railway up
```

### Render

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Add PostgreSQL database
5. Configure environment variables:
   - Build Command: `npm run build`
   - Start Command: `npm start`

### DigitalOcean App Platform

1. Create a DigitalOcean account
2. Go to App Platform
3. Create app from GitHub
4. Add PostgreSQL database
5. Configure environment variables
6. Deploy

### Traditional VPS (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Clone repository
git clone <your-repo-url>
cd Portfolio

# Install dependencies
npm install

# Set up environment variables
nano .env

# Run migrations
npm run db:push

# Build application
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start npm --name "portfolio" -- start

# Set up PM2 to start on boot
pm2 startup
pm2 save
```

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
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

## Default Admin Account

On first deployment, a default admin account is created:

```
Username: admin
Password: admins
```

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Change default admin password
- [ ] Test user registration
- [ ] Test blog post creation
- [ ] Test announcement system
- [ ] Verify role-based access control
- [ ] Test maintenance mode
- [ ] Configure site settings (title, description, logo)
- [ ] Set up proper session secret
- [ ] Enable HTTPS/SSL
- [ ] Configure custom domain
- [ ] Set up backups for database
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

## Security Considerations

### Session Secret

Generate a strong session secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### Database Security

- Use SSL/TLS for database connections
- Restrict database access to your application's IP
- Use strong passwords
- Regular backups
- Enable connection pooling

### Application Security

- Keep dependencies updated: `npm audit fix`
- Use HTTPS in production
- Implement rate limiting
- Set secure session cookies
- Enable CORS properly
- Sanitize user inputs (already implemented)

## Monitoring and Logging

### Application Logs

The application logs to stdout. In production:

```bash
# View PM2 logs
pm2 logs portfolio

# Or use log management services
# - Vercel: Built-in logging
# - Railway: Built-in logging
# - Render: Built-in logging
```

### Database Monitoring

- Monitor connection pool usage
- Track slow queries
- Set up alerts for errors
- Monitor disk space

## Scaling Considerations

### Horizontal Scaling

The application is stateless (session data in PostgreSQL) and can be scaled horizontally:

1. Use a load balancer (Nginx, HAProxy, or platform-provided)
2. Run multiple instances
3. Share session storage (consider Redis for sessions)
4. Use a CDN for static assets

### Database Scaling

- Enable connection pooling (already configured with Neon)
- Use read replicas for heavy read workloads
- Consider database caching (Redis)
- Monitor and optimize queries

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npm run check

# Check environment variables
echo $DATABASE_URL
```

### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

### Runtime Errors

```bash
# Check logs
pm2 logs portfolio

# Restart application
pm2 restart portfolio

# View detailed error
NODE_ENV=development npm start
```

## Support and Resources

- GitHub Issues: [Repository Issues](https://github.com/Snozxyx/Portfolio/issues)
- Documentation: See README.md
- Drizzle ORM Docs: [https://orm.drizzle.team](https://orm.drizzle.team)
- Neon Docs: [https://neon.tech/docs](https://neon.tech/docs)
- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
