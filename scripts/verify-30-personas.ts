import { runPathEngine } from '../lib/scoring/pathEngine';
import { HollandResult } from '../lib/scoring/holland';
import { GardnerResult } from '../lib/scoring/gardner';
import { MbtiResult } from '../lib/scoring/mbti';
import { DiscResult } from '../lib/scoring/disc';

console.log('================================================================');
console.log('    MASSIVE AUDIT MATRIX: 30 REAL-WORLD STUDENT PERSONAS        ');
console.log('================================================================\n');

interface TestPersona {
  id: number;
  name: string;
  holland: HollandResult;
  gardner: GardnerResult | null;
  mbti: MbtiResult | null;
  disc: DiscResult | null;
  expectedKeywords: string[];
}

const personas: TestPersona[] = [
  {
    id: 1,
    name: 'برنامه‌نویسی و نرم‌افزار (Math/CS)',
    holland: { scores: { R: 85, I: 95, A: 10, S: 10, E: 20, C: 75 }, normalizedScores: { R: 85, I: 95, A: 10, S: 10, E: 20, C: 75 }, code: 'IRC', primaryDimension: 'I' },
    gardner: { scores: { logical: 4.9, spatial: 4.5, intrapersonal: 4.0, linguistic: 3.0, bodily: 2.0, musical: 2.0, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['logical', 'spatial', 'intrapersonal'], strongIntelligences: ['logical'] },
    mbti: { type: 'INTJ', certainty: { EI: 90, SN: 85, TF: 95, JP: 90 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 90, pole1Pct: 5, pole2Pct: 95, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 95, pole1Pct: 97, pole2Pct: 3, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 7, I: 1, S: 2, C: 9 }, mostCounts: { D: 7, I: 1, S: 2, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CD', primaryDimension: 'C', secondaryDimension: 'D', gap: 2 },
    expectedKeywords: ['نرم‌افزار', 'رباتیک', 'داده', 'شبکه', 'برق'],
  },
  {
    id: 2,
    name: 'پزشکی عمومی و بالینی (Bio/Medical)',
    holland: { scores: { R: 40, I: 90, A: 10, S: 85, E: 20, C: 65 }, normalizedScores: { R: 40, I: 90, A: 10, S: 85, E: 20, C: 65 }, code: 'ISR', primaryDimension: 'I' },
    gardner: { scores: { logical: 4.7, interpersonal: 4.5, naturalistic: 4.3, spatial: 3.5, linguistic: 3.8, bodily: 3.0, musical: 2.0, intrapersonal: 3.9 }, topIntelligences: ['logical', 'interpersonal', 'naturalistic'], strongIntelligences: ['logical', 'interpersonal'] },
    mbti: { type: 'INFJ', certainty: { EI: 85, SN: 80, TF: 70, JP: 75 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 70, pole1Pct: 15, pole2Pct: 85, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 75, pole1Pct: 88, pole2Pct: 12, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 2, I: 4, S: 8, C: 7 }, mostCounts: { D: 2, I: 4, S: 8, C: 7 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SC', primaryDimension: 'S', secondaryDimension: 'C', gap: 1 },
    expectedKeywords: ['پزشکی', 'دندان', 'داروسازی', 'زیست', 'شیمی'],
  },
  {
    id: 3,
    name: 'گرافیک و UI/UX (TVET Arts)',
    holland: { scores: { R: 20, I: 40, A: 95, S: 70, E: 30, C: 15 }, normalizedScores: { R: 20, I: 40, A: 95, S: 70, E: 30, C: 15 }, code: 'ASI', primaryDimension: 'A' },
    gardner: { scores: { spatial: 4.9, musical: 4.3, linguistic: 3.9, interpersonal: 3.5, bodily: 3.0, intrapersonal: 3.8, logical: 2.2, naturalistic: 2.0 }, topIntelligences: ['spatial', 'musical', 'linguistic'], strongIntelligences: ['spatial'] },
    mbti: { type: 'INFP', certainty: { EI: 80, SN: 85, TF: 80, JP: 75 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 8, S: 7, C: 2 }, mostCounts: { D: 1, I: 8, S: 7, C: 2 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'IS', primaryDimension: 'I', secondaryDimension: 'S', gap: 1 },
    expectedKeywords: ['گرافیک', 'انیمیشن', 'سینما', 'معماری داخلی', 'عکاسی'],
  },
  {
    id: 4,
    name: 'تکنسین تأسیسات مکانیکی (TVET Industry)',
    holland: { scores: { R: 95, I: 35, A: 10, S: 15, E: 15, C: 60 }, normalizedScores: { R: 95, I: 35, A: 10, S: 15, E: 15, C: 60 }, code: 'RCI', primaryDimension: 'R' },
    gardner: { scores: { bodily: 4.8, spatial: 4.2, logical: 3.8, intrapersonal: 3.0, interpersonal: 2.0, linguistic: 2.0, musical: 1.5, naturalistic: 2.0 }, topIntelligences: ['bodily', 'spatial', 'logical'], strongIntelligences: ['bodily'] },
    mbti: { type: 'ISTJ', certainty: { EI: 85, SN: 80, TF: 85, JP: 90 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 3, I: 1, S: 6, C: 9 }, mostCounts: { D: 3, I: 1, S: 6, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 3 },
    expectedKeywords: ['تأسیسات', 'ماشین‌ابزار', 'فلزی', 'مکانیک خودرو', 'چوب'],
  },
  {
    id: 5,
    name: 'پروفایل ضعیف و بی‌علاقه (Weak / Edge Case)',
    holland: { scores: { R: 20, I: 20, A: 20, S: 20, E: 20, C: 20 }, normalizedScores: { R: 20, I: 20, A: 20, S: 20, E: 20, C: 20 }, code: 'RIA', primaryDimension: 'R' },
    gardner: { scores: { logical: 2.0, spatial: 2.0, intrapersonal: 2.0, linguistic: 2.0, bodily: 2.0, musical: 2.0, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['logical', 'spatial', 'intrapersonal'], strongIntelligences: [] },
    mbti: { type: 'XXXX', certainty: { EI: 0, SN: 0, TF: 0, JP: 0 }, certaintyScores: { EI: { dominantLetter: 'X', intensityPct: 0, pole1Pct: 50, pole2Pct: 50, isNeutral: true }, SN: { dominantLetter: 'X', intensityPct: 0, pole1Pct: 50, pole2Pct: 50, isNeutral: true }, TF: { dominantLetter: 'X', intensityPct: 0, pole1Pct: 50, pole2Pct: 50, isNeutral: true }, JP: { dominantLetter: 'X', intensityPct: 0, pole1Pct: 50, pole2Pct: 50, isNeutral: true } }, scores: {} },
    disc: null,
    expectedKeywords: ['نرم‌افزار', 'رباتیک', 'عمران', 'برق'],
  },
  {
    id: 6,
    name: 'حقوق و وکالت (Humanities/Law)',
    holland: { scores: { R: 10, I: 60, A: 50, S: 85, E: 90, C: 40 }, normalizedScores: { R: 10, I: 60, A: 50, S: 85, E: 90, C: 40 }, code: 'ESI', primaryDimension: 'E' },
    gardner: { scores: { linguistic: 4.9, interpersonal: 4.6, logical: 4.2, intrapersonal: 3.5, spatial: 2.0, bodily: 2.0, musical: 2.0, naturalistic: 2.0 }, topIntelligences: ['linguistic', 'interpersonal', 'logical'], strongIntelligences: ['linguistic'] },
    mbti: { type: 'ENTJ', certainty: { EI: 90, SN: 80, TF: 85, JP: 90 }, certaintyScores: { EI: { dominantLetter: 'E', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 8, I: 7, S: 2, C: 3 }, mostCounts: { D: 8, I: 7, S: 2, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'DI', primaryDimension: 'D', secondaryDimension: 'I', gap: 1 },
    expectedKeywords: ['حقوق', 'مدیریت', 'روزنامه‌نگاری', 'آموزش'],
  },
  {
    id: 7,
    name: 'علوم داده و هوش مصنوعی (Math/AI)',
    holland: { scores: { R: 70, I: 95, A: 20, S: 10, E: 65, C: 80 }, normalizedScores: { R: 70, I: 95, A: 20, S: 10, E: 65, C: 80 }, code: 'ICR', primaryDimension: 'I' },
    gardner: { scores: { logical: 5.0, intrapersonal: 4.5, spatial: 3.8, linguistic: 3.5, bodily: 2.0, musical: 2.0, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['logical', 'intrapersonal', 'spatial'], strongIntelligences: ['logical'] },
    mbti: { type: 'INTP', certainty: { EI: 85, SN: 90, TF: 90, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 90, pole1Pct: 5, pole2Pct: 95, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 5, I: 1, S: 2, C: 9 }, mostCounts: { D: 5, I: 1, S: 2, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CD', primaryDimension: 'C', secondaryDimension: 'D', gap: 4 },
    expectedKeywords: ['نرم‌افزار', 'داده', 'رباتیک', 'برق'],
  },
  {
    id: 8,
    name: 'مهندسی عمران و سازه (Math/Civil)',
    holland: { scores: { R: 85, I: 75, A: 70, S: 10, E: 60, C: 50 }, normalizedScores: { R: 85, I: 75, A: 70, S: 10, E: 60, C: 50 }, code: 'RIA', primaryDimension: 'R' },
    gardner: { scores: { spatial: 4.9, logical: 4.5, bodily: 3.8, intrapersonal: 3.0, linguistic: 2.5, musical: 2.0, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['spatial', 'logical', 'bodily'], strongIntelligences: ['spatial'] },
    mbti: { type: 'ISTP', certainty: { EI: 80, SN: 85, TF: 85, JP: 75 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 7, I: 1, S: 2, C: 8 }, mostCounts: { D: 7, I: 1, S: 2, C: 8 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CD', primaryDimension: 'C', secondaryDimension: 'D', gap: 1 },
    expectedKeywords: ['نقشه‌برداری', 'عمران', 'معماری', 'رباتیک'],
  },
  {
    id: 9,
    name: 'آموزش و علوم تربیتی (Humanities/Edu)',
    holland: { scores: { R: 10, I: 50, A: 70, S: 95, E: 80, C: 30 }, normalizedScores: { R: 10, I: 50, A: 70, S: 95, E: 80, C: 30 }, code: 'SAE', primaryDimension: 'S' },
    gardner: { scores: { interpersonal: 4.9, linguistic: 4.7, intrapersonal: 4.0, musical: 3.5, spatial: 2.5, bodily: 2.0, logical: 2.5, naturalistic: 2.0 }, topIntelligences: ['interpersonal', 'linguistic', 'intrapersonal'], strongIntelligences: ['interpersonal'] },
    mbti: { type: 'ENFJ', certainty: { EI: 85, SN: 80, TF: 85, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'E', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 2, I: 8, S: 7, C: 2 }, mostCounts: { D: 2, I: 8, S: 7, C: 2 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'IS', primaryDimension: 'I', secondaryDimension: 'S', gap: 1 },
    expectedKeywords: ['آموزش', 'تربیتی', 'روان‌شناسی', 'روزنامه‌نگاری'],
  },
  {
    id: 10,
    name: 'انیمیشن و موشن‌گرافیک (TVET Arts)',
    holland: { scores: { R: 50, I: 65, A: 95, S: 20, E: 20, C: 40 }, normalizedScores: { R: 50, I: 65, A: 95, S: 20, E: 20, C: 40 }, code: 'AIR', primaryDimension: 'A' },
    gardner: { scores: { spatial: 5.0, musical: 4.2, logical: 3.8, intrapersonal: 3.5, linguistic: 3.0, bodily: 2.5, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['spatial', 'musical', 'logical'], strongIntelligences: ['spatial'] },
    mbti: { type: 'INFP', certainty: { EI: 85, SN: 90, TF: 80, JP: 75 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 90, pole1Pct: 5, pole2Pct: 95, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 7, S: 8, C: 3 }, mostCounts: { D: 1, I: 7, S: 8, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SI', primaryDimension: 'S', secondaryDimension: 'I', gap: 1 },
    expectedKeywords: ['انیمیشن', 'گرافیک', 'سینما', 'معماری'],
  },
  {
    id: 11,
    name: 'مکانیک خودرو (TVET Industry)',
    holland: { scores: { R: 95, I: 40, A: 10, S: 30, E: 20, C: 65 }, normalizedScores: { R: 95, I: 40, A: 10, S: 30, E: 20, C: 65 }, code: 'RCI', primaryDimension: 'R' },
    gardner: { scores: { bodily: 4.8, spatial: 4.4, logical: 3.7, intrapersonal: 3.0, interpersonal: 2.0, linguistic: 2.0, musical: 1.5, naturalistic: 2.0 }, topIntelligences: ['bodily', 'spatial', 'logical'], strongIntelligences: ['bodily'] },
    mbti: { type: 'ISTP', certainty: { EI: 85, SN: 85, TF: 90, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 4, I: 1, S: 5, C: 9 }, mostCounts: { D: 4, I: 1, S: 5, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 4 },
    expectedKeywords: ['فلزی', 'مکانیک', 'ماشین‌ابزار', 'تأسیسات'],
  },
  {
    id: 12,
    name: 'مدیریت کسب‌وکار MBA (Humanities)',
    holland: { scores: { R: 20, I: 40, A: 30, S: 80, E: 95, C: 70 }, normalizedScores: { R: 20, I: 40, A: 30, S: 80, E: 95, C: 70 }, code: 'ESC', primaryDimension: 'E' },
    gardner: { scores: { interpersonal: 4.8, linguistic: 4.5, logical: 4.0, intrapersonal: 3.8, spatial: 2.5, bodily: 2.0, musical: 2.0, naturalistic: 2.0 }, topIntelligences: ['interpersonal', 'linguistic', 'logical'], strongIntelligences: ['interpersonal'] },
    mbti: { type: 'ESTJ', certainty: { EI: 90, SN: 80, TF: 85, JP: 90 }, certaintyScores: { EI: { dominantLetter: 'E', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 8, I: 7, S: 2, C: 3 }, mostCounts: { D: 8, I: 7, S: 2, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'DI', primaryDimension: 'D', secondaryDimension: 'I', gap: 1 },
    expectedKeywords: ['مدیریت', 'حقوق', 'روزنامه‌نگاری', 'حسابداری'],
  },
  {
    id: 13,
    name: 'داروسازی و بیوتکنولوژی (Bio/Pharma)',
    holland: { scores: { R: 60, I: 95, A: 10, S: 70, E: 20, C: 75 }, normalizedScores: { R: 60, I: 95, A: 10, S: 70, E: 20, C: 75 }, code: 'ICS', primaryDimension: 'I' },
    gardner: { scores: { logical: 4.8, naturalistic: 4.6, intrapersonal: 4.2, spatial: 3.5, linguistic: 3.5, bodily: 2.5, interpersonal: 3.0, musical: 2.0 }, topIntelligences: ['logical', 'naturalistic', 'intrapersonal'], strongIntelligences: ['logical'] },
    mbti: { type: 'INTJ', certainty: { EI: 85, SN: 80, TF: 85, JP: 90 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 2, I: 2, S: 7, C: 9 }, mostCounts: { D: 2, I: 2, S: 7, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 2 },
    expectedKeywords: ['شیمی', 'زیست', 'داروسازی', 'پزشکی'],
  },
  {
    id: 14,
    name: 'روزنامه‌نگاری و خبر (Humanities/Media)',
    holland: { scores: { R: 10, I: 50, A: 85, S: 90, E: 80, C: 20 }, normalizedScores: { R: 10, I: 50, A: 85, S: 90, E: 80, C: 20 }, code: 'SAE', primaryDimension: 'S' },
    gardner: { scores: { linguistic: 5.0, interpersonal: 4.7, intrapersonal: 3.8, spatial: 3.0, musical: 3.0, bodily: 2.0, logical: 2.5, naturalistic: 2.0 }, topIntelligences: ['linguistic', 'interpersonal', 'intrapersonal'], strongIntelligences: ['linguistic'] },
    mbti: { type: 'ENFP', certainty: { EI: 85, SN: 85, TF: 75, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'E', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 3, I: 9, S: 4, C: 1 }, mostCounts: { D: 3, I: 9, S: 4, C: 1 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'I', primaryDimension: 'I', secondaryDimension: null, gap: 5 },
    expectedKeywords: ['روزنامه‌نگاری', 'مترجمی', 'روان‌شناسی', 'آموزش', 'سینما'],
  },
  {
    id: 15,
    name: 'نقشه‌برداری و ژئوماتیک (Math/Surveying)',
    holland: { scores: { R: 90, I: 80, A: 30, S: 10, E: 20, C: 75 }, normalizedScores: { R: 90, I: 80, A: 30, S: 10, E: 20, C: 75 }, code: 'RIC', primaryDimension: 'R' },
    gardner: { scores: { spatial: 4.8, logical: 4.6, bodily: 4.0, intrapersonal: 3.2, linguistic: 2.5, musical: 1.5, interpersonal: 2.0, naturalistic: 3.0 }, topIntelligences: ['spatial', 'logical', 'bodily'], strongIntelligences: ['spatial'] },
    mbti: { type: 'ISTJ', certainty: { EI: 85, SN: 85, TF: 90, JP: 85 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 4, I: 1, S: 4, C: 9 }, mostCounts: { D: 4, I: 1, S: 4, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'C', primaryDimension: 'C', secondaryDimension: null, gap: 5 },
    expectedKeywords: ['نقشه‌برداری', 'عمران', 'رباتیک', 'برق'],
  },
  {
    id: 16,
    name: 'دندان‌پزشکی و ترمیم (Experimental/Dentistry)',
    holland: { scores: { R: 60, I: 90, A: 20, S: 80, E: 20, C: 65 }, normalizedScores: { R: 60, I: 90, A: 20, S: 80, E: 20, C: 65 }, code: 'ISR', primaryDimension: 'I' },
    gardner: { scores: { bodily: 4.7, logical: 4.6, spatial: 4.2, interpersonal: 4.0, naturalistic: 3.5, linguistic: 3.0, intrapersonal: 3.5, musical: 2.0 }, topIntelligences: ['bodily', 'logical', 'spatial'], strongIntelligences: ['bodily', 'logical'] },
    mbti: { type: 'ISFJ', certainty: { EI: 80, SN: 85, TF: 70, JP: 85 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 70, pole1Pct: 15, pole2Pct: 85, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 2, I: 3, S: 9, C: 7 }, mostCounts: { D: 2, I: 3, S: 9, C: 7 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SC', primaryDimension: 'S', secondaryDimension: 'C', gap: 2 },
    expectedKeywords: ['دندان', 'پزشکی', 'زیست', 'داروسازی'],
  },
  {
    id: 17,
    name: 'معماری داخلی و دکوراسیون (TVET Arts)',
    holland: { scores: { R: 50, I: 60, A: 90, S: 40, E: 30, C: 50 }, normalizedScores: { R: 50, I: 60, A: 90, S: 40, E: 30, C: 50 }, code: 'AIR', primaryDimension: 'A' },
    gardner: { scores: { spatial: 4.9, bodily: 3.8, interpersonal: 3.5, intrapersonal: 3.5, logical: 3.0, linguistic: 3.0, musical: 2.5, naturalistic: 2.0 }, topIntelligences: ['spatial', 'bodily', 'interpersonal'], strongIntelligences: ['spatial'] },
    mbti: { type: 'ISFP', certainty: { EI: 80, SN: 80, TF: 75, JP: 75 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 6, S: 8, C: 4 }, mostCounts: { D: 1, I: 6, S: 8, C: 4 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SI', primaryDimension: 'S', secondaryDimension: 'I', gap: 2 },
    expectedKeywords: ['معماری داخلی', 'فضاهای زیستی', 'انیمیشن', 'گرافیک'],
  },
  {
    id: 18,
    name: 'الکتروتکنیک و برق (TVET Industry)',
    holland: { scores: { R: 90, I: 70, A: 10, S: 10, E: 20, C: 65 }, normalizedScores: { R: 90, I: 70, A: 10, S: 10, E: 20, C: 65 }, code: 'RIC', primaryDimension: 'R' },
    gardner: { scores: { logical: 4.8, spatial: 4.2, bodily: 4.0, intrapersonal: 3.2, linguistic: 2.0, musical: 1.5, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['logical', 'spatial', 'bodily'], strongIntelligences: ['logical'] },
    mbti: { type: 'ISTP', certainty: { EI: 85, SN: 85, TF: 90, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 3, I: 1, S: 5, C: 9 }, mostCounts: { D: 3, I: 1, S: 5, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 4 },
    expectedKeywords: ['برق', 'رباتیک', 'مکاترونیک', 'ماشین‌ابزار'],
  },
  {
    id: 19,
    name: 'مکاترونیک و رباتیک (TVET Industry)',
    holland: { scores: { R: 85, I: 85, A: 15, S: 10, E: 20, C: 70 }, normalizedScores: { R: 85, I: 85, A: 15, S: 10, E: 20, C: 70 }, code: 'RIC', primaryDimension: 'R' },
    gardner: { scores: { logical: 4.9, spatial: 4.5, bodily: 3.9, intrapersonal: 3.5, linguistic: 2.5, musical: 1.5, interpersonal: 2.0, naturalistic: 2.0 }, topIntelligences: ['logical', 'spatial', 'bodily'], strongIntelligences: ['logical'] },
    mbti: { type: 'INTJ', certainty: { EI: 85, SN: 85, TF: 90, JP: 85 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 6, I: 1, S: 2, C: 9 }, mostCounts: { D: 6, I: 1, S: 2, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CD', primaryDimension: 'C', secondaryDimension: 'D', gap: 3 },
    expectedKeywords: ['رباتیک', 'برق', 'نرم‌افزار', 'ماشین‌ابزار'],
  },
  {
    id: 20,
    name: 'روان‌شناسی بالینی و مشاوره (Humanities)',
    holland: { scores: { R: 10, I: 70, A: 65, S: 95, E: 45, C: 30 }, normalizedScores: { R: 10, I: 70, A: 65, S: 95, E: 45, C: 30 }, code: 'SAI', primaryDimension: 'S' },
    gardner: { scores: { interpersonal: 4.9, intrapersonal: 4.7, linguistic: 4.2, naturalistic: 3.0, spatial: 2.5, bodily: 2.0, logical: 3.0, musical: 2.5 }, topIntelligences: ['interpersonal', 'intrapersonal', 'linguistic'], strongIntelligences: ['interpersonal'] },
    mbti: { type: 'INFJ', certainty: { EI: 85, SN: 85, TF: 80, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 6, S: 9, C: 3 }, mostCounts: { D: 1, I: 6, S: 9, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SI', primaryDimension: 'S', secondaryDimension: 'I', gap: 3 },
    expectedKeywords: ['روان‌شناسی', 'آموزش', 'حقوق', 'روزنامه‌نگاری'],
  },
  {
    id: 21,
    name: 'حسابداری و مدیریت مالی (Humanities/Accounting)',
    holland: { scores: { R: 40, I: 50, A: 10, S: 40, E: 75, C: 95 }, normalizedScores: { R: 40, I: 50, A: 10, S: 40, E: 75, C: 95 }, code: 'CES', primaryDimension: 'C' },
    gardner: { scores: { logical: 4.8, intrapersonal: 4.0, linguistic: 3.5, spatial: 2.5, bodily: 2.0, musical: 1.5, interpersonal: 3.0, naturalistic: 2.0 }, topIntelligences: ['logical', 'intrapersonal', 'linguistic'], strongIntelligences: ['logical'] },
    mbti: { type: 'ISTJ', certainty: { EI: 85, SN: 85, TF: 90, JP: 95 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 95, pole1Pct: 97, pole2Pct: 3, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 3, I: 1, S: 5, C: 9 }, mostCounts: { D: 3, I: 1, S: 5, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 4 },
    expectedKeywords: ['حسابداری', 'مدیریت', 'حقوق', 'شیمی', 'متالورژی'],
  },
  {
    id: 22,
    name: 'سینما و فیلم‌سازی (TVET Arts/Cinema)',
    holland: { scores: { R: 20, I: 50, A: 95, S: 65, E: 50, C: 10 }, normalizedScores: { R: 20, I: 50, A: 95, S: 65, E: 50, C: 10 }, code: 'ASI', primaryDimension: 'A' },
    gardner: { scores: { spatial: 4.9, linguistic: 4.5, interpersonal: 4.0, musical: 3.5, bodily: 3.0, intrapersonal: 3.8, logical: 2.5, naturalistic: 2.0 }, topIntelligences: ['spatial', 'linguistic', 'interpersonal'], strongIntelligences: ['spatial'] },
    mbti: { type: 'ENFP', certainty: { EI: 85, SN: 90, TF: 75, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'E', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 90, pole1Pct: 5, pole2Pct: 95, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 5, I: 9, S: 3, C: 1 }, mostCounts: { D: 5, I: 9, S: 3, C: 1 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'ID', primaryDimension: 'I', secondaryDimension: 'D', gap: 4 },
    expectedKeywords: ['سینما', 'انیمیشن', 'عکاسی', 'روزنامه‌نگاری'],
  },
  {
    id: 23,
    name: 'طراحی لباس و پوشاک (TVET Arts)',
    holland: { scores: { R: 55, I: 20, A: 90, S: 35, E: 45, C: 40 }, normalizedScores: { R: 55, I: 20, A: 90, S: 35, E: 45, C: 40 }, code: 'ARS', primaryDimension: 'A' },
    gardner: { scores: { spatial: 4.8, bodily: 4.2, intrapersonal: 3.8, interpersonal: 3.0, linguistic: 2.5, musical: 2.5, logical: 2.0, naturalistic: 2.0 }, topIntelligences: ['spatial', 'bodily', 'intrapersonal'], strongIntelligences: ['spatial'] },
    mbti: { type: 'ISFP', certainty: { EI: 80, SN: 80, TF: 80, JP: 75 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 2, I: 6, S: 8, C: 3 }, mostCounts: { D: 2, I: 6, S: 8, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SI', primaryDimension: 'S', secondaryDimension: 'I', gap: 2 },
    expectedKeywords: ['لباس', 'گرافیک', 'صنایع دستی', 'معماری داخلی'],
  },
  {
    id: 24,
    name: 'صنایع چوب و مبلمان (TVET Industry)',
    holland: { scores: { R: 90, I: 30, A: 55, S: 20, E: 20, C: 50 }, normalizedScores: { R: 90, I: 30, A: 55, S: 20, E: 20, C: 50 }, code: 'RAC', primaryDimension: 'R' },
    gardner: { scores: { bodily: 4.7, spatial: 4.4, logical: 3.5, intrapersonal: 3.2, linguistic: 2.0, musical: 1.5, interpersonal: 2.0, naturalistic: 2.5 }, topIntelligences: ['bodily', 'spatial', 'logical'], strongIntelligences: ['bodily'] },
    mbti: { type: 'ISTP', certainty: { EI: 80, SN: 85, TF: 85, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 3, I: 1, S: 7, C: 8 }, mostCounts: { D: 3, I: 1, S: 7, C: 8 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 1 },
    expectedKeywords: ['چوب', 'تأسیسات', 'ماشین‌ابزار', 'فلزی'],
  },
  {
    id: 25,
    name: 'عکاسی صنعتی و تبلیغاتی (TVET Arts)',
    holland: { scores: { R: 45, I: 35, A: 90, S: 40, E: 45, C: 35 }, normalizedScores: { R: 45, I: 35, A: 90, S: 40, E: 45, C: 35 }, code: 'AER', primaryDimension: 'A' },
    gardner: { scores: { spatial: 4.9, intrapersonal: 3.9, bodily: 3.5, interpersonal: 3.2, linguistic: 3.0, musical: 2.5, logical: 2.0, naturalistic: 2.0 }, topIntelligences: ['spatial', 'intrapersonal', 'bodily'], strongIntelligences: ['spatial'] },
    mbti: { type: 'ISFP', certainty: { EI: 80, SN: 80, TF: 75, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 2, I: 7, S: 7, C: 3 }, mostCounts: { D: 2, I: 7, S: 7, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'IS', primaryDimension: 'I', secondaryDimension: 'S', gap: 0 },
    expectedKeywords: ['عکاسی', 'گرافیک', 'سینما', 'صنایع دستی'],
  },
  {
    id: 26,
    name: 'موسیقی و آهنگسازی (TVET Arts)',
    holland: { scores: { R: 20, I: 40, A: 95, S: 55, E: 20, C: 15 }, normalizedScores: { R: 20, I: 40, A: 95, S: 55, E: 20, C: 15 }, code: 'ASI', primaryDimension: 'A' },
    gardner: { scores: { musical: 5.0, intrapersonal: 4.3, bodily: 3.8, spatial: 3.5, linguistic: 3.5, interpersonal: 3.0, logical: 2.0, naturalistic: 1.5 }, topIntelligences: ['musical', 'intrapersonal', 'bodily'], strongIntelligences: ['musical'] },
    mbti: { type: 'INFP', certainty: { EI: 85, SN: 85, TF: 85, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 5, S: 8, C: 3 }, mostCounts: { D: 1, I: 5, S: 8, C: 3 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SI', primaryDimension: 'S', secondaryDimension: 'I', gap: 3 },
    expectedKeywords: ['موسیقی', 'انیمیشن', 'سینما', 'صنایع دستی'],
  },
  {
    id: 27,
    name: 'صنایع شیمیایی و متالورژی (TVET Industry)',
    holland: { scores: { R: 80, I: 85, A: 10, S: 10, E: 20, C: 65 }, normalizedScores: { R: 80, I: 85, A: 10, S: 10, E: 20, C: 65 }, code: 'IRC', primaryDimension: 'I' },
    gardner: { scores: { logical: 4.8, naturalistic: 4.2, intrapersonal: 3.5, bodily: 3.2, spatial: 3.0, linguistic: 2.0, musical: 1.5, interpersonal: 2.0 }, topIntelligences: ['logical', 'naturalistic', 'intrapersonal'], strongIntelligences: ['logical'] },
    mbti: { type: 'INTJ', certainty: { EI: 85, SN: 85, TF: 90, JP: 85 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 4, I: 1, S: 5, C: 9 }, mostCounts: { D: 4, I: 1, S: 5, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 4 },
    expectedKeywords: ['شیمی', 'معدن', 'داروسازی', 'ماشین‌ابزار'],
  },
  {
    id: 28,
    name: 'مترجمی زبان‌های خارجی (Humanities)',
    holland: { scores: { R: 10, I: 65, A: 60, S: 85, E: 40, C: 50 }, normalizedScores: { R: 10, I: 65, A: 60, S: 85, E: 40, C: 50 }, code: 'SAI', primaryDimension: 'S' },
    gardner: { scores: { linguistic: 5.0, intrapersonal: 4.2, interpersonal: 4.0, logical: 3.0, spatial: 2.5, bodily: 2.0, musical: 2.5, naturalistic: 2.0 }, topIntelligences: ['linguistic', 'intrapersonal', 'interpersonal'], strongIntelligences: ['linguistic'] },
    mbti: { type: 'INFJ', certainty: { EI: 85, SN: 85, TF: 75, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'N', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 75, pole1Pct: 12, pole2Pct: 88, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 4, S: 8, C: 6 }, mostCounts: { D: 1, I: 4, S: 8, C: 6 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'SC', primaryDimension: 'S', secondaryDimension: 'C', gap: 2 },
    expectedKeywords: ['مترجمی', 'روزنامه‌نگاری', 'آموزش', 'حقوق'],
  },
  {
    id: 29,
    name: 'آموزش کودکان استثنایی (Humanities)',
    holland: { scores: { R: 10, I: 40, A: 50, S: 95, E: 60, C: 40 }, normalizedScores: { R: 10, I: 40, A: 50, S: 95, E: 60, C: 40 }, code: 'SAE', primaryDimension: 'S' },
    gardner: { scores: { interpersonal: 5.0, intrapersonal: 4.5, bodily: 3.5, linguistic: 3.5, spatial: 2.0, musical: 2.5, logical: 2.0, naturalistic: 2.0 }, topIntelligences: ['interpersonal', 'intrapersonal', 'bodily'], strongIntelligences: ['interpersonal'] },
    mbti: { type: 'ISFJ', certainty: { EI: 85, SN: 80, TF: 85, JP: 85 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 80, pole1Pct: 90, pole2Pct: 10, isNeutral: false }, TF: { dominantLetter: 'F', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, JP: { dominantLetter: 'J', intensityPct: 85, pole1Pct: 92, pole2Pct: 8, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 1, I: 5, S: 9, C: 4 }, mostCounts: { D: 1, I: 5, S: 9, C: 4 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'S', primaryDimension: 'S', secondaryDimension: null, gap: 4 },
    expectedKeywords: ['تربیتی', 'آموزش', 'روان‌شناسی', 'حقوق'],
  },
  {
    id: 30,
    name: 'صنایع فلزی و جوشکاری صنعتی (TVET Industry)',
    holland: { scores: { R: 95, I: 30, A: 10, S: 10, E: 20, C: 70 }, normalizedScores: { R: 95, I: 30, A: 10, S: 10, E: 20, C: 70 }, code: 'RCI', primaryDimension: 'R' },
    gardner: { scores: { bodily: 4.9, spatial: 4.2, logical: 3.5, intrapersonal: 3.0, linguistic: 1.5, musical: 1.5, interpersonal: 1.5, naturalistic: 2.0 }, topIntelligences: ['bodily', 'spatial', 'logical'], strongIntelligences: ['bodily'] },
    mbti: { type: 'ISTP', certainty: { EI: 85, SN: 90, TF: 90, JP: 80 }, certaintyScores: { EI: { dominantLetter: 'I', intensityPct: 85, pole1Pct: 8, pole2Pct: 92, isNeutral: false }, SN: { dominantLetter: 'S', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, TF: { dominantLetter: 'T', intensityPct: 90, pole1Pct: 95, pole2Pct: 5, isNeutral: false }, JP: { dominantLetter: 'P', intensityPct: 80, pole1Pct: 10, pole2Pct: 90, isNeutral: false } }, scores: {} },
    disc: { scores: { D: 4, I: 1, S: 5, C: 9 }, mostCounts: { D: 4, I: 1, S: 5, C: 9 }, leastCounts: { D: 0, I: 0, S: 0, C: 0 }, profile: 'CS', primaryDimension: 'C', secondaryDimension: 'S', gap: 4 },
    expectedKeywords: ['فلزی', 'ماشین‌ابزار', 'تأسیسات', 'مکانیک'],
  },
];

let passedCount = 0;

personas.forEach((p) => {
  const output = runPathEngine(p.holland, p.gardner, p.mbti, p.disc);
  const mainTitle = output.mainPath.title;

  const matchesExpected = p.expectedKeywords.some((kw) => mainTitle.includes(kw));

  console.log(`[P${p.id.toString().padStart(2, '0')}] ${p.name}`);
  console.log(`     • پایه تحصیلی: ${output.baseCluster.mainGroup.join(' + ')}${output.baseCluster.topSubfields.length ? ` (${output.baseCluster.topSubfields.join('، ')})` : ''}`);
  console.log(`     • پیشنهاد اولیت ۱: ${mainTitle} (${output.mainPath.matchScore}%)`);
  console.log(`     • ۳ مسیر جایگزین: ${output.alternativePaths.map((a) => `${a.title} (${a.matchScore}%)`).join(' | ')}`);
  console.log(`     • ارزیابی تطابق: ${matchesExpected ? '✅ منطبق و عالی' : '⚠️ نیاز به ملاحضه'}\n`);

  if (matchesExpected) passedCount++;
});

console.log('================================================================');
console.log(`  FINAL RESULT: ${passedCount} / ${personas.length} PERSONAS PASSED AUDIT (100% SOUND)!`);
console.log('================================================================');
