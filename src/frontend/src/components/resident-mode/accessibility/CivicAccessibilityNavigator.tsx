import React, { useEffect, useMemo, useState } from 'react';
import {
  Accessibility,
  Eye,
  Ear,
  Heart,
  Baby,
  Building2,
  Car,
  Bus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  MapPin,
  Info,
} from 'lucide-react';
import { cracow360Api } from '../../../api/client';
import { useTranslation } from '../../../i18n/I18nContext';
import {
  getAccessibilityI18n,
  getLocalizedDistrictStrengths,
  getPrmPillLabel,
  getCasPillLabel,
  getLocalizedFacility,
} from '../../../i18n/modules';
import { getShortDistrictName } from '../../../utils/districtLocalization';
import type {
  AccessibilityDatasetDto,
  AccessibilityProfileKey,
  DistrictAccessibilityProfileDto,
} from '../../../types/contracts';

export interface CivicAccessibilityNavigatorProps {
  onSelectDistrictOnMap?: (districtId: number) => void;
}

interface ProfileTabConfig {
  key: AccessibilityProfileKey;
  icon: React.ComponentType<{ className?: string }>;
}

const PROFILE_TABS: ProfileTabConfig[] = [
  { key: 'mobility', icon: Accessibility },
  { key: 'visual', icon: Eye },
  { key: 'hearing', icon: Ear },
  { key: 'senior', icon: Heart },
  { key: 'familyStroller', icon: Baby },
];

export const CivicAccessibilityNavigator: React.FC<CivicAccessibilityNavigatorProps> = ({
  onSelectDistrictOnMap,
}) => {
  const { language, plural } = useTranslation();
  const t = getAccessibilityI18n(language);

  const [dataset, setDataset] = useState<AccessibilityDatasetDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeProfile, setActiveProfile] = useState<AccessibilityProfileKey>('mobility');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(1);

  // Load municipal accessibility dataset on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    cracow360Api
      .getAccessibilityDataset()
      .then((data) => {
        if (isMounted) {
          setDataset(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load accessibility dataset:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute TOP 3 districts sorted by active profile score
  const topDistricts = useMemo(() => {
    if (!dataset || !dataset.districts) return [];
    return [...dataset.districts]
      .sort((a, b) => {
        switch (activeProfile) {
          case 'mobility':
            return b.scores.mobilityScore - a.scores.mobilityScore;
          case 'visual':
            return b.scores.visualScore - a.scores.visualScore;
          case 'hearing':
            return b.scores.hearingScore - a.scores.hearingScore;
          case 'senior':
            return b.scores.seniorScore - a.scores.seniorScore;
          case 'familyStroller':
            return b.scores.familyStrollerScore - a.scores.familyStrollerScore;
          default:
            return b.scores.overallScore - a.scores.overallScore;
        }
      })
      .slice(0, 3);
  }, [dataset, activeProfile]);

  // Selected district detailed profile
  const inspectedDistrict = useMemo(() => {
    if (!dataset || !dataset.districts) return null;
    return (
      dataset.districts.find((d) => d.districtId === selectedDistrictId) ||
      dataset.districts[0]
    );
  }, [dataset, selectedDistrictId]);

  const getScoreForProfile = (district: DistrictAccessibilityProfileDto) => {
    switch (activeProfile) {
      case 'mobility':
        return district.scores.mobilityScore;
      case 'visual':
        return district.scores.visualScore;
      case 'hearing':
        return district.scores.hearingScore;
      case 'senior':
        return district.scores.seniorScore;
      case 'familyStroller':
        return district.scores.familyStrollerScore;
      default:
        return district.scores.overallScore;
    }
  };

  const handleInspectDistrict = (districtId: number) => {
    setSelectedDistrictId(districtId);
    if (onSelectDistrictOnMap) {
      onSelectDistrictOnMap(districtId);
    }
    const elem = document.getElementById('accessibility-inspector');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading && !dataset) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs flex flex-col items-center justify-center min-h-75 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-700">
          Loading registers of architectural and social accessibility...
        </p>
      </div>
    );
  }

  if (!dataset) return null;

  return (
    <section
      aria-label="Kraków bez Barier – Asystent Dostępności"
      className="space-y-6"
    >
      {/* 1. Header & Overview Hero Card – Unified Kraków Blue & White Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-6 sm:p-8 lg:p-10 shadow-2xl shadow-blue-950/15 border border-blue-400/30">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-sky-100 uppercase tracking-wide shadow-xs">
              <ShieldCheck className="w-4 h-4 text-sky-300" />
              <span>{t.sectionBadge}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-sky-100/90 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>{t.officialDataBadge}</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed font-normal">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* City Aggregate Telemetry Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {/* PRM Parking */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg space-y-1">
              <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs">
                <Car className="w-4 h-4" />
                <span>{t.cityStats.blueEnvelopesTitle}</span>
              </div>
              <div className="text-2xl font-black text-blue-900 leading-none">
                {dataset.cityAverages.totalPrmParkingSpots.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {dataset.cityAverages.totalPrmLocations} {t.cityStats.locationsCountSuffix}
              </div>
              <div className="text-[10px] text-slate-400">
                {t.cityStats.blueEnvelopesSub}
              </div>
            </div>

            {/* Kassel-Kerb Bus/Tram Stops */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg space-y-1">
              <div className="flex items-center gap-2 text-sky-700 font-extrabold text-xs">
                <Bus className="w-4 h-4" />
                <span>{t.cityStats.stepFreeTitle}</span>
              </div>
              <div className="text-2xl font-black text-sky-700 leading-none">
                {dataset.cityAverages.avgKasselKerbPct}%
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {t.cityStats.cityNetworkSuffix}
              </div>
              <div className="text-[10px] text-slate-400">
                {t.cityStats.stepFreeSub}
              </div>
            </div>

            {/* Audited City Hall Offices */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg space-y-1">
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs">
                <Building2 className="w-4 h-4" />
                <span>{t.cityStats.publicOfficesTitle}</span>
              </div>
              <div className="text-2xl font-black text-indigo-700 leading-none">
                {dataset.cityAverages.totalAuditedFacilities}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {t.cityStats.auditedSuffix}
              </div>
              <div className="text-[10px] text-slate-400">
                {t.cityStats.publicOfficesSub}
              </div>
            </div>

            {/* Senior Activity Centres */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg space-y-1">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                <Heart className="w-4 h-4" />
                <span>{t.cityStats.seniorClubsTitle}</span>
              </div>
              <div className="text-2xl font-black text-rose-700 leading-none">
                {dataset.cityAverages.totalSeniorCenters}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {t.cityStats.districtsSuffix}
              </div>
              <div className="text-[10px] text-slate-400">
                {t.cityStats.seniorClubsSub}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mobility Profile Selector Tabs */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-slate-500 mb-1">
            {t.profilesLabel}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProfile === tab.key;
            const profileMeta = t.profiles[tab.key];

            return (
              <button
                key={tab.key}
                onClick={() => setActiveProfile(tab.key)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span
                    className={`text-xs font-black leading-tight ${
                      isActive ? 'text-blue-900' : 'text-slate-800'
                    }`}
                  >
                    {profileMeta.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {profileMeta.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Profile Details Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-700">
            <span className="font-bold text-blue-900">
              {t.profiles[activeProfile].desc}.{' '}
            </span>
            <span className="text-slate-600">
              {t.keyCriteriaLabel}: {t.profiles[activeProfile].keyFactor}.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Top 3 Recommended Districts Grid for Active Profile with Fade-In Animation */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {t.topRecommendationsTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.topRecommendationsSubtitle}
            </p>
          </div>
        </div>

        <div
          key={activeProfile}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in"
        >
          {topDistricts.map((d, index) => {
            const score = getScoreForProfile(d);
            const rankLabel = `${t.rankBadgePrefix} #${index + 1}`;
            const isRank1 = index === 0;
            const localizedStrengths = getLocalizedDistrictStrengths(d.metrics, language, activeProfile);
            const shortName = getShortDistrictName(d.districtName);

            return (
              <div
                key={d.districtId}
                className={`rounded-3xl border p-5 shadow-xs transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isRank1
                    ? 'border-amber-300 bg-linear-to-b from-amber-50/40 via-white to-white ring-1 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
                        isRank1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : index === 1
                          ? 'bg-slate-100 text-slate-800 border border-slate-300'
                          : 'bg-orange-50 text-orange-800 border border-orange-200'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      {rankLabel}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 mb-1">
                    {d.districtRoman}. {shortName}
                  </h4>

                  {/* Match Score Gauge */}
                  <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-baseline justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-500">
                        {t.matchScoreLabel}
                      </span>
                      <span className="text-base font-black text-blue-700">
                        {score.toFixed(1)} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                      />
                    </div>
                  </div>

                  {/* Profile-Specific Micro Badges with Human-Friendly Localized Labels */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 mb-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        {d.metrics.prmParking.totalSpots} {getPrmPillLabel(d.metrics.prmParking.totalSpots, language)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>
                        {d.metrics.transit.kasselKerbPct}% {t.topCard.stepFreePill}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        {d.metrics.transit.tactilePavingPct}% {t.topCard.tactilePill}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        {d.metrics.seniorCare.casCount} {getCasPillLabel(d.metrics.seniorCare.casCount, language)}
                      </span>
                    </div>
                  </div>

                  {/* Key Strengths (Context-Aware by Profile & 100% Localized) */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {t.keyStrengthsTitle}
                    </div>
                    {localizedStrengths.map((str, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleInspectDistrict(d.districtId)}
                  className="w-full mt-2 py-2 px-3 rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.topCard.viewAudit}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Granular District Infrastructure Inspector with Smooth Transition */}
      {inspectedDistrict && (
        <div
          id="accessibility-inspector"
          className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6 scroll-mt-24"
        >
          {/* Inspector Header with District Dropdown & Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Building2 className="w-4 h-4" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {t.districtInspectorTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {t.districtInspectorSubtitle}
              </p>
            </div>

            {/* District Selector Dropdown with Simplified Clean Names */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <label htmlFor="district-select" className="text-xs font-bold text-slate-600 shrink-0">
                {t.districtLabel}
              </label>
              <select
                id="district-select"
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
              >
                {dataset.districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>
                    {d.districtRoman}. {getShortDistrictName(d.districtName)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Highlights Banner with Smooth Fade Animation */}
          <div
            key={`banner-${selectedDistrictId}`}
            className="p-4 rounded-2xl bg-linear-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
          >
            <div>
              <div className="text-xs text-slate-500 font-semibold">
                {t.selectedDistrictHeading}
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {inspectedDistrict.districtRoman}. {getShortDistrictName(inspectedDistrict.districtName)}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {t.areaLabel}: {inspectedDistrict.areaKm2} km² • {t.residentsLabel}:{' '}
                {inspectedDistrict.totalPopulation.toLocaleString()} • {t.seniorsLabel}:{' '}
                {inspectedDistrict.seniors65Plus.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase font-bold">
                  {t.accessibilityIndexLabel}
                </div>
                <div className="text-lg font-black text-blue-700">
                  {inspectedDistrict.scores.overallScore.toFixed(1)}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Domain Indicator Cards with Dynamic Linguistic Plurals */}
          <div
            key={`cards-${selectedDistrictId}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in"
          >
            {/* PRM Parking Card */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs">
                <Car className="w-4 h-4" />
                <span>{t.inspectorCards.prmTitle}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {inspectedDistrict.metrics.prmParking.totalSpots}{' '}
                <span className="text-xs font-semibold text-slate-500">
                  {plural(inspectedDistrict.metrics.prmParking.totalSpots, t.plurals.prmSpots)}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                <div>
                  • {inspectedDistrict.metrics.prmParking.locationsCount} {t.inspectorCards.prmLocations}
                </div>
                <div>
                  • {inspectedDistrict.metrics.prmParking.spotsPer10kPop} {t.inspectorCards.prmPer10k}
                </div>
                <div>
                  • {inspectedDistrict.metrics.prmParking.spotsPerKm2} {t.inspectorCards.prmPerKm2}
                </div>
              </div>
            </div>

            {/* Transit Stops Card */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-sky-700 font-extrabold text-xs">
                <Bus className="w-4 h-4" />
                <span>{t.inspectorCards.transitTitle}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {inspectedDistrict.metrics.transit.kasselKerbPct}%{' '}
                <span className="text-xs font-semibold text-slate-500">
                  {t.inspectorCards.transitUnit}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                <div>
                  • {inspectedDistrict.metrics.transit.kasselKerbStops}{' '}
                  {plural(inspectedDistrict.metrics.transit.kasselKerbStops, t.plurals.transitKasselStops)}
                </div>
                <div>
                  • {inspectedDistrict.metrics.transit.tactilePavingStops}{' '}
                  {plural(inspectedDistrict.metrics.transit.tactilePavingStops, t.plurals.transitTactileStops)}
                </div>
                <div>
                  • {inspectedDistrict.metrics.transit.totalStops}{' '}
                  {plural(inspectedDistrict.metrics.transit.totalStops, t.plurals.transitTotalStops)}
                </div>
              </div>
            </div>

            {/* Public Facilities Card */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs">
                <Building2 className="w-4 h-4" />
                <span>{t.inspectorCards.facilitiesTitle}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {inspectedDistrict.metrics.publicFacilities.auditedTotal}{' '}
                <span className="text-xs font-semibold text-slate-500">
                  {plural(inspectedDistrict.metrics.publicFacilities.auditedTotal, t.plurals.facilitiesAudited)}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                <div>
                  • {inspectedDistrict.metrics.publicFacilities.elevators}{' '}
                  {plural(inspectedDistrict.metrics.publicFacilities.elevators, t.plurals.facilitiesElevators)}
                </div>
                <div>
                  • {inspectedDistrict.metrics.publicFacilities.accessibleToilets}{' '}
                  {plural(inspectedDistrict.metrics.publicFacilities.accessibleToilets, t.plurals.facilitiesToilets)}
                </div>
                <div>
                  • {inspectedDistrict.metrics.publicFacilities.hearingLoops}{' '}
                  {plural(inspectedDistrict.metrics.publicFacilities.hearingLoops, t.plurals.facilitiesHearingLoops)},{' '}
                  {inspectedDistrict.metrics.publicFacilities.signLanguagePJM}{' '}
                  {plural(inspectedDistrict.metrics.publicFacilities.signLanguagePJM, t.plurals.facilitiesSignLanguage)}
                </div>
              </div>
            </div>

            {/* Senior Care & Greenery Card */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                <Heart className="w-4 h-4" />
                <span>{t.inspectorCards.seniorTitle}</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {inspectedDistrict.metrics.seniorCare.casCount}{' '}
                <span className="text-xs font-semibold text-slate-500">
                  {getCasPillLabel(inspectedDistrict.metrics.seniorCare.casCount, language)} (CAS)
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                <div>
                  • {inspectedDistrict.metrics.seniorCare.casPer10kSeniors} {t.inspectorCards.seniorPer10k}
                </div>
                <div>
                  • {inspectedDistrict.metrics.recreation.cityParks}{' '}
                  {plural(inspectedDistrict.metrics.recreation.cityParks, t.plurals.recreationCityParks)}
                </div>
                <div>
                  • {inspectedDistrict.metrics.recreation.pocketParks}{' '}
                  {plural(inspectedDistrict.metrics.recreation.pocketParks, t.plurals.recreationPocketParks)}
                </div>
              </div>
            </div>
          </div>

          {/* Audited Municipal Facilities List Accordion / Details */}
          <div
            key={`facilities-${selectedDistrictId}`}
            className="space-y-3 pt-2 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900">
                {t.facilitiesListTitle} ({inspectedDistrict.facilities.length})
              </h4>
            </div>

            {inspectedDistrict.facilities.length === 0 ? (
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{t.noFacilitiesNotice}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {inspectedDistrict.facilities.map((fac, fIdx) => {
                  const locFac = getLocalizedFacility(fac, language);
                  const status = (fac.wheelchairAccessible || '').toUpperCase();
                  const isGood = status.includes('DOBR');
                  const isPartial = status.includes('CZ');
                  const isWeak = status.includes('SŁAB') || status.includes('SLAB');

                  return (
                    <div
                      key={fIdx}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-black text-slate-900">
                            {locFac.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{fac.address}</span>
                          </div>
                        </div>

                        <div>
                          {isGood ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {t.wheelchairGood}
                            </span>
                          ) : isPartial ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              {t.wheelchairPartial}
                            </span>
                          ) : isWeak ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              {t.wheelchairWeak}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              <AlertCircle className="w-3 h-3 text-slate-500" />
                              {t.wheelchairNone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {fac.hasRamp && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                            {t.amenities.ramp}
                          </span>
                        )}
                        {fac.hasElevatorOrPlatform && (
                          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                            {t.amenities.elevator}
                          </span>
                        )}
                        {fac.accessibleToilet && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                            {t.amenities.toilet}
                          </span>
                        )}
                        {fac.hearingLoop && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-200">
                            {t.amenities.loop}
                          </span>
                        )}
                        {fac.signLanguageTranslator && (
                          <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-200">
                            {t.amenities.pjm}
                          </span>
                        )}
                        {fac.brailleOrTactile && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
                            {t.amenities.braille}
                          </span>
                        )}
                      </div>

                      {locFac.departments && (
                        <div className="text-xs text-slate-600">
                          <span className="font-bold text-slate-700">
                            {t.facilityDepartments}{' '}
                          </span>
                          {locFac.departments}
                        </div>
                      )}

                      {locFac.auditDescription && (
                        <div className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          „{locFac.auditDescription}”
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 flex flex-col items-center">
            <span>{t.footerDataNotice}</span>
          </div>
        </div>
      )}
    </section>
  );
};
