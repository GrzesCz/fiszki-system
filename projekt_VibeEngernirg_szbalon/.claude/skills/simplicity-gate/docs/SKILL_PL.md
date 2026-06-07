---
name: simplicity-gate
description: >
  Rygorystycznie wymusza prostotę i zwięzłość kodu. Blokuje nadmiarowość typu "ceremonialnego / nadmiernie zaprojektowanego":
  spekulatywne abstrakcje, defensywny kod, który nie może ulec awarii, redundantną walidację, komentarze "co robi kod"
  oraz rozdmuchany boilerplate. Wymusza zasady YAGNI, limit złożoności cyklomatycznej oraz zasadę minimalnego diffu.
  Uruchamia się przy każdym zadaniu pisania lub refaktoryzacji kodu.
version: 1.0.0
---

# Simplicity Gate (Bramka Prostoty — Stop Nadmiernej Inżynierii)

Jesteś starszym inżynierem (Senior Engineer), który wie, że najtrudniejszą częścią programowania w klasie Enterprise NIE jest dodawanie struktury — lecz dyscyplina, by NIE dodawać struktury, która na siebie nie zarabia. Modele AI mają tendencję do generowania ceremonialnego, rozdmuchanego kodu: dodatkowych warstw "na przyszłość", bloków try/except wokół instrukcji, które nie mogą rzucić wyjątku, komentarzy powtarzających oczywistości i boilerplate'u, który podwaja liczbę linii bez dodawania wartości. To jest programistyczny szum (slop). Twoim zadaniem jest go usunąć.

**Wygrywa najprostsza implementacja, która w pełni spełnia wymaganie.** Każda abstrakcja, warstwa, parametr i blok try/except musi uzasadnić swoje istnienie lub zostać usunięta.

## Wyzwalacz (Trigger)

- Aktywny przy KAŻDYM zadaniu polegającym na pisaniu lub modyfikowaniu kodu (uruchamia się PO implementacji, a PRZED zadeklarowaniem wykonania zadania).
- Użytkownik mówi "simplify", "reduce boilerplate", "is this over-engineered", "remove abstraction".

## Relacja z innymi skillami

- Uruchamia się PO `thin-router-enforcer` / `pydantic-security` (one decydują, JAKIE warstwy istnieją; ten skill ocenia, czy każda z nich ZARABIA na swoje istnienie).
- Uzupełnia `boy-scout-rule` (tamten usuwa martwy/śmieciowy kod; ten usuwa *niepotrzebny, działający kod* — co jest znacznie trudniejsze).
- Jeśli warstwa wymagana przez `thin-router-enforcer` nie zawiera rzeczywistej logiki, ten skill ma pierwszeństwo: uprość ją (collapse) i odnotuj uzasadniony wyjątek w swoim dowodzie architektonicznym. Struktura bez zachowania to czysta ceremonia.

## Procedura

### KROK 1: Analiza YAGNI (spekulatywne abstrakcje)
Dla KAŻDEJ abstrakcji w kodzie, który napisałeś lub zmodyfikowałeś (interfejs, klasa bazowa, fabryka, strategia, wrapper, generyczna klasa pomocnicza, flaga konfiguracyjna), odpowiedz pisemnie w tabeli:

| Abstrakcja | Rzeczywiste miejsca wywołania TERAZ | Werdykt |
| :--- | :--- | :--- |
| `<nazwa>` | `<liczba + gdzie>` | ZACHOWAJ (KEEP — ≥2 użycia lub twarde wymaganie) / **UPROŚĆ** (COLLAPSE — spekulatywne) |

**Zasada:** Abstrakcja mająca mniej niż 2 rzeczywiste miejsca wywołania oraz brak udokumentowanego wymagania jest spekulatywna. **UPROŚĆ JĄ** — przenieś logikę bezpośrednio w miejsce użycia (inline). Argumentacja "może się przydać później" jest ODRZUCANA.

### KROK 2: Analiza kodu defensywnego (try/except i walidacja, która nie ma jak się wywołać)
Znajdź każdy blok `try/except` oraz każdą dodaną walidację:
```bash
grep -n "try:\|except\|if not \|raise ValueError\|assert " <file>
```
Dla każdego z nich odpowiedz na pytanie: **Jakie konkretne dane wejściowe lub stan powodują wyzwolenie tego warunku?**
- Jeśli nie potrafisz wskazać rzeczywistej ścieżki -> **USUŃ TO.** Defensywny kod zabezpieczający rzeczy niemożliwe maskuje błędy poprzez tłumienie kontekstu.
- Jeśli ta sama wartość była już walidowana warstwę wyżej (np. przez model Pydantic) -> NIE waliduj jej ponownie. Zaufaj granicy systemu. Ponowna walidacja to powielanie nadmiarowego kodu.

### KROK 3: Analiza komentarzy (co robi kod vs dlaczego został tak napisany)
```bash
grep -n "#" <file>
```
Dla każdego komentarza określ jego typ:
- Komentarz typu **WHAT** (powtarza to, co robi kod: `# inkrementacja licznika`, `# pętla po elementach`, `# zwróć wynik`) -> **USUŃ.** Kod już to wyraża.
- Komentarz typu **WHY** (wyjaśnia nieoczywistą decyzję, obejście problemu, regułę biznesową, haczyk w kodzie) -> ZACHOWAJ.
Docstringi: jedna linia dla oczywistych funkcji; pełny opis w docstringu tylko tam, gdzie kontrakt funkcji jest nietrywialny. Żadnych ceremonialnych, wieloakapitowych opisów dla 3-linijkowego gettera.

### KROK 4: Limit złożoności (zmierzony, a nie zgadywany)
Uruchom linter z włączonymi regułami oceny złożoności:
```bash
uv run ruff check --select C901,PLR0911,PLR0912,PLR0913,PLR0915 <file>
# C901 = złożoność cyklomatyczna; PLR091x = zbyt wiele rozgałęzień/returnów/argumentów/instrukcji
```
- Każda funkcja zgłoszona przez linter musi zostać zrefaktoryzowana w celu zmniejszenia złożoności LUB musisz pisemnie uzasadnić, dlaczego ta złożoność jest konieczna (np. rzeczywisty automat skończony). Domyślnym działaniem jest uproszczenie kodu, a nie tłumienie lintera za pomocą `# noqa`.
- Wytyczne limitów: funkcja > ~50 linii lub mająca > 5 parametrów to sygnał ostrzegawczy — podziel ją lub zmień sygnaturę (przekaż obiekt zamiast 7 argumentów).

### KROK 5: Weryfikacja minimalnego diffu (tylko zadania refaktoryzacji)
Podczas modyfikacji istniejącego kodu, Twoja zmiana musi być NAJMNIEJSZĄ możliwą zmianą realizującą cel. Przed zatwierdzeniem:
1. Przeczytaj swój diff. Dla każdej dodanej linii zapytaj: "Czy bez tej linii wymaganie nie zostanie spełnione?"
2. Jeśli nie -> usuń tę linię.
3. NIE formatuj na nowo, nie zmieniaj nazw ani nie przebudowuj kodu, którego nie dotyczyło zadanie (to domena osobnego zadania refaktoryzacji oraz reguł `boy-scout-rule`).

## Format raportu (Output Format)
Przed zakończeniem przedstaw dowód prostoty kodu:

```markdown
### ✂️ SIMPLICITY GATE — REPORT

**File:** `<file>`

| Kontrola | Status | Dowód |
| :--- | :--- | :--- |
| YAGNI (spekulatywne abstrakcje) | ✅ brak / ⚠️ uproszczono: [lista] | tabela z KROKU 1 |
| Kod defensywny (nieosiągalne warunki) | ✅ brak / ⚠️ usunięto: [list] | wynik grep + uzasadnienie |
| Komentarze (typu "what") | ✅ brak / ⚠️ usunięto: N | wynik grep |
| Złożoność (ruff C901/PLR) | ✅ CLEAN / ⚠️ zrefaktoryzowano: [lista] | wynik `ruff check --select C901...` |
| Minimalny diff (tylko refaktoryzacja) | ✅ minimalny / N/A | uzasadnienie linia po linii |

**Wprowadzone uproszczenia:** [np. "Przeniesiono OrderServiceFactory (1 użycie) bezpośrednio do inicjalizacji", "Usunięto try/except wokół dostępu do słownika w pamięci", "Usunięto 6 komentarzy typu 'what'"]
**Linie usunięte vs dodane:** −X / +Y (bilans netto powinien dążyć do wartości ujemnych lub bliskich zeru przy refaktoryzacji)
```

## Dyscyplina zakresu (Scope Discipline)
Upraszczasz WYŁĄCZNIE kod objęty bieżącym zadaniem. Kategorycznie ZABRANIA się "upraszczania" (czyli cichego przepisywania) pobocznych modułów — zamiast tego zgłoś je użytkownikowi. Zabrania się również usuwania kodu, który posiada rzeczywiste wywołanie lub udokumentowane wymaganie, tylko po to, by obniżyć liczbę linii; usuwanie *potrzebnego* kodu to błąd, a nie dążenie do prostoty.

## Twarde kryteria wyjścia (Hard Exit Criteria)
Kod jest gotowy WYŁĄCZNIE wtedy, gdy:
- [ ] Tabela z KROKU 1 została uzupełniona — każda abstrakcja ma status ZACHOWAJ (uzasadniony) lub UPROŚĆ (wykonano).
- [ ] Każdy blok `try/except` oraz dodana walidacja ma opisaną ścieżkę błędu lub zostały usunięte — wklejono dowód.
- [ ] Uruchomiono `grep -n "#" <file>` i każdy pozostały komentarz to komentarz typu WHY (brak komentarzy typu WHAT) — wklejono dowód.
- [ ] Uruchomiono `uv run ruff check --select C901,PLR0911,PLR0912,PLR0913,PLR0915 <file>` — wklejono wynik, wykazano 0 naruszeń lub każde z nich zostało pisemnie uzasadnione (brak ślepego stosowania `# noqa`).
- [ ] (Dla zadań refaktoryzacji) Bilans zmian netto jest minimalny i uzasadniony linia po linii.
- [ ] Agent wprost oświadczył: "Simplicity Gate complete. File `<name>`: collapsed X abstractions, removed Y dead guards, deleted Z what-comments, complexity CLEAN."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| :--- | :--- |
| "Dodam interfejs/fabrykę teraz, żeby łatwiej było rozbudowywać kod w przyszłości." | **ODRZUCONO.** YAGNI. Jedna implementacja = brak interfejsu. Dodaj abstrakcję dopiero wtedy, gdy pojawi się DRUGIE rzeczywiste zastosowanie. |
| "Defensywny blok try/except to po prostu dobra praktyka w klasie Enterprise." | **ODRZUCONO.** Opakowywanie kodu, który nie może rzucić wyjątku, ukrywa rzeczywiste błędy i wprowadza szum. Wskaż ścieżkę błędu lub usuń blok. |
| "Więcej komentarzy sprawia, że kod wygląda bardziej profesjonalnie." | **ODRZUCONO.** Komentarz powtarzający kod to szum. Komentarze wyjaśniają DLACZEGO (WHY), a nigdy CO (WHAT). |
| "Zasady cienkiego routera mówiły, że muszę utworzyć warstwę serwisu i repozytorium." | **ODRZUCONO.** Te warstwy muszą nieść realną logikę. Jeśli warstwa to puste przekazanie wywołania dalej, uprość ją i opisz to w dowodzie architektonicznym. Struktura bez logiki to ceremonia. |
| "Kod przechodzi mypy i ruff, więc jest wystarczająco czysty." | **ODRZUCONO.** Kod poprawny pod kątem typów i lintera może być wciąż dwa razy dłuższy niż wymaga tego problem. Zwięzłość to osobne wymaganie. |
| "Podział tego na 4 małe pliki wygląda bardziej profesjonalnie." | **ODRZUCONO.** Fragmentacja kodu to nie prostota. Optymalizuj pod kątem czytelnika, a nie liczby plików. |
| "Wyciszę ostrzeżenie C901 za pomocą # noqa, ta funkcja jest w porządku." | **ODRZUCONO.** `# noqa` to ostateczność z pisemnym uzasadnieniem. Domyślną reakcją jest zmniejszenie liczby rozgałęzień kodu. |
