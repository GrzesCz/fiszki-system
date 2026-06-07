---
name: python-quality-gate
description: >
  Uruchamia rygorystyczne testy jakości kodu w Pythonie przed commitem lub zakończeniem fazy:
  ruff format, ruff check, mypy, pytest, bandit oraz skanowanie anti-slop.
  Uruchamia się, gdy użytkownik mówi "run quality checks", "check before commit", "run linter and tests".
version: 1.0.0
---

# Python Quality Gate (Bramka Jakości Python)

## Cel

Dostarczenie deterministycznych dowodów na to, że kod jest gotowy do przeglądu (review).

## Kiedy używać

- Przed commitem.
- Przed zatwierdzeniem fazy wymagającej akceptacji użytkownika (HITL).
- Przed weryfikacją gotowości do wdrożenia (release readiness).
- Po refaktoryzacji lub wdrożeniu poprawek bezpieczeństwa.

## Kiedy NIE używać

- Narzędzia nie są jeszcze skonfigurowane w projekcie (wtedy najpierw utwórz zadanie konfiguracji środowiska).

## Procedura

Uruchom polecenia w następującej kolejności:

1. `uv run ruff format --check src tests`
2. `uv run ruff check src tests`
3. `uv run ruff check --select C901,PLR0911,PLR0912,PLR0913,PLR0915 src` (kontrola złożoności: złożoność cyklomatyczna, zbyt wiele rozgałęzień/instrukcji return/argumentów/instrukcji w funkcji). Naruszenia muszą zostać zrefaktoryzowane, a nie wyciszane za pomocą `# noqa` (użycie `# noqa` jest dozwolone jako ostateczność z pisemnym uzasadnieniem).
4. `uv run mypy src --strict`
5. `uv run pytest --cov=src --cov-fail-under=80` (testy + próg pokrycia kodu; dostosuj próg do polityki projektu, ale nigdy go nie wyłączaj).
6. `uv run bandit -r src`
7. `uv run pip-audit` (znane podatności CVE w zależnościach — bandit tego NIE pokrywa).
8. Skanowanie "anti-slop": szukaj słów `TODO`, `TBD`, `placeholder`, debug prints (instrukcji print służących do debugowania) oraz emotikon w kodzie produkcyjnym, jak również ceremonialnego nadmiaru (slop) — komentarzy typu "co robi kod" (które jedynie powtarzają to, co widać w kodzie) oraz pustych, wieloakapitowych docstringów dla trywialnych funkcji.

> **Uwaga dotycząca skanowania wzorców:** skanowanie tekstu to jedynie triaż, a nie dowód poprawności. Narzędzia `bandit`, `pip-audit`, `mypy` oraz selektory złożoności ruff dokonują rzeczywistych pomiarów; tekstowe skanowanie w kroku 8 służy wyłącznie do wskazania kandydatów do oceny inżynierskiej.

## Dyscyplina zakresu (Scope Discipline)

Masz prawo do uruchamiania poleceń weryfikacji jakości i naprawiania drobnych problemów przez nie zgłaszanych (np. formatowanie, nieużywane importy, brakujące typy). Kategorycznie ZABRANIA się przepisywania architektury lub rdzennej logiki biznesowej wyłącznie w celu zadowolenia lintera bez zgody użytkownika.

## Wynik (Output)

- Status każdego z testów.
- Dokładne polecenie, które zawiodło, wraz z głównym komunikatem błędu, jeśli którykolwiek test nie przeszedł.
- Komunikat `READY TO COMMIT` tylko wtedy, gdy wszystkie wymagane testy zakończą się sukcesem.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gang:
- [ ] WSZYSTKIE 8 kroków procedury zostało uruchomionych w terminalu.
- [ ] Wynik z terminala dla KAŻDEGO testu został wklejony do Twojej odpowiedzi jako dowód.
- [ ] Wymogi złożoności (krok 3), próg pokrycia testami (krok 5) oraz `pip-audit` (krok 7) zakończą się sukcesem lub każde niepowodzenie zostanie jawnie raportowane.
- [ ] Agent wprost oświadczył: "Python Quality Gate complete. All checks PASS. READY TO COMMIT." lub wskazał, które testy zakończyły się błędem.

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Pominę bandit, bo działa zbyt wolno." | **ODRZUCONO.** Wszystkie kroki w procedurze są obowiązkowe. |
| "Przetestowałem to w głowie, wszystko wygląda dobrze." | **ODRZUCONO.** Musisz uruchomić `uv run pytest` i wkleić wynik. |
| "Wyciszę błędy mypy za pomocą `# type: ignore`, żeby przejść dalej." | **ODRZUCONO.** Musisz poprawić typy lub jawnie poprosić użytkownika o zgodę na zignorowanie błędu. |
| "Kod przechodzi mypy i ruff, więc jest wystarczająco czysty." | **ODRZUCONO.** Kod poprawny pod kątem typów i lintera może być nadal dwa razy dłuższy niż potrzeba. Zwięzłość i zapobieganie nadmiernej inżynierii to osobny etap — uruchom `simplicity-gate`. |
| "Wyciszę ostrzeżenie o złożoności C901 za pomocą `# noqa`." | **ODRZUCONO.** Domyślnym działaniem jest redukcja rozgałęzień i refaktoryzacja. `# noqa` wymaga pisemnego uzasadnienia, a nie wygody. |
