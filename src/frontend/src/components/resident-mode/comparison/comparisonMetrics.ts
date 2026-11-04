import type { DistrictDetailsDto } from '../../../types/contracts';
import type { PluralForms } from '../../../utils/pluralization';
import type { Language, TranslationDictionary } from '../../../i18n/types';

export interface MetricRowDef {
  categoryKey: keyof TranslationDictionary['comparison']['categories'];
  metricKey: string;
  defaultCategory: string;
  defaultLabel: string;
  unit: string;
  pluralMap?: Record<Language, PluralForms>;
  firstValue: number;
  secondValue: number;
  higherIsBetter: boolean;
  format?: (val: number, lang: Language) => string;
}

/// <summary>
/// Synthesizes data-driven comparative resident strengths for the district card across 8 pillars.
/// </summary>
export function getResidentStrengths(
  current: DistrictDetailsDto,
  opponent: DistrictDetailsDto,
  t: TranslationDictionary,
  language: Language
): string {
  const PILLARS: { key: keyof typeof current.scores; label: string }[] = [
    { key: 'mobilityScore', label: t.comparison.radarAxes.mobility },
    { key: 'educationScore', label: t.comparison.radarAxes.education },
    { key: 'greeneryScore', label: t.comparison.radarAxes.greenery },
    { key: 'cultureAndSeniorScore', label: t.comparison.radarAxes.culture },
    { key: 'environmentScore', label: t.comparison.radarAxes.environment },
    { key: 'safetyScore', label: t.comparison.radarAxes.safety },
    { key: 'housingAffordabilityScore', label: t.comparison.radarAxes.housing },
    { key: 'demographicVitalityScore', label: t.comparison.radarAxes.demographics },
  ];

  // Calculate comparative deltas (current - opponent)
  const deltas = PILLARS.map((p) => ({
    label: p.label,
    score: current.scores[p.key],
    delta: current.scores[p.key] - opponent.scores[p.key],
  }));

  // Categories where current has a distinct comparative edge (>= 3.0 pts)
  const advantages = deltas
    .filter((d) => d.delta >= 3.0)
    .sort((a, b) => b.delta - a.delta);

  const pts = t.common.points;

  if (advantages.length >= 2) {
    const [top1, top2] = advantages;
    if (language === 'en') {
      return `Distinct advantage in: ${top1.label} (+${top1.delta.toFixed(1)} ${pts}) and ${top2.label} (+${top2.delta.toFixed(1)} ${pts}).`;
    }
    if (language === 'ua') {
      return `Помітна перевага в категоріях: ${top1.label} (+${top1.delta.toFixed(1)} ${pts}) та ${top2.label} (+${top2.delta.toFixed(1)} ${pts}).`;
    }
    return `Wyraźna przewaga w kategoriach: ${top1.label} (+${top1.delta.toFixed(1)} ${pts}) oraz ${top2.label} (+${top2.delta.toFixed(1)} ${pts}).`;
  }

  if (advantages.length === 1) {
    const top1 = advantages[0];
    if (language === 'en') {
      return `Key comparative strength: ${top1.label} (+${top1.delta.toFixed(1)} ${pts} vs opposing district).`;
    }
    if (language === 'ua') {
      return `Ключова перевага в порівнянні: ${top1.label} (+${top1.delta.toFixed(1)} ${pts} проти іншого району).`;
    }
    return `Kluczowy atut w zestawieniu: ${top1.label} (+${top1.delta.toFixed(1)} ${pts} względem drugiej dzielnicy).`;
  }

  // If both districts are very close, highlight top absolute scoring categories
  const topAbsolute = [...deltas].sort((a, b) => b.score - a.score);
  if (language === 'en') {
    return `Balanced civic profile: top ranked are ${topAbsolute[0].label} (${topAbsolute[0].score.toFixed(1)} ${pts}) and ${topAbsolute[1].label} (${topAbsolute[1].score.toFixed(1)} ${pts}).`;
  }
  if (language === 'ua') {
    return `Збалансований міський профіль: найвищі оцінки мають ${topAbsolute[0].label} (${topAbsolute[0].score.toFixed(1)} ${pts}) та ${topAbsolute[1].label} (${topAbsolute[1].score.toFixed(1)} ${pts}).`;
  }
  return `Zrównoważony profil miejski: najwyżej oceniane to ${topAbsolute[0].label} (${topAbsolute[0].score.toFixed(1)} ${pts}) oraz ${topAbsolute[1].label} (${topAbsolute[1].score.toFixed(1)} ${pts}).`;
}

/// <summary>
/// Constructs the comprehensive comparative metric rows (32 indicators across 8 pillars)
/// with multi-lingual grammatical plural forms and numeric formatting.
/// </summary>
export function buildComparisonMetricRows(
  firstDetails: DistrictDetailsDto,
  secondDetails: DistrictDetailsDto,
  language: Language,
  pointsUnit: string
): MetricRowDef[] {
  const currency = language === 'pl' ? 'zł/m²' : 'PLN/m²';
  const numLocale = language === 'ua' ? 'uk-UA' : language === 'en' ? 'en-US' : 'pl-PL';

  return [
    {
      categoryKey: 'demographics',
      metricKey: 'demographicVitalityScore',
      defaultCategory: 'Demografia',
      defaultLabel: 'Wskaźnik witalności demograficznej i rozwoju',
      unit: pointsUnit,
      firstValue: firstDetails.scores.demographicVitalityScore ?? 0,
      secondValue: secondDetails.scores.demographicVitalityScore ?? 0,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} ${pointsUnit}`,
    },
    {
      categoryKey: 'demographics',
      metricKey: 'totalPopulation',
      defaultCategory: 'Demografia',
      defaultLabel: 'Liczba mieszkańców ogółem',
      unit: 'os.',
      pluralMap: {
        pl: ['mieszkaniec', 'mieszkańcy', 'mieszkańców'],
        en: ['resident', 'residents', 'residents'],
        ua: ['мешканець', 'мешканці', 'мешканців'],
      },
      firstValue: firstDetails.demographics.totalPopulation,
      secondValue: secondDetails.demographics.totalPopulation,
      higherIsBetter: true,
    },
    {
      categoryKey: 'demographics',
      metricKey: 'populationGrowthRate3YrPct',
      defaultCategory: 'Demografia',
      defaultLabel: 'Dynamika populacji (ostatnie 3 lata)',
      unit: '%',
      firstValue: firstDetails.demographics.populationGrowthRate3YrPct,
      secondValue: secondDetails.demographics.populationGrowthRate3YrPct,
      higherIsBetter: true,
      format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
    },
    {
      categoryKey: 'demographics',
      metricKey: 'age15To64',
      defaultCategory: 'Demografia',
      defaultLabel: 'Mieszkańcy w wieku produkcyjnym (15–64 lata)',
      unit: 'os.',
      pluralMap: {
        pl: ['osoba', 'osoby', 'osób'],
        en: ['person', 'people', 'people'],
        ua: ['особа', 'особи', 'осіб'],
      },
      firstValue: firstDetails.demographics.age15To64,
      secondValue: secondDetails.demographics.age15To64,
      higherIsBetter: true,
    },
    {
      categoryKey: 'demographics',
      metricKey: 'foreignersTotal',
      defaultCategory: 'Demografia',
      defaultLabel: 'Cudzoziemcy zameldowani w dzielnicy',
      unit: 'os.',
      pluralMap: {
        pl: ['cudzoziemiec', 'cudzoziemcy', 'cudzoziemców'],
        en: ['foreigner', 'foreigners', 'foreigners'],
        ua: ['іноземець', 'іноземці', 'іноземців'],
      },
      firstValue: firstDetails.demographics.foreignersTotal,
      secondValue: secondDetails.demographics.foreignersTotal,
      higherIsBetter: true,
    },
    {
      categoryKey: 'housing',
      metricKey: 'avgPricePerM2',
      defaultCategory: 'Rynek Mieszkaniowy',
      defaultLabel: 'Średnia cena zakupu mieszkania za m²',
      unit: currency,
      firstValue: firstDetails.housingMarket?.avgPricePerM2 ?? 0,
      secondValue: secondDetails.housingMarket?.avgPricePerM2 ?? 0,
      higherIsBetter: false,
      format: (v) => `${v.toLocaleString(numLocale)} ${currency}`,
    },
    {
      categoryKey: 'housing',
      metricKey: 'avgRentalPriceM2',
      defaultCategory: 'Rynek Mieszkaniowy',
      defaultLabel: 'Średnia miesięczna stawka najmu za m²',
      unit: currency,
      firstValue: firstDetails.housingMarket?.avgRentalPriceM2 ?? 0,
      secondValue: secondDetails.housingMarket?.avgRentalPriceM2 ?? 0,
      higherIsBetter: false,
      format: (v) => `${v.toFixed(1)} ${currency}`,
    },
    {
      categoryKey: 'housing',
      metricKey: 'm2PerAverageSalary',
      defaultCategory: 'Rynek Mieszkaniowy',
      defaultLabel: 'Dostępność m² za średnie wynagrodzenie netto',
      unit: 'm²',
      firstValue: firstDetails.housingMarket?.m2PerAverageSalary ?? 0,
      secondValue: secondDetails.housingMarket?.m2PerAverageSalary ?? 0,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(2)} m²`,
    },
    {
      categoryKey: 'safety',
      metricKey: 'roadCollisionsAnnual',
      defaultCategory: 'Bezpieczeństwo',
      defaultLabel: 'Roczna liczba kolizji drogowych',
      unit: 'kol.',
      pluralMap: {
        pl: ['kolizja', 'kolizje', 'kolizji'],
        en: ['collision', 'collisions', 'collisions'],
        ua: ['зіткнення', 'зіткнення', 'зіткнень'],
      },
      firstValue: firstDetails.publicSafety?.roadCollisionsAnnual ?? 0,
      secondValue: secondDetails.publicSafety?.roadCollisionsAnnual ?? 0,
      higherIsBetter: false,
    },
    {
      categoryKey: 'safety',
      metricKey: 'pedestrianAccidents',
      defaultCategory: 'Bezpieczeństwo',
      defaultLabel: 'Wypadki drogowe z udziałem pieszych',
      unit: 'wyp.',
      pluralMap: {
        pl: ['wypadek', 'wypadki', 'wypadków'],
        en: ['accident', 'accidents', 'accidents'],
        ua: ['випадок', 'випадки', 'випадків'],
      },
      firstValue: firstDetails.publicSafety?.pedestrianAccidents ?? 0,
      secondValue: secondDetails.publicSafety?.pedestrianAccidents ?? 0,
      higherIsBetter: false,
    },
    {
      categoryKey: 'safety',
      metricKey: 'safetyRatingSurvey',
      defaultCategory: 'Bezpieczeństwo',
      defaultLabel: 'Ocena bezpieczeństwa mieszkańców',
      unit: pointsUnit,
      firstValue: firstDetails.publicSafety?.safetyRatingSurvey ?? 0,
      secondValue: secondDetails.publicSafety?.safetyRatingSurvey ?? 0,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(2)} ${pointsUnit}`,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'tramStopsCount',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Przystanki tramwajowe (szkielet szynowy)',
      unit: 'przyst.',
      pluralMap: {
        pl: ['przystanek', 'przystanki', 'przystanków'],
        en: ['tram stop', 'tram stops', 'tram stops'],
        ua: ['зупинка', 'зупинки', 'зупинок'],
      },
      firstValue: firstDetails.mobilityAndTransport.tramStopsCount ?? 0,
      secondValue: secondDetails.mobilityAndTransport.tramStopsCount ?? 0,
      higherIsBetter: true,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'tramNetworkSharePct',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Udział tramwajów w sieci przystankowej',
      unit: '%',
      firstValue: firstDetails.mobilityAndTransport.tramNetworkSharePct ?? 0,
      secondValue: secondDetails.mobilityAndTransport.tramNetworkSharePct ?? 0,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)}%`,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'scheduleBoardsCount',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Gabloty i ramki rozkładowe (oferta linii)',
      unit: 'ram.',
      pluralMap: {
        pl: ['ramka', 'ramki', 'ramek'],
        en: ['timetable frame', 'timetable frames', 'timetable frames'],
        ua: ['стенд', 'стенди', 'стендів'],
      },
      firstValue: firstDetails.mobilityAndTransport.scheduleBoardsCount ?? 0,
      secondValue: secondDetails.mobilityAndTransport.scheduleBoardsCount ?? 0,
      higherIsBetter: true,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'kmkStopsCount',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Łączna liczba przystanków KMK (sieć ogółem)',
      unit: 'przyst.',
      pluralMap: {
        pl: ['przystanek KMK', 'przystanki KMK', 'przystanków KMK'],
        en: ['transit stop', 'transit stops', 'transit stops'],
        ua: ['зупинка KMK', 'зупинки KMK', 'зупинок KMK'],
      },
      firstValue: firstDetails.mobilityAndTransport.kmkStopsCount,
      secondValue: secondDetails.mobilityAndTransport.kmkStopsCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'isochroneCoveragePct',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Efektywna dostępność piesza KMK (izochrona 500 m)',
      unit: '%',
      firstValue: firstDetails.mobilityAndTransport.isochroneCoveragePct,
      secondValue: secondDetails.mobilityAndTransport.isochroneCoveragePct,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)}%`,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'bikeLanesLengthKm',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Długość sieci dróg rowerowych (DDR i pasy)',
      unit: 'km',
      firstValue: firstDetails.mobilityAndTransport.bikeLanesLengthKm,
      secondValue: secondDetails.mobilityAndTransport.bikeLanesLengthKm,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} km`,
    },
    {
      categoryKey: 'mobility',
      metricKey: 'bikeRacksCount',
      defaultCategory: 'Mobilność',
      defaultLabel: 'Stojaki rowerowe ZTP (pojemność)',
      unit: 'stoj.',
      pluralMap: {
        pl: ['stojak', 'stojaki', 'stojaków'],
        en: ['bike rack', 'bike racks', 'bike racks'],
        ua: ['велостійка', 'велостійки', 'велостійок'],
      },
      firstValue: firstDetails.mobilityAndTransport.bikeRacksCount,
      secondValue: secondDetails.mobilityAndTransport.bikeRacksCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'greenery',
      metricKey: 'totalGreenM2PerCapita',
      defaultCategory: 'Zieleń i Sport',
      defaultLabel: 'Powierzchnia zieleni biologicznej na mieszkańca',
      unit: 'm²/os.',
      firstValue: firstDetails.greeneryAndSport.totalGreenM2PerCapita || firstDetails.greeneryAndSport.greenAreaM2PerCapita,
      secondValue: secondDetails.greeneryAndSport.totalGreenM2PerCapita || secondDetails.greeneryAndSport.greenAreaM2PerCapita,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} m²`,
    },
    {
      categoryKey: 'greenery',
      metricKey: 'forestAreaHa',
      defaultCategory: 'Zieleń i Sport',
      defaultLabel: 'Lasy komunalne i uroczyska leśne ZZM',
      unit: 'ha',
      firstValue: firstDetails.greeneryAndSport.forestAreaHa ?? 0,
      secondValue: secondDetails.greeneryAndSport.forestAreaHa ?? 0,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} ha`,
    },
    {
      categoryKey: 'greenery',
      metricKey: 'totalParksAreaHa',
      defaultCategory: 'Zieleń i Sport',
      defaultLabel: 'Łączna powierzchnia parków miejskich i kieszonkowych',
      unit: 'ha',
      firstValue: firstDetails.greeneryAndSport.totalParksAreaHa,
      secondValue: secondDetails.greeneryAndSport.totalParksAreaHa,
      higherIsBetter: true,
      format: (v) => `${v.toFixed(1)} ha`,
    },
    {
      categoryKey: 'greenery',
      metricKey: 'schoolSwimmingPoolsCount',
      defaultCategory: 'Zieleń i Sport',
      defaultLabel: 'Przyszkolne pływalnie sportowo-rekreacyjne',
      unit: 'bas.',
      pluralMap: {
        pl: ['basen', 'baseny', 'basenów'],
        en: ['swimming pool', 'swimming pools', 'swimming pools'],
        ua: ['басейн', 'басейни', 'басейнів'],
      },
      firstValue: firstDetails.greeneryAndSport.schoolSwimmingPoolsCount,
      secondValue: secondDetails.greeneryAndSport.schoolSwimmingPoolsCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'education',
      metricKey: 'nurseriesPublicCount',
      defaultCategory: 'Edukacja i Opieka',
      defaultLabel: 'Żłobki publiczne samorządowe (liczba placówek)',
      unit: 'plac.',
      pluralMap: {
        pl: ['żłobek', 'żłobki', 'żłobków'],
        en: ['nursery', 'nurseries', 'nurseries'],
        ua: ['ясла', 'ясла', 'ясел'],
      },
      firstValue: firstDetails.educationAndCare.nurseriesPublicCount,
      secondValue: secondDetails.educationAndCare.nurseriesPublicCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'education',
      metricKey: 'totalCarePlaces0To3',
      defaultCategory: 'Edukacja i Opieka',
      defaultLabel: 'Łączna liczba miejsc opieki 0–3 (żłobki + kluby)',
      unit: 'miejsc',
      pluralMap: {
        pl: ['miejsce opieki', 'miejsca opieki', 'miejsc opieki'],
        en: ['care spot', 'care spots', 'care spots'],
        ua: ['місце опіки', 'місця опіки', 'місць опіки'],
      },
      firstValue: firstDetails.educationAndCare.totalCarePlaces0To3,
      secondValue: secondDetails.educationAndCare.totalCarePlaces0To3,
      higherIsBetter: true,
    },
    {
      categoryKey: 'education',
      metricKey: 'childrenPerCarePlaceRatio',
      defaultCategory: 'Edukacja i Opieka',
      defaultLabel: 'Liczba dzieci (0–3 lat) przypadająca na 1 miejsce w żłobku',
      unit: 'os./miejsce',
      firstValue: firstDetails.educationAndCare.childrenPerCarePlaceRatio,
      secondValue: secondDetails.educationAndCare.childrenPerCarePlaceRatio,
      higherIsBetter: false,
      format: (v) => `${v.toFixed(2)} os.`,
    },
    {
      categoryKey: 'education',
      metricKey: 'avgStudentsPerClass',
      defaultCategory: 'Edukacja i Opieka',
      defaultLabel: 'Średnia liczebność oddziału w szkołach podstawowych',
      unit: 'uczn./klasę',
      firstValue: firstDetails.educationAndCare.avgStudentsPerClass,
      secondValue: secondDetails.educationAndCare.avgStudentsPerClass,
      higherIsBetter: false,
      format: (v) => `${v.toFixed(1)} os.`,
    },
    {
      categoryKey: 'culture',
      metricKey: 'libraryBranchesCount',
      defaultCategory: 'Kultura i Społeczność',
      defaultLabel: 'Filie Biblioteki Kraków w dzielnicy',
      unit: 'filii',
      pluralMap: {
        pl: ['filia', 'filie', 'filii'],
        en: ['library branch', 'library branches', 'library branches'],
        ua: ['філія', 'філії', 'філій'],
      },
      firstValue: firstDetails.cultureAndSociety.libraryBranchesCount,
      secondValue: secondDetails.cultureAndSociety.libraryBranchesCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'culture',
      metricKey: 'culturalCentersCount',
      defaultCategory: 'Kultura i Społeczność',
      defaultLabel: 'Miejskie Domy i Ośrodki Kultury',
      unit: 'ośr.',
      pluralMap: {
        pl: ['dom kultury', 'domy kultury', 'domów kultury'],
        en: ['cultural center', 'cultural centers', 'cultural centers'],
        ua: ['центр культури', 'центри культури', 'центрів культури'],
      },
      firstValue: firstDetails.cultureAndSociety.culturalCentersCount,
      secondValue: secondDetails.cultureAndSociety.culturalCentersCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'culture',
      metricKey: 'seniorActivityCentersCount',
      defaultCategory: 'Kultura i Społeczność',
      defaultLabel: 'Centra Aktywności Seniora (CAS)',
      unit: 'centr.',
      pluralMap: {
        pl: ['centrum CAS', 'centra CAS', 'centrów CAS'],
        en: ['senior center', 'senior centers', 'senior centers'],
        ua: ['центр CAS', 'центри CAS', 'центрів CAS'],
      },
      firstValue: firstDetails.cultureAndSociety.seniorActivityCentersCount,
      secondValue: secondDetails.cultureAndSociety.seniorActivityCentersCount,
      higherIsBetter: true,
    },
    {
      categoryKey: 'environment',
      metricKey: 'pm10Avg90dUgM3',
      defaultCategory: 'Środowisko',
      defaultLabel: 'Średnie stężenie pyłu PM10 (ostatnie 90 dni)',
      unit: 'µg/m³',
      firstValue: firstDetails.environmentalQuality.pm10Avg90dUgM3,
      secondValue: secondDetails.environmentalQuality.pm10Avg90dUgM3,
      higherIsBetter: false,
      format: (v) => `${v.toFixed(1)} µg/m³`,
    },
    {
      categoryKey: 'environment',
      metricKey: 'pm25Avg90dUgM3',
      defaultCategory: 'Środowisko',
      defaultLabel: 'Średnie stężenie drobnego pyłu PM2.5 (90 dni)',
      unit: 'µg/m³',
      firstValue: firstDetails.environmentalQuality.pm25Avg90dUgM3,
      secondValue: secondDetails.environmentalQuality.pm25Avg90dUgM3,
      higherIsBetter: false,
      format: (v) => `${v.toFixed(1)} µg/m³`,
    },
    {
      categoryKey: 'environment',
      metricKey: 'no2Avg90dUgM3',
      defaultCategory: 'Środowisko',
      defaultLabel: 'Średnie stężenie spalin drogowych NO₂ (90 dni)',
      unit: 'µg/m³',
      firstValue: firstDetails.environmentalQuality.no2Avg90dUgM3,
      secondValue: secondDetails.environmentalQuality.no2Avg90dUgM3,
      higherIsBetter: false,
      format: (v) => `${v.toFixed(1)} µg/m³`,
    },
    {
      categoryKey: 'environment',
      metricKey: 'smogDays90dCount',
      defaultCategory: 'Środowisko',
      defaultLabel: 'Dni smogowe z przekroczeniem normy PM10 (90 dni)',
      unit: 'dni',
      pluralMap: {
        pl: ['dzień', 'dni', 'dni'],
        en: ['day', 'days', 'days'],
        ua: ['день', 'дні', 'днів'],
      },
      firstValue: firstDetails.environmentalQuality.smogDays90dCount,
      secondValue: secondDetails.environmentalQuality.smogDays90dCount,
      higherIsBetter: false,
    },
  ];
}
