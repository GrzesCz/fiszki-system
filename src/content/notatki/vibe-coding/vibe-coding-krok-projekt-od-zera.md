---
title: 'Krok po kroku: Jak zacząć projekt AI od zera (Vibe Coding)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-05-19'
review_count: 0
mindmaps: []
---

# 🚀 Krok po kroku: Jak zacząć projekt AI od totalnego zera (Vibe Coding)

Ten poradnik jest napisany maksymalnie prosto, jak dla początkującego. Prowadzi Cię "za rączkę" przez uruchomienie nowego projektu z pomocą Claude Code, tak żebyś nie zgubił się po drodze i nie wygenerował "kodu-śmieci" (tzw. AI Slop).

---

## 🛠️ ETAP 1: Przygotowanie "Pustej Kartki" [MODEL: ❌ BRAK AI]

Zanim cokolwiek powiesz sztucznej inteligencji, musisz mieć czyste miejsce pracy.

1. **Stwórz nowy, pusty folder** na swoim komputerze (np. na Pulpicie stwórz folder `MojaNowaAplikacja`).
2. **Otwórz ten folder w programie Cursor** (lub innym edytorze kodu).
3. **Zrób tzw. Pierwszy Commit (Zapis):**
   W terminalu w swoim folderze wpisz to po kolei:
   ```bash
   git init
   echo "venv/" > .gitignore
   echo ".env" >> .gitignore
   echo ".claude/local/" >> .gitignore
   git add .
   git commit -m "Zaczynamy nowy projekt"
   ```
   *(To tworzy punkt zapisu. Jak agent coś popsuje, będziesz mógł łatwo wrócić do pustego folderu).*
4. **Zainicjuj środowisko Python (uv):**
   Ed bardzo nalega na używanie `uv` (najszybszy menedżer Pythona). W terminalu wpisz:
   ```bash
   uv init
   uv venv
   ```
   To stworzy plik `pyproject.toml` (Twój manifest projektu) oraz folder `.venv/` (środowisko).

5. **Docelowa struktura katalogów profesjonalnego projektu:**
   Zanim zaczniesz, rzuć okiem, jak Twój projekt będzie wyglądał docelowo. **Nie musisz teraz tworzyć tych folderów ręcznie!** Większość z nich (jak `/src`, `/tests` czy `/docs`) utworzy sam Agent w kolejnych etapach, wykonując Twoje polecenia. To jest po prostu ściągawka dla Ciebie, żebyś wiedział, gdzie czego szukać:
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

## 🤖 ETAP 2: Przywołanie Claude'a i jego Mocy [MODEL: 🟡 CLAUDE SONNET]

Teraz zapraszamy Claude'a do pracy i dajemy mu najlepsze narzędzia.

1. **Uruchom Claude Code** w terminalu, wpisując po prostu: `claude` i wciskając Enter.
2. **Zainstaluj wtyczkę Superpowers (Supermoce):**
   Wpisz w Claude'a:
   ```bash
   /plugin
   ```
   Wybierz z menu `Discover`, znajdź na liście `superpowers` i naciśnij literę `i` (żeby zainstalować). 
3. **Zainstaluj `systematic-debugging` (Skill do walki z bugami):**
   To kolejna potężna paczka od Eda. W tym samym menu `/plugin` znajdź `systematic-debugging` i naciśnij `i`. Jak to zadziała? Gdy w przyszłości napotkacie z agentem trudny błąd, wystarczy wpisać `użyj skilla systematic-debugging` i Agent przeprowadzi systematyczną diagnozę krok po kroku, zamiast strzelać na ślepo.
4. **Przeładuj Claude'a:**
   Gdy wszystko się zainstaluje, wpisz:
   ```bash
   /reload-plugins
   ```
5. **Wyłącz samowolkę (Bardzo ważne!):**
   Aby zapobiec temu, że Agent napisze cały kod sam bez Twojej zgody (YOLO Mode), wpisz komendę, która wymusi na nim pytanie Cię o zgodę przed każdą akcją zapisu pliku:
   ```bash
   /config set requireApproval true
   ```

> **🚨 Ostrzeżenie Eda przed "Approval Fatigue" (Zmęczeniem klikania)**
> Po włączeniu `requireApproval=true` Agent będzie Cię pytał `y/n` praktycznie przed każdą operacją. **NIE WPADAJ w pułapkę klikania `y` na ślepo!** To jest dokładnie ten sam efekt psychologiczny, jak akceptowanie regulaminów w internecie. **Każdy prompt CZYTAJ.** Jeśli widzisz, że Agent chce zmodyfikować 5 plików naraz - **odmów (wpisz `n`) i każ mu zrobić tylko jeden!** Klikanie `y` bez czytania to powrót do YOLO Mode tylnymi drzwiami.

---

## 🧠 ETAP 3: Burza mózgów (Brainstorming) [MODEL: 🔴 CLAUDE OPUS]

**NIE POZWALAMY AGENTOWI PISAĆ KODU!** Najpierw musi wymyślić, co w ogóle budujemy.

> **💰 Optymalizacja kosztów (Krok 1 z 2): Przełącz na Drogiego Myśliciela**
> Do planowania i układania architektury potrzebujesz najwyższego IQ. Przed wpisaniem komendy przełącz model wpisując w Claude Code: `/model claude-3-opus-20240229` (lub wybierz Opus z paska na dole). Będzie drożej, ale tylko na chwilę (a jakość planu jest kluczowa dla całego projektu)!

1. **Wpisz komendę burzy mózgów:**
   ```bash
   /superpowers:brainstorm
   ```
2. **Wklej ten gotowy Prompt (uzupełniając swoje dane):**
   > "Opiszę Ci moją aplikację. Chcę zbudować [TUTAJ WPISZ CO BUDUJESZ, np. sklep internetowy, aplikację do nawyków]. Główne funkcje to: 
   > 1. [FUNKCJA 1]
   > 2. [FUNKCJA 2]. 
   > Przeanalizuj to i zadaj mi po kolei tyle pytań, ile potrzebujesz, żeby w pełni zrozumieć mój cel. Zadawaj pytania tak długo, aż będziesz gotowy stworzyć plik z Architekturą. Potem wygeneruj plik `docs/BRAINSTORM.md` z zebranymi ustaleniami."
3. **Rozmawiaj z nim:** Agent będzie Ci zadawał pytania. Odpowiadaj. Nie denerwuj się, że to trwa. Kiedy agent uzna, że wie wszystko, utworzy Ci plik `BRAINSTORM.md`.
4. **Zrób zapis (Commit):**
   W drugim terminalu wpisz: `git add . && git commit -m "Zrobiona burza mózgów"`

---

## 📜 ETAP 4: Pisanie Konstytucji (agents.md) [MODEL: ❌ BRAK AI (piszemy sami)]

Zanim ruszymy do pracy, musisz dać agentowi zasady gry. Ten plik piszesz **TY**, a nie agent!

1. Stwórz samemu nowy plik o nazwie `agents.md` w głównym folderze projektu.
2. Skopiuj i wklej do niego ten tekst (możesz zmienić nazwy technologii na te, które wolisz):

```markdown
# Konstytucja Agenta: Główny Programista

Jesteś surowym ekspertem. Pracujesz rzetelnie i nigdy nie omijasz procedur.

## End Goal (Opis Projektu)
Budujemy [WPISZ CEL, np. wydajne, bezpieczne API]. Sukcesem jest system z pokryciem testami na poziomie 100% krytycznych ścieżek, gotowy do wdrożenia.

## Starting Point (Punkt Startowy)
Zaczynamy od zera. Mamy pusty projekt i zainicjowane środowisko. (Uwaga: zawsze aktualizuj ten punkt, jeśli robisz twardy restart projektu do nowej fazy).

## Ograniczenia MVP
- [WPISZ OGRANICZENIA, np. Będzie istniało tylko logowanie dla pojedynczego użytkownika.]
- [np. Aplikacja w wersji MVP uruchamiana jest tylko lokalnie.]

## 1. Narzędzia, Technologie i Struktura
- Budujemy projekt w [WPISZ JĘZYK, np. Python].
- Zawsze używaj [WPISZ NARZĘDZIA, np. uv, FastAPI, Pydantic].
- **Bezwzględnie przestrzegaj struktury katalogów:** kod biznesowy ZAWSZE ląduje w `/src`, testy w `/tests`, a dokumentacja w `/docs`. Nie twórz plików z kodem luzem w głównym katalogu!

## 2. Anti-Slop (Wysoka jakość kodu)
- Zawsze pisz od razu gotowy kod. 
- ZAKAZ używania słów "TODO", "TBD" (czyli "do zrobienia później"). Kod ma działać od razu.
- ZAKAZ używania emotikonek (emoji) w plikach i logach.

## 3. Zawsze Testuj (TDD: RED-GREEN-REFACTOR)
- Zanim napiszesz linijkę kodu aplikacji, NAJPIERW napisz test, który ZAWODZI (RED). To dowód, że test naprawdę sprawdza coś sensownego.
- Dopiero potem napisz minimalny kod, by test przeszedł (GREEN).
- Na końcu uporządkuj kod (REFACTOR), upewniając się, że test wciąż przechodzi.
- Jeśli napiszesz kod bez testu albo test od razu jest GREEN bez fazy RED — zostaniesz zwolniony.

## 4. Rozwiązywanie problemów (Root Cause + debug.md)
- Jeśli wywali błąd, NIE ZGADUJ i NIE łataj na ślepo.
- Najpierw zbierz dowody: pełen stack trace, logi, dokładne polecenie reprodukcji.
- Następnie utwórz plik `docs/debug.md` z hipotezą (jaka jest przyczyna źródłowa, dlaczego sądzisz że to ona).
- Czekaj na akceptację hipotezy przez użytkownika ZANIM napiszesz jakąkolwiek poprawkę.

## 5. Grounding (Trzymanie się faktów)
- Bazuj WYŁĄCZNIE na dokumentacji projektu. ZAKAZ halucynacji i dopowiadania założeń biznesowych. 
- Jeśli jakiegoś szczegółu nie ma w specyfikacji – zawsze zapytaj użytkownika. Nie zmyślaj.

## 6. Zakres zmian (Touch only what you asked to touch)
- Zmieniaj TYLKO pliki i funkcje, o które zostałeś poproszony w bieżącym zadaniu.
- ZAKAZ refaktoryzowania sąsiedniego kodu "przy okazji", poprawiania stylu innych funkcji, usuwania cudzych komentarzy czy zmieniania API bez wyraźnej zgody.
- Jeśli widzisz problem poza zakresem zadania — zapisz go jako sugestię (np. w `docs/sugestie.md`), ale NIE dotykaj kodu.

## 7. Pięć Nie-negocjowalnych Zasad
1. Ujawnij założenia zanim zaczniesz pisać kod.
2. Zatrzymaj się i zapytaj, gdy wymagania się wykluczają (nigdy nie zgaduj).
3. Sprzeciw się, gdy jest powód (np. proszę Cię o wdrożenie dziurawego rozwiązania).
4. Preferuj nudne, oczywiste rozwiązanie.
5. Dotykaj tylko tego, o co zostałeś poproszony.

## 8. Tabela Antywymówek (Anti-rationalization)
Poniższe wymówki są ZAKAZANE. Nie wolno Ci ich używać jako uzasadnienia do pominięcia procedury:
- "To za mała zmiana na testy." → NIEPRAWDA. Kod bez testu = kod odrzucony.
- "Testy dopiszę później." → NIE MA później. Najpierw test (RED), potem kod (GREEN).
- "Kod działa, więc można kończyć." → Działający kod to nie dowód. Pokaż wynik testu lub log.
- "Nie potrzebuję specyfikacji." → 5 linijek specyfikacji wystarczy. Zero nie wystarczy.
- "To oczywista zmiana, nie wymaga review." → Każda zmiana wymaga weryfikacji użytkownika.

## 9. Płot Chestertona i Reguła Beyonce
- **Chesterton's Fence:** NIE WOLNO Ci usunąć żadnej linii kodu, dopóki w 100% nie zrozumiesz i nie wytłumaczysz, dlaczego ten kod się tam w ogóle znalazł.
- **Beyonce Rule:** "If you liked it, you should have put a test on it." Kod bez testu to kod, na którym nam nie zależy. Infrastruktura nie chroni przed bugami — chronią testy.

## 10. Dokumentacja Robocza (Progressive Disclosure)
- Wszystkie pliki z ustaleniami są w folderze `docs/`.
- Twoim głównym plikiem nawigacyjnym jest `@plan.md`.
- Odczytuj inne pliki z folderu `docs/` TYLKO wtedy, gdy są bezwzględnie wymagane do wykonania bieżącego zadania (oszczędzaj kontekst!).
```

> *Sekcje 6-9 oparte na publikacjach Addy'ego Osmani'ego (inżynier Google): [Agent Skills](https://addyosmani.com/blog/agent-skills/)*

> **💡 Rekomendacja Eda (Inżynieria Kontekstu Progresywnego):** Główny `agents.md` siedzi w katalogu głównym projektu, ale wraz z rozwojem aplikacji możesz tworzyć lokalne pliki zasad. Np. w podkatalogu `/src/api` możesz umieścić specyficzny plik z zasadami pisania endpointów FastAPI, do którego agent musi zajrzeć TYLKO pracując w tym obszarze. Oszczędza to tokeny i zapobiega "Context Rot" (zapychaniu pamięci agenta).

> **🚨 Antywzorzec "bad-CLAUDE.md" (Olaf Sulich):** Gdy Twój projekt rośnie, kuszące jest dopisywanie do `agents.md` kolejnych zasad (np. jak formatować Tailwind, jak obsługiwać wyjątki, szczegóły bazy danych itd.). **NIE RÓB TEGO!** Gigantyczny `agents.md` (np. 200 linii) wypycha Agenta w "Dumb Zone" od samego startu sesji — bo ten plik jest ładowany PRZY KAŻDYM zadaniu. Rozwiązanie: trzymaj `agents.md` **zwięzły** (szablon powyżej to dobry rozmiar). Szczegółowe zasady wyciągaj do oddzielnych plików (np. `docs/db_rules.md`, `docs/api_rules.md`) i w Konstytucji dodaj tylko odnośnik: `"Jeśli edytujesz bazę, najpierw przeczytaj docs/db_rules.md"`. Agent załaduje je tylko gdy będzie potrzebował!

---

## 📅 ETAP 5: Rozpisanie Planu gry (plan.md) [MODEL: 🔴 CLAUDE OPUS]

Teraz agent na podstawie burzy mózgów musi ułożyć konkretną listę zadań.

1. **Wpisz komendę ułożenia planu w Claude Code:**
   ```bash
   /superpowers:write-plan
   ```
2. **Wklej ten gotowy Prompt:**
   > "Przeczytaj plik z naszymi ustaleniami `docs/BRAINSTORM.md` oraz przeczytaj moje zasady w `agents.md`. Następnie stwórz plik `plan.md` w głównym katalogu. 
   > 
   > W pliku `plan.md` rozpisz całą pracę na FAZY. Każda faza ma mieć małe punkty do odhaczenia typu `[ ]`. Zadania mają być na tyle małe, żeby dało się je zrobić w 3 minuty. 
   > **KRYTYCZNE (Zabezpieczenie YOLO):** Po KAŻDYM JEDNYM ZADANIU (każdym punkcie `[ ]`) wstaw w nowej linii pogrubiony tekst: **[!!! STOP !!! ZATRZYMAJ PRACĘ I CZEKAJ NA ZATWIERDZENIE]**. To zablokuje Cię przed zrobieniem wielu punktów naraz."
3. **🛑 BRAMKA WERYFIKACJI PLANU (Plan Verification Gate)** - **TO JEST NAJWAŻNIEJSZY MOMENT CAŁEGO PROCESU!**
   Otwórz wygenerowany `plan.md` ręcznie w Cursorze i **przeczytaj go w całości linijka po linijce**. Sprawdź:
   - Czy każde zadanie jest naprawdę 3-minutowe? (Jeśli widzisz: "Faza 1.1: Zaimplementuj cały moduł autentykacji" - **TO JEST CZERWONA FLAGA!** Każ agentowi rozbić to na mniejsze kawałki).
   - Czy między każdym punktem `[ ]` jest blokada `[!!! STOP !!!...]`?
   - Czy plan nie zakłada za dużo (np. "Faza 5: Deploy na produkcję") - jeśli tak, **wytnij to ręcznie!**
   - Czy kolejność faz ma sens (np. Modele danych -> Logika -> API -> Testy E2E)?
   
   Jeśli widzisz problemy, **EDYTUJ PLIK SAM** lub powiedz Agentowi:
   > "Zatrzymaj się. Plan jest za ogólny. Rozbij Fazę 2 na 5x mniejszych podzadań. Po każdym wstaw STOP."
4. **Zrób zapis (Commit) DOPIERO PO AKCEPTACJI:**
   W drugim terminalu wpisz: `git add . && git commit -m "Mamy plan i konstytucje"`

---

## 👷 ETAP 6: Wykonywanie kodu! (Akcja) [MODEL: 🟡 CLAUDE SONNET]

Teraz dzieje się magia, ale Ty jesteś Kierownikiem Budowy (Kluczowa zasada: Człowiek w Pętli - HITL).

> **💰 Optymalizacja kosztów (Krok 2 z 2): Przełącz na Taniego Mechanika**
> Wykonywanie powtarzalnych, malutkich zadań z planu (test -> kod -> test) to praca w dużej mierze mechaniczna. Wpisz w Claude Code `/model claude-3-5-sonnet-20241022` (lub wybierz Sonnet z paska), zanim zaczniesz. Sonnet radzi sobie z tym świetnie, a Ty oszczędzisz ~70% kosztów na setkach iteracji!

1. **Wpisz komendę do rozpoczęcia pracy:**
   ```bash
   /superpowers:execute-plan
   ```
2. **Wklej ten gotowy Prompt (Twardy Zakaz Samowolki!):**
   > "Przeczytaj `plan.md`. Twoim zadaniem jest wykonanie **TYLKO I WYŁĄCZNIE pierwszego punktu** z Fazy 1. Pod groźbą przerwania sesji masz ZAKAZ wykonywania kolejnych punktów bez mojego pozwolenia. Po odhaczeniu pierwszego punktu symbolem `[x]`, ZATRZYMAJ SIĘ, opisz mi co napisałeś i czekaj na moją weryfikację."
3. Agent napisze trochę kodu (np. test i funkcję) i się zatrzyma (albo poprosi Cię o zgodę na zapis pliku - wtedy wpisujesz `y`).
4. **Ty sprawdzasz:** Klikasz w pliki, patrzysz czy kod wygląda dobrze, czy testy przechodzą.
5. **Jeśli jest OK (Ważne):** W zwykłym terminalu zapisujesz postęp: `git add . && git commit -m "Zrobiony punkt 1.1"`
6. **Mówisz agentowi w Claude Code:**
   > "Zatwierdzam. Wykonaj kolejny punkt z Fazy 1 i znowu się zatrzymaj."

**Pamiętaj: Krok, Sprawdzenie, Git Commit, Kolejny krok. W ten sposób zbudujesz profesjonalną aplikację, bez błędów i zgubienia się po drodze!**

### 🚨 Walka z halucynacjami (Agent zmyśla biblioteki!)
Modele AI **notorycznie zmyślają nazwy bibliotek i funkcji**, których nie ma! Klasyczny przykład: każe Ci dodać `from fastapi.cache import RedisCache`, podczas gdy taka klasa nie istnieje (zmyślił ją na podstawie wzorca innych bibliotek).

**Twój workflow weryfikacji:**
1. Po wygenerowaniu kodu zerknij na importy.
2. Każdą nieznaną klasę/funkcję sprawdź w oficjalnej dokumentacji (np. `pip show fastapi` + `python -c "from fastapi.cache import RedisCache"`).
3. Jeśli test nie istnieje, powiedz Agentowi:
   > *"Funkcja `RedisCache` nie istnieje w bibliotece FastAPI. Sprawdź dokumentację (np. przez Context7/MCP) i użyj prawdziwego API. Nie zmyślaj!"*

### 🪨 Walka z "Inteligentnym Nieposłuszeństwem"
Czasem agent oświadczy: *"Done with Phase 1. Note: Implementing the cache layer was deemed too complex for the MVP."* (Skończyłem z Fazą 1. Uznałem, że warstwa cache jest zbyt złożona na MVP.) **NIE GODŹ SIĘ NA TO!**

Twoje twarde polecenie:
> *"Implementacja warstwy cache jest w planie. Zrób to teraz, napisz test który ją sprawdza i potem ją zaimplementuj. **You are not the architect — I am. Do as planned.**"*

(Wyjątek: jeśli agent przedstawi twardy dowód testem, że zadanie wprowadzi regresję — można odmowę zaakceptować.)

### 🐀 Uważaj na "Ralph Loops" (Pętle Frustracji)
Gdy zostawiasz agenta na 10 minut i widzisz, że ciągle edytuje ten sam plik, test ciągle pada, on edytuje gorzej, kasuje pół pliku i znów próbuje — to jest **Ralph Wiggum loop** (od postaci Ralpha z Simpsonów: *"I'm helping!"*, jednocześnie niszczy).

**Co robić?** PRZERWIJ go natychmiast (`Ctrl+C`):
1. Zrób `git reset --hard HEAD` (wracasz do ostatniego commit'u).
2. Wpisz `/clear` (resetujesz mu pamięć).
3. Zacznij od nowa, dając mu BARDZIEJ KONKRETNĄ instrukcję (np. nie "napraw test", tylko "test sprawdza X, kod ma robić Y, błąd wskazuje Z – napraw konkretnie tę linię").

---

## 🛡️ ETAP 7: Strażnik Bramy (Hook) [MODEL: ❌ BRAK AI (skrypt)]

To najlepsza tarcza przed *AI Slop*. Hook to brutalny skrypt, który uruchamia się **automatycznie**, gdy Agent powie "skończyłem", i sprawdza, czy faktycznie wszystko jest w porządku.

1. **Stwórz folder `.claude/hooks/` w swoim projekcie** (jeśli go nie ma).
2. **Wewnątrz utwórz plik `quality_gate.sh`** i wklej tam:
   ```bash
   #!/bin/bash
   set -e
   echo "[HOOK] Sprawdzam jakość kodu..."
   uv run ruff check src/ || { echo "[FAIL] Błędy formatowania!"; exit 1; }
   uv run mypy src/ --strict || { echo "[FAIL] Błędy typów!"; exit 1; }
   uv run pytest tests/ -q || { echo "[FAIL] Testy padły!"; exit 1; }
   if grep -rn "TODO\|TBD" src/ --include="*.py"; then
     echo "[FAIL] Wykryto TODO w kodzie!"; exit 1;
   fi
   echo "[OK] Wszystko zielone."
   exit 0
   ```
3. **Stwórz plik `.claude/settings.json`** i wklej:
   ```json
   {
     "hooks": {
       "stop": [
         {"type": "command", "command": "bash .claude/hooks/quality_gate.sh"}
       ]
     }
   }
   ```
**Co to zmienia?** Od teraz, gdy Agent powie "skończyłem zadanie", system automatycznie uruchomi testy. Jeśli coś jest źle, **Agent nie może zakończyć pracy** i musi naprawić błąd. Ty się tym nie martwisz!

---

## 🤝 ETAP 8: Cross-Model Review (Drugi mózg) [MODEL: 🟣 INNE AI (GPT/Codex)]

Po skończonej Fazie warto, by **zupełnie inny model AI (np. GPT od OpenAI)** sprawdził pracę Claude'a. Każdy model uczy się na innych danych i wyłapuje inne błędy!

1. **Wymóg:** Zainstaluj `codex-cli` od OpenAI (jeśli masz konto):
   ```bash
   npm install -g openai/codex-cli
   ```
2. Po skończonej Fazie 1, wpisz w Claude Code:
   > "Wywołaj w Bashu: `codex exec 'Przeczytaj kod w katalogu src/, jaki napisał Claude. Wskaż błędy logiczne, wycieki pamięci i podatności bezpieczeństwa. Zapisz raport w docs/cross_review.md. NIE MODYFIKUJ KODU.'`"
3. Otwórz `docs/cross_review.md` i przeczytaj to, co znalazł GPT. Często znajdzie rzeczy, których Claude przeoczył!

---

## 🏁 ETAP 9: Profesjonalna finalizacja (Pull Request) [MODEL: 🟡 CLAUDE SONNET]

Gdy wszystkie Fazy są ukończone, używasz dedykowanej komendy do zamknięcia projektu:
```bash
/superpowers:finishing
```
Superpowers samo:
- Sprawdzi, czy wszystkie checkboxy w `plan.md` są odhaczone.
- Uruchomi cały zestaw testów i linterów.
- Wygeneruje opisowy Pull Request z podsumowaniem prac.

> **Złota Zasada Eda (HITL Final):** Przed kliknięciem "Merge" w GitHubie - **przeczytaj diff własnym wzrokiem!** Klikasz Merge = bierzesz odpowiedzialność. Twoje imię będzie pod tym kodem.

---

### 🧽 Złoty Nawyk (Czyszczenie pamięci i "Smart Zone")
Gdy skończycie wspólnie całą jedną wielką **FAZĘ** (np. wszystkie 5 punktów Fazy 1), powiedz agentowi:
> "Podsumuj decyzje architektoniczne do pliku, żebyś ich nie zapomniał."

Następnie wpisz komendę:
```bash
/clear
```
To "wyczyści mu głowę" ze śmieci ze starej rozmowy. Będzie mu się lżej i taniej pracowało nad FAZĄ 2! (Tylko przypomnij mu po restarcie: *"Przeczytaj `plan.md` i `agents.md` i zacznij Fazę 2"*).

> **🧠 Dlaczego to takie ważne? (Olaf Sulich / Vercel)**
> Modele AI cierpią na zjawisko **"Lost in the Middle"** (gubią ważne instrukcje, gdy rozmowa robi się za długa) i wchodzą w tzw. **"Dumb Zone"** (zaczynają zmyślać i pisać słaby kod). Trzymając krótką rozmowę, w której Agent ma jeden jasny cel z `plan.md`, utrzymujesz go w tzw. **"Smart Zone"**. Jeden cel = jedno okno kontekstowe!
>
> **⚠️ Kompresję rób SAM, nie ufaj automatom!** Cursor i inne edytory oferują automatyczne "kompresowanie" kontekstu. **Nie polegaj na tym!** Zawsze każ agentowi świadomie podsumować wnioski do pliku Markdown (np. `docs/wnioski_faza1.md`), a potem zrób `/clear` i w nowym oknie dołącz TYLKO ten plik. Ręczna kompresja gwarantuje, że do nowej sesji trafi to, co naprawdę ważne, a nie losowy skrót zrobiony przez automat.

### 🆘 Awaria sesji? Komenda `/resume` ratuje życie
Jeśli Claude Code padnie, komputer się zrestartuje, lub zamkniesz przypadkiem terminal - **NIE PANIKUJ!**. Po ponownym uruchomieniu Claude'a wpisz:
```bash
/resume
```
To wczyta historię ostatniej sesji **bez utraty kontekstu** (Agent przypomni sobie, na czym skończyliście). Działa to magicznie szczególnie przy długich projektach.

---

## 🎓 Poziom Senior Enterprise: Gdzie w tym wszystkim są zaawansowane narzędzia?

Możesz się zastanawiać: *"A gdzie podziały się te wszystkie zaawansowane rzeczy z kursu Eda: Skills, Plugins, MCP i Multi-Agenty?"*

Odpowiedź brzmi: **One cały czas tam są i działają pod spodem!** Ten prosty poradnik to tzw. "Złoty Środek" (najbezpieczniejsza droga), który w naturalny sposób z nich korzysta:

1. **Sub-Agenty (Multi-Agents):** 
   Kiedy wpisujesz komendę `/superpowers:execute-plan`, to framework **Superpowers w tle tworzy osobnego Sub-Agenta** dla każdego małego kroku z `plan.md`. Ten mały agent budzi się, wykonuje swoje 3-minutowe zadanie (np. pisze test) i umiera, a Główny Agent (z którym piszesz) sprawdza jego pracę. To jest właśnie potęga orkiestracji!
   
   > **⚠️ Antywzorzec Złych Ról (Olaf Sulich):** Gdy zaczniesz tworzyć własne Sub-Agenty, **NIGDY** nie dawaj im korporacyjnych "ról" (np. "Jesteś Frontend Developerem"). To sztucznie upośledza Agenta, zawężając jego myślenie. Zamiast tego dawaj im precyzyjne **zadania** (np. "Przeprowadź analizę bezpieczeństwa endpointów API" albo "Napisz testy Cypress dla formularza rejestracji").

2. **Pluginy (Plugins):**
   Użycie komendy `/plugin` i zainstalowanie `superpowers` to właśnie wykorzystanie potężnej, gotowej paczki narzędzi, która zarządza całym Twoim cyklem pracy.

3. **Skills (Własne umiejętności):**
   Gdy widzisz, że ciągle wykonujesz tę samą rutynową czynność w terminalu (np. odpalasz specyficzny skrypt), zrób z tego "Skilla". Jak to zrobić najprościej?
   
   1. Najpierw wpisz w Claude Code: `/plugin` i zainstaluj wtyczkę `skill-creator` (wciskając literę 'i').
   2. Następnie wpisz komendę: `/skill-creator`.
   3. Agent zapyta: *"Co ma robić ten skill?"*. Odpowiedz mu normalnie po polsku, np.: *"Chcę, żeby ten skill uruchamiał komendę 'pytest' i zapisywał wynik do pliku raport.txt"*.
   4. Narzędzie samo wygeneruje, idealnie sformatuje i zapisze dla Ciebie gotowy plik `SKILL.md` w odpowiednim folderze!

   > **UWAGA (Badania Vercel):** Agenty mają "problem z aktywacją" Skilli, w których jest tylko sucha wiedza. Dlatego reguły kodowania umieszczaj w `agents.md`, a Skille twórz **wyłącznie do uruchamiania konkretnych akcji/komend**.

4. **MCP (Podłączanie zewnętrznego świata):**
   Instalujesz odpowiedni serwer MCP (`claude mcp add...`), by Agent miał dostęp np. do Jiry czy bazy danych. Protokół wstrzyknie mu tę wiedzę jako kontekst. Pamiętaj tylko, by po skończonym zadaniu go odpiąć! Zbyt ciężkie MCP zapychają pamięć agenta i wypychają go z "Smart Zone". Jeśli możesz wykonać czynność zwykłą komendą w terminalu (CLI), zawsze preferuj CLI zamiast instalowania ciężkiego serwera MCP.

Postępując według tych prostych kroków, **odrzucasz samowolkę (YOLO Mode) i "Ralph loops"**, a zachowujesz żelazną dyscyplinę, architekturę Sub-Agentów i pełną kontrolę człowieka (HITL). To jest kwintesencja **Vibe Engineeringu na poziomie Senior!**
