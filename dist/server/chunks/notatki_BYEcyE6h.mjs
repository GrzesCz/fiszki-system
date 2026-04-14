import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const contentDir = join(process.cwd(), "src", "content", "notatki");
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category") || "Ogólne";
    const status = formData.get("status") || "planowane";
    if (!file || !file.name.endsWith(".md")) {
      return new Response(JSON.stringify({ error: "Plik musi być w formacie .md" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const text = await file.text();
    let content = text;
    if (!text.startsWith("---")) {
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
    return new Response(JSON.stringify({ success: true, filename }), {
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
