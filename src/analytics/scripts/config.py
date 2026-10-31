"""
PURPOSE:
    Central configuration file for the Krakow360 Python Data Science & Econometrics
    pipeline. Defines directory paths, the official dictionary of all 18 Krakow
    administrative districts, allowed enum constants for the JSON Data Contract,
    coordinate transformation helpers (EPSG:3857, EPSG:2178, EPSG:2180 -> WGS84), and
    shared mathematical helper functions (Min-Max 0-100 normalization).
"""

from pathlib import Path
import csv
import math
import re
import numpy as np
import pyproj

# 1. DIRECTORY PATHS
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DATA_DIR = BASE_DIR / "data_raw"
PROCESSED_DATA_DIR = BASE_DIR / "data_processed"
CHARTS_DIR = BASE_DIR / "charts"
SCHEMAS_DIR = BASE_DIR / "schemas"
CONTRACTS_OUTPUT_DIR = BASE_DIR.parent.parent / "data" / "contracts"
POI_CONTRACT_PATH = CONTRACTS_OUTPUT_DIR / "krakow_poi_locations.json"
MASTER_CONTRACT_PATH = CONTRACTS_OUTPUT_DIR / "krakow_districts_master.json"
CACHE_PATH = PROCESSED_DATA_DIR / "spatial_geocoding_cache.json"

# 2. OFFICIAL 18 ADMINISTRATIVE DISTRICTS OF KRAKOW (MSIP / District Statutes)
def _load_krakow_districts() -> list[dict]:
    csv_path = RAW_DATA_DIR / "Dzielnice_Krakowa.csv"
    if not csv_path.exists():
        for candidate in RAW_DATA_DIR.glob("*.csv"):
            if "dzielnic" in candidate.name.lower():
                csv_path = candidate
                break

    districts = []
    if csv_path.exists():
        encodings = ["utf-8-sig", "utf-8", "windows-1250", "cp1250", "latin2"]
        for enc in encodings:
            try:
                with open(csv_path, mode="r", encoding=enc) as f:
                    sample = f.read(2048)
                    delimiter = ";" if ";" in sample else ","
                    f.seek(0)
                    reader = csv.DictReader(f, delimiter=delimiter)
                    loaded = []
                    for row in reader:
                        cleaned = {k.strip(): v.strip() for k, v in row.items() if k is not None}
                        did_val = cleaned.get("districtId") or cleaned.get("district_id") or cleaned.get("Nr_Dzielnicy") or cleaned.get("id")
                        if not did_val:
                            continue
                        did = int(did_val)
                        droman = cleaned.get("districtRoman") or cleaned.get("district_roman") or cleaned.get("Roman") or ""
                        dname = cleaned.get("districtName") or cleaned.get("district_name") or cleaned.get("Nazwa") or cleaned.get("Dzielnica") or ""
                        area_str = cleaned.get("areaKm2") or cleaned.get("area_km2") or cleaned.get("Powierzchnia_km2") or cleaned.get("Powierzchnia") or "0"
                        area = float(area_str.replace(",", "."))
                        loaded.append({
                            "districtId": did,
                            "districtRoman": droman,
                            "districtName": dname,
                            "areaKm2": round(area, 2),
                        })
                    if len(loaded) == 18:
                        districts = loaded
                        break
                    elif len(loaded) > 0 and not districts:
                        districts = loaded
            except Exception:
                districts = []
                continue

    if not districts:
        raise FileNotFoundError(f"Could not load Krakow districts from {csv_path}")

    districts.sort(key=lambda d: d["districtId"])
    return districts


KRAKOW_DISTRICTS = _load_krakow_districts()

ROMAN_TO_DISTRICT_ID = {d["districtRoman"]: d["districtId"] for d in KRAKOW_DISTRICTS}
DISTRICT_BY_ID = {d["districtId"]: d for d in KRAKOW_DISTRICTS}

# 3. ALLOWED ENUM VALUES FOR THE DATA CONTRACT
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

# 4. MATHEMATICAL NORMALIZATION HELPER
def min_max_normalize_0_100(values: list[float], invert: bool = False) -> list[float]:
    """
    Normalizes a list of 18 raw indicator values (one per district) to a [0.0, 100.0]
    practical scoring scale using the standard Min-Max formula.
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

# 5. GEOSPATIAL PROJECTION HELPERS (Using official pyproj bindings)
transformer_3857 = pyproj.Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)
transformer_2178 = pyproj.Transformer.from_crs("EPSG:2178", "EPSG:4326", always_xy=True)
transformer_2180 = pyproj.Transformer.from_crs("EPSG:2180", "EPSG:4326", always_xy=True)

def epsg3857_to_wgs84(x: float, y: float) -> tuple[float, float]:
    # Converts Web Mercator (EPSG:3857) used in ZTP KMK stops to WGS84 (lat, lng).
    lon, lat = transformer_3857.transform(x, y)
    return round(lat, 6), round(lon, 6)

def epsg2178_to_wgs84(easting: float, northing: float) -> tuple[float, float]:
    # Converts PUWG 2000 zone 7 (EPSG:2178) used in ZTP P+R and bike racks to WGS84.
    lon, lat = transformer_2178.transform(easting, northing)
    return round(lat, 6), round(lon, 6)

def epsg2180_to_wgs84(x: float, y: float) -> tuple[float, float]:
    # Converts PUWG 1992 (EPSG:2180) used by GUGiK to WGS84.
    lon, lat = transformer_2180.transform(x, y)
    return round(lat, 6), round(lon, 6)

def parse_roman_districts(text: str) -> list[int]:
    # Extracts one or more district IDs (1..18) from strings like 'I, II, VII, VIII, XIII'.
    if not text:
        return []
    tokens = re.findall(r"\b(XVIII|XVII|XVI|XIV|XIII|XII|XI|IX|VIII|VII|VI|IV|III|II|XV|X|V|I)\b", text.upper())
    result = []
    for tok in tokens:
        did = ROMAN_TO_DISTRICT_ID.get(tok)
        if did and did not in result:
            result.append(did)
    return result

# 6. KRAKOW METROPOLITAN BOUNDING BOX (WGS84)
KRAKOW_MIN_LAT = 49.90
KRAKOW_MAX_LAT = 50.20
KRAKOW_MIN_LNG = 19.70
KRAKOW_MAX_LNG = 20.30

def is_in_krakow_bbox(lat: float, lng: float) -> bool:
    return KRAKOW_MIN_LAT <= lat <= KRAKOW_MAX_LAT and KRAKOW_MIN_LNG <= lng <= KRAKOW_MAX_LNG
