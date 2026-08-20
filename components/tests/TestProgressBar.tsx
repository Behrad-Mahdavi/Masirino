import React from 'react';

export interface TestProgressBarProps {
  current: number;
  total: number;
  testName: string;
}

export const TestProgressBar: React.FC<TestProgressBarProps> = ({ current, total, testName }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full bg-neutral-50 border-thick border-ink-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 elevated-sm mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2 mb-2">
        <span className="text-xs sm:text-sm md:text-base font-black text-ink-900 line-clamp-1">{testName}</span>
        <span className="font-numeric text-[11px] sm:text-xs md:text-sm font-bold text-teal-800 shrink-0">
          سوال {current} از {total} ({percentage}٪)
        </span>
      </div>
      <div className="w-full bg-neutral-200 h-2.5 sm:h-3 rounded-full overflow-hidden border border-neutral-300">
        <div
          className="bg-teal-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
