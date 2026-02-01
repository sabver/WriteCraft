---
description: Auto-generate commit message from staged changes and commit
---

Help me commit my changes:

1. Run `git status` to see all changed files (do not use -uall flag)
2. Run `git diff --cached` to see staged changes; if empty, run `git diff` for unstaged changes
3. Run `git log --oneline -5` to understand the commit message style of this repo
4. Based on the diff, generate a concise commit message:
   - Use imperative mood (e.g., "Add", "Fix", "Update")
   - Keep the first line under 72 characters
   - Focus on WHY, not just WHAT
5. Show me the proposed commit message and ask for confirmation
6. After confirmation, stage the relevant files and run the commit
7. End the commit message with: Co-Authored-By: YE
