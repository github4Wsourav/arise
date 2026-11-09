import { useState } from 'react';
import { systemAudio } from '../../audio/systemAudio';
import { SystemWindow } from '../../ui/SystemWindow';

export function AudioSettingsPanel() {
  const [musicOn, setMusicOn] = useState(() => systemAudio.getMusicEnabled());
  const [sfxOn, setSfxOn] = useState(() => systemAudio.getSfxEnabled());
  const [musicVol, setMusicVol] = useState(() => systemAudio.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(() => systemAudio.getSfxVolume());

  return (
    <SystemWindow label="THE SYSTEM AUDIO // GYM SOUNDTRACK & SFX">
      <p className="intel-line system-text system-text--muted" style={{ marginBottom: 12 }}>
        High-energy procedural Web Audio engine synthesized on your device. Zero lag, zero network data, 100% offline.
      </p>

      {/* BGM Controls */}
      <div style={{ padding: '10px 12px', background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 4, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--aura-hi)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>⚡</span> CYBER DRIVE (126 BPM GYM BEAT)
          </span>
          <button
            className="log-btn"
            style={{
              minHeight: 32,
              padding: '0 12px',
              fontSize: 11,
              background: musicOn ? 'var(--aura)' : 'var(--panel-3)',
              color: musicOn ? '#000' : 'var(--ink)',
            }}
            onClick={() => {
              const next = !musicOn;
              systemAudio.setMusicEnabled(next);
              setMusicOn(next);
            }}
          >
            {musicOn ? '■ STOP BEAT' : '▶ START WORKOUT BEAT'}
          </button>
        </div>
        <p className="intel-line system-text system-text--muted" style={{ fontSize: 11, margin: '4px 0 8px' }}>
          Motivating 126 BPM workout beat with punchy kick drums, rolling 16th cyber bassline, crisp hats, and heroic synth arps.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>VOLUME:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVol}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              systemAudio.setMusicVolume(val);
              setMusicVol(val);
            }}
            style={{ flex: 1, accentColor: 'var(--aura)' }}
          />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 35 }}>{Math.round(musicVol * 100)}%</span>
        </div>
      </div>

      {/* SFX Controls */}
      <div style={{ padding: '10px 12px', background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--aura-hi)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>🔔</span> SYSTEM HOLOGRAPHIC SFX
          </span>
          <button
            className="log-btn"
            style={{
              minHeight: 32,
              padding: '0 12px',
              fontSize: 11,
              background: sfxOn ? 'rgba(31, 203, 184, 0.2)' : 'var(--panel-3)',
              borderColor: sfxOn ? 'var(--aura)' : 'var(--line)',
            }}
            onClick={() => {
              const next = !sfxOn;
              systemAudio.setSfxEnabled(next);
              setSfxOn(next);
              if (next) systemAudio.playSystemChime();
            }}
          >
            {sfxOn ? 'SFX: ACTIVE' : 'SFX: MUTED'}
          </button>
        </div>
        <p className="intel-line system-text system-text--muted" style={{ fontSize: 11, margin: '4px 0 8px' }}>
          Varied tactical audio cues: weight plate rack, round buzzer, quest chime, and level-up fanfare.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>VOLUME:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVol}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              systemAudio.setSfxVolume(val);
              setSfxVol(val);
            }}
            style={{ flex: 1, accentColor: 'var(--aura)' }}
          />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', minWidth: 35 }}>{Math.round(sfxVol * 100)}%</span>
        </div>

        {/* SFX Preview Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          <button
            className="log-btn"
            style={{ minHeight: 36, fontSize: 10, padding: '0 6px' }}
            onClick={() => systemAudio.playSetLogged()}
            title="Weight plate lock & mechanical clack"
          >
            🔩 SET LOGGED (WEIGHT CLINK)
          </button>
          <button
            className="log-btn"
            style={{ minHeight: 36, fontSize: 10, padding: '0 6px' }}
            onClick={() => systemAudio.playRestDone()}
            title="Boxing round buzzer & ready chime"
          >
            ⏰ REST TIMER (ROUND BELL)
          </button>
          <button
            className="log-btn"
            style={{ minHeight: 36, fontSize: 10, padding: '0 6px' }}
            onClick={() => systemAudio.playSystemChime()}
            title="Solo Leveling crystal notification chime"
          >
            💎 SYSTEM ALERT CHIME
          </button>
          <button
            className="log-btn"
            style={{ minHeight: 36, fontSize: 10, padding: '0 6px' }}
            onClick={() => systemAudio.playLevelUp()}
            title="Heroic power surge & ascending fanfare"
          >
            ⬆ LEVEL UP (POWER SURGE)
          </button>
          <button
            className="log-btn"
            style={{ minHeight: 36, fontSize: 10, padding: '0 6px' }}
            onClick={() => systemAudio.playGateClear()}
            title="Gate cleared triumphant victory chord"
          >
            🏆 GATE CLEARED (VICTORY)
          </button>
        </div>
      </div>
    </SystemWindow>
  );
}
