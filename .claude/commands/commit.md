---
description: Analyze changes by intent and create multiple focused commits
---

Help me commit my changes in multiple focused commits, grouped by intent:

## Step 1: Gather context
- Run `git status` (no -uall flag) to see all changed/untracked files
- Run `git diff` for unstaged changes and `git diff --cached` for staged changes
- Run `git log --oneline -5` to understand the commit message style

## Step 2: Analyze and group by intent
Read the diffs carefully and group files into logical commit groups based on **what problem each change solves**. Each group should represent a single coherent intent. Common intent categories (not exhaustive):

- `feat` — new feature or user-facing functionality
- `fix` — bug fix
- `refactor` — code restructuring without behavior change
- `style` — UI/CSS/theme changes
- `config` — tooling, build, or config changes (eslint, tsconfig, package.json, etc.)
- `chore` — dependency updates, lockfile, gitignore, etc.
- `docs` — documentation

**Rules for grouping:**
- One group = one intent. Never mix unrelated concerns in a group.
- Config/tooling changes are always a separate commit from feature code.
- Dependency additions belong with the feature that requires them, unless they are standalone upgrades.
- If a file touches multiple concerns, assign it to the dominant one.

## Step 3: Present the plan
Show the proposed commit groups as a numbered list **before doing anything**:

```
Proposed commits (3 total):

[1] config: add typecheck script and update eslint rules
    Files: package.json, eslint.config.js

[2] feat: scaffold flashcard review route and service
    Files: src/app/flashcard/review/page.tsx, src/services/flashcard.ts

[3] chore: add framer-motion dependency
    Files: pnpm-lock.yaml
```

Ask: "Proceed with all 3 commits in order? Or adjust grouping?"

## Step 4: Execute commits in order
After confirmation, for each group:
1. `git add` only the files in that group
2. `git commit` with the message
3. Show the resulting commit hash

**Commit message format:**
- Imperative mood, under 72 characters
- Focus on WHY, not just WHAT
- End every commit message with:
  ```
  Co-Authored-By: YE
  ```

## Important rules
- Never commit `.env` files. Warn the user if `.env` is in the changes.
- Always verify `.env` is in `.gitignore` before committing anything.
- `pnpm-lock.yaml` goes in a `chore` commit unless it's the only change alongside a feature (then bundle with that feature's commit).
- `.claude/settings.local.json` should be excluded unless the user explicitly asks to include it.
