#!/usr/bin/env python3
"""Log Cursor prompts and results to ai-logs/<branch>.md."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

LOG_DIR_NAME = "ai-logs"
MAX_PROMPT_CHARS = 12_000
MAX_RESULT_CHARS = 16_000


def emit(payload: dict) -> None:
    sys.stdout.write(json.dumps(payload))
    sys.stdout.flush()


def read_input() -> dict:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    try:
        data = json.loads(raw)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return {}


def run_git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=repo,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return ""
    return result.stdout.strip()


def resolve_repo(payload: dict) -> Path:
    roots = payload.get("workspace_roots") or []
    if roots:
        return Path(roots[0])
    return Path.cwd()


def branch_slug(branch: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9._-]+", "--", branch.strip())
    slug = slug.strip("-.") or "unknown-branch"
    return slug[:120]


def truncate(text: str, limit: int) -> str:
    text = text.replace("\r\n", "\n").strip()
    if len(text) <= limit:
        return text
    return text[:limit] + f"\n\n… truncated ({len(text)} chars total)"


def redact(text: str) -> str:
    patterns = [
        (re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*\S+"), r"\1=***"),
        (re.compile(r"sk-[A-Za-z0-9]{10,}"), "sk-***"),
        (re.compile(r"ghp_[A-Za-z0-9]{10,}"), "ghp_***"),
    ]
    for pattern, replacement in patterns:
        text = pattern.sub(replacement, text)
    return text


def log_path(repo: Path, branch: str) -> Path:
    return repo / LOG_DIR_NAME / f"{branch_slug(branch)}.md"


def ensure_header(path: Path, repo: Path, branch: str, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.stat().st_size > 0:
        return

    git_user = run_git(repo, "config", "user.name") or "(git user.name not set)"
    git_email = run_git(repo, "config", "user.email") or "(git user.email not set)"
    cursor_user = payload.get("user_email") or "(Cursor email not available)"
    created = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    path.write_text(
        "\n".join(
            [
                f"# AI log — `{branch}`",
                "",
                "Commit this file with your pull request.",
                "",
                f"- **Branch:** `{branch}`",
                f"- **Git user:** {git_user} <{git_email}>",
                f"- **Cursor user:** {cursor_user}",
                f"- **Created:** {created}",
                "",
                "---",
                "",
            ]
        )
        + "\n",
        encoding="utf-8",
    )


def append_entry(path: Path, heading: str, body: str) -> None:
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    block = f"\n## {heading} — {stamp}\n\n{body.strip()}\n"
    with path.open("a", encoding="utf-8") as handle:
        if os.name != "nt":
            import fcntl

            fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        handle.write(block)


def main() -> int:
    payload = read_input()
    event = payload.get("hook_event_name") or ""
    repo = resolve_repo(payload)
    branch = run_git(repo, "rev-parse", "--abbrev-ref", "HEAD") or "unknown-branch"
    path = log_path(repo, branch)

    try:
        ensure_header(path, repo, branch, payload)

        if event == "sessionStart":
            emit(
                {
                    "additional_context": (
                        f"AI prompts and results for this branch are logged to `{path.relative_to(repo)}`. "
                        "Include that file in the pull request."
                    )
                }
            )
            return 0

        if event == "beforeSubmitPrompt":
            prompt = redact(truncate(str(payload.get("prompt") or ""), MAX_PROMPT_CHARS))
            model = payload.get("model") or payload.get("model_id") or "unknown model"
            append_entry(
                path,
                "Prompt",
                f"**Model:** `{model}`\n\n{prompt or '(empty prompt)'}",
            )
            emit({"continue": True})
            return 0

        if event == "afterAgentResponse":
            result = redact(truncate(str(payload.get("text") or ""), MAX_RESULT_CHARS))
            append_entry(path, "Result", result or "(empty response)")
            emit({})
            return 0

        emit({})
        return 0
    except Exception:
        if event == "beforeSubmitPrompt":
            emit({"continue": True})
        else:
            emit({})
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
