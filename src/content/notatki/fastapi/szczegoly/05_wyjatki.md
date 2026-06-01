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

Jednym z najbardziej niebezpiecznych nawyków wynoszonych z szybkich kursów wideo jest tłumienie błędów poprzez tak zwane "gołe wyjątki". Zobaczmy, dlaczego to niszczy aplikacje na produkcji i jak tego unikać.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Łapiemy tylko to, co wiemy jak obsłużyć
from jose import JWTError
from fastapi import Request
from fastapi.responses import RedirectResponse

@router.get("/todo-page")
async def render_todo_page(request: Request, db: db_dependency):
    token = request.cookies.get("access_token")
    if not token:
        return RedirectResponse(url="/auth/login-page", status_code=302)
        
    try:
        user = await get_current_user(token)
    except JWTError:
        # Obsługujemy WYŁĄCZNIE błąd walidacji tokenu JWT
        response = RedirectResponse(url="/auth/login-page", status_code=302)
        response.delete_cookie("access_token")
        return response

    # Dalsza logika ...
```

### 2. METODA FEYNMANA

Wyobraźcie sobie fabrykę, w której pracownik pakuje szklanki do kartonów. 
- **Amatorski blok `except:`:** Pracownik ma instrukcję: *"Jeśli cokolwiek pójdzie nie tak (szklanka się zbije, zgaśnie światło, wybuchnie pożar albo dostaniesz zawału) – wrzuć wszystko do kosza i uśmiechaj się"*. Wybucha pożar, fabryka płonie, a pracownik milczy i wciąż udaje, że pakuje szklanki, podczas gdy wszystko dookoła się wali. System nie wysyła żadnych alertów, że coś jest krytycznie nie tak!
- **Precyzyjny blok `except JWTError:`:** Pracownik ma instrukcję: *"Jeśli szklanka pęknie, wyrzuć ją i weź nową. Jeśli wybuchnie pożar – nie rób nic z tej instrukcji, tylko uciekaj i włącz alarm!"*. W kodzie Python, jeśli wystąpi literówka w nazwie zmiennej lub połączy się obca baza danych (pożar), wyjątek "przepali" blok `try` i wyświetli się głośno w konsoli (alarm dla programisty). My łapiemy cicho tylko te błędy, których się faktycznie spodziewamy (zepsuty żeton JWT).

### 3. MAPA MYŚLI

```markdown
- Obsługa błędów (Exception Handling)
  - Goły `except:` (Kategorycznie zabroniony!)
    - Tłumi `KeyboardInterrupt` (Ctrl+C w konsoli)
    - Tłumi krytyczne błędy składni (`NameError`, `TypeError`)
    - Utrudnia debugowanie (ciche połykanie błędów)
  - Dobre praktyki
    - Określanie jawnych klas wyjątków (np. `except SQLAlchemyError:`)
    - Używanie globalnych Exception Handlers w FastAPI (`@app.exception_handler`)
    - Fail-Fast: Lepiej wywrócić aplikację z głośnym logiem, niż udawać że działa!
```

### 4. PUŁAPKA

**Pułapka fałszywego bezpieczeństwa w `try-except`!**
Początkujący boją się, że nieobsłużony błąd "wyłączy im serwer". W FastAPI tak to nie działa! FastAPI domyślnie posiada globalny mechanizm wyłapujący nieobsłużone wyjątki — serwer Uvicorn **nie zostanie wyłączony**, a użytkownik po prostu dostanie błąd `500 Internal Server Error`, natomiast w konsoli programisty wyskoczy pełen, czytelny stos wywołań (Traceback). Dlatego jeśli nie wiesz, jak logicznie obsłużyć dany błąd (np. brak połączenia z bazą) — NIE UŻYWAJ bloku `try-except`. Pozwól FastAPI go przechwycić, zwrócić 500-tkę i pokazać Ci błąd w terminalu. Ukrywanie błędów za wszelką cenę to najkrótsza droga do wielodniowych, bolesnych sesji debuggowania.
