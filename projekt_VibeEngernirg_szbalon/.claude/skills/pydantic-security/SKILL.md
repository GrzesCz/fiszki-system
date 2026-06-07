---
name: pydantic-security
description: >
  Strictly enforces the use of pydantic-settings and SecretStr for managing
  configuration, tokens, and passwords. Enforces the Singleton pattern, Fail-Fast startup validation,
  creation/updating of .env.example, and field validators. Triggers whenever the user says:
  "configure environment", "read key from env", "build settings.py" or
  when the project requires API authorization. Forbids the use of the plain os module.
version: 1.0.0

---

# Iron Law of Configuration Management (Secure by Design)

You are a senior security engineer. Your job is to absolutely protect API keys from leaking to logs and to ease project onboarding for new developers.

## STEP 1: Mandatory Boilerplate and Singleton
Whenever configuration is needed, you MUST create or modify the settings file (e.g., `config.py` or `settings.py`) using exactly this pattern:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr, field_validator
from pathlib import Path
import sys

# Resolve .env relative to this file, NOT the current working directory.
# A hardcoded "../.env" breaks the moment the app is launched from another folder.
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_PATH),   # adjust .parent depth to your project layout
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore" # ignores unknown keys in the .env file
    )
    
    # SecretStr replaces str! The key WILL NOT be displayed in logs.
    openai_api_key: SecretStr
    
    @field_validator("openai_api_key", mode="after")
    @classmethod
    def validate_openai_key(cls, value: SecretStr) -> SecretStr:
        secret_val = value.get_secret_value()
        if not secret_val.strip():
            raise ValueError("API Key cannot be empty.")
        # Validate non-emptiness and a sane minimum length. Do NOT hardcode a
        # provider-specific prefix like "sk-": it rejects valid keys (project keys
        # "sk-proj-...", Azure/other providers) and rots as formats change. If you
        # need a prefix check, make it configurable per provider, not a literal here.
        if len(secret_val) < 20:
            raise ValueError("OpenAI API key looks too short to be valid.")
        return value

# Singleton initialization - this variable will be imported project-wide
settings = Settings()
```

**Import rule:** Project-wide, you must exclusively import the instantiated object: `from config import settings`. Defining or instantiating the `Settings` class in other modules is strictly forbidden.

## STEP 2: `.env.example` Synchronization
Every time you add a new configuration variable to the `Settings` class:
1. Check if the `.env.example` file exists in the root directory. If not, create it.
2. Add the new variable to `.env.example` with an empty or placeholder value (e.g., `openai_api_key=sk-PASTE-YOUR-KEY-HERE`).
3. Never write your real secrets there!

## STEP 3: Fail-Fast Principle
In the main entry point (e.g., `main.py` or at the startup of the MCP module), add explicit validation at startup:

```python
import sys
from pydantic import ValidationError
from config import settings

try:
    # Force validation and reading of critical values at application startup
    _ = settings.openai_api_key.get_secret_value()
except ValidationError as e:
    print(f"CRITICAL CONFIG ERROR: Missing or invalid variables in .env!\nDetails: {e}", file=sys.stderr)
    sys.exit(1)
```

## STEP 4: Scope Discipline
This skill authorizes you to modify only the configuration files (`config.py`/`settings.py`), the entry point (`main.py`), and `.env.example`. You must not modify any business logic files or views.

## Hard Exit Criteria
The task is complete ONLY when:
- [ ] A Singleton pattern is implemented using `pydantic-settings`.
- [ ] You have run `python -c "from config import settings"` — proof: paste the terminal output showing 0 errors.
- [ ] You have run `cat .env.example` — proof: paste the terminal output proving the example file is synchronized with the Settings class.
- [ ] Fail-Fast validation was tested — proof: run the app without `.env` and paste the terminal output showing the process terminates with a clear error.
- [ ] You explicitly state: "Pydantic Security complete. Secrets secured via SecretStr, .env.example updated, import PASS."

## Anti-Rationalization (Excuse Shield)
| If you (LLM Agent) think... | Correct Response (What you must do) |
| :--- | :--- |
| "It's just a small test script, I'll use os.getenv" | Security knows no exceptions. Implement the Settings class and read the .env file via Pydantic. |
| "I'll import the Settings class and create a new object locally" | Singleton rule violation! Import the existing `settings` object from the configuration file. |
| "I'll just use `str`, it's easier to write" | `str` will leak in error trace logs! Replace it with `SecretStr` immediately. |
| "I forgot .env.example, the user will figure it out" | Lack of documentation blocks deployment. Update `.env.example` immediately. |
