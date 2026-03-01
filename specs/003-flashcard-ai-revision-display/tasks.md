# Tasks 003 — Flashcard AI Revision: Show All Changes with Detail View

**Spec:** specs/003-flashcard-ai-revision-display/spec.md
**Plan:** specs/003-flashcard-ai-revision-display/plan.md
**Status:** Done
**Created:** 2026-03-01

---

## Overview

17 tasks across 5 phases. Phases must run in order — types flow downward through the stack.
After T-05 (migration) the build breaks; it is fully restored by T-10.
Tests are written **before** implementation (TDD) where the target can be tested in isolation.

```
Phase A — Prep      T-01 → T-02           (extract util + write failing tests)
Phase B — Schema    T-03 → T-05           (migration + types — BUILD BREAKS)
Phase C — API       T-06 → T-09           (restore build, GREEN on API tests)
Phase D — UI        T-10 → T-14           (component + page — BUILD RESTORED)
Phase E — Verify    T-15 → T-17           (lint, test suite, existing test updates)
```

---

## Phase A — Preparation

### T-01 · Extract `buildCards` to a shared utility
**Goal:** Move `buildCards()` from `generate/page.tsx` (un-testable) to `src/lib/buildCards.ts` so it can be unit-tested.
**Spec ref:** plan §6
**Files touched:**
- Create `src/lib/buildCards.ts` (function + types)
- Edit `src/app/flashcard/generate/page.tsx` (import from lib, delete local definition)

**Validate:** `pnpm run lint`

---

### T-02 · Write failing unit tests for `buildCards` (RED)
**Goal:** Specify the new `issues[]`-based output shape before changing the implementation. These tests must FAIL at this point.
**Spec ref:** spec AC-1.1, AC-1.2, plan §9.1
**Files touched:**
- Create `src/lib/buildCards.test.ts`

**Test cases to cover:**
1. PARAGRAPH mode — `back.issues` equals `draft.issues` (all issues, not just first)
2. SENTENCE mode — each card's `back.issues` is a single-element array containing that issue
3. PARAGRAPH mode with zero issues — returns 1 card with `back.issues = []`
4. SENTENCE mode with zero issues — returns `[]`

**Validate:** `pnpm vitest run src/lib/buildCards.test.ts` → expect **FAIL** (issues field does not exist yet)

---

## Phase B — Schema & Types

### T-03 · Update Prisma schema
**Goal:** Replace `backAiRevision String` + `backFeedbackSummary Json` with `backIssues Json @default("[]")`.
**Spec ref:** spec §4.1, plan §2.1
**Files touched:**
- Edit `prisma/schema.prisma` — remove the two old fields, add `backIssues`

**Validate:** File saved. Do NOT run `prisma generate` yet (migration comes next).

---

### T-04 · Generate and apply Prisma migration
**Goal:** Create the SQL migration that drops the old columns and adds `backIssues`.
**Spec ref:** spec §4.2, plan §2.2
**Files touched:**
- New file auto-created: `prisma/migrations/<timestamp>_replace_back_fields_with_issues/migration.sql`
- `prisma/migrations/migration_lock.toml` (auto-updated)

**Command:** `pnpm prisma migrate dev --name replace-back-fields-with-issues`

**Note:** After this step, `prisma generate` re-creates the client. TypeScript now errors in any file that references `backAiRevision` or `backFeedbackSummary`. **Build is broken — expected.** Continue to T-05 immediately.

**Validate:** Migration runs without error; `src/generated/prisma` regenerated.

---

### T-05 · Update TypeScript types
**Goal:** Align `Flashcard.back` and `SaveFlashcardsInput` with the new schema.
**Spec ref:** spec §4.3, plan §3
**Files touched:**
- Edit `src/lib/types.ts`
  - `Flashcard.back`: remove `aiRevision: string` and `feedbackSummary: string[]`, add `issues: ReviewIssue[]`
  - `SaveFlashcardsInput.cards[]`: remove `backAiRevision` and `backFeedbackSummary`, add `backIssues: ReviewIssue[]`

**Validate:** `pnpm exec tsc --noEmit` → many errors remain (expected — fixed in C & D)

---

## Phase C — API & Service (Restore Build)

### T-06 · Update POST `/api/flashcards` route
**Goal:** Update Zod validation schema and Prisma create call to use `backIssues`.
**Spec ref:** spec §4.3, plan §4.1
**Files touched:**
- Edit `src/app/api/flashcards/route.ts`
  - Replace `backAiRevision: z.string()` and `backFeedbackSummary: z.array(z.string())` in Zod schema with `backIssues: z.array(issueSchema).default([])`
  - In `prisma.flashcard.create`: replace `backAiRevision` and `backFeedbackSummary` with `backIssues: card.backIssues`

The Zod `issueSchema` for the JSON column (lowercase to match `ReviewIssue` frontend type):
```typescript
const issueSchema = z.object({
  id: z.string(),
  type: z.enum(['grammar', 'word-choice', 'structure']),
  title: z.string(),
  original: z.string(),
  revised: z.string(),
  reason: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
})
```

**Validate:** `pnpm exec tsc --noEmit` (errors reduce)

---

### T-07 · Update GET `/api/flashcards/due` route
**Goal:** Replace `aiRevision`/`feedbackSummary` mapping with `issues` in the response shape.
**Spec ref:** spec §4.3, plan §4.2
**Files touched:**
- Edit `src/app/api/flashcards/due/route.ts`
  - In the `.map()`: remove `aiRevision: c.backAiRevision` and `feedbackSummary: ...`, add `issues: c.backIssues as ReviewIssue[]`
  - Add `import type { ReviewIssue } from '@/lib/types'` if not already present

**Validate:** `pnpm exec tsc --noEmit` (errors reduce further)

---

### T-08 · Update service layer
**Goal:** Map `back.issues` in `saveFlashcards()` and verify `getDueFlashcards()` types.
**Spec ref:** plan §5
**Files touched:**
- Edit `src/services/flashcard.ts`
  - `saveFlashcards()`: replace `backAiRevision: c.back.aiRevision` and `backFeedbackSummary: c.back.feedbackSummary` with `backIssues: c.back.issues`
  - `getDueFlashcards()`: the `ApiFlashcard` type alias re-derives automatically; verify no explicit field references remain

**Validate:** `pnpm exec tsc --noEmit` (service errors gone)

---

### T-09 · Update `buildCards` implementation
**Goal:** Rewrite `buildCards` in `src/lib/buildCards.ts` to produce `back.issues[]` instead of `back.aiRevision` + `back.feedbackSummary`.
**Spec ref:** plan §6
**Files touched:**
- Edit `src/lib/buildCards.ts`
  - PARAGRAPH mode: `back = { userTranslation: draft.userTranslation, issues: draft.issues }`
  - SENTENCE mode: `back = { userTranslation: iss.original, issues: [iss] }`

**Validate:**
```
pnpm vitest run src/lib/buildCards.test.ts
```
→ Tests written in T-02 should now **PASS** (GREEN). Back-end build should be clean:
```
pnpm exec tsc --noEmit
```

---

## Phase D — UI Components

### T-10 · Rewrite `Flashcard3D` component
**Goal:** Replace single AI Revision + Key Feedback sections with multi-issue animated accordion.
**Spec ref:** spec §3 (AC-1.x, AC-2.x, AC-3.x), spec §5, plan §7
**Files touched:**
- Edit `src/components/flashcard/Flashcard3D.tsx`

**Changes:**
1. Update `Flashcard3DProps.back` type: remove `aiRevision`/`feedbackSummary`, add `issues: ReviewIssue[]`
2. Add `sessionId?: string` prop (for the "More" link)
3. Import `ReviewIssue` from `@/lib/types`
4. Add internal `CorrectionItem` component:
   - Props: `issue: ReviewIssue`
   - State: `isOpen: boolean`
   - Collapsed: shows "Original" + original text, "Revised" + revised text, chevron icon
   - Expanded (animated via Framer Motion `AnimatePresence`): adds title, reason, type, severity
   - Toggle button: `<button aria-expanded={isOpen}` with `onClick(e) { e.stopPropagation(); toggle() }`
   - Accessibility: min 44px touch target
5. Replace old two `<section>` blocks with new AI Revision section:
   - Empty issues: `<p>No corrections needed</p>` (spec AC-1.3 / §5.2)
   - Non-empty: `issues.slice(0, 5).map(iss => <CorrectionItem key={iss.id} issue={iss} />)`
   - >5 issues: "More" link → `/history/${sessionId}` (fallback `#` if no sessionId)

**Validate:** `pnpm exec tsc --noEmit` → zero errors

---

### T-11 · Update review page
**Goal:** Pass `sessionId` to `Flashcard3D` (new prop added in T-10).
**Spec ref:** plan §8
**Files touched:**
- Edit `src/app/flashcard/review/page.tsx`
  - Add `sessionId={currentCard.sessionId}` to the `<Flashcard3D />` JSX

**Validate:** `pnpm exec tsc --noEmit` → zero errors; `pnpm run lint`

---

## Phase E — Verify

### T-12 · Update existing integration tests
**Goal:** Fix the `createSessionWithFlashcard` helper and test payloads in `flashcards.test.ts` to use `backIssues` instead of the old fields. Add new test cases.
**Spec ref:** plan §9.2
**Files touched:**
- Edit `src/app/api/flashcards/flashcards.test.ts`

**Changes:**
1. Update `createSessionWithFlashcard` helper:
   - Remove `backAiRevision` and `backFeedbackSummary`
   - Add `backIssues: []` (empty — simulates legacy card)
2. Update all POST test payloads: replace `backAiRevision`+`backFeedbackSummary` with `backIssues: [...]`
3. Add new test cases:
   - `POST: saves backIssues array and reads it back correctly` — create card with 2 issue objects, fetch from DB, assert `backIssues` equals the input
   - `POST: backIssues defaults to [] when omitted` — omit `backIssues` in payload, assert DB has `[]`
   - `POST: rejects old backAiRevision field shape` — send `backAiRevision: "x"` without `backIssues`, assert 400 (Zod error)
   - `GET /due: returns back.issues array` — create card with issues, GET /due, assert `body.data[0].back.issues` has correct shape
   - `GET /due: legacy card (backIssues=[]) returns back.issues = []` — card with empty issues, assert no crash and `back.issues = []`

**Validate:**
```
pnpm vitest run src/app/api/flashcards/flashcards.test.ts
```
→ all tests **PASS**

---

### T-13 · Full lint pass
**Goal:** No ESLint errors in touched files.
**Files touched:** (read-only)
**Validate:** `pnpm run lint`

---

### T-14 · Full type-check pass
**Goal:** Zero TypeScript errors across the entire project.
**Validate:** `pnpm exec tsc --noEmit`

---

### T-15 · Full test suite
**Goal:** All existing + new tests pass.
**Validate:**
```
pnpm vitest run
```
→ all suites green (sm2, sessions, flashcards, buildCards)

---

### T-16 · Build check
**Goal:** Production build succeeds (catches Next.js-specific issues missed by tsc).
**Validate:** `pnpm run build`

---

### T-17 · Update spec status
**Goal:** Mark spec and tasks as Implemented.
**Files touched:**
- Edit `specs/003-flashcard-ai-revision-display/spec.md` — set `Status: Implemented`
- Edit `specs/003-flashcard-ai-revision-display/tasks.md` — set `Status: Done`

---

## Task Summary

| Task | Phase | Files | Test gate |
|------|-------|-------|-----------|
| T-01 | A | `src/lib/buildCards.ts`, `generate/page.tsx` | `pnpm run lint` |
| T-02 | A | `src/lib/buildCards.test.ts` | vitest RED (expected fail) |
| T-03 | B | `prisma/schema.prisma` | file saved |
| T-04 | B | migration SQL (auto) | migration succeeds |
| T-05 | B | `src/lib/types.ts` | tsc (partial errors expected) |
| T-06 | C | `src/app/api/flashcards/route.ts` | tsc (errors reduce) |
| T-07 | C | `src/app/api/flashcards/due/route.ts` | tsc (errors reduce) |
| T-08 | C | `src/services/flashcard.ts` | tsc (service errors gone) |
| T-09 | C | `src/lib/buildCards.ts` | vitest GREEN ✓ |
| T-10 | D | `src/components/flashcard/Flashcard3D.tsx` | tsc zero errors |
| T-11 | D | `src/app/flashcard/review/page.tsx` | tsc + lint |
| T-12 | E | `src/app/api/flashcards/flashcards.test.ts` | vitest flashcards GREEN ✓ |
| T-13 | E | (read-only) | `pnpm run lint` |
| T-14 | E | (read-only) | `pnpm exec tsc --noEmit` |
| T-15 | E | (read-only) | `pnpm vitest run` all green ✓ |
| T-16 | E | (read-only) | `pnpm run build` |
| T-17 | E | spec.md, tasks.md | — |

---

## Progress

- [x] T-01 Extract `buildCards` to `src/lib/buildCards.ts`
- [x] T-02 Write failing `buildCards` tests (RED)
- [x] T-03 Update Prisma schema
- [x] T-04 Generate + apply migration
- [x] T-05 Update TypeScript types
- [x] T-06 Update POST `/api/flashcards` route
- [x] T-07 Update GET `/api/flashcards/due` route
- [x] T-08 Update service layer
- [x] T-09 Rewrite `buildCards` implementation (GREEN)
- [x] T-10 Rewrite `Flashcard3D` component
- [x] T-11 Update review page
- [x] T-12 Update existing integration tests
- [x] T-13 Full lint pass
- [x] T-14 Full type-check pass
- [x] T-15 Full test suite
- [x] T-16 Build check
- [x] T-17 Update spec status
