---
title: 10 Rekomendacji przy budowie systemów z Agentami AI
category: Agenci AI
status: zrobione
type: notatka
hidden: true
mindmaps: []
---

# 10 Rekomendacji przy budowie systemów z Agentami AI

Na zakończenie kursu (sekcje 21 i 22 transkrypcji) prowadzący przedstawił absolutnie kluczowe podsumowanie – dekalog praktyka i inżyniera budującego komercyjne rozwiązania z Agentami AI. Nie ma znaczenia, jaki framework ostatecznie wybierzesz (OpenAI Agents SDK, CrewAI, LangGraph), te zasady pozostają uniwersalne.

### 1. Zaczynaj od problemu, a nie od Agenta (Nie szukaj młotka na siłę)
Bardzo często firmy próbują wciskać agentów AI do swojego systemu tylko ze względu na "hype". *"Chcę używać agentów do X"*. To błąd. Najpierw zrozum problem biznesowy. Gdy już zrozumiesz problem biznesowy (np. "obsługa klienta jest za wolna i gubi kontekst"), zbadaj, czy zbudowanie agenta to w ogóle najlepsze i najtańsze narzędzie do jego rozwiązania.

### 2. Określ konkretną metrykę sukcesu (Twoja Gwiazda Północna)
Nigdy nie oceniaj działania systemu "na oko" (np. "O, fajnie to napisał"). Musisz od samego początku wyznaczyć twardą metrykę (np. czas udzielenia poprawnej odpowiedzi, procent poprawnie sformatowanych JSON-ów, współczynnik retencji), którą będziesz monitorować po każdej zmianie w kodzie.

### 3. Starannie dobierz dane ewaluacyjne
Aby móc liczyć powyższą metrykę, potrzebujesz danych testowych. Zrozum jakie dane posiadasz, czego oczekujesz od systemu i stwórz wyselekcjonowane zbiory danych, które jednoznacznie posłużą Ci do odpytywania agentów w fazie R&D, a następnie do testowania wprowadzanych zmian.

### 4. Przepływ pracy (Workflow) ponad pełną Autonomią
Nie startuj od gigantycznego, w pełni autonomicznego rozwiązania (gdzie agenci mogą robić, co im się żywnie podoba). Najpierw stwórz sztywny, prosty "przepływ pracy", w którym każdy krok jest twardo zaprogramowany w Pythonie (uruchamiasz krok A, odbierasz wynik, podajesz wynik do kroku B). Gdy to działa niezawodnie, zacznij zwalniać twarde klamry i stopniowo wprowadzaj przekazywanie kompetencji za pomocą delegowania (handoffs) i autonomii (`as_tool()`).

### 5. Buduj od dołu do góry (Bottom-Up), a nie na odwrót
Inżynierowie oprogramowania mają tendencję do rysowania ogromnego grafu 15 agentów na pustej kartce papieru, po czym próbują zaprogramować go w całości, po czym narzekają, gdy nic nie działa. **Zła droga!** Zbuduj jednego, prościutkiego Agenta, dopracuj go do perfekcji. Dopiero gdy pierwszy element działa w izolacji, stwórz mu współpracownika i pracuj od dołu aż do skomplikowanej architektury.

### 6. Zaczynaj prosto i... "na bogato" (GPT-4o)
Częsty błąd to budowanie w oparciu o małe/tanie modele (np. `gpt-4o-mini`), bo tak jest "optymalnie kosztowo". Rozpoczynając projekt, rób wszystko tak prosto jak to możliwe, ale zaprzęgaj do tego najpotężniejsze modele na rynku (np. `gpt-4o` czy `Claude 3.5 Sonnet`). Sprawdź, czy teoretycznie w ogóle da się rozwiązać Twój problem. Gdy potężny model sobie poradzi w prostym systemie, wtedy zacznij "komplikować i tanieć" – rozbudowuj i obostrzaj prompty, optymalizuj system, po czym zamień drogi model na tańszy mini, utrzymując jakość działania. Jeśli nie działa od razu ze skomplikowanym grafem, po prostu nie będziesz wiedział, co zawiodło.

### 7. Nie przepracowuj sztucznie "Pamięci" (Memory)
Podział na skomplikowane obiekty "krótkotrwałe" czy bazy wektorowe "długotrwałe" jest w 99% przypadków błędem poznawczym. Pamięć Agenta to tylko technika pozwalająca na wyciągnięcie pasującego kawałka tekstu i... **wrzucenie go na sztywno do promptu**. Na koniec dnia model dysponuje tylko tym, co włożysz w aktualne okno kontekstowe. Zamiast budować architekturę wektorową, zastanów się: *Jakiego dokładnie kontekstu potrzebuje LLM, aby poprawnie odpowiedzieć na to pytanie?* i przekaż mu ten kontekst w jak najprostszy sposób (np. ładując cały krótki dokument).

### 8. Lepsze promptowanie rozwiązuje większość problemów
Ludzie notorycznie pytają: *"Model halucynuje, czy powinienem użyć innej bazy wektorowej lub zacząć fine-tuning modeli (dotrenowywanie)?"*. Zdecydowana większość problemów ze spójnością wynika z kiepskich instrukcji systemowych. Większość przypadków złego formatowania rozwiążesz po prostu prosząc model, aby wykluczył lub uwzględnił określoną rzecz, wykasowując nadmiar tekstu z promptu lub używając technik typu Structured Output. Dopiero gdy wykorzystasz 100% możliwości prompt inżynierii, idź w stronę narzędzi, RAG i wektorów.

### 9. Zawsze czytaj Ślady (Traces)
Nawet gdy wydaje się, że Agent świetnie działa i wypluwa odpowiednie wnioski w terminalu, wejdź na platformę podglądu (Traces/LangSmith) i spójrz na sekwencję. Może się okazać, że model wpadł pod maską w 5-krotną pętlę przepisywania tego samego pytania (za co płacisz!), i ledwo uniknął wybuchu błędu. Nie bądź ślepy na to, co działa się pod maską. Podłączenie własnych interfejsów czy monitoringu do śladów (Traces), tak jak pokazano na kursie przez klasę dziedziczącą, rozwiązuje problem "czarnej skrzynki".

### 10. Kapelusz Inżyniera Oprogramowania (Software Engineer) vs Kapelusz Naukowca (Data Scientist)
Tworzenie rozwiązań LLM wymaga noszenia obu tych ról na zmianę.
Gdy stoisz przed wyborem: "*jaki framework, jaki model, jakie narzędzia MCP*" – zdejmij z głowy twardy inżynierski hełm planisty i **załóż kapelusz badawczy**. Odpowiedź to **badania (R&D) i eksperymenty**. Przetestuj w Notatniku 3 różne ramy, użyj różnych modeli. Zmierz wynik na podstawie metryki biznesowej i zobacz na sucho, co u Ciebie rezonuje. Twój instynkt koder-architekta często będzie w świecie modeli niedeterministycznych błędny. Opieraj architekturę na badaniach i dowodach, nie na przeczuciu. Zawsze eksperymentuj.
