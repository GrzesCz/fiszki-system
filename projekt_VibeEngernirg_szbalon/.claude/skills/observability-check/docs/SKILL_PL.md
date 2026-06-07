---
name: observability-check
description: >
  Sprawdza, czy funkcjonalność produkcyjna posiada logi, metryki, identyfikatory żądań (request IDs),
  testy sprawności (health/readiness checks) oraz wystarczający sygnał diagnostyczny do obsługi operacyjnej.
  Uruchamia się, gdy użytkownik mówi "add logging", "check observability", "monitor this endpoint", "add metrics".
version: 1.0.0
---

# Observability Check (Weryfikacja Obserwowalności)

## Cel

Zapewnienie, że zachowanie systemu na produkcji będzie łatwe do zdiagnozowania przed wdrożeniem.

## Kiedy używać

- Dodawanie publicznego punktu końcowego (endpoint).
- Dodawanie kluczowego przepływu biznesowego.
- Dodawanie zadania w tle (background job), integracji, bazy danych lub zależności od pamięci podręcznej (cache).
- Przygotowywanie wdrożenia produkcyjnego (release readiness).

## Kiedy NIE używać

- Zmiana dotyczy wyłącznie dokumentacji i nie wpływa na zachowanie aplikacji w czasie rzeczywistym.

## Dane wejściowe

- Aktualne zadanie z pliku `plan.md`.
- Plik `docs/operations.md`.
- Plik `docs/runbook.md`.
- Odpowiednie ścieżki w kodzie.

## Procedura

1. Zidentyfikuj kluczowe przepływy użytkownika lub systemu.
2. Sprawdź logi strukturyzowane dla ścieżek sukcesu i błędu.
3. Sprawdź propagację identyfikatorów żądań (request/correlation ID).
4. Sprawdź metryki dotyczące sukcesu, błędów oraz opóźnień (latency).
5. Sprawdź testy sprawności (health/readiness checks), jeśli dodano zależności infrastrukturalne.
6. Sprawdź obsługę błędów i bezpieczeństwo logów (brak wycieku wrażliwych danych).
7. Zaktualizuj plik `docs/operations.md`.
8. Zaktualizuj plik `docs/runbook.md`, jeśli pojawia się nowy tryb awaryjny (failure mode).

## Dyscyplina zakresu (Scope Discipline)

Masz prawo do dodawania logów, metryk i kodu śledzącego (tracing) w wymaganych modułach. Kategorycznie ZABRANIA się zmieniania rdzennej logiki biznesowej lub zachowania aplikacji podczas dodawania obserwowalności.

## Wynik (Output)

- Zaktualizowana dokumentacja operacyjna.
- Lista brakujących elementów obserwowalności, jeśli występują.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Logowanie/metryki zostały wdrożone bez modyfikowania logiki biznesowej.
- [ ] Uruchomiono aplikację lub test i wklejono próbkę logów z terminala, udowadniając, że logi strukturyzowane/metryki generują się poprawnie.
- [ ] Wyraźnie wypisano podsumowanie: "Observability Check complete. Logs/metrics added, tested and proven in terminal."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Framework i tak loguje żądania, nie muszę nic dodawać." | **ODRZUCONO.** Do pełnej obserwowalności wymagane są dedykowane logi i metryki dla przepływów biznesowych. |
| "Nie wiem, jak uruchomić aplikację, aby uzyskać próbkę logów." | **ODRZUCONO.** Napisz krótki skrypt testowy i uruchom go za pomocą `python -c`, aby wygenerować logi w terminalu. |
| "Użyję print() do logowania, tak jest prościej." | **ODRZUCONO.** Musisz użyć biblioteki logowania strukturyzowanego zdefiniowanej w projekcie (np. `logging`, `structlog`). |
