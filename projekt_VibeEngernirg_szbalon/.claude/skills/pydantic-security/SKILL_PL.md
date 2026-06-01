---
name: Pydantic Security Enforcer
description: >
  Bezwzględnie wymusza używanie pydantic-settings i SecretStr do zarządzania 
  konfiguracją, tokenami i hasłami. Wymusza wzorzec Singletona, walidację startową Fail-Fast,
  tworzenie/aktualizację .env.example oraz walidatory pól. Odpala się zawsze, gdy użytkownik mówi: 
  "skonfiguruj środowisko", "odczytaj klucz z env", "zbuduj settings.py" lub 
  gdy projekt wymaga autoryzacji do API. Zakazuje używania zwykłego modułu os.
---

# Żelazne Prawo Zarządzania Konfiguracją (Secure by Design)

Jesteś starszym inżynierem bezpieczeństwa. Twoim zadaniem jest absolutna ochrona kluczy API przed wyciekiem do logów oraz ułatwienie wdrożenia projektu nowym programistom.

## KROK 1: Obowiązkowy Boilerplate i Singleton
Gdy tylko zajdzie potrzeba konfiguracji projektu, MUSISZ stworzyć lub zmodyfikować plik (np. `config.py` lub `settings.py`) używając dokładnie tego wzorca:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, field_validator
import sys

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env", # Pamiętaj o upewnieniu się czy ścieżka jest poprawna
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore" # ignoruje nieznane klucze w pliku .env
    )
    
    # SecretStr zastępuje str! Klucz NIE wyświetli się w logach.
    openai_api_key: SecretStr
    
    @field_validator("openai_api_key", mode="after")
    @classmethod
    def validate_openai_key(cls, value: SecretStr) -> SecretStr:
        secret_val = value.get_secret_value()
        if not secret_val.strip():
            raise ValueError("Klucz API nie może być pustym ciągiem znaków.")
        if not secret_val.startswith("sk-"):
            raise ValueError("Klucz API OpenAI powinien zaczynać się od prefiksu 'sk-'.")
        return value

# Inicjalizacja Singletona - ta zmienna będzie importowana w całym projekcie
settings = Settings()
```

**Zasada importu:** W całym projekcie importujesz wyłącznie gotowy obiekt: `from config import settings`. Zakazane jest ponowne definiowanie lub instancjonowanie klasy `Settings` w innych modułach.

## KROK 2: Synchronizacja `.env.example`
Za każdym razem, gdy dodajesz nową zmienną konfiguracyjną do klasy `Settings`:
1. Sprawdź, czy w głównym folderze projektu istnieje plik `.env.example`. Jeśli go nie ma, stwórz go.
2. Dopisz do `.env.example` nową zmienną z pustym lub przykładowym placeholderem (np. `openai_api_key=sk-PASTE-YOUR-KEY-HERE`).
3. Nigdy nie wpisuj tam swoich rzeczywistych sekretów!

## KROK 3: Zasada Szybkiej Porażki (Fail-Fast)
W głównym punkcie wejścia (np. `main.py` lub przy starcie modułu MCP) dodaj jawną walidację przy uruchomieniu procesu:

```python
import sys
from pydantic import ValidationError
from config import settings

try:
    # Wymuś walidację i odczyt kluczowych wartości przy starcie aplikacji
    _ = settings.openai_api_key.get_secret_value()
except ValidationError as e:
    print(f"CRITICAL CONFIG ERROR: Brakujące lub błędne zmienne w .env!\nSzczegóły: {e}", file=sys.stderr)
    sys.exit(1)
```

## KROK 4: Dyscyplina Zasięgu (Scope Discipline)
Ten skill upoważnia Cię wyłącznie do edycji plików konfiguracyjnych (`config.py`/`settings.py`), punktu wejściowego (`main.py`) i `.env.example`. Nie wolno Ci modyfikować plików logiki biznesowej, innych modułów, ani widoków.

## Twarde Kryteria Wyjścia (Exit Criteria)
Zadanie jest skończone TYLKO gdy:
- [ ] Zastosowano wzorzec Singleton z użyciem `pydantic-settings`.
- [ ] Uruchomiono `python -c "from config import settings"` — dowód: wklej output z terminala pokazujący 0 błędów.
- [ ] Uruchomiono `cat .env.example` — dowód: wklej output z terminala potwierdzający synchronizację pliku przykładowego z klasą Settings.
- [ ] Walidacja Fail-Fast została przetestowana — dowód: uruchom aplikację bez `.env` i wklej output z terminala pokazujący przerwanie procesu z jasnym błędem.
- [ ] Agent jawnie napisał: "Pydantic Security zakończone. Sekrety zabezpieczone przez SecretStr, plik .env.example zaktualizowany, import PASS."

## Anti-Rationalization (Tarcza na wymówki)
| Jeśli Ty (Agent LLM) pomyślisz... | Prawidłowa odpowiedź (Co musisz zrobić) |
| :--- | :--- |
| "To tylko mały skrypt testowy, użyję os.getenv" | Bezpieczeństwo nie zna wyjątków. Zaimplementuj klasę Settings i odczytaj plik .env przez Pydantic. |
| "Zaimportuję klasę Settings i stworzę nowy obiekt lokalnie" | Złamanie zasady Singletona! Zaimportuj istniejący obiekt `settings` z pliku konfiguracyjnego. |
| "Użyję po prostu `str`, będzie mi łatwiej pisać" | `str` wycieknie w trace logach błędu! Zamień to natychmiast na `SecretStr`. |
| "Zapomniałem o .env.example, użytkownik sam sobie uzupełni" | Brak dokumentacji blokuje deployment. Zaktualizuj `.env.example` natychmiast. |
