> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Baza danych SQLite

## Do czego służy ten folder?
Ten katalog przechowuje lokalny plik bazy danych SQLite: `cracow360.db`. Jest to relacyjna baza danych wykorzystywana przez backend aplikacji (`Cracow360.Api` oparty na .NET 9 i Entity Framework Core).

---

## Jak i kiedy tworzony jest plik bazy danych?
Plik `cracow360.db` **nie jest tworzony przez skrypty analityczne Pythona**; zamiast tego jest generowany w pełni automatycznie przy pierwszym uruchomieniu aplikacji backendowej:
```bash
dotnet run --project src/backend/Cracow360.Api
```

### Mechanizm automatycznego zasilania (seeding):
1. Podczas startu aplikacji backend sprawdza, czy plik `data/db/cracow360.db` istnieje na dysku.
2. Jeśli plik nie istnieje:
   - Tworzy nową strukturę schematu na podstawie modeli domenowych EF Core (`Districts`, `Scores`, `Forecasts`, `PointsOfInterest`, `Tourism`, `Accessibility`).
   - Klasa `DatabaseSeeder.cs` automatycznie odczytuje pliki kontraktów z folderu `data/contracts/` (`krakow_districts_master.json`, `krakow_poi_locations.json` itd.).
   - Bezproblemowo wypełnia bazę danych wszystkimi 18 dzielnicami, profilami dostępności oraz ponad 700 punktami POI (wykorzystując unikalne globalnie identyfikatory UUID, aby zapobiec konfliktom śledzenia IdentityMap).
3. Gdy baza danych już istnieje, backend łączy się z nią bezpośrednio i natychmiast serwuje dane do API.

---

## Dlaczego plik bazy danych nie jest śledzony w repozytorium Git?
Plik `cracow360.db` oraz powiązane pliki pomocnicze (`*.db-shm`, `*.db-wal`) są celowo umieszczone w `.gitignore`.

Dzięki temu:
- repozytorium kodu pozostaje lekkie i czyste,
- unikamy konfliktów scalania (merge conflicts) binarnych plików bazy danych między programistami,
- każdy użytkownik ma gwarancję, że jego lokalna baza danych zostanie wiernie odtworzona z najnowszych kontraktów JSON.

---

## Co zrobić, jeśli musisz zresetować dane?
Jeśli zmodyfikowałeś dane w skryptach Pythona i chcesz, aby backend zaczął korzystać ze świeżych danych:
1. Zatrzymaj backend.
2. Po prostu usuń plik `cracow360.db` z tego folderu.
3. Uruchom ponownie backend – baza danych zostanie odtworzona od zera w ułamku sekundy, pobierając najnowsze dane z `data/contracts/`.