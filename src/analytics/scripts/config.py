"""
================================================================================
FILE: config.py
PURPOSE:
    Central configuration file for the Krakow360 Python Data Science & Econometrics
    pipeline. Defines directory paths, the official dictionary of all 18 Krakow
    administrative districts, allowed enum constants for the JSON Data Contract,
    coordinate transformation helpers (EPSG:3857 and EPSG:2178 -> WGS84), and
    shared mathematical helper functions (Min-Max 0-100 normalization).

HOW THIS FILE IS USED:
    Imported by scripts 01, 02, 03, and 04. Do NOT rename the constants defined
    here, as they enforce strict compatibility with the .NET 9 Backend and React UI.
================================================================================
"""

from pathlib import Path
import math
import re
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

ROMAN_TO_DISTRICT_ID = {d["districtRoman"]: d["districtId"] for d in KRAKOW_DISTRICTS}
DISTRICT_BY_ID = {d["districtId"]: d for d in KRAKOW_DISTRICTS}

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
    Normalizes a list of 18 raw indicator values (one per district) to a [20.0, 98.0]
    practical scoring scale within [0.0, 100.0] using the standard Min-Max formula:
        norm_i = (x_i - min(x)) / (max(x) - min(x))

    Parameters:
        values (list[float]): List of raw numerical values across the 18 districts.
        invert (bool):
            - Set `invert=False` for STIMULANTS (where higher raw value = better quality of life).
            - Set `invert=True` for DESTIMULANTS (where lower raw value = better quality of life).

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


# ------------------------------------------------------------------------------
# 5. GEOSPATIAL PROJECTION HELPERS (EPSG:3857 & EPSG:2178 -> WGS84)
# ------------------------------------------------------------------------------
def epsg3857_to_wgs84(x: float, y: float) -> tuple[float, float]:
    """Converts Web Mercator (EPSG:3857) coordinates used in ZTP KMK stops to (lat, lng)."""
    lng = (x / 20037508.342789244) * 180.0
    lat = (math.atan(math.exp((y / 20037508.342789244) * math.pi)) * 360.0 / math.pi) - 90.0
    return round(lat, 6), round(lng, 6)


def epsg2178_to_wgs84(easting: float, northing: float) -> tuple[float, float]:
    """Converts PUWG 2000 zone 7 (EPSG:2178) coordinates used in ZTP P+R and bike racks to (lat, lng)."""
    a = 6378137.0
    f = 1.0 / 298.257222101
    e2 = 2 * f - f * f
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    k0 = 0.999923
    lon0 = math.radians(21.0)
    x = easting - 7500000.0
    y = northing
    m_val = y / k0
    mu = m_val / (a * (1 - e2 / 4 - 3 * e2**2 / 64 - 5 * e2**3 / 256))
    phi1 = (
        mu
        + (3 * e1 / 2 - 27 * e1**3 / 32) * math.sin(2 * mu)
        + (21 * e1**2 / 16 - 55 * e1**4 / 32) * math.sin(4 * mu)
        + (151 * e1**3 / 96) * math.sin(6 * mu)
    )
    ep2 = e2 / (1 - e2)
    n1 = a / math.sqrt(1 - e2 * math.sin(phi1) ** 2)
    t1 = math.tan(phi1) ** 2
    c1 = ep2 * math.cos(phi1) ** 2
    r1 = a * (1 - e2) / ((1 - e2 * math.sin(phi1) ** 2) ** 1.5)
    d_val = x / (n1 * k0)
    lat = phi1 - (n1 * math.tan(phi1) / r1) * (
        d_val**2 / 2
        - (5 + 3 * t1 + 10 * c1 - 4 * c1**2 - 9 * ep2) * d_val**4 / 24
        + (61 + 90 * t1 + 298 * c1 + 45 * t1**2 - 252 * ep2 - 3 * c1**2) * d_val**6 / 720
    )
    lon = lon0 + (
        d_val
        - (1 + 2 * t1 + c1) * d_val**3 / 6
        + (5 - 2 * c1 + 28 * t1 - 3 * c1**2 + 8 * ep2 + 24 * t1**2) * d_val**5 / 120
    ) / math.cos(phi1)
    return round(math.degrees(lat), 6), round(math.degrees(lon), 6)


def parse_roman_districts(text: str) -> list[int]:
    """Extracts one or more district IDs (1..18) from strings like 'VII Zwierzyniec' or 'I, II, VII, VIII, XIII'."""
    if not text:
        return []
    tokens = re.findall(r"\b(XVIII|XVII|XVI|XIV|XIII|XII|XI|IX|VIII|VII|VI|IV|III|II|XV|X|V|I)\b", text.upper())
    result = []
    for tok in tokens:
        did = ROMAN_TO_DISTRICT_ID.get(tok)
        if did and did not in result:
            result.append(did)
    return result
