/**
 * Endgame content: boss short-names and relic naming. Content layer only — the
 * engine derives WHICH bosses/relics exist; this file decides what they're called.
 */
import type { Relic } from '../engine/types';
import { SESSIONS } from './program';

/** Short battle-names per exercise: "THE BENCH COLOSSUS", not the full catalog name. */
export const BOSS_SHORT_NAMES: Record<string, string> = {
  bench: 'BENCH',
  dbpress: 'SHOULDER PRESS',
  incline: 'INCLINE',
  lateral: 'LATERAL',
  ohext: 'TRICEPS',
  pushdown: 'ROPE',
  pulldown: 'LAT',
  chestrow: 'ROW',
  cablerow: 'CABLE ROW',
  facepull: 'FACE PULL',
  ezcurl: 'CURL',
  hammer: 'HAMMER',
  legpress: 'LEG PRESS',
  split: 'SPLIT SQUAT',
  legcurl: 'LEG CURL',
  legext: 'EXTENSION',
  hipthrust: 'HIP THRUST',
  calf: 'CALF',
};

export function bossShortName(exerciseId: string): string {
  return BOSS_SHORT_NAMES[exerciseId] ?? exerciseId.toUpperCase();
}

/** Hand-named relics for storied milestones; everything else gets a generated sigil. */
const NAMED_RELICS: Record<string, string> = {
  'legpress:100': 'IRON BOOTS',
  'bench:100': 'CRIMSON STANDARD',
  'hipthrust:100': 'TITANSPINE',
};

export function relicName(relic: Relic): string {
  switch (relic.kind) {
    case 'streak10':
      return 'GATEBREAKER SIGIL';
    case 'import':
      return 'IMPORTED SOUL';
    case 'pr': {
      const named = NAMED_RELICS[`${relic.exerciseId}:${relic.milestone}`];
      if (named) return named;
      const exercise =
        Object.values(SESSIONS)
          .flatMap((s) => s.exercises)
          .find((e) => e.id === relic.exerciseId)?.name ?? relic.exerciseId;
      return `${relic.milestone} KG SIGIL — ${exercise.toUpperCase()}`;
    }
  }
}

export function relicKey(relic: Relic): string {
  return relic.kind === 'pr' ? `pr:${relic.exerciseId}:${relic.milestone}` : relic.kind;
}

/**
 * Filename key for a relic's artwork — `public/assets/relics/<key>.webp`. Storied relics
 * (streak, import, hand-named PRs) get their own image; ordinary PR milestones share one
 * sigil per session type, so the whole art set is small. Missing files fall back to the
 * procedural glyph in the UI, so art can be added one at a time.
 */
export function relicImageKey(relic: Relic): string {
  if (relic.kind === 'streak10') return 'streak10';
  if (relic.kind === 'import') return 'import';
  const id = `${relic.exerciseId}:${relic.milestone}`;
  if (id in NAMED_RELICS) return `pr-${relic.exerciseId}-${relic.milestone}`;
  const session = Object.values(SESSIONS).find((s) =>
    s.exercises.some((e) => e.id === relic.exerciseId),
  );
  return `pr-${session?.id ?? 'generic'}`;
}
