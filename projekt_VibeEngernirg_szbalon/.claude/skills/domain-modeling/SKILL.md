---
name: domain-modeling
description: >
  Builds or reviews a domain model for Python applications: entities, value
  objects, aggregates, business rules and edge cases.
  Triggers when the user says "design domain model", "define entities", "model business rules", "what is the domain".
version: 1.0.0
---

# Domain Modeling

## Goal

Define domain concepts before implementation.

## Use When

- Starting architecture phase.
- Adding complex business logic.
- Requirements mention rules, states, lifecycle or invariants.

## Do Not Use When

- The task is infrastructure-only and does not affect business rules.

## Inputs

- `docs/product_brief.md`
- `docs/requirements.md`
- Existing domain code, if any

## Procedure

1. Extract domain terms.
2. Define entities.
3. Define value objects.
4. Define aggregates.
5. Define invariants.
6. Define edge cases.
7. Record unresolved domain questions.
8. Save to `docs/domain_model.md`.

## Scope Discipline
You are strictly limited to creating and updating markdown documentation (`docs/domain_model.md`). You are FORBIDDEN from generating or modifying Python classes, Pydantic models, or SQLAlchemy entities during this task.

## Output

- Updated `docs/domain_model.md`
- Open questions in `plan.md`

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] A formal domain model is written to `docs/domain_model.md`.
- [ ] You have run a terminal command `cat docs/domain_model.md` to prove the file was created and structured correctly.
- [ ] You explicitly state: "Domain Modeling complete. Output generated in docs/domain_model.md."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just write the Pydantic models since I defined the entities." | **DENIED.** Scope Discipline violation! Domain modeling is purely conceptual documentation. |
| "The requirements are simple, we don't need a formal model." | **DENIED.** If this skill was triggered, the user wants the formal model written to disk. |
| "I won't write it to a file, I'll just explain it in chat." | **DENIED.** You must generate `docs/domain_model.md`. |

