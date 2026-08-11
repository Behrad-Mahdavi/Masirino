# 🗺️ رُکاد | نقشه راه آینده دانش‌آموزان (Rokad MVP)

پلتفرم هوشمند مشاوره‌ی تحصیلی-شغلی **رُکاد** جهت کشف استعدادیابی واقعی دانش‌آموزان از طریق ترکیب علمی ۴ آزمون روان‌سنجی (هالند، گاردنر، MBTI و DISC) و استخراج سند **Path DNA**.

---

## 🌟 ویژگی‌های کلیدی محصول

- **موتور روان‌سنجی ۴ گانه**:
  - **رغبت‌سنجی هالند (RIASEC)**: سنجش ۶ بعد علایق شغلی و استخراج کد سه‌حرفی با قانون تساوی سه‌مرحله‌ای.
  - **هوش‌های چندگانه گاردنر**: ارزیابی ۸ توانمندی راداری هوش، تفکیک هوش‌های قوی (`>= 4.0`) و هوش وجودی تکمیلی.
  - **سبک شخصیتی MBTI (دوقطبی)**: ارزیابی ۴ محور ترجیحی با درصد قطعیت و مدیریت حالت خنثی (`۵۰٪ / ۵۰٪`).
  - **رفتارشناسی DISC**: ارزیابی Most/Least با آستانه عددی gap (`<= 2`) برای صدور پروفایل‌های ترکیبی.
- **کپسول تبارشناسی Path DNA**: سنتز یکپارچه نتایج آزمون‌ها و نگاشت اتوماتیک به خوشه‌های شغلی برتر.
- **دیزاین سیستم فارسی RTL اختصاصی**:
  - پالت رنگی هماهنگ (Teal، Navy، Pink، Amber).
  - شعاع نامتقارن **Leaf Radius** (`12px 0 12px 0`).
  - سایه‌های توپر بدون بلر (Flat Offset Shadows).
  - تایپوگرافی IRANSansX و IRANSansXFaNum.
- **اتصال لایه دیتابیس Supabase**: احراز هویت کاربران (Supabase Auth)، سیاست‌های امنیتی RLS و اسکیماهای استاندارد دیتابیس.

---

## 🛠️ تکنولوژی‌های استفاده‌شده (Tech Stack)

| لایه | تکنولوژی |
|---|---|
| Framework | **Next.js 15.1 (App Router)** + TypeScript |
| Styling | Tailwind CSS + CSS Custom Properties |
| Database & Auth | **Supabase** (Postgres + Auth + RLS) |
| Charts & Visualization | Recharts (Radar & Bar charts) |
| Icons | Lucide React |

---

## 🚀 راهنمای نصب و راه‌اندازی سریع

### ۱. کلون پروژه و نصب وابستگی‌ها
```bash
git clone https://github.com/USERNAME/masirino.git
cd masirino
npm install
```

### ۲. تنظیم متغیرهای محیطی (`.env.local`)
یک فایل `.env.local` در ریشه پروژه ایجاد کرده و کلیدهای Supabase خود را وارد کنید:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3005
```

### ۳. ساخت ساختار جداول دیتابیس Supabase
محتوای فایل **`supabase/seed.sql`** را کپی کرده و در **SQL Editor** داشبورد پروژه Supabase خود اجرا فرمایید.

### ۴. اجرای سرور توسعه
```bash
npm run dev
```
برنامه در آدرس `http://localhost:3005` قابل مشاهده خواهد بود.

---

## 🧪 اجرای تست‌های واحد (Unit Tests)

برای اطمینان از صحت کامل الگوریتم‌های محاسباتی ۴ آزمون و حالات لبه‌ای (Tie-breaks، Neutral MBTI، DISC gap):
```bash
npx tsx scripts/test-scoring.ts
npx tsx scripts/test-mbti-scoring.ts
```

---

## 🔒 امنیت و محافظت از متغیرها
تمامی متغیرهای حساس و کلیدهای خصوصی در فایل `.gitignore` محافظت شده‌اند و هرگز وارد مخزن Git نخواهند شد.

---
© تمامی حقوق متعلق به محصول مشاوره تحصیلی **رُکاد** است.
