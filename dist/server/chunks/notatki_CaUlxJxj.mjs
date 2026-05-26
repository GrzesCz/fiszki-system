import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const contentDir = join(process.cwd(), "src", "content", "notatki");
const normalizeStatus = (s) => {
  if (s === "w trakcie" || s === "w_trakcie") return "w_trakcie";
  if (s === "zrobione" || s === "zrobiony") return "zrobione";
  return "planowane";
};
const slugify = (filename) => {
  return filename.replace(/\.md$/, "").replace(/\\/g, "/");
};
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category") || "Ogólne";
    const rawStatus = formData.get("status") || "planowane";
    const status = normalizeStatus(rawStatus);
    if (!file || !file.name.endsWith(".md")) {
      return new Response(JSON.stringify({ error: "Plik musi być w formacie .md" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const text = await file.text();
    let content;
    if (text.startsWith("---")) {
      const parsed = matter(text);
      parsed.data.category = category;
      parsed.data.status = status;
      content = matter.stringify(parsed.content, parsed.data);
    } else {
      const title = file.name.replace(/\.md$/, "").replace(/[-_]/g, " ");
      content = `---
title: "${title}"
category: "${category}"
status: "${status}"
---

${text}`;
    }
    await mkdir(contentDir, { recursive: true });
    const filename = file.name;
    await writeFile(join(contentDir, filename), content, "utf-8");
    const slug = slugify(filename);
    return new Response(JSON.stringify({ success: true, filename, slug }), {
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
