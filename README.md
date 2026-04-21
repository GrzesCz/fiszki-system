# Centrum Wiedzy — Fiszki EDU

Osobisty system zarządzania wiedzą zbudowany w **Astro SSR** (tryb serwera, adapter Node.js standalone). Łączy notatki Markdown, interaktywne fiszki JSON, mapy myśli i spaced repetition w jednej aplikacji.

---

## Spis treści

1. [Architektura](#architektura)
2. [Struktura katalogów](#struktura-katalogów)
3. [Kolekcje treści](#kolekcje-treści)
4. [Trasy stron](#trasy-stron)
5. [API — trasy backendu](#api--trasy-backendu)
6. [Panel administracyjny](#panel-administracyjny)
7. [Strona kategorii — Centrum Dowodzenia](#strona-kategorii--centrum-dowodzenia)
8. [Kluczowe biblioteki](#kluczowe-biblioteki)
9. [Sesja fiszek](#sesja-fiszek)
10. [Generowanie slugów](#generowanie-slugów)
11. [Spaced Repetition](#spaced-repetition)
12. [Mapy myśli](#mapy-myśli)
13. [Niestandardowe zakładki admina](#niestandardowe-zakładki-admina)
14. [Docker i wdrożenie](#docker-i-wdrożenie)
15. [Polecenia deweloperskie](#polecenia-deweloperskie)
16. [Testy](#testy)
17. [Zmienne CSS](#zmienne-css-design-system)

---

## Architektura

| Warstwa | Technologia |
|---|---|
| Framework | Astro 6.x — tryb SSR (`output: 'server'`) |
| Adapter | `@astrojs/node` — standalone (Node.js HTTP server) |
| Styl | Własny `src/styles/fiszki.css` + Tailwind (`@tailwindcss/typography`) |
| Fonty | Syne (nagłówki), JetBrains Mono (kod/monospace) |
| Treść | Pliki `.md` (notatki) i `.json` (fiszki) na dysku |
| Parsowanie MD | `gray-matter` (frontmatter) + `marked` (renderowanie Markdown) |
| Diagramy | Mermaid.js (renderowane client-side z CDN jsdelivr) |
| Testy | Vitest (31 testów w `src/lib/*.test.ts`) |
| Konteneryzacja | Docker Compose (multi-stage build, `node:22-alpine`) |
| Runtime | Node.js 22+, `./dist/server/entry.mjs` |

**Ważne:** Aplikacja działa w trybie SSR — każde żądanie trafia do serwera. Pliki treści są odczytywane z dysku przy każdym żądaniu, co umożliwia dynamiczne zmiany przez API bez rebuildu.

---

## Struktura katalogów

```
fiszki-system/
├── src/
│   ├── content/
│   │   ├── notatki/          # Pliki .md (mogą być zagnieżdżone w podkatalogach)
│   │   └── fiszki/           # Pliki .json (zestawy fiszek)
│   ├── data/
│   │   └── custom-tabs.json  # Konfiguracja niestandardowych zakładek admina
│   ├── layouts/
│   │   └── BaseLayout.astro  # Wspólny layout (header, Mermaid init, fonty)
│   ├── components/
│   │   └── ReviewSuggestion.astro  # Baner o zaległej powtórce
│   ├── lib/
│   │   ├── read-content.ts          # getNotatki(), getFiszki()
│   │   ├── find-note-md.ts          # Rozwiązuje slug URL → bezwzględna ścieżka .md
│   │   ├── mindmaps-frontmatter.ts  # Odczyt/zapis tablicy mindmaps w frontmatterze
│   │   └── render-note-markdown.ts # Renderuje .md → HTML (marked, GFM). Omija astro:content.
│   ├── pages/
│   │   ├── index.astro
│   │   ├── kategoria/[kategoria].astro
│   │   ├── notatki/[...slug].astro
│   │   ├── tematy/[slug].astro
│   │   ├── viewer.astro
│   │   ├── admin/
│   │   │   ├── index.astro
│   │   │   ├── nowy-temat.astro
│   │   │   ├── upload-notatka.astro
│   │   │   ├── fiszki/[slug].astro
│   │   │   └── mapa/[...slug].astro
│   │   └── api/
│   │       ├── tabs.ts               # GET/POST /api/tabs
│   │       ├── tabs/[id].ts          # DELETE /api/tabs/[id]
│   │       ├── tematy.ts             # POST /api/tematy
│   │       ├── notatki.ts            # POST /api/notatki
│   │       ├── notatki/[...slug].ts  # PUT/DELETE /api/notatki/[...slug]
│   │       ├── fiszki/[slug].ts      # PUT/DELETE /api/fiszki/[slug]
│   │       ├── kategoria/[kategoria].ts
│   │       ├── upload-map.ts
│   │       └── delete-map.ts
│   ├── styles/
│   │   └── fiszki.css
│   └── content.config.ts
├── public/
│   └── maps/                   # Obrazki map myśli (.png, .jpg, .svg)
├── scripts/
│   ├── new-topic.js                # CLI: npm run new-topic -- <kategoria> <slug>
│   ├── sync-notes.js               # Import notatek z innego folderu (wymaga edycji ścieżki)
│   ├── fix-relative-paths.js       # Post-build: naprawia ścieżki absolutne → relatywne
│   ├── docker-start.ps1            # Czeka na Dockera, potem `docker compose up -d`
│   ├── install-windows-autostart.ps1
│   └── uninstall-windows-autostart.ps1
├── CLAUDE.md                   # Wskazówki dla Claude Code
├── docker-compose.yml
└── Dockerfile
```

---

## Kolekcje treści

### Notatki (`src/content/notatki/**/*.md`)

Pełny schemat z `src/content.config.ts`:

```yaml
---
title: "Tytuł notatki"             # wymagane
category: "NazwaKategorii"         # opcjonalne
related_flashcards: "slug-fiszek"  # opcjonalny link do powiązanego zestawu fiszek
status: "planowane"                # planowane | w_trakcie | zrobione (default: planowane)
hidden: false                      # true = notatka pomocnicza (default: false)
type: "notatka"                    # notatka | mapa (default: notatka)
mindmaps:                          # tablica map myśli (NOWY format)
  - file: "mapa.png"
  - file: "diagram.png"
    rotation: 90                   # stopnie (default: 0)
    zoom: 120                      # PROCENT (default: 100) — uwaga: nie mnożnik!
# Legacy (automatycznie migrowane):
mindmap: "stara-mapa.png"          # string — deprecated
mindmap_rotation: 0
mindmap_zoom: 100
# Spaced repetition:
review_count: 0                    # licznik powtórek (default: 0)
next_review_date: "2025-06-01"     # ISO YYYY-MM-DD (opcjonalne)
---
```

Notatki mogą być zagnieżdżone (np. `notatki/pytest/pytest-notatki.md`). ID w kolekcji Astro to ścieżka bez rozszerzenia (np. `pytest/pytest-notatki`).

> **Migracja legacy:** pola `mindmap: string`, `mindmap_rotation`, `mindmap_zoom` są automatycznie konwertowane do `mindmaps: MindmapItem[]` przy pierwszym zapisie przez API.

> **Normalizacja statusu:** `validStatus()` w `read-content.ts` normalizuje wartości — `w trakcie` (ze spacją) zostaje automatycznie skorygowane na `w_trakcie`, `zrobiony` na `zrobione`. Dzięki temu błędy w frontmatterze nie powodują „znikania" notatek z widoku ucznia.

### Fiszki (`src/content/fiszki/*.json`)

```json
{
  "title": "Tytuł zestawu",
  "subtitle": "Opcjonalny podtytuł",
  "category": "NazwaKategorii",
  "status": "planowane",
  "cards": [
    {
      "cat": "pojecie",
      "catLabel": "💡 Pojęcie",
      "q": "Pytanie",
      "a": "Odpowiedź"
    }
  ]
}
```

Typy kart (`cat`): `pojecie` | `kod` | `analogia` | `naming`

---

## Trasy stron

| Trasa | Plik | Opis |
|---|---|---|
| `/` | `index.astro` | Strona ucznia — kategorie jako kafelki z datami powtórek. Widoczne tylko elementy `w_trakcie` lub `zrobione`. |
| `/kategoria/[kategoria]` | `kategoria/[kategoria].astro` | **Centrum Dowodzenia tematem** — dzielony widok notatki + map myśli, przełączanie layoutu, drag & drop map, rotacja, upload/swap/usuwanie, przycisk powtórki, lista fiszek |
| `/notatki/[...slug]` | `notatki/[...slug].astro` | Prosta strona notatki z przyciskiem powtórki (funckjonalność przejęta głównie przez `/kategoria`) |
| `/tematy/[slug]` | `tematy/[slug].astro` | Sesja nauki fiszek (patrz [Sesja fiszek](#sesja-fiszek)) |
| `/admin` | `admin/index.astro` | Panel zarządzania — akordeony wg kategorii |
| `/admin/nowy-temat` | `admin/nowy-temat.astro` | Formularz tworzenia zestawu fiszek |
| `/admin/upload-notatka` | `admin/upload-notatka.astro` | Upload pliku `.md` — po wgraniu przekierowanie do `/notatki/{slug}` |
| `/admin/fiszki/[slug]` | `admin/fiszki/[slug].astro` | Edytor kart w zestawie |
| `/admin/mapa/[...slug]` | `admin/mapa/[...slug].astro` | Upload obrazka + edytor Mermaid |
| `/viewer` | `viewer.astro` | Samodzielna przeglądarka map myśli (parametry: `file`, `rotation`, `zoom`, `back`) |

---

## API — trasy backendu

### Zakładki admina

| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/tabs` | Zwraca tablicę niestandardowych zakładek |
| `POST` | `/api/tabs` | Dodaje zakładkę `{ label, icon?, href }` |
| `DELETE` | `/api/tabs/[id]` | Usuwa zakładkę po ID (timestamp `Date.now().toString()`) |

### Fiszki

| Metoda | Endpoint | Body | Opis |
|---|---|---|---|
| `POST` | `/api/tematy` | `{ title, category, status }` | Tworzy nowy plik JSON. Generuje slug z tytułu. Odpowiedź: `{ success, slug, filename }`. |
| `PUT` | `/api/fiszki/[slug]` | Dowolne pola fiszki | **Shallow merge** — aktualizuje dowolne pola JSON: `status`, `title`, `subtitle`, `category`, `cards` itd. |
| `DELETE` | `/api/fiszki/[slug]` | — | Usuwa plik JSON |

### Notatki

| Metoda | Endpoint | Body | Opis |
|---|---|---|---|
| `POST` | `/api/notatki` | `FormData { file, category, status }` | Upload `.md`. Jeśli plik nie ma frontmattera — dodaje go. Jeśli ma — **nadpisuje `category` i `status` z formularza**. Normalizuje status (`w trakcie` → `w_trakcie`). Odpowiedź: `{ success, filename, slug }`. |
| `PUT` | `/api/notatki/[...slug]` | JSON z polami do aktualizacji | Aktualizuje frontmatter: `status`, `category`, `hidden`, `type`, `review_count`, `next_review_date`, `mindmaps`, `mindmap_index` + `mindmap_rotation`/`mindmap_zoom`/`mindmap` (legacy → migracja), `mermaidCode` |
| `DELETE` | `/api/notatki/[...slug]` | — | Usuwa plik `.md` |

### Inne

| Metoda | Endpoint | Opis |
|---|---|---|
| `DELETE` | `/api/kategoria/[kategoria]` | Usuwa wszystkie notatki i fiszki z kategorii |
| `POST` | `/api/upload-map` | Zapisuje obrazek do `public/maps/` i przypisuje do notatki (FormData: `file`, `noteSlug`, opcjonalnie `replaceMapIndex`) |
| `POST` | `/api/delete-map` | Usuwa mapę z frontmattera notatki (po indeksie) i plik z dysku (sprawdza czy nie jest używany przez inne notatki) |

---

## Panel administracyjny

Nawigacja to pasek linków u góry strony — każda sekcja to osobna strona Astro (nie klasyczne taby JS).

### Główny dashboard (`/admin`)

- Treść w **akordeonach** wg kategorii (generowanych dynamicznie z danych — nowe kategorie pojawiają się po dodaniu pierwszego elementu)
- Każdy akordeon: Notatki Główne → Notatki Pomocnicze (ukryte) → Fiszki
- Każdy element: dropdown statusu (zmiana bez przeładowania + optymistyczny UI), ikony akcji, przycisk usunięcia
- Status akordeonu aktualizuje się automatycznie po zmianie statusu elementu
- Usuwanie przez modal potwierdzenia (również usuwanie całej kategorii z przyciskiem 🗑)
- Przycisk **⊕ Zakładka** → modal dodawania niestandardowej zakładki (link wewnętrzny `/admin/...` lub zewnętrzny URL)

### Formularz dodawania tematu (`/admin/nowy-temat`)

- Pole kategorii to `<input>` z `datalist` — podpowiada istniejące kategorie, ale akceptuje dowolny tekst (nowa kategoria)
- Po utworzeniu następuje przekierowanie do edytora fiszek `/admin/fiszki/[slug]`

### Formularz uploadu notatki (`/admin/upload-notatka`)

- Upload pliku `.md` z polami kategoria i status
- Jeśli plik ma już frontmatter — `category` i `status` z formularza **nadpisują** wartości w pliku
- Po pomyślnym wgraniu następuje przekierowanie do `/notatki/{slug}` (podgląd notatki)

### Stan w frontendzie

Zmiany statusu używają optymistycznego UI — zapis via `fetch` + rollback przy błędzie. Usuwanie po stronie UI (`.remove()`) bez przeładowania strony. Dodawanie zakładki → `location.reload()`.

---

## Strona kategorii — Centrum Dowodzenia

`/kategoria/[kategoria]` to główny widok pracy z tematem, łączący notatki, mapy myśli i fiszki:

- **Dzielony widok** (split-view) notatki po lewej + mapy myśli po prawej
- **3 tryby layoutu**: tylko notatki / podział / tylko mapa — zapisywane w `localStorage`
- **Miniatury map** na górze sekcji map — klik przewija do mapy, drag & drop zmienia kolejność (API `PUT` z `mindmaps`)
- **Akcje na mapach**: obrót w lewo/prawo (API `PUT` z `mindmap_rotation`), zamiana pliku (API `POST /upload-map` z `replaceMapIndex`), usuwanie (API `POST /delete-map` z cleanupem — sprawdza czy plik nie jest używany przez inne notatki)
- **Przycisk powtórki** (spaced repetition) — widoczny gdy `next_review_date <= dzisiaj`
- **Sekcja fiszek** na dole — kafelki prowadzące do `/tematy/[slug]`
- **Drag & drop upload** — dodawanie nowej mapy bezpośrednio na stronie kategorii

---

## Kluczowe biblioteki

### `src/lib/read-content.ts`

```typescript
getNotatki(): Promise<NotatkiEntry[]>
getFiszki():  Promise<FiszkiEntry[]>
```

Typy:
```typescript
NotatkiEntry = {
  id: string,  // np. "pytest/pytest-notatki"
  data: { title, category, status, hidden, mindmaps, review_count, next_review_date, type }
}
FiszkiEntry = {
  id: string,  // np. "openai-agent-sdk"
  data: { title, subtitle, category, status, cards[] }
}
```

Funkcja `validStatus()` normalizuje wartości statusu — `w trakcie` (ze spacją) → `w_trakcie`, `zrobiony` → `zrobione`. Pozwala to uniknąć błędów gdy w frontmatterze znajdzie się status bez podkreślenia.

### `src/lib/find-note-md.ts`

`findNoteMdPath(slug)` — rozwiązuje slug z URL do bezwzględnej ścieżki `.md`. Obsługuje zagnieżdżone ścieżki i dopasowanie case-insensitive (kluczowe na Windows). Używane przez wszystkie API operujące na notatkach.

### `src/lib/mindmaps-frontmatter.ts`

Odczytuje i zapisuje `mindmaps[]` w frontmatterze. Automatycznie migruje `mindmap: string` → `mindmaps: MindmapItem[]`.

### `src/lib/render-note-markdown.ts`

```typescript
renderNoteMarkdown(absPath: string): Promise<string>
```

Renderuje plik `.md` do HTML za pomocą `marked` (GFM, bez łamania wierszy). Omija `astro:content getCollection()`, czytając notatkę live z dysku — kluczowe w trybie SSR (Docker), gdzie `getCollection()` zwraca zamrożone dane z czasu builda.

---

## Sesja fiszek

Strona `/tematy/[slug]` to interaktywna sesja nauki:

- **Karta odwracana** (flip animation): przód = pytanie, tył = odpowiedź
- **Pasek postępu** `1 / N` + wypełniony progress
- **Przyciski oceny** (po odkryciu odpowiedzi): `✗ Nie wiedziałem` / `~ Prawie` / `✓ Wiedziałem`
- **Nawigacja**: Poprzednia / Tasuj / Następna
- **Statystyki** per sesja: liczba good/ok/bad
- **Ekran końcowy** po przejściu wszystkich kart

**Skróty klawiaturowe:**
| Klawisz | Akcja |
|---|---|
| `Space` | Odwróć kartę (pytanie ↔ odpowiedź) |
| `→` | Następna karta |
| `←` | Poprzednia karta |

---

## Generowanie slugów

**POST `/api/tematy`** generuje slug z `title` algorytmem:

```js
title.toLowerCase()
      .replace(/\s+/g, '-')         // spacje → myślniki
      .replace(/[^a-z0-9-]/g, '')   // usuń znaki spoza a-z, 0-9, -
      .slice(0, 60)                  // max 60 znaków
```

> **Uwaga:** polskie znaki (ą, ć, ę, ł, ń, ó, ś, ź, ż) zostają **usunięte**, nie zamienione. Np. "Łańcuch operacji" → `acuch-operacji`.

**Slug notatki** — w upload formularzu `POST /api/notatki` — nazwa pliku jest zachowywana bezpośrednio (np. `notatki_techniczne_Udemy_vibe_coding.md`). Odpowiedź API zwraca `slug` do przekierowania.

**Slug kategorii w URL** (`/kategoria/[kategoria]`) tworzony prościej:
```js
category.toLowerCase().replace(/\s+/g, '-')
```

---

## Spaced Repetition

Przycisk powtórki jest dostępny w dwóch miejscach:
1. `/kategoria/[kategoria]` — główny widok pracy z tematem (główny interfejs)
2. `/notatki/[slug]` — prosta strona notatki (interfejs zapasowy)

Mechanika:
1. Użytkownik klika „Oznacz jako powtórzone"
2. Frontend oblicza nową datę wg interwałów: `[1, 3, 7, 14, 30, 60, 90]` dni (indeks = `review_count`)
3. Wywołuje `PUT /api/notatki/[slug]` z `{ next_review_date, review_count }`
4. Frontmatter `.md` jest aktualizowany na dysku

`ReviewSuggestion.astro` wyświetla baner gdy `next_review_date <= dzisiaj`. Czyta frontmatter bezpośrednio z pliku (nie z cache Astro) by zawsze mieć aktualną datę.

---

## Mapy myśli

Dwa sposoby:

1. **Obrazek statyczny** — plik w `public/maps/`, referencja przez `mindmaps[].file` w frontmatterze
2. **Kod Mermaid** — blok ` ```mermaid ` w treści `.md`, renderowany client-side przez Mermaid.js (CDN jsdelivr)

`BaseLayout.astro` inicjalizuje Mermaid i zamienia bloki `<pre class="language-mermaid">` na `<div class="mermaid">` po załadowaniu DOM.

### Zarządzanie mapami na stronie kategorii (`/kategoria/[kategoria]`)

- **Drag & drop zmiany kolejności** — miniatury i karty map można przeciągać, API `PUT` z nową tablicą `mindmaps`
- **Obrót mapy** — przyciski ↺/↻ obracają o 90° (API `PUT` z `mindmap_index` + `mindmap_rotation`), bez przeładowania strony
- **Zamiana pliku** — przycisk 🔄 otwiera dialog wyboru pliku, API `POST /upload-map` z `replaceMapIndex`
- **Dodawanie nowej mapy** — strefa drop na dole sekcji map lub upload pliku
- **Usuwanie mapy** — przycisk 🗑️, API `POST /delete-map` z `noteSlug` i `mapIndex`; sprawdza czy plik nie jest używany przez inne notatki przed usunięciem
- **Fullscreen** — kliknięcie mapy otwiera `/viewer?file=...&rotation=...&zoom=...&back=...`

---

## Niestandardowe zakładki admina

Umożliwiają dodawanie skrótów nawigacyjnych w pasku admina bez edycji kodu.

**Dane:** `src/data/custom-tabs.json` — `[{ id: string, label: string, icon: string, href: string }]`

**Jak używać:**
1. W `/admin` kliknij **⊕ Zakładka**
2. Wypełnij: emoji (opcjonalne), nazwa, link (wewnętrzny `/admin/...` lub zewnętrzny URL)
3. Zakładka pojawia się w navbarze; przycisk **✕** (widoczny po najechaniu) usuwa ją

ID to timestamp (`Date.now().toString()`).

---

## Docker i wdrożenie

Aplikacja na `http://localhost:4321`. **Multi-stage build** na bazie `node:22-alpine`:

- **Stage 1 (builder)** — `npm install` + `npm run build` → `dist/`
- **Stage 2 (runtime)** — kopiuje `dist/`, `node_modules/`, `package.json`, uruchamia `node ./dist/server/entry.mjs`

Volumes w `docker-compose.yml`:
```yaml
- ./src/content:/app/src/content      # notatki + fiszki (persist na hoście)
- ./public/maps:/app/public/maps      # obrazki map myśli
- ./public/maps:/app/dist/client/maps # ⚠ MONTOWANE 2× — obrazki serwowane z build output
```

> **Gotcha:** `public/maps` jest montowane w dwóch miejscach, bo Astro SSR serwuje statyczne assety z `dist/client/`. Dzięki temu nowo zuploadowane obrazki są od razu dostępne bez rebuildu.

Zmienne środowiskowe (ustawione w Dockerfile/compose):
- `HOST=0.0.0.0`
- `PORT=4321`

```bash
docker compose up -d --build   # build + start
docker compose up -d           # start bez rebuildu
docker compose down            # stop
docker compose logs -f         # obserwuj logi
```

**Autostart Windows:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
.\scripts\install-windows-autostart.ps1
# Usuwa: .\scripts\uninstall-windows-autostart.ps1
```
Tworzy zadanie `CentrumWiedzy-Docker` w Harmonogramie zadań. Kontener ma `restart: always`.

---

## Polecenia deweloperskie

```bash
npm run dev        # serwer deweloperski (hot reload), port 4321
npm run build      # build produkcyjny
npm run preview    # podgląd buildu
npm run new-topic  # CLI do tworzenia nowego tematu
npm test           # testy jednostkowe (Vitest)
```

---

## Testy

Vitest, pliki `*.test.ts` obok testowanych modułów w `src/lib/`.

Aktualnie pokryte testami:
- `find-note-md.test.ts` — rozwiązywanie slugów notatek (zagnieżdżone ścieżki, case-insensitive, fallback)
- `mindmaps-frontmatter.test.ts` — odczyt/zapis `mindmaps[]`, migracja z legacy `mindmap: string`

```bash
npm test              # jednorazowe uruchomienie
npm test -- --watch   # tryb watch
```

Protokół: uruchom przed i po każdej zmianie. Przy naprawie buga — najpierw test reprodukujący błąd, potem fix. Obecnie **31 testów, wszystkie zielone**.

---

## Zmienne CSS (design system)

Zdefiniowane w `src/styles/fiszki.css`, dostępne globalnie:

```css
--accent       /* fioletowy — główny kolor akcentu */
--accent2      /* różowy/magenta — drugi akcent */
--surface      /* tło kart/paneli */
--surface2     /* ciemniejsze tło (inputy, dropdowny) */
--border       /* kolor obramowań */
--text         /* główny kolor tekstu */
--text-dim     /* wyszarzony tekst pomocniczy */
--green        /* status: zrobione */
--yellow       /* status: w_trakcie */
--red          /* usuwanie, błędy */
```