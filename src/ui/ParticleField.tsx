import { useMemo } from 'react';
import type { CSSProperties } from 'react';

/**
 * Ambient glowing motes drifting up through the void. Pure CSS animation (GPU
 * transform/opacity only — no canvas, no rAF loop, no dependency); aura-tinted so
 * they recolor per tier. Rendered once in the root Shell, fixed behind all content.
 * Disabled under prefers-reduced-motion (see .particle-field in system-fx.css).
 */
const COUNT = 28;

interface Mote {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

export function ParticleField() {
  const motes = useMemo<Mote[]>(
    () =>
      Array.from({ length: COUNT }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 3.5,
        duration: 16 + Math.random() * 16,
        delay: -Math.random() * 32, // negative → already mid-flight on first paint
        drift: (Math.random() * 2 - 1) * 70,
        opacity: 0.18 + Math.random() * 0.4,
      })),
    [],
  );

  return (
    <div className="particle-field" aria-hidden="true">
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
