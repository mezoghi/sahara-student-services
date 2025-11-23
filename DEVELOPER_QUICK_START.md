# Developer Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd SSS

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

#### Frontend
```bash
cd frontend
npm run dev
```
Access at: `http://localhost:3000`

#### Backend
```bash
cd backend
npm run dev
```
API available at: `http://localhost:5000`

---

## 🎨 Design System Quick Reference

### Using Components

#### Button
```tsx
import { Button } from '@/components/ui/button';

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: sm, default, lg, xl, icon

<Button variant="default" size="lg">
  Click Me
</Button>

<Button variant="outline" size="sm">
  Secondary Action
</Button>
```

#### Input
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
  />
</div>
```

#### Card
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Badge
```tsx
import { Badge } from '@/components/ui/badge';

// Variants: default, secondary, destructive, outline, success, warning, info

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>
```

#### Toast Notifications
```tsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();

  const showNotification = () => {
    toast({
      title: "Success!",
      description: "Your action was completed.",
      variant: "success", // default, destructive, success, warning, info
    });
  };

  return <Button onClick={showNotification}>Show Toast</Button>;
}
```

---

## 🎨 Styling with Tailwind

### Common Patterns

#### Layout
```tsx
// Container
<div className="container mx-auto px-4">
  {/* Content */}
</div>

// Flex Layout
<div className="flex items-center justify-between gap-4">
  {/* Items */}
</div>

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

#### Spacing
```tsx
// Padding
<div className="p-4">        {/* 16px all sides */}
<div className="px-6 py-4">  {/* 24px horizontal, 16px vertical */}

// Margin
<div className="mt-8 mb-4">  {/* 32px top, 16px bottom */}
<div className="mx-auto">    {/* Horizontal centering */}

// Gap
<div className="flex gap-4">  {/* 16px gap between items */}
```

#### Typography
```tsx
// Headings
<h1 className="text-4xl font-bold">Heading 1</h1>
<h2 className="text-3xl font-semibold">Heading 2</h2>
<h3 className="text-2xl font-medium">Heading 3</h3>

// Body Text
<p className="text-base text-muted-foreground">
  Regular paragraph text
</p>

// Small Text
<span className="text-sm text-muted-foreground">
  Small text
</span>
```

#### Colors
```tsx
// Background
<div className="bg-background">       {/* Theme background */}
<div className="bg-primary">          {/* Primary color */}
<div className="bg-card">             {/* Card background */}

// Text
<p className="text-foreground">       {/* Theme text */}
<p className="text-primary">          {/* Primary text */}
<p className="text-muted-foreground"> {/* Muted text */}

// Border
<div className="border border-border"> {/* Theme border */}
```

#### Responsive Design
```tsx
// Mobile first approach
<div className="
  text-sm        {/* Mobile: 14px */}
  md:text-base   {/* Tablet: 16px */}
  lg:text-lg     {/* Desktop: 18px */}
">
  Responsive text
</div>

// Responsive Grid
<div className="
  grid
  grid-cols-1      {/* Mobile: 1 column */}
  md:grid-cols-2   {/* Tablet: 2 columns */}
  lg:grid-cols-3   {/* Desktop: 3 columns */}
  gap-4
">
  {/* Items */}
</div>
```

#### Hover & Focus States
```tsx
<button className="
  bg-primary
  hover:bg-primary/90
  focus:ring-2
  focus:ring-ring
  focus:ring-offset-2
  transition-colors
">
  Hover me
</button>
```

---

## 🌐 Internationalization (i18n)

### Using Language Context
```tsx
import { useLanguage } from '@/lib/context/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t.common.welcome}</h1>
      <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
        {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
}
```

### RTL Support
```tsx
// The layout automatically handles RTL based on language
// Use dir attribute for specific elements if needed
<div dir={language === 'ar' ? 'rtl' : 'ltr'}>
  {/* Content */}
</div>
```

---

## 🔐 Authentication

### Using Auth Context
```tsx
import { useAuth } from '@/lib/context/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={() => login(credentials)}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

---

## 🛠️ Utility Functions

### Class Name Utility
```tsx
import { cn } from '@/lib/utils';

// Merge class names with Tailwind support
<div className={cn(
  'base-class',
  condition && 'conditional-class',
  'override-class'
)}>
  {/* Content */}
</div>
```

### Date Formatting
```tsx
import { formatDate } from '@/lib/utils';

const formattedDate = formatDate(new Date());
// Output: "November 9, 2025"
```

### Currency Formatting
```tsx
import { formatCurrency } from '@/lib/utils';

const price = formatCurrency(1500, 'GBP');
// Output: "£1,500.00"
```

### String Utilities
```tsx
import { truncate, slugify } from '@/lib/utils';

const short = truncate('Long text here...', 20);
// Output: "Long text here..."

const slug = slugify('Hello World!');
// Output: "hello-world"
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/                # UI components
│   │   ├── layout/            # Layout components
│   │   └── toaster.tsx        # Toast component
│   ├── lib/                   # Utilities and libraries
│   │   ├── context/           # React contexts
│   │   ├── api.ts             # API client
│   │   └── utils.ts           # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # Global styles
│   │   ├── design-system.ts   # Design tokens
│   │   └── globals.css        # Global CSS
│   └── i18n/                  # Internationalization
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies
```

---

## 🐛 Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Kill the process using the port
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) > TypeScript: Restart TS Server
```

### Issue: Tailwind Classes Not Working
```bash
# Ensure Tailwind is properly configured
# Check tailwind.config.ts content paths
# Restart dev server
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [Lucide Icons](https://lucide.dev/icons/)

### Useful VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens

---

## 🤝 Contributing

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

### Component Guidelines
- Keep components small and focused
- Use TypeScript interfaces for props
- Add proper accessibility attributes
- Make components reusable
- Document complex components

### Git Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review the DESIGN_SYSTEM_IMPLEMENTATION.md
3. Check existing issues in the repository
4. Contact the development team

---

**Happy Coding! 🚀**
