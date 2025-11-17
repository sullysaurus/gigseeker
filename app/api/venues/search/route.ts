import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { query, city, state, genres, limit = 20, offset = 0 } = await request.json()

    const supabase = await createClient()

    let dbQuery = supabase
      .from('venues')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })

    // Full-text search
    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Filter by city
    if (city) {
      dbQuery = dbQuery.ilike('city', `%${city}%`)
    }

    // Filter by state
    if (state) {
      dbQuery = dbQuery.eq('state', state)
    }

    // Filter by genres
    if (genres && genres.length > 0) {
      dbQuery = dbQuery.overlaps('music_focus', genres)
    }

    // Pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1)

    const { data: venues, count, error } = await dbQuery

    if (error) {
      console.error('Venue search error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to match frontend interface
    const mappedVenues = (venues || []).map(venue => ({
      ...venue,
      genres: venue.music_focus || [],
    }))

    return NextResponse.json({
      venues: mappedVenues,
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Venue search error:', error)
    return NextResponse.json(
      { error: 'Failed to search venues' },
      { status: 500 }
    )
  }
}
