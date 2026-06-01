---
title: '02. Bezpieczne programowanie: Live Reload i dlaczego to tylko zabawka'
category: 'Uvicorn'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 02. Bezpieczne programowanie: Live Reload i dlaczego to tylko zabawka

Kiedy uczymy się FastAPI, parametr `--reload` to nasz najlepszy przyjaciel. Jeśli jednak nie rozumiemy, jak on działa "pod maską", bardzo łatwo możemy przemycić go na środowisko produkcyjne (albo do pliku Dockerfile). Skutki są opłakane.

---

### 1. ZWIĘZŁY KOD

```bash
# ✅ IDEALNIE: Kod używany WYŁĄCZNIE LOKALNIE podczas developmentu
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# ✅ IDEALNIE: Podstawowy kod uruchomieniowy na serwerze 
# (bez reload, nasłuchuje na wszystkich interfejsach IP)
uvicorn main:app --host 0.0.0.1 --port 80
```

### 2. METODA FEYNMANA

Wyobraźcie sobie biuro projektowe (serwer).
- **Z włączonym `--reload` (Development):** Zatrudniasz architekta (Główny Serwer). Ale ponieważ ciągle zmieniasz zdanie, przydzielasz mu dodatkowego asystenta. Zadaniem asystenta jest biegać w kółko wokół biurka i dosłownie co sekundę sprawdzać każdy pyłek na kartce papieru (Monitorowanie tysięcy plików w folderze systemu). Kiedy tylko zauważy, że dopisałeś kropkę, asystent podbiega do architekta, krzyczy: "PRZERWA! OD NOWA!" — dusi architekta i zatrudnia nowego, czystego. Kosztuje to gigantyczne ilości energii i zasobów, biuro spala prąd jak szalone.
- **Bez `--reload` (Produkcja):** Asystent zostaje zwolniony. Architekt siedzi i po prostu wykonuje swoją pracę bez przerw. Nikt go nie dusi, nikt go nie restartuje. Praca idzie 10x szybciej i pożera 10x mniej zasobów (Pamięci RAM i procesora). A jeśli Ty (Szef) wydasz nową instrukcję (Wdrożenie), po prostu dzwonisz, każesz mu iść do domu i zatrudniasz nowego z nową instrukcją (Restart serwera przez CI/CD).

### 3. MAPA MYŚLI

```markdown
- Uvicorn - Tryb Reload (`--reload`)
  - Przeznaczenie
    - Tylko i wyłącznie środowisko lokalne (Development)
    - Przyspiesza pisanie kodu poprzez natychmiastowe odświeżenie API
  - Dlaczego NAKAZUJE się go wyłączyć na produkcji?
    - Zabija wydajność I/O (Tysiące odpytań systemu plików na sekundę)
    - Tworzy dodatkowy proces-nadzorcę (Watchgod)
    - Zżera nadmierne ilości pamięci RAM
    - Ryzyko restartu aplikacji w ułamku sekundy podczas krytycznych operacji zapisu bazy
  - Biblioteka pomocnicza
    - `watchfiles` (Doinstalowywana w pakiecie `uvicorn[standard]`)
```

### 4. PUŁAPKA

**Zostawienie CMD z `--reload` wewnątrz pliku Dockerfile!**
Najczęstsza pułapka nowicjusza polega na tym, że testując aplikację lokalnie w Dockerze tworzy obraz Dockerfile, który na samym końcu ma linię: `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]`. Kod idzie na serwer produkcyjny, aplikacja wstaje. Po tygodniu ktoś wrzuca przez API na serwer plik JPG z awatarem użytkownika (zapis na dysk do folderu /media). Tryb `--reload` natychmiast zauważa ten nowy plik (nieważne, że to zdjęcie, a nie kod Pythona!) i... wykonuje brutalny restart całego produkcyjnego serwera w samym środku dnia, urywając 500 innych aktywnych zapytań HTTP! Nigdy, pod żadnym pozorem nie dodawaj flagi reload do obrazów przeznaczonych na produkcję!
