// Modern Design System Configuration
// Following Material Design 3 and Apple HIG principles

export const colors = {
  // Primary Brand Colors - Navy Blue & Deep Red
  primary: {
    50: '#e6f0f5',
    100: '#cce1eb',
    200: '#99c3d7',
    300: '#66a5c3',
    400: '#3387af',
    500: '#08689b',
    600: '#08537c',
    700: '#082d46', // Main Navy Blue
    800: '#051e2f',
    900: '#030f18',
  },
  
  // Accent Brand Color - Deep Red
  accent: {
    50: '#ffe5e5',
    100: '#ffcccc',
    200: '#ff9999', // Very light red
    300: '#ff6666', // Lighter red
    400: '#ff3333',
    500: '#c00101', // Main Deep Red
    600: '#990101', // Darker red
    700: '#660000',
    800: '#4d0000',
    900: '#330000',
  },

  // Neutral Palette
  neutral: {
    50: '#fafbfc',
    100: '#f2f4f6',
    200: '#e5e8eb',
    300: '#d0d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Surface Colors
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    arabic: ['Cairo', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  4.5: '1.125rem',   // 18px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px,
};

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
};

export const shadows = {
  // Modern, soft shadows following Material Design 3
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  // Brand-specific shadows
  primary: '0 4px 14px 0 rgba(8, 45, 70, 0.15)',
  accent: '0 4px 14px 0 rgba(192, 1, 1, 0.15)',
  glow: '0 0 20px rgba(8, 45, 70, 0.1)',
  none: 'none',
};

export const borderRadius = {
  none: '0px',
  xs: '0.125rem',     // 2px
  sm: '0.25rem',      // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',       // 8px
  lg: '0.75rem',      // 12px
  xl: '1rem',         // 16px
  '2xl': '1.5rem',    // 24px
  '3xl': '2rem',      // 32px
  full: '9999px',
};

export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    400: '400ms',
    500: '500ms',
    600: '600ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Apple-style easing
    'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  // Common transition combinations
  common: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  max: 9999,
};

// Animation keyframes - Apple-inspired smooth animations
export const animations = {
  keyframes: {
    // Fade animations
    'fade-in': 'from { opacity: 0 } to { opacity: 1 }',
    'fade-out': 'from { opacity: 1 } to { opacity: 0 }',
    'fade-in-up': 'from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) }',
    'fade-in-down': 'from { opacity: 0; transform: translateY(-20px) } to { opacity: 1; transform: translateY(0) }',
    'fade-in-left': 'from { opacity: 0; transform: translateX(-20px) } to { opacity: 1; transform: translateX(0) }',
    'fade-in-right': 'from { opacity: 0; transform: translateX(20px) } to { opacity: 1; transform: translateX(0) }',
    
    // Slide animations
    'slide-in-up': 'from { transform: translateY(100%) } to { transform: translateY(0) }',
    'slide-in-down': 'from { transform: translateY(-100%) } to { transform: translateY(0) }',
    'slide-in-left': 'from { transform: translateX(-100%) } to { transform: translateX(0) }',
    'slide-in-right': 'from { transform: translateX(100%) } to { transform: translateX(0) }',
    
    // Scale animations
    'scale-in': 'from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 }',
    'scale-out': 'from { transform: scale(1); opacity: 1 } to { transform: scale(0.95); opacity: 0 }',
    'scale-up': 'from { transform: scale(0.9) } to { transform: scale(1) }',
    'scale-down': 'from { transform: scale(1.1) } to { transform: scale(1) }',
    
    // Bounce and pulse
    'bounce-gentle': '0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) }',
    'bounce-subtle': '0%, 100% { transform: translateY(0) } 50% { transform: translateY(-5px) }',
    'pulse-gentle': '0%, 100% { opacity: 1 } 50% { opacity: 0.7 }',
    'pulse-glow': '0%, 100% { box-shadow: 0 0 20px rgba(8, 45, 70, 0.3) } 50% { box-shadow: 0 0 30px rgba(8, 45, 70, 0.5) }',
    
    // Rotation
    'spin-slow': 'from { transform: rotate(0deg) } to { transform: rotate(360deg) }',
    'spin-reverse': 'from { transform: rotate(360deg) } to { transform: rotate(0deg) }',
    
    // Float effect
    'float': '0%, 100% { transform: translateY(0) } 50% { transform: translateY(-15px) }',
    'float-subtle': '0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) }',
    
    // Shimmer effect
    'shimmer': '0% { background-position: -1000px 0 } 100% { background-position: 1000px 0 }',
    
    // Wiggle
    'wiggle': '0%, 100% { transform: rotate(0deg) } 25% { transform: rotate(-3deg) } 75% { transform: rotate(3deg) }',
    
    // Shake
    'shake': '0%, 100% { transform: translateX(0) } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) } 20%, 40%, 60%, 80% { transform: translateX(5px) }',
    
    // Gradient animation
    'gradient-shift': '0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% }',
    
    // Blur in
    'blur-in': 'from { filter: blur(10px); opacity: 0 } to { filter: blur(0); opacity: 1 }',
    
    // Slide and fade
    'slide-fade-up': 'from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) }',
    'slide-fade-down': 'from { opacity: 0; transform: translateY(-30px) } to { opacity: 1; transform: translateY(0) }',
  },
  duration: {
    instant: '100ms',
    fast: '200ms',
    normal: '300ms',
    medium: '400ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },
};

// Gradients - Modern and sophisticated
export const gradients = {
  // Brand gradients
  primary: 'linear-gradient(135deg, #082d46 0%, #08689b 100%)',
  'primary-soft': 'linear-gradient(135deg, #082d46 0%, #08537c 100%)',
  'primary-vibrant': 'linear-gradient(135deg, #08689b 0%, #3387af 100%)',
  accent: 'linear-gradient(135deg, #c00101 0%, #ff3333 100%)',
  'accent-soft': 'linear-gradient(135deg, #c00101 0%, #990101 100%)',
  
  // Surface gradients
  surface: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  'surface-elevated': 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
  subtle: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  
  // Hero gradients
  hero: 'linear-gradient(135deg, #082d46 0%, #08689b 50%, #c00101 100%)',
  'hero-dark': 'linear-gradient(135deg, #030f18 0%, #082d46 50%, #660000 100%)',
  'hero-light': 'linear-gradient(135deg, #66a5c3 0%, #99c3d7 50%, #ff6666 100%)',
  
  // Card gradients
  card: 'linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #f8fafc 100%)',
  'card-hover': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  'card-premium': 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
  
  // Overlay gradients
  overlay: 'linear-gradient(135deg, rgba(8, 45, 70, 0.8) 0%, rgba(192, 1, 1, 0.8) 100%)',
  'overlay-dark': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
  'overlay-light': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%)',
  
  // Shimmer effect
  shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
  
  // Mesh gradients (modern multi-color)
  mesh: 'radial-gradient(at 0% 0%, #082d46 0%, transparent 50%), radial-gradient(at 100% 100%, #c00101 0%, transparent 50%), radial-gradient(at 50% 50%, #08689b 0%, transparent 50%)',
  'mesh-subtle': 'radial-gradient(at 0% 0%, rgba(8, 45, 70, 0.1) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(192, 1, 1, 0.1) 0%, transparent 50%)',
};

// Micro-interactions and effects
export const effects = {
  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  'glass-dark': {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  // Neumorphism
  neumorphic: {
    light: 'inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.9)',
    dark: 'inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.1)',
  },
  
  // Glow effects
  glow: {
    primary: '0 0 20px rgba(8, 45, 70, 0.3), 0 0 40px rgba(8, 45, 70, 0.2)',
    accent: '0 0 20px rgba(192, 1, 1, 0.3), 0 0 40px rgba(192, 1, 1, 0.2)',
    success: '0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.2)',
    warning: '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.2)',
  },
  
  // Hover lift effect
  lift: {
    transform: 'translateY(-4px)',
    shadow: '0 12px 24px -10px rgba(0, 0, 0, 0.15)',
  },
  'lift-subtle': {
    transform: 'translateY(-2px)',
    shadow: '0 8px 16px -8px rgba(0, 0, 0, 0.1)',
  },
};

// Export the complete theme
export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  transitions,
  zIndex,
  animations,
  gradients,
  effects,
};

export default theme;
