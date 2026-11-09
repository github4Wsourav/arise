import { useState } from 'react';
import {
  connectGithub,
  disconnectGithub,
  exportLocalDataJson,
  importDataJson,
  syncGithubOnce,
  useGithubSyncConfig,
  useGithubSyncStatus,
} from '../../store/githubSync';
import { SystemWindow } from '../../ui/SystemWindow';

export function GitHubSyncPanel() {
  const config = useGithubSyncConfig();
  const { status, error } = useGithubSyncStatus();

  const [tokenInput, setTokenInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmSever, setConfirmSever] = useState(false);

  const handleConnect = async () => {
    if (!tokenInput.trim()) return;
    setConnecting(true);
    setConnectError(null);
    setNotice(null);
    try {
      await connectGithub(tokenInput.trim());
      setTokenInput('');
      setNotice('THE SYSTEM MATRIX HAS LINKED TO YOUR GITHUB ACCOUNT.');
    } catch (err) {
      setConnectError((err as Error).message || 'Connection failed.');
    } finally {
      setConnecting(false);
    }
  };

  const handleManualSync = async () => {
    setNotice(null);
    try {
      await syncGithubOnce();
      setNotice('SYNC COMPLETE. ALL TRAINING FACTS ARE CONVERGED.');
    } catch (err) {
      setNotice(`SYNC FAILED: ${(err as Error).message}`);
    }
  };

  const handleExport = async () => {
    try {
      const json = await exportLocalDataJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arise-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setNotice('LOCAL SYSTEM EVENT LOG EXPORTED SUCCESSFULLY.');
    } catch (err) {
      setNotice(`EXPORT FAILED: ${(err as Error).message}`);
    }
  };

  const handleFileImport = async (file: File) => {
    try {
      const text = await file.text();
      const count = await importDataJson(text);
      setNotice(`RESTORED ${count} TRAINING EVENTS INTO THE LOCAL MATRIX.`);
    } catch (err) {
      setNotice(`RESTORE FAILED: ${(err as Error).message}`);
    }
  };

  return (
    <SystemWindow label="GITHUB SYSTEM MATRIX // FREE CLOUD SYNC">
      <p className="intel-line system-text system-text--muted" style={{ marginBottom: 12 }}>
        All your workouts, levels, PRs, and relics are stored in your personal GitHub account.
        Run seamlessly on your phone, laptop, or any browser for free with zero data loss.
      </p>

      {config ? (
        <div className="gh-connected-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <img
              src={config.user.avatar_url}
              alt={config.user.login}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: '2px solid var(--aura)',
                boxShadow: '0 0 10px var(--aura)',
              }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--aura-hi)' }}>
                {config.user.name ?? config.user.login}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--faint)' }}>
                @{config.user.login} · Hunter ID #{config.user.id}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '8px 12px',
              background: 'var(--panel-2)',
              border: '1px solid var(--line)',
              borderRadius: 4,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor:
                    status === 'syncing'
                      ? 'var(--aura-2)'
                      : status === 'error'
                        ? 'var(--down)'
                        : 'var(--ok)',
                  boxShadow: `0 0 6px ${status === 'syncing' ? 'var(--aura-2)' : status === 'error' ? 'var(--down)' : 'var(--ok)'}`,
                }}
              />
              STATUS:{' '}
              {status === 'syncing'
                ? 'TRANSMITTING TO GITHUB...'
                : status === 'error'
                  ? `ERROR: ${error}`
                  : 'CONVERGED & SYNCED'}
            </span>
            <a
              href={config.gistUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--aura)', textDecoration: 'none' }}
            >
              [VIEW GIST ↗]
            </a>
          </div>

          {config.lastSyncedAt && (
            <p className="intel-line system-text system-text--muted" style={{ fontSize: 11 }}>
              Last Transmitted: {new Date(config.lastSyncedAt).toLocaleString()}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <button
              className="cta"
              style={{ flex: '1 1 140px' }}
              disabled={status === 'syncing'}
              onClick={() => void handleManualSync()}
            >
              {status === 'syncing' ? 'SYNCING...' : '⚡ SYNC TO GITHUB NOW'}
            </button>
            <button
              className="log-btn"
              style={{ flex: '1 1 140px', minHeight: 44 }}
              onClick={() => void handleExport()}
            >
              📥 EXPORT BACKUP (.JSON)
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <label
              className="log-btn"
              style={{
                display: 'block',
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: 40,
                lineHeight: '40px',
              }}
            >
              📤 RESTORE FROM JSON FILE
              <input
                type="file"
                accept="application/json,.json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFileImport(f);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <div style={{ marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            {confirmSever ? (
              <button
                className="cta cta--danger"
                onClick={() => {
                  disconnectGithub();
                  setConfirmSever(false);
                  setNotice('GITHUB CONNECTION SEVERED. LOCAL WORKOUTS PRESERVED.');
                }}
              >
                CONFIRM DISCONNECT (LOCAL DATA STAYS SAFE)
              </button>
            ) : (
              <button
                className="quest-claim"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => setConfirmSever(true)}
              >
                DISCONNECT GITHUB ACCOUNT
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="gh-unlinked-box">
          <p className="intel-line system-text system-text--muted">
            To synchronize across your phone and laptop, provide a GitHub Personal Access Token
            with <strong>gist</strong> scope. Your data is stored privately in a secret Gist owned
            by you.
          </p>

          <a
            href="https://github.com/settings/tokens/new?scopes=gist&description=Arise+Fitness+RPG+Cloud+Matrix"
            target="_blank"
            rel="noopener noreferrer"
            className="cta cta--link"
            style={{ margin: '12px 0' }}
          >
            🔑 1-CLICK: GENERATE GITHUB TOKEN
          </a>
          <p className="intel-line system-text system-text--muted" style={{ fontSize: 10 }}>
            (Opens GitHub in a new tab with the 'gist' permission pre-selected. Click 'Generate token'
            at the bottom of the page, then copy & paste it below.)
          </p>

          <div style={{ marginTop: 12 }}>
            <input
              type="password"
              className="field"
              placeholder="Paste GitHub Token (ghp_... or github_pat_...)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleConnect();
              }}
            />
            <button
              className="cta"
              disabled={tokenInput.trim().length === 0 || connecting}
              onClick={() => void handleConnect()}
              style={{ marginTop: 8 }}
            >
              {connecting ? 'CONNECTING MATRIX...' : 'CONNECT GITHUB MATRIX'}
            </button>
          </div>

          {connectError && (
            <p className="intel-line system-text" style={{ color: 'var(--down)', marginTop: 8 }}>
              ⚠ {connectError}
            </p>
          )}

          <div style={{ marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            <p className="intel-line system-text system-text--muted" style={{ fontSize: 11 }}>
              Manual Offline Backup & Transfer:
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                className="log-btn"
                style={{ flex: 1, minHeight: 38 }}
                onClick={() => void handleExport()}
              >
                📥 EXPORT (.JSON)
              </button>
              <label
                className="log-btn"
                style={{
                  flex: 1,
                  minHeight: 38,
                  lineHeight: '38px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                📤 IMPORT (.JSON)
                <input
                  type="file"
                  accept="application/json,.json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFileImport(f);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <p className="intel-line system-text" style={{ marginTop: 12, color: 'var(--aura-hi)' }}>
          {notice}
        </p>
      )}
    </SystemWindow>
  );
}
