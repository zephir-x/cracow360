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
        higherIsBetter: false, // Lower ratio means easier access to nurseries!
        format: (v) => v.toFixed(2),
      },
      {
        category: 'Edukacja i Opieka',
        label: 'Średnia liczba uczniów w klasie (szkoły podstawowe)',
        unit: 'uczniów',
        firstValue: firstDetails.educationAndCare.avgStudentsPerClass,
        secondValue: secondDetails.educationAndCare.avgStudentsPerClass,
        higherIsBetter: false, // Smaller classes are better!
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
    <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header + Dropdown Selectors for District #1 & District #2 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <GitCompareArrows className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Porównywarka Dzielnic Side-by-Side (Wykres Radarowy &amp; Twarde Wskaźniki)
            </h2>
            <p className="text-xs text-slate-400">
              Wybierz 2 dzielnice klikając na mapie, na liście rankingowej lub z poniższych list rozwijanych
            </p>
          </div>
        </div>

        {/* District #1 and District #2 Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-xs font-bold text-sky-300">#1:</span>
            <select
              value={selectedPrimaryId ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val) onSelectPrimary(val);
              }}
              className="bg-slate-950 text-xs font-semibold text-white rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-sky-400"
            >
              <option value="">-- Wybierz Dzielnicę #1 --</option>
              {sortedById.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName} ({d.weightedQualityOfLifeIndex.toFixed(1)} pkt)
                </option>
              ))}
            </select>
          </div>

          <ArrowLeftRight className="w-4 h-4 text-slate-500 hidden sm:block" />

          <div className="flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl px-3 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
            <span className="text-xs font-bold text-fuchsia-300">#2:</span>
            <select
              value={selectedSecondaryId ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val) onSelectSecondary(val);
              }}
              className="bg-slate-950 text-xs font-semibold text-white rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-fuchsia-400"
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
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Wyczyść
            </button>
          )}
        </div>
      </div>

      {/* Empty State when fewer than 2 districts are selected */}
      {(!firstDetails || !secondDetails) && (
        <div className="py-10 px-4 text-center rounded-xl bg-slate-950/50 border border-dashed border-slate-800 space-y-3">
          <Sparkles className="w-8 h-8 text-sky-400 mx-auto opacity-80" />
          <div className="text-sm font-semibold text-slate-200">
            {loading
              ? 'Pobieranie szczegółowych wskaźników dzielnic z API...'
              : 'Wybierz dwie dzielnice, aby uruchomić pełne porównanie Side-by-Side'}
          </div>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Możesz kliknąć dowolne 2 dzielnice bezpośrednio na mapie Krakowa, wybrać je z listy rankingowej po prawej stronie lub skorzystać z szybkiego porównania poniżej:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                onSelectPrimary(5);
                onSelectSecondary(4);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition cursor-pointer"
            >
              Porównaj: V Krowodrza vs IV Prądnik Biały
            </button>
            <button
              onClick={() => {
                onSelectPrimary(1);
                onSelectSecondary(8);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition cursor-pointer"
            >
              Porównaj: I Stare Miasto vs VIII Dębniki
            </button>
            <button
              onClick={() => {
                onSelectPrimary(7);
                onSelectSecondary(18);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
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
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-400/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    Dzielnica #1 • {firstDetails.areaKm2} km²
                  </span>
                  {firstWeightedScore >= secondWeightedScore && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Award className="w-3 h-3" />
                      Lider dla Twoich wag
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{firstDetails.districtName}</h3>
                  <span className="text-xl font-extrabold text-sky-300">
                    {firstWeightedScore.toFixed(1)} <span className="text-xs font-normal">/ 100</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-sky-500/20">
                  <strong className="text-sky-300">Rekomendacja Smart City:</strong>{' '}
                  {firstDetails.forecastsAndB2B.recommendedMunicipalAction}
                </p>
              </div>

              {/* District #2 Card */}
              <div className="p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300">
                    Dzielnica #2 • {secondDetails.areaKm2} km²
                  </span>
                  {secondWeightedScore > firstWeightedScore && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Award className="w-3 h-3" />
                      Lider dla Twoich wag
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{secondDetails.districtName}</h3>
                  <span className="text-xl font-extrabold text-fuchsia-300">
                    {secondWeightedScore.toFixed(1)}{' '}
                    <span className="text-xs font-normal">/ 100</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-fuchsia-500/20">
                  <strong className="text-fuchsia-300">Rekomendacja Smart City:</strong>{' '}
                  {secondDetails.forecastsAndB2B.recommendedMunicipalAction}
                </p>
              </div>
            </div>

            {/* Right Column: Recharts 5-Axis RadarChart (7 cols) */}
            <div className="lg:col-span-7 h-[360px] rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex flex-col">
              <div className="text-xs font-semibold text-slate-300 mb-1 text-center">
                Profil 5 Wymiarów Jakości Życia (Skala znormalizowana 0–100 pkt)
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="74%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Radar
                      name={firstDetails.districtName}
                      dataKey="first"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      fill="#38bdf8"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name={secondDetails.districtName}
                      dataKey="second"
                      stroke="#e879f9"
                      strokeWidth={2.5}
                      fill="#e879f9"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Hard Infrastructure & Demographic Metrics Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50">
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Tabela Twardych Wskaźników Miejskich (Dane GUS / Otwarte Dane UMK / MSIP)
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zielone podświetlenie oznacza korzystniejszy wskaźnik
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400">
                    <th className="py-2.5 px-4 font-semibold">Kategoria</th>
                    <th className="py-2.5 px-4 font-semibold">Wskaźnik twardy</th>
                    <th className="py-2.5 px-4 font-bold text-sky-300 text-right">
                      #1: {firstDetails.districtName}
                    </th>
                    <th className="py-2.5 px-4 font-bold text-fuchsia-300 text-right">
                      #2: {secondDetails.districtName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
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
                      <tr key={idx} className="hover:bg-slate-900/40 transition">
                        <td className="py-2.5 px-4 text-slate-400 font-medium">{row.category}</td>
                        <td className="py-2.5 px-4 text-slate-200">{row.label}</td>
                        <td
                          className={`py-2.5 px-4 text-right font-semibold ${
                            firstWins ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
                          }`}
                        >
                          {formattedFirst} {firstWins && '✓'}
                        </td>
                        <td
                          className={`py-2.5 px-4 text-right font-semibold ${
                            secondWins ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
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
