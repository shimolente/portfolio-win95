'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Config } from 'sanity';

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((m) => m.NextStudio),
  { ssr: false },
);

const VALID_PROJECT_ID = /^[a-z0-9][-a-z0-9]+$/;

export default function StudioPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '').trim();

  useEffect(() => {
    if (!VALID_PROJECT_ID.test(projectId)) return;
    import('../../../../sanity.config').then((m) => setConfig(m.default));
  }, [projectId]);

  // Not configured yet — show setup guide
  if (!VALID_PROJECT_ID.test(projectId)) {
    return (
      <div style={{ fontFamily: 'monospace', padding: '40px', maxWidth: 600 }}>
        <h2>Sanity not configured</h2>
        <p style={{ margin: '16px 0 8px' }}>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in your{' '}
          <code>.env.local</code> to enable the studio.
        </p>
        <ol style={{ lineHeight: 2 }}>
          <li>
            Go to{' '}
            <a href="https://sanity.io/manage" target="_blank" rel="noreferrer">
              sanity.io/manage
            </a>{' '}
            and create a project (or use an existing one)
          </li>
          <li>
            Copy <code>.env.local.example</code> → <code>.env.local</code>
          </li>
          <li>Paste your project ID into <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code></li>
          <li>Restart the dev server</li>
        </ol>
        <p style={{ marginTop: 16, color: '#666', fontSize: 13 }}>
          Current value:{' '}
          <code style={{ background: '#fee', padding: '1px 4px' }}>
            {projectId || '(empty)'}
          </code>
        </p>
      </div>
    );
  }

  if (!config) return null;

  return <NextStudio config={config} />;
}
