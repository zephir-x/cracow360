"""
STEP 3: Econometric demographic forecasting models (2027-2030) and B2B/B2G deficit analysis.
Used in Module 3 (Official & Investor Mode - Development & Investment Simulator).
"""

from config import ALLOWED_POTENTIAL_LEVELS


def run_econometric_forecasts_demo() -> None:
    print("[Forecasts] Econometric time-series / regression pipeline for 2027-2030.")
    print(f"[Forecasts] Allowed B2B/B2G deficit classification levels: {sorted(ALLOWED_POTENTIAL_LEVELS)}")


if __name__ == "__main__":
    run_econometric_forecasts_demo()
