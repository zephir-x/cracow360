import { ArrowLeft, Baby } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export interface ParentHeroHeaderProps {
  onBackToResidentMode: () => void;
}

export function ParentHeroHeader({ onBackToResidentMode }: ParentHeroHeaderProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0f3460] via-[#1e40af] to-[#0369a1] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
          <Baby className="w-4 h-4 text-sky-300" />
          {t.parent.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          {t.parent.titleLead}
          <br />
          <span className="text-sky-200">{t.parent.titleAccent}</span>
        </h1>
        <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
          {t.parent.description}
        </p>
        <div className="pt-2">
          <button
            onClick={onBackToResidentMode}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            {t.parent.backButton}
          </button>
        </div>
      </div>
    </section>
  );
}
