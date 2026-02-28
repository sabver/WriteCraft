# Project Constitution (SDD)

## Non-negotiables
- Follow Spec-Driven Development: spec → plan → tasks → implement.
- Never start coding before spec.md is updated and tasks.md exists.
- Prefer small, verifiable steps; run lint/test after each meaningful change.

## Tech stack
- Next.js 15 (Turbopack) + React 19 + TypeScript + shadcn/ui (new-york) + Tailwind CSS v4
- Package manager: pnpm
- Testing: (fill in: vitest/jest/playwright)
- Lint/format: eslint (typescript-eslint + react-hooks)

## Repo conventions
- Specs live under /specs/<NNN-feature>/...
- Source changes must reference spec sections (traceability).
- Do not read secrets: .env*, /secrets/**

## Workflow
1) Use /sdd-specify to produce or update specs/<id>/spec.md.
2) Use /sdd-plan to create specs/<id>/plan.md (+ contracts/research if needed).
3) Use /sdd-tasks to create specs/<id>/tasks.md (ordered, test-first).
4) Use /sdd-implement to execute tasks one by one, keeping spec in sync.
5) Use /sdd-review before opening PR.
