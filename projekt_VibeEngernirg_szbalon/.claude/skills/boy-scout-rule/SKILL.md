---
name: Boy Scout Rule
description: >
  Enforces the "Boy Scout Rule" — on EVERY file modification the agent MUST: run
  a linter from terminal, scan the file for specific technical debt patterns, fix
  found issues, verify the module imports cleanly, and remove all temporary logs.
  ZERO tolerance for NameError.
---

# Boy Scout Rule

## Trigger
- Active ALWAYS when you edit or modify ANY `.py` file for ANY reason — even a single line.

## Procedure

### STEP 1: Mandatory Linter from Terminal
You MUST run a linter on EVERY file you modify. Use the command appropriate for the project:
```bash
# Preferred (if project uses uv + ruff):
uv run ruff check <path_to_file.py>

# Alternatively:
ruff check <path_to_file.py>
flake8 <path_to_file.py>
```
**Paste the linter output** in your response as proof.

### STEP 2: Scan for Specific Technical Debt Patterns
You MUST scan the modified file for EACH of these patterns:

| # | Pattern | Grep Command | What to Do if Found |
| :--- | :--- | :--- | :--- |
| 1 | **Missing `exc_info=True`** | `grep -n "logger.error\|logger.exception" <file>` | Add `exc_info=True` to every `logger.error()` in an `except` block |
| 2 | **Bare `except:`** | `grep -n "except:" <file>` | Replace with `except Exception as e:` or a specific type |
| 3 | **Unused imports** | Linter (ruff/flake8) — look for F401 | Remove unused imports |
| 4 | **Unused variables** | Linter — look for F841 | Remove or prefix with `_` |
| 5 | **Print instead of logger** | `grep -n "print(" <file>` | Replace `print()` with appropriate `logger.info/debug/warning` |
| 6 | **Temporary debug logs** | `grep -n "#region agent\|open(\"debug\|# DEBUG\|# TODO: remove\|# HACK" <file>` | Remove UNCONDITIONALLY before submitting code |
| 7 | **Missing type hints** | `grep -n "def " <file>` — do signatures have `->` and typed arguments? | Add typing (at minimum `-> None` and argument types) |
| 8 | **Magic numbers/strings** | Look for repeated literals (e.g., `"production"`, `3600`, `"admin"`) | Extract to a constant (`CACHE_TTL = 3600`) |

### STEP 3: Mandatory Import Test
After every modification, you MUST run an import test in terminal:
```bash
python -c "from <module.path> import <class_or_function>"
```
**Goal:** Ensure the modification did not introduce `NameError`, `ImportError`, or `SyntaxError`.
**ZERO tolerance for `is not defined`** — if the import test fails, FIX IMMEDIATELY before proceeding.

### STEP 4: Startup Verification (for key files)
If you modify an entry point (`main.py`, `app.py`, `__init__.py`) or configuration file:
```bash
python -W all <entry_file.py> --help  # or another safe startup mode
```
Check that:
- The application starts without `NameError`/`ImportError`
- There are no `DeprecationWarning` warnings caused by your code

### STEP 5: Cleanliness — Final Check
Before submitting code, scan one final time:
```bash
grep -n "print(\|breakpoint()\|pdb\.\|# TODO: remove\|# HACK\|#region agent" <file>
```
If ANYTHING is found — **REMOVE IT**. No exceptions.

## Output Format
Before concluding the task, you MUST present the Boy Scout proof:

```markdown
### ⛺ BOY SCOUT RULE — REPORT

**File:** `<filename.py>`

| Step | Status | Proof |
| :--- | :--- | :--- |
| Linter | ✅ CLEAN / ⚠️ X errors fixed | `uv run ruff check ...` → output |
| Debt patterns | ✅ CLEAN / ⚠️ Fixed: [list] | grep output |
| Import test | ✅ PASS / ❌ FAIL | `python -c "from ... import ..."` → output |
| Cleanliness (debug logs) | ✅ CLEAN | grep output |

**Boy Scout Fixes:** [list of minor fixes, e.g., "Added exc_info=True on line 45", "Removed unused import os"]
```

## Scope Discipline
The Boy Scout Rule applies EXCLUSIVELY to the file you are currently editing. You are STRICTLY FORBIDDEN from expanding the refactoring (scope creep) to other files in the project. If you notice technical debt in another file, simply report it to the user, but DO NOT EDIT IT.

## Hard Exit Criteria
The file is ready for submission ONLY when:
- [ ] Linter was run from terminal and output is pasted as proof.
- [ ] All 8 technical debt patterns were checked (each individually — with grep output).
- [ ] Import test (`python -c`) passes cleanly (0 errors) — output pasted as proof.
- [ ] ZERO temporary logs — proof: output of `grep -n "print(\|breakpoint()\|pdb\.\|#region agent" <file>` → **0 hits**.
- [ ] Boy Scout Report is generated in the format above (table with proofs).
- [ ] Agent explicitly stated: "Boy Scout Rule complete. File `<name.py>`: fixed X issues, linter PASS, import PASS, 0 temporary logs."

## Anti-Rationalization
| Rationalization | Action |
| --- | --- |
| "I'm just fixing a typo, I don't need to run a linter." | **DENIED.** The rule applies to EVERY modification — even 1 line. Run the linter. |
| "The linter found 20 errors, but they were there before I touched the file." | **DENIED.** If you touched the file, you are responsible for cleaning up the mess. Fix the errors. |
| "The import test will take too long." | **DENIED.** The test takes 2 seconds. Run `python -c` and prove the import works. |
| "I'll leave this print(), it will help me debug later." | **DENIED.** ZERO tolerance for print() in production code. Replace with logger or remove. |
| "Type hints are not required in this project." | **DENIED.** At Enterprise level, typing is MANDATORY. Add at minimum argument types and return type. |
