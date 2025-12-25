# 🔧 التعديلات المطلوبة للكود - cPanel Deployment

## 📋 ملخص التعديلات

هذه التعديلات ضرورية لجعل التطبيق يعمل على Shared Hosting (cPanel).

---

## 1️⃣ Frontend Changes

### **ملف: `frontend/next.config.js`**

**قبل:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

**بعد:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ضروري للـ static export
  images: {
    unoptimized: true, // لأن cPanel لا يدعم Image Optimization
  },
  trailingSlash: true, // لتجنب مشاكل الـ routing
  // إزالة أي rewrites أو redirects
}

module.exports = nextConfig
```

---

### **ملف: `frontend/.env.production`** (جديد)

```env
# API URL - استبدل بـ URL الخاص بـ Backend
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# أو إذا كنت تستخدم subdomain
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

### **ملف: `frontend/public/.htaccess`** (جديد)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Handle React Router / Next.js routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
  
  # Security Headers
  <IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
  </IfModule>
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Disable directory browsing
Options -Indexes

# Protect sensitive files
<FilesMatch "\.(env|json|config\.js|md)$">
  Order allow,deny
  Deny from all
</FilesMatch>
```

---

### **ملف: `frontend/package.json`**

**إضافة scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build && next export",
    "deploy:cpanel": "npm run build && cd out && zip -r ../frontend-deploy.zip ."
  }
}
```

---

## 2️⃣ Backend Changes

### **ملف: `backend/package.json`**

**تحديث:**
```json
{
  "name": "sahara-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "npx prisma generate",
    "migrate": "npx prisma migrate deploy",
    "seed": "ts-node prisma/seed.ts"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

### **ملف: `backend/.env.production`** (جديد)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=5000

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# AWS S3 (اختياري)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# Email (اختياري)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

### **ملف: `backend/src/server.ts`**

**تحديث CORS:**
```typescript
import cors from 'cors';

// قبل:
app.use(cors());

// بعد:
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### **ملف: `backend/railway.json`** (جديد)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### **ملف: `backend/Procfile`** (جديد - للـ Heroku)

```
web: npm run start
release: npx prisma migrate deploy
```

---

## 3️⃣ تعديلات الكود

### **إزالة Next.js Image Component**

**قبل:**
```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={100} 
  height={100} 
  alt="Logo"
/>
```

**بعد:**
```tsx
<img 
  src="/logo.png" 
  width={100} 
  height={100} 
  alt="Logo"
  loading="lazy"
/>
```

---

### **تحويل Server Components إلى Client**

**قبل:**
```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

**بعد:**
```tsx
'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

---

### **تحديث API Calls**

**ملف: `frontend/src/lib/api.ts`**

```typescript
import axios from 'axios';

// استخدام environment variable
const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // للـ cookies
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 4️⃣ Database Migration

### **على Railway/Render:**

```bash
# 1. Push schema
npx prisma db push

# 2. Seed data
npm run seed
```

### **على Supabase:**

```bash
# 1. Update DATABASE_URL
DATABASE_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"

# 2. Push schema
npx prisma db push

# 3. Seed
npm run seed
```

---

## 5️⃣ Build Commands

### **Frontend:**
```bash
cd frontend
npm install
npm run build
# الملفات في مجلد 'out'
```

### **Backend:**
```bash
cd backend
npm install
npm run build
# الملفات في مجلد 'dist'
```

---

## 6️⃣ Environment Variables على Railway

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

---

## 7️⃣ Nginx Config (إذا كنت تستخدم VPS)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 8️⃣ Testing Checklist

### **قبل Deploy:**
- [ ] Build Frontend محلياً
- [ ] Test Static Export
- [ ] تحقق من API URL
- [ ] Test CORS
- [ ] Test Authentication
- [ ] Test File Upload
- [ ] Test Language Switching

### **بعد Deploy:**
- [ ] Test Homepage
- [ ] Test Login/Register
- [ ] Test Dashboard
- [ ] Test API calls
- [ ] Test SSL
- [ ] Test Mobile
- [ ] Test Performance

---

## 9️⃣ Performance Optimization

### **Frontend:**
```javascript
// في next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  compress: true, // Gzip compression
  poweredByHeader: false, // إخفاء X-Powered-By header
}
```

### **Backend:**
```typescript
// في server.ts
import compression from 'compression';
import helmet from 'helmet';

app.use(compression()); // Gzip
app.use(helmet()); // Security headers
```

---

## 🔟 Security Best Practices

### **Frontend:**
- ✅ استخدم HTTPS دائماً
- ✅ لا تخزن sensitive data في localStorage
- ✅ استخدم HttpOnly cookies للـ tokens
- ✅ Sanitize user inputs

### **Backend:**
- ✅ استخدم strong JWT secrets
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Prisma يفعل هذا)
- ✅ CORS configuration صحيح

---

## 📝 ملاحظات مهمة

### **⚠️ تحذيرات:**
1. لا تضع `.env` في Git
2. استخدم `.env.production` للـ production
3. غيّر JWT_SECRET في production
4. فعّل SSL دائماً
5. راقب الأخطاء والـ logs

### **✅ نصائح:**
1. استخدم CDN للصور الكبيرة
2. فعّل Caching
3. ضغط الملفات
4. استخدم lazy loading
5. راقب الأداء بـ Google Analytics

---

**هل تريد البدء بتطبيق هذه التعديلات؟** 🚀
