import type { WawelekMascotAnimationState } from '../../types/contracts';

export interface WawelekMascotAvatarProps {
  /**
   * Current state of the assistant:
   * - 'idle': gentle floating & blinking
   * - 'listening': leaning forward with attentive eyes while user types
   * - 'thinking': pondering pose with orbiting data sparkles while waiting for DeepSeek
   * - 'speaking': cheerful bounce & wide smile when delivering an answer
   */
  state: WawelekMascotAnimationState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Modular mascot renderer for "Wawelek" – the adorable Blue Dragon of Kraków360.
 * Crafted to match Filip's official blue dragon character design (sky-blue scales,
 * cream-blue ribbed belly, purple-indigo head crests, expressive dark eyes, little wings).
 *
 * Future-proofed architecture: when custom sprite sheets, WebM loops, or Lottie JSON
 * animations are ready for the 4 states ('idle' | 'listening' | 'thinking' | 'speaking'),
 * they can be plugged directly into this component without changing any parent chat code.
 */
export function WawelekMascotAvatar({
  state,
  size = 'md',
  className = '',
}: WawelekMascotAvatarProps) {
  const dimensionClasses =
    size === 'sm'
      ? 'w-10 h-10'
      : size === 'lg'
        ? 'w-20 h-20'
        : 'w-12 h-12';

  const stateAnimationClass =
    state === 'thinking'
      ? 'wawelek-mascot-thinking'
      : state === 'speaking'
        ? 'wawelek-mascot-speaking'
        : state === 'listening'
          ? 'wawelek-mascot-listening'
          : 'wawelek-mascot-idle';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${dimensionClasses} ${stateAnimationClass} ${className}`}
      data-mascot-state={state}
      aria-hidden="true"
    >
      {/* Ambient blue aura behind Wawelek */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          state === 'thinking'
            ? 'bg-sky-400/35 blur-md scale-115 animate-pulse'
            : state === 'speaking'
              ? 'bg-blue-400/35 blur-md scale-110'
              : 'bg-sky-400/20 blur-sm'
        }`}
      />

      {/* Vector illustration of Wawelek the Blue Dragon */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_4px_10px_rgba(14,116,144,0.35)]"
      >
        <defs>
          <linearGradient id="wawelekBodyGrad" x1="20" y1="15" x2="95" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="48%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="wawelekBellyGrad" x1="45" y1="52" x2="65" y2="102" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <linearGradient id="wawelekWingGrad" x1="70" y1="48" x2="112" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="wawelekCrestGrad" x1="50" y1="8" x2="80" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        {/* Little Dragon Wing (Right/Back) */}
        <g className={state === 'speaking' || state === 'thinking' ? 'origin-[72px_62px] animate-pulse' : ''}>
          <path
            d="M72 60 C88 44, 106 48, 112 62 C102 62, 95 66, 92 73 C85 68, 79 68, 73 72 Z"
            fill="url(#wawelekWingGrad)"
            stroke="#0284c7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M75 61 C86 54, 96 56, 102 62"
            stroke="#7dd3fc"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Dragon Tail with dorsal spikes */}
        <path
          d="M70 92 C88 94, 102 88, 110 78 C105 94, 88 105, 66 102 Z"
          fill="url(#wawelekBodyGrad)"
        />
        <path d="M84 89 L88 83 L92 88 Z" fill="url(#wawelekCrestGrad)" />
        <path d="M95 85 L99 79 L102 84 Z" fill="url(#wawelekCrestGrad)" />

        {/* Chubby Dragon Torso */}
        <ellipse cx="56" cy="82" rx="24" ry="23" fill="url(#wawelekBodyGrad)" />

        {/* Ribbed Light-Blue Belly */}
        <ellipse cx="52" cy="83" rx="15" ry="18" fill="url(#wawelekBellyGrad)" />
        <path d="M40 73 Q52 76 64 73" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M38 81 Q52 84 65 81" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M40 89 Q52 92 64 89" stroke="#7dd3fc" strokeWidth="1.6" strokeLinecap="round" />

        {/* Top Head Crests / Spikes */}
        <path d="M53 18 C55 10, 62 10, 63 19 Z" fill="url(#wawelekCrestGrad)" />
        <path d="M62 20 C65 13, 72 14, 71 23 Z" fill="url(#wawelekCrestGrad)" />
        <path d="M70 25 C74 19, 80 21, 77 29 Z" fill="url(#wawelekCrestGrad)" />

        {/* Cute Side Horn / Ear */}
        <path
          d="M72 34 C84 26, 95 27, 98 33 C92 40, 81 42, 73 41 Z"
          fill="url(#wawelekBodyGrad)"
          stroke="#0284c7"
          strokeWidth="1.5"
        />

        {/* Dragon Head & Snout */}
        <path
          d="M32 38 C32 22, 50 16, 67 20 C81 24, 86 38, 82 52 C79 62, 65 66, 48 64 C30 62, 20 55, 21 45 C22 38, 28 37, 32 38 Z"
          fill="url(#wawelekBodyGrad)"
        />

        {/* Cute Snout Nostrils */}
        <circle cx="27" cy="44" r="2" fill="#0369a1" />
        <circle cx="35" cy="45" r="2.2" fill="#0369a1" />

        {/* Soft Rosy Cheek */}
        <ellipse cx="64" cy="52" rx="6" ry="3.8" fill="#f472b6" fillOpacity="0.32" />

        {/* Expressive Eyes (change slightly by state) */}
        {/* Left/Far Eye */}
        <ellipse cx="40" cy="34" rx="4.5" ry="6.5" fill="#ffffff" />
        <ellipse
          cx={state === 'listening' ? '39' : '40'}
          cy={state === 'thinking' ? '32' : '34'}
          rx="3"
          ry="4.5"
          fill="#1e1b4b"
        />
        <circle cx="39" cy="32" r="1.3" fill="#ffffff" />

        {/* Right/Main Eye */}
        <ellipse cx="57" cy="36" rx="7.5" ry="9" fill="#ffffff" />
        <ellipse
          cx={state === 'listening' ? '55' : '56.5'}
          cy={state === 'thinking' ? '33.5' : '36'}
          rx="5"
          ry="6.5"
          fill="#1e1b4b"
        />
        <circle cx="54.5" cy="33.5" r="2.2" fill="#ffffff" />
        <circle cx="58.5" cy="38.5" r="1" fill="#ffffff" />

        {/* Eyebrows */}
        <path
          d={
            state === 'thinking'
              ? 'M50 24 Q58 21 65 26'
              : state === 'speaking'
                ? 'M49 23 Q57 19 65 24'
                : 'M50 25 Q58 22 65 26'
          }
          stroke="#0369a1"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Smile / Mouth */}
        {state === 'speaking' ? (
          <path
            d="M28 53 Q40 61 52 54"
            stroke="#0369a1"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#38bdf8"
          />
        ) : state === 'thinking' ? (
          <path
            d="M31 54 Q40 53 47 55"
            stroke="#0369a1"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M28 52 Q39 58 50 53"
            stroke="#0369a1"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        )}

        {/* Cute Dragon Paws / Arms */}
        <path
          d={
            state === 'thinking'
              ? 'M64 68 C58 60, 50 56, 46 58 C44 61, 50 68, 58 74'
              : 'M65 70 C59 73, 53 75, 50 72 C48 69, 54 64, 62 65'
          }
          fill="url(#wawelekBodyGrad)"
          stroke="#0284c7"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Feet with little white claws */}
        <ellipse cx="42" cy="103" rx="9" ry="5" fill="#0284c7" />
        <circle cx="36" cy="104" r="1.8" fill="#e0f2fe" />
        <circle cx="41" cy="105" r="1.8" fill="#e0f2fe" />

        <ellipse cx="62" cy="104" rx="9.5" ry="5" fill="#0284c7" />
        <circle cx="56" cy="105" r="1.8" fill="#e0f2fe" />
        <circle cx="61" cy="106" r="1.8" fill="#e0f2fe" />

        {/* Thinking Sparkle / Star Indicator */}
        {state === 'thinking' && (
          <g className="animate-pulse">
            <circle cx="20" cy="22" r="3" fill="#38bdf8" />
            <circle cx="94" cy="18" r="3.5" fill="#818cf8" />
            <circle cx="102" cy="36" r="2.2" fill="#38bdf8" />
          </g>
        )}
      </svg>
    </div>
  );
}
