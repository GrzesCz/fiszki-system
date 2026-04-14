---
title: 'Notatki: OpenAI Agents SDK – Rdzeń i Autonomia | Moduł 1'
category: Agenci AI
status: zrobione
type: notatka
mindmaps: []
next_review_date: '2026-04-11'
review_count: 1
---
# Notatki: OpenAI Agents SDK – Rdzeń i Autonomia | Moduł 1

Źródła: oficjalna dokumentacja OpenAI Agents SDK, transkrypcja kursu Udemy, notebook `openai_agents.ipynb`, materiały szkoleniowe DSM PRO.

**Temat:** Framework OpenAI Agents SDK — budowanie agentów AI, asynchroniczność, narzędzia (tools), delegowanie zadań (hand-offs), ustrukturyzowane wyjście (structured output), bariery ochronne (guardrails), MCP, cykl życia agenta (hooks), wzorce orkiestracji.

**Dodatkowe materiały (wyodrębnione szczegóły):**
- 📘 [Agent — konstruktor i parametry (SDK)](/notatki/openai-agents-sdk/openai-agents-sdk-konstruktor) (pełna tabela parametrów, typy generyczne)
- 📙 [Katalog narzędzi (Tools) SDK](/notatki/openai-agents-sdk/openai-agents-sdk-narzedzia) (tabele hosted/local/function, koszty, importy)
- 📗 [Programowanie Asynchroniczne (async/await) w Pythonie](/notatki/openai-agents-sdk/openai-agents-sdk-asyncio) (korutyny, event loop, gather)
- 📬 [Context7 + przykład Outlook — `params`, library ID, kod](/notatki/openai-agents-sdk/openai-agents-sdk-context7) (dwa etapy: silnik MCP vs cel dokumentacji)
- 🔌 [Zarządzanie wieloma MCP i FastMCP](/notatki/openai-agents-sdk/openai-agents-sdk-mcp) (`AsyncExitStack`, podłączanie z GitHuba, różnica między `@function_tool` a własnym MCP)
- 🧩 [Zaawansowana Orkiestracja](/notatki/openai-agents-sdk/openai-agents-sdk-orkiestracja) (wzorce architektoniczne dla wielu agentów, organizacja plików komercyjnego projektu)
- ⭐ [10 Rekomendacji Inżynieryjnych](/notatki/openai-agents-sdk/openai-agents-sdk-10-rekomendacji) (dekalog pracy z systemami AI wyciągnięty z doświadczeń eksperckich)
- 📓 Learning Loop – zadania i rozwiązania — notebook `learning_loop_zadania.ipynb` w folderze kursu (poza tym repozytorium)

---

## Spis treści

1. [Czym jest OpenAI Agents SDK? (Pralka vs Pranie ręczne)](#czym-jest-openai-agents-sdk)
2. [Tworzenie i uruchamianie Agenta](#tworzenie-i-uruchamianie-agenta)
3. [Modele innych dostawców](#korzystanie-z-modeli-innych-dostawców)
4. [Narzędzia (Tools)](#narzędzia-tools--ręce-i-oczy-agenta)
5. [Delegowanie zadań (Hand-offs)](#delegowanie-zadań-hand-offs)
6. [Structured Output (Pydantic)](#ustrukturyzowane-dane-wyjściowe-structured-output)
7. [Guardrails – bariery ochronne](#bariery-ochronne-guardrails)
8. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
9. [Lifecycle Callbacks (RunHooks)](#lifecycle-callbacks-runhooks)
10. [Orkiestracja i wzorce zrównoleglania](#orkiestracja-i-wzorce-zrównoleglania)
11. [10 Rekomendacji Inżynieryjnych](/notatki/openai-agents-sdk/openai-agents-sdk-10-rekomendacji)

**Szczegóły (osobne pliki):** [async/await](/notatki/openai-agents-sdk/openai-agents-sdk-asyncio) · [konstruktor `Agent`](/notatki/openai-agents-sdk/openai-agents-sdk-konstruktor) · [katalog narzędzi SDK](/notatki/openai-agents-sdk/openai-agents-sdk-narzedzia) · [Context7/Outlook](/notatki/openai-agents-sdk/openai-agents-sdk-context7) · [Zaawansowane MCP](/notatki/openai-agents-sdk/openai-agents-sdk-mcp) · [Architektura Projektu](/notatki/openai-agents-sdk/openai-agents-sdk-orkiestracja) · [10 Rekomendacji](/notatki/openai-agents-sdk/openai-agents-sdk-10-rekomendacji)

---

## Czym jest OpenAI Agents SDK?

### Zagadnienie
Czym różni się OpenAI Agents SDK od innych frameworków i od ręcznego pisania agentów (czysty `openai` API).

---

### Opis

Frameworki do budowy agentów AI dzielą się na dwa obozy:
- **Opinionated (wymuszające opinię):** np. LangChain, LangGraph. Narzucają własne ciężkie struktury i określony sposób budowania grafów. Stroma krzywa uczenia — jak podręcznik na 800 stron o gotowaniu.
- **Non-opinionated (lekkie i elastyczne):** np. **OpenAI Agents SDK**. Dają prosty zestaw niezależnych klocków (Agent, Runner, Narzędzie), które programista łączy po swojemu zwykłym kodem Pythona.

**Analogia (Pralka vs Pranie ręczne):**

Pisanie agentów od zera za pomocą czystego API OpenAI to jak **pranie ręczne**. Musisz samodzielnie budować ogromne słowniki JSON definiujące schematy narzędzi (~20 linii szablonu), pisać pętle `while not done` iterujące po odpowiedziach modelu, parsować argumenty i pisać bloki `if tool_name == ... elif tool_name == ...` do wywołania odpowiedniej funkcji Pythona.

OpenAI Agents SDK to jak **pralka automatyczna**. Podajesz zwykłą funkcję w Pythonie, a framework "pod maską":
- Tłumaczy argumenty funkcji (wykorzystując `type hints`) na schemat JSON zrozumiały dla LLM.
- Wyciąga opis z docstringa funkcji (`"""Opis"""`) i informuje model, kiedy ma użyć narzędzia.
- Samodzielnie wywołuje Twoją funkcję, przekazuje do niej argumenty wymyślone przez LLM, a następnie podaje modelowi wynik.

Dzięki temu skupiasz się wyłącznie na logice biznesowej, odkładając na bok mechaniczną "ceremonię".

---

## Tworzenie i uruchamianie Agenta

### Zagadnienie
Jak zainstalować SDK, zdefiniować agenta, uruchomić go, korzystać z asynchroniczności, śledzić proces (Tracing) i stosować strumieniowanie (Streaming).

---

### Opis

#### Instalacja

```bash
pip install openai-agents
```

> ⚠️ Framework instaluje się pod pakietem `agents`. Nie nazywaj swoich własnych plików `agents.py` — nadpiszesz bibliotekę i dostaniesz błąd importu!

#### Budowa obiektu Agent

`Agent` to paczka z instrukcjami (system prompt) dla konkretnego "pracownika". Zawsze podaj co najmniej **nazwę** i **instrukcje**.

```python
from agents import Agent

agent = Agent(
    name="Jokester",
    instructions="Jesteś specjalistą od opowiadania sucharów. Bądź krótki i abstrakcyjny.",
    model="gpt-4o-mini"
)
```

Pełna tabela parametrów (w tym `tools`, `handoffs`, `output_type`, `model_settings`, `hooks`, `mcp_servers` i inne) → **[Agent — konstruktor i parametry](/notatki/openai-agents-sdk/openai-agents-sdk-konstruktor)**.

#### Uruchamianie (Runner) i pułapka `await`

Ponieważ każde zapytanie do LLM oznacza czekanie na sieć (operacja I/O), framework jest zbudowany na mechanizmach asynchronicznych. Uruchomieniem agenta zarządza klasa `Runner`.

❌ **Częsty błąd początkującego:**

```python
result = Runner.run(agent, "Opowiedz żart")
print(result)  # Wydrukuje <coroutine object> i NIC się nie wykona!
```


✅ **Prawidłowe użycie:**

```python
result = await Runner.run(agent, "Opowiedz żart")
print(result.final_output)
```

**W Jupyterze** `await` działa bezpośrednio w komórce. **W pliku `.py`** musisz opakować kod w `async def` i uruchomić pętlą zdarzeń:

```python
import asyncio

async def main():
    result = await Runner.run(agent, "Opowiedz żart")
    print(result.final_output)

asyncio.run(main())
```

Co oznacza `<coroutine object>` i czym jest **coroutine**, dlaczego asynchroniczność jest ważna oraz jak działa `asyncio.gather` do zrównoleglania ? → **[Programowanie Asynchroniczne](/notatki/openai-agents-sdk/openai-agents-sdk-asyncio)**.

### Śledzenie procesu (Tracing)

Jedno zapytanie do agenta może skutkować wieloma interakcjami (model myśli → uruchamia narzędzie → czyta wynik → myśli dalej). Aby to monitorować, owijasz kod w blok `with trace()`.

W konsoli **https://platform.openai.com/traces** widzisz dokładne kroki, prompty, zużycie tokenów i czasy wykonania — to "czarna skrzynka" agenta.

```python
from agents import Agent, Runner, trace

async def main():
    with trace("Wymuszanie żartu - sesja 1"):
        result = await Runner.run(agent, "Znasz żart o programistach?")
        print(result.final_output)
```

### Strumieniowanie (Streaming)

**Co to jest i po co nam to? (Analogia z pociągiem)**  
Wyobraź sobie, że zamówiłeś 100 wagonów węgla.  
W standardowym użyciu (`Runner.run`) siedzisz na stacji i czekasz... i czekasz... aż całe 100 wagonów zostanie załadowane i wszystkie na raz przyjadą pod Twój dom. To trwa. Ekran jest pusty, użytkownik myśli, że program się zawiesił.

**Strumieniowanie (`Runner.run_streamed`)** to sytuacja, w której węgiel dociera do Ciebie **wagon po wagonie**, tuż po załadowaniu pierwszego. Od razu zaczynasz go zrzucać i pokazywać użytkownikowi. Dokładnie tak działa ChatGPT – nie czekasz na cały wygenerowany akapit, tylko widzisz, jak literki pojawiają się na ekranie **w czasie rzeczywistym**. To daje iluzję szybkości i świetny User Experience (UX). Używasz tego głównie wtedy, gdy tworzysz interfejsy dla ludzi (czatboty, okienka w konsoli).

**Jak to działa w kodzie:**  
Zauważ kluczową różnicę: przy `run_streamed()` **NIE ma słówka `await` przed wywołaniem!** Dlaczego? Ponieważ to wywołanie nie czeka na powrót całego pociągu. Od razu zwraca Ci swoistą "rurę" (obiekt generatora asynchronicznego), do której po chwili zaczną wpadać pojedyncze literki (tokeny) z serwera OpenAI. My tylko stajemy na końcu tej rury w pętli `async for` i wyłapujemy to, co wylatuje.

```python
from openai.types.responses import ResponseTextDeltaEvent
from agents import Agent, Runner

# 1. Brak 'await' tutaj! Zwraca "rurę", z której będą lecieć dane.
result = Runner.run_streamed(agent, input="Napisz mi wiersz o kodowaniu")

# 2. Asynchroniczna pętla: stajemy przy "rurze" i czekamy na kolejne kawałki (eventy)
async for event in result.stream_events():
    # Model wysyła różne rzeczy (np. informacje o użyciu narzędzi).
    # Nas interesuje tylko ten event, który zawiera surowy kawałek generowanego tekstu (deltę).
    if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
        # Wypisujemy na ekran na bieżąco, wymuszając natychmiastowe pokazanie (flush=True)
        print(event.data.delta, end="", flush=True)
```

### Odniesienia
- [Running agents – dokumentacja SDK](https://openai.github.io/openai-agents-python/running_agents/)
- [Streaming – dokumentacja SDK](https://openai.github.io/openai-agents-python/streaming/)

---

## Korzystanie z modeli innych dostawców

### Zagadnienie
Framework nosi nazwę "OpenAI", ale pozwala podłączyć dowolny model zewnętrzny (DeepSeek, Gemini, Llama przez Groq, Claude), pod warunkiem, że dostawca posiada endpoint zgodny ze standardem **Chat Completions**.

---

### Opis

Jeżeli pole `model` w Agencie zdefiniujesz stringiem (np. `"gpt-4o-mini"`), użyte zostaną domyślne serwery OpenAI. Framework posiada jednak klasę `OpenAIChatCompletionsModel`, dzięki której dostarczasz klienta skierowanego na inny serwer. 

Mechanizm jest **identyczny dla każdego dostawcy**. Różnią się jedynie wartości: **`base_url`**, **klucz API** oraz **nazwa modelu**. Z punktu widzenia działania Agenta (tools, handoffs, guardrails) nic się nie zmienia.

```python
from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel, Agent

# 1. Tworzysz klienta podając adres URL obcej platformy i jej klucz
zewnetrzny_klient = AsyncOpenAI(
    base_url="<TUTAJ_ADRES_URL>", 
    api_key="<TUTAJ_KLUCZ_API>"
)

# 2. Tworzysz "pomost" pomiędzy modelem a frameworkiem OpenAI Agents SDK
model_obcy = OpenAIChatCompletionsModel(
    model="<NAZWA_MODELU>", 
    openai_client=zewnetrzny_klient
)

# 3. Przypisujesz "obcy" model do Agenta
agent = Agent(
    name="Wszechstronny Agent",
    instructions="Pomagaj rozwiązywać problemy.",
    model=model_obcy
)
```

#### Popularne `base_url` do testów:
- **DeepSeek:** `https://api.deepseek.com/v1`
- **Gemini (Google):** `https://generativelanguage.googleapis.com/v1beta/openai/`
- **Groq (szybkie modele np. Llama):** `https://api.groq.com/openai/v1`
- **Anthropic (Claude):** `https://api.anthropic.com/v1/`

**Ważne zastrzeżenie do Anthropic (Claude):** 
Warstwa kompatybilności udostępniana przez Anthropic jest przeznaczona głównie do **testów i porównywania modeli**, a nie jako w pełni funkcjonalne środowisko produkcyjne. Posiada ograniczenia (np. brak wymuszania trybu `strict` w narzędziach, brak wsparcia dla natywnego "Prompt Caching" z Anthropic). Alternatywą dla projektów produkcyjnych jest użycie agregatora, takiego jak **OpenRouter**.

### Odniesienia
- [Models – dokumentacja SDK](https://openai.github.io/openai-agents-python/models/)
- [OpenAI SDK compatibility – Anthropic (Claude API)](https://docs.anthropic.com/en/api/openai-sdk)

---

## Narzędzia (Tools) – Ręce i Oczy Agenta

### Zagadnienie
Bez narzędzi Agent polega jedynie na wyuczonej wiedzy. Narzędzia pozwalają mu oddziaływać na świat: wysyłać maile, przeszukiwać internet, wołać inne API i agentów.

---

### Opis

#### 1. Własne funkcje (`@function_tool`)

Każdą funkcję Pythona zamienisz na narzędzie trzema rzeczami: dekoratorem, typowaniem argumentów i docstringiem.

```python
from agents import function_tool

@function_tool
def wyslij_email(adres: str, tresc: str):
    """Narzędzie do wysyłania e-maila transakcyjnego do klienta."""
    return f"Pomyślnie wysłano wiadomość na {adres}"

agent = Agent(
    name="Mailer",
    instructions="Wyślij e-mail jeśli zostaniesz o to poproszony.",
    tools=[wyslij_email]
)
```

Pod maską SDK bierze te informacje i buduje dla LLM gotową instrukcję:
- **Docstring** (`"""Komentarz pod funkcją"""`) trafia do **opisu narzędzia**. Model uczy się z niego, *do czego* służy funkcja i *kiedy* ma jej użyć.
- **Typowanie (Type hints)** (`str`, `int`) SDK w locie zamienia na **schemat JSON parametrów**. Model dowiaduje się stąd, jakie dane (i w jakim formacie) musi przygotować, by wywołać narzędzie. (Dzięki temu nie piszesz tego JSON-a ręcznie).
- Efektem jest obiekt `FunctionTool` — paczka z nazwą, opisem i wymaganymi argumentami gotowa do wysłania do modelu.

#### 2. Narzędzia hostowane przez OpenAI

SDK udostępnia wbudowane narzędzia wykonywane na serwerach OpenAI, np.:
- **`WebSearchTool`** — przeszukiwanie internetu (parametr `search_context_size`: `"low"` / `"medium"` / `"high"` wpływa na cenę i bogactwo kontekstu).
- **`FileSearchTool`** — wyszukiwanie w Vector Stores (np. własne bazy wiedzy / dokumenty).
- **`CodeInterpreterTool`** — wykonanie kodu w bezpiecznym środowisku (sandboxie) po stronie serwera.
- **`ImageGenerationTool`** — generowanie obrazów przy użyciu modelu np. DALL-E.
- **`HostedMCPTool`** — użycie narzędzi udostępnianych przez odległy serwer w architekturze MCP.

A także narzędzia wykonywane na Twojej, lokalnej maszynie:
- **`ComputerTool`** — automatyzacja klikania, scrollowania, robienia zrzutów ekranu.
- **`ShellTool`** — bezpośrednie wykonywanie komend w Twoim terminalu (bądź w lokalnym kontenerze).

Użycie hostowanego search (WebSearchTool) jest **dodatkowo płatne** (centy za wywołanie). Warto monitorować rachunek i trzymać się tańszych modeli (np. `gpt-4o-mini`) przy research.

```python
from agents import WebSearchTool

agent = Agent(
    name="Badacz",
    instructions="Odpowiadaj na podstawie aktualnych wyników z internetu.",
    tools=[WebSearchTool(search_context_size="low")]
)
```

Pełna lista narzędzi (hosted, lokalne, function) → **[Katalog narzędzi (Tools) SDK](/notatki/openai-agents-sdk/openai-agents-sdk-narzedzia)**.

#### 3. Inny Agent jako Narzędzie (`as_tool`)

Agent nie musi korzystać tylko z prostych funkcji — może mieć do dyspozycji kompetencje **innego Agenta**. Działa to jak hierarchia szef-pracownik: szef wywołuje pracownika, czeka aż pracownik dostarczy wynik, **zbiera go** i **kontynuuje swoją pracę**. Kontrola wraca do szefa.

```python
spanish_agent = Agent(
    name="Agent hiszpański",
    instructions="Tłumaczysz wiadomość użytkownika na język hiszpański",
)

french_agent = Agent(
    name="Agent francuski",
    instructions="Tłumaczysz wiadomość użytkownika na język francuski",
)

orchestrator = Agent(
    name="Orkiestrator",
    instructions="Używasz narzędzi do tłumaczenia. Wywołujesz odpowiednie narzędzia.",
    tools=[
        spanish_agent.as_tool(
            tool_name="translate_to_spanish",
            tool_description="Przetłumacz na język hiszpański",
        ),
        french_agent.as_tool(
            tool_name="translate_to_french",
            tool_description="Przetłumacz na język francuski",
        ),
    ],
)
```

W **OpenAI Traces** widać różnicę: narzędzie z agentem pod spodem ma podpięty dodatkowy przebieg LLM; zwykła `@function_tool` to tylko wywołanie funkcji z argumentami.

### Odniesienia
- [Tools – dokumentacja SDK](https://openai.github.io/openai-agents-python/tools/)

---

## Delegowanie zadań (Hand-offs)

### Zagadnienie
Czym różni się Narzędzie (`tools`, `as_tool`) od Przekazania (`handoffs`) w architekturze wielu agentów i jak łączyć oba mechanizmy.

---

### Opis

**Narzędzie (`as_tool`)** — wyobraź sobie kucharza, który mówi pomocnikowi "Posiekaj cebulę". Pomocnik sieka, **oddaje miskę kucharzowi** i kucharz kończy danie. Kontrola **wraca** do głównego agenta.

**Handoff** — wyobraź sobie recepcję u dentysty. Opowiadasz swój problem, recepcjonistka stwierdza: "Proszę przejść do pokoju 2, do specjalisty". W tym momencie jej rola się **kończy**. Specjalista przejmuje rozwiązanie. Kontrola **nie wraca** do głównego agenta.

| | **Narzędzie (`as_tool`)** | **Handoff** |
|---|---|---|
| **Kontrola** | Wywołujesz → dostajesz wynik → **kontynuujesz** | **Oddajesz kontrolę** — dalej prowadzi drugi agent |
| **Analogia** | Pomocnik przy Twoim stole | Delegacja całego zadania specjaliście |

```python
ekspert_historii = Agent(
    name="Korepetytor historii",
    handoff_description="Specjalistyczny agent do pytań historycznych",
    instructions="Udzielasz pomocy w zakresie pytań historycznych.",
)

ekspert_matmy = Agent(
    name="Korepetytor matematyki",
    handoff_description="Specjalistyczny agent do pytań matematycznych",
    instructions="Pomagasz w rozwiązywaniu zadań matematycznych.",
)

triage = Agent(
    name="Agent triage",
    instructions="Decydujesz, którego agenta użyć na podstawie pytania użytkownika.",
    handoffs=[ekspert_historii, ekspert_matmy]
)
```

#### `tools` i `handoffs` jednocześnie u jednego agenta

Ważny wzorzec z kursu: **kierownik** ma jednocześnie listę **`tools`** (np. trzej agenci sprzedaży jako `as_tool` + funkcja wysyłki e-maila) **oraz** **`handoffs`** (np. do agenta-mailera/formatera). Typowy przebieg: model wielokrotnie woła narzędzia (generuje warianty), sam ocenia, potem **handoffem** przekazuje wybraną treść agentowi od wysyłki — tam kończy się rola kierownika.

W kodzie **rozdzielasz** `tools` (odpowiedź-zwrot, praca przy Twoim stole) od `handoffs` (delegacja kontroli na resztę procesu).

### Odniesienia
- [Handoffs – dokumentacja SDK](https://openai.github.io/openai-agents-python/handoffs/)

---

## Ustrukturyzowane dane wyjściowe (Structured Output)

### Zagadnienie
Wymuszenie na Agencie, by zamiast luźnego tekstu zwrócił uporządkowany obiekt Pythona (JSON sparsowany do Pydantic) według ustalonego schematu.

---

### Opis

Agent domyślnie zwraca `str`. Ale w kodzie potrzebujesz obiektów, nie "gadania". Zamiast parsować tekst wyrażeniami regularnymi, definiujesz klasę `BaseModel` z biblioteki **Pydantic**, a za pomocą `Field(description="...")` tłumaczysz modelowi, czym jest dana zmienna. Strukturę podajesz w polu `output_type` Agenta.

```python
from pydantic import BaseModel, Field

class WebSearchItem(BaseModel):
    reason: str = Field(description="Twoje uzasadnienie, dlaczego chcesz wyszukać to hasło.")
    query: str = Field(description="Konkretna fraza do wpisania w wyszukiwarkę.")

class WebSearchPlan(BaseModel):
    searches: list[WebSearchItem] = Field(description="Lista wyszukiwań.")

planner_agent = Agent(
    name="Planista",
    instructions="Wymyśl 3 frazy do wyszukania w internecie.",
    model="gpt-4o-mini",
    output_type=WebSearchPlan
)
```

Po wywołaniu `result = await Runner.run(planner_agent, "...")` zmienna `result.final_output` to gotowy obiekt `WebSearchPlan` z dostępem do `result.final_output.searches[0].query` itd.

**Dlaczego `reason` przed `query`?** Model generuje JSON pole po polu (od góry do dołu). Wpisując najpierw `reason` (uzasadnienie), model "zmusza się" do przemyślenia kontekstu — wnioski z `reason` pozytywnie wpływają na jakość generowanego `query`. To technika analogiczna do **Chain-of-Thought** — ale na poziomie struktury schematu, nie promptu.

**Pod spodem:** `output_type` to nie magia — model generuje **JSON** zgodny ze schematem; SDK **parsuje** go do obiektu Pydantic.

**Inny przykład z notebooka** (ten sam mechanizm, inny kontekst):

```python
class Step(BaseModel):
    explanation: str
    equation: str

class QuadraticSolution(BaseModel):
    steps: list[Step]
    solutions: list[float]

quad_agent = Agent(
    name="Korepetytor matematyki",
    instructions="Rozwiąż równanie kwadratowe krok po kroku.",
    output_type=QuadraticSolution
)
```

Po wywołaniu `result = await Runner.run(quad_agent, "Rozwiąż …")` zmienna `result.final_output` to gotowy obiekt `QuadraticSolution`: masz np. `result.final_output.steps` (lista kroków), w każdym kroku `step.explanation` i `step.equation`, oraz na końcu `result.final_output.solutions` (lista liczb — miejsca zerowe).

**Dlaczego najpierw `steps`, a dopiero potem `solutions`?** Model wypełnia JSON od góry schematu: najpierw buduje **łańcuch kroków** (rozumowanie), dopiero na końcu wypisuje **gotowe liczby**. Wewnątrz każdego `Step` kolejność **`explanation` → `equation`** też nakazuje najpierw uzasadnić krok, potem zapisać je w postaci równania — to ten sam pomysł co *chain-of-thought*, tylko zapisany w polach Pydantic zamiast w jednym bloku tekstu.

**Pod spodem:** jak wyżej — model generuje **JSON** zgodny ze schematem, SDK **parsuje** go do `QuadraticSolution`.

### Odniesienia
- [Pydantic – BaseModel](https://docs.pydantic.dev/latest/concepts/models/)

---

## Bariery Ochronne (Guardrails)

### Zagadnienie
Zatrzymywanie wykonywania Agenta, jeśli dane wejściowe lub odpowiedź uderzają w zdefiniowane reguły bezpieczeństwa/biznesowe.

---

### Opis

Guardrails to funkcje przechwytujące kontrolę na **wejściu** (`input_guardrails`) lub **wyjściu** (`output_guardrails`). Zwracają obiekt `GuardrailFunctionOutput`, w którym kluczowe jest pole `tripwire_triggered`. 

**Czym jest `tripwire_triggered`?**
W dosłownym tłumaczeniu "tripwire" to lina-pułapka, potykacz. W wojsku lub na polowaniach to ukryty drut, którego zerwanie uruchamia alarm lub ładunek wybuchowy. 
W kontekście frameworka to po prostu **zmienna logiczna (True/False)**, która odpowiada na jedno zasadnicze pytanie: *"Czy ta wiadomość naruszyła zasady?"*. 
Gdy zwrócisz wartość `True` (bomba wybuchła), SDK bezwzględnie przerywa przepływ całego programu i rzuca w Pythonie krytyczny wyjątek `InputGuardrailTripwireTriggered` (lub `OutputGuardrailTripwireTriggered`). Dalsze kroki agenta nigdy się nie wykonają.

**Szczególność guardrails w SDK:** wewnątrz funkcji guardrail możesz **odpalić osobnego agenta** z `output_type` — to LLM ocenia treść, nie prosty `if`. Oto przykład prosto z notebooka:

```python
from pydantic import BaseModel
from agents import Agent, Runner, input_guardrail, GuardrailFunctionOutput, InputGuardrailTripwireTriggered

class MathHomeworkOutput(BaseModel):
    is_math_homework: bool

@input_guardrail
async def math_guardrail(ctx, agent, input) -> GuardrailFunctionOutput:
    # ctx to tzw. Kontekst (paczka danych o tym konkretnym przebiegu).
    # Przekazujemy ctx.context do Runnera wewnątrz, by "mały agent sprawdzający" 
    # wiedział, do którego "głównego procesu" należy to zapytanie (np. do spięcia logów w jedno drzewko w Traces).
    
    guardrail_agent = Agent(
        name="Sprawdzenie guardraila",
        instructions="Sprawdź, czy użytkownik prosi Cię o rozwiązanie jego zadania domowego z matematyki.",
        output_type=MathHomeworkOutput,
    )
    result = await Runner.run(guardrail_agent, input, context=ctx.context)

    # Zwracamy wynik działania bariery.
    # Jeśli tripwire_triggered będzie wynosić True (Agent wykrył próbę oszustwa),
    # Framework OpenAI Agents natychmiast zatrzyma cały proces główny
    # i rzuci błędem w kodzie Pythona (wyjątek InputGuardrailTripwireTriggered).
    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_math_homework,
    )

agent = Agent(
    name="Agent wsparcia klienta",
    instructions="Jesteś agentem wsparcia klienta. Pomagasz klientom w ich pytaniach.",
    input_guardrails=[math_guardrail],
)
```

**Użycie (obsługa wyjątku po stronie wywołującego):**

```python
try:
    await Runner.run(agent, "Cześć, czy możesz mi pomóc rozwiązać równanie: 2x + 3 = 11?")
except InputGuardrailTripwireTriggered:
    print("Guardrail aktywowany — zablokowano prośbę o zadanie domowe!")
```

Zwróć uwagę na wzorzec: guardrail **nie** rzuca wyjątku sam — **zwraca** obiekt z `tripwire_triggered=True`, a SDK sam decyduje o przerwaniu. Wyjątek łapiesz na poziomie głównej aplikacji (`try/except`).

### Odniesienia
- [Guardrails – dokumentacja SDK](https://openai.github.io/openai-agents-python/guardrails/)

---

## MCP (Model Context Protocol)

### Zagadnienie
Czym jest MCP i jak podłączać zewnętrzne pakiety narzędzi do agenta za pomocą tego protokołu, zyskując potężne możliwości bez pisania kodu od zera.

---

### Opis

**Czym jest MCP? (Analogia z USB-C)**  
Twórcy standardu (firma Anthropic) nazywają go "USB-C dla AI". Nie jest to nowy framework do pisania agentów, ani zmiana samego sposobu działania LLM-ów. To po prostu **uniwersalny standard wtyczki**. 
Dzięki niemu jedna osoba może napisać świetne narzędzie (np. do obsługi bazy danych czy przeglądarki), a tysiące innych mogą podłączyć je do swojego systemu jednym kablem. Tworzy to potężny, społecznościowy ekosystem gotowych narzędzi (dziesiątki tysięcy paczek).

**Architektura MCP – 3 główne pojęcia:**

1. **Host MCP:** Cała Twoja aplikacja (tworzony program), w której "żyje" Twoja sztuczna inteligencja. W innych przypadkach to może być np. środowisko *Claude Desktop* czy *Cursor*, a u nas — kod napisany w **OpenAI Agents SDK** (obiekt `Agent` oraz `Runner`).
2. **Klient MCP:** Wbudowany we framework mechanizm (część `Hosta`), który wie, w jakim języku rozmawiać z obcym oprogramowaniem. Kiedy w konstruktorze agenta przypisujesz `mcp_servers=[context7_server]`, SDK uruchamia pod maską "Klienta MCP". On wtyka "kabel" do narzędzia, wysyła żądania w standardzie protokołu i odbiera odpowiedzi. 
3. **Serwer MCP:** Paczka obcego kodu, która fizycznie wykonuje zadanie (np. pobiera strony, czyta pliki). I tu **ważne uściślenie**: słowo "serwer" jest dla wielu mylące! Rzadko kiedy jest to zdalna maszyna gdzieś w chmurze (np. na AWS). Zazwyczaj "Serwer MCP" to po prostu skrypt, który pobierasz z internetu i uruchamiasz jako osobny proces **na własnym komputerze w tle** (np. przez `npx` lub `uvx`). Twój Host łączy się z nim lokalnie.

### Stdio – jak kable w komputerze się dogadują

Zanim przejdziemy do kodu, wyjaśnijmy dlaczego w importach z frameworka pojawia się klasa `MCPServerStdio`.
Słowo **Stdio** to w świecie programowania skrót od *Standard Input/Output*. Oznacza to po prostu **czarne okienko terminala**. Kiedy w Agencie konfigurujesz serwer MCP w trybie Stdio, nie używasz gniazdek sieciowych (np. portów HTTP) ani Wi-Fi, żeby połączyć się z czymś w internecie. 

Zamiast tego, Twój kod OpenAI Agents SDK (działający jako Klient) zachowuje się tak, jakbyś sam otworzył drugi terminal na swoim komputerze, wpisał w nim komendę startującą narzędzie (ten pobrany z internetu skrypt, o którym mowa wyżej) i wcisnął Enter. Następnie... **czyta on tekst, który to narzędzie wypisuje na ekran konsoli, po czym sam wpisuje polecenia bezpośrednio "z klawiatury"**.  

`MCPServerStdio` to mechanizm, który pozwala Twojemu programowi odczytywać komunikaty i wysyłać komendy do innej lokalnej aplikacji uruchomionej w tle, imitując działanie człowieka wklepującego komendy. Najprostszy z możliwych i niezwykle bezpieczny sposób komunikacji lokalnej! To w pełni potwierdza fakt, że znakomita większość "Serwerów MCP" to po prostu skrypty `npx` lub `uvx` pobierane i odpalane bezpośrednio u Ciebie na dysku.

#### Skąd wziąć `params`? — czyli co wpisać w słownik

To jest **kluczowe pytanie** i jednocześnie źródło największego zamieszania u początkujących. Zacznijmy od tego, czym `params` w ogóle jest.

`params` to **zwykła komenda terminalowa rozłożona na dwa kawałki**: `"command"` (program do uruchomienia) i `"args"` (argumenty dla tego programu). Nic więcej. Gdybyś ręcznie wpisał to w czarne okienko terminala, wyglądałoby to tak:

```
uvx mcp-server-fetch
npx -y @playwright/mcp@latest
npx -y @modelcontextprotocol/server-filesystem /sciezka/do/folderu
```

W `params` rozbijamy to samo polecenie na słownik:

| Komenda w terminalu | `"command"` | `"args"` |
|---|---|---|
| `uvx mcp-server-fetch` | `"uvx"` | `["mcp-server-fetch"]` |
| `npx -y @playwright/mcp@latest` | `"npx"` | `["-y", "@playwright/mcp@latest"]` |
| `npx -y @modelcontextprotocol/server-filesystem ./sandbox` | `"npx"` | `["-y", "@modelcontextprotocol/server-filesystem", "./sandbox"]` |

**`"command"` zależy od języka, w jakim napisano serwer MCP:**

- **`uvx`** — runner dla paczek Pythona (z narzędzia `uv`). Jeśli serwer MCP jest paczką Pythona — użyjesz `uvx`.
- **`npx`** — runner dla paczek Node.js (JavaScript). Jeśli serwer MCP jest paczką JS/npm — użyjesz `npx`.

Oba robią dokładnie to samo: **pobierają paczkę z internetu (jeśli jeszcze jej nie ma) i natychmiast ją uruchamiają**. Flaga `-y` przy `npx` oznacza "tak, zainstaluj bez pytania" (żeby program nie czekał na potwierdzenie od człowieka).

**Ale skąd wziąć konkretną nazwę paczki i argumenty?**

Z dokumentacji danego serwera MCP. Każdy serwer MCP to po prostu czyjaś paczka opublikowana w internecie (na npm lub PyPI). Autor serwera w swoim README pisze: "Uruchom mnie tak: `npx @playwright/mcp@latest`" — i to jest **dokładnie** to, co wpisujesz w `params`.

Żeby nie szukać po omacku, istnieją **marketplace'y i katalogi MCP** — miejsca, gdzie można znaleźć serwery i gotowe komendy do `params`:

- [mcp.so](https://mcp.so)
- [glama.ai/mcp](https://glama.ai/mcp)
- [smithery.ai](https://smithery.ai/)
- [Composio MCP](https://docs.composio.dev/docs/mcp-developers) — **to nie jest „ten sam typ” co trzy powyżej**: Composio to **platforma integracji** (setki aplikacji, OAuth, MCP jako sposób podłączenia agenta), a nie tylko indeks społecznościowych paczek `npx`/`uvx`. Przydatne, gdy chcesz gotowe połączenia z usługami (poczta, kalendarz, CRM itd.), zamiast szukać pojedynczego serwera w katalogu.

#### Sklep z kablami a Centrala z Asystentem (Composio vs reszta)

Żeby lepiej zrozumieć różnicę między zwykłym `mcp.so` a `Composio`, wyobraź sobie **sklep z kablami** w porównaniu do **wielkiej centrali telefonicznej z asystentem**:

1. **Sklep z kablami (mcp.so, Smithery):** Znajdujesz tam "czyste" narzędzie, pobierasz do siebie (przez `npx`) i używasz lokalnie. Cała brudna robota leży po Twojej stronie: jeśli np. chcesz podłączyć GitHuba, musisz sam wygenerować API Key, wkleić do pliku `.env`, napisać kod i dbać o to. Tokeny z niczym na zewnątrz się nie synchronizują. To idealne, gdy stawiasz na najwyższą prywatność i chcesz by połączenie API szło z Twojego komputera bezpośrednio do usługi.
2. **Centrala z asystentem (Composio MCP):** Rejestrujesz się w Composio. Tam, w przeglądarce, ładnym panelem wyklikujesz "Połącz mojego Slacka" i autoryzujesz się kontem Google (OAuth). Potem uruchamiasz u siebie tylko **jeden serwer MCP** (od Composio), który działa jak "rura" do ich chmury. Wtedy to chmura Composio odpytuje Twojego Slacka przy użyciu zachowanych u siebie Twoich tokenów. Odpada Ci potężny ból głowy z programowaniem logowania (szczególnie protokołu OAuth 2.0).

W skrócie: Composio uwalnia od problemów z autoryzacją API za cenę wpuszczenia trzeciej usługi (jako pośrednika) do Twoich danych.

#### Uruchomienie Composio MCP w kodzie Agentów

Composio dostarcza paczkę Node.js (`@composio/core`) oraz gotowe wsparcie dla Composio MCP z własnym kluczem autoryzacji:

```python
import os
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

# Musisz mieć wcześniej konto na Composio i pobrać klucz API
composio_api_key = os.environ.get("COMPOSIO_API_KEY")

# Podpinamy centralę Composio
async with MCPServerStdio(
    params={
        "command": "npx",
        "args": ["-y", "composio-core", "mcp"],
        "env": {
            "COMPOSIO_API_KEY": composio_api_key,
        }
    },
    client_session_timeout_seconds=60,
) as composio_server:
    
    agent = Agent(
        name="Asystent Composio",
        instructions="Wykonuj zadania używając dostępnych narzędzi Composio.",
        model="gpt-4.1",
        mcp_servers=[composio_server],
    )
    
    result = await Runner.run(agent, "Sprawdź na GitHubie ostatnie issues w moim repozytorium")
```

*(Wskazówka: Alternatywnie dla Composio w Pythonie istnieje SDK `composio`, którego serwer można wygenerować i udostępnić programistycznie za pomocą `composio.mcp.create`, ale najprostsze włączenie dla Agenta przez Stdio opiera się o powyższego runnera terminalowego).*

Wchodzisz, szukasz np. "filesystem" albo "playwright", klikasz w wynik — i dostajesz gotową instrukcję z komendą do uruchomienia. Kopiujesz ją do `params` i gotowe.

**Podsumowując:** Nie musisz niczego wymyślać. `params` to **przepisana z dokumentacji serwera komenda terminalowa**, rozbita na `"command"` i `"args"`.

#### Użycie w OpenAI Agents SDK

Mając wiedzę o `params`, zobaczmy jak to wygląda w kodzie. Żeby podłączyć zewnętrzne narzędzie do agenta przez MCP, potrzebujesz dwóch rzeczy: wskazać palcem program do uruchomienia na swoim komputerze i utrzymać go przy życiu dopóki działa agent.

#### Przykład: Context7 — czym jest i z czym agent się „łączy”

**Co to jest Context7?**  
[Context7](https://context7.com/upstash/context7) to projekt **Upstash**: platforma dostarczająca **aktualną, często wersjonową dokumentację i przykłady kodu** dla bibliotek open-source — tak, żeby model nie opierał się wyłącznie na „pamięci z treningu” (stare API, zmyślone sygnatury). To **nie jest** wyszukiwarka stron WWW ani ogólny „internet”; to **narzędzia do doczytywania dokumentacji z indeksu Context7** (backend indeksu i silnik parsowania są po stronie Upstash; lokalnie uruchamiasz tylko **serwer MCP**, który z nimi rozmawia).

**Z czym konkretnie łączy się agent?**  
Nie z „jakąś jedną dokumentacją wybraną z góry”. Agent (przez SDK) łączy się z **lokalnym procesem** uruchomionym z paczki `@upstash/context7-mcp` — tak jak z każdym innym serwerem MCP. Ten proces **rejestruje narzędzia MCP**. Według oficjalnego opisu repozytorium Context7 są to m.in.:

- **`resolve-library-id`** — zamienia ogólną nazwę biblioteki (np. „react”) na **identyfikator w formacie Context7** (np. ścieżka w stylu `/org/project`), używając m.in. pola `libraryName` i kontekstu zadania (`query`).
- **`query-docs`** — na podstawie **konkretnego `libraryId`** i Twojego pytania (`query`) pobiera **fragmenty dokumentacji** dopasowane do zadania.

Czyli „połączenie z Context7” = **stdio do procesu MCP + wywołania tych narzędzi**, a nie bezpośrednie „wklejenie całej dokumentacji Reacta do promptu” na starcie.

**Czy agent sam wybiera dokumentację na podstawie promptu systemowego?**  
Nie ma tu osobnej magii poza modelem i narzędziami. Po podłączeniu `mcp_servers` model widzi **opisy narzędzi** (jak przy `@function_tool`) i w trakcie rozmowy **sam decyduje**, czy i kiedy je wywołać — w oparciu o `instructions`, treść zadania użytkownika i dotychczasową rozmowę. Typowy sensowny przebieg: najpierw **rozwiązanie ID biblioteki** (`resolve-library-id`), potem **pobranie treści docs** (`query-docs`) dla wybranego tematu.  
Możesz to **przyspieszyć**, podając w promptcie **konkretne ID biblioteki** w składni Context7, np. „use library `/vercel/next.js`” — wtedy model może pominąć lub skrócić krok dopasowania nazwy.

**API key:** W dokumentacji Context7 zaleca się [darmowy klucz API](https://context7.com/dashboard) dla wyższych limitów — szczegóły konfiguracji zmieniają się w czasie; patrz [dokumentacja Context7](https://context7.com/docs/resources/all-clients) dla Twojego klienta MCP.

#### Analogia z "wykręcaniem numeru" (Dwa Etapy) na przykładzie Outlook MCP {#context7-i-outlook-mcp-przykład-krok-po-kroku}

To opracowanie rozbija na czynniki pierwsze jedno z najbardziej mylących zagadnień: **oddzielenie konfiguracji samego narzędzia (Context7)** od **celu, o który chcemy zapytać (Outlook MCP)**.

Kiedy chcesz, aby Agent użył Context7 do przeczytania dokumentacji, musisz zrozumieć, że w kodzie odbywają się **dwie zupełnie niezależne rzeczy**:
1. **Uruchomienie silnika (Context7)** - Agent musi dostać "telefon do ręki" (często z mylącym `params`).
2. **Wybranie celu (np. Outlook MCP)** - Agent musi "wykręcić konkretny numer".

**Błąd początkujących** polega na szukaniu informacji do punktu 1 na stronie z punktu 2!

```python
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

# ETAP 1: Odpalamy telefon (zawsze to samo dla context7)
async with MCPServerStdio(
    params={
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp@latest"],
    },
    client_session_timeout_seconds=60,
) as context7_server:
    
    agent = Agent(
        name="Agent z Context7",
        instructions="Jesteś ekspertem. Korzystaj z narzędzi Context7 aby czytać dokumentację.",
        model="gpt-4.1",
        mcp_servers=[context7_server], # tu podpinasz działający telefon
    )
    
    # ETAP 2: Wykręcamy numer (ID z linku ze strony Context7)
    result = await Runner.run(
        agent,
        "Znajdź instrukcje instalacji. Użyj biblioteki o ID: /websites/cursor"
    )
```

Agent widzi podłączone w ten sposób narzędzia zupełnie naturalnie. Nie obchodzi go, że pod spodem działa `npx` (Node.js) czy `uvx` (środowisko Pythona). Dla agenta jest to po prostu zbiór funkcji wywoływanych przez model tak samo jak Twoje własne `@function_tool`.

Warto ustawić `client_session_timeout_seconds=60`, bo domyślny timeout (5s) bywa za krótki i serwer MCP nie zdąży wystartować:

```python
async with MCPServerStdio(params=fetch_params, client_session_timeout_seconds=60) as server:
    ...
```

I to wszystko odbywa się na bazie **jednego, niezmiennego `params`** odpowiedzialnego wyłącznie za uruchomienie narzędzia.

> 👉 **Więcej zaawansowanych zagadnień MCP:** Dowiedz się, jak działa rewolucyjny **`AsyncExitStack`** zapobiegający problemowi głębokich wcięć, jaka jest różnica między używaniem **FastMCP** a **`@function_tool`**, oraz jak uruchamiać bezpiecznie serwery bezpośrednio z **GitHuba** (bez pobierania paczek) w dedykowanej notatce: **[Zarządzanie wieloma MCP i FastMCP](/notatki/openai-agents-sdk/openai-agents-sdk-mcp)**.

> **Uwaga na marginesie:** Jeśli uczysz się tematu integracji z protokołem od podstaw, zaglądnij do osobnego modułu dedykowanego w 100% MCP – tam znajdziesz szerokie omówienie instalacji, obsługi i mechanik niezależnych od konkretnego frameworka agentów.

### Odniesienia
- [MCP – dokumentacja SDK](https://openai.github.io/openai-agents-python/mcp/)
- [Context7 — repozytorium (opis narzędzi MCP, instalacja)](https://github.com/upstash/context7)
- [Context7 + Outlook — skąd `params`, gdzie library ID, przykład kodu](/notatki/openai-agents-sdk/openai-agents-sdk-context7)

---

## Lifecycle Callbacks (RunHooks)

### Zagadnienie
Podpinanie się pod kluczowe momenty cyklu życia agenta (start, koniec, handoff, zakończenie narzędzia) w celu logowania, monitoringu lub dodatkowej logiki.

---

### Opis

SDK udostępnia klasę `RunHooks` z metodami wywoływanymi automatycznie w kluczowych momentach przebiegu. Wystarczy odziedziczyć po niej i nadpisać wybrane metody, a następnie podać instancję w parametrze `hooks` Agenta.

```python
from agents import RunHooks
from loguru import logger

class AgentHooks(RunHooks):
    async def on_start(self, context, agent) -> None:
        logger.info(f"Start agenta: {agent.name}")

    async def on_end(self, context, agent, output) -> None:
        logger.info(f"Agent {agent.name} zakończył, typ wyniku: {type(output)}")

    async def on_handoff(self, context, from_agent, to_agent) -> None:
        logger.info(f"Handoff: {from_agent.name} → {to_agent.name}")

    async def on_tool_end(self, context, agent, tool, result) -> None:
        logger.info(f"Agent {agent.name}, narzędzie {tool.name} zakończone")

agent = Agent(
    name="Assistant",
    instructions="Pomóż użytkownikowi.",
    tools=[fetch_weather],
    hooks=AgentHooks(),
)
```

Hooki są przydatne do: logowania zdarzeń, mierzenia czasu poszczególnych kroków, audytu (kto komu przekazał, jakie narzędzie wywołano), a także budowania dashboardów monitorujących agentów w produkcji.

---

## Orkiestracja i wzorce zrównoleglania

### Zagadnienie
Jak architektonicznie budować procesy z wieloma agentami. Trzy główne wzorce: autonomiczny menedżer, zrównoleglanie z oceną (Evaluator), pipeline etapowy (Deep Research). Kiedy stosować który z nich?

---

### Opis

#### Wzorzec 1: Autonomiczny Menedżer (Router z narzędziami)

Budujesz głównego Agenta i dajesz mu listę narzędzi (w tym mniejszych agentów jako `as_tool`). W `instructions` rozkazujesz: "Wykorzystaj swoje narzędzia, wybierz najlepszy wariant i odeślij wynik".

- **Kiedy używać:** Gdy zadanie jest otwarte, wymagające elastyczności, a my **nie znamy z góry** optymalnej ścieżki rozwiązania (np. agent obsługi klienta, który sam decyduje czy zajrzeć do bazy wiedzy, czy od razu odpowiedzieć).
- **Plusy:** Potężna autonomia, minimalna ilość twardego kodu Pythona z pętlami.
- **Minusy:** Agent sam decyduje o kolejności — może wpaść w pętlę i użyć narzędzi kilkanaście razy, marnując czas i budżet API. Sensowne jest **jawne limitowanie** w promptach lub kodzie.

#### Wzorzec 2: Zrównoleglanie z weryfikatorem (Evaluator)

Uruchamiasz N wariantów agenta **równolegle** za pomocą `asyncio.gather()`. Po zebraniu propozycji wołasz Agenta-"Sędziego" do wskazania zwycięzcy. 

- **Kiedy używać:** Do zadań **kreatywnych i generatywnych**, gdzie jedno podejście to za mało (np. burza mózgów, wymyślanie chwytliwych nagłówków, pisanie kodu na kilka sposobów) i potrzebujemy obiektywnej, szybkiej weryfikacji.
- **Plusy:** Pipeline jest **deterministyczny** — zawsze powstanie N propozycji i jedna ocena. Gwarantuje przewidywalny czas i koszt.

```python
import asyncio
from agents import Agent, Runner, trace

async def proces_kreatywny():
    with trace("Burza mózgów i ocena"):
        wyniki = await asyncio.gather(
            Runner.run(agent_styl_powazny, "Napisz post powitalny"),
            Runner.run(agent_styl_wesoly, "Napisz post powitalny"),
            Runner.run(agent_styl_techniczny, "Napisz post powitalny"),
        )

        teksty = [r.final_output for r in wyniki]

        najlepszy = await Runner.run(
            agent_sedzia,
            f"Wybierz i zwróć bez komentarza najlepszy tekst spośród: {teksty}"
        )
        return najlepszy.final_output
```

**Dlaczego `asyncio.gather` działa szybko?** To **nie jest** wielowątkowość. Działa pętla zdarzeń: gdy jedna korutyna czeka na odpowiedź z API, pętla wykonuje inną. Skoro wywołania LLM to w praktyce czekanie na sieć — trzy agenci mogą naprzemiennie "rozmawiać" z API i skończyć w zbliżonym czasie. Szczegóły → **[Programowanie Asynchroniczne](/notatki/openai-agents-sdk/openai-agents-sdk-asyncio)**.

**Jeden `with trace()` na całą operację** — w Traces widzisz jeden spójny ślad: nazwy agentów, prompty, kolejność kroków.

**Wskazówka do promptu Sędziego:** kończ prompt twardym ograniczeniem — np. *"nie uzasadniaj; zwróć tylko treść wybranego tekstu"* — żeby model nie "gadał" ponad potrzebę.

#### Wzorzec 3: Pipeline Etapowy (Deep Research)

Podejście łączy Structured Output, zrównoleglanie i narzędzia hostowane. Dzieli duży problem na sekwencyjne warstwy mikro-zadań.

- **Kiedy używać:** Do **bardzo złożonych zadań analitycznych** wymagających dużej trafności merytorycznej (badania rynkowe, research naukowy, audyty prawne). Zrzucenie tego na barki jednego agenta w jednym prompcie skończyłoby się powierzchowną halucynacją.
- **Plusy:** Rozbija problem na specjalistów, zwiększa dokładność, zapobiega zgubieniu kontekstu.

**Schemat (przykład z badaniem internetu):**
1. **Planowanie** — Agent Planista z `output_type=WebSearchPlan` zwraca listę zapytań (obiektów `{reason, query}`).
2. **Wykonanie wyszukiwań** — Dla każdego elementu planu budujesz korutynę `Runner.run(agent_szukacz, ...)` i uruchamiasz je **`asyncio.gather`** (równolegle). Do agenta szukacza przekazujesz **nie samo `query`** — też **`reason`**, żeby model miał kontekst, po co szuka.
3. **Synteza raportu** — Agent Pisarz z `output_type=ReportData` (Pydantic: streszczenie + raport Markdown + sugerowane tematy) łączy wyniki wyszukiwań w jeden spójny dokument.
4. **Doręczenie** — Osobny krok (np. agent e-mailowy z `@function_tool` + SendGrid), który formatuje raport w HTML i wysyła.

#### Notebook → moduły Pythona + Gradio UI

W kursie pipeline deep research jest następnie przenoszony z Jupytera do **właściwych modułów Pythona** (osobny plik per agent, klasa menedżera koordynująca całość). Interfejs użytkownika budowany jest w **Gradio** — lekki framework do UI bez front-endu. Funkcja zwrotna (callback) dla przycisku używa `yield` (generator), dzięki czemu Gradio wyświetla aktualizacje postępu **przyrostowo** (nie trzeba czekać na koniec całego pipeline'u).

> 👉 **Więcej szczegółów technicznych:** Zobacz pełne omówienie koncepcji **Autonomicznego Tradera** jako multiagenta oraz **organizacji plików** (np. `templates.py`, `mcp_params.py`) w komercyjnych projektach w notatce: **[Zaawansowana Orkiestracja (Wzorce)](/notatki/openai-agents-sdk/openai-agents-sdk-orkiestracja)**.

---

## 10 Rekomendacji Inżynieryjnych

### Zagadnienie
Praktyczne wnioski z końca kursu, dotyczące tworzenia komercyjnych rozwiązań opartych o LLM (Workflow vs Autonomia, problem ewaluacji, kapelusz Data Scientista).

---

### Opis

Poniżej skrót z dekalogu, który jest "must-have" przed rozpoczęciem komercyjnego pisania agentów:
1. **Zaczynaj od problemu, nie od Agenta** (nie wciskaj technologii na siłę).
2. **Określ metrykę sukcesu** (twarde dane zamiast ocen "na oko").
3. **Przepływ pracy (Workflow) ponad pełną Autonomią** (najpierw sztywne ramy, potem swoboda).
4. **Buduj od dołu do góry (Bottom-Up)** (jeden prosty agent, potem rozbudowa, a nie graf 15 agentów na start).
5. **Zaczynaj na bogato (np. `gpt-4o`)** (sprawdź czy to w ogóle działa, potem optymalizuj kosztowo na np. `mini`).
6. **Lepsze promptowanie > wektory i fine-tuning** (najpierw wyczerp limit prompt inżynierii).
7. **Zawsze czytaj "Ślady" (Traces)** (podglądaj, w jakie "pętle" wpada agent).

> 👉 **Pełna treść dekalogu i głębsze wyjaśnienia:** Zobacz osobną notatkę **[10 Rekomendacji Inżynieryjnych](/notatki/openai-agents-sdk/openai-agents-sdk-10-rekomendacji)**.

---

## Pojęcia kluczowe – podsumowanie

| Pojęcie | Definicja |
|---------|-----------|
| **Agent** | Obiekt łączący system prompt (`instructions`), model, narzędzia, handoffy i guardrails w jedną "osobowość". |
| **Runner** | Klasa uruchamiająca agenta. `Runner.run()` → pełna odpowiedź; `Runner.run_streamed()` → strumieniowanie. |
| **Trace** | Blok kontekstowy (`with trace("...")`) logujący przebieg agenta do platformy OpenAI. |
| **`@function_tool`** | Dekorator zamieniający zwykłą funkcję Pythona w narzędzie dla agenta (schema z type hints + docstring). |
| **`as_tool()`** | Metoda na obiekcie agenta — zamienia go w narzędzie dla innego agenta (kontrola wraca do wywołującego). |
| **Handoff** | Przekazanie kontroli innemu agentowi — kontrola **nie wraca** do pierwotnego agenta. |
| **`output_type`** | Parametr Agenta wymuszający Structured Output — model zwraca JSON parsowany do obiektu Pydantic. |
| **Guardrail** | Funkcja sprawdzająca wejście/wyjście; `tripwire_triggered=True` → przerwanie przebiegu (wyjątek). |
| **MCP** | Model Context Protocol — protokół podłączania zewnętrznych serwerów narzędzi do agenta. |
| **RunHooks** | Klasa callbacków cyklu życia: `on_start`, `on_end`, `on_handoff`, `on_tool_end`. |
| **`asyncio.gather`** | Równoległe uruchomienie korutyn (czekanie na I/O) — nie wielowątkowość, lecz pętla zdarzeń. |

---

## Mapa konceptów

```text
OpenAI Agents SDK (Non-opinionated)
│
├── Podstawy
│   ├── pip install openai-agents (pakiet: agents)
│   ├── Coroutine (async def) + await (uruchomienie) / asyncio.run() w .py
│   ├── Runner.run() → await → result.final_output
│   ├── Runner.run_streamed() → async for stream_events() (token po tokenie)
│   └── with trace("nazwa") – logi w platformie OpenAI Traces
│
├── Agent (instancja)
│   ├── name            – identyfikator
│   ├── instructions    – system prompt
│   ├── model           – string (OpenAI) lub OpenAIChatCompletionsModel (DeepSeek/Gemini/Groq)
│   ├── output_type     – Pydantic model (Structured Output) z Field(description=...)
│   ├── tools           – @function_tool / hostowane (WebSearchTool) / agent.as_tool()
│   ├── handoffs        – delegowanie kontroli do eksperta (nie wraca)
│   ├── input/output_guardrails – tripwire, opcjonalnie agent z output_type wewnątrz
│   ├── mcp_servers     – MCPServerStdio / zdalne serwery narzędzi (Model Context Protocol)
│   └── hooks           – RunHooks (on_start, on_end, on_handoff, on_tool_end)
│
└── Wzorce orkiestracji
    ├── Autonomiczny menedżer: tools (as_tool + @function_tool) + handoffs → model decyduje o kolejności
    ├── Evaluator: asyncio.gather (równolegle N wariantów) → Agent Sędzia (kolejność w kodzie)
    └── Pipeline Deep Research: Planner (output_type) → gather + WebSearchTool → Pisarz (output_type) → E-mail
```
