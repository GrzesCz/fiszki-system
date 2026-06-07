---
name: hard-gate-review
description: >
  Wdraża rygorystyczny mechanizm samooceny i "Twardej Bramki" (Hard Gate). Agent musi
  dokonać zmiany persony, odpowiedzieć na konkretne pytania testowe (adversarial questions),
  wygenerować strukturyzowany werdykt (security_ok, performance_ok, quality_ok) i spełnić twarde
  kryteria wyjścia. W przypadku porażki (FAIL) — maksymalnie 1 próba naprawy, a potem STOP i pytanie do użytkownika.
version: 1.0.0
---

# Hard Gate & 2x Check (Podwójna Weryfikacja i Twarda Bramka)

## Wyzwalacz (Trigger)

- Aktywny przy WSZYSTKICH zadaniach polegających na pisaniu lub modyfikowaniu kodu.

## Procedura

Zamiast pisać kod i natychmiast uznawać zadanie za "wykonane", MUSISZ przejść przez poniższy 4-fazowy proces:

### Faza 1: Implementacja
1. Napisz kod zgodnie z ustalonym planem.
2. Upewnij się, że kod kompiluje się i uruchamia bez błędów.

### Faza 2: Zmiana Persony — Ocena Kontradyktoryjna (Adversarial Review)
1. **STOP.** Nie jesteś już Programistą. Jesteś teraz **Niezależnym Audytorem Bezpieczeństwa i Jakości**.
2. MUSISZ odpowiedzieć na KAŻDE z poniższych pytań testowych. Nie pomijaj żadnego:

| # | Pytanie Kontradyktoryjne | Twoja Odpowiedź (MUSISZ uzupełnić) |
| :--- | :--- | :--- |
| 1 | Gdybym był złośliwym aktorem, **jakie dane wejściowe spowodowałyby awarię (crash) lub wyciek danych?** | [Twoja analiza] |
| 2 | **Jakiej walidacji brakuje?** Czy każde dane wejściowe są walidowane przed trafieniem do logiki? | [Twoja analiza] |
| 3 | **W którym miejscu kod wyłoży się przy 1000 jednoczesnych żądań?** Czy występuje wyścig (race condition)? | [Twoja analiza] |
| 4 | **Czy wyjątki są prawidłowo obsługiwane?** Czy `except` przechwytuje konkretne typy? Czy zawiera `exc_info=True`? | [Twoja analiza] |
| 5 | **Czy kod jest odporny na Prompt Injection?** (jeśli dotyczy LLM/AI) Czy dane użytkownika są oczyszczane? | [Twoja analiza / N/A] |
| 6 | **Czy usunąłem wszystkie tymczasowe instrukcje print() i logi debugowania?** | [TAK / NIE — wypisz] |
| 7 | **Co mogę USUNĄĆ bez straty wymagań funkcjonalnych?** Która abstrakcja ma mniej niż 2 rzeczywiste miejsca wywołania? Który blok try/except obsługuje niemożliwą ścieżkę błędu? | [Twoja analiza] |

### Faza 3: Strukturyzowany Werdykt
Po udzieleniu odpowiedzi na pytania, MUSISZ wygenerować werdykt w DOKŁADNIE poniższym formacie:

```markdown
### 🧪 2x CHECK — VERDICT

| Wymiar | Status | Uzasadnienie |
| :--- | :--- | :--- |
| 🔒 Bezpieczeństwo (Security) | ✅ OK / ❌ FAIL | [krótkie uzasadnienie] |
| ⚡ Wydajność (Performance) | ✅ OK / ❌ FAIL | [krótkie uzasadnienie] |
| 📝 Jakość (Quality) | ✅ OK / ❌ FAIL | [krótkie uzasadnienie] |
| ✂️ Prostota (Simplicity) | ✅ OK / ❌ FAIL | [spekulatywne abstrakcje / nieosiągalne warunki / nadmiarowe komentarze — brak lub lista] |

- **Wykryte podatności:** [Brak / Lista problemów wraz z poziomem krytyczności CRITICAL/HIGH/MEDIUM/LOW]
- **Poziom pewności (Confidence):** [0.0 — 1.0] (jak bardzo jesteś pewien poprawności kodu)
- **Decyzja:** PASS / FAIL
```

### Faza 4: Twarda Bramka (Hard Gate)

```
                    ┌────────────────┐
                    │ Werdykt PASS?  │
                    └───────┬────────┘
                     TAK ───┤──── NIE
                      │     │
                      ▼     ▼
                   ✅ DONE  🔁 JEDNA próba naprawy
                            │
                            ▼
                    ┌────────────────┐
                    │ Ponowna        │
                    │ Weryfikacja 2x │
                    └───────┬────────┘
                     PASS ──┤── FAIL
                      │     │
                      ▼     ▼
                   ✅ DONE  🛑 HARD GATE STOP
                            │
                            ▼
                    Poproś użytkownika o wskazówki.
                    Kategoryczny ZAKAZ dalszego pisania kodu.
```

**Zasady TWARDEJ BRAMKI (HARD GATE Rules):**
1. Masz prawo do dokładnie **JEDNEJ (1)** próby samodzielnej poprawy kodu.
2. Po wprowadzeniu poprawki MUSISZ ponownie przejść przez Fazę 2 i 3 (nowy werdykt).
3. Jeśli po jednej poprawce werdykt nadal brzmi FAIL:
   - **NATYCHMIAST PRZERWIJ PRACĘ.**
   - Napisz: `🛑 HARD GATE: Kod nie przeszedł podwójnej weryfikacji po automatycznej poprawce. Przerywam pracę. Proszę o wskazówki.`
   - Wypisz konkretne, nierozwiązane problemy.
   - Masz **BEZWZGLĘDNY ZAKAZ** ignorowania problemów lub zatwierdzania niedziałającego kodu.

## Dyscyplina zakresu (Scope Discipline)
Podczas poprawiania kodu po negatywnym wyniku Podwójnej Weryfikacji (FAIL), kategorycznie ZABRANIA się modyfikowania plików innych niż ten, który właśnie napisałeś. Nie wolno dokonywać "przy okazji" refaktoryzacji sąsiednich modułów ani zmieniać architektury pod pretekstem poprawy bezpieczeństwa.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Udzielono jasnych odpowiedzi na wszystkie 7 pytań kontradyktoryjnych (żadne nie zostało pominięte).
- [ ] Strukturyzowany werdykt został wygenerowany w powyższym formacie (tabela Bezpieczeństwo/Wydajność/Jakość/Prostota).
- [ ] Werdykt końcowy brzmi PASS (lub PASS po 1 poprawce).
- [ ] Agent uruchomił testy (`pytest` lub `python -c "from ... import ..."`) i wkleił wynik jako dowód poprawności. Jeśli testy przechodzą pomyślnie -> pewność potwierdzona. Jeśli w projekcie nie ma testów -> agent MUSI uruchomić co najmniej test importu i test startowy (`python -W all main.py --help`).
- [ ] Pytanie nr 6 (logi debugowania) zostało poparte dowodem: wynik polecenia `grep -n "print(\|breakpoint()\|pdb\." <modified_files>` zwraca **0 wyników**.
- [ ] Agent wprost oświadczył: "2x Check complete. Passed X/7 questions without issues, found Y problems, verdict: PASS/FAIL."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Jestem zaawansowanym AI, mój kod zapewne jest poprawny za pierwszym razem." | **ODRZUCONO.** Modele AI mają udokumentowane martwe punkty. Za każdym razem MUSISZ przeprowadzić pełną samoocenę. |
| "Użytkownik czeka, pominę przegląd, żeby było szybciej." | **ODRZUCONO.** Bezpieczeństwo > Szybkość. Twarda bramka nie podlega negocjacjom. |
| "Odpowiedziałem na 5 z 7 pytań, reszta jest oczywista." | **ODRZUCONO.** Wszystkie 7 pytań jest obowiązkowych. Pominięcie = naruszenie procedury. |
| "Pewność na poziomie 0.6 jest wystarczająca, kod zapewne działa." | **ODRZUCONO.** Pewność < 0.8 wymaga wyraźnego uzasadnienia i potencjalnego wstrzymania prac. |
