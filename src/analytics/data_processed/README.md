> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Processed Intermediate Data (Data Processed)

## What is this folder used for?
This directory serves as a **working buffer** between individual computation stages in Python. It stores intermediate files produced after cleaning and integrating raw data, prior to generating the final system contracts.

This allows each analytics stage to run independently and facilitates easy inspection and verification of intermediate results.

---

## What is generated here and by which script?

### 1. `districts_aggregated.json`
- **How is it generated?** By executing the script:
  ```bash
  python scripts/01_etl_demographics_and_infrastructure.py
  ```
- **What does it contain?** Aggregated, hard metrics for each of Krakow's 18 districts:
  - exact population counts broken down by age groups (0–3, 4–6, 7–14, 15–64, 65+),
  - counts of foreign residents and temporary registrations,
  - capacity of places in nurseries and kindergartens, plus average school class sizes,
  - total area of parks and forests in hectares and m² of green space per resident,
  - cycling infrastructure (cycle track length, bicycle racks) and public transit stops,
  - safety, environmental, and residential real estate price statistics.

---

### 2. `districts_scored.json`
- **How is it generated?** By executing the script:
  ```bash
  python scripts/04_calculate_quality_scores.py
  ```
- **What does it contain?** All data from the previous file augmented with **7 normalized quality of life scores (0–100 scale)**:
  1. `mobilityScore` – Mobility and public transport,
  2. `educationScore` – Education and childcare,
  3. `greeneryScore` – Green spaces and recreation,
  4. `cultureAndSeniorScore` – Culture and senior services,
  5. `environmentScore` – Air quality and acoustic comfort,
  6. `safetyScore` – Public safety and order,
  7. `housingAffordabilityScore` – Housing affordability.

---

## What happens next with these files?
Files from this directory are consumed by the subsequent script:
```bash
python scripts/05_econometric_forecasts.py
```
which computes demographic forecasts for 2028, generates analytical charts, and writes the final master dataset to the `data/contracts/` directory.
