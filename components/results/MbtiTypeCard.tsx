import React from 'react';
import { MBTI_DESCRIPTIONS_FA, AxisCertainty } from '@/lib/scoring/mbti';

export interface MbtiTypeCardProps {
  type: string;
  certainty: Record<string, number>;
  certaintyScores?: Record<string, AxisCertainty>;
}

export const MbtiTypeCard: React.FC<MbtiTypeCardProps> = ({
  type,
  certainty,
  certaintyScores,
}) => {
  const info = MBTI_DESCRIPTIONS_FA[type] || {
    title: type.includes('X') ? 'پروفایل شخصیتی با ابعاد متوازن (خنثی)' : 'تیپ شخصیتی تحلیل‌شده',
    subtitle: 'ترکیب ۴ محور ترجیحات روانی MBTI',
  };

  const axesList = [
    { key: 'EI', label: 'جهت‌گیری انرژی', firstLetter: 'E', secondLetter: 'I', first: 'E (برون‌گرا)', second: 'I (درون‌گرا)' },
    { key: 'SN', label: 'نوع ادراک', firstLetter: 'S', secondLetter: 'N', first: 'S (حسی)', second: 'N (شهودی)' },
    { key: 'TF', label: 'تصمیم‌گیری', firstLetter: 'T', secondLetter: 'F', first: 'T (فکری)', second: 'F (احساسی)' },
    { key: 'JP', label: 'سبک زندگی', firstLetter: 'J', secondLetter: 'P', first: 'J (قضاوتی)', second: 'P (ادراکی)' },
  ];

  return (
    <div className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-ink-900">تیپ شخصیتی MBTI رکاد</h3>
          <p className="text-xs font-semibold text-ink-500">{info.subtitle}</p>
        </div>
        <div className="bg-navy-50 border-2 border-navy-600 rounded-lg px-4 py-2 text-center">
          <div className="text-[10px] font-bold text-navy-600">کد ۴ حرفی</div>
          <div className="text-2xl font-black text-navy-700 tracking-wider font-numeric">{type}</div>
        </div>
      </div>

      <div className="bg-navy-700 text-white rounded-lg p-4 leaf-card">
        <h4 className="text-lg font-black mb-1">{info.title}</h4>
        <p className="text-xs text-white/80 leading-relaxed font-medium">
          سبک شخصیتی شما نشان‌دهنده الگوی ترجیحی دریافت اطلاعات، تصمیم‌گیری و تعامل روانی است.
        </p>
      </div>

      {/* Axis certainty breakdown */}
      <div className="flex flex-col gap-3.5">
        {axesList.map((axis, idx) => {
          const detail = certaintyScores?.[axis.key];
          let pole1Pct = 50;
          let pole2Pct = 50;
          let isNeutral = false;

          if (detail) {
            pole1Pct = detail.pole1Pct;
            pole2Pct = detail.pole2Pct;
            isNeutral = detail.isNeutral;
          } else {
            const letterAtAxis = type[idx] || 'X';
            const intensity = certainty?.[axis.key] ?? 50;
            if (letterAtAxis === 'X' || intensity === 0) {
              isNeutral = true;
              pole1Pct = 50;
              pole2Pct = 50;
            } else {
              const domPct = 50 + Math.round(intensity / 2);
              const subPct = 100 - domPct;
              const isPole1 = letterAtAxis === axis.firstLetter;
              pole1Pct = isPole1 ? domPct : subPct;
              pole2Pct = isPole1 ? subPct : domPct;
            }
          }

          return (
            <div key={axis.key} className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-300 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-ink-900">{axis.label}</span>
                <span className="font-numeric text-navy-700">
                  {isNeutral ? '۵۰٪ / ۵۰٪ (بدون تمایل مشخص)' : `${axis.first}: ${pole1Pct}٪ | ${axis.second}: ${pole2Pct}٪`}
                </span>
              </div>

              {/* Dual Progress Bar */}
              <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-navy-600 h-full transition-all"
                  style={{ width: `${pole1Pct}%` }}
                  title={`${axis.first}: ${pole1Pct}%`}
                />
                <div
                  className="bg-pink-500 h-full transition-all"
                  style={{ width: `${pole2Pct}%` }}
                  title={`${axis.second}: ${pole2Pct}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
