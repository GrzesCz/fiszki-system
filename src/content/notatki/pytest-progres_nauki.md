---
title: "Progres Nauki"
category: "Pytest"
---
 # Mój plan nauki: Pytest & Testowanie

Ten plik służy do śledzenia postępów w nauce testowania przy pomocy map myśli i metody Feynmana. 

## Zrealizowane (Metoda Feynmana + Mapy Myśli)

- [x] **Mapa 1: Pytest – pierwsze kroki (Fundamenty)**
  - Zrozumiałem, co to jest Pytest (narzędzie do testów, alternatywa dla wbudowanego `unittest`).
  - Wiem jak go instalować (`pip install pytest`) i uruchamiać (z konsoli: `pytest`, `pytest -v`, lub z IDE).
  - Wiem, czym jest asercja (`assert`) i że działa jak test warunkowy ("sprawdzenie czy to prawda").
  - Znam konwencje nazewnictwa, których wymaga Pytest (pliki `test_*.py`, katalog `tests/`, funkcje `test_*`).
  - Rozumiem różnicę między stanem PASSED (zielony) a FAILED (czerwony).

- [x] **Mapa 2: Rodzaje testów (Automatycznych)**
  - Rozróżniam **Jednostkowe (Unit)**: ekstremalnie szybkie, izolowane (jeden komponent), korzystające z atrap (mocków).
  - Rozróżniam **Integracyjne**: wolniejsze, sprawdzające współpracę modułów, używające prawdziwej bazy danych (np. TestClient w FastAPI).
  - Rozróżniam **E2E (End-to-End)**: najwolniejsze, symulujące prawdziwego użytkownika, z żywym serwerem HTTP.
  - Znam **Piramidę Testów** (najwięcej testów Unit na dole, najmniej E2E na górze).
  - Wiem, żeby testować logikę biznesową i przypadki brzegowe (edge cases, błędy), a nie prosty kod frameworków (gettery/settery).

- [x] **Mapa 3: ABC – Klasa Abstrakcyjna**
  - Zrozumiałem, że to wbudowany mechanizm Pythona (moduł `abc`), służący do tworzenia **kontraktów** w kodzie aplikacji.
  - Wiem, że nie da się z niej zbudować obiektu (instancji).
  - Zrozumiałem korzyść (przykład z Email/SMS): pozwala to na wymianę podzespołów aplikacji (klocki LEGO) bez konieczności przepisywania reszty systemu (luźne powiązania/architektura).
  - Znam składnię (`from abc import ABC, abstractmethod` i użycie dekoratora, który wymusza na klasach dziedziczących stworzenie danej metody).

- [x] **Mapa 4: Mockowanie**
  - Wiem, że Mock to **atrapa**, udająca prawdziwy system (np. bazę danych), żeby testy były szybkie i niezależne od awarii sieci (działają offline).
  - Znam pochodzenie: wbudowany `unittest.mock` vs ułatwiający pracę plugin `pytest-mock` (który daje fixture `mocker` i sam po sobie sprząta).
  - Zrozumiałem 4 kluczowe metody na "chłopski rozum":
    - `.return_value` (zwróć udawaną odpowiedź zamiast wywoływać prawdziwy kod),
    - `.side_effect` (symuluj wybuch błędu),
    - `.assert_called_once()` (czy cię w ogóle użyto?),
    - `.assert_called_with()` (czy użyto cię z właściwymi danymi?).
  - Zrozumiałem kluczową korelację z Klasą Abstrakcyjną (ABC): atrybut **`spec=ABC`**, który jest strażnikiem bezpieczeństwa, chroniącym przed literówkami i fałszywym przechodzeniem testów (bo ogranicza atrapę tylko do metod przewidzianych w kontrakcie).

- [x] **Mapa 5: Fixtures**
  - Znam dekorator `@pytest.fixture` i wiem, że fixture to "pomocnik testu".
  - Rozumiem różnicę `return` vs `yield` (analogia: wypożyczalnia aut – kluczyki vs kluczyki + sprzątanie po zwrocie).
  - Wiem, jak fixture jest "wstrzykiwany" do testu przez nazwę argumentu (Dependency Injection).
  - Znam 4 scope'y: `function` (domyślny, mocki), `class`, `module`, `session` (drogie operacje – baza, serwer).
  - Wiem, co to `autouse=True` (automat – bez podawania nazwy).

- [x] **Mapa 6A: Struktura testów w projekcie**
  - Znam strukturę katalogów `unit/`, `integration/`, `e2e/`, `llm/` i wiem, po co je rozdzielać (selektywne uruchamianie, czas wykonania).
  - Rozumiem rolę `conftest.py` – "hurtownia globalnych fixtures", bez importowania.
  - Wiem, czym są klasy bazowe (`BaseUnitTestCase`, `BaseIntegrationTestCase`, itd.) i po co je tworzymy (gotowe stanowisko pracy, DRY).
  - Znam rolę `Bootstrap` (Composition Root, "Główny Kierownik Budowy").
  - Znam plik `factory.py` / `DbFactory` – tworzenie i sprzątanie danych testowych, Faker dla unikalności.
  - Rozumiem, czym wyróżniają się testy `llm/` (koszt, czas, niedeterminizm).

- [x] **Mapa 6B: Techniki pytest**
  - Znam `@pytest.mark.parametrize` – jeden test, wiele zestawów danych (zasada DRY, edge cases).
  - Znam `pytest.raises` – sprawdzam, że MÓJ KOD rzuca właściwy wyjątek.
  - Wiem kiedy `pytest.raises`, a kiedy `side_effect=Exception` na mocku (mój kod vs awaria zewnętrzna).
  - Znam i stosuję wzorzec **GIVEN / WHEN / THEN** (= AAA: Arrange-Act-Assert) – czytelność, dokumentacja, łatwe debugowanie.
  - Znam `@pytest.mark.xfail` – zaznaczam testy ze znanych bugów / WIP, żeby CI nie padło przez błąd, który celowo zostawiamy.

---

## Do zrobienia

- [ ] **Mapa 7: Testowanie FastAPI** (TestClient, `dependency_overrides`, testowa baza, TestClient vs żywy serwer E2E)

---

## Moje mapy (Galeria)

> **Jak dodać zdjęcie mapy?** 
> Zrób zdjęcie swojej ręcznie narysowanej mapy, skopiuj je i po prostu wciśnij `Ctrl+V` (wklej) poniżej. Cursor automatycznie zapisze plik obrazu w Twoim workspace i doda do niego kod Markdown!

### Mapa 1 i 2 (Pytest Fundamenty i Rodzaje)
*(Wklej tutaj zdjęcia)*

### Mapa 3 (ABC)
*(Wklej tutaj zdjęcie)*

### Mapa 4 (Mockowanie)
*(Wklej tutaj zdjęcie)*

### Mapa 5 (Fixtures)
*(Wklej tutaj zdjęcie)*

### Mapa 6A (Struktura testów w projekcie)
*(Wklej tutaj zdjęcie)*

### Mapa 6B (Techniki pytest)
*(Wklej tutaj zdjęcie)*
