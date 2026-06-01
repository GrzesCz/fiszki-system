---
title: '05. Żelazne zasady Enterprise przy pracy z migracjami'
category: 'Alembic'
status: zrobione
type: notatka
hidden: true
mindmaps: []
next_review_date: '2026-06-30'
review_count: 0
---
# 05. Żelazne zasady Enterprise przy pracy z migracjami

Aby proces CI/CD (Continuous Integration / Continuous Deployment) działał płynnie, zespół programistów musi trzymać się bezwzględnych, niepisanych zasad. Oto 4 zasady, bez których projekt migracji rozpadnie się w ciągu kilku miesięcy.

---

### 1. ZWIĘZŁY KOD

```python
# ✅ IDEALNIE: Downgrade musi zawsze dokładnie cofać akcję Upgrade!
def upgrade() -> None:
    # Dodajemy kolumnę email
    op.add_column('users', sa.Column('email', sa.String(255), nullable=True))
    # Tworzymy index dla szybkości
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

def downgrade() -> None:
    # W pierwszej kolejności zdejmujemy zależność (index)
    op.drop_index('ix_users_email', table_name='users')
    # Dopiero potem usuwamy kolumnę (Kolejność ODWROTNA do upgrade!)
    op.drop_column('users', 'email')
```

### 2. METODA FEYNMANA

Wyobraźcie sobie instalatora, który montuje Wam w salonie piękny, podwieszany telewizor.
- **Zasada Pustego Downgrade (Amatorszczyzna):** Instalator (Upgrade) wywiercił dziury, powiesił telewizor, wyrzucił gruz. Po tygodniu zgłaszacie, że telewizor wisi za wysoko (Downgrade). W amatorskim podejściu instalator zdejmuje telewizor, odjeżdża i zostawia w ścianie ziejące dziury oraz kołki rozporowe. Następny telewizor nie da się już powiesić prawidłowo.
- **Zasada Skrupulatnego Downgrade (Enterprise):** Instalator ma na fakturze wpisane co do śrubki to, co zamontował. Kiedy robisz "Downgrade", instalator zdejmuje telewizor, wyciąga kołki, szpachluje dziury i maluje ścianę z powrotem na biało. Ściana wraca do idealnie oryginalnego stanu, gotowa na każdą inną modyfikację. Jeśli brakuje instrukcji w bloku `downgrade`, cofnięcie zmian zniszczy integralność bazy!

### 3. MAPA MYŚLI

```markdown
- Złote zasady pracy z Alembic
  - Symetria Downgrade
    - Zawsze odwracaj zmiany z `upgrade`
    - Pamiętaj o odwrotnej kolejności (np. najpierw Drop Index, potem Drop Column)
  - Nienaruszalność starych plików
    - Nigdy nie edytuj plików migracji, które zostały już scommitowane!
    - Błąd? Napisz kolejną migrację (Fix), zamiast cofać gita i edytować starą
  - Nadzór nad Autogenerate
    - Alembic to tylko asystent
    - Zmiana nazwy = uważaj na `drop` i `add` zamiast `alter`
  - Automatyzacja CI/CD
    - Kod backendu musi być odpalany z `alembic upgrade head`
```

### 4. PUŁAPKA

**Edycja "starej" migracji po zorientowaniu się o błędzie!**
Zrobiłeś migrację dodającą kolumnę `age` jako `String`. Wrzucasz to na GitHuba, koledzy z zespołu pobierają. Wdrażasz to na serwer testowy. Następnego dnia budzisz się i myślisz: *"Czekaj, wiek powinien być Integer!"*. Zamiast stworzyć NOWĄ migrację korygującą, wchodzisz w STARY plik migracji wygenerowany wczoraj, zmieniasz `String` na `Integer` i commitujesz. BŁĄD! Baza danych przechowuje numer wersji w tabeli `alembic_version`. Ponieważ baza u kolegów i na serwerze testowym ma zapisane, że "przeszła już" wczorajszą wersję, Alembic zignoruje Twoją poprawkę. Nigdy nie zmieni `String` na `Integer`. Zamiast tego zablokujesz mechanizm. Złota zasada: **Raz wygenerowany plik po commitcie staje się świętością i kamieniem z napisami.** Jeśli chcesz dokonać zmiany, napisz NOWĄ migrację.
