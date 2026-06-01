---
title: '01. Czym jest ASGI i dlaczego uvicorn jest taki szybki? (ASGI vs WSGI)'
category: 'Uvicorn'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 01. Czym jest ASGI i dlaczego uvicorn jest taki szybki? (ASGI vs WSGI)

Aby w pełni zrozumieć, co odpalamy poleceniem `uvicorn`, musimy cofnąć się o krok i zrozumieć rewolucję, jaka dokonała się w Pythonie dzięki asynchroniczności (ASGI).

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Kod ASGI (np. FastAPI) obsługiwany przez Uvicorn
from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.get("/heavy-task")
async def process_task():
    # Uvicorn (serwer ASGI) zawiesza ten task na 5 sekund
    # i idzie obsługiwać inne requesty HTTP z pełną prędkością!
    await asyncio.sleep(5)
    return {"status": "done"}
```

Tradycyjny serwer WSGI (Gunicorn + Flask/Django):
```python
# ❌ PODEJŚCIE TRADYCYJNE: Kod WSGI obsługiwany przez Gunicorn/Waitress
import time
from flask import Flask

app = Flask(__name__)

@app.route("/heavy-task")
def process_task():
    # Serwer WSGI zablokuje tutaj cały wątek na 5 sekund!
    # Żaden inny użytkownik przypisany do tego wątku nie dostanie odpowiedzi.
    time.sleep(5)
    return {"status": "done"}
```

### 2. METODA FEYNMANA

Wyobraźcie sobie restaurację z okienkiem Drive-Thru.
- **Serwer WSGI (stare podejście - np. Flask + Gunicorn worker):** Pracownik w okienku przyjmuje zamówienie na burgery. Odwraca się do kuchni i mówi: "Poproszę burgery". Następnie pracownik **stoi** i patrzy na kucharza przez pełne 5 minut, dopóki burgery nie będą gotowe. W tym czasie w okienku Drive-Thru ustawia się gigantyczna kolejka wściekłych kierowców (żądania HTTP). Pracownik jest całkowicie bezużyteczny w czasie oczekiwania.
- **Serwer ASGI (nowe podejście - Uvicorn + FastAPI):** Ten sam pracownik przyjmuje zamówienie. Krzyczy do kuchni: "Proszę burgery!". Ale zamiast stać i patrzeć, mówi do pierwszego kierowcy: "Proszę zjechać na bok, burgery zaraz będą". Następnie podchodzi do następnego samochodu, przyjmuje zamówienie na lody, nakłada lody, podchodzi do trzeciego samochodu... Kiedy burgery są gotowe, kuchnia (pętla zdarzeń) daje mu znać (przez `await`), a on zanosi je zadowolonemu kierowcy z pierwszego samochodu. Jeden pracownik (jeden wątek) obsłużył 10 osób w czasie, w którym serwer WSGI obsłużyłby tylko jedną!

### 3. MAPA MYŚLI

```markdown
- Standardy komunikacji serwer-aplikacja w Python
  - WSGI (Web Server Gateway Interface)
    - Tradycyjny, synchroniczny (Django, Flask)
    - 1 żądanie = 1 zablokowany proces/wątek
    - Fatalna wydajność dla długich zapytań I/O (bazy, sieci)
  - ASGI (Asynchronous Server Gateway Interface)
    - Nowoczesny, oparty o Pętlę Zdarzeń (FastAPI, Starlette)
    - Obsługuje protokoły strumieniowe (WebSockets)
    - 1 wątek potrafi obsłużyć tysiące zapytań jednocześnie dzięki `await`
- `uvicorn`
  - Najpopularniejszy i niesamowicie szybki serwer ASGI
  - Bazuje na potężnej pętli zdarzeń `uvloop` (napisanej w Cythonie)
```

### 4. PUŁAPKA

**Instalowanie czystego `uvicorn` na Linuxie bez `uvloop`!**
Kiedy instalujesz pakiety komendą `pip install uvicorn`, otrzymujesz podstawową, czystą wersję w Pythonie. Działa ona na standardowej pętli `asyncio`, która jest dość wolna. Aby wycisnąć z maszyny 100% (co w testach benchmarkowych na Linux/MacOS daje przyrost prędkości nawet rzędu 2x), musisz pamiętać o instalacji `pip install uvicorn[standard]`. Słówko `[standard]` doinstalowuje pętlę zdarzeń `uvloop` (szybką nakładkę na C++) oraz paczkę `httptools`. UWAGA: Na systemie Windows `uvloop` nie jest wspierany, więc ten magiczny trik działa i lśni tylko na prawdziwych serwerach (Linux/Docker)!
