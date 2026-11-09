import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reduce } from '../../engine/reduce';
import { TIERS, makeProgram } from '../../engine/__tests__/fixtures';
import type { AriseEvent, EventType, PayloadFor } from '../../engine/types';
import { AriseDB, type StoredEvent } from '../db';
import { syncOnce, type ServerEventRow } from '../syncCore';
import { createGithubTransport } from '../githubSync';

const cfg = { program: makeProgram(), tiers: TIERS };

let n = 0;
let dbSeq = 0;
const newDb = () => new AriseDB(`gh-sync-test-${++dbSeq}`);

function stored<T extends EventType>(
  device: string,
  type: T,
  payload: PayloadFor<T>,
  occurredAt: string,
): StoredEvent {
  n += 1;
  return {
    id: String(n).padStart(8, '0'),
    userId: 'gh:testuser',
    deviceId: device,
    type,
    payload,
    occurredAt,
    schemaVersion: 1,
    synced: 0,
  };
}

async function stateOf(db: AriseDB) {
  const events = (await db.events.toArray()) as AriseEvent[];
  return reduce(events, cfg, '2026-06-08');
}

beforeEach(() => {
  n = 0;
  vi.restoreAllMocks();
});

describe('createGithubTransport & Gist sync convergence', () => {
  it('synchronizes events across two devices through simulated Gist API', async () => {
    // In-memory mock of GitHub Gist store
    let gistContent: { rows: ServerEventRow[] } = { rows: [] };

    // Mock global fetch to simulate api.github.com/gists/gist-123
    global.fetch = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = String(url);

      if (urlStr.includes('/gists/gist-123') && (!init || init.method === 'GET' || !init.method)) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            files: {
              'arise-system-data.json': {
                content: JSON.stringify(gistContent),
              },
            },
          }),
        } as Response;
      }

      if (urlStr.includes('/gists/gist-123') && init?.method === 'PATCH') {
        const body = JSON.parse(init.body as string);
        const fileContent = body.files['arise-system-data.json'].content;
        gistContent = JSON.parse(fileContent);
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'gist-123', html_url: 'https://gist.github.com/gist-123' }),
        } as Response;
      }

      return { ok: false, status: 404 } as Response;
    });

    const phoneTransport = createGithubTransport('test-token', 'gist-123', 'testuser');
    const laptopTransport = createGithubTransport('test-token', 'gist-123', 'testuser');

    const phoneDb = newDb();
    const laptopDb = newDb();

    // 1. Phone logs a workout while at the gym
    await phoneDb.events.add(
      stored('phone', 'set_logged', { exerciseId: 'bench', weightKg: 80, reps: 5, sessionDate: '2026-06-01', setIndex: 0 }, '2026-06-01T10:00:00Z'),
    );
    await phoneDb.events.add(
      stored('phone', 'set_logged', { exerciseId: 'bench', weightKg: 80, reps: 5, sessionDate: '2026-06-01', setIndex: 1 }, '2026-06-01T10:03:00Z'),
    );
    await phoneDb.events.add(
      stored('phone', 'set_logged', { exerciseId: 'bench', weightKg: 80, reps: 5, sessionDate: '2026-06-01', setIndex: 2 }, '2026-06-01T10:06:00Z'),
    );

    // Phone syncs to GitHub
    await syncOnce(phoneDb, phoneTransport, 'gh:testuser');

    // Verify phone events marked synced
    const phoneUnsynced = await phoneDb.events.where('synced').equals(0).count();
    expect(phoneUnsynced).toBe(0);

    // Verify Gist now contains the 3 events
    expect(gistContent.rows.length).toBe(3);
    expect(gistContent.rows[0].server_seq).toBe(1);
    expect(gistContent.rows[2].server_seq).toBe(3);

    // 2. Laptop starts fresh with 0 events, syncs from GitHub
    await syncOnce(laptopDb, laptopTransport, 'gh:testuser');

    const laptopCount = await laptopDb.events.count();
    expect(laptopCount).toBe(3);

    // Both devices now have identical state
    const phoneState = await stateOf(phoneDb);
    const laptopState = await stateOf(laptopDb);
    expect(phoneState.level).toBe(laptopState.level);
    expect(phoneState.lastByExercise.bench.sets.length).toBe(3);
    expect(laptopState.lastByExercise.bench.sets.length).toBe(3);
    expect(phoneState).toEqual(laptopState);

    // 3. Laptop logs bodyweight at home
    await laptopDb.events.add(
      stored('laptop', 'bodyweight_logged', { kg: 75.5, date: '2026-06-02' }, '2026-06-02T08:00:00Z'),
    );
    await syncOnce(laptopDb, laptopTransport, 'gh:testuser');

    // Phone pulls the new bodyweight from GitHub
    await syncOnce(phoneDb, phoneTransport, 'gh:testuser');

    const phoneStateAfter = await stateOf(phoneDb);
    const laptopStateAfter = await stateOf(laptopDb);
    expect(phoneStateAfter).toEqual(laptopStateAfter);
    expect(phoneStateAfter.bodyweights).toEqual([{ date: '2026-06-02', kg: 75.5 }]);
  });
});
