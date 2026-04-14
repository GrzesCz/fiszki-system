import { z, defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';

const mindmapItemSchema = z.object({
  file: z.string(),
  rotation: z.number().optional().default(0),
  zoom: z.number().optional().default(100),
});

const notatkiCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notatki' }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    related_flashcards: z.string().optional(),
    mindmap: z.string().optional(), // legacy – migrowane do mindmaps
    mindmap_rotation: z.number().optional().default(0),
    mindmap_zoom: z.number().optional().default(100),
    mindmaps: z.array(mindmapItemSchema).optional(),
    type: z.enum(['notatka', 'mapa']).optional().default('notatka'),
    status: z.enum(['planowane', 'w_trakcie', 'zrobione']).optional().default('planowane'),
    hidden: z.boolean().optional().default(false),
    next_review_date: z.string().optional(),
    review_count: z.number().optional().default(0),
  }),
});

const fiszkiCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/fiszki' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(['planowane', 'w_trakcie', 'zrobione']).optional().default('planowane'),
    cards: z.array(
      z.object({
        cat: z.string(),
        catLabel: z.string(),
        q: z.string(),
        a: z.string(),
      })
    ),
  }),
});

export const collections = {
  notatki: notatkiCollection,
  fiszki: fiszkiCollection,
};
