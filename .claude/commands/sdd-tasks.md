---
description: Break plan into executable tasks (small, ordered, test-first)
---

Steps:
1) Read specs/<feature>/plan.md (+ contracts/, research.md if exists).
2) Create specs/<feature>/tasks.md:
   - Ordered checklist
   - Each task has: goal, files touched, command to validate (lint/test)
   - Mark independent tasks with [P]
3) Enforce test-first when applicable: add/adjust tests before implementation.
