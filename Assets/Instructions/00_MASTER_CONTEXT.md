# MASTER CONTEXT & HANDOFF DOCUMENT – KRAKÓW360

> **PURPOSE OF THIS FILE:**
> Read this file first when starting a new session. It contains the complete business, competition, architectural, and technical context of the **Kraków360** project, every engineering decision made so far, a complete map of existing files, and the exact roadmap for upcoming modules (**Module 2: Parent Mode** and **Module 3: Official & Investor Mode**).

---

## 1. Project Identity & Competition Context

- **Project Name:** Kraków360 – System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego (*Quality of Life Analysis, Service Accessibility, and Urban Development Prediction System*).
- **Competition:** *"Open Data App"* organized by the Municipality of Krakow (*Gmina Miejska Kraków*, Centrum Obsługi Informatycznej, Referat ds. Smart City i analizy danych, ul. Basztowa 20) in partnership with AGH University of Krakow and Cracow University of Technology (*Politechnika Krakowska*).
- **Strategic Alignment:** Directly supports the *"Strategy for the Development of Krakow: Tu chcę żyć 2030"* (Smart City, 15-minute accessible city, sustainable mobility, equitable access to childcare, greenery, and senior infrastructure across all 18 administrative districts).
- **Critical Deadlines:**
  1. **Physical Registration Form (Annex 1 / *Załącznik nr 1*):** Must be delivered in paper form to ul. Basztowa 20 (8:00 AM – 2:30 PM) by **Friday, October 23, 2026** (official Sunday deadline is Oct 25, 2026).
  2. **Stage I Electronic Submission:** By **November 5, 2026** to `konkursopendata@um.krakow.pl` (Must include: Title, max 2-page PDF business/project summary, working demo app, startup instructions, and technical documentation covering tech stack, datasets, architecture, and future roadmap).
  3. **Stage II Finals (Top 10 teams):** By **November 31, 2026** (5-minute live pitch + 5-minute Q&A; final score = 70% Stage I + 30% Stage II).
- **Evaluation Criteria & Weights (Stage I):**
  - Impact on City & Residents: **30%**
  - Data Usage (correlations, multi-directionality across >15 datasets): **20%**
  - Innovation (econometric predictions + real-time *What-If* simulator): **15%**
  - Technical Architecture (stability, scalability, tech stack): **15%**
  - Business Potential (B2G for City Hall / B2B for private investors): **10%**
  - UX (5%) + UI (5%): **10%**

---

## 2. Team Structure & Strict Workspace Isolation

1. **Kacper (Team Leader & Fullstack Software Engineer):**
   - Owns the entire software engineering architecture, `.NET 9` backend (`src/backend/`), `React + TypeScript` frontend (`src/frontend/`), `Docker Compose` (`docker-compose.yml`), database (`data/db/`), and final VPS deployment (Mikrus + NGINX + Cloudflare).
2. **Economics Colleague (Data Analyst / Econometrician – Python):**
   - Less experienced in software engineering; therefore **strictly isolated** inside `src/analytics/`.
   - Works standalone in Python (no `.NET`, `Node.js`, or `Docker` required on his machine).
   - Downloads raw municipal datasets (CSV, XLSX, GeoJSON) into `src/analytics/data_raw/` (git-ignored), runs ETL & normalization scripts (`01` to `03`), validates output via `04_validate_and_export_contracts.py`, and writes clean JSON files to `data/contracts/`.
   - **Never touches `src/backend/` or `src/frontend/`.**

---

## 3. Coding Conventions & Non-Negotiable Engineering Rules

1. **Language Policy:**
   - **Polish:** Root `README.md` and end-user UI strings visible in the browser (labels, tooltips, district names, recommendations).
   - **English:** **Everything else** — all source code identifiers, code comments (`.cs`, `.ts`, `.tsx`, `.py`, `.yml`), commit messages, and all documentation/instructions inside `Assets/Instructions/`.
2. **File Encoding:**
   - **Always save JSON, GeoJSON, TypeScript, CSS, HTML, Python, and Markdown files as UTF-8 WITHOUT BOM.** (PostCSS/Vite fails if `package.json` or `.css` files contain a UTF-8 BOM `\xEF\xBB\xBF`).
3. **Architecture Principles:**
   - **Backend (`src/backend/`):** Clean Architecture (`Domain` -> `Application` -> `Infrastructure` -> `Api`), SOLID, OOP, Minimal API endpoint groups, EF Core 9 + Dapper + `IMemoryCache`.
   - **Frontend (`src/frontend/`):** Feature-sliced modular architecture (`src/features/resident-mode`, `src/features/parent-mode`, `src/features/investor-mode`), strict TypeScript, TailwindCSS v4 (`@tailwindcss/vite`), React-Leaflet v5, Recharts.
4. **SQLite + Docker Compatibility on Windows:**
   - EF Core defaults to `WAL` journal mode, which creates `-shm` shared-memory files incompatible with Linux Docker containers (`sqlite-web`) mounted over Windows/WSL2.
   - `DatabaseSeeder.cs` explicitly executes `PRAGMA journal_mode=DELETE;` on startup so both the Windows `.NET 9` host process and the Docker `sqlite-web` container (`http://localhost:8080`) can read `data/db/cracow360.db` simultaneously without `disk I/O error`.
5. **Map Tile Layer Rule (No Paid API Keys):**
   - Always use the official, 100% free, key-less **OpenStreetMap Foundation** tile server (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) paired with the `.krakow-dark-tiles` CSS filter in `src/frontend/src/index.css` (and the UI Dark/Light toggle button). Never use Carto/Stadia tile URLs that display `API KEY REQUIRED` watermarks.

---

## 4. End-to-End Data Flow Philosophy (Why Python Is Offline & Sliders Are Real-Time)

- **Python does NOT execute on user HTTP requests.** Running Pandas/GeoPandas/Scikit-learn on raw Excel/CSV files on every slider movement would cause multi-second delays, race conditions on disk files, and CPU exhaustion on the VPS.
- Instead, the architecture is split into two phases:
  1. **Phase A – Offline ETL & Scoring (`src/analytics/` -> `data/contracts/*.json` -> `SQLite`):**
     - Python cleans raw data from `otwartedane.um.krakow.pl` and `msip.krakow.pl`, computes the **5 objective base category scores (`0.0–100.0` via Min-Max normalization)** for each of the 18 districts, computes the 2027–2030 econometric forecasts, and exports `krakow_districts_master.json` and `krakow_poi_locations.json`.
     - On `.NET 9` startup, `DatabaseSeeder` automatically creates `data/db/cracow360.db`, checks whether the number of districts/POIs in the JSON contracts changed, synchronizes the `Districts` and `PointsOfInterest` tables, and invalidates `IMemoryCache`.
  2. **Phase B – Real-Time Serving & Zero-Latency UI (`SQLite` -> `.NET 9 API` -> `React`):**
     - `.NET 9 Minimal API` loads districts from SQLite and caches them in `IMemoryCache` (`< 2 ms` response time).
     - React fetches the 18 districts and their GeoJSON boundaries once. When the user moves any of the 5 preference sliders (`0–10` weight) or clicks a persona preset (*Student, Single/Young Pro, Family 2+1, Active Senior*), React recalculates the weighted Quality of Life Index **instantly on the client side (`0 ms` network latency)** using `calculateClientSideQualityIndex`, re-sorting the 18-district ranking list and re-coloring the GeoJSON choropleth map in real time.

---

## 5. Complete Map of Currently Implemented Files (Stage 1 & Module 1 Completed)

### Root & Documentation
- `.gitignore` – Excludes `bin/`, `obj/`, `node_modules/`, `.venv/`, `data/db/*.db*`, `src/analytics/data_raw/*` (keeps `.gitkeep`), `Assets/Documents/`.
- `.env.Example` – Uppercase env template (`ASPNETCORE_ENVIRONMENT`, `CONNECTIONSTRINGS__DEFAULTCONNECTION`, `VITE_API_BASE_URL`).
- `docker-compose.yml` – Runs `sqlite-db` (`coleifer/sqlite-web` on port `8080` mounted to `./data/db`). Includes commented production containers (`backend-api`, `frontend-nginx`) for Stage 4.
- `README.md` – Polish project overview, quick-start commands, and documentation links.
- `Assets/Instructions/`:
  - `00_MASTER_CONTEXT.md` – Master AI context and handoff document (this file).
  - `01_COMPETITION_ANALYSIS_AND_ACTION_PLAN.md` – Competition timeline, evaluation criteria, and project action plan.
  - `02_ARCHITECTURE_PROJECT_STATE_AND_DEVELOPMENT.md` – Full technical architecture and development guide.
  - `03_PYTHON_ANALYTICS_DEVELOPER_GUIDE.md` – Standalone onboarding and workflow guide for the Python analyst.
  - `04_OPEN_DATA_SOURCES_REGISTRY.md` – Official provenance registry documenting all public datasets (`otwartedane.um.krakow.pl`, `msip.krakow.pl`, `bdk.um.krakow.pl`, OpenStreetMap/Nominatim, GIOŚ REST API).

### Data Contracts (`data/contracts/`)
- `data/contracts/krakow_districts.geojson` – **Real vector boundaries (`Polygon`/`MultiPolygon`, WGS84)** of all **18 administrative districts of Krakow** (`districtId` 1..18) fetched from OpenStreetMap/Nominatim (`admin_level=9`).
- `data/contracts/krakow_districts_master.json` – Complete dataset for all **18 Krakow districts** (*Dzielnica I Stare Miasto* through *Dzielnica XVIII Nowa Huta*) with all 7 nested sections (`scores`, `demographics`, `educationAndCare`, `mobilityAndTransport`, `greeneryAndSport`, `cultureAndSociety`, `forecastsAndB2B`), validated (`[OK] 18 districts verified`) by `04_validate_and_export_contracts.py`.
- `data/contracts/krakow_poi_locations.json` – Seed contract containing sample POIs (`nursery_pub_1`, `park_pocket_4`, `library_1`), ready to be expanded to all Krakow POIs in Module 2.

### Backend – C# .NET 9 (`src/backend/Cracow360.sln`)
1. **`Cracow360.Domain`:**
   - `Enums/DomainEnums.cs` – `PotentialLevel` (`LOW`, `MEDIUM`, `HIGH`), `PoiCategory`, `PoiSubCategory` (14 allowed POI types).
   - `Entities/District.cs` – Aggregate root `District` + owned value objects (`DistrictScores`, `DistrictDemographics`, `DistrictEducationAndCare`, `DistrictMobilityAndTransport`, `DistrictGreeneryAndSport`, `DistrictCultureAndSociety`, `DistrictForecastsAndB2B`) + domain method `CalculateWeightedQualityOfLifeIndex(...)`.
   - `Entities/PointOfInterest.cs` – `PointOfInterest` entity + `PoiMetrics`.
   - `Entities/AirQualityStationReading.cs` – Entity for GIOŚ station readings (`Pm10`, `Pm25`, `CaqiIndexLevel`).
   - `Interfaces/IRepositories.cs` – `IDistrictRepository`, `IPointOfInterestRepository`.
2. **`Cracow360.Application`:**
   - `DTOs/ContractDtos.cs` – `SystemHelloDto`, `DistrictSummaryDto`, `DistrictDetailsDto` (and nested section DTOs), `DistrictComparisonDto`, `DistrictScoreDeltasDto`, `PointOfInterestDto`.
   - `Interfaces/IServices.cs` – `IDistrictService` (`GetAllSummariesAsync`, `GetDistrictDetailsAsync`, `CompareDistrictsAsync`), `IPointOfInterestService`.
   - `Services/ApplicationServices.cs` – `DistrictService` (maps entities to DTOs, computes weighted index, sorts descending, computes side-by-side comparison deltas) and `PointOfInterestService`.
3. **`Cracow360.Infrastructure`:**
   - `Persistence/Cracow360DbContext.cs` – EF Core 9 `DbContext` using `OwnsOne` for single-table flattening of `District` sections.
   - `Persistence/Repositories/Repositories.cs` – `DistrictRepository` (with 10-minute `IMemoryCache` on `GetAllAsync`) and `PointOfInterestRepository`.
   - `Persistence/Seeding/DatabaseSeeder.cs` – Idempotent startup synchronization between `data/contracts/*.json` and SQLite (`PRAGMA journal_mode=DELETE;` + automatic re-sync and `IMemoryCache` invalidation whenever district/POI counts change).
   - `ExternalServices/GiosAirQualityBackgroundService.cs` – `BackgroundService` skeleton with 30-minute `PeriodicTimer`.
   - `DependencyInjection.cs` – Registers SQLite `DbContext`, `IMemoryCache`, `HttpClient`, repositories, services, seeder, and background worker.
4. **`Cracow360.Api`:**
   - `Endpoints/SystemEndpoints.cs` – `GET /api/system/hello`.
   - `Endpoints/DistrictEndpoints.cs` –
     - `GET /api/districts` (all 18 districts with weighted index),
     - `GET /api/districts/geojson` (serves `krakow_districts.geojson` with `application/geo+json`),
     - `GET /api/districts/compare?firstId={id1}&secondId={id2}` (side-by-side comparison with deltas),
     - `GET /api/districts/{id:int}` (full details of a single district).
   - `Endpoints/PoiEndpoints.cs` – `GET /api/pois` (with `districtId`, `category`, `subCategory` filters).

### Frontend – React 19 + TypeScript + Vite 6 + TailwindCSS 4 (`src/frontend/`)
- `src/index.css` – TailwindCSS v4 + Leaflet CSS + `.krakow-dark-tiles` filter for dark Smart City map styling.
- `src/types/contracts.ts` – Complete TypeScript DTOs matching `.NET 9` API (`DistrictSummaryDto`, `DistrictDetailsDto`, `DistrictComparisonDto`, GeoJSON types, `QualityWeights`, `ResidentPreset`).
- `src/api/client.ts` – `cracow360Api` (`getSystemHello`, `getDistricts`, `getDistrictDetails`, `compareDistricts`, `getDistrictsGeoJson`).
- `src/utils/qualityIndexCalculator.ts` – Client-side zero-latency calculator (`calculateClientSideQualityIndex`) and `RESIDENT_PRESETS` (*Student*, *Singiel / Młody Profesjonalista*, *Rodzina 2+1*, *Aktywny Senior*).
- `src/features/resident-mode/` (**Module 1 – 100% Complete**):
  - `components/KrakowChoroplethMap.tsx` – Interactive `React-Leaflet` GeoJSON map of 18 districts with dynamic choropleth coloring (`#f97316` -> `#10b981`), hover HUD card, click selection for `#1` and `#2`, and Dark/Light map tile toggle.
  - `components/WeightsConfiguratorPanel.tsx` – 4 persona preset buttons + 5 interactive category weight sliders (`0–10 pts`) + Reset button.
  - `components/DistrictRankingList.tsx` – Live-sorted ranking list (`#1` to `#18`) with progress bars and 1-click comparison selection.
  - `components/DistrictComparisonView.tsx` – Side-by-side comparison panel featuring a 5-axis `Recharts RadarChart`, Smart City recommendation cards, and a 12-row hard-metrics table highlighting the winning district in each metric.
- `src/App.tsx` – Main dashboard integrating the 3-column Resident Mode workspace (Sliders + Map + Live Ranking), the Side-by-Side Comparison View below, and the system/data telemetry footer.

### Python Analytics Workspace (`src/analytics/`)
- `scripts/config.py`, `01_etl_demographics_and_infrastructure.py`, `02_calculate_quality_scores.py`, `03_econometric_forecasts.py`, `04_validate_and_export_contracts.py` – Documented with full English engineering docstrings, exact mathematical formulas, and input/output contract rules.

---

## 6. Project Roadmap: What Is Done vs. What Remains

### Completed Stages:
- [x] **Stage 1:** Fullstack `.NET 9` + `React 19` + `SQLite` + `Docker` + isolated `Python` environment setup.
- [x] **Module 1 (Tryb Mieszkańca – Indeks Jakości Życia / Poziom Makro: Porównanie 18 Dzielnic):**
  - [x] Step 1: Real GeoJSON boundaries & 18-district data contract + `.NET` endpoints (`/geojson`, `/compare`).
  - [x] Step 2: Interactive `React-Leaflet` Choropleth Map (`KrakowChoroplethMap.tsx`).
  - [x] Step 3: 5 Weight Sliders (`0–10`), 4 Persona Presets & Live 18-District Ranking (`WeightsConfiguratorPanel.tsx`, `DistrictRankingList.tsx`).
  - [x] Step 4: Side-by-Side Comparison View + `Recharts RadarChart` + 12 Hard Metrics Table (`DistrictComparisonView.tsx`).

### Upcoming Stages (Next Implementation Targets):
- [ ] **Module 2 (Tryb Rodzica i Mieszkańca Lokalnego – Mapa Dostępności Mikrolokalnej i Izochron):**
  - Expand `data/contracts/krakow_poi_locations.json` with real geolocated POIs across Krakow (nurseries, kindergartens, primary schools, KMK stops, parks, libraries, CAS).
  - Add top-level mode switcher tabs in `App.tsx` (*Moduł 1: Jakość Życia (Dzielnice)* | *Moduł 2: Mapa Dostępności Lokalnej (POI & Izochrony)* | *Moduł 3: Symulator Inwestycyjny i Predykcje 2028*).
  - Implement address/point click on the map generating walking radius rings (`300m / 5 min`, `500m / 8 min`, `1000m / 15 min` – *15-Minute City* analysis), counting POIs inside the radius, and displaying the local accessibility score.
- [ ] **Module 3 (Tryb Urzędnika i Inwestora B2G/B2B – Predykcje Demograficzne 2028 i Symulator „Co-Jeśli”):**
  - Implement demographic trend charts (historical vs. 2028 forecast for ages `0–3`, `4–6`, `65+`).
  - Implement the interactive **"What-If" Investment Simulator**: clicking on a district with a deficit (e.g., *Prądnik Biały* or *Podgórze*) and simulating *"Add a new municipal nursery with 120 places"* or *"Add a 2.5 ha pocket park"*, recalculating the district's `childrenPerCarePlaceRatio`, `educationScore`, and 2028 deficit balance live!
- [ ] **Stage 4 (Production Polish, Live GIOŚ Air Quality Integration & Deployment):**
  - Activate live GIOŚ air quality station indicators on the map + NGINX/Docker production compose + final 2-page PDF competition summary (`konkursopendata@um.krakow.pl`).
