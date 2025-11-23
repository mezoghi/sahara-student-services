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
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 border border-accent-400 shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium"
      onClick={switchLanguage}
      aria-label="Switch Language"
    >
      <LanguageIcon className="h-5 w-5" />
      <span className="font-semibold">{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
