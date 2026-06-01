---
name: observability-check
description: >
  Checks whether a production feature has logs, metrics, request IDs,
  health/readiness checks and enough diagnostic signal for operations.
  Triggers when the user says "add logging", "check observability", "monitor this endpoint", "add metrics".
version: 1.0.0
---

# Observability Check

## Goal

Make production behavior diagnosable before release.

## Use When

- Adding a public endpoint.
- Adding a critical business flow.
- Adding a background job, integration, database or cache dependency.
- Preparing release readiness.

## Do Not Use When

- The change is documentation-only and does not affect runtime behavior.

## Inputs

- Current task from `plan.md`
- `docs/operations.md`
- `docs/runbook.md`
- Relevant code paths

## Procedure

1. Identify critical user or system flows.
2. Check structured logs for success and failure paths.
3. Check request/correlation ID propagation.
4. Check metrics for success, failure and latency.
5. Check health/readiness if infrastructure dependencies are added.
6. Check error handling and log safety.
7. Update `docs/operations.md`.
8. Update `docs/runbook.md` if a new failure mode exists.

## Scope Discipline
You are allowed to add logging, metrics, and tracing code to the specific modules requested. You are FORBIDDEN from altering the core business logic or changing the behavior of the application while adding observability.

## Output

- Updated operational docs.
- List of missing observability items, if any.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] Logging/metrics are implemented without changing business logic.
- [ ] You have run the application/test and pasted a terminal log sample proving that structured logs/metrics are generated correctly.
- [ ] You explicitly state: "Observability Check complete. Logs/metrics added, tested and proven in terminal."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "The framework logs requests anyway, I don't need to add anything." | **DENIED.** Custom business flow logs and metrics are required for observability. |
| "I don't know how to run the app to get a log sample." | **DENIED.** Write a short test script and run it via `python -c` to generate the log output. |
| "I'll use print() for logging, it's easier." | **DENIED.** You must use the project's structured logging library (e.g., `logging`, `structlog`). |

