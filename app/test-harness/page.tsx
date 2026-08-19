import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { PathEngineHarness } from '@/components/test-harness/PathEngineHarness';

export const metadata: Metadata = {
  title: 'محیط آزمایش و تست موتور مسیر (Path Engine Test Harness) | مسیرو رکاد',
  description: 'میز کار تعاملی و ابزار تست دستی و زنده الگوریتم هدایت تحصیلی و شغلی مسیرو',
};

export default function TestHarnessPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-4">
        <PathEngineHarness />
      </main>
      <Footer />
    </div>
  );
}
