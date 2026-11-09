import { useState } from 'react';
import { systemAudio } from '../audio/systemAudio';

export function AudioToggle() {
  const [musicOn, setMusicOn] = useState(() => systemAudio.getMusicEnabled());

  const toggleMusic = () => {
    const next = !musicOn;
    systemAudio.setMusicEnabled(next);
    setMusicOn(next);
    if (next) {
      systemAudio.playSystemChime();
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="profile-link system-text"
      style={{
        background: musicOn ? 'rgba(31, 203, 184, 0.15)' : 'transparent',
        border: musicOn ? '1px solid var(--aura)' : '1px solid var(--line)',
        borderRadius: 4,
        padding: '3px 8px',
        fontSize: 11,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        color: musicOn ? 'var(--aura-hi)' : 'var(--muted)',
        textShadow: musicOn ? '0 0 6px var(--aura)' : 'none',
      }}
      title="Toggle Dark Ambient Dungeon Music (Solo Leveling Soundscape)"
    >
      <span>{musicOn ? '🔊' : '🔇'}</span>
      <span>{musicOn ? 'BGM: ON' : 'BGM: OFF'}</span>
    </button>
  );
}
