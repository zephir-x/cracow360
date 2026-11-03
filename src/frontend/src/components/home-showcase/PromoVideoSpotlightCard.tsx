import { useEffect, useRef, useState } from 'react';
import { Film, Mic, MicOff, RotateCcw, Volume2 } from 'lucide-react';
import type { HomeShowcaseTranslations } from '../../i18n/modules';

export interface PromoVideoSpotlightCardProps {
  copy: HomeShowcaseTranslations['promoSpot'];
}

/**
 * Cinema-grade autoplay promotional spot ("reklama.mp4", ~1m45s) with a custom
 * interactive Microphone cursor that replaces the native pointer on hover.
 * - Outer wrapper is overflow-visible so the custom cursor orb is never clipped at video edges.
 * - Smoothly scales/fades the custom cursor in & out on video enter/leave and when hovering over the Replay button.
 */
export function PromoVideoSpotlightCard({ copy }: PromoVideoSpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cursorOrbRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isHoveringVideo, setIsHoveringVideo] = useState<boolean>(false);
  const [isHoveringReplayBtn, setIsHoveringReplayBtn] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);

  // Smooth 60 FPS pointer follower for the custom Microphone cursor
  useEffect(() => {
    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.26;
      currentY += (targetY - currentY) * 0.26;
      const orb = cursorOrbRef.current;
      if (orb) {
        orb.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (container) {
        container.removeEventListener('pointermove', handlePointerMove);
      }
    };
  }, []);

  const handleToggleSound = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const nextMuted = !vid.muted;
    vid.muted = nextMuted;
    if (!nextMuted) {
      vid.volume = 0.9;
      void vid.play().catch(() => {});
    }
    setIsMuted(nextMuted);
  };

  const handleRestartWithSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.muted = false;
    vid.volume = 0.9;
    void vid.play().catch(() => {});
    setIsMuted(false);
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgressPct((vid.currentTime / vid.duration) * 100);
  };

  const showCustomMicCursor = isHoveringVideo && !isHoveringReplayBtn;

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-8 pt-16 pb-8">
      {/* Section Header */}
      <div className="max-w-3xl mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-extrabold tracking-wider uppercase">
          <Film className="w-3.5 h-3.5 text-blue-600" />
          {copy.sectionBadge}
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          <span className="block">{copy.titleLead}</span>
          <span className="block bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            {copy.titleAccent}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {copy.description}
        </p>
      </div>

      {/* Outer Container (overflow-visible so the custom Microphone cursor is never clipped at borders) */}
      <div
        ref={containerRef}
        onClick={handleToggleSound}
        onPointerEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const orb = cursorOrbRef.current;
          if (orb) {
            orb.style.transform = `translate3d(${(e.clientX - rect.left).toFixed(1)}px, ${(e.clientY - rect.top).toFixed(1)}px, 0) translate(-50%, -50%)`;
          }
          setIsHoveringVideo(true);
        }}
        onPointerLeave={() => {
          setIsHoveringVideo(false);
          setIsHoveringReplayBtn(false);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleSound();
          }
        }}
        aria-label={isMuted ? copy.cursorUnmuteLabel : copy.cursorMuteLabel}
        className={`group relative w-full select-none aspect-video max-h-170 ${
          showCustomMicCursor ? 'cursor-none' : 'cursor-pointer'
        }`}
      >
        {/* Inner Rounded Cinema Frame that clips the video & overlays */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-950 border-2 border-blue-200/80 shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
          <video
            ref={videoRef}
            src="/showcase/reklama.mp4"
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Subtle Top & Bottom Cinema Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-slate-950/40" />

          {/* Top-Right Sound Status Pill */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 pointer-events-none">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border text-[11px] font-extrabold tracking-wider uppercase transition-all duration-300 ${
                isMuted
                  ? 'bg-slate-950/75 border-white/20 text-slate-200'
                  : 'bg-sky-500/90 border-sky-300 text-white shadow-[0_0_25px_rgba(14,165,233,0.65)]'
              }`}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>{copy.audioMutedBadge}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>{copy.audioActiveBadge}</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Controls Overlay: Replay from 0:00 Button & Progress Bar */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRestartWithSound}
                onPointerEnter={() => setIsHoveringReplayBtn(true)}
                onPointerLeave={() => setIsHoveringReplayBtn(false)}
                className="pointer-events-auto cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-blue-600/90 backdrop-blur-xl border border-white/20 hover:border-sky-300/60 text-xs font-bold text-white inline-flex items-center gap-2 transition-all duration-250 shadow-lg hover:scale-[1.03]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
                <span>{copy.restartVideoLabel}</span>
              </button>

              {/* Mobile / Touch fallback badge */}
              <div className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/20 text-xs font-bold text-white">
                {isMuted ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                    <span>{copy.cursorUnmuteLabel}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{copy.cursorMuteLabel}</span>
                  </>
                )}
              </div>
            </div>

            {/* Playback Progress Line */}
            <div className="pointer-events-none w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-150"
                style={{ width: `${progressPct.toFixed(1)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CUSTOM FLOATING MICROPHONE CURSOR ORB (UNCLIPPED & SMOOTHLY ANIMATED) */}
        <div
          ref={cursorOrbRef}
          className="pointer-events-none absolute top-0 left-0 z-30"
          style={{ willChange: 'transform' }}
        >
          <div
            className={`relative flex items-center gap-2.5 px-4 py-3 rounded-full backdrop-blur-2xl border-2 shadow-[0_14px_40px_rgba(0,0,0,0.55)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showCustomMicCursor
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            } ${
              isMuted
                ? 'bg-slate-950/90 border-sky-400/80 text-white'
                : 'bg-sky-600/92 border-white/90 text-white'
            }`}
          >
            {/* Pulsing Aura Ring around Microphone Icon */}
            <div className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <span
                className={`absolute inset-0 rounded-full animate-ping opacity-35 ${
                  isMuted ? 'bg-sky-400' : 'bg-emerald-300'
                }`}
              />
              {isMuted ? (
                <MicOff className="relative z-10 w-5 h-5 text-sky-300" />
              ) : (
                <Mic className="relative z-10 w-5 h-5 text-white" />
              )}
            </div>

            <div className="pr-1">
              <div className="text-xs font-extrabold tracking-wide whitespace-nowrap">
                {isMuted ? copy.cursorUnmuteLabel : copy.cursorMuteLabel}
              </div>
              <div className="text-[10px] font-mono text-sky-200/90 uppercase tracking-wider">
                {isMuted ? 'AUDIO OFF • CLICK' : 'AUDIO ON • CLICK'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
