# Release Plan

## Before Merge

- [ ] CI is green.
- [ ] Critical path tests are green.
- [ ] Security scan has no unresolved High/Critical findings.
- [ ] Database migrations are verified.
- [ ] API contract diff is reviewed.
- [ ] Risk register is updated.
- [ ] Final diff was read by a human.
- [ ] Rollback path is tested or explicitly documented.

## Deploy

{{deployment_steps}}

## Post-Deploy Smoke Tests

- [ ] {{smoke_test}}

## Rollback

{{rollback_steps}}

## Post-Deploy Monitoring

- [ ] {{monitoring_check}}

## Release Owner

{{release_owner}}

## Go / No-Go Decision

{{go_no_go_decision_and_timestamp}}
