import React from 'react';
import { clsx } from 'clsx';

export interface LikertQuestionProps {
  questionId: string;
  index: number;
  text: string;
  value: number | null; // 1 to 5
  onChange: (value: number) => void;
}

const LIKERT_OPTIONS = [
  { value: 1, label: 'اصلاً' },
  { value: 2, label: 'کم' },
  { value: 3, label: 'متوسط' },
  { value: 4, label: 'زیاد' },
  { value: 5, label: 'خیلی زیاد' },
];

export const LikertQuestion: React.FC<LikertQuestionProps> = ({
  index,
  text,
  value,
  onChange,
}) => {
  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 elevated-md mb-4 sm:mb-6 transition-all">
      <div className="flex items-start gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        <span className="font-numeric w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-50 text-teal-800 border border-teal-500 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
          {index}
        </span>
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-ink-900 pt-0.5 leading-snug sm:leading-relaxed">
          {text}
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-1 min-[380px]:gap-1.5 sm:gap-3">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={clsx(
                'flex flex-col items-center justify-center px-1 py-2 sm:p-3 rounded-lg sm:rounded-xl border-1.5 sm:border-2 transition-all font-bold select-none cursor-pointer active:scale-95 touch-manipulation',
                isSelected
                  ? 'bg-teal-700 text-white border-ink-900 shadow-flat-sm -translate-y-0.5'
                  : 'bg-neutral-50 text-ink-700 border-neutral-300 hover:border-teal-500 hover:bg-teal-50/70'
              )}
            >
              <span className="font-numeric text-sm sm:text-base md:text-lg font-black mb-0.5 leading-none">
                {opt.value}
              </span>
              <span className="text-[10px] min-[380px]:text-[11px] sm:text-xs md:text-sm font-bold text-center leading-tight break-words">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
