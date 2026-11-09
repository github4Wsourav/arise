import { useEffect, useState } from 'react';
import { systemAudio } from '../audio/systemAudio';
import { SYSTEM } from '../data/strings';
import { stopRest, useRest } from '../store/restTimer';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** A slim fixed bar that counts down the programmed rest after a logged set. */
export function RestTimer() {
  const { endsAt, total } = useRest();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;
    setNow(Date.now());
    const tick = setInterval(() => setNow(Date.now()), 250);

    const ms = endsAt - Date.now();
    const alarm =
      ms > 0
        ? setTimeout(() => {
            systemAudio.playRestDone();
          }, ms)
        : undefined;

    return () => {
      clearInterval(tick);
      if (alarm) clearTimeout(alarm);
    };
  }, [endsAt]);

  if (!endsAt) return null;
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const done = remaining === 0;
  const pct = total ? Math.max(0, (remaining / total) * 100) : 0;

  return (
    <div className={`rest-timer${done ? ' rest-timer--done' : ''}`} role="timer" aria-live="polite">
      <div className="rest-fill" style={{ width: `${pct}%` }} />
      <span className="rest-label">{done ? SYSTEM.gate.restDone : SYSTEM.gate.restLabel}</span>
      {!done && <span className="rest-time">{fmt(remaining)}</span>}
      <button type="button" className="rest-dismiss" onClick={stopRest} aria-label="dismiss timer">
        ×
      </button>
    </div>
  );
}
