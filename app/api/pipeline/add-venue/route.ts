import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { pipelineId, venueId, priority = 2 } = await request.json()

    const supabase = createSupabaseServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for duplicates
    const { data: existing } = await supabase
      .from('pipeline_venues')
      .select('id')
      .eq('pipeline_id', pipelineId)
      .eq('venue_id', venueId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Venue already in pipeline' },
        { status: 409 }
      )
    }

    // Add venue to pipeline
    const { data: pipelineVenue, error } = await supabase
      .from('pipeline_venues')
      .insert({
        pipeline_id: pipelineId,
        venue_id: venueId,
        status: 'discovered',
        priority,
      })
      .select('*, venues(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ venue: pipelineVenue })
  } catch (error) {
    console.error('Add venue error:', error)
    return NextResponse.json(
      { error: 'Failed to add venue' },
      { status: 500 }
    )
  }
}
