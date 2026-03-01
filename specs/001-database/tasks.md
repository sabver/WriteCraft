# Tasks: Database Layer — Persistent Storage

**Feature ID**: 001-database
**Plan**: [plan.md](./plan.md)
**Status**: Ready to implement
**Created**: 2026-03-01

Legend:
- `[P]` = can be executed in parallel with other `[P]` tasks in the same phase
- `[TEST]` = write test first (RED), then implement (GREEN)
- Validation commands assume `DATABASE_URL` is set and DB is running

---

## Phase 1 — Infrastructure & Tooling

### T-01 · Install dependencies

**Goal**: Add Prisma ORM and Vitest test runner to the project.

**Files touched**:
- `package.json`

**Steps**:
```bash
pnpm add prisma @prisma/client --save-dev
pnpm add -D vitest @vitest/coverage-v8
pnpm prisma init --datasource-provider postgresql
```

`prisma init` creates `prisma/schema.prisma` (stub) and adds `DATABASE_URL` to `.env`.

**Validation**:
```bash
pnpm exec prisma --version
pnpm exec vitest --version
```

Expect: both print version numbers without error.

---

### T-02 · Local dev environment files

**Goal**: Provide a zero-config local PostgreSQL via Docker Compose, and document
the required `.env.local` variable.

**Files touched** (all new):
- `docker-compose.yml`
- `.env.local.example`
- `.gitignore` — confirm `.env.local` and `.env` are already listed

**docker-compose.yml**:
```yaml
version: '3.9'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: writecraft
      POSTGRES_PASSWORD: writecraft
      POSTGRES_DB: writecraft
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

**.env.local.example**:
```
# Copy to .env.local and fill in your values
DATABASE_URL="postgresql://writecraft:writecraft@localhost:5432/writecraft"
GEMINI_API_KEY="your-gemini-key-here"
```

**Validation**:
```bash
docker compose up -d
docker compose ps   # db container status = running
```

---

### T-03 · Add package.json scripts

**Goal**: Make Prisma commands available as short npm scripts.

**Files touched**:
- `package.json` (scripts section only)

**Add**:
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate":  "prisma migrate dev",
    "db:studio":   "prisma studio",
    "db:reset":    "prisma migrate reset --force",
    "test":        "vitest run",
    "test:watch":  "vitest",
    "test:cover":  "vitest run --coverage"
  }
}
```

**Validation**:
```bash
pnpm run db:generate --help   # prints prisma generate usage
```

---

## Phase 2 — Prisma Schema & Migration

### T-04 · Write Prisma schema

**Goal**: Define all 4 models and 4 enums exactly as specified in plan.md §2.
Replace the stub `prisma/schema.prisma` created by `prisma init`.

**Spec refs**: AC-1.1, AC-1.2, AC-3.1, AC-5.1, NFR-2, NFR-3

**Files touched**:
- `prisma/schema.prisma`

**Schema must include**:
- Enums: `SceneType`, `IssueType`, `Severity`, `FlashcardMode`
- Models: `TranslationSession`, `ReviewIssue`, `Flashcard`, `ReviewLog`
- All `onDelete: Cascade` relations (NFR-2)
- All `@@index` declarations (NFR-3):
  - `TranslationSession`: `[scene]`, `[createdAt(sort: Desc)]`
  - `ReviewIssue`: `[sessionId]`
  - `Flashcard`: `[nextReviewDate]`, `[sessionId]`
  - `ReviewLog`: `[flashcardId]`

**Validation**:
```bash
pnpm exec prisma validate   # must exit 0
```

---

### T-05 · Run initial migration

**Goal**: Apply the schema to the local PostgreSQL database and generate the
Prisma client with TypeScript types.

**Spec refs**: NFR-5 (migration files committed)

**Files touched** (generated):
- `prisma/migrations/YYYYMMDDHHMMSS_init/migration.sql`
- `node_modules/.prisma/client/` (generated, gitignored)

**Steps**:
```bash
pnpm exec prisma migrate dev --name init
pnpm run db:generate
```

**Validation**:
```bash
pnpm exec prisma migrate status   # "Database schema is up to date"
pnpm exec tsc --noEmit            # no type errors from generated client
```

Commit the generated migration file to git.

---

## Phase 3 — Core Utilities (TDD)

### T-06 · [TEST] Write SM-2 unit tests

**Goal** (RED): Write failing tests for `applyRating()` before the implementation
exists. Tests document the exact SM-2 contract from spec AC-5.2 and AC-5.3.

**Spec refs**: AC-5.2, AC-5.3

**Files touched** (new):
- `src/lib/sm2.test.ts`

**Test cases to cover**:

| # | Input | Expected output |
|---|-------|-----------------|
| 1 | rating=0, prev interval=6, ease=2.5, reps=3 | interval=1, reps=0, ease=2.5 |
| 2 | rating=3, prev interval=1, ease=2.5, reps=1 | interval=6, reps=2, ease≈2.36 |
| 3 | rating=4, prev interval=6, ease=2.5, reps=2 | interval=15, reps=3, ease=2.5 |
| 4 | rating=5, prev interval=6, ease=2.5, reps=2 | interval=15, reps=3, ease=2.6 |
| 5 | rating=3 repeatedly until ease < 1.3 | ease clamped at 1.3, never below |
| 6 | rating=5, prev interval=0, ease=2.5, reps=0 | interval=1 (first review) |
| 7 | nextReviewDate = today + new interval (days) | verify date math |

**Validation** (expect RED):
```bash
pnpm test src/lib/sm2.test.ts   # fails: cannot find module './sm2'
```

---

### T-07 · Write SM-2 pure function (GREEN)

**Goal**: Implement `src/lib/sm2.ts` to make T-06 tests pass. Extract the existing
logic from `src/services/flashcard.ts:calculateNextReview` and adapt signature.

**Spec refs**: AC-5.2, AC-5.3

**Files touched**:
- `src/lib/sm2.ts` (new — implementation)
- `src/services/flashcard.ts` (remove old `calculateNextReview` export)

**Public API**:
```typescript
export interface SM2Result {
  interval: number
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
}

export function applyRating(
  rating: number,        // 0–5
  prevInterval: number,
  prevEaseFactor: number,
  prevRepetitions: number,
): SM2Result
```

SM-2 rules (from existing `calculateNextReview` logic):
- rating 0–2: interval=1, repetitions=0, easeFactor unchanged
- rating ≥3: easeFactor += 0.1 − (5−rating) × (0.08 + (5−rating) × 0.02); clamp min 1.3
- interval: if reps=0 → 1; if reps=1 → 6; else → round(prevInterval × easeFactor)
- repetitions += 1 on rating ≥ 3

**Validation** (expect GREEN):
```bash
pnpm test src/lib/sm2.test.ts   # all tests pass
pnpm run lint                    # no lint errors
```

---

### T-08 · [P] Write Prisma client singleton

**Goal**: Create the hot-reload-safe Prisma client singleton for use in all
API Route Handlers.

**Spec refs**: NFR-1, NFR-4 (plan §3.1)

**Files touched**:
- `src/lib/prisma.ts` (new)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**Validation**:
```bash
pnpm exec tsc --noEmit   # no type errors
```

---

### T-09 · [P] Extend src/lib/types.ts

**Goal**: Add API payload types and align enum string values with Prisma uppercase
enums, without breaking any existing component imports.

**Spec refs**: plan §5.4

**Files touched**:
- `src/lib/types.ts`

**Add these types** (keep all existing types intact):
```typescript
// Prisma-aligned enum strings (uppercase)
export type SceneTypeDB = 'INTERVIEW' | 'DAILY'
export type IssueTypeDB = 'GRAMMAR' | 'WORD_CHOICE' | 'STRUCTURE'
export type SeverityDB = 'HIGH' | 'MEDIUM' | 'LOW'
export type FlashcardModeDB = 'PARAGRAPH' | 'SENTENCE'

// POST /api/sessions request shape
export interface CreateSessionInput {
  scene: SceneTypeDB
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  aiReference: string
  issues: Array<{
    type: IssueTypeDB
    title: string
    original: string
    revised: string
    reason: string
    severity: SeverityDB
    sortOrder: number
  }>
}

// GET /api/sessions list item
export interface SessionListItem {
  id: string
  scene: SceneTypeDB
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  issueCount: number
  createdAt: string
}

// GET /api/sessions/[id] full detail
export interface SessionDetail {
  id: string
  scene: SceneTypeDB
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  aiReference: string
  createdAt: string
  issues: ReviewIssue[]
  flashcardIds: string[]
}

// POST /api/flashcards request shape
export interface SaveFlashcardsInput {
  sessionId: string
  mode: FlashcardModeDB
  scene: SceneTypeDB
  context: Record<string, string>
  cards: Array<{
    front: string
    backUserTranslation: string
    backAiRevision: string
    backFeedbackSummary: string[]
  }>
}
```

**Validation**:
```bash
pnpm exec tsc --noEmit   # no type errors
pnpm run lint
```

---

## Phase 4 — Sessions API Routes (TDD)

### T-10 · [TEST] Write sessions route tests

**Goal** (RED): Write integration tests for all three session endpoints before
implementing them. Tests use a live test DB.

**Spec refs**: AC-1.1–1.3, AC-2.1–2.5, AC-6.1

**Files touched** (new):
- `src/app/api/sessions/sessions.test.ts`

**Setup** (shared across session tests):
```typescript
// Use DATABASE_URL pointing at writecraft DB; clean up in afterEach
import { prisma } from '@/lib/prisma'
afterEach(async () => { await prisma.translationSession.deleteMany() })
```

**Test scenarios**:

*POST /api/sessions*
- Creates a session record with correct fields
- Creates all issue records linked to session
- Returns `{ success: true, data: { id } }` with status 201
- Returns 400 if `sourceText` is missing
- Returns 400 if `scene` is not INTERVIEW or DAILY

*GET /api/sessions*
- Returns all sessions newest-first when no filters
- Filters by `?scene=INTERVIEW`
- Filters by `?range=7d` (excludes 8-day-old record)
- Keyword search `?q=keyword` matches sourceText case-insensitively
- Returns `{ success: true, data: [], meta: { total: 0 } }` when empty

*GET /api/sessions/[id]*
- Returns full session with nested issues ordered by sortOrder
- Returns flashcardIds array (empty when no flashcards generated yet)
- Returns 404 when id does not exist

**Validation** (expect RED):
```bash
pnpm test src/app/api/sessions/sessions.test.ts
# fails: routes do not exist yet
```

---

### T-11 · Implement POST /api/sessions

**Goal**: Create the route handler that saves a session and its review issues.

**Spec refs**: AC-1.1, AC-1.2

**Files touched** (new):
- `src/app/api/sessions/route.ts` (POST handler)

**Key implementation points**:
- Zod validation of request body using `CreateSessionInput` shape
- `prisma.translationSession.create` with nested `issues: { createMany: { data: [...] } }`
- Return `{ success: true, data: { id } }` with status 201
- Return `{ success: false, error: message }` with status 400 on validation failure

**Validation**:
```bash
pnpm test src/app/api/sessions/sessions.test.ts
# POST tests pass; GET tests still red
pnpm run lint
```

---

### T-12 · Implement GET /api/sessions (history list)

**Goal**: Add the GET handler to `src/app/api/sessions/route.ts` for the history
list with filtering.

**Spec refs**: AC-2.1–2.5

**Files touched**:
- `src/app/api/sessions/route.ts` (add GET export)

**Key implementation points**:
- Parse query params: `scene`, `range`, `q`
- Build Prisma `where` clause dynamically (spread pattern)
- `range` → compute `gte: new Date(Date.now() - N * 86400000)`
- `q` → `OR: [{ sourceText: { contains: q, mode: 'insensitive' } }, { userTranslation: {...} }]`
- Include `_count: { select: { issues: true } }` to derive `issueCount`
- `orderBy: { createdAt: 'desc' }`

**Validation**:
```bash
pnpm test src/app/api/sessions/sessions.test.ts
# GET /api/sessions tests pass
pnpm run lint
```

---

### T-13 · Implement GET /api/sessions/[id]

**Goal**: Return full session detail with ordered issues and linked flashcard IDs.

**Spec refs**: AC-1.3, AC-3.2, AC-6.1

**Files touched** (new):
- `src/app/api/sessions/[id]/route.ts`

**Key implementation points**:
- `prisma.translationSession.findUniqueOrThrow` (catch `NotFoundError` → 404)
- Include: `issues: { orderBy: { sortOrder: 'asc' } }`
- Include: `flashcards: { select: { id: true } }` — map to `flashcardIds: string[]`

**Validation**:
```bash
pnpm test src/app/api/sessions/sessions.test.ts   # all session tests green
pnpm run lint
```

---

### T-11a · Implement POST /api/review (server-side AI proxy)

**Goal**: Move AI review calls off the client so `GEMINI_API_KEY` is never exposed
to the browser. Introduced as a fix alongside T-11/T-12.

**Spec refs**: AC-1.2 (AI feedback stored per session), NFR-6 (no secrets in client)

**Files touched**:
- `src/app/api/review/route.ts` (new)
- `src/services/ai.ts` — env var renamed from `NEXT_PUBLIC_GEMINI_API_KEY` → `GEMINI_API_KEY`
- `.env.example`, `.env.local.example`, `tasks.md` — env var updated

**Key implementation points**:
- Zod schema: `source`, `translation` (strings), `scene` (`z.enum(['INTERVIEW','DAILY'])`),
  `context` (`z.record(z.string(), z.string())`)
- Delegates to `getAIReview()` in `src/services/ai.ts`
- 400 on Zod failure; 500 on AI error

**Validation**:
```bash
pnpm run lint
pnpm exec tsc --noEmit
```

**Status**: ✅ Implemented (commit 9111de7); tests pending (add to Phase 5 or a dedicated test file)

---

## Phase 5 — Flashcards API Routes (TDD)

### T-14 · [TEST] Write flashcards route tests

**Goal** (RED): Write integration tests for all four flashcard endpoints.

**Spec refs**: AC-3.1, AC-3.3, AC-3.4, AC-4.1–4.3, AC-5.1–5.3, AC-7.1

**Files touched** (new):
- `src/app/api/flashcards/flashcards.test.ts`

**Setup**: Create a seed helper `createSessionWithFlashcard()` that inserts a
`TranslationSession` + one `Flashcard` for test setup. Clean up in `afterEach`.

**Test scenarios**:

*POST /api/flashcards*
- PARAGRAPH mode: saves exactly 1 card linked to session → returns `{ ids: [id] }`
- SENTENCE mode with 3 cards: saves 3 cards → returns `{ ids: [id1, id2, id3] }`
- Card has correct SM-2 defaults: interval=1, easeFactor=2.5, repetitions=0
- `nextReviewDate` ≤ now (new cards are immediately due)
- Returns 400 if `sessionId` is missing or not found

*GET /api/flashcards/due*
- Returns card with `nextReviewDate` = yesterday
- Does NOT return card with `nextReviewDate` = tomorrow
- Orders: repetitions=0 before repetitions=2 (new cards first)
- Returns empty array when no due cards (not an error)

*GET /api/flashcards/count*
- Returns `{ count: 2 }` when 2 due cards, `{ count: 0 }` when none

*PATCH /api/flashcards/[id]/rate*
- Rating 5: repetitions +1, easeFactor +0.1, interval computed, nextReviewDate updated
- Rating 0: repetitions reset to 0, interval reset to 1, nextReviewDate = tomorrow
- Creates a `ReviewLog` entry with correct `intervalBefore` and `easeFactorBefore`
- easeFactor never goes below 1.3
- Returns 400 if rating is not 0–5 integer
- Returns 404 if card id does not exist

**Validation** (expect RED):
```bash
pnpm test src/app/api/flashcards/flashcards.test.ts
# fails: routes do not exist yet
```

---

### T-15 · [P] Implement POST /api/flashcards

**Goal**: Save one or more flashcards linked to a session.

**Spec refs**: AC-3.1, AC-3.3, AC-3.4

**Files touched** (new):
- `src/app/api/flashcards/route.ts`

**Key implementation points**:
- Validate `SaveFlashcardsInput` with Zod
- `scene` and `context` passed in request body (avoids extra query)
- `prisma.flashcard.createMany` with SM-2 defaults on each card
- `createMany` does not return ids in PostgreSQL by default — use `create` in a
  transaction loop, or call `findMany` after with `where: { sessionId, createdAt: { gte: now } }`
- Return `{ success: true, data: { ids: string[] } }` with status 201

**Validation**:
```bash
pnpm test src/app/api/flashcards/flashcards.test.ts
# POST tests pass
pnpm run lint
```

---

### T-16 · [P] Implement GET /api/flashcards/due and count

**Goal**: Serve the due-card queue and the nav badge count.

**Spec refs**: AC-4.1–4.3, AC-7.1

**Files touched** (new):
- `src/app/api/flashcards/due/route.ts`
- `src/app/api/flashcards/count/route.ts`

**Key implementation points (due)**:
```typescript
const endOfToday = new Date()
endOfToday.setHours(23, 59, 59, 999)

prisma.flashcard.findMany({
  where: { nextReviewDate: { lte: endOfToday } },
  orderBy: [{ repetitions: 'asc' }, { createdAt: 'asc' }],
})
```

**Key implementation points (count)**:
```typescript
prisma.flashcard.count({ where: { nextReviewDate: { lte: endOfToday } } })
```

Map Prisma result to `Flashcard` shape from `src/lib/types.ts` (flatten `back.*` fields).

**Validation**:
```bash
pnpm test src/app/api/flashcards/flashcards.test.ts
# due + count tests pass
pnpm run lint
```

---

### T-17 · Implement PATCH /api/flashcards/[id]/rate

**Goal**: Accept a rating, write a ReviewLog entry, and update the Flashcard's
SM-2 state atomically in a transaction.

**Spec refs**: AC-5.1, AC-5.2, AC-5.3

**Files touched** (new):
- `src/app/api/flashcards/[id]/rate/route.ts`

**Key implementation points**:
- Zod: `z.object({ rating: z.number().int().min(0).max(5) })`
- `prisma.$transaction(async (tx) => { ... })` — read → log → update
- Import and call `applyRating()` from `src/lib/sm2.ts`
- Return updated SM-2 fields on success

**Validation**:
```bash
pnpm test src/app/api/flashcards/flashcards.test.ts   # all flashcard tests green
pnpm run lint
```

---

## Phase 6 — Service Layer (Wire Frontend to API)

### T-18 · Create src/services/sessions.ts

**Goal**: Thin fetch wrappers used by history page and input pages. Replaces
mock data in `src/app/history/page.tsx` and `src/app/history/[id]/page.tsx`.

**Spec refs**: AC-2.1–2.5, AC-1.3, AC-6.1

**Files touched** (new):
- `src/services/sessions.ts`

**Exports**:
```typescript
export async function createSession(input: CreateSessionInput): Promise<string>
// POST /api/sessions → returns session id

export async function getSessions(filters: HistoryFilter): Promise<SessionListItem[]>
// GET /api/sessions?scene=&range=&q= → returns list

export async function getSession(id: string): Promise<SessionDetail>
// GET /api/sessions/[id] → returns full detail
```

Each function: `fetch(url, opts)`, throw on non-ok response, return `data` field.

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

### T-19 · [P] Create src/services/navigation.ts

**Goal**: Due-count fetch function consumed by the nav bar badge.

**Spec refs**: AC-7.1

**Files touched** (new):
- `src/services/navigation.ts`

```typescript
export async function getDueCount(): Promise<number>
// GET /api/flashcards/count → returns count
```

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

### T-20 · [P] Update src/services/flashcard.ts (replace mock)

**Goal**: Replace the in-memory `mockFlashcards` array with real API calls.
Keep function signatures identical so no page component needs to change.

**Spec refs**: AC-3.1, AC-4.1–4.3, AC-5.1–5.3

**Files touched**:
- `src/services/flashcard.ts`

**Changes**:
- Delete `mockFlashcards` array and `calculateNextReview` export
- `saveFlashcards(cards)` → `fetch('POST /api/flashcards', { body: JSON.stringify(...) })`
- `getDueFlashcards()` → `fetch('GET /api/flashcards/due')` → return `data`
- `updateFlashcard(id, rating)` → `fetch('PATCH /api/flashcards/${id}/rate', ...)`

**Validation**:
```bash
pnpm exec tsc --noEmit
pnpm run lint
# Manually verify: start app, open /flashcard/review — no console errors
```

---

## Phase 7 — Verification & Polish

### T-21 · E2E test: full workflow

**Goal**: Playwright test that exercises the complete happy path end-to-end.

**Spec refs**: Stories 1–7

**Files touched** (new):
- `e2e/database-flow.spec.ts`

**Scenario**:
```
1. Visit /interview
2. Fill: Job Description, Company Background, Question Type
3. Fill: Source Text display visible
4. Fill: Translation textarea (≥10 chars)
5. Click "Submit for AI Review"
6. Wait for AI Review page — at least one ReviewItem visible
7. Click "Generate Flashcards"
8. Click "Save Flashcards"
9. Assert redirected to /flashcard/review
10. Assert flashcard front text visible
11. Click card to flip
12. Assert rating buttons appear
13. Click rating "4"
14. Assert progress advances (or "All caught up" state)
15. Visit /history
16. Assert the session from step 1 appears in the list
17. Click the session card → assert detail page shows source + issues
```

**Validation**:
```bash
pnpm exec playwright test e2e/database-flow.spec.ts
```

---

### T-22 · Final lint + build + migration commit

**Goal**: Confirm the full project builds cleanly and migration file is committed.

**Files touched**:
- None (verification only)

**Steps**:
```bash
pnpm run lint          # zero errors
pnpm exec tsc --noEmit # zero type errors
pnpm run build         # Next.js build succeeds
pnpm test              # all unit + integration tests green
git status             # prisma/migrations/ should be staged/committed
```

**Commit message** (after all above pass):
```
feat: add Prisma + PostgreSQL database layer

- 4-model schema: TranslationSession, ReviewIssue, Flashcard, ReviewLog
- 7 API routes replacing all mock service data
- SM-2 algorithm extracted to pure testable utility
- Docker Compose for local dev; .env.local.example documented
- Unit tests (SM-2), integration tests (all routes), E2E (full workflow)

Implements spec 001-database (AC-1.1 through AC-7.1)
```

---

## Summary Table

| Task | Phase | [P] | [TEST] | Spec ACs |
|------|-------|-----|--------|----------|
| T-01 Install deps | Infra | — | — | NFR-1 |
| T-02 Docker + env files | Infra | — | — | NFR-6, NFR-7 |
| T-03 Package scripts | Infra | — | — | NFR-5 |
| T-04 Prisma schema | Schema | — | — | All models, NFR-2, NFR-3 |
| T-05 Run migration | Schema | — | — | NFR-5 |
| T-06 SM-2 unit tests | Utilities | — | ✓ RED | AC-5.2, AC-5.3 |
| T-07 SM-2 implementation | Utilities | — | GREEN | AC-5.2, AC-5.3 |
| T-08 Prisma singleton | Utilities | ✓ | — | NFR-1, NFR-4 |
| T-09 Update types.ts | Utilities | ✓ | — | plan §5.4 |
| T-10 Session route tests | Sessions API | — | ✓ RED | AC-1.1–1.3, AC-2.1–2.5 |
| T-11 POST /api/sessions | Sessions API | — | GREEN | AC-1.1, AC-1.2 |
| T-12 GET /api/sessions | Sessions API | — | GREEN | AC-2.1–2.5 |
| T-11a POST /api/review | Sessions API | — | — | AC-1.2, NFR-6 |
| T-13 GET /api/sessions/[id] | Sessions API | — | GREEN | AC-1.3, AC-3.2, AC-6.1 |
| T-14 Flashcard route tests | Flashcards API | — | ✓ RED | AC-3.1–3.4, AC-4.1–4.3, AC-5.1–5.3, AC-7.1 |
| T-15 POST /api/flashcards | Flashcards API | ✓ | GREEN | AC-3.1, AC-3.3, AC-3.4 |
| T-16 GET due + count | Flashcards API | ✓ | GREEN | AC-4.1–4.3, AC-7.1 |
| T-17 PATCH rate | Flashcards API | — | GREEN | AC-5.1, AC-5.2, AC-5.3 |
| T-18 sessions.ts service | Service Layer | — | — | AC-2.1–2.5, AC-1.3 |
| T-19 navigation.ts service | Service Layer | ✓ | — | AC-7.1 |
| T-20 flashcard.ts update | Service Layer | ✓ | — | AC-3.1, AC-4.1–4.3 |
| T-21 E2E test | Verification | — | — | Stories 1–7 |
| T-22 Lint + build + commit | Verification | — | — | All NFRs |

**Total: 22 tasks across 7 phases**

---

## Checklist

- [x] Tasks are ordered with explicit dependencies
- [x] Test-first enforced: T-06, T-10, T-14 write tests before implementation
- [x] Independent tasks marked [P]: T-08/T-09 (utilities), T-15/T-16 (flashcard routes), T-19/T-20 (services)
- [x] Every task has: goal, files touched, validation command
- [x] Every task traces to spec AC or plan section
- [x] Phase ordering prevents circular deps (infra → schema → utilities → API → service → E2E)
- [x] T-01 Install deps ✅
- [x] T-02 Docker + env files ✅
- [x] T-03 Package scripts ✅
- [x] T-04 Prisma schema ✅ (also ran `prisma generate`)
- [x] T-05 Run migration ✅ — `prisma/migrations/20260301052641_init/migration.sql` generated & applied
- [x] T-06 SM-2 unit tests (RED → compile error) ✅
- [x] T-07 SM-2 implementation (GREEN, 7/7 tests pass) ✅
- [x] T-08 Prisma client singleton (`src/lib/prisma.ts`) ✅ — uses `@prisma/adapter-pg` (Prisma v7 driver adapter pattern)
- [x] T-09 Extended `src/lib/types.ts` with DB-aligned API types ✅
- [x] T-10 Session route tests (RED → confirmed fail) ✅
- [x] T-11 POST /api/sessions ✅
- [x] T-12 GET /api/sessions ✅
- [x] T-11a POST /api/review (server-side AI proxy) ✅ — env var secured, scene enum-validated
- [x] T-13 GET /api/sessions/[id] ✅ — 13/13 integration tests green
- [x] T-14 Flashcard route tests (RED) ✅ — 14 tests, confirmed module-not-found fail
- [x] T-15 POST /api/flashcards ✅
- [x] T-16 GET due + count ✅
- [x] T-17 PATCH rate ✅
- [ ] T-18 sessions.ts service
- [ ] T-19 navigation.ts service
- [ ] T-20 flashcard.ts update
- [ ] T-21 E2E test
- [ ] T-22 Final lint + build + commit
