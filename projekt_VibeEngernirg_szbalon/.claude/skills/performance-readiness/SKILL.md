---
name: performance-readiness
description: >
  Checks performance readiness for critical Python/FastAPI paths: latency
  budget, P95/P99, load smoke, DB/cache bottlenecks and timeout strategy.
  Triggers when the user says "check performance", "load test", "benchmark this", "latency requirements".
version: 1.0.0
---

# Performance Readiness

## Goal

Verify that critical flows have explicit performance expectations and evidence.

## Use When

- Requirements mention RPS, latency, throughput or scale.
- A change affects database, cache, external API or hot path.
- Before release of a critical endpoint.

## Do Not Use When

- There is no performance requirement and the feature is non-critical.

## Inputs

- `docs/requirements.md`
- `docs/operations.md`
- Relevant code paths
- Existing benchmark/load test output

## Procedure

1. Identify critical path.
2. Identify latency/RPS target.
3. Check timeout and retry strategy.
4. Check DB/cache usage.
5. Run or define performance smoke test.
6. Record P95/P99 or explicit deferral.
7. Update `docs/performance.md`.

## Scope Discipline
You are strictly performing read-only analysis and testing. You are allowed to run benchmark scripts and update `docs/performance.md`. You are FORBIDDEN from implementing performance optimizations (like adding caching or changing queries) yourself during this review phase.

## Output

- `docs/performance.md`
- tasks in `plan.md` if performance work remains

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] Performance metrics (latency target, P95/P99) are documented in `docs/performance.md`.
- [ ] You have run a benchmark script or profiling tool and pasted the terminal output as proof.
- [ ] You explicitly state: "Performance Readiness complete. Output generated in docs/performance.md, metrics recorded."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just add a Redis cache to make it faster." | **DENIED.** Scope Discipline violation! Measure first, report findings, do not optimize blindly. |
| "I don't have a load testing tool installed." | **DENIED.** Write a simple Python script using `time` and `concurrent.futures` to simulate load and run it. |
| "I'll just guess the latency based on the code." | **DENIED.** You must run a test and provide concrete numbers from terminal output. |

