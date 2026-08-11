import React from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-25 flex flex-col justify-between">
      <Header />
      <main className="max-w-container mx-auto px-4 py-8 w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
