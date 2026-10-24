import { useState } from 'react';
import { ChildcareForecastSection } from '../components/parent-mode/ChildcareForecastSection';
import { EducationRankingSection } from '../components/parent-mode/EducationRankingSection';
import { FacilityExplorerSection } from '../components/parent-mode/FacilityExplorerSection';
import {
  FamilyAgeCohortSelector,
  type ChildAgeCohort,
} from '../components/parent-mode/FamilyAgeCohortSelector';
import { FamilyInteractiveMap } from '../components/parent-mode/FamilyInteractiveMap';
import { ParentHeroHeader } from '../components/parent-mode/ParentHeroHeader';
import type { DistrictSummaryDto } from '../types/contracts';

export interface ParentModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode?: () => void;
}

/// <summary>
/// Parent & Family mode orchestrator page presenting child age stage selector,
/// dynamic district childcare rankings (TOP 6), interactive family map with walking isochrones,
/// 2028 childcare places balance & white spots, and live POI facility registry explorer.
/// Global cohort selection is controlled solely by FamilyAgeCohortSelector.
/// </summary>
export function ParentModePage({ districts }: ParentModePageProps) {
  // Active child age cohort: 'all' | 'infant' (0–3) | 'preschool' (4–6) | 'school' (7–14)
  const [selectedCohort, setSelectedCohort] = useState<ChildAgeCohort>('all');

  return (
    <div className="space-y-8">
      {/* 1. Hero Header with interactive CTA links and expandable capabilities drawer */}
      <ParentHeroHeader totalDistrictsCount={districts.length} districts={districts} />

      {/* 2. Interactive Child Age Stage Selector (Sole global controller of the page profile) */}
      <div id="child-profile-section" className="scroll-mt-20">
        <FamilyAgeCohortSelector
          selectedCohort={selectedCohort}
          onSelectCohort={setSelectedCohort}
        />
      </div>

      {/* 3. Dynamic Ranking of Top 6 Districts tailored to Child Age Stage (positioned above the map) */}
      <div id="education-ranking-section" className="scroll-mt-20">
        <EducationRankingSection
          districts={districts}
          selectedCohort={selectedCohort}
        />
      </div>

      {/* 4. Interactive Family Map with Walking Isochrones (300m / 500m / 1km) */}
      <div id="family-map-section" className="scroll-mt-20">
        <FamilyInteractiveMap
          districts={districts}
          selectedCohort={selectedCohort}
        />
      </div>

      {/* 5. 2028 Childcare Places Balance & White Spots Detection (with expandable details drawer) */}
      <ChildcareForecastSection
        districts={districts}
        selectedCohort={selectedCohort}
      />

      {/* 6. Live Interactive POI Facility Explorer synchronized with Age Cohort (positioned at the bottom) */}
      <div id="facility-explorer-section" className="scroll-mt-20">
        <FacilityExplorerSection
          districts={districts}
          selectedCohort={selectedCohort}
        />
      </div>
    </div>
  );
}
