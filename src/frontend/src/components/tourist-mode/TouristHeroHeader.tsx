import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Leaf,
  Train,
  ArrowDownRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Coins,
  Landmark,
  Globe2,
  Crown,
  CalendarDays,
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import {
  getTourismI18n,
  formatAnnualVisitors,
  formatStayDuration,
  formatEconomicImpact,
  formatCuratedSites,
  formatForeignVisitorsTotal,
} from '../../i18n/modules';
import type { CityTourismSummaryDto } from '../../types/contracts';
import { TouristCapabilitiesGrid } from './TouristCapabilitiesGrid';

export interface TouristHeroHeaderProps {
  summary?: CityTourismSummaryDto | null;
}

export const TouristHeroHeader: React.FC<TouristHeroHeaderProps> = ({ summary }) => {
  const { language } = useTranslation();
  const t = getTourismI18n(language);

  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const topMarkets = summary?.topInternationalMarkets ?? [];
  const maxShare = topMarkets.length > 0 ? Math.max(...topMarkets.map((m) => m.sharePct)) : 100;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Banner – Unified Kraków Blue & Royal Indigo palette matching Official/Investor Mode */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-2xl shadow-blue-950/15 border border-blue-400/30">
        {/* Animated Background Vector Shapes & Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

          {/* Continuous & Interlocking Kraków Historic Skyline with rich architectural detailing */}
          <svg
            className="absolute right-0 top-4 sm:top-6 lg:top-8 h-[82%] lg:h-[86%] w-full lg:w-7/12 opacity-35 pointer-events-none select-none"
            viewBox="0 0 700 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="touristGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="goldDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Ground Baseline & Vistula River Bank */}
            <line x1="50" y1="340" x2="685" y2="340" stroke="#bae6fd" strokeWidth="1.8" strokeOpacity="0.6" />
            <path d="M 60 352 C 180 348, 320 358, 480 350 S 620 354, 685 350" stroke="#7dd3fc" strokeWidth="1.2" strokeOpacity="0.4" />
            <path d="M 120 364 C 240 360, 400 370, 560 362 S 650 366, 685 364" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.25" />

            {/* Seamless, fully connected Kraków architectural silhouette background plate */}
            <path
              d="M 80 340 Q 157 265, 235 340 L 235 260 L 245 250 L 255 250 L 260 260 L 275 260 L 285 250 L 295 250 L 300 260 L 315 260 L 325 250 L 335 250 L 340 260 L 355 260 L 355 240 L 365 240 L 365 120 L 385 35 L 405 120 L 405 160 Q 425 125, 445 160 L 445 220 L 465 195 L 485 220 L 485 255 L 505 255 C 505 200, 565 200, 565 255 L 575 255 L 575 150 Q 595 110, 615 150 L 615 255 L 630 255 L 630 215 L 647 185 L 665 215 L 665 340 Z"
              stroke="#bae6fd"
              strokeWidth="1.8"
              fill="#ffffff"
              fillOpacity="0.05"
            />

            {/* 1. Kopiec Krakusa (Mound with detailed walking trail & observation point) */}
            <g id="tourist-kopiec">
              <path
                d="M 95 340 Q 157 285, 220 340"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                strokeOpacity="0.6"
              />
              <path
                d="M 115 340 Q 157 305, 200 340"
                stroke="#bae6fd"
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeOpacity="0.4"
              />
              {/* Summit Viewpoint Platform & Directional Rose */}
              <line x1="157" y1="262" x2="157" y2="276" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="157" cy="262" r="3.5" fill="#fde047" stroke="#ffffff" strokeWidth="1" />
              <line x1="152" y1="262" x2="162" y2="262" stroke="#fde047" strokeWidth="1" />
              {/* Contour Ticks */}
              <line x1="130" y1="315" x2="135" y2="318" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="184" y1="315" x2="179" y2="318" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.5" />
            </g>

            {/* 2. Sukiennice (Cloth Hall Renaissance Attic & Arcades) */}
            <g id="tourist-sukiennice">
              {/* Polish Renaissance Attic Gargoyles & Cresting */}
              <line x1="235" y1="260" x2="355" y2="260" stroke="#bae6fd" strokeWidth="1.5" />
              <line x1="235" y1="272" x2="355" y2="272" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" />
              {/* Attic Mascarons / Pinnacle Studs */}
              <circle cx="240" cy="254" r="1.8" fill="#bae6fd" />
              <circle cx="260" cy="254" r="1.8" fill="#bae6fd" />
              <circle cx="280" cy="254" r="1.8" fill="#bae6fd" />
              <circle cx="300" cy="254" r="1.8" fill="#bae6fd" />
              <circle cx="320" cy="254" r="1.8" fill="#bae6fd" />
              <circle cx="340" cy="254" r="1.8" fill="#bae6fd" />

              {/* Upper Floor Museum Windows with Pediments */}
              <rect x="247" y="278" width="10" height="15" rx="1.5" stroke="#ffffff" strokeWidth="1" fill="#ffffff" fillOpacity="0.1" />
              <rect x="272" y="278" width="10" height="15" rx="1.5" stroke="#ffffff" strokeWidth="1" fill="#ffffff" fillOpacity="0.1" />
              <rect x="297" y="278" width="10" height="15" rx="1.5" stroke="#ffffff" strokeWidth="1" fill="#ffffff" fillOpacity="0.1" />
              <rect x="322" y="278" width="10" height="15" rx="1.5" stroke="#ffffff" strokeWidth="1" fill="#ffffff" fillOpacity="0.1" />

              {/* Cornice Divider */}
              <line x1="235" y1="302" x2="355" y2="302" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />

              {/* Ground Floor Arcades with double concentric arches */}
              <path d="M 243 340 L 243 322 Q 254 308, 265 322 L 265 340" stroke="#bae6fd" strokeWidth="1.4" fill="#ffffff" fillOpacity="0.04" />
              <path d="M 246 340 L 246 324 Q 254 314, 262 324 L 262 340" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />

              <path d="M 268 340 L 268 322 Q 279 308, 290 322 L 290 340" stroke="#bae6fd" strokeWidth="1.4" fill="#ffffff" fillOpacity="0.04" />
              <path d="M 271 340 L 271 324 Q 279 314, 287 324 L 287 340" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />

              <path d="M 293 340 L 293 322 Q 304 308, 315 322 L 315 340" stroke="#bae6fd" strokeWidth="1.4" fill="#ffffff" fillOpacity="0.04" />
              <path d="M 296 340 L 296 324 Q 304 314, 312 324 L 312 340" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />

              <path d="M 318 340 L 318 322 Q 329 308, 340 322 L 340 340" stroke="#bae6fd" strokeWidth="1.4" fill="#ffffff" fillOpacity="0.04" />
              <path d="M 321 340 L 321 324 Q 329 314, 337 324 L 337 340" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />

              {/* Central Grand Archway */}
              <path d="M 342 340 L 342 316 Q 348 306, 355 316" stroke="#fbbf24" strokeWidth="1.2" />
            </g>

            {/* 3. Bazylika Mariacka (St. Mary's Basilica & Hejnalica Gothic Tower) */}
            <g id="tourist-mariacki">
              {/* Higher Gothic Tower */}
              <line x1="405" y1="120" x2="405" y2="340" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />

              {/* Gold Crown around Hejnalica Main Spire */}
              <path d="M 377 65 L 381 58 L 385 63 L 389 58 L 393 65 Z" fill="#fbbf24" stroke="#fde047" strokeWidth="1" />

              {/* 4 Corner Gothic Spirelets on Hejnalica */}
              <line x1="367" y1="120" x2="367" y2="88" stroke="#bae6fd" strokeWidth="1.2" />
              <polygon points="365,88 369,88 367,74" fill="#ffffff" fillOpacity="0.4" stroke="#bae6fd" strokeWidth="1" />
              <line x1="403" y1="120" x2="403" y2="88" stroke="#bae6fd" strokeWidth="1.2" />
              <polygon points="401,88 405,88 403,74" fill="#ffffff" fillOpacity="0.4" stroke="#bae6fd" strokeWidth="1" />

              {/* Hejnał Trumpeter Chamber & Acoustic Soundwave Rays */}
              <rect x="378" y="102" width="14" height="14" rx="2" stroke="#fde047" strokeWidth="1.4" fill="#fde047" fillOpacity="0.25" />
              <circle cx="385" cy="109" r="2.5" fill="#fde047" />
              {/* Soundwaves radiating from Hejnalica */}
              <path d="M 370 102 C 362 105, 362 113, 370 116" stroke="#fde047" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
              <path d="M 364 97 C 352 103, 352 117, 364 123" stroke="#fde047" strokeWidth="1" strokeDasharray="3 2" fill="none" />
              <path d="M 358 92 C 342 101, 342 121, 358 130" stroke="#fde047" strokeWidth="0.8" strokeDasharray="4 2" strokeOpacity="0.6" fill="none" />

              {/* Hejnalica Tower Cross & Pinnacle */}
              <line x1="385" y1="20" x2="385" y2="35" stroke="#ffffff" strokeWidth="1.8" />
              <line x1="380" y1="25" x2="390" y2="25" stroke="#ffffff" strokeWidth="1.8" />
              <circle cx="385" cy="20" r="1.5" fill="#fde047" />

              {/* Gothic Traceried Windows on Hejnalica */}
              <rect x="380" y="138" width="10" height="26" rx="4" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.1" />
              <line x1="385" y1="138" x2="385" y2="164" stroke="#bae6fd" strokeWidth="0.8" />
              <rect x="380" y="184" width="10" height="26" rx="4" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.1" />
              <line x1="385" y1="184" x2="385" y2="210" stroke="#bae6fd" strokeWidth="0.8" />

              {/* Lower Tower (Dzwonnica, 69m) Helmet & Belfry */}
              <path d="M 410 160 C 410 135, 440 135, 440 160" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.15" />
              <line x1="425" y1="124" x2="425" y2="135" stroke="#bae6fd" strokeWidth="1.5" />
              <circle cx="425" cy="122" r="2" fill="#bae6fd" />
              <rect x="419" y="174" width="12" height="22" rx="4" stroke="#bae6fd" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.08" />
              {/* Bell Silhouette */}
              <path d="M 422 186 Q 425 180, 428 186 L 429 191 L 421 191 Z" fill="#fbbf24" fillOpacity="0.7" />

              {/* Main Basilica Central Nave & Gothic Portal */}
              <line x1="365" y1="240" x2="445" y2="240" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.5" />
              {/* Stepped Gothic Portal */}
              <path d="M 374 340 L 374 302 Q 395 278, 416 302 L 416 340" stroke="#38bdf8" strokeWidth="1.6" fill="#ffffff" fillOpacity="0.04" />
              <path d="M 380 340 L 380 308 Q 395 288, 410 308 L 410 340" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.8" />
              {/* Gothic Rose Window (Rozeta Mariacka) */}
              <circle cx="395" cy="265" r="14" stroke="#bae6fd" strokeWidth="1.4" fill="#ffffff" fillOpacity="0.08" />
              <circle cx="395" cy="265" r="7" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="395" y1="251" x2="395" y2="279" stroke="#bae6fd" strokeWidth="0.8" />
              <line x1="381" y1="265" x2="409" y2="265" stroke="#bae6fd" strokeWidth="0.8" />
            </g>

            {/* 4. Wawel Royal Castle & Cathedral (Zamek Królewski, Kaplica Zygmuntowska, Kurza Stopka) */}
            <g id="tourist-wawel">
              {/* Kaplica Zygmuntowska (Gilded Renaissance Dome) */}
              <path
                d="M 505 255 C 505 198, 565 198, 565 255 Z"
                stroke="#fbbf24"
                strokeWidth="2"
                fill="url(#goldDomeGrad)"
              />
              {/* Fish scale roof tile texture on Sigismund Dome */}
              <path d="M 515 238 Q 525 230, 535 238 Q 545 230, 555 238" stroke="#fbbf24" strokeWidth="0.9" fill="none" strokeOpacity="0.7" />
              <path d="M 520 222 Q 535 214, 550 222" stroke="#fbbf24" strokeWidth="0.9" fill="none" strokeOpacity="0.7" />
              {/* Lantern drum and finial cross */}
              <rect x="530" y="188" width="10" height="14" rx="1" stroke="#fbbf24" strokeWidth="1.4" fill="#fde047" fillOpacity="0.6" />
              <line x1="535" y1="174" x2="535" y2="188" stroke="#fbbf24" strokeWidth="1.8" />
              <line x1="530" y1="178" x2="540" y2="178" stroke="#fbbf24" strokeWidth="1.8" />
              <circle cx="535" cy="173" r="1.5" fill="#ffffff" />

              {/* Cathedral Clock Tower */}
              <line x1="575" y1="255" x2="575" y2="340" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
              {/* Baroque Spire Helmet */}
              <path d="M 580 150 C 580 128, 610 128, 610 150 L 615 150 L 595 106 L 575 150 Z" stroke="#bae6fd" strokeWidth="1.4" fill="#38bdf8" fillOpacity="0.1" />
              <line x1="595" y1="94" x2="595" y2="106" stroke="#ffffff" strokeWidth="1.4" />
              <circle cx="595" cy="93" r="1.5" fill="#fde047" />
              {/* Cathedral Clock Face */}
              <circle cx="595" cy="180" r="8.5" stroke="#38bdf8" strokeWidth="1.4" fill="#ffffff" fillOpacity="0.15" />
              <circle cx="595" cy="180" r="3" fill="#fde047" />
              <line x1="595" y1="174" x2="595" y2="180" stroke="#ffffff" strokeWidth="1.2" />
              <line x1="595" y1="180" x2="599" y2="180" stroke="#ffffff" strokeWidth="1.2" />
              {/* Cathedral Belfry Window */}
              <rect x="589" y="206" width="12" height="22" rx="4" stroke="#bae6fd" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.08" />

              {/* Royal Castle Courtyard Arcades & Masonry */}
              <line x1="615" y1="255" x2="665" y2="255" stroke="#bae6fd" strokeWidth="1.2" />
              <line x1="485" y1="285" x2="665" y2="285" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="6 4" />
              <line x1="485" y1="312" x2="665" y2="312" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 4" />

              {/* Renaissance Arcaded Loggia Windows */}
              <path d="M 622 280 Q 628 270, 634 280" stroke="#bae6fd" strokeWidth="1.2" fill="none" />
              <path d="M 640 280 Q 646 270, 652 280" stroke="#bae6fd" strokeWidth="1.2" fill="none" />
              <path d="M 622 306 Q 628 296, 634 306" stroke="#bae6fd" strokeWidth="1.2" fill="none" />
              <path d="M 640 306 Q 646 296, 652 306" stroke="#bae6fd" strokeWidth="1.2" fill="none" />

              {/* Kurza Stopka / Gothicko-Renesansowa Wieża Zamkowa */}
              <polygon points="630,215 647,180 665,215" stroke="#bae6fd" strokeWidth="1.4" fill="#38bdf8" fillOpacity="0.1" />
              <line x1="647" y1="172" x2="647" y2="180" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="647" cy="171" r="1.5" fill="#fde047" />
              <rect x="642" y="222" width="10" height="14" rx="2" stroke="#ffffff" strokeWidth="1" fill="#ffffff" fillOpacity="0.12" />
            </g>

            {/* Tourist Route Nodes & Golden Sparkles */}
            <g id="tourist-route-markers">
              {/* Waypoint 1: Stare Miasto */}
              <circle cx="300" cy="215" r="4.5" fill="#fde047" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="300" cy="215" r="9" stroke="#fde047" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Waypoint 2: Wawel Hill */}
              <circle cx="535" cy="140" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />

              {/* Waypoint 3: Kazimierz & Wisła */}
              <circle cx="190" cy="245" r="3.5" fill="#ffffff" />
              <circle cx="190" cy="245" r="7.5" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Connecting Sightseeing Trail Line */}
              <path d="M 190 245 C 240 220, 270 230, 300 215 S 460 170, 535 140" stroke="#fde047" strokeWidth="1.2" strokeDasharray="3 3" fill="none" strokeOpacity="0.75" />

              {/* Ambient Krakow Sparkles */}
              <path d="M 220 180 Q 220 190, 230 190 Q 220 190, 220 200 Q 220 190, 210 190 Q 220 190, 220 180 Z" fill="#bae6fd" fillOpacity="0.8" />
              <path d="M 470 120 Q 470 130, 480 130 Q 470 130, 470 140 Q 470 130, 460 130 Q 470 130, 470 120 Z" fill="#fde047" fillOpacity="0.9" />
              <path d="M 645 145 Q 645 153, 653 153 Q 645 153, 645 161 Q 645 153, 637 153 Q 645 153, 645 145 Z" fill="#38bdf8" fillOpacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Foreground Content stretching full container width */}
        <div className="relative z-10 px-4 sm:px-10 pt-6 sm:pt-10 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Compass className="w-4 h-4 text-sky-300" />
              {t.badge}
            </div>
          </div>

          {/* Hero Content: Title, Description & Action Buttons */}
          <div className="space-y-4 max-w-3xl flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-white">
              {t.titleLead}
              <br />
              <span className="text-sky-200">{t.titleAccent}</span>
            </h1>

            <p className="text-xs sm:text-base text-blue-100/95 leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>

            {/* In-page Anchor Navigation CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1 w-full sm:w-auto">
              <button
                onClick={() => scrollToSection('trip-planner-section')}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.header.navPlanner}</span>
                </div>
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() => scrollToSection('overtourism-section')}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{t.header.navOvertourism}</span>
                </div>
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              </button>

              <button
                onClick={() => scrollToSection('district-passports-section')}
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>{t.header.navPassports}</span>
                </div>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>
            </div>
          </div>

          {/* 4 Bottom Floating Stat Cards (Full Width Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 pt-2">
            {/* Card 1: Annual Total Visitors */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-blue-900 leading-none">
                  {formatAnnualVisitors(summary?.annualVisitorsTotal ?? 0, language)}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  {t.telemetry.annualVisitorsLabel}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  {t.telemetry.annualVisitorsSub}
                </div>
              </div>
            </div>

            {/* Card 2: Average Length of Stay (Actionable City-Break Metric) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-indigo-700 leading-none">
                  {formatStayDuration(summary?.averageStayDays ?? 0, language)}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  {t.telemetry.stayDurationLabel}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  {t.telemetry.stayDurationSub}
                </div>
              </div>
            </div>

            {/* Card 3: Economic Footprint */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-emerald-700 leading-none">
                  {formatEconomicImpact(summary?.estimatedEconomicImpactPln ?? 0, language)}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  {t.telemetry.economicImpactLabel}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  {t.telemetry.economicImpactSub}
                </div>
              </div>
            </div>

            {/* Card 4: Audited Sites */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-black text-purple-700 leading-none">
                  {formatCuratedSites(summary?.totalCuratedAttractions ?? 0, language)}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  {t.telemetry.curatedSitesLabel}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  {t.telemetry.curatedSitesSub}
                </div>
              </div>
            </div>
          </div>

          {/* Centered "How does it work?" Accordion Toggle Button */}
          <div className="flex justify-center pt-1 pb-1">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-sky-300" />
              <span>{t.howItWorksButton}</span>
              {showHowItWorks ? (
                <ChevronUp className="w-4 h-4 text-sky-200 ml-0.5" />
              ) : (
                <ChevronDown className="w-4 h-4 text-sky-200 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Expandable "How does it work?" Drawer */}
      <div className={`drawer-expandable ${showHowItWorks ? 'is-open' : ''}`}>
        <div className="overflow-hidden">
          <TouristCapabilitiesGrid />
        </div>
      </div>

      {/* Visual International Markets Ranking Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-900/5 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.markets.title}
              </h3>
              <p className="text-sm font-black text-slate-900">
                {t.markets.subtitle}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 self-center sm:self-auto bg-slate-50 px-3 py-1 rounded-full border border-slate-200/80">
            {formatForeignVisitorsTotal(summary?.internationalVisitors ?? 0, language)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          {topMarkets.map((market, idx) => {
            const pctBar = (market.sharePct / maxShare) * 100;
            const isLeader = idx === 0;

            return (
              <div
                key={t.markets.countries[market.country] ?? market.country}
                className={`relative p-3.5 rounded-2xl border transition-all ${
                  isLeader
                    ? 'bg-linear-to-br from-blue-50/70 via-sky-50/30 to-white border-blue-300 shadow-xs ring-1 ring-blue-400/20'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base select-none">{market.flag}</span>
                    <span className="text-xs font-black text-slate-800 truncate">
                      {t.markets.countries[market.country] ?? market.country}
                    </span>
                    {isLeader && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                        <Crown className="w-2.5 h-2.5 text-amber-300" />
                        {t.markets.leaderBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-blue-700 shrink-0">
                    {market.sharePct}%
                  </span>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isLeader
                        ? 'bg-linear-to-r from-blue-600 to-sky-400'
                        : 'bg-linear-to-r from-blue-500 to-blue-400'
                    }`}
                    style={{ width: `${pctBar}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
