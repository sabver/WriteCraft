// spec: 001-database  AC-7.1
export async function getDueCount(): Promise<number> {
  const res = await fetch('/api/flashcards/count')
  if (!res.ok) return 0
  const json = await res.json() as { count: number }
  return json.count
}
