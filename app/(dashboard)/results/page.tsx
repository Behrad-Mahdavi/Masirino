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
import {
  Briefcase,
  ArrowRight,
  Share2,
  Printer,
  Compass,
  CheckCircle2,
  GraduationCap,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

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
              certaintyScores: {
                EI: { dominantLetter: 'E', intensityPct: 75, pole1Pct: 88, pole2Pct: 12, isNeutral: false },
                SN: { dominantLetter: 'N', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false },
                TF: { dominantLetter: 'F', intensityPct: 65, pole1Pct: 18, pole2Pct: 82, isNeutral: false },
                JP: { dominantLetter: 'P', intensityPct: 70, pole1Pct: 15, pole2Pct: 85, isNeutral: false },
              },
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

      {/* Completeness Warning Banner if tests incomplete */}
      {pathDna?.completenessWarning && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-4 flex items-center gap-3 text-amber-900 elevated-sm">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
          <p className="text-xs font-bold leading-relaxed">{pathDna.completenessWarning}</p>
        </div>
      )}

      {/* Path DNA Banner Header */}
      <div className="bg-teal-500 text-white border-thick border-ink-900 rounded-3xl p-8 md:p-10 elevated-xl leaf-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Chip variant="badge" brand="third">
              کارنامه هدایت تحصیلی نهم به دهم
            </Chip>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              کپسول تبارشناسی Path DNA
            </h1>
            <p className="text-sm md:text-base text-teal-50 font-medium">
              موتور قطعی تطبیق مسیر بر اساس الگوریتم ۴ آزمون روان‌سنجی رکاد
            </p>
          </div>

          <div className="bg-white text-ink-900 rounded-2xl p-6 border-thick border-ink-900 elevated-md text-center min-w-[240px]">
            <span className="text-xs font-bold text-teal-800 block mb-1">کد ترکیبی Path DNA</span>
            <div className="font-numeric text-3xl font-black text-teal-700 tracking-widest my-1">
              {pathDna?.hollandCode}-{pathDna?.mbtiType}-{pathDna?.discProfile}
            </div>
            <span className="text-[10px] font-extrabold text-navy-700 block">ساختار ۷ مسیره هوشمند</span>
          </div>
        </div>

        {/* High School Track Guidance Highlight */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-300 text-ink-900 font-black flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-amber-200 block">رشته پیشنهادی دبیرستان (پایه نهم به دهم)</span>
              <span className="text-lg font-black text-white">
                {pathDna?.baseCluster?.mainGroup?.join(' و ')}
                {pathDna?.baseCluster?.topSubfields?.length ? ` (${pathDna.baseCluster.topSubfields.join('، ')})` : ''}
              </span>
            </div>
          </div>
          <Chip variant="outline" brand="third" className="bg-white/20 text-white border-white">
            خوشه‌ی پایه تحصیلی
          </Chip>
        </div>
      </div>

      {/* Main Path Feature Card */}
      {pathDna?.mainPath && (
        <div className="bg-white border-thick border-ink-900 rounded-2xl p-6 md:p-8 elevated-xl space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black shadow-flat-sm">
                <Sparkles className="w-7 h-7 text-teal-200" />
              </div>
              <div>
                <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-500">
                  اولیت اول — مسیر اصلی
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-ink-900 mt-1">{pathDna.mainPath.title}</h2>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl px-4 py-2 text-center">
              <span className="text-[10px] font-bold text-amber-800 block">درصد تطابق الگوریتمی</span>
              <span className="font-numeric text-3xl font-black text-amber-600">{pathDna.mainPath.matchScore}٪</span>
            </div>
          </div>

          <p className="text-sm font-semibold text-ink-700 leading-relaxed">{pathDna.mainPath.description}</p>

          {/* High school & University majors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-300">
              <span className="text-xs font-bold text-navy-700 block mb-1">رشته دبیرستانی توصیه شده:</span>
              <span className="text-sm font-black text-teal-800">{pathDna.mainPath.recommendedHighschoolTrack}</span>
            </div>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-300">
              <span className="text-xs font-bold text-navy-700 block mb-1">رشته‌های دانشگاهی مرتبط:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {pathDna.mainPath.universityMajors.map((m, i) => (
                  <span key={i} className="bg-white border border-neutral-300 text-xs font-bold px-2 py-0.5 rounded-md">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Test Compatibility Reasoning Grid */}
          <div className="bg-teal-50 p-5 rounded-2xl border-2 border-teal-500 space-y-3">
            <h4 className="text-sm font-black text-teal-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-700" /> تحلیل دلایل سازگاری در ۴ آزمون:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium text-ink-800">
              <div className="bg-white p-3 rounded-lg border border-teal-200">
                <strong className="text-teal-800 block mb-0.5">آزمون هالند (RIASEC):</strong>
                {pathDna.mainPath.whyCompatible.hollandReasoning}
              </div>
              <div className="bg-white p-3 rounded-lg border border-teal-200">
                <strong className="text-teal-800 block mb-0.5">آزمون گاردنر:</strong>
                {pathDna.mainPath.whyCompatible.gardnerReasoning}
              </div>
              <div className="bg-white p-3 rounded-lg border border-teal-200">
                <strong className="text-teal-800 block mb-0.5">شخصیت MBTI:</strong>
                {pathDna.mainPath.whyCompatible.mbtiReasoning}
              </div>
              <div className="bg-white p-3 rounded-lg border border-teal-200">
                <strong className="text-teal-800 block mb-0.5">رفتارشناسی DISC:</strong>
                {pathDna.mainPath.whyCompatible.discReasoning}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3 Alternative Paths */}
      {pathDna?.alternativePaths && pathDna.alternativePaths.length > 0 && (
        <div className="bg-white border-thick border-ink-900 rounded-2xl p-6 md:p-8 elevated-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <div className="w-10 h-10 rounded-md bg-navy-100 text-navy-800 border border-navy-600 font-black flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink-900">۳ مسیر جایگزین (هم‌خانواده تحصیلی)</h2>
              <p className="text-xs font-semibold text-ink-500">مسیرهای موازی در همان گروه تحصیلی با تمرکز متفاوت</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pathDna.alternativePaths.map((path, idx) => (
              <div key={idx} className="bg-neutral-50 border-thick border-ink-900 rounded-xl p-5 elevated-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-numeric text-xs font-black text-navy-700 bg-navy-50 px-2 py-0.5 rounded-md border border-navy-400">
                      تطابق: {path.matchScore}٪
                    </span>
                    <span className="text-[10px] font-bold text-ink-500 font-numeric">جایگزین ۰{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-black text-ink-900 mb-2">{path.title}</h3>
                  <p className="text-xs font-medium text-ink-500 leading-relaxed">{path.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-300">
                  <span className="text-[11px] font-bold text-teal-800 block">رشته پیشنهادشده: {path.recommendedHighschoolTrack}</span>
                  <div className="flex flex-wrap gap-1">
                    {path.exampleCareers.map((c, i) => (
                      <span key={i} className="bg-white border border-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Complementary Paths */}
      {pathDna?.complementaryPaths && pathDna.complementaryPaths.length > 0 && (
        <div className="bg-white border-thick border-ink-900 rounded-2xl p-6 md:p-8 elevated-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <div className="w-10 h-10 rounded-md bg-pink-100 text-pink-800 border border-pink-600 font-black flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink-900">۳ مسیر مکمل (میان‌رشته‌ای / گروه متفاوت)</h2>
              <p className="text-xs font-semibold text-ink-500">فرصت‌های شغلی ارزشمند از گروه‌های تحصیلی جایگزین</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pathDna.complementaryPaths.map((path, idx) => (
              <div key={idx} className="bg-neutral-50 border-thick border-ink-900 rounded-xl p-5 elevated-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-numeric text-xs font-black text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-400">
                      تطابق: {path.matchScore}٪
                    </span>
                    <span className="text-[10px] font-bold text-ink-500 font-numeric">مکمل ۰{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-black text-ink-900 mb-2">{path.title}</h3>
                  <p className="text-xs font-medium text-ink-500 leading-relaxed">{path.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-300">
                  <span className="text-[11px] font-bold text-pink-800 block">رشته پیشنهادی: {path.recommendedHighschoolTrack}</span>
                  <div className="flex flex-wrap gap-1">
                    {path.exampleCareers.map((c, i) => (
                      <span key={i} className="bg-white border border-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown Grid of 4 Test Charts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-ink-900">گزارش تفکیکی و تحلیلی ۴ آزمون</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hollandResult && <HollandRadar scores={hollandResult.normalizedScores} code={hollandResult.code} />}
          {gardnerResult && (
            <GardnerChart scores={gardnerResult.scores} topIntelligences={gardnerResult.topIntelligences} />
          )}
          {mbtiResult && (
            <MbtiTypeCard
              type={mbtiResult.type}
              certainty={mbtiResult.certainty}
              certaintyScores={mbtiResult.certaintyScores}
            />
          )}
          {discResult && <DiscProfileCard profile={discResult.profile} scores={discResult.scores} />}
        </div>
      </div>
    </div>
  );
}
