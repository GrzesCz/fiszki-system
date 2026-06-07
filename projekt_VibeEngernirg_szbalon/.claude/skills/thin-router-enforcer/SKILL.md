---
name: thin-router-enforcer
description: >
  Strictly enforces clean architecture principles (Thin Router) for FastAPI and
  Pydantic projects. Triggers when modifying or creating FastAPI API routers.
  The agent MUST prove router cleanliness with terminal commands. Enforces 3-layer
  separation, data source consistency, and no-mock-in-production rule.
version: 1.0.0
---

# Thin Router Enforcer (FastAPI & Pydantic)

## Trigger
- User asks to "create an endpoint", "add an API route", "create a router"
- Agent modifies any file containing `APIRouter` or `@app.get/post/put/delete/patch`

## Relationship to other skills
- Decides WHAT layers exist; `simplicity-gate` decides whether each layer EARNS its
  existence. If a layer this skill mandates ends up as an empty pass-through (no real
  behavior), `simplicity-gate` takes precedence: collapse it and record a justified
  exception in the Architectural Proof. Structure without behavior is ceremony, not
  architecture.
- For configuration/secrets inside services use `pydantic-security`; for pre-commit
  verification use `python-quality-gate`.

## Procedure

### STEP 1: Identify Router File
Use terminal to confirm you are editing a router file:
```bash
grep -rn "APIRouter\|@app\.\|@router\." <path_to_file>
```

### STEP 2: Iron Rule — "Thin Router"
Inside a FastAPI endpoint function, you are ABSOLUTELY FORBIDDEN from writing:

| Forbidden | Violation Example | Reason |
| :--- | :--- | :--- |
| **Raw SQL queries** | `db.execute(f"SELECT * FROM...")` | SQL belongs in the Repository layer |
| **Business logic** | `if order.total > 100: discount = 0.1` | Logic belongs in the Service layer |
| **Direct API calls** | `requests.get("https://api.extern...")` | External APIs are handled by a dedicated client/service |
| **Data transformations** | `result = [{"name": r.name} for r in rows]` | Transformations belong in Pydantic schemas |
| **Direct file I/O** | `open("data.csv").read()` | I/O belongs in the Repository/Service layer |

### STEP 3: Required 3-Layer Architecture

```
┌─────────────────────────────────────────┐
│  ROUTER (router.py)                     │
│  - @router.* decorator                  │
│  - Pydantic models (type hints on I/O)  │
│  - Depends() — service injection        │
│  - HTTPException — HTTP error handling  │
│  - ZERO business logic                  │
└──────────────────┬──────────────────────┘
                   │ calls
┌──────────────────▼──────────────────────┐
│  SERVICE (service.py)                   │
│  - Pure business logic                  │
│  - Operates on Pydantic models          │
│  - Delegates data to Repository         │
│  - Does NOT import FastAPI/Request      │
└──────────────────┬──────────────────────┘
                   │ calls
┌──────────────────▼──────────────────────┐
│  REPOSITORY / DATA (repository.py)      │
│  - SQL queries / ORM calls              │
│  - File operations                      │
│  - External API calls                   │
└─────────────────────────────────────────┘
```

**Layers must hold real behavior (anti-ceremony rule).** The 3-layer split exists to keep
HTTP concerns out of logic and logic out of data access — NOT to inflate line count. A
Service whose body is a single pass-through (`return repo.get(id)` and nothing else) adds
no value and is ceremonial slop. In that case you MAY collapse the empty layer, provided
you record an explicit, justified exception in the Architectural Proof (STEP 6), e.g.
*"Service layer omitted — no business logic for this read; router calls repository
directly. Justification: pure lookup, no invariants."* The router still must NOT contain
SQL, external calls, or I/O — those always belong in the repository.

### STEP 4: Data Source Consistency
If the project uses multiple data sources (e.g., local DB + Supabase + external API):
1. **Handle ALL sources** — do not skip any in a new endpoint.
2. **Deduplication** — if data can come from multiple sources, deduplicate by unique keys (id, url_link).
3. **NO mocks in production** — never return `[]` or test data as a fallback when an external service is down. Raise an exception or return a proper HTTP status.

### STEP 5: Mandatory Terminal Verification
BEFORE submitting router code, you MUST run:
```bash
grep -n "execute\|select(\|insert(\|update(\|delete(\|requests\.\|open(\|\.read()" <router_file>
```
If the command finds anything — you have a violation. Fix the code BEFORE submitting.

### STEP 6: Architectural Proof
Before concluding work on an endpoint, you MUST write an explicit proof:

```markdown
### 🏗️ ARCHITECTURAL PROOF
- **Router:** `router.py` — contains ONLY decorator, Depends(), Pydantic type hints, HTTPException.
- **Service:** `service.py` — business logic delegated to `<service_method_name>`.
- **Repository:** `repository.py` — DB queries delegated to `<repo_method_name>`.
- **Grep verification:** Command `grep -n "execute|select|requests" router.py` — result: CLEAN (0 hits).
- **Data sources:** Handled: [list]. Missing: [none / list].
```

## Scope Discipline
You are forbidden from modifying any files outside the API layer and the business logic necessary to handle the endpoint (e.g., `router.py`, `service.py`, `repository.py`, Pydantic schemas). You must not "incidentally" fix or refactor other endpoints that the user did not ask you to touch.

## Hard Exit Criteria
The endpoint is ready ONLY when:
- [ ] Router contains no business logic, SQL, or direct API calls — proof: output of `grep -n "execute\|select(\|insert(\|update(\|delete(\|requests\.\|open(" <router.py>` → **0 hits**.
- [ ] All input/output is typed with Pydantic models — proof: output of `grep -n "def.*-> dict\|def.*-> list\|return {" <router.py>`. Each hit must be EITHER zero OR a documented exception (e.g. a `/health` endpoint returning a small `dict` is acceptable if noted in the Architectural Proof). Do not invent wrapper models for trivial responses just to reach 0 hits — that is ceremony.
- [ ] Service is injected via `Depends()` — proof: output of `grep -n "Depends(" <router.py>` → **≥1 hit** per endpoint.
- [ ] Architectural Proof is generated in the STEP 6 format (with layer names and grep output).
- [ ] Data source consistency is maintained — proof: agent listed handled sources and confirmed no mocks (if applicable).
- [ ] Agent explicitly stated: "Thin Router verification complete. Router `<name>` has X endpoints, 0 violations, 3-layer architecture confirmed."

## Anti-Rationalization
| Rationalization | Action |
| --- | --- |
| "It's just a simple endpoint, I'll put the DB query directly in the router." | **DENIED.** SQL/ORM/I/O never goes in the router — move it to the repository. (If there is no business logic, the Service layer may be skipped per the anti-ceremony rule, but the data access still leaves the router.) |
| "I'll use a dictionary instead of a Pydantic model for this quick response." | **DENIED.** All I/O must be strictly typed using Pydantic models. |
| "There's no point creating a separate repository for one query." | **DENIED for I/O.** SQL/ORM/external calls always belong in the repository, regardless of size. BUT a pass-through Service with no logic may be collapsed — record the justified exception in the Architectural Proof. Keep the data layer; drop only empty ceremony. |
| "A mock returning empty data is fine as a fallback." | **DENIED.** No mocks in production. Raise an exception or return HTTP 503. |
