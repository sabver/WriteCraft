# WriteCraft MVP Requirements

## Overview

**Target Users**: English learners

**Core Loop**:
```
Select Scene → Input Content → Write Translation → AI Review → Generate Flashcard → Review
```

---

## Module 1: Scene Selection

Two scenes are available from the home screen.

| Scene | Context Fields | Use Case |
|---|---|---|
| Interview | Job description, Company background, Interview question type | Paragraph-level professional translation |
| Daily | Conversation setting (optional), Formality level (optional) | Quick capture of fragmented expressions |

Daily scene context fields are fully optional — users can skip directly to input.

---

## Module 2: Translation Writing

1. **Context Input** — User fills in scene-specific background fields.
2. **Source Text Input** — User enters the native language content to translate. Source text is highlighted for visual prominence.
3. **Translation Writing Area** — User writes the English translation while referencing the highlighted source.
4. **AI Reference Translation** — Hidden by default; revealed only when the user explicitly clicks to show it.

---

## Module 3: AI Review

Feedback is displayed sentence by sentence. Each issue shows a side-by-side comparison of the original sentence and the suggested revision. Different issue types are visually distinguished by color or icon. Every piece of feedback must include a reason.

| Type | Content |
|---|---|
| Grammar Errors | Flag the issue, provide correct usage, explain the reason |
| Word Choice | Identify imprecise words, suggest better alternatives with explanation |
| Sentence Structure | Identify structural issues, provide rewrite examples |

---

## Module 4: Flashcard Generation

After completing AI Review, the user clicks **"Generate Flashcard"**. The system defaults to the mode appropriate for the current scene; the user can switch modes before generating.

| Mode | Granularity | Default Scene |
|---|---|---|
| Paragraph Mode | One full translation exercise = one card set | Interview |
| Sentence Mode | Each sentence or key phrase = one card | Daily |

**Card Structure**:

| Side | Content |
|---|---|
| Front | Native language source text |
| Back | User's translation + AI-revised reference version + Key feedback summary |

Each card also stores context information, creation timestamp, and scene type.

---

## Module 5: Flashcard Review

Cards are presented in order: new cards first, then cards due for review.

**Review Flow**:
1. Card front is shown (native language source text).
2. User attempts to recall the translation.
3. User flips the card to reveal the back.
4. User self-rates 0–5.
5. System calculates and stores the next review date via SM-2.
6. Proceed to the next card.

**SM-2 Rating Scale**:

| Rating | Meaning |
|---|---|
| 0–2 | Completely forgotten — reset interval to 1 day |
| 3 | Recalled with difficulty |
| 4 | Recalled with slight hesitation |
| 5 | Recalled effortlessly |

**Default interval schedule**: 1st review after 1 day, 2nd after 6 days, subsequent reviews calculated from difficulty factor × previous interval.

---

## Module 6: History

All records are persisted in a database.

**Data stored per record**: scene type, context, source text, user translation, AI review feedback, AI reference translation, associated Flashcard IDs, created at timestamp.

| Feature | Description |
|---|---|
| History List | Reverse chronological; filter by scene type or date range; keyword search |
| Detail View | Full source text, user translation, and AI review with key issues highlighted |
| Re-do | Re-edit a past translation, re-request AI review, re-generate Flashcards |
