import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import type {
  DistrictSummaryDto,
  PointOfInterestDto,
  PoiSubCategory,
} from '../../types/contracts';
import { localizePoiAdditionalInfo, localizePoiName } from '../../utils/poiLocalization';
import type { ChildAgeCohort } from './FamilyAgeCohortSelector';

export interface FacilityExplorerSectionProps {
  districts: DistrictSummaryDto[];
  selectedCohort?: ChildAgeCohort;
}

interface PoiFilterTabDef {
  id: string;
  subCategories?: PoiSubCategory[];
}

const POI_FILTER_TAB_DEFS: PoiFilterTabDef[] = [
  { id: 'all' },
  { id: 'nursery_pub', subCategories: ['NURSERY_PUBLIC'] },
  { id: 'nursery_priv', subCategories: ['NURSERY_PRIVATE', 'NURSERY_CONTRACTED'] },
  { id: 'kids_club', subCategories: ['KIDS_CLUB'] },
  { id: 'parent_club', subCategories: ['PARENT_CLUB'] },
  { id: 'kindergarten', subCategories: ['KINDERGARTEN'] },
  { id: 'school', subCategories: ['PRIMARY_SCHOOL'] },
];

const ITEMS_PER_PAGE = 9;

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage, '...', totalPages];
}

/// <summary>
/// Verified municipal care and education points of interest explorer with live search and pagination.
/// Strictly filters to ~600 EDU_CARE facilities across municipal nurseries, subsidized, private, clubs,
/// kindergartens, and primary schools, seamlessly synchronized with the active child age cohort.
/// </summary>
export function FacilityExplorerSection({
  districts,
  selectedCohort = 'all',
}: FacilityExplorerSectionProps) {
  const { t, language, formatWithPlural, localizeDistrictName } = useTranslation();

  const [pois, setPois] = useState<PointOfInterestDto[]>([]);
  const [loadingPois, setLoadingPois] = useState<boolean>(true);
  const [activeFilterId, setActiveFilterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Automatically synchronize facility filter tab with the selected child age cohort
  useEffect(() => {
    if (!selectedCohort || selectedCohort === 'all') {
      setActiveFilterId('all');
    } else if (selectedCohort === 'infant') {
      setActiveFilterId('nursery_pub');
    } else if (selectedCohort === 'preschool') {
      setActiveFilterId('kindergarten');
    } else if (selectedCohort === 'school') {
      setActiveFilterId('school');
    }
    setCurrentPage(1);
  }, [selectedCohort]);

  // Load only educational and childcare municipal POIs from backend once on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingPois(true);
    cracow360Api
      .getPois({ category: 'EDU_CARE' })
      .then((data) => {
        if (!cancelled) {
          setPois(data);
          setLoadingPois(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingPois(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const districtNameMap = useMemo(() => {
    const map = new Map<number, string>();
    districts.forEach((d) => map.set(d.districtId, d.districtName));
    return map;
  }, [districts]);

  // Compute count for each filter tab based on loaded educational POIs
  const getTabCount = (tab: PoiFilterTabDef): number => {
    if (tab.id === 'all') return pois.length;
    if (!tab.subCategories) return 0;
    return pois.filter((poi) => tab.subCategories!.includes(poi.subCategory)).length;
  };

  // Filter POIs by category and live search query
  const filteredPois = useMemo(() => {
    const currentTab = POI_FILTER_TAB_DEFS.find((tDef) => tDef.id === activeFilterId);
    const query = searchQuery.trim().toLowerCase();

    return pois.filter((poi) => {
      // Category subfilter
      if (currentTab && currentTab.subCategories && currentTab.subCategories.length > 0) {
        if (!currentTab.subCategories.includes(poi.subCategory)) {
          return false;
        }
      }

      // Text query match: raw name, localized name, address, or district name
      if (query !== '') {
        const rawNameMatch = poi.name.toLowerCase().includes(query);
        const locNameMatch = localizePoiName(poi.name, language).toLowerCase().includes(query);
        const addressMatch = (poi.address ?? '').toLowerCase().includes(query);
        const districtName = (districtNameMap.get(poi.districtId) ?? '').toLowerCase();
        const localizedDistName = localizeDistrictName(districtNameMap.get(poi.districtId) ?? '').toLowerCase();
        const districtMatch = districtName.includes(query) || localizedDistName.includes(query);

        if (!rawNameMatch && !locNameMatch && !addressMatch && !districtMatch) {
          return false;
        }
      }

      return true;
    });
  }, [pois, activeFilterId, searchQuery, districtNameMap, language, localizeDistrictName]);

  // Reset to first page when changing search query or category filter
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilterId, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPois.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPois = filteredPois.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {t.parent.explorer.title}
            </h2>
            <p className="text-xs text-slate-500">
              {t.parent.explorer.subtitlePrefix}
            </p>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t.parent.explorer.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {POI_FILTER_TAB_DEFS.map((tab) => {
          const isActive = activeFilterId === tab.id;
          const count = getTabCount(tab);
          const tabLabel = t.parent.explorer.tabs[tab.id] || tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilterId(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tabLabel}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* POI List / Cards */}
      {loadingPois ? (
        <div className="py-16 text-center text-xs font-semibold text-slate-400 animate-pulse">
          {t.parent.explorer.loading}
        </div>
      ) : filteredPois.length === 0 ? (
        <div className="py-14 text-center text-xs font-medium text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
          {t.parent.explorer.empty}
        </div>
      ) : (
        <div className="space-y-4">
          <div
            key={`${activeFilterId}-${searchQuery}-${currentPage}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-content-enter"
          >
            {paginatedPois.map((poi) => {
              const localizedSubCategory =
                t.parent.explorer.subCategories[poi.subCategory] || poi.subCategory;
              const rawDistrictName =
                districtNameMap.get(poi.districtId) || `Dzielnica ${poi.districtId}`;
              const localizedDistrict = localizeDistrictName(rawDistrictName);
              const localizedName = localizePoiName(poi.name, language);
              const localizedInfo = localizePoiAdditionalInfo(
                poi.metrics?.additionalInfo,
                poi.metrics?.capacity,
                t,
                language
              );

              return (
                <div
                  key={poi.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 transition-colors flex flex-col justify-between gap-2.5 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 truncate">
                        {localizedSubCategory}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md shrink-0">
                        {localizedDistrict}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-2 leading-snug">
                      {localizedName}
                    </h4>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{poi.address || 'Kraków'}</span>
                    </div>
                    {localizedInfo && (
                      <div className="text-[10px] text-slate-500 truncate pl-5">
                        {localizedInfo}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t.parent.explorer.showing}{' '}
                <span className="font-semibold text-slate-800">
                  {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredPois.length)}
                </span>{' '}
                {t.parent.explorer.of}{' '}
                <span className="font-semibold text-slate-800">
                  {formatWithPlural(filteredPois.length, t.parent.explorer.facilityPlural)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {t.parent.explorer.prev}
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
                  {t.parent.explorer.next}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
