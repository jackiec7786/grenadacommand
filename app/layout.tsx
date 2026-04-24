import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grenada Command Center',
  description: 'The Master Plan - Track your income, tasks, and progress',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = (await cookies()).get('grenada_theme')?.value ?? 'light'
  return (
    <html lang="en" className={`bg-bg${theme === 'dark' ? ' dark' : ''}`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
