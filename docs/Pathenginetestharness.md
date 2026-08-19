# بریف فنی: محیط تست دستی و یونیت‌تست موتور مسیر (Path Engine Test Harness)

> این سند سومین سند خانواده‌ی Path Engine است (بعد از `QuizLogics-Final.md` و `PathEngineLogic.md`). هدف: مشخص کردن دقیق چطور یک محیط تست بسازید که در آن بتوانید نمرات را سریع دستی وارد کنید، خروجی هر مرحله از الگوریتم (`pathEngine.ts`) را ببینید، و رفتار آن را در برابر سناریوهای خاص (به‌ویژه ۷ باگی که در بازبینی کد پیدا شد) اعتبارسنجی کنید.

---

## ۰. معماری کلی: دو لایه‌ی مستقل

| لایه | هدف | چه‌وقت استفاده می‌شود |
|---|---|---|
| **لایه‌ی ۱ — ابزار دستی (Debug CLI)** | وارد کردن سریع نمرات و دیدن *ردپای کامل* هر مرحله برای فهم شهودی رفتار الگوریتم | توسعه، دیباگ، توضیح رفتار الگوریتم به تیم محتوا/مشتری |
| **لایه‌ی ۲ — یونیت‌تست خودکار (Jest)** | قفل‌کردن رفتار مورد انتظار به‌صورت خودکار تا تغییرات بعدی کد چیزی را خراب نکنند | CI/CD، قبل از هر مرج، regression protection |

این دو لایه **مستقل از هم** ساخته می‌شوند اما هر دو به یک تغییر پیش‌نیاز در `pathEngine.ts` نیاز دارند (بند ۱).

---

## ۱. پیش‌نیاز: افشای داده‌ی میانی از `pathEngine.ts`

**مشکل فعلی:** تابع `runPathEngine()` فقط خروجی نهایی (۷ مسیر آماده) را برمی‌گرداند. برای دیباگ واقعی، باید بتوانیم ببینیم:
- امتیاز خام و نرمال‌شده‌ی هر ۵ گروه اصلی در مرحله‌ی ۱-الف
- امتیاز هر ۱۱ یا ۷ زیررشته در مرحله‌ی ۱-ب
- `gardnerScore`, `alignmentBonus`, `stage2Score` برای **همه‌ی ۲۸ مسیر دیتابیس** (نه فقط ۷ تای نهایی)
- شکست کامل ۴ محور MBTI برای هر مسیر (target, actual, distance, certainty, contribution)
- شکست کامل ابعاد DISC برای هر مسیر
- `matchScore` نهایی همه‌ی مسیرها قبل از فیلتر آستانه، به‌همراه این‌که آستانه فعال شد یا relax شد
- اندازه‌ی pool مسیرهای جایگزین/مکمل و این‌که fallback فعال شده یا نه

**راه‌حل: یک تابع جدید و مجزا اضافه کنید، بدون دست‌زدن به `runPathEngine` موجود:**

```ts
// در pathEngine.ts

export interface Stage1Trace {
  groupScoresRaw: { group: string; rawScore: number }[];
  groupScoresNormalized: { group: string; score: number }[];
  groupGap: number; // فاصله‌ی امتیاز نرمال‌شده‌ی رتبه ۱ و ۲
  mainGroup: string[];
  subfieldScoresRaw: { subfield: string; rawScore: number }[] | null;
  subfieldScoresNormalized: { subfield: string; score: number }[] | null;
  subfieldGap: number | null;
  topSubfields: string[];
}

export interface Stage2Trace {
  pathId: string;
  title: string;
  gardnerScore: number;
  alignmentBonus: number;
  alignmentReason: 'subfield-match' | 'main-group-match' | 'no-match';
  stage2Score: number;
  excludedFromInitialList: boolean; // true اگر gardnerScore === 0 (طبق سند اصلی باید حذف شود)
}

export interface Stage3Trace {
  pathId: string;
  axisBreakdown: {
    axis: 'EI' | 'SN' | 'TF' | 'JP';
    dominantLetter: string;
    targetDimension: string;
    targetValue: number;
    actualValue: number;
    distance: number;
    certaintyPct: number;
    weightedDistance: number;
    axisContribution: number; // 1 - weightedDistance
  }[];
  mbtiMultiplier: number;
  stage3Score: number;
}

export interface Stage4Trace {
  pathId: string;
  dimBreakdown: {
    discLetter: string;
    targetDimension: string;
    targetValue: number;
    actualValue: number;
    distance: number;
    dimContribution: number;
  }[];
  discMultiplier: number;
  rawFinalScore: number;
}

export interface Stage4bTrace {
  maxRawScore: number;
  allPathScores: { pathId: string; rawFinalScore: number; matchScore: number }[];
  thresholdValue: number; // مثلا 55
  eligibleCountBeforeRelax: number;
  thresholdWasRelaxed: boolean;
}

export interface Stage5Trace {
  mainPathId: string;
  alternativePool: { pathId: string; matchesMainGroup: boolean }[]; // matchesMainGroup باید همیشه true باشد؛ اگر false دیده شد یعنی باگ ۴ هنوز فعال است
  alternativePoolFallbackTriggered: boolean;
  complementaryPool: { pathId: string; matchesMainGroup: boolean }[]; // اینجا باید همیشه false باشد
  complementaryPoolFallbackTriggered: boolean;
}

export interface PathEngineTrace {
  input: {
    hollandProvided: boolean;
    gardnerProvided: boolean;
    mbtiProvided: boolean;
    discProvided: boolean;
  };
  stage1: Stage1Trace;
  stage2: Stage2Trace[]; // طول = تعداد کل مسیرهای دیتابیس (۲۸)، نه ۷
  stage3: Stage3Trace[];
  stage4: Stage4Trace[];
  stage4b: Stage4bTrace;
  stage5: Stage5Trace;
  finalOutput: PathEngineOutput; // همان خروجی runPathEngine فعلی
}

export function runPathEngineWithTrace(
  holland: HollandResult | null,
  gardner: GardnerResult | null,
  mbti: MbtiResult | null,
  disc: DiscResult | null
): PathEngineTrace {
  // پیاده‌سازی: دقیقاً همان منطق runPathEngine، با این تفاوت که در هر مرحله
  // به‌جای دور ریختن آرایه‌های میانی، آن‌ها را در آبجکت trace ذخیره می‌کند.
  // ساده‌ترین روش: کد runPathEngine را کپی کنید و بعد از هر مرحله یک خط
  // trace.stageN = ... اضافه کنید؛ در پایان finalOutput را هم از منطق فعلی بسازید.
  // [مهم] این تابع نباید هیچ رفتار محاسباتی جدیدی داشته باشد — فقط باید
  // همان محاسبات فعلی را "قابل مشاهده" کند. اگر رفتار trace با رفتار
  // runPathEngine فرق کند، خودش یک منبع باگ جدید می‌شود.
}
```

**نکته‌ی طراحی مهم:** `stage2` باید شامل **همه‌ی ۲۸ مسیر دیتابیس** باشد، حتی آن‌هایی که در ۷ مسیر نهایی نیستند. این تنها راهی است که می‌توانید بفهمید *چرا* یک مسیر خاص حذف شد (مثلاً چون `gardnerScore=0` بود، یا چون امتیازش زیر آستانه افتاد).

---

## ۲. لایه‌ی ۱ — ابزار تست دستی (Debug CLI)

### ۲.۱ دو حالت ورودی

**حالت A — «حالت سریع» (اولویت اول، همان چیزی که خواستید):**
شما مستقیماً خروجیِ سطحِ تست (نه پاسخ خام سوالات) را وارد می‌کنید — یعنی همان چیزی که `holland.ts`/`gardner.ts`/`mbti.ts`/`disc.ts` در نهایت تولید می‌کنند. این سریع‌ترین راه برای تست کردن *فقط* منطق `pathEngine.ts` است، بدون نیاز به پاسخ دادن به ده‌ها سوال لیکرت هر بار.

**حالت B — «حالت خام» (اولویت دوم، اختیاری):**
پاسخ خام سوالات هر ۴ آزمون را وارد می‌کنید و کل زنجیره (نمره‌دهی خام طبق `QuizLogics-Final.md` + ترکیب طبق `PathEngineLogic.md`) اجرا می‌شود. این برای تست end-to-end لازم است اما پیاده‌سازی سنگین‌تری دارد و به تکمیل ماژول‌های `holland.ts` و بقیه وابسته است — **در فاز اول این بریف پیاده نشود.**

### ۲.۲ فایل ورودی (به‌جای پرامپت تعاملی)

**تصمیم طراحی:** به‌جای CLI تعاملی (که هر بار باید همه‌ی سوالات را جواب بدهید)، از یک فایل JSON استفاده کنید که آن را با ویرایشگر باز می‌کنید، فیلدها را عوض می‌کنید، ذخیره می‌کنید، و یک دستور را دوباره اجرا می‌کنید. این برای «سریع نمرات وارد کردن و دوباره چک کردن» بسیار سریع‌تر از پاسخ‌دادن به پرامپت‌های متوالی است.

مسیر فایل: `src/pathEngine/debug/test-input.json`

```json
{
  "holland": {
    "normalizedScores": { "R": 40, "I": 85, "A": 25, "S": 20, "E": 30, "C": 65 }
  },
  "gardner": {
    "topIntelligences": ["logical", "spatial", "intrapersonal"]
  },
  "mbti": {
    "type": "INTJ",
    "certaintyScores": {
      "EI": { "dominantLetter": "I", "intensityPct": 70 },
      "SN": { "dominantLetter": "N", "intensityPct": 60 },
      "TF": { "dominantLetter": "T", "intensityPct": 80 },
      "JP": { "dominantLetter": "J", "intensityPct": 55 }
    }
  },
  "disc": {
    "profile": "C"
  }
}
```

**قوانین این فایل:**
- هرکدام از ۴ کلید سطح‌بالا (`holland`, `gardner`, `mbti`, `disc`) را می‌توانید کامل حذف کنید (یا `null` بگذارید) تا سناریوی «داده‌ی ناقص» تست شود.
- `holland.normalizedScores` باید ۶ عدد بین ۰ تا ۱۰۰ باشد — لازم نیست جمعشان ۱۰۰ شود چون نرمال‌سازی داخل `pathEngine.ts` نسبی است.
- `gardner.topIntelligences` دقیقاً باید از کلیدهای موجود در `gardnerWeights` مسیرها استفاده کند: `logical, spatial, linguistic, interpersonal, intrapersonal, bodily, musical, naturalistic` — **[هشدار]** این‌جا دقیقاً همان ریسکی است که در بازبینی کد اشاره شد: اگر این کلید با خروجی واقعی `gardner.ts` هم‌نام نباشد، `pathEngine.ts` بی‌صدا امتیاز صفر می‌دهد. ابزار دیباگ باید این عدم‌تطابق را چک و هشدار بدهد (بند ۲.۴).
- `disc.profile` رشته‌ی یک یا دو حرفی از `{D,I,S,C}` (مثلاً `"C"` یا `"ID"`).

### ۲.۳ اسکریپت اجرا

مسیر: `src/pathEngine/debug/cli.ts`

```ts
import * as fs from 'fs';
import * as path from 'path';
import { runPathEngineWithTrace } from '../pathEngine';
import { GARDNER_VALID_KEYS } from './validateInput'; // بند ۲.۴

const inputPath = path.join(__dirname, 'test-input.json');
const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

const holland = raw.holland ? { normalizedScores: raw.holland.normalizedScores, scores: raw.holland.normalizedScores, code: '', primaryDimension: 'R' } : null;
const gardner = raw.gardner ?? null;
const mbti = raw.mbti ?? null;
const disc = raw.disc ?? null;

const trace = runPathEngineWithTrace(holland, gardner, mbti, disc);

printStage1(trace.stage1);
printStage2(trace.stage2);
printStage3(trace.stage3);
printStage4(trace.stage4);
printStage4b(trace.stage4b);
printStage5(trace.stage5);
printFinalOutput(trace.finalOutput);
```

دستور اجرا در `package.json`:
```json
"scripts": {
  "debug:path-engine": "ts-node src/pathEngine/debug/cli.ts"
}
```
هر بار که `test-input.json` را عوض کردید: `npm run debug:path-engine`.

### ۲.۴ اعتبارسنجی ورودی (خیلی مهم — یکی از باگ‌های شناسایی‌شده را پیش‌گیری می‌کند)

قبل از اجرای موتور، فایل ورودی باید اعتبارسنجی شود، به‌خصوص کلیدهای `gardner.topIntelligences`:

```ts
// src/pathEngine/debug/validateInput.ts
export const GARDNER_VALID_KEYS = [
  'logical', 'spatial', 'linguistic', 'interpersonal',
  'intrapersonal', 'bodily', 'musical', 'naturalistic',
];

export function validateGardnerInput(topIntelligences: string[]): string[] {
  const warnings: string[] = [];
  topIntelligences.forEach((key) => {
    if (!GARDNER_VALID_KEYS.includes(key)) {
      warnings.push(
        `⚠️  کلید هوش "${key}" با هیچ‌کدام از کلیدهای معتبر (${GARDNER_VALID_KEYS.join(', ')}) مطابقت ندارد. ` +
        `این هوش در محاسبه‌ی gardnerScore هیچ مسیری اثر نخواهد گذاشت.`
      );
    }
  });
  return warnings;
}
```
این تابع باید در ابتدای `cli.ts` صدا زده شود و هشدارها قبل از جدول‌ها چاپ شوند.

### ۲.۵ فرمت خروجی کنسول (دقیقاً این ستون‌ها)

از `console.table()` برای هر مرحله استفاده کنید — خروجی جدولی خیلی سریع‌تر از JSON خام خوانده می‌شود.

**مرحله ۱-الف:**
```
console.log('=== مرحله ۱-الف: گروه‌های اصلی ===');
console.table(trace.stage1.groupScoresNormalized);
console.log('گروه پایه انتخاب‌شده:', trace.stage1.mainGroup, ' | فاصله رتبه۱-۲:', trace.stage1.groupGap);
```

**مرحله ۱-ب (اگر فنی‌وحرفه‌ای بود):**
```
console.log('=== مرحله ۱-ب: زیررشته‌ها ===');
console.table(trace.stage1.subfieldScoresNormalized);
console.log('زیررشته‌ی نهایی:', trace.stage1.topSubfields, ' | فاصله:', trace.stage1.subfieldGap);
```

**مرحله ۲ (همه‌ی ۲۸ مسیر، مرتب‌شده نزولی بر اساس stage2Score):**
```
console.log('=== مرحله ۲: امتیاز گاردنر + پاداش هم‌راستایی ===');
console.table(
  trace.stage2
    .sort((a, b) => b.stage2Score - a.stage2Score)
    .map((s) => ({
      مسیر: s.title,
      gardnerScore: s.gardnerScore,
      alignmentBonus: s.alignmentBonus,
      دلیل: s.alignmentReason,
      stage2Score: s.stage2Score.toFixed(1),
      'باید حذف شود؟': s.excludedFromInitialList ? 'بله ⚠️' : 'خیر',
    }))
);
```
ستون آخر خیلی مهم است: هر ردیفی که «بله ⚠️» نشان می‌دهد ولی در `finalOutput.allRecommendedPaths` هم حضور دارد، یعنی باگ شماره ۱ (فیلتر گاردنر اجرا نمی‌شود) هنوز رفع نشده — این دقیقاً تستی است که در بند ۳.۴ به‌صورت خودکار هم چک می‌شود.

**مرحله ۳ (فقط برای ۷ مسیر نهایی، برای اینکه جدول شلوغ نشود — اما تابع باید بتواند pathId دلخواه هم بگیرد):**
```
console.log('=== مرحله ۳: شکست MBTI برای مسیر اصلی ===');
console.table(trace.stage3.find((s) => s.pathId === trace.finalOutput.mainPath.pathId).axisBreakdown);
```

**مرحله ۴.ب (خیلی مهم برای دیدن اثر clamp):**
```
console.log('=== آستانه‌ی نهایی ===');
console.log('حداکثر امتیاز خام:', trace.stage4b.maxRawScore);
console.log('آستانه:', trace.stage4b.thresholdValue, ' | Relax شد؟', trace.stage4b.thresholdWasRelaxed);
console.table(trace.stage4b.allPathScores.sort((a, b) => b.matchScore - a.matchScore));
```
اگر ستون `matchScore` هیچ‌وقت زیر ۵۰ نرفت (حتی برای مسیرهایی که `rawFinalScore`شان نزدیک صفر است)، یعنی باگ clamp (شماره‌ی ۲/۳ در بازبینی کد) هنوز فعال است.

**مرحله ۵:**
```
console.log('=== مرحله ۵: انتخاب نهایی ۷ مسیر ===');
console.log('مسیر اصلی:', trace.finalOutput.mainPath.title);
console.table(trace.stage5.alternativePool.map(p => ({...p, نوع: 'جایگزین'})));
console.table(trace.stage5.complementaryPool.map(p => ({...p, نوع: 'مکمل'})));
```
هر ردیف در جدول «جایگزین» که `matchesMainGroup: false` نشان بدهد، یعنی باگ شماره‌ی ۴ (fallback نامناسب) رخ داده است.

---

## ۳. لایه‌ی ۲ — یونیت‌تست خودکار (Jest)

### ۳.۱ چرا این لایه علاوه‌بر ابزار دستی لازم است

ابزار دستی برای **کاوش اکتشافی** است (شما چیزی وارد می‌کنید و نگاه می‌کنید). یونیت‌تست برای **قفل‌کردن رفتار درست** است — وقتی بعداً باگ‌های شناسایی‌شده را اصلاح کردید، این تست‌ها تضمین می‌کنند که اصلاح یک بخش، بخش دیگر را خراب نکرده.

### ۳.۲ ساختار فایل‌ها
```
src/pathEngine/
  __tests__/
    fixtures.ts           <- سازنده‌های آماده برای HollandResult/GardnerResult/MbtiResult/DiscResult
    stage1.test.ts
    stage2.test.ts
    stage3.test.ts
    stage4.test.ts
    stage5.test.ts
    contentCoverage.test.ts   <- تست‌های سطح دیتابیس (نه الگوریتم)
```

### ۳.۳ فیکسچرها (`fixtures.ts`)
```ts
export function buildHolland(overrides?: Partial<Record<'R'|'I'|'A'|'S'|'E'|'C', number>>): HollandResult {
  const base = { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50, ...overrides };
  return { scores: base, normalizedScores: base, code: '', primaryDimension: 'R' as any };
}

export function buildGardner(topIntelligences: string[]): GardnerResult {
  return { topIntelligences } as GardnerResult;
}

export function buildMbti(type: string, certaintyPctPerAxis: [number, number, number, number] = [50, 50, 50, 50]): MbtiResult {
  const axes = ['EI', 'SN', 'TF', 'JP'];
  const certaintyScores: any = {};
  axes.forEach((axis, i) => {
    certaintyScores[axis] = { dominantLetter: type[i], intensityPct: certaintyPctPerAxis[i] };
  });
  return { type, certaintyScores } as MbtiResult;
}

export function buildDisc(profile: string): DiscResult {
  return { profile } as DiscResult;
}
```

### ۳.۴ چک‌لیست کامل سناریوهای الزامی

این جدول را مستقیماً به `describe`/`it` بلاک‌های Jest تبدیل کنید. ستون آخر مشخص می‌کند کدام تست به‌طور مستقیم یکی از ۷ باگ شناسایی‌شده در بازبینی کد را پوشش می‌دهد — **آن تست‌ها را با `test.failing(...)` علامت بزنید تا وقتی باگ رفع نشده، Jest سبز بماند اما مستند باشد که چه چیزی هنوز خراب است.**

| # | مرحله | سناریو | انتظار | مرتبط با باگ؟ |
|---|---|---|---|---|
| ۱ | Stage 0 | هر ۴ آزمون داده شده | `completedTestsCount === 4`, `completenessWarning === null` | — |
| ۲ | Stage 0 | فقط هالند داده شده | `completedTestsCount === 1`, `completenessWarning` شامل رشته‌ی صحیح | — |
| ۳ | Stage 0 | `holland === null` | باید بدون کرش، از مقدار پیش‌فرض `{R:50,...}` استفاده کند و `baseCluster` تولید شود | — |
| ۴ | Stage 1-A | ورودی دقیقاً برابر بردار «ریاضی‌فیزیک» جدول | `mainGroup === ['ریاضی‌فیزیک']`, بدون حالت ترکیبی | — |
| ۵ | Stage 1-A | ورودی طوری ساخته شده که فاصله‌ی رتبه۱-۲ **دقیقاً ۱۰** شود | `mainGroup.length === 2` (باید ترکیبی باشد — مرز شامل) | — |
| ۶ | Stage 1-A | فاصله‌ی رتبه۱-۲ **دقیقاً ۱۱** | `mainGroup.length === 1` (نباید ترکیبی باشد) | — |
| ۷ | Stage 1-B | `mainGroup = ['فنی‌وحرفه‌ای — گروه صنعت']` | `subfieldScores.length === 11`, `topSubfields.length >= 1` | — |
| ۸ | Stage 1-B | `mainGroup` شامل هر دو گروه فنی (سناریوی نادر ترکیبی) | استخر زیررشته باید ۱۸ آیتم داشته باشد | — |
| ۹ | Stage 1-B | فاصله‌ی زیررشته‌ی رتبه۱-۲ دقیقاً ۸ در برابر دقیقاً ۹ | مثل تست ۵/۶ اما با آستانه‌ی ۸ | — |
| ۱۰ | Stage 1-B | `mainGroup = ['ریاضی‌فیزیک']` | `topSubfields.length === 0` (نظری زیررشته ندارد) | — |
| ۱۱ | Stage 2 | مسیری بسازید (یا از دیتابیس واقعی انتخاب کنید) که `gardnerWeights` آن هیچ همپوشانی با ۳ هوش انتخابی ندارد | **انتظار سند:** آن مسیر نباید در `finalOutput.allRecommendedPaths` ظاهر شود | 🔴 باگ ۱ |
| ۱۲ | Stage 2 | مسیری که `compatibleTracks` آن شامل یکی از `topSubfields` است | `alignmentBonus === 1.5` | — |
| ۱۳ | Stage 2 | مسیری که فقط `mainGroup` را دارد نه زیررشته | `alignmentBonus === 1.3` | — |
| ۱۴ | Stage 2 | مسیری که هیچ‌کدام را ندارد | `alignmentBonus === 1.0` | — |
| ۱۵ | Stage 3 | `mbti = null` | `mbtiMultiplier === 1` برای همه‌ی مسیرها | — |
| ۱۶ | Stage 3 | یک مسیر با `behavioralVector` و MBTI مشخص، محاسبه‌ی دستی از قبل انجام‌شده | `mbtiMultiplier` تولیدشده دقیقاً با محاسبه‌ی دستی برابر باشد (اسنپ‌شات عددی) | — |
| ۱۷ | Stage 3 | `certaintyPct = 0` روی یک محور | آن محور باید `axisContribution === 1` بدهد (بی‌اثر شدن کامل عدم‌قطعیت) | — |
| ۱۸ | Stage 4 | `disc = null` | `discMultiplier === 1` برای همه‌ی مسیرها | — |
| ۱۹ | Stage 4 | `disc.profile = "ID"` (دو‌حرفی) | `discMultiplier` باید میانگین دو بعد باشد (اسنپ‌شات عددی) | — |
| ۲۰ | Stage 4.4 | مسیری با بدترین ترکیب ممکن (gardnerScore کم، mbtiMultiplier کم، discMultiplier کم) | `matchScore` آن مسیر باید بتواند **کمتر از ۵۵** شود و از eligible حذف شود | 🔴 باگ ۲ و ۳ |
| ۲۱ | Stage 4.4 | همان سناریوی بالا | `matchScore` نباید همیشه در بازه‌ی [۵۰,۹۹] گیر کند؛ باید بازه‌ی واقعی [۰,۱۰۰] ممکن باشد | 🔴 باگ ۲ و ۳ |
| ۲۲ | Stage 5 | خروجی نهایی هر اجرا | `allRecommendedPaths.length === 7` | — |
| ۲۳ | Stage 5 | خروجی نهایی هر اجرا | هیچ `pathId` تکراری بین main/alternative/complementary نباشد | — |
| ۲۴ | Stage 5 | همه‌ی موارد `alternativePaths` | هرکدام باید `compatibleTracks` هم‌پوشان با `mainGroup` کاربر داشته باشند، **حتی وقتی fallback فعال شده** | 🔴 باگ ۴ |
| ۲۵ | Stage 5 | `baseCluster.mainGroup.length === 2` (سناریوی ترکیبی) | مسیرهای سازگار با گروه دوم هم باید بتوانند وارد `alternativePaths` شوند، نه فقط گروه اول | 🔴 باگ ۵ |
| ۲۶ | Content Coverage | حلقه روی همه‌ی کلیدهای `TVET_INDUSTRY_SUBFIELDS` و `TVET_ARTS_SUBFIELDS` | هر زیررشته باید حداقل در یک `path.compatibleTracks` ظاهر شده باشد | 🟢 خلأ محتوایی ۶ |
| ۲۷ | Content Coverage | حلقه روی همه‌ی `PATH_DATABASE` | هر مسیر باید حداقل یک `gardnerWeights` معتبر (کلید موجود در ۸ هوش اصلی) داشته باشد | — |

### ۳.۵ نمونه‌ی یک بلوک تست (برای الگو گرفتن)

```ts
// stage2.test.ts
import { runPathEngineWithTrace } from '../pathEngine';
import { buildHolland, buildGardner } from './fixtures';

describe('Stage 2 — Gardner filtering', () => {
  test.failing('excludes paths with zero gardner overlap from final output', () => {
    // انتخاب سه هوشی که مطمئناً با هیچ مسیر "علوم پزشکی/زیستی" هم‌پوشانی ندارند
    const gardner = buildGardner(['musical']); // فقط یک هوش، بدون تداخل با اکثر مسیرها
    const holland = buildHolland({ R: 90, I: 30, A: 10, S: 10, E: 20, C: 40 }); // فنی صنعت

    const trace = runPathEngineWithTrace(holland, gardner, null, null);

    const zeroScorePaths = trace.stage2.filter((s) => s.gardnerScore === 0);
    const finalIds = trace.finalOutput.allRecommendedPaths.map((p) => p.pathId);

    zeroScorePaths.forEach((p) => {
      expect(finalIds).not.toContain(p.pathId);
    });
  });
});
```

---

## ۴. ترتیب اجرای پیشنهادی

1. **اول بند ۱** (افزودن `runPathEngineWithTrace`) — چون هم ابزار دستی و هم یونیت‌تست‌ها به آن وابسته‌اند.
2. **بعد لایه‌ی ۱** (Debug CLI با `test-input.json`) — چون سریع‌ترین راه برای این‌که خودتان چشمی رفتار الگوریتم را ببینید و باگ‌های ۱ تا ۵ را با چشم خودتان در جدول‌ها تأیید کنید.
3. **بعد لایه‌ی ۲** (Jest) — با تست‌های `test.failing` برای باگ‌های شناخته‌شده، تا وقتی شروع به اصلاح کد کردید، بدانید دقیقاً کِی هرکدام رفع شده (وقتی `test.failing` خودش fail بدهد یعنی باید به `test` معمولی تبدیلش کنید).
4. **نصب پکیج‌ها:** `npm install --save-dev jest ts-jest @types/jest ts-node`

---

## ۵. خلاصه‌ی ارتباط این سند با ۲ سند قبلی

| سند | نقش |
|---|---|
| `QuizLogics-Final.md` | چطور هر آزمون به‌تنهایی نمره‌گذاری می‌شود |
| `PathEngineLogic.md` | چطور ۴ نمره با هم ترکیب می‌شوند تا مسیر نهایی دربیاید (منطق مرجع، مستقل از زبان برنامه‌نویسی) |
| **این سند** | چطور همان منطق را در `pathEngine.ts` (پیاده‌سازی واقعی TypeScript) دستی و خودکار تست کنید، و مشخصاً کدام رفتار پیاده‌سازی‌شده با سند مرجع مطابقت ندارد (۷ باگ بند ۳.۴) |