---
name: python-quality-gate
description: >
  Runs strict Python quality checks before commit or phase completion:
  ruff format, ruff check, mypy, pytest, bandit and anti-slop scan.
  Triggers when the user says "run quality checks", "check before commit", "run linter and tests".
version: 1.0.0
---

# Python Quality Gate

## Goal

Provide deterministic evidence that code is ready for review.

## Use When

- Before commit.
- Before HITL phase approval.
- Before release readiness.
- After refactor or security fix.

## Do Not Use When

- Tooling is not bootstrapped yet; then create a setup task first.

## Procedure

Run in this order:

1. `uv run ruff format --check src tests`
2. `uv run ruff check src tests`
3. `uv run ruff check --select C901,PLR0911,PLR0912,PLR0913,PLR0915 src` (complexity ceiling: cyclomatic complexity, too many branches/returns/arguments/statements). Violations must be refactored, not silenced with `# noqa` (a `# noqa` is allowed only as a last resort with a written justification).
4. `uv run mypy src --strict`
5. `uv run pytest --cov=src --cov-fail-under=80` (tests + coverage threshold; adjust the threshold per project policy, but never disable it)
6. `uv run bandit -r src`
7. `uv run pip-audit` (known CVEs in dependencies — bandit does NOT cover this)
8. Anti-slop scan: search for `TODO`, `TBD`, `placeholder`, debug prints and emoji in production code, AND for ceremonial slop — what-comments (comments that merely restate the code) and stub multi-paragraph docstrings on trivial functions.

> **Note on grep/scan checks:** pattern scans are triage, not proof of correctness. `bandit`, `pip-audit`, `mypy` and the complexity selector do the real measuring; the text scan in step 8 only flags candidates for human/agent judgement.

## Scope Discipline
You are allowed to run quality commands and fix minor issues reported by them (e.g., formatting, unused imports, missing type hints). You are FORBIDDEN from rewriting architecture or core business logic just to satisfy a linter without user consent.

## Output

- Status of each check.
- Exact failing command and key error if any check fails.
- `READY TO COMMIT` only when all required checks pass.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] ALL 8 checks were executed in the terminal.
- [ ] The terminal output for EACH check is pasted into your response as proof.
- [ ] Complexity (step 3), coverage threshold (step 5) and `pip-audit` (step 7) all pass, or each failure is explicitly reported.
- [ ] You explicitly state: "Python Quality Gate complete. All checks PASS. READY TO COMMIT." or identify which ones failed.

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll skip bandit because it takes too long." | **DENIED.** All checks in the Procedure are mandatory. |
| "I ran the tests in my head, they look fine." | **DENIED.** You must run `uv run pytest` and paste the output. |
| "I'll just ignore the mypy errors with `# type: ignore` to pass." | **DENIED.** You must fix the types or explicitly ask the user for permission to ignore. |
| "It passes mypy and ruff, so it's clean enough." | **DENIED.** Type-correct and lint-clean code can still be twice as long as needed. Concision and over-engineering are a separate mandatory gate — run `simplicity-gate`. |
| "I'll silence the C901 complexity warning with `# noqa`." | **DENIED.** Default action is to reduce branching/refactor. `# noqa` requires written justification, not convenience. |

