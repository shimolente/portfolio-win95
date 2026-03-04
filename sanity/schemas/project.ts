import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'Branding', value: 'branding' },
          { title: 'Illustration', value: 'illustration' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      description: 'Main image shown in the project window and as the desktop icon preview',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Desktop Icon (optional)',
      description: 'Small icon for the desktop. Falls back to thumbnail if not set.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      description: 'One line — shown in window title bar',
      type: 'string',
    }),
    defineField({
      name: 'longDescription',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      description: 'Vercel URL for website projects',
      type: 'url',
    }),
    defineField({
      name: 'defaultPosition',
      title: 'Default Desktop Position',
      description: 'Starting position on the desktop (pixels from top-left)',
      type: 'object',
      fields: [
        { name: 'x', title: 'X', type: 'number' },
        { name: 'y', title: 'Y', type: 'number' },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'thumbnail' },
  },
});
