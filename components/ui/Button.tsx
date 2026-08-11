import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emphasis' | 'secondary' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  brand?: 'rokad' | 'girl' | 'boy' | 'third';
  rotated?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  brand = 'rokad',
  rotated = false,
  loading = false,
  disabled = false,
  children,
  icon,
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2';

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs rounded-md gap-1.5',
    md: 'px-6 py-2.5 text-sm rounded-md gap-2',
    lg: 'px-8 py-3.5 text-base rounded-md gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-teal-800 hover:bg-teal-700 text-white shadow-flat-sm active:translate-x-[2px] active:translate-y-[2px]',
    emphasis:
      'bg-navy-700 hover:bg-navy-600 text-white rounded-xs shadow-flat-sm active:translate-x-[2px] active:translate-y-[2px]',
    secondary:
      'bg-white text-ink-900 border-thick border-ink-900 shadow-flat-md hover:shadow-flat-sm hover:translate-x-[-2px] hover:translate-y-[2px] active:translate-x-[-4px] active:translate-y-[4px]',
    brand:
      'bg-[var(--brand-accent)] hover:brightness-105 text-[var(--brand-on-accent)] shadow-flat-sm active:translate-x-[2px] active:translate-y-[2px]',
  };

  const rotationClass = rotated ? 'rotate-default-neg md:rotate-0' : '';
  const disabledClass = disabled || loading ? 'opacity-45 pointer-events-none shadow-none' : '';

  return (
    <button
      data-brand={brand}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        rotationClass,
        disabledClass,
        className
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
