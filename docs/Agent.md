# CLAUDE.md — بریف کامل توسعه محصول «رکاد | نقشه راه آینده»

این فایل، مرجع کامل پروژه برای Claude Code (و هر دولوپر دیگری) است. هر جلسه‌ی کاری روی این ریپو باید این فایل رو به‌عنوان context اصلی در نظر بگیره.

---

## ۱. معرفی پروژه

**رکاد** یک محصول مشاوره‌ی تحصیلی-شغلی هوشمند است که مسیر دانش‌آموز رو در ۳ مرحله طراحی می‌کند:

1. **کشف مسیر (پلن ۱)** — اجرای ۴ آزمون روان‌سنجی (هالند، گاردنر، MBTI، DISC) + استخراج **Path DNA** + جلسه مشاوره‌ی فردی.
2. **طراحی آینده (پلن ۲)** — تحلیل بازار کار + جلسه با حضور والدین + تعیین مسیر اصلی/جایگزین/مکمل + تدوین نسخه‌ی رسمی نقشه راه.
3. **همراه رشد (پلن ۳)** — برنامه‌ی اقدام ۹۰ روزه + چک‌لیست پیشرفت + کوچینگ اجرایی.

محصول نرم‌افزاری MVP باید حداقل «پلن ۱» (موتور ۴ آزمون + Path DNA + گزارش) رو کامل پیاده کنه؛ پلن‌های ۲ و ۳ عمدتاً لایه‌ی محتوا/جلسه/کوچینگ هستن که در فازهای بعدی به سیستم اضافه می‌شن.

---

## ۲. Tech Stack

| لایه | تکنولوژی |
|---|---|
| Frontend / Framework | **Next.js 15 (App Router)** + TypeScript |
| استایل | Tailwind CSS + shadcn/ui |
| بک‌اند / دیتابیس | **Supabase** (Postgres + Auth + Row Level Security + Storage) |
| ORM/Query | Supabase JS client (`@supabase/supabase-js`) + `@supabase/ssr` برای Next.js |
| فرم‌ها | React Hook Form + Zod (validation) |
| نمودار خروجی آزمون‌ها | Recharts (radar chart گاردنر، bar chart هالند و DISC) |
| ایمیل/نوتیفیکیشن (فاز بعد) | Resend یا Supabase Edge Functions |
| پرداخت (فاز بعد) | زرین‌پال / آیدی‌پی (درگاه ایرانی) |
| هاست | Vercel (فرانت) + Supabase Cloud (بک‌اند) |

---

## ۳. معماری کلی

- **Next.js App Router** با ترکیب Server Components (برای صفحات محتوایی و گزارش‌ها) و Client Components (برای فرم‌های تعاملی آزمون).
- **Supabase Auth** برای احراز هویت (ایمیل/رمز عبور + OTP موبایل در فاز بعد).
- **Row Level Security (RLS)** روی همه‌ی جداول فعال است؛ هر کاربر فقط به داده‌ی خودش/فرزندش دسترسی دارد.
- **Server Actions** برای mutation ها (ثبت پاسخ آزمون، محاسبه‌ی نتیجه) به‌جای API route های جداگانه، مگر جایی که webhook یا اتصال بیرونی لازم باشد.
- منطق محاسبه‌ی امتیاز آزمون‌ها در یک لایه‌ی مجزا (`lib/scoring/`) به‌صورت توابع خالص (pure functions) پیاده می‌شود تا قابل تست باشد.

---

## ۴. ساختار پوشه‌ها

```
rekad/
├── app/
│   ├── (marketing)/                 # صفحات عمومی: لندینگ، پلن‌ها، تماس
│   │   ├── page.tsx
│   │   ├── plans/page.tsx
│   │   └── free-test/page.tsx       # تست رایگان اولیه (لید مگنت)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx               # لایوت داشبورد (دانش‌آموز/والد)
│   │   ├── dashboard/page.tsx
│   │   ├── tests/
│   │   │   ├── page.tsx             # لیست ۴ آزمون + وضعیت تکمیل
│   │   │   └── [testCode]/page.tsx  # صفحه‌ی اجرای هر آزمون
│   │   ├── results/
│   │   │   ├── page.tsx             # گزارش ترکیبی Path DNA
│   │   │   └── [testCode]/page.tsx  # گزارش تفکیکی هر آزمون
│   │   ├── roadmap/page.tsx         # نقشه راه (پلن ۲)
│   │   └── growth-plan/page.tsx     # برنامه ۹۰ روزه (پلن ۳)
│   ├── (admin)/
│   │   ├── admin/students/page.tsx
│   │   ├── admin/questions/page.tsx # مدیریت بانک سوالات
│   │   └── admin/reports/page.tsx
│   └── api/
│       └── webhooks/payment/route.ts
├── components/
│   ├── ui/                          # shadcn components
│   ├── tests/
│   │   ├── LikertQuestion.tsx
│   │   ├── BipolarSlider.tsx        # برای MBTI
│   │   ├── IpsativeBlock.tsx        # برای DISC (Most/Least)
│   │   └── TestProgressBar.tsx
│   └── results/
│       ├── HollandRadar.tsx
│       ├── GardnerChart.tsx
│       ├── MbtiTypeCard.tsx
│       └── DiscProfileCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # browser client
│   │   ├── server.ts                # server client (RSC/Server Actions)
│   │   └── middleware.ts
│   ├── scoring/
│   │   ├── holland.ts
│   │   ├── gardner.ts
│   │   ├── mbti.ts
│   │   ├── disc.ts
│   │   └── pathDna.ts               # ترکیب خروجی هر ۴ تست
│   └── validations/
│       └── testSchemas.ts           # Zod schemas
├── supabase/
│   ├── migrations/
│   └── seed.sql                     # بانک سوالات اولیه
├── types/
│   └── database.types.ts            # auto-generated از Supabase CLI
├── middleware.ts                    # session refresh + route protection
├── .env.local
└── CLAUDE.md
```

---

## ۵. اسکیمای دیتابیس Supabase (SQL)

```sql
-- ==========================================
-- پروفایل‌ها و نقش‌ها
-- ==========================================
create type user_role as enum ('student', 'parent', 'coach', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'student',
  phone text,
  grade text,                         -- پایه تحصیلی
  parent_id uuid references profiles(id),  -- برای اتصال دانش‌آموز به والد
  created_at timestamptz default now()
);

-- ==========================================
-- پلن‌ها و اشتراک‌ها
-- ==========================================
create type plan_code as enum ('discover', 'design', 'growth');  -- پلن ۱، ۲، ۳

create table plans (
  id serial primary key,
  code plan_code unique not null,
  title text not null,
  price bigint not null,              -- تومان
  features jsonb not null             -- لیست فیچرها برای نمایش در جدول مقایسه
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  plan_id int references plans(id) not null,
  status text not null default 'active',  -- active / expired / pending_payment
  purchased_at timestamptz default now(),
  expires_at timestamptz
);

-- ==========================================
-- آزمون‌ها و بانک سوالات
-- ==========================================
create type test_code as enum ('HOLLAND', 'GARDNER', 'MBTI', 'DISC');
create type question_format as enum ('likert5', 'bipolar', 'ipsative_block');

create table tests (
  id serial primary key,
  code test_code unique not null,
  name text not null,
  version int default 1,
  is_active boolean default true
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  test_id int references tests(id) not null,
  dimension text not null,            -- مثلا 'R' یا 'E/I' یا 'D'
  text text not null,
  text_secondary text,                -- برای سوالات bipolar (سمت دوم جمله)
  format question_format not null,
  block_group uuid,                   -- برای گروه‌بندی سوالات ipsative (۴ گزینه‌ی هم‌بلوک)
  order_index int not null,
  is_active boolean default true
);

create table question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) not null,
  label text not null,
  dimension_weight text not null,     -- کدوم بعد (D/I/S/C) این گزینه امتیاز می‌گیره
  order_index int not null
);

-- ==========================================
-- پاسخ‌ها و نتایج
-- ==========================================
create table user_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  question_id uuid references questions(id) not null,
  raw_value int,                      -- برای likert5 / bipolar (۱ تا ۵)
  most_option_id uuid references question_options(id),   -- برای DISC
  least_option_id uuid references question_options(id),  -- برای DISC
  created_at timestamptz default now(),
  unique(user_id, question_id)
);

create table user_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  test_id int references tests(id) not null,
  dimension_scores jsonb not null,    -- { "R": 78, "I": 65, ... }
  final_output jsonb not null,        -- خروجی نهایی: کد هالند / تیپ MBTI / پروفایل DISC / هوش‌های برتر گاردنر
  completed_at timestamptz default now(),
  unique(user_id, test_id)
);

create table path_dna (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) unique not null,
  holland_code text,
  top_intelligences jsonb,
  mbti_type text,
  disc_profile text,
  career_clusters jsonb,              -- خوشه‌های شغلی نهایی (نگاشت‌شده توسط تیم محتوا)
  computed_at timestamptz default now()
);

-- ==========================================
-- نقشه راه و برنامه ۹۰ روزه (پلن ۲ و ۳)
-- ==========================================
create table roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  main_path text,
  alternative_path text,
  complementary_path text,
  market_analysis_notes text,
  approved_by_coach_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table action_plan_90 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  week_number int not null,
  task text not null,
  is_completed boolean default false,
  due_date date
);

-- ==========================================
-- RLS (نمونه — باید برای همه‌ی جداول تکرار شود)
-- ==========================================
alter table profiles enable row level security;
alter table user_responses enable row level security;
alter table user_test_results enable row level security;
alter table path_dna enable row level security;

create policy "کاربر فقط پروفایل خودش را می‌بیند"
  on profiles for select
  using (auth.uid() = id or auth.uid() = parent_id);

create policy "کاربر فقط پاسخ‌های خودش را ثبت/می‌بیند"
  on user_responses for all
  using (auth.uid() = user_id);

create policy "کاربر فقط نتایج خودش را می‌بیند"
  on user_test_results for select
  using (auth.uid() = user_id);

create policy "والد نتایج فرزند را می‌بیند"
  on user_test_results for select
  using (
    auth.uid() in (select parent_id from profiles where id = user_test_results.user_id)
  );

create policy "coach/admin دسترسی کامل"
  on user_test_results for select
  using (
    exists (select 1 from profiles where id = auth.uid() and role in ('coach', 'admin'))
  );
```

> ⚠️ این اسکیما نقطه‌ی شروع است. قبل از migration نهایی روی production، باید توسط تیم بک‌اند بازبینی و ایندکس‌گذاری (indexes روی `user_id`, `test_id`) اضافه شود.

---

## ۶. موتور آزمون‌ها (خلاصه‌ی منطق — جزئیات کامل در سند «بریف-فنی-منطق-آزمون-ها.md»)

فایل `lib/scoring/*.ts` باید توابع خالص زیر رو پیاده کنه:

```ts
// lib/scoring/holland.ts
export function scoreHolland(responses: {dimension: string; value: number}[]) {
  const totals: Record<string, number> = {};
  for (const r of responses) totals[r.dimension] = (totals[r.dimension] ?? 0) + r.value;
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return { scores: totals, code: sorted.slice(0, 3).map(([k]) => k).join('') };
}

// lib/scoring/gardner.ts
export function scoreGardner(responses: {dimension: string; value: number}[]) {
  const groups: Record<string, number[]> = {};
  for (const r of responses) (groups[r.dimension] ??= []).push(r.value);
  const avg = Object.fromEntries(
    Object.entries(groups).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length])
  );
  const topIntelligences = Object.entries(avg).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  return { scores: avg, topIntelligences };
}

// lib/scoring/mbti.ts
export function scoreMbti(responses: {axis: 'EI'|'SN'|'TF'|'JP'; value: number}[]) {
  const axisTotals: Record<string, {raw: number; count: number}> = {};
  for (const r of responses) {
    axisTotals[r.axis] ??= { raw: 0, count: 0 };
    axisTotals[r.axis].raw += r.value;
    axisTotals[r.axis].count += 1;
  }
  const letters: Record<string, [string, string]> = {
    EI: ['E', 'I'], SN: ['S', 'N'], TF: ['T', 'F'], JP: ['J', 'P'],
  };
  let type = '';
  const certainty: Record<string, number> = {};
  for (const [axis, [first, second]] of Object.entries(letters)) {
    const { raw, count } = axisTotals[axis];
    const mid = count * 3; // نقطه میانی مقیاس ۱-۵
    const dominant = raw < mid ? first : second;
    type += dominant;
    certainty[axis] = Math.abs(raw - mid) / (count * 2) * 100;
  }
  return { type, certainty };
}

// lib/scoring/disc.ts
export function scoreDisc(blocks: {most: string; least: string}[]) {
  const scores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
  for (const b of blocks) {
    scores[b.most] += 1;
    scores[b.least] -= 1;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const profile = sorted[1][1] > 0 && sorted[0][1] - sorted[1][1] <= 2
    ? sorted[0][0] + sorted[1][0]   // پروفایل ترکیبی مثل "DI"
    : sorted[0][0];
  return { scores, profile };
}

// lib/scoring/pathDna.ts
export function computePathDna(holland: ReturnType<typeof scoreHolland>,
                                gardner: ReturnType<typeof scoreGardner>,
                                mbti: ReturnType<typeof scoreMbti>,
                                disc: ReturnType<typeof scoreDisc>) {
  return {
    holland_code: holland.code,
    top_intelligences: gardner.topIntelligences,
    mbti_type: mbti.type,
    disc_profile: disc.profile,
    // career_clusters: باید از جدول lookup که تیم محتوا می‌سازد پر شود
  };
}
```

هر تست فقط زمانی کامل محسوب می‌شود که همه‌ی سوالات فعالِ آن `test_id` پاسخ داشته باشند. Server Action مربوطه (`app/(dashboard)/tests/[testCode]/actions.ts`) باید بعد از هر ثبت پاسخ، بررسی کند آیا آزمون کامل شده؛ اگر بله → صدا زدن تابع scoring مربوطه → ذخیره در `user_test_results` → اگر هر ۴ تست کامل شد → صدا زدن `computePathDna` → ذخیره در `path_dna`.

---

## ۷. جریان کاربر (User Flow)

```
۱. ثبت‌نام/ورود (دانش‌آموز یا والد)
۲. انتخاب پلن (یا شروع با تست رایگان اولیه - لید مگنت)
۳. داشبورد → لیست ۴ آزمون با progress bar
۴. اجرای هر آزمون (سوالات به ترتیب order_index، ذخیره پاسخ به‌صورت آنی)
۵. بعد از تکمیل هر آزمون → محاسبه خودکار → نمایش گزارش تکی
۶. بعد از تکمیل هر ۴ آزمون → صفحه Path DNA (گزارش ترکیبی + نمودار رادار)
۷. [پلن ۲] رزرو جلسه با حضور والد → کوچ گزارش بازار کار و مسیر اصلی/جایگزین/مکمل را وارد می‌کند → صفحه roadmap
۸. [پلن ۳] فعال‌سازی برنامه ۹۰ روزه → چک‌لیست هفتگی در داشبورد
```

---

## ۸. پلن‌ها و منطق دسترسی (Feature Gating)

| فیچر | پلن ۱ (کشف مسیر) | پلن ۲ (طراحی آینده) | پلن ۳ (همراه رشد) |
|---|---|---|---|
| ۴ آزمون + گزارش Path DNA | ✅ | ✅ | ✅ |
| جلسه مشاوره فردی | ✅ | ✅ | ✅ |
| جلسه تصمیم‌سازی با والدین | ❌ | ✅ | ✅ |
| تحلیل بازار کار / roadmap | ❌ | ✅ | ✅ |
| برنامه اقدام ۹۰ روزه | ❌ | ❌ | ✅ |
| کوچینگ اجرایی مستمر | ❌ | ❌ | ✅ |
| قیمت (تومان) | ۴۹۰,۰۰۰ | ۹۹۰,۰۰۰ | ۱,۸۹۰,۰۰۰ |

پیاده‌سازی گیت‌کیپینگ: middleware یا یک هوک `useEntitlement(featureKey)` که `subscriptions.plan_id` کاربر جاری رو با جدول `plans.features` مقایسه می‌کند و دسترسی به روت/کامپوننت رو کنترل می‌کند.

---

## ۹. متغیرهای محیطی

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # فقط سمت سرور، هرگز در کلاینت
NEXT_PUBLIC_SITE_URL=
PAYMENT_GATEWAY_MERCHANT_ID=      # فاز پرداخت
```

---

## ۱۰. قواعد کدنویسی

- TypeScript strict mode فعال.
- هر تابع scoring باید pure function و دارای تست واحد (Vitest) باشد — این توابع تعیین‌کننده‌ی خروجی مالی/تصمیم‌گیری مسیر شغلی کاربر هستند، باگ در این لایه غیرقابل قبول است.
- داده‌های حساس (نتایج آزمون، اطلاعات خانواده) هرگز در client component لاگ نشود.
- کامیت‌ها به فارسی یا انگلیسی، اما conventional commits (`feat:`, `fix:`, `refactor:`).
- بانک سوالات (`supabase/seed.sql`) نسخه‌دار است — هر تغییر در سوالات یک تست، یعنی افزایش `tests.version` و migration جدید، نه ویرایش مستقیم رکورد قدیمی (برای حفظ قابلیت مقایسه‌ی نتایج کاربران قدیمی و جدید).

---

## ۱۱. فازبندی توسعه (Roadmap فنی)

**فاز ۱ — MVP (پلن ۱)**
- [ ] Auth + پروفایل دانش‌آموز/والد
- [ ] بانک سوالات ۴ آزمون در Supabase (seed)
- [ ] UI اجرای آزمون (۴ فرمت: likert5, bipolar, ipsative)
- [ ] موتور scoring + ذخیره نتایج
- [ ] صفحه‌ی گزارش Path DNA با نمودار

**فاز ۲ — پلن ۲ و ۳**
- [ ] پنل ادمین/کوچ برای ورود دستی roadmap و یادداشت‌های جلسه
- [ ] برنامه ۹۰ روزه + چک‌لیست تعاملی
- [ ] سیستم رزرو جلسه (Calendly یا داخلی)

**فاز ۳ — تجاری‌سازی**
- [ ] اتصال درگاه پرداخت + سیستم اشتراک
- [ ] تست رایگان اولیه (لید مگنت) + خروجی فایل PDF «۷ اشتباه رایج والدین»
- [ ] پنل گزارش‌گیری ادمین (آمار کلی دانش‌آموزان، نرخ تبدیل پلن‌ها)

---

## ۱۲. ملاحظات امنیتی و حقوقی

- RLS روی **همه‌ی جداول حاوی داده‌ی شخصی** الزامی است، بدون استثنا.
- MBTI و DISC اسم‌های تجاری ثبت‌شده هستند — در UI/متن محصول از عناوین «تحلیل سبک شخصیتی رکاد» به‌جای «تست رسمی MBTI» استفاده شود (جزئیات در سند بریف منطق آزمون‌ها).
- داده‌ی دانش‌آموزان زیر ۱۸ سال است → رضایت والد برای پردازش داده باید در فرآیند ثبت‌نام گرفته شود (چک‌باکس رضایت + ثبت در دیتابیس با timestamp).