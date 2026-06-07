---
name: threat-modeling
description: >
  Przeprowadza modelowanie zagrożeń (threat modeling) dla publicznych API, uwierzytelniania, wrażliwych danych,
  wysyłania plików, płatności, zewnętrznych integracji oraz wrażliwych pod kątem bezpieczeństwa elementów w Pythonie.
  Uruchamia się, gdy użytkownik mówi "threat model", "analyze security risks", "STRIDE analysis".
version: 1.0.0
---

# Threat Modeling (Modelowanie Zagrożeń)

## Cel

Wyszukanie ryzyk bezpieczeństwa przed rozpoczęciem implementacji i przekształcenie ich w działania naprawcze (mitigations) oraz testy bezpieczeństwa.

## Kiedy używać

- Zadanie dotyczy uwierzytelniania, autoryzacji, publicznego API, danych użytkownika, przesyłania plików lub integracji zewnętrznych.
- Funkcjonalność przetwarza dane wrażliwe lub regulowane prawnie.
- Analizowany jest incydent bezpieczeństwa lub wyniki audytu.

## Kiedy NIE używać

- Zmiana ma charakter wyłącznie wewnętrzny i nie przekracza żadnej granicy zaufania (security boundary).
- Istnieje już zaakceptowany model zagrożeń dla tego obszaru, a granice zaufania nie uległy zmianie.

## Dane wejściowe

- Plik `docs/requirements.md`.
- Plik `docs/architecture.md`.
- Plik `docs/api_contract.md`.
- Odpowiednie rekordy ADR.
- Aktualne zadanie z pliku `plan.md`.

## Procedura

1. Zidentyfikuj aktywa (assets) podlegające ochronie.
2. Zidentyfikuj aktorów (actors) w systemie.
3. Zidentyfikuj punkty wejścia (entrypoints).
4. Zidentyfikuj granice zaufania (trust boundaries).
5. Zastosuj metodologię STRIDE:
   - Spoofing (podszywanie się),
   - Tampering (manipulacja danymi),
   - Repudiation (wyparcie się działania),
   - Information disclosure (ujawnienie informacji),
   - Denial of service (odmowa usługi),
   - Elevation of privilege (podniesienie uprawnień).
6. Przypisz poziom ważności (severity).
7. Zaproponuj działania naprawcze (mitigations).
8. Dodaj wymagane testy bezpieczeństwa do pliku `plan.md`.
9. Zaktualizuj rejestr ryzyk w `docs/risk_register.md`.
10. Zapisz model w pliku `docs/threat_model.md`.

## Dyscyplina zakresu (Scope Discipline)

Twój zakres działań ogranicza się wyłącznie do analizy architektury oraz zapisu danych w `docs/threat_model.md` i `docs/risk_register.md`. Kategorycznie ZABRANIA się samodzielnego implementowania zabezpieczeń (np. dodawania middleware uwierzytelniającego do kodu Pythona) podczas wykonywania tego zadania.

## Wynik (Output)

- Plik `docs/threat_model.md`.
- Zaktualizowany rejestr ryzyk w `docs/risk_register.md`.
- Zadania dotyczące testów bezpieczeństwa dodane do `plan.md`.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gang:
- [ ] Analiza STRIDE została w pełni udokumentowana w pliku `docs/threat_model.md`.
- [ ] Uruchomiono polecenie terminalowe `cat docs/threat_model.md`, aby udowodnić istnienie pliku.
- [ ] Zadania naprawcze oraz testy bezpieczeństwa zostały dodane do pliku `plan.md`.
- [ ] Agent wprost oświadczył: "Threat Modeling complete. Output generated in docs/threat_model.md, X high/critical risks identified."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Od razu wdrożę poprawkę bezpieczeństwa bezpośrednio w kodzie." | **ODRZUCONO.** Naruszenie dyscypliny zakresu! Dodaj działanie naprawcze do planu, ale nie pisz jeszcze kodu. |
| "Raport z ryzyk opiszę wyłącznie na czacie." | **ODRZUCONO.** Musisz wygenerować formalne pliki markdown. |
| "Metodologia STRIDE jest zbyt ciężka dla tej zmiany, napiszę po prostu jeden akapit." | **ODRZUCONO.** Musisz postępować zgodnie z formalną metodologią STRIDE i w pełni ją udokumentować. |
