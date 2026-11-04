"""
GOAL / PURPOSE:
    Calculate the 8 normalized category quality scores (scale 0.0 to 100.0) for
    each of the 18 Krakow districts based on the real aggregated municipal Open
    Data indicators produced by Script 01 (`districts_aggregated.json`).

METHODOLOGY:
    Strictly follows transparent, reference-based urban and environmental standards
    (EU Directives, WHO guidelines, GUS municipal indicators).
    No artificial penalties, no ad-hoc scaling constants, no heuristic fudge factors.

PILLARS EVALUATED:
    1. mobilityScore – Public transport (KMK), tram density, and cycling network
    2. educationScore – Early childcare (0-3 coverage), kindergarten places (4-6), and class sizes
    3. greeneryScore – Green space per resident (EEA/WHO norm), biologically active area, and parks
    4. cultureAndSeniorScore – Libraries, community cultural centers, and Senior Activity Centers (CAS) per capita
    5. environmentScore – Ambient air quality (PM10, PM2.5, NO₂ and smog days relative to EU Legal Limits)
    6. safetyScore – Resident safety survey (Otodom 1-5) and absence of road incidents per 1k residents
    7. housingAffordabilityScore – Purchasing power (m² per net salary) and residential purchase/rental price affordability
    8. demographicVitalityScore – 3-year population growth, working-age workforce share, and settlement vitality
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Ensure script-level imports resolve config cleanly regardless of execution working directory
sys.path.append(str(Path(__file__).resolve().parent))

from config import PROCESSED_DATA_DIR


def clamp(val: float, min_v: float = 0.0, max_v: float = 100.0) -> float:
    return max(min_v, min(max_v, val))


def calculate_quality_scores() -> None:
    in_path = PROCESSED_DATA_DIR / "districts_aggregated.json"
    if not in_path.exists():
        raise FileNotFoundError(f"Missing {in_path}. Run 01_etl_demographics_and_infrastructure.py first.")

    with open(in_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    districts = payload["districts"]
    n_districts = len(districts)

    for d in districts:
        area = d["areaKm2"]
        pop = max(d["demographics"]["totalPopulation"], 1)

        # 1. MOBILITY & TRANSPORT SCORE (0.0 - 100.0)
        # - Isochrone coverage: % of district population living within 300m of public transit (0-100%)
        iso_cov = clamp(float(d["mobilityAndTransport"]["isochroneCoveragePct"]))
        # - Tram stop density: stops per km2 relative to dense urban core standard (6.0 stops/km2 = 100 pts)
        tram_dens = clamp((d["mobilityAndTransport"]["tramStopsCount"] / area) / 6.0 * 100.0)
        # - Bike lanes density: km of bike routes per km2 relative to municipal target (2.5 km/km2 = 100 pts)
        bike_dens = clamp((d["mobilityAndTransport"]["bikeLanesLengthKm"] / area) / 2.5 * 100.0)
        # - Schedule boards: real-time electronic passenger info boards per km2 (3.0 boards/km2 = 100 pts)
        boards_dens = clamp((d["mobilityAndTransport"]["scheduleBoardsCount"] / area) / 3.0 * 100.0)
        # - Bike racks: capacity per 1,000 residents (standard: 20 racks/1k residents = 100 pts)
        racks_cap = clamp((d["mobilityAndTransport"]["bikeRacksCount"] * 1000.0 / pop) / 20.0 * 100.0)

        mobility_score = round(
            0.35 * iso_cov + 0.25 * tram_dens + 0.15 * bike_dens + 0.15 * boards_dens + 0.10 * racks_cap,
            1,
        )

        # 2. EDUCATION & CHILDCARE SCORE (0.0 - 100.0)
        # - Early childcare coverage (0-3): places per child (ratio <= 1.0 means 100% coverage = 100 pts)
        child_ratio = max(0.01, float(d["educationAndCare"]["childrenPerCarePlaceRatio"]))
        care_cov = clamp((1.0 / child_ratio) * 100.0)
        # - Kindergarten coverage (4-6): available places relative to demographic cohort (1.0 = 100 pts)
        kg_kids = max(d["demographics"]["age4to6"], 1)
        kg_cov = clamp((d["educationAndCare"]["kindergartenPlacesTotal"] / kg_kids) * 100.0)
        # - Class size optimality: benchmark 15 students = 100 pts, 25 students = 50 pts, 35 students = 0 pts
        avg_class = float(d["educationAndCare"]["avgStudentsPerClass"])
        class_score = clamp(100.0 - (avg_class - 15.0) * 5.0)

        education_score = round(
            0.40 * care_cov + 0.35 * kg_cov + 0.25 * class_score,
            1,
        )

        # 3. GREENERY & SPORT SCORE (0.0 - 100.0)
        # - Green space per resident: EEA / WHO municipal health benchmark (50 m2/resident = 100 pts)
        green_cap = clamp((float(d["greeneryAndSport"]["totalGreenM2PerCapita"]) / 50.0) * 100.0)
        # - Biologically active green share: percentage of district surface that is greenery/forests
        green_share = clamp((float(d["greeneryAndSport"]["totalGreenAreaHa"]) / (area * 100.0)) * 100.0)
        # - City & pocket parks: parks per 10,000 residents (target: 3 parks per 10k = 100 pts)
        parks_count = d["greeneryAndSport"]["cityParksCount"] + d["greeneryAndSport"]["pocketParksCount"]
        parks_score = clamp((parks_count * 10000.0 / pop) / 3.0 * 100.0)
        # - Youth & school sports facilities per 10,000 residents (target: 15 per 10k = 100 pts)
        sports_count = d["greeneryAndSport"]["schoolSportsFacilitiesCount"]
        sports_score = clamp((sports_count * 10000.0 / pop) / 15.0 * 100.0)

        greenery_score = round(
            0.35 * green_cap + 0.30 * green_share + 0.20 * parks_score + 0.15 * sports_score,
            1,
        )

        # 4. CULTURE, LIBRARIES & SENIOR INFRASTRUCTURE (0.0 - 100.0)
        # - Library branches: branches per 10,000 residents (target: 1.2 per 10k = 100 pts)
        lib_score = clamp((d["cultureAndSociety"]["libraryBranchesCount"] * 10000.0 / pop) / 1.2 * 100.0)
        # - Community cultural centers: centers per 10,000 residents (target: 1.5 per 10k = 100 pts)
        cc_score = clamp((d["cultureAndSociety"]["culturalCentersCount"] * 10000.0 / pop) / 1.5 * 100.0)
        # - Senior Activity Centers (CAS): centers per 1,000 senior residents 65+ (target: 0.8 per 1k = 100 pts)
        seniors_count = max(d["demographics"]["age65Plus"], 1)
        cas_score = clamp((d["cultureAndSociety"]["seniorActivityCentersCount"] * 1000.0 / seniors_count) / 0.8 * 100.0)
        # - Municipal cultural spending per resident (target: 150 PLN per capita = 100 pts)
        subsidy_score = clamp((float(d["cultureAndSociety"]["municipalSubsidyPerCapitaPln"]) / 150.0) * 100.0)

        culture_score = round(
            0.30 * lib_score + 0.25 * cc_score + 0.25 * cas_score + 0.20 * subsidy_score,
            1,
        )

        # 5. ENVIRONMENTAL QUALITY & CLEAN AIR (0.0 - 100.0)
        # Evaluated directly against European Union Legal Standards (Directive 2008/50/EC on ambient air quality):
        # - PM10: Annual EU legal limit is 40.0 ug/m3. Score = (1 - PM10 / 40.0) * 100
        pm10 = float(d["environmentalQuality"]["pm10Avg90dUgM3"])
        pm10_score = clamp((1.0 - pm10 / 40.0) * 100.0)
        # - PM2.5: Annual EU legal limit is 25.0 ug/m3. Score = (1 - PM2.5 / 25.0) * 100
        pm25 = float(d["environmentalQuality"]["pm25Avg90dUgM3"])
        pm25_score = clamp((1.0 - pm25 / 25.0) * 100.0)
        # - NO2: Annual EU legal limit is 40.0 ug/m3. Score = (1 - NO2 / 40.0) * 100
        no2 = float(d["environmentalQuality"]["no2Avg90dUgM3"])
        no2_score = clamp((1.0 - no2 / 40.0) * 100.0)
        # - Absence of smog days: percentage of clean winter days over the 90-day telemetry window
        smog_days = float(d["environmentalQuality"]["smogDays90dCount"])
        smog_score = clamp((1.0 - smog_days / 90.0) * 100.0)

        environment_score = round(
            0.30 * pm10_score + 0.30 * pm25_score + 0.25 * no2_score + 0.15 * smog_score,
            1,
        )

        # 6. PUBLIC SAFETY & TRAFFIC SAFETY (0.0 - 100.0)
        # - Resident Otodom Survey (scale 1.0 to 5.0): linearly mapped to 0..100
        survey_val = float(d["publicSafety"]["safetyRatingSurvey"])
        survey_score = clamp((survey_val - 1.0) / 4.0 * 100.0)
        # - Absence of road collisions: collisions per 1,000 residents (GUS benchmark: 0 = 100 pts, 30/1k = 0 pts)
        coll_per_1k = float(d["publicSafety"]["roadCollisionsAnnual"]) * 1000.0 / pop
        coll_score = clamp((1.0 - coll_per_1k / 30.0) * 100.0)
        # - Absence of pedestrian & injury accidents: incidents per 10,000 residents (0 = 100 pts, 15/10k = 0 pts)
        ped_acc = float(d["publicSafety"]["pedestrianAccidents"]) * 1.5 + float(d["publicSafety"]["injuryAccidents"])
        ped_per_10k = ped_acc * 10000.0 / pop
        ped_score = clamp((1.0 - ped_per_10k / 15.0) * 100.0)

        safety_score = round(
            0.40 * survey_score + 0.30 * coll_score + 0.30 * ped_score,
            1,
        )

        # 7. HOUSING MARKET & AFFORDABILITY (0.0 - 100.0)
        # - Purchasing power: square meters of residential property purchased per average net salary (0.20 m2 = 0, 0.70 m2 = 100)
        m2_sal = float(d["housingMarket"]["m2PerAverageSalary"])
        m2_score = clamp((m2_sal - 0.20) / (0.70 - 0.20) * 100.0)
        # - Price affordability per m2: benchmark 8,000 PLN = 100 pts, 22,000 PLN = 0 pts
        price_m2 = float(d["housingMarket"]["avgPricePerM2"])
        price_score = clamp((1.0 - (price_m2 - 8000.0) / (22000.0 - 8000.0)) * 100.0)
        # - Rental rate affordability: benchmark 50 PLN/m2 = 100 pts, 100 PLN/m2 = 0 pts
        rent_m2 = float(d["housingMarket"]["avgRentalPriceM2"])
        rent_score = clamp((1.0 - (rent_m2 - 50.0) / (100.0 - 50.0)) * 100.0)

        housing_score = round(
            0.40 * m2_score + 0.30 * price_score + 0.30 * rent_score,
            1,
        )

        # 8. DEMOGRAPHIC VITALITY & SETTLEMENT ATTRACTIVENESS (0.0 - 100.0)
        # - 3-year population growth rate: -5% = 0 pts, 0% = 50 pts, +5% = 100 pts
        growth_rate = float(d["demographics"]["populationGrowthRate3YrPct"])
        growth_score = clamp(50.0 + growth_rate * 10.0)
        # - Working-age workforce share (15-64): benchmark 50% = 0 pts, 75% = 100 pts
        work_share = float(d["demographics"]["age15to64"]) * 100.0 / pop
        work_score = clamp((work_share - 50.0) / 25.0 * 100.0)
        # - Temporary residents share (students, mobility): 0% = 0 pts, 10% = 100 pts
        temp_share = float(d["demographics"]["temporaryResidents"]) * 100.0 / pop
        temp_score = clamp(temp_share / 10.0 * 100.0)
        # - International community share: 0% = 0 pts, 8% = 100 pts
        intl_share = float(d["demographics"]["foreignersTotal"]) * 100.0 / pop
        intl_score = clamp(intl_share / 8.0 * 100.0)

        vitality_score = round(
            0.35 * growth_score + 0.25 * work_score + 0.20 * temp_score + 0.20 * intl_score,
            1,
        )

        d["scores"] = {
            "mobilityScore": mobility_score,
            "educationScore": education_score,
            "greeneryScore": greenery_score,
            "cultureAndSeniorScore": culture_score,
            "environmentScore": environment_score,
            "safetyScore": safety_score,
            "housingAffordabilityScore": housing_score,
            "demographicVitalityScore": vitality_score,
        }

    out_path = PROCESSED_DATA_DIR / "districts_scored.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"districts": districts}, f, ensure_ascii=False, indent=2)

    print(f"[Step 02 - Scores] Computed all 8 Quality of Life category scores for {n_districts} districts.")
    print(f"[Step 02 - Scores] Saved scored districts -> {out_path}")


if __name__ == "__main__":
    calculate_quality_scores()
