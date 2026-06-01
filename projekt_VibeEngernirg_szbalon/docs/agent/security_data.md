# Agent Rules: Security, Data and Dependencies

Load this file when working on auth, public APIs, database, secrets, dependencies, user data or external integrations.

## Data and Secrets

Always:

- treat user data as sensitive,
- mask tokens, passwords, API keys and personal data,
- keep real secrets out of the repository,
- keep `.env.example` free of real secrets,
- avoid copying secrets or PII into prompts or reports,
- stop and report if a secret appears in git-tracked files.

If a secret was committed or exposed, report that rotation is required.

## Auth and Authorization

Separate:

- authentication: who the user is,
- authorization: what the user can do.

For public endpoints consider:

- input validation,
- rate limiting,
- abuse cases,
- audit logs,
- token/session lifecycle,
- brute-force protection.

Auth/security changes require threat modeling and HITL approval.

## SQL and Data Access

Always use parameterized queries, ORM-safe APIs or approved query builders.

For database changes define:

- model changes,
- constraints,
- indexes,
- transactions,
- migrations,
- migration tests,
- rollback or forward-fix plan,
- compatibility with rolling deploy when relevant.

Never run migrations against production without explicit approval.

## Dependency and Supply Chain

Before adding a dependency:

1. Check whether the project already has a suitable tool.
2. Explain why the dependency is needed.
3. Prefer mature and maintained packages.
4. Add it through the approved dependency manager.
5. Include dependency/security scanning in verification.

Do not add a dependency to avoid a simple project-local implementation.

## Threat Modeling Output

For high-risk features write or update `docs/threat_model.md` with:

- assets,
- actors,
- entrypoints,
- trust boundaries,
- STRIDE-style risks,
- severity,
- mitigations,
- required tests.

