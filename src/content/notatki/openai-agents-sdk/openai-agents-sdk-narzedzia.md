---
title: 'Szczegóły: Katalog narzędzi (Tools) SDK'
category: Agenci AI
status: zrobione
type: notatka
hidden: true
---
# Katalog narzędzi (Tools) — OpenAI Agents SDK

**Źródło:** [Tools – dokumentacja SDK](https://openai.github.io/openai-agents-python/tools/) (stan na moment opracowania notatki; lista może się rozszerzać wraz z wersją biblioteki).

Narzędzia pozwalają agentowi **działać**: pobierać dane, uruchamiać kod, wołać API, sterować komputerem itd.

---

## Pięć kategorii (wg dokumentacji)

1. **Eksperymentalne** — m.in. narzędzie **Codex** (zadania w workspace).
2. **Hosted (OpenAI)** — wykonywane po stronie serwerów OpenAI obok modelu.
3. **Lokalne / runtime** — m.in. `ComputerTool`, `ApplyPatchTool` (zawsze w Twoim środowisku); `ShellTool` — lokalnie **albo** w hostowanym kontenerze.
4. **Function calling** — dowolna funkcja Pythona: `@function_tool`.
5. **Agent jako narzędzie** — `agent.as_tool(...)` bez pełnego handoffu.

---

## Hosted tools (wbudowane po stronie OpenAI)

Dostępne przy użyciu modelu typu **OpenAI Responses** (`OpenAIResponsesModel`) — patrz dokumentacja link powyżej.

| Narzędzie | Krótki opis |
|-----------|-------------|
| **`WebSearchTool`** | Wyszukiwanie w internecie. |
| **`FileSearchTool`** | Wyszukiwanie w **Vector Stores** (Twoje dokumenty w OpenAI). |
| **`CodeInterpreterTool`** | Wykonanie kodu w **sandboxie** po stronie OpenAI. |
| **`HostedMCPTool`** | Udostępnienie narzędzi z **zdalnego serwera MCP** modelowi. |
| **`ImageGenerationTool`** | Generowanie obrazów z promptu. |
| **`ToolSearchTool`** | Odroczone ładowanie narzędzi / namespace’ów / hosted MCP w czasie działania (mniej tokenów na schematy). |

Zaawansowane opcje m.in. dla `WebSearchTool`: `filters`, `user_location`, `search_context_size`; dla `FileSearchTool`: `vector_store_ids`, `max_num_results`, filtry, ranking itd.

**Uwaga kosztowa:** np. web search bywa **dodatkowo płatny** według cennika OpenAI — sprawdzaj [pricing](https://platform.openai.com/docs/pricing) przed produkcją.

---

## Narzędzia lokalne (runtime u Ciebie)

| Narzędzie | Opis |
|-----------|------|
| **`ComputerTool`** | Automatyzacja „komputera” — musisz dostarczyć implementację interfejsu `Computer` / `AsyncComputer` (np. Playwright). |
| **`ApplyPatchTool`** | Stosowanie patchy lokalnie — implementacja `ApplyPatchEditor`. |
| **`ShellTool`** | Powłoka: tryb **lokalny** albo **kontener hostowany** przez OpenAI (`environment=...`). Jest też **`LocalShellTool`** (starsza integracja lokalna). |

---

## Function tools

Dekorator **`@function_tool`** — Twoja funkcja Pythona staje się narzędziem (schema z type hints + docstring).

Możliwość **`defer_loading=True`** przy wielu narzędziach — w parze z **`ToolSearchTool()`** i namespace’ami (`tool_namespace(...)`).

---

## Agent jako narzędzie

**`Agent.as_tool(tool_name=..., tool_description=...)`** — inny agent wywołuje tego agenta jak funkcję; **inna** semantyka niż **handoff** (patrz główne notatki Modułu 1).

---

## MCP poza HostedMCPTool

W konstruktorze **`Agent`** możesz też podać **`mcp_servers`** — listę serwerów MCP (protokół); cykl życia: `connect()` / `cleanup()` (albo menedżer z `agents.mcp`). To osobna ścieżka niż same „hosted tools” z tabeli.

---

## Szybki import (przykład z dokumentacji)

```python
from agents import Agent, FileSearchTool, Runner, WebSearchTool

agent = Agent(
    name="Assistant",
    tools=[
        WebSearchTool(),
        FileSearchTool(
            max_num_results=3,
            vector_store_ids=["VECTOR_STORE_ID"],
        ),
    ],
)
```

Pełne przykłady: repozytorium SDK (`examples/tools/…`) oraz strona **Tools** linkowana na górze.