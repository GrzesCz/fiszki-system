---
title: 'Podstawy i Słowniczek (JIRA vs GitHub Issues)'
category: 'Jira'
status: zrobione
type: notatka
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---

# Podstawy i Słowniczek (JIRA vs GitHub Issues)

## 1. Porównanie Narzędzi

Zarówno JIRA, jak i GitHub Issues opierają się na zaawansowanych tablicach Kanban służących do śledzenia statusu wykonania zadań.

| Cechy | JIRA | GitHub Issues |
| :--- | :--- | :--- |
| **Docelowy odbiorca** | Korporacje, duże zespoły Enterprise | Startupy, Open Source, średnie zespoły |
| **Zarządzanie** | System bardzo złożony (tysiące opcji konfiguracji) | Lekki, natywnie wbudowany w platformę GitHub |
| **Pojęcia** | Rozbudowana hierarchia (Epic, Story, Task, Bug) | Płaska struktura ("Issue") z użyciem etykiet (Labels) |

## 2. Kluczowe Pojęcia Korporacyjne (Słowniczek JIRA)

Aby poprawnie mapować architekturę biznesową na zadania, JIRA wymusza stosowanie specyficznej nomenklatury:

1. **Epic (Epos):** Nadrzędny cel biznesowy lub funkcjonalność wysokiego poziomu (np. *"Moduł Użytkownika"*). Zwykle realizacja Epica trwa tygodnie/miesiące i jest on dzielony na mniejsze jednostki.
2. **Story (Historyjka Użytkownika):** Mniejsza jednostka wyciągnięta z Epica, formułowana zawsze z perspektywy klienta końcowego. Przykład: *"Jako klient chcę móc zresetować hasło, aby odzyskać dostęp do konta."* Jest to najczęstszy typ zgłoszenia opracowywany przez programistę.
3. **Task (Zadanie):** Jednostka o charakterze technicznym, niezwiązana bezpośrednio z wartością dla klienta końcowego (np. *"Skonfiguruj serwer bazy danych PostgreSQL"*).
4. **Bug (Błąd):** Zgłoszenie awarii, usterki lub niezgodności z wymaganiami. Zazwyczaj traktowane z wyższym priorytetem.

## 3. Podejście GitHub Issues

W ekosystemie GitHub Issues zrezygnowano z twardego podziału typologicznego na rzecz struktury etykietowej (Labels). Każde zgłoszenie to po prostu "Issue" o określonym numerze (np. `#123`). Klasyfikacji dokonuje się poprzez przypinanie tagów:
- `bug` (odpowiednik Bug z JIRY)
- `enhancement` (odpowiednik Story/Task)
- `documentation`

Opcjonalny widok tablicy Kanban zapewnia w tym ekosystemie wbudowane narzędzie **GitHub Projects**.
