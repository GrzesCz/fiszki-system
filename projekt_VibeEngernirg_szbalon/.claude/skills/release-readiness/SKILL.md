---
name: release-readiness
description: >
  Checks readiness for merge or deploy: CI, tests, security, migrations,
  OpenAPI changes, rollback, smoke tests, monitoring and remaining risk.
  Triggers when the user says "prepare release", "ready for deploy", "can we merge this".
version: 1.0.0
---

# Release Readiness

## Goal

Decide whether the project is ready to merge or deploy.

## Use When

- Before merge.
- Before deploy.
- After fixing Critical/High findings.
- After a phase that changes API, data, auth or infrastructure.

## Do Not Use When

- Work is still mid-phase and no release decision is needed.

## Inputs

- `plan.md`
- `docs/release_plan.md`
- `docs/risk_register.md`
- `docs/operations.md`
- CI/test/security outputs

## Procedure

1. Check all required checkboxes in the current phase.
2. Check CI result.
3. Check unit, integration, contract, E2E and security tests.
4. Check lint/type-check.
5. Check dependency/security scan.
6. Check migration and rollback plan.
7. Check API breaking changes.
8. Check smoke tests.
9. Check monitoring after deploy.
10. Record remaining risks.
11. Decide `ready` or `not ready`.

## Scope Discipline
You are in STRICT READ-ONLY mode for all source code. Your write access is restricted to updating `docs/release_plan.md` and related checklist documents. You must not fix CI pipelines or failing tests during this checklist verification.

## Output

- Updated `docs/release_plan.md`.
- Release readiness decision.
- Remaining risk list.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] All 10 procedure steps are verified.
- [ ] You have run terminal commands (e.g., `cat`, `pytest`) to verify tests and docs, and pasted the output.
- [ ] The `docs/release_plan.md` is updated and proven with `cat`.
- [ ] You explicitly state: "Release Readiness complete. Decision: READY / NOT READY. Remaining risks: [list]."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll assume CI passes because the code looks good." | **DENIED.** You must explicitly check CI logs or run local tests. |
| "I'll just quickly fix this failing test to make it ready." | **DENIED.** Scope Discipline violation! Report the failure, do not fix it. |
| "I won't write to the release plan file." | **DENIED.** The formal release decision must be documented on disk. |

