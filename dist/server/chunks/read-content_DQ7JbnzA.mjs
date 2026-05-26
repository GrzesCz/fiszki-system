import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const notatkiDir = join(process.cwd(), "src", "content", "notatki");
const fiszkiDir = join(process.cwd(), "src", "content", "fiszki");
const validStatus = (s) => {
  if (typeof s === "string") {
    const normalized = s.replace(/\s+/g, "_").toLowerCase();
    if (["planowane", "w_trakcie", "zrobione"].includes(normalized)) return normalized;
  }
  return "planowane";
};
async function walkMdFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...await walkMdFiles(full));
    } else if (e.isFile() && e.name.endsWith(".md")) {
      const rel = full.slice(notatkiDir.length + 1).replace(/\\/g, "/");
      out.push(rel);
    }
  }
  return out;
}
async function getNotatki() {
  const paths = await walkMdFiles(notatkiDir);
  const result = [];
  for (const rel of paths) {
    try {
      const raw = await readFile(join(notatkiDir, rel), "utf-8");
      const { data } = matter(raw);
      result.push({
        id: rel,
        data: {
          title: String(data.title ?? ""),
          category: data.category != null ? String(data.category) : void 0,
          status: validStatus(data.status),
          hidden: Boolean(data.hidden),
          main: Boolean(data.main),
          mindmap: data.mindmap != null ? String(data.mindmap) : void 0,
          mindmaps: Array.isArray(data.mindmaps) ? data.mindmaps : void 0,
          mindmap_rotation: data.mindmap_rotation != null ? Number(data.mindmap_rotation) : 0,
          mindmap_zoom: data.mindmap_zoom != null ? Number(data.mindmap_zoom) : 100,
          type: data.type === "mapa" ? "mapa" : "notatka",
          related_flashcards: data.related_flashcards != null ? String(data.related_flashcards) : void 0,
          next_review_date: data.next_review_date != null ? String(data.next_review_date) : void 0,
          review_count: Number(data.review_count) || 0
        }
      });
    } catch {
    }
  }
  return result;
}
async function getFiszki() {
  let files;
  try {
    files = await readdir(fiszkiDir);
  } catch {
    return [];
  }
  const result = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const raw = await readFile(join(fiszkiDir, file), "utf-8");
      const data = JSON.parse(raw);
      result.push({
        id: file.replace(/\.json$/, ""),
        // bez rozszerzenia, np. "openai-agent-sdk"
        data: {
          title: String(data.title ?? ""),
          subtitle: data.subtitle != null ? String(data.subtitle) : void 0,
          category: data.category != null ? String(data.category) : void 0,
          status: validStatus(data.status),
          cards: Array.isArray(data.cards) ? data.cards : []
        }
      });
    } catch {
    }
  }
  return result;
}

export { getNotatki as a, getFiszki as g };
