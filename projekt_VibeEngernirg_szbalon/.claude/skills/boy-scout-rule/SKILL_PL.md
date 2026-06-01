---
name: Zasada Harcerza
description: >
  Wymusza "Zasadę Harcerza" — przy KAŻDEJ modyfikacji pliku agent MUSI: uruchomić
  linter z terminala, przeskanować plik pod kątem konkretnych wzorców długu
  technicznego, naprawić znalezione problemy, przetestować że moduł się importuje
  bez błędów, i usunąć wszystkie logi tymczasowe. ZERO tolerancji dla NameError.
---

# Zasada Harcerza (Boy Scout Rule)

## Wyzwalacz (Trigger)
- Aktywne ZAWSZE, gdy edytujesz lub modyfikujesz JAKIKOLWIEK plik `.py` z jakiegokolwiek powodu — nawet o 1 linijkę.

## Procedura

### KROK 1: Obowiązkowy Linter z Terminala
MUSISZ uruchomić linter na KAŻDYM pliku, który modyfikujesz. Użyj komendy odpowiedniej dla projektu:
```bash
# Preferowane (jeśli projekt używa uv + ruff):
uv run ruff check <ścieżka_do_pliku.py>

# Alternatywnie:
ruff check <ścieżka_do_pliku.py>
flake8 <ścieżka_do_pliku.py>
```
**Wklej output lintera** w swoją odpowiedź jako dowód.

### KROK 2: Skanowanie Pod Kątem Konkretnych Wzorców Długu
MUSISZ przeskanować modyfikowany plik pod kątem KAŻDEGO z poniższych wzorców:

| # | Wzorzec | Komenda grep | Co zrobić jeśli znaleziono |
| :--- | :--- | :--- | :--- |
| 1 | **Brak `exc_info=True`** | `grep -n "logger.error\|logger.exception" <plik>` | Dodaj `exc_info=True` do każdego `logger.error()` w bloku `except` |
| 2 | **Gołe `except:` (bare except)** | `grep -n "except:" <plik>` | Zamień na `except Exception as e:` lub konkretny typ |
| 3 | **Nieużywane importy** | Linter (ruff/flake8) — szukaj F401 | Usuń nieużywane importy |
| 4 | **Nieużywane zmienne** | Linter — szukaj F841 | Usuń lub prefixuj `_` |
| 5 | **Print zamiast logger** | `grep -n "print(" <plik>` | Zamień `print()` na odpowiedni `logger.info/debug/warning` |
| 6 | **Tymczasowe logi debugowania** | `grep -n "#region agent\|open(\"debug\|# DEBUG\|# TODO: remove\|# HACK" <plik>` | Usuń BEZWZGLĘDNIE przed oddaniem kodu |
| 7 | **Brak type hints** | `grep -n "def " <plik>` — czy sygnatury mają `->` i typowane argumenty? | Dodaj typowanie (przynajmniej `-> None` i typy argumentów) |
| 8 | **Magiczne liczby/stringi** | Szukaj powtarzanych literałów (np. `"production"`, `3600`, `"admin"`) | Wyciągnij do stałej (`CACHE_TTL = 3600`) |

### KROK 3: Obowiązkowy Test Importu
Po każdej modyfikacji MUSISZ uruchomić test importu w terminalu:
```bash
python -c "from <ścieżka.do.modułu> import <klasa_lub_funkcja>"
```
**Cel:** Upewnić się, że modyfikacja nie spowodowała `NameError`, `ImportError` ani `SyntaxError`.
**ZERO tolerancji dla `is not defined`** — jeśli test importu nie przechodzi, NAPRAW NATYCHMIAST zanim przejdziesz dalej.

### KROK 4: Weryfikacja Startowa (przy modyfikacji kluczowych plików)
Jeśli modyfikujesz plik wejściowy (`main.py`, `app.py`, `__init__.py`) lub plik konfiguracji:
```bash
python -W all <plik_wejściowy.py> --help  # lub inny bezpieczny tryb startowy
```
Sprawdź, czy:
- Aplikacja startuje bez `NameError`/`ImportError`
- Nie ma `DeprecationWarning` wywołanych przez Twój kod

### KROK 5: Czystość — Ostateczna Kontrola
Przed oddaniem kodu przeskanuj jeszcze raz:
```bash
grep -n "print(\|breakpoint()\|pdb\.\|# TODO: remove\|# HACK\|#region agent" <plik>
```
Jeśli COKOLWIEK się znajdzie — **USUŃ TO**. Nie ma wyjątków.

## Format Wyjściowy
Przed uznaniem zadania za skończone, MUSISZ przedstawić dowód Zasady Harcerza:

```markdown
### ⛺ ZASADA HARCERZA — RAPORT

**Plik:** `<nazwa_pliku.py>`

| Krok | Status | Dowód |
| :--- | :--- | :--- |
| Linter | ✅ CZYSTO / ⚠️ X błędów naprawionych | `uv run ruff check ...` → output |
| Wzorce długu | ✅ CZYSTO / ⚠️ Naprawiono: [lista] | grep output |
| Test importu | ✅ PASS / ❌ FAIL | `python -c "from ... import ..."` → output |
| Czystość (debug logi) | ✅ CZYSTO | grep output |

**Poprawki Harcerza:** [lista drobnych poprawek, np. "Dodano exc_info=True w linii 45", "Usunięto nieużywany import os"]
```

## Scope Discipline (Dyscyplina Zasięgu)
Zasada Harcerza dotyczy WYŁĄCZNIE pliku, który w danej chwili edytujesz. MASZ SUROWY ZAKAZ rozszerzania refaktoryzacji (scope creep) na inne pliki w projekcie. Jeśli zauważysz dług techniczny w innym pliku, po prostu zgłoś to użytkownikowi, ale go NIE EDYTUJ.

## Twarde Kryteria Wyjścia (Exit Criteria)
Plik jest gotowy do oddania TYLKO gdy:
- [ ] Linter został uruchomiony z terminala i output jest wklejony jako dowód.
- [ ] Wszystkie 8 wzorców długu technicznego zostało sprawdzone (każdy z osobna — z outputem grepa).
- [ ] Test importu (`python -c`) przechodzi czysto (0 błędów) — output wklejony jako dowód.
- [ ] ZERO logów tymczasowych — dowód: output komendy `grep -n "print(\|breakpoint()\|pdb\.\|#region agent" <plik>` → **0 trafień**.
- [ ] Raport Harcerza jest wygenerowany w powyższym formacie (tabela z dowodami).
- [ ] Agent jawnie napisał: "Zasada Harcerza zakończona. Plik `<nazwa.py>`: naprawiono X problemów, linter PASS, import PASS, 0 logów tymczasowych."

## Tabela Anty-Racjonalizacji
| Racjonalizacja | Akcja Agenta |
| --- | --- |
| "Tylko poprawiam literówkę, nie muszę odpalać lintera." | **ODRZUCONO.** Zasada obowiązuje przy KAŻDEJ modyfikacji — nawet 1 linijki. Uruchom linter. |
| "Linter znalazł 20 błędów, ale one były tam już wcześniej. Zignoruję to." | **ODRZUCONO.** Jeśli dotknąłeś pliku, jesteś odpowiedzialny za wyczyszczenie brudu. Napraw błędy. |
| "Test importu zajmie za dużo czasu." | **ODRZUCONO.** Test zajmuje 2 sekundy. Uruchom `python -c` i udowodnij, że import działa. |
| "Zostawię tego print(), pomoże mi w debugowaniu w przyszłości." | **ODRZUCONO.** ZERO tolerancji dla print() w kodzie produkcyjnym. Zamień na logger lub usuń. |
| "Type hints nie są wymagane w tym projekcie." | **ODRZUCONO.** Na poziomie Enterprise typowanie jest OBOWIĄZKOWE. Dodaj przynajmniej typy argumentów i zwracanej wartości. |
