import { useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Baby,
  BookOpen,
  Building2,
  Compass,
  Database,
  GraduationCap,
  Home,
  Landmark,
  Users,
} from 'lucide-react';
import type { AppTabId } from '../layout/MainNavbar';
import type { HomeShowcaseTranslations } from '../../i18n/modules';

export interface FinaleSectionProps {
  visualStoryCopy: HomeShowcaseTranslations['visualStory'];
  portalsCopy: HomeShowcaseTranslations['portals'];
  teamCopy: HomeShowcaseTranslations['teamBanner'];
  onSelectTab: (tab: AppTabId) => void;
}

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
 * Interactive 3D-Tilt Module Portal Card.
 * Computes real-time perspective rotation and specular glare from pointer coordinates,
 * with a clean non-wrapping footer layout for metrics and the action button.
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
      className="group relative text-left rounded-3xl p-6 sm:p-7 bg-white border border-blue-100/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:shadow-[0_28px_70px_rgba(37,99,235,0.20)] overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* Top Gradient Accent Bar */}
      <div
        className={`absolute top-0 inset-x-0 h-2 bg-linear-to-r ${card.accentGradient}`}
      />

      {/* Specular Glare Overlay following the pointer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(380px circle at ${tilt.gx.toFixed(1)}% ${tilt.gy.toFixed(1)}%, rgba(56, 189, 248, 0.14), transparent 70%)`,
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Top Row: Icon Orb + Module Code Badge */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-2xl bg-linear-to-br ${card.accentGradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}
          >
            {getPortalIcon(card.tabId)}
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-100 group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-200 font-mono text-[11px] font-extrabold text-slate-600 group-hover:text-blue-700 transition-colors whitespace-nowrap">
            {card.code}
          </span>
        </div>

        {/* Audience Badge & Title */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
            {card.badge}
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
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

      {/* Bottom Metrics & Full-Width Non-Wrapping CTA Bar */}
      <div className="relative z-10 pt-4 mt-6 border-t border-slate-100 flex flex-col gap-3">
        <div className="text-[11px] font-mono font-semibold text-slate-500 truncate">
          {card.metricsLabel}
        </div>

        <div className="w-full px-4 py-2.5 rounded-xl bg-blue-50/80 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-sky-500 border border-blue-100 group-hover:border-transparent flex items-center justify-between gap-2 transition-all duration-250">
          <span className="text-xs font-extrabold text-blue-700 group-hover:text-white whitespace-nowrap">
            {card.ctaLabel}
          </span>
          <ArrowUpRight className="w-4 h-4 text-blue-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </div>
      </div>
    </button>
  );
}

export function FinaleSection({
  visualStoryCopy,
  portalsCopy,
  teamCopy,
  onSelectTab,
}: FinaleSectionProps) {
  return (
    <div className="max-w-360 mx-auto px-4 sm:px-8 py-12 space-y-20">
      {/* PART 1: VISUAL STORY DUO */}
      <section className="space-y-8" aria-label="Historia Rodziny i Smoka Wawelka">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-extrabold tracking-wider uppercase">
            <Home className="w-3.5 h-3.5 text-sky-600" />
            {visualStoryCopy.sectionBadge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="block">{visualStoryCopy.titleLead}</span>
            <span className="block bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              {visualStoryCopy.titleAccent}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {visualStoryCopy.description}
          </p>
        </div>

        {/* Two Cinema Duo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Card 1 */}
          <div
            onClick={() => onSelectTab('resident')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectTab('resident');
            }}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-blue-200/80 shadow-[0_22px_60px_rgba(15,23,42,0.14)] cursor-pointer min-h-95 sm:min-h-107.5 flex flex-col justify-end"
          >
            <img
              src="/showcase/rodzina.jpg"
              alt={visualStoryCopy.card1Title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/92 via-slate-950/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 text-white space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/25 backdrop-blur-md border border-sky-400/40 text-sky-200 text-[11px] font-extrabold uppercase tracking-wider">
                  {visualStoryCopy.card1Badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white">
                  {visualStoryCopy.card1Stat}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug group-hover:text-sky-300 transition-colors">
                {visualStoryCopy.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {visualStoryCopy.card1Desc}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectTab('parent')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectTab('parent');
            }}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-blue-200/80 shadow-[0_22px_60px_rgba(15,23,42,0.14)] cursor-pointer min-h-95 sm:min-h-107.5 flex flex-col justify-end"
          >
            <img
              src="/showcase/rodzina-2.jpg"
              alt={visualStoryCopy.card2Title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/92 via-slate-950/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 text-white space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-[11px] font-extrabold uppercase tracking-wider">
                  {visualStoryCopy.card2Badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white">
                  {visualStoryCopy.card2Stat}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                {visualStoryCopy.card2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {visualStoryCopy.card2Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PART 2: 5 INTERACTIVE 3D-TILT MODULE PORTALS */}
      <section className="space-y-8" aria-label="Portale Modułów Analitycznych Kraków360">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-extrabold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            {portalsCopy.sectionBadge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="block">{portalsCopy.titleLead}</span>
            <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              {portalsCopy.titleAccent}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {portalsCopy.description}
          </p>
        </div>

        {/* Bento Grid: Top 3 Primary Persona Portals + Bottom 2 Discovery/Methodology Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portalsCopy.cards.slice(0, 3).map((card) => (
            <TiltPortalCard
              key={card.tabId}
              card={card}
              onSelectTab={onSelectTab}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {portalsCopy.cards.slice(3).map((card) => (
            <TiltPortalCard
              key={card.tabId}
              card={card}
              onSelectTab={onSelectTab}
            />
          ))}
        </div>
      </section>

      {/* PART 3: TEAM PERCEPCJA360 & OPEN DATA APP COMPETITION BANNER */}
      <section className="relative overflow-hidden rounded-3xl p-7 sm:p-10 bg-linear-to-r from-blue-700 via-blue-600 to-sky-600 text-white border border-sky-300/40 shadow-[0_24px_65px_rgba(37,99,235,0.28)] space-y-6">
        {/* Ambient decorative light glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] font-extrabold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-sky-200" />
              {teamCopy.badge}
            </div>

            {/* Structured Author Cards so names & universities look balanced and crisp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="px-4 py-3 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    {teamCopy.author1Name}
                  </div>
                  <div className="text-xs font-semibold text-sky-100/90">
                    {teamCopy.author1Univ}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    {teamCopy.author2Name}
                  </div>
                  <div className="text-xs font-semibold text-sky-100/90">
                    {teamCopy.author2Univ}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-50/95 font-medium leading-relaxed">
              {teamCopy.subtitle}
            </p>
          </div>

          {/* Right-side Key Metrics Pills */}
          <div className="flex flex-wrap xl:flex-col items-stretch gap-2.5 shrink-0 w-full xl:w-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2.5 text-xs font-extrabold text-white">
              <Users className="w-4 h-4 text-sky-200 shrink-0" />
              <span className="whitespace-nowrap">{teamCopy.surveyPill}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2.5 text-xs font-extrabold text-white">
              <Database className="w-4 h-4 text-emerald-200 shrink-0" />
              <span className="whitespace-nowrap">{teamCopy.datasetsPill}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2.5 text-xs font-extrabold text-white">
              <Compass className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="whitespace-nowrap">{teamCopy.districtsPill}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
