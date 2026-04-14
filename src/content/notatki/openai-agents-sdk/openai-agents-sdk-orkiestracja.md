---
title: 'Orkiestracja i wzorce zrównoleglania (OpenAI Agents SDK)'
category: Agenci AI
status: w_trakcie
type: notatka
hidden: true
mindmaps: []
---

# Orkiestracja i wzorce zrównoleglania (OpenAI Agents SDK)

Architektura oparta na agentach wymaga uporządkowania – to nie są pojedyncze pytania do modelu, a często skomplikowane procesy asynchroniczne i układy wieloagentowe. Na podstawie kursu omówiono poniższe koncepcje i konkretne, sprawdzające się w biznesie wzorce.

## 1. Wzorce architektury

### Wzorzec 1: Autonomiczny Menedżer (Router z narzędziami)

Budujesz głównego Agenta i dajesz mu listę narzędzi (w tym mniejszych agentów przez `as_tool`). W `instructions` rozkazujesz: "Wykorzystaj swoje narzędzia, wybierz najlepszy wariant i odeślij wynik".

- **Kiedy używać:** Gdy zadanie jest otwarte, wymagające elastyczności, a my **nie znamy z góry** optymalnej ścieżki rozwiązania (np. agent obsługi klienta).
- **Plusy:** Potężna autonomia, minimalna ilość twardego kodu Pythona z pętlami.
- **Minusy:** Agent sam decyduje o kolejności — może wpaść w pętlę i zużyć duży budżet API. Warto dodawać obostrzenia w parametrze `max_turns` lub jawne polecenia w prompcie.

### Wzorzec 2: Zrównoleglanie z weryfikatorem (Evaluator)

Uruchamiasz N wariantów agenta **równolegle** za pomocą `asyncio.gather()`. Po zebraniu propozycji wołasz Agenta-"Sędziego" do wskazania zwycięzcy. 

- **Kiedy używać:** Do zadań **kreatywnych i generatywnych**, gdzie jedno podejście to za mało (np. wymyślanie nagłówków, refaktoryzacja kodu).
- **Plusy:** Pipeline jest **deterministyczny** — przewidywalny czas i koszt (N propozycji + 1 ocena).

```python
import asyncio
from agents import Agent, Runner, trace

async def proces_kreatywny():
    with trace("Burza mózgów i ocena"):
        wyniki = await asyncio.gather(
            Runner.run(agent_styl_powazny, "Napisz nagłówek"),
            Runner.run(agent_styl_wesoly, "Napisz nagłówek"),
            Runner.run(agent_styl_techniczny, "Napisz nagłówek"),
        )
        teksty = [r.final_output for r in wyniki]
        najlepszy = await Runner.run(agent_sedzia, f"Wybierz najlepszy: {teksty}")
        return najlepszy.final_output
```
**Dlaczego `asyncio.gather` działa tak szybko?** Skoro wywołania API to w 99% czas na czekanie na serwery sieciowe (I/O), Python odpala drugie zapytanie, podczas gdy pierwsze czeka na odpowiedź. Agenci pracują naprzemiennie, kończąc całość ułamek sekundy wolniej niż trwałoby pojedyncze wykonanie.

### Wzorzec 3: Pipeline Etapowy (Deep Research)

Dzieli duży problem na sekwencyjne warstwy mikro-zadań, z wykorzystaniem `output_type` (Pydantic).
- **Kiedy używać:** Do złożonych zadań wymagających bezbłędnej warstwy merytorycznej (badania rynkowe).
1. **Planowanie:** Agent Planista (tworzy JSON ze strukturą celów/wyszukiwań).
2. **Wykonanie:** Odpalenie `gather` z setkami agentów wyszukujących dane pod konkretne komórki ze struktury Planisty.
3. **Synteza:** Agent podsumowujący wszystko w jeden logiczny raport.

## 2. Praktyka budowy Multi-Agenta (Wzorzec Trader i Researcher z kursu)

Kurs demonstruje fantastyczny wzorzec podziału odpowiedzialności na przykładzie aplikacji "Autonomous Trading Floor".
Mamy tu współpracę dwóch ról: Trader (Podejmujący Decyzje) oraz Researcher (Asystent-Wyszukiwarka).

Sposób, w jaki łączymy ich w OpenAI Agents SDK:

1. **Researcher** to osobny `Agent`, podłączony do własnych serwerów MCP (np. `Brave Search`, `Fetch`, `Memory`). Jego głównym poleceniem w prompcie jest przeprowadzanie precyzyjnych analiz rynku.
2. Traktujemy go jak narzędzie, przekształcając za pomocą wbudowanej we framework metody: `researcher.as_tool(tool_name="badacz_rynku", tool_description="Badacz...")`.
3. Następnie konfigurujemy **Tradera**, dając mu inne narzędzia MCP (np. `Polygon` do pobierania ceny akcji, moduł wyliczający stan portfela) oraz wyżej stworzone narzędzie `badacz_rynku`.

Dzięki temu Trader zachowuje pełną władzę nad procesem decyzyjnym, sam generuje plan, ale gdy brakuje mu kontekstu o zewnętrznym świecie – wywołuje polecenie "badacz_rynku". SDK zamraża na ten czas działanie Tradera, odpala całą wewnętrzną asynchroniczną logikę Researchera, a po wygenerowaniu przez niego syntetycznego raportu, przesyła mu z powrotem tekstową odpowiedź. Trader wznawia pracę bogatszy o nową wiedzę.

To oddzielenie jest niesamowicie cenne – Trader nie musi wiedzieć, *jak* przeszukiwać internet za pomocą przeglądarki headless ani skąd wziąć bieżące wiadomości. Wykorzystuje Asystenta jak typowe "czarne pudełko" posiadające swoje własne umiejętności.

## 3. Organizacja Komercyjnego Projektu Opartego na Agentach

Budowa systemu opartego na agentach ewoluuje. Kodowanie wszystkiego w jednym wielkim pliku Pythona to błąd, który szybko mści się podczas debugowania. Oto sprawdzona organizacja dużego projektu komercyjnego z kursu:

1. **Zasada Data Scientista: Notatnik (Jupyter) na początek!**
   - R&D (Badania i Rozwój) promptów i struktury to etap Data Science, nie inżynierii wstecznej. Rozpoczynaj budowanie, testowanie promptów, podpinanie poszczególnych MCP i analizowanie ich w Jupyter Notebook (`.ipynb`). Dopiero gdy upewnisz się, w jaki sposób zrównoważyć promptami powtarzalność a autonomię, przekładaj logikę do kodu aplikacji.

2. **Podział na moduły:**
   - Plik `mcp_params.py`: Słowniki konfiguracji (`params` jak `"command": "uvx"`) trzymaj w tym pliku. To twoja "konfiguracja infrastruktury". Oddziel to od głównego kodu biznesowego.
   - Plik `templates.py`: Plik służący wyłącznie do przetrzymywania wyabstrahowanych ciągów znaków (promptów systemowych). Rozdzielenie "tekstu" od "logiki" to absolutna konieczność. Twoje metody w głównym pliku aplikacji powinny jedynie wywoływać np. `get_trader_instructions(date, strategy)`.
   - Pliki logiki biznesowej: Np. `trader.py` (zawierający klasy poszczególnych agentów), `database.py` (odczyt/zapis portfeli), powiązane w głównym menedżerze zarządzającym asynchroniczną pracą nad wieloma traderami.

Dzięki takiemu architektonicznemu cięciu, jeśli zmieniasz prompt by wpłynąć na to, jak agent traktuje dane – zmieniasz tylko plik `templates.py`. Jeśli podmieniasz repozytorium GitHub dla serwera danych finansowych – zmieniasz tylko `mcp_params.py`.
