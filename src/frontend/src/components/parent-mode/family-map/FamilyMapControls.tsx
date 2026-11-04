import L from 'leaflet';
import {
  Baby,
  GraduationCap,
  Layers,
  Moon,
  MousePointerClick,
  Smile,
  Sun,
  Trees,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useTranslation } from '../../../i18n/I18nContext';
import { getRadiusLabels, type MapFilter } from './familyMapTypes';

// Map click listener hook component to capture arbitrary click points in React-Leaflet
export function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// High-performance viewport controller to cull offscreen markers and detect zoom changes
export function MapViewportController({
  onViewportChange,
}: {
  onViewportChange: (bounds: L.LatLngBounds, zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onViewportChange(map.getBounds(), map.getZoom());
  }, [map, onViewportChange]);

  useMapEvents({
    moveend() {
      onViewportChange(map.getBounds(), map.getZoom());
    },
    zoomend() {
      onViewportChange(map.getBounds(), map.getZoom());
    },
  });

  return null;
}

export interface FamilyMapFilterBarProps {
  activeFilter: MapFilter;
  setActiveFilter: (filter: MapFilter) => void;
  counts: {
    all: number;
    nurseries: number;
    kindergartens: number;
    schools: number;
    parks: number;
  };
}

export function FamilyMapFilterBar({
  activeFilter,
  setActiveFilter,
  counts,
}: FamilyMapFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute top-3.5 left-14 right-3 sm:right-auto z-1000 max-w-[calc(100%-4.5rem)] pointer-events-none flex gap-2">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100 shadow-lg shadow-blue-950/10 pointer-events-auto overflow-x-auto no-scrollbar max-w-full">
        {/* All */}
        <button
          onClick={() => setActiveFilter('all')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t.parent.familyMap.allLayers}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.all}
          </span>
        </button>

        {/* Nurseries */}
        <button
          onClick={() => setActiveFilter('nurseries')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeFilter === 'nurseries'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Baby className="w-3.5 h-3.5" />
          <span>{t.parent.familyMap.nurseriesLayer}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFilter === 'nurseries'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.nurseries}
          </span>
        </button>

        {/* Kindergartens */}
        <button
          onClick={() => setActiveFilter('kindergartens')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeFilter === 'kindergartens'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>{t.parent.familyMap.kindergartensLayer}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFilter === 'kindergartens'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.kindergartens}
          </span>
        </button>

        {/* Primary Schools */}
        <button
          onClick={() => setActiveFilter('schools')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeFilter === 'schools'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{t.parent.familyMap.schoolsLayer}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFilter === 'schools'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.schools}
          </span>
        </button>

        {/* Parks & Greenery */}
        <button
          onClick={() => setActiveFilter('parks')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeFilter === 'parks'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trees className="w-3.5 h-3.5" />
          <span>{t.parent.familyMap.parksLayer}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFilter === 'parks'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {counts.parks}
          </span>
        </button>
      </div>
    </div>
  );
}

export function FamilyMapHintBanner() {
  const { language, t } = useTranslation();

  const shortMobileHint =
    language === 'en'
      ? 'Click map to check 300m / 500m / 1km walking zone'
      : language === 'ua'
      ? 'Натисніть на карту для зони 300м / 500м / 1км'
      : 'Kliknij mapę, by sprawdzić strefę dojścia 300m / 500m / 1km';

  return (
    <div className="absolute top-16 sm:top-4 right-3 left-3 sm:left-auto sm:max-w-sm z-1000 pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-200/90 rounded-2xl p-2 sm:p-3 shadow-xl shadow-blue-950/10 animate-fade-in text-left">
      <div className="flex items-center sm:items-start gap-2 sm:gap-2.5 text-xs text-slate-700">
        <div className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
          <MousePointerClick className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-slate-900 text-[11px] sm:text-xs block sm:mb-0.5">
            <span className="sm:hidden">{shortMobileHint}</span>
            <span className="hidden sm:inline">{t.parent.familyMap.bufferRadius}</span>
          </span>
          <span className="hidden sm:inline text-slate-600 text-[11px] leading-relaxed">
            {t.parent.familyMap.mapClickHintBanner}
          </span>
        </div>
      </div>
    </div>
  );
}

export interface FamilyMapBasemapSwitcherProps {
  darkMapMode: boolean;
  setDarkMapMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Bottom-Left: Map Theme Switcher (Light Civic vs Dark Night Mode)
export function FamilyMapBasemapSwitcher({
  darkMapMode,
  setDarkMapMode,
}: FamilyMapBasemapSwitcherProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-4 left-4 z-1000 pointer-events-auto">
      <button
        onClick={() => setDarkMapMode((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
      >
        {darkMapMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-600" />}
        <span>{darkMapMode ? t.parent.familyMap.lightTheme : t.parent.familyMap.darkTheme}</span>
      </button>
    </div>
  );
}

export interface FamilyMapStaticLegendProps {
  bufferRadius: number;
}

// Bottom-Right: Permanently displayed static map legend
export function FamilyMapStaticLegend({ bufferRadius }: FamilyMapStaticLegendProps) {
  const { language, t } = useTranslation();
  const radiusLabel = getRadiusLabels(bufferRadius, language);

  return (
    <div className="absolute bottom-4 right-4 z-1000 pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl p-3 shadow-lg shadow-blue-950/10 hidden sm:block">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 mb-2">
        <Layers className="w-3.5 h-3.5 text-blue-600" />
        <span>{t.parent.familyMap.legendTitle}</span>
      </div>
      <div className="space-y-1.5 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shrink-0 shadow-2xs" />
          <span>{t.parent.familyMap.legendNurseries}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-600 border border-white shrink-0 shadow-2xs" />
          <span>{t.parent.familyMap.legendKindergartens}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-600 border border-white shrink-0 shadow-2xs" />
          <span>{t.parent.familyMap.legendSchools}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shrink-0 shadow-2xs" />
          <span>{t.parent.familyMap.legendParks}</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-500 shrink-0" />
          <span>
            {t.parent.familyMap.legendBuffer.replace('{dist}', radiusLabel.dist)}
          </span>
        </div>
      </div>
    </div>
  );
}
