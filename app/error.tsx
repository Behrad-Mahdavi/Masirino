'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-pink-50 border-thick border-ink-900 rounded-2xl p-8 max-w-md w-full elevated-xl leaf-card space-y-6">
        <div className="w-14 h-14 rounded-xl bg-pink-500 text-white flex items-center justify-center mx-auto shadow-flat-sm">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <Chip variant="badge" brand="girl">
            خطای غیرمنتظره
          </Chip>
          <h1 className="text-2xl font-black text-ink-900">مشکلی در بارگذاری رخ داده است</h1>
          <p className="text-xs font-medium text-ink-500 leading-relaxed">
            متأسفانه هنگام پردازش درخواست شما خطایی رخ داد. می‌توانید مجدداً تلاش کنید.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => reset()}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            تلاش مجدد
          </Button>
          <Link href="/" className="w-full">
            <Button variant="secondary" size="md" className="w-full" icon={<Home className="w-4 h-4" />}>
              صفحه اصلی
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
