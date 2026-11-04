import {
  Baby,
  Bike,
  BookOpen,
  Building2,
  Bus,
  Dumbbell,
  Flower2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  LayoutGrid,
  ParkingSquare,
  School,
  Sliders,
  TrainFront,
  Trees,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type {
  InvestorSimulatorLabels,
  LeverItemLabels,
} from '../../../i18n/modules';
import type { SimulatorImpactMetrics, SimulatorLeversState } from './types';

export interface SimulatorLeversPanelProps {
  levers: SimulatorLeversState;
  onChangeLever: (
    key: keyof SimulatorLeversState,
    value: number,
    immediate?: boolean
  ) => void;
  impact: SimulatorImpactMetrics;
  labels: InvestorSimulatorLabels;
}

type CategoryFilter = 'all' | 'education' | 'mobility' | 'greenery' | 'culture';

interface LeverRowConfig {
  key: keyof SimulatorLeversState;
  max: number;
  icon: React.ReactNode;
  itemLabels: LeverItemLabels;
  baselineValue: string;
  accentColor: 'indigo' | 'emerald' | 'sky' | 'amber';
}

export function SimulatorLeversPanel({
  levers,
  onChangeLever,
  impact,
  labels,
}: SimulatorLeversPanelProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const eduAddedCount = Math.round(
    levers.addedNurseries +
      levers.addedKindergartens +
      levers.addedPrimarySchools +
      levers.addedParentClubs
  );

  const mobilityAddedCount = Math.round(
    levers.addedBusStops +
      levers.addedTramStops +
      levers.addedBikeLanesKm +
      levers.addedParkAndRide
  );

  const greenAddedCount = Math.round(
    levers.addedPocketParks + levers.addedCityParks + levers.addedSchoolSports
  );

  const cultureAddedCount = Math.round(
    levers.addedCasCenters + levers.addedLibraries + levers.addedCulturalCenters
  );

  const educationRows: LeverRowConfig[] = [
    {
      key: 'addedNurseries',
      max: 10,
      icon: <Baby className="w-4 h-4 text-indigo-600" />,
      itemLabels: labels.levers.nurseries,
      baselineValue: `${impact.nurseryPlacesBefore}`,
      accentColor: 'indigo',
    },
    {
      key: 'addedKindergartens',
      max: 10,
      icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
      itemLabels: labels.levers.kindergartens,
      baselineValue: `${impact.kindergartenPlacesBefore}`,
      accentColor: 'indigo',
    },
    {
      key: 'addedPrimarySchools',
      max: 5,
      icon: <School className="w-4 h-4 text-indigo-600" />,
      itemLabels: labels.levers.primarySchools,
      baselineValue: `${impact.schoolPlacesBefore} (${impact.avgClassSizeBefore.toFixed(1)} / kl.)`,
      accentColor: 'indigo',
    },
    {
      key: 'addedParentClubs',
      max: 10,
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      itemLabels: labels.levers.parentClubs,
      baselineValue: `${impact.parentClubsBefore}`,
      accentColor: 'indigo',
    },
  ];

  const mobilityRows: LeverRowConfig[] = [
    {
      key: 'addedBusStops',
      max: 15,
      icon: <Bus className="w-4 h-4 text-sky-600" />,
      itemLabels: labels.levers.busStops,
      baselineValue: `${impact.busStopsBefore} (${impact.isochroneBeforePct.toFixed(1)}% 500m)`,
      accentColor: 'sky',
    },
    {
      key: 'addedTramStops',
      max: 10,
      icon: <TrainFront className="w-4 h-4 text-sky-600" />,
      itemLabels: labels.levers.tramStops,
      baselineValue: `${impact.tramStopsBefore}`,
      accentColor: 'sky',
    },
    {
      key: 'addedBikeLanesKm',
      max: 15,
      icon: <Bike className="w-4 h-4 text-sky-600" />,
      itemLabels: labels.levers.bikeLanesKm,
      baselineValue: `${impact.bikeLanesKmBefore.toFixed(1)} km`,
      accentColor: 'sky',
    },
    {
      key: 'addedParkAndRide',
      max: 5,
      icon: <ParkingSquare className="w-4 h-4 text-sky-600" />,
      itemLabels: labels.levers.parkAndRide,
      baselineValue: `${impact.parkAndRideBefore} P+R (${impact.bikeRacksBefore} stoj.)`,
      accentColor: 'sky',
    },
  ];

  const greeneryRows: LeverRowConfig[] = [
    {
      key: 'addedPocketParks',
      max: 15,
      icon: <Flower2 className="w-4 h-4 text-emerald-600" />,
      itemLabels: labels.levers.pocketParks,
      baselineValue: `${impact.pocketParksBefore}`,
      accentColor: 'emerald',
    },
    {
      key: 'addedCityParks',
      max: 5,
      icon: <Trees className="w-4 h-4 text-emerald-600" />,
      itemLabels: labels.levers.cityParks,
      baselineValue: `${impact.cityParksBefore} (${impact.greenM2PerCapitaBefore.toFixed(1)} m²/os.)`,
      accentColor: 'emerald',
    },
    {
      key: 'addedSchoolSports',
      max: 10,
      icon: <Dumbbell className="w-4 h-4 text-emerald-600" />,
      itemLabels: labels.levers.schoolSports,
      baselineValue: `${impact.sportsFacilitiesBefore}`,
      accentColor: 'emerald',
    },
  ];

  const cultureRows: LeverRowConfig[] = [
    {
      key: 'addedCasCenters',
      max: 10,
      icon: <HeartHandshake className="w-4 h-4 text-amber-600" />,
      itemLabels: labels.levers.casCenters,
      baselineValue: `${impact.casCountBefore} (${impact.seniorsPerCasBefore} os./CAS)`,
      accentColor: 'amber',
    },
    {
      key: 'addedLibraries',
      max: 8,
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      itemLabels: labels.levers.libraries,
      baselineValue: `${impact.librariesBefore}`,
      accentColor: 'amber',
    },
    {
      key: 'addedCulturalCenters',
      max: 5,
      icon: <Landmark className="w-4 h-4 text-amber-600" />,
      itemLabels: labels.levers.culturalCenters,
      baselineValue: `${impact.culturalCentersBefore}`,
      accentColor: 'amber',
    },
  ];

  const renderLeverRow = (row: LeverRowConfig) => {
    const val = levers[row.key];
    const roundedVal = Math.round(val);
    const isChanged = roundedVal > 0;

    const badgeTheme =
      row.accentColor === 'indigo'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
        : row.accentColor === 'emerald'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
          : row.accentColor === 'sky'
            ? 'bg-sky-50 text-sky-700 border-sky-200/80'
            : 'bg-amber-50 text-amber-700 border-amber-200/80';

    const activeBorderTheme =
      row.accentColor === 'indigo'
        ? 'border-indigo-300 bg-indigo-50/25'
        : row.accentColor === 'emerald'
          ? 'border-emerald-300 bg-emerald-50/25'
          : row.accentColor === 'sky'
            ? 'border-sky-300 bg-sky-50/25'
            : 'border-amber-300 bg-amber-50/25';

    const sliderAccent =
      row.accentColor === 'indigo'
        ? 'accent-indigo-600'
        : row.accentColor === 'emerald'
          ? 'accent-emerald-600'
          : row.accentColor === 'sky'
            ? 'accent-sky-600'
            : 'accent-amber-600';

    return (
      <div
        key={row.key}
        className={`p-3.5 rounded-2xl border transition-all duration-300 space-y-2.5 ${
          isChanged
            ? `${activeBorderTheme} shadow-2xs`
            : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
        }`}
      >
        {/* Top Row: Icon + Title & Subtitle on Left, Current Value Badge on Right */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              {row.icon}
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight block">
                {row.itemLabels.title}
              </span>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                {row.itemLabels.subtitle}
              </p>
            </div>
          </div>

          {/* Current Lever Value Badge */}
          <div className="shrink-0 pt-0.5">
            {isChanged ? (
              <button
                type="button"
                onClick={() => onChangeLever(row.key, 0, false)}
                title="Kliknij, aby wyzerować"
                className="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tabular-nums shadow-xs transition cursor-pointer active:scale-95"
              >
                +{roundedVal}
              </button>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 text-slate-400 text-xs font-bold tabular-nums shadow-2xs">
                0
              </span>
            )}
          </div>
        </div>

        {/* Middle Row: Unit Effect & Current Baseline Badges */}
        <div className="flex flex-wrap items-center gap-2 pl-0.5 text-[11px]">
          <span className={`px-2 py-0.5 rounded-md border font-bold ${badgeTheme}`}>
            {row.itemLabels.unitEffect}
          </span>
          <span className="text-slate-500 font-medium tabular-nums">
            {row.itemLabels.currentBaselinePrefix}{' '}
            <strong className="text-slate-700">{row.baselineValue}</strong>
          </span>
        </div>

        {/* Range Slider with 0 and max bounds */}
        <div className="pt-1 flex items-center gap-2.5">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 tabular-nums">
            0
          </span>
          <input
            type="range"
            min={0}
            max={row.max}
            step={0.01}
            value={val}
            aria-label={row.itemLabels.title}
            onChange={(e) =>
              onChangeLever(row.key, Math.round(Number(e.target.value)), true)
            }
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${sliderAccent}`}
          />
          <span className="text-[11px] font-bold text-slate-500 shrink-0 tabular-nums">
            +{row.max}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Symmetrical Category Filter Pills */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3.5 shadow-2xs">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{labels.leversPanelTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{labels.leversPanelSubtitle}</p>
        </div>

        {/* Symmetrical 5-Column Category Filter Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {/* 0. All Categories */}
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{labels.categoryFilterAll}</span>
          </button>

          {/* 1. Education & Family Care (4 sliders) */}
          <button
            type="button"
            onClick={() => setActiveCategory('education')}
            className={`shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeCategory === 'education'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-indigo-700 border-indigo-200/80 hover:border-indigo-300 hover:bg-indigo-50/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{labels.categories.education.title.split(' (')[0]}</span>
            {eduAddedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-700 text-white text-[10px] shrink-0 tabular-nums">
                +{eduAddedCount}
              </span>
            )}
          </button>

          {/* 2. Public Transit (KMK) & Cycling (4 sliders) */}
          <button
            type="button"
            onClick={() => setActiveCategory('mobility')}
            className={`shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeCategory === 'mobility'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white text-sky-700 border-sky-200/80 hover:border-sky-300 hover:bg-sky-50/60'
            }`}
          >
            <Bus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{labels.categories.mobility.title.split(' (')[0]}</span>
            {mobilityAddedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-sky-700 text-white text-[10px] shrink-0 tabular-nums">
                +{mobilityAddedCount}
              </span>
            )}
          </button>

          {/* 3. Greenery, Parks & Sports (3 sliders) */}
          <button
            type="button"
            onClick={() => setActiveCategory('greenery')}
            className={`shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeCategory === 'greenery'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-emerald-700 border-emerald-200/80 hover:border-emerald-300 hover:bg-emerald-50/60'
            }`}
          >
            <Trees className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{labels.categories.greenery.title.split(',')[0]}</span>
            {greenAddedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px] shrink-0 tabular-nums">
                +{greenAddedCount}
              </span>
            )}
          </button>

          {/* 4. Senior Support (65+) & Culture (3 sliders) */}
          <button
            type="button"
            onClick={() => setActiveCategory('culture')}
            className={`shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border ${
              activeCategory === 'culture'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-amber-700 border-amber-200/80 hover:border-amber-300 hover:bg-amber-50/60'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{labels.categories.culture.title.split(' (')[0]}</span>
            {cultureAddedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-700 text-white text-[10px] shrink-0 tabular-nums">
                +{cultureAddedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Cards Grid with blur + opacity + scale entrance transition (animate-fade-in) */}
      <div
        key={`sim_cat_${activeCategory}_${impact.districtId}`}
        className={`grid grid-cols-1 ${
          activeCategory === 'all' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
        } gap-4 items-start animate-fade-in`}
      >
        {/* 1. Education & Family Care (4 sliders - Row 1 Left) */}
        {(activeCategory === 'all' || activeCategory === 'education') && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {labels.categories.education.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {labels.categories.education.subtitle}
                  </p>
                </div>
              </div>
              {eduAddedCount > 0 && (
                <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-xs font-black tabular-nums">
                  +{eduAddedCount}
                </span>
              )}
            </div>
            <div className="space-y-2.5">{educationRows.map(renderLeverRow)}</div>
          </div>
        )}

        {/* 2. Public Transit (KMK) & Cycling (4 sliders - Row 1 Right) */}
        {(activeCategory === 'all' || activeCategory === 'mobility') && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-600 flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {labels.categories.mobility.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {labels.categories.mobility.subtitle}
                  </p>
                </div>
              </div>
              {mobilityAddedCount > 0 && (
                <span className="px-2.5 py-1 rounded-xl bg-sky-600 text-white text-xs font-black tabular-nums">
                  +{mobilityAddedCount}
                </span>
              )}
            </div>
            <div className="space-y-2.5">{mobilityRows.map(renderLeverRow)}</div>
          </div>
        )}

        {/* 3. Greenery, Parks & Sports (3 sliders - Row 2 Left) */}
        {(activeCategory === 'all' || activeCategory === 'greenery') && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {labels.categories.greenery.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {labels.categories.greenery.subtitle}
                  </p>
                </div>
              </div>
              {greenAddedCount > 0 && (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black tabular-nums">
                  +{greenAddedCount}
                </span>
              )}
            </div>
            <div className="space-y-2.5">{greeneryRows.map(renderLeverRow)}</div>
          </div>
        )}

        {/* 4. Senior Support (65+) & Culture (3 sliders - Row 2 Right) */}
        {(activeCategory === 'all' || activeCategory === 'culture') && (
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {labels.categories.culture.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {labels.categories.culture.subtitle}
                  </p>
                </div>
              </div>
              {cultureAddedCount > 0 && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-600 text-white text-xs font-black tabular-nums">
                  +{cultureAddedCount}
                </span>
              )}
            </div>
            <div className="space-y-2.5">{cultureRows.map(renderLeverRow)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
