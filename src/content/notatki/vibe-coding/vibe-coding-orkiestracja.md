---
title: 'Szczegóły: Orkiestracja (SubAgents, Agent Teams, Gastown, Ralph Loops)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-05-19'
review_count: 0
---
# Orkiestracja Agentów: Od mikrozarządzania do Rojów (Swarms)

**Źródło:** Kurs Udemy Vibe Coding (Ed Donner), Dokumentacja Claude Code.

Orkiestracja to zarządzanie wieloma modyfikacjami i zadaniami. Aby uciec przed chaosem i **Context Rot** (degradacją kontekstu), musisz dobrać ramy orkiestracji do wielkości swojego projektu i odpowiednio wysterować narzędziami (w tym modelami od innych dostawców).

---

## 1. Wybór modeli, lokalne instancje i OpenRouter
Zanim zdecydujesz o orkiestracji, upewnij się, jaki "mózg" napędza Twoje operacje.
- **Natywne Środowiska:** Jeśli korzystasz z Claude Code, domyślne modele (Sonnet/Opus) dają najlepsze rezultaty "z pudełka".
- **OpenRouter (Person-in-the-middle):** Używaj agregatorów, by mieć dostęp do innych modeli (OpenAI, Gemini) pod jednym kluczem API. Claude Code można "zhackować" pod OpenRouter, eksportując do zmiennej systemowej `ANTHROPIC_BASE_URL` oraz nadpisując tokeny.
- **Ollama (Modele Lokalne):** Ograniczenia sprzętowe są brutalne! Według Eda, małe modele (np. 20 mld parametrów) uruchomione lokalnie są ZBYT SŁABE do kodowania. Minimum dla Vibe Engineeringu to modele z powyżej 120 mld parametrów, wymagające potężnych stacji (np. Mac Studio 64GB RAM). Jeśli sprzęt dławi proces, wróć do chmury.

---

## 2. Orkiestracja Skrajna: Ralph Loops (Prototypy)
- **Ralph Wiggum Loops:** (Od Ralpha z Simpsonów). To moment, gdy zintegrowany plugin samodzielnie działa w kółko na pełnej autonomii. W Enterprise puszczony na środowisku developerskim to przepis na katastrofę (ciągłe kasowanie kodu).
- **Złota zasada Ralpha (Tylko MVPs!):** Używaj Ralph loops **wyłącznie** przy MVP, prototypowaniu lub głębokich eksperymentach w izolowanych Sandboxach chmurowych (jak Sprites.dev).
- Jeśli używasz Ralpha, uruchom Claude Code, wciśnij klawisz "2" (allow all edits during session) i zadbaj, by napisać mu gigantyczny prompt określający cały zarys systemu z góry.

---

## 3. Orkiestracja Podstawowa: Sub-Agents i Cross-Model
Główny Agent ma zachować czystą pamięć, dlatego deleguje. Ale robi to na twardych zasadach granicznych (koncepcje z Agent Development Kit).

- **Żelazna zasada izolacji (Hard Boundaries):** Każdy Sub-Agent (tzw. "podwykonawca") dostaje własne, całkowicie czyste okno kontekstowe, własny dobór narzędzi i własne uprawnienia. Nie miesza w mózgu Głównego Agenta. Główny Agent deleguje zadanie W DÓŁ, a Sub-Agent zwraca mu gotowy wynik W GÓRĘ. To wszystko.
- **Zakaz nieskończonej rekurencji (No infinite recursion):** To jest zasada bezpieczeństwa, która chroni Cię przed bankructwem na rachunkach API. Sub-Agent **NIE MOŻE** powołać do życia kolejnego Sub-Agenta. Taka struktura zapobiega wpadnięciu systemu w "rosyjską matrioszkę", która pożarłaby cały Twój budżet w 15 minut. To ma być czyste by design.
- **Cross-Model Review (`codex exec`):** Nie zamykaj się w jednym ekosystemie. Będąc w Claude Code (Sonnet), wywołaj komendę shellową `codex exec "please review code..."`. Użyjesz agenta GPT-5.2 Codex w trybie one-shot wprost z terminala, zmuszając go do napisania logów do np. `review.md`. Inny LLM, inna perspektywa, mniejsza szansa na przeoczenie błędów.
- **Zlecanie ręczne (Nie Slash Commands!):** Sub-agenty wywołuj poleceniem typu *"use the reviewer sub-agent to..."*. Nie uzywaj komend `/slash`, gdyż te tylko wklejają wielki prompt do głównej dyskusji.
- **Złota Zasada Sub-Agentów (Antywzorzec Złych Ról):** Według najnowszych praktyk (np. wniosków Olafa Sulicha), gigantycznym błędem jest tworzenie Sub-Agentów naśladujących "posady" z korporacji, np. "Jesteś Frontend Developerem" lub "Jesteś Backend Developerem". Takie instrukcje w sztuczny sposób upośledzają Agenta, drastycznie zawężając jego kontekst myślowy i dostępne narzędzia. Prowadzi to do fatalnych wyników. Zamiast "Ról", przypisuj im węższe, precyzyjne **Zadania** (np. Sub-Agent do analizy bezpieczeństwa API, Sub-Agent do testów Cypress).

---

## 4. Ekstremalna Orkiestracja: GSD, Agent Teams i Gastown
Gdy przekraczamy budowę prostych skryptów, masz do wyboru trzy ścieżki:

1. **GSD (Spec Driven Design):** Bardzo seryjne, sztywne, narzucające testy i procedury. Agent powoli analizuje wszystko po kolei w Sandboxie. Mega bezpieczne, bezkonfliktowe w Gicie, ale kosztuje masę tokenów i potrafi być 10x droższe i trwać 5 godzin.
2. **Agent Teams:** Równorzędna współpraca ról. Tańsze i szybsze od GSD. Wykorzystuj jako wbudowany kompromis. Zbuduj w 30 minut, poprawiaj błędy ręcznie.
3. **Gastown (Chaos na Steroidach):** Architektura wprowadzająca ekstremalną równoległość (współpracuje 20 agentów w Tmuxie w ułamkach sekund). Wprowadza role: Mayor (Koordynator), Polecats (Robotnicy). 
  - *Cena Gastown:* Taka równoległość rodzi **Merge Conflicts**. Musisz ufać Agentowi-Menedżerowi ("Refinery"), którego jedynym zadaniem jest rozwiązywanie kolizji w Git po innych robotnikach.

---

## 5. Mistrzostwo CLI i Radzenie z "Głupotą" Agenta
Twój warsztat to interfejs.

- **`Ctrl+Shift+``` (Twardy restart CLI):** Otwieraj całkowicie nowy terminal, gdy psują się zmienne środowiskowe.
- **`Ctrl+O` (Trace):** Tryb *Detailed Transcript*. Pokaże Ci na żywo, co Twój Agent wysyła przez sieć i o czym myśli.
- **`/rewind` a `git commit`:** W Claude Code `rewind` cofa tylko bezposrednie zmiany zrobione przez Claude. **NIE COFA skutków ubocznych skryptów!** Zanim wejdziesz w niebezpieczny kod, zawsze użyj twardego `git commit`.
- **Shift+Tab (Auto-Accept):** Płynniejsze przyjmowanie zmian diff'a w terminalu, ale to nie to samo co brutalne flagi YOLO (np. `--dangerously-skip-permissions`).
- **Inteligentne nieposłuszeństwo:** Agent czasem pomyśli "Refaktoryzacja tego monolitu jest za droga, zostawmy to". Nie gódź się na to. Użyj silnych słów: *"I really want to remediate this monolithic python module. Do it now."*