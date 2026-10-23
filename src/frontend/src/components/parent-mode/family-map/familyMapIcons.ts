import L from 'leaflet';
import type { PoiType } from './familyMapTypes';

export type PoiHighlightState = 'default' | 'insideBuffer' | 'activeSelected';

// Generates lightweight custom SVG DivIcons matching exact Lucide icon geometry and distinct colors
export function createPoiIcon(
  type: PoiType,
  highlightState: PoiHighlightState
): L.DivIcon {
  let bgColor: string;
  let lightBgColor: string;
  let svgInner: string;

  if (type === 'nursery') {
    bgColor = '#2563eb'; // Blue 600 - Nurseries & Parent Clubs
    lightBgColor = '#93c5fd'; // Blue 300 - Lighter tint for active selection ring
    svgInner = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>`;
  } else if (type === 'kindergarten') {
    bgColor = '#d97706'; // Amber 600 - Kindergartens
    lightBgColor = '#fcd34d'; // Amber 300 - Lighter tint for active selection ring
    svgInner = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`;
  } else if (type === 'school') {
    bgColor = '#7c3aed'; // Violet 600 - Primary Schools
    lightBgColor = '#c4b5fd'; // Violet 300 - Lighter tint for active selection ring
    svgInner = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
  } else if (type === 'park') {
    bgColor = '#16a34a'; // Green 600 - City & Pocket Parks
    lightBgColor = '#86efac'; // Green 300 - Lighter tint for active selection ring
    svgInner = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.3-4.5a1 1 0 0 0-1.4 0L9 7.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7h.3l-3 3.3a1 1 0 0 0 .7 1.7H12Z"/></svg>`;
  } else {
    // Center Pin (arbitrary clicked point)
    bgColor = '#4f46e5';
    lightBgColor = '#a5b4fc';
    svgInner = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>`;
  }

  // Active clicked point has a distinct lighter tint double-ring with elevated scale
  let ringStyle: string;
  if (highlightState === 'activeSelected') {
    ringStyle = `box-shadow: 0 0 0 3px ${lightBgColor}, 0 0 0 6px ${bgColor}, 0 8px 18px rgba(0,0,0,0.4); transform: scale(1.28); z-index: 1000;`;
  } else if (highlightState === 'insideBuffer') {
    ringStyle = `box-shadow: 0 0 0 2.5px #ffffff, 0 0 0 4.5px ${bgColor}, 0 4px 10px rgba(0,0,0,0.28); transform: scale(1.08);`;
  } else {
    ringStyle = 'box-shadow: 0 2px 6px rgba(0,0,0,0.22);';
  }

  return L.divIcon({
    className: 'cracow-poi-div-icon',
    html: `<div class="cracow-poi-marker-bubble" style="background-color: ${bgColor}; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease; ${ringStyle}">
      ${svgInner}
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
}

// Global cache: guarantees all static L.DivIcon instances are kept in memory without garbage collector churn
const ICON_CACHE = new Map<string, L.DivIcon>();
export function getCachedPoiIcon(
  type: PoiType,
  highlightState: PoiHighlightState | boolean
): L.DivIcon {
  const normalizedState: PoiHighlightState =
    typeof highlightState === 'boolean'
      ? highlightState
        ? 'insideBuffer'
        : 'default'
      : highlightState;

  const key = `${type}-${normalizedState}`;
  let icon = ICON_CACHE.get(key);
  if (!icon) {
    icon = createPoiIcon(type, normalizedState);
    ICON_CACHE.set(key, icon);
  }
  return icon;
}

// Cluster icon cache
const CLUSTER_CACHE = new Map<number, L.DivIcon>();
export function getCachedClusterIcon(count: number): L.DivIcon {
  let icon = CLUSTER_CACHE.get(count);
  if (!icon) {
    icon = L.divIcon({
      className: 'cracow-poi-cluster-icon',
      html: `<div class="cracow-poi-cluster-bubble">${count}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    CLUSTER_CACHE.set(count, icon);
  }
  return icon;
}
