# Spec 003 — Flashcard AI Revision: Show All Changes with Detail View

**Status:** Implemented
**Created:** 2026-03-01

---

## 1. Problem Statement

On the `/flashcard/review` page, the **AI REVISION** section of a flipped flashcard currently shows only a single revised text string — derived from the first `ReviewIssue` in the session. This means users miss all other AI corrections when there are multiple issues.

Additionally, the underlying data for each change (the issue `title`, `reason`, `type`, `severity`) is discarded at save time and never presented to the user. Users have no way to understand *why* a correction was made or *which specific fragment* was changed.

**Root cause:**
The `backAiRevision` database field stores only a single `string` (the `revised` text of the first issue). The `backFeedbackSummary` stores only an array of issue titles — no `original`, `revised`, `reason`, `type`, or `severity` per issue. Full issue data is lost after the generation step.

---

## 2. Goals

1. Display **all** `original → revised` change pairs in the AI REVISION section, not just the first one.
2. Allow users to expand each change (with animation) to see its `title`, `reason`, `type`, and `severity`.
3. Show at most 5 corrections inline; provide a "More" link when there are additional corrections.
4. Persist the full set of issues (replacing the old `backAiRevision` / `backFeedbackSummary` fields) so future review sessions show the same rich data.

---

## 3. User Stories & Acceptance Criteria

### Story 1 — View all AI corrections on a flashcard

**As a** learner reviewing a flashcard,
**I want** to see every sentence or phrase the AI corrected (original and revised),
**So that** I understand the full scope of improvements in my translation.

#### Acceptance Criteria

| # | Given | When | Then |
|---|-------|------|------|
| 1.1 | A flashcard has multiple AI corrections | The user flips the card to the back | All `original → revised` pairs are displayed in the AI REVISION section |
| 1.2 | A flashcard has exactly one AI correction | The user flips the card | One `original → revised` pair is displayed |
| 1.3 | A flashcard has no AI corrections (translation was perfect) | The user flips the card | The AI REVISION section shows a "No corrections needed" message |
| 1.4 | Each pair is displayed | — | The **original** text and the **revised** text are visually distinct (e.g., different colors or labels) |
| 1.5 | A flashcard has more than 5 corrections | The user flips the card | The first 5 corrections are shown, with a "More" button/link below |
| 1.6 | The user clicks the "More" button | — | The user is redirected to a dedicated review/detail page where all corrections are visible |

---

### Story 2 — Expand a correction to see explanation

**As a** learner reviewing a flashcard,
**I want** to expand any individual correction and read its title, reason, type, and severity,
**So that** I can learn *why* the AI made the change.

#### Acceptance Criteria

| # | Given | When | Then |
|---|-------|------|------|
| 2.1 | A correction pair is visible | The user clicks/taps on it | An inline detail section expands **with animation** showing `title`, `reason`, `type`, and `severity` |
| 2.2 | The detail section is open | The user clicks/taps again | The detail section collapses with animation |
| 2.3 | Multiple corrections exist | The user expands one | Only that correction's detail expands; others remain collapsed |
| 2.4 | The detail section is expanded | — | It shows `title`, `reason`, `type`, and `severity` |

---

### Story 3 — Legacy flashcards degrade gracefully

**As a** learner reviewing flashcards created before this feature,
**I want** a graceful experience even if old cards lack the detailed issue data,
**So that** the app does not break or show broken UI.

#### Acceptance Criteria

| # | Given | When | Then |
|---|-------|------|------|
| 3.1 | A legacy flashcard has no `backIssues` data in the DB | The user flips it | The card renders without errors; the AI REVISION section either shows a "No corrections needed" message or nothing |
| 3.2 | A new flashcard with full issue data | The user flips it | All corrections and the expand affordance are shown |

---

## 4. Data Requirements

### 4.1 Schema change

Replace the existing `backAiRevision String` and `backFeedbackSummary Json` fields on the `Flashcard` model with a single `backIssues Json` field that stores an array of issue objects.

Each issue object must contain:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Issue identifier |
| `type` | `'grammar' \| 'word-choice' \| 'structure'` | Issue category |
| `title` | string | Short label describing the issue |
| `original` | string | The original fragment before correction |
| `revised` | string | The corrected fragment |
| `reason` | string | Explanation of why the change was made |
| `severity` | `'high' \| 'medium' \| 'low'` | Issue severity |

### 4.2 Migration strategy

- The old `backAiRevision` and `backFeedbackSummary` fields are **removed entirely**.
- A Prisma migration is required to drop the old columns and add `backIssues Json @default("[]")`.
- Existing rows will have `backIssues = []` (empty array), which maps to Story 3 (legacy graceful degradation).

### 4.3 API contract changes

- **POST `/api/flashcards`** — must accept `backIssues` (array of issue objects) instead of `backAiRevision` + `backFeedbackSummary`.
- **GET `/api/flashcards/due`** — must return `back.issues` (array) instead of `back.aiRevision` + `back.feedbackSummary`.
- **Frontend `Flashcard` type** — the `back` object changes accordingly:

```typescript
// Before
back: {
  userTranslation: string;
  aiRevision: string;
  feedbackSummary: string[];
}

// After
back: {
  userTranslation: string;
  issues: ReviewIssue[];   // full issue objects
}
```

---

## 5. Display Requirements

### 5.1 AI REVISION section (card back)

- Each correction is presented as a distinct collapsible item.
- Each item shows:
  - **Original** text — visually differentiated (e.g., muted color, labelled "Original")
  - **Revised** text — visually differentiated (e.g., primary/accent color, labelled "Revised")
  - A chevron icon or similar affordance indicating it is expandable
- Expanding an item with animation reveals: `title`, `reason`, `type`, and `severity`.
- At most **5** corrections are shown inline.
- When the card has **more than 5** corrections, a "More" button or link appears below the 5th item and redirects the user to a detail/review page for that flashcard.

### 5.2 No-correction state

- If `issues` is empty (`[]`), the AI REVISION section displays:
  > "No corrections needed"
- The message is styled consistently with the rest of the card back.

### 5.3 Animation

- The expand/collapse of each correction detail uses a smooth height animation (not instant toggle).
- The chevron icon rotates to indicate open/closed state.

---

## 6. Non-Functional Requirements

- **Data integrity:** The schema migration must not lose data from existing `backAiRevision` or `backFeedbackSummary` columns for rows that have already been reviewed. (Legacy rows become empty-issues cards — see §4.2.)
- **Performance:** Expanding/collapsing is client-side only with no network requests.
- **Accessibility:** The expand/collapse affordance must be keyboard-accessible (`button` element) with appropriate `aria-expanded` attribute.
- **Mobile-friendliness:** Touch targets for expanding corrections must be at least 44×44 px.
- **Type safety:** All new fields must be fully typed; the `ReviewIssue` type must be reused/extended rather than duplicated.

---

## 7. Out of Scope

- Re-generating AI corrections for legacy flashcards.
- Editing or overriding AI corrections from the review page.
- Sorting or filtering corrections by `severity` or `type`.
- Displaying `severity` or `type` as a visual badge/chip (persisting is in scope; displaying is optional).
- Changes to the rating (0–5) system or SM-2 scheduling logic.
- The dedicated detail/review page that "More" links to (that page is assumed to already exist or is a separate spec).

---

## 8. Resolved Clarifications

| # | Question | Decision |
|---|----------|----------|
| Q1 | Legacy field retention strategy | **Replace** `backAiRevision` + `backFeedbackSummary` entirely with new `backIssues Json` field |
| Q2 | Zero-corrections display | Show **"No corrections needed"** message |
| Q3 | Animation preference | **Expand/collapse with animation** |
| Q4 | Max corrections inline | **5 corrections max**, then a "More" button/link to a dedicated detail page |
| Q5 | Fields to persist | **All fields**: `id`, `type`, `title`, `original`, `revised`, `reason`, `severity` |

---

## 9. Checklist

- [x] Q1 resolved: replace old fields with `backIssues`
- [x] Q2 resolved: show "No corrections needed"
- [x] Q3 resolved: animated expand/collapse
- [x] Q4 resolved: max 5 inline, "More" link for overflow
- [x] Q5 resolved: all `ReviewIssue` fields persisted
- [ ] Spec reviewed and signed off before plan phase begins
