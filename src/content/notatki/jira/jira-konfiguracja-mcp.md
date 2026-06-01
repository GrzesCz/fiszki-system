---
title: 'Konfiguracja JIRA/GitHub i Integracja z MCP'
category: 'Jira'
status: zrobione
type: notatka
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---

# Konfiguracja JIRA/GitHub i Integracja z MCP

## 1. Wybór odpowiedniego narzędzia

Według rekomendacji ekspertów Vibe Engineering:
- Jeśli środowisko celowe wymaga wejścia na poziom korporacyjny z wieloma współzależnymi działami, należy celować w **JIRA**. Posiada ona darmowy plan dla małych zespołów ułatwiający naukę (preferowany tryb projektów: *Team-managed*).
- Dla mniejszych projektów, a także tam, gdzie występuje problem z uwierzytelnianiem sesji (OAuth w produktach Atlassiana bywa kłopotliwe w terminalu), **GitHub Issues** jest absolutnie akceptowalnym, w pełni profesjonalnym substytutem.

## 2. Podłączanie Terminala do Chmury (Protokół MCP)

Model Context Protocol (MCP) służy jako most wymiany danych pomiędzy oknem kontekstowym Agenta, a zewnętrzną bazą danych (JIRA/GitHub). Pozwala to na na żywo czytanie zmian z tablicy Kanban bezpośrednio do terminala (np. Cursor, Claude Code).

### Integracja z JIRA
1. W profilu Atlassian wygeneruj **Klucz API** (API Token). 
2. W narzędziu z obsługą MCP (np. Claude Code) zainicjuj polecenie integracji (np. `/mcp`).
3. Wybierz pakiet `@modelcontextprotocol/server-jira` z otwartego rejestru npm.
4. Skonfiguruj połączenie z użyciem własnego adresu e-mail, domeny projektu oraz wygenerowanego klucza API.

### Integracja z GitHub Issues
1. Z poziomu GitHuba wygeneruj **Fine-grained Personal Access Token** z odpowiednimi restrykcjami (wymagany dostęp `Read/Write` do sekcji `Issues` oraz `Pull requests` docelowego repozytorium).
2. Podobnie jak w przypadku JIRY, dodaj serwer GitHub (`@modelcontextprotocol/server-github`) do środowiska agenta.
3. Potwierdź uwierzytelnienie wklejając swój token w procesie konfiguracji.

## 3. Zastosowanie Wtyczek Ekstrakcyjnych (FeatureDev)

Dla najwyższych standardów inżynierskich rekomenduje się unikanie operowania na "surowym" agencie na rzecz dedykowanych wtyczek. Użycie komendy `feature-dev:feature-dev — please implement issue #3` zmusza sztuczną inteligencję do dogłębnego, wieloetapowego audytu założeń zadania przed jakąkolwiek ingerencją w kod. Ten mechanizm stanowi tarczę ochronną przed lukami informacyjnymi, które naturalnie pojawiają się w lakonicznych opisach zadań tworzonych przez inżynierów.
