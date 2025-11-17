'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface CreditTransaction {
  id: string
  amount: number
  transaction_type: string
  description: string
  created_at: string
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [aiCredits, setAiCredits] = useState(0)
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'agency'>('free')
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [referralStats, setReferralStats] = useState<any>(null)
  const [venueCount, setVenueCount] = useState(0)
  const [maxVenues, setMaxVenues] = useState<number | null>(20)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        window.location.href = '/sign-in'
        return
      }
      setUser(currentUser)

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setAiCredits(profileData.ai_credits_balance || 0)
        setSubscriptionTier(profileData.subscription_tier || 'free')
        setMaxVenues(profileData.max_pipeline_venues)
      }

      // Get credit transactions
      const { data: transactionsData } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (transactionsData) {
        setTransactions(transactionsData)
      }

      // Get referral stats
      const { data: statsData } = await supabase.rpc('get_referral_stats', {
        p_user_id: currentUser.id
      })

      if (statsData) {
        setReferralStats(statsData)
      }

      // Get venue count
      const { data: venueCountData } = await supabase.rpc('get_pipeline_venue_count', {
        p_user_id: currentUser.id
      })

      if (venueCountData !== null) {
        setVenueCount(venueCountData)
      }
    } catch (error) {
      console.error('Failed to load account data:', error)
      toast.error('Failed to load account data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTransactionType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} aiCreditsBalance={aiCredits} subscriptionTier={subscriptionTier} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-xl">Loading account...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} aiCreditsBalance={aiCredits} subscriptionTier={subscriptionTier} />

      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-black mb-2">ACCOUNT SETTINGS</h1>
            <p className="text-lg font-bold text-gray-600">{user?.email}</p>
          </div>

          {/* Subscription Card */}
          <div className="border-4 border-black bg-white shadow-brutalist">
            <div className="border-b-4 border-black p-6 bg-accent-yellow">
              <h2 className="text-2xl font-black">SUBSCRIPTION</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`border-2 border-black px-4 py-2 font-black text-xl ${
                      subscriptionTier === 'agency' ? 'bg-accent-purple text-white' :
                      subscriptionTier === 'pro' ? 'bg-accent-blue text-white' :
                      'bg-white text-black'
                    }`}>
                      {subscriptionTier.toUpperCase()} PLAN
                    </div>
                  </div>
                  <p className="mt-2 font-bold text-gray-600">
                    {subscriptionTier === 'free' && 'Limited to 20 venues. Upgrade to Pro for unlimited venues and email sending.'}
                    {subscriptionTier === 'pro' && '$29/month - Unlimited venues, unlimited emails, more AI credits'}
                    {subscriptionTier === 'agency' && '$59/month - Everything in Pro + team features'}
                  </p>
                </div>
                {subscriptionTier === 'free' && (
                  <Link
                    href="/#pricing"
                    className="border-3 border-black bg-accent-blue text-white px-6 py-3 font-black hover:bg-accent-purple transition-colors shadow-brutalist-sm"
                  >
                    UPGRADE
                  </Link>
                )}
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-black p-4">
                  <div className="text-3xl font-black text-accent-blue">{aiCredits}</div>
                  <div className="font-bold text-sm">AI CREDITS</div>
                  <div className="text-xs text-gray-600 mt-1">Use for AI email features</div>
                </div>
                <div className="border-2 border-black p-4">
                  <div className="text-3xl font-black text-green-600">
                    {venueCount} / {maxVenues || '∞'}
                  </div>
                  <div className="font-bold text-sm">VENUES IN PIPELINE</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {maxVenues ? 'Free tier limit' : 'Unlimited'}
                  </div>
                </div>
                <div className="border-2 border-black p-4">
                  <div className="text-3xl font-black text-orange-600">
                    {subscriptionTier === 'free' ? '✗' : '✓'}
                  </div>
                  <div className="font-bold text-sm">EMAIL SENDING</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {subscriptionTier === 'free' ? 'Pro tier required' : 'Unlimited emails'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Stats Card */}
          {referralStats && (
            <div className="border-4 border-black bg-white shadow-brutalist">
              <div className="border-b-4 border-black p-6 bg-accent-blue text-white">
                <h2 className="text-2xl font-black">REFERRALS</h2>
              </div>
              <div className="p-6">
                <p className="font-bold mb-4">
                  Invite friends and earn 50 AI credits for each completed signup!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="border-2 border-black p-4">
                    <div className="text-3xl font-black text-accent-blue">
                      {referralStats.total_referrals}
                    </div>
                    <div className="font-bold text-sm">TOTAL</div>
                  </div>
                  <div className="border-2 border-black p-4">
                    <div className="text-3xl font-black text-green-600">
                      {referralStats.completed_referrals}
                    </div>
                    <div className="font-bold text-sm">COMPLETED</div>
                  </div>
                  <div className="border-2 border-black p-4">
                    <div className="text-3xl font-black text-orange-600">
                      {referralStats.pending_referrals}
                    </div>
                    <div className="font-bold text-sm">PENDING</div>
                  </div>
                  <div className="border-2 border-black p-4 bg-accent-yellow">
                    <div className="text-3xl font-black">
                      {referralStats.total_credits_earned}
                    </div>
                    <div className="font-bold text-sm">CREDITS EARNED</div>
                  </div>
                </div>
                <div className="border-2 border-black p-4 bg-gray-50">
                  <div className="font-bold mb-2">YOUR REFERRAL CODE:</div>
                  <div className="font-mono text-2xl font-black">{profile?.referral_code}</div>
                </div>
              </div>
            </div>
          )}

          {/* Credit History */}
          <div className="border-4 border-black bg-white shadow-brutalist">
            <div className="border-b-4 border-black p-6 bg-accent-yellow">
              <h2 className="text-2xl font-black">CREDIT HISTORY</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-3 border-black bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-black text-sm">DATE</th>
                    <th className="px-6 py-3 text-left font-black text-sm">TYPE</th>
                    <th className="px-6 py-3 text-left font-black text-sm">DESCRIPTION</th>
                    <th className="px-6 py-3 text-right font-black text-sm">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-bold">
                        No credit transactions yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="border-b-2 border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">
                          {formatTransactionType(tx.transaction_type)}
                        </td>
                        <td className="px-6 py-4 text-sm">{tx.description}</td>
                        <td className={`px-6 py-4 text-right font-black text-lg ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stripe Payment Section - Placeholder */}
          {subscriptionTier === 'free' && (
            <div className="border-4 border-black bg-white shadow-brutalist">
              <div className="border-b-4 border-black p-6 bg-accent-purple text-white">
                <h2 className="text-2xl font-black">UPGRADE TO PRO</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pro Plan */}
                  <div className="border-3 border-black p-6 bg-accent-blue text-white">
                    <h3 className="text-2xl font-black mb-2">PRO</h3>
                    <div className="text-4xl font-black mb-4">$29<span className="text-lg">/mo</span></div>
                    <ul className="space-y-2 font-bold mb-6">
                      <li>✓ Unlimited venues</li>
                      <li>✓ Send emails (unlimited)</li>
                      <li>✓ Track email opens</li>
                      <li>✓ 20+ email templates</li>
                      <li>✓ More AI credits</li>
                      <li>✓ Priority support</li>
                    </ul>
                    <button
                      onClick={() => toast('Stripe integration coming soon!')}
                      className="w-full border-3 border-black bg-white text-black px-6 py-3 font-black hover:bg-accent-yellow transition-colors shadow-brutalist-sm"
                    >
                      UPGRADE TO PRO
                    </button>
                  </div>

                  {/* Agency Plan */}
                  <div className="border-3 border-black p-6 bg-accent-purple text-white">
                    <h3 className="text-2xl font-black mb-2">AGENCY</h3>
                    <div className="text-4xl font-black mb-4">$59<span className="text-lg">/mo</span></div>
                    <ul className="space-y-2 font-bold mb-6">
                      <li>✓ Everything in Pro</li>
                      <li>✓ 3-5 team members</li>
                      <li>✓ Multi-artist management</li>
                      <li>✓ Bulk venue imports</li>
                      <li>✓ Advanced analytics</li>
                      <li>✓ Tour routing</li>
                    </ul>
                    <button
                      onClick={() => toast('Stripe integration coming soon!')}
                      className="w-full border-3 border-black bg-white text-black px-6 py-3 font-black hover:bg-accent-yellow transition-colors shadow-brutalist-sm"
                    >
                      UPGRADE TO AGENCY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
