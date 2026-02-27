[AI Studio Build Mode Prompt Template | Convert Stitch prototype into a runnable Next.js + shadcn/ui app]

You are a senior frontend engineering agent. Your goal is to convert the currently imported Stitch prototype/export (code/HTML/screenshots/notes) into a runnable Next.js project using the fixed stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.

# 0) Input context
- Imported source: Stitch prototype export (HTML + design tokens + screenshots)  // Stitch export: code/HTML/screenshots/notes
- Target app requirements: WriteCraft MVP — English learning app with a structured translation practice loop:
  1. Scene Selection: Home page with 2 clickable scene cards (Interview, Daily).
  2. Interview/Daily Input: Multi-field context form + highlighted source text panel + translation textarea + hidden AI reference toggle. Submit disabled until translation present.
  3. AI Review: Sentence-by-sentence feedback with issue-type badges (Grammar/Word Choice/Sentence Structure), side-by-side original vs. revised comparison, and reason for each issue.
  4. Flashcard Generation: Mode selector (Paragraph vs. Sentence), card previews (front = source text, back = user translation + AI revision + key feedback), Save action.
  5. Flashcard Review (SRS / SM-2): 3D flip card, rating 0–5, progress bar, next-due calculation stored.
  6. History: Filterable list (scene, date, keyword search) synced to URL params; history detail with full source/translation/review; Re-do capability.
  All data persisted in database. SM-2 algorithm for spaced repetition scheduling.
- Key pages/routes:
  / — Home: scene selection
  /interview — Interview: context + translation input wizard
  /daily — Daily: context (optional) + translation input wizard
  /review — AI Review: feedback on submitted translation
  /flashcard/generate — Flashcard Generation: mode select + card previews + save
  /flashcard/review — Flashcard Review: SRS review session
  /history — History List: filterable, paginated
  /history/[id] — History Detail: full record + re-do
- Brand/visual constraints to preserve: Blue/green dual-scene theme (blue=Interview, green=Daily); amber-50 source text highlight; card-based layout; pill badges for scene and issue types; shadcn token approach (no hard-coded hex); comfortable spacing; rounded-lg/xl/2xl card radii; 3D flip animation for flashcard

# 1) Hard engineering constraints (must follow)
- Next.js: 15 (default: latest stable), App Router (/app)
- TypeScript strict mode: true (true/false)
- Tailwind: use shadcn token approach (CSS variables); no inline styles; no hard-coded colors
- UI components: prefer shadcn/ui (Button/Card/Input/Select/Dialog/Sheet/DropdownMenu/Tabs/Table/Skeleton/Toast/Alert)
- Utility: use cn (tailwind-merge + clsx): lib/utils.ts
- Forms: react-hook-form + zod (errors rendered under the field)
- States: implement loading.tsx / error.tsx / not-found.tsx (at least for /review, /flashcard/review, /history, /history/[id])
- Client/Server boundary: interactive components are "use client"; keep pages server when possible
- Runnability: include dependencies/scripts; the project must start and preview: pnpm dev

# 2) Folder structure (refactor to this)
Use this structure (adjust only when necessary, keep clear layering):
app/
  (main)/
    page.tsx                      # /  Home — Scene Selection
    interview/
      page.tsx                    # /interview
    daily/
      page.tsx                    # /daily
    review/
      page.tsx                    # /review
      loading.tsx
      error.tsx
    flashcard/
      generate/
        page.tsx                  # /flashcard/generate
      review/
        page.tsx                  # /flashcard/review
        loading.tsx
        error.tsx
    history/
      page.tsx                    # /history
      loading.tsx
      error.tsx
      [id]/
        page.tsx                  # /history/[id]
        loading.tsx
        not-found.tsx
  layout.tsx                      # root layout with TopNavBar
  globals.css
components/
  layout/
  scene/          # SceneCard, SceneGrid, SceneBadge
  input/          # ContextForm, SourceTextPanel, TranslationPanel, AIReferenceReveal, ActionBar
  review/         # ReviewHeader, ReviewItemList, ReviewItem, IssueBadge, ComparisonBlock
  flashcard/      # ModeSelector, FlashcardPreview, Flashcard3D, RatingBar, ReviewProgressHeader
  history/        # FilterBar, HistoryList, HistoryCard, FlashcardLinksBlock
  common/         # ProgressStepper, PageWrapper, SkeletonCard
  ui/                   // shadcn generated components
lib/
  utils.ts              // cn()
  api.ts                // fetch wrapper
  types.ts              // TS types
  schemas.ts            // zod schemas
services/
  translation.ts    # submit source text, get AI reference translation
  review.ts         # request AI review, parse feedback items
  flashcard.ts      # generate flashcards (paragraph/sentence mode), SM-2 scheduling, save/fetch
  history.ts        # fetch history list (with filters), fetch single record, re-do
styles/
  globals.css

# 3) Data strategy (mock first, real API later)
- Mock strategy: in-memory  // in-memory/json file/msw
- Services layer: pages/components must call services; no scattered fetch calls
- API contract: define types + zod schemas now; later swap to Next.js API Routes + Prisma (PostgreSQL)
- URL state: sync filters/pagination/sorting with searchParams: History list filters: scene (interview|daily), date range, keyword search; all synced to searchParams

# 4) Required feature checklist (must complete one by one)
1) Routes & pages:
- /: SceneGrid with 2 SceneCards (Interview, Daily); clicking card navigates to /interview or /daily; hover shadow; responsive single-column on mobile
- /interview (and /daily): ProgressStepper (4 steps); ContextForm with validation (required for Interview, optional for Daily); SourceTextPanel (amber highlight, read-only); TranslationTextarea (auto-grow); AIReferenceReveal toggle (fade); Submit button disabled until ≥10 chars translation; ActionBar sticky on mobile
- /review: ReviewHeader with IssueSummaryBar (Grammar/Word Choice/Sentence Structure counts); ReviewItemList with ReviewItem cards (SentenceIndex chip, IssueBadge, ComparisonBlock 2-col desktop/stacked mobile, ReasonBlock); Loading skeleton; Empty success state; Generate Flashcard button in ActionBar
2) Componentization:
- Layout: TopNavBar, ProgressStepper, PageWrapper, ActionBar
- Domain components: SceneCard, SceneGrid, SceneBadge, ContextForm, SourceTextPanel, TranslationPanel, AIReferenceReveal, ReviewHeader, IssueSummaryBar, ReviewItem, ComparisonBlock, ModeSelector, FlashcardPreview, Flashcard3D, RatingBar, ReviewProgressHeader, HistoryCard, FilterBar, FlashcardLinksBlock
3) Interactions & states:
- Forms: InterviewContextForm (3 fields: job_description textarea required, company_background textarea required, question_type select required); DailyContextForm (2 fields: conversation_setting input optional, formality_level select optional); TranslationForm (1 field: translation textarea required min 10 chars)
- Tables/Lists: HistoryList — card-based list (not a table), filterable by scene + date + keyword, URL-synced, paginated with cursor
- Dialogs/Sheets: NavigationSheet — hamburger drawer for mobile nav; AIReferenceReveal — inline expand/collapse panel (not a dialog); FlashcardPreviewExpand — inline expand within FlashcardPreview card
- Toast rules: Success toast after flashcards saved ('Flashcards saved!'); error toast on AI review API failure ('Review failed — please try again'); error toast on flashcard save failure
- Loading/Empty/Error rules:
  /review: loading.tsx (skeleton × 3 ReviewItem cards) while AI processes; empty success state when no issues found; error.tsx with retry button on API failure
  /flashcard/review: loading.tsx for initial card fetch; empty state 'All caught up!' when no cards due
  /history: loading.tsx (skeleton × 4 HistoryCards); empty state 'No history yet' with CTA; error.tsx with retry
  /history/[id]: loading.tsx; not-found.tsx for invalid id
  Submit button: disabled state until translation ≥ 10 chars
  Generate Flashcard button: disabled until AI review completes

# 5) Styling & token normalization (must do)
- Map all colors/background/borders/text to shadcn tokens (CSS variables)
- Normalize spacing/typography/radius/shadows using Tailwind (avoid arbitrary px drift)
- Dark mode strategy: ignore  // support/ignore/partial

# 6) Deliverables
- Create the project files: package.json, tsconfig, tailwind config, postcss config, globals.css
- Add shadcn/ui components and generate ui/* files as needed
- Implement all routes/components and ensure it runs
- Provide run commands & verification steps:
  1. pnpm install && pnpm dev
  2. Navigate to / — see two scene cards (Interview, Daily)
  3. Click Interview → see ContextForm; fill fields → SourceTextPanel visible → type translation → Submit enables
  4. Submit → navigate to /review → loading skeleton → review items appear
  5. Click 'Generate Flashcard' → /flashcard/generate → mode selector works → Save
  6. Navigate to /flashcard/review → card renders → click to flip → rating buttons appear → select rating → next card
  7. Navigate to /history → list renders with filter bar → click item → detail view → Re-do button
  8. Mobile: resize to <768px — single column scene grid, hamburger nav, sticky ActionBar
- Provide notes for swapping mock -> real API:
  - Replace services/translation.ts mock with fetch('/api/translation/reference')
  - Replace services/review.ts mock with fetch('/api/review') [POST with source + translation]
  - Replace services/flashcard.ts mock with fetch('/api/flashcard') [POST to save, GET to list due]
  - Replace services/history.ts mock with fetch('/api/history') and fetch('/api/history/[id]')
  - All API routes: app/api/* using Next.js Route Handlers (GET/POST)
  - SM-2 scheduling logic moves to server-side (API route or Prisma hook)

Start by creating the project skeleton, converting the Stitch UI into shadcn/ui componentized code, ensuring it runs, then implement interactions, states, and layering.
