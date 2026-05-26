import { c as createComponent } from './astro-component_Bgxofd72.mjs';
import 'piccolore';
import { l as createRenderInstruction, j as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute, u as unescapeHTML } from './server_C1QNpGN5.mjs';
import { $ as $$BaseLayout } from './BaseLayout_kORAnSm-.mjs';
import { a as getNotatki } from './read-content_DQ7JbnzA.mjs';
import { r as renderNoteMarkdown } from './render-note-markdown_B-ahvyeo.mjs';
import { f as findNoteMdPath } from './find-note-md_hu4NaChP.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  const cleanSlug = slug?.replace(/\.md$/, "") ?? "";
  const allNotatki = await getNotatki();
  const liveEntry = allNotatki.find((n) => n.id.replace(/\.md$/, "") === cleanSlug);
  if (!liveEntry) {
    return Astro2.redirect("/");
  }
  const absPath = await findNoteMdPath(cleanSlug);
  if (!absPath) {
    return Astro2.redirect("/");
  }
  const contentHtml = await renderNoteMarkdown(absPath);
  const categorySlug = liveEntry.data.category ? liveEntry.data.category.toLowerCase().replace(/\s+/g, "-") : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": liveEntry.data.title, "subtitle": `Kategoria: ${liveEntry.data.category || "Ogólne"}`, "data-astro-cid-yioi6c4n": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="navigation-bar" data-astro-cid-yioi6c4n> ${categorySlug && renderTemplate`<a${addAttribute(`/kategoria/${categorySlug}`, "href")} class="btn-secondary btn-small" data-astro-cid-yioi6c4n>
← Wróć do kategorii
</a>`} <button class="btn-secondary btn-small" id="btn-review-done"${addAttribute(slug, "data-slug")}${addAttribute(liveEntry.data.review_count || 0, "data-count")} data-astro-cid-yioi6c4n>
✓ Oznacz jako powtórzone
</button> </div> ${liveEntry.data.mindmap && renderTemplate`<div class="mindmap-container" data-astro-cid-yioi6c4n> <h3 data-astro-cid-yioi6c4n>🗺️ Mapa Myśli</h3> <a${addAttribute(`/maps/${liveEntry.data.mindmap}`, "href")} target="_blank" rel="noopener noreferrer" title="Kliknij, aby powiększyć" data-astro-cid-yioi6c4n> <img${addAttribute(`/maps/${liveEntry.data.mindmap}`, "src")}${addAttribute(`Mapa myśli dla ${liveEntry.data.title}`, "alt")} class="mindmap-image" data-astro-cid-yioi6c4n> </a> <p class="mindmap-hint" data-astro-cid-yioi6c4n>Kliknij na obrazek, aby otworzyć go w pełnym rozmiarze.</p> </div>`}<article class="markdown-body" data-astro-cid-yioi6c4n>${unescapeHTML(contentHtml)}</article> ` })}  ${renderScript($$result, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/notatki/[...slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/notatki/[...slug].astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/notatki/[...slug].astro";
const $$url = "/notatki/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
