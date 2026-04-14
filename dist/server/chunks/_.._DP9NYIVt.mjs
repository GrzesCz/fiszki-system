import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { c as createRenderInstruction, a as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './server_C0EKC7xv.mjs';
import { $ as $$BaseLayout } from './BaseLayout_CWewYqAY.mjs';
import { g as getCollection, r as renderEntry } from './_astro_content_CdwnSi5M.mjs';

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
  const notatki = await getCollection("notatki");
  const cleanSlug = slug?.replace(/\.md$/, "");
  const entry = notatki.find((n) => n.id.replace(/\.md$/, "") === cleanSlug);
  if (!entry) {
    return Astro2.redirect("/");
  }
  const { Content } = await renderEntry(entry);
  const categorySlug = entry.data.category ? entry.data.category.toLowerCase().replace(/\s+/g, "-") : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": entry.data.title, "subtitle": `Kategoria: ${entry.data.category || "Ogólne"}`, "data-astro-cid-yioi6c4n": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="navigation-bar" data-astro-cid-yioi6c4n> ${categorySlug && renderTemplate`<a${addAttribute(`/kategoria/${categorySlug}`, "href")} class="btn-secondary btn-small" data-astro-cid-yioi6c4n>
← Wróć do kategorii
</a>`} <button class="btn-secondary btn-small" id="btn-review-done"${addAttribute(slug, "data-slug")}${addAttribute(entry.data.review_count || 0, "data-count")} data-astro-cid-yioi6c4n>
✓ Oznacz jako powtórzone
</button> </div> ${entry.data.mindmap && renderTemplate`<div class="mindmap-container" data-astro-cid-yioi6c4n> <h3 data-astro-cid-yioi6c4n>🗺️ Mapa Myśli</h3> <a${addAttribute(`/maps/${entry.data.mindmap}`, "href")} target="_blank" rel="noopener noreferrer" title="Kliknij, aby powiększyć" data-astro-cid-yioi6c4n> <img${addAttribute(`/maps/${entry.data.mindmap}`, "src")}${addAttribute(`Mapa myśli dla ${entry.data.title}`, "alt")} class="mindmap-image" data-astro-cid-yioi6c4n> </a> <p class="mindmap-hint" data-astro-cid-yioi6c4n>Kliknij na obrazek, aby otworzyć go w pełnym rozmiarze.</p> </div>`}<article class="markdown-body" data-astro-cid-yioi6c4n> ${renderComponent($$result2, "Content", Content, { "data-astro-cid-yioi6c4n": true })} </article> ` })}  ${renderScript($$result, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/notatki/[...slug].astro?astro&type=script&index=0&lang.ts")}`;
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
