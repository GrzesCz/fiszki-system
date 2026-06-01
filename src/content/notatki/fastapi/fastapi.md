---
title: 'Masterclass: Projektowanie FastAPI na poziomie Senior Enterprise'
category: 'FastAPI'
status: zrobione
type: notatka
main: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---

# Masterclass: Projektowanie FastAPI na poziomie Senior Enterprise

Źródła: Transkrypcje kursu Udemy "FastAPI The-Complete-Course" (Roby), oficjalna dokumentacja FastAPI, wytyczne Clean Architecture, standardy PEP8 oraz najlepsze praktyki inżynierskie DSM PRO.

**Temat:** Budowanie skalowalnych, bezpiecznych i asynchronicznych API w FastAPI. Rygorystyczny kontrast pomiędzy "kursowymi/tutorialowymi" a produkcyjnymi standardami (Senior Enterprise), w tym: unikanie blokowania pętli zdarzeń, architektura 3-warstwowa, Pydantic v2 Settings, nowoczesne haszowanie haseł i separacja modeli ORM od kontraktów API.

---

## Wprowadzenie

Ten materiał stanowi zaawansowane rozwinięcie wiedzy o frameworku FastAPI, którego zadaniem jest płynne przejście od poziomu początkującego do standardów projektowania na poziomie Senior Enterprise.

Podczas początkowej nauki (np. z popularnych kursów Udemy), programiści często budują proste aplikacje (jak TodoApp) z lokalną bazą SQLite, gdzie podstawowe dekorowanie routerów daje szybki efekt wizualny. Niestety, kod, który sprawdza się w domowym projekcie lub na etapie MVP, na produkcji pod wpływem realnego obciążenia często całkowicie zawodzi.

W niniejszych notatkach na czynniki pierwsze rozłożone zostały najczęstsze błędy powielane w podstawowych kursach. Amatorskie rozwiązania (m.in. blokowanie pętli zdarzeń, hardkodowanie sekretów czy brak separacji warstw) zostają tu zestawione z profesjonalną, skalowalną architekturą klasy Enterprise.

---

## 1. Dlaczego kod z kursu Udemy to NIE jest poziom Senior? (Audyt Architektury)

Przyjrzyjmy się krytycznie strukturom z typowych kursów wideo (jak TodoApp z kursu Robiego). Poniższa tabela zbiera "błędy młodości" z tamtego projektu i zestawia je z profesjonalnymi standardami inżynierskimi:

| Obszar | Podejście z kursu (Tutorial Grade) | Wzorzec Enterprise (Senior Level) |
| :--- | :--- | :--- |
| **Pętla zdarzeń (I/O)** | Synchroniczny kod SQLAlchemy wewnątrz `async def` | Czysta asynchroniczność (Async DB client) LUB synchroniczne `def` delegowane do wątków |
| **Zarządzanie sekretami** | Hardkodowane klucze JWT (`SECRET_KEY`) w plikach kodu | Dynamiczna konfiguracja w `Pydantic Settings` z użyciem `SecretStr` |
| **Separacja warstw** | Mieszanie stron Jinja2 HTML z JSON API w tych samych routerach | Całkowity podział na czysty Backend API (REST/GraphQL) oraz niezależny Frontend |
| **Architektura kodu** | Bezpośrednie zapytania SQL/ORM wewnątrz funkcji routerów | Czysta architektura 3-warstwowa (Router $\rightarrow$ Service $\rightarrow$ Repository) |
| **Bezpieczeństwo** | Korzystanie z przestarzałej biblioteki `passlib` i gołe bloki `except:` | Haszowanie bezpośrednio przez `bcrypt`/`argon2` i precyzyjne typowanie wyjątków |
| **Kontrakt API** | Zwracanie surowych modeli SQLAlchemy bezpośrednio w odpowiedziach | Mapowanie na dedykowane schematy Pydantic (Request/Response DTO) |

---

## Szczegółowe omówienie zagadnień

Zapraszam do poszczególnych lekcji, gdzie rozkładamy te tematy na czynniki pierwsze, zachowując 4-punktową strukturę (Kod, Metoda Feynmana, Mapa Myśli, Pułapka):

1. [Pętla zdarzeń i Asynchroniczność](szczegoly/01_petla_zdarzen.md)
2. [Czysta Architektura 3-warstwowa](szczegoly/02_architektura.md)
3. [Zarządzanie Sekretami i Pydantic Settings](szczegoly/03_sekrety.md)
4. [Nowoczesne Haszowanie Haseł (bcrypt)](szczegoly/04_haszowanie.md)
5. [Precyzyjna Obsługa Wyjątków](szczegoly/05_wyjatki.md)

---

## Podsumowanie Złotych Zasad (FastAPI Enterprise)

1. **Nigdy nie blokuj pętli zdarzeń.** Jeśli używasz `async def`, każda operacja wejścia/wyjścia (baza, sieć, pliki) musi być asynchroniczna i wywołana przez `await`. Jeśli musisz użyć kodu synchronicznego — używaj zwykłej definicji `def`.
2. **Zachowuj rygorystyczną strukturę 3-warstwową.** Router ma być chudy. Logika biznesowa mieszka w serwisach, a zapytania do bazy w repozytoriach.
3. **Nie wystawiaj modeli DB.** Zawsze mapuj dane wejściowe i wyjściowe na schematy Pydantic (DTO).
4. **Ukrywaj sekrety.** Używaj `Pydantic Settings` i typu `SecretStr`. Zatrzymuj aplikację na starcie (`sys.exit(1)`), gdy brakuje zmiennych środowiskowych.
5. **Precyzyjnie obsługuj błędy.** Zapomnij o istnieniu gołego `except:`. Łap wyłącznie konkretne, spodziewane klasy wyjątków.
