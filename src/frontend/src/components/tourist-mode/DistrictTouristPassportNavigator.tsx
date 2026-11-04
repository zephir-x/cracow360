import React, { useMemo, useState } from 'react';
import {
  Train,
  Clock,
  Navigation,
  Landmark,
  Compass,
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { getTourismI18n, formatAttractionsCountLabel } from '../../i18n/modules';
import type {
  DistrictTouristPassportDto,
  TourismAttractionDto,
} from '../../types/contracts';

export interface DistrictTouristPassportNavigatorProps {
  passports: DistrictTouristPassportDto[];
  attractions?: TourismAttractionDto[];
  onSelectDistrictOnMap?: (districtId: number) => void;
}

const DISTRICT_NAMES_BY_ID: Record<number, string> = {
  1: 'I. Stare Miasto',
  2: 'II. Grzegórzki',
  3: 'III. Prądnik Czerwony',
  4: 'IV. Prądnik Biały',
  5: 'V. Krowodrza',
  6: 'VI. Bronowice',
  7: 'VII. Zwierzyniec',
  8: 'VIII. Dębniki',
  9: 'IX. Łagiewniki-Borek Fałęcki',
  10: 'X. Swoszowice',
  11: 'XI. Podgórze Duchackie',
  12: 'XII. Bieżanów-Prokocim',
  13: 'XIII. Podgórze',
  14: 'XIV. Czyżyny',
  15: 'XV. Mistrzejowice',
  16: 'XVI. Bieńczyce',
  17: 'XVII. Wzgórza Krzesławickie',
  18: 'XVIII. Nowa Huta',
};

export const DistrictTouristPassportNavigator: React.FC<DistrictTouristPassportNavigatorProps> = ({
  passports,
  attractions,
}) => {
  const { language } = useTranslation();
  const t = getTourismI18n(language);

  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(1);

  const activePassport =
    passports.find((p) => p.districtId === selectedDistrictId) ?? passports[0];

  // Resolve all attractions for the active district dynamically from catalog or passport
  const districtAttractions = useMemo(() => {
    if (attractions && attractions.length > 0 && activePassport) {
      const filtered = attractions.filter((a) => a.districtId === activePassport.districtId);
      if (filtered.length > 0) {
        return filtered.map((a) => ({
          id: a.id,
          name: a.name,
          category: a.category,
          crowdLevel: a.crowdLevel,
          estimatedVisitMinutes: a.estimatedVisitMinutes,
        }));
      }
    }
    return activePassport?.topAttractions ?? [];
  }, [attractions, activePassport]);

  const totalCount = districtAttractions.length > 0
    ? districtAttractions.length
    : (activePassport?.totalAttractionsCount ?? 0);

  return (
    <section
      id="district-passports-section"
      className="scroll-mt-20 rounded-3xl bg-white border border-blue-100 p-4 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5 sm:space-y-6"
    >
      {/* Section Header (Unified Official/Investor Style) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t.sections.passportsTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.sections.passportsSubtitle}
            </p>
          </div>
        </div>

        {/* District Selector Dropdown */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-xs font-bold text-slate-600 shrink-0 text-center sm:text-left">
            {t.passports.selectDistrict}
          </label>
          <select
            value={selectedDistrictId}
            onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
          >
            {passports.map((p) => (
              <option key={p.districtId} value={p.districtId}>
                {DISTRICT_NAMES_BY_ID[p.districtId] ?? p.districtName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active District Passport Content with smooth content enter animation on district change */}
      {activePassport && (
        <div key={selectedDistrictId} className="animate-content-enter space-y-5 sm:space-y-6">
          {/* Top Banner: Direct Transit Telemetry from Krakow Main Station */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-xl shadow-blue-950/10 border border-blue-400/30 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 sm:gap-5 text-center lg:text-left">
            <div className="space-y-1.5 flex flex-col items-center lg:items-start">
              <div className="text-xs font-semibold text-sky-200 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-300" />
                <span>{t.passports.transitDirectHeader}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black tracking-tight flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
                <span>{DISTRICT_NAMES_BY_ID[activePassport.districtId] ?? activePassport.districtName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25 backdrop-blur-md font-bold">
                  {totalCount} {formatAttractionsCountLabel(totalCount, language)}
                </span>
              </div>
            </div>

            {/* 3 Telemetry Cards Grid with Uniform Height & Clean Typography */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full lg:w-auto items-stretch">
              {/* Card 1: Travel Time */}
              <div className="px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center sm:items-start justify-between min-h-16 sm:min-h-19 sm:min-w-42.5 text-center sm:text-left">
                <div className="text-[10px] text-sky-200 uppercase tracking-wider font-semibold">
                  {t.passports.avgTransitTime}
                </div>
                <div className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 mt-1 leading-none">
                  <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>~{activePassport.transitTimeFromStationMinutes} min</span>
                </div>
              </div>

              {/* Card 2: Transit Network */}
              <div className="px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center sm:items-start justify-between min-h-16 sm:min-h-19 sm:min-w-43.75 text-center sm:text-left">
                <div className="text-[10px] text-sky-200 uppercase tracking-wider font-semibold">
                  {t.passports.transitNetwork}
                </div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-1 leading-none">
                  <Train className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>{t.passports.tramsAndBuses}</span>
                </div>
              </div>

              {/* Card 3: Distance from Center */}
              <div className="px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col items-center sm:items-start justify-between min-h-16 sm:min-h-19 sm:min-w-42.5 text-center sm:text-left">
                <div className="text-[10px] text-sky-200 uppercase tracking-wider font-semibold">
                  {t.passports.distanceFromStation}
                </div>
                <div className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 mt-1 leading-none">
                  <Compass className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>~{activePassport.distanceFromMainStationKm} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* District Highlights & Top Attractions */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-center sm:justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>{t.passports.districtHighlights}</span>
              </h3>
            </div>

            {districtAttractions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {districtAttractions.map((att) => {
                  const crowdBadge = t.crowd[att.crowdLevel as keyof typeof t.crowd] ?? t.crowd.MODERATE;
                  const categoryName = t.categories[att.category as keyof typeof t.categories] ?? att.category;

                  return (
                    <div
                      key={att.id}
                      className="p-3.5 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 hover:bg-white transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
                            {categoryName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${crowdBadge.color}`}>
                            {crowdBadge.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2">
                          {att.name}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{t.passports.visitTime} <strong className="text-slate-900">{att.estimatedVisitMinutes} {t.planner.minutesShort}</strong></span>
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600">
                          {DISTRICT_NAMES_BY_ID[activePassport.districtId] ?? activePassport.districtName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                {t.passports.noAttractionsYet}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
