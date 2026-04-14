import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const fiszkiDir = join(process.cwd(), 'src', 'content', 'fiszki');

// POST /api/tematy – utwórz nowy temat (pusty plik JSON)
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, category, status } = body;

    if (!title || !category) {
      return new Response(JSON.stringify({ error: 'Wymagane pola: title, category' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 60);

    const filename = `${slug}.json`;
    const template = {
      title,
      category,
      status: status || 'planowane',
      cards: [],
    };

    await mkdir(fiszkiDir, { recursive: true });
    await writeFile(join(fiszkiDir, filename), JSON.stringify(template, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, slug, filename }), {
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
