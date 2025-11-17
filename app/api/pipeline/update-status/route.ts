import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { pipelineVenueId, status, priority, notes } = await request.json()

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build update object based on provided fields
    const updates: any = {}
    if (status !== undefined) updates.status = status
    if (priority !== undefined) updates.priority = priority
    if (notes !== undefined) updates.notes = notes

    // Update pipeline venue
    const { data, error } = await supabase
      .from('pipeline_venues')
      .update(updates)
      .eq('id', pipelineVenueId)
      .eq('user_id', user.id) // Ensure user owns this pipeline venue
      .select()
      .single()

    if (error) {
      console.error('Update pipeline venue error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update pipeline venue error:', error)
    return NextResponse.json(
      { error: 'Failed to update pipeline venue' },
      { status: 500 }
    )
  }
}
