import { useState } from 'react';
import type { GameState, Relic } from '../../engine/types';
import { relicImageKey, relicKey, relicName } from '../../data/endgame';
import { SYSTEM } from '../../data/strings';
import { SystemWindow } from '../../ui/SystemWindow';

const GLYPHS: Record<string, string> = { pr: '◆', streak10: '⟁', import: '✦' };

/** Relic artwork if its file exists, else the procedural glyph. */
function RelicMedia({ relic }: { relic: Relic }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="relic-glyph">{GLYPHS[relic.kind]}</span>;
  return (
    <img
      className="relic-glyph relic-img"
      src={`/assets/relics/${relicImageKey(relic)}.webp`}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
    />
  );
}

/** The trophy case — every relic is a derived fact; nothing here can be lost. */
export function RelicGrid({ state }: { state: GameState }) {
  return (
    <SystemWindow label={SYSTEM.relics.label}>
      {state.relics.length === 0 ? (
        <p className="system-text system-text--muted">[{SYSTEM.relics.empty}]</p>
      ) : (
        <ul className="relic-grid">
          {state.relics.map((r) => (
            <li className="relic" key={relicKey(r)}>
              <RelicMedia relic={r} />
              <span className="relic-name">{relicName(r)}</span>
              {r.kind === 'pr' && <span className="relic-date">{r.date}</span>}
            </li>
          ))}
        </ul>
      )}
    </SystemWindow>
  );
}
