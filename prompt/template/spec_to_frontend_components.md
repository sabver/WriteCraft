[Spec → Frontend Components Prompt | Requirements Doc → Frontend Component Breakdown]

You are a senior frontend architect who specializes in breaking down product requirements documents into frontend component specifications that developers can directly implement from.

# Input

You will receive a product requirements document (spec.md) containing project background, feature modules, user flows, and UI/UX requirements.

<spec>
${spec_content}
</spec>

# Task

Transform the above requirements document into a **frontend component breakdown document** that frontend developers can directly reference for implementation.

# Output Format Requirements

## Overall Structure

1. **Document title**: `# {Product Name} - Frontend Component Breakdown`
2. **Table of contents**: List global components and all pages with anchor links
3. **Global components**: Components reused across pages (navigation bar, layout containers, etc.)
4. **Page-by-page sections**: Each page as an independent section

## Page Section Format

Each page must include the following:

### a) Page Meta Information
- **Route**: Explicit URL path (e.g., `/`, `/interview/input`, `/history/:id`)
- Route naming follows RESTful conventions, using lowercase English and hyphens

### b) Component Tree Structure
Use an ASCII tree diagram to show the complete component hierarchy for the page:
```
PageName
├── ComponentA
│   ├── SubComponentA1
│   └── SubComponentA2
└── ComponentB
    └── SubComponentB1
```

Requirements:
- The tree diagram should reflect the actual DOM nesting relationships
- Leaf nodes should be annotated with specific content (e.g., `Button: "Submit"`)
- Repeated components should be marked with `× N` (e.g., `ListItem × N`)
- Components reused from other pages should note their source (e.g., `ReviewItemList (reused from AIReviewPage)`)

### c) Component-by-Component Details

For each non-atomic component in the tree, provide:

#### Component Structure (if it has child components)
```
ComponentName
├── ChildA
└── ChildB
```

#### Component Description
Use an unordered list to describe the following dimensions (select as needed, not all are required):

- **Visual appearance**: Background color, border radius, shadow, border, font size, color, spacing
- **Layout**: Horizontal/vertical arrangement, grid, two-column, center alignment, etc.
- **Interaction behavior**: Click, hover, expand/collapse, flip, toggle, etc.
- **State changes**: Selected state, active state, disabled state, focus state
- **Animation effects**: Transitions, 3D flip, gradients, etc. (if applicable)
- **Responsive design**: Layout differences between desktop and mobile (if applicable)

#### Content Data (if specific copy exists)
List the specific copy, labels, placeholders, options, etc. within the component. Format:
- Title: "xxx"
- Description: "xxx"
- Placeholder: "xxx"
- Options: [Option1, Option2, ...]

## Component Breakdown Principles

1. **Derive pages from user flows**: Each step in user flows from the requirements document maps to one or more pages
2. **Derive components from features**: Each feature maps to specific UI components
3. **Identify reusable components**: Extract identical UI patterns that appear across pages into standalone components
4. **Appropriate depth**: Component trees are typically 3-5 levels deep; avoid excessive nesting
5. **Naming conventions**: Use PascalCase; names should reflect the component's responsibility with bilingual annotation (e.g., `FilterBar (Search Filters)`)
6. **Distinguish containers from presentational components**: Container components handle layout and data flow; presentational components handle rendering

## Visual Specification Derivation

Based on UI/UX requirements in the requirements document, derive and unify the following visual specifications:

- **Color coding**: Assign consistent colors for different categories/states (e.g., error types, scene types)
- **Card styles**: Unified base card styles (white background, border radius, shadow)
- **Badge styles**: Unified pill-shaped badges (different colors for different meanings)
- **Button hierarchy**: Consistent use of primary buttons (filled) vs secondary buttons (outlined)
- **Spacing and typography**: Font size hierarchy for headings/body/helper text

## Important Notes

- Do not write any code; only describe component structure, appearance, and behavior
- Do not define props interfaces or data types; those belong to the technical implementation layer
- Descriptions should be specific enough for designers to create high-fidelity mockups and for developers to code directly
- If the requirements document is ambiguous, make reasonable assumptions and reflect them in the descriptions
- Focus on **visual presentation** and **user interaction**, not data flow and state management
- Provide concrete example copy for every text element; do not leave blanks
- For list/repeating components, provide at least one set of example data

# Example Snippet

Below is a reference format for a component description:

---

## Page X: Example Page

**Route**: `/example`

### Component Tree Structure
```
ExamplePage
├── PageHeader
│   ├── Title
│   └── Subtitle
└── ContentCard
    ├── CardHeader
    └── ItemList
        └── Item × N
```

### PageHeader

**Component Description**:
- Displays a page title and subtitle
- Title is large bold text; subtitle is smaller gray text
- Center-aligned overall
- Title content: "Example Title"
- Subtitle content: "This is the subtitle description text"

### ContentCard

**Component Structure**:
```
ContentCard
├── CardHeader
│   ├── Title: "Content Title"
│   └── ActionButton
└── ItemList
    └── Item × N
```

**Component Description**:
- White background card with border radius and shadow
- CardHeader displays title on the left and action button on the right
- ItemList arranges all items vertically with dividers between items
- Shadow deepens on hover

---

Now generate the complete frontend component breakdown document based on the input requirements document.
