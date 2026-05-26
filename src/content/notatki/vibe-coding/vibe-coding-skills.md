---
title: 'Szczegóły: Agent Skills (workflow, SKILL.md, Osmani + Ed Donner)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-05-19'
review_count: 0
---

# Agent Skills: Jak nauczyć Agenta fachu (Szkolenie pracownika z Osmanim i Donnerem)

**Nawigacja:** Podstawy hierarchii rozszerzeń (Plugins > Skills > MCP), konfigurację MCP czy brutalnych "bramkarzy" w postaci Hooków znajdziesz w osobnym pliku [Rozszerzenia: MCP, Plugins i Hooks](/notatki/vibe-coding/vibe-coding-rozszerzenia). Tutaj bierzemy pod lupę **wyłącznie Skills (`SKILL.md`)** oraz kapitalne ramy koncepcyjne od **Addy Osmaniego** i **Eda Donnera**.

**Źródła:** Kurs Udemy Vibe Coding (Ed Donner) oraz znakomity projekt [Agent Skills od Addy Osmaniego](https://addyosmani.com/blog/agent-skills/) (repozytorium [github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)). Pamiętaj: kiedy mówisz o tych ideach, zawsze oddawaj cesarzowi co cesarskie!

---

## 1. Dwa spojrzenia na to samo: Czym do diabła jest "Skill"?

Czysty Agent AI to taki bystry student tuż po obronie dyplomu – przeczytał cały Internet, zna teorię, ale jak wpuścisz go do firmy, to nie wie, gdzie leżą formularze. Wtedy wchodzą **Skille**, czyli firmowe instrukcje stanowiskowe.

*   **Podejście Eda Donnera:** Skill to po prostu plik `SKILL.md`, który uczy Agenta konkretnej procedury technicznej lub Twojego własnego workflow. Używamy tu zasady *progressive disclosure* – pokazujemy mu instrukcję dopiero wtedy, gdy po opisie wpadnie na to, że jej potrzebuje.
*   **Podejście Addy Osmaniego:** "Process over prose!" (Proces ponad prozą!). Agent to nie czytelnik w bibliotece. Nie pisz mu epopei o dobrych praktykach. Daj mu **sztywną sekwencję kroków**, konkretne kryteria wyjścia i wymuś na nim **namacalny dowód** zakończenia pracy. 

Te dwa światy świetnie się uzupełniają. Ed tłumaczy, *jak* to technicznie wyklikać w Claude, a Osmani mówi, *dlaczego* Twoje poprzednie pliki z zasadami nie działały (bo pisałeś eseje zamiast list kontrolnych!).

---

## 2. Rama Addy Osmaniego: Jak trzymać Agenta w ryzach

Addy Osmani z Google dostarczył kapitalny zestaw zasad (framework), który temperuje "nadgorliwość" i "roztrzepanie" AI. Oto serce jego metody:

### 5 Zasad Nośnych ("Process over prose")
1. **Proces ponad prozą** – Pisz instrukcje jak dla żołnierza. Zrób X, potem zrób Y.
2. **Anti-rationalization tables (Rozbijanie wymówek)** – Agenci AI uwielbiają iść na skróty ("szefie, to za proste, nie pisałem testów"). Osmani tworzy tabele, gdzie na każdą potencjalną "wymówkę" Agenta przypisana jest twarda odpowiedź: "Zrobiłeś testy? Nie? To wracaj do pracy".
3. **Verification is non-negotiable (Weryfikacja nie podlega dyskusji)** – Zadanie nigdy nie jest "wydaje mi się, że działa". Zawsze musi zakończyć się **twardym dowodem**: zielonymi testami, prawidłowym buildem lub logiem z uruchomienia.
4. **Progressive disclosure (Stopniowe odkrywanie)** – Nie wrzucaj Agentowi 50 stron instrukcji na wejściu (tzw. Context Rot). Używaj meta-skilli (tzw. routerów), które w locie dobierają tylko tę instrukcję, która jest teraz potrzebna.
5. **Scope discipline (Trzymaj rączki przy sobie!)** – Złota zasada brzmi: *Touch only what you're asked to touch*. Zero samowolnych refaktoryzacji sąsiednich plików "przy okazji".

### 5 Zasad "Nie Podlegających Negocjacjom" (Wpisz to do `agents.md`!)
1. **Ujawniaj założenia:** Zanim napiszesz linijkę kodu, powiedz mi, jak to zrozumiałeś.
2. **Nie zgaduj:** Masz konflikt w wymaganiach? Zatrzymaj się i zapytaj!
3. **Intelligent disobedience (Mądre nieposłuszeństwo):** Agent ma prawo postawić się szefowi (Tobie), jeśli proponujesz głupie lub niebezpieczne rozwiązanie.
4. **Preferuj nudne rozwiązania:** Żadnych przekombinowanych, błyskotliwych trików. Kod ma być czytelny.
5. **Dotykaj tylko tego, o co prosiłem.** (Wspomniane wyżej, ale to tak ważne, że powtarzamy).

*(Chcesz to przetestować u siebie? Instalacja w Claude Code jest banalna: `/plugin marketplace add addyosmani/agent-skills` a potem `/plugin install agent-skills@addy-agent-skills`)*.

---

## 3. Skills według Eda Donnera: Typ 1 i Typ 2

Dlaczego Ed Donner nazywa Skille **"Złotym Standardem Firmowym"**? 
Wyobraź sobie magię: tworzysz plik `SKILL.md` (np. wymuszający specyficzne testowanie bazy), wrzucasz go do GitHuba i robisz `git push`. Od tego momentu, jakikolwiek inny programista w Twoim zespole zrobi `git pull`, jego lokalny Agent **natychmiast zyskuje tę samą inteligencję i nawyki!**

Ed dzieli Skille na dwie kategorie:
1. **Wiedza twarda (Typ 1):** Uczysz Agenta nowej technologii. Np. "Oto jakie parametry przyjmuje FFMPEG do renderowania".
2. **Twój firmowy proces (Typ 2):** Uczysz Agenta Waszych nawyków. Np. "Wyrenderowane wideo zawsze zapisuj do folderu /out i oznaczaj na czerwono".

### "BULLSEYE" – Sztuka trafiania w dziesiątkę metadanymi
Agent ładuje Skilla tylko wtedy, gdy opis (`description`) zgra się z Twoim zapytaniem. 

**ZŁY OPIS (Zbyt ogólny - Agent będzie go brał do wszystkiego albo wcale):**
```yaml
description: Pomaga z plikami wideo.
```

**IDEALNY OPIS (BULLSEYE - Strzał w dziesiątkę!):**
```yaml
description: >
  Łączy dwa nagrania wideo przez FFMPEG i wysyła na Google Drive.
  Zwraca wygenerowany link do chmury.
  Używaj tylko gdy użytkownik mówi: "połącz nagrania", "merge wideo", "wyślij Zoom do Drive".
```

### Anatomia dobrego Skilla i "Code Mode"
Czasem Skill to nie tylko instrukcja. Czasem chcesz, żeby Agent użył konkretnego skryptu (np. `notify.py`). Wtedy w instrukcji wpisujesz mu sztywną komendę w Bashu:
`uv run {base_dir}/scripts/notify.py "<wiadomość>"`
*(Używaj zawsze zmiennej `{base_dir}`, a Claude sam ogarnie ścieżki i ukośniki, niezależnie czy siedzisz na Windowsie czy Macu).*

**Jak pisać kroki (SOP - Standard Operating Procedure):**
- **Atomowość:** Jeden krok to jedna czynność. Nie mieszaj.
- **Jawne ścieżki:** Nie pisz "zapisz to w dobrym miejscu". Pisz: "Zapisz do `./src/output/`".
- **Warunki:** Jeśli coś zależy od czegoś, pisz to łopatologicznie: "Jeśli rozdzielczość jest inna -> ZAPYTAJ MNIE. Jeśli taka sama -> KONTYNUUJ".

---

## 4. Narzędzie dla spryciarzy: Plugin "Skill Creator"

Nie musisz pisać tych wszystkich plików YAML i Markdown ręcznie, męcząc się z formatowaniem. Ed Donner pokazuje genialny skrót: **oficjalny plugin od Anthropic zwany `skill-creator`**.

**Jak to działa?**
1. Instalujesz go wpisując `/plugin` w Claude Code i szukając `skill-creator`. Najlepiej zainstalować globalnie!
2. Odpalasz polecenie `/skill-creator`.
3. Narzędzie robi z Tobą wywiad: *"Szefie, co chcesz osiągnąć?"*. Ty mu odpowiadasz po polsku: *"Chcę, żebyś łączył mi wideo i wrzucał na Drive'a"*.
4. Narzędzie samo wygeneruje odpowiedni, perfekcyjnie sformatowany plik `SKILL.md`, podzieli go na Typ 1 i Typ 2, a co najważniejsze – wygeneruje opis **Bullseye**, żeby Skill odpalał się dokładnie wtedy, kiedy trzeba.

Możesz też użyć wbudowanego trybu testów (evals), żeby Agent sam sprawdził, czy nowy Skill w ogóle poprawia jego skuteczność!

---

## 5. Co możesz z tego "ukraść" do swojej firmy od zaraz?

Nawet jeśli nie chcesz bawić się w zaawansowane instalacje pluginów, ukradnij ten mindset:
- **Zabierz tabele "anti-rationalization"** i wrzuć je do firmowej wiki albo głównego pliku `agents.md`. Zmuszaj Agenta do udowadniania, że skończył pracę!
- **Skończ z pisaniem esejów.** Zmień "dobre praktyki kodowania" na sztywne listy kontrolne z odpowiedziami TAK/NIE.
- **Wymagaj dowodów.** Niech "koniec pracy" zawsze oznacza "tu jest link do raportu z testów".
- **Pisz konkretne `description`.** Traktuj pole opisu Skilla jak klucz wyszukiwania w Google. Jak nie będzie precyzyjne, Agent nigdy po to nie sięgnie.