import type { DistrictScoresDto, QualityWeights, ResidentPreset } from '../types/contracts';

/**
 * Dynamically calculates the personalized Quality of Life Index on the client side
 * with zero network latency (as specified in Module 1 - Resident Mode).
 */
export function calculateClientSideQualityIndex(
  scores: DistrictScoresDto,
  weights: QualityWeights
): number {
  const totalWeight =
    weights.mobility +
    weights.education +
    weights.greenery +
    weights.culture +
    weights.environment;

  if (totalWeight <= 0) {
    return Number(
      (
        (scores.mobilityScore +
          scores.educationScore +
          scores.greeneryScore +
          scores.cultureAndSeniorScore +
          scores.environmentScore) /
        5
      ).toFixed(2)
    );
  }

  const weightedSum =
    scores.mobilityScore * weights.mobility +
    scores.educationScore * weights.education +
    scores.greeneryScore * weights.greenery +
    scores.cultureAndSeniorScore * weights.culture +
    scores.environmentScore * weights.environment;

  return Number((weightedSum / totalWeight).toFixed(2));
}

export const RESIDENT_PRESETS: ResidentPreset[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Wysoka waga: Mobilność, Kultura; Niska: Edukacja wczesnoszkolna',
    weights: { mobility: 10, education: 1, greenery: 6, culture: 9, environment: 5 },
  },
  {
    id: 'single_pro',
    label: 'Singiel / Młody',
    description: 'Wysoka waga: Mobilność, Zieleń i Sport, Kultura',
    weights: { mobility: 9, education: 2, greenery: 8, culture: 8, environment: 6 },
  },
  {
    id: 'family_2_1',
    label: 'Rodzina 2+1',
    description: 'Wysoka waga: Edukacja i Opieka, Zieleń, Środowisko i Spokój',
    weights: { mobility: 6, education: 10, greenery: 9, culture: 5, environment: 9 },
  },
  {
    id: 'active_senior',
    label: 'Aktywny Senior',
    description: 'Wysoka waga: Kultura i CAS, Środowisko i Spokój, Mobilność KMK',
    weights: { mobility: 8, education: 1, greenery: 8, culture: 10, environment: 9 },
  },
];
