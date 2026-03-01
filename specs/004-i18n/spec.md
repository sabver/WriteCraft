# Spec 004 — Frontend Internationalization (i18n)

## Status: Approved (ready for planning)

---

## 1. Problem Statement

WriteCraft's entire UI is hard-coded in English. Users whose native language is not English (the primary target audience being Chinese speakers learning English) cannot fully understand navigation labels, instructions, error messages, and other UI copy.

Adding i18n support allows the UI shell to be presented in the user's preferred language (starting with Chinese Simplified) while keeping English as the fallback / default language, thereby lowering the barrier to entry for new learners.

---

## 2. Goals

- Allow users to switch the UI display language between **English (en)** and **Chinese Simplified (zh-CN)** without a page reload.
- All user-visible static strings in the frontend must be translated (navigation, labels, placeholders, buttons, empty states, error messages).
- The selected language must persist across page navigations and browser sessions.
- The app's core learning content (user-generated text, AI-generated translations/feedback) is **not** translated by this feature — only the surrounding UI chrome.

---

## 3. User Stories & Acceptance Criteria

### US-01 — Language Switcher
**As a** learner,
**I want** to switch the app language between English and Chinese,
**So that** I can navigate and understand the UI in my preferred language.

#### Acceptance Criteria
- **Given** I am on any page of the app,
  **When** I open the language switcher,
  **Then** I see at least two options: "English" and "中文 (简体)".
- **Given** I select "中文 (简体)",
  **When** the selection is confirmed,
  **Then** all UI labels, navigation items, buttons, and placeholders switch to Chinese within the same page view (no full reload required).
- **Given** I switch language and then navigate to a different page,
  **When** the new page loads,
  **Then** the UI is still displayed in the language I selected.
- **Given** I close and reopen the browser,
  **When** I return to the app,
  **Then** the UI is displayed in the language I last selected.

---

### US-02 — Translated Navigation
**As a** Chinese-speaking learner,
**I want** the sidebar navigation labels to appear in Chinese,
**So that** I can orient myself without needing to know the English terms.

#### Acceptance Criteria
- **Given** the locale is set to zh-CN,
  **When** the sidebar renders,
  **Then** all nav items (Dashboard, History, Review, Flashcards, Settings, Help & Support) display their Chinese equivalents.

---

### US-03 — Translated Page Content
**As a** Chinese-speaking learner,
**I want** page headings, section labels, button text, placeholder text, and empty-state messages to appear in Chinese,
**So that** I can operate every part of the app in my native language.

#### Acceptance Criteria
- **Given** the locale is zh-CN,
  **When** I visit the Dashboard, Daily Practice, Interview Practice, History, Review, or Flashcard pages,
  **Then** all static UI strings on those pages are in Chinese.
- **Given** the locale is zh-CN and AI feedback / user-typed text is present,
  **When** the page renders,
  **Then** AI-generated or user-entered content is **not** automatically translated (only the UI chrome changes).

---

### US-04 — Fallback for Missing Translations
**As a** developer,
**I want** missing translation keys to fall back to English,
**So that** partially-translated pages never show raw translation keys to users.

#### Acceptance Criteria
- **Given** a translation key exists in English but not yet in Chinese,
  **When** the locale is zh-CN,
  **Then** the English string is displayed (not the key ID or an empty string).

---

### US-05 — Default Language on First Visit
**As a** new user,
**I want** the app to detect or default to a sensible language on first visit,
**So that** I don't have to configure anything before getting started.

#### Acceptance Criteria
- **Given** I am visiting the app for the first time with no stored preference,
  **When** the app loads,
  **Then** the app reads the browser's `Accept-Language` header: if the primary language is `zh` (any variant), the locale defaults to **zh-CN**; otherwise it defaults to **en**.
- **Given** I have no stored preference and my browser language is `zh-TW`,
  **When** the app loads,
  **Then** the locale defaults to **zh-CN** (closest supported match).

---

## 4. Non-Functional Requirements

| # | Requirement |
|---|-------------|
| NFR-01 | Language switching must complete within **200 ms** (no full-page navigation). |
| NFR-02 | Translation files must be **lazy-loaded** per locale to minimise initial bundle size. |
| NFR-03 | All translation strings must be externalized into locale files (no inline hard-coded UI strings). |
| NFR-04 | The solution must be compatible with **Next.js 15 App Router** (including Server Components). |
| NFR-05 | RTL layout support is **out of scope** for this iteration. |
| NFR-06 | Date/number formatting using the selected locale is **out of scope** for this iteration. |

---

## 5. Scope

### In Scope
- Language switcher UI component placed in the **sidebar footer**.
- Translation of all static UI strings across existing pages:
  Sidebar, Dashboard, Daily Practice, Interview Practice, History, Review, Flashcard (generate + review), Settings (`/settings`), Help (`/help`).
- Persisting locale preference in **`localStorage`**.
- Auto-detecting locale from `Accept-Language` on first visit (zh-* → zh-CN, else en).
- English (en) and Chinese Simplified (zh-CN) locale files.
- Architecture must accommodate a future **zh-TW** locale without structural changes.

### Out of Scope
- Translation of AI-generated content or user-authored text.
- Right-to-left (RTL) language support.
- Locale-aware date/time/number formatting.
- Additional languages beyond en + zh-CN.
- Back-end / API error message translation.
- SEO / `hreflang` meta tags.

---

## 6. Decisions Log

| # | Question | Decision |
|---|----------|----------|
| OQ-01 | First-visit default language | Auto-detect from `Accept-Language`; zh-* → zh-CN, else en |
| OQ-02 | Language switcher placement | Sidebar footer |
| OQ-03 | Locale persistence | `localStorage` |
| OQ-04 | Pages in scope | All current pages + `/settings` + `/help` |
| OQ-05 | zh-TW future support | Yes — locale file structure must support zh-TW as a future variant |

---

## 7. Clarification Checklist

- [x] OQ-01: First-visit default language strategy confirmed
- [x] OQ-02: Language switcher placement approved
- [x] OQ-03: Locale persistence mechanism decided (localStorage)
- [x] OQ-04: Full list of pages/routes confirmed (includes /settings and /help)
- [x] OQ-05: zh-TW roadmap decision captured (future-proof structure required)
