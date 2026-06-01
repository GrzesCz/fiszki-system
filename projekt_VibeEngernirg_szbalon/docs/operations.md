# Operations

## SLO / SLA

- Availability: {{availability_target}}
- Latency P95/P99: {{latency_target}}
- Error rate: {{error_rate_target}}

## Logging

- Format: JSON structured logs
- Required fields: timestamp, level, service, environment, request_id, message
- Sensitive data policy: {{logging_redaction_policy}}

## Metrics

- {{metric_name}}: {{metric_purpose}}

## Tracing

- {{tracing_strategy}}

## Alerts

| Alert | Condition | Response | Owner |
|---|---|---|---|
| {{alert_name}} | {{condition}} | {{response}} | {{owner}} |

## Backups

{{backup_and_restore_strategy}}

## Operational Risks

- {{operational_risk}}
