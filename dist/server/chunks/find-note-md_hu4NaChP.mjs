import { readdir } from 'fs/promises';
import { join, relative } from 'path';

const notatkiDir = () => join(process.cwd(), "src", "content", "notatki");
const lc = (s) => s.toLowerCase();
async function walkMdFiles(dir, base) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...await walkMdFiles(full, base));
    } else if (e.isFile() && e.name.endsWith(".md")) {
      out.push(relative(base, full).replace(/\\/g, "/"));
    }
  }
  return out;
}
async function listNotatkiMdRelativePaths() {
  return walkMdFiles(notatkiDir(), notatkiDir());
}
async function findNoteMdPath(slugParam) {
  let slug = slugParam;
  try {
    slug = decodeURIComponent(slugParam);
  } catch {
    slug = slugParam;
  }
  slug = slug.replace(/\.md$/, "");
  const paths = await listNotatkiMdRelativePaths();
  const exact = paths.find((rel) => {
    const id = rel.replace(/\.md$/, "").replace(/\s+/g, "-");
    return lc(id) === lc(slug);
  });
  if (exact) return join(notatkiDir(), exact);
  const baseMatch = paths.find((rel) => {
    const base = rel.replace(/\.md$/, "").split("/").pop() ?? "";
    const norm = base.replace(/\s+/g, "-");
    return lc(norm) === lc(slug);
  });
  return baseMatch ? join(notatkiDir(), baseMatch) : null;
}

export { findNoteMdPath as f, listNotatkiMdRelativePaths as l };
