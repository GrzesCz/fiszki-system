---
title: '04. Konfiguracja Logowania i metryki wydajności'
category: 'Uvicorn'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 04. Konfiguracja Logowania i metryki wydajności

Aplikacja uruchomiona na produkcji, o której nic nie wiesz, to tykająca bomba. Uvicorn pozwala na dokładną konfigurację formatu logowania, która przydaje się zarówno do analizowania błędów, jak i do podłączenia metryk z systemów klasy Enterprise (np. Datadog, ELK).

---

### 1. ZWIĘZŁY KOD

```bash
# ✅ IDEALNIE: Odpalenie gunicorna z własnym formatem logów oraz dostępem (access log)
gunicorn main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --access-logfile /var/log/fastapi/access.log \
  --error-logfile /var/log/fastapi/error.log \
  --log-level info \
  --access-logformat '%({x-forwarded-for}i)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
```

### 2. METODA FEYNMANA

Wyobraźcie sobie luksusowy hotel (Nasza aplikacja API).
- **Złe logowanie (Domyślne):** Portier (Serwer Uvicorn) wpuszcza i wypuszcza gości bez słowa. Kiedy rano przychodzisz jako szef i pytasz "Kto tu wczoraj był i czy komuś ukradziono portfel?", portier wzrusza ramionami: "Jacyś ludzie wchodzili, chyba było okej, ale nie mam pojęcia". Zero śladów, zero audytu. Z debuggingu nici.
- **Logowanie klasy Enterprise (Access & Error Logs):** Portier ma dwa potężne zeszyty. Jeden to "Zeszyt Wejść" (`access.log`), w którym z aptekarską precyzją notuje twarz, rejestrację samochodu, godzinę, ubiór i powód wejścia każdego, kto tylko dotknął klamki (adres IP, data, żądanie HTTP, kod błędu 200/404, waga w bajtach). Drugi to "Czerwony Zeszyt Wypadków" (`error.log`), gdzie wpisuje każdą przewróconą wazę i krzyki z pokoju 101. Jako szef, kiedy rano siadasz do statystyk, w sekundę wiesz, że "Wczoraj o 14:03 pan z Krakowa próbował wejść do pokoju VIP bez karty (Błąd 401 Unauthorized)". Masz pełną kontrolę nad systemem.

### 3. MAPA MYŚLI

```markdown
- Administracja Logami w Serwerach (Uvicorn / Gunicorn)
  - Rodzaje Logów
    - Error Log: Ślady uwięzione w aplikacji, błędy Pythona, Tracebacki, awarie pętli zdarzeń.
    - Access Log: Audyt wejść; kto odpytał jaki endpoint, z jakim statusem, z jakiego IP.
  - Najważniejsze flagi konfiguracyjne Gunicorna
    - `--log-level`: info, debug, warning, error (Filtruje zgiełk)
    - `--access-logfile`: zapisuje historię odwiedzin do pliku na dysku (lub wysyła na stdout dla Dockera!)
    - `--access-logformat`: Modyfikuje wygląd wpisu, pozwala podpiąć zaawansowane nagłówki (`x-forwarded-for` na wypadek obecności Nginx/LoadBalancera).
```

### 4. PUŁAPKA

**Nierozumienie nagłówka `x-forwarded-for` przy Load Balancerze!**
Najgorszy i najbardziej klasyczny błąd w administracji logami na produkcji: stawiasz przed aplikacją load balancer lub reverse proxy np. serwer Nginx. Wszystko działa. Następnego dnia sprawdzasz logi dostępowe (kto do Ciebie wchodził) i widzisz tysiące zapytań z adresu... `127.0.0.1` (czyli od Ciebie samego)! Dlaczego? Ponieważ to Nginx (stojący lokalnie na Twoim serwerze) przyszedł do Twojego Gunicorna zapukać i to jego IP zapisano! Żeby w logach Gunicorna zobaczyć PRAWDZIWY adres IP prawdziwego użytkownika siedzącego u siebie w domu, musisz zmienić domyślny format logów z `%({h}i)s` na `%({x-forwarded-for}i)s`, które Nginx dokleja do oryginalnego żądania. W przeciwnym razie nigdy nie zbanujesz atakującego hakera, bo wszystkie ataki będą wyglądać, jakbyś dokonywał ich Ty sam ze swojej własnej maszyny!
