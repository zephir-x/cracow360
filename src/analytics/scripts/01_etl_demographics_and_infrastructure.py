"""
STEP 1: Fetching and cleaning raw datasets from otwartedane.um.krakow.pl and msip.krakow.pl.
Reads raw CSV/XLSX files from `data_raw/` and writes cleaned intermediate tables to `data_processed/`.
"""

from config import RAW_DATA_DIR, PROCESSED_DATA_DIR, KRAKOW_DISTRICTS


def run_etl() -> None:
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[ETL] Raw data directory: {RAW_DATA_DIR}")
    print(f"[ETL] Configured Krakow districts count: {len(KRAKOW_DISTRICTS)}")
    print("[ETL] Place downloaded CSV/XLSX files in 'data_raw/' and implement aggregation logic here.")


if __name__ == "__main__":
    run_etl()
