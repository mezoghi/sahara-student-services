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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-soft-lg'
          : 'bg-white/80 backdrop-blur-md shadow-soft'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <span className="relative text-3xl font-bold text-primary group-hover:text-primary-600 transition-colors">Sahara</span>
            </div>
            <span className="text-3xl font-bold text-accent group-hover:text-accent-600 transition-colors">SS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="nav-link">
              {t.nav.home}
            </Link>
            <Link href="/about" className="nav-link">
              {t.nav.about}
            </Link>
            <Link href="/services" className="nav-link">
              {t.nav.services}
            </Link>
            <Link href="/study-uk" className="nav-link">
              {t.nav.studyUK}
            </Link>
            <Link href="/courses" className="nav-link">
              {t.nav.courses}
            </Link>

            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === 'ADMIN' || user?.role === 'COUNSELLOR' ? '/admin/dashboard' : '/dashboard'}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all group"
                  >
                    <UserCircleIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{t.nav.dashboard}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-600 text-white font-medium shadow-soft hover:shadow-glow-accent transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-xl text-primary font-medium hover:bg-primary/5 transition-all"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-700 text-white font-medium shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {t.nav.register}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-400 ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-6 space-y-2 border-t border-gray-100 mt-4">
            <Link href="/" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Home
            </Link>
            <Link href="/about" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">
              About
            </Link>
            <Link href="/services" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Services
            </Link>
            <Link href="/study-uk" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Study in UK
            </Link>
            <Link href="/courses" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">
              Courses
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === 'ADMIN' || user?.role === 'COUNSELLOR' ? '/admin/dashboard' : '/dashboard'}
                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-600 text-white font-medium shadow-soft hover:shadow-glow-accent transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-xl text-center text-gray-700 hover:bg-gray-100 font-medium transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-6 py-3 rounded-xl text-center bg-gradient-to-r from-primary to-primary-700 text-white font-medium shadow-soft hover:shadow-soft-lg transition-all"
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
