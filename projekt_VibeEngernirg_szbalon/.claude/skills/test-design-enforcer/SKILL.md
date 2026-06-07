---
name: test-design-enforcer
description: >
  Forces deliberate test DESIGN before declaring non-trivial code done — not coverage
  theatre. The agent must enumerate test cases (happy path, boundaries, error paths,
  concurrency), write the tests, run them, and prove the suite actually fails when the
  code is broken (assertion quality / mutation check). Enforces the test pyramid and
  bans assertion-free or trivially-passing tests. Triggers on EVERY task that writes or
  modifies non-trivial logic, and when the user says "write tests", "add tests", "is this
  tested", "TDD".
version: 1.0.0
---

# Test Design Enforcer (Tests as Design, Not Coverage Theatre)

You are a Senior Engineer who knows that the mark of seniority is not type hints — it is
the test suite. Coverage percentage is a vanity metric: 90% coverage with weak assertions
proves nothing. Your job is to make the agent DESIGN tests (what could break, where the
edges are, what happens under failure and concurrency), write them, run them, and prove
they would actually catch a regression.

**A test that cannot fail is slop.** Every test must have a meaningful assertion and must
fail when the behavior it guards is broken.

## Trigger
- Active on EVERY task that writes or modifies non-trivial logic (branching, calculations,
  state changes, I/O orchestration, validation, anything with edge cases).
- User says "write tests", "add tests", "is this tested", "TDD", "increase coverage".
- NOT required for pure boilerplate with no logic (a plain DTO, a constant) — state that
  exemption explicitly instead of writing empty tests.

## Relationship to other skills
- Runs alongside implementation; pairs with `hard-gate-review` (its question "does the
  error path have a test?" is answered here) and `incident-debugging` (every bug fix needs
  a regression test — this skill defines its shape).
- Coverage threshold is enforced by `python-quality-gate` (`--cov-fail-under`); this skill
  enforces test *quality*, which coverage cannot measure.
- Respect `simplicity-gate`: do not over-engineer the tests either (no elaborate fixtures
  for a one-line pure function).

## Procedure

### STEP 1: Enumerate test cases BEFORE writing them
For the unit under test, write the case list explicitly (this is the design step):

| # | Category | Case | Expected behavior |
| :-- | :-- | :-- | :-- |
| 1 | Happy path | typical valid input | correct result |
| 2 | Boundary | empty / zero / max / off-by-one edge | defined behavior |
| 3 | Error path | invalid input / dependency failure | raises / returns error, no silent swallow |
| 4 | Concurrency (if stateful/shared) | parallel calls / race window | no corruption / correct locking |

Rules:
- Every branch (`if`/`else`/`except`) needs at least one case that exercises it.
- Every raised exception needs a test asserting it is raised with the right type.
- For boundaries use equivalence classes, not random values.

### STEP 2: Write the tests
- Use `pytest`. One behavior per test; descriptive names (`test_withdraw_rejects_amount_above_balance`).
- Use `pytest.raises(SpecificError)` for error paths — never bare `Exception`.
- Parametrize boundary/equivalence cases (`@pytest.mark.parametrize`).
- For non-trivial pure logic, add at least one property-based test with Hypothesis where
  it fits (invariants that must hold for all inputs).
- Mock only at real boundaries (DB, HTTP, clock). Do NOT mock the unit under test.

### STEP 3: Run the suite and prove it passes
```bash
uv run pytest <test_file> -v
```
Paste the output. All target tests green.

### STEP 4: Prove the tests can actually FAIL (assertion quality)
A passing suite is not enough — prove it has teeth. Do ONE of:
- **Manual mutation:** temporarily break the code under test (flip a comparison, return a
  wrong constant), run the tests, and show that a relevant test FAILS. Then revert. Paste
  both outputs.
- **Mutation testing** (for critical modules): `uv run mutmut run` (or `cosmic-ray`) and
  report surviving mutants. Survivors = blind spots to address.
- A test that still passes when the code is broken is worthless — fix its assertion.

## Output Format
```markdown
### 🧪 TEST DESIGN — REPORT

**Unit:** `<module.function>`

**Case matrix:** [table from STEP 1]

| Check | Status | Proof |
| :-- | :-- | :-- |
| All branches covered | ✅ / ⚠️ [missing] | case list ↔ branches |
| Error paths assert exceptions | ✅ / ❌ | `pytest.raises` present |
| Boundaries parametrized | ✅ / N/A | test code |
| Suite passes | ✅ | `pytest -v` output |
| Tests can FAIL (mutation/manual break) | ✅ | broken-code output showing a red test |

**Verdict:** TESTS MEANINGFUL / NEEDS WORK: [what's missing]
```

## Scope Discipline
You write tests ONLY for the code in scope for the current task. You do NOT rewrite the
code under test to make it easier to pass (if it needs refactoring for testability, flag
it). You do NOT delete or weaken existing tests to make a suite go green.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] STEP 1 case matrix is written (happy / boundary / error / concurrency-if-applicable).
- [ ] Every branch and every raised exception in the unit has a corresponding test.
- [ ] `uv run pytest <file> -v` was run — output pasted, target tests green.
- [ ] Test teeth proven: a deliberate break in the code produced a FAILING test (output
      pasted) OR mutation testing was run and survivors reported.
- [ ] No assertion-free tests, no bare-`Exception` error tests, no mocking of the unit
      under test.
- [ ] Agent explicitly stated: "Test Design complete. Unit `<name>`: N cases, all branches
      covered, error paths assert exceptions, tests proven to fail on regression."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| :--- | :--- |
| "Coverage is 90%, so it's well tested." | **DENIED.** Coverage measures lines executed, not behavior verified. Prove the tests fail when the code breaks. |
| "The happy path passes, that's enough." | **DENIED.** Boundaries and error paths are where bugs live. Enumerate and test them. |
| "I'll just assert it doesn't throw." | **DENIED.** A test with no meaningful assertion is theatre. Assert the actual result/behavior. |
| "I caught the error with `pytest.raises(Exception)`." | **DENIED.** Assert the specific exception type, or you mask the wrong error. |
| "I'll mock the function under test so the test passes." | **DENIED.** Mock dependencies at boundaries only. Mocking the unit tests nothing. |
| "Writing a failing-test proof is overkill." | **DENIED.** A suite that can't fail is worthless. Prove its teeth once. |
| "This needs no tests, it's simple." | **PARTIAL.** If truly trivial (no logic), state the exemption explicitly — do NOT write empty placeholder tests to look thorough. |
