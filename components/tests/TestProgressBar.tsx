import React from 'react';

export interface TestProgressBarProps {
  current: number;
  total: number;
  testName: string;
}

export const TestProgressBar: React.FC<TestProgressBarProps> = ({ current, total, testName }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full bg-neutral-50 border-thick border-ink-900 rounded-xl p-4 elevated-sm mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-black text-ink-900">{testName}</span>
        <span className="font-numeric text-sm font-bold text-teal-700">
          سوال {current} از {total} ({percentage}٪)
        </span>
      </div>
      <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden border border-neutral-300">
        <div
          className="bg-teal-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
