---
name: database-migration-review
description: >
  Reviews database schema changes, migrations, indexes, constraints,
  transactions, rollback/forward-fix strategy and migration tests.
  Triggers when the user says "review migration", "check database schema", "validate indexes", "review sql".
version: 1.0.0
---

# Database Migration Review

## Goal

Reduce production risk from database changes.

## Use When

- Schema changes.
- New indexes or constraints.
- Data migrations.
- Changes to source-of-truth or transaction behavior.

## Do Not Use When

- The change is pure application code and does not affect data shape or persistence.

## Inputs

- Migration files
- Data/storage ADR
- `docs/architecture.md`
- Current plan task

## Procedure

1. Identify schema/data changes.
2. Check constraints and indexes.
3. Check transaction boundaries.
4. Check backward compatibility.
5. Check rollback or forward-fix plan.
6. Check migration tests.
7. Update `docs/risk_register.md` for migration risks.

## Scope Discipline
You are strictly reviewing the database schemas and migrations (read-only for SQL/Python files). You may write findings to `docs/review.md` or `docs/risk_register.md`. You are FORBIDDEN from applying the migrations to the database or modifying the migration files yourself.

## Output

- Review notes in `docs/review.md` or migration-specific report.
- Updated risk register if needed.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] A formal review report is written or risk register is updated.
- [ ] You run a terminal command `cat <file>` to prove the output was generated.
- [ ] You verified that rollback/forward-fix is documented.
- [ ] You explicitly state: "Database Migration Review complete. Output in `<file>`. X risks identified."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just add the missing index to the migration file myself." | **DENIED.** Scope Discipline violation! Report the issue, do not fix it. |
| "I'll run the migration to see if it works." | **DENIED.** You are a reviewer, not the executor. Do not alter the DB state. |
| "I won't write the report to disk, it's just one missing constraint." | **DENIED.** All reviews must be formally documented as per Output rules. |

