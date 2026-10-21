import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from './api/client';
import { MainFooter } from './components/layout/MainFooter';
import { MainNavbar, type AppTabId } from './components/layout/MainNavbar';
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

// Neutral baseline weights: equal balance of 5.0 across all 7 urban pillars
const DEFAULT_WEIGHTS: QualityWeights = {
  mobility: 5,
  education: 5,
  greenery: 5,
  culture: 5,
  environment: 5,
  safety: 5,
  housingAffordability: 5,
};

/// <summary>
/// Root application shell orchestrating global state, dynamic quality-of-life recalculations,
/// district comparisons, and tabbed view navigation.
/// </summary>
export function App() {
  // Navigation active tab state
  const [activeTab, setActiveTab] = useState<AppTabId>('resident');

  // Baseline district metrics and spatial GeoJSON boundaries
  const [rawDistricts, setRawDistricts] = useState<DistrictSummaryDto[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<DistrictsGeoJsonCollection | null>(null);

  // Preference weights and active persona preset
  const [weights, setWeights] = useState<QualityWeights>(DEFAULT_WEIGHTS);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Selected district IDs for side-by-side comparison (#1 Primary, #2 Secondary)
  const [selectedPrimaryId, setSelectedPrimaryId] = useState<number | null>(5); // Default #1: Dzielnica V Krowodrza
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<number | null>(4); // Default #2: Dzielnica IV Prądnik Biały

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
              : 'Nie udało się pobrać danych dzielnic. Upewnij się, że backend API jest uruchomiony.'
          );
        }
      }
    };

    void loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Resets all 7 sliders to default baseline (5.0 each)
  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    setActivePresetId(null);
  };

  // Toggle selection of District #1 (Primary) and District #2 (Secondary for comparison)
  const handleSelectDistrict = (districtId: number) => {
    if (selectedPrimaryId === districtId) {
      setSelectedPrimaryId(selectedSecondaryId);
      setSelectedSecondaryId(null);
      return;
    }
    if (selectedSecondaryId === districtId) {
      setSelectedSecondaryId(null);
      return;
    }
    if (selectedPrimaryId === null) {
      setSelectedPrimaryId(districtId);
    } else {
      setSelectedSecondaryId(districtId);
    }
  };

  // Clears comparison selections
  const handleClearSelection = () => {
    setSelectedPrimaryId(null);
    setSelectedSecondaryId(null);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col bg-transparent">
      {/* Top Civic Navigation Bar */}
      <MainNavbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Container with smooth tab transition */}
      <main className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium shadow-xs">
            <strong>Komunikat:</strong> {error}
          </div>
        )}

        <div key={activeTab} className="w-full animate-tab-enter">
          {/* Resident Mode (Quality of Life Map, Ranking & Comparison) */}
          {activeTab === 'resident' && (
            <ResidentModePage
              rankedDistricts={rankedDistricts}
              geoJsonData={geoJsonData}
              weights={weights}
              activePresetId={activePresetId}
              selectedPrimaryId={selectedPrimaryId}
              selectedSecondaryId={selectedSecondaryId}
              onChangeWeights={handleWeightsChange}
              onResetWeights={handleResetWeights}
              onSelectDistrict={handleSelectDistrict}
              onSelectPrimary={(id) => setSelectedPrimaryId(id)}
              onSelectSecondary={(id) => setSelectedSecondaryId(id)}
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
