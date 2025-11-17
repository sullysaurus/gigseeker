import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's default pipeline
    const { data: pipeline } = await supabase
      .from('pipelines')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single()

    if (!pipeline) {
      return NextResponse.json({ venues: [] })
    }

    // Fetch pipeline venues with venue details
    const { data: pipelineVenues, error } = await supabase
      .from('pipeline_venues')
      .select(`
        id,
        venue_id,
        status,
        priority,
        contact_attempts,
        last_contact_at,
        email_opened_at,
        notes,
        created_at,
        updated_at,
        venues (
          id,
          name,
          email,
          phone,
          website,
          city,
          state,
          description,
          music_focus
        )
      `)
      .eq('pipeline_id', pipeline.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch pipeline venues error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to match frontend interface
    const mappedVenues = (pipelineVenues || []).map(pv => {
      // Handle venues as either single object or array
      const venue = Array.isArray(pv.venues) ? pv.venues[0] : pv.venues

      return {
        id: pv.venue_id,
        name: venue?.name || '',
        city: venue?.city || '',
        state: venue?.state || '',
        email: venue?.email || '',
        website: venue?.website,
        description: venue?.description,
        genres: venue?.music_focus || [],
        status: pv.status,
        priority: pv.priority,
        contact_attempts: pv.contact_attempts,
        last_contact_at: pv.last_contact_at,
        email_opened_at: pv.email_opened_at,
        notes: pv.notes,
        pipeline_venue_id: pv.id,
      }
    })

    return NextResponse.json({ venues: mappedVenues })
  } catch (error) {
    console.error('Fetch pipeline venues error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline venues' },
      { status: 500 }
    )
  }
}
