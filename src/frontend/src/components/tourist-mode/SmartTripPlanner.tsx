import React, { useMemo, useState } from 'react';
import {
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Footprints,
  Train,
  Landmark,
  Trees,
  Palette,
  Building2,
  CalendarDays,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { getTourismI18n, formatStopsCountLabel, formatRouteSubtitle } from '../../i18n/modules';
import type {
  TourismAttractionDto,
  ItineraryStopDto,
} from '../../types/contracts';

export interface SmartTripPlannerProps {
  attractions: TourismAttractionDto[];
}

const DISTRICT_NAMES_BY_ID: Record<number, string> = {
  1: 'I. Stare Miasto',
  2: 'II. Grzegórzki',
  3: 'III. Prądnik Czerwony',
  4: 'IV. Prądnik Biały',
  5: 'V. Krowodrza',
  6: 'VI. Bronowice',
  7: 'VII. Zwierzyniec',
  8: 'VIII. Dębniki',
  9: 'IX. Łagiewniki-Borek Fałęcki',
  10: 'X. Swoszowice',
  11: 'XI. Podgórze Duchackie',
  12: 'XII. Bieżanów-Prokocim',
  13: 'XIII. Podgórze',
  14: 'XIV. Czyżyny',
  15: 'XV. Mistrzejowice',
  16: 'XVI. Bieńczyce',
  17: 'XVII. Wzgórza Krzesławickie',
  18: 'XVIII. Nowa Huta',
};

// Calculates spherical distance in km between two WGS84 points
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Geographic centroids of Krakow 18 administrative units for spatial nearest-neighbor routing
const DISTRICT_CENTROIDS: Record<number, { lat: number; lng: number }> = {
  1: { lat: 50.0592, lng: 19.9385 }, // I. Stare Miasto
  2: { lat: 50.0605, lng: 19.9610 }, // II. Grzegórzki
  3: { lat: 50.0820, lng: 19.9630 }, // III. Prądnik Czerwony
  4: { lat: 50.0890, lng: 19.9220 }, // IV. Prądnik Biały
  5: { lat: 50.0660, lng: 19.9180 }, // V. Krowodrza
  6: { lat: 50.0795, lng: 19.8910 }, // VI. Bronowice
  7: { lat: 50.0535, lng: 19.8690 }, // VII. Zwierzyniec
  8: { lat: 50.0280, lng: 19.8820 }, // VIII. Dębniki
  9: { lat: 50.0170, lng: 19.9310 }, // IX. Łagiewniki-Borek Fałęcki
  10: { lat: 49.9950, lng: 19.9400 }, // X. Swoszowice
  11: { lat: 50.0150, lng: 19.9570 }, // XI. Podgórze Duchackie
  12: { lat: 50.0140, lng: 20.0210 }, // XII. Bieżanów-Prokocim
  13: { lat: 50.0430, lng: 19.9550 }, // XIII. Podgórze
  14: { lat: 50.0750, lng: 20.0010 }, // XIV. Czyżyny
  15: { lat: 50.0980, lng: 20.0070 }, // XV. Mistrzejowice
  16: { lat: 50.0820, lng: 20.0310 }, // XVI. Bieńczyce
  17: { lat: 50.0920, lng: 20.0790 }, // XVII. Wzgórza Krzesławickie
  18: { lat: 50.0710, lng: 20.0450 }, // XVIII. Nowa Huta
};

export const SmartTripPlanner: React.FC<SmartTripPlannerProps> = ({
  attractions,
}) => {
  const { language } = useTranslation();
  const t = getTourismI18n(language);

  // Active filter state
  const [selectedHours, setSelectedHours] = useState<number>(4);
  const [selectedTheme, setSelectedTheme] = useState<string>('ALL');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(0);

  // Time budget options with icons & subtext
  const timeOptions = [
    { hours: 2, label: t.planner.timeBudgets.h2Label, sublabel: t.planner.timeBudgets.h2Sub, targetMinutes: 120 },
    { hours: 4, label: t.planner.timeBudgets.h4Label, sublabel: t.planner.timeBudgets.h4Sub, targetMinutes: 240 },
    { hours: 6, label: t.planner.timeBudgets.h6Label, sublabel: t.planner.timeBudgets.h6Sub, targetMinutes: 360 },
    { hours: 8, label: t.planner.timeBudgets.h8Label, sublabel: t.planner.timeBudgets.h8Sub, targetMinutes: 480 },
  ];

  // Theme profile options with rich icons
  const themeOptions = [
    { key: 'ALL', label: t.planner.themes.all, icon: Sparkles },
    { key: 'HIGHLIGHTS', label: t.planner.themes.highlights, icon: Landmark },
    { key: 'GREEN_ACTIVE', label: t.planner.themes.green, icon: Trees },
    { key: 'ART_CULTURE', label: t.planner.themes.art, icon: Palette },
    { key: 'SECRETS', label: t.planner.themes.secrets, icon: Compass },
    { key: 'REVOLUTION', label: t.planner.themes.revolution, icon: Building2 },
  ];

  // District options (0 = All 18 districts, 1..18 specific)
  const districtOptions = useMemo(() => {
    const list = [{ id: 0, label: t.planner.allDistricts }];
    for (let i = 1; i <= 18; i++) {
      list.push({ id: i, label: DISTRICT_NAMES_BY_ID[i] ?? `Dzielnica ${i}` });
    }
    return list;
  }, []);

  // DYNAMIC ITINERARY SYNTHESIS ALGORITHM
  // Responds dynamically in 0ms to any changes in Time, Theme, or District!
  const generatedItinerary = useMemo(() => {
    if (!attractions || attractions.length === 0) return null;

    const targetMinutes = selectedHours * 60;

    // 1. Flexible Multi-Thematic filtering based on categories and rich tags
    let candidates = attractions.filter((a) => {
      const tags = a.tags || [];
      if (selectedTheme === 'HIGHLIGHTS') {
        return (
          a.isUnesco ||
          a.category === 'HISTORIC_HERITAGE' ||
          tags.some((t) =>
            ['unesco', 'heritage', 'monument', 'history', 'castle', 'monastery', 'church', 'manor', 'palace', 'icon'].includes(t)
          )
        );
      }
      if (selectedTheme === 'GREEN_ACTIVE') {
        return (
          a.category === 'GREEN_NATURE' ||
          a.category === 'ACTIVE_SPORT' ||
          tags.some((t) =>
            ['park', 'nature', 'forest', 'green', 'sport', 'active', 'walking', 'cycling', 'spa', 'river', 'water', 'botanic', 'relax'].includes(t)
          )
        );
      }
      if (selectedTheme === 'ART_CULTURE') {
        return (
          a.category === 'CULTURE_ART' ||
          tags.some((t) =>
            ['art', 'museum', 'theatre', 'gallery', 'culture', 'boho', 'music', 'literature', 'photography', 'wyspianski', 'matejko', 'beksinski'].includes(t)
          )
        );
      }
      if (selectedTheme === 'SECRETS') {
        return (
          a.category === 'VIEWPOINT' ||
          a.crowdLevel === 'PEACEFUL' ||
          a.crowdLevel === 'LOW' ||
          tags.some((t) =>
            ['hidden_gem', 'viewpoint', 'panorama', 'fortress', 'cave', 'legend', 'prehistory', 'military'].includes(t)
          )
        );
      }
      if (selectedTheme === 'REVOLUTION') {
        return (
          [14, 15, 16, 17, 18].includes(a.districtId) ||
          tags.some((t) =>
            ['socrealism', 'industrial', 'aviation', 'solidarnosc', 'cold_war', 'cistercians', 'military', 'urbanism'].includes(t)
          )
        );
      }
      return true; // ALL
    });

    if (candidates.length === 0) {
      candidates = [...attractions];
    }

    // 2. District Prioritization with guaranteed local anchor & spatial centroid sorting:
    let pool: TourismAttractionDto[];
    if (selectedDistrictId > 0) {
      const centroid = DISTRICT_CENTROIDS[selectedDistrictId] || { lat: 50.0617, lng: 19.9373 };

      // Local attractions matching the filtered theme
      let local = candidates.filter((a) => a.districtId === selectedDistrictId);

      // If strict theme yielded 0 in this district, take all attractions from this district
      // so the user chosen district ALWAYS serves as the guaranteed starting anchor!
      if (local.length === 0) {
        local = attractions.filter((a) => a.districtId === selectedDistrictId);
      }

      // Sort outer candidates strictly by distance to this district's centroid / first local attraction
      const anchorLat = local.length > 0 ? local[0].lat : centroid.lat;
      const anchorLng = local.length > 0 ? local[0].lng : centroid.lng;

      const outer = candidates
        .filter((a) => a.districtId !== selectedDistrictId)
        .sort((a, b) => {
          const dA = calculateHaversineKm(anchorLat, anchorLng, a.lat, a.lng);
          const dB = calculateHaversineKm(anchorLat, anchorLng, b.lat, b.lng);
          return dA - dB;
        });

      pool = [...local, ...outer];
    } else {
      pool = [...candidates].sort((a, b) => {
        if (a.isUnesco && !b.isUnesco) return -1;
        if (!a.isUnesco && b.isUnesco) return 1;
        return a.estimatedVisitMinutes - b.estimatedVisitMinutes;
      });
    }

    // 3. Assemble stops chaining logically with spatial proximity
    const selectedStops: Array<TourismAttractionDto & { travelToNextMinutes: number; distanceToNextKm: number; isTransit: boolean }> = [];
    let currentCumulativeMinutes = 0;
    let totalVisitOnlyMinutes = 0;
    let totalTransitOnlyMinutes = 0;
    const visitedIds = new Set<string>();

    if (pool.length > 0) {
      selectedStops.push({
        ...pool[0],
        travelToNextMinutes: 0,
        distanceToNextKm: 0,
        isTransit: false,
      });
      visitedIds.add(pool[0].id);
      currentCumulativeMinutes += pool[0].estimatedVisitMinutes;
      totalVisitOnlyMinutes += pool[0].estimatedVisitMinutes;
    }

    while (pool.length > visitedIds.size) {
      const lastStop = selectedStops[selectedStops.length - 1];
      if (!lastStop) break;

      const unvisited = pool.filter((a) => !visitedIds.has(a.id));
      if (unvisited.length === 0) break;

      // DISTRICT FIRST: If a specific district is chosen, exhaust all matching attractions in that district first!
      const unvisitedLocal =
        selectedDistrictId > 0
          ? unvisited.filter((a) => a.districtId === selectedDistrictId)
          : [];

      const searchPool = unvisitedLocal.length > 0 ? unvisitedLocal : unvisited;

      searchPool.sort((a, b) => {
        const distA = calculateHaversineKm(lastStop.lat, lastStop.lng, a.lat, a.lng);
        const distB = calculateHaversineKm(lastStop.lat, lastStop.lng, b.lat, b.lng);
        return distA - distB;
      });

      const nextCandidate = searchPool[0];
      const distKm = calculateHaversineKm(lastStop.lat, lastStop.lng, nextCandidate.lat, nextCandidate.lng);

      let travelMinutes = 0;
      let isTransit = false;

      if (distKm <= 1.8) {
        travelMinutes = Math.max(4, Math.round((distKm * 1.25 / 4.5) * 60));
        isTransit = false;
      } else {
        travelMinutes = Math.round(8 + distKm * 2.2);
        isTransit = true;
      }

      const nextTotalTime = currentCumulativeMinutes + travelMinutes + nextCandidate.estimatedVisitMinutes;

      if (nextTotalTime <= targetMinutes + 25 || selectedStops.length < 2) {
        lastStop.travelToNextMinutes = travelMinutes;
        lastStop.distanceToNextKm = distKm;
        lastStop.isTransit = isTransit;

        selectedStops.push({
          ...nextCandidate,
          travelToNextMinutes: 0,
          distanceToNextKm: 0,
          isTransit: false,
        });
        visitedIds.add(nextCandidate.id);
        currentCumulativeMinutes = nextTotalTime;
        totalVisitOnlyMinutes += nextCandidate.estimatedVisitMinutes;
        totalTransitOnlyMinutes += travelMinutes;
      } else {
        // Check if any lighter unvisited attraction in the search pool fits into remaining budget
        const fittingCandidate = searchPool.find((cand) => {
          if (visitedIds.has(cand.id)) return false;
          const d = calculateHaversineKm(lastStop.lat, lastStop.lng, cand.lat, cand.lng);
          const t = d <= 1.8 ? Math.max(4, Math.round((d * 1.25 / 4.5) * 60)) : Math.round(8 + d * 2.2);
          return currentCumulativeMinutes + t + cand.estimatedVisitMinutes <= targetMinutes + 25;
        });

        if (fittingCandidate) {
          const dKm = calculateHaversineKm(lastStop.lat, lastStop.lng, fittingCandidate.lat, fittingCandidate.lng);
          const tMin = dKm <= 1.8 ? Math.max(4, Math.round((dKm * 1.25 / 4.5) * 60)) : Math.round(8 + dKm * 2.2);
          lastStop.travelToNextMinutes = tMin;
          lastStop.distanceToNextKm = dKm;
          lastStop.isTransit = dKm > 1.8;

          selectedStops.push({
            ...fittingCandidate,
            travelToNextMinutes: 0,
            distanceToNextKm: 0,
            isTransit: false,
          });
          visitedIds.add(fittingCandidate.id);
          currentCumulativeMinutes += tMin + fittingCandidate.estimatedVisitMinutes;
          totalVisitOnlyMinutes += fittingCandidate.estimatedVisitMinutes;
          totalTransitOnlyMinutes += tMin;
        } else {
          break;
        }
      }
    }

    const stops: Array<ItineraryStopDto & { isTransit: boolean }> = selectedStops.map((s, idx) => ({
      stepNumber: idx + 1,
      attractionId: s.id,
      name: s.name,
      category: s.category,
      crowdLevel: s.crowdLevel,
      lat: s.lat,
      lng: s.lng,
      visitMinutes: s.estimatedVisitMinutes,
      walkToNextMinutes: s.travelToNextMinutes,
      distanceToNextKm: s.distanceToNextKm,
      districtId: s.districtId,
      isTransit: s.isTransit,
    }));

    const themeLabel = themeOptions.find((thm) => thm.key === selectedTheme)?.label ?? 'Optymalna';
    const districtLabel =
      selectedDistrictId > 0
        ? DISTRICT_NAMES_BY_ID[selectedDistrictId]
        : t.planner.allDistricts;

    const itineraryTitle =
      selectedTheme === 'ALL'
        ? districtLabel
        : `${themeLabel} • ${districtLabel}`;

    return {
      title: itineraryTitle,
      subtitle: formatRouteSubtitle(selectedHours, stops.length, language),
      calculatedDurationMinutes: currentCumulativeMinutes,
      totalVisitMinutes: totalVisitOnlyMinutes,
      totalTransitMinutes: totalTransitOnlyMinutes,
      stopsCount: stops.length,
      stops,
    };
  }, [attractions, selectedHours, selectedTheme, selectedDistrictId]);

  const stopsCount = generatedItinerary?.stopsCount ?? 0;
  const stopsPluralText = formatStopsCountLabel(stopsCount, language);
  const totalMinutes = generatedItinerary?.calculatedDurationMinutes ?? 0;
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;

  // Key to trigger smooth CSS content-enter animation when options change
  const transitionKey = `${selectedHours}-${selectedTheme}-${selectedDistrictId}`;

  return (
    <section
      id="trip-planner-section"
      className="scroll-mt-20 rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-6"
    >
      {/* Section Header (Unified Official/Investor Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t.sections.plannerTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.sections.plannerSubtitle}
            </p>
          </div>
        </div>

        {/* Live Calculation Pill */}
        {generatedItinerary && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs self-start sm:self-auto">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-xs text-slate-700">
              <span>{t.planner.calculatedDuration} </span>
              <strong className="text-slate-900 font-extrabold">
                {hoursPart > 0 ? `${hoursPart} ${t.planner.hoursSuffix}` : ''} {minutesPart > 0 ? `${minutesPart} min` : ''}
              </strong>
              <span className="mx-1.5 text-slate-300">•</span>
              <span className="text-blue-700 font-bold">{stopsCount} {stopsPluralText}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3-Step Selection Control Hub */}
      <div className="rounded-3xl bg-slate-50/70 border border-slate-200/80 p-5 sm:p-6 space-y-6">
        {/* Step 1: Time Budget Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">
              1
            </span>
            <label className="text-xs sm:text-sm font-extrabold text-slate-900">
              {t.planner.timeBudgetLabel}
            </label>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {t.planner.timeSubHint}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {timeOptions.map((opt) => {
              const isSelected = selectedHours === opt.hours;
              return (
                <button
                  key={opt.hours}
                  onClick={() => setSelectedHours(opt.hours)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02] border border-blue-600'
                      : 'bg-white border border-slate-200/90 text-slate-700 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Clock className={`w-4 h-4 ${isSelected ? 'text-sky-200' : 'text-blue-600'}`} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.sublabel}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold mt-2 leading-tight">
                    {opt.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Theme / Atmosphere Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
              2
            </span>
            <label className="text-xs sm:text-sm font-extrabold text-slate-900">
              {t.planner.profileLabel}
            </label>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {t.planner.themeSubHint}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {themeOptions.map((thm) => {
              const isSelected = selectedTheme === thm.key;
              const IconComp = thm.icon;
              return (
                <button
                  key={thm.key}
                  onClick={() => setSelectedTheme(thm.key)}
                  className={`p-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02] border border-indigo-600'
                      : 'bg-white border border-slate-200/90 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30'
                  }`}
                  title={thm.label}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`} />
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold leading-snug line-clamp-2">
                    {thm.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: District / Location Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
              3
            </span>
            <label className="text-xs sm:text-sm font-extrabold text-slate-900">
              {t.planner.districtLabel}
            </label>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {t.planner.districtSubHint}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative sm:w-72 shrink-0">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
              >
                {districtOptions.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">
                {selectedDistrictId > 0
                  ? `${t.planner.districtPriorityPrefix} ${DISTRICT_NAMES_BY_ID[selectedDistrictId]} ${t.planner.districtPrioritySuffix}`
                  : t.planner.allDistrictsDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Animated Content Region (Smooth Transition on Options Change) */}
      <div key={transitionKey} className="animate-content-enter space-y-5">
        {/* Generated Route Summary Banner */}
        {generatedItinerary && (
          <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-blue-50 via-indigo-50/60 to-sky-50 border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-blue-950">
                  {generatedItinerary.title}
                </h3>
                <p className="text-xs text-blue-800/80 mt-0.5">
                  {generatedItinerary.subtitle}
                </p>
              </div>
            </div>

            {/* Clean Telemetry Chips with React Icons */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-blue-200/70 text-xs font-bold text-blue-900 shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{t.planner.summaryVisiting} <strong>{generatedItinerary.totalVisitMinutes} min</strong></span>
              </div>
              {generatedItinerary.totalTransitMinutes > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-indigo-200/70 text-xs font-bold text-indigo-900 shadow-2xs">
                  <Footprints className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{t.planner.summaryWalking} <strong>~{generatedItinerary.totalTransitMinutes} min</strong></span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-xs">
                <Clock className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{t.planner.summaryTotal} {hoursPart > 0 ? `${hoursPart} ${t.planner.hoursSuffix} ` : ''}{minutesPart > 0 ? `${minutesPart} min` : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Timeline Cards with Mathematically Centered Axis Line */}
        {generatedItinerary && generatedItinerary.stops.length > 0 ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>{t.planner.timelineTitle}</span>
            </div>

            <div className="relative pl-12 sm:pl-14 space-y-6">
              {/* Perfectly Centered Timeline Vertical Axis */}
              <div className="absolute left-6 sm:left-7 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-blue-600 via-indigo-400 to-emerald-500 pointer-events-none" />

              {generatedItinerary.stops.map((stop, idx) => {
                const isLast = idx === generatedItinerary.stops.length - 1;
                const crowdBadge = t.crowd[stop.crowdLevel as keyof typeof t.crowd] ?? t.crowd.MODERATE;
                const categoryName = t.categories[stop.category as keyof typeof t.categories] ?? stop.category;

                return (
                  <div key={stop.attractionId} className="relative group space-y-3">
                    {/* Step Node Circle Badge – Exactly Centered on the Axis */}
                    <div className="absolute -left-6 sm:-left-7 top-3.5 w-7 h-7 -translate-x-1/2 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-xs text-xs font-black text-blue-700 z-10">
                      {stop.stepNumber}
                    </div>

                    {/* Stop Card */}
                    <div className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 hover:bg-white transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-100 text-blue-800 shrink-0">
                            {t.planner.stepLabel} {stop.stepNumber}
                          </span>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {stop.name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-white text-slate-600 border border-slate-200">
                            {categoryName}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border whitespace-nowrap ${crowdBadge.color}`}
                            title={t.overtourism.crowdLevelLabel}
                          >
                            {crowdBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Visit Time and District info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-3 border-t border-slate-200/70">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {t.planner.visitDuration} <strong className="text-slate-900 font-bold">{stop.visitMinutes} {t.planner.minutesLabel}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium text-slate-700">
                            {DISTRICT_NAMES_BY_ID[stop.districtId] ?? `Dzielnica ${stop.districtId}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transition Connector between steps */}
                    {!isLast && (
                      <div className="pl-1 pt-1 pb-1">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50/90 border border-indigo-200/80 text-xs font-bold text-indigo-900 shadow-2xs">
                          {stop.isTransit ? (
                            <>
                              <Train className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span>
                                {t.planner.transitByKMK} <strong>~{stop.walkToNextMinutes} {t.planner.minutesLabel}</strong> ({stop.distanceToNextKm} {t.planner.kmShort})
                              </span>
                            </>
                          ) : (
                            <>
                              <Footprints className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span>
                                {t.planner.walkToNext} <strong>~{stop.walkToNextMinutes} {t.planner.minutesLabel}</strong> ({stop.distanceToNextKm} {t.planner.kmShort})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
            {t.planner.noItineraryFound}
          </div>
        )}
      </div>
    </section>
  );
};
