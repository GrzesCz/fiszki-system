---
title: '01. Pętla zdarzeń i Asynchroniczność w FastAPI'
category: 'FastAPI'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 01. Pętla zdarzeń i Asynchroniczność w FastAPI

Pętla zdarzeń (Event Loop) to absolutne serce FastAPI. Zrozumienie jej mechaniki decyduje o tym, czy Twoja aplikacja obsłuży tysiące zapytań na sekundę, czy padnie pod obciążeniem kilkunastu użytkowników. W tej lekcji nauczysz się, jak poprawnie korzystać z asynchroniczności, aby wycisnąć z frameworka maksymalną wydajność.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ Prawidłowe asynchroniczne zapytanie do bazy danych
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

@router.get("/todos")
async def read_all(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Kluczowe: używamy async drivera (np. asyncpg) 
    i słowa kluczowego 'await' przy każdym zapytaniu.
    """
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    query = select(Todos).where(Todos.owner_id == user.get('id'))
    result = await db.execute(query)   # ← 'await' oddaje kontrolę pętli zdarzeń
    return result.scalars().all()


# ✅ Alternatywa: synchroniczny endpoint (FastAPI sam deleguje do wątku)
@router.get("/todos-sync")
def read_all_sync(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Kiedy NIE masz async drivera — użyj zwykłego 'def' (bez async).
    FastAPI automatycznie uruchomi tę funkcję w osobnym wątku,
    dzięki czemu pętla zdarzeń NIE zostanie zablokowana.
    """
    return db.query(Todos).filter(Todos.owner_id == user.get('id')).all()
```

### 2. METODA FEYNMANA

Wyobraź sobie gigantyczny supermarket, w którym jest **tylko jedna kasa** — to nasza jednowątkowa pętla zdarzeń (Event Loop). Klienci podchodzą, kasjer błyskawicznie skanuje produkty. Wszystko działa super, dopóki jeden klient nie powie: *„Ojej, zapomniałem kodu PIN do karty, muszę zadzwonić do żony"*.

Teraz mamy dwa scenariusze:

- **Scenariusz A — blokujemy kasę:** Kasjer stoi i czeka na tego jednego klienta. Cała kolejka 200 osób za nim się wścieka. Dokładnie to dzieje się, gdy wysyłasz zapytanie do bazy bez `await` w funkcji `async def`. Serwer zamarza — żadne inne zapytanie HTTP nie zostanie obsłużone, dopóki baza danych nie odpowie!

- **Scenariusz B — prawidłowa asynchroniczność:** Kasjer mówi do klienta: *„Proszę stanąć z boku i dzwonić do żony, a jak pani sobie przypomni — proszę dać znać"*. W tym czasie kasjer (Event Loop) obsługuje w tle kolejnych 50 klientów. Gdy baza danych (żona) wraca z wynikiem, kasjer wraca do tego klienta (używając słowa kluczowego `await`). **Pełna przepustowość zachowana!**

Kluczowa zasada: jeśli nie masz asynchronicznego drivera bazy, nie udawaj asynchroniczności — użyj po prostu zwykłego `def`. FastAPI wtedy sam "odprowadzi klienta na bok", uruchamiając funkcję w osobnym wątku.

### 3. MAPA MYŚLI

```
Asynchroniczność w FastAPI
├── Pętla zdarzeń (Event Loop)
│   ├── Działa na jednym wątku
│   ├── Odpowiada za przełączanie kontekstu między zadaniami
│   └── Blokowanie = katastrofa wydajnościowa
├── Operacje blokujące I/O
│   ├── Zapytania do bazy danych
│   ├── Wywołania zewnętrznych API (HTTP)
│   └── Odczyt/zapis plików na dysku
├── Poprawne rozwiązanie nr 1: async def + await
│   ├── Wymaga asynchronicznego drivera (asyncpg, aiosqlite)
│   └── Każde zapytanie I/O musi mieć 'await'
└── Poprawne rozwiązanie nr 2: zwykłe def
    ├── FastAPI/Uvicorn deleguje do puli wątków (threadpool)
    └── Idealne gdy nie masz async drivera
```

### 4. PUŁAPKA

**Synchroniczny kod wewnątrz `async def` — cichy zabójca wydajności!**

To najczęstsza pułapka: dodajesz `async def` do funkcji endpointu (bo "wygląda nowocześnie"), a w środku wołasz synchroniczne `db.query(Model).all()`. Serwer Uvicorn po wejściu do takiej funkcji spodziewa się, że oddasz mu kontrolę (przez `await`), lecz zamiast tego spotyka sztywny, blokujący kod. W efekcie zamraża się i czeka, nie obsługując w tym czasie żadnego innego użytkownika.

**Zasada kciuka:** Jeśli w środku Twojej funkcji nie ma ani jednego `await` — usuń słówko `async` z deklaracji i pozwól FastAPI obsłużyć to w osobnym wątku. To nie jest porażka — to świadoma decyzja architektoniczna.
