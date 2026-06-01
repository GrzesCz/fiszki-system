# Agent Rules: Review and Audit Mode

Load this file when the user asks for review, code review, audit, security review, architecture review or legacy analysis.

## Default Mode: Read-Only

Review and audit are read-only unless the user explicitly asks for fixes.

In read-only mode:

- do not edit production code,
- do not refactor,
- do not commit,
- do not install dependencies,
- write findings to `docs/review.md`, `docs/audit_report.md` or the file requested by the user.

## Review Types

| Type | Scope | Output |
|---|---|---|
| PR review | Diff and nearby affected code | `docs/pr_review.md` |
| Security audit | Security-sensitive areas | `docs/security_audit.md` |
| Architecture review | boundaries, dependencies, ADRs | `docs/architecture_review.md` |
| Legacy audit | refactor risk and technical debt | `docs/audit_report.md` |

## Finding Format

Each finding must include:

- severity,
- file and line,
- evidence from code or command output,
- impact,
- suggested fix,
- test that should prove the fix,
- status: `real`, `false positive` or `needs verification`.

## Severity Matrix

- Critical: real vulnerability, data loss, auth bypass, production outage.
- High: likely exploit, serious regression risk, data integrity risk.
- Medium: maintainability or testability issue with meaningful impact.
- Low: local cleanup, style, docs or small technical debt.

Do not inflate severity without evidence.

## Anti-Hallucination Checks

Before reporting:

- verify the file exists,
- verify the line exists,
- inspect surrounding context,
- check `.gitignore` and `git ls-files` before claiming secret leakage,
- include package name and version for dependency issues,
- mark uncertain findings as `needs verification`.

## Fix Phase

Only after the user accepts the report:

1. Create or update a separate fix/refactor plan.
2. Fix one accepted issue at a time.
3. Start with a reproducing test when possible.
4. Retest after each fix.
5. Update the report status.

