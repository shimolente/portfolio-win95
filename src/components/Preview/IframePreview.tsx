'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './IframePreview.module.css';

interface Props {
  url: string;
  fallbackImageUrl: string | null;
  title: string;
}

export default function IframePreview({ url, fallbackImageUrl, title }: Props) {
  const [mode, setMode] = useState<'screenshot' | 'iframe' | 'loading'>('screenshot');
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleLaunchPreview() {
    setMode('loading');
    setIframeError(false);
    // Small delay to show loading state then switch to iframe
    setTimeout(() => setMode('iframe'), 200);
  }

  function handleIframeLoad() {
    // Try to detect X-Frame-Options block: if contentDocument is inaccessible
    // and the iframe appears empty, it was blocked.
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc && doc.body && doc.body.innerHTML === '') {
        setIframeError(true);
      }
    } catch {
      // cross-origin error means it loaded (we just can't read it)
      // this is the normal successful case
    }
  }

  // ── Default view: screenshot + launch button ───────────────────────────
  if (mode === 'screenshot') {
    return (
      <div className={styles.root}>
        {fallbackImageUrl ? (
          <>
            <Image
              src={fallbackImageUrl}
              alt={title}
              fill
              className={styles.fallbackThumb}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.fallbackOverlay}>
              <button className="win-btn" onClick={handleLaunchPreview}>
                ▶ Load Preview
              </button>
              <span className={styles.fallbackMsg}>
                Click to load the live site preview
              </span>
            </div>
          </>
        ) : (
          <div className={styles.fallback}>
            <button className="win-btn" onClick={handleLaunchPreview}>
              ▶ Load Preview
            </button>
            <span className={styles.fallbackMsg}>
              Click to load the live site preview
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────
  if (mode === 'loading') {
    return (
      <div className={styles.root}>
        <div className={styles.loading}>Loading…</div>
      </div>
    );
  }

  // ── Iframe blocked fallback ────────────────────────────────────────────
  if (iframeError) {
    return (
      <div className={styles.root}>
        <div className={styles.fallback}>
          <p>This site cannot be embedded.</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <button className="win-btn">🔗 Open in New Tab</button>
          </a>
          <button className="win-btn" onClick={() => setMode('screenshot')}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── Live iframe ────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        className={styles.iframe}
        onLoad={handleIframeLoad}
        onError={() => setIframeError(true)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
