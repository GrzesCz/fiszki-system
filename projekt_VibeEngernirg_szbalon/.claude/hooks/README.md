# Hooks

This directory is for deterministic quality gates.

Recommended hooks:

- pre-tool-use guard for destructive commands,
- post-write lint/format for changed Python files,
- stop hook running quality gate,
- read-only guard during audits.

Prefer scripts over prompt-based hooks.

