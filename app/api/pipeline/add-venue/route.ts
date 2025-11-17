import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { pipelineId: providedPipelineId, venueId, priority = 2 } = await request.json()

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pipelineId - use provided or find default
    let pipelineId = providedPipelineId
    if (!pipelineId) {
      const { data: pipeline } = await supabase
        .from('pipelines')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single()

      if (!pipeline) {
        return NextResponse.json(
          { error: 'No default pipeline found. Please create a pipeline first.' },
          { status: 404 }
        )
      }

      pipelineId = pipeline.id
    }

    // Check if user can add more venues to pipeline
    const { data: canAdd, error: limitError } = await supabase.rpc('can_add_venue_to_pipeline', {
      p_user_id: user.id
    })

    if (limitError) {
      console.error('Error checking venue limit:', limitError)
    }

    if (canAdd === false) {
      // Get current count and limit for error message
      const { data: venueCount } = await supabase.rpc('get_pipeline_venue_count', {
        p_user_id: user.id
      })
      const { data: profile } = await supabase
        .from('profiles')
        .select('max_pipeline_venues, subscription_tier')
        .eq('user_id', user.id)
        .single()

      return NextResponse.json({
        error: `Venue limit reached (${venueCount}/${profile?.max_pipeline_venues || 20}). Upgrade to Pro for unlimited venues.`,
        requiresUpgrade: true,
        currentCount: venueCount,
        maxCount: profile?.max_pipeline_venues,
        subscriptionTier: profile?.subscription_tier
      }, { status: 402 })
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
        user_id: user.id,
        status: 'discovered',
        priority,
      })
      .select('*, venues(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map database fields to match frontend interface
    const mappedPipelineVenue = pipelineVenue ? {
      ...pipelineVenue,
      venues: pipelineVenue.venues ? {
        ...pipelineVenue.venues,
        genres: pipelineVenue.venues.music_focus || [],
      } : null,
    } : null

    return NextResponse.json({ venue: mappedPipelineVenue })
  } catch (error) {
    console.error('Add venue error:', error)
    return NextResponse.json(
      { error: 'Failed to add venue' },
      { status: 500 }
    )
  }
}
