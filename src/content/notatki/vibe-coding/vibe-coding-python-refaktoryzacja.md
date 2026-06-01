---
title: 'Praktyka: Refaktoryzacja i Code Review istniejącego kodu Python (Senior Audit)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-06-30'
review_count: 0
---
# Praktyka: Refaktoryzacja i Code Review istniejącej aplikacji Python

**Źródło:** `Superpowers_Raport.md`, kurs Udemy Vibe Coding (Ed Donner - Zagadnienie 4: Code Review Simona Willisona), `claude-code-skills-pisanie.md`, `rekomendacje_Eda_vibe_coding.md`.

**Cel:** Krok po kroku przeprowadzić Cię przez audyt i bezpieczną refaktoryzację istniejącego, dużego (lub legacy) projektu Python. Otrzymasz gotowe szablony `agents.md`, `plan.md`, hooki i konkretne komendy. Cały proces jest zaprojektowany w trybie **HITL** i **Read-Only Audit** - agent nigdy nie psuje produkcji bez Twojej zgody.

---

## Spis treści
1. [Filozofia: Audyt Read-Only przed Refaktoryzacją](#1-filozofia-audyt-read-only-przed-refaktoryzacją)
2. [Etap 0: Bezpieczne uchwycenie projektu (Twardy commit + branch)](#2-etap-0-bezpieczne-uchwycenie-projektu)
3. [Etap 1: Discovery - Mapowanie istniejącego kodu](#3-etap-1-discovery---mapowanie-istniejącego-kodu)
4. [Etap 2: Pisanie Konstytucji Audytora `agents.md`](#4-etap-2-pisanie-konstytucji-audytora-agentsmd)
5. [Etap 3: Pisanie Planu Audytu `plan.md`](#5-etap-3-pisanie-planu-audytu-planmd)
6. [Etap 4: Przełączanie modeli - Audyt Opusem](#6-etap-4-przełączanie-modeli---audyt-opusem)
7. [Etap 5: Workflow Code Review Simona Willisona](#7-etap-5-workflow-code-review-simona-willisona)
8. [Etap 6: Wyłapywanie Halucynacji w raporcie](#8-etap-6-wyłapywanie-halucynacji-w-raporcie)
9. [Etap 7: Refaktoryzacja - od raportu do PR](#9-etap-7-refaktoryzacja---od-raportu-do-pr)
10. [Etap 8: Walka z "Inteligentnym Nieposłuszeństwem"](#10-etap-8-walka-z-inteligentnym-nieposłuszeństwem)
11. [Zalecana struktura katalogów audytu](#11-zalecana-struktura-katalogów-audytu)

---

## 1. Filozofia: Audyt Read-Only przed Refaktoryzacją

### Zagadnienie
Największym błędem przy refaktoryzacji z agentem AI jest pozwolenie mu na **edycję kodu produkcyjnego** w trakcie analizy. Agent znajdzie 1 błąd, "popraw" go, niechcący psując 10 innych miejsc.

### Opis

#### Dlaczego dwie fazy?
1. **Faza Audytu (Read-Only):** Agent czyta cały kod, generuje **plik Markdown z raportem**. Niczego nie zmienia.
2. **Faza Refaktoryzacji:** Ty (HITL) czytasz raport, weryfikujesz halucynacje, akceptujesz tylko realne problemy, dopiero **wtedy** zlecasz wprowadzenie zmian (znowu pojedynczo, z testami).

> **Rekomendacja Eda:** Wpinanie agenta-recenzenta bezpośrednio w `Agent Teams` to przepis na chaos. Agent A pisze, Agent B narzeka, Agent A psuje. **Recenzent musi być odizolowanym Sub-Agentem**, raportującym wyłącznie do Ciebie.

#### Dlaczego nie GSD ani nie Gastown?
GSD potrafi kosztować **10x więcej tokenów** i trwać 5 godzin. Gastown generuje 20 agentów na raz pożerających ten sam kod, a potem osobny "Refinery" rozwiązuje konflikty Git. **Dla audytu istniejącego kodu używamy złotego środka: Subagent Read-Only + Twój HITL.**

---

## 2. Etap 0: Bezpieczne uchwycenie projektu

### Zagadnienie
Zanim zaczniesz - **zabezpiecz się**. Agent może zrobić katastrofę. Jedyna pewna linia obrony to `git`.

### Opis

#### Krok 0.1: Klon i czysta baza
```bash
git clone https://github.com/your-org/legacy-python-app.git
cd legacy-python-app
git checkout -b audit/2026-04-29  # NIGDY nie pracuj na main!
```

#### Krok 0.2: "Złoty commit" przed AI
```bash
git add .
git commit --allow-empty -m "AUDIT BASELINE: Stan początkowy przed AI"
git tag baseline-pre-audit
```

> **Rekomendacja Eda:** Komenda `git tag` to twardy punkt powrotu. Nawet po 50 iteracjach z agentem, w razie kryzysu wracasz do baseline w 1 sekundę: `git reset --hard baseline-pre-audit`.

#### Krok 0.3: Setup środowiska
```bash
# Jeśli to Python project
uv sync                        # lub pip install -e .

# Sprawdź, czy testy istnieją i przechodzą (clean baseline)
uv run pytest tests/ -v
```

> **WAŻNE:** Jeśli baseline tests **nie przechodzą** - **STOP**. Najpierw musisz zrozumieć dlaczego (może to bug środowiska, brak `.env`, etc.). Audyt na zepsutej bazie da fałszywe alarmy.

#### Krok 0.4: Instalacja Superpowers i Skill Creator
W terminalu Claude Code pobieramy potrzebne narzędzia. Pamiętaj o złotej zasadzie Eda: **korzystamy** z gotowych Pluginów (jak Superpowers), ale jeśli w toku audytu zechcesz stworzyć własne narzędzie dla zespołu (np. do wyłapywania halucynacji) - **zawsze twórz własne Skills**, a nie własne Pluginy (tworzenie Pluginów to ostateczność "PRO").

W terminalu Claude Code:
```bash
/plugin → Discover → superpowers → install
/plugin → Discover → skill-creator → install (globalny)
/plugin → Discover → systematic-debugging → install
/reload-plugins
```

---

## 3. Etap 1: Discovery - Mapowanie istniejącego kodu

### Zagadnienie
Zanim agent zrobi review, musi **zrozumieć** projekt. Często to setki plików - niech zrobi za Ciebie mapę.

### Opis

#### Komenda
W Claude Code:
```bash
/superpowers:explore-codebase
```

Lub naturalnie:
> *"Przeprowadź mapowanie struktury projektu. Wygeneruj plik `docs/CODEBASE_MAP.md` zawierający: drzewo katalogów, listę głównych modułów, opis ich zależności, listę używanych frameworków/bibliotek (z `pyproject.toml`/`requirements.txt`), liczbę linii kodu per moduł. NIE EDYTUJ żadnego pliku z kodem."*

#### Wynik (przykład `docs/CODEBASE_MAP.md`)
```markdown
# Mapa kodu: legacy-python-app

## Stack
- Python 3.9 (przestarzały - 2024 EOL)
- Flask 1.1 (przestarzały, brak wsparcia)
- SQLAlchemy 1.3 (klasyczne API)
- Brak typowania (mypy nie skonfigurowane)

## Drzewo
src/
├── main.py          (1200 linii - MONOLIT, do podziału!)
├── auth.py          (450 linii)
├── db.py            (300 linii)
└── utils.py         (200 linii)

## Główne moduły
1. main.py:
   - Endpointy Flask wszystkich typów (auth, products, orders)
   - Bezpośrednie wywołania bazy z poziomu route handlers
   - PROBLEM: brak separacji warstw (Anti-pattern)
   
## Ryzyko (wstępne)
- Brak typów: trudna refaktoryzacja
- Brak testów (znaleziono 3 pliki w tests/, 5% pokrycia)
- Hardcoded secrets w db.py (str.format z hasłem!)
- python-jose 3.0.1 (znana podatność CVE-2024-XXXX)
```

> **Rekomendacja Eda (Inżynieria Kontekstu):** Ten plik zostanie **zassany** przez agenta przy każdym kolejnym etapie audytu, oszczędzając godziny re-eksploracji projektu. Krytyczne dla obniżenia kosztów tokenów.

---

## 4. Etap 2: Pisanie Konstytucji Audytora `agents.md`

### Zagadnienie
Konstytucja Audytora **różni się znacząco** od Konstytucji programisty. Audytor MA ZAKAZ pisania kodu. Jego oręż to raporty.

### Opis

#### Lokalizacja
Plik tworzysz w **głównym katalogu projektu audytowego**:
```
legacy-python-app/
└── agents.md   ← Konstytucja Główna (Audytor)
```

#### Szablon `agents.md` dla audytu/refaktoryzacji

```markdown
# Konstytucja Agenta: Główny Audytor Bezpieczeństwa i Wydajności

Jesteś Senior Auditor z 15-letnim doświadczeniem. Specjalizujesz się 
w wykrywaniu wycieków pamięci, podatności bezpieczeństwa (OWASP) 
oraz długu technologicznego w projektach Python. NIE jesteś 
programistą - jesteś detektywem, który tylko OBSERWUJE i RAPORTUJE.

## End Goal Audytu
Wygenerowanie kompletnego, wiarygodnego raportu `docs/audit_report.md` 
z listą realnych problemów (Krytyczne, Wysokie, Średnie, Niskie). 
Każdy problem musi zawierać dowód (cytat z kodu, link do CVE, 
referencję do testu reprodukującego).

## Starting Point
Mamy: legacy-python-app w wersji production. Stack: Python 3.9, 
Flask 1.1, SQLAlchemy 1.3. Brak typowania, niskie pokrycie testami.

## ZASADA NACZELNA: READ-ONLY MODE
Pod groźbą natychmiastowego przerwania zadania, MASZ ZAKAZ 
modyfikowania, tworzenia, usuwania jakichkolwiek plików KODU 
PRODUKCYJNEGO (src/, app/, tests/). 

POZWOLENIA:
- Możesz tworzyć i edytować pliki w `docs/` (raporty, mapy, hipotezy).
- Możesz tworzyć i edytować pliki w `.claude/` (konfiguracja sesji).
- Możesz uruchamiać komendy READ-ONLY (np. `pytest --collect-only`, 
  `bandit -r src/`, `pylint src/`, `git log`, `git diff`).

ZAKAZY:
- ZAKAZ używania narzędzi: `Write` na src/, `StrReplace` na src/, 
  `git commit`, `git push`, `git reset`, `git checkout`.
- ZAKAZ wykonywania pip install, uv add - to zmienia stan systemu.

## 1. Czego szukasz (Zakres Audytu)

### Bezpieczeństwo (Priorytet KRYTYCZNY)
- Hardcodowane sekrety (API keys, hasła, tokeny) w kodzie
- SQL Injection - konkatenacja stringów w zapytaniach
- Brak walidacji wejścia (Pydantic absent)
- Outdated dependencies z znanymi CVE (sprawdzaj w `pip-audit`)
- Brak rate limiting na endpointach publicznych
- Niewłaściwe obsługiwanie sesji (session fixation, brak HTTPS)

### Wycieki pamięci (Priorytet WYSOKI)
- Otwarte połączenia DB bez `with` lub `try/finally`
- Sesje SQLAlchemy bez `.close()` albo poza scope manager
- Otwarte pliki bez `with open()`
- Listenery socketów / threads bez cleanup
- Cache bez expiration policy

### Anti-Slop (Priorytet ŚREDNI)
- Funkcje monolityczne > 50 linii
- Klasy "God Object" > 500 linii
- Dead code (nieużywane importy, funkcje)
- Komentarze "TODO", "FIXME", "HACK"
- Emoji w plikach kodu

### Długi technologiczne (Priorytet NISKI)
- Brak typowania (typed Python)
- Brak docstringów
- Brak testów (pokrycie < 70%)
- Naruszenia PEP 8 (Black/Ruff)

## 2. Format Raportu (`docs/audit_report.md`)

Każde znalezisko musi mieć strukturę:

### [POWAŻNOŚĆ] Krótki opis
- **Plik:linia:** np. `src/auth.py:42`
- **Cytat (kod):** Wstaw fragment 3-5 linii z kontekstem
- **Problem:** 1-3 zdania opisujące co i dlaczego jest źle
- **Dowód:** Link do CVE, fragment dokumentacji, opis testu reprodukującego
- **Sugerowana poprawka:** Snippet kodu (do ręcznego wklejenia 
  przez Użytkownika - nie zmieniasz pliku!)
- **Estymacja:** S/M/L (Small: 15min, Medium: 1h, Large: 0.5 dnia)

## 3. Anti-Halucynacje (CRITICAL)

LLM-y notorycznie halucynują w audytach. Aby tego uniknąć:
- ZAWSZE cytuj fragment kodu (nie streszczaj go).
- ZAWSZE podawaj numer linii (sprawdzony w pliku).
- Jeśli nie jesteś PEWIEN problemu - NIE WPISUJ go do raportu. 
  Lepiej pominąć 5 znalezisk niż wstawić 1 fałszywy alarm.
- Przed dodaniem znaleziska "wyciek .env" - SPRAWDŹ `.gitignore`!
- Przed dodaniem "outdated dependency" - SPRAWDŹ aktualny CVE 
  na https://nvd.nist.gov/.

## 4. Anti-Slop w samym raporcie
- ZAKAZ pisania ogólników typu "kod jest niskiej jakości".
- ZAKAZ używania emoji w raporcie.
- ZAKAZ wymyślania problemów na siłę dla "wypełnienia raportu".
- KAŻDE znalezisko musi mieć cytat z kodu (proof).

## 5. Workflow z Planem
- Czytaj plan.md przed każdym etapem audytu.
- Wykonuj zadania fazami - po każdej fazie czekaj na zgodę 
  Użytkownika na kolejną.
- Po fazie odhacz `[x]` w plan.md.
```

> **WAŻNE (Rekomendacja Eda):** Sekcja "ZASADA NACZELNA: READ-ONLY MODE" musi być pierwsza i agresywna. LLM domyślnie chce pomagać i pisać kod - musi mieć twarde zakazy.

---

## 5. Etap 3: Pisanie Planu Audytu `plan.md`

### Zagadnienie
Audyt też dzielimy na **Bite-sized chunks**. Niemożliwe jest sprawdzić 50000 linii kodu w jednym przebiegu - kontekst się zaśmieci, tokeny się skończą.

### Opis

#### Złota zasada: Audyt fazowy
Zamiast "audytuj wszystko", dziel na obszary:

```markdown
# Plan: Audyt Bezpieczeństwa legacy-python-app

## Cel Główny
Wygenerowanie raportu `docs/audit_report.md` w 5 fazach. 
Po każdej fazie - `git commit` raportu i czekanie na zgodę 
Użytkownika na kolejną.

## Komendy uruchomieniowe (na nową sesję!)
- Test smoke: `uv run pytest tests/ -q`
- Bandit: `uv run bandit -r src/ -f json -o /tmp/bandit.json`
- Pip-audit: `uv run pip-audit`
- Linia kodu: `cloc src/`

## Faza 1: Audyt Uwierzytelniania (auth.py)
- [ ] 1.1: Przeczytaj `src/auth.py` od linii 1 do 150
- [ ] 1.2: Zidentyfikuj sposób hashowania haseł
- [ ] 1.3: Zidentyfikuj generowanie i walidację tokenów JWT
- [ ] 1.4: Sprawdź sesję - czy jest invalidacja przy logout
- [ ] 1.5: Wygeneruj sekcję "Auth" w docs/audit_report.md
- [ ] 1.6: Czekam na zgodę Użytkownika na Fazę 2

## Faza 2: Audyt Bazy Danych (db.py + models)
- [ ] 2.1: Sprawdź wszystkie zapytania SQL pod kątem injection
- [ ] 2.2: Sprawdź zarządzanie sesjami SQLAlchemy (memory leaks?)
- [ ] 2.3: Sprawdź gdzie są hardcoded credentials
- [ ] 2.4: Wygeneruj sekcję "Database" w raporcie
- [ ] 2.5: Czekam na zgodę

## Faza 3: Audyt Endpointów Publicznych (api/*)
- [ ] 3.1: Lista endpointów (uruchom `pytest --collect-only`)
- [ ] 3.2: Per endpoint - sprawdź walidację wejścia (Pydantic? Marshmallow?)
- [ ] 3.3: Per endpoint - sprawdź rate limiting
- [ ] 3.4: Per endpoint - sprawdź autoryzację
- [ ] 3.5: Wygeneruj sekcję "API" w raporcie

## Faza 4: Audyt Zależności (CVE Scan)
- [ ] 4.1: Uruchom `pip-audit --desc`
- [ ] 4.2: Cross-check z https://nvd.nist.gov/ dla TOP 5 ryzyk
- [ ] 4.3: Wygeneruj sekcję "Dependencies"

## Faza 5: Audyt Wydajności i Anti-Patterns
- [ ] 5.1: Identyfikacja monolitów (pliki > 500 linii)
- [ ] 5.2: Identyfikacja "God Objects" (klasy > 500 linii)
- [ ] 5.3: Identyfikacja N+1 queries (przegląd loops + DB calls)
- [ ] 5.4: Wygeneruj sekcję "Performance & Anti-Patterns"

## Faza 6 (po akceptacji raportu): Refaktoryzacja
PRZECHODZIMY DO REFAKTORYZACJI dopiero po:
- Akceptacji raportu przez Użytkownika
- Wyłapaniu i usunięciu halucynacji
- Stworzeniu osobnego planu refaktoryzacji `refactor_plan.md`

## Reguły dla Audytora
1. ZAKAZ przejścia do następnej fazy bez `[x]` na obecnej.
2. ZAKAZ edycji jakichkolwiek plików w src/ i tests/.
3. Po każdej fazie - poinformuj Użytkownika i ZATRZYMAJ pracę.
4. Jeśli widzisz coś, co Cię "kusi" by naprawić - ZAPISZ to 
   tylko w raporcie. Refaktoryzacja przyjdzie później.
```

---

## 6. Etap 4: Przełączanie modeli - Audyt Opusem

### Zagadnienie
Audyt to praca dla **najpotężniejszego modelu**. Tu nie chodzi o szybkość - chodzi o nieprzeoczenie problemów.

### Opis

#### Strategia kosztowa
- **Codzienna praca (development):** Claude 3.5 Sonnet / GPT-4o-mini
- **Audyt:** Claude 3 Opus / o1-preview - **droższe ale głębsze rozumowanie**
- **Refaktoryzacja po audycie:** Sonnet (już znamy listę zadań)

#### Komenda - przełączenie modelu w Claude Code
```bash
# W Claude Code, dolny pasek - kliknij nazwę modelu
# Wybierz: Claude 3 Opus (lub o1 jeśli jest dostępny)
```

Lub przez zmienną środowiskową (przed startem):
```bash
export CLAUDE_MODEL=claude-3-opus-20240229
claude
```

#### Prompt ratunkowy do audytu (Read-Only)
```
Przeczytaj agents.md i plan.md. Wykonaj Fazę 1 z plan.md 
(Audyt Uwierzytelniania). 

KRYTYCZNE PRZYPOMNIENIE: 
Pracujesz w trybie READ-ONLY. NIE EDYTUJESZ żadnego pliku 
w src/. Wszystkie znaleziska zapisz do `docs/audit_report.md`.

Po wygenerowaniu sekcji Auth - zatrzymaj się i czekaj 
na moją akceptację.
```

> **Rekomendacja Eda (Optymalizacja kosztów):** Opus jest 5x droższy od Sonneta. Dlatego audyt rób fazami - po każdej fazie zrób `/clear` (Hard Reset) żeby tokeny nie kumulowały się w długiej sesji. Zapisany raport w pliku Markdown jest jedyną pamięcią międzysesyjną.

---

## 7. Etap 5: Workflow Code Review Simona Willisona

### Zagadnienie
Ten 5-etapowy workflow Eda Donnera (na bazie Simona Willisona) to **proven pattern** dla profesjonalnego code review.

### Opis

#### Krok 1: Generowanie raportu (komenda startowa)
```
Please carry out a comprehensive code review of the entire repo, 
and write a report with actions to docs/audit_report.md. 
Categorize issues as: Critical, High, Medium, Low.

You are in READ-ONLY mode. DO NOT modify any files except the 
report itself.
```

> **Rekomendacja Eda:** Wymuszenie pliku `.md` daje Ci **asynchroniczną** weryfikację - możesz sobie spokojnie czytać raport bez "presji czasu" agenta.

#### Krok 2: Kategoryzacja - czego oczekiwać w raporcie
Raport będzie miał strukturę:

```markdown
# Audit Report - 2026-04-29

## Critical (do natychmiastowej naprawy)
1. SQL Injection w `db.py:142`...
2. Hardcoded API key w `config.py:8`...

## High (do naprawy w tym sprincie)
3. Brak rate limiting na `/login`...
4. Sesja SQLAlchemy nie zamykana w `auth.py:78`...

## Medium  
5. Funkcja `process_order` ma 320 linii...

## Low (technical debt)
6. Brak typowania w `utils.py`...
```

#### Krok 3: Weryfikacja raportu (HITL - tu Twoja rola!)
Otwórz raport. Idź pozycja po pozycji. **NIE UFAJ NICZEMU W CIEMNO.**

Dla każdego "Critical" zrób ręczny sanity check:
- Czy plik faktycznie istnieje?
- Czy linia jest tym, co agent twierdzi?
- Czy to faktycznie błąd, czy false positive?

(Szczegóły w sekcji 8 - "Wyłapywanie Halucynacji")

#### Krok 4: Wymuszenie Retestów (Fix & Retest)
Po weryfikacji raportu, gdy problemy są realne:

```
Please go ahead and address all the Critical and High priority 
issues from docs/audit_report.md. 

WORKFLOW:
1. Dla każdego problemu: Najpierw napisz test reprodukujący problem (RED).
2. Następnie napraw kod produkcyjny (GREEN).
3. Uruchom WSZYSTKIE testy po każdej poprawce.
4. Daj znać, gdy WSZYSTKO będzie naprawione i RETEST będzie OK.

Po naprawie KAŻDEGO problemu - retestuj. Retestuj. Retestuj. 
Nie przechodź do następnego, dopóki obecny nie jest udowodniony.
```

> **Rekomendacja Eda:** Zauważ podwójny nacisk na "retest". Agent ma sam puścić testy po poprawkach. Nie ufaj jego deklaracjom z czatu - tylko logom z `pytest`.

#### Krok 5: Commit & Compact
Po pomyślnej naprawie:
```bash
# 1. Commit
git add .
git commit -m "Audit fixes: Critical+High priority (SQL injection, JWT)"

# 2. Hard Reset pamięci
/compact   # albo /clear
```

Następnie wracasz do `plan.md`, odhaczając zaadresowane problemy, i zlecasz kolejną grupę (Medium / Low).

---

## 8. Etap 6: Wyłapywanie Halucynacji w raporcie

### Zagadnienie
LLM-y notorycznie **halucynują** w audytach bezpieczeństwa. Agent z absolutną pewnością powie Ci, że masz problem, którego nie ma.

### Opis

#### Klasyczny przykład halucynacji (z kursu Eda)
Agent stwierdził:
> "**Critical**: plik `.env` z sekretami wyciekł do repozytorium Git!"

Reakcja Eda:
> *"How is .env in Git? It's clearly included in .gitignore and it's not in GitHub."*

Po polsku:
> *"Skąd wziąłeś, że `.env` jest w Git? Jest w `.gitignore` i nie ma go na GitHubie."*

Agent przeprosił i zaktualizował raport.

#### Twój workflow weryfikacji halucynacji

Dla każdego znaleziska "Critical" wykonaj:

1. **Sprawdzenie istnienia:** 
   ```bash
   # Czy plik wskazany w raporcie istnieje?
   ls src/auth.py
   # Czy linia istnieje?
   sed -n '142p' src/auth.py
   ```

2. **Sprawdzenie kontekstu:**
   - Jeśli agent mówi "wyciek `.env`" - sprawdź `.gitignore`:
     ```bash
     grep -E "^\.env$" .gitignore
     ```
   - Jeśli mówi "outdated dependency CVE-2024-X" - sprawdź NVD:
     ```bash
     pip show <pakiet> | grep Version
     # Otwórz https://nvd.nist.gov/vuln/detail/CVE-2024-X
     ```

3. **Konfrontacja z agentem (jeśli halucynacja):**
   ```
   "Sprawdziłem - plik .env JEST w .gitignore (linia 4) 
   i nie ma go w git ls-files. Zaktualizuj raport - to fałszywy alarm. 
   Pokaż mi DOWÓD jeśli jednak masz inne źródło."
   ```

4. **Cross-Model verification (dla naprawdę krytycznych):**
   ```bash
   # W terminalu Claude Code:
   codex exec "Read docs/audit_report.md, point #3 (SQL Injection 
   in db.py:142). Verify if this is a real issue or false alarm. 
   Look at the actual code. Write findings to docs/cross_check.md."
   ```

#### Skill `systematic-debugging` w użyciu
Dla naprawdę trudnych przypadków (Czerwony Śledź - Red Herring):

```
Use the systematic-debugging skill. We have a suspected SQL 
injection at db.py:142, but I'm not sure if it's a real issue 
or a false alarm from our auditor. Generate hypotheses, prove 
them with concrete evidence (test or git log), then update 
docs/audit_report.md if needed.
```

---

## 9. Etap 7: Refaktoryzacja - od raportu do PR

### Zagadnienie
Po zaakceptowanym i zweryfikowanym raporcie - **dopiero wtedy** zaczynasz refaktoryzację. Każda poprawka = jeden mały task w Bite-sized chunks.

### Opis

#### Krok 1: Stwórz osobny plik `refactor_plan.md`
**WAŻNE:** Nie nadpisuj `plan.md` audytu. To dwa różne plany.

```markdown
# Plan Refaktoryzacji - na bazie audit_report.md

## Cel
Zaadresować wszystkie problemy Critical i High z audytu. 
Każda zmiana = osobny commit (Bite-sized chunks).

## Krytyczne #1: SQL Injection w db.py:142
- [ ] 1.1: Test RED - reprodukuj atak SQL injection
  - Plik: tests/security/test_db.py
  - DoD: Test pada z błędem demonstrującym injection
- [ ] 1.2: Refaktor (GREEN) - przejście na parameterized queries
  - Plik: src/db.py:142
  - DoD: Test z 1.1 przechodzi
- [ ] 1.3: Smoke test - całe API nadal działa
  - DoD: pytest tests/ -v zwraca 100%
- [ ] 1.4: Git commit "fix(security): SQL injection in db.py"

## Krytyczne #2: Hardcoded API key w config.py:8
- [ ] 2.1: Setup pydantic-settings
- [ ] 2.2: Migracja klucza do .env (które jest w .gitignore)
- [ ] 2.3: Test, że aplikacja czyta z .env
- [ ] 2.4: Git commit
- [ ] 2.5: ROTATE TEN KLUCZ NA PRODUKCJI! (manualnie!)

## Wysokie #3: Brak rate limiting...
[itd.]
```

#### Krok 2: Zmień model na tańszy + zmień Konstytucję
Audyt skończony - przełączasz na **Sonnet** (tańszy) i wyciągasz nową Konstytucję - **Konstytucję Programisty** z `vibe_szczegoly_python_od_zera.md` (sekcja 3).

W praktyce:
1. `git checkout -b refactor/post-audit`
2. Stwórz nowy `agents.md` (programisty, nie audytora) - skopiuj z [pliku tworzenia od zera](/notatki/vibe-coding/vibe-coding-python-od-zera).
3. Aktualizuj `agents.md` o specyficzny End Goal: *"Refaktoryzuję istniejący kod, naprawiając problemy z audit_report.md"*.

#### Krok 3: Pętla TDD per problem
Dla każdego "Krytycznego" w `refactor_plan.md`:

```
Wykonaj zadanie 1.1 z refactor_plan.md (Test RED dla SQL injection 
w db.py:142). Stosuj TDD. Zatrzymaj się po teście, czekam na akceptację.
```

> **Rekomendacja Eda - Disobedience:** Czasem agent powie *"Ten test jest zbyt niebezpieczny do napisania, pomińmy"*. Odpowiadaj twardo: *"This is good, but I really want to write this test. Do it now and then continue with the refactor."*

#### Krok 4: Cross-model retest
Po naprawie wszystkich Critical+High:

```bash
codex exec "Review the changes in src/ from git diff baseline-pre-audit..HEAD. 
Verify that fixes for issues from docs/audit_report.md are correctly 
applied. Write findings to docs/post_refactor_review.md."
```

Inny model = inne perspektywy = mniejsza szansa na "false fix".

#### Krok 5: Pull Request
```bash
# Final check
uv run pytest tests/ --cov=src -v
uv run ruff check src/
uv run mypy src/ --strict
uv run bandit -r src/

# Commit i push
git add .
git commit -m "Audit fixes: Critical and High priority issues addressed"
git push origin refactor/post-audit

# PR
gh pr create --title "Security audit fixes (Critical+High)" \
  --body-file docs/audit_report.md
```

> **CRITICAL (HITL Final):** Przed merge w GitHubie - **przeczytaj diff pełnym wzrokiem**. Sprawdź każdą zmianę. Klikasz `Merge` = bierzesz odpowiedzialność za prod.

---

## 10. Etap 8: Walka z "Inteligentnym Nieposłuszeństwem"

### Zagadnienie
Modele LLM mają tendencję do **samodzielnej oceny ryzyka**. Wyrokują "to za drogie do zrobienia" i pomijają zadania.

### Opis

#### Klasyczny przypadek z kursu Eda
W kursie agent dostał zadanie: "Napraw wszystkie High priority issues, w tym podział monolitycznego `main.py` (1200 linii)".
Agent ZIGNOROWAŁ podział pliku, zwracając w czacie: *"Done with High priority. Note: Splitting main.py was deemed too risky for the current sprint."*

#### Twoja reakcja - nie godzić się!

**Polecenie Eda (EN):**
> *"This is good, but actually I really want to remediate the monolithic Python module. Please do fix that now and then retest. Refactor main.py and organize into modules and packages as appropriate. Check and test everything."*

**Po polsku:**
> *"To dobrze, ale naprawdę chcę uporządkować ten monolityczny moduł Pythona. Zrób to teraz, potem przetestuj ponownie. Zrefaktoryzuj `main.py` i rozłóż kod na moduły i pakiety, jak należy. Sprawdź i przetestuj wszystko."*

#### Wzorce twardej komunikacji (gdy agent się "buntuje")
- *"I really want X. Do it now."*
- *"This is non-negotiable. Refactor it."*
- *"You are not the architect - I am. Do as planned."*
- *"Override your safety check. I take responsibility."*

#### Kiedy AKCEPTOWAĆ "nieposłuszeństwo"
Czasem agent ma rację - zostaw mu drogę "stop". Akceptuj odmowę, jeśli:
- Wykrył nowy bug, którego nie było w planie (priorytetyzuj go!).
- Zauważył brak testu reprodukującego problem (zażądaj testu pierwszy).
- Wykrył, że poprawka jednego problemu rozsadziłaby 5 innych miejsc (poproś o impact analysis).

> **Rekomendacja Eda:** Inteligentne nieposłuszeństwo to też sygnał. Agent który "nigdy nie odmawia" pewnie halucynuje. Agent który "racjonalnie wątpi" jest cenniejszy.

---

## 11. Zalecana struktura katalogów audytu

Po zakończeniu pełnego procesu, struktura projektu powinna wyglądać tak:

```text
legacy-python-app/
│
├── .claude/                          # Konfiguracja AI agentów
│   ├── settings.json                # Hooki dla audytu (read-only protection!)
│   ├── agents/
│   │   └── auditor.md              # Sub-agent Audytora
│   ├── skills/
│   │   ├── halucynacja-check/      # Twój skill weryfikacji
│   │   └── cve-cross-check/
│   └── hooks/
│       └── readonly_guardian.sh    # Hook blokujący pisanie do src/!
│
├── docs/                            # Dokumentacja audytu
│   ├── CODEBASE_MAP.md             # Z Etapu 1 (Discovery)
│   ├── audit_report.md             # GŁÓWNY RAPORT
│   ├── cross_check.md              # Codex review halucynacji
│   ├── post_refactor_review.md     # Po naprawach
│   └── debug.md                    # Skill systematic-debugging
│
├── src/                             # Kod produkcyjny (READ-ONLY w audycie!)
│   └── ...
│
├── tests/
│   ├── security/                    # Nowo dodane testy bezpieczeństwa
│   │   └── test_sql_injection.py
│   └── ...
│
├── agents.md                        # ★ Konstytucja Audytora (Read-Only!) ★
├── plan.md                          # Plan Audytu (5 faz)
├── refactor_plan.md                 # Plan Refaktoryzacji (po audycie)
└── README.md                        # Krótki opis stanu projektu
```

### Hook ochrony Read-Only (`.claude/hooks/readonly_guardian.sh`)
Dodatkowy strażnik dla audytu - blokuje agenta przed pisaniem do src/:

```bash
#!/bin/bash
# Sprawdza, czy ostatni commit nie tknął src/

CHANGED=$(git diff --name-only HEAD~1 HEAD | grep -E "^src/" || true)

if [ -n "$CHANGED" ]; then
  echo "[GUARDIAN] WYKRYTO ZMIANY W SRC/ POD AUDYTEM!"
  echo "Zmienione pliki:"
  echo "$CHANGED"
  echo ""
  echo "Rollback: git reset --hard HEAD~1"
  exit 1
fi

exit 0
```

---

## Checklist Audytora (HITL kontrola jakości)

Po każdej fazie audytu sprawdź:
- [ ] Czy `agents.md` Audytora jest w trybie READ-ONLY?
- [ ] Czy `plan.md` ma aktualne `[x]` na ukończonych zadaniach?
- [ ] Czy `docs/audit_report.md` rośnie (nie nadpisywany)?
- [ ] Czy każde znalezisko ma cytat kodu (proof)?
- [ ] Czy zweryfikowałem TOP 3 Critical issues osobiście?
- [ ] Czy żaden plik w `src/` nie został zmodyfikowany?
- [ ] Czy mój `git status` pokazuje tylko zmiany w `docs/`?

Po pełnym audycie i refaktoryzacji:
- [ ] Czy zrobiłem `git tag post-audit-2026-04-29`?
- [ ] Czy testy bezpieczeństwa zostały dodane do CI/CD?
- [ ] Czy nowy klucz API został wyrotowany na produkcji (jeśli był wyciek)?
- [ ] Czy zespół został poinformowany o znalezionych problemach?
- [ ] Czy mogę wytłumaczyć **każdą** zmianę kodu w PR?

> **Manifest Audytora:** Audyt nie jest skończony, gdy raport jest napisany. Audyt jest skończony, gdy realne problemy są naprawione, przetestowane, deployowane i zespół wie, jak nie powtórzyć tych błędów.
