---
title: '04. Obsługa migracji asynchronicznych (Async SQLAlchemy)'
category: 'Alembic'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 04. Obsługa migracji asynchronicznych (Async SQLAlchemy)

Jeśli Twoja aplikacja FastAPI korzysta z asynchronicznego połączenia z bazą danych (np. Postgres z driverem `asyncpg`), standardowa konfiguracja `env.py` (wygenerowana domyślnie z synchronicznym driverem) wyłoży się na samym starcie. Alembic jest bowiem biblioteką synchroniczną. Zobaczmy jak to pożenić.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Konfiguracja asynchroniczna w alembic/env.py
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine

def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    # Tworzymy asynchroniczny silnik
    connectable = create_async_engine(settings.database_url, poolclass=pool.NullPool)

    # Uruchamiamy migracje w bezpiecznym połączeniu asynchronicznym (run_sync)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    # Koniecznie uruchamiamy przez asyncio.run!
    asyncio.run(run_migrations_online())
```

### 2. METODA FEYNMANA

Wyobraźcie sobie dwie osoby próbujące ze sobą porozmawiać przez telefon.
- **Problem (Alembic vs AsyncPG):** Alembic rozmawia w starym, powolnym dialekcie (synchronicznie). Mówi powoli i chce, żeby druga strona też tak mówiła. Nasza aplikacja FastAPI rozmawia superszybko, wysyłając i odbierając dziesiątki SMSów na sekundę (asynchronicznie). Kiedy Alembic próbuje zadzwonić do super-szybkiej asynchronicznej Bazy Danych, ta rzuca słuchawką, bo nie potrafi nawiązać powolnego, sztywnego połączenia.
- **Rozwiązanie (`run_sync`):** Wstawiamy tłumacza (`run_sync`). Tłumacz stoi przy super-szybkiej bazie danych i mówi do Alembica powoli przez słuchawkę. Alembic myśli, że gada ze starym kumplem, a w rzeczywistości tłumacz bierze te instrukcje i błyskawicznie przesyła je SMSami do bazy. W ten sposób synchroniczny Alembic może zarządzać asynchroniczną architekturą, nie niszcząc Event Loopa.

### 3. MAPA MYŚLI

```markdown
- Migracje Asynchroniczne
  - Konflikt założeń
    - Alembic = logika synchroniczna (kod DDL blokuje wykonanie)
    - Async Driver (np. `asyncpg`) = brak wsparcia dla tradycyjnych metod `.connect()`
  - Rozwiązanie (`run_sync`)
    - Uruchomienie metody `create_async_engine`
    - Stworzenie asynchronicznego połączenia `async with connectable.connect()`
    - Oddelegowanie wywołania `context.run_migrations()` do `connection.run_sync`
  - Główne wywołanie
    - Zamknięcie procesu w pętli `asyncio.run()`
```

### 4. PUŁAPKA

**Zapomnienie o `poolclass=pool.NullPool`**
W kodzie konfiguracyjnym widać bardzo często parametr `poolclass=pool.NullPool`. Dlaczego to takie ważne przy migracjach? Uruchamiając komendę `alembic upgrade head`, wykonujesz krótki, jednorazowy skrypt konsolowy. Jeśli nie wyłączysz puli połączeń (`NullPool`), SQLAlchemy stworzy kolejkę utrzymywania połączeń w tle i aplikacja skryptu "zawiśnie" w terminalu na kilka minut po zakończeniu migracji, ponieważ pula będzie czekać na kolejne komendy! Pamiętaj: dla jednorazowych skryptów migracyjnych wyłączamy pulę (NullPool), natomiast w głównej aplikacji FastAPI włączamy ją dla wydajności HTTP.
