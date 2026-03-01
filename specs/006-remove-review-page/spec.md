# Spec 006 — Remove `/review` and Consolidate into `/history/[id]`

## Problem Statement

The app currently has two pages that display AI review issues for a translation session:

1. **`/review`** — shown immediately after the user submits a translation. It reads from `sessionStorage` (ephemeral, tab-scoped). The URL carries no session identifier, making it impossible to know which session is being displayed by looking at the URL. Refreshing the page loses all data.

2. **`/history/[id]`** — shows the same review issues for any past session, reading from the database. The URL contains the session ID. It additionally displays the original source text, the user's translation, and any generated flashcard links.

`/review` is functionally a strict subset of `/history/[id]`. Keeping both creates confusion, a fragile `sessionStorage` dependency, and a URL that gives users and developers no context about what they are looking at.

**Goal:** Remove `/review` entirely. After submitting a translation, redirect the user directly to `/history/[sessionId]` instead.

---

## User Stories & Acceptance Criteria

### US-1 — Redirect after submission

**As a** user who has just submitted a translation for review,
**I want** to land on a stable, bookmarkable URL that shows my results,
**So that** I can refresh without losing my data and share the link if needed.

#### Acceptance Criteria

**Given** I complete the translation step on `/daily` or `/interview`,
**When** the API review call succeeds and the session is saved,
**Then** I am redirected to `/history/<sessionId>` (not `/review`).

**Given** I am on `/history/<sessionId>` immediately after submission,
**When** I refresh the page,
**Then** the same review issues, source text, and translation are still displayed (data comes from the database, not sessionStorage).

---

### US-2 — No ProgressStepper on `/history/[id]`

The ProgressStepper is not shown on `/history/[id]` under any circumstance. It was only meaningful inside the linear submission flow and is redundant on a standalone session detail page.

#### Acceptance Criteria

**Given** I arrive at `/history/<sessionId>` by any means (fresh submission redirect or list re-visit),
**When** the page loads,
**Then** no ProgressStepper is rendered.

---

### US-3 — Generate Flashcards CTA on `/history/[id]`

**As a** user viewing a review session,
**I want** a clearly visible call-to-action to generate flashcards from the identified issues,
**So that** the post-review → flashcard flow is preserved after `/review` is removed.

#### Acceptance Criteria

**Given** I arrive at `/history/<sessionId>` and the session has no flashcards yet,
**When** the page loads,
**Then** a "Generate Flashcards" button is visible and navigates to `/flashcard/generate`.

**Given** I arrive at `/history/<sessionId>` and the session already has one or more flashcards,
**When** the page loads,
**Then** the "Generate Flashcards" button is replaced by a "View Flashcards" button that navigates to `/flashcard/review`.

---

### US-4 — `/review` route no longer exists

**As a** developer or user,
**If** I navigate to `/review` directly,
**Then** I receive a 404 (the route directory is deleted; no redirect is needed).

---

### US-5 — `sessionStorage` dependency removed

**As a** developer,
**I want** no production code to write or read `writecraft:session-draft` from `sessionStorage`,
**So that** the fragile ephemeral dependency is fully eliminated.

#### Acceptance Criteria

**Given** the refactor is complete,
**When** I search the codebase for `writecraft:session-draft`,
**Then** the key appears only in test files (if at all) — not in production source.

---

## Non-Functional Requirements

- No regression in the daily or interview submission flows.
- No regression in `/history` list or existing `/history/[id]` re-visit behavior.
- All existing unit and integration tests continue to pass.
- The redirect URL (`/history/<sessionId>`) must be the canonical URL for a session's review — no additional query params needed.

---

## Out of Scope

- Changes to the flashcard generation flow (`/flashcard/generate`, `/flashcard/review`).
- Changes to the `/history` list page filtering or search.
- Any redesign of the `/history/[id]` page layout beyond adding the in-flow ProgressStepper and Generate Flashcards CTA.
- User accounts or session sharing features.

---

## Decisions Log

| # | Question | Decision |
|---|---|---|
| Q1 | ProgressStepper on `/history/[id]`? | Never shown — removed entirely |
| Q2 | "Generate Flashcards" CTA visibility | Always shown; replaced by "View Flashcards" once flashcards exist for the session |
| Q3 | Old `/review` URL behaviour | 404 — route directory deleted, no redirect |

---

## Unresolved Clarifications Checklist

_(All questions resolved — ready for plan.)_
