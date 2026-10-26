import {
  ArrowDownRight,
  Building,
  Building2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  LineChart,
  Sliders,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import { getInvestorForecastLabels } from '../../i18n/investorForecastI18n';
import type { DistrictSummaryDto } from '../../types/contracts';
import { mapDistrictForecastData } from './forecast-2028/investorCalculations';
import { InvestorCapabilitiesGrid } from './InvestorCapabilitiesGrid';

export interface InvestorHeroHeaderProps {
  districts?: DistrictSummaryDto[];
  onBackToResidentMode?: () => void;
}

export function InvestorHeroHeader({ districts }: InvestorHeroHeaderProps) {
  const { language, t } = useTranslation();
  const labels = useMemo(() => getInvestorForecastLabels(language), [language]);
  const [showCapabilities, setShowCapabilities] = useState<boolean>(false);

  // Dynamic statistics for official & investor mode (0 / '—' when database is disconnected)
  const [seniorsTotal, setSeniorsTotal] = useState<number>(0);
  const [seniorsSharePct, setSeniorsSharePct] = useState<number>(0);
  const [totalEduCarePlaces, setTotalEduCarePlaces] = useState<number>(0);
  const [schoolsSharePct, setSchoolsSharePct] = useState<number>(0);
  const [avgPriceM2, setAvgPriceM2] = useState<number>(0);
  const [b2bHotspotsCount, setB2bHotspotsCount] = useState<number>(0);
  const [b2bHotspotDistrictsStr, setB2bHotspotDistrictsStr] = useState<string>('—');

  useEffect(() => {
    let cancelled = false;
    if (!districts || districts.length === 0) {
      setSeniorsTotal(0);
      setSeniorsSharePct(0);
      setTotalEduCarePlaces(0);
      setSchoolsSharePct(0);
      setAvgPriceM2(0);
      setB2bHotspotsCount(0);
      setB2bHotspotDistrictsStr('—');
      return;
    }

    Promise.all(districts.map((d) => cracow360Api.getDistrictDetails(d.districtId)))
      .then((detailsList) => {
        if (cancelled) return;
        let sumSeniors = 0;
        let sumPopulation = 0;
        let sumCarePlaces = 0;
        let sumKinderPlaces = 0;
        let sumSchoolCapacity = 0;
        let sumPrice = 0;
        let priceCount = 0;
        const highRomans: string[] = [];

        detailsList.forEach((d) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dem = d.demographics as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hst = d.housingMarket as any;
          const mappedForecast = mapDistrictForecastData(d, 'pl');

          const seniors = dem?.age65Plus ?? dem?.age65plus ?? dem?.seniors65Plus ?? 0;
          const pop = dem?.totalPopulation ?? 0;
          sumSeniors += seniors;
          sumPopulation += pop;

          sumCarePlaces += mappedForecast.carePlaces0to3;
          sumKinderPlaces += mappedForecast.kindergartenPlacesTotal;
          sumSchoolCapacity += mappedForecast.primarySchoolStudentsTotal;

          const avgPrice = hst?.avgPricePerM2 ?? 0;
          if (avgPrice > 0) {
            sumPrice += avgPrice;
            priceCount++;
          }

          if (mappedForecast.nurseryPotentialB2B === 'HIGH') {
            highRomans.push(d.districtRoman);
          }
        });

        const totalPlaces = sumCarePlaces + sumKinderPlaces + sumSchoolCapacity;

        setSeniorsTotal(sumSeniors);
        setSeniorsSharePct(
          sumPopulation > 0 ? Number(((sumSeniors / sumPopulation) * 100).toFixed(1)) : 0
        );
        setTotalEduCarePlaces(totalPlaces);
        setSchoolsSharePct(
          totalPlaces > 0 ? Math.round((sumSchoolCapacity / totalPlaces) * 100) : 0
        );
        setAvgPriceM2(priceCount > 0 ? Math.round(sumPrice / priceCount) : 0);
        setB2bHotspotsCount(highRomans.length);
        setB2bHotspotDistrictsStr(highRomans.length > 0 ? highRomans.join(', ') : '—');
      })
      .catch((err) => {
        console.error('Failed to calculate investor hero dynamic stats:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  const seniorsFormatted = useMemo(() => {
    if (seniorsTotal <= 0) return '0';
    const inThousands = (seniorsTotal / 1000).toFixed(1);
    if (language === 'en') return `${inThousands}k`;
    if (language === 'ua') return `${inThousands} тис.`;
    return `${inThousands} tys.`;
  }, [seniorsTotal, language]);

  const eduPlacesFormatted = useMemo(() => {
    if (totalEduCarePlaces <= 0) return '0';
    const inThousands = (totalEduCarePlaces / 1000).toFixed(1);
    if (language === 'en') return `${inThousands}k`;
    if (language === 'ua') return `${inThousands} тис.`;
    return `${inThousands} tys.`;
  }, [totalEduCarePlaces, language]);

  const scrollToRanking = () => {
    document.getElementById('investor-ranking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForecast = () => {
    const target =
      document.getElementById('investor-forecast-section') ||
      document.getElementById('forecast-2028');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSimulator = () => {
    document.getElementById('investor-simulator-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Banner – Unified Kraków Blue & Royal Indigo palette matching all other subpages */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-2xl shadow-blue-950/15 border border-blue-400/30">
        {/* Animated Background Vector Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

          {/* Econometric & Civic Infrastructure Vector Shapes (Positioned gracefully in upper half) */}
          <svg
            className="absolute right-0 top-0 h-[68%] w-full lg:w-6/12 opacity-30 pointer-events-none select-none"
            viewBox="0 0 600 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Econometric Forecast Growth Curve */}
            <path
              d="M 50 310 C 180 280, 260 220, 360 160 S 480 80, 560 30"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Stylized Modern Civic Towers / Facilities */}
            <rect x="420" y="120" width="40" height="190" rx="4" stroke="#ffffff" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.06" />
            <rect x="480" y="70" width="48" height="240" rx="4" stroke="#93c5fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.12" />
            <rect x="545" y="140" width="36" height="170" rx="4" stroke="#ffffff" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.06" />
            {/* Grid Horizon Lines */}
            <line x1="50" y1="310" x2="580" y2="310" stroke="#bae6fd" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="50" y1="240" x2="580" y2="240" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.2" />
            <line x1="50" y1="170" x2="580" y2="170" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.2" />
          </svg>
        </div>

        {/* Foreground Content stretching full container width */}
        <div className="relative z-10 px-6 sm:px-10 pt-8 sm:pt-10 pb-8 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Building2 className="w-4 h-4 text-sky-300" />
              {t.investor.badge}
            </div>
          </div>

          {/* Hero Content: Title, Description & Action Buttons */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-white">
              {t.investor.titleLead}
              <br />
              <span className="text-sky-200">{t.investor.titleAccent}</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed max-w-2xl">
              {t.investor.description}
            </p>

            {/* In-page Anchor Navigation CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={scrollToRanking}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{labels.heroCtaRanking}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </button>

              <button
                onClick={scrollToForecast}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <LineChart className="w-4 h-4 text-sky-200 shrink-0" />
                <span>{labels.heroCtaForecast}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>

              <button
                onClick={scrollToSimulator}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-sky-200 shrink-0" />
                <span>{labels.heroCtaSimulator}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>
            </div>
          </div>

          {/* 4 Bottom Floating Stat Cards (Full Width Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {/* 1. Senior Residents (65+) */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-amber-700 leading-none">
                  {seniorsFormatted}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {labels.heroStatSeniorsLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {labels.heroStatSeniorsSub(seniorsSharePct)}
                </div>
              </div>
            </div>

            {/* 2. Total Edu-Care Places & Largest Group Share */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-indigo-700 leading-none">
                  {eduPlacesFormatted}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {labels.heroStatEnrolledLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {labels.heroStatEnrolledSub(schoolsSharePct)}
                </div>
              </div>
            </div>

            {/* 3. Housing Market Benchmark */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-black text-sky-700 leading-none">
                  {avgPriceM2 > 0 ? `${avgPriceM2.toLocaleString()} zł/m²` : '0 zł/m²'}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {labels.heroStatPriceLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {labels.heroStatPriceSub}
                </div>
              </div>
            </div>

            {/* 4. Urgent Expansion Districts (100% synchronized with Section 2) */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-violet-700 leading-none">
                  {b2bHotspotsCount} / 18
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {labels.heroStatB2BLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {labels.heroStatB2BSub(b2bHotspotDistrictsStr)}
                </div>
              </div>
            </div>
          </div>

          {/* Centered "What does Investor Mode offer?" Accordion Toggle Button (Full-width centered) */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowCapabilities((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              {showCapabilities
                ? labels.heroCapabilitiesCloseBtn
                : labels.heroCapabilitiesToggleBtn}
              {showCapabilities ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Expandable Capabilities Grid Drawer with unified smooth animation */}
      <div className={`drawer-expandable ${showCapabilities ? 'is-open' : ''}`}>
        <div className="overflow-hidden">
          <InvestorCapabilitiesGrid />
        </div>
      </div>
    </>
  );
}
