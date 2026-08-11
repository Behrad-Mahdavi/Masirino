'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-pink-50 border-thick border-ink-900 rounded-2xl p-8 max-w-md w-full elevated-xl space-y-6">
          <div className="w-14 h-14 rounded-xl bg-pink-500 text-white flex items-center justify-center mx-auto shadow-flat-sm">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-ink-900">خطای سیستمی برنامه‌ای</h1>
            <p className="text-xs font-medium text-ink-500">
              خطای غیرمنتظره ریشه برنامه‌ای رخ داده است.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => reset()}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            تلاش مجدد بارگذاری
          </Button>
        </div>
      </body>
    </html>
  );
}
