import { groq } from 'next-sanity';
import { client, isSanityConfigured } from './sanity.client';
import type { Project } from './types';

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt asc) {
  _id,
  title,
  slug,
  category,
  year,
  thumbnail,
  icon,
  shortDescription,
  longDescription,
  externalUrl,
  defaultPosition,
  featured
}`;

export async function getProjects(): Promise<Project[]> {
  if (!isSanityConfigured || !client) {
    return sampleProjects;
  }
  try {
    return await client.fetch<Project[]>(projectsQuery, {}, { next: { tags: ['projects'] } });
  } catch {
    return sampleProjects;
  }
}

// Sample data shown when Sanity is not configured
export const sampleProjects: Project[] = [
  {
    _id: 'sample-1',
    title: 'Brand Identity',
    slug: { current: 'brand-identity' },
    category: 'branding',
    year: 2024,
    thumbnail: null,
    shortDescription: 'Visual identity for a lifestyle brand',
    defaultPosition: { x: 60, y: 80 },
    featured: true,
  },
  {
    _id: 'sample-2',
    title: 'Portfolio Site',
    slug: { current: 'portfolio-site' },
    category: 'website',
    year: 2024,
    thumbnail: null,
    shortDescription: 'This website',
    externalUrl: 'https://example.com',
    defaultPosition: { x: 200, y: 80 },
    featured: true,
  },
  {
    _id: 'sample-3',
    title: 'Illustrations',
    slug: { current: 'illustrations' },
    category: 'illustration',
    year: 2023,
    thumbnail: null,
    shortDescription: 'A series of editorial illustrations',
    defaultPosition: { x: 340, y: 80 },
    featured: false,
  },
];
