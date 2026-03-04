'use client';

import Image from 'next/image';
import { urlFor } from '@/lib/sanity.client';
import type { Project } from '@/lib/types';
import IframePreview from '@/components/Preview/IframePreview';
import styles from './WindowContent.module.css';

const CATEGORY_EMOJI: Record<string, string> = {
  website: '🌐',
  branding: '✏️',
  illustration: '🎨',
  other: '📁',
};

// Simple portable-text renderer — handles normal paragraphs and headings.
// Install @portabletext/react for full bold/italic/link support.
function PortableText({ blocks }: { blocks: unknown[] }) {
  return (
    <>
      {(blocks as Array<Record<string, unknown>>).map((block, i) => {
        if (block._type !== 'block') return null;

        const children = block.children as Array<{ text: string; marks?: string[] }> | undefined;
        const text = children?.map((c) => c.text).join('') ?? '';
        if (!text.trim()) return <br key={i} />;

        const style = (block.style as string) ?? 'normal';
        if (style === 'h1' || style === 'h2' || style === 'h3') {
          return <h3 key={i} className={styles.projectDesc} style={{ fontWeight: 'bold' }}>{text}</h3>;
        }
        return <p key={i} className={styles.projectDesc}>{text}</p>;
      })}
    </>
  );
}

interface Props {
  project: Project;
}

export default function WindowContent({ project }: Props) {
  const thumbUrl = project.thumbnail
    ? urlFor(project.thumbnail).width(1200).height(900).url()
    : null;

  const hasDesc = project.longDescription && (project.longDescription as unknown[]).length > 0;

  // ── Website project ───────────────────────────────────────────────────
  if (project.category === 'website' && project.externalUrl) {
    return (
      <div className={styles.websiteLayout}>
        {/* Address bar */}
        <div className={styles.addressBar}>
          <span className={styles.addressLabel}>Address</span>
          <input
            className={styles.addressInput}
            readOnly
            value={project.externalUrl}
          />
        </div>

        {/* Preview */}
        <div className={styles.previewArea}>
          <IframePreview
            url={project.externalUrl}
            fallbackImageUrl={thumbUrl}
            title={project.title}
          />
        </div>

        {/* Description panel */}
        {(project.shortDescription || hasDesc) && (
          <div className={styles.descPanel}>
            {project.shortDescription && (
              <p className={styles.projectDesc}><strong>{project.shortDescription}</strong></p>
            )}
            {hasDesc && (
              <PortableText blocks={project.longDescription as unknown[]} />
            )}
          </div>
        )}

        {/* Actions */}
        <div className={styles.websiteActions}>
          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
            <button className="win-btn">🔗 Open Site</button>
          </a>
        </div>
      </div>
    );
  }

  // ── Non-website project ───────────────────────────────────────────────
  return (
    <div className={styles.generalLayout}>
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt={project.title}
          width={1200}
          height={900}
          className={styles.thumbnail}
          style={{ objectFit: 'cover' }}
          priority
        />
      ) : (
        <div className={styles.thumbnailPlaceholder}>
          {CATEGORY_EMOJI[project.category] ?? '📁'}
        </div>
      )}

      <div className={styles.projectInfo}>
        <div className={styles.projectTitle}>{project.title}</div>
        <div className={styles.projectMeta}>
          {project.category}
          {project.year ? ` · ${project.year}` : ''}
        </div>

        {project.shortDescription && (
          <p className={styles.projectDesc}><strong>{project.shortDescription}</strong></p>
        )}

        {hasDesc && (
          <PortableText blocks={project.longDescription as unknown[]} />
        )}

        {project.externalUrl && (
          <div style={{ marginTop: 10 }}>
            <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
              <button className="win-btn">🔗 View Project</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
