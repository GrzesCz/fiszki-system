# Szablon Planu: {{NAZWA_PROJEKTU}}

To jest szablon. Nie jest wykonywalny, dopoki kazdy znacznik `{{...}}` nie zostanie zastapiony konkretna informacja projektowa.

Regula agenta: jesli jakikolwiek znacznik `{{...}}` nadal istnieje, nie wykonuj zadan implementacyjnych. Popros uzytkownika o uzupelnienie albo zatwierdzenie brakujacych informacji.

## Cel

{{JEDNOZDANIOWY_CEL_BIZNESOWY_I_TECHNICZNY}}

## Aktualny kontekst

- Typ projektu: {{TYP_PROJEKTU}}
- Wlasciciel biznesowy: {{WLASCICIEL_LUB_OSOBA_DECYZYJNA}}
- Runtime: Python {{WERSJA_PYTHONA}}
- Package manager: {{PACKAGE_MANAGER}}
- Framework Web/API: {{FRAMEWORK}}
- Baza danych: {{BAZA_DANYCH_LUB_BRAK}}
- Cache/kolejka: {{CACHE_KOLEJKA_LUB_BRAK}}
- Cel wdrozenia: {{CEL_WDROZENIA}}
- Znane ograniczenia: {{OGRANICZENIA}}
- Aktualny branch: {{NAZWA_BRANCHA}}
- Commit/tag bazowy: {{BAZOWY_REF}}

## Komendy startowe

Zaktualizuj po bootstrapie:

```bash
uv sync
uv run ruff format --check src tests
uv run ruff check src tests
uv run mypy src --strict
uv run pytest
uv run uvicorn app.main:app --reload
```

## Reguly wykonania

1. Przeczytaj `agent.md` przed praca.
2. Przeczytaj aktualna sekcje `plan.md`.
3. Laduj szczegolowe reguly z `docs/agent/` tylko wtedy, gdy sa potrzebne.
4. Wykonuj jeden checkbox naraz.
5. Po zakonczeniu checkboxa zmien `[ ]` na `[x]`.
6. Nie wchodz do nastepnej fazy, dopoki Definition of Done obecnej fazy nie jest spelnione.
7. Zatrzymaj sie na kazdym znaczniku `STOP` i czekaj na akceptacje HITL.
8. Jesli plan jest bledny, zatrzymaj sie i zaproponuj aktualizacje planu przed edycja kodu.
9. Nie kompaktuj automatycznie kontekstu w srodku zadania.

## Procedura zakonczenia fazy

Na koncu kazdej fazy:

1. Zaktualizuj wykonane checkboxy.
2. Zaktualizuj `Dziennik statusu`.
3. Zapisz nowe decyzje w `docs/` albo ADR.
4. Uruchom adekwatna weryfikacje z `Macierz weryfikacji`.
5. Zaraportuj zmienione pliki i dowody.
6. Popros uzytkownika o review i commit.
7. Zasugeruj `/clear` albo nowa sesje, jesli kontekst jest duzy.
8. Czekaj na akceptacje uzytkownika przed kolejna faza.

## Artefakty projektu

| Artefakt | Cel | Status |
|---|---|---|
| `docs/product_brief.md` | problem biznesowy, uzytkownicy, zakres MVP | [ ] |
| `docs/requirements.md` | wymagania funkcjonalne i niefunkcjonalne | [ ] |
| `docs/domain_model.md` | pojecia domenowe, encje i reguly | [ ] |
| `docs/architecture.md` | granice systemu i komponenty | [ ] |
| `docs/api_contract.md` | wersjonowanie API, schematy i bledy | [ ] |
| `docs/risk_register.md` | ryzyka, impact, likelihood i mitigacje | [ ] |
| `docs/threat_model.md` | model security dla ryzykownych funkcji | [ ] |
| `docs/operations.md` | observability, alerty i SLO | [ ] |
| `docs/runbook.md` | procedury operacyjne | [ ] |
| `docs/release_plan.md` | deploy, smoke tests i rollback | [ ] |
| `docs/review.md` | ustalenia PR/code review | [ ] |
| `docs/audit_report.md` | ustalenia audytu repozytorium/security | [ ] |
| `docs/postmortem.md` | wnioski po incydencie/debuggingu | [ ] |

## Bramki HITL

- [ ] Bramka 1: Discovery zaakceptowane.
- [ ] Bramka 2: Architektura i ADR zaakceptowane.
- [ ] Bramka 3: Plan implementacji zaakceptowany.
- [ ] Bramka 4: Bootstrap i quality gate zaakceptowane.
- [ ] Bramka 5: Krytyczne sciezki przetestowane.
- [ ] Bramka 6: Security i observability zaakceptowane.
- [ ] Bramka 7: Gotowosc do release zaakceptowana.
- [ ] Bramka 8: Finalny diff przeczytany przez uzytkownika.

---

## Faza -2: Product Discovery

- [ ] 0.1 DISCOVERY: Uzupelnij `docs/product_brief.md`.
  - Plik: `docs/product_brief.md`
  - Akcja: opisz problem biznesowy, uzytkownikow, zakres MVP, out-of-scope i kryteria sukcesu.
  - DoD: w pliku nie ma znacznikow `{{...}}`.

- [ ] 0.2 DISCOVERY: Uzupelnij `docs/requirements.md`.
  - Plik: `docs/requirements.md`
  - Akcja: rozdziel wymagania na funkcjonalne, niefunkcjonalne, security, compliance i operacyjne.
  - DoD: kazde wymaganie jest testowalne albo jawnie oznaczone jako otwarte.

- [ ] 0.3 RISK: Uzupelnij `docs/risk_register.md`.
  - Plik: `docs/risk_register.md`
  - Akcja: wypisz ryzyka biznesowe, techniczne, security i operacyjne.
  - DoD: kazde ryzyko ma impact, likelihood, mitigacje i decyzje.

- [ ] 0.4 DOCS: Zaktualizuj `Dziennik statusu`.
  - Plik: `plan.md`
  - Akcja: zapisz decyzje z discovery.
  - DoD: Dziennik statusu ma wpis z data.

**STOP: Czekaj na akceptacje uzytkownika przed Faza -1.**

## Faza -1: Architektura, domena i ADR

- [ ] 1.1 ARCH: Uzupelnij `docs/domain_model.md`.
  - Plik: `docs/domain_model.md`
  - Akcja: zdefiniuj pojecia, encje, value objects, agregaty, reguly biznesowe i przypadki brzegowe.
  - DoD: model pokrywa zaakceptowane wymagania.

- [ ] 1.2 ARCH: Uzupelnij `docs/architecture.md`.
  - Plik: `docs/architecture.md`
  - Akcja: zdefiniuj granice systemu, warstwy, zaleznosci i integracje.
  - DoD: dokument mowi, gdzie zyja domena, API, infrastruktura i observability.

- [ ] 1.3 ARCH: Uzupelnij `docs/api_contract.md`.
  - Plik: `docs/api_contract.md`
  - Akcja: zdefiniuj wersjonowanie API, request/response schemas, format bledow i polityke breaking changes.
  - DoD: kontrakt jest wystarczajaco konkretny, aby napisac contract tests.

- [ ] 1.4 ADR: Utworz ADR dla frameworka.
  - Plik: `docs/adr/0001-framework.md`
  - Akcja: zapisz decyzje o frameworku, alternatywy i konsekwencje.
  - DoD: ADR jest zgodny z `docs/adr/0000-template.md`.

- [ ] 1.5 ADR: Utworz ADR dla danych/storage.
  - Plik: `docs/adr/0002-data-storage.md`
  - Akcja: zapisz source-of-truth, baze danych, cache i strategie migracji.
  - DoD: ADR zawiera rollback i konsekwencje operacyjne.

- [ ] 1.6 ADR: Utworz ADR dla auth/security, jesli auth jest w zakresie.
  - Plik: `docs/adr/0003-auth-security.md`
  - Akcja: zapisz decyzje auth/session/token/rate-limit.
  - DoD: ADR zawiera rozwazane alternatywy i ryzyka.

- [ ] 1.7 DOCS: Zaktualizuj `Dziennik statusu`.
  - Plik: `plan.md`
  - Akcja: podlinkuj ADR i zaakceptowane decyzje architektoniczne.
  - DoD: Dziennik statusu ma wpis architektoniczny z data.

**STOP: Czekaj na akceptacje uzytkownika przed Faza 0.**

## Faza 0: Bootstrap

- [ ] 2.1 SETUP: Zweryfikuj bazowy stan repozytorium.
  - Plik: `plan.md`
  - Akcja: uruchom `git status --short` i zapisz baseline ref w Aktualnym kontekcie.
  - DoD: uzytkownik potwierdza commit bazowy albo akceptuje aktualny stan.

- [ ] 2.2 SETUP: Utworz konfiguracje projektu Python.
  - Plik: `pyproject.toml`
  - Akcja: skonfiguruj package metadata, ruff, pytest i mypy.
  - DoD: `uv sync` konczy sie sukcesem.

- [ ] 2.3 SETUP: Dodaj lockfile.
  - Plik: `uv.lock`
  - Akcja: wygeneruj lockfile przez `uv`.
  - DoD: `uv.lock` istnieje i jest przeznaczony do git.

- [ ] 2.4 SETUP: Dodaj przyklad srodowiska.
  - Plik: `.env.example`
  - Akcja: udokumentuj wymagane zmienne srodowiskowe bez prawdziwych sekretow.
  - DoD: nie ma prawdziwych sekretow.

- [ ] 2.5 SETUP: Dodaj pierwszy smoke test.
  - Plik: `tests/unit/test_smoke.py`
  - Akcja: dodaj minimalny test potwierdzajacy, ze test runner dziala.
  - DoD: `uv run pytest tests/unit/test_smoke.py -q` przechodzi.

- [ ] 2.6 SETUP: Dodaj entrypoint aplikacji.
  - Plik: `src/app/main.py`
  - Akcja: utworz minimalny entrypoint aplikacji.
  - DoD: aplikacja importuje sie bez bledu.

- [ ] 2.7 SETUP: Dodaj lokalny container setup, jesli potrzebny.
  - Plik: `docker-compose.yml`
  - Akcja: zdefiniuj lokalne serwisy, takie jak baza danych/cache.
  - DoD: serwisy startuja lokalnie albo sa jawnie odlozone.

- [ ] 2.8 CI: Dodaj quality pipeline.
  - Plik: `.github/workflows/ci.yml`
  - Akcja: uruchamiaj format check, lint, type-check, testy i security scan.
  - DoD: pipeline jest skladniowo poprawny albo udokumentowany jako odlozony.

**STOP: Czekaj na akceptacje uzytkownika przed Faza 1.**

## Faza 1: Domena i kontrakt API

- [ ] 3.1 TEST-RED: Dodaj pierwszy test modelu domenowego.
  - Plik: `tests/unit/test_domain_model.py`
  - Akcja: przetestuj jedna zaakceptowana regule biznesowa z `docs/domain_model.md`.
  - DoD: test pada z oczekiwanego powodu.

- [ ] 3.2 IMPL-GREEN: Zaimplementuj pierwszy model domenowy.
  - Plik: `src/app/domain/model.py`
  - Akcja: zaimplementuj tylko tyle kodu, ile potrzeba, aby przejsc 3.1.
  - DoD: test z 3.1 przechodzi.

- [ ] 3.3 TEST-RED: Dodaj pierwszy test kontraktu API.
  - Plik: `tests/contract/test_api_contract.py`
  - Akcja: przetestuj request/response contract z `docs/api_contract.md`.
  - DoD: test pada z oczekiwanego powodu.

- [ ] 3.4 IMPL-GREEN: Zaimplementuj API schema albo route skeleton.
  - Plik: `src/app/api/routes.py`
  - Akcja: zaimplementuj tyle, aby spelnic contract test.
  - DoD: contract test z 3.3 przechodzi.

**STOP: Czekaj na akceptacje uzytkownika przed Faza 2.**

## Faza 2: Implementacja funkcji

- [ ] 4.1 TEST-RED: Dodaj pierwszy test use case.
  - Plik: `tests/unit/test_use_case.py`
  - Akcja: przetestuj pierwszy zaakceptowany use case.
  - DoD: test pada z oczekiwanego powodu.

- [ ] 4.2 IMPL-GREEN: Zaimplementuj pierwszy use case.
  - Plik: `src/app/application/use_cases.py`
  - Akcja: zaimplementuj tylko tyle kodu, ile potrzeba, aby przejsc 4.1.
  - DoD: test z 4.1 przechodzi.

- [ ] 4.3 REFACTOR: Refaktoryzuj bez zmiany zachowania.
  - Plik: pliki dotkniete w 4.2
  - Akcja: popraw nazwy/strukture tylko wtedy, gdy jest to potrzebne.
  - DoD: wszystkie testy, ktore przechodzily wczesniej, nadal przechodza.

- [ ] 4.4 DOCS: Zaktualizuj stan planu.
  - Plik: `plan.md`
  - Akcja: oznacz wykonana prace i zapisz decyzje.
  - DoD: Dziennik statusu zaktualizowany.

**STOP: Czekaj na akceptacje uzytkownika przed Faza 3.**

## Faza 3: Security i observability

- [ ] 5.1 SECURITY: Uruchom skill threat modeling dla publicznych endpointow.
  - Plik: `docs/threat_model.md`
  - Akcja: zidentyfikuj assets, actors, entrypoints, trust boundaries, STRIDE risks i mitigacje.
  - DoD: ryzyka sa polaczone z testami albo zaakceptowanymi decyzjami.

- [ ] 5.2 TEST-RED: Dodaj security test dla najwiekszego ryzyka.
  - Plik: `tests/security/test_security_controls.py`
  - Akcja: przetestuj jedna mitigacje ryzyka High/Critical.
  - DoD: test pada z oczekiwanego powodu albo potwierdza istniejaca ochrone.

- [ ] 5.3 IMPL-GREEN: Zaimplementuj mitigacje security.
  - Plik: adekwatny plik produkcyjny z 5.2
  - Akcja: zaimplementuj tylko zaakceptowana mitigacje.
  - DoD: security test przechodzi.

- [ ] 5.4 OBSERVABILITY: Dodaj structured logging albo request ID.
  - Plik: `src/app/observability/`
  - Akcja: dodaj minimalna observability dla krytycznej sciezki.
  - DoD: test albo log output potwierdza zachowanie observability.

- [ ] 5.5 DOCS: Zaktualizuj dokumentacje operacyjna.
  - Plik: `docs/operations.md`
  - Akcja: zapisz decyzje dotyczace logs, metrics, alerts albo SLO.
  - DoD: dokument operacyjny odzwierciedla aktualne zachowanie.

**STOP: Czekaj na akceptacje uzytkownika przed Faza 4.**

## Faza 4: Dane, integracje i performance

- [ ] 6.1 TEST-RED: Dodaj integration test dla database/cache/external adapter.
  - Plik: `tests/integration/test_integration.py`
  - Akcja: przetestuj jedno zachowanie realnego adaptera bez produkcyjnych sekretow.
  - DoD: test pada z oczekiwanego powodu albo potwierdza istniejace zachowanie.

- [ ] 6.2 IMPL-GREEN: Zaimplementuj adapter.
  - Plik: `src/app/infrastructure/`
  - Akcja: zaimplementuj adapter z timeout/error handling.
  - DoD: integration test przechodzi.

- [ ] 6.3 DATA: Dodaj migracje, jesli schemat sie zmienil.
  - Plik: `migrations/`
  - Akcja: utworz migracje i migration test.
  - DoD: migration test przechodzi albo migracja jest udokumentowana jako niepotrzebna.

- [ ] 6.4 PERF: Uruchom performance smoke dla krytycznej sciezki.
  - Plik: `docs/performance.md`
  - Akcja: zapisz P95/P99 albo odnotuj, ze nie ma jeszcze wymagania performance.
  - DoD: wynik performance albo jawne odlozenie jest udokumentowane.

**STOP: Czekaj na akceptacje uzytkownika przed Faza 5.**

## Faza 5: Review i gotowosc do release

- [ ] 7.1 REVIEW: Uruchom read-only code review.
  - Plik: `docs/review.md`
  - Akcja: zrecenzuj diff i pobliski dotkniety kod bez edycji kodu produkcyjnego.
  - DoD: findings maja severity, file/line, evidence i status.

- [ ] 7.2 REVIEW: Napraw zaakceptowane findingi Critical/High.
  - Plik: `plan.md`
  - Akcja: utworz osobne zadania naprawcze dla zaakceptowanych findingow.
  - DoD: kazdy zaakceptowany problem ma test albo jawna decyzje.

- [ ] 7.3 RELEASE: Uzupelnij `docs/runbook.md`.
  - Plik: `docs/runbook.md`
  - Akcja: udokumentuj glowne tryby awarii i kroki reakcji.
  - DoD: runbook jest uzyteczny dla aktualnego systemu.

- [ ] 7.4 RELEASE: Uzupelnij `docs/release_plan.md`.
  - Plik: `docs/release_plan.md`
  - Akcja: zdefiniuj deploy, smoke tests, rollback i monitoring po deployu.
  - DoD: release plan mowi `ready` albo `not ready`.

- [ ] 7.5 FINAL: Finalne review czlowieka.
  - Plik: final diff
  - Akcja: uzytkownik czyta finalny diff i akceptuje pozostale ryzyka.
  - DoD: akceptacja HITL zapisana w Dzienniku statusu.

**STOP: Koniec szablonu planu.**

## Macierz weryfikacji

| Obszar | Komenda / dowod | Wymagany wynik |
|---|---|---|
| Format | `uv run ruff format --check src tests` | 0 bledow |
| Lint | `uv run ruff check src tests` | 0 bledow |
| Typy | `uv run mypy src --strict` | 0 bledow albo zaakceptowany baseline |
| Unit tests | `uv run pytest tests/unit -q` | green |
| Integration tests | `uv run pytest tests/integration -q` | green albo jawnie odlozone |
| Contract tests | `uv run pytest tests/contract -q` | green albo jawnie odlozone |
| E2E tests | `uv run pytest tests/e2e -q` | green albo jawnie odlozone |
| Security tests | `uv run pytest tests/security -q` | green albo jawnie odlozone |
| Security scan | `uv run bandit -r src` | brak High/Critical, chyba ze zaakceptowane |
| Build | CI pipeline | green |

## Dziennik statusu

- {{DATA}}: {{DECYZJA_LUB_POSTEP}} ({{LINK_DO_ADR_LUB_DOKUMENTU}})

## Otwarte pytania

- [ ] {{PYTANIE}}

## Dziennik ryzyk

| Ryzyko | Impact | Likelihood | Mitigacja | Decyzja |
|---|---|---|---|---|
| {{RYZYKO}} | {{L_M_H}} | {{L_M_H}} | {{MITIGACJA}} | {{accept_fix_monitor}} |
