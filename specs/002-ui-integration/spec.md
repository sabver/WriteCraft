# Spec: UI Integration — Wire Pages to Real APIs

**Feature ID**: 002-ui-integration
**Status**: Implemented
**Created**: 2026-03-01
**Depends on**: 001-database (all API routes + service layer complete)

---

## Problem Statement

The WriteCraft frontend pages currently display hardcoded mock data. The API routes
and service layer from 001-database are complete. This feature replaces all mock data
with real API calls so the full user flow — practice → review → flashcard → history —
persists and renders live data.

**Scope**:
- **Scope A**: History pages (isolated; service wrappers ready)
- **Scope B**: Practice flow pages (cross-page state via sessionStorage)

---

## User Stories & Acceptance Criteria

### Story 1 — History list reflects real sessions

**As** a user, **I want** the History page to show my actual practice sessions,
**So that** I can review what I've done.

**AC-1.1 — List loads from API on mount**
- Given: Sessions exist in the DB
- When: User visits `/history`
- Then: Real sessions appear, newest first

**AC-1.2 — Filter by scene works**
- Given: User selects "Interview" tab
- Then: Only INTERVIEW sessions are shown

**AC-1.3 — Keyword search works**
- Given: User types in the search box (debounced)
- Then: Results narrow to matching sourceText / userTranslation

**AC-1.4 — Date range filter works**
- Given: User selects "7d" or "30d"
- Then: Only sessions within that range appear

---

### Story 2 — History detail shows real data

**As** a user, **I want** the History detail page to show the actual session I selected,
**So that** I can review my translation and the AI feedback.

**AC-2.1 — Detail loads correct session**
- Given: A sessionId exists in the URL
- When: User visits `/history/[id]`
- Then: Real sourceText, userTranslation, aiReference, and issues are shown

**AC-2.2 — Related flashcards shown**
- Given: Session has associated flashcards
- Then: Links to `/flashcard/review` appear for each flashcard

---

### Story 3 — Practice flow persists to DB

**As** a user, **I want** my practice session saved automatically when I submit for AI review,
**So that** it appears in History without extra steps.

**AC-3.1 — Session created on translation submit**
- Given: User completes Context → Source → Translation on `/interview` or `/daily`
- When: User clicks "Submit for AI Review"
- Then: `POST /api/review` is called, then `createSession()` is called with the result
- Then: A `sessionId` is stored in sessionStorage and user is navigated to `/review`

**AC-3.2 — Review page shows real issues**
- Given: sessionStorage contains a valid draft
- When: User lands on `/review`
- Then: Real `issues` from the AI are displayed (no additional API call)

**AC-3.3 — Flashcard generate uses real session**
- Given: sessionStorage contains `sessionId`
- When: User saves flashcards on `/flashcard/generate`
- Then: `saveFlashcards()` is called with the real `sessionId`
- Then: sessionStorage draft is cleared after successful save

---

## Non-Functional Requirements

**NFR-1** — Pages must show a loading skeleton while async data loads.
**NFR-2** — API errors must display a user-readable message (not crash).
**NFR-3** — Search input must be debounced (≥ 300 ms) to avoid excessive requests.
**NFR-4** — sessionStorage is the cross-page state mechanism (no React context refactor).
**NFR-5** — Function signatures in existing services must not change (no cascading component edits).
**NFR-6** — `pnpm exec tsc --noEmit` and `pnpm run lint` must pass after all changes.
