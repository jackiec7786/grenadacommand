import { auth } from '@clerk/nextjs/server'
import { sql } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json(null, { status: 401 })
  try {
    const { rows } = await sql`SELECT state FROM user_state WHERE user_id = ${userId}`
    return Response.json(rows[0]?.state ?? null)
  } catch (e) {
    console.error('GET /api/state error:', e)
    return Response.json(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json(null, { status: 401 })
  try {
    const state = await req.json()
    await sql`
      INSERT INTO user_state (user_id, state, updated_at)
      VALUES (${userId}, ${JSON.stringify(state)}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()
    `
    return Response.json({ ok: true })
  } catch (e) {
    console.error('POST /api/state error:', e)
    return Response.json({ ok: false }, { status: 500 })
  }
}
