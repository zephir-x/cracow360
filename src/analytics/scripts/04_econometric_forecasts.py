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
    Combines OLS (Ordinary Least Squares) linear trend regression on single-year birth cohorts (2018-2025)
    with a cohort-component progression model to predict future demographic segments.

    Methodology:
    1. Extracts historical birth data (2018-2025) to establish a baseline trend using Scikit-Learn.
    2. Projects this trend forward 4 years (2025-2028).
    3. Applies a cohort survival/migration multiplier based on the district's recent 3-year growth rate.
    4. Limits extreme values (clamping) to prevent exponential explosion in rapidly growing districts.

    Returns a tuple predicting:
        - `forecastedAge0to3_2028`: Est. number of children born 2025-2028 living in the district in 2028.
        - `forecastedAge4to6_2028`: Est. number of children born 2022-2024 progressing to ages 4-6 in 2028.
    """
    # 1. Prepare historical training data for the OLS model
    years = np.array([y for y in range(2018, 2025)], dtype=float).reshape(-1, 1)
    # Fallback to a quarter of current 0-3 population if specific historical data is missing
    counts = np.array([float(birth_cohorts.get(str(y), age0to3_now / 4.0)) for y in range(2018, 2025)], dtype=float)

    # 2. Fit the Linear Regression model to identify the demographic trajectory (rising or falling births)
    model = LinearRegression()
    model.fit(years, counts)

    # 3. Predict the raw number of births for the next 4 years
    future_years = np.array([[2025.0], [2026.0], [2027.0], [2028.0]])
    pred_annual = model.predict(future_years)

    # 4. Adjust the raw birth predictions by the district's net migration factor
    # We dampen the 3-year growth rate by 0.85 to avoid over-projecting temporary migration spikes
    mig_factor = 1.0 + (growth_3yr_pct / 100.0) * 0.85

    # Calculate total expected 0-3 cohort in 2028, enforcing a floor of 70% of current births to prevent negative values
    raw_0to3_2028 = float(np.sum(np.maximum(pred_annual, counts[-1] * 0.70))) * mig_factor

    # Clamp final prediction to a realistic biological/urban envelope (between 82% and 128% of current population)
    forecast_0to3 = int(round(max(age0to3_now * 0.82, min(age0to3_now * 1.28, raw_0to3_2028))))

    # 5. Cohort progression: Calculate 4-6 year olds in 2028 (these are the children born exactly in 2022-2024)
    base_2022_2024 = sum(int(birth_cohorts.get(str(y), 0)) for y in (2022, 2023, 2024))
    if base_2022_2024 <= 0:
        base_2022_2024 = int(round(age0to3_now * 0.75))

    # Apply a milder migration multiplier (0.65) as older cohorts are slightly less mobile
    forecast_4to6 = int(round(base_2022_2024 * (1.0 + (growth_3yr_pct / 100.0) * 0.65)))

    return forecast_0to3, forecast_4to6

def build_recommendation(district: dict, nursery_pot: str, senior_def: str, green_def: str, balance: int) -> str:
    name = district["districtName"]
    dem = district["demographics"]
    grn = district["greeneryAndSport"]
    senior_pct = round((dem["age65Plus"] / max(dem["totalPopulation"], 1)) * 100.0, 1)

    if nursery_pot == "HIGH" and green_def == "HIGH":
        return f"Priorytet: kontraktowanie nowych miejsc żłobkowych (prognozowany bilans 2028: {balance} miejsc) oraz tworzenie parków kieszonkowych (obecnie {grn['greenAreaM2PerCapita']} m² zieleni/os.)."
    if nursery_pot == "HIGH":
        return f"Wysoki potencjał inwestycyjny B2B/B2G dla żłobków i klubów dziecięcych z uwagi na napływ młodych rodzin (dynamika {dem['populationGrowthRate3YrPct']:+.1f}%, bilans 2028: {balance} miejsc)."
    if senior_def in ("HIGH", "MEDIUM") and senior_pct >= 24.0:
        return f"Rozbudowa sieci Centrów Aktywności Seniora (CAS) oraz oferty kulturalno-opiekuńczej z uwagi na wysoki odsetek mieszkańców 65+ ({senior_pct}%)."
    if green_def == "HIGH":
        return f"Pilne zwiększenie powierzchni terenów zielonych i skwerów lokalnych (wskaźnik {grn['greenAreaM2PerCapita']} m²/os. poniżej normy miejskiej 10 m²/os.)."
    if district["mobilityAndTransport"]["isochroneCoveragePct"] < 75.0:
        return f"Zwiększenie częstotliwości i zasięgu linii dowozowych KMK oraz rozbudowa ciągów pieszo-rowerowych (obecny zasięg izochrony 300m: {district['mobilityAndTransport']['isochroneCoveragePct']}%)."

    return f"Utrzymanie wysokiej dostępności usług publicznych w {name} przy wsparciu modernizacji przyszkolnej infrastruktury sportowej i oferty dla seniorów ({senior_pct}% populacji)."


def generate_competition_charts(districts: list[dict]) -> None:
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)

    fig, ax = plt.subplots(figsize=(10, 6), dpi=160)
    for d in districts:
        x = d["demographics"]["populationGrowthRate3YrPct"]
        y = d["forecastsAndB2B"]["forecastedCarePlacesBalance_2028"]
        size = max(40, d["demographics"]["totalPopulation"] / 600)
        color = "#e11d48" if y < -50 else "#0ea5e9"
        ax.scatter(x, y, s=size, color=color, alpha=0.75, edgecolors="#0f172a", linewidth=1.2)
        ax.annotate(d["districtRoman"], (x, y), xytext=(5, 4), textcoords="offset points", fontsize=8.5, fontweight="bold", color="#1e293b")

    ax.set_title("Kraków360: Dynamika demograficzna vs. Prognozowany bilans miejsc żłobkowych (2028)", fontsize=12, fontweight="bold")
    ax.set_xlabel("3-letnia dynamika demograficzna dzielnicy [%]")
    ax.set_ylabel("Prognozowany bilans miejsc opieki 0-3 lat w 2028 r. [miejsca]")
    ax.grid(True, linestyle="--", alpha=0.35)
    fig.tight_layout()
    chart1_path = CHARTS_DIR / "01_nursery_deficit_vs_growth_2028.png"
    fig.savefig(chart1_path)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=160)
    num_scores = 8
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

    print(f"[Step 04 - Forecasts] Saved analytical charts -> {chart1_path.name}, {chart2_path.name}")


def run_econometric_forecasts() -> None:
    in_path = PROCESSED_DATA_DIR / "districts_scored.json"
    if not in_path.exists():
        raise FileNotFoundError(f"Missing {in_path}. Run 03_calculate_quality_scores.py first.")

    with open(in_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    districts = payload["districts"]

    for d in districts:
        dem = d["demographics"]
        edu = d["educationAndCare"]
        grn = d["greeneryAndSport"]
        cult = d["cultureAndSociety"]

        cohorts = d.get("_internal", {}).get("birthCohorts", {})

        f_0to3, f_4to6 = forecast_cohorts_ols(cohorts, dem["populationGrowthRate3YrPct"], dem["age0to3"])

        # Assume 75% coverage target for 0-3 segment (standard municipal goal)
        target_demand_2028 = 0.75 * f_0to3

        balance_2028 = int(round(edu["totalCarePlaces0to3"] - target_demand_2028))

        f_7to14 = int(round(dem.get("age7to14", 0) * (1 + dem.get("populationGrowthRate3YrPct", 0) / 100.0)))

        # Harmonized with determineEducationExpansionPriority in frontend (10 HIGH / 4 MEDIUM / 4 LOW):
        care_places = edu.get("totalCarePlaces0to3", 0)
        kg_places = edu.get("kindergartenPlacesTotal", 0)
        sch_count = edu.get("primarySchoolsCount", 0)
        sch_cap = sch_count * 450

        tot_cap_2028 = care_places + kg_places + sch_cap
        tot_kids_2028 = f_0to3 + f_4to6 + f_7to14
        tot_bal_2028 = tot_cap_2028 - tot_kids_2028
        tot_cov_2028 = round((tot_cap_2028 / tot_kids_2028) * 100) if tot_kids_2028 > 0 else 0
        nur_bal_2028 = care_places - f_0to3
        kg_bal_2028 = kg_places - f_4to6
        sch_bal_2028 = sch_cap - f_7to14

        if tot_bal_2028 < 0 or nur_bal_2028 <= -700 or sch_bal_2028 <= -400:
            nursery_pot = "HIGH"
        elif tot_cov_2028 >= 160 and sch_bal_2028 >= 0 and kg_bal_2028 >= 0 and nur_bal_2028 >= -350:
            nursery_pot = "LOW"
        else:
            nursery_pot = "MEDIUM"

        senior_share = dem["age65Plus"] / max(dem["totalPopulation"], 1)
        if senior_share > 0.24 and cult["seniorActivityCentersCount"] < 3:
            senior_def = "HIGH"
        elif senior_share > 0.20:
            senior_def = "MEDIUM"
        else:
            senior_def = "LOW"

        if grn["greenAreaM2PerCapita"] < 10.0:
            green_def = "HIGH"
        elif grn["greenAreaM2PerCapita"] < 18.0:
            green_def = "MEDIUM"
        else:
            green_def = "LOW"

        assert nursery_pot in ALLOWED_POTENTIAL_LEVELS
        assert senior_def in ALLOWED_POTENTIAL_LEVELS
        assert green_def in ALLOWED_POTENTIAL_LEVELS

        d["forecastsAndB2B"] = {
            "forecastedAge0to3_2028": f_0to3,
            "forecastedCarePlacesBalance_2028": balance_2028,
            "forecastedAge4to6_2028": f_4to6,
            "nurseryInvestmentPotentialB2B": nursery_pot,
            "seniorInfrastructureDeficit": senior_def,
            "greenSpaceDeficit": green_def,
            "recommendedMunicipalAction": build_recommendation(d, nursery_pot, senior_def, green_def, balance_2028),
        }

        # Strip internal working data before final contract export
        d.pop("_internal", None)

    master_contract = {
        "metadata": {
            "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "dataVersion": "2.1.0-expanded-8-pillars-2025-2026",
            "normalizationMethod": "MinMax_0_100_Calibrated",
        },
        "districts": districts,
    }

    CONTRACTS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_master_path = CONTRACTS_OUTPUT_DIR / "krakow_districts_master.json"
    with open(out_master_path, "w", encoding="utf-8") as f:
        json.dump(master_contract, f, ensure_ascii=False, indent=2)

    generate_competition_charts(districts)
    print(f"[Step 04 - Forecasts] Exported final master contract -> {out_master_path}")


if __name__ == "__main__":
    run_econometric_forecasts()
    