import { useEffect, useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeftRight,
  Award,
  CheckCircle2,
  GitCompareArrows,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { cracow360Api } from '../../api/client';
import type {
  DistrictDetailsDto,
  DistrictSummaryDto,
  QualityWeights,
} from '../../types/contracts';
import { calculateClientSideQualityIndex } from '../../utils/qualityIndexCalculator';

export interface DistrictComparisonViewProps {
  districts: DistrictSummaryDto[];
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
  weights: QualityWeights;
  onSelectPrimary: (id: number) => void;
  onSelectSecondary: (id: number) => void;
  onClearSelection: () => void;
}

interface MetricRow {
  category: string;
  label: string;
  unit: string;
  firstValue: number;
  secondValue: number;
  higherIsBetter: boolean;
  format?: (val: number) => string;
}

// Module-level permanent memory cache for all 18 districts (zero network delay on dropdown select)
const DISTRICT_DETAILS_CACHE = new Map<number, DistrictDetailsDto>();

// Synthesizes data-driven comparative resident strengths for the district card across 8 pillars.
function getResidentStrengths(current: DistrictDetailsDto, opponent: DistrictDetailsDto): string {
  const PILLARS: { key: keyof typeof current.scores; label: string }[] = [
    { key: 'mobilityScore', label: 'mobilność i komunikację KMK' },
    { key: 'educationScore', label: 'ofertę edukacyjną i opiekę' },
    { key: 'greeneryScore', label: 'tereny zielone i rekreację' },
    { key: 'cultureAndSeniorScore', label: 'ofertę kulturalną i CAS' },
    { key: 'environmentScore', label: 'czyste środowisko i spokój' },
    { key: 'safetyScore', label: 'bezpieczeństwo i porządek' },
    { key: 'housingAffordabilityScore', label: 'przystępność cenową mieszkań' },
    { key: 'demographicVitalityScore', label: 'witalność demograficzną i rozwój' },
  ];

  // Calculate comparative deltas (current - opponent)
  const deltas = PILLARS.map((p) => ({
    label: p.label,
    score: current.scores[p.key],
    delta: current.scores[p.key] - opponent.scores[p.key],
  }));

  // Categories where current has a distinct comparative edge (>= 3.0 pts)
  const advantages = deltas
    .filter((d) => d.delta >= 3.0)
    .sort((a, b) => b.delta - a.delta);

  if (advantages.length >= 2) {
    const [top1, top2] = advantages;
    return `Wyraźna przewaga w kategoriach: ${top1.label} (+${top1.delta.toFixed(1)} pkt) oraz ${top2.label} (+${top2.delta.toFixed(1)} pkt).`;
  }

  if (advantages.length === 1) {
    const top1 = advantages[0];
    return `Kluczowy atut w zestawieniu: ${top1.label} (+${top1.delta.toFixed(1)} pkt względem drugiej dzielnicy).`;
  }

  // If both districts are very close, highlight top absolute scoring categories
  const topAbsolute = [...deltas].sort((a, b) => b.score - a.score);
  return `Zrównoważony profil miejski: najwyżej oceniane to ${topAbsolute[0].label} (${topAbsolute[0].score.toFixed(1)} pkt) oraz ${topAbsolute[1].label} (${topAbsolute[1].score.toFixed(1)} pkt).`;
}

/// <summary>
/// Side-by-side district comparison component featuring radar chart overlays across all 8 pillars,
/// detailed differential tables, and smooth expand/collapse transitions without layout jumps.
/// </summary>
export function DistrictComparisonView({
  districts,
  selectedPrimaryId,
  selectedSecondaryId,
  weights,
  onSelectPrimary,
  onSelectSecondary,
  onClearSelection,
}: DistrictComparisonViewProps) {
  const [, setCacheVersion] = useState<number>(0);

  // Background prefetch: loads all 18 district details once into module-level memory cache
  useEffect(() => {
    let cancelled = false;
    const prefetchAll = async () => {
      const missing = districts.filter((d) => !DISTRICT_DETAILS_CACHE.has(d.districtId));
      if (missing.length === 0) return;
      try {
        const results = await Promise.all(
          missing.map((d) => cracow360Api.getDistrictDetails(d.districtId))
        );
        if (!cancelled) {
          results.forEach((d) => DISTRICT_DETAILS_CACHE.set(d.districtId, d));
          setCacheVersion((v) => v + 1);
        }
      } catch {
        // Silently continue
      }
    };

    void prefetchAll();
    return () => {
      cancelled = true;
    };
  }, [districts]);

  // Synchronous cache retrieval: 0 ms delay on any dropdown select or map click
  const firstDetails = selectedPrimaryId ? DISTRICT_DETAILS_CACHE.get(selectedPrimaryId) ?? null : null;
  const secondDetails = selectedSecondaryId ? DISTRICT_DETAILS_CACHE.get(selectedSecondaryId) ?? null : null;

  // Fallback direct loader if a district wasn't yet in cache
  useEffect(() => {
    if (selectedPrimaryId && !DISTRICT_DETAILS_CACHE.has(selectedPrimaryId)) {
      cracow360Api
        .getDistrictDetails(selectedPrimaryId)
        .then((d) => {
          DISTRICT_DETAILS_CACHE.set(selectedPrimaryId, d);
          setCacheVersion((v) => v + 1);
        })
        .catch(() => {});
    }
    if (selectedSecondaryId && !DISTRICT_DETAILS_CACHE.has(selectedSecondaryId)) {
      cracow360Api
        .getDistrictDetails(selectedSecondaryId)
        .then((d) => {
          DISTRICT_DETAILS_CACHE.set(selectedSecondaryId, d);
          setCacheVersion((v) => v + 1);
        })
        .catch(() => {});
    }
  }, [selectedPrimaryId, selectedSecondaryId]);

  // Real-time client-side calculation of composite indexes using active slider weights
  const firstWeightedScore = useMemo(() => {
    if (!firstDetails) return 0;
    return calculateClientSideQualityIndex(firstDetails.scores, weights);
  }, [firstDetails, weights]);

  const secondWeightedScore = useMemo(() => {
    if (!secondDetails) return 0;
    return calculateClientSideQualityIndex(secondDetails.scores, weights);
  }, [secondDetails, weights]);

  // RadarChart dataset overlaying all 8 pillars (0-100 scale)
  const radarData = useMemo(() => {
    if (!firstDetails || !secondDetails) return [];
    return [
      {
        category: 'Mobilność KMK i DDR',
        first: firstDetails.scores.mobilityScore,
        second: secondDetails.scores.mobilityScore,
        fullMark: 100,
      },
      {
        category: 'Edukacja i Opieka',
        first: firstDetails.scores.educationScore,
        second: secondDetails.scores.educationScore,
        fullMark: 100,
      },
      {
        category: 'Zieleń i Rekreacja',
        first: firstDetails.scores.greeneryScore,
        second: secondDetails.scores.greeneryScore,
        fullMark: 100,
      },
      {
        category: 'Kultura i CAS',
        first: firstDetails.scores.cultureAndSeniorScore,
        second: secondDetails.scores.cultureAndSeniorScore,
        fullMark: 100,
      },
      {
        category: 'Środowisko i Spokój',
        first: firstDetails.scores.environmentScore,
        second: secondDetails.scores.environmentScore,
        fullMark: 100,
      },
      {
        category: 'Bezpieczeństwo Ruchu',
        first: firstDetails.scores.safetyScore,
        second: secondDetails.scores.safetyScore,
        fullMark: 100,
      },
      {
        category: 'Dostępność Mieszkań',
        first: firstDetails.scores.housingAffordabilityScore,
        second: secondDetails.scores.housingAffordabilityScore,
        fullMark: 100,
      },
      {
        category: 'Witalność i Rozwój',
        first: firstDetails.scores.demographicVitalityScore,
        second: secondDetails.scores.demographicVitalityScore,
        fullMark: 100,
      },
    ];
  }, [firstDetails, secondDetails]);

  // Hard infrastructure, housing, safety & demographic metrics table rows
  const metricRows: MetricRow[] = useMemo(() => {
    if (!firstDetails || !secondDetails) return [];
    return [
      {
        category: 'Demografia',
        label: 'Wskaźnik witalności demograficznej i rozwoju',
        unit: 'pkt',
        firstValue: firstDetails.scores.demographicVitalityScore ?? 0,
        secondValue: secondDetails.scores.demographicVitalityScore ?? 0,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} pkt`,
      },
      {
        category: 'Demografia',
        label: 'Liczba mieszkańców ogółem',
        unit: 'osób',
        firstValue: firstDetails.demographics.totalPopulation,
        secondValue: secondDetails.demographics.totalPopulation,
        higherIsBetter: true,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Demografia',
        label: 'Dynamika populacji (ostatnie 3 lata)',
        unit: '%',
        firstValue: firstDetails.demographics.populationGrowthRate3YrPct,
        secondValue: secondDetails.demographics.populationGrowthRate3YrPct,
        higherIsBetter: true,
        format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
      },
      {
        category: 'Demografia',
        label: 'Mieszkańcy w wieku produkcyjnym (15–64 lata)',
        unit: 'osób',
        firstValue: firstDetails.demographics.age15To64,
        secondValue: secondDetails.demographics.age15To64,
        higherIsBetter: true,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Demografia',
        label: 'Cudzoziemcy zameldowani w dzielnicy',
        unit: 'osób',
        firstValue: firstDetails.demographics.foreignersTotal,
        secondValue: secondDetails.demographics.foreignersTotal,
        higherIsBetter: true,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Rynek Mieszkaniowy',
        label: 'Średnia cena zakupu mieszkania za m²',
        unit: 'zł/m²',
        firstValue: firstDetails.housingMarket?.avgPricePerM2 ?? 0,
        secondValue: secondDetails.housingMarket?.avgPricePerM2 ?? 0,
        higherIsBetter: false,
        format: (v) => `${v.toLocaleString('pl-PL')} zł`,
      },
      {
        category: 'Rynek Mieszkaniowy',
        label: 'Średnia miesięczna stawka najmu za m²',
        unit: 'zł/m²',
        firstValue: firstDetails.housingMarket?.avgRentalPriceM2 ?? 0,
        secondValue: secondDetails.housingMarket?.avgRentalPriceM2 ?? 0,
        higherIsBetter: false,
        format: (v) => `${v.toFixed(1)} zł`,
      },
      {
        category: 'Rynek Mieszkaniowy',
        label: 'Dostępność m² za średnie wynagrodzenie netto',
        unit: 'm²/pensję',
        firstValue: firstDetails.housingMarket?.m2PerAverageSalary ?? 0,
        secondValue: secondDetails.housingMarket?.m2PerAverageSalary ?? 0,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(2)} m²`,
      },
      {
        category: 'Bezpieczeństwo',
        label: 'Roczna liczba kolizji drogowych',
        unit: 'kolizji',
        firstValue: firstDetails.publicSafety?.roadCollisionsAnnual ?? 0,
        secondValue: secondDetails.publicSafety?.roadCollisionsAnnual ?? 0,
        higherIsBetter: false,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Bezpieczeństwo',
        label: 'Wypadki drogowe z udziałem pieszych',
        unit: 'wypadków',
        firstValue: firstDetails.publicSafety?.pedestrianAccidents ?? 0,
        secondValue: secondDetails.publicSafety?.pedestrianAccidents ?? 0,
        higherIsBetter: false,
      },
      {
        category: 'Bezpieczeństwo',
        label: 'Zgłoszenia zakłócania porządku (Straż Miejska)',
        unit: 'interwencji',
        firstValue: firstDetails.publicSafety?.publicDisturbanceInterventions ?? 0,
        secondValue: secondDetails.publicSafety?.publicDisturbanceInterventions ?? 0,
        higherIsBetter: false,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Mobilność',
        label: 'Przystanki tramwajowe (szkielet szynowy)',
        unit: 'przyst.',
        firstValue: firstDetails.mobilityAndTransport.tramStopsCount ?? 0,
        secondValue: secondDetails.mobilityAndTransport.tramStopsCount ?? 0,
        higherIsBetter: true,
      },
      {
        category: 'Mobilność',
        label: 'Udział tramwajów w sieci przystankowej',
        unit: '%',
        firstValue: firstDetails.mobilityAndTransport.tramNetworkSharePct ?? 0,
        secondValue: secondDetails.mobilityAndTransport.tramNetworkSharePct ?? 0,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)}%`,
      },
      {
        category: 'Mobilność',
        label: 'Gabloty i ramki rozkładowe (oferta linii)',
        unit: 'szt.',
        firstValue: firstDetails.mobilityAndTransport.scheduleBoardsCount ?? 0,
        secondValue: secondDetails.mobilityAndTransport.scheduleBoardsCount ?? 0,
        higherIsBetter: true,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Mobilność',
        label: 'Łączna liczba przystanków KMK (sieć ogółem)',
        unit: 'przyst.',
        firstValue: firstDetails.mobilityAndTransport.kmkStopsCount,
        secondValue: secondDetails.mobilityAndTransport.kmkStopsCount,
        higherIsBetter: true,
      },
      {
        category: 'Mobilność',
        label: 'Efektywna dostępność piesza KMK (izochrona 500 m)',
        unit: '%',
        firstValue: firstDetails.mobilityAndTransport.isochroneCoveragePct,
        secondValue: secondDetails.mobilityAndTransport.isochroneCoveragePct,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)}%`,
      },
      {
        category: 'Mobilność',
        label: 'Długość sieci dróg rowerowych (DDR i pasy)',
        unit: 'km',
        firstValue: firstDetails.mobilityAndTransport.bikeLanesLengthKm,
        secondValue: secondDetails.mobilityAndTransport.bikeLanesLengthKm,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} km`,
      },
      {
        category: 'Mobilność',
        label: 'Stojaki rowerowe ZTP (pojemność)',
        unit: 'stojaków',
        firstValue: firstDetails.mobilityAndTransport.bikeRacksCount,
        secondValue: secondDetails.mobilityAndTransport.bikeRacksCount,
        higherIsBetter: true,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Zieleń i Sport',
        label: 'Powierzchnia zieleni biologicznej na mieszkańca',
        unit: 'm²/os.',
        firstValue: firstDetails.greeneryAndSport.totalGreenM2PerCapita || firstDetails.greeneryAndSport.greenAreaM2PerCapita,
        secondValue: secondDetails.greeneryAndSport.totalGreenM2PerCapita || secondDetails.greeneryAndSport.greenAreaM2PerCapita,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} m²`,
      },
      {
        category: 'Zieleń i Sport',
        label: 'Lasy komunalne i uroczyska leśne ZZM',
        unit: 'ha',
        firstValue: firstDetails.greeneryAndSport.forestAreaHa ?? 0,
        secondValue: secondDetails.greeneryAndSport.forestAreaHa ?? 0,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} ha`,
      },
      {
        category: 'Zieleń i Sport',
        label: 'Łączna powierzchnia parków miejskich i kieszonkowych',
        unit: 'ha',
        firstValue: firstDetails.greeneryAndSport.totalParksAreaHa,
        secondValue: secondDetails.greeneryAndSport.totalParksAreaHa,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} ha`,
      },
      {
        category: 'Zieleń i Sport',
        label: 'Przyszkolne pływalnie sportowo-rekreacyjne',
        unit: 'basenów',
        firstValue: firstDetails.greeneryAndSport.schoolSwimmingPoolsCount,
        secondValue: secondDetails.greeneryAndSport.schoolSwimmingPoolsCount,
        higherIsBetter: true,
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Żłobki publiczne samorządowe (liczba placówek)',
        unit: 'placówek',
        firstValue: firstDetails.educationAndCare.nurseriesPublicCount,
        secondValue: secondDetails.educationAndCare.nurseriesPublicCount,
        higherIsBetter: true,
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Łączna liczba miejsc opieki 0–3 (żłobki + kluby)',
        unit: 'miejsc',
        firstValue: firstDetails.educationAndCare.totalCarePlaces0To3,
        secondValue: secondDetails.educationAndCare.totalCarePlaces0To3,
        higherIsBetter: true,
        format: (v) => v.toLocaleString('pl-PL'),
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Liczba dzieci (0–3 lat) przypadająca na 1 miejsce w żłobku',
        unit: 'dzieci/miejsce',
        firstValue: firstDetails.educationAndCare.childrenPerCarePlaceRatio,
        secondValue: secondDetails.educationAndCare.childrenPerCarePlaceRatio,
        higherIsBetter: false,
        format: (v) => `${v.toFixed(2)} os.`,
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Średnia liczebność oddziału w szkołach podstawowych',
        unit: 'uczniów/klasę',
        firstValue: firstDetails.educationAndCare.avgStudentsPerClass,
        secondValue: secondDetails.educationAndCare.avgStudentsPerClass,
        higherIsBetter: false,
        format: (v) => `${v.toFixed(1)} os.`,
      },
      {
        category: 'Kultura i Społeczność',
        label: 'Filie Biblioteki Kraków w dzielnicy',
        unit: 'filii',
        firstValue: firstDetails.cultureAndSociety.libraryBranchesCount,
        secondValue: secondDetails.cultureAndSociety.libraryBranchesCount,
        higherIsBetter: true,
      },
      {
        category: 'Kultura i Społeczność',
        label: 'Miejskie Domy i Ośrodki Kultury',
        unit: 'ośrodków',
        firstValue: firstDetails.cultureAndSociety.culturalCentersCount,
        secondValue: secondDetails.cultureAndSociety.culturalCentersCount,
        higherIsBetter: true,
      },
      {
        category: 'Kultura i Społeczność',
        label: 'Centra Aktywności Seniora (CAS)',
        unit: 'centrów',
        firstValue: firstDetails.cultureAndSociety.seniorActivityCentersCount,
        secondValue: secondDetails.cultureAndSociety.seniorActivityCentersCount,
        higherIsBetter: true,
      },
      {
        category: 'Środowisko',
        label: 'Średnioroczne stężenie pyłu zawieszonego PM10',
        unit: 'µg/m³',
        firstValue: firstDetails.environmentalQuality.pm10AnnualUgM3,
        secondValue: secondDetails.environmentalQuality.pm10AnnualUgM3,
        higherIsBetter: false,
        format: (v) => `${v.toFixed(1)} µg/m³`,
      },
      {
        category: 'Środowisko',
        label: 'Liczba dni z przekroczeniem normy PM10 w roku',
        unit: 'dni',
        firstValue: firstDetails.environmentalQuality.smogDaysCount,
        secondValue: secondDetails.environmentalQuality.smogDaysCount,
        higherIsBetter: false,
      },
      {
        category: 'Środowisko',
        label: 'Udział powierzchni dzielnicy z hałasem >65 dB',
        unit: '%',
        firstValue: firstDetails.environmentalQuality.trafficNoiseExceededPct,
        secondValue: secondDetails.environmentalQuality.trafficNoiseExceededPct,
        higherIsBetter: false,
        format: (v) => `${v.toFixed(1)}%`,
      },
    ];
  }, [firstDetails, secondDetails]);

  // Cached snapshot of active comparison to keep DOM intact during drawer collapse animation
  const [cachedComparison, setCachedComparison] = useState<{
    first: DistrictDetailsDto;
    second: DistrictDetailsDto;
    firstScore: number;
    secondScore: number;
    radar: typeof radarData;
    metrics: typeof metricRows;
  } | null>(null);

  useEffect(() => {
    if (firstDetails && secondDetails) {
      setCachedComparison({
        first: firstDetails,
        second: secondDetails,
        firstScore: firstWeightedScore,
        secondScore: secondWeightedScore,
        radar: radarData,
        metrics: metricRows,
      });
    }
  }, [firstDetails, secondDetails, firstWeightedScore, secondWeightedScore, radarData, metricRows]);

  const activeComparison = (firstDetails && secondDetails)
    ? {
        first: firstDetails,
        second: secondDetails,
        firstScore: firstWeightedScore,
        secondScore: secondWeightedScore,
        radar: radarData,
        metrics: metricRows,
      }
    : cachedComparison;

  const hasAnySelection = Boolean(selectedPrimaryId || selectedSecondaryId);
  const hasBothSelections = Boolean(selectedPrimaryId && selectedSecondaryId && firstDetails && secondDetails);
  const isComparisonOpen = Boolean(hasBothSelections);

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-6">
      {/* Header bar with dropdowns and clear button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <GitCompareArrows className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Szczegółowa Porównywarka 1:1 Dzielnic
            </h2>
            <p className="text-xs text-slate-500">
              Wybierz dwie dzielnice i zestaw twarde wskaźniki infrastrukturalne oraz 8 filarów jakości życia
            </p>
          </div>
        </div>

        {hasAnySelection && (
          <button
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Wyczyść porównanie
          </button>
        )}
      </div>

      {/* Selectors for District #1 and District #2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* District #1 Dropdown */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
          <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-extrabold flex items-center justify-center">
              1
            </span>
            Pierwsza dzielnica (Niebieski profil):
          </label>
          <select
            value={selectedPrimaryId ?? ''}
            onChange={(e) => onSelectPrimary(Number(e.target.value))}
            className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-blue-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Wybierz dzielnicę...</option>
            {districts.map((d) => (
              <option key={d.districtId} value={d.districtId} disabled={d.districtId === selectedSecondaryId}>
                {d.districtName} ({d.weightedQualityOfLifeIndex.toFixed(1)} pkt)
              </option>
            ))}
          </select>
        </div>

        {/* District #2 Dropdown */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
          <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-center">
              2
            </span>
            Druga dzielnica (Fioletowy profil):
          </label>
          <select
            value={selectedSecondaryId ?? ''}
            onChange={(e) => onSelectSecondary(Number(e.target.value))}
            className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Wybierz dzielnicę do zestawienia...</option>
            {districts.map((d) => (
              <option key={d.districtId} value={d.districtId} disabled={d.districtId === selectedPrimaryId}>
                {d.districtName} ({d.weightedQualityOfLifeIndex.toFixed(1)} pkt)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* When 0 districts are selected: show the clean Empty State Prompt */}
      {!hasAnySelection ? (
        <div className="animate-fade-in p-8 sm:p-12 text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto shadow-xs">
            <GitCompareArrows className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-extrabold text-slate-800">
              Wybierz 2 dzielnice do bezpośredniego zestawienia
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wybierz pierwszą i drugą dzielnicę z list powyżej lub kliknij je na mapie i liście rankingowej. Wykres radarowy 8 osi oraz szczegółowa tabela twardych danych miejskich rozsuną się automatycznie.
            </p>
          </div>
        </div>
      ) : (
        /* When at least 1 district is selected: render persistent Cards Grid so transition from 1 to 2 districts never jumps or glitches */
        <div className="space-y-4 animate-fade-in">
          {/* Helper hint when only 1 district is chosen */}
          {!hasBothSelections && (
            <div className="p-3.5 text-center rounded-2xl bg-blue-50/70 border border-blue-200 animate-fade-in">
              <div className="text-xs font-bold text-blue-900">
                Wybrano 1. dzielnicę ({firstDetails?.districtName || secondDetails?.districtName}). Wybierz drugą dzielnicę powyżej lub kliknij na mapie, aby rozsunąć pełne zestawienie.
              </div>
            </div>
          )}

          {/* Persistent Two-District Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slot #1 Card */}
            {firstDetails ? (
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  hasBothSelections && firstWeightedScore >= secondWeightedScore
                    ? 'bg-blue-50/70 border-blue-400 shadow-md shadow-blue-600/10'
                    : 'bg-blue-50/40 border-blue-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Dzielnica #1</span>
                    <h3 className="text-base font-black text-slate-900">{firstDetails.districtName}</h3>
                  </div>
                  {hasBothSelections && firstWeightedScore >= secondWeightedScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-xs animate-fade-in">
                      <Award className="w-3.5 h-3.5" />
                      Wyższa ocena
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600">{firstWeightedScore.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-slate-500">/ 100 pkt jakości życia</span>
                </div>

                {/* Resident strengths box (visible when comparing two districts) or standard metrics */}
                {hasBothSelections && secondDetails ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-blue-100/40 border border-blue-200/70 animate-fade-in">
                    <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Atuty dla mieszkańca:</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                      {getResidentStrengths(firstDetails, secondDetails)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl bg-blue-100/40 border border-blue-200/70 text-xs text-slate-700 leading-relaxed">
                    Gęstość zaludnienia: <strong className="text-blue-950">{Math.round(firstDetails.demographics.totalPopulation / (firstDetails.areaKm2 || 1))} os./km²</strong> • Ludność: <strong className="text-blue-950">{firstDetails.demographics.totalPopulation.toLocaleString('pl-PL')}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-blue-200 bg-white/60 flex flex-col items-center justify-center text-center space-y-2 min-h-44 transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Dzielnica #1 (Niebieski profil)</span>
                <p className="text-xs text-slate-500 max-w-xs">Wybierz pierwszą dzielnicę z listy rozwijanej powyżej lub kliknij na mapie</p>
              </div>
            )}

            {/* Slot #2 Card */}
            {secondDetails ? (
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  hasBothSelections && secondWeightedScore >= firstWeightedScore
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-md shadow-indigo-600/10'
                    : 'bg-indigo-50/40 border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Dzielnica #2</span>
                    <h3 className="text-base font-black text-slate-900">{secondDetails.districtName}</h3>
                  </div>
                  {hasBothSelections && secondWeightedScore >= firstWeightedScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-xs animate-fade-in">
                      <Award className="w-3.5 h-3.5" />
                      Wyższa ocena
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-600">{secondWeightedScore.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-slate-500">/ 100 pkt jakości życia</span>
                </div>

                {/* Resident strengths box (visible when comparing two districts) or standard metrics */}
                {hasBothSelections && firstDetails ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-indigo-100/40 border border-indigo-200/70 animate-fade-in">
                    <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Atuty dla mieszkańca:</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                      {getResidentStrengths(secondDetails, firstDetails)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-100/40 border border-indigo-200/70 text-xs text-slate-700 leading-relaxed">
                    Gęstość zaludnienia: <strong className="text-indigo-950">{Math.round(secondDetails.demographics.totalPopulation / (secondDetails.areaKm2 || 1))} os./km²</strong> • Ludność: <strong className="text-indigo-950">{secondDetails.demographics.totalPopulation.toLocaleString('pl-PL')}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-indigo-200 bg-white/60 flex flex-col items-center justify-center text-center space-y-2 min-h-44 transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">Dzielnica #2 (Fioletowy profil)</span>
                <p className="text-xs text-slate-500 max-w-xs">Wybierz drugą dzielnicę z listy rozwijanej powyżej lub kliknij na mapie</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expandable Drawer: Radar Chart 8 Osi & Detailed Hard Data Table */}
      <div className={`drawer-expandable ${isComparisonOpen ? 'is-open' : ''}`}>
        <div className="overflow-hidden space-y-6 pt-1">
          {activeComparison && (
            <div
              key={`${activeComparison.first.districtId}-${activeComparison.second.districtId}`}
              className="space-y-6 animate-fade-in"
            >
              {/* Radar Chart Overlay (8 Pillars Comparison) */}
              <div className="p-6 rounded-2xl bg-linear-to-b from-slate-50/80 to-white border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Wykres Radarowy: 8 Wymiarów Jakości Życia (0–100)
                  </h4>
                  <span className="text-[11px] text-slate-500">Skala 0–100 punktów</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={activeComparison.radar}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                      <Radar
                        name={activeComparison.first.districtName}
                        dataKey="first"
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                      <Radar
                        name={activeComparison.second.districtName}
                        dataKey="second"
                        stroke="#4f46e5"
                        fill="#6366f1"
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comprehensive Hard Data Metrics Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                    Szczegółowe Zestawienie Twardych Danych Miejskich
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Kolorem zielonym oznaczono dzielnicę z korzystniejszym parametrem
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-1/4">Kategoria i Wskaźnik</th>
                        <th className="py-3 px-4 text-center w-1/4 text-blue-700 font-extrabold">
                          {activeComparison.first.districtName}
                        </th>
                        <th className="py-3 px-4 text-center w-1/4 text-indigo-700 font-extrabold">
                          {activeComparison.second.districtName}
                        </th>
                        <th className="py-3 px-6 text-center w-36 whitespace-nowrap">Różnica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeComparison.metrics.map((row, idx) => {
                        const firstVal = row.firstValue;
                        const secondVal = row.secondValue;
                        const diff = firstVal - secondVal;

                        const firstIsBetter = row.higherIsBetter ? diff > 0 : diff < 0;
                        const secondIsBetter = row.higherIsBetter ? diff < 0 : diff > 0;

                        const formattedFirst = row.format ? row.format(firstVal) : `${firstVal} ${row.unit}`;
                        const formattedSecond = row.format ? row.format(secondVal) : `${secondVal} ${row.unit}`;

                        return (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2.5 px-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                {row.category}
                              </span>
                              <span className="font-medium text-slate-800">{row.label}</span>
                            </td>
                            <td
                              className={`py-2.5 px-4 text-center font-bold ${
                                firstIsBetter ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-700'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1 justify-center">
                                {formattedFirst}
                                {firstIsBetter && <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />}
                              </span>
                            </td>
                            <td
                              className={`py-2.5 px-4 text-center font-bold ${
                                secondIsBetter ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-700'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1 justify-center">
                                {formattedSecond}
                                {secondIsBetter && <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />}
                              </span>
                            </td>
                            <td className="py-2.5 px-6 text-center font-extrabold text-[11px] text-slate-600 whitespace-nowrap">
                              {diff === 0 ? (
                                <span className="text-slate-400">Równe</span>
                              ) : (
                                <span className={diff > 0 ? 'text-blue-600' : 'text-indigo-600'}>
                                  {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} {row.unit}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
