[AI Studio Build Mode Prompt Template | Convert Stitch prototype into a runnable Next.js + shadcn/ui app]

You are a senior frontend engineering agent. Your goal is to convert the currently imported Stitch prototype/export (code/HTML/screenshots/notes) into a runnable Next.js project using the fixed stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.

# 0) Input context
- Imported source: Stitch prototype export (HTML + design tokens)  // Stitch export: code/HTML/screenshots/notes
- Target app requirements: English Translation Writing Assistant — a web app for English learners to:
1. Select a practice scene (Interview with detailed context, or Daily with optional simplified context)
2. Enter native language text and translate it into English
3. Receive AI sentence-by-sentence review (grammar errors, word choice suggestions, structure improvements)
4. Generate flashcards (Paragraph mode or Sentence mode) from completed translations
5. Review flashcards using SM-2 spaced repetition algorithm
6. Browse translation history with search, filter, redo, and statistics
- Key pages/routes: / (home — scene selection landing)
/interview/input (interview context + translation workspace)
/daily/input (daily context + translation workspace)
/review (flashcard review session)
/history (translation history list)
/history/[id] (translation detail view)
/settings (user preferences — flashcard defaults, display toggles)  # inferred
- Brand/visual constraints to preserve: Blue/green dual accent (blue for interview, green for daily); card-based layout; colored left-border badges for error types (red=grammar, amber=word choice, violet=structure); large centered flashcard with flip animation; clean encouraging tone

# 1) Hard engineering constraints (must follow)
- Next.js: 15 (default: latest stable), App Router (/app)
- TypeScript strict mode: true (true/false)
- Tailwind: use shadcn token approach (CSS variables); no inline styles; no hard-coded colors
- UI components: prefer shadcn/ui (Button/Card/Input/Select/Dialog/Sheet/DropdownMenu/Tabs/Table/Skeleton/Toast/Alert)
- Utility: use cn (tailwind-merge + clsx): lib/utils.ts
- Forms: react-hook-form + zod (errors rendered under the field)
- States: implement loading.tsx / error.tsx / not-found.tsx (at least for /review, /history, /history/[id], /interview/input, /daily/input)
- Client/Server boundary: interactive components are "use client"; keep pages server when possible
- Runnability: include dependencies/scripts; the project must start and preview: pnpm dev

# 2) Folder structure (refactor to this)
Use this structure (adjust only when necessary, keep clear layering):
app/
  (main)/
  page.tsx                          # Home / scene selection
  layout.tsx                        # Main layout with Navbar
  interview/
    input/
      page.tsx                      # Interview context + translation workspace
      loading.tsx
      error.tsx
  daily/
    input/
      page.tsx                      # Daily context + translation workspace
      loading.tsx
      error.tsx
  review/
    page.tsx                        # Flashcard review session
    loading.tsx
    error.tsx
  history/
    page.tsx                        # History list
    loading.tsx
    error.tsx
    [id]/
      page.tsx                      # Translation detail
      loading.tsx
      not-found.tsx
  settings/
    page.tsx                        # User preferences  # inferred
components/
  layout/
  scene/                              # SceneCard, SceneSelector
translation/                        # SourceInput, TranslationEditor, AIReferenceToggle
review/                             # ReviewResultList, ReviewItem, ErrorBadge
flashcard/                          # FlashcardViewer, FlashcardFlip, RatingBar, SessionSummary
history/                            # HistoryCard, HistoryFilters, HistoryDetail
common/                             # PageHeader, EmptyState, ErrorBanner  # inferred
  ui/                   // shadcn generated components
lib/
  utils.ts              // cn()
  api.ts                // fetch wrapper
  types.ts              // TS types
  schemas.ts            // zod schemas
services/
  ai.ts                               # AI review + AI reference translation calls
flashcard.ts                        # Flashcard CRUD + SM-2 scheduling logic
history.ts                          # Translation history CRUD + search/filter
translation.ts                      # Translation session management
settings.ts                         # User preference storage  # inferred
styles/
  globals.css

# 3) Data strategy (mock first, real API later)
- Mock strategy: in-memory  // in-memory/json file/msw
- Services layer: pages/components must call services; no scattered fetch calls
- API contract: define types + zod schemas now; later swap to Next.js API Routes + Prisma (SQLite for dev, Postgres for prod)
- URL state: sync filters/pagination/sorting with searchParams: history list filters (scene type, date range, search query), history pagination

# 4) Required feature checklist (must complete one by one)
1) Routes & pages:
- /: Scene selection cards (Interview + Daily); quick input shortcut; due-card badge linking to /review; responsive grid
- /interview/input: Context form (job desc, company, question type); source text input with highlighting; translation writing area (toggleable); AI reference translation toggle; submit for review; sentence-by-sentence review display with error type badges; generate flashcard dialog (Paragraph/Sentence mode)
- /review: Card front/back flip; context expand; AI revision + feedback toggles; SM-2 rating (0-5); card queue (new → due → random); progress indicator; session summary
2) Componentization:
- Layout: Navbar, PageHeader, TwoColumnLayout, ActionBar, MobileBottomBar
- Domain components: SceneCard, ContextForm, SourceHighlighter, TranslationEditor, AIReferencePanel, ReviewResultList, ReviewItem, ErrorTypeBadge, FlashcardViewer, FlashcardFlip, RatingBar, SessionSummary, HistoryCard, HistoryFilters, StatsSummary
3) Interactions & states:
- Forms: InterviewContextForm (job_description + company_background + question_type), DailyContextForm (setting + formality), TranslationForm (source_text + translation)
- Tables/Lists: HistoryList (filterable card list with search, scene tab filter, date range filter, pagination)
- Dialogs/Sheets: FlashcardModeDialog (choose Paragraph/Sentence mode), ContextSheet (expandable context on flashcard review), DeleteConfirmDialog (history redo confirmation)
- Toast rules: Success toast on flashcard generation; success toast on translation submit; error toast on AI review failure; error toast on flashcard generation failure
- Loading/Empty/Error rules: /: Skeleton cards while loading recent history preview
/interview/input & /daily/input: Skeleton over review area while AI processes; disabled Submit until source_text filled
/review: Skeleton card while loading queue; empty state when no cards due; error alert if load fails
/history: Skeleton card list while loading; empty state with CTA when no history; error alert with retry
/history/[id]: Skeleton layout while loading; not-found if invalid ID

# 5) Styling & token normalization (must do)
- Map all colors/background/borders/text to shadcn tokens (CSS variables)
- Normalize spacing/typography/radius/shadows using Tailwind (avoid arbitrary px drift)
- Dark mode strategy: support  // support/ignore/partial

# 6) Deliverables
- Create the project files: package.json, tsconfig, tailwind config, postcss config, globals.css
- Add shadcn/ui components and generate ui/* files as needed
- Implement all routes/components and ensure it runs
- Provide run commands & verification steps: 1. pnpm install && pnpm dev
2. Navigate to / — see two scene cards
3. Click Interview → fill context → enter source → write translation → submit → see review results
4. Click "Generate Flashcard" → choose mode → confirm → success toast
5. Navigate to /review → flip card → rate → next card
6. Navigate to /history → filter by scene → search → click detail
7. In detail view → redo translation → re-request review
8. Test responsive: resize to mobile width, verify stacked layouts and bottom CTA
- Provide notes for swapping mock -> real API: 1. Replace in-memory mock data in services/*.ts with fetch calls to /api/* route handlers
2. Create /api/translations, /api/flashcards, /api/history route handlers
3. Add Prisma schema for Translation, FlashcardCard, ReviewResult models
4. Move SM-2 calculation from client to server (keep pure function in lib/sm2.ts)
5. Replace localStorage settings with database-backed user preferences
6. Add API error handling with proper HTTP status codes

Start by creating the project skeleton, converting the Stitch UI into shadcn/ui componentized code, ensuring it runs, then implement interactions, states, and layering.
