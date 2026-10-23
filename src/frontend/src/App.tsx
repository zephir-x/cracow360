import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from './api/client';
import { MainFooter } from './components/layout/MainFooter';
import { MainNavbar, type AppTabId } from './components/layout/MainNavbar';
import { useTranslation } from './i18n/I18nContext';
import { AboutDataMethodologyPage } from './pages/AboutDataMethodologyPage';
import { OfficialInvestorModePage } from './pages/OfficialInvestorModePage';
import { ParentModePage } from './pages/ParentModePage';
import { ResidentModePage } from './pages/ResidentModePage';
import type {
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  QualityWeights,
} from './types/contracts';
import { calculateClientSideQualityIndex } from './utils/qualityIndexCalculator';

// Neutral baseline weights: equal balance of 5.0 across all 8 urban pillars
const DEFAULT_WEIGHTS: QualityWeights = {
  mobility: 5,
  education: 5,
  greenery: 5,
  culture: 5,
  environment: 5,
  safety: 5,
  housingAffordability: 5,
  demographicVitality: 5,
};

/// <summary>
/// Root application shell orchestrating global state, dynamic quality-of-life recalculations,
/// district comparisons, and tabbed view navigation.
/// </summary>
export function App() {
  const { language, t } = useTranslation();

  // Navigation active tab state
  const [activeTab, setActiveTab] = useState<AppTabId>('resident');

  // Baseline district metrics and spatial GeoJSON boundaries
  const [rawDistricts, setRawDistricts] = useState<DistrictSummaryDto[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<DistrictsGeoJsonCollection | null>(null);

  // Preference weights and active persona preset
  const [weights, setWeights] = useState<QualityWeights>(DEFAULT_WEIGHTS);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Selected district IDs for side-by-side comparison (#1 Primary, #2 Secondary)
  const [selectedPrimaryId, setSelectedPrimaryId] = useState<number | null>(5); // Default #1: District V Krowodrza
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<number | null>(4); // Default #2: District IV Prądnik Biały

  // Active target slot for district selection focus (1 = District #1, 2 = District #2)
  const [activeTargetSlot, setActiveTargetSlot] = useState<1 | 2>(1);

  // Network and data loading error message
  const [error, setError] = useState<string | null>(null);

  // Smoothly scroll to the top of the viewport whenever the active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Initial data loading from the backend API (all districts + vector boundaries)
  useEffect(() => {
    let cancelled = false;
    const loadInitialData = async () => {
      setError(null);
      try {
        const [districtsData, geoJson] = await Promise.all([
          cracow360Api.getDistricts(),
          cracow360Api.getDistrictsGeoJson(),
        ]);
        if (!cancelled) {
          setRawDistricts(districtsData);
          setGeoJsonData(geoJson);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : t.common.apiLoadError
          );
        }
      }
    };

    void loadInitialData();
    return () => {
      cancelled = true;
    };
  }, [t.common.apiLoadError]);

  // Dynamically recompute weighted Quality of Life Index and sort all 18 districts in 0ms
  const rankedDistricts = useMemo(() => {
    return rawDistricts
      .map((d) => ({
        ...d,
        weightedQualityOfLifeIndex: calculateClientSideQualityIndex(d.scores, weights),
      }))
      .sort((a, b) => b.weightedQualityOfLifeIndex - a.weightedQualityOfLifeIndex);
  }, [rawDistricts, weights]);

  // Updates custom weights and synchronizes the active preset identifier
  const handleWeightsChange = (newWeights: QualityWeights, presetId: string | null = null) => {
    setWeights(newWeights);
    setActivePresetId(presetId);
  };

  // Resets all 8 sliders to default baseline (5.0 each)
  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    setActivePresetId(null);
  };

  // Set selection of District #1 or District #2 with automatic alternating slot toggling
  const handleSelectDistrict = (districtId: number) => {
    if (activeTargetSlot === 1) {
      if (selectedSecondaryId === districtId) {
        setSelectedSecondaryId(null);
      }
      setSelectedPrimaryId(districtId);
      // Automatically advance active target slot to #2
      setActiveTargetSlot(2);
    } else {
      if (selectedPrimaryId === districtId) {
        setSelectedPrimaryId(null);
      }
      setSelectedSecondaryId(districtId);
      // Automatically advance active target slot to #1
      setActiveTargetSlot(1);
    }
  };

  const handleSelectPrimary = (id: number) => {
    if (selectedSecondaryId === id) {
      setSelectedSecondaryId(null);
    }
    setSelectedPrimaryId(id);
    setActiveTargetSlot(2);
  };

  const handleSelectSecondary = (id: number) => {
    if (selectedPrimaryId === id) {
      setSelectedPrimaryId(null);
    }
    setSelectedSecondaryId(id);
    setActiveTargetSlot(1);
  };

  // Clears comparison selections and resets target focus to Slot #1
  const handleClearSelection = () => {
    setSelectedPrimaryId(null);
    setSelectedSecondaryId(null);
    setActiveTargetSlot(1);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col bg-transparent">
      {/* Top Civic Navigation Bar */}
      <MainNavbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Container with smooth tab & language transition */}
      <main className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium shadow-xs">
            <strong>{t.common.notice}:</strong> {error}
          </div>
        )}

        <div key={`${activeTab}-${language}`} className="w-full animate-tab-enter">
          {/* Resident Mode (Quality of Life Map, Ranking & Comparison) */}
          {activeTab === 'resident' && (
            <ResidentModePage
              rankedDistricts={rankedDistricts}
              geoJsonData={geoJsonData}
              weights={weights}
              activePresetId={activePresetId}
              selectedPrimaryId={selectedPrimaryId}
              selectedSecondaryId={selectedSecondaryId}
              activeTargetSlot={activeTargetSlot}
              onSetActiveTargetSlot={setActiveTargetSlot}
              onChangeWeights={handleWeightsChange}
              onResetWeights={handleResetWeights}
              onSelectDistrict={handleSelectDistrict}
              onSelectPrimary={handleSelectPrimary}
              onSelectSecondary={handleSelectSecondary}
              onClearSelection={handleClearSelection}
            />
          )}

          {/* Parent Mode (Childcare & School Facility Compass) */}
          {activeTab === 'parent' && (
            <ParentModePage
              districts={rankedDistricts}
              onBackToResidentMode={() => setActiveTab('resident')}
            />
          )}

          {/* Official & Investor Mode (Econometric Predictions & What-If Simulator) */}
          {activeTab === 'investor' && (
            <OfficialInvestorModePage
              districts={rankedDistricts}
              onBackToResidentMode={() => setActiveTab('resident')}
            />
          )}

          {/* Methodology & Open Data Sources Documentation */}
          {activeTab === 'methodology' && (
            <AboutDataMethodologyPage onBackToResidentMode={() => setActiveTab('resident')} />
          )}
        </div>
      </main>

      {/* Civic Footer */}
      <MainFooter onSelectTab={setActiveTab} />
    </div>
  );
}

export default App;
