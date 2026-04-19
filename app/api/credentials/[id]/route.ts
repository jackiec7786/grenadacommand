import { getSession } from '@/lib/session'
import { sql } from '@/lib/db'

const USER_ID = 'owner'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return Response.json(null, { status: 401 })
  try {
    const { id } = await params
    const { platform, category, username, email, password, account_number, notes, url } = await req.json()
    const { rowCount } = await sql`
      UPDATE user_credentials
      SET platform = ${platform ?? ''}, category = ${category ?? ''}, username = ${username ?? ''},
          email = ${email ?? ''}, password = ${password ?? ''}, account_number = ${account_number ?? ''},
          notes = ${notes ?? ''}, url = ${url ?? ''}
      WHERE id = ${id} AND user_id = ${USER_ID}
    `
    if (!rowCount) return Response.json(null, { status: 404 })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('PUT /api/credentials/[id] error:', e)
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) return Response.json(null, { status: 401 })
  try {
    const { id } = await params
    const { rowCount } = await sql`
      DELETE FROM user_credentials WHERE id = ${id} AND user_id = ${USER_ID}
    `
    if (!rowCount) return Response.json(null, { status: 404 })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/credentials/[id] error:', e)
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
