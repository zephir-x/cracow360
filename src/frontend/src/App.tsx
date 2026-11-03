import { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from './api/client';
import { WawelekAssistantWidget } from './components/ai-assistant/WawelekAssistantWidget';
import { LiveAtmosphereBar } from './components/atmosphere/LiveAtmosphereBar';
import { MainFooter } from './components/layout/MainFooter';
import { MainNavbar, type AppTabId } from './components/layout/MainNavbar';
import { useTranslation } from './i18n/I18nContext';
import { AboutDataMethodologyPage } from './pages/AboutDataMethodologyPage';
import { HomeShowcasePage } from './pages/HomeShowcasePage';
import { OfficialInvestorModePage } from './pages/OfficialInvestorModePage';
import { ParentModePage } from './pages/ParentModePage';
import { ResidentModePage } from './pages/ResidentModePage';
import { TouristModePage } from './pages/TouristModePage';
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

// Clean keyword routing config: enables bookmarkable URL hashes that survive page refreshes (F5)
const TAB_ROUTING: Record<AppTabId, { hash: string; keywords: string[] }> = {
  home: { hash: '/home', keywords: ['home', 'start', 'showcase', 'glowna', 'intro'] },
  resident: { hash: '/resident', keywords: ['mieszkaniec', 'resident'] },
  parent: { hash: '/parent', keywords: ['rodzic', 'parent', 'family', 'rodzina'] },
  investor: { hash: '/investor', keywords: ['inwestor', 'investor', 'urzednik'] },
  tourist: { hash: '/tourist', keywords: ['turyst', 'tourist', 'odkrywaj', 'zwiedzanie', 'trasy'] },
  methodology: { hash: '/methodology', keywords: ['metodologia', 'methodology', 'zrodla'] },
};

function getTabFromUrl(): AppTabId {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const target = `${hash} ${path}`;

  if (TAB_ROUTING.parent.keywords.some((kw) => target.includes(kw))) return 'parent';
  if (TAB_ROUTING.investor.keywords.some((kw) => target.includes(kw))) return 'investor';
  if (TAB_ROUTING.tourist.keywords.some((kw) => target.includes(kw))) return 'tourist';
  if (TAB_ROUTING.methodology.keywords.some((kw) => target.includes(kw))) return 'methodology';
  if (TAB_ROUTING.resident.keywords.some((kw) => target.includes(kw))) return 'resident';
  if (TAB_ROUTING.home.keywords.some((kw) => target.includes(kw))) return 'home';

  return 'home';
}

/// <summary>
/// Root application shell orchestrating global state, dynamic quality-of-life recalculations,
/// district comparisons, live atmosphere ribbon, and tabbed view navigation with URL hash persistence.
/// </summary>
export function App() {
  const { language, t } = useTranslation();

  // Navigation active tab state with URL hash synchronization (survives F5)
  const [activeTab, setActiveTab] = useState<AppTabId>(getTabFromUrl);

  // Lazy-mount flag for LiveAtmosphereBar and WawelekAssistantWidget:
  // Not loaded on initial Start ('home') boot; once user enters any analytical tab,
  // they mount and stay mounted in memory, smoothly hiding whenever returning to 'home'.
  const [hasVisitedNonHomeTab, setHasVisitedNonHomeTab] = useState<boolean>(
    () => getTabFromUrl() !== 'home'
  );

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

  // Mark non-home tab visit so Weather Bar & Wawelek mount and persist from that point on
  useEffect(() => {
    if (activeTab !== 'home' && !hasVisitedNonHomeTab) {
      setHasVisitedNonHomeTab(true);
    }
  }, [activeTab, hasVisitedNonHomeTab]);

  // Smoothly scroll to the top of the viewport whenever the active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Synchronize activeTab with URL hash changes (browser back/forward & direct anchor navigation)
  useEffect(() => {
    const handleUrlChange = () => {
      const tab = getTabFromUrl();
      setActiveTab((prev) => (prev !== tab ? tab : prev));
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    // If current hash is missing on boot, populate it with current tab
    if (!window.location.hash) {
      window.history.replaceState(null, '', TAB_ROUTING[activeTab].hash);
    }

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [activeTab]);

  // Update active tab and synchronize URL hash so refreshing (F5) stays on the current subpage
  const handleSelectTab = (tab: AppTabId) => {
    setActiveTab(tab);
    const expectedHash = TAB_ROUTING[tab].hash;
    if (window.location.hash !== expectedHash) {
      window.history.replaceState(null, '', expectedHash);
    }
  };

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

  const isHomeShowcase = activeTab === 'home';

  return (
    <div className="min-h-screen text-slate-900 flex flex-col bg-transparent">
      {/* Top Civic Navigation Bar */}
      <MainNavbar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Live Atmospheric Conditions & Air Quality Ribbon (lazy-mounted after leaving Start, smoothly collapses on Start) */}
      {hasVisitedNonHomeTab && (
        <div
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHomeShowcase
              ? 'grid-rows-[0fr] opacity-0 pointer-events-none'
              : 'grid-rows-[1fr] opacity-100'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <LiveAtmosphereBar />
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main
        className={
          isHomeShowcase
            ? 'flex-1 w-full'
            : 'flex-1 max-w-360 w-full mx-auto px-4 sm:px-6 pt-6 space-y-6'
        }
      >
        {error && !isHomeShowcase && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium shadow-xs">
            <strong>{t.common.notice}:</strong> {error}
          </div>
        )}

        <div key={`${activeTab}-${language}`} className="w-full animate-tab-enter">
          {/* Cinematic Home Showcase Page (Default Landing View) */}
          {activeTab === 'home' && (
            <HomeShowcasePage onSelectTab={handleSelectTab} />
          )}

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
              onBackToResidentMode={() => handleSelectTab('resident')}
            />
          )}

          {/* Official & Investor Mode (Econometric Predictions & What-If Simulator) */}
          {activeTab === 'investor' && (
            <OfficialInvestorModePage
              districts={rankedDistricts}
              onBackToResidentMode={() => handleSelectTab('resident')}
            />
          )}

          {/* Smart Tourism & Discovery Mode */}
          {activeTab === 'tourist' && (
            <TouristModePage onSelectDistrictOnMap={handleSelectDistrict} />
          )}

          {/* Methodology & Open Data Sources Documentation (Back button routes to Home) */}
          {activeTab === 'methodology' && (
            <AboutDataMethodologyPage onBackToResidentMode={() => handleSelectTab('home')} />
          )}
        </div>
      </main>

      {/* Civic Footer */}
      <MainFooter onSelectTab={handleSelectTab} />

      {/* Global Floating AI Assistant "Wawelek" (lazy-mounted after leaving Start, smoothly hides on Start) */}
      {hasVisitedNonHomeTab && (
        <WawelekAssistantWidget
          activeTab={activeTab}
          selectedDistrictId={selectedPrimaryId}
        />
      )}
    </div>
  );
}

export default App;
