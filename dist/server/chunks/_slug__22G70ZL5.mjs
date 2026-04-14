import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { r as renderTemplate, d as defineScriptVars, a as renderComponent, m as maybeRenderHead, b as addAttribute } from './server_C0EKC7xv.mjs';
import { $ as $$BaseLayout } from './BaseLayout_CWewYqAY.mjs';
import { g as getCollection } from './_astro_content_CdwnSi5M.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const fiszki = await getCollection("fiszki");
  const entry = fiszki.find((f) => f.id === slug);
  const title = entry?.data.title || slug;
  const cards = entry?.data.cards || [];
  const category = entry?.data.category || "";
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", `
  const catLabels = { pojecie: '💡 Pojęcie', kod: '💻 Kod', analogia: '🔗 Analogia', naming: '🏷 Naming' };

  function createCardItem(index, card = { cat: 'pojecie', q: '', a: '' }) {
    const div = document.createElement('div');
    div.className = 'card-edit-item';
    div.dataset.index = index;
    div.innerHTML = \`
      <div class="card-edit-header">
        <span class="card-num">#\${index + 1}</span>
        <select class="cat-select" name="cat-\${index}">
          <option value="pojecie" \${card.cat === 'pojecie' ? 'selected' : ''}>💡 Pojęcie</option>
          <option value="kod" \${card.cat === 'kod' ? 'selected' : ''}>💻 Kod</option>
          <option value="analogia" \${card.cat === 'analogia' ? 'selected' : ''}>🔗 Analogia</option>
          <option value="naming" \${card.cat === 'naming' ? 'selected' : ''}>🏷 Naming</option>
        </select>
        <button class="btn-icon btn-delete-card" title="Usuń kartę">🗑</button>
      </div>
      <div class="card-edit-fields">
        <textarea class="card-q" name="q-\${index}" placeholder="Pytanie..." rows="2">\${card.q}</textarea>
        <textarea class="card-a" name="a-\${index}" placeholder="Odpowiedź..." rows="3">\${card.a}</textarea>
      </div>
    \`;
    div.querySelector('.btn-delete-card').addEventListener('click', () => div.remove());
    return div;
  }

  // Dodaj obsługę usuń do istniejących kart
  document.querySelectorAll('.btn-delete-card').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.card-edit-item').remove());
  });

  // Dodaj nową kartę
  document.getElementById('addCard').addEventListener('click', () => {
    const list = document.getElementById('cardsList');
    const count = list.querySelectorAll('.card-edit-item').length;
    const item = createCardItem(count);
    list.appendChild(item);
    item.scrollIntoView({ behavior: 'smooth' });
  });

  // Zapisz wszystkie
  document.getElementById('saveCards').addEventListener('click', async () => {
    const items = document.querySelectorAll('.card-edit-item');
    const cards = Array.from(items).map(item => {
      const cat = item.querySelector('.cat-select').value;
      return {
        cat,
        catLabel: catLabels[cat],
        q: item.querySelector('.card-q').value.trim(),
        a: item.querySelector('.card-a').value.trim(),
      };
    }).filter(c => c.q && c.a);

    const msg = document.getElementById('saveMsg');
    msg.className = 'form-msg';
    msg.textContent = 'Zapisywanie...';

    const res = await fetch(\`/api/fiszki/\${slug}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, cards }),
    });

    const json = await res.json();
    if (res.ok) {
      msg.className = 'form-msg success';
      msg.textContent = \`✓ Zapisano \${cards.length} fiszek!\`;
    } else {
      msg.className = 'form-msg error';
      msg.textContent = \`Błąd: \${json.error}\`;
    }
  });
})();<\/script>`], ["", " <script>(function(){", `
  const catLabels = { pojecie: '💡 Pojęcie', kod: '💻 Kod', analogia: '🔗 Analogia', naming: '🏷 Naming' };

  function createCardItem(index, card = { cat: 'pojecie', q: '', a: '' }) {
    const div = document.createElement('div');
    div.className = 'card-edit-item';
    div.dataset.index = index;
    div.innerHTML = \\\`
      <div class="card-edit-header">
        <span class="card-num">#\\\${index + 1}</span>
        <select class="cat-select" name="cat-\\\${index}">
          <option value="pojecie" \\\${card.cat === 'pojecie' ? 'selected' : ''}>💡 Pojęcie</option>
          <option value="kod" \\\${card.cat === 'kod' ? 'selected' : ''}>💻 Kod</option>
          <option value="analogia" \\\${card.cat === 'analogia' ? 'selected' : ''}>🔗 Analogia</option>
          <option value="naming" \\\${card.cat === 'naming' ? 'selected' : ''}>🏷 Naming</option>
        </select>
        <button class="btn-icon btn-delete-card" title="Usuń kartę">🗑</button>
      </div>
      <div class="card-edit-fields">
        <textarea class="card-q" name="q-\\\${index}" placeholder="Pytanie..." rows="2">\\\${card.q}</textarea>
        <textarea class="card-a" name="a-\\\${index}" placeholder="Odpowiedź..." rows="3">\\\${card.a}</textarea>
      </div>
    \\\`;
    div.querySelector('.btn-delete-card').addEventListener('click', () => div.remove());
    return div;
  }

  // Dodaj obsługę usuń do istniejących kart
  document.querySelectorAll('.btn-delete-card').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.card-edit-item').remove());
  });

  // Dodaj nową kartę
  document.getElementById('addCard').addEventListener('click', () => {
    const list = document.getElementById('cardsList');
    const count = list.querySelectorAll('.card-edit-item').length;
    const item = createCardItem(count);
    list.appendChild(item);
    item.scrollIntoView({ behavior: 'smooth' });
  });

  // Zapisz wszystkie
  document.getElementById('saveCards').addEventListener('click', async () => {
    const items = document.querySelectorAll('.card-edit-item');
    const cards = Array.from(items).map(item => {
      const cat = item.querySelector('.cat-select').value;
      return {
        cat,
        catLabel: catLabels[cat],
        q: item.querySelector('.card-q').value.trim(),
        a: item.querySelector('.card-a').value.trim(),
      };
    }).filter(c => c.q && c.a);

    const msg = document.getElementById('saveMsg');
    msg.className = 'form-msg';
    msg.textContent = 'Zapisywanie...';

    const res = await fetch(\\\`/api/fiszki/\\\${slug}\\\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, cards }),
    });

    const json = await res.json();
    if (res.ok) {
      msg.className = 'form-msg success';
      msg.textContent = \\\`✓ Zapisano \\\${cards.length} fiszek!\\\`;
    } else {
      msg.className = 'form-msg error';
      msg.textContent = \\\`Błąd: \\\${json.error}\\\`;
    }
  });
})();<\/script>`])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Fiszki: ${title}`, "subtitle": "Edytowanie zestawu fiszek", "data-astro-cid-koqi3nju": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-nav" data-astro-cid-koqi3nju> <a href="/admin" class="btn-secondary btn-small" data-astro-cid-koqi3nju>← Panel zarządzania</a> ${entry && renderTemplate`<a${addAttribute(`/tematy/${slug}`, "href")} class="btn-secondary btn-small" data-astro-cid-koqi3nju>👁 Podgląd fiszek</a>`} </div> <div class="cards-editor" id="cardsEditor" data-astro-cid-koqi3nju> <div class="editor-header" data-astro-cid-koqi3nju> <h3 class="section-label" data-astro-cid-koqi3nju>🃏 Karty w zestawie</h3> <button id="addCard" class="btn-primary btn-small" data-astro-cid-koqi3nju>+ Dodaj kartę</button> </div> <div id="cardsList" data-astro-cid-koqi3nju> ${cards.map((card, i) => renderTemplate`<div class="card-edit-item"${addAttribute(i, "data-index")} data-astro-cid-koqi3nju> <div class="card-edit-header" data-astro-cid-koqi3nju> <span class="card-num" data-astro-cid-koqi3nju>#${i + 1}</span> <select class="cat-select"${addAttribute(`cat-${i}`, "name")} data-astro-cid-koqi3nju> <option value="pojecie"${addAttribute(card.cat === "pojecie", "selected")} data-astro-cid-koqi3nju>💡 Pojęcie</option> <option value="kod"${addAttribute(card.cat === "kod", "selected")} data-astro-cid-koqi3nju>💻 Kod</option> <option value="analogia"${addAttribute(card.cat === "analogia", "selected")} data-astro-cid-koqi3nju>🔗 Analogia</option> <option value="naming"${addAttribute(card.cat === "naming", "selected")} data-astro-cid-koqi3nju>🏷 Naming</option> </select> <button class="btn-icon btn-delete-card" title="Usuń kartę" data-astro-cid-koqi3nju>🗑</button> </div> <div class="card-edit-fields" data-astro-cid-koqi3nju> <textarea class="card-q"${addAttribute(`q-${i}`, "name")} placeholder="Pytanie..." rows="2" data-astro-cid-koqi3nju>${card.q}</textarea> <textarea class="card-a"${addAttribute(`a-${i}`, "name")} placeholder="Odpowiedź..." rows="3" data-astro-cid-koqi3nju>${card.a}</textarea> </div> </div>`)} </div> <div id="saveMsg" class="form-msg hidden" data-astro-cid-koqi3nju></div> <div class="form-actions" data-astro-cid-koqi3nju> <button id="saveCards" class="btn-primary" data-astro-cid-koqi3nju>Zapisz wszystkie fiszki</button> </div> </div> ` }), defineScriptVars({ slug, title, category, initialCards: cards }));
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/admin/fiszki/[slug].astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/admin/fiszki/[slug].astro";
const $$url = "/admin/fiszki/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
