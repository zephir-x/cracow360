import { Calculator, LineChart, Sliders } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export function InvestorCapabilitiesGrid() {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <div
        onClick={() => scrollTo('investor-forecast-section')}
        className="p-5 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3 cursor-pointer hover:border-blue-300 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center sm:text-left flex flex-col items-center sm:items-start"
      >
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <LineChart className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          {t.investor.capabilities.econometricsTitle}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.investor.capabilities.econometricsDesc}
        </p>
      </div>

      <div
        onClick={() => scrollTo('investor-simulator-section')}
        className="p-5 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3 cursor-pointer hover:border-indigo-300 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center sm:text-left flex flex-col items-center sm:items-start"
      >
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <Sliders className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          {t.investor.capabilities.whatIfTitle}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.investor.capabilities.whatIfDesc}
        </p>
      </div>

      <div
        onClick={() => scrollTo('investor-simulator-section')}
        className="p-5 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3 cursor-pointer hover:border-sky-300 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center sm:text-left flex flex-col items-center sm:items-start"
      >
        <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
          <Calculator className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          {t.investor.capabilities.deficitsTitle}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.investor.capabilities.deficitsDesc}
        </p>
      </div>
    </section>
  );
}
