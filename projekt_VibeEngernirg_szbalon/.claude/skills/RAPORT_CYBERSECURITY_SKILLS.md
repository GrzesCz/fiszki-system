# Raport: oficjalne security od Anthropic — czy i jak dodać do Twojego zestawu?

> **Data:** 2026-06-07
> **Zakres:** **wyłącznie oficjalne** źródła bezpieczeństwa Anthropic. Repozytoria społecznościowe (np. `mukul975`, Phoenix) celowo pominięte.
> **Charakter:** raport doradczy. **Nic nie zostało zmienione** w Twoich skillach.

---

## 1. TL;DR

Istnieje **jedno** oficjalne repozytorium Anthropic dla bezpieczeństwa kodu: **`anthropics/claude-code-security-review`** (licencja MIT). Jego sednem jest komenda **`/security-review`**, którą **masz już wbudowaną** w Claude Code — to gotowy, oficjalny, diff-aware SAST. Najlepszy ruch: zacznij jej *świadomie używać* przed każdym merge i **dodaj GitHub Action do CI** repo, by skan odpalał się automatycznie na każdym PR. Nie utrzymujesz silnika — robi to Anthropic. Osobno istnieje wbudowana w produkt funkcja „Claude Code Security" (skan + sugestie łatek) — to feature, nie repo do sklonowania.

---

## 2. Co masz dzisiaj (kontekst)

Twój zestaw (`v1.2.0`, 21 skilli) to **Secure SDLC dla Senior Enterprise Python/FastAPI** — skille deweloperskie, które pomagają *budować* bezpieczny kod. Część około-bezpieczeństwowa, którą już posiadasz:

| Skill | Rola |
|---|---|
| `threat-modeling` | STRIDE → `docs/threat_model.md` + risk register |
| `pydantic-security` | `SecretStr`, fail-fast, `.env.example`, zakaz `os.getenv` |
| `enterprise-code-auditor` | pełny audyt (grep + sugestia `bandit`/`pip-audit`/`semgrep`) |
| `adversarial-red-teamer` | łamanie własnego kodu, dowód testem |
| `code-review` / `hard-gate-review` | recenzja i twarda bramka jakości (`security_ok`) |
| `database-migration-review` | bezpieczeństwo migracji |

Brakuje Ci w tym **automatycznego, diff-aware skanu na bramce CI dla każdego PR** — i dokładnie tę lukę domyka oficjalne narzędzie poniżej.

---

## 3. Jedyne oficjalne repo: `anthropics/claude-code-security-review` ⭐

🔗 https://github.com/anthropics/claude-code-security-review · **Licencja MIT** · org. `anthropics` · używane przez 240+ projektów · blog: *Automate Security Reviews with Claude Code*.

### 3.1. Dwa tryby, ten sam silnik
1. **GitHub Action** — automatyczny, **diff-aware** SAST: na każdym Pull Requeście analizuje *tylko zmienione pliki*, komentuje konkretne linie, opcjonalnie wrzuca wyniki jako artefakt.
2. **Slash-command `/security-review`** — **identyczna analiza** uruchamiana lokalnie w Claude Code. **Masz go już wbudowanego** (widać na liście dostępnych skilli) — nie musisz nic instalować.

### 3.2. Co realnie zawiera repo (nie czarna skrzynka)
- `claudecode/prompts.py` — szablon promptu audytu (możesz podejrzeć logikę),
- `claudecode/findings_filter.py` + `claude_api_client.py` — **dwustopniowe filtrowanie false-positive** (drugi przebieg Claude obala/potwierdza własne znaleziska),
- `claudecode/github_action_audit.py` — główny skrypt Action,
- `claudecode/evals/` — **framework ewaluacyjny** do testowania na dowolnych PR-ach,
- `.claude/commands/security-review.md` — definicja slash-commanda (możesz **skopiować i edytować** pod własne reguły).

### 3.3. Co wykrywa
Injection (SQL/command/LDAP/XPath/NoSQL/XXE), broken auth / authz / IDOR / privilege escalation, hardcoded secrets / PII / wrażliwe logi, słaba kryptografia, braki walidacji, **business logic flaws** (race / TOCTOU), config security, **supply chain**, RCE (deserializacja/pickle/eval), XSS. **Language-agnostic** — działa też na JS/Astro (Twoja `fiszki-system`), nie tylko na Pythonie.

### 3.4. Kluczowe wejścia Action

| Wejście | Po co | Domyślnie |
|---|---|---|
| `claude-api-key` | klucz API (wymagany, generuje koszty) | — |
| `comment-pr` | komentarze z findings na PR | `true` |
| `exclude-directories` | pominięcie katalogów | — |
| `custom-security-scan-instructions` | **własne reguły** dopisane do promptu audytu | — |
| `false-positive-filtering-instructions` | **własna** logika filtrowania FP | — |
| `claude-model` | model | `claude-opus-4-1` |
| `claudecode-timeout` | limit (min) | `20` |
| `run-every-commit` | skan każdego commita (omija cache) | `false` |

**Konfigurowalność = przewaga:** wstrzykniesz własne instrukcje skanowania (np. pod FastAPI/Astro) i własny filtr FP **bez forka silnika**.

### 3.5. Ograniczenia (świadomie)
- **Nie jest zahardenowany przeciw prompt-injection** → używaj tylko na **zaufanych PR-ach**; dla repo publicznego włącz „Require approval for all external contributors".
- **Diff-aware tylko dla PR** — skanuje zmiany, nie cały kod historyczny (pełny skan → `/security-review` lokalnie na szerszym zakresie).
- Wymaga klucza API z włączonym Claude Code → **koszt API** przy każdym uruchomieniu.
- Domyślny filtr FP odrzuca m.in. DoS, rate-limiting, generyczną walidację bez udowodnionego wpływu, open-redirect — jeśli Ci na nich zależy, **nadpisz** przez `false-positive-filtering-instructions`.

### 3.6. Relacja do Twoich skilli
To **uzupełnienie, nie zastępstwo**. Twój `enterprise-code-auditor` robi głęboki, sterowany przez Ciebie audyt całości; `code-review`/`hard-gate-review` to bramki jakości. Oficjalny `/security-review` dokłada szybki, automatyczny, **diff-aware** przegląd *każdej zmiany* na CI — warstwa, której dziś nie masz.

---

## 4. Druga rzecz oficjalna (dla porządku): wbudowana funkcja „Claude Code Security"

🔗 https://www.anthropic.com/news/claude-code-security — **to nie repo**, lecz funkcja produktu: skan podatności + sugestie łatek do akceptacji człowieka, wykrywanie błędów logiki biznesowej / broken access control, wieloetapowa weryfikacja (Claude „obala własne znaleziska"), ocena severity. Stricte defensywna, „w rękach obrońców". Nic do klonowania — używasz jej z poziomu produktu.

---

## 5. Rekomendacja końcowa

1. **Używaj wbudowanego `/security-review`** przed każdym merge — masz go za darmo w Claude Code, zero instalacji.
2. **Dodaj GitHub Action `anthropics/claude-code-security-review` do CI** (`.github/workflows/`), aby diff-aware SAST odpalał się automatycznie na każdym PR. Skonfiguruj `custom-security-scan-instructions` pod swój stack i ewentualnie `false-positive-filtering-instructions`.
3. **Traktuj to jako dodatek do swoich skilli**, nie zamiennik — `enterprise-code-auditor` + `threat-modeling` + `pydantic-security` zostają jako Twój głęboki, sterowany audyt; oficjalny skan domyka warstwę „automatyczna bramka na PR".

To **najpewniejszy** ruch security z możliwych, bo jako jedyny jest oficjalnie utrzymywany przez Anthropic.

---

## Źródła (wyłącznie oficjalne)

- [anthropics/claude-code-security-review — jedyne oficjalne repo (MIT)](https://github.com/anthropics/claude-code-security-review)
- [Anthropic — Automate Security Reviews with Claude Code (blog)](https://www.anthropic.com/news/automate-security-reviews-with-claude-code)
- [Anthropic — Claude Code Security (wbudowana funkcja produktu)](https://www.anthropic.com/news/claude-code-security)
