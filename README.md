# Kraków360 – System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego

Platforma analityczno-mapowa typu **Smart City** tworzona w ramach konkursu **„Open Data App”** organizowanego przez Gminę Miejską Kraków.

## Stos Technologiczny i Architektura
- **Backend (`src/backend/`):** C#, .NET 9 Minimal API, Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`), Entity Framework Core 9, Dapper, SQLite, `IMemoryCache`, `BackgroundService` (integracja GIOŚ).
- **Frontend (`src/frontend/`):** React 19, TypeScript, Vite 6, TailwindCSS 4, React-Leaflet (GeoJSON), Recharts, Axios.
- **Data Science & Ekonometria (`src/analytics/`):** Odizolowany pipeline analityczny w Pythonie 3.12 (`pandas`, `geopandas`, `scikit-learn`, `statsmodels`, `numpy`, `geopy`) generujący i walidujący pliki kontraktowe JSON w `data/contracts/`.
- **Baza danych i DevOps (`docker-compose.yml`):** SQLite (`data/db/cracow360.db`) + kontener `sqlite-web` (`http://localhost:8080`).

## Dokumentacja Projektowa, Architektura i Źródła Danych (`Assets/Instructions/`)
0. [**Master Project Context & Technical Handover** (Pełny kontekst techniczny projektu)](Assets/Instructions/00_MASTER_CONTEXT.md)
1. [Competition Analysis & Action Plan (Module 1)](Assets/Instructions/01_COMPETITION_ANALYSIS_AND_ACTION_PLAN.md)
2. [Architecture, Project State & Development Guide](Assets/Instructions/02_ARCHITECTURE_PROJECT_STATE_AND_DEVELOPMENT.md)
3. [Python Analytics & Econometrics Developer Guide](Assets/Instructions/03_PYTHON_ANALYTICS_DEVELOPER_GUIDE.md)
4. [**Official Open Data Sources & Provenance Registry** (Rejestr źródeł Otwartych Danych Krakowa)](Assets/Instructions/04_OPEN_DATA_SOURCES_REGISTRY.md)

## Szybkie Uruchomienie (Development)

```powershell
# 1. Backend (.NET 9 Minimal API -> http://localhost:5000 | Swagger -> http://localhost:5000/swagger)
dotnet run --project src/backend/Cracow360.Api/Cracow360.Api.csproj

# 2. Frontend (React + Vite -> http://localhost:5173)
npm --prefix src/frontend run dev

# 3. (Opcjonalnie) Przeglądarka bazy SQLite w Dockerze (-> http://localhost:8080)
docker compose up -d sqlite-db
```
