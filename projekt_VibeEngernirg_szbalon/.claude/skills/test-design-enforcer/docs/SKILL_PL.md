---
name: test-design-enforcer
description: >
  Wymusza świadome PROJEKTOWANIE testów przed uznaniem nietrywialnego kodu za ukończony — stop pustemu nabijaniu pokrycia.
  Agent musi wypisać przypadki testowe (happy path, brzegowe, ścieżki błędów, współbieżność), napisać testy,
  uruchomić je i udowodnić, że zestaw testów faktycznie zgłosi błąd, gdy kod zostanie uszkodzony (manualna mutacja).
  Wymusza piramidę testów i zabrania testów bez asercji.
version: 1.0.0
---

# Test Design Enforcer (Świadome Projektowanie Testów, a nie Teatr Pokrycia Kodu)

Jesteś starszym inżynierem (Senior Engineer), który wie, że miarą dojrzałości projektu nie są wskazówki typów (type hints) — lecz zestaw testów. Procent pokrycia kodu to metryka próżności: 90% pokrycia przy słabych asercjach niczego nie dowodzi. Twoim zadaniem jest zmusić agenta do PROJEKTOWANIA testów (co może pójść nie tak, gdzie są wartości brzegowe, jak system zachowa się przy awarii i współbieżności), napisania ich, uruchomienia oraz udowodnienia, że faktycznie wykryłyby one błędy.

**Test, który nie może zakończyć się niepowodzeniem, to zbędny kod.** Każdy test musi mieć sensowną asercję i musi wskazywać błąd (fail), gdy zachowanie, które chroni, ulegnie uszkodzeniu.

## Wyzwalacz (Trigger)

- Aktywny przy KAŻDYM zadaniu polegającym na pisaniu lub modyfikowaniu nietrywialnej logiki (rozgałęzienia, obliczenia, zmiany stanu, orkiestracja I/O, walidacja, wszystko z przypadkami brzegowymi).
- Użytkownik mówi "write tests", "add tests", "is this tested", "TDD", "increase coverage".
- NIE jest wymagany dla czystego boilerplate'u bez logiki (zwykły DTO, stała) — opisz to zwolnienie wprost zamiast pisać puste testy.

## Relacja z innymi skillami

- Działa równolegle z implementacją; łączy się z `hard-gate-review` (odpowiada na pytanie "czy ścieżka błędu ma swój test?") oraz `incident-debugging` (każda poprawka błędu wymaga testu regresyjnego — ten skill definiuje jego strukturę).
- Próg pokrycia kodu jest kontrolowany przez `python-quality-gate` (`--cov-fail-under`); ten skill dba o *jakość* testów, której pokrycie nie potrafi zmierzyć.
- Respektuj `simplicity-gate`: nie projektuj nadmiernie skomplikowanych testów (brak rozbudowanych fixture'ów dla jednolinijkowej czystej funkcji).

## Procedura

### KROK 1: Wypisz przypadki testowe PRZED napisaniem testów
Dla testowanej jednostki kodu stwórz jawną listę przypadków (to jest krok projektowy):

| # | Kategoria | Przypadek testowy | Oczekiwane zachowanie |
| :-- | :-- | :-- | :-- |
| 1 | Ścieżka optymistyczna (Happy path) | typowe poprawne dane | poprawny wynik |
| 2 | Wartość brzegowa (Boundary) | puste / zero / max / przesunięcie o jeden | zdefiniowane zachowanie |
| 3 | Ścieżka błędu (Error path) | niepoprawne dane / awaria zależności | rzuca / zwraca błąd, brak cichego tłumienia |
| 4 | Współbieżność (jeśli dotyczy) | równoległe wywołania / wyścig | brak uszkodzenia danych / poprawne blokady |

Zasady:
- Każde rozgałęzienie kodu (`if`/`else`/`except`) wymaga co najmniej jednego przypadku, który je uruchamia.
- Każdy zgłaszany wyjątek wymaga testu potwierdzającego jego rzucenie z poprawnym typem.
- Dla wartości brzegowych używaj klas równoważności, a nie losowych wartości.

### KROK 2: Napisz testy
- Używaj `pytest`. Jedno zachowanie na test; opisowe nazwy (np. `test_withdraw_rejects_amount_above_balance`).
- Używaj `pytest.raises(SpecificError)` dla ścieżek błędów — nigdy gołego `Exception`.
- Parametryzuj przypadki brzegowe / klasy równoważności (`@pytest.mark.parametrize`).
- Dla nietrywialnej, czystej logiki dodaj co najmniej jeden test bazujący na właściwościach (property-based test) z użyciem biblioteki Hypothesis tam, gdzie to pasuje (niezmienniki, które muszą zachodzić dla wszystkich danych wejściowych).
- Mockuj tylko na rzeczywistych granicach systemu (DB, HTTP, zegar). NIE mockuj samej testowanej jednostki.

### KROK 3: Uruchom testy i udowodnij, że przechodzą
```bash
uv run pytest <test_file> -v
```
Wklej wynik z terminala. Wszystkie docelowe testy świecą na zielono.

### KROK 4: Udowodnij, że testy potrafią zgłosić BŁĄD (weryfikacja jakości asercji)
Zielone testy to za mało — udowodnij, że mają zęby. Wykonaj JEDNO z poniższych działań:
- **Ręczna mutacja (Manual mutation):** tymczasowo zepsuj testowany kod (odwróć znak porównania, zwróć błędną stałą), uruchom testy i pokaż, że odpowiedni test ZGŁASZA BŁĄD (fails). Następnie przywróć kod. Wklej oba wyniki z terminala (test przechodzący i test wykazujący błąd).
- **Testowanie mutacyjne (dla krytycznych modułów):** uruchom `uv run mutmut run` (lub `cosmic-ray`) i zaraportuj ocalałe mutanty. Ocalałe mutanty to martwe punkty asercji, które należy zaadresować.
- Test, który nadal przechodzi, mimo że kod został celowo uszkodzony, jest bezwartościowy — popraw jego asercje.

## Format raportu (Output Format)
```markdown
### 🧪 TEST DESIGN — REPORT

**Unit:** `<module.function>`

**Case matrix:** [tabela z KROKU 1]

| Kontrola | Status | Dowód |
| :-- | :-- | :-- |
| Pokrycie wszystkich rozgałęzień | ✅ / ⚠️ [brakujące] | lista przypadków ↔ rozgałęzienia |
| Ścieżki błędów weryfikują wyjątki | ✅ / ❌ | obecność `pytest.raises` |
| Parametryzacja wartości brzegowych | ✅ / N/A | kod testu |
| Testy przechodzą pomyślnie | ✅ | wynik `pytest -v` |
| Testy potrafią wykazać BŁĄD (mutacja) | ✅ | wynik po celowym popsuciu kodu (czerwony test) |

**Werdykt:** TESTY WARTOŚCIOWE (MEANINGFUL) / WYMAGA PRACY: [czego brakuje]
```

## Dyscyplina zakresu (Scope Discipline)
Piszesz testy WYŁĄCZNIE dla kodu objętego bieżącym zadaniem. Nie przepisujsz testowanego kodu tylko po to, by ułatwić sobie zaliczenie testu (jeśli kod wymaga refaktoryzacji pod kątem testowalności — zgłoś to). Nie usuwasz ani nie osłabiasz istniejących testów, aby sztucznie zazielenić cały zestaw.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Macierz przypadków testowych z KROKU 1 została spisana (happy path / boundary / error / concurrency).
- [ ] Każde rozgałęzienie i każdy zgłaszany wyjątek w jednostce kodu ma odpowiadający mu test.
- [ ] Uruchomiono `uv run pytest <file> -v` — wynik wklejony, docelowe testy zielone.
- [ ] Zęby testów zostały udowodnione: celowe uszkodzenie kodu zaowocowało czerwonym testem (wynik wklejony) LUB uruchomiono testy mutacyjne i przedstawiono ocalałe mutanty.
- [ ] Brak testów bez asercji, brak testów wyjątków z użyciem gołego `Exception`, brak mockowania samej testowanej jednostki.
- [ ] Agent wprost oświadczył: "Test Design complete. Unit `<name>`: N cases, all branches covered, error paths assert exceptions, tests proven to fail on regression."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Pokrycie wynosi 90%, więc kod jest dobrze przetestowany." | **ODRZUCONO.** Pokrycie mierzy wykonane linie kodu, a nie zweryfikowane zachowania. Udowodnij, że testy zgłaszają błąd, gdy kod zostanie celowo uszkodzony. |
| "Ścieżka optymistyczna przechodzi, to wystarczy." | **ODRZUCONO.** Przypadki brzegowe i ścieżki błędów to miejsca, gdzie najczęściej kryją się bugi. Zdefiniuj je i przetestuj. |
| "Po prostu sprawdzę, czy kod nie rzuca wyjątku (no throw)." | **ODRZUCONO.** Test bez asercji konkretnego zachowania/wyniku to atrapa. Sprawdź rzeczywisty rezultat. |
| "Przechwyciłem błąd za pomocą `pytest.raises(Exception)`." | **ODRZUCONO.** Zawsze sprawdzaj konkretny typ wyjątku, w przeciwnym razie zamaskujesz nieoczekiwany błąd. |
| "Zmockuję funkcję testowaną, żeby test przeszedł." | **ODRZUCONO.** Mockuj zależności wyłącznie na granicach systemu. Mockowanie funkcji testowanej sprawia, że test niczego nie sprawdza. |
| "Dowodzenie skuteczności testu przez jego popsucie to przesada." | **ODRZUCONO.** Test, który nie może wykazać błędu, jest bezwartościowy. Udowodnij jego działanie chociaż raz. |
| "Ten kod jest prosty, nie potrzebuje testów." | **CZĘŚCIOWO ODRZUCONO.** Jeśli kod jest naprawdę trywialny (brak logiki), napisz to wprost — NIE twórz pustych testów-atrap tylko po to, by wyglądać profesjonalnie. |
