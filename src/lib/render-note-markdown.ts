/**
 * Renderuje plik .md bezpośrednio z systemu plików do HTML.
 * Omija astro:content getCollection(), które w Dockerze zwraca zamrożone
 * dane z czasu builda (nowe notatki wgrane przez API są niewidoczne).
 */

import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

function tokenText(tokens: any[] = []): string {
  return tokens
    .map((token) => {
      if (typeof token.text === 'string' && token.type === 'codespan') return token.text;
      if (typeof token.raw === 'string' && !token.tokens && token.type === 'text') return token.raw;
      if (typeof token.text === 'string' && !token.tokens) return token.text;
      if (Array.isArray(token.tokens)) return tokenText(token.tokens);
      return '';
    })
    .join('');
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/_/g, '\u0000')
    .replace(/[^\p{L}\p{N}\s_\u0000-]/gu, '')
    .replace(/\u0000/g, '_')
    .replace(/\s/g, '-');
}

function createRendererWithHeadingIds(): Renderer {
  const renderer = new Renderer();
  const seen = new Map<string, number>();

  renderer.heading = function ({ tokens, depth }) {
    const text = tokenText(tokens);
    const baseSlug = slugifyHeading(text) || 'section';
    const count = seen.get(baseSlug) ?? 0;
    seen.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    const html = this.parser.parseInline(tokens);

    return `<h${depth} id="${slug}">${html}</h${depth}>\n`;
  };

  return renderer;
}

export async function renderNoteMarkdown(absPath: string): Promise<string> {
  const raw = await readFile(absPath, 'utf-8');
  const { content } = matter(raw);
  return marked.parse(content, {
    gfm: true,
    breaks: false,
    renderer: createRendererWithHeadingIds(),
  }) as string;
}
