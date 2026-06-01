---
title: '03. Gunicorn jako Process Manager (Standard Produkcyjny)'
category: 'Uvicorn'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 03. Gunicorn jako Process Manager (Standard Produkcyjny)

Samo odpalenie Uvicorna nie jest produkcyjne. Uvicorn to wspaniały i szybki serwer ASGI, jednak nie potrafi sam w sobie zarządzać procesami systemu (tzw. process manager). Brak nadzorcy oznacza, że aplikacja jest podatna na bezpowrotne ubicie (Crash) oraz nie skaluje się na wszystkie rdzenie procesora maszyny!

---

### 1. ZWIĘZŁY KOD

```bash
# ✅ IDEALNIE: Kod używany na środowisku produkcyjnym (np. EC2, VPS) bez platform kontenerowych
# Tworzymy 4 niezależne procesy-robotników (workers) z użyciem klasy Uvicorna
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:80

# (Dla przypomnienia, wewnątrz kontenerów Docker preferuje się po prostu:)
# uvicorn main:app --host 0.0.0.0 --port 80 --workers 4
```

### 2. METODA FEYNMANA

Wyobraźcie sobie fabrykę koszulek i pracownika nazwanego Pan Uvicorn.
- **Odpalenie czystego Uvicorna na produkcji:** Fabryka ma 8 potężnych maszyn do szycia (8 rdzeni procesora). Zatrudiacie Pana Uvicorna (Jeden Proces). Pan Uvicorn siada do PIERWSZEJ maszyny i szyje koszulki jak szalony (jest niesamowicie wydajny!). Ale nagle igła uderza w palec, Pan Uvicorn mdleje (Crash serwera, np. błąd pamięci). Pozostałe 7 maszyn stoi pustych od rana! Produkcja stoi, aplikacja nie działa.
- **Odpalenie Gunicorna + Uvicorn Workers:** Zatrudniacie dyrektora zarządzającego (Gunicorn). Dyrektor NIGDY sam nie szyje koszulek. Jego jedynym zadaniem jest nadzór. Dyrektor rekrutuje 8 sklonowanych Panów Uvicornów (`-w 8`) i posadza każdego z nich przy osobnej maszynie (Wykorzystanie 100% maszyny i CPU). Jeśli czwarty Uvicorn zemdleje przy pracy, dyrektor natychmiast kopie go w kostkę, wyrzuca za drzwi i z automatu rekrutuje kolejnego świeżego pracownika na jego miejsce (Restart uśmierconego procesu). Aplikacja jest niezniszczalna!

### 3. MAPA MYŚLI

```markdown
- Uruchamianie Produkcyjne
  - Process Manager (Zarządca: Gunicorn)
    - Dba o to, żeby zawsze działała zadeklarowana liczba procesów (Resilience)
    - Równomiernie rozdziela żądania HTTP na podrzędnych robotników
    - Posiada zaawansowane opcje daemonizacji i logowania
  - Worker Class (Robotnicy: UvicornWorker)
    - Przekazuje Gunicornowi instrukcję: "Używaj ASGI zamiast tradycyjnego WSGI"
    - Odbiera żądanie od Gunicorna i przetwarza asynchroniczny kod FastAPI
  - Ilość workerów (`-w`)
    - Standardowa formuła: `(2 * Liczba Rdzeni CPU) + 1`
    - Wartość dobierana pod kątem dostępnej pamięci RAM (np. 1 worker = 150MB, 4 workery = 600MB)
```

### 4. PUŁAPKA

**Niewiedza o Dockerze vs VPS/EC2!**
Programiści często uczą się zasady "Zawsze używaj Gunicorna na produkcji" jak mantry. Po czym przenoszą aplikację do systemu Kubernetes albo czystego Dockera i w `Dockerfile` wpisują `CMD ["gunicorn", ...]`. W nowoczesnej chmurze kontenerowej to Docker sam w sobie (oraz Kubernetes) jest Twoim menedżerem procesów (Dyrektorem Fabryki). Jeśli kontener ulegnie awarii, Kubernetes z automatu podniesie nowy. Jeśli potrzebujesz więcej rdzeni, skalujesz repliki w Kubernetesie. Twórca FastAPI jasno w dokumentacji ostrzega: jeśli puszczasz kontener dockera, po prostu użyj w nim czystego `uvicorn main:app --workers 4`. Dodawanie trzeciej warstwy nadzoru (Kubernetes -> Gunicorn -> Uvicorn) to strzelanie z armaty do muchy, co tylko komplikuje architekturę i zżera RAM dyrektorami. Używaj Gunicorna tylko wtedy, gdy wdrażasz "na blachę" (tzw. Bare Metal) lub czystą wirtualkę np. DigitalOcean/EC2 (Linux Systemd).
