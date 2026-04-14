import type { APIRoute } from 'astro';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { getMindmapsFromFrontmatter } from '../../lib/mindmaps-frontmatter';
import { findNoteMdPath, listNotatkiMdRelativePaths } from '../../lib/find-note-md';

const mapsDir = join(process.cwd(), 'public', 'maps');
const notatkiDir = join(process.cwd(), 'src', 'content', 'notatki');

// POST /api/delete-map – usuń mapę z notatki (po indeksie) i plik z dysku
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const noteSlug = body.noteSlug as string | null;
    const mapIndex = body.mapIndex as number | undefined;

    if (!noteSlug) {
      return new Response(JSON.stringify({ error: 'Brak noteSlug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const notePath = await findNoteMdPath(noteSlug);
    if (!notePath) {
      return new Response(JSON.stringify({ error: `Notatka nie znaleziona: ${noteSlug}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const raw = await readFile(notePath, 'utf-8');
    const { data, content: bodyText } = matter(raw);
    let maps = getMindmapsFromFrontmatter(data as Record<string, unknown>);

    const idx = mapIndex !== undefined ? Math.max(0, Math.min(mapIndex, maps.length - 1)) : 0;
    const filename = maps[idx]?.file ?? null;

    maps = maps.filter((_, i) => i !== idx);

    delete (data as Record<string, unknown>).mindmap;
    delete (data as Record<string, unknown>).mindmap_rotation;
    delete (data as Record<string, unknown>).mindmap_zoom;
    (data as Record<string, unknown>).mindmaps = maps;

    await writeFile(notePath, matter.stringify(bodyText, data), 'utf-8');

    if (filename) {
      const isUsedHere = maps.some((m) => m.file === filename);
      let isUsedElsewhere = false;

      if (!isUsedHere) {
        const allRel = await listNotatkiMdRelativePaths();
        for (const rel of allRel) {
          const otherPath = join(notatkiDir, rel);
          if (rel.endsWith('.md') && otherPath !== notePath) {
            try {
              const fileContent = await readFile(otherPath, 'utf-8');
              const { data: d } = matter(fileContent);
              const otherMaps = getMindmapsFromFrontmatter(d as Record<string, unknown>);
              if (otherMaps.some(m => m.file === filename)) {
                isUsedElsewhere = true;
                break;
              }
            } catch {}
          }
        }
      }

      if (!isUsedHere && !isUsedElsewhere) {
        const mapPath = join(mapsDir, filename);
        try {
          await unlink(mapPath);
        } catch {}
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
