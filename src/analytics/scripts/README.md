> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Python Analytics & ETL Pipeline (Scripts)

## What is this folder used for?
This directory is the **computational brain** of the Krakow360 project. It contains the Python ETL (Extract, Transform, Load) pipeline and data science scripts responsible for ingesting raw municipal CSVs, performing advanced spatial and econometric calculations, and exporting clean, validated JSON contracts for the .NET 9 backend.

The pipeline is strictly sequential. It transforms unstructured, raw civic data into a production-ready, highly relational dataset without using hardcoded data ("magic numbers") or hallucinated metrics.

---

## Core Configuration & Dependencies

- **`requirements.txt`**: Defines the Python environment dependencies (e.g., `pandas`, `scikit-learn`, `geopandas`, `pyproj`, `matplotlib`).
- **`config.py`**: The central configuration module. It provides:
    - Global directory paths and the official definition of the 18 Krakow districts.
    - Coordinate reference system (CRS) transformers via **PyProj** (mapping `EPSG:3857`, `EPSG:2178`, and `EPSG:2180` to standard WGS84).
    - The core mathematical `min_max_normalize_0_100` function used across all scoring scripts.

---

## The Pipeline: Script by Script Deep Dive

### Step 01: `01_etl_demographics_and_infrastructure.py`
- **Purpose**: The foundational data ingestion and spatial resolution layer.
- **Inputs**: Reads dozens of raw CSVs from `data_raw/` (demographics, schools, parks, KMK transit stops, P+R, etc.) and `Korekty_Geoprzestrzenne_POI.csv`.
- **Methodology & Algorithms**:
    - **Dynamic Geocoding**: Connects to the official Polish **GUGiK API** to resolve street addresses into WGS84 coordinates. Utilizes a persistent `requests.Session()` and a local JSON cache (`spatial_geocoding_cache.json`) to massively reduce network latency.
    - **Point-in-Polygon (PiP)**: Uses `matplotlib.path` to geometrically test which district polygon contains a specific geographic coordinate.
    - **Stochastic Isochrones**: Instead of arbitrary multipliers, it calculates transit coverage using a **Poisson probability model** ($1 - e^{- \lambda}$), assuming a 300m walking radius ($\sim 0.2827 \text{ km}^2$) around effective transit stops.
    - **UUID Generation**: Generates globally unique identifiers (`uuid.uuid4()`) for every Point of Interest (POI) to strictly prevent Primary Key tracking conflicts in the Entity Framework Core database.
- **Outputs**: `data_processed/districts_aggregated.json` and `data/contracts/krakow_poi_locations.json`.

### Step 02: `02_calculate_quality_scores.py`
- **Purpose**: Computes the 8 fundamental Quality of Life (QoL) pillar scores for all 18 districts.
- **Inputs**: Reads `districts_aggregated.json`.
- **Methodology & Algorithms**:
    - **Min-Max Normalization**: Scales raw demographic/infrastructural data into a unified [0.0 - 100.0] index.
    - **Daytime Population Correction**: In the public safety module, it applies a multiplier (e.g., 1.55x for District I - Stare Miasto) to account for tourists and daily commuters, preventing the unfair inflation of crime rates per permanent resident.
    - **Bayesian Smoothing**: Adds constants to denominators (e.g., `areaKm2 + 8.0`) to penalize extreme statistical outliers in geographically tiny districts.
- **Outputs**: `data_processed/districts_scored.json`.

### Step 03: `03_etl_accessibility_profiles.py`
- **Purpose**: Generates the "Kraków bez Barier" (Accessibility Navigator) profiles.
- **Inputs**: Reads `districts_aggregated.json` (to reuse heavily processed transit/CAS data) and raw CSVs for PRM parking (Niebieskie Koperty) and UMK facility architectural audits.
- **Methodology & Algorithms**:
    - Evaluates 5 independent user profiles (Mobility, Visual, Hearing, Senior, Family Stroller).
    - **Econometric Penalties**: Specifically deducts points from District I (Stare Miasto) in the Mobility/Stroller categories due to historic cobblestone pavements ("kocie łby"), providing a realistic assessment of physical barriers.
    - **Natural Language Generation**: Synthesizes 3-bullet "Key Strengths" (e.g., presence of hearing loops or PJM translators) strictly based on boolean flags from the audits.
- **Outputs**: `data_processed/districts_accessibility.json` and `data/contracts/krakow_accessibility_profiles.json`.

### Step 04: `04_econometric_forecasts.py`
- **Purpose**: Builds predictive econometric models for the year 2028 and exports the master contract.
- **Inputs**: Reads `districts_scored.json`.
- **Methodology & Algorithms**:
    - **OLS Linear Regression (`scikit-learn`)**: Fits an Ordinary Least Squares trendline to historical single-year birth cohorts (2018–2025) to project raw birth rates up to 2028.
    - **Cohort-Component Migration**: Applies a dampened 3-year migration multiplier to the predicted baseline, effectively simulating families moving in or out of specific districts.
    - **Deficit Classification**: Maps mathematical balances (e.g., nursery places minus 2028 demand) into actionable B2B/B2G potential enums (`LOW`, `MEDIUM`, `HIGH`).
    - **Matplotlib**: Generates static, presentation-ready scatter and bar charts for the competition PDF report.
- **Outputs**: `data/contracts/krakow_districts_master.json` and PNG charts in `charts/`.

### Step 05: `05_etl_tourism_explorer.py`
- **Purpose**: Synthesizes the Smart Tourism module data (Passports, Itineraries, Overtourism Compass).
- **Inputs**: Reads `data_processed/krakow_tourism_seed.json` (curated base lists).
- **Methodology & Algorithms**:
    - **Haversine Formula**: Computes precise spherical distances between curated attractions and the Krakow Main Station.
    - **Urban Walking Heuristics**: Calculates realistic walking times assuming a 4.5 km/h pace combined with a 1.25 winding-street detour factor.
- **Outputs**: `data/contracts/krakow_tourism_explorer.json`.

### Step 06: `06_validate_and_export_contracts.py` (The Gatekeeper)
- **Purpose**: The final, automated schema and integrity validator before data is handed off to .NET and React.
- **Inputs**: Reads all four final JSON contract files in `data/contracts/`.
- **Methodology & Algorithms**:
    - Acts as a suite of unit tests for the data layer.
    - Verifies exact cardinality (must have exactly 18 districts), type checking (scores must be floats $\in [0, 100]$), enum compliance, and bounding-box validation (asserting all GPS coordinates actually fall within Krakow's metropolitan limits).
- **Execution**: Returns exit code `0` on success, or `1` with an itemized diagnostic list if any contract violation is detected.

---
**Execution Note**: To run the entire pipeline from scratch, activate your Python virtual environment and run the scripts in strict numerical order (01 through 06).