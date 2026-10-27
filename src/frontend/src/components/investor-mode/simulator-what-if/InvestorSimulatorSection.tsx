import { Sliders } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cracow360Api } from '../../../api/client';
import { useTranslation } from '../../../i18n/I18nContext';
import { getInvestorSimulatorLabels } from '../../../i18n/modules';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import { DistrictSimulatorToolbar } from './DistrictSimulatorToolbar';
import {
  calculateSimulationImpact,
  getPresetLevers,
  INITIAL_LEVERS_STATE,
} from './simulatorCalculations';
import { SimulatorImpactDisplay } from './SimulatorImpactDisplay';
import { SimulatorLeversPanel } from './SimulatorLeversPanel';
import type { SimulatorLeversState, SimulatorPresetId } from './types';

export interface InvestorSimulatorSectionProps {
  districts: DistrictSummaryDto[];
}

export function InvestorSimulatorSection({ districts }: InvestorSimulatorSectionProps) {
  const { language } = useTranslation();
  const labels = useMemo(() => getInvestorSimulatorLabels(language), [language]);

  // District details map cache for all 18 districts
  const [detailsMap, setDetailsMap] = useState<Map<number, DistrictDetailsDto>>(new Map());
  const [_isLoading, setIsLoading] = useState<boolean>(true);

  // Selected district (defaults to District IV Prądnik Biały or first available)
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(() => {
    const d4 = districts.find((d) => d.districtId === 4);
    return d4 ? d4.districtId : districts[0]?.districtId ?? 4;
  });

  // Levers & active preset state
  const [levers, setLevers] = useState<SimulatorLeversState>(INITIAL_LEVERS_STATE);
  const [activePreset, setActivePreset] = useState<SimulatorPresetId>('custom');

  // Animation frame reference (modeled directly on WeightsConfiguratorPanel in Resident Mode)
  const animationFrameRef = useRef<number | null>(null);
  const leversRef = useRef<SimulatorLeversState>(INITIAL_LEVERS_STATE);
  leversRef.current = levers;

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Smoothly glide slider positions and counter values over 450ms using easeOutCubic
  const animateLeversTransition = (
    targetLevers: SimulatorLeversState,
    nextPreset: SimulatorPresetId
  ) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startLevers = { ...leversRef.current };
    const startTime = performance.now();
    const duration = 450; // Smooth 450ms physical gliding matching WeightsConfiguratorPanel

    setActivePreset(nextPreset);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const interp = (start: number, target: number) =>
        Number((start + (target - start) * ease).toFixed(2));

      const interpolated: SimulatorLeversState = {
        addedNurseries: interp(startLevers.addedNurseries, targetLevers.addedNurseries),
        addedKindergartens: interp(startLevers.addedKindergartens, targetLevers.addedKindergartens),
        addedPrimarySchools: interp(
          startLevers.addedPrimarySchools,
          targetLevers.addedPrimarySchools
        ),
        addedParentClubs: interp(startLevers.addedParentClubs, targetLevers.addedParentClubs),
        addedPocketParks: interp(startLevers.addedPocketParks, targetLevers.addedPocketParks),
        addedCityParks: interp(startLevers.addedCityParks, targetLevers.addedCityParks),
        addedSchoolSports: interp(startLevers.addedSchoolSports, targetLevers.addedSchoolSports),
        addedBusStops: interp(startLevers.addedBusStops, targetLevers.addedBusStops),
        addedTramStops: interp(startLevers.addedTramStops, targetLevers.addedTramStops),
        addedBikeLanesKm: interp(startLevers.addedBikeLanesKm, targetLevers.addedBikeLanesKm),
        addedParkAndRide: interp(startLevers.addedParkAndRide, targetLevers.addedParkAndRide),
        addedCasCenters: interp(startLevers.addedCasCenters, targetLevers.addedCasCenters),
        addedLibraries: interp(startLevers.addedLibraries, targetLevers.addedLibraries),
        addedCulturalCenters: interp(
          startLevers.addedCulturalCenters,
          targetLevers.addedCulturalCenters
        ),
      };

      if (progress < 1) {
        setLevers(interpolated);
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setLevers(targetLevers);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  // Fetch full details for all 18 districts
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all(
      districts.map((d: DistrictSummaryDto) => cracow360Api.getDistrictDetails(d.districtId))
    )
      .then((results) => {
        if (!cancelled) {
          const map = new Map<number, DistrictDetailsDto>();
          results.forEach((d: DistrictDetailsDto) => map.set(d.districtId, d));
          setDetailsMap(map);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load district details for simulator:', err);
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  const allDistrictsDetails = useMemo(
    () => Array.from(detailsMap.values()),
    [detailsMap]
  );

  const selectedDetail = useMemo(
    () => detailsMap.get(selectedDistrictId) ?? allDistrictsDetails[0] ?? null,
    [detailsMap, selectedDistrictId, allDistrictsDetails]
  );

  // Recalculate simulation impact live
  const impact = useMemo(() => {
    if (!selectedDetail) return null;
    return calculateSimulationImpact(selectedDetail, levers, allDistrictsDetails);
  }, [selectedDetail, levers, allDistrictsDetails]);

  const handleChangeLever = (
    key: keyof SimulatorLeversState,
    value: number,
    immediate = false
  ) => {
    if (immediate) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setLevers((prev) => ({
        ...prev,
        [key]: value,
      }));
      setActivePreset('custom');
    } else {
      animateLeversTransition(
        {
          ...leversRef.current,
          [key]: value,
        },
        'custom'
      );
    }
  };

  const handleApplyPreset = (preset: SimulatorPresetId) => {
    if (activePreset === preset) {
      animateLeversTransition(INITIAL_LEVERS_STATE, 'custom');
    } else {
      animateLeversTransition(getPresetLevers(preset), preset);
    }
  };

  const handleReset = () => {
    animateLeversTransition(INITIAL_LEVERS_STATE, 'custom');
  };

  return (
    <section
      id="investor-simulator-section"
      className="rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-md shadow-xs p-6 sm:p-8 space-y-6 text-slate-900 transition-all scroll-mt-20"
    >
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>{labels.sectionBadge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {labels.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-4xl leading-relaxed">
          {labels.sectionSubtitle}
        </p>
      </div>

      {/* 1. Toolbar: District Selector + Quick Test Packages + Reset */}
      <DistrictSimulatorToolbar
        districts={districts}
        selectedDistrictId={selectedDistrictId}
        onSelectDistrict={setSelectedDistrictId}
        activePreset={activePreset}
        onApplyPreset={handleApplyPreset}
        onReset={handleReset}
        totalAddedItemsCount={impact?.totalAddedItemsCount ?? 0}
        labels={labels}
      />

      {impact && (
        <>
          {/* 2. Levers Panel: 14 Infrastructure Counters across 4 Categories */}
          <SimulatorLeversPanel
            levers={levers}
            onChangeLever={handleChangeLever}
            impact={impact}
            labels={labels}
          />

          {/* 3. Dynamic Impact Module right below the counters */}
          <SimulatorImpactDisplay impact={impact} labels={labels} />
        </>
      )}
    </section>
  );
}
