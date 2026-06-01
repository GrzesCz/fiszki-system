---
name: Hallucination Shield
description: >
  Forces the agent to verify the environment state, strictly read the latest documentation,
  test import correctness (python -c), and analyze deprecation before deploying code.
  Triggers when the user says "implement this API", "add MCP", "use the latest library X",
  "write code", or "refactor".
---

# Environment Verification Procedure (No Blind Coding)

You are an engineer-auditor who knows that their memory can hallucinate outdated versions of software. Before you write code to integrate external systems, you MUST verify the user's actual environment state and read the latest documentation.

## STEP 1: Version and Environment Audit
1. Before writing code using a new library, run `uv pip show <package_name>` or `pip show <package_name>`.
2. Identify the exact version the project is using (e.g., `0.130.0`).

## STEP 2: Mandatory Reading of the Latest Documentation
Writing code from LLM memory for external libraries (Pydantic, MCP, FastAPI, OpenAI SDK, etc.) is strictly forbidden.
1. **Local documentation:** Search the `/docs` or `/materials` directory for files containing guidelines for the library. You are STRICTLY required to open and read these files before coding.
2. **Online documentation (Search):** If local documentation is missing or you have doubts, use available web tools (search engine) to find the official documentation for the version identified in Step 1 (e.g., `docs.pydantic.dev` or the GitHub repository of the MCP server).
3. **Signature analysis:** Before calling a method, check its exact input parameters in official online sources.
4. **Context7 MCP (API Search Engine):** If the Context7 MCP server (`@upstash/context7-mcp@latest`) is running in your environment, you MUST use the `query-docs` tool with the appropriate library ID (e.g., `/littlebearapps/outlook-mcp` or whichever library you are using) to fetch its official, fresh API.

## STEP 3: API Test and Discovery
Instead of guessing function arguments from memory:
1. For newer frameworks (such as MCP packages or new Python modules), write a short helper script to call `help(Module)` or run inspection in the terminal (e.g., `dir(Object)`).
2. Check what the package currently exposes. Is the expected method still there?

## STEP 4: MCP and Fail-Fast Principle
1. Model Context Protocol is a relatively new technology. Your built-in knowledge may be outdated.
2. When adding tools via MCP, force yourself to generate logic that handles the strict JSON-RPC standard and say out loud: *"I checked the current server specification"*.
3. Implement Fail-Fast on the communication port: The MCP client must check the connection at startup. If the server does not respond within 5 seconds, the client must raise a critical error and stop the process instead of hanging indefinitely.

## STEP 5: Verification of Operation and Deprecation (Senior Requirement)
Before you consider the code complete:
1. **Import test:** Run `python -c "from path.to.module import class_or_function"` in the terminal and ensure it exits without errors. This prevents hallucinations of directory structure and file names.
2. **Warning test:** Run the application or tests with the `-W all` flag, e.g., `python -W all main.py` or `pytest -W all`. Check if external libraries report `DeprecationWarning` in the context of your code.

## Scope Discipline
This skill is largely diagnostic (read-only) aside from writing the code the user requested. You are FORBIDDEN from modifying package versions in `pyproject.toml` or `uv.lock` on your own unless the user explicitly told you to update a library. Test within the environment as you find it.

## STEP 6: Hard Exit Criteria
Work on integration or refactoring is complete ONLY when:
- [ ] Local or online documentation has been read and analyzed (leave a thought log trace: "Analyzed X documentation for version Y").
- [ ] The import command run via `python -c` passes cleanly — proof: paste the terminal output showing 0 errors.
- [ ] A startup test with `-W all` flag was run — proof: paste the terminal output confirming no `DeprecationWarning` from your code.
- [ ] Fail-Fast validation has been tested — proof: paste the terminal output showing the process correctly terminates when configuration is missing.
- [ ] Agent explicitly stated: "Hallucination Shield complete. Documentation verified for version X, import PASS, 0 deprecation warnings."

## Anti-Rationalization (Excuse Shield)
| If you (LLM Agent) think... | Correct Response (What you must do) |
| :--- | :--- |
| "I remember perfectly how this version of library X works." | Memory is fallible. Check the `uv.lock` file or the source code to verify if the method still exists. Do it! |
| "There is no time for analysis, writing code is faster." | Writing buggy code wastes the most time. Stop and verify the object's API. |
| "I know this API inside out, I don't need to look in Google or /docs." | Libraries in the AI world change from week to week. Open the latest local documentation or use a search engine. This is a command! |
| "The import test will take too much time." | The test takes 2 seconds. Run `python -c` and prove that the import works. |
