---
name: api-contract-review
description: >
  Designs or reviews API contracts: versioning, request/response schemas,
  status codes, error format, idempotency and contract tests.
  Triggers when the user says "design API", "review API contract", "check OpenAPI specs".
version: 1.0.0
---

# API Contract Review

## Goal

Make API behavior explicit and testable before implementation or release.

## Use When

- Adding or changing public API.
- Preparing OpenAPI review.
- Adding contract tests.

## Do Not Use When

- The change is internal and has no API surface.

## Inputs

- `docs/api_contract.md`
- `docs/requirements.md`
- Current API code if it exists

## Procedure

1. Check API versioning.
2. Check request schemas.
3. Check response schemas.
4. Check status codes.
5. Check error format.
6. Check idempotency for write operations.
7. Check pagination/filtering/sorting for collections.
8. Add required contract tests to `plan.md`.
9. Update `docs/api_contract.md`.

## Scope Discipline
You are restricted to reading API code and updating documentation in `docs/api_contract.md` and `plan.md`. You are STRICTLY FORBIDDEN from implementing or modifying the actual API endpoints in Python code during this task.

## Output

- Updated `docs/api_contract.md`
- Contract test tasks in `plan.md`

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] A formal contract review is written in `docs/api_contract.md`.
- [ ] You have run `cat docs/api_contract.md` or a similar command to prove the file was updated.
- [ ] Required contract test tasks are explicitly added to `plan.md`.
- [ ] You explicitly state: "API Contract Review complete. Output generated in docs/api_contract.md and plan.md updated."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "The code uses FastAPI, it's self-documenting, I don't need a markdown contract." | **DENIED.** Explicit contracts in docs are required before implementation. |
| "I'll just fix the endpoint since I noticed a missing 404 handler." | **DENIED.** Scope Discipline violation! You only review/design, you do not implement. |
| "I won't run terminal proof, the user can see my response." | **DENIED.** Terminal proof is non-negotiable. |

