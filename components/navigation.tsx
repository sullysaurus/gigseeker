'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ReferralModal } from '@/components/referral-modal'

interface NavigationProps {
  user?: { email: string; id?: string } | null
  aiCreditsBalance?: number
  subscriptionTier?: 'free' | 'pro' | 'agency'
  onComposeEmail?: () => void
}

export function Navigation({ user, aiCreditsBalance, subscriptionTier, onComposeEmail }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.id) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .maybeSingle()

        if (data && !error) {
          setIsAdmin(data.is_admin === true)
        }
      }
    }
    checkAdmin()
  }, [user])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="border-b-3 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="text-2xl md:text-3xl font-black tracking-tighter hover:text-gradient transition-all">
              GIGSEEKER
            </div>
            {user && subscriptionTier && (
              <div className={`border-2 border-black px-2 py-0.5 font-black text-xs ${
                subscriptionTier === 'agency' ? 'bg-accent-purple text-white' :
                subscriptionTier === 'pro' ? 'bg-accent-blue text-white' :
                'bg-white text-black'
              }`}>
                {subscriptionTier.toUpperCase()}
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              {/* AI Credits - Compact */}
              <div className="flex items-center gap-1 border-2 border-black px-3 py-1.5 bg-accent-yellow">
                <span className="font-bold text-xs">AI:</span>
                <span className="font-mono font-black text-lg">{aiCreditsBalance}</span>
              </div>

              <Link href="/pipeline" className={`font-bold px-3 py-1.5 transition-colors ${pathname === '/pipeline' ? 'underline' : 'hover:underline'}`}>
                PIPELINE
              </Link>
              <Link href="/venues" className={`font-bold px-3 py-1.5 transition-colors ${pathname === '/venues' ? 'underline' : 'hover:underline'}`}>
                VENUES
              </Link>

              {onComposeEmail && (
                <button
                  onClick={onComposeEmail}
                  className="border-2 border-black bg-accent-blue text-white px-3 py-1.5 font-bold text-sm hover:bg-accent-purple transition-colors"
                >
                  ✉️
                </button>
              )}

              <button
                onClick={() => setShowReferralModal(true)}
                className="border-2 border-black bg-accent-blue text-white px-3 py-1.5 font-bold text-sm hover:bg-accent-purple transition-colors"
                title="Referrals"
              >
                🎁
              </button>

              {/* Hamburger for secondary items */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="border-2 border-black bg-white px-3 py-1.5 font-black hover:bg-black hover:text-white transition-colors"
              >
                ☰
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              {!isHome && (
                <Link href="/" className="font-bold px-3 py-1.5 hover:underline">
                  HOME
                </Link>
              )}
              <Link href="/sign-in" className="font-bold px-3 py-1.5 hover:underline">
                SIGN IN
              </Link>
              <Link
                href="/sign-up"
                className="border-2 border-black bg-black text-white px-4 py-1.5 font-bold hover:bg-accent-yellow hover:text-black transition-all"
              >
                START FREE
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden border-2 border-black bg-white px-3 py-2 font-black text-xl hover:bg-black hover:text-white transition-colors"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile/Secondary Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div className="fixed top-[73px] right-0 w-full sm:w-80 bg-white border-l-3 border-b-3 border-black shadow-brutalist z-40 max-h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-4 space-y-3">
              {user ? (
                <>
                  {/* Mobile: Show AI Credits */}
                  <div className="lg:hidden border-2 border-black p-3 bg-accent-yellow">
                    <div className="font-bold text-sm">AI CREDITS</div>
                    <div className="font-mono font-black text-3xl">{aiCreditsBalance}</div>
                  </div>

                  {/* Main Links - Mobile Only */}
                  <Link
                    href="/pipeline"
                    onClick={closeMobileMenu}
                    className={`lg:hidden block w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors ${
                      pathname === '/pipeline' ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    PIPELINE
                  </Link>
                  <Link
                    href="/venues"
                    onClick={closeMobileMenu}
                    className={`lg:hidden block w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors ${
                      pathname === '/venues' ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    VENUES
                  </Link>

                  {/* Secondary Links - All Devices */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className={`block w-full text-left font-bold px-4 py-3 border-2 border-black transition-colors ${
                        pathname === '/admin' ? 'bg-accent-purple text-white' : 'bg-accent-yellow hover:bg-accent-purple hover:text-white'
                      }`}
                    >
                      ⚙️ ADMIN
                    </Link>
                  )}
                  <Link
                    href="/history"
                    onClick={closeMobileMenu}
                    className={`block w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors ${
                      pathname === '/history' ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    HISTORY
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className={`block w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors ${
                      pathname === '/profile' ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    PROFILE
                  </Link>
                  <Link
                    href="/account"
                    onClick={closeMobileMenu}
                    className={`block w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors ${
                      pathname === '/account' ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    ACCOUNT
                  </Link>

                  {/* Mobile: Compose Button */}
                  {onComposeEmail && (
                    <button
                      onClick={() => {
                        onComposeEmail()
                        closeMobileMenu()
                      }}
                      className="lg:hidden w-full text-left border-2 border-black bg-accent-blue text-white px-4 py-3 font-bold hover:bg-accent-purple transition-colors"
                    >
                      ✉️ COMPOSE EMAIL
                    </button>
                  )}

                  {/* Mobile: Referral Button */}
                  <button
                    onClick={() => {
                      setShowReferralModal(true)
                      closeMobileMenu()
                    }}
                    className="lg:hidden w-full text-left border-2 border-black bg-accent-blue text-white px-4 py-3 font-bold hover:bg-accent-purple transition-colors"
                  >
                    🎁 INVITE FRIENDS
                  </button>

                  <button
                    onClick={() => {
                      handleSignOut()
                      closeMobileMenu()
                    }}
                    className="w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMobileMenu}
                    className="block w-full text-left font-bold px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={closeMobileMenu}
                    className="block w-full text-left font-bold px-4 py-3 border-2 border-black bg-black text-white hover:bg-accent-yellow hover:text-black transition-colors"
                  >
                    START FREE
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Referral Modal */}
      {user?.id && (
        <ReferralModal
          isOpen={showReferralModal}
          onClose={() => setShowReferralModal(false)}
          userId={user.id}
        />
      )}
    </nav>
  )
}
