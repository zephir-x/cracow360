# Developer Guide for Data Analyst / Economist (Python & Econometrics Module)

Welcome to the **Kraków360** project! This guide explains how to clone the repository, set up your isolated Python environment, run and test your scripts completely independently (without needing `.NET` or `React`), and commit your work safely to Git.

---

## 1. Golden Rules of Workspace Isolation (IMPORTANT!)

The repository is strictly divided into independent zones:
- **Your exclusive working directory is:** `src/analytics/`
- **The output directory where your scripts export final JSON files is:** `data/contracts/`
  - `data/contracts/krakow_districts_master.json`
  - `data/contracts/krakow_poi_locations.json`

> **RULE #1:** **Never edit, delete, or add files inside `src/backend/` or `src/frontend/`.** Those directories contain the C# (.NET 9) and TypeScript (React) application code maintained by Kacper.
>
> **RULE #2:** Place all raw files downloaded from the internet (`.csv`, `.xlsx`, `.geojson`) **exclusively** inside `src/analytics/data_raw/`. This folder is ignored by Git so large raw datasets will never pollute the repository.
>
> **RULE #3:** You do **NOT** need to install `.NET`, `Node.js`, `React`, or `Docker` to work on and test your Python scripts. Your `src/analytics/` environment is 100% standalone.

---

## 2. Initial Setup – Cloning the Repo & Activating Python

### Step 1: Clone the repository (only once)
Open PowerShell or Git Bash in the folder where you want to keep the project and run:
```powershell
git clone https://github.com/zephir-x/cracow360.git
cd cracow360/src/analytics
```

### Step 2: Create and activate the isolated Python virtual environment (`.venv`)
Inside `src/analytics`, run:
```powershell
# 1. Create the virtual environment (only the first time)
python -m venv .venv

# 2. Activate the environment (every time you open a new terminal)
.\.venv\Scripts\Activate.ps1

# 3. Install all required packages (pandas, geopandas, scikit-learn, statsmodels, etc.)
pip install -r requirements.txt
```
*(In VS Code or PyCharm, select the Python interpreter located at `src/analytics/.venv/Scripts/python.exe`).*

---

## 3. Structure of Your Workspace (`src/analytics/`)

```text
src/analytics/
├── data_raw/               # <-- Put raw CSV, XLSX, GeoJSON files downloaded from City portals HERE
├── data_processed/         # <-- Save intermediate/cleaned tables HERE
├── notebooks/              # <-- Create Jupyter notebooks (.ipynb) for econometric experiments HERE
├── charts/                 # <-- Save static charts (PNG/PDF) for our 2-page competition report HERE
├── scripts/                # <-- Production Python scripts (numbered 01 to 04 in execution order):
│   ├── config.py                                    # List of 18 Krakow districts & Min-Max (0-100) normalization helper
│   ├── 01_etl_demographics_and_infrastructure.py    # Step 1: Cleaning data, merging demographics, geocoding addresses
│   ├── 02_calculate_quality_scores.py               # Step 2: Computing the 5 Quality of Life scores (0-100)
│   ├── 03_econometric_forecasts.py                  # Step 3: Computing 2027-2030 demographic forecasts & B2B potential
│   └── 04_validate_and_export_contracts.py          # Step 4: VALIDATOR - checks your JSON files against the Data Contract!
└── requirements.txt        # Python dependencies list
```
*(Note: `.gitkeep` files inside `data_raw/`, `data_processed/`, `notebooks/`, and `charts/` are empty placeholder files that force Git to preserve empty folder structures when cloning the repo. Leave them in place).*

---

## 4. Your Analytical & Econometric Tasks

### Task 1: Download Raw Datasets into `src/analytics/data_raw/`
Download from `otwartedane.um.krakow.pl` and `msip.krakow.pl`:
1. **Demographics (18 districts):** permanent residents, temporary residents, foreigners (by age and gender) + vital statistics (births, deaths, migration balance since 1995).
2. **Education & Early Care:** municipal nurseries, contracted nurseries, private nurseries, kids' clubs (locations + capacity), parent clubs, kindergartens, and primary schools (number of classes and students).
3. **Greenery & Sport:** city parks and pocket parks (area in ha + location), school sports facilities (fields, swimming pools, gyms).
4. **Transport & Mobility:** KMK transit stops, walking isochrone coverage, P+R parking lots, bike racks, and bike lane length.
5. **Culture & Seniors:** Senior Activity Centers (CAS), Krakow Library branches, cultural centers (events count, municipal subsidy per capita).

### Task 2: Compute the 5 Quality of Life Category Scores (`0–100` scale)
For each of the 18 districts, calculate the 5 normalized category scores (`0.0 – 100.0`) using `min_max_normalize_0_100` from `scripts/config.py`:
- `mobilityScore` (stimulant: more stops/bike lanes/isochrone coverage = closer to 100),
- `educationScore` (watch out for destimulants: fewer children per nursery place and smaller class sizes = higher score -> use `invert=True`),
- `greeneryScore` (park area m² per capita + school sports facilities),
- `cultureAndSeniorScore` (libraries, cultural centers, CAS, annual events),
- `environmentScore` (air quality adjusted for tourist traffic and vehicle density).

### Task 3: 2027–2030 Econometric Forecast Model & B2B Potential
In the `forecastsAndB2B` section for each of the 18 districts, compute:
- `forecastedAge0to3_2028` – predicted number of children aged 0–3 in 2028,
- `forecastedCarePlacesBalance_2028` – nursery capacity balance (positive = surplus places, negative = deficit of places),
- `forecastedAge4to6_2028` – predicted number of kindergarten-age children in 2028,
- `nurseryInvestmentPotentialB2B`, `seniorInfrastructureDeficit`, `greenSpaceDeficit` – must be **strictly** one of: `"LOW"`, `"MEDIUM"`, `"HIGH"`,
- `recommendedMunicipalAction` – concise strategic recommendation in Polish for the City Hall (1–2 sentences displayed in the UI).

---

## 5. How to Test and Validate Your JSON Output

Before committing your changes to Git, **ALWAYS** run the validator script. It automatically verifies that no JSON keys have typos, all scores are within `0–100`, enums match allowed values, and GPS coordinates lie within Krakow:

```powershell
# Inside src/analytics (with .venv activated):
python scripts/04_validate_and_export_contracts.py
```

- If you see `[OK] ... is 100% compliant with the Data Contract!`, your data is ready to commit.
- If you see `[ERROR]`, the script will print the exact district ID or POI ID that needs fixing.

---

## 6. Safe Git Workflow (How to Pull and Save Changes)

To ensure you never overwrite Kacper's code, always follow these 4 steps:

### Step 1: Before starting work each day – pull the latest changes
```powershell
git pull
```

### Step 2: Work inside `src/analytics/` and run the contract validator
```powershell
python src/analytics/scripts/04_validate_and_export_contracts.py
```

### Step 3: Check modified files
```powershell
git status
```
*(Verify that only files inside `src/analytics/` and `data/contracts/` appear as modified).*

### Step 4: Stage ONLY your directories, commit, and push
```powershell
git add src/analytics/ data/contracts/
git commit -m "Analytics: update district scores and econometric forecast contracts"
git push
```
By running `git add src/analytics/ data/contracts/`, you are guaranteed never to stage or touch any file outside your workspace.
