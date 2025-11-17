'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="flex items-center justify-center px-4 py-16">
        <div className="border-brutalist p-8 shadow-brutalist-lg max-w-md w-full bg-white animate-slide-up">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">SIGN UP</h1>
            <p className="text-gray-600">Start booking more gigs today</p>
          </div>

          <div className="mb-6 p-4 border-2 border-black bg-accent-yellow">
            <p className="font-bold">✨ Get 10 FREE credits to start!</p>
            <p className="text-sm mt-1">No credit card required</p>
          </div>

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

          <form className="space-y-6" onSubmit={handleSignUp}>
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
              {loading ? '⏳ SENDING...' : '✨ CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-black">
            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="underline font-bold hover:text-gradient">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center">
              By signing up, you'll get 10 free credits to try Gigseeker.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
