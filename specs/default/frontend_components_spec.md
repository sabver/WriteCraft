# English Translation Writing Assistant - Frontend Component Breakdown

## Table of Contents

- [Global Components](#global-components)
- [Page 1: Home (Scene Selection)](#page-1-home-scene-selection)
- [Page 2: Interview Context Input](#page-2-interview-context-input)
- [Page 3: Daily Scene Input](#page-3-daily-scene-input)
- [Page 4: Translation Workspace](#page-4-translation-workspace)
- [Page 5: AI Review](#page-5-ai-review)
- [Page 6: Flashcard Generation](#page-6-flashcard-generation)
- [Page 7: Flashcard Review](#page-7-flashcard-review)
- [Page 8: History List](#page-8-history-list)
- [Page 9: History Detail](#page-9-history-detail)
- [Page 10: Statistics](#page-10-statistics)
- [Page 11: Settings](#page-11-settings)
- [Visual Specification Summary](#visual-specification-summary)

---

## Global Components

### AppLayout (Application Shell)

**Component Structure**:
```
AppLayout
├── Sidebar
│   ├── AppLogo
│   ├── NavMenu
│   │   ├── NavItem: "Home" (icon: home)
│   │   ├── NavItem: "History" (icon: clock)
│   │   ├── NavItem: "Review" (icon: layers, with badge)
│   │   └── NavItem: "Statistics" (icon: bar-chart)
│   └── SidebarFooter
│       └── NavItem: "Settings" (icon: settings)
└── MainContent
    └── {Page Content}
```

**Component Description**:
- Fixed sidebar on the left (width ~240px on desktop), collapsible to icon-only mode (~64px)
- Sidebar has a dark navy background (`hsl(222, 47%, 11%)`) with white/light-gray text
- AppLogo displays "WriteCraft" in bold white text with a small pen icon to the left
- NavMenu items are vertically stacked with consistent padding (~12px vertical, 16px horizontal)
- Each NavItem shows an icon on the left and label text on the right
- Active NavItem has a slightly lighter background and a left accent border (blue, 3px wide)
- Hover state: background lightens subtly
- "Review" NavItem shows a small circular badge (red background, white text) with the count of cards due for review (e.g., "12")
- SidebarFooter is pinned to the bottom of the sidebar
- On mobile (< 768px): sidebar collapses into a bottom tab bar with icons only
- MainContent fills the remaining viewport width with padding (~24px on desktop, ~16px on mobile)

### ProgressStepper (Multi-Step Progress Indicator)

**Component Structure**:
```
ProgressStepper
├── StepIndicator × N
│   ├── StepCircle (number or check icon)
│   └── StepLabel
└── ConnectorLine × (N-1)
```

**Component Description**:
- Horizontal row of numbered circles connected by lines
- Completed steps: filled blue circle with white checkmark, blue connector line
- Current step: filled blue circle with white number, pulsing ring animation
- Future steps: gray outlined circle with gray number, gray dashed connector line
- Step labels appear below each circle in small gray text
- Used across Interview Context, Translation, and AI Review flows

**Content Data**:
- Interview flow steps: ["Context", "Source Text", "Translate", "Review"]
- Daily flow steps: ["Input", "Translate", "Review"] (shorter flow)

### EmptyState (Empty State Placeholder)

**Component Description**:
- Centered container with a large muted illustration (SVG) at the top
- Below: bold heading text (e.g., "No translations yet")
- Below heading: smaller gray description text (e.g., "Start your first translation practice to see it here")
- Optional primary action button below description

### LoadingSpinner (Loading Indicator)

**Component Description**:
- Centered circular spinner animation using a blue ring
- Optional text below: "Loading..." in gray
- Covers the content area with a semi-transparent overlay when used as a page loader

---

## Page 1: Home (Scene Selection)

**Route**: `/`

### Component Tree Structure
```
HomePage
├── PageHeader
│   ├── Title: "Choose a Practice Scene"
│   └── Subtitle: "Select a scene type to start your translation practice"
└── SceneCardGrid
    ├── SceneCard (Interview Scene)
    └── SceneCard (Daily Scene)
```

### PageHeader

**Component Description**:
- Top section of the page with generous top padding (~48px)
- Title: large bold heading (text-3xl / ~30px), dark text color
- Subtitle: medium text (text-base / ~16px), muted gray color
- Left-aligned
- Bottom margin (~32px) before the card grid

**Content Data**:
- Title: "Choose a Practice Scene"
- Subtitle: "Select a scene type to start your translation practice"

### SceneCardGrid

**Component Description**:
- CSS Grid layout: 2 columns on desktop, 1 column on mobile
- Gap between cards: ~24px
- Maximum width constrained to ~800px, centered

### SceneCard (Scene Selection Card)

**Component Structure**:
```
SceneCard
├── IconContainer
│   └── Icon (SVG)
├── CardTitle
├── CardDescription
└── TagList
    └── Tag × N
```

**Component Description**:
- Large clickable card (min-height ~200px), white background, rounded corners (radius-xl / ~16px), subtle shadow
- Hover: shadow deepens, a colored top border (4px) appears matching the scene's theme color; slight upward translate (-2px) transition
- Cursor changes to pointer on hover
- IconContainer: rounded square (~56px), light tinted background matching theme color, centered icon (~28px)
- CardTitle: bold text (text-xl / ~20px), dark color, margin-top ~16px below icon
- CardDescription: regular text (text-sm / ~14px), muted gray, margin-top ~8px
- TagList: horizontal flex row of tags at the bottom, margin-top ~16px
- Each Tag: small pill shape (rounded-full), light tinted background matching theme color, small text (text-xs / ~12px), matching text color, padding (~4px 10px)
- Entire card is a single click target that navigates to the scene's input page

**Interview Scene Card Content**:
- Icon: Briefcase
- Theme color: Blue (`hsl(221, 83%, 53%)`)
- Title: "Interview Scene"
- Description: "Prepare interview answers with professional expressions and structured frameworks"
- Tags: ["STAR Framework", "Professional Terms", "Paragraph Mode"]
- Navigates to: `/interview/context`

**Daily Scene Card Content**:
- Icon: MessageCircle
- Theme color: Green (`hsl(142, 71%, 45%)`)
- Title: "Daily Scene"
- Description: "Quickly capture everyday expressions and learn natural, idiomatic English"
- Tags: ["Quick Capture", "Idiomatic Usage", "Sentence Mode"]
- Navigates to: `/daily/input`

---

## Page 2: Interview Context Input

**Route**: `/interview/context`

### Component Tree Structure
```
InterviewContextPage
├── ProgressStepper (step 1 of 4)
└── FormCard
    ├── CardHeader
    │   ├── Title: "Interview Context"
    │   └── Description: "Provide details about the interview to get better AI feedback"
    ├── FormBody
    │   ├── FormField (Job Title / Position)
    │   ├── FormField (Company Background)
    │   ├── FormField (Interview Question — textarea)
    │   ├── RadioGroup (Interview Type)
    │   └── InfoAlert (STAR Framework Tip)
    └── CardFooter
        ├── Button: "Cancel" (secondary)
        └── Button: "Next: Enter Source Text →" (primary)
```

### FormCard

**Component Description**:
- White background card, rounded corners (radius-lg / ~12px), subtle shadow
- Padding: ~24px on all sides
- Max-width: ~640px, centered on the page

### CardHeader

**Component Description**:
- Title: bold text (text-xl / ~20px), dark color
- Description: regular text (text-sm / ~14px), muted gray, margin-top ~4px
- Bottom border (1px, light gray) separating header from body, with margin-bottom ~24px

### FormField (Form Input Field)

**Component Structure**:
```
FormField
├── Label
│   ├── LabelText
│   └── OptionalBadge (if optional)
├── Input or Textarea
└── HelperText (if applicable)
```

**Component Description**:
- Label: small medium-weight text (text-sm / ~14px, font-medium), dark color
- OptionalBadge: "(optional)" text in muted gray, appended after label
- Input: full-width, border (1px, light gray), rounded (radius-md / ~8px), padding (~10px 12px)
- Input focus: blue ring outline (ring-2, ring-blue-500), border becomes blue
- Textarea: same styling as input, default 3-4 visible rows, resizable vertically
- HelperText: very small text (text-xs / ~12px), muted gray, margin-top ~4px
- Vertical spacing between form fields: ~20px

**Field Configurations**:
1. **Job Title / Position**:
   - Label: "Job Title / Position"
   - Input type: text
   - Placeholder: "e.g., Senior Software Engineer at Google"
2. **Company Background**:
   - Label: "Company Background"
   - Input type: textarea (3 rows)
   - Placeholder: "e.g., Google is a leading global technology company specializing in..."
3. **Interview Question**:
   - Label: "Interview Question"
   - Input type: textarea (4 rows)
   - Placeholder: "e.g., Tell me about a time you led a project under a tight deadline"
4. **Interview Type**: See RadioGroup below

### RadioGroup (Interview Type Selector)

**Component Structure**:
```
RadioGroup
├── Label: "Interview Type"
└── OptionRow
    ├── RadioOption: "Behavioral"
    ├── RadioOption: "Technical"
    └── RadioOption: "Case Study"
```

**Component Description**:
- Label styled identically to FormField labels
- Options arranged horizontally in a flex row with ~12px gap
- Each RadioOption: a bordered pill/card (rounded-lg, border 1px gray), padding (~8px 16px)
- Unselected: white background, gray border, dark text
- Selected: light blue background, blue border, blue text, small check icon appears
- Hover (unselected): light gray background
- Click selects the option and deselects others

**Options**:
- "Behavioral" (default selected)
- "Technical"
- "Case Study"

### InfoAlert (STAR Framework Tip)

**Component Structure**:
```
InfoAlert
├── Icon (info circle)
└── Content
    ├── Title: "STAR Framework Tip"
    └── Description
```

**Component Description**:
- Light blue tinted background (blue-50), blue left border (3px), rounded corners (radius-md)
- Padding: ~12px 16px
- Icon: blue info circle icon (~20px) on the left
- Title: small bold text (text-sm, font-semibold), dark blue color
- Description: small regular text (text-sm), dark blue color, margin-top ~4px
- Only appears when "Behavioral" interview type is selected

**Content Data**:
- Title: "STAR Framework Tip"
- Description: "Structure your answer using: Situation → Task → Action → Result. This helps organize your response clearly and professionally."

### CardFooter

**Component Description**:
- Top border (1px, light gray), padding-top ~16px, margin-top ~24px
- Flex layout with justify-between
- "Cancel" button: secondary style (white background, gray border, dark text)
- "Next" button: primary style (blue background, white text, rounded)
- "Next" button is disabled until required fields (Job Title, Interview Question) are filled

---

## Page 3: Daily Scene Input

**Route**: `/daily/input`

### Component Tree Structure
```
DailyInputPage
└── FormCard
    ├── CardHeader
    │   ├── Title: "Daily Scene"
    │   └── Description: "Capture everyday expressions for quick translation practice"
    ├── FormBody
    │   ├── CollapsibleSection (Context — optional)
    │   │   ├── SectionToggle: "Add context (optional)"
    │   │   └── CollapsedContent
    │   │       ├── FormField (Setting)
    │   │       └── RadioGroup (Formality)
    │   └── FormField (Native Language Expression — textarea)
    └── CardFooter
        ├── Button: "Get AI Translation" (secondary, green)
        └── Button: "Translate Myself →" (primary, green)
```

### CollapsibleSection (Optional Context)

**Component Description**:
- A toggle header that expands/collapses the context form fields
- Toggle: clickable row with a chevron icon (rotates 90° when expanded) and label text
- Label: "Add context (optional)" in muted text with a plus icon
- When expanded: smooth slide-down animation (~200ms) revealing the context fields
- When collapsed: fields are hidden, only the toggle header is visible
- Default state: collapsed

### SectionToggle

**Component Description**:
- Flex row: chevron icon on left, text label, expand/collapse
- Text: "Add context (optional)" in text-sm, muted gray
- Hover: text becomes slightly darker
- Chevron rotates smoothly on toggle

### FormField — Setting (Context)

**Component Description**:
- Label: "Setting"
- Label suffix: "(optional)" in gray
- Input type: text
- Placeholder: "e.g., Restaurant, Shopping mall, Social gathering"

### RadioGroup — Formality

**Component Structure**:
```
RadioGroup
├── Label: "Formality Level"
└── OptionRow
    ├── RadioOption: "Formal"
    └── RadioOption: "Informal"
```

**Component Description**:
- Same styling as Interview Type RadioGroup
- Two options only, horizontal layout

**Options**:
- "Formal"
- "Informal" (default selected)

### FormField — Native Language Expression

**Component Description**:
- Label: "Native Language Expression"
- Input type: textarea (5 rows)
- Placeholder: "Type the phrase or sentence you want to translate..."
- This is the only required field on this page
- Larger textarea than context fields to accommodate quick multi-line input

### CardFooter (Daily Scene Actions)

**Component Description**:
- Two action buttons side by side
- "Get AI Translation": secondary button with green theme (white background, green border, green text); clicking submits the text and shows AI translation directly on the AI Review page without requiring user translation
- "Translate Myself →": primary button with green theme (green background, white text); clicking navigates to the Translation Workspace page
- Both buttons are full-width on mobile, side-by-side on desktop

---

## Page 4: Translation Workspace

**Route**: `/translate/:sessionId`

### Component Tree Structure
```
TranslationWorkspacePage
├── ProgressStepper (step 3 of 4 for interview; step 2 of 3 for daily)
├── TranslationToggle
│   └── Toggle: "Enable translation writing"
├── TwoColumnLayout
│   ├── SourcePanel (left)
│   │   ├── PanelHeader
│   │   │   ├── Title: "Source Text"
│   │   │   └── Badge: "Reference"
│   │   ├── HighlightedTextBlock
│   │   └── ContextSummary (collapsible)
│   └── TranslationPanel (right)
│       ├── PanelHeader
│       │   ├── Title: "Your English Translation"
│       │   └── AIReferenceToggle: "Show AI Reference"
│       ├── TranslationTextarea
│       ├── TextareaFooter
│       │   └── WordCount
│       └── AIReferenceBlock (conditionally visible)
└── ActionBar
    ├── Button: "← Back" (secondary)
    └── Button: "Submit for Review" (primary)
```

### TranslationToggle

**Component Description**:
- A small toggle switch with label positioned above the two-column layout
- Label: "Enable translation writing" in text-sm
- When toggled OFF: the TranslationPanel is replaced with a message "Click 'Submit for Review' to see the AI translation directly"
- When toggled ON (default): the full TranslationPanel is visible
- This allows users who only want to see the AI translation to skip writing

### TwoColumnLayout

**Component Description**:
- CSS Grid with two equal columns on desktop (min-width 768px)
- Gap: ~24px between columns
- On mobile: stacks vertically, SourcePanel on top, TranslationPanel below
- Both panels have equal max-height with independent scrolling if content overflows

### SourcePanel (Native Language Source)

**Component Description**:
- White background card, rounded corners (radius-lg), subtle shadow
- PanelHeader: flex row with "Source Text" title (bold, text-lg) on left and a small "Reference" badge (blue-100 background, blue text, rounded-full) on right
- Below header: the highlighted text block showing the user's native language input

### HighlightedTextBlock

**Component Description**:
- Container with a left border (4px, amber/yellow color) and light yellow background tint (amber-50)
- Padding: ~16px
- Text displayed with generous line-height (~1.8) for readability
- Each sentence is visually distinct: a subtle yellow gradient underline beneath each sentence
- Text color: dark (gray-900)
- Font size: text-base (~16px)

### ContextSummary (Collapsible Context Info)

**Component Description**:
- Small section below the highlighted text
- Toggle header: "Context" with a chevron icon, text-xs, muted gray
- When expanded: light blue background (blue-50), rounded, padding ~12px
- Content displayed as key-value pairs in small text:
  - "Position: Senior Software Engineer at Google"
  - "Company: Google — global tech leader..."
  - "Type: Behavioral Interview"
- Default: collapsed for daily scenes, expanded for interview scenes

### TranslationPanel (English Translation Area)

**Component Description**:
- White background card, matching SourcePanel styling
- PanelHeader: "Your English Translation" title on left; "Show AI Reference" toggle button on right
- Toggle button: small outlined button with eye icon, toggles between "Show" and "Hide"

### TranslationTextarea

**Component Description**:
- Full-width textarea, minimum height ~250px (roughly 10 visible lines)
- Border: 1px light gray, rounded corners
- Focus: blue ring outline
- Placeholder: "Write your English translation here..."
- Font size: text-base (~16px), same as source text for visual alignment
- Not resizable (fixed height) to maintain layout consistency

### TextareaFooter

**Component Description**:
- Small bar below the textarea
- Left side: word count display in muted text (e.g., "42 words")
- Padding: ~8px 0

### AIReferenceBlock

**Component Description**:
- Only visible when "Show AI Reference" toggle is active
- Light green background (green-50), green left border (3px), rounded corners
- Padding: ~16px
- Header: small label "AI Reference Translation" in green text with a sparkle icon
- Body: the AI-generated translation text in regular dark text
- Slide-down animation when toggled visible (~200ms)

### ActionBar

**Component Description**:
- Sticky bar at the bottom of the page (or below content if content is short)
- White background with top border (1px, light gray) and slight shadow
- Padding: ~16px 24px
- Flex layout: "← Back" button on left, "Submit for Review" button on right
- "Submit for Review" is disabled if the textarea is empty (when translation writing is enabled)

---

## Page 5: AI Review

**Route**: `/review/:sessionId`

### Component Tree Structure
```
AIReviewPage
├── ProgressStepper (step 4 of 4 for interview; step 3 of 3 for daily)
├── ReviewHeader
│   ├── Title: "AI Review Feedback"
│   └── ErrorSummaryBadges
│       ├── Badge: "2 Grammar"
│       ├── Badge: "3 Word Choice"
│       └── Badge: "1 Structure"
├── ReviewItemList
│   └── ReviewItem × N
│       ├── ItemHeader
│       │   ├── IndexBadge (sentence number)
│       │   └── TypeBadge (error type)
│       ├── OriginalTextBox (user's sentence)
│       ├── SuggestedTextBox (corrected sentence)
│       └── ReasonBox (explanation)
├── OverallFeedback
└── ActionBar
    ├── Button: "← Revise Translation" (secondary)
    └── Button: "Generate Flashcards" (primary)
```

### ReviewHeader

**Component Description**:
- Title: large bold text (text-2xl / ~24px), dark color
- ErrorSummaryBadges: horizontal flex row of small pill badges, gap ~8px, margin-top ~12px
- Each badge shows count + type label
- Badge colors correspond to error type:
  - Grammar errors: red background (red-100), red text (red-700)
  - Word choice suggestions: amber/orange background (amber-100), amber text (amber-700)
  - Structure improvements: blue background (blue-100), blue text (blue-700)

**Content Data (example)**:
- "2 Grammar" (red)
- "3 Word Choice" (amber)
- "1 Structure" (blue)

### ReviewItem (Individual Feedback Entry)

**Component Structure**:
```
ReviewItem
├── ItemSidebar
│   └── IndexBadge: "1"
└── ItemContent
    ├── ItemHeader
    │   ├── TypeBadge: "Grammar Error"
    │   └── SentenceLabel: "Sentence 1"
    ├── OriginalTextBox
    ├── ArrowIndicator (↓)
    ├── SuggestedTextBox
    └── ReasonBox
```

**Component Description**:
- White background card, rounded corners (radius-lg), subtle shadow
- Left border: 4px colored border matching error type (red / amber / blue)
- Margin-bottom: ~16px between items
- ItemSidebar: a small circular badge (32px diameter) with the sentence number, positioned at the top-left; colored background matching error type
- ItemHeader: flex row with TypeBadge (pill shape with error type label) and SentenceLabel (muted text, e.g., "Sentence 1")

### OriginalTextBox (User's Original Sentence)

**Component Description**:
- Light gray background (gray-50), rounded, padding ~12px
- Small label above: "Your translation" in muted text (text-xs)
- The error portion of the text is underlined with a wavy colored underline (CSS `text-decoration: wavy underline`) matching the error type color
- Non-error portions displayed normally

**Example Content**:
- Label: "Your translation"
- Text: "I have working in this field for five years" (with wavy red underline on "have working")

### SuggestedTextBox (AI Correction)

**Component Description**:
- Light green background (green-50), rounded, padding ~12px
- Small label above: "Suggested revision" in green text (text-xs)
- The corrected portion is displayed in bold green text to highlight the change
- An arrow indicator (↓) appears between OriginalTextBox and SuggestedTextBox in muted gray, centered

**Example Content**:
- Label: "Suggested revision"
- Text: "I **have been working** in this field for five years" (bold green on "have been working")

### ReasonBox (Explanation)

**Component Description**:
- White background with light border (1px, gray-200), rounded, padding ~12px
- Left icon: lightbulb icon in amber/yellow
- Text starts with "Reason: " prefix in bold
- Explanation text in regular weight, text-sm

**Example Content**:
- "**Reason:** The present perfect continuous tense ('have been working') is needed to express an action that started in the past and continues to the present. 'Have working' is grammatically incorrect."

### OverallFeedback

**Component Description**:
- Green tinted card (green-50 background, green-200 border), rounded-lg
- Left icon: large checkmark in a green circle
- Title: "Overall Assessment" in bold (text-lg)
- Body: summary text evaluating the translation quality, strengths, and areas for improvement
- Appears after all ReviewItems

**Example Content**:
- Title: "Overall Assessment"
- Body: "Your translation demonstrates good vocabulary range and captures the key meaning. Focus on verb tense consistency and using more natural connective phrases to improve fluency."

### ActionBar (Review Actions)

**Component Description**:
- Same styling as Translation Workspace ActionBar
- "← Revise Translation": navigates back to the Translation Workspace with the user's text preserved
- "Generate Flashcards": navigates to the Flashcard Generation page

---

## Page 6: Flashcard Generation

**Route**: `/flashcard/generate/:sessionId`

### Component Tree Structure
```
FlashcardGeneratePage
├── PageHeader
│   ├── Title: "Generate Flashcards"
│   └── Description: "Choose how to save this translation for review"
├── CardModeSelector
│   ├── ModeCard (Paragraph Mode)
│   └── ModeCard (Sentence Mode)
├── CardPreview
│   ├── PreviewLabel: "Card Preview"
│   └── PreviewCard
│       ├── CardFrontPreview
│       │   ├── Label: "Front (Source Text)"
│       │   └── PreviewText
│       ├── Divider
│       └── CardBackPreview
│           ├── Label: "Back (Your Translation + Reference)"
│           └── PreviewText
└── ActionBar
    ├── Button: "← Back to Review" (secondary)
    └── Button: "Generate & Save Cards" (primary)
```

### CardModeSelector

**Component Description**:
- Heading: "Select Storage Mode" in bold (text-lg), margin-bottom ~16px
- Two ModeCards arranged side-by-side in a grid (2 columns desktop, 1 column mobile)
- Gap: ~16px

### ModeCard (Mode Selection Option)

**Component Structure**:
```
ModeCard
├── RadioIndicator (circle, filled when selected)
├── IconContainer
│   └── Icon
├── Content
│   ├── Title
│   └── Description
└── RecommendedBadge (conditional)
```

**Component Description**:
- Clickable card acting as a radio button; border: 2px
- Unselected: gray border, white background
- Selected: colored border (blue or green), light tinted background, slight scale-up (1.02)
- RadioIndicator: small circle in top-right, empty when unselected, filled when selected
- IconContainer: rounded square (~40px), tinted background, centered icon
- Title: bold text (text-base)
- Description: small muted text (text-sm)
- RecommendedBadge: small pill at bottom, colored, e.g., "Recommended for interviews"
- Transition: border color and background change with ~150ms ease

**Paragraph Mode Content**:
- Icon: FileText
- Theme: Blue
- Title: "Paragraph Mode"
- Description: "Save as a complete translation exercise with full context. One card set per practice session."
- Badge: "Recommended for interviews"
- Default selected when scene is Interview

**Sentence Mode Content**:
- Icon: MessageSquare
- Theme: Green
- Title: "Sentence Mode"
- Description: "Split into individual cards per sentence. Great for bite-sized review sessions."
- Badge: "Recommended for daily scenes"
- Default selected when scene is Daily

### CardPreview

**Component Description**:
- Light gray background container (gray-50), rounded-lg, padding ~20px
- Label: "Card Preview" in bold text-sm, muted color, margin-bottom ~12px
- Shows a simulated flashcard with front and back content
- Front and Back sections separated by a dashed horizontal divider

### CardFrontPreview

**Component Description**:
- Small label: "Front (Source Text)" in muted text with an eye icon
- Below: the native language text displayed in regular dark text
- If Paragraph Mode: shows full source text
- If Sentence Mode: shows only the first sentence as an example, with note "(+ N more cards)"

**Example Content (Paragraph)**:
- Label: "Front (Source Text)"
- Text: "请描述一个你在紧迫期限下领导项目的经历..."

**Example Content (Sentence)**:
- Label: "Front (Source Text)"
- Text: "我之前在亚马逊担任技术主管"
- Note: "(+ 4 more cards)"

### CardBackPreview

**Component Description**:
- Small label: "Back (Your Translation + Reference)" in muted text
- User's translation shown first in dark text
- Below: AI revised version in green-tinted text with "AI Reference:" prefix
- Below: brief feedback summary in amber-tinted text with "Key Note:" prefix

### ActionBar (Flashcard Actions)

**Component Description**:
- "← Back to Review": returns to AI Review page
- "Generate & Save Cards": generates the flashcards, shows a success toast notification, and navigates to the Home page or offers to start the Review session

---

## Page 7: Flashcard Review

**Route**: `/flashcard/review`

### Component Tree Structure
```
FlashcardReviewPage
├── ReviewHeader
│   ├── Title: "Today's Review"
│   ├── Subtitle: "12 cards due for review"
│   └── CardCategoryBadges
│       ├── Badge: "3 New"
│       ├── Badge: "7 Due"
│       └── Badge: "2 Random"
├── FlashcardContainer
│   └── Flashcard3D
│       ├── CardFront
│       │   ├── SceneTypeBadge
│       │   ├── SourceText (native language)
│       │   ├── ContextToggle: "Show context"
│       │   └── FlipButton: "Show Answer"
│       └── CardBack
│           ├── UserTranslationSection
│           │   ├── Label: "Your Translation"
│           │   └── TranslationText
│           ├── Divider
│           ├── AIReferenceSection (toggle)
│           │   ├── Label: "AI Reference"
│           │   └── ReferenceText
│           ├── FeedbackSummary (toggle)
│           │   ├── Label: "Key Feedback"
│           │   └── FeedbackText
│           └── QualityRating
├── ReviewProgressBar
└── SessionSummary (visible when all cards completed)
```

### ReviewHeader

**Component Description**:
- Title: "Today's Review" in bold (text-2xl)
- Subtitle: dynamic text showing total cards due, e.g., "12 cards due for review" in muted text
- CardCategoryBadges: small pills showing breakdown — new cards (purple), due cards (blue), random reinforcement cards (gray)

### Flashcard3D (3D Flip Card)

**Component Description**:
- Container with CSS perspective (~1000px) for 3D effect
- Inner card wrapper uses `transform-style: preserve-3d`
- Front and back are absolutely positioned, back has `rotateY(180deg)` and `backface-visibility: hidden`
- Flip animation: `transform: rotateY(180deg)` on the wrapper, transition ~600ms ease
- Card dimensions: max-width ~480px, min-height ~380px, centered horizontally
- Subtle shadow that deepens during flip animation

### CardFront

**Component Description**:
- White background, rounded-xl (~16px radius), generous padding (~32px)
- SceneTypeBadge: small pill badge at top-left corner (blue for Interview, green for Daily)
- Source text: centered, large text (text-xl / ~20px), dark color, line-height ~1.8
- ContextToggle: small text button below source text, "Show context ▾", clicking reveals context info in a collapsible block
- FlipButton: centered at bottom, primary blue button with "Show Answer" label and a flip icon
- Overall layout: flex-column with items centered, space distributed vertically

**Example Content**:
- Badge: "Interview" (blue)
- Text: "请描述一个你在紧迫期限下领导项目的经历"
- Context (expanded): "Position: Senior SWE at Google | Type: Behavioral"

### CardBack

**Component Description**:
- Same card dimensions and base styling as front
- UserTranslationSection at top: green-tinted label "Your Translation" (small badge), followed by the user's translation text
- Horizontal divider (dashed, light gray)
- AIReferenceSection: toggleable, blue-tinted label "AI Reference", followed by the corrected version; visible by default but can be hidden
- FeedbackSummary: toggleable, amber-tinted label "Key Feedback", followed by 1-2 bullet points of key corrections; hidden by default
- QualityRating at the bottom (see below)

### QualityRating (SM-2 Self-Assessment)

**Component Description**:
- Prompt text: "How well did you remember?" in muted text, centered, margin-bottom ~12px
- Six rating buttons in a horizontal row, evenly spaced
- Each button: rounded (radius-lg), min-width ~56px, height ~64px
- Two lines per button: top line is the number (0-5) in bold, bottom line is a short label in text-xs
- Button colors form a gradient from red to green:
  - 0: red-500 background, white text — label: "Forgot"
  - 1: red-400 background, white text — label: "Hard"
  - 2: orange-400 background, white text — label: "Struggled"
  - 3: yellow-400 background, dark text — label: "OK"
  - 4: green-400 background, white text — label: "Good"
  - 5: green-600 background, white text — label: "Perfect"
- Hover: slight brightness increase and scale-up (1.05)
- Clicking any button submits the rating and transitions to the next card with a slide animation

### ReviewProgressBar

**Component Description**:
- Fixed at the bottom of the viewport or below the card
- White background card, rounded, padding ~12px 20px
- Left: "Progress" label in muted text
- Center: progress bar (rounded-full, height ~8px, blue fill)
- Right: "4 / 12" counter text in bold
- Updates in real-time as cards are completed

### SessionSummary (Review Complete)

**Component Description**:
- Displayed when all cards in the session are completed
- Replaces the FlashcardContainer
- Centered layout with a large checkmark circle icon (green) at top
- Title: "Review Complete!" in bold (text-2xl)
- Stats row: three stat items in a horizontal flex
  - "Cards Reviewed: 12"
  - "Average Score: 3.8"
  - "Next Review: Tomorrow"
- Action buttons: "Review More" (secondary) and "Back to Home" (primary)

---

## Page 8: History List

**Route**: `/history`

### Component Tree Structure
```
HistoryListPage
├── PageHeader
│   ├── Title: "Translation History"
│   └── Subtitle: "Review and revisit your past translations"
├── FilterBar
│   ├── SearchInput
│   ├── SceneFilter (dropdown)
│   └── DateRangeFilter
├── HistoryList
│   └── HistoryCard × N
│       ├── CardHeader
│       │   ├── MetaInfo
│       │   │   ├── SceneTypeBadge
│       │   │   └── Timestamp
│       │   └── MoreMenu (three-dot dropdown)
│       ├── PreviewText (source text excerpt)
│       └── CardFooter
│           ├── FeedbackBadges
│           │   ├── Badge: "2 Grammar"
│           │   ├── Badge: "1 Word Choice"
│           │   └── Badge: "0 Structure"
│           └── ViewDetailLink: "View Details →"
└── Pagination (or infinite scroll)
```

### FilterBar

**Component Description**:
- White background card, rounded-lg, padding ~16px
- Flex row layout with gap ~12px, items vertically centered
- On mobile: wraps to multiple rows

### SearchInput

**Component Description**:
- Input with a search icon (magnifying glass) on the left inside the input
- Placeholder: "Search translations..."
- Rounded-lg, border 1px gray
- Takes up remaining available width (flex-1)
- Debounced search: triggers filtering after 300ms of no typing

### SceneFilter (Scene Type Dropdown)

**Component Description**:
- Dropdown select with a filter icon
- Fixed width (~180px)
- Options: "All Scenes", "Interview", "Daily"
- Default: "All Scenes"
- Styled as a bordered rounded select

### DateRangeFilter

**Component Description**:
- Date range picker with a calendar icon
- Shows start date and end date separated by "→"
- Placeholder: "All dates"
- Clicking opens a date picker popover

### HistoryCard

**Component Description**:
- White background card, rounded-lg, subtle shadow
- Hover: shadow deepens, cursor pointer
- Clicking the card navigates to the History Detail page
- Margin-bottom ~12px between cards

### MetaInfo

**Component Description**:
- Flex row with SceneTypeBadge and Timestamp
- SceneTypeBadge: small pill (blue for Interview, green for Daily)
- Timestamp: muted gray text (text-xs), e.g., "2 hours ago" or "2024-01-15 14:30"

### PreviewText

**Component Description**:
- Two lines of the source text displayed as a preview
- Text-sm, dark color, line-clamp-2 (truncated with ellipsis after 2 lines)
- Margin: ~8px 0

### FeedbackBadges

**Component Description**:
- Small inline badges showing the count of each feedback type
- Uses same color scheme as AI Review (red for grammar, amber for word choice, blue for structure)
- Only badges with count > 0 are displayed
- Text-xs size

### MoreMenu (Context Menu)

**Component Description**:
- Three-dot icon button (vertical dots)
- Clicking opens a dropdown menu with options:
  - "Re-translate" — navigates to Translation Workspace with pre-filled source text
  - "Re-generate Flashcards" — navigates to Flashcard Generation
  - "Delete" — shows confirmation dialog, then deletes the history entry
- Dropdown has white background, rounded, shadow, appears below the button

### Pagination

**Component Description**:
- Row of page number buttons centered at the bottom
- Shows: "← Previous", page numbers (1, 2, 3, ..., N), "Next →"
- Current page button: blue background, white text
- Other page buttons: white background, gray border
- Alternative: infinite scroll with a "Load more" button or auto-load on scroll

---

## Page 9: History Detail

**Route**: `/history/:id`

### Component Tree Structure
```
HistoryDetailPage
├── BackLink: "← Back to History"
├── DetailHeader
│   ├── MetaInfo
│   │   ├── SceneTypeBadge
│   │   ├── Timestamp
│   │   └── ContextTitle (e.g., job title)
│   └── ActionButtons
│       ├── Button: "Re-translate" (secondary)
│       └── Button: "Generate Flashcards" (primary)
├── TwoColumnLayout
│   ├── SourceTextSection
│   │   ├── SectionTitle: "Source Text"
│   │   └── HighlightedTextBlock (reused from TranslationWorkspace)
│   └── TranslationSection
│       ├── SectionTitle: "Your Translation"
│       └── TranslationTextBlock
├── ContextSection (collapsible, reused)
└── ReviewSection
    ├── SectionTitle: "AI Review Feedback"
    ├── ErrorSummaryBadges (reused from AIReviewPage)
    └── ReviewItemList (reused from AIReviewPage)
        └── ReviewItem × N
```

### BackLink

**Component Description**:
- Small text link with left arrow icon
- Text: "← Back to History" in blue, text-sm
- Hover: underline appears
- Navigates back to `/history`

### DetailHeader

**Component Description**:
- Flex row: MetaInfo on left, ActionButtons on right
- MetaInfo stacks vertically: SceneTypeBadge + Timestamp on first line, ContextTitle on second line
- ContextTitle: bold text (text-xl), e.g., "Senior Software Engineer at Google"
- ActionButtons: flex row with gap ~8px
- "Re-translate": secondary (outlined), navigates to Translation Workspace with source text pre-filled
- "Generate Flashcards": primary (blue filled), navigates to Flashcard Generation page

### SourceTextSection

**Component Description**:
- White card, rounded-lg, padding ~20px
- SectionTitle: "Source Text" in bold (text-lg), with a small colored indicator dot (amber)
- Below: HighlightedTextBlock (same component as Translation Workspace — amber left border, yellow-tinted background)

### TranslationSection

**Component Description**:
- White card, rounded-lg, padding ~20px
- SectionTitle: "Your Translation" in bold (text-lg), with a small colored indicator dot (green)
- Below: the user's English translation in a gray-tinted background block (gray-50), rounded, padding ~16px
- Text: regular weight, text-base, dark color

### ReviewSection

**Component Description**:
- Full-width white card below the two-column layout
- SectionTitle: "AI Review Feedback" in bold (text-lg)
- ErrorSummaryBadges and ReviewItemList components reused directly from the AI Review page
- Identical styling and layout

---

## Page 10: Statistics

**Route**: `/statistics`

### Component Tree Structure
```
StatisticsPage
├── PageHeader
│   ├── Title: "Learning Statistics"
│   └── Subtitle: "Track your translation practice progress"
├── StatCardGrid
│   ├── StatCard: "Total Translations"
│   ├── StatCard: "Flashcards"
│   ├── StatCard: "Study Streak"
│   └── StatCard: "Avg. Accuracy"
└── ChartsSection
    ├── SceneDistributionChart
    └── CommonErrorsChart
```

### StatCardGrid

**Component Description**:
- CSS Grid: 4 columns on desktop, 2 columns on tablet, 1 column on mobile
- Gap: ~16px

### StatCard (Summary Statistic)

**Component Structure**:
```
StatCard
├── Label
├── Value
└── TrendIndicator
```

**Component Description**:
- White card, rounded-lg, padding ~20px, subtle shadow
- Label: small muted text (text-sm), e.g., "Total Translations"
- Value: large bold number (text-3xl / ~30px), dark color
- TrendIndicator: small text below value showing change direction and amount
  - Positive trend: green text with up-arrow icon (e.g., "↑ 12 this week")
  - Negative trend: red text with down-arrow icon
  - Neutral: gray text

**Card Configurations**:
1. **Total Translations**:
   - Label: "Total Translations"
   - Value: "48"
   - Trend: "↑ 12 this week" (green)
2. **Flashcards**:
   - Label: "Flashcards"
   - Value: "156"
   - Trend: "12 due for review" (amber)
3. **Study Streak**:
   - Label: "Study Streak"
   - Value: "7 days"
   - Trend: "Keep it going!" (green)
4. **Avg. Accuracy**:
   - Label: "Avg. Accuracy"
   - Value: "82%"
   - Trend: "↑ 5% vs last week" (green)

### SceneDistributionChart

**Component Description**:
- White card, rounded-lg, padding ~20px
- Title: "Scene Distribution" in bold (text-lg)
- Two horizontal bar charts:
  - Each bar has a label on the left (scene name), a percentage on the right
  - Bar fill width corresponds to percentage
  - Interview scene bar: blue fill
  - Daily scene bar: green fill
  - Bar height: ~24px, rounded ends

**Example Data**:
- Interview: 65% (blue bar)
- Daily: 35% (green bar)

### CommonErrorsChart

**Component Description**:
- White card, rounded-lg, padding ~20px
- Title: "Common Error Types" in bold (text-lg)
- List format with three rows, each showing:
  - Left: colored dot indicator + error type label
  - Right: count number in matching color + small bar
- Sorted by count descending

**Example Data**:
- Grammar Errors: 24 (red dot, red text)
- Word Choice: 18 (amber dot, amber text)
- Structure: 12 (blue dot, blue text)

---

## Page 11: Settings

**Route**: `/settings`

### Component Tree Structure
```
SettingsPage
├── PageHeader
│   ├── Title: "Settings"
│   └── Subtitle: "Customize your learning preferences"
└── SettingsSectionList
    ├── SettingsSection: "Flashcard Defaults"
    │   ├── SettingItem: Default mode for Interview scenes
    │   └── SettingItem: Default mode for Daily scenes
    ├── SettingsSection: "AI Review Preferences"
    │   ├── SettingItem: Auto-show AI reference translation
    │   └── SettingItem: Review detail level
    └── SettingsSection: "Review Settings"
        ├── SettingItem: New cards per day
        └── SettingItem: Random reinforcement cards
```

### SettingsSection

**Component Description**:
- White card, rounded-lg, padding ~20px
- Section title: bold text (text-lg) at top, with a subtle bottom border
- Contains multiple SettingItems stacked vertically with dividers between them
- Margin-bottom ~20px between sections

### SettingItem

**Component Structure**:
```
SettingItem
├── SettingInfo
│   ├── Label
│   └── Description
└── SettingControl (toggle / select / number input)
```

**Component Description**:
- Flex row: SettingInfo on left (flex-1), SettingControl on right
- Label: medium weight text (text-sm, font-medium)
- Description: small muted text (text-xs, gray)
- Control varies by type:
  - Toggle switch for boolean settings
  - Dropdown select for enum settings
  - Number input (small, ~64px wide) for numeric settings

**Setting Items**:
1. **Default mode for Interview scenes**:
   - Label: "Interview Flashcard Mode"
   - Description: "Default card generation mode for interview scenes"
   - Control: Dropdown — ["Paragraph Mode" (default), "Sentence Mode"]
2. **Default mode for Daily scenes**:
   - Label: "Daily Flashcard Mode"
   - Description: "Default card generation mode for daily scenes"
   - Control: Dropdown — ["Sentence Mode" (default), "Paragraph Mode"]
3. **Auto-show AI reference translation**:
   - Label: "Show AI Reference"
   - Description: "Automatically display AI reference translation during writing"
   - Control: Toggle (default: off)
4. **Review detail level**:
   - Label: "Feedback Detail"
   - Description: "Level of detail in AI review feedback"
   - Control: Dropdown — ["Detailed" (default), "Concise"]
5. **New cards per day**:
   - Label: "New Cards / Day"
   - Description: "Maximum number of new cards introduced per review session"
   - Control: Number input (default: 20, min: 5, max: 50)
6. **Random reinforcement cards**:
   - Label: "Random Reinforcement"
   - Description: "Include random old cards in each review session"
   - Control: Toggle (default: on)

---

## Visual Specification Summary

### Color System

| Purpose | Color | Usage |
|---------|-------|-------|
| Interview theme | Blue `hsl(221, 83%, 53%)` | Interview badges, borders, icons |
| Daily theme | Green `hsl(142, 71%, 45%)` | Daily badges, borders, icons |
| Grammar error | Red `hsl(0, 84%, 60%)` | Grammar error badges, underlines, indicators |
| Word choice | Amber `hsl(38, 92%, 50%)` | Word choice badges, underlines, indicators |
| Structure | Blue `hsl(217, 91%, 60%)` | Structure badges, underlines, indicators |
| Primary action | Blue `hsl(221, 83%, 53%)` | Primary buttons, links, active states |
| Success | Green `hsl(142, 71%, 45%)` | Success messages, AI corrections |
| Background | White `hsl(0, 0%, 100%)` | Cards, panels |
| Muted background | Gray `hsl(220, 14%, 96%)` | Page background, disabled states |
| Text primary | Dark `hsl(222, 47%, 11%)` | Headings, body text |
| Text muted | Gray `hsl(220, 9%, 46%)` | Subtitles, helper text, timestamps |

### Card Styles

| Variant | Styles |
|---------|--------|
| Base card | White background, `border-radius: 12px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` |
| Hover card | Shadow deepens to `0 4px 12px rgba(0,0,0,0.15)`, translateY(-2px), transition 200ms |
| Active/Selected card | Colored border (2px), light tinted background |

### Badge Styles

| Variant | Styles |
|---------|--------|
| Scene badge | `border-radius: 9999px` (pill), `padding: 2px 10px`, `font-size: 12px` |
| Error count badge | Same pill shape, colored background (100 shade), colored text (700 shade) |
| Notification badge | Small circle (18px), red background, white text, absolute positioned |
| Tag | Pill shape, light tinted background, matching text color, `padding: 4px 10px` |

### Button Hierarchy

| Variant | Styles |
|---------|--------|
| Primary | Colored background (blue/green), white text, rounded-lg, `padding: 10px 20px`, shadow on hover |
| Secondary | White background, colored border (1px), colored text, rounded-lg, same padding |
| Ghost | No background, no border, colored text, subtle background on hover |
| Icon button | Circular or rounded-square, icon only, subtle background on hover |
| Disabled | Reduced opacity (0.5), cursor not-allowed, no hover effects |

### Spacing & Typography

| Element | Size |
|---------|------|
| Page title (h1) | `font-size: 30px`, `font-weight: 700`, `line-height: 1.2` |
| Section title (h2) | `font-size: 20px`, `font-weight: 600`, `line-height: 1.3` |
| Body text | `font-size: 16px`, `font-weight: 400`, `line-height: 1.6` |
| Small text | `font-size: 14px`, `font-weight: 400`, `line-height: 1.5` |
| Helper/label text | `font-size: 12px`, `font-weight: 500`, `line-height: 1.4` |
| Page padding | Desktop: 24px, Mobile: 16px |
| Card padding | 20-24px |
| Section gap | 24-32px |
| Element gap (within card) | 12-16px |

### Animation & Transitions

| Animation | Specification |
|-----------|--------------|
| Card hover | `transition: box-shadow 200ms ease, transform 200ms ease` |
| Flashcard flip | `transition: transform 600ms ease`, `transform: rotateY(180deg)` |
| Collapsible expand | `transition: height 200ms ease-out, opacity 200ms ease-out` |
| Button hover | `transition: background-color 150ms ease, transform 150ms ease` |
| Page transitions | Slide from right (enter) / slide to left (exit), 300ms |
| Toast notification | Slide down from top, 300ms, auto-dismiss after 3s |
