import type { DistrictScoresDto, QualityWeights, ResidentPreset } from '../types/contracts';

/**
 * Dynamically calculates the personalized Quality of Life Index on the client side
 * with zero network latency across all 8 urban pillars.
 *
 * Uses a Constant Elasticity of Substitution (CES) / Bottleneck-Aware weighted index:
 * 1. Linear weighted mean across all 8 pillars: mu_w = sum(S_i * w_i) / sum(w_i)
 * 2. Non-compensatory bottleneck penalty for severe urban deficits (S_i < 52.0 pts)
 *    weighted by the square of the user's relative priority (w_i / 10)^2:
 *    Penalty = [ sum((w_i / 10)^2 * max(0, 52 - S_i)^1.5) / sum(w_i / 10) ] * 0.25
 * 3. Urban contrast calibration around Krakow's reference standard (70.0 pts):
 *    Q = 70.0 + ((mu_w - Penalty) - 62.8) * 1.35
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

  // 1. Linear weighted mean across all 8 calibrated urban pillars
  const weightedMean =
    effectivePillars.reduce((acc, p) => acc + p.score * p.weight, 0) / effectiveTotalWeight;

  // 2. Non-compensatory bottleneck penalty for critical deficits below the 52.0 pts threshold
  const BOTTLENECK_THRESHOLD = 52.0;
  let penaltyNumerator = 0;
  let normalizedWeightSum = 0;

  for (const p of effectivePillars) {
    const relWeight = p.weight / 10.0;
    normalizedWeightSum += relWeight;
    if (p.score < BOTTLENECK_THRESHOLD && relWeight > 0) {
      const deficit = BOTTLENECK_THRESHOLD - p.score;
      penaltyNumerator += relWeight * relWeight * Math.pow(deficit, 1.5);
    }
  }

  const bottleneckPenalty =
    normalizedWeightSum > 0 ? (penaltyNumerator / normalizedWeightSum) * 0.25 : 0;

  // 3. Contrast calibration around the healthy municipal standard (70.0 pts)
  const rawNetScore = weightedMean - bottleneckPenalty;
  const calibratedIndex = 70.0 + (rawNetScore - 62.8) * 1.35;

  return Number(Math.min(100, Math.max(0, calibratedIndex)).toFixed(2));
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
