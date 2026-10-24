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
  placesRaw: number;
  facilitiesSubtitle: string;
  balanceFormatted: string;
  balanceRaw: number;
  balanceSubtitle: string;
  isNegativeBalance: boolean;
  forecastChildren: string;
  forecastChildrenUnit: string;
  coverageLabel: string;
  coverageValue: string;
  progressPercent: number;
  status: DistrictStatus;
  statusBadge: string;
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
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export function renderHighlightedTitle(title: string, _language?: string): React.ReactNode {
  const triggers = ['(Stan Bieżący)', '(Current)', '(Поточний стан)'];
  for (const trigger of triggers) {
    if (title.includes(trigger)) {
      const parts = title.split(trigger);
      return (
        <>
          {parts[0]}
          <span className="text-blue-600 font-bold">{trigger}</span>
          {parts[1]}
        </>
      );
    }
  }
  return title;
}

export const formatTitleWithBlueAccent = renderHighlightedTitle;
