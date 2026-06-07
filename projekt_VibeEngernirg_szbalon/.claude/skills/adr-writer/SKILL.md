---
name: adr-writer
description: >
  Creates or reviews Architecture Decision Records for Python projects.
  Triggers when the user says "write an ADR", "document architecture decision",
  "choose framework", or "evaluate technical options".
version: 1.0.0
---

# ADR Writer

## Goal

Create a clear Architecture Decision Record with context, alternatives and consequences.

## Use When

- A technical choice affects architecture or long-term maintenance.
- A dependency, database, auth strategy or deployment model is selected.
- An existing architectural decision changes.

## Do Not Use When

- The task is a small local implementation detail.
- The decision is already covered by an accepted ADR and is not changing.

## Inputs

- Current task from `plan.md`
- Relevant requirements from `docs/requirements.md`
- Architecture context from `docs/architecture.md`
- Existing ADRs in `docs/adr/`

## Procedure

1. Identify the decision.
2. Read relevant requirements and existing ADRs.
3. Write the context and constraints.
4. List at least two alternatives.
5. Explain why the chosen option wins. The chosen option MUST be the simplest one that
   fully satisfies the requirement. Any extra complexity it introduces (an additional
   layer, dependency, pattern, or service) must be explicitly justified in step 6 —
   "might be useful later" is not a justification (YAGNI). The ADR is the cheapest place
   to stop over-engineering before any code exists.
6. Record positive and negative consequences (including the cost of every added abstraction).
7. Record rollback or revision criteria.
8. Save the ADR as `docs/adr/NNNN-short-title.md`.
9. Add a dated entry to `plan.md` Status Log.

## Scope Discipline
You are strictly limited to writing documentation in the `docs/adr/` directory and updating `plan.md`. You are FORBIDDEN from modifying any Python source code or implementing the architectural decision yourself during this task.

## Output

- New or updated ADR.
- Status Log entry in `plan.md`.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] A new or updated ADR is written in `docs/adr/NNNN-short-title.md` format.
- [ ] You have run a terminal command `cat <adr_file_path>` to prove the file was created and contains the required structure.
- [ ] A terminal `grep -n "{{" <adr_file_path>` confirms no unresolved `{{...}}` markers remain (must return 0 hits).
- [ ] You explicitly output a summary statement: "ADR Writer complete. Generated ADR `<name>`, 0 unresolved markers remaining."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just outline the decision here in chat instead of creating a file." | **DENIED.** You must create the formal ADR markdown file in `docs/adr/`. |
| "I don't need to run grep to check for markers, I know I filled them all." | **DENIED.** You must run `grep` and paste the output as terminal proof. |
| "Since I decided on the database, I'll go ahead and update the database schema code." | **DENIED.** Scope Discipline violation! ADR Writer only documents decisions, it does NOT implement them. |

