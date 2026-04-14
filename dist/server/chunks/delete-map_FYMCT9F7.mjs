import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { g as getMindmapsFromFrontmatter } from './mindmaps-frontmatter_DEqagl3q.mjs';
import { f as findNoteMdPath, l as listNotatkiMdRelativePaths } from './find-note-md_hu4NaChP.mjs';

const mapsDir = join(process.cwd(), "public", "maps");
const notatkiDir = join(process.cwd(), "src", "content", "notatki");
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const noteSlug = body.noteSlug;
    const mapIndex = body.mapIndex;
    if (!noteSlug) {
      return new Response(JSON.stringify({ error: "Brak noteSlug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const notePath = await findNoteMdPath(noteSlug);
    if (!notePath) {
      return new Response(JSON.stringify({ error: `Notatka nie znaleziona: ${noteSlug}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const raw = await readFile(notePath, "utf-8");
    const { data, content: bodyText } = matter(raw);
    let maps = getMindmapsFromFrontmatter(data);
    const idx = mapIndex !== void 0 ? Math.max(0, Math.min(mapIndex, maps.length - 1)) : 0;
    const filename = maps[idx]?.file ?? null;
    maps = maps.filter((_, i) => i !== idx);
    delete data.mindmap;
    delete data.mindmap_rotation;
    delete data.mindmap_zoom;
    data.mindmaps = maps;
    await writeFile(notePath, matter.stringify(bodyText, data), "utf-8");
    if (filename) {
      const isUsedHere = maps.some((m) => m.file === filename);
      let isUsedElsewhere = false;
      if (!isUsedHere) {
        const allRel = await listNotatkiMdRelativePaths();
        for (const rel of allRel) {
          const otherPath = join(notatkiDir, rel);
          if (rel.endsWith(".md") && otherPath !== notePath) {
            try {
              const fileContent = await readFile(otherPath, "utf-8");
              const { data: d } = matter(fileContent);
              const otherMaps = getMindmapsFromFrontmatter(d);
              if (otherMaps.some((m) => m.file === filename)) {
                isUsedElsewhere = true;
                break;
              }
            } catch {
            }
          }
        }
      }
      if (!isUsedHere && !isUsedElsewhere) {
        const mapPath = join(mapsDir, filename);
        try {
          await unlink(mapPath);
        } catch {
        }
      }
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
