# Runbook

## Application Outage

1. Check health/readiness endpoints.
2. Check the latest deployment.
3. Check error logs.
4. Check dependency metrics.
5. If needed, rollback according to `docs/release_plan.md`.

## Database Outage

{{database_outage_procedure}}

## Cache / Redis Outage

{{cache_outage_procedure}}

## Security Incident

1. Stop automated changes.
2. Preserve logs and relevant evidence.
3. Identify affected secrets, data and scope.
4. Rotate secrets if needed.
5. Prepare `docs/postmortem.md`.

## Escalation

| Scenario | Escalate To | Time Limit |
|---|---|---|
| {{scenario}} | {{owner_or_team}} | {{time_limit}} |
