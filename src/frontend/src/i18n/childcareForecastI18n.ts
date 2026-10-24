import type { Language } from './types';
import type { DistrictDetailsDto } from '../types/contracts';
import type { ChildAgeCohort } from '../components/parent-mode/FamilyAgeCohortSelector';
import type {
  MacroPillDescriptions,
  MacroTitles,
} from '../components/parent-mode/childcare-forecast/types';

// Pluralization & Grammar Helpers (PL, UA, EN)
export function formatFacilitiesLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? '1 edu-care facility' : `${count} edu-care facilities`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} заклад edu-care`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} заклади edu-care`;
    return `${count} закладів edu-care`;
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 placówka edu-care';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} placówki edu-care`;
  }
  return `${count} placówek edu-care`;
}

export function formatKindergartensLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? '1 kindergarten' : `${count} kindergartens`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} дитsадок`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} дитсадки`;
    return `${count} дитсадків`;
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 przedszkole';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} przedszkola`;
  }
  return `${count} przedszkoli`;
}

export function formatSchoolsLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? '1 primary school' : `${count} primary schools`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} початкова школа`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} початкові школи`;
    return `${count} початкових шкіл`;
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 szkoła podstawowa';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} szkoły podstawowe`;
  }
  return `${count} szkół podstawowych`;
}

export function formatNurseriesLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? '1 care facility' : `${count} care facilities`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} заклад догляду`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} заклади догляду`;
    return `${count} закладів догляду`;
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 placówka opieki';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} placówki opieki`;
  }
  return `${count} placówek opieki`;
}

export function formatNurseriesCount(count: number, language: Language): string {
  if (language === 'en') return count === 1 ? '1 nursery' : `${count} nurseries`;
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} ясла`;
    return `${count} ясел`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 żłobek';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} żłobki`;
  return `${count} żłobków`;
}

export function formatKindergartensCount(count: number, language: Language): string {
  if (language === 'en') return count === 1 ? '1 kindergarten' : `${count} kindergartens`;
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} дитсадок`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} дитсадки`;
    return `${count} дитсадків`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 przedszkole';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} przedszkola`;
  return `${count} przedszkoli`;
}

export function formatSchoolsCount(count: number, language: Language): string {
  if (language === 'en') return count === 1 ? '1 primary school' : `${count} primary schools`;
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} школа`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} школи`;
    return `${count} шкіл`;
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 szkoła';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} szkoły`;
  return `${count} szkół`;
}

// Grammatical Inflection for Places / Spots (miejsc / miejsca / miejsce)
export function formatPlacesUnit(count: number, language: Language): string {
  const abs = Math.abs(count);
  if (language === 'en') {
    return abs === 1 ? 'place' : 'places';
  }
  if (language === 'ua') {
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 === 1 && mod100 !== 11) return 'місце';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'місця';
    return 'місць';
  }
  // Polish
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (abs === 1) return 'miejsce';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'miejsca';
  }
  return 'miejsc';
}

// Localized Toddler Infrastructure Breakdown with Proper Cases
export function formatToddlerInfraBreakdown(
  publicCount: number,
  privateCount: number,
  clubsCount: number,
  language: Language
): string {
  if (language === 'en') {
    const pub = `${publicCount} municipal`;
    const priv = `${privateCount} private`;
    const cl = clubsCount === 1 ? '1 kids club' : `${clubsCount} kids clubs`;
    return `${pub}, ${priv}, ${cl}`;
  }
  if (language === 'ua') {
    const pubMod10 = publicCount % 10;
    const pubMod100 = publicCount % 100;
    const pubWord =
      pubMod10 === 1 && pubMod100 !== 11
        ? 'муніципальний'
        : pubMod10 >= 2 && pubMod10 <= 4 && (pubMod100 < 10 || pubMod100 >= 20)
        ? 'муніципальні'
        : 'муніципальних';

    const privMod10 = privateCount % 10;
    const privMod100 = privateCount % 100;
    const privWord =
      privMod10 === 1 && privMod100 !== 11
        ? 'приватний'
        : privMod10 >= 2 && privMod10 <= 4 && (privMod100 < 10 || privMod100 >= 20)
        ? 'приватні'
        : 'приватних';

    const clubMod10 = clubsCount % 10;
    const clubMod100 = clubsCount % 100;
    const clubWord =
      clubMod10 === 1 && clubMod100 !== 11
        ? 'дитячий клуб'
        : clubMod10 >= 2 && clubMod10 <= 4 && (clubMod100 < 10 || clubMod100 >= 20)
        ? 'дитячі клуби'
        : 'дитячих клубів';

    return `${publicCount} ${pubWord}, ${privateCount} ${privWord}, ${clubsCount} ${clubWord}`;
  }
  // Polish
  const pubMod10 = publicCount % 10;
  const pubMod100 = publicCount % 100;
  const pubWord =
    publicCount === 1
      ? 'samorządowy'
      : pubMod10 >= 2 && pubMod10 <= 4 && (pubMod100 < 10 || pubMod100 >= 20)
      ? 'samorządowe'
      : 'samorządowych';

  const privMod10 = privateCount % 10;
  const privMod100 = privateCount % 100;
  const privWord =
    privateCount === 1
      ? 'niepubliczny'
      : privMod10 >= 2 && privMod10 <= 4 && (privMod100 < 10 || privMod100 >= 20)
      ? 'niepubliczne'
      : 'niepublicznych';

  const clubMod10 = clubsCount % 10;
  const clubMod100 = clubsCount % 100;
  const clubWord =
    clubsCount === 1
      ? 'klub malucha'
      : clubMod10 >= 2 && clubMod10 <= 4 && (clubMod100 < 10 || clubMod100 >= 20)
      ? 'kluby malucha'
      : 'klubów malucha';

  return `${publicCount} ${pubWord}, ${privateCount} ${privWord}, ${clubsCount} ${clubWord}`;
}

// Localized Titles & Descriptions
export function getMacroTitles(cohort: ChildAgeCohort, language: Language): MacroTitles {
  if (language === 'en') {
    if (cohort === 'infant') {
      return {
        balance: 'Places Balance (2028)',
        whiteSpots: 'Districts with Deficit',
        coverage: 'Average Demand Coverage',
        demand: 'Toddler Population (2028)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balance: 'Places Balance (2028)',
        whiteSpots: 'High Demand Districts',
        coverage: 'Average Demand Coverage',
        demand: 'Preschool Population (2028)',
      };
    }
    if (cohort === 'school') {
      return {
        balance: 'Places Balance (2028)',
        whiteSpots: 'High Density Classes',
        coverage: 'Educational Comfort',
        demand: 'Primary Students (2028)',
      };
    }
    return {
      balance: 'Places Balance (2028)',
      whiteSpots: 'Tight Balance Districts',
      coverage: 'Average Demand Coverage',
      demand: 'Total Child Population (2028)',
    };
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      return {
        balance: 'Баланс Місць (2028)',
        whiteSpots: 'Райони з Дефіцитом',
        coverage: 'Середнє Покриття Попиту',
        demand: 'Популяція Малюків (2028)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balance: 'Баланс Місць (2028)',
        whiteSpots: 'Райони з Вищим Попитом',
        coverage: 'Середнє Покриття Попиту',
        demand: 'Популяція Дошкільнят (2028)',
      };
    }
    if (cohort === 'school') {
      return {
        balance: 'Баланс Місць (2028)',
        whiteSpots: 'Класи з Вищою Щільністю',
        coverage: 'Освітній Комфорт',
        demand: 'Учні Початкових Шкіл (2028)',
      };
    }
    return {
      balance: 'Баланс Місць (2028)',
      whiteSpots: 'Райони зі Щільним Балансом',
      coverage: 'Середнє Покриття Попиту',
      demand: 'Загальна Популяція Дітей (2028)',
    };
  }

  // Polish default
  if (cohort === 'infant') {
    return {
      balance: 'Bilans Miejsc (2028)',
      whiteSpots: 'Dzielnice z Deficytem',
      coverage: 'Średnie Pokrycie Popytu',
      demand: 'Populacja Maluchów (2028)',
    };
  }
  if (cohort === 'preschool') {
    return {
      balance: 'Bilans Miejsc (2028)',
      whiteSpots: 'Dzielnice o Wyższym Popycie',
      coverage: 'Średnie Pokrycie Popytu',
      demand: 'Populacja Przedszkolaków (2028)',
    };
  }
  if (cohort === 'school') {
    return {
      balance: 'Bilans Miejsc (2028)',
      whiteSpots: 'Oddziały z Zagęszczeniem',
      coverage: 'Komfort Edukacyjny',
      demand: 'Uczniowie Szkół SP (2028)',
    };
  }
  return {
    balance: 'Bilans Miejsc (2028)',
    whiteSpots: 'Dzielnice z Napiętym Bilansem',
    coverage: 'Średnie Pokrycie Popytu',
    demand: 'Łączna Populacja Dzieci (2028)',
  };
}

export function getForecastFilterLabels(
  cohort: ChildAgeCohort,
  language: Language
): { all: string; whiteSpots: string; balanced: string; surplus: string } {
  if (language === 'en') {
    if (cohort === 'infant') {
      return {
        all: 'All Districts',
        whiteSpots: 'White Spots (High Deficit)',
        balanced: 'Balanced Market',
        surplus: 'High Availability',
      };
    }
    if (cohort === 'preschool') {
      return {
        all: 'All Districts',
        whiteSpots: 'High Demand (Tighter Base)',
        balanced: 'Balanced Market',
        surplus: 'High Availability',
      };
    }
    if (cohort === 'school') {
      return {
        all: 'All Districts',
        whiteSpots: 'Crowded Classes (>20)',
        balanced: 'Standard Classes',
        surplus: 'Cosy Classes (≤17.5)',
      };
    }
    return {
      all: 'All Districts',
      whiteSpots: 'Tight Balance / Deficit',
      balanced: 'Balanced Market',
      surplus: 'High Availability',
    };
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      return {
        all: 'Усі Райони',
        whiteSpots: 'Білі Плями (Високий Дефіцит)',
        balanced: 'Збалансований Ринок',
        surplus: 'Висока Доступність',
      };
    }
    if (cohort === 'preschool') {
      return {
        all: 'Усі Райони',
        whiteSpots: 'Підвищений Попит',
        balanced: 'Збалансований Ринок',
        surplus: 'Висока Доступність',
      };
    }
    if (cohort === 'school') {
      return {
        all: 'Усі Райони',
        whiteSpots: 'Переповнені Класи (>20)',
        balanced: 'Стандартні Класи',
        surplus: 'Затишні Класи (≤17.5)',
      };
    }
    return {
      all: 'Усі Райони',
      whiteSpots: 'Напружений Баланс / Дефіцит',
      balanced: 'Збалансований Ринок',
      surplus: 'Висока Доступність',
    };
  }

  // Polish default
  if (cohort === 'infant') {
    return {
      all: 'Wszystkie Dzielnice',
      whiteSpots: 'Białe Plamy (Wysoki Deficyt)',
      balanced: 'Zrównoważony Rynek',
      surplus: 'Wysoka Dostępność',
    };
  }
  if (cohort === 'preschool') {
    return {
      all: 'Wszystkie Dzielnice',
      whiteSpots: 'Zwiększone Zapotrzebowanie',
      balanced: 'Zrównoważony Rynek',
      surplus: 'Wysoka Dostępność',
    };
  }
  if (cohort === 'school') {
    return {
      all: 'Wszystkie Dzielnice',
      whiteSpots: 'Zagęszczone Oddziały (>20)',
      balanced: 'Standardowe Oddziały',
      surplus: 'Kameralne Oddziały (≤17.5)',
    };
  }
  return {
    all: 'Wszystkie Dzielnice',
    whiteSpots: 'Napięty Bilans / Deficyt',
    balanced: 'Zrównoważony Rynek',
    surplus: 'Wysoka Dostępność',
  };
}

export function getMacroPillDescriptions(cohort: ChildAgeCohort, language: Language): MacroPillDescriptions {
  if (language === 'en') {
    if (cohort === 'infant') {
      return {
        balanceSub: 'Supply gap in nursery care through 2028',
        criticalSub: 'White spots of 0–3 care deficit',
        coverageSub: 'Care needs satisfaction rate',
        childrenSub: 'Children aged 0–3 years (2028 forecast)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balanceSub: 'Recruitment surplus of kindergarten places',
        criticalSub: 'Districts with tighter reserve buffer (<1.62x)',
        coverageSub: 'Universal right to preschool education',
        childrenSub: 'Children aged 4–6 years (2028 forecast)',
      };
    }
    if (cohort === 'school') {
      return {
        balanceSub: 'Primary school network capacity reserve',
        criticalSub: 'Districts with avg >20 students / class',
        coverageSub: 'Primary school catchment satisfaction rate',
        childrenSub: 'Krakow primary school students (7–14)',
      };
    }
    return {
      balanceSub: 'Aggregated municipal supply balance 2028',
      criticalSub: 'Districts with deficit or tight reserve (≤150)',
      coverageSub: 'Total municipal demand satisfaction rate',
      childrenSub: 'Demographic demand forecast 2028',
    };
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      return {
        balanceSub: 'Дефіцит пропозиції ясельного догляду до 2028 р.',
        criticalSub: 'Білі плями дефіциту догляду 0–3',
        coverageSub: 'Показник задоволення потреб догляду',
        childrenSub: 'Діти віком 0–3 роки (прогноз 2028)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balanceSub: 'Набірний надлишок місць у дитсадках',
        criticalSub: 'Райони з меншим буфером резерву (<1.62x)',
        coverageSub: 'Загальне право на дошкільну освіту',
        childrenSub: 'Діти віком 4–6 років (прогноз 2028)',
      };
    }
    if (cohort === 'school') {
      return {
        balanceSub: 'Резерв місткості мережі початкових шкіл',
        criticalSub: 'Райони із середнім >20 учнів / клас',
        coverageSub: 'Показник задоволення потреб початкових шкіл',
        childrenSub: 'Учні краківських початкових шкіл (7–14)',
      };
    }
    return {
      balanceSub: 'Сукупний муніципальний баланс пропозиції 2028',
      criticalSub: 'Райони з дефіцитом або щільним резервом (≤150)',
      coverageSub: 'Загальний муніципальний рівень покриття попиту',
      childrenSub: 'Прогноз демографічного попиту 2028',
    };
  }

  // Polish default
  if (cohort === 'infant') {
    return {
      balanceSub: 'Luka podażowa opieki żłobkowej do 2028 r.',
      criticalSub: 'Białe plamy deficytu opieki 0–3',
      coverageSub: 'Wskaźnik zaspokojenia potrzeb opiekuńczych',
      childrenSub: 'Dzieci w wieku 0–3 lat (prognoza 2028)',
    };
  }
  if (cohort === 'preschool') {
    return {
      balanceSub: 'Nadwyżka rekrutacyjna miejsc przedszkolnych',
      criticalSub: 'Dzielnice o niższym buforze rezerwy (<1.62x)',
      coverageSub: 'Powszechne prawo do wychowania przedszkolnego',
      childrenSub: 'Dzieci w wieku 4–6 lat (prognoza 2028)',
    };
  }
  if (cohort === 'school') {
    return {
      balanceSub: 'Rezerwa pojemności sieci szkół podstawowych',
      criticalSub: 'Dzielnice ze średnią >20 uczniów / oddział',
      coverageSub: 'Wskaźnik zaspokojenia potrzeb rejonowych SP',
      childrenSub: 'Uczniowie krakowskich szkół podstawowych (7–14)',
    };
  }
  return {
    balanceSub: 'Zagregowana równowaga podaży miejskiej 2028',
    criticalSub: 'Dzielnice z deficytem lub niską rezerwą (≤150)',
    coverageSub: 'Ogólnomiejski stopień zaspokojenia potrzeb rodzin',
    childrenSub: 'Prognoza popytu demograficznego 2028',
  };
}

// Parent Practical Insight & Deep Dive
export function getParentPracticalInsight(
  district: DistrictDetailsDto,
  cohort: ChildAgeCohort,
  language: Language
): string {
  const cleanName = district.districtName.replace(/^(Dzielnica|Район|District)\\s+/i, '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawF = district.forecastsAndB2B as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawD = district.demographics as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawE = district.educationAndCare as any;

  const carePlaces03: number = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
  const p03: number = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const balance: number = carePlaces03 - p03;
  const nurseriesPublic: number = rawE?.nurseriesPublicCount ?? 0;
  const nurseriesTotal: number =
    nurseriesPublic +
    (rawE?.nurseriesContractedCount ?? 0) +
    (rawE?.nurseriesPrivateCount ?? 0) +
    (rawE?.kidsClubsCount ?? 0);
  const kgPlaces: number = rawE?.kindergartenPlacesTotal ?? 0;
  const p46: number = rawF?.forecastedAge4To6_2028 ?? rawF?.forecastedAge4to6_2028 ?? rawD?.age4To6 ?? rawD?.age4to6 ?? 1;
  const kgRatio = kgPlaces / Math.max(1, p46);
  const avgClass: number = rawE?.avgStudentsPerClass ?? 0;

  if (language === 'en') {
    if (cohort === 'infant') {
      if (balance <= -750 || nurseriesPublic === 0) {
        return `In District ${cleanName}, demand for nursery care significantly exceeds available capacity in municipal facilities (projected places deficit through 2028). We recommend submitting an application in the municipal enrollment system well in advance and exploring subsidized private nurseries and city childcare programs.`;
      }
      return `In District ${cleanName}, early childcare infrastructure is well-developed (${nurseriesTotal} facilities, including ${nurseriesPublic} municipal). Parents benefit from stable recruitment conditions, proximity of Parents Clubs, and walking-friendly stroller routes.`;
    }

    if (cohort === 'preschool') {
      if (kgRatio < 1.62) {
        return `Due to intensive residential expansion in District ${cleanName}, enrollment in municipal kindergartens experiences high demand. Every preschool-age child has a statutory right to a place, though parents are advised to list multiple catchment and branch options during initial registration.`;
      }
      return `District ${cleanName} offers outstanding preschool availability (${rawE?.kindergartensCount ?? 0} kindergartens, over ${kgPlaces.toLocaleString()} places). Children enjoy spacious classrooms, outdoor playgrounds, and rich adaptation programs in a safe neighborhood.`;
    }

    if (cohort === 'school') {
      if (avgClass > 20.0) {
        return `Primary schools in District ${cleanName} are popular among families (average ${avgClass} students per class). We advise reviewing specific catchment school profiles, after-school care (świetlica), canteen facilities, and sports grounds.`;
      }
      return `Primary schools in District ${cleanName} feature comfortable, smaller class sizes (average ${avgClass} students per classroom). This fosters individualized teacher attention, calm study environments, and high student safety.`;
    }

    return `District ${cleanName} provides a balanced environment for family growth at every stage — from nursery care, to kindergartens, to primary schools. A total of ${(
      (rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0) +
      kgPlaces +
      (rawE?.primarySchoolsCount ?? 0) * 350
    ).toLocaleString()} educational and care places are available close to parks and recreational areas.`;
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      if (balance <= -750 || nurseriesPublic === 0) {
        return `У Районі ${cleanName} попит на ясельний догляд значно перевищує місткість муніципальних закладів (прогнозований дефіцит місць до 2028 р.). Рекомендуємо подавати заявку в міській системі набору завчасно та ознайомитися з пропозиціями субсидованих приватних ясел і міських програм підтримки.`;
      }
      return `У Районі ${cleanName} інфраструктура догляду за малюками добре розвинена (${nurseriesTotal} закладів, зокрема ${nurseriesPublic} муніципальних). Батьки можуть розраховувати на стабільні умови набору, близькість Клубів Батьків та зручну прогулянкову інфраструктуру.`;
    }

    if (cohort === 'preschool') {
      if (kgRatio < 1.62) {
        return `Через інтенсивний житловий розвиток у Районі ${cleanName}, набір до комунальних дитсадків має високий попит. Кожна дитина дошкільного віку має гарантоване місце, проте радимо зазначати кілька районних закладів на першому етапі реєстрації.`;
      }
      return `Район ${cleanName} пропонує чудову доступність дошкільної освіти (${rawE?.kindergartensCount ?? 0} дитсадків, понад ${kgPlaces.toLocaleString()} місць). Дітям забезпечені просторі зали, ігрові майданчики та адаптаційні заняття в безпечному середовищі.`;
    }

    if (cohort === 'school') {
      if (avgClass > 20.0) {
        return `Початкові школи в Районі ${cleanName} користуються великою популярністю серед родин (у середньому ${avgClass} учнів у класі). Рекомендуємо перевірити профіль районної школи, роботу груп продовженого дня, їдальні та спортивної бази.`;
      }
      return `Початкові школи в Районі ${cleanName} вирізняються комфортними, меншими класами (у середньому ${avgClass} учнів у класі). Це сприяє індивідуальній увазі вчителів, спокійній навчальній атмосфері та високому рівню безпеки дітей.`;
    }

    return `Район ${cleanName} створює гармонійне середовище для розвитку родини на кожному етапі — від ясел до початкових шкіл. Загалом доступно ${(
      (rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0) +
      kgPlaces +
      (rawE?.primarySchoolsCount ?? 0) * 350
    ).toLocaleString()} місць догляду та освіти в безпосередній близькості до парків і зон відпочинку.`;
  }

  // Polish default
  if (cohort === 'infant') {
    if (balance <= -750 || nurseriesPublic === 0) {
      return `W Dzielnicy ${cleanName} popyt na opiekę żłobkową istotnie przewyższa dostępną bazę placówek samorządowych (prognozowany deficyt miejsc do 2028 r.). Rekomendujemy wcześniejsze złożenie wniosku w miejskim systemie rekrutacji oraz sprawdzenie dotowanych żłobków niepublicznych i miejskiego bonu żłobkowego.`;
    }
    return `W Dzielnicy ${cleanName} infrastruktura wczesnej opieki nad dziećmi jest dobrze rozwinięta (${nurseriesTotal} placówek opieki, w tym ${nurseriesPublic} samorządowych). Rodzice mogą liczyć na stabilniejsze warunki rekrutacji, bliskość Klubów Rodziców oraz dogodne ciągi spacerowe dla wózków.`;
  }

  if (cohort === 'preschool') {
    if (kgRatio < 1.62) {
      return `Z uwagi na intensywny rozwój mieszkaniowy w Dzielnicy ${cleanName}, rekrutacja do przedszkoli samorządowych cieszy się bardzo wysokim zainteresowaniem. Każde dziecko w wieku przedszkolnym ma ustawowe prawo do miejsca, warto jednak wskazać w systemie rekrutacji kilka placówek rejonowych i filialnych.`;
    }
    return `Dzielnica ${cleanName} charakteryzuje się znakomitą dostępnością wychowania przedszkolnego (${rawE?.kindergartensCount ?? 0} przedszkoli, ponad ${kgPlaces.toLocaleString()} miejsc). Dzieci mają zapewnione przestronne sale, bezpieczne place zabaw oraz bogatą ofertę adaptacyjną w zielonym otoczeniu.`;
  }

  if (cohort === 'school') {
    if (avgClass > 20.0) {
      return `Szkoły podstawowe w Dzielnicy ${cleanName} cieszą się dużym zainteresowaniem rodzin (średnio ${avgClass} uczniów na oddział). Warto sprawdzić ofertę świetlicy szkolnej, stołówki oraz zaplecze sportowe w szkole obwodowej.`;
    }
    return `Szkoły podstawowe w Dzielnicy ${cleanName} wyróżniają się kameralnymi oddziałami (średnio ${avgClass} uczniów w klasie). Sprzyja to indywidualnemu podejściu pedagogów, spokojnej nauce oraz wysokiemu poczuciu bezpieczeństwa dzieci.`;
  }

  return `Dzielnica ${cleanName} tworzy spójne środowisko dla rozwoju rodziny na każdym etapie — od opieki żłobkowej, przez przedszkola, po szkoły podstawowe. Łącznie dostępnych jest ${(
    (rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0) +
    kgPlaces +
    (rawE?.primarySchoolsCount ?? 0) * 350
  ).toLocaleString()} miejsc edukacyjno-opiekuńczych w bliskim sąsiedztwie parków i terenów rekreacyjnych.`;
}

// Deep-Dive Drawer Localization Labels
export function getDrawerLabels(language: Language) {
  if (language === 'en') {
    return {
      recommendationBadge: 'Parent Analytical Profile & Recommendation',
      close: 'Close',
      guidelinesTitle: 'What does this mean for you as a Parent?',
      toddlersTitle: 'Toddler Population (0–3)',
      nurseryBalanceTitle: 'Nursery Places & Balance',
      nurseryInfraTitle: 'Nursery Infrastructure',
      standardTitle: 'Recruitment & Standard',
      preschoolersTitle: 'Preschool Population (4–6)',
      kgBalanceTitle: 'Kindergarten Places & Balance',
      kgInfraTitle: 'Kindergarten Network',
      kgStandardTitle: 'Preschool Accessibility',
      studentsTitle: 'Primary Students (7–14)',
      schoolBalanceTitle: 'School Network Capacity & Balance',
      schoolInfraTitle: 'Primary School Network',
      comfortTitle: 'Learning Comfort & Class Size',
      childrenAllTitle: 'Child Population (0–14)',
      allBalanceTitle: 'Edu-Care Base & Balance',
      allInfraTitle: 'Child Infrastructure',
      allStandardTitle: 'School & Care Conditions',
      childrenUnit2028: 'children (2028)',
      currently: 'Currently:',
      children: 'children',
      balanceUnit2028: 'balance 2028',
      deficitUnit2028: 'deficit 2028',
      reserveUnit2028: 'reserve 2028',
      currentBase: 'Current capacity:',
      places: 'places',
      facilities: 'facilities total',
      facilitiesTotal: 'facilities total',
      municipalWord: 'municipal',
      privateWord: 'private',
      clubsWord: 'kids clubs',
      placesPerFacility: 'places / facility',
      highAdaptation: 'High adaptation standard & family clubs',
      earlyEnrollment: 'Early enrollment in municipal system recommended',
      kindergartens: 'kindergartens',
      placesPerChild: 'places / child',
      universalAccess: 'Universal preschool education right guaranteed',
      standardEnrollment: 'Standard enrollment with multiple choices recommended',
      students: 'students (2028)',
      registeredWord: 'Registered:',
      estimatedCapacity: 'Estimated capacity:',
      primarySchools: 'primary schools',
      studentsPerClass: 'students / class',
      cosyClasses: 'Cosy class sizes with individual tutoring focus',
      normalClasses: 'Balanced school network capacity',
      denseClasses: 'Popular school network with bustling after-school clubs',
      nurseriesWord: 'nurseries',
      kindergartensWord: 'kindergartens',
      schoolsWord: 'schools',
      totalBase: 'Total capacity:',
      familyFriendlyProfile: 'Family-friendly district with comprehensive educational profile',
      avgPerKg: (avg: number) => `Avg. ${avg} places per kindergarten`,
      avgPerSchool: (avg: number) => `Avg. ${avg} students per primary school`,
    };
  }

  if (language === 'ua') {
    return {
      recommendationBadge: 'Аналітичний Профіль та Рекомендація для Батьків',
      close: 'Закрити',
      guidelinesTitle: 'Що це означає для Вас як Батьків?',
      toddlersTitle: 'Популяція Малюків (0–3)',
      nurseryBalanceTitle: 'База Ясел та Баланс',
      nurseryInfraTitle: 'Ясельна Інфраструктура',
      standardTitle: 'Умови Набору та Стандарт',
      preschoolersTitle: 'Популяція Дошкільнят (4–6)',
      kgBalanceTitle: 'База Дитсадків та Баланс',
      kgInfraTitle: 'Мережа Дитсадків',
      kgStandardTitle: 'Доступність Дошкільної Освіти',
      studentsTitle: 'Учні Початкових Шкіл (7–14)',
      schoolBalanceTitle: 'Місткість Шкіл та Баланс',
      schoolInfraTitle: 'Мережа Початкових Шкіл',
      comfortTitle: 'Освітній Комфорт та Розмір Класу',
      childrenAllTitle: 'Популяція Дітей (0–14)',
      allBalanceTitle: 'База Edu-Care та Баланс',
      allInfraTitle: 'Дитяча Інфраструктура',
      allStandardTitle: 'Шкільні та Опікунські Умови',
      childrenUnit2028: 'дітей (2028)',
      currently: 'Зараз:',
      children: 'дітей',
      balanceUnit2028: 'баланс 2028',
      deficitUnit2028: 'дефіцит 2028',
      reserveUnit2028: 'резерв 2028',
      currentBase: 'Поточна місткість:',
      places: 'місць',
      facilities: 'закладів разом',
      facilitiesTotal: 'закладів разом',
      municipalWord: 'муніципальних',
      privateWord: 'приватних',
      clubsWord: 'дитячих клубів',
      placesPerFacility: 'місць / заклад',
      highAdaptation: 'Високий адаптаційний стандарт та клуби батьків',
      earlyEnrollment: 'Рекомендовано завчасний запис у міській системі',
      kindergartens: 'дитсадків',
      placesPerChild: 'місць / дитину',
      universalAccess: 'Гарантоване право на дошкільну освіту',
      standardEnrollment: 'Стандартний набір із вибором кількох закладів',
      students: 'учнів (2028)',
      registeredWord: 'Зареєстровано:',
      estimatedCapacity: 'Розрахункова місткість:',
      primarySchools: 'початкових шкіл',
      studentsPerClass: 'учнів / клас',
      cosyClasses: 'Камерні класи з індивідуальним підходом учителів',
      normalClasses: 'Збалансована місткість шкільної мережі',
      denseClasses: 'Популярні школи з активними групами продовженого дня',
      nurseriesWord: 'ясел',
      kindergartensWord: 'дитсадків',
      schoolsWord: 'шкіл',
      totalBase: 'Загальна місткість:',
      familyFriendlyProfile: 'Сімейний район із повним освітнім профілем',
      avgPerKg: (avg: number) => `Сер. ${avg} місць на дитсадок`,
      avgPerSchool: (avg: number) => `Сер. ${avg} учнів на школу`,
    };
  }

  // Polish default
  return {
    recommendationBadge: 'Szczegółowy Profil Dzielnicy dla Rodzica',
    close: 'Zamknij',
    guidelinesTitle: 'Co to oznacza dla Ciebie jako Rodzica?',
    toddlersTitle: 'Populacja Maluchów (0–3)',
    nurseryBalanceTitle: 'Miejsca w Żłobkach & Bilans',
    nurseryInfraTitle: 'Infrastruktura Żłobkowa',
    standardTitle: 'Warunki Rekrutacji & Standard',
    preschoolersTitle: 'Populacja Przedszkolaków (4–6)',
    kgBalanceTitle: 'Miejsca w Przedszkolach & Bilans',
    kgInfraTitle: 'Sieć Przedszkoli',
    kgStandardTitle: 'Wskaźnik Dostępności Przedszkolnej',
    studentsTitle: 'Uczniowie Szkół SP (7–14)',
    schoolBalanceTitle: 'Pojemność Szkół & Bilans 2028',
    schoolInfraTitle: 'Sieć Szkół Podstawowych',
    comfortTitle: 'Komfort Nauki & Liczebność Klas',
    childrenAllTitle: 'Populacja Dzieci (0–14)',
    allBalanceTitle: 'Baza Edu-Care & Bilans',
    allInfraTitle: 'Infrastruktura Dziecięca',
    allStandardTitle: 'Warunki Szkolne i Opiekuńcze',
    childrenUnit2028: 'dzieci (2028)',
    currently: 'Obecnie:',
    children: 'dzieci',
    balanceUnit2028: 'bilans 2028',
    deficitUnit2028: 'deficyt 2028',
    reserveUnit2028: 'rezerwa 2028',
    currentBase: 'Aktualna baza:',
    places: 'miejsc',
    facilities: 'placówek ogółem',
    facilitiesTotal: 'placówek ogółem',
    municipalWord: 'samorządowych',
    privateWord: 'niepublicznych',
    clubsWord: 'klubów malucha',
    placesPerFacility: 'miejsc / placówkę',
    highAdaptation: 'Wysoki standard adaptacyjny i Kluby Rodziców',
    earlyEnrollment: 'Zalecany wczesny wniosek w systemie rekrutacji',
    kindergartens: 'przedszkoli',
    placesPerChild: 'miejsc / dziecko',
    universalAccess: 'Zagwarantowane ustawowe prawo do miejsca',
    standardEnrollment: 'Standardowa rekrutacja z wyborem kilku preferencji',
    students: 'uczniów (2028)',
    registeredWord: 'Meldunek:',
    estimatedCapacity: 'Szacowana pojemność:',
    primarySchools: 'szkół podstawowych',
    studentsPerClass: 'uczniów / oddział',
    cosyClasses: 'Kameralne klasy sprzyjające indywidualnemu podejściu',
    normalClasses: 'Zrównoważone obłożenie sal lekcyjnych',
    denseClasses: 'Popularna sieć z dynamicznymi świetlicami',
    nurseriesWord: 'żłobków',
    kindergartensWord: 'przedszkoli',
    schoolsWord: 'szkół',
    totalBase: 'Łączna baza:',
    familyFriendlyProfile: 'Dzielnica prorodzinna z pełnym profilem edukacyjnym',
    avgPerKg: (avg: number) => `Śr. ${avg} miejsc na przedszkole`,
    avgPerSchool: (avg: number) => `Śr. ${avg} uczniów na szkołę`,
  };
}

// Table Column Headers Localization
export interface TableColumnHeaders {
  district: string;
  districtPrefix: string;
  base: string;
  balance: string;
  coverage: string;
  forecast: string;
  details: string;
}

export function getTableColumnHeaders(language: Language): TableColumnHeaders {
  if (language === 'en') {
    return {
      district: 'District',
      districtPrefix: 'District',
      base: 'Current Base',
      balance: 'Places Balance (2028)',
      coverage: 'Coverage / Standard',
      forecast: 'Projected Children (2028)',
      details: 'Details',
    };
  }
  if (language === 'ua') {
    return {
      district: 'Район',
      districtPrefix: 'Район',
      base: 'Поточна База',
      balance: 'Баланс Місць (2028)',
      coverage: 'Покриття / Стандарт',
      forecast: 'Прогноз Дітей (2028)',
      details: 'Деталі',
    };
  }
  return {
    district: 'Dzielnica',
    districtPrefix: 'Dzielnica',
    base: 'Aktualna Baza',
    balance: 'Bilans Miejsc (2028)',
    coverage: 'Pokrycie / Standard',
    forecast: 'Prognoza Dzieci (2028)',
    details: 'Szczegóły',
  };
}
