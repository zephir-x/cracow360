import type { Language } from '../types';
import type { DistrictDetailsDto } from '../../types/contracts';
import type { ChildAgeCohort } from '../../components/parent-mode/FamilyAgeCohortSelector';
import type {
  MacroPillDescriptions,
  MacroTitles,
} from '../../components/parent-mode/childcare-forecast/types';

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

export function formatFacilitiesTotalLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? '1 facility total' : `${count} facilities total`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} заклад разом`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} заклади разом`;
    return `${count} закладів разом`;
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return '1 placówka ogółem';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} placówki ogółem`;
  }
  return `${count} placówek ogółem`;
}

export function formatKindergartensLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? '1 kindergarten' : `${count} kindergartens`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return `${count} дитсадок`;
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

// Localized Macro Titles & Current State Descriptions
export function getMacroTitles(cohort: ChildAgeCohort, language: Language): MacroTitles {
  if (language === 'en') {
    if (cohort === 'infant') {
      return {
        balance: 'Places Balance',
        whiteSpots: 'Districts with Deficit',
        coverage: 'Average Demand Coverage',
        demand: 'Toddler Population (0–3)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balance: 'Places Balance',
        whiteSpots: 'High Demand Districts',
        coverage: 'Average Demand Coverage',
        demand: 'Preschool Population (4–6)',
      };
    }
    if (cohort === 'school') {
      return {
        balance: 'Places Balance',
        whiteSpots: 'High Density Classes',
        coverage: 'Average Demand Coverage',
        demand: 'School Age Children (7–14)',
      };
    }
    return {
      balance: 'Places Balance',
      whiteSpots: 'Tight Balance Districts',
      coverage: 'Average Demand Coverage',
      demand: 'Total Child Population (0–14)',
    };
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      return {
        balance: 'Баланс Місць',
        whiteSpots: 'Райони з Дефіцитом',
        coverage: 'Середнє Покриття Попиту',
        demand: 'Популяція Малюків (0–3)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balance: 'Баланс Місць',
        whiteSpots: 'Райони з Вищим Попитом',
        coverage: 'Середнє Покриття Попиту',
        demand: 'Популяція Дошкільнят (4–6)',
      };
    }
    if (cohort === 'school') {
      return {
        balance: 'Баланс Місць',
        whiteSpots: 'Класи з Вищою Щільністю',
        coverage: 'Середнє Покриття Попиту',
        demand: 'Діти Шкільного Віку (7–14)',
      };
    }
    return {
      balance: 'Баланс Місць',
      whiteSpots: 'Райони зі Щільним Балансом',
      coverage: 'Середнє Покриття Попиту',
      demand: 'Загальна Популяція Дітей (0–14)',
    };
  }

  // Polish default
  if (cohort === 'infant') {
    return {
      balance: 'Aktualny Bilans Miejsc',
      whiteSpots: 'Dzielnice z Deficytem',
      coverage: 'Średnie Pokrycie Popytu',
      demand: 'Populacja Maluchów (0–3)',
    };
  }
  if (cohort === 'preschool') {
    return {
      balance: 'Aktualny Bilans Miejsc',
      whiteSpots: 'Dzielnice o Wyższym Popycie',
      coverage: 'Średnie Pokrycie Popytu',
      demand: 'Populacja Przedszkolaków (4–6)',
    };
  }
  if (cohort === 'school') {
    return {
      balance: 'Aktualny Bilans Miejsc',
      whiteSpots: 'Oddziały z Zagęszczeniem',
      coverage: 'Średnie Pokrycie Popytu',
      demand: 'Dzieci w Wieku Szkolnym (7–14)',
    };
  }
  return {
    balance: 'Aktualny Bilans Miejsc',
    whiteSpots: 'Dzielnice z Napiętym Bilansem',
    coverage: 'Średnie Pokrycie Popytu',
    demand: 'Łączna Populacja Dzieci (0–14)',
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
        balanceSub: 'Supply gap in early nursery care',
        criticalSub: 'White spots of 0–3 care deficit',
        coverageSub: 'Care needs satisfaction rate',
        childrenSub: 'Children aged 0–3 years (current count)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balanceSub: 'Recruitment surplus of kindergarten places',
        criticalSub: 'Districts with tighter reserve buffer (<1.62x)',
        coverageSub: 'Capacity ratio relative to 4–6 cohorts (1.53x)',
        childrenSub: 'Children aged 4–6 years (current count)',
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
      balanceSub: 'Current municipal supply balance',
      criticalSub: 'Districts with deficit or urgent place shortage',
      coverageSub: 'Total municipal demand satisfaction rate',
      childrenSub: 'Current child population (0–14)',
    };
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      return {
        balanceSub: 'Дефіцит пропозиції ясельного догляду',
        criticalSub: 'Білі плями дефіциту догляду 0–3',
        coverageSub: 'Показник задоволення потреб догляду',
        childrenSub: 'Діти віком 0–3 роки (поточний стан)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balanceSub: 'Набірний надлишок місць у дитсадках',
        criticalSub: 'Райони з меншим буфером резерву (<1.62x)',
        coverageSub: 'Місткість місць відносно дітей 4–6 років (1.53x)',
        childrenSub: 'Діти віком 4–6 років (поточний стан)',
      };
    }
    if (cohort === 'school') {
      return {
        balanceSub: 'Резерв місткості для районних класів',
        criticalSub: 'Райони із середнім >20 учнів / клас',
        coverageSub: 'Показник забезпеченості місцями для учнів',
        childrenSub: 'Діти віком 7–14 років (зареєстровані мешканці)',
      };
    }
    return {
      balanceSub: 'Поточний муніципальний баланс пропозиції',
      criticalSub: 'Райони з дефіцитом або гострою нестачею місць',
      coverageSub: 'Загальний муніципальний рівень покриття попиту',
      childrenSub: 'Поточна популяція дітей (0–14)',
    };
  }

  // Polish default
  if (cohort === 'infant') {
    return {
      balanceSub: 'Bieżąca luka podażowa opieki żłobkowej',
      criticalSub: 'Białe plamy deficytu opieki 0–3',
      coverageSub: 'Wskaźnik zaspokojenia potrzeb opiekuńczych',
      childrenSub: 'Dzieci w wieku 0–3 lat (stan bieżący)',
    };
  }
  if (cohort === 'preschool') {
    return {
      balanceSub: 'Nadwyżka rekrutacyjna miejsc przedszkolnych',
      criticalSub: 'Dzielnice o niższym buforze rezerwy (<1.62x)',
      coverageSub: 'Baza miejsc w relacji do roczników 4–6 (1.53x)',
      childrenSub: 'Dzieci w wieku 4–6 lat (stan bieżący)',
    };
  }
  if (cohort === 'school') {
    return {
      balanceSub: 'Rezerwa pojemności dla roczników rejonowych',
      criticalSub: 'Dzielnice ze średnią >20 uczniów / oddział',
      coverageSub: 'Wskaźnik zabezpieczenia bazy dla roczników SP',
      childrenSub: 'Dzieci w wieku 7–14 lat (meldunki BDK)',
    };
  }
  return {
    balanceSub: 'Bieżąca równowaga podaży miejskiej',
    criticalSub: 'Dzielnice z deficytem lub pilnym brakiem miejsc',
    coverageSub: 'Ogólnomiejski stopień zaspokojenia potrzeb rodzin',
    childrenSub: 'Dzieci objęte opieką i edukacją (0–14 lat)',
  };
}

// Parent Practical Insight & Deep Dive
export function getParentPracticalInsight(
  district: DistrictDetailsDto,
  cohort: ChildAgeCohort,
  language: Language
): string {
  const cleanName = district.districtName.replace(/^(Dzielnica|Район|District)\s+/i, '');
  const rawD = district.demographics as any;
  const rawE = district.educationAndCare as any;

  const carePlaces03: number = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
  const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const balance: number = carePlaces03 - c03;
  const nurseriesPublic: number = rawE?.nurseriesPublicCount ?? 0;
  const nurseriesTotal: number =
    nurseriesPublic +
    (rawE?.nurseriesContractedCount ?? 0) +
    (rawE?.nurseriesPrivateCount ?? 0) +
    (rawE?.kidsClubsCount ?? 0);
  const kgPlaces: number = rawE?.kindergartenPlacesTotal ?? 0;
  const c46: number = rawD?.age4To6 ?? rawD?.age4to6 ?? 1;
  const kgRatio = kgPlaces / Math.max(1, c46);
  const avgClass: number = rawE?.avgStudentsPerClass ?? 0;

  if (language === 'en') {
    if (cohort === 'infant') {
      if (balance <= -750 || nurseriesPublic === 0) {
        return `In District ${cleanName}, demand for nursery care significantly exceeds available capacity in municipal facilities (current places deficit). We recommend submitting an application in the municipal enrollment system well in advance and exploring subsidized private nurseries and city childcare programs.`;
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
        return `У Районі ${cleanName} попит на ясельний догляд значно перевищує місткість муніципальних закладів (поточний дефіцит місць). Рекомендуємо подавати заявку в міській системі набору завчасно та ознайомитися з пропозиціями субсидованих приватних ясел і міських програм підтримки.`;
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
      return `W Dzielnicy ${cleanName} popyt na opiekę żłobkową istotnie przewyższa dostępną bazę placówek samorządowych (bieżący deficyt miejsc). Rekomendujemy wcześniejsze złożenie wniosku w miejskim systemie rekrutacji oraz sprawdzenie dotowanych żłobków niepublicznych i miejskiego bonu żłobkowego.`;
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
      studentsTitle: 'School Age Children (7–14)',
      schoolBalanceTitle: 'School Network Capacity & Balance',
      schoolInfraTitle: 'Primary School Network',
      comfortTitle: 'Learning Comfort & Class Size',
      childrenAllTitle: 'Child Population (0–14)',
      allBalanceTitle: 'Edu-Care Base & Balance',
      allInfraTitle: 'Child Infrastructure',
      allStandardTitle: 'School & Care Conditions',
      childrenUnit: 'children',
      currently: 'Currently:',
      children: 'children',
      balanceUnit: 'places balance',
      deficitUnit: 'places deficit',
      reserveUnit: 'places reserve',
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
      students: 'students',
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
      studentsTitle: 'Діти Шкільного Віку (7–14)',
      schoolBalanceTitle: 'Місткість Шкіл та Баланс',
      schoolInfraTitle: 'Мережа Початкових Шкіл',
      comfortTitle: 'Освітній Комфорт та Розмір Класу',
      childrenAllTitle: 'Популяція Дітей (0–14)',
      allBalanceTitle: 'База Edu-Care та Баланс',
      allInfraTitle: 'Дитяча Інфраструктура',
      allStandardTitle: 'Шкільні та Опікунські Умови',
      childrenUnit: 'дітей',
      currently: 'Зараз:',
      children: 'дітей',
      balanceUnit: 'баланс місць',
      deficitUnit: 'дефіцит місць',
      reserveUnit: 'резерв місць',
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
      students: 'учнів',
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
    studentsTitle: 'Dzieci w Wieku Szkolnym (7–14)',
    schoolBalanceTitle: 'Pojemność Szkół & Bilans',
    schoolInfraTitle: 'Sieć Szkół Podstawowych',
    comfortTitle: 'Komfort Nauki & Liczebność Klas',
    childrenAllTitle: 'Populacja Dzieci (0–14)',
    allBalanceTitle: 'Baza Edu-Care & Bilans',
    allInfraTitle: 'Infrastruktura Dziecięca',
    allStandardTitle: 'Warunki Szkolne i Opiekuńcze',
    childrenUnit: 'dzieci',
    currently: 'Obecnie:',
    children: 'dzieci',
    balanceUnit: 'bilans miejsc',
    deficitUnit: 'deficyt miejsc',
    reserveUnit: 'rezerwa miejsc',
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
    students: 'uczniów',
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
      balance: 'Current Places Balance',
      coverage: 'Coverage / Standard',
      forecast: 'Child Population',
      details: 'Details',
    };
  }
  if (language === 'ua') {
    return {
      district: 'Район',
      districtPrefix: 'Район',
      base: 'Поточна База',
      balance: 'Поточний Баланс Місць',
      coverage: 'Покриття / Стандарт',
      forecast: 'Кількість Дітей',
      details: 'Деталі',
    };
  }
  return {
    district: 'Dzielnica',
    districtPrefix: 'Dzielnica',
    base: 'Aktualna Baza',
    balance: 'Aktualny Bilans Miejsc',
    coverage: 'Pokrycie / Standard',
    forecast: 'Liczba Dzieci',
    details: 'Szczegóły',
  };
}


export const CHILDCARE_FORECAST_I18N = {
  pl: {
    title: 'Bilans Miejsc Edukacji i Opieki (Stan Bieżący)',
      subtitle: 'Zintegrowana analiza podaży placówek opiekuńczych i edukacyjnych w relacji do bieżącej demografii 18 dzielnic Krakowa',
      badge: 'Rejestr Edu-Care GMK & Demografia BDK',
      statDeficitTotalLabel: 'Deficyt Miejsc w Mieście',
      statDeficitTotalSub: 'Łączna bieżąca luka podażowa',
      statWhiteSpotsLabel: 'Dzielnice – Białe Plamy',
      statWhiteSpotsSub: 'Strefy krytycznego deficytu opieki',
      statCityCoverageLabel: 'Średnie Pokrycie Żłobkowe',
      statCityCoverageSub: 'Standard Barcelona: cel min. 45%',
      statDemand0To3Label: 'Populacja Maluchów (0–3)',
      statDemand0To3Sub: 'Liczba dzieci w wieku żłobkowym (stan bieżący)',
      filterAll: 'Wszystkie Dzielnice',
      filterWhiteSpots: 'Białe Plamy (Wysoki Deficyt)',
      filterBalanced: 'Zrównoważony Rynek',
      filterSurplus: 'Wysoka Dostępność',
      whiteSpotBadge: 'Biała Plama (Wysoki Deficyt)',
      balancedBadge: 'Rynek Zrównoważony',
      surplusBadge: 'Wysoka Dostępność',
      coverageRateLabel: 'Pokrycie Popytu',
      placesCountLabel: 'Miejsca w Żłobkach',
      demand0To3Label: 'Dzieci 0–3 (Stan Bieżący)',
      balancePlacesLabel: 'Aktualny Bilans Miejsc',
      b2bPotentialLabel: 'Priorytet Rozbudowy Placówek',
      recommendationTitle: 'Szczegółowy Profil Dzielnicy dla Rodzica',
      selectDistrictPrompt: 'Kliknij dowolną dzielnicę poniżej, aby zobaczyć szczegółowy profil analityczny i wskazówki dla rodzica.',
      placesUnit: 'miejsc',
      childrenUnit: 'dzieci',
      coverageUnit: '%',
      b2bHigh: 'Pilna Potrzeba Nowych Miejsc',
      b2bMedium: 'Umiarkowane Zapotrzebowanie',
      b2bLow: 'Wystarczająca Baza Miejsc',
      closeCard: 'Zamknij',
      publicNurseriesLabel: 'Żłobki Samorządowe',
      privateNurseriesLabel: 'Żłobki Prywatne & Dotowane',
      kindergartensPlacesLabel: 'Miejsca w Przedszkolach',
      primaryStudentsLabel: 'Uczniowie Szkół Podstawowych',
      municipalBadge: 'samorządowe',
      subsidizedBadge: 'niepubliczne & GMK',
      facilitiesInCount: (count: number) => `w ${count} placówkach`,
      avgPerClass: (avg: number) => `śr. ${avg} w klasie`,
      recommendationActionBtn: 'Szczegóły',
      showingDistricts: (from: number, to: number, total: number) => `Wyświetlanie ${from}–${to} z ${total} dzielnic`,
      prevPage: 'Poprzednia',
      nextPage: 'Następna',
      strategicGuidelines: 'Co to oznacza dla Ciebie jako Rodzica?',
      cohortTitles: {
        all: 'Kompleksowy Bilans Edukacji i Opieki (Stan Bieżący)',
        infant: 'Bilans Miejsc Opieki Żłobkowej (Stan Bieżący)',
        preschool: 'Dostępność i Bilans Miejsc w Przedszkolach (Stan Bieżący)',
        school: 'Infrastruktura Szkół Podstawowych i Zagęszczenie Klas (Stan Bieżący)',
      },
      cohortSubtitles: {
        all: 'Zintegrowana analiza żłobków, przedszkoli i szkół podstawowych w relacji do bieżącej demografii 18 dzielnic Krakowa',
        infant: 'Bieżąca analiza zapotrzebowania i identyfikacja dzielnic z niedoborem miejsc dla maluchów',
        preschool: 'Pojemność przedszkolna dzielnic w relacji do bieżącej populacji dzieci w wieku 4–6 lat',
        school: 'Pojemność szkół podstawowych, wielkość oddziałów klasowych oraz przyszkolna infrastruktura sportowa',
      },
      kgCoverageLabel: 'Pokrycie Popytu Przedszkolnego',
      kgCoverageSub: 'Powszechna dostępność miejsc w Krakowie',
      kgPlacesLabel: 'Miejsca w Przedszkolach',
      kgPlacesSub: 'Pojemność placówek samorządowych i dotowanych',
      kgDemandLabel: 'Populacja Przedszkolaków (4–6)',
      kgDemandSub: 'Liczba dzieci w wieku 4–6 lat (stan bieżący)',
      kgFacilitiesCountLabel: 'Przedszkola w Dzielnicy',
      kgFacilitiesCountSub: 'Liczba działających przedszkoli',
      schoolStudentsTotalLabel: 'Uczniowie Szkół Podstawowych',
      schoolStudentsTotalSub: 'Łączna liczba uczniów w krakowskich szkołach',
      schoolAvgClassLabel: 'Średnia Wielkość Klasy',
      schoolAvgClassSub: 'Norma miejska: do 20–22 uczniów w oddziale',
      schoolCountLabel: 'Szkoły Podstawowe w Mieście',
      schoolCountSub: 'Sieć placówek samorządowych i społecznych',
      schoolPoolsLabel: 'Przyszkolne Pływalnie',
      schoolPoolsSub: 'Baseny i infrastruktura sportowa',
      classSizeLabel: 'Średnia wielkość klasy',
      studentsUnit: 'uczniów',
      schoolsUnit: 'szkół',
      kindergartensUnit: 'przedszkoli',
      kgCriticalDistrictsLabel: 'Dzielnice o Niższej Bazie (<1.2k)',
      kgCriticalDistrictsSub: 'Wymagają uzupełnienia bazy przedszkolnej',
      schoolBalanceLabel: 'Bilans Miejsc w Szkołach',
      schoolBalanceSub: 'Rezerwa pojemności sieci szkół podstawowych',
      schoolCriticalDistrictsLabel: 'Dzielnice z Zagęszczeniem Klas',
      schoolCriticalDistrictsSub: 'Średnia liczebność oddziału powyżej 20 osób',
      schoolCoverageLabel: 'Średnie Pokrycie Popytu',
      schoolCoverageSub: 'Wskaźnik zaspokojenia potrzeb rejonowych',
      allBalanceLabel: 'Łączny Bilans Miejsc (0–14)',
      allBalanceSub: 'Sumaryczny bilans żłobków, przedszkoli i szkół',
      allCriticalDistrictsLabel: 'Dzielnice Krytyczne (Białe Plamy)',
      allCriticalDistrictsSub: 'Dzielnice z deficytem opieki maluchów',
      allCoverageLabel: 'Średnie Pokrycie Popytu',
      allCoverageSub: 'Zagregowane pokrycie dla wszystkich etapów',
      allChildrenTotalLabel: 'Łączna Liczba Dzieci (0–14 lat)',
      allChildrenTotalSub: 'Meldunki BDK we wszystkich grupach wiekowych',
      switcherTitle: 'Przełącz profil wiekowy',
      viewGrid: 'Siatka',
      viewTable: 'Tabela',
      tableColumns: {
        district: 'Dzielnica',
        balance: 'Bilans miejsc',
        coverage: 'Pokrycie popytu',
        children: 'Liczba dzieci',
        status: 'Status rynku',
        action: 'Akcja',
      },
  },
  en: {
    title: 'Education & Childcare Places Balance (Current)',
      subtitle: 'Comparison of available places in nurseries, kindergartens, and schools with the current child population across 18 Krakow districts',
      badge: 'Krakow Edu-Care Registry & Demographics',
      statDeficitTotalLabel: 'Total City Care Deficit',
      statDeficitTotalSub: 'Combined current supply gap',
      statWhiteSpotsLabel: 'Districts with Shortage',
      statWhiteSpotsSub: 'Zones with severe childcare deficits',
      statCityCoverageLabel: 'Average Nursery Coverage',
      statCityCoverageSub: 'Target standard: min. 45%',
      statDemand0To3Label: 'Toddler Population (0–3)',
      statDemand0To3Sub: 'Children in nursery age (current count)',
      filterAll: 'All Districts',
      filterWhiteSpots: 'Shortages (Deficit)',
      filterBalanced: 'Balanced Supply',
      filterSurplus: 'High Place Availability',
      whiteSpotBadge: 'Shortage (Deficit)',
      balancedBadge: 'Good Availability',
      surplusBadge: 'High Availability',
      coverageRateLabel: 'Demand Coverage',
      placesCountLabel: 'Nursery Places',
      demand0To3Label: 'Children 0–3 (Current)',
      balancePlacesLabel: 'Current Places Balance',
      b2bPotentialLabel: 'Need for New Facilities',
      recommendationTitle: 'Detailed District Profile for Parents',
      selectDistrictPrompt: 'Click any district above to inspect detailed profile and summary for parents.',
      placesUnit: 'places',
      childrenUnit: 'children',
      coverageUnit: '%',
      b2bHigh: 'Urgent Need for Expansion',
      b2bMedium: 'Moderate Need',
      b2bLow: 'Good Availability',
      closeCard: 'Close',
      publicNurseriesLabel: 'Municipal Nurseries',
      privateNurseriesLabel: 'Private & Contracted Nurseries',
      kindergartensPlacesLabel: 'Kindergarten Places',
      primaryStudentsLabel: 'Primary School Students',
      municipalBadge: 'municipal',
      subsidizedBadge: 'private & subsidized',
      facilitiesInCount: (count: number) => `in ${count} facilities`,
      avgPerClass: (avg: number) => `avg. ${avg} / class`,
      recommendationActionBtn: 'Details',
      showingDistricts: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total} districts`,
      prevPage: 'Previous',
      nextPage: 'Next',
      strategicGuidelines: 'What does this mean for you as a parent?',
      cohortTitles: {
        all: 'Comprehensive Education & Childcare Balance (Current)',
        infant: 'Nursery Childcare Places Balance (Current)',
        preschool: 'Kindergarten Availability & Capacity Balance (Current)',
        school: 'Primary School Infrastructure & Class Density (Current)',
      },
      cohortSubtitles: {
        all: 'Integrated analysis of nurseries, kindergartens, and primary schools across all 18 Krakow districts',
        infant: 'Current demographic absorption analysis and identification of toddler care deficit zones',
        preschool: 'Kindergarten capacity across districts compared to current population of children aged 4–6',
        school: 'Primary school student capacities, average class size, and school sports infrastructure',
      },
      kgCoverageLabel: 'Kindergarten Demand Coverage',
      kgCoverageSub: 'Universal preschool coverage across Krakow',
      kgPlacesLabel: 'Kindergarten Places',
      kgPlacesSub: 'Total capacity in municipal and subsidized facilities',
      kgDemandLabel: 'Preschool Population (4–6)',
      kgDemandSub: 'Children aged 4–6 years (current count)',
      kgFacilitiesCountLabel: 'Kindergartens in District',
      kgFacilitiesCountSub: 'Total active kindergarten institutions',
      schoolStudentsTotalLabel: 'Primary School Students',
      schoolStudentsTotalSub: 'Total enrolled students across Krakow schools',
      schoolAvgClassLabel: 'Average Class Size',
      schoolAvgClassSub: 'Municipal guideline: under 20–22 per class',
      schoolCountLabel: 'Primary Schools in City',
      schoolCountSub: 'Network of municipal and public schools',
      schoolPoolsLabel: 'School Swimming Pools',
      schoolPoolsSub: 'Pools and municipal sports centers',
      classSizeLabel: 'Average class size',
      studentsUnit: 'students',
      schoolsUnit: 'schools',
      kindergartensUnit: 'kindergartens',
      kgCriticalDistrictsLabel: 'Districts with Lower Base (<1.2k)',
      kgCriticalDistrictsSub: 'Require expansion of preschool supply',
      schoolBalanceLabel: 'Primary School Capacity Balance',
      schoolBalanceSub: 'Capacity reserve across primary school network',
      schoolCriticalDistrictsLabel: 'Districts with Dense Classrooms',
      schoolCriticalDistrictsSub: 'Average class size exceeding 20 students',
      schoolCoverageLabel: 'Average Demand Coverage',
      schoolCoverageSub: 'Catchment zone capacity satisfaction rate',
      allBalanceLabel: 'Combined Places Balance (0–14)',
      allBalanceSub: 'Aggregated balance of nurseries, kindergartens & schools',
      allCriticalDistrictsLabel: 'Districts with Shortages',
      allCriticalDistrictsSub: 'Districts with toddler care supply gaps',
      allCoverageLabel: 'Average Demand Coverage',
      allCoverageSub: 'Aggregated coverage across all three age stages',
      allChildrenTotalLabel: 'Total Children (0–14 years)',
      allChildrenTotalSub: 'BDK registries across all child age brackets',
      switcherTitle: 'Switch child age profile',
      viewGrid: 'Grid',
      viewTable: 'Table',
      tableColumns: {
        district: 'District',
        balance: 'Places Balance',
        coverage: 'Demand Coverage',
        children: 'Child Population',
        status: 'Availability',
        action: 'Action',
      },
  },
  ua: {
    title: 'Баланс Місць Освіти та Опіки (Поточний стан)',
      subtitle: 'Порівняння кількості місць у яслах, дитсадках і школах із поточною кількістю дітей у 18 районах Кракова',
      badge: 'Реєстр Закладів та Демографія Кракова',
      statDeficitTotalLabel: 'Загальний Дефіцит Місць у Місті',
      statDeficitTotalSub: 'Сукупна нестача місць',
      statWhiteSpotsLabel: 'Райони з Дефіцитом',
      statWhiteSpotsSub: 'Зони відчутного браку місць',
      statCityCoverageLabel: 'Середнє Покриття Яслами',
      statCityCoverageSub: 'Цільовий стандарт: мін. 45%',
      statDemand0To3Label: 'Популяція Малюків (0–3)',
      statDemand0To3Sub: 'Кількість дітей ясельного віку (поточний стан)',
      filterAll: 'Усі Райони',
      filterWhiteSpots: 'Брак Місць (Дефіцит)',
      filterBalanced: 'Збалансована Пропозиція',
      filterSurplus: 'Висока Доступність Місць',
      whiteSpotBadge: 'Брак Місць (Дефіцит)',
      balancedBadge: 'Добра Доступність',
      surplusBadge: 'Висока Доступність',
      coverageRateLabel: 'Рівень Покриття Яслами',
      placesCountLabel: 'Місць у Яслах',
      demand0To3Label: 'Діти 0–3 (Поточний стан)',
      balancePlacesLabel: 'Поточний Баланс Місць',
      b2bPotentialLabel: 'Потреба в Нових Закладах',
      recommendationTitle: 'Детальний Профіль Району для Батьків',
      selectDistrictPrompt: 'Натисніть на будь-який район нижче, щоб переглянути детальний профіль та підказки для батьків.',
      placesUnit: 'місць',
      childrenUnit: 'дітей',
      coverageUnit: '%',
      b2bHigh: 'Нагальна Потреба Розширення',
      b2bMedium: 'Помірна Потреба',
      b2bLow: 'Добра Доступність',
      closeCard: 'Закрити',
      publicNurseriesLabel: 'Комунальні Ясла',
      privateNurseriesLabel: 'Приватні та Дотовані Ясла',
      kindergartensPlacesLabel: 'Місць у Дитсадках',
      primaryStudentsLabel: 'Учні Початкових Шкіл',
      municipalBadge: 'комунальні',
      subsidizedBadge: 'дотовані та приватні',
      facilitiesInCount: (count: number) => `у ${count} закладах`,
      avgPerClass: (avg: number) => `сер. ${avg} у класі`,
      recommendationActionBtn: 'Деталі',
      showingDistricts: (from: number, to: number, total: number) => `Відображення ${from}–${to} з ${total} районів`,
      prevPage: 'Попередня',
      nextPage: 'Наступна',
      strategicGuidelines: 'Що це означає для вас як батьків?',
      cohortTitles: {
        all: 'Комплексний баланс освіти та опіки (Поточний стан)',
        infant: 'Баланс місць догляду за дітьми (Поточний стан)',
        preschool: 'Доступність та баланс місць у дитсадках (Поточний стан)',
        school: 'Інфраструктура початкових шкіл та наповненість класів (Поточний стан)',
      },
      cohortSubtitles: {
        all: 'Інтегрований аналіз ясел, дитсадків та початкових шкіл у розрізі 18 районів Кракова',
        infant: 'Поточний аналіз демографічної місткості та виявлення зон дефіциту ясел для малюків',
        preschool: 'Місткість дитсадків району порівняно з поточною кількістю дітей 4–6 років',
        school: 'Місткість початкових шкіл, розмір класів та шкільна спортивна інфраструктура',
      },
      kgCoverageLabel: 'Покриття попиту в дитсадках',
      kgCoverageSub: 'Загальна доступність місць у Кракові',
      kgPlacesLabel: 'Місць у дитсадках',
      kgPlacesSub: 'Місткість комунальних та субсидованих закладів',
      kgDemandLabel: 'Популяція дошкільнят (4–6)',
      kgDemandSub: 'Кількість дітей віком 4–6 років (поточний стан)',
      kgFacilitiesCountLabel: 'Дитсадків у районі',
      kgFacilitiesCountSub: 'Кількість діючих дитсадків',
      schoolStudentsTotalLabel: 'Учні початкових шкіл',
      schoolStudentsTotalSub: 'Загальна кількість учнів у краківських школах',
      schoolAvgClassLabel: 'Середній розмір класу',
      schoolAvgClassSub: 'Муніципальна норма: до 20–22 учнів у класі',
      schoolCountLabel: 'Початкові школи в місті',
      schoolCountSub: 'Мережа комунальних та громадських шкіл',
      schoolPoolsLabel: 'Шкільні басейни',
      schoolPoolsSub: 'Басейни та спортивна інфраструктура',
      classSizeLabel: 'Середній розмір класу',
      studentsUnit: 'учнів',
      schoolsUnit: 'шкіл',
      kindergartensUnit: 'дитсадків',
      kgCriticalDistrictsLabel: 'Райони з Меншою Базою (<1.2k)',
      kgCriticalDistrictsSub: 'Потребують розширення мережі дитсадків',
      schoolBalanceLabel: 'Баланс Місць у Школах',
      schoolBalanceSub: 'Резерв місткості початкових шкіл',
      schoolCriticalDistrictsLabel: 'Райони з Переповненими Класами',
      schoolCriticalDistrictsSub: 'Середня кількість учнів понад 20 осіб',
      schoolCoverageLabel: 'Середнє Покриття Попиту',
      schoolCoverageSub: 'Рівень задоволення потреб району',
      allBalanceLabel: 'Сукупний Баланс Місць (0–14)',
      allBalanceSub: 'Загальний баланс ясел, дитсадків та шкіл',
      allCriticalDistrictsLabel: 'Райони з Нестачею Місць',
      allCriticalDistrictsSub: 'Райони із дефіцитом місць для малюків',
      allCoverageLabel: 'Середнє Покриття Попиту',
      allCoverageSub: 'Загальне покриття для всіх вікових груп',
      allChildrenTotalLabel: 'Загальна Кількість Дітей (0–14 років)',
      allChildrenTotalSub: 'Реєстр BDK по всіх вікових категоріях',
      switcherTitle: 'Перемикання вікового профілю',
      viewGrid: 'Сітка',
      viewTable: 'Таблиця',
      tableColumns: {
        district: 'Район',
        balance: 'Баланс місць',
        coverage: 'Покриття попиту',
        children: 'Кількість дітей',
        status: 'Доступність',
        action: 'Дія',
      },
  },
};

export type ChildcareForecastLabels = typeof CHILDCARE_FORECAST_I18N.pl;

export function getChildcareForecastLabels(language: Language): ChildcareForecastLabels {
  return CHILDCARE_FORECAST_I18N[language] ?? CHILDCARE_FORECAST_I18N.pl;
}
