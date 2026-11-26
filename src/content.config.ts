import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const source = z.object({ title: z.string(), url: z.string().url() });

// The 12 stages of the guide. Edit the Markdown in src/content/guide/.
const guide = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/guide',
    // "03-money.md" becomes "money", so URLs don't change if stages are renumbered.
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/^\d+-/, ''),
  }),
  schema: z.object({
    order: z.number().int().min(1),
    title: z.string(),
    short: z.string().describe('Short name for the calendar and nav'),
    summary: z.string(),
    trap: z.string().describe('The biggest trap at this stage'),
    nextMoves: z.array(z.string()).min(1).max(3),
    tools: z.array(z.string()).default([]),
    templates: z.array(z.string()).default([]),
    sources: z.array(source).default([]),
    checked: z.string().describe('When time-sensitive facts were last checked'),
  }),
});

// Printable paperwork templates. Edit the Markdown in src/content/templates/.
const templates = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/templates' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().int(),
  }),
});

export const collections = { guide, templates };
