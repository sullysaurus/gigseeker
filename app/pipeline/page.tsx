'use client'

import { useState } from 'react'
import { KanbanBoard } from '@/components/kanban-board'
import { EmailComposer } from '@/components/email-composer'
import { VenueSearch } from '@/components/venue-search'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  email: string
  status: 'discovered' | 'approved' | 'contacted' | 'opened' | 'responded' | 'booked'
  priority: number
  genres: string[]
}

export default function PipelinePage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [credits, setCredits] = useState(10)
  const [showSearch, setShowSearch] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  const handleStatusChange = (venueId: string, newStatus: any) => {
    setVenues(prev =>
      prev.map(v => (v.id === venueId ? { ...v, status: newStatus } : v))
    )
  }

  const handleSendEmail = (venue: Venue) => {
    setSelectedVenue(venue)
    setShowEmailComposer(true)
  }

  const handleEmailSent = async (subject: string, body: string) => {
    if (!selectedVenue) return

    setCredits(prev => prev - 1)
    setVenues(prev =>
      prev.map(v =>
        v.id === selectedVenue.id ? { ...v, status: 'contacted' } : v
      )
    )
  }

  const handleAddVenue = async (venueId: string) => {
    // In production: Call API and add returned venue
    console.log('Adding venue:', venueId)
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-black">MY PIPELINE</h1>
            <p className="text-sm text-gray-600">
              Track your venue outreach from discovery to booking
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="border-brutalist px-6 py-3 bg-yellow-100">
              <span className="font-bold text-sm">CREDITS:</span>{' '}
              <span className="font-mono text-3xl font-black">{credits}</span>
            </div>
            <button
              onClick={() => setShowSearch(true)}
              className="border-brutalist bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors"
            >
              + ADD VENUE
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-black p-4">
            <div className="text-3xl font-black">{venues.length}</div>
            <div className="text-sm font-bold">Total Venues</div>
          </div>
          <div className="border-2 border-black p-4">
            <div className="text-3xl font-black">
              {venues.filter(v => v.status === 'contacted').length}
            </div>
            <div className="text-sm font-bold">Emails Sent</div>
          </div>
          <div className="border-2 border-black p-4">
            <div className="text-3xl font-black">
              {venues.filter(v => v.status === 'opened').length}
            </div>
            <div className="text-sm font-bold">Opened</div>
          </div>
          <div className="border-2 border-black p-4">
            <div className="text-3xl font-black">
              {venues.filter(v => v.status === 'booked').length}
            </div>
            <div className="text-sm font-bold">Booked</div>
          </div>
        </div>

        <KanbanBoard
          venues={venues}
          onStatusChange={handleStatusChange}
          onSendEmail={handleSendEmail}
        />

        {showSearch && (
          <VenueSearch
            onAddVenue={handleAddVenue}
            onClose={() => setShowSearch(false)}
          />
        )}

        {showEmailComposer && selectedVenue && (
          <EmailComposer
            venueName={selectedVenue.name}
            venueEmail={selectedVenue.email}
            creditsBalance={credits}
            onSend={handleEmailSent}
            onClose={() => {
              setShowEmailComposer(false)
              setSelectedVenue(null)
            }}
          />
        )}
      </div>
    </main>
  )
}
