---
title: '03. Wykrywanie zmian w typach kolumn'
category: 'Alembic'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 03. Wykrywanie zmian w typach kolumn

Standardowo wygenerowany plik `env.py` nie wykrywa zmian wewnątrz już istniejących kolumn. Zobaczmy jak włączyć zaawansowane parametry porównawcze, aby Alembic zauważał różnice w typach.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Włączenie zaawansowanego skanowania typów w env.py
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            # Włączamy zaawansowane porównywanie struktur:
            compare_type=True,
            compare_server_default=True
        )

        with context.begin_transaction():
            context.run_migrations()
```

### 2. METODA FEYNMANA

Wyobraźcie sobie policjanta na lotnisku, który sprawdza paszporty na bramce.
- **Domyślny Alembic (Bez sprawdzania typów):** Policjant sprawdza tylko imię i nazwisko (Nazwa kolumny). Mówi: "Nazywa się pan Kolumna Opis? Zgadza się. Proszę wejść!". Nawet nie patrzy, czy w paszporcie widnieje wiek "10 lat" czy "50 lat" (Typ kolumny). Jeśli w kodzie zmienisz długość opisu ze `String(50)` na `String(500)`, domyślny Alembic tego po prostu nie zauważy. Odpali komendę i powie, że nie ma żadnych zmian w bazie.
- **Alembic z `compare_type=True`:** Policjant staje się niezwykle skrupulatny. Nie tylko sprawdza imię, ale i to, czy od ostatniej kontroli nie urosłeś o 5 centymetrów, albo czy nie zmieniłeś koloru włosów. Każda mikroskopijna zmiana typu w bazie wywoła w końcu wygenerowanie odpowiedniej migracji korygującej.

### 3. MAPA MYŚLI

```markdown
- Zaawansowane porównywanie w Alembic
  - `compare_type=True`
    - Wykrywa zmianę typu danych (np. Integer -> Float)
    - Wykrywa zmianę limitów znaków (np. VARCHAR(50) -> VARCHAR(100))
  - `compare_server_default=True`
    - Śledzi zmiany wartości domyślnych w bazie (np. default="active")
  - Względy wydajności
    - Skanowanie jest cięższe i dłuższe (odpytuje silnik bazy o każdy typ)
    - W ogromnych projektach włączenie go spowalnia proces `--autogenerate`
```

### 4. PUŁAPKA

**Ignorowanie ostrzeżeń dla typów bazodanowych podczas przenosin!**
Bardzo częsta pułapka ujawnia się podczas przesiadki z SQLite na PostgreSQL. Ktoś projektuje kod używając typu `JSON` w SQLite i Alembic wszystko gładko mapuje. Na produkcji uświadamia sobie, że baza z `compare_type=True` nie potrafi przekonwertować z jakiegoś niestandardowego typu tekstowego prosto do zaawansowanego JSONB w Postgresie bez jawnej klauzuli `USING` w zapytaniu SQL. Wygenerowana migracja "rzuci" wyjątkiem na produkcji. Pamiętaj: zmiana typu (zwłaszcza z tekstowego na liczbowy/obiektowy) często wymaga ingerencji w plik migracji, aby poinstruować silnik bazy jak przekształcić istniejące, historyczne dane.
