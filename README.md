> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Kraków360 – Quality of Life Analysis, Service Accessibility, and Urban Development Prediction System

A **Smart City** analytics and mapping platform developed for the **"Open Data App"** competition organized by the Municipality of Krakow (Gmina Miejska Kraków).

## Tech Stack & Architecture
- **Backend (`src/backend/`):** C#, .NET 9 Minimal API, Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`), Entity Framework Core 9, Dapper, SQLite, `IMemoryCache`, `BackgroundService` (GIOŚ integration).
- **Frontend (`src/frontend/`):** React 19, TypeScript, Vite 6, TailwindCSS 4, React-Leaflet (GeoJSON), Recharts, Axios.
- **Data Science & Econometrics (`src/analytics/`):** Isolated Python 3.12 analytics pipeline (`pandas`, `geopandas`, `scikit-learn`, `statsmodels`, `numpy`, `geopy`) generating and validating JSON contract files in `data/contracts/`.
- **Database & DevOps (`docker-compose.yml`):** SQLite (`data/db/cracow360.db`) + `sqlite-web` container (`http://localhost:8080`).

## Quick Start (Development)

```powershell
# 1. Backend (.NET 9 Minimal API -> http://localhost:5000 | Swagger -> http://localhost:5000/swagger)
dotnet run --project src/backend/Cracow360.Api/Cracow360.Api.csproj

# 2. Frontend (React + Vite -> http://localhost:5173)
npm --prefix src/frontend run dev

# 3. (Optional) SQLite database viewer in Docker (-> http://localhost:8080) - docker-compose.yml to be modified according to the instructions
docker compose up -d sqlite-db
```
