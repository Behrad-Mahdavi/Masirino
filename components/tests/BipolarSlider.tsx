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

  const getStepHintText = (s: number | null) => {
    if (s === 1) return 'کاملاً موافق با عبارت ۱ (راست)';
    if (s === 2) return 'تا حدودی موافق با عبارت ۱';
    if (s === 3) return 'حالت میانی و خنثی';
    if (s === 4) return 'تا حدودی موافق با عبارت ۲';
    if (s === 5) return 'کاملاً موافق با عبارت ۲ (چپ)';
    return 'لطفاً یکی از اعداد ۱ تا ۵ روی طیف را انتخاب نمایید';
  };

  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 elevated-md mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="font-numeric w-7 h-7 rounded-lg bg-navy-50 text-navy-700 border border-navy-600 font-extrabold flex items-center justify-center text-xs sm:text-sm shrink-0">
          {index}
        </span>
        <span className="text-xs sm:text-sm font-bold text-navy-700">انتخاب ترجیح روی طیف ۵ درجه‌ای</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div
          className={clsx(
            'p-3.5 sm:p-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all',
            value !== null && value <= 2
              ? 'bg-navy-50 text-navy-900 border-navy-600 shadow-sm'
              : 'bg-neutral-50 text-ink-800 border-neutral-300'
          )}
        >
          <span className="text-[11px] sm:text-xs text-navy-700 block mb-1 font-numeric font-bold">
            عبارت ۱ (انتخاب عدد ۱ تا ۲)
          </span>
          <p className="leading-relaxed">{leftText}</p>
        </div>

        <div
          className={clsx(
            'p-3.5 sm:p-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all md:text-left',
            value !== null && value >= 4
              ? 'bg-pink-50 text-pink-900 border-pink-500 shadow-sm'
              : 'bg-neutral-50 text-ink-800 border-neutral-300'
          )}
        >
          <span className="text-[11px] sm:text-xs text-pink-700 block mb-1 font-numeric font-bold md:text-left">
            عبارت ۲ (انتخاب عدد ۴ تا ۵)
          </span>
          <p className="leading-relaxed">{rightText}</p>
        </div>
      </div>

      {/* 5-Step Continuum — Mobile Responsive Stack */}
      <div className="flex flex-col gap-3 bg-neutral-50/80 p-3 sm:p-4 rounded-xl border border-neutral-300">
        <div className="flex justify-between items-center text-[11px] sm:text-xs font-extrabold px-1">
          <span className="text-navy-800 flex items-center gap-1">
            <span>←</span>
            <span>موافق با عبارت ۱</span>
          </span>
          <span className="text-pink-800 flex items-center gap-1">
            <span>موافق با عبارت ۲</span>
            <span>→</span>
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-center gap-1.5 min-[380px]:gap-2.5 sm:gap-4 w-full">
          {steps.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={clsx(
                'w-9 h-9 min-[380px]:w-10 min-[380px]:h-10 sm:w-11 sm:h-11 rounded-full font-numeric font-black text-xs sm:text-base border-2 transition-all flex items-center justify-center select-none cursor-pointer shrink-0 active:scale-95 touch-manipulation',
                value === s
                  ? 'bg-navy-700 text-white border-ink-900 shadow-flat-sm scale-105 sm:scale-110'
                  : 'bg-white text-ink-700 border-neutral-300 hover:border-navy-600 hover:bg-navy-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="text-center text-[11px] sm:text-xs font-bold text-ink-600 pt-1 border-t border-neutral-200">
          {getStepHintText(value)}
        </div>
      </div>
    </div>
  );
};
