import type { CurrentAirQualityDto } from '../../types/contracts';
import type { Language } from '../types';

export interface LocalizedHealthAdviceItem {
  level: 'safe' | 'moderate' | 'warning' | 'danger';
  shortLabel: string;
  message: string;
}

export interface LocalizedHealthRecommendations {
  uv: LocalizedHealthAdviceItem;
  outdoorSport: LocalizedHealthAdviceItem;
  trafficExhaust: LocalizedHealthAdviceItem;
  allergens: LocalizedHealthAdviceItem;
  sensitiveGroups: LocalizedHealthAdviceItem;
}

export type AtmosphereRecommendationsText = LocalizedHealthRecommendations;

export const ATMOSPHERE_I18N = {
  pl: {
    barBadge: 'Na żywo',
    barTitle: 'Warunki atmosferyczne i jakość powietrza',
    expandPrompt: 'Szczegóły',
    collapsePrompt: 'Zwiń',
    refreshButton: 'Odśwież',
    refreshing: 'Pobieranie...',
    cityWide: 'Kraków (Śródmieście)',
    districtPrefix: 'Dzielnica',
    measuredAt: 'Pomiar',
    cachedUntil: 'Ważność danych',
    justNow: 'przed chwilą',
    minutesAgo: 'min temu',
    tempCurrent: 'Temperatura',
    tempApparent: 'Odczuwalna',
    humidity: 'Wilgotność',
    wind: 'Wiatr',
    rainProbability: 'Szansa opadów',
    snowfall: 'Śnieg',
    airQuality: 'Jakość powietrza',
    aqiLabel: 'Europejski Indeks EAQI',
    pm10: 'Pył PM10',
    pm25: 'Pył PM2.5',
    no2: 'Spaliny NO₂',
    uvIndex: 'Indeks UV',
    uvLow: 'Niskie',
    uvModerate: 'Umiarkowane',
    uvHigh: 'Wysokie',
    uvVeryHigh: 'B. wysokie',
    pollenTitle: 'Pyłki roślinne i alergeny',
    grassPollen: 'Trawy',
    birchPollen: 'Brzoza',
    alderPollen: 'Olcha',
    mugwortPollen: 'Bylica',
    ragweedPollen: 'Ambrozja',
    pollenLow: 'Niskie stężenie wszystkich alergenów',
    grainsPerM3: 'z./m³',
    ugM3: 'µg/m³',
    forecast24hTitle: 'Rozkład temperatury\ni opadów w ciągu doby',
    forecastTempLabel: 'Temperatura (°C)',
    forecastRainLabel: 'Szansa opadów (%)',
    forecastWindLabel: 'Wiatr (km/h)',
    guidelinesTitle: 'Zalecenia zdrowotne i wytyczne miejskie',
    guidelineUv: 'Słońce & UV',
    guidelineSport: 'Sport na zewnątrz',
    guidelineTraffic: 'Ruch & Spaliny',
    guidelineAllergens: 'Alergie roślinne',
    guidelineSensitive: 'Grupy wrażliwe i dzieci',
    dataSource: 'Oficjalne źródła: Open-Meteo European Forecast & CAMS / Stacje GIOŚ Kraków',
    statusSafe: 'Bezpiecznie',
    statusModerate: 'Umiarkowanie',
    statusWarning: 'Ostrzeżenie',
    statusDanger: 'Alarm',
    offlineBadge: 'Bufor lokalny',
    offlineNotice: 'Brak bezpośredniego połączenia z API. Wyświetlam ostatni zweryfikowany stan.',
    retryButton: 'Ponów próbę',
    whoNormsTitle: 'Poziomy stężeń vs wytyczne dobowe WHO',
    whoNormLabel: 'normy WHO',
    cloudCover: 'Zachmurzenie',
    windDirection: 'Kierunek wiatru',
    eaqiScaleTitle: 'Europejska skala jakości powietrza (EAQI)',
    minTemp24h: 'Min. 24h',
    maxTemp24h: 'Maks. 24h',
    totalRain24h: 'Suma opadów 24h',
    maxWind24h: 'Maks. wiatr 24h',
    dryDayNotice: 'Dzień bezdeszczowy (0%)',
    thermalComfortTitle: 'Dynamika wiatru i komfort termiczny',
    biometGood: 'Warunki biometeo korzystne',
    biometNeutral: 'Warunki biometeo umiarkowane',
    biometBad: 'Warunki biometeo obciążające',
    currentLevelMarker: 'Aktualny poziom',
  },
  en: {
    barBadge: 'Live',
    barTitle: 'Atmospheric Conditions & Air Quality',
    expandPrompt: 'Details',
    collapsePrompt: 'Collapse',
    refreshButton: 'Refresh',
    refreshing: 'Updating...',
    cityWide: 'Krakow (City Center)',
    districtPrefix: 'District',
    measuredAt: 'Measured',
    cachedUntil: 'Valid until',
    justNow: 'just now',
    minutesAgo: 'min ago',
    tempCurrent: 'Temperature',
    tempApparent: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    rainProbability: 'Precipitation chance',
    snowfall: 'Snowfall',
    airQuality: 'Air Quality',
    aqiLabel: 'European AQI Index',
    pm10: 'Particulate PM10',
    pm25: 'Particulate PM2.5',
    no2: 'Exhaust NO₂',
    uvIndex: 'UV Index',
    uvLow: 'Low',
    uvModerate: 'Moderate',
    uvHigh: 'High',
    uvVeryHigh: 'Very high',
    pollenTitle: 'Botanical Pollen & Allergens',
    grassPollen: 'Grass',
    birchPollen: 'Birch',
    alderPollen: 'Alder',
    mugwortPollen: 'Mugwort',
    ragweedPollen: 'Ragweed',
    pollenLow: 'Low concentration of all allergens',
    grainsPerM3: 'gr/m³',
    ugM3: 'µg/m³',
    forecast24hTitle: 'Temperature and precipitation\ndistribution throughout the day',
    forecastTempLabel: 'Temperature (°C)',
    forecastRainLabel: 'Rain chance (%)',
    forecastWindLabel: 'Wind (km/h)',
    guidelinesTitle: 'Health Recommendations & Civic Guidelines',
    guidelineUv: 'Sun & UV',
    guidelineSport: 'Outdoor Sport',
    guidelineTraffic: 'Traffic & Exhaust',
    guidelineAllergens: 'Pollen Allergens',
    guidelineSensitive: 'Sensitive Groups & Children',
    dataSource: 'Official data: Open-Meteo European Forecast & CAMS / GIOS Krakow Stations',
    statusSafe: 'Safe',
    statusModerate: 'Moderate',
    statusWarning: 'Warning',
    statusDanger: 'Danger',
    offlineBadge: 'Local Cache',
    offlineNotice: 'No direct API response. Displaying the latest verified telemetry.',
    retryButton: 'Retry',
    whoNormsTitle: 'Concentration vs WHO 24h Guidelines',
    whoNormLabel: 'of WHO limit',
    cloudCover: 'Cloud cover',
    windDirection: 'Wind direction',
    eaqiScaleTitle: 'European Air Quality Index Scale (EAQI)',
    minTemp24h: '24h Min',
    maxTemp24h: '24h Max',
    totalRain24h: '24h Total Rain',
    maxWind24h: '24h Max Wind',
    dryDayNotice: 'Dry day (0%)',
    thermalComfortTitle: 'Wind Dynamics & Thermal Comfort',
    biometGood: 'Favorable biomet conditions',
    biometNeutral: 'Neutral biomet conditions',
    biometBad: 'Challenging biomet conditions',
    currentLevelMarker: 'Current level',
  },
  ua: {
    barBadge: 'Наживо',
    barTitle: 'Погодні умови та якість повітря',
    expandPrompt: 'Деталі',
    collapsePrompt: 'Згорнути',
    refreshButton: 'Оновити',
    refreshing: 'Оновлення...',
    cityWide: 'Краків (Центр)',
    districtPrefix: 'Район',
    measuredAt: 'Виміряно',
    cachedUntil: 'Дійсно до',
    justNow: 'щойно',
    minutesAgo: 'хв тому',
    tempCurrent: 'Температура',
    tempApparent: 'Відчувається як',
    humidity: 'Вологість',
    wind: 'Вітер',
    rainProbability: 'Ймовірність опадів',
    snowfall: 'Снігопад',
    airQuality: 'Якість повітря',
    aqiLabel: 'Європейський індекс EAQI',
    pm10: 'Пил PM10',
    pm25: 'Дрібний пил PM2.5',
    no2: 'Вихлопні гази NO₂',
    uvIndex: 'УФ-індекс',
    uvLow: 'Низький',
    uvModerate: 'Помірний',
    uvHigh: 'Високий',
    uvVeryHigh: 'Дуже високий',
    pollenTitle: 'Пилок рослин та алергени',
    grassPollen: 'Трави',
    birchPollen: 'Береза',
    alderPollen: 'Вільха',
    mugwortPollen: 'Полин',
    ragweedPollen: 'Амброзія',
    pollenLow: 'Низька концентрація всіх алергенів',
    grainsPerM3: 'з./м³',
    ugM3: 'мкг/м³',
    forecast24hTitle: 'Розподіл температури\nта опадів протягом доби',
    forecastTempLabel: 'Температура (°C)',
    forecastRainLabel: 'Ймовірність дощу (%)',
    forecastWindLabel: 'Вітер (км/год)',
    guidelinesTitle: 'Медичні рекомендації та міські вказівки',
    guidelineUv: 'Сонце та УФ',
    guidelineSport: 'Спорт на вулиці',
    guidelineTraffic: 'Трафік і вихлопи',
    guidelineAllergens: 'Рослинні алергени',
    guidelineSensitive: 'Вразливі групи та діти',
    dataSource: 'Офіційні джерела: Open-Meteo European Forecast & CAMS / Станції GIOŚ Краків',
    statusSafe: 'Безпечно',
    statusModerate: 'Помірно',
    statusWarning: 'Попередження',
    statusDanger: 'Небезпека',
    offlineBadge: 'Локальний буфер',
    offlineNotice: 'Немає прямого зв’язку з API. Відображаються останні перевірені дані.',
    retryButton: 'Повторити',
    whoNormsTitle: 'Рівні концентрацій проти норм ВООЗ',
    whoNormLabel: 'норми ВООЗ',
    cloudCover: 'Хмарність',
    windDirection: 'Напрямок вітру',
    eaqiScaleTitle: 'Європейська шкала якості повітря (EAQI)',
    minTemp24h: 'Мін. 24г',
    maxTemp24h: 'Макс. 24г',
    totalRain24h: 'Сума опадів 24г',
    maxWind24h: 'Макс. вітер 24г',
    dryDayNotice: 'День без дощу (0%)',
    thermalComfortTitle: 'Динаміка вітру та термічний комфорт',
    biometGood: 'Сприятливі біомет умови',
    biometNeutral: 'Нейтральні біомет умови',
    biometBad: 'Несприятливі біомет умови',
    currentLevelMarker: 'Поточний рівень',
  },
};

export type AtmosphereText = typeof ATMOSPHERE_I18N.pl;

export const WEATHER_CODE_LOCALIZATION: Record<number, Record<Language, string>> = {
  0: { pl: 'Bezchmurnie', en: 'Clear sky', ua: 'Ясно' },
  1: { pl: 'Głównie bezchmurnie', en: 'Mainly clear', ua: 'Переважно ясно' },
  2: { pl: 'Częściowe zachmurzenie', en: 'Partly cloudy', ua: 'Мінлива хмарність' },
  3: { pl: 'Pochmurno', en: 'Overcast', ua: 'Хмарно' },
  45: { pl: 'Mgła', en: 'Fog', ua: 'Туман' },
  48: { pl: 'Szadź i mgła', en: 'Rime fog', ua: 'Паморозь' },
  51: { pl: 'Lekka mżawka', en: 'Light drizzle', ua: 'Легка мряка' },
  53: { pl: 'Umiarkowana mżawka', en: 'Moderate drizzle', ua: 'Помірна мряка' },
  55: { pl: 'Gęsta mżawka', en: 'Dense drizzle', ua: 'Густа мряка' },
  56: { pl: 'Marznąca mżawka', en: 'Freezing drizzle', ua: 'Крижана мряка' },
  57: { pl: 'Marznąca mżawka', en: 'Freezing drizzle', ua: 'Крижана мряка' },
  61: { pl: 'Słaby deszcz', en: 'Slight rain', ua: 'Невеликий дощ' },
  63: { pl: 'Umiarkowany deszcz', en: 'Moderate rain', ua: 'Помірний дощ' },
  65: { pl: 'Intensywny deszcz', en: 'Heavy rain', ua: 'Сильний дощ' },
  66: { pl: 'Marznący deszcz', en: 'Freezing rain', ua: 'Крижаний дощ' },
  67: { pl: 'Marznący deszcz', en: 'Freezing rain', ua: 'Крижаний дощ' },
  71: { pl: 'Słaby śnieg', en: 'Slight snowfall', ua: 'Невеликий сніг' },
  73: { pl: 'Umiarkowany śnieg', en: 'Moderate snowfall', ua: 'Помірний сніг' },
  75: { pl: 'Intensywny śnieg', en: 'Heavy snowfall', ua: 'Сильний снігопад' },
  77: { pl: 'Ziarna śniegu', en: 'Snow grains', ua: 'Снігові зерна' },
  80: { pl: 'Lekki przelotny deszcz', en: 'Slight rain showers', ua: 'Короткочасний дощ' },
  81: { pl: 'Przelotny deszcz', en: 'Rain showers', ua: 'Злива' },
  82: { pl: 'Gwałtowny deszcz', en: 'Violent rain showers', ua: 'Сильна злива' },
  85: { pl: 'Przelotny śnieg', en: 'Snow showers', ua: 'Короткочасний сніг' },
  86: { pl: 'Intensywny przelotny śnieg', en: 'Heavy snow showers', ua: 'Сильний снігопад' },
  95: { pl: 'Burza', en: 'Thunderstorm', ua: 'Гроза' },
  96: { pl: 'Burza z lekkim gradem', en: 'Thunderstorm with hail', ua: 'Гроза з градом' },
  99: { pl: 'Burza z silnym gradem', en: 'Heavy thunderstorm with hail', ua: 'Сильна гроза з градом' },
};

export const AQI_LEVEL_LOCALIZATION: Record<string, Record<Language, string>> = {
  'Bardzo dobry': { pl: 'Bardzo dobry', en: 'Very good', ua: 'Дуже добрий' },
  'Dobry': { pl: 'Dobry', en: 'Good', ua: 'Добрий' },
  'Umiarkowany': { pl: 'Umiarkowany', en: 'Moderate', ua: 'Помірний' },
  'Dostateczny': { pl: 'Dostateczny', en: 'Sufficient', ua: 'Задовільний' },
  'Zły': { pl: 'Zły', en: 'Bad', ua: 'Поганий' },
  'Bardzo zły': { pl: 'Bardzo zły', en: 'Very bad', ua: 'Дуже поганий' },
};

export function getLocalizedWeatherLabel(code: number, fallback: string, language: Language): string {
  const item = WEATHER_CODE_LOCALIZATION[code];
  if (!item) return fallback;
  return item[language] || item.pl || fallback;
}

export function getLocalizedAqiLabel(levelName: string, language: Language): string {
  const item = AQI_LEVEL_LOCALIZATION[levelName];
  if (!item) return levelName;
  return item[language] || item.pl || levelName;
}

export function getLocalizedUvTag(uv: number, language: Language): string {
  const text = ATMOSPHERE_I18N[language] || ATMOSPHERE_I18N.pl;
  if (uv <= 2) return text.uvLow;
  if (uv <= 5) return text.uvModerate;
  if (uv <= 8) return text.uvHigh;
  return text.uvVeryHigh;
}

/// <summary>
/// Fully localizes the 5 health guideline cards (pill labels and text messages)
/// across Polish, English, and Ukrainian based on real air quality and UV telemetry.
/// </summary>
export function getLocalizedHealthRecommendations(
  air: CurrentAirQualityDto,
  language: Language
): LocalizedHealthRecommendations {
  const { uvIndex: uv, europeanAqi: aqi, pm25UgM3: pm25, nitrogenDioxideUgM3: no2, pollen } = air;

  // 1. UV Exposure
  let uvItem: LocalizedHealthAdviceItem;
  if (uv <= 2) {
    uvItem = {
      level: 'safe',
      shortLabel: language === 'en' ? 'Low UV' : language === 'ua' ? 'Низький УФ' : 'Niskie UV',
      message:
        language === 'en'
          ? `Low UV index (${uv.toFixed(1)}). Sun protection not required.`
          : language === 'ua'
          ? `Низьке УФ-випромінювання (${uv.toFixed(1)}). Захист від сонця не потрібен.`
          : `Niskie promieniowanie UV (${uv.toFixed(1)}). Ochrona przeciwsłoneczna niewymagana.`,
    };
  } else if (uv <= 5) {
    uvItem = {
      level: 'moderate',
      shortLabel: language === 'en' ? 'Moderate UV' : language === 'ua' ? 'Помірний УФ' : 'Umiarkowane UV',
      message:
        language === 'en'
          ? `Moderate UV index (${uv.toFixed(1)}). SPF 30+ sunscreen and sunglasses recommended.`
          : language === 'ua'
          ? `Помірне УФ-випромінювання (${uv.toFixed(1)}). Рекомендовано крем SPF 30+ та окуляри.`
          : `Umiarkowane UV (${uv.toFixed(1)}). Zalecany krem z filtrem SPF 30+ i okulary przeciwsłoneczne.`,
    };
  } else {
    uvItem = {
      level: 'warning',
      shortLabel: language === 'en' ? 'High UV!' : language === 'ua' ? 'Високий УФ!' : 'Wysokie UV!',
      message:
        language === 'en'
          ? `High UV index (${uv.toFixed(1)})! Avoid direct midday sun (11:00-15:00), apply SPF 50+.`
          : language === 'ua'
          ? `Високий рівень УФ (${uv.toFixed(1)})! Уникайте сонця з 11:00 до 15:00, крем SPF 50+.`
          : `Wysokie promieniowanie UV (${uv.toFixed(1)})! Unikaj ekspozycji w godz. 11:00-15:00, filtr SPF 50+.`,
    };
  }

  // 2. Outdoor Sport
  let sportItem: LocalizedHealthAdviceItem;
  if (aqi <= 20) {
    sportItem = {
      level: 'safe',
      shortLabel: language === 'en' ? 'Ideal conditions' : language === 'ua' ? 'Ідеальні умови' : 'Idealne warunki',
      message:
        language === 'en'
          ? 'Very clean air! Perfect conditions for running, cycling, and outdoor workouts.'
          : language === 'ua'
          ? 'Дуже чисте повітря! Чудовий час для бігу, велопрогулянок та тренувань на свіжому повітрі.'
          : 'Bardzo czyste powietrze! Świetny czas na bieganie, rower i trening na zewnątrz.',
    };
  } else if (aqi <= 40) {
    sportItem = {
      level: 'safe',
      shortLabel: language === 'en' ? 'Good conditions' : language === 'ua' ? 'Добрі умови' : 'Dobre warunki',
      message:
        language === 'en'
          ? 'Good air quality. Safe and pleasant for sports and outdoor recreation.'
          : language === 'ua'
          ? 'Добра якість повітря. Можна безперешкодно тренуватися та гуляти на свіжому повітрі.'
          : 'Dobra jakość powietrza. Można bez przeszkód trenować i spacerować na zewnątrz.',
    };
  } else if (aqi <= 60) {
    sportItem = {
      level: 'moderate',
      shortLabel: language === 'en' ? 'Moderate' : language === 'ua' ? 'Помірні умови' : 'Umiarkowane',
      message:
        language === 'en'
          ? 'Moderate air quality. Consider reducing very intense cardio outdoor sessions.'
          : language === 'ua'
          ? 'Помірна якість повітря. Бажано зменшити інтенсивність важких кардіотренувань.'
          : 'Powietrze umiarkowane. Zalecane zmniejszenie intensywności bardzo ciężkiego cardio.',
    };
  } else if (aqi <= 80) {
    sportItem = {
      level: 'warning',
      shortLabel: language === 'en' ? 'Poor quality' : language === 'ua' ? 'Погана якість' : 'Zła jakość',
      message:
        language === 'en'
          ? 'Unfavorable air quality! Avoid strenuous outdoor sports; limit exposure.'
          : language === 'ua'
          ? 'Несприятлива якість повітря! Утримайтесь від інтенсивного спорту на вулиці.'
          : 'Niekorzystna jakość powietrza! Zrezygnuj z intensywnego sportu na zewnątrz.',
    };
  } else {
    sportItem = {
      level: 'danger',
      shortLabel: language === 'en' ? 'Hazardous!' : language === 'ua' ? 'Небезпечно!' : 'Niebezpieczne!',
      message:
        language === 'en'
          ? 'Smog hazard! Refrain from outdoor physical activity and keep windows closed.'
          : language === 'ua'
          ? 'Загроза смогу! Уникайте фізичних навантажень на вулиці та зачиніть вікна.'
          : 'Zagrożenie smogowe! Zrezygnuj z aktywności fizycznej na zewnątrz, zamknij okna.',
    };
  }

  // 3. Traffic Exhaust NO2
  let trafficItem: LocalizedHealthAdviceItem;
  if (no2 <= 25) {
    trafficItem = {
      level: 'safe',
      shortLabel: language === 'en' ? 'Low exhaust' : language === 'ua' ? 'Низькі вихлопи' : 'Niskie spaliny',
      message:
        language === 'en'
          ? `Low concentration of vehicular exhaust NO₂ (${no2.toFixed(1)} µg/m³).`
          : language === 'ua'
          ? `Низька концентрація автомобільних вихлопів NO₂ (${no2.toFixed(1)} мкг/м³).`
          : `Niskie stężenie spalin samochodowych NO₂ (${no2.toFixed(1)} µg/m³).`,
    };
  } else if (no2 <= 45) {
    trafficItem = {
      level: 'moderate',
      shortLabel: language === 'en' ? 'Moderate traffic' : language === 'ua' ? 'Помірний трафік' : 'Umiarkowany ruch',
      message:
        language === 'en'
          ? `Moderate street traffic and NO₂ exhaust concentration (${no2.toFixed(1)} µg/m³).`
          : language === 'ua'
          ? `Помірний вуличний рух та концентрація вихлопів NO₂ (${no2.toFixed(1)} мкг/м³).`
          : `Umiarkowany ruch uliczny i stężenie spalin NO₂ (${no2.toFixed(1)} µg/m³).`,
    };
  } else {
    trafficItem = {
      level: 'warning',
      shortLabel: language === 'en' ? 'High exhaust!' : language === 'ua' ? 'Високі вихлопи!' : 'Wysokie spaliny!',
      message:
        language === 'en'
          ? `Elevated vehicular NO₂ exhaust (${no2.toFixed(1)} µg/m³)! Avoid walking along major arteries.`
          : language === 'ua'
          ? `Підвищений рівень вихлопів NO₂ (${no2.toFixed(1)} мкг/м³)! Уникайте прогулянок біля магістралей.`
          : `Wysokie stężenie spalin NO₂ (${no2.toFixed(1)} µg/m³)! Unikaj spacerów wzdłuż głównych arterii.`,
    };
  }

  // 4. Botanical Allergens
  const activePlants: string[] = [];
  if (pollen.grassPollen > 5) {
    activePlants.push(language === 'en' ? `Grass (${pollen.grassPollen.toFixed(0)})` : language === 'ua' ? `Трави (${pollen.grassPollen.toFixed(0)})` : `Trawy (${pollen.grassPollen.toFixed(0)})`);
  }
  if (pollen.birchPollen > 5) {
    activePlants.push(language === 'en' ? `Birch (${pollen.birchPollen.toFixed(0)})` : language === 'ua' ? `Береза (${pollen.birchPollen.toFixed(0)})` : `Brzoza (${pollen.birchPollen.toFixed(0)})`);
  }
  if (pollen.alderPollen > 5) {
    activePlants.push(language === 'en' ? `Alder (${pollen.alderPollen.toFixed(0)})` : language === 'ua' ? `Вільха (${pollen.alderPollen.toFixed(0)})` : `Olcha (${pollen.alderPollen.toFixed(0)})`);
  }
  if (pollen.mugwortPollen > 5) {
    activePlants.push(language === 'en' ? `Mugwort (${pollen.mugwortPollen.toFixed(0)})` : language === 'ua' ? `Полин (${pollen.mugwortPollen.toFixed(0)})` : `Bylica (${pollen.mugwortPollen.toFixed(0)})`);
  }
  if (pollen.ragweedPollen > 5) {
    activePlants.push(language === 'en' ? `Ragweed (${pollen.ragweedPollen.toFixed(0)})` : language === 'ua' ? `Амброзія (${pollen.ragweedPollen.toFixed(0)})` : `Ambrozja (${pollen.ragweedPollen.toFixed(0)})`);
  }

  let allergenItem: LocalizedHealthAdviceItem;
  if (activePlants.length > 0) {
    allergenItem = {
      level: 'warning',
      shortLabel: language === 'en' ? 'Active pollen' : language === 'ua' ? 'Активний пилок' : 'Aktywne pyłki',
      message:
        language === 'en'
          ? `Elevated pollen concentrations detected: ${activePlants.join(', ')}. Take medication before heading out.`
          : language === 'ua'
          ? `Виявлено підвищену концентрацію пилку: ${activePlants.join(', ')}. Прийміть препарати перед виходом.`
          : `Wykryto podwyższone stężenie pyłków: ${activePlants.join(', ')}. Alergicy powinni przyjąć leki przed wyjściem.`,
    };
  } else {
    allergenItem = {
      level: 'safe',
      shortLabel: language === 'en' ? 'Low pollen' : language === 'ua' ? 'Низький пилок' : 'Niskie pyłki',
      message:
        language === 'en'
          ? 'Low concentration of botanical pollens. Favorable conditions for allergy sufferers.'
          : language === 'ua'
          ? 'Низька концентрація рослинного пилку. Сприятливі умови для алергіків.'
          : 'Niskie stężenie pyłków roślinnych. Korzystne warunki dla alergików.',
    };
  }

  // 5. Sensitive Groups (Children, Seniors, Asthmatics)
  const healthIssues: string[] = [];
  if (aqi > 40 || pm25 > 15) {
    healthIssues.push(language === 'en' ? `Smog PM2.5: ${pm25.toFixed(1)}` : language === 'ua' ? `Смог PM2.5: ${pm25.toFixed(1)}` : `Smog PM2.5: ${pm25.toFixed(1)}`);
  }
  if (no2 > 30) {
    healthIssues.push(language === 'en' ? `NO₂ exhaust: ${no2.toFixed(1)}` : language === 'ua' ? `Вихлопи NO₂: ${no2.toFixed(1)}` : `Spaliny NO₂: ${no2.toFixed(1)}`);
  }
  if (activePlants.length > 0) {
    healthIssues.push(language === 'en' ? `${activePlants.length} active pollens` : language === 'ua' ? `${activePlants.length} видів пилку` : `${activePlants.length} aktywne alergeny`);
  }

  let sensitiveItem: LocalizedHealthAdviceItem;
  if (healthIssues.length > 0) {
    sensitiveItem = {
      level: 'warning',
      shortLabel: language === 'en' ? 'Caution advised' : language === 'ua' ? 'Обережно' : 'Zalecana ostrożność',
      message:
        language === 'en'
          ? `Advisory for children, seniors, and asthmatics: ${healthIssues.join(' • ')}. Limit prolonged outdoor stays.`
          : language === 'ua'
          ? `Застереження для дітей, людей похилого віку та астматиків: ${healthIssues.join(' • ')}. Обмежте час надворі.`
          : `Ostrzeżenie dla dzieci, seniorów i astmatyków: ${healthIssues.join(' • ')}. Zalecane ograniczenie dłuższego przebywania na zewnątrz.`,
    };
  } else {
    sensitiveItem = {
      level: 'safe',
      shortLabel: language === 'en' ? 'Safe' : language === 'ua' ? 'Безпечно' : 'Bezpiecznie',
      message:
        language === 'en'
          ? 'Conditions are fully safe for children, seniors, asthmatics, and expectant mothers.'
          : language === 'ua'
          ? 'Умови повністю безпечні для дітей, людей похилого віку, астматиків та вагітних жінок.'
          : 'Warunki w pełni bezpieczne dla dzieci, seniorów, astmatyków i kobiet w ciąży.',
    };
  }

  return {
    uv: uvItem,
    outdoorSport: sportItem,
    trafficExhaust: trafficItem,
    allergens: allergenItem,
    sensitiveGroups: sensitiveItem,
  };
}
