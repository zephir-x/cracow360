import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  Compass,
  Layers,
  Radar,
  ScanEye,
} from 'lucide-react';
import type { HomeShowcaseTranslations } from '../../i18n/modules';

export interface HeroDualVisionMaskProps {
  copy: HomeShowcaseTranslations['hero'];
  /**
   * 0.0 at the top of the page -> 1.0 when Act I has completely dissolved in-place
   * to reveal the live Act II Scroll-Scrubbing module directly underneath.
   */
  dissolveProgress: number;
  onStartFlight: () => void;
  onJumpToResidentMap: () => void;
}

/**
 * Act I of the Cinematic Home Page (rendered as the top layer inside the shared sticky 100vh stage):
 * 1. Brief initial scroll freeze (~1.25s) while the Wawel panorama scales & unblurs,
 *    followed by a staggered reveal of the Kraków360 title and narrative.
 * 2. Interactive Dual-Vision Cursor Mask ("Smart City X-Ray"): moving the cursor creates
 *    an organic liquid spotlight blob (via CSS mask-image + 60 FPS spring interpolation)
 *    that reveals a monochrome + glowing cyan GIS wireframe & data telemetry layer underneath.
 * 3. In-place dissolve: as dissolveProgress goes from 0 -> 1, Act I smoothly fades out
 *    directly over the live Act II Canvas & HUD with zero vertical seam or duplicate frame.
 */
export function HeroDualVisionMask({
  copy,
  dissolveProgress,
  onStartFlight,
  onJumpToResidentMap,
}: HeroDualVisionMaskProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const xrayLayerRef = useRef<HTMLDivElement | null>(null);
  const lensReticleRef = useRef<HTMLDivElement | null>(null);
  const coordsLabelRef = useRef<HTMLSpanElement | null>(null);

  const [introComplete, setIntroComplete] = useState(false);

  // 1. Brief initial scroll lock (~1.25s) for choreographed entrance
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (window.scrollY < 40) {
      document.body.style.overflow = 'hidden';
    }

    const timer = window.setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      setIntroComplete(true);
    }, 1250);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // 2. 60 FPS Organic Dual-Blob Cursor Mask ("Smart City X-Ray")
  useEffect(() => {
    let rafId = 0;
    let isPointerInside = false;
    let targetX = window.innerWidth * 0.62;
    let targetY = window.innerHeight * 0.48;
    let currentX = targetX;
    let currentY = targetY;
    let trailX = targetX;
    let trailY = targetY;
    const startTime = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        isPointerInside = true;
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      } else {
        isPointerInside = false;
      }
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
    };

    const animateMask = (now: number) => {
      const vp = viewportRef.current;
      if (vp) {
        const w = vp.clientWidth || window.innerWidth;
        const h = vp.clientHeight || window.innerHeight;

        // Gentle autonomous orbit when pointer is idle/outside so the X-Ray lens is always alive
        if (!isPointerInside) {
          const elapsed = (now - startTime) * 0.001;
          targetX = w * (0.52 + Math.cos(elapsed * 0.65) * 0.24);
          targetY = h * (0.52 + Math.sin(elapsed * 0.9) * 0.16);
        }

        // Primary lens spring + secondary trailing blob for organic liquid silhouette
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;
        trailX += (currentX - trailX) * 0.075;
        trailY += (currentY - trailY) * 0.075;

        const xrayEl = xrayLayerRef.current;
        if (xrayEl) {
          const maskValue = `radial-gradient(230px circle at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 52%, rgba(0,0,0,0) 100%), radial-gradient(175px circle at ${trailX.toFixed(1)}px ${trailY.toFixed(1)}px, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)`;
          xrayEl.style.webkitMaskImage = maskValue;
          xrayEl.style.maskImage = maskValue;
        }

        const reticleEl = lensReticleRef.current;
        if (reticleEl) {
          reticleEl.style.transform = `translate3d(${(currentX - 210).toFixed(1)}px, ${(currentY - 210).toFixed(1)}px, 0)`;
        }

        const coordsEl = coordsLabelRef.current;
        if (coordsEl) {
          const lat = (50.048 + (0.5 - currentY / Math.max(1, h)) * 0.06).toFixed(4);
          const lng = (19.936 + (currentX / Math.max(1, w) - 0.5) * 0.09).toFixed(4);
          coordsEl.textContent = `GIS ${lat}°N, ${lng}°E`;
        }
      }

      rafId = requestAnimationFrame(animateMask);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    rafId = requestAnimationFrame(animateMask);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Smooth in-place dissolve math:
  // As dissolveProgress moves 0.0 -> 1.0, the entire Act I layer fades out cleanly
  // to reveal the active Act II Canvas & HUD right underneath
  const layerOpacity = Math.max(0, 1 - dissolveProgress);
  const titleScale = 1 - dissolveProgress * 0.12;
  const titleOpacity = Math.max(0, 1 - dissolveProgress * 1.35);
  const titleBlur = dissolveProgress * 10;
  const isInteractive = dissolveProgress < 0.85;

  return (
    <div
      ref={viewportRef}
      style={{
        opacity: layerOpacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        visibility: layerOpacity <= 0.005 ? 'hidden' : 'visible',
        willChange: 'opacity',
      }}
      className="absolute inset-0 z-30 w-full h-full overflow-hidden bg-slate-950"
    >
      {/* LAYER 1 (BASE): Vibrant Color Wawel & Vistula Panorama */}
      <div
        className={`absolute inset-0 transition-all duration-1200 ease-out ${
          introComplete ? 'scale-100 blur-none opacity-100' : 'scale-108 blur-xs opacity-85'
        }`}
      >
        <img
          src="/showcase/rodzina.jpg"
          alt="Panorama Wawelu i Bulwarów Wiślanych Kraków360"
          className="w-full h-full object-cover object-center"
        />
        {/* Cinematic atmospheric vignette so typography pops */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/88 via-slate-950/55 to-slate-950/35" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/60" />
      </div>

      {/* LAYER 2 (CURSOR X-RAY MASK): Monochrome + Cyan GIS Analytical Blueprint */}
      <div
        ref={xrayLayerRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          WebkitMaskImage:
            'radial-gradient(220px circle at 62% 48%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(220px circle at 62% 48%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* High-contrast monochrome + night-vision blueprint under-image */}
        <img
          src="/showcase/rodzina.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center grayscale contrast-150 brightness-50"
        />
        <div className="absolute inset-0 bg-sky-950/55 mix-blend-color" />

        {/* Analytical SVG GIS Grid, Isochrones & Vector Nodes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-85"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="krakow-gis-grid"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 64 0 L 0 0 0 64"
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="rgba(125, 211, 252, 0.55)" />
            </pattern>
          </defs>

          {/* Full blueprint coordinate mesh */}
          <rect width="1600" height="900" fill="url(#krakow-gis-grid)" />

          {/* Simulated District Vector Boundaries & 15-Minute Isochrone Rings */}
          <g stroke="rgba(56, 189, 248, 0.75)" fill="none" strokeWidth="1.6">
            <polygon
              points="280,210 560,150 780,260 720,480 410,510"
              fill="rgba(14, 165, 233, 0.08)"
              strokeDasharray="6 4"
            />
            <polygon
              points="780,260 1140,180 1350,360 1190,610 720,480"
              fill="rgba(59, 130, 246, 0.10)"
            />
            <polygon
              points="410,510 720,480 980,710 520,790"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="rgba(52, 211, 153, 0.7)"
            />
            {/* Wawel & Vistula 500m / 1000m Isochrone Rings */}
            <circle
              cx="960"
              cy="390"
              r="130"
              stroke="rgba(56, 189, 248, 0.9)"
              strokeDasharray="8 6"
            />
            <circle
              cx="960"
              cy="390"
              r="240"
              stroke="rgba(125, 211, 252, 0.5)"
              strokeDasharray="4 8"
            />
            <circle
              cx="590"
              cy="340"
              r="105"
              stroke="rgba(52, 211, 153, 0.8)"
              strokeDasharray="6 5"
            />
          </g>

          {/* Glowing Data Nodes */}
          <g fill="#38bdf8">
            <circle cx="960" cy="390" r="6" />
            <circle cx="590" cy="340" r="5" fill="#34d399" />
            <circle cx="1140" cy="280" r="5" />
            <circle cx="720" cy="480" r="5" />
          </g>
        </svg>

        {/* Floating Telemetry Callouts only visible when revealed by the X-Ray mask */}
        <div className="hidden md:block absolute top-[24%] right-[14%] px-3.5 py-2 rounded-xl bg-slate-950/85 border border-sky-400/50 text-sky-300 font-mono text-[11px] shadow-lg">
          <div className="font-bold text-white">{copy.xrayPoints.gis}</div>
          <div className="text-[10px] text-sky-400/90">DZIELNICA I STARE MIASTO • WAWEL</div>
        </div>

        <div className="hidden md:block absolute bottom-[26%] right-[24%] px-3.5 py-2 rounded-xl bg-slate-950/85 border border-emerald-400/50 text-emerald-300 font-mono text-[11px] shadow-lg">
          <div className="font-bold text-white">{copy.xrayPoints.iso}</div>
          <div className="text-[10px] text-emerald-400/90">PROMIEŃ 500M / 1000M • BULWARY WIŚLANE</div>
        </div>

        <div className="hidden lg:block absolute top-[36%] left-[44%] px-3.5 py-2 rounded-xl bg-slate-950/85 border border-indigo-400/50 text-indigo-200 font-mono text-[11px] shadow-lg">
          <div className="font-bold text-white">{copy.xrayPoints.qol}</div>
          <div className="text-[10px] text-indigo-300/90">MIN-MAX WINSORIZED (P5–P95)</div>
        </div>
      </div>

      {/* SUBTLE X-RAY RETICLE RING FOLLOWING THE CURSOR */}
      <div
        ref={lensReticleRef}
        className="pointer-events-none absolute top-0 left-0 w-105 h-105 rounded-full border border-sky-400/35 shadow-[0_0_50px_rgba(56,189,248,0.18)] z-15 hidden sm:flex items-start justify-center pt-3"
        style={{ willChange: 'transform' }}
      >
        <div className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-sky-400/40 text-[10px] font-mono font-semibold text-sky-300 tracking-wider flex items-center gap-1.5">
          <Radar className="w-3 h-3 text-sky-400 animate-spin" />
          <span ref={coordsLabelRef}>GIS 50.0540°N, 19.9350°E</span>
        </div>
      </div>

      {/* CHOREOGRAPHED FOREGROUND TYPOGRAPHY & CTAs (DISSOLVES ON SCROLL) */}
      <div
        className="relative z-30 h-full max-w-360 mx-auto px-4 sm:px-8 flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12"
        style={{
          transform: `scale(${titleScale.toFixed(3)})`,
          opacity: titleOpacity,
          filter: titleBlur > 0.2 ? `blur(${titleBlur.toFixed(1)}px)` : 'none',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Top Bar: Competition & Team Percepcja360 Badges (Positioned safely below MainNavbar) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-400/35 text-sky-300 text-[11px] font-extrabold tracking-widest uppercase shadow-lg">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            {copy.competitionBadge}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[11px] font-bold tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            {copy.mottoBadge}
          </div>
        </div>

        {/* Center-Left Monumental Hero Typography (Staggered Entrance) */}
        <div className="max-w-2xl my-auto space-y-5">
          <div className="showcase-stagger-1 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold tracking-wide">
            <ScanEye className="w-4 h-4 text-sky-400" />
            {copy.maskHintBadge}
          </div>

          <div className="space-y-1">
            <p className="showcase-stagger-1 text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-sky-300/90">
              {copy.welcomeWord}
            </p>
            <h1 className="showcase-stagger-2 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              {copy.brandTitleLead}
              <span className="bg-linear-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {copy.brandTitleAccent}
              </span>
            </h1>
          </div>

          {/* Two-line aesthetic subtitle headline */}
          <h2 className="showcase-stagger-3 text-lg sm:text-2xl font-extrabold text-slate-100 leading-snug">
            <span className="block">{copy.subtitleHeadlineLine1}</span>
            <span className="block text-sky-300">{copy.subtitleHeadlineLine2}</span>
          </h2>

          <p className="showcase-stagger-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            {copy.subtitleBody}
          </p>

          {/* Interactive X-Ray Hint Box */}
          <div className="showcase-stagger-4 p-3.5 rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-sky-400/25 max-w-lg flex items-center gap-3 text-xs text-slate-200 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
              <ScanEye className="w-5 h-5 text-sky-300" />
            </div>
            <span>{copy.maskHintSub}</span>
          </div>

          {/* Action Buttons */}
          <div className="showcase-stagger-4 pt-2 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onStartFlight}
              className="group px-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-[0_12px_32px_rgba(37,99,235,0.45)] flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <span>{copy.ctaStartScroll}</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onJumpToResidentMap}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-sky-300" />
              <span>{copy.ctaJumpToMap}</span>
            </button>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="flex items-center justify-between gap-4 text-xs text-slate-300/90">
          <div className="inline-flex items-center gap-2.5 font-semibold">
            <span className="w-6 h-10 rounded-full border-2 border-sky-400/60 flex items-start justify-center p-1">
              <span className="w-1.5 h-2.5 rounded-full bg-sky-400 animate-bounce" />
            </span>
            <span>{copy.scrollDownPrompt}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-sky-300/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{copy.xrayHudTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
