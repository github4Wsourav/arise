import { useMemo } from 'react';
import type { CSSProperties } from 'react';

/**
 * Glowing aura motes that drift upward. Pure CSS animation (GPU transform/opacity
 * only — no canvas, no rAF loop, no dependency); aura-tinted so they recolor per
 * tier. Two uses: the root Shell renders it fixed behind everything (ambient void),
 * and the character stage renders a `contained` instance in FRONT of the portrait.
 * Disabled under prefers-reduced-motion (see .particle-field in system-fx.css).
 */
interface Mote {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

export function ParticleField({ contained = false, count }: { contained?: boolean; count?: number }) {
  const n = count ?? (contained ? 16 : 48);
  const motes = useMemo<Mote[]>(
    () =>
      Array.from({ length: n }, () => ({
        left: Math.random() * 100,
        size: 2.5 + Math.random() * 4,
        duration: 15 + Math.random() * 15,
        delay: -Math.random() * 30, // negative → already mid-flight on first paint
        drift: (Math.random() * 2 - 1) * 70,
        opacity: 0.32 + Math.random() * 0.46,
      })),
    [n],
  );

  return (
    <div className={`particle-field${contained ? ' particle-field--contained' : ''}`} aria-hidden="true">
      {motes.map((m, i) => (
        <span
          key={i}
          className="mote"
          style={
            {
              left: `${m.left}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              '--dur': `${m.duration}s`,
              '--delay': `${m.delay}s`,
              '--drift': `${m.drift}px`,
              '--o': m.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
