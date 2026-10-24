import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../types/contracts';
import { localizeDistrictName } from '../../utils/districtLocalization';
import type { ChildAgeCohort } from './FamilyAgeCohortSelector';
import { ForecastDetailsDrawer } from './childcare-forecast/ForecastDetailsDrawer';
import { ForecastGridView } from './childcare-forecast/ForecastGridView';
import { ForecastMacroCards } from './childcare-forecast/ForecastMacroCards';
import { ForecastTableView } from './childcare-forecast/ForecastTableView';
import { ForecastToolbar } from './childcare-forecast/ForecastToolbar';
import {
  calculateCityMacroStats,
  getDistrictCohortData,
} from './childcare-forecast/forecastCalculations';
import {
  getForecastFilterLabels,
  getMacroPillDescriptions,
  getMacroTitles,
} from '../../i18n/childcareForecastI18n';
import {
  getPageNumbers,
  ITEMS_PER_PAGE,
  type ForecastFilter,
  type ViewMode,
} from './childcare-forecast/types';

export interface ChildcareForecastSectionProps {
  districts: DistrictSummaryDto[];
  selectedCohort?: ChildAgeCohort;
  onSelectCohort?: (cohort: ChildAgeCohort) => void;
}

/// <summary>
/// Childcare and Education Balance Section orchestrator (Current State Demographics & Capacity).
/// Cleanly modularized into specialized subcomponents under childcare-forecast/ directory
/// with complete trilingual Polish, English, and Ukrainian localization.
/// </summary>
export function ChildcareForecastSection({
  districts,
  selectedCohort = 'all',
  onSelectCohort,
}: ChildcareForecastSectionProps) {
  const { language, t } = useTranslation();

  // Local cohort state synchronized with parent page prop
  const [activeCohort, setActiveCohort] = useState<ChildAgeCohort>(selectedCohort);

  useEffect(() => {
    setActiveCohort(selectedCohort);
  }, [selectedCohort]);

  const handleSelectCohort = (cohort: ChildAgeCohort) => {
    setActiveCohort(cohort);
    if (onSelectCohort) {
      onSelectCohort(cohort);
    }
  };

  // Full detailed metrics cache for all 18 districts
  const [detailsMap, setDetailsMap] = useState<Map<number, DistrictDetailsDto>>(new Map());
  const [_isLoading, setIsLoading] = useState<boolean>(true);

  // Active filter tab & presentation view mode (grid cards vs tabular rows)
  const [activeFilter, setActiveFilter] = useState<ForecastFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Currently focused district for deep-dive details card
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [activeDistrictData, setActiveDistrictData] = useState<DistrictDetailsDto | null>(null);

  // Ref to smooth-scroll details card into view
  const recommendationRef = useRef<HTMLDivElement>(null);

  // Load detailed metrics for all 18 districts from backend
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all(districts.map((d) => cracow360Api.getDistrictDetails(d.districtId)))
      .then((results) => {
        if (!cancelled) {
          const map = new Map<number, DistrictDetailsDto>();
          results.forEach((d) => map.set(d.districtId, d));
          setDetailsMap(map);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load district forecast details:', err);
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  // City-wide macro calculations
  const macroStats = useMemo(() => calculateCityMacroStats(detailsMap), [detailsMap]);
  const currentMacro = macroStats[activeCohort];
  const macroTitles = useMemo(() => getMacroTitles(activeCohort, language), [activeCohort, language]);
  const macroPillDescriptions = useMemo(
    () => getMacroPillDescriptions(activeCohort, language),
    [activeCohort, language]
  );
  const filterLabels = useMemo(
    () => getForecastFilterLabels(activeCohort, language),
    [activeCohort, language]
  );

  // Cohort-aware titles & subtitles
  const sectionTitle = t.parent.forecast.cohortTitles[activeCohort];
  const sectionSubtitle = t.parent.forecast.cohortSubtitles[activeCohort];

  // Helper to determine district status under active cohort
  const getDistrictStatus = (details: DistrictDetailsDto | undefined) => {
    return getDistrictCohortData(details, activeCohort, language).status;
  };

  // Filtered district list
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const details = detailsMap.get(d.districtId);
      const status = getDistrictStatus(details);

      if (activeFilter === 'whiteSpots') return status.isWhiteSpot;
      if (activeFilter === 'surplus') return status.isSurplus;
      if (activeFilter === 'balanced') return status.isBalanced;
      return true;
    });
  }, [districts, detailsMap, activeFilter, activeCohort, language]);

  const getFilterCount = (filterId: ForecastFilter): number => {
    if (filterId === 'all') return districts.length;
    return districts.filter((d) => {
      const details = detailsMap.get(d.districtId);
      const status = getDistrictStatus(details);
      if (filterId === 'whiteSpots') return status.isWhiteSpot;
      if (filterId === 'surplus') return status.isSurplus;
      if (filterId === 'balanced') return status.isBalanced;
      return false;
    }).length;
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDistricts = filteredDistricts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset pagination only when cohort or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCohort, activeFilter]);

  // Desynchronize drawer only if selected district is no longer visible under active filter
  useEffect(() => {
    if (selectedDistrictId !== null) {
      const isVisible = filteredDistricts.some((d) => d.districtId === selectedDistrictId);
      if (!isVisible) {
        setSelectedDistrictId(null);
      }
    }
  }, [filteredDistricts, selectedDistrictId]);

  // Handle district selection & optional smooth scroll (triggered on specific Details button click)
  const handleSelectDistrict = (districtId: number, shouldScroll = false) => {
    if (selectedDistrictId === districtId) {
      setSelectedDistrictId(null);
    } else {
      setSelectedDistrictId(districtId);
      if (shouldScroll) {
        setTimeout(() => {
          if (recommendationRef.current) {
            const rect = recommendationRef.current.getBoundingClientRect();
            const targetY = window.scrollY + rect.top - 80;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
        }, 120);
      }
    }
  };

  // Sync active district details for collapse animation
  const focusedDistrict = selectedDistrictId ? detailsMap.get(selectedDistrictId) ?? null : null;
  useEffect(() => {
    if (focusedDistrict) {
      setActiveDistrictData(focusedDistrict);
    }
  }, [focusedDistrict]);

  return (
    <>
      {/* 1. Main Forecast & Balance Card */}
      <section
        id="childcare-forecast-section"
        className="scroll-mt-20 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6"
      >
        <ForecastToolbar
          activeCohort={activeCohort}
          onSelectCohort={handleSelectCohort}
          sectionTitle={sectionTitle}
          sectionSubtitle={sectionSubtitle}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          getFilterCount={getFilterCount}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          cohortsDef={t.parent.cohorts}
          filterLabels={filterLabels}
          viewModeLabels={{
            grid: t.parent.forecast.viewGrid || 'Siatka',
            table: t.parent.forecast.viewTable || 'Tabela',
          }}
          switcherTitle={t.parent.forecast.switcherTitle}
        />

        <ForecastMacroCards
          currentMacro={currentMacro}
          macroTitles={macroTitles}
          macroPillDescriptions={macroPillDescriptions}
          placesUnit={t.parent.forecast.placesUnit}
        />

        {viewMode === 'grid' ? (
          <ForecastGridView
            districts={paginatedDistricts}
            detailsMap={detailsMap}
            activeCohort={activeCohort}
            activeFilter={activeFilter}
            currentPage={currentPage}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={handleSelectDistrict}
            language={language}
            localizeDistrictName={localizeDistrictName}
            whiteSpotBadge={t.parent.forecast.whiteSpotBadge}
            balancedBadge={t.parent.forecast.balancedBadge}
            surplusBadge={t.parent.forecast.surplusBadge}
            placesUnit={t.parent.forecast.placesUnit}
            closeCard={t.parent.forecast.closeCard}
            recommendationActionBtn={t.parent.forecast.recommendationActionBtn}
          />
        ) : (
          <ForecastTableView
            districts={paginatedDistricts}
            detailsMap={detailsMap}
            activeCohort={activeCohort}
            activeFilter={activeFilter}
            currentPage={currentPage}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={handleSelectDistrict}
            language={language}
            localizeDistrictName={localizeDistrictName}
            placesUnit={t.parent.forecast.placesUnit}
            closeCard={t.parent.forecast.closeCard}
            recommendationActionBtn={t.parent.forecast.recommendationActionBtn}
          />
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div>
              {t.parent.forecast.showingDistricts(
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
                <span>{t.parent.forecast.prevPage}</span>
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
                <span>{t.parent.forecast.nextPage}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Expanded Deep-Dive District Analytical Card */}
      <ForecastDetailsDrawer
        isOpen={Boolean(focusedDistrict)}
        activeDistrictData={activeDistrictData}
        activeCohort={activeCohort}
        onClose={() => setSelectedDistrictId(null)}
        language={language}
        localizeDistrictName={localizeDistrictName}
        recommendationRef={recommendationRef}
      />
    </>
  );
}
