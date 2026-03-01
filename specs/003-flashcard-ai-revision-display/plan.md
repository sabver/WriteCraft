# Plan 003 — Flashcard AI Revision: Show All Changes with Detail View

**Spec:** specs/003-flashcard-ai-revision-display/spec.md
**Status:** Draft
**Created:** 2026-03-01

---

## 1. Architecture Overview

The change is a vertical slice through 6 layers, all touching the same `backIssues` data field:

```
generate/page.tsx  (buildCards — writes issues)
       ↓
services/flashcard.ts  (serializes for HTTP)
       ↓
POST /api/flashcards   (validates + persists)
       ↑
GET  /api/flashcards/due  (reads + deserializes)
       ↑
services/flashcard.ts  (maps to Flashcard type)
       ↑
review/page.tsx  → Flashcard3D.tsx  (renders)
```

**Core principle:** Replace the two thin `backAiRevision: String` + `backFeedbackSummary: Json (string[])` columns with a single `backIssues: Json (ReviewIssue[])` column that carries all issue data. Every layer that currently reads/writes the old fields must be updated in lock-step.

No new routes, no new pages, no new services.

---

## 2. Data Model Changes

### 2.1 Prisma Schema  *(spec §4.1, §4.2)*

**File:** `prisma/schema.prisma`

Remove from the `Flashcard` model:
```prisma
backAiRevision      String @db.Text
backFeedbackSummary Json   // string[] max 3 items
```

Add:
```prisma
backIssues Json @default("[]")  // ReviewIssue[]  spec §4.1
```

### 2.2 Migration

Generate via:
```
pnpm prisma migrate dev --name replace-back-fields-with-issues
```

Migration SQL effect:
- `ALTER TABLE "Flashcard" DROP COLUMN "backAiRevision"`
- `ALTER TABLE "Flashcard" DROP COLUMN "backFeedbackSummary"`
- `ALTER TABLE "Flashcard" ADD COLUMN "backIssues" JSONB NOT NULL DEFAULT '[]'`

**Backward compatibility:** All existing rows get `backIssues = []`.
The review UI renders "No corrections needed" for empty arrays *(spec §5.2, AC-3.1)*.

---

## 3. TypeScript Type Changes

**File:** `src/lib/types.ts`

### 3.1 `Flashcard.back`

```typescript
// BEFORE
back: {
  userTranslation: string;
  aiRevision: string;
  feedbackSummary: string[];
}

// AFTER  (spec §4.3)
back: {
  userTranslation: string;
  issues: ReviewIssue[];
}
```

### 3.2 `SaveFlashcardsInput.cards[]`

```typescript
// BEFORE
cards: Array<{
  front: string
  backUserTranslation: string
  backAiRevision: string
  backFeedbackSummary: string[]
}>

// AFTER
cards: Array<{
  front: string
  backUserTranslation: string
  backIssues: ReviewIssue[]
}>
```

`ReviewIssue` already has all required fields (`id`, `type`, `title`, `original`, `revised`, `reason`, `severity`) — no change to that interface.

---

## 4. API Contract Changes

See `specs/003-flashcard-ai-revision-display/contracts/` for full schemas.

### 4.1 POST `/api/flashcards`  *(spec §4.3)*

**File:** `src/app/api/flashcards/route.ts`

**Zod schema delta:**

Remove:
```typescript
backAiRevision: z.string(),
backFeedbackSummary: z.array(z.string()),
```

Add:
```typescript
backIssues: z.array(z.object({
  id: z.string(),
  type: z.enum(['GRAMMAR', 'WORD_CHOICE', 'STRUCTURE']),
  title: z.string(),
  original: z.string(),
  revised: z.string(),
  reason: z.string(),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']),
})).default([]),
```

**`prisma.flashcard.create` data delta:**

Remove: `backAiRevision`, `backFeedbackSummary`
Add: `backIssues: card.backIssues`

> Note: The generate page uses lowercase enums for `IssueType`/`Severity`; the Zod schema here must decide on casing. The existing `ReviewIssue` frontend type uses lowercase (`'grammar'`, `'high'`). The Prisma `IssueTypeDB`/`SeverityDB` use uppercase. **Decision:** Store the issues JSON in lowercase (matching frontend `ReviewIssue`) — the JSON column is not a Prisma enum, so casing is arbitrary. Zod schema should accept lowercase to match the existing `ReviewIssue` type.

Revised Zod:
```typescript
backIssues: z.array(z.object({
  id: z.string(),
  type: z.enum(['grammar', 'word-choice', 'structure']),
  title: z.string(),
  original: z.string(),
  revised: z.string(),
  reason: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
})).default([]),
```

### 4.2 GET `/api/flashcards/due`  *(spec §4.3)*

**File:** `src/app/api/flashcards/due/route.ts`

**Mapping delta:**

Remove: `aiRevision: c.backAiRevision`, `feedbackSummary: c.backFeedbackSummary as string[]`
Add: `issues: c.backIssues as ReviewIssue[]`

---

## 5. Service Layer Changes

**File:** `src/services/flashcard.ts`

### `saveFlashcards()`

Input type changes from `Omit<Flashcard, ...>` (which now has `back.issues`) automatically.

Body mapping delta:
```typescript
// BEFORE
backAiRevision: c.back.aiRevision,
backFeedbackSummary: c.back.feedbackSummary,

// AFTER
backIssues: c.back.issues,
```

Note: `mode` is currently hardcoded as `'PARAGRAPH'` in the service. The generate page already selects `paragraph` or `sentence`. **This remains unchanged** — mode is a generation metadata field, not used in the display path.

### `getDueFlashcards()`

`ApiFlashcard` type alias re-derives from the updated `Flashcard` type automatically — no explicit change needed there, but the type cast on API response shape may need updating.

---

## 6. Generate Page Changes

**File:** `src/app/flashcard/generate/page.tsx`

**`buildCards()` function rewrite:**

```typescript
// PARAGRAPH mode — BEFORE: issues[0].revised only + titles
// PARAGRAPH mode — AFTER: all issues passed through
back: {
  userTranslation: draft.userTranslation,
  issues: draft.issues,   // all ReviewIssue objects
}

// SENTENCE mode — BEFORE: one card per issue with feedbackSummary: [reason]
// SENTENCE mode — AFTER: one card per issue with issues: [the single issue]
back: {
  userTranslation: iss.original,
  issues: [iss],
}
```

`FlashcardInput` type is `Omit<Flashcard, ...>` so it picks up the type change automatically.

---

## 7. Flashcard3D Component Redesign

**File:** `src/components/flashcard/Flashcard3D.tsx`

This is the largest change — the back face "AI Revision" + "Key Feedback" sections are replaced with the new multi-issue accordion.

### 7.1 Props Interface Update

```typescript
// BEFORE
back: {
  userTranslation: string;
  aiRevision: string;
  feedbackSummary: string[];
}

// AFTER
back: {
  userTranslation: string;
  issues: ReviewIssue[];
}
sessionId?: string;   // for the "More" link  (spec §5.1)
```

### 7.2 New AI Revision Section Layout  *(spec §5.1, §5.2, §5.3)*

Replace the current two `<section>` blocks (AI Revision + Key Feedback) with:

```
<section>
  <BlockLabel>AI Revision</BlockLabel>

  IF issues.length === 0:
    → "No corrections needed" message  (spec §5.2)

  ELSE:
    For each issue in issues.slice(0, 5):
      <CorrectionItem key={issue.id} issue={issue} />

    IF issues.length > 5:
      → "More" link/button → sessionId ? `/history/${sessionId}` : `/flashcard/review`
</section>
```

### 7.3 `CorrectionItem` Sub-component  *(spec §3, AC-2.1–2.4)*

Internal component (same file or extracted):

- **Collapsed state:** Shows "Original" label + original text, "Revised" label + revised text, chevron icon
- **Expanded state:** Adds title + reason + type badge + severity badge (animated height)
- **Toggle:** Each item manages its own `isOpen` boolean state
- **Animation:** `framer-motion` `AnimatePresence` + `motion.div` with `height: 0 → auto` (consistent with existing Framer Motion usage in the file)
- **Accessibility:** `<button>` with `aria-expanded={isOpen}` wraps the clickable header

### 7.4 Event Propagation

The card's outer `onClick` flips the card. The correction item's expand button must call `e.stopPropagation()` to prevent triggering the flip animation.

### 7.5 "More" Link Target

The spec says redirect to a page showing all corrections. The flashcard carries `sessionId`, which maps to the existing history detail page at `/history/[id]` (from spec 002). The `Flashcard3D` component receives an optional `sessionId` prop; the review page already has this data on each card.

---

## 8. Review Page Wiring

**File:** `src/app/flashcard/review/page.tsx`

The `Flashcard3D` is rendered here. The page has `cards` state, each card has `id`, `sessionId`, `front`, `back`. After the type changes, the call site becomes:

```tsx
<Flashcard3D
  front={currentCard.front}
  back={currentCard.back}          // now has .issues[]
  sessionId={currentCard.sessionId} // new prop for "More" link
  onFlip={setIsFlipped}
/>
```

This is a minimal change — just add `sessionId`.

---

## 9. Testing Strategy

### 9.1 Unit Tests

| Test | File | What to verify |
|------|------|----------------|
| `buildCards()` paragraph mode | `generate/page.test.ts` | `back.issues` equals `draft.issues` (all) |
| `buildCards()` sentence mode | `generate/page.test.ts` | Each card's `back.issues` is a single-item array |
| `buildCards()` no issues | `generate/page.test.ts` | Returns `[]` gracefully |
| `CorrectionItem` expand/collapse | `Flashcard3D.test.tsx` | Renders details on click, hides on second click |
| `Flashcard3D` empty issues | `Flashcard3D.test.tsx` | Renders "No corrections needed" |
| `Flashcard3D` >5 issues | `Flashcard3D.test.tsx` | Shows "More" button |
| `Flashcard3D` ≤5 issues | `Flashcard3D.test.tsx` | No "More" button |

### 9.2 Integration Tests

| Test | File | What to verify |
|------|------|----------------|
| POST `/api/flashcards` accepts `backIssues` | `flashcards.test.ts` | 201 + ids returned |
| POST rejects old `backAiRevision` shape | `flashcards.test.ts` | 400 Zod error |
| GET `/api/flashcards/due` returns `back.issues` | `flashcards-due.test.ts` | Shape matches `ReviewIssue[]` |
| Legacy card (backIssues=[]) served safely | `flashcards-due.test.ts` | `back.issues` is `[]`, no crash |

### 9.3 E2E (Playwright)

| Journey | What to verify |
|---------|----------------|
| Generate → Review: flip card, see all corrections | All `original → revised` pairs visible |
| Expand a correction | Details section appears with title + reason |
| Collapse a correction | Details section disappears |
| Card with >5 corrections | "More" link visible and navigates |
| Card with 0 corrections | "No corrections needed" shown |

---

## 10. Implementation Sequence

The phases must be executed in order (types flow downward):

| Phase | File(s) | Spec §ref |
|-------|---------|-----------|
| 1 | `prisma/schema.prisma` + migration | §4.1, §4.2 |
| 2 | `src/lib/types.ts` | §4.3 |
| 3 | `src/app/api/flashcards/route.ts` | §4.3 |
| 4 | `src/app/api/flashcards/due/route.ts` | §4.3 |
| 5 | `src/services/flashcard.ts` | §4.3 |
| 6 | `src/app/flashcard/generate/page.tsx` | §4.2 |
| 7 | `src/components/flashcard/Flashcard3D.tsx` | §5.1, §5.2, §5.3 |
| 8 | `src/app/flashcard/review/page.tsx` | §5.1 |
| 9 | Tests + lint | §9 |

After phase 1, the build will break until phase 5 is complete — all field references are invalid. Run `pnpm build` only after phase 5 to confirm the back-end compiles clean, then add the front-end phases.

---

## 11. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Existing prod data is lost (backAiRevision values) | Medium | This is a dev-stage project (no prod users yet per context). Legacy rows get `backIssues=[]` which degrades gracefully per spec §3. |
| Click on CorrectionItem triggers card flip | High | `e.stopPropagation()` in the expand button's onClick handler. |
| Framer Motion height animation on `h-auto` requires special handling | Medium | Use `motion.div` with `initial={{ height: 0 }}` and `animate={{ height: 'auto' }}` — Framer Motion supports this since v6 via layout animation or direct height interpolation. |
| `backIssues` JSON cast unsafe at runtime | Low | Zod validates on write; `as ReviewIssue[]` cast on read is consistent with existing `backFeedbackSummary as string[]` pattern. |
| "More" link destination `/history/[sessionId]` may not exist | Low | Spec §7 calls it out of scope; fall back to `#` or omit if route check fails. |
| `saveFlashcards()` hardcodes `mode: 'PARAGRAPH'` | Existing | Out of scope for this spec; noted but not fixed here. |

---

## 12. Out of Scope (re-affirmed from spec)

- Re-generating corrections for legacy cards
- Displaying `type` / `severity` as visual badges (persisting is in scope; whether to show as UI badges is optional)
- Editing corrections from the review page
- SM-2 scheduling changes
- Building the history detail page (assumed to exist)
