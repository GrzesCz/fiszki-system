---
name: release-readiness
description: >
  Sprawdza gotowość do scalenia (merge) lub wdrożenia (deploy): CI, testy, bezpieczeństwo, migracje,
  zmiany w OpenAPI, wycofanie (rollback), testy typu smoke, monitoring i pozostałe ryzyka.
  Uruchamia się, gdy użytkownik mówi "prepare release", "ready for deploy", "can we merge this".
version: 1.0.0
---

# Release Readiness (Gotowość do Wydania)

## Cel

Podjęcie decyzji, czy projekt jest gotowy do scalenia (merge) lub wdrożenia produkcyjnego (deploy).

## Kiedy używać

- Przed scaleniem gałęzi (merge).
- Przed wdrożeniem (deploy).
- Po usunięciu problemów o poziomie krytyczności Critical/High.
- Po fazie projektu, która modyfikuje API, dane, uwierzytelnianie lub infrastrukturę.

## Kiedy NIE używać

- Prace są wciąż w toku i nie ma potrzeby podejmowania decyzji o wydaniu wersji.

## Dane wejściowe

- Plik `plan.md`.
- Plik `docs/release_plan.md`.
- Plik `docs/risk_register.md`.
- Plik `docs/operations.md`.
- Wyniki CI, testów oraz audytu bezpieczeństwa.

## Procedura

1. Sprawdź wszystkie wymagane pola wyboru (checkboxy) w bieżącej fazie projektu.
2. Sprawdź wyniki CI.
3. Sprawdź testy jednostkowe, integracyjne, kontraktowe, E2E oraz testy bezpieczeństwa.
4. Sprawdź linter i typowanie (type-check).
5. Sprawdź skanowanie zależności i audyt bezpieczeństwa.
6. Sprawdź plan migracji i wycofania (rollback plan).
7. Sprawdź zmiany mogące naruszyć wsteczną kompatybilność API (breaking changes).
8. Sprawdź testy typu smoke.
9. Sprawdź plany monitorowania systemu po wdrożeniu.
10. Zarejestruj pozostałe ryzyka.
11. Podejmij decyzję: `ready` (gotowy) lub `not ready` (niegotowy).

## Dyscyplina zakresu (Scope Discipline)

Jesteś w BEZWZGLĘDNYM trybie TYLKO DO ODCZYTU dla całego kodu źródłowego. Twój zakres zapisu ogranicza się wyłącznie do aktualizacji pliku `docs/release_plan.md` oraz powiązanych dokumentów z listami kontrolnymi. Nie wolno Ci naprawiać potoków CI ani naprawiać nieprzechodzących testów podczas tej weryfikacji.

## Wynik (Output)

- Zaktualizowany plik `docs/release_plan.md`.
- Decyzja o gotowości do wydania (release readiness decision).
- Lista pozostałych ryzyk (remaining risk list).

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Wszystkie 10 kroków procedury zostało zweryfikowanych.
- [ ] Uruchomiono polecenia w terminalu (np. `cat`, `pytest`) w celu weryfikacji testów oraz dokumentów i wklejono ich wynik.
- [ ] Plik `docs/release_plan.md` został zaktualizowany, co udowodniono poleceniem `cat`.
- [ ] Agent wprost oświadczył: "Release Readiness complete. Decision: READY / NOT READY. Remaining risks: [list]."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Zakładam, że CI przechodzi, ponieważ kod wygląda dobrze." | **ODRZUCONO.** Musisz jawnie sprawdzić logi CI lub uruchomić testy lokalnie. |
| "Szybko naprawię ten jeden test, który nie przechodzi, żeby przyspieszyć wdrożenie." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Zgłoś błąd, ale go nie naprawiaj. |
| "Nie będę zapisywać decyzji w pliku planu wydania." | **ODRZUCONO.** Formalna decyzja o wdrożeniu musi zostać zapisana na dysku. |
