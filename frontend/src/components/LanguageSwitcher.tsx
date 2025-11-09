'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { LanguageIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
  };

  return (
    <button
      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
      onClick={switchLanguage}
      aria-label="Switch Language"
    >
      <LanguageIcon className="h-5 w-5" />
      <span className="font-medium">{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
