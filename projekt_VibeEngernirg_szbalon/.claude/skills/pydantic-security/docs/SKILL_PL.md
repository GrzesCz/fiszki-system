---
name: pydantic-security
description: >
  Rygorystycznie wymusza stosowanie pydantic-settings oraz klasy SecretStr do zarządzania
  konfiguracją, tokenami i hasłami. Wymusza wzorzec Singleton, walidację startową Fail-Fast,
  tworzenie/aktualizowanie pliku .env.example oraz walidatory pól. Uruchamia się, gdy użytkownik mówi:
  "configure environment", "read key from env", "build settings.py" lub gdy projekt wymaga autoryzacji API.
  Zabrania używania czystego modułu os.
version: 1.0.0
---

# Żelazne Prawo Zarządzania Konfiguracją (Secure by Design)

Jesteś starszym inżynierem ds. bezpieczeństwa (Senior Security Engineer). Twoim zadaniem jest bezwzględna ochrona kluczy API przed wyciekiem do logów oraz ułatwienie wdrożenia w projekt nowych programistów.

## KROK 1: Obowiązkowy szablon (Boilerplate) i Singleton
Zawsze, gdy wymagana jest konfiguracja, MUSISZ stworzyć lub zmodyfikować plik konfiguracyjny (np. `config.py` lub `settings.py`) przy użyciu DOKŁADNIE poniższego wzorca:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, field_validator
from pathlib import Path
import sys

# Określ ścieżkę do .env względem tego pliku, a NIE bieżącego katalogu roboczego (CWD).
# Wpisane na stałe "../.env" przestanie działać, gdy aplikacja zostanie uruchomiona z innego folderu.
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_PATH),   # dostosuj głębokość .parent do struktury projektu
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore" # ignoruje nieznane klucze w pliku .env
    )
    
    # SecretStr zastępuje str! Klucz NIE zostanie wyświetlony w logach ani śladach stosu.
    openai_api_key: SecretStr
    
    @field_validator("openai_api_key", mode="after")
    @classmethod
    def validate_openai_key(cls, value: SecretStr) -> SecretStr:
        secret_val = value.get_secret_value()
        if not secret_val.strip():
            raise ValueError("Klucz API nie może być pusty.")
        # Walidacja niepustości i rozsądnej minimalnej długości. NIE wpisuj na sztywno
        # prefiksów zależnych od dostawcy typu "sk-": odrzuca to poprawne klucze (np. klucze
        # projektu "sk-proj-...", Azure lub innych dostawców) i staje się nieaktualne w miarę zmian.
        # Jeśli potrzebujesz walidacji prefiksu, zrób to konfigurowalnie dla dostawcy, a nie jako literał tutaj.
        if len(secret_val) < 20:
            raise ValueError("Klucz API OpenAI wygląda na zbyt krótki, aby był poprawny.")
        return value

# Inicjalizacja Singletona - ta zmienna będzie importowana w całym projekcie
settings = Settings()
```

**Zasada importu:** W całym projekcie musisz importować wyłącznie gotową instancję obiektu: `from config import settings`. Definiowanie lub ponowna instancjacja klasy `Settings` w innych modułach jest kategorycznie zabroniona.

## KROK 2: Synchronizacja pliku `.env.example`
Za każdym razem, gdy dodajesz nową zmienną konfiguracyjną do klasy `Settings`:
1. Sprawdź, czy plik `.env.example` istnieje w katalogu głównym projektu. Jeśli nie, utwórz go.
2. Dodaj nową zmienną do `.env.example` z pustą wartością lub z placeholderem (np. `openai_api_key=sk-PASTE-YOUR-KEY-HERE`).
3. Nigdy nie wpisuj tam swoich prawdziwych sekretów!

## KROK 3: Zasada Fail-Fast
W głównym punkcie wejścia (np. `main.py` lub podczas inicjalizacji modułu MCP) dodaj jawną weryfikację podczas startu aplikacji:

```python
import sys
from pydantic import ValidationError
from config import settings

try:
    # Wymuś walidację i odczyt kluczowych wartości przy starcie aplikacji
    _ = settings.openai_api_key.get_secret_value()
except ValidationError as e:
    print(f"CRITICAL CONFIG ERROR: Brakujące lub niepoprawne zmienne w .env!\nSzczegóły: {e}", file=sys.stderr)
    sys.exit(1)
```

## KROK 4: Dyscyplina zakresu (Scope Discipline)
Ten skill uprawnia Cię do modyfikacji wyłącznie plików konfiguracyjnych (`config.py`/`settings.py`), głównego punktu wejścia (`main.py`) oraz `.env.example`. Nie wolno modyfikować plików logiki biznesowej ani widoków.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Zaimplementowano wzorzec Singleton z użyciem `pydantic-settings`.
- [ ] Uruchomiono `python -c "from config import settings"` — dowód: wklejono wynik z terminala pokazujący 0 błędów.
- [ ] Uruchomiono `cat .env.example` — dowód: wklejono wynik z terminala potwierdzający spójność pliku przykładowego z klasą Settings.
- [ ] Przetestowano walidację Fail-Fast — dowód: uruchomiono aplikację bez pliku `.env` i wklejono wynik pokazujący zamknięcie procesu z jasnym komunikatem błędu.
- [ ] Agent wprost oświadczył: "Pydantic Security complete. Secrets secured via SecretStr, .env.example updated, import PASS."

## Tarcza wymówek (Anti-Rationalization)

| Jeśli myślisz (Agent LLM)... | Właściwa reakcja (Co musisz zrobić) |
| --- | --- |
| "To tylko mały skrypt testowy, użyję os.getenv" | Bezpieczeństwo nie zna wyjątków. Zaimplementuj klasę Settings i odczytaj plik .env za pomocą Pydantic. |
| "Zaimportuję klasę Settings i utworzę nowy obiekt lokalnie" | Naruszenie zasady Singletona! Zaimportuj istniejący obiekt `settings` z pliku konfiguracyjnego. |
| "Użyję typu `str`, tak jest łatwiej napisać" | Typ `str` może wyciec w logach śladu stosu (traceback)! Natychmiast zamień go na `SecretStr`. |
| "Zapomniałem o .env.example, użytkownik sam się domyśli" | Brak dokumentacji blokuje wdrożenie. Natychmiast zaktualizuj plik `.env.example`. |
