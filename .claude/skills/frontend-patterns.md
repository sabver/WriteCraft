---
name: frontend-patterns
description: Frontend development patterns for Next.js App Router, shadcn/ui, Tailwind CSS, state management, and performance optimization.
---

# Frontend Development Patterns

Patterns for Next.js (Turbopack) + React + TypeScript + shadcn/ui + Tailwind CSS.

## Next.js App Router Patterns

### Server Components vs Client Components

```typescript
// Server Component (default) - no directive needed
// Runs on the server, can access DB/filesystem directly, zero JS sent to client
export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await db.article.findUnique({ where: { id: params.id } })

  return (
    <article>
      <h1>{article.title}</h1>
      <ArticleContent content={article.content} />
      {/* Client Component for interactivity */}
      <LikeButton articleId={article.id} initialCount={article.likes} />
    </article>
  )
}
```

```typescript
// Client Component - needs "use client" directive
// Required for: useState, useEffect, event handlers, browser APIs
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LikeButton({ articleId, initialCount }: {
  articleId: string
  initialCount: number
}) {
  const [count, setCount] = useState(initialCount)

  const handleLike = async () => {
    setCount(prev => prev + 1)
    await fetch(`/api/articles/${articleId}/like`, { method: "POST" })
  }

  return <Button onClick={handleLike}>Like ({count})</Button>
}
```

### When to use "use client"

```
Server Component (default)    Client Component ("use client")
- Data fetching               - useState / useEffect
- DB / filesystem access      - Event handlers (onClick, onChange)
- Rendering static content    - Browser APIs (localStorage, window)
- SEO-critical content        - Interactive UI (forms, toggles)
- Layout shells               - Third-party client-only libs
```

### Layouts and Loading States

```typescript
// app/layout.tsx - Root layout (Server Component)
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// app/dashboard/loading.tsx - Automatic loading UI
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[350px]" />
    </div>
  )
}

// app/dashboard/error.tsx - Error boundary (must be Client Component)
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Something went wrong</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

### Server Actions

```typescript
// app/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

export async function createArticle(formData: FormData) {
  const validated = CreateArticleSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
  })

  await db.article.create({ data: validated })
  revalidatePath("/articles")
}

// Usage in Client Component
"use client"

import { createArticle } from "@/app/actions"

export function CreateArticleForm() {
  return (
    <form action={createArticle}>
      <Input name="title" placeholder="Title" />
      <Textarea name="content" placeholder="Content" />
      <Button type="submit">Create</Button>
    </form>
  )
}
```

## Next.js Optimization Patterns

### next/image

```typescript
import Image from "next/image"

// Automatic optimization: lazy loading, responsive sizes, WebP/AVIF
export function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <Image
      src={src}
      alt={name}
      width={40}
      height={40}
      className="rounded-full"
    />
  )
}

// Fill mode for unknown dimensions
export function HeroImage({ src }: { src: string }) {
  return (
    <div className="relative h-[400px] w-full">
      <Image
        src={src}
        alt="Hero"
        fill
        className="object-cover"
        priority  // Preload above-the-fold images
      />
    </div>
  )
}
```

### next/link

```typescript
import Link from "next/link"

// Automatic prefetching on viewport entry
export function Navigation() {
  return (
    <nav className="flex gap-4">
      <Link href="/dashboard" className="text-sm font-medium">
        Dashboard
      </Link>
      <Link href="/articles" prefetch={false}>
        Articles
      </Link>
    </nav>
  )
}
```

### next/font

```typescript
// app/layout.tsx - Automatic font optimization, zero layout shift
import { Inter, JetBrains_Mono } from "next/font/google"
import localFont from "next/font/local"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Local font
const customFont = localFont({
  src: "./fonts/CustomFont.woff2",
  variable: "--font-custom",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

## shadcn/ui Component Patterns

### cn() Utility for Class Merging

```typescript
// lib/utils.ts (auto-generated by shadcn init)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage: merge Tailwind classes safely, last wins on conflicts
cn("px-4 py-2", "px-6")           // "px-6 py-2"
cn("text-red-500", condition && "text-blue-500")  // conditional classes
```

### Using shadcn/ui Components

```typescript
// Install: pnpm dlx shadcn@latest add button card dialog
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>{article.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{article.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">Share</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Preview</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{article.title}</DialogTitle>
              <DialogDescription>{article.excerpt}</DialogDescription>
            </DialogHeader>
            <div className="prose">{article.content}</div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
```

### Extending shadcn/ui Components with Variants

```typescript
// components/ui/badge.tsx - shadcn component, safe to extend
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        // Custom variant for WriteCraft
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

### Composing Custom Components from shadcn/ui

```typescript
// Don't rewrite Card/Tabs/Dialog from scratch - compose from shadcn/ui
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EditorPanel() {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Editor component */}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Preview component */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
```

### Form Handling with shadcn/ui + React Hook Form + Zod

```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
})

type ArticleFormValues = z.infer<typeof articleSchema>

export function ArticleForm({ onSubmit }: {
  onSubmit: (values: ArticleFormValues) => Promise<void>
}) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: "", content: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Article title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your article..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}
```

## Custom Hooks Patterns

### Debounce Hook

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

### Toggle Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle]
}
```

## State Management Patterns

### Context + Reducer Pattern

```typescript
"use client"

interface State {
  documents: Document[]
  activeDocument: Document | null
  loading: boolean
}

type Action =
  | { type: "SET_DOCUMENTS"; payload: Document[] }
  | { type: "SET_ACTIVE"; payload: Document }
  | { type: "SET_LOADING"; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload }
    case "SET_ACTIVE":
      return { ...state, activeDocument: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const DocumentContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
} | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    documents: [],
    activeDocument: null,
    loading: false,
  })

  return (
    <DocumentContext.Provider value={{ state, dispatch }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (!context) throw new Error("useDocuments must be used within DocumentProvider")
  return context
}
```

## Performance Optimization

### Memoization

```typescript
"use client"

// useMemo for expensive computations
const sortedDocuments = useMemo(() => {
  return [...documents].sort((a, b) => b.updatedAt - a.updatedAt)
}, [documents])

// useCallback for functions passed to children
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### Dynamic Imports (Next.js)

```typescript
import dynamic from "next/dynamic"

// Heavy client-only components
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full" />,
})

export default function WritePage() {
  return <Editor />
}
```

### Virtualization for Long Lists

```typescript
"use client"

import { useVirtualizer } from "@tanstack/react-virtual"

export function VirtualDocumentList({ documents }: { documents: Document[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: documents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            className="absolute left-0 top-0 w-full"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <DocumentCard document={documents[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Animation Patterns

### Framer Motion with shadcn/ui

```typescript
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"

export function AnimatedList({ items }: { items: Item[] }) {
  return (
    <AnimatePresence>
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4">{item.title}</Card>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
```

## File Organization

```
app/
├── layout.tsx              # Root layout (Server Component)
├── page.tsx                # Home page
├── loading.tsx             # Global loading UI
├── error.tsx               # Global error UI
├── (auth)/                 # Route group (no URL segment)
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx          # Nested layout
│   ├── page.tsx
│   └── loading.tsx
├── api/                    # Route Handlers
│   └── articles/
│       └── route.ts
└── actions.ts              # Server Actions

components/
├── ui/                     # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── editor/                 # Feature-specific components
│   ├── Editor.tsx
│   └── Toolbar.tsx
└── layout/
    ├── Header.tsx
    └── Sidebar.tsx

lib/
├── utils.ts                # cn() and helpers
└── constants.ts

hooks/
├── useDebounce.ts
└── useToggle.ts

types/
└── index.ts
```

**Remember**: Use shadcn/ui components instead of building from scratch. Default to Server Components; add "use client" only when interactivity is needed. Leverage Next.js built-in optimizations (Image, Link, Font) for performance.
