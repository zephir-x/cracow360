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
  ExternalLink,
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
import { localizeDistrictName } from '../../../utils/districtLocalization';
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
  const { language } = useTranslation();
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
          Wczytywanie rejestrów dostępności architektonicznej i społecznej...
        </p>
      </div>
    );
  }

  if (!dataset) return null;

  return (
    <section className="space-y-6">
      {/* 1. Header Banner & City Stats Strip – Unified Kraków Blue Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-2xl shadow-blue-950/15 border border-blue-400/30 p-6 sm:p-8">
        {/* Animated Background Glow Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-300/15 blur-2xl animate-float-slow" />
          <div className="absolute -bottom-28 left-1/3 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              {t.sectionBadge}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              {t.officialDataBadge}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl mt-1.5 leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* City Stats Overview Strip – Clean Glassmorphic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3 border-t border-white/15">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md">
              <div className="flex items-center gap-2 text-sky-200 text-xs font-bold mb-1">
                <Car className="w-4 h-4 text-sky-300" />
                <span>{t.cityStats.blueEnvelopesTitle}</span>
              </div>
              <div className="text-2xl font-black text-white leading-none">
                {dataset.cityAverages.totalPrmParkingSpots.toLocaleString()}
              </div>
              <div className="text-[11px] text-blue-100/80 mt-1">
                {dataset.cityAverages.totalPrmLocations} {t.cityStats.locationsCountSuffix}
              </div>
              <div className="text-[10px] text-sky-200/70 mt-0.5">
                {t.cityStats.blueEnvelopesSub}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md">
              <div className="flex items-center gap-2 text-sky-200 text-xs font-bold mb-1">
                <Bus className="w-4 h-4 text-sky-300" />
                <span>{t.cityStats.stepFreeTitle}</span>
              </div>
              <div className="text-2xl font-black text-white leading-none">
                {dataset.cityAverages.avgKasselKerbPct}%
              </div>
              <div className="text-[11px] text-blue-100/80 mt-1">
                {t.cityStats.cityNetworkSuffix}
              </div>
              <div className="text-[10px] text-sky-200/70 mt-0.5">
                {t.cityStats.stepFreeSub}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md">
              <div className="flex items-center gap-2 text-sky-200 text-xs font-bold mb-1">
                <Building2 className="w-4 h-4 text-sky-300" />
                <span>{t.cityStats.publicOfficesTitle}</span>
              </div>
              <div className="text-2xl font-black text-white leading-none">
                {dataset.cityAverages.totalAuditedFacilities}
              </div>
              <div className="text-[11px] text-blue-100/80 mt-1">
                {t.cityStats.auditedSuffix}
              </div>
              <div className="text-[10px] text-sky-200/70 mt-0.5">
                {t.cityStats.publicOfficesSub}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md">
              <div className="flex items-center gap-2 text-sky-200 text-xs font-bold mb-1">
                <Heart className="w-4 h-4 text-sky-300" />
                <span>{t.cityStats.seniorClubsTitle}</span>
              </div>
              <div className="text-2xl font-black text-white leading-none">
                {dataset.cityAverages.totalSeniorCenters}
              </div>
              <div className="text-[11px] text-blue-100/80 mt-1">
                {t.cityStats.districtsSuffix}
              </div>
              <div className="text-[10px] text-sky-200/70 mt-0.5">
                {t.cityStats.seniorClubsSub}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Profile Selector Tabs */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.profilesLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const profileMeta = t.profiles[tab.key];
            const isActive = activeProfile === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveProfile(tab.key)}
                className={`flex flex-col items-start text-left p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20 scale-[1.01]'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2 rounded-xl transition-colors duration-300 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <div className="font-extrabold text-sm text-slate-900 leading-tight">
                  {profileMeta.title}
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
            const localizedName = localizeDistrictName(d.districtName, language);

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
                    {localizedName}
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

            {/* District Selector Dropdown */}
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
                    {d.districtRoman}. {localizeDistrictName(d.districtName, language)}
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
                {inspectedDistrict.districtRoman}. {localizeDistrictName(inspectedDistrict.districtName, language)}
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

          {/* 4 Domain Indicator Cards with Smooth Fade Animation */}
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
                  {t.inspectorCards.prmUnit}
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
                  • {inspectedDistrict.metrics.transit.kasselKerbStops} {t.inspectorCards.transitKassel}
                </div>
                <div>
                  • {inspectedDistrict.metrics.transit.tactilePavingStops} {t.inspectorCards.transitTactileUnit}
                </div>
                <div>
                  • {inspectedDistrict.metrics.transit.totalStops} {t.inspectorCards.transitTotal}
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
                  {t.inspectorCards.facilitiesUnit}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                <div>
                  • {inspectedDistrict.metrics.publicFacilities.elevators} {t.inspectorCards.facilitiesElevators}
                </div>
                <div>
                  • {inspectedDistrict.metrics.publicFacilities.accessibleToilets} {t.inspectorCards.facilitiesToilets}
                </div>
                <div>
                  • {inspectedDistrict.metrics.publicFacilities.hearingLoops} {t.inspectorCards.facilitiesHearingLoops}, {inspectedDistrict.metrics.publicFacilities.signLanguagePJM} {t.inspectorCards.facilitiesSignLanguage}
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
                  • {inspectedDistrict.metrics.recreation.cityParks} {t.inspectorCards.seniorParks}
                </div>
                <div>
                  • {inspectedDistrict.metrics.recreation.pocketParks} {t.inspectorCards.seniorPockets}
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
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>{t.noFacilitiesNotice}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {inspectedDistrict.facilities.map((fac, fIdx) => {
                  const isFull =
                    fac.wheelchairAccessible.includes('PE') &&
                    fac.wheelchairAccessible.includes('NA');
                  const locFac = getLocalizedFacility(fac, language);

                  return (
                    <div
                      key={fIdx}
                      className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-2.5 transition-all duration-200 hover:border-slate-300"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                            {locFac.name}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{fac.address}</span>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isFull
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {isFull ? t.wheelchairFull : t.wheelchairPartial}
                        </span>
                      </div>

                      {/* Amenities Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {fac.hasRamp && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            {t.amenities.ramp}
                          </span>
                        )}
                        {fac.hasElevatorOrPlatform && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {t.amenities.elevator}
                          </span>
                        )}
                        {fac.accessibleToilet && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                            {t.amenities.toilet}
                          </span>
                        )}
                        {fac.hearingLoop && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                            {t.amenities.loop}
                          </span>
                        )}
                        {fac.signLanguageTranslator && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-pink-50 text-pink-700 border border-pink-100">
                            {t.amenities.pjm}
                          </span>
                        )}
                        {fac.brailleOrTactile && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                            {t.amenities.braille}
                          </span>
                        )}
                      </div>

                      {locFac.departments && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
                          <span className="font-semibold text-slate-700">
                            {t.facilityDepartments}{' '}
                          </span>
                          {locFac.departments}
                        </div>
                      )}

                      {locFac.auditDescription && (
                        <div className="text-[11px] text-slate-600 leading-relaxed italic border-t border-slate-100 pt-2">
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
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>{t.footerDataNotice}</span>
            <a
              href="/methodology"
              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold shrink-0"
            >
              {t.methodologyLink} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
