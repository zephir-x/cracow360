# Kontrakty Danych Systemu (Data Contracts)

## Do czego służy ten folder?
Ten katalog to **serce integracji całego projektu Cracow360**. Znajdują się w nim ostateczne, oficjalne pliki danych w formacie JSON i GeoJSON, które stanowią jedyne źródło prawdy dla pozostałych modułów systemu.

Pełnią one rolę formalnego kontraktu łączącego:
1. **Moduł analityczny (Python)** – który generuje i weryfikuje te pliki,
2. **Backend API (.NET 9 / C#)** – który wczytuje je i zapisuje w bazie danych SQLite przy starcie,
3. **Frontend (React / TypeScript)** – który korzysta ze zdefiniowanych w nich struktur typów i wyświetla dane na mapie oraz wykresach.

---

## Co się tu znajduje i po czym powstaje?

### 1. `krakow_districts_master.json`
- **Jak powstaje?** Jest generowany przez skrypt:
  ```bash
  python src/analytics/scripts/03_econometric_forecasts.py
  ```
  a następnie rygorystycznie sprawdzany przez:
  ```bash
  python src/analytics/scripts/04_validate_and_export_contracts.py
  ```
- **Co zawiera?** Kompletny zbiór wiedzy o wszystkich 18 dzielnicach Krakowa. Dla każdej dzielnicy zawiera:
  - dane identyfikacyjne (numer rzymski, arabski, oficjalna nazwa, powierzchnia w km²),
  - 7 znormalizowanych wskaźników jakości życia (0–100 pkt),
  - szczegółowe dane demograficzne, edukacyjne, zielone, transportowe, kulturalne, środowiskowe, bezpieczeństwa i mieszkaniowe,
  - prognozy ekonometryczne na rok 2028 (w tym bilans miejsc w żłobkach i rekomendacje inwestycyjne).

---

### 2. `krakow_poi_locations.json`
- **Jak powstaje?** Jest eksportowany przez skrypt:
  ```bash
  python src/analytics/scripts/01_etl_demographics_and_infrastructure.py
  ```
- **Co zawiera?** Ponad 900 rzeczywistych punktów użyteczności publicznej (POI) w Krakowie ze współrzędnymi geograficznymi WGS84 (szerokość i długość geograficzna):
  - żłobki i kluby dziecięce,
  - parki miejskie i kieszonkowe,
  - filie bibliotek i centra kultury,
  - Centra Aktywności Seniora (CAS),
  - parkingi Park & Ride (P+R) oraz stojaki rowerowe.

Punkty te są wyświetlane jako interaktywne znaczniki na mapie w aplikacji internetowej.

---

### 3. `krakow_districts.geojson`
- **Czym jest?** Oficjalny wektorowy obrys granic 18 dzielnic Krakowa w standardzie GeoJSON (WGS84).
- **Zastosowanie:** Jest używany bezpośrednio przez mapę Leaflet we frontendzie do kolorowania dzielnic, rysowania ich granic i reagowania na najechanie kursorem myszy lub kliknięcie.

---

## Walidacja poprawności
Aby upewnić się, że pliki w tym folderze są w 100% zgodne z wymaganiami i nie spowodują błędów w backendzie ani frontendzie, można w każdej chwili uruchomić audyt:
```bash
python src/analytics/scripts/04_validate_and_export_contracts.py
```
Skrypt sprawdzi typy, kompletność sekcji, poprawność zakresów punktowych (0–100) oraz współrzędne geograficzne punktów.
