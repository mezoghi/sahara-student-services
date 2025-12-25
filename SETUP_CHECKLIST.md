# Setup Checklist

Use this checklist to set up Sahara Student Services step by step.

## ✅ Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL 14+ installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## ✅ Initial Setup

### 1. Clone Repository
- [ ] Clone or download the project
- [ ] Navigate to project directory: `cd sahara-student-services`
- [ ] Verify files are present: `ls` or `dir`

### 2. Install Dependencies
- [ ] Run: `npm run install:all`
- [ ] Wait for all packages to install (may take 2-5 minutes)
- [ ] Verify no errors in installation

## ✅ Database Setup

### 3. PostgreSQL Configuration
- [ ] Ensure PostgreSQL is running
- [ ] Create database: `createdb sahara_db`
- [ ] Or use existing database
- [ ] Note your database credentials

### 4. Backend Environment
- [ ] Navigate to backend: `cd backend`
- [ ] Copy environment file: `cp .env.example .env`
- [ ] Open `.env` in editor
- [ ] Update `DATABASE_URL`:
  ```
  DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/sahara_db"
  ```
- [ ] Update `JWT_SECRET` to a random string
- [ ] Save the file

### 5. Database Migration
- [ ] Run: `npx prisma generate`
- [ ] Run: `npx prisma migrate dev`
- [ ] Confirm migration completed successfully
- [ ] Check for any errors

### 6. Seed Database
- [ ] Run: `npm run seed`
- [ ] Verify output shows:
  - ✅ Admin user created
  - ✅ Counsellor user created
  - ✅ Sample student created
  - ✅ 10 schools created
  - ✅ 20 courses created
  - ✅ Form fields created

## ✅ Frontend Setup

### 7. Frontend Environment
- [ ] Navigate to frontend: `cd ../frontend`
- [ ] Copy environment file: `cp .env.local.example .env.local`
- [ ] Open `.env.local` in editor
- [ ] Verify `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Save the file

## ✅ Start Development

### 8. Start Servers
- [ ] Navigate to root: `cd ..`
- [ ] Run: `npm run dev`
- [ ] Wait for both servers to start
- [ ] Backend should show: `🚀 Server running on port 5000`
- [ ] Frontend should show: `Ready on http://localhost:3000`

### 9. Verify Backend
- [ ] Open browser to: http://localhost:5000/health
- [ ] Should see: `{"status":"OK","timestamp":"..."}`
- [ ] Open: http://localhost:5000/api-docs
- [ ] Should see Swagger documentation

### 10. Verify Frontend
- [ ] Open browser to: http://localhost:3000
- [ ] Should see Sahara Student Services homepage
- [ ] Navigation bar should be visible
- [ ] Click "Browse Courses" - should see courses
- [ ] Click "About" - should see about page

## ✅ Test Authentication

### 11. Test Login
- [ ] Click "Login" in navigation
- [ ] Enter admin credentials:
  - Email: `admin@saharastudentservices.com`
  - Password: `Admin@123`
- [ ] Click "Login"
- [ ] Should redirect to admin dashboard
- [ ] Should see "Admin Dashboard"

### 12. Test Registration
- [ ] Logout (if logged in)
- [ ] Click "Register"
- [ ] Fill in the form with test data
- [ ] Click "Register"
- [ ] Should redirect to student dashboard
- [ ] Should see "Welcome, [Your Name]!"

## ✅ Test Core Features

### 13. Test Course Browsing
- [ ] Click "Browse Courses"
- [ ] Should see list of courses
- [ ] Try filtering by "Undergraduate"
- [ ] Try filtering by "Postgraduate"
- [ ] Click "View Details" on a course
- [ ] Should see course information

### 14. Test Application Flow
- [ ] Login as student
- [ ] Browse courses and select one
- [ ] Click "Apply Now"
- [ ] Fill Step 1: Personal Information
- [ ] Click "Save Draft" - should save
- [ ] Click "Next Step"
- [ ] Fill Step 2: Academic Background
- [ ] Click "Save Draft"
- [ ] Click "Next Step"
- [ ] Skip document upload for now
- [ ] Click "Review & Submit"
- [ ] Review information
- [ ] Click "Submit Application"
- [ ] Should see success message
- [ ] Should redirect to dashboard
- [ ] Application should show "SUBMITTED" status

### 15. Test Admin Features
- [ ] Logout
- [ ] Login as admin
- [ ] Should see admin dashboard
- [ ] Check statistics are displayed
- [ ] Click "View All Applications"
- [ ] Should see submitted applications
- [ ] Click "Review" on an application
- [ ] Should see application details

## ✅ Optional: Advanced Setup

### 16. AWS S3 (Optional)
- [ ] Create AWS account
- [ ] Create S3 bucket
- [ ] Create IAM user with S3 access
- [ ] Update backend `.env`:
  ```
  AWS_REGION=us-east-1
  AWS_ACCESS_KEY_ID=your-key
  AWS_SECRET_ACCESS_KEY=your-secret
  S3_BUCKET_NAME=your-bucket
  ```
- [ ] Restart backend server
- [ ] Test file upload

### 17. Email Setup (Optional)
- [ ] Setup Gmail App Password or SendGrid
- [ ] Update backend `.env`:
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASSWORD=your-app-password
  EMAIL_FROM=noreply@saharastudentservices.com
  ```
- [ ] Restart backend server
- [ ] Test email notifications

## ✅ Testing

### 18. Run Backend Tests
- [ ] Navigate to backend: `cd backend`
- [ ] Run: `npm test`
- [ ] All tests should pass
- [ ] Check coverage report

### 19. Run Frontend Tests
- [ ] Navigate to frontend: `cd frontend`
- [ ] Run: `npm test`
- [ ] All tests should pass

### 20. Run E2E Tests (Optional)
- [ ] Ensure dev servers are running
- [ ] Navigate to frontend: `cd frontend`
- [ ] Run: `npm run test:e2e`
- [ ] Playwright will run automated tests
- [ ] All tests should pass

## ✅ Production Preparation

### 21. Security Checklist
- [ ] Change default admin password
- [ ] Update JWT_SECRET to strong random string
- [ ] Review CORS settings
- [ ] Enable HTTPS in production
- [ ] Set secure environment variables
- [ ] Review database permissions

### 22. Deployment Preparation
- [ ] Read DEPLOYMENT.md
- [ ] Choose hosting platforms:
  - [ ] Frontend: Vercel (recommended)
  - [ ] Backend: Railway or Render
  - [ ] Database: Railway PostgreSQL
- [ ] Prepare environment variables
- [ ] Test build locally: `npm run build`

## ✅ Documentation Review

### 23. Read Documentation
- [ ] README.md - Main documentation
- [ ] QUICKSTART.md - Quick setup guide
- [ ] DEPLOYMENT.md - Deployment instructions
- [ ] CONTRIBUTING.md - Contribution guidelines
- [ ] PROJECT_SUMMARY.md - Project overview
- [ ] STRUCTURE.md - File structure

## 🎉 Setup Complete!

If all checkboxes are checked, your development environment is ready!

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -l | grep sahara_db

# Create database if missing
createdb sahara_db
```

**Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

**Module Not Found**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Prisma Client Error**
```bash
cd backend
npx prisma generate
```

**Frontend Build Error**
```bash
cd frontend
rm -rf .next
npm run build
```

## 📞 Need Help?

- Check documentation files
- Review error messages carefully
- Search GitHub issues
- Contact: support@saharastudentservices.com

## 🚀 Next Steps

After setup is complete:

1. Explore the codebase
2. Customize for your needs
3. Add new features
4. Deploy to production
5. Share with users!

Happy coding! 🎊
