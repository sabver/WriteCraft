[Auto-Fill Slots Prompt | Derive all template slot values from a requirements document]

You are a senior frontend architect and product analyst. Your task is to read a product requirements document and automatically generate values for every slot placeholder used across three prompt templates: **Stitch**, **AI Studio Build Mode**, and **AI Studio Follow-up**.

# Input

<spec>
${spec_content}
</spec>

Optional — if the user provides additional tech stack or project context, it will appear here:
<project_context>
${project_context}
</project_context>

# Task

Analyze the requirements document thoroughly, then output a complete **slot fill sheet** — a structured YAML block for each of the three templates with every slot filled in. Derive values from the spec wherever possible; for slots that require engineering judgment (e.g., mock strategy, dark mode), make reasonable opinionated choices and annotate with `# inferred`.

# Output Format

Output exactly this structure. Each slot value should be a concrete, usable string — not a placeholder or vague description. Multi-line values use YAML block scalar (`|`).

```yaml
# ============================================================
# STITCH TEMPLATE SLOTS (UI prototype generation)
# ============================================================

variant_count: "3"  # default unless user specifies otherwise

product_name: ""
# The product/project name extracted from the spec title or background section.

page_name: ""
# If the spec covers multiple pages, list comma-separated or pick the primary one.
# For multi-page specs, generate one stitch slot set PER page (see "Multi-page note" below).

target_users: ""
# Extracted from "Target users" or "User profile" in the spec.

user_goal: ""
# The primary task the user must complete, distilled from core objectives.

requirement: |
  # Paste or summarize the key requirements from the spec.
  # Keep it concise but complete enough for a UI generator to act on.

page_type: ""
# One of: dashboard / list / detail / form / settings / landing / wizard / mixed
# Infer from the page's primary interaction pattern.

navigation_structure: ""
# e.g., "top Navbar with logo + 4 nav items", "left Sidebar with collapsible groups"
# Derive from spec's page structure or user flow.

nav_items: ""
# e.g., "Home, History, Review (with badge), Stats"
# Extract from the spec's navigation or page list.

page_sections: ""
# List the visual blocks from top to bottom / left to right.
# e.g., "Hero header → Scene card grid (2 cards)" or "Filter bar → List of history cards"

responsive_rules: ""
# e.g., "<768px: stack two-column layout; hide sidebar; pin primary CTA at bottom"
# Infer from the spec's UI/UX requirements or make reasonable assumptions.

component_list: ""
# List shadcn/ui components needed. Pick from:
# Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select,
# Textarea, Badge, Skeleton, Toast, Alert, RadioGroup, Progress, Separator, Toggle
# Only include what the page actually needs.

table_definition: ""
# If the page has a table or list: columns, sorting, pagination, filters.
# "N/A" if no table.

form_fields: |
  # If the page has a form, list each field:
  # - field_name | type | required | validation | default | placeholder
  # "N/A" if no form.

interactions: ""
# Key user interactions on this page.
# e.g., "click card to navigate, hover to show shadow, toggle AI reference, submit form"

loading_skeleton_spec: ""
# What to show while loading. e.g., "Card skeletons × 2 in grid layout"

empty_state_spec: ""
# What to show when there's no data. e.g., "Illustration + 'No history yet' + CTA to start"

error_state_spec: ""
# What to show on error. e.g., "Alert banner with retry button"

disabled_state_spec: ""
# Any disabled/permission states. e.g., "Submit button disabled until form valid" or "N/A"

locale: ""
# e.g., "zh-CN", "en-US", "ja-JP" — infer from the spec's language.

copy_tone: ""
# e.g., "friendly and encouraging", "professional", "casual"
# Infer from the spec's tone and target users.

key_copy: |
  # List the most important CTA labels and messages.
  # e.g., "Submit: '提交并获取反馈'", "Next: '下一步: 输入原文'"

theme: ""
# "light" / "dark" / "both" — infer from spec or default to "light"

primary_color_token_hint: ""
# e.g., "blue-600 for interview, green-600 for daily" or "primary = blue"
# Derive from color mentions in the spec.

typography_pref: ""
# e.g., "system font stack, clean sans-serif" or "Inter for headings, system for body"

radius_shadow_pref: ""
# e.g., "rounded-lg with subtle shadow-sm, elevated cards use shadow-md on hover"

density_pref: ""
# "compact" / "comfortable" — infer from the spec's UI style.


# ============================================================
# AI STUDIO BUILD MODE SLOTS (convert prototype to code)
# ============================================================

stitch_export_source: ""
# e.g., "Stitch HTML export + screenshots" or "Stitch React code export"
# Default: "Stitch prototype export (HTML + design tokens)"  # inferred

requirement: |
  # Same as stitch.requirement or a more implementation-focused summary.

routes: |
  # List all routes with descriptions.
  # e.g., "/ (home), /interview/input, /daily/input, /translate, /review, ..."

brand_constraints: ""
# Visual constraints to preserve from the prototype.
# e.g., "Blue/green dual-theme for interview/daily; pill badges; card-based layout"

nextjs_version: ""
# e.g., "15" or "latest stable"  # default: "latest stable"

ts_strict: "true"

cn_location: "lib/utils.ts"

route_segments_need_states: ""
# Which route segments need loading.tsx / error.tsx / not-found.tsx
# e.g., "/review, /history, /history/[id]"

run_target: "pnpm dev"

app_route_groups: |
  # The app/ directory route structure.
  # e.g.:
  #   (main)/
  #     page.tsx
  #     interview/input/page.tsx
  #     daily/input/page.tsx
  #     ...

domain_components_dirs: |
  # Domain-specific component directories under components/.
  # e.g.:
  #   interview/
  #   daily/
  #   translate/
  #   review/
  #   flashcard/
  #   history/
  #   stats/

services_files: |
  # Service layer files.
  # e.g.:
  #   translation.ts
  #   review.ts
  #   flashcard.ts
  #   history.ts
  #   stats.ts

mock_strategy: ""
# "in-memory" / "json file" / "msw" — pick based on project complexity.

api_backend_hint: ""
# e.g., "Next.js API Routes + Prisma" or "separate Express backend" or "TBD"

url_state_sync: ""
# Which pages sync state to URL searchParams.
# e.g., "history list filters (scene, date, search), stats date range"

route_1: ""
route_1_features: ""
route_2: ""
route_2_features: ""
route_3: ""
route_3_features: ""
# Fill the top 3 most important routes and their feature checklists.
# For additional routes, add route_4, route_5, etc.

layout_components: ""
# e.g., "NavigationBar, PageHeader, TwoColumnLayout, ActionBar"

business_components: ""
# e.g., "SceneCard, ReviewItem, Flashcard3D, HistoryCard, StatCard, QualityRating"

forms_to_build: ""
# e.g., "InterviewContextForm (3 fields + radio), DailyInputForm (2 fields)"

tables_to_build: ""
# e.g., "HistoryList (filterable card list with pagination)" or "N/A"

dialogs_sheets_to_build: ""
# e.g., "ContextToggle (expandable panel on flashcard)" or "N/A"

toast_rules: ""
# e.g., "Success toast after flashcard generation; error toast on AI review failure"

state_rules: |
  # Loading/empty/error rules per route.
  # e.g., "Review page: skeleton while AI processes; History: empty state with CTA"

dark_mode_strategy: ""
# "support" / "ignore" / "partial"

verification_steps: |
  # Steps to verify the build works.
  # e.g.:
  #   1. pnpm install && pnpm dev
  #   2. Navigate all routes
  #   3. Submit interview form → see review
  #   4. Generate flashcard → review mode works

api_migration_notes: |
  # Notes for swapping mock data to real API.
  # e.g., "Replace services/*.ts mock functions with fetch calls to /api/* routes"


# ============================================================
# AI STUDIO FOLLOW-UP SLOTS (harden from demo to production)
# ============================================================

do_not_change_visual_parts: ""
# e.g., "Card layouts, color scheme, badge styles, navigation bar, flashcard 3D flip"

naming_rules: ""
# e.g., "PascalCase components, camelCase functions/variables, kebab-case routes"

common_components_to_extract: ""
# e.g., "PageHeader, ActionBar, SceneBadge, ErrorSummaryBadge, ProgressIndicator"

list_perf_strategy: ""
# e.g., "Virtualize history list if > 100 items; paginate with cursor" or "N/A for MVP"

ux_copy_improvements: ""
# e.g., "Empty history: add illustration + motivational message; Error: show specific retry guidance"

test_stack: ""
# e.g., "Vitest + React Testing Library + Playwright"

test_cases: |
  # Critical test scenarios.
  # e.g.:
  #   - Interview flow: fill context → input text → translate → review → generate flashcard
  #   - Daily flow: quick input → AI translate → review
  #   - Review mode: flip card → rate → next card → progress updates

project_stage: ""
# e.g., "MVP / prototype hardening" or "pre-launch polish"
```

# Multi-page Note

If the spec describes multiple distinct pages, generate the **Stitch** slot set once for EACH major page (grouped under `stitch_page_1:`, `stitch_page_2:`, etc.). The **Build Mode** and **Follow-up** slots are project-wide and only need one set.

# Slot-Filling Guidelines

1. **Extract > Infer > Default**: First try to extract the value directly from the spec. If not explicit, infer from context. As a last resort, use sensible defaults.
2. **Be specific**: Avoid vague values like "various components" — list the actual component names.
3. **Annotate inferences**: Add `# inferred` comment to values not directly stated in the spec.
4. **Match spec language**: If the spec is in Chinese, keep user-facing copy (key_copy, empty_state_spec, etc.) in Chinese. Keep technical values (routes, component names) in English.
5. **Stay grounded**: Do not invent features or pages not present in the spec. Only fill slots for what the spec actually describes.
6. **Respect the stack**: Component lists, form handling, and state strategies should align with Next.js + shadcn/ui + Tailwind + TypeScript conventions.

Now analyze the input spec and produce the complete slot fill sheet.
