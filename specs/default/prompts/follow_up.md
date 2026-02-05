[AI Studio Follow-up Prompt | From runnable demo to maintainable code]

Please harden the existing runnable implementation without changing the already approved visual style (Scene card layout, color scheme (blue/green dual accent), error type badge colors, flashcard flip animation, review card left-border style, Navbar layout).

# A) Code quality
- Enforce naming conventions: PascalCase for components and types, camelCase for functions/variables/hooks, kebab-case for routes and CSS files, UPPER_SNAKE_CASE for constants
- Remove any "any" types; tighten props and domain models
- Extract repeated UI into shared components: PageHeader, EmptyState, ErrorBanner, SceneTypeBadge, ErrorTypeBadge, LoadingCard, ActionBar, ToggleOption

# B) Performance & boundaries
- Reduce unnecessary client components; keep pure presentational parts as server components
- Large list optimization (if needed): Virtualize history list if > 100 items using @tanstack/react-virtual; paginate flashcard queue loading in batches of 20

# C) Accessibility & UX details
- Form a11y: label/aria, error associations
- Dialog/Sheet focus management and close behaviors
- Improve error/empty copy: Empty history: add book illustration + "Your translation journey starts here. Pick a scene and begin!"
Empty review: add checkmark illustration + "All caught up! No cards due for review."
AI review error: "We couldn't analyze your translation right now. Please check your connection and try again."
Flashcard generation error: "Flashcard couldn't be created. Your translation is saved — try generating again."

# D) Testing (optional)
- Testing stack: Vitest + React Testing Library + Playwright
- Critical interaction test cases: Unit:
- SM-2 algorithm: correct interval calculation for each rating (0-5)
- Source text highlighting logic
- History filter/search logic
Integration:
- Interview flow: fill context → input source → write translation → submit → review renders correctly → generate flashcard
- Daily flow: quick input → toggle AI-only mode → submit → review → generate sentence-mode flashcards
- Review session: load due cards → flip → rate → verify next card loads → session summary at end
E2E (Playwright):
- Full interview translation journey end-to-end
- Full daily quick-input journey end-to-end
- Flashcard review session with multiple ratings
- History page: search, filter, navigate to detail, redo translation

After changes, output: a change summary, a list of key files touched, and the next 3 recommended steps aligned to MVP / prototype hardening.
