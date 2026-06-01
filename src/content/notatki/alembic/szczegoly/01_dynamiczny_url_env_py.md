---
title: '01. Dynamiczne pobieranie adresu bazy z konfiguracji'
category: 'Alembic'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 01. Dynamiczne pobieranie adresu bazy z konfiguracji

W środowiskach Enterprise plik `alembic.ini` służy jedynie jako ogólny plik struktury konfiguracyjnej. Konkretny adres URL bazy danych **musi** być pobierany dynamicznie ze zmiennych środowiskowych, a nie wklejany na sztywno.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Dynamiczne wstrzyknięcie adresu URL z konfiguracji w alembic/env.py
from logging.config import fileConfig
from alembic import context

# Importujemy naszą konfigurację (Pydantic Settings) i modele
from src.config import settings
import src.database.models as models

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = models.Base.metadata

# Dynamicznie nadpisujemy ustawienie w obiekcie config
config.set_main_option("sqlalchemy.url", settings.database_url)

# ... reszta pliku env.py (run_migrations_online / offline)
```
W pliku `alembic.ini` pozostawiamy zakomentowane pole `sqlalchemy.url`:
```ini
# sqlalchemy.url = sqlite:///./todosapp.db
```

### 2. METODA FEYNMANA

Wyobraźcie sobie kierowcę ciężarówki (Alembic), który ma zawieźć meble pod wskazany adres. 
- **Amatorski `alembic.ini` (Hardkodowanie):** Kierowca ma na czole wytatuowany adres: "Warszawa, ulica Główna 15". Jeśli szef firmy zdecyduje przenieść magazyn do Krakowa (zmiana z SQLite na AWS Postgres), musi złapać kierowcę, uśpić go i bolesnym laserem usunąć stary tatuaż, by wydziarać nowy adres. To potwornie niewygodne!
- **Profesjonalny `env.py` (Dynamiczny URL):** Kierowca nie ma żadnego tatuażu. Kiedy przychodzi rano do pracy, dzwoni do dyspozytorni (moduł `src.config.settings`) i pyta: *"Szefie, gdzie dzisiaj jedziemy?"*. Szef podaje mu adres na dziś. Jutro może mu podać inny adres (lokalne testy) a pojutrze jeszcze inny (baza na produkcji). Kierowca jest uniwersalny i zawsze trafia tam, gdzie aktualnie trzeba.

### 3. MAPA MYŚLI

```markdown
- Konfiguracja Alembic (URL Bazy Danych)
  - `alembic.ini`
    - Odpowiada za ścieżki logów, strukturę folderów migracji
    - `sqlalchemy.url` = zakomentowane (lub usunięte)
  - `alembic/env.py`
    - Miejsce "podpinania" aplikacji do bazy
    - `config.set_main_option` - wstrzykiwanie bezpiecznych zmiennych (.env)
    - Integracja z Pydantic Settings
```

### 4. PUŁAPKA

**Pozostawienie zahasłowanego adresu URL w `alembic.ini` i wdrożenie na GitHub!**
Programiści często kopiują z innych projektów gotowy plik `alembic.ini`, w którym jest twardo wbity `sqlalchemy.url = postgresql://user:MojeTrudneHaslo@localhost/baza`. Zostawiają go w repozytorium myśląc "przecież to tylko do lokalnych testów". Następnie to ląduje na publicznym repozytorium GitHuba, powodując katastrofalny wyciek danych. Pamiętaj: plik `alembic.ini` domyślnie jest commitowany do gita! Nigdy, przenigdy nie trzymaj w nim rzeczywistego hasła. Zawsze pobieraj je dynamicznie w `env.py` ze zmiennych środowiskowych, które ignoruje `.gitignore`.
