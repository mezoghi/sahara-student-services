import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const InputEnhanced = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon,
    showPasswordToggle,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-semibold text-neutral-700 mb-2 transition-colors duration-200"
          >
            {label}
            {props.required && <span className="text-accent-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              'flex h-12 w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition-all duration-300',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
              'hover:border-neutral-300',
              leftIcon && 'pl-12',
              (rightIcon || showPasswordToggle) && 'pr-12',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500/10',
              isFocused && !error && 'shadow-soft',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              ) : (
                <div className="text-neutral-400">{rightIcon}</div>
              )}
            </div>
          )}
          
          {/* Focus indicator line */}
          <div 
            className={cn(
              'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary-600 transition-all duration-300 rounded-full',
              isFocused && !error ? 'w-full' : 'w-0'
            )}
          />
        </div>
        
        {(error || helperText) && (
          <div className={cn(
            'text-sm transition-all duration-200',
            error ? 'text-red-600 animate-shake' : 'text-neutral-500'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

InputEnhanced.displayName = 'InputEnhanced';

export { InputEnhanced };
