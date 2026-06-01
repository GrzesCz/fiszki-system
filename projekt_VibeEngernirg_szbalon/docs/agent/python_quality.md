# Agent Rules: Python Quality and TDD

Load this file when editing Python code, tests, project tooling or quality gates.

## Technical Standard

Default standards:

- `uv` for dependency management and commands.
- `pyproject.toml` for project configuration.
- committed `uv.lock`.
- `ruff` for formatting and linting.
- `mypy --strict` or an approved equivalent for type checking.
- `pytest` for tests.
- `pytest-asyncio` for async code.
- `pydantic-settings` for configuration.

Do not introduce a second dependency manager, formatter or test runner without an ADR and user approval.

## Code Quality

Always:

- write typed function arguments and return values,
- keep domain logic outside HTTP handlers,
- isolate infrastructure from domain logic,
- avoid global mutable state,
- use domain-specific exceptions where useful,
- keep functions small and readable,
- write comments only to explain why, not what,
- write docstrings for public APIs, public classes and non-trivial domain logic.

Never leave in production code:

- `TODO`
- `TBD`
- `placeholder`
- dead code
- debug prints
- emoji

## TDD

For business logic:

1. Write a RED test.
2. Run it and verify it fails for the expected reason.
3. Write the minimum GREEN implementation.
4. Run the test again.
5. Refactor only after the test is green.
6. Run the relevant test set again.

If you cannot write a test first, explain why and ask for HITL approval.

## Test Scope

Use the right test level:

- unit tests for pure domain logic,
- integration tests for database/cache/external adapters,
- contract tests for API contracts,
- E2E tests for critical user flows,
- security tests for auth/input/injection risks,
- migration tests for database changes.

## Beyonce Rule

If a behavior matters, it needs a test.

Every bug fix needs a regression test or an explicit reason why the test cannot be added now.

## Chesterton's Fence

Do not remove code, tests, configuration or dependencies until you understand why they exist.

Before deleting:

1. Check usages.
2. Check tests.
3. Check docs or git history when useful.
4. Explain why deletion is safe.

If you cannot explain it, ask or record the risk.

## Small Changes

Prefer small commits and small PRs.

Do not combine:

- new feature,
- refactor,
- style cleanup,
- dependency change,
- migration,
- security change

unless the plan explicitly groups them.

## Anti-Rationalization

| Excuse | Required response |
|---|---|
| "This is too small for a test." | Add or run an appropriate test. |
| "Tests can come later." | Write the test now or ask for explicit approval. |
| "The code works." | Show evidence: test, log, build or CI. |
| "This refactor is too big for tests." | Add characterization tests or split the refactor. |
| "This code looks unused." | Prove it before deleting. |

