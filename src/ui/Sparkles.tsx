import type { CSSProperties } from 'react';

/**
 * A handful of tiny gold sparkles that twinkle near a panel's ornate frame.
 * Pure CSS animation (opacity/transform only), decorative, aria-hidden, and
 * frozen under prefers-reduced-motion. Rendered inside every System window.
 */
const SPARKS = [
  { top: '3%', left: '7%', size: 8, delay: 0, dur: 3.1 },
  { top: '5%', left: '53%', size: 5, delay: 1.7, dur: 2.7 },
  { top: '4%', left: '91%', size: 7, delay: 0.9, dur: 3.4 },
  { top: '93%', left: '14%', size: 6, delay: 2.3, dur: 2.9 },
  { top: '95%', left: '63%', size: 5, delay: 0.5, dur: 3.3 },
  { top: '90%', left: '93%', size: 7, delay: 1.2, dur: 2.6 },
  { top: '47%', left: '2.5%', size: 5, delay: 2.0, dur: 3.0 },
  { top: '66%', left: '97%', size: 6, delay: 0.4, dur: 3.5 },
];

export function Sparkles() {
  return (
    <span className="sparkles" aria-hidden="true">
      {SPARKS.map((s, i) => (
        <svg
          key={i}
          className="sparkle"
          viewBox="0 0 10 10"
          style={
            {
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            } as CSSProperties
          }
        >
          <path d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z" />
        </svg>
      ))}
    </span>
  );
}
