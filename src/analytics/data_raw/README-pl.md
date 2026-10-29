> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Surowe Dane Źródłowe (Data Raw)

## Do czego służy ten folder?
W tym katalogu znajdują się **oryginalne, surowe pliki danych** (głównie formaty `.csv` oraz `.geojson`) pobrane bezpośrednio z publicznych rejestrów i portali informacyjnych Miasta Krakowa oraz instytucji państwowych. 

Dane te odzwierciedlają stan faktyczny Krakowa w latach 2023–2026 i stanowią fundament całego projektu **Cracow360**.

---

## Jakie zbiory danych się tu znajdują?
Katalog zawiera oficjalne zbiory danych podzielone tematycznie:
- **Demografia i meldunki**: statystyki mieszkańców zameldowanych na pobyt stały i czasowy (w podziale na wiek i płeć) oraz cudzoziemców (źródło: *Wydział Spraw Administracyjnych UMK*).
- **Edukacja i opieka**: rejestry żłobków miejskich, prywatnych i dotowanych, przedszkoli samorządowych oraz szkół podstawowych z liczbą dzieci i oddziałów (*Wydział Edukacji UMK*).
- **Zieleń i rekreacja**: parki miejskie, parki kieszonkowe, lasy komunalne i rezerwaty przyrody (*Zarząd Zieleni Miejskiej w Krakowie - ZZM*) oraz szkolne przyszkolne obiekty sportowe i baseny.
- **Komunikacja i mobilność**: lokalizacje przystanków komunikacji miejskiej, sieć parkingów Park & Ride (P+R), stojaki rowerowe (*Zarząd Transportu Publicznego - ZTP*) oraz długość dróg dla rowerów.
- **Kultura i seniorzy**: filie Biblioteki Kraków, miejskie domy kultury oraz Centra Aktywności Seniora (CAS).
- **Środowisko i akustyka**: stężenia pyłów zawieszonych PM10/PM2.5, dni smogowe (*GIOŚ / WIOŚ*) oraz poziomy hałasu komunikacyjnego (*MSIP Kraków*).
- **Bezpieczeństwo**: kolizje drogowe, wypadki z udziałem pieszych (*SEWiK Komendy Głównej Policji*) oraz interwencje Straży Miejskiej.
- **Rynek nieruchomości**: średnie ceny transakcyjne i ofertowe za m², stawki najmu oraz wskaźnik dostępności mieszkań za przeciętne wynagrodzenie (*NBP BaRN, Otodom Analytics, MSIP RCN*).

---

## Co i kiedy powinno się tu pojawić?
- Pliki w tym folderze są **danymi wejściowymi**. Oznacza to, że skrypty analityczne jedynie z nich czytają – **żaden skrypt nie nadpisuje ani nie usuwa plików w tym folderze**.
- W przypadku aktualizacji danych miejskich (np. pojawienia się nowych raportów UMK za kolejny rok), wystarczy wrzucić nowe pliki `.csv` do tego folderu i ponownie uruchomić proces analityczny.

---

## Co wywołuje ten folder?
Folder jest odczytywany przez pierwszy skrypt pipeline'u analitycznego:
```bash
python scripts/01_etl_demographics_and_infrastructure.py
```
Skrypt ten czyta powyższe tabele, oczyszcza dane, naprawia polskie znaki, łączy adresy ze współrzędnymi geograficznymi (geokodowanie) i przekazuje wynik do folderu `data_processed/`.
