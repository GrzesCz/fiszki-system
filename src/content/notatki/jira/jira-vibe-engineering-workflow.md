---
title: 'Workflow Vibe Engineering i Zapobieganie Trybowi YOLO'
category: 'Narzędzia i Procesy'
status: zrobione
type: notatka
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---

# Workflow Vibe Engineering i Zapobieganie Trybowi YOLO

## 1. Rola Systemu Zgłoszeń jako "Zewnętrznego Hamulca"

Kluczowym założeniem w metodyce Vibe Engineering jest bezwzględny zakaz "kodowania na żywo" za pośrednictwem ogólnych poleceń dla Agenta (tzw. "YOLO Mode" - You Only Live Once). Duże modele językowe w trybie YOLO bez ścisłego określenia zakresu pracy (Scope) generują kod, który szybko wymyka się spod kontroli, prowadząc do nieprzewidywalnych zmian architektonicznych.

Rozwiązaniem jest zastosowanie **Zewnętrznego Hamulca** w postaci ticketów z JIRA lub GitHuba.
- Zgłoszenie z przypisanym numerem (np. `#5`) definiuje zamknięty kontrakt funkcjonalności.
- Agent (np. Claude Code) wyposażony w odpowiednie dyrektywy (plik `agents.md`) ma restrykcyjny zakaz modyfikowania kodu wychodzącego poza obręb bieżącego zgłoszenia ("Touch only what you asked to touch").

## 2. Konstrukcja Idealnego Zgłoszenia pod Agenta

Zgłoszenie dedykowane dla AI różni się od tego pisanego dla człowieka naciskiem na określenie celu:
- **Tytuł (Summary):** Musi być wymierny. (Zamiast *"Zrób logowanie"* $\rightarrow$ *"Stwórz formularz logowania dla użytkownika wraz z weryfikacją w bazie danych"*).
- **Opis (Description):** Stanowi de facto stały "Prompt" w chmurze. Powinien zawierać jednoznaczne Kryteria Akceptacji (Definition of Done - DoD). Złotą zasadą jest wskazywanie celów biznesowych, a nie rozwiązań technicznych (unikamy komend w stylu: *"Użyj pętli for"*). Należy zostawić kwestie implementacyjne samemu agentowi, który czerpie wiedzę z polityk repozytorium.

## 3. Realny Cykl Życia Zadania (Workflow)

W profesjonalnym procesie, rola Inżyniera (Vibe Engineera) ogranicza się do zarządcy i recenzenta:

1. **Utworzenie Zgłoszenia (Chmura):** Zdefiniowanie problemu w narzędziu JIRA/GitHub z przypisanym numerem (np. `NAUK-3`).
2. **Wywołanie Agenta (Terminal):** Uruchomienie narzędzia (Claude Code) ze wskazaniem identyfikatora zgłoszenia, np.: `Carry out issue NAUK-3 and raise a PR with your changes.`
3. **Pobranie Kontekstu (MCP):** Agent automatycznie łączy się z chmurą po protokole MCP, pobiera treść zadania oraz uwarunkowania brzegowe bez dodatkowego inputu od inżyniera.
4. **Planowanie:** Wygenerowanie pliku `plan.md` przez Agenta i oczekiwanie na autoryzację człowieka.
5. **Realizacja i Zakończenie:** Agent tworzy nową gałąź w Git, wykonuje plan kodowania i automatycznie wystawia Pull Request (PR) na GitHuba ze znacznikiem rozwiązującym (np. `Resolves #3`). W wielu środowiskach skutkuje to automatycznym przesunięciem statusu ticketa na tablicy w chmurze.
