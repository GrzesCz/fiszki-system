"""Deterministic quality gate for Python projects.

Adjust commands after bootstrapping the real project.
"""

from __future__ import annotations

import subprocess
import sys


COMMANDS: tuple[tuple[str, ...], ...] = (
    ("uv", "run", "ruff", "format", "--check", "src", "tests"),
    ("uv", "run", "ruff", "check", "src", "tests"),
    ("uv", "run", "mypy", "src", "--strict"),
    ("uv", "run", "pytest"),
    ("uv", "run", "bandit", "-r", "src"),
)


def main() -> int:
    for command in COMMANDS:
        print(f"[quality-gate] running: {' '.join(command)}")
        result = subprocess.run(command, check=False)
        if result.returncode != 0:
            print(f"[quality-gate] failed: {' '.join(command)}")
            return result.returncode
    print("[quality-gate] passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())

