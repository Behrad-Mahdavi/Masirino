import * as fs from 'fs';
import * as path from 'path';
import { runPathEngineWithTrace } from '../pathEngine';
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
      code: raw.holland.code || '',
      primaryDimension: raw.holland.primaryDimension || 'R',
    }
  : null;

const gardner = raw.gardner ?? null;
const mbti = raw.mbti ?? null;
const disc = raw.disc ?? null;

const trace = runPathEngineWithTrace(holland, gardner, mbti, disc);

console.log('\n============================================================');
console.log('       PATH ENGINE TEST HARNESS — TRACE REPORT              ');
console.log('============================================================\n');

// ---------------------------------------------------------
// Stage 1-A & 1-B
// ---------------------------------------------------------
console.log('=== مرحله ۱-الف: گروه‌های اصلی ===');
console.table(trace.stage1.groupScoresNormalized);
console.log(
  `گروه پایه انتخاب‌شده: [${trace.stage1.mainGroup.join(', ')}] | فاصله رتبه ۱ و ۲: ${trace.stage1.groupGap}\n`
);

if (trace.stage1.subfieldScoresNormalized && trace.stage1.subfieldScoresNormalized.length > 0) {
  console.log('=== مرحله ۱-ب: زیررشته‌های فنی‌وحرفه‌ای ===');
  console.table(trace.stage1.subfieldScoresNormalized);
  console.log(
    `زیررشته‌های نهایی: [${trace.stage1.topSubfields.join(', ')}] | فاصله: ${trace.stage1.subfieldGap}\n`
  );
} else {
  console.log('=== مرحله ۱-ب: بدون زیررشته (مسیر نظری یا بدون شاخه فنی) ===\n');
}

// ---------------------------------------------------------
// Stage 2
// ---------------------------------------------------------
console.log('=== مرحله ۲: امتیاز گاردنر + پاداش هم‌راستایی (تمام ۲۸ مسیر) ===');
console.table(
  [...trace.stage2]
    .sort((a, b) => b.stage2Score - a.stage2Score)
    .map((s) => ({
      شناسه: s.pathId,
      مسیر: s.title,
      gardnerScore: Number(s.gardnerScore.toFixed(1)),
      alignmentBonus: s.alignmentBonus,
      دلیل: s.alignmentReason,
      stage2Score: Number(s.stage2Score.toFixed(1)),
      'باید حذف شود؟': s.excludedFromInitialList ? 'بله ⚠️' : 'خیر',
    }))
);
console.log('');

// ---------------------------------------------------------
// Stage 3
// ---------------------------------------------------------
console.log(`=== مرحله ۳: شکست MBTI برای مسیر اصلی (${trace.finalOutput.mainPath.title}) ===`);
const mainPathStage3 = trace.stage3.find((s) => s.pathId === trace.finalOutput.mainPath.pathId);
if (mainPathStage3) {
  console.table(
    mainPathStage3.axisBreakdown.map((b) => ({
      محور: b.axis,
      حرف: b.dominantLetter,
      بعد: b.targetDimension,
      هدف: b.targetValue,
      واقعی: b.actualValue,
      فاصله: Number(b.distance.toFixed(2)),
      'قطعیت%': b.certaintyPct,
      'وزن‌دار': Number(b.weightedDistance.toFixed(2)),
      'سهم محور': Number(b.axisContribution.toFixed(2)),
    }))
  );
  console.log(`ضریب نهایی MBTI مسیر اصلی: ${Number(mainPathStage3.mbtiMultiplier.toFixed(2))}\n`);
}

// ---------------------------------------------------------
// Stage 4.b
// ---------------------------------------------------------
console.log('=== مرحله ۴.ب: آستانه‌ی نهایی و نرمال‌سازی ===');
console.log(`حداکثر امتیاز خام تئوریک: ${trace.stage4b.maxRawScore}`);
console.log(
  `آستانه: ${trace.stage4b.thresholdValue} | تعداد واجد شرایط قبل از Relax: ${trace.stage4b.eligibleCountBeforeRelax} | Relax شد؟ ${trace.stage4b.thresholdWasRelaxed ? 'بله ⚠️' : 'خیر'}`
);
console.table(
  [...trace.stage4b.allPathScores]
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((p) => {
      const matchItem = trace.stage2.find((s) => s.pathId === p.pathId);
      return {
        شناسه: p.pathId,
        عنوان: matchItem?.title || p.pathId,
        rawFinalScore: Number(p.rawFinalScore.toFixed(1)),
        matchScore: `${p.matchScore}%`,
      };
    })
);
console.log('');

// ---------------------------------------------------------
// Stage 5
// ---------------------------------------------------------
console.log('=== مرحله ۵: انتخاب نهایی ۷ مسیر ===');
console.log(`مسیر اصلی (اولویت ۱): ${trace.finalOutput.mainPath.title} (${trace.finalOutput.mainPath.matchScore}%)\n`);

console.log('۳ مسیر جایگزین (Alternative):');
console.table(
  trace.finalOutput.alternativePaths.map((p, idx) => ({
    رتبه: idx + 1,
    شناسه: p.pathId,
    عنوان: p.title,
    تطابق: `${p.matchScore}%`,
    'هم‌پوشان گروه اصلی؟': trace.stage5.alternativePool[idx]?.matchesMainGroup ? 'بله ✅' : 'خیر ⚠️',
  }))
);
if (trace.stage5.alternativePoolFallbackTriggered) {
  console.log('⚠️ Fallback برای مسیرهای جایگزین فعال شد.\n');
} else {
  console.log('✅ مسیرهای جایگزین بدون نیاز به fallback از استخر هم‌خانواده انتخاب شدند.\n');
}

console.log('۳ مسیر مکمل (Complementary):');
console.table(
  trace.finalOutput.complementaryPaths.map((p, idx) => ({
    رتبه: idx + 1,
    شناسه: p.pathId,
    عنوان: p.title,
    تطابق: `${p.matchScore}%`,
  }))
);
if (trace.stage5.complementaryPoolFallbackTriggered) {
  console.log('⚠️ Fallback برای مسیرهای مکمل فعال شد.\n');
}

console.log('============================================================\n');
