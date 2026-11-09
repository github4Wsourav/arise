import { useState } from 'react';
import { systemAudio } from '../../audio/systemAudio';
import { SystemWindow } from '../../ui/SystemWindow';

export function AudioSettingsPanel() {
  const [musicOn, setMusicOn] = useState(() => systemAudio.getMusicEnabled());
  const [sfxOn, setSfxOn] = useState(() => systemAudio.getSfxEnabled());
  const [musicVol, setMusicVol] = useState(() => systemAudio.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(() => systemAudio.getSfxVolume());

  return (
    <SystemWindow label="THE SYSTEM AUDIO // SOUNDTRACK & SFX">
      <p className="intel-line system-text system-text--muted" style={{ marginBottom: 12 }}>
        Synthesized procedural sound engine powered by the Web Audio API. 100% offline, zero data usage.
      </p>

      {/* BGM Controls */}
      <div style={{ padding: '10px 12px', background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 4, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--aura-hi)' }}>
            🎵 SHADOW GATE AMBIENT BGM
          </span>
          <button
            className="log-btn"
            style={{ minHeight: 32, padding: '0 10px', fontSize: 11 }}
            onClick={() => {
              const next = !musicOn;
              systemAudio.setMusicEnabled(next);
              setMusicOn(next);
            }}
          >
            {musicOn ? 'BGM: PLAYING (TAP TO MUTE)' : 'BGM: MUTED (TAP TO START)'}
          </button>
        </div>
        <p className="intel-line system-text system-text--muted" style={{ fontSize: 11, margin: '4px 0 8px' }}>
          Dark dungeon drone with resonant filter sweeps and harmonic shimmer.
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--aura-hi)' }}>
            🔔 SYSTEM INTERFACE SFX
          </span>
          <button
            className="log-btn"
            style={{ minHeight: 32, padding: '0 10px', fontSize: 11 }}
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
          Crystal quest chimes, set logged confirmations, rest timer alarms, and level-up fanfares.
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

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="log-btn"
            style={{ flex: 1, minHeight: 36, fontSize: 10 }}
            onClick={() => systemAudio.playSystemChime()}
          >
            ▶ TEST QUEST CHIME
          </button>
          <button
            className="log-btn"
            style={{ flex: 1, minHeight: 36, fontSize: 10 }}
            onClick={() => systemAudio.playLevelUp()}
          >
            ▶ TEST LEVEL UP FANFARE
          </button>
          <button
            className="log-btn"
            style={{ flex: 1, minHeight: 36, fontSize: 10 }}
            onClick={() => systemAudio.playSetLogged()}
          >
            ▶ TEST SET BLIP
          </button>
        </div>
      </div>
    </SystemWindow>
  );
}
