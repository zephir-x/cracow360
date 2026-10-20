"""
================================================================================
SCRIPT 03: 03_econometric_forecasts.py
================================================================================
GOAL / PURPOSE:
    Build econometric / cohort-component predictive models forecasting demographic
    changes and public infrastructure deficits for the year 2028 across all 18
    Krakow districts. Writes the final `data/contracts/krakow_districts_master.json`
    and generates static analytical charts in `src/analytics/charts/` for the
    2-page PDF competition report.
================================================================================
"""

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

from config import PROCESSED_DATA_DIR, CONTRACTS_OUTPUT_DIR, CHARTS_DIR, ALLOWED_POTENTIAL_LEVELS


def forecast_cohorts_ols(birth_cohorts: dict[str, int], growth_3yr_pct: float, age0to3_now: int) -> tuple[int, int]:
    """
    Combines OLS linear trend regression on single-year birth cohorts (2018-2025)
    with a cohort-component progression model to predict:
      - `forecastedAge0to3_2028` (children born 2025-2028 living in the district in 2028)
      - `forecastedAge4to6_2028` (children born 2022-2024 progressing to ages 4-6 in 2028)
    """
    years = np.array([y for y in range(2018, 2026)], dtype=float).reshape(-1, 1)
    counts = np.array([float(birth_cohorts.get(str(y), age0to3_now / 4.0)) for y in range(2018, 2026)], dtype=float)

    model = LinearRegression()
    model.fit(years, counts)

    future_years = np.array([[2025.0], [2026.0], [2027.0], [2028.0]])
    pred_annual = model.predict(future_years)
    # Apply dampened migration multiplier from 3-year district growth rate
    mig_factor = 1.0 + (growth_3yr_pct / 100.0) * 0.85
    raw_0to3_2028 = float(np.sum(np.maximum(pred_annual, counts[-1] * 0.70))) * mig_factor
    forecast_0to3 = int(round(max(age0to3_now * 0.82, min(age0to3_now * 1.28, raw_0to3_2028))))

    # Cohort progression for 4-6 in 2028 (children born in 2022, 2023, 2024 + family migration)
    base_2022_2024 = sum(int(birth_cohorts.get(str(y), 0)) for y in (2022, 2023, 2024))
    if base_2022_2024 <= 0:
        base_2022_2024 = int(round(age0to3_now * 0.75))
    forecast_4to6 = int(round(base_2022_2024 * (1.0 + (growth_3yr_pct / 100.0) * 0.65)))

    return forecast_0to3, forecast_4to6


def build_recommendation(d: dict, nursery_pot: str, senior_def: str, green_def: str) -> str:
    """Generates a concise, data-driven Polish strategic recommendation for the district."""
    name = d["districtName"]
    dem = d["demographics"]
    grn = d["greeneryAndSport"]
    fb = d["forecastsAndB2B"]
    senior_pct = round((dem["age65Plus"] / max(dem["totalPopulation"], 1)) * 100.0, 1)
    balance = fb["forecastedCarePlacesBalance_2028"]

    if nursery_pot == "HIGH" and green_def == "HIGH":
        return (
            f"Priorytet: kontraktowanie nowych miejsc \u017c\u0142obkowych (prognozowany bilans 2028: {balance} miejsc) "
            f"oraz tworzenie park\u00f3w kieszonkowych (obecnie {grn['greenAreaM2PerCapita']} m\u00b2 zieleni/os.)."
        )
    if nursery_pot == "HIGH":
        return (
            f"Wysoki potencja\u0142 inwestycyjny B2B/B2G dla \u017c\u0142obk\u00f3w i klub\u00f3w dzieci\u0119cych z uwagi na nap\u0142yw m\u0142odych rodzin "
            f"(dynamika {dem['populationGrowthRate3YrPct']:+.1f}%, bilans 2028: {balance} miejsc)."
        )
    if senior_def in ("HIGH", "MEDIUM") and senior_pct >= 24.0:
        return (
            f"Rozbudowa sieci Centr\u00f3w Aktywno\u015bci Seniora (CAS) oraz oferty kulturalno-opieku\u0144czej "
            f"z uwagi na wysoki odsetek mieszka\u0144c\u00f3w 65+ ({senior_pct}%)."
        )
    if green_def == "HIGH":
        return (
            f"Pilne zwi\u0119kszenie powierzchni teren\u00f3w zielonych i skwer\u00f3w lokalnych "
            f"(wska\u017anik {grn['greenAreaM2PerCapita']} m\u00b2/os. poni\u017cej normy miejskiej 10 m\u00b2/os.)."
        )
    if d["mobilityAndTransport"]["isochroneCoveragePct"] < 75.0:
        return (
            f"Zwi\u0119kszenie cz\u0119stotliwo\u015bci i zasi\u0119gu linii dowozowych KMK oraz rozbudowa ci\u0105g\u00f3w pieszo-rowerowych "
            f"(obecny zasi\u0119g izochrony 500m: {d['mobilityAndTransport']['isochroneCoveragePct']}%)."
        )
    return (
        f"Utrzymanie wysokiej dost\u0119pno\u015bci us\u0142ug publicznych w {name} przy wsparciu modernizacji przyszkolnej "
        f"infrastruktury sportowej i oferty dla senior\u00f3w ({senior_pct}% populacji)."
    )


def generate_competition_charts(districts: list[dict]) -> None:
    """Generates static high-resolution charts in `src/analytics/charts/` for the 2-page PDF report."""
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)

    # Chart 1: Demographic Growth vs. Projected Nursery Balance 2028
    fig, ax = plt.subplots(figsize=(10, 6), dpi=160)
    x_growth = [d["demographics"]["populationGrowthRate3YrPct"] for d in districts]
    y_balance = [d["forecastsAndB2B"]["forecastedCarePlacesBalance_2028"] for d in districts]
    colors = [
        "#dc2626" if d["forecastsAndB2B"]["nurseryInvestmentPotentialB2B"] == "HIGH"
        else "#d97706" if d["forecastsAndB2B"]["nurseryInvestmentPotentialB2B"] == "MEDIUM"
        else "#059669"
        for d in districts
    ]

    ax.axhline(0, color="#64748b", linestyle="--", linewidth=1, alpha=0.7)
    ax.axvline(0, color="#64748b", linestyle=":", linewidth=1, alpha=0.7)
    ax.scatter(x_growth, y_balance, c=colors, s=110, alpha=0.9, edgecolors="#0f172a", linewidth=0.8)

    for d, x, y in zip(districts, x_growth, y_balance):
        ax.annotate(
            d["districtRoman"],
            (x, y),
            xytext=(5, 4),
            textcoords="offset points",
            fontsize=8.5,
            fontweight="bold",
            color="#1e293b",
        )

    ax.set_title("Krak\u00f3w360: Dynamika demograficzna vs. Prognozowany bilans miejsc \u017c\u0142obkowych (2028)", fontsize=12, fontweight="bold")
    ax.set_xlabel("3-letnia dynamika demograficzna dzielnicy [%]")
    ax.set_ylabel("Prognozowany bilans miejsc opieki 0-3 lat w 2028 r. [miejsca]")
    ax.grid(True, linestyle="--", alpha=0.35)
    fig.tight_layout()
    chart1_path = CHARTS_DIR / "01_nursery_deficit_vs_growth_2028.png"
    fig.savefig(chart1_path)
    plt.close(fig)

    # Chart 2: Top Ranking of Districts by Equal-Weighted Quality of Life Index
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=160)
    ranked = sorted(
        districts,
        key=lambda d: sum(d["scores"].values()) / 5.0,
    )
    labels = [f"{d['districtRoman']} {d['districtName'].replace('Dzielnica ' + d['districtRoman'] + ' ', '')}" for d in ranked]
    avg_scores = [round(sum(d["scores"].values()) / 5.0, 1) for d in ranked]

    bars = ax.barh(labels, avg_scores, color="#0065b3", edgecolor="#0f2942", height=0.68)
    for bar, val in zip(bars, avg_scores):
        ax.text(val + 0.6, bar.get_y() + bar.get_height() / 2, f"{val:.1f}", va="center", fontsize=8.5, fontweight="bold")

    ax.set_xlim(0, 100)
    ax.set_title("Krak\u00f3w360: Bazowy Indeks Jako\u015bci \u017bycia (\u015brednia 5 wymiar\u00f3w, wagi r\u00f3wne 5/10)", fontsize=12, fontweight="bold")
    ax.set_xlabel("Syntetyczny wynik jako\u015bci \u017cycia [0 - 100 pkt]")
    ax.grid(axis="x", linestyle="--", alpha=0.35)
    fig.tight_layout()
    chart2_path = CHARTS_DIR / "02_quality_of_life_ranking_18_districts.png"
    fig.savefig(chart2_path)
    plt.close(fig)
    print(f"[Step 03 - Forecasts] Saved analytical charts -> {chart1_path.name}, {chart2_path.name}")


def run_econometric_forecasts() -> None:
    in_path = PROCESSED_DATA_DIR / "districts_scored.json"
    if not in_path.exists():
        raise FileNotFoundError(f"Missing {in_path}. Run 02_calculate_quality_scores.py first.")

    with open(in_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    districts = payload["districts"]

    for d in districts:
        dem = d["demographics"]
        edu = d["educationAndCare"]
        grn = d["greeneryAndSport"]
        cult = d["cultureAndSociety"]
        internal = d.get("_internal", {})
        cohorts = internal.get("birthCohorts", {})

        f_0to3, f_4to6 = forecast_cohorts_ols(
            cohorts, dem["populationGrowthRate3YrPct"], dem["age0to3"]
        )

        # Effective demand benchmark: 75% of registered 0-3 cohort + commuter demand pressure
        target_demand_2028 = 0.75 * f_0to3
        balance_2028 = int(round(edu["totalCarePlaces0to3"] - target_demand_2028))

        if balance_2028 < -150 and dem["populationGrowthRate3YrPct"] > 1.2:
            nursery_pot = "HIGH"
        elif balance_2028 < 0 or edu["childrenPerCarePlaceRatio"] > 1.35:
            nursery_pot = "MEDIUM"
        else:
            nursery_pot = "LOW"

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
            "recommendedMunicipalAction": "",
        }
        d["forecastsAndB2B"]["recommendedMunicipalAction"] = build_recommendation(
            d, nursery_pot, senior_def, green_def
        )

        # Remove internal working dictionary before exporting contract
        d.pop("_internal", None)

    master_contract = {
        "metadata": {
            "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "dataVersion": "2.0.0-real-open-data-2025-2026",
            "normalizationMethod": "MinMax_0_100",
        },
        "districts": districts,
    }

    CONTRACTS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_master_path = CONTRACTS_OUTPUT_DIR / "krakow_districts_master.json"
    with open(out_master_path, "w", encoding="utf-8") as f:
        json.dump(master_contract, f, ensure_ascii=False, indent=2)

    generate_competition_charts(districts)
    print(f"[Step 03 - Forecasts] Exported final master contract -> {out_master_path}")


if __name__ == "__main__":
    run_econometric_forecasts()
