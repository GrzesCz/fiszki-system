---
name: injection-defense
description: >
  Enforces safe construction at the moment untrusted input crosses into a dangerous sink:
  parameterized SQL (never f-string/`%`/`+`), safe path joining with an allowlisted base
  directory (anti path-traversal), no `shell=True`/`os.system` with user input, no
  `pickle`/`yaml.load`/`eval` on untrusted data, SSRF protection on outbound URLs built from
  input, and output encoding/auto-escaping when rendering user content to HTML (anti-XSS) or
  templates (anti-SSTI). Demands a malicious-input test that proves the attack is blocked.
  Triggers when code builds SQL, file paths, shell commands, HTML/templates, or outbound
  requests from external input, and when the user says "sanitize input", "prevent injection",
  "path traversal", "XSS", "render markdown".
version: 1.0.0
---

# Injection Defense (Untrusted Input → Dangerous Sink)

You are a Senior Application Security engineer. Injection happens at the boundary where
untrusted input is *used to build* a command for an interpreter — SQL, the filesystem, a
shell, an HTML renderer, a template engine, an outbound HTTP client. AI models default to the
convenient-but-fatal pattern: f-string SQL, `os.path.join(base, user_slug)` with no
containment check, `subprocess.run(cmd, shell=True)`, and dumping user Markdown into the page
as raw HTML. Your job is to make the safe construction the only construction.

**Never build an interpreter's input by concatenating untrusted data. Separate code from
data: parameterize, allowlist, encode.** Validation (reject bad input) and escaping/parameter-
ization (neutralize input) are different defenses — apply both.

## Trigger
- Code builds any of these from external input (request, file, env, DB, LLM output):
  SQL/ORM raw query, a filesystem path, a shell/subprocess command, HTML/Markdown output,
  a server-side template, an outbound URL/host.
- User says "sanitize", "prevent injection", "path traversal", "XSS", "SSRF", "render user
  content", "render markdown", "escape".

## Relationship to other skills
- `enterprise-code-auditor` *detects* these patterns with grep (triage). This skill *enforces*
  the safe pattern at write time and proves it with an attack test.
- Pairs with `api-security-enforcer` (upload filenames, request inputs) and `pydantic-security`
  (validated input boundary).

## Procedure

### STEP 1: Map untrusted input → sink
For the code in scope, list each sink and where its input comes from:
```bash
grep -rn "execute(\|f\"SELECT\|\.format(\|os.path.join\|open(\|Path(\|subprocess\|os.system\|shell=True\|pickle\|yaml.load\|eval(\|render_template_string\|innerHTML\|dangerouslySetInnerHTML\|set:html\|requests.get\|httpx" <files>
```
A sink fed by external data is in scope; a sink fed only by constants is not.

### STEP 2: SQL — parameterize, never interpolate
```python
# ❌ injection
cur.execute(f"SELECT * FROM notes WHERE owner = '{user}'")
# ✅ parameters (driver escapes)
cur.execute("SELECT * FROM notes WHERE owner = %s", (user,))
```
- Use ORM-safe APIs or bound parameters. Never `f"..."`, `%`, or `+` to build a query body.
- Identifiers (table/column names) cannot be parameterized → allowlist them against a fixed set.

### STEP 3: Filesystem — contain to an allowlisted base (anti path-traversal)
Directly relevant to slug→file resolution (e.g. `findNoteMdPath`). A slug like
`../../etc/passwd` or an absolute path must not escape the content root:
```python
from pathlib import Path
BASE = Path("src/content/notatki").resolve()

def resolve(slug: str) -> Path:
    target = (BASE / slug).resolve()
    if not target.is_relative_to(BASE):   # py>=3.9: check containment
        raise ValueError("path traversal blocked")
    return target
```
- Reject/normalize `..`, leading `/`, drive letters, and NUL bytes. Containment check is the
  authority — not a string blacklist.

### STEP 4: Shell — avoid the shell; pass argv lists
```python
# ❌ shell injection
subprocess.run(f"convert {filename} out.png", shell=True)
# ✅ no shell, argument vector
subprocess.run(["convert", filename, "out.png"], shell=False, timeout=10)
```
Prefer a library over shelling out. If a shell is unavoidable, allowlist and quote rigorously.

### STEP 5: Deserialization & dynamic eval — never on untrusted data
- No `pickle.loads`, `yaml.load` (use `yaml.safe_load`), `eval`/`exec`, or `marshal` on data
  from a request, file, network or LLM. Use JSON or an explicit schema (Pydantic) instead.

### STEP 6: Output encoding — XSS / SSTI when rendering user content
- Rendering user-controlled text to HTML: rely on the framework's **auto-escaping**; if you
  must emit HTML (e.g. Markdown → HTML), run it through a **sanitizer/allowlist**
  (e.g. `bleach`, DOMPurify, `rehype-sanitize`) — never inject raw via `innerHTML` /
  `dangerouslySetInnerHTML` / Astro `set:html` on unsanitized content.
- Never build a server-side template from user input (`render_template_string(user)`) — that
  is SSTI/RCE. Templates are code; user data is a parameter passed into a fixed template.

### STEP 7: SSRF — outbound URLs built from input
- If an outbound request target comes from user input, allowlist the host/scheme; block
  private/link-local ranges (169.254.0.0/16, 127.0.0.0/8, 10/8, 192.168/16, metadata IPs)
  and disable auto-following redirects into them.

### STEP 8: Prove it with a malicious-input test
Write a test that fires the attack payload and asserts it is neutralized:
```bash
uv run pytest <injection_test> -v   # e.g. slug "../../secret" → ValueError, not file read
```
Paste the output.

## Output Format
```markdown
### 💉 INJECTION DEFENSE — REPORT

| Sink | Input source | Defense applied | Attack test | Status |
| :-- | :-- | :-- | :-- | :-- |
| slug → file path | URL param | base-dir containment | `test_path_traversal` | ✅ blocked |

**Verdict:** DEFENDED / GAPS: [list with severity]
```

## Scope Discipline
You secure ONLY the sinks reached by untrusted input in the code in scope. You do NOT add
sanitization theatre to constant-fed sinks (that is slop — see `simplicity-gate`). You do NOT
change the feature's behavior for legitimate input while blocking the attack.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] Every untrusted→sink path in scope uses the safe construction (parameterized SQL,
      contained path, argv subprocess, safe deserializer, encoded/sanitized output, allowlisted
      outbound host) — code shown.
- [ ] At least one malicious-input test per class in scope exists and passes — `pytest -v`
      output pasted (e.g. `../../` slug rejected, `<script>` neutralized).
- [ ] No `shell=True`, `pickle.loads`, `yaml.load`, `eval`/`exec`, or raw-HTML injection on
      untrusted data remains — grep pasted.
- [ ] Agent explicitly stated: "Injection Defense complete. Sinks: [list] secured, attack
      tests green."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| :--- | :--- |
| "The input comes from our own frontend, it's safe." | **DENIED.** Anyone can call the endpoint directly. Treat all external input as hostile. |
| "f-string SQL is fine, the value is just an int." | **DENIED.** Parameterize unconditionally. 'Just an int today' becomes a string tomorrow and the habit leaks. |
| "`os.path.join` already handles the slug safely." | **DENIED.** It does NOT stop `../`. Resolve and assert containment under the allowlisted base. |
| "`shell=True` is easier than building an argv list." | **DENIED.** It opens command injection. Pass a list, `shell=False`, with a timeout. |
| "I'll render the user's Markdown as raw HTML, sanitizing is overkill." | **DENIED.** That is stored XSS. Sanitize via an allowlist (bleach/DOMPurify/rehype-sanitize). |
| "`yaml.load`/`pickle` is convenient for this payload." | **DENIED.** Both execute arbitrary code on untrusted data. Use `safe_load`/JSON/Pydantic. |
| "The attack test is unnecessary, the fix is obviously correct." | **DENIED.** Fire the payload and prove it is blocked. Unproven defense is no defense. |
