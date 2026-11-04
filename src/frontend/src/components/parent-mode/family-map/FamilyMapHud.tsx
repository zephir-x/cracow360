import { Baby, CheckCircle2, GraduationCap, Smile, Trees, X } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from '../../../i18n/I18nContext';
import { localizePoiAdditionalInfo, localizePoiName } from '../../../utils/poiLocalization';
import { formatPolishPlural } from '../../../utils/pluralization';
import { getRadiusLabels, type BufferStats, type DisplayPoi } from './familyMapTypes';

export interface FamilyMapHudProps {
  selectedPoi: DisplayPoi | null;
  bufferRadius: 300 | 500 | 1000;
  setBufferRadius: (radius: 300 | 500 | 1000) => void;
  bufferStats: BufferStats;
  districtNameMap: Map<number, string>;
  onClose: () => void;
  isMobileInline?: boolean;
}

export function FamilyMapHud({
  selectedPoi,
  bufferRadius,
  setBufferRadius,
  bufferStats,
  districtNameMap,
  onClose,
  isMobileInline = false,
}: FamilyMapHudProps) {
  const { language, t, localizeDistrictName } = useTranslation();

  const currentRadiusLabels = useMemo(
    () => getRadiusLabels(bufferRadius, language),
    [bufferRadius, language]
  );

  // Exact left offset in percentage for the CSS sliding pill indicator
  const pillLeft =
    bufferRadius === 300
      ? '4px'
      : bufferRadius === 500
      ? 'calc(33.333% + 2px)'
      : 'calc(66.666%)';

  // Formatted localized summary text for the HUD footer with Polish Slavic grammatical inflections
  const totalSummaryText = useMemo(() => {
    if (bufferStats.total === 0) {
      return t.parent.familyMap.noFacilitiesInBuffer;
    }
    if (language === 'pl') {
      const noun = formatPolishPlural(bufferStats.total, ['obiekt', 'obiekty', 'obiektów']);
      return `Łącznie ${bufferStats.total} ${noun} w zasięgu ${currentRadiusLabels.time} spaceru pieszo.`;
    }
    if (language === 'ua') {
      const noun = formatPolishPlural(bufferStats.total, ['об’єкт', 'об’єкти', 'об’єктів']);
      return `Всього ${bufferStats.total} ${noun} у межах ${currentRadiusLabels.time} пішої прогулянки.`;
    }
    const noun = bufferStats.total === 1 ? 'facility' : 'facilities';
    return `Total ${bufferStats.total} ${noun} within ${currentRadiusLabels.time} walking distance.`;
  }, [bufferStats, t, currentRadiusLabels, language]);

  return (
    <div className={
        isMobileInline
          ? 'w-full bg-white/95 backdrop-blur-md border border-blue-200/90 rounded-2xl p-4 shadow-sm space-y-3 animate-fade-in text-left'
          : 'absolute top-4 right-4 z-1000 w-88 pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-200/80 rounded-2xl p-4 shadow-xl shadow-blue-950/15 space-y-3 animate-fade-in text-left'
      }>
      {/* Header: Title, Tags & Enlarged X Button */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-600">
              {t.parent.familyMap.bufferRadius} • {currentRadiusLabels.dist}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
            {selectedPoi
              ? localizePoiName(selectedPoi.name, language)
              : t.parent.familyMap.selectedPointTitle}
          </h4>
          {selectedPoi && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                {t.parent.explorer.subCategories[selectedPoi.subCategory] || selectedPoi.subCategory}
              </span>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                {localizeDistrictName(
                  districtNameMap.get(selectedPoi.districtId) || `Dzielnica ${selectedPoi.districtId}`
                )}
              </span>
            </div>
          )}
          {selectedPoi?.address &&
            selectedPoi.address.trim().toLowerCase() !== selectedPoi.name.trim().toLowerCase() &&
            !selectedPoi.address.trim().toLowerCase().startsWith(selectedPoi.name.trim().toLowerCase()) && (
              <p className="text-[11px] text-slate-500 truncate mt-1">
                {selectedPoi.address}
              </p>
            )}
          {selectedPoi && (
            <div className="text-[10px] text-blue-700 font-medium mt-0.5">
              {localizePoiAdditionalInfo(
                selectedPoi.metrics?.additionalInfo,
                selectedPoi.metrics?.capacity,
                t,
                language
              )}
            </div>
          )}
        </div>

        {/* Enlarged Prominent Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 transition-all cursor-pointer shrink-0 shadow-2xs"
          title={t.parent.familyMap.resetBuffer}
          aria-label={t.parent.familyMap.resetBuffer}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* 3-Step Interactive Walking Radius Toggle with Sliding Pill Indicator */}
      <div className="space-y-1 pt-0.5">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span>{t.parent.familyMap.radiusSelectLabel}</span>
          <span className="text-blue-600 font-black">
            {currentRadiusLabels.dist} ({currentRadiusLabels.time})
          </span>
        </div>
        <div className="relative grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
          {/* Sliding Blue Pill Indicator: Perfectly centered in Y (inset-y-1) and smooth in X */}
          <div
            className="absolute inset-y-1 rounded-lg bg-blue-600 shadow-sm shadow-blue-600/30 transition-all duration-300 ease-out pointer-events-none z-0"
            style={{
              left: pillLeft,
              width: 'calc((100% - 16px) / 3)',
            }}
          />

          {([300, 500, 1000] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setBufferRadius(r)}
              className={`relative z-10 py-1.5 px-1 flex items-center justify-center text-center text-[10.5px] font-bold rounded-lg transition-colors duration-200 cursor-pointer ${
                bufferRadius === r ? 'text-white' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              {r === 300
                ? t.parent.familyMap.radius300m
                : r === 500
                ? t.parent.familyMap.radius500m
                : t.parent.familyMap.radius1km}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Facilities in Buffer Header */}
      <div className="text-[11px] font-bold text-slate-800 pt-0.5">
        {t.parent.familyMap.facilitiesWithinDistance
          .replace('{dist}', currentRadiusLabels.dist)
          .replace('{time}', currentRadiusLabels.time)}
      </div>

      {/* 4 Pillars Stat Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Nurseries */}
        <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-blue-700 min-w-0">
            <Baby className="w-4 h-4 shrink-0 text-blue-600" />
            <span className="text-[11px] font-semibold leading-tight truncate">
              {language === 'pl'
                ? formatPolishPlural(bufferStats.nurseries, ['Żłobek / klub', 'Żłobki / kluby', 'Żłobków / klubów'])
                : t.parent.familyMap.nurseriesCount}
            </span>
          </div>
          <span className="text-xs font-black text-blue-900 shrink-0">
            {bufferStats.nurseries}
          </span>
        </div>

        {/* Kindergartens */}
        <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-amber-700 min-w-0">
            <Smile className="w-4 h-4 shrink-0 text-amber-600" />
            <span className="text-[11px] font-semibold leading-tight truncate">
              {language === 'pl'
                ? formatPolishPlural(bufferStats.kindergartens, ['Przedszkole', 'Przedszkola', 'Przedszkoli'])
                : t.parent.familyMap.kindergartensCount}
            </span>
          </div>
          <span className="text-xs font-black text-amber-900 shrink-0">
            {bufferStats.kindergartens}
          </span>
        </div>

        {/* Primary Schools */}
        <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-purple-700 min-w-0">
            <GraduationCap className="w-4 h-4 shrink-0 text-purple-600" />
            <span className="text-[11px] font-semibold leading-tight truncate">
              {language === 'pl'
                ? formatPolishPlural(bufferStats.schools, ['Szkoła podst.', 'Szkoły podst.', 'Szkół podst.'])
                : t.parent.familyMap.schoolsCount}
            </span>
          </div>
          <span className="text-xs font-black text-purple-900 shrink-0">
            {bufferStats.schools}
          </span>
        </div>

        {/* Parks */}
        <div className="p-2 rounded-xl bg-green-50/70 border border-green-200 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-green-700 min-w-0">
            <Trees className="w-4 h-4 shrink-0 text-green-600" />
            <span className="text-[11px] font-semibold leading-tight truncate">
              {language === 'pl'
                ? formatPolishPlural(bufferStats.parks, ['Park / zieleń', 'Parki / zieleń', 'Parków / zieleni'])
                : t.parent.familyMap.parksCount}
            </span>
          </div>
          <span className="text-xs font-black text-green-900 shrink-0">
            {bufferStats.parks}
          </span>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>{totalSummaryText}</span>
      </div>
    </div>
  );
}
