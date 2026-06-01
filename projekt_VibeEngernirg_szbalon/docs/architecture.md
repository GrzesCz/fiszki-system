# Architecture

## System Context

{{system_context}}

## System Boundaries

- In scope: {{in_scope}}
- Out of scope: {{out_of_scope}}

## Application Layers

```text
src/app/
|-- api/             # HTTP/API layer
|-- application/     # use cases
|-- domain/          # business rules
|-- infrastructure/  # DB, cache, external services
|-- core/            # config, errors, dependency wiring
`-- observability/   # logging, metrics, tracing
```

## Core Components

| Component | Responsibility | Owner | Criticality |
|---|---|---|---|
| {{component}} | {{responsibility}} | {{owner}} | {{criticality}} |

## Integrations

| System | Purpose | Direction | Contract | Risk |
|---|---|---|---|---|
| {{system}} | {{purpose}} | {{inbound_or_outbound}} | {{contract_location}} | {{risk}} |

## Data Flow

{{main_data_flow}}

## Decisions Requiring ADR

- [ ] {{decision_candidate}}
