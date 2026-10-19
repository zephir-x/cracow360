"""
================================================================================
SCRIPT 02: 02_calculate_quality_scores.py
================================================================================
GOAL / PURPOSE:
    Calculate the 5 normalized category scores (scale 0.0 to 100.0) for each of
    the 18 Krakow districts. These 5 scores are the core mathematical foundation
    of Module 1 ("Resident Mode - Quality of Life Index").

EXPECTED INPUTS:
    - Aggregated district metrics produced by Script 01
      (`src/analytics/data_processed/districts_aggregated.json`).

WHAT MUST BE CALCULATED / DONE IN THIS SCRIPT:
    For each of the 5 Quality of Life categories, compute sub-indicators per capita
    or per km2 (to avoid biasing large districts over small dense districts), normalize
    each sub-indicator across the 18 districts using `min_max_normalize_0_100(values, invert=...)`,
    and compute the weighted composite category score (0.0 - 100.0):

    1. `mobilityScore` (0.0 - 100.0):
       - Sub-indicator 1a: `isochroneCoveragePct` (Stimulant -> `invert=False`, weight: 0.45)
       - Sub-indicator 1b: KMK stops density = `kmkStopsCount / areaKm2` (Stimulant -> `invert=False`, weight: 0.25)
       - Sub-indicator 1c: Bike lane density = `bikeLanesLengthKm / areaKm2` (Stimulant -> `invert=False`, weight: 0.20)
       - Sub-indicator 1d: Bike racks per 1,000 residents + P+R bonus (Stimulant -> `invert=False`, weight: 0.10)

    2. `educationScore` (0.0 - 100.0):
       - Sub-indicator 2a: `childrenPerCarePlaceRatio` (DESTIMULANT -> `invert=True`, weight: 0.45)
         (Lower ratio of children per nursery place = easier admission = higher score!)
       - Sub-indicator 2b: Kindergarten coverage = `kindergartenPlacesTotal / max(age4to6, 1)`
         (Stimulant -> `invert=False`, weight: 0.30)
       - Sub-indicator 2c: `avgStudentsPerClass` in primary schools (DESTIMULANT -> `invert=True`, weight: 0.25)
         (Smaller class sizes = higher comfort and quality of education = higher score!)

    3. `greeneryScore` (0.0 - 100.0):
       - Sub-indicator 3a: `greenAreaM2PerCapita` (Stimulant -> `invert=False`, weight: 0.50)
       - Sub-indicator 3b: Share of park area in total district area = `(totalParksAreaHa / (areaKm2 * 100))`
         (Stimulant -> `invert=False`, weight: 0.25)
       - Sub-indicator 3c: School sports facilities & swimming pools per 10,000 residents
         (Stimulant -> `invert=False`, weight: 0.25)

    4. `cultureAndSeniorScore` (0.0 - 100.0):
       - Sub-indicator 4a: Library branches & cultural centers per 10,000 residents
         (Stimulant -> `invert=False`, weight: 0.35)
       - Sub-indicator 4b: Senior Activity Centers (CAS) per 1,000 seniors (`age65Plus`)
         (Stimulant -> `invert=False`, weight: 0.35)
       - Sub-indicator 4c: `annualCulturalEventsCount` & `municipalSubsidyPerCapitaPln`
         (Stimulant -> `invert=False`, weight: 0.30)

    5. `environmentScore` (0.0 - 100.0):
       - Sub-indicator 5a: Historical average air quality index / PM10 & PM2.5 levels from GIOS
         (DESTIMULANT -> `invert=True`, weight: 0.50)
       - Sub-indicator 5b: Tourist crowd intensity & vehicle congestion proxy
         (DESTIMULANT -> `invert=True`, weight: 0.30)
       - Sub-indicator 5c: Low residential population density = `totalPopulation / areaKm2`
         (DESTIMULANT -> `invert=True`, weight: 0.20)

EXPECTED OUTPUTS:
    - Updates each district record with the `scores` object:
      `{"mobilityScore": float, "educationScore": float, "greeneryScore": float, "cultureAndSeniorScore": float, "environmentScore": float}`
================================================================================
"""

from config import min_max_normalize_0_100


def calculate_quality_scores_demo() -> None:
    sample_raw_stops = [48, 64, 58]
    normalized = min_max_normalize_0_100(sample_raw_stops, invert=False)
    print(f"[Step 02 - Scores] Sample Min-Max normalization (0-100): {sample_raw_stops} -> {normalized}")


if __name__ == "__main__":
    calculate_quality_scores_demo()
