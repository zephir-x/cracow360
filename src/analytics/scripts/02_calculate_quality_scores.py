"""
GOAL / PURPOSE:
    Calculate the 8 normalized category quality scores (scale 0.0 to 100.0) for
    each of the 18 Krakow districts based on the real aggregated municipal Open
    Data indicators produced by Script 01 (`districts_aggregated.json`).

PILLARS EVALUATED:
    1. mobilityScore – Public transport (KMK), Park & Ride (P+R) hubs, and cycling infrastructure
    2. educationScore – Nurseries, kindergartens, primary schools, and childcare infrastructure
    3. greeneryScore – City parks, pocket parks, municipal forests, and sports facilities
    4. cultureAndSeniorScore – Libraries, cultural centers, and Senior Activity Centers (CAS)
    5. environmentScore – Clean air (PM10 levels via GIOŚ), absence of transit noise, and green buffers
    6. safetyScore – Road safety, absence of pedestrian accidents, and public order (data from SEWiK / Municipal Police)
    7. housingAffordabilityScore – Affordability of purchasing or renting residential property (data from NBP / Otodom / RCN)
    8. demographicVitalityScore – Demographic vitality, 3-year population trends, and migration attractiveness (data from BDK UMK)
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

# Ensure script-level imports resolve config cleanly regardless of execution working directory
sys.path.append(str(Path(__file__).resolve().parent))

from config import PROCESSED_DATA_DIR, min_max_normalize_0_100


def rescale_to_practical_band(scores: list[float], low: float = 48.0, high: float = 96.0) -> list[float]:
    """
    Maps a composite 0-100 Min-Max vector onto a realistic urban quality band [low, high]
    so that the lowest-scoring district in a category still reflects existing municipal
    services rather than an artificial 0.0%.

    Args:
        scores: Raw composite score list across the 18 districts.
        low: Calibrated lower bound of the practical urban band.
        high: Calibrated upper bound of the practical urban band.

    Returns:
        List of rescaled float scores rounded to 1 decimal place.
    """
    norm = min_max_normalize_0_100(scores, invert=False)
    return [round(low + (x / 100.0) * (high - low), 1) for x in norm]


def calculate_quality_scores() -> None:
    """
    Main analytical workflow:
    1. Ingests cleaned aggregate indicators from `data_processed/districts_aggregated.json`.
    2. Computes stimulants and destimulants across all 8 urban quality dimensions.
    3. Applies logarithmic scaling (math.log1p) and functional population weighting where needed.
    4. Maps composite indices to calibrated practical score bands.
    5. Saves the scored districts to `data_processed/districts_scored.json`.
    """
    in_path = PROCESSED_DATA_DIR / "districts_aggregated.json"
    if not in_path.exists():
        raise FileNotFoundError(f"Missing {in_path}. Run 01_etl_demographics_and_infrastructure.py first.")

    with open(in_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    districts = payload["districts"]
    n_districts = len(districts)

    # 1. MOBILITY & TRANSPORT SCORE
    # Indicators:
    # - 500m walking isochrone % (calibrated discounting low-frequency on-demand stops)
    # - Tram rapid transit density & share (high capacity, dedicated tracks, rapid intervals)
    # - Timetable service frequency & line diversity proxy (schedule display frames & cases / km2)
    # - Bike lane network density (DDR and separated lanes km/km2)
    # - Intermodal capacity (ZTP bike racks per 1k residents + Park & Ride commuter hubs)
    iso_cov = [d["mobilityAndTransport"]["isochroneCoveragePct"] for d in districts]
    tram_density = [
        math.log1p(d["mobilityAndTransport"]["tramStopsCount"] / d["areaKm2"])
        * (1.0 + (d["mobilityAndTransport"]["tramNetworkSharePct"] / 100.0))
        for d in districts
    ]
    service_density = [
        math.log1p(d["mobilityAndTransport"]["scheduleBoardsCount"] / d["areaKm2"])
        for d in districts
    ]
    bike_lane_density = [d["mobilityAndTransport"]["bikeLanesLengthKm"] / d["areaKm2"] for d in districts]
    intermodal_hubs = [
        (d["mobilityAndTransport"]["bikeRacksCount"] * 1000.0 / max(d["demographics"]["totalPopulation"], 1))
        + (d["mobilityAndTransport"]["parkAndRideCount"] * 12.0)
        for d in districts
    ]

    # Normalize components (all stimulants: higher values indicate superior transit access & frequency)
    s_iso = min_max_normalize_0_100(iso_cov, invert=False)
    s_tram = min_max_normalize_0_100(tram_density, invert=False)
    s_service = min_max_normalize_0_100(service_density, invert=False)
    s_bike = min_max_normalize_0_100(bike_lane_density, invert=False)
    s_intermodal = min_max_normalize_0_100(intermodal_hubs, invert=False)

    # Weighting: 30% walking isochrone, 25% tram rapid network, 20% timetable service frequency, 15% bike lanes DDR, 10% intermodal P+R & racks
    raw_mobility = [
        0.30 * s_iso[i] + 0.25 * s_tram[i] + 0.20 * s_service[i] + 0.15 * s_bike[i] + 0.10 * s_intermodal[i]
        for i in range(n_districts)
    ]
    # Practical band [28.0, 96.0]: appropriately penalizes car-dependent outer areas lacking tram lines
    mobility_scores = rescale_to_practical_band(raw_mobility, low=28.0, high=96.0)

    # 2. EDUCATION & EARLY CARE SCORE (0-14 YEARS)
    # Indicators: nursery place pressure (destimulant), kindergarten coverage %, primary school class size
    nursery_ratio = [d["educationAndCare"]["childrenPerCarePlaceRatio"] for d in districts]
    kg_coverage = [
        min(2.5, d["educationAndCare"]["kindergartenPlacesTotal"] / max(d["demographics"]["age4to6"], 1))
        for d in districts
    ]
    class_size = [d["educationAndCare"]["avgStudentsPerClass"] for d in districts]

    # Normalization: lower nursery ratio = better (invert=True), smaller classes = better (invert=True)
    s_nursery = min_max_normalize_0_100(nursery_ratio, invert=True)
    s_kg = min_max_normalize_0_100(kg_coverage, invert=False)
    s_class = min_max_normalize_0_100(class_size, invert=True)

    # Weighting: 45% nursery ratio, 30% kindergarten coverage, 25% primary school class size
    raw_education = [
        0.45 * s_nursery[i] + 0.30 * s_kg[i] + 0.25 * s_class[i]
        for i in range(n_districts)
    ]
    education_scores = rescale_to_practical_band(raw_education, low=52.0, high=92.0)

    # 3. GREENERY & SPORT SCORE (Parks, Pocket Parks, Forests, Swimming Pools)
    # Indicators: green m2 per resident (log), biological area coverage % (log), sports & swimming pools per 10k
    total_green_per_cap = [math.log1p(d["greeneryAndSport"]["totalGreenM2PerCapita"]) for d in districts]
    green_area_share = [
        math.log1p((d["greeneryAndSport"]["totalGreenAreaHa"] / (d["areaKm2"] * 100.0)) * 100.0)
        for d in districts
    ]
    sport_per_10k = [
        (
            d["greeneryAndSport"]["schoolSportsFacilitiesCount"]
            + d["greeneryAndSport"]["schoolSwimmingPoolsCount"] * 8.0
        )
        * 10000.0
        / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]

    # Normalize green components (stimulants: more nature and recreational facilities = better)
    s_green_cap = min_max_normalize_0_100(total_green_per_cap, invert=False)
    s_green_share = min_max_normalize_0_100(green_area_share, invert=False)
    s_sport = min_max_normalize_0_100(sport_per_10k, invert=False)

    # Weighting: 50% green space per capita, 25% district green share, 25% sport & swimming pools
    raw_greenery = [
        0.50 * s_green_cap[i] + 0.25 * s_green_share[i] + 0.25 * s_sport[i]
        for i in range(n_districts)
    ]
    greenery_scores = rescale_to_practical_band(raw_greenery, low=55.0, high=97.0)

    # 4. CULTURE, LIBRARIES & SENIOR ACTIVITY (CAS) SCORE
    # Indicators: library branches & cultural centers per 10k, CAS per senior, cultural subsidy & annual events
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

    # Normalize cultural components
    s_inst = min_max_normalize_0_100(inst_per_10k, invert=False)
    s_cas = min_max_normalize_0_100(cas_per_1k_seniors, invert=False)
    s_sub = min_max_normalize_0_100(subsidy_and_events, invert=False)

    # Weighting: 40% library & cultural centers, 30% senior centers (CAS), 30% cultural subsidy & events
    raw_culture = [
        0.40 * s_inst[i] + 0.30 * s_cas[i] + 0.30 * s_sub[i]
        for i in range(n_districts)
    ]
    culture_scores = rescale_to_practical_band(raw_culture, low=58.0, high=96.5)

    # 5. ENVIRONMENT, AIR & ACOUSTIC QUIETNESS SCORE (GIOŚ, WIOŚ, MSIP)
    # Indicators: PM10 concentration (destimulant), annual smog days (destimulant), noise >65dB (destimulant)
    pm10_vals = [d["environmentalQuality"]["pm10AnnualUgM3"] for d in districts]
    smog_days = [d["environmentalQuality"]["smogDaysCount"] for d in districts]
    noise_share = [d["environmentalQuality"]["trafficNoiseExceededPct"] for d in districts]
    green_buffer = [math.log1p(d["greeneryAndSport"]["totalGreenM2PerCapita"]) for d in districts]

    # Normalize pollution destimulants and green buffer stimulant
    s_pm10 = min_max_normalize_0_100(pm10_vals, invert=True)
    s_smog = min_max_normalize_0_100(smog_days, invert=True)
    s_noise = min_max_normalize_0_100(noise_share, invert=True)
    s_green_buf = min_max_normalize_0_100(green_buffer, invert=False)

    # Weighting: 30% PM10, 25% smog days, 25% traffic noise >65dB, 20% green buffer
    raw_env = [
        0.30 * s_pm10[i] + 0.25 * s_smog[i] + 0.25 * s_noise[i] + 0.20 * s_green_buf[i]
        for i in range(n_districts)
    ]
    env_scores = rescale_to_practical_band(raw_env, low=45.0, high=94.0)

    # 6. PUBLIC SAFETY & TRAFFIC SAFETY SCORE (SEWiK KGP, Municipal Police)
    # Standard IRMiR/GUS calibration: account for functional daytime active population
    daytime_factors = {1: 3.0, 2: 1.6, 5: 1.3, 13: 1.2}

    def effective_population(d: dict) -> float:
        factor = daytime_factors.get(d["districtId"], 1.0)
        return max(d["demographics"]["totalPopulation"] * factor, 1.0)

    collisions_per_1k = [
        math.log1p(d["publicSafety"]["roadCollisionsAnnual"] * 1000.0 / effective_population(d))
        for d in districts
    ]
    pedestrians_per_10k = [
        math.log1p(
            (d["publicSafety"]["pedestrianAccidents"] * 2.0 + d["publicSafety"]["injuryAccidents"])
            * 10000.0
            / effective_population(d)
        )
        for d in districts
    ]
    disturbance_per_1k = [
        math.log1p(d["publicSafety"]["publicDisturbanceInterventions"] * 1000.0 / effective_population(d))
        for d in districts
    ]

    s_collisions = min_max_normalize_0_100(collisions_per_1k, invert=True)
    s_pedestrians = min_max_normalize_0_100(pedestrians_per_10k, invert=True)
    s_disturbance = min_max_normalize_0_100(disturbance_per_1k, invert=True)

    raw_safety = [
        0.35 * s_collisions[i] + 0.35 * s_pedestrians[i] + 0.30 * s_disturbance[i]
        for i in range(n_districts)
    ]
    safety_scores = rescale_to_practical_band(raw_safety, low=58.0, high=95.0)

    # 7. HOUSING MARKET & AFFORDABILITY SCORE (NBP BaRN, Otodom, RCN)
    price_m2 = [d["housingMarket"]["avgPricePerM2"] for d in districts]
    rent_m2 = [d["housingMarket"]["avgRentalPriceM2"] for d in districts]
    affordability = [d["housingMarket"]["m2PerAverageSalary"] for d in districts]

    s_price = min_max_normalize_0_100(price_m2, invert=True)
    s_rent = min_max_normalize_0_100(rent_m2, invert=True)
    s_afford = min_max_normalize_0_100(affordability, invert=False)

    raw_housing = [
        0.35 * s_price[i] + 0.30 * s_rent[i] + 0.35 * s_afford[i]
        for i in range(n_districts)
    ]
    housing_scores = rescale_to_practical_band(raw_housing, low=50.0, high=92.0)

    # 8. DEMOGRAPHIC VITALITY & SETTLEMENT ATTRACTIVENESS SCORE (BDK, UMK 2023-2025)
    # Indicators:
    # - 3-year population growth rate (2023 to 2025 % dynamic)
    # - Working-age demographic vitality share (age 15-64 / total population %)
    # - Migration attractiveness & international openness (temporary residents + foreigners / total population %)
    growth_rate = [d["demographics"]["populationGrowthRate3YrPct"] for d in districts]
    working_age_share = [
        (d["demographics"]["age15to64"] * 100.0) / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]
    migration_rate = [
        ((d["demographics"]["temporaryResidents"] + d["demographics"]["foreignersTotal"]) * 100.0)
        / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]

    s_growth = min_max_normalize_0_100(growth_rate, invert=False)
    s_workforce = min_max_normalize_0_100(working_age_share, invert=False)
    s_migration = min_max_normalize_0_100(migration_rate, invert=False)

    # Weighting: 40% 3-year population growth rate, 35% working-age vitality share, 25% migration inflow & openness
    raw_demographic = [
        0.40 * s_growth[i] + 0.35 * s_workforce[i] + 0.25 * s_migration[i]
        for i in range(n_districts)
    ]
    demographic_scores = rescale_to_practical_band(raw_demographic, low=45.0, high=95.0)

    # Attach all 8 computed scores to each district entity
    for i, d in enumerate(districts):
        d["scores"] = {
            "mobilityScore": mobility_scores[i],
            "educationScore": education_scores[i],
            "greeneryScore": greenery_scores[i],
            "cultureAndSeniorScore": culture_scores[i],
            "environmentScore": env_scores[i],
            "safetyScore": safety_scores[i],
            "housingAffordabilityScore": housing_scores[i],
            "demographicVitalityScore": demographic_scores[i],
        }

    # Save final scored dataset for Script 03
    out_path = PROCESSED_DATA_DIR / "districts_scored.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"districts": districts}, f, ensure_ascii=False, indent=2)

    print(f"[Step 02 - Scores] Computed all 8 Quality of Life category scores for {len(districts)} districts.")
    for d in districts:
        sc = d["scores"]
        print(
            f"  - {d['districtName']}: Mob={sc['mobilityScore']}, Edu={sc['educationScore']}, "
            f"Green={sc['greeneryScore']}, Cult={sc['cultureAndSeniorScore']}, Env={sc['environmentScore']}, "
            f"Safe={sc['safetyScore']}, House={sc['housingAffordabilityScore']}, Demo={sc['demographicVitalityScore']}"
        )
    print(f"[Step 02 - Scores] Saved scored districts -> {out_path}")


if __name__ == "__main__":
    calculate_quality_scores()
