'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Target, Brain, Zap, BarChart3, ArrowLeft, Award, Sparkles, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  useEffect(() => {
    // Read completed status from localStorage for demo persistence
    const holland = localStorage.getItem('test_result_HOLLAND');
    const gardner = localStorage.getItem('test_result_GARDNER');
    const mbti = localStorage.getItem('test_result_MBTI');
    const disc = localStorage.getItem('test_result_DISC');

    const done = [];
    if (holland) done.push('HOLLAND');
    if (gardner) done.push('GARDNER');
    if (mbti) done.push('MBTI');
    if (disc) done.push('DISC');

    setCompletedTests(done);
  }, []);

  const testsList = [
    {
      code: 'HOLLAND',
      name: 'آزمون رغبت‌سنجی شغلی هالند',
      subtitle: 'شناسایی ۶ بعد رغبت کاری (RIASEC)',
      questionsCount: 36,
      icon: <Target className="w-6 h-6 text-teal-700" />,
      brand: 'rokad' as const,
    },
    {
      code: 'GARDNER',
      name: 'آزمون هوش‌های چندگانه گاردنر',
      subtitle: 'ارزیابی ۸ توانمندی راداری هوش',
      questionsCount: 40,
      icon: <Brain className="w-6 h-6 text-pink-700" />,
      brand: 'girl' as const,
    },
    {
      code: 'MBTI',
      name: 'آزمون سبک شخصیتی MBTI',
      subtitle: 'سنجش ۴ دوقطبی و ترجیحات رفتاری',
      questionsCount: 24,
      icon: <Zap className="w-6 h-6 text-navy-600" />,
      brand: 'boy' as const,
    },
    {
      code: 'DISC',
      name: 'ارزیابی رفتاری DISC',
      subtitle: 'بلوک‌های Most/Least موقعیتی',
      questionsCount: 6,
      icon: <BarChart3 className="w-6 h-6 text-amber-800" />,
      brand: 'third' as const,
    },
  ];

  const totalProgress = Math.round((completedTests.length / 4) * 100);

  return (
    <div className="space-y-8">
      {/* Header Overview Card */}
      <div className="bg-white border-thick border-ink-900 rounded-2xl p-6 md:p-8 elevated-xl leaf-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Chip variant="badge" brand="rokad">
              پنل استعدادیابی
            </Chip>
            <span className="text-xs font-bold text-ink-500">پایه تحصیلی: دهم / یازدهم</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink-900">
            سلام دانش‌آموز عزیز، به رُکاد خوش آمدید!
          </h1>
          <p className="text-xs md:text-sm font-medium text-ink-500">
            برای استخراج گزارش جامع Path DNA، لطفاً ۴ آزمون روان‌سنجی زیر را تکمیل نمایید.
          </p>
        </div>

        <div className="bg-teal-50 border-thick border-teal-500 rounded-xl p-4 text-center min-w-[200px] shadow-flat-sm w-full md:w-auto">
          <span className="text-xs font-bold text-teal-800 block mb-1">پیشرفت ۴ آزمون</span>
          <div className="text-3xl font-black text-teal-700 font-numeric mb-1">
            {completedTests.length} از ۴ ({totalProgress}٪)
          </div>
          <div className="w-full bg-teal-200 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Path DNA Ready Banner */}
      {completedTests.length === 4 && (
        <div className="bg-amber-100 border-heavy border-amber-600 rounded-xl p-6 elevated-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-800 shrink-0" />
            <div>
              <h3 className="text-lg font-black text-amber-900">تبارشناسی Path DNA تکمیل شد!</h3>
              <p className="text-xs font-bold text-amber-800">
                هر ۴ آزمون شما ثبت گردیده است. اکنون می‌توانید گزارش جامع کپسول Path DNA و تحلیل خوشه‌های شغلی را مشاهده کنید.
              </p>
            </div>
          </div>
          <Link href="/results">
            <Button variant="brand" brand="third" size="md" icon={<Award className="w-4 h-4" />}>
              مشاهده گزارش Path DNA
            </Button>
          </Link>
        </div>
      )}

      {/* Tests Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-ink-900">لیست ۴ آزمون روان‌سنجی</h2>
          <span className="text-xs font-bold text-ink-500">ترتیب تکمیل دلخواه است</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testsList.map((test) => {
            const isDone = completedTests.includes(test.code);

            return (
              <div
                key={test.code}
                data-brand={test.brand}
                className="bg-white border-thick border-ink-900 rounded-xl p-6 elevated-md flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[var(--brand-tint)] border border-[var(--brand-accent)]">
                      {test.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-ink-900">{test.name}</h3>
                      <p className="text-xs font-medium text-ink-500">{test.subtitle}</p>
                    </div>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-500">
                      <CheckCircle className="w-3.5 h-3.5" /> تکمیل شد
                    </span>
                  ) : (
                    <Chip variant="outline" brand={test.brand}>
                      {test.questionsCount} سوال
                    </Chip>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-neutral-200">
                  <span className="text-xs font-numeric font-bold text-ink-500">
                    زمان تقریبی: {test.code === 'DISC' ? '۵ دقیقه' : '۱۰ دقیقه'}
                  </span>

                  <Link href={`/tests/${test.code}`}>
                    <Button
                      variant={isDone ? 'secondary' : 'primary'}
                      size="sm"
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      {isDone ? 'بازبینی / اجرای مجدد' : 'شروع این آزمون'}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
