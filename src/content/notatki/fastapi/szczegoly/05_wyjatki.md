---
title: '05. Precyzyjna Obsługa Wyjątków'
category: 'FastAPI'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 05. Precyzyjna Obsługa Wyjątków

Profesjonalna obsługa błędów w FastAPI polega na łapaniu **wyłącznie tych wyjątków, które rozumiesz i wiesz jak obsłużyć**. Wszystko inne powinno naturalnie "wypłynąć" na wierzch — FastAPI ma wbudowany mechanizm, który bezpiecznie obsłuży nieznane błędy i pokaże Ci szczegóły w konsoli. W tej lekcji nauczysz się, jak to robić prawidłowo.

---

### 1. ZWIĘZŁY KOD

```python
# ═══════════════════════════════════════════
# PRAWIDŁOWO: Łapiemy konkretny, spodziewany wyjątek
# ═══════════════════════════════════════════
from jose import JWTError
from fastapi import Request
from fastapi.responses import RedirectResponse

@router.get("/todo-page")
async def render_todo_page(request: Request, db: db_dependency):
    token = request.cookies.get("access_token")

    # Krok 1: Brak tokenu — nie potrzebujemy try/except
    if not token:
        return RedirectResponse(url="/auth/login-page", status_code=302)

    # Krok 2: Łapiemy WYŁĄCZNIE błąd dekodowania JWT
    try:
        user = await get_current_user(token)
    except JWTError:
        response = RedirectResponse(url="/auth/login-page", status_code=302)
        response.delete_cookie("access_token")
        return response

    # Krok 3: Normalna logika — bez bloku try
    todos = await db.execute(select(Todos).where(Todos.owner_id == user["id"]))
    return templates.TemplateResponse("todo.html", {
        "request": request,
        "todos": todos.scalars().all(),
        "user": user
    })


# ═══════════════════════════════════════════
# GLOBALNY HANDLER — centralne łapanie błędów
# Plik: src/core/exceptions.py
# ═══════════════════════════════════════════
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

def register_exception_handlers(app: FastAPI):
    """Rejestruje globalne handlery wyjątków na poziomie aplikacji."""

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
        logger.error(f"Błąd bazy danych: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Wewnętrzny błąd serwera. Spróbuj ponownie."}
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        return JSONResponse(
            status_code=422,
            content={"detail": str(exc)}
        )
```

### 2. METODA FEYNMANA

Wyobraź sobie **fabrykę, w której pracownik pakuje szklanki do kartonów**. Pracownik ma instrukcję bezpieczeństwa, i tutaj kluczowe jest, jak tę instrukcję napiszemy:

- **Zły sposób (gołe `except:`):** Instrukcja mówi: *„Jeśli cokolwiek pójdzie nie tak — szklanka się zbije, zgaśnie światło, wybuchnie pożar albo dostaniesz zawału — wrzuć wszystko do kosza i uśmiechaj się"*. Wybucha pożar, fabryka płonie, a pracownik milczy i udaje, że pakuje szklanki. Nikt nie wie, że coś jest nie tak. System nie wysyła żadnych alertów!

- **Dobry sposób (precyzyjny `except JWTError:`):** Instrukcja mówi: *„Jeśli szklanka pęknie — wyrzuć ją i weź nową. Jeśli wydarzy się cokolwiek INNEGO (pożar, trzęsienie ziemi) — nie rób nic z tej instrukcji, tylko krzycz i włącz alarm!"*. W kodzie Pythona, jeśli wystąpi niespodziewany błąd (literówka w nazwie zmiennej, zerwane połączenie z bazą), wyjątek "przepali" blok `try` i wyświetli się głośno w konsoli — alarm dla programisty. My łapiemy cicho wyłącznie te błędy, których się faktycznie spodziewamy.

- **Globalny handler** to jak centralny system przeciwpożarowy w fabryce. Nie musisz instalować gaśnicy przy każdym stanowisku — centrala łapie wszystkie alarmy i reaguje jednakowo. W FastAPI `@app.exception_handler(SQLAlchemyError)` działa właśnie tak: łapie określony typ problemu w jednym miejscu, zamiast powtarzać `try-except` w każdym endpoincie.

### 3. MAPA MYŚLI

```
Obsługa wyjątków w FastAPI
├── Goły 'except:' — KATEGORYCZNIE ZABRONIONY
│   ├── Tłumi KeyboardInterrupt (Ctrl+C w konsoli!)
│   ├── Tłumi krytyczne TypeError, NameError
│   ├── Uniemożliwia debugowanie
│   └── Fałszywe poczucie bezpieczeństwa
├── Precyzyjne łapanie wyjątków
│   ├── except JWTError — błąd tokenu
│   ├── except SQLAlchemyError — błąd bazy
│   ├── except ValidationError — błąd walidacji
│   └── Łap TYLKO to, co wiesz jak obsłużyć
├── Globalne Exception Handlers
│   ├── @app.exception_handler(ExcType)
│   ├── Centralne logowanie błędów
│   └── Spójne odpowiedzi JSON dla klienta
└── Zasada: FastAPI NIE wyłączy serwera
    ├── Nieobsłużony wyjątek = HTTP 500 + Traceback w konsoli
    ├── Serwer Uvicorn dalej działa
    └── Lepiej zobaczyć 500-tkę niż cicho połknąć błąd
```

### 4. PUŁAPKA

**Strach przed nieobsłużonym wyjątkiem!**

Początkujący programiści boją się, że wyjątek bez `try-except` "wyłączy im serwer". W FastAPI tak to **nie działa**! FastAPI (a dokładniej Uvicorn pod spodem) posiada wbudowany, globalny mechanizm wyłapujący nieobsłużone wyjątki. Serwer **nie zostanie wyłączony**. Użytkownik dostanie czysty błąd `500 Internal Server Error`, a w konsoli programisty wyskoczy pełen, czytelny stos wywołań (Traceback).

Dlatego jeśli nie wiesz, jak logicznie obsłużyć dany błąd — **nie owijaj go w `try-except`**. Pozwól FastAPI go przechwycić, zwrócić 500-tkę i pokazać Ci w terminalu, co dokładnie poszło nie tak. Ukrywanie błędów za wszelką cenę (`except: pass`) to najkrótsza droga do wielodniowych, bolesnych sesji debugowania, podczas których nic nie loguje się w konsoli, a aplikacja "po cichu" zwraca bzdurne dane.
