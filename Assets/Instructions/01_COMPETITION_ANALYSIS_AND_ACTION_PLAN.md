# "Open Data App" Competition Analysis & Action Plan (Initial Stages + Module 1)

## 1. Competition Rules Analysis (`regulamin.pdf`) – Key Requirements & Scoring Strategy

### 1.1. Organizer, Partners & Participants
- **Organizer:** Municipality of Krakow (*Gmina Miejska Kraków*) – IT Services Center, Smart City and Data Analysis Unit (ul. Basztowa 20, 31-156 Kraków).
- **Partners (represented in the Jury):** AGH University of Krakow & Cracow University of Technology (*Politechnika Krakowska*).
- **Team:** 2–5 members (Kacper – Team Leader & Fullstack Architect; Economics Colleague – Data Science / Econometrics).
- **Intellectual Property & Confidentiality (§ 7 & § 8):** Application source code and technical documentation **remain the exclusive property of the Participants** and are protected by confidentiality (the license granted to the City covers only demo testing/presentation and competition promotion).
- **Prizes (§ 6):** 1st Place: **10,000 PLN gross**, 2 Distinctions of **5,000 PLN gross** each (split equally among team members, subject to a 10% flat-rate tax).

### 1.2. Critical Deadlines & Formal Requirements (WARNING – Disqualification Risk!)
1. **Registration Form (Annex 1 / *Załącznik nr 1*) – PHYSICAL SUBMISSION (§ 3 sec. 5 & 8):**
   - The rules require physical delivery of the signed registration form and declarations to the Organizer's office at **ul. Basztowa 20, 31-156 Kraków (Mon–Fri, 8:00 AM – 2:30 PM)** marked *"Konkurs Open Data App"*.
   - **Official deadline in rules:** October 25, 2026 (Sunday) -> **in practice, the last working day of the office is Friday, October 23, 2026, by 2:30 PM!**
2. **Project Submission – Stage I (§ 5 sec. 1 & 2):**
   - **Deadline:** no later than **November 5, 2026** via email to: `konkursopendata@um.krakow.pl`.
   - **Mandatory submission package items (missing any item = rejection):**
     1. Project title (*Kraków360 – System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego*).
     2. Project description and objective (**maximum 2 pages in PDF format**).
     3. Solution demo – working application (hosted online + runnable locally).
     4. Startup instructions.
     5. Technical documentation containing: (a) technologies used, (b) datasets used, (c) architecture description, (d) future development possibilities.
3. **Finals – Stage II (§ 4 sec. 9):**
   - Up to 10 teams qualify (announced within 2 weeks after Nov 5).
   - Final live presentation by November 31, 2026: **5-minute pitch + 5-minute Q&A** with the Jury.
   - Final score weighting: **70% Stage I score + 30% Stage II presentation & business dialogue**.

### 1.3. Scoring Criteria Maximization Strategy (0–10 pts scale with weights)
| Criterion | Weight | Our Implementation in Kraków360 |
| :--- | :---: | :--- |
| **a) Impact on the City & Residents** | **30%** | Direct alignment with the *"Tu chcę żyć 2030"* Strategy: 3 dedicated personas (Resident, Parent, Official/Investor), detection of infrastructure "white spots". |
| **b) Data Usage (correlations, multi-directionality)** | **20%** | Cross-correlation of >15 municipal datasets (`otwartedane.um.krakow.pl`, `msip.krakow.pl`: demographics, education, greenery, KMK transit, culture) with external live data (GIOŚ Air Quality API). |
| **c) Solution Innovation** | **15%** | Econometric predictive models (2027–2030) in Python + interactive real-time *What-If ("Place an Investment")* simulator. |
| **d) Technical Architecture** | **15%** | Clean Architecture in .NET 9 Minimal API, strict decoupling of heavy offline ETL/Data Science (Python) from high-speed serving (SQLite + IMemoryCache) and reactive UI (React 19 + TS). |
| **e) Business Potential (B2G / B2B)** | **10%** | Ready-to-use B2B Investment Potential Index (where to open a private nursery/service point) and B2G municipal budget allocation recommendations. |
| **f) UX (intuitiveness, accessibility)** | **5%** | *Unified Map & Dashboard* layout, 1-click persona presets (*Student, Single/Young Pro, Family 2+1, Active Senior*), 0 ms client-side slider recalculation. |
| **g) UI (visual aesthetics, consistency)** | **5%** | Modern dashboard in TailwindCSS, interactive React-Leaflet choropleth mapping, and Recharts radar/timeline visualizations. |

---

## 2. Detailed Action Plan for the First Stages

### Stage 1: Formalities, Environment Setup & Workspace Isolation (COMPLETED – Oct 19)
1. **Engineering Foundation (Kacper):**
   - `.NET 9` solution structured according to Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`) with automatic SQLite creation and seeding from JSON contracts.
   - `React + TypeScript + Vite + TailwindCSS` frontend with all target libraries (`react-leaflet`, `recharts`, `lucide-react`, `axios`) connected live to the backend (`/api/system/hello` and `/api/districts`).
   - `docker-compose.yml` providing the SQLite volume and a browser-based database inspection panel (`sqlite-web` on port `8080`).
   - Strictly isolated `src/analytics/` workspace with its own `.venv`, contract validator script (`04_validate_and_export_contracts.py`), and `.gitignore` rules protecting the Fullstack codebase.
2. **Organizational Tasks & Raw Data Extraction (Oct 19 – Oct 23):**
   - [ ] **Kacper + Colleague:** Complete and physically submit Annex 1 (Registration Form) at ul. Basztowa 20 (by Friday, Oct 23, 2:30 PM).
   - [ ] **Colleague (Python):** Download raw CSV/XLSX datasets from `otwartedane.um.krakow.pl` and the 18 districts boundary file (`krakow_districts.geojson`) from `msip.krakow.pl` into `src/analytics/data_raw/`.

---

### Stage 2: Implementation of Module 1 – "Resident Mode: Quality of Life Index (Macro Level: District Comparison)"

This is the flagship module of the platform and will be built as our first complete Vertical Slice.

#### Step 2.1. GeoJSON Contract & Full 18 Districts Baseline Data
- Add the administrative boundaries of all 18 Krakow districts (`data/contracts/krakow_districts.geojson`) and expose them via API/static caching.
- Populate `data/contracts/krakow_districts_master.json` with all 18 districts (so Fullstack development of the map and ranking can proceed immediately, and the Economics colleague can overwrite the JSON contract whenever his econometric scripts are updated).

#### Step 2.2. Backend (.NET 9 Minimal API) for Module 1
- Extend `DistrictEndpoints`:
  - `GET /api/districts` – returns all 18 districts with their 5 normalized category scores (`mobilityScore`, `educationScore`, `greeneryScore`, `cultureAndSeniorScore`, `environmentScore`) and key demographic metrics.
  - `GET /api/districts/{id:int}` – returns the complete district profile.
  - `GET /api/districts/compare?firstId={id1}&secondId={id2}` – dedicated comparison endpoint returning *Side-by-Side* metrics and score deltas for two selected districts.

#### Step 2.3. Frontend (React + TypeScript) – Module 1 Architecture (`src/frontend/src/features/resident-mode/`)
Following the Single Responsibility Principle (SRP), Module 1 is divided into focused components:
1. **`UnifiedMapLayout.tsx` (`src/components/layout/`):**
   - Main application shell: top mode switcher (*Resident Mode*, *Parent Mode*, *Official/Investor Mode*), central interactive map canvas, and responsive side panel.
2. **`KrakowChoroplethMap.tsx` (`src/features/resident-mode/components/`):**
   - `React-Leaflet` component rendering the `GeoJSON` vector layer of Krakow's 18 districts.
   - Real-time choropleth coloring based on the weighted Quality of Life Index calculated from the user's current slider weights.
   - Interactive hover tooltips and click handlers for selecting a primary district or a second district for *Side-by-Side* comparison.
3. **`WeightsConfiguratorPanel.tsx` (`src/features/resident-mode/components/`):**
   - 5 interactive sliders (`0–10 pts` scale):
     1. *Mobility (KMK & Bike)*
     2. *Education & Care*
     3. *Greenery & Recreation*
     4. *Culture & Community*
     5. *Environment & Quietness*
   - Moving any slider triggers instant (`0 ms`) client-side recalculation via `calculateClientSideQualityIndex`, re-sorting all 18 districts and updating map polygon colors immediately without network round-trips.
4. **`PresetProfilesBar.tsx` (`src/features/resident-mode/components/`):**
   - 1-click preset buttons:
     - **Student** (`Mobility: 10, Culture: 9, Greenery: 6, Environment: 5, Education: 1`)
     - **Single / Young Professional** (`Mobility: 9, Greenery: 8, Culture: 8, Environment: 6, Education: 2`)
     - **Family 2+1** (`Education: 10, Greenery: 9, Environment: 9, Mobility: 6, Culture: 5`)
     - **Active Senior** (`Culture & CAS: 10, Environment: 9, Mobility: 8, Greenery: 8, Education: 1`)
5. **`DistrictRankingList.tsx` (`src/features/resident-mode/components/`):**
   - Live-sorted ranking of all 18 districts with score progress bars (`0–100 pts`) and rank badges (`#1`, `#2`, `#3`...).
6. **`DistrictComparisonView.tsx` (`src/features/resident-mode/components/`):**
   - *Side-by-Side* comparison drawer/modal for any two clicked districts:
     - **`Recharts RadarChart`** overlaying the 5 category scores of both districts.
     - Metric-by-metric comparison table (population, KMK stops, green area m² per capita, nursery places, library branches & Senior Activity Centers) highlighting the winner in each metric.
