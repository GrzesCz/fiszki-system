---
title: '03. Zarządzanie Sekretami i Pydantic Settings'
category: 'FastAPI'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 03. Zarządzanie Sekretami i Pydantic Settings

Każda profesjonalna aplikacja potrzebuje konfiguracji: adresu bazy danych, klucza JWT, portów, flag debug. Na poziomie Senior Enterprise konfiguracja nie może być wpisana w kodzie — musi pochodzić ze środowiska i być silnie typowana. W tej lekcji nauczysz się, jak to zrobić poprawnie, bezpiecznie i elegancko za pomocą `pydantic-settings`.

---

### 1. ZWIĘZŁY KOD

```python
# ═══════════════════════════════════════════
# Plik: src/core/config.py
# ═══════════════════════════════════════════
import sys
from pydantic import SecretStr, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralny punkt konfiguracji całej aplikacji."""

    model_config = SettingsConfigDict(
        env_file=".env",           # automatyczne wczytywanie z pliku .env
        env_file_encoding="utf-8",
        case_sensitive=False,      # DATABASE_URL = database_url
        extra="ignore"             # ignoruj nieznane zmienne
    )

    # Wymagane — brak ich w .env = błąd na starcie (Fail-Fast)
    secret_key: SecretStr          # SecretStr maskuje wartość w logach!
    database_url: str

    # Opcjonalne z domyślnymi wartościami
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 20
    debug: bool = False


# ═══════════════════════════════════════════
# Inicjalizacja z zasadą Fail-Fast
# ═══════════════════════════════════════════
try:
    settings = Settings()
except ValidationError as e:
    print(f"CRITICAL: Brak wymaganych zmiennych w .env!\n{e}", file=sys.stderr)
    sys.exit(1)  # Aplikacja NIE wystartuje bez konfiguracji


# ═══════════════════════════════════════════
# Użycie w kodzie autoryzacji
# ═══════════════════════════════════════════
from src.core.config import settings

def create_access_token(data: dict):
    # Jawne wydobycie sekretu — tylko w miejscu użycia
    key = settings.secret_key.get_secret_value()
    return jwt.encode(data, key, algorithm=settings.algorithm)
```

```env
# ═══════════════════════════════════════════
# Plik: .env (NIGDY nie commitowany do repozytorium!)
# ═══════════════════════════════════════════
SECRET_KEY=197b2c37c391bed93fe80344fe73b806947a65e36206e05a1a23c2fa12702fe3
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/mydb
DEBUG=false
```

```gitignore
# ═══════════════════════════════════════════
# Plik: .gitignore (absolutnie kluczowe!)
# ═══════════════════════════════════════════
.env
```

### 2. METODA FEYNMANA

Wyobraź sobie **sejf w banku**.

- **Kod do skarbca** (klucz JWT, hasło do bazy) nie jest napisany nigdzie w instrukcji banku (w kodzie źródłowym). Gdyby był — każdy kto kupi książkę z procedurami (przejrzy repozytorium na GitHubie) znałby kod i mógłby otworzyć skarbiec.

- Zamiast tego, **dyrektor rano dostarcza kod w zapieczętowanej kopercie** (plik `.env`). Jeśli dyrektor nie przyniesie koperty (brak zmiennych w środowisku) — bank w ogóle nie zostaje otwarty. To jest **zasada Fail-Fast**: lepiej nie wystartować wcale, niż wystartować bez zabezpieczeń i udawać, że wszystko jest OK.

- A co z **`SecretStr`**? To jakby dyrektor nosił okulary polaryzacyjne. Gdyby ktoś próbował sfotografować kopertę w dzienniku (logach systemu), na zdjęciu zamiast kodu wyszłoby `**********`. Czysty klucz wydobywany jest wyłącznie w jednym, precyzyjnym momencie — gdy otwierasz zamek (`get_secret_value()`).

### 3. MAPA MYŚLI

```
Zarządzanie konfiguracją w FastAPI
├── Plik .env
│   ├── Przechowuje wszystkie sekrety i adresy
│   ├── NIGDY nie trafia do repozytorium (.gitignore!)
│   └── Każde środowisko ma własny (dev, staging, prod)
├── Pydantic Settings (BaseSettings)
│   ├── Automatyczne wczytywanie zmiennych z .env
│   ├── Silne typowanie (str, int, bool, SecretStr)
│   ├── Walidacja na starcie aplikacji
│   └── Singleton — jeden obiekt settings w całej aplikacji
├── SecretStr
│   ├── Maskowanie w logach i repr() → '**********'
│   ├── Jawne wydobycie: .get_secret_value()
│   └── Ochrona przed przypadkowym wyciekiem
└── Zasada Fail-Fast
    ├── Brak zmiennej = ValidationError
    ├── sys.exit(1) przed startem serwera
    └── Lepiej nie wystartować niż działać bez zabezpieczeń
```

### 4. PUŁAPKA

**Domyślne wartości dla sekretów — cichy zabójca bezpieczeństwa!**

Częstym błędem jest pisanie: `os.getenv("SECRET_KEY", "domyslny_klucz")`. Na komputerze lokalnym wszystko działa pięknie. Ale gdy wdrożysz aplikację na serwer produkcyjny i zapomnisz ustawić zmienną środowiskową — kod uruchomi się z tym "domyślnym kluczem". Nikt tego nie zauważy, aż system zostanie zhakowany, bo Twój produkcyjny klucz JWT to wartość `"domyslny_klucz"` znana całemu internetowi.

**Rozwiązanie:** W `Pydantic Settings` pola bez wartości domyślnej (np. `secret_key: SecretStr`) są automatycznie wymagane. Brak ich w `.env` = natychmiastowy `ValidationError` i odmowa startu. Nigdy nie musisz się martwić, że aplikacja "po cichu" działa z pustą konfiguracją.
