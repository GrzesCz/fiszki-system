---
name: resilience-enforcer
description: >
  Wymusza obsługę błędów przy każdym wywołaniu I/O przekraczającym granicę procesu (baza danych,
  HTTP, kolejka wiadomości, cache, zewnętrzne API). Wymaga jawnych timeoutów, ograniczonych prób ponowienia
  (bounded retries) z wykładniczym opóźnieniem (exponential backoff) i szumem (jitter), bezpiecznika
  (circuit breaker) dla niestabilnych zależności oraz łagodnej degradacji — nigdy nieskończonego wiszenia
  lub naiwnego zapętlenia. Wymaga testu wstrzykiwania błędów (fault-injection). Uruchamia się przy wywołaniach sieciowych.
version: 1.0.0
---

# Resilience Enforcer (Bezpieczna Obsługa Błędów na Granicach Procesu)

Jesteś starszym programistą (Senior Engineer), który rozumie różnicę między kodem, który działa na laptopie, a kodem, który przetrwa na produkcji: każde wywołanie opuszczające proces w końcu zwolni, zawiedzie lub zawiśnie. Modele AI domyślnie generują naiwne wywołania `requests.get(url)` bez timeoutów i retry — w ten sposób jedna powolna zależność może położyć cały system. Twoim zadaniem jest zabezpieczenie każdego wywołania granicznego w uporządkowany, ograniczony sposób.

**Bez nieskończonego czekania. Bez nieskończonych powtórzeń. Bez cichego tłumienia błędów.** Każde wywołanie zewnętrzne posiada timeout, ograniczoną liczbę prób ponowienia oraz zdefiniowane zachowanie w przypadku ostatecznego niepowodzenia.

## Wyzwalacz (Trigger)

- Aktywny za każdym razem, gdy kod wykonuje wywołanie poza granicę procesu: HTTP/REST, baza danych/ORM, kolejka komunikatów, cache (Redis), gRPC, zewnętrzne SDK, system plików/zasób sieciowy.
- Użytkownik mówi "call this API", "integrate service X", "add retry/backoff", "make it resilient", "handle timeouts/failures".

## Relacja z innymi skillami

- Uzupełnia `pydantic-security` (szybkie wyłożenie aplikacji na błędnej konfiguracji przy starcie — CONFIG) — ten skill koncentruje się na czasie działania aplikacji (RUNTIME) w przypadku awarii usług zewnętrznych.
- Test wstrzykiwania błędów (KROK 5) jest projektowany w porozumieniu z `test-design-enforcer`.
- Zachowaj proporcje z `simplicity-gate`: stosuj te wzorce do rzeczywistych zewnętrznych zależności, nie do wewnętrznych wywołań funkcji, które nie mogą ulec awarii sieciowej.

## Procedura

### KROK 1: Inwentaryzacja wywołań granicznych
Wypisz każde wywołanie zewnętrzne w analizowanym kodzie:
```bash
grep -rn "requests\.\|httpx\.\|aiohttp\|\.execute(\|session\.\|redis\.\|\.publish(\|\.get(\|client\." <files>
```
Dla każdego wywołania określ powiązaną zależność oraz zdecyduj, czy awaria powinna skutkować błędem całego żądania, czy łagodną degradacją (graceful degradation).

### KROK 2: Wymuszenie timeoutów (obowiązkowe, bez wyjątków)
- Każde wywołanie MUSI określać jawny timeout. `requests.get(url, timeout=(connect, read))`, `httpx.AsyncClient(timeout=...)`, limit czasu zapytania/blokady bazy danych (statement/lock timeout), `socket_timeout` dla Redisa.
- Wywołanie bez ustawionego timeoutu to wada kodu — może wisieć w nieskończoność i wyczerpać pulę połączeń.
- Dowód: `grep -rn "requests\.\|httpx\.\|aiohttp" <files>` -> każde wystąpienie zawiera parametr `timeout=`.

### KROK 3: Ograniczone próby ponowienia z wykładniczym opóźnieniem i szumem (Backoff + Jitter)
- Ponawiaj wyłącznie operacje IDEMPOTENTNE (GET, PUT, idempotentny POST z kluczem). Kategorycznie ZABRANIA się bezmyślnego ponawiania nieidempotentnych operacji zapisu — powoduje to duplikację danych.
- Używaj dedykowanej biblioteki (`tenacity`), a nie pętli `while True` własnej konstrukcji. Stosuj ograniczoną liczbę prób (np. 3), wykładnicze opóźnienie oraz szum (JITTER), aby zapobiec przeciążeniu systemu (thundering herd).
```python
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception_type

@retry(stop=stop_after_attempt(3),
       wait=wait_exponential_jitter(initial=0.2, max=5),
       retry=retry_if_exception_type(TransientError), reraise=True)
def fetch(...): ...
```
- Ponawiaj próby tylko dla błędów przejściowych (transient errors: timeouty, błędy 5xx, zerwanie połączenia) — nigdy dla błędów klienta 4xx.

### KROK 4: Bezpiecznik (Circuit Breaker) + łagodna degradacja
- Dla zależności, które mogą być niedostępne przez dłuższy czas, dodaj bezpiecznik (np. `pybreaker`), aby natychmiast przerywać próby (fail fast) zamiast potęgować opóźnienia.
- Zdefiniuj ścieżkę łagodnej degradacji (degradation path): zwróć dane z pamięci podręcznej (stale value), domyślną wartość lub czytelny błąd dla klienta (HTTP 503 z nagłówkiem `Retry-After`). NIGDY nie tłum błędu zwracając pusty obiekt i udając, że wszystko działa — to zakazana praktyka typu "mock-fallback" opisana w `thin-router-enforcer`.

### KROK 5: Dowód w postaci testu wstrzykiwania błędów (Fault-Injection)
Napisz test symulujący awarię i weryfikujący odporność systemu:
- timeout -> zgłoszenie wyjątku / degradacja w określonym czasie (brak zawieszenia),
- błąd przejściowy -> N powtórzeń, a następnie sukces/porażka zgodnie z projektem,
- awaria usługi -> otwarcie bezpiecznika (circuit opens), klient otrzymuje zdefiniowany fallback/błąd.
```bash
uv run pytest <resilience_test> -v
```
Wklej wynik testu.

## Format raportu (Output Format)
```markdown
### 🛡️ RESILIENCE — REPORT

**Boundary calls:** [tabela: wywołanie → zależność → polityka]

| Kontrola | Status | Dowód |
| :-- | :-- | :-- |
| Timeouty we wszystkich wywołaniach | ✅ / ❌ [lista] | wynik grep |
| Ograniczone retry + backoff + jitter | ✅ / N/A (nieidempotentne) | kod + konfiguracja tenacity |
| Retry ograniczone wyłącznie do błędów przejściowych | ✅ / ❌ | kod |
| Definicja bezpiecznika / degradacji | ✅ / N/A | kod + ścieżka fallback |
| Brak cichego tłumienia / fałszywych pustych wartości | ✅ / ❌ | kod |
| Test wstrzykiwania błędów przechodzi | ✅ | wynik `pytest -v` |

**Werdykt:** ODPORNY (RESILIENT) / BRAKI (GAPS): [co należy uzupełnić]
```

## Dyscyplina zakresu (Scope Discipline)
Wdrażasz mechanizmy odporności WYŁĄCZNIE dla wywołań granicznych będących przedmiotem zadania. Nie opakowujesz wewnętrznych wywołań funkcji (które nie mogą ulec awarii sieciowej ani przekroczyć limitu czasu) w mechanizmy retry/breaker — to nadmiarowy kod. Nie zmieniasz logiki biznesowej wywołania podczas dodawania odporności.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Każde zewnętrzne wywołanie graniczne posiada jawny timeout — wklejono dowód.
- [ ] Powtórzenia (jeśli użyte) są ograniczone, wykorzystują backoff + jitter z biblioteki, dotyczą tylko błędów przejściowych i obejmują wyłącznie operacje idempotentne.
- [ ] Zdefiniowano ścieżkę degradacji dla każdej zależności (fallback, dane z cache lub czytelny błąd 503) — ZERO cichego tłumienia błędów i ZERO fałszywych pustych danych zwracanych jako prawidłowe.
- [ ] Test wstrzykiwania błędów został napisany i przechodzi pomyślnie — wklejono wynik `pytest -v`.
- [ ] Agent wprost oświadczył: "Resilience complete. N boundary calls: all timed out, retry bounded with jitter, degradation defined, fault-injection test green."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| :--- | :--- |
| "To API jest szybkie, nie potrzebuję timeoutu." | **ODRZUCONO.** Każde wywołanie sieciowe/bazy danych musi mieć timeout. To, co jest szybkie dzisiaj, jutro może zawiesić proces i wyczerpać pulę. |
| "Będę ponawiać próby w nieskończoność w pętli `while True`." | **ODRZUCONO.** Nieograniczone ponawianie potęguje awarię. Użyj ograniczonej liczby prób + backoff + jitter z biblioteki tenacity. |
| "Ponowię zapytanie POST, to powinno być w porządku." | **ODRZUCONO.** Ponawianie operacji nieidempotentnych duplikuje dane. Zadbaj o klucz idempotencji lub nie ponawiaj. |
| "W razie błędu po prostu zwrócę pustą listę." | **ODRZUCONO.** Ciche tłumienie błędów ukrywa awarie i psuje spójność decyzji. Zastosuj jawną degradację lub zgłoś czytelny błąd. |
| "Ponawiaj wszystko, włączając błędy 4xx." | **ODRZUCONO.** Błąd 4xx to błąd klienta — ponowienie nic nie da. Ponawiaj tylko błędy przejściowe (timeout, 5xx, zerwane połączenie). |
| "Bezpiecznik (circuit breaker) to przesada w tym miejscu." | **CZĘŚCIOWO ODRZUCONO.** Uzasadnij to. Dla kapryśnych usług zewnętrznych jest to obowiązkowe. Dla prostego wywołania wewnątrz klastra wystarczyć może timeout + limited retry — opisz swoją decyzję. |
| "Dodam test odporności później." | **ODRZUCONO.** Nietestowana odporność to brak odporności. Wstrzyknij błąd i udowodnij poprawne zachowanie systemu już teraz. |
