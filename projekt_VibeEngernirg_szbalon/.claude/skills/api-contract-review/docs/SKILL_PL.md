---
name: api-contract-review
description: >
  Projektuje lub ocenia kontrakty API: wersjonowanie, schematy żądań/odpowiedzi,
  kody statusu, format błędów, idempotencyjność oraz testy kontraktowe.
  Uruchamia się, gdy użytkownik mówi "zaprojektuj API", "oceń kontrakt API", "sprawdź specyfikację OpenAPI".
version: 1.0.0
---

# API Contract Review (Ocena Kontraktu API)

## Cel

Uczynienie zachowania API jednoznacznym i testowalnym przed rozpoczęciem implementacji lub wdrożeniem wersji produkcyjnej.

## Kiedy używać

- Dodawanie lub modyfikowanie publicznego API.
- Przygotowywanie weryfikacji specyfikacji OpenAPI.
- Dodawanie testów kontraktowych.

## Kiedy NIE używać

- Zmiana ma charakter wyłącznie wewnętrzny i nie wpływa na interfejs API (brak modyfikacji warstwy publicznej).

## Dane wejściowe

- `docs/api_contract.md`
- `docs/requirements.md`
- Aktualny kod API (jeśli istnieje)

## Procedura

1. Sprawdź wersjonowanie API.
2. Sprawdź schematy żądań (request schemas).
3. Sprawdź schematy odpowiedzi (response schemas).
4. Sprawdź kody statusu HTTP.
5. Sprawdź format zwracanych błędów.
6. Sprawdź idempotencyjność dla operacji zapisu.
7. Sprawdź stronicowanie (pagination), filtrowanie i sortowanie dla kolekcji danych.
8. Dodaj wymagane testy kontraktowe do pliku `plan.md`.
9. Zaktualizuj plik `docs/api_contract.md`.

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się do analizy kodu API oraz aktualizacji dokumentacji w `docs/api_contract.md` i `plan.md`. Kategorycznie ZABRANIA się implementowania lub modyfikowania rzeczywistych punktów końcowych (endpoints) w kodzie Pythona podczas wykonywania tego zadania.

## Wynik (Output)

- Zaktualizowany plik `docs/api_contract.md`.
- Zadania dotyczące testów kontraktowych dodane do `plan.md`.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Formalna ocena kontraktu została zapisana w pliku `docs/api_contract.md`.
- [ ] Uruchomiono polecenie `cat docs/api_contract.md` lub podobne, aby udowodnić aktualizację pliku.
- [ ] Zadania dotyczące testów kontraktowych zostały jawnie dodane do `plan.md`.
- [ ] Wyraźnie wypisano podsumowanie: "API Contract Review complete. Output generated in docs/api_contract.md and plan.md updated."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Kod używa FastAPI, które samo generuje dokumentację, więc nie potrzebuję kontraktu w markdownie." | **ODRZUCONO.** Jawne kontrakty w dokumentacji są wymagane przed rozpoczęciem pisania kodu. |
| "Od razu naprawię ten endpoint, bo zauważyłem brak obsługi błędu 404." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Oceniasz i projektujesz, ale nie wdrażasz zmian w kodzie produkcyjnym. |
| "Nie będę uruchamiać polecenia w terminalu na dowód, przecież użytkownik widzi moją odpowiedź." | **ODRZUCONO.** Dowód z terminala jest bezdyskusyjny. |
