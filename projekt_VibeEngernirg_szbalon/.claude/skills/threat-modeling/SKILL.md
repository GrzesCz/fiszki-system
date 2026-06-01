---
name: threat-modeling
description: >
  Performs threat modeling for public APIs, auth, sensitive data, uploads,
  payments, external integrations and security-sensitive Python features.
  Triggers when the user says "threat model", "analyze security risks", "STRIDE analysis".
version: 1.0.0
---

# Threat Modeling

## Goal

Find security risks before implementation and turn them into mitigations and tests.

## Use When

- A task touches auth, authorization, public API, user data, file upload or external integration.
- A feature processes sensitive or regulated data.
- A security incident or audit finding needs analysis.

## Do Not Use When

- The change is purely internal and has no security boundary.
- There is already an accepted threat model and the boundary is unchanged.

## Inputs

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/api_contract.md`
- Relevant ADRs
- Current `plan.md` task

## Procedure

1. Identify assets.
2. Identify actors.
3. Identify entrypoints.
4. Identify trust boundaries.
5. Apply STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.
6. Assign severity.
7. Propose mitigations.
8. Add required security tests to `plan.md`.
9. Update `docs/risk_register.md`.
10. Save the model to `docs/threat_model.md`.

## Scope Discipline
You are restricted to reading the architecture and writing to `docs/threat_model.md` and `docs/risk_register.md`. You are FORBIDDEN from implementing the mitigations (e.g., adding authentication middleware to Python code) during this task.

## Output

- `docs/threat_model.md`
- Updated `docs/risk_register.md`
- Security test tasks in `plan.md`

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] The STRIDE analysis is fully documented in `docs/threat_model.md`.
- [ ] You have run a terminal command `cat docs/threat_model.md` to prove it exists.
- [ ] Mitigation tasks and security tests are added to `plan.md`.
- [ ] You explicitly state: "Threat Modeling complete. Output generated in docs/threat_model.md, X high/critical risks identified."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just implement the security fix in the code right now." | **DENIED.** Scope Discipline violation! Add the mitigation to the plan, do not code it yet. |
| "I'll only report the risks in the chat." | **DENIED.** You must generate formal markdown documents. |
| "STRIDE is too heavy for this, I'll just write one paragraph." | **DENIED.** The formal STRIDE methodology must be followed and documented. |

