---
title: '02. Autogenerowanie migracji (Autogenerate)'
category: 'Alembic'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 02. Autogenerowanie migracji (Autogenerate)

Kiedy poprawnie podepniemy `target_metadata = models.Base.metadata` w pliku `env.py`, zyskujemy potężną supermoc: autogenerowanie plików migracji. Oszczędza to ogromną ilość czasu i redukuje literówki w zapytaniach SQL.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Podpięcie bazy w env.py aby autogenerowanie zadziałało
import src.database.models as models

# Rejestracja modeli do autogenerowania
target_metadata = models.Base.metadata
```

Uruchomienie w konsoli:
```bash
alembic revision --autogenerate -m "Add description of changes"
```

### 2. METODA FEYNMANA

Wyobraźcie sobie inżyniera budowlanego.
- **Ręczne pisanie migracji:** Inżynier idzie na budowę i sam cegła po cegle próbuje budować dobudówkę do domu, jednocześnie patrząc na projekt w swoim zeszycie. Jest spora szansa, że o jakiejś cegle zapomni lub użyje złej zaprawy.
- **Autogenerowanie (`--autogenerate`):** Inżynier włącza wielki super-skaner, który omiata cały istniejący dom (stan obecny bazy danych). Następnie maszyna porównuje skan z projektem 3D w komputerze (kod SQLAlchemy w Pythonie). Maszyna krzyczy: *"Ej! Na projekcie jest tu nowy pokój, a w prawdziwym domu go nie ma! Wydrukowałem Ci kartkę z instrukcją, jak ten pokój dobudować"*. Ta kartka to właśnie wygenerowany plik migracji! Inżynier musi ją tylko przeczytać (zweryfikować) i podpisać, aby roboty zaczęły budowę.

### 3. MAPA MYŚLI

```markdown
- Autogenerowanie w Alembic (`--autogenerate`)
  - Wymagania
    - Import obiektów modeli z kodów aplikacji
    - Podpięcie pod `target_metadata` w `env.py`
  - Co Alembic wykrywa bez problemu?
    - Dodanie/usunięcie tabel
    - Dodanie/usunięcie kolumn
    - Zmiana kluczy obcych (Foreign Keys)
  - Z czym ma problem? (Wymaga ręcznej korekty!)
    - Zmiana nazwy tabeli / kolumny (interpretuje jako Drop + Add)
    - Zmiana typów (wymaga włączenia w `compare_type=True`)
```

### 4. PUŁAPKA

**Ślepa wiara w automatycznie wygenerowany kod!**
Alembic nie czyta w Twoich myślach. Największym błędem jest odpalenie `--autogenerate`, a następnie od razu uruchomienie wdrożenia (upgrade) bez zerknięcia do folderu `versions`. Wyobraź sobie, że zmieniłeś nazwę kolumny `user_name` na `username`. Alembic domyślnie wygeneruje kod usuwający kolumnę `user_name` (`op.drop_column`) i tworzący nową kolumnę `username` (`op.add_column`). Wynik na produkcji? Bezpowrotna utrata wszystkich imion użytkowników! Zawsze trzeba wejść w plik i zmienić to na `op.alter_column('table', 'user_name', new_column_name='username')`. Narzędzie to asystent, a nie główny inżynier.
