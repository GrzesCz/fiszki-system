import { z, defineCollection } from 'astro:content';

const notatkiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    related_flashcards: z.string().optional(),
    mindmap: z.string().optional(),
  }),
});

const fiszkiCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    category: z.string().optional(),
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
