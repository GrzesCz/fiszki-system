---
title: "Notatki: Pytest – testy, fixtures, mocking | Moduł 3: Web Framework"
category: "Pytest"
---
# Notatki: Pytest – testy, fixtures, mocking | Moduł 3: Web Framework

Źródła: oficjalna dokumentacja pytest, projekt `imprv-masterclass-testing`, notatki z kursu pytest (Udemy – FastAPI The Complete Course), rozmowa z mentorem.

**Temat:** Framework `Pytest` – pisanie testów jednostkowych i integracyjnych, fixtures, parametryzacja, mocking, testowanie FastAPI.

**Projekt referencyjny:** `TESTOWANIE - PYTEST/imprv-masterclass-testing` – profesjonalny przykład testowania aplikacji FastAPI z bazą danych, AI i storage.

---

## Lekcja 1: Czym jest testowanie? Pytest vs unittest. Podstawowe pojęcia

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

#### Trzy sposoby przeprowadzania testów

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

#### Struktura testów

```
tests/
├── __init__.py          # Klasy bazowe: BaseTestCase, BaseUnitTestCase,
│                        # BaseIntegrationTestCase, BaseE2ETestCase
├── conftest.py          # Wspólne fixtures: config, bootstrap, db_client,
│                        # db_factory, resumes_repository, fastapi_server, itd.
├── factory.py           # DbFactory – clear(), create_user() do danych w bazie
│
├── unit/                # Testy jednostkowe (mocki, bez bazy i HTTP)
│   └── contexts/
│       └── resumes/
│           └── test_service__create_resume.py   # BaseUnitTestCase
│
├── integration/         # Testy integracyjne (prawdziwa baza, repo, bez HTTP)
│   └── contexts/
│       └── resumes/
│           └── test_resumes_repository__create_resume.py   # BaseIntegrationTestCase
│
├── e2e/                 # Testy end-to-end (request → serwer → baza/storage)
│   └── contexts/
│       └── resumes/
│           └── test_resumes_api__create_resume.py   # BaseE2ETestCase
│
└── llm/                 # Testy z modelem LLM (Deepeval + YAML)
    ├── __init__.py      # LLMIntegrationTestCase(BaseIntegrationTestCase)
    └── contexts/
        └── ml/
            ├── test_ml_service__generate_resume_summary.py
            └── _assets/
                └── test_ml_service__generate_resume_summary.yaml
```

### Podsumowanie – co jest po co ?

| Element | Rola |
|--------|------|
| **`__init__.py`** | Definiuje klasy bazowe testów i to, co każdy typ testów dostaje na `self`. |
| **`conftest.py`** | Wspólne fixtures pytest (config, baza, bootstrap, repo, serwer). |
| **`factory.py`** | Helper do czyszczenia bazy i tworzenia użytkowników (integration/e2e). |
| **`unit/`** | Testy jednej klasy na mockach (np. ResumesService). |
| **`integration/`** | Testy z prawdziwą bazą i repo (np. repozytorium resumes). |
| **`e2e/`** | Testy pełnej ścieżki przez HTTP (API → baza/storage). |
| **`llm/`** | Testy z LLM + zestawy przypadków z YAML. |

Ścieżki `contexts/resumes/` i `contexts/ml/` w testach odzwierciedlają moduły w aplikacji (`masterclass_api.contexts.resumes`, `masterclass_api.contexts.ml`).

#### Dlaczego taki podział katalogów? (unit / integration / e2e / llm)

Struktura ta wynika z **dobrych praktyk i doświadczenia**. Daje dwie główne korzyści:

1. **Przejrzystość** – wiadomo, gdzie są jakie testy (np. unit w `unit/`, e2e w `e2e/`), zamiast mieszania wszystkiego w jednym miejscu.
2. **Selektywne uruchamianie** – możliwość uruchamiania tylko wybranych typów testów (np. szybkie unit przed commitem, pełne na CI).

**Przykładowy scenariusz w CI/CD:**

| Moment | Co uruchomić | Komenda |
|--------|--------------|---------|
| Przed każdym commitem (lokalnie) | Tylko unit – szybkie | `pytest tests/unit` |
| Przy pushu na CI | unit → integration → e2e | `pytest tests/unit` → `pytest tests/integration` → `pytest tests/e2e` |
| Cyklicznie (np. codziennie rano) | Testy LLM (wolne, kosztowne) | `pytest tests/llm` (np. jako job w GitHub Actions) |

**Alternatywa:** zamiast osobnego katalogu `llm/` można użyć markera: `@pytest.mark.llm` na klasie testowej i uruchamiać `pytest -m "llm" tests`. Podział na katalogi to jeden z popularnych sposobów – czytelność jest głównym celem, selektywne uruchamianie jest efektem ubocznym.

### Omówienie plików `__init__.py`, conftest.py, factory.py

#### tests/__init__.py – wszystkie klasy bazowe

No to weźmy te klasy bazowe. Po co one w ogóle są? Żeby nie powtarzać tego samego w każdym pliku testowym – jedna szafa z narzędziami, każdy typ testów bierze z niej to, czego potrzebuje.

**Co to jest klasa bazowa?** 

Klasa, po której dziedziczą konkretne testy. Daje wspólne zachowanie (setUp, fixture'y, atrybuty na `self`) bez powtarzania kodu w każdym pliku. 

**Dziedziczenie:** `class Dziecko(Baza)` – dziecko dostaje wszystko, co ma baza. Widzicie? Nie kopiujecie – dziedziczycie.

**Hierarchia (kto od kogo):**

```
IsolatedAsyncioTestCase   (unittest, biblioteka standardowa Pythona)
         ↑
BaseTestCase              (wspólny korzeń)
         ↑
    ┌────┴────┬─────────────────────┐
    ↑         ↑                     ↑
BaseUnitTestCase   BaseIntegrationTestCase
    ↑                   ↑
[testy w unit/]         ↑
                 BaseE2ETestCase
                       ↑
                 [testy w e2e/]

                 BaseIntegrationTestCase
                       ↑
                 LLMIntegrationTestCase  (w tests/llm/__init__.py)
                       ↑
                 [testy w llm/]
```

---

**1. BaseTestCase**

```python
class BaseTestCase(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        # Ustawia wspólny punkt w czasie dla całego testu (np. przy sprawdzaniu dat).
        # Wywoływane automatycznie przed każdą metodą testową (konwencja unittest).
        self.now = datetime.now(timezone.utc)
```

- **Z czego dziedziczy:** `unittest.IsolatedAsyncioTestCase` (z modułu `unittest` – wbudowany w Pythona od 3.8).

- **Po co IsolatedAsyncioTestCase?**

    FastAPI i wiele komponentów w imprv używa **async/await** (`async def`). 
     
    Gdy test wywołuje taki kod, musi sam być async – np. `async def test_create_resume_success(self)`.
     
    Zwykły `unittest.TestCase` nie umie uruchomić funkcji async – potrzebna jest **pętla zdarzeń (event loop)**. `IsolatedAsyncioTestCase` dostarcza tę pętlę: przed każdym testem tworzy nową, uruchamia w niej `await`, po teście sprząta. *Isolated* = każdy test ma własną pętlę – testy się nie mieszają. Dzięki temu BaseTestCase działa zarówno z testami sync (`def test_...`), jak i async (`async def test_...`). W imprv np. `test_create_resume_success` jest async – bo repository czy serwis używają await.

- **Potrzebny w testach:** unit, integration, e2e, llm – wszyscy dziedziczą z BaseTestCase (bezpośrednio lub pośrednio).
- **Do czego służy:** Wspólny korzeń dla wszystkich testów (unit, integration, e2e). Jedno miejsce na zachowanie wspólne dla każdego typu.
- **Co robi:** Definiuje tylko `setUp(self)` – wywoływane automatycznie przed każdym testem (konwencja unittest). Ustawia `self.now = datetime.now(timezone.utc)` – wspólny punkt w czasie dla całego testu (np. przy sprawdzaniu dat). *setUp:* metoda z unittest – framework wywołuje ją przed każdą metodą testową. W testach unitowych często nieużywane.
- **Na `self`:** `self.now`.

*W skrócie:* Fundament – wszyscy stoją na tym samym. Jak wspólny dach nad całą budową testów.

---

**2. BaseUnitTestCase**

```python
class BaseUnitTestCase(BaseTestCase):
    @pytest.fixture(scope="function", autouse=True)
    def init_fixtures(
        self,
        config: Config,
        mocker: MockerFixture,
    ) -> None:
        # autouse=True – pytest wywołuje automatycznie przed każdym testem.
        # Wstrzykuje mocker i config na self – testy mają self.mocker, self.config.
        self.mocker = mocker
        self.config = config
```

- **Z czego dziedziczy:** `BaseTestCase`.
- **Po co BaseUnitTestCase?** 

    Test jednostkowy ma sprawdzać **tylko logikę jednego komponentu** – np. czy `ResumesService` poprawnie wywołuje repository, storage i ML, czy zwraca dobry wynik. Nie ma testować bazy, sieci ani OpenAI – to byłby test integracyjny. Dlatego wstrzykujecie **mocki** (atrapy): `mock_repository.create_resume.return_value = fake_resume`. Serwis myśli, że dostał prawdziwe obiekty – a to tylko lalki. Test trwa milisekundy, nie potrzebuje PostgreSQL ani internetu. `init_fixtures` daje tylko `mocker` (do tworzenia atrap) i `config` – nic więcej. Po co `db_client` czy `TestClient`? Testujecie funkcję Pythona, nie endpoint HTTP. *autouse=True* – fixture uruchamiany automatycznie przed każdym testem, nie wpisujecie go w parametrach.
- **Potrzebny w testach:** tylko **unit** (np. `test_service__create_resume.py`).
- **Do czego służy:** Baza dla testów **jednostkowych** (katalog `tests/unit/`). Testujesz jedną klasę (np. `ResumesService`) w izolacji – wszystko poza nią to mocki. Bez bazy, bez HTTP.
- **Co robi:**

     Ma fixture `init_fixtures` oznaczony dekoratorem `@pytest.fixture(scope="function", autouse=True)`. `autouse=True` sprawia, że pytest wywołuje ten fixture **automatycznie** przed każdym testem – nie trzeba go wpisywać w parametrach metody testowej.
     
    Fixture przyjmuje `config` (z `conftest.py`) i `mocker` (z pluginu `pytest-mock`). Pytest wstrzykuje te obiekty jako argumenty, a `init_fixtures` zapisuje je na `self`: `self.mocker = mocker`, `self.config = config`. Dzięki temu w każdej metodzie testowej (np. `def test_create_resume__success(self)`) masz dostęp do `self.mocker` i `self.config` bez ręcznego przekazywania – fixture wykonał się wcześniej i przypisał je do instancji testu. *Scope="function"* oznacza, że fixture jest tworzony na nowo przed każdym testem – każdy test dostaje świeże obiekty.
- **Na `self`:** `self.mocker` (z pytest-mock – do tworzenia atrap/mocków, np. `self.mocker.Mock(spec=...)`), `self.config` (z conftest). Plus `self.now` z BaseTestCase.


*W skrócie:* Unit nie potrzebuje bazy ani HTTP – tylko mocker (atrapy) i config. Testujesz jeden klocek, reszta to atrapy. Szybko, tanio, w izolacji.

---

**3. BaseIntegrationTestCase**

```python
class BaseIntegrationTestCase(BaseTestCase):
    @pytest.fixture(scope="function", autouse=True)
    def init_fixtures(
        self,
        mocker: MockerFixture,
        db_factory: DbFactory,
        config: Config,
        db_client: DBClient,
        data_do_space_client,
        resumes_repository: AbstractResumesRepository,
        ml_service: AbstractMLService,
    ) -> None:
        # Wstrzykuje fixtures z conftest na self – prawdziwa baza, repo, serwisy.
        self.mocker = mocker
        self.config = config
        self.db_client = db_client
        # ... (reszta przypisań na self)
    def setUp(self) -> None:
        # Przed każdym testem: czysta baza, sprzątanie storage, TestClient w pamięci.
        super().setUp()
        self.db_factory.clear()
        self.clear_test_files_from_do_spaces()
        self.client = TestClient(app=api)
```

- **Z czego dziedziczy:** `BaseTestCase`.
- **Po co BaseIntegrationTestCase?** 

    Test jednostkowy sprawdza serwis na mockach – ale czy `ResumesRepository` faktycznie zapisuje do bazy? Czy SQL jest poprawny? Czy transakcje działają? Tego mock nie pokaże. Test integracyjny łączy **prawdziwe komponenty**: repository + baza PostgreSQL + storage (DO Spaces).
    
     Wywołujecie `self.resumes_repository.create_resume(...)` – to prawdziwy INSERT. Potem `SELECT` i sprawdzacie, czy dane są w tabeli. *Bez żywego serwera HTTP* – nie startujecie uvicorn na porcie 8000. Zamiast tego `TestClient(app=api)` – FastAPI w pamięci, requesty idą „wewnętrznie", bez sieci. Szybsze niż e2e, ale sprawdza realną współpracę repo ↔ baza ↔ storage. `setUp` przed każdym testem: `db_factory.clear()` (pusta tabela), `clear_test_files_from_do_spaces()` (sprzątanie plików), `TestClient` – świeży stan, zero śladów po poprzednim teście.
- **Potrzebny w testach:** **integration** (np. `test_resumes_repository__create_resume.py`), **e2e** (dziedziczy BaseE2ETestCase → BaseIntegrationTestCase), **llm** (LLMIntegrationTestCase dziedziczy z BaseIntegrationTestCase).
- **Do czego służy:** Baza dla testów **integracyjnych** (katalog `tests/integration/`). Prawdziwa baza, prawdziwe repozytorium, bez uruchamiania serwera HTTP. Sprawdza, czy komponenty (repo, baza) ze sobą działają.
- **Co robi:** Fixture `init_fixtures` wstrzykuje na `self`: mocker, config, db_client, db_factory, resumes_repository, ml_service, data_do_space_client. Metoda `setUp()` wywołuje `super().setUp()`, czyści tabelę (`db_factory.clear()`), sprząta pliki w DO Spaces, tworzy `self.client = TestClient(app=api)`. Dodatkowe metody: `clear_test_files_from_do_spaces()`, `generate_random_test_path()`, `cleanup_test_file()`.
- **Na `self`:** `self.mocker`, `self.config`, `self.db_client`, `self.db_factory`, `self.resumes_repository`, `self.ml_service`, `self.data_do_space_client`, `self.client` (TestClient). Plus `self.now` z BaseTestCase.
- **Po co mocker w Integration?** W imprv testy integration, e2e i llm **nie używają** mocków – mają prawdziwą bazę, repo, storage. Mocker jest w `init_fixtures` prawdopodobnie dla spójności (wszystkie klasy bazowe mają podobną strukturę) albo na wypadek edge case: np. test integracyjny z prawdziwą bazą, ale zmockowanym zewnętrznym API (OpenAI, płatności). W typowym teście integracyjnym `self.mocker` nie jest używany – można go traktować jako opcjonalny.

*W skrócie:* Prawdziwa baza, prawdziwe repo, prawdziwy storage. TestClient w pamięci – bez portu 8000. Sprawdzacie, czy klocki ze sobą gadają. Wolniej niż unit, szybciej niż e2e.

---

**4. BaseE2ETestCase**

```python
class BaseE2ETestCase(BaseIntegrationTestCase):
    @pytest.fixture(scope="function", autouse=True)
    def init_e2e_fixtures(self, fastapi_server) -> None:
        # Wstrzykuje żywy serwer (localhost:8000) – testy wysyłają prawdziwe HTTP.
        self.fastapi_server = fastapi_server

    def url(self, path: str) -> str:
        # Buduje pełny URL do API – np. url("/resumes") → http://localhost:8000/api/v0/resumes
        return f"http://localhost:8000/api/v0{path}"
    # api_post(), api_get(), api_put(), api_patch(), api_delete() ...
```

- **Z czego dziedziczy:** `BaseIntegrationTestCase` (więc ma wszystko z Integration).
- **Po co BaseE2ETestCase?**

    Test integracyjny wywołuje repository czy serwis **bezpośrednio** – nie przez HTTP. Ale w produkcji użytkownik wysyła POST do `/api/v0/resumes`. 

    **Czy router poprawnie parsuje body?**
    **Czy middleware działa?**
    **Czy autoryzacja (Bearer token) przechodzi?**
    
    Tego integration nie sprawdzi. E2E uruchamia **żywy serwer** (uvicorn na localhost:8000) i wysyła **prawdziwe requesty HTTP** – jak w Postmanie. Cała ścieżka: sieć → FastAPI → router → serwis → repo → baza → storage. Fixture `fastapi_server` startuje serwer w osobnym procesie (conftest), `init_e2e_fixtures` wstrzykuje go na `self`.
    
    Metody `api_post()`, `api_get()` – helpery z nagłówkiem Authorization (token z `get_auth_token`) i URL przez `url(path)`. Najwolniejszy typ testów, ale jedyny, który sprawdza cały stos.

- **Potrzebny w testach:** tylko **e2e** (np. `test_resumes_api__create_resume.py`).
- **Do czego służy:** Baza dla testów **end-to-end** (katalog `tests/e2e/`). Pełna ścieżka: wysyłanie prawdziwych requestów HTTP do działającego serwera (localhost:8000), odpowiedź, baza, storage.
- **Co robi:** Fixture `init_e2e_fixtures` wstrzykuje `fastapi_server` (żywy serwer). Metody pomocnicze: `url(path)` – pełny URL do API, `get_auth_token(user_id)` – token do nagłówka Authorization, `api_post()`, `api_get()`, `api_put()`, `api_patch()`, `api_delete()` – wysyłanie requestów z autoryzacją. *get_auth_token:* koduje user_id w base64 – uproszczona autoryzacja w testach (Bearer token).
- **Na `self`:** Wszystko z BaseIntegrationTestCase plus `self.fastapi_server` (z fixture'a). Używa się głównie `self.api_post()`, `self.api_get()` itd. oraz `self.db_factory`, `self.url()`.

*W skrócie:* Żywy serwer, prawdziwe HTTP, cały stos. Jak użytkownik – wysyłasz request, sprawdzasz odpowiedź i dane w bazie. Najwolniejsze, ale najpełniejsze.

---

**5. LLMIntegrationTestCase** (w pliku `tests/llm/__init__.py`, nie w `tests/__init__.py`)

```python
class LLMIntegrationTestCase(BaseIntegrationTestCase):
    @staticmethod
    def load_test_cases(current_file: Path, file_name: str) -> list[dict]:
        # Ładuje przypadki testowe z pliku YAML w _assets/ – nie w kodzie.
        ...
    def model_for_evaluations(self, model_name: str = "gpt-4o-mini") -> DeepEvalBaseLLM:
        # Zwraca model LLM do ewaluacji (Deepeval) – np. GPT do generowania podsumowań.
        return GPTModel(model=model_name, api_key=self.config.openai.api_key)
```

- **Z czego dziedziczy:** `BaseIntegrationTestCase`.
- **Po co LLMIntegrationTestCase?** Testowanie modeli AI (LLM) jest inne niż zwykła logika: wynik z GPT nie jest deterministyczny – ten sam prompt może dać różne odpowiedzi. Zamiast `assert result == "dokładnie ten tekst"` używa się **ewaluacji semantycznej** – czy odpowiedź jest sensowna, czy spełnia kryteria. **Deepeval** to biblioteka do testów LLM: definiujecie przypadki (input → oczekiwane kryteria) i Deepeval ocenia output modelu. W imprv przypadki są w plikach **YAML** w `_assets/` – nie w kodzie. Łatwo dodać nowy przypadek bez pisania Pythona. `load_test_cases()` ładuje te pliki. `model_for_evaluations()` zwraca model (np. GPT-4o-mini) skonfigurowany pod Deepeval – test wywołuje `ml_service.generate_resume_summary()`, Deepeval ocenia jakość. Dziedziczy z BaseIntegrationTestCase – ma prawdziwą bazę, prawdziwy ML service, prawdziwe wywołania do OpenAI. Wolne (API OpenAI kosztuje), często uruchamiane osobno (`@pytest.mark.llm`).
- **Potrzebny w testach:** tylko **llm** (np. `test_ml_service__generate_resume_summary.py`).
- **Do czego służy:** Testy z modelem LLM (Deepeval) – np. generowanie podsumowań CV. Korzysta z zestawów przypadków w plikach YAML w `_assets/`.
- **Co robi:** `load_test_cases(current_file, file_name)` – ładuje przypadki z YAML. `model_for_evaluations()` – zwraca model do ewaluacji (np. GPT). Konkretne testy w `tests/llm/contexts/ml/`.

*W skrócie:* Integration + LLM + Deepeval. Przypadki w YAML, ewaluacja semantyczna zamiast exact match. Wolne, często z markerem `@pytest.mark.llm`.

---

### tests/conftest.py – fixtures pytest

Pytest ładuje ten plik **automatycznie** – nie trzeba go importować. To jak szafa na początku korytarza: każdy test może z niej skorzystać, podając nazwę fixture'a w parametrze. Wszystkie „przygotowacze” w jednym miejscu. 

**W imprv** w `tests/conftest.py` są m.in.: 
1. `config` (konfiguracja testowa),
2. `bootstrap` (composition root – baza, repo, serwisy),
3. `db_client`, `db_factory` (helper do danych w bazie),
4. `resumes_repository`,
5 `fastapi_server` (dla e2e), `data_do_space_client`, `openai_client`, `ml_service`. Testy unit, integration, e2e i llm biorą stąd to, czego potrzebują (przez `init_fixtures` w klasach bazowych albo bezpośrednio).

**Hierarchia zależności (kto od kogo):**

```
config
  ↑
bootstrap(config)
  ↑
db_client(bootstrap)     data_do_space_client(bootstrap)    openai_client(bootstrap)    ml_service(bootstrap)
  ↑
db_factory(db_client)

resumes_repository(bootstrap)   ← scope="function" (osobno)
fastapi_server                  ← osobno, dla e2e
```

---

**1. config**

```python
@pytest.fixture(scope="session")
def config():
    # Konfiguracja testowa – debug=True (szczegółowe błędy). Session = raz na całą sesję.
    config = Config()
    config.debug = True
    return config
```

- **Co robi:** Tworzy obiekt `Config` (z .env), ustawia `debug=True` dla testów. *debug=True:* włącza tryb deweloperski – bardziej szczegółowe błędy, pełne stack trace'e zamiast krótkich komunikatów (gdyby aplikacja z tego korzystała).
- **Potrzebny w testach:** unit, integration, e2e, llm – wszyscy (przez init_fixtures lub zależności).
- **Scope:** `session` – jedna instancja na całe uruchomienie pytest (nie przed każdym testem). Oszczędność – nie ładujemy konfiguracji wielokrotnie.
- **Skąd się bierze:** Z pliku `masterclass_api/config.py` – `Config` dziedziczy z BaseSettings (Pydantic), czyta zmienne env.

*W skrócie:* Jedna konfiguracja testowa na całą sesję. Fundament – reszta fixtures z niego korzysta.

---

**2. bootstrap**

```python
@pytest.fixture(scope="session")
def bootstrap(config: Config):
    # Composition root – składa całą aplikację (baza, repo, serwisy). Przyjmuje config.
    return Bootstrap(config=config)
```

- **Co robi:** Tworzy **Bootstrap** – „szef budowy”, który składa całą aplikację (baza, repo, serwisy, klienty). Jedno miejsce, gdzie wszystko się łączy. *Composition root:* wzorzec – jedna klasa tworzy i łączy wszystkie zależności.
- **Potrzebny w testach:** integration, e2e, llm (nie unit – unit ma tylko config i mocker).
- **Zależność:** Przyjmuje `config` – pytest najpierw wywołuje fixture `config`, wynik przekazuje tutaj.
- **Scope:** `session` – Bootstrap jest drogi do postawienia (baza, klienty, repo), więc raz na sesję. *session:* fixture żyje przez całe uruchomienie pytest.

**Po co w ogóle Bootstrap?** Problem: `ResumesService` potrzebuje `ml_service`, `resumes_repository`, `storage_client`, `resumes_config`. `ResumesRepository` potrzebuje `db_client`. `DBClient` potrzebuje `ConnectionPool`. I tak dalej – łańcuch zależności. Gdyby router sam tworzył `ResumesService`, musiałby znać cały ten łańcuch i budować go ręcznie. Duplikacja, łatwo o błąd. **Bootstrap** – jedna klasa w `masterclass_api/bootstrap.py` – tworzy i łączy wszystko: `db_connection_pool` (psycopg_pool) → `db_client` → `data_do_space_client`, `openai_client` → `resumes_repository`, `ml_service` → `resumes_service`. Jedno miejsce, jedna logika.

**Gdzie jest używany?** (1) **W aplikacji:** FastAPI ma `get_resumes_service(bootstrap: Bootstrap = Depends(get_bootstrap))` – endpoint dostaje gotowy `ResumesService` przez dependency injection. (2) **W testach:** fixture `bootstrap(config)` – testy dostają ten sam Bootstrap, ale z config testową (np. `debug=True`, baza testowa). Z niego biorą `db_client`, `resumes_repository`, `ml_service` itd. Widzicie? Aplikacja i testy – ta sama struktura, inna konfiguracja. Proste jak budowa cepa.

**Co dokładnie tworzy Bootstrap?** (plik `masterclass_api/bootstrap.py`): `db_connection_pool` (ConnectionPool z psycopg_pool – pula połączeń do PostgreSQL), `db_client` (DBClient), `data_do_space_client` (storage S3/DO Spaces), `openai_client`, `resumes_repository` (ResumesRepository), `ml_service` (MLService), `resumes_service` (ResumesService). Wszystko z `_config` – host bazy, klucze API, itd.

*W skrócie:* Bootstrap = composition root. Jedna fabryka – wiele produktów. Bez niego: każdy test musiałby ręcznie tworzyć ConnectionPool, DBClient, repo, serwisy. Z Bootstrapem: `bootstrap(config)` – i macie cały świat aplikacji.

---

**3. db_client**

```python
@pytest.fixture(scope="session")
def db_client(bootstrap: Bootstrap):
    # Zwraca klienta bazy z Bootstrapa – prawdziwe połączenie do bazy testowej.
    return bootstrap.db_client
```

- **Co robi:** Zwraca klienta bazy danych z Bootstrapa. Prawdziwe połączenie do bazy testowej.
- **Potrzebny w testach:** integration, e2e, llm (przez db_factory i bezpośrednio).
- **Zależność:** `bootstrap` – musi być najpierw Bootstrap.
- **Scope:** `session`.

*W skrócie:* Prawdziwa baza. Używane w integration i e2e – do zapytań, transakcji, db_factory.

---

**4. db_factory**

```python
@pytest.fixture(scope="session")
def db_factory(db_client: DBClient):
    # Tworzy DbFactory – helper do clear() i create_user() w testach integration/e2e.
    return DbFactory(db_client=db_client)
```

- **Co robi:** Tworzy `DbFactory` – helper do testów: `clear()` (czyści tabele), `create_user()` (tworzy użytkownika w bazie). *DbFactory:* narzędzie do przygotowania danych testowych – zamiast pisać SQL ręcznie, wywołujecie `create_user()` i macie użytkownika.
- **Potrzebny w testach:** integration, e2e, llm (do clear() w setUp i create_user() w testach).
- **Zależność:** `db_client` – factory potrzebuje klienta do wykonywania zapytań.
- **Scope:** `session`. Sam factory jest lekki; dane w bazie czyścicie w `setUp` testów (db_factory.clear()).

*W skrócie:* Narzędzie do przygotowania danych w bazie. `create_user()` – i macie użytkownika. `clear()` – czysta tabela przed testem.

---

**5. resumes_repository**

```python
@pytest.fixture(scope="function")
def resumes_repository(bootstrap: Bootstrap) -> AbstractResumesRepository:
    # Prawdziwe repo (nie mock) – pisze do bazy. Scope function = świeży przed każdym testem.
    return bootstrap.resumes_repository
```

- **Co robi:** Zwraca prawdziwe repozytorium resumes z Bootstrapa. Nie mock – prawdziwy obiekt, który pisze do bazy. *Repository:* warstwa dostępu do danych – `create_resume()` robi prawdziwy INSERT.
- **Potrzebny w testach:** integration, llm (e2e używa API, ale BaseIntegrationTestCase ma init_fixtures z resumes_repository – więc e2e też go dostaje).
- **Zależność:** `bootstrap`.
- **Scope:** `function` – przed każdym testem można dostać „świeży” repo *function:* fixture tworzony na nowo przed każdym testem (w przeciwieństwie do session – raz na całą sesję).

*W skrócie:* Prawdziwe repo. Testy integracyjne go używają – `self.resumes_repository.create_resume(...)` to prawdziwy INSERT.

---

**6. fastapi_server**

```python
@pytest.fixture(scope="session")
def fastapi_server():
    # Uruchamia serwer FastAPI w osobnym procesie. Kod przed yield = setup, po yield = teardown.
    if is_port_in_use(8000):
        yield  # Port zajęty – nic nie robi, tylko yield
    else:
        proc = Process(target=run_server, args=(), daemon=True)
        proc.start()
        sleep(5)
        yield  # Serwer działa – testy się wykonują – potem proc.kill()
        proc.kill()
```

- **Co robi:** Uruchamia **żywy serwer** FastAPI na localhost:8000 (w osobnym procesie). Dla testów e2e – wysyłacie prawdziwe requesty HTTP. Jeśli port 8000 już zajęty (np. ręcznie odpalony serwer) – nic nie robi, tylko yield.
- **Potrzebny w testach:** tylko **e2e** (fixture init_e2e_fixtures w BaseE2ETestCase).

**Yield w fixture – co robi?** W fixture z `yield` pytest traktuje to jak generator: **kod przed yield** = setup (uruchamiany przed testami), **yield** = pauza (oddaje kontrolę pytestowi), **kod po yield** = teardown (uruchamiany po zakończeniu testów). `yield` nie czeka na zakończenie procesu serwera – serwer działa w tle. `yield` wstrzymuje **fixture**, nie proces. Pytest uruchamia testy (serwer już działa), gdy testy się skończą – pytest wznawia fixture i wykonuje kod po yield (np. `proc.kill()`). Dzięki temu serwer jest wyłączany po testach. *Dlaczego yield a nie return?* Z `return` nie byłoby kiedy wywołać `proc.kill()` – teardown musi być po testach, więc potrzebny jest yield.
- **Scope:** `session` – serwer startuje raz, wszystkie testy e2e go współdzielą.
- **Skąd się bierze:** `uvicorn.run(api, port=8000)` w osobnym procesie (multiprocessing). *uvicorn:* serwer ASGI – uruchamia aplikację FastAPI na podanym porcie.

*W skrócie:* Dla e2e. Żywy serwer na 8000. Bez tego testy e2e nie miałyby dokąd wysłać requesta.

---

**7. data_do_space_client, openai_client, ml_service**

```python
@pytest.fixture(scope="session")
def data_do_space_client(bootstrap: Bootstrap):
    # Klient storage (S3/DO Spaces) z Bootstrapa – do uploadu plików w testach.
    return bootstrap.data_do_space_client
# openai_client, ml_service – analogicznie
```

- **Co robi:** Zwracają klienta storage (DO Spaces/S3), klienta OpenAI, serwis ML – wszystko z Bootstrapa. *DO Spaces:* usługa storage (kompatybilna z S3). *OpenAI:* serwis AI – generowanie podsumowań CV.
- **Potrzebny w testach:** integration, e2e, llm (ml_service – llm; data_do_space_client – integration, e2e; openai_client – llm).
- **Zależność:** `bootstrap`.
- **Scope:** `session`.

*W skrócie:* Prawdziwe zewnętrzne serwisy. Integration i e2e ich używają – upload plików, wywołania AI itd.

---

#### tests/factory.py – DbFactory

No to factory. DbFactory to **helper do przygotowania danych w bazie** – zamiast pisać SQL ręcznie w każdym teście, wywołujecie `create_user()` i macie użytkownika. Albo `clear()` – i tabela jest pusta. Proste jak budowa cepa.

**Potrzebny w testach:** integration, e2e, llm (przez fixture `db_factory` w conftest, wstrzykowany do `BaseIntegrationTestCase`). Unit go nie używa – unit nie ma bazy.

---

**Klasa DbFactory**

```python
class DbFactory:
    def __init__(self, db_client: DBClient):
        # Przyjmuje klienta bazy i Faker (do losowych danych). Używane w integration/e2e.
        self.db_client = db_client
        self.faker = Faker()

    def clear(self):
        # Czyści tabele resumes i users – przed każdym testem (w BaseIntegrationTestCase.setUp).
        with self.db_client.within_transaction() as db_client:
            db_client.execute(Query.from_(resumes).delete())
            db_client.execute(Query.from_(users).delete())

    def create_user(self, email: str | None = None) -> dict:
        # INSERT do users, zwraca dict z id, email. Bez email – Faker generuje losowy.
        ...
```

- **Z czego się składa:** Przyjmuje `db_client` (DBClient – połączenie do bazy) i `Faker` (biblioteka do generowania fake’owych danych, np. losowy email). *Faker:* generuje realistyczne dane testowe – `faker.email()` daje np. `"jan.kowalski@example.com"`.
- **Skąd się bierze w testach:** Fixture `db_factory(db_client)` w conftest – tworzy `DbFactory(db_client=db_client)`. Testy dostają `self.db_factory` przez `init_fixtures` w `BaseIntegrationTestCase`.

---

**1. clear()**

```python
def clear(self):
    # Usuwa wszystkie wiersze z resumes i users. Transakcja – albo oba DELETE, albo rollback.
    with self.db_client.within_transaction() as db_client:
        db_client.execute(Query.from_(resumes).delete())
        db_client.execute(Query.from_(users).delete())
```

- **Co robi:** Czyści tabele `resumes` i `users` – usuwa wszystkie wiersze. *within_transaction:* kontekst transakcji – albo oba DELETE się wykonają, albo żaden (rollback przy błędzie). *Query.from_(resumes).delete():* pypika – generuje SQL `DELETE FROM resumes`.
- **Kiedy używane:** W `BaseIntegrationTestCase.setUp()` – przed każdym testem integracyjnym i e2e wywoływane jest `self.db_factory.clear()`. Dzięki temu każdy test startuje z pustą bazą – żadnych śladów po poprzednim teście.

*W skrócie:* Czysta tabela przed testem. Bez tego dane z testu A mogłyby wpływać na test B.

---

**2. create_user(email=None)**

```python
def create_user(self, email: str | None = None) -> dict:
    # INSERT do users (email lub losowy z Faker), RETURNING id, potem SELECT – zwraca dict.
    # Używane w testach: user = self.db_factory.create_user(); user["id"]
    return user  # dict z id, email, itd.
```

- **Co robi:** Tworzy użytkownika w tabeli `users`. Jeśli `email` podane – używa go; jeśli nie – generuje losowy przez `self.faker.email()`. Wstawia wiersz, odczytuje go, zwraca dict (np. `{"id": 1, "email": "..."}`).
- **Kiedy używane:** W testach integration i e2e – gdy potrzebujecie użytkownika (np. `user = self.db_factory.create_user()`, potem `user["id"]` do tworzenia resume lub autoryzacji). Zamiast ręcznego INSERT + SELECT – jedna linijka.

*W skrócie:* `create_user()` – i macie użytkownika w bazie. Bez pisania SQL. Widzicie? Helper – nie fixture, zwykła klasa – ale używana w testach przez `self.db_factory`.

---

- [x] **tests/__init__.py** – klasy bazowe (opis powyżej).
- [x] **tests/conftest.py** – fixtures (opis powyżej).
- [x] **tests/factory.py** – DbFactory (opis powyżej).
- [ ] **tests/unit/** – testy jednostkowe
- [ ] **tests/integration/** – testy integracyjne
- [ ] **tests/e2e/** – testy end-to-end
- [ ] **tests/llm/** – testy z modelem LLM

---






















#### Test jednostkowy – mockowanie wszystkich zależności

```python
# tests/unit/contexts/resumes/test_service__create_resume.py
from tests import BaseUnitTestCase

class TestResumesServiceCreateResume(BaseUnitTestCase):
    # Dziedziczy BaseUnitTestCase – ma self.mocker, self.config. Testuje serwis w izolacji.

    def test_create_resume__success(self):
        # GIVEN - przygotuj mocki (fałszywe obiekty)
        mock_repository = self.mocker.Mock(spec=AbstractResumesRepository)
        mock_storage_client = self.mocker.Mock(spec=AbstractStorageClient)
        mock_ml_service = self.mocker.Mock(spec=AbstractMLService)
        
        # Mock zwraca fake resume
        created_resume = Resume(id=123, user_id=456, summary="Original text")
        mock_repository.create_resume.return_value = created_resume
        
        # Mock zwraca fake AI summary
        ai_summary = "AI generated summary"
        mock_ml_service.generate_resume_summary.return_value = ai_summary
        
        # Serwis dostaje mocki (NIE prawdziwe obiekty!)
        service = ResumesService(
            ml_service=mock_ml_service,
            resumes_repository=mock_repository,
            storage_client=mock_storage_client,
            resumes_config=mock_config
        )
        
        create_patch = ResumeCreatePatchSchema(summary="Original text", user_id=456)
        
        # WHEN - wywołaj funkcję
        result = service.create_resume(user_id=456, resume=create_patch)
        
        # THEN - sprawdź wynik i wywołania mocków
        assert result.id == 123
        assert result.summary == ai_summary
        mock_repository.create_resume.assert_called_once_with(user_id=456, resume=create_patch)
        mock_ml_service.generate_resume_summary.assert_called_once_with(resume_text="Original text")
```

**Co tu się dzieje (krok po kroku):**
1. **GIVEN** (przygotowanie) – tworzymy mocki (fałszywe obiekty) zamiast prawdziwych. Mówimy mockom: "jak ktoś wywoła `create_resume()`, zwróć fake obiekt Resume". Nie łączymy się z bazą!
2. **WHEN** (akcja) – wywołujemy funkcję, którą testujemy. Serwis myśli, że dostał prawdziwe obiekty – a to tylko atrapy.
3. **THEN** (weryfikacja) – sprawdzamy wynik (`assert result.id == 123`) i czy serwis wywołał mocki (`assert_called_once`). Testujemy **tylko logikę serwisu** – czy poprawnie wywołuje repository i ML service, czy zwraca dobry wynik.

**Dlaczego mocki?** Bo to test jednostkowy – w izolacji, bez bazy, bez sieci, bez AI. Szybko, bezpiecznie, tanio.

---

#### Test integracyjny – prawdziwa baza danych

```python
# tests/integration/contexts/resumes/test_resumes_repository__create_resume.py
from tests import BaseIntegrationTestCase

class TestResumesRepositoryCreateResume(BaseIntegrationTestCase):
    # Dziedziczy BaseIntegrationTestCase – prawdziwa baza, db_factory, resumes_repository.

    async def test_create_resume_success(self):
        # GIVEN - stwórz prawdziwego użytkownika w testowej bazie
        user = self.db_factory.create_user()
        
        new_resume = ResumeCreatePatch(
            summary="Test resume",
            storage_path=self.generate_random_test_path(),
        )
        
        # WHEN - wywołaj repository (prawdziwe zapytanie do bazy!)
        self.resumes_repository.create_resume(user_id=user["id"], resume=new_resume)
        
        # THEN - sprawdź w bazie, czy resume się zapisało
        resumes = self.db_client.execute_with_output(
            Query.from_(resumes_table).select(resumes_table.star)
        )
        assert resumes == [{
            "id": ANY,
            "summary": new_resume.summary,
            "storage_path": new_resume.storage_path,
            "user_id": user["id"],
        }]
```

**Różnice (test integracyjny vs jednostkowy):**
- NIE ma mocków – używamy prawdziwego `resumes_repository`, które faktycznie pisze do bazy.
- Prawdziwa baza danych (testowa, ale rzeczywista struktura SQL). To już nie atrapy – to prawdziwe INSERT-y.
- `db_factory.create_user()` – helper do tworzenia danych testowych w bazie (prawdziwe dane).
- Sprawdzamy bezpośrednio w bazie, czy dane się zapisały – wybieramy SELECT-em i patrzymy, czy jest.

Widzicie różnicę? Test jednostkowy = wszystko na atrapach, błyskawiczny. Test integracyjny = prawdziwa baza, wolniejszy, ale sprawdza czy komponenty ze sobą gadają. Oba są potrzebne – najpierw sprawdzasz klocki osobno, potem składasz i patrzysz czy pasują.

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

Gdybyśmy użyli `return`, nie byłoby momentu na cleanup – baza zostałaby zaśmiecona po teście. `yield` pozwala posprzątać **po wykonaniu testu**. Pytest traktuje fixture z yield jak generator: wykonuje kod przed yield, oddaje wynik testowi, po zakończeniu testu wznawia i wykonuje kod po yield. W imprv fixture `fastapi_server` (Lekcja 1, sekcja conftest) używa yield – setup startuje serwer, teardown robi `proc.kill()`. Ten sam mechanizm.

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

Pełne przykłady (test jednostkowy i integracyjny) są w Lekcji 1 w sekcji "Przykłady kodu z projektu". Tu zasada: zawsze starajcie się w testach wyraźnie oddzielić te trzy fazy – wtedy test jest czytelny i łatwy do naprawy.

### Odniesienia
— (materiał w Lekcji 1)

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
