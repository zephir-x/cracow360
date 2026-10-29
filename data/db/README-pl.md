> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Baza Danych SQLite (Database)

## Do czego służy ten folder?
W tym katalogu przechowywany jest lokalny plik bazy danych SQLite: `cracow360.db`. Jest to relacyjna baza danych, z której korzysta backend aplikacji (`Cracow360.Api` w technologii .NET 9 i Entity Framework Core).

---

## Jak i kiedy powstaje plik bazy danych?
Plik `cracow360.db` **nie jest tworzony przez skrypty analityczne w Pythonie**, lecz powstaje w pełni automatycznie przy pierwszym uruchomieniu backendu aplikacji:
```bash
dotnet run --project src/backend/Cracow360.Api
```

### Mechanizm automatycznego zasilania (Seeding):
1. Podczas startu aplikacji backend sprawdza, czy plik `data/db/cracow360.db` istnieje na dysku.
2. Jeśli plik nie istnieje:
   - Tworzy nową strukturę tabel w oparciu o modele domenowe EF Core (`Districts`, `Scores`, `Forecasts`, `PointsOfInterest`).
   - Klasa `DatabaseSeeder.cs` automatycznie czyta pliki kontraktów z folderu `data/contracts/` (`krakow_districts_master.json` oraz `krakow_poi_locations.json`).
   - Wypełnia bazę danych wszystkimi 18 dzielnicami oraz ponad 900 punktami POI.
3. Gdy baza już istnieje, backend łączy się z nią bezpośrednio i natychmiast serwuje dane do API.

---

## Dlaczego plik bazy nie znajduje się w repozytorium Git?
Plik `cracow360.db` oraz pliki pomocnicze (`*.db-shm`, `*.db-wal`) są celowo wpisane do `.gitignore`. 

Dzięki temu:
- repozytorium kodu pozostaje lekkie i czyste,
- nie dochodzi do konfliktów scalania (merge conflicts) bazy binarnej pomiędzy programistami,
- każdy użytkownik ma gwarancję, że jego lokalna baza danych zostanie wiernie odtworzona z najświeższych kontraktów JSON.

---

## Co zrobić w razie potrzeby zresetowania danych?
Jeśli zmieniłeś dane w skryptach Pythona i chcesz, aby backend zaczął korzystać ze świeżych danych:
1. Zatrzymaj backend.
2. Po prostu skasuj plik `cracow360.db` z tego folderu.
3. Uruchom ponownie backend – baza utworzy się od nowa w ułamku sekundy, pobierając najświeższe dane z `data/contracts/`.
