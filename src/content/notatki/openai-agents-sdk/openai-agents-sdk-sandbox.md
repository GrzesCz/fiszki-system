---
title: 'Szczegóły: Sandbox Agents (Harness vs Compute)'
category: Agenci AI
status: zrobione
type: notatka
mindmaps: []
next_review_date: '2026-04-24'
review_count: 0
---
# Sandbox Agents (Harness vs Compute) – Ochroniarz dla Agenta

**Źródło:** Wykład Eda Donnera (Transkrypcja YT_FHM4Z9OjTwg).

Wyobraź sobie, że piszesz potężnego Agenta, który ma analizować Twoje lokalne pliki CSV i uruchamiać skrypty Pythona. Super sprawa! 
Ale zaraz... co jeśli Agent "zwariuje" i wpisze komendę `rm -rf /`? Albo co gorsza, co jeśli w jego kodzie złośliwy skrypt odczyta Twoje zmienne środowiskowe (z kluczami do OpenAI, Jiry, bazy danych) i wyśle je hakerom? 😱

Tu wjeżdża cała na biało najnowsza architektura w **OpenAI Agents SDK**, zwana **Sandbox Agents**.

---

## 1. Wielki Podział: Harness vs Compute (Uprząż i Obliczenia)

OpenAI podzieliło życie Agenta na dwie, rygorystycznie oddzielone od siebie strefy. Wyobraź to sobie jak więzienie o zaostrzonym rygorze:

1. 🧠 **Harness (Uprząż/Mózg):** To Ty, siedzący bezpiecznie w biurze. Tutaj działa pętla Agenta (Agent Loop), tutaj Agent rozmawia z LLM, uruchamia grzeczne narzędzia API (np. powiadomienia na telefon) i łączy się z serwerami MCP. **Co najważniejsze: to tutaj żyją Twoje tajne klucze API (.env).**
2. ⛓️ **Compute (Obliczenia/Sandbox):** To izolatka (Sandbox). To tam Agent trafia, kiedy musi dotknąć plików albo odpalić skrypt w terminalu. W tej izolatce NIE MA kluczy API. Jeśli Agent zdetonuje tam bombę, zniszczy tylko pusty pokój.

Dzięki temu, nawet jeśli kod wygenerowany przez Agenta jest wadliwy lub złośliwy, nie ma absolutnie żadnego dostępu do Twoich sekretów!

---

## 2. Trzy Filary Sandbox Agenta (Jak to skonfigurować?)

Zamiast zwykłego `Agent()`, tworzysz klasę `SandboxAgent`. Żeby Ochroniarz wpuścił Agenta do izolatki, musisz mu podać trzy dokumenty (konfiguracje):

### 📁 A. Manifest (Workspace)
Zamiast dawać Agentowi dostęp do całego swojego komputera, robisz dla niego "kserokopię" potrzebnego folderu. 
Podajesz folder np. `./data/` z plikiem `sales.csv`. Agent myśli, że pracuje na Twoich plikach, ale tak naprawdę działa na odizolowanej kopii. Może je usunąć, a Twoje prawdziwe pliki są bezpieczne!

### 🛡️ B. Capabilities (Uprawnienia)
Mówisz Ochroniarzowi: *"Zezwalam temu Agentowi tylko na dwie rzeczy: czytanie plików (w jego izolatce) i uruchamianie skryptów powłoki (shell scripts)"*. Nic więcej!

### ☁️ C. Run Config (Gdzie jest to więzienie?)
Definiujesz, **gdzie fizycznie** znajduje się ten Sandbox. I tu zaczyna się magia!
Możesz odpalić go lokalnie na swoim komputerze (używając kontenera: `Unix local sandbox` - uwaga: wymaga WSL na Windowsie). 
ALE...

---

## 3. Przeniesienie do Chmury (E2B) w Jednej Linijce! 🤯

Ed Donner w swoim wykładzie pokazuje absolutny "Wow factor". 
Kiedy już skonfigurujesz swojego Sandbox Agenta, przeniesienie go z Twojego lokalnego komputera do potężnej chmury zajmuje **zmianę JEDNEJ linijki kodu**!

Zamiast lokalnego `run_config`, używasz konfiguracji z chmury dedykowanej dla AI (np. **E2B**, Modal, Vercel). 
Zmieniasz klienta na `E2B sandbox client` i... to wszystko!

**Co się wtedy dzieje pod maską?**
1. Twój Mózg Agenta (Harness) nadal działa u Ciebie na laptopie.
2. Ale gdy przychodzi moment odpalenia skryptu na plikach... Agent wysyła to do chmury E2B!
3. E2B tworzy na sekundę bezpieczny mikrokontener w chmurze, odpala skrypt, odsyła Ci wynik (np. "$87,000 zarobku") i niszczy kontener.

**Twój komputer nawet nie poczuł, że coś liczył!** A Twoje klucze API nigdy nie opuściły Twojego laptopa. To jest właśnie prawdziwe inżynierskie mistrzostwo (Senior Enterprise).

---

## 4. Jak wygląda kod Sandbox Agenta w praktyce?

Oto pełny przykład z wykładu Eda Donnera (Lab 3 i Lab 4), rozbity na czynniki pierwsze. Zobaczysz tu dokładnie, jak zdefiniować te trzy nowe elementy (`manifest`, `capabilities`, `run_config`) i jak niewiele różni się to od zwykłego Agenta.

```python
import asyncio
from agents import Runner
# Zamiast zwykłego Agenta, importujemy SandboxAgent i klocki do jego budowy
from agents.sandbox import SandboxAgent, UnixLocalSandboxClient, E2BSandboxClient
from agents.sandbox.manifest import Manifest, LocalDir
from agents.sandbox.capabilities import Capabilities

# =====================================================================
# KROK 1: MANIFEST (Co Agent ma w swoim "więzieniu"?)
# =====================================================================
# Nie pozwalamy Agentowi grzebać na naszym dysku C:\. 
# Zamiast tego robimy kserokopię naszego folderu "./data" (gdzie leży np. plik sales.csv)
# i wrzucamy ją do Sandboxa. Agent widzi tylko ten wyizolowany katalog.
moj_manifest = Manifest(
    entries={
        "/data": LocalDir(path="./data") 
    }
)

# =====================================================================
# KROK 2: CAPABILITIES (Uprawnienia - na co pozwalamy?)
# =====================================================================
# Jawnie mówimy, co wolno robić wewnątrz Sandboxa. 
# Pozwalamy mu na modyfikację plików (we własnej izolatce) oraz na 
# uruchamianie skryptów terminalowych (żeby mógł wykonać napisany przez siebie kod).
moje_uprawnienia = Capabilities(
    file_system=True,
    shell=True
)

# =====================================================================
# KROK 3: TWORZENIE AGENTA (SandboxAgent)
# =====================================================================
# To wygląda prawie w 100% jak standardowy Agent. 
# Różnica polega na użyciu klasy SandboxAgent i dodaniu dwóch nowych parametrów na końcu.
sandbox_agent = SandboxAgent(
    name="Analityk Danych",
    model="gpt-4o",
    instructions="Przeczytaj plik sales.csv z folderu /data, napisz skrypt w Pythonie by go przeanalizować.",
    
    # Tutaj normalnie podajemy narzędzia i serwery MCP (np. Alpha Vantage)
    # One nadal działają u nas na komputerze (w warstwie "Harness")!
    # tools=[funkcja_powiadomienia_na_telefon], 
    # mcp_servers=[moj_serwer_mcp], 
    
    # NOWOŚĆ:
    manifest=moj_manifest,
    capabilities=moje_uprawnienia
)

# =====================================================================
# KROK 4: RUN CONFIG (Gdzie fizycznie odpalamy to więzienie?)
# =====================================================================
# Opcja A (LAB 3): Odpalamy Sandbox lokalnie na naszym komputerze (wymaga WSL na Windowsie).
# Tworzy to odizolowany kontener u nas na dysku.
# konfiguracja_uruchomienia = UnixLocalSandboxClient()

# Opcja B (LAB 4): Magia Chmury E2B! 
# Zmieniamy TYLKO TĘ JEDNĄ LINIJKĘ, a "Compute" (obliczenia na plikach i skryptach) 
# przenoszą się w ułamku sekundy na serwery chmurowe E2B. Mózg zostaje u nas.
konfiguracja_uruchomienia = E2BSandboxClient()

# =====================================================================
# KROK 5: URUCHOMIENIE (Runner)
# =====================================================================
async def main():
    # Używamy standardowego Runnera, ale musimy podać mu naszą konfigurację środowiska
    result = await Runner.run(
        agent=sandbox_agent, 
        input="Przeanalizuj sprzedaż i wyślij mi powiadomienie na telefon.",
        run_config=konfiguracja_uruchomienia  # NOWOŚĆ
    )
    print(result.final_output)

# Odpalenie kodu
asyncio.run(main())
```

### Co dokładnie dzieje się pod maską, gdy odpalisz ten kod? (Logika Eda z Lab 4)

Gdy zadajesz Agentowi pytanie *"Przeanalizuj sprzedaż (Compute) i wyślij mi powiadomienie (Harness)"*, to w **OpenAI Traces** zobaczysz niesamowitą rzecz:
1. Twoje tajne narzędzie z kluczami API (`funkcja_powiadomienia_na_telefon`) wykonuje się na Twoim laptopie. 
2. Ale gdy LLM generuje skrypt w Pythonie, żeby przeczytać `sales.csv`, ten skrypt nie odpala się na Twoim laptopie! Agent przez sieć łączy się z chmurą **E2B**.
3. E2B błyskawicznie buduje kontener, wrzuca do niego wygenerowany przez LLM skrypt i plik `sales.csv`, odpala ten kod, zwraca Ci wynik matematyczny i kasuje kontener.
4. **Złota reguła Bezpieczeństwa:** Ponieważ klucze do API, zmienne systemowe i Twoje własne narzędzia żyją po stronie "Harness" (Mózgu u Ciebie), złośliwy lub popsuty skrypt napisany przez Agenta w chmurze E2B NIE MA DO NICH DOSTĘPU. Nawet jeśli Agent skasuje cały system operacyjny w chmurze E2B, Twój komputer jest całkowicie bezpieczny!
