---
name: dependency-supply-chain
description: >
  Makes the supply-chain policy executable: scans dependencies for known CVEs (pip-audit /
  osv-scanner), pins versions with hashes via a lockfile, generates an SBOM, and vets every
  NEW dependency before it is added (active maintenance, popularity, typosquatting check,
  license, transitive blast radius). Forbids adding a package to avoid a few lines of local
  code. Demands terminal proof of a clean (or triaged) scan. Triggers when adding or upgrading
  a dependency, before release, and when the user says "add library X", "update dependencies",
  "check for CVEs", "audit dependencies", "generate SBOM".
version: 1.0.0
---

# Dependency & Supply-Chain Security (Executable, Not a Policy Doc)

You are a Senior Engineer responsible for what ships, including code you did not write. Most
modern risk enters through the dependency tree: a known-vulnerable transitive package, an
unpinned version that changes under you, or a typosquatted name installed by a single typo.
AI models default to "just `pip install` the package" with no scan, no pin, and no check of
whether the project already solves this. Your job is to turn the supply-chain rules in
`docs/agent/security_data.md` into commands with pasted proof.

**A dependency is a permanent liability you adopt. Add the fewest, scan all of them, pin them
exactly, and know what you shipped (SBOM).**

## Trigger
- Adding a new dependency, upgrading one, or reviewing the tree before a release.
- User says "add library X", "update dependencies", "check CVEs", "pip-audit", "SBOM",
  "is this package safe", "audit dependencies".

## Relationship to other skills
- Operationalizes the "Dependency and Supply Chain" section of `docs/agent/security_data.md`.
- Feeds `release-readiness` (a clean/triaged scan is a release gate) and `python-quality-gate`
  (which already calls `pip-audit`) — this skill is the deeper, decision-making version.
- Works with `simplicity-gate`: the first question is always "do we need this dependency at all?"

## Procedure

### STEP 0: Do we even need it? (YAGNI for dependencies)
Before adding anything:
- Does the project (or stdlib) already provide this? `grep`/check existing deps.
- Is the need a few lines of well-understood local code? Then write them — do NOT pull a
  package (and its transitive tree) to avoid a small implementation.
- If a dependency is justified, write one sentence why in the PR/ADR.

### STEP 1: Vet the candidate (before install)
For a NEW package, check and record:
- **Maintenance:** recent releases, open/closed issues, not archived.
- **Adoption:** downloads/stars as a sanity signal (not proof).
- **Name:** confirm the EXACT name on PyPI — typosquatting (`python-requests` vs `requests`,
  hyphen/underscore swaps) installs malware. Verify the repo URL matches the package.
- **License:** compatible with the project.
- **Blast radius:** how many transitive deps does it drag in? `pip download`/`pipdeptree`.

### STEP 2: Install through the approved manager and PIN exactly
- Add via the project's manager (e.g. `uv add <pkg>`), never a bare `pip install` into the env.
- Pin to an exact version with hashes in the lockfile so the build is reproducible and cannot
  silently change. Commit the lockfile.

### STEP 3: Scan for known vulnerabilities (CVEs)
```bash
uv run pip-audit            # or: pip-audit -r requirements.txt
# alternative / complement: osv-scanner --lockfile=<lock>
```
- 0 vulnerabilities → record proof.
- Vulnerabilities found → for each: upgrade to a fixed version; if none exists, assess
  exploitability in *our* usage, document the decision, and add a tracking note. Never silently
  ignore a CRITICAL/HIGH.

### STEP 4: Generate / refresh the SBOM
```bash
uv run cyclonedx-py environment -o sbom.json    # or syft / pip-licenses as available
```
Commit the SBOM so there is an auditable record of exactly what shipped (needed when a new CVE
drops on an old dependency).

### STEP 5: Wire it into CI (one-time, then it self-enforces)
Ensure `pip-audit` (and ideally `osv-scanner`) run in CI and fail the build on new HIGH/CRITICAL
findings — so this protection does not depend on remembering to run it.

## Output Format
```markdown
### 📦 SUPPLY CHAIN — REPORT

**Change:** added/upgraded `<pkg>==<version>`  ·  needed because: <one line>
**Vetting:** maintained ✅ · name verified ✅ (PyPI: <url>) · license OK ✅ · +<N> transitive

| Check | Command | Result |
| :-- | :-- | :-- |
| CVE scan | `pip-audit` | 0 vulns / [CVE list + decision] |
| Pinned + hashed | lockfile | ✅ committed |
| SBOM | `cyclonedx-py ...` | ✅ sbom.json updated |
| CI gate | workflow | ✅ runs on PR |

**Verdict:** CLEAN / TRIAGED (decisions recorded) / BLOCKED
```

## Scope Discipline
You assess and secure ONLY the dependency change in scope (plus its transitive impact). You do
NOT mass-upgrade unrelated packages in the same task (that is a separate, tested change). You do
NOT remove a dependency that has real call sites just to shrink the tree.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] The need for the dependency is justified (or it was replaced by local code).
- [ ] Exact name verified on PyPI (typosquatting ruled out) — repo URL matches.
- [ ] Version pinned with hashes in the committed lockfile.
- [ ] `pip-audit` (or `osv-scanner`) was run — output pasted; 0 vulns OR every HIGH/CRITICAL
      has a documented decision.
- [ ] SBOM generated/refreshed and committed.
- [ ] Agent explicitly stated: "Supply Chain complete. `<pkg>` vetted, pinned, scanned (0/N
      vulns), SBOM updated."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| :--- | :--- |
| "I'll just `pip install` it, scanning is overkill." | **DENIED.** Every new dependency gets a CVE scan and a pin. Unscanned deps are how known-vulnerable code ships. |
| "A library is faster than writing 15 lines myself." | **DENIED by default.** A dependency is a permanent liability and an attack-surface increase. Small, clear local code beats a new tree. |
| "Pinning is annoying, `>=` is more flexible." | **DENIED.** Unpinned versions change under you and break reproducibility. Pin exactly with hashes; upgrade deliberately. |
| "The package name looks right, close enough." | **DENIED.** Typosquatting is a real malware vector. Verify the EXACT name and that the repo URL matches before install. |
| "There's a CVE but it probably doesn't affect us." | **PARTIAL.** 'Probably' is not a decision. Assess exploitability in our usage, write it down, track it — never silently ignore HIGH/CRITICAL. |
| "I'll add the SBOM/CI scan later." | **DENIED.** Later never comes. Generate the SBOM now and ensure CI fails on new HIGH/CRITICAL so it self-enforces. |
