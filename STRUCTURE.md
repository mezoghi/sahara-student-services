# Project Structure

## Complete Directory Tree

```
sahara-student-services/
│
├── 📄 package.json                    # Root package.json for monorepo
├── 📄 README.md                       # Main documentation
├── 📄 QUICKSTART.md                   # Quick setup guide
├── 📄 DEPLOYMENT.md                   # Deployment instructions
├── 📄 CONTRIBUTING.md                 # Contribution guidelines
├── 📄 PROJECT_SUMMARY.md              # Project overview
├── 📄 LICENSE                         # MIT License
├── 📄 .gitignore                      # Git ignore rules
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 ci.yml                  # CI/CD pipeline
│
├── 📁 backend/                        # Backend API (Node.js + Express)
│   │
│   ├── 📄 package.json                # Backend dependencies
│   ├── 📄 tsconfig.json               # TypeScript configuration
│   ├── 📄 jest.config.js              # Jest test configuration
│   ├── 📄 .env.example                # Environment variables template
│   ├── 📄 .gitignore                  # Backend-specific ignores
│   │
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma           # Database schema
│   │   └── 📄 seed.ts                 # Database seeding script
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📄 server.ts               # Express server entry point
│   │   │
│   │   ├── 📁 controllers/            # Route controllers
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 user.controller.ts
│   │   │   ├── 📄 school.controller.ts
│   │   │   ├── 📄 course.controller.ts
│   │   │   ├── 📄 application.controller.ts
│   │   │   ├── 📄 admin.controller.ts
│   │   │   ├── 📄 message.controller.ts
│   │   │   └── 📄 form.controller.ts
│   │   │
│   │   ├── 📁 routes/                 # API routes
│   │   │   ├── 📄 auth.routes.ts
│   │   │   ├── 📄 user.routes.ts
│   │   │   ├── 📄 school.routes.ts
│   │   │   ├── 📄 course.routes.ts
│   │   │   ├── 📄 application.routes.ts
│   │   │   ├── 📄 admin.routes.ts
│   │   │   ├── 📄 message.routes.ts
│   │   │   └── 📄 form.routes.ts
│   │   │
│   │   ├── 📁 middleware/             # Express middleware
│   │   │   ├── 📄 auth.middleware.ts  # JWT authentication
│   │   │   ├── 📄 error.middleware.ts # Error handling
│   │   │   └── 📄 upload.middleware.ts # File upload (S3)
│   │   │
│   │   └── 📁 utils/                  # Utility functions
│   │       ├── 📄 email.util.ts       # Email sending
│   │       └── 📄 s3.util.ts          # S3 signed URLs
│   │
│   └── 📁 tests/                      # Backend tests
│       └── 📄 auth.test.ts            # Authentication tests
│
├── 📁 frontend/                       # Frontend (Next.js 14)
│   │
│   ├── 📄 package.json                # Frontend dependencies
│   ├── 📄 tsconfig.json               # TypeScript configuration
│   ├── 📄 tailwind.config.ts          # Tailwind CSS config
│   ├── 📄 postcss.config.js           # PostCSS config
│   ├── 📄 next.config.js              # Next.js configuration
│   ├── 📄 jest.config.js              # Jest configuration
│   ├── 📄 jest.setup.js               # Jest setup
│   ├── 📄 playwright.config.ts        # Playwright E2E config
│   ├── 📄 .env.local.example          # Environment template
│   ├── 📄 .gitignore                  # Frontend-specific ignores
│   │
│   ├── 📁 public/                     # Static assets
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 app/                    # Next.js App Router
│   │   │   │
│   │   │   ├── 📄 layout.tsx          # Root layout
│   │   │   ├── 📄 page.tsx            # Home page
│   │   │   ├── 📄 globals.css         # Global styles
│   │   │   │
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx        # Login page
│   │   │   │
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx        # Registration page
│   │   │   │
│   │   │   ├── 📁 about/
│   │   │   │   └── 📄 page.tsx        # About page
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   └── 📄 page.tsx        # Services page
│   │   │   │
│   │   │   ├── 📁 study-uk/
│   │   │   │   └── 📄 page.tsx        # Study in UK page
│   │   │   │
│   │   │   ├── 📁 courses/
│   │   │   │   ├── 📄 page.tsx        # Courses list
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx    # Course details
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📄 page.tsx        # Student dashboard
│   │   │   │
│   │   │   ├── 📁 applications/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx    # Application form
│   │   │   │
│   │   │   └── 📁 admin/
│   │   │       ├── 📁 dashboard/
│   │   │       │   └── 📄 page.tsx    # Admin dashboard
│   │   │       └── 📁 applications/
│   │   │           └── 📄 page.tsx    # Applications list
│   │   │
│   │   ├── 📁 components/             # React components
│   │   │   └── 📁 layout/
│   │   │       ├── 📄 Navbar.tsx      # Navigation bar
│   │   │       └── 📄 Footer.tsx      # Footer
│   │   │
│   │   └── 📁 lib/                    # Libraries & utilities
│   │       ├── 📄 api.ts              # Axios API client
│   │       └── 📁 context/
│   │           └── 📄 AuthContext.tsx # Authentication context
│   │
│   └── 📁 tests/
│       └── 📁 e2e/
│           └── 📄 application-flow.spec.ts  # E2E tests
│
└── 📁 uploads/                        # Local file uploads (dev only)
```

## Key Files Explained

### Root Level
- **package.json**: Monorepo configuration with workspace scripts
- **README.md**: Complete project documentation
- **QUICKSTART.md**: Get started in 5 minutes
- **DEPLOYMENT.md**: Production deployment guide

### Backend
- **server.ts**: Express server with all routes and middleware
- **schema.prisma**: Database models and relationships
- **seed.ts**: Populates database with 10 schools and 20 courses
- **controllers/**: Business logic for each feature
- **routes/**: API endpoint definitions with Swagger docs
- **middleware/**: Authentication, file upload, error handling

### Frontend
- **app/**: Next.js 14 App Router pages
- **components/**: Reusable React components
- **lib/**: API client and authentication context
- **globals.css**: Tailwind CSS with custom styles

## File Count Summary

- **Backend Files**: ~25 TypeScript files
- **Frontend Files**: ~20 TypeScript/TSX files
- **Configuration Files**: ~15 files
- **Documentation Files**: 6 markdown files
- **Test Files**: 2 test suites

## Total Lines of Code

- **Backend**: ~3,500 lines
- **Frontend**: ~2,500 lines
- **Tests**: ~500 lines
- **Documentation**: ~2,000 lines
- **Total**: ~8,500+ lines

## Technology Stack by Directory

### `/backend`
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- AWS SDK (S3)
- Nodemailer
- Jest

### `/frontend`
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Playwright
- Jest

## Environment Files

### Development
- `backend/.env` (create from .env.example)
- `frontend/.env.local` (create from .env.local.example)

### Production
- Set environment variables in hosting platform
- See DEPLOYMENT.md for details

## Build Outputs (Ignored by Git)

- `backend/dist/` - Compiled TypeScript
- `backend/node_modules/` - Dependencies
- `frontend/.next/` - Next.js build
- `frontend/node_modules/` - Dependencies
- `uploads/` - Local file uploads

## Getting Started

1. Install dependencies: `npm run install:all`
2. Setup database: `cd backend && npx prisma migrate dev`
3. Seed data: `npm run seed`
4. Start servers: `npm run dev`
5. Open http://localhost:3000

See QUICKSTART.md for detailed instructions!
