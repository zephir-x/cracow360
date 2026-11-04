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
    5. environmentScore – Clean air (PM10, PM2.5, NO₂ and smog days via Open-Meteo), and green buffers
    6. safetyScore – Road safety, absence of pedestrian accidents, and resident safety rating (data from SEWiK / Otodom Surveys)
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
    so that the lowest-scoring district in a category reflects actual severity of deficits
    while remaining on an interpretable 0-100 urban index scale.
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
    n_districts = len(districts)

    # 1. MOBILITY & TRANSPORT SCORE
    iso_cov = [d["mobilityAndTransport"]["isochroneCoveragePct"] for d in districts]
    tram_network = [
        math.log1p(d["mobilityAndTransport"]["tramStopsCount"] / (d["areaKm2"] + 8.0))
        * (1.0 + (d["mobilityAndTransport"]["tramNetworkSharePct"] / 100.0))
        + 0.35 * math.log1p(d["mobilityAndTransport"]["tramStopsCount"])
        for d in districts
    ]
    service_density = [
        math.log1p(d["mobilityAndTransport"]["scheduleBoardsCount"] / (d["areaKm2"] + 6.0))
        for d in districts
    ]
    bike_lane_network = [
        (d["mobilityAndTransport"]["bikeLanesLengthKm"] / (d["areaKm2"] + 7.0))
        + 0.25 * math.log1p(d["mobilityAndTransport"]["bikeLanesLengthKm"])
        for d in districts
    ]
    intermodal_hubs = [
        (d["mobilityAndTransport"]["bikeRacksCount"] * 1000.0 / max(d["demographics"]["totalPopulation"], 1))
        + (d["mobilityAndTransport"]["parkAndRideCount"] * 12.0)
        for d in districts
    ]

    s_iso = min_max_normalize_0_100(iso_cov, invert=False)
    s_tram = min_max_normalize_0_100(tram_network, invert=False)
    s_service = min_max_normalize_0_100(service_density, invert=False)
    s_bike = min_max_normalize_0_100(bike_lane_network, invert=False)
    s_intermodal = min_max_normalize_0_100(intermodal_hubs, invert=False)

    raw_mobility = [
        0.28 * s_iso[i] + 0.30 * s_tram[i] + 0.17 * s_service[i] + 0.15 * s_bike[i] + 0.10 * s_intermodal[i]
        for i in range(n_districts)
    ]
    mobility_scores = rescale_to_practical_band(raw_mobility, low=28.0, high=96.0)

    # 2. EDUCATION & EARLY CARE SCORE
    nursery_ratio = [d["educationAndCare"]["childrenPerCarePlaceRatio"] for d in districts]
    kg_coverage = [
        min(2.2, d["educationAndCare"]["kindergartenPlacesTotal"] / max(d["demographics"]["age4to6"], 1))
        for d in districts
    ]
    class_size = [d["educationAndCare"]["avgStudentsPerClass"] for d in districts]
    edu_network_mass = [
        math.log1p(
            d["educationAndCare"]["nurseriesPublicCount"] * 3.0
            + d["educationAndCare"]["nurseriesContractedCount"] * 1.5
            + d["educationAndCare"]["parentClubsCount"] * 2.0
            + d["educationAndCare"]["kindergartensCount"] * 1.2
            + d["educationAndCare"]["primarySchoolsCount"] * 1.5
        )
        for d in districts
    ]

    s_nursery = min_max_normalize_0_100(nursery_ratio, invert=True)
    s_kg = min_max_normalize_0_100(kg_coverage, invert=False)
    s_class = min_max_normalize_0_100(class_size, invert=True)
    s_edu_mass = min_max_normalize_0_100(edu_network_mass, invert=False)

    raw_education = [
        0.38 * s_nursery[i] + 0.25 * s_kg[i] + 0.19 * s_class[i] + 0.18 * s_edu_mass[i]
        for i in range(n_districts)
    ]
    education_scores = rescale_to_practical_band(raw_education, low=40.0, high=92.0)

    # 3. GREENERY & SPORT SCORE
    total_green_per_cap = [math.log1p(d["greeneryAndSport"]["totalGreenM2PerCapita"]) for d in districts]
    green_area_share = [
        math.log1p((d["greeneryAndSport"]["totalGreenAreaHa"] / (d["areaKm2"] * 100.0)) * 100.0)
        for d in districts
    ]
    parks_network = [
        math.log1p(
            d["greeneryAndSport"]["cityParksCount"] * 2.5
            + d["greeneryAndSport"]["pocketParksCount"] * 1.8
            + math.sqrt(max(d["greeneryAndSport"]["totalParksAreaHa"], 0.0))
        )
        for d in districts
    ]
    sport_access = [
        math.log1p(min(d["greeneryAndSport"]["schoolSportsFacilitiesCount"], 130))
        + d["greeneryAndSport"]["schoolSwimmingPoolsCount"] * 0.85
        for d in districts
    ]

    s_green_cap = min_max_normalize_0_100(total_green_per_cap, invert=False)
    s_green_share = min_max_normalize_0_100(green_area_share, invert=False)
    s_parks_net = min_max_normalize_0_100(parks_network, invert=False)
    s_sport = min_max_normalize_0_100(sport_access, invert=False)

    raw_greenery = [
        0.35 * s_green_cap[i] + 0.25 * s_green_share[i] + 0.25 * s_parks_net[i] + 0.15 * s_sport[i]
        for i in range(n_districts)
    ]
    greenery_scores = rescale_to_practical_band(raw_greenery, low=52.0, high=96.0)

    # 4. CULTURE, LIBRARIES & SENIOR ACTIVITY
    inst_bayesian = [
        (
                (d["cultureAndSociety"]["libraryBranchesCount"] + d["cultureAndSociety"]["culturalCentersCount"] * 2.2) * 10000.0
                / (d["demographics"]["totalPopulation"] + 22000.0)
        )
        + 0.45 * (d["cultureAndSociety"]["libraryBranchesCount"] + d["cultureAndSociety"]["culturalCentersCount"] * 2.0)
        for d in districts
    ]
    cas_bayesian = [
        (
                d["cultureAndSociety"]["seniorActivityCentersCount"] * 1000.0
                / (d["demographics"]["age65Plus"] + 4500.0)
        )
        + 0.35 * d["cultureAndSociety"]["seniorActivityCentersCount"]
        for d in districts
    ]
    subsidy_and_events = [
        math.log1p(
            d["cultureAndSociety"]["municipalSubsidyPerCapitaPln"]
            * (d["demographics"]["totalPopulation"] / (d["demographics"]["totalPopulation"] + 18000.0))
        )
        + 0.4 * math.log1p(d["cultureAndSociety"]["annualCulturalEventsCount"])
        for d in districts
    ]

    s_inst = min_max_normalize_0_100(inst_bayesian, invert=False)
    s_cas = min_max_normalize_0_100(cas_bayesian, invert=False)
    s_sub = min_max_normalize_0_100(subsidy_and_events, invert=False)

    raw_culture = [
        0.45 * s_inst[i] + 0.30 * s_cas[i] + 0.25 * s_sub[i]
        for i in range(n_districts)
    ]
    culture_scores = rescale_to_practical_band(raw_culture, low=44.0, high=96.0)

    # 5. ENVIRONMENT & AIR SCORE
    pm10_vals = [d["environmentalQuality"]["pm10Avg90dUgM3"] for d in districts]
    smog_days = [d["environmentalQuality"]["smogDays90dCount"] for d in districts]
    no2_vals = [d["environmentalQuality"]["no2Avg90dUgM3"] for d in districts]
    green_buffer = [math.log1p(d["greeneryAndSport"]["totalGreenM2PerCapita"]) for d in districts]

    s_pm10 = min_max_normalize_0_100(pm10_vals, invert=True)
    s_smog = min_max_normalize_0_100(smog_days, invert=True)
    s_no2 = min_max_normalize_0_100(no2_vals, invert=True)
    s_green_buf = min_max_normalize_0_100(green_buffer, invert=False)

    raw_env = [
        0.25 * s_pm10[i] +
        0.22 * s_smog[i] +
        0.38 * s_no2[i] +
        0.15 * s_green_buf[i]
        for i in range(n_districts)
    ]
    env_scores = rescale_to_practical_band(raw_env, low=26.0, high=94.0)

    # 6. PUBLIC SAFETY & TRAFFIC SAFETY SCORE
    daytime_factors = {1: 1.55, 2: 1.25, 5: 1.15, 13: 1.12}

    def effective_population(d: dict) -> float:
        factor = daytime_factors.get(d["districtId"], 1.0)
        return max((d["demographics"]["totalPopulation"] + 8000.0) * factor, 1.0)

    collisions_per_1k = [
        math.log1p(d["publicSafety"]["roadCollisionsAnnual"] * 1000.0 / effective_population(d))
        for d in districts
    ]
    pedestrians_per_10k = [
        math.log1p(
            (d["publicSafety"]["pedestrianAccidents"] * 2.0 + d["publicSafety"]["injuryAccidents"]) * 10000.0
            / effective_population(d)
        )
        for d in districts
    ]
    safety_ratings = [
        d["publicSafety"]["safetyRatingSurvey"]
        for d in districts
    ]

    s_collisions = min_max_normalize_0_100(collisions_per_1k, invert=True)
    s_pedestrians = min_max_normalize_0_100(pedestrians_per_10k, invert=True)
    s_otodom = min_max_normalize_0_100(safety_ratings, invert=False)

    raw_safety = [
        0.32 * s_collisions[i] + 0.33 * s_pedestrians[i] + 0.35 * s_otodom[i]
        for i in range(n_districts)
    ]
    safety_scores = rescale_to_practical_band(raw_safety, low=38.0, high=94.0)

    # 7. HOUSING MARKET & AFFORDABILITY SCORE
    price_m2 = [d["housingMarket"]["avgPricePerM2"] for d in districts]
    rent_m2 = [d["housingMarket"]["avgRentalPriceM2"] for d in districts]
    affordability = [d["housingMarket"]["m2PerAverageSalary"] for d in districts]

    s_price = min_max_normalize_0_100(price_m2, invert=True)
    s_rent = min_max_normalize_0_100(rent_m2, invert=True)
    s_afford = min_max_normalize_0_100(affordability, invert=False)

    raw_housing = [
        0.30 * s_price[i] + 0.35 * s_rent[i] + 0.35 * s_afford[i]
        for i in range(n_districts)
    ]
    housing_scores = rescale_to_practical_band(raw_housing, low=22.0, high=92.0)

    # 8. DEMOGRAPHIC VITALITY & SETTLEMENT ATTRACTIVENESS SCORE
    growth_rate = [d["demographics"]["populationGrowthRate3YrPct"] for d in districts]
    working_age_share = [
        (d["demographics"]["age15to64"] * 100.0) / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]
    young_mobility_share = [
        (d["demographics"]["temporaryResidents"] * 100.0) / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]
    international_rate = [
        (d["demographics"]["foreignersTotal"] * 100.0) / max(d["demographics"]["totalPopulation"], 1)
        for d in districts
    ]

    s_growth = min_max_normalize_0_100(growth_rate, invert=False)
    s_workforce = min_max_normalize_0_100(working_age_share, invert=False)
    s_young_mob = min_max_normalize_0_100(young_mobility_share, invert=False)
    s_intl = min_max_normalize_0_100(international_rate, invert=False)

    raw_demographic = [
        0.30 * s_growth[i] + 0.25 * s_workforce[i] + 0.25 * s_young_mob[i] + 0.20 * s_intl[i]
        for i in range(n_districts)
    ]
    demographic_scores = rescale_to_practical_band(raw_demographic, low=46.0, high=95.0)

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

    out_path = PROCESSED_DATA_DIR / "districts_scored.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"districts": districts}, f, ensure_ascii=False, indent=2)

    print(f"[Step 02 - Scores] Computed all 8 Quality of Life category scores for {len(districts)} districts.")
    print(f"[Step 02 - Scores] Saved scored districts -> {out_path}")


if __name__ == "__main__":
    calculate_quality_scores()
    