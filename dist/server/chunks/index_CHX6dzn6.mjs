import { c as createComponent } from './astro-component_Bgxofd72.mjs';
import 'piccolore';
import { m as maybeRenderHead, g as addAttribute, r as renderTemplate, j as renderComponent } from './server_C1QNpGN5.mjs';
import { $ as $$BaseLayout } from './BaseLayout_kORAnSm-.mjs';
import 'clsx';
import { a as getNotatki, g as getFiszki } from './read-content_DQ7JbnzA.mjs';
import { g as getReviewableCategories, a as getVisibleNotes } from './note-visibility_zpMY0ZWA.mjs';

const $$ReviewSuggestion = createComponent(async ($$result, $$props, $$slots) => {
  const notatki = await getNotatki();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const reviewCategories = getReviewableCategories(notatki, today);
  function formatReviewDatePl(iso) {
    const s = iso.trim().slice(0, 10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return iso;
    return `${m[3]}.${m[2]}.${m[1]}`;
  }
  return renderTemplate`${reviewCategories.length > 0 && renderTemplate`${maybeRenderHead()}<section class="review-card mb-4" data-astro-cid-rgf4q3k4><div class="review-header" data-astro-cid-rgf4q3k4><span class="review-icon" data-astro-cid-rgf4q3k4>💡</span><span class="review-title" data-astro-cid-rgf4q3k4>Powtórki wymagane: ${reviewCategories.length}</span></div><div class="review-body" data-astro-cid-rgf4q3k4><p class="review-text" data-astro-cid-rgf4q3k4>
System wykrył zaległe powtórki w poniższych tematach.
</p><div class="review-list" data-astro-cid-rgf4q3k4>${reviewCategories.map((item) => renderTemplate`<a${addAttribute(`/kategoria/${item.slug}`, "href")} class="review-item" data-astro-cid-rgf4q3k4><div class="review-item-main" data-astro-cid-rgf4q3k4><h3 class="review-topic" data-astro-cid-rgf4q3k4>${item.category}</h3>${item.earliestNoteTitle && renderTemplate`<p class="review-note" data-astro-cid-rgf4q3k4>${item.earliestNoteTitle}</p>`}</div><div class="review-meta" data-astro-cid-rgf4q3k4><span data-astro-cid-rgf4q3k4>${formatReviewDatePl(item.earliestReviewDate)}</span><span data-astro-cid-rgf4q3k4>${item.notes.length === 1 ? "1 notatka" : `${item.notes.length} notatek`}</span></div></a>`)}</div><div class="review-task" data-astro-cid-rgf4q3k4><strong data-astro-cid-rgf4q3k4>Zadanie Feynmana:</strong> Spróbuj na głos wytłumaczyć wybrany temat "jak 5-latkowi", a następnie naszkicuj mapę myśli z pamięci.
</div></div></section>`}`;
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/components/ReviewSuggestion.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const notatki = await getNotatki();
  const fiszki = await getFiszki();
  const categoriesSet = /* @__PURE__ */ new Set();
  notatki.forEach((n) => {
    if (n.data.category) categoriesSet.add(n.data.category);
  });
  fiszki.forEach((f) => {
    if (f.data.category) categoriesSet.add(f.data.category);
  });
  const categories = Array.from(categoriesSet).sort();
  function categoryIsActive(category) {
    const notes = getVisibleNotes(notatki.filter((n) => n.data.category === category));
    const fiszkiCat = fiszki.filter((f) => f.data.category === category);
    const allItems = [...notes, ...fiszkiCat];
    return allItems.some((i) => i.data.status === "w_trakcie" || i.data.status === "zrobione");
  }
  const activeCategories = categories.filter(categoryIsActive);
  function earliestReviewInCategory(notes) {
    const dates = notes.map((n) => n.data.next_review_date).filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}/.test(d.trim()));
    if (dates.length === 0) return void 0;
    return dates.reduce((a, b) => a <= b ? a : b);
  }
  function formatReviewDatePl(iso) {
    const s = iso.trim().slice(0, 10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return iso;
    return `${m[3]}.${m[2]}.${m[1]}`;
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Centrum Wiedzy", "subtitle": "Wybierz grupę tematyczną", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "ReviewSuggestion", $$ReviewSuggestion, { "data-astro-cid-j7pv25f6": true })} ${activeCategories.length === 0 && renderTemplate`${maybeRenderHead()}<div class="empty-state" data-astro-cid-j7pv25f6> <div class="empty-icon" data-astro-cid-j7pv25f6>📚</div> <p data-astro-cid-j7pv25f6>Brak aktywnych tematów.</p> <p class="empty-hint" data-astro-cid-j7pv25f6>Dodaj tematy i oznacz je jako „W trakcie" lub „Zrobione" w panelu zarządzania.</p> <a href="/admin" class="btn-to-admin" data-astro-cid-j7pv25f6>Przejdź do panelu →</a> </div>`}<div class="tiles-grid project-tiles" data-astro-cid-j7pv25f6> ${activeCategories.map((category) => {
    const categoryNotes = getVisibleNotes(notatki.filter((n) => n.data.category === category));
    categoryNotes.filter((n) => n.data.type !== "mapa" && !n.data.mindmap);
    categoryNotes.filter((n) => n.data.type === "mapa" || !!n.data.mindmap);
    const categoryFiszki = fiszki.filter((f) => f.data.category === category);
    const allItems = [...categoryNotes, ...categoryFiszki];
    const hasInProgress = allItems.some((i) => i.data.status === "w_trakcie");
    const allDone = allItems.length > 0 && allItems.every((i) => i.data.status === "zrobione");
    const allPlanned = allItems.length > 0 && allItems.every((i) => i.data.status === "planowane");
    let statusClass;
    let statusBadge;
    if (allDone) {
      statusClass = "status-done";
      statusBadge = "✓ Zrobione";
    } else if (hasInProgress) {
      statusClass = "status-progress";
      statusBadge = "⟳ W trakcie";
    } else if (allPlanned) {
      statusClass = "status-planned";
      statusBadge = "○ Planowane";
    } else {
      statusClass = "status-progress";
      statusBadge = "⟳ W trakcie";
    }
    const slug = category.toLowerCase().replace(/\s+/g, "-");
    const nextReviewRaw = allDone ? earliestReviewInCategory(categoryNotes) : void 0;
    const nextReviewLabel = nextReviewRaw ? formatReviewDatePl(nextReviewRaw) : null;
    return renderTemplate`<a${addAttribute(`/kategoria/${slug}`, "href")}${addAttribute(`tile-link project-tile ${statusClass}`, "class")} data-astro-cid-j7pv25f6> <div class="tile-header" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>${category}</h2> <div class="tile-header-right" data-astro-cid-j7pv25f6> <span${addAttribute(`status-badge ${statusClass}`, "class")} data-astro-cid-j7pv25f6>${statusBadge}</span> ${allDone && (nextReviewLabel ? renderTemplate`<span class="tile-next-review" title="Następna powtórka (harmonogram według krzywej zapominania)" data-astro-cid-j7pv25f6>
🔄 ${nextReviewLabel} </span>` : renderTemplate`<span class="tile-next-review tile-next-review--muted" title="Ustal datę powtórki na stronie tematu (przycisk powtórki)" data-astro-cid-j7pv25f6>
🔄 —
</span>`)} </div> </div> <p class="tile-subtitle" data-astro-cid-j7pv25f6>
Baza wiedzy · ${categoryFiszki.length} zestawów fiszek
</p> </a>`;
  })} </div> ` })}`;
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/index.astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
