---
title: 'Gotowe Skille: Pydantic Security i Tarcza na Halucynacje'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-06-30'
review_count: 0
---

# 🛡️ Gotowe Skille (Copy-Paste) dla Czystego Pythona

Skoro pracujesz w przewidywalnym, czystym Pythonie z Pydantic (oraz MCP), Twoje środowisko potrzebuje strażników chroniących przed dwoma największymi problemami LLM-ów: **wyciekami tokenów** (leniwe kodowanie zmiennych) oraz **zmyślaniem API** (halucynacje w szybkozmiennym świecie AI).

Poniżej znajdziesz dwa kompletne, gotowe do użycia pliki Skilli. Wystarczy, że skopiujesz ich zawartość do swojego projektu (np. do `.claude/skills/pydantic_security.md` oraz `.claude/skills/hallucination_shield.md`).

---

## Skill 1: Pydantic Security Enforcer

Ten skill zamienia Agenta w eksperta od SecOps. Zawsze, gdy poprosisz go o załadowanie klucza z `.env` lub skonfigurowanie połączenia, wymusi on użycie Pydantic `BaseSettings` z modułem `SecretStr`, poprawną strukturę Singletona, weryfikację Fail-Fast przy starcie, walidację formatu kluczy oraz automatyczną aktualizację pliku `.env.example`.

**Plik:** `.claude/skills/pydantic_security.md`

```markdown
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

## KROK 4: Scope Discipline (Dyscyplina Zasięgu)
Ten skill uprawnia Cię do modyfikowania wyłącznie plików konfiguracji (`config.py`/`settings.py`), pliku wejściowego (`main.py`) oraz `.env.example`. Nie wolno Ci przy okazji modyfikować żadnych plików logiki biznesowej ani widoków.

## Anti-Rationalization (Tarcza na wymówki)
| Jeśli Ty (Agent LLM) pomyślisz... | Prawidłowa odpowiedź (Co musisz zrobić) |
| :--- | :--- |
| "To tylko mały skrypt testowy, użyję os.getenv" | Bezpieczeństwo nie zna wyjątków. Zaimplementuj klasę Settings i odczytaj plik .env przez Pydantic. |
| "Zaimportuję klasę Settings i stworzę nowy obiekt lokalnie" | Złamanie zasady Singletona! Zaimportuj istniejący obiekt `settings` z pliku konfiguracyjnego. |
| "Użyję po prostu `str`, będzie mi łatwiej pisać" | `str` wycieknie w trace logach błędu! Zamień to natychmiast na `SecretStr`. |
| "Zapomniałem o .env.example, użytkownik sam sobie uzupełni" | Brak dokumentacji blokuje deployment. Zaktualizuj `.env.example` natychmiast. |
```

---

## Skill 2: Tarcza na Halucynacje (Hallucination Shield)

Świat AI zmienia się z miesiąca na miesiąc. Ten skill powstrzyma Agenta przed zmyślaniem metod, których nie ma, oraz wymusi rygorystyczne testowanie poprawności importów, wychwytywanie deprecjacji (Deprecation Warnings) oraz bezwzględny obowiązek czytania i wyszukiwania najnowszej dokumentacji bibliotek.

**Plik:** `.claude/skills/hallucination_shield.md`

```markdown
---
name: Hallucination Shield
description: >
  Wymusza na agencie weryfikację stanu środowiska, bezwzględne czytanie najnowszej dokumentacji,
  testowanie poprawności importów (python -c) oraz analizę deprecjacji przed wdrożeniem kodu.
  Odpala się, gdy użytkownik mówi "zaimplementuj to API", "dodaj MCP", "użyj najnowszej biblioteki X",
  "napisz kod" lub "zrefaktoryzuj".
---

# Procedura Weryfikacji Środowiska (No Blind Coding)

Jesteś inżynierem-audytorem, który wie, że jego pamięć potrafi zmyślać (halucynować) stare wersje oprogramowania. Zanim napiszesz kod do integracji zewnętrznych systemów, MUSISZ zweryfikować faktyczny stan środowiska użytkownika oraz zapoznać się z najnowszą dokumentacją.

## KROK 1: Audyt Wersji i Środowiska
1. Zanim napiszesz kod z wykorzystaniem nowej biblioteki, uruchom `uv pip show <nazwa_paczki>` lub `pip show <nazwa_paczki>`.
2. Zidentyfikuj, jakiej dokładnie wersji używa projekt (np. `0.130.0`).

## KROK 2: Obowiązkowe Sprawdzenie Najnowszej Dokumentacji
Zakazuje się pisania kodu z pamięci LLM dla bibliotek zewnętrznych (Pydantic, MCP, FastAPI, OpenAI SDK itp.).
1. **Lokalna dokumentacja:** Przeszukaj katalog `/docs` lub `/materiały` w poszukiwaniu plików z wytycznymi dotyczącymi danej biblioteki. Masz BEZWZGLĘDNY obowiązek otworzyć i przeczytać te pliki przed przystąpieniem do kodowania.
2. **Dokumentacja online (Wyszukiwarka):** Jeśli nie ma dokumentacji lokalnej lub masz wątpliwości, użyj dostępnych narzędzi sieciowych (wyszukiwarki webowej), aby znaleźć oficjalną dokumentację dla zidentyfikowanej w Kroku 1 wersji (np. `docs.pydantic.dev` lub GitHub repozytorium serwera MCP).
3. **Analiza sygnatur:** Przed wywołaniem metody, sprawdź jej dokładne parametry wejściowe w oficjalnych źródłach online.
4. **Context7 MCP (Silnik wyszukiwania API):** Jeśli w Twoim środowisku uruchomiony jest serwer MCP Context7 (`@upstash/context7-mcp@latest`), MUSISZ użyć narzędzia `query-docs` z odpowiednim identyfikatorem biblioteki (np. `/littlebearapps/outlook-mcp` lub dla innej biblioteki, której używasz), aby pobrać jej oficjalne, świeże API.

## KROK 3: Test i Odkrywanie API
Zamiast zgadywać argumenty funkcji z pamięci:
1. W przypadku nowszych frameworków (jak pakiety MCP lub nowe moduły Pythona), napisz krótki skrypt poboczny, aby wywołać `help(Moduł)` lub użyj skryptu inspekcji poprzez terminal (np. funkcję `dir(Obiekt)`).
2. Sprawdź, co aktualnie paczka eksponuje. Czy spodziewana metoda nadal tam jest?

## KROK 4: Zasada MCP i Fail-Fast
1. Model Context Protocol to relatywnie nowa technologia. Twoja wbudowana wiedza może być przestarzała.
2. Przy dodawaniu narzędzi przez MCP wymuś na sobie wygenerowanie logiki obsługującej ścisły standard JSON-RPC oraz powiedz na głos: *"Sprawdziłem aktualną specyfikację serwera"*.
3. Wdrożenie Fail-Fast na porcie komunikacyjnym: Klient MCP musi przy starcie sprawdzić połączenie. Jeśli serwer nie odpowie w ciągu 5 sekund, klient musi wyrzucić błąd krytyczny i zatrzymać proces zamiast wisieć w nieskończoność.

## KROK 5: Weryfikacja Działania i Deprecjacji (Wymóg Seniora)
Zanim uznasz kod za skończony:
1. **Test importu:** Uruchom w terminalu `python -c "from ścieżka.do.modułu import klasa_lub_funkcja"` i upewnij się, że polecenie nie zwraca błędów. Zapobiega to halucynacjom struktury katalogów i nazw plików.
2. **Test ostrzeżeń:** Uruchom aplikację lub testy z flagą `-W all`, np.: `python -W all main.py` lub `pytest -W all`. Sprawdź, czy biblioteki zewnętrzne nie zgłaszają `DeprecationWarning` w kontekście Twojego kodu.

## KROK 6: Twarde Kryteria Wyjścia (Exit Criteria)
Praca nad integracją lub refaktoryzacją jest skończona TYLKO wtedy, gdy:
- [ ] Dokumentacja lokalna lub online została przeczytana i zanalizowana (zostaw w logu myślowym ślad: "Przeanalizowałem dokumentację X pod wersję Y").
- [ ] Zwracane przez `python -c` polecenie importu przechodzi czysto (bez błędów).
- [ ] W logach startowych z flagą `-W all` nie ma żadnych ostrzeżeń `DeprecationWarning` wywołanych przez Twój kod.
- [ ] Walidacja Fail-Fast została przetestowana i poprawnie przerywa proces przy braku konfiguracji.

## Anti-Rationalization (Tarcza na wymówki)
| Jeśli Ty (Agent LLM) pomyślisz... | Prawidłowa odpowiedź (Co musisz zrobić) |
| :--- | :--- |
| "Pamiętam świetnie, jak działa ta wersja biblioteki X." | Pamięć bywa zawodna. Sprawdź plik `uv.lock` lub kod źródłowy, czy metoda nadal istnieje. Zrób to! |
| "Nie ma czasu na analizę, szybciej napiszę kod." | Pisanie błędnego kodu marnuje najwięcej czasu. Zatrzymaj się i zweryfikuj API obiektu. |
| "Znam to API na wylot, nie muszę szukać w Google ani w /docs." | Biblioteki w świecie AI zmieniają się z tygodnia na tydzień. Otwórz najnowszą dokumentację lokalną lub użyj wyszukiwarki. To nakaz! |
| "Test importu zajmie za dużo czasu." | Test zajmuje 2 sekundy. Uruchom `python -c` i udowodnij, że import działa. |
```

---

### Jak z tego korzystać?
Mając te dwa pliki w katalogu ze skillami (`.claude/skills/`), za każdym razem, gdy rozpoczniesz z Agentem nowe zadanie (np. *"dodajmy logowanie do bazy danych"* albo *"podłączmy to do MCP"*), Agent automatycznie "przeczyta" te wymogi, zobaczy Twojego gotowca Pydantic i będzie bał się napisać stary kod!

### 🔌 Jak podłączyć serwer Context 7, żeby Skill działał w 100%?
Pamiętaj, że Agent (nawet zmuszony przez powołany wyżej wymóg) użyje narzędzia `query-docs` **tylko wtedy, gdy udostępnisz mu to narzędzie** (wtyczkę) w jego środowisku pracy. Zawsze zadbaj o to, by najpierw je podłączyć:

- **W środowisku Claude Code (CLI):** 
  W terminalu swojego projektu wpisz polecenie:
  `claude mcp add context7 npx -y @upstash/context7-mcp@latest`
- **W innych klientach (np. Claude Desktop / Roo Code / Cursor):**
  Musisz dodać nowy serwer MCP do pliku konfiguracyjnego (zazwyczaj `mcp.json` lub `mcp_config.json`) z argumentami wywołania: `npx -y @upstash/context7-mcp@latest`.

---

## Nowe Skille z serii "Senior Enterprise"

Poniżej znajdują się 4 dodatkowe, zaawansowane skille wyciągnięte z architektury projektu `PythonAIAssistant`. Wymuszają one na agencie myślenie i zachowanie na poziomie Senior / Principal Developera.

Każdy skill zawiera:
- **Konkretne komendy terminala i wzorce grep** — agent nie może odpowiadać "z pamięci", musi udowodnić każdy punkt outputem z terminala.
- **Twarde Kryteria Wyjścia (Exit Criteria)** — checklista warunków, bez których agent NIE MA PRAWA powiedzieć "gotowe".
- **Ustrukturyzowany Format Raportu** — agent musi wygenerować raport w określonym formacie Markdown.
- **Tabela Anty-Racjonalizacji** — blokuje typowe wymówki AI ("to tylko prosty skrypt", "nie mam czasu na review").

### Skill 3: Audytor Enterprise (Enterprise Code Auditor)
**Folder:** `.claude/skills/enterprise-code-auditor/`

Wymusza rygorystyczny audyt bezpieczeństwa, wydajności, jakości **i architektury** przed commitem. Agent MUSI użyć terminala (`grep -rn`) do przeskanowania codebase pod kątem konkretnych wzorców:

| Sekcja Audytu | Co sprawdza |
| :--- | :--- |
| 🚨 Security | SQL Injection, Sekrety w kodzie, Wyciek PII, **Prompt Injection**, Walidacja inputów |
| ⚡ Performance | Blokowanie Async, N+1 Queries, **Connection Pooling** |
| 📝 Quality | `exc_info=True`, Type Hints, Print vs Logger |
| 🏗️ Architecture | **Separacja warstw**, Modularność, **Spójność źródeł danych** |

Agent generuje pełen raport z dowodami z terminala i listą problemów posortowaną wg severity.

### Skill 4: Strażnik Architektury (Thin Router Enforcer — FastAPI & Pydantic)
**Folder:** `.claude/skills/thin-router-enforcer/`

Wymusza architekturę 3-warstwową (Router → Service → Repository). Zoptymalizowany pod **FastAPI/Pydantic**. Agent:
1. Ma **ABSOLUTNY ZAKAZ** pisania SQL, logiki biznesowej, wywołań API lub I/O wewnątrz routera.
2. MUSI uruchomić `grep -n "execute|select|requests" router.py` aby udowodnić czystość.
3. MUSI wygenerować "**Dowód Architektoniczny**" z nazwami serwisów i wynikiem grepa.
4. Wymusza **spójność źródeł danych** (deduplikacja, brak mocków w produkcji).

### Skill 5: Podwójna Weryfikacja (Hard Gate 2x Check)
**Folder:** `.claude/skills/hard-gate-review/`

Agent musi przejść przez zmianę persony i odpowiedzieć na **6 obowiązkowych pytań adversarialnych**:

| # | Pytanie |
| :--- | :--- |
| 1 | Jaki input spowodowałby crash lub wyciek danych? |
| 2 | Która walidacja brakuje? |
| 3 | Gdzie kod wybuchnie przy 1000 requestach? |
| 4 | Czy wyjątki mają `exc_info=True`? |
| 5 | Czy kod jest odporny na Prompt Injection? |
| 6 | Czy usunąłem print()/debug logi? |

Generuje **ustrukturyzowany werdykt** (Security ✅/❌, Performance ✅/❌, Quality ✅/❌) ze **scoringiem ufności** (0.0–1.0). Przy FAIL: max 1 próba poprawy, potem **HARD GATE STOP** — zakaz "przepychania" złego kodu.

### Skill 6: Zasada Harcerza (Boy Scout Rule)
**Folder:** `.claude/skills/boy-scout-rule/`

Przy KAŻDEJ modyfikacji pliku (nawet 1 linijki) agent MUSI:
1. **Uruchomić linter** (`uv run ruff check`) i wkleić output.
2. **Przeskanować 8 wzorców długu technicznego** (brak `exc_info`, gołe `except:`, print(), `#region agent`, brak type hints, magiczne liczby, itd.).
3. **Uruchomić test importu** (`python -c "from moduł import klasa"`) — ZERO tolerancji dla `NameError`/`ImportError`.
4. **Zweryfikować start** (jeśli to plik wejściowy) — `python -W all main.py` i sprawdzić brak `DeprecationWarning`.
5. **Wygenerować Raport Harcerza** z tabelą dowodów z terminala.

