'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Venue {
  id: string
  name: string
  city: string
  state: string
  email: string
  website?: string
  description?: string
  genres: string[]
  status: 'discovered' | 'approved' | 'contacted' | 'opened' | 'responded' | 'booked'
  priority: number
  contact_attempts: number
  last_contact_at: string | null
  email_opened_at?: string | null
  notes?: string
  pipeline_venue_id?: string
}

interface PipelineTableProps {
  venues: Venue[]
  onStatusChange: (venueId: string, status: Venue['status']) => Promise<void>
  onPriorityChange: (venueId: string, priority: number) => Promise<void>
  onSendEmail: (venue: Venue) => void
  onEditNotes: (venue: Venue) => void
  onArchive: (venueId: string) => void
  onDelete: (venueId: string) => void
}

type SortField = 'name' | 'city' | 'status' | 'priority' | 'contact_attempts' | 'last_contact_at'
type SortDirection = 'asc' | 'desc'

const STATUS_OPTIONS: Array<{ value: Venue['status']; label: string; color: string }> = [
  { value: 'discovered', label: 'Discovered', color: 'bg-gray-100' },
  { value: 'approved', label: 'Approved', color: 'bg-blue-100' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100' },
  { value: 'opened', label: 'Opened', color: 'bg-purple-100' },
  { value: 'responded', label: 'Responded', color: 'bg-orange-100' },
  { value: 'booked', label: 'Booked', color: 'bg-green-100' },
]

const PRIORITY_OPTIONS = [
  { value: 3, label: 'High', color: 'bg-red-500', textColor: 'text-white' },
  { value: 2, label: 'Med', color: 'bg-yellow-500', textColor: 'text-black' },
  { value: 1, label: 'Low', color: 'bg-green-500', textColor: 'text-white' },
]

// Helper function to capitalize genre names for display
const capitalizeGenre = (genre: string) => {
  return genre
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function PipelineTable({
  venues,
  onStatusChange,
  onPriorityChange,
  onSendEmail,
  onEditNotes,
  onArchive,
  onDelete,
}: PipelineTableProps) {
  const [selectedVenues, setSelectedVenues] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Venue['status'] | 'all'>('all')

  // Filter venues
  const filteredVenues = venues.filter(venue => {
    // Status filter
    if (statusFilter !== 'all' && venue.status !== statusFilter) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        venue.name.toLowerCase().includes(query) ||
        venue.city.toLowerCase().includes(query) ||
        venue.state.toLowerCase().includes(query) ||
        venue.genres.some(g => g.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Sort venues
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    let aVal: any = a[sortField]
    let bVal: any = b[sortField]

    // Handle null values
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    // Convert to comparable values
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()

    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const toggleVenue = (venueId: string) => {
    setSelectedVenues(prev => {
      const next = new Set(prev)
      if (next.has(venueId)) {
        next.delete(venueId)
      } else {
        next.add(venueId)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedVenues.size === sortedVenues.length) {
      setSelectedVenues(new Set())
    } else {
      setSelectedVenues(new Set(sortedVenues.map(v => v.id)))
    }
  }

  const handleBulkStatusChange = async (status: Venue['status']) => {
    const promises = Array.from(selectedVenues).map(id => {
      const venue = venues.find(v => v.id === id)
      if (venue) {
        return onStatusChange(id, status)
      }
      return Promise.resolve()
    })

    await Promise.all(promises)
    setSelectedVenues(new Set())
    toast.success(`Updated ${selectedVenues.size} venues`)
  }

  const getStatusColor = (status: Venue['status']) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100'
  }

  const getPriorityOption = (priority: number) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) ?? PRIORITY_OPTIONS[1]
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300">↕</span>
    return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-black px-3 py-2 font-mono text-sm w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Venue['status'] | 'all')}
            className="border-2 border-black px-3 py-2 font-bold text-sm"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedVenues.size > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-sm font-bold">{selectedVenues.size} selected</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value as Venue['status'])
                  e.target.value = ''
                }
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm"
            >
              <option value="">Bulk Update Status</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border-3 border-black bg-white overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-3 border-black bg-gray-50">
            <tr>
              <th className="p-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedVenues.size === sortedVenues.length && sortedVenues.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4"
                />
              </th>
              <th
                className="p-3 text-left font-black text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                NAME <SortIcon field="name" />
              </th>
              <th
                className="p-3 text-left font-black text-sm cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                onClick={() => handleSort('city')}
              >
                CITY <SortIcon field="city" />
              </th>
              <th className="p-3 text-left font-black text-sm hidden md:table-cell">STATE</th>
              <th
                className="p-3 text-left font-black text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                STATUS <SortIcon field="status" />
              </th>
              <th
                className="p-3 text-left font-black text-sm cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                onClick={() => handleSort('priority')}
              >
                PRIORITY <SortIcon field="priority" />
              </th>
              <th
                className="p-3 text-left font-black text-sm cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                onClick={() => handleSort('contact_attempts')}
              >
                CONTACT
              </th>
              <th
                className="p-3 text-left font-black text-sm cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                onClick={() => handleSort('last_contact_at')}
              >
                LAST CONTACT
              </th>
              <th className="p-3 text-left font-black text-sm">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sortedVenues.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  <p className="font-bold">No venues found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              sortedVenues.map((venue) => {
                const priorityOption = getPriorityOption(venue.priority)!
                return (
                  <tr
                    key={venue.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedVenues.has(venue.id)}
                        onChange={() => toggleVenue(venue.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-bold">{venue.name}</div>
                      {venue.genres.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {venue.genres.slice(0, 2).map(capitalizeGenre).join(', ')}
                        </div>
                      )}
                      {/* Show city/state on mobile under name */}
                      <div className="text-xs text-gray-500 mt-1 sm:hidden">
                        {venue.city}, {venue.state}
                      </div>
                    </td>
                    <td className="p-3 text-sm hidden sm:table-cell">{venue.city}</td>
                    <td className="p-3 text-sm hidden md:table-cell">{venue.state}</td>
                    <td className="p-3">
                      <select
                        value={venue.status}
                        onChange={(e) => onStatusChange(venue.id, e.target.value as Venue['status'])}
                        className={`border-2 border-black px-2 py-1 text-xs font-bold ${getStatusColor(venue.status)} cursor-pointer w-full sm:w-auto`}
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <button
                        onClick={() => {
                          const nextPriority = venue.priority === 3 ? 1 : venue.priority + 1
                          onPriorityChange(venue.id, nextPriority)
                        }}
                        className={`px-2 py-1 text-xs font-bold border-2 border-black ${priorityOption.color} ${priorityOption.textColor}`}
                      >
                        {priorityOption.label}
                      </button>
                    </td>
                    <td className="p-3 text-sm hidden lg:table-cell">
                      {venue.contact_attempts > 0 ? (
                        <span className="font-mono">{venue.contact_attempts}x</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                      {formatDate(venue.last_contact_at)}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button
                          onClick={() => onSendEmail(venue)}
                          className="px-2 py-1.5 text-xs border-2 border-black hover:bg-black hover:text-white transition-colors text-left"
                          title="Send Email"
                        >
                          <span className="inline sm:hidden">✉️ Email</span>
                          <span className="hidden sm:inline">✉️</span>
                        </button>
                        <button
                          onClick={() => onEditNotes(venue)}
                          className="px-2 py-1.5 text-xs border-2 border-black hover:bg-black hover:text-white transition-colors text-left"
                          title="Edit Notes"
                        >
                          <span className="inline sm:hidden">📝 Notes</span>
                          <span className="hidden sm:inline">📝</span>
                        </button>
                        <button
                          onClick={() => onArchive(venue.id)}
                          className="px-2 py-1.5 text-xs border-2 border-black hover:bg-yellow-100 transition-colors text-left"
                          title="Archive"
                        >
                          <span className="inline sm:hidden">📦 Archive</span>
                          <span className="hidden sm:inline">📦</span>
                        </button>
                        <button
                          onClick={() => onDelete(venue.id)}
                          className="px-2 py-1.5 text-xs border-2 border-black hover:bg-red-100 transition-colors text-left"
                          title="Delete"
                        >
                          <span className="inline sm:hidden">🗑️ Delete</span>
                          <span className="hidden sm:inline">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600">
        Showing {sortedVenues.length} of {venues.length} venues
      </div>
    </div>
  )
}
