import { useEffect, useState } from 'react';
import type { GameState } from '../../engine/types';
import { SYSTEM } from '../../data/strings';
import { appendEvent } from '../../store/append';
import { dateIso } from '../../store/dates';
import { Sparkline } from '../../ui/Sparkline';
import { SystemWindow } from '../../ui/SystemWindow';

const SITES = [
  { key: 'waist', label: 'WAIST' },
  { key: 'chest', label: 'CHEST' },
  { key: 'arm', label: 'ARM' },
  { key: 'thigh', label: 'THIGH' },
] as const;

/** Body-measurement tracking (cm) per site — charts-only, last-write-wins per day. */
export function MeasurementsPanel({ state }: { state: GameState }) {
  const today = dateIso();
  const [site, setSite] = useState<string>('waist');
  const [cm, setCm] = useState(80);

  // when the site changes, seed the stepper from that site's latest entry
  useEffect(() => {
    const series = state.measurements[site] ?? [];
    setCm(series[series.length - 1]?.cm ?? 80);
  }, [site, state.measurements]);

  return (
    <SystemWindow label={SYSTEM.profile.measurements}>
      {SITES.map((s) => {
        const series = state.measurements[s.key] ?? [];
        const last = series[series.length - 1];
        return (
          <div className="record-row" key={s.key}>
            <div className="record-meta">
              <p className="record-name">{s.label}</p>
              <p className="record-line">{last ? `${last.cm} cm · ${last.date}` : '—'}</p>
            </div>
            {series.length > 1 && <Sparkline values={series.map((x) => x.cm)} />}
          </div>
        );
      })}

      <div className="site-chips">
        {SITES.map((s) => (
          <button
            type="button"
            key={s.key}
            className={`site-chip${site === s.key ? ' site-chip--on' : ''}`}
            onClick={() => setSite(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="quest-bw">
        <span className="quest-title">{SITES.find((s) => s.key === site)?.label}</span>
        <div className="stepper">
          <button onClick={() => setCm((v) => Math.max(20, Math.round((v - 0.5) * 2) / 2))} aria-label="-0.5 cm">
            −
          </button>
          <span className="stepper-value">
            {cm.toFixed(1)}&nbsp;<small>cm</small>
          </span>
          <button onClick={() => setCm((v) => Math.round((v + 0.5) * 2) / 2)} aria-label="+0.5 cm">
            ＋
          </button>
        </div>
        <button className="log-btn" onClick={() => void appendEvent('measurement_logged', { site, cm, date: today })}>
          {SYSTEM.bodyweight.log}
        </button>
      </div>
    </SystemWindow>
  );
}
