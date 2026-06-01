---
title: '04. Nowoczesne Haszowanie Haseł (Bcrypt)'
category: 'FastAPI'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 04. Nowoczesne Haszowanie Haseł (Bcrypt)

W wielu kursach, które bazują na przestarzałej dokumentacji, używa się biblioteki `passlib`. Niestety jest ona nieutrzymywana od dłuższego czasu i wywołuje konflikty z najnowszymi wersjami Pythona. Sprawdźmy jak poprawnie zaimplementować to bezpośrednio, bazując na czystym bcrypt.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Użycie bezpośrednio biblioteki bcrypt
import bcrypt

class PasswordHasher:
    @staticmethod
    def hash_password(password: str) -> str:
        # Konwersja hasła tekstowego na bajty
        password_bytes = password.encode('utf-8')
        # Generowanie soli i haszowanie
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        # Zwracamy jako bezpieczny string tekstowy do zapisu w DB
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        plain_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        # Bezpieczne porównanie w stałym czasie (ochrona przed side-channel attacks)
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
```

### 2. METODA FEYNMANA

Wyobraźcie sobie przepis na ciasto.
- **Haszowanie (Szyfrowanie jednokierunkowe):** Przepis na ciasto (hasło) wrzucasz do potężnego blendera i miksujesz na jednolitą masę (hash). Nawet najlepszy kucharz świata nie zdoła z tej papki wyciągnąć całych jajek i nienaruszonej mąki z powrotem. Jeśli ktoś ukradnie z bazy naszą papkę, nigdy nie odtworzy oryginalnego przepisu.
- **Sól (Salt):** Wyobraźcie sobie, że dwóch klientów miało takie same hasła `12345`. Ich papki w bazie wyglądałyby identycznie. Haker wiedziałby, że mają takie samo hasło. Sól to dodanie losowej szczypty unikalnej przyprawy (np. cynamonu do jednego, chili do drugiego) tuż przed włączeniem blendera. Dzięki temu papki obu klientów wyglądają drastycznie inaczej, chociaż rdzeń hasła był ten sam!

### 3. MAPA MYŚLI

```markdown
- Bezpieczeństwo i Haszowanie
  - Antywzorce (Dlaczego nie `passlib`)
    - Projekt porzucony (od 2020r brak aktualizacji)
    - Problemy na Python 3.12+ (`pkg_resources` deprecation)
  - Bezpośredni `bcrypt`
    - Haszowanie jednokierunkowe (`hashpw`)
    - Automatyczne dodawanie soli (`gensalt`)
    - Ochrona atakami kryptograficznymi (złożoność obliczeniowa)
  - Weryfikacja (`checkpw`)
    - Porównywanie w stałym czasie (Time-constant compare)
    - Zapobieganie atakom typu "Timing Attack"
```

### 4. PUŁAPKA

**Nierozumienie konieczności konwersji do bajtów!**
Programiści zapominają, że funkcje kryptograficzne `bcrypt` nie operują na literkach (stringach) tylko na strumieniach bajtów. Powszechną pułapką jest wysyłanie prosto z żądania HTTP (które jest stringiem JSON) hasła do `bcrypt.hashpw(haslo, sol)`. Zakończy się to błędem `TypeError: Unicode-objects must be encoded before hashing`. Zawsze pamiętaj o `.encode('utf-8')` przed haszowaniem i na `.decode('utf-8')` po zakończeniu, zanim wyślesz wynik do bazy PostgreSQL/SQLite jako tekst!
