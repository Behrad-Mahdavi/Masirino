import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Compass, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-teal-50 border-thick border-ink-900 rounded-2xl p-8 max-w-md w-full elevated-xl leaf-card space-y-6">
        <div className="w-14 h-14 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center mx-auto shadow-flat-sm">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Chip variant="badge" brand="third">
            کد ۴۰۴
          </Chip>
          <h1 className="text-3xl font-black text-ink-900">صفحه مورد نظر یافت نشد</h1>
          <p className="text-xs font-medium text-ink-500 leading-relaxed">
            آدرس وارد شده یافت نشد یا ممکن است منتقل شده باشد.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md" className="w-full" icon={<Home className="w-4 h-4" />}>
              بازگشت به صفحه اصلی
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
