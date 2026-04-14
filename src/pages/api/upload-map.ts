import type { APIRoute } from 'astro';
import { writeFile, readFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { getMindmapsFromFrontmatter } from '../../lib/mindmaps-frontmatter';
import { findNoteMdPath, listNotatkiMdRelativePaths } from '../../lib/find-note-md';

const mapsDir = join(process.cwd(), 'public', 'maps');
const notatkiDir = join(process.cwd(), 'src', 'content', 'notatki');

// POST /api/upload-map – wgraj skan mapy i opcjonalnie powiąż z notatką (dodaj do mindmaps)
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const noteSlug = formData.get('noteSlug') as string | null;
    const replaceIdxRaw = formData.get('replaceMapIndex') as string | null;
    const replaceMapIndex = replaceIdxRaw !== null ? parseInt(replaceIdxRaw, 10) : undefined;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Brak pliku' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Dozwolone formaty: PNG, JPG, SVG, WEBP' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await mkdir(mapsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(mapsDir, file.name), buffer);

    // Jeśli podano slug notatki, dodaj lub zamień mapę w mindmaps
    if (noteSlug) {
      const notePath = await findNoteMdPath(noteSlug);
      if (notePath) {
        try {
          const raw = await readFile(notePath, 'utf-8');
          const { data, content: body } = matter(raw);
          const maps = getMindmapsFromFrontmatter(data as Record<string, unknown>);
          const newItem = { file: file.name, rotation: 0, zoom: 100 };
          if (replaceMapIndex !== undefined && replaceMapIndex >= 0 && replaceMapIndex < maps.length) {
            const oldFile = maps[replaceMapIndex].file;
            maps[replaceMapIndex] = { ...maps[replaceMapIndex], file: file.name, rotation: maps[replaceMapIndex].rotation ?? 0, zoom: maps[replaceMapIndex].zoom ?? 100 };
            
            // Sprawdź czy stary plik jest nadal używany zanim usuniesz
            if (oldFile !== file.name) {
              const isUsedHere = maps.some((m) => m.file === oldFile);
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
                      if (otherMaps.some(m => m.file === oldFile)) {
                        isUsedElsewhere = true;
                        break;
                      }
                    } catch {}
                  }
                }
              }
              if (!isUsedHere && !isUsedElsewhere) {
                try { await unlink(join(mapsDir, oldFile)); } catch {}
              }
            }
          } else {
            if (maps.some((m) => m.file === file.name)) {
              return new Response(JSON.stringify({ error: 'Ten plik (o tej samej nazwie) jest już przypisany do tej notatki.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              });
            }
            maps.push(newItem);
          }
          delete (data as Record<string, unknown>).mindmap;
          delete (data as Record<string, unknown>).mindmap_rotation;
          delete (data as Record<string, unknown>).mindmap_zoom;
          (data as Record<string, unknown>).mindmaps = maps;
          (data as Record<string, unknown>).type = 'mapa';
          await writeFile(notePath, matter.stringify(body, data), 'utf-8');
          } catch (e) {
            console.error("Błąd zapisu:", e);
          }
        }
      }

    return new Response(JSON.stringify({ success: true, filename: file.name }), {
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
