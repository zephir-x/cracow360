import {
  ArrowDownRight,
  Baby,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  GraduationCap,
  Sparkles,
  Trees,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import type { DistrictSummaryDto } from '../../types/contracts';
import { ParentCapabilitiesGrid } from './ParentCapabilitiesGrid';

export interface ParentHeroHeaderProps {
  totalDistrictsCount?: number;
  districts?: DistrictSummaryDto[];
}

export function ParentHeroHeader({
  totalDistrictsCount: _totalDistrictsCount = 18,
  districts,
}: ParentHeroHeaderProps) {
  const { language, t } = useTranslation();
  const [showCapabilities, setShowCapabilities] = useState<boolean>(false);

  // Dynamic municipal counts calculated live from backend API
  const [eduCareCount, setEduCareCount] = useState<number>(646);
  const [greeneryCount, setGreeneryCount] = useState<number>(142);
  const [childrenCount, setChildrenCount] = useState<number>(101498);

  useEffect(() => {
    let cancelled = false;

    cracow360Api
      .getPois()
      .then((pois) => {
        if (cancelled) return;
        const eduCare = pois.filter((p) =>
          [
            'NURSERY_PUBLIC',
            'NURSERY_CONTRACTED',
            'NURSERY_PRIVATE',
            'KIDS_CLUB',
            'PARENT_CLUB',
            'KINDERGARTEN',
            'PRIMARY_SCHOOL',
          ].includes(p.subCategory)
        ).length;

        const greenery = pois.filter((p) =>
          ['CITY_PARK', 'POCKET_PARK'].includes(p.subCategory)
        ).length;

        if (eduCare > 0) setEduCareCount(eduCare);
        if (greenery > 0) setGreeneryCount(greenery);
      })
      .catch((err) => {
        console.error('Failed to load dynamic POIs in hero header:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!districts || districts.length === 0) return;

    Promise.all(districts.map((d) => cracow360Api.getDistrictDetails(d.districtId)))
      .then((detailsList) => {
        if (cancelled) return;
        let totalKids = 0;
        detailsList.forEach((d) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dem = d.demographics as any;
          const c03 = dem?.age0To3 ?? dem?.age0to3 ?? 0;
          const c46 = dem?.age4To6 ?? dem?.age4to6 ?? 0;
          const c714 = dem?.age7To14 ?? dem?.age7to14 ?? 0;
          totalKids += c03 + c46 + c714;
        });
        if (totalKids > 0) {
          setChildrenCount(totalKids);
        }
      })
      .catch((err) => {
        console.error('Failed to load dynamic children count in hero header:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  const childrenCountFormatted = useMemo(() => {
    const inThousands = (childrenCount / 1000).toFixed(1);
    if (language === 'en') return `${inThousands}k`;
    if (language === 'ua') return `${inThousands} тис.`;
    return `${inThousands} tys.`;
  }, [childrenCount, language]);

  const scrollToProfile = () => {
    document.getElementById('child-profile-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRanking = () => {
    document.getElementById('education-ranking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMap = () => {
    document.getElementById('family-map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForecast = () => {
    document.getElementById('childcare-forecast-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Banner – Kraków Blue & Royal Indigo palette with bespoke family-focused vector art */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-2xl shadow-blue-950/15 border border-blue-400/30">
        {/* Animated Background Vector Shapes & Glowing Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

          {/* Bespoke Family, Stroller & Walking Radius Vector Art (100% custom line-art, no resident copy) */}
          <svg
            className="absolute right-0 bottom-0 h-full w-full lg:w-7/12 opacity-30 pointer-events-none select-none"
            viewBox="0 0 700 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="parentStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Playful Floating Kite with Ribbon Trail */}
            <g transform="translate(380, 55)">
              <path d="M40 0 L65 30 L40 60 L15 30 Z" stroke="#fde047" strokeWidth="2" fill="#fde047" fillOpacity="0.15" />
              <line x1="40" y1="0" x2="40" y2="60" stroke="#fde047" strokeWidth="1.5" />
              <line x1="15" y1="30" x2="65" y2="30" stroke="#fde047" strokeWidth="1.5" />
              <path d="M40 60 Q 25 85, 45 105 T 30 135" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              <polygon points="32,80 38,85 30,88" fill="#fde047" />
              <polygon points="42,102 48,107 40,110" fill="#38bdf8" />
            </g>

            {/* Stylized Family with Modern Stroller Silhouette */}
            <g transform="translate(470, 205)">
              {/* Stroller wheels */}
              <circle cx="20" cy="50" r="10" stroke="#ffffff" strokeWidth="2" />
              <circle cx="20" cy="50" r="4" fill="#38bdf8" />
              <circle cx="56" cy="50" r="7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="56" cy="50" r="3" fill="#38bdf8" />
              {/* Stroller bassinet / carrycot frame */}
              <path d="M12 36 Q 16 44, 46 44 L 58 36 L 58 26 Q 36 24, 18 28 Z" stroke="#bae6fd" strokeWidth="2" fill="#ffffff" fillOpacity="0.1" />
              {/* Canopy hood */}
              <path d="M18 28 Q 18 12, 36 12 L 36 26" stroke="#ffffff" strokeWidth="2" fill="none" />
              {/* Handlebar */}
              <path d="M14 36 L 0 10 L -8 10" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Parent figure beside handle */}
              <circle cx="-16" cy="-2" r="7" stroke="#ffffff" strokeWidth="2" />
              <path d="M-16 6 L -16 28 L -22 48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <path d="M-16 16 L -6 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Playful Child holding floating balloon */}
            <g transform="translate(390, 225)">
              <circle cx="15" cy="18" r="5" stroke="#ffffff" strokeWidth="1.8" />
              <line x1="15" y1="24" x2="15" y2="40" stroke="#ffffff" strokeWidth="1.8" />
              <line x1="15" y1="40" x2="9" y2="52" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="15" y1="40" x2="21" y2="52" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M15 28 L 26 22 L 28 8" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
              {/* Floating balloon */}
              <ellipse cx="30" cy="-6" rx="9" ry="12" stroke="#fde047" strokeWidth="1.8" fill="#fde047" fillOpacity="0.25" />
            </g>

            {/* Isochrone Walking Paths & Distance Markers */}
            <path d="M 220 280 C 280 230, 340 310, 420 260 S 520 280, 640 240" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" fill="none" />
            <text x="240" y="250" fill="#bae6fd" fontSize="11" fontWeight="700" opacity="0.85">300m</text>
            <text x="365" y="305" fill="#bae6fd" fontSize="11" fontWeight="700" opacity="0.85">500m</text>
            <text x="560" y="270" fill="#bae6fd" fontSize="11" fontWeight="700" opacity="0.85">1000m</text>

            {/* Stylized Modern Scandinavian Park Trees */}
            <g transform="translate(260, 185)">
              <line x1="16" y1="36" x2="16" y2="60" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="24" r="18" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" fill="#34d399" fillOpacity="0.1" />
              <circle cx="10" cy="20" r="9" stroke="#10b981" strokeWidth="1.4" />
            </g>
            <g transform="translate(605, 145)">
              <line x1="14" y1="32" x2="14" y2="54" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="20" r="15" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 3" fill="#34d399" fillOpacity="0.1" />
            </g>

            {/* Educational & Care POI constellation pins */}
            <circle cx="340" cy="180" r="4" fill="#ffffff" />
            <circle cx="480" cy="130" r="5" fill="#fde047" />
            <circle cx="620" cy="230" r="4.5" fill="#38bdf8" />
            <circle cx="560" cy="110" r="3.5" fill="#ffffff" />
          </svg>
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 px-6 sm:px-10 pt-8 sm:pt-10 pb-8 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Baby className="w-4 h-4 text-sky-300" />
              {t.parent.badge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-white">
              {t.parent.titleLead}
              <br />
              <span className="text-sky-200">{t.parent.titleAccent}</span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed max-w-2xl">
              {t.parent.description}
            </p>

            {/* Direct Navigation CTA Action Buttons with short catchy copy matching page order */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <button
                onClick={scrollToProfile}
                className="inline-flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Baby className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.parent.hero.ctaProfile}</span>
                </span>
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </button>

              <button
                onClick={scrollToRanking}
                className="inline-flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <GraduationCap className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>{t.parent.hero.ctaRanking}</span>
                </span>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>

              <button
                onClick={scrollToMap}
                className="inline-flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Compass className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>{t.parent.hero.ctaMap}</span>
                </span>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>

              <button
                onClick={scrollToForecast}
                className="inline-flex items-center justify-between gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <TrendingUp className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>{t.parent.hero.ctaForecast}</span>
                </span>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>
            </div>
          </div>

          {/* Bottom Floating Glassmorphic Stat Cards with live dynamic metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-700 leading-none">
                  {eduCareCount.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.parent.hero.statEduCareLabel}</div>
                <div className="text-[11px] text-slate-500">{t.parent.hero.statEduCareSub}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-700 leading-none">
                  {greeneryCount.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.parent.hero.statGreeneryLabel}</div>
                <div className="text-[11px] text-slate-500">{t.parent.hero.statGreenerySub}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-amber-700 leading-none">
                  {t.parent.hero.statWalkingBuffer}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.parent.hero.statIsochronesLabel}</div>
                <div className="text-[11px] text-slate-500">{t.parent.hero.statIsochronesSub}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-700 leading-none">
                  {childrenCountFormatted}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.parent.hero.statChildrenLabel}</div>
                <div className="text-[11px] text-slate-500">{t.parent.hero.statChildrenSub}</div>
              </div>
            </div>
          </div>

          {/* Centered "Co oferuje Tryb Rodzica?" Accordion Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowCapabilities((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              {showCapabilities
                ? t.parent.hero.capabilitiesCloseBtn
                : t.parent.hero.capabilitiesToggleBtn}
              {showCapabilities ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Expandable Capabilities Grid Drawer with unified zero-leakage container */}
      <div className={`drawer-expandable ${showCapabilities ? 'is-open' : ''}`}>
        <div className="overflow-hidden">
          <ParentCapabilitiesGrid />
        </div>
      </div>
    </>
  );
}
