import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SESSION_OPTIONS } from './session-config'

export interface SessionData {
  isLoggedIn: boolean
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS)
}
