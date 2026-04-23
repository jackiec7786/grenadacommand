"use client"

// global-error replaces the root layout — must include <html> and <body>
// CSS variables from ThemeProvider are unavailable here; use safe inline fallbacks
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" style={{ background: '#0f1117' }}>
      <body style={{ fontFamily: 'monospace', minHeight: '100vh', margin: 0 }}>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '24rem' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.25em', color: '#ef4444', textTransform: 'uppercase', marginBottom: '1rem' }}>
              // Fatal Error
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e5e7eb', marginBottom: '0.75rem' }}>
              Application error
            </h2>
            <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '1.5rem' }}>
              {error.message || 'A fatal error occurred. Please reload.'}
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '2px',
                fontFamily: 'monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                border: '1px solid #22c55e',
                color: '#22c55e',
                background: 'transparent',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
