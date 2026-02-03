---
name: backend-patterns
description: Backend architecture patterns for Next.js App Router, Route Handlers, Server Actions, middleware, database optimization, and server-side best practices.
---

# Backend Development Patterns

Backend patterns for Next.js App Router with TypeScript.

## Route Handlers (app/api/)

### RESTful Route Handler

```typescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const QuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams)
    const { status, limit, offset } = QuerySchema.parse(params)

    const articles = await db.article.findMany({
      where: status ? { status } : undefined,
      take: limit,
      skip: offset,
      orderBy: { updatedAt: "desc" },
    })

    const total = await db.article.count({
      where: status ? { status } : undefined,
    })

    return NextResponse.json({
      success: true,
      data: articles,
      meta: { total, limit, offset },
    })
  } catch (error) {
    return errorHandler(error)
  }
}

const CreateArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CreateArticleSchema.parse(body)

    const article = await db.article.create({ data: validated })

    return NextResponse.json(
      { success: true, data: article },
      { status: 201 }
    )
  } catch (error) {
    return errorHandler(error)
  }
}
```

### Dynamic Route Handler

```typescript
// app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = await db.article.findUnique({
    where: { id: params.id },
  })

  if (!article) {
    return NextResponse.json(
      { success: false, error: "Article not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: article })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const article = await db.article.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    return errorHandler(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.article.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
```

## Server Actions

### Form Actions

```typescript
// app/actions/article.ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const ArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

export async function createArticle(formData: FormData) {
  const validated = ArticleSchema.parse({
    title: formData.get("title"),
    content: formData.get("content"),
  })

  const article = await db.article.create({ data: validated })

  revalidatePath("/articles")
  redirect(`/articles/${article.id}`)
}

export async function updateArticle(id: string, formData: FormData) {
  const validated = ArticleSchema.partial().parse({
    title: formData.get("title"),
    content: formData.get("content"),
  })

  await db.article.update({ where: { id }, data: validated })
  revalidatePath(`/articles/${id}`)
}

export async function deleteArticle(id: string) {
  await db.article.delete({ where: { id } })
  revalidatePath("/articles")
  redirect("/articles")
}
```

### Mutation Actions (non-form)

```typescript
// app/actions/like.ts
"use server"

import { revalidatePath } from "next/cache"

export async function toggleLike(articleId: string, userId: string) {
  const existing = await db.like.findUnique({
    where: { articleId_userId: { articleId, userId } },
  })

  if (existing) {
    await db.like.delete({
      where: { articleId_userId: { articleId, userId } },
    })
  } else {
    await db.like.create({ data: { articleId, userId } })
  }

  revalidatePath(`/articles/${articleId}`)
}
```

## Next.js Middleware

### Auth + Rate Limiting Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"

const protectedPaths = ["/dashboard", "/api/articles"]
const publicPaths = ["/login", "/register", "/api/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public paths
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check auth for protected paths
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    const token = request.cookies.get("session")?.value

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

## Error Handling

### Centralized Error Handler

```typescript
// lib/errors.ts
import { NextResponse } from "next/server"
import { z } from "zod"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
  }
}

export function errorHandler(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    )
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: error.errors },
      { status: 400 }
    )
  }

  console.error("Unexpected error:", error)

  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  )
}
```

### Retry with Exponential Backoff

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}
```

## Data Access Patterns

### Repository Pattern

```typescript
// lib/repositories/article.ts
interface ArticleRepository {
  findAll(filters?: ArticleFilters): Promise<Article[]>
  findById(id: string): Promise<Article | null>
  create(data: CreateArticleDto): Promise<Article>
  update(id: string, data: UpdateArticleDto): Promise<Article>
  delete(id: string): Promise<void>
}

class PrismaArticleRepository implements ArticleRepository {
  async findAll(filters?: ArticleFilters): Promise<Article[]> {
    return db.article.findMany({
      where: {
        status: filters?.status,
        authorId: filters?.authorId,
      },
      take: filters?.limit ?? 20,
      skip: filters?.offset ?? 0,
      orderBy: { updatedAt: "desc" },
    })
  }

  async findById(id: string): Promise<Article | null> {
    return db.article.findUnique({ where: { id } })
  }

  async create(data: CreateArticleDto): Promise<Article> {
    return db.article.create({ data })
  }

  async update(id: string, data: UpdateArticleDto): Promise<Article> {
    return db.article.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await db.article.delete({ where: { id } })
  }
}
```

### Service Layer Pattern

```typescript
// lib/services/article.ts
class ArticleService {
  constructor(private repo: ArticleRepository) {}

  async publish(id: string): Promise<Article> {
    const article = await this.repo.findById(id)

    if (!article) throw new ApiError(404, "Article not found")
    if (article.status === "published") throw new ApiError(400, "Already published")

    return this.repo.update(id, {
      status: "published",
      publishedAt: new Date(),
    })
  }

  async search(query: string, limit = 10): Promise<Article[]> {
    // Full-text search or other business logic
    return this.repo.findAll({ query, limit })
  }
}
```

### N+1 Query Prevention

```typescript
// Include relations in a single query
const articles = await db.article.findMany({
  include: {
    author: { select: { id: true, name: true, avatar: true } },
    _count: { select: { likes: true, comments: true } },
  },
})

// Or batch fetch with Map
const articles = await getArticles()
const authorIds = [...new Set(articles.map(a => a.authorId))]
const authors = await db.user.findMany({ where: { id: { in: authorIds } } })
const authorMap = new Map(authors.map(a => [a.id, a]))
```

## Data Fetching in Server Components

### Direct DB Access

```typescript
// app/articles/page.tsx (Server Component)
export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20,
  })

  return <ArticleList articles={articles} />
}
```

### Parallel Data Fetching

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch in parallel, not sequentially
  const [articles, stats, recentActivity] = await Promise.all([
    db.article.findMany({ take: 5, orderBy: { updatedAt: "desc" } }),
    getArticleStats(),
    getRecentActivity(),
  ])

  return (
    <>
      <StatsCards stats={stats} />
      <RecentArticles articles={articles} />
      <ActivityFeed activity={recentActivity} />
    </>
  )
}
```

### Caching with unstable_cache

```typescript
import { unstable_cache } from "next/cache"

const getCachedArticle = unstable_cache(
  async (id: string) => {
    return db.article.findUnique({ where: { id } })
  },
  ["article"],
  { revalidate: 60, tags: ["articles"] }
)

// Invalidate with revalidateTag
import { revalidateTag } from "next/cache"

export async function updateArticle(id: string, data: UpdateArticleDto) {
  await db.article.update({ where: { id }, data })
  revalidateTag("articles")
}
```

## Authentication

### Auth Helper for Route Handlers

```typescript
// lib/auth.ts
import { cookies } from "next/headers"

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const payload = await verifyToken(token)
    return payload
  } catch {
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    throw new ApiError(401, "Unauthorized")
  }

  return session
}

// Usage in Route Handler
export async function GET() {
  const session = await requireAuth()
  const data = await getDataForUser(session.userId)
  return NextResponse.json({ success: true, data })
}

// Usage in Server Component
export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return <Dashboard userId={session.userId} />
}
```

### Role-Based Access Control

```typescript
type Permission = "read" | "write" | "delete" | "admin"

const rolePermissions: Record<string, Permission[]> = {
  admin: ["read", "write", "delete", "admin"],
  editor: ["read", "write", "delete"],
  author: ["read", "write"],
  viewer: ["read"],
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth()

  const permissions = rolePermissions[session.role] ?? []
  if (!permissions.includes(permission)) {
    throw new ApiError(403, "Insufficient permissions")
  }

  return session
}
```

## Structured Logging

```typescript
// lib/logger.ts
type LogLevel = "info" | "warn" | "error"

interface LogContext {
  requestId?: string
  userId?: string
  [key: string]: unknown
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  }

  // Use console.error for warn/error to separate streams
  if (level === "error" || level === "warn") {
    console.error(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, error: Error, context?: LogContext) =>
    log("error", message, { ...context, error: error.message, stack: error.stack }),
}
```

**Remember**: Use Route Handlers for API endpoints, Server Actions for form mutations, and direct DB access in Server Components. Validate all inputs with Zod. Handle errors centrally.
