import { useState } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { SystemWindow } from '../../ui/SystemWindow';

export function PwaInstallPanel() {
  const { canInstall, isInstalled, isIOS, installApp } = usePwaInstall();
  const [installedNotice, setInstalledNotice] = useState<string | null>(null);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setInstalledNotice('SYSTEM APP SUCCESSFULLY INSTALLED.');
    }
  };

  return (
    <SystemWindow label="DEVICE APPLICATION // PWA INSTALL">
      {isInstalled ? (
        <div>
          <p className="intel-line system-text" style={{ color: 'var(--ok)' }}>
            ✓ RUNNING AS A STANDALONE APPLICATION
          </p>
          <p className="intel-line system-text system-text--muted" style={{ fontSize: 11 }}>
            Arise is running in native app mode on this device. All audio, animations, character tiers,
            and workout engines are precached and work completely offline without cellular reception.
          </p>
        </div>
      ) : (
        <div>
          <p className="intel-line system-text system-text--muted">
            You can download Arise directly onto your phone (Android or iPhone) or laptop as a native
            app. It opens instantly, runs full-screen, and functions completely offline at the gym.
          </p>

          {canInstall && (
            <button className="cta" onClick={() => void handleInstall()} style={{ margin: '10px 0' }}>
              📲 INSTALL APP ON THIS DEVICE
            </button>
          )}

          {isIOS && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                background: 'var(--panel-2)',
                border: '1px solid var(--line)',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
            >
              <div style={{ color: 'var(--aura-hi)', marginBottom: 6, fontWeight: 700 }}>
                IPHONE / IPAD INSTALL STEPS:
              </div>
              <div>1. Open this page in Safari.</div>
              <div>2. Tap the <strong>Share</strong> button (box with upward arrow ⎋).</div>
              <div>3. Scroll down and tap <strong>Add to Home Screen</strong> (⊞).</div>
              <div>4. Tap <strong>Add</strong> in the top-right corner.</div>
            </div>
          )}

          {!canInstall && !isIOS && (
            <p className="intel-line system-text system-text--muted" style={{ fontSize: 11 }}>
              If using Chrome, Edge, or Brave, you can also click the install icon in the browser address bar.
            </p>
          )}

          {installedNotice && (
            <p className="intel-line system-text" style={{ color: 'var(--aura-hi)', marginTop: 8 }}>
              {installedNotice}
            </p>
          )}
        </div>
      )}
    </SystemWindow>
  );
}
