[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below. This is a multi-page application with 11 pages. Generate at least 3 distinct variants for each page.

---

<!-- ===== PAGE 1: Home / Scene Selection ===== -->

# PAGE 1: Home / Scene Selection

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Home / Scene Selection
- Target users: English learners practicing translation writing
- Primary user goal (what task must be completed): Choose a translation practice scene (Interview or Daily) and start a new session
- Requirements (you may paste PRD / user stories):
  - Two scene cards: Interview Scene and Daily Scene
  - Interview card: Briefcase icon, blue theme hsl(221,83%,53%), tags: STAR Framework / Professional Terms / Paragraph Mode → navigates to /interview/context
  - Daily card: MessageCircle icon, green theme hsl(142,71%,45%), tags: Quick Capture / Idiomatic Usage / Sentence Mode → navigates to /daily/input
  - Each card: min-height 200px, white bg, rounded-xl (16px), subtle shadow, hover: shadow deepens + 4px colored top border + translateY(-2px)
  - IconContainer: 56px rounded square, light tinted bg, 28px icon
  - TagList: horizontal flex of pill tags (rounded-full, tinted bg, 12px text)
  - Left sidebar navigation (AppLayout) with Home/History/Review(badge)/Statistics + Settings at bottom

## 2) Information architecture & layout
- Page type: landing
- Navigation structure: left Sidebar (240px desktop, collapsible to 64px icon-only), dark navy bg hsl(222,47%,11%); on mobile <768px: bottom tab bar icons only
  // left Sidebar with Home (home icon), History (clock icon), Review (layers icon, with red badge showing due count), Statistics (bar-chart icon), Settings (settings icon, in sidebar footer)
- Page sections (list the blocks from top-to-bottom / left-to-right):
  PageHeader (title: "Choose a Practice Scene", subtitle: "Select a scene type to start your translation practice", left-aligned, 48px top padding, 32px bottom margin) → SceneCardGrid (2-col CSS grid, 24px gap, max-width 800px centered)
- Responsive rules: <768px: sidebar collapses to bottom tab bar; scene cards stack to 1 column; main content padding 16px instead of 24px

## 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): Card, Button, Badge, Skeleton
- Table/List definition (if applicable): N/A
- Form fields (if applicable): N/A
- Key interactions: Click Interview card → navigate to /interview/context; Click Daily card → navigate to /daily/input; Hover card: shadow deepens, colored top border appears, slight upward translate; Sidebar nav items highlight with left accent border (blue, 3px)

## 4) State design (must include)
- Loading state (Skeleton coverage): 2 Card skeletons in grid layout matching SceneCard dimensions
- Empty state: N/A — landing page always has content
- Error state: Alert banner with retry button
- Disabled / permission states (if any): N/A

## 5) Copy & localization
- Locale: en-US
- Tone of voice: friendly and encouraging
- Key CTA labels & messages:
  Page title: "Choose a Practice Scene"
  Page subtitle: "Select a scene type to start your translation practice"
  Interview card title: "Interview Scene"
  Interview card desc: "Prepare interview answers with professional expressions and structured frameworks"
  Interview tags: "STAR Framework", "Professional Terms", "Paragraph Mode"
  Daily card title: "Daily Scene"
  Daily card desc: "Quickly capture everyday expressions and learn natural, idiomatic English"
  Daily tags: "Quick Capture", "Idiomatic Usage", "Sentence Mode"
  Sidebar logo: "WriteCraft"

## 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: light
- Primary color token hint: primary = blue hsl(221,83%,53%) for interview; green hsl(142,71%,45%) for daily; sidebar = dark navy hsl(222,47%,11%)
- Typography preference: Page title: text-3xl (30px) font-bold; Subtitle: text-base (16px) muted gray; Card title: text-xl (20px) bold; Card desc: text-sm (14px) muted; Tags: text-xs (12px)
- Radius & shadow preference: Cards: rounded-xl (16px) with shadow 0 1px 3px rgba(0,0,0,0.1); hover shadow 0 4px 12px rgba(0,0,0,0.15); IconContainer: rounded square
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include: Sidebar, main content area, primary CTA, and all states (loading/empty/error)

---

<!-- ===== PAGE 2: Interview Context Input ===== -->

# PAGE 2: Interview Context Input

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Interview Context Input
- Target users: English learners preparing interview-style translation exercises
- Primary user goal: Provide interview context (job title, company, question, type) before entering source text for translation
- Requirements:
  - ProgressStepper at top: step 1 of 4 ["Context", "Source Text", "Translate", "Review"]
  - FormCard: white bg, rounded-lg (12px), shadow, padding 24px, max-width 640px centered
  - CardHeader: title "Interview Context", desc "Provide details about the interview to get better AI feedback", bottom border separator
  - 3 FormFields + 1 RadioGroup + 1 InfoAlert
  - FormField: label (text-sm font-medium), input (full-width, border 1px gray, rounded-md 8px, focus: ring-2 ring-blue-500)
  - RadioGroup "Interview Type": horizontal pills (rounded-lg, border 1px), selected = light blue bg + blue border + check icon
  - InfoAlert (STAR tip): blue-50 bg, blue left border 3px, info circle icon, only shown when "Behavioral" selected
  - CardFooter: top border, Cancel (secondary) + "Next: Enter Source Text →" (primary, disabled until required fields filled)

## 2) Information architecture & layout
- Page type: form
- Navigation structure: left Sidebar (same AppLayout) + ProgressStepper above form
- Page sections:
  ProgressStepper (step 1 of 4: Context → Source Text → Translate → Review) → FormCard (CardHeader → FormBody with 4 fields + InfoAlert → CardFooter with Cancel/Next)
- Responsive rules: <768px: sidebar becomes bottom tab bar; FormCard full-width with 16px padding; RadioGroup options may wrap

## 3) Data & component requirements
- Primary component list: Card, Button, Form, Input, Textarea, RadioGroup, Alert, Separator, Skeleton
- Table/List definition: N/A
- Form fields:
  - job_title | Input (text) | required | "" | "" | "e.g., Senior Software Engineer at Google"
  - company_background | Textarea (3 rows) | optional | "" | "" | "e.g., Google is a leading global technology company specializing in..."
  - interview_question | Textarea (4 rows) | required | "" | "" | "e.g., Tell me about a time you led a project under a tight deadline"
  - interview_type | RadioGroup | required | one of [Behavioral, Technical, Case Study] | "Behavioral" | ""
- Key interactions: Fill form fields → RadioGroup selection (deselects others, selected gets blue highlight) → 'Behavioral' selection shows InfoAlert with STAR tip → Next button enables when Job Title + Interview Question filled → Click Next → navigate to source text input

## 4) State design
- Loading state: FormCard skeleton with input field placeholders
- Empty state: N/A — form page
- Error state: Inline field validation errors below inputs
- Disabled states: Next button disabled until Job Title and Interview Question are filled

## 5) Copy & localization
- Locale: en-US
- Tone of voice: supportive and instructive
- Key CTA labels & messages:
  Card title: "Interview Context"
  Card desc: "Provide details about the interview to get better AI feedback"
  Job Title label: "Job Title / Position"
  Company label: "Company Background"
  Question label: "Interview Question"
  Type label: "Interview Type"
  Radio options: "Behavioral", "Technical", "Case Study"
  STAR tip title: "STAR Framework Tip"
  STAR tip body: "Structure your answer using: Situation → Task → Action → Result. This helps organize your response clearly and professionally."
  Cancel: "Cancel"
  Next: "Next: Enter Source Text →"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: primary = blue hsl(221,83%,53%); InfoAlert bg = blue-50; focus ring = blue-500
- Typography: Card title: text-xl (20px) bold; Card desc: text-sm (14px) muted; Labels: text-sm (14px) font-medium; Helper text: text-xs (12px) muted
- Radius & shadow: FormCard: rounded-lg (12px) shadow-sm; Inputs: rounded-md (8px); RadioOptions: rounded-lg
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 3: Daily Scene Input ===== -->

# PAGE 3: Daily Scene Input

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Daily Scene Input
- Target users: English learners capturing everyday expressions for quick translation practice
- Primary user goal: Enter a native language expression with optional context, then choose to translate manually or get AI translation directly
- Requirements:
  - FormCard (same styling as Interview): title "Daily Scene", desc "Capture everyday expressions for quick translation practice"
  - CollapsibleSection for optional context: toggle "Add context (optional)" with chevron rotation animation (200ms)
    - When expanded: FormField (Setting) + RadioGroup (Formality: Formal/Informal, default Informal)
  - FormField: Native Language Expression (textarea, 5 rows, required)
  - CardFooter: two buttons
    - "Get AI Translation" (secondary green: white bg, green border, green text) → skip to AI Review
    - "Translate Myself →" (primary green: green bg, white text) → navigate to Translation Workspace
  - No ProgressStepper (shorter flow)

## 2) Information architecture & layout
- Page type: form
- Navigation structure: left Sidebar (AppLayout)
- Page sections:
  FormCard (CardHeader → CollapsibleSection [toggle + Setting field + Formality radio] → Native Language Expression textarea → CardFooter with two green-themed buttons)
- Responsive rules: <768px: sidebar becomes bottom tab bar; FormCard full-width; buttons stack to full-width

## 3) Data & component requirements
- Primary component list: Card, Button, Form, Input, Textarea, RadioGroup, Separator, Collapsible
- Table/List definition: N/A
- Form fields:
  - setting | Input (text) | optional | "" | "" | "e.g., Restaurant, Shopping mall, Social gathering"
  - formality | RadioGroup | optional | one of [Formal, Informal] | "Informal" | ""
  - native_expression | Textarea (5 rows) | required | "" | "" | "Type the phrase or sentence you want to translate..."
- Key interactions: Click 'Add context' toggle → smooth slide-down animation reveals context fields → chevron rotates → fill optional context → enter native expression → click 'Get AI Translation' (skips manual translation) OR click 'Translate Myself' (navigate to /translate/:sessionId)

## 4) State design
- Loading state: FormCard skeleton with textarea placeholder
- Empty state: N/A — form page
- Error state: Inline validation on native expression field
- Disabled states: Both action buttons disabled until native expression is entered

## 5) Copy & localization
- Locale: en-US
- Tone of voice: casual and encouraging
- Key CTA labels & messages:
  Card title: "Daily Scene"
  Card desc: "Capture everyday expressions for quick translation practice"
  Context toggle: "Add context (optional)"
  Setting label: "Setting"
  Formality label: "Formality Level"
  Formality options: "Formal", "Informal"
  Expression label: "Native Language Expression"
  AI translate CTA: "Get AI Translation"
  Self translate CTA: "Translate Myself →"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: primary = green hsl(142,71%,45%) for daily scene buttons and accents
- Typography: Card title: text-xl (20px) bold; Labels: text-sm (14px) font-medium; Toggle text: text-sm muted
- Radius & shadow: FormCard: rounded-lg (12px) shadow-sm; Inputs: rounded-md (8px)
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 4: Translation Workspace ===== -->

# PAGE 4: Translation Workspace

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Translation Workspace
- Target users: English learners actively translating native text into English
- Primary user goal: View source text, write an English translation, optionally view AI reference, and submit for review
- Requirements:
  - ProgressStepper: step 3 of 4 (interview) or step 2 of 3 (daily)
  - TranslationToggle above layout: "Enable translation writing" — when OFF, shows message to skip directly to review
  - TwoColumnLayout (CSS Grid, 2 equal columns, 24px gap):
    - SourcePanel (left): PanelHeader ("Source Text" + "Reference" badge), HighlightedTextBlock (amber left border 4px, amber-50 bg, line-height 1.8), CollapsibleContextSummary
    - TranslationPanel (right): PanelHeader ("Your English Translation" + "Show AI Reference" toggle with eye icon), TranslationTextarea (min-height 250px, placeholder "Write your English translation here..."), TextareaFooter (word count), AIReferenceBlock (green-50 bg, green left border 3px, sparkle icon, slide-down 200ms)
  - ActionBar (sticky bottom): "← Back" (secondary) + "Submit for Review" (primary, disabled if textarea empty)

## 2) Information architecture & layout
- Page type: form
- Navigation structure: left Sidebar (AppLayout) + ProgressStepper
- Page sections:
  ProgressStepper → TranslationToggle → TwoColumnLayout (SourcePanel [header + highlighted text + context] | TranslationPanel [header + textarea + word count + AI reference block]) → ActionBar (sticky bottom)
- Responsive rules: <768px: sidebar becomes bottom tab bar; two-column stacks vertically (source on top, translation below); ActionBar stays sticky at bottom

## 3) Data & component requirements
- Primary component list: Card, Button, Badge, Textarea, Toggle, Separator, Skeleton, Collapsible
- Table/List definition: N/A
- Form fields:
  - translation | Textarea | optional (when toggle on) | min 1 char | "" | "Write your English translation here..."
- Key interactions: Toggle translation writing on/off → view highlighted source text → expand/collapse context summary → write translation in textarea → see live word count → toggle AI Reference visibility (slide-down animation) → click Submit (disabled if empty) → navigate to /review/:sessionId; click Back → navigate to previous page

## 4) State design
- Loading state: TwoColumnLayout with panel skeletons; text block placeholders
- Empty state: When toggle OFF: centered message 'Click Submit for Review to see the AI translation directly'
- Error state: Alert banner on submission failure with retry
- Disabled states: Submit button disabled until textarea has content (when translation writing enabled)

## 5) Copy & localization
- Locale: en-US
- Tone of voice: supportive and focused
- Key CTA labels & messages:
  Toggle label: "Enable translation writing"
  Toggle OFF message: "Click 'Submit for Review' to see the AI translation directly"
  Source panel title: "Source Text"
  Source badge: "Reference"
  Translation panel title: "Your English Translation"
  AI toggle: "Show AI Reference"
  AI reference label: "AI Reference Translation"
  Textarea placeholder: "Write your English translation here..."
  Word count: "42 words"
  Back: "← Back"
  Submit: "Submit for Review"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: primary = blue; source highlight = amber (amber-50 bg, amber left border); AI reference = green (green-50 bg, green left border 3px)
- Typography: Source text: text-base (16px) line-height 1.8; Translation textarea: text-base (16px); Panel titles: text-lg bold; Word count: muted text
- Radius & shadow: Panels: rounded-lg shadow-sm; HighlightedTextBlock: left border 4px amber; AIReferenceBlock: left border 3px green rounded
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 5: AI Review ===== -->

# PAGE 5: AI Review

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: AI Review
- Target users: English learners receiving detailed AI feedback on their translations
- Primary user goal: View sentence-by-sentence AI review feedback with grammar, word choice, and structure suggestions, then proceed to generate flashcards
- Requirements:
  - ProgressStepper: step 4 of 4 (interview) or step 3 of 3 (daily)
  - ReviewHeader: title "AI Review Feedback" (text-2xl, 24px bold), ErrorSummaryBadges (pill badges with count + type, gap 8px)
    - Grammar: red-100 bg, red-700 text
    - Word Choice: amber-100 bg, amber-700 text
    - Structure: blue-100 bg, blue-700 text
  - ReviewItemList: N ReviewItem cards, each with:
    - Left border 4px colored by error type; 16px margin-bottom
    - ItemSidebar: circular badge (32px) with sentence number, colored bg
    - ItemHeader: TypeBadge (pill) + SentenceLabel (muted text)
    - OriginalTextBox: gray-50 bg, "Your translation" label (text-xs), wavy colored underline on error portion
    - Arrow indicator (↓) centered
    - SuggestedTextBox: green-50 bg, "Suggested revision" label (text-xs green), corrected portion in bold green
    - ReasonBox: white bg, light border, lightbulb icon amber, "Reason:" prefix bold
  - OverallFeedback: green-50 bg, green-200 border, checkmark circle icon, "Overall Assessment" title
  - ActionBar: "← Revise Translation" (secondary) + "Generate Flashcards" (primary)

## 2) Information architecture & layout
- Page type: detail
- Navigation structure: left Sidebar (AppLayout) + ProgressStepper
- Page sections:
  ProgressStepper → ReviewHeader (title + error summary badges) → ReviewItemList (N review cards with original → arrow → suggested → reason) → OverallFeedback card → ActionBar
- Responsive rules: <768px: sidebar becomes bottom tab bar; review items full-width; ActionBar sticky at bottom

## 3) Data & component requirements
- Primary component list: Card, Button, Badge, Alert, Separator, Skeleton
- Table/List definition: N/A
- Form fields: N/A
- Key interactions: View review items with colored error indicators → read original with wavy underline on errors → see suggested revision with bold green corrections → read reason explanation → scroll through all items → view overall assessment → click 'Revise Translation' to go back and edit → click 'Generate Flashcards' to proceed

## 4) State design
- Loading state: ReviewItem card skeletons (3-4) with text line placeholders and badge placeholders
- Empty state: N/A — always shows review results after submission
- Error state: Alert: 'AI review failed. Please try again.' with Retry button
- Disabled states: N/A

## 5) Copy & localization
- Locale: en-US
- Tone of voice: instructive and encouraging
- Key CTA labels & messages:
  Page title: "AI Review Feedback"
  Grammar badge: "Grammar"
  Word Choice badge: "Word Choice"
  Structure badge: "Structure"
  Original label: "Your translation"
  Suggested label: "Suggested revision"
  Reason prefix: "Reason:"
  Overall title: "Overall Assessment"
  Example overall: "Your translation demonstrates good vocabulary range and captures the key meaning. Focus on verb tense consistency and using more natural connective phrases to improve fluency."
  Back: "← Revise Translation"
  Next: "Generate Flashcards"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: Grammar = red hsl(0,84%,60%); Word Choice = amber hsl(38,92%,50%); Structure = blue hsl(217,91%,60%); Success = green; Primary action = blue
- Typography: Review title: text-2xl (24px) bold; Labels: text-xs (12px); Body text: text-sm; Reason text: text-sm
- Radius & shadow: ReviewItem cards: rounded-lg shadow-sm with 4px left colored border; OverallFeedback: rounded-lg green border; Text boxes: rounded with padding 12px
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 6: Flashcard Generation ===== -->

# PAGE 6: Flashcard Generation

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Flashcard Generation
- Target users: English learners saving translations as flashcards for spaced repetition review
- Primary user goal: Choose flashcard storage mode (Paragraph or Sentence), preview the card, and generate/save
- Requirements:
  - PageHeader: "Generate Flashcards", desc "Choose how to save this translation for review"
  - CardModeSelector: heading "Select Storage Mode" (text-lg bold), 2 ModeCards in grid (2-col desktop, 1-col mobile, 16px gap)
    - Each ModeCard: clickable radio card, border 2px; unselected = gray border white bg; selected = colored border + tinted bg + scale 1.02
    - RadioIndicator in top-right; IconContainer (40px rounded square); Title (text-base bold); Description (text-sm muted); RecommendedBadge (pill)
    - Paragraph Mode: FileText icon, blue theme, badge "Recommended for interviews", default for Interview scene
    - Sentence Mode: MessageSquare icon, green theme, badge "Recommended for daily scenes", default for Daily scene
  - CardPreview: gray-50 bg, rounded-lg, padding 20px
    - CardFrontPreview: label "Front (Source Text)" + eye icon, native text
    - Dashed horizontal divider
    - CardBackPreview: label "Back (Your Translation + Reference)", user translation + AI ref in green + Key Note in amber
  - ActionBar: "← Back to Review" (secondary) + "Generate & Save Cards" (primary)

## 2) Information architecture & layout
- Page type: wizard
- Navigation structure: left Sidebar (AppLayout)
- Page sections:
  PageHeader → CardModeSelector (2 ModeCards) → CardPreview (front/divider/back) → ActionBar
- Responsive rules: <768px: sidebar becomes bottom tab bar; ModeCards stack to 1 column; CardPreview full-width

## 3) Data & component requirements
- Primary component list: Card, Button, Badge, RadioGroup, Separator, Toast
- Table/List definition: N/A
- Form fields: N/A
- Key interactions: Click ModeCard to select mode (radio behavior, 150ms transition) → preview updates based on mode (Paragraph=full text, Sentence=first sentence + '(+N more cards)') → click 'Generate & Save Cards' → success toast → navigate to Home or offer Review session

## 4) State design
- Loading state: ModeCard skeletons + preview placeholder
- Empty state: N/A
- Error state: Toast: 'Flashcard generation failed. Please try again.'
- Disabled states: N/A — a mode is always selected by default

## 5) Copy & localization
- Locale: en-US
- Tone of voice: clear and helpful
- Key CTA labels & messages:
  Page title: "Generate Flashcards"
  Page desc: "Choose how to save this translation for review"
  Section heading: "Select Storage Mode"
  Paragraph title: "Paragraph Mode"
  Paragraph desc: "Save as a complete translation exercise with full context. One card set per practice session."
  Paragraph badge: "Recommended for interviews"
  Sentence title: "Sentence Mode"
  Sentence desc: "Split into individual cards per sentence. Great for bite-sized review sessions."
  Sentence badge: "Recommended for daily scenes"
  Preview label: "Card Preview"
  Front label: "Front (Source Text)"
  Back label: "Back (Your Translation + Reference)"
  AI ref prefix: "AI Reference:"
  Key note prefix: "Key Note:"
  Sentence note: "(+ N more cards)"
  Back btn: "← Back to Review"
  Generate btn: "Generate & Save Cards"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: Paragraph mode = blue; Sentence mode = green; primary action = blue
- Typography: Page title: text-3xl bold; Section heading: text-lg bold; Card titles: text-base bold; Descriptions: text-sm muted
- Radius & shadow: ModeCards: rounded with 2px border; CardPreview: rounded-lg; transition 150ms ease on selection
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 7: Flashcard Review ===== -->

# PAGE 7: Flashcard Review

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Flashcard Review
- Target users: English learners reviewing past translations with spaced repetition
- Primary user goal: Review flashcards using SM-2: see native front, recall translation, flip to check, and self-rate (0-5)
- Requirements:
  - ReviewHeader: "Today's Review" (text-2xl bold), subtitle "12 cards due for review" (dynamic), CardCategoryBadges: "3 New" (purple), "7 Due" (blue), "2 Random" (gray)
  - Flashcard3D: CSS perspective ~1000px, transform-style preserve-3d, flip animation 600ms ease
    - Card dimensions: max-width 480px, min-height 380px, centered, shadow deepens during flip
    - CardFront: white bg, rounded-xl (16px), padding 32px; SceneTypeBadge top-left (blue/green); source text centered text-xl line-height 1.8; ContextToggle "Show context ▾"; FlipButton "Show Answer" primary blue
    - CardBack: same dimensions; UserTranslationSection (green label + text); dashed divider; AIReferenceSection (toggleable, blue label); FeedbackSummary (toggleable, amber label); QualityRating at bottom
  - QualityRating (SM-2): prompt "How well did you remember?"; 6 buttons horizontal, min-width 56px, height 64px, rounded-lg
    - 0: red-500 "Forgot"; 1: red-400 "Hard"; 2: orange-400 "Struggled"; 3: yellow-400 "OK"; 4: green-400 "Good"; 5: green-600 "Perfect"
    - Hover: brightness increase + scale 1.05; click submits rating + slide animation to next card
  - ReviewProgressBar: fixed bottom, white bg, progress bar (rounded-full, 8px height, blue fill), counter "4 / 12"
  - SessionSummary (after all cards): checkmark icon green, "Review Complete!" text-2xl, stats row (Cards Reviewed / Average Score / Next Review), "Review More" (secondary) + "Back to Home" (primary)

## 2) Information architecture & layout
- Page type: wizard
- Navigation structure: minimal — left Sidebar (AppLayout) with progress bar at bottom
- Page sections:
  ReviewHeader (title + subtitle + category badges) → Flashcard3D (centered flip card: front with source + flip button / back with translation + AI ref + feedback + rating) → ReviewProgressBar (fixed bottom) → SessionSummary (replaces card when complete)
- Responsive rules: <768px: sidebar becomes bottom tab bar; flashcard takes full width with padding; rating buttons may use 3x2 grid; context as bottom Sheet

## 3) Data & component requirements
- Primary component list: Card, Button, Badge, Progress, Toggle, Separator, Sheet, Skeleton
- Table/List definition: N/A
- Form fields: N/A
- Key interactions: View card front → optionally expand context → mentally recall → click 'Show Answer' to flip (600ms 3D animation) → view back: toggle AI Reference / Feedback → click rating (0-5) → card animates out, next slides in → progress bar updates → at end: session summary appears

## 4) State design
- Loading state: Single large Card skeleton centered with pulsing animation
- Empty state: Centered checkmark illustration + 'No cards due for review. Great job!' + CTA 'Start a new translation'
- Error state: Alert: 'Failed to load review cards' + Retry button
- Disabled states: Rating buttons disabled until card is flipped to back

## 5) Copy & localization
- Locale: en-US
- Tone of voice: encouraging and minimal
- Key CTA labels & messages:
  Title: "Today's Review"
  Subtitle: "12 cards due for review"
  New badge: "3 New"
  Due badge: "7 Due"
  Random badge: "2 Random"
  Flip CTA: "Show Answer"
  Context toggle: "Show context"
  Rating prompt: "How well did you remember?"
  Rating 0: "Forgot"
  Rating 1: "Hard"
  Rating 2: "Struggled"
  Rating 3: "OK"
  Rating 4: "Good"
  Rating 5: "Perfect"
  Progress label: "Progress"
  Progress counter: "4 / 12"
  Session complete title: "Review Complete!"
  Stats: "Cards Reviewed: 12", "Average Score: 3.8", "Next Review: Tomorrow"
  Review more: "Review More"
  Back home: "Back to Home"
  Empty state: "No cards due for review. Great job!"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: primary = blue; rating gradient: 0=red-500, 1=red-400, 2=orange-400, 3=yellow-400, 4=green-400, 5=green-600; Interview badge=blue, Daily badge=green
- Typography: Title: text-2xl bold; Card text: text-xl line-height 1.8; Rating labels: text-xs; Progress counter: bold
- Radius & shadow: Flashcard: rounded-xl (16px) shadow-lg, deeper shadow during flip; Rating buttons: rounded-lg; Progress bar: rounded-full 8px
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 8: History List ===== -->

# PAGE 8: History List

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: History List
- Target users: English learners reviewing and managing past translation exercises
- Primary user goal: Browse, search, and filter past translations; navigate to details or redo actions
- Requirements:
  - PageHeader: "Translation History", subtitle "Review and revisit your past translations"
  - FilterBar: white card, rounded-lg, padding 16px, flex row gap 12px
    - SearchInput: magnifying glass icon inside, placeholder "Search translations...", rounded-lg, flex-1, debounced 300ms
    - SceneFilter: dropdown with filter icon, fixed width 180px, options: All Scenes / Interview / Daily
    - DateRangeFilter: calendar icon, start/end dates separated by "→", placeholder "All dates", opens date picker popover
  - HistoryCard list: white cards, rounded-lg, shadow-sm, hover shadow deepens, clickable → navigate to detail, margin-bottom 12px
    - CardHeader: MetaInfo (SceneTypeBadge pill [blue/green] + Timestamp text-xs muted) + MoreMenu (three-dot dropdown: Re-translate, Re-generate Flashcards, Delete with confirm dialog)
    - PreviewText: text-sm dark, line-clamp-2 with ellipsis, margin 8px 0
    - CardFooter: FeedbackBadges (colored counts, text-xs, same scheme as AI Review) + "View Details →" link
  - Pagination: centered row of page buttons, current = blue bg white text, others = white bg gray border; or infinite scroll with "Load more"

## 2) Information architecture & layout
- Page type: list
- Navigation structure: left Sidebar (AppLayout)
- Page sections:
  PageHeader → FilterBar (search + scene dropdown + date range) → HistoryCard list (paginated) → Pagination
- Responsive rules: <768px: sidebar becomes bottom tab bar; filter bar wraps to multiple rows; search full-width; cards full-width; date picker as Dialog

## 3) Data & component requirements
- Primary component list: Card, Button, Badge, Input, Select, DropdownMenu, Dialog, Separator, Skeleton
- Table/List definition:
  History card list: fields (date, scene_type badge, source_preview line-clamp-2, feedback badges, actions dropdown)
  Sorting: by date desc (default)
  Pagination: page numbers or infinite scroll
  Filters: scene_type (All/Interview/Daily), date_range, search text (debounced 300ms)
- Form fields:
  - search | Input | optional | "" | "" | "Search translations..."
  - scene_filter | Select | optional | one of [All Scenes, Interview, Daily] | "All Scenes" | ""
  - date_range | DateRangePicker | optional | valid range | "" | "All dates"
- Key interactions: Type in search → debounced 300ms filtering → select scene filter → filter list → pick date range → filter → click HistoryCard → navigate to /history/:id → click MoreMenu → dropdown with Re-translate / Re-generate / Delete; Delete shows confirmation dialog

## 4) State design
- Loading state: 4 HistoryCard skeletons stacked with badge and text line placeholders
- Empty state: Illustration + 'No translations yet' + 'Start your first translation practice to see it here' + primary action button
- Error state: Alert banner: 'Failed to load history' + Retry button
- Disabled states: N/A

## 5) Copy & localization
- Locale: en-US
- Tone of voice: clean and informational
- Key CTA labels & messages:
  Page title: "Translation History"
  Page subtitle: "Review and revisit your past translations"
  Search placeholder: "Search translations..."
  Scene filter default: "All Scenes"
  Scene filter options: "Interview", "Daily"
  Date placeholder: "All dates"
  View detail: "View Details →"
  Menu: Re-translate, Re-generate Flashcards, Delete
  Empty title: "No translations yet"
  Empty desc: "Start your first translation practice to see it here"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: Interview badge = blue-100/blue-700; Daily badge = green-100/green-700; primary action = blue
- Typography: Page title: text-3xl bold; Preview text: text-sm with line-clamp-2; Timestamp: text-xs muted
- Radius & shadow: FilterBar: rounded-lg; HistoryCards: rounded-lg shadow-sm, hover shadow-md; current page button: filled blue
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 9: History Detail ===== -->

# PAGE 9: History Detail

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: History Detail
- Target users: English learners reviewing a specific past translation in detail
- Primary user goal: View complete source text, translation, AI review feedback, and take re-do actions
- Requirements:
  - BackLink: "← Back to History" in blue text-sm, hover underline, navigates to /history
  - DetailHeader: flex row, MetaInfo (SceneTypeBadge + Timestamp + ContextTitle text-xl bold) on left, ActionButtons on right ("Re-translate" secondary + "Generate Flashcards" primary)
  - TwoColumnLayout:
    - SourceTextSection: white card, "Source Text" title (text-lg bold) with amber indicator dot, HighlightedTextBlock (reused: amber left border, yellow-tinted bg)
    - TranslationSection: white card, "Your Translation" title (text-lg bold) with green indicator dot, gray-50 bg block with user's translation
  - ContextSection: collapsible, reused from TranslationWorkspace
  - ReviewSection: full-width white card, "AI Review Feedback" title, ErrorSummaryBadges + ReviewItemList (all reused from AI Review page, identical styling)

## 2) Information architecture & layout
- Page type: detail
- Navigation structure: left Sidebar (AppLayout)
- Page sections:
  BackLink → DetailHeader (meta + actions) → TwoColumnLayout (SourceText | Translation) → ContextSection (collapsible) → ReviewSection (error badges + review items)
- Responsive rules: <768px: sidebar becomes bottom tab bar; two-column stacks vertically; action buttons stack; review items full-width

## 3) Data & component requirements
- Primary component list: Card, Button, Badge, Separator, Collapsible, Skeleton
- Table/List definition: N/A
- Form fields: N/A
- Key interactions: Click BackLink → /history; Click 'Re-translate' → Translation Workspace with source pre-filled; Click 'Generate Flashcards' → Flashcard Generation page; Expand/collapse context

## 4) State design
- Loading state: TwoColumnLayout skeleton with text block placeholders + review item skeletons
- Empty state: N/A — always has data from history
- Error state: not-found page if invalid ID; Alert on load failure
- Disabled states: N/A

## 5) Copy & localization
- Locale: en-US
- Tone of voice: clean and informational
- Key CTA labels & messages:
  Back link: "← Back to History"
  Source title: "Source Text"
  Translation title: "Your Translation"
  Review title: "AI Review Feedback"
  Re-translate btn: "Re-translate"
  Flashcards btn: "Generate Flashcards"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: Source indicator = amber; Translation indicator = green; primary = blue; error badges = red/amber/blue per type
- Typography: Section titles: text-lg bold; Context title: text-xl bold; Body text: text-base; Back link: text-sm blue
- Radius & shadow: Section cards: rounded-lg padding 20px; HighlightedTextBlock: amber left border 4px; Review items: left colored border 4px
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 10: Statistics ===== -->

# PAGE 10: Statistics

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Statistics
- Target users: English learners tracking their translation practice progress
- Primary user goal: View learning statistics: total translations, flashcards, study streak, accuracy, scene distribution, and common errors
- Requirements:
  - PageHeader: "Learning Statistics", subtitle "Track your translation practice progress"
  - StatCardGrid: 4 columns desktop, 2 tablet, 1 mobile, gap 16px
    - StatCard: white card, rounded-lg, padding 20px, shadow-sm
      - Label: text-sm muted; Value: text-3xl (30px) bold dark; TrendIndicator below
      - Positive trend: green text + up-arrow; Negative: red + down-arrow; Neutral: gray
    - Card 1: "Total Translations" / "48" / "↑ 12 this week" (green)
    - Card 2: "Flashcards" / "156" / "12 due for review" (amber)
    - Card 3: "Study Streak" / "7 days" / "Keep it going!" (green)
    - Card 4: "Avg. Accuracy" / "82%" / "↑ 5% vs last week" (green)
  - ChartsSection:
    - SceneDistributionChart: white card, "Scene Distribution" title text-lg bold, horizontal bars (blue=Interview 65%, green=Daily 35%), bar height 24px rounded ends
    - CommonErrorsChart: white card, "Common Error Types" title text-lg bold, list rows with colored dot + label + count + small bar (Grammar 24 red, Word Choice 18 amber, Structure 12 blue), sorted by count desc

## 2) Information architecture & layout
- Page type: dashboard
- Navigation structure: left Sidebar (AppLayout)
- Page sections:
  PageHeader → StatCardGrid (4 summary cards) → ChartsSection (SceneDistributionChart + CommonErrorsChart)
- Responsive rules: <768px: sidebar becomes bottom tab bar; StatCardGrid 1 column; charts stack vertically full-width

## 3) Data & component requirements
- Primary component list: Card, Badge, Separator, Skeleton
- Table/List definition: N/A
- Form fields: N/A
- Key interactions: View stats (static display); charts show data visualization; TrendIndicators update dynamically

## 4) State design
- Loading state: 4 StatCard skeletons in grid + 2 chart card skeletons
- Empty state: Stats show zero values with encouraging message 'Start practicing to see your stats!'
- Error state: Alert: 'Failed to load statistics' + Retry
- Disabled states: N/A

## 5) Copy & localization
- Locale: en-US
- Tone of voice: motivational and clean
- Key CTA labels & messages:
  Page title: "Learning Statistics"
  Page subtitle: "Track your translation practice progress"
  Stat 1: "Total Translations" / "48" / "↑ 12 this week"
  Stat 2: "Flashcards" / "156" / "12 due for review"
  Stat 3: "Study Streak" / "7 days" / "Keep it going!"
  Stat 4: "Avg. Accuracy" / "82%" / "↑ 5% vs last week"
  Chart 1 title: "Scene Distribution"
  Chart 2 title: "Common Error Types"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: Interview bar = blue; Daily bar = green; Grammar dot = red; Word Choice dot = amber; Structure dot = blue; Positive trend = green; Negative trend = red
- Typography: Page title: text-3xl bold; Stat label: text-sm muted; Stat value: text-3xl bold; Chart titles: text-lg bold
- Radius & shadow: StatCards: rounded-lg shadow-sm padding 20px; Chart cards: rounded-lg padding 20px; Bars: rounded ends
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

<!-- ===== PAGE 11: Settings ===== -->

# PAGE 11: Settings

## 1) Product & page goal
- Product / Project name: WriteCraft
- Page / Feature name: Settings
- Target users: English learners customizing their learning preferences
- Primary user goal: Configure flashcard defaults, AI review preferences, and review session settings
- Requirements:
  - PageHeader: "Settings", subtitle "Customize your learning preferences"
  - SettingsSectionList: 3 sections, each white card rounded-lg padding 20px, margin-bottom 20px
    - Section title: text-lg bold, subtle bottom border
    - SettingItems stacked with dividers between them
    - Each SettingItem: flex row, SettingInfo (label text-sm font-medium + description text-xs gray) on left, SettingControl on right
  - Section "Flashcard Defaults":
    - "Interview Flashcard Mode" — Dropdown [Paragraph Mode (default), Sentence Mode]
    - "Daily Flashcard Mode" — Dropdown [Sentence Mode (default), Paragraph Mode]
  - Section "AI Review Preferences":
    - "Show AI Reference" — Toggle (default: off)
    - "Feedback Detail" — Dropdown [Detailed (default), Concise]
  - Section "Review Settings":
    - "New Cards / Day" — Number input (default: 20, min: 5, max: 50, width 64px)
    - "Random Reinforcement" — Toggle (default: on)

## 2) Information architecture & layout
- Page type: settings
- Navigation structure: left Sidebar (AppLayout)
- Page sections:
  PageHeader → SettingsSection "Flashcard Defaults" (2 items) → SettingsSection "AI Review Preferences" (2 items) → SettingsSection "Review Settings" (2 items)
- Responsive rules: <768px: sidebar becomes bottom tab bar; settings cards full-width; controls may wrap below labels on very narrow screens

## 3) Data & component requirements
- Primary component list: Card, Select, Toggle, Input, Separator
- Table/List definition: N/A
- Form fields:
  - interview_flashcard_mode | Select | required | one of [Paragraph Mode, Sentence Mode] | "Paragraph Mode" | ""
  - daily_flashcard_mode | Select | required | one of [Sentence Mode, Paragraph Mode] | "Sentence Mode" | ""
  - show_ai_reference | Toggle | required | boolean | false | ""
  - feedback_detail | Select | required | one of [Detailed, Concise] | "Detailed" | ""
  - new_cards_per_day | Number input (64px) | required | int, min 5, max 50 | 20 | ""
  - random_reinforcement | Toggle | required | boolean | true | ""
- Key interactions: Change dropdown selections → auto-save; Toggle switches → auto-save; Adjust number input → auto-save

## 4) State design
- Loading state: 3 settings section skeletons with item placeholders
- Empty state: N/A — settings always have defaults
- Error state: Toast: 'Failed to save setting' with retry
- Disabled states: N/A

## 5) Copy & localization
- Locale: en-US
- Tone of voice: clean and functional
- Key CTA labels & messages:
  Page title: "Settings"
  Page subtitle: "Customize your learning preferences"
  Section 1: "Flashcard Defaults"
  Item 1.1 label: "Interview Flashcard Mode"
  Item 1.1 desc: "Default card generation mode for interview scenes"
  Item 1.2 label: "Daily Flashcard Mode"
  Item 1.2 desc: "Default card generation mode for daily scenes"
  Section 2: "AI Review Preferences"
  Item 2.1 label: "Show AI Reference"
  Item 2.1 desc: "Automatically display AI reference translation during writing"
  Item 2.2 label: "Feedback Detail"
  Item 2.2 desc: "Level of detail in AI review feedback"
  Section 3: "Review Settings"
  Item 3.1 label: "New Cards / Day"
  Item 3.1 desc: "Maximum number of new cards introduced per review session"
  Item 3.2 label: "Random Reinforcement"
  Item 3.2 desc: "Include random old cards in each review session"

## 6) Visual system constraints
- Theme: light
- Primary color token hint: primary = blue for active toggles and selections
- Typography: Page title: text-3xl bold; Section title: text-lg bold; Item label: text-sm font-medium; Item desc: text-xs gray
- Radius & shadow: Section cards: rounded-lg padding 20px; Controls use default shadcn/ui styling
- Spacing density: comfortable

## 7) Output requirements
- Produce 3 variants and explain the differences

---

Start generating the UI prototype and variants now. Process each page sequentially (Page 1 through Page 11), producing 3 variants per page.
