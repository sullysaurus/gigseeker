'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Check your email for the magic link!',
      })
      setEmail('')
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-brutalist p-8 shadow-brutalist-lg max-w-md w-full bg-white animate-slide-up">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">SIGN IN</h1>
        <p className="text-gray-600">Welcome back to Gigseeker</p>
      </div>

      {error && (
        <div className="mb-4 p-4 border-2 border-red-500 bg-red-50 text-red-800">
          <p className="font-bold">⚠️ {error}</p>
        </div>
      )}

      {message && (
        <div
          className={`mb-4 p-4 border-2 ${
            message.type === 'success'
              ? 'border-green-500 bg-green-50 text-green-800'
              : 'border-red-500 bg-red-50 text-red-800'
          }`}
        >
          <p className="font-bold">
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSignIn}>
        <div>
          <label className="block font-bold mb-2 text-sm">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-brutalist"
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ SENDING...' : '✨ SEND MAGIC LINK'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t-2 border-black">
        <p className="text-center text-sm">
          New to Gigseeker?{' '}
          <Link href="/sign-up" className="underline font-bold hover:text-gradient">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="flex items-center justify-center px-4 py-16">
        <Suspense fallback={
          <div className="border-brutalist p-8 shadow-brutalist max-w-md w-full bg-white">
            <h1 className="text-4xl font-black mb-6">SIGN IN</h1>
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 animate-pulse border-2 border-black"></div>
              <div className="h-14 bg-gray-100 animate-pulse border-2 border-black"></div>
            </div>
          </div>
        }>
          <SignInForm />
        </Suspense>
      </main>
    </div>
  )
}
