# Plan: UI Integration — Wire Pages to Real APIs

**Feature ID**: 002-ui-integration
**Spec**: [spec.md](./spec.md)
**Created**: 2026-03-01

---

## 1. Architecture Overview

No new files. All changes are edits to existing page components.
Services (`sessions.ts`, `flashcard.ts`, `navigation.ts`) are already complete.

```
┌─────────────────────────────────────────────────────────────┐
│  Scope A: History (isolated)                                 │
│                                                             │
│  /history  ──getSessions(filters)──▶ GET /api/sessions      │
│  /history/[id] ──getSession(id)──▶ GET /api/sessions/[id]   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Scope B: Practice flow (cross-page via sessionStorage)     │
│                                                             │
│  /interview or /daily                                       │
│    1. POST /api/review  ──▶ issues: ReviewIssue[]           │
│    2. createSession()   ──▶ sessionId                       │
│    3. sessionStorage.setItem('writecraft:session-draft')     │
│    4. router.push('/review')                                │
│                                                             │
│  /review                                                    │
│    sessionStorage.getItem('writecraft:session-draft')        │
│    → display issues (no extra API call)                     │
│                                                             │
│  /flashcard/generate                                        │
│    sessionStorage.getItem → sessionId, scene, issues        │
│    → generate cards → saveFlashcards() → clear draft        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Cross-page State Contract

SessionStorage key: `writecraft:session-draft`

```typescript
interface SessionDraft {
  sessionId: string
  scene: 'INTERVIEW' | 'DAILY'
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  issues: ReviewIssue[]   // @/lib/types — lowercase type/severity
}
```

Written by: `/interview`, `/daily`
Read by: `/review`, `/flashcard/generate`
Cleared by: `/flashcard/generate` after successful `saveFlashcards()`

---

## 3. Data Model Changes

None. Schema and migrations are already applied (001-database).

---

## 4. Page-by-page Implementation

### 4.1 `/history` — AC-1.1 through AC-1.4

| Before | After |
|--------|-------|
| `mockHistory` const array | `useState<SessionListItem[]>([])` |
| Local filter only | `getSessions({ scene, range, q })` on change |
| No search effect | `useEffect` with 300 ms debounce on `q` |

**State**:
```typescript
const [sessions, setSessions] = useState<SessionListItem[]>([])
const [loading, setLoading] = useState(true)
const [sceneFilter, setSceneFilter] = useState<'all' | 'interview' | 'daily'>('all')
const [searchQ, setSearchQ] = useState('')
```

**Fetch helper** (inside component, not extracted — avoids new file):
```typescript
useEffect(() => {
  setLoading(true)
  const filter: HistoryFilter = {
    scene: sceneFilter !== 'all' ? sceneFilter : undefined,
    q: searchQ || undefined,
  }
  getSessions(filter).then(setSessions).finally(() => setLoading(false))
}, [sceneFilter, searchQ])  // debounce searchQ via useDebounce hook or inline setTimeout
```

**UI mapping** (`SessionListItem` → existing card JSX):
- `s.scene.toLowerCase()` → `'interview' | 'daily'` for `SceneBadge`
- `new Date(s.createdAt).toLocaleDateString()` → date string
- `s.sourceText`, `s.userTranslation`, `s.issueCount`

**Loading state**: show `<SkeletonCard>` (already exists in project) or a spinner.

---

### 4.2 `/history/[id]` — AC-2.1, AC-2.2

**State**:
```typescript
const [session, setSession] = useState<SessionDetail | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

**On mount**: `getSession(id).then(setSession).catch(e => setError(e.message)).finally(...)`

**Type mapping** (DB uppercase → component lowercase):
```typescript
function normalizeIssue(i: SessionDetail['issues'][number]): ReviewIssue {
  return {
    ...i,
    type: i.type === 'WORD_CHOICE' ? 'word-choice' : i.type.toLowerCase() as IssueType,
    severity: i.severity.toLowerCase() as 'high' | 'medium' | 'low',
  }
}
```

**Flashcard links**: `session.flashcardIds.map(fid => <Link href="/flashcard/review">...)`

---

### 4.3 `/interview` and `/daily` — AC-3.1

`handleTranslationSubmit` changes from a one-liner to an async function:

```typescript
const handleTranslationSubmit = async (userTranslation: string) => {
  setSubmitting(true)
  setError(null)
  try {
    // 1. AI review
    const res = await fetch('/api/review', { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: sourceText, translation: userTranslation,
        scene: 'INTERVIEW' /* or 'DAILY' */, context }),
    })
    if (!res.ok) throw new Error('AI review failed')
    const { data: issues }: { data: ReviewIssue[] } = await res.json()

    // 2. Persist session
    const sessionId = await createSession({
      scene: 'INTERVIEW',
      context,
      sourceText,
      userTranslation,
      aiReference: userTranslation,
      issues: issues.map((iss, i) => ({
        type: mapIssueType(iss.type),
        severity: iss.severity.toUpperCase() as SeverityDB,
        title: iss.title, original: iss.original, revised: iss.revised,
        reason: iss.reason, sortOrder: i,
      })),
    })

    // 3. Store draft
    sessionStorage.setItem('writecraft:session-draft', JSON.stringify(
      { sessionId, scene: 'INTERVIEW', context, sourceText, userTranslation, issues }
    ))
    router.push('/review')
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
  } finally {
    setSubmitting(false)
  }
}
```

**Type helpers** (inline, not exported):
```typescript
function mapIssueType(t: IssueType): IssueTypeDB {
  if (t === 'word-choice') return 'WORD_CHOICE'
  return t.toUpperCase() as IssueTypeDB
}
```

**New state**: `submitting: boolean`, `error: string | null`

**TranslationPanel** already passes `translation: string` via `onSubmit` callback — no component change needed.

---

### 4.4 `/review` — AC-3.2

Replace `useEffect` that calls `/api/review` with sessionStorage read:

```typescript
useEffect(() => {
  const raw = sessionStorage.getItem('writecraft:session-draft')
  if (!raw) {
    setError('No active session. Please start a practice session first.')
    setLoading(false)
    return
  }
  const draft: SessionDraft = JSON.parse(raw)
  setIssues(draft.issues)
  setLoading(false)
}, [])
```

"Generate Flashcards" button stays as `<Link href="/flashcard/generate">` (sessionId is in sessionStorage, no URL param needed).

---

### 4.5 `/flashcard/generate` — AC-3.3

```typescript
// On mount:
const raw = sessionStorage.getItem('writecraft:session-draft')
const draft: SessionDraft | null = raw ? JSON.parse(raw) : null

// Card generation:
function buildCards(draft: SessionDraft, mode: 'paragraph' | 'sentence') {
  if (mode === 'paragraph') {
    return [{
      sessionId: draft.sessionId,
      front: draft.sourceText,
      back: {
        userTranslation: draft.userTranslation,
        aiRevision: draft.issues[0]?.revised ?? draft.userTranslation,
        feedbackSummary: draft.issues.map(i => i.title).slice(0, 3),
      },
      scene: draft.scene.toLowerCase() as SceneType,
      context: draft.context,
    }]
  }
  // sentence mode: one card per issue
  return draft.issues.map(iss => ({
    sessionId: draft.sessionId,
    front: iss.original,
    back: {
      userTranslation: iss.original,
      aiRevision: iss.revised,
      feedbackSummary: [iss.reason],
    },
    scene: draft.scene.toLowerCase() as SceneType,
    context: draft.context,
  }))
}

// handleSave:
const handleSave = async () => {
  if (!draft) return
  await saveFlashcards(buildCards(draft, mode))
  sessionStorage.removeItem('writecraft:session-draft')
  setSaved(true)
}
```

---

## 5. API / Contracts

No new API routes. Existing routes consumed:

| Endpoint | Page | Method |
|----------|------|--------|
| `POST /api/review` | /interview, /daily | fetch() inline |
| `POST /api/sessions` | /interview, /daily | `createSession()` |
| `GET /api/sessions` | /history | `getSessions()` |
| `GET /api/sessions/[id]` | /history/[id] | `getSession()` |
| `POST /api/flashcards` | /flashcard/generate | `saveFlashcards()` |

---

## 6. Testing Strategy

**Unit**: No pure logic to unit-test (page components; logic is thin).

**Integration**: Existing API route tests (T-10 through T-17) cover the backend. No new integration tests needed.

**E2E (T-21)**: Playwright test covering the full happy path is the primary verification for this feature. See `specs/001-database/tasks.md` T-21.

**Manual smoke test**:
1. `/interview` → fill all steps → submit → confirm `/review` shows real issues
2. `/review` → "Generate Flashcards" → `/flashcard/generate` → Save → `/flashcard/review`
3. Rate a card → `/history` → confirm session appears → click → detail shows real data

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| `ReviewIssue` type mismatch (DB uppercase vs UI lowercase) | `normalizeIssue()` helper at read-time |
| sessionStorage empty on direct navigation to `/review` | Show "No active session" message, not crash |
| AI review API key missing in dev | GEMINI_API_KEY must be set in `.env.local`; documented in `.env.local.example` |
| Flashcard generate page has no draft | Guard: `if (!draft) return` on save handler |

---

## 8. Traceability

| Plan item | Spec AC |
|-----------|---------|
| History list wired to getSessions | AC-1.1–1.4 |
| History detail wired to getSession | AC-2.1–2.2 |
| Interview/daily → createSession + sessionStorage | AC-3.1 |
| Review page reads sessionStorage | AC-3.2 |
| Flashcard generate uses real sessionId | AC-3.3 |
| Loading skeletons | NFR-1 |
| Error messages | NFR-2 |
| Search debounce | NFR-3 |
| sessionStorage (not context) | NFR-4 |
| No service signature changes | NFR-5 |
| tsc + lint passing | NFR-6 |
