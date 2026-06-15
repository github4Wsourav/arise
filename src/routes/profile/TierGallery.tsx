import type { TierManifest } from '../../character/manifest';
import { imageUrlForLevel } from '../../character/manifest';
import { SYSTEM } from '../../data/strings';
import { Art } from '../../ui/Art';
import { SystemWindow } from '../../ui/SystemWindow';

interface Props {
  manifest: TierManifest;
  currentTierIndex: number;
}

const LockGlyph = () => (
  <svg className="tier-slot-lock" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="currentColor" opacity="0.9" />
    <path
      d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/** Ten tiers: reached ones reveal their Hunter portrait; the future stays locked. */
export function TierGallery({ manifest, currentTierIndex }: Props) {
  return (
    <SystemWindow label={SYSTEM.gallery.label}>
      <div className="tier-gallery">
        {manifest.tiers.map((tier, i) => {
          const reached = i <= currentTierIndex;
          const [accent, hi, deep] = tier.aura.colors;
          return (
            <div className={`tier-slot${reached ? '' : ' tier-slot--classified'}`} key={tier.id}>
              <div
                className="tier-slot-aura"
                style={
                  reached
                    ? { background: `radial-gradient(ellipse at 50% 120%, ${deep}, ${accent} 70%, ${hi})` }
                    : undefined
                }
              >
                {reached ? (
                  <Art className="tier-slot-img" src={imageUrlForLevel(tier.levels[0], manifest)} />
                ) : (
                  <LockGlyph />
                )}
              </div>
              <p className="tier-slot-name">
                {reached ? tier.name : SYSTEM.gallery.classified(tier.levels[0])}
              </p>
            </div>
          );
        })}
      </div>
    </SystemWindow>
  );
}
