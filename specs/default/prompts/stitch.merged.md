[Merged from: specs/default/spec.md + specs/default/frontend_components_spec.md]
[Source prompt: specs/default/prompts/stitch.md]
[Merged on: 2026-02-04]


<!-- ===== PAGE 1: Home / Scene Selection ===== -->

[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least 3 distinct variants.

# 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Home / Scene Selection
- Target users: English learners practicing translation writing
- Primary user goal (what task must be completed): Choose a translation practice scene (Interview or Daily) and start a new session
- Requirements (you may paste PRD / user stories): - Two scene cards: Interview Scene and Daily Scene
- Interview Scene: requires detailed context (position, company, interview type); suited for paragraph-level practice; emphasizes professionalism
- Interview Scene guides users to use professional frameworks (e.g., STAR method) <!-- from spec -->
- Daily Scene: context is optional/simplified (setting, formality); suited for quick fragmented expressions; emphasizes naturalness
- Daily Scene supports quick input mode with simplified interface and minimal steps <!-- from spec -->
- Quick-access entry point for Daily Scene ("Quick Input")
- Navigation to History and Flashcard Review
- Each scene card displays an icon (briefcase for Interview, chat bubble for Daily), title, description, and a tag list showing scene characteristics <!-- from component spec -->
- Interview card tags: ["STAR Framework", "Professional Terms", "Paragraph Mode"] <!-- from component spec -->
- Daily card tags: ["Quick Input", "Idiomatic Expressions", "Sentence Mode"] <!-- from component spec -->

# 2) Information architecture & layout
- Page type: landing  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with logo ("WriteCraft"), nav_items (Home, History, Review, Statistics), and user menu <!-- from component spec -->
  // e.g., left Sidebar with Home, History, Review, Settings, top Topbar with search/user menu/notifications
- The "Review" nav item displays a Badge with the count of cards due for review today <!-- from component spec -->
- Current active nav item has visual highlight <!-- from component spec -->
- Page sections (list the blocks from top-to-bottom / left-to-right): Navbar → Hero header (app title + tagline) → Scene card grid (2 cards: Interview / Daily) → Quick Input shortcut button → Recent history preview (optional)
- Scene cards have icon container (rounded square with scene-colored background), title, description text, and bottom tag list (capsule-shaped tags) <!-- from component spec -->
- Responsive rules: <768px: stack scene cards vertically; hero text smaller; pin Quick Input CTA at bottom
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Skeleton, Separator
- Additional components for scene cards: Tag (capsule-shaped label) within a TagList per card <!-- from component spec -->
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): N/A
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: Click Interview card → navigate to /interview/input; Click Daily card → navigate to /daily/input; Click Quick Input → navigate to /daily/input with simplified mode; Click Review badge → navigate to /review
- Click Statistics nav item → navigate to /stats <!-- from component spec -->
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): 2 Card skeletons in grid layout + Navbar skeleton
- Empty state: N/A — landing page always has content
- Error state: Alert banner with retry button if recent history fails to load
- Disabled / permission states (if any): N/A
- Hover state: scene cards elevate with deeper shadow and show colored border (blue for Interview, green for Daily) <!-- from component spec -->

# 5) Copy & localization
- Locale: en-US  // en-US/ja-JP/zh-CN
- Tone of voice: friendly and encouraging
- Key CTA labels & messages: Hero title: "Practice Your English Translation"
Hero subtitle: "Turn everyday language into fluent English"
Interview card title: "Interview Scene"
Interview card desc: "Practice professional translation with detailed context"
Daily card title: "Daily Scene"
Daily card desc: "Quick capture of everyday expressions"
Quick Input CTA: "Quick Input"
Review badge: "Cards due today"
Statistics nav item: "Statistics" <!-- from component spec -->

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600 (interview accent), secondary = green-600 (daily accent)
- Icon container backgrounds: blue-100 for interview, green-100 for daily <!-- from component spec -->
- Typography preference: Inter for headings, system font stack for body
- Radius & shadow preference: rounded-xl cards with shadow-sm, elevated on hover with shadow-md
- Spacing density: comfortable  // compact/comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.


---

<!-- ===== PAGE 2: Translation Workspace ===== -->

[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least 3 distinct variants.

# 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Translation Workspace
- Target users: English learners practicing translation writing
- Primary user goal (what task must be completed): Enter native language source text, translate it into English, receive AI sentence-by-sentence review, and optionally generate flashcards
- Requirements (you may paste PRD / user stories): - Context input section (Interview: job description, company background, interview question type; Daily: optional setting + formality)
- Interview context includes STAR framework hint/info alert: "Situation → Task → Action → Result" <!-- from spec -->
- Native language source input with highlighting
- Source text highlighting uses yellow gradient underline effect (CSS gradient, not block background) with generous line-height <!-- from component spec -->
- Translation writing area (user can toggle on/off; may only want AI translation)
- Daily scene offers two entry paths: (a) "Get AI Translation" directly, or (b) "Write my own translation" first then get AI feedback <!-- from spec -->
- AI Reference Translation display (optional, user decides)
- Submit for AI Review
- AI Review results: sentence-by-sentence with grammar errors, word choice suggestions, sentence structure improvements
- Every piece of feedback must include a reason/explanation <!-- from spec -->
- Side-by-side comparison of original and suggested revision
- Error marking: wavy underline on errors (color-coded by type), green bold text for corrections <!-- from component spec -->
- Error type indicators with different colors/icons (grammar / word choice / structure)
- Review header shows error count summary badges per type (e.g., "2 Grammar", "3 Word Choice", "1 Structure") <!-- from component spec -->
- Overall feedback section at bottom of review: green info box with checkmark, summarizing translation quality, strengths, and improvement suggestions <!-- from component spec -->
- User can choose to revise their translation after viewing feedback <!-- from spec -->
- "Generate Flashcard" action after review with Paragraph/Sentence mode choice
- Flashcard mode selection: dedicated step with ModeOption cards (icon, title, description, recommended badge), not just a small dialog <!-- from component spec -->
- Flashcard card preview showing front (native text) and back (translation + reference) before confirming generation <!-- from component spec -->
- Scene-based defaults: Interview defaults to Paragraph mode, Daily defaults to Sentence mode
- ProgressIndicator across the workflow showing current step / total steps with a progress bar <!-- from component spec -->

# 2) Information architecture & layout
- Page type: form  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with back button, scene indicator badge, nav_items
  // e.g., left Sidebar with Home, History, Review, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Navbar with scene badge → ProgressIndicator (step-based) <!-- from component spec --> → Context input panel (collapsible) → Two-column layout: Left = Native language source (highlighted) with context card (light blue background showing key-value context info) / Right = English translation area with character count and optional voice input button <!-- from component spec --> → Toggle for AI Reference Translation → Submit CTA → AI Review results (sentence-by-sentence cards with indexed items, colored left borders, error summary badges in header, and overall feedback at bottom) <!-- from component spec --> → Generate Flashcard action bar → Flashcard mode selection step with card preview <!-- from component spec -->
- Responsive rules: <768px: stack two-column layout vertically (source above, translation below); collapse context panel by default; pin Submit CTA at bottom; review results full-width
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Form, Input, Textarea, Select, RadioGroup, Tabs, Dialog, Separator, Skeleton, Toast, Alert, Toggle
- Additional components: Progress (for ProgressIndicator), ContextCard (light blue key-value display) <!-- from component spec -->
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): Interview context:
- job_description | Textarea | required | min 10 chars | "" | "Describe the position you're interviewing for" (placeholder example: "e.g., Senior Software Engineer at Google") <!-- from component spec -->
- company_background | Textarea | optional | max 500 chars | "" | "Brief company description" (placeholder example: "e.g., Google is a leading global technology company...") <!-- from component spec -->
- question_type | RadioGroup | required | one of [behavioral, technical, case] | "behavioral" | "" <!-- from component spec: added "case" option -->
Daily context:
- setting | Select | optional | one of [restaurant, store, social, travel, workplace, other] | "" | "Where is this conversation happening?"
- formality | RadioGroup | optional | one of [formal, informal] | "informal" | ""
Shared:
- source_text | Textarea | required | min 1 char | "" | "Enter native language text here"
- translation | Textarea | optional | min 1 char | "" | "Write your English translation here"
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: Fill context → enter source text (auto-highlighted) → toggle translation writing on/off → write translation → toggle AI reference translation visibility → click Submit → view sentence-by-sentence review → click individual review items to expand details → user can revise translation and re-submit <!-- from spec --> → click "Generate Flashcard" → view flashcard mode selection step with card preview <!-- from component spec --> → choose Paragraph/Sentence mode → confirm generation → Toast success
- Daily-specific: user chooses between "Get AI Translation" (primary CTA) or "Write My Own Translation" (secondary CTA) as the entry path <!-- from spec + component spec -->
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): Skeleton over review result area while AI processes; pulsing indicator on Submit button
- Empty state: Review section: 'Submit your translation to receive AI feedback' with arrow pointing to Submit button
- Error state: Alert banner below Submit button: 'AI review failed. Please try again.' with Retry button; Toast for flashcard generation failure
- Disabled / permission states (if any): Submit button disabled until source_text is filled; Generate Flashcard disabled until review is complete
- Translation textarea shows character count (current / max) in footer area <!-- from component spec -->

# 5) Copy & localization
- Locale: en-US  // en-US/ja-JP/zh-CN
- Tone of voice: supportive and instructive
- Key CTA labels & messages: Submit CTA: "Submit for Review"
Toggle translation: "I want to write my own translation"
Toggle AI ref: "Show AI Reference Translation"
Generate flashcard CTA: "Generate Flashcard"
Paragraph mode: "Paragraph Mode (full context)"
Paragraph mode desc: "Save complete paragraph with context" <!-- from component spec -->
Paragraph mode recommended: "Recommended for Interview" <!-- from component spec -->
Sentence mode: "Sentence Mode (fine-grained)"
Sentence mode desc: "Split into multiple cards for bite-sized review" <!-- from component spec -->
Sentence mode recommended: "Recommended for Daily" <!-- from component spec -->
Grammar badge: "Grammar"
Word choice badge: "Word Choice"
Structure badge: "Structure"
Review loading: "AI is analyzing your translation..."
Flashcard success toast: "Flashcard generated successfully!"
STAR framework hint title: "STAR Framework Tip" <!-- from spec -->
STAR framework hint desc: "Situation → Task → Action → Result" <!-- from spec -->
Overall feedback title: "Overall Feedback" <!-- from component spec -->
Daily path CTA primary: "Get AI Translation" <!-- from component spec -->
Daily path CTA secondary: "Write My Own Translation" <!-- from component spec -->
Card preview title: "Preview Card Content" <!-- from component spec -->
Card preview front label: "Front (Native Language Source)" <!-- from component spec -->
Card preview back label: "Back (Your Translation + Reference)" <!-- from component spec -->

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600; grammar error = red-500; word choice = amber-500; structure = violet-500
- Source text highlight: yellow gradient underline (not block background), left yellow border on the text box <!-- from component spec -->
- Context card: light blue background (blue-50) with rounded corners <!-- from component spec -->
- Review items: each has a circular index badge (numbered), colored left border matching error type <!-- from component spec -->
- Correction highlight: green bold text for suggested corrections <!-- from component spec -->
- Error highlight: wavy underline in error-type color <!-- from component spec -->
- Overall feedback box: green background with checkmark icon <!-- from component spec -->
- Typography preference: Inter for headings, system font stack for body; monospace hint for source text highlight
- Radius & shadow preference: rounded-lg panels; review cards with left colored border (error type); shadow-sm default
- Spacing density: comfortable  // compact/comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.


---

<!-- ===== PAGE 3: Flashcard Review ===== -->

[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least 3 distinct variants.

# 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Flashcard Review
- Target users: English learners reviewing past translations with spaced repetition
- Primary user goal (what task must be completed): Review flashcards using SM-2 spaced repetition: see native language front, recall translation, flip to check, and self-rate quality (0-5)
- Requirements (you may paste PRD / user stories): - Card front: native language source text; can expand to view context info
- Card front also displays a scene type badge (Interview / Daily) at the top <!-- from component spec -->
- Card back: user's translation (green badge label), AI-revised reference (blue badge label, optional toggle), key feedback summary (optional toggle) <!-- from component spec -->
- Card back sections separated by horizontal divider <!-- from component spec -->
- Self-rating buttons (0-5) with labels: 0-2 forgotten, 3 barely, 4 hesitant, 5 effortless
- SM-2 algorithm: adjusts next review interval based on rating
- SM-2 interval details: first review after 1 day, second after 6 days, subsequent calculated from difficulty factor and previous interval; after forgetting reset to 1 day <!-- from spec -->
- Card order: new cards first, then due cards, then random reinforcement cards
- Random reinforcement cards mixed in to strengthen memory <!-- from spec -->
- Progress indicator: cards remaining, cards reviewed today
- Progress displayed as a separate card at bottom with progress bar and "current / total" counter <!-- from component spec -->
- Clean, focused interface
- 3D flip animation on the card (front/back absolutely positioned, back rotated 180deg hidden; on flip, container rotates 180deg; animation duration 0.6s with smooth transition) <!-- from component spec -->
- Card minimum height ~400px to ensure sufficient visual presence <!-- from component spec -->
- Session summary screen shown at end of all cards <!-- from spec -->

# 2) Information architecture & layout
- Page type: wizard  // e.g., dashboard / list / detail / form / settings
- Navigation structure: minimal top bar with back button, progress indicator, and close
  // e.g., left Sidebar with Back to Home, Progress counter, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Minimal top bar with progress → Flashcard (centered, large, min-h ~400px) with 3D flip animation <!-- from component spec --> → Context expand toggle → Rating action bar (6 buttons: 0-5) → ReviewProgressBar card at bottom (separate white card with progress bar and current/total count) <!-- from component spec --> → Session summary at end
- Responsive rules: <768px: card takes full width with padding; rating buttons stack as 2x3 grid; context panel as bottom Sheet
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Progress, Separator, Sheet, Toggle, Skeleton
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): N/A
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: View card front (native text with scene badge at top) <!-- from component spec --> → optionally expand context → mentally recall translation → tap/click "Tap to reveal" button to flip card (3D rotation) <!-- from component spec --> → view back (user translation section with green badge + divider + AI revision section with blue badge + feedback) <!-- from component spec --> → tap rating (0-5) → card animates out → next card slides in → at session end show summary
- Clicking any rating button submits the score and advances to the next card <!-- from component spec -->
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): Single large Card skeleton centered with pulsing animation
- Empty state: Illustration + 'No cards due for review. Great job!' + CTA 'Start a new translation'
- Error state: Alert: 'Failed to load review cards' + Retry button
- Disabled / permission states (if any): Rating buttons disabled until card is flipped

# 5) Copy & localization
- Locale: en-US  // en-US/ja-JP/zh-CN
- Tone of voice: encouraging and minimal
- Key CTA labels & messages: Flip CTA: "Tap to reveal"
Rating 0: "Forgot"
Rating 1: "Forgot"
Rating 2: "Forgot"
Rating 3: "Hard"
Rating 4: "Good"
Rating 5: "Easy"
Show context: "View Context"
Show AI revision: "Show AI Revision"
Show feedback: "Show Feedback"
Empty state: "No cards due for review. Great job!"
Empty CTA: "Start a new translation" <!-- from component spec -->
Session complete: "Session Complete"
Cards reviewed: "Cards reviewed today"
Card front scene badge: "Interview Scene" / "Daily Scene" <!-- from component spec -->
Card back user translation label: "Your Translation" <!-- from component spec -->
Card back reference label: "Reference Version" <!-- from component spec -->
Progress label: "Progress" <!-- from component spec -->

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600; rating-low (0-2) = red-500; rating-mid (3) = amber-500; rating-high (4-5) = green-500
- Rating buttons show number on top line and text label below; color gradient from red (0) to green (5) <!-- from component spec -->
- Typography preference: Inter, large text for card content (text-xl), clean sans-serif
- Radius & shadow preference: rounded-2xl card with shadow-lg for the flashcard; rating buttons rounded-lg
- Spacing density: comfortable  // compact/comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.


---

<!-- ===== PAGE 4: History ===== -->

[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least 3 distinct variants.

# 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: History
- Target users: English learners reviewing and managing past translation exercises
- Primary user goal (what task must be completed): Browse, search, and filter past translation exercises; view details; redo translations or regenerate flashcards
- Requirements (you may paste PRD / user stories): - History list in reverse chronological order
- Filter by scene type (Interview / Daily)
- Filter by date range
- Search functionality (text search across source and translation)
- Detail view: complete source text, user translation, AI review with highlighted key issues
- Detail view is a separate page (/history/:id) with BackButton, DetailHeader (scene badge + timestamp + context title + action buttons), and TwoColumnLayout (original text with yellow highlight + user translation) + ReviewSection reusing AI review item list <!-- from component spec -->
- Redo operations: modify previous translation, re-request AI review, re-generate flashcards
- Statistics (expandable): total count, scene distribution, common error analysis, learning progress
- Statistics is a separate page (/stats) with StatCards grid and Charts grid <!-- from component spec -->
- Each history item shows: timestamp, scene type badge, source preview, translation preview, flashcard link
- Each history card also shows error type summary badges in footer (e.g., "2 Grammar", "3 Word Choice") and a "View Detail" link button <!-- from component spec -->
- Each history card has a three-dot MoreButton (DropdownMenu) for additional actions <!-- from component spec -->
- History records all content: source text, user translation, AI review feedback, AI reference translations, timestamp, scene type, and associated flashcard info <!-- from spec -->

# 2) Information architecture & layout
- Page type: list  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with nav_items; filter bar below Navbar
  // e.g., left Sidebar with Home, History, Review, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Navbar → Filter bar (scene type tabs + date range picker + search input) → History card list (paginated) → Statistics summary panel (collapsible at top or bottom)
- History card structure: CardHeader (SceneBadge + Timestamp + MoreButton) → PreviewText (first 2 lines of source, truncated with ellipsis) → CardFooter (error type badges on left + "View Detail →" link on right) <!-- from component spec -->
- Detail page layout: BackButton ("← Back to List") → DetailCard with DetailHeader (scene badge + timestamp + context title on left; "Redo Translation" secondary button + "Generate Flashcard" primary button on right) → TwoColumnLayout (OriginalTextSection with yellow highlight + UserTranslationSection) → ReviewSection (reuses AI review item list) <!-- from component spec -->
- Statistics page layout: PageHeader → StatsCardGrid (4 stat cards) → ChartsGrid (SceneDistributionChart + ErrorTypeChart) <!-- from component spec -->
- Responsive rules: <768px: filter bar stacks vertically; search input full-width; history cards full-width; statistics panel as bottom Sheet; date picker as Dialog
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Input, Select, Tabs, Separator, Skeleton, Dialog, Sheet, DropdownMenu
- Additional components for detail/stats pages: Progress (for stat charts), BackButton <!-- from component spec -->
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): History card list: columns (date, scene_type badge, source_preview truncated, translation_preview truncated, status badge, actions dropdown)
Sorting: by date (default desc)
Pagination: 20 items per page, cursor-based  # inferred
Filters: scene_type (all/interview/daily), date_range, search text
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): - search | Input | optional | "" | "" | "Search translations..."
- scene_filter | Tabs | optional | one of [all, interview, daily] | "all" | ""
- date_range | DateRangePicker | optional | valid date range | "" | "Select date range"
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: Type in search → auto-filter list; click scene tab → filter; pick date range → filter; click history card → navigate to detail view (/history/:id) <!-- from component spec -->; in detail: click "Redo Translation" → open translation workspace pre-filled; click "Re-generate Flashcard" → Dialog to confirm; click "Re-request Review" → trigger AI review; click BackButton → return to history list <!-- from component spec -->
- Statistics page interactions: view stat cards (total translations, flashcard count, learning streak, average accuracy); view scene distribution horizontal bar chart; view error type list with counts <!-- from component spec -->
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): 4 Card skeletons stacked vertically with badge and text line placeholders
- Empty state: Illustration + 'No translation history yet' + CTA 'Start your first translation'
- Error state: Alert banner: 'Failed to load history' + Retry button
- Disabled / permission states (if any): Redo buttons disabled while AI review is in progress

# 5) Copy & localization
- Locale: en-US  // en-US/ja-JP/zh-CN
- Tone of voice: clean and informational
- Key CTA labels & messages: Page title: "Translation History"
Search placeholder: "Search translations..."
Filter all: "All"
Filter interview: "Interview"
Filter daily: "Daily"
Empty state: "No translation history yet"
Empty CTA: "Start your first translation"
Redo: "Redo Translation"
Re-review: "Re-request Review"
Re-generate: "Re-generate Flashcard"
Detail title: "Translation Detail"
Back button: "← Back to List" <!-- from component spec -->
Detail header action primary: "Generate Flashcard" <!-- from component spec -->
Detail header action secondary: "Redo Translation" <!-- from component spec -->
Statistics page title: "Statistics" <!-- from component spec -->
Stat card 1 label: "Total Translations" <!-- from component spec -->
Stat card 2 label: "Flashcards" <!-- from component spec -->
Stat card 3 label: "Learning Streak" <!-- from component spec -->
Stat card 4 label: "Average Accuracy" <!-- from component spec -->
Scene distribution chart title: "Scene Distribution" <!-- from component spec -->
Error type chart title: "Common Error Types" <!-- from component spec -->
Timestamp format: "YYYY-MM-DD HH:mm" or relative time ("2 hours ago", "yesterday") <!-- from component spec -->

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600; interview badge = blue-100/blue-700; daily badge = green-100/green-700
- History card hover: shadow deepens (shadow-sm → shadow-md) <!-- from component spec -->
- Detail page: original text section uses yellow highlight; user translation section uses gray background <!-- from component spec -->
- Stat cards: trend up = green, trend down = red, flat = gray <!-- from component spec -->
- Scene distribution bars: blue for Interview, green for Daily <!-- from component spec -->
- Error type counts: grammar = red, word choice = amber/orange, structure = blue/violet <!-- from component spec -->
- Typography preference: Inter, system font stack; preview text truncated with text-sm
- Radius & shadow preference: rounded-lg cards with shadow-sm; hover shadow-md transition
- Spacing density: comfortable  // compact/comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.
