---
title: 'Szczegóły: Workflow, Mindset i Debugowanie'
category: Vibe Coding
next_review_date: '2026-05-19'
review_count: 0
status: zrobione
type: notatka
hidden: true
---
# Workflow Deweloperski i Systematyczne Debugowanie

**Źródło:** Kurs Udemy Vibe Coding (Ed Donner), Dokumentacja.

## 1. Początek pracy: Nigdy nie zaczynaj od kodu

Ed Donner jest kategoryczny: prawidłowy cykl deweloperski zaczyna się od sformalizowanego zadania w JIRA (lub GitHub Issues).
Dopóki nie ma ticketu — nie ma zadania.

- **JIRA Free:** Używaj wersji darmowej "team managed". Jeśli JIRA to za dużo, weź GitHub Issues.
- **Granularność (Tasks):** Twórz najmniejsze zadania. Jeden ticket to jedna 30-minutowa sesja Vibe Codingu. Nie twórz ogromnych historii (Epics).
- **Brak kopiowania:** Używaj oficjalnego serwera **Atlassian MCP**. Wpisujesz w CLI: *"Zrób ticket PL-2 i wystaw PR"*. Nie marnuj tokenów na ręczne kopiowanie treści ticketu z przeglądarki do czatu, niech agent sam to odczyta!

## 2. Vibe Engineering Mindset (Filozofia pracy)

Podejście "Vibe Engineer" polega na utrzymaniu rygoru inżynieryjnego.

1. **Zawsze zlecaj pytania przed pracą:** Pierwszy prompt to zawsze *"Przeczytaj plan.md i zadaj mi pytania. Nie wykonuj jeszcze żadnej pracy"*. To uratuje godziny czasu.
2. **Każ agentowi pisać Tutoriale:** Uczysz się nowego stacku? Każ wygenerowanemu kodowi opisać się samemu *"Napisz tutorial w Markdown jak to napisałeś dla początkującego"*.
3. **Nie wierz w ułudę 10x:** Zrobisz to szybciej, ale zderzysz się ze ścianą bugów. Prawdziwa wartość to ekspansja możliwości (możesz zrobić więcej typów aplikacji), a nie tylko czysta prędkość.
4. **"Watch like a hawk" (Karpathy):** Obserwuj agenta jak jastrząb. Nie ufaj jego poprawkom w ciemno. Grozi Ci **atrofia umiejętności** — jeśli przestaniesz czytać kod agenta, stracisz zdolność programowania.
5. **Nadchodzi Slop Apocalypse:** Za rok branża zbuntuje się przeciw rozwlekłym, emoji-heavy kodom i gigantycznym README generowanym z LLM. Pisz zwięźle.

## 3. Strategia Debugowania

Gdy kod nie działa, odrzuć zgadywanki i zastosuj procedurę:

1. **Twardy `git commit`:** To Twoja główna linia obrony przed zepsuciem plików przez agenta. Zawsze zaczynaj od commita przed wejściem w bugfixing.
2. **Podejście 1 (Szybkie): Copy-Paste.** Skopiuj stack trace wprost z konsoli do agenta, bez żadnych słów wyjaśnienia. Agent ma cały kontekst. Jeśli za pierwszym razem tego nie naprawi, przejdź do kroku 3.
3. **Podejście 2 (Systematyczne z `debug.md`):**
    - Każ agentowi udokumentować, jak błąd odtworzyć, w pliku `debug.md`.
    - Wygeneruj **udowodnione hipotezy** w oparciu o logi i np. Web Search. Ostrzeżenie: Agent często skłamie ("Found it!") pokazując rozwiązanie z przestarzałego wątku na StackOverflow. Challenguj go: *"Udowodnij mi, że to dotyczy naszego przypadku"*.
    - Wybierz udowodnioną hipotezę, napraw kod, upewnij się, że problem ustąpił.
4. **Ostrzeżenie (Czerwony Śledź - Red Herring):** Czasami bug jest w zupełnie innej części systemu (albo psuje go zła wtyczka FeatureDev). Zrób twardy `git reset` by usunąć wszystkie zmiany i napisz agentowi wyraźnie: *"To NIE JEST moduł Auth, szukaj gdzie indziej"*.

## 4. Omijanie ograniczeń (AMP Code i Darmowe Tokeny)

Jeśli pracujesz na budżecie i nie używasz potężnego API z karty kredytowej:
- **AMP Code (Ads for AI):** Projekt dostarczający dzienny kredyt AI (~10 USD) w zamian za reklamy w terminalu. Super do nauki. Używaj trybu **Deep** (`Ctrl+S`), by agent "myślał dłużej" przy kodowaniu.
- **Haczyk Darmowych Modeli:** Korzystając z darmowych warstw, zgadzasz się na trenowanie modeli swoim kodem i upublicznianie promptów. W projektach komercyjnych jest to absolutnie nieakceptowalne.

## 6. Zarządzanie oknem kontekstowym (Lost in the Middle & Context Rot)

Zgodnie z najnowszymi obserwacjami (m.in. materiały Olafa Sulicha oraz badania z 2023 r.), ogromne okna kontekstowe rzędu miliona tokenów są złudne. Zrzucenie wszystkiego do jednego promptu powoduje degradację intelektu Agenta.

1. **Efekt "Lost in the Middle":** Model doskonale pamięta początek promptu i jego koniec, ale kompletnie gubi się w środku (krzywa w kształcie litery U). 
2. **Smart Zone vs Dumb Zone:** Modele operują inteligentnie (w tzw. "Smart Zone") do około 1/4 - 1/2 zadeklarowanego kontekstu (np. do 256 tys. tokenów dla o1/Opusa). Jeśli zapchasz kontekst plikami, logami i wywołaniami serwerów MCP, wpychasz Agenta w "Dumb Zone" (wydajność drastycznie spada, model staje się podatny na "rozpraszacze" i błędne informacje).
3. **Manualna kompresja kontekstu (Rozwiązanie problemu):** 
   Gdy Agent wykona ciężki audyt lub zanalizuje logikę, nie zmuszaj go do pisania na tej podstawie kodu w tym samym, zanieczyszczonym już oknie. Intencjonalnie każ mu **wyciągnąć wnioski do pliku Markdown** (np. `docs/analiza_auth.md`). Następnie zamknij sesję (wymuś `clear` lub otwórz nowy czat w Cursorze), stwórz nowe, sterylne okno kontekstowe, dołącz TYLKO ten skompresowany plik i dopiero na jego podstawie zleć pisanie kodu. Nigdy nie polegaj na wbudowanych w edytor automatach do kompresji kontekstu — rób to świadomie.
4. **Jeden cel, jedno okno (Krótka Smycz i Unikanie Skoków):**
   Trzymaj model "na krótkiej smyczy". Im bardziej sprecyzujesz cel, tym mniej pola do niebezpiecznego manewru ma Agent. **Nie mieszaj odpowiedzialności!** Nie skacz po różnych modułach w tym samym oknie konwersacji. Podążaj cyklem *Research $\rightarrow$ Plan $\rightarrow$ Implement*, resetując okno dla każdego z tych zadań i przekazując pomiędzy nimi tylko wypracowane podsumowania Markdown.

`FeatureDev` to potężny, wieloetapowy plugin Anthropic budujący nową funkcjonalność.
- Instaluj go w folderze projektu `.clawd` i **koniecznie** wrzucaj to do Git (commit) by inni w zespole go mieli.
- Celowo wpisuj niedokładne tickety w JIRA. FeatureDev został stworzony do zadawania dodatkowych pytań przed kodowaniem.
- Uważaj: FeatureDev potrafi pominąć etap jakości (Quality Review) bez informowania Cię o tym. Zawsze pytaj na końcu: *"Jakie testy wykonałeś by to udowodnić?"*. Jeśli się pomylił, zgaś proces i każ napisać testy.