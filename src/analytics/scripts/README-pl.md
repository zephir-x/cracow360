> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Analityka Python & Potok ETL (Skrypty)

## Do czego służy ten folder?
Ten katalog to **mózg obliczeniowy** projektu Krakow360. Zawiera potok ETL (Extract, Transform, Load) w Pythonie oraz skrypty z zakresu data science odpowiedzialne za wczytywanie surowych miejskich plików CSV, przeprowadzanie zaawansowanych obliczeń przestrzennych i ekonometrycznych oraz eksportowanie czystych, zwalidowanych kontraktów JSON dla backendu w .NET 9.

Potok wykonywany jest ściśle sekwencyjnie. Przekształca niestrukturyzowane, surowe dane miejskie w produkcyjny, wysoce relacyjny zestaw danych bez używania zahardkodowanych wartości („magicznych liczb”) czy halucynowanych metryk.

---

## Główna konfiguracja i zależności

- **`requirements.txt`**: Definiuje zależności środowiska Python (np. `pandas`, `scikit-learn`, `geopandas`, `pyproj`, `matplotlib`).
- **`config.py`**: Centralny moduł konfiguracyjny. Zapewnia:
    - Globalne ścieżki do katalogów oraz oficjalną definicję 18 dzielnic Krakowa.
    - Transformatory układów współrzędnych (CRS) za pośrednictwem **PyProj** (mapowanie `EPSG:3857`, `EPSG:2178` i `EPSG:2180` na standard WGS84).
    - Główną funkcję matematyczną `min_max_normalize_0_100` używaną we wszystkich skryptach scoringowych.

---

## Potok: Szczegółowy opis skrypt po skrypcie

### Krok 01: `01_etl_demographics_and_infrastructure.py`
- **Cel**: Fundamentalna warstwa pozyskiwania danych i rozwiązywania relacji przestrzennych.
- **Dane wejściowe**: Odczytuje dziesiątki surowych plików CSV z katalogu `data_raw/` (demografia, szkoły, parki, przystanki KMK, P+R itd.) oraz `Korekty_Geoprzestrzenne_POI.csv`.
- **Metodologia i algorytmy**:
    - **Dynamiczne geokodowanie**: Łączy się z oficjalnym interfejsem **API GUGiK** w celu zamiany adresów ulicznych na współrzędne WGS84. Wykorzystuje trwałą sesję `requests.Session()` oraz lokalną pamięć podręczną JSON (`spatial_geocoding_cache.json`), co radykalnie zmniejsza opóźnienia sieciowe.
    - **Telemetria środowiskowa (Open-Meteo Air Quality API)**: Pobiera 90-dniowe szeregi czasowe stężeń pyłów zawieszonych ($\text{PM}_{10}$, $\text{PM}_{2.5}$), dwutlenku azotu ($\text{NO}_2$) oraz liczby dni smogowych dla centroidów poszczególnych dzielnic.
    - **Point-in-Polygon (PiP)**: Używa `matplotlib.path` do geometrycznego sprawdzania, który wielokąt dzielnicy zawiera określone współrzędne geograficzne.
    - **Stochastyczne izochrony**: Zamiast arbitralnych mnożników oblicza zasięg transportu publicznego przy użyciu **modelu probabilistycznego Poissona** ($1 - e^{- \lambda}$), zakładając 300-metrowy promień dojścia pieszego ($\sim 0.2827 \text{ km}^2$) wokół efektywnych przystanków komunikacji.
    - **Spójny bilans demograficzny BDK**: Wylicza łączną populację ewidencyjną (`totalPopulation = permanentResidents + temporaryResidents`) oraz 3-letnią dynamikę demograficzną (2023–2025) na symetrycznej bazie porównawczej, zachowując `foreignersTotal` jako niezależny wskaźnik strukturalny.
    - **Generowanie UUID**: Tworzy unikalne globalnie identyfikatory (`uuid.uuid4()`) dla każdego punktu POI, aby bezwzględnie zapobiec konfliktom śledzenia kluczy głównych (Primary Key) w bazie danych Entity Framework Core.
- **Wyniki**: `data_processed/districts_aggregated.json` oraz `data/contracts/krakow_poi_locations.json`.

### Krok 02: `02_calculate_quality_scores.py`
- **Cel**: Oblicza 8 fundamentalnych ocen filarowych Jakości Życia (QoL) dla wszystkich 18 dzielnic.
- **Dane wejściowe**: Odczytuje `districts_aggregated.json`.
- **Metodologia i algorytmy**:
    - **Skalowanie referencyjne (Benchmark Scoring)**: Odwzorowuje twarde wskaźniki miejskie bezpośrednio względem oficjalnych norm prawnych i urbanistycznych (Dyrektywa UE 2008/50/WE dla $\text{PM}_{10}/\text{PM}_{2.5}/\text{NO}_2$, normy dostępności terenów zielonych EEA/WHO $50\text{ m}^2/\text{os.}$, wskaźniki bezpieczeństwa GUS/SEWiK oraz siła nabywcza NBP/Otodom) na ujednoliconą skalę $[0.0 - 100.0]$.
    - **Kalibracja kohorty przedszkolnej (3–6 lat)**: Uwzględnia pełne 4 roczniki dzieci objętych wychowaniem przedszkolnym (`age4to6 + 0.25 * age0to3`) względem docelowego bufora pojemności placówek ($1.50\times$), eliminując sztuczne spłaszczenie wyników na górnej granicy skali.
    - **Brak arbitralnych kar i mnożników**: Wyniki wynikają wyłącznie z przejrzystych równań liniowych ograniczonych funkcją `clamp(0.0, 100.0)`.
- **Wyniki**: `data_processed/districts_scored.json`.

### Krok 03: `03_etl_accessibility_profiles.py`
- **Cel**: Generuje profile nawigatora dostępności „Kraków bez Barier”.
- **Dane wejściowe**: Odczytuje `districts_aggregated.json` (w celu ponownego użycia przetworzonych danych o transporcie/CAS) oraz surowe pliki CSV dotyczące miejsc postojowych PRM (Niebieskie Koperty) i audytów architektonicznych obiektów UMK.
- **Metodologia i algorytmy**:
    - Ocenia 5 niezależnych profili użytkowników (Ruchowa, Wzrokowa, Słuchowa, Seniorzy, Wózki dziecięce).
    - **Kary ekonometryczne**: Dedykowanie odejmuje punkty Dzielnicy I (Stare Miasto) w kategoriach Ruchowa/Wózki z powodu zabytkowej nawierzchni brukowej („kocie łby”), co zapewnia realistyczną ocenę barier fizycznych.
    - **Generowanie języka naturalnego**: Syntetyzuje 3-punktowe „Kluczowe atuty” (np. obecność pętli indukcyjnych lub tłumaczy PJM) wyłącznie w oparciu o flagi logiczne z audytów.
- **Wyniki**: `data_processed/districts_accessibility.json` oraz `data/contracts/krakow_accessibility_profiles.json`.

### Krok 04: `04_econometric_forecasts.py`
- **Cel**: Buduje predykcyjne modele ekonometryczne na rok 2028 i eksportuje główny kontrakt systemowy.
- **Dane wejściowe**: Odczytuje `districts_scored.json`.
- **Metodologia i algorytmy**:
    - **Regresja liniowa OLS z wygaszanym trendem (`scikit-learn`)**: Dopasowuje linię trendu metodą najmniejszych kwadratów (OLS) do historycznych rocznych kohort urodzeń (2018–2025) i rzutuje wygaszany trend (damped trend) z obecnej bazy 0–3 lat na horyzont 2025–2028.
    - **Migracja kohortowo-komponentowa**: Stosuje wytłumiony 3-letni mnożnik migracyjny do prognozowanej linii bazowej, symulując przepływy rodzin wprowadzających się lub wyprowadzających z poszczególnych dzielnic.
    - **Zsynchronizowana klasyfikacja deficytów SSoT (0–14 lat)**: Wylicza łączny i cząstkowy bilans miejsc edukacyjno-opiekuńczych (żłobki 0–3, przedszkola 4–6, szkoły podstawowe 7–14 przy normatywie $350\text{ miejsc/szkołę}$), mapując je na typy potencjału B2B/B2G (`LOW`, `MEDIUM`, `HIGH`) oraz precyzyjne rekomendacje bez sprzeczności między segmentami.
    - **Matplotlib**: Generuje statyczne, gotowe do prezentacji wykresy punktowe i słupkowe do raportu konkursowego w formacie PDF.
- **Wyniki**: `data/contracts/krakow_districts_master.json` oraz wykresy PNG w katalogu `charts/`.

### Krok 05: `05_etl_tourism_explorer.py`
- **Cel**: Syntetyzuje dane modułu Smart Tourism (Paszporty, Trasy tematyczne, Kompas Overtourismu).
- **Dane wejściowe**: Odczytuje `data_processed/krakow_tourism_seed.json` (wyselekcjonowane listy bazowe).
- **Metodologia i algorytmy**:
    - **Formuła Haversine**: Oblicza precyzyjne odległości sferyczne między wyselekcjonowanymi atrakcjami a Krakowem Głównym.
    - **Miejska heurystyka piesza**: Oblicza realistyczny czas marszu przy założeniu tempa 4,5 km/h w połączeniu ze współczynnikiem wydłużenia trasy 1,25 (uwzględniającym krętość ulic).
- **Wyniki**: `data/contracts/krakow_tourism_explorer.json`.

### Krok 06: `06_validate_and_export_contracts.py` (Strażnik / The Gatekeeper)
- **Cel**: Ostateczny, automatyczny walidator schematu i integralności danych przed przekazaniem ich do warstwy .NET i React.
- **Dane wejściowe**: Odczytuje wszystkie cztery ostateczne pliki kontraktów JSON w `data/contracts/`.
- **Metodologia i algorytmy**:
    - Działa jak zestaw testów jednostkowych dla warstwy danych.
    - Weryfikuje dokładną liczność (dokładnie 18 dzielnic), poprawność typów (wyniki muszą być liczbami zmiennoprzecinkowymi $\in [0, 100]$), spójność równania demograficznego (`totalPopulation == permanentResidents + temporaryResidents`), obecność zagnieżdżonych kluczy (`environmentalQuality`, `publicSafety`, `housingMarket`), zgodność typów enum oraz ograniczenia ramki otaczającej (bounding-box WGS84).
- **Wykonanie**: Zwraca kod wyjścia `0` w przypadku powodzenia lub `1` wraz ze szczegółową listą diagnostyczną w razie wykrycia jakiegokolwiek naruszenia kontraktu.

---

**Uwaga dotycząca uruchomienia**: Aby uruchomić cały potok od zera, aktywuj wirtualne środowisko Pythona i uruchamiaj skrypty w ścisłej kolejności numerycznej (od 01 do 06).
