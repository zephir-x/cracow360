import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from './api/client';
import { MainFooter, MainNavbar, type AppTabId } from './components/layout';
import {
  AboutDataMethodologyPage,
  OfficialInvestorModePage,
  ParentModePage,
  ResidentModePage,
} from './pages';
import type {
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  QualityWeights,
  SystemHelloDto,
} from './types/contracts';
import { calculateClientSideQualityIndex } from './utils/qualityIndexCalculator';

const DEFAULT_WEIGHTS: QualityWeights = {
  mobility: 5,
  education: 5,
  greenery: 5,
  culture: 5,
  environment: 5,
};

export function App() {
  const [activeTab, setActiveTab] = useState<AppTabId>('resident');
  const [hello, setHello] = useState<SystemHelloDto | null>(null);
  const [rawDistricts, setRawDistricts] = useState<DistrictSummaryDto[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<DistrictsGeoJsonCollection | null>(null);

  const [weights, setWeights] = useState<QualityWeights>(DEFAULT_WEIGHTS);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const [selectedPrimaryId, setSelectedPrimaryId] = useState<number | null>(5); // Default #1: Dzielnica V Krowodrza
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<number | null>(4); // Default #2: Dzielnica IV Prądnik Biały

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const [helloData, districtsData, geoJson] = await Promise.all([
        cracow360Api.getSystemHello(),
        cracow360Api.getDistricts(),
        cracow360Api.getDistrictsGeoJson(),
      ]);
      setHello(helloData);
      setRawDistricts(districtsData);
      setGeoJsonData(geoJson);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Brak połączenia z backendem .NET 9 (upewnij się, że API działa na http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
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

  const handleWeightsChange = (newWeights: QualityWeights, presetId: string | null = null) => {
    setWeights(newWeights);
    setActivePresetId(presetId);
  };

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

  const handleClearSelection = () => {
    setSelectedPrimaryId(null);
    setSelectedSecondaryId(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#eaf3ff] via-[#f5f9ff] to-white text-slate-900 flex flex-col">
      {/* Top Civic Navigation Bar */}
      <MainNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hello={hello}
        loading={loading}
        onRefreshApi={() => void fetchStatus()}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium shadow-xs">
            <strong>Błąd połączenia z API:</strong> {error}
          </div>
        )}

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

        {activeTab === 'parent' && (
          <ParentModePage
            districts={rankedDistricts}
            onBackToResidentMode={() => setActiveTab('resident')}
          />
        )}

        {activeTab === 'investor' && (
          <OfficialInvestorModePage
            districts={rankedDistricts}
            onBackToResidentMode={() => setActiveTab('resident')}
          />
        )}

        {activeTab === 'methodology' && (
          <AboutDataMethodologyPage onBackToResidentMode={() => setActiveTab('resident')} />
        )}
      </main>

      {/* Civic Footer */}
      <MainFooter hello={hello} onSelectTab={setActiveTab} />
    </div>
  );
}

export default App;
