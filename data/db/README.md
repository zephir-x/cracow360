> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# SQLite Database

## What is this folder used for?
This directory stores the local SQLite database file: `cracow360.db`. It is a relational database used by the application backend (`Cracow360.Api` powered by .NET 9 and Entity Framework Core).

---

## How and when is the database file created?
The `cracow360.db` file **is not created by Python analytics scripts**; instead, it is generated fully automatically upon the first launch of the backend application:
```bash
dotnet run --project src/backend/Cracow360.Api
```

### Automatic Seeding Mechanism:
1. During application startup, the backend checks whether `data/db/cracow360.db` exists on disk.
2. If the file does not exist:
   - It creates a new table structure based on EF Core domain models (`Districts`, `Scores`, `Forecasts`, `PointsOfInterest`).
   - The `DatabaseSeeder.cs` class automatically reads contract files from the `data/contracts/` folder (`krakow_districts_master.json` and `krakow_poi_locations.json`).
   - It populates the database with all 18 districts and over 900 POI points.
3. Once the database exists, the backend connects to it directly and serves data to the API immediately.

---

## Why is the database file not tracked in the Git repository?
The `cracow360.db` file and associated auxiliary files (`*.db-shm`, `*.db-wal`) are intentionally listed in `.gitignore`.

Because of this:
- the code repository remains lightweight and clean,
- binary database merge conflicts between developers are avoided,
- each user is guaranteed that their local database will be faithfully recreated from the latest JSON contracts.

---

## What to do if you need to reset the data?
If you have modified data in the Python scripts and want the backend to start using fresh data:
1. Stop the backend.
2. Simply delete the `cracow360.db` file from this folder.
3. Restart the backend – the database will be recreated from scratch in a fraction of a second, fetching the latest data from `data/contracts/`.
