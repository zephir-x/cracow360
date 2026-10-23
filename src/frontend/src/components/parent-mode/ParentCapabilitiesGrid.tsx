import { Clock, GraduationCap, Trees } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export function ParentCapabilitiesGrid() {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          {t.parent.capabilities.isochronesTitle}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.parent.capabilities.isochronesDesc}
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          {t.parent.capabilities.facilitiesTitle}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.parent.capabilities.facilitiesDesc}
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <Trees className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          {t.parent.capabilities.greeneryTitle}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.parent.capabilities.greeneryDesc}
        </p>
      </div>
    </section>
  );
}
