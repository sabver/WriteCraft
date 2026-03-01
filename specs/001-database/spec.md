# Spec: Database Layer — Persistent Storage

**Feature ID**: 001-database
**Status**: Draft
**Created**: 2026-03-01

---

## Problem Statement

The WriteCraft MVP frontend currently uses mock data and in-memory state. All user
activity (translation sessions, AI review feedback, flashcards, SM-2 review history)
is lost on page reload. The application needs a persistent data layer so that:

- Translation sessions survive navigation and app restarts.
- AI review feedback is stored alongside the session that produced it.
- Flashcards are durable and carry their SM-2 scheduling state between review sessions.
- History records are queryable by scene type, date range, and keyword.
- The due-card queue for flashcard review is computed from stored scheduling data.

**Technical constraint (user decision)**: Use **Prisma** as the ORM and
**PostgreSQL** as the database.

---

## User Stories & Acceptance Criteria

---

### Story 1 — Save a completed translation session

**As** a user who has submitted a translation for AI review,
**I want** my session (scene, context, source text, my translation, AI reference, and
all feedback items) to be saved automatically,
**So that** I can access it later from History without re-doing the exercise.

#### Acceptance Criteria

**AC-1.1 — Session is persisted on review completion**
- Given: A user has gone through Context → Translate → AI Review for either scene.
- When: The AI review results are returned and displayed.
- Then: A `TranslationSession` record is created in the database containing:
  - `scene` (interview or daily)
  - `context` (all filled-in context fields as a key-value map)
  - `sourceText` (the native-language source)
  - `userTranslation` (the English text the user wrote)
  - `aiReference` (the AI-generated full reference translation)
  - `createdAt` timestamp

**AC-1.2 — Review issues are stored per session**
- Given: The AI review returns N feedback items.
- When: The session is saved.
- Then: Each feedback item is stored as a `ReviewIssue` linked to the session,
  containing: issue type (grammar / word-choice / structure), title, the user's
  original sentence, the AI-suggested revision, the reason, severity, and display order.

**AC-1.3 — Session data is retrievable by ID**
- Given: A session has been saved.
- When: The history detail page loads for that session's ID.
- Then: All session fields and linked review issues are returned correctly.

---

### Story 2 — Browse and filter practice history

**As** a learner who has completed multiple sessions,
**I want** to see a reverse-chronological list of my sessions filterable by scene and
date range, searchable by keyword,
**So that** I can quickly find a past exercise to review or re-do.

#### Acceptance Criteria

**AC-2.1 — Default listing**
- Given: Sessions exist in the database.
- When: The History page loads with no filters.
- Then: Sessions are returned newest-first; each entry exposes scene, createdAt,
  a short excerpt of sourceText, and a short excerpt of userTranslation.

**AC-2.2 — Scene filter**
- Given: The user selects "Interview" or "Daily" from the scene filter.
- When: The filter is applied.
- Then: Only sessions matching that scene are returned.

**AC-2.3 — Date-range filter**
- Given: The user selects "Last 7 days" or "Last 30 days".
- When: The filter is applied.
- Then: Only sessions created within the selected range are returned.

**AC-2.4 — Keyword search**
- Given: The user types a keyword in the search box.
- When: The search is submitted.
- Then: Only sessions whose `sourceText` or `userTranslation` contain the keyword
  (case-insensitive) are returned.

**AC-2.5 — Empty state**
- Given: No sessions match the active filters.
- When: The query executes.
- Then: An empty result set is returned (not an error).

---

### Story 3 — Generate and save flashcards from a session

**As** a user who has completed AI review,
**I want** to generate flashcards from my translation session and have them saved,
**So that** they appear in my review queue and persist between visits.

#### Acceptance Criteria

**AC-3.1 — Flashcards saved on confirmation**
- Given: A user clicks "Save Flashcards" on the Flashcard Generation page.
- When: The action is executed.
- Then: One or more `Flashcard` records are created linked to the session, each
  containing:
  - `front`: the native-language source text (full paragraph for Paragraph mode;
    one sentence for Sentence mode)
  - `backUserTranslation`: the user's translation corresponding to the front
  - `backAiRevision`: the AI-revised version
  - `backFeedbackSummary`: up to 3 key feedback points (array of strings)
  - `scene`, `context` (copied from session)
  - `mode` (paragraph or sentence)
  - Initial SM-2 state: `interval = 1`, `easeFactor = 2.5`, `repetitions = 0`,
    `nextReviewDate = now`

**AC-3.2 — Session links to its flashcards**
- Given: Flashcards have been generated from a session.
- When: The History detail page for that session loads.
- Then: The session record references the IDs of all linked flashcards so the UI
  can display "Linked Flashcards" chips.

**AC-3.3 — Paragraph mode produces one card per session**
- Given: The user selects Paragraph mode.
- When: Flashcards are saved.
- Then: Exactly one `Flashcard` record is created for the full translation.

**AC-3.4 — Sentence mode produces one card per sentence**
- Given: The user selects Sentence mode.
- When: Flashcards are saved.
- Then: One `Flashcard` record is created for each distinct sentence/phrase in the
  source text.

---

### Story 4 — Review today's due flashcards

**As** a learner with saved flashcards,
**I want** to see only the cards due for review today (new cards first, then overdue),
**So that** I work through my spaced-repetition queue efficiently.

#### Acceptance Criteria

**AC-4.1 — Due cards query**
- Given: Flashcards exist with various `nextReviewDate` values.
- When: The flashcard review page loads.
- Then: Only cards whose `nextReviewDate <= today` are returned.

**AC-4.2 — Ordering**
- Given: Due cards include new cards (never reviewed) and previously reviewed cards.
- When: The due card list is returned.
- Then: New cards (repetitions = 0) appear before cards with repetitions > 0; ties
  are broken by `createdAt` ascending.

**AC-4.3 — All-done state**
- Given: No cards are due (either none exist or all `nextReviewDate > today`).
- When: The due-card query runs.
- Then: An empty list is returned and the UI shows the "All caught up" empty state.

---

### Story 5 — Rate a flashcard and update SM-2 schedule

**As** a user reviewing a flashcard,
**I want** to rate my recall (0–5) and have the card's next review date recalculated,
**So that** difficult cards appear sooner and easy cards appear less often.

#### Acceptance Criteria

**AC-5.1 — Rating persisted as a log entry**
- Given: The user selects a rating for a card.
- When: The rating is submitted.
- Then: A `ReviewLog` record is created containing: flashcardId, rating, the
  interval and easeFactor values that existed *before* the update, and `reviewedAt`.

**AC-5.2 — SM-2 state updated on the flashcard**
- Given: The user submits a rating r for flashcard F.
- When: The update is processed.
- Then: The flashcard's `interval`, `easeFactor`, `repetitions`, and `nextReviewDate`
  are updated according to the SM-2 algorithm:

  | Rating | repetitions | interval | easeFactor |
  |--------|-------------|----------|------------|
  | 0–2    | reset to 0  | reset to 1 day | unchanged |
  | 3      | +1          | calculated by SM-2 | −0.14 (min 1.3) |
  | 4      | +1          | calculated by SM-2 | unchanged |
  | 5      | +1          | calculated by SM-2 | +0.1 |

  `nextReviewDate = reviewedAt + new interval (days)`

**AC-5.3 — Minimum ease factor**
- Given: Repeated low ratings have decreased `easeFactor`.
- When: Any further rating update would reduce `easeFactor` below 1.3.
- Then: `easeFactor` is clamped to 1.3, not reduced further.

---

### Story 6 — Re-do a past exercise

**As** a user viewing a history detail,
**I want** to click "Re-do This Exercise" and have the source text and context
pre-filled in the relevant input page,
**So that** I can practice the same content again without re-entering the setup.

#### Acceptance Criteria

**AC-6.1 — Session data available for re-do**
- Given: A session record exists with id `X`.
- When: The Re-do action is triggered from `/history/X`.
- Then: The session's `scene`, `context`, `sourceText`, and `aiReference` fields are
  accessible to pre-populate the input page form.

**AC-6.2 — Re-do creates a new session**
- Given: A user completes a re-do exercise through to AI Review.
- When: The session is saved.
- Then: A *new* `TranslationSession` record is created; the original session record
  is not modified.

---

### Story 7 — Flashcard count badge in navigation

**As** a user,
**I want** to see a count of due cards in the navigation bar,
**So that** I know at a glance whether I have cards to review today.

#### Acceptance Criteria

**AC-7.1 — Due count is accurate**
- Given: N cards are due today (`nextReviewDate <= today`).
- When: Any page in the app loads.
- Then: The navigation "Review" badge displays N; if N = 0 the badge is hidden.

---

## Non-Functional Requirements

| # | Requirement |
|---|-------------|
| NFR-1 | **Technology**: ORM is Prisma; database is PostgreSQL. |
| NFR-2 | **Data integrity**: Deleting a `TranslationSession` must cascade-delete its `ReviewIssue` and `Flashcard` children; deleting a `Flashcard` must cascade-delete its `ReviewLog` children. |
| NFR-3 | **Query performance**: The due-card query (`nextReviewDate <= today`) and the history listing query (`ORDER BY createdAt DESC`) must be covered by database indexes. |
| NFR-4 | **Type safety**: All database interactions must be fully type-checked via Prisma-generated types; no raw SQL for CRUD operations. |
| NFR-5 | **Schema migrations**: All schema changes must be applied via Prisma migrations (not manual DDL); migration files are committed to the repository. |
| NFR-6 | **Environment config**: `DATABASE_URL` must be supplied via environment variable; it must never be hard-coded in source files. |
| NFR-7 | **Local development**: A local PostgreSQL instance (or Docker Compose equivalent) must be documentable as the dev setup. |

---

## Data Model Summary

*(Entity names only — schema details are specified in plan.md)*

| Entity | Purpose |
|--------|---------|
| `TranslationSession` | One record per complete practice session |
| `ReviewIssue` | One record per AI feedback item within a session |
| `Flashcard` | One or more cards generated from a session; carries SM-2 state |
| `ReviewLog` | Immutable log of each rating event for a flashcard |

---

## Out of Scope

- **User accounts / authentication**: MVP is single-user; no `User` table or auth.
- **Multi-user isolation**: Row-level security and tenant separation are not required.
- **Soft deletes**: Records are hard-deleted; no `deletedAt` field.
- **Full-text search index**: Keyword search uses `ILIKE`; no Postgres `tsvector` or
  external search engine.
- **Flashcard import/export**: No CSV or Anki export.
- **Analytics or aggregated statistics**: No separate reporting tables.
- **Real-time subscriptions**: No WebSocket or SSE for live updates.

---

## Open Questions

*None — all requirements above are derived from the existing `specs/mvp/spec.md`,
`src/lib/types.ts`, and the database design reviewed with the user on 2026-03-01.*

---

## Checklist

- [x] Problem statement clear
- [x] All 6 MVP modules have corresponding user stories
- [x] SM-2 algorithm behaviour specified to AC level
- [x] Cascade-delete requirements stated in NFRs
- [x] Technology constraint documented
- [x] Scope boundaries defined
- [ ] **Next step**: Run `/sdd-plan` to produce `specs/001-database/plan.md`
  (Prisma schema, API contracts, migration strategy)
