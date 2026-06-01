# Agent Rules: Git Safety and Context Management

Load this file before larger changes, refactors, debugging sessions, audits, risky edits or context resets.

## Git Baseline

Before risky work, suggest a baseline commit or tag.

Before editing, inspect:

```bash
git status --short
git diff --stat
```

If the working tree contains user changes:

- do not overwrite them,
- do not revert them,
- work with them if possible,
- ask if they block the task.

Never run destructive operations such as `git reset --hard`, `git checkout --`, mass deletion or forced cleanup without explicit approval.

## Context Management

Use one goal per session.

After a major phase:

1. Update `plan.md`.
2. Record decisions in `docs/` or ADRs.
3. Summarize changed files and verification.
4. Ask the user to commit.
5. Suggest `/clear` or a fresh session if context is large.

Do not auto-compact or reset context in the middle of a hard task without approval.

## Debugging Ladder

For debugging:

1. Reproduce the issue.
2. Collect logs, stack traces and inputs.
3. Write hypotheses in `docs/debug.md` when useful.
4. Prove or disprove each hypothesis.
5. Fix the root cause, not the symptom.
6. Add a regression test.
7. Update docs, ADR, runbook or postmortem if the issue was significant.

## Postmortem Trigger

Write or update `docs/postmortem.md` when a bug:

- affected a critical flow,
- escaped tests,
- required rollback,
- exposed data,
- revealed missing monitoring.

