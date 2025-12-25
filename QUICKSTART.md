# Quick Start Guide

Get Sahara Student Services up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/sahara-student-services.git
cd sahara-student-services

# Install all dependencies
npm run install:all
```

### 2. Setup Backend

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env and update DATABASE_URL
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/sahara_db"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 3. Setup Frontend

```bash
cd ../frontend

# Create .env.local file
cp .env.local.example .env.local

# The default values should work for local development
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

From the root directory:

```bash
npm run dev
```

This will start both:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

## Access the Application

### Frontend
Open http://localhost:3000 in your browser

### API Documentation
Open http://localhost:5000/api-docs for Swagger documentation

### Default Login Credentials

**Admin Account:**
- Email: admin@saharastudentservices.com
- Password: Admin@123

**Counsellor Account:**
- Email: counsellor@saharastudentservices.com
- Password: Admin@123

**Student Account:**
- Email: student@example.com
- Password: Admin@123

⚠️ **Important:** Change these passwords in production!

## Test the Application

### 1. As a Student

1. Go to http://localhost:3000
2. Click "Register" and create a new account
3. Browse courses at http://localhost:3000/courses
4. Click on a course and "Apply Now"
5. Fill out the multi-step application form
6. Upload documents
7. Submit your application
8. View your application status in the dashboard

### 2. As an Admin

1. Login with admin credentials
2. View the admin dashboard at http://localhost:3000/admin/dashboard
3. See application statistics
4. Click "View All Applications"
5. Review student applications
6. Update application status

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists: `createdb sahara_db`

### Port Already in Use
- Backend (5000): Change PORT in backend/.env
- Frontend (3000): Next.js will prompt to use a different port

### Prisma Client Error
```bash
cd backend
npx prisma generate
```

### Module Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Check the documentation
- Open an issue on GitHub
- Contact: support@saharastudentservices.com

## Quick Commands Reference

```bash
# Install everything
npm run install:all

# Start both servers
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Run all tests
npm test

# Build for production
npm run build

# Database commands
cd backend
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma migrate reset   # Reset database
npm run seed              # Seed database
```

Happy coding! 🚀
