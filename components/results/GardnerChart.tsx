'use client';

import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { GARDNER_DIMENSIONS_FA } from '@/lib/scoring/gardner';

export interface GardnerChartProps {
  scores: Record<string, number>;
  topIntelligences: string[];
}

export const GardnerChart: React.FC<GardnerChartProps> = ({ scores, topIntelligences }) => {
  const data = Object.entries(scores).map(([key, val]) => ({
    subject: GARDNER_DIMENSIONS_FA[key] || key,
    score: val,
    fullMark: 5.0,
  }));

  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-black text-ink-900">نمودار هوش‌های چندگانه گاردنر</h3>
          <p className="text-xs font-semibold text-ink-500">پروفایل راداری ۸ بعدی توانمندی ذهنی</p>
        </div>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#EDECEC" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#292827' }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Radar name="میانگین امتیاز" dataKey="score" stroke="#58BDAF" fill="#58BDAF" fillOpacity={0.5} />
            <Tooltip formatter={(val: number) => [`${val} از ۵`, 'امتیاز هوش']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <span className="text-xs font-black text-ink-900 block mb-2">هوش‌های برتر استخراج‌شده:</span>
        <div className="flex flex-wrap gap-2">
          {topIntelligences.map((key) => (
            <span
              key={key}
              className="bg-teal-50 border border-teal-500 text-teal-800 px-3 py-1 rounded-md text-xs font-bold"
            >
              {GARDNER_DIMENSIONS_FA[key] || key} ({scores[key] ?? 0} از ۵)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
