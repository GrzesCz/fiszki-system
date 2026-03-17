/**
 * Zamienia bezwzględne ścieżki /_astro/ i /./_astro/ na względne,
 * żeby dist/ działał przy otwieraniu plików z dysku (file://).
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

function walk(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

const htmlFiles = walk(distDir);
for (const file of htmlFiles) {
  const depth = relative(distDir, dirname(file)).split(/[/\\]/).filter(Boolean).length;
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  let content = readFileSync(file, 'utf8');
  content = content.replace(/href="\/[./]*_astro\//g, `href="${prefix}_astro/`);
  content = content.replace(/src="\/[./]*_astro\//g, `src="${prefix}_astro/`);
  content = content.replace(/href="\/tematy\/([^"]+)"/g, (_, slug) => `href="${prefix}tematy/${slug}/index.html"`);
    // Nowe podstrony
    content = content.replace(/href="\/kategoria\/([^"]+)"/g, (_, slug) => `href="${prefix}kategoria/${slug}/index.html"`);
    content = content.replace(/href="\/notatki\/([^"]+)"/g, (_, slug) => `href="${prefix}notatki/${slug}/index.html"`);
  content = content.replace(/href="\/"/g, depth === 0 ? 'href="./"' : `href="${prefix}index.html"`);
  writeFileSync(file, content);
}
console.log(`Fixed ${htmlFiles.length} HTML file(s) with relative paths.`);
