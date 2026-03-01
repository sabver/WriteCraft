# Plan 004 — Frontend Internationalization (i18n)

**Spec:** [specs/004-i18n/spec.md](specs/004-i18n/spec.md)
**Status:** Draft

---

## 1. Architecture Overview

### Approach: Client-Side Locale with next-intl

**Selected library: `next-intl`**

Rationale:
- First-class Next.js 15 App Router support (Server + Client Components)
- Type-safe `useTranslations()` hook
- ICU message format — handles interpolation (`{name}`) and plurals natively
- Flat locale files (no routing URL changes needed for client-mode)
- Future-proof: upgrading to URL-based routing (`/en/`, `/zh-CN/`) requires no message file changes

**Mode: Client-side locale (no URL routing changes)**

The spec requires language switching without a full-page navigation (US-01) and prohibits URL rewrites by implication (locale stored in `localStorage`, OQ-02 decision). This is implemented by:

1. Locale stored in `localStorage` and read on client mount.
2. `LocaleProvider` wraps the entire app, dynamically importing the correct message file.
3. `NextIntlClientProvider` receives messages + locale as props from `LocaleProvider`.
4. No `middleware.ts`, no route prefix (`/zh-CN/...`), no `next.config` i18n block needed.

### System Diagram

```
RootLayout (server)
└── LocaleProvider (client) ← reads/writes localStorage, detects navigator.language
    └── NextIntlClientProvider (locale + messages)
        └── MainLayout
            ├── Sidebar
            │   └── LanguageSwitcher  ← calls setLocale()
            └── Page content
                └── useTranslations('namespace')
```

---

## 2. File Structure

### New files

```
messages/
├── en.json           # English base (authoritative)
└── zh-CN.json        # Simplified Chinese

src/i18n/
├── config.ts         # Locale type, supported locales list, display names
└── detect.ts         # First-visit detection from navigator.language

src/contexts/
└── LocaleContext.tsx # LocaleProvider + useLocale() hook

src/components/common/
└── LanguageSwitcher.tsx  # Dropdown in sidebar footer
```

### Modified files

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Wrap body with `<LocaleProvider>` |
| `src/components/layout/Sidebar.tsx` | Add `<LanguageSwitcher>` to footer |
| `src/components/layout/MainLayout.tsx` | No change needed (passes children) |
| All page and component files (see §5) | Replace hard-coded strings with `useTranslations()` |

---

## 3. Message File Structure

All translatable strings live in a single-level namespace. Sub-keys follow dot notation.

**File: `messages/en.json`** (authoritative source of truth)

```jsonc
{
  "nav": {
    "dashboard": "Dashboard",
    "history": "History",
    "review": "Review",
    "flashcards": "Flashcards",
    "settings": "Settings",
    "helpSupport": "Help & Support",
    "logout": "Logout",
    "proPlan": "Pro Plan"
  },
  "home": {
    "practiceScenes": "Practice Scenes",
    "practiceSubtitle": "Choose your focus for today's session.",
    "quickTranslation": "Quick Translation",
    "instantFeedback": "Instant Feedback",
    "analyze": "Analyze",
    "yourExpression": "Your Expression",
    "expressionPlaceholder": "e.g. 'I'd like to check out, please'...",
    "charCount": "{count} / 500",
    "aiFeedbackTitle": "AI Feedback & Translation",
    "aiFeedbackEmpty": "Type something on the left to receive instant translation and grammar feedback.",
    "todayFragments": "Today's Fragments",
    "searchFragments": "Search fragments...",
    "translationLabel": "Translation: {text}",
    "voiceInput": "Voice input",
    "pasteClipboard": "Paste from clipboard",
    "listenAria": "Listen",
    "saveFlashcardsAria": "Save to flashcards"
  },
  "scene": {
    "dailyTitle": "Daily Practice",
    "dailyDesc": "Quick translations for fragmented expressions and everyday thoughts.",
    "dailyMode": "Instant Mode",
    "interviewTitle": "Job Interview",
    "interviewDesc": "Structured practice for professional career-focused conversations.",
    "interviewLevel": "Intermediate",
    "startAria": "Start {scene} practice"
  },
  "stepper": {
    "context": "Context",
    "source": "Source",
    "translate": "Translate",
    "review": "Review",
    "flashcard": "Flashcard"
  },
  "daily": {
    "pageTitle": "Daily Practice",
    "step0": "Set the context for your daily conversation.",
    "step1": "Record the expression in your native language.",
    "step2": "Translate your daily expression.",
    "submitting": "Submitting for AI review\u2026"
  },
  "interview": {
    "pageTitle": "Job Interview Practice",
    "step0": "Set the context for your mock interview session.",
    "step1": "Record your answer in your native language.",
    "step2": "Write your professional English translation.",
    "submitting": "Submitting for AI review\u2026"
  },
  "dailyContext": {
    "settingLabel": "Conversation Setting (Optional)",
    "settingPlaceholder": "Select a setting...",
    "settingCoffeeShop": "Coffee Shop",
    "settingRestaurant": "Restaurant",
    "settingAirport": "Airport",
    "settingHotel": "Hotel",
    "settingOffice": "Office",
    "settingOther": "Other",
    "settingHint": "Where does this conversation take place?",
    "formalityLabel": "Formality Level (Optional)",
    "formalityCasual": "Casual",
    "formalityNeutral": "Neutral",
    "formalityFormal": "Formal",
    "formalityHint": "How polite or relaxed should the language be?",
    "tipTitle": "Quick Tip",
    "tipBody": "Daily practice is great for fragmented expressions. You can skip these fields if you just want to translate a specific phrase quickly.",
    "tipSkipHint": "Context fields are optional \u2014 feel free to skip.",
    "skipBtn": "Skip Directly",
    "startBtn": "Start Writing",
    "duration": "~5 Min Session"
  },
  "interviewContext": {
    "questionLabel": "Interview Question *",
    "questionPlaceholder": "e.g., Tell me about yourself",
    "questionHint": "Specify the question you want to practice answering.",
    "roleLabel": "Job Role",
    "roleBackend": "Backend Engineer",
    "roleProduct": "Product Manager",
    "roleUX": "UX Designer",
    "roleData": "Data Scientist",
    "toneLabel": "Tone",
    "toneProfessional": "Professional",
    "toneNeutral": "Neutral",
    "toneConfident": "Confident",
    "advancedOptions": "Advanced Options",
    "companyLabel": "Company/Industry",
    "companyPlaceholder": "e.g., Tech, Finance...",
    "interviewTypeLabel": "Interview Type",
    "typeHR": "HR Interview",
    "typeTech": "Technical Interview",
    "saveTemplate": "Save as Template",
    "skipBtn": "Skip",
    "startBtn": "Start Writing",
    "aiPowered": "AI Context Powered",
    "duration": "~15 Min Session"
  },
  "sourceText": {
    "label": "Source Text (Native Language) *",
    "hint": "Enter the text in your native language that you want to translate.",
    "whyTitle": "Why this matters?",
    "whyBody": "Recording your original thought in your native language helps our AI provide more accurate feedback on your translation nuances and word choices.",
    "nextBtn": "Next: Translate",
    "duration": "~2 Min Step"
  },
  "translation": {
    "sourceLabel": "Source Text",
    "referenceBadge": "Reference",
    "yourTranslationLabel": "Your Translation",
    "charCount": "{count} / 10+ chars",
    "placeholder": "Write your English translation here...",
    "showReference": "Show AI Reference Translation",
    "hideReference": "Hide AI Reference Translation",
    "submitBtn": "Submit for AI Review"
  },
  "review": {
    "pageTitle": "AI Feedback Review",
    "pageSubtitle": "Review your translation and writing improvements.",
    "aiBadge": "AI",
    "youBadge": "YOU",
    "analysisComplete": "Analysis Complete",
    "allIssues": "All Issues",
    "successTitle": "Great job!",
    "successBody": "Your translation looks great! Ready to generate flashcards.",
    "generateFlashcardsBtn": "Generate Flashcards",
    "emptyTitle": "No review yet",
    "emptyBody": "Complete a practice session first, and your AI feedback will appear here.",
    "startPracticeBtn": "Start Practice",
    "errorTitle": "Something went wrong"
  },
  "reviewItem": {
    "originalLabel": "Original",
    "revisedLabel": "Revised",
    "highPriority": "High Priority",
    "mediumPriority": "Medium Priority",
    "lowPriority": "Low Priority",
    "reasonLabel": "Reason",
    "generateFlashcard": "Generate Flashcard"
  },
  "history": {
    "pageTitle": "Practice History",
    "pageSubtitle": "Review your past sessions and track your progress.",
    "searchPlaceholder": "Search history...",
    "filterAll": "all",
    "filterInterview": "interview",
    "filterDaily": "daily",
    "timeAll": "All time",
    "time7d": "7d",
    "time30d": "30d",
    "issuesLabel": "Issues",
    "perfectLabel": "Perfect",
    "issueCount": "{count} found",
    "startPracticeBtn": "Start Practicing",
    "emptyTitle": "No history yet",
    "emptyBody": "Every practice session is a step forward.",
    "loadError": "Failed to load history. Please try again."
  },
  "historyDetail": {
    "backBtn": "Back to History",
    "pageTitle": "Practice Session Detail",
    "redoBtn": "Re-do Exercise",
    "sourceLabel": "Source Text",
    "translationLabel": "Your Translation",
    "aiReviewLabel": "AI Review & Feedback",
    "flashcardsLabel": "Related Flashcards",
    "flashcardN": "Flashcard #{n}",
    "noIssues": "No issues found \u2014 great translation!",
    "notFoundTitle": "Session Not Found",
    "notFoundBody": "This session could not be loaded."
  },
  "flashcardGenerate": {
    "pageTitle": "Generate Flashcards",
    "pageSubtitle": "Convert your practice session into study material.",
    "modeTitle": "Card Generation Mode",
    "modeSubtitle": "Choose how you want to split your translation into cards.",
    "modeParagraph": "Paragraph",
    "modeSentence": "Sentence",
    "previewTitle": "Card Preview",
    "frontLabel": "Front",
    "backLabel": "Back",
    "backHint": "AI revision + feedback summary",
    "noSessionTitle": "No active session \u2014 please start a practice session first.",
    "goToReviewBtn": "Go to Review",
    "saveBtn": "Save Flashcards"
  },
  "flashcardReview": {
    "pageTitle": "Review Session",
    "backAria": "Back to dashboard",
    "progressLabel": "Progress",
    "progressValue": "{current} / {total}",
    "ratePrompt": "How well did you recall this?",
    "rateForgot": "Forgot",
    "rateHard": "Hard",
    "rateEasy": "Easy",
    "rateAria": "Rate {n}",
    "allCaughtUp": "All caught up!",
    "allCaughtUpBody": "You've reviewed all your due cards for today. Come back tomorrow!",
    "backToDashboard": "Back to Dashboard",
    "flipHint": "Space Flip"
  },
  "flashcard3d": {
    "sourceLabel": "Source Text",
    "tapToReveal": "Tap or space to reveal",
    "translationLabel": "Your Translation",
    "aiRevisionLabel": "AI Revision",
    "noCorrections": "No corrections needed",
    "moreCorrections": "+{count} more \u2014 view all corrections",
    "originalLabel": "Original",
    "revisedLabel": "Revised"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "cancel": "Cancel",
    "save": "Save",
    "skip": "Skip",
    "back": "Back",
    "next": "Next",
    "interviewScene": "INTERVIEW",
    "dailyScene": "DAILY",
    "activeNow": "Active Now"
  },
  "langSwitcher": {
    "label": "Language",
    "en": "English",
    "zhCN": "\u4e2d\u6587 (\u7b80\u4f53)"
  }
}
```

**File: `messages/zh-CN.json`** — same structure, all values in Chinese. See §5 for the string inventory.

> **zh-TW accommodation (OQ-05):** When zh-TW is added, a `messages/zh-TW.json` file is created. Only strings that differ from zh-CN need to be present — the detection logic can implement a zh-TW → zh-CN fallback chain via next-intl's `getRequestConfig` if needed later.

---

## 4. Key Module Designs

### 4.1 `src/i18n/config.ts`
```typescript
export const LOCALES = ['en', 'zh-CN'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '中文 (简体)',
};
export const LOCALE_STORAGE_KEY = 'writecraft-locale';
```
*Traces to: OQ-03 (localStorage key), OQ-05 (LOCALES array is the single place to add zh-TW)*

---

### 4.2 `src/i18n/detect.ts`
```typescript
// Browser-only. Returns the locale to use on first visit (no stored pref).
// navigator.language examples: "zh-CN", "zh-TW", "zh", "en-US", "en"
export function detectLocale(): Locale {
  const lang = (navigator?.language ?? '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh-CN';
  return DEFAULT_LOCALE;
}
```
*Traces to: US-05, OQ-01 (auto-detect; zh-TW also maps to zh-CN as closest match)*

---

### 4.3 `src/contexts/LocaleContext.tsx`
```typescript
'use client';
// State machine:
//   Mount → read localStorage → if absent, detectLocale() → set locale
//   setLocale(l) → update state + write localStorage
//
// Dynamic import of messages:
//   useEffect on locale change → import(`../../messages/${locale}.json`) → setMessages()
//
// Renders NextIntlClientProvider with current locale + messages.
// Shows children immediately (no loading gate) — brief flash on first zh-CN load is acceptable.
```
*Traces to: US-01 (switch without reload), US-05 (auto-detect), OQ-03 (localStorage)*

---

### 4.4 `src/components/common/LanguageSwitcher.tsx`
- Rendered in `Sidebar` footer between Help & Support and the user profile section.
- Uses shadcn `Select` (matches existing UI pattern).
- Calls `useLocale()` → `setLocale()`.
- Options built from `LOCALES` + `LOCALE_LABELS` in config — adding zh-TW requires no component changes.

*Traces to: US-01, OQ-02 (sidebar footer)*

---

## 5. Component Translation Changelist

All components below require adding `const t = useTranslations('namespace')` and replacing string literals.

| File | Namespace | String count (approx) |
|------|-----------|-----------------------|
| `src/components/layout/Sidebar.tsx` | `nav` | 8 |
| `src/components/scene/SceneCard.tsx` | `scene` | 6 |
| `src/components/common/ProgressStepper.tsx` | `stepper` | 5 |
| `src/components/common/SceneBadge.tsx` | `common` | 2 |
| `src/components/common/IssueBadge.tsx` | `reviewItem` (severity) | 3 |
| `src/app/page.tsx` | `home` | 14 |
| `src/app/daily/page.tsx` | `daily` | 4 |
| `src/components/input/DailyContextForm.tsx` | `dailyContext` | 15 |
| `src/app/interview/page.tsx` | `interview` | 4 |
| `src/components/input/InterviewContextForm.tsx` | `interviewContext` | 17 |
| `src/components/input/SourceTextForm.tsx` | `sourceText` | 5 |
| `src/components/input/TranslationPanel.tsx` | `translation` | 7 |
| `src/app/review/page.tsx` | `review` | 10 |
| `src/components/review/ReviewItem.tsx` | `reviewItem` | 6 |
| `src/app/history/page.tsx` | `history` | 12 |
| `src/app/history/[id]/page.tsx` | `historyDetail` | 9 |
| `src/app/flashcard/generate/page.tsx` | `flashcardGenerate` | 10 |
| `src/app/flashcard/review/page.tsx` | `flashcardReview` | 10 |
| `src/components/flashcard/Flashcard3D.tsx` | `flashcard3d` | 8 |

> `/settings` and `/help` pages — these routes appear in the sidebar nav but do not currently have `page.tsx` files. They will be created as stubs; strings will be translated when the pages are implemented.

---

## 6. Data Model Changes

**None.** Locale preference is stored exclusively in `localStorage` (key: `writecraft-locale`). No database schema or API changes required.

*Traces to: OQ-03*

---

## 7. API / Contracts

**None.** The i18n feature is entirely frontend-side. No new API routes or server actions are needed.

---

## 8. Testing Strategy

### 8.1 Unit Tests (`vitest`)

| Test file | What it covers |
|-----------|----------------|
| `src/i18n/detect.test.ts` | `detectLocale()` with zh-CN, zh-TW, zh, en-US, en, empty |
| `src/contexts/LocaleContext.test.tsx` | Initial locale from localStorage, fallback to detect, `setLocale` writes localStorage, locale switch re-renders children |
| `src/i18n/config.test.ts` | LOCALES array completeness, LOCALE_STORAGE_KEY is non-empty |

### 8.2 Component Tests (`vitest` + React Testing Library)

| Test file | What it covers |
|-----------|----------------|
| `src/components/common/LanguageSwitcher.test.tsx` | Renders all locales, selecting zh-CN calls setLocale, aria attributes |
| `src/components/layout/Sidebar.test.tsx` | Nav labels render in en; render in zh-CN after locale switch |

### 8.3 Translation Completeness Test (`vitest`)

`src/i18n/completeness.test.ts` — reads both JSON files and asserts:
- Every key in `en.json` exists in `zh-CN.json` (no missing translations)
- No key exists in `zh-CN.json` that is not in `en.json` (no orphaned keys)

*Traces to: US-04 (fallback) — this test fails if a developer adds an English string but forgets to add the Chinese one.*

### 8.4 E2E Tests (Playwright)

| Scenario | Steps |
|----------|-------|
| Switch to zh-CN | Open app → click language switcher → select 中文 → assert sidebar nav labels change |
| Persist locale | Switch to zh-CN → navigate to /history → assert still in zh-CN |
| Persist across reload | Switch to zh-CN → reload tab → assert still in zh-CN |
| Auto-detect zh | Clear localStorage → mock navigator.language = 'zh-CN' → reload → assert zh-CN |
| Auto-detect en | Clear localStorage → mock navigator.language = 'en-US' → reload → assert en |
| Fallback for missing key | Temporarily remove a zh-CN key → assert English text shown (not key ID) |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Hydration mismatch** — SSR sends English HTML; client re-renders Chinese causing React warnings | Medium | Low | All affected pages already use `'use client'` (client-rendered), so SSR output is empty shell. Add `suppressHydrationWarning` to root `<html>` as belt-and-suspenders. |
| **Locale flash** — brief English visible before localStorage is read on zh-CN users | High | Low | Acceptable UX tradeoff for v1 (client-rendered app). Mitigation: inline `<script>` in `<head>` sets `data-locale` attribute before React mounts; CSS can hide/show based on attribute if needed later. |
| **Long Chinese strings break layouts** | Medium | Medium | Conduct layout smoke test in zh-CN after all strings are translated. Identify overflow issues and fix with `truncate` / flexible widths. |
| **next-intl version incompatibility** with Next.js 15 / React 19 | Low | High | Pin `next-intl` to a tested version at install time; check release notes. |
| **Incomplete zh-CN translation** shipping to prod | Medium | Medium | Translation completeness test (§8.3) blocks CI if any key is missing. |
| **aria-labels not translated** causes accessibility regression | Low | Medium | All aria-label strings are included in message files; code review checklist to verify. |

---

## 10. Implementation Phases

### Phase 1 — Foundation
1. Install `next-intl`.
2. Create `src/i18n/config.ts`.
3. Create `src/i18n/detect.ts`.
4. Create `messages/en.json` with all ~130 keys (English strings only).
5. Create `messages/zh-CN.json` with full Chinese translations.
6. Create `src/contexts/LocaleContext.tsx`.
7. Wrap `src/app/layout.tsx` with `<LocaleProvider>`.

### Phase 2 — Language Switcher
8. Create `src/components/common/LanguageSwitcher.tsx`.
9. Add `<LanguageSwitcher>` to `Sidebar` footer.
10. Verify switching works end-to-end (English ↔ Chinese in nav).

### Phase 3 — Translate All Strings
Translate in order: shared components first, then pages.

11. `Sidebar`, `SceneCard`, `ProgressStepper`, `SceneBadge`, `IssueBadge`
12. `src/app/page.tsx` (Dashboard/Homepage)
13. Daily flow: `daily/page.tsx`, `DailyContextForm`, `SourceTextForm`, `TranslationPanel`
14. Interview flow: `interview/page.tsx`, `InterviewContextForm`
15. Review flow: `review/page.tsx`, `ReviewItem`
16. History flow: `history/page.tsx`, `history/[id]/page.tsx`
17. Flashcard flow: `flashcard/generate/page.tsx`, `flashcard/review/page.tsx`, `Flashcard3D`

### Phase 4 — Quality & Polish
18. Add translation completeness test.
19. Run layout smoke test in zh-CN; fix any overflow issues.
20. Add E2E tests.
21. Add inline anti-flash script to `layout.tsx`.

---

## 11. Traceability Matrix

| Spec Requirement | Plan Item |
|-----------------|-----------|
| US-01 (language switcher, no reload) | `LocaleContext` state update; `LanguageSwitcher` component; Phase 2 |
| US-01 (persist across navigation) | `localStorage` write in `setLocale()`; Phase 1 §4.3 |
| US-01 (persist across browser sessions) | `localStorage` read on mount; Phase 1 §4.3 |
| US-02 (translated sidebar nav) | Phase 3, step 11 |
| US-03 (translated page content) | Phase 3, steps 12–17 |
| US-04 (fallback for missing keys) | next-intl built-in fallback + completeness test; Phase 4 step 18 |
| US-05 (auto-detect Accept-Language) | `detect.ts`; Phase 1 §4.2 |
| NFR-01 (<200 ms switch) | Client state update — no network call; messages pre-loaded on mount |
| NFR-02 (lazy-load locale files) | Dynamic `import()` in `LocaleContext` on locale change |
| NFR-03 (externalized strings) | All strings in `messages/*.json`; Phase 3 removes all inline literals |
| NFR-04 (Next.js 15 App Router) | Client-only `LocaleProvider` pattern; no middleware required |
| OQ-01 (auto-detect) | `detect.ts` reads `navigator.language` |
| OQ-02 (sidebar footer) | `LanguageSwitcher` placed in `Sidebar` footer |
| OQ-03 (localStorage) | `LOCALE_STORAGE_KEY` in config; read/write in `LocaleContext` |
| OQ-04 (/settings, /help in scope) | Stub pages with i18n wiring; strings added when pages are built |
| OQ-05 (zh-TW future) | `LOCALES` array + per-file messages structure; adding zh-TW = new JSON file only |
