import type { GameState } from '../../engine/types';
import { SYSTEM } from '../../data/strings';
import { STAT_ICON } from '../../ui/icons';
import { SystemWindow } from '../../ui/SystemWindow';

/** The four derived stats with their raw XP pools — the build your training chose. */
export function StatPanel({ state }: { state: GameState }) {
  return (
    <SystemWindow label={SYSTEM.profile.stats}>
      <div className="stat-row">
        {(['str', 'vit', 'agi', 'rec'] as const).map((k) => {
          const Icon = STAT_ICON[k];
          return (
            <div className="stat-cell" key={k}>
              <Icon className="stat-icon" />
              <div className="k">{SYSTEM.stats[k]}</div>
              <div className="v">{state.stats[k]}</div>
            </div>
          );
        })}
      </div>
      <p className="stat-pools">
        {(['str', 'vit', 'agi', 'rec'] as const)
          .map((k) => `${SYSTEM.stats[k]} ${Math.round(state.statPools[k])} XP`)
          .join(' · ')}
      </p>
    </SystemWindow>
  );
}
