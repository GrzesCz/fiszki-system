---
title: "Kompendium: Techniki Pytest"
category: "Pytest"
---
# Kompendium: Techniki Pytest

Ten plik to "ściągawka" i słownik najważniejszych technik specyficznych dla narzędzia Pytest (wbudowanych oraz z popularnych wtyczek). Zebrane są tu zarówno techniki omawiane na początkowym etapie, jak i te wykorzystywane w dużych projektach.

---

## 1. Zarządzanie uruchamianiem (Dekoratory oznaczające)

Służą do kontrolowania **jak, kiedy i czy w ogóle** dany test ma się wykonać.

### `@pytest.mark.parametrize`
* **Co to jest:** Dekorator, który pozwala uruchomić ten sam test wiele razy, wstrzykując za każdym razem inne dane (zestawy argumentów).
* **Styl Zelenta (Analogia):** Masz maszynę do robienia pączków (to Twój test). Zamiast budować osobną maszynę dla pączków z różą, osobną dla adwokatu i osobną dla czekolady, masz jedną maszynę. `parametrize` to taśmociąg, który po prostu podaje różne wiadra z nadzieniem. Maszyna (test) robi dokładnie ten sam ruch, ale na końcu wypluwa różne pączki (przypadki testowe).
* **Kiedy używać:** Gdy chcesz przetestować tzw. przypadki brzegowe (edge cases) lub wiele wariantów tych samych danych (np. walidacja różnych błędnych haseł: za krótkie, bez cyfry, bez znaku specjalnego). Unikamy dzięki temu kopiowania kodu (zasada DRY).

### `@pytest.mark.xfail(reason="...")` (Expected Failure)
* **Co to jest:** Oznacza test, który – z tego co nam aktualnie wiadomo – **nie przejdzie (obleje)**. Jeśli obleje, Pytest nie rzuci błędem całego procesu (uzna, że "zgodnie z planem"). Jeśli nagle przejdzie, wyrzuci anomalię (XPASS).
* **Styl Zelenta (Analogia):** Na klatce schodowej jest dziura. `xfail` to tabliczka ostrzegawcza postawiona przez kierownika: "Uwaga, dziura. Naprawa zaplanowana na wtorek". Dzięki temu ludzie nie wpadają w panikę, gdy ją widzą. Jeśli któregoś dnia dziura zniknie (bo ktoś ją załatał w innym commicie), kierownik zdejmie tabliczkę.
* **Kiedy używać:** Znalazłeś buga w kodzie aplikacji i napisałeś test, który go udowadnia, ale zadanie na naprawę buga leży w Jira (tzw. WIP - Work In Progress). Zamiast kasować test, oznaczasz go jako `xfail`, żeby system CI/CD świecił się na zielono.

### `@pytest.mark.skip(reason="...")` oraz `@pytest.mark.skipif(warunek, reason="...")`
* **Co to jest:** Całkowite pominięcie testu. Wersja `skipif` pomija go tylko wtedy, gdy spełniony jest logiczny warunek (np. brak konkretnej biblioteki w systemie).
* **Styl Zelenta (Analogia):** Jedziesz autem kabrioletem. Jeśli pada deszcz (`warunek == True`), pomijasz ściąganie dachu (`skipif`). Jeśli świeci słońce (`warunek == False`), testujesz system otwierania dachu.
* **Kiedy używać:** Rzadziej niż `xfail`. Głównie do testów uzależnionych od środowiska (np. pomiń, jeśli system to Windows, albo pomiń, jeśli nie dało się zaimportować opcjonalnej biblioteki).

### `@pytest.mark.asyncio` (wtyczka `pytest-asyncio`)
* **Co to jest:** Instrukcja dla Pytesta, że funkcja testowa jest asynchroniczna (`async def`) i musi zostać obsłużona przez pętlę zdarzeń (Event Loop).
* **Styl Zelenta (Analogia):** Zwykły Pytest to kierownik, który nadzoruje pracowników robiących jedną rzecz naraz. Gdy widzi pracownika-żonglera (`async def`), który rzuca 5 piłeczek naraz, krzyczy ERROR, bo nie wie jak go ocenić. Marker `@pytest.mark.asyncio` to założenie kierownikowi specjalnych okularów. Mówi: "A, dobra, to żongler. Niech żongluje, ja mądrze poczekam aż skończy".
* **Kiedy używać:** Zawsze, gdy testujesz asynchroniczny kod w Pythonie (np. endpointy FastAPI `async def`, czy asynchroniczne zapytania do bazy danych).

### Własne Markery (Custom Markers np. `@pytest.mark.unit`)
* **Co to jest:** Stworzone przez programistów etykiety, by pogrupować testy. Wymagają rejestracji w pliku konfiguracyjnym (np. `pytest.ini`).
* **Styl Zelenta (Analogia):** Masz wielką szafę ubrań (10 000 testów). Własne markery to przyklejanie naklejek na wieszakach: "Zima" (`@pytest.mark.slow`), "Basen" (`@pytest.mark.unit`). Dzięki temu przed wyjściem krzyczysz do szafy: "Daj mi wszystko na basen!" (`pytest -m unit`) i nie musisz przeglądać kurtek zimowych.
* **Kiedy używać:** W dużych projektach do selektywnego uruchamiania. Częste grupy to np. `unit`, `integration`, `e2e`, `slow`, `security`.

---

## 2. Testowanie błędów

### `pytest.raises(TypWyjatku)`
* **Co to jest:** Menedżer kontekstu (blok `with`), który sprawdza, czy kod wywołany w jego wnętrzu zrzuci **dokładnie taki błąd**, jakiego oczekujemy.
* **Styl Zelenta (Analogia):** To egzaminator BHP, który przychodzi do fabryki, odpala zapałkę pod czujnikiem dymu i z uśmiechem mówi: "Oczekuję, że teraz wybuchnie tu przeraźliwy alarm". Jeśli alarm nie zawyje – fabryka nie przechodzi testu. Jeśli zawyje – super, system zabezpieczeń działa!
* **Kiedy używać:** Gdy testujesz np. walidację formularzy i podajesz złe dane (np. wiek = -5). Chcesz mieć pewność, że program nie puści tego cichaczem, tylko głośno zrzuci `ValidationError`.

---

## 3. Magiczne Narzędzia (Wbudowane Fixtures)

To rzeczy dostarczane domyślnie z Pytestem. Nie musisz ich pisać – wystarczy, że o nie poprosisz podając ich nazwę jako argument w teście (Dependency Injection).

### `monkeypatch`
* **Co to jest:** Narzędzie do "podmieniania w locie". Zmienia atrybuty klas, zawartość słowników czy zmienne środowiskowe, a po teście **automatycznie wszystko cofa do stanu pierwotnego**.
* **Styl Zelenta (Analogia):** W biurze jest główny termostat zabezpieczony kodem. `monkeypatch` to przyjazny haker, który przed testem włamuje się, ustawia termostat na 30 stopni (żebyś mógł zmierzyć topnienie lodu), a po Twoim teście potajemnie ustawia go z powrotem na 21 stopni. Nikt inny w biurze nie zauważa, że termostat był przestawiany.
* **Kiedy używać:** Jako bardzo proste i szybkie zastępstwo dla pełnego "mockowania", gdy chcesz tylko na chwilę zmienić jakąś zmienną konfiguracyjną (np. `os.environ["API_URL"]`).

### `tmp_path` (lub `tmpdir`)
* **Co to jest:** Daje Ci unikalną ścieżkę do pustego, tymczasowego folderu specjalnie dla danego testu. Pytest po wszystkim sam usuwa ten folder.
* **Styl Zelenta (Analogia):** Idziesz na lekcję chemii (test) i nauczyciel daje Ci czystą probówkę. Możesz w niej mieszać wybuchowe substancje, zapisywać na ściankach wzory. Gdy lekcja się kończy, woźny wyrzuca ją w całości do śmieci, a Twoje domowe biurko (Twój dysk w komputerze) pozostaje nietknięte i czyste.
* **Kiedy używać:** Gdy testowany przez Ciebie kod faktycznie coś zapisuje na dysk (np. funkcja "Wygeneruj PDF i zapisz do pliku"). Używasz `tmp_path`, by pliki nie śmieciły Ci w folderze projektu.

### `capsys`
* **Co to jest:** Przechwytuje wszystko to, co kod próbuje wydrukować w terminalu (poprzez `print()` lub do logów standardowych).
* **Styl Zelenta (Analogia):** Testujesz prezentera, który wrzeszczy przez megafon (konsolę) do ludzi. `capsys` to dyktafon podsunięty pod megafon. Prezenter drze się jak zwykle, a Ty po występie bierzesz dyktafon i w ciszy sprawdzasz: "Aha, w minucie drugiej poprawnie wykrzyczał słowo ERROR".
* **Kiedy używać:** Gdy tworzysz aplikację konsolową (CLI) i chcesz w asercji sprawdzić, czy do użytkownika trafił właściwy tekst wydrukowany poleceniem `print`.

---

## 4. Narzędzia do Asercji

### `pytest.approx(wartosc)`
* **Co to jest:** Pozwala asercji na ułamkach sprawdzić równość "w przybliżeniu", z pominięciem precyzji zmiennoprzecinkowej.
* **Styl Zelenta (Analogia):** Python jest jak chory na skrupulatność aptekarz. Gdy powiesz mu, że $0.1 + 0.2$ to $0.3$, on spojrzy na swój sprzęt, zobaczy $0.30000000000000004$ i zrzuci błąd FAILED krzycząc: "Zła ilość!!!". `pytest.approx` to poluzowany majster z budowy. Mówisz mu: "Tu ma być około 30 centymetrów". On patrzy na ułamki milimetrów i mówi: "E, no, mieści się w granicach błędu, zaliczam!".
* **Kiedy używać:** Zawsze, gdy asercja dotyczy liczb typu `float` (np. operacje na stawkach, matematyce, pieniądzach, algorytmach ML). Np. `assert obliczona_cena == pytest.approx(123.45)`.
