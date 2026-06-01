---
title: 'Analiza uzupełnień: fundamenty Vibe Coding na poziomie Senior Enterprise'
category: Vibe Coding
status: zrobione
type: notatka
hidden: true
next_review_date: '2026-06-04'
review_count: 0
---

# Analiza uzupełnień dla notatek fundamentów Vibe Coding

Analizowane pliki:

- `vibe-coding-skills.md`
- `vibe-coding-plan-md.md`
- `vibe-coding-agents-md.md`
- `vibe-coding-code-review.md`
- `vibe-coding-mindset-workflow.md`

## Werdykt zbiorczy

Te notatki dobrze tłumaczą podstawową mechanikę pracy z agentem: konstytucja (`agents.md`), plan wykonawczy (`plan.md`), skille, review, HITL, reset kontekstu i walka z AI slopem. To jest dobry fundament nauki Superpowers.

Jeśli jednak mają uczyć pracy na poziomie **Senior Enterprise**, wymagają uzupełnienia o brakującą warstwę inżynierską:

- gdzie trzymać decyzje projektowe,
- kiedy agent nie może zaczynać kodowania,
- jak mierzyć jakość,
- jak prowadzić discovery,
- jak pisać ADR-y,
- jak zarządzać ryzykiem,
- jak chronić dane i sekrety,
- jak wymuszać CI/CD,
- jak robić release readiness,
- jak rozróżniać workflow AI od realnego procesu software delivery.

Najważniejsza korekta: obecne notatki dobrze uczą **sterowania agentem**, ale powinny mocniej uczyć, że senior używa agenta jako wykonawcy procedur, a nie jako zastępstwa dla architektury, wymagań, ryzyka i odpowiedzialności operacyjnej.

## Mapa odpowiedzialności: co gdzie powinno trafić

To warto dopisać jako wspólną zasadę do kilku notatek, bo obecnie granice między plikami są miejscami nieostre.

| Artefakt | Odpowiedzialność | Czego nie powinien zawierać |
|---|---|---|
| `agents.md` | Stałe zasady zachowania agenta, standard jakości, zakazy, bramki bezpieczeństwa, zasady HITL | Szczegółowego backlogu i całej specyfikacji projektu |
| `plan.md` | Kolejność pracy, fazy, taski, DoD, komendy weryfikacyjne, status wykonania | Ogólnej filozofii i stałych zasad jakości |
| `SKILL.md` | Powtarzalna procedura, np. ADR, threat modeling, release readiness, API review | Wiedzy specyficznej dla jednego projektu, jeśli nie ma być reużywana |
| `docs/*.md` | Konkretna wiedza projektowa: wymagania, domena, ADR-y, ryzyka, kontrakty, runbooki | Globalnych instrukcji dla agenta |
| CI/CD | Obiektywna bramka jakości niezależna od deklaracji agenta | Ręcznych obietnic typu "agent sprawdził" |

## 1. `vibe-coding-skills.md`

### Co jest dobre

Notatka dobrze tłumaczy:

- czym jest Skill,
- różnicę między wiedzą a procesem,
- zasadę "process over prose",
- znaczenie pola `description`,
- progressive disclosure,
- potrzebę dowodów zakończenia pracy.

To dobry materiał dla osoby, która zaczyna budować własne procedury dla agenta.

### Co warto uzupełnić

#### 1. Dodać taksonomię skilli Senior Enterprise

Obecnie notatka mówi, czym są skille, ale nie mówi, jakie skille realnie powinien mieć Python senior pracujący z Superpowers.

Proponowane uzupełnienie:

```text
.claude/skills/
├── product-discovery/
├── adr-writer/
├── domain-modeling/
├── api-contract-review/
├── database-migration-review/
├── threat-modeling/
├── observability-check/
├── performance-readiness/
├── ci-quality-gate/
├── release-readiness/
└── incident-debugging/
```

To pokaże uczącemu się, że skille nie są tylko "sprytnymi instrukcjami", ale biblioteką powtarzalnych praktyk seniora.

#### 2. Dodać sekcję "Kiedy NIE tworzyć skilla"

Skill nie powinien być śmietnikiem na wszystko.

Dopisałbym reguły:

- Jeśli informacja dotyczy tylko jednego projektu, zapisz ją w `docs/`.
- Jeśli informacja jest stałą zasadą zachowania, zapisz ją w `agents.md`.
- Jeśli to jednorazowe zadanie, zapisz je w `plan.md`.
- Jeśli to powtarzalna procedura używana w wielu projektach, zrób `SKILL.md`.

#### 3. Dodać lifecycle skilla

Senior enterprise musi traktować skille jak kod.

Brakuje:

- wersjonowania skilli,
- changeloga,
- ownera,
- testów/evals,
- przykładów dobrego i złego użycia,
- kryteriów usunięcia przestarzałego skilla,
- review przed wrzuceniem skilla do zespołu.

Proponowany fragment:

```markdown
## Lifecycle skilla
- Każdy skill ma ownera.
- Każda zmiana skilla przechodzi code review.
- Skill ma przykładowe prompty testowe.
- Skill ma listę sytuacji, w których nie wolno go używać.
- Skill jest wersjonowany razem z repozytorium.
```

#### 4. Dodać minimalny template Senior Enterprise `SKILL.md`

Obecna notatka opisuje zasady, ale przydałby się szablon:

```markdown
---
name: threat-modeling
description: >
  Prowadzi threat modeling dla funkcji API lub integracji.
  Używaj, gdy zadanie dotyka auth, danych wrażliwych, publicznych endpointów,
  płatności, uploadu plików lub integracji zewnętrznych.
---

## Cel
Wykryć ryzyka bezpieczeństwa przed implementacją.

## Wejścia
- opis funkcji
- diagram/architektura
- dane przetwarzane przez funkcję
- granice zaufania

## Procedura
1. Zidentyfikuj aktywa.
2. Zidentyfikuj aktorów.
3. Zidentyfikuj entrypointy.
4. Zastosuj STRIDE.
5. Zaproponuj mitigacje.
6. Zapisz testy bezpieczeństwa wymagane w `plan.md`.

## Dowód zakończenia
- `docs/threat_model_<feature>.md`
- lista ryzyk z severity
- lista wymaganych testów
```

#### 5. Dodać ostrzeżenie o danych i sekretach

Skille mogą zachęcić agenta do zbierania kontekstu. Trzeba dopisać:

- nie kopiuj `.env` do raportów,
- maskuj sekrety,
- nie wysyłaj PII do promptów,
- nie uruchamiaj skryptów produkcyjnych bez zgody,
- skill nie może samodzielnie nadawać agentowi uprawnień.

## 2. `vibe-coding-plan-md.md`

### Co jest dobre

Notatka dobrze pokazuje, że `plan.md` to state-tracker i lista zadań. Trafne są:

- bite-sized chunks,
- DoD,
- aktualizowanie planu po etapach,
- reset kontekstu,
- komendy startowe dla nowej sesji,
- zakaz przechodzenia dalej bez zakończenia fazy.

### Co warto uzupełnić

#### 1. Dodać pre-implementation phases

Obecny szablon zaczyna zbyt blisko implementacji. Dla Senior Enterprise `plan.md` powinien wymuszać fazy przed kodem:

```markdown
## Faza -2: Discovery
- [ ] Przygotuj `docs/product_brief.md`.
- [ ] Opisz użytkowników i przypadki użycia.
- [ ] Zdefiniuj scope MVP i poza-scope.
- [ ] Zapisz wymagania funkcjonalne i niefunkcjonalne.
- [ ] DoD: użytkownik akceptuje zakres.

## Faza -1: Architektura
- [ ] Przygotuj `docs/domain_model.md`.
- [ ] Przygotuj `docs/architecture.md`.
- [ ] Przygotuj ADR-y dla głównych decyzji.
- [ ] Zdefiniuj kontrakty API.
- [ ] Zdefiniuj ryzyka w `docs/risk_register.md`.
- [ ] DoD: użytkownik akceptuje architekturę i ryzyka.
```

#### 2. Dodać standardowy blok "Risk & Rollback"

Każda większa faza powinna mieć ryzyka i rollback:

```markdown
## Ryzyka fazy
- Ryzyko:
- Prawdopodobieństwo:
- Wpływ:
- Mitigacja:
- Plan rollbacku:
```

To szczególnie ważne przy bazie danych, auth, płatnościach i integracjach.

#### 3. Dodać "Verification Matrix"

Plan powinien mówić, jak udowodnić, że funkcja działa:

```markdown
## Verification Matrix
| Obszar | Komenda / dowód | Wymagany wynik |
|---|---|---|
| Format | `uv run ruff format --check src tests` | 0 błędów |
| Lint | `uv run ruff check src tests` | 0 błędów |
| Typy | `uv run mypy src --strict` | 0 błędów |
| Testy | `uv run pytest` | zielone |
| Security | `uv run bandit -r src` | brak High |
| API | OpenAPI diff | brak breaking changes |
```

#### 4. Dodać status log

Przy dłuższych pracach plan powinien mieć krótki dziennik decyzji:

```markdown
## Status Log
- 2026-05-28: Wybrano PostgreSQL jako source of truth, ADR-0002.
- 2026-05-28: Redis tylko cache/rate-limit, nie źródło prawdy.
```

To zmniejsza ryzyko utraty kontekstu po `/clear`.

#### 5. Dodać rozróżnienie typów tasków

Plan powinien oznaczać typ pracy:

- `DISCOVERY`
- `ARCH`
- `TEST-RED`
- `IMPL-GREEN`
- `REFACTOR`
- `SECURITY`
- `OBSERVABILITY`
- `DOCS`
- `RELEASE`

To uczy, że senior nie robi tylko "kodowania".

## 3. `vibe-coding-agents-md.md`

### Co jest dobre

Notatka dobrze wyjaśnia:

- rolę `agents.md` jako konstytucji,
- różnicę między `agents.md` i `plan.md`,
- potrzebę zwięzłości,
- progressive disclosure,
- ryzyko context rot,
- to, że człowiek powinien zatwierdzać ostateczny `agents.md`.

### Co warto uzupełnić

#### 1. Doprecyzować relację `agents.md` vs Skills

W pliku pojawia się sekcja "Inżynieria Kontekstu Progresywnego (Zamiast Skilli)". To może zostać źle zrozumiane jako "nie używaj skilli".

Proponowana korekta:

- `agents.md` jest dobry do zasad globalnych i linków do dokumentów.
- `SKILL.md` jest dobry do powtarzalnych procedur.
- Dokumenty w `docs/` są dobre do wiedzy projektowej.

Czyli nie "zamiast skilli", tylko "nie wciskaj wszystkiego do skilli; używaj właściwego artefaktu".

#### 2. Dodać bramkę "nie koduj przed discovery"

Do szablonu `agents.md` warto dopisać:

```markdown
## Bramka przed implementacją
- Nie pisz kodu produkcyjnego, jeśli nie istnieją:
  - `docs/product_brief.md`
  - `docs/requirements.md`
  - `docs/domain_model.md`
  - `docs/architecture.md`
  - `docs/risk_register.md`
- Jeśli dokumentów brakuje, najpierw zaproponuj ich utworzenie.
- Jeśli wymagania są sprzeczne, zatrzymaj się i zadaj pytania.
```

#### 3. Dodać sekcję "Enterprise non-negotiables"

Szablon powinien wymuszać nie tylko narzędzia, ale też zachowania:

```markdown
## Enterprise non-negotiables
- Każda istotna decyzja techniczna ma ADR.
- Każda zmiana API ma kontrakt i test kontraktowy.
- Każda migracja bazy ma test i plan rollbacku.
- Każda publiczna funkcja ma logowanie błędów i metrykę sukcesu/porażki.
- Każda zmiana auth/security wymaga threat modelingu.
- Każda zmiana musi mieć dowód weryfikacji: test, build, log albo raport.
```

#### 4. Dodać zasady pracy z danymi

Brakuje sekcji bezpieczeństwa danych:

```markdown
## Dane, sekrety i prywatność
- Nigdy nie zapisuj sekretów w kodzie ani raportach.
- Maskuj tokeny, hasła, klucze API i dane osobowe.
- Nie używaj produkcyjnej bazy w testach lokalnych.
- Nie kopiuj danych wrażliwych do promptów.
- Jeśli wykryjesz sekret w repo, zatrzymaj pracę i zgłoś rotację sekretu.
```

#### 5. Złagodzić dogmaty narzędziowe

"Zakaz pip" jest dobry jako preferencja projektu, ale enterprise czasem ma narzucone standardy. Lepsza forma:

```markdown
- Domyślnie używaj `uv`, chyba że repozytorium ma już zatwierdzony inny standard.
- Nie mieszaj managerów zależności bez ADR i zgody użytkownika.
```

To jest bardziej seniorowe, bo uwzględnia istniejące standardy organizacji.

## 4. `vibe-coding-code-review.md`

### Co jest dobre

Notatka dobrze pokazuje:

- izolację recenzenta,
- read-only review,
- raport przed poprawkami,
- weryfikację halucynacji,
- retesty,
- cross-model review.

To jest bardzo dobry kierunek dla pracy z agentem.

### Co warto uzupełnić

#### 1. Rozróżnić code review PR od audytu repo

Obecnie "code review" i "audyt całego repo" są trochę wymieszane.

Warto dopisać:

| Typ review | Zakres | Wynik |
|---|---|---|
| PR review | tylko diff i wpływ na sąsiedni kod | komentarze do PR / `docs/pr_review.md` |
| Security audit | cały obszar bezpieczeństwa | `docs/security_audit.md` |
| Architecture review | granice modułów, zależności, ADR | `docs/architecture_review.md` |
| Legacy audit | ryzyka refaktoryzacji | `docs/audit_report.md` |

#### 2. Dodać severity matrix

Same etykiety Critical/High/Medium/Low są za mało precyzyjne. Dodałbym:

```markdown
## Severity Matrix
- Critical: realna podatność, utrata danych, brak auth, awaria produkcji.
- High: wysokie ryzyko exploita/regresji, brak kontroli dostępu, nieobsłużone migracje.
- Medium: dług techniczny wpływający na utrzymanie lub testowalność.
- Low: styl, małe uproszczenia, lokalne usprawnienia.
```

#### 3. Dodać wymóg dowodu

Każde znalezisko powinno mieć:

- plik i linię,
- cytat z kodu,
- wpływ,
- scenariusz reprodukcji,
- sugerowaną poprawkę,
- test, który powinien powstać,
- status: real / false positive / needs verification.

#### 4. Uważać z sekcją o "nieposłuszeństwie"

Obecnie przekaz "zawsze miej ostatnie zdanie" może zachęcić do przepychania ryzykownych zmian. Senior powinien rozróżnić:

- agent unika pracy bez powodu,
- agent słusznie wykrywa ryzyko,
- plan jest błędny i trzeba go zmienić.

Proponowane doprecyzowanie:

```markdown
Jeśli agent odmawia, najpierw zażądaj impact analysis:
- co dokładnie jest ryzykowne,
- jakie pliki są dotknięte,
- jakimi testami można zabezpieczyć zmianę,
- czy można podzielić zmianę na mniejsze kroki.
```

#### 5. Dodać review checklisty tematyczne

Dla Python Enterprise przydałyby się osobne checklisty:

- auth/authz,
- API contracts,
- database/migrations,
- async/resource cleanup,
- error handling,
- logging/observability,
- dependency/security,
- test quality,
- performance.

## 5. `vibe-coding-mindset-workflow.md`

### Co jest dobre

Notatka dobrze podkreśla:

- nie zaczynaj od kodu,
- ticket jako źródło zadania,
- zadawanie pytań przed pracą,
- obserwowanie agenta,
- ryzyko utraty umiejętności,
- systematyczne debugowanie,
- context rot,
- świadome resetowanie kontekstu.

To jest wartościowy materiał mindsetowy.

### Co warto uzupełnić

#### 1. Naprawić numerację sekcji

Po sekcji 4 pojawia się sekcja 6. Brakuje sekcji 5 albo numeracja powinna być poprawiona.

#### 2. Dodać wzór dobrego ticketu

Skoro notatka mówi "bez ticketu nie ma zadania", warto pokazać template:

```markdown
## Ticket Template
- Problem:
- Użytkownik / persona:
- Oczekiwane zachowanie:
- Poza zakresem:
- Kryteria akceptacji:
- Ryzyka:
- Dane testowe:
- Wymagane logi/metryki:
- Linki do ADR/specyfikacji:
```

#### 3. Dodać "debugging ladder"

Obecna strategia debugowania jest dobra, ale można ją uporządkować:

```markdown
## Debugging Ladder
1. Reproduce: odtwórz błąd lokalnie.
2. Observe: zbierz logi, stack trace, dane wejściowe.
3. Hypothesize: zapisz hipotezy w `debug.md`.
4. Prove/Disprove: test lub eksperyment dla każdej hipotezy.
5. Fix root cause: napraw przyczynę, nie objaw.
6. Regression test: dodaj test blokujący powrót błędu.
7. Postmortem note: zapisz lekcję, jeśli błąd był istotny.
```

#### 4. Złagodzić `git reset` jako poradę

W notatce pojawia się twardy reset. Trzeba dopisać ostrzeżenie:

```markdown
Przed `git reset --hard` zawsze wykonaj:
- `git status`
- `git diff`
- opcjonalnie `git stash push -u -m "before reset"`

Nigdy nie resetuj zmian, których nie rozumiesz albo które mogą należeć do innej osoby.
```

#### 5. Dodać incident/postmortem mindset

Dla Senior Enterprise debugowanie istotnych błędów kończy się nie tylko fixem, ale lekcją:

- co było przyczyną,
- dlaczego testy tego nie złapały,
- jaki alert powinien powstać,
- jaka dokumentacja wymaga aktualizacji,
- czy potrzebny jest ADR albo zmiana procesu.

#### 6. Rozwinąć temat prywatności i darmowych modeli

Notatka słusznie ostrzega przed darmowymi modelami. Warto dopisać checklistę:

- czy kod jest firmowy,
- czy prompt zawiera sekrety,
- czy prompt zawiera dane klientów,
- czy polityka firmy pozwala używać danego modelu,
- czy logi są przechowywane przez dostawcę,
- czy model może trenować na danych.

#### 7. Dodać zasady utrzymania umiejętności

Skoro notatka ostrzega przed atrofią, warto dać praktykę:

- czytaj każdy diff,
- przepisuj ręcznie krytyczne fragmenty,
- proś agenta o quiz z kodu,
- wyjaśnij zmianę własnymi słowami przed commitem,
- raz na jakiś czas zaimplementuj mały task bez agenta.

## Uzupełnienia przekrojowe dla wszystkich pięciu plików

### 1. Wszystkie mają przeterminowaną datę powtórki

Każdy analizowany plik ma:

```yaml
next_review_date: '2026-06-30'
```

Dzisiaj jest 2026-05-28, więc wszystkie są po terminie. Jeśli to nie jest celowe, warto zaktualizować daty.

### 2. Dodać wspólną zasadę "Evidence over assertion"

W każdej notatce warto powtarzać jedną regułę:

> Agent nie skończył pracy, dopóki nie dostarczył dowodu: testu, logu, raportu, diffu albo artefaktu CI.

### 3. Dodać wspólną sekwencję Senior Enterprise

Proponowana sekwencja dla całego kursu/notatek:

```text
Ticket / Product Brief
→ Discovery
→ Requirements
→ Domain Model
→ Architecture
→ ADR
→ Plan
→ TDD Implementation
→ Code Review
→ CI Quality Gate
→ Security/Performance Review
→ Release Readiness
→ Deploy
→ Observability/Postmortem
```

To jest brakujący "kręgosłup" łączący wszystkie pliki.

### 4. Dodać listę artefaktów projektu seniorowego

W notatkach warto umieścić jedną wspólną listę:

```text
docs/
├── product_brief.md
├── requirements.md
├── domain_model.md
├── architecture.md
├── api_contract.md
├── risk_register.md
├── threat_model.md
├── runbook.md
├── release_plan.md
├── postmortem.md
└── adr/
```

### 5. Dodać standard "HITL gates"

Seniorowy workflow powinien mieć jawne punkty zatrzymania:

- po discovery,
- po architekturze,
- po ADR,
- po planie,
- po każdej fazie implementacji,
- po review,
- przed merge,
- przed deploy.

Agent nie powinien sam decydować o przechodzeniu przez te bramki.

## Priorytety uzupełnień

Najpierw uzupełniłbym:

1. `vibe-coding-plan-md.md` - o fazy Discovery, Architecture, Risk, Verification Matrix.
2. `vibe-coding-agents-md.md` - o bramkę "nie koduj przed discovery", ADR, dane/sekrety, enterprise non-negotiables.
3. `vibe-coding-skills.md` - o taksonomię skilli seniorowych i lifecycle skilla.
4. `vibe-coding-code-review.md` - o severity matrix, evidence standard, false positive triage i rozdział PR review vs audyt repo.
5. `vibe-coding-mindset-workflow.md` - o ticket template, debugging ladder, postmortem i ostrzeżenie przy `git reset --hard`.

## Najkrótsza rekomendacja

Nie trzeba przepisywać tych notatek od zera. Trzeba dodać do nich warstwę Senior Enterprise:

- `agents.md` pilnuje zasad,
- `plan.md` wymusza kolejność,
- `skills` dostarczają powtarzalne procedury,
- `docs/` trzymają wiedzę projektową,
- CI/CD i testy dostarczają dowodów,
- człowiek przechodzi przez jawne bramki HITL.

Po tych uzupełnieniach zestaw notatek będzie dużo bliżej realnej pracy senior developera budującego aplikacje z Superpowers, a nie tylko sprawnego promptowania agenta.
