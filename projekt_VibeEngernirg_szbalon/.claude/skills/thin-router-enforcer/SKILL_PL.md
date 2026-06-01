---
name: Strażnik Czystej Architektury
description: >
  Rygorystycznie wymusza zasady czystej architektury (Thin Router) dla projektów
  FastAPI i Pydantic. Aktywuje się przy modyfikacji lub tworzeniu routerów API.
  Agent MUSI udowodnić czystość routera komendą terminalową. Wymusza separację
  na 3 warstwy, spójność źródeł danych i zakaz mocków w produkcji.
---

# Strażnik Architektury (Thin Router Enforcer — FastAPI & Pydantic)

## Wyzwalacz (Trigger)
- Użytkownik prosi o "utworzenie endpointu", "dodanie ścieżki API", "stwórz router"
- Agent modyfikuje jakikolwiek plik zawierający `APIRouter` lub `@app.get/post/put/delete/patch`

## Procedura

### KROK 1: Identyfikacja Pliku Routera
Użyj terminala, aby potwierdzić, że edytujesz plik routera:
```bash
grep -rn "APIRouter\|@app\.\|@router\." <ścieżka_do_pliku>
```

### KROK 2: Żelazna Reguła "Thin Router"
Wewnątrz funkcji endpointu FastAPI MASZ ABSOLUTNY ZAKAZ pisania:

| Zakazane | Przykład naruszenia | Dlaczego |
| :--- | :--- | :--- |
| **Surowe zapytania SQL** | `db.execute(f"SELECT * FROM...")` | SQL należy do warstwy Repository |
| **Logika biznesowa** | `if order.total > 100: discount = 0.1` | Logika należy do warstwy Service |
| **Bezpośrednie wywołania API** | `requests.get("https://api.extern...")` | Zewnętrzne API obsługuje dedykowany klient/serwis |
| **Transformacje danych** | `result = [{"name": r.name} for r in rows]` | Transformacje należą do schematów Pydantic |
| **Bezpośredni dostęp do plików** | `open("data.csv").read()` | I/O należy do warstwy Repository/Service |

### KROK 3: Wymagana Architektura 3-Warstwowa

```
┌─────────────────────────────────────────┐
│  ROUTER (router.py)                     │
│  - @router.* dekorator                  │
│  - Pydantic model (type hints na I/O)   │
│  - Depends() — wstrzykiwanie serwisu    │
│  - HTTPException — obsługa błędów HTTP  │
│  - ZERO logiki biznesowej               │
└──────────────────┬──────────────────────┘
                   │ wywołuje
┌──────────────────▼──────────────────────┐
│  SERVICE (service.py)                   │
│  - Czysta logika biznesowa              │
│  - Operuje na modelach Pydantic         │
│  - Deleguje dane do Repository          │
│  - NIE importuje FastAPI/Request        │
└──────────────────┬──────────────────────┘
                   │ wywołuje
┌──────────────────▼──────────────────────┐
│  REPOSITORY / DATA (repository.py)      │
│  - Zapytania SQL / ORM                  │
│  - Operacje na plikach                  │
│  - Wywołania zewnętrznych API           │
└─────────────────────────────────────────┘
```

### KROK 4: Spójność Źródeł Danych
Jeśli projekt korzysta z wielu źródeł danych (np. lokalna DB + Supabase + zewnętrzne API):
1. **Obsłuż WSZYSTKIE źródła** — nie pomijaj żadnego w nowym endpoincie.
2. **Deduplikacja** — jeśli dane mogą przyjść z wielu źródeł, deduplikuj po kluczach unikalnych (id, url_link).
3. **ZAKAZ mocków w produkcji** — nigdy nie zwracaj `[]` lub danych testowych jako fallback, gdy zewnętrzny serwis nie odpowiada. Rzuć wyjątek lub zwróć odpowiedni status HTTP.

### KROK 5: Obowiązkowa Weryfikacja Terminalna
ZANIM oddasz kod routera, MUSISZ uruchomić:
```bash
grep -n "execute\|select(\|insert(\|update(\|delete(\|requests\.\|open(\|\.read()" <plik_routera>
```
Jeśli komenda cokolwiek znajdzie — masz naruszenie. Popraw kod ZANIM go oddasz.

### KROK 6: Dowód Architektoniczny
Przed zakończeniem pracy nad endpointem MUSISZ napisać jawny dowód:

```markdown
### 🏗️ DOWÓD ARCHITEKTONICZNY
- **Router:** `router.py` — zawiera TYLKO dekorator, Depends(), type hints Pydantic, HTTPException.
- **Service:** `service.py` — logika biznesowa delegowana do `<nazwa_metody_serwisu>`.
- **Repository:** `repository.py` — zapytania DB delegowane do `<nazwa_metody_repo>`.
- **Weryfikacja grep:** Komenda `grep -n "execute|select|requests" router.py` — wynik: CZYSTO (0 trafień).
- **Źródła danych:** Obsłużone: [lista]. Brakujące: [brak / lista].
```

## Scope Discipline (Dyscyplina Zasięgu)
Masz zakaz modyfikowania jakichkolwiek plików poza warstwą API i logiką biznesową niezbędną do obsłużenia endpointu (czyli `router.py`, `service.py`, `repository.py`, schematy Pydantic). Nie możesz "przy okazji" poprawiać innych endpointów, których użytkownik nie kazał Ci dotykać.

## Twarde Kryteria Wyjścia (Exit Criteria)
Endpoint jest gotowy TYLKO gdy:
- [ ] Router nie zawiera logiki biznesowej, SQL, ani bezpośrednich wywołań API — dowód: output komendy `grep -n "execute\|select(\|insert(\|update(\|delete(\|requests\.\|open(" <router.py>` → **0 trafień**.
- [ ] Cały input/output jest typowany modelami Pydantic — dowód: output komendy `grep -n "def.*-> dict\|def.*-> list\|return {" <router.py>` → **0 trafień** (żaden endpoint nie zwraca surowego dict/list).
- [ ] Serwis jest wstrzykiwany przez `Depends()` — dowód: output komendy `grep -n "Depends(" <router.py>` → **≥1 trafienie** na każdy endpoint.
- [ ] Dowód Architektoniczny jest wygenerowany w formacie z KROKU 6 (z nazwami warstw i outputem grepa).
- [ ] Spójność źródeł danych jest zachowana — dowód: agent wylistował obsłużone źródła i potwierdził brak mocków (jeśli dotyczy).
- [ ] Agent jawnie napisał: "Weryfikacja Thin Router zakończona. Router `<nazwa>` ma X endpointów, 0 naruszeń, architektura 3-warstwowa potwierdzona."

## Tabela Anty-Racjonalizacji
| Racjonalizacja | Akcja Agenta |
| --- | --- |
| "To tylko prosty endpoint, umieszczę zapytanie DB bezpośrednio w routerze." | **ODRZUCONO.** Utwórz funkcję w serwisie nawet dla trywialnych zapytań. Reguła Thin Router jest absolutna. |
| "Zwrócę zwykły słownik (dict) zamiast modelu Pydantic, bo tak jest szybciej." | **ODRZUCONO.** Cały I/O musi być ściśle typowany modelami Pydantic. |
| "Nie ma sensu tworzyć osobnego repository dla jednego zapytania." | **ODRZUCONO.** Architektura 3-warstwowa obowiązuje niezależnie od rozmiaru. |
| "Mock zwróci pusty wynik, to nie problem." | **ODRZUCONO.** Zakaz mocków w produkcji. Rzuć wyjątek lub zwróć status 503. |
