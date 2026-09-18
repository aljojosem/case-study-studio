# AI log — `main`

Commit this file with your pull request.

- **Branch:** `main`
- **Git user:** Aljo Jose <aljo.j@2basetechnologies.com>
- **Cursor user:** aljo.j@2basetechnologies.com
- **Created:** 2026-09-18 04:47 UTC

---


## Result — 2026-09-18 04:47 UTC

Per-branch AI logging is in place. After you merge this to `main`, anyone who pulls the repo gets the same setup.

**How it identifies who typed the prompt**

Each git branch writes its own file: `ai-logs/<branch>.md`. A branch named `amal/studio-filters` becomes `ai-logs/amal--studio-filters.md`. The file header also records git user/email and Cursor email.

**What happens automatically**

Cursor hooks (`.cursor/hooks.json`) create the log when a chat starts, then append:

- the prompt you send
- the agent’s result

Teammates do not create the file by hand. After they pull `main` and work on their branch, the next Cursor chat creates the local log.

**What they must push with the PR**

Commit `ai-logs/<their-branch>.md` with the rest of the change. GitHub Action `.github/workflows/require-ai-log.yml` fails the PR if that file is missing.

**How to use it**

1. Push this work to `main`.
2. Everyone uses a personal branch, for example `yourname/short-task`.
3. Chat in Cursor as usual.
4. Include the new `ai-logs/...md` file in the pull request.

I have not committed this. Say if you want it committed and pushed.

## Prompt — 2026-09-18 04:49 UTC

**Model:** `auto-smart`

if i push and pull all memebers in locally, and every prompts are saved to seperate file right?

## Result — 2026-09-18 04:49 UTC

**One file per branch, not one file per prompt.**

After you push this to `main` and everyone pulls:

1. Each person works on **their own branch** (for example `amal/studio-filters`).
2. Cursor creates **one** log for that branch: `ai-logs/amal--studio-filters.md`.
3. **Every prompt and result on that branch is appended into that same file** as new sections. They are not separate files.

So you can tell **who** typed the prompts from the branch name and the header (git user / Cursor email). You see **all** of that person’s prompts for that PR in one place.

If two people use the same branch, they share one log file. That is why each person should use a branch like `yourname/short-task`.

They still need to **commit and push** that `ai-logs/...md` file with the pull request. Pulling `main` only gives them the logging setup; it does not upload their local prompts until they push the log.
