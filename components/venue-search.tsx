'use client'

import { useState } from 'react'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  email: string
  website?: string
  genres: string[]
  description?: string
}

interface VenueSearchProps {
  onAddVenue: (venueId: string) => Promise<void>
  onClose: () => void
}

const GENRES = [
  'Rock', 'Jazz', 'Blues', 'Country', 'Folk', 'Metal',
  'Punk', 'Indie', 'Alternative', 'Electronic', 'Hip Hop', 'R&B'
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export function VenueSearch({ onAddVenue, onClose }: VenueSearchProps) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/venues/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || undefined,
          city: city || undefined,
          state: state || undefined,
          genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        }),
      })

      const data = await response.json()
      setVenues(data.venues)
      setTotal(data.total)
    } catch (error) {
      alert('Failed to search venues')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVenue = async (venueId: string) => {
    try {
      await onAddVenue(venueId)
      setVenues(prev => prev.filter(v => v.id !== venueId))
    } catch (error) {
      alert('Failed to add venue')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-brutalist shadow-brutalist max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b-3 border-black">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-black">SEARCH VENUES</h2>
            <button
              onClick={onClose}
              className="text-2xl font-black hover:bg-black hover:text-white px-3 py-1 border-2 border-black"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
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
                  placeholder="Nashville..."
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

            <div>
              <label className="block font-bold mb-2 text-sm">GENRES</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 border-2 border-black font-bold text-sm transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'SEARCHING...' : 'SEARCH VENUES'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {venues.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-bold">No venues found</p>
              <p className="text-sm">Try adjusting your search filters</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <p className="font-black text-2xl">LOADING...</p>
            </div>
          )}

          <div className="space-y-4">
            {venues.map(venue => (
              <div key={venue.id} className="border-2 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-lg">{venue.name}</h3>
                    <p className="text-sm text-gray-700">
                      📍 {venue.city}, {venue.state}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddVenue(venue.id)}
                    className="border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-white hover:text-black transition-colors text-sm"
                  >
                    + ADD
                  </button>
                </div>

                {venue.genres.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    {venue.genres.map(genre => (
                      <span key={genre} className="text-xs border border-black px-2 py-1">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {venue.description && (
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {venue.description}
                  </p>
                )}

                <div className="flex gap-4 text-xs">
                  <span>✉️ {venue.email}</span>
                  {venue.website && (
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {total > venues.length && (
            <div className="text-center mt-6 text-sm text-gray-600">
              Showing {venues.length} of {total} results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
