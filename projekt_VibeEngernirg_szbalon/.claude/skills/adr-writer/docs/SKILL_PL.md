---
name: adr-writer
description: >
  Tworzy lub ocenia rekordy decyzji architektonicznych (ADR) dla projektów w Pythonie.
  Uruchamia się, gdy użytkownik mówi "napisz ADR", "udokumentuj decyzję architektoniczną",
  "wybierz framework" lub "oceń opcje techniczne".
version: 1.0.0
---

# ADR Writer (Redaktor ADR)

## Cel

Tworzenie przejrzystych rekordów decyzji architektonicznych (ADR) zawierających kontekst, alternatywy i konsekwencje.

## Kiedy używać

- Wybór techniczny wpływa na architekturę lub długoterminowe utrzymanie projektu.
- Wybierana jest zależność, baza danych, strategia uwierzytelniania lub model wdrożenia.
- Zmienia się istniejąca decyzja architektoniczna.

## Kiedy NIE używać

- Zadanie dotyczy drobnego, lokalnego szczegółu implementacyjnego.
- Decyzja została już podjęta i opisana w zaakceptowanym ADR i nie ulega zmianie.

## Dane wejściowe

- Aktualne zadanie z `plan.md`.
- Istotne wymagania z `docs/requirements.md`.
- Kontekst architektoniczny z `docs/architecture.md`.
- Istniejące rekordy ADR w `docs/adr/`.

## Procedura

1. Zidentyfikuj decyzję do podjęcia.
2. Zapoznaj się z odpowiednimi wymaganiami i istniejącymi ADR-ami.
3. Opisz kontekst i ograniczenia.
4. Przedstaw co najmniej dwie alternatywy.
5. Wyjaśnij, dlaczego wybrana opcja wygrywa. Wybrana opcja MUSI być najprostszą, która w pełni spełnia wymaganie. Każda dodatkowa złożoność, którą wprowadza (dodatkowa warstwa, zależność, wzorzec lub usługa), musi być wyraźnie uzasadniona w kroku 6 – sformułowanie "może się przydać później" nie jest uzasadnieniem (YAGNI). ADR to najtańsze miejsce na zatrzymanie nadmiarowej inżynierii (over-engineeringu) przed powstaniem jakiegokolwiek kodu.
6. Odnotuj pozytywne i negatywne konsekwencje (w tym koszt każdej dodanej abstrakcji).
7. Zdefiniuj kryteria wycofania (rollback) lub rewizji decyzji.
8. Zapisz ADR jako `docs/adr/NNNN-short-title.md`.
9. Dodaj wpis z datą do rejestru statusu w `plan.md` (Status Log).

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się wyłącznie do tworzenia dokumentacji w katalogu `docs/adr/` oraz aktualizacji pliku `plan.md`. Kategorycznie ZABRANIA się modyfikowania kodu źródłowego w Pythonie oraz samodzielnego implementowania decyzji architektonicznej podczas wykonywania tego zadania.

## Wynik (Output)

- Nowy lub zaktualizowany rekord ADR.
- Wpis w rejestrze statusu w `plan.md`.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Nowy lub zaktualizowany ADR został zapisany w formacie `docs/adr/NNNN-short-title.md`.
- [ ] Uruchomiono polecenie terminalowe `cat <adr_file_path>`, aby udowodnić, że plik powstał i zawiera wymaganą strukturę.
- [ ] Polecenie terminalowe `grep -n "{{" <adr_file_path>` potwierdza brak nierozstrzygniętych znaczników typu `{{...}}` (musi zwrócić 0 wyników).
- [ ] Wyraźnie wypisano podsumowanie: "ADR Writer complete. Generated ADR `<name>`, 0 unresolved markers remaining."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Po prostu opiszę tę decyzję tutaj na czacie zamiast tworzyć plik." | **ODRZUCONO.** Musisz utworzyć formalny plik markdown z ADR w `docs/adr/`. |
| "Nie muszę uruchamiać grep, żeby sprawdzić znaczniki. Wiem, że uzupełniłem wszystkie." | **ODRZUCONO.** Musisz uruchomić `grep` i wkleić wynik z terminala jako dowód. |
| "Skoro zdecydowałem o bazie danych, to od razu zaktualizuję kod schematu bazy." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! ADR Writer służy wyłącznie do dokumentowania decyzji, a NIE do ich implementacji. |
