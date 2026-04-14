import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { a as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from './server_C0EKC7xv.mjs';
import { $ as $$BaseLayout } from './BaseLayout_CWewYqAY.mjs';

const $$Viewer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Viewer;
  const url = Astro2.url;
  const file = url.searchParams.get("file") || "";
  const rotation = parseInt(url.searchParams.get("rotation") || "0", 10);
  const zoom = parseInt(url.searchParams.get("zoom") || "100", 10);
  const back = url.searchParams.get("back") || "/";
  const safeFile = file.replace(/[^a-zA-Z0-9._-]/g, "");
  const validRotation = [0, 90, 180, 270].includes(rotation) ? rotation : 0;
  const validZoom = [50, 75, 100, 125, 150].includes(zoom) ? zoom : 100;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Mapa myśli – pełny rozmiar", "subtitle": "", "data-astro-cid-d2ylwbpd": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="viewer-container" data-astro-cid-d2ylwbpd> <a${addAttribute(back, "href")} class="viewer-back" data-astro-cid-d2ylwbpd>← Wróć</a> ${safeFile ? renderTemplate`<div class="viewer-image-wrap"${addAttribute(`transform: rotate(${validRotation}deg) scale(${validZoom / 100})`, "style")} data-astro-cid-d2ylwbpd> <img${addAttribute(`/maps/${safeFile}`, "src")} alt="Mapa myśli" class="viewer-image" data-astro-cid-d2ylwbpd> </div>` : renderTemplate`<p class="viewer-error" data-astro-cid-d2ylwbpd>Brak pliku mapy.</p>`} </div> ` })}`;
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/viewer.astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/viewer.astro";
const $$url = "/viewer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Viewer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
