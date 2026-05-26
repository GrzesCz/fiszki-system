---
title: 'Szczegóły: MCP, Plugins, Hooks i /loop (Rozszerzenia)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-05-19'
review_count: 0
---
# Rozszerzanie kompetencji Agenta: MCP, Plugins, Hooks i Skills (nawigacja)

**Źródło:** Kurs Udemy Vibe Coding (Ed Donner), dokumentacja platform agentowych.

Czysty model językowy (LLM) bez rozszerzeń jest zamknięty w bańce tekstowej. Narzędzia takie jak Skills, Plugins i protokół MCP (Model Context Protocol) dają mu interakcję ze światem rzeczywistym. **Szczegóły o samych Skillach (`SKILL.md`, Bullseye, Skill Creator, rama Osmani)** — w osobnym pliku [vibe_szczegoly_skills.md](/notatki/vibe-coding/vibe-coding-skills).

---

## 1. Złota zasada Eda: Hierarchia rozszerzeń (Plugins > Skills > MCP)

Aby to najprościej zrozumieć, posłużmy się analogią z placu budowy:
*   🔌 **MCP (Model Context Protocol):** To *kable, rury i uniwersalne gniazdka*. To czysty standard przesyłu danych. Sam w sobie nic nie robi, jest trudny w montażu, ale pozwala podłączyć potężne zewnętrzne maszyny do Twojego robota (Agenta).
*   📘 **Skills (Umiejętności):** To *firmowe instrukcje obsługi*. Krótkie, tekstowe pliki (często połączone ze skryptem), które uczą Twojego robota: "Gdy proszę o testy, weź wiertarkę, ustaw na tryb X i wywierć 4 dziury".
*   🧰 **Plugins (Wtyczki):** To *gotowa, kupiona w sklepie skrzynka z narzędziami*. Zawiera już odpowiednio docięte kable (MCP), wiertarkę, wbudowaną instrukcję (Skill), a często i dodatkowego małego robota (Sub-Agenta), który umie tego używać.

Zarządzanie tymi narzędziami to zarządzanie cennym **oknem kontekstowym** (pamięcią RAM agenta). Uruchomienie zbyt wielu potężnych rozszerzeń naraz powoduje "Context Rot" (Agent zapycha sobie mózg instrukcjami z narzędzi i głupieje). Dlatego Ed zaleca następujący proces decyzyjny:

1. **Domyślny wybór: Plugins (Gotowce).** Jeśli istnieje plugin robiący to, czego potrzebujesz (np. poprzez menu `/plugin` -> Discover), zainstaluj go. Ktoś mądrzejszy (np. inżynier z Anthropic) spakował już MCP, Agenty i Skille w optymalną paczkę (np. plugin `FeatureDev`). Wtyczkę łatwo wyłączyć w menu, by nie zżerała limitu tokenów, gdy jej nie potrzebujesz. Pamiętaj o przeładowaniu: `/reload-plugins`.
2. **Złoty standard firmowy: Skills.** Jeśli nie ma pluginu, ale masz konkretny skrypt (np. do testowania) lub zespół udostępnia standaryzowany proces — wygeneruj plik `SKILL.md` (np. przez *Skill Creator*) i wrzuć bezpośrednio do repozytorium do katalogu `.claude/skills/`.
3. **Ostateczność: Surowy MCP (Twarde dane).** Instaluj serwery MCP wprost (np. poleceniem `claude mcp add...`) TYLKO wtedy, gdy absolutnie potrzebujesz wstrzyknąć Agentowi dostęp do zewnętrznej, strumieniowanej bazy danych (np. Polygon API, Jira, GitHub) i nie ma do tego wtyczki. **Ostrzeżenie:** Surowe MCP jest "głodne" na tokeny. Jeśli musisz użyć MCP, zrób to, a potem odepnij serwer (`claude mcp remove`), gdy zadanie jest skończone.

---

## 2. Model Context Protocol (MCP)

MCP to otwarty standard (kabelek "USB-C") do łączenia LLM-ów z narzędziami zewnętrznymi (JIRA, Github). Pamiętaj: to **Narzędzia (Tools)** są innowacją, a MCP to tylko protokół przesyłowy.

### MCP vs CLI w Skillach (Podejście Olafa Sulicha)
Zainstalowanie wielu serwerów MCP zapycha okno kontekstowe już od startu sesji (Agent dostaje potężny opis każdego narzędzia). Dlatego obecnie wielu profesjonalistów (jak Sulich) woli wbudowywać obsługę zewnętrznych narzędzi nie przez "ciężkie" serwery MCP, ale przez komendy systemowe CLI podpięte bezpośrednio do Skilli. 
*Przykład:* Zamiast instalować MCP przeglądarki Chrome na całą sesję, buduje się Skilla `Agent Browser`, który daje Agentowi instrukcje, jak uruchomić mały skrypt konsolowy robiący screenshoty. Mniejsze zużycie kontekstu, ta sama skuteczność.

### Bezpieczeństwo i Architektura (Host, Client, Server)
- Jeśli podpinasz MCP do Claude Code, Claude jest Hostem/Klientem, a zewnętrzne narzędzie Serwerem.
- Oszczędzaj kontekst! Każdy aktywny MCP ładuje swoje opisy narzędzi do promptu. Zbyt dużo MCP = *Context Rot*. Wyłączaj to, czego nie używasz.
- **Lokalne serwery wcale nie są lokalne:** Uruchomienie serwera przez `npx` na localhost nie oznacza prywatności! Serwer prawdopodobnie wyśle Twój kod do obcego API. Nigdy nie instaluj MCP z losowych Marketplace'ów — weryfikuj na GitHubie.

### Uwierzytelnianie MCP: GitHub Fine-Grained Tokens i Atlassian OAuth

Kiedy używasz serwerów MCP łączących się z chmurą (np. GitHub lub Jira), odpowiednie uwierzytelnienie to podstawa. Niewłaściwa konfiguracja powoduje "ciche" zawieszanie się agenta.

**1. Atlassian (Jira/Confluence) - Problem wygasającej sesji OAuth:**
Oficjalny serwer Atlassian MCP używa autoryzacji OAuth, która co jakiś czas wygasa ze względów bezpieczeństwa.
- **Objaw błędu:** Prosisz agenta o np. stworzenie ticketa w Jirze. Agent w CLI po prostu się zawiesza ("wisi"), przetwarza w nieskończoność i nic nie zwraca. Nie wyrzuca błędu, tylko czeka na odpowiedź serwera, który odrzucił żądanie z powodu braku uprawnień.
- **Rozwiązanie (Re-autentykacja):** Musisz ręcznie odnowić sesję. Wpisz polecenie `/mcp` w Claude Code, aby otworzyć menu zarządzania serwerami. Znajdź swój serwer Atlassian i użyj opcji "re-authenticate" (często wymusza to ponowne otwarcie przeglądarki i logowanie). Po udanej autoryzacji wróć do terminala i powtórz żądanie. Pamiętaj: operacje zapisu (modyfikacja danych w Jirze) zawsze wymagają aktywnej sesji!

**2. GitHub - Dlaczego tylko Fine-Grained Tokens?**
Przy pracy z serwerami MCP dla GitHuba stanowczo unikaj używania klasycznych, ogólnych tokenów (Classic Personal Access Tokens - PAT) przypisanych do całego konta. Jeśli to zrobisz, dajesz agentowi AI "klucz główny" do absolutnie wszystkich swoich prywatnych i firmowych repozytoriów.
- **Złota zasada:** Zawsze twórz nowe **Fine-Grained Personal Access Tokens** (Tokeny szczegółowe) w ustawieniach GitHuba (Developer settings).
- **Zasada najmniejszych przywilejów:** Podczas tworzenia tokena przypisz mu dostęp **wyłącznie do tego jednego, konkretnego repozytorium**, nad którym aktualnie pracujesz. Dzięki temu, nawet jeśli agent "zwariuje" lub źle zrozumie polecenie (halucynacja), ryzyko jakichkolwiek szkód jest ściśle izolowane tylko do tego jednego projektu.

---

## 3. Skills (Umiejętności) — osobny plik szczegółów

Tu trzymamy tylko **miejsce w hierarchii**: patrz § 1 powyżej (Plugins jako domyślny wybór, potem Skills, na końcu surowy MCP). Pełny opis znajdziesz tutaj:

- 📎 **[Skills: `SKILL.md`, Bullseye, Code Mode, Skill Creator, rama Addy Osmaniego](/notatki/vibe-coding/vibe-coding-skills)**

---

## 4. Hooks (Zdarzenia Cyklu Życia) – czyli bezlitosny bramkarz w klubie

Czym u licha są te całe "Hooki" (Lifecycle Callbacks)? Wyobraź sobie, że Agent AI to taki bardzo zdolny, ale bywa, że roztrzepany pracownik na budowie. *Skille* to uprzejme instrukcje, które mu dajesz: "jak kładziesz kafelki, używaj tego kleju". Agent zazwyczaj się ich słucha, ale czasem o czymś zapomni albo stwierdzi: "A, zrobię po swojemu, szybciej będzie".

I tutaj z pomocą przychodzą **Hooki** (ang. *hak*). Hook to nie jest grzeczna prośba. Hook to jest **bezwzględny kierownik zmiany** (albo bramkarz w klubie), którego ustawiasz na konkretnym etapie pracy – np. przy drzwiach wejściowych (`start`) albo wyjściowych (`stop`). 

Hook działa **brutalnie i w stu procentach automatycznie**. Agent nie ma tu nic do gadania i nie może tego zignorować. Zaleca się w nich używać sztywnych komend systemowych (np. basha), a nie miękkich promptów tekstowych.

### 5 Twarzy Bramkarza (Pełna taksonomia Eventów)
Hook to nie tylko sprawdzanie na końcu zadania. Profesjonalne ramy (jak te analizowane przez ekspertów od Agent Development Kit) definiują konkretną drogę: **Event fires $\rightarrow$ Matcher checks $\rightarrow$ Command runs**. Masz do dyspozycji 5 momentów, w których możesz uderzyć Agenta po łapach:

1. **`SessionStart`** – Kiedy Agent dopiero zaczyna pracę (np. odpalenie basha, żeby ustawić zmienne środowiskowe).
2. **`PreToolUse`** – Kiedy Agent WYCIĄGA RĘKĘ po narzędzie. Tu robisz najtwardsze blokady (np. ucinasz mu łapy, gdy próbuje odpalić `rm -rf` albo wypchnąć coś prosto na gałąź `main`).
3. **`PostToolUse`** – Kiedy Agent SKOŃCZYŁ używać narzędzia. Np. "auto-lint na Write" – zapisał plik? Bum, od razu odpalasz linter na tym pliku, zanim agent pomyśli o kolejnym kroku.
4. **`SubagentStop`** – Kiedy "podwykonawca" (Sub-Agent) kończy zlecenie.
5. **`Stop`** – Nasz główny strażnik bramy przed oddaniem zadania szefowi (opisany szczegółowo poniżej).

Pamiętaj złotą zasadę z branży: *"Twarde bariery (Hooki) biją sprytne prompty za każdym razem"*.

### Przykład z życia: "Strażnik bramy" (Pre-Finish)

Załóżmy, że Twój Agent AI właśnie z zadowoleniem oznajmia: *"Szefie, skończyłem! Napisałem funkcję, wszystko działa, zamykam zadanie"*. (To jest w systemie zdarzenie `on_stop`).

Gdybyś nie miał Hooka, musiałbyś sam wszystko ręcznie sprawdzić, bo Agentom zdarza się po prostu kłamać. Ale jako cwany inżynier podpiąłeś pod `on_stop` skrypt bashowy. 

Co się wtedy dzieje? Nasz "bramkarz" (Hook) automatycznie blokuje Agentowi wyjście i mówi: *"Chwileczkę, koleżko. Sprawdzimy to"*. Hook sam w tle odpala testy bezpieczeństwa (`bandit`), sprawdza jakość kodu (`flake8`) i odpala testy jednostkowe (`pytest`). 

- **Jeśli wszystko świeci na zielono:** Bramkarz puszcza Agenta przodem, zadanie faktycznie zostaje z sukcesem zakończone.
- **Jeśli cokolwiek na teście wybuchnie (czerwony błąd):** Bramkarz cofa Agenta z powrotem do pracy, rzuca mu prosto w okno rozmowy surowe logi z błędem i mówi: *"Oblałeś testy. Nigdzie nie idziesz, dopóki tego nie naprawisz!"*.

Najpiękniejsze w tym wszystkim jest to, że Ty – jako programista – w ogóle nie musisz na to patrzeć! Siedzisz i pijesz kawkę, a mechanizm Hooka sam dyscyplinuje Agenta i zmusza go do poprawek, zanim ten w ogóle ośmieli się pokazać Ci ostateczny wynik.

---

## 5. Własne Pluginy (Custom Plugins) - Automatyzacja Zespołu

Oprócz korzystania z gotowych wtyczek z menu `/plugin`, jako zaawansowany "Vibe Engineer" **możesz tworzyć własne instalatory narzędzi (Custom Plugins)**. Ed Donner określa to jako funkcję "PRO", która pozwala potężnie ustandaryzować pracę całego zespołu programistów.

### Czym jest własny Plugin?
To w zasadzie "paczka" (bundle). Nie budujesz w niej nowej, skomplikowanej technologii od zera. Pakujesz w nią:
1. Skonfigurowane serwery **MCP** (np. podłączenie do specyficznego firmowego API).
2. Gotowe **Skille** (pliki `SKILL.md` z procedurami).
3. Własne **Hooki** (skrypty do automatyzacji zdarzeń).
4. Czasem również własne **Agenty**.

Zamiast kazać każdemu z inżynierów w zespole ręcznie konfigurować 3 serwery MCP i wgrywać 5 skilli, każesz im zainstalować jeden Twój Plugin.

### Jak to technicznie zrobić? (Wewnętrzny Marketplace)

1. **Stworzenie rejestru (`marketplace.json`):**
   W firmowym repozytorium (lub intranecie) tworzysz specjalny plik `marketplace.json`. W nim definiujesz listę swoich wtyczek, linki do ich repozytoriów Git i co zawierają.
2. **Dystrybucja:**
   Podajesz reszcie zespołu adres URL do swojego pliku `marketplace.json`. Programiści w swoich terminalach Claude Code dodają Twój firmowy adres do zaufanych źródeł Marketplace.
3. **Instalacja 1 kliknięciem:**
   Kiedy członek zespołu wpisze komendę `/plugin` i wejdzie w `Discover`, zobaczy Twoje firmowe pluginy (np. "FirmaXYZ Security Tools"). Wciska `i` (install), a jego agent automatycznie zasysa cały pakiet skilli, hooków i serwerów.

### Ostrzeżenie Eda: Nie śpiesz się z Pluginami! (Custom Skills vs Custom Plugins)

Tutaj ważne sprostowanie do hierarchii: O ile Ed zaleca **korzystać** z gotowych Pluginów przed gotowymi Skillami, o tyle jeśli chodzi o **tworzenie własnych narzędzi dla zespołu**, kolejność jest **dokładnie odwrotna**:

1. **Zawsze zaczynaj od tworzenia własnych Skills** (proste, szybkie, działają automatycznie przez Git).
2. **Dopiero na samym końcu, jako ostateczność (funkcja "PRO"), twórz własne Plugins** (trudniejsze w dystrybucji, wymagają centralnego rejestru).

Oto szczegółowe zestawienie, czym te dwa elementy tak naprawdę się różnią w kontekście ich *tworzenia*:

| Cecha | Własny Skill (Custom Skill) | Własny Plugin (Custom Plugin) |
| :--- | :--- | :--- |
| **Czym to jest?** | To pojedyncza "instrukcja" - jeden plik tekstowy z wiedzą. | To "skrzynka z narzędziami" - dystrybucyjna paczka łącząca serwery MCP, Skille i Hooki. |
| **Format pliku** | Zwykły plik Markdown (`SKILL.md`) z nagłówkiem YAML. | Plik konfiguracyjny (np. `marketplace.json`), który definiuje paczkę. |
| **Sposób dystrybucji** | Banalny: wrzucasz plik do folderu `.claude/skills/` w projekcie i robisz `git push`. | Trudniejszy: musisz hostować plik w sieci firmowej lub na otwartym GitHubie. |
| **Instalacja przez zespół** | Automatyczna: wystarczy, że ktoś zrobi `git pull` repozytorium kodu. | Wymaga akcji manualnej: nowy programista wpisuje `/plugin`, dodaje URL rejestru i klika `Install`. |
| **Kiedy stosować?** | **Zawsze na początku.** Do 90% zadań (np. "wymuś walidację przez Pydantic i Ruff"). | **Tylko w wielkim Enterprise.** Gdy nowy programista (onboarding) musi mieć w 5 sekund skonfigurowane JIRA MCP, bazę danych, i 10 skilli na raz. |

#### Przykład zapisu: Własny Skill
Własny skill to namacalny plik z instrukcjami, żyjący w folderze projektu (np. `.claude/skills/code_review/SKILL.md`):

```yaml
---
description: >
  Uruchamia linter Ruff i formatuje kod.
  Używaj zawsze przed zrobieniem commita.
---
# Python Ruff Linter Skill

Jako asystent, kiedy użytkownik prosi o sprawdzenie kodu lub przygotowanie commita:
1. Uruchom narzędzie: `uv run ruff check . --fix`
2. Następnie: `uv run ruff format .`
3. Zwróć krótką tabelę z naprawionymi plikami.
```

#### Przykład zapisu: Własny Plugin (Wewnętrzny Rejestr / Bundle)
Własny plugin **nie zawiera** zazwyczaj samego promptu, a jedynie **grupuje** inne narzędzia w jedną paczkę dystrybucyjną (tzw. Custom Marketplace). Tworzysz plik `marketplace.json` (hostowany na serwerze firmy):

```json
{
  "name": "Acme Corp Developer Pack",
  "version": "1.0.0",
  "description": "Kompletna paczka startowa dla programistów firmy Acme.",
  "plugins": [
    {
      "id": "acme-core-tools",
      "displayName": "Narzędzia Główne (API + Lintery)",
      "mcpServers": {
        "acme-jira": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-jira"]
        }
      },
      "skills": [
        "https://github.com/acme-corp/tools/raw/main/skills/ruff_linter.md",
        "https://github.com/acme-corp/tools/raw/main/skills/security_check.md"
      ]
    }
  ]
}
```
*Jak widać, Plugin to instalator: automatycznie konfiguruje w systemie nowego programisty serwer Jiry i pobiera zewnętrzne pliki Skilli. Nie musisz mu tłumaczyć, jak instalować MCP i gdzie skopiować skille.*

---

## 6. Wbudowana orkiestracja w tle: Komenda `/loop`

Oprócz uruchamiania zadań ad-hoc, Claude Code posiada potężną wbudowaną funkcję zwaną **Loop** (zainspirowaną rozwiązaniami typu Open Devin / Open Claw). **Nie jest to żaden zewnętrzny skrypt ani wtyczka** – to natywna, wbudowana komenda w terminalu Claude Code.

### Czym jest `/loop` i jak technicznie działa?
To komenda w CLI, która każe Agentowi **cyklicznie wybudzać się i wykonywać zadanie** w tle.
Gdy wpisujesz np. `/loop 10m Sprawdź folder 'src' i zrób Code Review nowych plików`:
1. Agent wykonuje polecenie natychmiast.
2. Po zakończeniu terminal wchodzi w stan zawieszenia (hibernacji).
3. Rozpoczyna się odliczanie (tutaj 10 minut).
4. Po upływie czasu Claude Code **sam się wybudza**, używa tego samego promptu i wykonuje zadanie ponownie.
5. Proces trwa w nieskończoność (lub do ręcznego przerwania, np. `Ctrl+C`).

**Przykłady użycia (Idealne do ról "Obserwatora / Strażnika"):**
- **Półautomatyczny QA Tester:** `/loop 5m Uruchom pytest. Jeśli coś padnie, znajdź w kodzie miejsce, gdzie to zepsułem, i zasugeruj naprawę.` (Piszesz kod w IDE, a w drugim oknie Agent testuje go w tle).
- **Monitorowanie i Triage (z podpiętym MCP Jiry):** `/loop 1h Sprawdź nowe tickety w Jirze. Jeśli któryś ma tag 'BUG' i dotyczy bazy danych, przypisz go do mnie i wyślij podsumowanie.`
- **Research:** `/loop 30m Przeczytaj stronę główną Hacker News i powiadom mnie tylko, jeśli pojawi się nowy artykuł o LLM-ach.`

### Jak to uruchomić?
Wpisujesz w Claude Code `/loop` a następnie interwał (np. `10s`, `1m`, `10m`, `5h`). Minimalny rzeczywisty interwał to 1 minuta (nawet jeśli wpiszesz `40s`, zostanie automatycznie zaokrąglone w górę).

### Prawdziwa rewolucja: Kontekst (czyli Agent ma pamięć!)
Zwykły skrypt pythonowy podpięty pod harmonogram (`cron`) jest "głupi" – przy każdym obrocie pętli uruchamia się na czysto i wysyłałby Ci powiadomienia o tych samych 5 artykułach co 10 minut.

Z kolei `/loop` w Claude Code jest "stanowy". Cała pętla operuje w **ramach jednej, trwającej sesji konwersacji**. Agent "pamięta", że 10 minut temu wysłał Ci już dany artykuł. Kiedy wybudza się ponownie i patrzy na listę, analizuje historię rozmowy: *"O, ten tekst już wysłałem szefowi, zignoruję go. O, a ten jest nowy! Wyślę tylko ten jeden"*. Dzięki temu identyfikuje tylko **faktycznie nowe** wiadomości, nie spamując Cię duplikatami!

### ⚠️ Ostrzeżenie Eda: Haczyk kosztowy!
Z funkcją `/loop` wiąże się jedno ogromne niebezpieczeństwo – **koszty zużycia API**.
Jeśli puścisz pętlę co minutę, która musi przetwarzać ogromne logi, to z każdym obrotem wysyłasz wielką ilość tokenów (zwłaszcza na najdroższym modelu Claude 3.5 Sonnet). Jeśli zapomnisz wyłączyć pętli na noc, rano możesz obudzić się z gigantycznym rachunkiem za API, ponieważ Agent co minutę prowadził wielką konwersację "sam ze sobą". Używaj `/loop` rozważnie: na długich interwałach lub tylko w trakcie aktywnej pracy.