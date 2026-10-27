/// <summary>
/// Official City of Krakow Open Data sources and municipal registries
/// integrated into the Cracow360 analytical pipeline.
/// </summary>

export type MethodologyCategory =
  | 'demographics'
  | 'education'
  | 'transport'
  | 'greenery'
  | 'culture'
  | 'gis_env'
  | 'safety'
  | 'housing';

export interface DataSourceItem {
  id: string;
  category: MethodologyCategory;
  categoryLabel: string;
  officialDatasetName: string;
  metrics: string;
  portalUrl: string;
  status: string;
}

export const ALL_DATA_SOURCES: DataSourceItem[] = [
  // Housing Market & Living Costs
  {
    id: 'house-1',
    category: 'housing',
    categoryLabel: 'Mieszkania & Ceny',
    officialDatasetName: 'Ceny mieszkań i koszty najmu w dzielnicach Krakowa (2025–2026)',
    metrics: 'Średnia cena m² zakupu, rynek wtórny i pierwotny, mediana, koszt najmu m², relacja m² do pensji netto',
    portalUrl: 'https://otodom.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'house-2',
    category: 'housing',
    categoryLabel: 'Mieszkania & Ceny',
    officialDatasetName: 'Baza Cen Nieruchomości BaRN / Rejestr Cen Nieruchomości UMK',
    metrics: 'Kwartalna dynamika transakcyjna cen lokali mieszkalnych w Krakowie',
    portalUrl: 'https://nbp.pl',
    status: 'Rejestr NBP / RCN',
  },

  // Public Safety & Public Peace
  {
    id: 'safe-1',
    category: 'safety',
    categoryLabel: 'Bezpieczeństwo & Ruch',
    officialDatasetName: 'Bezpieczeństwo i zdarzenia drogowe w dzielnicach Krakowa (2024–2025)',
    metrics: 'Roczna liczba kolizji drogowych, wypadki z udziałem pieszych, wypadki z rannymi w podziale na 18 dzielnic',
    portalUrl: 'https://obserwatoriumbrd.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'safe-2',
    category: 'safety',
    categoryLabel: 'Bezpieczeństwo & Ruch',
    officialDatasetName: 'Ewidencja interwencji Straży Miejskiej Miasta Krakowa',
    metrics: 'Łączna liczba interwencji porządkowych, zgłoszenia zakłócania ciszy nocnej i porządku publicznego',
    portalUrl: 'https://strazmiejska.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // GIS & Environment
  {
    id: 'gis-1',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Granice 18 Dzielnic Krakowa (MSIP / PRG GUGiK)',
    metrics: 'Wektorowe granice Polygon/MultiPolygon 18 dzielnic, powierzchnia administracyjna w km²',
    portalUrl: 'https://msip.krakow.pl',
    status: 'Warstwa GIS',
  },
  {
    id: 'gis-2',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Pomiary jakości powietrza i hałas w dzielnicach Krakowa (2024–2025)',
    metrics: 'Średnioroczne stężenia pyłów PM10 i PM2.5, roczna liczba dni smogowych, mapa hałasu drogowego >65 dB',
    portalUrl: 'https://powietrze.gios.gov.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'gis-3',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Uniwersalna Usługa Geokodowania (GUGiK EMUiA / PRG)',
    metrics: 'Państwowy rejestr adresowy posesji w Krakowie, transformacja PUWG 1992 (EPSG:2180) do WGS84 dla 646 placówek edukacyjnych i 115 instytucji',
    portalUrl: 'https://geoportal.gov.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'gis-6',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Europejski System Prognoz Numerycznych ECMWF / Open-Meteo Weather Forecast',
    metrics: 'Real-time temperatura (°C), temperatura odczuwalna, wilgotność względna (%), kody pogodowe WMO, szansa opadów (%), suma deszczu/śniegu (mm/cm), prędkość i kierunek wiatru, prognoza godzinowa 24h',
    portalUrl: 'https://open-meteo.com/en/docs',
    status: 'Transmisja Live API',
  },
  {
    id: 'gis-7',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Copernicus Atmosphere Monitoring Service (CAMS) & GIOŚ / Open-Meteo Air Quality',
    metrics: 'Europejski Indeks Jakości Powietrza (European AQI 0–100), pyły PM10 i PM2.5 (µg/m³), stężenie spalin NO₂ (µg/m³), indeks promieniowania UV, pyłki roślinne (trawy, brzoza, olcha, bylica, ambrozja)',
    portalUrl: 'https://open-meteo.com/en/docs/air-quality-api',
    status: 'Transmisja Live API',
  },

  // Mobility & Transport
  {
    id: 'trans-1',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Przystanki',
    metrics: '1 378 przystanków komunikacji miejskiej (tramwaje i autobusy), gęstość sieci KMK na km²',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-2',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Infrastruktura rowerowa i sieć tras DDR w dzielnicach Krakowa',
    metrics: 'Długość wydzielonych dróg rowerowych DDR, pasów rowerowych i ciągów pieszo-rowerowych w km',
    portalUrl: 'https://ztp.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-3',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Stojaki rowerowe ZTP w Krakowie',
    metrics: 'Infrastruktura rowerowa ZTP, pojemność stojaków rowerowych w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-4',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Parkingi Park & Ride (P+R) w Krakowie',
    metrics: 'System parkingów przesiadkowych P+R zintegrowanych z pętlami tramwajowymi, POI PARK_AND_RIDE',
    portalUrl: 'https://ztp.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-5',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Miejsca postojowe dla osób z niepełnosprawnościami w Krakowie (ZDMK – Niebieskie Koperty)',
    metrics: '862 lokalizacje, 1 709 zastrzeżonych stanowisk postojowych dla pojazdów osób z niepełnosprawnościami w 18 dzielnicach Krakowa',
    portalUrl: 'https://www.bip.krakow.pl/zalaczniki/dokumenty/n/598657/karta',
    status: 'Zintegrowane w ETL',
  },

  // Greenery, Recreation & Sports
  {
    id: 'green-1',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Parki miejskie Krakowa (Zarząd Zieleni Miejskiej ZZM)',
    metrics: 'Wykaz parków miejskich, powierzchnia w ha, geolokalizacja i izochrony dojścia, POI CITY_PARK',
    portalUrl: 'https://zzm.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-2',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Parki kieszonkowe – Ogrody Krakowian (ZZM)',
    metrics: 'Ogrody kieszonkowe ZZM w kwartałach zabudowy, zieleń sąsiedzka, POI POCKET_PARK',
    portalUrl: 'https://zzm.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-3',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Lasy komunalne i uroczyska leśne Krakowa (ZZM)',
    metrics: 'Powierzchnia lasów komunalnych w ha, wskaźnik lesistości i buforów biologicznych na mieszkańca',
    portalUrl: 'https://zzm.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-4',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Tereny sportowe przy szkołach samorządowych',
    metrics: 'Przyszkolna infrastruktura sportowa: boiska wielofunkcyjne, bieżnie, korty',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-5',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Tereny sportowe przy szkołach niesamorządowych',
    metrics: 'Uzupełniająca infrastruktura rekreacyjno-sportowa w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-6',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Przyszkolne pływalnie sportowe i pomieszczenia WF',
    metrics: 'Kryte pływalnie przyszkolne i obiekty sportowe, POI SCHOOL_SPORT',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'gis-4',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'OpenStreetMap & Overpass API – Geometrie Terenów Zielonych',
    metrics: 'Wektorowe poligony parków miejskich, lasów komunalnych i rezerwatów przyrody (leisure=park, landuse=forest), precyzyjne centroidy dla 142 obiektów',
    portalUrl: 'https://www.openstreetmap.org',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'gis-5',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'BIP UMK – Karty Lokalizacyjne i MPZP Ogrodów Krakowian (ZZM)',
    metrics: 'Miejscowe plany zagospodarowania i lokalizacje kwartałowe dla 44 parków kieszonkowych Zarządu Zieleni Miejskiej',
    portalUrl: 'https://bip.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // Culture & Civil Society
  {
    id: 'cult-1',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Centra Aktywności Seniora (CAS) w Krakowie',
    metrics: '53 aktywne Centra Seniora we wszystkich 18 dzielnicach, adresy, operatorzy NGO, POI SENIOR_CENTER',
    portalUrl: 'https://dlaseniora.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-2',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Biblioteka Kraków – Sieć filii dzielnicowych',
    metrics: '56 filii Biblioteki Kraków w 18 dzielnicach, księgozbiory, komputeryzacja, POI LIBRARY',
    portalUrl: 'https://biblioteka.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-3',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Miejskie Domy i Ośrodki Kultury w Krakowie',
    metrics: 'Instytucje kultury, domy kultury, oferta zajęć lokalnych, dotacje podmiotowe',
    portalUrl: 'https://krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-4',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Dostępność architektoniczna obiektów publicznych w Krakowie (UMK / MFiPR)',
    metrics: 'Rejestr 25 budynków UMK i jednostek miejskich z audytem ramp, wind, toalet PRM, pętli indukcyjnych i obsługi tłumacza PJM',
    portalUrl: 'https://www.bip.krakow.pl/?dok_id=139318',
    status: 'Zintegrowane w ETL',
  },

  // Demographics, Vitality & BDK Registries
  {
    id: 'demo-1',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt stały wg dzielnic (BDK)',
    metrics: 'Oficjalna liczba mieszkańców zameldowanych na pobyt stały w 18 dzielnicach (2024–2025)',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-2',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt czasowy wg dzielnic (BDK)',
    metrics: 'Populacja czasowa (studenci, pracownicy relokowani) w podziale na 18 dzielnic',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-3',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Struktura wieku ludności w dzielnicach (BDK)',
    metrics: 'Grupy wieku: 0–3 (żłobkowy), 4–6 (przedszkolny), 7–14 (podstawowy), 15–64 (produkcyjny), 65+ (seniorzy)',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-4',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Liczba dzieci w wieku żłobkowym (0–3 lata) wg dzielnic',
    metrics: 'Kohorta żłobkowa, zapotrzebowanie na opiekę wczesnodziecięcą w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-5',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Liczba dzieci w wieku przedszkolnym (4–6 lat) wg dzielnic',
    metrics: 'Populacja przedszkolna, bilans miejsc przedszkolnych',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-6',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Liczba dzieci w wieku szkolnym (7–14 lat) wg dzielnic',
    metrics: 'Populacja w wieku szkoły podstawowej, obłożenie klas I–VIII',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-7',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Liczba seniorów (65+ lat) wg dzielnic',
    metrics: 'Populacja senioralna, zapotrzebowanie na infrastrukturę opiekuńczą i CAS',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-8',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Cudzoziemcy zameldowani w Krakowie wg dzielnic (BDK)',
    metrics: 'Liczba i odsetek obcokrajowców zameldowanych na pobyt stały w 18 dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // Education & Childcare
  {
    id: 'edu-1',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki samorządowe w Krakowie (UMK)',
    metrics: '34 samorządowe żłobki miejskie, pojemność miejsc, lista oczekujących, POI NURSERY_PUBLIC',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-2',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prowadzone na zlecenie GMK',
    metrics: 'Żłobki niesamorządowe na zlecenie GMK, dotowane miejsca opieki maluchów, POI NURSERY_CONTRACTED',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-3',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prywatne w Krakowie',
    metrics: 'Żłobki prywatne, komercyjna pula miejsc opiekuńczych dla dzieci, POI NURSERY_PRIVATE',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-4',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby dziecięce w Krakowie',
    metrics: 'Kluby dziecięce, alternatywna pula opieki instytucjonalnej 0–3 lata, POI KIDS_CLUB',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-5',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby Rodziców z dziećmi do lat 3 w Krakowie',
    metrics: 'Miejskie Kluby Rodziców z dziećmi do lat 3, punkty integracji i wsparcia rodzinnego, POI PARENT_CLUB',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-6',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – samorządowe (SIO)',
    metrics: 'Wykaz przedszkoli samorządowych, liczba oddziałów, liczba wychowanków, POI KINDERGARTEN',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-7',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – niesamorządowe (SIO)',
    metrics: 'Wykaz przedszkoli niepublicznych, uzupełniająca baza wychowania przedszkolnego',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-8',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – samorządowe (SIO)',
    metrics: 'Samorządowe szkoły podstawowe, liczba klas I–VIII, średnia liczba uczniów w klasie, POI PRIMARY_SCHOOL',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-9',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – niesamorządowe (SIO)',
    metrics: 'Niepubliczne szkoły podstawowe, uzupełniająca baza edukacji wczesnoszkolnej',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
];
