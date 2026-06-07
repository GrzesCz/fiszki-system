# Rekomendacje Skilli (VibeEngineering)

Poniższa tabela przedstawia podział 21 skilli (z wersji poprawionej v1.2.0) na kategorie. Dzięki niej wiesz, które skille wpiąć do systemu w zależności od tego, nad czym aktualnie pracujesz.

## Tabela Zastosowań

| Kontekst / Sytuacja | Rekomendowane Skille | Dlaczego są konieczne? |
| :--- | :--- | :--- |
| **1. Żelazny Fundament (ZAWSZE)**<br>*(Niezależnie od projektu i frameworka)* | `simplicity-gate`<br>`python-quality-gate`<br>`hard-gate-review` | **Chronią przed błędami i "AI Slop".**<br>Gwarantują, że kod jest higieniczny (lintery, mypy), pozbawiony zbędnych abstrakcji (anty-przeinżynierowanie) i został rzetelnie, krytycznie oceniony przed zakończeniem pracy. |
| **2. Refaktoryzacja i Utrzymanie**<br>*(Praca ze starym, istniejącym kodem)* | `boy-scout-rule`<br>`test-design-enforcer`<br>`incident-debugging`<br>`enterprise-code-auditor` | **Redukują dług techniczny.**<br>Wymuszają pozostawienie kodu w lepszym stanie (skaut), budują tarczę ochronną z bezwzględnych testów regresyjnych i precyzyjnie diagnozują problemy w kodzie produkcyjnym. |
| **3. Nowy Projekt (Pisanie od Zera)**<br>*(Faza planowania i pierwszych linii)* | `product-discovery`<br>`domain-modeling`<br>`adr-writer`<br>`api-contract-review` | **Zapobiegają wczesnym błędom architektonicznym.**<br>Pomagają zrozumieć biznes (DDD), wymuszają logowanie ważnych decyzji (ADR) oraz nakazują zaprojektowanie czystego kontraktu API *przed* napisaniem faktycznego kodu. |
| **4. Rozwiązania Produkcyjne**<br>*(API, Bazy Danych, Integracje)* | `resilience-enforcer`<br>`thin-router-enforcer`<br>`database-migration-review`<br>`observability-check` | **Dbają o środowisko produkcyjne.**<br>Chronią aplikację przed upadkiem przez timeouty (resilience), wymuszają czystą architekturę FastAPI i dbają o bezpieczeństwo migracji bazy danych. |
| **5. Bezpieczeństwo i Release**<br>*(Przed wdrożeniem i dla Auth)* | `pydantic-security`<br>`threat-modeling`<br>`release-readiness`<br>`performance-readiness` | **Domknięcie projektu.**<br>Sprawdzają kod pod kątem wycieków sekretów, wymuszają modelowanie zagrożeń (OWASP) i weryfikują gotowość wydajnościową przed oddaniem projektu. |

---

### Jak tego używać w praktyce?
- **Masz mały skrypt do napisania?** Włącz tylko Grupę 1 (Żelazny Fundament).
- **Masz naprawić stary kod po poprzednim developerze?** Włącz Grupę 1 + Grupę 2.
- **Startujesz nowy, komercyjny mikroserwis?** Na początku uruchom Grupę 3 (by go zaprojektować), a w trakcie pisania Grupę 1 + Grupę 4.
