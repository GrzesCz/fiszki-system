---
name: frontend-blueprint-generator
description: >
  Zasypuje przepaść między architekturą backendu a zewnętrznymi wizualnymi narzędziami AI, takimi jak Claude Design lub v0.dev. Analizuje aktualny stan projektu (API, Product Brief) i generuje wszechstronny "Mega-Prompt" dla użytkownika do wklejenia w zewnętrznych generatorach UI. Uruchamia się, gdy użytkownik mówi "zaprojektuj frontend", "stwórz design system", "generate frontend prompt".
version: 1.0.0
---

# Frontend Blueprint Generator (Generator Planu Frontendu)

## Cel

Stworzenie bezbłędnego, bardzo szczegółowego promptu dla zewnętrznych wizualnych narzędzi AI (Claude Design, v0.dev), aby mogły one wygenerować dokładnie takie komponenty HTML/CSS/Tailwind, jakich wymaga backend i logika biznesowa aplikacji.

## Kiedy używać

- Architektura backendu lub Product Brief jest gotowy.
- Musisz wygenerować warstwę wizualną, ale chcesz zapobiec halucynowaniu klas CSS przez agenta kodującego.
- Przejście z fazy projektowania logiki do projektowania interfejsu użytkownika (UI).

## Kiedy NIE używać

- Design System został już utworzony i znajduje się w katalogu `docs/design_system/`.
- Użytkownik prosi o bezpośrednie wdrożenie kodu frontendowego (użyj do tego `ui-fidelity-enforcer`).

## Procedura

1. **Przeanalizuj wymagania:** Przeczytaj plik `docs/product_brief.md`, modele danych (np. schematy Pydantic) oraz definicje punktów końcowych API (endpoints).
2. **Odwzoruj komponenty UI:** Zidentyfikuj wszystkie niezbędne elementy wizualne:
   - Układy (nawigacja, panele boczne, stopki).
   - Strony (pulpity nawigacyjne, widoki szczegółów, formularze).
   - Komponenty atomowe (przyciski, pola wprowadzania danych, karty, tabele).
   - Stany (wskaźniki ładowania, komunikaty o błędach, stany pustej bazy danych/listy).
3. **Wygeneruj Mega-Prompt:** Utwórz plik o nazwie `docs/design_system_prompt.txt`. Napisz prompt skierowany do Claude Design / v0, który zawiera:
   - Ogólny motyw i styl aplikacji (np. "modern, glassmorphism, dark mode default").
   - Dokładną listę potrzebnych komponentów na podstawie analizy.
   - Dokładne struktury danych, które komponenty muszą obsługiwać (np. "tabela użytkowników musi zawierać kolumny ID, E-mail i Status").
   - Kategoryczną instrukcję, aby wygenerować czysty kod HTML/Tailwind (lub inny wymagany przez Twój stos technologiczny).
4. **Przekazanie zadań:** Zatrzymaj wykonywanie i poinstruuj użytkownika, aby skopiował wygenerowany prompt.

## Wynik (Output)

- Plik `docs/design_system_prompt.txt`

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Przeanalizowano struktury danych backendu, aby komponenty UI odpowiadały rzeczywistym danym.
- [ ] Plik `docs/design_system_prompt.txt` został utworzony i odpowiednio sformatowany.
- [ ] Jawnie poinformowano użytkownika: "Blueprint ready. Copy the contents of `docs/design_system_prompt.txt`, paste it into Claude Design / v0, save the result to `docs/design_system/`, and then run `ui-fidelity-enforcer`."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Sam teraz napiszę kod HTML." | **ODRZUCONO.** Musisz wygenerować prompt dla zewnętrznego narzędzia, a nie samodzielnie pisać kod UI. |
| "Nie muszę sprawdzać schematów API, wiem jak wygląda formularz logowania." | **ODRZUCONO.** Musisz upewnić się, że UI obsługuje dokładnie te pola, których oczekuje backend. |
