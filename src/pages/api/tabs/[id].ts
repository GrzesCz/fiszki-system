import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const TABS_FILE = join(process.cwd(), 'src/data/custom-tabs.json');

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  let tabs: Array<{ id: string }> = [];
  try {
    tabs = JSON.parse(readFileSync(TABS_FILE, 'utf-8'));
  } catch {
    return new Response(JSON.stringify({ error: 'Nie można odczytać zakładek' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const filtered = tabs.filter(t => t.id !== id);
  if (filtered.length === tabs.length) {
    return new Response(JSON.stringify({ error: 'Nie znaleziono zakładki' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  writeFileSync(TABS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
