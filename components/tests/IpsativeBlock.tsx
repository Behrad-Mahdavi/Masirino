import React from 'react';
import { clsx } from 'clsx';
import { DiscOption } from '@/lib/data/mockQuestions';

export interface IpsativeBlockProps {
  index: number;
  options: DiscOption[];
  most: 'D' | 'I' | 'S' | 'C' | null;
  least: 'D' | 'I' | 'S' | 'C' | null;
  onSelectMost: (dim: 'D' | 'I' | 'S' | 'C') => void;
  onSelectLeast: (dim: 'D' | 'I' | 'S' | 'C') => void;
}

export const IpsativeBlock: React.FC<IpsativeBlockProps> = ({
  index,
  options,
  most,
  least,
  onSelectMost,
  onSelectLeast,
}) => {
  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 elevated-md mb-4 sm:mb-6">
      <div className="flex items-start gap-2.5 sm:gap-3 mb-4">
        <span className="font-numeric w-7 h-7 rounded-lg bg-amber-100 text-amber-800 border border-amber-600 font-extrabold flex items-center justify-center text-xs sm:text-sm shrink-0">
          {index}
        </span>
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-ink-900 leading-snug">
          از بین ۴ گزینه‌ی زیر، یک مورد «بیشترین شباهت (Most)» و یک مورد متفاوت «کمترین شباهت (Least)» را مشخص کنید:
        </h3>
      </div>

      <div className="flex flex-col gap-2.5 sm:gap-3">
        {options.map((opt) => {
          const isMost = most === opt.dimension;
          const isLeast = least === opt.dimension;

          return (
            <div
              key={opt.id}
              className={clsx(
                'p-3.5 sm:p-4 rounded-xl border-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between transition-all gap-3 sm:gap-4',
                isMost
                  ? 'bg-teal-50 border-teal-500 shadow-sm'
                  : isLeast
                  ? 'bg-pink-50 border-pink-500 shadow-sm'
                  : 'bg-neutral-50 border-neutral-300'
              )}
            >
              <p className="text-xs sm:text-sm font-bold text-ink-900 flex-1 leading-relaxed">{opt.label}</p>

              <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onSelectMost(opt.dimension)}
                  className={clsx(
                    'w-full sm:w-auto px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all border select-none cursor-pointer flex items-center justify-center min-h-[36px] sm:min-h-[32px] active:scale-95 touch-manipulation',
                    isMost
                      ? 'bg-teal-700 text-white border-ink-900 shadow-flat-sm'
                      : 'bg-white text-teal-800 border-teal-500 hover:bg-teal-50'
                  )}
                >
                  بیشترین (Most)
                </button>

                <button
                  type="button"
                  onClick={() => onSelectLeast(opt.dimension)}
                  className={clsx(
                    'w-full sm:w-auto px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all border select-none cursor-pointer flex items-center justify-center min-h-[36px] sm:min-h-[32px] active:scale-95 touch-manipulation',
                    isLeast
                      ? 'bg-pink-700 text-white border-ink-900 shadow-flat-sm'
                      : 'bg-white text-pink-700 border-pink-500 hover:bg-pink-50'
                  )}
                >
                  کمترین (Least)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
