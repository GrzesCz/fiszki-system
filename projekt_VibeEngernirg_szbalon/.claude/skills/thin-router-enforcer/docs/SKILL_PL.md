---
name: thin-router-enforcer
description: >
  Rygorystycznie wymusza zasady czystej architektury (Thin Router - Cienki Router) dla projektów FastAPI i Pydantic.
  Uruchamia się przy modyfikowaniu lub tworzeniu routerów API FastAPI. Agent MUSI udowodnić czystość routera
  za pomocą poleceń w terminalu. Wymusza 3-warstwowy podział, spójność źródeł danych oraz zakaz mocków na produkcji.
version: 1.0.0
---

# Thin Router Enforcer (Cienki Router w FastAPI & Pydantic)

## Wyzwalacz (Trigger)

- Użytkownik prosi o "utworzenie punktu końcowego", "dodanie ścieżki API", "stworzenie routera" (create endpoint / route / router).
- Agent modyfikuje dowolny plik zawierający `APIRouter` lub dekoratory `@app.get/post/put/delete/patch`.

## Relacja z innymi skillami

- Decyduje o tym, JAKIE warstwy istnieją; `simplicity-gate` rozstrzyga, czy każda z nich ZARABIA na swoje istnienie. Jeśli warstwa wymagana przez ten skill okaże się pustym przekazaniem wywołania dalej (brak realnej logiki), `simplicity-gate` ma pierwszeństwo: uprość ją (collapse) i odnotuj uzasadniony wyjątek w Dowodzie Architektonicznym. Struktura bez logiki to pusta ceremonia.
- Do obsługi konfiguracji i sekretów w serwisach używaj `pydantic-security`. Do pre-commit weryfikacji użyj `python-quality-gate`.

## Procedura

### KROK 1: Zidentyfikuj plik routera
Użyj terminala, aby potwierdzić, że edytujesz plik z routerem API:
```bash
grep -rn "APIRouter\|@app\.\|@router\." <path_to_file>
```

### KROK 2: Żelazna Zasada — "Cienki Router" (Thin Router)
Wewnątrz funkcji endpointu FastAPI kategorycznie ZABRANIA się pisania:

| Zabronione | Przykład naruszenia | Powód |
| :--- | :--- | :--- |
| **Surowe zapytania SQL** | `db.execute(f"SELECT * FROM...")` | SQL należy wyłącznie do warstwy Repozytorium (Repository) |
| **Logika biznesowa** | `if order.total > 100: discount = 0.1` | Logika biznesowa należy do warstwy Serwisu (Service) |
| **Bezpośrednie wywołania API** | `requests.get("https://api.extern...")` | Zewnętrzne API są obsługiwane przez dedykowanego klienta/serwis |
| **Transformacje danych** | `result = [{"name": r.name} for r in rows]` | Transformacje należą do schematów Pydantic (DTO) |
| **Bezpośrednie I/O na plikach** | `open("data.csv").read()` | Operacje I/O należą do warstwy Repozytorium/Serwisu |

### KROK 3: Wymagana architektura 3-warstwowa

```
┌─────────────────────────────────────────┐
│  ROUTER (router.py)                     │
│  - dekorator @router.*                  │
│  - modele Pydantic (typowanie wej/wyj)  │
│  - Depends() — wstrzykiwanie serwisu    │
│  - HTTPException — obsługa błędów HTTP  │
│  - ZERO logiki biznesowej               │
└──────────────────┬──────────────────────┘
                   │ wywołuje
┌──────────────────▼──────────────────────┐
│  SERWIS (service.py)                    │
│  - Czysta logika biznesowa              │
│  - Operuje na modelach Pydantic         │
│  - Przekazuje zadania do Repozytorium   │
│  - NIE importuje FastAPI ani Request    │
└──────────────────┬──────────────────────┘
                   │ wywołuje
┌──────────────────▼──────────────────────┐
│  REPOZYTORIUM / DANE (repository.py)     │
│  - Zapytania SQL / wywołania ORM        │
│  - Operacje na plikach                  │
│  - Wywołania zewnętrznych API           │
└─────────────────────────────────────────┘
```

**Warstwy muszą nieść realną logikę (zasada anty-ceremonii).** Podział na 3 warstwy ma na celu odizolowanie spraw protokołu HTTP od logiki biznesowej oraz logiki od dostępu do danych — NIE zaś sztuczne nabijanie linii kodu. Serwis, którego całe ciało to pojedyncze przekazanie wywołania (`return repo.get(id)` i nic więcej), nie wnosi wartości i jest ceremonialnym szumem. W takim przypadku MOŻESZ pominąć pustą warstwę serwisu, pod warunkiem odnotowania jasnego, uzasadnionego wyjątku w Dowodzie Architektonicznym (KROK 6), np. *"Pominięto warstwę serwisu — brak logiki biznesowej dla tego odczytu; router wywołuje repozytorium bezpośrednio. Uzasadnienie: czysty odczyt, brak niezmienników."* Router w dalszym ciągu NIE MOŻE zawierać kodu SQL, wywołań zewnętrznych ani I/O — te zawsze trafiają do repozytorium.

### KROK 4: Spójność źródeł danych
Jeśli projekt korzysta z wielu źródeł danych (np. lokalna baza danych + Supabase + zewnętrzne API):
1. **Obsłuż WSZYSTKIE źródła** — nie pomijaj żadnego w nowym endpoincie.
2. **Deduplikacja** — jeśli dane mogą pochodzić z wielu źródeł, usuń duplikaty w oparciu o unikalne klucze (np. id, url_link).
3. **ZAKAZ mocków na produkcji** — nigdy nie zwracaj `[]` ani danych testowych jako fallbacku, gdy usługa zewnętrzna leży. Zgłoś wyjątek lub zwróć odpowiedni status HTTP.

### KROK 5: Obowiązkowa weryfikacja w terminalu
PRZED zatwierdzeniem kodu routera MUSISZ uruchomić:
```bash
grep -n "execute\|select(\|insert(\|update(\|delete(\|requests\.\|open(\|\.read()" <router_file>
```
Jeśli polecenie coś znajdzie — masz naruszenie zasad. Napraw kod PRZED zgłoszeniem gotowości.

### KROK 6: Dowód Architektoniczny (Architectural Proof)
Przed zakończeniem prac nad endpointem MUSISZ spisać formalny dowód:

```markdown
### 🏗️ ARCHITECTURAL PROOF
- **Router:** `router.py` — zawiera WYŁĄCZNIE dekorator, Depends(), typowanie Pydantic, HTTPException.
- **Service:** `service.py` — logika biznesowa przekazana do `<service_method_name>`.
- **Repository:** `repository.py` — zapytania DB przekazane do `<repo_method_name>`.
- **Weryfikacja grep:** Polecenie `grep -n "execute|select|requests" router.py` — wynik: CLEAN (0 wyników).
- **Źródła danych:** Obsłużone: [lista]. Brakujące: [brak / lista].
```

## Dyscyplina zakresu (Scope Discipline)
Zabrania się modyfikowania plików poza warstwą API oraz logiką niezbędną do obsługi danego endpointu (np. `router.py`, `service.py`, `repository.py`, schematy Pydantic). Nie wolno "przy okazji" poprawiać ani refaktoryzować innych endpointów, o których edycję użytkownik nie prosił.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Endpoint jest gotowy TYLKO wtedy, gdy:
- [ ] Router nie zawiera logiki biznesowej, zapytań SQL ani bezpośrednich wywołań API — dowód: wynik `grep -n "execute\|select(\|insert(\|update(\|delete(\|requests\.\|open(" <router.py>` zwraca **0 wyników**.
- [ ] Wszystkie dane wejściowe/wyjściowe są typowane modelami Pydantic — dowód: wynik `grep -n "def.*-> dict\|def.*-> list\|return {" <router.py>`. Każdy wynik musi wynosić EITHER zero OR być udokumentowanym wyjątkiem (np. endpoint `/health` zwracający mały `dict` jest akceptowalny, o ile odnotowano to w Dowodzie Architektonicznym). Nie twórz sztucznych modeli dla trywialnych odpowiedzi tylko po to, by uzyskać 0 wyników — to zbędna ceremonia.
- [ ] Serwis jest wstrzykiwany przez `Depends()` — dowód: wynik `grep -n "Depends(" <router.py>` zwraca **≥1 wynik** na każdy endpoint.
- [ ] Dowód Architektoniczny został wygenerowany w formacie z KROKU 6 (wraz z nazwami warstw i wynikami grep).
- [ ] Spójność źródeł danych została zachowana — dowód: agent wypisał obsłużone źródła i potwierdził brak mocków (jeśli dotyczy).
- [ ] Agent wprost oświadczył: "Thin Router verification complete. Router `<name>` has X endpoints, 0 violations, 3-layer architecture confirmed."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "To prosty endpoint, umieszczę zapytanie do bazy bezpośrednio w routerze." | **ODRZUCONO.** Kod SQL/ORM/IO nigdy nie trafia do routera — przenieś go do repozytorium. (Jeśli brak logiki, warstwę serwisu można pominąć zgodnie z zasadą anty-ceremonii, ale dostęp do danych i tak opuszcza router). |
| "Użyję zwykłego słownika zamiast modelu Pydantic dla tej szybkiej odpowiedzi." | **ODRZUCONO.** Wszystkie dane wejścia/wyjścia muszą być ściśle typowane modelami Pydantic. |
| "Nie ma sensu tworzyć osobnego repozytorium dla jednego zapytania." | **ODRZUCONO dla I/O.** Operacje SQL/ORM/wywołania zewnętrzne zawsze należą do repozytorium, niezależnie od rozmiaru. Warstwę serwisu bez logiki można jednak pominąć — odnotuj to w Dowodzie Architektonicznym. Zachowaj warstwę danych; odrzuć tylko pustą ceremonię. |
| "Zwrócenie pustego obiektu jako fallback w razie awarii jest w porządku." | **ODRZUCONO.** Zakaz stosowania mocków na produkcji. Zgłoś wyjątek lub zwróć kod HTTP 503. |
