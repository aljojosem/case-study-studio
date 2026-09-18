# AI logs

Each git branch gets its own log file: `ai-logs/<branch>.md`.

Cursor creates the file when you start a chat and appends:

- every prompt you submit
- the agent’s result

Name branches with your identity, for example `amal/studio-filters`. That file then shows who typed the prompts.

## Pull requests

1. Work on your own branch (not `main`).
2. Let Cursor create `ai-logs/<your-branch>.md`.
3. Commit and push that file with the rest of the PR.

GitHub checks that the log for the PR branch exists. Merge will not pass without it.
