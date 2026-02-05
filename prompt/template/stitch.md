[Stitch Prompt Template | Aligned to Next.js + shadcn/ui + Tailwind + TypeScript]

You are a UI design generator whose output must be easy to convert into a working Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui implementation.
Create a high-fidelity Web UI prototype based on the inputs below, and produce at least ${variant_count} distinct variants.

# 1) Product & page goal
- Product / Project name: ${product_name}
- Page / Feature name: ${page_name}
- Target users: ${target_users}
- Primary user goal (what task must be completed): ${user_goal}
- Requirements (you may paste PRD / user stories): ${requirement}

# 2) Information architecture & layout
- Page type: ${page_type}  // e.g., dashboard / list / detail / form / settings
- Navigation structure: ${navigation_structure}
  // e.g., left Sidebar with ${nav_items}, top Topbar with search/user menu/notifications
- Page sections (list the blocks from top-to-bottom / left-to-right): ${page_sections}
- Responsive rules: ${responsive_rules}
  // e.g., <768px: collapse Sidebar into Sheet; table becomes card list; pin primary CTA at bottom

# 3) Data & component requirements (prefer shadcn/ui semantics)
- Primary component list (prefer shadcn/ui naming): ${component_list}
  // Suggested: Button, Card, Table, Tabs, Dialog, Sheet, DropdownMenu, Form, Input, Select, Badge, Skeleton, Toast, Alert
- Table/List definition (if applicable): ${table_definition}
  // e.g., columns (name,email,role,status,last_login), sorting/pagination/filters
- Form fields (if applicable): ${form_fields}
  // e.g., field name, type, required, validation, default, helper text
- Key interactions: ${interactions}
  // e.g., create/edit dialog, delete confirm, row click to detail, filters synced to URL

# 4) State design (must include)
- Loading state (Skeleton coverage): ${loading_skeleton_spec}
- Empty state: ${empty_state_spec}
- Error state: ${error_state_spec}
- Disabled / permission states (if any): ${disabled_state_spec}

# 5) Copy & localization
- Locale: ${locale}  // en-US/ja-JP/zh-CN
- Tone of voice: ${copy_tone}
- Key CTA labels & messages: ${key_copy}

# 6) Visual system constraints (Tailwind + shadcn tokens)
- Theme: ${theme}  // light/dark/both
- Primary color token hint (prefer token semantics over hex): ${primary_color_token_hint}
- Typography preference: ${typography_pref}
- Radius & shadow preference: ${radius_shadow_pref}
- Spacing density: ${density_pref}  // compact/comfortable

# 7) Output requirements
- Produce ${variant_count} variants and explain the differences (layout / density / component choices / interactions)
- Each variant must be editable and have clear component semantics (to ease shadcn/ui conversion)
- Must include (when applicable): Sidebar/Topbar, main content area, primary CTA, and all states (loading/empty/error)
- Avoid custom controls that are hard to componentize; prefer standard components composed together

Start generating the UI prototype and variants now.
