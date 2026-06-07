---
name: product-discovery
description: >
  Prowadzi proces odkrywania (discovery) dla nowej aplikacji w Pythonie przed rozpoczęciem pisania kodu:
  cel biznesowy, użytkownicy, zakres MVP, elementy poza zakresem (out-of-scope), kryteria sukcesu i otwarte pytania.
  Uruchamia się, gdy użytkownik mówi "design MVP", "start a new project", "product discovery".
version: 1.0.0
---

# Product Discovery (Odkrywanie Produktu)

## Cel

Przekształcenie ogólnego pomysłu w przejrzysty dokument koncepcyjny produktu (product brief), który posłuży do zaprojektowania architektury i zaplanowania prac.

## Kiedy używać

- Uruchamianie nowego projektu.
- Wymagania są niejasne lub ogólne.
- Agent odczuwa pokusę rozpoczęcia pisania kodu przed fazą analizy.

## Kiedy NIE używać

- Plik `docs/product_brief.md` został już zaakceptowany i nie ulega zmianie.

## Dane wejściowe

- Pomysł biznesowy użytkownika.
- Istniejące notatki lub zgłoszenia (tickets).

## Procedura

1. **Weryfikacja Technologii:** Zapytaj użytkownika, jaki stos technologiczny planuje zastosować.
   - Jeśli stos obejmuje frameworki lub koncepcje, których nie znasz perfekcyjnie, ZATRZYMAJ SIĘ i poinstruuj użytkownika: *"Uruchom najpierw `/deep research [nazwa technologii]`, abym mógł zebrać najnowszy kontekst przed zaprojektowaniem architektury."*
   - Przejdź dalej tylko wtedy, gdy posiadasz pełen kontekst.
2. Zidentyfikuj problem biznesowy.
3. Zidentyfikuj użytkowników / grupy docelowe.
4. Zdefiniuj zakres MVP (Minimum Viable Product).
5. Zdefiniuj elementy poza zakresem (out-of-scope).
6. Zdefiniuj kryteria sukcesu.
7. Wypisz otwarte pytania.
8. Zapisz wynik w pliku `docs/product_brief.md`.
9. Zatrzymaj się i poproś o akceptację użytkownika (HITL approval).

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się wyłącznie do aktualizacji plików `docs/product_brief.md` i `plan.md`. Kategorycznie ZABRANIA się pisania jakiegokolwiek kodu w Pythonie lub tworzenia szkieletu projektu (scaffolding) podczas tej fazy discovery.

## Wynik (Output)

- Plik `docs/product_brief.md`.
- Otwarte pytania w pliku `plan.md`.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Dokument koncepcyjny produktu (product brief) został w pełni spisany wraz z określonym zakresem MVP.
- [ ] Uruchomiono polecenie `cat docs/product_brief.md`, aby udowodnić poprawne formatowanie pliku.
- [ ] Jawnie poproszono o akceptację użytkownika (HITL) przed rozpoczęciem jakiejkolwiek implementacji.
- [ ] Wyraźnie wypisano podsumowanie: "Product Discovery complete. Waiting for HITL approval to proceed to coding."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Napiszę chociaż szkielet kodu, żeby zaoszczędzić czas." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Faza discovery musi zostać zaakceptowana przed kodowaniem. |
| "Nie muszę definiować elementów poza zakresem (out-of-scope)." | **ODRZUCONO.** Wyraźne określenie tego, czego NIE budujemy, jest kluczowe dla powodzenia MVP. |
| "Nie będę pisać do pliku, czat w zupełności wystarczy." | **ODRZUCONO.** Musisz wygenerować formalny plik `docs/product_brief.md`. |
