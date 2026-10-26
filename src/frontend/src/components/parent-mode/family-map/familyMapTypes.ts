import type { Language } from '../../../i18n/types';
import type { PointOfInterestDto } from '../../../types/contracts';

export type PoiType = 'nursery' | 'kindergarten' | 'school' | 'park' | 'center';
export type MapFilter = 'all' | 'nurseries' | 'kindergartens' | 'schools' | 'parks';

export interface DisplayPoi extends PointOfInterestDto {
  displayLat: number;
  displayLng: number;
}

export interface BufferStats {
  total: number;
  nurseries: number;
  kindergartens: number;
  schools: number;
  parks: number;
  matchedPois: DisplayPoi[];
}

export interface RadiusLabels {
  dist: string;
  time: string;
}

/// <summary>
/// Returns localized distance and estimated walking time strings based on the radius
/// (300 m ~ 5 min, 500 m ~ 10 min, 1 km ~ 15 min).
/// </summary>
export function getRadiusLabels(radius: number, language: Language): RadiusLabels {
  if (language === 'pl') {
    if (radius === 300) return { dist: '300 m', time: '5 min' };
    if (radius === 500) return { dist: '500 m', time: '10 min' };
    return { dist: '1 km', time: '15 min' };
  }
  if (language === 'ua') {
    if (radius === 300) return { dist: '300 м', time: '5 хв' };
    if (radius === 500) return { dist: '500 м', time: '10 хв' };
    return { dist: '1 км', time: '15 хв' };
  }
  // English fallback
  if (radius === 300) return { dist: '300 m', time: '5 min' };
  if (radius === 500) return { dist: '500 m', time: '10 min' };
  return { dist: '1 km', time: '15 min' };
}

/// <summary>
/// Categorizes any facility into one of the 4 parent pillar marker types.
/// </summary>
export function getPoiType(poi: PointOfInterestDto): 'nursery' | 'kindergarten' | 'school' | 'park' {
  if (poi.subCategory === 'PRIMARY_SCHOOL') return 'school';
  if (poi.subCategory === 'KINDERGARTEN') return 'kindergarten';
  if (poi.subCategory === 'CITY_PARK' || poi.subCategory === 'POCKET_PARK') return 'park';
  return 'nursery';
}

/// <summary>
/// Standard Haversine distance formula returning distance in meters between two coordinates.
/// </summary>
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/// <summary>
/// Offsets overlapping POIs located at the exact same geographic coordinate
/// into a small circular rosette so all facilities are visible and clickable.
/// </summary>
export function deduplicateLocations(rawPois: PointOfInterestDto[]): DisplayPoi[] {
  const coordMap = new Map<string, PointOfInterestDto[]>();

  rawPois.forEach((poi) => {
    const key = `${poi.lat.toFixed(6)},${poi.lng.toFixed(6)}`;
    const group = coordMap.get(key) ?? [];
    group.push(poi);
    coordMap.set(key, group);
  });

  const result: DisplayPoi[] = [];

  coordMap.forEach((group) => {
    if (group.length === 1) {
      result.push({
        ...group[0],
        displayLat: group[0].lat,
        displayLng: group[0].lng,
      });
    } else {
      const radiusOffset = 0.00018; // approx 15-20 meters on map
      group.forEach((poi, index) => {
        const angle = (index * 2 * Math.PI) / group.length;
        result.push({
          ...poi,
          displayLat: poi.lat + radiusOffset * Math.sin(angle),
          displayLng: poi.lng + (radiusOffset / Math.cos((poi.lat * Math.PI) / 180)) * Math.cos(angle),
        });
      });
    }
  });

  return result;
}
