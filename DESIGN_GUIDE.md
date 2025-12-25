# Sahara Student Services - Design Guide

## Visual Identity

### Brand Colors

#### Primary Color - Navy Blue (#082d46)
Represents **trust, professionalism, and stability**. Use for:
- Primary buttons and CTAs
- Navigation elements
- Headings and important text
- Brand elements

#### Accent Color - Deep Red (#c00101)
Represents **passion, energy, and action**. Use for:
- Secondary CTAs
- Important alerts and notifications
- Highlights and emphasis
- Interactive elements

## Typography

### Font Families
- **English/Latin**: Inter (300-700)
- **Arabic**: Cairo (300-700)

### Type Scale
- Display: 72px / Bold
- H1: 48px / Bold
- H2: 36px / Bold
- H3: 30px / Semibold
- Body: 16px / Regular

## Components

### Buttons
```tsx
// Primary
<button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl font-semibold shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
  Get Started
</button>

// Accent
<button className="px-6 py-3 bg-gradient-to-r from-accent to-accent-600 text-white rounded-xl font-semibold shadow-glow-accent hover:-translate-y-1 transition-all duration-300">
  Apply Now
</button>
```

### Cards
```tsx
<div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg hover:-translate-y-2 transition-all duration-400 border border-neutral-200">
  {/* Content */}
</div>
```

## Animations
- Fade in: 500ms
- Slide up: 600ms
- Hover lift: -2px translateY
- Scale on hover: 1.05

## Spacing System
Base unit: 4px
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

## Accessibility
- Color contrast: 4.5:1 minimum
- Focus indicators: 2px ring
- Keyboard navigation: Full support
- Screen readers: ARIA labels
