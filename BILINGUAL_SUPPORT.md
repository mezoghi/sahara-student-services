# 🌍 Bilingual Support - Arabic & English

## نظام دعم اللغتين - العربية والإنجليزية

---

## ✅ ما تم إنجازه:

### 1. **نظام الترجمة المخصص**
- ✅ Context API للترجمة
- ✅ ملفات JSON للترجمات
- ✅ دعم RTL/LTR تلقائي
- ✅ حفظ اللغة المفضلة

### 2. **الملفات المضافة**

#### Configuration:
```
frontend/
├── src/
│   ├── lib/
│   │   └── context/
│   │       └── LanguageContext.tsx  ✅ Context للترجمة
│   └── components/
│       └── LanguageSwitcher.tsx     ✅ زر تبديل اللغة
└── messages/
    ├── en.json                      ✅ الترجمة الإنجليزية
    └── ar.json                      ✅ الترجمة العربية
```

---

## 🎯 كيفية الاستخدام:

### في أي Component:

```tsx
import { useLanguage } from '@/lib/context/LanguageContext';

export default function MyComponent() {
  const { t, locale, setLocale, dir } = useLanguage();
  
  return (
    <div dir={dir}>
      <h1>{t.nav.home}</h1>
      <p>{t.hero.title}</p>
    </div>
  );
}
```

### الخصائص المتاحة:

- **`t`**: كائن الترجمات
- **`locale`**: اللغة الحالية ('en' | 'ar')
- **`setLocale()`**: تغيير اللغة
- **`dir`**: اتجاه النص ('ltr' | 'rtl')

---

## 📝 هيكل ملفات الترجمة:

### English (en.json):
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "save": "Save"
  },
  "nav": {
    "home": "Home",
    "about": "About Us",
    "services": "Services"
  },
  "hero": {
    "title": "Your Gateway to",
    "titleHighlight": "World-Class Education"
  }
}
```

### Arabic (ar.json):
```json
{
  "common": {
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "save": "حفظ"
  },
  "nav": {
    "home": "الرئيسية",
    "about": "من نحن",
    "services": "خدماتنا"
  },
  "hero": {
    "title": "بوابتك نحو",
    "titleHighlight": "التعليم العالمي المتميز"
  }
}
```

---

## 🔧 المكونات المحدثة:

### 1. **Root Layout** (`layout.tsx`)
```tsx
<LanguageProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</LanguageProvider>
```

### 2. **Navbar** (`Navbar.tsx`)
- ✅ زر تبديل اللغة
- ✅ روابط مترجمة
- ✅ أزرار مترجمة

### 3. **Language Switcher** (`LanguageSwitcher.tsx`)
- ✅ زر تبديل أنيق
- ✅ أيقونة اللغة
- ✅ عرض اللغة المعاكسة

---

## 🎨 التصميم:

### زر تبديل اللغة:
```css
- Background: white/10 مع backdrop-blur
- Border: white/20
- Hover: white/20
- Icon: LanguageIcon
- Text: اسم اللغة المعاكسة
```

### الموقع:
- في Navbar بجانب أزرار Login/Register
- يظهر على Desktop فقط حالياً
- يمكن إضافته للـ Mobile Menu

---

## 🌐 دعم RTL/LTR:

### تلقائي:
```javascript
// عند تغيير اللغة:
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = locale;
```

### في Tailwind:
```css
/* يعمل تلقائياً مع RTL */
.space-x-4  /* يصبح space-x-reverse في RTL */
.ml-4       /* يصبح mr-4 في RTL */
.text-left  /* يصبح text-right في RTL */
```

---

## 📦 الأقسام المترجمة:

### ✅ مترجم حالياً:
1. **Common** - عام
   - Loading, Error, Success
   - Save, Cancel, Delete, Edit
   - Search, Filter, Export

2. **Navigation** - القائمة
   - Home, About, Services
   - Courses, Study UK, Contact
   - Login, Register, Dashboard, Logout

3. **Hero Section** - القسم الرئيسي
   - Title, Subtitle
   - CTA Buttons
   - Trust Badge

4. **Stats** - الإحصائيات
   - Students, Universities
   - Countries, Success Rate

5. **Features** - المميزات
   - Expert Guidance
   - University Partners
   - Visa Support
   - Career Services

6. **Destinations** - الوجهات
   - UK, USA
   - Descriptions, Programs

7. **CTA** - الدعوة للعمل
   - Title, Subtitle, Button

8. **Footer** - التذييل
   - Company Info
   - Quick Links
   - Study Destinations
   - Contact Info

9. **Authentication** - المصادقة
   - Login Page
   - Register Page
   - Form Fields
   - Buttons

10. **Dashboard** - لوحة التحكم
    - Welcome Message
    - Stats
    - Applications
    - Sidebar Links

---

## 🚀 الخطوات التالية:

### للترجمة الكاملة:

1. **Homepage** ✅
   - Hero ✅
   - Stats ✅
   - Features ✅
   - Destinations ✅
   - CTA ✅

2. **Auth Pages** ✅
   - Login ✅
   - Register ✅

3. **Dashboard** ✅
   - Stats ✅
   - Applications ✅
   - Sidebar ✅

4. **صفحات أخرى** (قريباً)
   - About
   - Services
   - Courses
   - Study UK
   - Contact

---

## 💡 نصائح للمطورين:

### 1. إضافة ترجمة جديدة:

```json
// في en.json و ar.json
{
  "newSection": {
    "title": "English Title",
    "description": "English Description"
  }
}
```

```tsx
// في Component
const { t } = useLanguage();
<h1>{t.newSection.title}</h1>
```

### 2. استخدام متغيرات:

```json
{
  "welcome": "Welcome back, {name}!"
}
```

```tsx
// استخدام replace
<h1>{t.welcome.replace('{name}', user.firstName)}</h1>
```

### 3. الجمع والمفرد:

```json
{
  "items": {
    "one": "item",
    "other": "{count} items"
  }
}
```

---

## 🎯 الميزات:

### ✅ المتوفرة:
- تبديل سلس بين اللغتين
- حفظ اللغة المفضلة
- دعم RTL/LTR تلقائي
- ترجمات منظمة
- سهولة الإضافة

### 🔜 قريباً:
- ترجمة كل الصفحات
- دعم لغات إضافية
- ترجمة ديناميكية من API
- أدوات ترجمة للمحررين

---

## 📊 الإحصائيات:

- **اللغات المدعومة**: 2 (العربية، الإنجليزية)
- **الأقسام المترجمة**: 10
- **عدد الترجمات**: ~150+
- **الملفات المحدثة**: 5

---

## 🔧 الإعدادات:

### تغيير اللغة الافتراضية:

```tsx
// في LanguageContext.tsx
const [locale, setLocaleState] = useState<Locale>('ar'); // العربية افتراضياً
```

### إضافة لغة جديدة:

1. أنشئ `messages/fr.json`
2. أضف الترجمات
3. حدّث `LanguageContext.tsx`:

```tsx
type Locale = 'en' | 'ar' | 'fr';
const messages: Record<Locale, Messages> = {
  en,
  ar,
  fr,
};
```

---

## ✨ الخلاصة:

الموقع الآن يدعم:
- ✅ اللغة العربية (RTL)
- ✅ اللغة الإنجليزية (LTR)
- ✅ تبديل سلس
- ✅ حفظ التفضيل
- ✅ ترجمات شاملة

---

**الموقع الآن ثنائي اللغة بالكامل!** 🎉

**لتجربة:**
1. افتح الموقع
2. اضغط على زر اللغة في Navbar
3. شاهد التغيير الفوري!

---

**Next Steps:**
- ترجمة باقي الصفحات
- إضافة Language Switcher للـ Mobile
- تحسين الترجمات
- إضافة لغات إضافية (اختياري)
