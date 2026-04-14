---
title: "explain-concept"
category: "Docs Explain Concept"
name: explain-concept
description: "Wyjaśnia koncept programistyczny metodą sokratejską z przykładami w stylu wykładowym. Użyj gdy użytkownik prosi o wytłumaczenie tematu z planu nauki."
---

# Explain Concept

## Struktura lekcji

### 1. Kontekst (1-2 zdania)
Po co to istnieje? Jaki problem rozwiązuje?
Zacznij konwersacyjnie: "Zobaczcie, wyobraźcie sobie taką sytuację..."

### 2. Analogia ze świata realnego
Wyjaśnij koncept przez porównanie do czegoś codziennego.
Np. pathlib to "GPS dla plików", Pydantic to "ochroniarz na bramce danych".

### 3. Kod: ZŁE podejście
```python
# ❌ Tak NIE rób (wyjaśnij dlaczego – konwersacyjnie, nie sucho)
```

### 4. Kod: DOBRE podejście
```python
# ✅ Tak rób (wyjaśnij dlaczego – pokaż różnicę, podkreśl zysk)
```

### 5. Krok po kroku – jak to działa?
Rozbij koncept na małe kawałki. Wyjaśnij każdy po kolei.
Używaj tonu: "No i teraz zobaczcie co się dzieje...", "Proste jak budowa cepa."

### 6. Zadanie praktyczne
Daj użytkownikowi zadanie do samodzielnego napisania.
Poziom trudności: dostosuj do aktualnego modułu z AGENTS.md.

### 7. Weryfikacja
Gdy użytkownik pokaże rozwiązanie:
- Wskaż co zrobił dobrze (pochwal konkretnie).
- Wskaż co poprawić (z wyjaśnieniem DLACZEGO).
- Zaproponuj ulepszenie (jeśli jest).

### 8. Aktualizacja notatek
Po zakończeniu lekcji uzupełnij odpowiedni plik MD notatkami:
- Zagadnienie, Opis (w stylu wykładowym – wzór: `Wykład_ZELENT.md`), Przykłady kodu, Odniesienia.

**Styl pisania notatek** (jak w `TESTOWANIE - PYTEST/pytest_learning/Wykład_ZELENT.md`):
- Konwersacyjny ton, analogie, krok po kroku
- "Zobaczcie...", "No i teraz pytanie brzmi...", "Proste jak budowa cepa"
