import type { DistrictScoresDto, QualityWeights, ResidentPreset } from '../types/contracts';

/**
 * Dynamically calculates the personalized Quality of Life Index on the client side
 * with zero network latency across all 8 urban pillars.
 *
 * Strictly follows pure, transparent weighted arithmetic mean:
 * Q = sum(S_i * w_i) / sum(w_i)
 *
 * No artificial bottleneck penalties, no arbitrary contrast stretching, no magic numbers.
 */
export function calculateClientSideQualityIndex(
  scores: DistrictScoresDto,
  weights: QualityWeights
): number {
  const pillars: Array<{ score: number; weight: number }> = [
    { score: scores.mobilityScore, weight: Math.max(0, weights.mobility) },
    { score: scores.educationScore, weight: Math.max(0, weights.education) },
    { score: scores.greeneryScore, weight: Math.max(0, weights.greenery) },
    { score: scores.cultureAndSeniorScore, weight: Math.max(0, weights.culture) },
    { score: scores.environmentScore, weight: Math.max(0, weights.environment) },
    { score: scores.safetyScore, weight: Math.max(0, weights.safety) },
    { score: scores.housingAffordabilityScore, weight: Math.max(0, weights.housingAffordability) },
    { score: scores.demographicVitalityScore, weight: Math.max(0, weights.demographicVitality) },
  ];

  const totalWeight = pillars.reduce((acc, p) => acc + p.weight, 0);

  // If all sliders are pulled to 0, treat as equal weights (5.0 each)
  const effectivePillars =
    totalWeight <= 0
      ? pillars.map((p) => ({ score: p.score, weight: 5.0 }))
      : pillars;
  const effectiveTotalWeight = totalWeight <= 0 ? 40.0 : totalWeight;

  // Pure weighted arithmetic mean across all 8 objective urban pillars
  const weightedMean =
    effectivePillars.reduce((acc, p) => acc + p.score * p.weight, 0) / effectiveTotalWeight;

  return Number(Math.min(100, Math.max(0, weightedMean)).toFixed(2));
}

// 6 Curated Resident Persona Presets for 1-click preference configuration
export const RESIDENT_PRESETS: ResidentPreset[] = [
  {
    id: 'rodzina_z_dziecmi',
    label: 'Rodzina z Dziećmi',
    description: 'Priorytet: żłobki, szkoły, bezpieczeństwo, czyste powietrze, tereny zielone i dojazd',
    weights: {
      education: 10,
      safety: 9,
      greenery: 9,
      environment: 8,
      mobility: 7,
      housingAffordability: 7,
      demographicVitality: 6,
      culture: 4,
    },
  },
  {
    id: 'student_mlody',
    label: 'Student / Młody',
    description: 'Priorytet: szybka komunikacja KMK/DDR, witalność i młodość, kultura, przystępny najem',
    weights: {
      mobility: 10,
      culture: 9,
      demographicVitality: 9,
      housingAffordability: 8,
      greenery: 5,
      safety: 3,
      environment: 2,
      education: 1,
    },
  },
  {
    id: 'senior',
    label: 'Aktywny Senior',
    description: 'Priorytet: Centra Seniora (CAS), parki, komunikacja KMK, bezpieczeństwo i spokój',
    weights: {
      culture: 9,
      greenery: 9,
      environment: 9,
      safety: 9,
      mobility: 8,
      housingAffordability: 5,
      demographicVitality: 3,
      education: 1,
    },
  },
  {
    id: 'zdalny_freelancer',
    label: 'Pracownik Zdalny',
    description: 'Priorytet: czyste powietrze, cisza, przystępne większe mieszkanie, spacery w zieleni',
    weights: {
      environment: 10,
      greenery: 9,
      housingAffordability: 8,
      safety: 8,
      demographicVitality: 6,
      mobility: 5,
      culture: 5,
      education: 2,
    },
  },
  {
    id: 'cyklista_eko',
    label: 'Cyklista / Eko',
    description: 'Priorytet: ścieżki rowerowe DDR, KMK, tereny zielone, czyste powietrze, bezpieczny ruch',
    weights: {
      mobility: 10,
      greenery: 10,
      environment: 9,
      safety: 8,
      demographicVitality: 6,
      housingAffordability: 5,
      culture: 4,
      education: 2,
    },
  },
  {
    id: 'inwestor_biznes',
    label: 'Inwestor / Biznes',
    description: 'Priorytet: witalność demograficzna, wzrost populacji, mobilność, dostępność mieszkań',
    weights: {
      demographicVitality: 10,
      mobility: 10,
      housingAffordability: 8,
      safety: 7,
      education: 6,
      culture: 6,
      environment: 4,
      greenery: 4,
    },
  },
];
