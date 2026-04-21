import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const contentDir = join(process.cwd(), 'src', 'content', 'notatki');

const normalizeStatus = (s: string): string => {
  if (s === 'w trakcie' || s === 'w_trakcie') return 'w_trakcie';
  if (s === 'zrobione' || s === 'zrobiony') return 'zrobione';
  return 'planowane';
};

const slugify = (filename: string): string => {
  return filename
    .replace(/\.md$/, '')
    .replace(/\\/g, '/');
};

// POST /api/notatki – upload pliku .md
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'Ogólne';
    const rawStatus = (formData.get('status') as string) || 'planowane';
    const status = normalizeStatus(rawStatus);

    if (!file || !file.name.endsWith('.md')) {
      return new Response(JSON.stringify({ error: 'Plik musi być w formacie .md' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = await file.text();

    let content: string;

    if (text.startsWith('---')) {
      const parsed = matter(text);
      parsed.data.category = category;
      parsed.data.status = status;
      content = matter.stringify(parsed.content, parsed.data);
    } else {
      const title = file.name.replace(/\.md$/, '').replace(/[-_]/g, ' ');
      content = `---\ntitle: "${title}"\ncategory: "${category}"\nstatus: "${status}"\n---\n\n${text}`;
    }

    await mkdir(contentDir, { recursive: true });
    const filename = file.name;
    await writeFile(join(contentDir, filename), content, 'utf-8');

    const slug = slugify(filename);

    return new Response(JSON.stringify({ success: true, filename, slug }), {
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