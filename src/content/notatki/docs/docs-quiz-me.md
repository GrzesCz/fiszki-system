---
title: "quiz-me"
category: "Docs Quiz Me"
name: quiz-me
description: "Generuje quiz sprawdzający wiedzę z danego tematu Python. Użyj gdy użytkownik chce sprawdzić co zapamiętał."
---

# Quiz Me

## Procedura

1. Sprawdź w AGENTS.md, z którego modułu jest temat.
2. Wygeneruj 5 pytań o rosnącej trudności:
   - **Pytanie 1-2**: Definicja / "Co to jest?" / "Do czego służy?"
   - **Pytanie 3**: "Jaka jest różnica między X a Y?" (np. os.path vs pathlib, str vs Annotated[str])
   - **Pytanie 4**: "Co jest nie tak z tym kodem?" (pokaż błędny snippet)
   - **Pytanie 5**: "Napisz funkcję/klasę, która..." (zadanie praktyczne)
3. Czekaj na odpowiedzi użytkownika. **NIE podawaj odpowiedzi od razu.**
4. Po odpowiedzi: oceń (poprawna/niepoprawna), wyjaśnij krótko jeśli błąd.
5. Na końcu: **podsumowanie wyniku** (X/5) i rekomendacja co powtórzyć.

## Styl pytań
- Pytania w stylu konwersacyjnym ("Okej, zobaczmy co pamiętasz...")
- Kod w pytaniach: prosty, izolowany, bez zbędnych komplikacji
- Podpowiedzi: tylko jeśli użytkownik poprosi ("Chcesz wskazówkę?")

## Po quizie
- Jeśli wynik >= 4/5: "Świetnie! Możesz śmiało iść dalej."
- Jeśli wynik 2-3/5: "Nieźle, ale warto powtórzyć [konkretny temat]."
- Jeśli wynik <= 1/5: "Nie martw się! Wróćmy do tego tematu i przejdźmy go jeszcze raz."
