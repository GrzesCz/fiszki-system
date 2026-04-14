---
title: 'Structured Output, Guardrails i Cykl Życia (OpenAI Agents SDK)'
category: Agenci AI
status: w_trakcie
type: notatka
hidden: true
mindmaps: []
---

# Structured Output, Guardrails i Cykl Życia

Ta notatka to rozwinięcie koncepcji bezpiecznego sterowania i formatowania wyjść agenta. Opisuje, jak zablokować model przed halucynowaniem niechcianych odpowiedzi, jak wymusić odpowiedź w formie obiektu JSON i jak nasłuchiwać na zdarzenia w jego cyklu życia.

---

## Ustrukturyzowane dane wyjściowe (Structured Output)

### Zagadnienie
Wymuszenie na Agencie, by zamiast luźnego tekstu zwrócił uporządkowany obiekt Pythona (JSON sparsowany do modelu klasy Pydantic) według ustalonego schematu.

### Opis

Agent domyślnie zwraca `str` (długi ciąg tekstu). Ale w kodzie potrzebujesz obiektów, nie "gadania" (np. wyciągniętych konkretnych parametrów z polecenia). Zamiast parsować tekst wyrażeniami regularnymi, definiujesz klasę `BaseModel` z biblioteki **Pydantic**, a za pomocą `Field(description="...")` tłumaczysz modelowi, czym jest dana zmienna. Strukturę podajesz w polu `output_type` Agenta.

```python
from pydantic import BaseModel, Field
from agents import Agent, Runner

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

Po wywołaniu `result = await Runner.run(planner_agent, "...")` zmienna `result.final_output` to gotowy obiekt `WebSearchPlan` z dostępem do właściwości obiektowych np. `result.final_output.searches[0].query`. To model sam pod maską dba o poprawne wypełnienie tego schematu JSON-em.

**Chain-of-Thought za pomocą schematu:** 
Dlaczego w przykładzie najpierw jest `reason` (uzasadnienie), a dopiero potem `query` (zapytanie)? Model generuje JSON pole po polu (od góry do dołu). Zmuszając go najpierw do wygenerowania `reason`, zmuszasz go do "przemyślenia" problemu na głos. Taki zabieg sprawia, że ostateczne `query` będzie dużo wyższej jakości.

---

## Bariery Ochronne (Guardrails)

### Zagadnienie
Zatrzymywanie wykonywania Agenta, jeśli dane wejściowe lub odpowiedź uderzają w zdefiniowane reguły bezpieczeństwa/biznesowe (np. blokada odrabiania lekcji matematyki przez asystenta do obsługi klienta).

### Opis

Guardrails to funkcje przechwytujące kontrolę na **wejściu** (`input_guardrails`) lub **wyjściu** (`output_guardrails`). Zwracają obiekt `GuardrailFunctionOutput`, w którym kluczowe jest pole **`tripwire_triggered`**. 

W dosłownym tłumaczeniu "tripwire" to lina-pułapka. Gdy funkcja zwróci wartość `tripwire_triggered=True` (mina wybuchła), SDK bezwzględnie przerywa przepływ całego programu i rzuca w Pythonie krytyczny wyjątek `InputGuardrailTripwireTriggered` (lub Output). Dalsze kroki agenta nigdy się nie wykonają.

**Szczególność guardrails w SDK:** 
Wewnątrz funkcji guardrail możesz... **odpalić kolejnego, małego agenta** (z `output_type=bool`), żeby to LLM sam ocenił treść! Nie musisz pisać sztywnego `if "matematyka" in text`.

```python
from pydantic import BaseModel
from agents import Agent, Runner, input_guardrail, GuardrailFunctionOutput, InputGuardrailTripwireTriggered

class MathHomeworkOutput(BaseModel):
    is_math_homework: bool

@input_guardrail
async def math_guardrail(ctx, agent, input) -> GuardrailFunctionOutput:
    
    # Tworzymy małego Agenta cenzora
    guardrail_agent = Agent(
        name="Sprawdzenie guardraila",
        instructions="Sprawdź, czy użytkownik prosi Cię o rozwiązanie jego zadania z matematyki.",
        output_type=MathHomeworkOutput,
    )
    result = await Runner.run(guardrail_agent, input, context=ctx.context)

    # Zwracamy wynik. True zatrzyma program z błędem!
    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_math_homework,
    )

agent = Agent(
    name="Agent wsparcia klienta",
    instructions="Jesteś agentem wsparcia klienta.",
    input_guardrails=[math_guardrail],
)

# Łapanie w kodzie:
try:
    await Runner.run(agent, "Rozwiąż równanie: 2x + 3 = 11")
except InputGuardrailTripwireTriggered:
    print("Guardrail aktywowany — zablokowano prośbę o zadanie domowe!")
```

---

## Lifecycle Callbacks (RunHooks)

### Zagadnienie
Podpinanie się pod kluczowe momenty cyklu życia agenta (start, koniec, handoff, zakończenie narzędzia) w celu logowania, monitoringu lub dodatkowej logiki.

### Opis

Jeżeli chcesz śledzić na konsoli lub w logach co po kolei wykonuje model (albo kiedy następuje delegacja/handoff z agenta do agenta), wystarczy, że odziedziczysz po klasie `RunHooks` i nadpiszesz wybrane zdarzenia asynchroniczne.

Następnie instancję tej klasy podajesz w parametrze `hooks` konstruktora głównego Agenta.

```python
from agents import RunHooks, Agent
from loguru import logger

class AgentHooks(RunHooks):
    async def on_start(self, context, agent) -> None:
        logger.info(f"Start agenta: {agent.name}")

    async def on_end(self, context, agent, output) -> None:
        logger.info(f"Agent {agent.name} zakończył pracę, otrzymano typ wyniku: {type(output)}")

    async def on_handoff(self, context, from_agent, to_agent) -> None:
        logger.info(f"Delegacja (Handoff) z: {from_agent.name} → do: {to_agent.name}")

    async def on_tool_end(self, context, agent, tool, result) -> None:
        logger.info(f"Agent {agent.name} właśnie użył narzędzia {tool.name}")

# Użycie
agent = Agent(
    name="Assistant",
    instructions="Pomóż użytkownikowi.",
    hooks=AgentHooks(),
)
```

Hooki są absolutnie niezbędne do: logowania zdarzeń, mierzenia czasu poszczególnych kroków dla optymalizacji, audytu oraz tworzenia dynamicznych dashboardów w interfejsie użytkownika (np. na żywo ładujący się interfejs Gradio, jak w przypadku Trading Floor na kursie).
