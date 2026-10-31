> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Raw Source Data (Data Raw)

## What is this folder used for?
This directory contains **original, raw data files** (primarily `.csv` formats) downloaded directly from public registers, open data portals of the City of Krakow, and national institutions.

These datasets reflect the real-world state of Krakow between 2023 and 2026, serving as the immutable foundational layer of the **Cracow360** project.

---

## What datasets are located here?
The directory contains over 30 official datasets categorized thematically:
- **Demographics and Registration**: Statistics of registered permanent and temporary residents (broken down by age cohorts) and foreign residents (Source: *Department of Administrative Affairs, Krakow City Hall - UMK*).
- **Education and Childcare**: Registries of municipal, private, and contracted nurseries, kindergartens, and primary schools with student counts and classes (*Department of Education, UMK*).
- **Greenery and Recreation**: Municipal parks, pocket parks, and communal forests (*Municipal Greenery Authority in Krakow - ZZM*), along with school sports facilities and pools.
- **Transport and Mobility**: Public transport stop locations (KMK), Park & Ride (P+R) networks, bicycle parking racks (*Public Transport Authority - ZTP*), and cycle track lengths.
- **Culture and Seniors**: Branches of the Krakow Library, municipal culture centers, and Senior Activity Centres (CAS).
- **Accessibility (Kraków bez Barier)**: Designated PRM parking stalls (Niebieskie Koperty) and architectural accessibility audits of public facilities (*UMK / MFiPR*).
- **Environment and Acoustics**: PM10/PM2.5 particulate matter concentrations and smog days (*GIOŚ / WIOŚ*).
- **Safety**: Road collisions and pedestrian accident statistics (*SEWiK Police Headquarters*).
- **Real Estate Market**: Average transaction prices, rental rates, and housing affordability indicators (*NBP BaRN, Otodom Analytics*).
- **Configuration Defaults**: System files like `Korekty_Geoprzestrzenne_POI.csv` (manual spatial coordinate overrides for parks/forests) and `Dzielnice_Krakowa.csv` (official administrative definitions of the 18 districts).

---

## What and when should be placed here?
- Files in this directory serve strictly as **input data**. Analytics scripts only read from them – **no script ever overwrites, modifies, or deletes files in this folder**.
- When municipal datasets are updated (e.g. new annual city reports are released), simply place the updated `.csv` files into this folder (ensuring the naming matches regex patterns used in the codebase) and re-run the analytics pipeline.

---

## What uses this folder?
This folder is read sequentially by the main ETL scripts of the analytics pipeline:
- `01_etl_demographics_and_infrastructure.py` (Base aggregation & GUGiK geocoding)
- `03_etl_accessibility_profiles.py` (PRM parking and architectural audits)

These scripts parse the raw tables, clean the data, correct BOM/encoding issues, execute Point-in-Polygon spatial mapping, and export the structured results to the `data_processed/` folder.