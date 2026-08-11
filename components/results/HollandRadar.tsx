'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export interface HollandRadarProps {
  scores: Record<string, number>;
  code: string;
}

const DIMENSION_NAMES: Record<string, string> = {
  R: 'واقع‌گرا (R)',
  I: 'جستجوگر (I)',
  A: 'هنری (A)',
  S: 'اجتماعی (S)',
  E: 'متهورانه (E)',
  C: 'قراردادی (C)',
};

const COLORS: Record<string, string> = {
  R: '#347E75',
  I: '#202A5A',
  A: '#E0195B',
  S: '#F8A41D',
  E: '#58BDAF',
  C: '#333230',
};

export const HollandRadar: React.FC<HollandRadarProps> = ({ scores, code }) => {
  const data = Object.entries(scores).map(([key, val]) => ({
    name: DIMENSION_NAMES[key] || key,
    key,
    score: val,
  }));

  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black text-ink-900">نتیجه کد رغبت‌سنجی هالند</h3>
          <p className="text-xs font-semibold text-ink-500">توزیع شش‌گانه رغبت‌های شغلی RIASEC</p>
        </div>
        <div className="bg-teal-50 border-2 border-teal-500 rounded-lg px-4 py-2 text-center">
          <div className="text-[10px] font-bold text-teal-800">کد هالند نهایی</div>
          <div className="text-2xl font-black text-teal-700 tracking-wider font-numeric">{code}</div>
        </div>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#292827' }} />
            <YAxis tick={{ fontSize: 11, fontWeight: 'bold' }} domain={[0, 100]} />
            <Tooltip
              formatter={(val: number) => [`${val}٪`, 'امتیاز نرمال‌سازی']}
              contentStyle={{ borderRadius: '8px', fontWeight: 'bold' }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={COLORS[entry.key] || '#58BDAF'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
