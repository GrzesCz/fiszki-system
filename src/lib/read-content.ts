/**
 * Bezpośredni odczyt kolekcji z systemu plików.
 * Zastępuje getCollection() z astro:content, które w trybie produkcyjnym
 * (Docker) zwraca zamrożone dane z czasu budowania obrazu (ImmutableDataStore).
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const notatkiDir = join(process.cwd(), 'src', 'content', 'notatki');
const fiszkiDir  = join(process.cwd(), 'src', 'content', 'fiszki');

// ── Typy ────────────────────────────────────────────────────────────────────

export type Status = 'planowane' | 'w_trakcie' | 'zrobione';

export type MindmapItem = { file: string; rotation?: number; zoom?: number };

export type NotatkiEntry = {
  id: string; // np. "pytest/pytest-notatki.md"
  data: {
    title: string;
    category?: string;
    status: Status;
    hidden: boolean;
    mindmap?: string;
    mindmaps?: MindmapItem[];
    mindmap_rotation?: number;
    mindmap_zoom?: number;
    type: 'notatka' | 'mapa';
    related_flashcards?: string;
    next_review_date?: string;
    review_count: number;
  };
};

export type FiszkiEntry = {
  id: string; // np. "openai-agent-sdk" (bez .json)
  data: {
    title: string;
    subtitle?: string;
    category?: string;
    status: Status;
    cards: Array<{ cat: string; catLabel: string; q: string; a: string }>;
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const validStatus = (s: unknown): Status =>
  ['planowane', 'w_trakcie', 'zrobione'].includes(s as string)
    ? (s as Status)
    : 'planowane';

async function walkMdFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkMdFiles(full)));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      // Ścieżka względna względem notatkiDir, z ukośnikami Unix
      const rel = full.slice(notatkiDir.length + 1).replace(/\\/g, '/');
      out.push(rel);
    }
  }
  return out;
}

// ── Publiczne API ─────────────────────────────────────────────────────────────

/** Zwraca wszystkie notatki bezpośrednio z systemu plików. */
export async function getNotatki(): Promise<NotatkiEntry[]> {
  const paths = await walkMdFiles(notatkiDir);
  const result: NotatkiEntry[] = [];
  for (const rel of paths) {
    try {
      const raw = await readFile(join(notatkiDir, rel), 'utf-8');
      const { data } = matter(raw);
      result.push({
        id: rel,
        data: {
          title: String(data.title ?? ''),
          category: data.category != null ? String(data.category) : undefined,
          status: validStatus(data.status),
          hidden: Boolean(data.hidden),
          mindmap: data.mindmap != null ? String(data.mindmap) : undefined,
          mindmaps: Array.isArray(data.mindmaps) ? data.mindmaps : undefined,
          mindmap_rotation: data.mindmap_rotation != null ? Number(data.mindmap_rotation) : 0,
          mindmap_zoom: data.mindmap_zoom != null ? Number(data.mindmap_zoom) : 100,
          type: data.type === 'mapa' ? 'mapa' : 'notatka',
          related_flashcards: data.related_flashcards != null ? String(data.related_flashcards) : undefined,
          next_review_date: data.next_review_date != null ? String(data.next_review_date) : undefined,
          review_count: Number(data.review_count) || 0,
        },
      });
    } catch {
      // pomijamy uszkodzone pliki
    }
  }
  return result;
}

/** Zwraca wszystkie fiszki bezpośrednio z systemu plików. */
export async function getFiszki(): Promise<FiszkiEntry[]> {
  let files: string[];
  try {
    files = await readdir(fiszkiDir);
  } catch {
    return [];
  }
  const result: FiszkiEntry[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const raw = await readFile(join(fiszkiDir, file), 'utf-8');
      const data = JSON.parse(raw) as Record<string, unknown>;
      result.push({
        id: file.replace(/\.json$/, ''), // bez rozszerzenia, np. "openai-agent-sdk"
        data: {
          title: String(data.title ?? ''),
          subtitle: data.subtitle != null ? String(data.subtitle) : undefined,
          category: data.category != null ? String(data.category) : undefined,
          status: validStatus(data.status),
          cards: Array.isArray(data.cards) ? (data.cards as any[]) : [],
        },
      });
    } catch {
      // pomijamy uszkodzone pliki
    }
  }
  return result;
}
