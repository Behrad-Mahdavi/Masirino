'use client';

import React, { useState, useMemo } from 'react';
import {
  runPathEngineV2,
  PathEngineOutputV2,
  PathRecommendationResult,
} from '@/lib/scoring/pathEngine';
import {
  ONET_CAREER_CLUSTERS,
  ONET_CAREER_DATABASE,
} from '@/lib/scoring/pathEngineTables';
import { GARDNER_VALID_KEYS } from '@/src/pathEngine/debug/validateInput';
import {
  Sparkles,
  Copy,
  Check,
  Compass,
  Brain,
  Zap,
  UserCheck,
  Briefcase,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  Award,
  BarChart3,
  ExternalLink,
  Tag,
  ShieldCheck,
  Info,
} from 'lucide-react';

// Preset Scenarios
interface PresetScenario {
  id: string;
  category: 'cluster' | 'edge_case';
  title: string;
  desc: string;
  badge?: string;
  toggles?: { holland?: boolean; gardner?: boolean; mbti?: boolean; disc?: boolean };
  holland: { R: number; I: number; A: number; S: number; E: number; C: number };
  gardner: string[];
  mbti: { type: string; certainty: [number, number, number, number] };
  disc: 'D' | 'I' | 'S' | 'C';
}

const PRESETS: PresetScenario[] = [
  // --- دسته ۱: کلاسترهای شاخص O*NET ---
  {
    id: 'ai-software',
    category: 'cluster',
    title: 'توسعه هوش مصنوعی و نرم‌افزار (INTJ / I:90, C:75 / D)',
    desc: 'رغبت تحلیلی و قراردادی بسیار بالا، هوش منطقی و تیپ متمرکز',
    badge: 'فناوری و AI',
    holland: { R: 40, I: 92, A: 30, S: 20, E: 35, C: 70 },
    gardner: ['logical', 'spatial', 'intrapersonal'],
    mbti: { type: 'INTJ', certainty: [80, 75, 85, 70] },
    disc: 'D',
  },
  {
    id: 'clinical-medical',
    category: 'cluster',
    title: 'پزشکی و سلامت بالینی (INFJ / I:95, S:80 / S)',
    desc: 'هوش طبیعت‌گرا، تحلیل زیستی و تعامل درمانی عمیق',
    badge: 'سلامت و درمان',
    holland: { R: 40, I: 95, A: 20, S: 80, E: 30, C: 65 },
    gardner: ['naturalistic', 'logical', 'interpersonal'],
    mbti: { type: 'INFJ', certainty: [70, 80, 75, 75] },
    disc: 'S',
  },
  {
    id: 'business-strategy',
    category: 'cluster',
    title: 'مدیریت استراتژیک و کارآفرینی (ENTJ / E:95, S:65 / D)',
    desc: 'هوش کلامی، برون‌گرایی، رهبری جسورانه و تصمیم‌گیری قاطع',
    badge: 'مدیریت و تجارت',
    holland: { R: 20, I: 60, A: 35, S: 65, E: 96, C: 55 },
    gardner: ['linguistic', 'interpersonal', 'logical'],
    mbti: { type: 'ENTJ', certainty: [85, 70, 85, 90] },
    disc: 'D',
  },
  {
    id: 'digital-design',
    category: 'cluster',
    title: 'طراحی محصول دیجیتال و UI/UX (ENFP / A:92, S:55 / I)',
    desc: 'هوش فضایی و اجتماعی، خلاقیت دیداری و داستان‌سرایی کاربر',
    badge: 'هنر و دیزاین',
    holland: { R: 35, I: 60, A: 92, S: 50, E: 50, C: 45 },
    gardner: ['spatial', 'interpersonal', 'logical'],
    mbti: { type: 'ENFP', certainty: [75, 85, 80, 75] },
    disc: 'I',
  },
  {
    id: 'law-arbitration',
    category: 'cluster',
    title: 'وکالت و داوری حقوقی (ENTP / I:80, E:90 / C)',
    desc: 'هوش کلامی و منطقی، استدلال تحلیلی و فن بیان نافذ',
    badge: 'حقوق و قضا',
    holland: { R: 10, I: 80, A: 45, S: 65, E: 90, C: 65 },
    gardner: ['linguistic', 'logical', 'interpersonal'],
    mbti: { type: 'ENTP', certainty: [80, 85, 80, 75] },
    disc: 'C',
  },
  {
    id: 'applied-tech',
    category: 'cluster',
    title: 'تکنسین مکاترونیک و خودرو (ISTP / R:95, C:65 / D)',
    desc: 'هوش بدنی-حرکتی و فضایی، عیب‌یابی عملیاتی و مکانیکی',
    badge: 'فنی و مهندسی',
    holland: { R: 96, I: 60, A: 10, S: 20, E: 20, C: 65 },
    gardner: ['bodily', 'spatial', 'logical'],
    mbti: { type: 'ISTP', certainty: [85, 90, 85, 80] },
    disc: 'D',
  },
  {
    id: 'finance-investment',
    category: 'cluster',
    title: 'تحلیل مالی، بانکداری و بورس (INTJ / I:80, C:95 / C)',
    desc: 'تحلیل اعداد، محاسبات کمی و مدیریت ریسک سرمایه‌گذاری',
    badge: 'مالی و اقتصاد',
    holland: { R: 15, I: 80, A: 15, S: 25, E: 75, C: 95 },
    gardner: ['logical', 'intrapersonal', 'linguistic'],
    mbti: { type: 'INTJ', certainty: [85, 80, 90, 85] },
    disc: 'C',
  },
  {
    id: 'music-audio',
    category: 'cluster',
    title: 'آهنگسازی و تولید موسیقی (INFP / A:96, I:45 / I)',
    desc: 'هوش برتر موسیقی، خلق ملودی و فضاسازی عاطفی صوت',
    badge: 'موسیقی و صدا',
    holland: { R: 35, I: 45, A: 96, S: 35, E: 35, C: 35 },
    gardner: ['musical', 'intrapersonal', 'spatial'],
    mbti: { type: 'INFP', certainty: [80, 75, 85, 70] },
    disc: 'I',
  },
  {
    id: 'agritech-green',
    category: 'cluster',
    title: 'کشاورزی هوشمند و انرژی پاک (ISTJ / R:88, I:80 / S)',
    desc: 'هوش طبیعت‌گرا و منطقی، توسعه کشت نوین و انرژی خورشیدی',
    badge: 'محیط‌زیست و انرژی',
    holland: { R: 88, I: 80, A: 20, S: 35, E: 40, C: 60 },
    gardner: ['naturalistic', 'logical', 'spatial'],
    mbti: { type: 'ISTJ', certainty: [75, 85, 80, 80] },
    disc: 'S',
  },
  {
    id: 'linguistics-diplomacy',
    category: 'cluster',
    title: 'مترجمی همزمان و زبان‌شناسی (ENFJ / I:75, A:75 / I)',
    desc: 'هوش کلامی و بین‌فردی فوق‌العاده، مذاکرات چندزبانه',
    badge: 'زبان و دیپلماسی',
    holland: { R: 10, I: 75, A: 75, S: 75, E: 60, C: 50 },
    gardner: ['linguistic', 'interpersonal', 'intrapersonal'],
    mbti: { type: 'ENFJ', certainty: [85, 75, 80, 75] },
    disc: 'I',
  },

  // --- دسته ۲: سناریوهای مرزی و استرس‌تست (Scenarios 9-28) ---
  {
    id: 'scenario-9-baseline',
    category: 'edge_case',
    title: '⚠️ سناریو ۹: خط پایه کامل (هر ۴ تست غیرفعال / Null)',
    desc: 'بررسی فعال شدن فالبک‌های پیش‌فرض 0.75 و 0.85 و هشدار completenessWarning',
    badge: 'Baseline 4x Null',
    toggles: { holland: false, gardner: false, mbti: false, disc: false },
    holland: { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 },
    gardner: ['logical', 'spatial', 'linguistic'],
    mbti: { type: 'INTJ', certainty: [50, 50, 50, 50] },
    disc: 'D',
  },
  {
    id: 'scenario-10-holland-only',
    category: 'edge_case',
    title: '📄 سناریو ۱۰: تک‌آزمون (فقط هولند فعال، بقیه Null)',
    desc: 'سنجش نمره سازگاری زمانی که تنها یک آزمون تکمیل شده است',
    badge: 'Single Test',
    toggles: { holland: true, gardner: false, mbti: false, disc: false },
    holland: { R: 88, I: 40, A: 15, S: 15, E: 30, C: 55 },
    gardner: ['logical', 'spatial', 'linguistic'],
    mbti: { type: 'INTJ', certainty: [50, 50, 50, 50] },
    disc: 'D',
  },
  {
    id: 'scenario-11-zero-vector',
    category: 'edge_case',
    title: '⭕ سناریو ۱۱: بردار صفر مطلق هولند (همه ابعاد ۰)',
    desc: 'تست ایمنی تقسیم بر صفر در فرمول شباهت کسینوسی و جلوگیری از NaN',
    badge: 'Zero Vector',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
    gardner: ['logical', 'spatial', 'linguistic'],
    mbti: { type: 'INTJ', certainty: [50, 50, 50, 50] },
    disc: 'D',
  },
  {
    id: 'scenario-15-neutral-mbti',
    category: 'edge_case',
    title: '⚖️ سناریو ۱۵: تیپ MBTI خنثی ۵۰/۵۰ (XXXX)',
    desc: 'ارزیابی رفتار موتور در برابر کاربران کاملاً مردد و تطابق با هدف ۵۰',
    badge: 'Neutral MBTI',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 40, I: 88, A: 35, S: 15, E: 30, C: 70 },
    gardner: ['logical', 'spatial', 'linguistic'],
    mbti: { type: 'XXXX', certainty: [0, 0, 0, 0] },
    disc: 'D',
  },
  {
    id: 'scenario-16-max-mbti-penalty',
    category: 'edge_case',
    title: '💥 سناریو ۱۶: تضاد ۱۰۰٪ MBTI با محیط کار (حداکثر جریمه)',
    desc: 'تست کف فرمول Math.max(0.1, ...) و مقاومت سیستم در برابر تعارض محیطی',
    badge: 'Max Penalty',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 95, I: 20, A: 10, S: 10, E: 15, C: 30 },
    gardner: ['bodily', 'spatial', 'naturalistic'],
    mbti: { type: 'ENFP', certainty: [100, 100, 100, 100] },
    disc: 'D',
  },
  {
    id: 'peak-alignment-21',
    category: 'edge_case',
    title: '🎯 سناریو ۲۱: همسویی ۱۰۰٪ تمام ۴ آزمون (سقف نمره)',
    desc: 'هولند تحلیلی، گاردنر منطقی/فضایی، MBTI با INTJ و DISC تحلیلی C',
    badge: 'Peak Match (95%+)',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 40, I: 88, A: 35, S: 15, E: 30, C: 70 },
    gardner: ['logical', 'spatial', 'intrapersonal'],
    mbti: { type: 'INTJ', certainty: [90, 85, 92, 88] },
    disc: 'C',
  },
  {
    id: 'holland-gardner-conflict-22',
    category: 'edge_case',
    title: '⚡ سناریو ۲۲: تضاد کامل هولند فنی با گاردنر هنری/بدنی',
    desc: 'رغبت‌های RIASEC فنی/مکانیکی در تقابل با هوش‌های برتر موسیقی/حرکتی',
    badge: 'RIASEC vs Gardner',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 90, I: 85, A: 10, S: 10, E: 20, C: 60 },
    gardner: ['musical', 'bodily', 'interpersonal'],
    mbti: { type: 'ISTJ', certainty: [50, 50, 50, 50] },
    disc: 'D',
  },
  {
    id: 'scenario-26-out-of-bounds',
    category: 'edge_case',
    title: '📈 سناریو ۲۶: نمرات خارج از بازه مجاز (بیش از ۱۰۰)',
    desc: 'تست پایداری الگوریتم و کلمپ خروجی در برابر داده‌های ورودی ناهنجار',
    badge: 'Out of Bounds',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 150, I: 200, A: 0, S: 0, E: 50, C: 50 },
    gardner: ['logical', 'spatial', 'linguistic'],
    mbti: { type: 'INTJ', certainty: [80, 80, 80, 80] },
    disc: 'D',
  },
  {
    id: 'mbti-disc-tension-27',
    category: 'edge_case',
    title: '⚖️ سناریو ۲۷: تناقض DISC حمایتی (S) با MBTI رقابتی (ENTJ)',
    desc: 'ارزیابی رفتار موتور در تقابل تیپ شخصیتی با پوزیشنینگ تیمی',
    badge: 'DISC vs MBTI',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 15, I: 75, A: 15, S: 25, E: 70, C: 95 },
    gardner: ['logical', 'linguistic', 'interpersonal'],
    mbti: { type: 'ENTJ', certainty: [90, 80, 95, 85] },
    disc: 'S',
  },
  {
    id: 'full-stress-28',
    category: 'edge_case',
    title: '🔥 سناریو ۲۸: استرس تست کامل (۴ سیگنال متناقض)',
    desc: 'هولند به شدت هنری (A:96)، گاردنر منطقی، MBTI احساسی (INFP)، DISC قاطع (D)',
    badge: 'Stress Test',
    toggles: { holland: true, gardner: true, mbti: true, disc: true },
    holland: { R: 10, I: 20, A: 96, S: 30, E: 25, C: 20 },
    gardner: ['logical', 'linguistic', 'interpersonal'],
    mbti: { type: 'INFP', certainty: [70, 60, 75, 55] },
    disc: 'D',
  },
];

const GARDNER_LABELS: Record<string, string> = {
  logical: 'منطقی-ریاضی',
  spatial: 'فضایی-دیداری',
  linguistic: 'کلامی-زبانی',
  interpersonal: 'بین‌فردی (اجتماعی)',
  intrapersonal: 'درون‌فردی (خودآگاهی)',
  bodily: 'بدنی-حرکتی',
  musical: 'موسیقی و ریتم',
  naturalistic: 'طبیعت‌گرا',
};

export const PathEngineHarness: React.FC = () => {
  // Test Toggles
  const [includeHolland, setIncludeHolland] = useState(true);
  const [includeGardner, setIncludeGardner] = useState(true);
  const [includeMbti, setIncludeMbti] = useState(true);
  const [includeDisc, setIncludeDisc] = useState(true);

  // Preset Filter Tab
  const [presetFilter, setPresetFilter] = useState<'all' | 'cluster' | 'edge_case'>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ai-software');

  // Holland State
  const [hollandScores, setHollandScores] = useState({
    R: 40,
    I: 92,
    A: 30,
    S: 20,
    E: 35,
    C: 70,
  });

  // Gardner State (Top 3 ordered)
  const [selectedGardner, setSelectedGardner] = useState<string[]>([
    'logical',
    'spatial',
    'intrapersonal',
  ]);

  // MBTI State
  const [mbtiEI, setMbtiEI] = useState<'E' | 'I'>('I');
  const [mbtiSN, setMbtiSN] = useState<'S' | 'N'>('N');
  const [mbtiTF, setMbtiTF] = useState<'T' | 'F'>('T');
  const [mbtiJP, setMbtiJP] = useState<'J' | 'P'>('J');
  const [certaintyEI, setCertaintyEI] = useState(80);
  const [certaintySN, setCertaintySN] = useState(75);
  const [certaintyTF, setCertaintyTF] = useState(85);
  const [certaintyJP, setCertaintyJP] = useState(70);

  // DISC State
  const [discProfile, setDiscProfile] = useState<'D' | 'I' | 'S' | 'C'>('D');

  // UI State
  const [activeTab, setActiveTab] = useState<'summary' | 'clusters' | 'allJobs' | 'json'>('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  // Apply Preset
  const applyPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    if (preset.toggles) {
      setIncludeHolland(preset.toggles.holland ?? true);
      setIncludeGardner(preset.toggles.gardner ?? true);
      setIncludeMbti(preset.toggles.mbti ?? true);
      setIncludeDisc(preset.toggles.disc ?? true);
    } else {
      setIncludeHolland(true);
      setIncludeGardner(true);
      setIncludeMbti(true);
      setIncludeDisc(true);
    }

    setHollandScores(preset.holland);
    setSelectedGardner(preset.gardner);
    setMbtiEI((preset.mbti.type[0] as 'E' | 'I') || 'I');
    setMbtiSN((preset.mbti.type[1] as 'S' | 'N') || 'N');
    setMbtiTF((preset.mbti.type[2] as 'T' | 'F') || 'T');
    setMbtiJP((preset.mbti.type[3] as 'J' | 'P') || 'J');
    setCertaintyEI(preset.mbti.certainty[0]);
    setCertaintySN(preset.mbti.certainty[1]);
    setCertaintyTF(preset.mbti.certainty[2]);
    setCertaintyJP(preset.mbti.certainty[3]);
    setDiscProfile(preset.disc as any);
  };

  // Toggle Gardner Item
  const handleToggleGardner = (key: string) => {
    if (selectedGardner.includes(key)) {
      setSelectedGardner(selectedGardner.filter((k) => k !== key));
    } else {
      if (selectedGardner.length < 3) {
        setSelectedGardner([...selectedGardner, key]);
      } else {
        setSelectedGardner([selectedGardner[1], selectedGardner[2], key]);
      }
    }
  };

  // Engine Output Calculation
  const v2Output: PathEngineOutputV2 = useMemo(() => {
    const hollandData = includeHolland
      ? {
          scores: hollandScores,
          normalizedScores: hollandScores,
          code: 'RIA',
          primaryDimension: 'R',
        }
      : null;

    const gardnerData = includeGardner
      ? {
          topIntelligences: selectedGardner,
          strongIntelligences: selectedGardner,
          scores: {
            [selectedGardner[0] || 'logical']: 4.8,
            [selectedGardner[1] || 'spatial']: 4.2,
            [selectedGardner[2] || 'linguistic']: 3.8,
          },
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

    return runPathEngineV2(hollandData as any, gardnerData as any, mbtiData as any, discData as any);
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
    navigator.clipboard.writeText(JSON.stringify(v2Output, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Filtered Career Catalog
  const filteredAllJobs = useMemo(() => {
    let list = [...v2Output.allPathsRanked];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.titleFa.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.cluster.titleFa.toLowerCase().includes(q) ||
          p.onetCode.toLowerCase().includes(q)
      );
    }
    return list;
  }, [v2Output.allPathsRanked, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans text-ink-900" dir="rtl">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-navy-700 border-thick border-ink-900 rounded-3xl p-6 md:p-8 text-white elevated-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>موتور هوشمند هدایت شغلی V2 بر پایه داده‌های بومی‌سازی‌شده O*NET</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              میز آزمایش محاسباتی موتور هدایت شغلی (Path Engine V2)
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl">
              تلفیق شباهت کسینوسی هالند (Cosine Similarity)، برازش شناختی گاردنر بدون پاداش صلب، شاخص ۶بعدی MBTI و موقعیت‌یابی رفتاری درون‌تیمی با DISC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyJsonTrace}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 transition rounded-xl text-sm font-medium border border-white/30 backdrop-blur-md"
            >
              {copiedJson ? <Check className="w-4 h-4 text-teal-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedJson ? 'JSON کپی شد' : 'کپی خروجی کامل V2 (JSON)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <Award className="w-5 h-5 text-amber-500" />
            <span>سناریوهای آماده و پروفایل‌های مرزی O*NET:</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPresetFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                presetFilter === 'all'
                  ? 'bg-white text-teal-800 font-bold shadow-xs'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              همه سناریوها ({PRESETS.length})
            </button>
            <button
              onClick={() => setPresetFilter('cluster')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                presetFilter === 'cluster'
                  ? 'bg-white text-teal-800 font-bold shadow-xs'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              کلاسترهای شاخص ({PRESETS.filter((p) => p.category === 'cluster').length})
            </button>
            <button
              onClick={() => setPresetFilter('edge_case')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                presetFilter === 'edge_case'
                  ? 'bg-white text-teal-800 font-bold shadow-xs'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              سناریوهای مرزی و استرس ({PRESETS.filter((p) => p.category === 'edge_case').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {PRESETS.filter((p) => presetFilter === 'all' || p.category === presetFilter).map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`text-right p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2 active:scale-[0.98] ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-neutral-200 hover:border-teal-400 hover:bg-neutral-50/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    {preset.badge && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          preset.category === 'edge_case'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-teal-100/80 text-teal-800 border border-teal-300'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    )}
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
                    )}
                  </div>
                  <div
                    className={`font-bold line-clamp-2 leading-snug ${
                      isSelected ? 'text-teal-900' : 'text-ink-900'
                    }`}
                  >
                    {preset.title}
                  </div>
                </div>
                <div className="text-ink-500 text-[11px] line-clamp-2 leading-relaxed mt-1">
                  {preset.desc}
                </div>
              </button>
            );
          })}
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
                          [item.key]: parseInt(e.target.value, 10),
                        })
                      }
                      className={`w-full h-2 bg-neutral-200 rounded-lg cursor-pointer ${item.color}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Gardner 8 Intelligences */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-600" />
                <span className="font-bold text-base text-ink-900">۲. هوش‌های سه‌گانه برتر گاردنر</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGardner}
                  onChange={(e) => setIncludeGardner(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                />
                <span className={includeGardner ? 'text-pink-700' : 'text-neutral-400'}>فعال</span>
              </label>
            </div>

            {includeGardner && (
              <div className="space-y-3">
                <div className="text-xs text-ink-600">
                  ۳ هوش برتر را به ترتیب اولویت انتخاب کنید (ضریب رتبه ۱: ۱.۰، رتبه ۲: ۰.۷، رتبه ۳: ۰.۴):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {GARDNER_VALID_KEYS.map((key) => {
                    const idx = selectedGardner.indexOf(key);
                    const isSelected = idx !== -1;
                    return (
                      <button
                        key={key}
                        onClick={() => handleToggleGardner(key)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-right flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-pink-50 border-pink-500 text-pink-900 shadow-sm'
                            : 'bg-neutral-50/70 border-neutral-200 text-ink-700 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="line-clamp-1">{GARDNER_LABELS[key] || key}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mr-1">
                            {idx + 1}
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
                <Zap className="w-5 h-5 text-navy-600" />
                <span className="font-bold text-base text-ink-900">۳. تیپ شخصیتی و شدت قطعیت MBTI</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMbti}
                  onChange={(e) => setIncludeMbti(e.target.checked)}
                  className="rounded text-navy-600 focus:ring-navy-500 w-4 h-4"
                />
                <span className={includeMbti ? 'text-navy-700' : 'text-neutral-400'}>فعال</span>
              </label>
            </div>

            {includeMbti && (
              <div className="space-y-4">
                {[
                  {
                    axis: 'EI',
                    label: 'انرژی و تعامل',
                    val: mbtiEI,
                    setVal: setMbtiEI,
                    opt1: { k: 'E', l: 'برون‌گرا (E)' },
                    opt2: { k: 'I', l: 'درون‌گرا (I)' },
                    cert: certaintyEI,
                    setCert: setCertaintyEI,
                  },
                  {
                    axis: 'SN',
                    label: 'دریافت اطلاعات',
                    val: mbtiSN,
                    setVal: setMbtiSN,
                    opt1: { k: 'S', l: 'حسی/عینی (S)' },
                    opt2: { k: 'N', l: 'شهودی/انتزاعی (N)' },
                    cert: certaintySN,
                    setCert: setCertaintySN,
                  },
                  {
                    axis: 'TF',
                    label: 'تصمیم‌گیری',
                    val: mbtiTF,
                    setVal: setMbtiTF,
                    opt1: { k: 'T', l: 'منطقی/تحلیلی (T)' },
                    opt2: { k: 'F', l: 'ارزشی/عاطفی (F)' },
                    cert: certaintyTF,
                    setCert: setCertaintyTF,
                  },
                  {
                    axis: 'JP',
                    label: 'سبک زندگی و سازماندهی',
                    val: mbtiJP,
                    setVal: setMbtiJP,
                    opt1: { k: 'J', l: 'قضاوتی/با برنامه (J)' },
                    opt2: { k: 'P', l: 'منعطف/پویا (P)' },
                    cert: certaintyJP,
                    setCert: setCertaintyJP,
                  },
                ].map((row) => (
                  <div key={row.axis} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-ink-800">
                      <span>{row.label}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => row.setVal(row.opt1.k as any)}
                          className={`px-2 py-0.5 rounded text-xs transition ${
                            row.val === row.opt1.k
                              ? 'bg-navy-700 text-white font-bold'
                              : 'bg-white text-ink-700 border border-neutral-300'
                          }`}
                        >
                          {row.opt1.l}
                        </button>
                        <button
                          onClick={() => row.setVal(row.opt2.k as any)}
                          className={`px-2 py-0.5 rounded text-xs transition ${
                            row.val === row.opt2.k
                              ? 'bg-navy-700 text-white font-bold'
                              : 'bg-white text-ink-700 border border-neutral-300'
                          }`}
                        >
                          {row.opt2.l}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-ink-500 shrink-0">شدت تمایل: {row.cert}٪</span>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={row.cert}
                        onChange={(e) => row.setCert(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-neutral-200 rounded-lg cursor-pointer accent-navy-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: DISC */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-300/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
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
                  تیپ رفتاری غالب برای استخراج پوزیشنینگ و نقش عملیاتی درون‌تیمی:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'D', label: 'D (تسلط و قاطعیت)' },
                    { key: 'I', label: 'I (تاثیرگذاری و انگیزش)' },
                    { key: 'S', label: 'S (ثبات و پایداری)' },
                    { key: 'C', label: 'C (دقت و وظیفه‌شناسی)' },
                  ].map((d) => (
                    <button
                      key={d.key}
                      onClick={() => setDiscProfile(d.key as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                        discProfile === d.key
                          ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-sm'
                          : 'bg-neutral-50 border-neutral-200 text-ink-700 hover:bg-neutral-100'
                      }`}
                    >
                      {d.key}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Realtime Engine Outputs & Traces (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
            {[
              { id: 'summary', label: 'سبد ۷ مسیره پیشنهادی', icon: <Layers className="w-4 h-4" /> },
              { id: 'clusters', label: '۳ کلاستر رغبتی برتر O*NET', icon: <Compass className="w-4 h-4" /> },
              { id: 'allJobs', label: 'کاتالوگ ارزیابی مشاغل O*NET', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'json', label: 'کد خام JSON خروجی', icon: <Tag className="w-4 h-4" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-ink-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Summary 7-Path Basket */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* V3 Adaptive Weights Banner */}
              {v2Output.adaptiveWeightsUsed && (
                <div className="bg-neutral-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold">وزن‌دهی تطبیقی پویا (Adaptive Priors V3):</span>
                  </div>
                  <div className="flex items-center gap-3 font-numeric font-bold">
                    <span className="bg-neutral-800 px-2.5 py-1 rounded-lg text-teal-300">
                      هولند: {(v2Output.adaptiveWeightsUsed.holland * 100).toFixed(1)}٪
                    </span>
                    <span className="bg-neutral-800 px-2.5 py-1 rounded-lg text-pink-300">
                      گاردنر: {(v2Output.adaptiveWeightsUsed.gardner * 100).toFixed(1)}٪
                    </span>
                    <span className="bg-neutral-800 px-2.5 py-1 rounded-lg text-navy-300">
                      MBTI: {(v2Output.adaptiveWeightsUsed.mbti * 100).toFixed(1)}٪
                    </span>
                  </div>
                </div>
              )}

              {/* Main Path Card (Top 1) */}
              <div className="bg-gradient-to-br from-teal-50 via-white to-amber-50/30 rounded-3xl p-6 border-2 border-teal-600 shadow-md space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700 text-white rounded-full text-xs font-black">
                        <Award className="w-3.5 h-3.5 text-amber-300" />
                        <span>مسیر شغلی اصلی (اولویت ۱)</span>
                      </div>
                      {v2Output.basket.mainPath.marketViabilityScore && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-numeric">
                          پایداری بازار: {v2Output.basket.mainPath.marketViabilityScore}٪
                        </span>
                      )}
                      {v2Output.basket.mainPath.strategicScore && (
                        <span className="text-[11px] font-bold text-navy-800 bg-navy-100 px-2.5 py-0.5 rounded-full font-numeric">
                          نمره راهبردی: {v2Output.basket.mainPath.strategicScore}٪
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-ink-900 pt-1">
                      {v2Output.basket.mainPath.titleFa}
                    </h2>
                    <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-lg inline-block">
                      {v2Output.basket.mainPath.cluster.titleFa} (SOC: {v2Output.basket.mainPath.onetCode})
                    </span>
                  </div>

                  <div className="text-center bg-white px-4 py-3 rounded-2xl border-2 border-teal-600 shadow-sm shrink-0">
                    <div className="text-2xl font-black text-teal-700 font-numeric">
                      {v2Output.basket.mainPath.matchScore}٪
                    </div>
                    <span className="text-[10px] font-bold text-ink-500">شایستگی روان‌سنجی</span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-ink-700">
                  {v2Output.basket.mainPath.description}
                </p>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200 text-center">
                    <span className="text-[10px] text-ink-500 block">انطباق هالند</span>
                    <span className="text-sm font-bold text-teal-700 font-numeric">
                      {v2Output.basket.mainPath.metrics.hollandFit}٪
                    </span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200 text-center">
                    <span className="text-[10px] text-ink-500 block">انطباق گاردنر</span>
                    <span className="text-sm font-bold text-pink-700 font-numeric">
                      {v2Output.basket.mainPath.metrics.gardnerFit}٪
                    </span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200 text-center">
                    <span className="text-[10px] text-ink-500 block">آرامش MBTI</span>
                    <span className="text-sm font-bold text-navy-700 font-numeric">
                      {v2Output.basket.mainPath.metrics.mbtiFit}٪
                    </span>
                  </div>
                </div>

                {/* DISC In-Role Positioning Box */}
                <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-amber-700" />
                      <span>پوزیشن و سبک عملیاتی درون شغل (DISC):</span>
                    </span>
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                      «{v2Output.basket.mainPath.discPositioning.targetRoleTitle}»
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    {v2Output.basket.mainPath.discPositioning.workStyleGuidance}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {v2Output.basket.mainPath.discPositioning.strengthsInRole.map((st, i) => (
                      <span key={i} className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-amber-200 text-amber-900 font-bold">
                        ✓ {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Educational Roadmap */}
                <div className="text-xs text-ink-600 pt-1 border-t border-neutral-200/80 flex items-center justify-between">
                  <span><strong>رشته پیشنهادی دبیرستان:</strong> {v2Output.basket.mainPath.educationalRoadmap.highSchoolTrack}</span>
                  <span><strong>دانشگاه:</strong> {v2Output.basket.mainPath.educationalRoadmap.universityMajors.slice(0, 2).join('، ')}</span>
                </div>
              </div>

              {/* 3 Alternative Paths (Same Cluster) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-black text-ink-900">
                  <span className="w-2 h-4 bg-teal-600 rounded-full" />
                  <span>۳ مسیر جایگزین (طرح پشتیبان در همان کلاستر تخصصی)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {v2Output.basket.alternativePaths.map((alt) => (
                    <div key={alt.jobId} className="bg-white rounded-2xl p-4 border border-neutral-300 shadow-sm space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {alt.cluster.titleFa}
                          </span>
                          <div className="flex items-center gap-1 font-numeric">
                            <span className="text-xs font-black text-teal-700">{alt.matchScore}٪</span>
                            {alt.strategicScore && (
                              <span className="text-[10px] text-navy-600 font-bold">({alt.strategicScore}٪ V3)</span>
                            )}
                          </div>
                        </div>
                        <h3 className="text-sm font-black text-ink-900 pt-1">{alt.titleFa}</h3>
                        <p className="text-[11px] text-ink-600 line-clamp-2">{alt.description}</p>
                      </div>

                      <div className="bg-neutral-50 p-2 rounded-xl text-[11px] text-ink-700 border border-neutral-200">
                        <span className="font-bold text-ink-900 block">نقش DISC:</span>
                        <span className="line-clamp-1">{alt.discPositioning.targetRoleTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Complementary Paths (MMR Multimodal 20D) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-black text-ink-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-4 bg-pink-600 rounded-full" />
                    <span>۳ مسیر مکمل و خلاقانه (الگوریتم تنوع MMR در فضای ۲۰ بعدی)</span>
                  </div>
                  <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full font-mono">
                    λ = 0.65 (MMR)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {v2Output.basket.complementaryPaths.map((comp) => (
                    <div key={comp.jobId} className="bg-white rounded-2xl p-4 border border-neutral-300 shadow-sm space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                            {comp.cluster.titleFa}
                          </span>
                          <div className="flex items-center gap-1 font-numeric">
                            <span className="text-xs font-black text-pink-700">{comp.matchScore}٪</span>
                            {comp.mmrScore !== undefined && (
                              <span className="text-[10px] text-pink-500 font-mono">MMR: {comp.mmrScore}</span>
                            )}
                          </div>
                        </div>
                        <h3 className="text-sm font-black text-ink-900 pt-1">{comp.titleFa}</h3>
                        <p className="text-[11px] text-ink-600 line-clamp-2">{comp.description}</p>
                      </div>

                      <div className="bg-neutral-50 p-2 rounded-xl text-[11px] text-ink-700 border border-neutral-200">
                        <span className="font-bold text-ink-900 block">نقش DISC:</span>
                        <span className="line-clamp-1">{comp.discPositioning.targetRoleTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: O*NET Top 3 Clusters */}
          {activeTab === 'clusters' && (
            <div className="space-y-4">
              <div className="text-xs text-ink-600 bg-neutral-100 p-3 rounded-xl border border-neutral-200">
                این ۳ کلاستر شغلی با محاسبه شباهت کسینوسی (Cosine Similarity) بردار RIASEC شما با ۲۰ کلاستر استاندارد O*NET شناسایی شده‌اند:
              </div>

              <div className="space-y-3">
                {v2Output.topCareerClusters.map((cl, idx) => (
                  <div key={cl.clusterId} className="bg-white p-4 rounded-2xl border border-neutral-300 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 font-numeric">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-ink-900">{cl.titleFa}</h3>
                        <span className="text-xs text-ink-500 font-sans">{cl.titleEn}</span>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-base font-black text-teal-700 font-numeric">{cl.affinityScore}٪</span>
                      <span className="text-[10px] text-ink-500 block">قرابت رغبتی</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: All O*NET Jobs */}
          {activeTab === 'allJobs' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-ink-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجو در عناوین شغلی، کلاسترها یا کدهای O*NET..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-9 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                {filteredAllJobs.map((job, idx) => (
                  <div key={job.jobId} className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-ink-400 font-numeric ml-1.5 font-bold">#{idx + 1}</span>
                        <span className="text-sm font-black text-ink-900">{job.titleFa}</span>
                        <span className="text-xs text-ink-500 mr-2 font-mono">({job.onetCode})</span>
                      </div>
                      <span className="text-sm font-black text-teal-700 font-numeric">{job.matchScore}٪</span>
                    </div>

                    <div className="text-xs text-ink-600 line-clamp-1">{job.description}</div>

                    <div className="flex items-center justify-between text-[11px] text-ink-500 pt-1 border-t border-neutral-100">
                      <span>کلاستر: {job.cluster.titleFa}</span>
                      <span>نقش غالب DISC: <strong>{job.discPositioning.targetRoleTitle}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Raw JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-ink-700">خروجی کامل آبجکت V2 (JSON):</span>
                <button
                  onClick={copyJsonTrace}
                  className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی محتوا</span>
                </button>
              </div>
              <pre className="bg-neutral-900 text-teal-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px] dir-ltr text-left">
                {JSON.stringify(v2Output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
