import { useState } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function PwaInstallBanner() {
  const { canInstall, isInstalled, isIOS, installApp } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled || dismissed) return null;
  if (!canInstall && !isIOS) return null;

  return (
    <div
      style={{
        margin: '10px 0 16px',
        padding: '10px 14px',
        background: 'linear-gradient(135deg, rgba(31, 203, 184, 0.15), rgba(11, 59, 54, 0.4))',
        border: '1px solid var(--aura)',
        borderRadius: 6,
        boxShadow: '0 0 12px color-mix(in srgb, var(--aura) 30%, transparent)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            color: 'var(--aura-hi)',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📲</span> SYSTEM DIRECTIVE: INSTALL APP
        </span>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--faint)',
            cursor: 'pointer',
            fontSize: 14,
            padding: '0 4px',
          }}
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>

      <p style={{ margin: 0, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>
        {canInstall
          ? 'Download Arise as an app to your phone or desktop. Works 100% offline at the gym.'
          : 'Install Arise to your home screen for full-screen offline gym tracking.'}
      </p>

      {canInstall && (
        <button
          className="cta"
          style={{ minHeight: 36, fontSize: 11, padding: '4px 12px' }}
          onClick={() => void installApp()}
        >
          ⬇ INSTALL APP NOW
        </button>
      )}

      {isIOS && !canInstall && (
        <div>
          {showIosGuide ? (
            <div
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--aura-hi)',
                background: 'rgba(0,0,0,0.4)',
                padding: '6px 10px',
                borderRadius: 4,
              }}
            >
              1. Tap the <strong>Share</strong> button (⎋ / square with arrow) at the bottom of Safari.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong> (⊞).<br />
              3. Tap <strong>Add</strong> in the top right.
            </div>
          ) : (
            <button
              className="cta"
              style={{ minHeight: 34, fontSize: 11 }}
              onClick={() => setShowIosGuide(true)}
            >
              VIEW IPHONE / IPAD INSTALL GUIDE
            </button>
          )}
        </div>
      )}
    </div>
  );
}
