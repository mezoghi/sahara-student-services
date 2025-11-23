'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();
  const { theme } = useTheme();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          className={`${theme === 'dark' ? 'dark' : ''} ${props.className || ''}`}
          {...props}
        >
          <div className="grid gap-1">
            {title && <div className="font-semibold">{title}</div>}
            {description && (
              <div className="text-sm opacity-90">{description}</div>
            )}
          </div>
          {action}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
