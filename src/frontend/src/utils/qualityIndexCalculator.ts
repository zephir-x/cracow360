import type { DistrictScoresDto, QualityWeights, ResidentPreset } from '../types/contracts';

/**
 * Dynamically calculates the personalized Quality of Life Index on the client side
 * with zero network latency across all 7 urban pillars.
 * 
 * Formula: sum(score_i * weight_i) / sum(weight_i)
 * If total weight <= 0, falls back to unweighted arithmetic average.
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
    weights.environment +
    weights.safety +
    weights.housingAffordability;

  // Fallback to unweighted arithmetic mean if all weights are zero
  if (totalWeight <= 0) {
    return Number(
      (
        (scores.mobilityScore +
          scores.educationScore +
          scores.greeneryScore +
          scores.cultureAndSeniorScore +
          scores.environmentScore +
          scores.safetyScore +
          scores.housingAffordabilityScore) /
        7
      ).toFixed(2)
    );
  }

  // Linear weighted sum across all 7 calibrated urban pillars
  const weightedSum =
    scores.mobilityScore * weights.mobility +
    scores.educationScore * weights.education +
    scores.greeneryScore * weights.greenery +
    scores.cultureAndSeniorScore * weights.culture +
    scores.environmentScore * weights.environment +
    scores.safetyScore * weights.safety +
    scores.housingAffordabilityScore * weights.housingAffordability;

  return Number((weightedSum / totalWeight).toFixed(2));
}

// 6 Curated Resident Persona Presets for 1-click preference configuration
export const RESIDENT_PRESETS: ResidentPreset[] = [
  {
    id: 'rodzina_z_dziecmi',
    label: 'Rodzina z Dziećmi',
    description: 'Priorytet: żłobki, szkoły, bezpieczeństwo, czyste powietrze, tereny zielone',
    weights: {
      education: 10,
      safety: 10,
      greenery: 9,
      environment: 9,
      housingAffordability: 8,
      mobility: 6,
      culture: 3,
    },
  },
  {
    id: 'student_mlody',
    label: 'Student / Młody',
    description: 'Priorytet: szybka komunikacja KMK/DDR, kultura i kluby, przystępny najem',
    weights: {
      mobility: 10,
      culture: 10,
      housingAffordability: 8,
      greenery: 4,
      safety: 3,
      environment: 2,
      education: 1,
    },
  },
  {
    id: 'senior',
    label: 'Aktywny Senior',
    description: 'Priorytet: Centra Seniora (CAS), parki, biblioteki, bezpieczeństwo, czyste powietrze',
    weights: {
      culture: 10,
      safety: 9,
      environment: 9,
      greenery: 8,
      mobility: 7,
      housingAffordability: 5,
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
      housingAffordability: 5,
      culture: 4,
      education: 2,
    },
  },
  {
    id: 'inwestor_biznes',
    label: 'Inwestor / Biznes',
    description: 'Priorytet: mobilność, nasycenie żłobków, dostępność mieszkaniowa pracowników',
    weights: {
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
