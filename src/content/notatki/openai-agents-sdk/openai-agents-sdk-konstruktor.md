---
title: 'Szczegóły: Agent — konstruktor i parametry (SDK)'
category: Agenci AI
status: zrobione
type: notatka
hidden: true
---
# Agent — konstruktor i parametry (OpenAI Agents SDK)

**Źródło:** Oficjalna dokumentacja SDK — klasy `Agent` i `AgentBase`  
**Link:** [Agents – dokumentacja API](https://openai.github.io/openai-agents-python/ref/agent/)

---

## Co jest obowiązkowe w `Agent(...)`?

- **`name`** — jedyne pole **bez wartości domyślnej** w konstruktorze. Musi być **string** (SDK sprawdza to w `__post_init__`).
- Składniowo możesz napisać `Agent(name="Jokester")` — obiekt się utworzy.

**`instructions`** ma domyślnie `None`, ale dokumentacja SDK pisze wprost: *„We strongly recommend passing `instructions`”* — to jest **system prompt** (rola, zasady, styl odpowiedzi). Bez tego agent w typowym scenariuszu **nie ma sensownej instrukcji systemowej**.

**`model`** — opcjonalne. Jeśli **nie** podasz, używany jest **domyślny model** z `agents.models.get_default_model()` (w danej wersji SDK może to być np. `"gpt-4.1"` — dokładna nazwa może się zmieniać wraz z wersją biblioteki).

---

## Minimalne wywołanie „żeby miało sens”

W praktyce ucz się i buduj tak:

1. **`name`** — identyfikator (logi, trace, handoff).
2. **`instructions`** — system prompt (kim jest agent, co robi).
3. **`model`** — gdy chcesz **jawnie** ustawić model (np. `"gpt-4o-mini"`), zamiast polegać na domyślnym z SDK.

Przykład:

```python
agent = Agent(
    name="Jokester",
    instructions="Jesteś opowiadaczem żartów. Bądź zabawny.",
    model="gpt-4o-mini",
)
```

**Nie** polegaj na `Agent()` bez argumentów — brakuje `name` (błąd typu). **`Agent(name="x")`** bez `instructions` jest możliwe składniowo, ale **słabe** do realnej pracy.

---

## Główne argumenty konstruktora — znaczenie

| Argument | Znaczenie |
|----------|-----------|
| **`name`** | Nazwa agenta (identyfikator, trace, handoff). **Wymagany string.** |
| **`instructions`** | System prompt: rola, styl, zasady. Może być `str` albo funkcja `(context, agent) → str` (dynamicznie). Domyślnie `None`. |
| **`prompt`** | Zaawansowane: obiekt `Prompt` / funkcja — konfiguracja poza kodem; **tylko modele OpenAI + Responses API**. |
| **`handoffs`** | Lista innych agentów / obiektów handoff — do **przekazywania** rozmowy. |
| **`handoff_description`** | Opis agenta **gdy** jest używany jako handoff — pomaga LLM wybrać moment przekazania. |
| **`tools`** | Lista narzędzi (`@function_tool`, wbudowane np. web search). |
| **`mcp_servers` / `mcp_config`** | Serwery **MCP** — dodatkowe narzędzia z protokołu; trzeba zarządzać `connect` / `cleanup`. |
| **`model`** | `str` (nazwa modelu) albo własna implementacja `Model`; `None` = domyślny z SDK. |
| **`model_settings`** | Np. temperatura, `top_p` itd. |
| **`input_guardrails` / `output_guardrails`** | Sprawdzenie wejścia / wyjścia przed lub po generowaniu odpowiedzi. |
| **`output_type`** | Structured output (Pydantic, typ) — bez tego wynik to zwykle **`str`**. |
| **`hooks`** | Callbacki cyklu życia agenta. |
| **`tool_use_behavior`** | Zachowanie po wywołaniu narzędzia, np. `"run_llm_again"` (domyślnie), `"stop_on_first_tool"`, obiekt `StopAtTools`, lub własna funkcja. |
| **`reset_tool_choice`** | Czy po użyciu narzędzia resetować wybór (domyślnie `True` — m.in. przed pętlą narzędzi). |

To **nie** są argumenty konstruktora, tylko metody na już utworzonym agencie: **`as_tool()`**, **`clone()`**, itd.

---

## Uwaga o typie `Agent[Any]` w IDE

Klasa `Agent` jest **generyczna** (`Agent[TContext]`). Gdy edytor pokazuje np. `Agent[Any]`, **`[Any]`** to informacja typów (parametr generyczny „kontekstu”), a **nie** coś, co musisz wpisywać w kodzie — patrz ogólne wyjaśnienie typów generycznych w Pythonie / Pylance.

---

## Klasa bazowa `AgentBase` (wspólne z innymi typami agentów)

Z `AgentBase` dziedziczą m.in. pola: **`name`**, **`handoff_description`**, **`tools`**, **`mcp_servers`**, **`mcp_config`**. Szczegóły w dokumentacji powyżej.