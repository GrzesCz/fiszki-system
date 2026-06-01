# Audit Report

Use this file for repository-wide or legacy-code audit. Audit mode is read-only until the user accepts findings and creates a fix plan.

## Scope

- Repository area: {{SCOPE}}
- Date: {{DATE}}
- Mode: read-only
- Baseline ref: {{BASELINE_REF}}

## Severity Summary

| Severity | Count |
|---|---:|
| Critical | {{COUNT}} |
| High | {{COUNT}} |
| Medium | {{COUNT}} |
| Low | {{COUNT}} |

## Findings

### {{SEVERITY}}: {{TITLE}}

- File: `{{FILE}}:{{LINE}}`
- Status: real | false positive | needs verification
- Evidence: {{EVIDENCE}}
- Problem: {{PROBLEM}}
- Impact: {{IMPACT}}
- Suggested fix: {{SUGGESTED_FIX}}
- Required test: {{REQUIRED_TEST}}
- Estimate: S | M | L

## False Positives Removed

- {{ITEM}}

## Accepted Risk

- {{RISK}}

## Next Step

Create or update `refactor_plan.md` only after user accepts this report.

