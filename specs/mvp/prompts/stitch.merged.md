[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least 3 distinct variants.

# 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Home (Scene Selection) + Interview Input
- Target users: English learners who want to improve translation and writing skills through structured practice
- Primary user goal (what task must be completed): Select a practice scene (Interview or Daily), write an English translation, and submit it for AI feedback
- Requirements (you may paste PRD / user stories):

  <!-- from spec -->
  **Core loop**: Select Scene → Input Content → Write Translation → AI Review → Generate Flashcard → Review

  **Module 1 — Scene Selection (Home)**
  Two scenes on the home screen:
  | Scene | Context Fields | Use Case |
  |---|---|---|
  | Interview | Job description, Company background, Interview question type | Paragraph-level professional translation |
  | Daily | Conversation setting (optional), Formality level (optional) | Quick capture of fragmented expressions |
  Daily scene context fields are fully optional — users can skip directly to input.

  **Module 2 — Translation Writing**
  1. Context Input — User fills in scene-specific background fields.
  2. Source Text Input — User enters the native language content to translate. Source text is highlighted for visual prominence.
  3. Translation Writing Area — User writes the English translation while referencing the highlighted source.
  4. AI Reference Translation — Hidden by default; revealed only when the user explicitly clicks to show it.

  **Module 3 — AI Review**
  Feedback displayed sentence by sentence. Each issue shows a side-by-side comparison of original sentence and suggested revision. Different issue types are visually distinguished by color or icon. Every piece of feedback must include a reason.
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
  Cards presented in order: new cards first, then cards due for review.
  Review Flow: (1) Card front shown; (2) User attempts to recall; (3) User flips to reveal back; (4) User self-rates 0–5; (5) System calculates next review date via SM-2; (6) Proceed to next card.
  | Rating | Meaning |
  |---|---|
  | 0–2 | Completely forgotten — reset interval to 1 day |
  | 3 | Recalled with difficulty |
  | 4 | Recalled with slight hesitation |
  | 5 | Recalled effortlessly |
  Default interval: 1st review after 1 day, 2nd after 6 days, subsequent from difficulty factor × previous interval.

  **Module 6 — History**
  All records persisted in a database. Data per record: scene type, context, source text, user translation, AI review feedback, AI reference translation, associated Flashcard IDs, created_at timestamp.
  | Feature | Description |
  |---|---|
  | History List | Reverse chronological; filter by scene type or date range; keyword search |
  | Detail View | Full source text, user translation, and AI review with key issues highlighted |
  | Re-do | Re-edit a past translation, re-request AI review, re-generate Flashcards |

# 2) Information architecture & layout
- Page type: mixed  // Home = landing/card grid; Interview Input = form + content panel wizard step
- Navigation structure: top Navbar with logo (WriteCraft) + 3 nav links (Home, History, Review) + responsive hamburger Sheet on mobile
  // nav items: Home, History, Review (with due-card badge count)
- Page sections (list the blocks from top-to-bottom / left-to-right):
  **Home page**: TopNavBar → HeroHeader (heading + subheading) → SceneGrid (2 scene cards: Interview + Daily)
  **Interview Input page**: TopNavBar → ProgressStepper (4 steps: Context / Translate / Review / Flashcard) → SectionHeading → ContextForm (collapsible: Job Description textarea, Company Background textarea, Question Type select) → SourceTextPanel (amber-50 highlight, read-only, visually prominent) → TranslationPanel (auto-grow textarea + AIReferenceReveal toggle) → ActionBar (Submit button, sticky on mobile)
  <!-- from spec --> Daily Input is identical but context fields are all optional and skippable.
- Responsive rules: <768px: SceneGrid single column; ContextForm full-width; ComparisonBlock stacked vertically; ActionBar pinned to bottom; NavLinks collapse into hamburger Sheet; RatingButtonGroup wraps

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Button, Card, Tabs, Select, Textarea, Input, Badge, Skeleton, Progress, Separator, Sheet, Alert, Toast
- Table/List definition (if applicable): N/A for Home and Interview Input. History List: card-based list, reverse chronological, filterable by scene type + date range + keyword search. <!-- from spec -->
- Form fields (if applicable):
  **Interview ContextForm** (all required):
  - job_description | textarea | required | min 10 chars | "" | "Paste the job description or role requirements here…"
  - company_background | textarea | required | min 5 chars | "" | "Briefly describe the company or industry…"
  - question_type | select | required | one of enum | "" | options: Behavioral, Technical, Situational, Case Study, Other

  **Daily ContextForm** (all optional): <!-- from spec: "Daily scene context fields are fully optional" -->
  - conversation_setting | input | optional | none | "" | "e.g., texting a friend, emailing a colleague…"
  - formality_level | select | optional | none | "" | options: Informal, Neutral, Formal

  **TranslationPanel**:
  - translation | textarea | required | min 10 chars | "" | "Write your English translation here…"

- Key interactions:
  - Click scene card to navigate to /interview or /daily
  - Collapse/expand ContextForm via toggle button
  - <!-- from spec --> AI Reference Translation is hidden by default; user must explicitly click to reveal it (toggle button)
  - Type in TranslationTextarea → Submit button enables when ≥ 10 chars
  - Hover scene card → shadow-md transition
  - ProgressStepper tracks current workflow step
  - <!-- from spec --> History: Re-do button re-opens a past exercise for re-editing, re-review, and re-generating flashcards

# 4) State design (must include)
- Loading state (Skeleton coverage): Home: 2 SkeletonCard placeholders in grid; Interview Input: skeleton for ContextForm fields while session loads; AI Review page: 3 SkeletonReviewItem cards while AI processes
- Empty state:
  - History list: illustration + "No history yet" heading + "Complete your first practice session to see records here." + "Start Practicing" button
  - Flashcard Review: "All caught up! 🎉" heading + "Come back tomorrow for your next review." + "Back to Home" button
  - AI Review: <!-- from spec: no issues found → show success state --> green success card "Great job! No issues found in your translation."
- Error state:
  - AI Review failure: Alert banner "We couldn't process your translation. Please try again." with Retry button
  - Form validation: inline error message under each invalid field (react-hook-form + zod pattern)
  - Network error: Toast "Something went wrong. Check your connection and try again."
- Disabled / permission states:
  - Submit button disabled (grayed, cursor-not-allowed) until TranslationTextarea has ≥ 10 characters
  - <!-- from spec --> Generate Flashcard button appears only after AI Review is complete
  - Rating buttons hidden until flashcard is flipped

# 5) Copy & localization
- Locale: en-US
- Tone of voice: encouraging and clear; professional but approachable; second-person ("you", "your")
- Key CTA labels & messages:
  - Home heading: "What would you like to practice today?"
  - Home subheading: "Choose a scene to begin your translation practice."
  - Interview card CTA: "Start Interview Practice"
  - Daily card CTA: "Start Daily Practice"
  - Submit: "Submit for AI Review"
  - AI Reference toggle (hidden): "Show AI Reference Translation" <!-- from spec: revealed only when user explicitly clicks -->
  - AI Reference toggle (revealed): "Hide AI Reference Translation"
  - Generate Flashcard: "Generate Flashcard" <!-- from spec: button label -->
  - Save Flashcards: "Save Flashcards"
  - Rating prompt: "How well did you recall?"
  - Rating labels: "0 — Forgot", "1", "2", "3 — Hard", "4", "5 — Easy" <!-- from spec: SM-2 0–5 scale -->
  - Re-do: "Re-do This Exercise"
  - Back: "← History"
  - Daily optional hint: "Context fields are optional — feel free to skip." <!-- from spec -->

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light
- Primary color token hint:
  - Global primary: blue-600
  - Interview accent: blue-100/blue-700 (badge), blue-500 (icon), blue-600 (CTA button) <!-- from spec: Interview = professional/corporate tone -->
  - Daily accent: green-100/green-700 (badge), green-500 (icon), green-600 (CTA button) <!-- from spec: Daily = casual/quick -->
  - Source text highlight: amber-50 background, amber-200 border <!-- from spec: "highlighted for visual prominence" -->
  - AI revision highlight: green-50 background
  - Grammar error badge: red-100/red-700
  - Word Choice badge: yellow-100/yellow-700
  - Sentence Structure badge: purple-100/purple-700
- Typography preference: system font stack (Inter or system sans-serif); heading 24–28px bold, body 14–16px regular, label 11–13px
- Radius & shadow preference: rounded-lg (8px) for standard cards; rounded-xl (12px) for scene cards; rounded-2xl (16px) for flashcard; shadow-sm default; shadow-md on hover; transition-shadow 200ms ease-in-out; <!-- from spec-inspired --> dashed-border cards for flashcard previews
- Spacing density: comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
  - Variant A: Card-centric home with large scene cards; wizard-style input with ProgressStepper; 2-column ComparisonBlock in review
  - Variant B: Minimal hero home with smaller scene cards in a row; single-page scroll input; stacked ComparisonBlock in review (mobile-first)
  - Variant C: Sidebar navigation variant; scene selection inline with input form; tabbed review feedback
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together
- <!-- from spec --> The 3D flashcard flip must be represented in the prototype even if simplified (show front and back states clearly)

Start generating the UI prototype and variants now.
