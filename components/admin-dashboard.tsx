'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navigation } from '@/components/navigation'
import toast from 'react-hot-toast'

interface User {
  user_id: string
  email: string
  display_name: string
  subscription_tier: string
  ai_credits_balance: number
  is_admin: boolean
  created_at: string
  last_sign_in_at: string
}

interface Venue {
  id: string
  name: string
  city: string
  state: string
  email: string
  phone: string
  website: string
  address?: string
  zip_code?: string
  country?: string
  description?: string
  venue_type: string  // Single value: 'bar', 'club', 'theater', etc.
  music_focus: string[]  // Array of genres
  capacity: number
  instagram_handle?: string
  facebook_url?: string
  is_verified: boolean
  created_at: string
}

interface AdminDashboardProps {
  user: { email: string; id: string }
  profile: any
}

type VenueSortField = 'name' | 'city' | 'state' | 'capacity' | 'created_at'
type SortDirection = 'asc' | 'desc'

export function AdminDashboard({ user, profile }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'venues' | 'pending'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [pendingVenues, setPendingVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [showCreateVenue, setShowCreateVenue] = useState(false)
  const [venueSortField, setVenueSortField] = useState<VenueSortField>('name')
  const [venueSortDirection, setVenueSortDirection] = useState<SortDirection>('asc')

  // Enrichment state
  const [enrichingVenueId, setEnrichingVenueId] = useState<string | null>(null)
  const [enrichmentData, setEnrichmentData] = useState<any>(null)
  const [showEnrichmentReview, setShowEnrichmentReview] = useState(false)
  const [currentVenueData, setCurrentVenueData] = useState<any>(null)

  // Bulk enrichment state
  const [selectedVenues, setSelectedVenues] = useState<{ [id: string]: boolean }>({})
  const [showBulkEnrichModal, setShowBulkEnrichModal] = useState(false)
  const [bulkEnrichmentProgress, setBulkEnrichmentProgress] = useState<{ total: number; completed: number; results: any[] } | null>(null)

  // Pending venues selection state
  const [selectedPendingVenues, setSelectedPendingVenues] = useState<{ [id: string]: boolean }>({})

  // Discovery state
  const [showDiscoverVenues, setShowDiscoverVenues] = useState(false)
  const [discoveryCity, setDiscoveryCity] = useState('')
  const [discoveryState, setDiscoveryState] = useState('NC')
  const [discoveredVenues, setDiscoveredVenues] = useState<any[]>([])
  const [discoveringVenues, setDiscoveringVenues] = useState(false)

  const supabase = createClient()

  // Load users
  const loadUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('admin_get_users', {
      p_admin_user_id: user.id
    })
    if (data) {
      setUsers(data)
    }
    setLoading(false)
  }

  // Load venues (verified only)
  const loadVenues = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
    if (data) {
      setVenues(data)
    }
    setLoading(false)
  }

  // Load pending venues (unverified)
  const loadPendingVenues = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('is_verified', false)
      .order('created_at', { ascending: false })
    if (data) {
      setPendingVenues(data)
    }
    setLoading(false)
  }

  // Sort venues
  const sortedVenues = [...venues].sort((a, b) => {
    const aVal = a[venueSortField]
    const bVal = b[venueSortField]

    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    let comparison = 0
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal)
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }

    return venueSortDirection === 'asc' ? comparison : -comparison
  })

  // Handle venue sort
  const handleVenueSort = (field: VenueSortField) => {
    if (venueSortField === field) {
      setVenueSortDirection(venueSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setVenueSortField(field)
      setVenueSortDirection('asc')
    }
  }

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'venues') {
      loadVenues()
    } else if (activeTab === 'pending') {
      loadPendingVenues()
    }
  }, [activeTab])

  // Update user tier
  const updateUserTier = async (userId: string, newTier: string) => {
    const { data, error } = await supabase.rpc('admin_update_user_tier', {
      p_admin_user_id: user.id,
      p_target_user_id: userId,
      p_new_tier: newTier
    })

    if (error) {
      toast.error('Error updating tier: ' + error.message)
    } else {
      toast.success('Tier updated successfully')
      setEditingUser(null)
      loadUsers()
    }
  }

  // Update user credits
  const updateUserCredits = async (userId: string, newBalance: number) => {
    const { data, error } = await supabase.rpc('admin_update_user_credits', {
      p_admin_user_id: user.id,
      p_target_user_id: userId,
      p_new_balance: newBalance
    })

    if (error) {
      toast.error('Error updating credits: ' + error.message)
    } else {
      toast.success('Credits updated successfully')
      setEditingUser(null)
      loadUsers()
    }
  }

  // Create venue
  const createVenue = async (venue: Partial<Venue>) => {
    const { data, error } = await supabase
      .from('venues')
      .insert(venue)
      .select()
      .single()

    if (error) {
      toast.error('Error creating venue: ' + error.message)
    } else {
      toast.success('Venue created successfully')
      setShowCreateVenue(false)
      loadVenues()
    }
  }

  // Update venue
  const updateVenue = async (venueId: string, updates: Partial<Venue>) => {
    const { data, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', venueId)

    if (error) {
      toast.error('Error updating venue: ' + error.message)
    } else {
      toast.success('Venue updated successfully')
      setEditingVenue(null)
      loadVenues()
    }
  }

  // Delete venue
  const deleteVenue = async (venueId: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId)

    if (error) {
      toast.error('Error deleting venue: ' + error.message)
    } else {
      toast.success('Venue deleted successfully')
      loadVenues()
    }
  }

  // Enrich venue with AI
  const handleEnrichVenue = async (venueId: string) => {
    setEnrichingVenueId(venueId)

    try {
      const response = await fetch('/api/admin/enrich-venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to enrich venue')
        return
      }

      // Show review modal with suggestions
      setEnrichmentData(data.enrichmentData)
      setCurrentVenueData(data.currentData)
      setShowEnrichmentReview(true)
      toast.success('Enrichment complete! Review suggestions below.')
    } catch (error) {
      toast.error('Failed to enrich venue')
    } finally {
      setEnrichingVenueId(null)
    }
  }

  // Apply selected enrichment fields
  const handleApplyEnrichment = async (approvedFields: any) => {
    if (!currentVenueData) return

    try {
      // Build update object from approved fields
      const updates: any = {}
      Object.keys(approvedFields).forEach(key => {
        if (approvedFields[key]) {
          // Map social media field variations to correct database columns
          let mappedKey = key
          if (key === 'facebook_handle' || key === 'facebook' || key === 'facebook_url') {
            mappedKey = 'facebook_url'
          } else if (key === 'instagram' || key === 'instagram_url') {
            mappedKey = 'instagram_handle'
          }
          updates[mappedKey] = enrichmentData[key]?.value
        }
      })

      await updateVenue(currentVenueData.id, updates)
      setShowEnrichmentReview(false)
      setEnrichmentData(null)
      setCurrentVenueData(null)
      toast.success('Venue updated with enriched data!')
    } catch (error) {
      toast.error('Failed to apply enrichment')
    }
  }

  // Discover new venues
  const handleDiscoverVenues = async () => {
    if (!discoveryCity || !discoveryState) {
      toast.error('Please enter city and state')
      return
    }

    setDiscoveringVenues(true)

    try {
      const response = await fetch('/api/admin/discover-venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: discoveryCity,
          state: discoveryState,
          limit: 10,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to discover venues')
        return
      }

      setDiscoveredVenues(data.venues || [])
      toast.success(`Found ${data.venues?.length || 0} new venues!`)
    } catch (error) {
      toast.error('Failed to discover venues')
    } finally {
      setDiscoveringVenues(false)
    }
  }

  // Bulk add discovered venues (as pending/unverified)
  const handleAddDiscoveredVenues = async (venuesToAdd: any[]) => {
    if (venuesToAdd.length === 0) {
      toast.error('No venues selected')
      return
    }

    try {
      // Remove confidence field (not in database) and set as unverified
      const venuesWithVerified = venuesToAdd.map(v => {
        const { confidence, ...venueData } = v
        return {
          ...venueData,
          is_verified: false, // Add as pending approval
        }
      })

      const { error } = await supabase
        .from('venues')
        .insert(venuesWithVerified)

      if (error) {
        toast.error('Error adding venues: ' + error.message)
      } else {
        toast.success(`Added ${venuesToAdd.length} venues to pending approval!`)
        setDiscoveredVenues([])
        setShowDiscoverVenues(false)
        // Reload pending venues if on that tab
        if (activeTab === 'pending') {
          loadPendingVenues()
        }
      }
    } catch (error) {
      toast.error('Failed to add venues')
    }
  }

  // Approve venue
  const approveVenue = async (venueId: string) => {
    const { error } = await supabase
      .from('venues')
      .update({ is_verified: true })
      .eq('id', venueId)

    if (error) {
      toast.error('Error approving venue: ' + error.message)
    } else {
      toast.success('Venue approved!')
      loadPendingVenues()
    }
  }

  // Reject venue (delete it)
  const rejectVenue = async (venueId: string) => {
    if (!confirm('Are you sure you want to reject and delete this venue?')) return

    const { error} = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId)

    if (error) {
      toast.error('Error rejecting venue: ' + error.message)
    } else {
      toast.success('Venue rejected and deleted')
      loadPendingVenues()
    }
  }

  // Batch approve pending venues
  const batchApprovePendingVenues = async () => {
    const selectedIds = Object.keys(selectedPendingVenues).filter(id => selectedPendingVenues[id])
    if (selectedIds.length === 0) {
      toast.error('No venues selected')
      return
    }

    if (!confirm(`Approve ${selectedIds.length} venue(s)?`)) return

    const { error } = await supabase
      .from('venues')
      .update({ is_verified: true })
      .in('id', selectedIds)

    if (error) {
      toast.error('Error approving venues: ' + error.message)
    } else {
      toast.success(`${selectedIds.length} venue(s) approved!`)
      setSelectedPendingVenues({})
      loadPendingVenues()
    }
  }

  // Batch reject pending venues
  const batchRejectPendingVenues = async () => {
    const selectedIds = Object.keys(selectedPendingVenues).filter(id => selectedPendingVenues[id])
    if (selectedIds.length === 0) {
      toast.error('No venues selected')
      return
    }

    if (!confirm(`Reject and delete ${selectedIds.length} venue(s)? This cannot be undone.`)) return

    const { error } = await supabase
      .from('venues')
      .delete()
      .in('id', selectedIds)

    if (error) {
      toast.error('Error rejecting venues: ' + error.message)
    } else {
      toast.success(`${selectedIds.length} venue(s) rejected and deleted`)
      setSelectedPendingVenues({})
      loadPendingVenues()
    }
  }

  // Toggle pending venue selection
  const togglePendingVenueSelection = (venueId: string) => {
    setSelectedPendingVenues(prev => ({
      ...prev,
      [venueId]: !prev[venueId]
    }))
  }

  // Select all pending venues
  const toggleAllPendingVenues = () => {
    const allSelected = pendingVenues.every(v => selectedPendingVenues[v.id])
    if (allSelected) {
      setSelectedPendingVenues({})
    } else {
      const newSelection: { [id: string]: boolean } = {}
      pendingVenues.forEach(v => { newSelection[v.id] = true })
      setSelectedPendingVenues(newSelection)
    }
  }

  // Toggle venue selection
  const toggleVenueSelection = (venueId: string) => {
    setSelectedVenues(prev => ({
      ...prev,
      [venueId]: !prev[venueId]
    }))
  }

  // Select/deselect all venues
  const selectAllVenues = () => {
    const allSelected: { [id: string]: boolean } = {}
    sortedVenues.forEach(v => {
      allSelected[v.id] = true
    })
    setSelectedVenues(allSelected)
  }

  const deselectAllVenues = () => {
    setSelectedVenues({})
  }

  // Handle bulk enrichment
  const handleBulkEnrich = async (fields: string[]) => {
    const venueIds: string[] = Object.keys(selectedVenues).filter(id => selectedVenues[id])

    if (venueIds.length === 0 || fields.length === 0) {
      toast.error('Please select venues and fields')
      return
    }

    setBulkEnrichmentProgress({ total: venueIds.length, completed: 0, results: [] })

    try {
      const results: { venueId: string; success: boolean; data?: any; error?: any }[] = []
      for (let i = 0; i < venueIds.length; i++) {
        const venueId = venueIds[i]!

        try {
          const response = await fetch('/api/admin/enrich-venue-bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ venueId, fields }),
          })

          const data = await response.json()
          results.push({ venueId, success: response.ok, data })

          setBulkEnrichmentProgress(prev => prev ? {
            ...prev,
            completed: i + 1,
            results
          } : null)
        } catch (error) {
          results.push({ venueId, success: false, error })
        }
      }

      // Reload venues to show updated data
      if (activeTab === 'venues') {
        await loadVenues()
      } else if (activeTab === 'pending') {
        await loadPendingVenues()
      }

      const successCount = results.filter(r => r.success).length
      toast.success(`Enriched ${successCount}/${venueIds.length} venues successfully!`)

      setShowBulkEnrichModal(false)
      setSelectedVenues({})
      setSelectedPendingVenues({})
      setBulkEnrichmentProgress(null)
    } catch (error) {
      toast.error('Bulk enrichment failed')
      setBulkEnrichmentProgress(null)
    }
  }

  const selectedVenueCount = Object.values(selectedVenues).filter(Boolean).length

  return (
    <div className="min-h-screen bg-accent-yellow">
      <Navigation
        user={user}
        aiCreditsBalance={profile?.ai_credits_balance || 0}
        subscriptionTier={profile?.subscription_tier}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="border-3 border-black bg-white p-6 mb-6 shadow-brutalist">
          <h1 className="text-4xl font-black mb-2">ADMIN DASHBOARD</h1>
          <p className="text-sm">Manage users and venues</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`font-bold px-6 py-3 border-2 border-black transition-all ${
              activeTab === 'users'
                ? 'bg-black text-white'
                : 'bg-white hover:bg-black hover:text-white'
            }`}
          >
            USERS
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`font-bold px-6 py-3 border-2 border-black transition-all ${
              activeTab === 'venues'
                ? 'bg-black text-white'
                : 'bg-white hover:bg-black hover:text-white'
            }`}
          >
            VENUES
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`font-bold px-6 py-3 border-2 border-black transition-all ${
              activeTab === 'pending'
                ? 'bg-black text-white'
                : 'bg-white hover:bg-black hover:text-white'
            }`}
          >
            PENDING APPROVAL {pendingVenues.length > 0 && `(${pendingVenues.length})`}
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="border-3 border-black bg-white p-6 shadow-brutalist">
            <h2 className="text-2xl font-black mb-4">USER MANAGEMENT</h2>

            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-2 border-black">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border-2 border-black p-2 text-left">EMAIL</th>
                      <th className="border-2 border-black p-2 text-left">NAME</th>
                      <th className="border-2 border-black p-2 text-left">TIER</th>
                      <th className="border-2 border-black p-2 text-left">CREDITS</th>
                      <th className="border-2 border-black p-2 text-left">ADMIN</th>
                      <th className="border-2 border-black p-2 text-left">CREATED</th>
                      <th className="border-2 border-black p-2 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id} className="hover:bg-accent-yellow">
                        <td className="border-2 border-black p-2">{u.email}</td>
                        <td className="border-2 border-black p-2">{u.display_name || '-'}</td>
                        <td className="border-2 border-black p-2">
                          <span className={`px-2 py-1 font-bold text-xs border-2 border-black ${
                            u.subscription_tier === 'agency' ? 'bg-accent-purple text-white' :
                            u.subscription_tier === 'pro' ? 'bg-accent-blue text-white' :
                            'bg-white'
                          }`}>
                            {u.subscription_tier.toUpperCase()}
                          </span>
                        </td>
                        <td className="border-2 border-black p-2 font-mono">{u.ai_credits_balance}</td>
                        <td className="border-2 border-black p-2">{u.is_admin ? '✓' : '-'}</td>
                        <td className="border-2 border-black p-2 text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="border-2 border-black p-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="border-2 border-black bg-accent-blue text-white px-3 py-1 font-bold text-sm hover:bg-accent-purple transition-colors"
                          >
                            EDIT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white border-3 border-black p-6 max-w-md w-full shadow-brutalist">
                  <h3 className="text-xl font-black mb-4">EDIT USER: {editingUser.email}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold mb-2">SUBSCRIPTION TIER</label>
                      <select
                        className="w-full border-2 border-black p-2"
                        defaultValue={editingUser.subscription_tier}
                        onChange={(e) => updateUserTier(editingUser.user_id, e.target.value)}
                      >
                        <option value="free">FREE</option>
                        <option value="pro">PRO</option>
                        <option value="agency">AGENCY</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold mb-2">AI CREDITS BALANCE</label>
                      <input
                        type="number"
                        className="w-full border-2 border-black p-2"
                        defaultValue={editingUser.ai_credits_balance}
                        onBlur={(e) => {
                          const newBalance = parseInt(e.target.value)
                          if (!isNaN(newBalance)) {
                            updateUserCredits(editingUser.user_id, newBalance)
                          }
                        }}
                      />
                    </div>

                    <button
                      onClick={() => setEditingUser(null)}
                      className="w-full border-2 border-black bg-white px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Venues Tab */}
        {activeTab === 'venues' && (
          <div className="border-3 border-black bg-white p-6 shadow-brutalist">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black">VENUE MANAGEMENT</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDiscoverVenues(true)}
                  className="border-2 border-black bg-accent-purple text-white px-4 py-2 font-bold hover:bg-accent-blue transition-colors"
                >
                  🔍 DISCOVER VENUES
                </button>
                <button
                  onClick={() => setShowCreateVenue(true)}
                  className="border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-accent-blue transition-colors"
                >
                  + CREATE VENUE
                </button>
              </div>
            </div>

            {/* Bulk Selection Controls */}
            {selectedVenueCount > 0 && (
              <div className="mb-4 p-4 border-2 border-black bg-accent-yellow flex items-center justify-between">
                <div>
                  <span className="font-bold">{selectedVenueCount} venue(s) selected</span>
                  <button
                    onClick={deselectAllVenues}
                    className="ml-4 text-sm underline hover:no-underline"
                  >
                    Deselect All
                  </button>
                </div>
                <button
                  onClick={() => setShowBulkEnrichModal(true)}
                  className="border-2 border-black bg-accent-purple text-white px-4 py-2 font-bold hover:bg-accent-blue transition-colors"
                >
                  ✨ BULK ENRICH ({selectedVenueCount})
                </button>
              </div>
            )}

            {loading ? (
              <p>Loading venues...</p>
            ) : (
              <>
                <div className="mb-2 text-sm text-gray-600">
                  Showing {sortedVenues.length} venue{sortedVenues.length !== 1 ? 's' : ''}
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full border-2 border-black text-xs">
                  <thead className="sticky top-0 bg-black text-white z-10">
                    <tr className="bg-black text-white">
                      <th className="border-2 border-black p-2 text-center sticky left-0 bg-black z-20 w-10">
                        <input
                          type="checkbox"
                          onChange={(e) => e.target.checked ? selectAllVenues() : deselectAllVenues()}
                          checked={sortedVenues.length > 0 && sortedVenues.every(v => selectedVenues[v.id])}
                          className="w-4 h-4"
                        />
                      </th>
                      <th
                        className="border-2 border-black p-2 text-left cursor-pointer hover:bg-gray-800 sticky left-10 bg-black z-20"
                        onClick={() => handleVenueSort('name')}
                      >
                        NAME {venueSortField === 'name' && (venueSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="border-2 border-black p-2 text-left cursor-pointer hover:bg-gray-800 whitespace-nowrap"
                        onClick={() => handleVenueSort('city')}
                      >
                        CITY {venueSortField === 'city' && (venueSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        className="border-2 border-black p-2 text-left cursor-pointer hover:bg-gray-800 whitespace-nowrap"
                        onClick={() => handleVenueSort('state')}
                      >
                        STATE {venueSortField === 'state' && (venueSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">EMAIL</th>
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">PHONE</th>
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">WEBSITE</th>
                      <th
                        className="border-2 border-black p-2 text-left cursor-pointer hover:bg-gray-800 whitespace-nowrap"
                        onClick={() => handleVenueSort('capacity')}
                      >
                        CAPACITY {venueSortField === 'capacity' && (venueSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">VENUE TYPE</th>
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">GENRES</th>
                      <th
                        className="border-2 border-black p-2 text-left cursor-pointer hover:bg-gray-800 whitespace-nowrap"
                        onClick={() => handleVenueSort('created_at')}
                      >
                        CREATED {venueSortField === 'created_at' && (venueSortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVenues.map((v) => (
                      <tr key={v.id} className={`${selectedVenues[v.id] ? 'bg-accent-yellow' : 'hover:bg-gray-50'}`}>
                        <td className={`border-2 border-black p-1 text-center sticky left-0 z-10 ${selectedVenues[v.id] ? 'bg-accent-yellow' : 'bg-white'}`}>
                          <input
                            type="checkbox"
                            checked={selectedVenues[v.id] || false}
                            onChange={() => toggleVenueSelection(v.id)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className={`border-2 border-black p-1 font-bold whitespace-nowrap sticky left-10 z-10 max-w-[200px] truncate ${selectedVenues[v.id] ? 'bg-accent-yellow' : 'bg-white'}`} title={v.name}>{v.name}</td>
                        <td className="border-2 border-black p-1 whitespace-nowrap">{v.city}</td>
                        <td className="border-2 border-black p-1 whitespace-nowrap">{v.state}</td>
                        <td className="border-2 border-black p-1 text-xs max-w-[150px] truncate" title={v.email}>{v.email}</td>
                        <td className="border-2 border-black p-1 text-xs whitespace-nowrap">{v.phone || '-'}</td>
                        <td className="border-2 border-black p-1 text-xs max-w-[150px] truncate" title={v.website || ''}>
                          {v.website ? (
                            <a href={v.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {v.website.replace(/^https?:\/\//i, '').substring(0, 20)}...
                            </a>
                          ) : '-'}
                        </td>
                        <td className="border-2 border-black p-1 text-center text-xs">{v.capacity || '-'}</td>
                        <td className="border-2 border-black p-1 text-xs whitespace-nowrap">
                          {v.venue_type || '-'}
                        </td>
                        <td className="border-2 border-black p-1 max-w-[120px]">
                          <div className="flex flex-wrap gap-1">
                            {v.music_focus?.slice(0, 2).map((g, i) => (
                              <span key={i} className="text-xs px-1 py-0.5 bg-gray-200 border border-gray-400 whitespace-nowrap">
                                {g}
                              </span>
                            ))}
                            {v.music_focus?.length > 2 && (
                              <span className="text-xs text-gray-500">+{v.music_focus.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="border-2 border-black p-1 whitespace-nowrap text-xs">
                          {new Date(v.created_at).toLocaleDateString()}
                        </td>
                        <td className="border-2 border-black p-1">
                          <div className="flex gap-1 flex-wrap">
                            <button
                              onClick={() => handleEnrichVenue(v.id)}
                              disabled={enrichingVenueId === v.id}
                              className="border border-black bg-accent-yellow text-black px-2 py-0.5 font-bold text-xs hover:bg-accent-purple hover:text-white transition-colors disabled:opacity-50"
                              title="Enrich venue data"
                            >
                              {enrichingVenueId === v.id ? '...' : '✨'}
                            </button>
                            <button
                              onClick={() => setEditingVenue(v)}
                              className="border border-black bg-accent-blue text-white px-2 py-0.5 font-bold text-xs hover:bg-accent-purple transition-colors"
                              title="Edit venue"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => deleteVenue(v.id)}
                              className="border border-black bg-red-500 text-white px-2 py-0.5 font-bold text-xs hover:bg-red-600 transition-colors"
                              title="Delete venue"
                            >
                              DEL
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </>
            )}

            {/* Create/Edit Venue Modal */}
            {(showCreateVenue || editingVenue) && (
              <VenueForm
                venue={editingVenue}
                onSave={(venue) => {
                  if (editingVenue) {
                    updateVenue(editingVenue.id, venue)
                  } else {
                    createVenue(venue)
                  }
                }}
                onClose={() => {
                  setShowCreateVenue(false)
                  setEditingVenue(null)
                }}
              />
            )}
          </div>
        )}

        {/* Pending Approval Tab */}
        {activeTab === 'pending' && (
          <div className="border-3 border-black bg-white p-6 shadow-brutalist">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-black">PENDING VENUE APPROVAL</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review and approve venues discovered via AI search
                </p>
              </div>
            </div>

            {loading ? (
              <p>Loading pending venues...</p>
            ) : pendingVenues.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No pending venues to review</p>
                <p className="text-sm text-gray-400">Discover new venues to populate this list</p>
              </div>
            ) : (
              <>
                {/* Batch Actions Header */}
                <div className="mb-4 flex flex-wrap items-center gap-3 p-3 bg-gray-100 border-2 border-black">
                  <label className="flex items-center gap-2 font-bold">
                    <input
                      type="checkbox"
                      checked={pendingVenues.length > 0 && pendingVenues.every(v => selectedPendingVenues[v.id])}
                      onChange={toggleAllPendingVenues}
                      className="w-5 h-5"
                    />
                    SELECT ALL
                  </label>

                  <div className="flex-1"></div>

                  {Object.values(selectedPendingVenues).some(v => v) && (
                    <>
                      <span className="font-bold text-sm">
                        {Object.keys(selectedPendingVenues).filter(id => selectedPendingVenues[id]).length} SELECTED
                      </span>
                      <button
                        onClick={batchApprovePendingVenues}
                        className="border-2 border-black bg-green-500 text-white px-4 py-2 font-bold hover:bg-green-600 transition-colors text-sm"
                      >
                        ✓ APPROVE SELECTED
                      </button>
                      <button
                        onClick={batchRejectPendingVenues}
                        className="border-2 border-black bg-red-500 text-white px-4 py-2 font-bold hover:bg-red-600 transition-colors text-sm"
                      >
                        ✗ REJECT SELECTED
                      </button>
                      <button
                        onClick={() => {
                          // Transfer pending selection to main selection for enrichment
                          setSelectedVenues(selectedPendingVenues)
                          setShowBulkEnrichModal(true)
                        }}
                        className="border-2 border-black bg-accent-purple text-white px-4 py-2 font-bold hover:bg-accent-blue transition-colors text-sm"
                      >
                        🤖 ENRICH SELECTED
                      </button>
                    </>
                  )}
                </div>

                <div className="mb-2 text-sm text-gray-600">
                  {pendingVenues.length} venue{pendingVenues.length !== 1 ? 's' : ''} awaiting approval
                </div>
                <div className="space-y-4">
                  {pendingVenues.map((v) => (
                    <div key={v.id} className="border-2 border-black p-4 bg-gray-50">
                      <div className="flex items-start gap-3 mb-3">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedPendingVenues[v.id] || false}
                          onChange={() => togglePendingVenueSelection(v.id)}
                          className="mt-1 w-5 h-5"
                        />

                        {/* Venue Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-black">{v.name}</h3>
                          <p className="text-sm text-gray-600">
                            {v.city}, {v.state} {v.zip_code && `• ${v.zip_code}`}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEnrichVenue(v.id)}
                            disabled={enrichingVenueId === v.id}
                            className="border-2 border-black bg-accent-purple text-white px-3 py-2 font-bold hover:bg-accent-blue transition-colors text-sm disabled:opacity-50"
                          >
                            {enrichingVenueId === v.id ? '⏳' : '🤖'} ENRICH
                          </button>
                          <button
                            onClick={() => approveVenue(v.id)}
                            className="border-2 border-black bg-green-500 text-white px-4 py-2 font-bold hover:bg-green-600 transition-colors"
                          >
                            ✓ APPROVE
                          </button>
                          <button
                            onClick={() => rejectVenue(v.id)}
                            className="border-2 border-black bg-red-500 text-white px-4 py-2 font-bold hover:bg-red-600 transition-colors"
                          >
                            ✗ REJECT
                          </button>
                        </div>
                      </div>

                      {v.description && (
                        <p className="text-sm mb-3">{v.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-bold">Email:</span> {v.email || '-'}
                        </div>
                        <div>
                          <span className="font-bold">Phone:</span> {v.phone || '-'}
                        </div>
                        <div>
                          <span className="font-bold">Website:</span>{' '}
                          {v.website ? (
                            <a href={v.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {v.website.replace(/^https?:\/\//i, '')}
                            </a>
                          ) : '-'}
                        </div>
                        <div>
                          <span className="font-bold">Capacity:</span> {v.capacity || '-'}
                        </div>
                        <div>
                          <span className="font-bold">Type:</span> {v.venue_type || '-'}
                        </div>
                        <div>
                          <span className="font-bold">Address:</span> {v.address || '-'}
                        </div>
                      </div>

                      {v.music_focus && v.music_focus.length > 0 && (
                        <div className="mt-3">
                          <span className="font-bold text-sm">Genres: </span>
                          <div className="flex flex-wrap gap-1 inline-flex">
                            {v.music_focus.map((g, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-gray-200 border border-gray-400">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(v.instagram_handle || v.facebook_url) && (
                        <div className="mt-3 flex gap-3 text-sm">
                          {v.instagram_handle && (
                            <div>
                              <span className="font-bold">Instagram:</span> {v.instagram_handle}
                            </div>
                          )}
                          {v.facebook_url && (
                            <div>
                              <span className="font-bold">Facebook:</span>{' '}
                              <a href={v.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Link
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Added: {new Date(v.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Enrichment Review Modal */}
        {showEnrichmentReview && enrichmentData && currentVenueData && (
          <EnrichmentReviewModal
            enrichmentData={enrichmentData}
            currentData={currentVenueData}
            onApply={handleApplyEnrichment}
            onClose={() => {
              setShowEnrichmentReview(false)
              setEnrichmentData(null)
              setCurrentVenueData(null)
            }}
          />
        )}

        {/* Discovery Modal */}
        {showDiscoverVenues && (
          <DiscoveryModal
            city={discoveryCity}
            state={discoveryState}
            onCityChange={setDiscoveryCity}
            onStateChange={setDiscoveryState}
            discoveredVenues={discoveredVenues}
            discovering={discoveringVenues}
            onDiscover={handleDiscoverVenues}
            onAddVenues={handleAddDiscoveredVenues}
            onClose={() => {
              setShowDiscoverVenues(false)
              setDiscoveredVenues([])
              setDiscoveryCity('')
              setDiscoveryState('NC')
            }}
          />
        )}

        {/* Bulk Enrichment Modal */}
        {showBulkEnrichModal && (
          <BulkEnrichmentModal
            selectedCount={selectedVenueCount}
            onEnrich={handleBulkEnrich}
            onClose={() => setShowBulkEnrichModal(false)}
            progress={bulkEnrichmentProgress}
          />
        )}
      </div>
    </div>
  )
}

// Venue Form Component
interface VenueFormProps {
  venue: Venue | null
  onSave: (venue: Partial<Venue>) => void
  onClose: () => void
}

function VenueForm({ venue, onSave, onClose }: VenueFormProps) {
  const [formData, setFormData] = useState<Partial<Venue>>(
    venue || {
      name: '',
      city: '',
      state: '',
      email: '',
      phone: '',
      website: '',
      capacity: 0,
      venue_type: '',
      music_focus: [],
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border-3 border-black p-6 max-w-2xl w-full shadow-brutalist my-8">
        <h3 className="text-xl font-black mb-4">
          {venue ? 'EDIT VENUE' : 'CREATE VENUE'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2">NAME *</label>
              <input
                type="text"
                required
                className="w-full border-2 border-black p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">CITY *</label>
              <input
                type="text"
                required
                className="w-full border-2 border-black p-2"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">STATE *</label>
              <input
                type="text"
                required
                className="w-full border-2 border-black p-2"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">EMAIL *</label>
              <input
                type="email"
                required
                className="w-full border-2 border-black p-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">PHONE</label>
              <input
                type="tel"
                className="w-full border-2 border-black p-2"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">WEBSITE</label>
              <input
                type="url"
                className="w-full border-2 border-black p-2"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-2">CAPACITY</label>
              <input
                type="number"
                className="w-full border-2 border-black p-2"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-accent-blue transition-colors"
            >
              {venue ? 'UPDATE' : 'CREATE'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-black bg-white px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Enrichment Review Modal Component
interface EnrichmentReviewModalProps {
  enrichmentData: any
  currentData: any
  onApply: (approvedFields: any) => void
  onClose: () => void
}

function EnrichmentReviewModal({ enrichmentData, currentData, onApply, onClose }: EnrichmentReviewModalProps) {
  const [approvedFields, setApprovedFields] = useState<{ [key: string]: boolean }>({})

  const toggleField = (field: string) => {
    setApprovedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleApply = () => {
    onApply(approvedFields)
  }

  const enrichableFields = Object.keys(enrichmentData).filter(key => key !== 'confidence')
  const hasSelections = Object.values(approvedFields).some(v => v)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border-3 border-black p-6 max-w-4xl w-full shadow-brutalist my-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-black mb-4">✨ ENRICHMENT SUGGESTIONS</h3>
        <p className="text-sm mb-6 text-gray-600">
          Review Claude's suggestions and select which fields to update. Green = new data, Gray = current value.
        </p>

        {enrichableFields.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No enrichment suggestions found. Try again later.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {enrichableFields.map(field => {
              const suggestion = enrichmentData[field]
              const currentValue = currentData[field]
              const isArray = Array.isArray(suggestion?.value)

              return (
                <div key={field} className="border-2 border-black p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={approvedFields[field] || false}
                      onChange={() => toggleField(field)}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <label className="block font-bold text-sm mb-2 uppercase">{field.replace(/_/g, ' ')}</label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Current Value */}
                        <div>
                          <p className="text-xs font-bold mb-1 text-gray-500">CURRENT:</p>
                          <div className="bg-gray-100 border border-gray-300 p-2 text-sm">
                            {isArray && Array.isArray(currentValue) ? (
                              currentValue.length > 0 ? currentValue.join(', ') : '(empty)'
                            ) : (
                              currentValue || '(empty)'
                            )}
                          </div>
                        </div>

                        {/* Suggested Value */}
                        <div>
                          <p className="text-xs font-bold mb-1 text-green-600">SUGGESTED:</p>
                          <div className="bg-green-50 border border-green-400 p-2 text-sm">
                            {isArray ? (
                              Array.isArray(suggestion.value) ? suggestion.value.join(', ') : suggestion.value
                            ) : (
                              suggestion.value
                            )}
                          </div>
                          {suggestion.confidence && (
                            <p className="text-xs text-gray-500 mt-1">Confidence: {suggestion.confidence}%</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleApply}
            disabled={!hasSelections}
            className="flex-1 border-2 border-black bg-black text-white px-4 py-3 font-bold hover:bg-accent-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            APPLY SELECTED ({Object.values(approvedFields).filter(Boolean).length})
          </button>
          <button
            onClick={onClose}
            className="border-2 border-black bg-white px-6 py-3 font-bold hover:bg-black hover:text-white transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}

// Discovery Modal Component
interface DiscoveryModalProps {
  city: string
  state: string
  onCityChange: (city: string) => void
  onStateChange: (state: string) => void
  discoveredVenues: any[]
  discovering: boolean
  onDiscover: () => void
  onAddVenues: (venues: any[]) => void
  onClose: () => void
}

function DiscoveryModal({
  city,
  state,
  onCityChange,
  onStateChange,
  discoveredVenues,
  discovering,
  onDiscover,
  onAddVenues,
  onClose
}: DiscoveryModalProps) {
  const [selectedVenues, setSelectedVenues] = useState<{ [id: number]: boolean }>({})

  const toggleVenue = (index: number) => {
    setSelectedVenues(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const selectAll = () => {
    const allSelected: { [id: number]: boolean } = {}
    discoveredVenues.forEach((_, i) => {
      allSelected[i] = true
    })
    setSelectedVenues(allSelected)
  }

  const deselectAll = () => {
    setSelectedVenues({})
  }

  const handleAddSelected = () => {
    const venuesToAdd = discoveredVenues.filter((_, i) => selectedVenues[i])
    onAddVenues(venuesToAdd)
  }

  const selectedCount = Object.values(selectedVenues).filter(Boolean).length

  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border-3 border-black p-6 max-w-6xl w-full shadow-brutalist my-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-black mb-4">🔍 DISCOVER NEW VENUES</h3>
        <p className="text-sm mb-6 text-gray-600">
          Use AI to find new music venues in a location. Claude will search the web and return venue data.
        </p>

        {/* Search Form */}
        <div className="border-2 border-black p-4 mb-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold mb-2 text-sm">CITY</label>
              <input
                type="text"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="Raleigh, Charlotte, etc."
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">STATE</label>
              <select
                value={state}
                onChange={(e) => onStateChange(e.target.value)}
                className="w-full border-2 border-black p-2"
              >
                {US_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={onDiscover}
            disabled={discovering || !city || !state}
            className="w-full mt-4 border-2 border-black bg-black text-white px-4 py-3 font-bold hover:bg-accent-purple transition-colors disabled:opacity-50"
          >
            {discovering ? 'SEARCHING...' : 'SEARCH FOR VENUES'}
          </button>
        </div>

        {/* Results */}
        {discoveredVenues.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">FOUND {discoveredVenues.length} VENUES</h4>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm border-2 border-black px-3 py-1 hover:bg-gray-100"
                >
                  SELECT ALL
                </button>
                <button
                  onClick={deselectAll}
                  className="text-sm border-2 border-black px-3 py-1 hover:bg-gray-100"
                >
                  DESELECT ALL
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto border-2 border-black p-4">
              {discoveredVenues.map((venue, index) => (
                <div
                  key={index}
                  className={`border-2 border-black p-3 cursor-pointer transition-colors ${
                    selectedVenues[index] ? 'bg-accent-yellow' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => toggleVenue(index)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedVenues[index] || false}
                      onChange={() => toggleVenue(index)}
                      className="mt-1 w-5 h-5"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <h5 className="font-black text-lg">{venue.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {venue.city}, {venue.state} {venue.zip_code && `• ${venue.zip_code}`}
                      </p>
                      {venue.description && (
                        <p className="text-sm mb-2">{venue.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {venue.email && <span>✉️ {venue.email}</span>}
                        {venue.phone && <span>📞 {venue.phone}</span>}
                        {venue.capacity && <span>👥 {venue.capacity}</span>}
                        {venue.website && (
                          <a
                            href={venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🌐 Website
                          </a>
                        )}
                      </div>
                      {venue.music_focus && venue.music_focus.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {venue.music_focus.map((genre: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-200 border border-gray-400">
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                      {venue.confidence && (
                        <p className="text-xs text-gray-500 mt-2">Confidence: {venue.confidence}%</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddSelected}
              disabled={selectedCount === 0}
              className="w-full border-2 border-black bg-accent-purple text-white px-4 py-3 font-bold hover:bg-accent-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ADD SELECTED VENUES ({selectedCount})
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 border-2 border-black bg-white px-4 py-3 font-bold hover:bg-black hover:text-white transition-colors"
        >
          CLOSE
        </button>
      </div>
    </div>
  )
}

// Bulk Enrichment Modal Component
interface BulkEnrichmentModalProps {
  selectedCount: number
  onEnrich: (fields: string[]) => void
  onClose: () => void
  progress: { total: number; completed: number; results: any[] } | null
}

function BulkEnrichmentModal({ selectedCount, onEnrich, onClose, progress }: BulkEnrichmentModalProps) {
  const [selectedFields, setSelectedFields] = useState<{ [key: string]: boolean }>({})

  const availableFields = [
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
    { key: 'address', label: 'Address' },
    { key: 'zip_code', label: 'Zip Code' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'venue_type', label: 'Venue Type' },
    { key: 'music_focus', label: 'Music Focus/Genres' },
    { key: 'description', label: 'Description' },
    { key: 'instagram_handle', label: 'Instagram' },
    { key: 'facebook_url', label: 'Facebook' },
  ]

  const toggleField = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const selectAll = () => {
    const allSelected: { [key: string]: boolean } = {}
    availableFields.forEach(f => {
      allSelected[f.key] = true
    })
    setSelectedFields(allSelected)
  }

  const deselectAll = () => {
    setSelectedFields({})
  }

  const handleStart = () => {
    const fields = Object.keys(selectedFields).filter(key => selectedFields[key])
    if (fields.length === 0) {
      return
    }
    onEnrich(fields)
  }

  const selectedFieldCount = Object.values(selectedFields).filter(Boolean).length
  const isEnriching = progress !== null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border-3 border-black p-6 max-w-2xl w-full shadow-brutalist my-8">
        <h3 className="text-2xl font-black mb-4">✨ BULK ENRICHMENT</h3>
        <p className="text-sm mb-6 text-gray-600">
          Select which fields to enrich for {selectedCount} selected venue(s). Claude will search the web to find missing information.
        </p>

        {!isEnriching ? (
          <>
            {/* Field Selection */}
            <div className="border-2 border-black p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold">SELECT FIELDS TO ENRICH:</h4>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-sm border-2 border-black px-3 py-1 hover:bg-gray-100"
                  >
                    SELECT ALL
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-sm border-2 border-black px-3 py-1 hover:bg-gray-100"
                  >
                    DESELECT ALL
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {availableFields.map(field => (
                  <label key={field.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 border border-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedFields[field.key] || false}
                      onChange={() => toggleField(field.key)}
                      className="w-4 h-4"
                    />
                    <span className="font-bold text-sm">{field.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleStart}
                disabled={selectedFieldCount === 0}
                className={`flex-1 border-2 border-black px-4 py-3 font-bold transition-colors ${
                  selectedFieldCount === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-accent-purple text-white hover:bg-accent-blue'
                }`}
              >
                START ENRICHMENT ({selectedFieldCount} field{selectedFieldCount !== 1 ? 's' : ''})
              </button>
              <button
                onClick={onClose}
                className="border-2 border-black bg-white px-6 py-3 font-bold hover:bg-black hover:text-white transition-colors"
              >
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="border-2 border-black p-4 mb-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="font-bold">ENRICHING VENUES...</span>
                <span className="font-mono">{progress.completed} / {progress.total}</span>
              </div>
              <div className="w-full h-8 border-2 border-black bg-white">
                <div
                  className="h-full bg-accent-purple transition-all duration-300"
                  style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Please wait while we enrich your venues. This may take a few moments.
              </p>
            </div>

            {/* Results Summary */}
            {progress.results.length > 0 && (
              <div className="border-2 border-black p-4 max-h-64 overflow-y-auto">
                <h4 className="font-bold mb-2">RESULTS:</h4>
                <div className="space-y-1 text-sm">
                  {progress.results.map((result, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span>{result.success ? '✓' : '✗'}</span>
                      <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                        Venue {i + 1}: {result.success ? 'Enriched' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
