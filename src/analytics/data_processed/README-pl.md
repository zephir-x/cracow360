> 🌐 **Documentation in two languages / Dokumentacja w dwóch językach:** [<img src="https://flagcdn.com/20x15/gb.png" alt="English" width="20" height="15" /> English](README.md) | [<img src="https://flagcdn.com/20x15/pl.png" alt="Polski" width="20" height="15" /> Polski](README-pl.md)

# Przetworzone Dane Pośrednie (Data Processed)

## Do czego służy ten folder?
Ten katalog pełni rolę **bufora roboczego** pomiędzy poszczególnymi etapami obliczeń w Pythonie. Przechowywane są w nim pliki tymczasowe, które powstały po oczyszczeniu i zintegrowaniu surowych danych, ale przed wygenerowaniem ostatecznych kontraktów systemowych.

Dzięki temu każdy etap analizy można uruchamiać niezależnie, a w razie potrzeby łatwo podejrzeć i skontrolować wyniki pośrednie.

---

## Co i po wywołaniu czego się tu pojawia?

### 1. `districts_aggregated.json`
- **Po czym powstaje?** Po uruchomieniu skryptu:
  ```bash
  python scripts/01_etl_demographics_and_infrastructure.py
  ```
- **Co zawiera?** Zagregowane, twarde liczby dla każdej z 18 dzielnic Krakowa:
  - dokładną liczbę mieszkańców według grup wiekowych (0–3, 4–6, 7–14, 15–64, 65+),
  - liczbę cudzoziemców i zameldowanych czasowo,
  - liczbę miejsc w żłobkach i przedszkolach oraz średnią liczebność klas szkolnych,
  - łączną powierzchnię parków i lasów w hektarach oraz wskaźniki m² zieleni na mieszkańca,
  - infrastrukturę rowerową (długość DDR, liczba stojaków) i przystanki komunikacji miejskiej,
  - statystyki bezpieczeństwa, środowiska i cen mieszkań.

---

### 2. `districts_scored.json`
- **Po czym powstaje?** Po uruchomieniu skryptu:
  ```bash
  python scripts/04_calculate_quality_scores.py
  ```
- **Co zawiera?** Wszystkie dane z poprzedniego pliku uzupełnione o **7 znormalizowanych wskaźników jakości życia (skala 0–100 pkt)**:
  1. `mobilityScore` – Komunikacja i transport,
  2. `educationScore` – Edukacja i opieka nad dziećmi,
  3. `greeneryScore` – Tereny zielone i rekreacja,
  4. `cultureAndSeniorScore` – Kultura i oferta dla seniorów,
  5. `environmentScore` – Czystość powietrza i spokój akustyczny,
  6. `safetyScore` – Bezpieczeństwo i spokój publiczny,
  7. `housingAffordabilityScore` – Dostępność cenowa mieszkań.

---

## Co dzieje się dalej z tymi plikami?
Pliki z tego folderu są odczytywane przez kolejny skrypt:
```bash
python scripts/05_econometric_forecasts.py
```
który wylicza prognozy demograficzne na 2028 rok, generuje wykresy analityczne oraz zapisuje ostateczny plik główny w katalogu `data/contracts/`.
