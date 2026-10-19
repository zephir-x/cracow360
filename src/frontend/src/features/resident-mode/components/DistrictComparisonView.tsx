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
import { cracow360Api } from '../../../api/client';
import type {
  DistrictDetailsDto,
  DistrictSummaryDto,
  QualityWeights,
} from '../../../types/contracts';
import { calculateClientSideQualityIndex } from '../../../utils/qualityIndexCalculator';

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

export function DistrictComparisonView({
  districts,
  selectedPrimaryId,
  selectedSecondaryId,
  weights,
  onSelectPrimary,
  onSelectSecondary,
  onClearSelection,
}: DistrictComparisonViewProps) {
  const [firstDetails, setFirstDetails] = useState<DistrictDetailsDto | null>(null);
  const [secondDetails, setSecondDetails] = useState<DistrictDetailsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch full district details when primary or secondary ID changes
  useEffect(() => {
    let cancelled = false;

    const loadDetails = async () => {
      if (!selectedPrimaryId && !selectedSecondaryId) {
        setFirstDetails(null);
        setSecondDetails(null);
        return;
      }

      setLoading(true);
      try {
        const [first, second] = await Promise.all([
          selectedPrimaryId ? cracow360Api.getDistrictDetails(selectedPrimaryId) : Promise.resolve(null),
          selectedSecondaryId ? cracow360Api.getDistrictDetails(selectedSecondaryId) : Promise.resolve(null),
        ]);
        if (!cancelled) {
          setFirstDetails(first);
          setSecondDetails(second);
        }
      } catch {
        // Keep previous details on transient error
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [selectedPrimaryId, selectedSecondaryId]);

  const firstWeightedScore = useMemo(() => {
    if (!firstDetails) return 0;
    return calculateClientSideQualityIndex(firstDetails.scores, weights);
  }, [firstDetails, weights]);

  const secondWeightedScore = useMemo(() => {
    if (!secondDetails) return 0;
    return calculateClientSideQualityIndex(secondDetails.scores, weights);
  }, [secondDetails, weights]);

  // RadarChart dataset overlaying the 5 categories (0-100 scale)
  const radarData = useMemo(() => {
    if (!firstDetails || !secondDetails) return [];
    return [
      {
        category: 'Mobilność KMK',
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
        category: 'Zieleń i Sport',
        first: firstDetails.scores.greeneryScore,
        second: secondDetails.scores.greeneryScore,
        fullMark: 100,
      },
      {
        category: 'Kultura i Seniorzy',
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
    ];
  }, [firstDetails, secondDetails]);

  // Hard infrastructure & demographic metrics table rows
  const metricRows: MetricRow[] = useMemo(() => {
    if (!firstDetails || !secondDetails) return [];
    return [
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
        category: 'Mobilność',
        label: 'Liczba przystanków KMK (tramwaj / autobus)',
        unit: 'przyst.',
        firstValue: firstDetails.mobilityAndTransport.kmkStopsCount,
        secondValue: secondDetails.mobilityAndTransport.kmkStopsCount,
        higherIsBetter: true,
      },
      {
        category: 'Mobilność',
        label: 'Pokrycie izochroną dojścia 500 m do KMK',
        unit: '%',
        firstValue: firstDetails.mobilityAndTransport.isochroneCoveragePct,
        secondValue: secondDetails.mobilityAndTransport.isochroneCoveragePct,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)}%`,
      },
      {
        category: 'Mobilność',
        label: 'Długość ścieżek rowerowych (DDR)',
        unit: 'km',
        firstValue: firstDetails.mobilityAndTransport.bikeLanesLengthKm,
        secondValue: secondDetails.mobilityAndTransport.bikeLanesLengthKm,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} km`,
      },
      {
        category: 'Zieleń i Sport',
        label: 'Powierzchnia zieleni parkowej na mieszkańca',
        unit: 'm²/os.',
        firstValue: firstDetails.greeneryAndSport.greenAreaM2PerCapita,
        secondValue: secondDetails.greeneryAndSport.greenAreaM2PerCapita,
        higherIsBetter: true,
        format: (v) => `${v.toFixed(1)} m²`,
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
        category: 'Edukacja i Opieka',
        label: 'Liczba miejsc w żłobkach i klubach dziecięcych (0–3 lata)',
        unit: 'miejsc',
        firstValue: firstDetails.educationAndCare.totalCarePlaces0To3,
        secondValue: secondDetails.educationAndCare.totalCarePlaces0To3,
        higherIsBetter: true,
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Wskaźnik obłożenia: liczba dzieci (0–3) na 1 miejsce w żłobku',
        unit: 'dzieci/miejsce',
        firstValue: firstDetails.educationAndCare.childrenPerCarePlaceRatio,
        secondValue: secondDetails.educationAndCare.childrenPerCarePlaceRatio,
        higherIsBetter: false, // Lower ratio means easier access to nurseries
        format: (v) => v.toFixed(2),
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Średnia liczba uczniów w klasie (szkoły podstawowe)',
        unit: 'uczniów',
        firstValue: firstDetails.educationAndCare.avgStudentsPerClass,
        secondValue: secondDetails.educationAndCare.avgStudentsPerClass,
        higherIsBetter: false, // Smaller classes are better
        format: (v) => v.toFixed(1),
      },
      {
        category: 'Kultura i Seniorzy',
        label: 'Filie Biblioteki Kraków i Domy Kultury',
        unit: 'placówek',
        firstValue:
          firstDetails.cultureAndSociety.libraryBranchesCount +
          firstDetails.cultureAndSociety.culturalCentersCount,
        secondValue:
          secondDetails.cultureAndSociety.libraryBranchesCount +
          secondDetails.cultureAndSociety.culturalCentersCount,
        higherIsBetter: true,
      },
      {
        category: 'Kultura i Seniorzy',
        label: 'Centra Aktywności Seniora (CAS)',
        unit: 'placówek',
        firstValue: firstDetails.cultureAndSociety.seniorActivityCentersCount,
        secondValue: secondDetails.cultureAndSociety.seniorActivityCentersCount,
        higherIsBetter: true,
      },
    ];
  }, [firstDetails, secondDetails]);

  const sortedById = useMemo(
    () => [...districts].sort((a, b) => a.districtId - b.districtId),
    [districts]
  );

  return (
    <section
      id="comparison-section"
      className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-6"
    >
      {/* Header + Dropdown Selectors for District #1 & District #2 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <GitCompareArrows className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Porównywarka Dzielnic Side-by-Side (Wykres Radarowy &amp; Twarde Wskaźniki)
            </h2>
            <p className="text-xs text-slate-500">
              Wybierz dwie dzielnice na mapie, z listy rankingowej lub z poniższych list rozwijanych
            </p>
          </div>
        </div>

        {/* District #1 and District #2 Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200 rounded-2xl px-3 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-extrabold text-blue-800">#1:</span>
            <select
              value={selectedPrimaryId ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val) onSelectPrimary(val);
              }}
              className="bg-white text-xs font-bold text-slate-800 rounded-xl px-2.5 py-1.5 border border-blue-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Wybierz Dzielnicę #1 --</option>
              {sortedById.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName} ({d.weightedQualityOfLifeIndex.toFixed(1)} pkt)
                </option>
              ))}
            </select>
          </div>

          <ArrowLeftRight className="w-4 h-4 text-slate-400 hidden sm:block" />

          <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 rounded-2xl px-3 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span className="text-xs font-extrabold text-indigo-800">#2:</span>
            <select
              value={selectedSecondaryId ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val) onSelectSecondary(val);
              }}
              className="bg-white text-xs font-bold text-slate-800 rounded-xl px-2.5 py-1.5 border border-indigo-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Wybierz Dzielnicę #2 --</option>
              {sortedById.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName} ({d.weightedQualityOfLifeIndex.toFixed(1)} pkt)
                </option>
              ))}
            </select>
          </div>

          {(selectedPrimaryId || selectedSecondaryId) && (
            <button
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Wyczyść
            </button>
          )}
        </div>
      </div>

      {/* Empty State when fewer than 2 districts are selected */}
      {(!firstDetails || !secondDetails) && (
        <div className="py-12 px-4 text-center rounded-2xl bg-gradient-to-b from-blue-50/50 to-white border border-dashed border-blue-200 space-y-3">
          <Sparkles className="w-8 h-8 text-blue-600 mx-auto" />
          <div className="text-sm font-extrabold text-slate-800">
            {loading
              ? 'Pobieranie szczegółowych wskaźników dzielnic z API...'
              : 'Wybierz dwie dzielnice, aby uruchomić pełne porównanie Side-by-Side'}
          </div>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Kliknij dowolne 2 dzielnice bezpośrednio na mapie Krakowa, wybierz je z listy rankingowej po prawej stronie lub skorzystaj z szybkich zestawień poniżej:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                onSelectPrimary(5);
                onSelectSecondary(4);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer"
            >
              Porównaj: V Krowodrza vs IV Prądnik Biały
            </button>
            <button
              onClick={() => {
                onSelectPrimary(1);
                onSelectSecondary(8);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition cursor-pointer"
            >
              Porównaj: I Stare Miasto vs VIII Dębniki
            </button>
            <button
              onClick={() => {
                onSelectPrimary(7);
                onSelectSecondary(18);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer"
            >
              Porównaj: VII Zwierzyniec vs XVIII Nowa Huta
            </button>
          </div>
        </div>
      )}

      {/* Active Comparison Content: Score Cards + Recharts RadarChart + Hard Metrics Table */}
      {firstDetails && secondDetails && (
        <div className="space-y-6">
          {/* Top Summary Cards + Recharts RadarChart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: District #1 vs District #2 Score Summary & Recommendations (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* District #1 Card */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-blue-50/90 to-white border border-blue-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                    Dzielnica #1 • {firstDetails.areaKm2} km²
                  </span>
                  {firstWeightedScore >= secondWeightedScore && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Lider dla Twoich wag
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {firstDetails.districtName}
                  </h3>
                  <span className="text-2xl font-black text-blue-700">
                    {firstWeightedScore.toFixed(1)}{' '}
                    <span className="text-xs font-semibold text-slate-500">/ 100</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-blue-100">
                  <strong className="text-blue-800">Rekomendacja Smart City:</strong>{' '}
                  {firstDetails.forecastsAndB2B.recommendedMunicipalAction}
                </p>
              </div>

              {/* District #2 Card */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-50/90 to-white border border-indigo-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
                    Dzielnica #2 • {secondDetails.areaKm2} km²
                  </span>
                  {secondWeightedScore > firstWeightedScore && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Lider dla Twoich wag
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {secondDetails.districtName}
                  </h3>
                  <span className="text-2xl font-black text-indigo-700">
                    {secondWeightedScore.toFixed(1)}{' '}
                    <span className="text-xs font-semibold text-slate-500">/ 100</span>
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-indigo-100">
                  <strong className="text-indigo-800">Rekomendacja Smart City:</strong>{' '}
                  {secondDetails.forecastsAndB2B.recommendedMunicipalAction}
                </p>
              </div>
            </div>

            {/* Right Column: Recharts 5-Axis RadarChart (7 cols) */}
            <div className="lg:col-span-7 h-92.5 rounded-2xl bg-slate-50/80 border border-blue-100 p-4 flex flex-col">
              <div className="text-xs font-bold text-slate-700 mb-1 text-center">
                Porównanie 5 Wymiarów Jakości Życia (Skala znormalizowana 0–100 pkt)
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="74%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Radar
                      name={firstDetails.districtName}
                      dataKey="first"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="#3b82f6"
                      fillOpacity={0.28}
                    />
                    <Radar
                      name={secondDetails.districtName}
                      dataKey="second"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fill="#6366f1"
                      fillOpacity={0.25}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#bfdbfe',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#0f172a',
                        boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.12)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Hard Infrastructure & Demographic Metrics Table */}
          <div className="rounded-2xl border border-blue-100 overflow-hidden bg-white shadow-xs">
            <div className="px-5 py-3.5 bg-linear-to-r from-blue-50/80 to-sky-50/50 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Tabela Twardych Wskaźników Miejskich (Dane GUS / Otwarte Dane UMK / MSIP)
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zielone podświetlenie oznacza korzystniejszy wskaźnik
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                    <th className="py-3 px-4 font-bold">Kategoria</th>
                    <th className="py-3 px-4 font-bold">Wskaźnik twardy</th>
                    <th className="py-3 px-4 font-extrabold text-blue-700 text-right">
                      #1: {firstDetails.districtName}
                    </th>
                    <th className="py-3 px-4 font-extrabold text-indigo-700 text-right">
                      #2: {secondDetails.districtName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metricRows.map((row, idx) => {
                    const firstWins = row.higherIsBetter
                      ? row.firstValue > row.secondValue
                      : row.firstValue < row.secondValue;
                    const secondWins = row.higherIsBetter
                      ? row.secondValue > row.firstValue
                      : row.secondValue < row.firstValue;

                    const formattedFirst = row.format
                      ? row.format(row.firstValue)
                      : `${row.firstValue} ${row.unit}`;
                    const formattedSecond = row.format
                      ? row.format(row.secondValue)
                      : `${row.secondValue} ${row.unit}`;

                    return (
                      <tr key={idx} className="hover:bg-blue-50/30 transition">
                        <td className="py-2.5 px-4 text-slate-500 font-semibold">{row.category}</td>
                        <td className="py-2.5 px-4 text-slate-800 font-medium">{row.label}</td>
                        <td
                          className={`py-2.5 px-4 text-right font-bold ${
                            firstWins
                              ? 'text-emerald-700 bg-emerald-50/80'
                              : 'text-slate-700'
                          }`}
                        >
                          {formattedFirst} {firstWins && '✓'}
                        </td>
                        <td
                          className={`py-2.5 px-4 text-right font-bold ${
                            secondWins
                              ? 'text-emerald-700 bg-emerald-50/80'
                              : 'text-slate-700'
                          }`}
                        >
                          {formattedSecond} {secondWins && '✓'}
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
    </section>
  );
}
