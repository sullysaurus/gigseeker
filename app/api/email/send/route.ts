import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { recipientEmail, subject, body } = await request.json()

    if (!recipientEmail || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientEmail, subject, body' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription tier - must be Pro or Agency
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, display_name, booking_email')
      .eq('user_id', user.id)
      .single()

    if (!profile || !['pro', 'agency'].includes(profile.subscription_tier)) {
      return NextResponse.json({
        error: 'Email sending requires Pro or Agency subscription',
        requiresUpgrade: true
      }, { status: 402 })
    }

    // Send email via Resend
    const fromEmail = process.env.FROM_EMAIL || 'bookings@gigseeker.app'
    const replyToEmail = profile.booking_email || user.email

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: replyToEmail,
      subject: subject,
      text: body,
    })

    if (emailError || !emailData) {
      return NextResponse.json(
        { error: emailError?.message || 'Failed to send email' },
        { status: 500 }
      )
    }

    // Record email usage
    await supabase.rpc('record_email_send', {
      p_user_id: user.id,
      p_email_campaign_id: null,
      p_venue_id: null,
      p_recipient_email: recipientEmail,
      p_subject: subject,
      p_metadata: {
        resend_email_id: emailData.id,
        blank_email: true
      }
    })

    return NextResponse.json({
      success: true,
      emailId: emailData.id
    })
  } catch (error: any) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
