import React from 'react';
import { clsx } from 'clsx';
import { Chip } from './Chip';

export interface StatCardProps {
  label: string;
  value: string;
  title: string;
  caption?: string;
  brand?: 'rokad' | 'girl' | 'boy' | 'third';
  rotation?: 'left' | 'right' | 'none';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  title,
  caption,
  brand = 'rokad',
  rotation = 'left',
}) => {
  const rotationClass = {
    left: 'rotate-default-neg',
    right: 'rotate-default-pos',
    none: '',
  }[rotation];

  return (
    <div
      data-brand={brand}
      className={clsx(
        'w-full max-w-[280px] p-5 leaf-card bg-[var(--brand-tint)] border-thick border-[var(--brand-accent)] elevated-md transition-transform duration-200 hover:rotate-0 hover:scale-105',
        rotationClass
      )}
    >
      <div className="flex flex-col gap-2">
        <div>
          <Chip variant="outline" brand={brand}>
            {label}
          </Chip>
        </div>

        <div className="font-numeric text-5xl font-black text-[var(--brand-accent-deep)] tracking-tight my-1">
          {value}
        </div>

        <div className="font-bold text-ink-900 text-lg leading-tight">{title}</div>

        {caption && <div className="text-xs font-medium text-ink-500">{caption}</div>}
      </div>
    </div>
  );
};
