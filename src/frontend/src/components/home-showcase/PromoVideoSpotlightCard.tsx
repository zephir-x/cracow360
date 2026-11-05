import { useEffect, useRef, useState } from 'react';
import { Film, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { HomeShowcaseTranslations } from '../../i18n/modules';

export interface PromoVideoSpotlightCardProps {
  copy: HomeShowcaseTranslations['promoSpot'];
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Cinema-grade autoplay promotional spot ("ad.mp4", ~1m45s) with:
 * - Custom interactive Speaker cursor (Volume2 / VolumeX) on desktop hover.
 * - Mobile: Unobstructed view with sleek semi-transparent glass icon-only controls that auto-fade after 3s.
 * - Interactive YouTube-style seekable progress bar at the bottom.
 */
export function PromoVideoSpotlightCard({ copy }: PromoVideoSpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cursorOrbRef = useRef<HTMLDivElement | null>(null);
  const seekBarRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isHoveringVideo, setIsHoveringVideo] = useState<boolean>(false);
  const [isHoveringReplayBtn, setIsHoveringReplayBtn] = useState<boolean>(false);
  const [isHoveringSeekBar, setIsHoveringSeekBar] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [hoverSeekPct, setHoverSeekPct] = useState<number | null>(null);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(0);

  // Auto-hide controls timer on mobile (shows on tap, fades out cleanly after 3s)
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(false);
  const autoHideTimerRef = useRef<number | null>(null);

  const triggerControlsVisibility = () => {
    setIsControlsVisible(true);
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    autoHideTimerRef.current = window.setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  // Smooth 60 FPS pointer follower for the custom Speaker cursor (desktop)
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
    triggerControlsVisibility();
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
    triggerControlsVisibility();
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.muted = false;
    vid.volume = 0.9;
    void vid.play().catch(() => {});
    setIsMuted(false);
    setProgressPct(0);
    setCurrentTimeSec(0);
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setCurrentTimeSec(vid.currentTime);
    setDurationSec(vid.duration);
    setProgressPct((vid.currentTime / vid.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setDurationSec(vid.duration);
  };

  // Interactive YouTube-style seek handler
  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    triggerControlsVisibility();
    const bar = seekBarRef.current;
    const vid = videoRef.current;
    if (!bar || !vid || !vid.duration) return;

    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
    vid.currentTime = ratio * vid.duration;
    setCurrentTimeSec(vid.currentTime);
    setProgressPct(ratio * 100);
  };

  const handleSeekPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bar = seekBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
    setHoverSeekPct(ratio * 100);
  };

  const showCustomSpeakerCursor =
    isHoveringVideo && !isHoveringReplayBtn && !isHoveringSeekBar;

  return (
    <div className="max-w-360 mx-auto px-3 sm:px-8 pt-10 sm:pt-16 pb-6 sm:pb-8">
      {/* Section Header (Centered on mobile, left-aligned on sm+) */}
      <div className="max-w-3xl mb-6 sm:mb-8 space-y-2.5 sm:space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-extrabold tracking-wider uppercase">
          <Film className="w-3.5 h-3.5 text-blue-600" />
          {copy.sectionBadge}
        </div>
        <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          <span className="block">{copy.titleLead}</span>
          <span className="block bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            {copy.titleAccent}
          </span>
        </h2>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          {copy.description}
        </p>
      </div>

      {/* Outer Container (overflow-visible so the custom Speaker cursor is never clipped at borders) */}
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
          setIsHoveringSeekBar(false);
          setHoverSeekPct(null);
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
          showCustomSpeakerCursor ? 'cursor-none' : 'cursor-pointer'
        }`}
      >
        {/* Inner Rounded Cinema Frame that clips the video & overlays */}
        <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-2 border-blue-200/80 shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
          <video
            ref={videoRef}
            src="/showcase/ad.mp4"
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            style={{
              imageRendering: '-webkit-optimize-contrast',
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01] contrast-[1.04] saturate-[1.06] brightness-[1.01]"
          />

          {/* Subtle Top & Bottom Cinema Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-slate-950/40" />

          {/* Top-Right Sound Status Indicator: Clean glass circle on mobile, pill on desktop */}
          <div
            className={`absolute top-3 sm:top-6 right-3 sm:right-6 z-10 transition-opacity duration-300 ${
              isControlsVisible ? 'opacity-100' : 'opacity-0 sm:opacity-100'
            }`}
          >
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 w-8 h-8 sm:w-auto p-0 sm:px-3.5 sm:py-1.5 justify-center rounded-full backdrop-blur-md border text-[11px] font-extrabold tracking-wider uppercase transition-all duration-300 ${
                isMuted
                  ? 'bg-black/35 sm:bg-slate-950/75 border-white/20 text-slate-200'
                  : 'bg-sky-500/85 sm:bg-sky-500/90 border-sky-300 text-white shadow-[0_0_20px_rgba(14,165,233,0.5)]'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">{copy.audioMutedBadge}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white animate-pulse" />
                  <span className="hidden sm:inline">{copy.audioActiveBadge}</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Controls Overlay: Replay Button, Time Readout & Seekable Progress Bar */}
          <div
            className={`absolute bottom-2.5 sm:bottom-5 inset-x-3 sm:inset-x-6 z-10 flex flex-col gap-1.5 sm:gap-2 transition-opacity duration-300 ${
              isControlsVisible ? 'opacity-100' : 'opacity-0 sm:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Replay Button: Glass circle icon button on mobile, full pill on desktop */}
                <button
                  type="button"
                  onClick={handleRestartWithSound}
                  onPointerEnter={() => setIsHoveringReplayBtn(true)}
                  onPointerLeave={() => setIsHoveringReplayBtn(false)}
                  title={copy.restartVideoLabel}
                  aria-label={copy.restartVideoLabel}
                  className="pointer-events-auto cursor-pointer w-8 h-8 sm:w-auto p-0 sm:px-3.5 sm:py-1.5 rounded-full sm:rounded-xl bg-black/35 sm:bg-slate-950/80 hover:bg-blue-600/90 backdrop-blur-md border border-white/20 hover:border-sky-300/60 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all duration-250 shadow-md hover:scale-[1.03]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
                  <span className="hidden sm:inline">{copy.restartVideoLabel}</span>
                </button>

                {durationSec > 0 && (
                  <span className="hidden sm:inline-block font-mono text-xs font-bold text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                    {formatTime(currentTimeSec)} / {formatTime(durationSec)}
                  </span>
                )}
              </div>
            </div>

            {/* Interactive YouTube-Style Seekable Progress Bar */}
            <div
              ref={seekBarRef}
              onClick={handleSeekClick}
              onPointerEnter={() => setIsHoveringSeekBar(true)}
              onPointerLeave={() => {
                setIsHoveringSeekBar(false);
                setHoverSeekPct(null);
              }}
              onPointerMove={handleSeekPointerMove}
              role="slider"
              aria-label="Pasek postępu wideo"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPct)}
              className="pointer-events-auto cursor-pointer relative py-1.5 sm:py-2 group/seek"
            >
              {/* Hover Preview Timestamp Tooltip */}
              {hoverSeekPct !== null && durationSec > 0 && (
                <div
                  className="pointer-events-none absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-950/90 border border-white/20 font-mono text-[10px] font-bold text-sky-300 shadow-md"
                  style={{ left: `${hoverSeekPct.toFixed(1)}%` }}
                >
                  {formatTime((hoverSeekPct / 100) * durationSec)}
                </div>
              )}

              {/* Track Background */}
              <div className="relative w-full h-1 group-hover/seek:h-2 rounded-full bg-white/25 overflow-hidden transition-all duration-150">
                {/* Hover Ghost Fill */}
                {hoverSeekPct !== null && (
                  <div
                    className="absolute inset-y-0 left-0 bg-white/25"
                    style={{ width: `${hoverSeekPct.toFixed(1)}%` }}
                  />
                )}

                {/* Active Playback Fill */}
                <div
                  className="relative h-full bg-linear-to-r from-blue-500 via-sky-400 to-emerald-400"
                  style={{ width: `${progressPct.toFixed(1)}%` }}
                />
              </div>

              {/* Scrubber Thumb Dot */}
              <div
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)] opacity-0 group-hover/seek:opacity-100 scale-75 group-hover/seek:scale-100 transition-all duration-150"
                style={{ left: `${progressPct.toFixed(1)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CUSTOM FLOATING SPEAKER CURSOR ORB (DESKTOP ONLY) */}
        <div
          ref={cursorOrbRef}
          className="pointer-events-none absolute top-0 left-0 z-30 hidden md:block"
          style={{ willChange: 'transform' }}
        >
          <div
            className={`relative flex items-center gap-2.5 px-4 py-3 rounded-full backdrop-blur-2xl border-2 shadow-[0_14px_40px_rgba(0,0,0,0.55)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showCustomSpeakerCursor
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            } ${
              isMuted
                ? 'bg-slate-950/90 border-sky-400/80 text-white'
                : 'bg-sky-600/92 border-white/90 text-white'
            }`}
          >
            {/* Pulsing Aura Ring around Speaker Icon */}
            <div className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <span
                className={`absolute inset-0 rounded-full animate-ping opacity-35 ${
                  isMuted ? 'bg-sky-400' : 'bg-emerald-300'
                }`}
              />
              {isMuted ? (
                <VolumeX className="relative z-10 w-5 h-5 text-sky-300" />
              ) : (
                <Volume2 className="relative z-10 w-5 h-5 text-white" />
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
