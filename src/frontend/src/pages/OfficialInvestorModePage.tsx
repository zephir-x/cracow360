import { DemographicPotentialSection } from '../components/investor-mode/DemographicPotentialSection';
import { InvestorForecastSection } from '../components/investor-mode/forecast-2028/InvestorForecastSection';
import { InvestorHeroHeader } from '../components/investor-mode/InvestorHeroHeader';
import type { DistrictSummaryDto } from '../types/contracts';

export interface OfficialInvestorModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode: () => void;
}

/// <summary>
/// Official and Investor mode orchestrator page offering demographic projections
/// and what-if decision support simulator for municipal infrastructure.
/// </summary>
export function OfficialInvestorModePage({
  districts,
  onBackToResidentMode,
}: OfficialInvestorModePageProps) {
  return (
    <div className="space-y-8">
      {/* Hero Header with Navigation, 4 Unique Stats Cards, and Collapsible Capabilities Drawer */}
      <InvestorHeroHeader districts={districts} onBackToResidentMode={onBackToResidentMode} />

      {/* Overview of Districts in Vitality Ranking (TOP 6) */}
      <DemographicPotentialSection districts={districts} />

      {/* 2028 Demographic Projections & B2B/B2G Investment Decision Support */}
      <InvestorForecastSection districts={districts} />
    </div>
  );
}
