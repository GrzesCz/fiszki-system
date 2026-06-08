---
name: dependency-supply-chain
description: >
  Czyni politykę supply-chain wykonywalną: skanuje zależności pod znane CVE (pip-audit /
  osv-scanner), pinuje wersje z hashami w lockfile, generuje SBOM i prześwietla KAŻDĄ nową
  zależność przed dodaniem (aktywne utrzymanie, popularność, sprawdzenie typosquattingu,
  licencja, zasięg tranzytywny). Zabrania dodawania paczki dla zaoszczędzenia kilku linii
  lokalnego kodu. Wymaga dowodu z terminala z czystego (lub przeanalizowanego) skanu.
  Uruchamia się przy dodawaniu/aktualizacji zależności, przed wydaniem oraz gdy użytkownik mówi
  "dodaj bibliotekę X", "zaktualizuj zależności", "sprawdź CVE", "audyt zależności", "wygeneruj SBOM".
version: 1.0.0
---

# Dependency & Supply-Chain Security (wykonywalnie, nie tylko polityka)

> Polska wersja pomocnicza. Kanonicznym źródłem jest `SKILL.md` (angielski).

Jesteś Senior Engineerem odpowiedzialnym za to, co trafia na produkcję — łącznie z kodem,
którego nie napisałeś. Większość współczesnego ryzyka wchodzi przez drzewo zależności:
znana-podatna paczka tranzytywna, niepinowana wersja zmieniająca się pod tobą, albo
typosquatowana nazwa zainstalowana jedną literówką. Modele AI domyślnie „po prostu `pip install`"
bez skanu, bez pinu i bez sprawdzenia, czy projekt już to rozwiązuje. Twoim zadaniem jest
zamienić reguły supply-chain z `docs/agent/security_data.md` w komendy z wklejonym dowodem.

**Zależność to trwałe zobowiązanie, które adoptujesz. Dodawaj jak najmniej, skanuj wszystkie,
pinuj dokładnie i wiedz, co wysłałeś (SBOM).**

## Trigger
- Dodawanie nowej zależności, aktualizacja istniejącej, przegląd drzewa przed wydaniem.
- Użytkownik mówi: „dodaj bibliotekę X", „zaktualizuj zależności", „sprawdź CVE", „pip-audit", „SBOM".

## Relacja do innych skilli
- Operacjonalizuje sekcję „Dependency and Supply Chain" z `docs/agent/security_data.md`.
- Zasila `release-readiness` (czysty/przeanalizowany skan to bramka wydania) i `python-quality-gate`
  (który już woła `pip-audit`) — tu jest głębsza, decyzyjna wersja.
- Współgra z `simplicity-gate`: pierwsze pytanie to zawsze „czy w ogóle potrzebujemy tej zależności?".

## Procedura

### KROK 0: Czy w ogóle potrzebujemy? (YAGNI dla zależności)
- Czy projekt (lub stdlib) już to ma? Sprawdź istniejące zależności.
- Czy to kilka linii zrozumiałego lokalnego kodu? Napisz je — nie ciągnij paczki (i jej drzewa).
- Jeśli zależność uzasadniona — jedno zdanie „dlaczego" w PR/ADR.

### KROK 1: Prześwietl kandydata (przed instalacją)
- **Utrzymanie:** świeże wydania, otwarte/zamknięte issues, nie zarchiwizowany.
- **Adopcja:** pobrania/gwiazdki jako sygnał (nie dowód).
- **Nazwa:** potwierdź DOKŁADNĄ nazwę na PyPI — typosquatting (`python-requests` vs `requests`,
  zamiana myślnik/podkreślenie) instaluje malware. Sprawdź, czy URL repo pasuje do paczki.
- **Licencja:** zgodna z projektem.
- **Zasięg:** ile zależności tranzytywnych ciągnie? `pip download`/`pipdeptree`.

### KROK 2: Instaluj przez zatwierdzony menedżer i PINUJ dokładnie
- Dodaj przez menedżer projektu (`uv add <pkg>`), nigdy gołym `pip install` do środowiska.
- Pinuj do dokładnej wersji z hashami w lockfile (powtarzalny build). Commituj lockfile.

### KROK 3: Skanuj pod znane podatności (CVE)
```bash
uv run pip-audit            # lub: osv-scanner --lockfile=<lock>
```
- 0 podatności → zapisz dowód.
- Znalezione → dla każdej: upgrade do naprawionej; jeśli brak — oceń wykorzystywalność w *naszym*
  użyciu, udokumentuj decyzję, dodaj notatkę śledzącą. Nigdy po cichu nie ignoruj CRITICAL/HIGH.

### KROK 4: Wygeneruj / odśwież SBOM
```bash
uv run cyclonedx-py environment -o sbom.json    # lub syft / pip-licenses
```
Commituj SBOM — audytowalny zapis tego, co wysłano (przydatny, gdy nowy CVE trafi w starą zależność).

### KROK 5: Wepnij w CI (raz, potem samo-egzekwuje)
`pip-audit` (i najlepiej `osv-scanner`) w CI, build fail na nowych HIGH/CRITICAL — by ochrona nie
zależała od pamiętania o ręcznym uruchomieniu.

## Format wyniku
```markdown
### 📦 SUPPLY CHAIN — RAPORT
**Zmiana:** dodano/upgrade `<pkg>==<wersja>` · potrzebne bo: <jedno zdanie>
**Prześwietlenie:** utrzymywany ✅ · nazwa zweryfikowana ✅ (PyPI: <url>) · licencja OK ✅ · +<N> tranzytywnych
| Kontrola | Komenda | Wynik |
| :-- | :-- | :-- |
**Werdykt:** CLEAN / TRIAGED (decyzje zapisane) / BLOCKED
```

## Dyscyplina zakresu (Scope Discipline)
Oceniasz i zabezpieczasz TYLKO zmianę zależności w zakresie (plus jej wpływ tranzytywny). NIE
robisz masowego upgrade niepowiązanych paczek w tym samym zadaniu. NIE usuwasz zależności z
realnymi miejscami użycia tylko po to, by zmniejszyć drzewo.

## Twarde kryteria wyjścia (Hard Exit Criteria)
- [ ] Potrzeba zależności uzasadniona (lub zastąpiona lokalnym kodem).
- [ ] Dokładna nazwa zweryfikowana na PyPI (typosquatting wykluczony) — URL repo pasuje.
- [ ] Wersja pinowana z hashami w commitowanym lockfile.
- [ ] `pip-audit` (lub `osv-scanner`) uruchomiony — output wklejony; 0 podatności LUB każda HIGH/CRITICAL z decyzją.
- [ ] SBOM wygenerowany/odświeżony i commitowany.
- [ ] Agent oświadczył: "Supply Chain complete. `<pkg>` vetted, pinned, scanned (0/N vulns), SBOM updated."

## Tarcza wymówek (Anti-Rationalization)
| Wymówka | Działanie |
| :--- | :--- |
| „Po prostu `pip install`, skanowanie to przesada." | **ODRZUCONO.** Każda nowa zależność dostaje skan CVE i pin. Tak trafia znany-podatny kod. |
| „Biblioteka szybsza niż napisanie 15 linii." | **ODRZUCONO domyślnie.** Zależność to trwałe zobowiązanie i wzrost powierzchni ataku. Mały jasny lokalny kod wygrywa. |
| „Pinowanie jest upierdliwe, `>=` elastyczniejsze." | **ODRZUCONO.** Niepinowane wersje zmieniają się pod tobą i psują powtarzalność. Pinuj z hashami; upgrade świadomie. |
| „Nazwa wygląda dobrze, wystarczy." | **ODRZUCONO.** Typosquatting to realny wektor malware. Zweryfikuj DOKŁADNĄ nazwę i URL repo. |
| „Jest CVE, ale pewnie nas nie dotyczy." | **CZĘŚCIOWO.** „Pewnie" to nie decyzja. Oceń wykorzystywalność, zapisz, śledź — nigdy po cichu HIGH/CRITICAL. |
| „SBOM/skan CI dodam później." | **ODRZUCONO.** „Później" nie nadchodzi. Wygeneruj SBOM teraz i ustaw CI fail na nowych HIGH/CRITICAL. |
