# Architecture, Project State & Development Guide

## 1. Current Project State (Stage 1 – End-to-End Development Environment Ready)

The **Kraków360** development environment is fully configured, cleaned of default template boilerplate, and verified for both `.NET 9` and `TypeScript/Vite` builds.

### Completed Foundation:
1. **Backend (`.NET 9 Minimal API` + `EF Core 9` + `SQLite` + `Dapper` + `IMemoryCache`):**
   - Structured according to **Clean Architecture**, **SOLID**, and **OOP** principles.
   - Automatic SQLite database creation (`data/db/cracow360.db`) and automatic seeding (`DatabaseSeeder`) from the JSON contract files (`data/contracts/krakow_districts_master.json` and `data/contracts/krakow_poi_locations.json`) on startup.
   - Configured Swagger UI (`/swagger`), CORS policy for the Vite dev server (`http://localhost:5173`), and the `GiosAirQualityBackgroundService` worker skeleton.
2. **Frontend (`React 19` + `TypeScript` + `Vite 6` + `TailwindCSS 4`):**
   - Installed packages: `leaflet`, `react-leaflet`, `recharts`, `lucide-react`, `axios`, `clsx`, `tailwind-merge`.
   - Configured `/api -> http://localhost:5000` proxy in `vite.config.ts`.
   - Working **Hello World & System Status Dashboard** querying `/api/system/hello` and `/api/districts` live from the SQLite database.
3. **Docker Compose (`docker-compose.yml`):**
   - Runs `cracow360-sqlite-db` (`coleifer/sqlite-web`) during development, providing a web UI for browsing and querying `data/db/cracow360.db` at `http://localhost:8080`.
   - Includes commented production service definitions (`backend-api`, `frontend-nginx`) ready for Stage 4 deployment (Mikrus VPS + Cloudflare).
4. **Isolated Data Science Workspace (`src/analytics/`):**
   - Dedicated directory for the Economics/Python developer with its own `.venv`, pre-installed libraries (`pandas`, `geopandas`, `scikit-learn`, `statsmodels`, `numpy`, `geopy`, `matplotlib`, `seaborn`, `jsonschema`), and a JSON contract validator script.

---

## 2. Directory Layout & Architectural Separation

```text
cracow360/
├── .gitignore                          # Excludes binaries, .venv, raw datasets, and .db files
├── .env.Example                        # Example environment variable configuration
├── docker-compose.yml                  # SQLite volume container + SQLite Web UI (port 8080)
├── Assets/
│   ├── Documents/                      # regulamin.pdf, dokumentacja.pdf (git-ignored)
│   └── Instructions/                   # Developer documentation, plans, and guides (in English)
│       ├── 01_COMPETITION_ANALYSIS_AND_ACTION_PLAN.md
│       ├── 02_ARCHITECTURE_PROJECT_STATE_AND_DEVELOPMENT.md
│       └── 03_PYTHON_ANALYTICS_DEVELOPER_GUIDE.md
├── data/
│   ├── contracts/                      # DATA CONTRACT (Python ETL Output -> .NET Seeder Input)
│   │   ├── krakow_districts_master.json
│   │   └── krakow_poi_locations.json
│   └── db/                             # SQLite database file (cracow360.db - auto-generated)
└── src/
    ├── backend/                        # C# .NET 9 Solution (Clean Architecture)
    │   ├── Cracow360.sln
    │   ├── Cracow360.Domain/           # Domain entities, Quality of Life calculation logic, Enums, Repository interfaces
    │   ├── Cracow360.Application/      # DTOs, Service interfaces, Application Services (Use Cases)
    │   ├── Cracow360.Infrastructure/   # EF Core DbContext (SQLite), Repositories + Cache, DatabaseSeeder, GIOS Worker
    │   └── Cracow360.Api/              # Minimal API, Endpoint Groups (System, Districts, Pois), DI, Swagger, CORS
    ├── frontend/                       # React 19 + TypeScript + Vite + TailwindCSS Client
    │   ├── src/
    │   │   ├── api/                    # Axios client and typed REST API calls
    │   │   ├── components/             # Shared UI and layout components
    │   │   ├── features/               # Modular feature slices:
    │   │   │   ├── resident-mode/      # Module 1: Quality of Life Index (Macro Level)
    │   │   │   ├── parent-mode/        # Module 2: Education & Care Compass (Micro Level)
    │   │   │   └── investor-mode/      # Module 3: Development & Investment Simulator (B2G / B2B)
    │   │   ├── types/                  # TypeScript interfaces matching the API DTO contract
    │   │   └── utils/                  # Client-side Quality of Life calculator and weight presets
    │   ├── package.json
    │   └── vite.config.ts
    └── analytics/                      # ISOLATED PYTHON WORKSPACE FOR DATA SCIENCE & ECONOMETRICS
        ├── .venv/                      # Local Python virtual environment (git-ignored)
        ├── data_raw/                   # Raw CSV/XLSX/GeoJSON files from municipal portals (git-ignored)
        ├── data_processed/             # Intermediate cleaned tables (git-ignored)
        ├── notebooks/                  # Jupyter notebooks for econometric exploration
        ├── charts/                     # Static plots generated for the 2-page PDF competition report
        ├── scripts/                    # Production ETL, econometric modeling, and contract validation scripts
        │   ├── config.py
        │   ├── 01_etl_demographics_and_infrastructure.py
        │   ├── 02_calculate_quality_scores.py
        │   ├── 03_econometric_forecasts.py
        │   └── 04_validate_and_export_contracts.py
        ├── requirements.txt
        └── README.md
```

---

## 3. Data Flow Architecture: How Python, JSON Contracts, SQLite, .NET, and React Work Together

Per Section 2 of `dokumentacja.pdf`, the system uses a **decoupled Offline ETL + High-Speed Serving + Client-Side Reactive Calculation** architecture:

1. **Offline ETL & Econometrics (`src/analytics/` in Python):**
   - Python does **not** run on every user click (running Pandas/GeoPandas/Scikit-learn on raw CSV/XLSX files per HTTP request would take several seconds per click and overload the VPS).
   - Instead, the Python pipeline processes all raw municipal datasets offline, normalizes the 5 base category scores (`0–100`) for each of the 18 districts, computes the 2027–2030 econometric forecasts, and exports two standardized contract files into `data/contracts/`:
     - `krakow_districts_master.json`
     - `krakow_poi_locations.json`
2. **Database Seeding & Serving (`src/backend/` in .NET 9 + SQLite):**
   - When `Cracow360.Api` starts up, `DatabaseSeeder` reads `krakow_districts_master.json` and `krakow_poi_locations.json` and populates the relational **SQLite** database (`data/db/cracow360.db`).
   - `.NET 9 Minimal API` serves this data from SQLite (backed by `IMemoryCache`) in `< 2 ms`, and `GiosAirQualityBackgroundService` periodically updates live air quality readings from the external GIOŚ API in the background.
3. **Zero-Latency User Interaction (`src/frontend/` in React + TypeScript):**
   - When a user opens the website, React fetches the 18 districts' base scores (`0–100` for Mobility, Education, Greenery, Culture, Environment) from the `.NET 9` API.
   - When the user drags the weight sliders (`0–10`) or clicks a preset (*Student*, *Family 2+1*, etc.), React recalculates the weighted average **instantly in the browser (`0 ms` latency)** using `calculateClientSideQualityIndex` (and `.NET` also supports server-side weighted calculation via query parameters on `GET /api/districts`).

---

## 4. How to Run the Development Environment

### Step 1: Start the Backend API (`.NET 9`)
Run `Cracow360.Api` directly from **JetBrains Rider** (`http` profile) or via terminal:
```powershell
dotnet run --project src/backend/Cracow360.Api/Cracow360.Api.csproj
```
- API URL: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`
- Diagnostic Hello World Endpoint: `http://localhost:5000/api/system/hello`

### Step 2: Start the Frontend (`React + Vite`)
In a second terminal, run:
```powershell
npm --prefix src/frontend run dev
```
- Frontend URL: `http://localhost:5173`

### Step 3 (Optional): Start SQLite Web UI in Docker
```powershell
docker compose up -d sqlite-db
```
- SQLite Web UI URL: `http://localhost:8080`
