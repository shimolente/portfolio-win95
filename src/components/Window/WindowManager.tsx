'use client';

import { useDesktopStore } from '@/lib/store';
import Window from './Window';

export default function WindowManager() {
  const { windows } = useDesktopStore();

  return (
    <>
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}
    </>
  );
}
