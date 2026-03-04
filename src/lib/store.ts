'use client';

import { create } from 'zustand';
import type { Project, OpenWindow } from './types';

const STORAGE_KEY = 'portfolio-icon-positions';
const DEFAULT_WINDOW_SIZE = { width: 800, height: 560 };
const WINDOW_CASCADE_OFFSET = 28;

interface DesktopStore {
  // Windows
  windows: OpenWindow[];
  openWindow: (project: Project) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;

  // Icon selection
  selectedIcon: string | null;
  selectIcon: (id: string | null) => void;

  // Icon positions (persisted to localStorage)
  iconPositions: Record<string, { x: number; y: number }>;
  setIconPosition: (id: string, pos: { x: number; y: number }) => void;
  loadIconPositions: () => void;

  // Internal z-index counter
  topZIndex: number;
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  selectedIcon: null,
  iconPositions: {},
  topZIndex: 100,

  openWindow: (project) => {
    const { windows, topZIndex } = get();
    const existing = windows.find((w) => w.id === project._id);
    if (existing) {
      if (existing.minimized) get().restoreWindow(project._id);
      else get().focusWindow(project._id);
      return;
    }
    const offset = (windows.length % 10) * WINDOW_CASCADE_OFFSET;
    const newZ = topZIndex + 1;
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id: project._id,
          project,
          position: { x: 60 + offset, y: 40 + offset },
          size: DEFAULT_WINDOW_SIZE,
          minimized: false,
          zIndex: newZ,
        },
      ],
      topZIndex: newZ,
    }));
  },

  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
    })),

  restoreWindow: (id) => {
    const newZ = get().topZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: newZ } : w,
      ),
      topZIndex: newZ,
    }));
  },

  focusWindow: (id) => {
    const newZ = get().topZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZ } : w,
      ),
      topZIndex: newZ,
    }));
  },

  updateWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
    })),

  updateWindowSize: (id, size) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    })),

  selectIcon: (id) => set({ selectedIcon: id }),

  setIconPosition: (id, pos) => {
    set((state) => ({
      iconPositions: { ...state.iconPositions, [id]: pos },
    }));
    const next = { ...get().iconPositions, [id]: pos };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  },

  loadIconPositions: () => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      set({ iconPositions: JSON.parse(raw) });
    } catch {
      // ignore malformed data
    }
  },
}));
