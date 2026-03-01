// spec: 001-database  AC-2.1–2.5, AC-1.3, AC-6.1
import type { CreateSessionInput, SessionListItem, SessionDetail, HistoryFilter } from '@/lib/types'

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  const json = await res.json()
  return (json as { data: T }).data
}

export async function createSession(input: CreateSessionInput): Promise<string> {
  const result = await apiFetch<{ id: string }>('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return result.id
}

export async function getSessions(filters: HistoryFilter): Promise<SessionListItem[]> {
  const params = new URLSearchParams()
  if (filters.scene && filters.scene !== 'all') {
    params.set('scene', filters.scene.toUpperCase())
  }
  if (filters.range && filters.range !== 'all') {
    params.set('range', filters.range)
  }
  if (filters.q) {
    params.set('q', filters.q)
  }
  const query = params.toString()
  return apiFetch<SessionListItem[]>(`/api/sessions${query ? `?${query}` : ''}`)
}

export async function getSession(id: string): Promise<SessionDetail> {
  return apiFetch<SessionDetail>(`/api/sessions/${id}`)
}
