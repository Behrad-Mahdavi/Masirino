import React from 'react';
import { clsx } from 'clsx';

export interface BipolarSliderProps {
  index: number;
  leftText: string;
  rightText: string;
  value: number | null; // 1 to 5
  onChange: (val: number) => void;
}

export const BipolarSlider: React.FC<BipolarSliderProps> = ({
  index,
  leftText,
  rightText,
  value,
  onChange,
}) => {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="font-numeric w-7 h-7 rounded-md bg-navy-50 text-navy-700 border border-navy-600 font-extrabold flex items-center justify-center text-sm">
          {index}
        </span>
        <span className="text-xs font-bold text-navy-600">انتخاب ترجیح روی طیف ۵ درجه‌ای</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={clsx(
            'p-4 rounded-lg border-2 text-sm font-bold transition-all',
            value !== null && value <= 2
              ? 'bg-navy-50 text-navy-700 border-navy-600 shadow-sm'
              : 'bg-neutral-25 text-ink-800 border-neutral-300'
          )}
        >
          <span className="text-xs text-navy-600 block mb-1 font-numeric">عبارت ۱ (انتخاب عدد ۱ تا ۲)</span>
          {leftText}
        </div>
        <div
          className={clsx(
            'p-4 rounded-lg border-2 text-sm font-bold transition-all md:text-left',
            value !== null && value >= 4
              ? 'bg-pink-50 text-pink-700 border-pink-500 shadow-sm'
              : 'bg-neutral-25 text-ink-800 border-neutral-300'
          )}
        >
          <span className="text-xs text-pink-600 block mb-1 font-numeric">عبارت ۲ (انتخاب عدد ۴ تا ۵)</span>
          {rightText}
        </div>
      </div>

      {/* 5-Step Continuum */}
      <div className="flex justify-between items-center gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-300">
        <span className="text-xs font-bold text-navy-700">← موافق با عبارت ۱</span>
        <div className="flex items-center gap-3">
          {steps.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={clsx(
                'w-10 h-10 rounded-full font-numeric font-bold border-2 transition-all flex items-center justify-center select-none cursor-pointer',
                value === s
                  ? 'bg-navy-700 text-white border-ink-900 shadow-flat-sm scale-110'
                  : 'bg-white text-ink-700 border-neutral-300 hover:border-navy-600 hover:bg-navy-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-pink-700">موافق با عبارت ۲ →</span>
      </div>
    </div>
  );
};
