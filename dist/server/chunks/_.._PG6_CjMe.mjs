import { unlink, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import { g as getMindmapsFromFrontmatter } from './mindmaps-frontmatter_DEqagl3q.mjs';
import { f as findNoteMdPath } from './find-note-md_hu4NaChP.mjs';

function slugFromParams(params) {
  const s = params.slug;
  if (s != null && s !== "") return s;
  const spread = params["...slug"];
  if (spread != null && spread !== "") return spread;
  return "";
}
const DELETE = async ({ params }) => {
  try {
    const slug = slugFromParams(params);
    if (!slug) {
      return new Response(JSON.stringify({ error: "Brak slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const filepath = await findNoteMdPath(slug);
    if (!filepath) {
      return new Response(JSON.stringify({ error: `Plik nie znaleziony: ${slug}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await unlink(filepath);
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
const PUT = async ({ params, request }) => {
  try {
    const slug = slugFromParams(params);
    if (!slug) {
      return new Response(JSON.stringify({ error: "Brak slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const filepath = await findNoteMdPath(slug);
    if (!filepath) {
      return new Response(JSON.stringify({ error: `Plik nie znaleziony: ${slug}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
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
      mindmap
    } = body;
    let content = await readFile(filepath, "utf-8");
    if (content.startsWith("---")) {
      const { data: fm, content: bodyText } = matter(content);
      const data = fm;
      let bodyOut = bodyText;
      if (status !== void 0) data.status = status;
      if (category !== void 0) data.category = category;
      if (type !== void 0) data.type = type;
      if (next_review_date !== void 0) data.next_review_date = next_review_date;
      if (review_count !== void 0) data.review_count = review_count;
      let maps = getMindmapsFromFrontmatter(data);
      if (bodyMindmaps !== void 0 && Array.isArray(bodyMindmaps)) {
        maps = bodyMindmaps.map((m) => ({
          file: String(m?.file ?? ""),
          rotation: [0, 90, 180, 270].includes(Number(m?.rotation)) ? Number(m.rotation) : 0,
          zoom: [50, 75, 100, 125, 150].includes(Number(m?.zoom)) ? Number(m.zoom) : 100
        }));
      } else if (mindmap_index !== void 0) {
        const idx = Math.max(0, Math.min(mindmap_index, maps.length - 1));
        if (idx >= 0 && idx < maps.length) {
          if (mindmap_rotation !== void 0) {
            const rot = Math.round(Number(mindmap_rotation)) % 360;
            maps[idx].rotation = [0, 90, 180, 270].includes(rot) ? rot : 0;
          }
          if (mindmap_zoom !== void 0) {
            const z = Math.round(Number(mindmap_zoom));
            maps[idx].zoom = [50, 75, 100, 125, 150].includes(z) ? z : 100;
          }
          if (mindmap !== void 0 && mindmap !== "" && mindmap !== null) {
            maps[idx].file = String(mindmap);
          }
        }
      }
      delete data.mindmap;
      delete data.mindmap_rotation;
      delete data.mindmap_zoom;
      data.mindmaps = maps;
      if (mermaidCode !== void 0) {
        if (/```mermaid[\s\S]*?```/.test(bodyOut)) {
          bodyOut = bodyOut.replace(/```mermaid[\s\S]*?```/, `\`\`\`mermaid
${mermaidCode}
\`\`\``);
        } else {
          bodyOut += `
\`\`\`mermaid
${mermaidCode}
\`\`\`
`;
        }
      }
      content = matter.stringify(bodyOut, data);
    }
    await writeFile(filepath, content, "utf-8");
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
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
