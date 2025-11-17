import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { pipelineVenueId } = await request.json()

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Restore to 'discovered' status
    const { data, error } = await supabase
      .from('pipeline_venues')
      .update({ status: 'discovered' })
      .eq('id', pipelineVenueId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Restore error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Restore error:', error)
    return NextResponse.json(
      { error: 'Failed to restore venue' },
      { status: 500 }
    )
  }
}
