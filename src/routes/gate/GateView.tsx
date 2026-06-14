import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { bossEpithet } from '../../engine/bosses';
import { bossShortName } from '../../data/endgame';
import { reduce } from '../../engine/reduce';
import { SESSIONS } from '../../data/program';
import { SYSTEM } from '../../data/strings';
import { sessionActivation } from '../../data/types';
import { getManifest } from '../../character/manifest';
import { engineCfg, useEvents } from '../../store/useGameState';
import { appendEvent } from '../../store/append';
import { dateIso } from '../../store/dates';
import { BodyHeatmap } from '../../body/BodyHeatmap';
import { Art } from '../../ui/Art';
import { RestTimer } from '../../ui/RestTimer';
import { SystemText } from '../../ui/SystemText';
import { ExerciseCard } from './ExerciseCard';
import { TallyScreen } from './TallyScreen';

export function GateView() {
  const { sessionId } = useParams({ from: '/gate/$sessionId' });
  const { date: dateParam } = useSearch({ from: '/gate/$sessionId' });
  const date = dateParam ?? dateIso();
  const isPast = date !== dateIso();
  const session = SESSIONS[sessionId];
  const events = useEvents();
  const navigate = useNavigate();
  const manifest = getManifest();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tallyOpen, setTallyOpen] = useState(false);

  // derive the gate's state AS OF `date` — reduce already buckets sessions by date,
  // so a past day exposes its own sets + the session before it for prefill/grading.
  const state = useMemo(
    () => (events ? reduce(events, engineCfg(), date) : undefined),
    [events, date],
  );

  const activation = useMemo(() => {
    if (!session) return {};
    const focused = session.exercises.find((e) => e.id === expanded);
    return focused ? focused.activation : sessionActivation(session);
  }, [session, expanded]);

  if (!session) return <main>[UNKNOWN GATE]</main>;
  if (!state) return null;

  const tier = manifest.tiers[state.tierIndex];
  const isDone = (id: string) =>
    (state.todayByExercise[id]?.sets.length ?? 0) >= (SESSIONS[sessionId].exercises.find((e) => e.id === id)?.scheme.sets ?? Infinity);
  const doneCount = session.exercises.filter((e) => isDone(e.id)).length;
  const allDone = doneCount === session.exercises.length;
  const cleared = state.clearedToday.includes(sessionId);

  const clearGate = async () => {
    await appendEvent('gate_cleared', { sessionId, sessionDate: date });
    // editing a past day saves quietly (no tally/ceremony for an old clear)
    if (isPast) void navigate({ to: '/' });
    else setTallyOpen(true);
  };

  return (
    <main className="gate">
      <RestTimer />
      <header className="gate-head">
        <Link to="/" className="gate-back system-text system-text--muted">
          {SYSTEM.gate.back}
        </Link>
        <span className="rank-badge">{tier.id.toUpperCase()}</span>
      </header>
      <Art className="gate-hero" src={`/assets/gates/${session.id}.webp`} />
      <h1 className="gate-name">{session.gateName}</h1>
      {isPast && <p className="system-text editing-banner">[{SYSTEM.roster.editing(date)}]</p>}
      <SystemText>{session.why.toUpperCase()}</SystemText>
      {state.pendingBosses
        .filter((b) => b.sessionId === sessionId)
        .map((b) => (
          <p className="system-text boss-banner" key={b.exerciseId}>
            [{SYSTEM.boss.banner(bossShortName(b.exerciseId), bossEpithet(sessionId), b.milestone, b.repsLo)}]
          </p>
        ))}

      <BodyHeatmap
        activation={activation}
        focusLabel={expanded ? session.exercises.find((e) => e.id === expanded)?.name ?? '' : `GATE: ${session.gateName}`}
      />

      <div className="exercise-list">
        {session.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            expanded={expanded === ex.id}
            done={isDone(ex.id)}
            onToggle={() => setExpanded(expanded === ex.id ? null : ex.id)}
            prev={state.prevByExercise[ex.id]}
            today={state.todayByExercise[ex.id]}
            date={date}
          />
        ))}
      </div>

      <footer className="gate-foot">
        <div className="gate-progress">
          <div className="gate-progress-fill" style={{ width: `${(doneCount / session.exercises.length) * 100}%` }} />
        </div>
        <p className="system-text system-text--muted">[{SYSTEM.gate.progress(doneCount, session.exercises.length)}]</p>
        {cleared ? (
          <button type="button" className="cta" onClick={() => setTallyOpen(true)}>
            {SYSTEM.gate.viewTally}
          </button>
        ) : (
          <button type="button" className="cta" disabled={!allDone} onClick={() => void clearGate()}>
            {SYSTEM.gate.clearGate}
          </button>
        )}
      </footer>

      {tallyOpen && <TallyScreen sessionId={sessionId} date={date} onClose={() => setTallyOpen(false)} />}
    </main>
  );
}
