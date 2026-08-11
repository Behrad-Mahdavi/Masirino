import React from 'react';
import { DISC_DIMENSIONS_FA } from '@/lib/scoring/disc';

export interface DiscProfileCardProps {
  profile: string;
  scores: Record<string, number>;
}

export const DiscProfileCard: React.FC<DiscProfileCardProps> = ({ profile, scores }) => {
  const primaryKey = profile[0];
  const info = DISC_DIMENSIONS_FA[primaryKey] || {
    title: 'پروفایل رفتارشناسی DISC',
    desc: 'تحلیل ویژگی‌های رفتاری غالب فردی',
  };

  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black text-ink-900">پروفایل رفتاری DISC</h3>
          <p className="text-xs font-semibold text-ink-500">ارزیابی مدل رفتاری در چالش‌ها و کار تیمی</p>
        </div>
        <div className="bg-pink-50 border-2 border-pink-500 rounded-lg px-4 py-2 text-center">
          <div className="text-[10px] font-bold text-pink-700">پروفایل غالب</div>
          <div className="text-2xl font-black text-pink-700 tracking-wider font-numeric">{profile}</div>
        </div>
      </div>

      <div className="bg-pink-50 border border-pink-500 text-pink-700 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-black mb-1">{info.title}</h4>
        <p className="text-xs text-pink-800 leading-relaxed font-bold">{info.desc}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {['D', 'I', 'S', 'C'].map((dim) => {
          const score = scores[dim] ?? 0;
          return (
            <div
              key={dim}
              className="bg-neutral-50 border border-neutral-300 rounded-lg p-3 text-center"
            >
              <span className="text-xs font-black text-ink-500 block mb-1">بعد {dim}</span>
              <span className="font-numeric text-xl font-black text-ink-900">{score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
