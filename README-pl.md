> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Kraków360 – System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego

Platforma analityczno-mapowa typu **Smart City** tworzona w ramach konkursu **„Open Data App”** organizowanego przez Gminę Miejską Kraków.

## Stos Technologiczny i Architektura
- **Backend (`src/backend/`):** C#, .NET 9 Minimal API, Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`), Entity Framework Core 9, Dapper, SQLite, `IMemoryCache`, `BackgroundService` (integracja GIOŚ).
- **Frontend (`src/frontend/`):** React 19, TypeScript, Vite 6, TailwindCSS 4, React-Leaflet (GeoJSON), Recharts, Axios.
- **Data Science & Ekonometria (`src/analytics/`):** Odizolowany pipeline analityczny w Pythonie 3.12 (`pandas`, `geopandas`, `scikit-learn`, `statsmodels`, `numpy`, `geopy`) generujący i walidujący pliki kontraktowe JSON w `data/contracts/`.
- **Baza danych i DevOps (`docker-compose.yml`):** SQLite (`data/db/cracow360.db`) + kontener `sqlite-web` (`http://localhost:8080`).

## Szybkie Uruchomienie (Development)

```powershell
# 1. Backend (.NET 9 Minimal API -> http://localhost:5000 | Swagger -> http://localhost:5000/swagger)
dotnet run --project src/backend/Cracow360.Api/Cracow360.Api.csproj

# 2. Frontend (React + Vite -> http://localhost:5173)
npm --prefix src/frontend run dev

# 3. (Opcjonalnie) Przeglądarka bazy SQLite w Dockerze (-> http://localhost:8080) - docker-compose.yml do modyfikacji według instrukcji
docker compose up -d sqlite-db
```
