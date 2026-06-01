# Vibe Engineering Python Project Template

This directory is a starter template for new Python projects developed with an AI agent/Superpowers-style workflow at Senior Enterprise level.

## Core Files

- `agent.md` - concise global constitution for the agent.
- `plan.md` - execution plan template with phases, DoD, STOP gates and verification.
- `docs/agent/` - detailed rules loaded only when relevant.
- `.claude/skills/` - reusable process skills.
- `.claude/agents/` - optional read-only sub-agents.
- `.claude/hooks/` - deterministic quality-gate hook scripts.
- `docs/` - project-specific artifacts.
- `src/` - production code.
- `tests/` - unit, integration, contract, E2E and security tests.

## How to Start a New Project

1. Copy this directory to a new project location.
2. If your tool expects `agents.md`, `AGENTS.md` or `CLAUDE.md`, copy `agent.md` to that name.
3. Fill `plan.md` by replacing every `{{...}}` marker.
4. Fill the discovery documents:
   - `docs/product_brief.md`
   - `docs/requirements.md`
   - `docs/domain_model.md`
   - `docs/architecture.md`
   - `docs/risk_register.md`
5. Create ADRs in `docs/adr/`.
6. Only then allow implementation tasks.

## Important Rule

`plan.md` is a template until all `{{...}}` markers are replaced. The agent must not execute implementation tasks while unresolved markers remain.

## Suggested Workflow

```text
Product Brief
-> Requirements
-> Domain Model
-> Architecture
-> ADR
-> Plan
-> TDD implementation
-> Read-only review
-> Quality gate
-> Release readiness
-> Deploy / rollback readiness
```

## Progressive Disclosure

Do not put all rules into `agent.md`. Keep `agent.md` short and load detailed files only when relevant:

- `docs/agent/python_quality.md`
- `docs/agent/security_data.md`
- `docs/agent/git_context.md`
- `docs/agent/review_audit.md`
- `docs/agent/tools_orchestration.md`
- `docs/agent/operations_release.md`

## Quality Gate

After real project bootstrap, adjust:

- `scripts/quality_gate.py`
- `.claude/settings.example.json`

Then copy `settings.example.json` to the tool-specific settings file if needed.

## Human Responsibility

The AI agent helps, but the user owns the code. Every important diff must be read by a human before merge or deploy.

