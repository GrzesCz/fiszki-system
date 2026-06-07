---
name: enterprise-code-auditor
description: >
  Triggers before any major code commit or on user request. Performs a rigorous,
  structured audit of security, performance, quality, and architecture. The agent
  MUST use terminal commands and grep_search to prove every finding — answering
  from memory is forbidden. Triggers when the user says "audit my code", "security
  review", "check code quality", "run enterprise audit".
version: 1.0.0

---

# Enterprise Code Auditor

## Trigger
- User says "audit", "check security", "przeanalizuj kod", "zrób audyt"
- Before committing or finalizing a major feature

## Procedure

### STEP 0: Cost Guard (Token Black Hole Prevention)
Before running any `grep` or terminal commands, you MUST check the size of the repository.
1. Run `find . -name "*.py" -not -path "*/\.*" -not -path "*/venv/*" | wc -l` (or equivalent) to count Python files.
2. If the count is **> 10 files**, you MUST STOP immediately and print the following warning:
   > "🚨 **WARNING: LARGE PROJECT DETECTED.** Running a full Enterprise Audit on this project using Dynamic Workflows or Ultra Code may consume massive amounts of tokens. Do you authorize running the full audit, or would you prefer to audit specific files using `/goal`?"
3. Proceed ONLY if the user explicitly authorizes it.

### STEP 1: Information Gathering (No Hallucination)
You MUST use `grep_search` or terminal (`grep -rn`) to actively scan the codebase for the specific patterns listed below. You are FORBIDDEN from answering from memory — every point must have terminal proof.

> **Grep is triage, not proof.** The patterns below catch naive cases (e.g. `execute(f"...")`) but miss sophisticated ones (SQL built with `.format()` two lines up, ORM filters from unsanitized input, secrets passed through a variable). A clean grep does NOT mean clean code. Where available, back the scan with real tools: `bandit -r src` (security lint), `pip-audit` (dependency CVEs), and `semgrep` with OWASP rules. Treat grep results as candidates for judgement, not verdicts.

### STEP 2: Security Audit

Scan the project using EXACTLY these patterns:

| Threat | Commands/Patterns to Search | Verdict |
| :--- | :--- | :--- |
| **SQL Injection** | `grep -rn "execute(f\"" --include="*.py"`, `grep -rn "execute(\"%" --include="*.py"`, `grep -rn "cursor.execute.*+" --include="*.py"` | FOUND / CLEAN |
| **Hardcoded Secrets** | `grep -rn "password=" --include="*.py"`, `grep -rn "api_key=" --include="*.py"`, `grep -rn "secret=" --include="*.py"`, `grep -rn "token=" --include="*.py"` | FOUND / CLEAN |
| **PII Leakage in Logs** | `grep -rn "logger.*email" --include="*.py"`, `grep -rn "logger.*password" --include="*.py"`, `grep -rn "print(.*email" --include="*.py"` | FOUND / CLEAN |
| **Prompt Injection** | `grep -rn "f\".*{user" --include="*.py"` (look for unsanitized user input injected into LLM prompts) | FOUND / CLEAN / N/A |
| **Input Validation** | `grep -rn "request\." --include="*.py"` — does request data pass through validation (Pydantic, Validators)? | OK / MISSING |

### STEP 3: Performance Audit

| Problem | Commands/Patterns to Search | Verdict |
| :--- | :--- | :--- |
| **Async Blocking** | `grep -rn "requests\." --include="*.py"`, `grep -rn "time\.sleep" --include="*.py"`, `grep -rn "open(" --include="*.py"` — look for synchronous I/O inside `async def` | FOUND / CLEAN |
| **N+1 Queries** | Manually review `for` loops in files with `session.` or `query.` — is there a DB call inside the loop body? | FOUND / CLEAN |
| **Connection Pooling** | `grep -rn "create_engine" --include="*.py"` — does it have `pool_size`, `max_overflow`? `grep -rn "NullPool" --include="*.py"` | OK / MISSING / N/A |

### STEP 4: Quality Audit

| Problem | Commands/Patterns to Search | Verdict |
| :--- | :--- | :--- |
| **Error Handling** | `grep -rn "logger.error" --include="*.py"` — does every occurrence have `exc_info=True`? `grep -rn "except:" --include="*.py"` — look for bare except | OK / ISSUES |
| **Type Hints** | `grep -rn "def " --include="*.py"` — do function signatures have argument types and return type (`-> ...`)? | OK / MISSING |
| **Print vs Logger** | `grep -rn "print(" --include="*.py"` — is production code using `print()` instead of `logger`? | OK / ISSUES |
| **Over-Engineering** | `uv run ruff check --select C901,PLR src` (complexity) + manual review: interfaces/factories with a single implementation, `try/except` with no real failure path, what-comments restating code | OK / BLOAT |

### STEP 5: Architecture Audit

| Problem | Commands/Patterns to Search | Verdict |
| :--- | :--- | :--- |
| **Layer Separation** | Do router files (files with `APIRouter`) contain business logic or SQL queries? `grep -rn "execute\|select\|insert\|update\|delete" router*.py` | OK / VIOLATION |
| **Modularity** | Are files reasonably sized? `wc -l *.py`. ~400 lines is a smell worth reviewing, NOT a hard limit — do not fragment cohesive code just to lower the count | OK / REVIEW |
| **Data Source Consistency** | Are all defined data sources (e.g., local DB + external APIs) handled? Are any missing from new endpoints? | OK / MISSING |

### STEP 6: Report — Output Format
You MUST generate the report in EXACTLY the following format (paste terminal proof under each section):

```markdown
## 🚨 SECURITY AUDIT
- 💉 SQL INJECTION: [FOUND / CLEAN] — proof: `grep output...`
- 🔐 HARDCODED SECRETS: [FOUND / CLEAN]
- 🕵️ PII LEAKAGE: [FOUND / CLEAN]
- 🤖 PROMPT INJECTION: [FOUND / CLEAN / N/A]
- 🛡️ INPUT VALIDATION: [OK / MISSING]

## ⚡ PERFORMANCE AUDIT
- ASYNC BLOCKING: [FOUND / CLEAN]
- N+1 QUERIES: [FOUND / CLEAN]
- CONNECTION POOLING: [OK / MISSING / N/A]

## 📝 CODE QUALITY AUDIT
- ERROR HANDLING (exc_info): [OK / ISSUES]
- TYPE HINTS: [OK / MISSING]
- PRINT vs LOGGER: [OK / ISSUES]

## ✂️ SIMPLICITY AUDIT
- OVER-ENGINEERING (speculative abstractions): [OK / BLOAT] — proof: `ruff --select C901,PLR ...` + notes
- DEFENSIVE CODE (unreachable guards): [OK / BLOAT]
- WHAT-COMMENTS: [OK / BLOAT]

## 🏗️ ARCHITECTURE AUDIT
- LAYER SEPARATION: [OK / VIOLATION]
- MODULARITY: [OK / OVERSIZED]
- DATA SOURCE CONSISTENCY: [OK / MISSING]

## 🔍 PROBLEMS TO FIX (sorted by severity)
1. [🔴 CRITICAL] Problem description + file + line
2. [🟡 HIGH] ...
3. [🟢 MEDIUM] ...
4. [⚪ LOW] ...
```

## Scope Discipline
Enterprise Code Auditor is designed as a read-only tool. While executing this skill, you are FORBIDDEN from modifying any source code files unless the user explicitly requests you to "fix issues found in the audit".

## Hard Exit Criteria
The audit is complete ONLY when:
- [ ] Every point in the report has terminal proof next to it (grep output or command output).
- [ ] The report is generated in the full format above (no section is skipped).
- [ ] All `CRITICAL` issues have a proposed fix.
- [ ] The agent explicitly states: "Audit complete. Scanned X files, found Y problems."

## Anti-Rationalization
| Rationalization | Action |
| --- | --- |
| "I'll just look at the code snippet the user sent." | **DENIED.** You must scan the entire project (or all changed files) with terminal commands. |
| "I don't need to check for PII, this is just a script." | **DENIED.** PII leakage check is mandatory at Enterprise level. |
| "I know this code, I don't need to grep." | **DENIED.** Your memory hallucinates. Run the command and paste the output. |
| "Architecture looks fine, I don't need to check." | **DENIED.** Architecture audit is mandatory. Verify layer separation and modularity. |
