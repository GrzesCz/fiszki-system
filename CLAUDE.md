# CLAUDE.md

Ten plik zawiera wskazówki dla Claude Code (claude.ai/code) podczas pracy w tym repozytorium.

## Polecenia

```bash
npm run dev        # Uruchom serwer deweloperski (astro dev)
npm run build      # Zbuduj wersję produkcyjną
npm run preview    # Podgląd wersji produkcyjnej
npm run new-topic  # Skrypt do tworzenia nowego tematu przez CLI
```

Projekt nie posiada zestawu testów automatycznych.

## Architektura

Aplikacja **Astro SSR** (tryb serwera, adapter Node standalone) — osobisty system wiedzy i fiszek z treścią w języku polskim.

### Dwie kolekcje treści (`src/content.config.ts`)

- **`fiszki`** — zestawy fiszek, przechowywane jako pliki `.json` w `src/content/fiszki/`. Każdy plik zawiera `title`, `category`, `status` oraz tablicę `cards` z obiektami `{ cat, catLabel, q, a }`.
- **`notatki`** — notatki edukacyjne, przechowywane jako pliki `.md` w `src/content/notatki/` (zagnieżdżone podkatalogi są dozwolone). Pola frontmattera: `title`, `category`, `status`, `hidden`, `next_review_date`, `review_count` oraz `mindmaps` (tablica `{ file, rotation, zoom }`).

### Enum statusu (używany w obu kolekcjach)

`planowane` | `w_trakcie` | `zrobione`

W widoku ucznia (`/`) pojawiają się tylko elementy ze statusem `w_trakcie` lub `zrobione`. Elementy `planowane` są widoczne wyłącznie w `/admin`.

### Trasy stron

| Trasa | Przeznaczenie |
|---|---|
| `/` | Strona główna ucznia — aktywne kategorie jako kafelki z datami powtórek |
| `/kategoria/[kategoria]` | Notatki i zestawy fiszek dla danej kategorii |
| `/notatki/[...slug]` | Renderuje pojedynczą notatkę (Markdown → HTML) z przyciskiem powtórki |
| `/tematy/[slug]` | Sesja nauki fiszek (interfejs odwracanych kart ze skrótami klawiszowymi) |
| `/admin` | Panel zarządzania — akordeonowa lista całej treści według kategorii |
| `/admin/nowy-temat` | Formularz tworzenia nowego zestawu fiszek |
| `/admin/upload-notatka` | Formularz wgrywania pliku `.md` z notatką |
| `/admin/fiszki/[slug]` | Edycja kart w zestawie fiszek |
| `/admin/mapa/[...slug]` | Zarządzanie mapami myśli przypisanymi do notatki |
| `/viewer` | Samodzielna przeglądarka map myśli |

### Trasy API (wszystkie w `src/pages/api/`)

- `POST /api/tematy` — utwórz nowy plik JSON z zestawem fiszek
- `POST /api/notatki` — wgraj plik `.md` (dodaje frontmatter jeśli go brak)
- `PUT /api/notatki/[...slug]` — zaktualizuj pola frontmattera (`status`, `category`, `next_review_date`, `review_count`, `mindmaps`, `mermaidCode` itd.)
- `DELETE /api/notatki/[...slug]` — usuń plik notatki
- `PUT /api/fiszki/[slug]` — zaktualizuj status zestawu fiszek
- `DELETE /api/fiszki/[slug]` — usuń plik JSON z fiszkami
- `POST /api/upload-map` / `DELETE /api/delete-map` — zarządzaj plikami map myśli

### Kluczowe biblioteki (`src/lib/`)

- `find-note-md.ts` — rozwiązuje slug z URL do bezwzględnej ścieżki pliku `.md`; obsługuje zagnieżdżone ścieżki i dopasowanie bez rozróżniania wielkości liter (ważne na Windows).
- `mindmaps-frontmatter.ts` — odczytuje i zapisuje tablicę `mindmaps` w frontmatterze; obsługuje migrację z przestarzałego pola `mindmap` (pojedynczy string).

### Powtarzanie z odstępami (Spaced Repetition)

Po kliknięciu „Oznacz jako powtórzone" na stronie notatki, przeglądarka wywołuje `PUT /api/notatki/[...slug]` z `{ next_review_date, review_count }`. Interwały to `[1, 3, 7, 14, 30, 60, 90]` dni. Komponent `ReviewSuggestion.astro` odczytuje frontmatter bezpośrednio z pliku (nie z cache Astro), aby wyświetlić baner przypominający o zaległej powtórce.

### Mapy myśli

Do notatki można przypisać jedną lub więcej map myśli. Pliki przechowywane są w `public/maps/`. Pole `mindmaps` w frontmatterze to tablica; przy kolejnym żądaniu PUT przestarzałe pole `mindmap` (string) jest automatycznie migrowane do nowego formatu.

### Rozwiązywanie slugów notatek

Notatki znajdują się w zagnieżdżonych podkatalogach (np. `src/content/notatki/pytest/pytest-notatki.md`). ID kolekcji Astro to ścieżka względna bez `.md` (np. `pytest/pytest-notatki`). Adresy URL korzystają z tej pełnej ścieżki. Funkcja `findNoteMdPath()` obsługuje zarówno pełną ścieżkę względną, jak i samą nazwę pliku (dla wstecznej kompatybilności).
