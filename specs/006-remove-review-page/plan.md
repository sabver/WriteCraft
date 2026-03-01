# Plan 006 — Remove `/review` and Consolidate into `/history/[id]`

**Spec:** `specs/006-remove-review-page/spec.md`
**Status:** Ready for tasks

---

## Architecture Overview

### Current data flow

```
/daily or /interview
  → POST /api/review
  → createSession() → DB
  → sessionStorage.setItem('writecraft:session-draft', …)
  → router.push('/review')

/review
  → sessionStorage.getItem('writecraft:session-draft')
  → show issues
  → "Generate Flashcards" → /flashcard/generate

/flashcard/generate
  → sessionStorage.getItem('writecraft:session-draft')
  → buildCards()
  → saveFlashcards()
```

### Target data flow

```
/daily or /interview
  → POST /api/review
  → createSession() → DB  →  returns sessionId
  → router.push('/history/<sessionId>')          ← only change here

/history/[id]
  → getSession(id) from DB
  → show source + translation + issues
  → "Generate Flashcards" (no flashcards yet) → /flashcard/generate?sessionId=<id>
  → "View Flashcards" (flashcards exist)       → /flashcard/review

/flashcard/generate?sessionId=<id>             ← data source changes
  → getSession(id) from DB
  → buildCards()
  → saveFlashcards()
```

### sessionStorage dependency graph

| File | Current usage | After change |
|------|--------------|--------------|
| `src/app/daily/page.tsx` | write | **removed** |
| `src/app/interview/page.tsx` | write | **removed** |
| `src/app/review/page.tsx` | read | **file deleted** |
| `src/app/flashcard/generate/page.tsx` | read | **replaced by API fetch** |

---

## Change Inventory

### 1. Submission pages (`daily`, `interview`) — spec US-1, US-5

**Files:** `src/app/daily/page.tsx`, `src/app/interview/page.tsx`

In `handleTranslationSubmit`, after `createSession()` succeeds:
- **Remove** the `sessionStorage.setItem(…)` call
- **Change** `router.push('/review')` → `router.push('/history/${sessionId}')`

No other logic changes needed. Both files are structurally identical for this part.

---

### 2. History detail page — spec US-2, US-3

**File:** `src/app/history/[id]/page.tsx`

**Remove** the `ProgressStepper` import and its JSX (spec US-2 — no stepper anywhere on this page).

**Add** a sticky `ActionBar` at the bottom with a conditional CTA (spec US-3):
- `session.flashcardIds.length === 0` → "Generate Flashcards" button → `/flashcard/generate?sessionId=<id>`
- `session.flashcardIds.length > 0` → "View Flashcards" button → `/flashcard/review`

The `flashcardIds` field is already returned by `getSession()` in `SessionDetail` — no API change needed.

---

### 3. Flashcard generate page — spec US-5 (necessary dependency)

**File:** `src/app/flashcard/generate/page.tsx`

> **Note:** The spec lists `/flashcard/generate` as "out of scope for redesign", but removing the `sessionStorage` write makes its current data source invalid. This change is required to preserve the end-to-end flow.

**Replace** `readDraft()` (reads sessionStorage) with `useSearchParams()` + `getSession(sessionId)`:
- Read `sessionId` from the `?sessionId=` URL param
- Fetch `SessionDetail` from `getSession(sessionId)` on mount
- Adapt the result to `SessionDraft` shape (all required fields are present in `SessionDetail`)
- The `buildCards()` function and `saveFlashcards()` are unchanged

`SessionDetail` → `SessionDraft` mapping:

| `SessionDraft` field | `SessionDetail` source |
|---|---|
| `sessionId` | `id` |
| `scene` | `scene` |
| `context` | `context` |
| `sourceText` | `sourceText` |
| `userTranslation` | `userTranslation` |
| `issues` | `issues` |

No changes to `buildCards.ts` or `saveFlashcards`.

---

### 4. Delete `/review` route — spec US-4

**Delete:** `src/app/review/` directory (entire folder including `page.tsx`)

Next.js will return 404 for `/review` automatically once the directory is removed.

---

### 5. i18n cleanup — spec US-5

**Files:** `messages/en.json`, `messages/zh-CN.json`

Remove the `"review"` namespace from both files. The keys `generateFlashcardsBtn` and `startPracticeBtn` are useful but their translations can be reused from `historyDetail` namespace (or new keys added there if text differs).

Add to `historyDetail` namespace:
- `generateFlashcardsBtn` — "Generate Flashcards"
- `viewFlashcardsBtn` — "View Flashcards"

---

### 6. Out of scope — no changes needed

- `src/app/history/page.tsx` — untouched
- `src/lib/buildCards.ts` — untouched
- `src/services/sessions.ts` — untouched (already has `getSession`)
- `src/lib/types.ts` — untouched
- `src/app/flashcard/review/page.tsx` — untouched
- DB schema / API routes — untouched

---

## Testing Strategy

### Unit / integration (vitest)

| Test | Spec ref |
|---|---|
| After submission, redirect target is `/history/<sessionId>` (not `/review`) | US-1 |
| After submission, `sessionStorage.getItem('writecraft:session-draft')` returns null | US-5 |
| `/history/[id]` with `flashcardIds: []` renders "Generate Flashcards" button | US-3 |
| `/history/[id]` with `flashcardIds: ['x']` renders "View Flashcards" button | US-3 |
| `/history/[id]` does NOT render `ProgressStepper` | US-2 |
| `/flashcard/generate` with `?sessionId=<id>` fetches session and shows preview | US-5 |

### Regression (existing tests must stay green)

- All existing vitest tests (102 currently passing)
- Specifically: `src/app/api/sessions/sessions.test.ts`, `src/app/api/flashcards/flashcards.test.ts`

### E2E (Playwright — optional, spec US-1 is the most valuable)

Full submission flow: `/daily` → complete 3 steps → land on `/history/<id>` → refresh → data intact.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| `/flashcard/generate` breaks silently if `?sessionId` param is missing | Medium | Show a clear empty/error state if param absent; redirect to `/history` |
| Stale sessionStorage data left from before the change causes confusion in dev | Low | Clear sessionStorage in the same commit or add a dev-time migration guard |
| i18n key removal causes missing-translation runtime warnings | Low | Delete keys and add replacements in the same task; run completeness test |

---

## File Change Summary

| File | Change type |
|---|---|
| `src/app/daily/page.tsx` | Edit — remove sessionStorage write, change redirect |
| `src/app/interview/page.tsx` | Edit — same |
| `src/app/history/[id]/page.tsx` | Edit — remove stepper, add ActionBar CTA |
| `src/app/flashcard/generate/page.tsx` | Edit — replace sessionStorage read with API fetch |
| `src/app/review/page.tsx` | **Delete** |
| `messages/en.json` | Edit — remove `review` namespace, add keys to `historyDetail` |
| `messages/zh-CN.json` | Edit — same |
