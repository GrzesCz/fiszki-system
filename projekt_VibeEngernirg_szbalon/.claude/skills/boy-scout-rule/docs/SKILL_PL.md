---
name: boy-scout-rule
description: >
  Wymusza zasadę skauta (Boy Scout Rule) — przy KAŻDEJ modyfikacji pliku agent MUSI:
  uruchomić linter z terminala, przeskanować plik pod kątem konkretnych wzorców długu technicznego,
  naprawić znalezione problemy, zweryfikować poprawność importu modułu oraz usunąć tymczasowe logi.
  ZERO tolerancji dla NameError.
version: 1.0.0
---

# Boy Scout Rule (Zasada Skauta)

## Wyzwalacz (Trigger)

- Aktywny przy edycji lub modyfikacji DOWOLNEGO pliku `.py`. Nakład pracy powinien być proporcjonalny do zmiany:
  - **Pełen rytuał** (wszystkie 5 kroków + raport) dla zmian w logice biznesowej, uwierzytelnianiu, bazie danych, API, zewnętrznych integracjach lub zmianach wykraczających poza kosmetykę.
  - **Tryb lekki** (tylko Krok 1 linter + Krok 3 test importu) dla edycji czysto kosmetycznych: poprawa literówki, formatowania, opisu w docstringu. Nie uruchamiaj pełnego skanowania grep i pełnego raportu dla zmiany jednego znaku – to marnowanie kontekstu i zbędny szum informacyjny.

## Relacja z innymi skillami

- `boy-scout-rule` usuwa **martwy / śmieciowy** kod (nieużywane importy, logi debugowania, gołe bloki except, instrukcje print). `simplicity-gate` usuwa **działający, ale niepotrzebny** kod (spekulacyjne abstrakcje, nadmiarowe warunki obronne, które nie mogą się wydarzyć, komentarze typu "co robi kod"). Nie duplikuj ich pracy: ocenę nadmiarowej inżynierii pozostaw dla `simplicity-gate`.

## Procedura

### KROK 1: Obowiązkowy linter z poziomu terminala
MUSISZ uruchomić linter dla KAŻDEGO modyfikowanego pliku. Użyj polecenia odpowiedniego dla projektu:
```bash
# Preferowane (jeśli projekt używa uv + ruff):
uv run ruff check <path_to_file.py>

# Alternatywnie:
ruff check <path_to_file.py>
flake8 <path_to_file.py>
```
**Wklej wynik działania lintera** w swojej odpowiedzi jako dowód.

### KROK 2: Skanowanie w poszukiwaniu konkretnych wzorców długu technicznego
MUSISZ przeskanować zmodyfikowany plik pod kątem KAŻDEGO z poniższych wzorców:

| # | Wzorzec | Polecenie Grep | Co zrobić w przypadku znalezienia |
| :--- | :--- | :--- | :--- |
| 1 | **Brak `exc_info=True`** | `grep -n "logger.error\|logger.exception" <file>` | Dodaj `exc_info=True` do każdego `logger.error()` w bloku `except` |
| 2 | **Gołe `except:`** | `grep -n "except:" <file>` | Zastąp przez `except Exception as e:` lub konkretny typ wyjątku |
| 3 | **Nieużywane importy** | Linter (ruff/flake8) — kod F401 | Usuń nieużywane importy |
| 4 | **Nieużywane zmienne** | Linter — kod F841 | Usuń lub dodaj prefiks `_` |
| 5 | **`print` zamiast loggera** | `grep -n "print(" <file>` | Zastąp `print()` odpowiednim logowaniem `logger.info/debug/warning` |
| 6 | **Tymczasowe logi debugowania** | `grep -n "#region agent\|open(\"debug\|# DEBUG\|# TODO: remove\|# HACK" <file>` | Usuń BEZWARUNKOWO przed zatwierdzeniem kodu |
| 7 | **Brak typowania (type hints)** | `grep -n "def " <file>` — czy sygnatury mają `->` i typy argumentów? | Dodaj typowanie (co najmniej `-> None` dla funkcji bez return oraz typy parametrów) |
| 8 | **Magiczne liczby/ciągi znaków** | Szukaj powtarzających się literałów (np. `"production"`, `3600`, `"admin"`). **Ręczna ocena** — grep nie odróżni magicznego `3600` od poprawnego `range(10)`. Przeanalizuj kandydatów, nie podmieniaj w ciemno. | Wydziel do stałej (`CACHE_TTL = 3600`) tylko tam, gdzie realnie poprawia to czytelność. |

### KROK 3: Obowiązkowy test importu
Po każdej modyfikacji MUSISZ uruchomić test importu w terminalu:
```bash
python -c "from <module.path> import <class_or_function>"
```
**Cel:** Upewnienie się, że zmiana nie wprowadziła błędu `NameError`, `ImportError` lub `SyntaxError`.
**ZERO tolerancji dla błędów typu `is not defined`** — jeśli test importu nie powiedzie się, NAPRAW GO NATYCHMIAST przed dalszymi krokami.

### KROK 4: Weryfikacja uruchomienia (dla kluczowych plików)
Jeśli modyfikujesz punkt wejścia (`main.py`, `app.py`, `__init__.py`) lub plik konfiguracyjny:
```bash
python -W all <entry_file.py> --help  # lub inny bezpieczny tryb uruchomienia
```
Sprawdź, czy:
- Aplikacja uruchamia się bez błędów `NameError`/`ImportError`
- Twój kod nie powoduje ostrzeżeń `DeprecationWarning`

### KROK 5: Ostateczne sprawdzenie czystości
Przed zatwierdzeniem kodu przeskanuj plik po raz ostatni:
```bash
grep -n "print(\|breakpoint()\|pdb\.\|# TODO: remove\|# HACK\|#region agent" <file>
```
Jeśli cokolwiek zostanie znalezione — **USUŃ TO**. Bez wyjątków.

## Format raportu końcowego (Output Format)
Przed zakończeniem zadania MUSISZ przedstawić raport z wykonania Zasady Skauta:

```markdown
### ⛺ BOY SCOUT RULE — REPORT

**File:** `<filename.py>`

| Step | Status | Proof |
| :--- | :--- | :--- |
| Linter | ✅ CLEAN / ⚠️ Naprawiono X błędów | `uv run ruff check ...` → wynik |
| Debt patterns | ✅ CLEAN / ⚠️ Naprawiono: [lista] | wynik grep |
| Import test | ✅ PASS / ❌ FAIL | `python -c "from ... import ..."` → wynik |
| Cleanliness (debug logs) | ✅ CLEAN | wynik grep |

**Boy Scout Fixes:** [lista drobnych poprawek, np. "Dodano exc_info=True w linii 45", "Usunięto nieużywany import os"]
```

## Dyscyplina zakresu (Scope Discipline)
Zasada Skauta ma zastosowanie WYŁĄCZNIE do pliku, który aktualnie edytujesz. Kategorycznie ZABRANIA się rozszerzania refaktoryzacji (scope creep) na inne pliki w projekcie. Jeśli zauważysz dług techniczny w innym pliku, po prostu zgłoś to użytkownikowi, ale NIE EDYTUJ go.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Plik jest gotowy do zatwierdzenia WYŁĄCZNIE wtedy, gdy:
- [ ] Linter został uruchomiony z terminala, a jego wynik wklejony jako dowód.
- [ ] Wszystkie 8 wzorców długu technicznego zostało sprawdzonych (każdy osobno — wraz z wklejonym wynikiem polecenia grep).
- [ ] Test importu (`python -c`) kończy się sukcesem (0 błędów) — wynik wklejony jako dowód.
- [ ] W pliku jest ZERO tymczasowych logów/zapisów — dowód: wynik `grep -n "print(\|breakpoint()\|pdb\.\|#region agent" <file>` zwraca **0 wyników**.
- [ ] Raport Skauta został wygenerowany w powyższym formacie (tabela z dowodami).
- [ ] Agent wprost oświadczył: "Boy Scout Rule complete. File `<name.py>`: fixed X issues, linter PASS, import PASS, 0 temporary logs."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Poprawiam tylko literówkę, nie muszę odpalać lintera." | **CZĘŚCIOWO ODRZUCONO.** Nawet w trybie lekkim uruchamiasz linter (Krok 1) oraz test importu (Krok 3). Pełna bateria grep jest zarezerwowana dla większych zmian, ale lintowanie dotkniętego pliku nigdy nie jest pomijane. |
| "Linter znalazł 20 błędów, ale one już tam były, zanim dotknąłem pliku." | **ODRZUCONO.** Jeśli edytujesz plik, jesteś odpowiedzialny za posprzątanie bałaganu. Napraw te błędy. |
| "Test importu potrwa zbyt długo." | **ODRZUCONO.** Test trwa 2 sekundy. Uruchom `python -c` i udowodnij, że import działa. |
| "Zostawię tę instrukcję print(), pomoże mi debugować później." | **ODRZUCONO.** ZERO tolerancji dla print() w kodzie produkcyjnym. Zastąp loggerem lub usuń. |
| "Typowanie nie jest wymagane w tym projekcie." | **ODRZUCONO.** Na poziomie Enterprise typowanie jest OBOWIĄZKOWE. Dodaj przynajmniej typy argumentów i zwracanej wartości. |
