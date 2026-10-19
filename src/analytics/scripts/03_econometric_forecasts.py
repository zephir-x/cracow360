"""
================================================================================
SCRIPT 03: 03_econometric_forecasts.py
================================================================================
GOAL / PURPOSE:
    Build econometric / time-series predictive models forecasting demographic
    changes and public infrastructure deficits for the years 2027-2030 across
    all 18 Krakow districts. Also generates static correlation charts for the
    2-page PDF competition report.

EXPECTED INPUTS:
    - Historical demographic time series (1995-2025/2026) from `src/analytics/data_raw/`:
      births, deaths, internal & foreign migration balance, and age cohort registrations per district.
    - Aggregated district metrics and scores from Scripts 01 & 02.

WHAT MUST BE CALCULATED / DONE IN THIS SCRIPT:
    For each of the 18 districts, populate the `forecastsAndB2B` dictionary:

    1. `forecastedAge0to3_2028` (int):
       - Econometric forecast (e.g., linear trend regression / ARIMA / cohort-component model
         using `statsmodels` or `scikit-learn`) of the number of children aged 0-3 in 2028,
         accounting for birth trends, new housing completions, and migration inflow.
    2. `forecastedCarePlacesBalance_2028` (int):
       - Projected surplus or deficit of nursery/kids' club places in 2028 assuming a target
         coverage rate (e.g., EU Barcelona target / municipal coverage benchmark of 50% of children aged 0-3):
         Formula: `int(totalCarePlaces0to3 - (0.50 * forecastedAge0to3_2028))`
         (Negative number = deficit of places; Positive number = reserve/surplus of places).
    3. `forecastedAge4to6_2028` (int):
       - Cohort progression forecast of children aged 4-6 (kindergarten age) in 2028,
         derived from current 0-3 cohort + net family migration rate in the district.
    4. Classification Flags (MUST be strictly `"LOW"`, `"MEDIUM"`, or `"HIGH"`):
       - `nurseryInvestmentPotentialB2B`:
         * `"HIGH"` if `forecastedCarePlacesBalance_2028 < -150` AND `populationGrowthRate3YrPct > 2.0`
         * `"MEDIUM"` if `forecastedCarePlacesBalance_2028 < 0`
         * `"LOW"` otherwise
       - `seniorInfrastructureDeficit`:
         * `"HIGH"` if `age65Plus / totalPopulation > 0.24` AND `seniorActivityCentersCount < 3`
         * `"MEDIUM"` if `age65Plus / totalPopulation > 0.20`
         * `"LOW"` otherwise
       - `greenSpaceDeficit`:
         * `"HIGH"` if `greenAreaM2PerCapita < 10.0`
         * `"MEDIUM"` if `greenAreaM2PerCapita < 18.0`
         * `"LOW"` otherwise
    5. `recommendedMunicipalAction` (str):
       - Concise, data-driven strategic recommendation in Polish (1-2 sentences) explaining
         the highest-priority public or private investment needed in that district.
    6. Static Analytical Charts (saved to `src/analytics/charts/`):
       - Generate 2-3 clean `matplotlib` / `seaborn` charts (e.g., Demographic Growth vs. Nursery Deficit
         scatter plot, Top Districts by B2B Investment Potential) for inclusion in the 2-page PDF report.

EXPECTED OUTPUTS:
    - Final complete `data/contracts/krakow_districts_master.json` containing all 18 districts.
    - High-resolution PNG/PDF plots inside `src/analytics/charts/`.
================================================================================
"""

from config import ALLOWED_POTENTIAL_LEVELS


def run_econometric_forecasts_demo() -> None:
    print("[Step 03 - Forecasts] Econometric time-series / regression pipeline for 2027-2030.")
    print(f"[Step 03 - Forecasts] Allowed B2B/B2G deficit classification levels: {sorted(ALLOWED_POTENTIAL_LEVELS)}")


if __name__ == "__main__":
    run_econometric_forecasts_demo()
