import { SYSTEM } from '../data/strings';
import { useGithubSyncConfig, useGithubSyncStatus } from '../store/githubSync';
import { useSyncStatus } from '../store/sync';

/** The quiet sync indicator — a dot and a word, reflecting GitHub or Supabase sync. */
export function SyncDot() {
  const supabaseStatus = useSyncStatus();
  const ghConfig = useGithubSyncConfig();
  const ghStatus = useGithubSyncStatus();

  if (ghConfig) {
    const text =
      ghStatus.status === 'syncing'
        ? 'GH: SYNCING'
        : ghStatus.status === 'error'
          ? 'GH: RETRYING'
          : `GH: @${ghConfig.user.login.slice(0, 8)}`;
    const dotClass =
      ghStatus.status === 'syncing'
        ? 'sync-dot--syncing'
        : ghStatus.status === 'error'
          ? 'sync-dot--error'
          : 'sync-dot--idle';

    return (
      <span className={`sync-dot ${dotClass}`} title={`Connected to GitHub: @${ghConfig.user.login}`}>
        <span className="dot" aria-hidden="true" />
        {text}
      </span>
    );
  }

  if (supabaseStatus === 'off') {
    return (
      <span className="sync-dot sync-dot--off" title="Offline / Local IndexedDB">
        <span className="dot" aria-hidden="true" />
        LOCAL
      </span>
    );
  }

  return (
    <span className={`sync-dot sync-dot--${supabaseStatus}`}>
      <span className="dot" aria-hidden="true" />
      {SYSTEM.settings.sync[supabaseStatus]}
    </span>
  );
}
