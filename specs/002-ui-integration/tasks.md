# Tasks: UI Integration — Wire Pages to Real APIs

**Feature ID**: 002-ui-integration
**Plan**: [plan.md](./plan.md)
**Depends on**: 001-database (all tasks T-01 through T-20 complete)
**Status**: Ready to implement
**Created**: 2026-03-01

Legend:
- `[P]` = can be executed in parallel with other `[P]` tasks in the same phase
- Validation commands run from repo root with DB running

---

## Phase 1 — History Pages (Scope A, isolated)

### T-A1 · [P] Wire /history to getSessions()

**Goal**: Replace `mockHistory` with real `getSessions()` call, add loading state,
search debounce, and scene/date-range filters.

**Spec refs**: AC-1.1, AC-1.2, AC-1.3, AC-1.4, NFR-1, NFR-2, NFR-3

**Files touched**:
- `src/app/history/page.tsx`

**Changes**:
- Replace `mockHistory` const and local `.filter()` with `useState<SessionListItem[]>([])`
- Add `loading: boolean`, `searchQ: string` state
- `useEffect` on `[sceneFilter, debouncedQ]` → calls `getSessions({ scene, q, range })`
- Debounce `searchQ` with a 300 ms `setTimeout` / `clearTimeout` inline (no new file)
- Map `SessionListItem` → existing card JSX:
  - `s.scene.toLowerCase()` → `SceneBadge type` prop
  - `new Date(s.createdAt).toLocaleDateString()` → date string
  - `s.sourceText`, `s.userTranslation`, `s.issueCount`
- Show `<SkeletonCard />` rows while loading
- Wire the search `<input>` `onChange` to `setSearchQ`
- Add date-range tab controls (7d / 30d / all) and pass to filter

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

### T-A2 · [P] Wire /history/[id] to getSession()

**Goal**: Replace hardcoded `record` mock with real `getSession(id)` call.

**Spec refs**: AC-2.1, AC-2.2, NFR-1, NFR-2

**Files touched**:
- `src/app/history/[id]/page.tsx`

**Changes**:
- Add `useState<SessionDetail | null>(null)`, `loading`, `error` state
- `useEffect` on `[id]` → calls `getSession(id)` → `setSession`
- `normalizeIssue()` helper inline: maps `WORD_CHOICE` → `'word-choice'`,
  uppercase severity → lowercase
- Show `<SkeletonCard variant="detail" />` while loading; show error message on failure
- Replace mock `[1,2]` flashcard links with `session.flashcardIds.map(...)` links

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

## Phase 2 — Practice Flow (Scope B, cross-page sessionStorage)

### T-B1 · Wire /interview to AI review + createSession

**Goal**: Replace the stub `handleTranslationSubmit` with a real async flow:
AI review → createSession → sessionStorage → navigate.

**Spec refs**: AC-3.1, NFR-2

**Files touched**:
- `src/app/interview/page.tsx`

**Changes**:
- Add `submitting: boolean`, `submitError: string | null` state
- Change `const [_context, setContext]` → `const [context, setContext]`
- Replace `handleTranslationSubmit` with async version (see plan §4.3):
  1. `fetch('/api/review', ...)` with `source: sourceText`, `translation`, `scene: 'INTERVIEW'`, `context`
  2. `createSession({ scene: 'INTERVIEW', context, sourceText, userTranslation, aiReference: userTranslation, issues: [...] })`
  3. `sessionStorage.setItem('writecraft:session-draft', JSON.stringify({ sessionId, scene: 'INTERVIEW', context, sourceText, userTranslation, issues }))`
  4. `router.push('/review')`
- Add inline `mapIssueType(t: IssueType): IssueTypeDB` helper
- Show error message below `TranslationPanel` on failure; disable submit while `submitting`

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

### T-B2 · Wire /daily to AI review + createSession

**Goal**: Same as T-B1 but for the daily practice page.

**Spec refs**: AC-3.1, NFR-2

**Files touched**:
- `src/app/daily/page.tsx`

**Changes**: Mirror T-B1 but with `scene: 'DAILY'`.

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

### T-B3 · Wire /review to sessionStorage draft

**Goal**: Replace the `useEffect` that calls `/api/review` with hardcoded text
with a sessionStorage read.

**Spec refs**: AC-3.2, NFR-2

**Files touched**:
- `src/app/review/page.tsx`

**Changes**:
- Replace `useEffect` body: read `sessionStorage.getItem('writecraft:session-draft')`
- If missing → `setError('No active session. Please start a practice session first.')`
- If present → `setIssues(JSON.parse(raw).issues)` → `setLoading(false)`
- Remove the `/api/review` fetch entirely from this file

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

### T-B4 · Wire /flashcard/generate to real sessionStorage + saveFlashcards

**Goal**: Read the session draft from sessionStorage and call `saveFlashcards()`
with the real `sessionId`, then clear the draft.

**Spec refs**: AC-3.3, NFR-2

**Files touched**:
- `src/app/flashcard/generate/page.tsx`

**Changes**:
- On mount: `sessionStorage.getItem('writecraft:session-draft')` → parse into `draft` state
- `buildCards(draft, mode)` function (per plan §4.5): paragraph mode → 1 card, sentence mode → 1 card per issue
- `handleSave`: call `saveFlashcards(buildCards(draft, mode))` → on success `sessionStorage.removeItem('writecraft:session-draft')` → `setSaved(true)`
- Guard: `if (!draft)` → show "No active session" message
- Show real card preview from draft data (front = `draft.sourceText` for paragraph mode)

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

## Phase 3 — Final Verification

### T-C1 · TypeScript + lint clean pass

**Goal**: Confirm zero type errors and zero lint errors across all changed files.

**Files touched**: None (verification only)

**Steps**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

---

## Checklist

- [x] T-A1 Wire /history to getSessions()
- [x] T-A2 Wire /history/[id] to getSession()
- [x] T-B1 Wire /interview to AI review + createSession
- [x] T-B2 Wire /daily to AI review + createSession
- [x] T-B3 Wire /review to sessionStorage draft
- [x] T-B4 Wire /flashcard/generate to real sessionStorage + saveFlashcards
- [x] T-C1 TypeScript + lint clean pass
