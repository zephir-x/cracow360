> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Raw Source Data (Data Raw)

## What is this folder used for?
This directory contains **original, raw data files** (primarily `.csv` and `.geojson` formats) downloaded directly from public registers, open data portals of the City of Krakow, and national institutions.

These datasets reflect the real-world state of Krakow between 2023 and 2026, serving as the foundational layer of the **Cracow360** project.

---

## What datasets are located here?
The directory contains official datasets categorized thematically:
- **Demographics and Registration**: Statistics of registered permanent and temporary residents (broken down by age and sex) as well as foreign residents (Source: *Department of Administrative Affairs, Krakow City Hall - UMK*).
- **Education and Childcare**: Registries of municipal, private, and subsidized nurseries, municipal kindergartens, and primary schools with student counts and classes (*Department of Education, UMK*).
- **Greenery and Recreation**: Municipal parks, pocket parks, communal forests, and nature reserves (*Municipal Greenery Authority in Krakow - ZZM*), along with school sports facilities and swimming pools.
- **Transport and Mobility**: Public transport stop locations, Park & Ride (P+R) parking network, bicycle parking racks (*Public Transport Authority - ZTP*), and cycle track lengths.
- **Culture and Seniors**: Branches of the Krakow Library, municipal culture centers, and Senior Activity Centres (Centra Aktywności Seniora - CAS).
- **Environment and Acoustics**: PM10/PM2.5 particulate matter concentrations, smog days (*GIOŚ / WIOŚ*), and road traffic noise levels (*MSIP Krakow*).
- **Safety**: Road collisions, pedestrian accident statistics (*SEWiK Police Headquarters*), and Municipal Police (Straż Miejska) interventions.
- **Real Estate Market**: Average transaction and asking prices per m², rental rates, and housing affordability indicators based on average wages (*NBP BaRN, Otodom Analytics, MSIP RCN*).

---

## What and when should be placed here?
- Files in this directory serve as **input data**. Analytics scripts only read from them – **no script ever overwrites or deletes files in this folder**.
- When municipal datasets are updated (e.g. new annual city reports are released), simply place the updated `.csv` files into this folder and re-run the analytics pipeline.

---

## What uses this folder?
This folder is read by the initial ETL script of the analytics pipeline:
```bash
python scripts/01_etl_demographics_and_infrastructure.py
```
This script parses the raw tables, cleans the data, corrects encoding issues, matches addresses with geographic coordinates (geocoding), and exports processed outputs to the `data_processed/` folder.
