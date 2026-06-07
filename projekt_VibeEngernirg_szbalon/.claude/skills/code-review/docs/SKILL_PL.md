---
name: code-review
description: >
  Przeprowadza inspekcję kodu w trybie tylko do odczytu lub audyt zmian w Pythonie, pull requestów,
  zagrożeń bezpieczeństwa, wycieków pamięci/zasobów, kontraktów API i łatwości utrzymania.
  Uruchamia się, gdy użytkownik mówi "review code", "audit my PR", "check for security risks", "review this file".
version: 1.0.0
---

# Code Review (Przegląd Kodu)

## Cel

Wykrywanie rzeczywistych problemów w kodzie wraz z dowodami, bez modyfikacji kodu produkcyjnego.

## Kiedy używać

- Użytkownik prosi o przegląd, audyt, weryfikację PR lub weryfikację bezpieczeństwa.
- Praca dotarła do punktu kontrolnego wymagającego weryfikacji typu HITL (Human-in-the-loop).
- Ryzykowna zmiana dotyka uwierzytelniania, bazy danych, API, zależności lub architektury.

## Kiedy NIE używać

- Użytkownik wyraźnie prosi o zaimplementowanie znanej i zaakceptowanej poprawki.
- Raport z przeglądu został już zaakceptowany i istnieje plan wdrożenia poprawki.

## Dane wejściowe

- Aktualny diff lub pliki docelowe.
- Plik `plan.md`.
- Istotne dokumenty w `docs/`.
- Wyniki istniejących testów i CI (jeśli są dostępne).

## Procedura

> **Relacja z innymi skillami:** użyj `code-review` do szczegółowego przeglądu pojedynczego PR lub pliku.
> Do pełnego skanowania przedzatwierdzeniowego pod kątem bezpieczeństwa, wydajności, jakości i architektury
> użyj `enterprise-code-auditor`. Do projektowania bezpieczeństwa użyj `threat-modeling`.
> Unikaj uruchamiania wszystkich trzech dla tej samej zmiany — wybierz ten, który najlepiej odpowiada zakresowi.
>
> **Grep to triaż, a nie dowód.** Skanowanie wzorców ujawnia kandydatów do poprawy, ale omija bardziej wyrafinowane
> problemy i generuje fałszywe alarmy. Potwierdź każde znalezisko, czytając rzeczywisty kod, a niepewne punkty oznacz
> jako `needs verification` (wymaga weryfikacji), zamiast bezwarunkowo stwierdzać błąd.

1. Wejdź w tryb tylko do odczytu (read-only).
2. Zidentyfikuj typ przeglądu: przegląd PR, audyt bezpieczeństwa, przegląd architektury lub audyt kodu spuścizny (legacy).
3. Dokonaj inspekcji odpowiednich zmian/plików.
4. Dla każdego znalezionego problemu zbierz plik, numer linii i dowód (evidence).
5. Sklasyfikuj poziom ważności (severity).
6. Oznacz status: `real` (rzeczywisty), `false positive` (fałszywy alarm) lub `needs verification` (wymaga weryfikacji).
7. Zaproponuj poprawkę oraz wymagany test.
8. Zapisz wyniki w żądanym pliku przeglądu.
9. Nie edytuj kodu produkcyjnego.

## Format zgłoszenia (Finding Format)

```markdown
### [SEVERITY] Krótki tytuł
- Plik: `path/to/file.py:42`
- Status: real | false positive | needs verification
- Dowód (Evidence): wynik polecenia lub krótka referencja do kodu
- Wpływ (Impact): dlaczego to ma znaczenie
- Proponowana poprawka: konkretne działanie naprawcze
- Wymagany test: test weryfikujący poprawność poprawki
```

## Dyscyplina zakresu (Scope Discipline)

Jesteś bezwzględnie w trybie TYLKO DO ODCZYTU dla całego kodu źródłowego Pythona. Kategorycznie ZABRANIA się modyfikowania, naprawiania lub refaktoryzacji kodu, który przeglądasz. Jedyne uprawnienie do zapisu dotyczy tworzenia plików markdown z przeglądem w folderze `docs/`.

## Wynik (Output)

- `docs/review.md`, `docs/audit_report.md`, `docs/security_audit.md` lub wskazany plik raportu.

## Twarde kryteria wyjścia (Hard Exit Criteria)

Zadanie jest zakończone WYŁĄCZNIE wtedy, gdy:
- [ ] Formalny raport z przeglądu został zapisany na dysku w wymaganym formacie.
- [ ] Każde znalezisko zawiera konkretny dowód (numery linii, wynik grep).
- [ ] Uruchomiono polecenie terminalowe `cat <review_file>`, aby udowodnić, że raport istnieje i ma prawidłowy format.
- [ ] Wyraźnie wypisano podsumowanie: "Code Review complete. Generated report at `<file>`, found X issues. No production code was modified."

## Tarcza wymówek (Anti-Rationalization)

| Wymówka / Racjonalizacja | Działanie |
| --- | --- |
| "Poprawię tę literówkę przy okazji robienia review." | **ODRZUCONO.** Naruszenie dyscypliny zakresu. Tryb tylko do odczytu oznacza brak modyfikacji. |
| "Nie muszę tworzyć pliku, po prostu wypiszę wyniki na czacie." | **ODRZUCONO.** Musisz wygenerować formalny plik `docs/review.md`. |
| "Zakładam, że ta funkcja powoduje wyciek pamięci bez sprawdzania szczegółów." | **ODRZUCONO.** Każde znalezisko wymaga dowodu. Uruchom grep lub wskaż konkretne linie. |
