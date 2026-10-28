import React, { useEffect, useState } from 'react';
import { cracow360Api } from '../api/client';
import { TouristHeroHeader } from '../components/tourist-mode/TouristHeroHeader';
import { SmartTripPlanner } from '../components/tourist-mode/SmartTripPlanner';
import { OvertourismCompass } from '../components/tourist-mode/OvertourismCompass';
import { DistrictTouristPassportNavigator } from '../components/tourist-mode/DistrictTouristPassportNavigator';
import type { TourismDatasetDto } from '../types/contracts';

export interface TouristModePageProps {
  onSelectDistrictOnMap?: (districtId: number) => void;
}

export const TouristModePage: React.FC<TouristModePageProps> = ({
  onSelectDistrictOnMap,
}) => {
  const [dataset, setDataset] = useState<TourismDatasetDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    cracow360Api
      .getTourismDataset()
      .then((data) => {
        if (isMounted) {
          setDataset(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load tourism dataset:', err);
        if (isMounted) {
          setError('Failed to load tourism data.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Hero Header with integrated stat cards, anchor navigation & expandable methodology drawer */}
      <TouristHeroHeader summary={dataset?.cityTourismSummary} />

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="p-12 text-center rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-900/5 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading official tourism data for Kraków...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {dataset && (
        <>
          {/* 2. Dynamic Smart Trip Planner (Time, Theme & District Synthesizer) */}
          <SmartTripPlanner
            attractions={dataset.attractions}
          />

          {/* 3. Overtourism Compass & Relief Alternatives */}
          <OvertourismCompass
            alternatives={dataset.overtourismAlternatives}
          />

          {/* 4. 18 District Tourist Passports & Transit Telemetry */}
          <DistrictTouristPassportNavigator
            passports={dataset.districtPassports}
            attractions={dataset.attractions}
            onSelectDistrictOnMap={onSelectDistrictOnMap}
          />
        </>
      )}
    </div>
  );
};
