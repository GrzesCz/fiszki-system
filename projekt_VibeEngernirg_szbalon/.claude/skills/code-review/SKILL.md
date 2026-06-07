---
name: code-review
description: >
  Performs read-only code review or audit for Python changes, pull requests,
  security risks, memory/resource leaks, API contracts and maintainability.
  Triggers when the user says "review code", "audit my PR", "check for security risks", "review this file".
version: 1.0.0
---

# Code Review

## Goal

Find real issues with evidence without changing production code.

## Use When

- User asks for review, audit, PR review or security review.
- Work reached a HITL review gate.
- A risky change touches auth, database, API, dependencies or architecture.

## Do Not Use When

- User explicitly asks to implement a known accepted fix.
- The review report has already been accepted and a fix plan exists.

## Inputs

- Current diff or target files.
- `plan.md`
- Relevant `docs/`.
- Existing test and CI output if available.

## Procedure

> **Relationship to other skills:** use `code-review` for a focused review of a single PR
> or file. For a full pre-commit scan across security/performance/quality/architecture use
> `enterprise-code-auditor`; for security *design* use `threat-modeling`. Avoid running all
> three on the same change — pick the one matching the scope.
>
> **Grep is triage, not proof.** Pattern scans surface candidates; they miss sophisticated
> issues and produce false positives. Confirm each finding by reading the actual code, and
> mark uncertain ones as `needs verification` rather than asserting them.

1. Enter read-only mode.
2. Identify review type: PR review, security audit, architecture review or legacy audit.
3. Inspect the relevant diff/files.
4. For each finding, collect file, line and evidence.
5. Classify severity.
6. Mark status: `real`, `false positive` or `needs verification`.
7. Suggest a fix and required test.
8. Save findings to the requested review file.
9. Do not edit production code.

## Finding Format

```markdown
### [SEVERITY] Short title
- File: `path/to/file.py:42`
- Status: real | false positive | needs verification
- Evidence: command output or short code reference
- Impact: why this matters
- Suggested fix: concrete next action
- Required test: test that proves the fix
```

## Scope Discipline
You are strictly in READ-ONLY mode for all Python source code. You are FORBIDDEN from modifying, fixing, or refactoring the code you are reviewing. Your only write access is for creating the review markdown files in the `docs/` folder.

## Output

- `docs/review.md`, `docs/audit_report.md`, `docs/security_audit.md` or requested file.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] A formal review report is written to disk in the required format.
- [ ] Every finding includes concrete evidence (line numbers, grep output).
- [ ] You have run a terminal command `cat <review_file>` to prove the report exists and has the correct format.
- [ ] You explicitly state: "Code Review complete. Generated report at `<file>`, found X issues. No production code was modified."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just fix this typo while I'm reviewing." | **DENIED.** Scope Discipline violation. Read-only means read-only. |
| "I don't need to write a file, I'll just print the findings in the chat." | **DENIED.** You must generate a formal `docs/review.md` file. |
| "I assume this function leaks memory without checking." | **DENIED.** Every finding requires evidence. Run grep or point to exact lines. |

