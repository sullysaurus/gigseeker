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
      .select('subscription_tier, display_name, booking_email')
      .eq('user_id', user.id)
      .single()

    // Check subscription tier - only Pro/Agency can send emails
    if (!profile || !['pro', 'agency'].includes(profile.subscription_tier)) {
      return NextResponse.json({
        error: 'Email sending requires Pro or Agency subscription',
        requiresUpgrade: true
      }, { status: 402 })
    }

    // Send email via Resend
    const fromEmail = process.env.FROM_EMAIL || 'bookings@booking.gigseeker.pro'
    const replyToEmail = profile.booking_email || user.email

    // Convert plain text to HTML with clickable links for tracking
    const htmlBody = body
      .split('\n')
      .map((line: string) => line.trim())
      .map((line: string) => {
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g
        return line.replace(urlRegex, '<a href="$1">$1</a>')
      })
      .map((line: string) => line ? `<p>${line}</p>` : '<br>')
      .join('\n')

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: pipelineVenue.venues.email,
      replyTo: replyToEmail,
      subject,
      html: htmlBody,  // HTML for click tracking
      text: body,      // Plain text fallback
      tags: [
        { name: 'pipeline_venue_id', value: pipelineVenueId },
      ],
    })

    if (emailError || !emailData) {
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
    const { data: campaign } = await supabase.from('email_campaigns').insert({
      user_id: user.id,
      pipeline_venue_id: pipelineVenueId,
      venue_id: pipelineVenue.venue_id,
      subject,
      body_text: body,
      recipient_email: pipelineVenue.venues.email,
      status: 'sent',
    }).select().single()

    // Record email usage (for Pro tier tracking)
    await supabase.rpc('record_email_send', {
      p_user_id: user.id,
      p_email_campaign_id: campaign?.id,
      p_venue_id: pipelineVenue.venue_id,
      p_recipient_email: pipelineVenue.venues.email,
      p_subject: subject,
      p_metadata: { resend_email_id: emailData.id }
    })

    return NextResponse.json({
      success: true,
      subscriptionTier: profile.subscription_tier,
    })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
