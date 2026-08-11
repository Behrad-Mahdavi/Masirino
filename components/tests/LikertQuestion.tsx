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
    <div className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md mb-6 transition-all">
      <div className="flex items-start gap-3 mb-6">
        <span className="font-numeric w-8 h-8 rounded-md bg-teal-50 text-teal-800 border border-teal-500 font-extrabold flex items-center justify-center shrink-0">
          {index}
        </span>
        <h3 className="text-lg font-bold text-ink-900 pt-1 leading-snug">{text}</h3>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={clsx(
                'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all font-bold text-xs sm:text-sm select-none',
                isSelected
                  ? 'bg-teal-700 text-white border-ink-900 shadow-flat-sm translate-y-[-2px]'
                  : 'bg-neutral-50 text-ink-700 border-neutral-300 hover:border-teal-500 hover:bg-teal-50'
              )}
            >
              <span className="font-numeric text-base sm:text-lg mb-0.5">{opt.value}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
