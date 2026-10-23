import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/I18nContext';
import type { Language } from '../../i18n/types';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'pl', label: 'PL' },
  { code: 'en', label: 'EN' },
  { code: 'ua', label: 'UA' },
];

/// <summary>
/// Ultra-compact, smooth-sliding pill language switcher for navbar space efficiency.
/// Guarantees mathematically centered pill alignment with zero drift and seamless gliding motion.
/// </summary>
export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeBtn = buttonRefs.current[language];
      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [language]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-2xs select-none"
    >
      {/* Smooth Sliding Pill Indicator */}
      <div
        className="absolute top-0.5 bottom-0.5 left-0 rounded-full bg-white shadow-xs border border-blue-200/70 transition-all duration-300 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      />

      {LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            ref={(el) => {
              buttonRefs.current[lang.code] = el;
            }}
            onClick={() => setLanguage(lang.code)}
            aria-label={`Switch to ${lang.label}`}
            className={`relative z-10 w-7.5 h-6 flex items-center justify-center rounded-full text-xs font-bold leading-none transition-colors duration-200 outline-none focus:outline-none focus-visible:outline-none cursor-pointer ${
              isActive
                ? 'text-blue-700 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
