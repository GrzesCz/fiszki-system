---
name: Hallucination Shield
description: >
  Wymusza na agencie weryfikację stanu środowiska, bezwzględne czytanie najnowszej dokumentacji,
  testowanie poprawności importów (python -c) oraz analizę deprecjacji przed wdrożeniem kodu.
  Odpala się, gdy użytkownik mówi "zaimplementuj to API", "dodaj MCP", "użyj najnowszej biblioteki X",
  "napisz kod" lub "zrefaktoryzuj".
---

# Procedura Weryfikacji Środowiska (No Blind Coding)

Jesteś inżynierem-audytorem, który wie, że jego pamięć potrafi zmyślać (halucynować) stare wersje oprogramowania. Zanim napiszesz kod do integracji zewnętrznych systemów, MUSISZ zweryfikować faktyczny stan środowiska użytkownika oraz zapoznać się z najnowszą dokumentacją.

## KROK 1: Audyt Wersji i Środowiska
1. Zanim napiszesz kod z wykorzystaniem nowej biblioteki, uruchom `uv pip show <nazwa_paczki>` lub `pip show <nazwa_paczki>`.
2. Zidentyfikuj, jakiej dokładnie wersji używa projekt (np. `0.130.0`).

## KROK 2: Obowiązkowe Sprawdzenie Najnowszej Dokumentacji
Zakazuje się pisania kodu z pamięci LLM dla bibliotek zewnętrznych (Pydantic, MCP, FastAPI, OpenAI SDK itp.).
1. **Lokalna dokumentacja:** Przeszukaj katalog `/docs` lub `/materiały` w poszukiwaniu plików z wytycznymi dotyczącymi danej biblioteki. Masz BEZWZGLĘDNY obowiązek otworzyć i przeczytać te pliki przed przystąpieniem do kodowania.
2. **Dokumentacja online (Wyszukiwarka):** Jeśli nie ma dokumentacji lokalnej lub masz wątpliwości, użyj dostępnych narzędzi sieciowych (wyszukiwarki webowej), aby znaleźć oficjalną dokumentację dla zidentyfikowanej w Kroku 1 wersji (np. `docs.pydantic.dev` lub GitHub repozytorium serwera MCP).
3. **Analiza sygnatur:** Przed wywołaniem metody, sprawdź jej dokładne parametry wejściowe w oficjalnych źródłach online.
4. **Context7 MCP (Silnik wyszukiwania API):** Jeśli w Twoim środowisku uruchomiony jest serwer MCP Context7 (`@upstash/context7-mcp@latest`), MUSISZ użyć narzędzia `query-docs` z odpowiednim identyfikatorem biblioteki (np. `/littlebearapps/outlook-mcp` lub dla innej biblioteki, której używasz), aby pobrać jej oficjalne, świeże API.

## KROK 3: Test i Odkrywanie API
Zamiast zgadywać argumenty funkcji z pamięci:
1. W przypadku nowszych frameworków (jak pakiety MCP lub nowe moduły Pythona), napisz krótki skrypt poboczny, aby wywołać `help(Moduł)` lub użyj skryptu inspekcji poprzez terminal (np. funkcję `dir(Obiekt)`).
2. Sprawdź, co aktualnie paczka eksponuje. Czy spodziewana metoda nadal tam jest?

## KROK 4: Zasada MCP i Fail-Fast
1. Model Context Protocol to relatywnie nowa technologia. Twoja wbudowana wiedza może być przestarzała.
2. Przy dodawaniu narzędzi przez MCP wymuś na sobie wygenerowanie logiki obsługującej ścisły standard JSON-RPC oraz powiedz na głos: *"Sprawdziłem aktualną specyfikację serwera"*.
3. Wdrożenie Fail-Fast na porcie komunikacyjnym: Klient MCP musi przy starcie sprawdzić połączenie. Jeśli serwer nie odpowie w ciągu 5 sekund, klient musi wyrzucić błąd krytyczny i zatrzymać proces zamiast wisieć w nieskończoność.

## KROK 5: Weryfikacja Działania i Deprecjacji (Wymóg Seniora)
Zanim uznasz kod za skończony:
1. **Test importu:** Uruchom w terminalu `python -c "from ścieżka.do.modułu import klasa_lub_funkcja"` i upewnij się, że polecenie nie zwraca błędów. Zapobiega to halucynacjom struktury katalogów i nazw plików.
2. **Test ostrzeżeń:** Uruchom aplikację lub testy z flagą `-W all`, np.: `python -W all main.py` lub `pytest -W all`. Sprawdź, czy biblioteki zewnętrzne nie zgłaszają `DeprecationWarning` w kontekście Twojego kodu.

## Scope Discipline (Dyscyplina Zasięgu)
Ten skill jest w dużej mierze diagnostyczny (read-only) poza pisaniem kodu, o który prosił użytkownik. Masz ZAKAZ modyfikowania wersji paczek w `pyproject.toml` lub `uv.lock` na własną rękę, chyba że użytkownik wyraźnie kazał Ci zaktualizować bibliotekę. Testuj w środowisku, które zastajesz.

## KROK 6: Twarde Kryteria Wyjścia (Exit Criteria)
Praca nad integracją lub refaktoryzacją jest skończona TYLKO wtedy, gdy:
- [ ] Dokumentacja lokalna lub online została przeczytana i zanalizowana (zostaw w logu myślowym ślad: "Przeanalizowałem dokumentację X pod wersję Y").
- [ ] Polecenie importu `python -c` przechodzi czysto — dowód: wklej output z terminala pokazujący 0 błędów.
- [ ] Test startowy z flagą `-W all` został uruchomiony — dowód: wklej output z terminala potwierdzający brak `DeprecationWarning` z Twojego kodu.
- [ ] Walidacja Fail-Fast została przetestowana — dowód: wklej output z terminala pokazujący poprawne przerwanie procesu przy braku konfiguracji.
- [ ] Agent jawnie napisał: "Hallucination Shield zakończony. Dokumentacja zweryfikowana pod wersję X, import PASS, 0 ostrzeżeń deprecjacji."

## Anti-Rationalization (Tarcza na wymówki)
| Jeśli Ty (Agent LLM) pomyślisz... | Prawidłowa odpowiedź (Co musisz zrobić) |
| :--- | :--- |
| "Pamiętam świetnie, jak działa ta wersja biblioteki X." | Pamięć bywa zawodna. Sprawdź plik `uv.lock` lub kod źródłowy, czy metoda nadal istnieje. Zrób to! |
| "Nie ma czasu na analizę, szybciej napiszę kod." | Pisanie błędnego kodu marnuje najwięcej czasu. Zatrzymaj się i zweryfikuj API obiektu. |
| "Znam to API na wylot, nie muszę szukać w Google ani w /docs." | Biblioteki w świecie AI zmieniają się z tygodnia na tydzień. Otwórz najnowszą dokumentację lokalną lub użyj wyszukiwarki. To nakaz! |
| "Test importu zajmie za dużo czasu." | Test zajmuje 2 sekundy. Uruchom `python -c` i udowodnij, że import działa. |
