import { describe, expect, it } from 'vitest';
import { epley1RM, platesForWeight, warmupRamp } from '../plates';

describe('platesForWeight', () => {
  it('breaks down a barbell weight per side (greedy, heaviest first)', () => {
    expect(platesForWeight(100).perSide).toEqual([25, 15]); // (100-20)/2 = 40 = 25+15
    expect(platesForWeight(100).leftover).toBe(0);
  });
  it('reaches 2.5 kg increments with the small plates', () => {
    expect(platesForWeight(62.5).perSide).toEqual([20, 1.25]); // 21.25 = 20 + 1.25
    expect(platesForWeight(62.5).leftover).toBe(0);
  });
  it('is bar-only when the target is at or below the bar', () => {
    expect(platesForWeight(20).perSide).toEqual([]);
    expect(platesForWeight(15).perSide).toEqual([]);
  });
  it('reports the leftover for a weight the plates cannot make', () => {
    const r = platesForWeight(61); // (61-20)/2 = 20.5 → 20, 0.5 left over
    expect(r.perSide).toEqual([20]);
    expect(r.leftover).toBe(0.5);
  });
});

describe('warmupRamp', () => {
  it('ramps 40/60/80% rounded to 2.5 kg', () => {
    expect(warmupRamp(100)).toEqual([
      { weightKg: 40, reps: 8 },
      { weightKg: 60, reps: 5 },
      { weightKg: 80, reps: 3 },
    ]);
  });
  it('is empty for very light work weights', () => {
    expect(warmupRamp(15)).toEqual([]);
  });
  it('keeps the steps strictly increasing and below the work weight', () => {
    expect(warmupRamp(25).map((s) => s.weightKg)).toEqual([10, 15, 20]);
  });
});

describe('epley1RM', () => {
  it('returns the weight itself for a single rep', () => {
    expect(epley1RM(100, 1)).toBe(100);
  });
  it('estimates with the Epley formula, rounded to 0.5', () => {
    expect(epley1RM(100, 5)).toBe(116.5); // 100 * (1 + 5/30) = 116.66 → 116.5
  });
  it('caps reps at 12 so long sets do not over-estimate', () => {
    expect(epley1RM(60, 20)).toBe(epley1RM(60, 12));
  });
});
