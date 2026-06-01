---
title: 'Notatki: Zaawansowany Vibe Engineering, Code Review & Odrzucenie YOLO'
category: Vibe Coding
status: zrobione
type: notatka
main: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---

# Notatki: Zaawansowany Vibe Engineering, Code Review & Odrzucenie YOLO

Źródła: Kurs Udemy "Vibe Coding / Agentic AI" (Ed Donner), dokumentacja Claude Agent SDK, raport `Superpowers_Raport.md`, `rekomendacje_Eda_vibe_coding.md`.

**Temat:** Rygorystyczne projektowanie aplikacji na poziomie Senior/Enterprise z użyciem agentów AI, tworzenie zespołu agentów do profesjonalnego Code Review, architektura Multi-Agentowa (Agent Teams, Sub-Agents), integracje (MCP, Skills, Hooks) oraz bezwzględne odrzucenie generowania tzw. "Slop Code" (śmieciowego kodu).

**Dodatkowe materiały (wyodrębnione szczegóły):**

**Fundamenty (teoria):**
- 📘 [Konstytucja Agenta: Szablony i wytyczne (agents.md)](/notatki/vibe-coding/vibe-coding-agents-md) (anti-slop, senior python, zakazy, TDD)
- 📙 [Zarządzanie Zadaniami i TDD (plan.md)](/notatki/vibe-coding/vibe-coding-plan-md) (bite-sized chunks, DoD, brak placeholderów)
- 📗 [Rozszerzanie kompetencji: MCP, Plugins, Hooks](/notatki/vibe-coding/vibe-coding-rozszerzenia) (hierarchia rozszerzeń, MCP, hook „strażnik bramy", custom pluginy, `/loop`)
- 🎯 [Skills: SKILL.md, Bullseye, Skill Creator + rama Osmani](/notatki/vibe-coding/vibe-coding-skills) (workflow vs esej, instalacja `agent-skills`, pięć zasad)
- 📬 [Orkiestracja: Sub-Agents, Swarms i Ralph Loops](/notatki/vibe-coding/vibe-coding-orkiestracja) (unikanie YOLO, optymalizacja kosztów tokenów, HITL)
- 🔌 [Case Study: Zespół do Code Review](/notatki/vibe-coding/vibe-coding-code-review) (przełączanie modeli, audyt, read-only mode, izolacja agentów)
- 🧠 [Mindset i Workflow: Debugowanie, Jira i Budżet](/notatki/vibe-coding/vibe-coding-mindset-workflow) (systematyczne debugowanie, koszty tokenów, Jira, FeatureDev)

**Praktyka (workflow krok-po-kroku):**
- 🚀 [Tworzenie aplikacji Python od zera (z Superpowers)](/notatki/vibe-coding/vibe-coding-python-od-zera) (komendy CLI, struktura katalogów, własne Skille, hooki, TDD)
- 🔧 [Refaktoryzacja i Code Review istniejącego kodu](/notatki/vibe-coding/vibe-coding-python-refaktoryzacja) (Read-Only Audit, Workflow Simona Willisona, halucynacje, refactor PR)

---

## Spis treści

1. [Metadane, Wstęp, Filozofia HITL i Zasady Vibe Engineeringu](#1-metadane-wstęp-filozofia-hitl-i-zasady-vibe-engineeringu)
2. [Architektura Projektu, Fundamenty Sterowania: agents.md oraz plan.md](#2-architektura-projektu-fundamenty-sterowania-agentsmd-oraz-planmd)
3. [Rozszerzanie kompetencji: MCP, Skills, Plugins i Hooks](#3-rozszerzanie-kompetencji-mcp-skills-plugins-i-hooks)
4. [Orkiestracja, Programatyczne SDK, Agent Teams i Odrzucenie YOLO (Ralph loops)](#4-orkiestracja-programatyczne-sdk-agent-teams-i-odrzucenie-yolo-ralph-loops)
5. [Systematyczne Debugowanie, Cross-Model i (Case Study) Zespół do Code Review](#5-systematyczne-debugowanie-cross-model-i-case-study-zespół-do-code-review)
6. [Mindset, Jira i Zarządzanie Procesem](#6-mindset-jira-i-zarządzanie-procesem)
7. [Prawdziwy Wymiar Senior Enterprise (ADR, Threat Modeling, CI/CD)](#7-prawdziwy-wymiar-senior-enterprise-adr-threat-modeling-cicd)

**Szczegóły (osobne pliki):** [Konstytucja agents.md](/notatki/vibe-coding/vibe-coding-agents-md) · [Zarządzanie plan.md](/notatki/vibe-coding/vibe-coding-plan-md) · [MCP / Plugins / Hooks](/notatki/vibe-coding/vibe-coding-rozszerzenia) · [Skills (Ed + Osmani)](/notatki/vibe-coding/vibe-coding-skills) · [Orkiestracja i Swarms](/notatki/vibe-coding/vibe-coding-orkiestracja) · [Code Review Case Study](/notatki/vibe-coding/vibe-coding-code-review) · [Workflow i Debug](/notatki/vibe-coding/vibe-coding-mindset-workflow) · [Python od Zera](/notatki/vibe-coding/vibe-coding-python-od-zera) · [Refaktoryzacja](/notatki/vibe-coding/vibe-coding-python-refaktoryzacja)

---

## 1. Metadane, Wstęp, Filozofia HITL i Zasady Vibe Engineeringu

### Zagadnienie
Jak zapanować nad potężnymi asystentami AI, zmienić swój *mindset* z programisty na "Kierownika Budowy" (Głównego Architekta) i jak unikać podstawowych pułapek (kosztowych i jakościowych).

---

### Opis

**"Alien Tool" i uwagi Andreja Karpathy'ego:**
> *Modele, agenty, sub-agenty, pamięć, MCP, hooki — to wszystko to zupełnie nowa warstwa abstrakcji, rodzaj "obcego narzędzia" (Alien Tool).*
Zrozumienie tego cytatu jest kluczowe. Przestajemy już tylko "wklepywać kod". Wchodzimy w rolę Architekta Systemu. Narzędzia te są potężne, ale i niezrozumiałe w pełni. Jeśli nie opanujesz tej abstrakcji, utoniesz w chaosie wygenerowanego śmieciowego kodu.

**Zasady i dobre praktyki Vibe Engineeringu:**
Zamiast ślepo ufać agentom, Vibe Engineer stosuje rygor:
- **"Own the Code" (Bierz odpowiedzialność):** To Ty jesteś autorem. Jeśli agent wygeneruje błąd bezpieczeństwa, to Twój błąd. Zwalczaj *AI Slop* (bezużyteczny, rozwlekły kod).
- **"Bite-Sized Chunks" (Metoda małych kęsów):** Dziel pracę na zadania trwające 2-5 minut. To zapobiega halucynacjom.
- **Zarządzanie frustracją 10x:** Jeśli jako "10x developer" denerwujesz się na agenta, zmień prompt, podaj lepszy przykład lub zrób `/clear` i zacznij od nowa zamiast kłócić się z maszyną.

**Super-powers (`@Superpowers_Raport.md`):**
Framework "Superpowers" narzuca rygorystyczny TDD (Test-Driven Development) i proceduralne planowanie. Zamiast prosić "napisz mi aplikację", narzucasz:
1. Brainstorming (akceptacja architektury).
2. TDD (agent musi napisać test, który nie przechodzi - RED, zanim napisze kod - GREEN).
3. Brak placeholderów w kodzie (agenci mają zakaz używania komentarzy typu `// TODO: zaimplementuj logikę`).

**Filozofia HITL (Human-In-The-Loop):**
To absolutny fundament bezpiecznego tworzenia oprogramowania (zwłaszcza w Pythonie na poziomie Enterprise). Kategorycznie odrzucamy tryb pełnej autonomii (YOLO).
- Agent projektuje $\rightarrow$ **Ty akceptujesz**.
- Agent pisze testy $\rightarrow$ **Ty sprawdzasz**.
- Agent implementuje $\rightarrow$ **Ty robisz Code Review** (lub robi to odizolowany sub-agent, ale Ty zatwierdzasz Pull Request).
- Zapobiegasz "wymknięciu się" agentów spod kontroli, trzymając rękę na pulsie.

**Twarda Egzekucja HITL: `requireApproval=true`:**
Sama filozofia HITL nie wystarczy — agent jest "nadgorliwy" i potrafi wykonać 5 punktów planu zanim spojrzysz na ekran. Włącz systemowy hamulec ręczny w Claude Code:
```bash
/config set requireApproval true
```
Od tego momentu agent musi pytać o zgodę (`y/n`) przed KAŻDĄ operacją zapisu pliku.

**UWAGA: "Approval Fatigue" (Zmęczenie klikaniem):**
To psychologiczna pułapka, w którą wpadniesz po godzinie pracy. Agent zapyta Cię 50x `y/n`, a Ty zaczniesz klikać `y, y, y` na ślepo (jak zgodę na regulamin internetu). To **powrót do YOLO Mode tylnymi drzwiami**! Czytaj każdy prompt. Jeśli widzisz, że agent chce zmienić 5 plików naraz – wpisz `n` i każ mu zrobić tylko jeden.

**Zarządzanie Budżetem i Oszczędzanie Tokenów:**
Praca w wielkich oknach kontekstowych kosztuje krocie i prowadzi do degradacji jakości (*Context Rot*). Oszczędzanie polega na:
- Zamykaniu starych sesji poleceniem `/clear` po ukończeniu małego zadania (Hard Reset).
- Gęstym robieniu "save'ów" (`git commit`).
- Delegowaniu pojedynczych zadań do **Sub-agentów**, którzy pracują z "czystą kartą" (nie dźwigają historii dyskusji głównego okna).


---

## 2. Architektura Projektu, Fundamenty Sterowania: `agents.md` oraz `plan.md`

### Zagadnienie
Jak ułożyć strukturę plików profesjonalnego projektu i jak prawidłowo napisać "Konstytucję" (`agents.md`) i "Ustawę" (`plan.md`). Szczegółowe instrukcje pisania tych plików znajdują się w [oddzielnych dokumentach](#spis-treści).

---

### Opis

**Struktura katalogów profesjonalnego projektu:**
Izolacja logiki biznesowej od konfiguracji agentów to klucz.
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

**Struktura Pliku `agents.md` (Konstytucja):**
Wymusza jakość na poziomie Senior Enterprise. Dla Pythona powinna zawierać m.in.:
- **Standardy:** Absolutny wymóg zgodności z PEP8, typowania (`mypy`, `TypeHints`), użycia docstringów w formacie Google lub NumPy.
- **Bezpieczeństwo:** Nakaz walidacji danych (np. `Pydantic`), filtrowania wejść, braku "hardcodowanych" haseł.
- **Anti-Slop:** Kategoryczny zakaz pisania w kodzie oczywistych komentarzy (np. `# inkrementacja o 1`) oraz zakaz dodawania emoji. "Jeśli komentarz nie wyjaśnia *dlaczego*, skasuj go".
- **Grounding (Trzymanie się faktów):** BEZWZGLĘDNY ZAKAZ halucynacji. Agent ma bazować WYŁĄCZNIE na dokumentacji projektu i istniejącym kodzie — jeśli czegoś nie ma w specyfikacji, MUSI zapytać użytkownika, a nie zmyślać założeń biznesowych.
- **Progressive Disclosure (Oszczędność Kontekstu):** Wytyczna kierująca agenta najpierw do `@plan.md` (główny drogowskaz), a inne pliki z `docs/` ma czytać TYLKO gdy są bezwzględnie potrzebne do zadania. Chroni przed "Context Rot".
- **Zakaz dotykania kodu poza zakresem zadania** *(Źródło: Addy Osmani, inżynier Google)*: Zasada "Touch only what you asked to touch". Agent ma surowy zakaz refaktoryzowania sąsiedniego kodu, poprawiania stylu innych funkcji, usuwania cudzych TODO czy zmieniania API bez wyraźnej zgody. Jeśli widzi problem poza zakresem bieżącego zadania — ma go zapisać jako sugestię w raporcie, ale NIE dotykać kodu. Dobra zmiana jest mała, czytelna i ma jasny powód istnienia.
- **Pięć Nie-negocjowalnych Zasad dla Agenta** *(Źródło: Addy Osmani)*:
  1. Ujawnij założenia zanim zaczniesz budować (milczące założenia to najczęstsza awaria).
  2. Zatrzymaj się i zapytaj, gdy wymagania się wykluczają (nigdy nie zgaduj).
  3. Sprzeciw się, gdy jest powód (agent to nie maszyna do potakiwania).
  4. Preferuj nudne, oczywiste rozwiązanie (spryt i "clever code" są drogie w utrzymaniu).
  5. Dotykaj tylko tego, o co zostałeś poproszony.
- **Płot Chestertona (Chesterton's Fence)** *(Źródło: Addy Osmani)*: Agentom nie wolno usunąć ŻADNEJ linii kodu, dopóki w 100% nie zrozumieją i nie wytłumaczą, dlaczego ten kod się tam w ogóle znalazł. Agenty mają tendencję do kasowania "niepotrzebnego kodu", który w rzeczywistości obsługuje edge-case'y.
- **Reguła Beyonce (Beyonce Rule)** *(Źródło: Addy Osmani / Google)*: "If you liked it, you should have put a test on it." Kod bez testu traktujemy jako kod, na którego działaniu nam nie zależy. Zmiany infrastrukturalne nie chronią przed bugami — chronią przed nimi testy.
- **Zasada małych PR-ów (~100 linii)** *(Źródło: Addy Osmani / Google)*: Agenty muszą rozbijać pracę tak, aby pojedynczy Pull Request/Commit nie przekraczał około 100 linii. Powyżej tej wartości kod nie jest recenzowany, jest jedynie "gumostemplowany".
- **Tabele Antywymówek (Anti-rationalization tables)** *(Źródło: Addy Osmani, inżynier Google)*: W Konstytucji warto zapisać listę typowych wymówek agenta i twardych odpowiedzi, które z góry blokują mu drogę na skróty. Przykłady:
  - *Wymówka:* "To za mała zmiana na testy." $\rightarrow$ *Odpowiedź:* "Mała czy duża — kod bez testu to kod odrzucony."
  - *Wymówka:* "Testy dopiszę później." $\rightarrow$ *Odpowiedź:* "'Później' to najniebezpieczniejsze słowo w programowaniu. Najpierw test."
  - *Wymówka:* "Kod działa, więc można kończyć." $\rightarrow$ *Odpowiedź:* "Działający kod to nie dowód. Pokaż wynik testu, log lub screenshot."

**Struktura Pliku `plan.md` (Ustawa):**
Precyzyjnie dzieli zadania na *Bite-sized chunks*.
1. **Cel:** Krótki i konkretny (np. "Wdrożenie uwierzytelniania JWT").
2. **Kroki do wykonania:** Lista zadań z checkboxami `[ ]`, `[x]`. Agent ma obowiązek aktualizować ten plik w miarę postępów.
3. **Kryteria Akceptacji (Definition of Done):** Np. testy muszą przejść, pokrycie $\ge$ 90%.
4. **Znaczniki STOP (Anti-YOLO):** Po KAŻDYM punkcie `[ ]` wstaw fizyczną blokadę: `**[!!! STOP !!! ZATRZYMAJ PRACĘ I CZEKAJ NA ZATWIERDZENIE]**`. To "próg zwalniający" w pliku, który dosłownie zatrzymuje agenta przed wykonywaniem 10 zadań pod rząd bez Twojej zgody.

> **Rekomendacja Eda:** Stosuj *Inżynierię Kontekstu Progresywnego*. Główny `agents.md` siedzi w katalogu głównym projektu, ale w podkatalogu `/src/api` możesz umieścić specyficzny dokument z zasadami pisania endpointów FastAPI, do którego agent musi zajrzeć pracując w tym obszarze.


---

## 3. Rozszerzanie kompetencji: MCP, Skills, Plugins i Hooks

### Zagadnienie
Narzędzia ulepszające agentów pozwalają im działać w realnym świecie (uruchamiać skrypty, łączyć się z bazami). **Skills** — [vibe_szczegoly_skills.md](/notatki/vibe-coding/vibe-coding-skills); **MCP, pluginy, hooki, `/loop`** — [vibe_szczegoly_rozszerzenia.md](/notatki/vibe-coding/vibe-coding-rozszerzenia).

**Mantra "5 Warstw Vibe Engineeringu" (Agent Development Kit)**
Zanim wejdziemy w detale, zapamiętaj prostą ściągawkę (autorstwa Brija Kishore Pandey), która tłumaczy, co po czym następuje w profesjonalnym stacku. Ucz się tego jak wierszyka:
1. **`CLAUDE.md` sets rules** (Konstytucja: ustala zasady gry na poziomie projektu).
2. **Skills provide expertise** (Wiedza: wstrzykują konkretne, leniwie ładowane procedury).
3. **Hooks enforce quality** (Bramkarz: na twardo egzekwuje jakość przez systemowe skrypty).
4. **Subagents delegate work** (Delegacja: zlecają wąskie zadania na zewnątrz, chroniąc główny kontekst).
5. **Plugins distribute to team** (Dystrybucja: paczkują to wszystko w zestaw gotowy dla reszty zespołu).

---

### Opis

**Model Context Protocol (MCP):**
MCP (Model Context Protocol) to standard umożliwiający agentom ustandaryzowane łączenie się z zewnętrznymi bazami danych, narzędziami, systemami (np. JIRA, GitHub, Slack) bez ręcznego wklejania kontekstu. Agenty potrafią używać serwerów MCP do samodzielnego "odpytywania" o to, czego im brakuje, ograniczając objętość promptu.

**Skills (Umiejętności):**
Skill to mały plik konfiguracyjny (np. `.md` i `.json`), który uczy agenta, jak wykonać specyficzną operację (np. "Uruchom linter Pythona").
- *Praktyki:* Skill musi być precyzyjny. Powinien wymuszać użycie konkretnych komend Bash, np. `pytest tests/` lub `flake8 src/`. 

**Plugins (Wtyczki):**
Zbiór powiązanych Skilli (np. wtyczka do zarządzania Dockerem).
- *Ostrzeżenie:* Używaj ostrożnie. Ed ostrzega przed "Incepcją" – sytuacją, gdzie agenci uruchamiają wtyczki, które uruchamiają innych agentów, doprowadzając do fraktalnego chaosu.

**Hooks (Zdarzenia / Cykl Życia):**
Skrypty reagujące na wydarzenia w cyklu pracy Agenta (np. `start`, `stop`).
- *Przykład użycia (Automatyczne Code Review):* Ustawiasz Hook na zdarzenie `stop`. Gdy agent oświadczy "Zrobiłem zadanie", Hook automatycznie odpala w tle `bandit` (skaner bezpieczeństwa) oraz `flake8` i `pytest`. Jeśli testy padną, agent nie może zamknąć zadania.


---

## 4. Orkiestracja, Programatyczne SDK, Agent Teams i Odrzucenie YOLO (Ralph loops)

### Zagadnienie
Jak skutecznie zrównoleglać zadania za pomocą SDK lub narzędzi takich jak Agent Teams, jednocześnie omijając pułapki ekstremalnej autonomii (spirale błędów). Pełne omówienie znajdziesz [tutaj](/notatki/vibe-coding/vibe-coding-orkiestracja).

---

### Opis

**Programatyczne Sterowanie Agentami i Różnica w SDK:**
Kiedy CLI (Claude Code) przestaje wystarczać, wkraczamy na niższy poziom abstrakcji poprzez kod w Pythonie.
- **OpenAI Agents SDK:** Framework nastawiony na proste klocki, zrzucający całą "ceremonię" parsowania JSON-ów pod maskę. Filozofia Swarms (Rojów) z dynamicznym przekazywaniem zadań między agentami (*Handoffs*). Silny nacisk na budowę okien dialogowych.
- **Claude Agent SDK (Computer Use):** Bardziej ustrukturyzowane workflow, mocniejszy nacisk na potężne zdolności "współdziałania z komputerem" (wykonywanie komend shell, czytanie plików) oraz ścisłą współpracę w ekosystemie Claude (wsparcie integracji MCP "out of the box" dla skomplikowanych aplikacji korporacyjnych).

**Sub-Agents i Oszczędność (Walka z Context Rot):**
Tworzenie sub-agenta (małego pracownika zleceniowego) to najlepszy sposób na ratowanie tokenów. Gdy główne okno agenta jest zapchane plikami i dyskusją, zlecamy wąskie zadanie (np. *"Przeanalizuj tylko ten jeden plik `utils.py`"*) nowemu sub-agentowi, który nie ładuje do głowy całej wiedzy projektowej. Szybko, precyzyjnie, tanio.

**Analiza Kosztów: GSD vs Agent Teams:**
- *GSD (Get S*** Done / Spec-Driven Design):* Bardzo sztywne, narzucające testy i procedury. Wysoce bezpieczne, ale zjada masę tokenów i potrafi być 10x droższe.
- *Agent Teams:* Ciekawa opcja orkiestracji (zespół agentów bezpośrednio rozmawiających ze sobą), ale ryzykowna bez nadzoru.

**Odrzucenie YOLO i syndrom "Ralph loops":**
- Tryb YOLO, uruchamiany np. flagą `--dangerously-skip-permissions` sprawia, że agent wykonuje operacje na systemie bez zgody.
- Prowadzi to często do tzw. **Ralph Wiggum loops** (od postaci Ralpha z Simpsonów, który mówi "I'm helping!", jednocześnie niszcząc). Agent wpada w pętlę – edytuje kod, test pada, edytuje gorzej, test pada, kasuje pół pliku... Zanim się zorientujesz, przepalił 5 dolarów na bezsensowne zmagania w terminalu.
- **Rozwiązanie (HITL):** Ty jesteś hamulcem ręcznym. Nadzorujesz każdy `commit` gita i resetujesz kontekst (`/clear`), gdy agent zaczyna halucynować. Nigdy nie puszczaj Agenta samopas na produkcji.

**Plan Verification Gate (Bramka Weryfikacji Planu):**
To **najważniejszy moment całego procesu** i jednocześnie najczęstsze miejsce porażki w real-life projektach (np. nasz FlyerEngine). Po tym jak agent wygeneruje `plan.md`:
1. **Zatrzymaj cały proces.** NIE pozwól mu od razu wykonać `/superpowers:execute-plan`.
2. Otwórz `plan.md` w edytorze i przeczytaj go linijka po linijce.
3. Szukaj czerwonych flag:
   - "Faza 1.1: Zaimplementuj cały moduł autentykacji" – ZA OGÓLNE, każ rozbić na 5 podzadań.
   - Brak znaczników `[!!! STOP !!!]` między punktami – każ je dodać.
   - Punkty zakładające produkcję (deploy, migracje DB) – wytnij ręcznie.
4. Edytuj plik samodzielnie lub odeślij agentowi do poprawy.

**Bez tej bramki cały HITL traci sens** – wpuszczasz agenta do biegu na podstawie planu, którego nawet nie sprawdziłeś.


---

## 5. Systematyczne Debugowanie, Cross-Model i (Case Study) Zespół do Code Review

### Zagadnienie
Praktyczne zastosowanie nabytej wiedzy w scenariuszach awaryjnych oraz architekturze potężnych przeglądów kodu. [Szczegółowy case-study o tym zespole znajdziesz tutaj](/notatki/vibe-coding/vibe-coding-code-review).

---

### Opis

**Systematyczne Debugowanie:**
Odrzucamy instynkt nakazujący rzucenie błędu agentowi z dopiskiem *"Zepsuło się, napraw to"*. 
Dobry Vibe Engineer nakazuje agentowi najpierw zebrać dowody (wklejenie stack trace, sprawdzenie logów systemowych), zdefiniowanie **hipotezy** w osobnym pliku tekstowym `debug.md`, a dopiero po Twojej akceptacji hipotezy – naniesienie poprawek w kodzie.

**Weryfikacja Cross-Model (Zderzenie Tytanów):**
Genialna metoda walidacji polegająca na wykorzystaniu różnych silników LLM. Np. używasz Claude 3.5 Sonnet w IDE jako głównego kodera, ale najtrudniejsze i skomplikowane algorytmy (lub bezpieczeństwo architektoniczne) dajesz do zrecenzowania dla OpenAI o1 (który świetnie radzi sobie z rozumowaniem) lub modelu Claude Opus. Inne sieci neuronowe zwracają uwagę na inne detale.

Praktyczne wywołanie z poziomu Claude Code (uruchamia OpenAI Codex w shellu):
```bash
codex exec 'Przeczytaj plik docs/RAPORT_BLEDOW.md i zweryfikuj punkt 1. Sprawdź ten kod w src/. Czy to faktycznie błąd, czy halucynacja? Zapisz wnioski w docs/cross_check.md. NIE MODYFIKUJ KODU.'
```

**Walka z halucynacjami audytora (Workflow Eda):**
Modele potrafią notorycznie zmyślać problemy w audytach (klasyczny przykład: krzyczą, że `.env` wyciekł do GitHuba, podczas gdy plik jest w `.gitignore`). Twój workflow:
1. Otwórz wskazany plik na podanej linii.
2. Zweryfikuj, czy faktycznie jest tam zgłoszony błąd.
3. Jeśli to halucynacja, ZAWSZE konfrontuj agenta:
   > *"Sprawdziłem - to fałszywy alarm. Plik `.env` JEST w `.gitignore`. Zaktualizuj raport. POKAŻ MI DOWÓD, jeśli upierasz się, że masz inne źródło."*

**Walka z "Inteligentnym Nieposłuszeństwem" (Intelligent Disobedience):**
Czasem agent oświadczy: *"Done with High priority. Note: Splitting main.py was deemed too risky for the current sprint."* — czyli sam zdecyduje, że pominie zadanie z planu, bo "uznał to za ryzykowne". **NIE GODŹ SIĘ NA TO!**
> *"To dobrze, ale naprawdę chcę uporządkować ten monolityczny moduł. Zrób to teraz. Zrefaktoryzuj `main.py` i rozłóż kod na moduły. **You are not the architect — I am. Do as planned.**"*

(Wyjątek: jeśli agent przedstawi twardy dowód testem, że zadanie wprowadziłoby regresję, można odmowę zaakceptować.)

### Case Study: Architektura Zespołu do Code Review (Istniejące Aplikacje)

Wyobraź sobie, że musisz zoptymalizować wielką, starą bazę kodu Pythona pod kątem bezpieczeństwa.

1. **Szablon `plan.md` dla Audytu:**
   Dzielisz repozytorium na *Bite-sized chunks*: Faza 1 (Logowanie), Faza 2 (Endpointy płatności), Faza 3 (Przetwarzanie danych).
2. **Tworzenie wyspecjalizowanego Agenta (Szablon `agents.md`):**
   Tworzysz dedykowany zestaw wytycznych dla "Recenzenta Bezpieczeństwa". 
   - Cel: Wyłapywanie wycieków pamięci, dziur SQL Injection, naruszeń OWASP.
   - Narzędzia: Agenty mają podpięte MCP, by czytać raporty z Sentry lub Datadog.
3. **Przełączanie Agentów (Zarządzanie modelami pod kątem kosztów):**
   Na co dzień korzystasz z tańszego modelu (np. Sonnet / Haiku / GPT-4o-mini). Jednak do procesu Audytu **przełączasz model** na ciężki, potężny silnik analityczny (np. Claude Opus lub OpenAI o1).
4. **Prompt Ratunkowy / Read-Only (Złota zasada):**
   Audytor **nie może dotykać kodu produkcyjnego**. 
   >*"Przeprowadź kompleksowy code review całego repozytorium pod kątem wycieków pamięci i bezpieczeństwa. Wypisz listę naprawczą i zapisz do pliku `docs/review.md`. **NIE dotykaj i nie zmieniaj bezpośrednio żadnego pliku z kodem.**"*
5. **Dlaczego unikamy tu Agent Teams? (Wnioski Eda):**
   Wrzucenie takiego "Recenzenta" zintegrowanego ze standardowym zespołem Agent Teams mogłoby doprowadzić do nieskończonych sporów ("Agent A napisał, Agent B uznał że to błąd, Agent A poprawił i zepsuł logikę"). Recenzent działa jako izolowany Sub-Agent, który raportuje wyłączne do Ciebie (HITL). Ty czytasz `docs/review.md` i wdrażasz poprawki własnoręcznie lub świadomie zlecasz je koderowi w odrębnej sesji.

---

## 6. Mindset, Jira i Zarządzanie Procesem

### Zagadnienie
Jak zorganizować codzienny przepływ pracy (od ticketu do GitHuba) bez generowania chaosu. [Szczegółowy opis mindsetu znajdziesz tutaj](/notatki/vibe-coding/vibe-coding-mindset-workflow).

### Opis
Nawet najlepsze prompty i agenty zawiodą, jeśli proces jest chaotyczny. "Vibe Engineer" zamyka pracę w formalnych ramach:

1. **Nigdy nie zaczynaj od kodu (Jira):** Zawsze używaj sformalizowanych ticketów w narzędziu zewnętrznym (Jira / GitHub Issues). Podpinasz je przez serwery MCP, np. *Atlassian MCP*. Zlecasz: *"Zrób zadanie PL-2"*. Agent sam to odczyta.
2. **Pytaj zanim zapłacisz:** Pierwszym krokiem każdego planu powinno być nakazanie agentowi zadania **Tobie** pytań wyjaśniających przed napisaniem jakiegokolwiek kodu.
3. **Pilnuj rachunków (Free Models):** Rozwiązania "Ads for AI" jak AMP Code są świetne do nauki, ale uważaj: korzystając z nich zazwyczaj oddajesz swój kod i logikę do trenowania cudzych modeli. Nigdy nie używaj tego w komercji.
4. **Atrofia umiejętności:** Jeśli ślepo akceptujesz zmiany, Twoje zdolności programowania zanikną. Karpathy nakazuje patrzeć na kod *"jak jastrząb"* i samemu pisać lub poprawiać, jeśli agent tworzy pajęczynę.
5. **Rewind vs Git:** `/rewind` w Claude Code to nie wehikuł czasu dla całego systemu. Cofa tylko to, co wiedział Claude. Zawsze rób lokalny `git commit` przed ryzykownym zadaniem. W razie problemu ratuje Cię twardy "revert" w Git.
6. **Ratunek po awarii sesji (`/resume`):** Gdy Claude Code padnie albo zamkniesz przypadkiem terminal, NIE startuj od zera. Po ponownym uruchomieniu CLI wpisz `/resume` — wczytuje ostatnią sesję bez utraty kontekstu (agent przypomni sobie, na czym skończyliście). Niezbędne przy długich projektach.
7. **Złoty Nawyk Czyszczenia (`/clear` po Fazie):** Po ukończeniu każdej Fazy z `plan.md` poproś agenta: *"Podsumuj decyzje architektoniczne do `docs/decisions.md`"*, a następnie wpisz `/clear`. To "wyczyści mu głowę" z kontekstowych śmieci ze starej rozmowy — następna Faza będzie **lżejsza, szybsza i tańsza** o 50-70%.

---

## 7. Prawdziwy Wymiar Senior Enterprise (ADR, Threat Modeling, CI/CD)

### Zagadnienie
Powyższe metody uczą **sterowania agentem** (Vibe Coding), ale to tylko połowa sukcesu na poziomie "Senior Enterprise". Aby w pełni wejść na ten poziom, architektura i procesy muszą objąć również to, czego agenty same z siebie nie zaproponują.

### Opis
Nawet najlepsze skrypty w `.claude/hooks` nie zastąpią profesjonalnych praktyk wytwarzania oprogramowania. Vibe Engineer musi wpleść agenta w istniejące, korporacyjne procesy:

1. **Architecture Decision Records (ADR):**
   - Zanim zmusisz agenta do implementacji kluczowych komponentów, wymuś na nim przygotowanie pliku ADR w `docs/adr/`.
   - ADR musi zawierać Kontekst, Decyzję, Konsekwencje i Alternatywy. Agenty mają tendencję do cichego przemycania bibliotek. ADR wymusza jawność.
   - Wrzucaj do Jiry tickety typu "Napisz ADR dla systemu logowania", zanim przejdziesz do kodu.

2. **Threat Modeling (Modelowanie Zagrożeń):**
   - Kod generowany przez AI to jedno z największych ryzyk bezpieczeństwa (np. ukryte podatności). 
   - Zanim stworzysz plik `plan.md`, zbuduj model zagrożeń. Zmuś Agenta-Audytora (najlepiej w izolacji z o1-preview) do odszukania wektorów ataku dla nowej funkcjonalności. Wpisz te wnioski do Konstytucji dla danej funkcji.

3. **Integracja z CI/CD Pipeline:**
   - Twój lokalny plik `quality_gate.sh` to absolutne minimum (tzw. "Strażnik Bramy"). Prawdziwe Enterprise zakłada pełną pętlę CI/CD (GitHub Actions, GitLab CI).
   - Agent ma zakaz pushowania kodu na główną gałąź. Agent przygotowuje Pull Request, a pipeline CI odpala SonarQube, skanery Trivy (obrazów Docker) i testy integracyjne E2E.
   - Zlecaj agentowi naprawianie błędów zrzutów z Sentry wprost powiązanych z ID pipeline'u, używając zewnętrznych systemów i logów (Atlassian MCP / Sentry MCP).

4. **Product Discovery:**
   - Przed zleceniem agentowi kodu, musisz wiedzieć, CO budujesz. Brak procesu Discovery prowadzi do masowej produkcji bezużytecznego kodu. Używaj modelu na etapie burzy mózgów (Brainstorming), by przeanalizować cele biznesowe, a dopiero później konwertuj je na `plan.md`.

Odróżnia to inżyniera "sterującego maszyną" od "Architekta Systemów Enterprise". Agenty piszą kod, Ty projektujesz fabrykę, w której pracują.
