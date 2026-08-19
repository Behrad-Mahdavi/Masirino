'use client';

import React, { useState, useMemo } from 'react';
import {
  runPathEngineWithTrace,
  PathEngineTrace,
  Stage1Trace,
  Stage2Trace,
  Stage3Trace,
  Stage4Trace,
  Stage4bTrace,
  Stage5Trace,
} from '@/lib/scoring/pathEngine';
import {
  MainGroups,
  PATH_DATABASE,
  MAIN_GROUPS_VECTORS,
  TVET_INDUSTRY_SUBFIELDS,
  TVET_ARTS_SUBFIELDS,
} from '@/lib/scoring/pathEngineTables';
import { GARDNER_VALID_KEYS } from '@/src/pathEngine/debug/validateInput';
import {
  Play,
  RotateCcw,
  Sliders,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Compass,
  Brain,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  Activity,
  FileText,
  Search,
  ArrowRight,
  Award,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Preset Scenarios
const PRESETS = [
  {
    id: 'default',
    title: 'مهندسی و داده (INTJ / R:40, I:85, C:65 / C)',
    desc: 'ورودی استاندارد بریف فنی با گرایش تحلیلی و فناوری',
    holland: { R: 40, I: 85, A: 25, S: 20, E: 30, C: 65 },
    gardner: ['logical', 'spatial', 'intrapersonal'],
    mbti: { type: 'INTJ', certainty: [70, 60, 80, 55] as [number, number, number, number] },
    disc: 'C',
  },
  {
    id: 'math-pure',
    title: 'ریاضی‌فیزیک محض (مهندسی برق و مکانیک)',
    desc: 'نمرات بسیار بالای تحلیلی، فضایی و ساختارمند',
    holland: { R: 75, I: 95, A: 15, S: 10, E: 45, C: 80 },
    gardner: ['logical', 'spatial', 'bodily'],
    mbti: { type: 'ISTJ', certainty: [85, 75, 90, 80] as [number, number, number, number] },
    disc: 'CD',
  },
  {
    id: 'medical-science',
    title: 'علوم تجربی و پزشکی / دندان‌پزشکی',
    desc: 'هوش طبیعت‌گرا، تحلیل زیستی و تعامل درمانی',
    holland: { R: 35, I: 95, A: 20, S: 70, E: 25, C: 65 },
    gardner: ['naturalistic', 'logical', 'interpersonal'],
    mbti: { type: 'INFJ', certainty: [65, 80, 75, 70] as [number, number, number, number] },
    disc: 'SC',
  },
  {
    id: 'tvet-industry',
    title: 'فنی‌وحرفه‌ای صنعت (مکاترونیک و خودرو)',
    desc: 'هوش حرکتی و بدنی، کارگاهی، واقع‌گرا (R) بالا',
    holland: { R: 95, I: 50, A: 15, S: 10, E: 25, C: 65 },
    gardner: ['bodily', 'spatial', 'logical'],
    mbti: { type: 'ISTP', certainty: [80, 90, 85, 85] as [number, number, number, number] },
    disc: 'D',
  },
  {
    id: 'tvet-arts',
    title: 'فنی‌وحرفه‌ای هنر (سینما، گرافیک، طراحی)',
    desc: 'نمره هنر (A) بسیار بالا، خلاقیت دیداری و فضایی',
    holland: { R: 20, I: 40, A: 95, S: 50, E: 40, C: 25 },
    gardner: ['spatial', 'musical', 'linguistic'],
    mbti: { type: 'INFP', certainty: [75, 85, 90, 80] as [number, number, number, number] },
    disc: 'I',
  },
  {
    id: 'humanities-law',
    title: 'علوم‌انسانی و حقوق / مدیریت و کسب‌وکار',
    desc: 'هوش کلامی و اجتماعی، برون‌گرایی و مذاکره',
    holland: { R: 10, I: 65, A: 50, S: 90, E: 85, C: 50 },
    gardner: ['linguistic', 'interpersonal', 'logical'],
    mbti: { type: 'ENTJ', certainty: [85, 70, 85, 90] as [number, number, number, number] },
    disc: 'DI',
  },
  {
    id: 'paradox-case',
    title: 'کیس پیچیده و متناقض (تضاد MBTI با DISC)',
    desc: 'شخصیت عمل‌گرای ریسک‌پذیر ESTP با DISC محافظه‌کار SC',
    holland: { R: 60, I: 60, A: 60, S: 60, E: 60, C: 60 },
    gardner: ['spatial', 'logical', 'interpersonal'],
    mbti: { type: 'ESTP', certainty: [80, 80, 80, 80] as [number, number, number, number] },
    disc: 'SC',
  },
];

export const PathEngineHarness: React.FC = () => {
  // Test Inclusion Toggles
  const [includeHolland, setIncludeHolland] = useState(true);
  const [includeGardner, setIncludeGardner] = useState(true);
  const [includeMbti, setIncludeMbti] = useState(true);
  const [includeDisc, setIncludeDisc] = useState(true);

  // Holland State
  const [hollandScores, setHollandScores] = useState({
    R: 40,
    I: 85,
    A: 25,
    S: 20,
    E: 30,
    C: 65,
  });

  // Gardner State
  const [selectedGardner, setSelectedGardner] = useState<string[]>([
    'logical',
    'spatial',
    'intrapersonal',
  ]);

  // MBTI State
  const [mbtiEI, setMbtiEI] = useState<'E' | 'I' | 'X'>('I');
  const [mbtiSN, setMbtiSN] = useState<'S' | 'N' | 'X'>('N');
  const [mbtiTF, setMbtiTF] = useState<'T' | 'F' | 'X'>('T');
  const [mbtiJP, setMbtiJP] = useState<'J' | 'P' | 'X'>('J');
  const [certaintyEI, setCertaintyEI] = useState(70);
  const [certaintySN, setCertaintySN] = useState(60);
  const [certaintyTF, setCertaintyTF] = useState(80);
  const [certaintyJP, setCertaintyJP] = useState(55);

  // DISC State
  const [discProfile, setDiscProfile] = useState('C');

  // UI Active Stage Tab
  const [activeStageTab, setActiveStageTab] = useState<'summary' | 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5' | 'json'>('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [selectedPathForStage3, setSelectedPathForStage3] = useState<string | null>(null);

  // Apply Preset
  const applyPreset = (preset: typeof PRESETS[0]) => {
    setIncludeHolland(true);
    setIncludeGardner(true);
    setIncludeMbti(true);
    setIncludeDisc(true);

    setHollandScores(preset.holland);
    setSelectedGardner(preset.gardner);

    const mbtiType = preset.mbti.type;
    setMbtiEI((mbtiType[0] as any) || 'X');
    setMbtiSN((mbtiType[1] as any) || 'X');
    setMbtiTF((mbtiType[2] as any) || 'X');
    setMbtiJP((mbtiType[3] as any) || 'X');

    setCertaintyEI(preset.mbti.certainty[0]);
    setCertaintySN(preset.mbti.certainty[1]);
    setCertaintyTF(preset.mbti.certainty[2]);
    setCertaintyJP(preset.mbti.certainty[3]);

    setDiscProfile(preset.disc);
  };

  // Run Path Engine Realtime Calculation
  const trace: PathEngineTrace = useMemo(() => {
    const hollandData = includeHolland
      ? {
          scores: hollandScores,
          normalizedScores: hollandScores,
          code: '',
          primaryDimension: 'R' as any,
        }
      : null;

    const gardnerData = includeGardner
      ? {
          topIntelligences: selectedGardner,
        }
      : null;

    const mbtiData = includeMbti
      ? {
          type: `${mbtiEI}${mbtiSN}${mbtiTF}${mbtiJP}`,
          certaintyScores: {
            EI: { dominantLetter: mbtiEI, intensityPct: certaintyEI },
            SN: { dominantLetter: mbtiSN, intensityPct: certaintySN },
            TF: { dominantLetter: mbtiTF, intensityPct: certaintyTF },
            JP: { dominantLetter: mbtiJP, intensityPct: certaintyJP },
          },
        }
      : null;

    const discData = includeDisc
      ? {
          profile: discProfile,
        }
      : null;

    return runPathEngineWithTrace(hollandData as any, gardnerData as any, mbtiData as any, discData as any);
  }, [
    includeHolland,
    includeGardner,
    includeMbti,
    includeDisc,
    hollandScores,
    selectedGardner,
    mbtiEI,
    mbtiSN,
    mbtiTF,
    mbtiJP,
    certaintyEI,
    certaintySN,
    certaintyTF,
    certaintyJP,
    discProfile,
  ]);

  const copyJsonTrace = () => {
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Filtered Stage 2 Paths
  const filteredStage2 = useMemo(() => {
    let list = [...trace.stage2].sort((a, b) => b.stage2Score - a.stage2Score);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.pathId.toLowerCase().includes(q));
    }
    return list;
  }, [trace.stage2, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans text-ink-900" dir="rtl">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-navy-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>محیط تست تعاملی و دیباگ لحظه‌ای الگوریتم (Test Harness)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              میز آزمایش موتور هدایت تحصیلی و شغلی مسیرو
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              نمرات ۴ آزمون روان‌سنجی (هالند، گاردنر، MBTI، DISC) را وارد کنید و خروجی زنده، ردپای محاسبات، و تفکیک هر ۵ مرحله‌ی الگوریتم را بلافاصله مشاهده نمایید.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyJsonTrace}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 transition rounded-xl text-sm font-medium border border-white/30 backdrop-blur-md"
            >
              {copiedJson ? <Check className="w-4 h-4 text-teal-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedJson ? 'JSON کپی شد' : 'کپی کل ردپا (JSON)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-800">
            <Award className="w-4 h-4 text-amber-500" />
            <span>سناریوهای آماده و از پیش‌تعریف‌شده (Presets):</span>
          </div>
          <span className="text-xs text-ink-500">جهت بررسی سریع سناریوهای مرزی و آزمایشی</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="text-right p-3 rounded-xl border border-neutral-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-xs group active:scale-[0.98]"
            >
              <div className="font-bold text-ink-900 group-hover:text-teal-800 line-clamp-1">{preset.title}</div>
              <div className="text-ink-500 text-[11px] line-clamp-1 mt-0.5">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Controls (Left) & Realtime Trace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Test Input Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: Holland RIASEC */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-600" />
                <span className="font-bold text-base text-ink-900">۱. آزمون رغبت‌سنجی هالند (RIASEC)</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHolland}
                  onChange={(e) => setIncludeHolland(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className={includeHolland ? 'text-teal-700' : 'text-neutral-400'}>فعال</span>
              </label>
            </div>

            {includeHolland && (
              <div className="space-y-3.5">
                {[
                  { key: 'R', label: 'واقع‌گرا / فنی‌عملیاتی (R)', color: 'accent-teal-600' },
                  { key: 'I', label: 'جستجوگر / تحلیلی (I)', color: 'accent-navy-600' },
                  { key: 'A', label: 'هنری / خلاقانه (A)', color: 'accent-pink-500' },
                  { key: 'S', label: 'اجتماعی / تعاملی (S)', color: 'accent-amber-500' },
                  { key: 'E', label: 'متهور / رهبری و بازرگانی (E)', color: 'accent-teal-700' },
                  { key: 'C', label: 'قراردادی / ساختاریافته (C)', color: 'accent-ink-700' },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-ink-800">{item.label}</span>
                      <span className="font-bold text-ink-900 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                        {hollandScores[item.key as keyof typeof hollandScores]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hollandScores[item.key as keyof typeof hollandScores]}
                      onChange={(e) =>
                        setHollandScores({
                          ...hollandScores,
                          [item.key]: Number(e.target.value),
                        })
                      }
                      className={`w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer ${item.color}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Gardner Intelligences */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-navy-600" />
                <span className="font-bold text-base text-ink-900">۲. آزمون هوش‌های چندگانه گاردنر</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGardner}
                  onChange={(e) => setIncludeGardner(e.target.checked)}
                  className="rounded text-navy-600 focus:ring-navy-500 w-4 h-4"
                />
                <span className={includeGardner ? 'text-navy-700' : 'text-neutral-400'}>فعال</span>
              </label>
            </div>

            {includeGardner && (
              <div className="space-y-3">
                <div className="text-xs text-ink-600">
                  ۳ هوش برتر را به ترتیب اولویت انتخاب کنید (رتبه ۱: ضریب ۱.۰ | رتبه ۲: ۰.۷ | رتبه ۳: ۰.۴):
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'logical', label: 'منطقی-ریاضی' },
                    { key: 'spatial', label: 'تصویری-فضایی' },
                    { key: 'linguistic', label: 'کلامی-زبانی' },
                    { key: 'interpersonal', label: 'میان‌فردی (اجتماعی)' },
                    { key: 'intrapersonal', label: 'درون‌فردی (خودآگاهی)' },
                    { key: 'bodily', label: 'بدنی-حرکتی' },
                    { key: 'musical', label: 'موسیقیایی-ریتمیک' },
                    { key: 'naturalistic', label: 'طبیعت‌گرا' },
                  ].map((intel) => {
                    const isSelected = selectedGardner.includes(intel.key);
                    const rankIndex = selectedGardner.indexOf(intel.key);

                    return (
                      <button
                        key={intel.key}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedGardner(selectedGardner.filter((k) => k !== intel.key));
                          } else {
                            if (selectedGardner.length < 3) {
                              setSelectedGardner([...selectedGardner, intel.key]);
                            } else {
                              setSelectedGardner([...selectedGardner.slice(1), intel.key]);
                            }
                          }
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition active:scale-95 ${
                          isSelected
                            ? 'bg-navy-50 border-navy-600 text-navy-800 font-bold shadow-sm'
                            : 'bg-neutral-50 border-neutral-200 text-ink-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{intel.label}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-navy-600 text-white text-[11px] flex items-center justify-center font-bold">
                            {rankIndex + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section: MBTI */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-pink-600" />
                <span className="font-bold text-base text-ink-900">۳. تیپ شخصیتی MBTI و شدت قطعیت</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMbti}
                  onChange={(e) => setIncludeMbti(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                />
                <span className={includeMbti ? 'text-pink-700' : 'text-neutral-400'}>فعال</span>
              </label>
            </div>

            {includeMbti && (
              <div className="space-y-4">
                {/* Axis 1: E vs I */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>محور هدایت انرژی (E / I):</span>
                    <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {mbtiEI} ({certaintyEI}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['E', 'I', 'X'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setMbtiEI(l)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                          mbtiEI === l
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                            : 'bg-neutral-50 text-ink-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {l === 'E' ? 'E (برون‌گرا)' : l === 'I' ? 'I (درون‌گرا)' : 'X (خنثی)'}
                      </button>
                    ))}
                  </div>
                  {mbtiEI !== 'X' && (
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={certaintyEI}
                      onChange={(e) => setCertaintyEI(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                  )}
                </div>

                {/* Axis 2: S vs N */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>محور دریافت اطلاعات (S / N):</span>
                    <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {mbtiSN} ({certaintySN}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['S', 'N', 'X'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setMbtiSN(l)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                          mbtiSN === l
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                            : 'bg-neutral-50 text-ink-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {l === 'S' ? 'S (حسی)' : l === 'N' ? 'N (شهودی)' : 'X (خنثی)'}
                      </button>
                    ))}
                  </div>
                  {mbtiSN !== 'X' && (
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={certaintySN}
                      onChange={(e) => setCertaintySN(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                  )}
                </div>

                {/* Axis 3: T vs F */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>محور تصمیم‌گیری (T / F):</span>
                    <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {mbtiTF} ({certaintyTF}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['T', 'F', 'X'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setMbtiTF(l)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                          mbtiTF === l
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                            : 'bg-neutral-50 text-ink-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {l === 'T' ? 'T (فکری)' : l === 'F' ? 'F (احساسی)' : 'X (خنثی)'}
                      </button>
                    ))}
                  </div>
                  {mbtiTF !== 'X' && (
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={certaintyTF}
                      onChange={(e) => setCertaintyTF(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                  )}
                </div>

                {/* Axis 4: J vs P */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>محور سبک زندگی (J / P):</span>
                    <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {mbtiJP} ({certaintyJP}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['J', 'P', 'X'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setMbtiJP(l)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                          mbtiJP === l
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                            : 'bg-neutral-50 text-ink-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {l === 'J' ? 'J (قضاوتی)' : l === 'P' ? 'P (ادراکی)' : 'X (خنثی)'}
                      </button>
                    ))}
                  </div>
                  {mbtiJP !== 'X' && (
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={certaintyJP}
                      onChange={(e) => setCertaintyJP(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section: DISC */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-base text-ink-900">۴. الگوی رفتاری DISC</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDisc}
                  onChange={(e) => setIncludeDisc(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className={includeDisc ? 'text-amber-700' : 'text-neutral-400'}>فعال</span>
              </label>
            </div>

            {includeDisc && (
              <div className="space-y-3">
                <div className="text-xs text-ink-600">
                  یک یا دو بعد غالب DISC را انتخاب کنید:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'D', label: 'D (تسلط‌گرا)' },
                    { key: 'I', label: 'I (تاثیرگذار)' },
                    { key: 'S', label: 'S (باثبات)' },
                    { key: 'C', label: 'C (وظیفه‌شناس)' },
                  ].map((dim) => {
                    const isSelected = discProfile.includes(dim.key);
                    return (
                      <button
                        key={dim.key}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            const next = discProfile.replace(dim.key, '');
                            setDiscProfile(next || 'C');
                          } else {
                            if (discProfile.length < 2) {
                              setDiscProfile(discProfile + dim.key);
                            } else {
                              setDiscProfile(dim.key);
                            }
                          }
                        }}
                        className={`p-2 rounded-xl border text-xs font-bold transition active:scale-95 ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-neutral-50 text-ink-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {dim.label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-ink-500">
                  پروفایل انتخابی فعلی: <span className="font-bold text-amber-800">{discProfile}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Realtime Stage Traces & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl p-2 border border-neutral-300/80 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
            {[
              { id: 'summary', label: 'خروجی ۷ مسیر نهایی', icon: Award },
              { id: 'stage1', label: 'مرحله ۱ (خوشه پایه)', icon: Compass },
              { id: 'stage2', label: 'مرحله ۲ (امتیاز گاردنر)', icon: Brain },
              { id: 'stage3', label: 'مرحله ۳ (شکست MBTI)', icon: UserCheck },
              { id: 'stage4', label: 'مرحله ۴ (آستانه و DISC)', icon: Activity },
              { id: 'stage5', label: 'مرحله ۵ (استخرها)', icon: Layers },
              { id: 'json', label: 'کد خام JSON', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStageTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStageTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-ink-700 hover:bg-neutral-100 hover:text-ink-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SUMMARY (Final 7 Paths) */}
          {activeStageTab === 'summary' && (
            <div className="space-y-6">
              {/* Completeness Warning Banner if any */}
              {trace.finalOutput.completenessWarning && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 text-xs flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-950 mb-0.5">توجه به وضعیت داده‌های ورودی:</div>
                    <div>{trace.finalOutput.completenessWarning}</div>
                  </div>
                </div>
              )}

              {/* Main Recommendation Card */}
              <div className="bg-gradient-to-br from-teal-50 via-white to-neutral-50 rounded-3xl p-6 border-2 border-teal-600 shadow-md relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>پیشنهاد اولویت ۱ (مسیر اصلی)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-500">شاخص تطابق:</span>
                    <span className="text-2xl font-black text-teal-800">
                      {trace.finalOutput.mainPath.matchScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-ink-900">{trace.finalOutput.mainPath.title}</h2>
                  <p className="text-xs text-ink-600 mt-1">{trace.finalOutput.mainPath.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="font-bold text-teal-900 block mb-1">رشته پیشنهادی دبیرستان:</span>
                    <span className="text-ink-800">{trace.finalOutput.mainPath.recommendedHighschoolTrack}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-teal-200">
                    <span className="font-bold text-teal-900 block mb-1">رشته‌های دانشگاهی مرتبط:</span>
                    <span className="text-ink-800">{trace.finalOutput.mainPath.universityMajors.slice(0, 3).join('، ')}</span>
                  </div>
                </div>

                {/* Why Compatible Reasoning */}
                <div className="p-3.5 bg-teal-100/50 rounded-xl border border-teal-200/80 text-xs space-y-1.5 text-teal-950">
                  <div className="font-bold flex items-center gap-1.5 text-teal-900">
                    <Zap className="w-3.5 h-3.5 text-teal-700" />
                    <span>تحلیل هماهنگی روان‌سنجی:</span>
                  </div>
                  <p>• {trace.finalOutput.mainPath.whyCompatible.hollandReasoning}</p>
                  <p>• {trace.finalOutput.mainPath.whyCompatible.gardnerReasoning}</p>
                  <p>• {trace.finalOutput.mainPath.whyCompatible.mbtiReasoning}</p>
                  <p>• {trace.finalOutput.mainPath.whyCompatible.discReasoning}</p>
                </div>
              </div>

              {/* 3 Alternative Paths */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-navy-600" />
                    <span>۳ مسیر جایگزین هم‌خانواده (Alternative Paths):</span>
                  </h3>
                  <span className="text-[11px] text-ink-500">انتخاب شده از خوشه پایه تحصیلی</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {trace.finalOutput.alternativePaths.map((alt, idx) => (
                    <div
                      key={alt.pathId}
                      className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-2 hover:border-navy-500 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-800 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-black text-sm text-navy-800">{alt.matchScore}%</span>
                      </div>
                      <div className="font-bold text-xs text-ink-900 line-clamp-1">{alt.title}</div>
                      <div className="text-[11px] text-ink-500 line-clamp-2">{alt.recommendedHighschoolTrack}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Complementary Paths */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-ink-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span>۳ مسیر مکمل و خلاقانه میان‌رشته‌ای (Complementary Paths):</span>
                  </h3>
                  <span className="text-[11px] text-ink-500">انتخاب شده بر مبنای استعداد ترکیبی و چندگانه</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {trace.finalOutput.complementaryPaths.map((comp, idx) => (
                    <div
                      key={comp.pathId}
                      className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-2 hover:border-pink-500 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-black text-sm text-pink-800">{comp.matchScore}%</span>
                      </div>
                      <div className="font-bold text-xs text-ink-900 line-clamp-1">{comp.title}</div>
                      <div className="text-[11px] text-ink-500 line-clamp-2">{comp.recommendedHighschoolTrack}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAGE 1 TRACE */}
          {activeStageTab === 'stage1' && (
            <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-sm text-ink-900 mb-1">مرحله ۱-الف: امتیاز نرمال‌شده ۵ گروه اصلی</h3>
                <p className="text-xs text-ink-500">
                  فاصله رتبه ۱ و ۲: <span className="font-bold text-teal-800">{trace.stage1.groupGap}</span> (آستانه حالت ترکیبی: فاصله کمتر یا مساوی ۱۰)
                </p>
              </div>

              <div className="space-y-2">
                {trace.stage1.groupScoresNormalized.map((grp) => {
                  const isMain = trace.stage1.mainGroup.includes(grp.group);
                  return (
                    <div key={grp.group} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className={isMain ? 'text-teal-800 font-extrabold flex items-center gap-1.5' : 'text-ink-700'}>
                          {grp.group}
                          {isMain && <span className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded text-[10px]">خوشه انتخابی</span>}
                        </span>
                        <span>{grp.score}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isMain ? 'bg-teal-600' : 'bg-neutral-300'}`}
                          style={{ width: `${grp.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subfields if TVET */}
              {trace.stage1.subfieldScoresNormalized && trace.stage1.subfieldScoresNormalized.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div>
                    <h4 className="font-bold text-sm text-ink-900">مرحله ۱-ب: زیررشته‌های شاخه فنی‌وحرفه‌ای</h4>
                    <p className="text-xs text-ink-500">
                      فاصله رتبه ۱ و ۲ زیررشته: <span className="font-bold text-teal-800">{trace.stage1.subfieldGap}</span> (آستانه: ۸)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {trace.stage1.subfieldScoresNormalized.map((sub) => {
                      const isTop = trace.stage1.topSubfields.includes(sub.subfield);
                      return (
                        <div
                          key={sub.subfield}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isTop ? 'bg-teal-50 border-teal-500 font-bold text-teal-950' : 'bg-neutral-50 border-neutral-200 text-ink-700'
                          }`}
                        >
                          <span className="line-clamp-1">{sub.subfield}</span>
                          <span>{sub.score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STAGE 2 TRACE */}
          {activeStageTab === 'stage2' && (
            <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-ink-900">مرحله ۲: امتیازدهی گاردنر و ضریب هم‌راستایی</h3>
                  <p className="text-xs text-ink-500">مشاهده جدول تمام ۲۸ مسیر دیتابیس</p>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="جستجوی مسیر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-neutral-200 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-neutral-100 text-ink-800 border-b border-neutral-200">
                    <tr>
                      <th className="p-2.5">عنوان مسیر</th>
                      <th className="p-2.5">امتیاز گاردنر</th>
                      <th className="p-2.5">ضریب هم‌راستایی</th>
                      <th className="p-2.5">امتیاز مرحله ۲</th>
                      <th className="p-2.5">حذف اولیه؟</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredStage2.map((row) => (
                      <tr key={row.pathId} className="hover:bg-neutral-50">
                        <td className="p-2.5 font-bold text-ink-900">{row.title}</td>
                        <td className="p-2.5 font-mono">{row.gardnerScore.toFixed(1)}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                              row.alignmentBonus === 1.5
                                ? 'bg-teal-100 text-teal-800'
                                : row.alignmentBonus === 1.3
                                ? 'bg-navy-100 text-navy-800'
                                : 'bg-neutral-100 text-ink-600'
                            }`}
                          >
                            {row.alignmentBonus}x ({row.alignmentReason})
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-teal-800">{row.stage2Score.toFixed(1)}</td>
                        <td className="p-2.5">
                          {row.excludedFromInitialList ? (
                            <span className="text-pink-600 font-bold">بله ⚠️</span>
                          ) : (
                            <span className="text-teal-700">خیر</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: STAGE 3 TRACE */}
          {activeStageTab === 'stage3' && (
            <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-ink-900">مرحله ۳: شکست ۴ محور MBTI برای هر مسیر</h3>
                  <p className="text-xs text-ink-500">تحلیل فاصله بردار رفتاری شغل از شخصیت</p>
                </div>

                <select
                  value={selectedPathForStage3 || trace.finalOutput.mainPath.pathId}
                  onChange={(e) => setSelectedPathForStage3(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold bg-neutral-50 outline-none"
                >
                  {PATH_DATABASE.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const targetId = selectedPathForStage3 || trace.finalOutput.mainPath.pathId;
                const pathTrace = trace.stage3.find((s) => s.pathId === targetId);
                const pathMeta = PATH_DATABASE.find((p) => p.id === targetId);

                if (!pathTrace || !pathMeta) return null;

                return (
                  <div className="space-y-4">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                      <div>
                        مسیر انتخابی: <span className="font-bold text-ink-900">{pathMeta.title}</span>
                      </div>
                      <div>
                        ضریب نهایی MBTI: <span className="font-bold text-pink-700 font-mono text-sm">{pathTrace.mbtiMultiplier.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-neutral-100 text-ink-800 border-b border-neutral-200">
                          <tr>
                            <th className="p-2.5">محور</th>
                            <th className="p-2.5">حرف غالب</th>
                            <th className="p-2.5">بعد رفتاری</th>
                            <th className="p-2.5">مقدار هدف</th>
                            <th className="p-2.5">مقدار واقعی</th>
                            <th className="p-2.5">فاصله</th>
                            <th className="p-2.5">قطعیت%</th>
                            <th className="p-2.5">سهم محور</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 font-mono">
                          {pathTrace.axisBreakdown.map((b) => (
                            <tr key={b.axis} className="hover:bg-neutral-50">
                              <td className="p-2.5 font-sans font-bold">{b.axis}</td>
                              <td className="p-2.5">{b.dominantLetter}</td>
                              <td className="p-2.5 font-sans">{b.targetDimension}</td>
                              <td className="p-2.5">{b.targetValue}</td>
                              <td className="p-2.5">{b.actualValue}</td>
                              <td className="p-2.5">{b.distance.toFixed(2)}</td>
                              <td className="p-2.5">{b.certaintyPct}%</td>
                              <td className="p-2.5 font-bold text-pink-700">{b.axisContribution.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: STAGE 4 TRACE */}
          {activeStageTab === 'stage4' && (
            <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-ink-900">مرحله ۴ و ۴.ب: فیلتر DISC، مقیاس پویا و فیلتر آستانه</h3>
                <p className="text-xs text-ink-500">
                  حداکثر امتیاز خام تئوریک: <span className="font-bold text-ink-900">{trace.stage4b.maxRawScore}</span> | آستانه فیلتر: <span className="font-bold text-ink-900">{trace.stage4b.thresholdValue}%</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-ink-500 block mb-1">تعداد واجدین قبل از Relax:</span>
                  <span className="text-lg font-bold text-ink-900">{trace.stage4b.eligibleCountBeforeRelax}</span>
                </div>
                <div>
                  <span className="text-ink-500 block mb-1">وضعیت Relax آستانه:</span>
                  <span className={`text-lg font-bold ${trace.stage4b.thresholdWasRelaxed ? 'text-pink-600' : 'text-teal-700'}`}>
                    {trace.stage4b.thresholdWasRelaxed ? 'فعال شد ⚠️' : 'خیر (طبیعی)'}
                  </span>
                </div>
                <div>
                  <span className="text-ink-500 block mb-1">تعداد کل مسیرهای نهایی:</span>
                  <span className="text-lg font-bold text-teal-800">۷ مسیر</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-neutral-100 text-ink-800 border-b border-neutral-200">
                    <tr>
                      <th className="p-2.5">مسیر</th>
                      <th className="p-2.5">امتیاز خام نهایی</th>
                      <th className="p-2.5">شاخص تطابق (MatchScore)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {[...trace.stage4b.allPathScores]
                      .sort((a, b) => b.matchScore - a.matchScore)
                      .map((p) => {
                        const pathDef = PATH_DATABASE.find((db) => db.id === p.pathId);
                        return (
                          <tr key={p.pathId} className="hover:bg-neutral-50">
                            <td className="p-2.5 font-bold text-ink-900">{pathDef?.title || p.pathId}</td>
                            <td className="p-2.5 font-mono">{p.rawFinalScore.toFixed(1)}</td>
                            <td className="p-2.5 font-bold text-teal-800">{p.matchScore}%</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: STAGE 5 TRACE */}
          {activeStageTab === 'stage5' && (
            <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm text-ink-900">مرحله ۵: مونتاژ استخرهای جایگزین و مکمل</h3>
                <p className="text-xs text-ink-500">بررسی هم‌پوشانی گروه اصلی و وضعیت فعال‌سازی مکانیزم Fallback</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Alternatives */}
                <div className="p-4 rounded-xl bg-navy-50/60 border border-navy-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-navy-900">
                    <span>استخر مسیرهای جایگزین (Alternative Pool):</span>
                    <span>
                      Fallback:{' '}
                      {trace.stage5.alternativePoolFallbackTriggered ? (
                        <span className="text-pink-600">فعال شد ⚠️</span>
                      ) : (
                        <span className="text-teal-700">خیر ✅</span>
                      )}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {trace.stage5.alternativePool.map((alt, i) => {
                      const def = PATH_DATABASE.find((p) => p.id === alt.pathId);
                      return (
                        <div key={alt.pathId} className="flex items-center justify-between bg-white p-2 rounded-lg border border-navy-100">
                          <span>{i + 1}. {def?.title || alt.pathId}</span>
                          <span>هم‌پوشانی با خوشه اصلی: {alt.matchesMainGroup ? 'بله ✅' : 'خیر ⚠️'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Complementary */}
                <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-pink-900">
                    <span>استخر مسیرهای مکمل خلاقانه (Complementary Pool):</span>
                    <span>
                      Fallback:{' '}
                      {trace.stage5.complementaryPoolFallbackTriggered ? (
                        <span className="text-pink-600">فعال شد ⚠️</span>
                      ) : (
                        <span className="text-teal-700">خیر ✅</span>
                      )}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {trace.stage5.complementaryPool.map((comp, i) => {
                      const def = PATH_DATABASE.find((p) => p.id === comp.pathId);
                      return (
                        <div key={comp.pathId} className="flex items-center justify-between bg-white p-2 rounded-lg border border-pink-100">
                          <span>{i + 1}. {def?.title || comp.pathId}</span>
                          <span>هم‌پوشانی با خوشه اصلی: {comp.matchesMainGroup ? 'بله' : 'خیر'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: RAW JSON TRACE */}
          {activeStageTab === 'json' && (
            <div className="bg-neutral-900 text-teal-300 rounded-2xl p-5 font-mono text-xs overflow-x-auto shadow-inner space-y-3 max-h-[700px]">
              <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-700 pb-2">
                <span>ردپای کامل خروجی (PathEngineTrace JSON)</span>
                <button
                  onClick={copyJsonTrace}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px] flex items-center gap-1"
                >
                  {copiedJson ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedJson ? 'کپی شد' : 'کپی'}</span>
                </button>
              </div>
              <pre>{JSON.stringify(trace, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
