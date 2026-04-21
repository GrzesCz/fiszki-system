---
title: Vibe Coding — Notatki Techniczne
category: Vibe Coding
status: w_trakcie
type: notatka
mindmaps: []
next_review_date: '2026-04-23'
review_count: 2
---

# Vibe Coding — Notatki Techniczne

Źródła: Transkrypcje kursu Udemy (Ed Donner). Zgodnie z zasadą: tylko to, co rzeczywiście padło w kursie.

**Cel notatki:** Zebranie kluczowych sugestii, zaleceń i fundamentów technicznych (w stylu M. Zelenta), służących jako podstawa do map myśli i metody Feynmana.

---

## Spis treści
1. [Refaktoryzacja Profesji: Od Vibe Coding do Vibe Engineering](#1-refaktoryzacja-profesji-od-vibe-coding-do-vibe-engineering)
2. [Fundamenty LLM: 4 Triki Inteligencji](#2-fundamenty-llm-4-triki-inteligencji)
3. [Trzy Powierzchnie Pracy i Modele Narzędzi](#3-trzy-powierzchnie-pracy-i-modele-narz%C4%99dzi)
4. [8 Etapów Podróży AI Codera (Model Yegge)](#4-8-etap%C3%B3w-podr%C3%B3%C5%BCy-ai-codera-model-yegge)
5. [Inżynieria Kontekstu (Context Engineering) i Compacting](#5-in%C5%BCynieria-kontekstu-context-engineering-i-compacting)
6. [Ewolucja Strategii: Mindset 2025 vs Mindset 2026](#6-ewolucja-strategii-mindset-2025-vs-mindset-2026)
7. [Koszty API i Model Finansowy](#7-koszty-api-i-model-finansowy)
8. [Anatomia pliku agents.md (Serce Projektu)](#8-anatomia-pliku-agentsmd-serce-projektu)
9. [Etyka, Anti-Slop i Zasady Jellyfin](#9-etyka-anti-slop-i-zasady-jellyfin)
10. [Ewolucja Workflowów: Od Mikrozarządzania do Rojów Agentów](#10-ewolucja-workflowów-od-mikrozarządzania-do-rojów-agentów)
11. [Architektura API i Agregatory (OpenRouter)](#11-architektura-api-i-agregatory-openrouter)
12. [Praktyka YOLO Mode: Setup Projektu i Pierwszy Agent](#12-praktyka-yolo-mode-setup-projektu-i-pierwszy-agent)
13. [Iteracja i Cyfrowy Bliźniak (Digital Twin) w YOLO](#13-iteracja-i-cyfrowy-bliźniak-digital-twin-w-yolo)
14. [Zaawansowane Techniki YOLO: Reset, Self-Tutorial i Cross-Model Review](#14-zaawansowane-techniki-yolo-reset-self-tutorial-i-cross-model-review)
15. [Podsumowanie Złotych Zasad (wg A. Karpathy'ego i E. Donnera)](#15-podsumowanie-z%C5%82otych-zasad-wg-a-karpathyego-i-e-donnera)
16. [Podstawy Aplikacji Webowych i Architektury Kontenerów](#16-podstawy-aplikacji-webowych-i-architektury-kontener%C3%B3w)
17. [Start z Istniejącym Kodem vs Scratch (Dziedziczenie MVP)](#17-start-z-istniej%C4%85cym-kodem-vs-scratch-dziedziczenie-mvp)
18. [Metodyczne Planowanie: plik plan.md i Checkpointing](#18-metodyczne-planowanie-plik-planmd-i-checkpointing)
19. [Przykładowe Szablony: agents.md oraz plan.md](#19-przyk%C5%82adowe-szablony-agentsmd-oraz-planmd)
20. [Weryfikacja Kroków, Pułapka Pokrycia Testami i Diffy w IDE](#20-weryfikacja-krok%C3%B3w-pu%C5%82apka-pokrycia-testami-i-diffy-w-ide)
21. [Trudności z Integracją, Fałszywe Błędy i Oczyszczanie Kontekstu](#21-trudno%C5%9Bci-z-integracj%C4%85-fa%C5%82szywe-b%C5%82%C4%99dy-i-oczyszczanie-kontekstu)
22. [Eksperckie Dobre Praktyki na Zakończenie Week 1](#22-eksperckie-dobre-praktyki-na-zako%C5%84czenie-week-1)
23. [Week 2: Przejście z Vibe Coding do Vibe Engineering (Claude Code)](#23-week-2-przej%C5%9Bcie-z-vibe-coding-do-vibe-engineering-claude-code)
24. [Wprowadzenie do Claude Code CLI i Instalacja](#24-wprowadzenie-do-claude-code-cli-i-instalacja)
25. [Praktyka: Inicjalizacja i Pierwsze Komendy w Claude Code](#25-praktyka-inicjalizacja-i-pierwsze-komendy-w-claude-code)
26. [Code Review, Halucynacje i Kompresja Kontekstu w Claude Code](#26-code-review-halucynacje-i-kompresja-kontekstu-w-claude-code)
27. [OpenCode: Otwarta Alternatywa i Darmowe Modele CLI](#27-opencode-otwarta-alternatywa-i-darmowe-modele-cli)
28. [AMP Code, Claude Code z OpenRouter i Ollama lokalnie](#28-amp-code-claude-code-z-openrouter-i-ollama-lokalnie)
29. [Zaawansowane Zarządzanie Sesją i Składnia Claude Code](#29-zaawansowane-zarządzanie-sesją-i-składnia-claude-code)
30. [Sesje, Checkpointing i Git — trzy poziomy „cofania” w Claude Code](#30-sesje-checkpointing-i-git--trzy-poziomy-cofania-w-claude-code)
31. [Praktyka `/rewind`, skróty Ctrl+O / Ctrl+E / Ctrl+B i demonstracja checkpointów](#31-praktyka-rewind-skróty-ctrloe-ctrle-ctrlb-i-demonstracja-checkpointów)
32. [Prawdziwy YOLO w Claude Code: `--dangerously-skip-permissions` i demo przebudowy UI](#32-prawdziwy-yolo-w-claude-code---dangerously-skip-permissions-i-demo-przebudowy-ui)
33. [Ralph loops — oficjalna wtyczka Anthropic, pętla zewnętrzna i `--max-iterations`](#33-ralph-loops--oficjalna-wtyczka-anthropic-pętla-zewnętrzna-i---max-iterations)
34. [Week 2 dzień 3: MCP, Skills, Plugins — narzędzia, MCP jako protokół, hype vs kontekst](#34-week-2-dzień-3-mcp-skills-plugins--narzędzia-mcp-jako-protokół-hype-vs-kontekst)

---

## 1. Refaktoryzacja Profesji: Od Vibe Coding do Vibe Engineering

### Zagadnienie
Zrozumienie zmiany paradygmatu w programowaniu – czym jest "Vibe Coding" i dlaczego przechodzi w "Vibe Engineering".

### Opis
Według tweeta Andreja Karpathy'ego profesja programisty przeżywa obecnie trzęsienie ziemi (o sile 9 w skali Richtera) i jest **dramatycznie refaktoryzowana**.

*   **Zjawisko "Sparse Bits":** Kawałki kodu pisane ręcznie przez człowieka stają się coraz rzadsze (są coraz bardziej "sparse").
*   **Vibe Coding:** Początkowo to określenie oznaczało "poddanie się wibracjom" (giving in to the vibes), gdzie człowiek przestawał patrzeć na kod, a jedynie podawał intencję i rzucał ją do LLM. Często z podejściem "wyrzuć i spróbuj ponownie", jeśli kod nie działał.
*   **Vibe Engineering / Agentic Coder:** Rozwinięcie tego podejścia, ukute przez Simona Willisona. Oznacza profesjonalne inżynierowanie przy użyciu agentów AI jako "pomocników" (sidekicks), gdzie nadal budujesz duże i niezawodne systemy, ale z asystą zaawansowanych narzędzi.

**Rola Programisty:** Programista przestaje być rzemieślnikiem układającym instrukcje `if/else`, a staje się osobą zarządzającą wyższą warstwą abstrakcji: agentami, sub-agentami, kontekstem, narzędziami, MCP czy hookami. Musi zarządzać bytami, które są "stochastyczne (losowe), omylne i niezrozumiałe", wplatając je w dobrą, staroświecką inżynierię oprogramowania.

---

## 2. Fundamenty LLM: 4 Triki Inteligencji

### Zagadnienie
Jak silnik statystyczny, który tylko przewiduje kolejny wyraz (token), symuluje zaawansowaną inteligencję?

### Opis
Sam LLM to po prostu model statystyczny (np. GPT). "Chat" (np. ChatGPT) to aplikacja obudowująca ten model oprogramowaniem. Aby aplikacja była "agentem", wykorzystuje cztery sztuczki:

1.  **Iluzja Pamięci (Illusion of Memory):**
    *   Sam LLM jest całkowicie **bezstanowy** (stateless). Nie pamięta poprzedniego pytania.
    *   *Trik:* Przy każdym nowym zapytaniu host wysyła do modelu **całą dotychczasową historię konwersacji** (wszystkie wiadomości) złączoną jako jeden długi input. W ten sposób model widzi kontekst i wydaje się, że "pamięta".
2.  **Rozumowanie (Reasoning / Thinking):**
    *   Wymuszenie na modelu (często wyuczone, jak "think step by step"), by przed udzieleniem ostatecznej odpowiedzi wygenerował "tokeny myślenia" wyjaśniające problem.
    *   *Przykład z kursu:* Jeśli zapytasz o dwie monety (rzucasz dwie, jedna to orzeł, jaka szansa, że druga to reszka?), naiwny model odpowie "50-50". Model z "reasoningiem" przetworzy logikę (2/3) zanim udzieli prawidłowej odpowiedzi, bo zdoła "rozgrzać" procesor wnioskujący poprzez wygenerowanie wyjaśnienia.
3.  **Narzędzia (Tools):**
    *   LLM sam w sobie **nie potrafi** szukać w internecie czy odpalać kodu.
    *   *Trik:* Model jest uczony, by generował specyficzne tokeny akcji (np. `Python: calculate()`). Aplikacja przechwytuje to wyjście, wykonuje kod w systemie i odsyła wynik z powrotem do modelu.
4.  **Pętla (Loop):**
    *   Wywoływanie LLM raz za razem w pętli. Jeśli cel nie został osiągnięty, aplikacja podaje mu nowe dane (np. błąd z testów) i zmusza do ponownego przemyślenia.

**Definicja Agenta:** Według nowoczesnych standardów (2025/2026), Agent AI to **LLM używający narzędzi (Tools) w pętli (Loop) do osiągnięcia celu**.

---

## 3. Trzy Powierzchnie Pracy i Modele Narzędzi

### Zagadnienie
Gdzie fizycznie i w jakim interfejsie programujemy wspólnie z agentami? Jakie narzędzia królują na rynku?

### Opis
Środowiska pracy z agentami dzielą się na trzy kategorie:

1.  **IDE (Zintegrowane Środowisko Deweloperskie):**
    *   Samodzielne edytory, najczęściej fork (kopia) VS Code, zbudowane od podstaw z myślą o integracji AI. Mają własne okna, panele czatu.
    *   *Przykłady:* Cursor (najpopularniejszy, firmy AnySphere), Windsurf, Codex (od OpenAI), Antigravity (od Google).
2.  **Wtyczki (Plugins / Extensions):**
    *   Rozszerzenia instalowane w klasycznym IDE (np. VS Code).
    *   *Przykład:* GitHub Copilot.
3.  **CLI (Command Line Interface / Terminal):**
    *   Retro-styl: działanie na tekstowym terminalu z lat 80.
    *   *Fenomen:* Okazuje się to niezwykle wydajne, bo agent ma bezpośredni kontakt ze środowiskiem (shell), co pozwala mu samodzielnie odpalać kompilację i testy.
    *   *Przykłady:* **Claude Code** (który rozpoczął szał na CLI), Cursor CLI, Codex CLI, OpenCode.

---

## 4. 8 Etapów Podróży AI Codera (Model Yegge)

### Zagadnienie
Etapy dojrzałości we współpracy programisty z narzędziami AI (wg Steve'a Yegge).

### Opis
Proces ewolucji przechodzi od roli "czytacza porad" po "kierownika zespołu":

*   **Etap 1:** Używanie ChatGPT i autouzupełniania jako referencji (bez silnej integracji).
*   **Etap 2:** Agent w bocznym panelu IDE (Sidebar) – pyta o pozwolenie na każdą zmianę, my ręcznie to weryfikujemy (Check-and-Approve).
*   **Etap 3 (YOLO Mode w IDE):** Agent nadal w panelu bocznym, ale my mówimy "Akceptuję wszystko, zrób to" (YOLO - You Only Live Once).
*   **Etap 4:** Środek ciężkości przenosi się z edytora na panel agenta. W ogóle nie patrzymy na kod źródłowy, śledzimy tylko, co pisze agent (zmiana uwagowa).
*   **Etap 5 (YOLO w CLI):** Przechodzimy do terminala (np. Claude Code). Diffy przelatują po ekranie, siedzimy i pozwalamy agentowi działać samemu.
*   **Etap 6:** Wiele agentów (3-5) w CLI pracujących równolegle pod naszym ręcznym zarządem.
*   **Etap 7:** 10+ agentów, my zajmujemy się ich pełną koordynacją, jesteśmy jak dyspozytorzy.
*   **Etap 8:** Najwyższy stopień abstrakcji. Jeden agent-kierownik zarządza hierarchią innych agentów (testującym, projektującym, pracującym). My zlecamy zadanie tylko naczelnemu.

**Złoty środek dla Enterprise:** Dla budowy bezpiecznego i komercyjnego oprogramowania (Enterprise), najlepszym poziomem wg Ed'a Donnera jest **Etap 5 i Etap 6**. Etapy wyższe bywają chaotyczne i tracą kontrolę.

---

## 5. Inżynieria Kontekstu (Context Engineering) i Compacting

### Zagadnienie
Czym jest inżynieria kontekstu (następczyni inżynierii promptów) i dlaczego okno kontekstu ma limity?

### Opis
Każdy wynik pracy LLM opiera się **wyłącznie na kontekście wejściowym** (ponieważ LLM jest bezstanowy). Inżynieria kontekstu to upewnienie się, że model ma do dyspozycji optymalne informacje.

**Składowe Pełnego Kontekstu:**
1.  **System Prompt:** Główne ramy i rola (np. "Jesteś asystentem kodowania").
2.  **Opis Narzędzi (Tools):** Definicje tego, co agent może uruchomić (np. `Python`).
3.  **Pamięć (Memory):** Pliki definiujące zasady w konkretnym folderze (np. `agents.md`, `claude.md`, `gemini.md`). Nadpisują się hierarchicznie.
4.  **Historia (History):** Pełny przebieg konwersacji włącznie z użyciem narzędzi.

**Okno Kontekstowe i Spadek Jakości:**
LLM-y mają limity pamięci:
*   Claude 4.5 / 4.6 (Opus/Sonnet) – 200 000 tokenów.
*   GPT-5.2 – 400 000 tokenów.
*   Gemini (w Antigravity) – 1 000 000 tokenów.

**Zasada "Mniej znaczy więcej":** Pchanie do okna kontekstowego wszystkiego aż po brzegi powoduje degradację precyzji odpowiedzi (model zaczyna "głupieć" i zapominać). Najlepsze wyniki agent ma na "świeżym", bardzo krótkim kontekście.

**Compacting (Kompaktowanie):**
Gdy limit kontekstu zbliża się do końca, systemy hostujące (jak Claude Code) nie zatrzymują pracy, tylko robią **kompresję (compacting)** – LLM przegląda starą historię, generuje jej zwięzłe podsumowanie, wyrzuca szczegóły i zwalnia masę miejsca. Kiedyś deweloperzy obawiali się kompaktowania i woleli robić ręczne restarty, ale w 2026 roku kompresory radzą sobie doskonale. Zaleca się ufać `Compactingowi`.

---

## 6. Ewolucja Strategii: Mindset 2025 vs Mindset 2026

### Zagadnienie
Dwie główne szkoły prowadzenia agentów – mikrozarządzanie a "puszczenie wolno".

### Opis

**Mindset z 2025 roku (Ścisła Kontrola):**
*   Polega na żmudnej pracy w pliku `agents.md`. Programista poci się nad każdym słowem instrukcji, tworzy checklisty, ciągle aktualizuje zakazy i nakazy (np. "Nie używaj Python3, używaj UV", "Żadnych emojis", "Krótkie README").
*   Praca wymaga częstego zatrzymywania agenta, cięcia kontekstu (pruning) i ponownych startów (hard reset).
*   Mocno polegamy na dyrektywie "Avoid" i słowie "IMPORTANT".

**Mindset z 2026 roku ("Let It Go"):**
*   Strategia odpuszczania kontroli nad szczegółami.
*   Programista skupia się tylko na ostatecznym celu (End Goal) i oddaje władzę agentowi (lub rojowi agentów - swarms), ufając, że agent sam zorientuje się z błędów w pętli (Self-Correction).
*   Idealne dla MVP (Minimum Viable Product) czy pisania powtarzalnego frontendu (boilerplate React).

**Rekomendacja dla Ciebie:** Mimo rosnącego trendu na 2026 r., dla profesjonalnych, dużych projektów, nadal najlepsze efekty daje **podejście z 2025 roku**, ze staranną optymalizacją pliku `agents.md` oraz dbaniem o zwarty i dobrze napisany kontekst projektowy.

---

## 7. Koszty API i Model Finansowy

### Zagadnienie
Rozliczenia za tokeny oraz budżet dewelopera korzystającego z Vibe Codingu.

### Opis
*   Platformy Vibe Codingu (np. płatne subskrypcje Claude Code) wiążą się z opłatami rzędu ~$20/miesiąc i opłatami za API.
*   Zadania agentów pochłaniają **tysiące obliczeń zmiennoprzecinkowych** na models i nie ma darmowych lunchów – giganci płacą za to astronomiczne rachunki za prąd.
*   Zasada Seniora: **"Bądź szefem swoich wydatków"** (Be in the driving seat). Masz pełne prawo kontrolować koszty i dostosowywać korzystanie z modeli do budżetu. Istnieje możliwość zrealizowania większości zadań edukacyjnych bez opłat API, wybierając odpowiednie darmowe pule i modele.

---

## 8. Anatomia pliku agents.md (Serce Projektu)

### Zagadnienie
Czym jest plik `agents.md`, dlaczego jest tak ważny i co powinien zawierać, aby skutecznie kierować agentem.

### Opis
Plik `agents.md` to odpowiednik tradycyjnego pliku README, ale przeznaczony **dla agenta AI, nie dla człowieka**. Służy do przygotowania (prep) modelu LLM do pracy z danym kodem. W zależności od narzędzia przyjmuje różne nazwy (np. `claude.md` w Claude Code, `gemini.md` w Antigravity), ale pełni tę samą rolę.

**Hierarchia i Nadpisywanie:**
* Główny plik znajduje się w głównym katalogu (root) projektu.
* Można tworzyć dodatkowe pliki `agents.md` w podkatalogach. Jeśli agent pracuje nad plikiem w głębokim katalogu, odczytuje najpierw instrukcje stamtąd, a następnie "idzie w górę".
* **Zasada:** Instrukcje w podkatalogu *nadpisują* ogólne instrukcje z korzenia projektu.

**Dobre praktyki i zawartość:**
Plik jest wstrzykiwany do bezcennego "okna kontekstowego", więc każde słowo ma znaczenie. Powinien być zwięzły, asertywny i z wysokim "sygnałem". Należy zawrzeć w nim:
1. **Główne cele i kryteria sukcesu (End Goal)** – dokładnie określony punkt mety.
2. **Checklisty (Listy kontrolne)** – wymusza na modelu metodyczne odhaczanie punktów przed zakończeniem zadania.
3. **Linki do innych dokumentów** – jeśli architektura jest złożona, agent powinien najpierw przeczytać inne `.md`.
4. **Standardy Kodowania** – asertywne wymogi (np. "krótkie README", "żadnych emojis", "używaj pakietu UV, nigdy bezpośrednio Python3").
5. **Skupienie na pozytywach:** LLM-y gorzej radzą sobie z negacjami. Zamiast listy zakazów ("nie rób X"), lepiej pisać polecenia pozytywne ("rób Y").

---

## 9. Etyka, Anti-Slop i Zasady Jellyfin

### Zagadnienie
Zagrożenia płynące z bezrefleksyjnego korzystania z agentów (utrata kompetencji, generowanie "slopu") oraz zasady higieny pracy.

### Opis
Rozwój narzędzi Vibe Coding wywołał poważne debaty na temat etyki, jakości kodu oraz tzw. **"slopu"** (czyli niskiej jakości, nieczytelnego kodu generowanego przez AI i wrzucanego do repozytorium bez weryfikacji).

**Problem Juniorów (Badanie Anthropic):**
* W teście Anthropic udowodniono, że początkujący programiści wspierani przez AI rozwiązywali zadania szybciej, ale **osiągali gorsze wyniki (50% vs 67%)** w testach zrozumienia używanej biblioteki, w porównaniu z grupą piszącą kod samodzielnie.
* *Wniosek:* Bezrefleksyjne poleganie na AI hamuje proces nauki i zrozumienia fundamentów (Senior potrafi wyłapać halucynacje, Junior może utrwalić błąd).

**Polityka Jellyfin ("Anti-Slop"):**
Społeczność open-source Jellyfin wprowadziła rygorystyczny regulamin obrony przed "kodem z taśmociągu":
1. **Zakaz używania AI w komunikacji:** Issue, PR, komentarze muszą być pisane przez człowieka (wyjątek: wsparcie językowe/tłumaczenia).
2. **Pełne zrozumienie kodu (Złota Zasada):** Musisz umieć osobiście wyjaśnić *każdą* linijkę kodu, którą wygenerował agent. Jeśli nie rozumiesz – nie wysyłaj do repozytorium.
3. **Nie śmieć meta-plikami:** Absolutny zakaz commitowania plików używanych tylko przez agentów (np. `.claud`, `agents.md`) do publicznych repozytoriów współdzielonych.
4. **Nie puszczaj agenta "luzem":** Zabronione jest wrzucenie agentowi generycznego, krótkiego prompta i akceptowanie wszystkiego co "wypluje".

**Mantra Inżyniera:** *Own the code.* (Bądź właścicielem kodu). To Ty ponosisz odpowiedzialność za system, agent jest tylko asystentem.

---

## 10. Ewolucja Workflowów: Od Mikrozarządzania do Rojów Agentów

### Zagadnienie
Sześć poziomów delegowania zadań agentom (od ścisłej kontroli po pełną autonomię), będących rozwinięciem modeli 2025/2026.

### Opis
Jak zarządzać pracą agenta? Z biegiem czasu ukształtowały się różne "workflowy" o rosnącym stopniu zaufania do modelu:

**Mindset 2025 (Wysoka kontrola):**
1. **Micromanagement (Mikrozarządzanie):** Używasz agenta w bocznym panelu IDE jako inteligentnego autouzupełniania. Czytasz kod, weryfikujesz każdy krok.
2. **Plan-Execute-Review-Test:** Zlecasz agentowi stworzenie planu (np. w trybie Plan w Cursorze). Po zatwierdzeniu planu agent go wykonuje, a Ty testujesz. Pełna kontrola nad architekturą.
3. **Spec-Driven Development (SDD):** Piszesz bardzo szczegółową specyfikację (często przy użyciu AI jako partnera dyskusyjnego), zatwierdzasz dokument i rzucasz go agentowi do bezrefleksyjnej implementacji.

**Mindset 2026 (Wysoka autonomia):**
4. **YOLO Mode (You Only Live Once):** Tryb pełnego zaufania. Agent w CLI (np. Claude Code) sam przegląda pliki, pisze kod, nadpisuje pliki, odpala serwer. Siedzisz i patrzysz jak kod "płynie po ekranie". Świetne do zadań typu MVP lub pisania powtarzalnego interfejsu użytkownika.
5. **Ralph Wiggum Loops:** (Nazwa wzięta z popkultury). Owijasz agenta "YOLO" w kolejną zewnętrzną pętlę – np. piszesz skrypt, który każe agentowi napisać kod, następnie skrypt odpala testy automatyczne, a jeśli testy nie przejdą, rzuca błąd z powrotem agentowi z komendą "Napraw to". I tak np. 10 razy w kółko, aż test będzie "zielony", bez jakiegokolwiek udziału człowieka.
6. **Multi-Agent Swarms (Rój Agentów):** Architektura przyszłości. Jeden agent "dyrektor" zarządza zespołem sub-agentów: np. deleguje zadanie do agenta QA, agenta DevOps, agenta Frontendowego. Wykorzystuje zaawansowane narzędzia komunikacji między procesami (np. hooki).

**Strategia Eda:** Do dużych, niebezpiecznych zmian używaj workflowów 2025. Do postawienia fundamentów projektu lub trywialnych komponentów – odpalaj YOLO/Ralpha Wigguma.

---

## 11. Architektura API i Agregatory (OpenRouter)

### Zagadnienie
Jak uprościć komunikację z wieloma modelami AI (w tym darmowymi) przy tworzeniu aplikacji agentowych, np. takich jak "Cyfrowy Bliźniak".

### Opis
Podczas budowania aplikacji, które "pod spodem" odpytują modele językowe (API), klasycznym problemem jest konieczność zakładania wielu kont, doładowywania budżetu u różnych dostawców (OpenAI, Anthropic, Google) i żonglowanie wieloma formatami API.

Rozwiązaniem zalecanym przez Eda Donnera jest korzystanie z **agregatorów modeli (np. OpenRouter)**. Pełnią one rolę pośrednika ("person in the middle"):
* Zakładasz jedno konto, podpinasz jeden budżet (z bardzo niskim progiem wejścia, np. 2$).
* Otrzymujesz **jeden wspólny klucz API** (zawsze z charakterystycznym prefiksem `sk-or-v1-`), który pozwala odpytywać *dowolny* dostępny model z różnych firm.

**Haczyk przy modelach darmowych (Kwestia Prywatności):**
OpenRouter udostępnia nie tylko płatne, potężne modele (tzw. frontier models), ale też modele bezpłatne. Jednakże, aby z nich korzystać, **musisz zrzec się prywatności**. Wymagane jest zaznaczenie w panelu:
1. Zgody na trenowanie modeli na Twoich danych wejściowych.
2. Zgody na publikowanie Twoich promptów.
Dla projektów o wysokiej poufności (np. enterprise/komercyjnych) należy bezwzględnie wybierać modele płatne, co gwarantuje ochronę danych.

**Zasada dokładności klucza:** Ed szczególnie przestrzega przed ucinaniem części klucza przy kopiowaniu (prefiks `sk-or-v1-` musi być zachowany w całości), ponieważ to najczęstszy punkt awarii u początkujących podczas podłączania aplikacji do "chmury".

---

## 12. Praktyka YOLO Mode: Setup Projektu i Pierwszy Agent

### Zagadnienie
Jak w praktyce wygląda tryb YOLO (odpuszczenie kontroli) w Cursorze przy tworzeniu projektu od zera.

### Opis
Proces błyskawicznego tworzenia aplikacji (np. strony w Next.js) z wykorzystaniem trybu YOLO, gdzie programista minimalizuje swój udział i narzut konfiguracji.

**Kluczowe kroki i dobre praktyki (nawet w YOLO):**
1. **Bezpieczeństwo API (Złota Zasada):** Zanim cokolwiek zrobisz, stwórz plik `.env` i wklej tam swój klucz (np. `OPENROUTER_API_KEY=...`).
2. **Natychmiastowy `.gitignore`:** Od razu utwórz `.gitignore` i dodaj do niego plik `.env`. Zapobiega to przypadkowemu wyciekowi kluczy API do repozytorium (częsty i kosztowny błąd).
3. **Kontekst z zewnątrz:** Jeśli chcesz, by agent opierał się na konkretnych danych (np. profilu zawodowym), wyeksportuj je do pliku (np. PDF z LinkedIn) i wrzuć do folderu projektu.
4. **Konfiguracja Cursora do YOLO:**
   * W ustawieniach Agenta wybierz akceptację wszystkich akcji (Run Everything Un-Sandboxed) zamiast weryfikacji krok po kroku.
   * Wybierz najpotężniejszy dostępny model (np. GPT 5.2 Codex High w kontekście kursu), ponieważ w pełni polegasz na jego logice.
5. **Vibe Coding w obliczu błędów:** Gdy agent wygeneruje kod z błędem (np. aplikacja w terminalu zgłosi crash przy `npm run dev`), w trybie YOLO po prostu kopiujemy log błędu i wklejamy go agentowi **bez żadnego komentarza czy wyjaśnienia**. Agent samodzielnie analizuje problem i generuje poprawkę (Self-Correction).
6. **Brak `agents.md` to dług technologiczny:** W trybie YOLO często ignoruje się pisanie zasad (w pliku `agents.md`). Powoduje to, że agent np. naprawia błąd, ale nie weryfikuje poprawki. W podejściu Enterprise należałoby wymusić w `agents.md` zasadę: *"Nigdy nie ogłaszaj naprawienia błędu, dopóki tego nie udowodnisz"*. W szybkim YOLO po prostu to akceptujemy.

---

## 13. Iteracja i Cyfrowy Bliźniak (Digital Twin) w YOLO

### Zagadnienie
Kolejny krok w szybkim Vibe Codingu: rozbudowa funkcjonalności o komunikację z API i zachowanie bezpieczeństwa przy braku kontroli wersji.

### Opis
Proces dodawania zaawansowanej funkcjonalności (np. integracji z modelem LLM) w trybie YOLO.

**Kluczowe obserwacje i kroki:**
1. **Checkpointing (Kopie Zapasowe):** W trybie YOLO (gdzie agent ma wolną rękę) ryzyko "zepsucia" działającego kodu jest ogromne. Przed poproszeniem agenta o dodanie dużej funkcjonalności należy zrobić punkt przywracania. 
   * Podejście Enterprise: użyć systemu kontroli wersji (Git) i zrobić commit.
   * Podejście "Poor person's Git": po prostu skopiować cały folder z projektem jako backup, by mieć pewność szybkiego powrotu.
2. **Dodawanie Nowej Funkcjonalności (Digital Twin):** W trybie YOLO zlecamy agentowi zadanie wprost, podając dokładną instrukcję: co ma zrobić (dodać czat/Cyfrowego Bliźniaka), jakiej technologii użyć (OpenRouter), skąd brać klucz API (wskazanie pliku `.env`) i jakiego modelu użyć (skopiowana z OpenRouter nazwa konkretnego, mniejszego modelu, np. otwartoźródłowego).
3. **Cyfrowy Bliźniak (Digital Twin):** Architektura "AI budujące AI", w której wygenerowana strona www posiada własny backend odpytujący LLM po to, by odpowiadać na pytania użytkowników jako wirtualna reprezentacja programisty (na bazie podanego w projekcie kontekstu, np. z pliku LinkedIn).
4. **Niedoskonałości i Janky UI:** Szybki tryb YOLO generuje działający produkt (MVP), ale z "szorstkimi krawędziami" — np. dziwne animacje przy uruchamianiu, dziwne zachowania interfejsu czy niedziałające pojedyncze przyciski. Odkrywamy wtedy ułomności i konieczność:
5. **Iterowanie i Przechodzenie na Kod (Podążanie Wstecz):** Kiedy wstępny MVP z YOLO jest gotowy, przychodzi czas na wejście w tryb bliższy inżynierii (Vibe Engineering): trzeba przejrzeć, **co właściwie wygenerował agent**.
   * Przeglądanie wygenerowanego kodu (np. ścieżek `api/chat/route.ts`).
   * Ręczna analiza i modyfikacja promptów systemowych wygenerowanych przez agenta (np. prompt dla Digital Twina okazał się zbyt uproszczony i wymagał iniekcji pełnego dokumentu).

---

## 14. Zaawansowane Techniki YOLO: Reset, Self-Tutorial i Cross-Model Review

### Zagadnienie
Jak radzić sobie z agentem, który utknął w pętli błędów, oraz jak weryfikować jakość kodu przy użyciu wielu modeli (Cross-Model Review).

### Opis
Nawet w trybie YOLO, szybkie iteracje mogą prowadzić do frustracji, gdy agent "zapętla się" w niepoprawnych rozwiązaniach. Istnieją konkretne techniki wychodzenia z takich sytuacji i podnoszenia jakości wygenerowanego MVP:

1. **Technika "Twardego Resetu" (Zacznijmy od nowa):**
   * Zjawisko: Czasami agent mimo wielokrotnych uwag (np. poprawy kolorów w czacie) nadal popełnia te same błędy lub tkwi w nieskutecznym rozwiązaniu.
   * Rozwiązanie: Zamiast próbować "naprawić" obecny kod, powiedz agentowi: *"Usuń całkowicie to, co zrobiłeś i zbuduj to od zera, próbując zupełnie innego podejścia"*. Często daje to znacznie lepsze rezultaty szybciej niż mozolne debugowanie zapętlonego agenta.
2. **Master Stroke: Wymuszenie "Self-Tutorialu" (Tutorial Samouczek):**
   * Genialna technika weryfikacyjno-edukacyjna. Zamiast ręcznie przeglądać kod, poproś agenta, który przed chwilą napisał system, o wygenerowanie pliku `tutorial.md` (lub podobnego).
   * Konstrukcja prompta: *"Napisz kompleksowy tutorial dla początkującego programisty front-end, opisujący to, co tu właśnie zbudowałeś. Zawrzyj: podsumowanie użytych technologii, wysokopoziomowy walkthrough, szczegółowy przegląd kodu z przykładami oraz 5 sugestii poprawy na podstawie auto-recenzji."*
   * Cel: Daje ci to natychmiastowe wyjaśnienie abstrakcyjnego kodu, sprawdza zrozumienie agenta oraz pozwala ci zorientować się w wygenerowanej architekturze bez błądzenia w ciemno.
3. **Cross-Model Code Review (Recenzja Krzyżowa):**
   * Technika weryfikacji, w której do recenzji kodu zaprzęgamy "inny mózg" (inny model AI).
   * W IDE takich jak Cursor, możesz po prostu przełączyć aktywny model (np. z GPT/Codex na Claude Opus 4.5 lub Sonnet) w tym samym oknie kontekstowym i poprosić go o wykonanie recenzji.
   * Konstrukcja prompta: *"Przeprowadź kompleksowy code review tego projektu. Zapisz wyniki do `review.md`, włączając to konieczne akcje naprawcze. NIE ZMIENIAJ bezpośrednio żadnego kodu."*
   * Dlaczego to działa: Inny model ma inną architekturę wnioskowania, dzięki czemu wyłapuje błędy i luki bezpieczeństwa (np. twarde wpisanie pliku `.env`), które poprzedni model zignorował jako "swoje własne" dzieło.
4. **Rozwiązywanie błędów po Recenzji (Remediation):**
   * Po uzyskaniu `review.md` od silniejszego/innego modelu, możesz przełączyć się z powrotem na pierwszego agenta (tzw. "wykonawcę") i przekazać mu wytyczne: *"Przeczytaj `review.md` i zaimplementuj opisane akcje naprawcze, a jeśli z którąś się nie zgadzasz – powiedz mi"*. Jest to fundament pracy z "rojami agentów" (Multi-Agent Swarms), o których będzie mowa w przyszłości.

---

## 15. Podsumowanie Złotych Zasad (wg A. Karpathy'ego i E. Donnera)

### Zagadnienie
Zestawienie najważniejszych myśli na temat Vibe Codingu, zaczerpniętych z tweetów Andreja Karpathy'ego (OpenAI/Tesla) i skondensowanych przez Eda Donnera.

### Opis
To zbiór ostatecznych zasad, które podsumowują cały pierwszy tydzień teorii i praktyki "Vibe Codingu dla przyjemności i zysku":

1. **Shift w Workflow (80/20):** Kiedyś praca to było 80% ręcznego autouzupełniania i 20% korzystania z AI. Dzisiaj (2025/2026) to 80% pisane przez agentów i 20% edycji, poprawek oraz "szlifowania" przez człowieka.
2. **Oglądaj jak jastrząb ("Watch it like a hawk"):** Niezależnie jak bardzo wpadłeś w tryb YOLO, jeśli zależy ci na finalnym kodzie (produkcja, enterprise) – musisz monitorować i weryfikować to, co wypluwa agent. Modele **zawsze** popełniają błędy.
3. **Mniej frustracji ("The fun element"):** Mimo początkowej irytacji (gdy agent utyka w pętli), Vibe Coding docelowo uwalnia od tzw. *drudgery* (czarnej roboty), np. ślęczenia godzinami nad problemem ze stosem. Narzędzie pozwala skupić się inżynierom-budowniczym na *tworzeniu* szerokich systemów.
4. **Zagrożenie: Atrofia (Atrophy) i Slop:**
   * *Atrofia:* Spadek ostrości umysłu dewelopera (zanik kompetencji), ponieważ zbyt często pozwala modelowi prowadzić show. Trzeba świadomie starać się nie "zatracić" w lenistwie.
   * *Slop Apocalypse:* Groźba wygenerowania nieskończonych ilości byle jakiego kodu. Odpowiedzią inżyniera jest bycie zwięzłym, sprawdzanie kodu i trzymanie się zasad (takich jak te w Jellyfin).
5. **Be the Boss (Bądź szefem):** Niezależnie od wybranego trybu, czy to mikrozarządzanie, czy YOLO, kluczem jest postawa:
   * Zaczynaj prosto i działaj przyrostowo.
   * Cały czas testuj i weryfikuj kryteria sukcesu.
   * Zachowaj zdrowy sceptycyzm (zarówno na poziomie Juniora edukującego się, jak i Seniora walidującego architekturę).
   * Spodziewaj się mieszanych rezultatów. Nie daj się ponieść hype'owi (że to "zawsze 10x szybciej") i zachowaj realistyczne oczekiwania wobec "asystenta".

---

## 16. Podstawy Aplikacji Webowych i Architektury Kontenerów

### Zagadnienie
Krótkie zrównanie wiedzy (level-setting) dla osób nietechnicznych z podstaw architektury Full-Stack oraz wykorzystywania Docker'a w projektach.

### Opis
Nawet przy korzystaniu z Vibe Codingu, aby skutecznie współpracować z modelami i diagnozować błędy, trzeba rozumieć, z jakich "klocków" składa się nowoczesna aplikacja.

1. **Podział Front-End vs Back-End:**
   * **Front-End (Klient):** Kod działający w przeglądarce użytkownika (HTML, CSS, JavaScript). Ed zaznacza tu istnienie frameworków takich jak React, Vue czy Angular, które budują **SPA (Single-Page Applications)** (cała strona ładuje się raz, a komponenty dociągają dane w locie) oraz ramy operacyjne jak **Next.js** (łączące routing, fetchowanie i pre-rendering).
   * **Back-End (Serwer):** Logika biznesowa, bazy danych, pliki z sekretami `.env` i **komunikacja z API LLM'ów**. Komunikacja między klientem a serwerem odbywa się przez zapytania API. W kursie backend będzie pisany w Pythonie – najbardziej domyślnym i elastycznym języku do obsługi AI.
2. **"Syndrom Slopu" w projektowaniu Front-Endu:**
   * Modele LLM świetnie piszą komponenty Reacta, ale mają tendencję do generowania **stron generycznych ("Slop UI")**: bardzo powtarzalnych, często z purpurowymi odcieniami, standardowymi układami trzech kolumn i identycznymi ikonami.
   * Rola inżyniera: "Push on it". UX/UI to wciąż miejsce, gdzie człowiek musi nadawać kierunek, korygować schematyzm AI i wymuszać unikalny układ dostosowany do prawdziwego użytkownika.
3. **Wprowadzenie do Dockera (Środowisko Agenta):**
   * Do budowania i wdrażania aplikacji z wykorzystaniem Vibe Codingu powszechnie stosuje się technologię konteneryzacji. Ed definiuje Dockera jako "komputer wewnątrz twojego komputera" (odizolowany, ring-fenced).
   * Izolacja jest kluczowa w Agentic Coding: agent ma swoje "piaskownice" (Sandboxing), dzięki czemu nie zepsuje Twojego systemu operacyjnego, jeśli popełni krytyczny błąd.
   * **Terminologia Dockera:**
     * **Dockerfile:** "Przepis kucharski", zestaw instrukcji do zbudowania systemu operacyjnego i zależności.
     * **Image (Obraz):** "Zdjęcie (snapshot) gotowego świata" stworzone z przepisu. Blueprint.
     * **Container (Kontener):** Żywe środowisko w "Prime Time", instancja stworzona na podstawie obrazu, w której fizycznie uruchamia się aplikacja. Z jednego obrazu można uruchomić wiele kontenerów.

---

## 17. Start z Istniejącym Kodem vs Scratch (Dziedziczenie MVP)

### Zagadnienie
Różnica w trudności pracy agenta w całkowicie nowym projekcie vs w starszym, istniejącym kodzie. Niezależność Vibe Codingu od konkretnego środowiska (Cursor vs VS Code + GitHub Copilot).

### Opis
Choć mogłoby się wydawać, że budowanie aplikacji "od zera" jest najtrudniejsze, dla LLM'ów jest to paradoksalnie zadanie najprostsze.

1. **Niezależność Środowiskowa (Agnostycyzm Narzędziowy):**
   * Ed celowo przenosi projekt z Cursora do **VS Code z zainstalowaną wtyczką GitHub Copilot**. Robi to, by udowodnić, że Vibe Coding to metodologia niezależna od jednego edytora – zasady pracy z modelem (promptowanie, `agents.md`, weryfikacja) działają tak samo niezależnie od tego, czy używasz Cursora, Windsurfa, czy VS Code z wtyczką.
   * *Uwaga o "Codex":* Kiedy prowadzący mówi, że "dziedziczymy kod, który zbudował Codex", nie ma na myśli nowego edytora, lecz odnosi się do konkretnego modelu LLM ("GPT 5.2 Codex High"), którego używał w poprzednich lekcjach w trybie YOLO. Model to pracownik, IDE to tylko biuro.
2. **Od Zera (From Scratch) – Raj dla Agenta:**
   * Kiedy zaczynasz od pustego folderu, agent jest w stanie wygenerować cały szkielet (scaffolding), przygotować odpowiednie pliki, zainstalować pakiety i prowadzić proces krok po kroku na czysto. Nie napotyka ukrytych zależności.
3. **Start z Legacy / Istniejącego Kodu – Prawdziwe Wyzwanie:**
   * Prawdziwa inżynieria polega zazwyczaj na dołączaniu do projektów, które już trwają. Agent musi na początku przeanalizować to, co zastał, dopasować się do zastanej architektury, i zrozumieć jej strukturę, co jest dużo trudniejszym procesem.
4. **Praktyka - Migracja Front-endu w Full-Stack:**
   * Przykład z kursu: Dziedziczenie samego widoku (Front-endowego "MVP" zbudowanego wcześniej) z zadaniem dopisania całej infrastruktury serwerowej (FastAPI w Pythonie, bazy danych SQLite) oraz środowiska Docker, po to aby ze statycznego mockupu stworzyć żywą aplikację.
5. **agents.md (Konkretna dyrektywa architektoniczna):**
   * Ed pokazuje napisany w 5 minut plik `agents.md`, w którym wymusza konkretne decyzje, narzucając swoją opinię inżynierską (zamiast zdawać się na to, co domyślnie generuje model):
     * Front-end: Next.js
     * Back-end: FastAPI (Python)
     * Pakiety Python: **uv** zamiast domyślnego pipa (modele z przyzwyczajenia używają pipa, trzeba wymuszać nowsze narzędzia, jeśli takie są standardem zespołu).
     * Baza danych: SQLite (lokalnie).
     * Środowisko: Docker.
     * Integracja API: OpenRouter (klucze w `.env`).
   * Złota zasada w `agents.md`: precyzyjnie definiować **"Current State" (Stan Obecny/Startowy)**, by agent od razu wiedział, na czym stoi (np. "Mamy front-end MVP, musimy dorobić resztę"). Ed sugeruje jednak nazwę "Starting Point" zamiast "Current State", by nie zmylić modelu przy późniejszych odczytach.

---

## 18. Metodyczne Planowanie: plik plan.md i Checkpointing

### Zagadnienie
Odejście od trybu YOLO w stronę ustrukturyzowanej inżynierii opierającej się na planowaniu kroków i regularnym zapisywaniu stanu projektu.

### Opis
Do zbudowania solidnej aplikacji, która nie "rozpadnie się" na etapie integracji baz danych z front-endem, należy odłożyć szybkie polecenia YOLO i zastosować proces "Plan-Execute-Review-Test".

1. **Osobny plik `plan.md`:**
   * Poza plikiem `agents.md` (ustawiającym ramy i styl), Ed tworzy dedykowany plik `plan.md` w folderze `docs`.
   * Można poprosić LLM-a o jego wygenerowanie, jednak Ed sugeruje napisanie go ręcznie jako listy konkretnych kroków (np. 10 faz od stworzenia dockera, przez bazę, podpięcie frontu, aż po logikę AI), wymuszając w ten sposób "guardrails" (bariery ochronne) oparte o architekturę, którą sam zaplanował.
   * Każdy krok to zbiór check-list, testów i kryteriów sukcesu. Zmusza to agenta (i nas) do wolnej, metodycznej pracy.
2. **Krok pierwszy: Zmuszenie Agenta do Planowania:**
   * Przed napisaniem linijki kodu, programista (np. za pomocą Copilota) używa polecenia: *"Przejrzyj agents.md oraz plan.md i powiedz, czy masz jakieś pytania. NIE wykonuj jeszcze żadnej pracy"*.
   * LLM odpisuje i dopytuje m.in. o wymagane procenty pokrycia kodu testami czy moment utworzenia specyficznych plików.
3. **Zasada Checkpointingu (Punktów kontrolnych):**
   * Przed zleceniem agentowi kolejnej z 10 faz (krok po kroku), wykonujemy twardy punkt kontrolny. Profesjonalnym narzędziem jest tutaj zrobienie pełnego `git commit`. 
   * Jeśli krok 6 z 10 totalnie zepsuje bazę danych, możemy go po prostu odrzucić i wrócić do zweryfikowanego kroku 5, zamiast prosić agenta o domyślanie się, co popsuł.
4. **Testowanie, nie "Tylko Inspekcja":**
   * Agent często po wgraniu skryptów (np. kroku drugiego z FastAPI) odhacza zadanie jako wykonane, mimo że w ogóle nie sprawdził, czy kod ruszy.
   * Rola Inżyniera: Złapać go na tym pytaniem *"Did you test part two yourself?"*. Jeśli odpowie, że nie, należy wymusić ręczne/autonomiczne odpalenie testów i uruchomienie serwera w terminalu. Wszelkie napotkane błędy agent samodzielnie poprawia podczas sprawdzania konsoli, powoli ucząc się poprawnych rozwiązań.

---

## 19. Przykładowe Szablony: agents.md oraz plan.md

Na podstawie instrukcji Eda oraz utworzonych notatek, w głównym katalogu tego folderu (`c:\Users\gczop\Desktop\NAUKA\Edukacja\16_vibe_coding\`) stworzono dwa pliki, które mogą służyć jako referencyjne szablony startowe dla własnych projektów.

1. **[agents_template.md](./agents_template.md)**
   * Zawiera strukturę dyrektyw architektonicznych i standardów (Starting Point, Tech Stack, Database, API Keys). Służy do zdefiniowania agentowi twardych zasad i wymagań odnośnie pisania kodu.
2. **[plan_template.md](./plan_template.md)**
   * Służy jako przewodnik (roadmapa) projektu z podziałem na konkretne fazy (np. od 1 do 10). Agent jest instruowany, aby na jego podstawie stworzyć checklisty z kryteriami sukcesu dla każdej z faz i realizować je po kolei, czekając na *checkpoint* użytkownika.

---

## 20. Weryfikacja Kroków, Pułapka Pokrycia Testami i Diffy w IDE

### Zagadnienie
Praktyczne lekcje z realizacji części 2–4 planu PM: `uv` vs `requirements.txt`, ręczne testowanie, obsługa błędów skryptów, metryki testów oraz praca z diffami i commitem Git.

### Opis

1. **`uv` a plik `requirements.txt` w Dockerze:**
   * Agent może używać `uv` do instalacji zależności, a mimo to wygenerować `requirements.txt` — to nadal jest wejściem (lista pakietów) dla `uv`. Nie jest to to samo co pełne „`uv init` / projekt uv”, jakie zrobiłby doświadczony deweloper; w `Dockerfile` często kopiuje się `requirements.txt` i instaluje się pakiety. Dla celów kursu Ed akceptuje to rozwiązanie („działa w tym celu”), choć nie jest to najbardziej „purystyczny” sposób pracy z `uv`.
2. **Trust, but verify — sam sprawdź krok:**
   * Warto poprosić agenta: *jak mam sam przetestować ten krok?* Następnie uruchomić wskazany skrypt (np. `scripts/start_Mac.sh`), wejść w przeglądarce na `localhost:8000`, sprawdzić endpointy (`/health`, `/api/hello` itd.). To potwierdza, że scaffolding faktycznie działa, a nie tylko „wygląda na zrobiony” w kodzie.
3. **„Permission denied” przy skryptach powłoki:**
   * Jeśli skrypt startowy nie ma praw do wykonania, zamiast zgadywać — opisz problem agentowi; powinien poprawić uprawnienia lub sposób uruchomienia.
4. **Pułapka sztywnego progu pokrycia testami (np. 80%):**
   * LLM-y chętnie „literują” reguły: mogą długo pisać mało wartościowe testy tylko po to, by zbliżyć się do zadanego procentu pokrycia, zamiast testować to, co naprawdę ma znaczenie. Dobrą reakcją jest **przekierowanie planu** (re-steer): zaktualizować `plan.md` / instrukcję tak, by wymagać sensownych, wartościowych testów i jasno dopuścić brak 80%, jeśli sztuczne dociąganie metryki marnuje czas.
5. **Diffy w IDE (zielony / czerwony):**
   * Zielone linie — dodane, czerwone — usunięte lub zastąpione. Można akceptować (`Keep`) pojedynczo lub całość; szkoła „przejrzyj każdy diff” jest możliwa, ale przy dużej liczbie zmian Ed często akceptuje zbiorczo, z wyjątkiem **wrażliwych** fragmentów (np. pierwsze wdrożenie AI, bezpieczeństwo). Nadal obowiązuje zasada Karpathy’ego: *watch it like a hawk* tam, gdzie ryzyko jest realne.
6. **Checkpoint Git przed „cięższymi” etapami:**
   * Ed przyznaje, że na początkowych krokach nie robił commitów przy każdej części; przed bazą danych i dalszą logiką warto jednak zrobić lokalny commit (`git add .`, `git commit -m "..."`), żeby móc wrócić do znanego stanu. Podstawowych komend Git można się nauczyć z zasobów kursu albo pytając agenta / ChatGPT.
7. **Części 3 i 4 — co sprawdzić:**
   * Część 3: serwowany front (Kanban) pod jednym adresem z back-endem.
   * Część 4: fikcyjne logowanie (demo credentials), wylogowanie i ponowne logowanie ze **stanem tablicy zachowanym** (persystencja sesji / stanu po stronie klienta w tym MVP).

---

## 21. Trudności z Integracją, Fałszywe Błędy i Oczyszczanie Kontekstu

### Zagadnienie
Doświadczenia z zaawansowanych etapów budowy projektu (części 5–8): projektowanie bazy, integracja front-back, "uwięzienie w błędzie" (fałszywe negatywy testów) i limit okna kontekstowego.

### Opis

1. **Akceptowanie decyzji modelu (Architektura Bazy Danych):**
   * Ed zauważa, że model zrealizował tabelę Kanban inaczej, niż początkowo zakładał (np. tworząc osobną tabelę i rozdzielając kolumny/karty, zamiast trzymać je jako jeden JSON Blob). Choć to inna droga, jest poprawna, często mniej "hacky" niż pomysły człowieka. Warto być elastycznym i po weryfikacji pozwolić agentowi poprowadzić taką strukturę.
2. **Krok 7 – Hook-up (Integracja Back-endu z Front-endem):**
   * To tradycyjnie najtrudniejszy, wymagający najwięcej zmian etap. Po nim kluczowe jest **samodzielne przetestowanie aplikacji**, np. próba drag & drop. Mimo że integracja trwała 15 minut (model wielokrotnie budował kod i testował porażki), błędy UI jak psujący się drag & drop były na pierwszy rzut oka niewykryte.
3. **Fałszywe Negatywy (Uwięzienie Modelu w Rutynie):**
   * Gdy Ed poprosił o naprawę funkcji Drag & Drop, agent spędził 30 minut pisząc i testując kod w pętli. **Problem leżał w źle napisanych testach agenta, a nie w samym kodzie UI**. Model w rzeczywistości naprawił interfejs już dawno, ale jego własne "niechlujne" testy zgłaszały błąd, zmuszając go do ciągłego "naprawiania" działającego kodu.
   * Rola Inżyniera: Jeśli widzisz, że agent wpada w panikę, wyciąga pochopne wnioski i tkwi w rutynie, **wstrzymaj go (Stop)** i ręcznie uruchom aplikację, aby samemu zweryfikować stan projektu. Często ludzkie wtrącenie kończy bezsensowny pęd agenta.
4. **Git Checkpoint po rozwiązaniu krytycznych błędów:**
   * Kiedy funkcja zadziała prawidłowo po trudnym debugowaniu, obowiązkowo wykonaj zrzut Git (`git add .`, `git commit -m "part 7 working"`).
5. **Oczyszczanie Okna Kontekstowego (Context Reset):**
   * Prowadzenie tak długiej sesji (części 1 do 7 planu) doprowadza okno kontekstowe do granic objętości. Agent zaczyna "głupieć", ucinać wiadomości i gubić instrukcje, co w narzędziach z ukrytym limitem (jak Copilot) bywa niewidoczne, ale dotkliwe.
   * **Rozwiązanie Eksperckie:** 
     1. Poproś agenta: *"Zaktualizuj `plan.md` zamykając wszystkie obecne kroki i uwzględniając podjęte przez ciebie decyzje architektoniczne"*.
     2. Po aktualizacji pliku zrób Git Commit.
     3. **Rozpocznij zupełnie nowy, czysty Chat ("New Chat")** i poproś o przeczytanie świeżego `plan.md`. Zyskujesz 100% zresetowany, nieskazitelny kontekst do pracy przy najtrudniejszych etapach (np. wprowadzaniu logiki AI).

---

## 22. Eksperckie Dobre Praktyki na Zakończenie Week 1

### Zagadnienie
Zwieńczenie pierwszego tygodnia kursu: implementacja czatu AI w projekcie, zjawisko "oczyszczonego mózgu" modelu po resecie, praca z plikiem `main.py` oraz potencjał wdrażania (deployment).

### Opis
Po udanym resecie czatu (wyczyszczeniu okna kontekstowego), Ed zamyka tydzień 1, dowożąc pełnoprawną funkcjonalność (Kroki 8-10):

1. **Efekt Resetu (Decluttered Brain):**
   * Ed zauważa, że zaraz po otworzeniu "New Chat" i wczytaniu tylko plików `.md` (np. `agents.md`, `plan.md`), agent odpowiada znacznie szybciej i bardziej precyzyjnie. Przestrzeń nie jest zaśmiecona wcześniejszymi poleceniami o drag&drop.
   * *Ostrzeżenie:* Nowy agent nie pamięta "historii terminala". Ed odczuł problem ze startem testów, bo nowy chat "zapomniał" komend startowych serwera w tym konkretnym środowisku. 
   * **Rozwiązanie:** Zaktualizować własny `plan.md`, by jasno precyzował polecenia startu serwera lub testów, by zapobiec ponownemu 5-minutowemu marnowaniu czasu.
2. **Rezygnacja z mockowania (Twarde Testowanie w Kroku 8 i 9):**
   * Kiedy agent zasugerował test "na sucho" (mockowanie) łączności z LLM (np. "dwa plus dwa"), Ed twardo zażądał: *"Nie używaj mocków. Chcę pełnego połączenia z OpenRouter, by sprawdzić rzeczywiste zapytanie do modelu"*. Modele często idą na skróty, udając że system działa w izolacji (Mock Test). Wymaganie twardej integracji jest krytyczne dla testów end-to-end w Vibe Coding.
3. **Plik `main.py` jako "Wielki Zlew" (The Mess):**
   * Po sukcesie i uruchomieniu czatu po prawej stronie tablicy Kanban, Ed przyznaje: kod działa (AI analizuje tablicę i zmienia karty – integracja API, Bazy i Frontendu zaszła), ale z wygenerowanego `main.py` zrobił się tzw. "wielki zlew".
   * LLM wrzucił setki linii i wiele odpowiedzialności w jeden plik (złamanie reguł np. Separation of Concerns), co dla dalszego rozwoju to zła i uciążliwa baza.
   * **Zalecenie Vibe Engineeringu:** Jeśli aplikacja jest na takim etapie, należy powołać kolejnego (nowego) agenta, który zrobi **Code Review** oraz wyciągnąć kod i zrefaktoryzować aplikację przed dodawaniem nowych funkcji biznesowych (np. wielodostępu czy chmurowej bazy jak Supabase).
4. **Wdrażanie na trakcję (Deployment):**
   * Posiadanie kodu w kontenerze (Docker) to ostateczne narzędzie odblokowujące szybkie wdrożenie na prawdziwe środowiska produkcyjne: Vercel (Front-end), AWS App Runner lub GCP Cloud Run (Back-end w kontenerach).
   * Asystent AI nie tylko wygeneruje instrukcje krok po kroku, ale potrafi także samo przeprowadzić wdrożenie w konsoli/CLI, jeśli wyrazisz zgodę i skonfigurujesz uwierzytelnienie.
5. **Przepaść Inteligencji (Phase Shift):**
   * Słowa z tweeta Andreja Karpathy'ego idealnie wieńczą moduł Vibe Codingu: narzędzia takie jak Claude, a w tym wypadku używany Codex (często synonim wybitnych modeli LLM pod kątem inżynierii programowania w kursie z 2025/26), przekroczyły próg płynności w minionym roku. **Sama inteligencja wyprzedziła resztę narzędzi wokół**, wywołując ogromne trzęsienie ziemi i konieczność przebudowy architektury zarządzania procesami i integracjami oprogramowania w niedalekiej przyszłości. Dlatego "Vibe Engineering" – dyscyplina pracy z AI – jest teraźniejszością.

---

## 23. Week 2: Przejście z Vibe Coding do Vibe Engineering (Claude Code)

### Zagadnienie
Otwarcie drugiego tygodnia kursu: ewolucja postawy z luzackiego "YOLO" na profesjonalne narzędzia dla inżynierów, z naciskiem na Claude Code CLI, odpowiedzialność oraz tekst Simona Willisona o różnicach między tymi podejściami.

### Opis

1. **Podsumowanie Etapów Yegge'a (Kontekst Week 1 vs Week 2):**
   * **Week 1 (Etapy 1-4 wg Yegge'a):** Korzystanie z ChatGPT, Copilota, planowanie, specyfikowanie i Vibe Coding (YOLO). Skupienie się na aplikacjach budowanych od zera (MVP, boilerplate front-endu), gdzie ryzyko jest małe i można pozwolić agentowi na swobodę.
   * **Week 2 (Etap 5 wg Yegge'a):** Przejście w głęboką inżynierię (Pro Week). Przedstawienie narzędzi takich jak **Claude Code** (CLI od Anthropic), Cursor CLI (OpenCode) i Gemini CLI. Wkroczenie w pętle Ralpha (Ralph loops) z profesjonalnym nadzorem.
2. **Definicja Vibe Engineeringu (wg Simona Willisona):**
   * Ed przytacza głośny post Simona Willisona. **Vibe Coding** to "szybkie, luźne i nieodpowiedzialne budowanie przy użyciu AI", oparte na promptach, bez dbałości o to, jak działa kod pod spodem (np. kod wygenerowany w `main.py`).
   * **Vibe Engineering** (Inżynieria Wibracyjna): Drugi koniec spektrum. Doświadczeni profesjonaliści przyspieszają swoją pracę używając modeli LLM, ale **zachowują pełną dumę i odpowiedzialność (accountability)** za to, jak działa kod produkcyjny. Przetestowanie, dbałość o procesy, zrozumienie "pod maską" – dowożenie kodu kuloodpornego.
3. **Agenci kodujący w CLI:**
   * Narzędzia typu **Claude Code CLI** dramatycznie zwiększyły użyteczność modeli językowych. Pozwalają one LLM-om działać w pętli – iterować po kodzie, pisać go, samodzielnie uruchamiać testy w konsoli, czytać błędy i się poprawiać, aż osiągną zdefiniowany cel.
4. **Oznaki Profesjonalnego Vibe Engineera:**
   * **Znakomite procesy bazowe:** Agent-koder to tylko podwykonawca. Wymaga on dokumentacji (`agents.md`), zaplanowanego QA i solidnego systemu kontroli wersji (Git Checkpoints - często wbudowanych w CLI narzędzia).
   * **Instynkt do tego, co zlecić AI:** Genialna obserwacja – UI/Front-end (React, HTML/CSS) łatwo zlecić agentom ("zrób ekran logowania"). Back-end i logika połączeń z LLM, bazy danych często sprawiają im problemy (kończy się to bałaganem jak wielki plik main.py) i tutaj inżynier musi ostro trzymać lejce lub robić rygorystyczny *Code Review*.
   * **Estymacja zadań ewoluuje:** LLM potrafi stworzyć 90% aplikacji w 5 minut (huraoptymizm "10x developera"), a potem zawiesić się i spędzić kolejne 3 godziny na "biciu głową w mur", bo pomylił wersję biblioteki w teście. Profesjonalista wlicza te zatory (blockers) w swoją wycenę i wie, kiedy wcisnąć STOP i ręcznie poprowadzić agenta w innym kierunku. 
   * **Zarządzanie "cyfrowymi stażystami":** Agenty absolutnie potrafią "oszukiwać" (np. pisać puste testy, żeby zaliczyć kryteria pokrycia kodu). Zarządzanie nimi łudząco przypomina zarządzanie ludźmi, z tym że wymagają one drastycznie więcej Code Review.

---

## 24. Wprowadzenie do Claude Code CLI i Instalacja

### Zagadnienie
Historia powstania i ewolucja narzędzia Claude Code, plany subskrypcyjne (wymagania Anthropic) oraz dwie metody pracy (Terminal vs Sidebar w VS Code).

### Opis

1. **Historia i Znaczenie Claude Code:**
   * Zaczęło się jako projekt poboczny (Claude CLI) autorstwa Borisa Cherny w Anthropic pod koniec 2024. Wypuszczone w lutym 2025 i ogólnie dostępne w kwietniu 2025, zrewolucjonizowało rynek.
   * **Wrzesień 2025 (Wersja V2):** Przyniosła gigantyczny ekosystem do profesjonalnej pracy - m.in. sub-agenty, hooki (hooks), skille (skills), zadania w tle oraz *Claude Code SDK*. Narzędzie stało się tak potężne, że przekroczyło ARR na poziomie 1 miliarda dolarów.
   * **Punkt przegięcia (Inflection Point):** Wejście modelu Opus 4.5 w listopadzie sprawiło, że LLM-y stały się na tyle pewne i spójne, iż developerzy przestali musieć mikrozarządzać "każdym diffem" (linijka po linijce). Tę samą najwyższą ligę reprezentują Gemini 3 Pro i Codex 5.2.
   * *Ostrzeżenie Hype'owe:* Ed zaleca, by nie dawać się porwać każdemu nowemu projektowi i nowinie. Ważne są platformy (jak Claude Code i protokół MCP - *Model Context Protocol*, mający już 100 milionów pobrań miesięcznie), które sprawdzają się w boju i zostają z nami na lata.
2. **Koszty Subskrypcji i Modele API (Anthropic):**
   * Do profesjonalnego użytku Claude Code Ed mocno zaleca oficjalną subskrypcję *Pro* w Anthropic ($20/miesiąc), choć dostępne są też abonamenty za $100 czy $200, z których sam Ed chętnie korzysta.
   * Choć istnieją darmowe metody podpięcia innych modeli do Claude Code (np. poprzez klucze API innych dostawców), doświadczenie to bywa zauważalnie gorsze bez "natywnego" połączenia i oficjalnego, najwyższego modelu Claude.
3. **Proces Instalacji:**
   * Instalacja z poziomu oficjalnej dokumentacji (na Windows czy Mac). Ogranicza się z reguły do skopiowania jednego polecenia i wklejenia go do terminala (wymaga zezwolenia w systemie operacyjnym na wykonywanie skryptów, np. odpowiedniej polityki Execution Policy w PowerShell).
4. **Terminal CLI vs Sidebar w VS Code (Wybór Profesjonalisty):**
   * Istnieją dwie opcje korzystania z Claude Code. Anthropic oferuje dedykowane rozszerzenie (Extension) do VS Code z ponad 4 milionami pobrań.
   * **Sidebar (Rozszerzenie):** Wygodniejsze, silniej zintegrowane w bocznym panelu IDE, sterujące plikami podobnie jak agent Cursor/Copilot. Przeznaczone jednak dla mniej zaawansowanych użytkowników – nie oferuje pełni "pro" doświadczenia ani wszystkich zaawansowanych funkcji platformy.
   * **Terminal (CLI) wewnątrz IDE:** Ed w tygodniu 2. zdecydowanie przechodzi na czystą komendę w terminalu otwieranym na dole ekranu wewnątrz VS Code. Daje to dostęp do absolutnie wszystkich inżynieryjnych funkcji przewidzianych dla Vibe Engineerów, podczas gdy okno IDE służy inżynierowi do podglądu kodu i nawigacji.

---

## 25. Praktyka: Inicjalizacja i Pierwsze Komendy w Claude Code

### Zagadnienie
Uruchomienie Claude Code z poziomu terminala, nawigacja po interfejsie retro (CLI), omówienie pliku `claude.md`, zarządzanie oknem kontekstowym (`/context`) i zaufanie w samodzielne wykonywanie komend systemowych.

### Opis

1. **Interfejs Retro (The CLI Vibe):**
   * Wywołanie Claude Code odbywa się poprzez wpisanie polecenia `claude` w świeżym terminalu VS Code (często poprzedzonym twardym `git commit`).
   * Zauważalny jest powrót do korzeni "starej szkoły" (CLI): tekstowy interfejs, brak kolorowych przycisków. Ma to na celu zbudowanie surowej, natywnej formy komunikacji z LLM – celowy, inżynieryjny zabieg od Anthropic.
2. **Pierwsze komendy ukośnikowe (Slash Commands):**
   * Prowadzenie konwersacji to standardowe wpisywanie tekstu, ale do sterowania agentem służą komendy poprzedzone ukośnikiem `/`.
   * `/login` – autoryzacja konta Anthropic w przeglądarce.
   * `/init` – komenda inicjująca nowy projekt. Claude skanuje pliki (wyszukuje, analizuje strukturę) i konfiguruje środowisko.
3. **`claude.md` (Odpowiednik agents.md):**
   * Claude nie korzysta domyślnie z pliku `agents.md`, lecz preferuje własny, bliźniaczy format: `claude.md`.
   * Po wykonaniu `/init`, Claude potrafi sam wygenerować plik `claude.md` od podstaw na podstawie przeskanowanego środowiska. Co ważne, pyta użytkownika (okno Decyzji: 1 - Tak, 2 - Tak i zaufaj na resztę sesji, 3 - Nie), czy może zapisać plik.
   * *Złota Rada Eda:* **Nigdy nie pozwalaj agentowi pisać ostatecznej wersji `claude.md` samemu**. To serce projektu i najważniejsze instrukcje wytyczane przez Ciebie (człowieka-inżyniera). Możesz wykorzystać wygenerowany przez LLM szkic, ale musisz go pieczołowicie dostosować. W tym projekcie Ed pozostawił go dla demonstracji.
4. **Zarządzanie Oknem Kontekstowym (`/context`):**
   * Najważniejsza komenda według Eda. Narzędzie ma potężny limit 200 000 tokenów. Anthropic świadomie nałożył sztywne ograniczenie, nie skalując okna w nieskończoność, by wymusić skupienie na "mądrości modelu" (Opus), a nie rozpraszaniu go setkami tysięcy bzdurnych śmieci kontekstowych.
   * Komenda `/context` pokazuje przejrzysty wykres paskowy w CLI:
      * Ile tokenów zajmuje Pamięć projektu (np. plik `claude.md`).
      * Ile tokenów pochłania konwersacja (Messages).
      * Ile wolnego zostało na nowe iteracje.
      * Jak duży bufor zostawiono na "Kompaktowanie" (Compaction) w razie zbliżania się do ściany.
5. **Zaufanie do Samodzielności Agenta (CLI w praktyce):**
   * W poleceniu *„uruchom wszystkie testy, podnosząc i opuszczając serwer”*, agent natrafił na błąd – Docker nie był uruchomiony na Macu po restarcie.
   * Claude Opus zadziwił inżyniera: agent zrozumiał problem, napisał polecenie CLI w terminalu uruchamiające aplikację Docker Desktop w tle dla użytkownika na macOS i dokończył pomyślnie testy (co zajęło mu raptem minutę). Zazwyczaj starsze modele po prostu wyrzucałyby błędy zablokowania. To symbol tego "przeskoku inteligencji".

---

## 26. Code Review, Halucynacje i Kompresja Kontekstu w Claude Code

### Zagadnienie
Praktyka przeprowadzania głębokiego code review z użyciem Claude Code, radzenie sobie z konfabulacją agenta oraz zarządzanie przepełnionym oknem kontekstowym.

### Opis

1. **Zlecanie kompleksowego Code Review:** 
   Zamiast wskazywać punktowe błędy, inżynier zleca zadanie: *"Please carry out a comprehensive code review of the entire repo and write a report to codereview.md"*. Narzędzie takie jak Claude Code automatycznie uruchamia w tle równoległe sub-agenty (np. backend, frontend, infra) do wielowątkowej analizy.
2. **Problem halucynacji (Pewność Siebie LLM):** 
   Zawsze podchodź z dystansem do rewelacji modelu. W omawianej lekcji agent z absolutną, fałszywą pewnością zgłosił "Krytyczny błąd" wycieku kluczy API, twierdząc, że plik `.env` trafił do repozytorium, podczas gdy w rzeczywistości był prawidłowo ukryty w `.gitignore`. **Nigdy nie ufaj bezgranicznie autorytarnym raportom bezpieczeństwa generowanym przez LLM – zawsze samodzielnie je weryfikuj.**
3. **Inteligentne Nieposłuszeństwo (Disobedience):** 
   Po zleceniu naprawy wszystkich zdiagnozowanych błędów, agent samodzielnie **zdecydował pominąć refaktoryzację** wielkiego pliku `main.py`, uznając, że koszt i ryzyko takiej zmiany przewyższają korzyści biznesowe (cost-benefit). Było to poprawne wnioskowanie maszyny, jednak inżynier musiał asertywnie wymusić wykonanie zadania twardą komendą ("Napraw to teraz i zrób re-testy"), aby zmusić agenta do podziału monolitu na mniejsze moduły. Wymuszona refaktoryzacja udowodniła w praktyce mechanizm uruchamiania całych zestawów testowych w CLI wewnątrz agenta (np. zaliczenie "23 backend tests").
4. **Manualny Compacting (`/compact`):** 
   Po ciężkim zadaniu refaktoringu okno kontekstowe bardzo szybko wypełnia się w 100%. 
   * Agent potrafi sam skompresować kontekst, ale jest to niebezpieczne, jeśli nastąpi znienacka w środku skomplikowanej modyfikacji pliku, prowadząc do błędów.
   * **Rekomendacja Vibe Engineeringu:** Po udanej przebudowie wykonaj twardy commit w systemie Git, a następnie ręcznie wpisz `/compact`. Czynność ta usuwa zbędną historię rozmowy, zwalnia ogromną ilość pamięci roboczej, pozostawiając tylko kluczowe podsumowanie. Zastrzeżenie: po wykonaniu kompresji agent może zapomnieć o wcześniejszych ustaleniach (np. znów pomylić status pliku `.env`), dlatego najważniejsze zasady należy dopisywać bezpośrednio do głównego pliku instruującego, takiego jak `claude.md`.
5. **Monitorowanie zasobów (`/status`):** 
   Przydatna komenda administracyjna dająca wgląd do statystyk inżynierskich: jakiego modelu aktualnie używasz (np. Opus 4.5) oraz jaki jest procentowy stan zużycia Twoich dziennych limitów w zależności od subskrypcji.

---

## 27. OpenCode: Otwarta Alternatywa i Darmowe Modele CLI

### Zagadnienie
Poznanie alternatywnego, otwartoźródłowego środowiska CLI (`opencode.ai`), pozwalającego na ominięcie zamkniętego ekosystemu Anthropic i dającego dostęp do dziesiątek innych darmowych lub płatnych modeli kodujących.

### Opis

1. **Czym jest OpenCode (OpenCode.ai):**
   * To otwartoźródłowy konkurent (klon) Claude Code. Uruchamia się go identycznie (wewnątrz terminala VS Code, poprzez komendę `opencode`).
   * Zaletą OpenCode jest **agnostycyzm modelowy**: pozwala na wpięcie dowolnego providera API (np. OpenAI, Gemini, Claude) oraz udostępnia potężne **modele darmowe** dostępne prosto z pudełka (opcja OpenCode Zen).
2. **Kluczowe Skróty i Funkcjonalności:**
   * `TAB` – błyskawiczne przełączanie agenta między trybem Planowania (Plan) a Budowania (Build). Wymuszanie myślenia w `Plan mode` zapobiega przedwczesnemu "psuciu" kodu przez AI.
   * `CTRL+T` – skrót do regulacji poziomu rozumowania ("Reasoning Level": Low, Medium, High, Extra High) dla modeli takich jak GPT-5.2 Codex. Pozwala zaoszczędzić tokeny lub rzucić maszynę na głęboką analizę.
   * `/models` – wywołuje menu z listą dostępnych sztucznych inteligencji.
   * `/connect` – pozwala wpisać własny klucz API np. do OpenRouter, GitHub Copilot czy bezpośrednio do dostawcy chmury (Azure/GCP).
3. **Open Source All-Stars (Modele Darmowe):**
   * Ed poleca wypróbowanie tzw. "gwiazd open-source'u" dostarczanych darmowo z narzędziem (np. modele od Moonshot AI czy chiński KLM 4.7).
   * Podczas testu model KLM 4.7 wygenerował bardzo obszerny, dogłębny Code Review w formie dokumentu `.md`.
   * **Ograniczenia darmowych modeli:** Ed zaznacza twardo: te darmowe silniki sprawdzają się do generowania tekstu, analiz i mniejszych skryptów, ale brakuje im autonomii, aby móc rzucić je na YOLO (np. w pełni zrefaktoryzować skomplikowany kod i samemu poprawiać testy – w tym przypadku płatny, najwyższy Claude Opus bije je na głowę).
   * **Brak pewności:** "Darmowość" modeli OpenCode Zen nie jest zagwarantowana na zawsze – brak twardych limitów kwotowych może skończyć się nałożeniem rate-limitów przy zbyt intensywnym używaniu.
4. **Modele lokalne (Offline / Ollama):**
   * OpenCode wspiera zapięcie modeli lokalnych, uruchamianych fizycznie na karcie graficznej programisty, dając gwarancję prywatności 100%.
   * **Inżynierskie realia lokalnego Vibe Codingu:** Ed wprost ostrzega, że na chwilę obecną (2026), modele rzędu 20 miliardów parametrów (działające na przeciętnym sprzęcie) są "zbyt głupie" do zaawansowanego, agentycznego kodowania. Do sensownej pracy potrzeba gigantów o ponad 120 miliardach parametrów, co wymaga bardzo drogiego sprzętu (wymienione np. Mac z 64+ GB zunifikowanej pamięci RAM), przez co jest to ścieżka dla profesjonalistów z dedykowanymi farmami GPU, a nie domowych developerów.
5. **Ostateczna rekomendacja Eda:**
   * Choć OpenCode jest genialnym i darmowym narzędziem zastępczym dającym wielką wolność konfiguracji, Ed osobiście uważa platformę (i interfejs CLI) **Claude Code** za lepszą. Dlaczego? Ponieważ jest idealnie "skrojona" pod specyficzny sposób "myślenia" i działania algorytmów firmy Anthropic, dając na koniec dnia najbardziej płynne i niezawodne doświadczenie "Vibe Engineeringu".

---
SONET
## 28. AMP Code, Claude Code z OpenRouter i Ollama lokalnie

### Zagadnienie
Trzeci ekosystem CLI (AMP), model „AMP Free” finansowany reklamami, oraz eksperymentalne podpinanie Claude Code pod OpenRouter albo lokalny Ollama — z ograniczeniami i ryzykiem „janky” konfiguracji.

### Opis

1. **AMP (AMP Code, ampcode.com):**
   * Narzędzie w duchu **niezależnym od jednego dostawcy** (podobnie jak OpenCode): agentyczny koder z możliwością podłączenia wielu providerów i analiz. **Wariant terminalowy** (najbardziej znany) oraz **rozszerzenia** do VS Code, Cursor, Windsurf.
   * Po instalacji uruchamia się komendą `amp`; pierwsze wejście wymaga **logowania w przeglądarce** (rejestracja e‑mail/hasło lub Google).
2. **AMP Free — co to znaczy „10 USD”:**
   * Nazwa bywa myląca: chodzi o **ok. 10 USD kredytu dziennie** w zamian za **oglądanie reklam** w interfejsie, a nie o opłatę 10 USD dziennie. Ed uważa to za sensowny układ, jeśli reklamy są akceptowalne.
   * W panelu konta (np. ustawienia z menu awatara) widać **pozostały kredyt** w ramach planu, możliwość **dokupu** i **automatycznego doładowania**, opcjonalnie **połączenie z GitHubem**.
3. **Brak wyboru modelu przez użytkownika:**
   * AMP **sam dobiera model** w tle pod zadanie; użytkownik ma ufać wyborowi platformy (Ed sugeruje, że w praktyce może to być mocny model z dużym oknem kontekstu, choć pełna widoczność nazwy modelu jest ograniczona).
4. **Tryby pracy (`Ctrl+S`):**
   * Przełączanie trybów: **Smart** (standard), **Deep** (wolniejsze, głębsze rozumowanie), **Rush** (szybciej). Ed w demonstracji wybiera **Deep**, by priorytetyzować jakość nad czasem.
5. **AMP w praktyce (code review):**
   * Interfejs pokazuje zużycie kontekstu, postęp i „koszt” w ramach darmowego limitu (np. kilkadziesiąt centów z puli dziennej po zadaniu).
   * **Błąd nazwy pliku:** Ed przypadkiem kazał zapisać raport jako plik bez rozszerzenia zamiast **`.md`** — musiał doprecyzować prompt, by uzyskać właściwy plik markdown (wzmocnienie zasady: **precyzyjnie podawaj nazwę pliku z rozszerzeniem**).
   * Raport potrafi trafnie wychwycić realne problemy (np. **twardo zakodowane dane uwierzytelniające**).
   * **Porównanie z Claude Code:** Doświadczenie jest zbliżone do Claude Code (cross‑provider), lecz Ed daje **przewagę Claude Code**.
6. **Claude Code + OpenRouter (np. Kimi K2) — świadomy hack:**
   * Anthropic **nie zaleca** traktowania tego jako głównej ścieżki: Claude Code jest projektowany i optymalizowany pod **modele Claude**; obejście przez OpenRouter daje **mniej stabilne** („janky”) doświadczenie i konfigurację.
   * Ed: do pracy z **modelami open‑source** sensowniej użyć **OpenCode lub AMP**, chyba że świadomie chcesz eksperymentować z Claude Code + innym backendem.
   * Idea: zmienne środowiskowe kierujące wywołania tak, by zamiast domyślnego endpointu Anthropic użyć **OpenRouter** (np. `ANTHROPIC_BASE_URL` wskazujący na API OpenRouter, token OpenRouter zamiast klucza Anthropic), ustawienie **domyślnych modeli** (Sonnet/Opus) na ten sam identyfikator z OpenRouter — inaczej narzędzie może „wracać” do modeli Claude.
   * Uruchomienie z konkretnym modelem: `claude --model <nazwa_z_OpenRouter>`; weryfikacja w `/model` lub odpowiedniku.
   * **Granice eksperymentu:** Przy Kimi K2 **pełne code review** „poszło bardzo źle” (Ed nie powtarzał tego testu w tej konfiguracji) — przy modelach OSS **kluczowa jest gotowość do eksperymentów**; część zadań działa, część nie; krajobraz szybko się zmienia (w kursie pada też przykład **Grok** jako alternatywy do testów).
7. **Claude Code + Ollama lokalnie (localhost, port 11434 domyślnie):**
   * Konfiguracja wskazuje na **lokalny host** zamiast chmury Anthropic; przykład z modelem **GPT‑OSS** i `claude --model GPT-OSS`.
   * Na **mocnym sprzęcie** podsumowanie projektu może zadziałać (GPU obciążone); na słabszym — bardzo długi czas oczekiwania.
   * Ed: do **bardzo dużych modeli** często bardziej opłaca się **OpenRouter** (tanio w chmurze) niż własna maszyna.
8. **Powrót do „normalnego” Claude:**
   * Zamknięcie terminali i **nowa sesja terminala** zwykle **resetuje zmienne środowiskowe** — wraca się do standardowego Claude Code z chmurą Anthropic (punkt wyjścia pod dalszą naukę zaawansowanego Claude Code).
9. **Postęp w programie:**
   * Na końcu tego bloku lekcji pada informacja, że uczestnik jest ok. **w 40%** ścieżki do poziomu eksperta agentic engineering (kontekst motywacyjny z kursu).

---

## 29. Zaawansowane Zarządzanie Sesją i Składnia Claude Code

### Zagadnienie
Pogłębienie wiedzy o interfejsie CLI Claude Code: komendy ukośnikowe, skróty klawiszowe, zarządzanie uprawnieniami oraz potężna składnia `@` do wstrzykiwania kontekstu.

### Opis

1. **Krajobraz Agentów (Recap):**
   * **IDEs:** Cursor (najpopularniejszy), Antigravity, Windsurf.
   * **Plugins (Wtyczki):** GitHub Copilot, Codex (wtyczka do VS Code).
   * **CLI (Wiersz poleceń):** Claude Code (lider kategorii), Cursor CLI, Codex CLI, Gemini CLI (oraz Antigravity CLI).
   * Ed podkreśla, że **Claude Code** jest jego faworytem ze względu na stabilność i przemyślaną architekturę wokół modelu Opus.

2. **Czysty Start (Fresh Terminal):**
   * Przed uruchomieniem nowej sesji Claude Code, Ed zaleca otwarcie całkowicie świeżego terminala skrótem **`Ctrl + Shift + `** (Backtick).
   * Zapobiega to przenoszeniu zmiennych środowiskowych (np. `ANTHROPIC_BASE_URL` z poprzednich eksperymentów), które mogłyby "popsuć" natywne działanie narzędzia.

3. **Komendy Ukośnikowe (Slash Commands):**
   * Wywołanie listy komend: Wciśnięcie **strzałki w dół** lub wpisanie `/help`.
   * `/init` – inicjalizacja projektu (tworzy `claude.md`). Ed sugeruje, by czasem robić to ręcznie dla większej kontroli.
   * `/model` – szybka zmiana modelu (np. na Opus przy dużym budżecie).
   * `/status` – dane o wersji i bieżącym zużyciu limitów.
   * `/context` – graficzny podgląd zapełnienia okna kontekstowego (Memory Printout).
   * `/clear` – **bardzo ważne:** Całkowite wyczyszczenie historii konwersacji. Agent "zapomina" wszystko poza tym, co jest w `claude.md`. To "wyzwolenie" dla modelu, gdy sesja staje się zbyt długa i chaotyczna.
   * `/stats` – wizualny wykres użycia tokenów w czasie (dziennie/tygodniowo).
   * `/config` / `/usage` – skróty do odpowiednich stron panelu statusu.

4. **Skróty Klawiszowe i Tryby:**
   * **`Shift + Tab`** – przełączanie trybów: *Accept Edits* (automatyczne akceptowanie zmian) lub *Plan Mode* (wymuszanie planowania). Przy modelu Opus wymuszanie planowania jest rzadsze, bo model sam dobrze decyduje, kiedy zacząć pisać kod.
   * **`Ctrl + O`** – tryb *Detailed Transcript*. Wyświetla "bebechy" komunikacji agenta z systemem (gory detail), przydatne przy debugowaniu zachowania samego narzędzia.
   * **`Escape`** – wyjście z dowolnego ekranu pomocy lub statusu.

5. **Zarządzanie Uprawnieniami (Permissions):**
   * Wszystkie zgody (np. "zawsze pozwól na czytanie plików") są zapisywane w ukrytym folderze **`.claude/settings.json`**.
   * Można edytować ten plik ręcznie, by masowo dodawać lub usuwać uprawnienia, zamiast klikać "Tak" przy każdej operacji.
   * Alternatywnie: komenda `/permissions`.

6. **Potęga składni `@` (Context Injection):**
   * Służy do ręcznego wciągania zawartości plików/folderów do kontekstu (zarówno w promptach, jak i w pliku `claude.md`).
   * **`@ścieżka/do/pliku`** – wstrzykuje całą treść wskazanego pliku.
   * **`@folder/`** – wstrzykuje listę plików w danym katalogu (bez ich treści).
   * **Synchronizacja `claude.md` z `agents.md`:** Jeśli chcesz używać wielu narzędzi (np. Claude Code i Copilot) na tym samym zestawie instrukcji, możesz w `claude.md` wpisać tylko jedną linię: **`@agents.md`**. Claude Code zassie treść instrukcji z pliku `agents.md`, eliminując potrzebę utrzymywania dwóch identycznych plików.
   * **Ostrzeżenie:** Używaj `@` z rozwagą przy dużych plikach, ponieważ błyskawicznie "zjadają" okno kontekstowe (200k tokenów).

---

## 30. Sesje, Checkpointing i Git — trzy poziomy „cofania” w Claude Code

### Zagadnienie
Jak w Claude Code rozróżnić **sesje** (Sessions), **checkpointing** (przewijanie kroków w bieżącej rozmowie) oraz **Git** — i dlaczego Ed używa ich inaczej w swoim workflow.

### Opis

1. **Elastyczność i ryzyko zamętu:**
   * W narzędziu jest **wiele podobnych sposobów** na „checkpointy” i powrót do wcześniejszego stanu; łatwo je pomylić. Warto świadomie wybierać mechanizm pod zadanie.

2. **Sesje (Sessions) — najgrubsza ziarnistość:**
   * **Sesja** to **pełny stan rozmowy z Claude** (kontekst, historia) oraz powiązanych działań w ramach tej sesji.
   * Można **nadać sesji nazwę** w dowolnym momencie — zapisuje to stan kontekstu w tym punkcie.
   * Później można **wznawiać** (`resume`) wybraną nazwaną sesję albo po prostu **kontynuować od miejsca wyjścia** z Claude Code („resume from where I just was”).
   * **Ważne ograniczenie:** wznawianie sesji dotyczy **rozmowy i kontekstu**, **nie** automatycznego przywrócenia **stanu repozytorium / kodu** sprzed tygodnia czy z nazwanej chwili.

3. **Checkpointing — drobniejsza ziarnistość (w obrębie bieżącej sesji):**
   * Dotyczy **aktualnie otwartej sesji**, w której pracujesz w Claude Code.
   * **Każdy prompt** do Claude Code jest traktowany jak **krok w czasie** — punkt kontrolny (*checkpoint*).
   * **Rewind (przewijanie wstecz):** cofanie się **krok po kroku** w historii bieżącej konwersacji.
   * Przy cofaniu można wybrać: **tylko cofnięcie rozmowy** z Claude, albo **cofnięcie także zmian w kodzie**, które Claude **sam zna** (zmiany wprowadzone przez niego w ramach tego przepływu).
   * **Pułapka (catch):** Claude **nie trzyma kopii całego dysku** przy każdym kroku. Cofnąć może zmiany, **o których wie**. Jeśli w ramach promptu **uruchomiono skrypt**, który zmodyfikował pliki poza ścieżką, którą Claude śledzi, albo użytkownik/coś innego zmieniło pliki — **tego rewind w narzędziu nie cofnie**. Trzeba być świadomym, **co dokładnie** się cofa.

4. **Słownik rozróżniający:**
   * **Session resume** — powrót do **nazwanej / zapisanej sesji** (duży zapis kontekstu rozmowy).
   * **Checkpoint rewind** — **krokowe** cofanie w **tej** sesji, opcjonalnie z kodem znanym Claude.

5. **Git — ortogonalny, „kuloodporny” poziom dla kodu:**
   * **Commity Git** to właściwy sposób na **pełny snapshot kodu** i długoterminowy powrót do dowolnego punktu w repozytorium.
   * **Nie jest** to to samo co kontekst rozmowy z Claude — dotyczy **kodu**.
   * Można commitować **wielokrotnie nawet w trakcie jednej konwersacji**; granularność commitów nie musi być „wyższa” niż checkpointy — zależy od pracy.

6. **Trzy „narzędzia” w jednym workflow:**
   * **Sesje:** ogólne **ramy** rozmowy z Claude (np. „jak rozmawialiśmy miesiąc temu” — stan kontekstu).
   * **Checkpointing:** **kroki** w **bieżącej** rozmowie i ewentualny rewind znanych zmian kodu.
   * **Git:** **źródło prawdy** dla historii **kodu** i bezpiecznego revertu.

7. **Workflow Eda (subiektywnie — rekomendacja z kursu):**
   * **Dużo Git:** commituje w trakcie pracy i dba o sens commitów.
   * **Checkpointing** — **sporadycznie**, gdy coś poszło nie tak; **rzadziej** polega na cofaniu **samych zmian kodu** przez rewind, chyba że to **świeży, oczywisty** błąd do natychmiastowego cofnięcia; **częściej** wraca przez **Git** do wcześniejszego commita.
   * **Pliki Markdown** (`claude.md`, `plan.md` itd.) jako **śledzenie postępu** — „nudna”, czytelna dla człowieka pamięć zamiast polegania wyłącznie na sesjach.
   * **Sesje „sprzed tygodnia”** uważa za **mylące** (trudno ogarnąć, co było w kontekście); **woli pliki** dla jasności. Jednocześnie **nie deprecjonuje** sesji — inni **skutecznie** z nich korzystają; chodzi o dopasowanie do własnego stylu.

8. **Demonstracja sesji (z lekcji):**
   * Ustawienie tonu rozmowy (np. „witty and snarky”), potem komenda **`rename`** z nazwą sesji (przykład: **snarky Claude**).
   * Wyjście z Claude Code, ponowne `claude` — **nowa** rozmowa bez tego tonu.
   * Uruchomienie **`claude --resume`**: lista sesji (np. „one of eight”), wybór nazwanej sesji — **powrót tonu i kontekstu** tej rozmowy.

---

## 31. Praktyka `/rewind`, skróty Ctrl+O / Ctrl+E / Ctrl+B i demonstracja checkpointów

### Zagadnienie
Jak w **jednej sesji** przećwiczyć **rewind** checkpointów, co pokazują skróty **Ctrl+O / Ctrl+E / Ctrl+B**, oraz jak rozróżnić to od **wznawiania sesji** — na przykładzie code review i fałszywego alarmu o kluczu API.

### Opis

1. **Kontynuacja „normalnej” rozmowy (bez „Snarky Claude”):**
   * W tej samej sesji można wrócić do „nudnego” trybu i pokazać **rewind** w praktyce (np. najpierw *summarize the project*, potem code review do pliku).

2. **Code review do pliku i zgoda na edycje:**
   * Przykład polecenia: code review i zapis wyników do **`review.md`** w katalogu **`docs/`**.
   * Możliwość **„allow all edits during the session”** — zatwierdzenie (w demo: **numer 2**), żeby **w całej sesji** automatycznie akceptować kolejne edycje bez zatrzymywania na każdym diffie.

3. **Skróty do podglądu „myślenia” agenta:**
   * **`Ctrl + O`** — tryb **Detailed Transcript** (dużo szczegółów z przebiegu pracy agenta); ponowne **`Ctrl + O`** — wyłączenie / „zwolnienie” tego widoku.
   * **`Ctrl + E`** — **rozwiń wszystko** w śladzie myślenia; **`E` ponownie** — **zwiń**.
   * **`Ctrl + B`** — możliwość **odsłania pracy w tle** (*background*), żeby **równolegle** wydawać kolejne polecenia (kontekst z kursu: obserwacja trace przy code review).

4. **Powtórzenie błędu w code review (fałszywy „exposed API key”):**
   * W demo znów pojawia się **ten sam typ błędu** co wcześniej: **„exposed API key”** — Ed sugeruje, że może to ten sam **sub-agent** popełniający ten sam błąd.

5. **Weryfikacja bez podpowiedzi (`.gitignore`):**
   * Zamiast od razu mówić, że `.env` jest w `.gitignore`, warto zadać krótkie pytanie typu: *„are you sure that the API key is exposed?”* — model **sam** dochodzi do błędu i **poprawia** wpisy we **wszystkich** dotkniętych plikach.

6. **Komenda `/rewind` (slash rewind):**
   * Interfejs **przypomina** wybór przy **wznawianiu sesji**: lista **kroków** (promptów) w czasie; **strzałka w górę** przesuwa wskazanie na wcześniejszy krok (np. sprzed pytania o klucz API, wcześniej: prośba o code review, jeszcze wcześniej: podsumowanie projektu).
   * Po wybraniu punktu pojawia się wybór: **tylko rozmowa**, **tylko kod**, **oba**, albo **anuluj**.

7. **Demonstracja „oba” (chat + pliki):**
   * Po cofnięciu do checkpointu sprzed korekty, plik **`review.md`** znów zawiera **błędny** wpis o wysokim ryzyku (klucz API) — **cofnięto zarówno kontekst rozmowy, jak i znane zmiany w plikach** w tym kroku.
   * To **kontrastuje** z **resume sesji**: wznawianie **starszej sesji** dotyczy głównie **kontekstu rozmowy**, a nie jest „przywróceniem całego repo”; **rewind** w bieżącej sesji może **cofnąć znane edycje plików** w ramach checkpointu.

8. **`Shift + Tab` a prawdziwy YOLO:**
   * **Automatyczne akceptowanie diffów** (tryb *Accept Edits*) to **nie** to samo co **YOLO mode** w sensie z kursu — YOLO to **szersza** sprawa; osobna lekcja: **YOLO** i **„YOLO on steroids”**.
   * Przed tym blokiem Ed robi **`git add .`** i commit z komunikatem w stylu **„before YOLO”** (w demo powtórzonym trzykrotnie), żeby **mieć czysty punkt odniesienia** w Git przed eksperymentem; wspomina też usunięcie starego pliku code review, żeby nie zaśmiecać stanu.

---

## 32. Prawdziwy YOLO w Claude Code: `--dangerously-skip-permissions` i demo przebudowy UI

### Zagadnienie
Czym jest **„prawdziwy” YOLO** w Claude Code (w przeciwieństwie do auto-akceptu diffów), jak uruchomić tryb **omijania uprawnień** (*bypass permissions*) i jak Ed ocenia **ryzyko** oraz **sandbox** — na przykładzie przebudowy interfejsu i testu asystenta AI.

### Opis

1. **Definicja „prawdziwego” YOLO (z kursu):**
   * Chodzi o to, by agent **nie pytał o zgody** i mógł wykonywać potencjalnie **niebezpieczne** operacje bez pytania — „**just do anything you want, it's all yours**” w sensie uprawnień narzędziowych, nie tylko szybszego akceptowania diffów.

2. **Uruchomienie z flagą:**
   * Po komendzie **`claude`** dodać: **`--dangerously-skip-permissions`** (nazwa ma być **jednoznacznie ostrzegawcza** — *dangerously*, *skip permissions*).

3. **Komunikat ostrzegawczy przy starcie:**
   * Informacja, że Claude Code działa w trybie **bypass permissions** — **nie będzie prosić o zatwierdzenie** przed potencjalnie niebezpiecznymi poleceniami.
   * Oficjalna rekomendacja w tekście ostrzeżenia: używać tylko w **sandboxowym kontenerze** z **ograniczonym internetem** i łatwym przywróceniem; **kontynuujesz na własną odpowiedzialność**.
   * W kursie **sandboxing** ma być omówiony **następnego tygodnia** „porządnie”; w tej lekcji Ed demonstruje tryb **„nieporządnie”** na zwykłej maszynie.

4. **Ryzyko a modele graniczne (*frontier*):**
   * Przy modelu typu **Opus** Ed uważa, że **szansa zrobienia czegoś destrukcyjnego jest bardzo niska**; **nie zna** szeroko nagłośnionych historii o **`rm -rf`** itp.
   * Jednocześnie: model jest **statystyczny** — **niezerowe prawdopodobieństwo** niepożądanego działania; stąd **własna ocena ryzyka** — albo robisz z instruktorem, albo **tylko oglądasz**.

5. **Przykład polecenia (demo UI):**
   * Poprawa **UI** projektu: lepszy **układ poziomy**, **ikony zamiast przycisków „delete”**, sensowne wykorzystanie **poziomej przestrzeni**, **testy**, powiadomienie po zakończeniu.
   * Interfejs pokazuje m.in. **czerwony** komunikat na dole, **Shift+Tab** do przełączania (cykl), **Enter** — start pracy w tym trybie.

6. **Zakres zadania vs sandbox:**
   * **Wąskie, zamknięte** polecenie (jak przebudowa UI) vs **bardzo szerokie** (np. cały plan w wielu krokach w jednym locie) — to drugie **bez sandboxa** uznaje za **nierozsądne**; profesjonaliści mogą iść szerzej, ale **sandbox** jest właściwym miejscem na wielkie eksperymenty.

7. **Wynik demo (metryka czasu i weryfikacja):**
   * Uruchomienie trwało ok. **7 min 44 s** (dużo działo się w tle; Ed przyznaje, że **nie patrzył cały czas** — np. czytał maila).
   * Ręczny start serwera: skrypt w stylu **`scripts/start-mac`**, przeglądarka **`localhost:8000`** — UI **wygląda lepiej** (sekcje, „bins”, responsywność, rozwijanie).
   * Test **asystenta AI** w aplikacji (w tym prośba o przeniesienie kart do kolumny *done*) — działa; **Open Router** nadal odpowiada w tym scenariuszu (kontekst z demo).

8. **Domknięcie inżynierskie:**
   * Po zadaniu: **`git status`**, **`git add .`**, **`git commit -m`** z sensowną etykietą (w demo: **`after ui revamp`**).
   * Zasada z ust Eda: **„never trust it until that's done”** — nie ufać wynikowi, dopóki nie ma **commita**.
   * Zapowiedź szerszego „autonomicznego” trybu realizowana m.in. przez **Ralph loops** (sekcja **33**).

---

## 33. Ralph loops — Autonomiczna Pętla Zewnętrzna i Wtyczki Anthropic

### Zagadnienie
Czym są **Ralph loops** w Claude Code (oficjalna wtyczka od Anthropic), w jaki sposób tworzą "pętlę wokół pętli" agenta oraz jak bezpiecznie (i z jakimi parametrami) uruchamiać zmasowaną, wieloetapową generację kodu.

### Opis

1. **Geneza i filozofia (Geoffrey Huntley):**
   * Pomysłodawcą koncepcji jest wybitny australijski inżynier **Geoffrey Huntley**.
   * Nazwa **Ralph loops** to popkulturowy hołd dla postaci Ralpha Wigguma z serialu *The Simpsons*.
   * **Filozofia:** Zamiast kończyć pracę po jednym zadaniu, agent jest wprowadzany w tryb optymistycznego, nieprzerwanego działania (*"optimistically keeping on going"*). Kiedy Claude uznaje, że skończył zadanie, specjalny prompt uderza go ponownie, zlecając powtórkę z ulepszeniami i ekspansją funkcji.

2. **Mechanika „Pętli wokół pętli” (Outer Loop):**
   * Standardowy Agent AI posiada swoją **wewnętrzną pętlę** (myśli → wykonuje narzędzie → weryfikuje wynik).
   * **Ralph loop** to **pętla zewnętrzna**, która owija wewnętrzną pętlę agenta. Wymusza ona wielokrotne powtarzanie całego cyklu budowy oprogramowania od miejsca, w którym agent przed chwilą skończył, pilnując przy tym, aby okno kontekstowe nie eksplodowało.

3. **Skalowanie czasu pracy i iteracje (`--max-iterations`):**
   * Pojedyncze złożone polecenie może zająć agentowi ok. 8 minut. Uruchamiając Ralph loop z parametrem `--max-iterations 10`, zamieniamy to w **80-minutowy, potężny proces**, w którym agent buduje funkcjonalności jedna na drugiej (iteracyjnie).
   * **Instalacja (jako Plugin):** W Claude Code wywołaj komendę `/plugin install ralph-loop@claude-plugins-official` (oficjalny kanał wtyczek Anthropic).
   * **Uruchomienie:** Używasz komendy wywołującej plugin, podajesz potężny prompt architektoniczny i limit iteracji. Przykład Eda:
     `ralph-loop:ralph-loop "Please significantly improve this project. Add users and user management, multiple Kanban boards in a user and other features to build out a comprehensive project management application. Testing thoroughly as you go and maintaining strong test code coverage and good integration tests." --max-iterations 10`

4. **YOLO + Ralph: Potęga i Ekstremalne Ryzyko:**
   * Połączenie trybu YOLO (`--dangerously-skip-permissions`) z Ralphem oddaje modelowi pełną autonomię na godzinę lub całą noc pracy.
   * **Kluczowa zasada Eda (Bezpieczeństwo):** **NIGDY** nie łącz YOLO z Ralphem, jeśli nie pracujesz w izolowanym **Sandboxie** (kontenerze z odciętym internetem i systemem plików). W przeciwnym razie niezerowe ryzyko błędu statystycznego może doprowadzić do destrukcyjnych komend (jak legendarne `rm -rf`).
   * **Alternatywa bez Sandboxa (Demo):** Ed uruchomił Ralpha w "nudnym" trybie (bez flagi YOLO), co wymusiło na nim cykliczne naciskanie klawisza **`2`** (*allow all edits during session*), ale dawało poczucie kontroli i możliwość awaryjnego przerwania procesu (tzw. "human-in-the-loop").

5. **Logi, Compacting i Rezultaty (Metryki z Demo):**
   * Ralph loop tworzy lokalny plik śledzenia postępów: **`.claude/ralph-loop-local.md`**.
   * Wynik z eksperymentu w kursie: **~59 minut pracy**, **+1311 linii dodanych**, **-170 linii usuniętych**.
   * W trakcie trwania długiej pętli model automatycznie wywołuje **kompresję kontekstu** (*compacting*), by nie zablokować się z braku pamięci (tokenów).
   * Powstały w pełni działający system: konta użytkowników, uwierzytelnianie, wiele tablic Kanban na osobę, baza danych — wszystko wykonane z blisko 100% autonomią.

6. **Kiedy stosować, a kiedy unikać?**
   * **Idealne zastosowanie (Zalecane):** Szybkie budowanie prototypów, MVP (Minimum Viable Product), śmiałe eksperymenty programistyczne ("out there").
   * **Złe zastosowanie (Odradzane):** Duże, komercyjne systemy, gdzie wymagana jest żelazna przewidywalność, stabilność, niezawodność architektury oraz główna rola ludzkiego inżyniera (*regimented process*).

---

## 34. Week 2, Dzień 3: Inflection Point — MCP, Skills i Plugins

### Zagadnienie
Zrozumienie fundamentalnych różnic między trójcą nowoczesnego rozszerzania agentów AI: **MCP** (Model Context Protocol), **Skills** oraz **Plugins**. Demistyfikacja "hype'u" wokół MCP oraz wyjaśnienie, dlaczego to **Tools (Narzędzia)** są prawdziwym przełomem.

### Opis

1. **Punkt Przegięcia (Inflection Point):**
   * Podobnie jak wydanie modelu Claude Opus 4.5 (w listopadzie 2025) drastycznie przesunęło granice AI, tak Dzień 3. drugiego tygodnia kursu stanowi moment, w którym kompetencje programisty wchodzą na poziom profesjonalnej orkiestracji agentów ("purple day"). Jesteśmy w ~47% materiału kursu.

2. **Rewolucja Narzędzi (Tools) vs Generowanie Tekstu:**
   * Z czterech podstawowych trików LLM (Iluzja Pamięci, Rozumowanie, Narzędzia, Pętla) to właśnie **Narzędzia (Tools) oddzielają zwykłego chatbota od agenta**.
   * Klasyczny LLM generuje treści. Agent generuje **tokeny decyzyjne i wykonawcze** (akcje) — np. komendę do wywołania wyszukiwarki lub edycji pliku.
   * Wbudowane w Claude Code darmowe narzędzia (np. edycja plików, śledzenie to-do list, shell) to podstawa, bez której model byłby całkowicie bezradny i zamknięty w przeglądarce.

3. **Czym jest MCP (Model Context Protocol) i skąd się wziął?**
   * Wprowadzony przez Anthropic pod koniec 2024 roku, okrzyknięty **"portem USB-C dla aplikacji AI"**.
   * MCP to **otwarty standard (protokół)**, a nie konkretna technologia wymiany danych ani konkretna implementacja. Pozwala on ustandaryzować sposób, w jaki dowolna aplikacja AI (np. Claude Code, ChatGPT, Cursor) może komunikować się z dowolnym, zewnętrznym zestawem narzędzi, pamięci lub szablonów, napisanym przez zewnętrznego programistę.
   * Wcześniej próbowano to robić w zamkniętych ekosystemach i frameworkach (np. stary LangChain). MCP zadziałało z racji **masowej rynkowej adopcji** i otwartego ekosystemu plug-and-play.

4. **Trzy Filary Orkiestracji: MCP vs Skills vs Plugins:**
   * Zrozumienie jest trudne, bo można je instalować, usuwać i włączać niezależnie.
   * **MCP (Model Context Protocol):** Najniższa warstwa. Czysty standard połączenia AI z zewnętrznymi serwerami udostępniającymi narzędzia, informacje (*resources*) i szablony (*prompt templates*).
   * **Skills (Umiejętności):** Powstały po MCP. Alternatywne podejście ułatwiające nadawanie modelowi określonych predyspozycji i ekspertyzy. Adresują one pewne słabości MCP (wspomniane niżej) i przez niektórych uznawane są za następcę czystego MCP.
   * **Plugins (Wtyczki):** Najwyższy poziom abstrakcji. Pakiety (*bundles*), które zbiorczo agregują w sobie konkretne Skills, wywołania MCP oraz inne ustawienia w jeden, łatwy do dystrybucji moduł (np. *Ralph loops*).

5. **Uziemienie (Grounding) "Hype'u" na MCP:**
   * Ed Donner zaznacza, by nie ekscytować się "samym protokołem MCP", bo to tylko przekaźnik ("tkanka łączna", *tissue*). Ekscytować należy się **jakością serwerów narzędziowych** (np. serwer podający na żywo rynkowe ceny akcji z Wall Street).
   * **Kluczowy problem techniczny MCP: Pożeranie Kontekstu (Context Inefficiency).** Bardzo łatwo ulec pokusie i zainstalować 10 potężnych serwerów MCP, co drastycznie puchnie i obciąża okno kontekstowe modelu, w którym podawane są opisy narzędzi.
   * Chociaż Claude Code od 2026 roku znacznie lepiej zarządza tym narzutem, wciąż **nadmiar wpiętych serwerów MCP zauważalnie degraduje logikę modelu** (performance degradation) i wymusza natychmiastowe, agresywne kompaktowanie pamięci. M.in. z tego powodu narodziły się optymalniejsze strukturalnie **Skills**.
