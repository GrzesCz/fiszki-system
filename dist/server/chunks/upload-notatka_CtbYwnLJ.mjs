import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { r as renderTemplate, a as renderComponent, m as maybeRenderHead, b as addAttribute } from './server_C0EKC7xv.mjs';
import { $ as $$BaseLayout } from './BaseLayout_CWewYqAY.mjs';
import { g as getCollection } from './_astro_content_CdwnSi5M.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$UploadNotatka = createComponent(async ($$result, $$props, $$slots) => {
  const notatki = await getCollection("notatki");
  const fiszki = await getCollection("fiszki");
  const allCategories = Array.from(/* @__PURE__ */ new Set([
    ...notatki.map((n) => n.data.category).filter(Boolean),
    ...fiszki.map((f) => f.data.category).filter(Boolean)
  ])).sort();
  return renderTemplate(_a || (_a = __template(["", " <script>\n  const fileInput = document.getElementById('file');\n  const fileName = document.getElementById('fileName');\n\n  fileInput.addEventListener('change', () => {\n    fileName.textContent = fileInput.files[0]?.name || '';\n  });\n\n  document.getElementById('uploadForm').addEventListener('submit', async (e) => {\n    e.preventDefault();\n    const form = e.target;\n    const formData = new FormData();\n    formData.append('file', fileInput.files[0]);\n    formData.append('category', form.category.value.trim());\n    formData.append('status', form.status.value);\n\n    const msg = document.getElementById('formMsg');\n    msg.className = 'form-msg';\n    msg.textContent = 'Wgrywanie...';\n\n    const res = await fetch('/api/notatki', {\n      method: 'POST',\n      body: formData,\n    });\n\n    const json = await res.json();\n    if (res.ok) {\n      msg.className = 'form-msg success';\n      msg.textContent = `✓ Notatka \"${json.filename}\" wgrana pomyślnie!`;\n      form.reset();\n      fileName.textContent = '';\n    } else {\n      msg.className = 'form-msg error';\n      msg.textContent = `Błąd: ${json.error}`;\n    }\n  });\n<\/script>"], ["", " <script>\n  const fileInput = document.getElementById('file');\n  const fileName = document.getElementById('fileName');\n\n  fileInput.addEventListener('change', () => {\n    fileName.textContent = fileInput.files[0]?.name || '';\n  });\n\n  document.getElementById('uploadForm').addEventListener('submit', async (e) => {\n    e.preventDefault();\n    const form = e.target;\n    const formData = new FormData();\n    formData.append('file', fileInput.files[0]);\n    formData.append('category', form.category.value.trim());\n    formData.append('status', form.status.value);\n\n    const msg = document.getElementById('formMsg');\n    msg.className = 'form-msg';\n    msg.textContent = 'Wgrywanie...';\n\n    const res = await fetch('/api/notatki', {\n      method: 'POST',\n      body: formData,\n    });\n\n    const json = await res.json();\n    if (res.ok) {\n      msg.className = 'form-msg success';\n      msg.textContent = \\`✓ Notatka \"\\${json.filename}\" wgrana pomyślnie!\\`;\n      form.reset();\n      fileName.textContent = '';\n    } else {\n      msg.className = 'form-msg error';\n      msg.textContent = \\`Błąd: \\${json.error}\\`;\n    }\n  });\n<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Dodaj Notatkę", "subtitle": "Wgraj plik Markdown (.md)", "data-astro-cid-eq5w73k4": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-nav" data-astro-cid-eq5w73k4> <a href="/admin" class="btn-secondary btn-small" data-astro-cid-eq5w73k4>← Panel zarządzania</a> </div> <form id="uploadForm" class="admin-form" enctype="multipart/form-data" data-astro-cid-eq5w73k4> <div class="form-group" data-astro-cid-eq5w73k4> <label for="file" data-astro-cid-eq5w73k4>Plik Markdown (.md) *</label> <div class="file-drop" id="fileDrop" data-astro-cid-eq5w73k4> <input type="file" id="file" name="file" accept=".md" required data-astro-cid-eq5w73k4> <div class="drop-hint" data-astro-cid-eq5w73k4> <span class="drop-icon" data-astro-cid-eq5w73k4>📄</span> <span data-astro-cid-eq5w73k4>Kliknij lub przeciągnij plik .md</span> <span id="fileName" class="file-name" data-astro-cid-eq5w73k4></span> </div> </div> </div> <div class="form-group" data-astro-cid-eq5w73k4> <label for="category" data-astro-cid-eq5w73k4>Kategoria *</label> <input type="text" id="category" name="category" required placeholder="np. Python" list="categoryList" data-astro-cid-eq5w73k4> <datalist id="categoryList" data-astro-cid-eq5w73k4> ${allCategories.map((cat) => renderTemplate`<option${addAttribute(cat, "value")} data-astro-cid-eq5w73k4></option>`)} </datalist> <p class="hint" data-astro-cid-eq5w73k4>Jeśli plik już ma frontmatter z kategorią, pole to jest ignorowane</p> </div> <div class="form-group" data-astro-cid-eq5w73k4> <label for="status" data-astro-cid-eq5w73k4>Status</label> <select id="status" name="status" data-astro-cid-eq5w73k4> <option value="planowane" data-astro-cid-eq5w73k4>○ Planowane</option> <option value="w_trakcie" data-astro-cid-eq5w73k4>⟳ W trakcie</option> <option value="zrobione" data-astro-cid-eq5w73k4>✓ Zrobione</option> </select> </div> <div id="formMsg" class="form-msg hidden" data-astro-cid-eq5w73k4></div> <div class="form-actions" data-astro-cid-eq5w73k4> <button type="submit" class="btn-primary" data-astro-cid-eq5w73k4>Wgraj notatkę</button> <a href="/admin" class="btn-secondary" data-astro-cid-eq5w73k4>Anuluj</a> </div> </form> ` }));
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/admin/upload-notatka.astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/admin/upload-notatka.astro";
const $$url = "/admin/upload-notatka";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$UploadNotatka,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
