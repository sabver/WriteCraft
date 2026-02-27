[AI Studio Follow-up Prompt | From runnable demo to maintainable code]

Please harden the existing runnable WriteCraft MVP implementation without changing the already approved visual style (card layouts, blue/green dual-scene color scheme, amber source text highlight, pill badge styles for scene and issue types, navigation bar structure, flashcard 3D flip animation, ProgressStepper visual design, RatingBar circular button design).

<!-- from spec -->
**Context**: WriteCraft is an English learning app with this core loop:
Select Scene → Input Content → Write Translation → AI Review → Generate Flashcard → Review

The app has 6 modules: Scene Selection, Translation Writing, AI Review, Flashcard Generation, Flashcard Review (SM-2 SRS), and History. All data is persisted in a database.

# A) Code quality
- Enforce naming conventions: PascalCase for React components and TypeScript types; camelCase for functions, variables, props, and service methods; kebab-case for routes and file names (except components which use PascalCase filenames); SCREAMING_SNAKE_CASE for constants
- Remove any "any" types; tighten props and domain models, especially:
  <!-- from spec -->
  - `Scene: 'interview' | 'daily'`
  - `IssueType: 'grammar' | 'word-choice' | 'sentence-structure'`
  - `SMRating: 0 | 1 | 2 | 3 | 4 | 5`
  - `FlashcardMode: 'paragraph' | 'sentence'`
  - `HistoryRecord: { id, sceneType, context, sourceText, userTranslation, aiReviewFeedback, aiReferenceTranslation, flashcardIds, createdAt }`
  - `FlashCard: { id, front (source text), back (userTranslation + aiRevision + keyFeedbackSummary), contextInfo, createdAt, sceneType, nextReviewDate, interval, easinessFactor }`
  - `ReviewItem: { sentenceIndex, issueType, originalSentence, revisedSentence, reason }`
- Extract repeated UI into shared components:
  - `SceneBadge` — reused on Home, HistoryCard, HistoryDetail, FlashcardFront/Back, Flashcard previews
  - `ProgressStepper` — reused on Interview Input, Daily Input, AI Review, Flashcard Generate pages
  - `PageWrapper` — all pages (max-w-3xl mx-auto px-4 py-8)
  - `SkeletonCard` — variants: SkeletonReviewItem, SkeletonHistoryCard, SkeletonFlashcard
  - `ActionBar` — Interview Input, Daily Input, AI Review, Flashcard Generate
  - `IssueBadge` — ReviewItem header + IssueSummaryBar
  - `BlockLabel` — HistoryDetail blocks (SourceTextBlock, TranslationBlock, AIReviewBlock, FlashcardLinksBlock)

# B) Performance & boundaries
- Reduce unnecessary client components; keep pure presentational parts as server components
  - Server components: HomePage, HistoryListPage, HistoryDetailPage (data-fetching pages)
  - Client components: ContextForm (react-hook-form), TranslationPanel (textarea state), AIReferenceReveal (toggle state), Flashcard3D (3D flip animation + rating interaction), FilterBar (URL state sync), RatingBar
- Large list optimization:
  <!-- from spec: History module persists all records -->
  Virtualize HistoryList if > 100 items using @tanstack/react-virtual; paginate with cursor-based pagination (no offset); limit initial page to 20 items

# C) Accessibility & UX details
- Form a11y: all form fields have associated `<label htmlFor>` or `aria-label`; error messages linked via `aria-describedby`; required fields marked with `aria-required="true"`
  <!-- from spec: Interview form has required fields; Daily form fields are optional -->
- Dialog/Sheet focus management: NavigationSheet traps focus when open; ESC closes; restore focus on close
- Flashcard3D: add `aria-label="Click to flip card"` on front; announce rating result via `aria-live="polite"`
- RatingBar: each rating button has explicit `aria-label` (e.g., "Rate 0 — Completely forgot")
  <!-- from spec: SM-2 ratings with specific meanings: 0-2=forgotten, 3=hard, 4=hesitation, 5=effortless -->
- Improve error/empty copy:
  - History empty state: add a simple SVG illustration of a blank notebook; subtext "Every practice session is a step forward. Start your first one now."
  - AI Review empty (no issues): checkmark SVG illustration + "Your translation looks great! Ready to generate flashcards." + "Generate Flashcard" CTA
  <!-- from spec: Re-do flow = re-edit past translation + re-request AI review + re-generate flashcards -->
  - Re-do confirmation: add a brief toast/banner "You're editing a past exercise. Submit to get fresh AI feedback."
  - All error states: show action-specific retry guidance (e.g., "AI review failed — check your connection and try again")

# D) Testing
- Testing stack: Vitest + React Testing Library + Playwright
- Critical interaction test cases:

  **Unit / Integration (Vitest + RTL)**:
  <!-- from spec: Module 2 — Submit disabled until translation has content -->
  - ContextForm: validates required fields (Interview) and shows inline zod errors; allows empty optional fields (Daily)
  - AIReferenceReveal: hidden on mount; toggles visibility on click; shows correct button label in each state
  - TranslationTextarea: Submit button disabled at < 10 chars; enabled at ≥ 10 chars
  <!-- from spec: Module 3 — issue types visually distinguished -->
  - ReviewItem: renders red badge for Grammar, yellow for Word Choice, purple for Sentence Structure
  - ComparisonBlock: renders 2 columns on desktop; stacks on mobile (use viewport resize)
  <!-- from spec: Module 5 — 3D flip core UX; SM-2 exact schedule -->
  - Flashcard3D: flips on click; RatingBar appears after flip; hidden before flip
  - SM-2 service (flashcard.ts): ratings 0–2 reset interval to 1 day; rating 5 × easiness factor applied; 1st review = 1 day, 2nd review = 6 days
  <!-- from spec: Module 6 — URL-synced filters -->
  - FilterBar: applying scene filter updates URL searchParam `?scene=interview`; clearing resets to no param
  - HistoryCard: Re-do button navigates to /interview or /daily with pre-populated data

  **E2E (Playwright)**:
  <!-- from spec: core loop end-to-end -->
  - **Interview full flow**: Navigate to / → click "Start Interview Practice" → fill context form → SourceTextPanel visible → type translation (≥ 10 chars) → Submit enables → submit → /review loads → skeleton → review items appear → click "Generate Flashcard" → /flashcard/generate → mode defaults to Paragraph → Save → success toast → history entry created
  - **Daily quick flow**: Navigate to / → click "Start Daily Practice" → skip context (submit still available) → type translation → submit → /review → review renders
  - **Flashcard Review flow**: Navigate to /flashcard/review → card front shown → click to flip (3D) → back revealed → RatingBar appears → click rating "5" → next card advances → repeat until all done → "All caught up!" state
  - **History filter flow**: Navigate to /history → apply "Interview" scene filter → URL shows `?scene=interview` → list filtered → clear filter → all items return
  - **Mobile responsive**: viewport 375px — SceneGrid renders single column; hamburger nav opens Sheet; ActionBar pinned to bottom; ComparisonBlock stacked vertically

After changes, output: a change summary, a list of key files touched, and the next 3 recommended steps aligned to **MVP prototype hardening** stage (aim: production-ready code quality, comprehensive test coverage, API swap readiness).
