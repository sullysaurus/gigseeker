'use client'

import { useState, useEffect } from 'react'
import { PipelineTable } from '@/components/pipeline-table'
import { EmailComposer } from '@/components/email-composer'
import { VenueSearch } from '@/components/venue-search'
import { Navigation } from '@/components/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  email: string
  website?: string
  description?: string
  status: 'discovered' | 'approved' | 'contacted' | 'opened' | 'responded' | 'booked'
  priority: number
  genres: string[]
  contact_attempts: number
  last_contact_at: string | null
  email_opened_at?: string | null
  notes?: string
  pipeline_venue_id?: string
}

export default function PipelinePage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [credits, setCredits] = useState(10)
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'agency'>('free')
  const [showSearch, setShowSearch] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [editingNotes, setEditingNotes] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pipelineId, setPipelineId] = useState<string | null>(null)

  // Load user, credits, and pipeline on mount
  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        window.location.href = '/sign-in'
        return
      }
      setUser(currentUser)

      // Get user profile for AI credits and subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_credits_balance, subscription_tier')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (profileError) {
        console.error('Profile error:', profileError)
      }

      if (profile) {
        setCredits(profile.ai_credits_balance)
        setSubscriptionTier(profile.subscription_tier || 'free')
      } else {
        // Profile doesn't exist, might be a new user without trigger setup
        console.warn('No profile found for user')
        setCredits(10) // Default AI credits
        setSubscriptionTier('free')
      }

      // Get or create default pipeline
      let { data: pipeline, error: pipelineError } = await supabase
        .from('pipelines')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('is_default', true)
        .single()

      // If no pipeline exists, create one
      if (!pipeline || pipelineError) {
        console.log('No pipeline found, creating default pipeline...')
        const { data: newPipeline, error: createError } = await supabase
          .from('pipelines')
          .insert({
            user_id: currentUser.id,
            name: 'My Pipeline',
            description: 'Default pipeline for tracking venue outreach',
            is_default: true,
          })
          .select('id')
          .single()

        if (createError) {
          console.error('Failed to create pipeline:', createError)
          toast.error('Failed to initialize pipeline. Please refresh the page.')
          setLoading(false)
          return
        }

        toast.success('Pipeline created successfully!')

        pipeline = newPipeline
      }

      if (pipeline) {
        setPipelineId(pipeline.id)
      }

      // Load pipeline venues
      await loadVenues()
      setLoading(false)
    }

    loadData()
  }, [])

  const loadVenues = async () => {
    try {
      const response = await fetch('/api/pipeline/venues')
      const data = await response.json()
      if (data.venues) {
        setVenues(data.venues)
      }
    } catch (error) {
      console.error('Failed to load venues:', error)
    }
  }

  const handleStatusChange = async (venueId: string, newStatus: any) => {
    const venue = venues.find(v => v.id === venueId)
    if (!venue?.pipeline_venue_id) return

    // Optimistic update
    setVenues(prev =>
      prev.map(v => (v.id === venueId ? { ...v, status: newStatus } : v))
    )

    try {
      const response = await fetch('/api/pipeline/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineVenueId: venue.pipeline_venue_id,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        // Revert on error
        await loadVenues()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      await loadVenues()
    }
  }

  const handleSendEmail = (venue: Venue) => {
    setSelectedVenue(venue)
    setShowEmailComposer(true)
  }

  const handleComposeBlankEmail = () => {
    setSelectedVenue(null)
    setShowEmailComposer(true)
  }

  const handleEmailSent = async (recipientEmail: string, subject: string, body: string) => {
    try {
      let response

      if (selectedVenue?.pipeline_venue_id) {
        // Sending to a pipeline venue
        response = await fetch('/api/pipeline/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pipelineVenueId: selectedVenue.pipeline_venue_id,
            subject,
            body,
          }),
        })
      } else {
        // Sending a blank email (not tied to pipeline)
        response = await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientEmail,
            subject,
            body,
          }),
        })
      }

      const data = await response.json()

      if (response.ok) {
        if (selectedVenue) {
          setVenues(prev =>
            prev.map(v =>
              v.id === selectedVenue.id ? { ...v, status: 'contacted' } : v
            )
          )
        }
        setShowEmailComposer(false)
        setSelectedVenue(null)
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

  const handlePriorityChange = async (venueId: string, priority: number) => {
    const venue = venues.find(v => v.id === venueId)
    if (!venue?.pipeline_venue_id) return

    // Optimistic update
    setVenues(prev =>
      prev.map(v => (v.id === venueId ? { ...v, priority } : v))
    )

    try {
      const response = await fetch('/api/pipeline/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineVenueId: venue.pipeline_venue_id,
          priority,
        }),
      })

      if (!response.ok) {
        await loadVenues()
      }
    } catch (error) {
      console.error('Failed to update priority:', error)
      await loadVenues()
    }
  }

  const handleEditNotes = (venue: Venue) => {
    setSelectedVenue(venue)
    setEditingNotes(venue.notes || '')
    setShowNotesModal(true)
  }

  const handleSaveNotes = async () => {
    if (!selectedVenue?.pipeline_venue_id) return

    try {
      const response = await fetch('/api/pipeline/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineVenueId: selectedVenue.pipeline_venue_id,
          notes: editingNotes,
        }),
      })

      if (response.ok) {
        setVenues(prev =>
          prev.map(v =>
            v.id === selectedVenue.id ? { ...v, notes: editingNotes } : v
          )
        )
        setShowNotesModal(false)
        setSelectedVenue(null)
        toast.success('Notes saved!')
      } else {
        toast.error('Failed to save notes')
      }
    } catch (error) {
      console.error('Failed to save notes:', error)
      toast.error('Failed to save notes')
    }
  }

  const handleArchive = async (venueId: string, type: 'archived' | 'declined' = 'archived') => {
    const venue = venues.find((v) => v.id === venueId)
    if (!venue?.pipeline_venue_id) return

    // Optimistic update - remove from list
    setVenues((prev) => prev.filter((v) => v.id !== venueId))

    const message = type === 'archived' ? 'archived' : 'declined'
    toast.success(`Venue ${message}!`, { icon: type === 'archived' ? '📦' : '❌' })

    try {
      const response = await fetch('/api/pipeline/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineVenueId: venue.pipeline_venue_id,
          status: type,
        }),
      })

      if (!response.ok) {
        await loadVenues() // Revert on error
        toast.error('Failed to update venue')
      }
    } catch (error) {
      console.error('Failed to archive:', error)
      await loadVenues()
    }
  }

  const handleDelete = async (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId)
    if (!venue?.pipeline_venue_id) return

    const toastId = toast.loading('Deleting venue...')

    try {
      const response = await fetch('/api/pipeline/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineVenueId: venue.pipeline_venue_id,
        }),
      })

      if (response.ok) {
        setVenues((prev) => prev.filter((v) => v.id !== venueId))
        toast.success('Venue deleted permanently', { id: toastId })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete', { id: toastId })
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error('Failed to delete venue', { id: toastId })
    }
  }

  const handleAddVenue = async (venueId: string) => {
    if (!pipelineId) {
      toast.error('Pipeline not found')
      return
    }

    const toastId = toast.loading('Adding venue to pipeline...')

    try {
      const response = await fetch('/api/pipeline/add-venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipelineId,
          venueId,
          priority: 2,
        }),
      })

      if (response.ok) {
        await loadVenues()
        setShowSearch(false)
        toast.success('Venue added to pipeline!', { id: toastId })
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to add venue', { id: toastId })
      }
    } catch (error) {
      console.error('Failed to add venue:', error)
      toast.error('Failed to add venue', { id: toastId })
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
      <Navigation
        user={user}
        aiCreditsBalance={credits}
        subscriptionTier={subscriptionTier}
        onComposeEmail={handleComposeBlankEmail}
      />

      <main className="px-4 py-6 md:p-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2">MY PIPELINE</h1>
                <p className="text-sm md:text-base text-gray-600">
                  Track your venue outreach from discovery to booking
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  href="/history"
                  className="btn-secondary shadow-brutalist inline-block text-center text-sm sm:text-base py-2 sm:py-3"
                >
                  📦 HISTORY
                </Link>
                <button
                  onClick={() => setShowSearch(true)}
                  className="btn-secondary shadow-brutalist text-sm sm:text-base py-2 sm:py-3"
                >
                  + QUICK ADD
                </button>
              </div>
            </div>

            {/* Prominent Browse Button */}
            {venues.length === 0 && (
              <Link
                href="/venues"
                className="btn-primary shadow-brutalist-lg text-center text-base sm:text-lg py-4 sm:py-5 hover:scale-105 transition-transform"
              >
                🔍 BROWSE VENUES
              </Link>
            )}
          </div>

          {/* Empty State */}
          {venues.length === 0 && (
            <div className="border-brutalist shadow-brutalist-lg bg-white p-12 text-center animate-slide-up">
              <div className="text-6xl mb-6">🎸</div>
              <h2 className="text-3xl font-black mb-4">YOUR PIPELINE IS EMPTY</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Start building your venue list. Browse our database to find venues that match your style.
              </p>
            </div>
          )}

          {/* Pipeline Table */}
          {venues.length > 0 && (
            <div className="animate-slide-up">
              <PipelineTable
                venues={venues}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onSendEmail={handleSendEmail}
                onEditNotes={handleEditNotes}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Modals */}
          {showSearch && (
            <VenueSearch
              onAddVenue={handleAddVenue}
              onClose={() => setShowSearch(false)}
            />
          )}

          {showEmailComposer && (
            <EmailComposer
              venueName={selectedVenue?.name}
              venueEmail={selectedVenue?.email}
              venueId={selectedVenue?.id}
              pipelineVenueId={selectedVenue?.pipeline_venue_id}
              creditsBalance={credits}
              onSend={handleEmailSent}
              onClose={() => {
                setShowEmailComposer(false)
                setSelectedVenue(null)
              }}
              onCreditsUpdate={(newBalance) => setCredits(newBalance)}
            />
          )}

          {/* Notes Modal */}
          {showNotesModal && selectedVenue && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white border-3 border-black shadow-brutalist max-w-2xl w-full">
                <div className="p-6 border-b-3 border-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black">EDIT NOTES</h2>
                      <p className="text-sm text-gray-600 mt-1">{selectedVenue.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowNotesModal(false)
                        setSelectedVenue(null)
                      }}
                      className="text-2xl font-black hover:bg-black hover:text-white px-3 py-1 border-2 border-black"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add notes about this venue..."
                    className="w-full border-2 border-black p-3 font-mono text-sm min-h-[200px]"
                  />
                </div>

                <div className="p-6 border-t-3 border-black flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowNotesModal(false)
                      setSelectedVenue(null)
                    }}
                    className="border-2 border-black px-6 py-2 font-bold hover:bg-gray-100"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="border-2 border-black bg-black text-white px-6 py-2 font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    SAVE NOTES
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
