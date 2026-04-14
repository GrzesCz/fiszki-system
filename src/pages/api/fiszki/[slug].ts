import type { APIRoute } from 'astro';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';

const fiszkiDir = join(process.cwd(), 'src', 'content', 'fiszki');

// PUT /api/fiszki/[slug] – zaktualizuj fiszki (karty, tytuł, status)
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { slug } = params;
    const filepath = join(fiszkiDir, `${slug}.json`);
    const body = await request.json();

    let existing: Record<string, unknown> = {};
    try {
      existing = JSON.parse(await readFile(filepath, 'utf-8'));
    } catch {
      // nowy plik
    }

    const updated = { ...existing, ...body };
    await writeFile(filepath, JSON.stringify(updated, null, 2), 'utf-8');

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

// DELETE /api/fiszki/[slug] – usuń plik JSON
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;
    const filepath = join(fiszkiDir, `${slug}.json`);
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
