import { c as createComponent } from './astro-component_BDaEfx9E.mjs';
import 'piccolore';
import { a as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from './server_C0EKC7xv.mjs';
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
  const fiszka = fiszki.find((f) => f.id === slug);
  if (!fiszka) {
    return Astro2.redirect("/");
  }
  const { title, subtitle, cards, category } = fiszka.data;
  const categorySlug = category ? category.toLowerCase().replace(/\s+/g, "-") : "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "subtitle": subtitle }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="navigation-bar"> ', ' </div> <div id="progressWrap" class="progress-wrap"> <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div> <div class="progress-label" id="progressLabel">1 / ', '</div> </div> <div class="card-wrap" id="cardWrap"', `> <div class="card" id="card"> <div class="card-face card-front" id="cardFront"> <div class="category" id="cardCategory"></div> <div class="card-label">PYTANIE</div> <div class="card-question" id="cardQuestion"></div> <div class="card-hint pulse">↩ kliknij aby odkryć odpowiedź</div> </div> <div class="card-face card-back" id="cardBack"> <div class="category" id="cardCategoryBack"></div> <div class="card-label">ODPOWIEDŹ</div> <div class="answer-sep"></div> <div class="card-answer" id="cardAnswer"></div> <div class="card-next-hint" id="cardNextHint">↓ Przewiń w razie potrzeby · Przyciski na dole ekranu</div> </div> </div> </div> <div class="controls-wrap" id="controlsWrap"> <div class="btn-row" id="btnRow" style="display:none"> <button type="button" class="btn btn-bad" data-rate="bad">✗ Nie wiedziałem</button> <button type="button" class="btn btn-ok" data-rate="ok">~ Prawie</button> <button type="button" class="btn btn-good" data-rate="good">✓ Wiedziałem</button> </div> <div class="btn-nav" id="btnNav"> <button type="button" class="btn-secondary" id="btnPrev">← Poprzednia</button> <button type="button" class="btn-secondary" id="btnShuffle">⇄ Tasuj</button> <button type="button" class="btn-secondary" id="btnNext">Następna →</button> </div> </div> <div class="stats"> <div class="stat-box"> <div class="stat-num" id="statGood" style="color:var(--green)">0</div> <div class="stat-label">Wiedziałem</div> </div> <div class="stat-box"> <div class="stat-num" id="statOk" style="color:var(--yellow)">0</div> <div class="stat-label">Prawie</div> </div> <div class="stat-box"> <div class="stat-num" id="statBad" style="color:var(--red)">0</div> <div class="stat-label">Nie wiedziałem</div> </div> </div> <div class="finish-screen" id="finishScreen"> <div class="finish-emoji">🎯</div> <div class="finish-title">Sesja zakończona!</div> <div class="finish-stats" id="finishStats"></div> <button type="button" class="btn-secondary" id="btnRestartAll" style="margin-top:1rem">↺ Zacznij od nowa</button> <button type="button" class="btn-secondary" id="btnRestartBad">↺ Powtórz błędne</button> </div> <script>
    const cardWrap = document.getElementById('cardWrap');
    const cards = JSON.parse(cardWrap?.dataset.cards || '[]');
    let currentCards = [...cards];
    let currentIndex = 0;
    let isFlipped = false;
    let scores = { good: 0, ok: 0, bad: 0 };
    let rated = new Set();
    let ratedScores = {};

    const catClass = (cat) => ({ pojecie: 'cat-pojecie', kod: 'cat-kod', analogia: 'cat-analogia', naming: 'cat-naming' }[cat] || 'cat-pojecie');

    function render() {
      const card = currentCards[currentIndex];
      if (!card) return;
      const catCls = catClass(card.cat);
      document.getElementById('cardCategory').className = \`category \${catCls}\`;
      document.getElementById('cardCategory').textContent = card.catLabel;
      document.getElementById('cardCategoryBack').className = \`category \${catCls}\`;
      document.getElementById('cardCategoryBack').textContent = card.catLabel;
      document.getElementById('cardQuestion').textContent = card.q;
      document.getElementById('cardAnswer').innerHTML = card.a;
      document.getElementById('progressLabel').textContent = \`\${currentIndex + 1} / \${currentCards.length}\`;
      document.getElementById('progressFill').style.width = \`\${((currentIndex + 1) / currentCards.length) * 100}%\`;
      isFlipped = false;
      document.getElementById('card').classList.remove('flipped');
      document.getElementById('btnRow').style.display = 'none';
      document.getElementById('statGood').textContent = scores.good;
      document.getElementById('statOk').textContent = scores.ok;
      document.getElementById('statBad').textContent = scores.bad;
    }

    function flipCard() {
      if (isFlipped) return;
      isFlipped = true;
      document.getElementById('card').classList.add('flipped');
      document.getElementById('btnRow').style.display = 'grid';
    }

    function rate(score) {
      const cardIndex = cards.indexOf(currentCards[currentIndex]);
      if (!rated.has(currentIndex)) {
        scores[score]++;
        rated.add(currentIndex);
        ratedScores[cardIndex] = score;
      }
      nextCard();
    }

    function nextCard() {
      if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        render();
      } else {
        showFinish();
      }
    }

    function prevCard() {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    }

    function shuffleCards() {
      for (let i = currentCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
      }
      currentIndex = 0;
      rated.clear();
      render();
    }

    function showFinish() {
      document.getElementById('cardWrap').classList.add('hidden');
      document.getElementById('controlsWrap').classList.add('hidden');
      document.getElementById('progressWrap').classList.add('hidden');
      document.querySelector('.stats').classList.add('hidden');
      const pct = Math.round((scores.good / currentCards.length) * 100);
      document.getElementById('finishStats').innerHTML = \`
        <div class="stat-box"><div class="stat-num" style="color:var(--green)">\${scores.good}</div><div class="stat-label">Wiedziałem</div></div>
        <div class="stat-box"><div class="stat-num" style="color:var(--yellow)">\${scores.ok}</div><div class="stat-label">Prawie</div></div>
        <div class="stat-box"><div class="stat-num" style="color:var(--red)">\${scores.bad}</div><div class="stat-label">Nie wiedziałem</div></div>
        <div class="stat-box"><div class="stat-num" style="color:var(--accent)">\${pct}%</div><div class="stat-label">Wynik</div></div>
      \`;
      document.getElementById('finishScreen').classList.add('visible');
      if (scores.bad === 0) document.getElementById('btnRestartBad').style.display = 'none';
    }

    function restartAll() {
      currentCards = [...cards];
      currentIndex = 0;
      scores = { good: 0, ok: 0, bad: 0 };
      rated.clear();
      ratedScores = {};
      document.getElementById('cardWrap').classList.remove('hidden');
      document.getElementById('controlsWrap').classList.remove('hidden');
      document.getElementById('progressWrap').classList.remove('hidden');
      document.querySelector('.stats').classList.remove('hidden');
      document.getElementById('finishScreen').classList.remove('visible');
      document.getElementById('btnRestartBad').style.display = '';
      render();
    }

    function restartBad() {
      const badIndices = Object.keys(ratedScores).filter(k => ratedScores[k] === 'bad').map(Number);
      if (badIndices.length === 0) return;
      currentCards = badIndices.map(i => cards[i]);
      currentIndex = 0;
      scores = { good: 0, ok: 0, bad: 0 };
      rated.clear();
      document.getElementById('cardWrap').classList.remove('hidden');
      document.getElementById('controlsWrap').classList.remove('hidden');
      document.getElementById('progressWrap').classList.remove('hidden');
      document.querySelector('.stats').classList.remove('hidden');
      document.getElementById('finishScreen').classList.remove('visible');
      document.getElementById('btnRestartBad').style.display = badIndices.length > 0 ? '' : 'none';
      render();
    }

    cardWrap?.addEventListener('click', flipCard);
    document.querySelectorAll('[data-rate]').forEach(btn => btn.addEventListener('click', () => rate(btn.dataset.rate)));
    document.getElementById('btnPrev')?.addEventListener('click', prevCard);
    document.getElementById('btnNext')?.addEventListener('click', nextCard);
    document.getElementById('btnShuffle')?.addEventListener('click', shuffleCards);
    document.getElementById('btnRestartAll')?.addEventListener('click', restartAll);
    document.getElementById('btnRestartBad')?.addEventListener('click', restartBad);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); flipCard(); }
      if (e.code === 'ArrowRight') nextCard();
      if (e.code === 'ArrowLeft') prevCard();
      if (e.code === 'Digit1') rate('bad');
      if (e.code === 'Digit2') rate('ok');
      if (e.code === 'Digit3') rate('good');
    });

    render();
  <\/script> `], [" ", '<div class="navigation-bar"> ', ' </div> <div id="progressWrap" class="progress-wrap"> <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%"></div></div> <div class="progress-label" id="progressLabel">1 / ', '</div> </div> <div class="card-wrap" id="cardWrap"', `> <div class="card" id="card"> <div class="card-face card-front" id="cardFront"> <div class="category" id="cardCategory"></div> <div class="card-label">PYTANIE</div> <div class="card-question" id="cardQuestion"></div> <div class="card-hint pulse">↩ kliknij aby odkryć odpowiedź</div> </div> <div class="card-face card-back" id="cardBack"> <div class="category" id="cardCategoryBack"></div> <div class="card-label">ODPOWIEDŹ</div> <div class="answer-sep"></div> <div class="card-answer" id="cardAnswer"></div> <div class="card-next-hint" id="cardNextHint">↓ Przewiń w razie potrzeby · Przyciski na dole ekranu</div> </div> </div> </div> <div class="controls-wrap" id="controlsWrap"> <div class="btn-row" id="btnRow" style="display:none"> <button type="button" class="btn btn-bad" data-rate="bad">✗ Nie wiedziałem</button> <button type="button" class="btn btn-ok" data-rate="ok">~ Prawie</button> <button type="button" class="btn btn-good" data-rate="good">✓ Wiedziałem</button> </div> <div class="btn-nav" id="btnNav"> <button type="button" class="btn-secondary" id="btnPrev">← Poprzednia</button> <button type="button" class="btn-secondary" id="btnShuffle">⇄ Tasuj</button> <button type="button" class="btn-secondary" id="btnNext">Następna →</button> </div> </div> <div class="stats"> <div class="stat-box"> <div class="stat-num" id="statGood" style="color:var(--green)">0</div> <div class="stat-label">Wiedziałem</div> </div> <div class="stat-box"> <div class="stat-num" id="statOk" style="color:var(--yellow)">0</div> <div class="stat-label">Prawie</div> </div> <div class="stat-box"> <div class="stat-num" id="statBad" style="color:var(--red)">0</div> <div class="stat-label">Nie wiedziałem</div> </div> </div> <div class="finish-screen" id="finishScreen"> <div class="finish-emoji">🎯</div> <div class="finish-title">Sesja zakończona!</div> <div class="finish-stats" id="finishStats"></div> <button type="button" class="btn-secondary" id="btnRestartAll" style="margin-top:1rem">↺ Zacznij od nowa</button> <button type="button" class="btn-secondary" id="btnRestartBad">↺ Powtórz błędne</button> </div> <script>
    const cardWrap = document.getElementById('cardWrap');
    const cards = JSON.parse(cardWrap?.dataset.cards || '[]');
    let currentCards = [...cards];
    let currentIndex = 0;
    let isFlipped = false;
    let scores = { good: 0, ok: 0, bad: 0 };
    let rated = new Set();
    let ratedScores = {};

    const catClass = (cat) => ({ pojecie: 'cat-pojecie', kod: 'cat-kod', analogia: 'cat-analogia', naming: 'cat-naming' }[cat] || 'cat-pojecie');

    function render() {
      const card = currentCards[currentIndex];
      if (!card) return;
      const catCls = catClass(card.cat);
      document.getElementById('cardCategory').className = \\\`category \\\${catCls}\\\`;
      document.getElementById('cardCategory').textContent = card.catLabel;
      document.getElementById('cardCategoryBack').className = \\\`category \\\${catCls}\\\`;
      document.getElementById('cardCategoryBack').textContent = card.catLabel;
      document.getElementById('cardQuestion').textContent = card.q;
      document.getElementById('cardAnswer').innerHTML = card.a;
      document.getElementById('progressLabel').textContent = \\\`\\\${currentIndex + 1} / \\\${currentCards.length}\\\`;
      document.getElementById('progressFill').style.width = \\\`\\\${((currentIndex + 1) / currentCards.length) * 100}%\\\`;
      isFlipped = false;
      document.getElementById('card').classList.remove('flipped');
      document.getElementById('btnRow').style.display = 'none';
      document.getElementById('statGood').textContent = scores.good;
      document.getElementById('statOk').textContent = scores.ok;
      document.getElementById('statBad').textContent = scores.bad;
    }

    function flipCard() {
      if (isFlipped) return;
      isFlipped = true;
      document.getElementById('card').classList.add('flipped');
      document.getElementById('btnRow').style.display = 'grid';
    }

    function rate(score) {
      const cardIndex = cards.indexOf(currentCards[currentIndex]);
      if (!rated.has(currentIndex)) {
        scores[score]++;
        rated.add(currentIndex);
        ratedScores[cardIndex] = score;
      }
      nextCard();
    }

    function nextCard() {
      if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        render();
      } else {
        showFinish();
      }
    }

    function prevCard() {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    }

    function shuffleCards() {
      for (let i = currentCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
      }
      currentIndex = 0;
      rated.clear();
      render();
    }

    function showFinish() {
      document.getElementById('cardWrap').classList.add('hidden');
      document.getElementById('controlsWrap').classList.add('hidden');
      document.getElementById('progressWrap').classList.add('hidden');
      document.querySelector('.stats').classList.add('hidden');
      const pct = Math.round((scores.good / currentCards.length) * 100);
      document.getElementById('finishStats').innerHTML = \\\`
        <div class="stat-box"><div class="stat-num" style="color:var(--green)">\\\${scores.good}</div><div class="stat-label">Wiedziałem</div></div>
        <div class="stat-box"><div class="stat-num" style="color:var(--yellow)">\\\${scores.ok}</div><div class="stat-label">Prawie</div></div>
        <div class="stat-box"><div class="stat-num" style="color:var(--red)">\\\${scores.bad}</div><div class="stat-label">Nie wiedziałem</div></div>
        <div class="stat-box"><div class="stat-num" style="color:var(--accent)">\\\${pct}%</div><div class="stat-label">Wynik</div></div>
      \\\`;
      document.getElementById('finishScreen').classList.add('visible');
      if (scores.bad === 0) document.getElementById('btnRestartBad').style.display = 'none';
    }

    function restartAll() {
      currentCards = [...cards];
      currentIndex = 0;
      scores = { good: 0, ok: 0, bad: 0 };
      rated.clear();
      ratedScores = {};
      document.getElementById('cardWrap').classList.remove('hidden');
      document.getElementById('controlsWrap').classList.remove('hidden');
      document.getElementById('progressWrap').classList.remove('hidden');
      document.querySelector('.stats').classList.remove('hidden');
      document.getElementById('finishScreen').classList.remove('visible');
      document.getElementById('btnRestartBad').style.display = '';
      render();
    }

    function restartBad() {
      const badIndices = Object.keys(ratedScores).filter(k => ratedScores[k] === 'bad').map(Number);
      if (badIndices.length === 0) return;
      currentCards = badIndices.map(i => cards[i]);
      currentIndex = 0;
      scores = { good: 0, ok: 0, bad: 0 };
      rated.clear();
      document.getElementById('cardWrap').classList.remove('hidden');
      document.getElementById('controlsWrap').classList.remove('hidden');
      document.getElementById('progressWrap').classList.remove('hidden');
      document.querySelector('.stats').classList.remove('hidden');
      document.getElementById('finishScreen').classList.remove('visible');
      document.getElementById('btnRestartBad').style.display = badIndices.length > 0 ? '' : 'none';
      render();
    }

    cardWrap?.addEventListener('click', flipCard);
    document.querySelectorAll('[data-rate]').forEach(btn => btn.addEventListener('click', () => rate(btn.dataset.rate)));
    document.getElementById('btnPrev')?.addEventListener('click', prevCard);
    document.getElementById('btnNext')?.addEventListener('click', nextCard);
    document.getElementById('btnShuffle')?.addEventListener('click', shuffleCards);
    document.getElementById('btnRestartAll')?.addEventListener('click', restartAll);
    document.getElementById('btnRestartBad')?.addEventListener('click', restartBad);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); flipCard(); }
      if (e.code === 'ArrowRight') nextCard();
      if (e.code === 'ArrowLeft') prevCard();
      if (e.code === 'Digit1') rate('bad');
      if (e.code === 'Digit2') rate('ok');
      if (e.code === 'Digit3') rate('good');
    });

    render();
  <\/script> `])), maybeRenderHead(), categorySlug && renderTemplate`<a${addAttribute(`/kategoria/${categorySlug}`, "href")} class="btn-secondary btn-small">
← Wróć do kategorii
</a>`, cards.length, addAttribute(JSON.stringify(cards), "data-cards")) })}`;
}, "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/tematy/[slug].astro", void 0);

const $$file = "C:/Users/gczop/Desktop/APLIKACJE/fiszki-system/src/pages/tematy/[slug].astro";
const $$url = "/tematy/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
