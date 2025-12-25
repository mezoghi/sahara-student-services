'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-soft-lg border-primary-200'
          : 'bg-white/90 backdrop-blur-md shadow-soft border-primary-100'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-error-500 opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <span className="relative text-3xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent group-hover:from-primary-800 group-hover:to-primary-600 transition-all">Sahara</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-error-500 to-error-600 bg-clip-text text-transparent group-hover:from-error-600 group-hover:to-error-700 transition-all">SS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/" className="px-4 py-2.5 rounded-xl text-primary-700 font-medium hover:bg-primary-50 hover:text-primary-900 transition-all duration-300 border border-transparent hover:border-primary-200">
              {t.nav.home}
            </Link>
            <Link href="/about" className="px-4 py-2.5 rounded-xl text-primary-700 font-medium hover:bg-primary-50 hover:text-primary-900 transition-all duration-300 border border-transparent hover:border-primary-200">
              {t.nav.about}
            </Link>
            <Link href="/services" className="px-4 py-2.5 rounded-xl text-primary-700 font-medium hover:bg-primary-50 hover:text-primary-900 transition-all duration-300 border border-transparent hover:border-primary-200">
              {t.nav.services}
            </Link>
            <Link href="/study-uk" className="px-4 py-2.5 rounded-xl text-primary-700 font-medium hover:bg-primary-50 hover:text-primary-900 transition-all duration-300 border border-transparent hover:border-primary-200">
              {t.nav.studyUK}
            </Link>
            <Link href="/courses" className="px-4 py-2.5 rounded-xl text-primary-700 font-medium hover:bg-primary-50 hover:text-primary-900 transition-all duration-300 border border-transparent hover:border-primary-200">
              {t.nav.courses}
            </Link>

            <div className="flex items-center gap-3 ml-8 pl-8 border-l-2 border-primary-200">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === 'ADMIN' || user?.role === 'COUNSELLOR' ? '/admin/dashboard' : '/dashboard'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 group"
                  >
                    <UserCircleIcon className="h-5 w-5 text-primary-700 group-hover:text-primary-900 group-hover:scale-110 transition-all" />
                    <span className="text-sm font-medium text-primary-700 group-hover:text-primary-900">{t.nav.dashboard}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-error-500 to-error-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-error-600 hover:to-error-700 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-xl text-primary-700 font-semibold border border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-error-500 to-error-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-error-600 hover:to-error-700 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {t.nav.register}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 rounded-xl border border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-primary-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-primary-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-400 ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-6 space-y-3 border-t-2 border-primary-200 mt-4">
            <Link href="/" className="block px-4 py-3 rounded-xl text-primary-700 border border-transparent hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 font-medium transition-all duration-300">
              Home
            </Link>
            <Link href="/about" className="block px-4 py-3 rounded-xl text-primary-700 border border-transparent hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 font-medium transition-all duration-300">
              About
            </Link>
            <Link href="/services" className="block px-4 py-3 rounded-xl text-primary-700 border border-transparent hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 font-medium transition-all duration-300">
              Services
            </Link>
            <Link href="/study-uk" className="block px-4 py-3 rounded-xl text-primary-700 border border-transparent hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 font-medium transition-all duration-300">
              Study in UK
            </Link>
            <Link href="/courses" className="block px-4 py-3 rounded-xl text-primary-700 border border-transparent hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 font-medium transition-all duration-300">
              Courses
            </Link>
            <div className="pt-6 mt-6 border-t-2 border-primary-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === 'ADMIN' || user?.role === 'COUNSELLOR' ? '/admin/dashboard' : '/dashboard'}
                    className="block px-4 py-3 rounded-xl text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-900 font-medium transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-error-500 to-error-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-error-600 hover:to-error-700 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-xl text-center text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 font-semibold transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-6 py-3 rounded-xl text-center bg-gradient-to-r from-error-500 to-error-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-error-600 hover:to-error-700 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
