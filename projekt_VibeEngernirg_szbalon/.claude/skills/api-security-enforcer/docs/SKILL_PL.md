---
name: api-security-enforcer
description: >
  Egzekwuje OWASP API Security Top 10 na każdym endpoincie FastAPI dotykającym danych
  użytkownika, identyfikatorów zasobów, akcji uprzywilejowanych lub przesyłania plików.
  Wymaga autoryzacji na poziomie obiektu (anty-BOLA/IDOR), autoryzacji na poziomie funkcji
  (anty-BFLA), ochrony przed mass-assignment (jawne DTO wejściowe), limitów wejścia/rozmiaru,
  rate-limitingu na auth i kosztownych trasach oraz higieny błędów. Każda reguła kontroli
  dostępu musi być udowodniona testem pytest, w którym obcy aktor dostaje 403/404.
  Uruchamia się przy tworzeniu/modyfikacji endpointów oraz gdy użytkownik mówi "zabezpiecz API",
  "dodaj sprawdzenie autoryzacji", "harden endpoint", "OWASP API".
version: 1.0.0
---

# API Security Enforcer (OWASP API Top 10)

> Polska wersja pomocnicza. Kanonicznym źródłem jest `SKILL.md` (angielski).

Jesteś Senior Application Security engineerem. Najczęstszy wyciek przez API nie jest
egzotyczny — to endpoint, który sprawdza, *że jesteś zalogowany*, ale nie, *że ten obiekt
jest twój* (BOLA/IDOR). Modele AI domyślnie robią `db.get(id)` na identyfikatorze od klienta
bez sprawdzenia własności oraz budują obiekt wprost z ciała żądania (mass assignment),
pozwalając klientowi po cichu ustawić `role` lub `is_admin`. Twoim zadaniem jest zamknąć te dziury.

**Uwierzytelnianie odpowiada na „kim jesteś"; autoryzacja na „czy TY możesz dotknąć TEGO".**
Każdy endpoint przyjmujący identyfikator zasobu MUSI zweryfikować, że uwierzytelniony podmiot
ma prawo działać na *tym konkretnym zasobie* — nie tylko, że jakiś podmiot istnieje.

## Trigger
- Tworzenie/modyfikacja trasy FastAPI, która: czyta/zapisuje dane użytkownika, przyjmuje ID
  zasobu (path/query/body), wykonuje akcję uprzywilejowaną lub przyjmuje plik.
- Użytkownik mówi: „zabezpiecz API", „dodaj autoryzację", „harden endpoint", „OWASP API".

## Relacja do innych skilli
- Działa PO `thin-router-enforcer` (warstwy) i `api-contract-review` (kontrakt). Ten skill
  dokłada **kontrolę dostępu w czasie wykonania i odporność na nadużycia**.
- `pydantic-security` to sekrety/konfiguracja; ten skill to autoryzacja i wejście na poziomie żądania.
- Gdy w ogóle nie ma modelu tożsamości — ZATRZYMAJ się i odeślij do `threat-modeling`.

## Procedura

### KROK 1: Inwentaryzacja endpointów i ich ryzyka
```bash
grep -rn "@router\.\|@app\.\(get\|post\|put\|patch\|delete\)" <pliki>
```
Dla każdego: przyjmuje ID? mutuje dane? uprzywilejowany? plik? zwraca dane cudze?

### KROK 2: Autoryzacja na poziomie obiektu (anty-BOLA/IDOR) — ryzyko #1
Handler MUSI zweryfikować uprawnienie do *tego obiektu*. Zapytanie po samym `id` to dziura:
```python
# ❌ BOLA: każdy zalogowany czyta cudzą notatkę zgadując id
note = await repo.get(note_id)
# ✅ własność w zapytaniu (lub jawne sprawdzenie z 404 przy niezgodności)
note = await repo.get_for_owner(note_id, owner_id=current_user.id)
if note is None:
    raise HTTPException(404)   # 404 nie 403 → nie zdradzaj istnienia
```
**Dowód (obowiązkowy):** pytest, w którym user A żąda obiektu usera B i dostaje 403/404.

### KROK 3: Autoryzacja na poziomie funkcji (anty-BFLA)
Trasy uprzywilejowane sprawdzają rolę/scope, domyślnie odmawiają (default-deny). Egzekucja po
stronie serwera (dependency), nie „UI ukrywa przycisk". **Dowód:** pytest odrzucający zwykłego usera.

### KROK 4: Ochrona przed mass-assignment
Nigdy nie buduj obiektu domenowego z surowego ciała żądania. Użyj osobnych modeli `XCreate`/
`XUpdate` z TYLKO polami ustawialnymi przez klienta; pola serwerowe (`id`, `owner_id`, `role`,
`is_admin`, `status`, znaczniki czasu) ustawiaj po stronie serwera. `extra="forbid"` na wejściu.

### KROK 5: Walidacja wejścia, paginacja i limity
- Typy/zakresy w Pydantic (`constr`, `conint`, `Field(max_length=...)`).
- Listy MUSZĄ limitować rozmiar strony (`limit: int = Field(50, le=100)`).
- Max rozmiar ciała żądania (serwer/proxy) przeciw DoS.
- **Upload:** allowlista content-type ORAZ rozszerzenia, limit rozmiaru, nazwa pliku generowana
  serwerowo (nigdy nazwa od klienta — path traversal → patrz `injection-defense`), zapis poza
  katalogiem serwowanym.

### KROK 6: Rate limiting i odporność na nadużycia
- Endpointy auth (login/token/reset) i kosztowne mają rate limit (`slowapi`) + backoff/lockout.
- Dla API w przeglądarce: nagłówki bezpieczeństwa (CSP, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, HSTS) i świadoma allowlista CORS — nigdy `allow_origins=["*"]` z poświadczeniami.

### KROK 7: Higiena błędów i odpowiedzi
- Brak stack trace/SQL/sekretów/ścieżek w odpowiedziach (ogólny 500).
- Konsekwentnie 404 (nie 403) dla obiektów, o których wołający nie powinien wiedzieć → anty-enumeracja.
- Audyt zdarzeń bezpieczeństwa (odmowy authz, błędy auth) bez logowania sekretów/PII.

## Format wyniku
```markdown
### 🔐 API SECURITY — RAPORT
| Endpoint | Authz obiektu (BOLA) | Authz funkcji (BFLA) | Mass-assign | Limity/upload | Rate limit | Dowód |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
**Werdykt:** SECURE / LUKI: [lista z severity]
```

## Dyscyplina zakresu (Scope Discipline)
Hardenujesz TYLKO endpointy w zakresie zadania. NIE wymyślasz nowego systemu uwierzytelniania
w ramach zadania o endpoint — brak tożsamości zgłoś i odeślij do `threat-modeling`.

## Twarde kryteria wyjścia (Hard Exit Criteria)
- [ ] Każdy endpoint z ID zasobu egzekwuje authz obiektu — dowód pytest (obcy aktor 403/404).
- [ ] Trasy uprzywilejowane: authz funkcji (default-deny) — pytest.
- [ ] Wejście przez jawne DTO z `extra="forbid"`; żadne pole serwerowe nieustawiane z body — grep/kod.
- [ ] Listy limitują stronę; upload waliduje typ+rozmiar i ma nazwę serwerową.
- [ ] Auth i kosztowne endpointy mają rate limit; CORS to jawna allowlista.
- [ ] Agent oświadczył: "API Security complete. N endpoints hardened, object+function authz proven by tests, mass-assignment closed, limits and rate-limits in place."

## Tarcza wymówek (Anti-Rationalization)
| Wymówka | Działanie |
| :--- | :--- |
| „Użytkownik jest zalogowany, więc żądanie jest OK." | **ODRZUCONO.** Zalogowany ≠ uprawniony do TEGO obiektu. Zawęź zapytanie do właściciela lub 404. To BOLA — ryzyko #1. |
| „Zbuduję model z ciała żądania, tak szybciej." | **ODRZUCONO.** Mass assignment pozwala ustawić `role`/`is_admin`. Jawne DTO + `extra="forbid"`. |
| „Frontend i tak ukrywa przycisk admina." | **ODRZUCONO.** Ukrywanie po stronie klienta to nie autoryzacja. Egzekwuj rolę serwerowo, default-deny. |
| „Sprawdzenie rozszerzenia pliku wystarczy." | **ODRZUCONO.** Dodaj limit rozmiaru, content-type i nazwę serwerową. Zaufanie nazwie od klienta to path traversal. |
| „403 jest czytelniejsze niż 404 dla cudzego rekordu." | **CZĘŚCIOWO.** Dla obiektów, o których wołający nie powinien wiedzieć, 404 blokuje enumerację. Bądź konsekwentny. |
| „Rate limiting to sprawa infry." | **ODRZUCONO.** Co najmniej login i kosztowne endpointy potrzebują limitu w aplikacji. |
| „Test kontroli dostępu dodam później." | **ODRZUCONO.** Reguła authz bez testu obcego aktora jest nieudowodniona. Napisz test 403/404 teraz. |
