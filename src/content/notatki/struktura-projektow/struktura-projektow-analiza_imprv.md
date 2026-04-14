---
title: "Analiza struktury projektu imprv-masterclass-testing w odniesieniu do Cosmic Python"
category: "Struktura Projektow"
---
# Analiza struktury projektu imprv-masterclass-testing w odniesieniu do Cosmic Python

**Projekt:** `TESTOWANIE - PYTEST/imprv-masterclass-testing`  
**Odniesienie:** Wymagania z [Cosmic Python](https://www.cosmicpython.com/book/preface.html) i notatki `18_struktura_projektow/notatki.md`.

---

## Struktura katalogów imprv

```
imprv-masterclass-testing/
├── masterclass_api/
│   ├── bootstrap.py              # Composition Root (DI)
│   ├── config.py                 # Konfiguracja (pydantic-settings)
│   ├── shared/
│   │   ├── models.py             # BaseModel (Pydantic)
│   │   └── schemas.py            # Wspólne schematy
│   ├── contexts/
│   │   ├── resumes/
│   │   │   ├── models.py         # Resume, ResumeCreatePatch, ResumeUpdatePatch
│   │   │   ├── repository.py     # AbstractResumesRepository, ResumesRepository
│   │   │   ├── service.py        # AbstractResumesService, ResumesService
│   │   │   ├── router.py        # Endpointy FastAPI
│   │   │   ├── schemas.py       # ResumeSchema, ResumeCreatePatchSchema
│   │   │   └── tables.py        # Definicja tabel (pypika)
│   │   ├── users/
│   │   │   ├── models.py
│   │   │   └── tables.py
│   │   └── ml/
│   │       └── service.py       # AbstractMLService, MLService
│   ├── adapters/
│   │   ├── db/
│   │   │   ├── client.py         # DBClient
│   │   │   ├── parameters.py
│   │   │   └── migrations/
│   │   └── clients/
│   │       ├── storage.py        # AbstractStorageClient, DataDOSpaceClient
│   │       └── openai.py         # OpenAIClient
│   └── entrypoints/
│       ├── api.py                # FastAPI app, include_router
│       └── dependencies.py       # get_current_user_id
└── tests/
    ├── __init__.py               # Klasy bazowe
    ├── conftest.py               # Fixtures
    ├── factory.py                # DbFactory
    ├── unit/
    │   └── contexts/resumes/     # test_service__create_resume.py
    ├── integration/
    │   └── contexts/resumes/     # test_resumes_repository__create_resume.py
    ├── e2e/
    │   └── contexts/resumes/     # test_resumes_api__create_resume.py
    └── llm/
        └── contexts/ml/          # test_ml_service__generate_resume_summary.py
```

---

## Porównanie z wymaganiami Cosmic Python

### 1. DIP (Dependency Inversion Principle)

| Wymaganie | imprv | Ocena |
|-----------|-------|-------|
| Logika biznesowa nie zależy od infrastruktury | Serwis zależy od `AbstractResumesRepository`, `AbstractStorageClient`, `AbstractMLService` – nie od konkretnych implementacji | ✅ Zgodne |
| Abstrakcje (ABC) | `AbstractResumesRepository`, `AbstractResumesService`, `AbstractMLService`, `AbstractStorageClient` | ✅ Zgodne |
| Wstrzykiwanie zależności | Bootstrap – composition root. FastAPI `Depends(get_resumes_service)` – serwis z Bootstrapa | ✅ Zgodne |

**Wniosek:** imprv stosuje DIP. Serwis nie zna szczegółów bazy, storage ani OpenAI – tylko abstrakcje. Cosmic Python (rozdział 13) opisuje Dependency Injection i bootstrapping – imprv ma to w `bootstrap.py`.

---

### 2. Domain Model – czystość

| Wymaganie Cosmic Python | imprv | Ocena |
|-------------------------|-------|-------|
| Model domeny bez zewnętrznych zależności | `contexts/resumes/models.py` – `Resume`, `ResumeCreatePatch` dziedziczą z `BaseModel` (Pydantic) | ⚠️ Częściowo |
| Zero ORM, HTTP, bazy w modelu | Brak ORM – modele to Pydantic. Brak importów z SQLAlchemy, FastAPI | ✅ Zgodne |
| Entity, Value Object | `Resume` – encja (id, user_id). `ResumeCreatePatch` – patch do tworzenia | ✅ Zgodne |

**Uwaga:** Cosmic Python używa `@dataclass` i czystego Pythona. imprv używa Pydantic – to lekka zależność (walidacja, serializacja), ale technicznie model nie jest „zero dependencies". W praktyce Pydantic jest akceptowalny – nie wiąże modelu z bazą ani HTTP.

---

### 3. Repository Pattern

| Wymaganie | imprv | Ocena |
|-----------|-------|-------|
| Abstrakcja nad magazynem danych | `AbstractResumesRepository` – interfejs. `ResumesRepository` – implementacja z `DBClient`, pypika | ✅ Zgodne |
| Model nie zna bazy | Repository zwraca `Resume` (model domeny). Model nie importuje nic z `adapters` | ✅ Zgodne |
| Testy jednostkowe – FakeRepository | W testach unit mockuje się `resumes_repository` (mocker) | ✅ Zgodne |

**Różnica:** Cosmic Python używa SQLAlchemy ORM. imprv używa **pypika + psycopg** (raw SQL, bez ORM) – bardziej explicite, mniej „magii". Repository nadal ukrywa szczegóły dostępu do danych.

---

### 4. Service Layer

| Wymaganie | imprv | Ocena |
|-----------|-------|-------|
| Orkiestracja use case'ów | `ResumesService.create_resume()` – repo, storage, ml_service | ✅ Zgodne |
| Cienkie entrypoints | `router.py` – walidacja pliku, wywołanie `resumes_service.create_resume()` | ✅ Zgodne |
| Serwis nie zawiera logiki biznesowej „głębokiej" | Logika: zapisz → upload → wygeneruj podsumowanie → update. Prosta orkiestracja | ✅ Zgodne |

**Przepływ:** `router` → `ResumesService` → `ResumesRepository` + `StorageClient` + `MLService`. Zgodne z Cosmic Python.

---

### 5. Struktura katalogów

| Cosmic Python | imprv | Mapowanie |
|---------------|-------|-----------|
| `src/modul/` | `masterclass_api/` | Brak `src/` – kod w głównym pakiecie |
| `domain/` | `contexts/resumes/models.py` | Brak osobnego `domain/` – modele w kontekstach |
| `adapters/` | `adapters/` (db, clients) | ✅ Odpowiednik |
| `service_layer/` | `contexts/resumes/service.py` | Serwis w kontekście, nie w osobnym `service_layer/` |
| `entrypoints/` | `entrypoints/` (api, dependencies) | ✅ Odpowiednik |
| `config.py` | `config.py` (pydantic-settings) | ✅ Odpowiednik |

**Różnica w organizacji:** Cosmic Python grupuje po warstwie (domain, adapters, service_layer). imprv grupuje po **kontekście domenowym** (resumes, users, ml) – każdy kontekst ma swoje models, repository, service, router. Oba podejścia są poprawne; imprv wybiera **vertical slicing** (feature-based) zamiast **horizontal layering**.

---

### 6. Konfiguracja (12-factor)

| Wymaganie | imprv | Ocena |
|-----------|-------|-------|
| Konfiguracja z env | `config.py` – `pydantic-settings`, `BaseSettings` | ✅ Zgodne |
| Brak hardcoded secrets | Wszystko z `.env` (postgres, openai, storage) | ✅ Zgodne |
| Różne środowiska | Config z domyślnymi wartościami, override przez env | ✅ Zgodne |

---

### 7. Testy

| Cosmic Python | imprv | Ocena |
|---------------|-------|-------|
| `tests/unit` | `tests/unit/` – testy serwisu z mockami | ✅ Zgodne |
| `tests/integration` | `tests/integration/` – testy repo z prawdziwą bazą | ✅ Zgodne |
| `tests/e2e` | `tests/e2e/` – testy API przez HTTP | ✅ Zgodne |
| Dodatkowo | `tests/llm/` – testy z modelem AI (Deepeval) | ✅ Rozszerzenie |

**Struktura testów:** imprv ma `contexts/resumes/` wewnątrz unit/integration/e2e – odzwierciedla moduły aplikacji. Cosmic Python ma płaskie `test_allocate.py`, `test_repository.py`. imprv – bardziej modularne.

---

## Podsumowanie – zgodność z Cosmic Python

| Obszar | Zgodność | Uwagi |
|--------|----------|-------|
| DIP | ✅ Pełna | Abstrakcje, Bootstrap, Depends |
| Repository | ✅ Pełna | AbstractRepository, implementacja z pypika |
| Service Layer | ✅ Pełna | Orkiestracja w serwisie, cienkie routery |
| Domain Model | ⚠️ Częściowa | Pydantic zamiast czystego dataclass – akceptowalne |
| Struktura katalogów | ⚠️ Inna organizacja | Konteksty (vertical) vs warstwy (horizontal) |
| Konfiguracja | ✅ Pełna | 12-factor, pydantic-settings |
| Testy | ✅ Pełna + rozszerzenie | unit/integration/e2e + llm |

**Wniosek:** imprv-masterclass-testing jest **zgodny z duchem Cosmic Python** – DIP, Repository, Service Layer, czyste rozdzielenie warstw. Różnice to głównie:
1. **Organizacja po kontekstach** (resumes, users, ml) zamiast po warstwach (domain, adapters, service_layer) – oba podejścia są stosowane w praktyce.
2. **Pydantic w modelach** – lekka zależność, często wybierana w projektach FastAPI.
3. **Bootstrap** – odpowiednik Dependency Injection z rozdziału 13 Cosmic Python.
4. **Brak `src/`** – `masterclass_api/` jako główny pakiet; pyproject.toml/poetry definiuje instalację.

Projekt imprv można traktować jako **praktyczną implementację** wzorców Cosmic Python w stacku FastAPI + pypika + OpenAI.
