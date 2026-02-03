# .claude/ Directory Customization Guide

When adapting this `.claude/` configuration for a new project, follow this guide. Ask the user each question group, then apply the corresponding changes.

---

## Step 1: Gather Project Info (Ask User)

### Q1: Tech Stack
- Framework? (Next.js / Nuxt / Remix / Vite+React / Astro / Other)
- UI component library? (shadcn/ui / Ant Design / MUI / Chakra / None)
- CSS approach? (Tailwind CSS / CSS Modules / styled-components / None)
- Language? (TypeScript / JavaScript)

### Q2: Backend
- Backend approach? (Next.js API Routes / Express / Fastify / Separate backend / Serverless)
- Database/ORM? (Prisma / Drizzle / Supabase / MongoDB / None yet)
- Auth provider? (NextAuth / Clerk / Supabase Auth / Custom JWT / None yet)

### Q3: Tooling
- Package manager? (pnpm / npm / yarn / bun)
- Testing framework? (Vitest / Jest / None yet)
- E2E testing? (Playwright / Cypress / None)
- Linting/formatting? (ESLint+Prettier / Biome / ESLint only)

### Q4: Deployment
- Deployment platform? (Vercel / Cloudflare / Railway / AWS / Docker / None yet)

### Q5: Domain-Specific
- Does the project involve blockchain/crypto? (Yes/No)
- Does the project need analytics DB (ClickHouse etc.)? (Yes/No)
- Any other domain-specific tech? (Describe)

---

## Step 2: Apply Changes

### 2.1 CLAUDE.md (Project Root)

Update the `Tech stack` section:

```markdown
## Tech stack
- [Framework] + [UI Library] + [CSS] + [Language]
- Package manager: [package manager]
- Testing: [test framework] + [e2e framework]
- Lint/format: [linter/formatter]
```

### 2.2 README.md (Project Root)

Update the title line to match tech stack:

```markdown
# [Project Name]

[Framework] + [UI Library] + [CSS] + [Language]
```

### 2.3 skills/frontend-patterns.md

| User Answer | Action |
|-------------|--------|
| **shadcn/ui** | Keep cn(), cva, component composition patterns. Update examples to match project domain |
| **MUI / Ant Design** | Replace shadcn/ui imports with MUI/Antd. Remove cn()/cva patterns. Add library-specific theming patterns |
| **No UI library** | Remove component library sections. Keep raw React component patterns |
| **Next.js** | Keep App Router, Server/Client Components, next/image, next/link, next/font, dynamic imports |
| **Vite+React** | Remove all Next.js sections (App Router, Server Components, next/*). Add React Router patterns. Replace `next/dynamic` with `React.lazy` |
| **Nuxt** | Rewrite for Vue 3 + Nuxt conventions |
| **Tailwind CSS** | Keep cn() and Tailwind class patterns |
| **CSS Modules** | Remove cn()/Tailwind patterns. Add CSS Module import patterns |
| **styled-components** | Remove Tailwind patterns. Add styled-components patterns |

### 2.4 skills/backend-patterns.md

| User Answer | Action |
|-------------|--------|
| **Next.js API Routes** | Keep Route Handlers, Server Actions, middleware.ts patterns |
| **Express/Fastify** | Rewrite to Express/Fastify middleware, router, controller patterns |
| **Separate backend** | Describe API client patterns for frontend, move backend patterns to separate section |
| **Prisma** | Keep Prisma-style db.model.findMany() examples |
| **Drizzle** | Replace with Drizzle select/insert syntax |
| **Supabase** | Replace with supabase.from().select() patterns |
| **MongoDB** | Replace with Mongoose/MongoDB driver patterns |

### 2.5 skills/coding-standards.md

Update these sections based on answers:
- **Project Structure**: Match framework's file conventions (app/ for Next.js, src/ for Vite, etc.)
- **File Naming**: Match UI library conventions (lowercase for shadcn/ui, PascalCase for MUI, etc.)
- **Component Structure**: Use actual UI library imports in examples
- **Dynamic Imports**: `next/dynamic` for Next.js, `React.lazy` for Vite/CRA
- **Database Queries**: Match chosen ORM syntax

### 2.6 skills/security-review/SKILL.md

| User Answer | Action |
|-------------|--------|
| **No blockchain** | Remove "Blockchain Security" section and wallet-related checklist items |
| **Has blockchain** | Keep or add blockchain security patterns for the specific chain |
| **No Supabase** | Remove Row Level Security section and Supabase-specific checklist items |
| **Has Supabase** | Keep RLS patterns |
| **Express backend** | Use express-rate-limit for rate limiting section |
| **Next.js** | Use middleware.ts for rate limiting section |

### 2.7 skills/clickhouse-io.md

| User Answer | Action |
|-------------|--------|
| **No ClickHouse** | Delete this file |
| **Uses ClickHouse** | Keep and customize table schemas for project domain |

### 2.8 skills/project-guidelines-example.md

**Always delete this file** - it's a template from another project. If the project needs its own guidelines file, create a new `skills/project-guidelines.md` with actual project architecture.

### 2.9 hooks/hooks.json

#### Package manager commands
Search for `npx`, `npm`, `pnpm`, `yarn`, `bun` and replace to match chosen package manager:
- TypeScript check: `[pm] exec tsc` or `npx tsc`
- Prettier: `[pm] exec prettier` or global `prettier`

#### Dev server hook
Update the tmux reminder to match the project's dev command:
```
pnpm run dev  /  npm run dev  /  yarn dev  /  bun run dev
```

#### .md file blocker
If the project uses a different docs structure (not `specs/`), update the matcher exclusion:
```
!(tool_input.file_path matches "README\\.md|CLAUDE\\.md|...|[docs-dir]/")
```

#### Platform compatibility (IMPORTANT)
If the project is on **Windows**, all hooks use `#!/bin/bash` which requires Git Bash or WSL. Consider:
- Using PowerShell scripts instead
- Ensuring Git Bash is available
- Noting this limitation in the hooks description

### 2.10 commands/settings.json

Update allowed commands to match package manager:
```json
{
  "permissions": {
    "allow": [
      "Bash([pm] run lint)",
      "Bash([pm] run test:*)",
      "Bash([pm] run build)",
      "Bash([pm] run dev)"
    ]
  }
}
```

### 2.11 mcp-configs/mcp-servers.json

Keep only servers relevant to the project:

| Server | When to Keep |
|--------|-------------|
| github | Almost always |
| context7 | Almost always (live docs) |
| memory | Almost always (session persistence) |
| sequential-thinking | Almost always |
| vercel | Deploying to Vercel |
| railway | Deploying to Railway |
| cloudflare-* | Deploying to Cloudflare |
| supabase | Using Supabase |
| clickhouse | Using ClickHouse |
| firecrawl | Web scraping needed |
| magic | Using Magic UI components |
| filesystem | Need filesystem MCP access |

### 2.12 rules/patterns.md

Update quick-reference patterns to match tech stack:
- API conventions: Route Handlers vs Express routes
- Component patterns: shadcn/ui vs other library
- Class merging: cn() vs clsx vs classnames
- State patterns: Server Components vs client-only

### 2.13 rules/coding-style.md

Generally stable across projects. Only update if:
- CSS approach changes (add Tailwind/cn() conventions or remove them)
- File size limits need adjusting

### 2.14 rules/testing.md

Update test framework references:
- `vitest` vs `jest` in commands
- `vi.fn()` vs `jest.fn()` in examples
- E2E framework: Playwright vs Cypress

### 2.15 Files That Rarely Need Changes

These are framework-agnostic and usually stay as-is:
- `rules/agents.md` - Agent orchestration (generic)
- `rules/git-workflow.md` - Git conventions (generic)
- `rules/security.md` - Security checklist (generic)
- `rules/performance.md` - Model selection strategy (generic)
- `rules/hooks.md` - Hooks documentation (generic)
- `agents/*.md` - All agent definitions (generic)
- `commands/*.md` - SDD workflow commands (generic)
- `skills/tdd-workflow/SKILL.md` - TDD patterns (update test framework refs only)

---

## Step 3: Verify

After all changes, verify:
1. `CLAUDE.md` tech stack matches actual project
2. No references to removed technologies (grep for old tech names)
3. `hooks.json` commands use correct package manager
4. `commands/settings.json` permissions match package manager
5. No dead skill files (e.g., clickhouse-io.md if not using ClickHouse)
6. Example code in skills uses project's actual libraries
