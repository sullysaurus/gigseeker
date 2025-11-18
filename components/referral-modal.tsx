'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ReferralModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

interface ReferralStats {
  total_referrals: number
  completed_referrals: number
  pending_referrals: number
  total_credits_earned: number
}

export function ReferralModal({ isOpen, onClose, userId }: ReferralModalProps) {
  const [referralCode, setReferralCode] = useState<string>('')
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && userId) {
      loadReferralData()
    }
  }, [isOpen, userId])

  const loadReferralData = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      // Get referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('user_id', userId)
        .single()

      if (profile) {
        setReferralCode(profile.referral_code)
      }

      // Get referral stats
      const { data: statsData } = await supabase.rpc('get_referral_stats', {
        p_user_id: userId
      })

      if (statsData) {
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to load referral data:', error)
      toast.error('Failed to load referral data')
    } finally {
      setLoading(false)
    }
  }

  const getReferralLink = () => {
    if (typeof window === 'undefined') return ''
    const baseUrl = window.location.origin
    return `${baseUrl}/sign-up?ref=${referralCode}`
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black shadow-brutalist max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b-4 border-black p-6 bg-accent-yellow">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black">INVITE FRIENDS</h2>
            <button
              onClick={onClose}
              className="text-3xl font-black hover:text-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          <p className="mt-2 font-bold">Get 7 days of Pro for each friend who signs up!</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-bold">Loading...</p>
            </div>
          ) : (
            <>
              {/* Referral Code */}
              <div>
                <label className="block font-black text-sm mb-2">YOUR REFERRAL CODE</label>
                <div className="flex gap-2">
                  <div className="flex-1 border-3 border-black px-4 py-3 font-mono text-2xl font-black bg-gray-50">
                    {referralCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralCode, 'Referral code')}
                    className="border-3 border-black bg-accent-blue text-white px-6 py-3 font-black hover:bg-accent-purple transition-colors shadow-brutalist-sm"
                  >
                    COPY
                  </button>
                </div>
              </div>

              {/* Referral Link */}
              <div>
                <label className="block font-black text-sm mb-2">SHAREABLE LINK</label>
                <div className="flex gap-2">
                  <div className="flex-1 border-3 border-black px-4 py-3 font-mono text-sm bg-gray-50 overflow-x-auto">
                    {getReferralLink()}
                  </div>
                  <button
                    onClick={() => copyToClipboard(getReferralLink(), 'Referral link')}
                    className="border-3 border-black bg-accent-blue text-white px-6 py-3 font-black hover:bg-accent-purple transition-colors shadow-brutalist-sm"
                  >
                    COPY
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-3 border-black p-4 bg-white">
                    <div className="text-4xl font-black text-accent-blue">
                      {stats.total_referrals}
                    </div>
                    <div className="font-bold text-sm mt-1">TOTAL REFERRALS</div>
                  </div>
                  <div className="border-3 border-black p-4 bg-white">
                    <div className="text-4xl font-black text-green-600">
                      {stats.completed_referrals}
                    </div>
                    <div className="font-bold text-sm mt-1">COMPLETED</div>
                  </div>
                  <div className="border-3 border-black p-4 bg-white">
                    <div className="text-4xl font-black text-orange-600">
                      {stats.pending_referrals}
                    </div>
                    <div className="font-bold text-sm mt-1">PENDING</div>
                  </div>
                  <div className="border-3 border-black p-4 bg-accent-yellow">
                    <div className="text-4xl font-black">
                      {stats.completed_referrals * 7}
                    </div>
                    <div className="font-bold text-sm mt-1">PRO DAYS EARNED</div>
                  </div>
                </div>
              )}

              {/* How it Works */}
              <div className="border-3 border-black p-4 bg-gray-50">
                <h3 className="font-black text-lg mb-3">HOW IT WORKS</h3>
                <ol className="space-y-2 font-bold">
                  <li className="flex gap-2">
                    <span className="text-accent-blue">1.</span>
                    <span>Share your referral code or link with friends</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-blue">2.</span>
                    <span>They sign up using your code</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-blue">3.</span>
                    <span>You get <strong>7 days of Pro</strong> when they complete signup</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-blue">4.</span>
                    <span>Stack unlimited days - invite more friends for more Pro time!</span>
                  </li>
                </ol>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full border-3 border-black bg-black text-white px-6 py-3 font-black hover:bg-accent-blue transition-colors shadow-brutalist-sm"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
