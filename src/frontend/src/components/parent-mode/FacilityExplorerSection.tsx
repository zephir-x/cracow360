import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { cracow360Api } from '../../api/client';
import type {
  DistrictSummaryDto,
  PointOfInterestDto,
  PoiSubCategory,
} from '../../types/contracts';

export interface FacilityExplorerSectionProps {
  districts: DistrictSummaryDto[];
}

interface PoiFilterTab {
  id: string;
  label: string;
  subCategories?: PoiSubCategory[];
}

const POI_FILTER_TABS: PoiFilterTab[] = [
  { id: 'all', label: 'Wszystkie placówki' },
  { id: 'nursery_pub', label: 'Żłobki samorządowe', subCategories: ['NURSERY_PUBLIC'] },
  {
    id: 'nursery_priv',
    label: 'Żłobki niepubliczne i dotowane',
    subCategories: ['NURSERY_PRIVATE', 'NURSERY_CONTRACTED'],
  },
  { id: 'kids_club', label: 'Kluby dziecięce', subCategories: ['KIDS_CLUB'] },
  { id: 'parent_club', label: 'Kluby Rodziców', subCategories: ['PARENT_CLUB'] },
  { id: 'kindergarten', label: 'Przedszkola', subCategories: ['KINDERGARTEN'] },
  { id: 'school', label: 'Szkoły podstawowe', subCategories: ['PRIMARY_SCHOOL'] },
];

const POI_SUB_CATEGORY_LABELS: Record<string, string> = {
  NURSERY_PUBLIC: 'Żłobek samorządowy',
  NURSERY_CONTRACTED: 'Żłobek dotowany GMK',
  NURSERY_PRIVATE: 'Żłobek prywatny',
  KIDS_CLUB: 'Klub dziecięcy',
  PARENT_CLUB: 'Klub Rodziców',
  KINDERGARTEN: 'Przedszkole',
  PRIMARY_SCHOOL: 'Szkoła podstawowa',
  CITY_PARK: 'Park miejski',
  POCKET_PARK: 'Park kieszonkowy',
  LIBRARY: 'Filia biblioteki',
  SENIOR_CENTER: 'Centrum Seniora (CAS)',
  PARK_AND_RIDE: 'Parking P+R',
};

const ITEMS_PER_PAGE = 24;

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export function FacilityExplorerSection({ districts }: FacilityExplorerSectionProps) {
  const [pois, setPois] = useState<PointOfInterestDto[]>([]);
  const [loadingPois, setLoadingPois] = useState<boolean>(true);
  const [activeFilterId, setActiveFilterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Mapping from district ID to clean district name
  const districtNameMap = useMemo(() => {
    const map = new Map<number, string>();
    districts.forEach((d) => {
      const cleanName = d.districtName.replace(/^Dzielnica\s+[IVXLCDM]+\s+/i, '').trim();
      map.set(d.districtId, cleanName || d.districtName);
    });
    return map;
  }, [districts]);

  // Load real educational and childcare points of interest from backend API
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

  // Filter POIs based on selected subcategories and search term
  const filteredPois = useMemo(() => {
    const selectedTab = POI_FILTER_TABS.find((t) => t.id === activeFilterId);
    const q = searchQuery.toLowerCase().trim();

    return pois.filter((poi) => {
      const matchesSubCategory = selectedTab?.subCategories
        ? selectedTab.subCategories.includes(poi.subCategory)
        : true;

      const districtName = districtNameMap.get(poi.districtId) || '';
      const matchesSearch =
        !q ||
        poi.name.toLowerCase().includes(q) ||
        poi.address.toLowerCase().includes(q) ||
        districtName.toLowerCase().includes(q);

      return matchesSubCategory && matchesSearch;
    });
  }, [pois, activeFilterId, searchQuery, districtNameMap]);

  // Reset to first page whenever search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilterId, searchQuery]);

  // Total pages and sliced POIs for the current page
  const totalPages = Math.max(1, Math.ceil(filteredPois.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPois = useMemo(() => {
    return filteredPois.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPois, startIndex]);

  // Calculate facility counts for each filter tab
  const getTabCount = (tab: PoiFilterTab): number => {
    if (!tab.subCategories || tab.subCategories.length === 0) {
      return pois.length;
    }
    const subCats = tab.subCategories;
    return pois.filter((poi) => subCats.includes(poi.subCategory)).length;
  };

  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Eksplorator Placówek Opiekuńczo-Edukacyjnych
            </h2>
            <p className="text-xs text-slate-500">
              Zweryfikowane placówki z geolokalizacją ({pois.length} obiektów w rejestrze miejskim)
            </p>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Szukaj po nazwie, ulicy lub dzielnicy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {POI_FILTER_TABS.map((tab) => {
          const isActive = activeFilterId === tab.id;
          const count = getTabCount(tab);
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
              <span>{tab.label}</span>
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
        <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
          Wczytywanie bazy punktów POI z serwera...
        </div>
      ) : filteredPois.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 animate-fade-in">
          Nie znaleziono placówek spełniających wybrane kryteria wyszukiwania.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Keyed by search query, active filter and page so search typing animates with the exact same smooth fade-in */}
          <div
            key={`${activeFilterId}-${currentPage}-${searchQuery}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fade-in"
          >
            {paginatedPois.map((poi) => (
              <div
                key={poi.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 transition-colors flex flex-col justify-between gap-2.5 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 truncate">
                      {POI_SUB_CATEGORY_LABELS[poi.subCategory] || poi.subCategory}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md shrink-0">
                      {districtNameMap.get(poi.districtId) || `Dzielnica ${poi.districtId}`}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-2 leading-snug">
                    {poi.name}
                  </h4>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{poi.address || 'Kraków'}</span>
                  </div>
                  {poi.metrics?.additionalInfo && (
                    <div className="text-[10px] text-slate-400 truncate pl-5">
                      {poi.metrics.additionalInfo}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div>
                Wyświetlanie{' '}
                <span className="font-semibold text-slate-800">
                  {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredPois.length)}
                </span>{' '}
                z <span className="font-semibold text-slate-800">{filteredPois.length}</span> placówek
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Poprzednia
                </button>
                <div className="flex items-center gap-1">
                  {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                    typeof p === 'number' ? (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          currentPage === p
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ) : (
                      <span key={idx} className="px-1 text-slate-400">
                        …
                      </span>
                    )
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
                >
                  Następna
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
