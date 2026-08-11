import React from 'react';
import { clsx } from 'clsx';

export interface ChipProps {
  variant?: 'outline' | 'pill' | 'badge' | 'label';
  brand?: 'rokad' | 'girl' | 'boy' | 'third';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'outline',
  brand = 'rokad',
  dot = false,
  children,
  className,
}) => {
  const variantStyles = {
    outline:
      'bg-white border border-teal-500 text-teal-700 rounded-md font-bold px-3 py-1 text-xs shadow-sm',
    pill: 'bg-white/20 backdrop-blur-md text-white rounded-full px-4 py-1.5 text-xs font-semibold',
    badge: 'bg-navy-700 text-white rounded-xs px-2.5 py-1 text-xs font-extrabold rotate-subtle-neg inline-block',
    label: 'bg-neutral-0 border border-neutral-300 text-ink-900 rounded-md px-3 py-1 text-xs font-bold',
  };

  return (
    <span
      data-brand={brand}
      className={clsx(
        'inline-flex items-center gap-1.5 leading-none',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className="w-2 h-2 rounded-full bg-[var(--brand-accent)] animate-pulse shrink-0" />
      )}
      {children}
    </span>
  );
};
