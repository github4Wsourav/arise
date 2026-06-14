/**
 * The streak, made visible: a ~13-week training heatmap (GitHub-style), derived
 * straight from `trainingDates` + the weekly roster. No new state — it can never
 * disagree with the engine. Each cell is one day, coloured by what happened:
 *   trained · honored rest · scheduled shift · missed gym day · future.
 */
import { useMemo } from 'react';
import type { GameState } from '../engine/types';
import { WEEK, DOW_TO_KEY } from '../data/program';
import { SYSTEM } from '../data/strings';
import { addDays, dateIso, mondayOf } from '../store/dates';
import { SystemWindow } from './SystemWindow';
import { IconFlame } from './icons';

type Status = 'trained' | 'rest' | 'work' | 'missed' | 'future';

const DAY_TYPE: Record<string, 'gym' | 'work' | 'rest'> = Object.fromEntries(
  WEEK.map((d) => [d.key, d.type]),
);

function rosterType(d: Date): 'gym' | 'work' | 'rest' {
  return DAY_TYPE[DOW_TO_KEY[d.getDay()]] ?? 'rest';
}

const STATUS_LABEL: Record<Status, string> = {
  trained: SYSTEM.record.trained,
  rest: SYSTEM.record.rest,
  work: SYSTEM.record.shift,
  missed: SYSTEM.record.missed,
  future: '—',
};

export function StreakCalendar({ state, weeks = 13 }: { state: GameState; weeks?: number }) {
  const cols = useMemo(() => {
    const trained = new Set(state.trainingDates);
    const today = dateIso();
    const start = mondayOf(addDays(new Date(), -7 * (weeks - 1)));
    return Array.from({ length: weeks }, (_, w) =>
      Array.from({ length: 7 }, (_, row) => {
        const date = addDays(start, w * 7 + row);
        const iso = dateIso(date);
        let status: Status;
        if (iso > today) status = 'future';
        else if (trained.has(iso)) status = 'trained';
        else {
          const t = rosterType(date);
          status = t === 'gym' ? 'missed' : t === 'work' ? 'work' : 'rest';
        }
        return { iso, status };
      }),
    );
  }, [state.trainingDates, weeks]);

  const legend: Status[] = ['trained', 'rest', 'work', 'missed'];

  return (
    <SystemWindow label={SYSTEM.record.label}>
      <div className="streak-head">
        <div className="streak-stat streak-stat--flame">
          <IconFlame size={22} />
          <span className="streak-big">{state.streakWeeks}</span>
          <span className="streak-cap">{SYSTEM.record.streak}</span>
        </div>
        <div className="streak-stat">
          <span className="streak-big">×{state.multiplier.toFixed(1)}</span>
          <span className="streak-cap">{SYSTEM.record.multiplier}</span>
        </div>
        <div className="streak-stat">
          <span className="streak-big">{state.maxStreakWeeks}</span>
          <span className="streak-cap">{SYSTEM.record.best}</span>
        </div>
      </div>

      <div className="cal-grid" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
        {cols.map((col, w) =>
          col.map((c, r) => (
            <span
              key={c.iso}
              className={`cal-cell cal-cell--${c.status}`}
              style={{ gridColumn: w + 1, gridRow: r + 1, animationDelay: `${(w * 7 + r) * 6}ms` }}
              title={SYSTEM.record.cell(c.iso, STATUS_LABEL[c.status])}
            />
          )),
        )}
      </div>

      <div className="cal-legend">
        {legend.map((s) => (
          <span className="cal-legend-item" key={s}>
            <i className={`cal-cell cal-cell--${s}`} />
            {STATUS_LABEL[s]}
          </span>
        ))}
      </div>
    </SystemWindow>
  );
}
