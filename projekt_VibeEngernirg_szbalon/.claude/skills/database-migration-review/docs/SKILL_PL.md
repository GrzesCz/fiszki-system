---
name: database-migration-review
description: >
  Ocenia zmiany w schematach baz danych, migracje, indeksy, klucze i ograniczenia,
  transakcje, strategię wycofywania i naprawiania migracji oraz testy migracji.
  Uruchamia się, gdy użytkownik mówi "review migration", "check database schema", "validate indexes", "review sql".
version: 1.0.0
---

# Database Migration Review (Ocena Migracji Bazy Danych)

## Cel

Zminimalizowanie ryzyka produkcyjnego wynikającego ze zmian w bazie danych.

## Kiedy używać

- Zmiany schematu bazy danych (schema changes).
- Nowe indeksy lub ograniczenia (constraints).
- Migracje danych.
- Zmiany w strukturze źródła prawdy (source-of-truth) lub w zachowaniu transakcji.

## Kiedy NIE używać

- Zmiana dotyczy wyłącznie kodu aplikacji i nie wpływa na strukturę ani trwałość danych.

## Dane wejściowe

- Pliki migracji.
- ADR dotyczący danych/przechowywania.
- `docs/architecture.md`.
- Aktualne zadanie z planu.

## Procedura

1. Zidentyfikuj zmiany w schemacie/danych.
2. Sprawdź ograniczenia (constraints) i indeksy.
3. Sprawdź granice transakcji (transaction boundaries).
4. Sprawdź kompatybilność wsteczną (backward compatibility).
5. Sprawdź plan wycofania migracji (rollback) lub naprawy w przód (forward-fix).
6. Sprawdź testy migracji.
7. Zaktualizuj plik `docs/risk_register.md` o ryzyka związane z migracją.

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się wyłącznie do oceny schematów baz danych i migracji (tryb tylko do odczytu dla plików SQL/Python). Możesz zapisywać wyniki w plikach `docs/review.md` lub `docs/risk_register.md`. Kategorycznie ZABRANIA się samodzielnego uruchamiania migracji na bazie danych lub modyfikowania plików migracji.

## Wynik (Output)

- Notatki z oceny w `docs/review.md` lub dedykowany raport z danej migracji.
- Zaktualizowany rejestr ryzyk (risk register), jeśli jest to wymagane.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Formalny raport z przeglądu został zapisany lub zaktualizowano rejestr ryzyk.
- [ ] Uruchomiono polecenie terminalowe `cat <file>`, aby udowodnić wygenerowanie wyniku.
- [ ] Zweryfikowano, czy plan wycofania (rollback) lub naprawy w przód (forward-fix) został udokumentowany.
- [ ] Wyraźnie wypisano podsumowanie: "Database Migration Review complete. Output in `<file>`. X risks identified."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Samodzielnie dodam brakujący indeks do pliku migracji." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Zgłoś problem w raporcie, ale nie modyfikuj plików migracji. |
| "Uruchomię migrację lokalnie, żeby sprawdzić, czy działa." | **ODRZUCONO.** Jesteś recenzentem, a nie wykonawcą. Nie modyfikuj stanu bazy danych. |
| "Nie będę pisać raportu na dysku, przecież chodzi tylko o jedno brakujące ograniczenie." | **ODRZUCONO.** Wszystkie oceny muszą być formalnie udokumentowane zgodnie z regułami sekcji Output. |
