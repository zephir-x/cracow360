import {
  ArrowDownRight,
  Building,
  Building2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  HelpCircle,
  LineChart,
  Sliders,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import { getInvestorForecastLabels } from '../../i18n/modules';
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
          const dem = d.demographics as any;
          const hst = d.housingMarket as any;
          const mappedForecast = mapDistrictForecastData(d, 'pl');

          const seniors = dem?.age65Plus ?? dem?.age65plus ?? dem?.seniors65Plus ?? 0;
          const pop = dem?.totalPopulation ?? 0;
          sumSeniors += seniors;
          sumPopulation += pop;

          sumCarePlaces += mappedForecast.carePlaces0to3;
          sumKinderPlaces += mappedForecast.kindergartenPlacesTotal;
          sumSchoolCapacity += mappedForecast.primarySchoolCapacity;

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

          {/* Econometric & Civic Infrastructure Vector Shapes with Rich Financial & Real-Estate Architecture */}
          <svg
            className="absolute right-0 bottom-0 h-full w-full lg:w-7/12 opacity-35 pointer-events-none select-none"
            viewBox="0 0 700 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="investorCurveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fde047" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="buildingGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="confidenceBandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.18" />
              </linearGradient>
            </defs>

            {/* Ground Baseline & Perspective Horizon Grid */}
            <line x1="40" y1="340" x2="680" y2="340" stroke="#bae6fd" strokeWidth="1.8" strokeOpacity="0.6" />
            <line x1="80" y1="315" x2="660" y2="315" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 6" />
            <line x1="140" y1="285" x2="640" y2="285" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 4" />
            <line x1="200" y1="250" x2="620" y2="250" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />

            {/* Econometric Volume Histogram / Capital Investment Candlestick Bars (Left-Center) */}
            <g id="investor-volume-bars" transform="translate(70, 240)">
              {/* Bar 1 */}
              <line x1="20" y1="50" x2="20" y2="100" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="14" y="65" width="12" height="30" rx="2" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.2" />
              {/* Bar 2 */}
              <line x1="45" y1="35" x2="45" y2="100" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="39" y="52" width="12" height="42" rx="2" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.2" />
              {/* Bar 3 */}
              <line x1="70" y1="20" x2="70" y2="100" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="64" y="40" width="12" height="54" rx="2" fill="#38bdf8" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.2" />
              {/* Bar 4 */}
              <line x1="95" y1="10" x2="95" y2="100" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="89" y="28" width="12" height="66" rx="2" fill="#34d399" fillOpacity="0.4" stroke="#34d399" strokeWidth="1.4" />
              {/* Bar 5 */}
              <line x1="120" y1="2" x2="120" y2="100" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <rect x="114" y="18" width="12" height="76" rx="2" fill="#fbbf24" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="1.4" />
            </g>

            {/* Construction Tower Crane (Dynamic Urban Investment Symbol) */}
            <g id="investor-crane" transform="translate(305, 110)">
              {/* Vertical Lattice Mast */}
              <line x1="20" y1="30" x2="20" y2="230" stroke="#bae6fd" strokeWidth="1.6" />
              <line x1="28" y1="30" x2="28" y2="230" stroke="#bae6fd" strokeWidth="1.6" />
              {/* Lattice Cross Bracing */}
              <line x1="20" y1="50" x2="28" y2="70" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="28" y1="50" x2="20" y2="70" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="20" y1="90" x2="28" y2="110" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="28" y1="90" x2="20" y2="110" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="20" y1="130" x2="28" y2="150" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="28" y1="130" x2="20" y2="150" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="20" y1="170" x2="28" y2="190" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />
              <line x1="28" y1="170" x2="20" y2="190" stroke="#bae6fd" strokeWidth="0.9" strokeOpacity="0.6" />

              {/* Crane Top Apex & Operator Cab */}
              <polygon points="24,10 16,30 32,30" stroke="#38bdf8" strokeWidth="1.4" fill="#38bdf8" fillOpacity="0.2" />
              <rect x="28" y="32" width="10" height="12" rx="1.5" stroke="#fde047" strokeWidth="1.2" fill="#fde047" fillOpacity="0.4" />

              {/* Horizontal Working Jib & Counter-Jib */}
              <line x1="-35" y1="30" x2="85" y2="30" stroke="#bae6fd" strokeWidth="1.8" />
              <line x1="-35" y1="36" x2="85" y2="36" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.6" />
              {/* Tie Cables from Apex */}
              <line x1="24" y1="10" x2="-35" y2="30" stroke="#38bdf8" strokeWidth="1" />
              <line x1="24" y1="10" x2="55" y2="30" stroke="#38bdf8" strokeWidth="1" />
              <line x1="24" y1="10" x2="85" y2="30" stroke="#38bdf8" strokeWidth="1" />

              {/* Counterweight Block on Left */}
              <rect x="-35" y="32" width="14" height="16" rx="2" stroke="#bae6fd" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.15" />

              {/* Hoist Trolley & Hook with Suspended Load */}
              <rect x="62" y="36" width="8" height="4" fill="#fde047" />
              <line x1="66" y1="40" x2="66" y2="78" stroke="#fde047" strokeWidth="1" strokeDasharray="2 2" />
              {/* Cargo Pallet */}
              <rect x="58" y="78" width="16" height="12" rx="2" stroke="#fbbf24" strokeWidth="1.2" fill="#fbbf24" fillOpacity="0.4" />
              {/* Safety Beacon at Crane Tip */}
              <circle cx="85" cy="30" r="2.5" fill="#f43f5e" />
            </g>

            {/* Modern High-Rise Central Business District (Unity Tower & Commercial Park Cluster) */}
            <g id="investor-cbd-skyline">
              {/* Left Tech Campus Building (Cantilevered Modern Glazed Architecture) */}
              <rect x="390" y="140" width="60" height="200" rx="4" stroke="#bae6fd" strokeWidth="1.5" fill="url(#buildingGlassGrad)" />
              {/* Floor Dividers */}
              <line x1="390" y1="170" x2="450" y2="170" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="390" y1="200" x2="450" y2="200" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="390" y1="230" x2="450" y2="230" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="390" y1="260" x2="450" y2="260" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="390" y1="290" x2="450" y2="290" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              {/* Vertical Mullions */}
              <line x1="410" y1="140" x2="410" y2="340" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="430" y1="140" x2="430" y2="340" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
              {/* Rooftop Solar Panels */}
              <line x1="396" y1="134" x2="414" y2="140" stroke="#bae6fd" strokeWidth="1.5" />
              <line x1="422" y1="134" x2="440" y2="140" stroke="#bae6fd" strokeWidth="1.5" />

              {/* Skybridge Connector to Unity Tower */}
              <rect x="450" y="195" width="28" height="18" rx="2" stroke="#bae6fd" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.1" />
              <line x1="450" y1="204" x2="478" y2="204" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />

              {/* Central Skyscraper - Unity Tower / Kraków Business Landmark */}
              <rect x="478" y="55" width="68" height="285" rx="4" stroke="#bae6fd" strokeWidth="1.8" fill="#38bdf8" fillOpacity="0.12" />
              {/* Stepped Crown Finial & Rooftop Antenna Spire */}
              <path d="M 488 55 L 488 42 L 536 42 L 536 55" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.2" />
              <path d="M 502 42 L 502 32 L 522 32 L 522 42" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.25" />
              <line x1="512" y1="12" x2="512" y2="32" stroke="#ffffff" strokeWidth="2" />
              <circle cx="512" cy="12" r="3" fill="#fde047" stroke="#ffffff" strokeWidth="1" />
              {/* Unity Tower Vertical Ribs (High Architectural Fidelity) */}
              <line x1="492" y1="55" x2="492" y2="340" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="505" y1="55" x2="505" y2="340" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="519" y1="55" x2="519" y2="340" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="532" y1="55" x2="532" y2="340" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
              {/* Spandrel Floor Bands */}
              <line x1="478" y1="95" x2="546" y2="95" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              <line x1="478" y1="135" x2="546" y2="135" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              <line x1="478" y1="175" x2="546" y2="175" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              <line x1="478" y1="215" x2="546" y2="215" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              <line x1="478" y1="255" x2="546" y2="255" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              <line x1="478" y1="295" x2="546" y2="295" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              {/* Grand Entrance Lobby Glass Atrium */}
              <rect x="496" y="315" width="32" height="25" rx="2" stroke="#fde047" strokeWidth="1.4" fill="#fde047" fillOpacity="0.2" />

              {/* Right Financial Center Tower (Diagrid Structural Steel Facade) */}
              <rect x="560" y="115" width="56" height="225" rx="4" stroke="#bae6fd" strokeWidth="1.5" fill="url(#buildingGlassGrad)" />
              {/* Diagrid X-Bracing */}
              <line x1="560" y1="115" x2="616" y2="165" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="616" y1="115" x2="560" y2="165" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="560" y1="165" x2="616" y2="215" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="616" y1="165" x2="560" y2="215" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="560" y1="215" x2="616" y2="265" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="616" y1="215" x2="560" y2="265" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="560" y1="265" x2="616" y2="315" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="616" y1="265" x2="560" y2="315" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
              {/* Rooftop Garden Terrace & Trees */}
              <circle cx="574" cy="108" r="5" fill="#34d399" fillOpacity="0.7" />
              <circle cx="588" cy="106" r="6" fill="#10b981" fillOpacity="0.8" />
              <circle cx="602" cy="108" r="5" fill="#34d399" fillOpacity="0.7" />

              {/* Far Right Low-Rise Modular Office Block */}
              <rect x="626" y="210" width="45" height="130" rx="3" stroke="#bae6fd" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.05" />
              <line x1="626" y1="250" x2="671" y2="250" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="626" y1="290" x2="671" y2="290" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
            </g>

            {/* Dynamic Econometric Forecast Trajectory & Confidence Corridor (CAGR Growth Band) */}
            <g id="investor-growth-trajectory">
              {/* Shaded Confidence Interval Corridor Band */}
              <path
                d="M 60 330 C 180 310, 260 250, 360 175 S 490 85, 630 25 L 630 65 C 490 125, 360 215, 260 280 S 180 335, 60 345 Z"
                fill="url(#confidenceBandGrad)"
              />

              {/* Main Forecast Trajectory Curve */}
              <path
                d="M 60 338 C 180 320, 260 265, 360 195 S 490 105, 630 45"
                stroke="url(#investorCurveGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Upper Confidence Limit Boundary */}
              <path
                d="M 60 330 C 180 310, 260 250, 360 175 S 490 85, 630 25"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                strokeOpacity="0.5"
                fill="none"
              />

              {/* Forecast Milestone Node 1 (2024 Base) */}
              <circle cx="180" cy="320" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="180" y1="320" x2="180" y2="340" stroke="#bae6fd" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />

              {/* Forecast Milestone Node 2 (2026 Acceleration) */}
              <circle cx="360" cy="195" r="5.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.8" />
              <circle cx="360" cy="195" r="11" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.7" />

              {/* Forecast Milestone Node 3 (2028 Peak Hotspot Target) */}
              <circle cx="630" cy="45" r="6.5" fill="#fde047" stroke="#ffffff" strokeWidth="2" />
              <circle cx="630" cy="45" r="14" stroke="#fde047" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.8" />
            </g>

            {/* B2B Hotspot Radial Scan Grid & Indicator Badges */}
            <g id="investor-hotspot-radar" transform="translate(190, 80)">
              {/* Concentric Scan Rings */}
              <circle cx="50" cy="50" r="44" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" />
              <circle cx="50" cy="50" r="28" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.6" />
              <circle cx="50" cy="50" r="12" stroke="#fde047" strokeWidth="1.4" fill="#fde047" fillOpacity="0.2" />
              <circle cx="50" cy="50" r="3.5" fill="#fde047" />

              {/* Crosshair Axes */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="2 2" strokeOpacity="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="2 2" strokeOpacity="0.5" />

              {/* Radar Sweep Ray */}
              <line x1="50" y1="50" x2="84" y2="22" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Floating Financial & Cadastral Spark Indicators */}
            <g id="investor-spark-chips">
              {/* Spark Chip 1: ROI Target */}
              <rect x="250" y="35" width="62" height="22" rx="6" stroke="#fde047" strokeWidth="1.2" fill="#0a2e65" fillOpacity="0.7" />
              <circle cx="262" cy="46" r="3" fill="#34d399" />
              <line x1="272" y1="46" x2="298" y2="46" stroke="#fde047" strokeWidth="1.5" strokeDasharray="8 3" />

              {/* Sparkles */}
              <path d="M 120 180 Q 120 190, 130 190 Q 120 190, 120 200 Q 120 190, 110 190 Q 120 190, 120 180 Z" fill="#bae6fd" fillOpacity="0.8" />
              <path d="M 640 160 Q 640 170, 650 170 Q 640 170, 640 180 Q 640 170, 630 170 Q 640 170, 640 160 Z" fill="#fde047" fillOpacity="0.9" />
            </g>
          </svg>
        </div>

        {/* Foreground Content stretching full container width */}
        <div className="relative z-10 p-5 sm:px-10 sm:pt-10 sm:pb-8 space-y-6 sm:space-y-8">
          <div className="space-y-4 max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Building2 className="w-4 h-4 text-sky-300" />
              {t.investor.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-white">
              {t.investor.titleLead}
              <br />
              <span className="text-sky-200">{t.investor.titleAccent}</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed max-w-2xl">
              {t.investor.description}
            </p>

            {/* In-page Anchor Navigation CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1 w-full">
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

            {/* 4. Urgent Expansion Districts */}
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
              <HelpCircle className="w-4 h-4 text-sky-200" />
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
