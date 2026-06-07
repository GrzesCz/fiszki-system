---
name: incident-debugging
description: >
  Prowadzi przez systematyczne debugowanie problemów w Pythonie: reprodukcja, obserwacja,
  stawianie hipotez, dowodzenie/obalanie hipotez, usunięcie przyczyny źródłowej, testy regresyjne i postmortem.
  Uruchamia się, gdy użytkownik mówi "debug this error", "fix the failing test", "investigate production incident".
version: 1.0.0
---

# Incident Debugging (Rozwiązywanie Incydentów i Debugowanie)

## Cel

Usunięcie przyczyny źródłowej (root cause) bez zgadywania oraz zapobieganie ponownemu wystąpieniu problemu.

## Kiedy używać

- Testy nie przechodzą (failing tests).
- Występuje błąd wykonania (runtime error).
- Wymagana jest analiza incydentu zbliżonego do produkcyjnego.
- Agent zgaduje poprawki lub powtarza nieudane próby naprawy.

## Kiedy NIE używać

- Problem został już odtworzony, ustalono jego przyczynę źródłową i istnieje zatwierdzony plan poprawki.

## Dane wejściowe

- Stack trace (ślad stosu) lub logi.
- Kroki do odtworzenia błędu (reproduction steps).
- Aktualny kod i testy.

## Procedura

1. Odtwórz błąd (reproduce).
2. Przeanalizuj logi/trace/dane wejściowe.
3. Zapisz hipotezy w pliku `docs/debug.md`.
4. Udowodnij lub obal każdą z postawionych hipotez.
5. Napraw przyczynę źródłową.
6. Dodaj test regresyjny. Zaprojektuj go zgodnie z wytycznymi `test-design-enforcer`: test MUSI odtwarzać błąd (wykazywać błąd na starym kodzie) i przechodzić pomyślnie na kodzie poprawionym — udowodnij obie sytuacje. Test regresyjny, który przechodzi bez wprowadzenia poprawki, przed niczym nie chroni.
7. Zaktualizuj plik `docs/postmortem.md`, jeśli incydent był znaczący.

## Dyscyplina zakresu (Scope Discipline)

Masz prawo do czytania kodu, pisania dokumentów debugowania, modyfikowania konkretnego pliku zawierającego błąd oraz dodania testu regresyjnego. Kategorycznie ZABRANIA się zgadywania poprawek i wdrażania ich bez wcześniejszego udowodnienia hipotezy. Nie wolno refaktoryzować kodu niezwiązanego z błędem.

## Wynik (Output)

- `docs/debug.md`.
- Test regresyjny.
- Opcjonalnie plik `docs/postmortem.md`.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Hipotezy oraz przyczyna źródłowa zostały formalnie udokumentowane.
- [ ] Test regresyjny został napisany i uruchomiony.
- [ ] Uruchomiono polecenie `pytest <test_file>` i wklejono wynik potwierdzający, że test przechodzi.
- [ ] Wyraźnie wypisano podsumowanie: "Incident Debugging complete. Bug fixed, regression test PASS."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Jestem pewien, że wiem, na czym polega błąd. Po prostu naprawię to bezpośrednio." | **ODRZUCONO.** Przed wprowadzeniem poprawki musisz zapisać hipotezę i udowodnić ją testem. |
| "Nie mogę tutaj uruchomić testów, po prostu założę, że kod działa." | **ODRZUCONO.** Musisz napisać skrypt lub test i uruchomić go w terminalu, aby udowodnić poprawność poprawki. |
| "Przy okazji naprawiania tego błędu przepiszé tę starą funkcję." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Napraw tylko ten konkretny błąd. |
