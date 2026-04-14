import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const contentDir = join(process.cwd(), 'src', 'content', 'notatki');

// POST /api/notatki – upload pliku .md
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'Ogólne';
    const status = (formData.get('status') as string) || 'planowane';

    if (!file || !file.name.endsWith('.md')) {
      return new Response(JSON.stringify({ error: 'Plik musi być w formacie .md' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = await file.text();

    let content = text;
    if (!text.startsWith('---')) {
      const title = file.name.replace(/\.md$/, '').replace(/[-_]/g, ' ');
      content = `---\ntitle: "${title}"\ncategory: "${category}"\nstatus: "${status}"\n---\n\n${text}`;
    }

    await mkdir(contentDir, { recursive: true });
    const filename = file.name;
    await writeFile(join(contentDir, filename), content, 'utf-8');

    return new Response(JSON.stringify({ success: true, filename }), {
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
