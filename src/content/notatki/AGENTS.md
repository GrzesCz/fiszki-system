---
title: "AGENTS.md - Plan Nauki: Modern Python Backend"
category: "Ogólne"
---
# AGENTS.md - Plan Nauki: Modern Python Backend

## Cel
Nauka nowoczesnego backendu Python od podstaw do poziomu Junior/Mid.
Technologie: pathlib, typing, dotenv, uuid, logging, Pydantic, SQLAlchemy, Alembic, FastAPI, uvicorn, Pytest, FastMCP, LangChain.

## Zasady nauki
- Lekcje prowadzone **po kolei** – od wybranej przez ucznia.
- **Nie przechodzimy dalej** dopóki uczeń nie potwierdzi 100% zrozumienia.
- Po każdej lekcji **uzupełniamy notatki** w odpowiednim pliku MD.
- Po każdej lekcji **zadanie praktyczne** do samodzielnego wykonania.
- Notatki w **stylu wykładowym** (konwersacyjny ton, analogie, krok po kroku).

---

## Moduł 1: Fundamenty (Biblioteki)
- [ ] **01 – pathlib** – operacje na ścieżkach (zamiast os.path) → `01_pathlib.md`
- [ ] **02 – typing** – type hints (str | None, list[int]) → `02_typing.md`
- [ ] **03 – dotenv** – ładowanie zmiennych z pliku .env → `03_dotenv.md`
- [ ] **04 – uuid** – generowanie unikalnych identyfikatorów → `04_uuid.md`
- [ ] **05 – pydantic-settings** – konfiguracja z .env (zamiast os.getenv) → `05_pydantic_settings.md`
- [ ] **06 – logging** – biblioteka standardowa do logowania → `06_logging.md`
- [ ] **07 – structlog** – logowanie strukturalne (zamiast print) → `07_structlog.md`

## Moduł 2: Walidacja i Dane
- [ ] **08 – Pydantic V2** – modele, Field, walidatory → `08_pydantic_v2.md`
- [ ] **09 – SQLAlchemy 2.0** – ORM, Core, sesje (async) → `09_sqlalchemy_2.md`
- [ ] **10 – Alembic** – migracje bazy danych → `10_alembic.md`

## Moduł 3: Web Framework
- [ ] **11 – async/await** – asynchroniczność, event loop → `11_async_await.md`
- [ ] **12 – FastAPI** – routing, request body, Depends → `12_fastapi.md`
- [ ] **13 – uvicorn** – serwer ASGI, uruchamianie FastAPI → `13_uvicorn.md`
- [ ] **14 – Pytest** – testy, fixtures, mocking → `14_pytest/notatki.md`

## Moduł 4: AI & Narzędzia
- [ ] **15 – FastMCP** – łączenie LLM z narzędziami → `15_fastmcp.md`
- [ ] **16 – Pypika** – budowanie zapytań SQL → `16_pypika.md`
- [ ] **17 – LangChain** – łańcuchy wywołań AI → `17_langchain.md`

## Moduł 5: Architektura
- [ ] **18 – Struktura projektów** – Cosmic Python, DIP, Domain Model, Repository, Service Layer → `18_struktura_projektow/notatki.md`

---

## Jak korzystać

**Lekcja:**
> Wpisz np.: `Zacznijmy lekcję 01 – pathlib`

**Sprawdzenie wiedzy:**
> Wpisz np.: `@quiz-me Sprawdź moją wiedzę z pathlib`

**Wyjaśnienie konceptu:**
> Wpisz np.: `@explain-concept Wytłumacz mi Dependency Injection w FastAPI`

**Zwykłe pytanie:**
> Wpisz np.: `Co to jest event loop w asyncio? Wytłumacz mi to prostym językiem.`

Po opanowaniu tematu zaznacz `[x]` przy odpowiednim punkcie.
