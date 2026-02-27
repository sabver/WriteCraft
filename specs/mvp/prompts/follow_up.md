[AI Studio Follow-up Prompt | From runnable demo to maintainable code]

Please harden the existing runnable implementation without changing the already approved visual style (Card layouts, color scheme, badge styles, navigation bar, flashcard 3D flip).

# A) Code quality
- Enforce naming conventions: PascalCase for React components and TypeScript types; camelCase for functions, variables, props, and service methods; kebab-case for routes and file names (except components which use PascalCase filenames); SCREAMING_SNAKE_CASE for constants
- Remove any "any" types; tighten props and domain models
- Extract repeated UI into shared components: SceneBadge (reused in 5+ locations), ProgressStepper (reused on 4 workflow pages), PageWrapper (all pages), SkeletonCard (multiple variants), ActionBar (Interview/Daily/Review pages), IssueBadge (ReviewItem + IssueSummaryBar), BlockLabel (History Detail + SourceTextPanel + TranslationPanel)

# B) Performance & boundaries
- Reduce unnecessary client components; keep pure presentational parts as server components
- Large list optimization (if needed): Virtualize HistoryList if > 100 items using @tanstack/react-virtual; paginate with cursor-based pagination (no offset); limit initial page to 20 items

# C) Accessibility & UX details
- Form a11y: label/aria, error associations
- Dialog/Sheet focus management and close behaviors
- Improve error/empty copy: History empty state: add a simple SVG illustration of a blank notebook; motivational subtext 'Every practice session is a step forward.'; AI Review empty (no issues): add a checkmark illustration + 'Your translation looks great! Ready to generate flashcards.' All error states: show specific retry guidance, not just generic error.

# D) Testing (optional)
- Testing stack: Vitest + React Testing Library + Playwright
- Critical interaction test cases:
  Unit/Integration:
  - ContextForm validates required fields and shows inline errors
  - AIReferenceReveal toggles visibility correctly
  - TranslationTextarea enables Submit button at ≥ 10 chars
  - ReviewItem renders correct badge color per issue type
  - Flashcard3D flips on click; RatingBar appears after flip
  - SM-2 scheduling produces correct next-review dates for ratings 0–5
  - FilterBar syncs filters to URL searchParams

  E2E (Playwright):
  - Interview flow: fill context → input source text → write translation → submit → review renders → generate flashcard → flashcard review (flip + rate) → history entry created
  - Daily flow: skip context → input source text → write translation → submit → review renders
  - History filter: apply scene filter → URL updates → list filters correctly → clear filter → all items return
  - Mobile responsive: <768px — scene grid single column, hamburger nav opens, ActionBar pinned

After changes, output: a change summary, a list of key files touched, and the next 3 recommended steps aligned to MVP prototype hardening.
