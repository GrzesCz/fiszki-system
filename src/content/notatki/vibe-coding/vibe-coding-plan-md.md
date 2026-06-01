---
title: 'Szczegóły: Plik plan.md (Ustawa i Zarządzanie)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-06-30'
review_count: 0
---
# Plik plan.md (Ustawa i Zarządzanie)

**Źródło:** Kurs Udemy Vibe Coding (Ed Donner), Raport Superpowers, specyfikacja Spec-Driven Development (SDD).

Jeśli `agents.md` to Konstytucja mówiąca "Jak się zachowywać", to `plan.md` jest **Ustawą** mówiącą "Co robimy tu i teraz". Jest to state-tracker (śledzenie stanu), lista zadań i specyfikacja techniczna w jednym. Pamiętaj, aby śledzić w nim postępy po ludzku, co pozwala łatwo wrócić do projektu po tygodniu przerwy, bez konieczności domyślania się, co agent miał na myśli w starych sesjach.

---

## Złota zasada: Procedura Twardego Resetu i `/compact`

Limit tokenów to nie tylko twarda ściana – im bliżej limitu, tym niższa inteligencja i spójność agenta (tzw. *Context Rot*).
Oto procedura zalecana przez Eda Donnera dla zaawansowanych projektów:

1. **Aktualizacja Planu:** Poproś agenta: *"Zaktualizuj plan.md, zamykając obecne kroki i uwzględniając podjęte przez ciebie decyzje architektoniczne"*.
2. **Git Commit:** Wykonaj commit w środowisku lokalnym. Nie ufaj zapewnieniom, dopóki kod nie jest bezpieczny w repozytorium.
3. **Hard Reset (`/clear`):** Zamiast pracować w nieskończoność w jednym oknie, wykonaj `/clear` lub otwórz całkowicie nowy czat. Zyskujesz "czysty mózg" modelu, który na kolejnym etapie zadziała celnie i błyskawicznie.
4. **Manualny `/compact`:** Jeśli nie chcesz resetować całej sesji, używaj komendy `/compact` do skompresowania starszej historii rozmowy. **Zasada Eda:** Nigdy nie pozwalaj agentowi na automatyczne kompaktowanie w połowie ciężkiego zadania (np. głębokiego refaktoringu). Uruchamiaj `/compact` **ręcznie** – pomiędzy zamkniętymi, przetestowanymi etapami ujętymi w `plan.md`.

---

## Co MUSI zawierać profesjonalny `plan.md`?

1. **Cel Główny (High-level goal):** Krótkie zdanie dla agenta, o co walczy w tym sprincie. Pamiętaj, aby uwzględniać instrukcje startowe serwera (np. jak obudzić projekt po nowym czacie, bo model zapomina wcześniejsze CLI).
2. **Aktualny Kontekst:** Zależności, z czego korzystamy, dlaczego to robimy.
3. **Fazy i Zadania (Checklista `[ ]`):** Najważniejsza część. Rozbicie logiki na **Bite-sized chunks** (małe zadania po 2-5 minut).
4. **Brak Placeholderów (Wymóg z Superpowers):** W planie musi być zapisana dokładna ścieżka do pliku, a zadania nie mogą zawierać słów typu "TODO" czy "TBD".
5. **Kryteria Akceptacji (Definition of Done - DoD):** Twarde reguły. Np. test X musi przejść na czerwono (TDD), potem na zielono.

---

## Szablon (Template) dla wyrafinowanego `plan.md`

Ten plik tworzysz Ty (jako Główny Architekt) LUB pozwalasz pierwszemu agentowi w fazie "Brainstormingu" go wygenerować dla Ciebie do akceptacji (zanim pozwoli się pisać kod produkcyjny!).

```markdown
# Plan: Moduł Koszyka Zakupowego (Shopping Cart)

## Cel Główny
Stworzenie API w FastAPI pozwalającego na dodawanie i usuwanie produktów z koszyka.
**Zawsze uruchamiaj serwer poleceniem:** `uvicorn src.main:app --reload` (Przypomnienie dla czystych sesji).

## Faza 1: Konfiguracja testów i połączenia z Redis (TDD)
- [ ] **Krok 1.1: Setup Redis Mock**
  - **Plik:** `tests/conftest.py`
  - **Akcja:** Dodaj fixture wstrzykujący `fakeredis` aby nie uderzać do produkcyjnej bazy.
  - **DoD:** Uruchomienie `pytest tests/conftest.py` przechodzi bez błędów.
- [ ] **Krok 1.2: Czerwony test (RED)**
  - **Plik:** `tests/test_cart.py`
  - **Akcja:** Napisz test funkcji `add_to_cart(user_id="123", product_id="A1")`.
  - **DoD:** Test MUSI zgłosić błąd `NotImplementedError`.

## Faza 2: Kod Produkcyjny Koszyka
- [ ] **Krok 2.1: Logika Biznesowa (GREEN)**
  - **Plik:** `src/services/cart_service.py`
  - **Akcja:** Zaimplementuj funkcję `add_to_cart`. Zapisuj w Redis.
  - **DoD:** Test z Kroku 1.2 MUSI przejść na zielono.

## Reguły Wykonywania Planu (dla Agenta)
1. NIE WOLNO Ci przejść do Fazy 2 przed zaliczeniem Fazy 1.
2. Po zaliczeniu Kroków w danej fazie, edytuj ten plik, wstawiając `[x]` obok zadań.
3. Nigdy nie kompaktuj pamięci bez mojej zgody w połowie zadania. Po wykonaniu etapu, przygotuj podsumowanie i poproś mnie o ręczny `/compact`.
```