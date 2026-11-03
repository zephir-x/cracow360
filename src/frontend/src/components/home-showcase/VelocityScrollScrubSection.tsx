import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FastForward,
  Film,
  Sparkles,
} from 'lucide-react';
import type { AppTabId } from '../layout/MainNavbar';
import type { HomeShowcaseTranslations } from '../../i18n/modules';
import { HeroDualVisionMask } from './HeroDualVisionMask';

export interface VelocityScrollScrubSectionProps {
  heroCopy: HomeShowcaseTranslations['hero'];
  copy: HomeShowcaseTranslations['scrubSection'];
  onSelectTab: (tab: AppTabId) => void;
  onSkipToFinale: () => void;
}

const TOTAL_FRAMES = 150;
// Fraction of the unified scroll track dedicated to dissolving Act I (Hero + X-Ray lens)
// directly in-place over Act II (so there is zero vertical seam or duplicate static frame)
const HERO_DISSOLVE_SHARE = 0.075;
// Maximum progress change per 16.6ms animation frame for smooth velocity-clamped playback
const MAX_DELTA_PER_FRAME = 0.0055;

function getFrameUrl(index1Based: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index1Based));
  const padded = String(clamped).padStart(4, '0');
  return `/showcase/frames/frame_${padded}.webp`;
}

/**
 * Unified Act I & Act II Sticky Stage:
 * - Shares a single 100vh sticky viewport inside a 1120vh scroll track (~1000vh for flight = 1% per wheel notch).
 * - First 7.5% of scroll dissolves Act I (HeroDualVisionMask) directly in-place to reveal the live Act II Canvas & HUD underneath.
 * - Remaining 92.5% of scroll drives the Velocity-Clamped 150-frame WebP drone flight and 6 3D Story Chapters.
 */
export function VelocityScrollScrubSection({
  heroCopy,
  copy,
  onSelectTab,
  onSkipToFinale,
}: VelocityScrollScrubSectionProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesCacheRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  );
  const lastRenderedFrameRef = useRef<number>(-1);

  // 0.0 at top -> 1.0 when Act I has completely dissolved in-place into Act II
  const [heroDissolve, setHeroDissolve] = useState<number>(0);
  // Smooth velocity-clamped flight progress (0.0 -> 1.0)
  const [displayProgress, setDisplayProgress] = useState<number>(0);

  // Helper to draw an image onto the canvas with object-fit: cover semantics
  const drawFrameToCanvas = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find exact frame or nearest loaded neighbor so canvas never flashes blank
    let img = framesCacheRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frameIndex - offset;
        const next = frameIndex + offset;
        if (
          prev >= 1 &&
          framesCacheRef.current[prev]?.complete &&
          framesCacheRef.current[prev]!.naturalWidth > 0
        ) {
          img = framesCacheRef.current[prev];
          break;
        }
        if (
          next <= TOTAL_FRAMES &&
          framesCacheRef.current[next]?.complete &&
          framesCacheRef.current[next]!.naturalWidth > 0
        ) {
          img = framesCacheRef.current[next];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * 0.5;
    const dy = (ch - dh) * 0.5;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // 1. Two-phase progressive frame preloader (keyframes first, then full 150 WebP sequence)
  useEffect(() => {
    let cancelled = false;

    const loadSingleFrame = (idx: number): Promise<void> => {
      return new Promise((resolve) => {
        if (framesCacheRef.current[idx]?.complete) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = 'async';
        img.src = getFrameUrl(idx);
        img.onload = () => {
          if (!cancelled) {
            framesCacheRef.current[idx] = img;
            if (idx === 1 && lastRenderedFrameRef.current <= 1) {
              lastRenderedFrameRef.current = 1;
              drawFrameToCanvas(1);
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    const preloadAll = async () => {
      // Phase 1: Every 6th keyframe so scrubbing across the entire timeline works immediately
      const keyframes: number[] = [1];
      for (let i = 6; i <= TOTAL_FRAMES; i += 6) {
        keyframes.push(i);
      }
      if (!keyframes.includes(TOTAL_FRAMES)) keyframes.push(TOTAL_FRAMES);

      await Promise.all(keyframes.map((idx) => loadSingleFrame(idx)));
      if (cancelled) return;

      // Phase 2: Fill in all intermediate frames in small concurrent batches
      const remaining: number[] = [];
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!framesCacheRef.current[i]) remaining.push(i);
      }

      const batchSize = 12;
      for (let i = 0; i < remaining.length; i += batchSize) {
        if (cancelled) return;
        const batch = remaining.slice(i, i + batchSize);
        await Promise.all(batch.map((idx) => loadSingleFrame(idx)));
      }
    };

    void preloadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Keep Canvas resolution matched to viewport (capped at 1920px width for 60 FPS GPU efficiency)
  useEffect(() => {
    const syncCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const targetW = Math.min(1920, Math.round(window.innerWidth * dpr));
      const targetH = Math.min(1080, Math.round(window.innerHeight * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        const frameIdx = Math.max(
          1,
          Math.min(TOTAL_FRAMES, Math.round(lastRenderedFrameRef.current))
        );
        drawFrameToCanvas(frameIdx);
      }
    };

    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize, { passive: true });
    return () => window.removeEventListener('resize', syncCanvasSize);
  }, []);

  // 3. Unified Act I Dissolve + Act II Velocity-Clamped Scroll-Scrubbing Loop
  useEffect(() => {
    let rafId = 0;
    let targetFlightProgress = 0;
    let currentFlightProgress = 0;
    let lastHeroDissolve = -1;
    let lastReactStateUpdate = 0;

    const tick = (now: number) => {
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
        const scrolled = Math.max(0, -rect.top);
        const totalRatio = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        // First 7.5% of scroll dissolves Act I directly in-place over Act II
        const nextHeroDissolve = Math.max(
          0,
          Math.min(1, totalRatio / HERO_DISSOLVE_SHARE)
        );
        if (Math.abs(nextHeroDissolve - lastHeroDissolve) > 0.002) {
          lastHeroDissolve = nextHeroDissolve;
          setHeroDissolve(nextHeroDissolve);
        }

        // Remaining 92.5% of scroll drives the drone flight (0.0 -> 1.0)
        if (totalRatio <= HERO_DISSOLVE_SHARE) {
          targetFlightProgress = 0;
        } else {
          targetFlightProgress = Math.max(
            0,
            Math.min(1, (totalRatio - HERO_DISSOLVE_SHARE) / (1 - HERO_DISSOLVE_SHARE))
          );
        }
      }

      const diff = targetFlightProgress - currentFlightProgress;
      const absDiff = Math.abs(diff);

      if (absDiff > 0.00015) {
        // Proportional spring step clamped to MAX_DELTA_PER_FRAME
        const rawStep = diff * 0.11;
        const clampedStep = Math.max(
          -MAX_DELTA_PER_FRAME,
          Math.min(MAX_DELTA_PER_FRAME, rawStep)
        );
        currentFlightProgress += clampedStep;
        currentFlightProgress = Math.max(0, Math.min(1, currentFlightProgress));

        const frameIdx = Math.max(
          1,
          Math.min(TOTAL_FRAMES, Math.round(1 + currentFlightProgress * (TOTAL_FRAMES - 1)))
        );

        if (frameIdx !== lastRenderedFrameRef.current) {
          lastRenderedFrameRef.current = frameIdx;
          drawFrameToCanvas(frameIdx);
        }

        if (now - lastReactStateUpdate > 20) {
          lastReactStateUpdate = now;
          setDisplayProgress(currentFlightProgress);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Smoothly scroll to a specific flight progress (0.0 -> 1.0)
  const scrollToFlightProgress = (flightTarget: number) => {
    const track = trackRef.current;
    if (!track) return;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
    const totalRatio =
      HERO_DISSOLVE_SHARE + flightTarget * (1 - HERO_DISSOLVE_SHARE);
    window.scrollTo({
      top: trackTop + totalRatio * scrollableDistance,
      behavior: 'smooth',
    });
  };

  const currentFrameNumber = Math.max(
    1,
    Math.min(TOTAL_FRAMES, Math.round(1 + displayProgress * (TOTAL_FRAMES - 1)))
  );

  // Strictly single active chapter at any given displayProgress (prevents any multi-card flex jump)
  const activeChapter =
    copy.chapters.find(
      (ch) =>
        displayProgress >= ch.scrollRange[0] &&
        displayProgress <= ch.scrollRange[1]
    ) ?? null;

  // Circular Iris Portal expansion at the end of the drone flight (91% -> 100%)
  const portalProgress = Math.max(0, Math.min(1, (displayProgress - 0.91) / 0.09));
  const portalRadiusVw = portalProgress * 135;

  return (
    <section
      ref={trackRef}
      className="relative w-full h-[1120vh] bg-slate-950 select-none"
      aria-label="Kraków360 Hero & Controlled Drone Scroll-Scrubbing"
    >
      {/* Unified Pinned 100vh Viewport for both Act I and Act II */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-slate-950">
        {/* ACT I OVERLAY (Z-30): Dissolves directly in-place over Act II */}
        <HeroDualVisionMask
          copy={heroCopy}
          dissolveProgress={heroDissolve}
          onStartFlight={() => scrollToFlightProgress(0.03)}
          onJumpToResidentMap={() => onSelectTab('resident')}
        />

        {/* ACT II CANVAS & HUD (Z-10..20): Immediately ready underneath Act I */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Subtle atmospheric edge gradients for readability of floating story cards */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/65 via-transparent to-slate-950/80" />
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-slate-950/15 to-slate-950/65" />

        {/* TOP FLIGHT TELEMETRY HUD (Positioned with pt-20 sm:pt-22 below MainNavbar) */}
        <div className="relative z-20 max-w-360 mx-auto px-4 sm:px-8 pt-20 sm:pt-22 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-xl border border-white/15 text-xs font-bold text-sky-300 shadow-lg">
            <Film className="w-3.5 h-3.5 text-sky-400" />
            <span>{copy.hudZoneBadge}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Frame Counter */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-xl border border-white/15 text-[11px] font-mono text-white">
              <span className="text-slate-400">{copy.hudFrameLabel}:</span>
              <span className="font-bold text-sky-300">
                {String(currentFrameNumber).padStart(3, '0')} / {TOTAL_FRAMES}
              </span>
            </div>

            {/* Skip to Finale Button */}
            <button
              type="button"
              onClick={onSkipToFinale}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{copy.skipToFinaleLabel}</span>
              <FastForward className="w-3.5 h-3.5 text-sky-300" />
            </button>
          </div>
        </div>

        {/* CHOREOGRAPHED 3D NARRATIVE STORY CARD (SINGLE ACTIVE CARD STAGE) */}
        <div className="relative z-20 max-w-360 mx-auto px-4 sm:px-8 h-[calc(100vh-190px)] flex items-center pointer-events-none">
          {activeChapter && (() => {
            const [start, end] = activeChapter.scrollRange;
            const span = Math.max(0.01, end - start);
            const localProgress = Math.max(
              0,
              Math.min(1, (displayProgress - start) / span)
            );

            // Smooth bell-curve opacity: 0.0 at localProgress=0, 1.0 in [0.18..0.82], 0.0 at localProgress=1
            let opacity = 1;
            if (localProgress < 0.18) {
              opacity = localProgress / 0.18;
            } else if (localProgress > 0.82) {
              opacity = (1 - localProgress) / 0.18;
            }
            opacity = Math.max(0, Math.min(1, opacity));

            // 3D perspective glide
            const centeredOffset = (localProgress - 0.5) * 2; // -1 at entry -> 0 at center -> +1 at exit
            const translateY = centeredOffset * -48;
            const rotateX = centeredOffset * 7;
            const rotateY =
              activeChapter.align === 'left'
                ? centeredOffset * -5
                : centeredOffset * 5;
            const scale = 1 - Math.min(0.06, Math.abs(centeredOffset) * 0.05);

            return (
              <div
                key={activeChapter.id}
                className={`w-full flex ${
                  activeChapter.align === 'right' ? 'justify-end' : 'justify-start'
                }`}
              >
                <article
                  className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-950/78 backdrop-blur-2xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.65)] text-white pointer-events-auto"
                  style={{
                    opacity,
                    transform: `perspective(1100px) translate3d(0, ${translateY.toFixed(1)}px, 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Chapter Number & Pillar Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[11px] font-extrabold tracking-wider uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      {activeChapter.badge}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-slate-400">
                      {activeChapter.chapterNumber}
                    </span>
                  </div>

                  {/* Chapter Title */}
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight mb-3">
                    {activeChapter.title}
                  </h3>

                  {/* Highlight Stat Callout Box */}
                  <div className="p-3.5 rounded-2xl bg-linear-to-r from-blue-600/25 via-sky-500/15 to-transparent border border-sky-400/30 flex items-center gap-3.5 mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-sky-300 shrink-0 font-mono">
                      {activeChapter.highlightStat}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                      {activeChapter.highlightLabel}
                    </span>
                  </div>

                  {/* Narrative Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {activeChapter.description}
                  </p>

                  {/* Key Feature Bullets */}
                  <ul className="space-y-2 mb-5">
                    {activeChapter.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Direct Action Button to open the mode */}
                  {activeChapter.targetTab && activeChapter.ctaLabel && (
                    <button
                      type="button"
                      onClick={() => onSelectTab(activeChapter.targetTab!)}
                      className="group px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      <span>{activeChapter.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </article>
              </div>
            );
          })()}
        </div>

        {/* BOTTOM CHAPTER TIMELINE & PROGRESS SCRUBBER */}
        <div className="absolute bottom-6 inset-x-0 z-20 max-w-360 mx-auto px-4 sm:px-8">
          <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-[11px] font-mono text-slate-300 shrink-0">
              <span>{copy.hudProgressLabel}</span>
              <span className="font-extrabold text-sky-300">
                {Math.round(displayProgress * 100)}%
              </span>
            </div>

            {/* Interactive Timeline Bar with 6 Chapter Checkpoints */}
            <div className="relative flex-1 w-full h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 via-sky-400 to-emerald-400"
                style={{ width: `${(displayProgress * 100).toFixed(1)}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {copy.chapters.map((ch, idx) => {
                const [s, e] = ch.scrollRange;
                const isActive = displayProgress >= s && displayProgress <= e;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToFlightProgress((s + e) * 0.5)}
                    title={ch.title}
                    className={`w-7 h-6 rounded-lg font-mono text-[10px] font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* IRIS PORTAL EXPANSION AT 91%->100% (FROM CENTERED KRAKÓW 360° EMBLEM) */}
        {portalProgress > 0.01 && (
          <div className="pointer-events-none absolute inset-0 z-25 flex items-center justify-center overflow-hidden">
            <div
              className="rounded-full border-4 border-sky-300/70 shadow-[0_0_120px_rgba(56,189,248,0.85)]"
              style={{
                width: `${portalRadiusVw.toFixed(1)}vw`,
                height: `${portalRadiusVw.toFixed(1)}vw`,
                background:
                  'radial-gradient(circle, rgba(248,250,252,1) 0%, rgba(224,242,254,0.96) 55%, rgba(56,189,248,0) 100%)',
                opacity: Math.min(1, portalProgress * 1.15),
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
