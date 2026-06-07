---
name: hallucination-shield
description: >
  Zmusza agenta do weryfikacji stanu środowiska, rygorystycznego czytania najnowszej dokumentacji,
  testowania poprawności importu (python -c) oraz analizy wycofywanych metod (deprecation) przed wdrożeniem kodu.
  Uruchamia się, gdy użytkownik mówi "implement this API", "add MCP", "use the latest library X",
  "write code" lub "refactor".
version: 1.0.0
---

# Procedura Weryfikacji Środowiska (Zakaz Pisania Kodu w Ciemno)

Jesteś inżynierem-audytorem, który wie, że jego pamięć może halucynować nieaktualne wersje oprogramowania. Zanim napiszesz kod integrujący systemy zewnętrzne, MUSISZ zweryfikować rzeczywisty stan środowiska użytkownika i zapoznać się z najnowszą dokumentacją.

## KROK 1: Audyt wersji i środowiska
1. Przed napisaniem kodu korzystającego z nowej biblioteki uruchom polecenie `uv pip show <package_name>` lub `pip show <package_name>`.
2. Zidentyfikuj dokładną wersję używaną w projekcie (np. `0.130.0`).

## KROK 2: Obowiązkowe czytanie najnowszej dokumentacji
Pisanie kodu dla zewnętrznych bibliotek (Pydantic, MCP, FastAPI, OpenAI SDK itp.) wyłącznie z pamięci LLM jest surowo zabronione.
1. **Lokalna dokumentacja:** Przeszukaj katalog `/docs` lub `/materials` pod kątem plików zawierających wytyczne dla danej biblioteki. Masz BEZWZGLĘDNY obowiązek otwarcia i przeczytania tych plików przed przystąpieniem do pisania kodu.
2. **Dokumentacja online (Wyszukiwanie):** Jeśli brakuje dokumentacji lokalnej lub masz wątpliwości, użyj dostępnych narzędzi sieciowych (wyszukiwarki), aby znaleźć oficjalną dokumentację dla wersji określonej w Kroku 1 (np. `docs.pydantic.dev` lub repozytorium GitHub serwera MCP).
3. **Analiza sygnatur:** Przed wywołaniem metody sprawdź jej dokładne parametry wejściowe w oficjalnych źródłach internetowych.
4. **Context7 MCP (Wyszukiwarka API):** Jeśli serwer Context7 MCP (`@upstash/context7-mcp@latest`) działa w Twoim środowisku, MUSISZ użyć narzędzia `query-docs` z odpowiednim identyfikatorem biblioteki (np. `/littlebearapps/outlook-mcp` lub innej używanej), aby pobrać aktualne i świeże API.

## KROK 3: Test i odkrywanie API
Zamiast zgadywać argumenty funkcji z pamięci:
1. Dla nowszych frameworków (takich jak pakiety MCP lub nowe moduły Pythona), napisz krótki skrypt pomocniczy wywołujący `help(Module)` lub uruchom inspekcję w terminalu (np. `dir(Object)`).
2. Sprawdź, co pakiet aktualnie eksponuje. Czy oczekiwana metoda nadal tam jest?

## KROK 4: MCP i zasada Fail-Fast
1. Model Context Protocol to stosunkowo nowa technologia. Twoja wbudowana wiedza może być nieaktualna.
2. Dodając narzędzia przez MCP, zmuszaj się do tworzenia logiki obsługującej ścisły standard JSON-RPC i powiedz na głos: *"Sprawdziłem aktualną specyfikację serwera"*.
3. Zaimplementuj Fail-Fast na porcie komunikacyjnym: Klient MCP musi sprawdzać połączenie przy starcie. Jeśli serwer nie odpowie w ciągu 5 sekund, klient musi zgłosić błąd krytyczny i zatrzymać proces, zamiast wisieć w nieskończoność.

## KROK 5: Weryfikacja działania i deprecacji (Wymóg Seniora)
Zanim uznasz kod za kompletny:
1. **Test importu:** Uruchom `python -c "from path.to.module import class_or_function"` w terminalu i upewnij się, że kończy się bez błędów. Zapobiega to halucynacjom dotyczącym struktury katalogów i nazw plików.
2. **Test ostrzeżeń (Warning test):** Uruchom aplikację lub testy z flagą `-W all`, np. `python -W all main.py` lub `pytest -W all`. Sprawdź, czy zewnętrzne biblioteki nie zgłaszają `DeprecationWarning` w kontekście Twojego kodu.

## Dyscyplina zakresu (Scope Discipline)
Ten skill ma charakter w dużej mierze diagnostyczny (tylko do odczytu), poza samym pisaniem kodu, o który prosił użytkownik. Kategorycznie ZABRANIA się samodzielnej modyfikacji wersji pakietów w `pyproject.toml` lub `uv.lock`, chyba że użytkownik wyraźnie polecił zaktualizować bibliotekę. Testuj w środowisku takim, jakie zastałeś.

## KROK 6: Twarde kryteria wyjścia (Hard Exit Criteria)
Praca nad integracją lub refaktoryzacją jest zakończona WYŁĄCZNIE wtedy, gdy:
- [ ] Przeanalizowano lokalną lub internetową dokumentację (zostaw ślad w postaci logu myśli: "Przeanalizowano dokumentację X dla wersji Y").
- [ ] Polecenie importu uruchomione przez `python -c` przechodzi bezbłędnie — dowód: wklejony wynik z terminala pokazujący 0 błędów.
- [ ] Uruchomiono test startowy z flagą `-W all` — dowód: wklejony wynik potwierdzający brak `DeprecationWarning` z Twojego kodu.
- [ ] Walidacja Fail-Fast została przetestowana — dowód: wklejony wynik z terminala pokazujący, że proces poprawnie przerywa działanie przy braku konfiguracji.
- [ ] Agent wprost oświadczył: "Hallucination Shield complete. Documentation verified for version X, import PASS, 0 deprecation warnings."

## Tarcza wymówek (Anti-Rationalization)

| Jeśli Ty (Agent LLM) myślisz... | Właściwa reakcja (Co musisz zrobić) |
| --- | --- |
| "Doskonale pamiętam, jak działa ta wersja biblioteki X." | Pamięć bywa zawodna. Sprawdź plik `uv.lock` lub kod źródłowy, aby upewnić się, czy metoda wciąż istnieje. Zrób to! |
| "Nie ma czasu na analizę, szybsze jest pisanie kodu." | Pisanie zabugowanego kodu marnuje najwięcej czasu. Zatrzymaj się i zweryfikuj API obiektu. |
| "Znam to API na wylot, nie muszę zaglądać do Google ani /docs." | Biblioteki w świecie AI zmieniają się z tygodnia na tydzień. Otwórz najnowszą lokalną dokumentację lub skorzystaj z wyszukiwarki. To jest rozkaz! |
| "Test importu zajmie zbyt dużo czasu." | Test trwa 2 sekundy. Uruchom `python -c` i udowodnij, że import działa. |
