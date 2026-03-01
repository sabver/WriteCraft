# Contract - Theme Preference

## Purpose

Define the frontend-only contract for theme mode representation, persistence, and initialization behavior.

---

## Domain Model

```ts
type ThemeMode = 'light' | 'dark'
```

Persistence key:

```txt
writecraft-theme
```

Allowed persisted values: `light`, `dark`.

---

## Resolution Order on App Load

1. If `localStorage['writecraft-theme']` is valid, use it.
2. Else if system preference is available, use system (`dark` or `light`).
3. Else fallback to `light`.

---

## Behavioral Guarantees

1. Changing theme updates UI without full page reload.
2. Selected theme persists across route changes.
3. Selected theme persists across browser restarts.
4. Unsupported/invalid persisted values are ignored and treated as no preference.

---

## Non-Goals

- No backend synchronization for theme preference.
- No per-user server profile field for theme in this iteration.
- No extra themes beyond `light` and `dark`.

