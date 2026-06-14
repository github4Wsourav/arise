import { useState } from 'react';
import { SYSTEM } from '../data/strings';
import { platesForWeight, warmupRamp } from '../engine/plates';

/**
 * In-gym helpers under the set logger: the plate loadout per side (barbell lifts
 * only) for the weight you're about to log, and a collapsible warm-up ramp.
 */
export function PlateTools({ weightKg, barbell }: { weightKg: number; barbell: boolean }) {
  const [openWarmup, setOpenWarmup] = useState(false);
  const warm = warmupRamp(weightKg);
  const load = barbell ? platesForWeight(weightKg) : null;
  if (!load && warm.length === 0) return null;

  return (
    <div className="plate-tools">
      {load && (
        <p className="plate-load">
          <span className="plate-load-k">{SYSTEM.gate.load}</span>{' '}
          {load.perSide.length ? (
            <>
              {load.perSide.join(' · ')} <small>/side · {load.barKg} kg bar</small>
            </>
          ) : (
            <small>bar only</small>
          )}
          {load.leftover > 0 && <small> (+{load.leftover} short)</small>}
        </p>
      )}
      {warm.length > 0 && (
        <div className="warmup">
          <button type="button" className="warmup-toggle" onClick={() => setOpenWarmup((v) => !v)}>
            {SYSTEM.gate.warmup} {openWarmup ? '▴' : '▾'}
          </button>
          {openWarmup && (
            <div className="warmup-sets">
              {warm.map((w, i) => (
                <span className="warmup-set" key={i}>
                  {w.weightKg}
                  <small>kg</small> × {w.reps}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
