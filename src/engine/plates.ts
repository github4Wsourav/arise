/**
 * Pure gym math helpers (no state): barbell plate loading + a warm-up ramp.
 * Used by the set logger as in-gym utilities.
 */

/** Standard kg plates, heaviest first. */
const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

export interface PlateLoad {
  /** plates for ONE side of the bar, heaviest first */
  perSide: number[];
  /** kg per side that couldn't be made from available plates (rounding) */
  leftover: number;
  barKg: number;
}

/** Greedy plate breakdown for a target total weight on a barbell. */
export function platesForWeight(targetKg: number, barKg = 20, plates = PLATES): PlateLoad {
  let side = (targetKg - barKg) / 2;
  const perSide: number[] = [];
  if (side > 0) {
    for (const p of plates) {
      while (side + 1e-9 >= p) {
        perSide.push(p);
        side -= p;
      }
    }
  }
  return { perSide, leftover: Math.max(0, Math.round(side * 100) / 100), barKg };
}

export interface WarmupSet {
  weightKg: number;
  reps: number;
}

/** Epley estimated 1-rep max, rounded to 0.5 kg. Reps are capped at 12 — the
 *  formula drifts high on long sets, so we keep the estimate honest. */
export function epley1RM(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return Math.round(weightKg * (1 + Math.min(reps, 12) / 30) * 2) / 2;
}

/** A light ramp up to the working weight (40/60/80%), rounded to 2.5 kg. */
export function warmupRamp(workKg: number): WarmupSet[] {
  if (workKg < 20) return [];
  const round = (w: number) => Math.round(w / 2.5) * 2.5;
  const steps: Array<[number, number]> = [
    [0.4, 8],
    [0.6, 5],
    [0.8, 3],
  ];
  const out: WarmupSet[] = [];
  for (const [f, reps] of steps) {
    const weightKg = round(workKg * f);
    if (weightKg > 0 && weightKg < workKg && (out.length === 0 || weightKg > out[out.length - 1].weightKg)) {
      out.push({ weightKg, reps });
    }
  }
  return out;
}
