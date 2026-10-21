import { EducationRankingSection } from '../components/parent-mode/EducationRankingSection';
import { FacilityExplorerSection } from '../components/parent-mode/FacilityExplorerSection';
import { ParentCapabilitiesGrid } from '../components/parent-mode/ParentCapabilitiesGrid';
import { ParentHeroHeader } from '../components/parent-mode/ParentHeroHeader';
import type { DistrictSummaryDto } from '../types/contracts';

export interface ParentModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode: () => void;
}

/// <summary>
/// Parent & Family mode orchestrator page presenting walking accessibility isochrones,
/// district childcare rankings, and a live POI facility explorer.
/// </summary>
export function ParentModePage({ districts, onBackToResidentMode }: ParentModePageProps) {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <ParentHeroHeader onBackToResidentMode={onBackToResidentMode} />

      {/* Planned Features Grid */}
      <ParentCapabilitiesGrid />

      {/* Live Preview of Top 6 Districts in Education & Childcare Category */}
      <EducationRankingSection districts={districts} />

      {/* Live Interactive POI Facility Explorer */}
      <FacilityExplorerSection districts={districts} />
    </div>
  );
}
