'use client'

import { useEffect } from 'react'
import { Navigation } from '@/components/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex items-center justify-center px-4 py-20">
        <div className="border-brutalist p-12 shadow-brutalist-lg max-w-md w-full text-center bg-white animate-slide-up">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl font-black mb-4">OOPS!</h1>
          <p className="text-lg mb-8 text-gray-700">Something went wrong. Please try again.</p>
          <button
            onClick={() => reset()}
            className="btn-primary shadow-brutalist"
          >
            TRY AGAIN
          </button>
        </div>
      </main>
    </div>
  )
}
