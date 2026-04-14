import { readdir } from 'fs/promises';
import { join, relative } from 'path';

const notatkiDir = () => join(process.cwd(), 'src', 'content', 'notatki');

const lc = (s: string) => s.toLowerCase();

async function walkMdFiles(dir: string, base: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkMdFiles(full, base)));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      out.push(relative(base, full).replace(/\\/g, '/'));
    }
  }
  return out;
}

/** Wszystkie ścieżki względne `*.md` pod `src/content/notatki` (np. `pytest/pytest-notatki.md`). */
export async function listNotatkiMdRelativePaths(): Promise<string[]> {
  return walkMdFiles(notatkiDir(), notatkiDir());
}

/**
 * Rozwiązuje slug z URL do ścieżki pliku .md (bez rozróżniania wielkości liter –
 * ważne na Windows i gdy serwer normalizuje ścieżkę do małych liter).
 * Obsługuje pełną ścieżkę względną (`pytest/pytest-notatki`) oraz samą nazwę pliku (legacy).
 */
export async function findNoteMdPath(slugParam: string): Promise<string | null> {
  let slug = slugParam;
  try {
    slug = decodeURIComponent(slugParam);
  } catch {
    slug = slugParam;
  }
  slug = slug.replace(/\.md$/, '');

  const paths = await listNotatkiMdRelativePaths();

  const exact = paths.find((rel) => {
    const id = rel.replace(/\.md$/, '').replace(/\s+/g, '-');
    return lc(id) === lc(slug);
  });
  if (exact) return join(notatkiDir(), exact);

  const baseMatch = paths.find((rel) => {
    const base = rel.replace(/\.md$/, '').split('/').pop() ?? '';
    const norm = base.replace(/\s+/g, '-');
    return lc(norm) === lc(slug);
  });
  return baseMatch ? join(notatkiDir(), baseMatch) : null;
}
