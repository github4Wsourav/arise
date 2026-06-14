/**
 * Tiny rest-timer store (UI only — no events, no game state). SetLogger calls
 * startRest(restSec) when a set is logged; the RestTimer bar counts it down.
 */
import { useSyncExternalStore } from 'react';

interface RestState {
  endsAt: number; // epoch ms when rest ends, 0 = idle
  total: number; // seconds, for the progress bar
}

let state: RestState = { endsAt: 0, total: 0 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function startRest(seconds: number): void {
  if (!seconds || seconds <= 0) return;
  state = { endsAt: Date.now() + seconds * 1000, total: seconds };
  emit();
}

export function stopRest(): void {
  if (!state.endsAt) return;
  state = { endsAt: 0, total: 0 };
  emit();
}

export function useRest(): RestState {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
  );
}
