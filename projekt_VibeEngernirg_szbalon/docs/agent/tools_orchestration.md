# Agent Rules: Tools, MCP, Hooks and Sub-Agents

Load this file when using MCP, plugins, hooks, sub-agents, cross-model review, loops or external tools.

## Tool Hierarchy

Prefer in this order:

1. Trusted existing plugin, if it exactly fits.
2. Project-local skill in `.claude/skills/`.
3. CLI/script called by a skill.
4. Raw MCP only when necessary.

For team-specific procedures, create skills before creating custom plugins.

## MCP and External Tools

Treat MCP and external tools as high risk.

Rules:

- verify the source before installing,
- use least-privilege tokens,
- use fine-grained repo-scoped tokens for GitHub,
- do not send secrets or PII to external tools,
- remove or disable unused MCP servers after the task,
- tell the user if a tool may send code to a third-party API.

## Hooks

Hooks are hard gates. Prefer deterministic commands over model prompts.

If a hook fails:

- do not ignore it,
- do not bypass it without approval,
- inspect the failure,
- fix it or ask for HITL decision.

Useful hook types:

- pre-tool-use safety checks,
- post-write lint/format,
- stop/final quality gate,
- read-only guard during audit.

## Sub-Agents

Use sub-agents for narrow tasks only.

Rules:

- give one clear task,
- give a precise output file,
- reviewer sub-agents are read-only,
- no infinite recursion,
- do not create vague role agents like "backend developer",
- prefer task agents like "API security reviewer" or "migration reviewer".

Sub-agent output is evidence to review, not automatic truth.

## Cross-Model Review

Use cross-model review for high-risk changes:

- auth,
- data migrations,
- security fixes,
- large refactors,
- production incident fixes.

Write the result to a review file.

## Loops and YOLO

Do not use autonomous loops or allow-all-edits for production work.

Loops are allowed only for bounded, read-only monitoring or isolated prototypes with explicit approval.

