[AI Studio Build Mode Prompt Template | Convert Stitch prototype into a runnable Next.js + shadcn/ui app]

You are a senior frontend engineering agent. Your goal is to convert the currently imported Stitch prototype/export (code/HTML/screenshots/notes) into a runnable Next.js project using the fixed stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.

# 0) Input context
- Imported source: Stitch prototype export (HTML + design tokens + screenshots)
- Target app requirements:

  <!-- from spec -->
  **WriteCraft MVP** — English learning app. Core loop:
  **Select Scene → Input Content → Write Translation → AI Review → Generate Flashcard → Review**

  **Module 1 — Scene Selection**
  Two scenes available from the home screen:
  | Scene | Context Fields | Use Case |
  |---|---|---|
  | Interview | Job description, Company background, Interview question type | Paragraph-level professional translation |
  | Daily | Conversation setting (optional), Formality level (optional) | Quick capture of fragmented expressions |
  Daily scene context fields are fully optional — users can skip directly to input.

  **Module 2 — Translation Writing**
  1. Context Input — User fills in scene-specific background fields.
  2. Source Text Input — User enters native language content to translate. Source text is highlighted for visual prominence.
  3. Translation Writing Area — User writes the English translation while referencing the highlighted source.
  4. AI Reference Translation — Hidden by default; revealed only when user explicitly clicks.

  **Module 3 — AI Review**
  Feedback displayed sentence by sentence. Each issue shows a side-by-side comparison: original sentence vs. suggested revision. Different issue types visually distinguished by color or icon. Every piece of feedback must include a reason.
  | Type | Content |
  |---|---|
  | Grammar Errors | Flag the issue, provide correct usage, explain the reason |
  | Word Choice | Identify imprecise words, suggest better alternatives with explanation |
  | Sentence Structure | Identify structural issues, provide rewrite examples |

  **Module 4 — Flashcard Generation**
  After completing AI Review, user clicks "Generate Flashcard". System defaults to mode appropriate for current scene; user can switch modes before generating.
  | Mode | Granularity | Default Scene |
  |---|---|---|
  | Paragraph Mode | One full translation exercise = one card set | Interview |
  | Sentence Mode | Each sentence or key phrase = one card | Daily |
  Card structure:
  | Side | Content |
  |---|---|
  | Front | Native language source text |
  | Back | User's translation + AI-revised reference version + Key feedback summary |
  Each card also stores context information, creation timestamp, and scene type.

  **Module 5 — Flashcard Review (SM-2 SRS)**
  Cards presented: new cards first, then cards due for review.
  Review flow: (1) Show front; (2) User recalls; (3) User flips; (4) User self-rates 0–5; (5) System calculates next review date via SM-2; (6) Next card.
  SM-2 Rating Scale:
  | Rating | Meaning |
  |---|---|
  | 0–2 | Completely forgotten — reset interval to 1 day |
  | 3 | Recalled with difficulty |
  | 4 | Recalled with slight hesitation |
  | 5 | Recalled effortlessly |
  Default interval schedule: 1st review after 1 day, 2nd after 6 days, subsequent = difficulty factor × previous interval.

  **Module 6 — History**
  All records persisted in a database.
  Data stored per record: scene type, context, source text, user translation, AI review feedback, AI reference translation, associated Flashcard IDs, created_at timestamp.
  | Feature | Description |
  |---|---|
  | History List | Reverse chronological; filter by scene type or date range; keyword search |
  | Detail View | Full source text, user translation, and AI review with key issues highlighted |
  | Re-do | Re-edit a past translation, re-request AI review, re-generate Flashcards |

- Key pages/routes:
  / — Home: scene selection (2 scene cards)
  /interview — Interview: context form (3 required fields) + translation input wizard
  /daily — Daily: context form (2 optional fields) + translation input wizard
  /review — AI Review: sentence-by-sentence feedback, 3 issue types, side-by-side comparison
  /flashcard/generate — Flashcard Generation: mode selector (Paragraph/Sentence) + card previews + save
  /flashcard/review — Flashcard Review: SRS session, SM-2 rating 0–5, 3D flip, progress bar
  /history — History List: reverse chronological, filterable (scene + date + keyword), URL-synced, paginated
  /history/[id] — History Detail: full record + re-do capability

- Brand/visual constraints to preserve:
  - Blue/green dual-scene theme: blue-600 for Interview, green-600 for Daily
  - Amber-50/amber-200 source text highlight panel (visual prominence per spec)
  - Card-based layout throughout
  - Pill badges: scene type (blue/green) + issue type (red/yellow/purple)
  - shadcn token approach — no hard-coded hex values
  - Comfortable spacing density
  - rounded-lg / rounded-xl / rounded-2xl card radii hierarchy
  - 3D CSS flip animation for Flashcard3D component <!-- from spec: "flip" is core UX of review module -->
  - shadow-sm base, shadow-md on hover (transition 200ms)

# 1) Hard engineering constraints (must follow)
- Next.js: 15 (latest stable), App Router (/app)
- TypeScript strict mode: true
- Tailwind: use shadcn token approach (CSS variables); no inline styles; no hard-coded colors
- UI components: prefer shadcn/ui (Button/Card/Input/Select/Dialog/Sheet/DropdownMenu/Tabs/Table/Skeleton/Toast/Alert)
- Utility: use cn (tailwind-merge + clsx): lib/utils.ts
- Forms: react-hook-form + zod (errors rendered under the field)
- States: implement loading.tsx / error.tsx / not-found.tsx for: /review, /flashcard/review, /history, /history/[id]
- Client/Server boundary: interactive components are "use client"; keep pages server when possible
- Runnability: include dependencies/scripts; the project must start and preview: pnpm dev

# 2) Folder structure (refactor to this)
Use this structure (adjust only when necessary, keep clear layering):
```
app/
  (main)/
    page.tsx                      # /  Home — Scene Selection
    interview/
      page.tsx                    # /interview
    daily/
      page.tsx                    # /daily
    review/
      page.tsx                    # /review
      loading.tsx                 # skeleton × 3 ReviewItem while AI processes
      error.tsx                   # Alert + retry
    flashcard/
      generate/
        page.tsx                  # /flashcard/generate
      review/
        page.tsx                  # /flashcard/review
        loading.tsx               # skeleton for initial card fetch
        error.tsx
    history/
      page.tsx                    # /history
      loading.tsx                 # skeleton × 4 HistoryCards
      error.tsx
      [id]/
        page.tsx                  # /history/[id]
        loading.tsx
        not-found.tsx             # invalid history id
  layout.tsx                      # root layout with TopNavBar
  globals.css
components/
  layout/                         # TopNavBar, ProgressStepper, PageWrapper, ActionBar
  scene/                          # SceneCard, SceneGrid, SceneBadge
  input/                          # ContextForm, SourceTextPanel, TranslationPanel, AIReferenceReveal, ActionBar
  review/                         # ReviewHeader, ReviewItemList, ReviewItem, IssueBadge, IssueSummaryBar, ComparisonBlock
  flashcard/                      # ModeSelector, FlashcardPreview, Flashcard3D, RatingBar, ReviewProgressHeader
  history/                        # FilterBar, HistoryList, HistoryCard, FlashcardLinksBlock
  common/                         # ProgressStepper, PageWrapper, SkeletonCard (variants)
  ui/                             # shadcn generated components
lib/
  utils.ts                        # cn()
  api.ts                          # fetch wrapper
  types.ts                        # TS types
  schemas.ts                      # zod schemas
services/
  translation.ts                  # get AI reference translation
  review.ts                       # request AI review, parse feedback items
  flashcard.ts                    # generate flashcards, SM-2 scheduling, save/fetch due cards
  history.ts                      # fetch list (with filters), fetch single, re-do
styles/
  globals.css
```

# 3) Data strategy (mock first, real API later)
- Mock strategy: in-memory
- Services layer: pages/components must call services; no scattered fetch calls
- API contract: define types + zod schemas now; later swap to Next.js API Routes + Prisma (PostgreSQL)
- URL state: History list filters synced to searchParams: `scene` (interview|daily), `range` (7d|30d|all), `q` (keyword search) <!-- from spec: "filter by scene type or date range; keyword search" -->

# 4) Required feature checklist (must complete one by one)

## 1) Routes & pages

### `/` — Home
<!-- from spec: Module 1 -->
- SceneGrid: 2-column grid on desktop, 1-column on mobile
- InterviewSceneCard: blue theme, shows "Job description · Company background · Question type" hints, CTA "Start Interview Practice"
- DailySceneCard: green theme, shows "Setting · Formality (both optional)" hints, CTA "Start Daily Practice"
- Clicking either card navigates to `/interview` or `/daily`
- Hover: shadow-md transition (200ms)

### `/interview` — Interview Input
<!-- from spec: Module 2 -->
- ProgressStepper: 4 steps (Context → Translate → Review → Flashcard), step 1 active
- ContextForm (collapsible, all fields required):
  - Job Description (textarea, required, min 10 chars)
  - Company Background (textarea, required, min 5 chars)
  - Question Type (select: Behavioral / Technical / Situational / Case Study / Other)
- SourceTextPanel: amber-50 background, amber-200 border, read-only, "Source Text" label, visually prominent
- TranslationTextarea: auto-grow, min-h 160px, placeholder "Write your English translation here…"
- AIReferenceReveal: hidden by default; ghost button "Show AI Reference Translation"; fade-in on click; re-click hides
- ActionBar: Submit button disabled until translation ≥ 10 chars; sticky on mobile; "Submit for AI Review"

### `/daily` — Daily Input
<!-- from spec: "Daily scene context fields are fully optional" -->
- Same as /interview but ContextForm fields are optional with "(optional)" suffix
- Skip hint displayed: "Context fields are optional — feel free to skip."
- Submit button enabled even with empty context fields (translation ≥ 10 chars still required)

### `/review` — AI Review
<!-- from spec: Module 3 -->
- ReviewHeader with IssueSummaryBar: 3 colored pill badges (Grammar: red, Word Choice: yellow, Sentence Structure: purple)
- ReviewItemList: vertical list of ReviewItem cards
- Each ReviewItem:
  - SentenceIndex chip: "#1", "#2", etc.
  - IssueBadge: color-coded by type (Grammar=red, WordChoice=yellow, SentenceStructure=purple)
  - ComparisonBlock: 2-column on desktop (Your version | Suggested revision), stacked on mobile
  - Revised sentence highlight: green-50 background
  - ReasonBlock: slate-50 background, "Why:" label bold
- loading.tsx: skeleton × 3 ReviewItem cards
- Empty state (no issues): green success card "Great job! No issues found in your translation."
- error.tsx: Alert + Retry button
- ActionBar: "Generate Flashcard" button (enabled after review loads)

### `/flashcard/generate` — Flashcard Generation
<!-- from spec: Module 4 -->
- ProgressStepper: step 4 active ("Flashcard")
- ModeSelector (Tabs): "Paragraph Mode" (default for Interview) | "Sentence Mode" (default for Daily)
- CardPreviewList: FlashcardPreview × N, dashed border cards
  - CardFront: always visible, shows source text
  - CardBack: collapsed by default, "Preview back →" expands; shows UserTranslation + AIRevision (green-50) + KeyFeedbackSummary (bullet list)
- SaveButton: "Save Flashcards" (primary); success toast on save

### `/flashcard/review` — Flashcard Review
<!-- from spec: Module 5 — exact SM-2 implementation required -->
- Card order: new cards first, then cards due for review
- ReviewProgressHeader: "Card 3 of 12" + linear Progress bar (shadcn Progress)
- Flashcard3D: CSS 3D flip (transform-style: preserve-3d, rotateY 180deg, 500ms transition)
  - FrontFace: source text (native language) centered; "Tap to reveal your translation" muted below
  - BackFace: UserTranslation + Separator + AIRevision (green-50) + Separator + KeyFeedbackSummary
  - Click/tap anywhere on card to flip
- ContextPanel: expandable "Show Context" below card (shows scene context: job description, etc.)
- RatingBar: appears after flip with fade-in
  - "How well did you recall?" label
  - 6 circular buttons: 0 (Forgot) / 1 / 2 / 3 (Hard) / 4 / 5 (Easy)
  - Hover colors: 0–2 = red-100, 3 = yellow-100, 4–5 = green-100
  - Clicking a rating → SM-2 calculation → store next review date → advance to next card
- SM-2 logic (implement in flashcard service):
  - Ratings 0–2: reset interval to 1 day
  - Rating 3: recalled with difficulty
  - Rating 4: recalled with slight hesitation
  - Rating 5: recalled effortlessly
  - Default intervals: 1st = 1 day, 2nd = 6 days, subsequent = difficulty_factor × previous_interval
- loading.tsx: card skeleton
- Empty state: "All caught up! 🎉" + "Come back tomorrow for your next review." + "Back to Home" button

### `/history` — History List
<!-- from spec: Module 6 -->
- FilterBar: SearchInput (keyword), SceneFilter (All / Interview / Daily), DateRangeFilter (All Time / Last 7 Days / Last 30 Days) — all synced to URL searchParams
- HistoryList: reverse chronological, card-based list
- Each HistoryCard: SceneBadge + date; source text excerpt (80 chars, ellipsis); translation excerpt; View + Re-do buttons
- loading.tsx: skeleton × 4 HistoryCards
- Empty state: "No history yet" + "Complete your first practice session to see records here." + "Start Practicing" button
- Cursor-based pagination (limit 20 per page)

### `/history/[id]` — History Detail
<!-- from spec: Module 6 — "Full source text, user translation, and AI review with key issues highlighted" -->
- DetailHeader: ← History back link; SceneBadge; date; "Re-do This Exercise" button
- SourceTextBlock: amber-50 highlight, full source text
- TranslationBlock: user's full translation
- AIReviewBlock: reuses ReviewItemList (ReviewItem × N) with key issues highlighted
- FlashcardLinksBlock: horizontal scroll chips, clicking navigates to /flashcard/review
- Re-do button: re-opens exercise with pre-populated context + source text; user can re-edit translation, re-request AI review, re-generate flashcards <!-- from spec -->
- loading.tsx, not-found.tsx

## 2) Componentization
- Layout: TopNavBar, ProgressStepper, PageWrapper, ActionBar
- Domain components: SceneCard, SceneGrid, SceneBadge, ContextForm, SourceTextPanel, TranslationPanel, AIReferenceReveal, ReviewHeader, IssueSummaryBar, ReviewItem, ComparisonBlock, ModeSelector, FlashcardPreview, Flashcard3D, RatingBar, ReviewProgressHeader, HistoryCard, FilterBar, FlashcardLinksBlock

## 3) Interactions & states
- Forms: InterviewContextForm (react-hook-form + zod, 3 required fields); DailyContextForm (2 optional fields); TranslationForm (1 field, min 10 chars)
- Tables/Lists: HistoryList — card-based, filterable, URL-synced, cursor-paginated
- Dialogs/Sheets: NavigationSheet (hamburger mobile nav); AIReferenceReveal (inline expand/collapse); FlashcardPreviewExpand (inline)
- Toast rules: "Flashcards saved!" (success); "Review failed — please try again" (AI error); flashcard save failure error
- Loading/Empty/Error: see per-route details above

# 5) Styling & token normalization (must do)
- Map all colors to shadcn CSS variables
- Scene colors: use `--color-interview` (blue-600) and `--color-daily` (green-600) as custom tokens in globals.css
- Normalize spacing/typography/radius/shadows using Tailwind — avoid arbitrary px
- Dark mode strategy: ignore (light only for MVP)

# 6) Deliverables
- Create all project files: package.json, tsconfig, tailwind config, postcss config, globals.css
- Add shadcn/ui components and generate ui/* files as needed
- Implement all routes/components and ensure it runs
- Verification steps:
  1. pnpm install && pnpm dev
  2. Navigate to / — see two scene cards (Interview blue, Daily green)
  3. Click Interview → ContextForm (3 required fields); fill → SourceTextPanel (amber) visible → type translation → Submit enables at ≥ 10 chars
  4. Submit → /review → loading skeleton → 3 review items render with badges and comparison blocks
  5. Click "Generate Flashcard" → /flashcard/generate → mode selector (Paragraph/Sentence) → preview back works → Save → success toast
  6. Navigate to /flashcard/review → card front shows → click to flip (3D animation) → rating bar fades in → click rating → slide to next card
  7. Navigate to /history → filter bar → URL updates on filter change → click HistoryCard → detail view → "Re-do This Exercise" re-opens exercise
  8. Resize to <768px: SceneGrid single column; hamburger nav; ActionBar pinned bottom

- API migration notes:
  - Replace services/translation.ts mock → fetch('/api/translation/reference')
  - Replace services/review.ts mock → POST /api/review (body: { source, translation, scene, context })
  - Replace services/flashcard.ts mock → POST /api/flashcard (save), GET /api/flashcard/due (fetch due cards with SM-2 dates)
  - Replace services/history.ts mock → GET /api/history (with searchParams), GET /api/history/[id], POST /api/history/[id]/redo
  - All API routes: app/api/* using Next.js 15 Route Handlers
  - SM-2 scheduling logic: move to server-side (API route or Prisma middleware)
  - Database: Prisma + PostgreSQL; models for Session (translation exercise), FlashCard, ReviewLog

Start by creating the project skeleton, converting the Stitch UI into shadcn/ui componentized code, ensuring it runs, then implement interactions, states, and layering.
