---
title: "Notatki: Struktura projektów – architektura wspierająca model domeny"
category: "Struktura Projektow"
---
# Notatki: Struktura projektów – architektura wspierająca model domeny

**Źródło:** Książka *Architecture Patterns with Python* (Harry Percival, Bob Gregory), wyd. O'Reilly. Wersja online: [Cosmic Python](https://www.cosmicpython.com/book/preface.html) – całość dostępna na cosmicpython.com.

**Temat:** Jak strukturyzować aplikacje Pythona, żeby uniknąć „Big Ball of Mud", wspierać TDD i DDD, oraz budować architekturę, w której logika biznesowa nie zależy od infrastruktury (baza, HTTP, framework).

---

## Lekcja 1: Dlaczego projekty się rozjeżdżają? Big Ball of Mud

### Zagadnienie

Na początku mamy grand ideas – kod będzie czysty i uporządkowany. Z czasem zbiera się cruft, edge case'y, a sensowna architektura zapada się jak przesiąknięty trifle. Dlaczego?

---

### Opis

#### Chaos vs porządek (perspektywa naukowa)

Dla naukowców **chaos** charakteryzuje się **jednorodnością** (wszystko wygląda tak samo), a **porządek** – **złożonością** (różnice, granice, struktura).

**Analogia ogrodu:** Dobrze utrzymany ogród to system uporządkowany – ścieżki, płotki, grządki. Bez wysiłku ogród zdziczeje: chwasty zagłuszą rośliny, ścieżki znikną, wszystko stanie się jednolite – dzikie i niekontrolowane.

**Software:** Systemy programistyczne też dążą do chaosu. API handlery, które mają wiedzę domenową, wysyłają maile i logują. Klasy „logiki biznesowej", które nie wykonują obliczeń, ale robią I/O. Wszystko zależy od wszystkiego – zmiana jednej części staje się ryzykowna. To ma swoją nazwę: **Big Ball of Mud** (antypattern).

**Wniosek:** Big ball of mud to naturalny stan oprogramowania, tak jak dzicz to naturalny stan ogrodu. Potrzebna jest energia i kierunek, żeby zapobiec zapadnięciu.

---

## Lekcja 2: Enkapsulacja i abstrakcje

### Zagadnienie

Enkapsulacja i abstrakcja to narzędzia, po które instynktownie sięgamy. Co oznaczają w kontekście architektury?

---

### Opis

**Enkapsulacja** – upraszczanie zachowania i ukrywanie danych. **Abstrakcja** – obiekt lub funkcja, która realizuje dobrze zdefiniowane zadanie.

**Przykład (z książki):** Trzy sposoby wyszukania w API DuckDuckGo:
1. `urllib` – dużo kodu, niski poziom
2. `requests` – mniej kodu, wyższy poziom
3. `duckduckpy` – `duckduckpy.query('Sausages').related_topics` – najwyższy poziom, zadanie ma nazwę

Im wyższa abstrakcja, tym kod jest bardziej ekspresywny, łatwiejszy do testowania i utrzymania.

**W Pythonie:** Można używać ABC (Abstract Base Classes), ale duck typing też wystarczy. Abstrakcja może oznaczać po prostu „publiczne API rzeczy, której używasz" – nazwa funkcji plus argumenty.

---

## Lekcja 3: Architektura warstwowa i Dependency Inversion

### Zagadnienie

Jedna z najczęstszych architektur to trzy warstwy: Presentation → Business Logic → Database. Cosmic Python proponuje **odwrócenie** tej struktury – zasada DIP.

---

### Opis

#### Klasyczna architektura warstwowa

```
+----------------------------------------------------+
|                Presentation Layer                  |  (API, CLI, web)
+----------------------------------------------------+
                          |
                          V
+----------------------------------------------------+
|                 Business Logic                     |
+----------------------------------------------------+
                          |
                          V
+----------------------------------------------------+
|                  Database Layer                    |
+----------------------------------------------------+
```

Warstwy wyższe zależą od niższych. Problem: logika biznesowa zaczyna zależeć od szczegółów infrastruktury (ORM, framework, baza).

#### Dependency Inversion Principle (DIP)

> Moduły wysokiego poziomu nie powinny zależeć od modułów niskiego poziomu. Oba powinny zależeć od abstrakcji.  
> Abstrakcje nie powinny zależeć od szczegółów. Szczegóły powinny zależeć od abstrakcji.

**Moduły wysokiego poziomu** – to, na czym organizacji naprawdę zależy (pacjenci, próby kliniczne, transakcje, zamówienia).  
**Moduły niskiego poziomu** – to, na czym organizacji nie zależy (system plików, sockety, SMTP, HTTP, baza danych).

**Cel:** Logika biznesowa nie powinna zależeć od technicznych szczegółów. Oba poziomy używają abstrakcji. Dzięki temu można zmieniać je niezależnie – zmiana reguły biznesowej nie wymaga migracji bazy, a zmiana bazy nie wymaga zmian w logice.

**Onion architecture / Ports and Adapters / Hexagonal:** Wszystkie te nazwy sprowadzają się do DIP – domena w środku, zależności płyną do środka.

---

## Lekcja 4: Domain Model – model domeny

### Zagadnienie

Zamiast „warstwa logiki biznesowej" książka używa terminu **domain model**. Co to jest i po co?

---

### Opis

**Domena** – problem, który próbujesz rozwiązać (np. alokacja zapasów, logistyka, płatności).  
**Model** – mapa procesu lub zjawiska, która uchwyca użyteczną właściwość.

**Domain model** – mapa mentalna, którą mają właściciele biznesu. Język biznesowy (jargon) to skondensowane zrozumienie tej mapy. Gdy słyszymy nieznane słowa lub specyficzne użycie terminów – powinniśmy słuchać i kodować to doświadczenie w oprogramowaniu.

**Wzorce z DDD (Domain-Driven Design):**
- **Entity** – obiekt z tożsamością (np. `Batch` z referencją)
- **Value Object** – obiekt bez tożsamości, niezmienny (np. `OrderLine` jako `@dataclass(frozen=True)`)
- **Domain Service** – operacje, które nie należą do jednej encji

**Przykład z książki:** System alokacji zapasów. `Batch` (partia towaru), `OrderLine` (linia zamówienia). Reguły: alokujemy do batchy, zmniejszamy dostępną ilość, nie alokujemy dwa razy tej samej linii, preferujemy warehouse przed shipment, batchy sortujemy po ETA.

**Klucz:** Model domeny **nie ma zewnętrznych zależności**. Żadnego ORM, HTTP, bazy. Tylko czysty Python. Dzięki temu testy jednostkowe są szybkie i proste.

---

## Lekcja 5: Repository Pattern – abstrakcja nad magazynem danych

### Zagadnienie

Jak połączyć czysty model domeny z bazą danych, nie wplatając SQL/ORM do modelu?

---

### Opis

**Repository** – upraszczająca abstrakcja nad magazynem danych. Siedzi między modelem domeny a bazą. Ukrywa złożoność bazy – model nie wie, czy dane są w PostgreSQL, SQLite czy CSV.

**Przed:** Endpoint ładuje batchy z bazy, wywołuje logikę, zapisuje. Wszystko pomieszane.  
**Po:** Endpoint wywołuje `repository.get()`, dostaje obiekty domenowe, wywołuje logikę, `repository.add()` – zapis. Model nie zna bazy.

**DIP w praktyce:** Model domeny definiuje abstrakcję (np. `AbstractRepository`). Konkretna implementacja (`SqlAlchemyRepository`) zależy od tej abstrakcji. Warstwa wyższa (service) zależy od abstrakcji, nie od implementacji.

**Korzyść:** Testy jednostkowe używają `FakeRepository` (lista w pamięci) – zero bazy, zero I/O, milisekundy.

---

## Lekcja 6: Service Layer – cienkie punkty wejścia

### Zagadnienie

Gdzie umieścić orkiestrację – wywołanie repozytorium, wywołanie modelu, transakcje?

---

### Opis

**Service Layer** – warstwa definiująca punkty wejścia do systemu i przechwytująca główne use case'y. Cienkie endpointy (Flask, FastAPI) – przyjmują request, wywołują serwis, zwracają response. Cała logika w serwisie.

**Przepływ:** API/CLI → Service Layer → Repository + Domain Model.

Serwis koordynuje: ładuje dane przez repo, wywołuje metody modelu, zapisuje przez repo. Nie zawiera logiki biznesowej – ta jest w modelu. Serwis to „klej".

---

## Lekcja 7: Szablon struktury projektu (Appendix B)

### Zagadnienie

Jak wygląda konkretna struktura katalogów w projekcie opartym o Cosmic Python?

---

### Opis

**Źródło:** [Appendix B: A Template Project Structure](https://www.cosmicpython.com/book/appendix_project_structure.html)

#### Drzewo projektu

```
.
├── Dockerfile
├── Makefile
├── README.md
├── docker-compose.yml
├── requirements.txt
├── src
│   ├── allocation                    # moduł aplikacji
│   │   ├── __init__.py
│   │   ├── adapters                  # infrastruktura (ORM, repo)
│   │   │   ├── orm.py
│   │   │   └── repository.py
│   │   ├── config.py                 # konfiguracja z env
│   │   ├── domain                    # model domeny
│   │   │   └── model.py
│   │   ├── entrypoints               # punkty wejścia (API, CLI)
│   │   │   └── flask_app.py
│   │   └── service_layer             # serwisy, use case'y
│   │       └── services.py
│   └── setup.py                      # pip install -e
└── tests
    ├── conftest.py
    ├── pytest.ini
    ├── unit                          # testy jednostkowe (model, serwis)
    ├── integration                   # testy z bazą (repo, ORM)
    └── e2e                           # testy API end-to-end
```

#### Kluczowe elementy

| Element | Rola |
|---------|------|
| **src/** | Cały kod aplikacji w pakiecie Pythona. `pip install -e .` – importy działają. |
| **domain/** | Model domeny – encje, value objects. Zero zależności od frameworka/bazy. |
| **adapters/** | Implementacje infrastruktury – ORM, Repository (SQLAlchemy, CSV itd.). |
| **service_layer/** | Use case'y – orkiestracja repo + model. |
| **entrypoints/** | API (Flask/FastAPI), CLI – cienkie, tylko wywołują serwis. |
| **config.py** | Konfiguracja z zmiennych środowiskowych (12-factor). Funkcje zamiast stałych – pozwala na override w testach. |
| **tests/unit** | Testy modelu i serwisów – mocki/fake repo, szybkie. |
| **tests/integration** | Testy repo, ORM – prawdziwa baza. |
| **tests/e2e** | Testy API – pełna ścieżka HTTP. |

#### Konfiguracja (12-factor)

Konfiguracja przez zmienne środowiskowe. `config.py` – funkcje `get_postgres_uri()`, `get_api_url()` z `os.environ.get()`, z domyślnymi wartościami dla lokalnego dev. W Docker – `environment` w docker-compose.

#### Docker

- `docker-compose.yml` – serwisy (app, postgres), zmienne env, porty, volumes.
- `Dockerfile` – Python, requirements, `pip install -e` dla src, CMD do uruchomienia.
- Makefile – `make build`, `make test` – wygodne komendy dla dev i CI.

---

## Lekcja 8: TDD, DDD i architektura event-driven

### Zagadnienie

Książka łączy trzy narzędzia do zarządzania złożonością. Co robi każde?

---

### Opis

**1. TDD (Test-Driven Development)** – buduje poprawny kod, umożliwia refaktoryzację bez strachu przed regresją. Pytanie: jak maksymalnie wykorzystać testy? Dużo szybkich testów jednostkowych, minimum wolnych testów E2E.

**2. DDD (Domain-Driven Design)** – skupienie na modelu domeny biznesowej. Pytanie: jak upewnić się, że model nie jest obciążony infrastrukturą i pozostaje łatwy do zmiany?

**3. Event-driven / reactive microservices** – luźno powiązane serwisy integrowane przez wiadomości. Pytanie: jak połączyć to z Flask, Django, Celery?

**Uwaga z książki:** Większość wzorców (w tym event-driven) ma zastosowanie także w monolicie – nie tylko w mikroserwisach.

---

## Lekcja 9: Jak użyć Cursora do wygenerowania optymalnej struktury projektu

### Zagadnienie

Masz opis projektu i wiedzę z Cosmic Python. Jak krok po kroku użyć Cursora (AI), żeby stworzyć optymalną strukturę katalogów i plików?

---

### Opis

#### 1. Przygotuj opis projektu

**Co zawrzeć w opisie:**
- **Domena** – co system robi (np. „system zarządzania CV i generowania podsumowań przez AI")
- **Stack** – FastAPI, PostgreSQL, Pydantic, pytest, itd.
- **Główne use case'y** – np. „użytkownik tworzy CV, system zapisuje do bazy, generuje podsumowanie przez OpenAI, uploaduje plik do storage"
- **Zasoby zewnętrzne** – baza, storage (S3/DO Spaces), API OpenAI
- **Ograniczenia** – np. „bez ORM – używamy pypika / raw SQL" – jeśli są

**Przykład:** „API do zarządzania CV. Użytkownik tworzy resume, zapisujemy do PostgreSQL, generujemy podsumowanie przez OpenAI, uploadujemy plik do storage. FastAPI, Pydantic, pytest. Chcę strukturę zgodną z Cosmic Python – domain, adapters, service layer, entrypoints."

#### 2. Zbierz kontekst do promptu

**Pliki do @mention w Cursorze:**
- `@Edukacja/18_struktura_projektow/notatki.md` – wymagania Cosmic Python, szablon struktury
- `@Cursor/Przewodnik_Nowy_Projekt.md` – AGENTS.md, rules, skills (jeśli chcesz spójność z przewodnikiem)
- `@Edukacja/AGENTS.md` – konwencje projektu (jeśli już istnieją)

#### 3. Prompt do Cursora

**Przykładowy prompt:**

```
Na podstawie opisu projektu:

[Wklej tutaj opis – domena, stack, use case'y]

oraz wymagań z @Edukacja/18_struktura_projektow/notatki.md (Cosmic Python – DIP, Domain Model, Repository, Service Layer, struktura z Appendix B) zaproponuj strukturę katalogów i plików dla tego projektu.

Uwzględnij:
- domain/ – model domeny bez zależności od frameworka/bazy
- adapters/ – repository, klienci zewnętrzni (storage, OpenAI)
- service_layer/ – serwisy, use case'y
- entrypoints/ – cienkie API (FastAPI)
- config.py – konfiguracja z env (12-factor)
- tests/ – unit, integration, e2e

Dla każdego katalogu/pliku podaj krótkie uzasadnienie. Jeśli mój opis jest niekompletny – zapytaj o brakujące elementy.
```

#### 4. Weryfikacja po wygenerowaniu

**Checklist:**

| Punkt | Sprawdzenie |
|-------|-------------|
| [ ] **domain/** | Model domeny – encje, value objects. Zero importów z FastAPI, SQLAlchemy, bazy. |
| [ ] **adapters/** | Repository (abstrakcja + implementacja), klienci (storage, OpenAI). |
| [ ] **service_layer/** | Serwisy zależne od abstrakcji (AbstractRepository), nie od konkretnych implementacji. |
| [ ] **entrypoints/** | Routery/API – tylko przyjmują request, wywołują serwis, zwracają response. |
| [ ] **config** | Konfiguracja z env (pydantic-settings lub funkcje). Brak hardcoded secrets. |
| [ ] **tests/unit** | Testy modelu i serwisów – mocki/fake repo, bez bazy. |
| [ ] **tests/integration** | Testy repo – prawdziwa baza. |
| [ ] **tests/e2e** | Testy API – pełna ścieżka HTTP. |

#### 5. Iteracja

Jeśli AI nie uwzględniło któregoś elementu – doprecyzuj: „Dodaj brakujący katalog X" lub „W modelu domeny nie powinno być importu z Y – przenieś to do adapters."

#### 6. Połączenie z Przewodnikiem Nowy Projekt

Po wygenerowaniu struktury możesz dodać (z `@Cursor/Przewodnik_Nowy_Projekt.md`):
- `.cursor/rules/` – security, no-regression, architecture
- `AGENTS.md` – slim roadmapa
- `docs/skills/` – new-feature, db-migration (jeśli używasz)

---

## Podsumowanie – co zapamiętać

1. **Big Ball of Mud** – naturalny stan chaosu. Potrzebna energia i kierunek (architektura, wzorce).
2. **Enkapsulacja i abstrakcja** – zadania w dobrze zdefiniowanych obiektach/funkcjach. Wyższy poziom = mniej szczegółów, łatwiej testować.
3. **DIP** – logika biznesowa nie zależy od infrastruktury. Oba poziomy zależą od abstrakcji.
4. **Domain Model** – czysty Python, zero ORM/HTTP. Entity, Value Object, Domain Service.
5. **Repository** – abstrakcja nad magazynem. Model nie zna bazy. Testy używają FakeRepository.
6. **Service Layer** – orkiestracja use case'ów. Cienkie entrypoints (API, CLI) wywołują serwis.
7. **Struktura:** `src/modul/` z `domain/`, `adapters/`, `service_layer/`, `entrypoints/`. `tests/` z `unit/`, `integration/`, `e2e/`.
8. **Konfiguracja** – 12-factor, env vars, `config.py` z funkcjami.
9. **Cursor:** Opis projektu + @notatki + prompt → struktura. Checklist po wygenerowaniu.

---

## Odniesienia

- **Analiza projektu imprv:** `18_struktura_projektow/analiza_imprv.md` – porównanie struktury `imprv-masterclass-testing` z wymaganiami Cosmic Python.
- [Cosmic Python – Preface](https://www.cosmicpython.com/book/preface.html)
- [Cosmic Python – Introduction](https://www.cosmicpython.com/book/introduction.html)
- [Cosmic Python – Chapter 1: Domain Modeling](https://www.cosmicpython.com/book/chapter_01_domain_model.html)
- [Cosmic Python – Chapter 2: Repository Pattern](https://www.cosmicpython.com/book/chapter_02_repository.html)
- [Cosmic Python – Appendix B: A Template Project Structure](https://www.cosmicpython.com/book/appendix_project_structure.html)
- [Kod przykładowy na GitHub](https://github.com/cosmicpython/code) – każdy rozdział ma własny branch
