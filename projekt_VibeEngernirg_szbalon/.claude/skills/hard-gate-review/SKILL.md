---
name: Hard Gate 2x Check
description: >
  Implements a rigorous self-review and "Hard Gate" mechanism. The agent must
  perform a persona switch, answer specific adversarial questions, generate a
  structured verdict (security_ok, performance_ok, quality_ok), and meet hard
  exit criteria. On FAIL — max 1 retry, then STOP and ask the user.
---

# Hard Gate & 2x Check (Self-Review)

## Trigger
- Active on ALL tasks that involve writing or modifying code.

## Procedure

Instead of writing code and immediately considering the task "done", you MUST follow this 4-phase workflow:

### Phase 1: Implementation
1. Write the code according to the agreed-upon plan.
2. Ensure the code compiles/runs without errors.

### Phase 2: Persona Switch — Adversarial Review
1. **STOP.** You are no longer the Developer. You are now the **Independent Security & Quality Auditor**.
2. You MUST answer EACH of the following adversarial questions. Do not skip any:

| # | Adversarial Question | Your Answer (MUST fill in) |
| :--- | :--- | :--- |
| 1 | If I were a malicious actor, **what input would cause a crash or data leak?** | [Your analysis] |
| 2 | **What validation is missing?** Is every input validated before reaching the logic? | [Your analysis] |
| 3 | **Where will this code break under 1000 concurrent requests?** Is there a race condition? | [Your analysis] |
| 4 | **Are exceptions handled correctly?** Does `except` catch specific types? Does it have `exc_info=True`? | [Your analysis] |
| 5 | **Is the code resistant to Prompt Injection?** (if LLM/AI-related) Is user input sanitized? | [Your analysis / N/A] |
| 6 | **Did I remove all temporary print()/debug logs?** | [YES / NO — list] |

### Phase 3: Structured Verdict
After answering the questions, you MUST generate a verdict in EXACTLY this format:

```markdown
### 🧪 2x CHECK — VERDICT

| Dimension | Status | Rationale |
| :--- | :--- | :--- |
| 🔒 Security | ✅ OK / ❌ FAIL | [brief rationale] |
| ⚡ Performance | ✅ OK / ❌ FAIL | [brief rationale] |
| 📝 Quality | ✅ OK / ❌ FAIL | [brief rationale] |

- **Vulnerabilities Found:** [None / List of issues with severity CRITICAL/HIGH/MEDIUM/LOW]
- **Confidence:** [0.0 — 1.0] (how confident you are that the code is correct)
- **Decision:** PASS / FAIL
```

### Phase 4: Hard Gate

```
                    ┌────────────────┐
                    │  Verdict PASS? │
                    └───────┬────────┘
                     YES ───┤──── NO
                     │      │
                     ▼      ▼
                  ✅ DONE   🔁 ONE retry attempt
                             │
                             ▼
                    ┌────────────────┐
                    │  Re-run 2x     │
                    │  Check         │
                    └───────┬────────┘
                     PASS ──┤── FAIL
                     │      │
                     ▼      ▼
                  ✅ DONE   🛑 HARD GATE STOP
                             │
                             ▼
                    Ask user for guidance.
                    FORBIDDEN to continue coding.
```

**HARD GATE Rules:**
1. You are allowed exactly **ONE (1)** attempt to fix the code yourself.
2. After the fix, you MUST re-run Phase 2 and 3 (new verdict).
3. If after 1 fix the verdict is still FAIL:
   - **STOP IMMEDIATELY.**
   - Write: `🛑 HARD GATE: Code did not pass double verification after auto-fix. Stopping work. Please provide guidance.`
   - List the specific unresolved problems.
   - You are **STRICTLY FORBIDDEN** from silently ignoring issues or pushing broken code.

## Scope Discipline
When fixing code after a negative 2x Check (FAIL), you are FORBIDDEN from modifying any files other than the one you just wrote. You must not "incidentally" refactor adjacent modules or change architecture under the pretext of improving security.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] All 6 adversarial questions have explicit answers (none skipped).
- [ ] The structured verdict is generated in the format above (Security/Performance/Quality table).
- [ ] The verdict reads PASS (or PASS after 1 auto-fix).
- [ ] Agent ran tests (`pytest` or `python -c "from ... import ..."`) and pasted output as proof of correctness. If tests PASS → confidence confirmed. If no tests exist in the project → agent MUST run at minimum an import test and a startup test (`python -W all main.py --help`).
- [ ] Question #6 (debug logs) is backed by proof: output of `grep -n "print(\|breakpoint()\|pdb\." <modified_files>` → **0 hits**.
- [ ] Agent explicitly stated: "2x Check complete. Passed X/6 questions without issues, found Y problems, verdict: PASS/FAIL."

## Anti-Rationalization
| Rationalization | Action |
| --- | --- |
| "I am an advanced AI, my code is probably right the first time." | **DENIED.** AI models have documented blind spots. You MUST perform the full self-review every time. |
| "The user is waiting, I'll skip the review to be fast." | **DENIED.** Security > Speed. Hard Gate is non-negotiable. |
| "I answered 4 out of 6 questions, the rest are obvious." | **DENIED.** All 6 questions are mandatory. Skipping = procedural violation. |
| "Confidence 0.6 is good enough, the code probably works." | **DENIED.** Confidence < 0.8 requires explicit justification and potential work stoppage. |
