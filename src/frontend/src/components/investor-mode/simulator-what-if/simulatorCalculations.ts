import type { DistrictDetailsDto, DistrictScoresDto } from '../../../types/contracts';
import type {
  SimulatorImpactMetrics,
  SimulatorLeversState,
  SimulatorPresetId,
  SimulatorScoresWithComposite,
} from './types';

export const NURSERY_PLACES_PER_UNIT = 100;
export const KINDERGARTEN_PLACES_PER_UNIT = 125;
export const PRIMARY_SCHOOL_PLACES_PER_UNIT = 400;
export const POCKET_PARK_AREA_HA = 0.25;
export const CITY_PARK_AREA_HA = 2.0;
export const BIKE_RACKS_PER_HUB = 15;

export const INITIAL_LEVERS_STATE: SimulatorLeversState = {
  addedNurseries: 0,
  addedKindergartens: 0,
  addedPrimarySchools: 0,
  addedParentClubs: 0,
  addedPocketParks: 0,
  addedCityParks: 0,
  addedSchoolSports: 0,
  addedBusStops: 0,
  addedTramStops: 0,
  addedBikeLanesKm: 0,
  addedParkAndRide: 0,
  addedCasCenters: 0,
  addedLibraries: 0,
  addedCulturalCenters: 0,
};

export function getPresetLevers(preset: SimulatorPresetId): SimulatorLeversState {
  switch (preset) {
    case 'family_package':
      return {
        ...INITIAL_LEVERS_STATE,
        addedNurseries: 2,
        addedKindergartens: 2,
        addedPrimarySchools: 1,
        addedParentClubs: 2,
        addedPocketParks: 2,
        addedSchoolSports: 1,
      };
    case 'green_package':
      return {
        ...INITIAL_LEVERS_STATE,
        addedPocketParks: 4,
        addedCityParks: 1,
        addedSchoolSports: 2,
        addedBikeLanesKm: 2,
      };
    case 'mobility_package':
      return {
        ...INITIAL_LEVERS_STATE,
        addedBusStops: 4,
        addedTramStops: 2,
        addedBikeLanesKm: 3,
        addedParkAndRide: 1,
      };
    case 'senior_culture_package':
      return {
        ...INITIAL_LEVERS_STATE,
        addedCasCenters: 2,
        addedLibraries: 1,
        addedCulturalCenters: 1,
        addedPocketParks: 2,
        addedBusStops: 2,
      };
    case 'custom':
    default:
      return { ...INITIAL_LEVERS_STATE };
  }
}

export function countTotalAddedItems(levers: SimulatorLeversState): number {
  return Math.round(
    levers.addedNurseries +
      levers.addedKindergartens +
      levers.addedPrimarySchools +
      levers.addedParentClubs +
      levers.addedPocketParks +
      levers.addedCityParks +
      levers.addedSchoolSports +
      levers.addedBusStops +
      levers.addedTramStops +
      levers.addedBikeLanesKm +
      levers.addedParkAndRide +
      levers.addedCasCenters +
      levers.addedLibraries +
      levers.addedCulturalCenters
  );
}

function clampScore(val: number): number {
  return Number(Math.min(100, Math.max(0, val)).toFixed(1));
}

function computeCompositeIndex(scores: DistrictScoresDto): number {
  const sum =
    scores.mobilityScore +
    scores.educationScore +
    scores.greeneryScore +
    scores.cultureAndSeniorScore +
    scores.environmentScore +
    scores.safetyScore +
    scores.housingAffordabilityScore +
    scores.demographicVitalityScore;
  return Number((sum / 8).toFixed(1));
}

export function calculateSimulationImpact(
  d: DistrictDetailsDto,
  levers: SimulatorLeversState,
  allDistrictsDetails?: DistrictDetailsDto[]
): SimulatorImpactMetrics {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawD = d.demographics as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawF = d.forecastsAndB2B as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawEdu = d.educationAndCare as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawGrn = d.greeneryAndSport as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMob = d.mobilityAndTransport as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCult = d.cultureAndSociety as any;

  const totalPop: number = Math.max(1, rawD?.totalPopulation ?? 1);

  // ---------------------------------------------------------------------------
  // 1. EDUKACJA I OPIEKA (0-3, 4-6, 7-14, 0-14) - STAN AKTUALNY NA ŻYWO
  // ---------------------------------------------------------------------------
  const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;

  const nurseryPlacesBefore: number =
    rawEdu?.totalCarePlaces0To3 ?? rawEdu?.totalCarePlaces0to3 ?? 0;
  const nurseryPlacesAdded = Math.round(levers.addedNurseries * NURSERY_PLACES_PER_UNIT);
  const nurseryPlacesAfter = nurseryPlacesBefore + nurseryPlacesAdded;

  const nurseryBalanceBefore: number = nurseryPlacesBefore - c03;
  const nurseryBalanceAfter = nurseryPlacesAfter - c03;

  const nurseryCoverageBeforePct =
    c03 > 0 ? Math.min(150, Math.round((nurseryPlacesBefore / c03) * 100)) : 100;
  const nurseryCoverageAfterPct =
    c03 > 0 ? Math.min(150, Math.round((nurseryPlacesAfter / c03) * 100)) : 100;

  const childrenPerPlaceBefore: number =
    nurseryPlacesBefore > 0
      ? Number((c03 / nurseryPlacesBefore).toFixed(2))
      : Number((rawEdu?.childrenPerCarePlaceRatio ?? 0).toFixed(2));
  const childrenPerPlaceAfter: number =
    nurseryPlacesAfter > 0
      ? Number((c03 / nurseryPlacesAfter).toFixed(2))
      : childrenPerPlaceBefore;

  const parentClubsBefore: number = rawEdu?.parentClubsCount ?? 0;
  const parentClubsAfter = parentClubsBefore + Math.round(levers.addedParentClubs);

  // Przedszkola (4-6 lat - stan aktualny)
  const c46: number = rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
  const kindergartenPlacesBefore: number =
    rawEdu?.kindergartenPlacesTotal ?? rawEdu?.kindergartensPlacesTotal ?? 0;
  const kindergartenPlacesAdded = Math.round(
    levers.addedKindergartens * KINDERGARTEN_PLACES_PER_UNIT
  );
  const kindergartenPlacesAfter = kindergartenPlacesBefore + kindergartenPlacesAdded;
  const kindergartenBalanceBefore = kindergartenPlacesBefore - c46;
  const kindergartenBalanceAfter = kindergartenPlacesAfter - c46;
  const kindergartenCoverageBeforePct =
    c46 > 0 ? Math.min(150, Math.round((kindergartenPlacesBefore / c46) * 100)) : 100;
  const kindergartenCoverageAfterPct =
    c46 > 0 ? Math.min(150, Math.round((kindergartenPlacesAfter / c46) * 100)) : 100;

  // Szkoły podstawowe (7-14 lat - stan aktualny)
  const c714: number = rawD?.age7To14 ?? rawD?.age7to14 ?? 0;
  const schoolPlacesBefore: number = rawEdu?.primarySchoolStudentsTotal ?? 0;
  const schoolPlacesAdded = Math.round(
    levers.addedPrimarySchools * PRIMARY_SCHOOL_PLACES_PER_UNIT
  );
  const schoolPlacesAfter = schoolPlacesBefore + schoolPlacesAdded;
  const schoolBalanceBefore = schoolPlacesBefore - c714;
  const schoolBalanceAfter = schoolPlacesAfter - c714;
  const schoolCoverageBeforePct =
    c714 > 0 ? Math.min(150, Math.round((schoolPlacesBefore / c714) * 100)) : 100;
  const schoolCoverageAfterPct =
    c714 > 0 ? Math.min(150, Math.round((schoolPlacesAfter / c714) * 100)) : 100;

  const avgClassSizeBefore: number = Number((rawEdu?.avgStudentsPerClass ?? 21).toFixed(1));
  const primarySchoolsBefore: number = Math.max(1, rawEdu?.primarySchoolsCount ?? 5);
  // Każda nowa szkoła dodaje ~18 oddziałów klasowych i rozładowuje zagęszczenie w obwodach
  const estimatedClassesBefore =
    avgClassSizeBefore > 0
      ? Math.max(10, schoolPlacesBefore / avgClassSizeBefore)
      : primarySchoolsBefore * 16;
  const estimatedClassesAfter = estimatedClassesBefore + levers.addedPrimarySchools * 18;
  const avgClassSizeAfter: number =
    levers.addedPrimarySchools > 0.01
      ? Number(Math.max(14.0, schoolPlacesBefore / estimatedClassesAfter).toFixed(1))
      : avgClassSizeBefore;

  // Łączny bilans 0-14 (stan aktualny)
  const totalChildren0To14 = c03 + c46 + c714;
  const totalEduPlacesBefore =
    nurseryPlacesBefore + kindergartenPlacesBefore + schoolPlacesBefore;
  const totalEduPlacesAfter =
    nurseryPlacesAfter + kindergartenPlacesAfter + schoolPlacesAfter;
  const totalEduBalanceBefore = totalEduPlacesBefore - totalChildren0To14;
  const totalEduBalanceAfter = totalEduPlacesAfter - totalChildren0To14;
  const totalEduCoverageBeforePct =
    totalChildren0To14 > 0
      ? Math.min(150, Math.round((totalEduPlacesBefore / totalChildren0To14) * 100))
      : 100;
  const totalEduCoverageAfterPct =
    totalChildren0To14 > 0
      ? Math.min(150, Math.round((totalEduPlacesAfter / totalChildren0To14) * 100))
      : 100;

  // ---------------------------------------------------------------------------
  // 2. ZIELEŃ MIEJSKA I SPORT
  // ---------------------------------------------------------------------------
  const pocketParksBefore: number = rawGrn?.pocketParksCount ?? 0;
  const pocketParksAfter = pocketParksBefore + Math.round(levers.addedPocketParks);
  const cityParksBefore: number = rawGrn?.cityParksCount ?? 0;
  const cityParksAfter = cityParksBefore + Math.round(levers.addedCityParks);
  const parksCountBefore = pocketParksBefore + cityParksBefore;
  const parksCountAfter = pocketParksAfter + cityParksAfter;

  const greenAreaHaBefore: number = Number((rawGrn?.totalGreenAreaHa ?? 0).toFixed(2));
  const addedGreenHa =
    levers.addedPocketParks * POCKET_PARK_AREA_HA +
    levers.addedCityParks * CITY_PARK_AREA_HA;
  const greenAreaHaAfter = Number((greenAreaHaBefore + addedGreenHa).toFixed(2));

  const greenM2PerCapitaBefore: number = Number(
    (rawGrn?.greenAreaM2PerCapita ?? 0).toFixed(1)
  );
  const addedGreenM2PerCapita = (addedGreenHa * 10000) / totalPop;
  const greenM2PerCapitaAfter = Number(
    (greenM2PerCapitaBefore + addedGreenM2PerCapita).toFixed(1)
  );

  const sportsFacilitiesBefore: number =
    (rawGrn?.schoolSportsFacilitiesCount ?? 0) + (rawGrn?.schoolSwimmingPoolsCount ?? 0);
  const sportsFacilitiesAfter = sportsFacilitiesBefore + Math.round(levers.addedSchoolSports);

  // ---------------------------------------------------------------------------
  // 3. KOMUNIKACJA I ROWER (KMK / ZTP)
  // ---------------------------------------------------------------------------
  const busStopsBefore: number = rawMob?.busStopsCount ?? 0;
  const busStopsAfter = busStopsBefore + Math.round(levers.addedBusStops);
  const tramStopsBefore: number = rawMob?.tramStopsCount ?? 0;
  const tramStopsAfter = tramStopsBefore + Math.round(levers.addedTramStops);
  const kmkStopsBefore: number = rawMob?.kmkStopsCount ?? busStopsBefore + tramStopsBefore;
  const kmkStopsAfter =
    kmkStopsBefore + Math.round(levers.addedBusStops + levers.addedTramStops);

  const isochroneBeforePct: number = Number((rawMob?.isochroneCoveragePct ?? 0).toFixed(1));
  const isochroneGain =
    levers.addedBusStops * 1.15 + levers.addedTramStops * 1.65 + levers.addedParkAndRide * 0.5;
  const isochroneAfterPct = Number(
    Math.min(99.5, isochroneBeforePct + isochroneGain).toFixed(1)
  );

  const bikeLanesKmBefore: number = Number((rawMob?.bikeLanesLengthKm ?? 0).toFixed(1));
  const bikeLanesKmAfter = Number((bikeLanesKmBefore + levers.addedBikeLanesKm).toFixed(1));
  const parkAndRideBefore: number = rawMob?.parkAndRideCount ?? 0;
  const parkAndRideAfter = parkAndRideBefore + Math.round(levers.addedParkAndRide);
  const bikeRacksBefore: number = rawMob?.bikeRacksCount ?? 0;
  const bikeRacksAfter =
    bikeRacksBefore + Math.round(levers.addedParkAndRide * BIKE_RACKS_PER_HUB);

  // ---------------------------------------------------------------------------
  // 4. KULTURA I SENIORZY (65+ - STAN AKTUALNY NA ŻYWO)
  // ---------------------------------------------------------------------------
  const seniorsCurrent: number = rawD?.age65Plus ?? rawD?.age65plus ?? 0;
  const casCountBefore: number = rawCult?.seniorActivityCentersCount ?? 0;
  const casCountAfter = casCountBefore + Math.round(levers.addedCasCenters);
  const seniorsPerCasBefore = Math.round(seniorsCurrent / Math.max(1, casCountBefore));
  const seniorsPerCasAfter = Math.round(
    seniorsCurrent / Math.max(1, casCountBefore + levers.addedCasCenters)
  );

  const librariesBefore: number = rawCult?.libraryBranchesCount ?? 0;
  const librariesAfter = librariesBefore + Math.round(levers.addedLibraries);
  const culturalCentersBefore: number = rawCult?.culturalCentersCount ?? 0;
  const culturalCentersAfter = culturalCentersBefore + Math.round(levers.addedCulturalCenters);

  // ---------------------------------------------------------------------------
  // 5. PRZELICZENIE 8 FILARÓW JAKOŚCI ŻYCIA I POZYCJI W RANKINGU (W CZASIE RZECZYWISTYM)
  // ---------------------------------------------------------------------------
  const baseScores = d.scores;
  const beforeComposite = computeCompositeIndex(baseScores);

  const beforeScores: SimulatorScoresWithComposite = {
    ...baseScores,
    weightedQualityOfLifeIndex: beforeComposite,
  };

  // Wpływ na Filar Edukacji i Opieki (0-100 pkt)
  const eduBoost =
    levers.addedNurseries * 2.8 +
    levers.addedKindergartens * 2.2 +
    levers.addedPrimarySchools * 3.8 +
    levers.addedParentClubs * 1.4;
  const educationAfter = clampScore(baseScores.educationScore + eduBoost);

  // Wpływ na Filar Zieleni i Rekreacji (0-100 pkt)
  const greenBoost =
    levers.addedPocketParks * 1.6 +
    levers.addedCityParks * 3.8 +
    levers.addedSchoolSports * 2.1 +
    addedGreenM2PerCapita * 0.35;
  const greeneryAfter = clampScore(baseScores.greeneryScore + greenBoost);

  // Wpływ na Filar Komunikacji i Mobilności (0-100 pkt)
  const mobilityBoost =
    levers.addedBusStops * 1.1 +
    levers.addedTramStops * 2.4 +
    levers.addedBikeLanesKm * 1.3 +
    levers.addedParkAndRide * 1.8;
  const mobilityAfter = clampScore(baseScores.mobilityScore + mobilityBoost);

  // Wpływ na Filar Kultury i Seniorów (0-100 pkt)
  const cultureBoost =
    levers.addedCasCenters * 3.2 +
    levers.addedLibraries * 2.2 +
    levers.addedCulturalCenters * 2.8 +
    levers.addedParentClubs * 0.6;
  const cultureAfter = clampScore(baseScores.cultureAndSeniorScore + cultureBoost);

  // Wpływ na Filar Środowiska i Mikroklimatu (nowa zieleń i transport niskoemisyjny)
  const envBoost =
    levers.addedPocketParks * 0.45 +
    levers.addedCityParks * 1.3 +
    levers.addedBikeLanesKm * 0.25 +
    levers.addedTramStops * 0.35;
  const environmentAfter = clampScore(baseScores.environmentScore + envBoost);

  // Wpływ na Filar Potencjału Demograficznego (przyciąganie rodzin i mieszkańców dzięki nowej infrastrukturze)
  const vitalityBoost =
    (levers.addedNurseries + levers.addedKindergartens + levers.addedPrimarySchools) * 0.9 +
    levers.addedParentClubs * 0.5 +
    (levers.addedPocketParks + levers.addedCityParks + levers.addedSchoolSports) * 0.45 +
    (levers.addedTramStops + levers.addedBusStops + levers.addedBikeLanesKm * 0.5) * 0.35 +
    (levers.addedCasCenters + levers.addedLibraries + levers.addedCulturalCenters) * 0.45;
  const vitalityAfter = clampScore(baseScores.demographicVitalityScore + vitalityBoost);

  // Wpływ na Bezpieczeństwo (nowe ścieżki rowerowe DDR, boiska szkolne, przystanki)
  const safetyBoost =
    levers.addedBikeLanesKm * 0.35 +
    levers.addedSchoolSports * 0.25 +
    levers.addedParkAndRide * 0.3;
  const safetyAfter = clampScore(baseScores.safetyScore + safetyBoost);

  const housingAfter = clampScore(baseScores.housingAffordabilityScore);

  const afterScoresWithoutComposite: DistrictScoresDto = {
    mobilityScore: mobilityAfter,
    educationScore: educationAfter,
    greeneryScore: greeneryAfter,
    cultureAndSeniorScore: cultureAfter,
    environmentScore: environmentAfter,
    safetyScore: safetyAfter,
    housingAffordabilityScore: housingAfter,
    demographicVitalityScore: vitalityAfter,
  };

  const afterComposite = computeCompositeIndex(afterScoresWithoutComposite);

  const afterScores: SimulatorScoresWithComposite = {
    ...afterScoresWithoutComposite,
    weightedQualityOfLifeIndex: afterComposite,
  };

  const deltas: SimulatorScoresWithComposite = {
    mobilityScore: Number((afterScores.mobilityScore - beforeScores.mobilityScore).toFixed(1)),
    educationScore: Number((afterScores.educationScore - beforeScores.educationScore).toFixed(1)),
    greeneryScore: Number((afterScores.greeneryScore - beforeScores.greeneryScore).toFixed(1)),
    cultureAndSeniorScore: Number(
      (afterScores.cultureAndSeniorScore - beforeScores.cultureAndSeniorScore).toFixed(1)
    ),
    environmentScore: Number(
      (afterScores.environmentScore - beforeScores.environmentScore).toFixed(1)
    ),
    safetyScore: Number((afterScores.safetyScore - beforeScores.safetyScore).toFixed(1)),
    housingAffordabilityScore: 0,
    demographicVitalityScore: Number(
      (afterScores.demographicVitalityScore - beforeScores.demographicVitalityScore).toFixed(1)
    ),
    weightedQualityOfLifeIndex: Number((afterComposite - beforeComposite).toFixed(1)),
  };

  // Pozycja w rankingu 18 dzielnic przed i po symulacji
  let rankBefore = 1;
  let rankAfter = 1;
  if (allDistrictsDetails && allDistrictsDetails.length > 0) {
    const compositesBefore = allDistrictsDetails.map((dist) => ({
      id: dist.districtId,
      score:
        dist.districtId === d.districtId
          ? beforeComposite
          : computeCompositeIndex(dist.scores),
    }));
    compositesBefore.sort((a, b) => b.score - a.score);
    const idxBefore = compositesBefore.findIndex((item) => item.id === d.districtId);
    if (idxBefore !== -1) rankBefore = idxBefore + 1;

    const compositesAfter = allDistrictsDetails.map((dist) => ({
      id: dist.districtId,
      score:
        dist.districtId === d.districtId
          ? afterComposite
          : computeCompositeIndex(dist.scores),
    }));
    compositesAfter.sort((a, b) => b.score - a.score);
    const idxAfter = compositesAfter.findIndex((item) => item.id === d.districtId);
    if (idxAfter !== -1) rankAfter = idxAfter + 1;
  }

  return {
    districtId: d.districtId,
    districtRoman: d.districtRoman,
    districtName: d.districtName,
    totalAddedItemsCount: countTotalAddedItems(levers),
    scores: {
      before: beforeScores,
      after: afterScores,
      deltas,
      rankBefore,
      rankAfter,
      rankDelta: rankBefore - rankAfter, // dodatnia wartość = awans w górę rankingu
    },
    age0To3_2028: c03,
    targetNurseryDemand2028: c03,
    nurseryPlacesBefore,
    nurseryPlacesAfter,
    nurseryBalanceBefore,
    nurseryBalanceAfter,
    nurseryCoverageBeforePct,
    nurseryCoverageAfterPct,
    childrenPerPlaceBefore,
    childrenPerPlaceAfter,
    parentClubsBefore,
    parentClubsAfter,
    age4To6_2028: c46,
    kindergartenPlacesBefore,
    kindergartenPlacesAfter,
    kindergartenBalanceBefore,
    kindergartenBalanceAfter,
    kindergartenCoverageBeforePct,
    kindergartenCoverageAfterPct,
    age7To14_2028: c714,
    schoolPlacesBefore,
    schoolPlacesAfter,
    schoolBalanceBefore,
    schoolBalanceAfter,
    schoolCoverageBeforePct,
    schoolCoverageAfterPct,
    avgClassSizeBefore,
    avgClassSizeAfter,
    totalChildren0To14_2028: totalChildren0To14,
    totalEduPlacesBefore,
    totalEduPlacesAfter,
    totalEduBalanceBefore,
    totalEduBalanceAfter,
    totalEduCoverageBeforePct,
    totalEduCoverageAfterPct,
    parksCountBefore,
    parksCountAfter,
    pocketParksBefore,
    pocketParksAfter,
    cityParksBefore,
    cityParksAfter,
    greenAreaHaBefore,
    greenAreaHaAfter,
    greenM2PerCapitaBefore,
    greenM2PerCapitaAfter,
    sportsFacilitiesBefore,
    sportsFacilitiesAfter,
    busStopsBefore,
    busStopsAfter,
    tramStopsBefore,
    tramStopsAfter,
    kmkStopsBefore,
    kmkStopsAfter,
    isochroneBeforePct,
    isochroneAfterPct,
    bikeLanesKmBefore,
    bikeLanesKmAfter,
    parkAndRideBefore,
    parkAndRideAfter,
    bikeRacksBefore,
    bikeRacksAfter,
    seniors2028: seniorsCurrent,
    casCountBefore,
    casCountAfter,
    seniorsPerCasBefore,
    seniorsPerCasAfter,
    librariesBefore,
    librariesAfter,
    culturalCentersBefore,
    culturalCentersAfter,
    nurseryPotentialB2B: (rawF?.nurseryInvestmentPotentialB2B as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW',
    seniorDeficit: (rawF?.seniorInfrastructureDeficit as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW',
    greenDeficit: (rawF?.greenSpaceDeficit as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW',
  };
}
