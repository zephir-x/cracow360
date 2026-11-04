import React from 'react';
import { Compass, Leaf, Train } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { getTourismI18n } from '../../i18n/modules';

export const TouristCapabilitiesGrid: React.FC = () => {
  const { language } = useTranslation();
  const t = getTourismI18n(language);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
      <div
        onClick={() => scrollTo('trip-planner-section')}
        className="p-4 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-2.5 sm:space-y-3 cursor-pointer hover:border-blue-300 hover:shadow-xl transition transform hover:-translate-y-0.5 flex flex-col items-center sm:items-start text-center sm:text-left"
      >
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
          {t.capabilities.card1Title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.capabilities.card1Desc}
        </p>
      </div>

      <div
        onClick={() => scrollTo('overtourism-section')}
        className="p-4 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-2.5 sm:space-y-3 cursor-pointer hover:border-emerald-300 hover:shadow-xl transition transform hover:-translate-y-0.5 flex flex-col items-center sm:items-start text-center sm:text-left"
      >
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
          <Leaf className="w-5 h-5" />
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
          {t.capabilities.card2Title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.capabilities.card2Desc}
        </p>
      </div>

      <div
        onClick={() => scrollTo('district-passports-section')}
        className="p-4 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-2.5 sm:space-y-3 cursor-pointer hover:border-sky-300 hover:shadow-xl transition transform hover:-translate-y-0.5 flex flex-col items-center sm:items-start text-center sm:text-left"
      >
        <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
          <Train className="w-5 h-5" />
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
          {t.capabilities.card3Title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.capabilities.card3Desc}
        </p>
      </div>
    </section>
  );
};
