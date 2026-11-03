import {
  ArrowDownRight,
  Baby,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  GraduationCap,
  HelpCircle,
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
  totalDistrictsCount: _totalDistrictsCount = 0,
  districts,
}: ParentHeroHeaderProps) {
  const { language, t } = useTranslation();
  const [showCapabilities, setShowCapabilities] = useState<boolean>(false);

  // Dynamic municipal counts calculated live from backend API (0 when disconnected)
  const [eduCareCount, setEduCareCount] = useState<number>(0);
  const [greeneryCount, setGreeneryCount] = useState<number>(0);
  const [childrenCount, setChildrenCount] = useState<number>(0);

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

        setEduCareCount(eduCare);
        setGreeneryCount(greenery);
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
    if (!districts || districts.length === 0) {
      setChildrenCount(0);
      return;
    }

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
        setChildrenCount(totalKids);
      })
      .catch((err) => {
        console.error('Failed to load dynamic children count in hero header:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  const childrenCountFormatted = useMemo(() => {
    if (childrenCount <= 0) return '0';
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

          {/* Bespoke Family, Stroller, Playground, Kindergarten & 15-Minute Walking Radius Vector Art (Spacious & uncluttered) */}
          <svg
            className="absolute right-0 -top-3 lg:-top-5 h-full w-full lg:w-7/12 opacity-35 pointer-events-none select-none"
            viewBox="0 0 700 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="parentStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="kiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="parkTerraceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Fading Isochrone Wave Radials (Left-to-Right ambient guide curves) */}
            <path d="M 60 340 C 180 300, 280 330, 420 280 S 560 250, 680 220" stroke="#bae6fd" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.25" fill="none" />
            <path d="M 120 370 C 220 330, 320 360, 480 310 S 600 290, 690 260" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" fill="none" />

            {/* Elevated Park Promenade & 15-Minute City Terrace (Sweeping smoothly across the scene) */}
            <g id="parent-elevated-terrace">
              <path
                d="M 60 330 C 220 315, 420 295, 695 265"
                stroke="#bae6fd"
                strokeWidth="2"
                strokeOpacity="0.75"
              />
              <path
                d="M 75 345 C 235 330, 435 310, 695 280"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                strokeOpacity="0.4"
              />

              {/* Hopscotch Chalk Grid on Promenade Ground */}
              <g id="parent-hopscotch" transform="translate(325, 290) rotate(-4)">
                <rect x="0" y="0" width="16" height="16" stroke="#fde047" strokeWidth="1" fill="#fde047" fillOpacity="0.15" />
                <rect x="16" y="0" width="16" height="16" stroke="#bae6fd" strokeWidth="1" fill="#38bdf8" fillOpacity="0.1" />
                <rect x="32" y="-8" width="16" height="16" stroke="#34d399" strokeWidth="1" fill="#34d399" fillOpacity="0.15" />
                <rect x="32" y="8" width="16" height="16" stroke="#34d399" strokeWidth="1" fill="#34d399" fillOpacity="0.15" />
                <rect x="48" y="0" width="16" height="16" stroke="#fbbf24" strokeWidth="1" fill="#fbbf24" fillOpacity="0.15" />
                <path d="M 64 0 C 72 0, 72 16, 64 16 Z" stroke="#f472b6" strokeWidth="1" fill="#f472b6" fillOpacity="0.15" />
              </g>
            </g>

            {/* High-Flying Diamond Kite Soaring High in the Sky (Above playground) */}
            <g id="parent-kite" transform="translate(330, 20)">
              {/* Diamond Segments */}
              <polygon points="36,0 60,26 36,54 12,26" stroke="#fde047" strokeWidth="1.8" fill="url(#kiteGrad)" />
              <polygon points="36,0 36,54 12,26" fill="#38bdf8" fillOpacity="0.25" />
              <line x1="36" y1="0" x2="36" y2="54" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="12" y1="26" x2="60" y2="26" stroke="#ffffff" strokeWidth="1.2" />
              {/* Fluttering Tail */}
              <path d="M 36 54 C 20 78, 50 96, 26 125 S 45 150, 30 178" stroke="#bae6fd" strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
              {/* Kite Tail Bows */}
              <polygon points="30,72 36,76 28,80" fill="#fde047" />
              <polygon points="38,72 32,76 40,80" fill="#fde047" />
              <polygon points="38,100 44,104 36,108" fill="#38bdf8" />
              <polygon points="46,100 40,104 48,108" fill="#38bdf8" />
              <polygon points="24,132 30,136 22,140" fill="#34d399" />
              <polygon points="32,132 26,136 34,140" fill="#34d399" />
            </g>

            {/* 15-Minute City Isochrone Walking Radius Curves & Distance Stamps */}
            <g id="parent-isochrones">
              {/* Isochrone Arc 1 */}
              <path d="M 120 230 C 260 170, 420 210, 560 170 S 640 200, 695 160" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="5 4" fill="none" />

              {/* Isochrone Arc 2 */}
              <path d="M 150 180 C 290 120, 450 160, 580 125 S 650 150, 695 115" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.6" fill="none" />

              {/* Distance Badges */}
              <rect x="230" y="152" width="60" height="18" rx="5" fill="#0a2e65" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
              <text x="238" y="165" fill="#bae6fd" fontSize="10" fontWeight="800">300m • 5&apos;</text>

              <rect x="420" y="132" width="60" height="18" rx="5" fill="#0a2e65" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
              <text x="428" y="145" fill="#fde047" fontSize="10" fontWeight="800">500m • 8&apos;</text>

              <rect x="580" y="112" width="66" height="18" rx="5" fill="#0a2e65" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
              <text x="587" y="125" fill="#34d399" fontSize="10" fontWeight="800">1000m • 15&apos;</text>
            </g>

            {/* Kindergarten / Care Facility Building */}
            <g id="parent-kindergarten" transform="translate(140, 175)">
              {/* Main Building Frame */}
              <rect x="15" y="48" width="85" height="75" rx="4" stroke="#bae6fd" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.06" />
              {/* Pitched Roof */}
              <polygon points="8,48 57,15 107,48" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.1" />
              {/* Bell Gable / Clock Spire */}
              <rect x="48" y="-5" width="18" height="20" rx="2" stroke="#fbbf24" strokeWidth="1.4" fill="#fbbf24" fillOpacity="0.2" />
              <polygon points="45,-5 57,-18 69,-5" stroke="#fbbf24" strokeWidth="1.4" fill="#fde047" fillOpacity="0.3" />
              <circle cx="57" cy="5" r="4.5" stroke="#ffffff" strokeWidth="1" fill="#ffffff" fillOpacity="0.2" />
              <line x1="57" y1="3" x2="57" y2="5" stroke="#fde047" strokeWidth="1" />
              <line x1="57" y1="5" x2="59" y2="5" stroke="#fde047" strokeWidth="1" />

              {/* Classroom Windows */}
              <rect x="25" y="60" width="18" height="20" rx="2" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.12" />
              <line x1="34" y1="60" x2="34" y2="80" stroke="#bae6fd" strokeWidth="0.8" />
              <line x1="25" y1="70" x2="43" y2="70" stroke="#bae6fd" strokeWidth="0.8" />

              <rect x="70" y="60" width="18" height="20" rx="2" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.12" />
              <line x1="79" y1="60" x2="79" y2="80" stroke="#bae6fd" strokeWidth="0.8" />
              <line x1="70" y1="70" x2="88" y2="70" stroke="#bae6fd" strokeWidth="0.8" />

              {/* Arched Entrance Doorway */}
              <path d="M 47 123 L 47 98 Q 57 90, 67 98 L 67 123" stroke="#fde047" strokeWidth="1.4" fill="#fde047" fillOpacity="0.15" />
            </g>

            {/* Adventure Play Swing Set */}
            <g id="parent-playground-swing" transform="translate(265, 205)">
              <line x1="12" y1="15" x2="0" y2="75" stroke="#bae6fd" strokeWidth="1.4" />
              <line x1="12" y1="15" x2="24" y2="75" stroke="#bae6fd" strokeWidth="1.4" />
              <line x1="3" y1="55" x2="21" y2="55" stroke="#bae6fd" strokeWidth="1" />
              <line x1="36" y1="15" x2="24" y2="75" stroke="#bae6fd" strokeWidth="1.4" />
              <line x1="36" y1="15" x2="48" y2="75" stroke="#bae6fd" strokeWidth="1.4" />
              <line x1="27" y1="55" x2="45" y2="55" stroke="#bae6fd" strokeWidth="1" />
              <line x1="8" y1="15" x2="40" y2="15" stroke="#bae6fd" strokeWidth="1.8" />
              {/* Swing Seat */}
              <line x1="20" y1="15" x2="18" y2="56" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="28" y1="15" x2="26" y2="56" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
              <rect x="15" y="56" width="14" height="4" rx="1" fill="#fde047" />
            </g>

            {/* Playful Toddler Holding Tethered Star-Balloon */}
            <g id="parent-toddler-balloon" transform="translate(390, 210)">
              {/* Toddler Figure */}
              <circle cx="15" cy="20" r="6" stroke="#ffffff" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.15" />
              <line x1="15" y1="26" x2="15" y2="50" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="15" y1="50" x2="8" y2="74" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="15" y1="50" x2="22" y2="74" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="15" y1="32" x2="26" y2="26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="26" y1="26" x2="30" y2="8" stroke="#bae6fd" strokeWidth="1.2" strokeLinecap="round" />

              {/* Floating Star Balloon */}
              <g transform="translate(30, -35)">
                <ellipse cx="6" cy="10" rx="12" ry="15" stroke="#fde047" strokeWidth="1.8" fill="url(#kiteGrad)" />
                <polygon points="6,25 3,29 9,29" fill="#fde047" />
                <path d="M 6 29 C 4 38, 8 42, 0 45" stroke="#fde047" strokeWidth="1" fill="none" />
              </g>
            </g>

            {/* Stylized Family Promenade (Parent with Ergonomic Stroller & Older Child on Kick-Scooter) */}
            <g id="parent-family-group" transform="translate(470, 185)">
              {/* Parent Figure Pushing Stroller (x: 454) */}
              <g transform="translate(0, 10)">
                <circle cx="-16" cy="18" r="8" stroke="#ffffff" strokeWidth="2" fill="#ffffff" fillOpacity="0.15" />
                <line x1="-16" y1="26" x2="-16" y2="60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                {/* Legs in stride */}
                <line x1="-16" y1="60" x2="-24" y2="108" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <line x1="-16" y1="60" x2="-8" y2="108" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                {/* Arm holding stroller handle */}
                <path d="M -16 36 L 2 44 L 14 40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>

              {/* Modern Sleek Stroller */}
              <g transform="translate(20, 45)">
                {/* Rear Big Wheel with Spokes */}
                <circle cx="20" cy="62" r="12" stroke="#ffffff" strokeWidth="2" fill="#0a2e65" fillOpacity="0.4" />
                <circle cx="20" cy="62" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <line x1="20" y1="50" x2="20" y2="74" stroke="#38bdf8" strokeWidth="0.8" />
                <line x1="8" y1="62" x2="32" y2="62" stroke="#38bdf8" strokeWidth="0.8" />

                {/* Front Swivel Wheel */}
                <circle cx="64" cy="64" r="9" stroke="#ffffff" strokeWidth="1.8" fill="#0a2e65" fillOpacity="0.4" />
                <circle cx="64" cy="64" r="3.5" fill="#38bdf8" />

                {/* Chassis Frame & Suspension Bar */}
                <path d="M 20 62 L 42 42 L 64 64" stroke="#bae6fd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M 42 42 L 14 10 L 0 10" stroke="#bae6fd" strokeWidth="2.2" strokeLinecap="round" fill="none" />

                {/* Bassinet Cot / Stroller Seat Frame */}
                <path d="M 16 38 Q 22 48, 54 48 L 68 38 L 68 26 Q 42 22, 22 28 Z" stroke="#ffffff" strokeWidth="1.8" fill="#38bdf8" fillOpacity="0.18" />

                {/* Retractable Sun Canopy Hood */}
                <path d="M 22 28 Q 22 8, 44 8 L 44 26" stroke="#fde047" strokeWidth="2" fill="#fde047" fillOpacity="0.25" />
                <line x1="22" y1="28" x2="44" y2="8" stroke="#fde047" strokeWidth="1" strokeOpacity="0.6" />

                {/* Sleeping Baby Silhouette inside */}
                <circle cx="48" cy="34" r="4.5" fill="#fde047" />
                <path d="M 42 40 Q 52 44, 62 38" stroke="#ffffff" strokeWidth="1.2" fill="none" />
              </g>

              {/* Older Sibling on Kick-Scooter */}
              <g transform="translate(115, 42)">
                {/* Child Figure */}
                <circle cx="16" cy="18" r="6" stroke="#ffffff" strokeWidth="1.8" fill="#fde047" fillOpacity="0.3" />
                {/* Helmet */}
                <path d="M 10 18 C 10 10, 22 10, 22 18 Z" fill="#38bdf8" stroke="#38bdf8" strokeWidth="1" />
                <line x1="16" y1="24" x2="16" y2="50" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                {/* Legs on scooter deck */}
                <line x1="16" y1="50" x2="18" y2="68" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="16" y1="50" x2="2" y2="70" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                {/* Arms on handlebar */}
                <line x1="16" y1="32" x2="28" y2="38" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

                {/* Scooter Frame & Wheels */}
                <circle cx="2" cy="72" r="4.5" stroke="#38bdf8" strokeWidth="1.5" fill="#ffffff" />
                <circle cx="38" cy="72" r="4.5" stroke="#38bdf8" strokeWidth="1.5" fill="#ffffff" />
                <line x1="2" y1="72" x2="38" y2="72" stroke="#bae6fd" strokeWidth="2" />
                <line x1="38" y1="72" x2="30" y2="38" stroke="#bae6fd" strokeWidth="2" />
                <line x1="26" y1="38" x2="34" y2="38" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>

            {/* Lush Botanical City Trees (Framing Left & Right of the Park) */}
            <g id="parent-park-trees">
              {/* Tree on Left of Kindergarten */}
              <g transform="translate(90, 160)">
                <line x1="16" y1="35" x2="16" y2="75" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="22" r="20" stroke="#34d399" strokeWidth="1.6" strokeDasharray="4 3" fill="#34d399" fillOpacity="0.12" />
                <circle cx="10" cy="18" r="10" stroke="#10b981" strokeWidth="1.2" fill="#10b981" fillOpacity="0.2" />
              </g>

              {/* Tree on Far Right */}
              <g transform="translate(645, 145)">
                <line x1="16" y1="35" x2="16" y2="75" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="22" r="22" stroke="#34d399" strokeWidth="1.6" strokeDasharray="4 3" fill="#34d399" fillOpacity="0.12" />
                <circle cx="22" cy="18" r="10" stroke="#10b981" strokeWidth="1.2" />
              </g>
            </g>

            {/* Sparkles & Municipal POI Pins (Elevated in Sky) */}
            <g id="parent-poi-constellations">
              {/* Education Pin (Above kindergarten) */}
              <circle cx="195" cy="90" r="4.5" fill="#fde047" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="195" cy="90" r="9" stroke="#fde047" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Park Pin (Above playground) */}
              <circle cx="350" cy="70" r="4" fill="#34d399" stroke="#ffffff" strokeWidth="1.2" />

              {/* Healthcare / Pediatrician Pin (Above family) */}
              <circle cx="530" cy="80" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />

              {/* Ambient Golden & Azure Sparkles */}
              <path d="M 380 75 Q 380 85, 390 85 Q 380 85, 380 95 Q 380 85, 370 85 Q 380 85, 380 75 Z" fill="#fde047" fillOpacity="0.9" />
              <path d="M 620 55 Q 620 63, 628 63 Q 620 63, 620 71 Q 620 63, 612 63 Q 620 63, 620 55 Z" fill="#bae6fd" fillOpacity="0.8" />
              <path d="M 120 120 Q 120 128, 128 128 Q 120 128, 120 136 Q 120 128, 112 128 Q 120 128, 120 120 Z" fill="#38bdf8" fillOpacity="0.8" />
            </g>
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
              <HelpCircle className="w-4 h-4 text-sky-200" />
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
