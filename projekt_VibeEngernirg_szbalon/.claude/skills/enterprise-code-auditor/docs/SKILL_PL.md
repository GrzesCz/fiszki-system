---
name: enterprise-code-auditor
description: >
  Uruchamia się przed każdym większym commitem kodu lub na żądanie użytkownika. Przeprowadza rygorystyczny,
  strukturyzowany audyt bezpieczeństwa, wydajności, jakości i architektury. Agent MUSI używać poleceń
  terminala i grep_search do udowodnienia każdego znaleziska — odpowiadanie z pamięci jest zabronione.
  Uruchamia się, gdy użytkownik mówi "audit my code", "security review", "check code quality", "run enterprise audit".
version: 1.0.0
---

# Enterprise Code Auditor (Audytor Kodu Klasy Enterprise)

## Wyzwalacz (Trigger)

- Użytkownik mówi "audit", "check security", "przeanalizuj kod", "zrób audyt".
- Przed zatwierdzeniem (commit) lub finalizacją istotnej funkcjonalności.

## Procedura

### KROK 0: Cost Guard (Zabezpieczenie przed Tokenową Czarną Dziurą)
Przed uruchomieniem jakichkolwiek poleceń `grep` lub poleceń terminala, MUSISZ sprawdzić rozmiar repozytorium.
1. Uruchom polecenie `find . -name "*.py" -not -path "*/\.*" -not -path "*/venv/*" | wc -l` (lub jego odpowiednik), aby policzyć pliki Pythona.
2. Jeśli liczba plików wynosi **> 10**, MUSISZ natychmiast się zatrzymać i wyświetlić następujące ostrzeżenie:
   > "🚨 **OSTRZEŻENIE: WYKRYTO DUŻY PROJEKT.** Uruchomienie pełnego audytu kodu (Enterprise Audit) w tym projekcie przy użyciu Dynamic Workflows lub Ultra Code może zużyć ogromną liczbę tokenów. Czy autoryzujesz uruchomienie pełnego audytu, czy wolisz przeprowadzić audyt konkretnych plików za pomocą `/goal`?"
3. Przejdź dalej TYLKO wtedy, gdy użytkownik wyraźnie to autoryzuje.

### KROK 1: Zbieranie informacji (Zakaz halucynacji)
MUSISZ użyć narzędzia `grep_search` lub terminala (`grep -rn`) do aktywnego przeskanowania bazy kodu pod kątem konkretnych wzorców wymienionych poniżej. Kategorycznie ZABRANIA się odpowiadania z pamięci — każdy punkt musi posiadać dowód w postaci wyniku z terminala.

> **Grep to triaż, a nie dowód.** Poniższe wzorce wykrywają proste przypadki (np. `execute(f"...")`), ale omijają bardziej wyrafinowane (SQL budowany za pomocą `.format()` dwie linie wyżej, filtry ORM z nieoczyszczonych danych wejściowych, sekrety przekazywane przez zmienną). Brak wyników z grep NIE oznacza, że kod jest czysty. Jeśli są dostępne, wesprzyj skanowanie rzeczywistymi narzędziami: `bandit -r src` (audyt bezpieczeństwa), `pip-audit` (CVE w zależnościach) oraz `semgrep` z regułami OWASP. Traktuj wyniki grep jako kandydatów do oceny inżynierskiej, a nie ostateczny wyrok.

### KROK 2: Audyt bezpieczeństwa (Security Audit)

Przeskanuj projekt przy użyciu DOKŁADNIE tych wzorców:

| Zagrożenie | Polecenia/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **SQL Injection** | `grep -rn "execute(f\"" --include="*.py"`, `grep -rn "execute(\"%" --include="*.py"`, `grep -rn "cursor.execute.*+" --include="*.py"` | FOUND / CLEAN |
| **Zapisane na stałe sekrety (Hardcoded Secrets)** | `grep -rn "password=" --include="*.py"`, `grep -rn "api_key=" --include="*.py"`, `grep -rn "secret=" --include="*.py"`, `grep -rn "token=" --include="*.py"` | FOUND / CLEAN |
| **Wyciek PII w logach** | `grep -rn "logger.*email" --include="*.py"`, `grep -rn "logger.*password" --include="*.py"`, `grep -rn "print(.*email" --include="*.py"` | FOUND / CLEAN |
| **Prompt Injection** | `grep -rn "f\".*{user" --include="*.py"` (szukaj nieoczyszczonych danych wejściowych użytkownika wstrzykiwanych do promptów LLM) | FOUND / CLEAN / N/A |
| **Walidacja danych wejściowych** | `grep -rn "request\." --include="*.py"` — czy dane żądania przechodzą przez walidację (Pydantic, walidatory)? | OK / MISSING |

### KROK 3: Audyt wydajności (Performance Audit)

| Problem | Polecenia/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **Blokowanie asynchroniczności (Async Blocking)** | `grep -rn "requests\." --include="*.py"`, `grep -rn "time\.sleep" --include="*.py"`, `grep -rn "open(" --include="*.py"` — szukaj synchronicznego I/O wewnątrz `async def` | FOUND / CLEAN |
| **Zapytania N+1** | Ręcznie sprawdź pętle `for` w plikach z `session.` lub `query.` — czy wewnątrz pętli znajduje się wywołanie bazy danych? | FOUND / CLEAN |
| **Pule połączeń (Connection Pooling)** | `grep -rn "create_engine" --include="*.py"` — czy zawiera `pool_size`, `max_overflow`? `grep -rn "NullPool" --include="*.py"` | OK / MISSING / N/A |

### KROK 4: Audyt jakości (Quality Audit)

| Problem | Polecenia/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **Obsługa błędów** | `grep -rn "logger.error" --include="*.py"` — czy każde wystąpienie ma `exc_info=True`? `grep -rn "except:" --include="*.py"` — szukaj gołych except | OK / ISSUES |
| **Typowanie (Type Hints)** | `grep -rn "def " --include="*.py"` — czy sygnatury funkcji zawierają typy argumentów i typ zwracany (`-> ...`)? | OK / MISSING |
| **Print vs Logger** | `grep -rn "print(" --include="*.py"` — czy w kodzie produkcyjnym używa się `print()` zamiast loggera? | OK / ISSUES |
| **Nadmierna inżynieria (Over-Engineering)** | `uv run ruff check --select C901,PLR src` (złożoność) + ręczny przegląd: interfejsy/fabryki z tylko jedną implementacją, bloki `try/except` bez realnej ścieżki błędu, komentarze objaśniające to, co widać w kodzie | OK / BLOAT |

### KROK 5: Audyt architektury (Architecture Audit)

| Problem | Polecenia/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **Separacja warstw** | Czy pliki routerów (z `APIRouter`) zawierają logikę biznesową lub zapytania SQL? `grep -rn "execute\|select\|insert\|update\|delete" router*.py` | OK / VIOLATION |
| **Modularność** | Czy rozmiary plików są rozsądne? `wc -l *.py`. Około 400 linii to sygnał ostrzegawczy wart przeanalizowania, ale NIE twardy limit — nie dziel spójnego kodu tylko po to, by obniżyć liczbę linii. | OK / REVIEW |
| **Spójność źródeł danych** | Czy wszystkie zdefiniowane źródła danych (np. lokalna baza danych + zewnętrzne API) są obsługiwane? Czy nie brakuje ich w nowych endpointach? | OK / MISSING |

### KROK 6: Format raportu (Output Format)
MUSISZ wygenerować raport w DOKŁADNIE poniższym formacie (wklej dowody z terminala pod każdą sekcją):

```markdown
## 🚨 SECURITY AUDIT
- 💉 SQL INJECTION: [FOUND / CLEAN] — proof: `wynik grep...`
- 🔐 HARDCODED SECRETS: [FOUND / CLEAN]
- 🕵️ PII LEAKAGE: [FOUND / CLEAN]
- 🤖 PROMPT INJECTION: [FOUND / CLEAN / N/A]
- 🛡️ INPUT VALIDATION: [OK / MISSING]

## ⚡ PERFORMANCE AUDIT
- ASYNC BLOCKING: [FOUND / CLEAN]
- N+1 QUERIES: [FOUND / CLEAN]
- CONNECTION POOLING: [OK / MISSING / N/A]

## 📝 CODE QUALITY AUDIT
- ERROR HANDLING (exc_info): [OK / ISSUES]
- TYPE HINTS: [OK / MISSING]
- PRINT vs LOGGER: [OK / ISSUES]

## ✂️ SIMPLICITY AUDIT
- OVER-ENGINEERING (speculative abstractions): [OK / BLOAT] — proof: `ruff --select C901,PLR ...` + notatki
- DEFENSIVE CODE (unreachable guards): [OK / BLOAT]
- WHAT-COMMENTS: [OK / BLOAT]

## 🏗️ ARCHITECTURE AUDIT
- LAYER SEPARATION: [OK / VIOLATION]
- MODULARITY: [OK / OVERSIZED]
- DATA SOURCE CONSISTENCY: [OK / MISSING]

## 🔍 PROBLEMS TO FIX (posortowane według priorytetu)
1. [🔴 CRITICAL] Opis problemu + plik + linia
2. [🟡 HIGH] ...
3. [🟢 MEDIUM] ...
4. [⚪ LOW] ...
```

## Dyscyplina zakresu (Scope Discipline)
Enterprise Code Auditor został zaprojektowany jako narzędzie tylko do odczytu. Podczas wykonywania tego zadania kategorycznie ZABRANIA się modyfikowania jakichkolwiek plików z kodem źródłowym, chyba że użytkownik wyraźnie poprosi o "naprawienie problemów znalezionych w audycie" ("fix issues found in the audit").

## Twarde kryteria wyjścia (Hard Exit Criteria)
Audyt jest zakończony WYŁĄCZNIE wtedy, gdy:
- [ ] Każdy punkt raportu posiada obok siebie dowód z terminala (wynik grep lub wynik innego polecenia).
- [ ] Raport został wygenerowany w pełnym powyższym formacie (żadna sekcja nie została pominięta).
- [ ] Wszystkie problemy o priorytecie `CRITICAL` mają zaproponowane rozwiązanie.
- [ ] Agent wprost oświadczył: "Audit complete. Scanned X files, found Y problems."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Przeanalizuję tylko fragment kodu przesłany przez użytkownika." | **ODRZUCONO.** Musisz przeskanować cały projekt (lub wszystkie zmienione pliki) za pomocą poleceń w terminalu. |
| "Nie muszę sprawdzać wycieków PII, to tylko prosty skrypt." | **ODRZUCONO.** Sprawdzenie wycieków PII jest obowiązkowe na poziomie Enterprise. |
| "Znam ten kod, nie muszę uruchamiać grep." | **ODRZUCONO.** Twoja pamięć bywa zawodna. Uruchom polecenie i wklej wynik. |
| "Architektura wygląda w porządku, nie muszę jej sprawdzać." | **ODRZUCONO.** Audyt architektury jest obowiązkowy. Zweryfikuj separację warstw i modularność. |
