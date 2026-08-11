'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { Chip } from './Chip';
import { createClient } from '@/lib/supabase/client';
import { Compass, Menu, X, UserCheck, LayoutDashboard, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get current user session
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      } else {
        // Fallback for dev demo login check
        const localAuth = localStorage.getItem('rekad_user_logged_in');
        if (localAuth === 'true') {
          setUser({ email: 'user@rekad.ir' });
        }
      }
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const localAuth = localStorage.getItem('rekad_user_logged_in');
        if (localAuth !== 'true') {
          setUser(null);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem('rekad_user_logged_in');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-6 z-50 max-w-container mx-auto px-4 md:px-6">
      <div className="bg-teal-50/95 backdrop-blur-md border-thick border-ink-900 rounded-2xl px-6 py-4 md:px-8 md:py-4.5 elevated-md flex items-center justify-between gap-6 lg:gap-12">
        {/* Right Section: Logo & Badge */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-teal-800 text-white flex items-center justify-center font-black text-xl shadow-flat-sm group-hover:rotate-default-neg transition-transform">
              <Compass className="w-6.5 h-6.5 text-teal-200" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-black text-ink-900 tracking-tight leading-tight">
                رُکاد
              </span>
              <span className="text-[11px] font-bold text-teal-700">نقشه راه آینده</span>
            </div>
          </Link>
          <Chip variant="badge" brand="rokad" className="hidden sm:inline-flex">
            نسخه MVP
          </Chip>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
          <Link
            href="/"
            className="text-base font-bold text-navy-700 hover:text-teal-700 transition-colors py-1"
          >
            صفحه اصلی
          </Link>
          <Link
            href="/#tests"
            className="text-base font-bold text-navy-700 hover:text-teal-700 transition-colors py-1"
          >
            ۴ آزمون روان‌سنجی
          </Link>
          <Link
            href="/#plans"
            className="text-base font-bold text-navy-700 hover:text-teal-700 transition-colors py-1"
          >
            پلن‌های مشاوره
          </Link>
          <Link
            href="/dashboard"
            className="text-base font-bold text-navy-700 hover:text-teal-700 transition-colors py-1"
          >
            داشبورد دانش‌آموز
          </Link>
        </nav>

        {/* Left Section: Action Buttons */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="primary" size="md" icon={<LayoutDashboard className="w-4.5 h-4.5" />}>
                  داشبورد من
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="md"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4 text-pink-700" />}
              >
                خروج
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="md">
                  ورود
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="primary" size="md" icon={<UserCheck className="w-4.5 h-4.5" />}>
                  شروع تست‌ها
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-lg bg-white border-2 border-ink-900 text-ink-900 shadow-flat-sm active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="منو"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-6 bg-white border-thick border-ink-900 rounded-2xl elevated-xl flex flex-col gap-5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-black text-ink-900 hover:text-teal-700"
          >
            صفحه اصلی
          </Link>
          <Link
            href="/#tests"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-black text-ink-900 hover:text-teal-700"
          >
            ۴ آزمون روان‌سنجی
          </Link>
          <Link
            href="/#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-black text-ink-900 hover:text-teal-700"
          >
            پلن‌های مشاوره
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-black text-ink-900 hover:text-teal-700"
          >
            داشبورد دانش‌آموز
          </Link>

          <div className="pt-4 border-t-thick border-neutral-200 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    ورود به داشبورد من
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  خروج از حساب
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full">
                    ورود به حساب کاربری
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    شروع ۴ آزمون روان‌سنجی
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
