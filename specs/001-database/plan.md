# Plan: Database Layer — Persistent Storage

**Feature ID**: 001-database
**Spec**: [spec.md](./spec.md)
**Status**: Ready for tasks
**Created**: 2026-03-01

---

## 1. Architecture Overview

### Current State

```
Browser Page
    └── src/services/flashcard.ts   ← in-memory array (mock)
    └── src/services/ai.ts          ← calls Google Gemini (real)
```

All data is ephemeral: refreshing the page destroys every session and flashcard.

### Target State

```
Browser Page
    └── src/services/*.ts           ← thin fetch wrappers
            │
            ▼  HTTP (JSON)
    Next.js API Route Handlers      ← validation + business logic
    src/app/api/...
            │
            ▼  Prisma Client
    PostgreSQL Database
```

**Key principle**: The existing `src/services/` layer stays — only its internals change
from mock arrays to `fetch` calls to Route Handlers. Page components are untouched.

---

## 2. Prisma Schema

**File**: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ────────────────────────────────────────────────────

enum SceneType {
  INTERVIEW
  DAILY
}

enum IssueType {
  GRAMMAR
  WORD_CHOICE
  STRUCTURE
}

enum Severity {
  HIGH
  MEDIUM
  LOW
}

enum FlashcardMode {
  PARAGRAPH
  SENTENCE
}

// ─── Models ───────────────────────────────────────────────────

// One record per complete practice session  [spec: AC-1.1]
model TranslationSession {
  id              String        @id @default(cuid())
  scene           SceneType

  // Interview: { jobDescription, companyBackground, questionType }
  // Daily:     { setting?, formalityLevel? }
  context         Json

  sourceText      String        @db.Text
  userTranslation String        @db.Text
  aiReference     String        @db.Text
  createdAt       DateTime      @default(now())

  issues          ReviewIssue[]
  flashcards      Flashcard[]

  @@index([scene])                    // [spec: AC-2.2, NFR-3]
  @@index([createdAt(sort: Desc)])    // [spec: AC-2.1, NFR-3]
}

// One row per AI feedback item; ordered by sortOrder  [spec: AC-1.2]
model ReviewIssue {
  id        String             @id @default(cuid())
  sessionId String
  session   TranslationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  type      IssueType
  title     String
  original  String             @db.Text
  revised   String             @db.Text
  reason    String             @db.Text
  severity  Severity
  sortOrder Int                // sentence index (#1, #2, …)

  createdAt DateTime           @default(now())

  @@index([sessionId])
}

// One or more cards per session; carries SM-2 state  [spec: AC-3.1]
model Flashcard {
  id        String             @id @default(cuid())
  sessionId String
  session   TranslationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  scene     SceneType          // denormalized — avoids join on review page
  context   Json               // denormalized — avoids join on review page
  mode      FlashcardMode

  // Card faces
  front                String  @db.Text
  backUserTranslation  String  @db.Text
  backAiRevision       String  @db.Text
  backFeedbackSummary  Json    // string[]  (max 3 bullet points)

  // SM-2 scheduling state  [spec: AC-3.1, AC-5.2]
  interval         Int      @default(1)     // days until next review
  easeFactor       Float    @default(2.5)   // minimum 1.3  [spec: AC-5.3]
  repetitions      Int      @default(0)     // successful reviews (rating ≥ 3)
  nextReviewDate   DateTime @default(now()) // [spec: AC-4.1, NFR-3]

  createdAt        DateTime @default(now())

  reviewLogs       ReviewLog[]

  @@index([nextReviewDate])  // [spec: AC-4.1, NFR-3]
  @@index([sessionId])
}

// Immutable log entry per rating event  [spec: AC-5.1]
model ReviewLog {
  id          String    @id @default(cuid())
  flashcardId String
  flashcard   Flashcard @relation(fields: [flashcardId], references: [id], onDelete: Cascade)

  rating            Int    // 0–5
  intervalBefore    Int
  easeFactorBefore  Float
  reviewedAt        DateTime @default(now())

  @@index([flashcardId])
}
```

---

## 3. New Files

### 3.1 Prisma Client Singleton

**File**: `src/lib/prisma.ts`

Standard Next.js singleton pattern to avoid creating multiple connections in dev
(hot-reload safe):

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### 3.2 SM-2 Pure Function (extracted)

**File**: `src/lib/sm2.ts`

Move `calculateNextReview` out of `src/services/flashcard.ts` into a pure,
server/client-agnostic utility so it can be:
- Called from the API Route Handler (server-side, authoritative)
- Unit tested in isolation

```typescript
export interface SM2Result {
  interval: number    // days
  easeFactor: number
  repetitions: number
  nextReviewDate: Date
}

export function applyRating(
  rating: number,          // 0–5
  prevInterval: number,
  prevEaseFactor: number,
  prevRepetitions: number,
): SM2Result { … }         // full SM-2 algorithm with ease clamp ≥ 1.3
```

The existing implementation in `src/services/flashcard.ts` already has the correct
SM-2 logic; it is extracted, not rewritten.

---

## 4. API Route Handlers

All routes live under `src/app/api/`. They follow the
[common patterns](../../.claude/rules/patterns.md) — typed `NextRequest`/`NextResponse`,
`ApiResponse<T>` envelope, Zod input validation.

### 4.1 Sessions

| Method | Path | Spec AC |
|--------|------|---------|
| POST | `/api/sessions` | AC-1.1, AC-1.2 |
| GET | `/api/sessions` | AC-2.1–2.5 |
| GET | `/api/sessions/[id]` | AC-1.3, AC-3.2, AC-6.1 |

#### `POST /api/sessions` — Create session + issues

**Request body**:
```typescript
{
  scene: "INTERVIEW" | "DAILY"
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  aiReference: string
  issues: Array<{
    type: "GRAMMAR" | "WORD_CHOICE" | "STRUCTURE"
    title: string
    original: string
    revised: string
    reason: string
    severity: "HIGH" | "MEDIUM" | "LOW"
    sortOrder: number
  }>
}
```

**Response** `201`:
```typescript
{ success: true, data: { id: string } }
```

**Implementation**: Single Prisma `create` with nested `issues.createMany`.

#### `GET /api/sessions` — History list with filters

**Query params**: `scene`, `range`, `q`

**Response** `200`:
```typescript
{
  success: true,
  data: Array<{
    id: string
    scene: string
    context: Record<string, string>
    sourceText: string         // full (UI truncates)
    userTranslation: string   // full (UI truncates)
    issueCount: number        // derived: issues.length
    createdAt: string
  }>,
  meta: { total: number }
}
```

**Implementation**:
```typescript
prisma.translationSession.findMany({
  where: {
    ...(scene !== 'all' && { scene: scene.toUpperCase() }),
    ...(range && { createdAt: { gte: rangeStart } }),
    ...(q && {
      OR: [
        { sourceText: { contains: q, mode: 'insensitive' } },
        { userTranslation: { contains: q, mode: 'insensitive' } },
      ]
    }),
  },
  include: { _count: { select: { issues: true } } },
  orderBy: { createdAt: 'desc' },
})
```

#### `GET /api/sessions/[id]` — Detail with issues and flashcard IDs

**Response** `200`:
```typescript
{
  success: true,
  data: {
    id, scene, context, sourceText, userTranslation, aiReference, createdAt,
    issues: ReviewIssue[],
    flashcardIds: string[]    // for "Linked Flashcards" chips [AC-3.2]
  }
}
```

**Implementation**:
```typescript
prisma.translationSession.findUniqueOrThrow({
  where: { id },
  include: {
    issues: { orderBy: { sortOrder: 'asc' } },
    flashcards: { select: { id: true } },
  },
})
```

---

### 4.2 Flashcards

| Method | Path | Spec AC |
|--------|------|---------|
| POST | `/api/flashcards` | AC-3.1, AC-3.3, AC-3.4 |
| GET | `/api/flashcards/due` | AC-4.1, AC-4.2, AC-4.3 |
| GET | `/api/flashcards/count` | AC-7.1 |
| PATCH | `/api/flashcards/[id]/rate` | AC-5.1, AC-5.2, AC-5.3 |

#### `POST /api/flashcards` — Save one or more cards

**Request body**:
```typescript
{
  sessionId: string
  mode: "PARAGRAPH" | "SENTENCE"
  cards: Array<{
    front: string
    backUserTranslation: string
    backAiRevision: string
    backFeedbackSummary: string[]   // max 3 items
  }>
}
```

**Response** `201`:
```typescript
{ success: true, data: { ids: string[] } }
```

**Implementation**: `prisma.flashcard.createMany(...)` with initial SM-2 defaults.
`scene` and `context` are copied from the parent session (one extra `findUnique`
or passed in the request body — request body approach avoids the extra query).

#### `GET /api/flashcards/due` — Cards due for review

**Response** `200`:
```typescript
{
  success: true,
  data: Flashcard[]   // typed to match src/lib/types.ts Flashcard
}
```

**Implementation**:
```typescript
const today = new Date()
today.setHours(23, 59, 59, 999)   // end of today

prisma.flashcard.findMany({
  where: { nextReviewDate: { lte: today } },
  orderBy: [
    { repetitions: 'asc' },   // new cards (0) first  [AC-4.2]
    { createdAt: 'asc' },
  ],
})
```

#### `GET /api/flashcards/count` — Due count for nav badge

**Response** `200`:
```typescript
{ success: true, data: { count: number } }
```

**Implementation**: `prisma.flashcard.count({ where: { nextReviewDate: { lte: endOfToday } } })`

#### `PATCH /api/flashcards/[id]/rate` — Rate card + update SM-2

**Request body**:
```typescript
{ rating: number }   // 0–5, validated with z.number().int().min(0).max(5)
```

**Response** `200`:
```typescript
{
  success: true,
  data: {
    interval: number
    easeFactor: number
    repetitions: number
    nextReviewDate: string
  }
}
```

**Implementation** (Prisma interactive transaction):
```typescript
prisma.$transaction(async (tx) => {
  const card = await tx.flashcard.findUniqueOrThrow({ where: { id } })

  const next = applyRating(rating, card.interval, card.easeFactor, card.repetitions)

  await tx.reviewLog.create({
    data: {
      flashcardId: id,
      rating,
      intervalBefore: card.interval,
      easeFactorBefore: card.easeFactor,
    },
  })

  return tx.flashcard.update({
    where: { id },
    data: {
      interval: next.interval,
      easeFactor: next.easeFactor,
      repetitions: next.repetitions,
      nextReviewDate: next.nextReviewDate,
    },
  })
})
```

---

## 5. Modified Files

### 5.1 `src/services/flashcard.ts`

Replace mock storage with `fetch` calls to the new API routes:

| Current function | New implementation |
|------------------|--------------------|
| `saveFlashcards(cards)` | `fetch('POST /api/flashcards', ...)` |
| `getDueFlashcards()` | `fetch('GET /api/flashcards/due')` |
| `updateFlashcard(id, rating)` | `fetch('PATCH /api/flashcards/${id}/rate', ...)` |
| `calculateNextReview(…)` | Removed — logic moved to `src/lib/sm2.ts` (server-side) |

### 5.2 New `src/services/sessions.ts`

Session CRUD functions used by the input pages and history page:

```typescript
export async function createSession(data: CreateSessionInput): Promise<string>
export async function getSessions(filters: HistoryFilter): Promise<SessionListItem[]>
export async function getSession(id: string): Promise<SessionDetail>
```

### 5.3 New `src/services/navigation.ts`

Due card count used by the nav badge:

```typescript
export async function getDueCount(): Promise<number>
```

### 5.4 `src/lib/types.ts`

Extend to include:
- `CreateSessionInput` — the payload shape for `POST /api/sessions`
- `SessionListItem` — list view projection
- `SessionDetail` — detail view with issues and flashcardIds

Existing types (`Flashcard`, `ReviewIssue`, `HistoryFilter`) are kept; enum values
are updated to uppercase strings to match Prisma enums when displayed.

---

## 6. Local Development Setup

**docker-compose.yml** (new file at repo root):

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

**.env.local** (gitignored, developer creates manually):

```
DATABASE_URL="postgresql://writecraft:writecraft@localhost:5432/writecraft"
```

**Setup commands** (added to package.json scripts):
```json
{
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:studio":  "prisma studio"
}
```

---

## 7. Migration Strategy

1. `prisma migrate dev --name init` → creates `prisma/migrations/YYYYMMDD_init/`
2. Migration file is committed to git (NFR-5).
3. `prisma generate` regenerates Prisma client types.
4. CI/CD note (future): `prisma migrate deploy` for production; `migrate dev` for local.

---

## 8. Testing Strategy

### 8.1 Unit Tests — SM-2 Algorithm (traces: AC-5.2, AC-5.3)

**File**: `src/lib/sm2.test.ts`

Test cases:
- Rating 0 resets interval to 1, repetitions to 0, ease unchanged
- Rating 3 increments repetitions, decreases ease by 0.14
- Rating 5 increments repetitions, increases ease by 0.1
- easeFactor never drops below 1.3
- `nextReviewDate` is today + interval

### 8.2 Integration Tests — API Routes (traces: AC-1 through AC-7)

**Approach**: Use Vitest + `@prisma/client` test utils against a dedicated test DB
(separate `DATABASE_URL` in `.env.test`).

Key test scenarios:

| Route | Test |
|-------|------|
| `POST /api/sessions` | Creates session + N issues; returns 201 with id |
| `GET /api/sessions` | Filters by scene, date range, keyword; returns 200 |
| `GET /api/sessions/[id]` | Returns session with issues and flashcardIds |
| `POST /api/flashcards` | PARAGRAPH mode → 1 card; SENTENCE mode → N cards |
| `GET /api/flashcards/due` | Only returns cards with nextReviewDate ≤ today |
| `GET /api/flashcards/count` | Matches count of due cards |
| `PATCH /api/flashcards/[id]/rate` | Updates SM-2 state and creates ReviewLog |

### 8.3 E2E Tests — Full Workflow (traces: Stories 1–7)

**File**: `e2e/database-flow.spec.ts`

Playwright scenario:
1. Navigate to `/interview`, fill context + source + translation.
2. Submit → AI Review page loads with real issues.
3. Click "Generate Flashcards" → save → redirected to review.
4. Rate first card → card advances.
5. Navigate to `/history` → session appears in list.
6. Click session → detail shows issues and linked flashcard chip.

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Prisma connection pool exhaustion under hot-reload | Medium | High | Singleton pattern in `src/lib/prisma.ts` (section 3.1) |
| `DATABASE_URL` missing in production | Low | High | Validation at startup: throw if env var absent |
| PostgreSQL ILIKE slow on large text columns | Low | Low | MVP data set is small; add GIN index later if needed |
| SM-2 logic divergence (client vs server) | Medium | Medium | Move logic to `src/lib/sm2.ts`; server is authoritative |
| Breaking page components when services change | Medium | High | Service function signatures unchanged; only internals change |
| Prisma schema enum values differ from `types.ts` strings | Medium | Medium | Update `types.ts` to use uppercase or add mapping layer |

---

## 10. Traceability Matrix

| Spec AC | Plan Section |
|---------|-------------|
| AC-1.1, AC-1.2 | §4.1 `POST /api/sessions` |
| AC-1.3 | §4.1 `GET /api/sessions/[id]` |
| AC-2.1–2.5 | §4.1 `GET /api/sessions` |
| AC-3.1, AC-3.3, AC-3.4 | §4.2 `POST /api/flashcards` |
| AC-3.2 | §4.1 `GET /api/sessions/[id]` (flashcardIds) |
| AC-4.1–4.3 | §4.2 `GET /api/flashcards/due` |
| AC-5.1 | §4.2 `PATCH /api/flashcards/[id]/rate` (ReviewLog) |
| AC-5.2, AC-5.3 | §3.2 SM-2 utility + §4.2 PATCH handler |
| AC-6.1 | §4.1 `GET /api/sessions/[id]` |
| AC-6.2 | §4.1 `POST /api/sessions` (new record, no mutation) |
| AC-7.1 | §4.2 `GET /api/flashcards/count` |
| NFR-1 | §2 Prisma schema, §3.1 Client singleton |
| NFR-2 | §2 `onDelete: Cascade` on all relations |
| NFR-3 | §2 `@@index` declarations |
| NFR-4 | §3.1 Prisma-generated types throughout |
| NFR-5 | §7 Migration strategy |
| NFR-6 | §6 `.env.local` + env validation |
| NFR-7 | §6 Docker Compose setup |

---

## 11. File Changelist

### New files
```
prisma/
  schema.prisma
  migrations/            ← generated by prisma migrate dev
docker-compose.yml
.env.local.example       ← committed; actual .env.local gitignored

src/lib/
  prisma.ts              ← Prisma client singleton
  sm2.ts                 ← SM-2 pure function (extracted)
  sm2.test.ts            ← unit tests

src/app/api/
  sessions/
    route.ts             ← GET + POST
    [id]/
      route.ts           ← GET
  flashcards/
    route.ts             ← POST
    due/
      route.ts           ← GET
    count/
      route.ts           ← GET
    [id]/
      rate/
        route.ts         ← PATCH

src/services/
  sessions.ts            ← new; session CRUD wrappers
  navigation.ts          ← new; due count for nav badge

e2e/
  database-flow.spec.ts  ← Playwright E2E
```

### Modified files
```
src/services/flashcard.ts  ← replace mock with fetch calls
src/lib/types.ts           ← add CreateSessionInput, SessionListItem, SessionDetail
package.json               ← add db:* scripts + prisma devDependency
```

---

## Checklist

- [x] Prisma schema specified (§2)
- [x] All 7 API routes designed with request/response shapes (§4)
- [x] Singleton and SM-2 utilities planned (§3)
- [x] Service layer changes scoped without breaking page components (§5)
- [x] Local dev setup (Docker Compose + env) documented (§6)
- [x] Migration strategy defined (§7)
- [x] Testing strategy with unit + integration + E2E (§8)
- [x] All risks mitigated (§9)
- [x] Full traceability to spec ACs (§10)
- [x] Complete file changelist (§11)
- [ ] **Next step**: Run `/sdd-tasks` to generate `specs/001-database/tasks.md`
