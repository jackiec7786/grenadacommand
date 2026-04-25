import { getRedis } from '@/lib/db'
import { QUOTES } from '@/lib/data'

export interface QuoteResponse {
  text: string
  author: string
  source: 'quotable' | 'zenquotes' | 'local'
}

function todayKey() {
  return `grenada:quote:${new Date().toISOString().slice(0, 10)}`
}

function localFallback(): QuoteResponse {
  const q = QUOTES[Math.floor((Date.now() / 86_400_000) % QUOTES.length)]
  return { text: q.text, author: q.author, source: 'local' }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const refresh = searchParams.get('refresh') === '1'
  const key = todayKey()

  if (!refresh) {
    try {
      const redis = getRedis()
      const cached = await redis.get(key)
      if (cached) return Response.json(JSON.parse(cached))
    } catch {}
  }

  // Try quotable.io
  try {
    const res = await fetch('https://api.quotable.io/random?maxLength=180', { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const data = await res.json()
      if (data?.content && data?.author) {
        const quote: QuoteResponse = { text: data.content, author: data.author, source: 'quotable' }
        try { const redis = getRedis(); await redis.setex(key, 21600, JSON.stringify(quote)) } catch {}
        return Response.json(quote)
      }
    }
  } catch {}

  // Try zenquotes.io
  try {
    const res = await fetch('https://zenquotes.io/api/today', { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data[0]?.q && data[0]?.a) {
        const quote: QuoteResponse = { text: data[0].q, author: data[0].a, source: 'zenquotes' }
        try { const redis = getRedis(); await redis.setex(key, 21600, JSON.stringify(quote)) } catch {}
        return Response.json(quote)
      }
    }
  } catch {}

  return Response.json(localFallback())
}
