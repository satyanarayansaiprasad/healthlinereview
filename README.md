# HealthHub Pro - Premium Health Content Platform

A full-scale, SEO-optimized health content publishing platform built with Next.js 14, TypeScript, and Prisma.

## Features

- **Public Website**: High-performance, SEO-optimized public pages for articles, reviews, and categories.
- **Admin CMS**: Comprehensive dashboard for content management, user roles, comment moderation, and ad management.
- **SEO Ready**: Automatic sitemap generation, structured data (JSON-LD), and dynamic metadata.
- **Role-Based Auth**: Secure JWT authentication with SUPER_ADMIN, EDITOR, and WRITER roles.
- **Modern UI**: Clean, medical-style design using Tailwind CSS and Lucide icons.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React
- **Backend**: Next.js API Routes, PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT, BcryptJS

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database

### 2. Setup Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthdb?schema=public"
JWT_SECRET="your-super-secret-key"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Migration & Seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

The portal will be available at:
- Public Site: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin` (Login with `admin@healthhub.pro` / `admin123`)

## Deployment

This project is optimized for **Vercel**. 
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add your environment variables.
4. Deployment is automatic!

## License

MIT
