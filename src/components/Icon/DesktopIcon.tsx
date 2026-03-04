'use client';

import { useRef, useCallback } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import Image from 'next/image';
import { useDesktopStore } from '@/lib/store';
import { urlFor } from '@/lib/sanity.client';
import type { Project } from '@/lib/types';
import styles from './DesktopIcon.module.css';

function getDefaultPosition(index: number): { x: number; y: number } {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return { x: 16 + col * 96, y: 16 + row * 110 };
}

const CATEGORY_EMOJI: Record<string, string> = {
  website: '🌐',
  branding: '✏️',
  illustration: '🎨',
  other: '📁',
};

interface Props {
  project: Project;
  index?: number;
}

export default function DesktopIcon({ project, index = 0 }: Props) {
  const { iconPositions, setIconPosition, selectedIcon, selectIcon, openWindow } =
    useDesktopStore();

  const nodeRef = useRef<HTMLDivElement>(null);
  // Track whether a drag actually occurred so we can suppress the click that follows
  const dragged = useRef(false);

  const savedPos = iconPositions[project._id];
  const pos = savedPos ?? project.defaultPosition ?? getDefaultPosition(index);

  const handleDragStart = useCallback(() => {
    dragged.current = false;
  }, []);

  const handleDrag = useCallback(() => {
    dragged.current = true;
  }, []);

  const handleDragStop = useCallback(
    (_: DraggableEvent, data: DraggableData) => {
      if (dragged.current) {
        setIconPosition(project._id, { x: data.x, y: data.y });
      }
    },
    [project._id, setIconPosition],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (dragged.current) return; // ignore click fired after a drag
      selectIcon(project._id);
    },
    [project._id, selectIcon],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (dragged.current) return;
      openWindow(project);
    },
    [project, openWindow],
  );

  const isSelected = selectedIcon === project._id;

  const iconSrc = project.icon
    ? urlFor(project.icon).width(144).height(108).url()
    : project.thumbnail
      ? urlFor(project.thumbnail).width(144).height(108).url()
      : null;

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      position={pos}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`${styles.icon} ${isSelected ? styles.selected : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title}`}
        onKeyDown={(e) => e.key === 'Enter' && openWindow(project)}
      >
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt={project.title}
            width={72}
            height={54}
            className={styles.thumb}
            draggable={false}
            priority={false}
          />
        ) : (
          <div className={styles.thumbPlaceholder}>
            {CATEGORY_EMOJI[project.category] ?? '📁'}
          </div>
        )}
        <span className={styles.label}>{project.title}</span>
      </div>
    </Draggable>
  );
}
