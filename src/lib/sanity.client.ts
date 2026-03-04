import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImage } from './types';

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '').trim();

// Sanity project IDs are lowercase alphanumeric + dashes only.
// If the env var is missing or still has the placeholder value, skip the client.
export const isSanityConfigured = /^[a-z0-9][-a-z0-9]+$/.test(projectId);

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

const builder = client ? createImageUrlBuilder(client) : null;

// Returns image URL string, or empty string when Sanity is not configured
export function urlFor(source: SanityImage): { url: () => string; width: (w: number) => ReturnType<typeof urlFor>; height: (h: number) => ReturnType<typeof urlFor> } {
  if (!builder) {
    const noop: ReturnType<typeof urlFor> = { url: () => '', width: () => noop, height: () => noop };
    return noop;
  }
  // @sanity/image-url builder supports chaining — cast to match our simplified type
  return builder.image(source) as unknown as ReturnType<typeof urlFor>;
}
