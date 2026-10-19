# Official Open Data Sources & Provenance Registry – Kraków360

> **"Open Data App" – Municipality of Krakow:**
> A core evaluation criterion of the competition (worth **25% in Stage I – Functionality & Utilization of Open Data** and mandatory in the technical documentation submitted by November 5, 2026) is documenting the exact public datasets, portals, and APIs used by the application.
>
> This registry documents **every official public data source integrated** into the platform, including exact verified URLs on `otwartedane.um.krakow.pl`, `msip.krakow.pl`, and `api.gios.gov.pl`, as well as the exact raw CSV files processed by the Python ETL pipeline (`src/analytics/scripts/`).

---

## 1. Spatial Boundaries, Base Map & Live Environmental APIs

| Contract File / Layer | Data Type & Scope | Exact Verified Public Data Source & URL | Retrieval Method & Status |
| :--- | :--- | :--- | :--- |
| **`data/contracts/krakow_districts.geojson`** | Official vector boundaries (`Polygon` / `MultiPolygon`) of all **18 administrative districts of Krakow** (*Dzielnice I–XVIII*, `admin_level=9`), WGS84 (`EPSG:4326`) + official areas in km². | **OpenStreetMap / Nominatim API** (derived from the National Register of Boundaries – **PRG GUGiK** / **MSIP Kraków** administrative division of the Municipality of Krakow):<br>• `https://nominatim.openstreetmap.org/search`<br>• `https://msip.krakow.pl` | **100% Real Spatial Data** – Fetched programmatically and used for `point-in-polygon` spatial joins in `01_etl_demographics_and_infrastructure.py`. |
| **Map Base Layer (`KrakowChoroplethMap.tsx`)** | Interactive street, building, transit, and hydrography raster tiles for Krakow. | **OpenStreetMap Foundation Official Tile Server**:<br>• `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | **100% Free & Key-less Public Tile Server** – Styled with custom CSS light/dark mode toggle and bounded to Krakow (`maxBounds`). |
| **Live Air Quality Background Worker (`GiosAirQualityBackgroundService.cs`)** | Live hourly air quality index and particulate matter (`PM10`, `PM2.5`, `NO2`) for monitoring stations in Krakow. | **GIOŚ (Główny Inspektorat Ochrony Środowiska) – Portal Jakości Powietrza REST API**:<br>• `https://api.gios.gov.pl/pjp-api/rest/station/findAll`<br>• `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/{stationId}`<br>• `https://powietrze.gios.gov.pl` | **Real Public REST API** – Polled asynchronously by the `.NET 9` `BackgroundService` worker. |

---

## 2. Official Municipality of Krakow Open Data Datasets (`otwartedane.um.krakow.pl`)

All indicators in `data/contracts/krakow_districts_master.json` (18 districts) and `data/contracts/krakow_poi_locations.json` (points of interest) are computed from the following official datasets published by the **Municipality of Krakow (Urząd Miasta Krakowa)**:

### A. Demographics & Population Dynamics (`demographics` & `forecastsAndB2B`)

| Dataset Title on Portal | Verified Portal URL | Raw CSV File(s) in `src/analytics/data_raw/` | Indicators Computed |
| :--- | :--- | :--- | :--- |
| **Mieszkańcy Krakowa zameldowani na pobyt stały** | `https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly` | • `Mieszkańcy Krakowa zameldowani na pobyt stały - stan na 31.12.2025.csv`<br>• *(Supplementary)* `Mieszkańcy Krakowa zameldowani na pobyt stały - stan na 31.12.2023.csv` | `permanentResidents` (703,697), age cohorts (`age0to3`, `age4to6`, `age7to14`, `age15to64`, `age65Plus`), single-year birth cohorts (`2010–2025`), `populationGrowthRate3YrPct`, `forecastedAge0to3_2028`, `forecastedAge4to6_2028`. |
| **Mieszkańcy Krakowa zameldowani na pobyt czasowy** | `https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-krakowa-zameldowani-na-pobyt-czasowy` | • `Mieszkańcy Krakowa zameldowani na pobyt czasowy - stan na 31.12.2025.csv`<br>• *(Supplementary)* `Mieszkańcy Krakowa zameldowani na pobyt czasowy - stan na 31.12.2023.csv` | `temporaryResidents` (32,258), combined `totalPopulation` (735,955), age cohorts. |
| **Cudzoziemcy w Krakowie zameldowani na pobyt stały** | `https://otwartedane.um.krakow.pl/zbiory-danych/cudzoziemcy-w-krakowie-zameldowani-na-pobyt-staly` | • `Cudzoziemcy w Krakowie zameldowani na pobyt stały- stan na 31.12.2025.csv` | `foreignersTotal` (permanent: 5,766) by district (`Nr_Dzielnicy`). |
| **Cudzoziemcy w Krakowie zameldowani na pobyt czasowy** | `https://otwartedane.um.krakow.pl/zbiory-danych/cudzoziemcy-w-krakowie` | • `Cudzoziemcy w Krakowie zameldowani na pobyt czasowy - stan na 31.12.2025.csv` | `foreignersTotal` (temporary: 15,008; total foreigners: 20,774) by district (`Nr_Dzielnicy`). |

---

### B. Education & Early Childcare 0–14 Years (`educationAndCare` & POIs)

| Dataset Title on Portal | Verified Portal URL | Raw CSV File(s) in `src/analytics/data_raw/` | Indicators Computed |
| :--- | :--- | :--- | :--- |
| **Żłobki samorządowe w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-samorzadowe-w-krakowie` | • `Żłobki samorządowe w Krakowie.csv` | `nurseriesPublicCount` (33 facilities), statutory places in `totalCarePlaces0to3`, POI `NURSERY_PUBLIC`. |
| **Żłobki prowadzone na zlecenie Gminy Miejskiej Kraków** | `https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-niesamorzadowe-prowadzone-na-zlecenie-gminy-miejskiej-krakow` | • `Żłobki prowadzone na zlecenie Gminy Miejskiej Kraków.csv` | `nurseriesContractedCount` (11 facilities), places in `totalCarePlaces0to3`, POI `NURSERY_CONTRACTED`. |
| **Żłobki prywatne w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-prywatne-w-krakowie` | • `Żłobki prywatne w Krakowie.csv` | `nurseriesPrivateCount` (266 facilities), places in `totalCarePlaces0to3`, POI `NURSERY_PRIVATE`. |
| **Kluby dziecięce w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/kluby-dzieciece-w-krakowie` | • `Kluby dziecięce w Krakowie.csv` | `kidsClubsCount` (21 facilities), places in `totalCarePlaces0to3`, `childrenPerCarePlaceRatio`, POI `KIDS_CLUB`. |
| **Kluby Rodziców z dziećmi do lat 3 w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/kluby-rodzicow-z-dziecmi-do-lat-3-w-krakowie` | • `Kluby Rodziców z dziećmi do lat 3 w Krakowie.csv` | `parentClubsCount` (50 locations with explicit `Numer Dzielnicy`), POI `PARENT_CLUB`. |
| **Przedszkola w Krakowie - liczba dzieci** | `https://otwartedane.um.krakow.pl/zbiory-danych/przedszkola-w-krakowie-liczba-dzieci` | • `Przedszkola niesamorządowe w roku 2025-2026 - liczba dzieci i oddziałów.csv`<br>• *(Supplementary)* `Przedszkola samorządowe w roku 2025-2026 - liczba dzieci i oddziałów.csv` | `kindergartensCount`, `kindergartenPlacesTotal`, POI `KINDERGARTEN`. |
| **Szkoły podstawowe w Krakowie - liczba uczniów** | `https://otwartedane.um.krakow.pl/zbiory-danych/szkoly-podstawowe-w-krakowie-liczba-dzieci` | • `Szkoły podstawowe samorządowe w roku 2025-2026 - liczba uczniów.csv`<br>• *(Supplementary)* `Szkoły podstawowe niesamorządowe w roku 2025-2026 - liczba uczniów.csv` | `primarySchoolsCount`, `primarySchoolStudentsTotal`, `avgStudentsPerClass`, POI `PRIMARY_SCHOOL`. |

---

### C. Mobility, Public Transit (KMK) & Cycling (`mobilityAndTransport` & POIs)

| Dataset Title on Portal | Verified Portal URL | Raw CSV File(s) in `src/analytics/data_raw/` | Indicators Computed |
| :--- | :--- | :--- | :--- |
| **Komunikacja Miejska w Krakowie (KMK)** | `https://otwartedane.um.krakow.pl/zbiory-danych/komunikacja-miejska-w-krakowie-kmk` | • `Przystanki_Komunikacji_Miejskiej_w_Krakowie_0dd92c61a9b14ab1ba29b09d67dde5a7.csv` (`EPSG:3857`)<br>• `Izochrony__8460122848802456708.csv`<br>• `Park_and_Ride_1756331490845911801.csv` (`EPSG:2178`) | `kmkStopsCount` (2,329 stops inside Krakow's 18 districts via `point-in-polygon`), `isochroneCoveragePct`, `parkAndRideCount` (10 P+R facilities), POI `PARK_AND_RIDE`. |
| **Mobilność Aktywna (Rowery) w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/mobilnosc-aktywna-rowery-w-krakowie` | • `Stojaki_ZTP_wyświetlenie_-4734912810955325178.csv` (`EPSG:2178`)<br>• `Ciagi_rowerowe_9177750137795237423.csv` | `bikeRacksCount` (12,478 racks across 3,161 locations via `point-in-polygon`), `bikeLanesLengthKm`. |

---

### D. Urban Greenery & School Sports Infrastructure (`greeneryAndSport` & POIs)

| Dataset Title on Portal | Verified Portal URL | Raw CSV File(s) in `src/analytics/data_raw/` | Indicators Computed |
| :--- | :--- | :--- | :--- |
| **Parki miejskie w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/parki-miejskie-w-krakowie` | • `Parki miejskie w Krakowie.csv` | `cityParksCount` (78 municipal parks with `Dzielnica` and `Powierzchnia_ha`), `totalParksAreaHa`, `greenAreaM2PerCapita`, POI `CITY_PARK`. |
| **Parki kieszonkowe w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/parki-kieszonkowe-w-krakowie` | • `Parki kieszonkowe w Krakowie.csv` | `pocketParksCount` (44 pocket parks with `NR DZIELNICY` and `POW_HA`), `totalParksAreaHa`, POI `POCKET_PARK`. |
| **Infrastruktura sportowa szkół i oświatowych placówek samorządowych (2023/2024)** | `https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-oplacowek-samorzadowych-w-roku-szkolnym-2023-2024` | • `Tereny sportowe w szkołach i placówkach samorządowych w roku 2023-2024 - infrastruktura.csv`<br>• *(Supplementary)* `Pomieszczenia WF w szkołach i placówkach samorządowych w roku 2023-2024.csv` | `schoolSportsFacilitiesCount`, `schoolSwimmingPoolsCount`. |
| **Infrastruktura sportowa szkół i oświatowych placówek niesamorządowych (2023/2024)** | `https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-placowek-niesamorzadowych-w-roku-szkolnym-2023-2024` | • `Tereny sportowe w szkołach i placówkach niesamorządowych w roku 2023-2024 - infrastruktura.csv`<br>• *(Supplementary)* `Pomieszczenia WF w szkołach i placówkach niesamorządowych w roku 2023-2024.csv` | `schoolSportsFacilitiesCount`, `schoolSwimmingPoolsCount`. |

---

### E. Culture, Libraries & Senior Activity Centers (`cultureAndSociety` & POIs)

| Dataset Title on Portal | Verified Portal URL | Raw CSV File(s) in `src/analytics/data_raw/` | Indicators Computed |
| :--- | :--- | :--- | :--- |
| **Działalność miejskich centrów i ośrodków kultury w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/dzialalnosc-miejskich-osrodkow-kultury-w-krakowie` | • `Działalność miejskich centrów i ośrodków kultury w 2025 roku.csv` | `culturalCentersCount` (62 clubs & main seats), `annualCulturalEventsCount` (12,855 events), `municipalSubsidyPerCapitaPln`. |
| **Działalność Biblioteki Kraków** | `https://otwartedane.um.krakow.pl/zbiory-danych/dzialalnosc-biblioteki-krakow` | • `Działalność Biblioteki Kraków od 2021 roku.csv` | Municipal library budget subsidy included in `municipalSubsidyPerCapitaPln`. |
| **Lista bibliotek miejskich (filii) Biblioteki Kraków** | `https://otwartedane.um.krakow.pl/zbiory-danych/lista-bibliotek-miejskich-biblioteki-krakow` | • *(Supplementary)* `Filie Biblioteki Kraków.csv` | `libraryBranchesCount` (57 branches), POI `LIBRARY`. |
| **Centra Aktywności Seniora w Krakowie** | `https://otwartedane.um.krakow.pl/zbiory-danych/centra-aktywnosci-seniora-w-krakowie` | • *(Supplementary)* `Centra Aktywności Seniora w Krakowie.csv` | `seniorActivityCentersCount` (51 centers), POI `SENIOR_CENTER`. |
