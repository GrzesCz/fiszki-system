---
title: 'Szczegóły: Context7 i Outlook MCP (krok po kroku)'
category: Agenci AI
status: w_trakcie
type: notatka
hidden: true
mindmaps: []
---

# Context7 i Outlook MCP (przykład krok po kroku)

*(Krok po kroku z dokładnym omówieniem skąd brać `params`)*

To opracowanie rozbija na czynniki pierwsze jedno z najbardziej mylących zagadnień: **oddzielenie konfiguracji samego narzędzia (Context7)** od **celu, o który chcemy zapytać (Outlook MCP)**.

---

## 1. Dwa światy, których nie wolno mylić

Kiedy chcesz, aby Agent użył Context7 do przeczytania dokumentacji o "Outlook MCP", musisz zrozumieć, że w kodzie odbywają się **dwie zupełnie niezależne rzeczy**:

1. **Uruchomienie silnika (Context7)** - Agent musi dostać "telefon do ręki".
2. **Wybranie celu (Outlook MCP)** - Agent musi "wykręcić konkretny numer".

Błąd początkujących polega na szukaniu informacji do punktu 1 na stronie z punktu 2!

---

## 2. ETAP 1: Uruchomienie silnika (Skąd się bierze `params`?)

W OpenAI Agents SDK, aby Agent mógł korzystać z narzędzi Context7, musisz uruchomić na swoim komputerze **serwer MCP Context7**. Robisz to za pomocą klasy `MCPServerStdio`. Wymaga ona podania `params`.

### Gdzie tego szukać? (konkretne pliki i strony)

`params` **NIE SZUKASZ** na stronie z dokumentacją Outlooka (`context7.com/littlebearapps/...`).  
Chodzi o **uruchomienie paczki serwera MCP Context7** (`@upstash/context7-mcp`), więc źródła to:

1. **Repozytorium GitHub `upstash/context7`**
   - Plik **[`README.md`](https://github.com/upstash/context7/blob/master/README.md)** (korzeń repo): od razu widać odnośnik do paczki npm **`@upstash/context7-mcp`**, sekcja **Installation** z poleceniem `npx ctx7 setup` oraz link **„Manual Installation / Other Clients”** — on prowadzi do strony z gotowymi blokami `command` / `args`.
   - Plik **[`docs/resources/all-clients.mdx`](https://github.com/upstash/context7/blob/master/docs/resources/all-clients.mdx)** — tu są **przykłady konfiguracji MCP** dla wielu klientów: JSON z `"command": "npx"` i `"args": ["-y", "@upstash/context7-mcp", ...]` oraz m.in. linia z **`npx -y @upstash/context7-mcp@latest`**. To jest dokładnie typ źródła, z którego przepisujesz wartości do `params` w Pythonie.
   - Ta sama treść jest publikowana na stronie: [context7.com/docs/resources/all-clients](https://context7.com/docs/resources/all-clients).

2. **Rejestr npm** — [npmjs.com/package/@upstash/context7-mcp](https://www.npmjs.com/package/@upstash/context7-mcp): potwierdza **oficjalną nazwę paczki** (skład `npx … @upstash/context7-mcp` musi się z nią zgadzać).

3. **Agregatory MCP** (np. [smithery.ai/server/@upstash/context7-mcp](https://smithery.ai/server/@upstash/context7-mcp)) — często powielają ten sam wzorzec `npx` + args; to zapasowe źródło, nie „prawda obowiązująca” ponad README / `all-clients`.

**Ważne:** W samym **`README.md` w korzeniu** nie musi być w jednym miejscu dokładnie tekstu `npx -y @upstash/context7-mcp@latest` — tam dominuje skrót **`npx ctx7 setup`**. Pełne **`command` / `args` pod stdio** szukaj w **`docs/resources/all-clients.mdx`** (albo na powyższej stronie docs).

### Jak to przełożyć na kod?
Bierzesz to polecenie z terminala i rozbijasz na dwa słownikowe klucze:
- `"command"`: pierwszy wyraz (program uruchamiający, u nas `npx`)
- `"args"`: cała reszta jako lista (flaga `-y` czyli "zainstaluj bez pytania" oraz nazwa paczki).

```python
# To ZAWSZE wygląda tak samo dla Context7, niezależnie o czym chcesz czytać!
params={
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"],
}
```

Dzięki temu kodowi, w tle na Twoim komputerze odpala się niewidoczny proces z narzędziami `resolve-library-id` oraz `query-docs`. Agent zyskał "telefon".

---

## 3. ETAP 2: Wybranie celu (Skąd wziąć ID dokumentacji?)

Teraz, gdy serwer działa, chcemy zapytać o dokumentację serwera Outlook. Znalazłeś ją w katalogu Context7 pod adresem:
`https://context7.com/littlebearapps/outlook-mcp?chat=...`

Z tego linku **nie wyciągasz żadnych `params`**. Z tego linku interesuje Cię tylko **końcówka adresu URL** po nazwie domeny. Jest to **unikalny identyfikator biblioteki (Library ID)** w bazie Context7:

**Identyfikator to:** `/littlebearapps/outlook-mcp`

Tę informację przekażesz Agentowi **zwykłym tekstem** w jego zadaniu (prompcie), by wiedział, na jaki "numer zadzwonić", korzystając z telefonu, który mu dałeś w Etapie 1.

---

## 4. Pełny, działający kod (OpenAI Agents SDK)

Oto jak łączymy Etap 1 (Konfiguracja silnika) i Etap 2 (Wskazanie celu) w jednym działającym skrypcie:

```python
import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

async def main():
    
    # ETAP 1: Podłączamy Agenta do silnika Context7
    # Skąd to mamy? Z dokumentacji instalacyjnej @upstash/context7-mcp na GitHub/npm.
    async with MCPServerStdio(
        params={
            "command": "npx",
            "args": ["-y", "@upstash/context7-mcp@latest"],
        },
        client_session_timeout_seconds=60, # dajemy mu minutę na pobranie paczki i start
    ) as context7_server:
        
        # Tworzymy Agenta i "wciskamy mu telefon do ręki" (mcp_servers)
        agent = Agent(
            name="Asystent Dokumentacji",
            instructions=(
                "Jesteś ekspertem programowania. "
                "Używaj narzędzi dostarczonych przez serwer Context7 MCP "
                "aby czytać aktualną dokumentację podanych bibliotek i odpowiadać na pytania."
            ),
            model="gpt-4.1",
            mcp_servers=[context7_server],
        )
        
        # ETAP 2: Zadanie dla Agenta ze wskazaniem CELU (ID biblioteki z URL)
        user_prompt = (
            "Wyjaśnij mi krótko, jak za pomocą Microsoft Graph połączyć się z Outlookiem, "
            "wykorzystując serwer mcp. Użyj dokumentacji biblioteki o ID: /littlebearapps/outlook-mcp "
            "w swoich narzędziach Context7."
        )
        
        # Uruchamiamy proces
        print("Agent zaczyna pracę... (może to chwilę potrwać, musi przeszukać dokumentację)")
        result = await Runner.run(agent, user_prompt)
        
        print("\n=== ODPOWIEDŹ AGENTA ===")
        print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

### Co dokładnie zrobi tu model pod maską?
1. Przeczyta Twój prompt i zobaczy: *"Aha, mam użyć biblioteki `/littlebearapps/outlook-mcp`"*.
2. Zauważy, że ma podpięte narzędzie `query-docs` z `context7_server`.
3. Wywoła to narzędzie, przekazując mu parametr `libraryId = "/littlebearapps/outlook-mcp"`.
4. Proces w tle (`npx @upstash...`) połączy się z serwerami Upstash, pobierze dokumentację Outlooka i zwróci tekst do modelu.
5. Model przeczyta to i wygeneruje dla Ciebie ładną, polską odpowiedź. 

I to wszystko odbywa się na bazie **jednego, niezmiennego `params`** odpowiedzialnego wyłącznie za uruchomienie narzędzia.
