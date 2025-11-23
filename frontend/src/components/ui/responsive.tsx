import React from 'react';

// Responsive breakpoints hook
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else if (width < 1536) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Mobile detection hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Tablet detection hook
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  return isTablet;
}

// Desktop detection hook
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
}

// Responsive container component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function ResponsiveContainer({ 
  children, 
  size = 'lg', 
  className = '' 
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-8xl',
    full: 'max-w-full'
  };

  return (
    <div className={`container-custom ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 }, 
  gap = 6,
  className = '' 
}: ResponsiveGridProps) {
  const gridClasses = Object.entries(cols)
    .map(([breakpoint, col]) => {
      if (breakpoint === 'xs') return `grid-cols-${col}`;
      return `${breakpoint}:grid-cols-${col}`;
    })
    .join(' ');

  return (
    <div className={`grid ${gridClasses} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ResponsiveText({ 
  children, 
  size = { xs: 'text-sm', md: 'text-base', lg: 'text-lg' }, 
  className = '',
  as: Component = 'p'
}: ResponsiveTextProps) {
  const sizeClasses = Object.entries(size)
    .map(([breakpoint, textSize]) => {
      if (breakpoint === 'xs') return textSize;
      return `${breakpoint}:${textSize}`;
    })
    .join(' ');

  return (
    <Component className={`${sizeClasses} ${className}`}>
      {children}
    </Component>
  );
}

// Responsive spacing component
interface ResponsiveSpacingProps {
  size?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  vertical?: boolean;
  className?: string;
}

export function ResponsiveSpacing({ 
  size = { xs: 4, md: 8, lg: 12 }, 
  vertical = true,
  className = '' 
}: ResponsiveSpacingProps) {
  const spacingClasses = Object.entries(size)
    .map(([breakpoint, spacing]) => {
      const spacingClass = vertical ? `py-${spacing}` : `px-${spacing}`;
      if (breakpoint === 'xs') return spacingClass;
      return `${breakpoint}:${spacingClass}`;
    })
    .join(' ');

  return <div className={`${spacingClasses} ${className}`} />;
}

// Responsive image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = { xs: 100, sm: 100, md: 50, lg: 33, xl: 25 }, 
  className = '',
  priority = false
}: ResponsiveImageProps) {
  const sizeString = Object.entries(sizes)
    .map(([breakpoint, width]) => {
      const breakpointWidth: Record<string, string> = {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      };
      
      return `(max-width: ${breakpointWidth[breakpoint] || '100vw'}) ${width}vw`;
    })
    .reverse()
    .join(', ');

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizeString}
      className={`w-full h-auto object-cover ${className}`}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

// Responsive sidebar component
interface ResponsiveSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  overlay?: boolean;
  className?: string;
}

export function ResponsiveSidebar({ 
  children, 
  isOpen, 
  onClose, 
  position = 'left',
  overlay = true,
  className = '' 
}: ResponsiveSidebarProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <aside className={`${className} hidden lg:block`}>
        {children}
      </aside>
    );
  }

  return (
    <>
      {overlay && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed top-0 ${position}-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : (position === 'left' ? '-translate-x-full' : 'translate-x-full')}
          ${className}
        `}
      >
        {children}
      </aside>
    </>
  );
}

// Responsive navigation component
interface ResponsiveNavProps {
  children: React.ReactNode;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveNav({ 
  children, 
  mobileBreakpoint = 'lg',
  className = '' 
}: ResponsiveNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const shouldShowMobile = (
    (mobileBreakpoint === 'sm' && useBreakpoint() === 'xs') ||
    (mobileBreakpoint === 'md' && ['xs', 'sm'].includes(useBreakpoint())) ||
    (mobileBreakpoint === 'lg' && ['xs', 'sm', 'md'].includes(useBreakpoint()))
  );

  return (
    <nav className={className}>
      {shouldShowMobile ? (
        <div className="lg:hidden">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Mobile menu */}
          <div
            className={`
              fixed inset-0 z-50 flex flex-col pt-20 pb-6 px-6 bg-white
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex flex-col space-y-4">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {children}
        </div>
      )}
    </nav>
  );
}
