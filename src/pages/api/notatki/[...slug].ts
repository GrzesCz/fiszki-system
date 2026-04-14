import type { APIRoute } from 'astro';
import { unlink, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import { getMindmapsFromFrontmatter, type MindmapItem } from '../../../lib/mindmaps-frontmatter';
import { findNoteMdPath } from '../../../lib/find-note-md';

function slugFromParams(params: Record<string, string | undefined>): string {
  const s = params.slug;
  if (s != null && s !== '') return s;
  const spread = (params as Record<string, string | undefined>)['...slug'];
  if (spread != null && spread !== '') return spread;
  return '';
}

// DELETE /api/notatki/[...slug] – usuń plik .md
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const slug = slugFromParams(params);
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Brak slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const filepath = await findNoteMdPath(slug);
    if (!filepath) {
      return new Response(JSON.stringify({ error: `Plik nie znaleziony: ${slug}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await unlink(filepath);
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

// PUT /api/notatki/[...slug] – zaktualizuj status, category lub mermaidCode
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const slug = slugFromParams(params);
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Brak slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const filepath = await findNoteMdPath(slug);
    if (!filepath) {
      return new Response(JSON.stringify({ error: `Plik nie znaleziony: ${slug}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const {
      status,
      category,
      mermaidCode,
      type,
      next_review_date,
      review_count,
      mindmaps: bodyMindmaps,
      mindmap_index,
      mindmap_rotation,
      mindmap_zoom,
      mindmap,
    } = body;

    let content = await readFile(filepath, 'utf-8');

    if (content.startsWith('---')) {
      const { data: fm, content: bodyText } = matter(content);
      const data = fm as Record<string, unknown>;
      let bodyOut = bodyText;

      if (status !== undefined) data.status = status;
      if (category !== undefined) data.category = category;
      if (type !== undefined) data.type = type;
      if (next_review_date !== undefined) data.next_review_date = next_review_date;
      if (review_count !== undefined) data.review_count = review_count;

      let maps = getMindmapsFromFrontmatter(data);
      if (bodyMindmaps !== undefined && Array.isArray(bodyMindmaps)) {
        maps = (bodyMindmaps as MindmapItem[]).map((m) => ({
          file: String(m?.file ?? ''),
          rotation: [0, 90, 180, 270].includes(Number(m?.rotation)) ? Number(m.rotation) : 0,
          zoom: [50, 75, 100, 125, 150].includes(Number(m?.zoom)) ? Number(m.zoom) : 100,
        }));
      } else if (mindmap_index !== undefined) {
        const idx = Math.max(0, Math.min(mindmap_index, maps.length - 1));
        if (idx >= 0 && idx < maps.length) {
          if (mindmap_rotation !== undefined) {
            const rot = Math.round(Number(mindmap_rotation)) % 360;
            maps[idx].rotation = [0, 90, 180, 270].includes(rot) ? rot : 0;
          }
          if (mindmap_zoom !== undefined) {
            const z = Math.round(Number(mindmap_zoom));
            maps[idx].zoom = [50, 75, 100, 125, 150].includes(z) ? z : 100;
          }
          if (mindmap !== undefined && mindmap !== '' && mindmap !== null) {
            maps[idx].file = String(mindmap);
          }
        }
      }

      delete data.mindmap;
      delete data.mindmap_rotation;
      delete data.mindmap_zoom;
      data.mindmaps = maps;

      if (mermaidCode !== undefined) {
        if (/```mermaid[\s\S]*?```/.test(bodyOut)) {
          bodyOut = bodyOut.replace(/```mermaid[\s\S]*?```/, `\`\`\`mermaid\n${mermaidCode}\n\`\`\``);
        } else {
          bodyOut += `\n\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n`;
        }
      }

      content = matter.stringify(bodyOut, data);
    }

    await writeFile(filepath, content, 'utf-8');

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
