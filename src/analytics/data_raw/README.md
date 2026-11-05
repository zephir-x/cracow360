# 📥 Cracow360 — Raw Municipal Data Lake (`src/analytics/data_raw/`)

> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:**  
> 🇬🇧 **English (Current)** | 🇵🇱 **[Polski (README-pl.md)](./README-pl.md)**

![Open Data](https://img.shields.io/badge/Source-Bank_Danych_Krakowa_(BDK)_%26_MSIP-1D4ED8?style=for-the-badge)
![Datasets](https://img.shields.io/badge/Datasets-31_CSV_%2B_2_GeoJSON-059669?style=for-the-badge)
![CRS](https://img.shields.io/badge/CRS-EPSG:4326_|_2178_|_2180_|_3857-7C3AED?style=for-the-badge)

---

## 📌 Architectural Purpose

This directory constitutes the **immutable raw data lake (Landing Zone)** of the **Cracow360** platform. It stores **31 official municipal `.csv` datasets** and **2 spatial `.geojson` collections** acquired from:
- **Bank Danych Krakowa (BDK)** (`badam.krakow.pl` / `dane.krakow.pl`)
- **Biuletyn Informacji Publicznej Miasta Krakowa (BIP MK)**
- **Miejski System Informacji Przestrzennej (MSIP / ZTP / ZZM Kraków)**

> [!IMPORTANT]
> **Strict Data Immutability Rule**  
> Files inside `src/analytics/data_raw/` are treated as **read-only archival inputs**. All encoding normalization, coordinate reprojection (`EPSG:2178` / `EPSG:3857` → `WGS84`), deduplication, and district mapping are performed exclusively in memory by the ETL scripts in [`src/analytics/scripts/`](../scripts/README.md), writing intermediate outputs to [`src/analytics/data_processed/`](../data_processed/README.md).

---

## 🗂️ Complete Raw Dataset Inventory (31 CSV + 2 GeoJSON)

### 1. 👥 Demographics & 3-Year Historical Time Series (6 CSV)
Used by `01_etl_demographics_and_infrastructure.py` and `04_econometric_forecasts.py` to compute single-year age cohorts (`0–3`, `4–6`, `7–14`, `65+`), the **736,035** registered resident baseline (`permanent + temporary`), 3-year population growth rates (`2023` vs `2025`), and damped-trend OLS projections to 2028.

| File Name | Scope / Year | Key Content |
| :--- | :---: | :--- |
| `Mieszkańcy zameldowani na pobyt stały w podziale na wiek, płeć i dzielnice w 2025 roku - stan na 31 XII.csv` | 2025 | Single-year age pyramid (`0` to `100+`) by sex & district (**703,718** permanent residents). |
| `Mieszkańcy zameldowani na pobyt czasowy w podziale na wiek, płeć i dzielnice w 2025 roku - stan na 31 XII.csv` | 2025 | Single-year age pyramid by sex & district (**32,317** temporary residents). |
| `Mieszkańcy zameldowani na pobyt stały w podziale na wiek, płeć i dzielnice w 2024 roku - stan na 31 XII.csv` | 2024 | Historical permanent registration cohort panel (`2024`). |
| `Mieszkańcy zameldowani na pobyt czasowy w podziale na wiek, płeć i dzielnice w 2024 roku - stan na 31 XII.csv` | 2024 | Historical temporary registration cohort panel (`2024`). |
| `Mieszkańcy zameldowani na pobyt stały w podziale na wiek, płeć i dzielnice w 2023 roku - stan na 31 XII.csv` | 2023 | Historical permanent registration baseline (`2023`) for 3-year growth rate & OLS. |
| `Mieszkańcy zameldowani na pobyt czasowy w podziale na wiek, płeć i dzielnice w 2023 roku - stan na 31 XII.csv` | 2023 | Historical temporary registration baseline (`2023`). |
| `Cudzoziemcy zameldowani na pobyt stały wg dzielnic w 2025 roku - stan na 31 XII.csv` | 2025 | Registered foreigners with permanent residency by district. |
| `Cudzoziemcy zameldowani na pobyt czasowy wg dzielnic w 2025 roku - stan na 31 XII.csv` | 2025 | Registered foreigners with temporary residency by district (combined **12,066**). |

---

### 2. 👶 Education & Early Childcare Infrastructure (9 CSV)
Geocoded via the official **GUGiK UUG API** (`EPSG:2180` → `WGS84`) and spatially joined (`shapely` point-in-polygon) to the 18 districts.

| File Name | Facility Type | Key Metrics Extracted |
| :--- | :--- | :--- |
| `Zlobki_Samorzadowe_Krakow.csv` | Municipal Public Nurseries | Address, statutory seat capacity, current enrollment, free vacancies. |
| `Zlobki_Prywatne_Dotowane_Krakow.csv` | Contracted Private Nurseries (100% Municipal Subsidy) | Address, subsidized seats, monthly tuition after subsidy (`0–200 PLN`). |
| `Zlobki_Prywatne_Dotacja_Gminy_Krakow.csv` | Co-Financed Private Nurseries (`3.50 PLN/h` Grant) | Address, capacity, vacancies, commercial parent fee (`MonthlyFeePln`), food rate. |
| `Kluby_Dzieciece_Krakow.csv` | Registered Kids' Clubs (`0–3 yrs`) | Address, capacity, vacancies, monthly tuition fee. |
| `Kluby_Rodzicow_Krakow.csv` | Municipal Parent Clubs | Address, district assignment, community support network. |
| `Przedszkola_Samorzadowe_Krakow.csv` | Public Kindergartens (`4–6 yrs`) | Address, building capacity, oddziały (divisions), enrolled preschoolers. |
| `Przedszkola_Niesamorzadowe_Krakow.csv` | Non-Public Kindergartens (`4–6 yrs`) | Address, seat capacity, enrolled children. |
| `Szkoly_Podstawowe_Samorzadowe_Krakow.csv` | Public Primary Schools (`7–14 yrs`) | Address, total students, total class divisions (`studentsPerClassRatio`). |
| `Szkoly_Podstawowe_Niesamorzadowe_Krakow.csv` | Non-Public Primary Schools (`7–14 yrs`) | Address, total students, total class divisions. |

---

### 3. 🌳 Urban Greenery & Sports Infrastructure (6 CSV)

| File Name | Asset Category | Key Metrics Extracted |
| :--- | :--- | :--- |
| `Parki_Miejskie_Krakow.csv` | Municipal City Parks (ZZM) | Park name, district, surface area (`AreaHa`), recreational amenities. |
| `Parki_Kieszonkowe_Krakow.csv` | Pocket Parks ("Ogrody Krakowian") | Pocket park name, location, surface area (`AreaHa`). |
| `Lasy_Pozostale_Terenu_Zieleni_Krakow.csv` | Municipal Forests & Green Areas | Forest complex name, district, area in hectares (`AreaHa`). |
| `Baza_Sportowa_Szkoly_Samorzadowe_Krakow.csv` | Public School Sports Courts & Fields | Pitches, running tracks, outdoor courts per school. |
| `Baza_Sportowa_Szkoly_Niesamorzadowe_Krakow.csv` | Non-Public School Sports Facilities | Indoor/outdoor sports infrastructure. |
| `Sale_Gimnastyczne_Plywalnie_Krakow.csv` | Gymnasiums & Swimming Pools | Full-size sports halls, gym rooms, and school swimming pools (`swimmingPoolsCount`). |

---

### 4. 🚊 Mobility, Public Transit & Cycling Network (3 CSV + 1 GeoJSON)

| File Name | Coordinate System | Key Metrics Extracted |
| :--- | :---: | :--- |
| `Przystanki_KMK_Krakow.csv` | `EPSG:3857` (Web Mercator) | Bus/tram stops, platform length, **Kassel kerbs** (`Krawężnik peronowy`), **tactile paving** (`Płytki z wypustkami`). |
| `Stojaki_Rowerowe_Krakow.csv` | `EPSG:2178` (PUWG 2000 z. 7) | Municipal ZTP bike racks, capacity, rack type (U-shaped). |
| `Parkingi_Park_and_Ride_Krakow.csv` | Address + Override | Park & Ride hubs, total parking stalls (`SpotsCount`), EV chargers, bike lockers. |
| `Drogi_Rowerowe_Krakow.geojson` | `EPSG:4326` (`WGS84`) | 3D/2D vector line network of Krakow cycling paths (`cyclingPathsLengthKm` clipped per district). |

---

### 5. 🎭 Culture, Libraries & Senior Activity Centers (3 CSV)

| File Name | Institution Type | Key Metrics Extracted |
| :--- | :--- | :--- |
| `Działalność miejskich centrów i ośrodków kultury w 2025 roku.csv` | Municipal Cultural Centers & Branch Networks | Events, participants, and municipal subsidies mapped via `CULTURAL_NETWORK_SHARES` across all **56 branches/clubs** in all 18 districts (`culturalCentersCount >= 1`). |
| `Biblioteka_Krakow_Filie_2025.csv` | Biblioteka Kraków Public Branches | Geocoded library branches, book collection (`libraryBookCollection`), registered readers (`libraryReadersCount`). |
| `Centra_Aktywnosci_Seniorow_Krakow.csv` | Senior Activity Centers (CAS) | 53 geocoded CAS clubs, active senior members (`casMembersCount`), average workshop attendance. |

---

### 6. ♿ Architectural Accessibility & PRM Infrastructure (2 CSV)

| File Name | Scope | Key Metrics Extracted |
| :--- | :--- | :--- |
| `Miejsca_Postojowe_Niepelnosprawni_Krakow.csv` | PRM Disabled Parking Network | **862 geocoded locations** providing **1,709 dedicated PRM parking stalls** (`Liczba miejsc`). |
| `Audyt_Dostepnosci_Budynkow_Krakow.csv` | Public Facility Barrier Audit | **25 audited public facilities** rated (`0–10`) across architectural, visual/contrast, and hearing/induction-loop accessibility. |

---

### 7. 🛡️ Public Safety, Housing Market, Fiscal B2B & Geospatial Reference (5 CSV + 1 GeoJSON)

| File Name | Domain | Key Metrics Extracted |
| :--- | :--- | :--- |
| `Bezpieczenstwo_Ruch_Drogowy_i_Ankiety_Krakow_2024_2025.csv` | Public Safety (`2024–2025`) | Traffic accidents, collisions, injured vulnerable road users, resident safety survey (`%`), street lighting & crosswalk ratings (`%`). |
| `Rynek_Mieszkaniowy_Ceny_i_Dostepnosc_Krakow_2025_2026.csv` | Housing Market (`2025–2026`) | Primary & secondary market prices (`PLN/m²`), 2-room median rent (`PLN`), YoY price growth (`%`), new apartments completed, salary affordability (`m²`). |
| `Podatki_Lokalne_CIT_PIT_Nieruchomosci_Krakow_2025.csv` | Fiscal & B2B Potential (`2025`) | CIT corporate taxpayers, municipal share of CIT & PIT revenues (`PLN`), property tax revenues (`PLN`). |
| `Dzielnice_Krakowa.csv` | Administrative Reference | Official Roman numerals (`I`–`XVIII`), names, area (`km²`), and centroid coordinates. |
| `Korekty_Geoprzestrzenne_POI.csv` | Geospatial Precision Patch | Verified manual coordinate overrides for **152 streetless green areas, parks, forests, and P+R lots**. |
| `krakow_districts.geojson` | Spatial Polygons (`WGS84`) | Official vector boundaries of all 18 districts of Krakow (`Polygon` / `MultiPolygon`). |
