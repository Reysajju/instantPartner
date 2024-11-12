import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
          'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50': variant === 'secondary',
          'hover:bg-gray-100': variant === 'ghost',
          'h-9 px-4 text-sm': size === 'sm',
          'h-11 px-8 text-base': size === 'md',
          'h-14 px-12 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}