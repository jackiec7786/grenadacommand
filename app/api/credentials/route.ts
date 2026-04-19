import { auth } from '@clerk/nextjs/server'
import { sql } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json(null, { status: 401 })
  const { rows } = await sql`
    SELECT id, platform, category, username, email, password, account_number, notes, url, created_at
    FROM user_credentials
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return Response.json(rows)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json(null, { status: 401 })
  const { platform, category, username, email, password, account_number, notes, url } = await req.json()
  const id = randomUUID()
  await sql`
    INSERT INTO user_credentials (id, user_id, platform, category, username, email, password, account_number, notes, url)
    VALUES (${id}, ${userId}, ${platform ?? ''}, ${category ?? ''}, ${username ?? ''}, ${email ?? ''}, ${password ?? ''}, ${account_number ?? ''}, ${notes ?? ''}, ${url ?? ''})
  `
  return Response.json({ id })
}
