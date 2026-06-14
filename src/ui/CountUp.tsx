import { useEffect, useRef, useState } from 'react';

/**
 * Slot-machine numeral: ramps 0 → `to` with an ease-out, optionally after a delay
 * (so the tally lines reveal first, then the total totes up). Respects
 * prefers-reduced-motion by snapping straight to the final value.
 */
interface Props {
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function CountUp({ to, duration = 900, delay = 0, className, prefix = '' }: Props) {
  const [n, setN] = useState(() => (prefersReduced() ? to : 0));
  const raf = useRef(0);

  useEffect(() => {
    if (prefersReduced()) {
      setN(to);
      return;
    }
    let cancelled = false;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setN(Math.round(to * eased));
        if (t < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(run, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [to, duration, delay]);

  return (
    <span className={className}>
      {prefix}
      {n.toLocaleString()}
    </span>
  );
}
