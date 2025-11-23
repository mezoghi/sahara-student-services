import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20',
        secondary:
          'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200',
        success:
          'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
        warning:
          'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100',
        error:
          'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
        info:
          'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100',
        accent:
          'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20',
        gradient:
          'bg-gradient-to-r from-primary to-primary-600 text-white border-0 shadow-soft',
        outline:
          'bg-transparent border-2 border-current hover:bg-current/5',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce-subtle',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

function BadgeEnhanced({
  className,
  variant,
  size,
  animation,
  icon,
  dot,
  removable,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, animation }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-yellow-500',
            variant === 'error' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'default' && 'bg-primary',
            variant === 'accent' && 'bg-accent'
          )}
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 flex-shrink-0 hover:opacity-70 transition-opacity focus:outline-none"
          aria-label="Remove badge"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export { BadgeEnhanced, badgeVariants };
