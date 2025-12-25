# 🚀 Quick Start Guide

## تشغيل المشروع

### 1. نسخ الملفات الجديدة

```powershell
# افتح PowerShell في مجلد المشروع
cd c:\Projects\SSS\frontend\src\app

# نسخ لوحة تحكم الطالب
Copy-Item dashboard\page_new.tsx dashboard\page.tsx -Force

# نسخ صفحة التحليلات
Copy-Item admin\analytics\page_updated.tsx admin\analytics\page.tsx -Force
```

### 2. تشغيل التطبيق

```bash
# في Terminal
cd c:\Projects\SSS\frontend
npm run dev
```

### 3. فتح المتصفح

```
http://localhost:3001
```

---

## 📄 الصفحات المتاحة

### للطلاب
- `/` - الصفحة الرئيسية
- `/courses` - تصفح الكورسات
- `/courses/[id]` - تفاصيل الكورس
- `/dashboard` - لوحة التحكم
- `/applications` - طلباتي
- `/profile` - الملف الشخصي

### للأدمن
- `/admin/dashboard` - لوحة التحكم
- `/admin/applications` - الطلبات
- `/admin/analytics` - التحليلات
- `/admin/settings` - الإعدادات
- `/admin/users` - المستخدمين

---

## 🎨 المكونات الجاهزة

```tsx
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Alert,
  Tabs,
  Select,
  Progress,
  Skeleton
} from '@/components/ui';
```

---

## 📊 مثال استخدام

```tsx
<Card>
  <CardHeader>
    <CardTitle>Computer Science</CardTitle>
    <CardDescription>University of Oxford</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge>Undergraduate</Badge>
    <p>Learn programming and algorithms...</p>
  </CardContent>
  <CardFooter>
    <Button>Apply Now</Button>
  </CardFooter>
</Card>
```

---

## ✅ تم إكمال

- ✅ 19 مكون UI
- ✅ 7 صفحات رئيسية
- ✅ تصميم متجاوب
- ✅ حالات تحميل
- ✅ Charts تفاعلية

---

**جاهز للاستخدام! 🎉**
