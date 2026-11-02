/**
 * Kraków Education & Childcare Physical Infrastructure Constants and Estimators.
 *
 * SSoT (Single Source of Truth) for calculating municipal educational capacity:
 * - Nurseries & childcare clubs (0–3): exact registry physical places (totalCarePlaces0To3)
 * - Kindergartens & preschool points (4–6): exact registry physical places (kindergartenPlacesTotal)
 * - Primary schools SP (7–14): standard physical capacity based on municipal infrastructure guidelines (350 places / school facility)
 */

export const PRIMARY_SCHOOL_STANDARD_CAPACITY = 350;

/**
 * Calculates estimated physical capacity for primary schools.
 * @param schoolsCount Total number of primary schools in the district / city
 */
export function calculatePrimarySchoolCapacity(schoolsCount: number): number {
  return Math.max(0, schoolsCount) * PRIMARY_SCHOOL_STANDARD_CAPACITY;
}

/**
 * Calculates total 0–14 education and care physical capacity across all 3 tiers.
 * @param carePlaces Total physical places for 0–3 toddlers
 * @param kindergartenPlaces Total physical places for 4–6 preschoolers
 * @param primarySchoolsCount Total number of primary schools
 */
export function calculateTotalEduCareCapacity(
  carePlaces: number,
  kindergartenPlaces: number,
  primarySchoolsCount: number
): number {
  return (
    Math.max(0, carePlaces) +
    Math.max(0, kindergartenPlaces) +
    calculatePrimarySchoolCapacity(primarySchoolsCount)
  );
}
