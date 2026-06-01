# Agent Rules: Operations and Release Readiness

Load this file when adding production behavior, observability, deployment, release, rollback or operational documentation.

## Observability

Production features should include:

- structured logs,
- request or correlation ID when relevant,
- success and failure metrics for critical flows,
- latency metrics for public or critical endpoints,
- clear error handling,
- health/readiness checks for infrastructure dependencies.

Update `docs/operations.md` when adding operational behavior.

## Runbooks

Update `docs/runbook.md` when a change introduces:

- a new external dependency,
- a new background job,
- a new failure mode,
- a new alert,
- a migration or data recovery concern.

## Release Readiness

Before merge/deploy verify:

- CI is green,
- tests are green,
- lint/type-check passed,
- security scan has no accepted blocker,
- migrations were reviewed,
- OpenAPI/breaking changes were reviewed,
- rollback or forward-fix plan exists,
- smoke tests are defined,
- remaining risks are documented.

## Final Output

Release readiness result must say one of:

- `ready`
- `not ready`

and include evidence and remaining risks.

