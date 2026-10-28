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
import { getTourismI18n } from '../../i18n/modules';
import type { CityTourismSummaryDto } from '../../types/contracts';
import { TouristCapabilitiesGrid } from './TouristCapabilitiesGrid';

export interface TouristHeroHeaderProps {
  summary?: CityTourismSummaryDto | null;
}

export const TouristHeroHeader: React.FC<TouristHeroHeaderProps> = ({ summary }) => {
  const { language } = useTranslation();
  const t = getTourismI18n(language);

  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const topMarkets = summary?.topInternationalMarkets ?? [
    { country: 'Wielka Brytania', sharePct: 20.6, flag: '🇬🇧' },
    { country: 'Niemcy', sharePct: 9.1, flag: '🇩🇪' },
    { country: 'Włochy', sharePct: 7.6, flag: '🇮🇹' },
    { country: 'Stany Zjednoczone', sharePct: 6.7, flag: '🇺🇸' },
    { country: 'Francja', sharePct: 5.8, flag: '🇫🇷' },
    { country: 'Hiszpania', sharePct: 5.2, flag: '🇪🇸' },
  ];

  const maxShare = Math.max(...topMarkets.map((m) => m.sharePct), 20.6);

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

          {/* Continuous & Interlocking Kraków Historic Skyline (No Floating Shapes, Seamless Architectural Silhouette) */}
          <svg
            className="absolute right-0 top-6 sm:top-8 lg:top-10 h-[78%] lg:h-[82%] w-full lg:w-7/12 opacity-35 pointer-events-none select-none"
            viewBox="0 0 700 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Baseline */}
            <line x1="60" y1="340" x2="680" y2="340" stroke="#bae6fd" strokeWidth="2" strokeOpacity="0.6" />

            {/* Seamless, fully connected Kraków architectural silhouette (Single unbroken contour) */}
            <path
              d="M 80 340 Q 157 265, 235 340 L 235 260 L 245 250 L 255 250 L 260 260 L 275 260 L 285 250 L 295 250 L 300 260 L 315 260 L 325 250 L 335 250 L 340 260 L 355 260 L 355 240 L 365 240 L 365 120 L 385 35 L 405 120 L 405 160 Q 425 125, 445 160 L 445 220 L 465 195 L 485 220 L 485 255 L 505 255 C 505 200, 565 200, 565 255 L 575 255 L 575 150 Q 595 110, 615 150 L 615 255 L 630 255 L 630 215 L 647 185 L 665 215 L 665 340 Z"
              stroke="#bae6fd"
              strokeWidth="1.8"
              fill="#ffffff"
              fillOpacity="0.06"
            />

            {/* 1. Kopiec Krakusa Walking Trail */}
            <path
              d="M 100 340 Q 157 295, 215 340"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              strokeOpacity="0.6"
            />

            {/* 2. Sukiennice (Cloth Hall) Details */}
            {/* Ground Arcades */}
            <path d="M 245 340 Q 255 315, 265 340" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 270 340 Q 280 315, 290 340" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 295 340 Q 305 315, 315 340" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 320 340 Q 330 315, 340 340" stroke="#bae6fd" strokeWidth="1.2" />

            {/* 3. St. Mary's Basilica Details */}
            {/* Tower joint divider */}
            <line x1="405" y1="120" x2="405" y2="340" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
            {/* Basilica Portal */}
            <path d="M 380 340 L 380 305 Q 395 285, 410 305 L 410 340" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Hejnalica Gothic Tower Windows */}
            <rect x="381" y="145" width="8" height="24" rx="4" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.1" />
            <rect x="381" y="190" width="8" height="24" rx="4" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.1" />
            {/* Hejnalica Cross */}
            <line x1="385" y1="22" x2="385" y2="35" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="381" y1="27" x2="389" y2="27" stroke="#ffffff" strokeWidth="1.5" />
            {/* Bell Tower Windows & Finial */}
            <rect x="421" y="180" width="8" height="20" rx="4" stroke="#bae6fd" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.08" />
            <line x1="425" y1="115" x2="425" y2="128" stroke="#bae6fd" strokeWidth="1.2" />

            {/* 4. Wawel Royal Castle & Cathedral Details */}
            {/* Sigismund's Chapel Gilded Dome & Cross */}
            <path
              d="M 505 255 C 505 200, 565 200, 565 255 Z"
              stroke="#fbbf24"
              strokeWidth="2"
              fill="#f59e0b"
              fillOpacity="0.3"
            />
            <rect x="531" y="190" width="8" height="12" stroke="#fbbf24" strokeWidth="1.2" fill="#fbbf24" fillOpacity="0.5" />
            <line x1="535" y1="178" x2="535" y2="190" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="531" y1="182" x2="539" y2="182" stroke="#fbbf24" strokeWidth="1.5" />

            {/* Cathedral Clock Tower */}
            <line x1="575" y1="255" x2="575" y2="340" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.4" />
            <circle cx="595" cy="180" r="7" stroke="#38bdf8" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.1" />
            <line x1="595" y1="98" x2="595" y2="110" stroke="#ffffff" strokeWidth="1.2" />

            {/* Castle Windows Grid lines firmly bounded inside walls */}
            <line x1="485" y1="290" x2="665" y2="290" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 6" />
            <line x1="485" y1="315" x2="665" y2="315" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Foreground Content stretching full container width */}
        <div className="relative z-10 px-6 sm:px-10 pt-8 sm:pt-10 pb-8 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Compass className="w-4 h-4 text-sky-300" />
              {t.badge}
            </div>
          </div>

          {/* Hero Content: Title, Description & Action Buttons */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-white">
              {t.titleLead}
              <br />
              <span className="text-sky-200">{t.titleAccent}</span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>

            {/* In-page Anchor Navigation CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => scrollToSection('trip-planner-section')}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t.header.navPlanner}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </button>

              <button
                onClick={() => scrollToSection('overtourism-section')}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{t.header.navOvertourism}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              </button>

              <button
                onClick={() => scrollToSection('district-passports-section')}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md transition cursor-pointer"
              >
                <Train className="w-4 h-4 text-sky-200 shrink-0" />
                <span>{t.header.navPassports}</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              </button>
            </div>
          </div>

          {/* 4 Bottom Floating Stat Cards (Full Width Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {/* Card 1: Annual Total Visitors */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-blue-900 leading-none">
                  {t.telemetry.annualVisitors}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {t.telemetry.annualVisitorsLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {t.telemetry.annualVisitorsSub}
                </div>
              </div>
            </div>

            {/* Card 2: Average Length of Stay (Actionable City-Break Metric) */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-indigo-700 leading-none">
                  {t.telemetry.stayDuration}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {t.telemetry.stayDurationLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {t.telemetry.stayDurationSub}
                </div>
              </div>
            </div>

            {/* Card 3: Economic Footprint */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-emerald-700 leading-none">
                  {t.telemetry.economicImpact}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {t.telemetry.economicImpactLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {t.telemetry.economicImpactSub}
                </div>
              </div>
            </div>

            {/* Card 4: Audited Sites */}
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-purple-700 leading-none">
                  {t.telemetry.curatedSites}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                  {t.telemetry.curatedSitesLabel}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {t.telemetry.curatedSitesSub}
                </div>
              </div>
            </div>
          </div>

          {/* Centered "How does it work?" Accordion Toggle Button */}
          <div className="flex justify-center pt-1 pb-1">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md text-xs font-bold transition shadow-xs cursor-pointer"
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
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-900/5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
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
          <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
            {t.markets.totalForeign}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
