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
 *   150-frame WebP Canvas Scroll-Scrubbing + 6 3D Story Cards + Circular Iris Portal.
 * - Act III: Autoplay Promotional Spot with Custom Microphone Cursor +
 *   Visual Story Duo + 5 Interactive 3D-Tilt Module Portals.
 */
export function HomeShowcasePage({ onSelectTab }: HomeShowcasePageProps) {
  const { language } = useTranslation();
  const copy = getHomeShowcaseI18n(language);

  const actThreeRef = useRef<HTMLDivElement | null>(null);

  const handleSkipToFinale = () => {
    actThreeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full overflow-x-clip">
      {/* UNIFIED ACT I & ACT II STAGE: In-Place Hero Dissolve + Controlled Drone Scroll-Scrubbing */}
      <VelocityScrollScrubSection
        heroCopy={copy.hero}
        copy={copy.scrubSection}
        onSelectTab={onSelectTab}
        onSkipToFinale={handleSkipToFinale}
      />

      {/* ACT III: Promotional Video Spot (Custom Mic Cursor) + Family Visual Story + 3D Portals */}
      <div
        ref={actThreeRef}
        className="relative bg-linear-to-b from-slate-50 via-white to-blue-50/40"
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
