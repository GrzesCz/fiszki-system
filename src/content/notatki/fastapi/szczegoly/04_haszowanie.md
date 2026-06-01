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

Bezpieczeństwo haseł użytkowników to jedno z fundamentalnych zagadnień każdej aplikacji webowej. W tej lekcji nauczysz się, jak prawidłowo implementować haszowanie haseł z użyciem biblioteki `bcrypt` — standardu branżowego gwarantującego odporność na ataki siłowe i kryptograficzne.

---

### 1. ZWIĘZŁY KOD

```python
# ═══════════════════════════════════════════
# Plik: src/auth/password.py
# ═══════════════════════════════════════════
import bcrypt


class PasswordHasher:
    """Centralna klasa do haszowania i weryfikacji haseł."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Haszuje hasło z automatycznie generowaną solą."""
        password_bytes = password.encode('utf-8')       # str → bytes
        salt = bcrypt.gensalt(rounds=12)                 # generowanie losowej soli
        hashed = bcrypt.hashpw(password_bytes, salt)     # haszowanie
        return hashed.decode('utf-8')                    # bytes → str (do zapisu w DB)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Sprawdza hasło w stałym czasie (ochrona przed timing attack)."""
        plain_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hashed_bytes)


# ═══════════════════════════════════════════
# Użycie w serwisie rejestracji
# ═══════════════════════════════════════════
from src.auth.password import PasswordHasher

class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def register_user(self, data: CreateUserRequest) -> None:
        hashed = PasswordHasher.hash_password(data.password)
        await self.repo.create_user(
            username=data.username,
            email=data.email,
            hashed_password=hashed   # do bazy trafia TYLKO hash
        )

    async def authenticate(self, username: str, password: str) -> User | None:
        user = await self.repo.get_by_username(username)
        if not user:
            return None
        if not PasswordHasher.verify_password(password, user.hashed_password):
            return None
        return user
```

### 2. METODA FEYNMANA

Wyobraź sobie **przepis na ciasto**.

- **Haszowanie** to wrzucenie przepisu (hasła) do potężnego blendera i zmielenie na jednolitą, gęstą papkę (hash). Nawet najlepszy kucharz świata nie zdoła z tej papki wyciągnąć z powrotem całych jajek i nienaruszonej mąki. Jeśli ktoś ukradnie z bazy naszą papkę — nigdy nie odtworzy oryginalnego przepisu (hasła).

- **Sól (Salt)** to dodatkowe zabezpieczenie. Wyobraź sobie, że dwóch klientów ma takie same hasło `password123`. Bez soli ich papki w bazie wyglądałyby identycznie — haker od razu by wiedział, że mają to samo hasło. Sól to dodanie losowej szczypty unikalnej przyprawy (cynamonu do jednego, chili do drugiego) **tuż przed** włączeniem blendera. Dzięki temu papki obu klientów wyglądają kompletnie inaczej, chociaż rdzeń hasła był ten sam. Funkcja `bcrypt.gensalt()` robi to za nas automatycznie.

- **Porównywanie w stałym czasie** — dlaczego to ważne? Wyobraź sobie strażnika, który sprawdza hasło litera po literze. Jeśli pierwsza litera się nie zgadza, mówi "NIE" natychmiast. Jeśli pasuje, przechodzi do drugiej i tak dalej. Sprytny haker mierzy czas odpowiedzi i na tej podstawie zgaduje hasło litera po literze! Funkcja `bcrypt.checkpw()` zawsze sprawdza **całe** hasło, niezależnie od tego, w którym miejscu się pomylisz — zawsze odpowiada w tym samym czasie.

### 3. MAPA MYŚLI

```
Bezpieczeństwo haseł w FastAPI
├── Haszowanie jednokierunkowe
│   ├── Hash → nie da się odwrócić do oryginału
│   ├── bcrypt.hashpw() — generuje hash
│   └── Złożoność obliczeniowa (rounds=12) spowalnia ataki brute-force
├── Sól (Salt)
│   ├── Losowa wartość dodawana przed haszowaniem
│   ├── bcrypt.gensalt() — generuje automatycznie
│   └── Gwarantuje unikalność hashów nawet dla identycznych haseł
├── Weryfikacja
│   ├── bcrypt.checkpw() — porównanie w stałym czasie
│   └── Ochrona przed atakami typu Timing Attack
└── Konwersja typów (kluczowe!)
    ├── .encode('utf-8') — str → bytes (przed haszowaniem)
    └── .decode('utf-8') — bytes → str (przed zapisem do DB)
```

### 4. PUŁAPKA

**Zapomnienie o konwersji str ↔ bytes!**

Funkcje kryptograficzne `bcrypt` operują wyłącznie na bajtach, a nie na tekście. Bardzo częsty błąd to przekazanie hasła prosto z żądania HTTP (które jest stringiem) do `bcrypt.hashpw(haslo, sol)`. Zakończy się to natychmiastowym błędem:

```
TypeError: Unicode-objects must be encoded before hashing
```

Dlatego **zawsze** pamiętaj o dwóch konwersjach:
- `.encode('utf-8')` **przed** haszowaniem (str → bytes)
- `.decode('utf-8')` **po** haszowaniu, zanim zapiszesz hash do bazy jako tekst (bytes → str)

Wydzielenie tych operacji do osobnej klasy `PasswordHasher` eliminuje ten problem raz na zawsze — konwersja jest wbudowana i nie musisz o niej pamiętać w każdym endpointcie.
