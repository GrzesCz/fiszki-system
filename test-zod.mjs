import { z } from 'zod';
import matter from 'gray-matter';
import fs from 'fs';

const mindmapItemSchema = z.object({
  file: z.string(),
  rotation: z.number().optional().default(0),
  zoom: z.number().optional().default(100),
});

const schema = z.object({
  title: z.string(),
  category: z.string().optional(),
  related_flashcards: z.string().optional(),
  mindmap: z.string().optional(),
  mindmap_rotation: z.number().optional().default(0),
  mindmap_zoom: z.number().optional().default(100),
  mindmaps: z.array(mindmapItemSchema).optional(),
  type: z.enum(['notatka', 'mapa']).optional().default('notatka'),
  status: z.enum(['planowane', 'w_trakcie', 'zrobione']).optional().default('planowane'),
  hidden: z.boolean().optional().default(false),
  next_review_date: z.string().optional(),
  review_count: z.number().optional().default(0),
});

const content = fs.readFileSync('src/content/notatki/pytest-notatki.md', 'utf-8');
const parsed = matter(content);
const result = schema.safeParse(parsed.data);

console.log("Validation success:", result.success);
if (!result.success) {
  console.log(result.error.errors);
}
