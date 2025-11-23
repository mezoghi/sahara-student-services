# Sahara Student Services Platform

## 🎓 Overview

A comprehensive platform for managing educational consultation services for students interested in studying abroad. Built with modern technologies to provide a seamless experience for students, counselors, and administrators.

## ✨ Key Features

### For Students
- ✅ Secure registration and login
- ✅ Browse universities and study programs (10 UK universities + 20 programs)
- ✅ Multi-step application form with draft saving
- ✅ Upload required documents
- ✅ Dashboard to track application status
- ✅ Messaging system with counselors

### For Counselors & Administrators
- ✅ Comprehensive CRM dashboard
- ✅ Detailed statistics and reports
- ✅ Manage student applications
- ✅ Update application status with email notifications
- ✅ Review uploaded documents
- ✅ Messaging system with students
- ✅ User management (administrators only)

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express** - API server
- **TypeScript** - Programming language
- **PostgreSQL** - Database
- **Prisma ORM** - Database management
- **JWT** - Authentication and authorization
- **AWS S3** - File storage
- **Nodemailer** - Email sending
- **Swagger** - API documentation
- **Jest** - Testing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Programming language
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Hook Form** - Form management
- **SWR** - Data fetching
- **Playwright** - E2E testing

## 📦 Project Structure

```
sahara-student-services/
├── backend/              # API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Middleware
│   │   └── utils/        # Utilities
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.ts       # Seed data
│   └── tests/            # Tests
│
├── frontend/             # User interface
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   └── lib/          # Helper libraries
│   └── tests/e2e/        # E2E tests
│
└── Documentation/        # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Install Project

```bash
# Clone the project
git clone https://github.com/mezoghi/sahara-student-services.git
cd sahara-student-services

# Install all packages
npm run install:all
```

### 2. Setup Database

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update DATABASE_URL in .env file
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/sahara_db"

# Create database
createdb sahara_db

# Run migrations
npx prisma migrate dev

# Add seed data
npm run seed
```

### 3. Setup Frontend

```bash
cd ../frontend

# Copy environment file
cp .env.local.example .env.local

# Default values work for local development
```

### 4. Run Project

```bash
# From root directory
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:5000/api-docs

## 🔐 Demo Credentials

### Admin Account
- Email: `admin@saharastudentservices.com`
- Password: `Admin@123`

### Counselor Account
- Email: `counsellor@saharastudentservices.com`
- Password: `Admin@123`

### Student Account
- Email: `student@example.com`
- Password: `Admin@123`

⚠️ **Important**: Change these passwords in production!

## 📊 Seed Data

The following data is automatically added:

### Users (3)
- System administrator
- Educational counselor
- Test student

### Universities (10)
- University of Oxford
- University of Cambridge
- Imperial College London
- London School of Economics
- University College London
- University of Edinburgh
- University of Manchester
- King's College London
- University of Warwick
- University of Bristol

### Study Programs (20)
- Two programs per university
- Mix of Bachelor's and Master's programs
- Various specializations: Computer Science, Business Administration, Engineering, Medicine, Law, etc.

## 🧪 Testing

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

## 📚 Documentation

- **README.md** - Main documentation (English)
- **README_AR.md** - Arabic version
- **QUICKSTART.md** - Quick start guide
- **SETUP_CHECKLIST.md** - Setup checklist
- **DEPLOYMENT.md** - Production deployment guide
- **PROJECT_SUMMARY.md** - Project summary
- **STRUCTURE.md** - File structure explanation
- **CONTRIBUTING.md** - Contribution guide

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect project to Vercel
3. Set environment variables
4. Deploy automatically

### Backend (Railway or Render)
1. Connect project to Railway/Render
2. Set environment variables
3. Add PostgreSQL database
4. Deploy

### Full Details
See `DEPLOYMENT.md` file for detailed instructions.

## 🔒 Security

- ✅ Password encryption using bcrypt
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ CORS protection
- ✅ Helmet.js security
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ Signed URLs for file downloads

## 📈 Statistics

- **Total Files**: 60+ files
- **Lines of Code**: 8,500+ lines
- **API Endpoints**: 30+ endpoints
- **Pages**: 15+ pages
- **Components**: 10+ reusable components
- **Tests**: Unit tests + E2E

## 🎨 Design System

### Colors
- **Primary**: #082d46 (Deep Blue)
- **Secondary**: #c00101 (Red)
- **Background**: White and light gray
- **Text**: Dark gray

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 600-700
- **Body**: Regular, 400

## 🤝 Contributing

We welcome contributions! Please read `CONTRIBUTING.md` for details.

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 📞 Support

- **Email**: support@saharastudentservices.com
- **GitHub Issues**: Open an issue to report a problem
- **Documentation**: Check documentation files

## 🎯 Next Steps

1. ✅ Follow `QUICKSTART.md` to set up development environment
2. ✅ Use `SETUP_CHECKLIST.md` to verify each step
3. ✅ Read `DEPLOYMENT.md` when ready to deploy
4. ✅ Customize the application to your needs
5. ✅ Deploy and share with users!

## 🌟 Upcoming Features (Optional)

- [ ] Integrated payment system
- [ ] Live chat
- [ ] Mobile application
- [ ] Advanced reporting
- [ ] University system integration
- [ ] Multi-language support
- [ ] Advanced notification system

## 🙏 Acknowledgments

This project was built using best practices and modern technologies to provide a reliable and secure platform for educational consultation services.

---

**Developed by**: Sahara Student Services Team
**Version**: 1.0.0
**Date**: November 2024

🚀 **Project Ready for Use!**
