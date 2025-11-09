# 🚀 دليل رفع التطبيق على cPanel (Shared Hosting)

## 📋 نظرة عامة

هذا الدليل يشرح كيفية رفع تطبيق Sahara Student Services على استضافة Shared Hosting (cPanel) مثل:
- Hostinger
- Bluehost
- SiteGround
- GoDaddy
- Namecheap

---

## ⚠️ التحديات والحلول

### **المشكلة الرئيسية**:
- ❌ Next.js يحتاج Node.js server (SSR)
- ❌ Shared Hosting لا يدعم Node.js بشكل كامل
- ❌ Backend Express يحتاج Node.js

### **الحل**:
✅ تحويل Next.js إلى Static Export  
✅ استخدام API خارجي للـ Backend  
✅ أو استخدام VPS بدلاً من Shared Hosting

---

## 🎯 الخيارات المتاحة

### **الخيار 1: Static Export (موصى به للـ Shared Hosting)** ⭐
- Frontend: Static HTML/CSS/JS على cPanel
- Backend: Heroku/Railway/Render (مجاني)
- Database: PostgreSQL على Heroku/Supabase

### **الخيار 2: VPS (الأفضل للتطبيقات الكاملة)** 🏆
- Frontend + Backend على نفس السيرفر
- كل شيء تحت سيطرتك
- أمثلة: DigitalOcean, Linode, Vultr

### **الخيار 3: Serverless (حديث ومرن)** 🚀
- Frontend: Vercel/Netlify
- Backend: Vercel Serverless Functions
- Database: Supabase/PlanetScale

---

## 📦 الخيار 1: Static Export على cPanel (التفصيل الكامل)

### **الخطوة 1: تحويل Next.js إلى Static**

#### 1.1 تعديل `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // ضروري للـ static export
  },
  trailingSlash: true, // لتجنب مشاكل الـ routing
}

module.exports = nextConfig
```

#### 1.2 إزالة API Routes من Next.js:
```bash
# احذف مجلد api routes إذا كان موجوداً
rm -rf frontend/src/app/api
```

#### 1.3 Build التطبيق:
```bash
cd frontend
npm run build
```

سيتم إنشاء مجلد `out` يحتوي على ملفات HTML/CSS/JS الثابتة.

---

### **الخطوة 2: رفع Backend على خدمة مجانية**

#### 2.1 استخدام Railway (موصى به - مجاني):

**أ. إنشاء حساب:**
```
https://railway.app
```

**ب. إنشاء مشروع جديد:**
1. اضغط "New Project"
2. اختر "Deploy from GitHub repo"
3. اربط حساب GitHub
4. اختر repository الخاص بك

**ج. إعداد Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

**د. إضافة PostgreSQL:**
1. اضغط "New" → "Database" → "Add PostgreSQL"
2. سيتم إنشاء DATABASE_URL تلقائياً

**هـ. Deploy:**
```bash
git push origin main
```
Railway سيقوم بالـ deploy تلقائياً!

**و. الحصول على URL:**
```
https://your-app.railway.app
```

---

#### 2.2 بدائل مجانية أخرى:

**Render.com:**
- مجاني للـ Web Services
- PostgreSQL مجاني (90 يوم)
- Deploy تلقائي من GitHub

**Heroku:**
- مجاني (مع قيود)
- PostgreSQL مجاني (10,000 rows)
- سهل الاستخدام

**Fly.io:**
- مجاني للتطبيقات الصغيرة
- Deploy سريع
- دعم Docker

---

### **الخطوة 3: رفع Frontend على cPanel**

#### 3.1 تحضير الملفات:
```bash
cd frontend
npm run build
# الملفات في مجلد 'out'
```

#### 3.2 ضغط الملفات:
```bash
cd out
zip -r frontend.zip .
```

#### 3.3 رفع على cPanel:

**أ. تسجيل الدخول:**
```
https://yourdomain.com:2083
```

**ب. File Manager:**
1. افتح File Manager
2. اذهب إلى `public_html`
3. احذف المحتويات القديمة
4. ارفع `frontend.zip`
5. Extract الملف

**ج. تعديل `.htaccess`:**
```apache
# في public_html/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle React Router
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  
  # Security Headers
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  
  # CORS (إذا لزم الأمر)
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

### **الخطوة 4: تحديث API URL في Frontend**

#### 4.1 إنشاء `.env.production`:
```env
# في frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

#### 4.2 Build مرة أخرى:
```bash
npm run build
```

---

## 🔧 التعديلات المطلوبة على الكود

### **1. تعديل `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // إزالة rewrites و redirects
}

module.exports = nextConfig
```

### **2. تعديل استخدام Images:**
```tsx
// قبل:
import Image from 'next/image'
<Image src="/logo.png" width={100} height={100} />

// بعد (للـ static export):
<img src="/logo.png" width={100} height={100} alt="Logo" />
```

### **3. إزالة Server Components:**
```tsx
// قبل:
export default async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}

// بعد:
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('...').then(res => setData(res))
  }, [])
  return <div>{data}</div>
}
```

### **4. تحديث API calls:**
```typescript
// في frontend/src/lib/api.ts
const apiURL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.railway.app/api';
```

---

## 📝 Backend على Railway - خطوة بخطوة

### **1. إنشاء `railway.json`:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **2. تحديث `package.json`:**
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc && npx prisma generate",
    "postinstall": "npx prisma generate"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### **3. إضافة `Procfile` (اختياري):**
```
web: npm run start
```

### **4. تحديث CORS في Backend:**
```typescript
// في backend/src/server.ts
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
}));
```

---

## 🗄️ Database على Supabase (بديل مجاني)

### **1. إنشاء مشروع:**
```
https://supabase.com
```

### **2. الحصول على Connection String:**
```
Settings → Database → Connection String
```

### **3. تحديث `.env`:**
```env
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

### **4. Run Migrations:**
```bash
cd backend
npx prisma db push
npm run seed
```

---

## 📂 هيكل الملفات النهائي على cPanel

```
public_html/
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── assets/
├── .htaccess
└── 404.html
```

---

## ✅ Checklist قبل الرفع

### **Frontend:**
- [ ] تحويل Next.js إلى static export
- [ ] تحديث API URL
- [ ] إزالة Server Components
- [ ] تحويل Image إلى img
- [ ] Build و Test محلياً
- [ ] إنشاء .htaccess

### **Backend:**
- [ ] اختيار خدمة hosting (Railway/Render)
- [ ] إعداد Environment Variables
- [ ] إضافة PostgreSQL
- [ ] تحديث CORS
- [ ] Deploy و Test
- [ ] Run migrations

### **Domain:**
- [ ] ربط Domain بـ cPanel
- [ ] تفعيل SSL (Let's Encrypt)
- [ ] تحديث DNS إذا لزم الأمر

---

## 🔐 SSL Certificate (HTTPS)

### **على cPanel:**
1. اذهب إلى SSL/TLS
2. اختر "Let's Encrypt SSL"
3. اضغط "Issue"
4. انتظر 5-10 دقائق

### **على Railway:**
- SSL تلقائي ✅

---

## 🚀 خطوات الـ Deployment

### **المرة الأولى:**
```bash
# 1. Build Frontend
cd frontend
npm run build

# 2. ضغط الملفات
cd out
zip -r frontend.zip .

# 3. رفع على cPanel
# استخدم File Manager

# 4. Deploy Backend على Railway
git add .
git commit -m "Deploy to production"
git push origin main
```

### **التحديثات اللاحقة:**
```bash
# Frontend
npm run build
# ارفع الملفات الجديدة

# Backend
git push origin main
# Railway سيقوم بالـ deploy تلقائياً
```

---

## 💰 التكاليف المتوقعة

### **الخيار المجاني:**
- cPanel Shared Hosting: $3-10/شهر
- Railway Backend: مجاني (500 ساعة/شهر)
- Supabase Database: مجاني (500MB)
- **المجموع**: $3-10/شهر فقط!

### **الخيار المدفوع:**
- VPS (DigitalOcean): $6-12/شهر
- Domain: $10-15/سنة
- **المجموع**: $6-12/شهر

---

## 🔧 استكشاف الأخطاء

### **مشكلة: 404 على الروابط**
**الحل:**
```apache
# تأكد من .htaccess
RewriteRule . /index.html [L]
```

### **مشكلة: CORS Error**
**الحل:**
```typescript
// في backend
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### **مشكلة: Images لا تظهر**
**الحل:**
```javascript
// في next.config.js
images: {
  unoptimized: true
}
```

### **مشكلة: API لا يعمل**
**الحل:**
```env
# تحقق من .env.production
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## 📊 مقارنة الخيارات

| الميزة | Shared Hosting | VPS | Serverless |
|--------|----------------|-----|------------|
| **السعر** | $3-10/شهر | $6-20/شهر | مجاني-$20 |
| **الأداء** | متوسط | عالي | عالي جداً |
| **الصيانة** | سهلة | متوسطة | سهلة جداً |
| **التحكم** | محدود | كامل | محدود |
| **Node.js** | محدود | كامل | كامل |
| **Database** | MySQL فقط | أي شيء | خارجي |
| **SSL** | مجاني | يدوي | تلقائي |

---

## 🎯 التوصية النهائية

### **للمبتدئين:**
✅ **Shared Hosting (cPanel) + Railway**
- سهل
- رخيص
- كافي للبداية

### **للمحترفين:**
✅ **VPS (DigitalOcean)**
- تحكم كامل
- أداء أفضل
- قابل للتوسع

### **للمشاريع الكبيرة:**
✅ **Vercel + Supabase**
- أداء عالي جداً
- Serverless
- Auto-scaling

---

## 📞 الدعم والمساعدة

### **مشاكل cPanel:**
- دعم الاستضافة
- cPanel Documentation

### **مشاكل Railway:**
- Railway Discord
- Railway Docs

### **مشاكل Next.js:**
- Next.js Docs
- Vercel Support

---

## 🚀 الخطوات التالية

1. **اختر خيار الـ Hosting**
2. **عدّل الكود حسب الخيار**
3. **Deploy Backend أولاً**
4. **Build Frontend**
5. **ارفع على cPanel**
6. **اختبر كل شيء**
7. **فعّل SSL**

---

## 📝 ملاحظات مهمة

### **⚠️ تحذيرات:**
- Shared Hosting لا يدعم Node.js بشكل كامل
- يجب تحويل Next.js إلى static
- Backend يجب أن يكون على خدمة منفصلة

### **✅ نصائح:**
- استخدم CDN للصور
- فعّل Caching
- ضغط الملفات
- استخدم SSL دائماً
- راقب الأداء

---

**هل تريد البدء بالتطبيق؟ أخبرني بالخيار الذي تفضله!** 🚀

**الخيارات:**
1. Static Export على cPanel + Railway
2. VPS كامل
3. Vercel + Supabase (Serverless)
