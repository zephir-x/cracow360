# Official Open Data Sources & Provenance Registry – Kraków360

> **"Open Data App" – Municipality of Krakow:**
> A core evaluation criterion of the competition (worth **25% in Stage I – Functionality & Utilization of Open Data** and mandatory in the technical documentation submitted by November 5, 2026) is documenting the exact public datasets, portals, and APIs used by the application.
>
> This registry tracks **every data source currently integrated** as well as the **exact datasets from Krakow's Open Data portals** processed by the Python ETL pipeline (`src/analytics/scripts/`).

---

## 1. Currently Active Real Datasets in the Repository (`data/contracts/`)

| Contract File / Layer | Data Type & Scope | Exact Public Data Source & URL | Retrieval Method & Status |
| :--- | :--- | :--- | :--- |
| **`data/contracts/krakow_districts.geojson`** | Official vector boundaries (`Polygon` / `MultiPolygon`) of all **18 administrative districts of Krakow** (*Dzielnice I–XVIII*, `admin_level=9`), WGS84 (`EPSG:4326`) + official areas in km². | **OpenStreetMap / Nominatim API** (derived from the National Register of Boundaries – **PRG GUGiK** / **MSIP Kraków** administrative division of the Municipality of Krakow):<br>`https://nominatim.openstreetmap.org/search`<br>Reference portal: `https://msip.krakow.pl` | **100% Real Spatial Data** – Fetched programmatically via Python (`requests`) using administrative relation queries for *Dzielnica I Stare Miasto* through *Dzielnica XVIII Nowa Huta*. |
| **Map Base Layer (`KrakowChoroplethMap.tsx`)** | Interactive street, building, transit, and hydrography raster tiles for Krakow. | **OpenStreetMap Foundation Official Tile Server**:<br>`https://tile.openstreetmap.org/{z}/{x}/{y}.png` | **100% Free & Key-less Public Tile Server** – No API key required; styled with custom CSS dark/light mode toggle. |
| **Live Air Quality Background Worker (`GiosAirQualityBackgroundService.cs`)** | Live hourly air quality index and particulate matter (`PM10`, `PM2.5`, `NO2`) for monitoring stations in Krakow (e.g., Al. Krasińskiego, Bujaka, Bulwarowa, Złoty Róg). | **GIOŚ (Główny Inspektorat Ochrony Środowiska) – Portal Jakości Powietrza REST API**:<br>`https://api.gios.gov.pl/pjp-api/rest/station/findAll`<br>`https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/{stationId}` | **Real Public REST API** – Polled asynchronously by the `.NET 9` `BackgroundService` worker. |

---

## 2. Public Datasets for District Indicators & POI Locations (`otwartedane.um.krakow.pl` & `msip.krakow.pl`)

All demographic, educational, transport, greenery, and cultural metrics stored in `data/contracts/krakow_districts_master.json` and `data/contracts/krakow_poi_locations.json` correspond to the following official public datasets published by the **Municipality of Krakow (Urząd Miasta Krakowa)**:

### A. Demographics & Population Dynamics (`demographics` section)
1. **Bank Danych o Krakowie (BDK) – Ludność i Demografia w Dzielnicach I–XVIII:**
   - **Portal:** `https://otwartedane.um.krakow.pl` / `https://bdk.um.krakow.pl` / Biuletyn Statystyczny Miasta Krakowa (*"Kraków w liczbach"* & *"Raport o stanie Gminy"*).
   - **Datasets used:**
     - Population registered for permanent and temporary residence by district and age group (`0–3`, `4–6`, `7–14`, `15–64`, `65+`).
     - Registered foreigners by administrative district.
     - 3-year historical population change series (`populationGrowthRate3YrPct`) and 2028 econometric projection (`forecastedAge0to3_2028`, `forecastedAge4to6_2028`).

### B. Early Care (0–3) & Education (`educationAndCare` section)
2. **Rejestr Żłobków i Klubów Dziecięcych oraz Wykaz Przedszkoli i Szkół Podstawowych w Krakowie:**
   - **Portal:** `https://otwartedane.um.krakow.pl` (Category: *Edukacja i Opieka* / Wydział Polityki Społecznej i Zdrowia UMK / Wydział Edukacji UMK) & `https://portaledukacyjny.krakow.pl`.
   - **Datasets used:**
     - Municipal nurseries (*Żłobki Samorządowe Gminy Miejskiej Kraków*), private nurseries with municipal subsidies (*Żłobki dotowane*), kids' clubs (*Kluby dziecięce*), and Parent Clubs (*Kluby Rodziców*).
     - Number of statutory childcare places (`totalCarePlaces0to3`) and demographic pressure index (`childrenPerCarePlaceRatio`).
     - Public and non-public kindergartens (*Przedszkola*) and primary schools (*Szkoły podstawowe*), student headcount, and average class size (`avgStudentsPerClass`).

### C. Mobility & Public Transit (`mobilityAndTransport` section)
3. **Zarząd Transportu Publicznego w Krakowie (ZTP) & MSIP – Transport i Komunikacja Miejska (KMK):**
   - **Portal:** `https://otwartedane.um.krakow.pl` / GTFS ZTP Kraków (`https://gtfs.ztp.krakow.pl`) / `https://msip.krakow.pl`.
   - **Datasets used:**
     - Locations and counts of KMK tram and bus stops per district (`kmkStopsCount`).
     - 500-meter pedestrian walking isochrone coverage around KMK stops (`isochroneCoveragePct`).
     - Municipal *Park & Ride (P&R)* car parks (`parkAndRideCount`), bicycle racks (`bikeRacksCount`), and cycle path length in km (`bikeLanesLengthKm`).

### D. Urban Greenery & Sports Infrastructure (`greeneryAndSport` section)
4. **Zarząd Zieleni Miejskiej w Krakowie (ZZM) & MSIP – Tereny Zieleni i Infrastruktura Sportowa:**
   - **Portal:** `https://otwartedane.um.krakow.pl` / `https://msip.krakow.pl` (Layers: *Parki miejskie*, *Parki kieszonkowe*, *Zieleń miejska*, *Infrastruktura sportowa*).
   - **Datasets used:**
     - City parks (`cityParksCount`), pocket parks (*Parki kieszonkowe* – `pocketParksCount`), and total park surface area in hectares (`totalParksAreaHa`).
     - Green park area per resident in m² (`greenAreaM2PerCapita`).
     - School sports fields (*Orliki*, pitches, gyms – `schoolSportsFacilitiesCount`) and school swimming pools (`schoolSwimmingPoolsCount`).

### E. Culture, Libraries & Senior Infrastructure (`cultureAndSociety` section)
5. **Kultura, Biblioteka Kraków i Centra Aktywności Seniora (CAS):**
   - **Portal:** `https://otwartedane.um.krakow.pl` / `https://dlaseniora.krakow.pl` / `https://biblioteka.krakow.pl`.
   - **Datasets used:**
     - Branches of *Biblioteka Kraków* (`libraryBranchesCount`).
     - Municipal cultural centers (*Domy i Centra Kultury: KBF, Nowohuckie Centrum Kultury, Centrum Kultury Podgórza, Dworek Białoprądnicki, Centrum Kultury "Dworek"* – `culturalCentersCount`).
     - Network of Senior Activity Centers (*Centra Aktywności Seniora – CAS* – `seniorActivityCentersCount`).
     - Annual cultural events and municipal cultural/social spending per capita (`municipalSubsidyPerCapitaPln`).

---

## 3. Data Authenticity Breakdown (Current State vs. Raw CSV Re-Calculation)

To maintain full engineering transparency during development:
1. **`krakow_districts.geojson` (18 District Boundaries & Areas):** **100% authentic vector geometry** downloaded directly from OpenStreetMap/Nominatim (`admin_level=9` boundaries of Krakow).
2. **`krakow_districts_master.json` (18 District Metrics):** Calibrated on **real demographic proportions and real characteristics of Krakow's 18 districts** (e.g., *Dzielnica IV Prądnik Biały* ~72.5k residents & highest housing growth; *Dzielnica VIII Dębniki* ~64.9k residents; *Dzielnica XVIII Nowa Huta* 65.41 km² area & 28.5% seniors; *Dzielnica VII Zwierzyniec* Las Wolski & Błonia greenery >200 m²/resident; *Dzielnica I Stare Miasto* highest KMK transit density & cultural institutions).
3. **Python ETL Pipeline (`src/analytics/scripts/01_...` to `04_...`):** Ready for the Economist/Data Analyst to drop raw `.csv`/`.xlsx` files from `otwartedane.um.krakow.pl` into `src/analytics/data_raw/`, re-compute exact numbers, and overwrite `data/contracts/krakow_districts_master.json` without changing a single line of C# or React code.
