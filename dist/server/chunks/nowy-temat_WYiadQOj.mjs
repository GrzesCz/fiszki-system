import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { r as renderTemplate, a as renderComponent, m as maybeRenderHead, b as addAttribute } from './server_C0EKC7xv.mjs';
import { $ as $$BaseLayout } from './BaseLayout_CWewYqAY.mjs';
import { g as getCollection } from './_astro_content_CdwnSi5M.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$NowyTemat = createComponent(async ($$result, $$props, $$slots) => {
  const notatki = await getCollection("notatki");
  const fiszki = await getCollection("fiszki");
  const allCategories = Array.from(/* @__PURE__ */ new Set([
    ...notatki.map((n) => n.data.category).filter(Boolean),
    ...fiszki.map((f) => f.data.category).filter(Boolean)
  ])).sort();
  return renderTemplate(_a || (_a = __template(["", " <script>\n  document.getElementById('newTopicForm').addEventListener('submit', async (e) => {\n    e.preventDefault();\n    const form = e.target;\n    const data = {\n      title: form.title.value.trim(),\n      category: form.category.value.trim(),\n      status: form.status.value,\n    };\n\n    const msg = document.getElementById('formMsg');\n    msg.className = 'form-msg';\n    msg.textContent = 'Tworzenie...';\n\n    const res = await fetch('/api/tematy', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(data),\n    });\n\n    const json = await res.json();\n    if (res.ok) {\n      msg.className = 'form-msg success';\n      msg.textContent = `✓ Temat \"${data.title}\" utworzony! Możesz teraz dodać do niego fiszki.`;\n      form.reset();\n      setTimeout(() => window.location.href = `/admin/fiszki/${json.slug}`, 1200);\n    } else {\n      msg.className = 'form-msg error';\n      msg.textContent = `Błąd: ${json.error}`;\n    }\n  });\n<\/script>"], ["", " <script>\n  document.getElementById('newTopicForm').addEventListener('submit', async (e) => {\n    e.preventDefault();\n    const form = e.target;\n    const data = {\n      title: form.title.value.trim(),\n      category: form.category.value.trim(),\n      status: form.status.value,\n    };\n\n    const msg = document.getElementById('formMsg');\n    msg.className = 'form-msg';\n    msg.textContent = 'Tworzenie...';\n\n    const res = await fetch('/api/tematy', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(data),\n    });\n\n    const json = await res.json();\n    if (res.ok) {\n      msg.className = 'form-msg success';\n      msg.textContent = \\`✓ Temat \"\\${data.title}\" utworzony! Możesz teraz dodać do niego fiszki.\\`;\n      form.reset();\n      setTimeout(() => window.location.href = \\`/admin/fiszki/\\${json.slug}\\`, 1200);\n    } else {\n      msg.className = 'form-msg error';\n      msg.textContent = \\`Błąd: \\${json.error}\\`;\n    }\n  });\n<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Nowy Temat", "subtitle": "Dodaj nową grupę fiszek", "data-astro-cid-megloulf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-nav" data-astro-cid-megloulf> <a href="/admin" class="btn-secondary btn-small" data-astro-cid-megloulf>← Panel zarządzania</a> </div> <form id="newTopicForm" class="admin-form" data-astro-cid-megloulf> <div class="form-group" data-astro-cid-megloulf> <label for="title" data-astro-cid-megloulf>Tytuł tematu *</label> <input type="text" id="title" name="title" required placeholder="np. Python – Dekoratory" data-astro-cid-megloulf> </div> <div class="form-group" data-astro-cid-megloulf> <label for="category" data-astro-cid-megloulf>Kategoria *</label> <div class="input-with-hint" data-astro-cid-megloulf> <input type="text" id="category" name="category" required placeholder="np. Python" list="categoryList" data-astro-cid-megloulf> <datalist id="categoryList" data-astro-cid-megloulf> ${allCategories.map((cat) => renderTemplate`<option${addAttribute(cat, "value")} data-astro-cid-megloulf></option>`)} </datalist> </div> <p class="hint" data-astro-cid-megloulf>Wybierz istniejącą lub wpisz nową kategorię</p> </div> <div class="form-group" data-astro-cid-megloulf> <label for="status" data-astro-cid-megloulf>Status</label> <select id="status" name="status" data-astro-cid-megloulf> <option value="planowane" data-astro-cid-megloulf>○ Planowane</option> <option value="w_trakcie" data-astro-cid-megloulf>⟳ W trakcie</option> <option value="zrobione" data-astro-cid-megloulf>✓ Zrobione</option> </select> </div> <div id="formMsg" class="form-msg hidden" data-astro-cid-megloulf></div> <div class="form-actions" data-astro-cid-megloulf> <button type="submit" class="btn-primary" data-astro-cid-megloulf>Utwórz temat</button> <a href="/admin" class="btn-secondary" data-astro-cid-megloulf>Anuluj</a> </div> </form> ` }));
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/admin/nowy-temat.astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/admin/nowy-temat.astro";
const $$url = "/admin/nowy-temat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$NowyTemat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
