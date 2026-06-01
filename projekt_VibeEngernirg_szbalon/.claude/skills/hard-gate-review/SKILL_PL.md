---
name: Podwójna Weryfikacja (Hard Gate)
description: >
  Implementuje rygorystyczny mechanizm samokrytyki (self-review) i "Hard Gate".
  Agent musi przejść przez zmianę persony, odpowiedzieć na konkretne pytania
  adversarialne, wygenerować ustrukturyzowany werdykt (security_ok, performance_ok,
  quality_ok) i spełnić twarde kryteria wyjścia. Przy FAIL — max 1 próba poprawy,
  potem STOP i pytaj użytkownika.
---

# Podwójna Weryfikacja i Hard Gate (2x Check)

## Wyzwalacz (Trigger)
- Aktywne przy KAŻDYM zadaniu, które wymaga pisania lub modyfikowania kodu.

## Procedura

Zamiast napisać kod i uznać zadanie za "gotowe", MUSISZ przejść przez 4-fazowy przepływ pracy:

### Faza 1: Implementacja
1. Napisz kod zgodnie z ustalonym planem.
2. Upewnij się, że kod kompiluje/uruchamia się bez błędów.

### Faza 2: Zmiana Persony — Adversarial Review
1. **STOP.** Nie jesteś już Programistą. Jesteś teraz **Niezależnym Audytorem ds. Bezpieczeństwa i Jakości**.
2. MUSISZ odpowiedzieć na KAŻDE z poniższych pytań adversarialnych. Nie pomijaj żadnego:

| # | Pytanie Adversarialne | Twoja Odpowiedź (MUSISZ wypełnić) |
| :--- | :--- | :--- |
| 1 | Gdybym był złośliwym aktorem, **jaki input spowodowałby crash lub wyciek danych?** | [Twoja analiza] |
| 2 | **Która walidacja brakuje?** Czy każde wejście jest walidowane zanim dotrze do logiki? | [Twoja analiza] |
| 3 | **Gdzie ten kod wybuchnie przy 1000 równoczesnych requestach?** Czy jest race condition? | [Twoja analiza] |
| 4 | **Czy wyjątki są obsługiwane poprawnie?** Czy `except` łapie konkretne typy? Czy ma `exc_info=True`? | [Twoja analiza] |
| 5 | **Czy kod jest odporny na Prompt Injection?** (jeśli dotyczy LLM/AI) Czy user input jest sanityzowany? | [Twoja analiza / N/D] |
| 6 | **Czy usunąłem wszystkie tymczasowe print()/debug logi?** | [TAK / NIE — lista] |

### Faza 3: Ustrukturyzowany Werdykt
Po odpowiedzeniu na pytania, MUSISZ wygenerować werdykt w DOKŁADNIE tym formacie:

```markdown
### 🧪 2x CHECK — WERDYKT

| Wymiar | Status | Uzasadnienie |
| :--- | :--- | :--- |
| 🔒 Security | ✅ OK / ❌ FAIL | [krótkie uzasadnienie] |
| ⚡ Performance | ✅ OK / ❌ FAIL | [krótkie uzasadnienie] |
| 📝 Quality | ✅ OK / ❌ FAIL | [krótkie uzasadnienie] |

- **Znalezione luki:** [Brak / Lista problemów z severity CRITICAL/HIGH/MEDIUM/LOW]
- **Pewność (Confidence):** [0.0 — 1.0] (jak bardzo jesteś pewny, że kod jest poprawny)
- **Decyzja:** PASS / FAIL
```

### Faza 4: Hard Gate (Twarda Bramka)

```
                    ┌────────────────┐
                    │  Werdykt PASS? │
                    └───────┬────────┘
                     TAK ───┤──── NIE
                     │      │
                     ▼      ▼
                  ✅ GOTOWE  🔁 JEDNA próba poprawy
                             │
                             ▼
                    ┌────────────────┐
                    │  Ponowny 2x    │
                    │  Check         │
                    └───────┬────────┘
                     PASS ──┤── FAIL
                     │      │
                     ▼      ▼
                  ✅ GOTOWE  🛑 HARD GATE STOP
                             │
                             ▼
                    Pytaj użytkownika o wytyczne.
                    ZAKAZ dalszego kodowania.
```

**Zasady HARD GATE:**
1. Masz prawo do dokładnie **JEDNEJ (1)** próby samodzielnej poprawy kodu.
2. Po poprawce MUSISZ ponownie przejść Fazę 2 i 3 (nowy werdykt).
3. Jeśli po 1 poprawce werdykt nadal jest FAIL:
   - **ZATRZYMAJ SIĘ NATYCHMIAST.**
   - Napisz: `🛑 HARD GATE: Kod nie przeszedł podwójnej weryfikacji po auto-poprawie. Zatrzymuję pracę. Proszę o wytyczne.`
   - Wylistuj konkretne problemy, których nie udało się naprawić.
   - **MASZ SUROWY ZAKAZ** cichego ignorowania problemów lub "przepychania" błędnego kodu.

## Scope Discipline (Dyscyplina Zasięgu)
Gdy poprawiasz kod po negatywnym wyniku 2x Check (FAIL), MASZ ZAKAZ modyfikowania plików innych niż ten, który właśnie napisałeś. Nie wolno Ci "przy okazji" refaktoryzować sąsiednich modułów ani zmieniać architektury pod pretekstem poprawy bezpieczeństwa. 

## Twarde Kryteria Wyjścia (Exit Criteria)
Zadanie jest skończone TYLKO gdy:
- [ ] Wszystkie 6 pytań adversarialnych ma jawne odpowiedzi (żadne nie jest pominięte).
- [ ] Ustrukturyzowany werdykt jest wygenerowany w powyższym formacie (tabela Security/Performance/Quality).
- [ ] Werdykt brzmi PASS (lub PASS po 1 auto-poprawce).
- [ ] Agent uruchomił testy (`pytest` lub `python -c "from ... import ..."`) i wkleił output jako dowód poprawności. Jeśli testy PASS → pewność potwierdzona. Jeśli brak testów w projekcie → agent MUSI uruchomić przynajmniej test importu i test startowy (`python -W all main.py --help`).
- [ ] Pytanie #6 (debug logi) jest poparte dowodem: output komendy `grep -n "print(\|breakpoint()\|pdb\." <zmodyfikowane_pliki>` → **0 trafień**.
- [ ] Agent jawnie napisał: "2x Check zakończony. Przeszedł X/6 pytań bez uwag, znaleziono Y problemów, werdykt: PASS/FAIL."

## Tabela Anty-Racjonalizacji
| Racjonalizacja | Akcja Agenta |
| --- | --- |
| "Jestem zaawansowanym AI, mój kod jest pewnie dobry za pierwszym razem." | **ODRZUCONO.** Modele AI mają udokumentowane ślepe plamki (blind spots). Jesteś zmuszony do pełnej samokrytyki za każdym razem. |
| "Użytkownik czeka, pominę review żeby było szybciej." | **ODRZUCONO.** Bezpieczeństwo > Szybkość. Hard Gate jest niepodważalny. |
| "Odpowiedziałem na 4 z 6 pytań, reszta jest oczywista." | **ODRZUCONO.** Wszystkie 6 pytań jest obowiązkowych. Pominięcie = naruszenie procedury. |
| "Pewność 0.6 wystarczy, kod chyba działa." | **ODRZUCONO.** Confidence < 0.8 wymaga jawnego uzasadnienia i ewentualnego zatrzymania pracy. |
