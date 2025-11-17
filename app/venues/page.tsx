'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { EmailComposer } from '@/components/email-composer'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  email: string
  phone?: string
  website?: string
  genres: string[]
  description?: string
  capacity?: number
  venue_type?: string
  is_verified?: boolean
}

const GENRES = [
  'rock', 'jazz', 'blues', 'country', 'folk', 'metal',
  'punk', 'indie', 'alternative', 'electronic', 'hip hop', 'r&b',
  'singer songwriter', 'original', 'covers', 'tribute', 'acoustic',
  'americana', 'bluegrass', 'jam band', 'hardcore', 'southern rock'
]

// Helper function to capitalize genre names for display
const capitalizeGenre = (genre: string) => {
  return genre
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const RESULTS_PER_PAGE = 50

export default function VenuesPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('NC') // Default to NC
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [addingVenueId, setAddingVenueId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(10)
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'agency'>('free')
  const [initialLoading, setInitialLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)

  // Load user and credits on mount
  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient()

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)

        // Get user profile for AI credits and subscription tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_credits_balance, subscription_tier')
          .eq('user_id', currentUser.id)
          .maybeSingle()

        if (profile) {
          setCredits(profile.ai_credits_balance)
          setSubscriptionTier(profile.subscription_tier || 'free')
        }
      }

      setInitialLoading(false)
    }

    loadUserData()
  }, [])

  // Load first 10 venues by default on mount
  useEffect(() => {
    const loadDefaultVenues = async () => {
      try {
        const response = await fetch('/api/venues/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: 'NC',
            limit: 10,
            offset: 0,
          }),
        })

        const data = await response.json()

        if (response.ok && data.venues) {
          setVenues(data.venues)
          setTotal(data.total || 0)
        }
      } catch (error) {
        console.error('Failed to load default venues:', error)
      }
    }

    loadDefaultVenues()
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
    setOffset(0) // Reset to first page when filters change
  }

  const handleSearch = async (newOffset = 0) => {
    setLoading(true)
    setOffset(newOffset)

    try {
      const response = await fetch('/api/venues/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || undefined,
          city: city || undefined,
          state: state || undefined,
          genres: selectedGenres.length > 0 ? selectedGenres : undefined,
          limit: RESULTS_PER_PAGE,
          offset: newOffset,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to search venues')
        setVenues([])
        setTotal(0)
        return
      }

      setVenues(data.venues || [])
      setTotal(data.total || 0)

      if (!data.venues || data.venues.length === 0) {
        toast('No venues found. Try different filters.', { icon: '🔍' })
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search venues')
      setVenues([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVenue = async (venueId: string) => {
    setAddingVenueId(venueId)

    try {
      // Add venue to pipeline - the API will auto-detect default pipeline
      const response = await fetch('/api/pipeline/add-venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('Venue already in your pipeline')
        } else {
          toast.error(data.error || 'Failed to add venue')
        }
        return
      }

      toast.success('Venue added to pipeline!')
      // Remove from search results
      setVenues(prev => prev.filter(v => v.id !== venueId))
      setTotal(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Add venue error:', error)
      toast.error('Failed to add venue')
    } finally {
      setAddingVenueId(null)
    }
  }

  const handleClearFilters = () => {
    setQuery('')
    setCity('')
    setState('NC')
    setSelectedGenres([])
    setOffset(0)
    setVenues([])
    setTotal(0)
  }

  const handleComposeBlankEmail = () => {
    setShowEmailComposer(true)
  }

  const handleEmailSent = async (recipientEmail: string, subject: string, body: string) => {
    try {
      // Sending a blank email (not tied to pipeline)
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          subject,
          body,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowEmailComposer(false)
        toast.success('Email sent successfully!')
      } else {
        if (data.requiresUpgrade) {
          toast.error(data.error || 'Pro subscription required to send emails')
        } else {
          toast.error(data.error || 'Failed to send email')
        }
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Failed to send email')
    }
  }

  const currentPage = Math.floor(offset / RESULTS_PER_PAGE) + 1
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * RESULTS_PER_PAGE
    handleSearch(newOffset)
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-black">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        aiCreditsBalance={credits}
        subscriptionTier={subscriptionTier}
        onComposeEmail={handleComposeBlankEmail}
      />

      <main className="px-4 py-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2">VENUE DATABASE</h1>
              <p className="text-sm md:text-base text-gray-600">Search and add venues to your booking pipeline</p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden border-2 border-black bg-black text-white px-4 py-3 font-bold hover:bg-accent-blue transition-colors"
            >
              🔍 FILTERS {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </button>
          </div>

        {/* Desktop Filters */}
        <div className="hidden md:block bg-white border-3 border-black shadow-brutalist p-4 md:p-6 mb-6">
          <div className="space-y-4">
            {/* Text Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block font-bold mb-2 text-sm">SEARCH</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(0)}
                  className="w-full border-2 border-black p-2 font-mono"
                  placeholder="Venue name..."
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-sm">CITY</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(0)}
                  className="w-full border-2 border-black p-2 font-mono"
                  placeholder="Raleigh, Durham..."
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-sm">STATE</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono"
                >
                  <option value="">All States</option>
                  {US_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Genre Filters */}
            <div>
              <label className="block font-bold mb-2 text-xs sm:text-sm">GENRES</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-2.5 py-1.5 sm:px-3 sm:py-2 border-2 border-black font-bold text-xs sm:text-sm transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {capitalizeGenre(genre)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => handleSearch(0)}
                disabled={loading}
                className="flex-1 border-2 border-black bg-black text-white px-4 sm:px-6 py-3 font-bold text-sm sm:text-base hover:bg-white hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? 'SEARCHING...' : 'SEARCH VENUES'}
              </button>
              <button
                onClick={handleClearFilters}
                className="border-2 border-black bg-white text-black px-4 sm:px-6 py-3 font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {total > 0 && (
          <div className="mb-4 text-sm font-bold">
            SHOWING {offset + 1}-{Math.min(offset + RESULTS_PER_PAGE, total)} OF {total} VENUES
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-black text-2xl">LOADING...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border-2 border-gray-200">
            <p className="text-base sm:text-lg font-bold mb-2">No venues found</p>
            <p className="text-xs sm:text-sm">Try searching or adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 mb-6">
            {venues.map(venue => (
              <div key={venue.id} className="border-2 border-black p-3 sm:p-4 hover:shadow-brutalist transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  {/* Venue Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-black text-xl mb-1">{venue.name}</h3>
                        <p className="text-sm text-gray-700 mb-2">
                          📍 {venue.city}, {venue.state}
                          {venue.capacity && ` • 👥 ${venue.capacity}`}
                          {venue.venue_type && ` • ${venue.venue_type.replace('_', ' ').toUpperCase()}`}
                          {venue.is_verified && ' • ✓ VERIFIED'}
                        </p>
                      </div>
                    </div>

                    {venue.genres.length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-3">
                        {venue.genres.map(genre => (
                          <span key={genre} className="text-xs border border-black px-2 py-1 bg-gray-50">
                            {capitalizeGenre(genre)}
                          </span>
                        ))}
                      </div>
                    )}

                    {venue.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {venue.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs">
                      <span>✉️ {venue.email}</span>
                      {venue.phone && <span>📞 {venue.phone}</span>}
                      {venue.website && (
                        <a
                          href={venue.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-600"
                        >
                          🌐 Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleAddVenue(venue.id)}
                    disabled={addingVenueId === venue.id}
                    className="w-full sm:w-auto border-2 border-black bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-sm sm:text-base hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                  >
                    {addingVenueId === venue.id ? 'ADDING...' : '+ ADD TO PIPELINE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="border-2 border-black px-4 py-2 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← PREV
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    disabled={loading}
                    className={`border-2 border-black px-4 py-2 font-bold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="border-2 border-black px-4 py-2 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT →
            </button>
          </div>
        )}

        {/* Back to Pipeline */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/pipeline')}
            className="border-2 border-black px-6 py-3 font-bold hover:bg-gray-100 transition-colors"
          >
            ← BACK TO PIPELINE
          </button>
        </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto border-t-3 border-black animate-slide-up">
            <div className="sticky top-0 bg-white border-b-2 border-black p-4 flex justify-between items-center z-10">
              <h2 className="font-black text-xl">FILTERS</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-2xl font-black leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Text Filters */}
              <div>
                <label className="block font-bold mb-2 text-sm">SEARCH</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono"
                  placeholder="Venue name..."
                />
              </div>

              <div>
                <label className="block font-bold mb-2 text-sm">CITY</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono"
                  placeholder="Raleigh, Durham..."
                />
              </div>

              <div>
                <label className="block font-bold mb-2 text-sm">STATE</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono"
                >
                  <option value="">All States</option>
                  {US_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Genre Filters */}
              <div>
                <label className="block font-bold mb-2 text-xs sm:text-sm">GENRES</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-2.5 py-1.5 sm:px-3 sm:py-2 border-2 border-black font-bold text-xs sm:text-sm transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {capitalizeGenre(genre)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={() => {
                    handleSearch(0)
                    setShowFilters(false)
                  }}
                  disabled={loading}
                  className="w-full border-2 border-black bg-black text-white px-4 py-3 font-bold text-sm hover:bg-accent-blue transition-colors disabled:opacity-50"
                >
                  {loading ? 'SEARCHING...' : 'SEARCH VENUES'}
                </button>
                <button
                  onClick={() => {
                    handleClearFilters()
                    setShowFilters(false)
                  }}
                  className="w-full border-2 border-black bg-white text-black px-4 py-3 font-bold text-sm hover:bg-gray-100 transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {showEmailComposer && (
        <EmailComposer
          creditsBalance={credits}
          onSend={handleEmailSent}
          onClose={() => setShowEmailComposer(false)}
          onCreditsUpdate={(newBalance) => setCredits(newBalance)}
        />
      )}
    </div>
  )
}
