import { useRef } from 'react';
import { FinaleSection } from '../components/home-showcase/FinaleSection';
import { PromoVideoSpotlightCard } from '../components/home-showcase/PromoVideoSpotlightCard';
import { VelocityScrollScrubSection } from '../components/home-showcase/VelocityScrollScrubSection';
import type { AppTabId } from '../components/layout/MainNavbar';
import { useTranslation } from '../i18n/I18nContext';
import { getHomeShowcaseI18n } from '../i18n/modules';

export interface HomeShowcasePageProps {
  onSelectTab: (tab: AppTabId) => void;
}

/**
 * Stage 11: Cinematic Home Showcase Page ("#/home").
 * Orchestrates the 3-act interactive experience:
 * - Act I & Act II (Unified Sticky Stage): Initial scroll lock + Staggered Hero Reveal +
 *   Dual-Vision Cursor X-Ray Mask dissolving directly in-place into the Velocity-Clamped
 *   250-frame WebP Canvas Scroll-Scrubbing + 8 3D Story Cards + Blur/White/Logo Finale.
 * - Act III: Autoplay Promotional Spot with Custom Speaker Cursor +
 *   5 Human Visual Stories + 5 Interactive 3D-Tilt Module Portals + Team Percepcja360 Showcase.
 */
export function HomeShowcasePage({ onSelectTab }: HomeShowcasePageProps) {
  const { language } = useTranslation();
  const copy = getHomeShowcaseI18n(language);

  const actThreeRef = useRef<HTMLDivElement | null>(null);

  const handleSkipToFinale = () => {
    actThreeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* UNIFIED ACT I & ACT II STAGE: In-Place Hero Dissolve + Controlled Drone Scroll-Scrubbing */}
      <VelocityScrollScrubSection
        heroCopy={copy.hero}
        copy={copy.scrubSection}
        onSelectTab={onSelectTab}
        onSkipToFinale={handleSkipToFinale}
      />

      {/* ACT III: Overlaps by top background to eliminate any subpixel horizontal seam */}
      <div
        ref={actThreeRef}
        className="relative z-30 -mt-1 pt-1 bg-linear-to-b from-white via-slate-50/70 to-blue-50/40"
      >
        <PromoVideoSpotlightCard copy={copy.promoSpot} />

        <FinaleSection
          visualStoryCopy={copy.visualStory}
          portalsCopy={copy.portals}
          teamCopy={copy.teamBanner}
          onSelectTab={onSelectTab}
        />
      </div>
    </div>
  );
}
