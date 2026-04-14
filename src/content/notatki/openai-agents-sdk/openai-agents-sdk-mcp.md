---
title: 'Model Context Protocol (MCP) i narzędzia zewnętrzne'
category: Agenci AI
status: w_trakcie
type: notatka
hidden: true
mindmaps: []
---

# Model Context Protocol (MCP) i narzędzia zewnętrzne

Ta notatka stanowi rozszerzenie głównego dokumentu [OpenAI Agents SDK – Rdzeń i Autonomia](/notatki/openai-agents-sdk/openai-agents-sdk-rdzen). Zawiera szczegółowe informacje z oficjalnej dokumentacji i kursów o tym, czym jest MCP, jak uruchamiać serwery i jak elegancko spinać je w kodzie.

## Czym jest MCP? (Analogia z USB-C)

Twórcy standardu (firma Anthropic) nazywają go "USB-C dla AI". Nie jest to nowy framework do pisania agentów, ani zmiana samego sposobu działania LLM-ów. To po prostu **uniwersalny standard wtyczki**. 
Dzięki niemu jedna osoba może napisać świetne narzędzie (np. do obsługi bazy danych czy przeglądarki), a tysiące innych mogą podłączyć je do swojego systemu jednym kablem. Tworzy to potężny, społecznościowy ekosystem gotowych narzędzi (dziesiątki tysięcy paczek).

**Architektura MCP – 3 główne pojęcia:**

1. **Host MCP:** Cała Twoja aplikacja (tworzony program), w której "żyje" Twoja sztuczna inteligencja. U nas — kod napisany w **OpenAI Agents SDK** (obiekt `Agent` oraz `Runner`).
2. **Klient MCP:** Wbudowany we framework mechanizm (część `Hosta`), który wie, w jakim języku rozmawiać z obcym oprogramowaniem. On wtyka "kabel" do narzędzia, wysyła żądania w standardzie protokołu i odbiera odpowiedzi. 
3. **Serwer MCP:** Paczka obcego kodu, która fizycznie wykonuje zadanie (np. pobiera strony, czyta pliki). **Uwaga:** słowo "serwer" jest mylące! Rzadko kiedy jest to zdalna maszyna w chmurze. Zazwyczaj "Serwer MCP" to po prostu skrypt, który pobierasz z internetu i uruchamiasz jako osobny proces **na własnym komputerze w tle** (np. przez `npx` lub `uvx`). Twój Host łączy się z nim lokalnie.

## Stdio – jak kable w komputerze się dogadują

Klasa `MCPServerStdio` (Standard Input/Output) oznacza po prostu **czarne okienko terminala**. Kiedy w Agencie konfigurujesz serwer MCP w trybie Stdio, nie używasz gniazdek sieciowych. Zamiast tego, Twój kod zachowuje się tak, jakbyś sam otworzył drugi terminal, wpisał komendę startującą narzędzie (np. `npx ...`) i wcisnął Enter. Następnie framework czyta to, co narzędzie wypisuje na ekran konsoli, i sam wpisuje polecenia.

Najprostszy z możliwych i niezwykle bezpieczny sposób komunikacji lokalnej!

## Skąd wziąć `params`? 

`params` to **zwykła komenda terminalowa rozłożona na dwa kawałki**: `"command"` (program do uruchomienia) i `"args"` (argumenty dla tego programu).

| Komenda w terminalu | `"command"` | `"args"` |
|---|---|---|
| `uvx mcp-server-fetch` | `"uvx"` | `["mcp-server-fetch"]` |
| `npx -y @playwright/mcp@latest` | `"npx"` | `["-y", "@playwright/mcp@latest"]` |

**Skąd wziąć konkretną nazwę paczki?**
Z dokumentacji danego serwera w Marketplace MCP (np. [smithery.ai](https://smithery.ai/), [glama.ai/mcp](https://glama.ai/mcp)). Znajdziesz tam gotowe polecenia do skopiowania.

## Popularne serwery MCP (Przykłady z kursu)

Podczas kursu omówiono i zaimplementowano kilka przydatnych serwerów MCP, które świetnie pokazują potencjał tego rozwiązania:

1. **Brave Search**
   - Darmowe wyszukiwanie w internecie (API, które nie wymaga podawania karty kredytowej).
   - Wymaga klucza podanego w słowniku `env` parametru w kodzie Pythona.

2. **Fetch / Playwright**
   - **Fetch (Python / uvx):** Proste narzędzie pobierające zawartość strony z URL.
   - **Playwright (Node / npx):** Bardziej zaawansowane narzędzie potrafiące sterować przeglądarką headless (klikanie, scrollowanie, robienie zrzutów ekranu). Zwraca modelowi kilkadziesiąt precyzyjnych narzędzi (np. `navigate`, `click`, `screenshot`).

3. **Serwer Pamięci (Memory z libSQL)**
   - Specjalny typ serwera lokalnego pozwalający Agentowi zarządzać strukturą grafową (tworzenie i usuwanie `entites`, budowanie powiązań). Idealny sposób na przekazanie agentowi trwałego, persystentnego kontekstu pomiędzy sesjami bez konieczności polegania wyłącznie na wektoryzacji RAG.

4. **Polygon (Dane giełdowe prosto z repo GitHub)**
   - Reprezentuje architekturę, gdzie serwer MCP działa u Ciebie lokalnie, ale pobiera dane przez internetowe API zewnętrznego dostawcy (w tym przypadku polygon.io).
   - Pokazuje zaawansowaną technikę uruchomienia serwera MCP `uvx` bezpośrednio z surowego repozytorium GitHub (podając link zamiast nazwy paczki z PyPI), np. do testowania nieoficjalnych lub developerskich wersji narzędzi. *(Pamiętaj o audycie kodu obcych repozytoriów przed ich lokalnym uruchomieniem!)*

5. **Filesystem**
   - Ograniczony sandbox pozwalający odczytywać pliki, czytać zawartość katalogów czy zapisywać nowe dane (np. zapisać pobrany przez Playwrighta przepis kulinarny do pliku `.md` na dysku).

## Jak uruchamiać wiele serwerów MCP naraz? (AsyncExitStack)

Gdy podpinasz do Agenta tylko jeden serwer MCP, używasz prostego bloku `async with`:

```python
async with MCPServerStdio(params=...) as my_server:
    agent = Agent(mcp_servers=[my_server])
    # ...
```

Jeśli potrzebujesz ich np. pięć (Brave, Filesystem, Memory, Fetch, Polygon), zagnieżdżenie kolejnych bloków `async with` stałoby się niezwykle niewygodne ("piekło zagnieżdżeń").
**Python dostarcza idealne rozwiązanie: `AsyncExitStack` z modułu `contextlib`.** Umożliwia ono dynamiczne, iteracyjne wchodzenie w wiele kontekstów na jednym poziomie wcięć.

```python
import asyncio
from contextlib import AsyncExitStack
from agents.mcp import MCPServerStdio

mcp_configs = [
    {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-brave-search"]},
    {"command": "uvx", "args": ["mcp-server-fetch"]},
    # i kolejne parametry...
]

async def main():
    async with AsyncExitStack() as stack:
        # Pusta lista, do której "zbierzemy" zainicjalizowane serwery
        active_servers = []
        
        for params in mcp_configs:
            # Wejście w asynchroniczny menedżer kontekstu dynamicznie
            server = await stack.enter_async_context(
                MCPServerStdio(params=params, client_session_timeout_seconds=60)
            )
            active_servers.append(server)

        # Teraz masz listę gotowych, uruchomionych serwerów bez miliona wcięć!
        agent = Agent(
            name="Złożony Agent",
            mcp_servers=active_servers
        )
        
        # Odtąd Agent dysponuje połączoną siłą wszystkich pięciu serwerów.
```

## Kiedy budować własny serwer MCP a kiedy używać `@function_tool`?

Kurs stawia sprawę jasno i rozwiewa powszechny mit. Skoro framework pozwala tak łatwo tworzyć narzędzia poprzez dekorator `@function_tool`, po co w ogóle trudzić się w pisanie serwera MCP od zera (np. używając biblioteki `FastMCP`)?

**Złota zasada:**
* Zbuduj i udostępnij serwer MCP **tylko wtedy, gdy budujesz narzędzie, którym chcesz podzielić się z resztą świata** lub udostępnić pomiędzy różnymi, niezależnymi systemami agentowymi w swojej firmie.
* Jeżeli piszesz własną, lokalną logikę biznesową (np. `buy_stock`, `check_balance`), do której dostęp będzie miał wyłącznie Twój dedykowany Agent uruchamiany z poziomu tego samego projektu (np. `OpenAI Agents SDK`), **zawsze używaj `@function_tool`**.

Owinięcie lokalnej funkcji w serwer MCP tylko po to, żeby zaraz połączyć się z nim lokalnym klientem Stdio z poziomu tego samego kodu to zbędny narzut czasowy, komplikacja architektury i sztuka dla sztuki. Narzędzia zdefiniowane przez `@function_tool` są lżejsze i znacznie szybsze w implementacji.

---

*(Powyższe informacje uzupełniają notatkę główną i stanowią szczegółowy referat dla zagadnienia Model Context Protocol we frameworku OpenAI Agents SDK).*
