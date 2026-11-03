import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FastForward,
  Film,
  Pause,
  Play,
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

const TOTAL_FRAMES = 250;
// Fraction of the unified scroll track dedicated to dissolving Act I (Hero + X-Ray lens)
// directly in-place over Act II (so there is zero vertical seam or duplicate static frame)
const HERO_DISSOLVE_SHARE = 0.065;
// Maximum progress change per 16.6ms animation frame for smooth velocity-clamped playback
const MAX_DELTA_PER_FRAME = 0.008;
// Brisk full-flight duration in seconds when Autopilot is active (overridden if panorama-audio.mp3 is present)
const DEFAULT_AUTOPILOT_DURATION_SEC = 19;

function getFrameUrl(index1Based: number): string {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, index1Based));
  const padded = String(clamped).padStart(4, '0');
  return `/showcase/frames/frame_${padded}.webp`;
}

/**
 * Unified Act I & Act II Sticky Stage:
 * - Pinned directly beneath MainNavbar (top-14.5, h-[calc(100vh-3.625rem)]) inside a 1220vh scroll track.
 * - First 6.5% of scroll dissolves Act I (HeroDualVisionMask) directly in-place to reveal the live Act II Canvas & HUD underneath.
 * - Remaining 93.5% of scroll drives the Velocity-Clamped 250-frame WebP drone flight, 8 3D Story Chapters,
 *   Autopilot mode (using behavior: 'instant' per-frame scrolling so CSS smooth-scroll never blocks it),
 *   and a progressive Blur + Pure White Fade + Centered Logo Reveal on the final frames into Act III.
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

  // Optional ambient audio for Autopilot mode (/showcase/panorama-audio.mp3)
  const autopilotAudioRef = useRef<HTMLAudioElement | null>(null);
  const autopilotAudioReadyRef = useRef<boolean>(false);
  const isAutopilotRef = useRef<boolean>(false);
  const autopilotScrollYRef = useRef<number>(0);

  // 0.0 at top -> 1.0 when Act I has completely dissolved in-place into Act II
  const [heroDissolve, setHeroDissolve] = useState<number>(0);
  // Smooth velocity-clamped flight progress (0.0 -> 1.0)
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  // Interactive Autopilot state
  const [isAutopilot, setIsAutopilot] = useState<boolean>(false);

  const stopAutopilot = () => {
    if (isAutopilotRef.current) {
      isAutopilotRef.current = false;
      setIsAutopilot(false);
    }
    const audio = autopilotAudioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
  };

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

  // 0. Probe optional /showcase/panorama-audio.mp3 for Autopilot mode (silent fallback if not present yet)
  useEffect(() => {
    const audio = new Audio('/showcase/panorama-audio.mp3');
    audio.preload = 'metadata';
    audio.volume = 0.75;

    const handleCanPlay = () => {
      autopilotAudioReadyRef.current = true;
    };
    const handleError = () => {
      autopilotAudioReadyRef.current = false;
    };

    audio.addEventListener('loadedmetadata', handleCanPlay);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    autopilotAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleCanPlay);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      autopilotAudioRef.current = null;
    };
  }, []);

  // Cancel Autopilot immediately if the user manually scrolls via wheel, touch, or keyboard
  useEffect(() => {
    const handleUserScrollInterrupt = () => {
      if (isAutopilotRef.current) {
        stopAutopilot();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isAutopilotRef.current &&
        ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)
      ) {
        stopAutopilot();
      }
    };

    window.addEventListener('wheel', handleUserScrollInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserScrollInterrupt, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserScrollInterrupt);
      window.removeEventListener('touchmove', handleUserScrollInterrupt);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Two-phase progressive frame preloader (keyframes first, then full 250 WebP sequence)
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

      const batchSize = 14;
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

  // 2. Keep Canvas resolution matched to viewport (capped at 1920px width for GPU efficiency)
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

  // 3. Unified Act I Dissolve + Act II Velocity-Clamped Scroll-Scrubbing + Autopilot Loop
  useEffect(() => {
    let rafId = 0;
    let targetFlightProgress = 0;
    let currentFlightProgress = 0;
    let lastHeroDissolve = -1;
    let lastReactStateUpdate = 0;
    let lastTickTime = performance.now();

    const tick = (now: number) => {
      const dtSec = Math.min(0.06, Math.max(0.001, (now - lastTickTime) * 0.001));
      lastTickTime = now;

      const track = trackRef.current;
      if (track) {
        const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);

        // Advance window scroll automatically when Autopilot is active.
        if (isAutopilotRef.current) {
          const audio = autopilotAudioRef.current;
          const totalFlightSec =
            autopilotAudioReadyRef.current &&
            audio &&
            Number.isFinite(audio.duration) &&
            audio.duration > 5
              ? audio.duration
              : DEFAULT_AUTOPILOT_DURATION_SEC;

          const flightDistancePx = scrollableDistance * (1 - HERO_DISSOLVE_SHARE);
          const pxPerSecond = flightDistancePx / totalFlightSec;
          autopilotScrollYRef.current += pxPerSecond * dtSec;

          const trackTopAbs = track.getBoundingClientRect().top + window.scrollY;
          const maxScrollY = trackTopAbs + scrollableDistance;

          if (autopilotScrollYRef.current >= maxScrollY) {
            window.scrollTo({ top: maxScrollY, behavior: 'instant' });
            stopAutopilot();
          } else {
            window.scrollTo({ top: autopilotScrollYRef.current, behavior: 'instant' });
          }
        }

        const rect = track.getBoundingClientRect();
        const scrolled = Math.max(0, -rect.top);
        const totalRatio = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        // First 6.5% of scroll dissolves Act I directly in-place over Act II
        const nextHeroDissolve = Math.max(
          0,
          Math.min(1, totalRatio / HERO_DISSOLVE_SHARE)
        );
        if (Math.abs(nextHeroDissolve - lastHeroDissolve) > 0.002) {
          lastHeroDissolve = nextHeroDissolve;
          setHeroDissolve(nextHeroDissolve);
        }

        // Remaining 93.5% of scroll drives the drone flight (0.0 -> 1.0)
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

      if (absDiff > 0.0001) {
        // Proportional spring step clamped to MAX_DELTA_PER_FRAME
        const rawStep = diff * 0.16;
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
    stopAutopilot();
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

  // Toggle constant-speed Autopilot flight (+ optional synced audio track)
  const handleToggleAutopilot = () => {
    if (isAutopilotRef.current) {
      stopAutopilot();
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    const trackTopAbs = track.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
    const flightStartScrollY = trackTopAbs + HERO_DISSOLVE_SHARE * scrollableDistance;

    // If user is still in Act I or already at the very end (>96%), start Autopilot from the beginning of Act II
    let startScrollY = window.scrollY;
    if (startScrollY < flightStartScrollY || displayProgress > 0.96) {
      startScrollY = flightStartScrollY;
      window.scrollTo({ top: startScrollY, behavior: 'instant' });
    }

    autopilotScrollYRef.current = startScrollY;
    isAutopilotRef.current = true;
    setIsAutopilot(true);

    // Play optional /showcase/panorama-audio.mp3 if available
    const audio = autopilotAudioRef.current;
    if (audio && autopilotAudioReadyRef.current) {
      const currentRatio = Math.max(
        0,
        Math.min(
          1,
          (startScrollY - flightStartScrollY) /
            Math.max(1, scrollableDistance * (1 - HERO_DISSOLVE_SHARE))
        )
      );
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = currentRatio * audio.duration;
      }
      void audio.play().catch(() => {});
    }
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

  // Finale Blur + Pure White Dissolve + Centered Logo Reveal (88% -> 100% of flight)
  const finaleProgress = Math.max(0, Math.min(1, (displayProgress - 0.88) / 0.12));
  const canvasBlurPx = finaleProgress * 22;
  const canvasScale = 1 + finaleProgress * 0.05;
  // Reaches 100% pure #ffffff slightly before the end (at ~98%) so the logo sits on uniform pure white
  const whiteOverlayOpacity = Math.min(1, Math.pow(finaleProgress, 0.8) * 1.15);
  // Logo smoothly fades and unblurs in the final frames (finaleProgress 0.18 -> 0.85)
  const logoRevealProgress = Math.max(0, Math.min(1, (finaleProgress - 0.18) / 0.68));
  const hudFadeOpacity = Math.max(0, 1 - finaleProgress * 1.85);

  return (
    <section
      ref={trackRef}
      style={{
        backgroundColor: finaleProgress > 0.6 ? '#ffffff' : '#020617',
      }}
      className="relative w-full h-[1220vh] select-none"
      aria-label="Kraków360 Hero & Controlled Drone Scroll-Scrubbing"
    >
      {/* Unified Pinned Viewport sitting directly below MainNavbar (58px / 3.625rem) */}
      <div className="sticky top-14.5 w-full h-[calc(100vh-3.625rem)] overflow-hidden bg-slate-950">
        {/* ACT I OVERLAY (Z-30): Dissolves directly in-place over Act II */}
        <HeroDualVisionMask
          copy={heroCopy}
          dissolveProgress={heroDissolve}
          onStartFlight={() => scrollToFlightProgress(0.025)}
          onJumpToResidentMap={() => {
            stopAutopilot();
            onSelectTab('resident');
          }}
        />

        {/* ACT II CANVAS & HUD (Z-10..20): Immediately ready underneath Act I */}
        <canvas
          ref={canvasRef}
          style={{
            filter: canvasBlurPx > 0.15 ? `blur(${canvasBlurPx.toFixed(1)}px)` : 'none',
            transform: finaleProgress > 0.01 ? `scale(${canvasScale.toFixed(3)})` : 'none',
            willChange: 'transform, filter',
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Subtle atmospheric edge gradients for crisp readability of minimalist HUD & story cards */}
        <div
          style={{ opacity: hudFadeOpacity }}
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/70 via-transparent to-slate-950/85"
        />
        <div
          style={{ opacity: hudFadeOpacity }}
          className="pointer-events-none absolute inset-0 bg-radial from-transparent via-slate-950/15 to-slate-950/65"
        />

        {/* TOP FLIGHT TELEMETRY HUD (Minimalist transparent labels + Autopilot + Pill Skip Button) */}
        <div
          style={{
            opacity: hudFadeOpacity,
            pointerEvents: hudFadeOpacity < 0.15 ? 'none' : 'auto',
          }}
          className="relative z-20 max-w-360 mx-auto px-4 sm:px-8 pt-6 sm:pt-7 flex flex-wrap items-center justify-between gap-3"
        >
          {/* Left: Minimalist "Strefa przelotu" + Interactive "Autopilot" Trigger */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide text-sky-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              <Film className="w-4 h-4 text-sky-400" />
              <span>{copy.hudZoneBadge}</span>
            </div>

            <span className="text-white/30 font-light select-none">|</span>

            <button
              type="button"
              onClick={handleToggleAutopilot}
              className={`group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] ${
                isAutopilot
                  ? 'text-emerald-300 hover:text-emerald-200'
                  : 'text-white/90 hover:text-sky-300'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isAutopilot
                    ? 'bg-emerald-500/30 border border-emerald-400/70 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                    : 'bg-white/15 group-hover:bg-sky-500/30 border border-white/25 text-sky-300'
                }`}
              >
                {isAutopilot ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                )}
              </span>
              <span>
                {isAutopilot ? copy.autopilotActiveLabel : copy.autopilotIdleLabel}
              </span>
            </button>
          </div>

          {/* Right: Minimalist Frame Counter + Pill-Styled Skip Button */}
          <div className="flex items-center gap-4">
            {/* Minimalist Frame Counter (no background box) */}
            <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              <span className="text-slate-300">{copy.hudFrameLabel}:</span>
              <span className="font-extrabold text-sky-300">
                {String(currentFrameNumber).padStart(3, '0')} / {TOTAL_FRAMES}
              </span>
            </div>

            {/* Skip to Finale Button (keeps pill styling as requested) */}
            <button
              type="button"
              onClick={() => {
                stopAutopilot();
                onSkipToFinale();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/12 hover:bg-white/22 backdrop-blur-xl border border-white/25 text-[11px] font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              <span>{copy.skipToFinaleLabel}</span>
              <FastForward className="w-3.5 h-3.5 text-sky-300" />
            </button>
          </div>
        </div>

        {/* CHOREOGRAPHED 3D NARRATIVE STORY CARD (SINGLE ACTIVE CARD STAGE) */}
        <div className="relative z-20 max-w-360 mx-auto px-4 sm:px-8 h-[calc(100vh-180px)] flex items-center pointer-events-none">
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
            const translateY = centeredOffset * -44;
            const rotateX = centeredOffset * 6.5;
            const rotateY =
              activeChapter.align === 'left'
                ? centeredOffset * -4.5
                : centeredOffset * 4.5;
            const scale = 1 - Math.min(0.06, Math.abs(centeredOffset) * 0.05);

            return (
              <div
                key={activeChapter.id}
                className={`w-full flex ${
                  activeChapter.align === 'right' ? 'justify-end' : 'justify-start'
                }`}
              >
                <article
                  className="w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-slate-950/78 backdrop-blur-2xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.65)] text-white pointer-events-auto"
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
                  <div className="p-3.5 rounded-2xl bg-linear-to-r from-blue-600/25 via-sky-500/15 to-transparent border border-sky-400/30 flex items-center gap-3.5 mb-3.5">
                    <span className="text-2xl sm:text-3xl font-black text-sky-300 shrink-0 font-mono">
                      {activeChapter.highlightStat}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                      {activeChapter.highlightLabel}
                    </span>
                  </div>

                  {/* Narrative Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3.5">
                    {activeChapter.description}
                  </p>

                  {/* Key Feature Bullets */}
                  <ul className="space-y-1.5 mb-4">
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

                  {/* Direct Action Button to open the mode (only for chapters 01..06 that map to a tab) */}
                  {activeChapter.targetTab && activeChapter.ctaLabel && (
                    <button
                      type="button"
                      onClick={() => {
                        stopAutopilot();
                        onSelectTab(activeChapter.targetTab!);
                      }}
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

        {/* BOTTOM MINIMALIST CHAPTER TIMELINE & PROGRESS SCRUBBER (NO BACKGROUND BOX) */}
        <div
          style={{
            opacity: hudFadeOpacity,
            pointerEvents: hudFadeOpacity < 0.15 ? 'none' : 'auto',
          }}
          className="absolute bottom-6 sm:bottom-7 inset-x-0 z-20 max-w-360 mx-auto px-4 sm:px-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto gap-2.5 text-[11px] font-mono text-slate-200 shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="font-bold tracking-wider">{copy.hudProgressLabel}</span>
              <span className="font-extrabold text-sky-300">
                {Math.round(displayProgress * 100)}%
              </span>
            </div>

            {/* Minimalist Timeline Bar */}
            <div className="relative flex-1 w-full h-1.5 rounded-full bg-white/25 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 via-sky-400 to-emerald-400"
                style={{ width: `${(displayProgress * 100).toFixed(1)}%` }}
              />
            </div>

            {/* 8 Chapter Checkpoint Triggers (Minimalist numbers) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {copy.chapters.map((ch, idx) => {
                const [s, e] = ch.scrollRange;
                const isActive = displayProgress >= s && displayProgress <= e;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToFlightProgress((s + e) * 0.5)}
                    title={ch.title}
                    className={`px-2 py-1 rounded-md font-mono text-[11px] font-extrabold transition cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] ${
                      isActive
                        ? 'text-sky-300 underline decoration-sky-400 decoration-2 underline-offset-4 scale-110'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SEAMLESS BLUR + PURE WHITE FADE + CLEAN LOGO_TRANSPARENT REVEAL ON FINAL FRAMES (88% -> 100%) */}
        {finaleProgress > 0.005 && (
          <div
            className="pointer-events-none absolute -inset-y-2 inset-x-0 z-25 flex flex-col items-center justify-center"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${whiteOverlayOpacity.toFixed(3)})`,
              willChange: 'background-color',
            }}
          >
            {logoRevealProgress > 0.01 && (
              <div
                className="flex flex-col items-center gap-3"
                style={{
                  opacity: logoRevealProgress,
                  transform: `scale(${(0.86 + logoRevealProgress * 0.14).toFixed(3)}) translate3d(0, ${((1 - logoRevealProgress) * 18).toFixed(1)}px, 0)`,
                  filter:
                    logoRevealProgress < 0.98
                      ? `blur(${((1 - logoRevealProgress) * 8).toFixed(1)}px)`
                      : 'none',
                  willChange: 'transform, opacity, filter',
                }}
              >
                <img
                  src="/showcase/logo_transparent.png"
                  alt="Logo Kraków360"
                  className="w-36 h-36 sm:w-48 sm:h-48 object-contain"
                />
                <div className="flex flex-col items-center select-none text-center">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-none">
                    Kraków<span className="text-blue-600">360</span>
                  </div>
                  <span className="font-handwriting text-base sm:text-lg font-bold text-blue-600 tracking-wide mt-1.5 leading-none">
                    Tu chcę żyć
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
