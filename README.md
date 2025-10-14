# Snozxyx Portfolio

## Overview

A modern, dark-themed portfolio website for Gabhasti Giri (Snozxyx), a software developer and gaming enthusiast. The portfolio showcases projects, skills, blog posts, and provides contact information. Built with a full-stack architecture featuring React frontend with Vite, Express backend, and PostgreSQL database using Drizzle ORM.

The design philosophy balances professional tech aesthetics with gaming culture vibrancy, using a sophisticated dark color palette with white and orange accents, smooth animations, and purposeful micro-interactions.

## Key Features

### 🔐 Role-Based Access Control (RBAC)

**Four User Roles:**
- **Admin** - Full control over the entire platform, including user management, site settings, and all content
- **Editor** - Can create, edit, and publish posts; can review posts from authors
- **Author** - Can create and edit their own posts; submit posts for editorial review
- **Reader** - Can view, like, and comment on published posts

**User Management:**
- Ban users to prevent access
- Mute users to prevent commenting
- Toggle posting permissions
- Change user roles dynamically

### 📢 Announcement System

**Flexible Announcement Types:**
- **Info** - General information and updates
- **Warning** - Important notices that need attention
- **Alert** - Critical messages requiring immediate awareness

**Display Options:**
- **Banner** - Top-of-page dismissible banners
- **Popup** - Modal popups for important announcements
- **Notification** - In-app notification center (coming soon)

**Features:**
- Create, edit, and delete announcements
- Toggle announcements active/inactive
- Set start and end dates for time-limited announcements
- Real-time display to all users

### 🛠️ Global Site Settings

**Maintenance Mode:**
- Toggle site-wide maintenance mode
- Custom maintenance message
- Admin bypass (admins can access site during maintenance)

**SEO & Branding:**
- Site title and description
- Custom logo and favicon
- Open Graph image for social sharing
- Custom footer message

### 📝 Blog System with Editorial Workflow

**Post Status Management:**
- **Draft** - Work in progress, not visible to others
- **Pending Review** - Submitted by authors for editor review
- **Approved** - Reviewed and approved by editors
- **Published** - Live and visible to all users
- **Rejected** - Rejected by editors with feedback

**Features:**
- SEO-friendly URLs with auto-generated slugs
- Rich text content with markdown support
- Cover images and excerpts
- Tag and category system
- Star/like system
- Comment system with moderation
- View counter and read time estimation

### 🎨 Modern Design & UX

- Dark mode by default with sophisticated color palette
- Smooth animations with Framer Motion
- Particle background effects
- Responsive mobile-first design
- Glassmorphic UI elements
- Scroll-triggered animations
- Accessible components with Radix UI

### 🚀 Production-Ready

- Vercel-compatible deployment configuration
- PostgreSQL with Drizzle ORM
- Session-based authentication with bcrypt
- Type-safe API with Zod validation
- Built-in security features
- Performance optimized

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (no React Router)

**UI Component Library:**
- Shadcn UI (New York variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark mode as the default theme

**State Management:**
- TanStack Query (React Query) for server state management
- React Context API for authentication state
- No global state management library (Redux/Zustand)

**Design System:**
- Typography: Source Code Pro (body), Poppins (headings), Inter (code)
- Color Palette: Rich dark grays (#0a0a0a background), white primary accent, orange gaming accent (#ff6b35)
- Custom CSS variables defined in index.css for theming
- Tailwind config extended with custom border radius and color tokens

**Key Libraries:**
- Framer Motion for animations and scroll effects
- React Typed for typing animations
- TSParticles for particle background effects
- React Hook Form + Zod for form validation
- React Intersection Observer for scroll-triggered animations

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system (type: "module")
- Session-based authentication using express-session with MemoryStore

**API Structure:**
- RESTful API design
- Routes organized in `/api` namespace:
  - `/api/auth/*` - Authentication endpoints (register, login, logout)
  - `/api/projects/*` - Project CRUD operations
  - `/api/skills/*` - Skills CRUD operations
  - `/api/blog/posts/*` - Blog post management
  - `/api/blog/posts/:id/comments` - Comment system
  - `/api/blog/posts/:id/star` - Post starring feature

**Development Setup:**
- Vite middleware mode for HMR in development
- Production builds serve static files from dist/public
- Replit-specific plugins for error overlay and dev tools

### Data Storage

**Database:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database operations
- Schema-first approach with migrations in `/migrations` directory

**Schema Design:**
- `users` table: Authentication and user profiles (username, email, hashed passwords with bcrypt)
- `projects` table: Portfolio projects with tech stack, features, URLs, images
- `skills` table: Technical skills categorized by type with proficiency levels
- `blog_posts` table: Blog content with slug (SEO-friendly URLs), tags, publish status, star count, views
- `blog_comments` table: Comment system linked to posts
- `post_stars` table: Track user stars on blog posts (many-to-many relationship)

**Storage Implementation:**
- IStorage interface defines data access contract
- MemStorage class provides in-memory implementation for development
- All operations return Promises for async compatibility
- Separate types for insert operations vs. full entities

### Authentication & Authorization

**Authentication Strategy:**
- Session-based authentication (not JWT)
- Bcrypt for password hashing (10 salt rounds)
- HTTP-only cookies for session management
- Session secret configurable via environment variable

**User Flow:**
- Registration creates user with hashed password
- Login validates credentials and creates session
- Logout destroys session
- `/api/auth/me` endpoint returns current user or null
- Frontend AuthContext wraps authentication state

**Authorization:**
- User ID stored in session for authenticated requests
- Blog post authorship verified by authorId field
- Role-based access control (RBAC) with 4 roles: admin, editor, author, reader
- Middleware for role-specific route protection (requireAdmin, requireEditor, requireAuthor)
- User status checks (banned, muted, can post)
- Dynamic permission system based on user role and status

## External Dependencies

### Third-Party Services

**Database:**
- Neon Serverless PostgreSQL (requires DATABASE_URL environment variable)
- Drizzle Kit for schema migrations

**Development Tools:**
- Replit-specific plugins (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)
- These plugins only load in Replit environment (REPL_ID check)

### Key NPM Packages

**Frontend:**
- @tanstack/react-query: Server state management
- framer-motion: Animation library
- react-typed: Typing animations
- @tsparticles/react + @tsparticles/slim: Particle effects
- wouter: Lightweight routing
- @hookform/resolvers + zod: Form validation
- react-intersection-observer: Scroll animations
- All @radix-ui/* packages: Unstyled accessible components

**Backend:**
- express + express-session: Server and session management
- memorystore: Session storage (development)
- bcryptjs: Password hashing
- drizzle-orm + drizzle-kit: Database ORM and migrations
- @neondatabase/serverless: PostgreSQL driver

**Build Tools:**
- vite + @vitejs/plugin-react: Build tooling
- esbuild: Server bundle production build
- tsx: TypeScript execution for development
- tailwindcss + autoprefixer: Styling

### Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string (validated in drizzle.config.ts)
- `SESSION_SECRET`: Session encryption key (defaults to 'dev-secret-change-in-production')

Optional:
- `NODE_ENV`: Environment mode (development/production)
- `REPL_ID`: Replit environment detection

## Recent Changes (October 2025)

### Blog System Enhancements

**SEO-Friendly URLs (Slug Feature):**
- Added `slug` field to `blog_posts` table (unique, auto-generated from titles)
- Slug generation: converts title to lowercase, replaces non-alphanumeric chars with hyphens
- Automatic uniqueness check with counter suffix if needed (e.g., "my-post", "my-post-1")
- Updated all blog URLs to use slugs instead of IDs (`/blog/{slug}` instead of `/blog/{id}`)
- Backend routes support both ID and slug lookups for backward compatibility
- Create/edit mutations properly handle slug in redirect URLs

**Mobile Responsiveness Improvements:**
- Blog list page: Reduced padding on mobile (`px-4 md:px-6`), adjusted heading sizes (`text-xl md:text-2xl`)
- Blog post page: Converted two-column layout to single column on mobile (`flex-col lg:flex-row`)
- Table of Contents: Hidden on mobile/tablet, visible on desktop only (`hidden lg:block`)
- Blog create/edit pages: Mobile-friendly padding and form layouts
- Card padding: Responsive padding (`p-4 md:p-6`, `p-4 md:p-8`)
- Cover images: Responsive height (`h-48 md:h-64`)

**Technical Updates:**
- Fixed TypeScript errors in blog create/edit mutation handlers
- Updated storage layer to generate and handle slugs
- Maintained backward compatibility for ID-based lookups
- All blog-related components now mobile-first responsive
