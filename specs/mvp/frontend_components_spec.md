# WriteCraft MVP - Frontend Component Breakdown

## Table of Contents

- [Global Components](#global-components)
- [Page 1: Home — Scene Selection](#page-1-home--scene-selection)
- [Page 2: Interview Input](#page-2-interview-input)
- [Page 3: Daily Input](#page-3-daily-input)
- [Page 4: AI Review](#page-4-ai-review)
- [Page 5: Flashcard Generation](#page-5-flashcard-generation)
- [Page 6: Flashcard Review](#page-6-flashcard-review)
- [Page 7: History List](#page-7-history-list)
- [Page 8: History Detail](#page-8-history-detail)
- [Visual Specification Summary](#visual-specification-summary)

---

## Global Components

### TopNavBar (Global Navigation Bar)

**Component Structure**:
```
TopNavBar
├── LogoMark
│   └── Text: "WriteCraft"
├── NavLinks
│   ├── NavLink: "Home"
│   ├── NavLink: "History"
│   └── NavLink: "Review" (with active-card-count Badge)
└── NavActions (reserved for future auth avatar)
```

**Component Description**:
- Fixed to top of viewport; height 56px; white background with `border-bottom` separator (1px, `border-border`).
- LogoMark: bold 18px text, dark primary color; clicking navigates to `/`.
- NavLinks: horizontal row of text links; active link has an underline accent in primary color.
- "Review" NavLink shows a small Badge with count of cards due for review today; hidden when count = 0.
- Mobile (<768px): collapses NavLinks into a hamburger Sheet; LogoMark and hamburger icon remain visible.

**Content Data**:
- Logo text: "WriteCraft"
- Nav items: "Home", "History", "Review"
- Review badge: "3 due" (example)

---

### SceneBadge (Scene Type Indicator)

**Component Description**:
- Pill-shaped badge (rounded-full, px-3 py-1, text-xs font-semibold).
- Two variants:
  - Interview: `bg-blue-100 text-blue-700`
  - Daily: `bg-green-100 text-green-700`
- Used in HistoryCard, HistoryDetail header, FlashcardBack, and any place requiring scene labeling.

**Content Data**:
- Interview variant label: "Interview"
- Daily variant label: "Daily"

---

### ProgressStepper (Workflow Step Indicator)

**Component Structure**:
```
ProgressStepper
├── StepItem × 4
│   ├── StepCircle (number or check icon)
│   └── StepLabel
└── StepConnector × 3 (horizontal lines between items)
```

**Component Description**:
- Horizontal strip placed below TopNavBar on all workflow pages (Interview Input, Daily Input, AI Review, Flashcard Generation).
- Four steps: "Context", "Translate", "Review", "Flashcard".
- Completed step: filled circle with check mark, `bg-primary text-primary-foreground`.
- Current step: filled circle with step number, `bg-primary text-primary-foreground`, label bold.
- Pending step: outlined circle, `border-muted text-muted-foreground`.
- StepConnector is a thin line, filled (`bg-primary`) for completed transitions, gray (`bg-muted`) for pending.
- Mobile (<768px): show only current step label; connectors remain as short lines.

**Content Data**:
- Step labels: "Context", "Translate", "Review", "Flashcard"

---

### PageWrapper (Layout Container)

**Component Description**:
- Max-width container: `max-w-3xl mx-auto px-4 py-8`.
- Used as the inner wrapper on all pages to constrain content width.
- No visual decoration — purely a layout primitive.

---

### SkeletonCard (Loading Placeholder)

**Component Description**:
- White background card matching the shape of the content it replaces.
- Contains animated pulse shimmer rectangles in place of text lines and buttons.
- Variants: `SkeletonHistoryCard`, `SkeletonReviewItem`, `SkeletonFlashcard`.

---

## Page 1: Home — Scene Selection

**Route**: `/`

### Component Tree Structure
```
HomePage
├── TopNavBar (Global)
└── PageWrapper
    ├── HeroHeader
    │   ├── Heading: "What would you like to practice today?"
    │   └── Subheading: "Choose a scene to begin your translation practice."
    └── SceneGrid
        ├── SceneCard: Interview
        │   ├── SceneIcon (briefcase icon)
        │   ├── SceneName: "Interview"
        │   ├── SceneDescription: "Practice professional paragraph-level translation for job interviews."
        │   ├── ContextHints: "Job description · Company background · Question type"
        │   └── StartButton: "Start Interview Practice"
        └── SceneCard: Daily
            ├── SceneIcon (chat bubble icon)
            ├── SceneName: "Daily"
            ├── SceneDescription: "Capture and practice everyday expressions and quick phrases."
            ├── ContextHints: "Setting (optional) · Formality (optional)"
            └── StartButton: "Start Daily Practice"
```

### HeroHeader

**Component Description**:
- Center-aligned block at top of the page content area.
- Heading: 28px bold, `text-foreground`.
- Subheading: 15px, `text-muted-foreground`.
- Vertical spacing: `mb-8`.

**Content Data**:
- Heading: "What would you like to practice today?"
- Subheading: "Choose a scene to begin your translation practice."

---

### SceneGrid

**Component Description**:
- Two-column grid on desktop (`grid grid-cols-2 gap-6`); single column on mobile (`grid-cols-1`).
- Contains exactly two SceneCard components.

---

### SceneCard

**Component Structure**:
```
SceneCard
├── SceneIcon (lucide icon, 32px, colored)
├── SceneName (h2, 20px bold)
├── SceneDescription (14px, muted)
├── ContextHints (12px, muted, with bullet separators)
└── StartButton (full-width, primary)
```

**Component Description**:
- White background card, `rounded-xl`, `shadow-sm`, `border border-border`.
- Padding: `p-6`.
- On hover: `shadow-md` transition (200ms ease).
- Entire card surface is clickable (acts as a link to scene route), StartButton is redundant navigation fallback.
- Interview card: SceneIcon in `text-blue-500`; StartButton uses blue primary.
- Daily card: SceneIcon in `text-green-500`; StartButton uses green primary.

**Content Data**:
- Interview: SceneName "Interview", Description "Practice professional paragraph-level translation for job interviews.", ContextHints "Job description · Company background · Question type", Button "Start Interview Practice"
- Daily: SceneName "Daily", Description "Capture and practice everyday expressions and quick phrases.", ContextHints "Setting · Formality (both optional)", Button "Start Daily Practice"

---

## Page 2: Interview Input

**Route**: `/interview`

### Component Tree Structure
```
InterviewInputPage
├── TopNavBar (Global)
├── ProgressStepper (step 1 active: "Context" → step 2: "Translate")
└── PageWrapper
    ├── SectionHeading: "Interview Practice"
    ├── ContextForm
    │   ├── FormField: Job Description (Textarea)
    │   ├── FormField: Company Background (Textarea)
    │   ├── FormField: Interview Question Type (Select)
    │   └── CollapseToggle: "Show / Hide Context"
    ├── SourceTextPanel
    │   ├── PanelLabel: "Source Text"
    │   └── SourceTextDisplay (highlighted block)
    ├── TranslationPanel
    │   ├── PanelLabel: "Your Translation"
    │   ├── TranslationTextarea
    │   └── AIReferenceReveal
    │       ├── ToggleButton: "Show AI Reference Translation"
    │       └── AIReferenceBlock (hidden by default)
    └── ActionBar
        └── SubmitButton: "Submit for AI Review"
```

### ContextForm

**Component Structure**:
```
ContextForm
├── FormField: "Job Description"
│   └── Textarea (placeholder, required)
├── FormField: "Company Background"
│   └── Textarea (placeholder, required)
├── FormField: "Interview Question Type"
│   └── Select (options list)
└── CollapseToggle
```

**Component Description**:
- White card `rounded-lg border shadow-sm p-6`.
- Each FormField has a Label above and a Textarea or Select below.
- Textareas: `min-h-[80px]`, resize vertical only.
- CollapseToggle at top-right of card; when collapsed, form fields are hidden with slide-up animation (200ms).
- Select options rendered as a shadcn/ui Select component.

**Content Data**:
- Job Description: Label "Job Description", Placeholder "Paste the job description or role requirements here…"
- Company Background: Label "Company Background", Placeholder "Briefly describe the company or industry…"
- Interview Question Type: Label "Question Type", Options: ["Behavioral", "Technical", "Situational", "Case Study", "Other"]
- CollapseToggle: "Hide Context" / "Show Context"

---

### SourceTextPanel

**Component Description**:
- Visually prominent block: `bg-amber-50 border border-amber-200 rounded-lg p-5`.
- PanelLabel: "Source Text", 12px uppercase tracking-wide `text-amber-700`.
- SourceTextDisplay: 16px regular text `text-foreground`; acts as a reference block the user reads while translating.
- User cannot edit this panel — it is display-only.

**Content Data**:
- PanelLabel: "Source Text"
- Example content: "Please introduce yourself and describe your most significant professional achievement."

---

### TranslationPanel

**Component Description**:
- White card area below SourceTextPanel.
- PanelLabel: "Your Translation", 12px uppercase tracking-wide.
- TranslationTextarea: full-width, `min-h-[160px]`, no resize, auto-grows with content (CSS field-sizing or JS).
- AIReferenceReveal: placed at the bottom of the panel.
  - ToggleButton: ghost button with eye icon; text "Show AI Reference Translation".
  - On click, reveals AIReferenceBlock with a fade-in animation.
  - AIReferenceBlock: `bg-slate-50 border border-slate-200 rounded p-4`, 14px italic text.
  - Re-clicking the button hides the block ("Hide AI Reference Translation").

**Content Data**:
- Textarea placeholder: "Write your English translation here…"
- ToggleButton (hidden state): "Show AI Reference Translation"
- ToggleButton (revealed state): "Hide AI Reference Translation"

---

### ActionBar (Interview / Daily Input)

**Component Description**:
- Sticky bottom bar on mobile; static at end of page on desktop.
- `border-t bg-background py-4` with shadow above.
- Primary Button right-aligned: full-width on mobile, auto-width on desktop.
- Button is disabled (grayed out) until TranslationTextarea has at least 10 characters.

**Content Data**:
- Button: "Submit for AI Review"
- Disabled tooltip: "Please write your translation before submitting."

---

## Page 3: Daily Input

**Route**: `/daily`

### Component Tree Structure
```
DailyInputPage
├── TopNavBar (Global)
├── ProgressStepper (step 1 active: "Context")
└── PageWrapper
    ├── SectionHeading: "Daily Practice"
    ├── ContextForm (optional fields, collapsible)
    │   ├── FormField: Conversation Setting (Input, optional)
    │   ├── FormField: Formality Level (Select, optional)
    │   └── SkipHint: "Context fields are optional — feel free to skip."
    ├── SourceTextPanel (same as Interview, reused)
    ├── TranslationPanel (reused from InterviewInputPage)
    └── ActionBar
        └── SubmitButton: "Submit for AI Review"
```

### ContextForm (Daily variant)

**Component Description**:
- Same card style as Interview ContextForm, but fields are visually marked optional.
- Each field label has "(optional)" suffix in muted color.
- SkipHint: italic helper text below the form.
- The form can be completely skipped — ActionBar Submit is enabled even with empty context fields.

**Content Data**:
- Conversation Setting: Label "Conversation Setting (optional)", Placeholder "e.g., texting a friend, emailing a colleague…"
- Formality Level: Label "Formality Level (optional)", Options: ["Informal", "Neutral", "Formal"]
- SkipHint: "Context fields are optional — feel free to skip to source text."

---

## Page 4: AI Review

**Route**: `/review`

### Component Tree Structure
```
AIReviewPage
├── TopNavBar (Global)
├── ProgressStepper (step 3 active: "Review")
└── PageWrapper
    ├── ReviewHeader
    │   ├── IssueSummaryBar
    │   │   ├── IssueCount: Grammar
    │   │   ├── IssueCount: Word Choice
    │   │   └── IssueCount: Sentence Structure
    │   └── OriginalTranslationCollapse
    ├── ReviewItemList
    │   └── ReviewItem × N
    │       ├── SentenceIndex (number chip)
    │       ├── IssueBadge (type badge)
    │       ├── ComparisonBlock
    │       │   ├── OriginalSentence (left / top)
    │       │   └── RevisedSentence (right / bottom, highlighted)
    │       └── ReasonText
    └── ActionBar
        └── GenerateFlashcardButton: "Generate Flashcard"
```

### ReviewHeader

**Component Description**:
- Summary bar showing counts of each feedback type as colored badges.
- IssueSummaryBar: horizontal flex row; each IssueCount is a pill badge with icon + count.
  - Grammar: `bg-red-100 text-red-700`, icon: alert-circle.
  - Word Choice: `bg-yellow-100 text-yellow-700`, icon: pencil.
  - Sentence Structure: `bg-purple-100 text-purple-700`, icon: layout.
- OriginalTranslationCollapse: a collapsible "View original translation" toggle below the summary bar.

**Content Data**:
- IssueCount example: "2 Grammar", "1 Word Choice", "1 Sentence Structure"
- CollapseToggle: "View Original Translation"

---

### ReviewItemList

**Component Description**:
- Vertical list with `gap-4` between items.
- LoadingState: three SkeletonReviewItem cards while AI processes.
- EmptyState: green success card "Great job! No issues found in your translation."

---

### ReviewItem

**Component Structure**:
```
ReviewItem
├── ItemHeader
│   ├── SentenceIndex: "#1"
│   └── IssueBadge (type)
└── ItemBody
    ├── ComparisonBlock
    │   ├── OriginalColumn
    │   │   ├── ColLabel: "Your version"
    │   │   └── SentenceText (original, plain)
    │   └── RevisedColumn
    │       ├── ColLabel: "Suggested revision"
    │       └── SentenceText (revised, highlighted)
    └── ReasonBlock
        ├── ReasonLabel: "Why:"
        └── ReasonText
```

**Component Description**:
- White card `rounded-lg border shadow-sm p-5`.
- ItemHeader: flex row with SentenceIndex chip and IssueBadge.
- SentenceIndex: 12px bold number chip `bg-muted rounded-full px-2 py-0.5`.
- IssueBadge: same pill style as SceneBadge, color-coded by issue type.
- ComparisonBlock: two-column layout on desktop (50%/50%); stacked on mobile.
  - Left column header "Your version" in muted small text; right "Suggested revision" with `text-primary` color.
  - Revised sentence text: `bg-green-50 rounded p-2` highlight.
- ReasonBlock: `bg-slate-50 rounded p-3 mt-3`, 13px text. ReasonLabel bold "Why:".

**Content Data**:
- IssueBadge labels: "Grammar Error", "Word Choice", "Sentence Structure"
- ColLabel left: "Your version"
- ColLabel right: "Suggested revision"
- ReasonLabel: "Why:"
- Example: Original "I am work in marketing.", Revised "I work in marketing.", Reason "'am work' is incorrect; use the simple present 'work' without the auxiliary 'am'."

---

## Page 5: Flashcard Generation

**Route**: `/flashcard/generate`

### Component Tree Structure
```
FlashcardGeneratePage
├── TopNavBar (Global)
├── ProgressStepper (step 4 active: "Flashcard")
└── PageWrapper
    ├── SectionHeading: "Generate Flashcards"
    ├── ModeSelector
    │   ├── ModeTab: "Paragraph Mode" (default for Interview)
    │   └── ModeTab: "Sentence Mode" (default for Daily)
    ├── ModeDescription
    ├── CardPreviewList
    │   └── FlashcardPreview × N
    │       ├── CardFront
    │       │   └── SourceText
    │       └── CardBack (collapsed by default, expandable)
    │           ├── UserTranslation
    │           ├── AIRevision
    │           └── KeyFeedbackSummary
    └── ActionBar
        └── ConfirmGenerateButton: "Save Flashcards"
```

### ModeSelector

**Component Description**:
- shadcn/ui Tabs component with two tabs.
- Active tab: filled pill `bg-primary text-primary-foreground`.
- Inactive tab: outlined/ghost style.
- Switching tabs updates the CardPreviewList below.
- A small "(default)" tag appears on the pre-selected mode appropriate for the current scene.

**Content Data**:
- Tab 1: "Paragraph Mode — One full exercise per card"
- Tab 2: "Sentence Mode — One sentence or phrase per card"

---

### FlashcardPreview

**Component Description**:
- Card with a dashed border `border-2 border-dashed border-muted rounded-xl p-5`.
- CardFront: always visible. SourceText in 15px regular.
- CardBack: collapsed by default; "Preview back →" ghost link expands it.
- When expanded, CardBack shows three sections separated by Separators:
  - UserTranslation: labeled "Your Translation", plain text.
  - AIRevision: labeled "AI Revision" with `bg-green-50` highlight.
  - KeyFeedbackSummary: labeled "Key Feedback", bullet list of max 3 points.

---

## Page 6: Flashcard Review

**Route**: `/flashcard/review`

### Component Tree Structure
```
FlashcardReviewPage
├── TopNavBar (Global)
└── PageWrapper
    ├── ReviewProgressHeader
    │   ├── ProgressLabel: "Card 3 of 12"
    │   └── ProgressBar (linear)
    ├── FlashcardStack
    │   └── Flashcard3D
    │       ├── FrontFace
    │       │   ├── SceneBadge (Global)
    │       │   ├── SourceText
    │       │   └── FlipPrompt: "Tap to reveal your translation"
    │       └── BackFace
    │           ├── SceneBadge (Global)
    │           ├── UserTranslationSection
    │           │   ├── SectionLabel: "Your Translation"
    │           │   └── TranslationText
    │           ├── AIRevisionSection
    │           │   ├── SectionLabel: "AI Revision"
    │           │   └── RevisionText (highlighted)
    │           └── FeedbackSummarySection
    │               ├── SectionLabel: "Key Feedback"
    │               └── FeedbackList (bullet items)
    ├── ContextPanel (expandable, shown after flip)
    │   └── ContextToggle: "Show Context"
    └── RatingBar (shown only after card is flipped)
        ├── RatingLabel: "How well did you recall?"
        └── RatingButtonGroup
            ├── RatingButton: "0 — Forgot"
            ├── RatingButton: "1"
            ├── RatingButton: "2"
            ├── RatingButton: "3 — Hard"
            ├── RatingButton: "4"
            └── RatingButton: "5 — Easy"
```

### Flashcard3D

**Component Description**:
- Large centered card: `max-w-lg w-full mx-auto`, `rounded-2xl shadow-lg`.
- CSS 3D flip animation: `transform-style: preserve-3d`, transition `0.5s ease`.
- FrontFace: white background; SourceText in 18px centered; FlipPrompt in muted italic 13px at bottom.
- BackFace: white background; three sections separated by `<Separator />`.
- Card flips 180° on click (or tap on mobile).
- Once flipped, back is revealed and RatingBar fades in below.

**Content Data**:
- FrontFace FlipPrompt: "Tap to reveal your translation"
- BackFace SectionLabels: "Your Translation", "AI Revision", "Key Feedback"

---

### RatingBar

**Component Description**:
- Appears below Flashcard3D after card flip, with a fade-in transition.
- RatingLabel: 13px centered muted text.
- RatingButtonGroup: horizontal flex of 6 buttons `gap-2`.
  - Ratings 0–2: `hover:bg-red-100 hover:border-red-300`.
  - Rating 3: `hover:bg-yellow-100`.
  - Ratings 4–5: `hover:bg-green-100 hover:border-green-300`.
  - Each button: `w-12 h-12 rounded-full border text-sm font-semibold`.
- Clicking a rating button advances to the next card.
- Transition between cards: slide-left exit, slide-right entrance.

**Content Data**:
- RatingLabel: "How well did you recall?"
- Button labels: "0\nForgot", "1", "2", "3\nHard", "4", "5\nEasy"

---

### ReviewProgressHeader

**Component Description**:
- Slim header strip below TopNavBar.
- ProgressLabel: "Card 3 of 12" in 13px muted text (left).
- ProgressBar: linear `Progress` component (shadcn/ui), `h-2 rounded-full`, fills left to right.
- EmptyState (all cards done): centered illustration placeholder + "All caught up! 🎉" heading + "Come back tomorrow for your next review." subtext + Button "Back to Home".

---

## Page 7: History List

**Route**: `/history`

### Component Tree Structure
```
HistoryPage
├── TopNavBar (Global)
└── PageWrapper
    ├── PageHeading: "History"
    ├── FilterBar
    │   ├── SearchInput (keyword search)
    │   ├── SceneFilter (Select: All / Interview / Daily)
    │   └── DateRangeFilter (Select: All time / Last 7 days / Last 30 days / Custom)
    ├── HistoryList
    │   └── HistoryCard × N
    │       ├── CardMeta
    │       │   ├── SceneBadge (Global)
    │       │   └── DateLabel
    │       ├── SourceExcerpt (first 80 chars of source text)
    │       ├── TranslationExcerpt (first 80 chars of user translation)
    │       └── CardActions
    │           ├── ViewButton: "View"
    │           └── RedoButton: "Re-do"
    ├── LoadingState (SkeletonHistoryCard × 4)
    ├── EmptyState
    └── PaginationBar
```

### FilterBar

**Component Description**:
- Horizontal strip `flex gap-3 items-center flex-wrap`, `mb-6`.
- SearchInput: shadcn/ui Input with search icon prefix, `w-48` on desktop, full-width on mobile.
- SceneFilter, DateRangeFilter: shadcn/ui Select, `w-36`.
- Filters are synced to URL searchParams (e.g., `?scene=interview&range=7d&q=keyword`).

**Content Data**:
- SearchInput placeholder: "Search by keyword…"
- SceneFilter options: "All Scenes", "Interview", "Daily"
- DateRangeFilter options: "All Time", "Last 7 Days", "Last 30 Days"

---

### HistoryCard

**Component Description**:
- White card `rounded-lg border shadow-sm p-4`, hover `shadow-md`.
- CardMeta: flex row, SceneBadge on left, DateLabel on right (`text-muted-foreground text-xs`).
- SourceExcerpt: 14px bold, max 2 lines, text-overflow ellipsis.
- TranslationExcerpt: 13px muted, max 2 lines, text-overflow ellipsis.
- CardActions: right-aligned, `flex gap-2`. ViewButton = ghost, RedoButton = outline.
- Clicking anywhere on the card (except action buttons) navigates to `/history/[id]`.

**Content Data**:
- DateLabel format: "Feb 20, 2026"
- ViewButton: "View"
- RedoButton: "Re-do"

---

### EmptyState (History)

**Component Description**:
- Centered block with placeholder illustration (greyed out card icon), 24px heading, 14px muted subtext, and a Button.

**Content Data**:
- Heading: "No history yet"
- Subtext: "Complete your first practice session to see records here."
- Button: "Start Practicing"

---

## Page 8: History Detail

**Route**: `/history/[id]`

### Component Tree Structure
```
HistoryDetailPage
├── TopNavBar (Global)
└── PageWrapper
    ├── DetailHeader
    │   ├── BackLink: "← History"
    │   ├── SceneBadge (Global)
    │   ├── DateLabel
    │   └── RedoButton: "Re-do This Exercise"
    ├── SourceTextBlock
    │   ├── BlockLabel: "Source Text"
    │   └── SourceText (full, highlighted amber background)
    ├── TranslationBlock
    │   ├── BlockLabel: "Your Translation"
    │   └── TranslationText
    ├── AIReviewBlock
    │   ├── BlockLabel: "AI Review"
    │   └── ReviewItemList (reused from AIReviewPage)
    │       └── ReviewItem × N (reused)
    └── FlashcardLinksBlock
        ├── BlockLabel: "Linked Flashcards"
        └── FlashcardChipList
            └── FlashcardChip × N (small card, click to open review)
```

### DetailHeader

**Component Description**:
- Flex row: BackLink on far left, right side has RedoButton.
- SceneBadge and DateLabel appear below in a second row.
- BackLink: ghost small button with ← arrow, navigates to `/history`.
- RedoButton: outline Button.

**Content Data**:
- BackLink: "← History"
- RedoButton: "Re-do This Exercise"

---

### SourceTextBlock / TranslationBlock

**Component Description**:
- BlockLabel: 11px uppercase tracking-wide `text-muted-foreground`, `mb-2`.
- SourceTextBlock: `bg-amber-50 border border-amber-200 rounded-lg p-5` (same style as input page).
- TranslationBlock: white card `border rounded-lg p-5`.

---

### FlashcardLinksBlock

**Component Description**:
- Horizontal scroll row of FlashcardChip components (overflow-x-auto, no-scrollbar).
- Each FlashcardChip: compact card `rounded-lg border px-4 py-3 text-sm`, shows front-text excerpt.
- Clicking a chip navigates to `/flashcard/review` pre-filtered to that card.

---

## Visual Specification Summary

### Color Coding

| Element | Token / Class |
|---|---|
| Interview scene | `blue-100 / blue-700` (badge), `blue-500` (icon), `blue-600` (primary button) |
| Daily scene | `green-100 / green-700` (badge), `green-500` (icon), `green-600` (primary button) |
| Grammar errors | `red-100 / red-700` |
| Word Choice issues | `yellow-100 / yellow-700` |
| Sentence Structure issues | `purple-100 / purple-700` |
| Source text highlight | `amber-50 / amber-200` |
| AI revision highlight | `green-50` |
| Neutral backgrounds | `slate-50` |

### Card Styles

- **Base card**: `bg-white rounded-lg border border-border shadow-sm`
- **Elevated card** (hover): `shadow-md` transition 200ms
- **3D flashcard**: `rounded-2xl shadow-lg` with 3D flip CSS
- **Preview card**: `border-2 border-dashed border-muted rounded-xl`
- **Highlight block**: `bg-amber-50 border border-amber-200 rounded-lg` (source text)

### Badge Styles

- All badges: `rounded-full px-3 py-1 text-xs font-semibold`
- Scene badges: blue or green background/text per scene
- Issue type badges: red / yellow / purple per type
- Rating buttons: circular `w-12 h-12 rounded-full` with color-coded hover states

### Button Hierarchy

- **Primary CTA**: `bg-primary text-primary-foreground` (filled, full-width on mobile)
- **Secondary action**: `variant="outline"` (e.g., Re-do, View)
- **Tertiary / navigation**: `variant="ghost"` (e.g., Back link, toggle)

### Spacing and Typography

| Level | Size / Weight | Usage |
|---|---|---|
| Page heading | 24px / bold | Section titles (e.g., "History") |
| Card heading | 18–20px / semibold | Scene card names, flashcard source text |
| Body | 14–16px / regular | Descriptions, translation text |
| Label / meta | 11–13px / regular or semibold | Field labels, badge text, dates |
| Helper / muted | 12–13px / regular | Placeholder, hints, reason text |

### Animation and Transitions

- **Card hover shadow**: `transition-shadow duration-200 ease-in-out`
- **AI reference reveal**: `transition-opacity duration-300 ease-in-out`
- **Flashcard flip**: `transform rotateY(180deg) transition-transform duration-500 ease`
- **ProgressStepper fill**: `transition-width duration-300 ease-in-out`
- **Card advance (review)**: slide-left exit + slide-right entrance, 300ms
- **RatingBar appear**: `animate-fade-in` after flip
