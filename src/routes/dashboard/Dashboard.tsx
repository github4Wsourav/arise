import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { applyTierTheme, getManifest } from '../../character/manifest';
import { DOW_TO_KEY, SESSIONS, WEEK } from '../../data/program';
import { SYSTEM } from '../../data/strings';
import type { GameState } from '../../engine/types';
import { appendEvent } from '../../store/append';
import { dateIso, daysBetween } from '../../store/dates';
import { useGithubSyncConfig } from '../../store/githubSync';
import { useGameState } from '../../store/useGameState';
import { Art } from '../../ui/Art';
import { CharacterCard } from '../../ui/CharacterCard';
import { STAT_ICON } from '../../ui/icons';
import { PwaInstallBanner } from '../../ui/PwaInstallBanner';
import { RosterStrip } from '../../ui/RosterStrip';
import { StreakCalendar } from '../../ui/StreakCalendar';
import { Sparkles } from '../../ui/Sparkles';
import { SyncDot } from '../../ui/SyncDot';
import { SystemText } from '../../ui/SystemText';
import { SystemWindow } from '../../ui/SystemWindow';
import { QuestPanel } from './QuestPanel';

function TodayPanel({ state }: { state: GameState }) {
  const todayKey = DOW_TO_KEY[new Date().getDay()];
  const today = WEEK.find((d) => d.key === todayKey)!;

  if (today.type === 'gym' && today.session) {
    const session = SESSIONS[today.session];
    return (
      <SystemWindow label={SYSTEM.dashboard.todayGate} className="system-window--gate">
        <Art className="gate-art" src={`/assets/gates/${session.id}.webp`} />
        <h3 className="gate-name">{session.gateName}</h3>
        <p className="gate-focus">{session.focus}</p>
        <Link to="/gate/$sessionId" params={{ sessionId: session.id }} className="cta cta--link">
          {SYSTEM.dashboard.enterGate}
        </Link>
      </SystemWindow>
    );
  }

  if (today.type === 'work') {
    return (
      <SystemWindow label={SYSTEM.dashboard.mandatoryQuest}>
        {state.shiftConfirmedToday ? (
          <SystemText speed={0}>{SYSTEM.shift.confirmed}</SystemText>
        ) : (
          <button
            className="cta"
            onClick={() => void appendEvent('shift_confirmed', { date: dateIso() })}
          >
            {SYSTEM.shift.confirm}
          </button>
        )}
        <h4 className="window-label intel-label">[{SYSTEM.shift.intelLabel}]</h4>
        {SYSTEM.shift.intel.map((line) => (
          <p className="intel-line system-text system-text--muted" key={line}>
            · {line}
          </p>
        ))}
      </SystemWindow>
    );
  }

  return (
    <SystemWindow label="THE SANCTUARY">
      <SystemText speed={0}>{SYSTEM.dashboard.sanctuary}</SystemText>
      <p className="intel-line system-text system-text--muted">{SYSTEM.sanctuaryNote}</p>
    </SystemWindow>
  );
}

/** System commentary derived from state diffs: streak loss (vs last visit) + absences. */
function SystemCommentary({ state }: { state: GameState }) {
  const [severed, setSevered] = useState(false);

  useEffect(() => {
    const key = 'arise.streakWeeks';
    const prev = Number(localStorage.getItem(key) ?? '0');
    if (state.streakWeeks < prev) setSevered(true);
    localStorage.setItem(key, String(state.streakWeeks));
  }, [state.streakWeeks]);

  const away = state.lastTrainingDate ? daysBetween(state.lastTrainingDate, dateIso()) : 0;

  if (severed) return <SystemText>{SYSTEM.streakSevered}</SystemText>;
  if (away >= 4) return <SystemText>{SYSTEM.absence(away)}</SystemText>;
  return <SystemText>{SYSTEM.greeting(new Date().getHours())}</SystemText>;
}

export function Dashboard() {
  const state = useGameState();
  const manifest = getManifest();
  const ghConfig = useGithubSyncConfig();

  useEffect(() => {
    if (state) applyTierTheme(state.tierIndex, manifest);
  }, [state?.tierIndex, manifest]);

  if (!state) return null; // first IndexedDB read; sub-frame

  const tier = manifest.tiers[state.tierIndex];

  return (
    <main className="dashboard">
      <header className="app-header span-2">
        <Sparkles />
        <div className="app-header__side app-header__side--left">
          <Link to="/profile" className="profile-link system-text">
            [{SYSTEM.profile.link}]
          </Link>
        </div>
        <div className="app-header__center">
          <h1 className="app-title">{SYSTEM.appName}</h1>
          <div className="app-greeting">
            <SystemCommentary state={state} />
          </div>
        </div>
        <div className="app-header__side app-header__side--right">
          <SyncDot />
          <Link to="/settings" className="profile-link system-text">
            [{SYSTEM.settings.link}]
          </Link>
        </div>
      </header>

      <div className="span-2 aura-divider" aria-hidden="true">
        <span className="aura-divider__emblem" />
      </div>

      <div className="span-2" style={{ maxWidth: 860, margin: '0 auto', width: '100%', padding: '0 8px' }}>
        <PwaInstallBanner />
        {!ghConfig && (
          <div
            style={{
              padding: '6px 12px',
              margin: '0 0 12px',
              background: 'rgba(58, 120, 232, 0.08)',
              border: '1px solid rgba(58, 120, 232, 0.3)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ color: 'var(--fg)' }}>
              💾 ALL TRAINING PROGRESS SAVED LOCALLY ON THIS DEVICE. No account needed.
            </span>
            <Link to="/settings" style={{ color: 'var(--aura)', textDecoration: 'none', fontWeight: 'bold' }}>
              [OPTIONAL CLOUD SYNC]
            </Link>
          </div>
        )}
      </div>

      <div className="dash-main">
        <SystemWindow label="STATUS WINDOW">
          <CharacterCard state={state} manifest={manifest} />
        </SystemWindow>
      </div>

      <div className="dash-side">
        <RosterStrip />
        <TodayPanel state={state} />
        <QuestPanel state={state} />
        <SystemWindow label="HUNTER PROFILE">
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
          <p className="window-label" style={{ margin: '14px 0 0', textAlign: 'center' }}>
            {tier.arc}
          </p>
        </SystemWindow>
      </div>

      {/* desktop: tucks under the character to fill the column; mobile: stays last */}
      <div className="dash-cal">
        <StreakCalendar state={state} />
      </div>
    </main>
  );
}
