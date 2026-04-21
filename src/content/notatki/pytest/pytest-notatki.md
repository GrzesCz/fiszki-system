---
title: 'Notatki: Pytest – testy, fixtures, mocking | Moduł 3: Web Framework'
category: Pytest
status: zrobione
next_review_date: '2026-05-20'
review_count: 5
type: mapa
mindmaps:
  - file: 20260319_135303.jpg
    rotation: 270
    zoom: 100
  - file: mapa.jpg
    rotation: 270
    zoom: 100
  - file: 20260319_135313.jpg
    rotation: 270
    zoom: 100
  - file: 20260319_135320.jpg
    rotation: 270
    zoom: 100
  - file: 20260319_135326.jpg
    rotation: 270
    zoom: 100
  - file: 20260319_135331.jpg
    rotation: 270
    zoom: 100
  - file: 20260319_135337.jpg
    rotation: 270
    zoom: 100
---
# Notatki: Pytest – testy, fixtures, mocking | Moduł 3: Web Framework

Źródła: oficjalna dokumentacja pytest, projekt `imprv-masterclass-testing`, notatki z kursu pytest (Udemy – FastAPI The Complete Course), rozmowa z mentorem.

**Temat:** Framework `Pytest` – pisanie testów jednostkowych i integracyjnych, fixtures, parametryzacja, mocking, testowanie FastAPI.

**Projekt referencyjny:** `TESTOWANIE - PYTEST/imprv-masterclass-testing` – profesjonalny przykład testowania aplikacji FastAPI z bazą danych, AI i storage.

**Dodatkowe materiały:**
- 📘 [Studium przypadku: projekt `imprv-masterclass-testing`](/notatki/pytest/pytest-studium_przypadku_imprv) (szczegółowe przykłady kodu, struktura)
- 📙 [Kompendium: Techniki Pytest](/notatki/pytest/pytest-kompendium_technik_pytest) (słownik markerów, parametryzacji, monkeypatch, xfail itp. w stylu "Zelenta")
- 📗 [ABC + Mock + Fixture – jak to się łączy](/notatki/pytest/pytest-abc-mock-fixture-polaczenie) (krok po kroku: kontrakt, atrapa, dostawca)

---

## Lekcja 1: Czym jest testowanie? Podstawowe pojęcia

### Zagadnienie
Wprowadzenie do testowania automatycznego w Pythonie: dlaczego testujemy kod, czym jest pytest, jak się różni od unittest, oraz podstawowe pojęcia (asercja, test jednostkowy, test integracyjny, mock).

---

### Opis

#### Czym jest testowanie oprogramowania?

Testowanie to sposób na upewnienie się, że aplikacja działa zgodnie z przeznaczeniem. Brzmi oczywiste, co? Ale zaraz – czy nie jest tak, że przecież i tak sprawdzasz swój kod, kiedy go piszesz? Printujesz, patrzysz w debugger, klikasz w przeglądarce... No właśnie. I tutaj jest pogrzebana ta pierwsza, najczęstsza wątpliwość osób totalnie nowych w temacie testowania jednostkowego: **po co w ogóle pisać testy, skoro i tak sprawdzam kod podczas jego tworzenia?**

Testowanie jest częścią **cyklu życia oprogramowania (SDLC)**. 

**Cele testowania:**
- Identyfikacja błędów i wad
- Upewnienie się, że aplikacja spełnia wymagania użytkownika
- Budowanie oprogramowania wysokiej jakości: niezawodnego, bezpiecznego i przyjaznego dla użytkownika

**SDLC (Software Development Life Cycle)** – cykl życia oprogramowania. Testowanie jest jedną z oficjalnych faz tego cyklu (często równolegle do implementacji):
1. **Zbieranie wymagań** – co system ma robić
2. **Projektowanie** – architektura, interfejsy, baza danych
3. **Implementacja** – pisanie kodu
4. **Testowanie** – sprawdzanie, czy wszystko działa zgodnie z wymaganiami
5. **Wdrożenie** – uruchomienie u użytkowników
6. **Utrzymanie** – poprawki, aktualizacje, wsparcie

---

#### Cztery sposoby przeprowadzania testów

**1. Testowanie ręczne (manualne)**

Sytuacja, w której **człowiek sprawdza swój kod podczas jego tworzenia** – sam ręcznie, używając inteligencji i doświadczenia, testujesz czy to co napisałeś działa jak należy (np. print, podgląd zmiennych, klikanie w przeglądarce). To testowanie **jednorazowe**: robocze linie potem znikają z kodu, a sprawdzenie odbyło się tylko na etapie tworzenia. Czyli mówiąc wprost – "testowanie samych siebie".

```python
# ❌ Testowanie manualne (jednorazowe, nie do powtórzenia)
def create_resume(user_id, text):
    # Funkcja produkcyjna – printy służą tylko do ręcznego sprawdzenia podczas pisania.
    resume = repository.save(user_id, text)
    print(f"Saved resume: {resume}")  # <- sprawdzasz printami
    storage.upload(text)
    print("Uploaded!")  # <- znowu print
    return resume
```

---

**2. Testy jednostkowe (unit tests)**

To testy **automatyczne** – są **powtarzane cyklicznie**, czyli proces dokonujący się wielokrotnie (np. przy każdej zmianie w kodzie). Mamy więc **sprawdzenie** (manualne, jednorazowe) kontra **sprawdzanie** (automatyczne, wielokrotne). Czujecie już różnicę jakościową?

Testowanie **pojedynczych komponentów (jednostek)** w **izolacji** od reszty aplikacji. Sprawdza, czy każda jednostka działa zgodnie z projektem.

**Cechy:**
- Pisane przez deweloperów w fazie rozwoju
- Zautomatyzowane, wykonywane przez platformę testową (w naszym przypadku: **pytest**)
- **Regresja:** Gdy później dodany kod (albo zmiany innej osoby w zespole) psuje wcześniej działającą funkcję, mówimy o regresji. Testy jednostkowe uruchamiane cyklicznie pozwalają to od razu zauważyć – któryś test „wychodzi na czerwono". Testowanie manualne takiej możliwości nie daje.
- **Quality assurance (QA):** Testy jednostkowe to jedna z praktyk zapewnienia jakości; automatyzacja testów znacząco w tym pomaga.

**Inne zalety:**
- Obniżają koszty onboardingu (nowy członek zespołu dostaje feedback, zamiast bać się, że coś zepsuje)
- Ułatwiają refaktoryzację (testy potwierdzają, że po zmianach wszystko nadal działa)
- Stanowią **żywą dokumentację** kodu (w testach widać, co uznajemy za działające, jakie są edge cases)
- Myślenie w kategoriach testów (np. TDD) sprzyja czystszemu kodowi i zasadzie pojedynczej odpowiedzialności (single responsibility)

**Uwaga:** Testy jednostkowe to nie jedyny rodzaj testów – są też m.in. testy end-to-end, systemowe, integracyjne, bezpieczeństwa, obciążeniowe, smoke. Poznanie testowania często zaczyna się od testów jednostkowych jako fundamentu.

---

**3. Testy integracyjne**

Testowanie **interakcji między wieloma jednostkami/komponentami** – zakres szerszy niż w testach jednostkowych.

- Pomaga zidentyfikować problemy całego rozwiązania
- Przykład: wywołanie endpointu API i sprawdzenie, czy zwracana jest prawidłowa odpowiedź (z prawdziwą bazą danych)

---

**4. Testy E2E (End-to-End)**

Testowanie **całego systemu od początku do końca** – tak, jak widzi go użytkownik końcowy. Żądanie przechodzi przez wszystkie warstwy (np. serwer HTTP, logikę biznesową, bazę danych, usługi zewnętrzne).

- Sprawdzają aplikację "z zewnątrz", zazwyczaj na uruchomionym, "żywym" serwerze.
- Najbardziej przypominają testowanie ręczne (punkt 1), ale są w pełni zautomatyzowane.
- Są najwolniejsze w wykonaniu, dlatego pisze się ich relatywnie mało (szczyt Piramidy Testów), ale dają największą pewność, że cały system "od A do Z" działa prawidłowo.
- Przykład: automat wysyła prawdziwe żądanie HTTP na wystawiony port API i weryfikuje ostateczną odpowiedź (np. kod 200) oraz to, czy w prawdziwej bazie zmieniły się dane.

---

#### Inne typy testów

W profesjonalnych projektach spotyka się także:

| Typ | Definicja |
|-----|-----------|
| **Testy smoke (dymne)** | Szybki sanity check – czy aplikacja w ogóle startuje i podstawowe ścieżki działają. Wykonywane często po deployu. Np. health check endpoint, logowanie. |
| **Testy systemowe** | Testowanie całego systemu jako całości – od wejścia do wyjścia, w środowisku zbliżonym do produkcyjnego. Często pokrywają się z E2E. |
| **Testy obciążeniowe (load)** | Sprawdzanie wydajności pod obciążeniem – ile requestów na sekundę wytrzyma API, jak reaguje przy wielu użytkownikach. Narzędzia: Locust, k6, JMeter. |
| **Testy bezpieczeństwa (security)** | Wykrywanie luk – SQL injection, XSS, nieautoryzowany dostęp. Skanery (OWASP ZAP, Snyk), testy penetracyjne. |

*W skrócie:* Unit, integration i E2E to fundament – omawiamy je w tym kursie. Smoke, systemowe, obciążeniowe i bezpieczeństwa to typy uzupełniające, stosowane w zależności od potrzeb projektu.

---

#### Dlaczego pytest, a nie unittest?

Python ma wbudowany moduł `unittest`. No to zapytacie logicznie: dlaczego więc wolę pokazać Wam moduł pytest, a nie ten w Pythona już wbudowany, już istniejący? Odpowiedź prosta:

**❌ ZŁE podejście – unittest (dużo ceremonii)**

```python
import unittest

class TestResumes(unittest.TestCase):
    def setUp(self):
        # Wywoływane przed każdym testem – przygotowanie wspólnego stanu (serwis).
        self.service = ResumesService(...)
    
    def test_create_resume(self):
        # Test – wywołanie funkcji i asercje przez self.assertEqual (ceremonia unittest).
        result = self.service.create_resume(...)
        self.assertEqual(result.id, 123)  # <- dziwna składnia
        self.assertIsInstance(result, ResumeSchema)  # <- długie nazwy
```

**Problemy:**
- Dużo "ceremonii" – musisz dziedziczyć po `TestCase`, używać `self`, pisać `setUp`
- Dziwne asercje – `self.assertEqual`, `self.assertIsInstance` zamiast prostego `assert`
- Ciężko parametryzować (te same testy z różnymi danymi)

**✅ DOBRE podejście – pytest (proste i czytelne)**

```python
def test_create_resume__success():
    # Zwykła funkcja – bez dziedziczenia, bez setUp. Pytest sam uruchamia.
    service = ResumesService(...)
    result = service.create_resume(...)
    
    # Proste asercje – jak normalne if-y. Prawda = passed, fałsz = failed.
    assert result.id == 123
    assert isinstance(result, ResumeSchema)
```

**Zalety pytest:**
- **Proste asercje** – `assert` zamiast `self.assertEqual`
- **Bez dziedziczenia** – zwykłe funkcje, nie klasy (opcjonalnie klasy, jeśli chcesz)
- **Fixtures** – elegancki sposób przygotowania danych (zamiast `setUp`)
- **Parametryzacja** – jeden test, wiele przypadków bez duplikacji kodu
- **Mocki built-in** – łatwe mockowanie (podmienianie) zależności

Pytest jest bardziej pythonowy. Wolę pytest, ponieważ pozwala on stworzyć bardzo prosto tak zwane asercje, co jest szczególnie cenne, kiedy człowiek zaczyna przygodę z testami jednostkowymi – bo jest mniej takiej ceremonii i obudowy tego wszystkiego aniżeli w unittest. Dzięki temu uczący skupiają się na logice testowania aplikacji, a nie na konstrukcji samego frameworka. Przez co szybciej łapią sens i filozofię testów jednostkowych.

---

### POJĘCIA KLUCZOWE – wyjaśnienia szczegółowe

#### 1. Asercja (assert)

**Słownikowo:** Asercja to stwierdzenie, teza lub twierdzenie wypowiadane z przekonaniem o jego prawdziwości; w logice – uznanie zdania za prawdziwe lub fałszywe.

**W testach:** W dużym skrócie to **rodzaj ifa** (wynik: prawda lub fałsz), którego używamy w testach zamiast pisać jawne if-y. Jeśli warunek w `assert` jest **prawdziwy** – test jest zielony (passed). Jeśli asercja się **nie spełni** – pytest pokazuje failed (na czerwono). **Proste jak budowa ifa.**

Asercje można traktować jak „warunkowe walidacje" w testach.

```python
def test_basic_math():
    # Prosty test – jedna asercja. Pytest zlicza funkcje (testy), nie asercje.
    result = 2 + 2
    assert result == 4  # <- jeśli True: test PASSED (zielony)
                        # <- jeśli False: test FAILED (czerwony)
```

**Test a asercja:** Test jednostkowy to funkcja zaczynająca się od `test_`; może zawierać **wiele asercji**. To **testy** są zliczane (jeden test = jedna funkcja), nie pojedyncze asercje. Jedna niespełniona asercja = cały test failed.

**Skąd się biorą:** `assert` to wbudowane słowo kluczowe Pythona (nie z biblioteki). Pytest tylko "przechwytuje" AssertionError i wyświetla ładny raport.

**Więcej asercji – isinstance, boolean, type, listy, all(), any():**

Oprócz `assert x == y` i `assert x != y` przydają się:

- **`assert isinstance(obiekt, typ)`** – weryfikacja typu. Np. `assert isinstance("hello", str)` przejdzie; `assert not isinstance("10", int)` też – bo `"10"` to string, dopóki nie zrobimy `int("10")`. Ważne przy danych z API czy inputu użytkownika.
- **`assert validated is True`** – wartości logiczne. `assert ("hello" == "world") is False` – przejdzie.
- **`assert type("hello") is str`** – sprawdzenie typu (alternatywa do isinstance).
- **`assert 7 > 3`, `assert 4 < 10`** – porównania numeryczne.
- **`assert 1 in num_list`, `assert 7 not in num_list`** – sprawdzenie, czy wartość jest (lub nie jest) w liście.
- **`all(iterable)`** i **`any(iterable)`** – w Pythonie wartości są truthy (np. liczby ≠ 0, niepuste stringi) lub falsy (`False`, `0`, `""`, `[]`, `None`). `all([1, 2, 3])` = True (wszystkie truthy); `all([1, 0, 3])` = False. `any([False, False])` = False; `any([False, True])` = True. W testach: `assert all(num_list)` – „wszystkie elementy niezerowe"; `assert not any(any_list)` – „żaden nie jest prawdziwy".

```python
def test_is_instance():
    assert isinstance("hello", str)
    assert not isinstance("10", int)   # "10" to string, nie int

def test_list():
    num_list = [1, 2, 3, 4, 5]
    any_list = [False, False]
    assert 1 in num_list
    assert 7 not in num_list
    assert all(num_list)
    assert not any(any_list)
```

---

#### 2. Mock (mockowanie, mock object)

**Co to jest:** Mock to "fałszywy" obiekt, który **udaje** prawdziwy obiekt (bazę danych, API, serwis). Wyobraź sobie, że testujemy serwis, który zapisuje CV do bazy, wysyła je do cloud storage i generuje podsumowanie przez AI. Gdybyśmy użyli prawdziwych rzeczy – musielibyśmy mieć postawioną bazę PostgreSQL, konto w AWS S3 i działające API OpenAI. Test trwałby wieki, kosztował forsę i mógłby spaść, bo internet się wyłączył. **Mock to atrapa** – udaje bazę, udaje storage, udaje AI. Mówisz mu "zwróć taką wartość" i on zwraca. Bez łączenia się z czymkolwiek. Test działa w milisekundach, za darmo, i nigdy nie pada przez sieć.

**Dlaczego używamy mocków w testach jednostkowych?** Bo test jednostkowy ma testować **tylko logikę naszego kodu**, nie bazę danych, nie sieć, nie zewnętrzne API. Gdybyśmy używali prawdziwej bazy – to byłby test integracyjny (o tym za moment).

**Skąd się biorą:**
- **`unittest.mock`** – wbudowany w Pythona (od wersji 3.3+)
- **`pytest-mock`** – wrapper wokół `unittest.mock`, łatwiejszy w użyciu z pytest (fixture `mocker`)

**Przykład z projektu `imprv-masterclass-testing`:**

```python
# Mock repository (zamiast prawdziwej bazy)
mock_repository = mocker.Mock(spec=AbstractResumesRepository)

# Mock zwraca fake resume (nie idzie do bazy!)
created_resume = Resume(id=123, user_id=456, summary="Test")
mock_repository.create_resume.return_value = created_resume

# Serwis dostaje mocka (nie prawdziwe repo!)
service = ResumesService(resumes_repository=mock_repository, ...)

# Wywołujemy funkcję
result = service.create_resume(user_id=456, resume=patch)

# Sprawdzamy, czy mock został wywołany
mock_repository.create_resume.assert_called_once()
```

**Kluczowe metody mocków (programowanie atrapy):**

- **`.return_value = X`** – "Zamiast wywoływać prawdziwą funkcję, po prostu zwróć to X". Mock łapie wywołanie w locie i od razu wypluwa podaną wartość (np. `mock_lodowka.daj_marchewke.return_value = "drewniana_marchewka"`). Żaden prawdziwy kod bazy/API się nie wykonuje!
- **`.side_effect = Exception("błąd")`** – Podobnie jak wyżej, ale zamiast zwracać wartość, symuluje wybuch błędu (np. żeby przetestować, jak nasz kod radzi sobie, gdy wywali się baza danych).
- **`.assert_called_once()`** – Asercja sprawdzająca: "Czy nasz serwis chociaż raz pofatygował się do tej atrapy i jej użył?". Zabezpiecza przed sytuacją, gdy kod przechodzi na zielono, a w ogóle nic nie wywołał.
- **`.assert_called_with(arg1, arg2)`** – Sprawdza szczegóły: "Czy serwis nie tylko przyszedł do atrapy, ale czy przyniósł ze sobą dokładnie te argumenty, o które prosiliśmy?".

*Szczegóły zastosowania w projekcie imprv – sekcja „Struktura katalogu tests” → BaseUnitTestCase.*

---

#### 2a. Klasa abstrakcyjna (ABC) i moduł `abc`

**Skąd się bierze klasa abstrakcyjna w testach jednostkowych?**

Testujecie serwis, który zapisuje CV do bazy i wysyła je do chmury. Serwis nie wie, czy baza to Postgres, Mongo czy plik tekstowy – dostaje „kogoś, kto umie zapisać”. Ten „ktoś” to repozytorium. A żeby testy nie musiały używać prawdziwej bazy, wstrzykujecie **mocka** – atrapę.
 
Pytanie: skąd mock wie, jakie metody ma udawać? 

Z **klasy abstrakcyjnej** – kontraktu, który mówi: „każde repozytorium musi mieć metodę `create_resume`”.

Mock z `spec=AbstractResumesRepository` dostaje ten kontrakt i wie, co ma udawać. Bez ABC mock przyjmuje **wszystko** – wywołasz `mock_repository.create_resum()` (literówka) albo `mock_repository.zrob_kawe()` – i tak zwróci atrapę, test przejdzie na zielono. A w produkcji prawdziwe repozytorium ma tylko `create_resume` – i nagle wybuch. Błąd wychodzi dopiero u użytkownika. Z ABC i `spec=AbstractResumesRepository` mock ma **tylko** metody z kontraktu – literówka od razu daje `AttributeError` w teście, naprawiasz zanim cokolwiek pójdzie na produkcję. **Proste** – najpierw umowa, potem atrapa.

**Klasy abstrakcyjne** można pobrać z **wbudowanego modułu Pythona `abc`** (Abstract Base Classes). To **nie jest zewnętrzna biblioteka** – nie instalujesz jej przez `pip`. Moduł `abc` jest częścią standardowej biblioteki Pythona (jak `os`, `json`, `datetime`).



```python
from abc import ABC, abstractmethod  # <- wbudowane w Pythona

class AbstractResumesRepository(ABC):  # ABC = "bazowa klasa abstrakcyjna"
    @abstractmethod
    def create_resume(self, user_id, resume):
        # Sygnatura bez implementacji – kontrakt. Każda implementacja MUSI mieć tę metodę.
        pass  # tylko definicja, brak kodu
```

**Analogia (Zelent):** Szef budowy zatrudnia "Murarza" – nie wie jak ma na imię, ale wie, że musi umieć murować. To kontrakt. Dziś przychodzi Mietek (Postgres), jutro Zdzichu (Mongo), w testach – manekin (mock). Kod nie zauważy różnicy. Klocki LEGO zamiast zespawanego czołgu.

---

#### 3. Fixture

**Co to jest:** Fixture to funkcja, która **przygotowuje dane lub środowisko** potrzebne do testów. Zobaczcie – piszecie 10 testów i w każdym potrzebujecie tego samego obiektu konfiguracji (`Config`). Bez fixture: kopiujecie `config = Config()` w każdym teście.

**Zmiana konfiguracji?**

Poprawka w 10 miejscach. Spaghetti. **Z fixture**: piszesz setup **raz**, a pytest automatycznie wywołuje tę funkcję i wstrzykuje wynik do każdego testu, który o to poprosi. Jedna definicja, wiele testów – reużywalność. Proste jak budowa cepa.

**Skąd się biorą:** Z pytest – dekorator `@pytest.fixture`. Oznaczasz funkcję tym dekoratorem, podajesz jej nazwę jako parametr w teście – pytest robi resztę.

**Przykład z projektu:**

```python
# tests/conftest.py
@pytest.fixture(scope="session")
def config():
    # Tworzy Config z debug=True. Scope session = raz na całe uruchomienie pytest.
    config = Config()
    config.debug = True
    return config

@pytest.fixture(scope="session")
def db_client(bootstrap: Bootstrap):
    # Zwraca klienta bazy z Bootstrapa. Zależność: bootstrap musi być najpierw.
    return bootstrap.db_client

# Test może używać tych fixtures jako parametrów – pytest wstrzykuje automatycznie.
def test_something(config, db_client):
    # config i db_client zostały przygotowane przez pytest – nie wywołujesz ich ręcznie!
    assert config.debug is True
```

**Scope fixtures – kiedy fixture jest tworzony:**

| Scope | Kiedy tworzony | Kiedy używać |
|-------|----------------|--------------|
| **`function`** (domyślne) | Przed **każdym** testem – świeża instancja za każdym razem. | Gdy każdy test musi mieć czysty stan (np. pusta lista, nowy obiekt). Izolacja – test A nie widzi śladów po teście B. |
| **`class`** | Raz na **klasę testową** – wszystkie testy w `class TestResumes:` współdzielą tę samą instancję. | Gdy setup jest drogi, a testy w klasie nie zmieniają stanu (albo zmiany nie przeszkadzają). |
| **`module`** | Raz na **plik** – wszystkie testy w `test_resumes.py` współdzielą. | Rzadziej. Gdy cały plik testuje ten sam kontekst i nie ma konfliktów. |
| **`session`** | Raz na **całe uruchomienie** pytest (`pytest tests/`). Współdzielone przez wszystkie pliki. | Dla drogich zasobów: połączenie z bazą, Bootstrap, konfiguracja. Stawiasz raz, używasz w setkach testów. |

*W imprv:* `config`, `bootstrap`, `db_client` mają `scope="session"` – nie stawiają całej aplikacji przed każdym testem. `resumes_repository` – `function`, żeby każdy test miał świeży stan.

*Szczegóły zastosowania w projekcie imprv – sekcja „Struktura katalogu tests” (conftest.py, __init__.py).*

---

#### 4. Test jednostkowy vs test integracyjny vs E2E

No i teraz ważne. Macie trzy typy testów w projekcie `imprv-masterclass-testing`. Pokażę Wam różnicę na przykładzie tworzenia CV (resume).

**Piramida testów – proporcje i kompromisy:**

```
      /\
     /E2E\        ← Mało, wolne, drogie (pełny stos)
    /------\
   /Integr \      ← Średnio, szybsze (baza + repository)
  /----------\
 /   Unit     \   ← Dużo, szybkie, tanie (tylko mocki)
/--------------\
```

**Test jednostkowy (unit test):**
- Testuje **jeden komponent w izolacji** – np. sam serwis (`ResumesService`), bez dotykania bazy ani storage.
- Używa **mocków** zamiast prawdziwych zależności (baza, API, storage). Wszystko "na atrapy".
- Szybki jak rakieta (milisekundy).


**Test integracyjny (integration test):**
- Testuje **interakcję między komponentami** – np. czy repository faktycznie zapisuje do bazy.
- Używa **prawdziwych zasobów** (testowa baza danych SQLite/Postgres, ale prawdziwa struktura). Bez mocków – prawdziwe zapytania SQL.
- Wolniejszy (sekundy), bo łączy się z bazą.


**Test E2E (end-to-end):**
- Testuje **cały przepływ** od API do bazy, przez wszystkie warstwy. Jak użytkownik: wysyłasz POST do `/resumes`, sprawdzasz czy zwraca 201 i czy dane są w bazie.
- Uruchamia prawdziwy serwer FastAPI (port 8000). To już prawie jak produkcja!
- Najwolniejszy (sekundy do minut), bo startuje cały serwer.


**Analogia (samochód):**

| Typ testu | Analogia |
|-----------|----------|
| **Test jednostkowy** | Sprawdzasz silnik na stole – osobno, w izolacji. Nie montujesz go w aucie. |
| **Test integracyjny** | Montujesz silnik z kołami i skrzynią – sprawdzasz, czy współpracują. Ale jeszcze nie wsiadasz. |
| **Test E2E** | Wsiadasz, odpalasz, jedziesz – cały samochód od kluczyka do hamulca. Jak prawdziwy użytkownik. |

---

#### 5. Skąd wiedzieć, co testować?

No i teraz pytanie brzmi: macie piramidę, macie unit, integration, E2E. Ale skąd w ogóle wiedzieć, **co** testować? Przecież nie każda linijka kodu zasługuje na osobny test. Gdzie postawić granicę? Proste jak budowa cepa – o ile wiecie, na co patrzeć.

**Analogia (restauracja):** Szef kuchni nie testuje każdego noża osobno. Sprawdza danie – czy smakuje, czy porcje są równe, czy kelner donosi na czas. W kodzie tak samo: nie testujecie gettera `def get_name(self): return self.name` – to trywialne. Testujecie **logikę**, która ma szansę się zepsuć albo ma znaczenie dla użytkownika.

**Zasada 1: Testuj logikę, nie rury (plumbing)**

| Testuj ✅ | Nie testuj ❌ |
|-----------|---------------|
| Serwis – orkiestracja use case'ów (np. `create_resume` łączy repo + storage + AI) | Proste gettery, settery, `__init__` |
| Walidacja – czy błędne dane są odrzucane | Konfiguracja, stałe |
| Obliczenia – ceny, rabaty, konwersje | Kod frameworka (FastAPI, pytest) |
| Warunki brzegowe (edge cases) – pusta lista, null, ujemna liczba | Kod bibliotek zewnętrznych |

**Zasada 2: Ryzyko i krytyczność**

Co się stanie, gdy to się zepsuje? Im wyższy koszt błędu, tym więcej testów. Tworzenie CV, płatność, zapis do bazy – to krytyczne. Wyświetlanie statystyk na dashboardzie – mniej. Zobaczcie – nie chodzi o to, żeby testować wszystko. Chodzi o to, żeby **najpierw** zabezpieczyć to, co boli najbardziej.

**Zasada 3: Happy path, potem edge cases, potem błędy**

Kolejność pisania testów:

1. **Happy path** – normalny, szczęśliwy scenariusz. Użytkownik robi wszystko dobrze, system zwraca 201. To pierwszy test – „czy w ogóle działa?”.
2. **Edge cases** – granice. Pusta lista, maksymalna długość stringa, data w przeszłości, ujemna cena. Co się dzieje na brzegu?
3. **Obsługa błędów** – nieprawidłowe dane, brak uprawnień, timeout. Czy system nie wybucha, tylko zwraca sensowny błąd?

**Zasada 4: Bug-driven testing**

Naprawiłeś błąd? **Napisz test, który by go złapał.** To test regresyjny – upewnia się, że ten sam bug nie wróci za tydzień. „To działało, ktoś coś zmienił i przestało" – właśnie po to są testy. Bug bez testu to bomba z opóźnionym zapłonem.

**Zasada 5: Coverage to wskazówka, nie cel**

Sto procent coverage nie znaczy, że wszystko jest dobrze przetestowane. Można mieć coverage 100% i testy, które nic nie weryfikują (np. `assert True`). Coverage mówi: „tu nie ma testów" – ale nie mówi: „tu testy są dobre". Używajcie coverage jako mapy dziur, nie jako metryki sukcesu.

**Podsumowanie – checklist „co testować?"**

- [ ] Czy to logika biznesowa, a nie trywialny getter?
- [ ] Czy błąd tutaj boli (płatności, zapis danych, autoryzacja)?
- [ ] Czy mam happy path, edge cases i obsługę błędów?
- [ ] Czy naprawiony bug ma teraz test regresyjny?
- [ ] Czy coverage pokazuje mi dziury, a nie dyktuje „muszę mieć 100%"?

Proste. Zaczynajcie od tego, co krytyczne. Reszta przyjdzie z praktyką.

---

### Przykłady kodu z projektu `imprv-masterclass-testing`

Szczegółowe omówienie struktury testów, klas bazowych, fixtures, DbFactory oraz pełne przykłady testu jednostkowego i integracyjnego – **przeniesione do osobnego pliku**, aby nie „przytłaczać" teorii w Lekcji 1.

**👉 [Zobacz studium przypadku: studium_przypadku_imprv](/notatki/pytest/pytest-studium_przypadku_imprv)**

W pliku znajdziesz m.in.:
- Strukturę katalogów `tests/` (unit, integration, e2e, llm)
- Hierarchię klas bazowych (BaseTestCase → BaseUnitTestCase, BaseIntegrationTestCase, BaseE2ETestCase, LLMIntegrationTestCase)
- Omówienie `conftest.py` i wszystkich fixtures (config, bootstrap, db_client, db_factory, fastapi_server, itd.)
- `DbFactory` – helper do `clear()` i `create_user()`
- Pełny test jednostkowy z mockami (GIVEN/WHEN/THEN)
- Pełny test integracyjny z prawdziwą bazą

---



## Lekcja 2: Uruchamianie testów, konwencje nazewnictwa, raporty

### Zagadnienie
Jak uruchamiać pytest z terminala, jakie konwencje nazewnictwa stosować (żeby pytest znalazł testy), oraz co znaczy raport – kropka, F, verbose.

### Opis

No to mamy już pierwsze testy. I teraz pytanie brzmi: **jak je w ogóle odpalić?** Nie uruchamiacie przecież Pythona ręcznie na każdym pliku – to by było jak klikanie w 50 przycisków. Pytest zbiera testy za Was, ale musicie znać kilka zasad.

**Instalacja:** Przed pierwszym uruchomieniem testów w terminalu wykonajcie `pip install pytest`. Dzięki temu polecenie `pytest` będzie dostępne.

**Struktura projektu:** Katalog `tests/` (lub `test/`) – pytest domyślnie szuka w nim testów. Plik `__init__.py` (może być pusty) sprawia, że Python traktuje katalog jako pakiet. W środku pliki np. `test_example.py`, `test_todos.py`.

#### Konwencje nazewnictwa – żeby pytest Cię znalazł

Pytest szuka testów po **nazwach**. Proste jak budowa cepa:
- **Pliki:** `test_*.py` albo `*_test.py` (np. `test_service__create_resume.py`).
- **Funkcje testowe:** nazwa zaczyna się od `test_` (np. `test_create_resume__success`).

Jeśli nazwiecie plik `moje_testy.py` i funkcję `sprawdzam_cos()` – pytest **nie uruchomi** tego. Nie z lenistwa – po prostu nie uzna tego za test. W projekcie `imprv-masterclass-testing` używają konwencji `test_moduł__funkcja.py` (podwójne `__` oddziela moduł od funkcji) – to już ich wewnętrzny standard, ale zasada jest ta sama: **test_** na początku.

#### Uruchamianie z terminala

Z katalogu **głównego projektu** (tam, gdzie jest folder `tests/`):

```bash
pytest                    # uruchom wszystkie testy
pytest tests/unit/       # tylko testy jednostkowe
pytest tests/unit/contexts/resumes/test_service__create_resume.py   # jeden plik
pytest -v                 # verbose – zamiast kropki widać nazwę każdego testu
pytest -vv                # very verbose – jeszcze więcej szczegółów
pytest -k "create_resume" # tylko testy, w których nazwie jest "create_resume"
```

**Dlaczego z głównego katalogu?** Bo wtedy Python widzi pakiet `masterclass_api` i `tests`. Gdybyście odpalić pytest z środka `tests/`, mogą polecieć błędy importów. Zawsze stójcie w "korzeniu" projektu.

#### Co znaczy raport?

- **Kropka (`.`)** – jeden test przeszedł (passed). Zielono.
- **Litera F** – jeden test nie przeszedł (failed). Czerwono.
- **`pytest -v`** – zamiast kropek widzicie listę: `test_create_resume__success PASSED`, itd.

Gdy test się wywali, pytest podaje: w którym pliku, w której funkcji i **która asercja** nie przeszła (np. `AssertionError: assert 3 == 2`). Dzięki temu od razu wiecie, co poprawić. Proste.

**Raport przy niepowodzeniu – przykład:**

Jeśli w teście dopiszecie `assert 3 == 2`, po uruchomieniu `pytest` zobaczycie m.in.:

```
FAILED test/test_example.py::test_equal_or_not_equal - AssertionError: assert 3 == 2
```

W trybie verbose (`pytest -v`) lub przy wyświetlaniu traceback widać dokładnie: nazwę funkcji testowej, plik, numer linii oraz która asercja nie przeszła. Im więcej `-v`, tym więcej szczegółów przy failed.

### Odniesienia
- [pytest – How to invoke pytest](https://docs.pytest.org/en/stable/how-to/usage.html)
- [pytest – Conventions for Python test discovery](https://docs.pytest.org/en/stable/explanation/goodpractices.html#conventions-for-python-test-discovery)

---

## Lekcja 3: Fixtures w praktyce – conftest, scope, zależności, Bootstrap

### Zagadnienie
Gdzie trzymać fixtures (conftest.py), jak fixture może zależeć od innego fixture’a, kiedy używać którego scope’u, oraz jak w testach korzysta się z Bootstrapa.

### Opis

W Lekcji 1 powiedzieliśmy, że fixture to "przygotowacz" – funkcja, która coś przygotowuje przed testem. No to teraz idziemy krok dalej: **gdzie to pisać** i **jak fixtures mogą się nawzajem wywoływać**.

#### conftest.py – szafa z przygotowaniami

Wszystkie fixtures, które mają być dostępne dla wielu plików testowych, lądują w **`tests/conftest.py`**. Pytest automatycznie ładuje ten plik – nie musicie go importować. To jak szafa na początku korytarza: każdy test może z niej skorzystać, podając nazwę fixture’a w parametrze.

W projekcie w `conftest.py` są m.in.: `config`, `bootstrap`, `db_client`, `db_factory`, `resumes_repository`, `ml_service`. Jedna definicja – wiele testów. DRY (Don’t Repeat Yourself). W innych projektach wspólny kod testowy ląduje w `test/utils.py` – conftest i utils pełnią podobną rolę: DRY, zero duplikacji.

#### Zależności między fixtures – łańcuch dostaw

Fixture może **przyjmować w parametrze inny fixture**. Wtedy pytest najpierw wywołuje ten drugi, a wynik przekazuje do pierwszego. Zobaczcie:

```python
# Łańcuch zależności: config → bootstrap → resumes_repository. Pytest wywołuje w tej kolejności.
@pytest.fixture(scope="session")
def config():
    config = Config()
    config.debug = True
    return config

@pytest.fixture(scope="session")
def bootstrap(config: Config):   # <- bootstrap "prosi" o config
    return Bootstrap(config=config)

@pytest.fixture(scope="function")
def resumes_repository(bootstrap: Bootstrap):   # <- resumes_repository "prosi" o bootstrap
    return bootstrap.resumes_repository
```

Kolejność: najpierw `config`, potem `bootstrap(config)`, potem `resumes_repository(bootstrap)`. Pytest sam pilnuje kolejności. **Proste jak budowa cepa** – jak łańcuch dostaw: najpierw surowce (config), potem szef budowy (Bootstrap), potem konkretny "pracownik" (resumes_repository).

#### Scope – kiedy fixture jest tworzony

- **`function`** (domyślne) – nowa instancja **przed każdym testem**. Świeże dane, zero śladu po poprzednim teście.
- **`class`** – raz na klasę testową.
- **`module`** – raz na plik.
- **`session`** – raz na **całe** uruchomienie pytest. Np. połączenie z bazą albo Bootstrap – drogie do postawienia, więc robimy to raz i współdzielimy.

W `imprv-masterclass-testing`: `config`, `bootstrap`, `db_client` mają `scope="session"` – żeby nie stawiać całej aplikacji przed każdym pojedynczym testem. A `resumes_repository` ma `scope="function"` – żeby każdy test mógł dostać "świeży" repo (albo tak jest skonfigurowane w zależności od potrzeby).

#### Bootstrap w testach – "szef budowy" od fixture’a

Bootstrap w tym projekcie to **jedno miejsce, gdzie składana jest cała aplikacja**: baza, repo, serwisy, klienty. Nie jest "od pytest" – to zwykła klasa Pythona. Ale **fixture `bootstrap(config)`** tworzy tego Bootstrapa z konfiguracją testową (np. `config.debug = True`). Dzięki temu testy dostają ten sam "szef budowy" co aplikacja – tylko z ustawieniami pod testy. Fixture nie zastępuje ABC ani Bootstrapa – **dostarcza** gotowy Bootstrap do testów. Jedna linijka: `return Bootstrap(config=config)` – i macie cały świat aplikacji pod ręką.

#### Fixture z yield – setup i teardown

Fixture może używać **`yield`** zamiast `return`. Wtedy mamy **dwie fazy**:
1. **Przed `yield`** – setup (np. dodanie danych do bazy).
2. **Po `yield`** – teardown (np. usunięcie danych, zamknięcie sesji).

Gdybyśmy użyli `return`, nie byłoby momentu na cleanup – baza zostałaby zaśmiecona po teście. `yield` pozwala posprzątać **po wykonaniu testu**. Pytest traktuje fixture z yield jak generator: wykonuje kod przed yield, oddaje wynik testowi, po zakończeniu testu wznawia i wykonuje kod po yield. W imprv fixture `fastapi_server` ([studium_przypadku_imprv](/notatki/pytest/pytest-studium_przypadku_imprv), sekcja conftest) używa yield – setup startuje serwer, teardown robi `proc.kill()`. Ten sam mechanizm.

```python
@pytest.fixture
def test_todo():
    todo = Todos(title="Learn to code!", owner_id=1, ...)
    db = TestingSessionLocal()
    db.add(todo)
    db.commit()
    yield todo          # <- test dostaje todo
    db.execute(text("DELETE FROM todos"))   # <- cleanup po teście
    db.commit()
    db.close()
```

### Odniesienia
- [pytest – Fixtures](https://docs.pytest.org/en/stable/fixture.html)
- [pytest – Scope](https://docs.pytest.org/en/stable/how-to/fixtures.html#scope)

---

## Lekcja 4: Bazowe klasy testowe i wzorzec GIVEN/WHEN/THEN

### Zagadnienie
Po co w projekcie `BaseUnitTestCase` i `BaseIntegrationTestCase`, jak działa `init_fixtures` z `autouse=True`, oraz kiedy której klasy użyć. Podsumowanie wzorca GIVEN/WHEN/THEN.

### Opis

W `imprv-masterclass-testing` testy nie są "gołymi" funkcjami – dziedziczą po **bazowych klasach**. Po co? Żeby nie powtarzać w każdym teście tych samych parametrów (mocker, db_factory, config, resumes_repository…). Jedna klasa zbiera fixtures i **wkłada je na `self`** – wtedy w metodzie testowej macie np. `self.resumes_repository`, `self.mocker`.

#### BaseUnitTestCase vs BaseIntegrationTestCase

| Klasa | Kiedy używać | Co dostajecie (przykładowo) |
|-------|----------------|-----------------------------|
| **BaseUnitTestCase** | Testy **jednostkowe** – serwis, logika, bez bazy. | `self.mocker`, `self.config`. Sami tworzycie mocki (`self.mocker.Mock(spec=...)`) i wstrzykujecie do serwisu. |
| **BaseIntegrationTestCase** | Testy **integracyjne** – repo, baza, prawdziwe zapytania. | `self.db_client`, `self.db_factory`, `self.resumes_repository`, `self.ml_service`, `self.client` (TestClient), itd. Fixture `resumes_repository` z conftest jest tu wstrzyknięty – prawdziwy obiekt. |

**Testy z rolami (admin vs user):** Gdy override `get_current_user` zwraca mocka (w projektach z `dependency_overrides`), można ustawić `user_role: "admin"` lub `"user"`. Testy endpointów admin wymagają roli admin – zmiana na `"user"` sprawi, że test nie przejdzie (401/403). Override musi wskazywać na funkcje **z tego samego routera**, który testujemy – np. `routers.admin` ma swoje `get_db`, `get_current_user`, inne niż `routers.todos`.

**init_fixtures** to fixture z `autouse=True` – pytest wywołuje ją **automatycznie** przed każdym testem. Przyjmuje w parametrach listę innych fixtures (mocker, config, db_factory, …) i zapisuje je na `self`. Dzięki temu nie piszecie w każdej metodzie `def test_cos(self, mocker, config, db_factory, ...)` – tylko dziedziczycie po bazowej klasie i macie `self.mocker`, `self.config` itd.

#### Wzorzec GIVEN / WHEN / THEN

- **GIVEN** – przygotowanie: dane, mocki, obiekty. "Zakładamy, że mamy taki stan."
- **WHEN** – akcja: wywołanie funkcji lub endpointu. "Robimy coś."
- **THEN** – weryfikacja: asercje na wyniku i ewentualnie na wywołaniach mocków. "Sprawdzamy, że jest tak i tak."

Pełne przykłady (test jednostkowy i integracyjny) są w [studium_przypadku_imprv](/notatki/pytest/pytest-studium_przypadku_imprv). Tu zasada: zawsze starajcie się w testach wyraźnie oddzielić te trzy fazy – wtedy test jest czytelny i łatwy do naprawy.

### Odniesienia
— [studium_przypadku_imprv](/notatki/pytest/pytest-studium_przypadku_imprv) (pełne przykłady GIVEN/WHEN/THEN)

---

## Lekcja 5: pytest.raises – testowanie wyjątków

### Zagadnienie
Jak sprawdzić, że funkcja **rzuca wyjątek** (np. gdy baza się wywali albo walidacja się nie uda). Mechanizm `pytest.raises`.

### Opis

Do tej pory testowaliśmy "happy path" – że wszystko idzie dobrze. Ale w prawdziwym życiu coś się psuje: baza nie odpowiada, użytkownik podał złe dane, serwis zewnętrzny zwrócił 500. Wtedy nasz kod **powinien** rzucić wyjątek. I my chcemy to **przetestować** – że wyjątek faktycznie poleci i że to ten właściwy (np. `ValueError`, a nie inny).

Bez `pytest.raises` wywołanie funkcji, która rzuca, **zabiłoby** test (unhandled exception). Pytest by pokazał czerwony błąd. My natomiast mówimy: "Oczekuję, że w tym bloku kodu wyjątek **zostanie** rzucony – i to jest sukces testu."

#### Składnia

```python
# Oczekujemy, że w tym bloku zostanie rzucony wyjątek. Bez raises – test by padł.
with pytest.raises(Exception) as exc_info:
    service.create_resume(user_id=456, resume=create_patch)

# exc_info.value – ten wyjątek; można sprawdzić typ, komunikat.
assert str(exc_info.value) == "S3 connection timeout"
```

**Co się dzieje:** W bloku `with` wywołujecie kod. Jeśli **nie** rzuci wyjątku – test **nie przejdzie** (pytest.raises oczekuje wyjątku). Jeśli rzuci – test idzie dalej, a `exc_info.value` to ten wyjątek. Możecie sprawdzić typ (`exc_info.type`), komunikat (`str(exc_info.value)`), itd.

#### Przykład z projektu

W `test_service__create_resume.py` jest test `test_create_resume__storage_upload_fails`: mock storage’a ustawiony na `upload_text_file.side_effect = Exception("S3 connection timeout")`. Serwis wywołuje upload – dostaje wyjątek – powinien go "przepuścić" (albo obsłużyć). Test sprawdza:

```python
# Mock storage ma side_effect=Exception – serwis dostaje wyjątek, ma go przepuścić.
with pytest.raises(Exception) as exc_info:
    service.create_resume(user_id=456, resume=create_patch)
assert str(exc_info.value) == "S3 connection timeout"
```

Czyli: oczekujemy wyjątku i sprawdzamy, że komunikat jest dokładnie taki. **Proste jak budowa cepa** – "w tym miejscu ma wybuchnąć, i ma być ten konkretny wybuch."

### Odniesienia
- [pytest – Assertions about expected exceptions](https://docs.pytest.org/en/stable/how-to/assert.html#assertions-about-expected-exceptions)

---

## Lekcja 6: Parametryzacja testów – @pytest.mark.parametrize

### Zagadnienie
Jak uruchomić **ten sam** test z **wieloma** zestawami danych (np. różne wejścia, różne oczekiwane wyniki) bez kopiowania kodu. Dekorator `@pytest.mark.parametrize`.

### Opis

Często macie sytuację: ta sama logika, ale chcecie sprawdzić ją dla 5 różnych wartości. Naiwnie: pięć osobnych funkcji `test_...` prawie identycznych, różniących się tylko liczbami. **Parametryzacja** pozwala napisać **jedną** funkcję testową i podać listę argumentów – pytest uruchomi ten test osobno dla każdego zestawu. Jeden test, wiele przypadków – zero duplikacji.

#### Składnia

```python
# Parametrize – jedna funkcja, wiele zestawów. Pytest uruchomi test_add 3 razy (każdy wiersz).
@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    # a, b, expected – wstrzykiwane z listy. Zero duplikacji kodu.
    assert add(a, b) == expected
```

Pytest wywoła `test_add` trzy razy: raz z (1, 2, 3), raz z (0, 0, 0), raz z (-1, 1, 0). W raporcie zobaczcie np. `test_add[1-2-3]`, `test_add[0-0-0]` – każdy zestaw to osobny "minitest". Jeśli jeden zestaw się wywali, pozostałe i tak się wykonają. **Proste jak budowa cepa** – jak tabelka: wiersze to przypadki, kolumny to argumenty.

#### Po co to w projekcie

Np. testowanie walidacji: "dla pustego stringa błąd, dla za długiego błąd, dla poprawnego OK". Zamiast trzech funkcji – jedna sparametryzowana. W projektach typu `imprv-masterclass-testing` parametrize przydaje się przy testach brzegowych (edge cases): ten sam endpoint, różne body lub query – jeden test, wiele wejść.

### Odniesienia
- [pytest – Parametrize](https://docs.pytest.org/en/stable/how-to/parametrize.html)

---

## Lekcja 7: TestClient FastAPI – testy endpointów

### Zagadnienie
Jak testować **endpointy HTTP** (GET, POST, itd.) bez uruchamiania prawdziwego serwera. Klient testowy `TestClient` z FastAPI.

### Opis

Normalnie odpalamy serwer (uvicorn), wchodzimy w Postmana albo przeglądarkę i klikamy. W testach nie chcemy stawiać serwera na porcie i czekać – chcemy **w pamięci** wysłać request i dostać response. Do tego służy **TestClient** z `fastapi.testclient`: opakowujecie aplikację FastAPI i wywołujecie metody `.get()`, `.post()`, `.put()` itd. Wszystko dzieje się w tej samej procesie – bez sieci, bez portu. Błyskawicznie.

#### Skąd się bierze

`from fastapi.testclient import TestClient`. TestClient pochodzi z FastAPI (a pod spodem z Starlette). Nie jest częścią pytest – pytest tylko uruchamia Wasz kod; w tym kodzie tworzycie `client = TestClient(app)` i używacie `client.get("/path")`.

#### Podstawowe użycie

```python
from fastapi.testclient import TestClient
from main import app   # albo from masterclass_api.entrypoints.api import api

# TestClient – opakowuje app, wysyła requesty w pamięci (bez żywego serwera).
client = TestClient(app)

def test_health():
    # GET do endpointu – response ma status_code, json(), headers.
    response = client.get("/healthy")
    assert response.status_code == 200
    assert response.json() == {"status": "Healthy"}
```

`response` ma m.in. `.status_code`, `.json()`, `.headers`. Asercje robicie na tym – czy status 200, czy body się zgadza. Dla POST: `client.post("/resumes", json={"title": "..."})` – body jako słownik, FastAPI sam to zserializuje.

#### W projekcie imprv-masterclass-testing

W `BaseIntegrationTestCase` w `setUp` jest `self.client = TestClient(app=api)`. Testy integracyjne i E2E używają więc `self.client.get(...)`, `self.client.post(...)` – ten sam klient dla wielu testów. Testy **jednostkowe** serwisu nie używają TestClient – tam testujecie sam serwis (funkcje Pythona). TestClient pojawia się tam, gdzie testujecie **warstwę HTTP** (routery, endpointy). Proste: HTTP = TestClient, sama logika = wywołanie funkcji.

#### Alternatywa: app.dependency_overrides (projekty bez Bootstrapa)

W typowych projektach FastAPI (bez Bootstrap) używa się **`app.dependency_overrides`** – słownik, w którym podmieniamy zależności na wersje testowe:

- **Override `get_db`** – endpoint dostaje testową sesję (np. SQLite) zamiast produkcyjnej bazy. Funkcja `override_get_db()` z `yield` zwraca sesję testową.
- **Override `get_current_user`** – mock zalogowanego użytkownika bez JWT. Zamiast dekodowania tokena zwracamy np. `{"username": "testuser", "id": 1, "user_role": "admin"}`.

```python
from main import app
from database import get_db
from routers.auth import get_current_user

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {"username": "testuser", "id": 1, "user_role": "admin"}

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user
```

Imprv używa Bootstrapa – inna architektura, ten sam cel: testowa baza, mock user. Dokumentacja: [FastAPI – Testing Dependencies](https://fastapi.tiangolo.com/advanced/testing-dependencies/).

### Odniesienia
- [FastAPI – Testing](https://fastapi.tiangolo.com/tutorial/testing/)

---

## Lekcja 8: Testowanie async i testowa baza (uzupełnienie)

### Zagadnienie
Jak testować funkcje `async def` w pytest oraz jak wygląda testowa baza w projektach bez Bootstrapa.

### Opis

#### pytest-asyncio – testowanie funkcji async

Pytest domyślnie nie obsługuje funkcji `async def`. Gdy testujecie np. `get_current_user(token: str)`, która jest asynchroniczna, potrzebujecie **`pytest-asyncio`**:

```bash
pip install pytest-asyncio
```

```python
import pytest
from routers.auth import get_current_user

@pytest.mark.asyncio   # Ważne! Bez tego test będzie skipped
async def test_get_current_user_valid_token():
    token = jwt.encode({"sub": "testuser", "id": 1, "role": "admin"}, SECRET_KEY, algorithm=ALGORITHM)
    user = await get_current_user(token=token)
    assert user == {"username": "testuser", "id": 1, "user_role": "admin"}
```

Bez dekoratora `@pytest.mark.asyncio` test byłby **pominięty** (skipped). Imprv używa `IsolatedAsyncioTestCase` (unittest) – pytest-asyncio to odpowiednik w "czystym" pytest.

#### Testowa baza SQLite (projekty bez Bootstrapa)

W projektach z `Depends(get_db)` – osobna baza testowa. Zamiast produkcyjnego PostgreSQL/MySQL tworzycie SQLite w pliku `test.db`:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from database import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)
```

`override_get_db` z `yield` przekazuje tę sesję do endpointów. Imprv ma Bootstrap + PostgreSQL testową; typowy FastAPI – SQLite + override. Oba podejścia osiągają ten sam cel: testy nie dotykają produkcji.

### Odniesienia
- [pytest-asyncio](https://pytest-asyncio.readthedocs.io/)

---

### Odniesienia (zbiorcze)
- [Pytest – Getting Started](https://docs.pytest.org/en/stable/getting-started.html)
- [Pytest – Fixtures](https://docs.pytest.org/en/stable/fixture.html)
- [pytest-mock](https://pytest-mock.readthedocs.io/en/latest/)
- [unittest.mock – Mock object library](https://docs.python.org/3/library/unittest.mock.html)
