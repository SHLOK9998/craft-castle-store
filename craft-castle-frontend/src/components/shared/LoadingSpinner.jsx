export function LoadingSpinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${s} border-2 border-cf-primary border-t-transparent rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cf-bg">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-cf-outline text-sm">Loading...</p>
      </div>
    </div>
  )
}
