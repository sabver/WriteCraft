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
- Daily Scene: context is optional/simplified (setting, formality); suited for quick fragmented expressions; emphasizes naturalness
- Quick-access entry point for Daily Scene ("Quick Input")
- Navigation to History and Flashcard Review

# 2) Information architecture & layout
- Page type: landing  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with logo, nav_items, and user menu
  // e.g., left Sidebar with Home, History, Review, Settings, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Navbar → Hero header (app title + tagline) → Scene card grid (2 cards: Interview / Daily) → Quick Input shortcut button → Recent history preview (optional)
- Responsive rules: <768px: stack scene cards vertically; hero text smaller; pin Quick Input CTA at bottom
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Skeleton, Separator
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): N/A
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: Click Interview card → navigate to /interview/input; Click Daily card → navigate to /daily/input; Click Quick Input → navigate to /daily/input with simplified mode; Click Review badge → navigate to /review
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): 2 Card skeletons in grid layout + Navbar skeleton
- Empty state: N/A — landing page always has content
- Error state: Alert banner with retry button if recent history fails to load
- Disabled / permission states (if any): N/A

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

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600 (interview accent), secondary = green-600 (daily accent)
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
- Native language source input with highlighting
- Translation writing area (user can toggle on/off; may only want AI translation)
- AI Reference Translation display (optional, user decides)
- Submit for AI Review
- AI Review results: sentence-by-sentence with grammar errors, word choice suggestions, sentence structure improvements
- Side-by-side comparison of original and suggested revision
- Error type indicators with different colors/icons (grammar / word choice / structure)
- "Generate Flashcard" action after review with Paragraph/Sentence mode choice
- Scene-based defaults: Interview defaults to Paragraph mode, Daily defaults to Sentence mode

# 2) Information architecture & layout
- Page type: form  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with back button, scene indicator badge, nav_items
  // e.g., left Sidebar with Home, History, Review, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Navbar with scene badge → Context input panel (collapsible) → Two-column layout: Left = Native language source (highlighted) / Right = English translation area → Toggle for AI Reference Translation → Submit CTA → AI Review results (sentence-by-sentence cards) → Generate Flashcard action bar
- Responsive rules: <768px: stack two-column layout vertically (source above, translation below); collapse context panel by default; pin Submit CTA at bottom; review results full-width
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Form, Input, Textarea, Select, RadioGroup, Tabs, Dialog, Separator, Skeleton, Toast, Alert, Toggle
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): Interview context:
- job_description | Textarea | required | min 10 chars | "" | "Describe the position you're interviewing for"
- company_background | Textarea | optional | max 500 chars | "" | "Brief company description"
- question_type | RadioGroup | required | one of [behavioral, technical] | "behavioral" | ""
Daily context:
- setting | Select | optional | one of [restaurant, store, social, travel, workplace, other] | "" | "Where is this conversation happening?"
- formality | RadioGroup | optional | one of [formal, informal] | "informal" | ""
Shared:
- source_text | Textarea | required | min 1 char | "" | "Enter native language text here"
- translation | Textarea | optional | min 1 char | "" | "Write your English translation here"
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: Fill context → enter source text (auto-highlighted) → toggle translation writing on/off → write translation → toggle AI reference translation visibility → click Submit → view sentence-by-sentence review → click individual review items to expand details → click "Generate Flashcard" → choose Paragraph/Sentence mode in Dialog → confirm generation → Toast success
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): Skeleton over review result area while AI processes; pulsing indicator on Submit button
- Empty state: Review section: 'Submit your translation to receive AI feedback' with arrow pointing to Submit button
- Error state: Alert banner below Submit button: 'AI review failed. Please try again.' with Retry button; Toast for flashcard generation failure
- Disabled / permission states (if any): Submit button disabled until source_text is filled; Generate Flashcard disabled until review is complete

# 5) Copy & localization
- Locale: en-US  // en-US/ja-JP/zh-CN
- Tone of voice: supportive and instructive
- Key CTA labels & messages: Submit CTA: "Submit for Review"
Toggle translation: "I want to write my own translation"
Toggle AI ref: "Show AI Reference Translation"
Generate flashcard CTA: "Generate Flashcard"
Paragraph mode: "Paragraph Mode (full context)"
Sentence mode: "Sentence Mode (fine-grained)"
Grammar badge: "Grammar"
Word choice badge: "Word Choice"
Structure badge: "Structure"
Review loading: "AI is analyzing your translation..."
Flashcard success toast: "Flashcard generated successfully!"

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600; grammar error = red-500; word choice = amber-500; structure = violet-500
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
- Card back: user's translation, AI-revised reference (optional toggle), key feedback summary (optional toggle)
- Self-rating buttons (0-5) with labels: 0-2 forgotten, 3 barely, 4 hesitant, 5 effortless
- SM-2 algorithm: adjusts next review interval based on rating
- Card order: new cards first, then due cards, then random reinforcement cards
- Progress indicator: cards remaining, cards reviewed today
- Clean, focused interface

# 2) Information architecture & layout
- Page type: wizard  // e.g., dashboard / list / detail / form / settings
- Navigation structure: minimal top bar with back button, progress indicator, and close
  // e.g., left Sidebar with Back to Home, Progress counter, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Minimal top bar with progress → Flashcard (centered, large) with flip animation → Context expand toggle → Rating action bar (6 buttons: 0-5) → Session summary at end
- Responsive rules: <768px: card takes full width with padding; rating buttons stack as 2x3 grid; context panel as bottom Sheet
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Progress, Separator, Sheet, Toggle, Skeleton
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): N/A
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): N/A
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: View card front (native text) → optionally expand context → mentally recall translation → tap/click to flip card → view back (translation + optional AI revision + feedback) → tap rating (0-5) → card animates out → next card slides in → at session end show summary
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
Session complete: "Session Complete"
Cards reviewed: "Cards reviewed today"

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600; rating-low (0-2) = red-500; rating-mid (3) = amber-500; rating-high (4-5) = green-500
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
- Redo operations: modify previous translation, re-request AI review, re-generate flashcards
- Statistics (expandable): total count, scene distribution, common error analysis, learning progress
- Each history item shows: timestamp, scene type badge, source preview, translation preview, flashcard link

# 2) Information architecture & layout
- Page type: list  // e.g., dashboard / list / detail / form / settings
- Navigation structure: top Navbar with nav_items; filter bar below Navbar
  // e.g., left Sidebar with Home, History, Review, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): Navbar → Filter bar (scene type tabs + date range picker + search input) → History card list (paginated) → Statistics summary panel (collapsible at top or bottom)
- Responsive rules: <768px: filter bar stacks vertically; search input full-width; history cards full-width; statistics panel as bottom Sheet; date picker as Dialog
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Input, Select, Tabs, Separator, Skeleton, Dialog, Sheet, DropdownMenu
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
- Key interactions: Type in search → auto-filter list; click scene tab → filter; pick date range → filter; click history card → navigate to detail view; in detail: click "Redo Translation" → open translation workspace pre-filled; click "Re-generate Flashcard" → Dialog to confirm; click "Re-request Review" → trigger AI review
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

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light  // light/dark/both
- Primary color token hint (prefer token semantics over hex): primary = blue-600; interview badge = blue-100/blue-700; daily badge = green-100/green-700
- Typography preference: Inter, system font stack; preview text truncated with text-sm
- Radius & shadow preference: rounded-lg cards with shadow-sm; hover shadow-md transition
- Spacing density: comfortable  // compact/comfortable

# 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.
