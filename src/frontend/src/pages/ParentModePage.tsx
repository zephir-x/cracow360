import { useState } from 'react';
import { EducationRankingSection } from '../components/parent-mode/EducationRankingSection';
import { FacilityExplorerSection } from '../components/parent-mode/FacilityExplorerSection';
import {
  FamilyAgeCohortSelector,
  type ChildAgeCohort,
} from '../components/parent-mode/FamilyAgeCohortSelector';
import { FamilyInteractiveMap } from '../components/parent-mode/FamilyInteractiveMap';
import { ParentCapabilitiesGrid } from '../components/parent-mode/ParentCapabilitiesGrid';
import { ParentHeroHeader } from '../components/parent-mode/ParentHeroHeader';
import type { DistrictSummaryDto } from '../types/contracts';

export interface ParentModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode: () => void;
}

/// <summary>
/// Parent & Family mode orchestrator page presenting child age stage selector,
/// walking accessibility isochrones, district childcare rankings, and a live POI facility explorer.
/// </summary>
export function ParentModePage({ districts, onBackToResidentMode }: ParentModePageProps) {
  // Active child age cohort: 'all' | 'infant' (0–3) | 'preschool' (4–6) | 'school' (7–14)
  const [selectedCohort, setSelectedCohort] = useState<ChildAgeCohort>('all');

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <ParentHeroHeader onBackToResidentMode={onBackToResidentMode} />

      {/* Features & Capabilities Grid */}
      <ParentCapabilitiesGrid />
        
      {/* Interactive Child Age Stage Selector */}
      <FamilyAgeCohortSelector
        selectedCohort={selectedCohort}
        onSelectCohort={setSelectedCohort}
      />

      {/* Interactive Family Map with 500m Walking Isochrones */}
      <FamilyInteractiveMap
        districts={districts}
        selectedCohort={selectedCohort}
      />

      {/* Dynamic Ranking of Top 6 Districts tailored to Child Age Stage */}
      <EducationRankingSection
        districts={districts}
        selectedCohort={selectedCohort}
      />

      {/* Live Interactive POI Facility Explorer synchronized with Age Cohort */}
      <FacilityExplorerSection
        districts={districts}
        selectedCohort={selectedCohort}
      />
    </div>
  );
}
