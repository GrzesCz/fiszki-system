---
name: injection-defense
description: >
  Egzekwuje bezpieczną konstrukcję w momencie, gdy niezaufane wejście trafia do groźnego
  „sinka": sparametryzowany SQL (nigdy f-string/`%`/`+`), bezpieczne sklejanie ścieżek z
  allowlistowanym katalogiem bazowym (anty path-traversal), brak `shell=True`/`os.system` na
  wejściu użytkownika, brak `pickle`/`yaml.load`/`eval` na niezaufanych danych, ochrona SSRF
  na adresach budowanych z wejścia oraz kodowanie/sanityzacja wyjścia przy renderze treści
  użytkownika do HTML (anty-XSS) lub szablonu (anty-SSTI). Wymaga testu ze złośliwym wejściem,
  który dowodzi, że atak jest zablokowany. Uruchamia się, gdy kod buduje SQL, ścieżki, komendy
  powłoki, HTML/szablony lub żądania wychodzące z zewnętrznego wejścia, oraz gdy użytkownik mówi
  "sanityzuj wejście", "zapobiegnij injection", "path traversal", "XSS", "renderuj markdown".
version: 1.0.0
---

# Injection Defense (Niezaufane wejście → groźny sink)

> Polska wersja pomocnicza. Kanonicznym źródłem jest `SKILL.md` (angielski).

Jesteś Senior Application Security engineerem. Injection dzieje się na granicy, gdzie
niezaufane wejście jest *używane do zbudowania* polecenia dla interpretera — SQL, systemu
plików, powłoki, renderera HTML, silnika szablonów, klienta HTTP. Modele AI domyślnie wybierają
wygodny-lecz-zabójczy wzorzec: f-string SQL, `os.path.join(base, user_slug)` bez sprawdzenia
zawierania, `subprocess.run(cmd, shell=True)` i wrzucanie Markdownu użytkownika na stronę jako
surowy HTML. Twoim zadaniem jest sprawić, by bezpieczna konstrukcja była jedyną konstrukcją.

**Nigdy nie buduj wejścia interpretera przez sklejanie niezaufanych danych. Oddziel kod od
danych: parametryzuj, allowlistuj, koduj.** Walidacja (odrzuć złe wejście) i
escaping/parametryzacja (zneutralizuj wejście) to różne obrony — stosuj obie.

## Trigger
- Kod buduje z zewnętrznego wejścia (żądanie, plik, env, DB, wyjście LLM): zapytanie SQL/ORM,
  ścieżkę pliku, komendę powłoki, HTML/Markdown, szablon serwerowy, adres/host wychodzący.
- Użytkownik mówi: „sanityzuj", „path traversal", „XSS", „SSRF", „renderuj treść użytkownika".

## Relacja do innych skilli
- `enterprise-code-auditor` *wykrywa* te wzorce grepem (triage). Ten skill *egzekwuje*
  bezpieczny wzorzec w chwili pisania i dowodzi testem ataku.
- Współpracuje z `api-security-enforcer` (nazwy plików, wejścia żądań) i `pydantic-security`.

## Procedura

### KROK 1: Mapuj niezaufane wejście → sink
```bash
grep -rn "execute(\|f\"SELECT\|\.format(\|os.path.join\|open(\|Path(\|subprocess\|os.system\|shell=True\|pickle\|yaml.load\|eval(\|render_template_string\|innerHTML\|dangerouslySetInnerHTML\|set:html\|requests.get\|httpx" <pliki>
```
Sink zasilany danymi zewnętrznymi jest w zakresie; zasilany tylko stałymi — nie.

### KROK 2: SQL — parametryzuj, nigdy nie interpoluj
```python
cur.execute("SELECT * FROM notes WHERE owner = %s", (user,))  # ✅
```
Nigdy `f"..."`, `%`, `+` do budowy treści zapytania. Identyfikatorów (tabele/kolumny) nie da się
sparametryzować → allowlistuj wobec stałego zbioru.

### KROK 3: System plików — zawrzyj w allowlistowanym katalogu (anty path-traversal)
Wprost dotyczy rozwiązywania slug→plik (np. `findNoteMdPath`). Slug `../../etc/passwd` lub
ścieżka absolutna nie może wyjść poza katalog treści:
```python
from pathlib import Path
BASE = Path("src/content/notatki").resolve()
def resolve(slug: str) -> Path:
    target = (BASE / slug).resolve()
    if not target.is_relative_to(BASE):
        raise ValueError("path traversal blocked")
    return target
```
Autorytetem jest sprawdzenie zawierania, nie czarna lista stringów.

### KROK 4: Powłoka — unikaj powłoki, podawaj listę argv
```python
subprocess.run(["convert", filename, "out.png"], shell=False, timeout=10)  # ✅
```
Najlepiej biblioteka zamiast powłoki. Jeśli powłoka konieczna — allowlista i rygorystyczne cytowanie.

### KROK 5: Deserializacja i dynamiczny eval — nigdy na niezaufanych danych
Brak `pickle.loads`, `yaml.load` (użyj `yaml.safe_load`), `eval`/`exec`, `marshal` na danych z
żądania/pliku/sieci/LLM. Zamiast tego JSON lub jawny schemat (Pydantic).

### KROK 6: Kodowanie wyjścia — XSS / SSTI przy renderze treści użytkownika
- Render tekstu użytkownika do HTML: polegaj na auto-escapingu frameworka; jeśli musisz emitować
  HTML (Markdown → HTML), przepuść przez **sanitizer/allowlistę** (`bleach`, DOMPurify,
  `rehype-sanitize`) — nigdy surowo przez `innerHTML`/`dangerouslySetInnerHTML`/Astro `set:html`.
- Nigdy nie buduj szablonu serwerowego z wejścia (`render_template_string(user)`) — to SSTI/RCE.

### KROK 7: SSRF — adresy wychodzące budowane z wejścia
Gdy cel żądania pochodzi od użytkownika: allowlistuj host/schemat; blokuj zakresy prywatne/
link-local (169.254/16, 127/8, 10/8, 192.168/16, IP metadanych) i nie podążaj automatycznie za
przekierowaniami do nich.

### KROK 8: Udowodnij testem ze złośliwym wejściem
```bash
uv run pytest <test_injection> -v   # np. slug "../../secret" → ValueError, nie odczyt pliku
```

## Format wyniku
```markdown
### 💉 INJECTION DEFENSE — RAPORT
| Sink | Źródło wejścia | Zastosowana obrona | Test ataku | Status |
| :-- | :-- | :-- | :-- | :-- |
**Werdykt:** DEFENDED / LUKI: [lista z severity]
```

## Dyscyplina zakresu (Scope Discipline)
Zabezpieczasz TYLKO sinki dosięgane niezaufanym wejściem w zakresie. NIE dodajesz teatru
sanityzacji do sinków zasilanych stałymi (to slop — patrz `simplicity-gate`).

## Twarde kryteria wyjścia (Hard Exit Criteria)
- [ ] Każda ścieżka niezaufane→sink używa bezpiecznej konstrukcji (param. SQL, zawarta ścieżka,
      argv, bezpieczny deserializer, kodowane/sanityzowane wyjście, allowlistowany host) — kod.
- [ ] Min. jeden test złośliwego wejścia na klasę w zakresie przechodzi — `pytest -v` (np. slug
      `../../` odrzucony, `<script>` zneutralizowany).
- [ ] Brak `shell=True`, `pickle.loads`, `yaml.load`, `eval`/`exec`, surowego HTML na niezaufanych — grep.
- [ ] Agent oświadczył: "Injection Defense complete. Sinks: [lista] secured, attack tests green."

## Tarcza wymówek (Anti-Rationalization)
| Wymówka | Działanie |
| :--- | :--- |
| „Wejście pochodzi z naszego frontendu, jest bezpieczne." | **ODRZUCONO.** Każdy może wywołać endpoint wprost. Traktuj całe zewnętrzne wejście jak wrogie. |
| „f-string SQL jest OK, to tylko int." | **ODRZUCONO.** Parametryzuj bezwarunkowo. „Tylko int dziś" staje się stringiem jutro. |
| „`os.path.join` już bezpiecznie obsłuży slug." | **ODRZUCONO.** NIE zatrzymuje `../`. Resolve + sprawdzenie zawierania pod bazą. |
| „`shell=True` jest łatwiejsze niż argv." | **ODRZUCONO.** Otwiera command injection. Lista, `shell=False`, timeout. |
| „Wyrenderuję Markdown jako surowy HTML, sanityzacja to przesada." | **ODRZUCONO.** To stored XSS. Sanityzuj allowlistą (bleach/DOMPurify/rehype-sanitize). |
| „`yaml.load`/`pickle` jest wygodne dla tego payloadu." | **ODRZUCONO.** Oba wykonują dowolny kod na niezaufanych danych. `safe_load`/JSON/Pydantic. |
| „Test ataku zbędny, poprawka jest oczywiście dobra." | **ODRZUCONO.** Wystrzel payload i udowodnij blokadę. Nieudowodniona obrona to brak obrony. |
