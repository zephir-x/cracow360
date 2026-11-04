import type { Language } from '../types';

/// <summary>
/// Granular translations for "Key Indicators & Metrics"
/// across Polish, English, and Ukrainian for all Open Data registry sources.
/// </summary>
export const DATASET_METRICS_I18N: Record<string, Record<Language, string>> = {
  'house-1': {
    pl: 'Średnie ceny ofertowe za 1 m² w rozbiciu na krakowskie dzielnice',
    en: 'Average asking prices per m² broken down by Krakow districts',
    ua: 'Середні ціни пропозиції за квадратний метр, розподілені за районами Кракова',
  },
  'house-2': {
    pl: 'Mediana pełnego kosztu miesięcznego w każdej dzielnicy - nie cena z ogłoszenia, tylko to, co faktycznie płacisz: najem plus czynsz plus media',
    en: 'Median of the total monthly cost in each district – not the price from the listing, but what you actually pay: rent plus service charges plus utilities',
    ua: 'Медіанна повна щомісячна вартість у кожному районі – не рекламована ціна, а те, що ви фактично платите: орендна плата плюс комунальні послуги',
  },
  'safe-1': {
    pl: 'Wyszukiwarka zdarzeń drogowych w danych lokalizacjach Krakowa z podziałem na kategorie (z udziałem pieszych, z udziałem rannych)',
    en: 'A search tool for traffic incidents at specific locations in Kraków, categorized by type (e.g., involving pedestrians, involving injuries)',
    ua: 'Пошукова система дорожньо-транспортних пригод у певних місцях Кракова, розділена на категорії (за участю пішоходів, за участю постраждалих)',
  },
  'safe-2': {
    pl: 'Raport z ankiet Otodom na temat poczucia bezpieczeństwa mieszkańców przeprowadzony na grupie badawczej 120 tys. osób',
    en: 'A report based on Otodom surveys regarding residents sense of safety, conducted with a study group of 120,000 people',
    ua: 'Звіт про опитування Otodom щодо відчуття безпеки мешканців, проведений на дослідницькій групі зі 120 000 осіб',
  },
  'gis-1': {
    pl: 'Wektorowe granice Polygon/MultiPolygon dzielnic, powierzchnia administracyjna w km²',
    en: 'Polygon/MultiPolygon vector boundaries of districts, administrative area in km²',
    ua: 'Векторні межі Polygon/MultiPolygon районів, адміністративна площа в км²',
  },
  'gis-2': {
    pl: 'Państwowy rejestr adresowy posesji w Krakowie, transformacja PUWG 1992 (EPSG:2180) do WGS84 dla placówek edukacyjnych i instytucji',
    en: 'National address register of properties in Krakow, PUWG 1992 (EPSG:2180) to WGS84 transformation for educational facilities and institutions',
    ua: 'Державний адресний реєстр нерухомості у Кракові, трансформація PUWG 1992 (EPSG:2180) у WGS84 для навчальних закладів та установ',
  },
  'gis-5': {
    pl: 'Real-time temperatura (°C), temperatura odczuwalna, wilgotność względna (%), kody pogodowe WMO, szansa opadów (%), suma deszczu/śniegu (mm/cm), prędkość i kierunek wiatru, prognoza godzinowa 24h',
    en: 'Real-time temperature (°C), apparent temperature, relative humidity (%), WMO weather codes, precipitation probability (%), rain/snow volume (mm/cm), wind speed and direction, 24-hour hourly forecast',
    ua: 'Поточна температура (°C), температура за відчуттями, відносна вологість (%), погодні коди WMO, ймовірність опадів (%), обсяг дощу/снігу (мм/см), швидкість і напрямок вітру, 24-годинний погодинний прогноз',
  },
  'gis-6': {
    pl: 'Europejski Indeks Jakości Powietrza (European AQI 0–100), pyły PM10 i PM2.5 (µg/m³), stężenie spalin NO₂ (µg/m³), indeks promieniowania UV, pyłki roślinne (trawy, brzoza, olcha, bylica, ambrozja)',
    en: 'European Air Quality Index (European AQI 0–100), PM10 and PM2.5 particulate matter (µg/m³), NO₂ vehicular exhaust (µg/m³), UV radiation index, botanical pollen allergens (grass, birch, alder, mugwort, ragweed)',
    ua: 'Європейський індекс якості повітря (European AQI 0–100), тверді частки PM10 та PM2.5 (мкг/м³), концентрація вихлопних газів NO₂ (мкг/м³), індекс УФ-випромінювання, пилок рослин (трави, береза, вільха, полин, амброзія)',
  },
  'gis-7': {
    pl: 'Aktualne dzielnice samorządowe Krakowa wraz z powierzchnią',
    en: 'Current municipal districts of Krakow, including their area',
    ua: 'Поточні райони місцевого самоврядування Кракова з їхньою площею',
  },
  'trans-1': {
    pl: 'Przystanki komunikacji miejskiej (tramwaje i autobusy), gęstość sieci KMK na km²',
    en: 'Public transit stops (trams and buses), KMK network density per km²',
    ua: 'Зупинки громадського транспорту (трамваї та автобуси), густота мережі KMK на км²',
  },
  'trans-2': {
    pl: 'Długość wydzielonych dróg rowerowych DDR, pasów rowerowych i ciągów pieszo-rowerowych w km',
    en: 'Length of dedicated bike tracks DDR, bike lanes, and shared pedestrian-cyclist paths in km',
    ua: 'Довжина відокремлених велодоріжок DDR, велосмуг та пішохідно-велосипедних доріжок у км',
  },
  'trans-3': {
    pl: 'Infrastruktura rowerowa ZTP, pojemność stojaków rowerowych w dzielnicach',
    en: 'ZTP bicycle infrastructure, municipal bike racks capacity across districts',
    ua: 'Велоінфраструктура ZTP, місткість велостійок у районах',
  },
  'trans-4': {
    pl: 'System parkingów przesiadkowych P+R zintegrowanych z pętlami tramwajowymi, POI PARK_AND_RIDE',
    en: 'Park & Ride (P+R) transfer parking system integrated with tram terminals, POI PARK_AND_RIDE',
    ua: 'Система перехоплюючих паркінгів P+R, інтегрованих із трамвайними розворотними кільцями, POI PARK_AND_RIDE',
  },
  'trans-5': {
    pl: 'Zastrzeżone stanowiska postojowe dla pojazdów osób z niepełnosprawnościami w dzielnicach Krakowa',
    en: 'Designated accessible parking spaces for vehicles of persons with disabilities across Krakow districts',
    ua: 'Виділені місця для паркування транспортних засобів осіб з інвалідністю у районах Кракова',
  },
  'green-1': {
    pl: 'Wykaz parków miejskich, powierzchnia w ha, geolokalizacja i izochrony dojścia, POI CITY_PARK',
    en: 'Directory of municipal parks, surface area in ha, geolocation, and walking isochrones, POI CITY_PARK',
    ua: 'Перелік міських парків, площа в га, геолокація та ізохрони пішої доступності, POI CITY_PARK',
  },
  'green-2': {
    pl: 'Ogrody kieszonkowe ZZM w kwartałach zabudowy, zieleń sąsiedzka, POI POCKET_PARK',
    en: 'ZZM pocket parks in residential blocks, neighborhood greenery, POI POCKET_PARK',
    ua: 'Кишенькові парки ZZM у житлових кварталах, сусідські зелені зони, POI POCKET_PARK',
  },
  'green-3': {
    pl: 'Wykaz, lokalizacja i powierzchnia lasów komunalnych',
    en: 'Registry, location, and surface area of municipal forests',
    ua: 'Перелік, розташування та площа комунальних лісів',
  },
  'green-4': {
    pl: 'Przyszkolna infrastruktura sportowa: boiska wielofunkcyjne, bieżnie, korty',
    en: 'School sports facilities: multi-purpose pitches, athletic tracks, sports courts',
    ua: 'Пришкільна спортивна інфраструктура: багатофункціональні майданчики, бігові доріжки, корти',
  },
  'green-5': {
    pl: 'Uzupełniająca infrastruktura rekreacyjno-sportowa w dzielnicach',
    en: 'Complementary recreational and athletic facilities across districts',
    ua: 'Додаткова рекреаційно-спортивна інфраструктура в районах',
  },
  'green-6': {
    pl: 'Kryte pływalnie przyszkolne i zamknięte sale sportowe',
    en: 'Indoor school swimming pools and closed sports halls',
    ua: 'Криті пришкільні басейни та закриті спортивні зали',
  },
  'green-7': {
    pl: 'Wymienienie różnorodnych rezerwatów oraz parków Krakowa wraz z powierzchnią',
    en: 'A list of various nature reserves and parks in Kraków, including their surface area',
    ua: 'Перелік різних заповідників та парків у Кракові разом із зазначенням їхньої території',
  },
  'gis-3': {
    pl: 'Wyodrębnienie dokładnych lokalizacji punktowych (centroidów) terenów zielonych z bazy OSM na podstawie tagów przyrodniczych',
    en: 'Extraction of precise point locations (centroids) of green areas from the OSM database based on natural tags',
    ua: 'Виділення точних точкових локацій (центроїдів) зелених зон з бази OSM на основі природних тегів',
  },
  'gis-4': {
    pl: 'Miejscowe Plany Zagospodarowania Przestrzennego oraz weryfikacja kwartałów pod budowę parków kieszonkowych',
    en: 'Local Spatial Development Plans and verification of residential blocks for the construction of pocket parks',
    ua: 'Місцеві плани просторового розвитку та верифікація кварталів для будівництва кишенькових парків',
  },
  'cult-1': {
    pl: 'Lista zrzeszonych placówek aktywizacji osób 65+, ich lokalizacje oraz operatorzy NGO',
    en: 'List of affiliated activation centers for people 65+, their locations, and NGO operators',
    ua: 'Перелік асоційованих центрів активізації для осіб 65+, їх локації та оператори NGO',
  },
  'cult-2': {
    pl: 'Rozmieszczenie dzielnicowych oddziałów bibliotecznych oraz poziom ich komputeryzacji',
    en: 'Distribution of district library branches and their level of computerization',
    ua: 'Розподіл районних філій бібліотек та рівень їх комп’ютеризації',
  },
  'cult-3': {
    pl: 'Wykaz instytucji samorządowych, struktura domów kultury oraz przyznane dotacje podmiotowe',
    en: 'Registry of municipal institutions, structure of cultural centers, and granted institutional subsidies',
    ua: 'Перелік органів місцевого самоврядування, структура будинків культури та надані субсидії',
  },
  'cult-4': {
    pl: 'Dostępność architektoniczna wielu budynków Urzędu Miasta Krakowa dla osób niepełnosprawnych',
    en: 'Architectural accessibility of many Krakow City Hall buildings for persons with disabilities',
    ua: 'Архітектурна доступність багатьох будівель Краківської ратуші для людей з інвалідністю',
  },
  'cult-5': {
    pl: 'Deklaracja oraz dostępność architektoniczna dla osób niepełnosprawnych w różnorodnych budynkach Krakowa',
    en: 'Declaration and architectural accessibility for people with disabilities in various buildings in Kraków',
    ua: 'Декларація та архітектурна доступність для людей з інвалідністю в різних будівлях Кракова',
  },
  'cult-6': {
    pl: 'Rozpiska dostępności architektonicznej dla różnorakich bibliotek oraz filii Krakowa',
    en: 'Overview of architectural accessibility for various libraries and branches in Kraków',
    ua: 'Графік архітектурної доступності для різних бібліотек та філій у Кракові',
  },
  'cult-7': {
    pl: 'Dostępność architektoniczna budynków Krakowskiego Forum Kultury i podległych klubów dla osób z niepełnosprawnością',
    en: 'Architectural accessibility for people with disabilities at the Krakow Culture Forum buildings and its affiliated clubs',
    ua: 'Архітектурна доступність будівель Краківського культурного форуму та підпорядкованих йому клубів для людей з інвалідністю',
  },
  'cult-8': {
    pl: 'Pełna deklaracja dostępności architektonicznej dla siedziby ZZM w Krakowie',
    en: 'Full declaration of architectural accessibility for the ZZM headquarters in Kraków',
    ua: 'Повна декларація архітектурної доступності для штаб-квартири ZZM у Кракові',
  },
  'tour-1': {
    pl: 'Całkowita liczba odwiedzających, stosunek turystów krajowych do zagranicznych, wpływ na gospodarkę, kluczowe rynki zbytu',
    en: 'Total number of visitors, ratio of domestic to foreign tourists, economic impact, key target markets',
    ua: 'Загальна кількість відвідувачів, співвідношення внутрішніх іноземних туристів, економічний вплив, ключові ринки збуту',
  },
  'tour-2': {
    pl: 'Lokalizacje miejskich oddziałów muzealnych i instytucji dziedzictwa kulturowego na mapie miasta',
    en: 'Locations of municipal museum branches and cultural heritage institutions on the city map',
    ua: 'Розташування філій міських музеїв та закладів культурної спадщини на карті міста',
  },
  'tour-3': {
    pl: 'Nieruchome obiekty historyczne, status UNESCO, fortyfikacje Twierdzy Kraków oraz ocena obciążenia turystycznego (overtourism)',
    en: 'Immovable historical objects, UNESCO status, Fortress Krakow fortifications, and tourist burden assessment (overtourism)',
    ua: 'Нерухомі історичні об’єкти, статус ЮНЕСКО, фортифікації Краківської фортеці та оцінка туристичного навантаження (overtourism)',
  },
  'tour-4': {
    pl: 'Badanie ruchu turystycznego w Krakowie 2024 w postaci raportu pełnego zrealizowane przez MOT dla UMK',
    en: 'Study of tourist traffic in Kraków in 2024 – a comprehensive report prepared by the Małopolska Tourism Organization (MOT) for the Municipality of Kraków (UMK)',
    ua: 'Дослідження туристичного потоку в Кракові 2024 року у формі повного звіту, проведене MOT для Муніципалітету Кракова',
  },
  'demo-1': {
    pl: 'Oficjalna baza meldunkowa mieszkańców z przypisaniem do poszczególnych dzielnic oraz roczników urodzenia',
    en: 'Official residential registration database with assignment to specific districts and birth years',
    ua: 'Офіційна база реєстрації мешканців із прив’язкою до окремих районів та років народження',
  },
  'demo-2': {
    pl: 'Wolumen rotacyjnej populacji czasowej (m.in. studenci, relokowani pracownicy) w poszczególnych kwartałach miasta',
    en: 'Volume of the rotational temporary population (e.g., students, relocated workers) across city quarters',
    ua: 'Обсяг ротаційного тимчасового населення (зокрема студенти, релоковані працівники) в окремих кварталах міста',
  },
  'demo-3': {
    pl: 'Makroekonomiczny podział populacji miejskiej na szerokie grupy: przedprodukcyjną, produkcyjną i poprodukcyjną',
    en: 'Macroeconomic breakdown of the urban population into broad groups: pre-working, working, and post-working age',
    ua: 'Макроекономічний розподіл міського населення на широкі групи: допрацездатний, працездатний і післяпрацездатний вік',
  },
  'demo-4': {
    pl: 'Wyselekcjonowana kohorta żłobkowa (0–3 lata) stanowiąca podstawę do symulacji zapotrzebowania na wczesną opiekę',
    en: 'Selected nursery cohort (0-3 years) forming the basis for simulating early childcare demand',
    ua: 'Вибрана ясельна когорта (0–3 роки), що є основою для моделювання попиту на ранній догляд',
  },
  'demo-5': {
    pl: 'Wyselekcjonowana populacja wieku przedszkolnego (4–6 lat) kluczowa dla bilansu miejsc edukacyjnych',
    en: 'Selected preschool-age population (4-6 years) crucial for the balance of educational places',
    ua: 'Вибране населення дошкільного віку (4–6 років), що є ключовим для балансу освітніх місць',
  },
  'demo-6': {
    pl: 'Baza uczniów klasyfikacji szkół podstawowych (7–14 lat) symulująca presję na infrastrukturę oświatową',
    en: 'Base of primary school students (7-14 years) simulating pressure on educational infrastructure',
    ua: 'База учнів початкової школи (7–14 років), що моделює навантаження на освітню інфраструктуру',
  },
  'demo-7': {
    pl: 'Gęstość populacji senioralnej (65+) warunkująca zapotrzebowanie na placówki aktywizacji NGO i CAS',
    en: 'Density of the senior population (65+) determining the demand for NGO and CAS activation centers',
    ua: 'Щільність сеньйорського населення (65+), що визначає попит на центри активізації NGO та CAS',
  },
  'demo-8': {
    pl: 'Skala imigracji oraz rozkład obcokrajowców na terenie krakowskich dzielnic',
    en: 'Scale of immigration and distribution of foreigners across Krakow districts',
    ua: 'Масштаб імміграції та розподіл іноземців по районах Кракова',
  },
  'edu-1': {
    pl: 'Miejskie placówki opiekuńcze 0-3, całkowita pojemność sal, rozkład po jednostkach',
    en: 'Municipal childcare facilities 0-3, total room capacity, distribution across units',
    ua: 'Міські заклади опіки 0-3, загальна місткість кімнат, розподіл по одиницях',
  },
  'edu-2': {
    pl: 'Placówki niepubliczne z pulą miejsc dotowanych i zakontraktowanych przez magistrat',
    en: 'Non-public facilities with a pool of subsidized places contracted by the municipality',
    ua: 'Недержавні заклади з фондом субсидованих місць, законтрактованих муніципалітетом',
  },
  'edu-3': {
    pl: 'Uzupełniający, komercyjny sektor opieki nad najmłodszymi prowadzony przez podmioty gospodarcze',
    en: 'Complementary, commercial childcare sector for the youngest run by economic entities',
    ua: 'Додатковий, комерційний сектор догляду за найменшими, керований суб’єктами господарювання',
  },
  'edu-4': {
    pl: 'Alternatywne do żłobków formy opieki instytucjonalnej dla dzieci do lat 3',
    en: 'Alternative to nurseries forms of institutional care for children under 3 years old',
    ua: 'Альтернативні яслам форми інституційного догляду за дітьми до 3 років',
  },
  'edu-5': {
    pl: 'Otwarte centra spotkań, edukacji oraz integracji wczesnodziecięcej w dzielnicach',
    en: 'Open centers for meetings, education, and early childhood integration in districts',
    ua: 'Відкриті центри зустрічей, освіти та ранньої дитячої інтеграції в районах',
  },
  'edu-6': {
    pl: 'Rejestr publicznych przedszkoli, liczba wychowanków oraz struktura i ilość oddziałów oświatowych',
    en: 'Registry of public kindergartens, number of pupils, and structure and quantity of educational departments',
    ua: 'Реєстр державних дитсадків, кількість вихованців, структура та кількість освітніх відділів',
  },
  'edu-7': {
    pl: 'Placówki niepubliczne wspomagające miejski system wychowania na etapie przedszkolnym',
    en: 'Non-public facilities supporting the municipal education system at the preschool level',
    ua: 'Недержавні заклади, що підтримують міську систему виховання на дошкільному рівні',
  },
  'edu-8': {
    pl: 'Baza publicznych podstawówek, wskaźniki zagęszczenia (uczniowie na klasę) i pojemność',
    en: 'Base of public primary schools, density indicators (students per class), and capacity',
    ua: 'База державних початкових шкіл, показники щільності (учні на клас) та місткість',
  },
  'edu-9': {
    pl: 'Prywatne i społeczne szkoły podstawowe współtworzące system edukacyjny miasta',
    en: 'Private and social primary schools co-creating the city’s educational system',
    ua: 'Приватні та громадські початкові школи, що співтворять освітню систему міста',
  },
};

/// <summary>
/// Retrieves the localized metrics description for a given dataset ID.
/// </summary>
export function getLocalizedDatasetMetrics(id: string, fallback: string, language: Language): string {
  const item = DATASET_METRICS_I18N[id];
  if (!item) return fallback;
  return item[language] || item.pl || fallback;
}
