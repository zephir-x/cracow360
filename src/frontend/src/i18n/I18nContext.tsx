import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language, TranslationDictionary } from './types';
import { plTranslations } from './locales/pl';
import { enTranslations } from './locales/en';
import { uaTranslations } from './locales/ua';
import { formatPolishPlural, type PluralForms } from '../utils/pluralization';
import { localizeDistrictName as localizeDistNameHelper } from '../utils/districtLocalization';

const STORAGE_KEY = 'cracow360_lang';

export const PAGE_TITLES: Record<Language, string> = {
  pl: 'Kraków360 – System Analizy Jakości Życia i Predykcji Rozwoju Miejskiego',
  en: 'Kraków360 – Quality of Life Analysis & Urban Development Forecast System',
  ua: 'Kraków360 – Система Аналізу Якості Життя та Прогнозування Міського Розвитку',
};

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  plural: (count: number, forms: PluralForms) => string;
  formatWithPlural: (count: number, forms: PluralForms) => string;
  localizeDistrictName: (name: string | undefined | null) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  pl: plTranslations,
  en: enTranslations,
  ua: uaTranslations,
};

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pl';
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved && (saved === 'pl' || saved === 'en' || saved === 'ua')) {
    return saved;
  }
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
    return 'ua';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  return 'pl';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      document.title = PAGE_TITLES[newLang] ?? PAGE_TITLES.pl;
    } catch {
      // Ignore storage errors if localStorage is restricted
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = PAGE_TITLES[language] ?? PAGE_TITLES.pl;
  }, [language]);

  const plural = useMemo(() => {
    return (count: number, forms: PluralForms): string => {
      if (language === 'en') {
        return Math.abs(Math.round(count)) === 1 ? forms[0] : forms[2];
      }
      // Both Polish and Ukrainian follow 3-tier Slavic numerical inflection
      return formatPolishPlural(count, forms);
    };
  }, [language]);

  const formatWithPlural = useMemo(() => {
    return (count: number, forms: PluralForms): string => {
      const locale = language === 'en' ? 'en-US' : language === 'ua' ? 'uk-UA' : 'pl-PL';
      const formattedNum = count.toLocaleString(locale);
      return `${formattedNum} ${plural(count, forms)}`;
    };
  }, [language, plural]);

  const localizeDistrictName = useMemo(() => {
    return (name: string | undefined | null): string => {
      return localizeDistNameHelper(name, language);
    };
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage,
      t: TRANSLATIONS[language],
      plural,
      formatWithPlural,
      localizeDistrictName,
    };
  }, [language, plural, formatWithPlural, localizeDistrictName]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
