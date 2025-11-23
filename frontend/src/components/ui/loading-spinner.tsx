import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'white' | 'current';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
  xl: 'h-16 w-16 border-4',
};

const colorClasses = {
  primary: 'border-primary border-t-transparent',
  accent: 'border-accent border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Full page loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="text-center">
        <LoadingSpinner size="xl" color="primary" />
        {message && (
          <p className="mt-4 text-lg font-medium text-neutral-700">{message}</p>
        )}
      </div>
    </div>
  );
}

// Inline loading state
export function LoadingInline({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" />
        {message && (
          <p className="mt-3 text-sm text-neutral-600">{message}</p>
        )}
      </div>
    </div>
  );
}

// Dots loading animation
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
    </div>
  );
}

// Pulse loading animation
export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
      <span className="h-3 w-3 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
      <span className="h-3 w-3 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
    </div>
  );
}
