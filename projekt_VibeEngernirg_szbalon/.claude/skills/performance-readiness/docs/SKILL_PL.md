---
name: performance-readiness
description: >
  Weryfikuje gotowość wydajnościową dla kluczowych ścieżek Pythona/FastAPI: budżet opóźnień
  (latency budget), P95/P99, testy obciążeniowe typu smoke, wąskie gardła bazy danych/cache oraz strategię timeoutów.
  Uruchamia się, gdy użytkownik mówi "check performance", "load test", "benchmark this", "latency requirements".
version: 1.0.0
---

# Performance Readiness (Gotowość Wydajnościowa)

## Cel

Weryfikacja, czy kluczowe przepływy mają jasno określone oczekiwania wydajnościowe oraz potwierdzające je dowody.

## Kiedy używać

- Wymagania wspominają o RPS (żądaniach na sekundę), opóźnieniach (latency), przepustowości lub skali.
- Zmiana wpływa na bazę danych, pamięć podręczną (cache), zewnętrzne API lub krytyczną ścieżkę (hot path).
- Przed wdrożeniem produkcyjnym krytycznego punktu końcowego (endpoint).

## Kiedy NIE używać

- Brak wymagań wydajnościowych, a funkcjonalność nie jest krytyczna dla działania systemu.

## Dane wejściowe

- Plik `docs/requirements.md`.
- Plik `docs/operations.md`.
- Odpowiednie ścieżki w kodzie.
- Istniejące wyniki testów obciążeniowych lub benchmarków.

## Procedura

1. Zidentyfikuj ścieżkę krytyczną.
2. Zidentyfikuj docelowe opóźnienie (latency) / RPS.
3. Sprawdź strategię timeoutów i ponownych prób (retry strategy).
4. Sprawdź wykorzystanie bazy danych / cache.
5. Uruchom lub zdefiniuj wydajnościowy test typu smoke (performance smoke test).
6. Zarejestruj wyniki P95/P99 lub jawne odroczenie pomiarów.
7. Zaktualizuj plik `docs/performance.md`.

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się wyłącznie do analizy w trybie tylko do odczytu oraz testów wydajnościowych. Możesz uruchamiać skrypty benchmarkujące i aktualizować plik `docs/performance.md`. Kategorycznie ZABRANIA się samodzielnego wprowadzania optymalizacji wydajnościowych (takich jak dodawanie cache czy zmiana zapytań SQL) na tym etapie oceny.

## Wynik (Output)

- Plik `docs/performance.md`.
- Zadania w `plan.md`, jeśli wymagane są dalsze prace nad wydajnością.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Metryki wydajnościowe (docelowe opóźnienie, P95/P99) zostały udokumentowane w `docs/performance.md`.
- [ ] Uruchomiono skrypt benchmarkujący lub narzędzie profilujące i wklejono wynik z terminala jako dowód.
- [ ] Wyraźnie wypisano podsumowanie: "Performance Readiness complete. Output generated in docs/performance.md, metrics recorded."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Po prostu dodam pamięć podręczną Redis, żeby było szybciej." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Najpierw zmierz wydajność, zgłoś wyniki, nie optymalizuj w ciemno. |
| "Nie mam zainstalowanego narzędzia do testów obciążeniowych." | **ODRZUCONO.** Napisz prosty skrypt w Pythonie z użyciem `time` oraz `concurrent.futures`, aby zasymulować obciążenie i go uruchom. |
| "Oszacuję opóźnienie na podstawie kodu." | **ODRZUCONO.** Musisz uruchomić test i dostarczyć konkretne liczby z wyniku w terminalu. |
