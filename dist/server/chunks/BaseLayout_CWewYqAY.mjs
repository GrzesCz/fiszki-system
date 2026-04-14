import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { r as renderTemplate, h as renderSlot, i as renderHead } from './server_C0EKC7xv.mjs';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, subtitle } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="pl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"><title>', " — Fiszki EDU</title>", '</head> <body> <header> <div class="header-top-row"> ', ' <a href="/admin" class="admin-link header-tag">⚙ Panel</a> </div> <h1>', "</h1> ", " </header> <main> ", ` </main> <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      mermaid.initialize({ 
        startOnLoad: true, 
        theme: 'dark',
        fontFamily: 'Syne, sans-serif'
      });
      
      // Astro renderuje kod mermaid jako zwykłe bloki <pre class="language-mermaid"><code>...
      // Musimy je znaleźć i przekształcić na divy z klasą mermaid, żeby skrypt je wyrenderował
      document.addEventListener('DOMContentLoaded', () => {
        const mermaidBlocks = document.querySelectorAll('pre.astro-code.mermaid, pre.language-mermaid');
        
        mermaidBlocks.forEach(block => {
          const code = block.textContent;
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = code;
          block.parentNode.replaceChild(div, block);
        });
        
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      });
    <\/script> </body> </html>`])), title, renderHead(), Astro2.url.pathname !== "/" && renderTemplate`<a href="/" class="header-tag header-home">← Strona główna</a>`, title, subtitle && renderTemplate`<div class="subtitle">${subtitle}</div>`, renderSlot($$result, $$slots["default"]));
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
