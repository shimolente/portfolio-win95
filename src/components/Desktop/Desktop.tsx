'use client';

import { useEffect, useCallback } from 'react';
import { useDesktopStore } from '@/lib/store';
import type { Project } from '@/lib/types';
import DesktopIcon from '@/components/Icon/DesktopIcon';
import WindowManager from '@/components/Window/WindowManager';
import Taskbar from './Taskbar';
import styles from './Desktop.module.css';

interface Props {
  projects: Project[];
  wallpaperUrl?: string;
}

export default function Desktop({ projects, wallpaperUrl }: Props) {
  const { loadIconPositions, selectIcon } = useDesktopStore();

  // Load saved icon positions from localStorage on mount
  useEffect(() => {
    loadIconPositions();
  }, [loadIconPositions]);

  // Clicking empty desktop deselects icons
  const handleDesktopClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        selectIcon(null);
      }
    },
    [selectIcon],
  );

  const desktopStyle = wallpaperUrl
    ? { backgroundImage: `url(${wallpaperUrl})` }
    : undefined;

  return (
    <>
      <div
        className={`desktop-root ${styles.desktop}`}
        style={desktopStyle}
        onMouseDown={handleDesktopClick}
      >
        {/* Desktop icons */}
        {projects.map((project) => (
          <DesktopIcon key={project._id} project={project} />
        ))}

        {/* Open windows */}
        <div className={styles.windowLayer}>
          <WindowManager />
        </div>
      </div>

      {/* Win95 taskbar */}
      <Taskbar />
    </>
  );
}
