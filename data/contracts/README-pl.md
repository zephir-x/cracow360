> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Kontrakty danych systemu

## Do czego służy ten folder?
Ten katalog stanowi **serce integracji całego projektu Cracow360**. Zawiera ostateczne, oficjalne pliki danych w formatach JSON oraz GeoJSON, które pełnią rolę pojedynczego źródła prawdy (single source of truth) dla pozostałych modułów systemu.

*Uwaga: Pośrednie pliki robocze (takie jak pamięć podręczna geokodowania i dane zalążkowe turystyki) są ściśle odizolowane w folderze `data_processed`.*

Pliki te stanowią formalny kontrakt łączący:
1. **Moduł analityczny (Python)** – który generuje i rygorystycznie waliduje te pliki,
2. **Backend API (.NET 9 / C#)** – który wczytuje je i zasila nimi bazę danych SQLite przy starcie,
3. **Frontend (React / TypeScript)** – który korzysta ze zdefiniowanych w nich struktur typów oraz prezentuje dane na mapie i wykresach.

---

## Co się tutaj znajduje i jak jest generowane?

### 1. `krakow_districts_master.json`
- **Jak jest generowany?** Jest generowany przez skrypt:
  ```bash
  python src/analytics/scripts/04_econometric_forecasts.py
  ```
- **Co zawiera?** Kompleksowy zestaw danych dla wszystkich 18 dzielnic Krakowa. Dla każdej dzielnicy zawiera:
  - dane identyfikacyjne (cyfra rzymska, cyfra arabska, oficjalna nazwa, powierzchnia w km²),
  - 8 znormalizowanych wskaźników jakości życia (0–100 pkt),
  - szczegółowe dane demograficzne, edukacyjne, dotyczące terenów zielonych, transportowe, kulturalne, środowiskowe, bezpieczeństwa oraz mieszkaniowe,
  - ekonometryczne prognozy kohortowo-komponentowe na rok 2028 (w tym bilanse miejsc w żłobkach i rekomendacje inwestycyjne).

---

### 2. `krakow_poi_locations.json`
- **Jak jest generowany?** Jest eksportowany przez skrypt:
  ```bash
  python src/analytics/scripts/01_etl_demographics_and_infrastructure.py
  ```
- **Co zawiera?** Ponad 700 rzeczywistych punktów użyteczności publicznej (POI) w Krakowie ze współrzędnymi geograficznymi WGS84. Aby zapewnić absolutną integralność bazy danych Entity Framework Core, każdy POI posiada unikalny globalnie identyfikator UUID (np. `city_park_a1b2c3d4e5f6`).
  - żłobki i kluby dziecięce,
  - parki miejskie i kieszonkowe,
  - filie bibliotek, centra kultury i Centra Aktywności Seniora (CAS),
  - parkingi Park & Ride (P+R) oraz stojaki rowerowe.

---

### 3. `krakow_accessibility_profiles.json`
- **Jak jest generowany?** Jest eksportowany przez skrypt:
  ```bash
  python src/analytics/scripts/03_etl_accessibility_profiles.py
  ```
- **Co zawiera?** Zestaw danych Civic Accessibility Navigator oparty ściśle na audytach UMK, ZDMK i ZTP:
  - 5 dedykowanych ocen dostępności (Ruchowa, Wzrokowa, Słuchowa, Seniorzy, Wózki dziecięce),
  - wskaźniki procentowe dostępności tranzytowej (krawężniki Kassel oraz pasy naprowadzające),
  - wyznaczone strefy parkingowe dla osób z niepełnosprawnościami (PRM) oraz audyty obiektów publicznych.

---

### 4. `krakow_tourism_explorer.json`
- **Jak jest generowany?** Jest syntetyzowany przez skrypt:
  ```bash
  python src/analytics/scripts/05_etl_tourism_explorer.py
  ```
- **Co zawiera?** Dane dla modułu Smart Tourism:
  - 110 wyselekcjonowanych atrakcji wraz z obliczeniami odległości Haversine od Dworca Głównego,
  - spokojne alternatywy chroniące przed overtourismem i trasy tematyczne,
  - 18 kompleksowych Paszportów Turystycznych Dzielnic.

---

### 5. `krakow_districts.geojson`
- **Czym jest?** Oficjalne wektorowe granice wszystkich 18 dzielnic Krakowa w standardzie GeoJSON (WGS84).
- **Zastosowanie:** Używany bezpośrednio przez mapę Leaflet na frontendzie do kolorowania dzielnic, renderowania ich granic oraz przypisywania punktów do wielokątów za pomocą `matplotlib.path` w potoku ETL.

---

## Walidacja (The Gatekeeper)
Aby upewnić się, że pliki w tym folderze są w 100% zgodne ze schematem architektonicznym i nie spowodują konfliktów śledzenia w backendzie ani błędów typów na frontendzie, przed wdrożeniem należy uruchomić audyt strażnika (gatekeeper):
```bash
python src/analytics/scripts/06_validate_and_export_contracts.py
```
Skrypt rygorystycznie waliduje kompletność strukturalną we wszystkich 18 dzielnicach, sprawdza czy 8 wskaźników filarowych mieści się w przedziale [0.0–100.0] oraz weryfikuje, czy współrzędne GPS znajdują się wewnątrz granic metropolitalnych Krakowa.