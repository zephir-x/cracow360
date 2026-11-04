import { Baby, GraduationCap, Layers, LayoutGrid, ListFilter, Smile } from 'lucide-react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import { formatTitleWithBlueAccent, type ForecastFilter, type ViewMode } from './types';

export interface ForecastToolbarProps {
  activeCohort: ChildAgeCohort;
  onSelectCohort: (cohort: ChildAgeCohort) => void;
  sectionTitle: string;
  sectionSubtitle: string;
  activeFilter: ForecastFilter;
  onSelectFilter: (filter: ForecastFilter) => void;
  getFilterCount: (filter: ForecastFilter) => number;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  cohortsDef: {
    allLabel: string;
    infant: { title: string; ageRange: string };
    preschool: { title: string; ageRange: string };
    school: { title: string; ageRange: string };
  };
  filterLabels: {
    all: string;
    whiteSpots: string;
    balanced: string;
    surplus: string;
  };
  viewModeLabels: {
    grid: string;
    table: string;
  };
  switcherTitle?: string;
}

export function ForecastToolbar({
  activeCohort,
  onSelectCohort,
  sectionTitle,
  sectionSubtitle,
  activeFilter,
  onSelectFilter,
  getFilterCount,
  viewMode,
  onSelectViewMode,
  cohortsDef,
  filterLabels,
  viewModeLabels,
  switcherTitle,
}: ForecastToolbarProps) {
  // Sliding indicator for Cohort Switcher
  const cohortBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [cohortIndicatorStyle, setCohortIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeBtn = cohortBtnRefs.current[activeCohort];
      if (activeBtn) {
        setCohortIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeCohort]);

  // Sliding indicator for ViewMode Toggle
  const viewModeBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [viewModeIndicatorStyle, setViewModeIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeBtn = viewModeBtnRefs.current[viewMode];
      if (activeBtn) {
        setViewModeIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [viewMode]);

  const COHORTS: { id: ChildAgeCohort; label: string; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: cohortsDef.allLabel,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'infant',
      label: `${cohortsDef.infant.title} (${cohortsDef.infant.ageRange})`,
      icon: <Baby className="w-4 h-4" />,
    },
    {
      id: 'preschool',
      label: `${cohortsDef.preschool.title} (${cohortsDef.preschool.ageRange})`,
      icon: <Smile className="w-4 h-4" />,
    },
    {
      id: 'school',
      label: `${cohortsDef.school.title} (${cohortsDef.school.ageRange})`,
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  const FILTER_TABS: { id: ForecastFilter; label: string }[] = [
    { id: 'all', label: filterLabels.all },
    { id: 'whiteSpots', label: filterLabels.whiteSpots },
    { id: 'balanced', label: filterLabels.balanced },
    { id: 'surplus', label: filterLabels.surplus },
  ];

  const getTabColors = (tabId: ForecastFilter, isActive: boolean) => {
    if (tabId === 'whiteSpots') {
      return isActive
        ? 'bg-rose-600 text-white shadow-xs'
        : 'bg-rose-50/80 text-rose-700 border border-rose-200/80 hover:bg-rose-100/80';
    }
    if (tabId === 'balanced') {
      return isActive
        ? 'bg-amber-500 text-white shadow-xs'
        : 'bg-amber-50/80 text-amber-800 border border-amber-200/80 hover:bg-amber-100/80';
    }
    if (tabId === 'surplus') {
      return isActive
        ? 'bg-emerald-600 text-white shadow-xs'
        : 'bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/80';
    }
    return isActive
      ? 'bg-blue-600 text-white shadow-xs'
      : 'bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-200';
  };

  const getBadgeColors = (tabId: ForecastFilter, isActive: boolean) => {
    if (isActive) return 'bg-white/25 text-white';
    if (tabId === 'whiteSpots') return 'bg-rose-200 text-rose-900';
    if (tabId === 'balanced') return 'bg-amber-200 text-amber-900';
    if (tabId === 'surplus') return 'bg-emerald-200 text-emerald-900';
    return 'bg-slate-200 text-slate-700';
  };

  return (
    <>
      {/* Module Header with Cohort Icon Switcher aligned top-right */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
            {activeCohort === 'preschool' ? (
              <Smile className="w-5 h-5" />
            ) : activeCohort === 'school' ? (
              <GraduationCap className="w-5 h-5" />
            ) : activeCohort === 'infant' ? (
              <Baby className="w-5 h-5" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              {formatTitleWithBlueAccent(sectionTitle)}
            </h2>
            <p className="text-xs text-slate-500">{sectionSubtitle}</p>
          </div>
        </div>

        {/* Compact, Smooth Sliding Icon-Only Cohort Switcher */}
        <div
          className="relative inline-flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-2xs select-none self-center sm:self-auto shrink-0"
          title={switcherTitle || 'Przełącz profil wiekowy'}
        >
          <div
            className="absolute top-0.5 bottom-0.5 left-0 rounded-full bg-white shadow-xs border border-blue-200/70 transition-all duration-300 ease-out pointer-events-none"
            style={{
              transform: `translate3d(${cohortIndicatorStyle.left}px, 0, 0)`,
              width: `${cohortIndicatorStyle.width}px`,
              opacity: cohortIndicatorStyle.opacity,
            }}
          />

          {COHORTS.map((c) => {
            const isActive = activeCohort === c.id;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  cohortBtnRefs.current[c.id] = el;
                }}
                onClick={() => onSelectCohort(c.id)}
                title={c.label}
                className={`relative z-10 px-2.5 py-1.5 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {c.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Filter Pills (Left) + View Mode Switcher (Right) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 text-center sm:text-left">
        {/* Category Filter Pills (All / White Spots / Balanced / Surplus) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = getFilterCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => onSelectFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${getTabColors(
                  tab.id,
                  isActive
                )}`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${getBadgeColors(
                    tab.id,
                    isActive
                  )}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Grid vs Table with sliding pill */}
        <div className="relative inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/80 self-center sm:self-auto shrink-0 select-none">
          <div
            className="absolute top-0.5 bottom-0.5 left-0 rounded-lg bg-white shadow-xs border border-blue-200/70 transition-all duration-200 ease-out pointer-events-none"
            style={{
              transform: `translate3d(${viewModeIndicatorStyle.left}px, 0, 0)`,
              width: `${viewModeIndicatorStyle.width}px`,
              opacity: viewModeIndicatorStyle.opacity,
            }}
          />

          <button
            ref={(el) => {
              viewModeBtnRefs.current['grid'] = el;
            }}
            onClick={() => onSelectViewMode('grid')}
            className={`relative z-10 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={viewModeLabels.grid}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{viewModeLabels.grid}</span>
          </button>
          <button
            ref={(el) => {
              viewModeBtnRefs.current['table'] = el;
            }}
            onClick={() => onSelectViewMode('table')}
            className={`relative z-10 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={viewModeLabels.table}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{viewModeLabels.table}</span>
          </button>
        </div>
      </div>
    </>
  );
}
