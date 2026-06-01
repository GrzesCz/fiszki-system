---
title: 'Szczegóły: Zespół Code Review w Pythonie (Case Study)'
category: Vibe Coding
next_review_date: '2026-06-30'
review_count: 0
status: zrobione
type: notatka
hidden: true
---
# Case Study: Zespół Agentów do Code Review (Profesjonalny Audyt Aplikacji)

**Cel:** Stworzenie zautomatyzowanego, zaryglowanego zespołu audytorów AI, którzy przeanalizują wielką bazę kodu Pythona pod kątem wycieków pamięci i bezpieczeństwa, bez uszkodzenia kodu produkcyjnego.

---

## 1. Dlaczego izolujemy Code Reviewerów? (Podejście Anti-Slop i Unikanie Agent Teams)

Gdy wpinasz Agenta-Recenzenta bezpośrednio w ten sam `Agent Team`, w którym pracuje Koder, tworzysz pole bitwy. Koder pisze logikę, Recenzent nakazuje refaktoryzację, Koder poprawia "dla sztuki" i psuje kod.
Aby temu zapobiec, Recenzent działa jako izolowany Sub-Agent Read-Only. Generuje listę uwag w `review.md`. To Ty, jako Architekt w modelu HITL, czytasz raport i decydujesz, czy wdrożyć te uwagi.

---

## 2. Prawidłowy Workflow Simona Willisona (Code Review w praktyce)

Zamiast po prostu mówić "Zrób review", Ed stosuje wysoce metodyczny, pięcioetapowy proces.

### Krok 1: Przełączenie modelu (Optymalizacja Kosztów)
Do przeglądu zmieniasz model na najpotężniejszy (Claude 3 Opus lub OpenAI o1).

### Krok 2: Tworzenie Twardego Raportu
Wysyłasz komendę do agenta (lub subagenta), kategorycznie wymagając pliku, zanim padnie choć jedna poprawka kodu.
> *"Przeprowadź kompleksowy code review całego repozytorium pod kątem wycieków pamięci i bezpieczeństwa. Wypisz listę działań i zapisz do pliku `docs/review.md`."*

### Krok 3: Sprawdzenie raportu i wyłapanie HALUCYNACJI
**Nigdy nie akceptuj w ciemno zgłoszeń od AI!**
Agenty halucynują bezpieczeństwo z chorobliwą pewnością siebie. Np. raport głosi "Wyciek pliku `.env` do Git". Ty patrzysz i odpisujesz w terminalu:
> *"Skąd wziąłeś, że .env jest w Git? Jest w `.gitignore` i nie ma go na serwerze."*
Agent przeprasza i aktualizuje raport.

### Krok 4: Wymuszenie Retestów (Fix & Retest)
Gdy raport jest skorygowany, zlecasz naprawę z absolutnym wymogiem podwójnego testowania:
> *"Napraw wszystkie problemy o priorytecie krytycznym i wysokim. Daj znać, gdy skończysz — i przetestuj wszystko ponownie, przetestuj wszystko. Daj znać, gdy testy będą OK."*

### Krok 5: Zwalczanie Nieposłuszeństwa (Disobedience)
Modele czasem stwierdzą "Zbyt wielkie ryzyko, tego nie tykam". Przykładowo odmówią rozbicia monolitycznego modułu Pythona. Zawsze miej ostatnie zdowo.
> *"To jest dobre, ale JA NAPRAWDĘ chcę zrefaktoryzować ten monolityczny moduł. Zrób to teraz, potem przetestuj."*

---

## 3. Szablony dla Zespołu Audytującego

### Plik Konstytucji Recenzenta (`agents.md` dla Audytu)

```markdown
# Konstytucja: Główny Audytor Bezpieczeństwa

Jesteś surowym ekspertem Cyberbezpieczeństwa pracującym w reżimie Read-Only. 

## Cel i Restrykcje (TWARDE ZASADY)
1. **ZAKAZ ZMIANY KODU:** Pod groźbą natychmiastowego przerwania zadania, MASZ ZAKAZ bezpośredniego modyfikowania, refaktoryzacji, lub komitowania plików w projekcie. Zabraniam Ci używać narzędzi typu `Write` czy `StrReplace` na kodzie źródłowym.
2. **Kategoryczny ZAKAZ "AI Slop":** Nie wymyślaj uwag na siłę. Brak uwag jest lepszy niż czepianie się błahostek (np. pustej linii). Szukaj wyłącznie Poważnych Błędów.

## Czego szukasz (Zakres Audytu)
1. **Wycieki pamięci:** Sprawdzaj, czy zasoby (otwarte pliki, sesje DB) są prawidłowo zamykane.
2. **OWASP Top 10:** SQL Injection, Hardcodowane sekrety, brak walidacji wejścia Pydantic.

## Format Wyjściowy
Oczekuję raportu w Markdown zapisanego jako `docs/review.md`. Dla każdego błędu wylistuj Poważność, dokładną ścieżkę oraz proponowany snippet naprawczy.
```

### Plik Zarządzania Audytem (`plan.md` w Bite-sized chunks)

```markdown
# Plan: Kwartalny Audyt Bezpieczeństwa

## Cel Główny
Wygenerowanie raportu bezpieczeństwa bez żadnej ingerencji w kodzie.

## Faza 1: Uwierzytelnianie i Autoryzacja
- [ ] Krok 1.1: Sprawdź kontrolery w `src/api/auth/` pod kątem podatności.
- [ ] Krok 1.2: Zaktualizuj plik `docs/review.md` i zrób `/compact` logów w swoim procesie.

## Faza 2: Baza Danych i Testy końcowe (Cross-Model Review)
- [ ] Krok 2.1: Przeskanuj kod z użyciem komendy `codex exec` (wywołaj sub-agenta OpenAI by na wszelki wypadek też sprawdził pliki auth).
```