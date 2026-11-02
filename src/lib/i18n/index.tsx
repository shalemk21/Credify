'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';

export type Language = 'en' | 'hi' | 'kn';

const dictionaries: Record<Language, typeof en> = {
  en,
  hi: hi as unknown as typeof en,
  kn: kn as unknown as typeof en,
};

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: typeof en;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('credify_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    try {
      localStorage.setItem('credify_lang', lang);
    } catch {}
  };

  const t = dictionaries[locale] || en;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

export function getDictionary(lang: Language = 'en') {
  return dictionaries[lang] || en;
}
