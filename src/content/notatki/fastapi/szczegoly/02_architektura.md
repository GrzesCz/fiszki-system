---
title: '02. Czysta Architektura 3-warstwowa'
category: 'FastAPI'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 02. Czysta Architektura 3-warstwowa

W projektach z kursów wideo router jest wszystkim: odbiera request, wyciąga ciastka, rozmawia z bazą danych, liczy dane, a na końcu renderuje odpowiedź. To zaprzeczenie zasady pojedynczej odpowiedzialności (Single Responsibility Principle). Spójrzmy, jak wygląda to na poziomie Enterprise.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Cienka warstwa routera korzystająca z warstwy serwisu (DTO + Dependency Injection)
from fastapi import APIRouter, Depends, status
from src.todos.schemas import TodoCreate, TodoResponse
from src.todos.service import TodoService
from src.auth.dependencies import get_current_user

router = APIRouter(prefix="/todos", tags=["Todos"])

@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate, # DTO Request
    user: dict = Depends(get_current_user),
    service: TodoService = Depends(get_todo_service) # Wstrzykiwanie zależności
):
    # Router zajmuje się tylko HTTP, cała logika jest w serwisie
    return await service.create_new_todo(todo_data, user_id=user["id"])
```

### 2. METODA FEYNMANA

Wyobraź sobie luksusową restaurację.
- **Router (Kelner):** Podchodzi do Ciebie, przyjmuje zamówienie (Request), sprawdza czy jesteś w odpowiednim stroju (Autoryzacja), a potem zanosi kartkę do kuchni. Kelner nie gotuje. Jeśli zupa jest gotowa, zanosi ją do Twojego stolika (Response).
- **Service (Szef Kuchni):** Bierze przepis, sprawdza gramaturę, łączy składniki, tworzy wyjątkowe danie (Logika biznesowa). Szef kuchni nie wie, czy zamówienie przyszło od gościa w sali, czy przez UberEats — jego interesuje tylko proces gotowania.
- **Repository (Magazynier):** Kiedy szef kuchni potrzebuje marchewki, krzyczy do magazyniera. Magazynier idzie do piwnicy (Baza Danych), szuka marchewki (SQL Query) i przynosi ją do kuchni. Nie gotuje zupy i nie obsługuje gości.

W amatorskim kodzie kelner sam idzie do piwnicy wyrwać marchewkę, po czym gotuje zupę bezpośrednio przy Twoim stoliku.

### 3. MAPA MYŚLI

```markdown
- Czysta Architektura (Clean Architecture)
  - Warstwa Prezentacji / Router (Kelner)
    - Odbiera żądania HTTP
    - Waliduje dane wejściowe (Pydantic DTO)
    - Zwraca statusy HTTP (200, 201, 404)
  - Warstwa Serwisu (Szef Kuchni)
    - Centralna logika biznesowa
    - Przeliczanie, weryfikacja reguł
    - Brak wiedzy o istnieniu frameworka FastAPI!
  - Warstwa Repozytorium (Magazynier)
    - Izoluje zapytania do bazy danych (SQLAlchemy)
    - Odbiera/zapisuje modele ORM
    - Mapuje obiekty bazy na encje biznesowe
```

### 4. PUŁAPKA

**Zwracanie surowych modeli bazy danych (ORM) prosto przez API!**
Ogromny błąd to zwracanie instancji `db.query(User).first()` bezpośrednio jako JSON w odpowiedzi endpointu (zależenie routera od detali bazy danych). Wyciekają wtedy nieświadomie wrażliwe kolumny, takie jak np. zahaszowane hasło (`hashed_password`) lub flagi administracyjne! Zawsze używaj obiektów DTO (Data Transfer Object), czyli modeli Pydantic, aby jawnie zdefiniować i przefiltrować strukturę wysyłaną w świat. `response_model=TodoResponse` gwarantuje, że nie zleakujesz żadnych "backdoorów" bazy.
