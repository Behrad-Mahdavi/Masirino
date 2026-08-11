import React from 'react';
import Link from 'next/link';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-700 text-white pt-16 pb-8 border-t-heavy border-ink-900 mt-24">
      <div className="max-w-container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: About */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-teal-500 text-navy-700 flex items-center justify-center font-black text-xl shadow-flat-sm">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">رُکاد</span>
          </div>
          <p className="text-sm text-neutral-100/80 leading-relaxed">
            محصول مشاوره‌ی هوشمند تحصیلی-شغلی رکاد؛ کشف استعدادیابی دقیق دانش‌آموزان از طریق الگوریتم ۴ آزمون روان‌سنجی ترکیبی و تدوین نقشه راه آینده.
          </p>
        </div>

        {/* Col 2: Fast Links */}
        <div>
          <h4 className="text-lg font-black text-teal-500 mb-4">دسترسی سریع</h4>
          <ul className="flex flex-col gap-2.5 text-sm font-medium text-white/80">
            <li>
              <Link href="/" className="hover:text-teal-500 transition-colors">
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-teal-500 transition-colors">
                داشبورد آزمون‌ها
              </Link>
            </li>
            <li>
              <Link href="/results" className="hover:text-teal-500 transition-colors">
                گزارش Path DNA
              </Link>
            </li>
            <li>
              <Link href="/#plans" className="hover:text-teal-500 transition-colors">
                پلن‌های مشاوره
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Tests */}
        <div>
          <h4 className="text-lg font-black text-teal-500 mb-4">آزمون‌های روان‌سنجی</h4>
          <ul className="flex flex-col gap-2.5 text-sm font-medium text-white/80">
            <li>آزمون رغبت‌سنجی هالند (RIASEC)</li>
            <li>آزمون هوش‌های چندگانه گاردنر</li>
            <li>آزمون سبک شخصیتی دوقطبی (MBTI)</li>
            <li>آزمون رفتارشناسی DISC</li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="text-lg font-black text-teal-500 mb-4">ارتباط با تیم پشتیبانی</h4>
          <ul className="flex flex-col gap-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="font-numeric">۰۲۱-۸۸۸۸۴۴۲۲</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-500 shrink-0" />
              <span>support@rekad.ir</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
              <span>تهران، خیابان آزادی، مرکز نوآوری رکاد</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container mx-auto px-4 mt-12 pt-6 border-t border-white/15 text-center text-xs text-white/60 font-medium">
        تمامی حقوق مادی و معنوی این نرم‌افزار متعلق به محصول مشاوره تحصیلی «رکاد» است.
      </div>
    </footer>
  );
};
