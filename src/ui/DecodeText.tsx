import { useEffect, useRef, useState } from 'react';

/**
 * "The System rendering text": glyphs scramble, then resolve left-to-right into
 * the real string on mount. Used for tier names so a rank reads like it's being
 * decoded into existence. Respects prefers-reduced-motion (shows the text plainly).
 */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scramble = (source: string, resolved: number) => {
  let out = '';
  for (let i = 0; i < source.length; i++) {
    if (i < resolved || source[i] === ' ') out += source[i];
    else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
};

interface Props {
  text: string;
  className?: string;
  /** frames held per character before it locks (≈16ms each). */
  framesPerChar?: number;
}

export function DecodeText({ text, className, framesPerChar = 2 }: Props) {
  const [display, setDisplay] = useState(() => (prefersReduced() ? text : scramble(text, 0)));
  const raf = useRef(0);

  useEffect(() => {
    if (prefersReduced()) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const tick = () => {
      frame++;
      const resolved = Math.floor(frame / framesPerChar);
      if (resolved >= text.length) {
        setDisplay(text);
        return;
      }
      setDisplay(scramble(text, resolved));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, framesPerChar]);

  return <span className={className}>{display}</span>;
}
