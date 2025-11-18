'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ArchivedVenue {
  id: string
  pipeline_venue_id: string
  name: string
  city: string
  state: string
  email: string
  genres: string[]
  status: 'archived' | 'declined'
  notes: string
  contact_attempts: number
  last_contact_at: string | null
  created_at: string
  archived_at: string
}

export default function HistoryPage() {
  const [venues, setVenues] = useState<ArchivedVenue[]>([])
  const [filteredVenues, setFilteredVenues] = useState<ArchivedVenue[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'archived' | 'declined'>('all')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(10)
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'agency'>('free')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterVenues()
  }, [venues, searchQuery, filterStatus])

  const loadData = async () => {
    const supabase = createClient()

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      window.location.href = '/sign-in'
      return
    }
    setUser(currentUser)

    // Get AI credits and subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_credits_balance, subscription_tier')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (profile) {
      setCredits(profile.ai_credits_balance)
      setSubscriptionTier(profile.subscription_tier || 'free')
    }

    // Load archived/declined venues
    const response = await fetch('/api/pipeline/history')
    const data = await response.json()

    if (data.venues) {
      setVenues(data.venues)
    }

    setLoading(false)
  }

  const filterVenues = () => {
    let filtered = venues

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((v) => v.status === filterStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.city.toLowerCase().includes(query) ||
          v.state.toLowerCase().includes(query) ||
          v.genres.some((g) => g.toLowerCase().includes(query))
      )
    }

    setFilteredVenues(filtered)
  }

  const handleRestore = async (venueId: string, pipelineVenueId: string) => {
    const toastId = toast.loading('Restoring venue...')

    try {
      const response = await fetch('/api/pipeline/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineVenueId }),
      })

      if (response.ok) {
        setVenues((prev) => prev.filter((v) => v.id !== venueId))
        toast.success('Venue restored to pipeline!', { id: toastId })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to restore', { id: toastId })
      }
    } catch (error) {
      toast.error('Failed to restore venue', { id: toastId })
    }
  }

  const handleDelete = async (venueId: string, pipelineVenueId: string) => {
    if (!confirm('Permanently remove this venue from history?')) return

    const toastId = toast.loading('Removing venue...')

    try {
      const response = await fetch('/api/pipeline/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineVenueId }),
      })

      if (response.ok) {
        setVenues((prev) => prev.filter((v) => v.id !== venueId))
        toast.success('Venue removed permanently', { id: toastId })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete', { id: toastId })
      }
    } catch (error) {
      toast.error('Failed to delete venue', { id: toastId })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-black">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} aiCreditsBalance={credits} subscriptionTier={subscriptionTier} />

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">VENUE HISTORY</h1>
              <p className="text-sm sm:text-base text-gray-600">
                View archived and declined venues from past outreach
              </p>
            </div>

            <Link
              href="/pipeline"
              className="btn-secondary shadow-brutalist inline-block text-center"
            >
              ← BACK TO PIPELINE
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2 text-sm">SEARCH</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-black p-3 font-mono"
                placeholder="Search by name, city, or genre..."
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">FILTER BY STATUS</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full border-2 border-black p-3 font-mono"
              >
                <option value="all">All ({venues.length})</option>
                <option value="archived">
                  Archived ({venues.filter((v) => v.status === 'archived').length})
                </option>
                <option value="declined">
                  Declined ({venues.filter((v) => v.status === 'declined').length})
                </option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card bg-white">
              <div className="text-3xl font-black mb-1">{venues.length}</div>
              <div className="text-sm font-bold text-gray-600">Total in History</div>
            </div>
            <div className="card bg-accent-blue">
              <div className="text-3xl font-black mb-1">
                {venues.filter((v) => v.status === 'archived').length}
              </div>
              <div className="text-sm font-bold">Archived</div>
            </div>
            <div className="card bg-accent-pink text-white">
              <div className="text-3xl font-black mb-1">
                {venues.filter((v) => v.status === 'declined').length}
              </div>
              <div className="text-sm font-bold">Declined</div>
            </div>
          </div>

          {/* Venues List */}
          {filteredVenues.length === 0 ? (
            <div className="border-brutalist shadow-brutalist bg-white p-12 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-2xl font-black mb-2">NO VENUES IN HISTORY</h2>
              <p className="text-gray-600">
                {searchQuery
                  ? 'No venues match your search'
                  : 'Archived and declined venues will appear here'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="card-hover">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-black text-lg">{venue.name}</h3>
                      <p className="text-sm text-gray-700">
                        📍 {venue.city}, {venue.state}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-bold border-2 border-black ${
                        venue.status === 'declined'
                          ? 'bg-accent-pink text-white'
                          : 'bg-accent-blue'
                      }`}
                    >
                      {venue.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-1 flex-wrap mb-3">
                    {venue.genres.slice(0, 3).map((genre) => (
                      <span key={genre} className="text-xs border border-black px-2 py-1">
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-gray-600 mb-3 space-y-1">
                    <div>✉️ {venue.email}</div>
                    <div>📞 {venue.contact_attempts} contact attempts</div>
                    {venue.last_contact_at && (
                      <div>
                        🗓️ Last contact:{' '}
                        {new Date(venue.last_contact_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {venue.notes && (
                    <div className="text-sm bg-gray-50 p-2 mb-3 border border-gray-200">
                      <span className="font-bold">Notes:</span> {venue.notes}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(venue.id, venue.pipeline_venue_id)}
                      className="flex-1 border-2 border-black bg-black text-white px-3 py-2 font-bold text-sm hover:bg-white hover:text-black transition-colors"
                    >
                      RESTORE
                    </button>
                    <button
                      onClick={() => handleDelete(venue.id, venue.pipeline_venue_id)}
                      className="border-2 border-black bg-white text-black px-3 py-2 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
