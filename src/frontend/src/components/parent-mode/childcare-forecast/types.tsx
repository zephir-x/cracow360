import type React from 'react';

export type ForecastFilter = 'all' | 'whiteSpots' | 'balanced' | 'surplus';
export type ViewMode = 'grid' | 'table';

export const ITEMS_PER_PAGE = 6;

export interface DistrictStatus {
  isWhiteSpot: boolean;
  isSurplus: boolean;
  isBalanced: boolean;
}

export interface DistrictCohortData {
  placesShortLabel: string;
  placesCount: string;
  facilitiesSubtitle: string;
  balanceFormatted: string;
  balanceSubtitle: string;
  isNegativeBalance: boolean;
  forecastChildren: string;
  forecastChildrenUnit: string;
  coverageLabel: string;
  coverageValue: string;
  progressPercent: number;
  status: DistrictStatus;
}

export interface MacroIndicators {
  balance: number;
  criticalDistricts: number;
  coveragePct: number;
  projectedChildren: number;
}

export interface MacroPillDescriptions {
  balanceSub: string;
  criticalSub: string;
  coverageSub: string;
  childrenSub: string;
}

export interface MacroTitles {
  balance: string;
  whiteSpots: string;
  coverage: string;
  demand: string;
}

export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage, '...', totalPages];
}

/// <summary>
/// Splits title to cleanly highlight (2028 Forecast) in brand blue without duplicate text or line breaks.
/// </summary>
export function formatTitleWithBlueAccent(title: string): React.ReactNode {
  const patterns = ['(Prognoza 2028)', '(2028 Forecast)', '(Прогноз 2028)'];
  for (const pat of patterns) {
    if (title.includes(pat)) {
      const base = title.replace(pat, '').trim();
      return (
        <span className="inline">
          <span>{base}</span>{' '}
          <span className="inline-block text-blue-600 font-black">{pat}</span>
        </span>
      );
    }
  }
  return <span>{title}</span>;
}
