---
description: Execute tasks.md step-by-step with verification
allowed-tools: Bash(pnpm run lint), Bash(pnpm run test:*), Bash(pnpm run build)
---

Rules:
- Pick the next unchecked task from specs/<feature>/tasks.md
- Implement the smallest change to complete it
- Run validation commands
- Update tasks.md checkbox + update spec/plan if reality changes
