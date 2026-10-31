> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Processed Intermediate Data (Data Processed)

## What is this folder used for?
This directory serves as a **working buffer** between individual computation stages in Python. It strictly isolates intermediate files produced after cleaning and integrating raw data, prior to generating the final system contracts.

It also securely stores operational states (like the persistent geocoding cache) and manually curated seed data, preventing them from contaminating the final `data/contracts/` integration folder. This allows each analytics stage to run independently and facilitates easy inspection of intermediate results.

---

## What is located here and by which script is it generated?

### 1. `districts_aggregated.json`
- **How is it generated?** By executing the baseline ETL script:
  ```bash
  python scripts/01_etl_demographics_and_infrastructure.py
  ```
- **What does it contain?** Aggregated, hard metrics for each of Krakow's 18 districts without any synthetic scores:
  - exact population counts broken down by age groups, temporary registrations, and foreign residents,
  - capacities of nurseries and kindergartens, plus average school class sizes,
  - exact public transit metrics (including pre-calculated percentages of Kassel-kerb curbs and tactile paving),
  - total area of parks/forests and objective environmental, safety, and housing statistics.

---

### 2. `districts_scored.json`
- **How is it generated?** By executing the scoring script:
  ```bash
  python scripts/02_calculate_quality_scores.py
  ```
- **What does it contain?** All hard data from the previous file augmented with 8 normalized quality of life scores (0–100 scale):
  - `mobilityScore` – Public transport and cycling infrastructure,
  - `educationScore` – Education and childcare capacities,
  - `greeneryScore` – Green spaces and recreation,
  - `cultureAndSeniorScore` – Libraries, CAS centers, and culture,
  - `environmentScore` – Air quality and acoustic comfort,
  - `safetyScore` – Public safety and traffic accident rates (adjusted for daytime population),
  - `housingAffordabilityScore` – Housing affordability,
  - `demographicVitalityScore` – Demographic growth and youth retention.

---

### 3. `districts_accessibility.json`
- **How is it generated?** By executing the accessibility ETL script:
  ```bash
  python scripts/03_etl_accessibility_profiles.py
  ```
- **What does it contain?** Processed profiles evaluating urban accessibility for wheelchair users, visually/hearing impaired individuals, seniors, and parents with strollers based on public infrastructure audits.

---

### 4. System & Operational Files
- `spatial_geocoding_cache.json`: A persistent state file maintained by `01_etl_demographics_and_infrastructure.py`. It stores historically resolved GPS coordinates from the official GUGiK API to massively reduce network latency on subsequent pipeline runs.
- `krakow_tourism_seed.json`: A manually curated seed file defining thematic itineraries, overtourism alternatives, and basic summary metrics. It is consumed by `05_etl_tourism_explorer.py` to generate the final tourist passports.

---

## What happens next with these files?
Files from this directory are consumed by downstream econometric and synthesis scripts (such as `04_econometric_forecasts.py` and `05_etl_tourism_explorer.py`), which compute cohort-component demographic forecasts for 2028, generate analytical charts, and write the final production-ready JSON files into the `data/contracts/` directory.