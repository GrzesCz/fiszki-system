import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';

marked.setOptions({ gfm: true, breaks: false });
function tokenText(tokens = []) {
  return tokens.map((token) => {
    if (typeof token.text === "string" && token.type === "codespan") return token.text;
    if (typeof token.raw === "string" && !token.tokens && token.type === "text") return token.raw;
    if (typeof token.text === "string" && !token.tokens) return token.text;
    if (Array.isArray(token.tokens)) return tokenText(token.tokens);
    return "";
  }).join("");
}
function slugifyHeading(text) {
  return text.trim().toLowerCase().replace(/_/g, "\0").replace(/[^\p{L}\p{N}\s_\u0000-]/gu, "").replace(/\u0000/g, "_").replace(/\s/g, "-");
}
function createRendererWithHeadingIds() {
  const renderer = new Renderer();
  const seen = /* @__PURE__ */ new Map();
  renderer.heading = function({ tokens, depth }) {
    const text = tokenText(tokens);
    const baseSlug = slugifyHeading(text) || "section";
    const count = seen.get(baseSlug) ?? 0;
    seen.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    const html = this.parser.parseInline(tokens);
    return `<h${depth} id="${slug}">${html}</h${depth}>
`;
  };
  return renderer;
}
async function renderNoteMarkdown(absPath) {
  const raw = await readFile(absPath, "utf-8");
  const { content } = matter(raw);
  return marked.parse(content, {
    gfm: true,
    breaks: false,
    renderer: createRendererWithHeadingIds()
  });
}

export { renderNoteMarkdown as r };
