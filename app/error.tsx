"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-center space-y-4 p-8 max-w-sm">
        <div className="text-[9px] font-mono tracking-[0.25em] text-danger uppercase">// Error</div>
        <h2 className="text-xl font-extrabold font-mono text-text">Something went wrong</h2>
        <p className="font-mono text-[11px] text-muted-foreground">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] cursor-pointer border border-accent text-accent hover:bg-accent hover:text-bg transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
