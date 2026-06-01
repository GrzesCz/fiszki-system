---
title: 'Praktyka: Tworzenie aplikacji Python od zera z Superpowers (Senior Enterprise)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-06-30'
review_count: 0
---
# Praktyka: Tworzenie aplikacji Python od zera (Workflow z Superpowers)

**Źródło:** `Superpowers_Raport.md` (obra/superpowers), kurs Udemy Vibe Coding (Ed Donner), `claude-code-skills-pisanie.md`, `rekomendacje_Eda_vibe_coding.md`.

**Cel:** Krok po kroku przeprowadzić Cię (Głównego Architekta) przez budowę aplikacji Python od zera, używając frameworku **Superpowers**, własnych Skilli, plików `agents.md` i `plan.md` oraz zasad HITL (Human-In-The-Loop) na poziomie Senior Enterprise. **Pamiętaj:** Superpowers nie zwalnia Cię z pracy - zmienia Cię w Recenzenta każdego etapu.

---

## Spis treści
1. [Przygotowanie środowiska (Etap 0)](#1-przygotowanie-środowiska-etap-0)
2. [Brainstorming - Burza mózgów (Etap 1)](#2-brainstorming---burza-mózgów-etap-1)
3. [Pisanie Konstytucji `agents.md` (Etap 2)](#3-pisanie-konstytucji-agentsmd-etap-2)
4. [Pisanie Planu `plan.md` (Etap 3)](#4-pisanie-planu-planmd-etap-3)
5. [Konfiguracja własnych Skilli (Etap 4)](#5-konfiguracja-własnych-skilli-etap-4)
6. [Konfiguracja Hooków - Strażnik Bramy (Etap 5)](#6-konfiguracja-hooków---strażnik-bramy-etap-5)
7. [Wykonywanie Planu w pętli TDD (Etap 6)](#7-wykonywanie-planu-w-pętli-tdd-etap-6)
8. [Sub-Agents i Cross-Model Review (Etap 7)](#8-sub-agents-i-cross-model-review-etap-7)
9. [Finalizacja: Pull Request i Deploy (Etap 8)](#9-finalizacja-pull-request-i-deploy-etap-8)
10. [Zalecana struktura katalogów](#10-zalecana-struktura-katalogów-projektu-od-zera)

---

## 1. Przygotowanie środowiska (Etap 0)

### Zagadnienie
Zanim zaczniesz pisać kod, musisz zainstalować i skonfigurować odpowiednie narzędzia. To jest absolutnie kluczowe, bo Superpowers wymaga określonych komend (`/superpowers:*`).

### Opis

#### Krok 0.1: Instalacja Claude Code
Upewnij się, że masz zainstalowany **Claude Code** (oficjalne CLI Anthropic). Jeśli używasz Cursora, możesz korzystać z trybu Agent Mode w Cursorze, ale Superpowers ma optymalne wsparcie w Claude Code.

#### Krok 0.2: Instalacja Pluginu Superpowers
W terminalu Claude Code wpisz:

```bash
/plugin
```

W menu wybierz `Discover` → wyszukaj `superpowers` → naciśnij `i` (install).

Alternatywnie (przez marketplace):
```bash
/add-plugin superpowers
```

Po instalacji **zawsze** wykonaj restart Claude Code (Ctrl+C dwukrotnie i ponowny start) lub:
```bash
/reload-plugins
```

#### Krok 0.3: Instalacja Skill Creator (do tworzenia własnych skilli)
```bash
/plugins
# wyszukaj: skill-creator
# zainstaluj jako globalny (~/.claude/skills/)
/reload-plugins
```

#### Krok 0.4: Wymuszenie nowoczesnego stacku Pythonowego
W Twoim systemie zainstaluj `uv` (nowoczesny manager paczek):

```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Linux/Mac
curl -LsSf https://astral.sh/uv/install.sh | sh
```

> **WAŻNE (Rekomendacja Eda):** Bez wymuszenia używania `uv` w `agents.md`, LLM domyślnie skorzysta ze starego `pip` i `requirements.txt`. To jest błąd w 2026 roku.

#### Krok 0.5: Inicjalizacja repozytorium Git
```bash
mkdir my_python_app
cd my_python_app
git init
echo "venv/" > .gitignore
echo ".env" >> .gitignore
echo "__pycache__/" >> .gitignore
echo ".pytest_cache/" >> .gitignore
git add .gitignore
git commit -m "Initial commit"
```

> **Rekomendacja Eda:** ZAWSZE rób pierwszy `git commit` przed pierwszą interakcją z agentem. To Twoja jedyna twarda linia obrony przed katastrofą.

---

## 2. Brainstorming - Burza mózgów (Etap 1)

### Zagadnienie
Tu zaczyna się magia Superpowers. **Nie pozwalasz agentowi pisać kodu**, dopóki w pełni nie zrozumie problemu i nie przedstawi Ci projektu architektury.

### Opis

#### Komenda
W Claude Code (uruchomiony w pustym katalogu projektu):
```bash
/superpowers:brainstorm
```

Następnie wpisz w naturalny sposób Twój **cel biznesowy** (Goal-oriented), nie listę technicznych kroków:

```
Chcę zbudować REST API w Python (FastAPI) do obsługi koszyka 
zakupowego sklepu e-commerce. Wymogi: JWT auth z blokadą po 3 
błędnych próbach, integracja z Redis dla szybkiego dostępu, 
kompletne pokrycie testami.
```

#### Co zrobi agent (TY MUSISZ TO ZAAKCEPTOWAĆ!)
Agent **zatrzyma się** i zacznie zadawać Ci pytania, np.:
- "Jak długi powinien być token JWT? 15 minut czy 24h?"
- "Czy chcesz Refresh Tokens?"
- "Jak ma się zachować system po 3 błędach: lockout 5 minut czy email do admina?"
- "Czy używasz Redis Cluster czy single instance?"

> **Złota zasada Superpowers:** ODPOWIADAJ NA WSZYSTKIE PYTANIA. Każde pytanie, na które odpowiesz teraz, oszczędza Ci 30 minut debugowania później.

#### Wynik
Agent wygeneruje plik typu `docs/specification.md` lub `BRAINSTORM.md` zawierający:
- Listę wymagań funkcjonalnych
- Listę wymagań niefunkcjonalnych  
- Diagram komponentów (w Markdown lub Mermaid)
- Listę alternatyw, które rozważał, i uzasadnienie wyboru
- Edge cases (przypadki brzegowe)

> **HITL (Human-In-The-Loop):** TY tutaj musisz przeczytać ten dokument bardzo dokładnie i go ZAAKCEPTOWAĆ. Jeśli zobaczysz błąd architektoniczny, popraw to teraz - zmiana planu kosztuje 1 token, a refaktoryzacja kodu produkcyjnego 1000 tokenów.

---

## 3. Pisanie Konstytucji `agents.md` (Etap 2)

### Zagadnienie
Po zaakceptowaniu architektury, zanim agent zacznie pisać plan, musisz mu narzucić "Konstytucję" (kim ma być i jakich błędów ma nigdy nie popełnić).

### Opis

> **WAŻNE (Rekomendacja Eda):** Plik `agents.md` piszesz **TY**, nie agent. Możesz mu kazać przygotować szkic, ale ostateczna wersja musi być Twoja. Jeśli pozwolisz mu auto-generować Konstytucję, sam sobie ustawi wygodne reguły.

#### Lokalizacja
Plik tworzysz w **głównym katalogu projektu**:
```
my_python_app/
├── agents.md              ← Konstytucja Główna
├── /src/api/agents.md    ← (opcjonalnie) Konstytucja modułu API
└── /src/db/agents.md     ← (opcjonalnie) Konstytucja modułu DB
```

To technika **Inżynierii Kontekstu Progresywnego** Eda Donnera. Główne zasady są w głównym pliku, a specyfikę modułu definiujesz w jego podkatalogu.

#### Szablon `agents.md` dla aplikacji Python od zera

```markdown
# Konstytucja Agenta: Senior Enterprise Python Developer

Jesteś elitarnym programistą Python z 10-letnim doświadczeniem 
w projektach Enterprise. Pracujesz w zespole z Głównym Architektem 
(użytkownikiem). Twoim zadaniem jest dostarczanie kodu, którego nie 
musi się wstydzić Senior Tech Lead w Google ani Apple.

## End Goal
Zbudować REST API w FastAPI obsługujące koszyk e-commerce, oparte 
na Redis (szybki cache) i PostgreSQL (źródło prawdy). API musi 
wytrzymać 1000 RPS i być w 100% pokryte testami.

## Starting Point  
Mamy: czyste repozytorium Git, zainstalowany Python 3.12, uv, Docker.
Brak: kodu aplikacyjnego, schematów bazy, testów.

## 1. Narzędzia (TWARDE WYMOGI)
- Zawsze używaj `uv` do zarządzania zależnościami (ZAKAZ `pip`).
- Zawsze używaj `pyproject.toml` (ZAKAZ `requirements.txt`).
- Zawsze stosuj `Pydantic v2` do walidacji (ZAKAZ ręcznych dict checks).
- Zawsze używaj `ruff` do formatowania (limit 88 znaków).
- Zawsze używaj `mypy --strict` do analizy typów.
- Zawsze używaj `pytest` z `pytest-asyncio` do testów.

## 2. Anti-Slop (Walka z AI Slop)
- Zawsze pisz kompletny kod (ZAKAZ słów "TODO", "TBD", "placeholder").
- Zawsze używaj docstringów w formacie Google.
- Komentarze opisują tylko DLACZEGO (decyzję), nie CO (kod).
- ZAKAZ używania emoji w kodzie, plikach, commitach.
- ZAKAZ pisania kilometrowych README - max 100 linii i tylko esencja.

## 3. Typowanie i Walidacja
- Każda funkcja MUSI mieć typowane argumenty i typ zwracany.
- Używaj `Annotated[Type, ...]` zamiast surowych typów gdzie pasuje.
- Używaj `pydantic-settings` dla configów (ZAKAZ hardcodowania kluczy).

## 4. Bezpieczeństwo (Senior Enterprise)
- Zawsze waliduj wejście przez Pydantic.
- ZAKAZ konkatenacji stringów do zapytań SQL - tylko ORM/parametryzacja.
- Zawsze rzucaj typowane wyjątki (Custom Exceptions), nie generyczne.
- Implementuj Rate Limiting na każdym endpoincie publicznym.

## 5. TDD (Test-Driven Development)
- Zanim napiszesz kod produkcyjny (GREEN), zawsze napisz test (RED).
- Uruchom test i upewnij się, że "oblewa" z właściwego powodu.
- Napisz tylko tyle kodu, by test przeszedł.
- ZAKAZ pisania testu PO kodzie - to "fake TDD". Jeśli się 
  złapiesz, USUŃ kod produkcyjny i zacznij od testu.

## 6. Workflow z Planem
- Zawsze przed edycją pliku przeczytaj `plan.md`.
- Po wykonaniu zadania, zawsze odhacz checkbox `[x]` w `plan.md`.
- Jeśli musisz odejść od planu, NAJPIERW poproś użytkownika o zgodę.

## 7. Komunikacja
- Pisz po polsku w komunikacji z użytkownikiem (logi, opisy).
- Nazwy zmiennych, klas, plików - wyłącznie po angielsku (PEP 8).
- Po wykonaniu zadania zawsze podaj 1-zdaniowe podsumowanie 
  i poproś o `git commit` lub kolejny krok.
```

> **Rekomendacja Eda (Pozytywy nad Negatywami):** Zauważ, że stosuję głównie "Zawsze X" zamiast "Nie rób Y". LLM gorzej czytają negacje. Na 5 nakazów może przypadać 1 zakaz.

---

## 4. Pisanie Planu `plan.md` (Etap 3)

### Zagadnienie
Po Konstytucji, agent przekształca BRAINSTORM.md w wykonywalny plan z drobnymi zadaniami (Bite-sized chunks).

### Opis

#### Komenda
```bash
/superpowers:write-plan
```

Lub naturalnie: *"Na podstawie `docs/specification.md` napisz `plan.md` zgodny z zasadami z agents.md. Pamiętaj o granularności 2-5 minut na krok i zakazie placeholderów."*

#### Złota zasada "Brak Placeholderów" (Skill writing-plans)
Plan jest pisany tak, **jakby inżynier go wykonujący nie miał żadnego kontekstu**. To znaczy:

❌ Złe zadanie:
```markdown
- [ ] Zaimplementuj endpoint dodawania do koszyka
```

✅ Dobre zadanie (Superpowers way):
```markdown
- [ ] Krok 2.3.1: Test RED - dodawanie do koszyka
  - Plik: `tests/test_cart_service.py`
  - Linia: ~25 (po imports)
  - Akcja: Napisz `def test_add_to_cart_returns_updated_cart():` 
    z assertem na obecność `product_id` w wyniku.
  - DoD: Uruchomienie `pytest tests/test_cart_service.py::test_add_to_cart_returns_updated_cart` 
    zwraca `NotImplementedError`.

- [ ] Krok 2.3.2: Implementacja (GREEN) - funkcja add_to_cart
  - Plik: `src/services/cart_service.py`
  - Akcja: Dodaj funkcję `async def add_to_cart(user_id: str, product: CartItem) -> Cart`.
  - Wymóg: użyj `redis_client.hset()`, klucz `cart:{user_id}`.
  - DoD: Test z 2.3.1 przechodzi.
```

#### Szablon `plan.md` (z wymogami HITL)

```markdown
# Plan: Koszyk Zakupowy E-Commerce API

## Cel Główny
Zbudować w 5 fazach API koszyka zakupowego, każda faza zatwierdzona 
przez Użytkownika przez `git commit`. Po każdej fazie czekam 
na zgodę: "Możesz przejść do Fazy X+1".

## Komendy uruchomieniowe (na nową sesję czatu!)
- Setup: `uv sync`
- Lokalny serwer: `uv run uvicorn src.main:app --reload`
- Testy: `uv run pytest tests/ -v --cov=src`
- Lintery: `uv run ruff check src/ && uv run mypy src/ --strict`

## Faza 1: Setup projektu i infrastruktura
- [ ] 1.1: Utworzenie `pyproject.toml` z FastAPI, Pydantic, pytest, redis-py
- [ ] 1.2: Setup Docker Compose (PostgreSQL, Redis)
- [ ] 1.3: Pierwsza pusta aplikacja FastAPI z healthcheck endpoint `/health`
- [ ] 1.4: Test smoke - czy `/health` zwraca 200 OK

## Faza 2: Modele danych (Pydantic v2)
- [ ] 2.1: Test RED - walidacja CartItem (quantity > 0)
- [ ] 2.2: Implementacja modelu `CartItem(BaseModel)` w `src/models/cart.py`
- [ ] 2.3: Test RED - walidacja Cart aggregating CartItems
- [ ] 2.4: Implementacja modelu `Cart`

## Faza 3: Logika biznesowa (TDD - Cart Service)
- [ ] 3.1: Test RED - add_to_cart
- [ ] 3.2: Implementacja add_to_cart
- [ ] 3.3: Test RED - remove_from_cart
- [ ] 3.4: Implementacja remove_from_cart

## Faza 4: API Endpoints (FastAPI Routers)
- [ ] 4.1: Test RED dla POST /cart/items
- [ ] 4.2: Implementacja endpointu
- [ ] 4.3: Test RED dla DELETE /cart/items/{product_id}
- [ ] 4.4: Implementacja endpointu

## Faza 5: Auth i Rate Limiting
- [ ] 5.1: JWT middleware
- [ ] 5.2: Lockout po 3 błędach (Redis counter)
- [ ] 5.3: Pełny test integracyjny end-to-end

## Reguły dla Agenta wykonującego Plan
1. ZAKAZ przejścia do Fazy 2 przed zaliczeniem Fazy 1.
2. Po każdym kroku odhacz `[x]` w tym pliku.
3. Po fazie - poinformuj Użytkownika i CZEKAJ na zgodę.
4. NIE WOLNO Ci samodzielnie kompaktować pamięci (`/compact`) 
   w połowie zadania. Tylko Użytkownik decyduje.
5. Jeśli wykryjesz, że plan jest błędny, ZATRZYMAJ pracę 
   i napisz w czacie: "Plan wymaga aktualizacji w punkcie X.Y, 
   bo wykryłem Z. Czy mogę go edytować?"
```

> **Rekomendacja Eda:** Pamiętaj o sekcji "Komendy uruchomieniowe". Po `/clear` model zapomina, jak Twój projekt się uruchamia. Bez tego zacznie zgadywać.

---

## 5. Konfiguracja własnych Skilli (Etap 4)

### Zagadnienie
Skille rozszerzają agenta o specyficzne dla Twojego projektu workflow. Możesz mieć Skill do uruchamiania linterów, do generowania migracji bazy danych itp.

> **Złota zasada Eda (Custom Skills vs Custom Plugins):** Przy budowaniu własnych narzędzi dla zespołu **ZAWSZE zaczynaj od tworzenia własnych Skilli** (łatwa dystrybucja przez Git). Tworzenie własnych **Pluginów** (paczek konfiguracyjnych) zostaw na sam koniec jako funkcję "PRO" dla potężnych środowisk Enterprise. (Tabela Skill vs Plugin i dystrybucja: [`vibe_szczegoly_rozszerzenia.md`](/notatki/vibe-coding/vibe-coding-rozszerzenia); anatomia `SKILL.md`: [`vibe_szczegoly_skills.md`](/notatki/vibe-coding/vibe-coding-skills)).

### Opis

#### Lokalizacja Skilli
Skille mogą być globalne lub per-projekt:

```
# Globalny (każdy Twój projekt na PC)
~/.claude/skills/python-strict-quality/SKILL.md

# Lokalny (tylko ten projekt - wrzucasz do Git!)  
my_python_app/.claude/skills/cart-test-helpers/SKILL.md
```

> **Rekomendacja Eda:** Skille per-projekt **wrzucaj do Git** (commit). Wtedy każdy nowy programista (lub Ty na innym kompie) po `git pull` ma od razu zespołowe procedury.

#### Skill Typu 1 (Knowledge): Wiedza o Twoich konwencjach
**Plik:** `.claude/skills/cart-test-helpers/SKILL.md`

```markdown
---
name: cart-test-helpers
description: >
  Specjalistyczne helpery do pisania testów koszyka. 
  Generuje fixtures Pydantic, mocki Redis i komendy pytest.
  Używaj gdy padają słowa: "test koszyka", "fixture cart", 
  "mock Redis", "TDD koszyk".
version: 1.0.0
---

## Co robi ten skill
Generuje boilerplate testowy specyficzny dla naszego koszyka, 
bazując na fixturach z `tests/conftest.py`.

## Kiedy użyć
- Gdy użytkownik chce napisać test dla src/services/cart_service.py
- Gdy potrzeba mockowania połączenia z Redis (używamy fakeredis-py)
- Gdy padają słowa "test koszyka"

## Wiedza techniczna (Typ 1)
- Używamy `pytest-asyncio` z markerem `@pytest.mark.asyncio`
- Mockujemy Redis przez `fakeredis.aioredis.FakeRedis()`
- Importujemy fixtures: `from tests.conftest import redis_mock, sample_cart`

## Kroki generowania testu
1. Sprawdź lokalizację: czy test trafia do `tests/services/test_cart_service.py`
2. Nadaj nazwę: `test_<funkcja>_<scenario>` (np. `test_add_to_cart_creates_new_cart`)
3. Użyj fixturów z conftest
4. Asercje używaj `pytest.approx` dla cen, `assert in` dla list

## Format wyjścia
Zwróć:
- Pełny kod testu w bloku ```python
- Komendę uruchamiającą
- 1-zdaniowy opis: "Test sprawdza X w warunkach Y"
```

#### Skill Typu 2 (Process): Twój workflow jakości
**Plik:** `~/.claude/skills/python-strict-quality/SKILL.md` (globalny)

```markdown
---
name: python-strict-quality
description: >
  Surowy zestaw kontroli jakości kodu Python: ruff, mypy strict, 
  bandit, pytest z pokryciem. Używaj gdy: "sprawdź jakość", 
  "code review", "lint", "uruchom testy", "przed commitem".
version: 1.0.0
---

## Kiedy użyć
- Przed każdym `git commit` w Pythonie
- Gdy użytkownik prosi o "weryfikację jakości" lub "lint"

## Kroki (Twardo, w tej kolejności!)
1. Auto-format: `uv run ruff format src/ tests/`
2. Linter: `uv run ruff check src/ tests/`. Jeśli błędy: STOP, popraw, wróć.
3. Typy: `uv run mypy src/ --strict`. Jeśli błędy: STOP, popraw.
4. Bezpieczeństwo: `uv run bandit -r src/`. Jeśli HIGH: STOP, popraw.
5. Testy: `uv run pytest tests/ --cov=src --cov-fail-under=85 -v`
6. Sprawdź czy w kodzie nie pojawiło się "TODO", "TBD", emoji 
   (regex: `grep -rn "TODO\|TBD" src/`).

## Co zwracasz
- Status każdego kroku (✓/✗)
- Tylko gdy WSZYSTKIE 6 kroków przejdą - zwróć "READY TO COMMIT".
- Jeśli któryś krok padnie - opisz problem i zapropouj poprawkę.

## Anti-Pattern
NIE WOLNO Ci pomijać kroków by "zaoszczędzić czas". 
NIE WOLNO Ci ignorować mypy mówiąc "to tylko warning".
```

#### Komenda do tworzenia własnego Skilla
Najszybciej:
```bash
/skill-creator

Chcę skill, który [opis tego, co chcesz osiągnąć]. 
Zapisz go [globalnie / lokalnie w projekcie].
```

`Skill Creator` zada Ci pytania o triggery i format wyjściowy, a potem wygeneruje plik. **Sprawdź `description` - to najważniejsze pole!** (zasada "Bullseye" - musi mieć słowa, których faktycznie używasz).

---

## 6. Konfiguracja Hooków - Strażnik Bramy (Etap 5)

### Zagadnienie
Hooki to brutalne, automatyczne skrypty wpięte w cykl życia agenta. Nie pyta - wykonuje. Idealne do walki z AI Slopem.

### Opis

#### Plik konfiguracyjny
**Plik:** `.claude/settings.json`

```json
{
  "hooks": {
    "stop": [
      {
        "type": "command",
        "command": "bash .claude/hooks/quality_gate.sh",
        "description": "Strażnik bramy - testy, lintery, security"
      }
    ]
  }
}
```

> **Rekomendacja Eda:** ZAWSZE używaj typu `command` (komenda Bash), nigdy `prompt` ani `agent`. Komendy są przewidywalne i nie halucynują.

#### Skrypt Hooka: `.claude/hooks/quality_gate.sh`

```bash
#!/bin/bash
# Strażnik Bramy: Sprawdza czy agent może zamknąć zadanie

set -e

echo "[HOOK] Uruchamianie quality gate..."

# 1. Lintery i typy
uv run ruff check src/ tests/ || { echo "[FAIL] Ruff"; exit 1; }
uv run mypy src/ --strict || { echo "[FAIL] Mypy"; exit 1; }

# 2. Bezpieczeństwo
uv run bandit -r src/ -ll || { echo "[FAIL] Bandit"; exit 1; }

# 3. Testy z pokryciem
uv run pytest tests/ --cov=src --cov-fail-under=85 -q || {
  echo "[FAIL] Testy lub pokrycie < 85%"
  exit 1
}

# 4. Anti-Slop check
if grep -rn "TODO\|TBD\|FIXME" src/ --include="*.py"; then
  echo "[FAIL] Wykryto placeholdery w kodzie!"
  exit 1
fi

echo "[OK] Wszystkie kontrole przeszły. Możesz zamknąć zadanie."
exit 0
```

> **Działanie:** Gdy agent powie "zrobiłem zadanie", hook automatycznie odpala ten skrypt. Jeśli `exit 1` - **agent nie może zakończyć**, dostaje log i musi naprawić.

---

## 7. Wykonywanie Planu w pętli TDD (Etap 6)

### Zagadnienie
To główna pętla pracy. Korzystamy z Superpowers, by każde małe zadanie wykonywało się jako Sub-Agent, w izolacji.

### Opis

#### Komenda Superpowers do wykonania planu
```bash
/superpowers:execute-plan
```

Lub naturalnie: 
> *"Wykonaj Krok 2.3.1 z plan.md. Zatrzymaj się po nim. Stosuj rygorystycznie TDD i nasz `agents.md`."*

#### Workflow Sub-Agenta (jak działa Superpowers w środku)
1. Główny agent czyta `plan.md` i wybiera następny `[ ]` checkbox.
2. **Tworzy Sub-Agenta** z czystym oknem kontekstu, dając mu tylko ten konkretny krok i jego DoD.
3. Sub-Agent pisze test (RED).
4. Sub-Agent uruchamia test - widzi że pada.
5. Sub-Agent pisze MINIMALNY kod produkcyjny (GREEN).
6. Sub-Agent uruchamia test - widzi że przechodzi.
7. Główny agent **dwuetapowo weryfikuje** wynik:
   - Czy zgodny ze specyfikacją? (z `BRAINSTORM.md`)
   - Czy zgodny z `agents.md`? (jakość, anti-slop)
8. Jeśli OK - odhacza `[x]` w `plan.md` i zwraca kontrolę do Ciebie.

#### Twoja rola (HITL!)
Po każdym kroku:
- Otwórz pliki, które agent zmienił, **przeczytaj kod**.
- Sprawdź czy testy przeszły lokalnie (uruchom `uv run pytest` ręcznie).
- Jeśli OK: `git add . && git commit -m "Krok 2.3.1: Test RED add_to_cart"`.
- Powiedz agentowi: *"Akceptuję, zrobiłem commit. Wykonaj kolejny krok."*

> **Rekomendacja Eda - Don't bypass TDD!** Nie mów agentowi "Pomiń testy, po prostu zaimplementuj". Superpowers kategorycznie traktuje to jako błąd krytyczny. Cierpliwość zostanie nagrodzona zerową ilością bugów.

#### Twardy Reset między fazami
Po zakończeniu Fazy (np. cała Faza 2):
1. `git commit -m "Faza 2 ukończona: Modele Pydantic"` 
2. Poproś agenta: *"Zaktualizuj plan.md i podsumuj architektoniczne decyzje z Fazy 2"*.
3. Wykonaj `/clear` (Hard Reset pamięci).
4. Otwórz nowy czat i napisz: *"Przeczytaj agents.md i plan.md. Wykonaj Krok 3.1"*.

To rozwiązanie chroni przed **Context Rot** i drastycznie obniża koszty tokenów (10x).

---

## 8. Sub-Agents i Cross-Model Review (Etap 7)

### Zagadnienie
Po każdej Fazie warto zrobić niezależny Code Review używając INNEGO modelu LLM (Cross-Model). Inne sieci neuronowe wyłapują inne błędy.

### Opis

#### Wariant A: Wbudowany Sub-Agent Recenzenta
Stwórz dedykowany sub-agent: `.claude/agents/code_reviewer.md`

```markdown
---
name: code_reviewer
description: Recenzent kodu Read-Only specjalizujący się w wykrywaniu wycieków pamięci i podatności bezpieczeństwa.
---

Jesteś surowym Senior Reviewer. Nie piszesz kodu, tylko go oceniasz.

## Zakres
- Wycieki pamięci (sesje DB, otwarte pliki, listenery)
- OWASP Top 10 (SQL Injection, brak walidacji, hardcodowane sekrety)
- Anti-Slop: czy nie ma TODO, emoji, kilometrowych docstringów

## Format
Zapisuj wszystkie uwagi do `docs/review_<faza>.md` w postaci:
- Poważność (Krytyczna/Wysoka/Średnia)
- Plik:linia
- Opis problemu
- Sugerowana poprawka (snippet)

## ZAKAZY
- Nie modyfikuj plików w src/.
- Nie wymyślaj problemów - lepiej zwrócić pusty raport niż "Slop".
```

Wywołanie:
> *"Use the code_reviewer sub-agent to review src/services/cart_service.py and write findings to docs/review_phase2.md"*

#### Wariant B: Cross-Model Review (Codex CLI od OpenAI)
Mając zainstalowany `codex-cli` (`npm install -g openai/codex-cli`):

```bash
# W terminalu Claude Code, użyj narzędzia Bash:
codex exec "Please review src/services/cart_service.py for memory leaks 
and security issues. Write findings to docs/review_codex.md. 
DO NOT MODIFY ANY CODE."
```

Otrzymujesz raport z perspektywy GPT-5 Codex zamiast Claude Sonnet. Inne błędy = lepsza jakość finalna.

#### Wariant C: Skill `systematic-debugging`
Z Marketplace Claude Code zainstaluj:
```bash
/plugin → systematic-debugging
```

Agent przy debugu zacznie:
1. Tworzyć `debug.md` z hipotezami.
2. Udowadniać każdą hipotezę testem.
3. Zostawia ślad rozumowania, dzięki czemu unikasz "fałszywych alarmów" (red herring).

---

## 9. Finalizacja: Pull Request i Deploy (Etap 8)

### Zagadnienie
Po przejściu wszystkich Faz, czas zamknąć projekt. Superpowers ma na to dedykowany skill.

### Opis

#### Komenda
```bash
/superpowers:finishing
```

#### Co się dzieje:
1. Agent sprawdza, czy WSZYSTKIE checkboxy w `plan.md` są zaznaczone.
2. Uruchamia pełny zestaw kontroli (lintery, typy, testy, bandit).
3. Generuje opis Pull Requesta (na bazie commitów).
4. Tworzy branch przez Git Worktree (jeśli używasz tego workflow).
5. Wystawia PR poprzez GitHub MCP (jeśli skonfigurowany).

#### Manualnie (bez `finishing`):
```bash
# 1. Final test run
uv run pytest tests/ --cov=src -v

# 2. Sprawdź pokrycie
uv run pytest --cov-report=term-missing

# 3. Pełny git log dla PR
git log main..HEAD --oneline

# 4. Push i PR
git push origin feat/cart-api
gh pr create --title "feat: Cart API z auth JWT" --body-file docs/pr_body.md
```

> **WAŻNE (HITL):** Przed merge - **przejrzyj diff w GitHubie wzrokowo**. Niezależnie jak dobrze agent wszystko opisał - to ostatnia linia obrony. Klikasz `Merge` = bierzesz odpowiedzialność.

---

## 10. Zalecana struktura katalogów projektu od zera

```text
my_python_app/
│
├── .claude/                          # Konfiguracja AI agentów
│   ├── settings.json                # Hooki, uprawnienia
│   ├── agents/                      # Sub-agents per-projekt
│   │   └── code_reviewer.md
│   ├── skills/                      # Skille per-projekt (Git!)
│   │   ├── cart-test-helpers/
│   │   │   └── SKILL.md
│   │   └── quality-gate/
│   │       └── SKILL.md
│   └── hooks/                       # Skrypty Hooków
│       └── quality_gate.sh
│
├── docs/                            # Dokumentacja generowana
│   ├── BRAINSTORM.md               # Wynik /superpowers:brainstorm
│   ├── ARCHITECTURE.md             # Diagramy, decyzje
│   ├── review_phase1.md            # Code Reviews
│   └── debug.md                    # Sesje debugowania (skill systematic-debugging)
│
├── src/                             # Kod produkcyjny
│   ├── __init__.py
│   ├── main.py                     # FastAPI app entry
│   ├── api/                        # Routery
│   │   ├── __init__.py
│   │   ├── agents.md              # (opcjonalnie) Konstytucja modułu API
│   │   └── cart_router.py
│   ├── services/                   # Logika biznesowa
│   │   └── cart_service.py
│   ├── models/                     # Pydantic models
│   │   └── cart.py
│   ├── db/                         # Połączenia z DB
│   │   ├── agents.md              # (opcjonalnie) Konstytucja modułu DB
│   │   └── redis_client.py
│   └── core/                       # Configi, security
│       ├── config.py              # pydantic-settings
│       └── security.py
│
├── tests/                           # Testy (TDD!)
│   ├── conftest.py                # Fixtures (Redis mock, etc.)
│   ├── unit/
│   │   └── test_cart_service.py
│   └── integration/
│       └── test_cart_api.py
│
├── scripts/                         # Skrypty pomocnicze
│   ├── start.sh
│   └── setup_db.sh
│
├── .gitignore
├── .env.example                     # Szablon (NIGDY .env do Git!)
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml                   # uv: zależności, lintery, mypy
│
├── agents.md                        # ★ KONSTYTUCJA GŁÓWNA ★
├── plan.md                          # ★ USTAWA / TASK LIST ★
└── README.md                        # Krótki, max 100 linii
```

---

## Checklist Twojej pracy jako Główny Architekt

Po każdym etapie sprawdź:
- [ ] Czy przeczytałem dokument(y) wygenerowane przez agenta?
- [ ] Czy uruchomiłem testy lokalnie i przeszły?
- [ ] Czy zrobiłem `git commit` z opisowym message?
- [ ] Czy nie ma w kodzie placeholderów ("TODO", "TBD")?
- [ ] Czy nie ma emoji w plikach `.py`?
- [ ] Czy nazwy plików/klas są w angielskim PEP-8?
- [ ] Czy `agents.md` i `plan.md` są aktualne?
- [ ] Czy mogę wytłumaczyć **każdą** linijkę kodu, którą agent dodał? (zasada "Own the Code")

> **Manifesto Vibe Engineera:** Twoje imię będzie pod tym kodem na GitHubie. Nikt nie przyjmie tłumaczenia, że "AI tak napisało". To Ty dajesz twarz - ucz się każdej linijki.
