import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  try {
    const { pipelineVenueId, subject, body } = await request.json()

    const supabase = await createClient()

    // Get current user (simplified - in production use proper auth)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pipeline venue and user profile
    const { data: pipelineVenue, error: venueError } = await supabase
      .from('pipeline_venues')
      .select('*, venues(*)')
      .eq('id', pipelineVenueId)
      .eq('user_id', user.id) // Ensure user owns this pipeline venue
      .single()

    if (venueError || !pipelineVenue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_balance, display_name, booking_email')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.credits_balance < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Deduct 1 credit
    const { data: deductResult, error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: 1,
      p_transaction_type: 'email_sent',
      p_description: `Email sent to ${pipelineVenue.venues.name}`,
      p_metadata: { pipeline_venue_id: pipelineVenueId },
    })

    if (deductError || !deductResult) {
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 })
    }

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${profile.display_name || 'Gigseeker User'} <onboarding@resend.dev>`,
      to: pipelineVenue.venues.email,
      subject,
      text: body,
      tags: [
        { name: 'pipeline_venue_id', value: pipelineVenueId },
      ],
    })

    if (emailError || !emailData) {
      // Refund credit on failure
      await supabase.rpc('add_credits', {
        p_user_id: user.id,
        p_amount: 1,
        p_transaction_type: 'refund',
        p_description: 'Refund for failed email',
      })

      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Update pipeline venue status
    await supabase
      .from('pipeline_venues')
      .update({
        status: 'contacted',
        contact_attempts: (pipelineVenue.contact_attempts || 0) + 1,
        last_contact_at: new Date().toISOString(),
      })
      .eq('id', pipelineVenueId)

    // Create email campaign record
    await supabase.from('email_campaigns').insert({
      user_id: user.id,
      pipeline_venue_id: pipelineVenueId,
      venue_id: pipelineVenue.venue_id,
      subject,
      body_text: body,
      recipient_email: pipelineVenue.venues.email,
      resend_email_id: emailData.id,
      status: 'sent',
    })

    return NextResponse.json({
      success: true,
      creditsRemaining: profile.credits_balance - 1,
    })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
