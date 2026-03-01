# Plan 005 - Frontend Light and Dark Mode

**Spec:** `specs/005-light-dark-mode/spec.md`  
**Status:** Assumptions locked for implementation

---

## 1. Architecture Overview

### Approach: Global Class-Based Theming with `next-themes`

Use a single app-level theme source of truth and apply theme via the root HTML class (`light` / `dark`). This aligns with:
- Next.js App Router client/server boundaries
- Existing Tailwind usage (`dark:` variants already present in many shared UI components)
- Existing dependency footprint (`next-themes` is already installed)

### Current State (Baseline)

- No global `ThemeProvider` is wired in app layout.
- `src/app/globals.css` sets a fixed light background on `body`.
- Many custom app pages/components use hard-coded light classes (`bg-white`, `text-slate-*`, `border-slate-*`) without dark variants.
- `src/components/ui/sonner.tsx` already imports `useTheme` and will benefit from a real provider.

### Target State

1. Root app wraps UI with a client `ThemeProvider`.
2. Theme value is persisted and restored automatically.
3. A dedicated theme switcher is exposed in app chrome (sidebar footer) for immediate switching.
4. Core page surfaces and state UIs (loading/empty/error) become theme-aware.
5. Theme remains consistent across route navigation and reload.

---

## 2. Assumptions for This Implementation Cycle

These assumptions are locked for the current implementation cycle and aligned with `spec.md`:

1. First visit defaults to **system preference**, with **light fallback** if unavailable.
2. Theme control offers **Light** and **Dark** only (no explicit System option in UI for this iteration).
3. Theme switcher is placed in the **sidebar footer**, near existing global controls.
4. Minor theme flash is minimized via provider bootstrapping strategy and acceptable within NFR-04.
5. Mandatory route scope for implementation/testing is current core routes:
   `/`, `/daily`, `/interview`, `/review`, `/history`, `/history/[id]`, `/flashcard/generate`, `/flashcard/review`.

If product decisions change in a future cycle, this plan remains valid with small adjustments in Phase 1.

---

## 3. Data Model Changes

No database schema changes.

Client-side persisted preference only:
- Storage key: `writecraft-theme`
- Values: `'light' | 'dark'`

---

## 4. API / Contracts

No backend/API contract changes are required.

Internal frontend contract file:
- `specs/005-light-dark-mode/contracts/theme-preference.md`

This contract defines:
- Allowed theme values
- Persistence behavior
- First-load resolution order
- UI/state expectations

---

## 5. File Structure Plan

### New files

- `src/components/common/ThemeSwitcher.tsx`
- `src/contexts/ThemeContext.test.tsx` (if using app-owned wrapper over library behavior)
- `specs/005-light-dark-mode/contracts/theme-preference.md`

### Modified files (expected)

- `src/app/layout.tsx` (wire theme provider)
- `src/app/globals.css` (theme tokens + base surface rules)
- `src/components/layout/Sidebar.tsx` (render theme switcher)
- Core route files and key shared components for dark-safe class updates:
  - `src/app/page.tsx`
  - `src/app/daily/page.tsx`
  - `src/app/interview/page.tsx`
  - `src/app/review/page.tsx`
  - `src/app/history/page.tsx`
  - `src/app/history/[id]/page.tsx`
  - `src/app/flashcard/generate/page.tsx`
  - `src/app/flashcard/review/page.tsx`
  - `src/components/flashcard/Flashcard3D.tsx`
  - Other shared wrappers used by these pages (`MainLayout`, cards, bars) as needed

---

## 6. Implementation Design

### 6.1 Theme Provider Layer

- Introduce app-level provider using `next-themes` configured for class strategy.
- Preserve hydration safety settings (`suppressHydrationWarning` is already present).
- Ensure provider is mounted above all page content and global UI.

### 6.2 Theme State + Persistence

- Persist explicit user choice under `writecraft-theme`.
- On app load:
  1. Restore persisted theme if present.
  2. Otherwise use system preference.
  3. Fallback to light if environment cannot report preference.

### 6.3 Theme Switcher UX

- Compact toggle/select control in sidebar footer.
- Reflect current selection visually.
- Switching should immediately update UI with no route reload.
- Keep labels i18n-ready (compatible with existing locale setup).

### 6.4 Styling Strategy

Use two complementary layers:

1. **Global semantic tokens in CSS** for app background/text/surface/border.
2. **Component-level `dark:` variants** for remaining hard-coded utility classes.

Priority coverage:
- Layout shell (body/sidebar/main backgrounds)
- Primary cards/panels
- Typography hierarchy
- Inputs/buttons/badges
- Loading/empty/error states

---

## 7. Testing Strategy

### 7.1 Unit / Component

- Theme switcher renders current state and triggers update on interaction.
- Persistence behavior:
  - Saved dark -> dark on reload
  - Saved light -> light on reload
- First-visit behavior follows assumption (system/fallback).

### 7.2 Integration (App-level)

- Navigate across all core routes after switching theme; verify theme remains stable.
- Verify no functional regressions in i18n/flashcard/review flows after theme classes are introduced.

### 7.3 Manual Visual QA Checklist

- Sidebar readability in both themes
- Card surfaces and border contrast
- Form fields and placeholders
- CTA buttons and hover/focus states
- Loading skeletons and empty/error states
- Flashcard 3D front/back readability

### 7.4 Optional E2E (recommended)

- `switch-theme`
- `persist-theme-across-navigation`
- `persist-theme-across-reload`
- `default-theme-on-first-visit`

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Hydration mismatch due to client-only theme resolution | High | Use provider-supported no-flash/hydration-safe config; avoid reading `window` directly in render paths. |
| Incomplete dark coverage from hard-coded light classes | High | Route-by-route checklist + visual QA + focused refactor of shared surfaces first. |
| Contrast regressions in secondary text/badges | Medium | Define semantic token palette before per-component tweaks; verify both normal and interactive states. |
| Theme and locale controls interfering in sidebar footer | Low | Keep controls independent; test interaction order and persistence for both states. |
| Unclear product decisions (System option, route scope) causing rework | Medium | Track assumptions explicitly; isolate switcher logic so option expansion is low cost. |

---

## 9. Implementation Phases

### Phase 1 - Foundation
1. Add root theme provider wiring.
2. Define global semantic theme tokens in `globals.css`.
3. Create theme switcher component and mount in sidebar footer.

### Phase 2 - Core Route Coverage
4. Update shell and shared UI surfaces for dark-safe styles.
5. Update each core route page/components for consistent dark appearance.

### Phase 3 - Quality
6. Add tests for switch + persistence + first-load default behavior.
7. Execute visual QA checklist across all core routes.
8. Address remaining readability/contrast gaps.

---

## 10. Traceability Matrix

| Spec Requirement | Plan Coverage |
|---|---|
| US-01 Manual switching | Sections 6.1, 6.3; Phase 1 |
| US-02 Persistence | Sections 3, 6.2; Phase 1 + tests |
| US-03 First-visit default | Sections 2, 6.2; test in Phase 3 |
| US-04 Cross-route consistency | Sections 5, 6.4; Phase 2 + integration checks |
| US-05 Readability/contrast | Sections 6.4, 7.3, 8; Phase 2/3 |
| NFR-01 <200ms response | Client-side class toggle in 6.1/6.3 |
| NFR-02 No full reload | Provider + client state switching in 6.1/6.3 |
| NFR-03 Persistence across sessions | Storage model in Section 3 and behavior in 6.2 |
| NFR-04 Minimize incorrect-theme flash | Hydration-safe provider config in 6.1 + risk mitigation |
| NFR-05 No flow regression | Integration checks in 7.2 + phased rollout |
