import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'رکاد | نقشه راه آینده دانش‌آموزان',
  description:
    'محصول مشاوره‌ی هوشمند تحصیلی-شغلی رکاد؛ طراحی مسیر دانش‌آموز بر اساس ۴ آزمون روان‌سنجی ترکیبی (هالند، گاردنر، MBTI و DISC) و استخراج Path DNA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col justify-between antialiased">
        {children}
      </body>
    </html>
  );
}
