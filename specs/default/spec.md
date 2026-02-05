## English Translation Writing Assistant - Requirements Document

### 1. Project Background & Goals

**Target Users**: English learners

**Core Objectives**:

- Convert everyday language encounters into English
- Provide a convenient tool for capturing fragmented language snippets
- Practice translation writing for interview scenarios
- Improve translation quality through AI feedback
- Reinforce learning outcomes through Flashcard review

---

### 2. Core Feature Modules

### 2.1 Scene Selection Module

**Supported Scene Types**:

1. **Interview Scene**:
    - Requires detailed context information (position, company, interview type, etc.)
    - Suited for paragraph-level translation practice
    - Emphasizes professionalism and accuracy
2. **Daily Scene**:
    - Context information is optional and simplified (conversation setting, formality level, etc.)
    - Suited for quick capture of fragmented expressions
    - Emphasizes naturalness and idiomatic usage

**Scene Template Content**:

**Interview Scene Template** includes:

- Job description
- Company background
- Interview question type (behavioral / technical)
- Guides users to use professional frameworks (e.g., STAR method)

**Daily Scene Template** includes:

- Conversation setting (restaurant / store / social, etc.) - optional
- Relationship formality (formal / informal) - optional
- Quick input mode with simplified interface

---

### 2.2 Translation Writing Module

**Features**:

1. **Context Input**:
    - User enters background information
    - The LLM needs this information to better assist the user
2. **Native Language Source Input**:
    - User enters the native language content to be translated
    - **Supports highlighting** of the user's input
    - Serves as translation reference
3. **Translation Writing Area**:
    - User translates into English while referencing the native language source
    - **User can choose whether to enable the translation writing feature** (they may only want to see the AI translation)
4. **AI Reference Translation** (optional):
    - Provides AI translation as a reference
    - Not forced to display; user decides

---

### 2.3 AI Review Module

**Review Method**: Sentence-by-sentence analysis and feedback

**Feedback Dimensions**:

1. **Grammar Errors**:
    - Flag grammar issues
    - Provide correct usage
    - Explain the reason for the error
2. **Word Choice Suggestions**:
    - Identify inappropriate or imprecise word choices
    - Provide more idiomatic/accurate vocabulary alternatives
    - Explain why the suggested word is better
3. **Sentence Structure Improvements**:
    - Identify sentence structure issues
    - Provide optimization suggestions
    - Offer rewrite examples

**Feedback Presentation Requirements**:

- Display sentence by sentence with clear comparisons
- Distinguish between different types of issues (grammar / word choice / structure)
- Every piece of feedback must include a reason

---

### 2.4 Flashcard Generation & Review Module

### 2.4.1 Generation Mechanism

**Two storage granularity levels**, user can choose:

**Option A - Paragraph Mode**:

- One complete translation exercise = one card set
- Contains: Context + full source text + user translation + AI review results
- Advantage: Preserves full context, suited for understanding the overall scenario
- **Default for interview scenes**

**Option B - Sentence/Phrase Mode**:

- Each sentence or key phrase = one individual card
- Contains: Brief context (optional) + single sentence source + single sentence translation + AI feedback for that sentence
- Advantage: Fine granularity, suited for fragmented review
- **Default for daily scenes**

**User Actions**:

- After completing translation and AI review, user can choose "Generate Flashcard"
- System provides default option based on scene; user can switch
- User can modify default preferences in settings

### 2.4.2 Card Content Structure

**Front**: Native language source text
**Back**:

- User's translation
- AI-revised reference version (optionally displayed)
- Key feedback point summary (optionally displayed)

**Additional Information**:

- Context information
- Creation time
- Scene type

### 2.4.3 Review Mechanism

**Uses SM-2 Algorithm** (SuperMemo's spaced repetition algorithm):

**Core Principle**:

- Dynamically adjust next review time based on answer quality
- Remembered well → interval lengthens
- Forgotten → reset to short interval

**Answer Quality Rating** (0-5):

- 0-2: Completely forgotten, start over
- 3: Barely remembered, with difficulty
- 4: Remembered, with some hesitation
- 5: Completely remembered, effortless

**Review Interval Adjustment Logic**:

- First review: after 1 day
- Second review: after 6 days
- Subsequent: calculated based on difficulty factor and previous interval
- After forgetting: reset to 1 day

**Card Presentation Order**:

1. New cards first
2. Cards due for review
3. Mix in a small number of random cards (to reinforce memory)

---

### 2.5 History Module

**Information to Record**:

- All content the user has translated
- All AI review feedback
- AI-provided reference translations (if any)
- Translation time and scene type
- Associated Flashcard information

**Features**:

1. **View Translation History List**:
    - Display in reverse chronological order
    - Support filtering by scene type
    - Support filtering by date range
    - Search functionality
2. **View Details**:
    - View complete source text, user translation, and AI review
    - Highlight key issues
3. **Re-do Operations**:
    - Modify previous translations
    - Re-request AI review
    - Re-generate Flashcards
4. **Statistics** (expandable later):
    - Total translation count
    - Scene distribution
    - Common error type analysis
    - Learning progress visualization

---

### 3. Core User Flows

### 3.1 Interview Scene Full Flow

```
1. User selects "Interview Scene"
2. Fill in Context information
   - Job description
   - Company background
   - Interview question type
3. Enter native language answer (system highlights it)
4. User translates into English while referencing native language
5. User submits translation
6. AI performs sentence-by-sentence review, providing feedback
   - Grammar errors
   - Word choice suggestions
   - Sentence structure improvements
7. User views feedback, can choose to revise
8. User selects "Generate Flashcard"
   - System defaults to "Paragraph Mode"
   - User can switch to "Sentence Mode"
9. Cards generated and saved to review library
10. System records to history
```

### 3.2 Daily Scene Full Flow

```
1. User selects "Quick Input" or "Daily Scene"
2. (Optional) Fill in simple Context
   - Scene type
   - Formality level
3. Quickly input fragmented native language expressions
4. Two choices:
   a) Directly get AI translation suggestions
   b) Translate first, then get AI feedback
5. AI provides review feedback
6. User selects "Generate Flashcard"
   - System defaults to "Sentence Mode"
   - User can switch to "Paragraph Mode"
7. One-click generate and save cards
8. System records to history
```

### 3.3 Review Flow

```
1. User enters "Review Mode"
2. System presents cards due for review
   - New cards shown first
   - Then due cards
3. Display card front (native language source)
   - Can view Context information
4. User tries to recall the translation
5. Flip card to reveal back
   - User's original translation
   - AI revision suggestions (optionally displayed)
6. User self-rates (0-5)
7. System calculates next review time using SM-2 algorithm
8. Continue to next card
```

---

### 4. UI/UX Requirements

1. **Highlighting**: User's native language input must be prominently displayed
2. **Side-by-side Comparison**: During AI feedback, original sentence and suggested revision must be clearly compared
3. **Error Type Indicators**: Different types of issues identified with different colors or icons
4. **Quick Actions**: Daily scene must support rapid input with minimal steps
5. **Review Interface**: Clean and focused on card content; rating actions must be convenient
