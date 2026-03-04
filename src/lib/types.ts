export interface SanityImage {
  asset: { _ref: string };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  category: 'website' | 'branding' | 'illustration' | 'other';
  year: number;
  thumbnail: SanityImage | null;
  icon?: SanityImage | null;
  shortDescription: string;
  longDescription?: unknown[];
  externalUrl?: string;
  defaultPosition?: { x: number; y: number };
  featured: boolean;
}

export interface OpenWindow {
  id: string;
  project: Project;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  zIndex: number;
}
