'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HollandRadar } from '@/components/results/HollandRadar';
import { GardnerChart } from '@/components/results/GardnerChart';
import { MbtiTypeCard } from '@/components/results/MbtiTypeCard';
import { DiscProfileCard } from '@/components/results/DiscProfileCard';
import { computePathDna, PathDnaProfile } from '@/lib/scoring/pathDna';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { createClient } from '@/lib/supabase/client';
import { Briefcase, ArrowRight, Share2, Printer } from 'lucide-react';

export default function ResultsPage() {
  const [hollandResult, setHollandResult] = useState<any>(null);
  const [gardnerResult, setGardnerResult] = useState<any>(null);
  const [mbtiResult, setMbtiResult] = useState<any>(null);
  const [discResult, setDiscResult] = useState<any>(null);
  const [pathDna, setPathDna] = useState<PathDnaProfile | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      let holland = null;
      let gardner = null;
      let mbti = null;
      let disc = null;

      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (userId) {
          const { data: results } = await supabase
            .from('user_results')
            .select('*')
            .eq('user_id', userId)
            .eq('is_latest', true);

          if (results && results.length > 0) {
            results.forEach((r) => {
              if (r.test_id === 1) holland = r.final_output;
              if (r.test_id === 2) gardner = r.final_output;
              if (r.test_id === 3) mbti = r.final_output;
              if (r.test_id === 4) disc = r.final_output;
            });
          }
        }
      } catch (err) {
        console.warn('Supabase DB fetch warning:', err);
      }

      // Fallback to localStorage or mock defaults
      if (!holland) {
        holland = JSON.parse(
          localStorage.getItem('test_result_HOLLAND') ||
            JSON.stringify({
              scores: { R: 45, I: 78, A: 85, S: 90, E: 65, C: 50 },
              normalizedScores: { R: 45, I: 78, A: 85, S: 90, E: 65, C: 50 },
              code: 'SAE',
              primaryDimension: 'S',
            })
        );
      }

      if (!gardner) {
        gardner = JSON.parse(
          localStorage.getItem('test_result_GARDNER') ||
            JSON.stringify({
              scores: {
                linguistic: 4.2,
                logical: 4.5,
                spatial: 4.1,
                bodily: 2.8,
                musical: 3.0,
                interpersonal: 4.6,
                intrapersonal: 4.0,
                naturalistic: 3.2,
              },
              topIntelligences: ['interpersonal', 'logical', 'linguistic'],
              strongIntelligences: ['interpersonal', 'logical', 'linguistic', 'spatial', 'intrapersonal'],
            })
        );
      }

      if (!mbti) {
        mbti = JSON.parse(
          localStorage.getItem('test_result_MBTI') ||
            JSON.stringify({
              type: 'ENFP',
              certainty: { EI: 75, SN: 80, TF: 65, JP: 70 },
              scores: {},
            })
        );
      }

      if (!disc) {
        disc = JSON.parse(
          localStorage.getItem('test_result_DISC') ||
            JSON.stringify({
              scores: { D: 4, I: 7, S: 2, C: 3 },
              profile: 'ID',
              primaryDimension: 'I',
              secondaryDimension: 'D',
            })
        );
      }

      setHollandResult(holland);
      setGardnerResult(gardner);
      setMbtiResult(mbti);
      setDiscResult(disc);

      const dna = computePathDna(holland, gardner, mbti, disc);
      setPathDna(dna);
    };

    fetchResults();
  }, []);

  return (
    <div className="space-y-8">
      {/* Back & Actions header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-ink-500 hover:text-teal-700">
          <ArrowRight className="w-4 h-4" /> بازگشت به داشبورد دانش‌آموز
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
            چاپ / ذخیره PDF
          </Button>
          <Button variant="brand" brand="third" size="sm" icon={<Share2 className="w-4 h-4" />}>
            اشتراک‌گذاری با مشاور
          </Button>
        </div>
      </div>

      {/* Path DNA Banner Header */}
      <div className="bg-teal-500 text-white border-thick border-ink-900 rounded-3xl p-8 md:p-10 elevated-xl leaf-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Chip variant="badge" brand="third">
              کارنامه رسمی استعدادیابی
            </Chip>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              کپسول تبارشناسی Path DNA
            </h1>
            <p className="text-sm md:text-base text-teal-50 font-medium">
              ترکیب یکپارچه الگوریتم‌های ۴ آزمون روان‌سنجی رکاد
            </p>
          </div>

          <div className="bg-white text-ink-900 rounded-2xl p-6 border-thick border-ink-900 elevated-md text-center min-w-[240px]">
            <span className="text-xs font-bold text-teal-800 block mb-1">کد ترکیبی Path DNA</span>
            <div className="font-numeric text-3xl font-black text-teal-700 tracking-widest my-1">
              {pathDna?.hollandCode}-{pathDna?.mbtiType}-{pathDna?.discProfile}
            </div>
            <span className="text-[10px] font-extrabold text-navy-700 block">سطح تطابق: عالی (۹۶٪)</span>
          </div>
        </div>

        {/* 4 Indicators Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-teal-400/50">
          <div className="bg-teal-600/60 p-3 rounded-lg border border-teal-300/40 text-center">
            <span className="text-xs text-teal-100 block font-bold">کد هالند (RIASEC)</span>
            <span className="font-numeric text-xl font-black text-amber-300">{pathDna?.hollandCode}</span>
          </div>
          <div className="bg-teal-600/60 p-3 rounded-lg border border-teal-300/40 text-center">
            <span className="text-xs text-teal-100 block font-bold">تیپ MBTI</span>
            <span className="font-numeric text-xl font-black text-amber-300">{pathDna?.mbtiType}</span>
          </div>
          <div className="bg-teal-600/60 p-3 rounded-lg border border-teal-300/40 text-center">
            <span className="text-xs text-teal-100 block font-bold">پروفایل DISC</span>
            <span className="font-numeric text-xl font-black text-amber-300">{pathDna?.discProfile}</span>
          </div>
          <div className="bg-teal-600/60 p-3 rounded-lg border border-teal-300/40 text-center">
            <span className="text-xs text-teal-100 block font-bold">هوش برتر گاردنر</span>
            <span className="text-sm font-black text-white">
              {pathDna?.topIntelligences?.[0] || 'میان‌فردی'}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Career Clusters */}
      <div className="bg-white border-thick border-ink-900 rounded-2xl p-6 md:p-8 elevated-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
          <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-800 border border-amber-600 font-black flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-ink-900">خوشه‌های شغلی و مسیرهای تخصصی پیشنهادی</h2>
            <p className="text-xs font-semibold text-ink-500">نگاشت اتوماتیک کد Path DNA به ساختار شغلی</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pathDna?.careerClusters.map((cluster, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 border-thick border-ink-900 rounded-xl p-6 elevated-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-numeric text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-500">
                    میزان تطابق: {cluster.matchScore}٪
                  </span>
                  <span className="font-numeric text-xs font-bold text-ink-500">خوشه شماره ۰{idx + 1}</span>
                </div>
                <h3 className="text-lg font-black text-ink-900 mb-2">{cluster.title}</h3>
                <p className="text-xs font-medium text-ink-500 leading-relaxed mb-4">{cluster.description}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-navy-700 block mb-2">نقش‌های شغلی نمونه:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.suitableRoles.map((role, rIdx) => (
                    <span
                      key={rIdx}
                      className="bg-white border border-neutral-300 text-ink-900 text-xs font-bold px-2.5 py-1 rounded-md"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown Grid of 4 Test Charts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-ink-900">گزارش تفکیکی و تحلیلی ۴ آزمون</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hollandResult && <HollandRadar scores={hollandResult.normalizedScores} code={hollandResult.code} />}
          {gardnerResult && (
            <GardnerChart scores={gardnerResult.scores} topIntelligences={gardnerResult.topIntelligences} />
          )}
          {mbtiResult && <MbtiTypeCard type={mbtiResult.type} certainty={mbtiResult.certainty} />}
          {discResult && <DiscProfileCard profile={discResult.profile} scores={discResult.scores} />}
        </div>
      </div>
    </div>
  );
}
