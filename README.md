# WriteCraft

Next.js 15 (Turbopack) + React 19 + TypeScript + shadcn/ui (new-york) + Tailwind CSS v4

> An AI-assisted English writing practice tool — and an experiment in Claude Code-driven development.

[中文](README.zh.md) | [日本語](README.ja.md)

---

## Background

This project has two goals:

1. **Practice programming with Claude Code** — experience a full development cycle from requirements to implementation, driven entirely by Claude Code.
2. **Explore a development workflow that fits Claude Code** — specifically, Spec-Driven Development (SDD): write the spec first, then plan, then break into tasks, then implement step by step — rather than asking AI to write code directly.

---

## What It Does

WriteCraft is a translation practice tool for English learners. The core loop:

```
Select Scene → Enter Content → Write Translation → AI Review → Generate Flashcards → Spaced Review
```

### Scenes

| Scene | Purpose |
|-------|---------|
| **Interview** | Paragraph-level professional translation with job description, company background, and question type as context |
| **Daily** | Quick capture of fragmented expressions; context fields are optional |

### Modules

- **Translation Practice** — Write English against a source text; AI reference translation is hidden by default
- **AI Review** — Sentence-by-sentence comparison, categorized as Grammar / Word Choice / Structure, each with a reason
- **Flashcard Generation** — Paragraph mode (one card per session) or Sentence mode (one card per sentence); card back includes user translation + AI revision + key feedback summary
- **Spaced Review** — SM-2 algorithm scheduling; recall rated 0–5 updates the next review interval
- **History** — Filter by scene or date range, keyword search, re-do any past exercise

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (Turbopack) + React 19 |
| Language | TypeScript |
| UI | shadcn/ui (new-york) + Tailwind CSS v4 |
| ORM | Prisma |
| Database | PostgreSQL |
| Package manager | pnpm |

### Data Model

```
TranslationSession   — one record per completed practice session
  └── ReviewIssue[]  — AI feedback items (cascade delete)
  └── Flashcard[]    — generated cards with SM-2 scheduling state (cascade delete)
        └── ReviewLog[] — immutable rating log per review event (cascade delete)
```

---

## Local Development

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Set DATABASE_URL to your PostgreSQL connection string

# Run database migrations
pnpm exec prisma migrate dev

# Start the dev server
pnpm dev
```

---

## Development Workflow (SDD)

All feature changes follow Spec-Driven Development:

```
/sdd-specify  →  /sdd-plan  →  /sdd-tasks  →  /sdd-implement  →  /sdd-review
```

Spec documents live under [specs/](specs/), one subdirectory per feature (e.g. `specs/001-database/`).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sessions` | List practice history (filter by scene / dateRange / keyword) |
| `POST` | `/api/sessions` | Create a new session record |
| `GET` | `/api/sessions/:id` | Get a single session with all review issues |
