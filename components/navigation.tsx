'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavigationProps {
  user?: { email: string } | null
  creditsBalance?: number
}

export function Navigation({ user, creditsBalance }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b-3 border-black bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="text-3xl font-black tracking-tighter hover:text-gradient transition-all">
              GIGSEEKER
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {creditsBalance !== undefined && (
                  <div className="hidden sm:flex items-center gap-2 border-2 border-black px-4 py-2 bg-accent-yellow">
                    <span className="font-bold text-sm">CREDITS:</span>
                    <span className="font-mono font-black text-xl">{creditsBalance}</span>
                  </div>
                )}
                <Link
                  href="/pipeline"
                  className={`hidden md:inline-block font-bold px-4 py-2 transition-colors ${
                    pathname === '/pipeline' ? 'underline' : 'hover:underline'
                  }`}
                >
                  PIPELINE
                </Link>
                <Link
                  href="/venues"
                  className={`hidden md:inline-block font-bold px-4 py-2 transition-colors ${
                    pathname === '/venues' ? 'underline' : 'hover:underline'
                  }`}
                >
                  VENUES
                </Link>
                <Link
                  href="/history"
                  className={`hidden md:inline-block font-bold px-4 py-2 transition-colors ${
                    pathname === '/history' ? 'underline' : 'hover:underline'
                  }`}
                >
                  HISTORY
                </Link>
                <button
                  onClick={handleSignOut}
                  className="font-bold px-4 py-2 hover:underline"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                {!isHome && (
                  <Link
                    href="/"
                    className="hidden md:inline-block font-bold px-4 py-2 hover:underline"
                  >
                    HOME
                  </Link>
                )}
                <Link
                  href="/sign-in"
                  className="font-bold px-4 py-2 hover:underline"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/sign-up"
                  className="border-brutalist bg-black text-white px-6 py-2 font-bold hover:bg-accent-yellow hover:text-black transition-all shadow-brutalist-sm"
                >
                  START FREE
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
