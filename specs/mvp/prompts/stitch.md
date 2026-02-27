[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least 3 distinct variants.

# 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Home (Scene Selection) + Interview Input
- Target users: English learners who want to improve translation and writing skills through structured practice
- Primary user goal (what task must be completed): Select a practice scene (Interview or Daily), write an English translation, and submit it for AI feedback
- Requirements (you may paste PRD / user stories): WriteCraft MVP — core learning loop:
  1. Scene Selection (Home): Two scene cards — Interview and Daily. Each card shows context hints and a CTA button.
  2. Interview Input: Collapsible context form (Job Description, Company Background, Question Type select). Highlighted source text panel (amber background). Translation textarea. Hidden AI reference translation (revealed on click). Submit button disabled until translation has content.
  3. Daily Input: Same flow as Interview but context fields are optional; user may skip directly to source text.
  4. AI Review: Sentence-by-sentence feedback cards. Each card shows original vs. revised sentence side-by-side, issue type badge (Grammar / Word Choice / Sentence Structure), and a reason. Issue summary bar at top.
  5. Flashcard Generation: Mode selector (Paragraph vs. Sentence), card previews with front/back, Save button.
  6. Flashcard Review (SRS): 3D flip card with SM-2 rating (0–5). Progress bar. Rating buttons appear after flip.
  7. History: Filterable list (scene, date, keyword). History detail with re-do capability.

# 2) Information architecture & layout
- Page type: mixed  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with logo (WriteCraft) + 3 nav links (Home, History, Review) + responsive hamburger Sheet on mobile
  // e.g., left Sidebar with Home, History, Review (with due-card badge count), top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right):
  Home page: TopNavBar → HeroHeader (heading + subheading) → SceneGrid (2 scene cards: Interview + Daily)
  Interview Input page: TopNavBar → ProgressStepper (4 steps: Context/Translate/Review/Flashcard) → SectionHeading → ContextForm (collapsible) → SourceTextPanel (amber highlight) → TranslationPanel (textarea + hidden AI reference) → ActionBar (Submit)
- Responsive rules: <768px: SceneGrid single column; ContextForm full-width; ComparisonBlock stacked vertically; ActionBar pinned to bottom; NavLinks collapse into hamburger Sheet; RatingButtonGroup wraps
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Button, Card, Tabs, Select, Textarea, Input, Badge, Skeleton, Progress, Separator, Sheet, Alert, Toast
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable):
  Interview ContextForm:
  - job_description | textarea | required | min 10 chars | "" | "Paste the job description or role requirements here…"
  - company_background | textarea | required | min 5 chars | "" | "Briefly describe the company or industry…"
  - question_type | select | required | one of enum | "" | options: Behavioral, Technical, Situational, Case Study, Other

  Daily ContextForm (all optional):
  - conversation_setting | input | optional | none | "" | "e.g., texting a friend, emailing a colleague…"
  - formality_level | select | optional | none | "" | options: Informal, Neutral, Formal

  TranslationPanel:
  - translation | textarea | required | min 10 chars | "" | "Write your English translation here…"
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: click scene card to navigate; collapse/expand ContextForm; toggle AI Reference Translation visibility (fade in/out); type in TranslationTextarea to enable Submit button; hover card shows shadow-md; ProgressStepper shows current step
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): Home: 2 SkeletonCard placeholders in grid; Interview Input: skeleton for ContextForm fields while session loads; AI Review page: 3 SkeletonReviewItem cards while AI processes
- Empty state: History list: illustration + 'No history yet' heading + 'Complete your first practice session to see records here.' + 'Start Practicing' button; Flashcard Review: 'All caught up! 🎉' heading + 'Come back tomorrow for your next review.' + 'Back to Home' button; AI Review: green success card 'Great job! No issues found.'
- Error state: AI Review failure: Alert banner 'We couldn't process your translation. Please try again.' with Retry button; Form validation: inline error message under each invalid field; Network error: Toast 'Something went wrong. Check your connection and try again.'
- Disabled / permission states (if any): Submit button disabled (grayed, cursor-not-allowed) until TranslationTextarea has ≥ 10 characters; Generate Flashcard button disabled until AI Review completes; Rating buttons hidden until flashcard is flipped

# 5) Copy & localization
- Locale: en-US  // en-US/ja-JP/zh-CN
- Tone of voice: encouraging and clear; professional but approachable; second-person ('you', 'your')
- Key CTA labels & messages:
  - Home heading: "What would you like to practice today?"
  - Home subheading: "Choose a scene to begin your translation practice."
  - Interview card CTA: "Start Interview Practice"
  - Daily card CTA: "Start Daily Practice"
  - Submit: "Submit for AI Review"
  - AI Reference toggle (hidden): "Show AI Reference Translation"
  - AI Reference toggle (revealed): "Hide AI Reference Translation"
  - Generate Flashcard: "Generate Flashcard"
  - Save Flashcards: "Save Flashcards"
  - Rating prompt: "How well did you recall?"
  - Re-do: "Re-do This Exercise"
  - Back: "← History"

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): blue-600 for Interview scene accents, green-600 for Daily scene accents; global primary = blue-600; amber-50/amber-200 for source text highlight panel
- Typography preference: system font stack (Inter or system sans-serif); clean sans-serif; heading 24–28px bold, body 14–16px regular, label 11–13px
- Radius & shadow preference: rounded-lg (8px) for standard cards, rounded-xl (12px) for scene cards, rounded-2xl (16px) for flashcard; shadow-sm default, shadow-md on hover; transition-shadow 200ms
- Spacing density: comfortable  // compact/comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.
