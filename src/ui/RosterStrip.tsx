import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { DOW_TO_KEY, SESSIONS, WEEK } from '../data/program';
import { SYSTEM } from '../data/strings';
import { addDays, dateIso, mondayOf } from '../store/dates';

const GATES = Object.values(SESSIONS); // push · pull · legs

/**
 * The 7-day roster, now interactive: tap any day (today or earlier) to open a gate
 * picker for that date — shifts move, so you can run any gate on any past day and the
 * engine recomputes from the dated events. Future days are locked.
 */
export function RosterStrip() {
  const today = dateIso();
  const monday = mondayOf();
  const todayKey = DOW_TO_KEY[new Date().getDay()];
  const [openDate, setOpenDate] = useState<string | null>(null);

  return (
    <div className="roster-block">
      <div className="roster" aria-label={SYSTEM.roster.label}>
        {WEEK.map((day, i) => {
          const date = dateIso(addDays(monday, i));
          const isToday = day.key === todayKey;
          const isFuture = date > today;
          return (
            <button
              key={day.key}
              type="button"
              disabled={isFuture}
              onClick={() => setOpenDate((d) => (d === date ? null : date))}
              className={[
                'roster-chip',
                day.type === 'gym' && 'roster-chip--gym',
                day.type === 'work' && 'roster-chip--work',
                isToday && 'roster-chip--today',
                openDate === date && 'roster-chip--open',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isToday ? 'date' : undefined}
            >
              <span className="dow">{day.dow}</span>
              <span>{day.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {openDate && (
          <motion.div
            key="gate-picker"
            className="gate-picker"
            initial={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12, paddingTop: 16, paddingBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="window-label gate-picker-label">[{SYSTEM.roster.pick(openDate)}]</p>
            <div className="gate-picker-options">
              {GATES.map((g) => (
                <Link
                  key={g.id}
                  to="/gate/$sessionId"
                  params={{ sessionId: g.id }}
                  search={{ date: openDate }}
                  className="gate-picker-btn"
                  onClick={() => setOpenDate(null)}
                >
                  {g.gateName}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
