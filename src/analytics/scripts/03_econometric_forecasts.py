"""
GOAL / PURPOSE:
    Build econometric / cohort-component predictive models forecasting demographic
    changes and public infrastructure deficits for the year 2028 across all 18
    Krakow districts. Writes the final `data/contracts/krakow_districts_master.json`
    and generates static analytical charts in `src/analytics/charts/` for the
    competition report and documentation.
"""

from __future__ import annotations

from datetime import datetime, timezone
import json
import sys
from pathlib import Path

# Ensure script-level imports resolve config cleanly regardless of execution working directory
sys.path.append(str(Path(__file__).resolve().parent))

import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

from config import (
    ALLOWED_POTENTIAL_LEVELS,
    CHARTS_DIR,
    CONTRACTS_OUTPUT_DIR,
    PROCESSED_DATA_DIR,
)


def forecast_cohorts_ols(birth_cohorts: dict[str, int], growth_3yr_pct: float, age0to3_now: int) -> tuple[int, int]:
    """
    Combines OLS linear trend regression on single-year birth cohorts (2018-2025)
    with a cohort-component progression model to predict:
      - `forecastedAge0to3_2028` (children born 2025-2028 living in the district in 2028)
      - `forecastedAge4to6_2028` (children born 2022-2024 progressing to ages 4-6 in 2028)

    Args:
        birth_cohorts: Dictionary mapping birth year strings ("2018".."2025") to counts.
        growth_3yr_pct: 3-year demographic growth rate of the district in percent.
        age0to3_now: Baseline current population of children aged 0-3.

    Returns:
        Tuple of (forecasted_0to3_in_2028, forecasted_4to6_in_2028).
    """
    # Fit linear trend across 8-year birth history (2018-2025)
    years = np.array([y for y in range(2018, 2026)], dtype=float).reshape(-1, 1)
    counts = np.array([float(birth_cohorts.get(str(y), age0to3_now / 4.0)) for y in range(2018, 2026)], dtype=float)

    model = LinearRegression()
    model.fit(years, counts)

    # Predict annual births for 2025, 2026, 2027, and 2028
    future_years = np.array([[2025.0], [2026.0], [2027.0], [2028.0]])
    pred_annual = model.predict(future_years)

    # Apply dampened migration multiplier based on the district's 3-year population trend
    mig_factor = 1.0 + (growth_3yr_pct / 100.0) * 0.85
    raw_0to3_2028 = float(np.sum(np.maximum(pred_annual, counts[-1] * 0.70))) * mig_factor
    # Clamp within realistic demographic bounds (-18% to +28% of current baseline)
    forecast_0to3 = int(round(max(age0to3_now * 0.82, min(age0to3_now * 1.28, raw_0to3_2028))))

    # Cohort progression for ages 4-6 in 2028 (children born in 2022-2024 plus migration)
    base_2022_2024 = sum(int(birth_cohorts.get(str(y), 0)) for y in (2022, 2023, 2024))
    if base_2022_2024 <= 0:
        base_2022_2024 = int(round(age0to3_now * 0.75))
    forecast_4to6 = int(round(base_2022_2024 * (1.0 + (growth_3yr_pct / 100.0) * 0.65)))

    return forecast_0to3, forecast_4to6


def build_recommendation(district: dict, nursery_pot: str, senior_def: str, green_def: str) -> str:
    """
    Synthesizes a data-driven, strategic Polish municipal recommendation for the district
    based on computed infrastructure deficits and demographic trends.

    Args:
        district: District dictionary containing demographics, greenery, and forecast metrics.
        nursery_pot: Nursery investment potential ('LOW', 'MEDIUM', 'HIGH').
        senior_def: Senior infrastructure deficit ('LOW', 'MEDIUM', 'HIGH').
        green_def: Green space deficit ('LOW', 'MEDIUM', 'HIGH').

    Returns:
        Concise Polish recommendation string displayed in the UI and comparison view.
    """
    name = district["districtName"]
    dem = district["demographics"]
    grn = district["greeneryAndSport"]
    fb = district["forecastsAndB2B"]
    senior_pct = round((dem["age65Plus"] / max(dem["totalPopulation"], 1)) * 100.0, 1)
    balance = fb["forecastedCarePlacesBalance_2028"]

    # Priority 1: High nursery deficit coupled with low green space
    if nursery_pot == "HIGH" and green_def == "HIGH":
        return (
            f"Priorytet: kontraktowanie nowych miejsc żłobkowych (prognozowany bilans 2028: {balance} miejsc) "
            f"oraz tworzenie parków kieszonkowych (obecnie {grn['greenAreaM2PerCapita']} m² zieleni/os.)."
        )

    # Priority 2: High nursery deficit due to rapid family migration
    if nursery_pot == "HIGH":
        return (
            f"Wysoki potencjał inwestycyjny B2B/B2G dla żłobków i klubów dziecięcych z uwagi na napływ młodych rodzin "
            f"(dynamika {dem['populationGrowthRate3YrPct']:+.1f}%, bilans 2028: {balance} miejsc)."
        )

    # Priority 3: High senior concentration requiring expanded Senior Centers (CAS)
    if senior_def in ("HIGH", "MEDIUM") and senior_pct >= 24.0:
        return (
            f"Rozbudowa sieci Centrów Aktywności Seniora (CAS) oraz oferty kulturalno-opiekuńczej "
            f"z uwagi na wysoki odsetek mieszkańców 65+ ({senior_pct}%)."
        )

    # Priority 4: Urgent need for local parks and green squares
    if green_def == "HIGH":
        return (
            f"Pilne zwiększenie powierzchni terenów zielonych i skwerów lokalnych "
            f"(wskaźnik {grn['greenAreaM2PerCapita']} m²/os. poniżej normy miejskiej 10 m²/os.)."
        )

    # Priority 5: Peripheral transit gaps requiring bus route feeder expansion
    if district["mobilityAndTransport"]["isochroneCoveragePct"] < 75.0:
        return (
            f"Zwiększenie częstotliwości i zasięgu linii dowozowych KMK oraz rozbudowa ciągów pieszo-rowerowych "
            f"(obecny zasięg izochrony 500m: {district['mobilityAndTransport']['isochroneCoveragePct']}%)."
        )

    # Default: Balanced district requiring ongoing maintenance and sports modernization
    return (
        f"Utrzymanie wysokiej dostępności usług publicznych w {name} przy wsparciu modernizacji przyszkolnej "
        f"infrastruktury sportowej i oferty dla seniorów ({senior_pct}% populacji)."
    )


def generate_competition_charts(districts: list[dict]) -> None:
    """
    Generates high-resolution analytical charts in `src/analytics/charts/`
    illustrating demographic trends, nursery deficits, and the 7-pillar Quality of Life ranking.
    """
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)

    # Chart 1: Demographic growth rate vs Forecasted Nursery Deficit 2028
    fig, ax = plt.subplots(figsize=(10, 6), dpi=160)
    for d in districts:
        x = d["demographics"]["populationGrowthRate3YrPct"]
        y = d["forecastsAndB2B"]["forecastedCarePlacesBalance_2028"]
        size = max(40, d["demographics"]["totalPopulation"] / 600)
        color = "#e11d48" if y < -50 else "#0ea5e9"
        ax.scatter(x, y, s=size, color=color, alpha=0.75, edgecolors="#0f172a", linewidth=1.2)
        ax.annotate(
            d["districtRoman"],
            (x, y),
            xytext=(5, 4),
            textcoords="offset points",
            fontsize=8.5,
            fontweight="bold",
            color="#1e293b",
        )

    ax.set_title("Kraków360: Dynamika demograficzna vs. Prognozowany bilans miejsc żłobkowych (2028)", fontsize=12, fontweight="bold")
    ax.set_xlabel("3-letnia dynamika demograficzna dzielnicy [%]")
    ax.set_ylabel("Prognozowany bilans miejsc opieki 0-3 lat w 2028 r. [miejsca]")
    ax.grid(True, linestyle="--", alpha=0.35)
    fig.tight_layout()
    chart1_path = CHARTS_DIR / "01_nursery_deficit_vs_growth_2028.png"
    fig.savefig(chart1_path)
    plt.close(fig)

    # Chart 2: Ranking of all 18 districts by equal-weighted composite Quality of Life Index (7 Pillars)
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=160)
    num_scores = len(districts[0]["scores"])
    ranked = sorted(districts, key=lambda d: sum(d["scores"].values()) / num_scores)
    labels = [f"{d['districtRoman']} {d['districtName'].replace('Dzielnica ' + d['districtRoman'] + ' ', '')}" for d in ranked]
    avg_scores = [round(sum(d["scores"].values()) / num_scores, 1) for d in ranked]

    bars = ax.barh(labels, avg_scores, color="#0065b3", edgecolor="#0f2942", height=0.68)
    for bar, val in zip(bars, avg_scores):
        ax.text(val + 0.6, bar.get_y() + bar.get_height() / 2, f"{val:.1f}", va="center", fontsize=8.5, fontweight="bold")

    ax.set_xlim(0, 100)
    ax.set_title(f"Kraków360: Bazowy Indeks Jakości Życia (średnia {num_scores} filarów miejskich, wagi równe)", fontsize=12, fontweight="bold")
    ax.set_xlabel("Syntetyczny wynik jakości życia [0 - 100 pkt]")
    ax.grid(axis="x", linestyle="--", alpha=0.35)
    fig.tight_layout()
    chart2_path = CHARTS_DIR / "02_quality_of_life_ranking_18_districts.png"
    fig.savefig(chart2_path)
    plt.close(fig)

    print(f"[Step 03 - Forecasts] Saved analytical charts -> {chart1_path.name}, {chart2_path.name}")


def run_econometric_forecasts() -> None:
    """
    Main execution workflow for Script 03:
    1. Loads scored districts from Step 02 (`districts_scored.json`).
    2. Runs OLS demographic cohort progression for 2028 children cohorts (0-3 and 4-6).
    3. Evaluates infrastructure balance, B2B potential, and deficit levels.
    4. Generates strategic recommendations for municipal planning.
    5. Exports the complete data contract to `data/contracts/krakow_districts_master.json`.
    6. Generates analytical charts in `src/analytics/charts/`.
    """
    in_path = PROCESSED_DATA_DIR / "districts_scored.json"
    if not in_path.exists():
        raise FileNotFoundError(f"Missing {in_path}. Run 02_calculate_quality_scores.py first.")

    with open(in_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    districts = payload["districts"]

    # Iterate over all districts to compute econometric projections
    for d in districts:
        dem = d["demographics"]
        edu = d["educationAndCare"]
        grn = d["greeneryAndSport"]
        cult = d["cultureAndSociety"]
        internal = d.get("_internal", {})
        cohorts = internal.get("birthCohorts", {})

        # Predict child cohorts in 2028 via linear regression and cohort progression
        f_0to3, f_4to6 = forecast_cohorts_ols(
            cohorts, dem["populationGrowthRate3YrPct"], dem["age0to3"]
        )

        # Effective demand benchmark: 75% institutional enrollment rate among 0-3 cohort
        target_demand_2028 = 0.75 * f_0to3
        balance_2028 = int(round(edu["totalCarePlaces0to3"] - target_demand_2028))

        # Classify B2B nursery investment potential based on deficit depth and population growth
        if balance_2028 < -150 and dem["populationGrowthRate3YrPct"] > 1.2:
            nursery_pot = "HIGH"
        elif balance_2028 < 0 or edu["childrenPerCarePlaceRatio"] > 1.35:
            nursery_pot = "MEDIUM"
        else:
            nursery_pot = "LOW"

        # Classify senior infrastructure deficit based on 65+ demographic share and CAS counts
        senior_share = dem["age65Plus"] / max(dem["totalPopulation"], 1)
        if senior_share > 0.24 and cult["seniorActivityCentersCount"] < 3:
            senior_def = "HIGH"
        elif senior_share > 0.20:
            senior_def = "MEDIUM"
        else:
            senior_def = "LOW"

        # Classify green space deficit relative to the municipal standard of 10 m² per resident
        if grn["greenAreaM2PerCapita"] < 10.0:
            green_def = "HIGH"
        elif grn["greenAreaM2PerCapita"] < 18.0:
            green_def = "MEDIUM"
        else:
            green_def = "LOW"

        # Assert contract enum validity
        assert nursery_pot in ALLOWED_POTENTIAL_LEVELS
        assert senior_def in ALLOWED_POTENTIAL_LEVELS
        assert green_def in ALLOWED_POTENTIAL_LEVELS

        # Attach forecasts and B2B indicators directly
        d["forecastsAndB2B"] = {
            "forecastedAge0to3_2028": f_0to3,
            "forecastedCarePlacesBalance_2028": balance_2028,
            "forecastedAge4to6_2028": f_4to6,
            "nurseryInvestmentPotentialB2B": nursery_pot,
            "seniorInfrastructureDeficit": senior_def,
            "greenSpaceDeficit": green_def,
            "recommendedMunicipalAction": "",
        }
        d["forecastsAndB2B"]["recommendedMunicipalAction"] = build_recommendation(
            d, nursery_pot, senior_def, green_def
        )

        # Clean up temporary internal ETL artifacts before exporting to the public contract
        d.pop("_internal", None)

    # Build root contract envelope with ISO 8601 UTC metadata
    master_contract = {
        "metadata": {
            "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "dataVersion": "2.1.0-expanded-7-pillars-2025-2026",
            "normalizationMethod": "MinMax_0_100_Calibrated",
        },
        "districts": districts,
    }

    # Write final master contract deliverable
    CONTRACTS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_master_path = CONTRACTS_OUTPUT_DIR / "krakow_districts_master.json"
    with open(out_master_path, "w", encoding="utf-8") as f:
        json.dump(master_contract, f, ensure_ascii=False, indent=2)

    # Render static visual charts for documentation
    generate_competition_charts(districts)
    print(f"[Step 03 - Forecasts] Exported final master contract -> {out_master_path}")


if __name__ == "__main__":
    run_econometric_forecasts()
