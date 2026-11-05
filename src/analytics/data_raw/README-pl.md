> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Surowe dane źródłowe (Data Raw)

## Do czego służy ten folder?
Ten katalog zawiera **oryginalne, surowe pliki danych** (głównie w formatach `.csv`) pobrane bezpośrednio z rejestrów publicznych, portali otwartych danych Miasta Krakowa oraz instytucji krajowych.

Zestawy te odzwierciedlają rzeczywisty stan Krakowa w latach 2023–2026, stanowiąc niezmienną warstwę bazową projektu **Cracow360**.

---

## Jakie zestawy danych się tutaj znajdują?
Katalog zawiera ponad 30 oficjalnych zbiorów danych podzielonych tematycznie:
- **Demografia i ewidencja ludności**: Statystyki zameldowanych mieszkańców na pobyt stały i czasowy (w podziale na kohorty wiekowe) oraz cudzoziemców (Źródło: *Wydział Spraw Administracyjnych UMK*).
- **Edukacja i opieka nad dziećmi**: Rejestry żłobków, przedszkoli i szkół podstawowych (samorządowych, prywatnych i dotowanych) wraz z liczbą uczniów i oddziałów (*Wydział Edukacji UMK*).
- **Zieleń i rekreacja**: Parki miejskie, parki kieszonkowe oraz lasy komunalne (*Zarząd Zieleni Miejskiej w Krakowie - ZZM*), a także przyszkolne obiekty sportowe i baseny.
- **Transport i mobilność**: Lokalizacje przystanków komunikacji miejskiej (KMK), parkingi Park & Ride (P+R), stojaki rowerowe (*Zarząd Transportu Publicznego - ZTP*) oraz długości dróg rowerowych.
- **Kultura i seniorzy**: Filie Biblioteki Kraków, miejskie domy i ośrodki kultury oraz Centra Aktywności Seniora (CAS).
- **Dostępność (Kraków bez Barier)**: Wyznaczone miejsca postojowe dla osób z niepełnosprawnościami (Niebieskie Koperty) oraz audyty dostępności architektonicznej obiektów publicznych (*UMK / MFiPR*).
- **Środowisko i jakość powietrza (API + geometria)**: Współrzędne referencyjne dzielnic w `Dzielnice_Krakowa.csv` wykorzystywane przez skrypt `01_etl` do pobierania 90-dniowej telemetrii $\text{PM}_{10}$, $\text{PM}_{2.5}$, $\text{NO}_2$ i dni smogowych z **Open-Meteo Air Quality API (CAMS)**.
- **Bezpieczeństwo**: Statystyki rocznych kolizji drogowych, wypadków z udziałem pieszych i rannych oraz ankietowej oceny bezpieczeństwa w dzielnicach (`Bezpieczenstwo i zdarzenia drogowe w dzielnicach Krakowa 2024-2025.csv` – *SEWiK KGP / Otodom*).
- **Rynek nieruchomości**: Średnie ceny transakcyjne $\text{m}^2$, średnie stawki najmu $\text{m}^2$ oraz dostępność $\text{m}^2$ za średnią pensję netto (`Ceny mieszkan w dzielnicach Krakowa 2025-2026.csv` – *NBP BaRN, Otodom Analytics*).
- **Pliki geoprzestrzenne i konfiguracyjne**: Granice wektorowe 18 dzielnic (`krakow_districts.geojson`), geometria dróg rowerowych (`Drogi_Rowerowe_Krakow.geojson`), `Korekty_Geoprzestrzenne_POI.csv` oraz `Dzielnice_Krakowa.csv`.

---

## Co i kiedy powinno być tutaj umieszczane?
- Pliki w tym katalogu służą wyłącznie jako **dane wejściowe**. Skrypty analityczne jedynie z nich czytają – **żaden skrypt nigdy nie nadpisuje, nie modyfikuje ani nie usuwa plików w tym folderze**.
- W przypadku aktualizacji miejskich zbiorów danych (np. publikacji nowych rocznych raportów o stanie miasta), wystarczy umieścić zaktualizowane pliki `.csv` w tym folderze (dbając o zgodność nazewnictwa ze wzorcami regex w kodzie) i ponownie uruchomić potok analityczny.

---

## Co korzysta z tego folderu?
Ten folder jest odczytywany sekwencyjnie przez główne skrypty ETL potoku analitycznego:
- `01_etl_demographics_and_infrastructure.py` (Bazowa agregacja i geokodowanie GUGiK)
- `03_etl_accessibility_profiles.py` (Miejsca parkingowe PRM i audyty architektoniczne)

Skrypty te przetwarzają surowe tabele, czyszczą dane, korygują problemy z kodowaniem/BOM, wykonują mapowanie przestrzenne Point-in-Polygon i eksportują ustrukturyzowane wyniki do folderu `data_processed/`.