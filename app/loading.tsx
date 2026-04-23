export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-surface rounded-md border border-border animate-pulse" />
        ))}
      </div>
    </div>
  )
}
