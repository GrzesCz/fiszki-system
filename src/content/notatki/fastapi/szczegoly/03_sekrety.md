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

Hardkodowanie zmiennych konfiguracyjnych w kodzie aplikacji to jeden z największych grzechów "kursowych" tutoriali. W aplikacjach klasy Enterprise, konfigurację budujemy z użyciem wzorca fail-fast oraz bezwzględnie maskujemy dane dostępowe do systemów zewnętrznych i bazy danych.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Użycie klasy Settings oraz typu SecretStr
import sys
from pydantic import SecretStr, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # SecretStr zapobiega wyciekom w logach!
    secret_key: SecretStr
    algorithm: str = "HS256"
    database_url: str

# Inicjalizacja Singletona wraz z logiką Fail-Fast
try:
    settings = Settings()
except ValidationError as e:
    print(f"CRITICAL: Brak wymaganych zmiennych w .env!\n{e}", file=sys.stderr)
    sys.exit(1)

# Gdzieś w kodzie autoryzacji:
key_to_use = settings.secret_key.get_secret_value()
```

### 2. METODA FEYNMANA

Wyobraźcie sobie sejf w banku (kod naszej aplikacji).
- **Podejście amatorskie (Hardkodowanie w kodzie):** Na głównych drzwiach wejściowych banku wielkim, czerwonym flamastrem napisano kod do skarbca. Ktokolwiek przejdzie obok (lub przegląda repozytorium GitHub), z łatwością otworzy zamek.
- **Podejście Enterprise (Pydantic Settings + .env):** Kod do skarbca nie jest napisany nigdzie w instrukcji banku. Dostarcza go rano dyrektor w zapieczętowanej kopercie (`.env`). Jeśli dyrektor nie przyniesie rano koperty (brak zmiennych w środowisku), bank w ogóle nie zostaje otwarty (*Zasada Fail-Fast* — zawiesza się na starcie), żeby nikt przypadkowy nie przejął kontroli. Co więcej, dyrektor nosi okulary polaryzacyjne (`SecretStr`) — jak spróbujesz sfotografować kopertę w logach systemu, na zdjęciu wyjdzie wielka plama (maskowanie wartości), a czysty klucz wydobywany jest tylko na ułamek sekundy w zamku!

### 3. MAPA MYŚLI

```markdown
- Zarządzanie konfiguracją w FastAPI
  - Antywzorce
    - `SECRET_KEY = "moj_twardy_klucz_123"`
    - Zapisywanie pliku `.env` w repozytorium
  - Pydantic Settings
    - Singleton z silnym typowaniem konfiguracji
    - Wzorzec Fail-Fast (zatrzymanie Uvicorna na ValidationError)
  - `SecretStr`
    - Ochrona przed nadmiernym logowaniem (logger leak)
    - `get_secret_value()` jawnie wyraża odczyt sekretu
```

### 4. PUŁAPKA

**Brak fail-fast przy starcie aplikacji!**
Zdarza się, że programiści implementują odczyt kluczy z użyciem zwykłego `os.getenv("SECRET_KEY", "domyslny_klucz")`. To katastrofa na produkcji! Jeśli wdrożysz aplikację, ale zapomnisz ustawić zmienną środowiskową na serwerze, kod uruchomi się, cichutko akceptując "domyslny_klucz". Przez tydzień nikt tego nie zauważy, aż system zostanie zhakowany, ponieważ Twój produkcyjny klucz JWT był wartością domyślną znaną w internecie! `Pydantic Settings` eliminuje to — bez `.env` wyrzuci błąd składni i program z hukiem runie (fail-fast), błyskawicznie zwracając Ci uwagę na błąd w infrastrukturze.
