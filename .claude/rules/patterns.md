# Common Patterns

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    limit: number
    offset: number
  }
}
```

## Next.js App Router Conventions

```
app/
├── layout.tsx            # Root layout (wraps all pages)
├── page.tsx              # / route
├── loading.tsx           # Loading UI (Suspense boundary)
├── error.tsx             # Error boundary ("use client")
├── not-found.tsx         # 404 page
├── (group)/              # Route group (no URL segment)
│   └── page.tsx
├── [slug]/               # Dynamic segment
│   └── page.tsx
├── [...slug]/            # Catch-all segment
│   └── page.tsx
└── api/
    └── resource/
        └── route.ts      # Route Handler (GET, POST, etc.)
```

## Server Component vs Client Component

```typescript
// DEFAULT: Server Component (no directive)
// Use for: data fetching, static rendering, SEO content
export default async function Page() {
  const data = await db.query(...)
  return <div>{data.title}</div>
}

// CLIENT: Add "use client" only when needed
// Use for: useState, useEffect, onClick, browser APIs
"use client"
export function InteractiveWidget() {
  const [open, setOpen] = useState(false)
  return <Button onClick={() => setOpen(true)}>Open</Button>
}
```

## shadcn/ui Class Merging (cn)

```typescript
import { cn } from "@/lib/utils"

// Merge Tailwind classes safely
<div className={cn(
  "rounded-lg border p-4",         // base styles
  variant === "error" && "border-red-500 bg-red-50",  // conditional
  className                         // allow override from props
)} />
```

## shadcn/ui Component Variants (cva)

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

## Server Actions Pattern

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

const Schema = z.object({
  title: z.string().min(1).max(200),
})

export async function createItem(formData: FormData) {
  const validated = Schema.parse({
    title: formData.get("title"),
  })
  await db.item.create({ data: validated })
  revalidatePath("/items")
}
```

## Route Handler Pattern

```typescript
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const data = await db.item.findMany()
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const item = await db.item.create({ data: body })
  return NextResponse.json({ success: true, data: item }, { status: 201 })
}
```

## Custom Hooks Pattern

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

## Repository Pattern

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

## Skeleton Projects

When implementing new functionality:
1. Search for battle-tested skeleton projects
2. Use parallel agents to evaluate options:
   - Security assessment
   - Extensibility analysis
   - Relevance scoring
   - Implementation planning
3. Clone best match as foundation
4. Iterate within proven structure
