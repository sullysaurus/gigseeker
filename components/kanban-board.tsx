'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import toast from 'react-hot-toast'

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
  onArchive: (venueId: string, type: 'archived' | 'declined') => void
  onDelete: (venueId: string) => void
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

function DraggableVenueCard({
  venue,
  onSendEmail,
  onStatusChange,
  onArchive,
  onDelete,
}: {
  venue: Venue
  onSendEmail: (venue: Venue) => void
  onStatusChange: (venueId: string, newStatus: PipelineStatus) => void
  onArchive: (venueId: string, type: 'archived' | 'declined') => void
  onDelete: (venueId: string) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: venue.id,
    data: {
      venue,
      currentStatus: venue.status,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`border-2 border-black p-3 ${
          PRIORITY_COLORS[venue.priority as keyof typeof PRIORITY_COLORS]
        } cursor-grab active:cursor-grabbing hover:shadow-brutalist transition-all`}
      >
        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="absolute top-2 right-2 text-lg font-black hover:bg-black hover:text-white px-2 border border-black"
          {...{}} // Remove drag attributes from this button
        >
          ⋮
        </button>

        <div className="font-bold text-sm mb-1 pr-6">{venue.name}</div>
        <div className="text-xs text-gray-700 mb-2">
          {venue.city}, {venue.state}
        </div>
        <div className="flex gap-1 flex-wrap mb-2">
          {venue.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="text-xs border border-black px-1">
              {genre}
            </span>
          ))}
          {venue.genres.length > 2 && (
            <span className="text-xs">+{venue.genres.length - 2}</span>
          )}
        </div>
        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          {venue.status === 'approved' && (
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
          {venue.status === 'opened' && (
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
          {venue.status === 'discovered' && (
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

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-12 z-20 bg-white border-2 border-black shadow-brutalist min-w-[150px]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onArchive(venue.id, 'archived')
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-accent-blue font-bold text-sm border-b border-black"
            >
              📦 ARCHIVE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onArchive(venue.id, 'declined')
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-accent-pink hover:text-white font-bold text-sm border-b border-black"
            >
              ❌ DECLINE
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Permanently delete this venue from your pipeline?')) {
                  onDelete(venue.id)
                }
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white font-bold text-sm"
            >
              🗑️ DELETE
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function DroppableColumn({
  column,
  venues,
  onSendEmail,
  onStatusChange,
  onArchive,
  onDelete,
}: {
  column: { id: PipelineStatus; title: string; description: string }
  venues: Venue[]
  onSendEmail: (venue: Venue) => void
  onStatusChange: (venueId: string, newStatus: PipelineStatus) => void
  onArchive: (venueId: string, type: 'archived' | 'declined') => void
  onDelete: (venueId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`border-brutalist p-4 min-h-[400px] transition-all ${
        isOver ? 'bg-accent-yellow shadow-brutalist-lg' : 'bg-white'
      }`}
    >
      <div className="mb-4">
        <h2 className="font-black text-lg">{column.title}</h2>
        <p className="text-xs text-gray-600">{column.description}</p>
        <div className="text-xs font-mono mt-1">{venues.length} venues</div>
      </div>

      <div className="space-y-3">
        {venues.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            {isOver ? '🎯 Drop here!' : 'Drop venues here'}
          </div>
        ) : (
          venues.map((venue) => (
            <DraggableVenueCard
              key={venue.id}
              venue={venue}
              onSendEmail={onSendEmail}
              onStatusChange={onStatusChange}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export function KanbanBoard({ venues, onStatusChange, onSendEmail, onArchive, onDelete }: KanbanBoardProps) {
  const [activeVenue, setActiveVenue] = useState<Venue | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getVenuesByStatus = (status: PipelineStatus) => {
    return venues.filter((v) => v.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const venue = venues.find((v) => v.id === active.id)
    setActiveVenue(venue || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveVenue(null)

    if (!over) return

    const activeVenue = venues.find((v) => v.id === active.id)
    if (!activeVenue) return

    // Check if dropped over a venue (get the column from the venue's status)
    const overVenue = venues.find((v) => v.id === over.id)
    const targetStatus = overVenue?.status || (over.id as PipelineStatus)

    // Only update if status changed
    if (activeVenue.status !== targetStatus) {
      const columnName = COLUMNS.find((c) => c.id === targetStatus)?.title || targetStatus
      toast.success(`Moved to ${columnName}`, {
        icon: '🎯',
      })
      onStatusChange(activeVenue.id, targetStatus)
    }
  }

  const handleDragCancel = () => {
    setActiveVenue(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            id={column.id}
            data-status={column.id}
            className="relative"
          >
            <DroppableColumn
              column={column}
              venues={getVenuesByStatus(column.id)}
              onSendEmail={onSendEmail}
              onStatusChange={onStatusChange}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeVenue ? (
          <div className="border-2 border-black p-3 bg-accent-yellow shadow-brutalist-lg rotate-3 opacity-90">
            <div className="font-bold text-sm mb-1">{activeVenue.name}</div>
            <div className="text-xs text-gray-700">
              {activeVenue.city}, {activeVenue.state}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
