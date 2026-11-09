/**
 * GitHub Cloud Sync Engine for Arise.
 * Stores every user's training data, quests, and levels in their own private GitHub account.
 * Uses GitHub Gist API with zero server maintenance, 100% free forever, and complete data ownership.
 */
import { useSyncExternalStore } from 'react';
import { adoptLocalEvents } from './auth';
import { LOCAL_USER, setActiveUserId } from './append';
import { db } from './db';
import { PULL_LIMIT, syncOnce, type ServerEventRow, type SyncTransport } from './syncCore';

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  id: number;
  html_url: string;
}

export interface GitHubSyncConfig {
  token: string;
  user: GitHubUser;
  gistId: string;
  gistUrl: string;
  lastSyncedAt: string | null;
}

export type GitHubSyncStatus = 'unlinked' | 'idle' | 'syncing' | 'error';

const STORAGE_KEY_CONFIG = 'arise_github_sync_config';
const GIST_DATA_FILENAME = 'arise-system-data.json';
const GIST_DESCRIPTION_PREFIX = '⚔️ [Arise System Matrix]';

let config: GitHubSyncConfig | null = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    return raw ? (JSON.parse(raw) as GitHubSyncConfig) : null;
  } catch {
    return null;
  }
})();

export interface GitHubSyncSnapshot {
  status: GitHubSyncStatus;
  error: string | null;
}

let status: GitHubSyncStatus = config ? 'idle' : 'unlinked';
let statusSnapshot: GitHubSyncSnapshot = {
  status,
  error: null,
};

let inFlight = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((fn) => fn());
}

function setStatus(next: GitHubSyncStatus, error: string | null = null): void {
  if (statusSnapshot.status === next && statusSnapshot.error === error) return;
  status = next;
  statusSnapshot = { status: next, error };
  notify();
}

function saveConfig(next: GitHubSyncConfig | null): void {
  config = next;
  try {
    if (next) {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(next));
      setActiveUserId(`gh:${next.user.login}`);
      setStatus('idle');
    } else {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
      setActiveUserId(LOCAL_USER);
      setStatus('unlinked');
    }
  } catch (err) {
    console.error('Failed to persist GitHub config to localStorage', err);
  }
  notify();
}

export function useGithubSyncConfig(): GitHubSyncConfig | null {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => config,
  );
}

export function useGithubSyncStatus(): GitHubSyncSnapshot {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => statusSnapshot,
  );
}

export function getGithubConfig(): GitHubSyncConfig | null {
  return config;
}

/** Validate GitHub PAT by calling /user */
export async function validateGithubToken(token: string): Promise<GitHubUser> {
  const clean = token.trim();
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${clean}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid or expired GitHub token. Check permissions.');
    }
    throw new Error(`GitHub verification failed (HTTP ${res.status})`);
  }

  const data = (await res.json()) as {
    login: string;
    name: string | null;
    avatar_url: string;
    id: number;
    html_url: string;
  };

  return {
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    id: data.id,
    html_url: data.html_url,
  };
}

/** Find existing Arise Gist or create a new secret Gist */
export async function findOrCreateAriseGist(
  token: string,
  user: GitHubUser,
): Promise<{ gistId: string; gistUrl: string }> {
  const clean = token.trim();
  const headers = {
    Authorization: `Bearer ${clean}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // 1. Search existing gists for one containing arise-system-data.json
  try {
    const listRes = await fetch('https://api.github.com/gists?per_page=100', { headers });
    if (listRes.ok) {
      const gists = (await listRes.json()) as Array<{
        id: string;
        html_url: string;
        description: string;
        files: Record<string, unknown>;
      }>;

      const found = gists.find(
        (g) =>
          g.files &&
          (g.files[GIST_DATA_FILENAME] || (g.description && g.description.includes(GIST_DESCRIPTION_PREFIX))),
      );

      if (found) {
        return { gistId: found.id, gistUrl: found.html_url };
      }
    }
  } catch (err) {
    console.warn('Could not list gists, proceeding to creation', err);
  }

  // 2. Create new secret gist
  const createRes = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: `${GIST_DESCRIPTION_PREFIX} Fitness RPG State for @${user.login}`,
      public: false,
      files: {
        [GIST_DATA_FILENAME]: {
          content: JSON.stringify(
            {
              version: 1,
              user: user.login,
              createdAt: new Date().toISOString(),
              rows: [],
            },
            null,
            2,
          ),
        },
        'STATUS.md': {
          content: `# ⚔️ ARISE // THE SYSTEM MATRIX\n\n**Hunter:** @${user.login}\n**Linked:** ${new Date().toLocaleString()}\n\n*Character event log and progression stored on GitHub.*`,
        },
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create secret Gist on GitHub (HTTP ${createRes.status})`);
  }

  const created = (await createRes.json()) as { id: string; html_url: string };
  return { gistId: created.id, gistUrl: created.html_url };
}

/** Create SyncTransport backed by a GitHub Gist */
export function createGithubTransport(token: string, gistId: string, login: string): SyncTransport {
  const clean = token.trim();
  const headers = {
    Authorization: `Bearer ${clean}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  async function fetchRemoteRows(): Promise<ServerEventRow[]> {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch Gist ${gistId} (HTTP ${res.status})`);
    }
    const gist = (await res.json()) as {
      files: Record<string, { content?: string; truncated?: boolean; raw_url?: string }>;
    };

    const file = gist.files[GIST_DATA_FILENAME];
    if (!file) return [];

    let rawContent = file.content;
    if (file.truncated && file.raw_url) {
      const rawRes = await fetch(file.raw_url, { headers });
      if (rawRes.ok) rawContent = await rawRes.text();
    }

    if (!rawContent) return [];
    try {
      const parsed = JSON.parse(rawContent) as { rows?: ServerEventRow[] };
      return parsed.rows ?? [];
    } catch {
      return [];
    }
  }

  return {
    async push(rows) {
      if (rows.length === 0) return;
      const remote = await fetchRemoteRows();
      let maxSeq = remote.reduce((acc, r) => Math.max(acc, r.server_seq ?? 0), 0);

      const merged = [...remote];
      let newCount = 0;
      for (const r of rows) {
        if (!merged.some((x) => x.id === r.id)) {
          maxSeq += 1;
          merged.push({ ...r, server_seq: maxSeq });
          newCount += 1;
        }
      }

      if (newCount === 0) return; // All already present

      const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `${GIST_DESCRIPTION_PREFIX} @${login} · ${merged.length} Events`,
          files: {
            [GIST_DATA_FILENAME]: {
              content: JSON.stringify(
                {
                  version: 1,
                  user: login,
                  lastUpdated: new Date().toISOString(),
                  totalEvents: merged.length,
                  rows: merged,
                },
                null,
                2,
              ),
            },
            'STATUS.md': {
              content: `# ⚔️ ARISE // HUNTER SYSTEM MATRIX\n\n- **Hunter:** @${login}\n- **Total Events:** ${merged.length}\n- **Last Updated:** ${new Date().toLocaleString()}\n\n*Synced automatically from Arise PWA.*`,
            },
          },
        }),
      });

      if (!patchRes.ok) {
        throw new Error(`Failed to update GitHub Gist (HTTP ${patchRes.status})`);
      }
    },

    async pull(cursor) {
      const remote = await fetchRemoteRows();
      return remote
        .filter((r) => (r.server_seq ?? 0) > cursor)
        .sort((a, b) => (a.server_seq ?? 0) - (b.server_seq ?? 0))
        .slice(0, PULL_LIMIT);
    },
  };
}

/** Execute a full synchronization cycle against GitHub */
export async function syncGithubOnce(): Promise<void> {
  if (!config || inFlight) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    setStatus('idle');
    return;
  }

  inFlight = true;
  clearTimeout(retryTimer);
  setStatus('syncing');

  try {
    const uid = `gh:${config.user.login}`;
    await adoptLocalEvents(uid);

    const transport = createGithubTransport(config.token, config.gistId, config.user.login);
    await syncOnce(db, transport, uid);

    const updatedConfig: GitHubSyncConfig = {
      ...config,
      lastSyncedAt: new Date().toISOString(),
    };
    saveConfig(updatedConfig);
    setStatus('idle');
  } catch (err) {
    const msg = (err as Error).message ?? 'Sync failed';
    setStatus('error', msg);
    // Backoff retry: retry after 8 seconds
    retryTimer = setTimeout(() => void syncGithubOnce(), 8000);
  } finally {
    inFlight = false;
  }
}

/** Debounced sync request (e.g. called after set logged or quest claimed) */
export function requestGithubSync(delayMs = 1500): void {
  if (!config) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void syncGithubOnce();
  }, delayMs);
}

/** Connect GitHub account via Personal Access Token */
export async function connectGithub(token: string): Promise<GitHubSyncConfig> {
  const user = await validateGithubToken(token);
  const gist = await findOrCreateAriseGist(token, user);

  const newConfig: GitHubSyncConfig = {
    token: token.trim(),
    user,
    gistId: gist.gistId,
    gistUrl: gist.gistUrl,
    lastSyncedAt: null,
  };

  saveConfig(newConfig);
  // Perform initial immediate sync (pulls remote history and pushes local events)
  await syncGithubOnce();
  return newConfig;
}

/** Disconnect GitHub sync without wiping local workout log */
export function disconnectGithub(): void {
  clearTimeout(retryTimer);
  clearTimeout(debounceTimer);
  saveConfig(null);
}

/** Export all local IndexedDB events to a downloadable JSON file */
export async function exportLocalDataJson(): Promise<string> {
  const events = await db.events.toArray();
  const backup = {
    app: 'Arise',
    exportedAt: new Date().toISOString(),
    totalEvents: events.length,
    events,
  };
  return JSON.stringify(backup, null, 2);
}

/** Import events from a JSON string into local IndexedDB and request sync */
export async function importDataJson(jsonString: string): Promise<number> {
  const parsed = JSON.parse(jsonString) as {
    events?: Array<Record<string, unknown>>;
  };
  const list = parsed.events;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('No valid events found in backup file');
  }

  let count = 0;
  for (const item of list) {
    if (item.id && item.type && item.occurredAt) {
      await db.events.put({
        id: String(item.id),
        userId: String(item.userId ?? (config ? `gh:${config.user.login}` : LOCAL_USER)),
        deviceId: String(item.deviceId ?? 'imported'),
        type: item.type as any,
        payload: item.payload as any,
        occurredAt: String(item.occurredAt),
        schemaVersion: 1,
        synced: 0,
      });
      count += 1;
    }
  }

  requestGithubSync(200);
  return count;
}

/** Initialize background listeners for GitHub Sync */
export function initGithubSync(): void {
  if (typeof window === 'undefined') return;

  if (config) {
    setActiveUserId(`gh:${config.user.login}`);
    // Sync on startup
    void syncGithubOnce();
  }

  window.addEventListener('focus', () => requestGithubSync(500));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') requestGithubSync(500);
  });
  window.addEventListener('online', () => requestGithubSync(500));
}
