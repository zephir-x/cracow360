import type { Language } from './types';

/// <summary>
/// Granular translations for "Key Indicators & Metrics"
/// across Polish, English, and Ukrainian for all Open Data registry sources.
/// </summary>
export const DATASET_METRICS_I18N: Record<string, Record<Language, string>> = {
  'house-1': {
    pl: 'Średnia cena m² zakupu, rynek wtórny i pierwotny, mediana, koszt najmu m², relacja m² do pensji netto',
    en: 'Average purchase price per m², primary and secondary market, median, rental rate per m², m² affordability relative to net salary',
    ua: 'Середня ціна купівлі за м², первинний і вторинний ринок, медіана, вартість оренди за м², доступність м² до чистої зарплати',
  },
  'house-2': {
    pl: 'Kwartalna dynamika transakcyjna cen lokali mieszkalnych w Krakowie',
    en: 'Quarterly transaction price dynamics of residential premises in Krakow',
    ua: 'Квартальна динаміка транзакційних цін на житлову нерухомість у Кракові',
  },
  'safe-1': {
    pl: 'Roczna liczba kolizji drogowych, wypadki z udziałem pieszych, wypadki z rannymi w podziale na dzielnice',
    en: 'Annual road traffic collisions, pedestrian-involved accidents, injury accidents across districts',
    ua: 'Річна кількість ДТП, аварії за участю пішоходів, ДТП із постраждалими у розрізі районів',
  },
  'safe-2': {
    pl: 'Łączna liczba interwencji porządkowych, zgłoszenia zakłócania ciszy nocnej i porządku publicznego',
    en: 'Total public order interventions, nocturnal noise complaints, and public disturbance reports',
    ua: 'Загальна кількість викликів щодо порушення порядку, скарги на порушення нічного спокою та громадського порядку',
  },
  'gis-1': {
    pl: 'Wektorowe granice Polygon/MultiPolygon dzielnic, powierzchnia administracyjna w km²',
    en: 'Polygon/MultiPolygon vector boundaries of districts, administrative area in km²',
    ua: 'Векторні межі Polygon/MultiPolygon районів, адміністративна площа в км²',
  },
  'gis-2': {
    pl: 'Średnioroczne stężenia pyłów PM10 i PM2.5, roczna liczba dni smogowych, mapa hałasu drogowego >65 dB',
    en: 'Annual mean PM10 and PM2.5 concentrations, annual smog days count, road traffic noise map >65 dB',
    ua: 'Середньорічні концентрації пилу PM10 і PM2.5, річна кількість днів зі смогом, карта дорожнього шуму >65 дБ',
  },
  'gis-3': {
    pl: 'Państwowy rejestr adresowy posesji w Krakowie, transformacja PUWG 1992 (EPSG:2180) do WGS84 dla placówek edukacyjnych i instytucji',
    en: 'National address register of properties in Krakow, PUWG 1992 (EPSG:2180) to WGS84 transformation for educational facilities and institutions',
    ua: 'Державний адресний реєстр садиб у Кракові, трансформація PUWG 1992 (EPSG:2180) у WGS84 для навчальних закладів та установ',
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
    pl: 'Powierzchnia lasów komunalnych w ha, wskaźnik lesistości i buforów biologicznych na mieszkańca',
    en: 'Municipal forest area in ha, forest coverage ratio, and biological buffer zones per resident',
    ua: 'Площа комунальних лісів у га, показник лісистості та біологічних буферів на мешканця',
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
    pl: 'Kryte pływalnie przyszkolne i obiekty sportowe, POI SCHOOL_SPORT',
    en: 'Indoor school swimming pools and athletic centers, POI SCHOOL_SPORT',
    ua: 'Криті пришкільні басейни та спортивні комплекси, POI SCHOOL_SPORT',
  },
  'gis-4': {
    pl: 'Wektorowe poligony parków miejskich, lasów komunalnych i rezerwatów przyrody (leisure=park, landuse=forest), precyzyjne centroidy dla obiektów',
    en: 'Vector polygons of municipal parks, community forests, and nature reserves (leisure=park, landuse=forest), precise centroids for green assets',
    ua: 'Векторні полігони міських парків, комунальних лісів та природних заповідників (leisure=park, landuse=forest), точні центроїди для об’єктів',
  },
  'gis-5': {
    pl: 'Miejscowe plany zagospodarowania i lokalizacje kwartałowe dla parków kieszonkowych Zarządu Zieleni Miejskiej',
    en: 'Local zoning plans and residential block locations for pocket parks managed by the Municipal Greenery Board',
    ua: 'Місцеві плани просторового планування та квартальні локації для кишенькових парків Управління міських зелених насаджень',
  },
  'cult-1': {
    pl: 'Aktywne Centra Seniora we wszystkich dzielnicach, adresy, operatorzy NGO, POI SENIOR_CENTER',
    en: 'Active Senior Activity Centers (CAS) across all districts, addresses, NGO operators, POI SENIOR_CENTER',
    ua: 'Активні Центри Сеньйорів (CAS) у всіх районах, адреси, оператори NGO, POI SENIOR_CENTER',
  },
  'cult-2': {
    pl: 'Filie Biblioteki Kraków w dzielnicach, księgozbiory, komputeryzacja, POI LIBRARY',
    en: 'Krakow Public Library branches across districts, book collections, workstations, POI LIBRARY',
    ua: 'Філії Бібліотеки Кракова у районах, книжкові фонди, комп’ютеризація, POI LIBRARY',
  },
  'cult-3': {
    pl: 'Instytucje kultury, domy kultury, oferta zajęć lokalnych, dotacje podmiotowe',
    en: 'Cultural institutions, community centers, local cultural events, operational subsidies',
    ua: 'Заклади культури, будинки культури, місцеві гуртки та події, статутні дотації',
  },
  'demo-1': {
    pl: 'Oficjalna liczba mieszkańców zameldowanych na pobyt stały w dzielnicach (2024–2025)',
    en: 'Official permanent registered resident counts across districts (2024–2025)',
    ua: 'Офіційна чисельність постійно зареєстрованих мешканців у районах (2024–2025)',
  },
  'demo-2': {
    pl: 'Populacja czasowa (studenci, pracownicy relokowani) w podziale na dzielnice',
    en: 'Temporary resident population (students, relocated professionals) across districts',
    ua: 'Тимчасове населення (студенти, релоковані фахівці) у розрізі районів',
  },
  'demo-3': {
    pl: 'Grupy wieku: 0–3 (żłobkowy), 4–6 (przedszkolny), 7–14 (podstawowy), 15–64 (produkcyjny), 65+ (seniorzy)',
    en: 'Age cohorts: 0–3 (nursery), 4–6 (kindergarten), 7–14 (primary), 15–64 (working age), 65+ (seniors)',
    ua: 'Вікові когорти: 0–3 (ясла), 4–6 (дитсадки), 7–14 (початкова школа), 15–64 (працездатні), 65+ (сеньйори)',
  },
  'demo-4': {
    pl: 'Kohorta żłobkowa, zapotrzebowanie na opiekę wczesnodziecięcą w dzielnicach',
    en: 'Nursery cohort, early childhood childcare demand across districts',
    ua: 'Ясельна когорта, попит на ранній догляд за дітьми в районах',
  },
  'demo-5': {
    pl: 'Populacja przedszkolna, bilans miejsc przedszkolnych',
    en: 'Preschool population, preschool places availability balance',
    ua: 'Дошкільне населення, баланс місць у дитячих садках',
  },
  'demo-6': {
    pl: 'Populacja w wieku szkoły podstawowej, obłożenie klas I–VIII',
    en: 'Primary school age population, grades I–VIII classroom capacity',
    ua: 'Населення віку початкової школи, заповнюваність класів I–VIII',
  },
  'demo-7': {
    pl: 'Populacja senioralna, zapotrzebowanie na infrastrukturę opiekuńczą i CAS',
    en: 'Senior population, demand for care infrastructure and CAS centers',
    ua: 'Сеньйорське населення, потреба в інфраструктурі догляду та центрах CAS',
  },
  'demo-8': {
    pl: 'Liczba i odsetek obcokrajowców zameldowanych na pobyt stały w dzielnicach',
    en: 'Count and percentage of foreign citizens registered permanently in districts',
    ua: 'Кількість і частка іноземців, зареєстрованих на постійне проживання у районах',
  },
  'edu-1': {
    pl: 'Samorządowe żłobki miejskie, pojemność miejsc, lista oczekujących, POI NURSERY_PUBLIC',
    en: 'Municipal public nurseries, spot capacity, waiting lists, POI NURSERY_PUBLIC',
    ua: 'Муніципальні комунальні ясла, місткість, списки очікування, POI NURSERY_PUBLIC',
  },
  'edu-2': {
    pl: 'Żłobki niesamorządowe na zlecenie GMK, dotowane miejsca opieki maluchów, POI NURSERY_CONTRACTED',
    en: 'Subsidized city-contracted nurseries, municipal toddler childcare places, POI NURSERY_CONTRACTED',
    ua: 'Некомунальні ясла на замовлення міста, субсидовані місця догляду за малюками, POI NURSERY_CONTRACTED',
  },
  'edu-3': {
    pl: 'Żłobki prywatne, komercyjna pula miejsc opiekuńczych dla dzieci, POI NURSERY_PRIVATE',
    en: 'Private nurseries, commercial childcare capacity for children, POI NURSERY_PRIVATE',
    ua: 'Приватні ясла, комерційний фонд місць догляду за дітьми, POI NURSERY_PRIVATE',
  },
  'edu-4': {
    pl: 'Kluby dziecięce, alternatywna pula opieki instytucjonalnej 0–3 lata, POI KIDS_CLUB',
    en: 'Children clubs, alternative institutional childcare 0–3 years, POI KIDS_CLUB',
    ua: 'Дитячі клуби, альтернативна інституційна опіка для дітей 0–3 років, POI KIDS_CLUB',
  },
  'edu-5': {
    pl: 'Miejskie Kluby Rodziców z dziećmi do lat 3, punkty integracji i wsparcia rodzinnego, POI PARENT_CLUB',
    en: 'Municipal Parent Clubs with children up to age 3, family integration & support hubs, POI PARENT_CLUB',
    ua: 'Міські Клуби Батьків із дітьми до 3 років, центри сімейної інтеграції та підтримки, POI PARENT_CLUB',
  },
  'edu-6': {
    pl: 'Wykaz przedszkoli samorządowych, liczba oddziałów, liczba wychowanków, POI KINDERGARTEN',
    en: 'Directory of municipal kindergartens, class sections count, enrolled children, POI KINDERGARTEN',
    ua: 'Реєстр комунальних дитсадків, кількість груп, кількість вихованців, POI KINDERGARTEN',
  },
  'edu-7': {
    pl: 'Wykaz przedszkoli niepublicznych, uzupełniająca baza wychowania przedszkolnego',
    en: 'Directory of private kindergartens, complementary preschool education registry',
    ua: 'Реєстр приватних дитсадків, додаткова база дошкільної освіти',
  },
  'edu-8': {
    pl: 'Samorządowe szkoły podstawowe, liczba klas I–VIII, średnia liczba uczniów w klasie, POI PRIMARY_SCHOOL',
    en: 'Municipal primary schools, grades I–VIII count, average class size, POI PRIMARY_SCHOOL',
    ua: 'Комунальні початкові школи, кількість класів I–VIII, середня наповнюваність класів, POI PRIMARY_SCHOOL',
  },
  'edu-9': {
    pl: 'Niepubliczne szkoły podstawowe, uzupełniająca baza edukacji wczesnoszkolnej',
    en: 'Private primary schools, complementary early-education registry',
    ua: 'Приватні початкові школи, додаткова база початкової освіти',
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
