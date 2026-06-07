---
name: frontend-blueprint-generator
description: >
  Bridges the gap between the backend architecture and external visual AI tools like Claude Design or v0.dev. Analyzes the current project state (APIs, Product Brief) and generates a comprehensive "Mega-Prompt" for the user to paste into external UI generators. Triggers when the user says "zaprojektuj frontend", "stwórz design system", "generate frontend prompt".
version: 1.0.0
---

# Frontend Blueprint Generator

## Goal

Create a flawless, highly detailed prompt for external visual AI tools (Claude Design, v0.dev) so they can generate the exact HTML/CSS/Tailwind components required by the application's backend and business logic.

## Use When

- The backend architecture or Product Brief is ready.
- You need to generate the visual layer but want to prevent the coding agent from hallucinating CSS.
- Transitioning from logic design to UI design.

## Do Not Use When

- The Design System is already created and located in `docs/design_system/`.
- The user is asking to implement the frontend code directly (use `ui-fidelity-enforcer` for that).

## Procedure

1. **Analyze Requirements:** Read the `docs/product_brief.md`, data models (e.g., Pydantic schemas), and API endpoint definitions.
2. **Map UI Components:** Identify all necessary visual elements:
   - Layouts (Navigation, Sidebars, Footers).
   - Pages (Dashboards, Detail Views, Forms).
   - Atomic Components (Buttons, Inputs, Cards, Tables).
   - States (Loading spinners, Error messages, Empty states).
3. **Generate Mega-Prompt:** Create a file named `docs/design_system_prompt.txt`. Write a prompt directed at Claude Design / v0 that includes:
   - The overall application theme and vibe (e.g., "modern, glassmorphism, dark mode default").
   - The exact list of components needed based on the analysis.
   - The exact data structures the components must handle (e.g., "The user table must have columns for ID, Email, and Status").
   - A strict instruction to output pure HTML/Tailwind (or whatever the stack requires).
4. **Handoff:** Stop execution and instruct the user to copy the prompt.

## Output

- `docs/design_system_prompt.txt`

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] You have analyzed the backend data structures so the UI components match the real data.
- [ ] `docs/design_system_prompt.txt` has been created and formatted properly.
- [ ] You explicitly tell the user: "Blueprint ready. Copy the contents of `docs/design_system_prompt.txt`, paste it into Claude Design / v0, save the result to `docs/design_system/`, and then run `ui-fidelity-enforcer`."

## Anti-Rationalization (Excuse Shield)
| Rationalization | Action |
| --- | --- |
| "I'll just write the HTML code myself right now." | **DENIED.** You must generate the prompt for the external tool, not write the UI yourself. |
| "I don't need to check the API schemas, I know what a login form looks like." | **DENIED.** You must ensure the UI matches the exact fields expected by the backend. |
