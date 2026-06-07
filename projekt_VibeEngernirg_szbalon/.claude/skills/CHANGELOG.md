# CHANGELOG — poprawiony zestaw skilli (VibeEngineering)

Wersja paczki: **1.2.0** · Data: 2026-06-01
Bazuje na oryginalnym zestawie 18 skilli + 3 nowe. Razem **21 skilli**.

## Nowe skille (v1.2.0)

- **`test-design-enforcer`** — wymusza projektowanie testów (macierz: happy path / granice /
  ścieżki błędów / współbieżność), pisanie i uruchomienie testów oraz **dowód, że testy
  potrafią paść** (mutacja/celowe zepsucie kodu). Zakaz testów bez asercji i `pytest.raises(Exception)`.
  Domyka najpoważniejszą lukę zestawu (testy jako projekt, nie coverage theatre).
- **`resilience-enforcer`** — wymusza obsługę awarii na każdym wywołaniu przekraczającym
  granicę procesu (DB/HTTP/kolejka/cache): obowiązkowe timeouty, ograniczone retry z
  backoff+jitter (tenacity), circuit breaker, jawna degradacja (zakaz „fake-empty fallback"),
  oraz test wstrzykujący awarię.

### Wpięcia w istniejące skille (v1.2.0)
- `incident-debugging` — regression test projektowany wg `test-design-enforcer` (musi paść
  na starym kodzie, przejść na poprawce).

## Zmiany globalne (cały zestaw)

- **Ujednolicono frontmatter.** Wszystkie `name:` są teraz w `kebab-case` i zgodne z nazwą
  folderu; wszystkie skille mają `version: 1.0.0`. (Wcześniej 6 skilli „rodziny B" miało
  nazwy Title Case ze spacjami i brak wersji.)
- **Usunięto podwójne źródło prawdy.** Pliki `SKILL_PL.md` (6 szt.) przeniesiono z katalogu
  głównego skilla do `<skill>/docs/SKILL_PL.md` — kanonicznym źródłem jest teraz wyłącznie
  `SKILL.md` (angielski). Polskie wersje zachowane jako materiał pomocniczy.

## Nowy skill

- **`simplicity-gate`** — egzekwuje zwięzłość i blokuje „ceremonialny AI slop"
  (przeinżynierowanie): skan YAGNI, defensywny `try/except` bez ścieżki błędu, komentarze
  „what", sufit złożoności (`ruff C901,PLR`), reguła minimalnego diffu. Pełna konwencja
  zestawu (Hard Exit Criteria + Anti-Rationalization).

## Zmiany w istniejących skillach

### thin-router-enforcer
- Złagodzono absolutyzm „3 warstwy zawsze": dodano **regułę realnego zachowania warstwy** —
  pusty pass-through Service można zwinąć, zapisując uzasadniony wyjątek w Architectural Proof.
- Hard Exit: sztywne `return {` → 0 hits zamieniono na „model Pydantic LUB udokumentowany
  wyjątek" (np. health-check). Koniec z tworzeniem modeli-wydmuszek.
- Złagodzono 2 wiersze Anti-Rationalization (I/O zostaje w repo; znika przymus pustego Service).
- Dodano sekcję „Relationship to other skills".

### python-quality-gate
- Rozszerzono z 6 do 8 kroków: dodano **complexity ceiling** (`ruff --select C901,PLR…`),
  **coverage** (`pytest --cov --cov-fail-under=80`), **`pip-audit`** (CVE w zależnościach).
- Rozszerzono anti-slop scan o what-comments i docstringi-wydmuszki.
- Dodano disclaimer „grep = triage" oraz 2 nowe wiersze Excuse Shield (zwięzłość ≠ poprawność).
- Zaktualizowano Hard Exit Criteria (8 checków).

### boy-scout-rule
- **Gradacja ciężaru:** tryb pełny dla logiki/auth/DB/API, tryb lekki (linter + import test)
  dla zmian kosmetycznych. Koniec pełnego rytuału na literówkę.
- Wzorzec #8 (magic numbers) oznaczony jako **ocena manualna** (grep nie odróżni `3600` od `range(10)`).
- Dodano notę rozgraniczającą od `simplicity-gate` (martwy kod vs żywy-zbędny).
- Dostosowano wiersz Anti-Rationalization do trybu lekkiego.

### hard-gate-review
- Dodano **4. wymiar werdyktu: Simplicity** (✂️).
- Dodano **pytanie adwersarialne #7** („co mogę usunąć bez utraty wymagania?").
- Zaktualizowano liczniki pytań 6 → 7 w kryteriach i Excuse Shield.

### enterprise-code-auditor
- Dodano disclaimer „grep = triage, nie dowód" + wskazanie realnych narzędzi
  (`bandit`, `pip-audit`, `semgrep` OWASP).
- Dodano wiersz **Over-Engineering** w Quality Audit (`ruff C901,PLR` + przegląd manualny).
- Dodano sekcję **`## ✂️ SIMPLICITY AUDIT`** w raporcie.
- Złagodzono kryterium modularności `<400 linii` z twardego na sygnał do przeglądu.

### pydantic-security
- Naprawiono ścieżkę `.env`: liczona od `Path(__file__)`, nie sztywne `"../.env"` (zależne od CWD).
- Rozluźniono sztywny walidator `startswith("sk-")` (odrzucał klucze `sk-proj-`, innych dostawców)
  → walidacja niepustości i minimalnej długości; prefiks rekomendowany jako konfigurowalny.

### adr-writer
- Dodano regułę: wybrana opcja musi być **najprostszą spełniającą wymóg**; każda dodatkowa
  złożoność wymaga jawnego uzasadnienia w Consequences (YAGNI u źródła).

### domain-modeling
- Dodano regułę YAGNI na poziomie domeny: modeluj tylko to, co wynika z realnych reguł
  biznesowych; zakaz encji/agregatów „na zapas".

### code-review
- Dodano sekcję „Relationship to other skills" (rozgraniczenie od enterprise-code-auditor
  i threat-modeling) oraz disclaimer „grep = triage".

## Skille bez zmian merytorycznych (tylko ewentualnie frontmatter)
api-contract-review, database-migration-review, hallucination-shield, incident-debugging,
observability-check, performance-readiness, product-discovery, release-readiness, threat-modeling.

> Uwaga: z większych rekomendacji raportu (§8) zaimplementowano `test-design-enforcer` i
> `resilience-enforcer` (v1.2.0). Pozostają jako roadmapa: maszynowy kontrakt OpenAPI
> (schemathesis) oraz skill-orkiestrator (meta-pipeline ustalający kolejność skilli dla
> typu zadania) — wymagają Twoich decyzji projektowych.
