import * as fs from 'fs';
import * as path from 'path';
import { runPathEngineV2 } from '../pathEngine';
import { validateGardnerInput } from './validateInput';

const inputPath = path.join(__dirname, 'test-input.json');
if (!fs.existsSync(inputPath)) {
  console.error(`❌ فایل ورودی یافت نشد: ${inputPath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

// Validation
if (raw.gardner?.topIntelligences) {
  const warnings = validateGardnerInput(raw.gardner.topIntelligences);
  if (warnings.length > 0) {
    console.log('\n----------------------------------------');
    warnings.forEach((w) => console.warn(w));
    console.log('----------------------------------------\n');
  }
}

const holland = raw.holland
  ? {
      normalizedScores: raw.holland.normalizedScores || raw.holland.scores,
      scores: raw.holland.scores || raw.holland.normalizedScores,
      code: raw.holland.code || 'RIA',
      primaryDimension: raw.holland.primaryDimension || 'R',
    }
  : null;

const gardner = raw.gardner ?? null;
const mbti = raw.mbti ?? null;
const disc = raw.disc ?? null;

const output = runPathEngineV2(holland, gardner, mbti, disc);

console.log('\n============================================================');
console.log('       PATH ENGINE V2 TEST HARNESS — TRACE REPORT           ');
console.log('============================================================\n');

console.log('=== ۱. سه کلاستر شغلی برتر O*NET (شباهت کسینوسی هالند) ===');
console.table(
  output.topCareerClusters.map((cl, i) => ({
    رتبه: i + 1,
    شناسه: cl.clusterId,
    عنوان: cl.titleFa,
    'قرابت%': `${cl.affinityScore}٪`,
  }))
);
console.log('');

console.log('=== ۲. مسیر شغلی اصلی (اولویت ۱) ===');
console.log(`عنوان: ${output.basket.mainPath.titleFa} (${output.basket.mainPath.onetCode})`);
console.log(`کلاستر: ${output.basket.mainPath.cluster.titleFa}`);
console.log(`نمره کل تطابق: ${output.basket.mainPath.matchScore}٪`);
console.log(`هالند: ${output.basket.mainPath.metrics.hollandFit}٪ | گاردنر: ${output.basket.mainPath.metrics.gardnerFit}٪ | MBTI: ${output.basket.mainPath.metrics.mbtiFit}٪`);
console.log(`پوزیشن درون‌تیمی DISC: ${output.basket.mainPath.discPositioning.targetRoleTitle}`);
console.log(`راهنمای سبک کار: ${output.basket.mainPath.discPositioning.workStyleGuidance}\n`);

console.log('=== ۳. مسیرهای جایگزین (همان کلاستر) ===');
console.table(
  output.basket.alternativePaths.map((p, i) => ({
    ردیف: i + 1,
    عنوان: p.titleFa,
    کلاستر: p.cluster.titleFa,
    تطابق: `${p.matchScore}٪`,
    نقش_DISC: p.discPositioning.targetRoleTitle,
  }))
);
console.log('');

console.log('=== ۴. مسیرهای مکمل (میان‌رشته‌ای) ===');
console.table(
  output.basket.complementaryPaths.map((p, i) => ({
    ردیف: i + 1,
    عنوان: p.titleFa,
    کلاستر: p.cluster.titleFa,
    تطابق: `${p.matchScore}٪`,
    نقش_DISC: p.discPositioning.targetRoleTitle,
  }))
);
console.log('');
