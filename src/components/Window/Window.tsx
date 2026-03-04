'use client';

import { useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore } from '@/lib/store';
import type { OpenWindow } from '@/lib/types';
import WindowContent from './WindowContent';
import styles from './Window.module.css';

const CATEGORY_EMOJI: Record<string, string> = {
  website: '🌐',
  branding: '✏️',
  illustration: '🎨',
  other: '📁',
};

interface Props {
  win: OpenWindow;
}

export default function Window({ win }: Props) {
  const {
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    windows,
  } = useDesktopStore();

  // Determine if this is the topmost window
  const maxZ = Math.max(...windows.map((w) => w.zIndex));
  const isActive = win.zIndex === maxZ;

  const handleMouseDown = useCallback(() => {
    focusWindow(win.id);
  }, [win.id, focusWindow]);

  return (
    <AnimatePresence>
      {!win.minimized && (
        <Rnd
          position={{ x: win.position.x, y: win.position.y }}
          size={{ width: win.size.width, height: win.size.height }}
          minWidth={320}
          minHeight={240}
          bounds="parent"
          dragHandleClassName={styles.titleBar}
          onDragStop={(_, data) =>
            updateWindowPosition(win.id, { x: data.x, y: data.y })
          }
          onResizeStop={(_, __, ref, ___, pos) => {
            updateWindowSize(win.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
            });
            updateWindowPosition(win.id, pos);
          }}
          style={{ zIndex: win.zIndex }}
          enableResizing
        >
          <motion.div
            className={`${styles.window} ${!isActive ? styles.inactive : ''}`}
            onMouseDown={handleMouseDown}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Title bar */}
            <div className={styles.titleBar}>
              <span className={styles.titleIcon}>
                {CATEGORY_EMOJI[win.project.category] ?? '📁'}
              </span>
              <span className={styles.titleText}>{win.project.title}</span>
              <div className={styles.controls}>
                <button
                  className={styles.ctrlBtn}
                  onClick={() => minimizeWindow(win.id)}
                  title="Minimize"
                  aria-label="Minimize"
                >
                  ─
                </button>
                <button
                  className={styles.ctrlBtn}
                  title="Maximize"
                  aria-label="Maximize"
                >
                  □
                </button>
                <button
                  className={`${styles.ctrlBtn} ${styles.ctrlClose}`}
                  onClick={() => closeWindow(win.id)}
                  title="Close"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Menu bar */}
            <div className={styles.menuBar}>
              <span className={styles.menuItem}>File</span>
              <span className={styles.menuItem}>View</span>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <WindowContent project={win.project} />
            </div>

            {/* Status bar */}
            <div className={styles.statusBar}>
              <div className={styles.statusItem}>
                {win.project.shortDescription ?? win.project.category}
              </div>
              {win.project.year && (
                <div className={styles.statusItem} style={{ maxWidth: 60 }}>
                  {win.project.year}
                </div>
              )}
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
}
