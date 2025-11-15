'use client'

import { useState } from 'react'

type PipelineStatus = 'discovered' | 'approved' | 'contacted' | 'opened' | 'responded' | 'booked'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  status: PipelineStatus
  priority: number
  genres: string[]
  email: string
}

interface KanbanBoardProps {
  venues: Venue[]
  onStatusChange: (venueId: string, newStatus: PipelineStatus) => void
  onSendEmail: (venue: Venue) => void
}

const COLUMNS = [
  { id: 'discovered' as PipelineStatus, title: 'DISCOVERED', description: 'New venues' },
  { id: 'approved' as PipelineStatus, title: 'READY', description: 'Ready to contact' },
  { id: 'contacted' as PipelineStatus, title: 'SENT', description: 'Email sent' },
  { id: 'opened' as PipelineStatus, title: 'OPENED', description: 'They opened it' },
  { id: 'responded' as PipelineStatus, title: 'RESPONDED', description: 'Conversation started' },
  { id: 'booked' as PipelineStatus, title: 'BOOKED', description: 'Gig confirmed!' },
]

const PRIORITY_COLORS = {
  1: 'bg-gray-200',
  2: 'bg-yellow-200',
  3: 'bg-red-200',
}

export function KanbanBoard({ venues, onStatusChange, onSendEmail }: KanbanBoardProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  const getVenuesByStatus = (status: PipelineStatus) => {
    return venues.filter(v => v.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {COLUMNS.map(column => {
        const columnVenues = getVenuesByStatus(column.id)

        return (
          <div key={column.id} className="border-brutalist p-4 min-h-[400px]">
            <div className="mb-4">
              <h2 className="font-black text-lg">{column.title}</h2>
              <p className="text-xs text-gray-600">{column.description}</p>
              <div className="text-xs font-mono mt-1">{columnVenues.length} venues</div>
            </div>

            <div className="space-y-3">
              {columnVenues.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Empty
                </div>
              ) : (
                columnVenues.map(venue => (
                  <div
                    key={venue.id}
                    className={`border-2 border-black p-3 ${PRIORITY_COLORS[venue.priority as keyof typeof PRIORITY_COLORS]} cursor-pointer hover:shadow-brutalist transition-shadow`}
                    onClick={() => setSelectedVenue(venue)}
                  >
                    <div className="font-bold text-sm mb-1">{venue.name}</div>
                    <div className="text-xs text-gray-700 mb-2">
                      {venue.city}, {venue.state}
                    </div>
                    <div className="flex gap-1 flex-wrap mb-2">
                      {venue.genres.slice(0, 2).map(genre => (
                        <span key={genre} className="text-xs border border-black px-1">
                          {genre}
                        </span>
                      ))}
                      {venue.genres.length > 2 && (
                        <span className="text-xs">+{venue.genres.length - 2}</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {column.id === 'approved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSendEmail(venue)
                          }}
                          className="text-xs border border-black bg-black text-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
                        >
                          SEND EMAIL
                        </button>
                      )}
                      {column.id === 'opened' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(venue.id, 'responded')
                          }}
                          className="text-xs border border-black bg-black text-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
                        >
                          MARK RESPONDED
                        </button>
                      )}
                      {column.id === 'discovered' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange(venue.id, 'approved')
                          }}
                          className="text-xs border border-black bg-black text-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
                        >
                          APPROVE
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
