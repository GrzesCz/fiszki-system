---
name: incident-debugging
description: >
  Guides systematic debugging for Python issues: reproduce, observe,
  hypothesize, prove/disprove, fix root cause, regression test and postmortem.
  Triggers when the user says "debug this error", "fix the failing test", "investigate production incident".
version: 1.0.0
---

# Incident Debugging

## Goal

Fix the root cause without guessing and prevent recurrence.

## Use When

- Tests fail.
- Runtime error occurs.
- Production-like incident needs analysis.
- Agent is guessing or repeating failed fixes.

## Do Not Use When

- The issue is already reproduced, root-caused and covered by an accepted fix plan.

## Inputs

- Stack trace or logs.
- Reproduction steps.
- Current code and tests.

## Procedure

1. Reproduce.
2. Observe logs/trace/input.
3. Write hypotheses to `docs/debug.md`.
4. Prove or disprove each hypothesis.
5. Fix root cause.
6. Add regression test. Design it per `test-design-enforcer`: it MUST reproduce the bug
   (fail on the old code) and pass on the fix — prove both. A regression test that passes
   without the fix guards nothing.
7. Update `docs/postmortem.md` if significant.

## Scope Discipline
You are allowed to read code, write debugging docs, modify the specific file containing the bug, and add a regression test. You are FORBIDDEN from guessing fixes and pushing them without first proving the hypothesis. You must not refactor unrelated code.

## Output

- `docs/debug.md`
- regression test
- optional `docs/postmortem.md`

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] Hypothesis and root cause are formally documented.
- [ ] A regression test is written and executed.
- [ ] You have run `pytest <test_file>` and pasted the output proving the test passes.
- [ ] You explicitly state: "Incident Debugging complete. Bug fixed, regression test PASS."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'm sure I know what the bug is, I'll just fix it directly." | **DENIED.** You must write down the hypothesis and prove it with a test before fixing. |
| "I can't run tests here, I'll just assume it works." | **DENIED.** You must write a script or a test and run it in the terminal to prove the fix. |
| "While fixing this bug, I'll also rewrite this old function." | **DENIED.** Scope Discipline violation! Fix only the bug. |

