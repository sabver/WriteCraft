# Tasks 005 - Frontend Light and Dark Mode

**Plan:** `specs/005-light-dark-mode/plan.md`  
**Status:** Ready for implementation

Legend:
- `[P]` = can run in parallel with other `[P]` tasks at the same level
- **TEST FIRST** = write tests (RED) before implementation (GREEN)

---

## Phase 0 - Clarifications Baseline

### T00 - Lock assumptions in spec/plan
**Goal:** Keep implementation consistent with current assumptions until product decisions are finalized.  
**Files touched:** `specs/005-light-dark-mode/spec.md`, `specs/005-light-dark-mode/plan.md`  
**Validate:**
```bash
pnpm run lint
```
**Done when:** assumptions for default mode, switcher placement, and option set are explicitly recorded and not contradictory.

---

## Phase 1 - Foundation (Theme Engine + Controls)

### T01 - **TEST FIRST** - Theme switcher component behavior
**Goal:** Define expected render and interaction behavior of theme control before implementation.  
**Files touched (new):** `src/components/common/ThemeSwitcher.test.tsx`  
**Assertions:**
1. Renders accessible label for theme control.
2. Renders options for Light and Dark.
3. Reflects current active theme.
4. Clicking Light/Dark triggers theme update callback.
**Validate:**
```bash
pnpm test -- src/components/common/ThemeSwitcher.test.tsx
# Expected: FAIL (RED)
```

---

### T02 - Implement `ThemeSwitcher`
**Goal:** Add compact theme switcher for global UI theme selection.  
**Files touched (new):** `src/components/common/ThemeSwitcher.tsx`  
**Files touched (update):** `messages/en.json`, `messages/zh-CN.json` (add `themeSwitcher` namespace)  
**Validate:**
```bash
pnpm test -- src/components/common/ThemeSwitcher.test.tsx
pnpm run typecheck
pnpm run lint
```
**Done when:** tests pass and switcher labels are localized.

---

### T03 - **TEST FIRST** - Theme provider bootstrap + persistence
**Goal:** Define expected persistence/default behavior before wiring provider.  
**Files touched (new):** `src/contexts/ThemeContext.test.tsx`  
**Assertions:**
1. Saved `writecraft-theme=dark` restores dark.
2. Saved `writecraft-theme=light` restores light.
3. Invalid saved value falls back to baseline.
4. First-visit path follows system preference with light fallback.
**Validate:**
```bash
pnpm test -- src/contexts/ThemeContext.test.tsx
# Expected: FAIL (RED)
```

---

### T04 - Implement app theme provider and root wiring
**Goal:** Enable class-based theme at app root with persistence behavior.  
**Files touched (new):** `src/contexts/ThemeContext.tsx`  
**Files touched (update):** `src/app/layout.tsx`  
**Validate:**
```bash
pnpm test -- src/contexts/ThemeContext.test.tsx
pnpm run typecheck
pnpm run lint
```
**Done when:** provider is active globally and tests are green.

---

### T05 - Mount `ThemeSwitcher` in sidebar footer
**Goal:** Expose theme control in the global shell where users can reach it from any page.  
**Files touched:** `src/components/layout/Sidebar.tsx`  
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```
**Done when:** switcher is visible in sidebar footer and build remains green.

---

## Phase 2 - Styling Coverage (Light/Dark Surfaces)

### T06 - Introduce semantic global theme tokens
**Goal:** Establish consistent light/dark design tokens and base body/surface mapping.  
**Files touched:** `src/app/globals.css`  
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```
**Done when:** global tokens support both light and dark mode without visual regressions in shell.

---

### T07 - Update shared layout surfaces
**Goal:** Make shell-level reusable wrappers dark-safe before route-level work.  
**Files touched (expected):**
- `src/components/layout/MainLayout.tsx`
- `src/components/common/PageWrapper.tsx`
- `src/components/common/ActionBar.tsx`
- `src/components/common/SkeletonCard.tsx`
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T08 - Dashboard theming [P]
**Goal:** Ensure `/` route is visually correct in both themes.  
**Files touched:** `src/app/page.tsx`  
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T09 - Daily flow theming [P]
**Goal:** Ensure Daily route/forms are visually correct in both themes.  
**Files touched:**
- `src/app/daily/page.tsx`
- `src/components/input/DailyContextForm.tsx`
- `src/components/input/SourceTextForm.tsx`
- `src/components/input/TranslationPanel.tsx`
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T10 - Interview flow theming [P]
**Goal:** Ensure Interview route/forms are visually correct in both themes.  
**Files touched:**
- `src/app/interview/page.tsx`
- `src/components/input/InterviewContextForm.tsx`
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T11 - Review flow theming [P]
**Goal:** Ensure Review page and issue cards are visually correct in both themes.  
**Files touched:**
- `src/app/review/page.tsx`
- `src/components/review/ReviewItem.tsx`
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T12 - History flow theming [P]
**Goal:** Ensure History list/detail pages are visually correct in both themes.  
**Files touched:**
- `src/app/history/page.tsx`
- `src/app/history/[id]/page.tsx`
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

### T13 - Flashcard flow theming [P]
**Goal:** Ensure flashcard generate/review/3D surfaces are visually correct in both themes.  
**Files touched:**
- `src/app/flashcard/generate/page.tsx`
- `src/app/flashcard/review/page.tsx`
- `src/components/flashcard/Flashcard3D.tsx`
**Validate:**
```bash
pnpm run typecheck
pnpm run lint
```

---

## Phase 3 - Quality and Regression Safety

### T14 - **TEST FIRST** - Theme persistence integration test
**Goal:** Ensure theme remains stable across navigation and reload.  
**Files touched (new):** `src/app/theme-persistence.test.tsx` (or equivalent integration test file)  
**Validate:**
```bash
pnpm test -- src/app/theme-persistence.test.tsx
# Expected: FAIL (RED)
```

---

### T15 - Implement persistence integration test and pass it
**Goal:** Finalize integration test coverage for switch + persistence paths.  
**Files touched:** `src/app/theme-persistence.test.tsx`  
**Validate:**
```bash
pnpm test -- src/app/theme-persistence.test.tsx
pnpm run typecheck
```

---

### T16 - Manual visual QA checklist (light + dark)
**Goal:** Confirm no readability/contrast/overflow regressions across core routes.  
**Files touched:** fix files as needed from Phase 2  
**Checklist:**
- [ ] Sidebar and footer controls readable in both themes
- [ ] Cards and borders have adequate contrast
- [ ] Inputs/placeholders/buttons readable and interactive states visible
- [ ] Loading/empty/error states readable
- [ ] Flashcard 3D front/back readable
**Validate:**
```bash
pnpm run dev
```

---

### T17 - Full regression baseline
**Goal:** Ensure theming changes do not break existing flows.  
**Files touched:** none (run-only)  
**Validate:**
```bash
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run build
```
**Done when:** all commands pass.

---

### T18 - E2E theme journeys (optional but recommended)
**Goal:** Automate critical theme journeys.  
**Files touched (new):** `e2e/theme.spec.ts`  
**Cases:**
1. switch light <-> dark
2. persist across navigation
3. persist across reload
4. first-visit default behavior
**Validate:**
```bash
pnpm exec playwright test e2e/theme.spec.ts
```

---

## Summary Checklist

### Phase 0
- [ ] T00 - Lock assumptions in spec/plan

### Phase 1
- [ ] T01 - TEST FIRST ThemeSwitcher test
- [ ] T02 - Implement ThemeSwitcher
- [ ] T03 - TEST FIRST ThemeContext/provider test
- [ ] T04 - Implement theme provider + layout wiring
- [ ] T05 - Add ThemeSwitcher to Sidebar

### Phase 2
- [ ] T06 - Global theme tokens
- [ ] T07 - Shared layout surfaces
- [ ] T08 - Dashboard theming [P]
- [ ] T09 - Daily flow theming [P]
- [ ] T10 - Interview flow theming [P]
- [ ] T11 - Review flow theming [P]
- [ ] T12 - History flow theming [P]
- [ ] T13 - Flashcard flow theming [P]

### Phase 3
- [ ] T14 - TEST FIRST persistence integration test
- [ ] T15 - Make persistence integration test green
- [ ] T16 - Manual visual QA checklist
- [ ] T17 - Full regression baseline
- [ ] T18 - E2E theme journeys (optional)
