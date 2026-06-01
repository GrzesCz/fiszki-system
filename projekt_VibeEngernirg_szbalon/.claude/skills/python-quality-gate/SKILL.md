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
3. `uv run mypy src --strict`
4. `uv run pytest`
5. `uv run bandit -r src`
6. Search for `TODO`, `TBD`, `placeholder`, debug prints and emoji in production code.

## Scope Discipline
You are allowed to run quality commands and fix minor issues reported by them (e.g., formatting, unused imports, missing type hints). You are FORBIDDEN from rewriting architecture or core business logic just to satisfy a linter without user consent.

## Output

- Status of each check.
- Exact failing command and key error if any check fails.
- `READY TO COMMIT` only when all required checks pass.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] ALL 6 checks were executed in the terminal.
- [ ] The terminal output for EACH check is pasted into your response as proof.
- [ ] You explicitly state: "Python Quality Gate complete. All checks PASS. READY TO COMMIT." or identify which ones failed.

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll skip bandit because it takes too long." | **DENIED.** All checks in the Procedure are mandatory. |
| "I ran the tests in my head, they look fine." | **DENIED.** You must run `uv run pytest` and paste the output. |
| "I'll just ignore the mypy errors with `# type: ignore` to pass." | **DENIED.** You must fix the types or explicitly ask the user for permission to ignore. |

