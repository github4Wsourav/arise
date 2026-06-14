/**
 * Original line-icon set, authored for Arise (MIT, no third-party assets).
 * Thin 1.6px strokes on a 24-grid, `currentColor` everywhere so each icon
 * inherits the active tier aura. Used for stats and section glyphs.
 */
import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** STR — a barbell loaded to the eyes. */
export const IconStr = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12h2M20 12h2M6 8v8M18 8v8" />
    <path d="M9 9v6M15 9v6" />
    <path d="M9 12h6" />
  </Svg>
);

/** VIT — a heart with a pulse. */
export const IconVit = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-6.5-4.3-8.5-8.2C2 8.9 3.4 5.8 6.4 5.8c1.9 0 3 1.2 3.6 2.3.6-1.1 1.7-2.3 3.6-2.3 3 0 4.4 3.1 2.9 6C18.5 15.7 12 20 12 20Z" />
    <path d="M5 12h2.5l1.5-2.5 2 5 1.5-2.5H16" />
  </Svg>
);

/** AGI — a lightning bolt. */
export const IconAgi = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 2 5 13h6l-2 9 9-13h-6l1-7Z" />
  </Svg>
);

/** REC — a crescent moon (recovery, the Sanctuary). */
export const IconRec = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.2 6.2 0 0 0 10.5 10.5Z" />
    <path d="M17 5.5v3M15.5 7h3" />
  </Svg>
);

export const STAT_ICON = {
  str: IconStr,
  vit: IconVit,
  agi: IconAgi,
  rec: IconRec,
} as const;

/** A gate sigil — a portal ring, used as a section glyph. */
export const IconGate = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c4 0 6 4 6 9s-2 9-6 9-6-4-6-9 2-9 6-9Z" />
    <path d="M12 3v18M6.5 8h11M6.5 16h11" />
  </Svg>
);

/** A flame — the streak. */
export const IconFlame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c0 3-4 4-4 8a4 4 0 0 0 8 0c0-1.5-1-2.5-1-2.5.2 1.4-1 2-1 2 .5-3-2-5-2-7.5Z" />
  </Svg>
);
