# Tasks 006 — Remove `/review` and Consolidate into `/history/[id]`

**Plan:** `specs/006-remove-review-page/plan.md`
**Status:** Ready for implementation

Legend:
- `[P]` = can run in parallel with other `[P]` tasks
- **TEST FIRST** = write tests (RED) before implementation (GREEN)

---

## Phase 1 — Tests First

### T01 — **TEST FIRST** — History detail page contract tests
**Goal:** Lock expected behaviour of `/history/[id]` before touching the implementation.
**Spec refs:** US-2, US-3
**Files touched (new):** `src/app/history/[id]/history-detail.test.tsx`
**Assertions (must FAIL before T02):**
1. Page does NOT render a `ProgressStepper` element.
2. With `flashcardIds: []` — renders a link/button whose text matches `generateFlashcardsBtn` translation.
3. With `flashcardIds: ['abc']` — renders a link/button whose text matches `viewFlashcardsBtn` translation.
4. With `flashcardIds: []` — the Generate CTA href includes `/flashcard/generate?sessionId=`.
5. With `flashcardIds: ['abc']` — the View CTA href is `/flashcard/review`.
**Validate:**
```bash
pnpm test -- src/app/history/\[id\]/history-detail.test.tsx
# Expected: FAIL (RED)
```

---

### T02 — **TEST FIRST** — Submission redirect tests [P]
**Goal:** Verify daily and interview pages redirect to `/history/<id>` and do NOT write to sessionStorage.
**Spec refs:** US-1, US-5
**Files touched (new):** `src/app/daily/daily-submit.test.tsx`, `src/app/interview/interview-submit.test.tsx`
**Assertions (must FAIL before T03):**
1. After successful submission, `router.push` is called with `/history/<sessionId>`.
2. `sessionStorage.setItem` is NOT called with `writecraft:session-draft`.
**Validate:**
```bash
pnpm test -- src/app/daily/daily-submit.test.tsx src/app/interview/interview-submit.test.tsx
# Expected: FAIL (RED)
```

---

## Phase 2 — Implementation

### T03 — Update submission redirect in `/daily` and `/interview` [P]
**Goal:** Remove sessionStorage write and point the post-submit redirect to `/history/<sessionId>`.
**Spec refs:** US-1, US-5
**Files touched:**
- `src/app/daily/page.tsx`
- `src/app/interview/page.tsx`
**Changes:**
- Delete the `sessionStorage.setItem('writecraft:session-draft', …)` call in each file.
- Change `router.push('/review')` → `router.push(\`/history/${sessionId}\`)`.
**Validate:**
```bash
pnpm test -- src/app/daily/daily-submit.test.tsx src/app/interview/interview-submit.test.tsx
pnpm run typecheck
pnpm run lint
```
**Done when:** Both test files go GREEN.

---

### T04 — Update `/history/[id]` — remove ProgressStepper, add Flashcard CTA
**Goal:** Remove the stepper; add ActionBar with conditional Generate/View Flashcards button.
**Spec refs:** US-2, US-3
**Files touched:**
- `src/app/history/[id]/page.tsx`
- `src/components/common/ActionBar.tsx` (import only — no logic change)
**Changes:**
- Remove `ProgressStepper` import and its JSX.
- Import `ActionBar`.
- At bottom of the happy-path return: add `<ActionBar>` containing:
  - If `session.flashcardIds.length === 0`: `<Link href={/flashcard/generate?sessionId=${session.id}}>` with `generateFlashcardsBtn` label.
  - If `session.flashcardIds.length > 0`: `<Link href="/flashcard/review">` with `viewFlashcardsBtn` label.
- Add `Sparkles` / `Layers` icons as appropriate.
**Validate:**
```bash
pnpm test -- src/app/history/\[id\]/history-detail.test.tsx
pnpm run typecheck
pnpm run lint
```
**Done when:** T01 tests go GREEN.

---

### T05 — Update `/flashcard/generate` to use `?sessionId=` URL param
**Goal:** Replace sessionStorage read with `useSearchParams()` + `getSession()` API call.
**Spec refs:** US-5 (necessary dependency — plan §Change Inventory 3)
**Files touched:**
- `src/app/flashcard/generate/page.tsx`
**Changes:**
- Remove `readDraft()` function and `useState<SessionDraft | null>(readDraft)`.
- Add `useSearchParams()` to read `sessionId` param.
- Add `useState<SessionDraft | null>(null)` + `useEffect` that calls `getSession(sessionId)` and maps `SessionDetail` → `SessionDraft`:
  ```
  { sessionId: detail.id, scene: detail.scene, context: detail.context,
    sourceText: detail.sourceText, userTranslation: detail.userTranslation,
    issues: detail.issues }
  ```
- If `sessionId` param is absent or `getSession` fails: show an error/empty state (same pattern as the existing `!draft` guard).
- Remove `sessionStorage.removeItem('writecraft:session-draft')` from `handleSave`.
- `buildCards()` and `saveFlashcards()` are unchanged.
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T06 — i18n: remove `review` namespace, add keys to `historyDetail` [P]
**Goal:** Clean up orphaned translation keys; add the two new CTA labels.
**Spec refs:** US-5
**Files touched:**
- `messages/en.json`
- `messages/zh-CN.json`
**Changes:**
- Delete the entire `"review": { … }` block from both files.
- Add to `"historyDetail"` namespace in both files:
  - `"generateFlashcardsBtn": "Generate Flashcards"` / `"生成闪卡"`
  - `"viewFlashcardsBtn": "View Flashcards"` / `"查看闪卡"`
**Validate:**
```bash
pnpm test -- src/i18n/completeness.test.ts
pnpm run typecheck
pnpm run lint
```

---

### T07 — Delete `/review` route
**Goal:** Remove the page directory so Next.js returns 404 for `/review`.
**Spec refs:** US-4
**Files touched (deleted):**
- `src/app/review/page.tsx` (and directory)
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```
**Done when:** Build succeeds with no references to the deleted file.

---

## Phase 3 — Regression & Cleanup

### T08 — Full regression baseline
**Goal:** Confirm no existing tests broke and the build is clean.
**Spec refs:** NFR (all tests pass)
**Files touched:** none (run-only)
**Validate:**
```bash
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run build
```
**Done when:** All commands pass, test count ≥ existing baseline.

---

## Summary Checklist

### Phase 1 — Tests First
- [ ] T01 — TEST FIRST history detail contract
- [ ] T02 — TEST FIRST submission redirect

### Phase 2 — Implementation
- [ ] T03 — Submission redirect (daily + interview) [P]
- [ ] T04 — History detail: remove stepper, add CTA
- [ ] T05 — Flashcard generate: replace sessionStorage with API
- [ ] T06 — i18n cleanup + new keys [P]
- [ ] T07 — Delete /review route

### Phase 3 — Regression
- [ ] T08 — Full regression baseline
