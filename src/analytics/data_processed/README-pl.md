> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Przetworzone dane pośrednie (Data Processed)

## Do czego służy ten folder?
Ten katalog pełni funkcję **bufora roboczego** pomiędzy poszczególnymi etapami obliczeniowymi w Pythonie. Ściśle izoluje pliki pośrednie powstałe po oczyszczeniu i zintegrowaniu danych surowych, przed wygenerowaniem ostatecznych kontraktów systemowych.

Przechowuje również bezpiecznie stany operacyjne (takie jak trwała pamięć podręczna geokodowania) oraz ręcznie przygotowane dane zalążkowe (seed data), zapobiegając zanieczyszczeniu ostatecznego folderu integracyjnego `data/contracts/`. Pozwala to na niezależne uruchamianie każdego etapu analitycznego i ułatwia inspekcję wyników pośrednich.

---

## Co się tutaj znajduje i przez jaki skrypt jest generowane?

### 1. `districts_aggregated.json`
- **Jak jest generowany?** Poprzez uruchomienie bazowego skryptu ETL:
  ```bash
  python scripts/01_etl_demographics_and_infrastructure.py
  ```
- **Co zawiera?** Zagregowane, twarde metryki dla każdej z 18 dzielnic Krakowa bez żadnych syntetycznych ocen:
  - dokładne liczby ludności w podziale na grupy wiekowe, zameldowania czasowe i obcokrajowców,
  - pojemności żłobków i przedszkoli oraz średnią liczebność klas szkolnych,
  - precyzyjne wskaźniki transportu publicznego (w tym wstępnie obliczone wartości procentowe peronów typu Kassel i pasów naprowadzających),
  - całkowitą powierzchnię parków/lasów oraz obiektywne statystyki środowiskowe, bezpieczeństwa i mieszkaniowe.

---

### 2. `districts_scored.json`
- **Jak jest generowany?** Poprzez uruchomienie skryptu scoringowego:
  ```bash
  python scripts/02_calculate_quality_scores.py
  ```
- **Co zawiera?** Wszystkie twarde dane z poprzedniego pliku uzupełnione o 8 znormalizowanych wskaźników jakości życia (skala 0–100):
  - `mobilityScore` – Transport publiczny i infrastruktura rowerowa,
  - `educationScore` – Edukacja i opieka nad dziećmi,
  - `greeneryScore` – Tereny zielone i rekreacja,
  - `cultureAndSeniorScore` – Biblioteki, Centra Aktywności Seniora (CAS) i kultura,
  - `environmentScore` – Jakość powietrza i komfort akustyczny,
  - `safetyScore` – Bezpieczeństwo publiczne i wskaźniki wypadków drogowych (skorygowane o populację dzienną),
  - `housingAffordabilityScore` – Dostępność cenowa mieszkań,
  - `demographicVitalityScore` – Rozwój demograficzny i retencja młodzieży.

---

### 3. `districts_accessibility.json`
- **Jak jest generowany?** Poprzez uruchomienie skryptu ETL dostępności:
  ```bash
  python scripts/03_etl_accessibility_profiles.py
  ```
- **Co zawiera?** Przetworzone profile oceniające dostępność miejską dla osób na wózkach inwalidzkich, osób z dysfunkcją wzroku/słuchu, seniorów oraz rodziców z wózkami dziecięcymi na podstawie audytów infrastruktury publicznej.

---

### 4. Pliki systemowe i operacyjne
- `spatial_geocoding_cache.json`: Trwały plik stanu prowadzony przez `01_etl_demographics_and_infrastructure.py`. Przechowuje historycznie rozwiązane współrzędne GPS z oficjalnego API GUGiK, radykalnie redukując opóźnienia sieciowe przy kolejnych uruchomieniach potoku analitycznego.
- `krakow_tourism_seed.json`: Ręcznie przygotowany plik zalążkowy definiujący trasy tematyczne, spokojne alternatywy chroniące przed overtourismem oraz podstawowe metryki podsumowujące. Jest wykorzystywany przez `05_etl_tourism_explorer.py` do generowania finalnych paszportów turystycznych.

---

## Co dzieje się dalej z tymi plikami?
Pliki z tego katalogu są przetwarzane przez kolejne skrypty ekonometryczne i syntetyzujące (takie jak `04_econometric_forecasts.py` oraz `05_etl_tourism_explorer.py`), które obliczają prognozy demograficzne metodą kohortowo-komponentową na 2028 rok, generują wykresy analityczne i zapisują ostateczne, produkcyjne pliki JSON w katalogu `data/contracts/`.