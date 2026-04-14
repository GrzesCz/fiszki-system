import { unlink, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const fiszkiDir = join(process.cwd(), "src", "content", "fiszki");
const PUT = async ({ params, request }) => {
  try {
    const { slug } = params;
    const filepath = join(fiszkiDir, `${slug}.json`);
    const body = await request.json();
    let existing = {};
    try {
      existing = JSON.parse(await readFile(filepath, "utf-8"));
    } catch {
    }
    const updated = { ...existing, ...body };
    await writeFile(filepath, JSON.stringify(updated, null, 2), "utf-8");
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
const DELETE = async ({ params }) => {
  try {
    const { slug } = params;
    const filepath = join(fiszkiDir, `${slug}.json`);
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
