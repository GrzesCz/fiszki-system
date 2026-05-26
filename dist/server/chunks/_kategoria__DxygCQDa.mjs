import { readFile, unlink, readdir } from 'fs/promises';
import { relative, join } from 'path';
import matter from 'gray-matter';

const notatkiDir = join(process.cwd(), "src", "content", "notatki");
const fiszkiDir = join(process.cwd(), "src", "content", "fiszki");
async function walkFiles(dir, ext) {
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
      out.push(...await walkFiles(full, ext));
    } else if (e.isFile() && e.name.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}
const DELETE = async ({ params }) => {
  try {
    const { kategoria } = params;
    if (!kategoria) {
      return new Response(JSON.stringify({ error: "Brak nazwy kategorii" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const categoryName = decodeURIComponent(kategoria);
    const deleted = [];
    const errors = [];
    const mdFiles = await walkFiles(notatkiDir, ".md");
    for (const filepath of mdFiles) {
      try {
        const raw = await readFile(filepath, "utf-8");
        const { data } = matter(raw);
        if (data.category === categoryName) {
          await unlink(filepath);
          deleted.push(relative(process.cwd(), filepath));
        }
      } catch (e) {
        errors.push(String(e));
      }
    }
    const jsonFiles = await walkFiles(fiszkiDir, ".json");
    for (const filepath of jsonFiles) {
      try {
        const raw = await readFile(filepath, "utf-8");
        const data = JSON.parse(raw);
        if (data.category === categoryName) {
          await unlink(filepath);
          deleted.push(relative(process.cwd(), filepath));
        }
      } catch (e) {
        errors.push(String(e));
      }
    }
    if (deleted.length === 0 && errors.length === 0) {
      return new Response(JSON.stringify({ error: "Nie znaleziono żadnych plików dla tej kategorii" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, deleted, errors }), {
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
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
