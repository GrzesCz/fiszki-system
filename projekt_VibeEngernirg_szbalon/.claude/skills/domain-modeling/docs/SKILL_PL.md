---
name: domain-modeling
description: >
  Tworzy lub ocenia model dziedzinowy dla aplikacji w Pythonie: encje, obiekty wartości (value objects),
  agregaty, reguły biznesowe i przypadki brzegowe.
  Uruchamia się, gdy użytkownik mówi "zaprojektuj model dziedzinowy", "zdefiniuj encje", "zmodeluj reguły biznesowe", "jaka jest dziedzina".
version: 1.0.0
---

# Domain Modeling (Modelowanie Dziedzinowe)

## Cel

Zdefiniowanie pojęć i konceptów dziedzinowych przed rozpoczęciem implementacji.

## Kiedy używać

- Rozpoczynanie fazy projektowania architektury.
- Dodawanie złożonej logiki biznesowej.
- Wymagania wspominają o regułach, stanach, cyklu życia lub niezmiennikach (invariants).

## Kiedy NIE używać

- Zadanie dotyczy wyłącznie infrastruktury i nie ma wpływu na reguły biznesowe.

## Dane wejściowe

- `docs/product_brief.md`
- `docs/requirements.md`
- Istniejący kod dziedzinowy (jeśli istnieje)

## Procedura

1. Wyodrębnij terminy dziedzinowe.
2. Zdefiniuj encje (entities).
3. Zdefiniuj obiekty wartości (value objects).
4. Zdefiniuj agregaty (aggregates).
5. Zdefiniuj niezmienniki (invariants).
6. Zdefiniuj przypadki brzegowe (edge cases).
7. Zapisz nierozstrzygnięte pytania dotyczące dziedziny.
8. Zapisz model w pliku `docs/domain_model.md`.

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się wyłącznie do tworzenia i aktualizacji dokumentacji w formacie markdown (`docs/domain_model.md`). Kategorycznie ZABRANIA się generowania lub modyfikowania klas w Pythonie, modeli Pydantic lub encji SQLAlchemy podczas wykonywania tego zadania.

Modeluj wyłącznie to, czego wymagają rzeczywiste reguły biznesowe (zasada YAGNI na poziomie dziedziny). Nie wprowadzaj encji, obiektów wartości ani agregatów „na przyszłość” — każdy zmodelowany koncept musi mieć bezpośrednie powiązanie z określonym wymaganiem lub niezmiennikiem. Spekulatywna struktura dziedzinowa to najbardziej kosztowna forma nadmiarowego kodu (slop), ponieważ dziedziczy go cały późniejszy kod.

## Wynik (Output)

- Zaktualizowany plik `docs/domain_model.md`.
- Otwarte pytania w pliku `plan.md`.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Formalny model dziedzinowy został zapisany w `docs/domain_model.md`.
- [ ] Uruchomiono polecenie terminalowe `cat docs/domain_model.md`, aby udowodnić utworzenie i poprawną strukturę pliku.
- [ ] Wyraźnie wypisano podsumowanie: "Domain Modeling complete. Output generated in docs/domain_model.md."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Od razu napiszę modele Pydantic, skoro już zdefiniowałem encje." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Modelowanie dziedziny to wyłącznie dokumentacja koncepcyjna. |
| "Wymagania są proste, nie potrzebujemy formalnego modelu." | **ODRZUCONO.** Jeśli ten skill został uruchomiony, użytkownik oczekuje formalnego modelu zapisanego na dysku. |
| "Nie będę zapisywać tego do pliku, po prostu wyjaśnię to na czacie." | **ODRZUCONO.** Musisz wygenerować plik `docs/domain_model.md`. |
