---
title: "ABC + Mock + Fixture – jak to się łączy w jedną całość"
category: "Pytest"
---
# ABC + Mock + Fixture – jak to się łączy w jedną całość

> Wyjaśnienie krok po kroku: jak klasy abstrakcyjne, mocki i fixtures współpracują w testach jednostkowych.

---

## Krok 1: Problem do rozwiązania

Masz serwis (np. `ResumesService`), który potrzebuje 3 rzeczy do działania:

- **Repository** (zapisuje CV do bazy)
- **StorageClient** (uploaduje plik do S3)
- **MLService** (analizuje CV przez AI)

Chcesz przetestować **tylko logikę serwisu**, bez uruchamiania prawdziwej bazy, S3 ani AI (bo to byłoby wolne, drogie i niestabilne).

---

## Krok 2: ABC (Kontrakt) – "Co obiecujesz?"

W kodzie produkcyjnym definiujesz **kontrakty** (ABC):

```python
from abc import ABC, abstractmethod

class AbstractResumesRepository(ABC):
    @abstractmethod
    def create_resume(self, user_id, resume): pass

class AbstractStorageClient(ABC):
    @abstractmethod
    def upload(self, file): pass

class AbstractMLService(ABC):
    @abstractmethod
    def analyze(self, text): pass
```

To są "kartki z wymaganiami" – każda prawdziwa implementacja **musi** mieć te metody.

---

## Krok 3: Mock (Atrapa) – "Udawaj, że jesteś prawdziwy"

W teście **nie** chcesz używać prawdziwych klas (PostgreSQL, AWS S3, OpenAI). Tworzysz **atrapy**:

```python
def test_create_resume(mocker):  # mocker to fixture z pytest-mock
    # Stwórz 3 atrapy, które UDAJĄ prawdziwe obiekty
    mock_repo = mocker.Mock(spec=AbstractResumesRepository)
    mock_storage = mocker.Mock(spec=AbstractStorageClient)
    mock_ml = mocker.Mock(spec=AbstractMLService)
```

**Dlaczego `spec=ABC`?**

- Mock wie, że może mieć tylko metody z kontraktu (`create_resume`, `upload`, `analyze`).
- Jak napiszesz literówkę (`mock_repo.crete_resume()` zamiast `create_resume()`), dostaniesz błąd natychmiast, a nie fałszywie zielony test.

---

## Krok 4: Fixture – "Przygotuj mi te atrapy automatycznie"

Zamiast w każdym teście pisać te same 10 linijek tworzenia mocków, robisz **fixture**:

```python
@pytest.fixture
def mock_dependencies(mocker):  # fixture może używać innego fixture (mocker)!
    # Setup – przygotowanie
    mock_repo = mocker.Mock(spec=AbstractResumesRepository)
    mock_storage = mocker.Mock(spec=AbstractStorageClient)
    mock_ml = mocker.Mock(spec=AbstractMLService)
    
    # Możesz od razu zaprogramować typowe odpowiedzi
    mock_ml.analyze.return_value = {"score": 0.95}
    
    yield {  # yield zamiast return, żeby móc posprzątać później
        "repo": mock_repo,
        "storage": mock_storage,
        "ml": mock_ml
    }
    
    # Teardown – sprzątanie (pytest-mock robi to za Ciebie, ale tutaj mógłbyś zamknąć połączenia itp.)
    print("Sprzątam po teście...")
```

---

## Krok 5: Test używa fixture – "Daj mi gotowe atrapy"

```python
def test_create_resume(mock_dependencies):  # pytest wstrzykuje fixture automatycznie
    mocks = mock_dependencies
    
    # Tworzysz prawdziwy serwis, ale z atrapami zamiast prawdziwych klas
    service = ResumesService(
        resumes_repository=mocks["repo"],
        storage_client=mocks["storage"],
        ml_service=mocks["ml"]
    )
    
    # Teraz testujesz tylko logikę serwisu
    result = service.create_resume(user_id=123, resume={"title": "CV"})
    
    # Sprawdzasz, czy serwis poprawnie użył atrap
    mocks["repo"].create_resume.assert_called_once()
    mocks["ml"].analyze.assert_called_once()
```

---

## Podsumowanie – Jak to się ze sobą łączy?

| Element | Rola |
|---------|------|
| **ABC** | Definiuje kontrakt (jakie metody muszą istnieć) w kodzie produkcyjnym |
| **Mock** | Atrapa prawdziwego obiektu w teście (nie łączy się z bazą/API) |
| **spec=ABC** | Mówi mockowi: "znaj tylko metody z kontraktu, nie akceptuj literówek" |
| **Fixture** | Automatycznie przygotowuje mocki przed testem i sprząta po nim (DRY!) |

---

## Zależności w jednym zdaniu (bez analogii)

**ABC** = "Lista obietnic" – mówi jakie metody muszą istnieć (kontrakt), ale nie mówi jak działają.

**Mock** = "Atrapa" – udaje prawdziwy obiekt. Dzięki `spec=ABC` wie, jakie metody może udawać (nie pozwala na literówki). Zamiast uruchamiać prawdziwy kod, zwraca to, co mu każesz (`return_value`).

**Fixture** = "Dostawca" – funkcja, która tworzy mocki (i inne obiekty), dostarcza je do testu jako gotowe dane i sprząta po zakończeniu testu. Bez niego musiałbyś w każdym teście ręcznie tworzyć te same mocki od nowa.

**Krótko:** ABC to reguły. Mock to udawacz. Fixture to paczka z dostawą – pakuje mocki i automatycznie wręcza do każdego testu, który o to poprosi.

---

## Analogia z życia

- **ABC** = karta menu w restauracji (jakie dania możesz zamówić)
- **Mock** = sztuczne jedzenie z plastiku na wystawie (wygląda jak prawdziwe, ale nie jest)
- **Fixture** = kelner, który automatycznie przynosi Ci tę sztuczną wystawę na stół, zanim zaczniesz test, i zabiera po skończeniu
