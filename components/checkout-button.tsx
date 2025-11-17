'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface CheckoutButtonProps {
  priceId: string
  tierName: 'Pro' | 'Agency'
  children: React.ReactNode
  className?: string
}

export function CheckoutButton({ priceId, tierName, children, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)

    try {
      // Check if user is authenticated
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Not logged in - redirect to sign up
        router.push('/sign-up?redirect=checkout')
        return
      }

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
