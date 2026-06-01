---
name: Audytor Enterprise
description: >
  Aktywuje się przed zatwierdzeniem większych zmian lub na życzenie użytkownika.
  Przeprowadza rygorystyczny, ustrukturyzowany audyt bezpieczeństwa, wydajności,
  jakości i architektury. Agent MUSI użyć terminala i grep_search, aby udowodnić
  każdy punkt — zakaz odpowiadania z pamięci. Odpala się, gdy użytkownik mówi:
  "zrób audyt kodu", "sprawdź bezpieczeństwo", "przegląd jakości", "enterprise audit".
---

# Audytor Enterprise (Enterprise Code Auditor)

## Wyzwalacz (Trigger)
- Użytkownik mówi "audyt", "sprawdź bezpieczeństwo", "przeanalizuj kod", "zrób audyt"
- Przed commitem lub zakończeniem pracy nad większym zadaniem (feature)

## Procedura

### KROK 1: Zbieranie Informacji (Zakaz Halucynacji)
MUSISZ użyć `grep_search` lub terminala (`grep -rn`) aby aktywnie przeskanować codebase pod kątem konkretnych wzorców. NIE WOLNO Ci opierać się na pamięci — każdy punkt musi mieć dowód z terminala.

### KROK 2: Audyt Bezpieczeństwa (Security)

Przeskanuj projekt używając DOKŁADNIE tych wzorców:

| Zagrożenie | Komendy/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **SQL Injection** | `grep -rn "execute(f\"" --include="*.py"`, `grep -rn "execute(\"%" --include="*.py"`, `grep -rn "cursor.execute.*+" --include="*.py"` | ZNALEZIONO / CZYSTO |
| **Sekrety/Hasła w kodzie** | `grep -rn "password=" --include="*.py"`, `grep -rn "api_key=" --include="*.py"`, `grep -rn "secret=" --include="*.py"`, `grep -rn "token=" --include="*.py"` | ZNALEZIONO / CZYSTO |
| **Wyciek PII w logach** | `grep -rn "logger.*email" --include="*.py"`, `grep -rn "logger.*password" --include="*.py"`, `grep -rn "logger.*phone" --include="*.py"`, `grep -rn "print(.*email" --include="*.py"` | ZNALEZIONO / CZYSTO |
| **Prompt Injection** | `grep -rn "f\".*{user" --include="*.py"` (szukaj niesanityzowanego inputu użytkownika wstrzykiwanego do promptów LLM) | ZNALEZIONO / CZYSTO / N/D |
| **Walidacja Inputów** | `grep -rn "request\." --include="*.py"` — czy dane z requestu przechodzą przez walidację (Pydantic, Validators)? | OK / BRAKI |

### KROK 3: Audyt Wydajności (Performance)

| Problem | Komendy/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **Blokowanie Async** | `grep -rn "requests\." --include="*.py"`, `grep -rn "time\.sleep" --include="*.py"`, `grep -rn "open(" --include="*.py"` — szukaj synchronicznych wywołań I/O wewnątrz `async def` | ZNALEZIONO / CZYSTO |
| **N+1 Queries** | Ręcznie przejrzyj pętle `for` w plikach z `session.` lub `query.` — czy w ciele pętli jest wywołanie DB? | ZNALEZIONO / CZYSTO |
| **Connection Pooling** | `grep -rn "create_engine" --include="*.py"` — czy jest `pool_size`, `max_overflow`? `grep -rn "NullPool" --include="*.py"` | OK / BRAKI / N/D |

### KROK 4: Audyt Jakości (Quality)

| Problem | Komendy/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **Obsługa Błędów** | `grep -rn "logger.error" --include="*.py"` — czy każde wystąpienie ma `exc_info=True`? `grep -rn "except:" --include="*.py"` — szukaj gołych `except` (bare except) | OK / PROBLEMY |
| **Typowanie (Type Hints)** | `grep -rn "def " --include="*.py"` — czy sygnatury funkcji mają typy argumentów i wartości zwracanej (`-> ...`)? | OK / BRAKI |
| **Logging vs Print** | `grep -rn "print(" --include="*.py"` — czy w kodzie produkcyjnym są `print()` zamiast `logger`? | OK / PROBLEMY |

### KROK 5: Audyt Architektury

| Problem | Komendy/Wzorce do wyszukania | Werdykt |
| :--- | :--- | :--- |
| **Separacja Warstw** | Czy routery (pliki z `APIRouter`) zawierają logikę biznesową lub zapytania SQL? `grep -rn "execute\|select\|insert\|update\|delete" router*.py` | OK / NARUSZENIE |
| **Modularność** | Czy pliki mają rozsądną długość (<400 linii)? `wc -l *.py` lub przejrzyj strukturę katalogów | OK / ZA DUŻE PLIKI |
| **Spójność Źródeł Danych** | Czy wszystkie zdefiniowane źródła danych (np. lokalna DB + zewnętrzne API) są obsługiwane? Czy brakuje obsługi któregoś w nowych endpointach? | OK / BRAKI |

### KROK 6: Raport — Format Wyjściowy
MUSISZ wygenerować raport DOKŁADNIE w poniższym formacie (wklej dowody z terminala pod każdą sekcją):

```markdown
## 🚨 SECURITY AUDIT
- 💉 SQL INJECTION: [ZNALEZIONO / CZYSTO] — dowód: `grep output...`
- 🔐 SEKRETY W KODZIE: [ZNALEZIONO / CZYSTO]
- 🕵️ WYCIEK PII: [ZNALEZIONO / CZYSTO]
- 🤖 PROMPT INJECTION: [ZNALEZIONO / CZYSTO / N/D]
- 🛡️ WALIDACJA INPUTÓW: [OK / BRAKI]

## ⚡ PERFORMANCE AUDIT
- BLOKOWANIE ASYNC: [ZNALEZIONO / CZYSTO]
- ZAPYTANIA N+1: [ZNALEZIONO / CZYSTO]
- CONNECTION POOLING: [OK / BRAKI / N/D]

## 📝 CODE QUALITY AUDIT
- OBSŁUGA BŁĘDÓW (exc_info): [OK / PROBLEMY]
- TYPOWANIE (TYPE HINTS): [OK / BRAKI]
- PRINT vs LOGGER: [OK / PROBLEMY]

## 🏗️ ARCHITECTURE AUDIT
- SEPARACJA WARSTW: [OK / NARUSZENIE]
- MODULARNOŚĆ: [OK / ZA DUŻE PLIKI]
- SPÓJNOŚĆ ŹRÓDEŁ DANYCH: [OK / BRAKI]

## 🔍 PROBLEMY DO NAPRAWY (posortowane wg severity)
1. [🔴 CRITICAL] Opis problemu + plik + linia
2. [🟡 HIGH] ...
3. [🟢 MEDIUM] ...
4. [⚪ LOW] ...
```

## Scope Discipline (Dyscyplina Zasięgu)
Audytor Enterprise to narzędzie z założenia read-only. Podczas wykonywania tego skilla MASZ ZAKAZ modyfikowania jakichkolwiek plików z kodem źródłowym, chyba że użytkownik wyraźnie poprosi o "naprawienie problemów po audycie".

## Twarde Kryteria Wyjścia (Exit Criteria)
Audyt jest skończony TYLKO gdy:
- [ ] Każdy punkt w raporcie ma obok siebie dowód z terminala (output grepa lub komendy).
- [ ] Raport jest wygenerowany w pełnym, powyższym formacie (żadna sekcja nie jest pominięta).
- [ ] Wszystkie znalezione problemy `CRITICAL` mają zaproponowaną poprawkę.
- [ ] Agent jawnie napisał: "Audyt zakończony. Przeskanowałem X plików, znaleziono Y problemów."

## Tabela Anty-Racjonalizacji
| Racjonalizacja | Akcja Agenta |
| --- | --- |
| "Przejrzę tylko ten kawałek kodu, który wysłał user." | **ODRZUCONO.** Musisz przeskanować cały projekt (lub wszystkie zmienione pliki) komendami z terminala. |
| "Nie muszę sprawdzać wycieku PII, to tylko prosty skrypt." | **ODRZUCONO.** Sprawdzanie wycieku PII jest obowiązkowe na poziomie Enterprise. |
| "Znam ten kod, nie muszę robić grepa." | **ODRZUCONO.** Twoja pamięć halucynuje. Uruchom komendę i wklej output. |
| "Architektura jest OK, nie muszę tego sprawdzać." | **ODRZUCONO.** Audyt architektury jest obowiązkowy. Sprawdź separację warstw i modularność. |
