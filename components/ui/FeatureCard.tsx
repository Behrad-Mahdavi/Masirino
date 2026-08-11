import React from 'react';
import { clsx } from 'clsx';

export interface FeatureCardProps {
  index: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  brand?: 'rokad' | 'girl' | 'boy' | 'third';
  rotation?: 'left' | 'right' | 'none';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  index,
  title,
  body,
  icon,
  brand = 'rokad',
  rotation = 'none',
}) => {
  const rotationClass = {
    left: 'rotate-subtle-neg',
    right: 'rotate-subtle-pos',
    none: '',
  }[rotation];

  return (
    <div
      data-brand={brand}
      className={clsx(
        'relative p-6 rounded-lg bg-neutral-50 border-thick border-ink-900 elevated-lg transition-all duration-200 hover:translate-y-[-4px]',
        rotationClass
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-numeric text-3xl font-black text-neutral-300 select-none">
          {index}
        </span>
        <div className="w-10 h-10 rounded-md bg-[var(--brand-accent)] text-white flex items-center justify-center shadow-flat-sm">
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-black text-ink-900 mb-2">{title}</h3>
      <p className="text-sm font-medium text-ink-500 leading-relaxed">{body}</p>
    </div>
  );
};
