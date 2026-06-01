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

Pętla zdarzeń to serce działania asynchronicznego w Pythonie. W typowych kursach często spotykamy się z blokowaniem jej poprzez nieświadome stosowanie synchronicznych sterowników bazy danych wewnątrz funkcji `async def`. Rozwiążmy to profesjonalnie.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Czysty kod asynchroniczny na poziomie Enterprise
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

@router.get("/todos")
async def read_all(user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_async_db)):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    # Używamy nowoczesnej składni select i słowa kluczowego await
    query = select(Todos).where(Todos.owner_id == user.get('id'))
    result = await db.execute(query)
    return result.scalars().all()
```

### 2. METODA FEYNMANA

Wyobraźcie sobie gigantyczny supermarket, w którym jest tylko jedna kasa — to nasza jednowątkowa pętla zdarzeń (Event Loop). Klienci podchodzą, kasjer błyskawicznie skanuje produkty. Wszystko działa super, dopóki klient nie powie: *"Ojej, zapomniałem kodu PIN do karty, muszę zadzwonić do żony"*.

- **Podejście amatorskie (synchroniczne I/O w `async`):** Kasjer po prostu stoi i czeka na tego jednego klienta. Cała kolejka 200 osób za nim się wścieka. Dokładnie to dzieje się, gdy wysyłasz zapytanie do bazy bez użycia `await`. Serwer zamarza. Żadne inne zapytanie HTTP nie zostanie obsłużone, dopóki baza danych nie odpowie!
- **Podejście Enterprise (asynchroniczne):** Kasjer mówi do klienta: *"Proszę stanąć z boku i dzwonić do żony, a jak pani sobie przypomni, proszę dać znać"*. W tym czasie kasjer (Event Loop) obsługuje w tle kolejnych 50 klientów. Gdy baza danych (żona) wraca z wynikiem, kasjer wraca do tego klienta używając słowa kluczowego `await`. Pełna przepustowość zachowana!

### 3. MAPA MYŚLI

```markdown
- Asynchroniczność w FastAPI
  - Pętla zdarzeń (Event Loop)
    - Działa na jednym wątku
    - Odpowiada za przełączanie kontekstu
  - Blokujące operacje I/O (Input/Output)
    - Zapytania do bazy danych
    - Zewnętrzne API
    - Odczyt plików
  - Poprawne rozwiązania
    - `async def` + `await` (AsyncDB/AsyncPG)
    - Zwykłe `def` (delegacja do puli wątków przez Uvicorn)
```

### 4. PUŁAPKA

**Blokowanie Event Loopa synchronicznym sterownikiem bazy danych!**
Najczęstszy błąd początkujących to dodanie dekoratora `async def` do funkcji endpointu, a następnie wywołanie w środku `db.query(Model).all()`. Serwer Uvicorn po wejściu do takiej funkcji spodziewa się przełączenia na inny task, lecz spotyka sztywny, blokujący kod. W efekcie zamraża się w 100%, całkowicie niszcząc wydajność aplikacji. Pamiętaj: jeśli nie masz `await` w środku (lub nie używasz async drivera), **usuń** słówko `async` z nazwy funkcji i pozwól FastAPI obsłużyć to w osobnym wątku!
