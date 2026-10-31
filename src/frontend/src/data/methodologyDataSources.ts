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
    | 'housing'
    | 'tourism';

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
    officialDatasetName: 'Ceny mieszkań w Krakowie (SonarHome)',
    metrics: 'Średnie ceny ofertowe za 1 m² na rynku wtórnym i pierwotnym w rozbiciu na krakowskie dzielnice',
    portalUrl: 'https://sonarhome.pl/ceny-mieszkan/krakow',
    status: 'Opracowanie własne',
  },

  // Public Safety & Public Peace
  {
    id: 'safe-1',
    category: 'safety',
    categoryLabel: 'Bezpieczeństwo & Ruch',
    officialDatasetName: 'Statystyki zdarzeń drogowych (Krakowskie Obserwatorium BRD)',
    metrics: 'Roczna liczba kolizji, wypadków z udziałem pieszych oraz wypadków z rannymi na poziomie dzielnic',
    portalUrl: 'https://obserwatoriumbrd.pl/statystyki',
    status: 'Opracowanie własne',
  },
  {
    id: 'safe-2',
    category: 'safety',
    categoryLabel: 'Bezpieczeństwo & Ruch',
    officialDatasetName: 'Raporty roczne Straży Miejskiej Miasta Krakowa',
    metrics: 'Liczba interwencji porządkowych ogółem oraz zgłoszeń zakłócania spokoju publicznego',
    portalUrl: 'https://strazmiejska.krakow.pl/strona-glowna/214698,artykul,raporty.html',
    status: 'Opracowanie własne',
  },

  // GIS & Environment
  {
    id: 'gis-1',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Portal Mapowy MSIP - Dzielnice Krakowa',
    metrics: 'Geometrie wektorowe (Polygon/MultiPolygon) administracyjnych granic dzielnic oraz ich powierzchnia',
    portalUrl: 'https://msip3.um.krakow.pl/portal/apps/experiencebuilder/experience/?id=ef04816eeb61416b868f663b014ec5ce',
    status: 'Opracowanie własne',
  },
  {
    id: 'gis-2',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Archiwum Danych Pomiarowych GIOŚ / Airly',
    metrics: 'Uśrednione roczne stężenia pyłów zawieszonych PM10 i PM2.5 oraz szacunkowa liczba dni z przekroczeniem norm',
    portalUrl: 'https://powietrze.gios.gov.pl/pjp/archives',
    status: 'Opracowanie własne',
  },
  {
    id: 'gis-3',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Uniwersalna Usługa Geokodowania (GUGiK)',
    metrics: 'Przekształcanie adresów ulic i kodów pocztowych na współrzędne geograficzne WGS-84 dla obiektów POI',
    portalUrl: 'https://integracja.gugik.gov.pl/uug/',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'gis-6',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Open-Meteo Weather Forecast API',
    metrics: 'Bieżąca temperatura, wilgotność, zjawiska atmosferyczne (WMO), suma opadów i prędkość wiatru',
    portalUrl: 'https://open-meteo.com/en/docs',
    status: 'Transmisja Live API',
  },
  {
    id: 'gis-7',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Open-Meteo Air Quality API',
    metrics: 'Europejski Indeks Jakości Powietrza (AQI), PM10, PM2.5, NO₂, indeks UV oraz stężenie alergenów',
    portalUrl: 'https://open-meteo.com/en/docs/air-quality-api',
    status: 'Transmisja Live API',
  },

  // Mobility & Transport
  {
    id: 'trans-1',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Przystanki',
    metrics: 'Wykaz przystanków tramwajowych i autobusowych, perony kassel-kerb, wskaźniki gęstości sieci transportowej',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/komunikacja-miejska-w-krakowie-kmk',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-2',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Infrastruktura rowerowa i sieć tras DDR w dzielnicach Krakowa',
    metrics: 'Sumaryczna długość wydzielonych dróg dla rowerów (DDR) oraz pasów i ciągów pieszo-rowerowych',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mobilnosc-aktywna-rowery-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-3',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Stojaki rowerowe ZTP w Krakowie',
    metrics: 'Rozmieszczenie i pojemność infrastruktury parkingowej dla rowerów zarządzanej przez ZTP',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mobilnosc-aktywna-rowery-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-4',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Parkingi Park & Ride (P+R) w Krakowie',
    metrics: 'System miejskich parkingów przesiadkowych zintegrowanych z węzłami KMK i pętlami tramwajowymi',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/komunikacja-miejska-w-krakowie-kmk',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-5',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Karta Usługi - Wyznaczanie zastrzeżonych stanowisk postojowych',
    metrics: 'Baza lokalizacji "niebieskich kopert" – dedykowanych miejsc postojowych dla osób z niepełnosprawnościami',
    portalUrl: 'https://www.bip.krakow.pl/zalaczniki/dokumenty/n/598657/karta',
    status: 'Opracowanie własne',
  },

  // Greenery, Recreation & Sports
  {
    id: 'green-1',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Parki miejskie Krakowa',
    metrics: 'Spis parków miejskich, ich powierzchnia w hektarach oraz orientacyjna lokalizacja w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/parki-miejskie-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-2',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Parki kieszonkowe – Ogrody Krakowian',
    metrics: 'Zrewitalizowane zielone skwery sąsiedzkie i parki kieszonkowe zarządzane przez Zarząd Zieleni Miejskiej',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/parki-kieszonkowe-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-3',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Lasy w Krakowie na mapach (ZZM)',
    metrics: 'Wykaz, orientacyjna powierzchnia i zarys granic miejskich lasów komunalnych',
    portalUrl: 'https://zzm.krakow.pl/pl/lasy/lasy-w-krakowie-na-mapach?format=html',
    status: 'Opracowanie własne',
  },
  {
    id: 'green-4',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Infrastruktura sportowa szkół i placówek samorządowych',
    metrics: 'Wielofunkcyjne boiska, bieżnie i przyszkolne obiekty sportowe z dostępem dla społeczności',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-oplacowek-samorzadowych-w-roku-szkolnym-2023-2024',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-5',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Infrastruktura sportowa szkół i placówek niesamorządowych',
    metrics: 'Uzupełniająca, niepubliczna przyszkolna infrastruktura rekreacyjno-sportowa',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-placowek-niesamorzadowych-w-roku-szkolnym-2023-2024',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-6',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Infrastruktura sportowa szkół i placówek samorządowych',
    metrics: 'Kryte pływalnie przyszkolne i zamknięte sale sportowe',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-oplacowek-samorzadowych-w-roku-szkolnym-2023-2024',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'gis-4',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'OpenStreetMap (OSM) via Overpass API',
    metrics: 'Wyodrębnienie dokładnych lokalizacji punktowych (centroidów) terenów zielonych z bazy OSM na podstawie tagów przyrodniczych',
    portalUrl: 'https://overpass-turbo.eu/',
    status: 'Opracowanie własne',
  },
  {
    id: 'gis-5',
    category: 'greenery',
    categoryLabel: 'Zieleń & Rekreacja',
    officialDatasetName: 'Ogrody Krakowian - plany i koncepcje ZZM',
    metrics: 'Miejscowe Plany Zagospodarowania Przestrzennego oraz weryfikacja kwartałów pod budowę parków kieszonkowych',
    portalUrl: 'https://zzm.krakow.pl/dla-krakowian/ogrody/ogrody-krakowian.html',
    status: 'Opracowanie własne',
  },

  // Culture & Civil Society
  {
    id: 'cult-1',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Centra Aktywności Seniora (CAS) w Krakowie',
    metrics: 'Lista zrzeszonych placówek aktywizacji osób 65+, ich lokalizacje oraz operatorzy NGO',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/centra-aktywnosci-seniora-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-2',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Lista filii Biblioteki Kraków',
    metrics: 'Rozmieszczenie dzielnicowych oddziałów bibliotecznych oraz poziom ich komputeryzacji',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/lista-bibliotek-miejskich-biblioteki-krakow',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-3',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Działalność miejskich ośrodków kultury w Krakowie',
    metrics: 'Wykaz instytucji samorządowych, struktura domów kultury oraz przyznane dotacje podmiotowe',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/dzialalnosc-miejskich-osrodkow-kultury-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-4',
    category: 'culture',
    categoryLabel: 'Kultura & Społeczność',
    officialDatasetName: 'Raport o stanie zapewniania dostępności podmiotu publicznego (UMK)',
    metrics: 'Audyt architektoniczny (windy, podjazdy, toalety PRM, pętle indukcyjne, tłumacz PJM) głównych instytucji publicznych i wydziałów',
    portalUrl: 'https://www.bip.krakow.pl/?dok_id=139318',
    status: 'Opracowanie własne',
  },

  // Tourism, Heritage & City Exploration
  {
    id: 'tour-1',
    category: 'tourism',
    categoryLabel: 'Turystyka & Odkrywanie',
    officialDatasetName: 'Ruch turystyczny w Krakowie',
    metrics: 'Całkowita liczba odwiedzających, stosunek turystów krajowych do zagranicznych, wpływ na gospodarkę, kluczowe rynki zbytu',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/ruch-turystyczny-w-krakowie-od-2015-roku',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'tour-2',
    category: 'tourism',
    categoryLabel: 'Turystyka & Odkrywanie',
    officialDatasetName: 'Działalność miejskich muzeów i galerii w Krakowie',
    metrics: 'Lokalizacje miejskich oddziałów muzealnych i instytucji dziedzictwa kulturowego na mapie miasta',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/dzialalnosc-miejskich-muzeow-i-galerii-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'tour-3',
    category: 'tourism',
    categoryLabel: 'Turystyka & Odkrywanie',
    officialDatasetName: 'Portal Zabytek.pl (Narodowy Instytut Dziedzictwa)',
    metrics: 'Nieruchome obiekty historyczne, status UNESCO, fortyfikacje Twierdzy Kraków oraz ocena obciążenia turystycznego (overtourism)',
    portalUrl: 'https://zabytek.pl/pl/obiekty',
    status: 'Opracowanie własne',
  },

  // Demographics, Vitality & BDK Registries
  {
    id: 'demo-1',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt stały',
    metrics: 'Oficjalna baza meldunkowa mieszkańców z przypisaniem do poszczególnych dzielnic oraz roczników urodzenia',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-2',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy',
    metrics: 'Wolumen rotacyjnej populacji czasowej (m.in. studenci, relokowani pracownicy) w poszczególnych kwartałach miasta',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-krakowa-zameldowani-na-pobyt-czasowy',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-3',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Kraków - statystyki demograficzne',
    metrics: 'Makroekonomiczny podział populacji miejskiej na szerokie grupy: przedprodukcyjną, produkcyjną i poprodukcyjną',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/krakow-statystyki-demograficzne',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-4',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt stały (Przeliczenie z rocznika urodzenia)',
    metrics: 'Wyselekcjonowana kohorta żłobkowa (0–3 lata) stanowiąca podstawę do symulacji zapotrzebowania na wczesną opiekę',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-5',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt stały (Przeliczenie z rocznika urodzenia)',
    metrics: 'Wyselekcjonowana populacja wieku przedszkolnego (4–6 lat) kluczowa dla bilansu miejsc edukacyjnych',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-6',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt stały (Przeliczenie z rocznika urodzenia)',
    metrics: 'Baza uczniów klasyfikacji szkół podstawowych (7–14 lat) symulująca presję na infrastrukturę oświatową',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-7',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy zameldowani na pobyt stały (Przeliczenie z rocznika urodzenia)',
    metrics: 'Gęstość populacji senioralnej (65+) warunkująca zapotrzebowanie na placówki aktywizacji NGO i CAS',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-8',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Cudzoziemcy w Krakowie zameldowani na pobyt stały / czasowy',
    metrics: 'Skala imigracji oraz rozkład obcokrajowców na terenie krakowskich dzielnic',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/cudzoziemcy-w-krakowie-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },

  // Education & Childcare
  {
    id: 'edu-1',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki samorządowe w Krakowie',
    metrics: 'Miejskie placówki opiekuńcze 0-3, całkowita pojemność sal, rozkład po jednostkach',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-samorzadowe-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-2',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki niesamorządowe prowadzone na zlecenie Gminy Miejskiej Kraków',
    metrics: 'Placówki niepubliczne z pulą miejsc dotowanych i zakontraktowanych przez magistrat',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-niesamorzadowe-prowadzone-na-zlecenie-gminy-miejskiej-krakow',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-3',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prywatne w Krakowie',
    metrics: 'Uzupełniający, komercyjny sektor opieki nad najmłodszymi prowadzony przez podmioty gospodarcze',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-prywatne-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-4',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby dziecięce w Krakowie',
    metrics: 'Alternatywne do żłobków formy opieki instytucjonalnej dla dzieci do lat 3',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/kluby-dzieciece-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-5',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby Rodziców z dziećmi do lat 3 w Krakowie',
    metrics: 'Otwarte centra spotkań, edukacji oraz integracji wczesnodziecięcej w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/kluby-rodzicow-z-dziecmi-do-lat-3-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-6',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – liczba dzieci (samorządowe)',
    metrics: 'Rejestr publicznych przedszkoli, liczba wychowanków oraz struktura i ilość oddziałów oświatowych',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/przedszkola-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-7',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – liczba dzieci (niesamorządowe)',
    metrics: 'Placówki niepubliczne wspomagające miejski system wychowania na etapie przedszkolnym',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/przedszkola-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-8',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – liczba dzieci (samorządowe)',
    metrics: 'Baza publicznych podstawówek, wskaźniki zagęszczenia (uczniowie na klasę) i pojemność',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/szkoly-podstawowe-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-9',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – liczba dzieci (niesamorządowe)',
    metrics: 'Prywatne i społeczne szkoły podstawowe współtworzące system edukacyjny miasta',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/szkoly-podstawowe-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
];
