import { useState } from 'react';
import type { GameState } from '../../engine/types';
import { SYSTEM } from '../../data/strings';
import { appendEvent } from '../../store/append';
import { dateIso } from '../../store/dates';
import { SystemWindow } from '../../ui/SystemWindow';

/** Goal → daily calorie offset from rough active maintenance (bw × 33 kcal/kg). */
const GOALS = [
  { key: 'cut', label: 'CUT', offset: -400 },
  { key: 'maintain', label: 'MAINTAIN', offset: 0 },
  { key: 'bulk', label: 'BULK', offset: 300 },
] as const;

function targets(bwKg: number, offset: number) {
  return {
    protein: Math.round(bwKg * 2.0), // g — ~2 g/kg
    kcal: Math.round(bwKg * 33) + offset, // rough active maintenance + goal
  };
}

function Row({
  label,
  unit,
  value,
  target,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  target: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div className="prov-row">
      <div className="prov-row-head">
        <span className="prov-k">{label}</span>
        <span className="prov-v">
          {value} / {target} <small>{unit}</small>
        </span>
      </div>
      <div className="prov-bar">
        <div className="prov-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="stepper prov-stepper">
        <button onClick={() => onChange(Math.max(0, value - step))} aria-label={`-${step} ${unit}`}>
          −
        </button>
        <span className="stepper-value">
          {value}&nbsp;<small>{unit}</small>
        </span>
        <button onClick={() => onChange(value + step)} aria-label={`+${step} ${unit}`}>
          ＋
        </button>
      </div>
    </div>
  );
}

/** Nutrition targets (from bodyweight + goal) and a simple daily protein/calorie log. */
export function ProvisionsPanel({ state }: { state: GameState }) {
  const today = dateIso();
  const bw = state.bodyweights[state.bodyweights.length - 1]?.kg ?? 75;
  const [goal, setGoal] = useState<string>(() => localStorage.getItem('arise.goal') ?? 'maintain');
  const goalDef = GOALS.find((g) => g.key === goal) ?? GOALS[1];
  const tgt = targets(bw, goalDef.offset);

  const todayN = state.nutrition.find((n) => n.date === today);
  const [protein, setProtein] = useState(() => todayN?.protein ?? 0);
  const [kcal, setKcal] = useState(() => todayN?.kcal ?? 0);

  const pickGoal = (g: string) => {
    setGoal(g);
    localStorage.setItem('arise.goal', g);
  };

  return (
    <SystemWindow label={SYSTEM.profile.provisions}>
      <div className="site-chips">
        {GOALS.map((g) => (
          <button
            type="button"
            key={g.key}
            className={`site-chip${goal === g.key ? ' site-chip--on' : ''}`}
            onClick={() => pickGoal(g.key)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <p className="prov-note system-text system-text--muted">
        [TARGET FROM {bw.toFixed(1)} KG · {goalDef.label}]
      </p>

      <Row label="PROTEIN" unit="g" value={protein} target={tgt.protein} step={10} onChange={setProtein} />
      <Row label="CALORIES" unit="kcal" value={kcal} target={tgt.kcal} step={50} onChange={setKcal} />

      <button
        className="log-btn prov-log-btn"
        onClick={() => void appendEvent('nutrition_logged', { kcal, protein, date: today })}
      >
        {SYSTEM.bodyweight.log} TODAY
      </button>
    </SystemWindow>
  );
}
