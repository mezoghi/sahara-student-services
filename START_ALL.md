# 🚀 تشغيل المشروع بالكامل

## المتطلبات الأساسية

- ✅ Node.js مثبت
- ✅ PostgreSQL مثبت ويعمل
- ⚠️ Docker Desktop (اختياري - حالياً غير مشغل)

---

## ⚠️ المشاكل الحالية

### 1. Backend - أخطاء TypeScript
يوجد أخطاء في ملف `backend/src/controllers/admin.controller.ts` السطر 301:

```typescript
// الخطأ في:
applications: user._count.applications,

// يجب تصحيحه إلى:
applications: user._count?.applications || 0,
```

### 2. Docker Desktop
Docker Desktop غير مشغل حالياً. يمكن استخدام PostgreSQL المثبت محلياً بدلاً منه.

---

## 🔧 خطوات التشغيل

### الطريقة 1: بدون Docker (موصى بها حالياً)

#### 1. تشغيل قاعدة البيانات PostgreSQL
تأكد من أن PostgreSQL يعمل محلياً على المنفذ 5432.

#### 2. إعداد Backend

```powershell
# انتقل لمجلد Backend
cd c:\Projects\SSS\backend

# تثبيت المكتبات (إذا لم تكن مثبتة)
npm install

# إعداد قاعدة البيانات
npx prisma generate
npx prisma migrate dev

# (اختياري) إضافة بيانات تجريبية
npm run seed

# تشغيل Backend
npm run dev
```

Backend سيعمل على: `http://localhost:5000`

#### 3. تشغيل Frontend

```powershell
# في نافذة PowerShell جديدة
cd c:\Projects\SSS\frontend

# تثبيت المكتبات (إذا لم تكن مثبتة)
npm install

# تشغيل Frontend
npm run dev
```

Frontend سيعمل على: `http://localhost:3000`

---

### الطريقة 2: باستخدام Docker

#### 1. تشغيل Docker Desktop
```powershell
# افتح Docker Desktop من قائمة Start
# أو شغله من PowerShell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

#### 2. انتظر حتى يصبح Docker جاهزاً
تحقق من أن Docker يعمل:
```powershell
docker ps
```

#### 3. تشغيل قاعدة البيانات
```powershell
cd c:\Projects\SSS
docker-compose up -d db
```

#### 4. تشغيل Backend و Frontend
اتبع نفس الخطوات من الطريقة 1.

---

## 🐛 إصلاح أخطاء Backend

### الخطأ في admin.controller.ts

افتح الملف: `backend/src/controllers/admin.controller.ts`

ابحث عن السطر 301 وغيره من:
```typescript
applications: user._count.applications,
```

إلى:
```typescript
applications: user._count?.applications || 0,
```

أو استخدم هذا الأمر:
```powershell
# في PowerShell
cd c:\Projects\SSS\backend\src\controllers
# ثم افتح الملف وصحح الخطأ يدوياً
```

---

## ✅ التحقق من التشغيل

### Backend
```powershell
# اختبر API
curl http://localhost:5000/api/health
```

### Frontend
افتح المتصفح: `http://localhost:3000`

### Database
```powershell
# افتح Prisma Studio
cd c:\Projects\SSS\backend
npx prisma studio
```

---

## 📊 الحالة الحالية

- **Frontend**: ✅ يعمل على المنفذ 3000
- **Backend**: ⚠️ يحتاج إصلاح أخطاء TypeScript
- **Database**: ⚠️ يحتاج تشغيل PostgreSQL أو Docker

---

## 🔗 الروابط المهمة

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs
- Prisma Studio: http://localhost:5555

---

## 📝 ملاحظات

1. **Frontend يعمل حالياً** ولكن بدون اتصال بـ Backend
2. **Backend يحتاج إصلاح** الأخطاء البرمجية
3. **Database** يمكن استخدام PostgreSQL المحلي أو Docker

---

## 🆘 المساعدة

إذا واجهت مشاكل:

1. تأكد من تثبيت جميع المكتبات: `npm install`
2. تأكد من ملف `.env` في Backend
3. تأكد من عمل PostgreSQL
4. راجع ملف `PHASE2_COMPLETE_REPORT.md` للتفاصيل

---

**آخر تحديث**: 10 نوفمبر 2025، 1:50 صباحاً
