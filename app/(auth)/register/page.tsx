'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { createClient } from '@/lib/supabase/client';
import { UserPlus, Compass, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        console.warn('Supabase signup warning:', error.message);
      }

      localStorage.setItem('rekad_user_logged_in', 'true');
      setLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      localStorage.setItem('rekad_user_logged_in', 'true');
      setLoading(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <main className="max-w-md mx-auto w-full px-4 py-12 my-auto">
        <div className="bg-white border-thick border-ink-900 rounded-2xl p-8 elevated-xl leaf-card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-teal-800 text-white flex items-center justify-center font-black">
                <Compass className="w-5 h-5 text-teal-200" />
              </div>
              <span className="text-xl font-black text-ink-900">ثبت‌نام جدید</span>
            </div>
            <Chip variant="badge" brand="third">
              استعدادیابی رکاد
            </Chip>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-pink-50 border border-pink-500 text-pink-700 text-xs font-bold rounded-md">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">نام و نام خانوادگی</label>
              <input
                type="text"
                required
                placeholder="علی رضایی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-neutral-300 focus:border-teal-500 focus:outline-none font-medium text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">نقش کاربر</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 rounded-md font-bold text-xs border ${
                    role === 'student'
                      ? 'bg-teal-700 text-white border-ink-900 shadow-flat-sm'
                      : 'bg-neutral-50 text-ink-700 border-neutral-300'
                  }`}
                >
                  دانش‌آموز
                </button>
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`py-2 rounded-md font-bold text-xs border ${
                    role === 'parent'
                      ? 'bg-navy-700 text-white border-ink-900 shadow-flat-sm'
                      : 'bg-neutral-50 text-ink-700 border-neutral-300'
                  }`}
                >
                  والد دانش‌آموز
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">ایمیل / شماره همراه</label>
              <input
                type="text"
                required
                placeholder="example@rekad.ir"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-neutral-300 focus:border-teal-500 focus:outline-none font-medium text-sm text-left dir-ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-900 mb-1.5">کلمه عبور</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-neutral-300 focus:border-teal-500 focus:outline-none font-medium text-sm text-left dir-ltr"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={<UserPlus className="w-4 h-4" />}
            >
              ایجاد حساب و شروع
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-200 text-center text-xs font-bold text-ink-500 flex justify-between items-center">
            <span>قبلاً ثبت‌نام کرده‌اید؟</span>
            <Link href="/login" className="text-teal-700 hover:underline flex items-center gap-1">
              وارد شوید <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-xs font-medium text-ink-500">
        © رکاد | نقشه راه آینده
      </footer>
    </div>
  );
}
