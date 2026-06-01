---
name: product-discovery
description: >
  Guides discovery for a new Python application before coding: business goal,
  users, MVP scope, out-of-scope, success criteria and open questions.
  Triggers when the user says "design MVP", "start a new project", "product discovery".
version: 1.0.0
---

# Product Discovery

## Goal

Turn a rough idea into a clear product brief that can drive architecture and planning.

## Use When

- Starting a new project.
- Requirements are vague.
- The agent is tempted to start coding before discovery.

## Do Not Use When

- `docs/product_brief.md` is already accepted and unchanged.

## Inputs

- User's business idea.
- Existing notes or tickets.

## Procedure

1. Identify business problem.
2. Identify users/personas.
3. Identify MVP scope.
4. Identify out-of-scope items.
5. Identify success criteria.
6. List open questions.
7. Save result to `docs/product_brief.md`.
8. Stop for HITL approval.

## Scope Discipline
You are strictly limited to updating `docs/product_brief.md` and `plan.md`. You are FORBIDDEN from writing any Python code or scaffolding the project during this discovery phase.

## Output

- `docs/product_brief.md`
- open questions in `plan.md`

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] The product brief is fully written with MVP scope defined.
- [ ] You run `cat docs/product_brief.md` to prove the file is formatted correctly.
- [ ] You explicitly ask for HITL (Human-in-the-Loop) approval before starting any implementation.
- [ ] You explicitly state: "Product Discovery complete. Waiting for HITL approval to proceed to coding."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just start writing the code skeleton to save time." | **DENIED.** Scope Discipline violation! Discovery must be approved before coding. |
| "I don't need to define out-of-scope items." | **DENIED.** Explicitly defining what is NOT built is required for MVP. |
| "I won't write it to disk, chat is enough." | **DENIED.** You must generate the formal `docs/product_brief.md` file. |

