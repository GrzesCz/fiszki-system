---
name: ui-fidelity-enforcer
description: >
  Ensures strict visual fidelity by forcing the agent to use ONLY the HTML/CSS components provided in the design system. Forbids CSS/Tailwind hallucinations. Triggers when the user says "zaimplementuj UI z design systemu", "podepnij design", "implement frontend".
version: 1.0.0
---

# UI Fidelity Enforcer

## Goal

Prevent the AI from hallucinating UI styles, colors, or CSS classes by strictly enforcing adherence to an external Design System.

## Use When

- Implementing frontend components (React, Vue, HTML templates).
- Connecting business logic to the UI layer.

## Do Not Use When

- Writing pure backend logic, databases, or APIs.

## Inputs

- The design system components located in `docs/design_system/`.

## Procedure

1. **Locate Design System:** Read the raw HTML/Tailwind/CSS files from `docs/design_system/`.
2. **Implement Logic:** Map the frontend framework (e.g., React state, props) to the exact classes and structure provided in the design system.
3. **Strict Adherence:** You MUST NOT invent new CSS classes, change the color palette, or alter the layout structure without explicit permission.

## Scope Discipline

Your job is integration, not design. If a required visual state (e.g., an error state or hover effect) is missing from the design system, you MUST stop and ask the user to provide the design for it. Do NOT invent it yourself.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] The frontend component matches the design system structure perfectly.
- [ ] No unauthorized CSS or Tailwind classes have been introduced.

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just add `bg-blue-500` here because it looks better." | **DENIED.** Strict Adherence violation! You cannot alter the color palette. |
| "The design system is missing a loading spinner, I'll make one." | **DENIED.** Scope Discipline violation! Ask the user for the design. |
| "I can optimize this HTML structure by removing divs." | **DENIED.** The structure was provided by a specialized UI tool. Do not alter it. |
