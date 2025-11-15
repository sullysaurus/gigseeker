import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { query, city, state, genres, limit = 20, offset = 0 } = await request.json()

    const supabase = createSupabaseServerClient()

    let dbQuery = supabase
      .from('venues')
      .select('*', { count: 'exact' })
      .order('venue_score', { ascending: false })

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

    return NextResponse.json({
      venues: venues || [],
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
