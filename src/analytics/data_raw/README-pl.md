# 📥 Cracow360 — Surowe Zbiory Danych Miejskich (`src/analytics/data_raw/`)

> 🌐 **Dokumentacja w dwóch językach / Documentation in two languages:**  
> 🇬🇧 **[English (README.md)](./README.md)** | 🇵🇱 **Polski (Aktualny)**

![Open Data](https://img.shields.io/badge/Źródło-Bank_Danych_Krakowa_(BDK)_%26_MSIP-1D4ED8?style=for-the-badge)
![Datasets](https://img.shields.io/badge/Zbiory_Danych-31_CSV_%2B_2_GeoJSON-059669?style=for-the-badge)
![CRS](https://img.shields.io/badge/Układy_CRS-EPSG:4326_|_2178_|_2180_|_3857-7C3AED?style=for-the-badge)

---

## 📌 Rola Architektoniczna

Ten katalog stanowi **niemodyfikowalne repozytorium danych surowych (Raw Data Lake / Landing Zone)** platformy **Cracow360**. Przechowuje **31 oficjalnych zbiorów `.csv`** oraz **2 kolekcje przestrzenne `.geojson`** pozyskane z:
- **Banku Danych Krakowa (BDK)** (`badam.krakow.pl` / `dane.krakow.pl`)
- **Biuletynu Informacji Publicznej Miasta Krakowa (BIP MK)**
- **Miejskiego Systemu Informacji Przestrzennej (MSIP / ZTP / ZZM Kraków)**

> [!IMPORTANT]
> **Zasada Niezmienności Danych Surowych (Data Immutability)**  
> Pliki w katalogu `src/analytics/data_raw/` traktowane są wyłącznie jako **archiwalne źródła tylko do odczytu (Read-Only)**. Wszelka normalizacja kodowania znaków, transformacja układów współrzędnych (`EPSG:2178` / `EPSG:3857` → `WGS84`), deduplikacja oraz przypisywanie do dzielnic odbywają się w pamięci operacyjnej skryptów ETL w [`src/analytics/scripts/`](../scripts/README-pl.md), a wyniki pośrednie trafiają do [`src/analytics/data_processed/`](../data_processed/README-pl.md).

---

## 🗂️ Pełny Katalog Zbiorów Surowych (31 CSV + 2 GeoJSON)

### 1. 👥 Demografia i 3-Letnie Szeregi Czasowe Meldunków (8 CSV)
Wykorzystywane przez skrypty `01_etl_demographics_and_infrastructure.py` oraz `04_econometric_forecasts.py` do agregacji jednorocznych roczników wieku (`0–3`, `4–6`, `7–14`, `65+`), wyznaczenia bazy **736 035** zameldowanych mieszkańców (`pobyt stały + czasowy`), 3-letniej dynamiki demograficznej (`2023` vs `2025`) oraz prognoz ekonometrycznych OLS na rok 2028.

| Nazwa Pliku | Rok | Zakres Danych |
| :--- | :---: | :--- |
| `Mieszkańcy zameldowani na pobyt stały w podziale na wiek, płeć i dzielnice w 2025 roku - stan na 31 XII.csv` | 2025 | Piramida wieku rok po roku (`0` do `100+`) wg płci i dzielnicy (**703 718** mieszkańców). |
| `Mieszkańcy zameldowani na pobyt czasowy w podziale na wiek, płeć i dzielnice w 2025 roku - stan na 31 XII.csv` | 2025 | Piramida wieku zameldowanych czasowo wg płci i dzielnicy (**32 317** mieszkańców). |
| `Mieszkańcy zameldowani na pobyt stały w podziale na wiek, płeć i dzielnice w 2024 roku - stan na 31 XII.csv` | 2024 | Historyczny przekrój meldunków stałych (`2024`). |
| `Mieszkańcy zameldowani na pobyt czasowy w podziale na wiek, płeć i dzielnice w 2024 roku - stan na 31 XII.csv` | 2024 | Historyczny przekrój meldunków czasowych (`2024`). |
| `Mieszkańcy zameldowani na pobyt stały w podziale na wiek, płeć i dzielnice w 2023 roku - stan na 31 XII.csv` | 2023 | Punkt odniesienia (`2023`) dla dynamiki 3-letniej oraz modelu regresji kohortowej OLS. |
| `Mieszkańcy zameldowani na pobyt czasowy w podziale na wiek, płeć i dzielnice w 2023 roku - stan na 31 XII.csv` | 2023 | Historyczny przekrój meldunków czasowych (`2023`). |
| `Cudzoziemcy zameldowani na pobyt stały wg dzielnic w 2025 roku - stan na 31 XII.csv` | 2025 | Cudzoziemcy zameldowani na pobyt stały wg dzielnic. |
| `Cudzoziemcy zameldowani na pobyt czasowy wg dzielnic w 2025 roku - stan na 31 XII.csv` | 2025 | Cudzoziemcy zameldowani na pobyt czasowy wg dzielnic (łącznie **12 066** osób). |

---

### 2. 👶 Edukacja i Opieka Wczesnodziecięca (9 CSV)
Obiekty geokodowane przez oficjalny serwis **GUGiK UUG API** (`EPSG:2180` → `WGS84`) i przypisywane przestrzennie (`shapely` point-in-polygon) do 18 dzielnic.

| Nazwa Pliku | Typ Placówki | Kluczowe Wyciągane Metryki |
| :--- | :--- | :--- |
| `Zlobki_Samorzadowe_Krakow.csv` | Żłobki Samorządowe | Adres, statutowa liczba miejsc, liczba zapisanych dzieci, wolne miejsca. |
| `Zlobki_Prywatne_Dotowane_Krakow.csv` | Żłobki Prywatne z Wykupem Miejsc (100% dotacji GMK) | Adres, pula miejsc dotowanych, opłata rodzica po dotacji (`0–200 PLN`). |
| `Zlobki_Prywatne_Dotacja_Gminy_Krakow.csv` | Żłobki Prywatne z Dotacją (`3,50 PLN/h`) | Adres, pojemność, wolne miejsca, czesne komercyjne (`MonthlyFeePln`), stawka żywieniowa. |
| `Kluby_Dzieciece_Krakow.csv` | Kluby Dziecięce (`0–3 lata`) | Adres, liczba miejsc, wolne miejsca, wysokość czesnego. |
| `Kluby_Rodzicow_Krakow.csv` | Miejskie Kluby Rodziców | Adres, dzielnica, sieć wsparcia rodzinnego. |
| `Przedszkola_Samorzadowe_Krakow.csv` | Przedszkola Samorządowe (`4–6 lat`) | Adres, liczba miejsc w budynku, liczba oddziałów, liczba przedszkolaków. |
| `Przedszkola_Niesamorzadowe_Krakow.csv` | Przedszkola Niesamorządowe (`4–6 lat`) | Adres, pojemność placówki, liczba dzieci. |
| `Szkoly_Podstawowe_Samorzadowe_Krakow.csv` | Szkoły Podstawowe Samorządowe (`7–14 lat`) | Adres, liczba uczniów, liczba oddziałów klasowych (`studentsPerClassRatio`). |
| `Szkoly_Podstawowe_Niesamorzadowe_Krakow.csv` | Szkoły Podstawowe Niesamorządowe (`7–14 lat`) | Adres, liczba uczniów, liczba oddziałów klasowych. |

---

### 3. 🌳 Zieleń Miejska i Infrastruktura Sportowa (6 CSV)

| Nazwa Pliku | Kategoria Obiektów | Kluczowe Wyciągane Metryki |
| :--- | :--- | :--- |
| `Parki_Miejskie_Krakow.csv` | Parki Miejskie (ZZM) | Nazwa parku, dzielnica, powierzchnia w hektarach (`AreaHa`), wyposażenie rekreacyjne. |
| `Parki_Kieszonkowe_Krakow.csv` | Parki Kieszonkowe („Ogrody Krakowian") | Nazwa parku kieszonkowego, lokalizacja, powierzchnia (`AreaHa`). |
| `Lasy_Pozostale_Terenu_Zieleni_Krakow.csv` | Lasy Komunalne i Pozostałe Tereny Zieleni | Nazwa kompleksu leśnego, dzielnica, powierzchnia w hektarach (`AreaHa`). |
| `Baza_Sportowa_Szkoly_Samorzadowe_Krakow.csv` | Boiska i Infrastruktura Sportowa Szkół Samorządowych | Boiska wielofunkcyjne, bieżnie, korty przyszkolne. |
| `Baza_Sportowa_Szkoly_Niesamorzadowe_Krakow.csv` | Baza Sportowa Szkół Niesamorządowych | Przyszkolne obiekty sportowe. |
| `Sale_Gimnastyczne_Plywalnie_Krakow.csv` | Sale Gimnastyczne i Pływalnie Szkolne | Pełnowymiarowe hale, sale gimnastyczne oraz kryte pływalnie (`swimmingPoolsCount`). |

---

### 4. 🚊 Mobilność, Transport Publiczny KMK i Sieć Rowerowa (3 CSV + 1 GeoJSON)

| Nazwa Pliku | Układ Współrzędnych | Kluczowe Wyciągane Metryki |
| :--- | :---: | :--- |
| `Przystanki_KMK_Krakow.csv` | `EPSG:3857` (Web Mercator) | Przystanki autobusowe/tramwajowe, długość peronu, **krawężniki typu Kassel** (`Krawężnik peronowy`), **płytki kierunkowe z wypustkami** (`Płytki z wypustkami`). |
| `Stojaki_Rowerowe_Krakow.csv` | `EPSG:2178` (PUWG 2000 s. 7) | Miejskie stojaki rowerowe ZTP, pojemność, typ stojaka. |
| `Parkingi_Park_and_Ride_Krakow.csv` | Adres + Korekta GIS | Węzły przesiadkowe P+R, łączna liczba miejsc postojowych (`SpotsCount`), ładowarki EV. |
| `Drogi_Rowerowe_Krakow.geojson` | `EPSG:4326` (`WGS84`) | Wektorowa sieć dróg dla rowerów, ciągów pieszo-rowerowych i kontrapasów (`cyclingPathsLengthKm`). |

---

### 5. 🎭 Kultura, Biblioteki i Centra Aktywności Seniorów (3 CSV)

| Nazwa Pliku | Typ Instytucji | Kluczowe Wyciągane Metryki |
| :--- | :--- | :--- |
| `Działalność miejskich centrów i ośrodków kultury w 2025 roku.csv` | Miejskie Centra, Domy i Kluby Kultury | Wydarzenia, uczestnicy i dotacje podmiotowe rozliczane terytorialnie poprzez `CULTURAL_NETWORK_SHARES` na wszystkie **56 filii i klubów** w 18 dzielnicach (`culturalCentersCount >= 1`). |
| `Biblioteka_Krakow_Filie_2025.csv` | Filie Biblioteki Kraków | Zgeokodowane filie biblioteczne, księgozbiór (`libraryBookCollection`), liczba czytelników (`libraryReadersCount`). |
| `Centra_Aktywnosci_Seniorow_Krakow.csv` | Centra Aktywności Seniorów (CAS) | 53 placówki CAS, liczba zrzeszonych seniorów (`casMembersCount`), średnia frekwencja. |

---

### 6. ♿ Dostępność Architektoniczna i Miejsca PRM (2 CSV)

| Nazwa Pliku | Zakres | Kluczowe Wyciągane Metryki |
| :--- | :--- | :--- |
| `Miejsca_Postojowe_Niepelnosprawni_Krakow.csv` | Sieć Kopert Parkingowych PRM | **862 zgeokodowane lokalizacje** obejmujące łącznie **1 709 miejsc postojowych PRM** (`Liczba miejsc`). |
| `Audyt_Dostepnosci_Budynkow_Krakow.csv` | Audyt Dostępności Obiektów Publicznych | **25 zaudytowanych obiektów miejskich** ocenionych w skali `0–10` pod kątem dostępności architektonicznej, wzrokowej i słuchowej (pętle indukcyjne). |

---

### 7. 🛡️ Bezpieczeństwo, Rynek Mieszkaniowy, Podatki B2B i Referencje GIS (5 CSV + 1 GeoJSON)

| Nazwa Pliku | Domena | Kluczowe Wyciągane Metryki |
| :--- | :--- | :--- |
| `Bezpieczenstwo_Ruch_Drogowy_i_Ankiety_Krakow_2024_2025.csv` | Bezpieczeństwo Publiczne (`2024–2025`) | Wypadki drogowe, kolizje, poszkodowani niechronieni uczestnicy ruchu, poczucie bezpieczeństwa z ankiet mieszkańców (`%`), ocena oświetlenia i przejść (`%`). |
| `Rynek_Mieszkaniowy_Ceny_i_Dostepnosc_Krakow_2025_2026.csv` | Rynek Mieszkaniowy (`2025–2026`) | Ceny za $1\text{ m}^2$ na rynku pierwotnym i wtórnym (`PLN`), mediana najmu 2-pokojowego (`PLN`), dynamika r/r (`%`), oddane mieszkania, dostępność płacowa (`m²`). |
| `Podatki_Lokalne_CIT_PIT_Nieruchomosci_Krakow_2025.csv` | Potencjał Fiskalny i B2B (`2025`) | Liczba podatników CIT, udział gminy we wpływach z CIT i PIT (`PLN`), podatek od nieruchomości (`PLN`). |
| `Dzielnice_Krakowa.csv` | Referencja Administracyjna | Oficjalne symbole rzymskie (`I`–`XVIII`), nazwy, powierzchnia (`km²`) oraz współrzędne centroidów. |
| `Korekty_Geoprzestrzenne_POI.csv` | Precyzyjna Korekta Geokodowania | Ręcznie zweryfikowane współrzędne `WGS84` dla **152 parków, lasów i obiektów pozbawionych numeracji adresowej**. |
| `krakow_districts.geojson` | Poligony Przestrzenne (`WGS84`) | Oficjalne granice wektorowe 18 dzielnic Krakowa (`Polygon` / `MultiPolygon`). |
