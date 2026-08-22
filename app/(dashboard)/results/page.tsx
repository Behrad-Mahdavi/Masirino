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
  UserCheck,
  X,
  TrendingUp,
  Bot,
  Laptop,
  Award,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Info,
} from 'lucide-react';

export default function ResultsPage() {
  const [hollandResult, setHollandResult] = useState<any>(null);
  const [gardnerResult, setGardnerResult] = useState<any>(null);
  const [mbtiResult, setMbtiResult] = useState<any>(null);
  const [discResult, setDiscResult] = useState<any>(null);
  const [pathDna, setPathDna] = useState<PathDnaProfile | null>(null);

  // V3 Interactive Modal State
  const [selectedJobModal, setSelectedJobModal] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'xai' | 'roadmap' | 'market' | 'disc'>('xai');

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
              mostCounts: { D: 4, I: 7, S: 2, C: 3 },
              leastCounts: { D: 1, I: 0, S: 3, C: 2 },
            })
        );
      }

      setHollandResult(holland);
      setGardnerResult(gardner);
      setMbtiResult(mbti);
      setDiscResult(disc);

      if (holland || gardner || mbti || disc) {
        const computed = computePathDna(holland, gardner, mbti, disc);
        setPathDna(computed);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 font-sans text-ink-900" dir="rtl">
      {/* Header Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white border-thick border-ink-900 rounded-2xl p-6 elevated-md">
        <div>
          <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-500 mb-2 inline-block">
            سامانه تصمیم‌گیری چندمعیاره PathEngine V3
          </span>
          <h1 className="text-3xl font-black text-ink-900">شناسنامه جامع هدایت تحصیلی و شغلی (Path DNA)</h1>
          <p className="text-ink-500 text-sm mt-1">تلفیق داده‌محور رغبت‌ها، هوش‌های ۸گانه، شخصیت‌شناسی، رفتار سازمانی و پایداری بازار کار</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => window.print()} className="gap-2 border-2">
            <Printer className="w-4 h-4" />
            <span>چاپ پرونده</span>
          </Button>
          <Button variant="primary" size="sm" className="gap-2 bg-teal-800 hover:bg-teal-900">
            <Share2 className="w-4 h-4" />
            <span>اشتراک‌گذاری گزارش</span>
          </Button>
        </div>
      </div>

      {/* Completeness Warning Banner */}
      {pathDna?.completenessWarning && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-4 md:p-5 flex items-start gap-3 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black mb-0.5">آزمون‌های روان‌سنجی شما کامل نیست</h4>
            <p className="text-xs font-medium leading-relaxed">{pathDna.completenessWarning}</p>
          </div>
        </div>
      )}

      {/* Profile Summary Strip */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-navy-700 border-thick border-ink-900 rounded-3xl p-6 md:p-8 text-white elevated-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>پروفایل روان‌سنجی تجمیعی</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              تیپ روان‌شناختی شما: {pathDna?.mbtiType} | کد هالند: {pathDna?.hollandCode}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-white/90 text-xs md:text-sm font-medium">
              <span>هوش‌های برتر: {pathDna?.topIntelligences?.join('، ') || '---'}</span>
              <span>•</span>
              <span>الگوی رفتاری DISC: {pathDna?.discProfile}</span>
              <span>•</span>
              <span>
                شاخه پیشنهادی: {pathDna?.baseCluster?.mainGroup?.join(' / ')}
                {pathDna?.baseCluster?.topSubfields?.length ? ` (${pathDna.baseCluster.topSubfields.join('، ')})` : ''}
              </span>
            </div>
          </div>
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-500">
                    اولویت اول — مسیر شغلی اصلی
                  </span>
                  {pathDna.v2Basket?.mainPath?.marketViabilityScore && (
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-400">
                      پایداری بازار کار: {pathDna.v2Basket.mainPath.marketViabilityScore}٪
                    </span>
                  )}
                  {pathDna.v2Basket?.mainPath?.strategicScore && (
                    <span className="text-xs font-black text-navy-800 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-400">
                      نمره راهبردی V3: {pathDna.v2Basket.mainPath.strategicScore}٪
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-ink-900 mt-1">{pathDna.mainPath.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-50 border-2 border-amber-500 rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] font-bold text-amber-800 block">شایستگی روان‌سنجی</span>
                <span className="font-numeric text-3xl font-black text-amber-600">{pathDna.mainPath.matchScore}٪</span>
              </div>
              <button
                onClick={() => {
                  setSelectedJobModal(pathDna.v2Basket?.mainPath);
                  setActiveModalTab('xai');
                }}
                className="px-4 py-3 bg-teal-800 hover:bg-teal-900 active:scale-95 text-white text-xs font-black rounded-xl border border-teal-900 shadow-sm transition flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-teal-200" />
                <span>مشاهده پرونده تخصصی V3</span>
              </button>
            </div>
          </div>

          <p className="text-sm font-semibold text-ink-700 leading-relaxed">{pathDna.mainPath.description}</p>
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
              <h2 className="text-2xl font-black text-ink-900">۳ مسیر جایگزین (همان کلاستر تخصصی)</h2>
              <p className="text-xs font-semibold text-ink-500">طرح پشتیبان با حفظ پایه رغبتی و تنوع در تخصص</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pathDna.alternativePaths.map((path, idx) => {
              const v2Alt = pathDna.v2Basket?.alternativePaths?.[idx];
              return (
                <div key={idx} className="bg-neutral-50 border-thick border-ink-900 rounded-xl p-5 elevated-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-numeric text-xs font-black text-navy-700 bg-navy-50 px-2 py-0.5 rounded-md border border-navy-400">
                        شایستگی: {path.matchScore}٪
                      </span>
                      <span className="text-[10px] font-bold text-ink-500 font-numeric">جایگزین ۰{idx + 1}</span>
                    </div>
                    <h3 className="text-base font-black text-ink-900 mb-1">{path.title}</h3>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded mb-2 inline-block">
                      {path.category}
                    </span>
                    <p className="text-xs font-medium text-ink-500 leading-relaxed line-clamp-3">{path.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-300">
                    {v2Alt?.discPositioning?.targetRoleTitle && (
                      <div className="bg-amber-100/60 text-amber-900 text-[11px] font-bold p-2 rounded-lg border border-amber-300">
                        <span className="block text-[10px] text-amber-700">پوزیشن رفتاری DISC:</span>
                        «{v2Alt.discPositioning.targetRoleTitle}»
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedJobModal(v2Alt);
                        setActiveModalTab('xai');
                      }}
                      className="w-full py-2 bg-white hover:bg-neutral-100 active:scale-95 border border-neutral-300 rounded-lg text-xs font-bold text-ink-800 transition flex items-center justify-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-teal-700" />
                      <span>بررسی پرونده V3</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
              <h2 className="text-2xl font-black text-ink-900">۳ مسیر مکمل و خلاقانه (میان‌رشته‌ای / الگوریتم تنوع MMR)</h2>
              <p className="text-xs font-semibold text-ink-500">تلفیق هوش‌های ثانویه گاردنر، رغبت‌های متعامد و فرصت‌های نوظهور شغلی</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pathDna.complementaryPaths.map((path, idx) => {
              const v2Comp = pathDna.v2Basket?.complementaryPaths?.[idx];
              return (
                <div key={idx} className="bg-neutral-50 border-thick border-ink-900 rounded-xl p-5 elevated-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-numeric text-xs font-black text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-400">
                        شایستگی: {path.matchScore}٪
                      </span>
                      <span className="text-[10px] font-bold text-ink-500 font-numeric">مکمل ۰{idx + 1}</span>
                    </div>
                    <h3 className="text-base font-black text-ink-900 mb-1">{path.title}</h3>
                    <span className="text-[10px] text-pink-700 font-bold bg-pink-50 px-2 py-0.5 rounded mb-2 inline-block">
                      {path.category}
                    </span>
                    <p className="text-xs font-medium text-ink-500 leading-relaxed line-clamp-3">{path.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-300">
                    {v2Comp?.discPositioning?.targetRoleTitle && (
                      <div className="bg-amber-100/60 text-amber-900 text-[11px] font-bold p-2 rounded-lg border border-amber-300">
                        <span className="block text-[10px] text-amber-700">پوزیشن رفتاری DISC:</span>
                        «{v2Comp.discPositioning.targetRoleTitle}»
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedJobModal(v2Comp);
                        setActiveModalTab('xai');
                      }}
                      className="w-full py-2 bg-white hover:bg-neutral-100 active:scale-95 border border-neutral-300 rounded-lg text-xs font-bold text-ink-800 transition flex items-center justify-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-pink-700" />
                      <span>بررسی پرونده V3</span>
                    </button>
                  </div>
                </div>
              );
            })}
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

      {/* ========================================================================= */}
      {/* V3 Interactive 4-Tab Job Dossier Modal / Drawer */}
      {/* ========================================================================= */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border-thick border-ink-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col elevated-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-800 to-navy-800 p-6 text-white flex items-start justify-between gap-4 shrink-0">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-black bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
                    {selectedJobModal.cluster?.titleFa || 'کلاستر تخصصی'}
                  </span>
                  <span className="text-[11px] text-white/80 font-sans">
                    SOC: {selectedJobModal.onetCode || 'O*NET'}
                  </span>
                </div>
                <h3 className="text-2xl font-black">{selectedJobModal.titleFa || selectedJobModal.title}</h3>
                <span className="text-xs text-teal-200 font-sans">{selectedJobModal.titleEn}</span>
              </div>
              <button
                onClick={() => setSelectedJobModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal 4 Tabs Navigation */}
            <div className="flex items-center border-b border-neutral-200 bg-neutral-50 px-6 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveModalTab('xai')}
                className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 shrink-0 ${
                  activeModalTab === 'xai'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-teal-600" />
                <span>۱. مفسرپذیری روان‌سنجی (XAI)</span>
              </button>
              <button
                onClick={() => setActiveModalTab('roadmap')}
                className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 shrink-0 ${
                  activeModalTab === 'roadmap'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>۲. نقشه راه تحصیلی</span>
              </button>
              <button
                onClick={() => setActiveModalTab('market')}
                className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 shrink-0 ${
                  activeModalTab === 'market'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>۳. بازار کار و ریسک AI</span>
              </button>
              <button
                onClick={() => setActiveModalTab('disc')}
                className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 shrink-0 ${
                  activeModalTab === 'disc'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>۴. رفتار سازمانی (DISC)</span>
              </button>
            </div>

            {/* Modal Tab Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Tab 1: XAI Psychometric Interpretation */}
              {activeModalTab === 'xai' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-teal-50 border border-teal-300 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-teal-800 block">انطباق هالند</span>
                      <span className="font-numeric text-xl font-black text-teal-900">
                        {selectedJobModal.metrics?.hollandFit ?? 90}٪
                      </span>
                    </div>
                    <div className="bg-teal-50 border border-teal-300 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-teal-800 block">سازگاری گاردنر</span>
                      <span className="font-numeric text-xl font-black text-teal-900">
                        {selectedJobModal.metrics?.gardnerFit ?? 85}٪
                      </span>
                    </div>
                    <div className="bg-teal-50 border border-teal-300 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-teal-800 block">آرامش MBTI</span>
                      <span className="font-numeric text-xl font-black text-teal-900">
                        {selectedJobModal.metrics?.mbtiFit ?? 88}٪
                      </span>
                    </div>
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-amber-800 block">نقش DISC</span>
                      <span className="text-xs font-black text-amber-900 block truncate mt-1">
                        {selectedJobModal.discPositioning?.targetRoleTitle || 'لید'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-ink-900">تحلیل دلایل چهارگانه سازگاری فرد با شغل:</h4>
                    <div className="space-y-2.5 text-xs text-ink-800 font-medium">
                      <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                        <strong className="text-teal-800 block mb-1">رغبت‌های شغلی (RIASEC):</strong>
                        {selectedJobModal.compatibilityReasoning?.hollandWhy || 'تطابق بالا در ابعاد تحلیلی و مهارتی.'}
                      </div>
                      <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                        <strong className="text-teal-800 block mb-1">هوش‌های چندگانه (گاردنر):</strong>
                        {selectedJobModal.compatibilityReasoning?.gardnerWhy || 'هوش‌های برتر کاربر کاملاً منطبق با الزامات کلیدی شغل هستند.'}
                      </div>
                      <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                        <strong className="text-teal-800 block mb-1">سازگاری محیط کار (MBTI):</strong>
                        {selectedJobModal.compatibilityReasoning?.mbtiWhy || 'محیط کاری ساختاریافته و هم‌راستا با ترجیحات روانی فرد.'}
                      </div>
                      <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                        <strong className="text-teal-800 block mb-1">رفتار درون‌تیمی (DISC):</strong>
                        {selectedJobModal.compatibilityReasoning?.discWhy || 'تعیین نقش بهینه درون‌تیمی بر اساس کهن‌الگوهای رفتاری.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Educational Roadmap */}
              {activeModalTab === 'roadmap' && (
                <div className="space-y-5">
                  <div className="bg-teal-50 border-2 border-teal-500 rounded-2xl p-4 space-y-2">
                    <span className="text-xs font-black text-teal-900 block">شاخه و رشته دبیرستان (پایه نهم به دهم):</span>
                    <p className="text-sm font-black text-teal-800">
                      {selectedJobModal.educationalRoadmap?.highSchoolTrack || 'ریاضی‌فیزیک یا علوم تجربی'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black text-ink-900 block">گرایش‌های دانشگاهی مرتبط (کارشناسی و ارشد):</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobModal.educationalRoadmap?.universityMajors?.map((major: string, i: number) => (
                        <span key={i} className="bg-neutral-100 border border-neutral-300 text-xs font-bold px-3 py-1.5 rounded-lg text-ink-900">
                          🎓 {major}
                        </span>
                      )) || <span className="text-xs text-ink-500">رشته‌های علوم کامپیوتر، مهندسی و علوم زیستی</span>}
                    </div>
                  </div>

                  {selectedJobModal.educationalRoadmap?.keyCertifications && (
                    <div className="space-y-2 pt-2 border-t border-neutral-200">
                      <span className="text-xs font-black text-ink-900 block">گواهینامه‌های کلیدی تقویت‌کننده رزومه:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedJobModal.educationalRoadmap.keyCertifications.map((cert: string, i: number) => (
                          <span key={i} className="bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg">
                            📜 {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Labor Market & AI Risk */}
              {activeModalTab === 'market' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 block">پایداری بازار کار</span>
                      <span className="font-numeric text-2xl font-black text-emerald-900">
                        {selectedJobModal.marketViabilityScore ?? 85}٪
                      </span>
                    </div>
                    <div className="bg-navy-50 border border-navy-300 rounded-xl p-3.5 text-center">
                      <span className="text-[10px] font-bold text-navy-800 block">نمره راهبردی V3</span>
                      <span className="font-numeric text-2xl font-black text-navy-900">
                        {selectedJobModal.strategicScore ?? 88}٪
                      </span>
                    </div>
                    <div className="bg-purple-50 border border-purple-300 rounded-xl p-3.5 text-center">
                      <span className="text-[10px] font-bold text-purple-800 block">امکان دورکاری</span>
                      <span className="font-numeric text-2xl font-black text-purple-900">
                        {selectedJobModal.enterpriseInsight?.remoteCompatibilityPercent ?? 75}٪
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ink-700">چشم‌انداز تقاضای بازار کار:</span>
                      <span className="font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        {selectedJobModal.enterpriseInsight?.demandOutlook === 'rising' ? 'رو به رشد و پرتقاضا' : 'باثبات و پایدار'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ink-700">ریسک اتوماسیون و هوش مصنوعی:</span>
                      <span className="font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md font-numeric">
                        {selectedJobModal.enterpriseInsight?.automationRiskPercent ?? 20}٪ (پایین تا متوسط)
                      </span>
                    </div>
                    {selectedJobModal.enterpriseInsight?.salaryBandTomanMonthly && (
                      <div className="pt-2 border-t border-neutral-200 space-y-1">
                        <span className="font-bold text-ink-800 block">برآورد بازه حقوق ماهانه بازار ایران:</span>
                        <div className="flex justify-between text-[11px] text-ink-600 font-numeric pt-1">
                          <span>ورود: {(selectedJobModal.enterpriseInsight.salaryBandTomanMonthly.entry / 1000000).toFixed(0)} میلیون</span>
                          <span>میان‌رده: {(selectedJobModal.enterpriseInsight.salaryBandTomanMonthly.mid / 1000000).toFixed(0)} میلیون</span>
                          <span>ارشد: {(selectedJobModal.enterpriseInsight.salaryBandTomanMonthly.senior / 1000000).toFixed(0)} میلیون تومان</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedJobModal.enterpriseInsight?.adjacentCareerIds && selectedJobModal.enterpriseInsight.adjacentCareerIds.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-black text-ink-900 block">مسیرهای شغلی مجاور برای پیوت احتمالی:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedJobModal.enterpriseInsight.adjacentCareerIds.map((adjId: string, i: number) => (
                          <span key={i} className="bg-teal-50 border border-teal-300 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-md">
                            🔄 {adjId.replace('onet_', '').replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: DISC In-Role Positioning */}
              {activeModalTab === 'disc' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800">عنوان پوزیشن سازمانی:</span>
                      <span className="text-xs font-black bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-md">
                        {selectedJobModal.discPositioning?.targetRoleTitle || 'معمار و لید'}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      {selectedJobModal.discPositioning?.workStyleGuidance || 'هدایت تیم و تصمیم‌گیری داده‌محور.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black text-ink-900 block">نقاط قوت متمایز شما در این موقعیت:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedJobModal.discPositioning?.strengthsInRole?.map((st: string, i: number) => (
                        <div key={i} className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-xs font-bold text-ink-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{st}</span>
                        </div>
                      )) || <span className="text-xs text-ink-500">حل مسئله، راهبری تیم و تحلیل دقیق.</span>}
                    </div>
                  </div>

                  {selectedJobModal.discPositioning?.growthAreas && selectedJobModal.discPositioning.growthAreas.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-200">
                      <span className="text-xs font-black text-ink-900 block">چالش‌های احتمالی و مهارت‌های نرم مکمل:</span>
                      <div className="space-y-1.5">
                        {selectedJobModal.discPositioning.growthAreas.map((ga: string, i: number) => (
                          <div key={i} className="bg-rose-50/60 p-2 rounded-lg border border-rose-200 text-xs font-medium text-rose-900 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{ga}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedJobModal(null)}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black transition"
              >
                بستن پرونده
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
