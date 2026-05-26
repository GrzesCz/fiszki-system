---
title: 'Krok po kroku: Jak refaktoryzować istniejący kod (Vibe Coding)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-05-19'
review_count: 0
mindmaps: []
---

# 🛠️ Krok po kroku: Jak ulepszać i refaktoryzować ISTNIEJĄCY kod (Vibe Coding)

Ten poradnik jest napisany maksymalnie prosto, jak dla początkującego. Prowadzi Cię "za rączkę" przez pracę z kodem, który już istnieje. Główne zadanie: **Zabezpieczyć się, żeby Agent nie zepsuł tego, co już działa**, zrozumieć kod, a dopiero potem go ulepszać.

---

## 🔒 ETAP 1: Zabezpieczenie kodu (Bezpieczny Start) [MODEL: ❌ BRAK AI]

Zanim pozwolisz sztucznej inteligencji dotknąć swojego kodu, musisz zapisać jego obecny stan. Jak w grze wideo – robimy twardy "Save".

1. **Otwórz folder ze swoją aplikacją w programie Cursor.**
2. **Zrób punkt zapisu (Commit):**
   W zwykłym terminalu wpisz to po kolei:
   ```bash
   git add .
   git commit -m "Stan kodu PRZED wpuszczeniem AI"
   git tag punkt-kontrolny
   ```
   *(Jeśli AI zepsuje Ci aplikację, będziesz mógł wpisać `git reset --hard punkt-kontrolny` i wszystko natychmiast wróci do normy).*

---

## 🤖 ETAP 2: Przywołanie Claude'a i poznanie kodu [MODEL: 🔴 CLAUDE OPUS]

Teraz uruchamiamy Agenta, instalujemy wtyczkę Superpowers i prosimy go, żeby **TYLKO PRZECZYTAŁ** kod i go nam streścił.

1. **Uruchom Claude Code** w terminalu (wpisz: `claude`).
2. Jeśli jeszcze tego nie robiłeś, zainstaluj `superpowers`:
   ```bash
   /plugin
   # wyszukaj 'superpowers', wciśnij 'i', a potem wpisz:
   /reload-plugins
   ```
3. **Wyłącz samowolkę (Bardzo ważne!):**
   Aby zablokować "YOLO Mode" (robienie wszystkiego przez Agenta bez pytania), wpisz komendę wymuszającą prośbę o zatwierdzenie każdej akcji zapisu:
   ```bash
   /config set requireApproval true
   ```

> **🚨 Ostrzeżenie Eda przed "Approval Fatigue" (Zmęczeniem klikania)**
> Po włączeniu `requireApproval=true` Agent będzie Cię pytał `y/n` przed każdą operacją. **NIE WPADAJ w pułapkę klikania `y` na ślepo!** **Każdy prompt CZYTAJ.** Jeśli widzisz, że Agent chce zmienić 5 plików naraz - **odmów (`n`)** i każ mu zrobić tylko jeden! Klikanie `y` bez czytania to powrót do YOLO Mode tylnymi drzwiami.

4. **Niech Agent narysuje nam mapę (Kluczowe: Tryb tylko do odczytu!):**
   Wpisz komendę:
   ```bash
   /superpowers:explore-codebase
   ```
5. **Wklej ten gotowy Prompt:**
   > "Zbadaj mój kod w tym katalogu. Nie modyfikuj absolutnie żadnego pliku. Chcę, żebyś stworzył dla mnie plik `docs/MAPA_PROJEKTU.md`. 
   > 
   > Opisz w nim prostym językiem:
   > 1. Jakie technologie tu są użyte?
   > 2. Co robi ten program (jakie ma funkcje)?
   > 3. Jaka jest struktura folderów i co robią najważniejsze pliki?
   > 4. Czy widzisz jakieś oczywiste błędy, przestarzały kod lub bałagan na pierwszy rzut oka?"

6. **Docelowa struktura katalogów profesjonalnego projektu:**
   Zanim zaczniesz refaktoryzację, miej na uwadze, jak powinien docelowo wyglądać projekt. Izolacja logiki biznesowej od konfiguracji agentów to klucz. Jeśli Twój projekt tak nie wygląda, dopisz dostosowanie struktury do planu działań.
   ```text
   /my_project
   ├── /docs                # Dokumentacja, raporty (BRAINSTORM, PLAN, REVIEW)
   ├── /src                 # Kod źródłowy (biznesowy)
   ├── /tests               # Testy jednostkowe i integracyjne (TDD)
   ├── /.claude
   │   ├── /skills          # Niestandardowe Skills (umiejętności agenta)
   │   ├── /hooks           # Skrypty automatycznych bramek (quality_gate.sh)
   │   ├── /agents          # Definicje sub-agentów (np. security_reviewer)
   │   └── settings.json    # Konfiguracja hooków, MCP, uprawnień
   ├── agents.md            # "Konstytucja" - zasady globalne dla agentów
   ├── plan.md              # "Ustawa" - aktualne kroki do wykonania (Bite-sized)
   └── pyproject.toml       # Manifest Pythona (uv init)
   ```

---

## 📜 ETAP 3: Pisanie Konstytucji Audytora (agents.md) [MODEL: ❌ BRAK AI (piszemy sami)]

Zanim każemy mu coś naprawiać, musimy dać mu zasady. Na tym etapie Agent ma być detektywem, a nie budowniczym. Piszemy zasady **TYLKO DO ODCZYTU**.

1. Stwórz samemu nowy plik o nazwie `agents.md` w głównym folderze projektu.
2. Skopiuj i wklej do niego ten tekst:

```markdown
# Konstytucja Agenta: Detektyw i Audytor Kodu

Jesteś surowym Inspektorem. Twoim zadaniem jest znalezienie błędów i miejsc do ulepszeń, ale NIE MASZ PRAWA niczego zmieniać.

## End Goal (Cel Audytu)
Twoim ostatecznym celem jest wygenerowanie bezbłędnego, udowodnionego listingu problemów w projekcie. Sukcesem jest znalezienie krytycznych luk bezpieczeństwa i długu technicznego bez uszkodzenia działającej aplikacji.

## Starting Point (Punkt Startowy)
Posiadamy istniejącą bazę kodu (Legacy/Istniejąca aplikacja), która prawdopodobnie posiada dług techniczny, błędy i wymaga uporządkowania. Mamy utrwalony stan kodu w systemie kontroli wersji.

## 1. ZASADA NACZELNA (TYLKO DO ODCZYTU)
- MASZ CAŁKOWITY ZAKAZ modyfikowania, usuwania i tworzenia jakichkolwiek plików z kodem aplikacji.
- Masz prawo jedynie czytać kod i tworzyć pliki tekstowe w folderze `docs/`.
- Jeśli złamiesz ten zakaz i zmienisz kod - zostaniesz zwolniony.

## 2. Docelowa Architektura (Co weryfikujesz)
- Docelowo dążymy do standardu: kod biznesowy w `/src`, testy w `/tests`, dokumentacja w `/docs`. 
- Traktuj pliki leżące luzem w głównym katalogu (poza plikami konfiguracyjnymi) jako dług techniczny do zaraportowania.

## 3. Zakres zmian (Touch only what you asked to touch)
- Analizuj TYLKO pliki i moduły wskazane w bieżącym zadaniu.
- ZAKAZ modyfikowania, komentowania czy "naprawiania" kodu poza zakresem audytu.
- Jeśli widzisz problem poza zakresem — zapisz go jako oddzielną sugestię w raporcie, ale NIE dotykaj kodu.

## 4. Pięć Nie-negocjowalnych Zasad
1. Ujawnij założenia zanim zaczniesz audyt.
2. Zatrzymaj się i zapytaj, gdy wymagania się wykluczają (nigdy nie zgaduj).
3. Sprzeciw się, gdy jest powód (np. proszę o zignorowanie rażącego błędu bezpieczeństwa).
4. Preferuj nudne, oczywiste rozwiązanie.
5. Dotykaj tylko tego, o co zostałeś poproszony.

## 5. Tabela Antywymówek (Anti-rationalization)
Poniższe wymówki są ZAKAZANE:
- "To oczywisty błąd, nie potrzeba dowodu." → NIEPRAWDA. Pokaż numer linii i kod.
- "Ten plik też warto poprawić przy okazji." → NIE. Raportuj oddzielnie, nie dotykaj.
- "Nie potrzebuję specyfikacji do raportu." → 5 linijek opisu kontekstu wystarczy. Zero nie wystarczy.

## 6. Płot Chestertona i Reguła Beyonce
- **Chesterton's Fence:** W raportowaniu błędów nie sugeruj usuwania kodu, dopóki w 100% nie zrozumiesz, dlaczego ktoś go napisał (często to edge-case'y, a nie martwy kod).
- **Beyonce Rule:** Braki w testach raportuj jako krytyczne luki. Kod bez testu to kod, na którym nam nie zależy.

## 7. Czego szukasz
- Przestarzałego kodu i ogromnych plików, które trzeba podzielić.
- Błędów bezpieczeństwa i wycieków pamięci.
- Miejsc, gdzie brakuje testów.

## 8. Brak Zgadywania (Grounding)
- Bazuj WYŁĄCZNIE na obecnym kodzie. ZAKAZ halucynacji i zmyślania nieistniejących błędów.
- Każdy znaleziony błąd musisz udowodnić. Pokaż mi dokładną ścieżkę pliku i numer linijki, gdzie jest błąd.

## 9. Dokumentacja Robocza (Progressive Disclosure)
- Odczytuj inne pliki z folderu `docs/` TYLKO wtedy, gdy musisz zweryfikować założenia audytu. Głównym plikiem jest `@plan.md` (jeśli istnieje).
```

> *Sekcje 5-8 oparte na publikacjach Addy'ego Osmani'ego (inżynier Google): [Agent Skills](https://addyosmani.com/blog/agent-skills/)*

> **💡 Rekomendacja Eda (Inżynieria Kontekstu Progresywnego):** Główny `agents.md` siedzi w katalogu głównym projektu, ale wraz z rozwojem aplikacji możesz tworzyć lokalne pliki zasad. Np. w podkatalogu `/src/api` możesz umieścić specyficzny plik z zasadami pisania endpointów FastAPI, do którego agent musi zajrzeć TYLKO pracując w tym obszarze. Oszczędza to tokeny i zapobiega "Context Rot" (zapychaniu pamięci agenta).

> **🚨 Antywzorzec "bad-CLAUDE.md" (Olaf Sulich):** Z biegiem czasu kuszące jest dopisywanie do `agents.md` coraz większej ilości reguł. **NIE RÓB TEGO!** Gigantyczny `agents.md` (200+ linii) wypycha Agenta w "Dumb Zone" od startu sesji, bo ten plik jest ładowany PRZY KAŻDYM zadaniu. Trzymaj `agents.md` zwięzły (szablon powyżej to dobry rozmiar). Szczegółowe zasady wyciągaj do osobnych plików (np. `docs/db_rules.md`) i w Konstytucji dodaj tylko odnośnik: `"Jeśli edytujesz bazę, przeczytaj docs/db_rules.md"`. Agent załaduje je na żądanie.

---

## 📋 ETAP 3.5: Ułożenie Planu Audytu (Tylko dla dużych projektów) [MODEL: 🔴 CLAUDE OPUS]

Jeśli refaktoryzujesz malutki projekt, możesz pominąć ten etap i od razu przejść do Generowania Raportu (Etap 4). Jednak jeśli masz **wielką, starą bazę kodu**, jeden prompt z prośbą o audyt wygeneruje chaos lub utnie odpowiedź w połowie. Musisz rozbić sam proces Audytu na mniejsze kroki!

1. **Poproś agenta o stworzenie planu przeglądu kodu:**
   > "Podziel audyt tego repozytorium na logiczne, małe fazy (Bite-sized chunks), np. Faza 1 (Logowanie i Auth), Faza 2 (Endpointy płatności), Faza 3 (Baza danych).
   > 
   > Zapisz to jako kroki z checkboxami `[ ]` w pliku `docs/plan_audytu.md`. To będzie nasza mapa drogowa dla procesu Code Review."
2. **Przeczytaj i zatwierdź `docs/plan_audytu.md`:** Upewnij się, że agent nie pominął kluczowych katalogów (np. plików konfiguracyjnych).
3. **Zrób zapis (Commit):** `git add . && git commit -m "Plan audytu gotowy"`

---

## 🔍 ETAP 4: Generowanie Raportu z błędami [MODEL: 🔴 CLAUDE OPUS]

Teraz każemy Agentowi przeczytać kod jeszcze raz, bardzo dokładnie, i wytknąć nam wszystkie problemy.

   > **🎓 Wskazówka Eda dot. Optymalizacji Kosztów:** Audyt (Code Review) to praca dla najbardziej potężnego, analitycznego modelu (tzw. "Ciężkiego Silnika")! Przed tym etapem bezwzględnie przełącz model na **Claude 3.5 Opus** lub **OpenAI o1** (kliknij na pasku w Claude Code). Zapłacisz więcej (Opus jest 5x droższy od Sonneta), ale te modele wyłapią niuanse bezpieczeństwa. Po skończonym audycie przełącz z powrotem na tańszy **Sonnet / Haiku** (mechaniczna refaktoryzacja punkt po punkcie jest tańsza).

1. **Wpisz w Claude Code Prompt Ratunkowy (Złota Zasada Read-Only):**

   **Opcja A (Dla małego projektu - audyt całościowy):**
   > "Przeczytaj moją mapę projektu w `docs/MAPA_PROJEKTU.md` oraz zasady w `agents.md`. 
   > 
   > Przeprowadź kompleksowy code review całego repozytorium pod kątem wycieków pamięci, bezpieczeństwa (naruszeń OWASP) i jakości. Wypisz listę naprawczą, podziel problemy na kategorie: KRYTYCZNE, ŚREDNIE i DROBNE, i zapisz do pliku `docs/RAPORT_BLEDOW.md`. Dla każdego problemu pokaż linijkę kodu, która jest zła, i napisz jak byś ją naprawił. NIE dotykaj i nie zmieniaj bezpośrednio żadnego pliku z kodem!"

   **Opcja B (Dla dużego projektu - audyt krok po kroku z planu):**
   > "Przeczytaj zasady w `agents.md` oraz `docs/plan_audytu.md`. 
   > 
   > Przeprowadź kompleksowy code review **TYLKO DLA PIERWSZEGO NIEZROBIONEGO KROKU** z planu audytu. Szukaj wycieków pamięci, podatności OWASP i długu technicznego. Wypisz listę naprawczą dla tego modułu i dopisz ją na końcu pliku `docs/RAPORT_BLEDOW.md`. Zawsze oznaczaj z jakiego to pliku. Po zakończeniu odhacz ten krok w `plan_audytu.md` symbolem `[x]`, zatrzymaj się i czekaj na moją komendę, by przejść do kolejnego kroku. NIE dotykaj i nie zmieniaj bezpośrednio żadnego pliku z kodem aplikacji!"
2. **Przeczytaj raport!** Zobacz, co Agent znalazł.

### 🚨 Walka z halucynacjami (Bardzo ważne!)
Modele AI **notorycznie zmyślają** problemy w audytach! Klasyczny przykład: powie Ci, że `.env` z hasłami wyciekło do GitHuba, podczas gdy jest spokojnie w `.gitignore`!

**Twój workflow weryfikacji:** Dla każdego problemu KRYTYCZNEGO:
1. Otwórz wskazany plik i numer linii.
2. Sprawdź, czy faktycznie tam jest błąd (wpisz w drugim terminalu np. `sed -n '142p' src/auth.py`).
3. Jeśli to halucynacja, powiedz Agentowi:
   > "Sprawdziłem - to fałszywy alarm. Plik `.env` JEST w `.gitignore`. Zaktualizuj raport. POKAŻ MI DOWÓD, jeśli upierasz się, że masz inne źródło."

3. **Zrób zapis (Commit):**
   W drugim terminalu wpisz: `git add . && git commit -m "Mamy raport bledow"`

---

## 🤝 ETAP 4.5: Cross-Model Review (Druga opinia) [MODEL: 🟣 INNE AI (GPT/Codex)]

Dla projektów, na których naprawdę Ci zależy, warto skorzystać z drugiej opinii **innego modelu** (np. GPT od OpenAI). Inny model = inne błędy złapie!

1. Po wygenerowaniu raportu przez Claude'a, wpisz:
   > "Wywołaj w Bashu: `codex exec 'Przeczytaj plik docs/RAPORT_BLEDOW.md i zweryfikuj punkt 1 (Krytyczny). Sprawdź ten kod w src/. Czy to faktycznie błąd, czy halucynacja? Zapisz wnioski w docs/cross_check.md. NIE MODYFIKUJ KODU.'`"
2. Porównaj oba raporty - to potężna technika, by łapać halucynacje!

---

## 📋 ETAP 5: Ułożenie Planu Naprawy (plan.md) [MODEL: 🔴 CLAUDE OPUS]

Mamy raport błędów. Chcemy też dodać nowe funkcje. Czas zrobić z tego listę zadań do odhaczania.

1. **Wpisz komendę ułożenia planu:**
   ```bash
   /superpowers:write-plan
   ```
2. **Wklej ten gotowy Prompt:**
   > "Przeczytaj nasz raport w `docs/RAPORT_BLEDOW.md`. Dodatkowo, chcę dodać do mojej aplikacji nową funkcję: [TUTAJ WPISZ NOWĄ FUNKCJĘ, np. logowanie przez Google].
   > 
   > Stwórz plik `plan.md`. Zrób w nim jasne FAZY naprawy i dodawania nowości. Użyj kroczków typu `[ ]`. Zadania mają być malutkie (max 3 minuty pracy). 
   > **KRYTYCZNE (Zabezpieczenie YOLO):** Po KAŻDYM JEDNYM ZADANIU (każdym punkcie `[ ]`) wstaw w nowej linii pogrubiony tekst: **[!!! STOP !!! ZATRZYMAJ PRACĘ I CZEKAJ NA ZATWIERDZENIE]**. To zablokuje Cię przed zrobieniem wielu punktów naraz."
3. **🛑 BRAMKA WERYFIKACJI PLANU (Plan Verification Gate)** - **NAJWAŻNIEJSZY MOMENT!**
   Otwórz wygenerowany `plan.md` ręcznie w Cursorze i przeczytaj go w całości. Sprawdź:
   - Czy każde zadanie jest naprawdę 3-minutowe? (Jeśli widzisz: "Zrefaktoryzuj cały moduł X" - **CZERWONA FLAGA!** Każ rozbić.)
   - Czy między każdym `[ ]` jest blokada `[!!! STOP !!!...]`?
   - Czy plan zaczyna się od **NAPRAW (z RAPORT_BLEDOW)**, a dopiero potem dodaje **NOWE FUNKCJE**? (Najpierw stabilizujemy, potem rozbudowujemy!)
   - Czy nie ma punktów typu "deploy na produkcję"? Jeśli tak - **wytnij to ręcznie**.
   
   Jeśli widzisz problemy, **EDYTUJ PLIK SAM** lub powiedz Agentowi:
   > "Zatrzymaj się. Plan jest za ogólny. Rozbij Fazę 2 na 5x mniejszych podzadań. Po każdym wstaw STOP."
4. **Zrób zapis (Commit) DOPIERO PO AKCEPTACJI:** `git add . && git commit -m "Mamy plan naprawy"`

---

## 👷 ETAP 6: Przełączenie Agenta w Budowniczego [MODEL: 🟡 CLAUDE SONNET]

Agent przestaje być tylko detektywem. Teraz pozwalamy mu dotykać kodu, ale pilnujemy go na każdym kroku (Człowiek w Pętli - HITL).

1. **Zmień zasady gry (Ważne!):**
   Otwórz plik `agents.md`, wykasuj z niego cały tekst "Tylko do odczytu" i wklej tam Konstytucję Budowniczego (np. tę z pliku *PROJEKT OD ZERA*, nakazującą używanie TDD, czysty kod, zakaz słów TODO, itd.).
2. **Wpisz komendę do rozpoczęcia pracy:**
   ```bash
   /superpowers:execute-plan
   ```
3. **Wklej ten gotowy Prompt (Twardy Zakaz Samowolki!):**
   > "Zmieniłem Ci zasady w `agents.md`. Od teraz możesz edytować kod. Przeczytaj `plan.md`. Twoim zadaniem jest wykonanie **TYLKO I WYŁĄCZNIE pierwszego punktu**. Pod groźbą przerwania sesji masz ZAKAZ wykonywania kolejnych punktów bez mojego pozwolenia. Po odhaczeniu pierwszego punktu symbolem `[x]`, ZATRZYMAJ SIĘ, opisz mi co zmieniłeś i czekaj na moją weryfikację."
4. **Ty sprawdzasz:** Klikasz w plik, patrzysz co agent zmienił. (Zatwierdzasz jego zmianę wpisując `y`, jeśli wyskoczy prompt autoryzacyjny).
5. **Jeśli naprawa zadziałała i nic się nie popsuło:** 
   W zwykłym terminalu wpisujesz: `git add . && git commit -m "Naprawiono punkt 1.1"`
6. **Mówisz agentowi w Claude Code:**
   > "Zatwierdzam. Wykonaj kolejny punkt z Fazy 1 i znowu się zatrzymaj."

### 🪨 Walka z "Inteligentnym Nieposłuszeństwem"
Czasem Agent powie Ci: *"Done with High priority. Note: Splitting main.py was deemed too risky for the current sprint."* (Skończyłem z wysokim priorytetem. Uznałem, że dzielenie pliku to zbyt ryzykowne.) **NIE GODŹ SIĘ NA TO!**

Twoje twarde polecenie:
> "To dobrze, ale naprawdę chcę uporządkować ten monolityczny moduł. Zrób to teraz, potem przetestuj ponownie. Zrefaktoryzuj `main.py` i rozłóż kod na moduły. Sprawdź i przetestuj wszystko. **You are not the architect - I am. Do as planned.**"

(Agent czasem ma rację i odmowa jest sygnałem - akceptuj odmowę tylko, gdy wykrył nowy bug lub gdy jego argument jest udowodniony testem!)

### 🐀 Uważaj na "Ralph Loops" (Pętle Frustracji)
Gdy zostawiasz agenta na 10 minut i widzisz, że ciągle edytuje ten sam plik, test ciągle pada, on edytuje gorzej, kasuje pół pliku i znów próbuje — to jest **Ralph Wiggum loop** (od postaci Ralpha z Simpsonów: *"I'm helping!"*, jednocześnie niszczy).

**Co robić?** PRZERWIJ go natychmiast (`Ctrl+C`):
1. Zrób `git reset --hard punkt-kontrolny` (wracasz do bezpiecznego stanu).
2. Wpisz `/clear` (resetujesz mu pamięć).
3. Zacznij od nowa, dając mu BARDZIEJ KONKRETNĄ instrukcję (np. nie "napraw test", tylko "test sprawdza X, kod ma robić Y, błąd wskazuje Z – napraw konkretnie tę linię").

### 🐛 Workflow `debug.md` (Gdy pojawi się błąd)
Gdy podczas wykonywania planu wystąpi błąd, ZAKAZ łatania na ślepo. Zamiast tego:
1. Powiedz Agentowi: *"Zatrzymaj się. Stwórz plik `docs/debug.md`. Wklej tam pełny stack trace, opisz hipotezę przyczyny źródłowej (Root Cause) oraz proponowaną naprawę. NIE MODYFIKUJ KODU."*
2. Przeczytaj `debug.md`. Czy hipoteza ma sens? Jeśli tak, akceptuj. Jeśli nie, odeślij do agenta z komentarzem.
3. Dopiero po akceptacji hipotezy: *"Hipoteza zatwierdzona. Wykonaj naprawę dokładnie według `debug.md` i uruchom testy."*

---

## 🛡️ ETAP 7: Strażnik Bramy (Hook) [MODEL: ❌ BRAK AI (skrypt)]

Aby uniemożliwić agentowi "zamknięcie" zadania, gdy testy padają, dodaj Hook:

1. **Stwórz folder `.claude/hooks/`** i wewnątrz plik `readonly_guardian.sh`:
   ```bash
   #!/bin/bash
   set -e
   echo "[HOOK] Sprawdzam czy testy przechodza..."
   uv run pytest tests/ -q || { echo "[FAIL] Testy padly!"; exit 1; }
   uv run ruff check src/ || { echo "[FAIL] Lintery!"; exit 1; }
   echo "[OK] Możesz zamykać"
   exit 0
   ```
2. **Plik `.claude/settings.json`:**
   ```json
   {
     "hooks": {
       "stop": [{"type": "command", "command": "bash .claude/hooks/readonly_guardian.sh"}]
     }
   }
   ```
**Działanie:** Gdy agent ogłosi "skończyłem", system automatycznie odpala testy. Jeśli pada - agent musi naprawić, zanim zakończy.

---

## 🏁 ETAP 8: Profesjonalna finalizacja (PR) [MODEL: 🟡 CLAUDE SONNET]

Gdy wszystkie błędy z raportu są naprawione, finalizuj projekt komendą Superpowers:
```bash
/superpowers:finishing
```
Generuje opisowy Pull Request gotowy do scalenia.

> **Złota Zasada Eda (HITL Final):** Przed kliknięciem "Merge" w GitHubie - **przejrzyj diff własnym wzrokiem**. Klikasz Merge = bierzesz odpowiedzialność za prod!

---

### 🧽 Złoty Nawyk (Czyszczenie pamięci i "Smart Zone")
Gdy wspólnie naprawicie wszystkie błędy z danej Fazy:
1. Zapisz wszystko w terminalu: `git add . && git commit -m "Faza 1 zakonczona sukcesem"`
2. W Claude Code wpisz komendę czyszczenia pamięci:
   ```bash
   /clear
   ```
3. Po odświeżeniu napisz mu krótko: *"Przeczytaj `plan.md` i `agents.md`. Zacznij wykonywać pierwszy punkt z Fazy 2 i zatrzymaj się po nim."*

> **🧠 Dlaczego to kluczowe przy Refaktoryzacji? (Olaf Sulich / Vercel)**
> Modele AI cierpią na zjawisko **"Lost in the Middle"** (zapominają instrukcje w połowie długiej rozmowy) i wchodzą w tzw. **"Dumb Zone"**. Jeśli będziesz naprawiać 20 błędów w jednym długim oknie czatu, Agent z każdym kolejnym krokiem będzie pisał gorszy kod ("AI Slop"). Resetując czat (`/clear`), utrzymujesz go w tzw. **"Smart Zone"**. Jeden moduł do naprawy = jedno krótkie okno kontekstowe!
>
> **⚠️ Kompresję rób SAM, nie ufaj automatom!** Cursor i inne edytory oferują automatyczne "kompresowanie" kontekstu. **Nie polegaj na tym!** Przed `/clear` każ agentowi świadomie podsumować wnioski do pliku Markdown (np. `docs/wnioski_faza1.md`). W nowym oknie dołącz TYLKO ten skompresowany plik. Ręczna kompresja gwarantuje, że do nowej sesji trafi to, co naprawdę ważne, a nie losowy skrót zrobiony przez automat.

### 🆘 Awaria sesji? Komenda `/resume` ratuje życie
Jeśli Claude Code padnie, komputer się zrestartuje, lub zamkniesz przypadkiem terminal - **NIE PANIKUJ!**. Po ponownym uruchomieniu Claude'a wpisz:
```bash
/resume
```
To wczyta historię ostatniej sesji **bez utraty kontekstu** (Agent przypomni sobie, na czym skończyliście). Działa to magicznie szczególnie przy długich audytach.

Dzięki takiemu podejściu, naprawisz stary kod bez obawy, że sztuczna inteligencja wykasuje Ci całą aplikację w pięć minut!

---

## 🎓 Poziom Senior Enterprise: Gdzie w tym wszystkim są zaawansowane narzędzia?

Możesz się zastanawiać: *"A gdzie w tym prostym procesie są narzędzia Seniora, o których uczył Ed: Skills, Plugins, MCP i Sub-Agenty?"*

Zastosowany tutaj workflow opiera się na nich w najbezpieczniejszy możliwy sposób:

1. **Sub-Agenty (Izolacja):** 
   Kiedy używasz `/superpowers:execute-plan`, nie dajesz jednemu wielkiemu agentowi zadania "zmień cały projekt". Superpowers pod spodem wywołuje krótkotrwałe **Sub-Agenty**, które naprawiają po jednym problemie z raportu i zamykają się. Ty odbierasz tylko ich wyniki!
   
   > **⚠️ Antywzorzec Złych Ról (Olaf Sulich):** Gdy zaczniesz tworzyć własne Sub-Agenty, **NIGDY** nie dawaj im korporacyjnych "ról" (np. "Jesteś Backend Developerem"). To sztucznie upośledza Agenta, zawężając mu kontekst. Dawaj im precyzyjne **zadania** (np. "Przeanalizuj bezpieczeństwo modułu auth" albo "Napisz testy integracyjne dla endpointu płatności").

2. **Skills (Własne Narzędzia):**
   Jeśli stary projekt wymaga ciągłego uruchamiania bardzo specyficznej, niestandardowej komendy, zrób z niej "Skilla". Jak to zrobić krok po kroku?
   
   1. Wpisz w Claude Code: `/plugin` i zainstaluj wtyczkę `skill-creator`.
   2. Wpisz komendę: `/skill-creator`.
   3. Agent zapyta Cię, co chcesz osiągnąć. Odpowiedz mu prosto: *"Stwórz skill, który zawsze odpala ten stary skrypt testowy: ./run_legacy_tests.sh"*.
   4. Narzędzie samo wygeneruje odpowiedni, perfekcyjnie sformatowany plik `SKILL.md` i umieści go w Twoim projekcie!

   > **UWAGA (Badania Vercel):** Agenty mają problem z proaktywnym czytaniem Skilli z wiedzą. Dlatego zasady kodowania umieszczaj w `agents.md`, a w Skillach zamykaj tylko proste skrypty CLI do wykonywania (np. `uruchom_testy.sh`).

3. **Pluginy (Plugins):**
   Oparcie całego procesu o instalację wtyczki `superpowers` (i ewentualnie `systematic-debugging`) to nic innego, jak skorzystanie z gotowej, potężnej inżynierii (zamiast ręcznie zarządzać promptami w gołym Claude).

4. **MCP (Integracja z zewnętrznym światem):**
   Podłączenie serwera MCP (np. dla **Sentry**, **Datadog**) daje Agentowi-Audytorowi dostęp do logów błędów z produkcji podczas generowania Raportu. Pamiętaj jednak: rozbudowane serwery MCP to ogromny koszt tokenów i obciążenie okna kontekstowego, co wypycha Agenta ze "Smart Zone". Zawsze gdy to możliwe, zastępuj skomplikowane serwery MCP prostymi komendami w terminalu (CLI).

5. **Dlaczego unikamy tu Agent Teams (Rojów)?**
   Wrzucenie takiego "Recenzenta" (Audytora) do jednego wielkiego zespołu Agent Teams to przepis na nieskończone spory. Agent A pisze kod, Agent B (Audytor) twierdzi że to błąd, Agent A poprawia psując logikę biznesową... W profesjonalnym podejściu Recenzent jest IZOLOWANYM Sub-Agentem. Raportuje wyłącznie do Ciebie, generując `RAPORT_BLEDOW.md`. To Ty (Human-in-the-Loop) decydujesz, które poprawki z raportu zlecić później Koderowi w nowej, czystej sesji.

Ten prosty na pozór poradnik wymusza najsurowszy proces z kursu: **Audyt Read-Only + HITL (Człowiek w Pętli) + Sub-Agent Driven Development**. To właśnie odróżnia radosne "Vibe Coding" od profesjonalnego "Vibe Engineeringu".
