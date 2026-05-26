# Raport merytoryczny notatek

Data oceny: 2026-05-26

## Zakres oceny

Oceniono zawartość katalogów:

- `src/content/notatki`
- `src/content/fiszki`

Statystyka materiału:

- 36 plików Markdown z notatkami.
- 6 plików JSON z fiszkami.
- Największe obszary: `Vibe Coding`, `Agenci AI`, `Pytest`.
- Kategorie techniczne typu `Pydantic Settings`, `Pydantic v2`, `FastAPI`, `SQLAlchemy 2`, `Alembic`, `Uvicorn`, `FastMCP`, `Pypika` są obecnie głównie szkicami.

## Ocena ogólna

Ocena merytoryczna całości: **7.5/10**

Notatki mają wysoką wartość jako osobista baza wiedzy i materiał do powtórek. Najmocniejsze są tam, gdzie łączą teorię, praktyczne workflowy, kod i ostrzeżenia przed typowymi błędami. Najsłabsze są tam, gdzie materiał jest bardzo długi, mocno publicystyczny albo opiera się na autorytecie kursu bez doprecyzowania wersji narzędzi i źródeł.

Największa wartość:

- Dobre rozbicie na notatki główne i szczegółowe.
- Bardzo praktyczne podejście do pracy z agentami AI.
- Dobre przykłady workflow: TDD, code review, debugowanie, izolacja, cross-model review.
- Pytest jest opisany przystępnie i dydaktycznie.
- OpenAI Agents SDK jest opisany szeroko: tools, handoffs, guardrails, tracing, MCP, sandbox.

Największe ryzyka:

- Część twierdzeń o narzędziach AI szybko się starzeje.
- Brakuje jawnych wersji dokumentacji, SDK i modeli.
- Niektóre fragmenty są zbyt kategoryczne lub marketingowe.
- Materiał Vibe Coding jest bardzo długi i czasem bardziej „manifestem procesu” niż notatką techniczną.
- Część kategorii technicznych to tylko placeholdery, więc obniżają jakość całej bazy wiedzy.

## Agenci AI / OpenAI Agents SDK

Ocena: **8/10**

Pliki główne:

- `src/content/notatki/openai-agents-sdk/openai-agents-sdk-rdzen.md`
- `src/content/notatki/openai-agents-sdk/openai-agents-sdk-sandbox.md`
- pliki szczegółowe w `src/content/notatki/openai-agents-sdk/`

### Mocne strony

Materiał dobrze oddaje główną ideę Agents SDK: `Agent` plus `Runner` zdejmują z programisty część pracy związanej z pętlą narzędzi, orkiestracją, handoffs, guardrails i śledzeniem wykonania. To jest zgodne z oficjalną dokumentacją OpenAI, która opisuje SDK jako warstwę orkiestracji nad modelami i wskazuje, że `Agent` + `Runner` zarządzają m.in. turami, narzędziami, guardrails, handoffs i sesjami.

Notatki dobrze pokrywają:

- tworzenie `Agent`,
- `Runner.run`,
- async/await,
- function tools,
- structured output,
- guardrails,
- handoffs,
- tracing,
- MCP,
- sandbox agents,
- podstawowe wzorce multi-agentowe.

Sekcja o tracingu jest wartościowa, bo dobrze tłumaczy, że agent to nie pojedyncza odpowiedź modelu, tylko proces z wieloma krokami. Oficjalne docs OpenAI potwierdzają, że tracing obejmuje m.in. generacje LLM, tool calls, handoffs, guardrails i custom events.

### Ryzyka i korekty

1. **Model examples są częściowo historyczne.**

W notatkach pojawiają się przykłady typu `gpt-4o`, `gpt-4o-mini`, `o1`. To nie musi być błąd, ale w 2026 r. warto oznaczyć je jako przykłady historyczne albo kursowe. Oficjalna dokumentacja Agents SDK pokazuje aktualniejsze przykłady z modelami z rodziny `gpt-5`, np. `gpt-5-nano`.

Rekomendacja:

```md
Uwaga aktualizacyjna: nazwy modeli w przykładach pochodzą z materiałów kursowych. Przed użyciem produkcyjnym sprawdź aktualną listę modeli w dokumentacji OpenAI.
```

2. **„Non-opinionated” jest lekko zbyt mocne.**

OpenAI Agents SDK jest lżejszy niż wiele frameworków grafowych, ale nadal narzuca własne pojęcia: `Agent`, `Runner`, handoffs, tools, guardrails, sessions, tracing. Lepiej pisać: „mniej narzucający strukturę niż LangGraph/LangChain”, a nie „non-opinionated” bez zastrzeżeń.

3. **Guardrails wymagają doprecyzowania granic działania.**

Notatki dobrze tłumaczą ideę guardrails, ale warto dopisać ważne ograniczenie: input guardrails, output guardrails i tool guardrails działają w różnych punktach workflow. Oficjalne docs OpenAI wskazują, że input guardrails działają na pierwszym agencie, output guardrails na finalnym output, a tool guardrails na custom function-tool invocation.

4. **Sandbox Agents są wartościowe, ale część języka jest zbyt absolutna.**

Notatka mówi, że kod w sandboxie „nie ma absolutnie żadnego dostępu do sekretów”. Intencja jest dobra, ale technicznie powinno być ostrożniej: izolacja zależy od konfiguracji manifestu, capabilities, klienta sandboxa, mountów, sieci i tego, jakie narzędzia są dostępne w harness. Oficjalne docs mówią, że `SandboxAgent` ma konfigurację sandboxową, a szczegóły runtime są przekazywane przez `RunConfig(sandbox=...)`; workspace może pochodzić z różnych źródeł, np. repozytoriów, lokalnych plików, S3/Azure Blob.

Lepsza wersja:

```md
Sandbox ogranicza dostęp agenta do zadeklarowanego workspace i capabilities. Przy poprawnej konfiguracji sekrety z harness nie powinny być dostępne w compute, ale trzeba uważać na mounty, narzędzia, sieć i dane przekazane w manifeście.
```

5. **Brakuje sekcji „kiedy NIE używać agentów”.**

Materiał opisuje, jak budować agentów, ale warto dodać kryteria negatywne:

- proste przepływy deterministyczne,
- zadania bez potrzeby używania narzędzi,
- scenariusze, gdzie klasyczny kod + jedno wywołanie modelu wystarczy,
- workflow wymagające twardych gwarancji transakcyjnych.

### Ocena dydaktyczna

Bardzo dobra. Analogii jest dużo, ale pomagają w nauce. Warto jednak ograniczyć najdłuższe metafory w notatce głównej i przenieść je do sekcji „dla początkujących”, żeby zaawansowany czytelnik szybciej docierał do faktów.

## Vibe Coding / Vibe Engineering

Ocena: **7/10**

Pliki główne:

- `src/content/notatki/vibe-coding/vibe-coding-rdzen.md`
- `src/content/notatki/notatki_techniczne_Udemy_vibe_coding.md`
- pliki szczegółowe w `src/content/notatki/vibe-coding/`

### Mocne strony

To najmocniejszy materiał procesowy w repozytorium. Bardzo dobrze pokazuje, że praca z agentem AI to nie „poproś i zaakceptuj”, tylko proces inżynierski:

- planowanie,
- małe kroki,
- testy,
- code review,
- praca na diffach,
- ochrona przed YOLO mode,
- zarządzanie kontekstem,
- read-only audit,
- cross-model review,
- human-in-the-loop.

Najbardziej wartościowe są sekcje:

- `agents.md` jako konstytucja projektu,
- `plan.md` jako narzędzie kontroli pracy,
- TDD i brak placeholderów,
- `debug.md` przed naprawą błędu,
- izolowany audyt przed modyfikacją kodu,
- małe PR-y i ograniczanie zakresu zmian.

Te praktyki są zgodne ze zdrowym podejściem inżynierskim i realnie zmniejszają ryzyko regresji.

### Ryzyka i korekty

1. **Materiał jest bardzo długi i chwilami zbyt retoryczny.**

W kategorii `Vibe Coding` jest ok. 36 tys. słów. To dużo jak na materiał do regularnych powtórek. Niektóre fragmenty są świetne jako esej lub transkrypcja, ale słabsze jako szybka notatka.

Rekomendacja:

- Notatka główna powinna mieć 800-1500 słów.
- Długie instrukcje przenieść do osobnych „playbooków”.
- Dodać krótką sekcję „Najważniejsze 10 zasad”.

2. **Zbyt wiele nazw własnych i skrótów bez statusu źródła.**

Pojawiają się m.in. Ed Donner, Addy Osmani, Karpathy, Superpowers, Ralph loops, Agent Teams, Claude Code, OpenRouter, AMP Code. To może być wartościowe, ale czytelnik nie wie, co jest oficjalną funkcją narzędzia, co jest praktyką kursową, a co jest metaforą autora.

Rekomendacja:

```md
Legenda:
- Funkcja oficjalna narzędzia
- Praktyka kursowa
- Heurystyka autora
- Metafora / nazwa robocza
```

3. **Część zaleceń jest zbyt absolutna.**

Przykład: zawsze TDD, zawsze STOP po każdym kroku, zawsze brak YOLO. Jako zasady bezpieczeństwa są dobre, ale warto dopisać kontekst:

- nauka i eksperyment: można szybciej,
- produkcja i refaktoryzacja: rygorystycznie,
- kod krytyczny: zawsze testy i review.

4. **Brakuje mierników jakości.**

Materiał mówi, żeby pisać dobrze, ale warto dodać checklisty z konkretnymi metrykami:

- testy przechodzą,
- coverage dla zmienionego modułu,
- brak zmian poza zakresem,
- brak nowych zależności bez powodu,
- brak nieobsłużonych wyjątków,
- smoke test UI/API,
- security scan dla zmian web/API.

### Ocena dydaktyczna

Bardzo dobra dla osoby uczącej się pracy z agentami, ale zbyt gęsta do codziennej powtórki. Największy zysk da skrócenie głównej notatki i wyraźne oznaczenie, które fragmenty są praktyką twardą, a które inspiracją.

## Pytest

Ocena: **8.5/10**

Pliki główne:

- `src/content/notatki/pytest/pytest-notatki.md`
- `src/content/notatki/pytest/pytest-kompendium_technik_pytest.md`
- `src/content/notatki/pytest/pytest-studium_przypadku_imprv.md`
- `src/content/notatki/pytest/pytest-abc-mock-fixture-polaczenie.md`

### Mocne strony

To najbardziej stabilny i dydaktycznie równy dział. Materiał dobrze tłumaczy:

- po co są testy automatyczne,
- różnicę między manualnym sprawdzaniem a regresją,
- unit vs integration vs E2E,
- `assert`,
- mocki,
- fixtures,
- `conftest.py`,
- scope fixtures,
- `pytest.raises`,
- parametryzację,
- TestClient FastAPI,
- async tests.

Zgodność z oficjalną dokumentacją pytest jest dobra. Oficjalne docs wskazują m.in., że `@pytest.mark.parametrize` uruchamia test z wieloma zestawami argumentów oraz że fixture służą do setupu i mogą być parametryzowane. Notatki opisują to poprawnie.

### Ryzyka i korekty

1. **Miejscami zbyt mocno upraszcza unittest.**

Porównanie pytest vs unittest jest dydaktyczne, ale warto dodać: `unittest` nadal jest poprawnym i wspieranym frameworkiem, szczególnie w istniejących projektach. Pytest jest wygodniejszy, ale nie oznacza, że unittest jest „zły”.

2. **Brakuje rozdziału o strukturze testów w realnym repo.**

Jest studium przypadku, ale warto dodać krótką, uniwersalną strukturę:

```text
tests/
  unit/
  integration/
  e2e/
  conftest.py
```

3. **Brakuje sekcji o antywzorcach.**

Warto dodać:

- test zależny od kolejności,
- test z prawdziwą siecią w unit testach,
- nadmierne mockowanie,
- asercje na szczegóły implementacji,
- fixture robiąca za dużo,
- testy bez jasnego GIVEN/WHEN/THEN.

4. **Fiszki Pytest są dobre, ale można je rozbić poziomami.**

`pytest-fundamenty.json` ma 34 fiszki, `pytest-techniki.json` ma 8. To sensowny zestaw, ale warto dodać tagi poziomu:

- podstawy,
- praktyka,
- błędy,
- zaawansowane.

### Ocena dydaktyczna

Bardzo dobra. Ten dział najlepiej nadaje się do nauki od zera. Ma dobre tempo, konkretne przykłady i jasne analogie. Wymaga raczej dopracowania struktury niż korekty merytorycznej.

## Pozostałe moduły Python

Ocena: **2/10 na dziś, potencjał 7/10 po uzupełnieniu**

Kategorie:

- `Pydantic Settings`
- `Logging`
- `Pydantic v2`
- `SQLAlchemy 2`
- `Alembic`
- `FastAPI`
- `Uvicorn`
- `FastMCP`
- `Pypika`

### Stan obecny

Większość tych plików to szkice zawierające tytuł, kategorię, źródła i zdanie „Notatki uzupełniane po każdej lekcji”. To nie jest jeszcze materiał merytoryczny.

### Rekomendacja

Nie pokazywać ich jako pełnoprawnych tematów uczniowi, dopóki nie mają minimalnej struktury:

```md
## Po co to jest?
## Minimalny przykład
## Najczęstsze błędy
## Kiedy używać / kiedy nie używać
## 5 fiszek kontrolnych
```

W aplikacji warto rozważyć `status: planowane` albo `hidden: true` dla tych kategorii, dopóki nie zostaną rozwinięte.

## Fiszki

Ocena: **6.5/10**

Stan:

- `openai-agent-sdk.json`: 7 fiszek.
- `pytest-fundamenty.json`: 34 fiszki.
- `pytest-techniki.json`: 8 fiszek.
- `vibe-coding.json`: 26 fiszek.
- `claude-code.json`: 0 fiszek.
- `wzorce-projektowe.json`: 0 fiszek.

### Mocne strony

Fiszki dobrze wspierają powtarzanie materiału Pytest i Vibe Coding. Szczególnie Pytest ma sensowną proporcję pytań podstawowych i praktycznych.

### Problemy

1. Dwa zestawy mają 0 fiszek, więc są puste z punktu widzenia użytkownika.
2. `openai-agent-sdk.json` ma tylko 7 fiszek przy bardzo dużej objętości notatek.
3. Brakuje fiszek typu „rozpoznaj błąd w kodzie”.
4. Brakuje fiszek scenariuszowych: „co zrobisz, jeśli...”.

### Rekomendacja

Dla każdej głównej notatki powinno być minimum:

- 10 fiszek definicyjnych,
- 10 fiszek praktycznych,
- 5 fiszek o błędach,
- 3 fiszki porównawcze,
- 2 fiszki decyzyjne.

Przykłady brakujących fiszek dla Agents SDK:

- Kiedy użyć handoff, a kiedy agent-as-tool?
- Czym różni się input guardrail od output guardrail?
- Co trafia do tracingu i jakie dane mogą być wrażliwe?
- Kiedy nie używać Agents SDK, tylko Responses API?
- Jakie ryzyka ma sandbox przy źle skonfigurowanym manifeście?

## Najważniejsze problemy do poprawy

### 1. Brak wersjonowania źródeł

W notatkach są odwołania do dokumentacji, kursów i narzędzi, ale brakuje daty weryfikacji.

Rekomendacja:

```yaml
verified_at: '2026-05-26'
source_version: 'OpenAI Agents SDK docs, stan na 2026-05-26'
```

### 2. Zbyt długie notatki główne

Największa notatka `notatki_techniczne_Udemy_vibe_coding.md` ma ok. 11 782 słowa. To bardzo dużo jak na materiał do powtórek.

Rekomendacja:

- Notatka główna: syntetyczna mapa tematu.
- Szczegóły: osobne pliki.
- Fiszki: sprawdzenie pamięci.
- Playbooki: instrukcje krok po kroku.

### 3. Zbyt mało jawnych ostrzeżeń „to może się zestarzeć”

Dotyczy szczególnie:

- nazw modeli,
- CLI Claude Code,
- OpenRouter/Ollama/AMP,
- Agents SDK,
- Sandbox Agents,
- MCP,
- provider compatibility.

Rekomendacja:

```md
Sekcja wymagająca okresowej aktualizacji: modele, komendy CLI, API SDK, integracje MCP.
```

### 4. Brak rozdziałów „kiedy nie używać”

Notatki opisują narzędzia pozytywnie, ale dobry materiał merytoryczny powinien uczyć decyzji negatywnych:

- kiedy nie używać agentów,
- kiedy nie mockować,
- kiedy nie robić E2E,
- kiedy nie używać YOLO,
- kiedy nie używać sandboxa,
- kiedy zwykły skrypt jest lepszy od workflow agentowego.

### 5. Brak ćwiczeń kontrolnych przy wielu notatkach

Fiszki są dobre, ale w samych notatkach warto dodać krótkie sekcje:

```md
## Sprawdź, czy rozumiesz
- Pytanie 1
- Pytanie 2
- Mini-zadanie
```

## Priorytetowy plan poprawek

### P1: Poprawki najwyższej wartości

1. Dodać sekcję „Aktualność i wersja” do notatek OpenAI Agents SDK i Vibe Coding.
2. Dopisać zastrzeżenia do Sandbox Agents: izolacja zależy od konfiguracji.
3. Rozbudować fiszki dla OpenAI Agents SDK z 7 do minimum 30.
4. Ukryć lub oznaczyć jako `planowane` szkicowe moduły Python.
5. Skrócić notatkę główną Vibe Coding i zostawić w niej tylko rdzeń.

### P2: Poprawki dydaktyczne

1. Dodać checklists „kiedy używać / kiedy nie używać”.
2. Dodać sekcje „najczęstsze błędy”.
3. Ujednolicić format notatek: cel, pojęcia, przykład, błędy, powtórka.
4. Dodać mini-ćwiczenia do Pytest i Agents SDK.

### P3: Poprawki redakcyjne

1. Ograniczyć retorykę i metafory w notatkach głównych.
2. Przenieść długie analogie do sekcji „wyjaśnienie dla początkujących”.
3. Dodać krótkie streszczenie na początku każdej długiej notatki.
4. Oznaczyć, które linki prowadzą do notatek ukrytych/szczegółowych.

## Wnioski końcowe

Notatki są wartościowe i realnie użyteczne, szczególnie jako osobista baza wiedzy do pracy z agentami AI i testowaniem w Pythonie. Największy potencjał mają trzy obszary:

- `Pytest`: najbardziej dojrzały dydaktycznie.
- `Agenci AI`: bardzo wartościowy, ale wymaga okresowej aktualizacji względem oficjalnych docs.
- `Vibe Coding`: bardzo praktyczny procesowo, ale wymaga skrócenia i mocniejszego rozdziału między faktami, heurystykami i metaforami.

Najważniejszy następny krok: przekształcić tę bazę z „dużych transkrypcyjnych notatek” w system warstwowy:

- notatka główna jako mapa tematu,
- szczegóły jako osobne pliki,
- fiszki jako sprawdzian pamięci,
- playbooki jako instrukcje wykonawcze,
- metadane jako informacja o aktualności.

## Źródła referencyjne użyte do weryfikacji

- OpenAI Agents SDK: Agents — https://openai.github.io/openai-agents-python/agents/
- OpenAI Agents SDK: Guardrails — https://openai.github.io/openai-agents-python/guardrails/
- OpenAI Agents SDK: Tracing — https://openai.github.io/openai-agents-python/tracing/
- OpenAI Agents SDK: Sandbox guide — https://openai.github.io/openai-agents-python/sandbox/guide/
- OpenAI Agents SDK: SandboxAgent reference — https://openai.github.io/openai-agents-python/ref/sandbox/sandbox_agent/
- Pytest documentation: parametrization — https://docs.pytest.org/en/stable/how-to/parametrize.html
- Pytest documentation: contents / fixtures / monkeypatch / tmp_path — https://docs.pytest.org/en/stable/contents.html
