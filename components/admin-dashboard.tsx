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
  venue_type: string  // Single value: 'bar', 'club', 'theater', etc.
  music_focus: string[]  // Array of genres
  capacity: number
  booking_email: string
  created_at: string
}

interface AdminDashboardProps {
  user: { email: string; id: string }
  profile: any
}

type VenueSortField = 'name' | 'city' | 'state' | 'capacity' | 'created_at'
type SortDirection = 'asc' | 'desc'

export function AdminDashboard({ user, profile }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'venues'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [showCreateVenue, setShowCreateVenue] = useState(false)
  const [venueSortField, setVenueSortField] = useState<VenueSortField>('name')
  const [venueSortDirection, setVenueSortDirection] = useState<SortDirection>('asc')
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

  // Load venues
  const loadVenues = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setVenues(data)
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
    } else {
      loadVenues()
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
              <button
                onClick={() => setShowCreateVenue(true)}
                className="border-2 border-black bg-black text-white px-4 py-2 font-bold hover:bg-accent-blue transition-colors"
              >
                + CREATE VENUE
              </button>
            </div>

            {loading ? (
              <p>Loading venues...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-2 border-black text-sm">
                  <thead>
                    <tr className="bg-black text-white">
                      <th
                        className="border-2 border-black p-2 text-left cursor-pointer hover:bg-gray-800 whitespace-nowrap"
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
                      <th className="border-2 border-black p-2 text-left whitespace-nowrap">BOOKING EMAIL</th>
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
                      <tr key={v.id} className="hover:bg-accent-yellow">
                        <td className="border-2 border-black p-2 font-bold whitespace-nowrap">{v.name}</td>
                        <td className="border-2 border-black p-2 whitespace-nowrap">{v.city}</td>
                        <td className="border-2 border-black p-2 whitespace-nowrap">{v.state}</td>
                        <td className="border-2 border-black p-2 text-xs max-w-xs truncate" title={v.email}>{v.email}</td>
                        <td className="border-2 border-black p-2 text-xs max-w-xs truncate" title={v.booking_email || ''}>
                          {v.booking_email || '-'}
                        </td>
                        <td className="border-2 border-black p-2 whitespace-nowrap">{v.phone || '-'}</td>
                        <td className="border-2 border-black p-2 text-xs max-w-xs truncate" title={v.website || ''}>
                          {v.website ? (
                            <a href={v.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {v.website.replace(/^https?:\/\//i, '')}
                            </a>
                          ) : '-'}
                        </td>
                        <td className="border-2 border-black p-2 text-center">{v.capacity || '-'}</td>
                        <td className="border-2 border-black p-2 whitespace-nowrap">
                          {v.venue_type || '-'}
                        </td>
                        <td className="border-2 border-black p-2 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {v.music_focus?.slice(0, 3).map((g, i) => (
                              <span key={i} className="text-xs px-1 py-0.5 bg-gray-200 border border-gray-400 whitespace-nowrap">
                                {g}
                              </span>
                            ))}
                            {v.music_focus?.length > 3 && (
                              <span className="text-xs text-gray-500">+{v.music_focus.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="border-2 border-black p-2 whitespace-nowrap text-xs">
                          {new Date(v.created_at).toLocaleDateString()}
                        </td>
                        <td className="border-2 border-black p-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingVenue(v)}
                              className="border-2 border-black bg-accent-blue text-white px-3 py-1 font-bold text-sm hover:bg-accent-purple transition-colors"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => deleteVenue(v.id)}
                              className="border-2 border-black bg-red-500 text-white px-3 py-1 font-bold text-sm hover:bg-red-600 transition-colors"
                            >
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      booking_email: '',
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
              <label className="block font-bold mb-2">BOOKING EMAIL</label>
              <input
                type="email"
                className="w-full border-2 border-black p-2"
                value={formData.booking_email}
                onChange={(e) => setFormData({ ...formData, booking_email: e.target.value })}
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
