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

Profesjonalna aplikacja FastAPI wymaga ścisłego podziału odpowiedzialności. Każda warstwa ma jedną, jasno zdefiniowaną rolę. Dzięki temu kod jest łatwy do testowania, rozbudowy i utrzymania przez wiele osób jednocześnie. W tej lekcji nauczysz się budować API zgodnie z zasadą Single Responsibility Principle.

---

### 1. ZWIĘZŁY KOD

```python
# ═══════════════════════════════════════════
# WARSTWA 1: ROUTER (chudy — tylko HTTP)
# Plik: src/todos/router.py
# ═══════════════════════════════════════════
from fastapi import APIRouter, Depends, status
from src.todos.schemas import TodoCreate, TodoResponse
from src.todos.service import TodoService
from src.auth.dependencies import get_current_user

router = APIRouter(prefix="/todos", tags=["Todos"])

@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,                           # DTO wejściowy
    user: dict = Depends(get_current_user),           # autoryzacja
    service: TodoService = Depends(get_todo_service)  # wstrzykiwanie zależności
):
    # Router NIE zawiera logiki — tylko przekazuje dalej
    return await service.create_new_todo(todo_data, user_id=user["id"])


# ═══════════════════════════════════════════
# WARSTWA 2: SERWIS (logika biznesowa)
# Plik: src/todos/service.py
# ═══════════════════════════════════════════
from src.todos.schemas import TodoCreate, TodoResponse
from src.todos.repository import TodoRepository

class TodoService:
    def __init__(self, repo: TodoRepository):
        self.repo = repo

    async def create_new_todo(self, data: TodoCreate, user_id: int) -> TodoResponse:
        # Tu żyje logika biznesowa (walidacja reguł, przeliczanie, itp.)
        todo = await self.repo.add(data, owner_id=user_id)
        return TodoResponse.model_validate(todo)


# ═══════════════════════════════════════════
# WARSTWA 3: REPOZYTORIUM (tylko baza danych)
# Plik: src/todos/repository.py
# ═══════════════════════════════════════════
from sqlalchemy.ext.asyncio import AsyncSession
from src.todos.models import Todos

class TodoRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add(self, data, owner_id: int) -> Todos:
        todo = Todos(**data.model_dump(), owner_id=owner_id)
        self.db.add(todo)
        await self.db.commit()
        await self.db.refresh(todo)
        return todo


# ═══════════════════════════════════════════
# SCHEMATY DTO (kontrakt API)
# Plik: src/todos/schemas.py
# ═══════════════════════════════════════════
from pydantic import BaseModel, Field

class TodoCreate(BaseModel):
    """DTO wejściowy — co klient wysyła."""
    title: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=100)
    priority: int = Field(gt=0, lt=6)
    complete: bool = False

class TodoResponse(BaseModel):
    """DTO wyjściowy — co klient otrzymuje. Nigdy nie zwracamy modelu ORM!"""
    id: int
    title: str
    description: str
    priority: int
    complete: bool

    model_config = {"from_attributes": True}
```

### 2. METODA FEYNMANA

Wyobraź sobie luksusową restaurację. Są w niej trzy osoby, z których każda ma ściśle określoną rolę:

- **Router = Kelner.** Podchodzi do Ciebie, przyjmuje zamówienie (Request), sprawdza czy masz rezerwację (Autoryzacja), a potem zanosi kartkę do kuchni. Kelner **nie gotuje**. Gdy danie jest gotowe — zanosi je do Twojego stolika (Response). To cała jego praca.

- **Service = Szef Kuchni.** Bierze przepis, sprawdza gramaturę, łączy składniki, tworzy wyjątkowe danie (Logika biznesowa). Szef kuchni nie wie i nie obchodzi go, czy zamówienie przyszło od gościa w sali, czy przez UberEats — jego interesuje wyłącznie proces gotowania.

- **Repository = Magazynier.** Kiedy szef kuchni potrzebuje marchewki, krzyczy do magazyniera. Magazynier schodzi do piwnicy (Baza Danych), szuka marchewki (SQL Query) i przynosi ją do kuchni. Nie gotuje zupy i nie obsługuje gości.

A czym jest **DTO (schemat Pydantic)**? To karta menu. Goście widzą ładne nazwy dań i ceny (TodoResponse), ale nie widzą brudnych garnków z kuchni (modeli ORM z polem `hashed_password`). Menu jest filtrem — pokazuje tylko to, co klient powinien zobaczyć.

### 3. MAPA MYŚLI

```
Czysta Architektura 3-warstwowa
├── Warstwa Prezentacji / Router
│   ├── Odbiera żądania HTTP
│   ├── Waliduje dane wejściowe (Pydantic DTO)
│   ├── Zwraca statusy HTTP (200, 201, 404)
│   └── Nie zawiera logiki biznesowej!
├── Warstwa Serwisu
│   ├── Centralna logika biznesowa
│   ├── Przeliczanie, weryfikacja reguł
│   ├── Orkiestracja wielu repozytoriów
│   └── Nie wie o istnieniu frameworka FastAPI!
├── Warstwa Repozytorium
│   ├── Izoluje zapytania do bazy danych (SQLAlchemy)
│   ├── Odbiera/zapisuje modele ORM
│   └── Jedyne miejsce z importem Session/AsyncSession
└── Schematy DTO (Pydantic)
    ├── TodoCreate — co klient wysyła
    ├── TodoResponse — co klient otrzymuje
    └── Ochrona przed wyciekiem wrażliwych pól
```

### 4. PUŁAPKA

**Zwracanie surowych modeli bazy danych (ORM) prosto przez API!**

Jeśli endpoint zwraca `return db.query(User).first()`, to w odpowiedzi JSON wylądują **wszystkie** kolumny tabeli — łącznie z `hashed_password`, flagami administracyjnymi czy wewnętrznymi identyfikatorami. To poważny wyciek danych.

Rozwiązanie: zawsze definiuj dedykowany schemat Pydantic (DTO) z parametrem `response_model=TodoResponse`. Dzięki temu jawnie kontrolujesz, które pola trafiają do świata zewnętrznego. Dodatkowy bonus: gdybyś kiedyś zmienił nazwę kolumny w bazie, Twój kontrakt API (to, co widzą klienci) pozostanie nienaruszony.
