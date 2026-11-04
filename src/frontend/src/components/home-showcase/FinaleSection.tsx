import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Baby,
  BookOpen,
  Building2,
  Compass,
  ExternalLink,
  Globe,
  GraduationCap,
  Home,
  Landmark,
  MousePointerClick,
} from 'lucide-react';
import type { AppTabId } from '../layout/MainNavbar';
import type {
  HomeShowcaseTranslations,
  ShowcaseCardColorTheme,
  ShowcaseTeamMemberProfile,
} from '../../i18n/modules';

export interface FinaleSectionProps {
  visualStoryCopy: HomeShowcaseTranslations['visualStory'];
  portalsCopy: HomeShowcaseTranslations['portals'];
  teamCopy: HomeShowcaseTranslations['teamBanner'];
  onSelectTab: (tab: AppTabId) => void;
}

interface ColorThemePalette {
  glareRgba: string;
  cardBorderHover: string;
  cardShadowHover: string;
  codePillClasses: string;
  badgeText: string;
  titleHoverText: string;
  ctaBarClasses: string;
  ctaTextClasses: string;
  ctaIconClasses: string;
  storyBadgeClasses: string;
  storyTitleHover: string;
  storyBorderGlow: string;
}

const COLOR_THEMES: Record<ShowcaseCardColorTheme, ColorThemePalette> = {
  blue: {
    glareRgba: 'rgba(37, 99, 235, 0.16)',
    cardBorderHover: 'hover:border-blue-300',
    cardShadowHover: 'hover:shadow-[0_28px_70px_rgba(37,99,235,0.20)]',
    codePillClasses:
      'bg-slate-100 group-hover:bg-blue-50 border-slate-200 group-hover:border-blue-200 text-slate-600 group-hover:text-blue-700',
    badgeText: 'text-blue-600',
    titleHoverText: 'group-hover:text-blue-700',
    ctaBarClasses:
      'bg-blue-50/90 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-sky-500 border-blue-200/80 group-hover:border-transparent',
    ctaTextClasses: 'text-blue-700 group-hover:text-white',
    ctaIconClasses: 'text-blue-600 group-hover:text-white',
    storyBadgeClasses:
      'bg-blue-500/30 border-sky-400/50 text-sky-200',
    storyTitleHover: 'group-hover:text-sky-300',
    storyBorderGlow: 'border-blue-300/70 hover:border-sky-400',
  },
  emerald: {
    glareRgba: 'rgba(16, 185, 129, 0.17)',
    cardBorderHover: 'hover:border-emerald-300',
    cardShadowHover: 'hover:shadow-[0_28px_70px_rgba(16,185,129,0.20)]',
    codePillClasses:
      'bg-slate-100 group-hover:bg-emerald-50 border-slate-200 group-hover:border-emerald-200 text-slate-600 group-hover:text-emerald-700',
    badgeText: 'text-emerald-600',
    titleHoverText: 'group-hover:text-emerald-700',
    ctaBarClasses:
      'bg-emerald-50/90 group-hover:bg-linear-to-r group-hover:from-emerald-600 group-hover:to-teal-500 border-emerald-200/80 group-hover:border-transparent',
    ctaTextClasses: 'text-emerald-700 group-hover:text-white',
    ctaIconClasses: 'text-emerald-600 group-hover:text-white',
    storyBadgeClasses:
      'bg-emerald-500/30 border-emerald-400/50 text-emerald-200',
    storyTitleHover: 'group-hover:text-emerald-300',
    storyBorderGlow: 'border-emerald-300/70 hover:border-emerald-400',
  },
  violet: {
    glareRgba: 'rgba(124, 58, 237, 0.17)',
    cardBorderHover: 'hover:border-violet-300',
    cardShadowHover: 'hover:shadow-[0_28px_70px_rgba(124,58,237,0.20)]',
    codePillClasses:
      'bg-slate-100 group-hover:bg-violet-50 border-slate-200 group-hover:border-violet-200 text-slate-600 group-hover:text-violet-700',
    badgeText: 'text-violet-600',
    titleHoverText: 'group-hover:text-violet-700',
    ctaBarClasses:
      'bg-violet-50/90 group-hover:bg-linear-to-r group-hover:from-violet-600 group-hover:to-purple-500 border-violet-200/80 group-hover:border-transparent',
    ctaTextClasses: 'text-violet-700 group-hover:text-white',
    ctaIconClasses: 'text-violet-600 group-hover:text-white',
    storyBadgeClasses:
      'bg-violet-500/30 border-violet-400/50 text-violet-200',
    storyTitleHover: 'group-hover:text-violet-300',
    storyBorderGlow: 'border-violet-300/70 hover:border-violet-400',
  },
  amber: {
    glareRgba: 'rgba(245, 158, 11, 0.18)',
    cardBorderHover: 'hover:border-amber-300',
    cardShadowHover: 'hover:shadow-[0_28px_70px_rgba(245,158,11,0.20)]',
    codePillClasses:
      'bg-slate-100 group-hover:bg-amber-50 border-slate-200 group-hover:border-amber-200 text-slate-600 group-hover:text-amber-700',
    badgeText: 'text-amber-600',
    titleHoverText: 'group-hover:text-amber-600',
    ctaBarClasses:
      'bg-amber-50/90 group-hover:bg-linear-to-r group-hover:from-amber-500 group-hover:to-orange-500 border-amber-200/80 group-hover:border-transparent',
    ctaTextClasses: 'text-amber-800 group-hover:text-white',
    ctaIconClasses: 'text-amber-600 group-hover:text-white',
    storyBadgeClasses:
      'bg-amber-500/30 border-amber-400/50 text-amber-200',
    storyTitleHover: 'group-hover:text-amber-300',
    storyBorderGlow: 'border-amber-300/70 hover:border-amber-400',
  },
  slate: {
    glareRgba: 'rgba(51, 65, 85, 0.18)',
    cardBorderHover: 'hover:border-slate-400',
    cardShadowHover: 'hover:shadow-[0_28px_70px_rgba(30,41,59,0.22)]',
    codePillClasses:
      'bg-slate-100 group-hover:bg-slate-200 border-slate-200 group-hover:border-slate-300 text-slate-700 group-hover:text-slate-900',
    badgeText: 'text-slate-700',
    titleHoverText: 'group-hover:text-slate-800',
    ctaBarClasses:
      'bg-slate-100 group-hover:bg-linear-to-r group-hover:from-slate-800 group-hover:to-blue-900 border-slate-300/80 group-hover:border-transparent',
    ctaTextClasses: 'text-slate-800 group-hover:text-white',
    ctaIconClasses: 'text-slate-700 group-hover:text-white',
    storyBadgeClasses:
      'bg-slate-700/65 border-slate-400/50 text-slate-200',
    storyTitleHover: 'group-hover:text-sky-200',
    storyBorderGlow: 'border-slate-300/80 hover:border-slate-400',
  },
};

function getPortalIcon(tabId: AppTabId) {
  switch (tabId) {
    case 'resident':
      return <Compass className="w-6 h-6 text-white" />;
    case 'parent':
      return <Baby className="w-6 h-6 text-white" />;
    case 'investor':
      return <Building2 className="w-6 h-6 text-white" />;
    case 'tourist':
      return <Landmark className="w-6 h-6 text-white" />;
    case 'methodology':
      return <BookOpen className="w-6 h-6 text-white" />;
    default:
      return <Compass className="w-6 h-6 text-white" />;
  }
}

/**
 * Interactive 3D-Tilt Module Portal Card with color-matched cursor glare and CTA button.
 */
function TiltPortalCard({
  card,
  onSelectTab,
}: {
  card: HomeShowcaseTranslations['portals']['cards'][number];
  onSelectTab: (tab: AppTabId) => void;
}) {
  const [tilt, setTilt] = useState<{
    rx: number;
    ry: number;
    gx: number;
    gy: number;
    active: boolean;
  }>({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const palette = COLOR_THEMES[card.colorTheme] ?? COLOR_THEMES.blue;

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width); // 0..1
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height); // 0..1
    const ry = (nx - 0.5) * 11;
    const rx = (0.5 - ny) * 11;
    setTilt({
      rx,
      ry,
      gx: nx * 100,
      gy: ny * 100,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  return (
    <button
      type="button"
      onClick={() => onSelectTab(card.tabId)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.016, 1.016, 1.016)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: tilt.active
          ? 'transform 80ms ease-out'
          : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative text-left rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-white border border-slate-200/90 ${palette.cardBorderHover} shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${palette.cardShadowHover} overflow-hidden flex flex-col justify-between cursor-pointer`}
    >
      {/* Top Gradient Accent Bar */}
      <div
        className={`absolute top-0 inset-x-0 h-2 bg-linear-to-r ${card.accentGradient}`}
      />

      {/* Specular Glare Overlay following the pointer (color-matched to the card's theme) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(380px circle at ${tilt.gx.toFixed(1)}% ${tilt.gy.toFixed(1)}%, ${palette.glareRgba}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 space-y-3 sm:space-y-4">
        {/* Top Row: Icon Orb + Module Code Badge */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-br ${card.accentGradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}
          >
            {getPortalIcon(card.tabId)}
          </div>

          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full border font-mono text-[10px] sm:text-[11px] font-extrabold transition-colors whitespace-nowrap ${palette.codePillClasses}`}
          >
            {card.code}
          </span>
        </div>

        {/* Audience Badge & Title */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${palette.badgeText}`}>
            {card.badge}
          </div>
          <h3
            className={`text-lg sm:text-2xl font-black tracking-tight text-slate-900 ${palette.titleHoverText} transition-colors leading-snug`}
          >
            {card.title}
          </h3>
          <p className="text-xs font-bold text-slate-500 leading-relaxed">
            {card.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {card.description}
        </p>
      </div>

      {/* Bottom Metrics & Color-Matched Full-Width Non-Wrapping CTA Bar */}
      <div className="relative z-10 pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-slate-100 flex flex-col gap-2.5 sm:gap-3">
        <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-slate-500 truncate">
          {card.metricsLabel}
        </div>

        <div
          className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all duration-250 ${palette.ctaBarClasses}`}
        >
          <span className={`text-xs font-extrabold whitespace-nowrap ${palette.ctaTextClasses}`}>
            {card.ctaLabel}
          </span>
          <ArrowUpRight
            className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ${palette.ctaIconClasses}`}
          />
        </div>
      </div>
    </button>
  );
}

/**
 * Fixed-Height Horizontal Slide Author Profile Card:
 * - Zero vertical height jump: on desktop, each row has a constant height and occupies 100% width.
 * - Left column: Base author card with profile photo, non-truncating role pill, name, and university.
 * - Right stage:
 *   - At rest (not hovered): Displays a cohesive royal-blue showcase of the author's key domain pillars & highlights.
 *   - On hover / tap: The resting showcase glides out to the right while the full biographical story & links slide out from the left card toward the right!
 */
function ExpandableTeamMemberCard({
  member,
  isExpanded,
  onHoverEnter,
  onHoverLeave,
  onToggleClick,
}: {
  member: ShowcaseTeamMemberProfile;
  isExpanded: boolean;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onToggleClick: () => void;
}) {
  return (
    <div
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      onClick={onToggleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleClick();
        }
      }}
      className={`group/member relative w-full lg:h-54 rounded-2xl sm:rounded-3xl backdrop-blur-xl border transition-colors duration-500 overflow-hidden cursor-pointer flex flex-col lg:flex-row items-stretch ${
        isExpanded
          ? 'bg-linear-to-r from-blue-950/85 via-blue-900/80 to-sky-900/75 border-sky-300/75 shadow-[0_24px_60px_rgba(8,47,73,0.5)]'
          : 'bg-white/12 hover:bg-white/16 border-white/25 shadow-lg'
      }`}
    >
      {/* LEFT BASE AUTHOR TILE */}
      <div
        className={`p-4 sm:p-6 lg:w-96 shrink-0 flex items-center gap-3.5 sm:gap-5 border-b lg:border-b-0 lg:border-r transition-colors duration-500 ${
          isExpanded
            ? 'border-sky-300/35 bg-blue-950/45'
            : 'border-white/20 bg-white/8'
        }`}
      >
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-sky-300/80 shadow-[0_8px_25px_rgba(14,165,233,0.4)] bg-blue-950">
            <img
              src={member.avatarSrc}
              alt={member.name}
              className="w-full h-full object-cover object-top group-hover/member:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="-bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-linear-to-br from-sky-400 to-blue-600 border border-white/70 flex items-center justify-center shadow-md absolute">
            <GraduationCap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
          {/* Concise Role Pill (never truncated) */}
          <div className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full bg-sky-400/20 border border-sky-300/45 text-[9px] sm:text-[10px] font-extrabold text-sky-200 tracking-wide uppercase">
            <span>{member.roleBadge}</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight">
            {member.name}
          </h3>

          <p className="text-[11px] sm:text-xs font-semibold text-sky-100/90 leading-snug whitespace-pre-line">
            {member.university}
          </p>

          <div className="inline-flex items-center gap-1.5 pt-0.5 text-[10px] sm:text-[11px] font-bold text-sky-200">
            <span>{member.expandHint}</span>
            <ArrowRight
              className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-300 ${
                isExpanded ? 'translate-x-1.5 text-sky-300' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* RIGHT HORIZONTAL STAGE (FIXED HEIGHT ON DESKTOP: RESTING SHOWCASE <-> SLIDING BIOGRAPHY) */}
      <div className="relative flex-1 overflow-hidden">
        {/* STATE 1 (DEFAULT RESTING PLACEHOLDER): Cohesive Domain Showcase */}
        <div
          className={`p-4 sm:p-6 h-full flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded
              ? 'lg:opacity-0 lg:translate-x-12 lg:pointer-events-none hidden lg:flex'
              : 'opacity-100 translate-x-0 flex'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <div className="text-xs sm:text-base font-extrabold text-white tracking-tight">
                {member.idleSummaryTitle}
              </div>
              <p className="text-[11px] sm:text-xs text-sky-100/85 line-clamp-1 mt-0.5">
                {member.idleSummarySubtitle}
              </p>
            </div>

            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-sky-200 shrink-0">
              <MousePointerClick className="w-3.5 h-3.5 text-sky-300" />
              <span>{member.expandHint}</span>
            </div>
          </div>

          {/* 3 Royal-Blue Highlight Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 my-2.5 sm:my-3 lg:my-0">
            {member.idleHighlights.map((hl, idx) => (
              <div
                key={idx}
                className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-blue-950/35 border border-sky-300/25 flex flex-col justify-center"
              >
                <div className="text-xs sm:text-sm font-black text-sky-200 font-mono">
                  {hl.value}
                </div>
                <div className="text-[10px] sm:text-[11px] text-sky-100/85 leading-snug mt-0.5 line-clamp-1">
                  {hl.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Tags Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/15 text-[9px] sm:text-[10px] font-mono font-bold text-sky-100/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* STATE 2 (HOVERED EXPANDED BIOGRAPHY): Slides out horizontally from the left card toward the right */}
        <div
          className={`p-4 sm:p-6 lg:absolute lg:inset-0 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded
              ? 'opacity-100 translate-x-0 pointer-events-auto flex'
              : 'lg:opacity-0 lg:-translate-x-12 lg:pointer-events-none hidden lg:flex'
          }`}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 text-left">
            {/* Column 1: Personal Profile & Connection to Krakow */}
            <div className="space-y-1">
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                {member.krakowStoryTitle}
              </div>
              <p className="text-[11px] sm:text-xs text-sky-50/95 leading-relaxed">
                {member.krakowStoryBody}
              </p>
            </div>

            {/* Column 2: Contribution to Kraków360 */}
            <div className="space-y-1">
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                {member.contributionTitle}
              </div>
              <p className="text-[11px] sm:text-xs text-sky-50/95 leading-relaxed">
                {member.contributionBody}
              </p>
            </div>
          </div>

          {/* Bottom Row inside Expanded Drawer: Specialty Tags + Direct Clickable Links */}
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-2.5 py-0.5 rounded-lg bg-white/12 border border-white/20 text-[9px] sm:text-[10px] font-mono font-bold text-sky-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={member.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-3 sm:px-3.5 py-1.5 rounded-xl bg-white text-blue-900 hover:bg-sky-100 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.03]"
              >
                <span>{member.linkedInLabel}</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
              </a>

              {member.portfolioUrl && member.portfolioLabel && (
                <a
                  href={member.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto justify-center px-3 sm:px-3.5 py-1.5 rounded-xl bg-sky-500/30 hover:bg-sky-500/45 border border-sky-300/60 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.03]"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-200" />
                  <span>{member.portfolioLabel}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinaleSection({
  visualStoryCopy,
  portalsCopy,
  teamCopy,
  onSelectTab,
}: FinaleSectionProps) {
  const [expandedMemberId, setExpandedMemberId] = useState<'kacper' | 'filip' | null>(null);

  return (
    <div className="max-w-360 mx-auto px-3 sm:px-8 pt-8 sm:pt-12 pb-0 space-y-12 sm:space-y-20">
      {/* PART 1: 5 COLOR-CODED VISUAL STORY CARDS */}
      <section className="space-y-6 sm:space-y-8" aria-label="Przewodnik po etapach życia w Krakowie">
        {/* Header: Centered on mobile, left-aligned on sm+ */}
        <div className="max-w-3xl space-y-2.5 sm:space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-extrabold tracking-wider uppercase">
            <Home className="w-3.5 h-3.5 text-sky-600" />
            {visualStoryCopy.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="block">{visualStoryCopy.titleLead}</span>
            <span className="block bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              {visualStoryCopy.titleAccent}
            </span>
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            {visualStoryCopy.description}
          </p>
        </div>

        {/* Top Row: First 2 Visual Story Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {visualStoryCopy.cards.slice(0, 2).map((storyCard) => {
            const palette = COLOR_THEMES[storyCard.colorTheme] ?? COLOR_THEMES.blue;
            return (
              <div
                key={storyCard.id}
                onClick={() => onSelectTab(storyCard.tabId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectTab(storyCard.tabId);
                }}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border-2 ${palette.storyBorderGlow} shadow-[0_22px_60px_rgba(15,23,42,0.14)] cursor-pointer min-h-72 sm:min-h-96 flex flex-col justify-end transition-all duration-300`}
              >
                <img
                  src={storyCard.imageSrc}
                  alt={storyCard.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/92 via-slate-950/40 to-transparent" />

                <div className="relative z-10 p-4 sm:p-7 text-white space-y-1.5 sm:space-y-2">
                  <div>
                    <span
                      className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md border text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${palette.storyBadgeClasses}`}
                    >
                      {storyCard.badge}
                    </span>
                  </div>
                  <h3
                    className={`text-lg sm:text-2xl font-black tracking-tight leading-snug ${palette.storyTitleHover} transition-colors`}
                  >
                    {storyCard.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {storyCard.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Row: Next 3 Visual Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visualStoryCopy.cards.slice(2).map((storyCard) => {
            const palette = COLOR_THEMES[storyCard.colorTheme] ?? COLOR_THEMES.blue;
            return (
              <div
                key={storyCard.id}
                onClick={() => onSelectTab(storyCard.tabId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectTab(storyCard.tabId);
                }}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border-2 ${palette.storyBorderGlow} shadow-[0_22px_60px_rgba(15,23,42,0.14)] cursor-pointer min-h-64 sm:min-h-86 flex flex-col justify-end transition-all duration-300`}
              >
                <img
                  src={storyCard.imageSrc}
                  alt={storyCard.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/92 via-slate-950/45 to-transparent" />

                <div className="relative z-10 p-4 sm:p-6 text-white space-y-1.5 sm:space-y-2">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border text-[10px] font-extrabold uppercase tracking-wider ${palette.storyBadgeClasses}`}
                    >
                      {storyCard.badge}
                    </span>
                  </div>
                  <h3
                    className={`text-base sm:text-xl font-black tracking-tight leading-snug ${palette.storyTitleHover} transition-colors`}
                  >
                    {storyCard.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {storyCard.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PART 2: 5 INTERACTIVE 3D-TILT MODULE PORTALS */}
      <section className="space-y-6 sm:space-y-8" aria-label="Portale Modułów Analitycznych Kraków360">
        {/* Header: Centered on mobile, left-aligned on sm+ */}
        <div className="max-w-3xl space-y-2.5 sm:space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-extrabold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            {portalsCopy.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="block">{portalsCopy.titleLead}</span>
            <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              {portalsCopy.titleAccent}
            </span>
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            {portalsCopy.description}
          </p>
        </div>

        {/* Bento Grid: Top 3 Primary Persona Portals + Bottom 2 Discovery/Methodology Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {portalsCopy.cards.slice(0, 3).map((card) => (
            <TiltPortalCard
              key={card.tabId}
              card={card}
              onSelectTab={onSelectTab}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {portalsCopy.cards.slice(3).map((card) => (
            <TiltPortalCard
              key={card.tabId}
              card={card}
              onSelectTab={onSelectTab}
            />
          ))}
        </div>
      </section>

      {/* PART 3: TEAM PERCEPCJA360 ROYAL-BLUE BANNER WITH HORIZONTAL SLIDING PROFILES */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-10 bg-linear-to-r from-blue-800 via-blue-700 to-sky-600 text-white border border-sky-300/40 shadow-[0_24px_65px_rgba(37,99,235,0.28)] space-y-5 sm:space-y-6">
        {/* Ambient decorative royal-blue light glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Header Row: Centered on mobile, horizontal on lg+ */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4 items-center text-center lg:items-start lg:text-left">
          <div className="space-y-2 max-w-3xl flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-sky-200" />
              {teamCopy.badge}
            </div>
            <h2 className="text-xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {teamCopy.title}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/95 font-medium leading-relaxed">
              {teamCopy.subtitle}
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-950/40 border border-sky-300/30 text-xs font-bold text-sky-200 shrink-0">
            <MousePointerClick className="w-4 h-4 text-sky-300 shrink-0" />
            <span>{teamCopy.hoverPrompt}</span>
          </div>
        </div>

        {/* Vertically Stacked Author Rows with Fixed Height and Horizontal Right-Slide Reveal */}
        <div className="relative z-10 flex flex-col gap-3.5 sm:gap-4">
          {teamCopy.members.map((member) => (
            <ExpandableTeamMemberCard
              key={member.id}
              member={member}
              isExpanded={expandedMemberId === member.id}
              onHoverEnter={() => setExpandedMemberId(member.id)}
              onHoverLeave={() =>
                setExpandedMemberId((prev) => (prev === member.id ? null : prev))
              }
              onToggleClick={() =>
                setExpandedMemberId((prev) =>
                  prev === member.id ? null : member.id
                )
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
