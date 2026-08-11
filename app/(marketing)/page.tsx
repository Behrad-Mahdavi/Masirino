import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/ui/StatCard';
import { FeatureCard } from '@/components/ui/FeatureCard';
import {
  Sparkles,
  Target,
  Brain,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  Users,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="max-w-container mx-auto px-4 pt-8 pb-16 w-full">
        <div className="bg-teal-500 rounded-3xl p-8 md:p-14 border-thick border-ink-900 elevated-xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Background Decorative Accent */}
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-teal-600 rounded-full blur-2xl opacity-40 pointer-events-none" />

          {/* Right Hero Content */}
          <div className="flex-1 space-y-6 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Chip variant="badge" brand="third">
                پلتفرم مشاوره تخصصی ۱۴۰۵
              </Chip>
              <span className="text-xs font-black text-teal-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> نسخه کامل ۴ آزمون
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white">
              کشف استعدادیابی واقعی و <br />
              <span className="text-amber-300 underline decoration-navy-700 decoration-wavy">
                طراحی نقشه راه آینده
              </span>
            </h1>

            <p className="text-base md:text-lg text-teal-50 font-medium leading-relaxed max-w-xl">
              محصول هوشمند **رُکاد** مسیر رشد تحصیلی و شغلی دانش‌آموز را با ترکیب علمی ۴ آزمون روان‌سنجی (هالند، گاردنر، MBTI و DISC) و استخراج **Path DNA** ترسیم می‌کند.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/dashboard">
                <Button variant="emphasis" size="lg" icon={<ArrowLeft className="w-5 h-5" />}>
                  شروع ارزیابی و ۴ آزمون
                </Button>
              </Link>
              <Link href="#plans">
                <Button variant="secondary" size="lg">
                  مشاهده پلن‌های مشاوره
                </Button>
              </Link>
            </div>
          </div>

          {/* Left Hero Graphic / Stat Cards */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center justify-center z-10">
            <StatCard
              label="دقت تحلیل"
              value="۹۸٪"
              title="تطبیق رغبت و الگوی رفتار"
              caption="بر اساس ماتریس ترکیبی ۴ تست"
              brand="third"
              rotation="right"
            />
            <StatCard
              label="تعداد تست"
              value="۴"
              title="ارزیابی جامع روان‌سنجی"
              caption="هالند + گاردنر + MBTI + DISC"
              brand="girl"
              rotation="left"
            />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="tests" className="max-w-container mx-auto px-4 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Chip variant="outline" brand="rokad" className="mb-3">
            موتور روان‌سنجی ۴ گانه
          </Chip>

          <h2 className="text-3xl md:text-4xl font-black text-ink-900 mb-4">
            چرا ۴ آزمون هم‌زمان در رکاد؟
          </h2>
          <p className="text-sm md:text-base font-medium text-ink-500">
            هیچ تست تکی نمی‌تواند تمام ابعاد شخصیت، رغبت شغلی، هوش‌های چندگانه و سبک رفتاری دانش‌آموز را کاوش کند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            index="۰۱"
            title="رغبت‌سنجی هالند"
            body="شناسایی علاقه عمیق شغلی در ۶ بعد RIASEC و استخراج کد سه‌حرفی جهت تطبیق با بازار کار."
            icon={<Target className="w-5 h-5" />}
            brand="rokad"
            rotation="left"
          />
          <FeatureCard
            index="۰۲"
            title="هوش‌های گاردنر"
            body="ارزیابی ۸ بعد توانمندی ذهنی (کلامی، منطقی، فضایی، بدنی، موسیقی، راداری) برای تعیین مزیت رقابتی."
            icon={<Brain className="w-5 h-5" />}
            brand="girl"
            rotation="right"
          />
          <FeatureCard
            index="۰۳"
            title="سبک شخصیتی MBTI"
            body="سنجش ۴ محور دوقطبی انرژی، ادراک، تصمیم‌گیری و سبک زندگی به همراه درصد قطعیت ترجیح."
            icon={<Zap className="w-5 h-5" />}
            brand="boy"
            rotation="left"
          />
          <FeatureCard
            index="۰۴"
            title="رفتارشناسی DISC"
            body="شناسایی الگوهای رفتاری در تعارض، کار تیمی و محیط تحت فشار با فرمت پیشرفته Most/Least."
            icon={<BarChart3 className="w-5 h-5" />}
            brand="third"
            rotation="right"
          />
        </div>
      </section>

      {/* Path DNA Synthesis Highlight */}
      <section className="bg-teal-50 border-y-thick border-ink-900 py-16">
        <div className="max-w-container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <Chip variant="badge" brand="rokad">
              خروجی انحصاری Path DNA
            </Chip>
            <h2 className="text-3xl md:text-4xl font-black text-ink-900">
              یکپارچه‌سازی خروجی ۴ آزمون در کپسول Path DNA
            </h2>
            <p className="text-sm md:text-base font-medium text-ink-500 leading-relaxed">
              پس از پاسخ‌گویی به آزمون‌ها، موتور هوشمند رکاد الگوریتم ترکیبی را اجرا کرده و خوشه‌های شغلی برتر همراه با نقش‌های کاری پیشنهادی را تحلیل و تولید می‌کند.
            </p>

            <ul className="space-y-2.5 pt-2 text-sm font-bold text-ink-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
                تحلیل هم‌افزایی کد هالند با تیپ شخصیتی MBTI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
                نمودار راداری هوش‌های برتر گاردنر
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
                تطبیق سبک رفتاری DISC با نقش‌های سازمانی
              </li>
            </ul>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button variant="primary" size="md">
                  ورود به داشبورد و شروع تست‌ها
                </Button>
              </Link>
            </div>
          </div>

          {/* Graphic mockup card */}
          <div className="w-full md:w-[480px] bg-white border-thick border-ink-900 rounded-2xl p-6 elevated-xl leaf-card space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="font-black text-lg text-navy-700">کارت نمایه Path DNA دانش‌آموز</span>
              <Chip variant="outline" brand="third">
                نمونه گزارش
              </Chip>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-500 text-center">
                <span className="text-xs text-teal-800 font-bold block">کد هالند</span>
                <span className="font-numeric text-xl font-black text-teal-700">SAE</span>
              </div>
              <div className="bg-navy-50 p-3 rounded-lg border border-navy-600 text-center">
                <span className="text-xs text-navy-600 font-bold block">تیپ MBTI</span>
                <span className="font-numeric text-xl font-black text-navy-700">ENFP</span>
              </div>
            </div>

            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-300 space-y-1">
              <span className="text-xs font-bold text-ink-500">خوشه شغلی پیشنهادی اول:</span>
              <p className="text-sm font-black text-ink-900">طراحی تجربه کاربر (UX) و مدیریت محصول</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Pricing Section */}
      <section id="plans" className="max-w-container mx-auto px-4 py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Chip variant="badge" brand="third" className="mb-3">
            پلن‌های مشاوره
          </Chip>
          <h2 className="text-3xl md:text-4xl font-black text-ink-900 mb-4">
            انتخاب مسیر همراهی دانش‌آموز
          </h2>
          <p className="text-sm md:text-base font-medium text-ink-500">
            از کشف استعدادیابی اولـیه تا تدوین نقشه راه ۹۰ روزه اجرایی
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="bg-white border-thick border-ink-900 rounded-2xl p-8 elevated-lg flex flex-col justify-between transition-transform hover:scale-[1.02]">
            <div>
              <Chip variant="outline" brand="rokad" className="mb-4">
                پلن ۱ — کشف مسیر
              </Chip>
              <h3 className="text-2xl font-black text-ink-900 mb-2">ارزیابی کامل Path DNA</h3>
              <p className="text-xs font-medium text-ink-500 mb-6">
                اجرای ۴ آزمون روان‌سنجی + استخراج گزارش جامع + جلسه مشاوره فردی
              </p>
              <div className="text-3xl font-black text-teal-800 font-numeric mb-6">
                ۴۹۰,۰۰۰ <span className="text-xs font-bold text-ink-500">تومان</span>
              </div>

              <ul className="space-y-3 text-sm font-bold text-ink-800 border-t border-neutral-200 pt-6 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> ۴ آزمون روان‌سنجی کامل
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> گزارش یکپارچه Path DNA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> جلسه مشاوره فردی آنلاین
                </li>
              </ul>
            </div>
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="w-full">
                انتخاب پلن کشف مسیر
              </Button>
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="bg-teal-50 border-heavy border-teal-500 rounded-2xl p-8 elevated-xl flex flex-col justify-between relative transform md:-translate-y-2">
            <div className="absolute -top-3 right-6 bg-navy-700 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
              پیشنهادی والدین
            </div>
            <div>
              <Chip variant="badge" brand="third" className="mb-4">
                پلن ۲ — طراحی آینده
              </Chip>
              <h3 className="text-2xl font-black text-ink-900 mb-2">نقشه راه شغلی رسمی</h3>
              <p className="text-xs font-medium text-ink-500 mb-6">
                شامل تمام فیچرهای پلن ۱ + تحلیل بازار کار + جلسه حضور والدین + سند رسمی
              </p>
              <div className="text-3xl font-black text-navy-700 font-numeric mb-6">
                ۹۹۰,۰۰۰ <span className="text-xs font-bold text-ink-500">تومان</span>
              </div>

              <ul className="space-y-3 text-sm font-bold text-ink-800 border-t border-neutral-300 pt-6 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> تمام خدمات پلن ۱
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> جلسه تصمیم‌سازی با والدین
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> تحلیل بازار کار و مسیر جایگزین
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> سند رسمی نقشه راه آینده
                </li>
              </ul>
            </div>
            <Link href="/dashboard">
              <Button variant="emphasis" size="md" className="w-full">
                انتخاب پلن طراحی آینده
              </Button>
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="bg-white border-thick border-ink-900 rounded-2xl p-8 elevated-lg flex flex-col justify-between transition-transform hover:scale-[1.02]">
            <div>
              <Chip variant="outline" brand="girl" className="mb-4">
                پلن ۳ — همراه رشد
              </Chip>
              <h3 className="text-2xl font-black text-ink-900 mb-2">کوچینگ اجرایی ۹۰ روزه</h3>
              <p className="text-xs font-medium text-ink-500 mb-6">
                شامل تمام خدمات پلن‌های قبلی + برنامه اقدام ۹۰ روزه + پشتیبانی مستمر کوچ
              </p>
              <div className="text-3xl font-black text-pink-700 font-numeric mb-6">
                ۱,۸۹۰,۰۰۰ <span className="text-xs font-bold text-ink-500">تومان</span>
              </div>

              <ul className="space-y-3 text-sm font-bold text-ink-800 border-t border-neutral-200 pt-6 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> تمام خدمات پلن ۱ و ۲
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> برنامه اقدام ۹۰ روزه تعاملی
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> کوچینگ مستمر و ارزیابی هفتگی
                </li>
              </ul>
            </div>
            <Link href="/dashboard">
              <Button variant="secondary" size="md" className="w-full">
                انتخاب پلن همراه رشد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
