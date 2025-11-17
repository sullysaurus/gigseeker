import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch archived and declined venues
    const { data: pipelineVenues, error } = await supabase
      .from('pipeline_venues')
      .select(`
        id,
        venue_id,
        status,
        notes,
        contact_attempts,
        last_contact_at,
        created_at,
        updated_at,
        venues (
          id,
          name,
          email,
          city,
          state,
          music_focus
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['archived', 'declined'])
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Fetch history error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map to frontend format
    const mappedVenues = (pipelineVenues || []).map((pv) => {
      // Handle venues as either single object or array
      const venue = Array.isArray(pv.venues) ? pv.venues[0] : pv.venues

      return {
        id: pv.venue_id,
        pipeline_venue_id: pv.id,
        name: venue?.name || '',
        city: venue?.city || '',
        state: venue?.state || '',
        email: venue?.email || '',
        genres: venue?.music_focus || [],
        status: pv.status,
        notes: pv.notes || '',
        contact_attempts: pv.contact_attempts || 0,
        last_contact_at: pv.last_contact_at,
        created_at: pv.created_at,
        archived_at: pv.updated_at,
      }
    })

    return NextResponse.json({ venues: mappedVenues })
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
