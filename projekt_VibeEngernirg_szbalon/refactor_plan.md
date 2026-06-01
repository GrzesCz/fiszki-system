# Refactor Plan

Use this file only after an audit/review report is accepted by the user.

## Source Report

- Report: `docs/audit_report.md`
- Accepted findings: {{FINDING_IDS}}

## Rules

1. One accepted issue at a time.
2. Test or characterization first when possible.
3. Minimal production change.
4. Retest after each fix.
5. Update source report status.
6. Stop at HITL gates.

## Fixes

- [ ] {{FINDING_ID}} TEST-RED: reproduce accepted issue.
  - File: `tests/{{TEST_FILE}}`
  - DoD: test fails for expected reason.

- [ ] {{FINDING_ID}} IMPL-GREEN: fix accepted issue.
  - File: `{{SOURCE_FILE}}`
  - DoD: reproducing test passes.

- [ ] {{FINDING_ID}} RETEST: run relevant suite.
  - Command: `{{COMMAND}}`
  - DoD: suite passes or failure is documented.

**STOP: Wait for user review before next accepted issue.**

