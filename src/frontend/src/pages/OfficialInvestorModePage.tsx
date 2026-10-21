import { DemographicPotentialSection } from '../components/investor-mode/DemographicPotentialSection';
import { InvestorCapabilitiesGrid } from '../components/investor-mode/InvestorCapabilitiesGrid';
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
      {/* Hero Header */}
      <InvestorHeroHeader onBackToResidentMode={onBackToResidentMode} />

      {/* Module 3 Capabilities */}
      <InvestorCapabilitiesGrid />

      {/* Overview of Districts Requiring Municipal Investment */}
      <DemographicPotentialSection districts={districts} />
    </div>
  );
}
