import { useMemo, useRef, useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';
import { getInvestorForecastLabels } from '../../../i18n/modules';
import { cracow360Api } from '../../../api/client';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import { localizeDistrictName } from '../../../utils/districtLocalization';
import { getPageNumbers } from '../../parent-mode/childcare-forecast/types';
import { InvestorDistrictCard } from './InvestorDistrictCard';
import { InvestorForecastDrawer } from './InvestorForecastDrawer';
import { InvestorForecastMacroCards } from './InvestorForecastMacroCards';
import {
  calculateInvestorMacro2028,
  mapDistrictForecastData,
} from './investorCalculations';
import type {
  InvestorB2BFilter,
  InvestorDistrictForecastData,
} from './types';

export interface InvestorForecastSectionProps {
  districts: DistrictSummaryDto[];
}

const ITEMS_PER_PAGE = 6;

export function InvestorForecastSection({ districts }: InvestorForecastSectionProps) {
  const { language } = useTranslation();
  const labels = useMemo(() => getInvestorForecastLabels(language), [language]);
  const drawerRef = useRef<HTMLDivElement>(null);

  // District details map cache
  const [detailsMap, setDetailsMap] = useState<Map<number, DistrictDetailsDto>>(new Map());
  const [_isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & pagination
  const [activeFilter, setActiveFilter] = useState<InvestorB2BFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected district for deep-dive drawer outside the card
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [activeDistrictData, setActiveDistrictData] = useState<InvestorDistrictForecastData | null>(null);

  // Fetch full details
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all(districts.map((d: DistrictSummaryDto) => cracow360Api.getDistrictDetails(d.districtId)))
      .then((results) => {
        if (!cancelled) {
          const map = new Map<number, DistrictDetailsDto>();
          results.forEach((d: DistrictDetailsDto) => map.set(d.districtId, d));
          setDetailsMap(map);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load district forecast details for investor mode:', err);
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  // Macro indicators
  const macro = useMemo(() => {
    const list = Array.from(detailsMap.values());
    return calculateInvestorMacro2028(list);
  }, [detailsMap]);

  // District forecast list
  const districtForecastList: InvestorDistrictForecastData[] = useMemo(() => {
    return districts
      .map((d) => {
        const detail = detailsMap.get(d.districtId);
        if (!detail) return null;
        return mapDistrictForecastData(detail, language);
      })
      .filter((item): item is InvestorDistrictForecastData => item !== null);
  }, [districts, detailsMap, language]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    if (activeFilter === 'all') return districtForecastList;
    return districtForecastList.filter(
      (d) => d.nurseryPotentialB2B.toLowerCase() === activeFilter
    );
  }, [districtForecastList, activeFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Desynchronize drawer only if selected district is no longer visible under active filter
  useEffect(() => {
    if (selectedDistrictId !== null) {
      const isVisible = filteredDistricts.some((d) => d.districtId === selectedDistrictId);
      if (!isVisible) {
        setSelectedDistrictId(null);
      }
    }
  }, [filteredDistricts, selectedDistrictId]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDistricts = useMemo(() => {
    return filteredDistricts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDistricts, startIndex]);

  // Maintain active district data to prevent abrupt unmounting during close transition
  const focusedDistrict = useMemo(() => {
    if (selectedDistrictId === null) return null;
    return districtForecastList.find((d) => d.districtId === selectedDistrictId) ?? null;
  }, [selectedDistrictId, districtForecastList]);

  useEffect(() => {
    if (focusedDistrict) {
      setActiveDistrictData(focusedDistrict);
    }
  }, [focusedDistrict]);

  const handleToggleSelect = (districtId: number) => {
    if (selectedDistrictId === districtId) {
      setSelectedDistrictId(null);
    } else {
      setSelectedDistrictId(districtId);
      setTimeout(() => {
        if (drawerRef.current) {
          const rect = drawerRef.current.getBoundingClientRect();
          const targetY = window.scrollY + rect.top - 80;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 120);
    }
  };

  // Counts for filter pills
  const counts = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;
    districtForecastList.forEach((d) => {
      if (d.nurseryPotentialB2B === 'HIGH') high++;
      else if (d.nurseryPotentialB2B === 'MEDIUM') medium++;
      else low++;
    });
    return {
      all: districtForecastList.length,
      high,
      medium,
      low,
    };
  }, [districtForecastList]);

  return (
    <>
      {/* 1. Main 2028 Forecast & B2B/B2G Investment Section */}
      <section
        id="investor-forecast-section"
        className="rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-md shadow-xs p-6 sm:p-8 space-y-6 text-slate-900 transition-all scroll-mt-20"
      >
        {/* Section Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            {labels.badgeSection}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {labels.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-4xl leading-relaxed">
            {labels.sectionSubtitle}
          </p>
        </div>

        {/* 4 Macro Cards */}
        <InvestorForecastMacroCards macro={macro} labels={labels} />

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {labels.filterAll}
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('high')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeFilter === 'high'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200/60'
            }`}
          >
            {labels.filterHigh}
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'high' ? 'bg-white/20 text-white' : 'bg-violet-200/80 text-violet-800'
              }`}
            >
              {counts.high}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('medium')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeFilter === 'medium'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60'
            }`}
          >
            {labels.filterMedium}
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'medium' ? 'bg-white/20 text-white' : 'bg-sky-200/80 text-sky-800'
              }`}
            >
              {counts.medium}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('low')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeFilter === 'low'
                ? 'bg-slate-700 text-white shadow-sm shadow-slate-700/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {labels.filterLow}
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === 'low' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.low}
            </span>
          </button>
        </div>

        {/* Grid of District Cards with Parent-mode identical pagination fade-in animation */}
        <div
          key={`investor_grid_${activeFilter}_${currentPage}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in"
        >
          {paginatedDistricts.map((district) => (
            <InvestorDistrictCard
              key={district.districtId}
              data={district}
              labels={labels}
              isSelected={selectedDistrictId === district.districtId}
              onToggleSelect={() => handleToggleSelect(district.districtId)}
              localizedName={localizeDistrictName(district.districtName, language)}
            />
          ))}
        </div>

        {/* Pagination Controls – Identical Layout & Styling to Parent Mode */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div>
              {labels.showingDistricts(
                filteredDistricts.length > 0 ? startIndex + 1 : 0,
                Math.min(startIndex + ITEMS_PER_PAGE, filteredDistricts.length),
                filteredDistricts.length
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{labels.prevPage}</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                  typeof p === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        currentPage === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-slate-400">
                      {p}
                    </span>
                  )
                )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
              >
                <span>{labels.nextPage}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Expandable Deep-Dive Drawer for Strategic Decision Support */}
      <InvestorForecastDrawer
        isOpen={Boolean(focusedDistrict)}
        data={activeDistrictData}
        labels={labels}
        localizedName={
          activeDistrictData
            ? localizeDistrictName(activeDistrictData.districtName, language)
            : ''
        }
        language={language}
        onClose={() => setSelectedDistrictId(null)}
        drawerRef={drawerRef}
      />
    </>
  );
}
