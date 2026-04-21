/**
 * Renderuje plik .md bezpośrednio z systemu plików do HTML.
 * Omija astro:content getCollection(), które w Dockerze zwraca zamrożone
 * dane z czasu builda (nowe notatki wgrane przez API są niewidoczne).
 */

import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export async function renderNoteMarkdown(absPath: string): Promise<string> {
  const raw = await readFile(absPath, 'utf-8');
  const { content } = matter(raw);
  return marked.parse(content) as string;
}
