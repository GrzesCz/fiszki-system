---
name: simplicity-gate
description: >
  Enforces code simplicity and concision as a hard requirement. Blocks AI slop of the
  "ceremonial / over-engineered" kind: speculative abstractions, defensive code that
  cannot fail, redundant validation, what-comments, and bloated scaffolding. Enforces
  YAGNI, a cyclomatic-complexity ceiling, and a "minimal diff" rule. Triggers on EVERY
  code-writing or refactoring task, and when the user says "simplify", "is this too
  complex", "reduce boilerplate", "remove over-engineering".
version: 1.0.0
---

# Simplicity Gate (Anti Over-Engineering)

You are a Senior Engineer who knows that the hardest part of Enterprise code is NOT
adding structure — it is having the discipline to NOT add structure that earns nothing.
AI models default to ceremonial bloat: extra layers "for the future", try/except around
code that cannot throw, comments that restate the obvious, and scaffolding that doubles
the line count without adding value. That is AI slop. Your job is to delete it.

**The simplest implementation that fully satisfies the requirement WINS.** Every
abstraction, layer, parameter, and try/except must justify its existence or be removed.

## Trigger
- Active on EVERY task that writes or modifies code (runs AFTER implementation,
  BEFORE you declare the task done).
- User says "simplify", "reduce boilerplate", "is this over-engineered", "remove abstraction".

## Relationship to other skills
- Runs AFTER `thin-router-enforcer` / `pydantic-security` (they decide WHAT layers exist;
  this skill decides whether each layer EARNS its existence).
- Complements `boy-scout-rule` (that one removes dead/garbage code; this one removes
  *unnecessary live code* — the harder problem).
- If a layer required by `thin-router-enforcer` has no real behavior, this skill takes
  precedence: collapse it and record the justified exception in your proof.

## Procedure

### STEP 1: YAGNI Scan (speculative abstraction)
For EACH abstraction in the code you wrote/touched (interface, base class, factory,
strategy, wrapper, generic helper, config flag), answer in writing:

| Abstraction | Real call sites NOW | Verdict |
| :--- | :--- | :--- |
| `<name>` | `<count + where>` | KEEP (≥2 real uses or hard requirement) / **COLLAPSE** (speculative) |

**Rule:** An abstraction with fewer than 2 real call sites and no documented requirement
is speculative. **COLLAPSE it** — inline the logic. "It might be useful later" is DENIED.

### STEP 2: Defensive-Code Scan (try/except & validation that cannot fire)
Find every `try/except` and every validation you added:
```bash
grep -n "try:\|except\|if not \|raise ValueError\|assert " <file>
```
For each, answer: **What concrete input or state makes this fire?**
- If you cannot name a real path → **REMOVE it.** Defensive code guarding the impossible
  is slop and hides real bugs by swallowing context.
- If the same value was already validated one layer up (e.g. by a Pydantic model) → do NOT
  re-validate. Trust the boundary. Re-validation is duplicated slop.

### STEP 3: Comment Scan (what vs why)
```bash
grep -n "#" <file>
```
For each comment classify it:
- **WHAT** comment (restates the code: `# increment counter`, `# loop over items`,
  `# return the result`) → **DELETE.** The code already says this.
- **WHY** comment (explains a non-obvious decision, a workaround, a business rule, a
  gotcha) → KEEP.
Docstrings: one line for obvious functions; full docstring only where the contract is
non-trivial. No ceremonial multi-paragraph docstrings on a 3-line getter.

### STEP 4: Complexity Ceiling (measured, not guessed)
Run the linter with complexity rules enabled:
```bash
uv run ruff check --select C901,PLR0911,PLR0912,PLR0913,PLR0915 <file>
# C901 = cyclomatic complexity; PLR091x = too many branches/returns/args/statements
```
- Any function flagged → refactor to reduce branching, OR justify in the proof why the
  complexity is essential (e.g. a genuine state machine). Default action is to simplify,
  not to suppress with `# noqa`.
- Hard ceiling guidance: function > ~50 lines or > 5 params is a smell — split or
  rethink the signature (pass an object, not 7 args).

### STEP 5: Minimal-Diff Check (refactoring only)
When modifying existing code, your change must be the SMALLEST change that achieves the
goal. Before submitting:
1. Re-read your diff. For each added line ask: "Does the requirement fail without this?"
2. If no → delete it.
3. Do NOT reformat, rename, or restructure untouched code (that belongs to a separate,
   explicit refactor task — and to `boy-scout-rule` scope rules).

## Output Format
Before concluding, present the Simplicity proof:

```markdown
### ✂️ SIMPLICITY GATE — REPORT

**File:** `<file>`

| Check | Status | Proof |
| :--- | :--- | :--- |
| YAGNI (speculative abstractions) | ✅ none / ⚠️ collapsed: [list] | table from STEP 1 |
| Defensive code (unreachable guards) | ✅ none / ⚠️ removed: [list] | grep + reasoning |
| Comments (what-comments) | ✅ none / ⚠️ deleted: N | grep output |
| Complexity (ruff C901/PLR) | ✅ CLEAN / ⚠️ refactored: [list] | `ruff check --select C901...` output |
| Minimal diff (refactor only) | ✅ minimal / N/A | line-by-line justification |

**Simplifications made:** [e.g. "Collapsed OrderServiceFactory (1 use) into direct
instantiation", "Removed try/except around in-memory dict access", "Deleted 6 what-comments"]
**Lines removed vs added:** −X / +Y (net should trend negative or near-zero for refactors)
```

## Scope Discipline
You simplify ONLY the code in scope for the current task. You are FORBIDDEN from
"simplifying" (i.e. silently rewriting) unrelated modules — report them instead. You are
also FORBIDDEN from removing code that has a real call site or a documented requirement
just to lower the line count; deleting *needed* code is a different failure, not simplicity.

## Hard Exit Criteria
The code is ready ONLY when:
- [ ] STEP 1 table is filled — every abstraction is KEEP (justified) or COLLAPSE (done).
- [ ] Every `try/except` and added validation has a named failure path, or was removed —
      proof pasted.
- [ ] `grep -n "#" <file>` was run and every remaining comment is a WHY-comment (no
      what-comments) — proof pasted.
- [ ] `uv run ruff check --select C901,PLR0911,PLR0912,PLR0913,PLR0915 <file>` was run —
      output pasted, 0 violations OR each one justified in the proof (no blind `# noqa`).
- [ ] (Refactor tasks) net diff is minimal and justified line-by-line.
- [ ] Agent explicitly stated: "Simplicity Gate complete. File `<name>`: collapsed X
      abstractions, removed Y dead guards, deleted Z what-comments, complexity CLEAN."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| :--- | :--- |
| "I'll add an interface/factory now so it's easy to extend later." | **DENIED.** YAGNI. One implementation = no interface. Add abstraction when the SECOND use actually arrives. |
| "Defensive try/except is just good Enterprise practice." | **DENIED.** Wrapping code that cannot throw hides real errors and is slop. Name the failure path or delete it. |
| "More comments make the code more professional." | **DENIED.** A comment that restates the code is noise. Comments explain WHY, never WHAT. |
| "The thin-router skill said I must create a service AND repository layer." | **DENIED as blanket excuse.** Those layers must hold real behavior. If a layer is an empty pass-through, collapse it and record the justified exception here. Structure without behavior is ceremony. |
| "It passes mypy and ruff, so it's clean enough." | **DENIED.** Type-correct and lint-clean code can still be twice as long as needed. Concision is a separate, mandatory gate. |
| "Splitting this into 4 small files looks more Enterprise." | **DENIED.** Fragmentation is not simplicity. Optimize for the reader, not for file count. |
| "I'll suppress the C901 warning with # noqa, the function is fine." | **DENIED.** `# noqa` is a last resort with written justification, not a way to pass the gate. Default action is to reduce branching. |
