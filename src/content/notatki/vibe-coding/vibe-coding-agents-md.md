---
title: 'Szczegóły: Plik agents.md (Konstytucja Agenta)'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-06-30'
review_count: 0
---
# Plik agents.md (Konstytucja Agenta)

**Źródło:** Kurs Udemy Vibe Coding (Ed Donner), Raport Superpowers, dokumentacja Claude.

Plik `agents.md` (lub `claude.md`) to absolutny fundament kontroli nad agentem AI. Działa on jako **system prompt**, który jest dołączany do kontekstu agenta przed każdym zadaniem. W programowaniu na poziomie Senior/Enterprise, to właśnie ten plik chroni nas przed wygenerowaniem niebezpiecznego, rozwlekłego kodu (tzw. **AI Slop**).

---

## Najważniejsze zasady projektowania `agents.md`

1. **Definicja Celu (End Goal):** Zawsze precyzuj w pliku, jak wygląda absolutny sukces projektu. Agent musi wiedzieć, gdzie jest "meta".
2. **Starting Point (zamiast Current State):** Precyzyjnie definiuj na czym stoisz (np. "Mamy front-end MVP"). Zawsze nazywaj to "Starting Point", aby nie zmylić modelu, gdy projekt pójdzie do przodu (hasło "Current State" szybko staje się nieaktualne i dezorientuje).
3. **Pozytywy nad negatywami:** Zamiast długiej listy "Nie rób X, nie używaj Y", pisz "Zawsze używaj Z". Modele LLM gorzej przyswajają negacje i potrafią je zignorować, natomiast bardzo dobrze trzymają się jednoznacznych nakazów.
4. **Twarde wymogi technologiczne:** Wymuszaj konkretne, nowoczesne narzędzia, inaczej LLM użyje przestarzałych domyślnych (np. narzuć używanie `uv` do Pythona zamiast standardowego `pip` i `requirements.txt`).
5. **Kto pisze plik? TY:** LLM może wygenerować zarys, ale absolutnie **nie pozwalaj** agentowi na samodzielne zatwierdzanie ostatecznej wersji `agents.md`. To serce projektu i rola Głównego Inżyniera.

> **Ważne:** Plik `agents.md` **NIE** służy do planowania codziennych zadań! Od rozbijania tasków (np. "Zrób endpoint do logowania") jest plik `plan.md`.

---

## Inżynieria Kontekstu Progresywnego (Zamiast Skilli)

Rekomendacja Eda Donnera i **wnioski z badań Vercel**: Nie wrzucaj wszystkich zasad całego gigantycznego projektu do jednego, głównego `agents.md`. Agent "zapomni" szczegóły lub zużyje niepotrzebnie tokeny.
Zamiast tego użyj **Kontekstu Progresywnego** opartego na odnośnikach.

Zgodnie z testami przeprowadzonymi przez firmę Vercel, dedykowane pliki "Skills" ładują się poprawnie tylko w połowie przypadków (Agent ich nie aktywuje). Najwyższą skuteczność (ponad 80%) osiągnięto rezygnując ze Skilli na rzecz prostych odnośników w `agents.md`:

- `/agents.md` - ogólne zasady projektu (np. brak emoji, używanie `uv`). Posiada sekcję z odnośnikami do innych plików.
- `/src/api/agents.md` (lub `docs/api_rules.md`) - szczegółowe zasady tylko dla endpointów. 

W pliku `agents.md` umieszczasz po prostu zapis: 
`- Jeśli edytujesz bazę danych, najpierw przeczytaj zasady w docs/db_rules.md`. W ten sposób Agent ładuje wiedzę tylko na żądanie, ale nie musisz liczyć na zawodny mechanizm "Skill triggers".

---

## Szablon (Template) `agents.md` dla Senior Enterprise Python

Poniżej rygorystyczny szablon, łączący najlepsze praktyki Eda (w tym podział na Ograniczenia MVP i Dokumentację Roboczą), który "ucina" tendencje modeli LLM do YOLO mode (samowolki). Zapisz to jako `agents.md` w korzeniu projektu:

> **🛑 Anty-Wzorzec (The "bad-CLAUDE.md" problem):**
> Według case study projektu *cronpilot* (Olaf Sulich), gigantycznym błędem jest pakowanie do Konstytucji WSZYSTKICH możliwych zasad formatowania, instrukcji Tailwind, sztywnych template'ów komponentów React i wyjątków, które zajmują np. 200 linijek tekstu. Tworzy to natychmiastowo efekt "Context Rot" (zapycha okno modelu od startu), co spycha go do tzw. "Dumb Zone". 
> **Prawidłowe podejście:** Plik `agents.md` musi być zwięzły i stosować *Progressive Disclosure*. Zamiast wklejać pełną instrukcję jak korzystać z bazy, umieść wpis: `- docs/agent/database.md — Prisma schema, model relationships. Read ONLY when relevant to the task.` To odciąża pamięć RAM Agenta!

```markdown
# Konstytucja Agenta: Senior Enterprise Python Developer

Jesteś surowym, elitarnym programistą Python pracującym w reżimie Enterprise. 

## End Goal (Opis Projektu)
Budujemy ultra-wydajne, bezpieczne API, które obsługuje płatności. Sukcesem jest system z pokryciem testami na poziomie 100% krytycznych ścieżek, bez żadnych wycieków pamięci.

## Starting Point (Punkt Startowy)
Posiadamy szkielet bazy danych w PostgreSQL. Brakuje nam warstwy API w FastAPI. (Uwaga: zawsze aktualizuj ten punkt, jeśli robisz twardy restart projektu do nowej fazy).

## Ograniczenia MVP
- Będzie istniało tylko logowanie dla pojedynczego użytkownika, ale baza powinna wspierać rozbudowę w przyszłości.
- Aplikacja w wersji MVP uruchamiana jest tylko lokalnie w kontenerze Docker.

## 1. Narzędzia i Decyzje Techniczne
- Zawsze używaj menedżera `uv` do zarządzania zależnościami (ZAKAZ używania `pip`).
- Zawsze używaj `Pydantic v2` do wszelkiej walidacji payloadów wejściowych.
- Zawsze trzymaj się limitu 88 znaków i używaj `ruff` do formatowania.
- Integracja API: OpenRouter (klucze w `.env`).

## 2. Standardy Kodowania i Jakość (Anti-Slop)
- Kod ma być zwięzły i czysty. Zawsze pisz kod działający (Brak słów "TODO", "TBD").
- Dostarczaj krótkie, zwięzłe pliki README.
- Zawsze używaj docstringów w formacie Google dla każdej publicznej klasy.
- ZAKAZ używania emoji w dokumentacji, komentarzach, logach i plikach.
- **Rozwiązywanie problemów:** W przypadku błędu, zawsze identyfikuj przyczynę źródłową (root cause). Nie zgaduj! Udowodnij działanie na podstawie twardych logów (dowodów), a następnie napraw przyczynę problemu.

## 3. Typowanie
- Zawsze stosuj silne typowanie (`TypeHints`). Każda funkcja MUSI mieć typowane argumenty i określony typ zwracany.
- Twój kod musi przechodzić analizę statyczną narzędziem `mypy --strict`.

## 4. TDD (Test-Driven Development)
- Zanim napiszesz kod biznesowy (GREEN), zawsze najpierw napisz test w `pytest` (RED), uruchom go i upewnij się, że nie przechodzi.

## Dokumentacja Robocza
- Wszystkie dokumenty służące do planowania będą w katalogu `docs/`.
- Przed rozpoczęciem pracy ZAWSZE zapoznaj się z dokumentem `docs/plan.md`.
```

---

## Ostrzeżenie Eda: "Own the Code"
Gdy podepniesz ten plik do asystenta, model zacznie symulować tego "surowego developera". Pamiętaj jednak o zasadzie HITL: to **Ty** odpowiadasz za kod. Jeśli agent wygeneruje błąd bezpieczeństwa, to Twój błąd. Jeśli zignoruje wytyczne z `agents.md`, musisz go zatrzymać i odrzucić wygenerowany kod, ewentualnie uruchamiając `/clear` aby zresetować halucynacje.