import { mkdir, writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { g as getMindmapsFromFrontmatter } from './mindmaps-frontmatter_DEqagl3q.mjs';
import { f as findNoteMdPath, l as listNotatkiMdRelativePaths } from './find-note-md_hu4NaChP.mjs';

const mapsDir = join(process.cwd(), "public", "maps");
const notatkiDir = join(process.cwd(), "src", "content", "notatki");
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const noteSlug = formData.get("noteSlug");
    const replaceIdxRaw = formData.get("replaceMapIndex");
    const replaceMapIndex = replaceIdxRaw !== null ? parseInt(replaceIdxRaw, 10) : void 0;
    if (!file) {
      return new Response(JSON.stringify({ error: "Brak pliku" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowed = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];
    if (!allowed.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Dozwolone formaty: PNG, JPG, SVG, WEBP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await mkdir(mapsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(mapsDir, file.name), buffer);
    if (noteSlug) {
      const notePath = await findNoteMdPath(noteSlug);
      if (notePath) {
        try {
          const raw = await readFile(notePath, "utf-8");
          const { data, content: body } = matter(raw);
          const maps = getMindmapsFromFrontmatter(data);
          const newItem = { file: file.name, rotation: 0, zoom: 100 };
          if (replaceMapIndex !== void 0 && replaceMapIndex >= 0 && replaceMapIndex < maps.length) {
            const oldFile = maps[replaceMapIndex].file;
            maps[replaceMapIndex] = { ...maps[replaceMapIndex], file: file.name, rotation: maps[replaceMapIndex].rotation ?? 0, zoom: maps[replaceMapIndex].zoom ?? 100 };
            if (oldFile !== file.name) {
              const isUsedHere = maps.some((m) => m.file === oldFile);
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
                      if (otherMaps.some((m) => m.file === oldFile)) {
                        isUsedElsewhere = true;
                        break;
                      }
                    } catch {
                    }
                  }
                }
              }
              if (!isUsedHere && !isUsedElsewhere) {
                try {
                  await unlink(join(mapsDir, oldFile));
                } catch {
                }
              }
            }
          } else {
            if (maps.some((m) => m.file === file.name)) {
              return new Response(JSON.stringify({ error: "Ten plik (o tej samej nazwie) jest już przypisany do tej notatki." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }
            maps.push(newItem);
          }
          delete data.mindmap;
          delete data.mindmap_rotation;
          delete data.mindmap_zoom;
          data.mindmaps = maps;
          data.type = "mapa";
          await writeFile(notePath, matter.stringify(body, data), "utf-8");
        } catch (e) {
          console.error("Błąd zapisu:", e);
        }
      }
    }
    return new Response(JSON.stringify({ success: true, filename: file.name }), {
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
