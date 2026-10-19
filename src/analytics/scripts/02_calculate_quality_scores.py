"""
================================================================================
SCRIPT 02: 02_calculate_quality_scores.py
================================================================================
GOAL / PURPOSE:
    Calculate the 5 normalized category scores (scale 0.0 to 100.0) for each of
    the 18 Krakow districts based on the real aggregated Open Data indicators
    produced by Script 01 (`districts_aggregated.json`).
================================================================================
"""

import json
import math
from config import PROCESSED_DATA_DIR, min_max_normalize_0_100


def rescale_to_practical_band(scores: list[float], low: float = 48.0, high: float = 96.0) -> list[float]:
    """
    Maps a composite 0-100 Min-Max vector onto a realistic urban quality band [low, high]
    so that the lowest-scoring district in a category still reflects existing municipal
    services rather than an artificial 0.0%.
    """
    norm = min_max_normalize_0_100(scores, invert=False)
    return [round(low + (x / 100.0) * (high - low), 1) for x in norm]


def calculate_quality_scores() -> None:
    in_path = PROCESSED_DATA_DIR / "districts_aggregated.json"
    if not in_path.exists():
        raise FileNotFoundError(f"Missing {in_path}. Run 01_etl_demographics_and_infrastructure.py first.")

    with open(in_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    districts = payload["districts"]

    # --------------------------------------------------------------------------
    # 1. MOBILITY & TRANSPORT SCORE
    # --------------------------------------------------------------------------
    iso_cov = [d["mobilityAndTransport"]["isochroneCoveragePct"] for d in districts]
    stops_density = [math.log1p(d["mobilityAndTransport"]["kmkStopsCount"] / d["areaKm2"]) for d in districts]
    bike_lane_density = [d["mobilityAndTransport"]["bikeLanesLengthKm"] / d["areaKm2"] for d in districts]
    racks_and_pr = [
        (d["mobilityAndTransport"]["bikeRacksCount"] * 1000.0 / max(d["demographics"]["totalPopulation"], 1))
        + (d["mobilityAndTransport"]["parkAndRideCount"] * 12.0)
        for d in districts
    ]

    s_iso = min_max_normalize_0_100(iso_cov, invert=False)
    s_stops = min_max_normalize_0_100(stops_density, invert=False)
    s_blanes = min_max_normalize_0_100(bike_lane_density, invert=False)
    s_racks = min_max_normalize_0_100(racks_and_pr, invert=False)

    raw_mobility = [
        0.45 * s_iso[i] + 0.25 * s_stops[i] + 0.20 * s_blanes[i] + 0.10 * s_racks[i]
        for i in range(len(districts))
    ]
    mobility_scores = rescale_to_practical_band(raw_mobility, low=54.0, high=96.0)

    # --------------------------------------------------------------------------
    # 2. EDUCATION & EARLY CARE SCORE (0-14 YEARS)
    # --------------------------------------------------------------------------
    nursery_ratio = [d["educationAndCare"]["childrenPerCarePlaceRatio"] for d in districts]
    kg_coverage = [
        min(2.5, d["educationAndCare"]["kindergartenPlacesTotal"] / max(d["demographics"]["age4to6"], 1))
        for d in districts
    ]
    class_size = [d["educationAndCare"]["avgStudentsPerClass"] for d in districts]

    s_nursery = min_max_normalize_0_100(nursery_ratio, invert=True)  # Destimulant: fewer children per place = better
    s_kg = min_max_normalize_0_100(kg_coverage, invert=False)        # Stimulant: higher coverage = better
    s_class = min_max_normalize_0_100(class_size, invert=True)       # Destimulant: smaller classes = better

    raw_education = [
        0.45 * s_nursery[i] + 0.30 * s_kg[i] + 0.25 * s_class[i]
        for i in range(len(districts))
    ]
    education_scores = rescale_to_practical_band(raw_education, low=52.0, high=92.0)

    # --------------------------------------------------------------------------
    # 3. GREENERY & SPORT SCORE
    # --------------------------------------------------------------------------
    green_per_cap = [math.log1p(d["greeneryAndSport"]["greenAreaM2PerCapita"]) for d in districts]
    park_area_share = [
        math.log1p((d["greeneryAndSport"]["totalParksAreaHa"] / (d["areaKm2"] * 100.0)) * 100.0)
        for d in districts
    ]
    sport_per_10k = [
        (
            d["greeneryAndSport"]["schoolSportsFacilitiesCount"]
            + d["greeneryAndSport"]["schoolSwimmingPoolsCount"] * 6.0
        )
        * 10000.0
        / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]

    s_green_cap = min_max_normalize_0_100(green_per_cap, invert=False)
    s_park_share = min_max_normalize_0_100(park_area_share, invert=False)
    s_sport = min_max_normalize_0_100(sport_per_10k, invert=False)

    raw_greenery = [
        0.50 * s_green_cap[i] + 0.25 * s_park_share[i] + 0.25 * s_sport[i]
        for i in range(len(districts))
    ]
    greenery_scores = rescale_to_practical_band(raw_greenery, low=55.0, high=97.0)

    # --------------------------------------------------------------------------
    # 4. CULTURE, LIBRARIES & SENIOR ACTIVITY (CAS) SCORE
    # --------------------------------------------------------------------------
    inst_per_10k = [
        (d["cultureAndSociety"]["libraryBranchesCount"] + d["cultureAndSociety"]["culturalCentersCount"])
        * 10000.0
        / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]
    cas_per_1k_seniors = [
        d["cultureAndSociety"]["seniorActivityCentersCount"]
        * 1000.0
        / max(d["demographics"]["age65Plus"], 1)
        for d in districts
    ]
    subsidy_and_events = [
        math.log1p(d["cultureAndSociety"]["municipalSubsidyPerCapitaPln"])
        + 0.4 * math.log1p(d["cultureAndSociety"]["annualCulturalEventsCount"])
        for d in districts
    ]

    s_inst = min_max_normalize_0_100(inst_per_10k, invert=False)
    s_cas = min_max_normalize_0_100(cas_per_1k_seniors, invert=False)
    s_sub = min_max_normalize_0_100(subsidy_and_events, invert=False)

    raw_culture = [
        0.35 * s_inst[i] + 0.35 * s_cas[i] + 0.30 * s_sub[i]
        for i in range(len(districts))
    ]
    culture_scores = rescale_to_practical_band(raw_culture, low=58.0, high=96.5)

    # --------------------------------------------------------------------------
    # 5. ENVIRONMENT, AIR & QUIETNESS SCORE
    # --------------------------------------------------------------------------
    # Sub-indicator 5a: Ventilation & green buffer index (higher green area per km2 & lower built density)
    ventilation_idx = [
        math.log1p(d["greeneryAndSport"]["greenAreaM2PerCapita"]) + 0.35 * math.log1p(d["areaKm2"])
        for d in districts
    ]
    # Sub-indicator 5b: Crowd & traffic intensity proxy (destimulant)
    crowd_intensity = [
        (d["demographics"]["temporaryResidents"] + d["demographics"]["foreignersTotal"] * 1.5) / d["areaKm2"]
        for d in districts
    ]
    # Sub-indicator 5c: Residential population density per km2 (destimulant)
    pop_density = [d["demographics"]["totalPopulation"] / d["areaKm2"] for d in districts]

    s_vent = min_max_normalize_0_100(ventilation_idx, invert=False)
    s_crowd = min_max_normalize_0_100(crowd_intensity, invert=True)
    s_dens = min_max_normalize_0_100(pop_density, invert=True)

    raw_env = [
        0.45 * s_vent[i] + 0.30 * s_crowd[i] + 0.25 * s_dens[i]
        for i in range(len(districts))
    ]
    env_scores = rescale_to_practical_band(raw_env, low=44.0, high=93.0)

    # Attach scores to each district
    for i, d in enumerate(districts):
        d["scores"] = {
            "mobilityScore": mobility_scores[i],
            "educationScore": education_scores[i],
            "greeneryScore": greenery_scores[i],
            "cultureAndSeniorScore": culture_scores[i],
            "environmentScore": env_scores[i],
        }

    out_path = PROCESSED_DATA_DIR / "districts_scored.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"districts": districts}, f, ensure_ascii=False, indent=2)

    print(f"[Step 02 - Scores] Computed all 5 Quality of Life category scores for {len(districts)} districts.")
    for d in districts[:5]:
        sc = d["scores"]
        print(
            f"  - {d['districtName']}: Mobility={sc['mobilityScore']}, Edu={sc['educationScore']}, "
            f"Green={sc['greeneryScore']}, Culture={sc['cultureAndSeniorScore']}, Env={sc['environmentScore']}"
        )
    print(f"[Step 02 - Scores] Saved scored districts -> {out_path}")


if __name__ == "__main__":
    calculate_quality_scores()
