---
title: "Studium przypadku: projekt `imprv-masterclass-testing`"
category: "Pytest"
---
# Studium przypadku: projekt `imprv-masterclass-testing`

**Źródło:** Notatki z kursu Pytest, projekt `TESTOWANIE - PYTEST/imprv-masterclass-testing`.

Ten plik zawiera **szczegółowe przykłady kodu i omówienie** profesjonalnej struktury testów. Użyj go jako "zeszytu ćwiczeń" – po przeczytaniu teorii w `notatki.md` wróć tutaj, żeby zobaczyć, jak te koncepcje wyglądają w prawdziwym projekcie.

---

## Spis treści (linki wewnętrzne)

- [Struktura testów](#struktura-testów)
- [Omówienie plików __init__.py, conftest.py, factory.py](#omówienie-plików-__init__py-conftestpy-factorypy)
- [Wzorzec GIVEN / WHEN / THEN](#wzorzec-given--when--then)
- [Test jednostkowy – mockowanie](#test-jednostkowy--mockowanie-wszystkich-zależności)
- [Test integracyjny – prawdziwa baza](#test-integracyjny--prawdziwa-baza-danych)

---

## Struktura testów

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

### Dlaczego taki podział katalogów? (unit / integration / e2e / llm)

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

---

## Omówienie plików `__init__.py`, conftest.py, factory.py

### tests/__init__.py – wszystkie klasy bazowe

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

Pytest ładuje ten plik **automatycznie** – nie trzeba go importować. To jak szafa na początku korytarza: każdy test może z niej skorzystać, podając nazwę fixture'a w parametrze. Wszystkie „przygotowacze" w jednym miejscu. 

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

- **Co robi:** Tworzy **Bootstrap** – „szef budowy", który składa całą aplikację (baza, repo, serwisy, klienty). Jedno miejsce, gdzie wszystko się łączy. *Composition root:* wzorzec – jedna klasa tworzy i łączy wszystkie zależności.
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
- **Scope:** `function` – przed każdym testem można dostać „świeży" repo *function:* fixture tworzony na nowo przed każdym testem (w przeciwieństwie do session – raz na całą sesję).

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

### tests/factory.py – DbFactory

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

- **Z czego się składa:** Przyjmuje `db_client` (DBClient – połączenie do bazy) i `Faker` (biblioteka do generowania fake'owych danych, np. losowy email). *Faker:* generuje realistyczne dane testowe – `faker.email()` daje np. `"jan.kowalski@example.com"`.
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

## Wzorzec GIVEN / WHEN / THEN

Słuchajcie, jeśli mielibyście zapamiętać z pisania testów tylko jedną, jedyną rzecz – taką najważniejszą, która odróżnia kod amatora od kodu profesjonalisty – to jest to właśnie wzorzec **GIVEN / WHEN / THEN**. To nie jest żadna skomplikowana funkcja Pythona, to nie jest dekorator z pytesta. To jest po prostu **konwencja**, czyli umowny sposób na to, jak układamy kod wewnątrz naszej funkcji testowej.

**Po co nam to?** Wyobraźcie sobie, że wchodzicie do kuchni, żeby ugotować zupę. 

1. **GIVEN (Zakładając że / Przygotowanie)** – Najpierw wyciągacie garnki, kroicie marchewkę, układacie mięso na blacie, odmierzacie wodę. To jest Wasz *setup*. W teście to moment, w którym tworzycie mocki, wstawiacie testowego użytkownika do bazy danych, przygotowujecie fałszywe obiekty. "Zakładamy, że mamy taki a taki stan świata".
2. **WHEN (Kiedy / Akcja)** – Włączacie palnik i wrzucacie to wszystko do garnka. To jest akcja. W kodzie testowym to jest ten jeden, kluczowy moment, w którym wywołujecie funkcję, którą chcecie przetestować (np. `service.create_resume()`). "Kiedy kliknę ten przycisk...".
3. **THEN (Wtedy / Weryfikacja)** – Zupa jest gotowa, próbujecie jej i mówicie: "O, dobra, słona, pomidorowa". To są asercje. Tutaj sprawdzacie efekty. "Wtedy oczekuję, że w bazie jest nowy rekord i że zwrócono id równe 123".

**Dlaczego to jest takie genialne?** 
Bo test staje się "żywą dokumentacją". Każdy, kto wejdzie w Wasz kod za pół roku, widzi tę strukturę i od razu wie, o co chodzi. Znika chaos, w którym wywoływanie funkcji przeplata się z deklarowaniem zmiennych i asercjami. Kod jest czysty, poukładany i **prosty jak budowa cepa**. Zobaczcie sami w przykładach testu jednostkowego i integracyjnego poniżej – w każdym z nich te trzy zielone komentarze ładnie segregują nam bloki kodu!

---

## Test jednostkowy – mockowanie wszystkich zależności

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

## Test integracyjny – prawdziwa baza danych

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
