"""
================================================================================
FILE: config.py
PURPOSE:
    Central configuration file for the Krakow360 Python Data Science & Econometrics
    pipeline. Defines directory paths, the official dictionary of all 18 Krakow
    administrative districts, allowed enum constants for the JSON Data Contract,
    and shared mathematical helper functions (such as Min-Max 0-100 normalization).

HOW THIS FILE IS USED:
    Imported by scripts 01, 02, 03, and 04. Do NOT rename the constants defined
    here, as they enforce strict compatibility with the .NET 9 Backend and React UI.
================================================================================
"""

from pathlib import Path
import numpy as np

# ------------------------------------------------------------------------------
# 1. DIRECTORY PATHS
# ------------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DATA_DIR = BASE_DIR / "data_raw"
PROCESSED_DATA_DIR = BASE_DIR / "data_processed"
CHARTS_DIR = BASE_DIR / "charts"
SCHEMAS_DIR = BASE_DIR / "schemas"
CONTRACTS_OUTPUT_DIR = BASE_DIR.parent.parent / "data" / "contracts"

# ------------------------------------------------------------------------------
# 2. OFFICIAL 18 ADMINISTRATIVE DISTRICTS OF KRAKOW (MSIP / District Statutes)
# ------------------------------------------------------------------------------
# Every district record in `krakow_districts_master.json` MUST use these exact
# `districtId` (1..18), `districtRoman` ("I".."XVIII"), `districtName`, and `areaKm2`.
KRAKOW_DISTRICTS = [
    {"districtId": 1, "districtRoman": "I", "districtName": "Dzielnica I Stare Miasto", "areaKm2": 5.57},
    {"districtId": 2, "districtRoman": "II", "districtName": "Dzielnica II Grzegórzki", "areaKm2": 5.85},
    {"districtId": 3, "districtRoman": "III", "districtName": "Dzielnica III Prądnik Czerwony", "areaKm2": 6.44},
    {"districtId": 4, "districtRoman": "IV", "districtName": "Dzielnica IV Prądnik Biały", "areaKm2": 23.42},
    {"districtId": 5, "districtRoman": "V", "districtName": "Dzielnica V Krowodrza", "areaKm2": 5.62},
    {"districtId": 6, "districtRoman": "VI", "districtName": "Dzielnica VI Bronowice", "areaKm2": 9.56},
    {"districtId": 7, "districtRoman": "VII", "districtName": "Dzielnica VII Zwierzyniec", "areaKm2": 28.73},
    {"districtId": 8, "districtRoman": "VIII", "districtName": "Dzielnica VIII Dębniki", "areaKm2": 46.19},
    {"districtId": 9, "districtRoman": "IX", "districtName": "Dzielnica IX Łagiewniki-Borek Fałęcki", "areaKm2": 5.42},
    {"districtId": 10, "districtRoman": "X", "districtName": "Dzielnica X Swoszowice", "areaKm2": 25.60},
    {"districtId": 11, "districtRoman": "XI", "districtName": "Dzielnica XI Podgórze Duchackie", "areaKm2": 9.54},
    {"districtId": 12, "districtRoman": "XII", "districtName": "Dzielnica XII Bieżanów-Prokocim", "areaKm2": 18.47},
    {"districtId": 13, "districtRoman": "XIII", "districtName": "Dzielnica XIII Podgórze", "areaKm2": 25.67},
    {"districtId": 14, "districtRoman": "XIV", "districtName": "Dzielnica XIV Czyżyny", "areaKm2": 12.26},
    {"districtId": 15, "districtRoman": "XV", "districtName": "Dzielnica XV Mistrzejowice", "areaKm2": 5.59},
    {"districtId": 16, "districtRoman": "XVI", "districtName": "Dzielnica XVI Bieńczyce", "areaKm2": 3.70},
    {"districtId": 17, "districtRoman": "XVII", "districtName": "Dzielnica XVII Wzgórza Krzesławickie", "areaKm2": 23.82},
    {"districtId": 18, "districtRoman": "XVIII", "districtName": "Dzielnica XVIII Nowa Huta", "areaKm2": 65.41},
]

# ------------------------------------------------------------------------------
# 3. ALLOWED ENUM VALUES FOR THE DATA CONTRACT
# ------------------------------------------------------------------------------
ALLOWED_POI_CATEGORIES = {
    "EDU_CARE",
    "GREENERY",
    "CULTURE_SOCIETY",
    "MOBILITY",
}

ALLOWED_POI_SUBCATEGORIES = {
    "NURSERY_PUBLIC",
    "NURSERY_CONTRACTED",
    "NURSERY_PRIVATE",
    "KIDS_CLUB",
    "PARENT_CLUB",
    "KINDERGARTEN",
    "PRIMARY_SCHOOL",
    "SCHOOL_SPORT",
    "CITY_PARK",
    "POCKET_PARK",
    "LIBRARY",
    "CULTURAL_CENTER",
    "SENIOR_CENTER",
    "PARK_AND_RIDE",
}

ALLOWED_POTENTIAL_LEVELS = {"LOW", "MEDIUM", "HIGH"}


# ------------------------------------------------------------------------------
# 4. MATHEMATICAL NORMALIZATION HELPER
# ------------------------------------------------------------------------------
def min_max_normalize_0_100(values: list[float], invert: bool = False) -> list[float]:
    """
    Normalizes a list of 18 raw indicator values (one per district) to a [0.0, 100.0] scale
    using the standard Min-Max formula:
        score_i = ((x_i - min(x)) / (max(x) - min(x))) * 100

    Parameters:
        values (list[float]): List of raw numerical values across the 18 districts.
        invert (bool):
            - Set `invert=False` for STIMULANTS (where higher raw value = better quality of life,
              e.g., green area per capita, KMK stops per km2, isochrone coverage %).
            - Set `invert=True` for DESTIMULANTS (where lower raw value = better quality of life,
              e.g., children per 1 nursery place, average students per class, air pollution/traffic).

    Returns:
        list[float]: Normalized scores rounded to 1 decimal place in the range [0.0, 100.0].
    """
    arr = np.array(values, dtype=float)
    min_val = np.min(arr)
    max_val = np.max(arr)
    if np.isclose(max_val, min_val):
        return [50.0 for _ in values]

    norm = (arr - min_val) / (max_val - min_val) * 100.0
    if invert:
        norm = 100.0 - norm

    return [round(float(x), 1) for x in norm]
