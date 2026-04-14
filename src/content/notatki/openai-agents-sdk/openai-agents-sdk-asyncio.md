---
title: 'Szczegóły: Programowanie Asynchroniczne (async/await) w Pythonie'
category: Agenci AI
status: zrobione
type: notatka
hidden: true
---
# Programowanie asynchroniczne (async/await)

---

## 1. Dlaczego async/await jest ważne w agentach AI?

Wszystkie frameworki agentów wykorzystują asynchroniczny Python (`async IO`).

**Dlaczego?**
Gdy korzystasz z płatnych API (np. OpenAI), większość czasu spędzasz na **oczekiwaniu na odpowiedź** z modelu działającego w chmurze. To jest tzw. **I/O bound** — kod czeka na sieć, nie na obliczenia.

Async IO pozwala na uruchomienie **innych rzeczy**, podczas gdy jeden fragment kodu czeka na odpowiedź z sieci.

W systemach wieloagentowych — gdy masz wielu agentów, którzy jednocześnie trafiają do różnych API — korzystanie z async ma **ogromny sens**.

---

## 2. Czym jest Async IO?

**Async IO** to lekka alternatywa dla wielowątkowości (threading) i wieloprocesowości (multiprocessing).

| Podejście | Jak działa | Waga |
| :--- | :--- | :--- |
| **Wielowątkowość (threading)** | Wiele wątków na poziomie systemu operacyjnego | Ciężkie |
| **Wieloprocesowość (multiprocessing)** | Wiele procesów Pythona | Ciężkie |
| **Async IO** | Lekka "udawana wielowątkowość" na poziomie kodu | **Super lekkie** |

Ponieważ async IO jest bardzo lekkie, możesz mieć **tysiące lub dziesiątki tysięcy** takich "rzeczy" działających bez zużywania dużej ilości zasobów.

**Async IO to dwie rzeczy:**
1. **Pakiet** `asyncio`, który można zaimportować
2. **Konstrukcje językowe** wbudowane w Pythona (słowa kluczowe `async` i `await`)

---

## 3. Krótka wersja (zasady do zapamiętania)

Jeśli chcesz "sobie poradzić" bez głębokiego zrozumienia:

**Zasada 1:** Jeśli funkcja ma działać asynchronicznie — dodaj `async` przed `def`:
```python
# Zwykła funkcja:
def do_some_processing():
    ...

# Funkcja asynchroniczna:
async def do_some_processing():
    ...
```

**Zasada 2:** Gdy wywołujesz taką funkcję — dodaj `await` przed wywołaniem:
```python
# Zwykłe wywołanie (NIE zadziała dla async!):
result = do_some_processing()

# Poprawne wywołanie funkcji async:
result = await do_some_processing()
```

**To wystarczy, żeby kod działał.** Ale to nie jest satysfakcjonujące...

---

## 4. Prawdziwa historia: Coroutine (nie funkcja, to OBIEKT!)

**Kluczowa wiedza:**
Gdy dopiszesz `async` przed słówkiem `def`, to, co tworzysz, przestaje być zwykłą funkcją w rozumieniu Pythona. Staje się swoistą "fabryką korutyn". Z kolei samo jej *wywołanie* nie uruchamia kodu wewnątrz – tylko buduje **obiekt typu coroutine**.

To trochę jak z klasami! Sama definicja klasy nie tworzy samochodu, a samo wywołanie `async def` nie wykonuje kodu.

```python
async def do_some_processing():
    # ... trochę pracy, zapytania do bazy, strzały do API ...
    return "done"
```

**Co to znaczy w praktyce ?:**
Wyobraźcie to sobie tak: zwykła funkcja to maszyna. Naciskasz guzik (wywołujesz `()` ) i maszyna rusza, mieli, miele, wypluwa wynik. Koniec.

Z korutyną jest inaczej. Kiedy robisz `do_some_processing()`, to **nic się nie mieli**. Zamiast tego Python mówi: *"Proszę, oto Twój obiekt coroutine (taka papierowa instrukcja obsługi), trzymaj to sobie w zmiennej. Jak będziesz gotowy, wrzuć to do mojej Pętli Zdarzeń (Event Loop), to ja to kiedyś tam odpalę"*.

- **Coroutine to przede wszystkim OBIEKT** — możesz go przypisać do zmiennej (`zadanie = do_some_processing()`), możesz go przekazać dalej, ale dopóki nie użyjesz `await zadanie`, kod w środku na pewno nie ruszy.
- Jest to taki "wyjątkowy" obiekt, który posiada umiejętność **pauzowania samego siebie** (gdy czeka na internet) i wznawiania działania od miejsca, w którym skończył. Zwykła funkcja tak nie potrafi – jak ruszy, to musi dobiec do mety albo umrzeć.

---

## 5. Analogia: Rozkaz vs Zlecenie

Żeby lepiej zrozumieć różnicę między zwykłą funkcją a coroutine:

**Zwykła funkcja (`def`) to ROZKAZ**
Gdy wywołujesz zwykłą funkcję, to jakbyś krzyknął do kucharza: **"Ugotuj jajko!"**.
Kucharz rzuca wszystko i gotuje. Przez ten czas jest zablokowany i nie może robić nic innego.
```python
# Wywołanie = NATYCHMIASTOWE WYKONANIE
sniadanie = ugotuj_jajko()  # Kucharz zablokowany aż skończy
```

**Coroutine (`async def`) to ZLECENIE NA KARTCE**
Gdy wywołujesz funkcję async, to jakbyś wypisał kartkę: **"Plan gotowania jajka"**.
Kucharz bierze kartkę, ale **nic jeszcze nie robi**. To tylko "potencjalna praca".
```python
# Wywołanie = STWORZENIE OBIEKTU ZLECENIA (kucharz nic nie robi!)
zlecenie = ugotuj_jajko() 
# Zmienna 'zlecenie' to tylko kartka (obiekt coroutine)
```

**`await` to "WRZUĆ NA RUSZT I POCZEKAJ"**
Dopiero `await` mówi kucharzowi: "Weź to zlecenie z kartki i zacznij je robić".
Co więcej – gdy kucharz czeka aż woda się zagotuje (czeka na I/O), może odłożyć to zadanie i zająć się innym (np. krojeniem chleba).
```python
# await = ROZPOCZĘCIE PRACY ZE ZLECENIA
wynik = await zlecenie
```

---

## 6. Pętla zdarzeń (Event Loop)

**Jak to działa "pod spodem"?**

W bibliotece `asyncio` jest kod, który wykonuje coś co nazywa się **pętla zdarzeń (event loop)**.

**Zasada działania:**
1. Event loop to rodzaj pętli `while`, która iteruje i pobiera coroutine do wykonania
2. Może wykonywać **tylko jedną coroutine na raz** (to NIE jest prawdziwa wielowątkowość!)
3. Wykonuje coroutine **dopóki ta nie dojdzie do punktu, w którym czeka na coś** (np. na I/O — odpowiedź z API)
4. W tym momencie event loop może **wstrzymać** tę coroutine i **rozpocząć wykonywanie innej**
5. Gdy ta inna coroutine też zacznie czekać na I/O — event loop może wrócić do pierwszej (lub uruchomić kolejną)

**Kluczowy wniosek:**
To jest **ręczny sposób obsługi wielowątkowości**. Działa **tylko wtedy**, gdy coś jest zablokowane i czeka na I/O.

Dlatego jest tak lekkie — to nie jest wielowątkowość na poziomie systemu operacyjnego, tylko wielowątkowość "zaimplementowana ręcznie" za pomocą event loop.

---

## 7. `asyncio.gather()` — uruchamianie wielu coroutines "równolegle"

Jeśli tylko używasz `await` + nazwa coroutine, to tak naprawdę **nic nie dzieje się równolegle**:
```python
# To NIE jest równoległe — każde await blokuje do zakończenia:
result1 = await coroutine1()  # czekaj na zakończenie
result2 = await coroutine2()  # dopiero teraz uruchom drugą
result3 = await coroutine3()  # dopiero teraz uruchom trzecią
```

**Rozwiązanie — `asyncio.gather()`:**
```python
import asyncio

results = await asyncio.gather(
    do_some_processing(),
    do_some_processing(),
    do_some_processing(),
)
# results to LISTA wyników ze wszystkich trzech coroutines
```

**Co się dzieje?**
1. Event loop **planuje wszystkie trzy** coroutines
2. Gdy pierwsza zacznie blokować (czekać na I/O) — druga zaczyna działać
3. Gdy druga zacznie blokować — trzecia zaczyna działać
4. Wszystkie trzy "działają równolegle" (w sensie: przełączają się gdy czekają na I/O)
5. Wyniki ze wszystkich trzech trafiają do listy `results`

**To jest "udawana wielowątkowość"** — wielowątkowość nie na poziomie systemu operacyjnego, ale zaimplementowana ręcznie za pomocą event loop i obsługi blokowania I/O.

---

## 8. Praktyczne Wzorce (Patterny) Asyncio

**1. Czekanie bez blokowania pętli (odpowiednik `time.sleep`)**
Jeśli chcesz, aby agent (lub zadanie) poczekał 60 sekund (np. jak Trigger w n8n co 60 sekund), **nigdy** nie używaj `time.sleep(60)` w funkcji `async`. To zatrzyma CAŁY event loop. Zamiast tego użyj `asyncio.sleep`:
```python
import asyncio

async def petla_co_minute():
    while True:
        print("Sprawdzam zadania...")
        # Czekaj asynchronicznie, pozwalając działać innym korutynom:
        await asyncio.sleep(60)
```

**2. Uruchamianie kodu asynchronicznego (Jupyter vs skrypt)**
- **W pliku `.py`**: Użyj `asyncio.run()`, by wejść w świat async.
  ```python
  import asyncio
  asyncio.run(petla_co_minute())
  ```
- **W Jupyter Notebook**: Posiada własny, stale działający event loop w tle. Po prostu użyj `await` na głównym poziomie komórki.
  ```python
  await petla_co_minute()
  ```

**3. Odpowiednik węzła Merge z n8n (zrównoleglanie)**
Używaj `asyncio.gather` rozpakowując listę korutyn (np. odpytywanie wielu plików / agentów naraz).
```python
import asyncio

korutyny = [przetworz_plik(p) for p in pliki]
# Rozpakuj listę gwiazdką (*) do gather:
wyniki = await asyncio.gather(*korutyny) 
```

---

## 9. Podsumowanie: Dwa poziomy rozumienia

**Poziom prosty (wystarczy do działania):**
- `async def` → funkcja asynchroniczna
- `await` → wywołanie funkcji asynchronicznej

**Poziom głębszy (prawdziwe zrozumienie):**
- `async def` tworzy **coroutine**, nie funkcję
- Wywołanie coroutine **zwraca obiekt coroutine**, ale go **nie uruchamia**
- `await` **planuje wykonanie** coroutine w event loop
- Event loop wykonuje coroutines po kolei, przełączając się gdy któraś czeka na I/O
- `asyncio.gather()` pozwala uruchomić wiele coroutines "równolegle"