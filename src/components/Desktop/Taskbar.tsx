'use client';

import { useEffect, useState } from 'react';
import { useDesktopStore } from '@/lib/store';
import styles from './Taskbar.module.css';

function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return <div className={styles.tray}>{time}</div>;
}

// Win95-ish colorful flag logo as SVG
function Win95Logo() {
  return (
    <svg
      className={styles.startLogo}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="7" height="7" fill="#f00" />
      <rect x="9" y="0" width="7" height="7" fill="#0f0" />
      <rect x="0" y="9" width="7" height="7" fill="#00f" />
      <rect x="9" y="9" width="7" height="7" fill="#ff0" />
    </svg>
  );
}

export default function Taskbar() {
  const { windows, restoreWindow, minimizeWindow, focusWindow } = useDesktopStore();

  const visibleWindows = windows.filter((w) => !w.minimized);
  const minimizedWindows = windows.filter((w) => w.minimized);
  const allTaskbarWindows = [...visibleWindows, ...minimizedWindows];

  function handleAppBtn(id: string, minimized: boolean) {
    if (minimized) {
      restoreWindow(id);
    } else {
      minimizeWindow(id);
      focusWindow(id);
    }
  }

  return (
    <div className={styles.taskbar}>
      {/* Start button */}
      <button className={styles.startBtn}>
        <Win95Logo />
        Start
      </button>

      <div className={styles.divider} />

      {/* Running app buttons */}
      <div className={styles.apps}>
        {allTaskbarWindows.map((win) => (
          <button
            key={win.id}
            className={`${styles.appBtn} ${win.minimized ? '' : styles.appBtnActive}`}
            onClick={() => handleAppBtn(win.id, win.minimized)}
            title={win.project.title}
          >
            {win.project.title}
          </button>
        ))}
      </div>

      {/* System tray */}
      <Clock />
    </div>
  );
}
