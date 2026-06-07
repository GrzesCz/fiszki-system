---
name: ui-fidelity-enforcer
description: >
  Zapewnia ścisłą wierność wizualną poprzez wymuszenie na agencie używania WYŁĄCZNIE komponentów HTML/CSS dostarczonych w systemie projektowania (design system). Zabrania halucynowania stylów CSS/Tailwind. Uruchamia się, gdy użytkownik mówi "zaimplementuj UI z design systemu", "podepnij design", "implement frontend".
version: 1.0.0
---

# UI Fidelity Enforcer (Strażnik Wierności UI)

## Cel

Zapobieganie halucynowaniu stylów UI, kolorów i klas CSS przez AI poprzez rygorystyczne przestrzeganie zewnętrznego systemu projektowania (Design System).

## Kiedy używać

- Wdrażanie komponentów frontendowych (React, Vue, szablony HTML).
- Łączenie logiki biznesowej z warstwą wizualną (UI).

## Kiedy NIE używać

- Pisanie czystej logiki backendowej, baz danych lub interfejsów API.

## Dane wejściowe

- Komponenty systemu projektowania zlokalizowane w folderze `docs/design_system/`.

## Procedura

1. **Zlokalizuj Design System:** Przeczytaj surowe pliki HTML/Tailwind/CSS z katalogu `docs/design_system/`.
2. **Zaimplementuj logikę:** Odwzoruj strukturę frameworka frontendowego (np. stany Reacta, propsy) na dokładne klasy i strukturę kodu dostarczone w design systemie.
3. **Ścisłe przestrzeganie:** Kategorycznie NIE WOLNO Ci wymyślać nowych klas CSS, zmieniać palety kolorów ani modyfikować struktury układu bez wyraźnej zgody.

## Dyscyplina zakresu (Scope Discipline)

Twoim zadaniem jest integracja, a nie projektowanie. Jeśli wymagany stan wizualny (np. stan błędu lub efekt hover) nie jest zdefiniowany w systemie projektowania, MUSISZ przerwać pracę i poprosić użytkownika o dostarczenie brakującego projektu. Nie wymyślaj go samodzielnie.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Komponent frontendowy idealnie odpowiada strukturze dostarczonej w design systemie.
- [ ] Nie wprowadzono żadnych nieautoryzowanych klas CSS ani Tailwind.

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Dodam tutaj klasę `bg-blue-500`, ponieważ wygląda to lepiej." | **ODRZUCONO.** Naruszenie zasady ścisłego przestrzegania! Nie możesz modyfikować palety kolorów. |
| "W systemie projektowania brakuje ikony ładowania (spinnera), więc sam ją stworzę." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Poproś użytkownika o brakujący projekt. |
| "Mogę zoptymalizować tę strukturę HTML, usuwając zbędne divy." | **ODRZUCONO.** Struktura została wygenerowana przez wyspecjalizowane narzędzie UI. Nie modyfikuj jej. |
